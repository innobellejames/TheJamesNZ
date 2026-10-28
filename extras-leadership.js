/* The James NZ — Learning › Leadership: Essential Leadership & Assertive Skills
   (original self-paced course), 30-question assessment and a downloadable
   learning completion record (PDF/PNG) made on the learner's own device.
   October 2026. Original material. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef, useMemo = R.useMemo;
  var CONTENT_VERSION = '2026-10-24';
  var TOPIC = 'Essential Leadership & Assertive Skills';
  var PASS = 26, TOTAL = 30;

  function ul(a) { return h('ul', null, a.map(function (x, i) { return h('li', { key: i }, x); })); }
  function scripts(a) { return h('div', { className: 'jx-scripts' }, a.map(function (x, i) { return h('blockquote', { key: i }, x); })); }

  var MODULES = [
    { id: 'm1', title: '1 · Assertiveness and personal impact', time: '10 min', body: function () { return h('div', null,
      h('p', null, 'Assertiveness is expressing your needs, opinions and feelings honestly and directly, while respecting the rights and feelings of others. It is not about winning; it is about being clear and fair so that better decisions can be made together.'),
      h('p', null, 'Personal impact is the effect your words, actions and presence have on how others think, feel and act. Two people can say the same sentence and have very different impact because of their timing, tone, body language and the trust they have built.'),
      h('h4', null, 'Your rights — and everyone else’s'), ul(['To have and express your own opinions and feelings.', 'To ask for what you need (and to accept that others may say no).', 'To say no without feeling guilty, and to change your mind.', 'To make mistakes and learn from them.', 'To be treated with respect — and the responsibility to treat others the same way.']),
      h('h4', null, 'Common myths'), ul(['“Assertive means aggressive.” — No. Aggression ignores others’ rights; assertiveness respects them.', '“Assertive people always get their way.” — No. They state their position clearly and stay open to a fair outcome.', '“Being nice means agreeing.” — Agreement you do not mean leads to resentment and poor decisions.']),
      h('div', { className: 'jx-note' }, h('strong', null, 'Try it: '), 'Think of one situation this month where you stayed quiet but wish you had spoken. What did you want to say? Keep it in mind as you work through the modules.')); } },
    { id: 'm2', title: '2 · Recognising communication styles', time: '15 min', body: function () { return h('div', null,
      h('p', null, 'Most of us use different styles in different situations. Recognising them — in ourselves and others — is the first step to choosing a more effective response.'),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, ['Style', 'What it sounds and looks like', 'Underlying belief', 'Impact on others', 'Impact on you'].map(function (x) { return h('th', { key: x }, x); }))), h('tbody', null, [
        ['Passive', '“Whatever you think.” Soft voice, little eye contact, apologising, avoiding conflict.', 'Your needs matter more than mine.', 'Frustration; they may not know what you really need.', 'Stress, resentment, feeling overlooked.'],
        ['Aggressive', '“That’s ridiculous.” Interrupting, blaming, loud or cold tone, invading space.', 'My needs matter more than yours.', 'Fear, defensiveness, less honest input.', 'Short-term control, long-term damaged trust.'],
        ['Passive-aggressive', 'Agrees in the meeting, complains later. Sarcasm, silent treatment, “forgetting”.', 'I can’t say it directly, so I’ll show it another way.', 'Confusion and mistrust.', 'Problems stay unresolved.'],
        ['Assertive', '“I see it differently — here’s why. What do you think?” Steady voice, open posture, listening.', 'We both matter.', 'Respect, clarity, room to solve problems.', 'Confidence, self-respect, less stress.']
      ].map(function (r) { return h('tr', { key: r[0] }, r.map(function (c, i) { return h('td', { key: i }, i === 0 ? h('strong', null, c) : c); })); })))),
      h('div', { className: 'jx-note' }, h('strong', null, 'Try it: '), 'For a week, notice which style you use with your manager, your team, your family and customers. Where do you slip into passive or aggressive patterns, and what triggers it?')); } },
    { id: 'm3', title: '3 · The 3 Cs: Confidence, Clarity and Control', time: '15 min', body: function () { return h('div', null,
      h('h4', null, 'Confidence'), ul(['Prepare your key message in one or two sentences before an important conversation.', 'Replace unhelpful self-talk (“They’ll think I’m difficult”) with balanced self-talk (“I have a useful view and I can share it respectfully”).', 'Start small: practise assertive requests in low-stakes situations first.']),
      h('h4', null, 'Clarity'), ul(['Say what you want, not only what you don’t want.', 'Be specific: what, who, by when, and why it matters.', 'Use plain words. Short sentences land better under pressure.']),
      scripts(['Unclear: “It would be good if the reports were a bit quicker.”', 'Clear: “Could you send the weekly report by 10 am each Monday? I need it to prepare for the 11 am leadership meeting.”']),
      h('h4', null, 'Control'), ul(['Name the emotion to yourself (“I’m feeling defensive”). Labelling a feeling helps reduce its intensity — “name it to tame it”.', 'Slow your breathing: in for 4, hold for 4, out for 4, hold for 4.', 'Pause before replying. Silence for two seconds is fine.', 'Keep the outcome in mind: “What do I want to happen after this conversation?”', 'If emotions are too high, agree to continue later — and set a time.']),
      h('div', { className: 'jx-note' }, h('strong', null, 'Try it: '), 'Write the one-sentence key message for the situation you chose in Module 1. Then make it more specific.')); } },
    { id: 'm4', title: '4 · Non-verbal, email and online communication', time: '15 min', body: function () { return h('div', null,
      h('p', null, 'People judge our message through our tone, face, posture and timing as much as our words. Online, they also judge our formatting and response time.'),
      h('h4', null, 'In person and on video'), ul(['Posture: upright and relaxed, shoulders down, hands visible and still.', 'Voice: steady pace, moderate volume, lower pitch at the end of a statement (not rising like a question).', 'Eye contact: comfortable and natural — not staring.', 'Space: respect personal space; sit at an angle rather than directly opposite in difficult conversations.', 'On video: camera at eye level, look at the lens when making key points, mute distractions.']),
      h('div', { className: 'jx-note warn' }, h('strong', null, 'Culture matters: '), 'Non-verbal norms differ. In some Māori, Pasifika and Asian contexts, lowering the eyes or speaking softly can show respect rather than a lack of confidence. Avoid judging someone on a single cue, learn the norms of the people you work with, and ask if you are unsure.'),
      h('h4', null, 'Email and messages'), ul(['Put the key point or request first (“Bottom line up front”).', 'Use a subject line that says what is needed: “Approval needed by Fri: venue booking”.', 'Read it again as the receiver would. Remove sarcasm, ALL CAPITALS and multiple exclamation marks.', 'For sensitive or complex issues, talk first and follow up in writing.', 'Respect time: avoid sending non-urgent messages late at night or say “no need to reply until Monday”.']),
      h('div', { className: 'jx-note' }, h('strong', null, 'Try it: '), 'Paste a recent email into Ask Mateo’s writing check in Email or Business style and see what it suggests.')); } },
    { id: 'm5', title: '5 · Practical assertive techniques', time: '20 min', body: function () { return h('div', null,
      h('h4', null, 'I-statements'), h('p', null, 'Describe the behaviour, your feeling and the effect, without blaming.'), scripts(['“I feel worried when reports arrive after Monday because I can’t check them before the board meets.”']),
      h('h4', null, 'The DESC script'), ul(['Describe the situation objectively.', 'Express how it affects you or the work.', 'Specify what you would like to happen.', 'Consequences: explain the positive outcome of the change.']),
      scripts(['“The last three rosters were finalised on Friday afternoon (D). That makes it hard for staff with children to arrange care (E). Could we lock the roster by Wednesday? (S) People will be able to plan, and we should have fewer last-minute swaps (C).”']),
      h('h4', null, 'Broken record'), h('p', null, 'Calmly repeat your key message, without being drawn into side arguments.'), scripts(['“I understand it’s busy. I still need the signed form before I can release the payment.”']),
      h('h4', null, 'Fogging'), h('p', null, 'Calmly acknowledge any truth in a criticism without getting defensive or agreeing to everything.'), scripts(['“You may be right that I was late to the last two meetings.”']),
      h('h4', null, 'Negative assertion and negative inquiry'), h('p', null, 'Accept a valid criticism (“Yes, I made a mistake in that report”), or ask for specifics to understand vague criticism (“What was it about my presentation that didn’t work for you?”).'),
      h('h4', null, 'Saying no'), ul(['Acknowledge the request.', 'Say no clearly — a reason is optional and should be short.', 'Offer an alternative if you genuinely can.']), scripts(['“Thanks for thinking of me. I can’t take that on this week because of the audit. I could help next Tuesday.”']),
      h('h4', null, 'Workable compromise'), h('p', null, 'Look for a solution that meets the key needs of both people without either losing self-respect.'),
      h('h4', null, 'Giving feedback: Situation – Behaviour – Impact'), scripts(['“In this morning’s client call (S), you explained the timeline step by step (B). The client said it was the first time it made sense to them (I). Thank you.”', '“In yesterday’s meeting (S), you spoke over Hine twice (B). She didn’t get to finish her point and we missed useful information (I). Can we talk about how to make space for everyone?”']),
      h('div', { className: 'jx-note' }, h('strong', null, 'Try it: '), 'Write a DESC script for your situation from Module 1. Practise it aloud.')); } },
    { id: 'm6', title: '6 · Essential leadership skills', time: '20 min', body: function () { return h('div', null,
      h('h4', null, 'Listen first'), ul(['Listen to understand, not to reply.', 'Reflect back: “So the main concern is the deadline, not the budget — have I got that right?”', 'Ask open questions: “What would a good outcome look like for you?”']),
      h('h4', null, 'Coach with GROW'), ul(['Goal — What do you want to achieve?', 'Reality — What is happening now? What have you tried?', 'Options — What could you do? What else?', 'Way forward — What will you do, by when, and what support do you need?']),
      h('h4', null, 'Delegate well'), ul(['Agree the outcome, not just the task.', 'Be clear about authority: decide and tell me, recommend, or decide and act.', 'Provide resources, a deadline and check-in points.', 'Recognise the work when it is done.']),
      h('h4', null, 'Build trust and psychological safety'), ul(['Do what you say you will do, and say so when you cannot.', 'Admit your own mistakes — it gives others permission to speak up.', 'Thank people for raising concerns, even uncomfortable ones.', 'Psychological safety means people feel safe to ask questions, offer ideas and admit mistakes without fear of humiliation.']),
      h('h4', null, 'Handle conflict'), ul(['Separate the people from the problem.', 'Focus on interests (underlying needs), not positions (stated demands).', 'Generate options together before deciding.', 'Agree on fair criteria for choosing.']),
      h('h4', null, 'Lead through change'), ul(['Share what you know honestly, including what you do not know yet.', 'Explain the why, not just the what.', 'Invite questions and concerns, and follow up.']),
      h('h4', null, 'Values that work in Aotearoa'), ul(['Manaakitanga — showing care, respect and hospitality, including welcoming newcomers.', 'Whanaungatanga — building genuine relationships and a sense of belonging.', 'Kotahitanga — working together with unity of purpose.']),
      h('div', { className: 'jx-note' }, h('strong', null, 'Try it: '), 'Use GROW for ten minutes with a colleague or family member who has a decision to make. Ask questions only — no advice.')); } }
  ];

  // [question, options, correctIndex, explanation]
  var QUIZ = [
    ['Which best describes assertive communication?', ['Getting your own way, whatever it takes', 'Expressing your needs and views honestly while respecting others', 'Agreeing so that conflict is avoided', 'Staying silent to keep the peace'], 1, 'Assertiveness balances honesty about your own needs with respect for other people’s.'],
    ['A colleague agrees in meetings but later complains to others and quietly misses deadlines. Which style is this?', ['Assertive', 'Passive', 'Passive-aggressive', 'Aggressive'], 2, 'Indirect resistance after apparent agreement is typical of passive-aggressive behaviour.'],
    ['What is a common impact of aggressive communication on a team?', ['More honest input and new ideas', 'Fear, defensiveness and less honest input', 'Faster, better decisions in the long run', 'Higher trust in the leader'], 1, 'Aggression may get short-term compliance but reduces trust and the willingness to speak up.'],
    ['Over time, people who mostly communicate passively often feel…', ['Relaxed and respected', 'Resentful, stressed and overlooked', 'Powerful and in control', 'Nothing in particular'], 1, 'Unmet needs and unspoken views build up into stress and resentment.'],
    ['In this course, the 3 Cs stand for…', ['Courage, Compassion, Commitment', 'Confidence, Clarity, Control', 'Calm, Courtesy, Consistency', 'Clarity, Conflict, Compromise'], 1, 'Confidence, Clarity and Control help you manage your behaviour and the outcome.'],
    ['Which is the clearest request?', ['“It would be nice to have the budget sometime soon.”', '“Could you send me the draft budget by 3 pm Thursday?”', '“Budgets are always late around here.”', '“Whenever you get a chance, no stress.”'], 1, 'A clear request says what is needed and by when.'],
    ['Which is an effective “I-statement”?', ['“You never send the reports on time.”', '“I feel worried when reports arrive late because I can’t check them before the board meets.”', '“Everyone is fed up with your reports.”', '“I think you are disorganised.”'], 1, 'An I-statement describes the behaviour, your feeling and the effect without blaming or labelling.'],
    ['What does the DESC script stand for?', ['Describe, Express, Specify, Consequences', 'Decide, Explain, Support, Check', 'Discuss, Evaluate, Solve, Close', 'Define, Engage, Share, Commit'], 0, 'Describe the situation, Express its effect, Specify what you want, explain the positive Consequences.'],
    ['The “broken record” technique means…', ['Repeating your point more loudly each time', 'Calmly repeating your key message without being drawn into side arguments', 'Refusing to talk until the other person agrees', 'Changing the subject when the conversation is hard'], 1, 'Calm repetition keeps the conversation focused on your key message.'],
    ['“Fogging” is a way to…', ['Confuse the other person', 'Calmly acknowledge any truth in a criticism without becoming defensive', 'Avoid a conversation', 'Agree with every criticism'], 1, 'Fogging reduces tension by acknowledging what may be true while keeping your self-respect.'],
    ['Negative inquiry means…', ['Asking for specific details about a criticism so you understand it', 'Criticising the other person back', 'Asking negative questions to win', 'Ignoring the criticism'], 0, 'Asking for specifics turns vague criticism into useful information.'],
    ['Which is an assertive way to say no?', ['“Fine, I’ll do it.” (then sighing)', '“No. That’s not my job.”', '“I can’t take that on this week because of the audit. I could help next Tuesday.”', '“Maybe… I’ll see.” (then not doing it)'], 2, 'Acknowledge, say no clearly, keep any reason short and offer a real alternative if you can.'],
    ['A workable compromise is…', ['Giving in so the other person is happy', 'A solution that meets the key needs of both people without either losing self-respect', 'Splitting every difference exactly in half', 'Letting the most senior person decide'], 1, 'A workable compromise protects both people’s key needs and dignity.'],
    ['Which body language best supports an assertive message?', ['Arms folded, staring, leaning in close', 'Looking at the floor, speaking very softly', 'Relaxed upright posture, steady voice and comfortable eye contact', 'Pointing and raising your voice'], 2, 'Open, steady body language matches a calm, confident message.'],
    ['In some Māori and Pasifika contexts, lowering the eyes can show respect. What should a leader do?', ['Treat it as a lack of confidence', 'Insist on direct eye contact', 'Avoid judging confidence on a single cue and learn the person’s norms', 'Ignore cultural differences'], 2, 'Non-verbal signals vary between cultures; good leaders learn and respect them.'],
    ['What is good practice for a sensitive email?', ['Write it quickly while you still feel strongly', 'Put the key point first, keep a calm neutral tone, reread it — and consider a call first', 'Copy in as many people as possible', 'Use capitals so the important part stands out'], 1, 'Sensitive issues are often best discussed in person or by phone, then confirmed in writing.'],
    ['Writing in ALL CAPITALS in an email is usually read as…', ['Friendly', 'Shouting', 'Professional', 'Neutral'], 1, 'Capitals read as shouting online. Use bold sparingly instead.'],
    ['The SBI feedback model stands for…', ['Situation, Behaviour, Impact', 'Strengths, Barriers, Improvements', 'Start, Build, Improve', 'Summary, Background, Ideas'], 0, 'Situation, Behaviour, Impact keeps feedback specific and fair.'],
    ['Constructive feedback should…', ['Focus on the person’s personality', 'Describe specific, observable behaviour and its impact, then discuss next steps', 'Be given in front of the team so everyone learns', 'Be saved for the annual review'], 1, 'Specific, timely, behaviour-based feedback is easier to understand and act on.'],
    ['You receive criticism that feels unfair. A good assertive first step is to…', ['Defend yourself straight away', 'Listen, ask for specific examples, then respond calmly', 'Walk away', 'Criticise them in return'], 1, 'Understanding the criticism first lets you respond to the real issue.'],
    ['“Name it to tame it” refers to…', ['Labelling your emotion to help regulate it', 'Naming the person who caused the problem', 'Giving a project a catchy name', 'Calling out bad behaviour in public'], 0, 'Putting a feeling into words helps calm it so you can think clearly.'],
    ['Which helps you stay in Control in a tense conversation?', ['Replying as fast as possible', 'Pausing, breathing slowly and focusing on the outcome you want', 'Raising your voice to be heard', 'Bringing up past mistakes'], 1, 'Pausing and slow breathing reduce the stress response and keep you outcome-focused.'],
    ['The GROW coaching model stands for…', ['Goal, Reality, Options, Way forward', 'Guide, Review, Organise, Win', 'Gather, Research, Observe, Write', 'Goal, Results, Outcomes, Wins'], 0, 'GROW helps people find their own solutions through questions.'],
    ['Effective delegation includes…', ['Handing over the task with no further contact', 'Agreeing the outcome, level of authority, resources, deadline and check-in points', 'Delegating only tasks you dislike', 'Checking every step yourself'], 1, 'Clear expectations and support make delegation work for both people.'],
    ['Psychological safety in a team means…', ['Nobody ever disagrees', 'People feel safe to speak up, ask questions and admit mistakes without fear of humiliation', 'Everyone has a permanent job', 'Mistakes are never discussed'], 1, 'Psychological safety supports learning, innovation and early problem-solving.'],
    ['In conflict, focusing on interests rather than positions means…', ['Exploring the underlying needs behind what each person is asking for', 'Deciding who has the higher position', 'Ignoring what people say they want', 'Choosing the cheapest option'], 0, 'Interests explain why people want something, which opens up more options.'],
    ['Which statement shows active listening?', ['“That’s not a big deal.”', '“So the main concern is the deadline, not the budget — have I got that right?”', '“When I had that problem, I…”', '“Let’s move on.”'], 1, 'Reflecting back checks understanding and shows the person they were heard.'],
    ['During organisational change, an assertive leader…', ['Says nothing until everything is final', 'Shares what they know honestly, acknowledges uncertainty and invites questions', 'Promises nothing will change', 'Leaves communication to HR'], 1, 'Honest, regular communication builds trust when things are uncertain.'],
    ['Manaakitanga in a workplace is best shown by…', ['Showing care, respect and hospitality, including welcoming newcomers', 'Working longer hours than others', 'Keeping information to yourself', 'Competing with colleagues'], 0, 'Manaakitanga is about uplifting others through care, respect and hospitality.'],
    ['Personal impact is best described as…', ['Your job title and authority', 'The effect your words, actions and presence have on others’ thoughts, feelings and actions', 'How loudly you speak in meetings', 'The number of people who report to you'], 1, 'Personal impact comes from how you communicate and behave, not only your position.']
  ];

  /* ---------- tiny PDF writer: one A4 landscape page with a JPEG ---------- */
  function pdfFromJpeg(jpegBytes, imgW, imgH, info) {
    var enc = new TextEncoder(), parts = [], offsets = [], len = 0;
    function add(x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; }
    function obj(n, body, stream) { offsets[n] = len; add(n + ' 0 obj\n'); add(body); if (stream) { add('\nstream\n'); add(stream); add('\nendstream'); } add('\nendobj\n'); }
    function pdfStr(s) { return '(' + String(s).replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '') + ')'; }
    var W = 841.89, H = 595.28;
    add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
    obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
    obj(4, '<< /Type /XObject /Subtype /Image /Width ' + imgW + ' /Height ' + imgH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegBytes.length + ' >>', jpegBytes);
    var content = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im0 Do Q';
    obj(5, '<< /Length ' + content.length + ' >>', enc.encode(content));
    obj(6, '<< /Title ' + pdfStr(info.title) + ' /Author ' + pdfStr(info.author) + ' /Subject ' + pdfStr(info.subject) + ' /Creator (The James NZ) /Producer (The James NZ browser record) >>');
    var xref = len;
    add('xref\n0 7\n0000000000 65535 f \n');
    for (var i = 1; i <= 6; i++) add(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    add('trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + xref + '\n%%EOF');
    return new Blob(parts, { type: 'application/pdf' });
  }

  function wrapText(g, text, maxW) { var words = text.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines; }
  function drawRecord(canvas, rec) {
    var W = 2339, H = 1654, S = W / 702; // A4 landscape, 702 x 496 reference layout
    canvas.width = W; canvas.height = H;
    var g = canvas.getContext('2d');
    var ink = '#1f2a33', teal = '#1b6b63', soft = '#5d6872', serif = 'Georgia, "Times New Roman", serif', sans = 'Arial, Helvetica, sans-serif';
    function px(n) { return n * S; }
    function text(t, x, y, font, color, align) { g.font = font; g.fillStyle = color; g.textAlign = align || 'center'; g.fillText(t, px(x), px(y)); }
    function rrect(x, y, w, h, r) { g.beginPath(); g.moveTo(px(x + r), px(y)); g.arcTo(px(x + w), px(y), px(x + w), px(y + h), px(r)); g.arcTo(px(x + w), px(y + h), px(x), px(y + h), px(r)); g.arcTo(px(x), px(y + h), px(x), px(y), px(r)); g.arcTo(px(x), px(y), px(x + w), px(y), px(r)); g.closePath(); }
    g.fillStyle = '#ffffff'; g.fillRect(0, 0, W, H);
    // soft colour band and a single rounded frame
    var gr = g.createLinearGradient(0, 0, W, 0); gr.addColorStop(0, '#1b6b63'); gr.addColorStop(1, '#2f8f86');
    g.fillStyle = gr; g.fillRect(0, 0, W, px(10));
    g.strokeStyle = 'rgba(27,107,99,.35)'; g.lineWidth = px(1.2); rrect(22, 30, 658, 444, 14); g.stroke();
    // brand
    g.fillStyle = '#b42132'; g.beginPath(); g.arc(px(60), px(70), px(13), 0, Math.PI * 2); g.fill();
    g.strokeStyle = '#fff'; g.lineWidth = px(1.5); g.beginPath(); g.arc(px(60), px(70), px(4.2), 0, Math.PI * 2); g.stroke();
    for (var k = 0; k < 8; k++) { var a = k * Math.PI / 4; g.beginPath(); g.moveTo(px(60) + Math.cos(a) * px(6.5), px(70) + Math.sin(a) * px(6.5)); g.lineTo(px(60) + Math.cos(a) * px(9.3), px(70) + Math.sin(a) * px(9.3)); g.stroke(); }
    text('The James NZ', 80, 68, 'bold ' + px(12) + 'px ' + sans, ink, 'left');
    text(rec.sub || 'Learning · Leadership', 80, 82, px(7.5) + 'px ' + sans, soft, 'left');
    // title
    text('Certificate of Completion', 351, 150, px(31) + 'px ' + serif, ink);
    text('Presented to', 351, 192, px(11) + 'px ' + sans, soft);
    var size = 30; do { g.font = px(size) + 'px ' + serif; size -= 0.5; } while (g.measureText(rec.name).width > px(560) && size > 12);
    g.fillStyle = teal; g.textAlign = 'center'; g.fillText(rec.name, px(351), px(236));
    g.strokeStyle = 'rgba(27,107,99,.25)'; g.lineWidth = px(0.8); g.beginPath(); g.moveTo(px(201), px(250)); g.lineTo(px(501), px(250)); g.stroke();
    text(rec.line || 'for completing the online course', 351, 276, px(11) + 'px ' + sans, soft);
    text(rec.topic || TOPIC, 351, 304, 'bold ' + px(16) + 'px ' + serif, ink);
    text('Assessment score: ' + rec.score + ' / ' + (rec.total || TOTAL) + ' (' + rec.pct + '%)', 351, 330, px(10) + 'px ' + sans, soft);
    // details row
    function detail(label, value, x) { text(label, x, 384, 'bold ' + px(6.5) + 'px ' + sans, soft); text(value, x, 401, px(11) + 'px ' + sans, ink); }
    detail('DATE', rec.dateLong, 210);
    detail('RECORD', rec.ref.slice(0, 8).toUpperCase() + '-' + rec.ref.slice(9, 13).toUpperCase(), 492);
    // footer
    text(rec.foot || 'Self-assessed, non-accredited course record. Not an NZQA qualification, not on the NZQCF and carries no credits. Not endorsed by NZQA.', 351, 446, px(6.2) + 'px ' + sans, soft);
    text('www.thejamesnz.com · name entered by the learner and kept on their device', 351, 458, px(6.2) + 'px ' + sans, soft);
    g.textAlign = 'left';
  }
  function uuid() { try { return crypto.randomUUID(); } catch (e) { return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) { var r = Math.random() * 16 | 0; return (c === 'x' ? r : (r & 3 | 8)).toString(16); }); } }
  function nzParts(d) {
    var opt = { timeZone: 'Pacific/Auckland' };
    return { dateLong: d.toLocaleDateString('en-NZ', Object.assign({ day: 'numeric', month: 'long', year: 'numeric' }, opt)), dateShort: d.toLocaleDateString('en-NZ', Object.assign({ day: 'numeric', month: 'short', year: 'numeric' }, opt)), timeLong: d.toLocaleTimeString('en-NZ', Object.assign({ hour: 'numeric', minute: '2-digit' }, opt)).toLowerCase() };
  }
  function download(blob, name) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

  JNZX.certKit = { draw: function (c, r) { return drawRecord(c, r); }, pdf: function (b, w, hh, i) { return pdfFromJpeg(b, w, hh, i); }, uuid: function () { return uuid(); }, nz: function (d) { return nzParts(d); }, download: function (b, n) { return download(b, n); } };
  function Certificate(props) {
    var att = props.attempt;
    var nm = JNZX.useStored('jnzx-lead-name-remember', ''), remembered = nm[0], setRemembered = nm[1];
    var n = useState(remembered || ''), name = n[0], setName = n[1];
    var r = useState(!!remembered), remember = r[0], setRemember = r[1];
    var d = useState(false), declared = d[0], setDeclared = d[1];
    var m = useState(''), msg = m[0], setMsg = m[1];
    var cv = useRef(null);
    var clean = name.replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
    var ready = clean.length >= 2 && declared;
    var rec = useMemo(function () { var dt = new Date(att.at); return Object.assign({ name: clean || 'Your name', score: att.score, pct: (att.score / TOTAL * 100).toFixed(1), iso: dt.toISOString(), ref: att.ref }, nzParts(dt)); }, [clean, att]);
    useEffect(function () { if (cv.current) drawRecord(cv.current, rec); }, [rec]);
    useEffect(function () { setRemembered(remember ? clean : ''); }, [remember, clean]);
    function blobOf(type, q) { return new Promise(function (res) { cv.current.toBlob(res, type, q); }); }
    async function pdf() { var b = await blobOf('image/jpeg', 0.95); var bytes = new Uint8Array(await b.arrayBuffer()); download(pdfFromJpeg(bytes, cv.current.width, cv.current.height, { title: 'Certificate of Completion (self-assessed, non-accredited)', author: 'The James NZ', subject: 'Self-assessed learning record: ' + TOPIC }), 'TheJamesNZ-Leadership-Certificate.pdf'); setMsg('PDF downloaded.'); }
    async function png() { download(await blobOf('image/png'), 'TheJamesNZ-Leadership-Certificate.png'); setMsg('Picture downloaded.'); }
    async function share() { var b = await blobOf('image/png'); var f = new File([b], 'TheJamesNZ-Leadership-Certificate.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: 'My learning record', text: 'I completed ' + TOPIC + ' on The James NZ.' }); return; } catch (e) { if (e.name === 'AbortError') return; } } download(b, f.name); setMsg('Sharing isn’t available here, so the picture was downloaded instead.'); }
    return h('div', { className: 'jx-cert' },
      h('h3', null, '🎉 You passed with ' + att.score + ' / ' + TOTAL),
      h('p', null, 'Create your completion record (certificate). It is drawn on your own device.'),
      h('div', { className: 'jx-row jx-form' },
        h('label', null, 'Your name as you want it shown', h('input', { value: name, maxLength: 80, autoComplete: 'name', onChange: function (e) { setName(e.target.value); } }))),
      h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: declared, onChange: function (e) { setDeclared(e.target.checked); } }), h('span', null, 'I completed this quiz myself, and I understand this is a self-assessed, non-accredited learning record — not an NZQA qualification.')),
      h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: remember, onChange: function (e) { setRemember(e.target.checked); } }), h('span', null, 'Remember my name on this device (optional).')),
      h('div', { className: 'jx-note' }, h('strong', null, 'Privacy: '), 'Your name and results are not sent to The James NZ or anyone else. They are used only in this browser to draw your record, and are saved on this device only if you choose. You can clear them at any time with “Start again”.'),
      h('div', { className: 'jx-cert-preview' + (ready ? '' : ' is-locked') }, h('canvas', { ref: cv, 'aria-label': 'Preview of your learning completion record' }), !ready && h('p', null, 'Enter your name and tick the declaration to unlock the downloads.')),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'primary', disabled: !ready, onClick: pdf }, 'Download PDF'),
        h('button', { type: 'button', className: 'secondary', disabled: !ready, onClick: png }, 'Download picture'),
        h('button', { type: 'button', className: 'secondary', disabled: !ready, onClick: share }, 'Share picture')),
      msg && h('p', { className: 'small-note', role: 'status' }, msg));
  }

  function Assessment() {
    var st = JNZX.useStored('jnzx-lead-quiz', { order: null, answers: {}, done: null }), s = st[0], set = st[1];
    var p = useState(0), page = p[0], setPage = p[1];
    var order = s.order;
    function start() { var o = QUIZ.map(function (_, i) { return i; }); for (var i = o.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)); var t = o[i]; o[i] = o[j]; o[j] = t; } set({ order: o, answers: {}, done: null }); setPage(0); }
    if (!order) return h('div', { className: 'jx-card' }, h('h3', null, 'Final assessment'), h('p', null, TOTAL + ' multiple-choice questions on the six modules. You need ' + PASS + ' or more (at least 85%) to create a completion record. Your answers are saved on this device as you go, so you can take a break.'), h('button', { type: 'button', className: 'primary', onClick: start }, 'Start the assessment'));
    var answered = Object.keys(s.answers).length;
    if (s.done) {
      var score = s.done.score, passed = score >= PASS;
      return h('div', null,
        h('div', { className: 'jx-card' }, h('h3', null, 'Your result: ' + score + ' / ' + TOTAL + ' (' + (score / TOTAL * 100).toFixed(1) + '%)'), h('p', null, passed ? 'Ka pai! You met the completion threshold.' : 'You need ' + PASS + ' to pass. Review the explanations below and the modules, then try again — the questions will be shuffled.'),
          h('button', { type: 'button', className: 'secondary', onClick: start }, 'Start again')),
        passed && h(Certificate, { attempt: s.done }),
        h('h3', null, 'Review your answers'),
        h('ol', { className: 'jx-review' }, order.map(function (qi) { var q = QUIZ[qi], a = s.answers[qi], ok = a === q[2]; return h('li', { key: qi, className: ok ? 'is-ok' : 'is-no' }, h('strong', null, q[0]), h('p', null, (ok ? '✓ ' : '✗ Your answer: ' + (a === undefined ? '—' : q[1][a]) + ' · Correct: ') + q[1][q[2]]), h('p', { className: 'jx-muted' }, q[3])); })));
    }
    var per = 5, pages = Math.ceil(TOTAL / per), slice = order.slice(page * per, page * per + per);
    function choose(qi, oi) { var a = Object.assign({}, s.answers); a[qi] = oi; set(Object.assign({}, s, { answers: a })); }
    function submit() { var score = order.reduce(function (n, qi) { return n + (s.answers[qi] === QUIZ[qi][2] ? 1 : 0); }, 0); set(Object.assign({}, s, { done: { score: score, at: Date.now(), ref: uuid() } })); try { window.scrollTo({ top: 0 }); } catch (e) {} }
    return h('div', null,
      h('div', { className: 'jx-progress', 'aria-label': answered + ' of ' + TOTAL + ' answered' }, h('span', { style: { width: answered / TOTAL * 100 + '%' } })),
      h('p', { className: 'jx-muted' }, answered + ' of ' + TOTAL + ' answered · Page ' + (page + 1) + ' of ' + pages),
      slice.map(function (qi, k) { var q = QUIZ[qi]; return h('fieldset', { key: qi, className: 'jx-q' }, h('legend', null, (page * per + k + 1) + '. ' + q[0]), q[1].map(function (o, oi) { return h('label', { key: oi, className: 'jx-opt' + (s.answers[qi] === oi ? ' is-on' : '') }, h('input', { type: 'radio', name: 'q' + qi, checked: s.answers[qi] === oi, onChange: function () { choose(qi, oi); } }), h('span', null, o)); })); }),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'secondary', disabled: page === 0, onClick: function () { setPage(page - 1); } }, '← Previous'),
        page < pages - 1 ? h('button', { type: 'button', className: 'primary', onClick: function () { setPage(page + 1); } }, 'Next →')
          : h('button', { type: 'button', className: 'primary', disabled: answered < TOTAL, onClick: submit }, answered < TOTAL ? 'Answer all ' + TOTAL + ' to submit' : 'Submit answers')));
  }

  function Course() {
    var d = JNZX.useStored('jnzx-lead-modules', {}), done = d[0], setDone = d[1];
    var count = MODULES.filter(function (m) { return done[m.id]; }).length;
    return h('div', null,
      h('div', { className: 'jx-cards2' },
        h('div', null, h('h3', null, 'What you will learn'), h('ul', null, ['Define assertive skills and use them at work and in life', 'Recognise passive, aggressive, passive-aggressive and assertive styles and their impact', 'Build the 3 Cs — Confidence, Clarity and Control', 'Use non-verbal, email and online communication well', 'Practise assertive techniques: I-statements, DESC, saying no, feedback', 'Apply essential leadership skills to build positive relationships'].map(function (x, i) { return h('li', { key: i }, x); }))),
        h('div', { className: 'jx-card' }, h('h3', null, 'Your progress'), h('p', { className: 'jx-big' }, count + ' / ' + MODULES.length + ' modules'), h('div', { className: 'jx-progress' }, h('span', { style: { width: count / MODULES.length * 100 + '%' } })), h('p', { className: 'jx-muted' }, 'About 1.5 hours in total, plus the assessment. Work at your own pace; progress is saved on this device.'))),
      h(JNZX.Accordion, { items: MODULES.map(function (m) { return { key: m.id, title: (done[m.id] ? '✓ ' : '') + m.title, meta: m.time, body: function () { return h('div', null, m.body(), h('button', { type: 'button', className: done[m.id] ? 'secondary' : 'primary', onClick: function () { var o = Object.assign({}, done); o[m.id] = !o[m.id]; setDone(o); } }, done[m.id] ? 'Mark as not done' : 'Mark module complete')); } }; }) }));
  }

  JNZX.register('x:leadership', function LeadershipPage(props) {
    return h('div', null,
      JNZX.Header('LEARNING · LEADERSHIP', 'Essential Leadership & Assertive Skills.', 'A free, self-paced course on communicating with confidence and leading with positive personal impact. Six short modules, a 30-question assessment and a downloadable completion record.'),
      h(JNZX.Tabs, { id: 'leadership', label: 'Leadership', items: [
        { id: 'course', label: '📚 Course', render: function () { return h(Course); } },
        { id: 'quiz', label: '📝 Assessment & record', render: function () { return h(Assessment); } },
        { id: 'practice', label: '💬 Lead with Heart practice', render: function () { return h('div', { className: 'jx-card' }, h('h3', null, 'Lead with Heart practice'), h('p', null, 'Short daily leadership prompts and reflections to keep building the habit.'), h('button', { type: 'button', className: 'primary', onClick: function () { props.navigate('Leadership practice'); } }, 'Open Lead with Heart practice →')); } },
        { id: 'about', label: 'About this course', render: function () { return h('div', null,
          h('p', null, 'This course is original material written by The James NZ. It covers everyday leadership skills: speaking up with confidence, listening well, giving feedback and handling tricky conversations calmly.'),
          h('h4', null, 'About the completion record'), h('ul', null, ['It records a self-assessed, unproctored quiz result calculated in your browser.', 'It is not an NZQA-approved qualification, micro-credential or training scheme, is not listed on the New Zealand Qualifications and Credentials Framework (NZQCF), and carries no credits.', 'Identity, supervision and workplace competence are not verified, and there is no public verification register.', 'The course and record are free. Nothing is sold, and no claims are made about employment or professional outcomes.'].map(function (x, i) { return h('li', { key: i }, x); })),
          h('h4', null, 'Your privacy'), h('p', null, 'No account is needed. Your answers, progress and name are processed only in your browser and saved on your device (local storage). They are never sent to The James NZ. Clear them at any time by starting the assessment again or clearing your browser data. This approach is designed to respect the information privacy principles in the Privacy Act 2020.'),
          h('p', { className: 'small-note' }, 'This information is general and is not legal advice.')); } }
      ] }),
      h(JNZX.ShareBar, { tab: props.tab }));
  });
  JNZX._lead = { QUIZ: QUIZ, pdfFromJpeg: pdfFromJpeg };
})();
