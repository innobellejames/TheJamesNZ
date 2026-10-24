/* The James NZ — Ask Mateo writing & grammar check (October 2026).
   Local style rules run on this device. The optional LanguageTool check
   sends the text to api.languagetool.org only when the person presses
   "Check grammar online". */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useMemo = R.useMemo;
  var MODES = [
    { id: 'academic', label: 'Academic', hint: 'Formal, precise and evidence-based: no contractions, slang or chatty openers.' },
    { id: 'business', label: 'Business', hint: 'Clear, concise and action-focused: plain words, short sentences, active voice.' },
    { id: 'email', label: 'Email', hint: 'Friendly and easy to act on: greeting, clear request, sign-off, right length.' },
    { id: 'creative', label: 'Creative', hint: 'Vivid and varied: fewer filter words, adverbs and clichés; more specific detail.' },
    { id: 'improve', label: 'Improve writing', hint: 'General polish: grammar slips, wordiness, repetition and readability.' }
  ];

  /* ---------- rule tables ---------- */
  // [pattern, message, replacement|null, modes(null=all)]
  var CONFUSED = [
    [/\b(their|there) (going|coming|doing|being|not|always|never|very|so|really)\b/gi, 'Did you mean “they’re” (they are)?', function (m, a, b) { return 'they’re ' + b; }],
    [/\btheir (is|are|was|were)\b/gi, 'Use “there” for place or existence (“there is”).', function (m, a) { return 'there ' + a; }],
    [/\byour (welcome|right|wrong|going|coming|doing|not|very|so|the best|amazing)\b/gi, 'Did you mean “you’re” (you are)?', function (m, a) { return 'you’re ' + a; }],
    [/\bits (a|an|the|been|not|going|very|so|time|important|raining|hard|easy)\b/gi, 'Use “it’s” for “it is / it has”.', function (m, a) { return 'it’s ' + a; }],
    [/\bit's (own|colour|color|name|shape|size|way|purpose)\b/gi, 'Use “its” (no apostrophe) for possession.', function (m, a) { return 'its ' + a; }],
    [/\b(could|would|should|must|might) of\b/gi, 'Use “have”, not “of”.', function (m, a) { return a + ' have'; }],
    [/\balot\b/gi, '“A lot” is two words.', 'a lot'],
    [/\b(dont|doesnt|didnt|cant|wont|isnt|wasnt|arent|werent|havent|hasnt|hadnt|couldnt|wouldnt|shouldnt)\b/gi, 'Missing apostrophe.', function (m) { return m.slice(0, -1).replace(/n$/, '') + 'n’t'; }],
    [/\b(then)(?= (me|him|her|them|us|you|I|we|they|anyone|ever|before))/gi, 'For comparisons use “than”.', 'than'],
    [/\b(more|less|better|worse|bigger|smaller|faster|slower|rather|other) then\b/gi, 'For comparisons use “than”.', function (m, a) { return a + ' than'; }],
    [/\bloose (weight|track|touch|my|your|the game)\b/gi, '“Lose” means to misplace or not win; “loose” means not tight.', function (m, a) { return 'lose ' + a; }],
    [/\b(affect)(?= (on|of))\b/gi, 'The noun is usually “effect”.', 'effect'],
    [/\bdefinately|definatly|definitly\b/gi, 'Spelling: “definitely”.', 'definitely'],
    [/\bseperate\b/gi, 'Spelling: “separate”.', 'separate'],
    [/\brecieve\b/gi, 'Spelling: “receive”.', 'receive'],
    [/\boccured\b/gi, 'Spelling: “occurred”.', 'occurred'],
    [/\buntill\b/gi, 'Spelling: “until”.', 'until'],
    [/\bwich\b/gi, 'Spelling: “which”.', 'which'],
    [/\bi\b(?=[ ’',.!?])/g, 'Capitalise “I”.', 'I'],
    [/\b(\w+) \1\b/gi, 'Repeated word.', function (m, a) { return a; }],
    [/ {2,}/g, 'Extra space.', ' '],
    [/ ([,.;:!?])/g, 'No space before punctuation.', function (m, a) { return a; }],
    [/([,;:])(?=[A-Za-z])/g, 'Add a space after punctuation.', function (m, a) { return a + ' '; }]
  ];
  var WORDY = [
    ['in order to', 'to'], ['due to the fact that', 'because'], ['at this point in time', 'now'], ['at the present time', 'now'], ['in the event that', 'if'],
    ['for the purpose of', 'for'], ['with regard to', 'about'], ['with reference to', 'about'], ['in spite of the fact that', 'although'], ['a large number of', 'many'],
    ['a majority of', 'most'], ['the majority of', 'most'], ['is able to', 'can'], ['are able to', 'can'], ['has the ability to', 'can'], ['in close proximity to', 'near'],
    ['prior to', 'before'], ['subsequent to', 'after'], ['each and every', 'each'], ['first and foremost', 'first'], ['basic fundamentals', 'fundamentals'], ['end result', 'result'],
    ['future plans', 'plans'], ['past history', 'history'], ['completely finished', 'finished'], ['absolutely essential', 'essential'], ['in the near future', 'soon'],
    ['make a decision', 'decide'], ['give consideration to', 'consider'], ['come to the conclusion', 'conclude'], ['take into consideration', 'consider'], ['it is important to note that', ''],
    ['needless to say', ''], ['please be advised that', ''], ['please do not hesitate to', 'please'], ['at the end of the day', 'ultimately'], ['as a matter of fact', 'in fact']
  ];
  var INFORMAL = ['a lot of', 'lots of', 'kind of', 'sort of', 'stuff', 'things', 'gonna', 'wanna', 'gotta', 'kinda', 'really', 'totally', 'pretty much', 'okay', 'ok', 'awesome', 'cool', 'super', 'huge', 'basically', 'literally', 'anyway', 'heaps', 'reckon', 'sweet as', 'stoked'];
  var JARGON = ['synergy', 'synergies', 'leverage', 'circle back', 'touch base', 'move the needle', 'low-hanging fruit', 'deep dive', 'bandwidth', 'paradigm shift', 'going forward', 'value-add', 'boil the ocean', 'think outside the box', 'best-of-breed', 'actionable insights', 'take this offline', 'ping me', 'drill down'];
  var HEDGES = ['just', 'maybe', 'perhaps', 'I think', 'I feel', 'I guess', 'sort of', 'kind of', 'hopefully', 'a bit', 'slightly', 'somewhat', 'possibly', 'I was wondering if'];
  var CLICHES = ['at the end of the day', 'in the nick of time', 'all of a sudden', 'avoid it like the plague', 'easier said than done', 'only time will tell', 'as luck would have it', 'heart of gold', 'cold as ice', 'dead as a doornail', 'scared to death', 'crystal clear', 'think outside the box', 'calm before the storm', 'tip of the iceberg', 'every cloud has a silver lining', 'fit as a fiddle', 'busy as a bee', 'in the blink of an eye', 'time stood still', 'butterflies in my stomach', 'a chill ran down', 'little did they know', 'a sea of faces', 'once upon a time'];
  var FILTER = ['felt', 'feel', 'saw', 'see', 'heard', 'hear', 'noticed', 'notice', 'realised', 'realized', 'wondered', 'thought', 'knew', 'seemed', 'looked like', 'decided'];
  var PASSIVE_AGGRESSIVE = ['per my last email', 'as previously stated', 'as I said before', 'as mentioned before', 'just to be clear', 'going forward, please', 'friendly reminder', 'not sure if you saw my last email', 'as per my previous'];
  var CONTRACTIONS = /\b(\w+)(n['’]t|['’](re|ve|ll|d|m|s))\b/gi;

  function wordRx(list) { return new RegExp('\\b(' + list.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')\\b', 'gi'); }

  function sentences(text) {
    var out = [], re = /[^.!?\n]+[.!?]*["”’)]*\s*/g, m;
    while ((m = re.exec(text))) { if (m[0].trim()) out.push({ text: m[0], start: m.index }); }
    return out;
  }
  function syllables(word) {
    word = word.toLowerCase().replace(/[^a-z]/g, '');
    if (!word) return 0;
    if (word.length <= 3) return 1;
    word = word.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
    var m = word.match(/[aeiouy]{1,2}/g);
    return Math.max(1, m ? m.length : 1);
  }
  function stats(text) {
    var words = text.match(/[A-Za-zÀ-ÿĀ-ž’'-]+/g) || [];
    var sents = sentences(text).length || (words.length ? 1 : 0);
    var syl = words.reduce(function (a, w) { return a + syllables(w); }, 0);
    var flesch = words.length ? 206.835 - 1.015 * (words.length / Math.max(1, sents)) - 84.6 * (syl / words.length) : 0;
    return { words: words.length, sentences: sents, avg: sents ? words.length / sents : 0, flesch: Math.round(flesch), minutes: Math.max(1, Math.round(words.length / 230)) };
  }
  function readLabel(f) { return f >= 70 ? 'Easy to read' : f >= 50 ? 'Fairly clear' : f >= 30 ? 'Demanding' : 'Very demanding'; }

  /* Collect issues: {start,end,msg,fix,kind} */
  function localCheck(text, mode) {
    var issues = [];
    function push(start, end, msg, fix, kind) { issues.push({ start: start, end: end, msg: msg, fix: fix, kind: kind || 'style', src: 'local' }); }
    function each(rx, fn) { rx.lastIndex = 0; var m; while ((m = rx.exec(text))) { fn(m); if (m[0] === '') rx.lastIndex++; } }

    CONFUSED.forEach(function (r) {
      each(new RegExp(r[0].source, r[0].flags), function (m) {
        var fix = typeof r[2] === 'function' ? r[2].apply(null, m) : r[2];
        if (fix === m[0]) return;
        if (fix && /^[A-Z]/.test(m[0]) && /^[a-z]/.test(fix)) fix = fix[0].toUpperCase() + fix.slice(1);
        push(m.index, m.index + m[0].length, r[1], fix, 'grammar');
      });
    });
    // sentence starts with lowercase
    sentences(text).forEach(function (s) {
      var i = s.text.search(/\S/); var ch = s.text[i];
      if (ch && /[a-z]/.test(ch)) push(s.start + i, s.start + i + 1, 'Start the sentence with a capital letter.', ch.toUpperCase(), 'grammar');
      var wc = (s.text.match(/\S+/g) || []).length;
      var limit = mode === 'creative' ? 40 : mode === 'academic' ? 35 : 25;
      if (wc > limit) push(s.start, s.start + s.text.trimEnd().length, 'Long sentence (' + wc + ' words). Consider splitting it.', null, 'clarity');
    });
    // passive voice
    if (mode !== 'creative') each(/\b(am|is|are|was|were|be|been|being)\s+(\w+ed|built|done|made|given|taken|seen|written|sent|known|shown|found|held|kept|told|paid|sold|brought|bought|caught|taught|thought)\b(\s+by\b)?/gi, function (m) {
      push(m.index, m.index + m[0].length, 'Possible passive voice. Active voice is often clearer (“The team sent…”).', null, 'clarity');
    });
    // wordiness
    WORDY.forEach(function (w) {
      each(new RegExp('\\b' + w[0] + '\\b', 'gi'), function (m) { push(m.index, m.index + m[0].length, 'Wordy: try “' + (w[1] || '(remove)') + '”.', w[1], 'concise'); });
    });
    if (mode === 'academic') {
      each(CONTRACTIONS, function (m) {
        var full = expand(m[0]); if (full && full !== m[0]) push(m.index, m.index + m[0].length, 'Avoid contractions in academic writing.', full, 'formal');
      });
      each(wordRx(INFORMAL), function (m) { push(m.index, m.index + m[0].length, 'Informal word for academic writing: choose a precise alternative.', null, 'formal'); });
      each(/\b(I|me|my|we|our|you|your)\b/g, function (m) { push(m.index, m.index + m[0].length, 'Personal pronoun: check whether your course allows first or second person.', null, 'formal'); });
      each(/!/g, function (m) { push(m.index, m.index + 1, 'Avoid exclamation marks in academic writing.', '.', 'formal'); });
      each(/\b(studies|research|experts|scientists) (show|shows|prove|proves|say|says|suggest|found)\b(?![^.]*\(\w)/gi, function (m) { push(m.index, m.index + m[0].length, 'Claim needs a citation, e.g. (Author, Year).', null, 'evidence'); });
      each(/\b(prove|proves|proven|always|never|everyone|nobody|undeniably)\b/gi, function (m) { push(m.index, m.index + m[0].length, 'Strong claim: consider hedging (“suggests”, “often”, “most”).', null, 'evidence'); });
      each(/(^|[.!?]\s+)(And|But|So|Also)\b/g, function (m) { var st = m.index + m[1].length; push(st, st + m[2].length, 'Avoid starting a formal sentence with “' + m[2] + '”. Try “However,”, “Therefore,” or “In addition,”.', null, 'formal'); });
      each(/\betc\.?/gi, function (m) { push(m.index, m.index + m[0].length, 'Name the examples instead of “etc.”.', null, 'formal'); });
    }
    if (mode === 'business') {
      each(wordRx(JARGON), function (m) { push(m.index, m.index + m[0].length, 'Jargon: say it plainly.', null, 'plain'); });
      each(wordRx(HEDGES), function (m) { push(m.index, m.index + m[0].length, 'Hedge word: remove it to sound more confident.', '', 'confidence'); });
      each(/\b(ASAP|EOD|COB)\b/g, function (m) { push(m.index, m.index + m[0].length, 'Give a specific date and time instead of “' + m[0] + '”.', null, 'action'); });
    }
    if (mode === 'email') {
      var first = text.trim().split(/\n/)[0] || '';
      if (!/^(subject:|hi|hello|kia ora|dear|good (morning|afternoon|evening)|hey|morena|tēnā koe|tena koe)\b/i.test(first)) push(0, Math.min(first.length, 40), 'Start with a greeting (e.g. “Kia ora Sam,” or “Hi Sam,”).', null, 'structure');
      if (!/(thanks|thank you|ngā mihi|nga mihi|kind regards|regards|cheers|best wishes|warm regards|noho ora mai)[,!.]?\s*\n?.{0,60}$/i.test(text.trim())) push(Math.max(0, text.length - 1), text.length, 'Add a sign-off (e.g. “Ngā mihi,” or “Kind regards,” and your name).', null, 'structure');
      if (!/\?|please|could you|can you|would you|let me know|by (mon|tue|wed|thu|fri|sat|sun|\d)/i.test(text)) push(0, 0, 'Make the request clear: what do you need, and by when?', null, 'action');
      each(/\b[A-Z]{4,}\b/g, function (m) { if (!/^(NZ|NZQA|IRD|ACC|GST|PDF|URL|HTML|ASAP|NZTA|MBIE|WINZ)$/.test(m[0])) push(m.index, m.index + m[0].length, 'All capitals can read as shouting.', m[0][0] + m[0].slice(1).toLowerCase(), 'tone'); });
      each(/!{2,}/g, function (m) { push(m.index, m.index + m[0].length, 'One exclamation mark is plenty.', '!', 'tone'); });
      each(wordRx(PASSIVE_AGGRESSIVE), function (m) { push(m.index, m.index + m[0].length, 'This phrase can sound passive-aggressive. Try “To recap,” or restate the key point kindly.', null, 'tone'); });
      if (stats(text).words > 250) push(0, 0, 'Long email (' + stats(text).words + ' words). Put the main request in the first two lines or use bullet points.', null, 'structure');
    }
    if (mode === 'creative') {
      each(wordRx(CLICHES), function (m) { push(m.index, m.index + m[0].length, 'Cliché: find a fresh image of your own.', null, 'voice'); });
      each(wordRx(FILTER), function (m) { push(m.index, m.index + m[0].length, 'Filter word: show the sensation directly (“The kettle hissed” rather than “She heard the kettle”).', null, 'voice'); });
      each(/\b\w{4,}ly\b/gi, function (m) { if (!/^(only|early|family|reply|supply|apply|holy|lovely|friendly|lonely|ugly|silly|belly|jelly|rally|fly|daily|likely|really)$/i.test(m[0])) push(m.index, m.index + m[0].length, 'Adverb: a stronger verb may say more (“ran quickly” → “sprinted”).', null, 'voice'); });
      each(/\b(very|really|so|extremely) (\w+)/gi, function (m) { push(m.index, m.index + m[0].length, 'Intensifier: choose one precise word (“very tired” → “exhausted”).', null, 'voice'); });
      // repeated content words close together
      var seen = {}; each(/\b[a-z]{5,}\b/gi, function (m) { var w = m[0].toLowerCase(); if (seen[w] !== undefined && m.index - seen[w] < 160 && !/^(their|there|which|about|would|could|should|these|those|where|other)$/.test(w)) push(m.index, m.index + m[0].length, 'Repeated word nearby: “' + m[0] + '”. Vary it?', null, 'voice'); seen[w] = m.index; });
    }
    if (mode === 'improve') {
      each(/\b(very|really|quite|extremely) (\w+)/gi, function (m) { push(m.index, m.index + m[0].length, 'Intensifier: one precise word is often stronger.', null, 'concise'); });
      each(wordRx(['just', 'actually', 'basically', 'literally', 'simply']), function (m) { push(m.index, m.index + m[0].length, 'Filler word: often safe to remove.', '', 'concise'); });
      each(/\b(there (is|are|was|were)) ((?:\w+ ){1,3})(who|that|which)\b/gi, function (m) { push(m.index, m.index + m[0].length, 'Try leading with the subject (“Many people think…” instead of “There are many people who think…”).', null, 'clarity'); });
    }
    return issues;
  }
  var EXP = { "can't": 'cannot', "won't": 'will not', "don't": 'do not', "doesn't": 'does not', "didn't": 'did not', "isn't": 'is not', "aren't": 'are not', "wasn't": 'was not', "weren't": 'were not', "haven't": 'have not', "hasn't": 'has not', "hadn't": 'had not', "couldn't": 'could not', "wouldn't": 'would not', "shouldn't": 'should not', "mustn't": 'must not', "it's": 'it is', "that's": 'that is', "there's": 'there is', "what's": 'what is', "let's": 'let us', "they're": 'they are', "we're": 'we are', "you're": 'you are', "i'm": 'I am', "i've": 'I have', "we've": 'we have', "they've": 'they have', "you've": 'you have', "i'll": 'I will', "we'll": 'we will', "they'll": 'they will', "you'll": 'you will', "i'd": 'I would', "they'd": 'they would', "we'd": 'we would', "he's": 'he is', "she's": 'she is' };
  function expand(w) { var k = w.toLowerCase().replace('’', "'"); var v = EXP[k]; if (!v) return null; return /^[A-Z]/.test(w) ? v[0].toUpperCase() + v.slice(1) : v; }

  async function onlineCheck(text, mode) {
    var body = new URLSearchParams({ text: text, language: 'en-NZ', level: mode === 'creative' ? 'default' : 'picky' });
    var r = await fetch('https://api.languagetool.org/v2/check', { method: 'POST', body: body });
    if (r.status === 429) throw Error('The online checker is busy (free limit reached). Wait a minute and try again.');
    if (!r.ok) throw Error('The online grammar checker is unavailable right now. Local checks still ran.');
    var d = await r.json();
    return (d.matches || []).map(function (m) {
      return { start: m.offset, end: m.offset + m.length, msg: m.message, fix: m.replacements && m.replacements[0] ? m.replacements[0].value : null, alts: (m.replacements || []).slice(0, 4).map(function (x) { return x.value; }), kind: (m.rule && m.rule.category && m.rule.category.name || 'grammar').toLowerCase(), src: 'LanguageTool' };
    });
  }
  function dedupe(list) {
    list.sort(function (a, b) { return a.start - b.start || (a.src === 'LanguageTool' ? -1 : 1); });
    var out = [];
    list.forEach(function (it) {
      if (out.some(function (o) { return o.start === it.start && o.end === it.end && (o.fix === it.fix || o.msg === it.msg); })) return;
      out.push(it);
    });
    return out;
  }
  function applyFix(text, it, fix) {
    var v = fix === undefined ? it.fix : fix;
    if (v === null || v === undefined) return text;
    var before = text.slice(0, it.start), after = text.slice(it.end);
    if (v === '') { before = before.replace(/ $/, ''); }
    var next = before + v + after;
    return next.replace(/ {2,}/g, ' ');
  }

  var SAMPLES = {
    academic: 'Studies show that kids who read alot do better at school. I think this is really important and it\'s something schools should definately do more of!',
    business: 'Hi team, in order to move the needle on this project we just need to circle back ASAP. The report was written by the team and will be sent to the client in the near future.',
    email: 'per my last email i still havent got the invoice. can you send it',
    creative: 'All of a sudden she felt very scared. She heard the door creak slowly and she saw a shadow move quickly across the very dark room.',
    improve: 'There are many people who think that the meeting was really very long and that it could of been shorter. Their going to ask for a shorter one next time.'
  };

  function WritingCheck() {
    var m = useState('improve'), mode = m[0], setMode = m[1];
    var t = useState(''), text = t[0], setText = t[1];
    var r = useState(null), res = r[0], setRes = r[1];
    var b = useState(false), busy = b[0], setBusy = b[1];
    var e = useState(''), err = e[0], setErr = e[1];
    var o = JNZX.useStored('jnzx-lt-consent', false), online = o[0], setOnline = o[1];
    var st = useMemo(function () { return stats(text); }, [text]);
    async function run() {
      setErr(''); setBusy(true);
      var list = localCheck(text, mode);
      if (online && text.trim()) {
        try { list = list.concat(await onlineCheck(text.slice(0, 18000), mode)); }
        catch (x) { setErr(x.message || 'The online checker could not be reached. Local checks still ran.'); }
      }
      setRes({ text: text, mode: mode, issues: dedupe(list) });
      setBusy(false);
    }
    function fixOne(it, fix) {
      var next = applyFix(text, it, fix);
      setText(next);
      // shift later issues, drop overlapping ones
      var delta = next.length - text.length;
      setRes(function (old) {
        if (!old) return old;
        return Object.assign({}, old, { text: next, issues: old.issues.filter(function (x) { return x !== it && (x.end <= it.start || x.start >= it.end); }).map(function (x) { return x.start >= it.end ? Object.assign({}, x, { start: x.start + delta, end: x.end + delta }) : x; }) });
      });
    }
    function fixAll() {
      if (!res) return;
      var list = res.issues.filter(function (x) { return x.fix !== null && x.fix !== undefined && x.kind !== 'clarity'; }).sort(function (a, b) { return b.start - a.start; });
      var cur = text, lastStart = Infinity;
      list.forEach(function (it) { if (it.end <= lastStart) { cur = applyFix(cur, it); lastStart = it.start; } });
      setText(cur); setRes(null);
    }
    var stale = res && res.text !== text;
    var modeInfo = MODES.find(function (x) { return x.id === mode; });
    var issues = res ? res.issues : [];
    var counts = {};
    issues.forEach(function (x) { counts[x.kind] = (counts[x.kind] || 0) + 1; });
    return h('section', { className: 'jx-page jx-writing', 'aria-labelledby': 'jx-writing-title' },
      h('p', { className: 'eyebrow' }, 'ASK MATEO · WRITING HELPER'),
      h('h2', { id: 'jx-writing-title' }, 'Check my writing'),
      h('p', { className: 'jx-muted' }, 'Paste a paragraph, email or essay. Choose a style and Mateo will point out grammar slips and give style tips you can accept with one tap.'),
      h(JNZX.Chips, { label: 'Writing style', options: MODES.map(function (x) { return { value: x.id, label: x.label }; }), value: mode, onChange: function (v) { setMode(v); setRes(null); } }),
      h('p', { className: 'small-note' }, modeInfo.hint),
      h('label', { className: 'jx-wide' }, 'Your text', h('textarea', { rows: 8, value: text, maxLength: 20000, onChange: function (ev) { setText(ev.target.value); }, placeholder: 'Type or paste your writing here…', spellCheck: true })),
      h('div', { className: 'jx-row jx-wstats', 'aria-live': 'polite' },
        h('span', null, st.words + ' words'), h('span', null, st.sentences + ' sentences'), h('span', null, 'Avg ' + st.avg.toFixed(1) + ' words/sentence'),
        st.words > 20 && h('span', null, 'Readability ' + st.flesch + ' · ' + readLabel(st.flesch)), h('span', null, '≈ ' + st.minutes + ' min read')),
      h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: online, onChange: function (ev) { setOnline(ev.target.checked); } }),
        h('span', null, 'Also check grammar online with LanguageTool. Your text is sent to LanguageTool (languagetool.org) only when you press Check. Leave this off for private text.')),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'primary', disabled: busy || !text.trim(), onClick: run }, busy ? 'Checking…' : 'Check my writing'),
        h('button', { type: 'button', className: 'secondary', onClick: function () { setText(SAMPLES[mode]); setRes(null); } }, 'Try an example'),
        res && issues.some(function (x) { return x.fix !== null && x.fix !== undefined; }) && h('button', { type: 'button', className: 'secondary', onClick: fixAll }, 'Apply all suggested fixes'),
        text && h('button', { type: 'button', className: 'secondary', onClick: function () { try { navigator.clipboard.writeText(text); } catch (x) {} } }, 'Copy text'),
        text && h('button', { type: 'button', className: 'secondary', onClick: function () { setText(''); setRes(null); } }, 'Clear')),
      err && h('p', { className: 'small-note', role: 'alert' }, err),
      res && h('div', { className: 'jx-wresults' },
        stale && h('p', { className: 'small-note' }, 'You have edited the text since the last check. Press Check again for fresh results.'),
        h('h3', null, issues.length ? issues.length + ' suggestion' + (issues.length === 1 ? '' : 's') : 'Looks good! No issues found for this style.'),
        issues.length > 0 && h('p', { className: 'jx-muted' }, Object.keys(counts).map(function (k) { return k + ': ' + counts[k]; }).join(' · ')),
        h('ol', { className: 'jx-issues' }, issues.slice(0, 80).map(function (it, i) {
          var snippet = res.text.slice(Math.max(0, it.start - 30), it.start) + '⟦' + res.text.slice(it.start, it.end) + '⟧' + res.text.slice(it.end, it.end + 30);
          var opts = it.alts && it.alts.length ? it.alts : (it.fix !== null && it.fix !== undefined ? [it.fix] : []);
          return h('li', { key: i, className: 'jx-issue jx-k-' + it.kind.replace(/\W/g, '') },
            h('div', { className: 'jx-issue-top' }, h('strong', null, it.msg), h('small', null, it.kind + (it.src === 'LanguageTool' ? ' · LanguageTool' : ''))),
            it.end > it.start && h('code', null, snippet.replace(/\n/g, ' ')),
            !stale && opts.length > 0 && h('div', { className: 'jx-row' }, opts.map(function (f, j) {
              return h('button', { key: j, type: 'button', className: 'secondary jx-fix', onClick: function () { fixOne(it, f); } }, f === '' ? 'Remove' : 'Use “' + f + '”');
            })));
        }))),
      h('p', { className: 'small-note' }, 'Suggestions are guides, not rules. Read the result aloud before you send it. Online checking uses LanguageTool’s free service, which has daily limits.'));
  }

  JNZX.WritingCheck = WritingCheck;
  var prevFriend = AIFriend;
  AIFriend = function MateoWithWriting(props) {
    return h(R.Fragment, null, h(prevFriend, props), h(WritingCheck));
  };
})();
