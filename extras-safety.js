/* The James NZ — Safety & Know-how quiz with a certificate of completion
   (Kiwi Adventures). 30 questions drawn from the guides on the page:
   first aid and AED, natural hazards, sun and outdoors, and road safety. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef, useMemo = R.useMemo;
  var TOPIC = 'NZ Safety & Know-how', PASS = 24;

  // [question, options, correct index, explanation, section]
  var QUIZ = [
    ['Someone collapses, does not respond and is only gasping. What should you do first?', ['Wait to see if they wake up', 'Check it is safe, call 111 for Ambulance on speaker and start CPR', 'Give them a drink of water', 'Drive them to the doctor'], 1, 'Gasping is not normal breathing. Call 111, follow the call handler and start CPR straight away.', 'First aid'],
    ['For adult CPR, how many chest compressions do you give before 2 rescue breaths?', ['5', '10', '15', '30'], 3, 'Give 30 compressions, then 2 breaths. If you can’t give breaths, keep doing compressions.', 'First aid'],
    ['Where do you place your hands for adult CPR?', ['On the stomach', 'Heel of one hand in the centre of the chest, other hand on top', 'On the left shoulder', 'Under the neck'], 1, 'Heel of the hand in the centre of the chest, with the other hand on top. Push hard and fast.', 'First aid'],
    ['For CPR on a baby under one year, you compress the chest using…', ['Two fingers in the centre of the chest, just below the nipple line', 'Both fists', 'The heel of both hands', 'Your elbow'], 0, 'Use two fingers, about one third of the chest depth.', 'First aid'],
    ['An adult is choking but coughing strongly. What should you do?', ['Give back blows straight away', 'Encourage them to keep coughing', 'Give them a drink', 'Lie them down'], 1, 'While the cough is effective, encourage coughing — don’t give back blows yet.', 'First aid'],
    ['A choking adult cannot breathe, cough or speak. After calling 111, you give…', ['Up to 5 back blows, then up to 5 chest thrusts, and repeat', 'A glass of water', 'Mouth-to-mouth only', 'Nothing until help arrives'], 0, 'Lean them forward: up to 5 back blows, check, then up to 5 chest thrusts. Repeat as needed.', 'First aid'],
    ['Someone is bleeding heavily. What is the best first action after keeping yourself safe?', ['Wash the wound with soap', 'Apply firm, continuous direct pressure with a clean cloth', 'Lift the person to stand up', 'Wait to see if it stops'], 1, 'Firm, continuous pressure controls bleeding. Call 111 for heavy or uncontrolled bleeding.', 'First aid'],
    ['There is an object stuck in a wound. You should…', ['Pull it out quickly', 'Leave it in and press around it', 'Push it in further', 'Pour water on it'], 1, 'Don’t remove an embedded object — apply pressure around it.', 'First aid'],
    ['How long should you cool a burn under cool running water?', ['30 seconds', '5 minutes', 'At least 20 minutes', 'Until it stops hurting, however short'], 2, 'Cool the burn for at least 20 minutes while keeping the rest of the person warm.', 'First aid'],
    ['Which of these should you NOT put on a burn?', ['Cool running water', 'A loose, clean, non-stick dressing', 'Ice or butter', 'Nothing — just cool it'], 2, 'Don’t use ice, butter or creams, and don’t burst blisters.', 'First aid'],
    ['Signs of a severe allergic reaction (anaphylaxis) include…', ['A small itchy spot only', 'Breathing trouble, throat or tongue swelling, or collapse', 'Feeling a bit tired', 'Sneezing once'], 1, 'These are emergency signs. Call 111 and help them use their adrenaline auto-injector.', 'First aid'],
    ['What number is the National Poisons Centre (free, 24 hours)?', ['0800 764 766', '105', '0800 611 116', '*555'], 0, 'Call 0800 764 766 promptly for a possible poisoning, even with no symptoms. Call 111 for collapse or breathing trouble.', 'First aid'],
    ['A child has swallowed a cleaning product. Should you make them vomit?', ['Yes, always', 'No — call the Poisons Centre and follow their advice', 'Only if they feel sick', 'Yes, with salt water'], 1, 'Don’t make the person vomit or give drinks unless the Poisons Centre tells you to.', 'First aid'],
    ['What should you do during an earthquake?', ['Run outside', 'Stand in a doorway', 'Drop, Cover and Hold', 'Take the lift downstairs'], 2, 'Drop to your hands and knees, cover your head and neck, and hold on until the shaking stops.', 'Natural hazards'],
    ['Someone using a wheelchair should, during an earthquake…', ['Lock, Cover, Hold', 'Get out of the chair and run', 'Move to a window', 'Wait in a doorway'], 0, 'Lock the wheels, cover your head and neck, and hold on.', 'Natural hazards'],
    ['You’re at the beach and feel an earthquake that is long or strong. What should you do once it stops?', ['Wait for an official text alert', 'Go to the water to look for a wave', 'Immediately move to high ground or inland', 'Stay where you are'], 2, '“Long or Strong, Get Gone.” Don’t wait for an alert — move to high ground or inland straight away.', 'Natural hazards'],
    ['Your house is on fire and there is smoke. You should…', ['Get down low and get out, then call 111 from outside', 'Go back for your phone', 'Hide in a cupboard', 'Open all the windows first'], 0, 'Get down low, get out and stay out. Call 111 and ask for Fire from a safe place.', 'Natural hazards'],
    ['Is it safe to drive through floodwater if it looks shallow?', ['Yes, if you go slowly', 'Yes, in a big car', 'No — never walk, swim or drive through floodwater', 'Only during the day'], 2, 'Floodwater can hide strong currents, holes and contamination.', 'Natural hazards'],
    ['How much drinking water should you store for each person for three days?', ['1 litre', '3 litres', 'At least 9 litres', '20 litres'], 2, 'Store at least 9 litres per person for three days — more for heat, illness, breastfeeding and pets.', 'Natural hazards'],
    ['Which item belongs in a household emergency kit?', ['A battery radio and spare batteries', 'A games console', 'Fresh flowers', 'A heavy rug'], 0, 'Keep a torch, battery radio, spare batteries, first aid, food, water and medicines.', 'Natural hazards'],
    ['From what UV index level should you protect yourself from the sun?', ['1', '3', '6', '10'], 1, 'At UV 3 or higher: cover up, seek shade, wear a hat and sunglasses, and use sunscreen.', 'Sun & outdoors'],
    ['How often should you reapply sunscreen?', ['Once a day', 'Every two hours and after swimming or sweating', 'Only when you feel hot', 'Never — once is enough'], 1, 'Use broad-spectrum, water-resistant SPF 30+, applied 20 minutes before going out and reapplied every two hours.', 'Sun & outdoors'],
    ['Why shouldn’t you cover a pram with a blanket on a hot day?', ['It gets dirty', 'It traps heat and restricts airflow', 'It looks untidy', 'Babies don’t like blankets'], 1, 'Use shade and protective clothing instead — a blanket can trap heat.', 'Sun & outdoors'],
    ['At a patrolled beach, where should you swim?', ['Anywhere you like', 'Between the red and yellow flags', 'Near the rocks', 'Behind the surf break'], 1, 'Lifeguards watch the area between the red and yellow flags.', 'Sun & outdoors'],
    ['Someone is in trouble in the water and there is no lifeguard. Who do you call?', ['111 and ask for Police', '105', 'The Poisons Centre', 'A friend'], 0, 'Call 111 and ask for Police for a water rescue.', 'Sun & outdoors'],
    ['Before a walk or tramp, you should…', ['Leave without telling anyone', 'Tell a trusted person your route and when to raise the alarm', 'Rely on mobile coverage', 'Pack only enough food for lunch'], 1, 'Mobile coverage isn’t assured. Check the forecast, pack extra food and layers, and leave your plan with someone.', 'Sun & outdoors'],
    ['In New Zealand, which side of the road do you drive on?', ['The right', 'The left', 'Either side on country roads', 'The middle on narrow roads'], 1, 'Keep left — and take extra care when turning and at roundabouts.', 'Road safety'],
    ['Children under what age must use an approved child restraint in a car?', ['3', '5', '7', '12'], 2, 'Children under 7 must use an approved child restraint. Check the official rules for older children too.', 'Road safety'],
    ['You need to use your phone while driving. What is the safest choice?', ['Text quickly at a red light', 'Hold it on your lap', 'Stop somewhere safe first', 'Use it only on straight roads'], 2, 'Plan your route before you leave, and stop somewhere safe to rest or use your phone.', 'Road safety'],
    ['Which number do you call for an urgent road incident that is NOT life-threatening?', ['111', '*555', '0800 764 766', '0800 933 922'], 1, 'Use *555 for urgent road incidents with no immediate danger to life, 111 for danger to life and 105 for non-emergency Police matters.', 'Road safety']
  ];
  var TOTAL = QUIZ.length;

  function shuffle(n) { var o = []; for (var i = 0; i < n; i++) o.push(i); for (var k = n - 1; k > 0; k--) { var j = Math.floor(Math.random() * (k + 1)); var t = o[k]; o[k] = o[j]; o[j] = t; } return o; }
  function Certificate(props) {
    var att = props.attempt, kit = JNZX.certKit;
    var nm = JNZX.useStored('jnzx-safety-name-remember', ''), remembered = nm[0], setRemembered = nm[1];
    var n = useState(remembered || ''), name = n[0], setName = n[1];
    var r = useState(!!remembered), remember = r[0], setRemember = r[1];
    var d = useState(false), declared = d[0], setDeclared = d[1];
    var m = useState(''), msg = m[0], setMsg = m[1];
    var cv = useRef(null);
    var clean = name.replace(/[\u0000-\u001f<>]/g, '').replace(/\s+/g, ' ').trim().slice(0, 80);
    var ready = clean.length >= 2 && declared;
    var rec = useMemo(function () { var dt = new Date(att.at); return Object.assign({ name: clean || 'Your name', score: att.score, total: TOTAL, pct: (att.score / TOTAL * 100).toFixed(1), ref: att.ref, topic: TOPIC, sub: 'Kiwi Adventures · Safety & Know-how', line: 'for completing the safety knowledge quiz', foot: 'Self-assessed knowledge quiz. Not a first-aid certificate or qualification — book a practical first-aid course to learn hands-on skills.' }, kit.nz(dt)); }, [clean, att]);
    useEffect(function () { if (cv.current) kit.draw(cv.current, rec); }, [rec]);
    useEffect(function () { setRemembered(remember ? clean : ''); }, [remember, clean]);
    function blobOf(type, q) { return new Promise(function (res) { cv.current.toBlob(res, type, q); }); }
    async function pdf() { var b = await blobOf('image/jpeg', 0.95); var bytes = new Uint8Array(await b.arrayBuffer()); kit.download(kit.pdf(bytes, cv.current.width, cv.current.height, { title: 'Certificate of Completion (self-assessed)', author: 'The James NZ', subject: TOPIC }), 'TheJamesNZ-Safety-Certificate.pdf'); setMsg('PDF downloaded.'); }
    async function png() { kit.download(await blobOf('image/png'), 'TheJamesNZ-Safety-Certificate.png'); setMsg('Picture downloaded.'); }
    var fileRef = useRef(null);
    async function prep() { var b = await blobOf('image/png'); fileRef.current = new File([b], 'TheJamesNZ-Safety-Certificate.png', { type: 'image/png' }); }
    useEffect(function () { if (ready) setTimeout(prep, 50); }, [ready, rec]);
    async function share() {
      var f = fileRef.current; if (!f) { await prep(); f = fileRef.current; }
      var text = 'I completed the NZ Safety & Know-how quiz on The James NZ (' + att.score + '/' + TOTAL + ')! Try it: https://www.thejamesnz.com/?p=safety#section=' + encodeURIComponent('NZ safety & know-how');
      if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: 'My safety certificate', text: text }); return; } catch (e) { if (e.name === 'AbortError') return; } }
      kit.download(f, f.name); if (JNZX.copyText) JNZX.copyText(text).catch(function () {}); setMsg('Sharing pictures isn’t available here, so the certificate was downloaded and the message copied.');
    }
    return h('div', { className: 'jx-cert' },
      h('h3', null, '🎉 You passed with ' + att.score + ' / ' + TOTAL),
      h('p', null, 'Create your certificate of completion. It is drawn on your own device.'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Your name as you want it shown', h('input', { value: name, maxLength: 80, autoComplete: 'name', onChange: function (e) { setName(e.target.value); } }))),
      h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: declared, onChange: function (e) { setDeclared(e.target.checked); } }), h('span', null, 'I completed this quiz myself. I understand this is a knowledge quiz, not a first-aid qualification.')),
      h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: remember, onChange: function (e) { setRemember(e.target.checked); } }), h('span', null, 'Remember my name on this device (optional).')),
      h('div', { className: 'jx-cert-preview' + (ready ? '' : ' is-locked') }, h('canvas', { ref: cv, 'aria-label': 'Preview of your certificate' }), !ready && h('p', null, 'Enter your name and tick the declaration to unlock the downloads.')),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'primary', disabled: !ready, onClick: pdf }, 'Download PDF'),
        h('button', { type: 'button', className: 'secondary', disabled: !ready, onClick: png }, 'Download picture'),
        h('button', { type: 'button', className: 'secondary', disabled: !ready, onClick: share }, 'Share certificate')),
      msg && h('p', { className: 'small-note', role: 'status' }, msg));
  }
  var SECT = { 'First aid': ['🩹', '#c0392b', '#fdecea'], 'Natural hazards': ['🌋', '#9a5b00', '#fff3dc'], 'Sun & outdoors': ['☀️', '#1b6b63', '#e3f4ef'], 'Road safety': ['🚗', '#2c5aa0', '#e7effb'] };
  var LETTERS = ['A', 'B', 'C', 'D', 'E'];
  function Ring(props) {
    var pct = props.pct, r = 52, c = 2 * Math.PI * r;
    return h('svg', { className: 'jx-sq-ring', viewBox: '0 0 120 120', role: 'img', 'aria-label': props.label },
      h('circle', { cx: 60, cy: 60, r: r, fill: 'none', stroke: 'currentColor', strokeOpacity: 0.12, strokeWidth: 12 }),
      h('circle', { cx: 60, cy: 60, r: r, fill: 'none', stroke: props.pass ? '#1f8a5a' : '#d9822b', strokeWidth: 12, strokeLinecap: 'round', strokeDasharray: c, strokeDashoffset: c * (1 - pct), transform: 'rotate(-90 60 60)' }),
      h('text', { x: 60, y: 58, textAnchor: 'middle', fontSize: 26, fontWeight: 800, fill: 'currentColor' }, Math.round(pct * 100) + '%'),
      h('text', { x: 60, y: 80, textAnchor: 'middle', fontSize: 12, fill: 'currentColor', opacity: 0.7 }, props.sub));
  }
  function SafetyQuiz() {
    var st = JNZX.useStored('jnzx-safety-quiz', { order: null, answers: {}, done: null }), s = st[0], set = st[1];
    var top = useRef(null);
    function scrollTop() { try { top.current && top.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }
    function start() { var perm = {}; QUIZ.forEach(function (q, i) { perm[i] = shuffle(q[1].length); }); set({ order: shuffle(TOTAL), perm: perm, answers: {}, pos: 0, done: null }); scrollTop(); }
    var order = s.order;
    if (!order) {
      var counts = {}; QUIZ.forEach(function (q) { counts[q[4]] = (counts[q[4]] || 0) + 1; });
      return h('section', { className: 'jx-sq jx-sq-intro jx-keep-colour', ref: top },
        h('div', { className: 'jx-sq-hero' },
          h('div', { className: 'jx-sq-badge', 'aria-hidden': true }, '🛟'),
          h('div', null, h('p', { className: 'eyebrow' }, 'TEST YOURSELF · ' + TOTAL + ' QUESTIONS'), h('h2', null, 'Safety & Know-how quiz'), h('p', null, 'How ready are you for an emergency in Aotearoa? Answer one question at a time — you’ll see the right answer and a short tip after each one.'))),
        h('div', { className: 'jx-sq-sections' }, Object.keys(SECT).map(function (k) { return h('div', { key: k, className: 'jx-sq-sec', style: { background: SECT[k][2], color: SECT[k][1] } }, h('span', { className: 'jx-sq-sec-ico' }, SECT[k][0]), h('strong', null, k), h('small', null, (counts[k] || 0) + ((counts[k] || 0) === 1 ? ' question' : ' questions'))); })),
        h('ul', { className: 'jx-sq-facts' }, h('li', null, '⏱️ About 10 minutes'), h('li', null, '🎯 Pass mark: ' + PASS + ' of ' + TOTAL + ' (80%)'), h('li', null, '🏅 Certificate of completion when you pass'), h('li', null, '💾 Progress saved on this device')),
        h('button', { type: 'button', className: 'primary jx-sq-go', onClick: start }, '▶ Start the quiz'));
    }
    var answered = Object.keys(s.answers).length;
    if (s.done) {
      var score = s.done.score, passed = score >= PASS, bySec = {};
      order.forEach(function (qi) { var q = QUIZ[qi], k = q[4]; bySec[k] = bySec[k] || [0, 0]; bySec[k][1]++; if (s.answers[qi] === q[2]) bySec[k][0]++; });
      return h('section', { className: 'jx-sq jx-keep-colour', ref: top },
        h('div', { className: 'jx-sq-res' + (passed ? ' is-pass' : '') },
          h(Ring, { pct: score / TOTAL, pass: passed, sub: score + ' / ' + TOTAL, label: 'Score ' + score + ' out of ' + TOTAL }),
          h('div', null, h('p', { className: 'eyebrow' }, passed ? 'PASSED' : 'NOT QUITE YET'), h('h2', null, passed ? 'Ka pai! You know your safety basics.' : score >= PASS - 4 ? 'So close — have another go.' : 'Not quite yet — have another go.'), h('p', null, passed ? 'Create your certificate below.' : 'You need ' + PASS + ' to pass. Read the guides above and the tips in your review, then try again — questions and answers are shuffled.'),
            h('button', { type: 'button', className: 'secondary', onClick: start }, '↺ Take the quiz again'))),
        h('div', { className: 'jx-sq-sections' }, Object.keys(SECT).map(function (k) { var v = bySec[k] || [0, 0]; return h('div', { key: k, className: 'jx-sq-sec', style: { background: SECT[k][2], color: SECT[k][1] } }, h('span', { className: 'jx-sq-sec-ico' }, SECT[k][0]), h('strong', null, k), h('small', null, v[0] + ' / ' + v[1] + ' correct'), h('span', { className: 'jx-sq-bar' }, h('span', { style: { width: (v[1] ? v[0] / v[1] * 100 : 0) + '%', background: SECT[k][1] } }))); })),
        passed && h(Certificate, { attempt: s.done }),
        h('details', { className: 'jx-sq-review', open: !passed }, h('summary', null, '📝 Review all answers'),
          h('ol', { className: 'jx-sq-rlist' }, order.map(function (qi) { var q = QUIZ[qi], a = s.answers[qi], ok = a === q[2]; return h('li', { key: qi, className: ok ? 'is-ok' : 'is-no' }, h('p', { className: 'jx-sq-rq' }, (ok ? '✅ ' : '❌ ') + q[0]), !ok && h('p', null, h('span', { className: 'jx-muted' }, 'Your answer: '), a === undefined ? '—' : q[1][a]), h('p', null, h('span', { className: 'jx-muted' }, 'Correct: '), h('strong', null, q[1][q[2]])), h('p', { className: 'jx-muted' }, '💡 ' + q[3])); }))));
    }
    var pos = Math.min(s.pos || 0, TOTAL - 1), qi = order[pos], q = QUIZ[qi], sec = SECT[q[4]] || ['❓', '#333', '#eee'];
    var chosen = s.answers[qi], locked = chosen !== undefined, right = chosen === q[2];
    var perm = (s.perm && s.perm[qi]) || q[1].map(function (_, i) { return i; });
    var soFar = order.slice(0, pos + (locked ? 1 : 0)).reduce(function (n, x) { return n + (s.answers[x] === QUIZ[x][2] ? 1 : 0); }, 0);
    function choose(oi) { if (locked) return; var a = Object.assign({}, s.answers); a[qi] = oi; set(Object.assign({}, s, { answers: a })); }
    function goTo(n) { set(Object.assign({}, s, { pos: Math.max(0, Math.min(TOTAL - 1, n)) })); }
    function submit() { var score = order.reduce(function (n, x) { return n + (s.answers[x] === QUIZ[x][2] ? 1 : 0); }, 0); set(Object.assign({}, s, { done: { score: score, at: Date.now(), ref: JNZX.certKit ? JNZX.certKit.uuid() : String(Date.now()) } })); scrollTop(); }
    var allDone = answered >= TOTAL;
    return h('section', { className: 'jx-sq jx-keep-colour', ref: top },
      h('div', { className: 'jx-sq-top' },
        h('span', { className: 'jx-sq-count' }, 'Question ' + (pos + 1) + ' of ' + TOTAL),
        h('span', { className: 'jx-sq-score' }, '✅ ' + soFar + ' correct')),
      h('div', { className: 'jx-sq-prog', role: 'progressbar', 'aria-valuemin': 0, 'aria-valuemax': TOTAL, 'aria-valuenow': answered }, h('span', { style: { width: answered / TOTAL * 100 + '%' } })),
      h('article', { className: 'jx-sq-card', key: qi },
        h('span', { className: 'jx-sq-chip', style: { background: sec[2], color: sec[1] } }, sec[0] + ' ' + q[4]),
        h('h3', { className: 'jx-sq-q' }, q[0]),
        h('div', { className: 'jx-sq-opts', role: 'radiogroup', 'aria-label': 'Answers' }, perm.map(function (oi, k) {
          var cls = 'jx-sq-opt' + (locked && oi === q[2] ? ' is-right' : '') + (locked && oi === chosen && !right ? ' is-wrong' : '') + (chosen === oi ? ' is-chosen' : '');
          return h('button', { key: oi, type: 'button', role: 'radio', 'aria-checked': chosen === oi, className: cls, disabled: locked && oi !== chosen && oi !== q[2], onClick: function () { choose(oi); } },
            h('span', { className: 'jx-sq-letter' }, locked && oi === q[2] ? '✓' : locked && oi === chosen ? '✗' : LETTERS[k]), h('span', null, q[1][oi]));
        })),
        locked && h('div', { className: 'jx-sq-fb' + (right ? ' is-right' : ' is-wrong'), 'aria-live': 'polite' }, h('strong', null, right ? '✅ Correct!' : '❌ Not quite.'), ' ', q[3])),
      h('div', { className: 'jx-sq-nav' },
        h('button', { type: 'button', className: 'secondary', disabled: pos === 0, onClick: function () { goTo(pos - 1); } }, '← Back'),
        pos < TOTAL - 1 ? h('button', { type: 'button', className: 'primary', disabled: !locked, onClick: function () { goTo(pos + 1); } }, locked ? 'Next question →' : 'Choose an answer')
          : h('button', { type: 'button', className: 'primary', disabled: !allDone, onClick: submit }, allDone ? '🏁 See my result' : 'Answer all ' + TOTAL + ' first')),
      h('div', { className: 'jx-sq-dots', 'aria-label': 'Jump to a question' }, order.map(function (x, k) { var st2 = s.answers[x] === undefined ? '' : s.answers[x] === QUIZ[x][2] ? ' ok' : ' no'; return h('button', { key: x, type: 'button', className: 'jx-sq-dot' + st2 + (k === pos ? ' on' : ''), 'aria-label': 'Question ' + (k + 1), onClick: function () { goTo(k); } }, k + 1); })),
      allDone && pos < TOTAL - 1 && h('button', { type: 'button', className: 'primary jx-sq-finish', onClick: submit }, '🏁 All answered — see my result'));
  }
  JNZX.SafetyQuiz = SafetyQuiz;
  try {
    var baseSafety = NZSafety;
    NZSafety = function NZSafetyWithQuiz(props) { return h(R.Fragment, null, h(baseSafety, props), h(SafetyQuiz)); };
  } catch (e) { console.warn('[JNZX] safety quiz', e); }
  var css = '.jx-sq{margin-top:26px;display:grid;gap:14px;max-width:760px;margin-left:auto;margin-right:auto;padding:18px;border-radius:22px;background:#fff;border:1px solid #e1e8e4;box-shadow:0 6px 24px rgba(20,40,35,.06)}' +
    '.jx-sq-hero{display:flex;gap:16px;align-items:flex-start}.jx-sq-badge{flex:0 0 64px;height:64px;border-radius:18px;display:grid;place-items:center;font-size:34px;background:#e3f4ef}.jx-sq-hero h2{margin:2px 0 6px}.jx-sq-hero p{margin:0}.jx-sq-hero .eyebrow{margin:0}' +
    '.jx-sq-sections{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,150px),1fr));gap:10px}.jx-sq-sec{border-radius:16px;padding:12px 14px;display:grid;gap:2px}.jx-sq-sec-ico{font-size:22px}.jx-sq-sec strong{font-size:.98rem}.jx-sq-sec small{font-weight:600;opacity:.85}' +
    '.jx-sq-bar{display:block;height:6px;border-radius:6px;background:rgba(0,0,0,.08);overflow:hidden;margin-top:6px}.jx-sq-bar span{display:block;height:100%;border-radius:6px}' +
    '.jx-sq-facts{list-style:none;padding:0;margin:0;display:flex;flex-wrap:wrap;gap:8px 16px;font-weight:600;color:#3b4a46}.jx-sq-go{justify-self:start;font-size:1.05rem;padding:12px 22px!important}' +
    '.jx-sq-top{display:flex;justify-content:space-between;align-items:center;font-weight:700}.jx-sq-count{color:#3b4a46}.jx-sq-score{color:#1f8a5a}' +
    '.jx-sq-prog{height:10px;border-radius:10px;background:#e8eeeb;overflow:hidden}.jx-sq-prog span{display:block;height:100%;background:linear-gradient(90deg,#1b6b63,#2fa37a);border-radius:10px;transition:width .3s}' +
    '.jx-sq-card{display:grid;gap:12px;animation:jxSqIn .25s ease}@keyframes jxSqIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}' +
    '.jx-sq-chip{justify-self:start;border-radius:999px;padding:5px 12px;font-weight:700;font-size:.85rem}.jx-sq-q{margin:0;font-size:clamp(1.15rem,3.6vw,1.4rem);line-height:1.4}' +
    '.jx-sq-opts{display:grid;gap:10px}.jx-sq-opt{display:flex;align-items:center;gap:12px;width:100%;text-align:left;padding:13px 14px;border-radius:14px;border:2px solid #dbe4df;background:#fff;color:#1f2a2a;font:inherit;font-size:1rem;line-height:1.4;cursor:pointer;touch-action:manipulation;min-height:56px}' +
    '.jx-sq-opt:hover:not(:disabled){border-color:#1b6b63}.jx-sq-opt:disabled{opacity:.55;cursor:default}.jx-sq-letter{flex:0 0 34px;height:34px;border-radius:50%;display:grid;place-items:center;font-weight:800;background:#eef3f0;color:#1b6b63}' +
    '.jx-sq-opt.is-right{border-color:#1f8a5a;background:#e9f7ef;opacity:1}.jx-sq-opt.is-right .jx-sq-letter{background:#1f8a5a;color:#fff}.jx-sq-opt.is-wrong{border-color:#c0392b;background:#fdecea;opacity:1}.jx-sq-opt.is-wrong .jx-sq-letter{background:#c0392b;color:#fff}' +
    '.jx-sq-fb{border-radius:14px;padding:12px 14px;line-height:1.5}.jx-sq-fb.is-right{background:#e9f7ef;color:#174d33}.jx-sq-fb.is-wrong{background:#fff4e5;color:#6b3d00}' +
    '.jx-sq-nav{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}.jx-sq-nav .primary{flex:1 1 200px;max-width:320px;margin-left:auto}' +
    '.jx-sq-dots{display:flex;flex-wrap:wrap;gap:6px;justify-content:center;padding-top:4px}.jx-sq-dot{width:32px;height:32px;border-radius:50%;border:1px solid #cfdad3;background:#fff;color:#3b4a46;font:inherit;font-size:.78rem;font-weight:700;cursor:pointer;padding:0}.jx-sq-dot.ok{background:#1f8a5a;color:#fff;border-color:#1f8a5a}.jx-sq-dot.no{background:#e9a23b;color:#fff;border-color:#e9a23b}.jx-sq-dot.on{outline:3px solid #1b6b63;outline-offset:2px}' +
    '.jx-sq-finish{justify-self:center}' +
    '.jx-sq-res{display:flex;gap:20px;align-items:center;flex-wrap:wrap;padding:16px;border-radius:18px;background:#fff6eb}.jx-sq-res.is-pass{background:#e9f7ef}.jx-sq-res>div{flex:1 1 260px}.jx-sq-res h2{margin:2px 0 6px}.jx-sq-res p{margin:0 0 10px}.jx-sq-ring{width:130px;height:130px;flex:0 0 130px;color:#1f2a2a}' +
    '.jx-sq-review summary{cursor:pointer;font-weight:700;min-height:40px;display:flex;align-items:center}.jx-sq-rlist{padding-left:20px;display:grid;gap:12px}.jx-sq-rlist li{padding:10px 12px;border-radius:12px;background:#f6f8f7}.jx-sq-rlist li p{margin:2px 0}.jx-sq-rq{font-weight:700}' +
    '@media (max-width:520px){.jx-sq{padding:14px;border-radius:18px}.jx-sq-hero{flex-direction:column}.jx-sq-res{flex-direction:column;align-items:flex-start}.jx-sq-dot{width:30px;height:30px}}' +
    'html[data-reading-theme="dark"] .jx-sq{background:#141c1b;border-color:#2c3a37}html[data-reading-theme="dark"] .jx-sq-opt,html[data-reading-theme="dark"] .jx-sq-dot{background:#1b2524;color:#eef3f1;border-color:#3a4a46}html[data-reading-theme="dark"] .jx-sq-letter{background:#22302d;color:#9fe0c8}' +
    'html[data-reading-theme="dark"] .jx-sq-opt.is-right{background:#163326}html[data-reading-theme="dark"] .jx-sq-opt.is-wrong{background:#3a1d1a}html[data-reading-theme="dark"] .jx-sq-fb.is-right{background:#163326;color:#d4f0dc}html[data-reading-theme="dark"] .jx-sq-fb.is-wrong{background:#3a2a14;color:#ffe2bd}' +
    'html[data-reading-theme="dark"] .jx-sq .jx-sq-sec{background:#1d2927!important;border:1px solid #33433f}html[data-reading-theme="dark"] .jx-sq .jx-sq-sec,html[data-reading-theme="dark"] .jx-sq .jx-sq-sec *{color:#eef3f1!important}html[data-reading-theme="dark"] .jx-sq .jx-sq-chip{background:#22302d!important;color:#eef3f1!important}html[data-reading-theme="dark"] .jx-sq-res{background:#2a2416;color:#fbecd0}html[data-reading-theme="dark"] .jx-sq-res.is-pass{background:#163326;color:#d4f0dc}html[data-reading-theme="dark"] .jx-sq-ring{color:#eef3f1}' +
    'html[data-reading-theme="dark"] .jx-sq .jx-sq-opt.is-right{background:#163326!important;border-color:#2fa37a!important;color:#eafff3!important}html[data-reading-theme="dark"] .jx-sq .jx-sq-opt.is-right .jx-sq-letter{background:#2fa37a!important;color:#fff!important}' +
    'html[data-reading-theme="dark"] .jx-sq .jx-sq-opt.is-wrong{background:#3a1d1a!important;border-color:#e0675a!important;color:#ffe9e6!important}html[data-reading-theme="dark"] .jx-sq .jx-sq-opt.is-wrong .jx-sq-letter{background:#e0675a!important;color:#fff!important}' +
    'html[data-reading-theme="dark"] .jx-sq .jx-sq-opt{background:#1b2524!important;color:#eef3f1!important;border-color:#3a4a46!important}html[data-reading-theme="dark"] .jx-sq .jx-sq-letter{background:#22302d!important;color:#9fe0c8!important}' +
    'html[data-reading-theme="dark"] .jx-sq .jx-sq-dot{background:#1b2524!important;color:#eef3f1!important;border-color:#3a4a46!important}html[data-reading-theme="dark"] .jx-sq .jx-sq-dot.ok{background:#2fa37a!important;color:#fff!important}html[data-reading-theme="dark"] .jx-sq .jx-sq-dot.no{background:#d98b2b!important;color:#fff!important}' +
    '.jx-sq .jx-sq-opt.is-right{background:#e9f7ef!important;border-color:#1f8a5a!important}.jx-sq .jx-sq-opt.is-wrong{background:#fdecea!important;border-color:#c0392b!important}.jx-sq .jx-sq-dot.ok{background:#1f8a5a!important;color:#fff!important}.jx-sq .jx-sq-dot.no{background:#e9a23b!important;color:#fff!important}' +
    'html[data-reading-theme="dark"] .jx-sq-rlist li{background:#1b2524}html[data-reading-theme="dark"] .jx-sq-count,html[data-reading-theme="dark"] .jx-sq-facts{color:#d7e2de}html[data-reading-theme="dark"] .jx-sq-prog{background:#22302d}html[data-reading-theme="dark"] .jx-sq-badge{background:#22302d}';
  var stl = document.createElement('style'); stl.textContent = css; document.head.appendChild(stl);
})();
