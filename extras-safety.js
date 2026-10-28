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
    ['Who can use an AED (defibrillator)?', ['Only doctors', 'Only paramedics', 'Anyone — it gives spoken instructions', 'Only people with a licence'], 2, 'AEDs talk you through each step. Anyone can use one.', 'First aid'],
    ['While an AED is analysing or giving a shock, you should…', ['Keep doing compressions', 'Make sure nobody touches the person', 'Give the person water', 'Remove the pads'], 1, 'Nobody should touch the person during analysis or a shock. Resume CPR when told.', 'First aid'],
    ['An adult is choking but coughing strongly. What should you do?', ['Give back blows straight away', 'Encourage them to keep coughing', 'Give them a drink', 'Lie them down'], 1, 'While the cough is effective, encourage coughing — don’t give back blows yet.', 'First aid'],
    ['A choking adult cannot breathe, cough or speak. After calling 111, you give…', ['Up to 5 back blows, then up to 5 chest thrusts, and repeat', 'A glass of water', 'Mouth-to-mouth only', 'Nothing until help arrives'], 0, 'Lean them forward: up to 5 back blows, check, then up to 5 chest thrusts. Repeat as needed.', 'First aid'],
    ['Why should you never blindly sweep a choking person’s mouth with your finger?', ['It is rude', 'It can push the object further down', 'It takes too long', 'It is only for babies'], 1, 'Only remove an object you can clearly see. A blind sweep can make the blockage worse.', 'First aid'],
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
  function SafetyQuiz() {
    var st = JNZX.useStored('jnzx-safety-quiz', { order: null, answers: {}, done: null }), s = st[0], set = st[1];
    var p = useState(0), page = p[0], setPage = p[1];
    var top = useRef(null);
    function go(n) { setPage(n); try { top.current && top.current.scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }
    function start() { var perm = {}; QUIZ.forEach(function (q, i) { perm[i] = shuffle(q[1].length); }); set({ order: shuffle(TOTAL), perm: perm, answers: {}, done: null }); go(0); }
    var order = s.order;
    var head = h('div', { className: 'jx-sq-head' }, h('p', { className: 'eyebrow' }, 'TEST YOURSELF'), h('h2', null, '🛟 Safety & Know-how quiz'), h('p', null, TOTAL + ' questions on first aid, earthquakes and tsunami, fire and floods, sun and water safety, and the road. Score ' + PASS + ' or more (80%) to earn a certificate of completion.'));
    if (!order) return h('section', { className: 'jx-card jx-sq', ref: top }, head, h('button', { type: 'button', className: 'primary', onClick: start }, '▶ Start the quiz'), h('p', { className: 'small-note' }, 'Your answers are saved on this device as you go, so you can take a break.'));
    var answered = Object.keys(s.answers).length;
    if (s.done) {
      var score = s.done.score, passed = score >= PASS;
      return h('section', { className: 'jx-card jx-sq', ref: top }, head,
        h('div', { className: 'jx-sq-result' + (passed ? ' is-pass' : '') }, h('h3', null, 'Your result: ' + score + ' / ' + TOTAL + ' (' + Math.round(score / TOTAL * 100) + '%)'), h('p', null, passed ? 'Ka pai! You know your safety basics.' : 'You need ' + PASS + ' to pass. Read the explanations and the guides above, then try again — the questions will be shuffled.'), h('button', { type: 'button', className: 'secondary', onClick: start }, '↺ Start again')),
        passed && h(Certificate, { attempt: s.done }),
        h('details', { className: 'jx-sq-review', open: !passed }, h('summary', null, 'Review your answers'),
          h('ol', { className: 'jx-review' }, order.map(function (qi) { var q = QUIZ[qi], a = s.answers[qi], ok = a === q[2]; return h('li', { key: qi, className: ok ? 'is-ok' : 'is-no' }, h('strong', null, q[0]), h('p', null, (ok ? '✓ ' : '✗ Your answer: ' + (a === undefined ? '—' : q[1][a]) + ' · Correct: ') + q[1][q[2]]), h('p', { className: 'jx-muted' }, q[3])); }))));
    }
    var per = 5, pages = Math.ceil(TOTAL / per), slice = order.slice(page * per, page * per + per);
    function choose(qi, oi) { var a = Object.assign({}, s.answers); a[qi] = oi; set(Object.assign({}, s, { answers: a })); }
    function submit() { var score = order.reduce(function (n, qi) { return n + (s.answers[qi] === QUIZ[qi][2] ? 1 : 0); }, 0); set(Object.assign({}, s, { done: { score: score, at: Date.now(), ref: JNZX.certKit ? JNZX.certKit.uuid() : String(Date.now()) } })); go(0); }
    return h('section', { className: 'jx-card jx-sq', ref: top }, head,
      h('div', { className: 'jx-progress', 'aria-label': answered + ' of ' + TOTAL + ' answered' }, h('span', { style: { width: answered / TOTAL * 100 + '%' } })),
      h('p', { className: 'jx-muted' }, answered + ' of ' + TOTAL + ' answered · Page ' + (page + 1) + ' of ' + pages),
      slice.map(function (qi, k) { var q = QUIZ[qi]; return h('fieldset', { key: qi, className: 'jx-q' }, h('legend', null, (page * per + k + 1) + '. ' + q[0]), h('small', { className: 'jx-sq-tag' }, q[4]), ((s.perm && s.perm[qi]) || q[1].map(function (_, i) { return i; })).map(function (oi) { var o = q[1][oi]; return h('label', { key: oi, className: 'jx-opt' + (s.answers[qi] === oi ? ' is-on' : '') }, h('input', { type: 'radio', name: 'sq' + qi, checked: s.answers[qi] === oi, onChange: function () { choose(qi, oi); } }), h('span', null, o)); })); }),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'secondary', disabled: page === 0, onClick: function () { go(page - 1); } }, '← Previous'),
        page < pages - 1 ? h('button', { type: 'button', className: 'primary', onClick: function () { go(page + 1); } }, 'Next →')
          : h('button', { type: 'button', className: 'primary', disabled: answered < TOTAL, onClick: submit }, answered < TOTAL ? 'Answer all ' + TOTAL + ' to submit' : 'Submit answers')));
  }
  JNZX.SafetyQuiz = SafetyQuiz;
  try {
    var baseSafety = NZSafety;
    NZSafety = function NZSafetyWithQuiz(props) { return h(R.Fragment, null, h(baseSafety, props), h(SafetyQuiz)); };
  } catch (e) { console.warn('[JNZX] safety quiz', e); }
  var css = '.jx-sq{margin-top:22px;display:grid;gap:10px}.jx-sq-head h2{margin:2px 0 4px}.jx-sq-head p{margin:0}.jx-sq-tag{display:inline-block;margin:0 0 6px;font-size:.78rem;font-weight:700;color:#1b6b63}.jx-sq-result{padding:14px 16px;border-radius:14px;background:#fff4e5}.jx-sq-result.is-pass{background:#e6f5ec}.jx-sq-result h3{margin:0 0 4px}.jx-sq-review summary{cursor:pointer;font-weight:700}' +
    'html[data-reading-theme="dark"] .jx-sq-result{background:#3a2a14;color:#ffe9c8}html[data-reading-theme="dark"] .jx-sq-result.is-pass{background:#163326;color:#d4f0dc}html[data-reading-theme="dark"] .jx-sq-tag{color:#8fd8c0}';
  var stl = document.createElement('style'); stl.textContent = css; document.head.appendChild(stl);
})();
