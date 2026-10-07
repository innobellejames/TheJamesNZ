import {env} from 'cloudflare:workers';
import {storage} from '../../../db/storage';
import {getChatGPTUser} from '../../chatgpt-auth';
import {isEditor} from '../../permissions';
import {forwardIssue} from '../../../lib/issue-mail';

export const dynamic = 'force-dynamic';
const mailConfig = () => env as unknown as {RESEND_API_KEY?: string; ISSUE_REPORT_FROM?: string; ISSUE_REPORT_TO?: string};

async function prepareFeedback() {
  const db = storage();
  return db;
}

export async function GET(request: Request) {
  const kind = new URL(request.url).searchParams.get('kind') === 'issue' ? 'issue' : 'review';
  if (kind === 'issue' && !(await isEditor())) return Response.json({error: 'Issue reports are only visible to the site owner.'}, {status: 403});
  try {
    const db = await prepareFeedback();
    const rows = await db.prepare('SELECT f.id,f.name,f.message,f.rating,f.created,d.status AS delivery FROM feedback f LEFT JOIN feedback_delivery d ON d.feedback_id=f.id WHERE f.kind = ? ORDER BY f.created DESC LIMIT 50').bind(kind).all();
    return Response.json({items: rows.results, ...(kind==='issue'?{mailNotice:mailConfig().RESEND_API_KEY?'Email requests use the configured mail service.':'Forwarding uses FormSubmit. Check your private mailbox and spam folder for its activation email and confirm it once. Accepted submissions do not prove inbox delivery.'}:{})}, {headers: {'Cache-Control': 'no-store'}});
  } catch {
    return Response.json({error: 'Feedback could not load. Please try again.'}, {status: 503});
  }
}

export async function POST(request: Request) {
  const origin = request.headers.get('origin');
  if ((origin && origin !== new URL(request.url).origin) || request.headers.get('sec-fetch-site') === 'cross-site') return Response.json({error: 'Request not allowed.'}, {status: 403});
  if (Number(request.headers.get('content-length') || 0) > 20000) return Response.json({error: 'Your message is too long.'}, {status: 413});
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return Response.json({error: 'Please submit a valid feedback form.'}, {status: 400}); }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return Response.json({error: 'Please submit a valid feedback form.'}, {status: 400});
  if (body.operation === 'retry-issue') {
    if (!(await isEditor())) return Response.json({error:'Only the owner can retry email forwarding.'},{status:403});
    if (typeof body.id !== 'string' || body.id.length > 100) return Response.json({error:'Choose a saved report.'},{status:400});
    try {
    const db = await prepareFeedback();
    const report = await db.prepare("SELECT id,name,message FROM feedback WHERE id=? AND kind='issue'").bind(body.id).first<{id:string;name:string;message:string}>();
    if (!report) return Response.json({error:'Report not found.'},{status:404});
    const previous = await db.prepare('SELECT status,updated FROM feedback_delivery WHERE feedback_id=? ORDER BY updated DESC LIMIT 1').bind(body.id).first<{status:string;updated:number}>();
    if (previous?.status === 'accepted') return Response.json({saved:true,emailed:true,delivery:'accepted',message:'This report has already been accepted by the mail service.'});
    if (previous?.status === 'submitted') return Response.json({saved:true,emailed:false,delivery:'submitted',message:'The forwarding service already has this report. Confirm the activation email once; resending may create duplicates.'});
    if (previous && Date.now()-previous.updated < 60000) return Response.json({error:'Please wait one minute before retrying this report.'},{status:429});
    const result = await forwardIssue(mailConfig(),report,new URL(request.url).origin+'/family-update/');
    await db.prepare('INSERT INTO feedback_delivery(feedback_id,status,updated) VALUES(?,?,?) ON CONFLICT(feedback_id) DO UPDATE SET status=excluded.status,updated=excluded.updated').bind(report.id,result.delivery,Date.now()).run();
    return Response.json({saved:true,...result});
    } catch { return Response.json({error:'The saved report could not be retried. Please try again shortly.'},{status:503}); }
  }
  const {kind, name, message, rating} = body;
  if (!['issue', 'review'].includes(String(kind)) || typeof message !== 'string' || message.trim().length < 5 || message.length > 4000 || typeof name !== 'string' || name.length > 100 || (kind === 'review' && (!Number.isInteger(rating) || Number(rating) < 1 || Number(rating) > 5))) return Response.json({error: 'Add a message of 5–4,000 characters and a rating from 1 to 5 for reviews.'}, {status: 400});
  const user = await getChatGPTUser();
  if (kind === 'review' && !user) return Response.json({error: 'Please sign in before submitting a review.'}, {status: 401});
  let db: D1Database;
  const id = crypto.randomUUID();
  try {
    db = await prepareFeedback();
    const now = Date.now();
    const identity = user?.userId || request.headers.get('cf-connecting-ip') || 'anonymous';
    const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(identity));
    const hash = Array.from(new Uint8Array(digest), b => b.toString(16).padStart(2, '0')).join('');
    const bucket = `${hash}:${Math.floor(now / 600000)}`;
    const quota = await db.prepare('INSERT INTO feedback_rate (bucket,count,expires) VALUES (?,1,?) ON CONFLICT(bucket) DO UPDATE SET count=count+1 RETURNING count').bind(bucket, now + 1200000).first<{count: number}>();
    if (!quota || quota.count > 5) return Response.json({error: 'Please wait a few minutes before sending another report.'}, {status: 429, headers: {'Retry-After': '600'}});
    await db.prepare('DELETE FROM feedback_rate WHERE expires < ?').bind(now).run();
    await db.prepare('INSERT INTO feedback (id,kind,name,message,rating,created) VALUES (?,?,?,?,?,?)').bind(id, kind, name.trim() || 'Community member', message.trim(), kind === 'review' ? rating : null, now).run();
  } catch {
    return Response.json({error: 'Your feedback could not be saved. Your message is still here; please try again.'}, {status: 503});
  }
  if (kind === 'review') return Response.json({id, saved: true});

  const result = await forwardIssue(mailConfig(),{id,name:name.trim()||'Community member',message:message.trim()},new URL(request.url).origin+'/family-update/');
  try {
    await db.prepare('INSERT INTO feedback_delivery (feedback_id,status,updated) VALUES (?,?,?)').bind(id,result.delivery,Date.now()).run();
  } catch { /* A saved report remains available even if delivery status cannot be recorded. */ }
  return Response.json({id,saved:true,...result});
}
