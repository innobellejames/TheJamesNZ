/* The James NZ — Ask Mateo (October 2026).
   A simple chat and a writing buddy. Everything runs on this device;
   nothing you type is sent anywhere. */
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

  var SAMPLES = {
    academic: 'Studies show that kids who read alot do better at school. I think this is really important and it\'s something schools should definately do more of!',
    business: 'Hi team, in order to move the needle on this project we just need to circle back ASAP. The report was written by the team and will be sent to the client in the near future.',
    email: 'per my last email i still havent got the invoice. can you send it',
    creative: 'All of a sudden she felt very scared. She heard the door creak slowly and she saw a shadow move quickly across the very dark room.',
    improve: 'there are many people who think that the meeting was really very long and that it could of been shorter. Their going to ask for a shorter one next time'
  };

  /* ---------- fixing engine ---------- */
  function applyFix(text, it, fix) {
    var v = fix === undefined ? it.fix : fix;
    if (v === null || v === undefined) return text;
    var before = text.slice(0, it.start), after = text.slice(it.end);
    if (v === '') { before = before.replace(/ $/, ''); }
    return (before + v + after).replace(/ {2,}/g, ' ');
  }
  function tidy(text) {
    var t = text.replace(/[ \t]+\n/g, '\n').replace(/^\s+|\s+$/g, '');
    t = t.replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
    t = t.replace(/\s+([,.;:!?])/g, '$1');
    if (t && !/[.!?…:"”)]$/.test(t) && !/\n/.test(t.slice(-40))) t += '.';
    return t;
  }
  function fixText(text, mode) {
    var cur = text, changes = [], tips = [], seenTip = {};
    for (var pass = 0; pass < 3; pass++) {
      var list = localCheck(cur, mode);
      var fixable = list.filter(function (x) { return x.fix !== null && x.fix !== undefined && x.kind !== 'clarity' && x.kind !== 'voice'; }).sort(function (a, b) { return b.start - a.start; });
      if (pass === 0) list.forEach(function (x) { if ((x.fix === null || x.fix === undefined || x.kind === 'clarity' || x.kind === 'voice') && !seenTip[x.msg]) { seenTip[x.msg] = 1; tips.push(x.msg); } });
      if (!fixable.length) break;
      var lastStart = Infinity, next = cur;
      fixable.forEach(function (it) {
        if (it.end <= lastStart) {
          var was = cur.slice(it.start, it.end);
          next = applyFix(next, it); lastStart = it.start;
          changes.push({ from: was, to: it.fix, why: it.msg });
        }
      });
      cur = next;
    }
    var tidied = tidy(cur);
    if (tidied !== cur.trim()) changes.push({ from: '', to: '', why: 'Capital letters and full stops tidied.' });
    return { text: tidied, changes: changes.reverse(), tips: tips.slice(0, 4) };
  }

  var STYLES = [
    { id: 'improve', label: 'Everyday' },
    { id: 'email', label: 'Email' },
    { id: 'business', label: 'Work' },
    { id: 'academic', label: 'School & uni' },
    { id: 'creative', label: 'Story' }
  ];

  /* ---------- "write it for me" drafts ---------- */
  function first(s, d) { s = (s || '').trim(); return s || d; }
  var KINDS = [
    { id: 'thanks', label: '🙏 Thank you', about: 'What are you thanking them for?', eg: 'the lovely dinner on Saturday' },
    { id: 'sorry', label: '💛 Sorry', about: 'What are you sorry about?', eg: 'missing your call yesterday' },
    { id: 'invite', label: '🎉 Invitation', about: 'What are you inviting them to? (and when)', eg: 'a barbecue at ours on Saturday at 5 pm' },
    { id: 'ask', label: '🙋 Ask for something', about: 'What do you need?', eg: 'a copy of the school newsletter' },
    { id: 'followup', label: '⏰ Gentle reminder', about: 'What are you following up?', eg: 'the invoice I sent on 3 October' },
    { id: 'congrats', label: '🌟 Congratulations', about: 'What are you celebrating?', eg: 'your new job' },
    { id: 'getwell', label: '🌷 Get well soon', about: 'Anything to mention? (optional)', eg: 'your knee operation' },
    { id: 'sympathy', label: '🕊️ Sympathy', about: 'Who has passed away? (optional)', eg: 'your dad' },
    { id: 'decline', label: '🙅 Say no kindly', about: 'What are you saying no to?', eg: 'helping at the fair this weekend' },
    { id: 'intro', label: '👋 Introduce myself', about: 'Who are you, in a few words?', eg: 'the new parent rep for Room 4' }
  ];
  var DRAFT = {
    thanks: [
      ['Thank you so much for {a}. It meant a lot to me.', 'I really appreciated your kindness and the time you gave.', 'I hope I can return the favour soon.'],
      ['I just wanted to say a big thank you for {a}.', 'It made my week, and I’m still smiling about it.', 'You’re a treasure.'],
      ['Thank you for {a}.', 'Your thoughtfulness made a real difference.', 'With warm thanks.']
    ],
    sorry: [
      ['I’m sorry about {a}.', 'That wasn’t fair to you, and I understand if it was frustrating.', 'I’ll do better next time, and I’d love to make it up to you.'],
      ['I owe you an apology for {a}.', 'There’s no excuse — I should have handled it better.', 'Thank you for your patience with me.'],
      ['Please accept my apology for {a}.', 'I value our friendship and didn’t want this to sit between us.', 'Can we catch up soon?']
    ],
    invite: [
      ['We’d love you to join us for {a}.', 'It will be relaxed — just good company and plenty of food.', 'Let me know if you can make it.'],
      ['You’re invited to {a}!', 'Bring yourself and your appetite; we’ll sort the rest.', 'Please reply by the end of the week so we can plan.'],
      ['Would you like to come to {a}?', 'It wouldn’t be the same without you.', 'No pressure — just let me know.']
    ],
    ask: [
      ['Could you please help me with {a}?', 'It would make things much easier on my end.', 'Thank you in advance — I really appreciate it.'],
      ['I was hoping you could help with {a}.', 'If now isn’t a good time, just let me know when suits you.', 'Many thanks.'],
      ['Would it be possible to get {a}?', 'Happy to work around whatever is easiest for you.', 'Thanks so much.']
    ],
    followup: [
      ['I’m following up on {a}.', 'I know things get busy, so this is just a friendly nudge.', 'Could you let me know when you’ve had a chance to look at it?'],
      ['Just checking in about {a}.', 'If you need anything else from me, I’m happy to help.', 'Thanks for your time.'],
      ['I wanted to touch base about {a}.', 'Could you give me an update when you can?', 'Thank you.']
    ],
    congrats: [
      ['Congratulations on {a}!', 'You’ve worked so hard for this, and it’s wonderful to see.', 'Enjoy every moment — you deserve it.'],
      ['What fantastic news about {a}!', 'I’m so proud of you.', 'Let’s celebrate soon.'],
      ['Huge congratulations on {a}.', 'This is a big step and a well-earned one.', 'Wishing you every success.']
    ],
    getwell: [
      ['I was sorry to hear about {a}.', 'I’m thinking of you and hoping each day is a little easier.', 'If there’s anything I can do — meals, errands, a chat — just say the word.'],
      ['Sending you get-well wishes{A}.', 'Take all the time you need to rest.', 'We’re looking forward to seeing you back on your feet.'],
      ['Just a note to say I’m thinking of you{A}.', 'Be gentle with yourself while you recover.', 'Here if you need anything.']
    ],
    sympathy: [
      ['I’m so sorry for the loss of {a}.', 'Please know I’m thinking of you and your family.', 'If you’d like company or help with anything, I’m here.'],
      ['My heart goes out to you as you grieve {a}.', 'I hope the love around you brings a little comfort.', 'With deepest sympathy.'],
      ['I was so sad to hear about {a}.', 'There are no right words, but I wanted you to know I care.', 'Holding you in my thoughts and prayers.']
    ],
    decline: [
      ['Thank you for thinking of me for {a}.', 'Unfortunately I can’t say yes this time.', 'I hope it goes really well, and please ask me again.'],
      ['I’m sorry, but I won’t be able to manage {a}.', 'I’d rather say no now than let you down later.', 'Thanks for understanding.'],
      ['I appreciate the offer of {a}.', 'I need to keep my plate a bit lighter right now, so I’ll pass.', 'Wishing you all the best with it.']
    ],
    intro: [
      ['I’m {f}, {a}.', 'I wanted to say hello and let you know I’m happy to help with anything you need.', 'It’s lovely to meet you.'],
      ['Let me introduce myself — I’m {f}, {a}.', 'Please feel free to get in touch any time.', 'I look forward to working with you.'],
      ['My name is {f}, and I’m {a}.', 'I’m keen to get to know everyone and help where I can.', 'Feel free to say hi!']
    ]
  };
  var SUBJ = { thanks: 'Thank you', sorry: 'I’m sorry', invite: 'You’re invited', ask: 'A quick request', followup: 'Following up', congrats: 'Congratulations!', getwell: 'Thinking of you', sympathy: 'With sympathy', decline: 'Thank you for asking', intro: 'Hello from {f}' };
  function makeDraft(kind, to, from, about, tone, n) {
    var k = KINDS.find(function (x) { return x.id === kind; }) || KINDS[0];
    var set = DRAFT[kind], v = set[n % set.length];
    var a = first(about, k.id === 'getwell' ? 'you being unwell' : k.id === 'sympathy' ? 'your loved one' : k.eg);
    var A = (about || '').trim() ? ' after ' + about.trim() : '';
    var f = first(from, 'your name');
    var body = v.map(function (s) { return s.replace(/\{a\}/g, a).replace(/\{A\}/g, A).replace(/\{f\}/g, f); });
    if (tone === 'short') body = [body[0], body[2]];
    var hi = tone === 'formal' ? 'Dear ' + first(to, 'Sir or Madam') + ',' : (first(to, '') ? 'Hi ' + to.trim() + ',' : 'Kia ora,');
    var bye = tone === 'formal' ? 'Kind regards,' : kind === 'sympathy' ? 'With love,' : kind === 'intro' || kind === 'ask' || kind === 'followup' ? 'Thanks,' : 'Warmly,';
    if (tone === 'formal') body = body.map(function (s) { return s.replace(/’s(?= )/g, ' is').replace(/I’m/g, 'I am').replace(/can’t/g, 'cannot').replace(/won’t/g, 'will not').replace(/I’d/g, 'I would').replace(/We’d/g, 'We would').replace(/I’ll/g, 'I will').replace(/You’re/g, 'You are').replace(/you’ve/g, 'you have').replace(/wasn’t/g, 'was not').replace(/didn’t/g, 'did not').replace(/isn’t/g, 'is not').replace(/wouldn’t/g, 'would not').replace(/There’s/g, 'There is').replace(/there’s/g, 'there is').replace(/!/g, '.'); });
    return { subject: SUBJ[kind].replace('{f}', first(from, 'me')), text: hi + '\n\n' + body.join(' ') + '\n\n' + bye + '\n' + first(from, '[Your name]') };
  }

  function copyText(t, done) { try { navigator.clipboard.writeText(t).then(function () { done('Copied.'); }, function () { done('Select the text and copy it.'); }); } catch (e) { done('Select the text and copy it.'); } }

  /* ---------- the writing buddy ---------- */
  function WriteBuddy(props) {
    var w = useState(props.start || 'fix'), way = w[0], setWay = w[1];
    var m = JNZX.useStored('jnzx-wb-style', 'improve'), mode = m[0], setMode = m[1];
    var t = JNZX.useStored('jnzx-wb-text', ''), text = t[0], setText = t[1];
    var r = useState(null), res = r[0], setRes = r[1];
    var msgS = useState(''), msg = msgS[0], setMsg = msgS[1];
    var k = useState('thanks'), kind = k[0], setKind = k[1];
    var to = useState(''), from = JNZX.useStored('jnzx-wb-from', ''), ab = useState(''), tn = useState('warm'), nn = useState(0);
    var kinfo = KINDS.find(function (x) { return x.id === kind; });
    var draft = makeDraft(kind, to[0], from[0], ab[0], tn[0], nn[0]);
    var st = useMemo(function () { return stats(text); }, [text]);
    function run() { setMsg(''); setRes(fixText(text, mode)); }
    return h('div', { className: 'jx-wb' },
      h('div', { className: 'jx-wb-way', role: 'tablist', 'aria-label': 'Writing help' },
        [['fix', '✨ Fix my writing'], ['draft', '📝 Write it for me']].map(function (x) {
          return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': way === x[0], className: way === x[0] ? 'is-on' : '', onClick: function () { setWay(x[0]); setMsg(''); } }, x[1]);
        })),
      way === 'fix' ? h('div', { className: 'jx-wb-pane' },
        h(JNZX.Chips, { label: 'Kind of writing', options: STYLES.map(function (x) { return { value: x.id, label: x.label }; }), value: mode, onChange: function (v) { setMode(v); setRes(null); } }),
        h('label', { className: 'jx-sr', htmlFor: 'jx-wb-text' }, 'Your writing'),
        h('textarea', { id: 'jx-wb-text', rows: 6, value: text, maxLength: 20000, spellCheck: true, placeholder: 'Paste or type your writing here…', onChange: function (ev) { setText(ev.target.value); setRes(null); } }),
        h('div', { className: 'jx-row' },
          h('button', { type: 'button', className: 'primary', disabled: !text.trim(), onClick: run }, '✨ Fix it'),
          !text && h('button', { type: 'button', className: 'secondary', onClick: function () { setText(SAMPLES[mode]); } }, 'Try an example'),
          text && h('button', { type: 'button', className: 'secondary', onClick: function () { setText(''); setRes(null); } }, 'Clear'),
          text && h('small', { className: 'jx-muted' }, st.words + ' words' + (st.words > 20 ? ' · ' + readLabel(st.flesch).toLowerCase() : ''))),
        res && h('div', { className: 'jx-wb-out', 'aria-live': 'polite' },
          h('p', { className: 'jx-wb-label' }, res.changes.length ? 'Here’s your polished version' : 'Looks good — nothing to fix.'),
          res.changes.length > 0 && h('div', { className: 'jx-wb-result' }, res.text),
          h('div', { className: 'jx-row' },
            res.changes.length > 0 && h('button', { type: 'button', className: 'primary', onClick: function () { setText(res.text); setRes(null); setMsg('Done — your text is updated.'); } }, 'Use this'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { copyText(res.changes.length ? res.text : text, setMsg); } }, 'Copy')),
          res.changes.length > 0 && h('details', { className: 'jx-wb-why' }, h('summary', null, 'What I changed (' + res.changes.length + ')'),
            h('ul', null, res.changes.slice(0, 12).map(function (c, i) { return h('li', { key: i }, c.from ? h('span', null, h('s', null, c.from), ' → ', h('strong', null, c.to === '' ? '(removed)' : c.to), ' · ') : null, c.why); }))),
          res.tips.length > 0 && h('div', { className: 'jx-wb-tips' }, h('strong', null, '💡 Tips'), h('ul', null, res.tips.map(function (x, i) { return h('li', { key: i }, x); })))),
        msg && h('p', { className: 'small-note', role: 'status' }, msg))
      : h('div', { className: 'jx-wb-pane' },
        h(JNZX.Chips, { label: 'What do you want to write?', options: KINDS.map(function (x) { return { value: x.id, label: x.label }; }), value: kind, onChange: function (v) { setKind(v); nn[1](0); ab[1](''); } }),
        h('div', { className: 'jx-wb-fields' },
          h('label', null, 'To', h('input', { value: to[0], maxLength: 60, placeholder: 'e.g. Aunty Rose', onChange: function (e) { to[1](e.target.value); } })),
          h('label', null, 'From', h('input', { value: from[0], maxLength: 60, placeholder: 'Your name', onChange: function (e) { from[1](e.target.value); } })),
          h('label', { className: 'jx-wide' }, kinfo.about, h('input', { value: ab[0], maxLength: 160, placeholder: 'e.g. ' + kinfo.eg, onChange: function (e) { ab[1](e.target.value); } }))),
        h(JNZX.Chips, { label: 'Tone', options: [{ value: 'warm', label: 'Warm' }, { value: 'formal', label: 'Formal' }, { value: 'short', label: 'Short' }], value: tn[0], onChange: tn[1] }),
        h('div', { className: 'jx-wb-out' },
          h('p', { className: 'jx-wb-label' }, 'Subject: ', h('strong', null, draft.subject)),
          h('div', { className: 'jx-wb-result' }, draft.text),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'primary', onClick: function () { copyText(draft.text, setMsg); } }, 'Copy'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { nn[1](nn[0] + 1); setMsg(''); } }, '🔄 Another version'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { setText(draft.text); setMode('email'); setRes(null); setWay('fix'); } }, 'Edit it'))),
        msg && h('p', { className: 'small-note', role: 'status' }, msg)));
  }
  JNZX.WriteBuddy = WriteBuddy;
  JNZX.WritingCheck = WriteBuddy;

  /* ---------- Ask Mateo: one simple box ---------- */
  var MORE = {
    calm: ['Breathe in for four, out for six. You don’t have to solve everything right now.', 'Put one worry on paper and leave it there for tonight.', 'Tough days are allowed. So are naps, cups of tea and asking for help.', 'You have got through every hard day so far. Today can be one more.'],
    family: ['The dishes can wait; the bedtime story can’t.', 'A family is a team that keeps forgiving the referee.', 'Ten minutes of full attention beats an hour of half-listening.'],
    goals: ['Done is better than perfect. Start with five minutes.', 'Small steps still cover distance.', 'You don’t need more motivation — just a smaller first step.'],
    thanks: ['Say thank you out loud today. It costs nothing and warms two hearts.', 'Joy shared is joy doubled.', 'Count the good things first; the rest can queue.'],
    healing: ['Rest is part of getting better, not a break from it.', 'Small improvements are still improvements.'],
    grief: ['Grief is love with nowhere to go. Let it be gentle with you.', 'There’s no timetable for missing someone.'],
    faith: ['Hope is a small light that never needs to be big to be enough.', 'Prayer can be as simple as “help” and “thank you”.'],
    everyday: ['Be the reason someone smiles today.', 'A cup of tea and a kind word fix more than you’d think.', 'Ordinary days hold the best little surprises.', 'Make room for one thing that makes you smile.', 'Kindness is free — sprinkle it everywhere.']
  };
  var COFFEE = ['Coffee beans are really the seeds of a bright red fruit called a coffee cherry.', 'The flat white is a proud Kiwi–Aussie favourite — and both countries claim it.', 'Lighter roasts usually keep a little more caffeine than dark roasts.', 'Coffee tastes best within a few weeks of roasting. Keep beans airtight and away from light.', 'A splash of cold water on boiled water (about 92–96 °C) is the sweet spot for brewing.'];
  var GREET = /^(hello|hi|hey|kia ora|morena|mōrena|good (morning|afternoon|evening)|yo)\b/i;
  function pick(list, n) { return list[n % list.length]; }
  function moodOf(q) { try { var keys = Object.keys(messages); for (var i = 0; i < keys.length; i++) if (keys[i] !== 'everyday' && messages[keys[i]].words.test(q)) return keys[i]; } catch (e) {} return 'everyday'; }
  function reply(q, n) {
    var s = q.trim(), low = s.toLowerCase();
    if (/write|email|letter|essay|grammar|spell|proofread|check my|fix my|word(ing)?|message to|card/.test(low)) return { text: 'I’d love to help you write. Tap below and I’ll fix your text or start a draft for you.', write: /fix|check|proofread|grammar|spell/.test(low) ? 'fix' : 'draft' };
    if (GREET.test(s)) return { text: 'Kia ora! I’m Mateo. I can share a little hope, a quiet prayer, a coffee thought — or help you write something. What would you like?' };
    if (/^(thanks|thank you|cheers|ta)\b/i.test(s)) return { text: 'You’re very welcome. I’m always here for a little kindness.' };
    if (/\btime\b/.test(low) && /what/.test(low)) return { text: 'In New Zealand it’s ' + new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', hour: 'numeric', minute: '2-digit' }).format(new Date()) + '.' };
    if (/\b(date|day is it|today)\b/.test(low) && /what/.test(low)) return { text: 'In New Zealand it’s ' + new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) + '.' };
    if (/coffee|cuppa|latte|flat white|tea\b|break/.test(low)) return { text: '☕ Coffee thought: ' + pick(COFFEE, n) + '\n\nNow sit for a minute — you’ve earned it.' };
    if (/joke|funny|laugh/.test(low)) return { text: pick(['Why did the kiwi cross the road? To prove it wasn’t chicken. 🥝', 'I told my coffee a joke. It didn’t laugh — it was too bitter.', 'What do you call a sheep with no legs? A cloud. ☁️'], n) };
    var mood = moodOf(s), base = (messages && messages[mood]) || { quotes: [], prayer: '' };
    if (/pray|prayer|amen|bless/.test(low)) return { text: '🙏 Here’s a short prayer you can make your own:\n\n' + (base.prayer || messages.everyday.prayer) };
    var all = (base.quotes || []).concat(MORE[mood] || []);
    var lead = mood === 'calm' ? 'That sounds heavy. Be gentle with yourself.' : mood === 'grief' ? 'I’m so sorry. I’m here with you.' : mood === 'healing' ? 'Sending you care.' : mood === 'thanks' ? 'I love that!' : 'Here’s a little lift for you.';
    return { text: lead + '\n\n“' + pick(all, n) + '”' };
  }
  var IDEAS = [['🌤️', 'A little hope', 'Share a little hope for today.'], ['🙏', 'A quiet prayer', 'A prayer for my family, please.'], ['😮‍💨', 'Feeling overwhelmed', 'I am feeling overwhelmed.'], ['☕', 'Coffee break', 'Coffee break thought, please.'], ['😄', 'Make me smile', 'Tell me a joke.']];

  function AskMateo() {
    var v = useState('chat'), view = v[0], setView = v[1];
    var wv = useState('fix'), wway = wv[0], setWway = wv[1];
    var ms = useState([]), msgs = ms[0], setMsgs = ms[1];
    var tx = useState(''), text = tx[0], setText = tx[1];
    var end = R.useRef(null), count = R.useRef(0);
    R.useEffect(function () { var log = end.current && end.current.parentElement; if (log && msgs.length) log.scrollTop = log.scrollHeight; }, [msgs]);
    function say(q) {
      q = (q || '').trim(); if (!q) return;
      var r = reply(q, count.current++);
      setMsgs(function (old) { return old.concat([{ who: 'me', text: q }, { who: 'mateo', text: r.text, write: r.write }]).slice(-30); });
      setText('');
    }
    function speak(t) { try { var u = new SpeechSynthesisUtterance(t.replace(/[“”]/g, '')); u.lang = 'en-NZ'; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }
    function openWrite(way) { setWway(way || 'fix'); setView('write'); }
    var canSpeak = typeof window !== 'undefined' && 'speechSynthesis' in window;
    return h('section', { className: 'jx-mateo', 'aria-label': 'Ask Mateo' },
      h('header', { className: 'jx-mateo-top' },
        h('span', { className: 'jx-mateo-pic', role: 'img', 'aria-label': 'Mateo the Labrador', style: { backgroundImage: 'url("' + jAsset('./mateo-smile-clean.webp') + '")' } }),
        h('div', null, h('h1', null, 'Ask Mateo'), h('p', null, 'A little kindness and help with writing.')),
        h('div', { className: 'jx-mateo-switch', role: 'tablist', 'aria-label': 'Choose' },
          h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'chat', className: view === 'chat' ? 'is-on' : '', onClick: function () { setView('chat'); } }, '💬 Chat'),
          h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'write', className: view === 'write' ? 'is-on' : '', onClick: function () { openWrite(wway); } }, '✍️ Write'))),
      view === 'chat' ? h('div', { className: 'jx-mateo-chat' },
        h('div', { className: 'jx-mateo-log', role: 'log', 'aria-live': 'polite' },
          h('div', { className: 'jx-bub mateo' }, 'Kia ora! Tap an idea or type to me.'),
          msgs.map(function (m, i) {
            return h('div', { key: i, className: 'jx-bub ' + m.who },
              m.text,
              m.who === 'mateo' && h('span', { className: 'jx-bub-tools' },
                m.write && h('button', { type: 'button', className: 'primary', onClick: function () { openWrite(m.write); } }, '✍️ Open writing help'),
                canSpeak && h('button', { type: 'button', className: 'jx-bub-btn', 'aria-label': 'Listen', onClick: function () { speak(m.text); } }, '🔊'),
                h('button', { type: 'button', className: 'jx-bub-btn', 'aria-label': 'Copy', onClick: function () { copyText(m.text, function () {}); } }, '📋')));
          }),
          h('div', { ref: end })),
        h('div', { className: 'jx-mateo-ideas' },
          IDEAS.map(function (x) { return h('button', { key: x[1], type: 'button', onClick: function () { say(x[2]); } }, x[0] + ' ' + x[1]); }),
          h('button', { type: 'button', className: 'is-write', onClick: function () { openWrite('fix'); } }, '✍️ Help me write')),
        h('form', { className: 'jx-mateo-send', onSubmit: function (e) { e.preventDefault(); say(text); } },
          h('label', { className: 'jx-sr', htmlFor: 'jx-mateo-in' }, 'Message Mateo'),
          h('input', { id: 'jx-mateo-in', value: text, maxLength: 500, autoComplete: 'off', placeholder: 'Message Mateo…', onChange: function (e) { setText(e.target.value); } }),
          h('button', { type: 'submit', className: 'primary', disabled: !text.trim() }, 'Send')))
      : h(WriteBuddy, { key: wway, start: wway }),
      h('p', { className: 'small-note jx-mateo-note' }, 'Mateo runs on your device — nothing you type leaves it. For urgent help, call or text 1737 (free, any time) or 111 in an emergency.'));
  }
  JNZX.AskMateo = AskMateo;
  AIFriend = function AskMateoPage() { return h(AskMateo); };
})();
