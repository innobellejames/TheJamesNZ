// Destination and optional provider credentials stay in server secrets.
export type IssueMailConfig = {RESEND_API_KEY?: string; ISSUE_REPORT_FROM?: string; ISSUE_REPORT_TO?: string};
export async function forwardIssue(config: IssueMailConfig, report: {id:string;name:string;message:string}, url:string) {
  if (!config.ISSUE_REPORT_TO) return {emailed:false, delivery:'pending', message:'Your report is saved privately. Email forwarding needs the owner’s private destination setting.'};
  try {
    if (config.RESEND_API_KEY && config.ISSUE_REPORT_FROM) {
      const response = await fetch('https://api.resend.com/emails', {method:'POST', headers:{Authorization:`Bearer ${config.RESEND_API_KEY}`,'Content-Type':'application/json','Idempotency-Key':`issue-${report.id}`},body:JSON.stringify({from:config.ISSUE_REPORT_FROM,to:[config.ISSUE_REPORT_TO],subject:'The James NZ: new issue report',text:`Report: ${report.id}\nFrom: ${report.name}\n\n${report.message}`}),signal:AbortSignal.timeout(12000)});
      if (!response.ok) throw Error('provider rejected');
      return {emailed:true,delivery:'accepted',message:'Your report was saved privately and accepted for email delivery.'};
    }
    // FormSubmit sends an activation email on first use. Its success response
    // acknowledges submission; it does not prove activation or inbox delivery.
    const response = await fetch('https://formsubmit.co/ajax/'+encodeURIComponent(config.ISSUE_REPORT_TO),{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json',Referer:url},body:JSON.stringify({name:report.name,message:report.message,report_id:report.id,_subject:'The James NZ: new issue report',_url:url,_captcha:'false',_template:'table'}),signal:AbortSignal.timeout(12000)});
    const result = await response.json() as {success?:boolean|string};
    if (!response.ok || !(result.success===true || result.success==='true')) throw Error('forwarding unavailable');
    return {emailed:false,delivery:'submitted',message:'Your report was saved privately and submitted to email forwarding. First-time delivery requires the owner to confirm the activation email; inbox delivery is not yet verified.'};
  } catch {
    return {emailed:false,delivery:'pending',message:'Your report is saved privately. Email forwarding is unavailable; the owner can retry it from the private issue inbox.'};
  }
}
