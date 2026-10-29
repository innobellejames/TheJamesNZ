/* The James NZ — Ask Mateo (October 2026).
   A simple chat and a writing buddy. Everything runs on this device;
   nothing you type is sent anywhere. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useMemo = R.useMemo, useEffect = R.useEffect;
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
      each(wordRx(['just', 'actually', 'basically', 'literally', 'simply']), function (m) { push(m.index, m.index + m[0].length, 'Filler word: “' + m[0] + '” can often be removed.', null, 'concise'); });
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

  /* ---------- Mateo's grammar fixer (runs on this device) ---------- */
  var IRR = {
    be: ['is', 'was', 'being', 'been'], have: ['has', 'had', 'having', 'had'], do: ['does', 'did', 'doing', 'done'], go: ['goes', 'went', 'going', 'gone'],
    say: ['says', 'said', 'saying', 'said'], get: ['gets', 'got', 'getting', 'got'], make: ['makes', 'made', 'making', 'made'], know: ['knows', 'knew', 'knowing', 'known'],
    think: ['thinks', 'thought', 'thinking', 'thought'], take: ['takes', 'took', 'taking', 'taken'], see: ['sees', 'saw', 'seeing', 'seen'], come: ['comes', 'came', 'coming', 'come'],
    give: ['gives', 'gave', 'giving', 'given'], find: ['finds', 'found', 'finding', 'found'], tell: ['tells', 'told', 'telling', 'told'], become: ['becomes', 'became', 'becoming', 'become'],
    leave: ['leaves', 'left', 'leaving', 'left'], feel: ['feels', 'felt', 'feeling', 'felt'], bring: ['brings', 'brought', 'bringing', 'brought'], begin: ['begins', 'began', 'beginning', 'begun'],
    keep: ['keeps', 'kept', 'keeping', 'kept'], hold: ['holds', 'held', 'holding', 'held'], write: ['writes', 'wrote', 'writing', 'written'], stand: ['stands', 'stood', 'standing', 'stood'],
    hear: ['hears', 'heard', 'hearing', 'heard'], let: ['lets', 'let', 'letting', 'let'], mean: ['means', 'meant', 'meaning', 'meant'], set: ['sets', 'set', 'setting', 'set'],
    meet: ['meets', 'met', 'meeting', 'met'], run: ['runs', 'ran', 'running', 'run'], pay: ['pays', 'paid', 'paying', 'paid'], sit: ['sits', 'sat', 'sitting', 'sat'],
    speak: ['speaks', 'spoke', 'speaking', 'spoken'], lie: ['lies', 'lay', 'lying', 'lain'], lead: ['leads', 'led', 'leading', 'led'], read: ['reads', 'read', 'reading', 'read'],
    grow: ['grows', 'grew', 'growing', 'grown'], lose: ['loses', 'lost', 'losing', 'lost'], fall: ['falls', 'fell', 'falling', 'fallen'], send: ['sends', 'sent', 'sending', 'sent'],
    build: ['builds', 'built', 'building', 'built'], understand: ['understands', 'understood', 'understanding', 'understood'], draw: ['draws', 'drew', 'drawing', 'drawn'],
    break: ['breaks', 'broke', 'breaking', 'broken'], spend: ['spends', 'spent', 'spending', 'spent'], cut: ['cuts', 'cut', 'cutting', 'cut'], rise: ['rises', 'rose', 'rising', 'risen'],
    drive: ['drives', 'drove', 'driving', 'driven'], buy: ['buys', 'bought', 'buying', 'bought'], wear: ['wears', 'wore', 'wearing', 'worn'], choose: ['chooses', 'chose', 'choosing', 'chosen'],
    eat: ['eats', 'ate', 'eating', 'eaten'], drink: ['drinks', 'drank', 'drinking', 'drunk'], sleep: ['sleeps', 'slept', 'sleeping', 'slept'], swim: ['swims', 'swam', 'swimming', 'swum'],
    sing: ['sings', 'sang', 'singing', 'sung'], teach: ['teaches', 'taught', 'teaching', 'taught'], catch: ['catches', 'caught', 'catching', 'caught'], fly: ['flies', 'flew', 'flying', 'flown'],
    forget: ['forgets', 'forgot', 'forgetting', 'forgotten'], win: ['wins', 'won', 'winning', 'won'], sell: ['sells', 'sold', 'selling', 'sold'], fight: ['fights', 'fought', 'fighting', 'fought'],
    throw: ['throws', 'threw', 'throwing', 'thrown'], wake: ['wakes', 'woke', 'waking', 'woken'], ride: ['rides', 'rode', 'riding', 'ridden'], hide: ['hides', 'hid', 'hiding', 'hidden'],
    shut: ['shuts', 'shut', 'shutting', 'shut'], put: ['puts', 'put', 'putting', 'put'], hit: ['hits', 'hit', 'hitting', 'hit'], cost: ['costs', 'cost', 'costing', 'cost'],
    feed: ['feeds', 'fed', 'feeding', 'fed'], forgive: ['forgives', 'forgave', 'forgiving', 'forgiven'], shake: ['shakes', 'shook', 'shaking', 'shaken'], steal: ['steals', 'stole', 'stealing', 'stolen'],
    stick: ['sticks', 'stuck', 'sticking', 'stuck'], sweep: ['sweeps', 'swept', 'sweeping', 'swept'], dig: ['digs', 'dug', 'digging', 'dug'], bite: ['bites', 'bit', 'biting', 'bitten'],
    blow: ['blows', 'blew', 'blowing', 'blown'], freeze: ['freezes', 'froze', 'freezing', 'frozen'], hang: ['hangs', 'hung', 'hanging', 'hung'], light: ['lights', 'lit', 'lighting', 'lit']
  };
  var REG = ['walk', 'talk', 'play', 'work', 'live', 'love', 'like', 'want', 'need', 'help', 'start', 'finish', 'call', 'ask', 'answer', 'try', 'cry', 'study', 'carry', 'stay', 'look', 'watch', 'cook',
    'clean', 'wash', 'open', 'close', 'visit', 'move', 'use', 'enjoy', 'travel', 'arrive', 'decide', 'happen', 'listen', 'learn', 'remember', 'change', 'wait', 'stop', 'plan', 'shop', 'drop',
    'laugh', 'smile', 'jump', 'dance', 'climb', 'pray', 'bake', 'paint', 'fix', 'push', 'pull', 'hope', 'share', 'care', 'thank', 'agree', 'believe', 'pass', 'miss', 'kiss', 'reply', 'text',
    'email', 'book', 'pick', 'join', 'turn', 'show', 'follow', 'save', 'invite', 'attend', 'receive', 'explain', 'prepare', 'complete', 'return', 'check', 'park', 'rest', 'relax', 'hug', 'worry', 'tidy', 'bark', 'meow', 'howl', 'purr', 'chirp', 'quack', 'moo', 'buzz',
    'correct', 'accept', 'achieve', 'act', 'add', 'admire', 'advise', 'affect', 'aim', 'alert', 'amaze', 'annoy', 'apologise', 'appreciate', 'approach', 'argue', 'arrest', 'attach', 'attack', 'attract', 'avoid', 'back', 'bang', 'beg', 'behave', 'belong', 'bless', 'blink', 'boil', 'bolt', 'bomb', 'borrow', 'bounce', 'bow', 'brake', 'breathe', 'brush', 'bump', 'burn', 'bury', 'buzz', 'calculate', 'camp', 'cause', 'challenge', 'charge', 'chase', 'cheat', 'cheer', 'chew', 'chop', 'claim', 'clap', 'clear', 'coach', 'collect', 'comb', 'comment', 'communicate', 'compare', 'compete', 'complain', 'concentrate', 'concern', 'confess', 'confuse', 'connect', 'consult', 'contain', 'control', 'copy', 'cough', 'count', 'cover', 'crash', 'crawl', 'create', 'cross', 'crush', 'cure', 'curl', 'curve', 'cycle', 'damage', 'dare', 'decorate', 'deliver', 'depend', 'deserve', 'destroy', 'detect', 'develop', 'disagree', 'disappear', 'discover', 'dislike', 'divide', 'double', 'doubt', 'drag', 'drain', 'dream', 'dress', 'drown', 'dry', 'dust', 'earn', 'educate', 'empty', 'encourage', 'end', 'enjoy', 'enter', 'entertain', 'escape', 'examine', 'excite', 'excuse', 'exercise', 'exist', 'expand', 'expect', 'explode', 'extend', 'fade', 'fail', 'fasten', 'fax', 'fear', 'fit', 'flash', 'float', 'flood', 'flow', 'fold', 'fool', 'force', 'form', 'found', 'frighten', 'fry', 'gather', 'gaze', 'glow', 'glue', 'grab', 'grease', 'greet', 'grin', 'grip', 'groan', 'guarantee', 'guess', 'guide', 'hammer', 'handle', 'hang', 'happen', 'hate', 'haunt', 'heal', 'heat', 'hop', 'hum', 'hunt', 'hurry', 'identify', 'ignore', 'imagine', 'impress', 'improve', 'include', 'increase', 'influence', 'inform', 'inject', 'injure', 'instruct', 'intend', 'interest', 'interrupt', 'introduce', 'invent', 'irritate', 'itch', 'jog', 'joke', 'judge', 'juggle', 'kick', 'kill', 'kneel', 'knit', 'knock', 'launch', 'lean', 'learn', 'lick', 'lighten', 'load', 'lock', 'love', 'manage', 'march', 'marry', 'match', 'measure', 'melt', 'memorise', 'mend', 'mention', 'mix', 'moan', 'mourn', 'multiply', 'murder', 'need', 'nod', 'notice', 'obey', 'observe', 'obtain', 'occur', 'offend', 'offer', 'open', 'operate', 'organise', 'overflow', 'owe', 'own', 'pack', 'paddle', 'paint', 'park', 'pause', 'peck', 'pedal', 'peel', 'peep', 'perform', 'permit', 'phone', 'pick', 'pinch', 'play', 'please', 'plug', 'poke', 'polish', 'pop', 'possess', 'pour', 'practise', 'praise', 'pray', 'preach', 'precede', 'prefer', 'prepare', 'preserve', 'press', 'pretend', 'prevent', 'prick', 'print', 'produce', 'promise', 'protect', 'provide', 'pull', 'pump', 'punch', 'puncture', 'punish', 'purr', 'push', 'question', 'radiate', 'raise', 'reach', 'realise', 'receive', 'recognise', 'record', 'reduce', 'reflect', 'refuse', 'regret', 'reign', 'reject', 'rejoice', 'relax', 'release', 'rely', 'remain', 'remember', 'remind', 'remove', 'repair', 'repeat', 'replace', 'reply', 'report', 'reproduce', 'request', 'rescue', 'retire', 'return', 'rinse', 'risk', 'rob', 'roll', 'rot', 'rub', 'ruin', 'rush', 'sail', 'satisfy', 'save', 'saw', 'scare', 'scatter', 'scold', 'scorch', 'scrape', 'scratch', 'scream', 'scribble', 'scrub', 'search', 'separate', 'serve', 'settle', 'share', 'shave', 'shelter', 'shiver', 'shock', 'shop', 'shrug', 'sigh', 'sign', 'sip', 'skip', 'slap', 'slip', 'slow', 'smash', 'smell', 'smile', 'smoke', 'snatch', 'sneeze', 'sniff', 'snore', 'soak', 'soothe', 'spare', 'spark', 'sparkle', 'spell', 'spill', 'spoil', 'spray', 'sprout', 'squash', 'squeak', 'squeal', 'squeeze', 'stain', 'stare', 'start', 'stay', 'steer', 'step', 'stir', 'stitch', 'stop', 'strap', 'strengthen', 'stretch', 'strip', 'stroke', 'stuff', 'subtract', 'succeed', 'suck', 'suffer', 'suggest', 'suit', 'supply', 'support', 'suppose', 'surprise', 'surround', 'suspect', 'suspend', 'talk', 'tame', 'taste', 'tease', 'telephone', 'tempt', 'terrify', 'test', 'thank', 'thaw', 'tickle', 'tip', 'tire', 'touch', 'trace', 'train', 'transport', 'travel', 'treat', 'tremble', 'trick', 'trouble', 'trust', 'try', 'tug', 'tumble', 'turn', 'twist', 'undress', 'unfasten', 'unite', 'unlock', 'unpack', 'untidy', 'upload', 'download', 'use', 'vanish', 'visit', 'wail', 'wait', 'walk', 'wander', 'want', 'warm', 'warn', 'wash', 'waste', 'watch', 'weigh', 'whine', 'whip', 'whirl', 'whisper', 'whistle', 'wink', 'wipe', 'wish', 'wobble', 'wonder', 'work', 'worry', 'wrap', 'wreck', 'wrestle', 'wriggle', 'yawn', 'yell', 'zip', 'zoom', 'update', 'confirm', 'submit', 'select', 'delete', 'click', 'scroll', 'login', 'text', 'message', 'email', 'print', 'scan', 'reply', 'forward', 'cancel', 'schedule', 'book', 'order', 'install', 'refresh', 'reset', 'charge',
    'solve', 'damage', 'destroy', 'repair', 'design', 'discover', 'invent', 'produce', 'create', 'develop', 'establish', 'publish', 'release', 'postpone', 'approve', 'reject', 'require', 'replace', 'remove', 'injure', 'kill', 'arrest', 'report', 'print', 'translate', 'record', 'recycle', 'measure', 'increase', 'decrease', 'reduce', 'hurry', 'inform', 'announce', 'introduce', 'confirm', 'cancel', 'arrange', 'remind', 'warn', 'allow', 'encourage', 'present', 'perform', 'treat', 'serve', 'paint', 'decorate', 'clean', 'fill', 'pour', 'mix', 'boil', 'fry', 'grill', 'roast', 'bake', 'chop', 'slice', 'wrap', 'pack', 'post', 'mail', 'type', 'sign', 'test', 'mark', 'grade', 'train', 'coach', 'guide', 'lift', 'carry', 'load', 'deliver', 'own', 'belong', 'contain', 'deserve', 'recognise', 'recognize', 'seem', 'exist', 'appear', 'disappear', 'occur', 'die', 'emerge',
    'suggest', 'improve', 'apply', 'complain', 'recommend', 'discuss', 'depend', 'mind', 'avoid', 'consider', 'imagine', 'practise', 'describe', 'reach', 'cross', 'fill', 'earn', 'borrow', 'rent', 'deliver', 'contact', 'note', 'notice', 'collect', 'protect', 'offer', 'manage', 'organise', 'celebrate', 'graduate', 'marry', 'hate', 'prefer', 'promise', 'refuse', 'expect', 'intend', 'afford', 'continue', 'stay'];
  var BADREG = 'saw found mine lie long last number part face head hand time name place point matter mate fancy object present rock rule ski sin box fence file film frame list mark nail note plant post queue race rain snow sound spot stamp store switch tap tour trade type water wave welcome milk level license land jam jail grate heap hook hover fire flower guard harm knot label nest order pine program rhyme screw seal sack shade signal tick tie trip trot tow trap mug moor warm dry empty clear slow double correct calm smooth bless back long gaze fax fade bang bolt bomb box mine glue ice'.split(' ');
  REG = REG.filter(function (w) { return BADREG.indexOf(w) < 0 || /^(correct|warm|dry|empty|clear|slow|double|calm|order|type|post|note|book|store|switch|land|plant|film|file|mark|list|name|time|face|place|point|wave|welcome|guard|harm|label|signal|tick|tie|trap|trip|bless|back|fire|rain|snow|sound|spot|stamp|tap|tour|trade|water|milk)$/.test(w); });
  var VERB = {};
  function regForms(b) {
    var third = /(s|sh|ch|x|z|o)$/.test(b) ? b + 'es' : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + 'ies' : b + 's';
    var dbl = /^(stop|plan|shop|drop|hug|travel|prefer|occur|cancel|refer|admit|commit|permit|regret|label|model|signal|control|patrol|jog|chop|grab|rob|nod|beg|pat|rub|plug|stir|swap|trip|wrap|skip|ship|slip|tap|chat|fit|clap)$/.test(b);
    var past = /e$/.test(b) ? b + 'd' : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + 'ied' : dbl ? b + b.slice(-1) + 'ed' : b + 'ed';
    var ing = /ie$/.test(b) ? b.slice(0, -2) + 'ying' : /[^e]e$/.test(b) && !/(see|agree)$/.test(b) ? b.slice(0, -1) + 'ing' : dbl ? b + b.slice(-1) + 'ing' : b + 'ing';
    return [third, past, ing, past];
  }
  Object.keys(IRR).forEach(function (b) { VERB[b] = IRR[b]; });
  REG.forEach(function (b) { if (!VERB[b]) VERB[b] = regForms(b); });
  var FORM = {}; // any form -> base
  Object.keys(VERB).forEach(function (b) { FORM[b] = b; VERB[b].forEach(function (f, i) { if (i !== 2 && !FORM[f]) FORM[f] = b; }); });
  ['am', 'are', 'were'].forEach(function (f) { FORM[f] = 'be'; });
  var BASES = Object.keys(VERB).filter(function (b) { return b !== 'be'; });
  function alt(list) { return list.map(function (w) { return w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).sort(function (a, b) { return b.length - a.length; }).join('|'); }
  var RX_BASE = alt(BASES), RX_THIRD = alt(BASES.map(function (b) { return VERB[b][0]; })), RX_PAST = alt(BASES.map(function (b) { return VERB[b][1]; }).concat(BASES.map(function (b) { return VERB[b][3]; })));
  var RX_ANYV = alt(Object.keys(FORM).filter(function (f) { return FORM[f] !== 'be'; }));
  function base(w) { return FORM[w.toLowerCase()] || w; }
  function keepCase(src, out) { return /^[A-Z]/.test(src) ? out.charAt(0).toUpperCase() + out.slice(1) : out; }
  var SING = 'he|she|it|my (?:mum|mom|dad|mother|father|son|daughter|brother|sister|friend|husband|wife|boss|teacher|baby|child|dog|cat)|the (?:baby|child|boy|girl|dog|cat|man|woman|teacher|weather|shop|car)|everyone|everybody|someone|somebody|nobody|no one|each|this|that';
  var PLUR = 'we|they|you|people|children|kids|my (?:parents|friends|kids|children)|the (?:children|kids|people|students)';
  var MISSPELL = {
    presention: 'presentation', presentaion: 'presentation', presentetion: 'presentation', presantation: 'presentation', prensentation: 'presentation', presenation: 'presentation', prject: 'project', projct: 'project', porject: 'project', questin: 'question', quesion: 'question', qustion: 'question', questoin: 'question', meating: 'meeting', meetting: 'meeting', documnet: 'document', docment: 'document', informaton: 'information', infomation: 'information', explaination: 'explanation', pronounciation: 'pronunciation', untill: 'until', thier: 'their', recieve: 'receive', recieved: 'received', alot: 'a lot', definately: 'definitely', defintely: 'definitely', seperate: 'separate', occured: 'occurred', wich: 'which', becouse: 'because', thankyou: 'thank you', pls: 'please', plz: 'please', tmrw: 'tomorrow', tmr: 'tomorrow',
    becuase: 'because', becasue: 'because', beacuse: 'because', bcoz: 'because', beleive: 'believe', belive: 'believe', wierd: 'weird', tommorow: 'tomorrow', tomorow: 'tomorrow', tommorrow: 'tomorrow',
    accomodate: 'accommodate', adress: 'address', arguement: 'argument', begining: 'beginning', calender: 'calendar', comming: 'coming', completly: 'completely', concious: 'conscious',
    embarass: 'embarrass', enviroment: 'environment', existance: 'existence', finaly: 'finally', foriegn: 'foreign', freind: 'friend', freinds: 'friends', goverment: 'government', grammer: 'grammar',
    happend: 'happened', immediatly: 'immediately', independant: 'independent', intresting: 'interesting', knowlege: 'knowledge', libary: 'library', neccessary: 'necessary', necesary: 'necessary',
    noticable: 'noticeable', occassion: 'occasion', persue: 'pursue', posession: 'possession', prefered: 'preferred', probaly: 'probably', probly: 'probably', realy: 'really', recomend: 'recommend',
    refered: 'referred', relevent: 'relevant', remeber: 'remember', rember: 'remember', sentance: 'sentence', sincerly: 'sincerely', succesful: 'successful', sucessful: 'successful', suprise: 'surprise',
    thier: 'their', truely: 'truly', writting: 'writing', teh: 'the', adn: 'and', waht: 'what', wat: 'what', thankyou: 'thank you', alright: 'all right', untill: 'until', wich: 'which', recieve: 'receive',
    recieved: 'received', seperate: 'separate', definately: 'definitely', definatly: 'definitely', occured: 'occurred', acheive: 'achieve', acheived: 'achieved', againts: 'against', allready: 'already',
    alot: 'a lot', aswell: 'as well', basicly: 'basically', beautifull: 'beautiful', buisness: 'business', carefull: 'careful', cheif: 'chief', collegue: 'colleague', commitee: 'committee',
    confortable: 'comfortable', copmuter: 'computer', diffrent: 'different', dissapoint: 'disappoint', dissapointed: 'disappointed', excercise: 'exercise', exellent: 'excellent', familly: 'family',
    favourit: 'favourite', febuary: 'February', fourty: 'forty', gaurd: 'guard', greatful: 'grateful', guage: 'gauge', hapy: 'happy', hight: 'height', iland: 'island', jewlery: 'jewellery',
    lenght: 'length', liesure: 'leisure', maintainance: 'maintenance', millenium: 'millennium', mischevious: 'mischievous', morgage: 'mortgage', naturaly: 'naturally', ninty: 'ninety', oppurtunity: 'opportunity',
    paralel: 'parallel', peice: 'piece', playwrite: 'playwright', pronounciation: 'pronunciation', questionaire: 'questionnaire', reccomend: 'recommend', restarant: 'restaurant', resturant: 'restaurant',
    rythm: 'rhythm', schedual: 'schedule', sieze: 'seize', speach: 'speech', stoped: 'stopped', strenght: 'strength', tounge: 'tongue', tryed: 'tried', twelth: 'twelfth', vaccum: 'vacuum', wensday: 'Wednesday',
    wendsday: 'Wednesday', wheather: 'weather', whitch: 'which', woudl: 'would', youre: 'you’re', im: 'I’m', ive: 'I’ve', ill: null, thats: 'that’s', whats: 'what’s', theres: 'there’s', lets: null,
    studing: 'studying', runing: 'running', swiming: 'swimming', geting: 'getting', siting: 'sitting', shoping: 'shopping', stoping: 'stopping', droping: 'dropping', puting: 'putting', cuting: 'cutting', makeing: 'making', takeing: 'taking', haveing: 'having', comeing: 'coming', writeing: 'writing', liveing: 'living', useing: 'using', moveing: 'moving', danceing: 'dancing', aukland: 'Auckland', wellignton: 'Wellington', welington: 'Wellington', christchruch: 'Christchurch', hamiltion: 'Hamilton', newzealand: 'New Zealand', zeland: 'Zealand', engish: 'English', englsh: 'English', inglish: 'English', becuse: 'because', becouse: 'because', beacause: 'because', beautifull: 'beautiful', beutiful: 'beautiful', beatiful: 'beautiful', wonderfull: 'wonderful', sucess: 'success', succes: 'success', tommorrow: 'tomorrow', yestarday: 'yesterday', yesturday: 'yesterday', yesterdy: 'yesterday', freind: 'friend', frend: 'friend', frends: 'friends', helo: 'hello', thanx: 'thanks', plese: 'please', pleace: 'please', wich: 'which', whith: 'with', wiht: 'with', thier: 'their', ther: 'there', becaus: 'because', realy: 'really', reely: 'really', allways: 'always', alwyas: 'always', untill: 'until', intrested: 'interested', interseting: 'interesting', exited: 'excited', goverment: 'government', enviroment: 'environment', oportunity: 'opportunity', oppertunity: 'opportunity', experiance: 'experience', expirience: 'experience', responsability: 'responsibility', importent: 'important', importand: 'important', diffcult: 'difficult', dificult: 'difficult', probleme: 'problem', problam: 'problem', advertisment: 'advertisement', acommodation: 'accommodation', accomodation: 'accommodation', comunity: 'community', commitment: 'commitment', comittee: 'committee', percentage: 'percentage', recieve: 'receive', beleive: 'believe', wether: null,
    goed: 'went', buyed: 'bought', eated: 'ate', runned: 'ran', catched: 'caught', teached: 'taught', thinked: 'thought', bringed: 'brought', comed: 'came', maked: 'made', taked: 'took',
    writed: 'wrote', drinked: 'drank', sleeped: 'slept', gived: 'gave', falled: 'fell', feeled: 'felt', finded: 'found', getted: 'got', haved: 'had', knowed: 'knew', telled: 'told', winned: 'won',
    swimmed: 'swam', sitted: 'sat', standed: 'stood', leaved: 'left', meeted: 'met', payed: 'paid', sayed: 'said', speaked: 'spoke', breaked: 'broke', choosed: 'chose', drived: 'drove', rided: 'rode',
    stealed: 'stole', throwed: 'threw', growed: 'grew', blowed: 'blew', drawed: 'drew', flied: 'flew', forgetted: 'forgot', hurted: 'hurt', losed: 'lost', spended: 'spent', sended: 'sent', builded: 'built',
    feeded: 'fed', holded: 'held', hided: 'hid', shaked: 'shook', waked: 'woke', weared: 'wore', singed: 'sang', begined: 'began', understanded: 'understood', heared: 'heard', selled: 'sold', fighted: 'fought',
    irregardless: 'regardless', everytime: 'every time', alittle: 'a little', infront: 'in front', incase: 'in case', aswel: 'as well', abit: 'a bit', alway: 'always', togather: 'together', togeather: 'together',
    gonna: 'going to', wanna: 'want to', gotta: 'have to', kinda: 'kind of', u: 'you', ur: 'your', pls: 'please', plz: 'please', thx: 'thanks', tho: 'though', becos: 'because', coz: 'because', cuz: 'because'
  };
  var NUM = 'two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|many|several|few|both|these|those|[2-9]|\\d{2,}';
  var NOUNS = ['book', 'day', 'week', 'month', 'year', 'hour', 'minute', 'friend', 'child', 'kid', 'person', 'apple', 'cup', 'car', 'dog', 'cat', 'time', 'thing', 'idea', 'question', 'problem', 'student',
    'teacher', 'brother', 'sister', 'cousin', 'room', 'house', 'egg', 'dollar', 'cent', 'page', 'game', 'song', 'meal', 'photo', 'picture', 'story', 'baby', 'man', 'woman', 'foot', 'tooth', 'mouse',
    'box', 'bus', 'class', 'dish', 'church', 'country', 'city', 'family', 'party', 'tree', 'flower', 'bird', 'sheep', 'fish', 'potato', 'tomato', 'hero', 'leaf', 'life', 'knife', 'wife', 'shelf', 'job', 'email', 'letter'];
  var IRRPL = { child: 'children', person: 'people', man: 'men', woman: 'women', foot: 'feet', tooth: 'teeth', mouse: 'mice', sheep: 'sheep', fish: 'fish', leaf: 'leaves', life: 'lives', knife: 'knives', wife: 'wives', shelf: 'shelves', potato: 'potatoes', tomato: 'tomatoes', hero: 'heroes' };
  function plural(n) { if (IRRPL[n]) return IRRPL[n]; if (/(s|sh|ch|x|z)$/.test(n)) return n + 'es'; if (/[^aeiou]y$/.test(n)) return n.slice(0, -1) + 'ies'; return n + 's'; }
  var VOWEL_EXC_AN = /^(hour|honest|honour|honor|heir|herb)/i, VOWEL_EXC_A = /^(uni|use|usu|one|once|euro|ewe|u[^aeiou]i)/i;

  /* ---------- more learner patterns (word order, verb patterns, prepositions) ---------- */
  var OBJ2SUBJ = { me: 'I', him: 'he', her: 'she', us: 'we', them: 'they', you: 'you', it: 'it' };
  var CLEARV = 'go|come|eat|see|buy|make|take|get|find|know|learn|study|visit|meet|leave|stay|become|speak|tell|say|write|watch|travel|live|move|join|apply|improve|ask|give|bring|send|pay|share|buy|sell|build|open|close|keep|stop|be|have|do|cook|swim|dance|sing|read|drive|ride|fly|sleep|rest|relax|try|call|start|finish|change|explain|prepare|return|order|book|check|save|invite|attend|receive|celebrate|go out|run';
  var INGV = 'go|come|eat|see|meet|work|play|cook|swim|dance|sing|read|write|watch|travel|walk|run|drive|ride|fly|sleep|talk|listen|learn|study|visit|shop|bake|paint|draw|garden|help|hear|receive|get|have|do|make|take|speak|stay|live|use|wait|clean|wash|drink|try|buy|call';
  function ing(v) { var b = base(v.toLowerCase()); return VERB[b] ? VERB[b][2] : (/e$/.test(v) ? v.slice(0, -1) + 'ing' : v + 'ing'); }
  function third(s, v) { var b = base(v.toLowerCase()); if (b === 'be') return /^i$/i.test(s) ? 'am' : /^(he|she|it)$/i.test(s) ? 'is' : 'are'; return /^(he|she|it)$/i.test(s) && VERB[b] ? VERB[b][0] : b; }
  var CMP = { easy: 'easier', happy: 'happier', busy: 'busier', early: 'earlier', heavy: 'heavier', lucky: 'luckier', pretty: 'prettier', funny: 'funnier', angry: 'angrier', dirty: 'dirtier', healthy: 'healthier', big: 'bigger', hot: 'hotter', fat: 'fatter', thin: 'thinner', wet: 'wetter', sad: 'sadder', large: 'larger', nice: 'nicer', safe: 'safer', close: 'closer', late: 'later', wide: 'wider', cheap: 'cheaper', small: 'smaller', fast: 'faster', cold: 'colder', old: 'older', young: 'younger', tall: 'taller', short: 'shorter', long: 'longer', hard: 'harder', strong: 'stronger', quick: 'quicker', warm: 'warmer', clean: 'cleaner', high: 'higher', low: 'lower', near: 'nearer', rich: 'richer', poor: 'poorer', slow: 'slower', smart: 'smarter', kind: 'kinder', good: 'better', bad: 'worse', far: 'further' };
  function sup(a) { var c = CMP[a]; if (a === 'good') return 'best'; if (a === 'bad') return 'worst'; if (a === 'far') return 'furthest'; return c.replace(/er$/, 'est'); }
  var RX_CMP = Object.keys(CMP).join('|'), CMPVALS = {}; Object.keys(CMP).forEach(function (k) { CMPVALS[CMP[k]] = 1; });
  var DAYS = 'monday|tuesday|wednesday|thursday|friday|saturday|sunday|mondays|tuesdays|wednesdays|thursdays|fridays|saturdays|sundays|weekdays';
  var MONTHS = 'january|february|march|april|may|june|july|august|september|october|november|december';
  var NUMW = '\\d+|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|fifteen|twenty|thirty|a few|many|several';
  var AGE = '\\d{1,3}|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety|(?:twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[- ](?:one|two|three|four|five|six|seven|eight|nine)';
  var UNCOUNT = 'information|advice|furniture|homework|equipment|luggage|baggage|news|feedback|knowledge|research|traffic|money|bread|rice|water|music|work|evidence|accommodation|progress|software|stuff';
  var PERSONN = 'man|woman|person|people|boy|girl|teacher|doctor|nurse|friend|child|children|lady|guy|men|women|neighbour|neighbor|student|students|family|customer|customers|boss|manager|someone|anyone|everyone';
  var GRAM_PRE = [
    [/\b(the|nice|bad|good|cold|warm|hot|lovely|awful|wet|sunny) wether\b/gi, function (m, a) { return a + ' weather'; }, '“weather” (rain and sun)'],
    [/\bwether (is|was|forecast|today|tomorrow)\b/gi, function (m, a) { return keepCase(m, 'weather') + ' ' + a; }, '“weather” (rain and sun)'],
    [/\b(the|a|to the|at the|on the) beech\b(?! (tree|wood|forest|leaves|hedge))/gi, function (m, a) { return a + ' beach'; }, '“beach” (sand and sea)'],
    [/\b(a|so|really|very) grate (time|job|day|idea|weekend|holiday|party|night|person|friend|place)\b/gi, function (m, a, n) { return a + ' great ' + n; }, '“great” (very good)'],
    [/\b(I|we|they|you|he|she|it) (where) (\w+ing|happy|sad|tired|there|here|late|at|in|on|so|very|not|always|never|born|married|busy|ready|sick|excited|bored)\b/gi, function (m, s, w, n) { return s + ' ' + (/^(I|he|she|it)$/i.test(s) ? 'was' : 'were') + ' ' + n; }, '“was/were” (not “where”)'],
    [new RegExp('(^|[,;]\\s+|\\b(?:and|but|so|because|when|while) )(I|you|we|they|he|she|my \\w+) (' + alt(BASES.map(function (b) { return VERB[b][2]; })) + ')\\b', 'gi'), function (m, pre, s, v) { var be = /^I$/i.test(s) ? 'am' : /^(you|we|they)$/i.test(s) ? 'are' : 'is'; return pre + s + ' ' + be + ' ' + v; }, 'Add “am/is/are” before the -ing verb'],
    [/\b(to|too|two) (\w+)/gi, function (m, t, w) { var l = t.toLowerCase(); if (l === 'two' && /^(go|see|be|have|get|do|make|help|eat|buy|meet)$/i.test(w)) return keepCase(t, 'to') + ' ' + w; return m; }, '“to” before a verb'],
    [/\b(would|could|should) of\b/gi, function (m, a) { return a + ' have'; }, '“have”, not “of”'],
    [/\b(affect)(?= (on|of)\b)/gi, function (m) { return keepCase(m, 'effect'); }, '“effect” (the noun)'],
    [/\b(a|an|the|positive|negative|big|good|bad|side) affect\b/gi, function (m, a) { return a + ' effect'; }, '“effect” is the noun'],
    [/\b(advise)(?= (is|was|from|for me))/gi, function (m) { return keepCase(m, 'advice'); }, '“advice” is the noun'],
    [/\b(some|good|your|my|his|her|any|great|useful|best|the|this|that|much|of) advise\b/gi, function (m, a) { return a + ' advice'; }, '“advice” is the noun'],
    [/\bquiet (good|nice|hard|easy|difficult|well|often|a lot|tired|busy|expensive|cheap|big|small|far|close|sure|right|interesting)\b/gi, function (m, a) { return keepCase(m, 'quite') + ' ' + a; }, '“quite” (fairly)'],
    [/\b(I|we|they|you|he|she) (except|excepted) (the|your|my|his|her|our|their|this|that|it|an?)\b/g, function (m, s, v, d) { return s + ' ' + (v === 'except' ? 'accept' : 'accepted') + ' ' + d; }, '“accept” (to agree/receive)'],
    [/\b(dont|don’t|don't|didnt|didn’t|didn't|doesnt|doesn’t|doesn't) no\b(?! (one|more|longer|way|matter|problem|need|idea|doubt|money|time|food|reason)\b)/gi, function (m, a) { var x = a.toLowerCase().replace(/['’]/, ''); return (x === 'dont' ? keepCase(a, 'don’t') : x === 'didnt' ? keepCase(a, 'didn’t') : keepCase(a, 'doesn’t')) + ' know'; }, '“know” (not “no”)'],
    [/\b(I|we|you|they) no (what|how|where|why|when|who|if|that|it|him|her|them|the answer)\b/g, function (m, s, w) { return s + ' know ' + w; }, '“know” (not “no”)'],
    [/\b(This|this) (are|were)\b/g, function (m, a, v) { return keepCase(a, 'these') + ' ' + v; }, 'Plural: “these are”'],
    [/\b(These|these) (is|was)\b/g, function (m, a, v) { return keepCase(a, 'this') + ' ' + v; }, 'Singular: “this is”'],
    [/\b(That|that) are\b(?= (my|our|your|his|her|their|the) \w+s\b)/g, function (m, a) { return keepCase(a, 'those') + ' are'; }, 'Plural: “those are”'],
    [/\b(Those|those) is\b/g, function (m, a) { return keepCase(a, 'that') + ' is'; }, 'Singular: “that is”'],
    [new RegExp('\\b(I|you|we|they|he|she|my (?:son|daughter|brother|sister|friend|mum|dad|baby|child)|\\w+) (have|has|had) (' + AGE + ') (years?|months?) old\\b', 'gi'), function (m, s, v, n, y) { var be = /^had$/i.test(v) ? (/^(I|he|she)$/i.test(s) || /^my /i.test(s) ? 'was' : 'were') : /^I$/.test(s) ? 'am' : /^(you|we|they)$/i.test(s) ? 'are' : 'is'; return s + ' ' + be + ' ' + n + ' ' + y + ' old'; }, 'For age, use “be”: “I am 25 years old”'],
    [/\b(look|looks|looked|looking) forward to (\w+)\b/gi, function (m, a, v) { var b = FORM[v.toLowerCase()]; if (!b || v.toLowerCase() !== b || b === 'be' && v !== 'be') return m; return a + ' forward to ' + ing(v); }, '“look forward to” + -ing'],
    [/\b(enjoy|enjoys|enjoyed|enjoying|finish|finished|finishes|avoid|avoided|avoids|mind|minds|minded|keep|keeps|kept|practise|practised|practice|practiced|consider|considered|imagine|imagined|miss|missed|recommend|recommended|can’t stand|can't stand|don’t mind|don't mind) to (\w+)\b/gi, function (m, a, v) { var b = FORM[v.toLowerCase()]; if (!b || v.toLowerCase() !== b) return m; return a + ' ' + ing(v); }, 'This verb is followed by -ing'],
    [/\b(suggest|suggests|suggested|recommend|recommended) (me|him|her|us|them) to (\w+)\b/gi, function (m, a, o, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; return a + ' that ' + OBJ2SUBJ[o.toLowerCase()] + ' ' + b; }, 'Say “suggested that I …”'],
    [new RegExp('\\b(want|wants|wanted|need|needs|needed|would like|’d like|decide|decided|decides|plan|plans|planned|hope|hoped|hopes|try|tries|tried|forget|forgot|learn|learned|learnt|going|agree|agreed|promise|promised|refuse|refused|expect|expected|afford|seem|seems|seemed|ready|able|happy|sad|nice|easy|hard|time) (' + CLEARV + ')\\b(?! (?:to|of)\\b)', 'gi'), function (m, a, v) { if (/^(going)$/i.test(a) && /^(home|out|back)$/i.test(v)) return m; if (/^(happy|sad|nice|easy|hard|time|ready|able)$/i.test(a) && !/^(go|see|meet|help|know|learn|do|make|get|be|have)$/i.test(v)) return m; if (/^(happy|sad|nice|easy|hard|time|ready|able)$/i.test(a) && /^(have|do|get|make|be)$/i.test(v)) return m; return a + ' to ' + v; }, 'Add “to” before the verb'],
    [/\b(let|lets|letting|made|make|makes|making|have|had) (me|him|her|us|them|you|my \w+|the \w+) to (\w+)\b/gi, function (m, a, o, v) { var b = FORM[v.toLowerCase()]; if (!b || v.toLowerCase() !== b) return m; return a + ' ' + o + ' ' + v; }, 'No “to” after let/make + person'],
    [new RegExp('\\b(like|likes|love|loves|hate|hates|prefer|prefers) (' + INGV + ')\\b(?! (?:to|of|and)\\b)', 'gi'), function (m, a, v) { if (/^(play|work|help|walk|talk|swim|dance|cook|drink|use|call|try|wait|have|do|get|make|see|know)$/i.test(v)) return m; return a + ' ' + ing(v); }, 'Use “like + -ing” (or “like to …”)'],
    [/\b(listen|listens|listened|listening) (?!to\b|carefully\b|well\b|up\b|out\b|now\b|here\b)(music|the|me|him|her|them|us|my|your|our|his|their|this|that|a|some|songs|podcasts|it|radio)\b/gi, function (m, a, w) { return a + ' to ' + w; }, '“listen to …”'],
    [/\b(explain|explains|explained|explaining|describe|describes|described) (me|him|her|us|them) ((?:the|a|an|my|your|his|her|our|their|this|that|it|everything) ?\w*)(?=[.!?,]|$| (?:and|but|again|clearly|slowly|carefully)\b)/gi, function (m, a, o, np) { return a + ' ' + np.trim() + ' to ' + o; }, '“explain something to someone”'],
    [/\b(explain|explains|explained|explaining|describe|describes|described) (me|him|her|us|them)\b(?! to\b)/gi, function (m, a, o) { return a + ' to ' + o; }, '“explain to me”'],
    [/\b(said|say|says) (me|him|her|us|them)\b/gi, function (m, a, o) { var t = { said: 'told', say: 'tell', says: 'tells' }[a.toLowerCase()]; return keepCase(a, t) + ' ' + o; }, 'Use “tell someone” (not “say someone”)'],
    [/\b(married|marry) with\b/gi, function (m, a) { return a + ' to'; }, '“married to”'],
    [/\bdespite of\b/gi, function (m) { return keepCase(m, 'despite'); }, '“despite” (no “of”)'],
    [/\bin spite (?!of\b)/gi, function (m) { return keepCase(m, 'in spite of '); }, '“in spite of”'],
    [/\bin the other hand\b/gi, function (m) { return keepCase(m, 'on the other hand'); }, '“on the other hand”'],
    [/\b(depend|depends|depended|depending) (of|from)\b/gi, function (m, a) { return a + ' on'; }, '“depend on”'],
    [/\b(good|bad|great|better|best|excellent|terrible|clever) (in) (maths|math|english|sport|sports|music|art|science|cooking|drawing|singing|dancing|swimming|writing|speaking|languages|it)\b/gi, function (m, a, p, s) { return a + ' at ' + s; }, '“good at …”'],
    [/\b(interested|interesting) (on|for|about)\b/gi, function (m, a) { return 'interested in'; }, '“interested in”'],
    [/\b(I am|I’m|I was|we are|we’re|we were|they are|they’re|they were|he is|she is|he was|she was|you are|you were) (very |so |really |quite |a bit |too )?(interesting|boring|exciting|tiring|confusing|surprising|annoying|frightening|disappointing|embarrassing|worrying|relaxing)\b(?! (?:to|for) )(?=\s*(?:in|about|with|by|of|because|now|today|[.!,]|$))/gi, function (m, s, adv, a) { return s + ' ' + (adv || '') + a.replace(/ing$/, 'ed').replace(/tireed/, 'tired').replace(/confuseed|surpriseed|relaxeed/, function (x) { return x.replace('eed', 'ed'); }); }, 'For feelings use “-ed” (bored, excited)'],
    [/\b(afraid|scared|proud|tired|fond|full|jealous|aware) (from|for|on|with)\b/gi, function (m, a) { return a + ' of'; }, 'Use “of” after this word'],
    [/\b(arrive|arrives|arrived|arriving) to ([A-Z]\w+)/g, function (m, a, w) { return a + ' in ' + w; }, '“arrive in” a city or country'],
    [/\b(arrive|arrives|arrived|arriving) to (the|my|our|your|school|work|home)\b/gi, function (m, a, w) { return w.toLowerCase() === 'home' ? a + ' home' : a + ' at ' + w; }, '“arrive at” a place'],
    [/\b(go|goes|went|going|come|comes|came|coming|get|got|getting|return|returned|arrive|arrived) to home\b/gi, function (m, a) { return a + ' home'; }, 'No “to” before “home”'],
    [new RegExp('\\bin (' + DAYS + ')\\b', 'gi'), function (m, d) { return 'on ' + d; }, 'Use “on” with days'],
    [new RegExp('\\bon (' + MONTHS + ')\\b(?! \\d)', 'gi'), function (m, d) { return 'in ' + d; }, 'Use “in” with months'],
    [/\b(on|at) the (morning|afternoon|evening)\b/gi, function (m, a, t) { return 'in the ' + t; }, '“in the morning/afternoon/evening”'],
    [/\b(in|on) the night\b(?! (of|before|when)\b)/gi, function (m) { return 'at night'; }, '“at night”'],
    [/\b(in|on) (night|midnight|noon|lunchtime)\b/gi, function (m, a, t) { return 'at ' + t; }, '“at night / at noon”'],
    [/\bin (the )?weekend\b/gi, function (m, t) { return 'at the weekend'; }, '“at the weekend” (or “on the weekend”)'],
    [new RegExp('\\bsince (' + NUMW + ') (years?|months?|weeks?|days?|hours?|minutes?)\\b', 'gi'), function (m, n, u) { return 'for ' + n + ' ' + u; }, 'Use “for” with a length of time'],
    [new RegExp('\\b(I|we|you|they|he|she|it) (have|has) (been|gone|visited|seen|done|eaten|met|lived|worked|finished|bought|went|had|travelled|traveled|played|watched|called) ([^.!?]{0,40}?)\\b(yesterday|last (?:night|week|month|year|weekend|summer|winter|time|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|\\w+ (?:days?|weeks?|months?|years?) ago|in (?:19|20)\\d\\d)\\b', 'gi'), function (m, s, h2, v, mid, when) {
      var low = v.toLowerCase(), past;
      if (low === 'been') past = /^to\b/i.test(mid) ? 'went' : (/^(I|he|she|it)$/i.test(s) ? 'was' : 'were');
      else if (low === 'gone') past = 'went'; else past = VERB[FORM[low]] ? VERB[FORM[low]][1] : low;
      return s + ' ' + past + ' ' + mid + when;
    }, 'Finished time (yesterday, last year): use the past simple'],
    [new RegExp('\\b(I am|I’m|we are|we’re|you are|you’re|they are|they’re|he is|he’s|she is|she’s) (living|working|studying|waiting|learning|teaching|playing|using|driving|doing|building|saving|trying)\\b([^.!?]{0,40}?)\\b(for (?:' + NUMW + ') (?:years?|months?|weeks?|days?|hours?)|since (?:\\d{4}|last \\w+|january|february|march|april|may|june|july|august|september|october|november|december|\\w+ ago|I was|we were|then|childhood))', 'gi'), function (m, s, v, mid, t) {
      var subj = s.replace(/’re$| are$| is$|’s$| am$|’m$/i, ''); var hv = /^(he|she)$/i.test(subj) ? 'has' : 'have';
      return subj + ' ' + hv + ' been ' + v + mid + t;
    }, 'With “for/since”, use “have been + -ing”'],
    [new RegExp('\\b(I|we|you|they) (live|work|know|study|teach|stay|have|use|drive) (here |there |in [A-Z]\\w+(?: [A-Z]\\w+)? |at \\w+ |him |her |them |each other |this \\w+ |English |a car )?(for (?:' + NUMW + ') (?:years?|months?|weeks?)|since (?:\\d{4}|last \\w+|\\w+ ago))', 'g'), function (m, s, v, mid, t) { var pp = VERB[v] ? VERB[v][3] : v + 'ed'; return s + ' have ' + pp + ' ' + (mid || '') + t; }, 'With “for/since”, use the present perfect'],
    [/\b(when|after|before|as soon as|until|till|once|if|unless) (I|you|we|they|he|she|it|my \w+|the \w+) will (\w+)\b/gi, function (m, c, s, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; if (/^if$/i.test(c) && /^(you|he|she|they)$/i.test(s) && /^(help|come|wait|join)$/.test(b) && false) return m; return c + ' ' + s + ' ' + third(/^(my|the) /i.test(s) ? 'it' : s, b); }, 'After “when/if”, use the present for the future'],
    [/\b(If|if) (I|you|we|they|he|she|it) would have (\w+)\b/g, function (m, c, s, v) { return c + ' ' + s + ' had ' + v; }, '“If I had known…”'],
    [/\b(If|if) (I|you|we|they|he|she|it) would (\w+)\b(?=[^.!?]*\bwould\b)/g, function (m, c, s, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; if (b === 'be') return c + ' ' + s + ' were'; return c + ' ' + s + ' ' + VERB[b][1]; }, '“If I had…, I would…”'],
    [new RegExp('\\b(more) (' + RX_CMP + ')\\b(?= than|[.!?,])', 'gi'), function (m, a, w) { return CMP[w.toLowerCase()]; }, 'Short adjectives: use “-er” (easier)'],
    [new RegExp('\\b(the )?most (' + RX_CMP + ')\\b', 'gi'), function (m, t, w) { return 'the ' + sup(w.toLowerCase()); }, 'Short adjectives: use “the -est” (the easiest)'],
    [/\b(more|most) (\w+er|\w+est)\b/gi, function (m, a, w) { if (!CMPVALS[w.toLowerCase()] && !/^(bigg|small|fast|old|young|tall|short|long|hard|strong|quick|cheap|easi|happi|busi|nic|larg|lat|clos|saf|wid|cold|warm|high|low|slow|rich|poor|smart|kind|hott|bett|wors)/.test(w.toLowerCase())) return m; if (/^(number|never|other|ever|over|after|under|water|power|later|rather|together|interest|honest|forest|modest)$/i.test(w)) return m; return w; }, 'Don’t use “more” with “-er”'],
    [new RegExp('\\b(a|an) (' + UNCOUNT + ')\\b(?! (?:of|bag|cup|piece|loaf|bottle|glass|item|shop|teacher|centre|center)\\b)', 'gi'), function (m, a, w) { return (/^A/.test(a) ? 'Some ' : 'some ') + w; }, 'Uncountable noun: use “some”, not “a/an”'],
    [new RegExp('\\b(' + PERSONN + ') which\\b', 'gi'), function (m, n) { return n + ' who'; }, 'Use “who” for people'],
    [/\b(book|car|house|thing|place|city|country|film|movie|shop|phone|job|school|restaurant|computer|bag|present|gift|song|story) who\b/gi, function (m, n) { return n + ' which'; }, 'Use “which/that” for things'],
    [new RegExp('\\b(people|children|students|friends|men|women|parents|kids|neighbours|neighbors|customers|those|others) who (' + RX_THIRD + ')\\b', 'gi'), function (m, n, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; return n + ' who ' + (b === 'be' ? 'are' : b); }, 'Plural: “people who live”'],
    [new RegExp('\\b(a|the|this|that|one) (man|woman|person|boy|girl|teacher|lady|friend|child|neighbour|doctor|student) who (' + RX_BASE + ')\\b', 'gi'), function (m, a, n, v) { var b = v.toLowerCase(); if (!VERB[b] || /^(let|put|cut|hit|set|cost|shut|read)$/.test(b)) return m; return a + ' ' + n + ' who ' + VERB[b][0]; }, 'Singular: “a man who lives”'],
    [/(?<!\b(?:thank you|thanks|thank|sorry|grateful|thankful|apologise|apologize|excuse me|forgive me|blame me|praise) )\b(for) (buy|get|see|make|learn|visit|meet|take|find|pay|bring|send|tell|ask|improve|speak|watch|eat|cook|celebrate|collect|pick up|check|save)\b(?= \w)/gi, function (m, f, v) { return 'to ' + v; }, 'Use “to + verb” for purpose'],
    [/(?<!\b(?:thank you|thanks|thank|sorry|grateful|thankful|apologise|apologize|excuse me|forgive me|blame me|praise) )\b(for) (help|study|work|support|clean) (you|me|him|her|us|them|the|my|your|our|their|people|others)\b/gi, function (m, f, v, o) { return 'to ' + v + ' ' + o; }, 'Use “to + verb” for purpose'],
    [/\b(weather|food|day|trip|film|movie|party|meal|class|lesson|idea|holiday|concert|show|game|result|work) (is|was|are|were) (very |so |really |quite )?well\b/gi, function (m, n, v, a) { return n + ' ' + v + ' ' + (a || '') + 'good'; }, 'Use “good” (adjective) here'],
    [/\b(I|we|you|they) very (like|love|enjoy|want|need|appreciate|miss|hope)\b/g, function (m, s, v) { return s + ' really ' + v; }, 'Say “I really like…”'],
    [/\b(like|love|enjoy|liked|loved|enjoyed|likes|loves|enjoys) very much (\w+(?: \w+)?)(?=[.!?,]|$)/gi, function (m, v, o) { return v + ' ' + o + ' very much'; }, '“I like pizza very much”'],
    [/\b(thank you|thanks) for you (help|support|time|email|message|kindness|patience|reply|advice|letter|call|gift|hospitality|understanding|feedback|invitation)\b/gi, function (m, t, n) { return t + ' for your ' + n; }, '“your help”'],
    [/\bfind attach(ed)? the\b/gi, function (m) { return keepCase(m, 'find attached the'); }, '“Please find attached …”'],
    [/\b(sorry|apologies|apologise|apologize) for (late reply|late response|delay|inconvenience|late answer|mistake|confusion)\b/gi, function (m, a, n) { return a + ' for the ' + n; }, 'Add “the”'],
    [/\b(Although|although|Though|though|Even though|even though|Because|because|Since) ([^,.!?]+), (but|so) /g, function (m, c, mid, j) { return c + ' ' + mid + ', '; }, 'Don’t use “but/so” after although/because'],
    [/\bgrand (mother|father|parents|son|daughter|children|child|ma|pa)\b/gi, function (m, a) { return 'grand' + a; }, 'One word: “grandmother”'],
    [/\bsome times\b(?! a (day|week))/gi, function (m) { return keepCase(m, 'sometimes'); }, '“sometimes” is one word'],
    [/\bcan not\b/gi, function (m) { return keepCase(m, 'cannot'); }, '“cannot” is one word'],
    [/\bevery body\b/gi, function (m) { return keepCase(m, 'everybody'); }, '“everybody” is one word'],
    [/\b(any|some|every|no) thing\b/gi, function (m, a) { return a + 'thing'; }, 'One word: “anything/something”'],
    [/\bin (the )?(bus|train|plane|ferry)\b/gi, function (m, t, v) { return 'on the ' + v; }, '“on the bus/train”'],
    [/\b(\w+) (is|was) (consisted|composed|located) (of|in)\b/gi, function (m, n, v, w, p) { return w === 'consisted' ? n + ' consists ' + p : m; }, '“consists of”'],
    [/\b(reason|cause) (is|was) because\b/gi, function (m, r, v) { return r + ' ' + v + ' that'; }, '“The reason is that…”'],
    [/\bboth of (us|you|them) (is|was)\b/gi, function (m, p, v) { return 'both of ' + p + ' ' + (v === 'is' ? 'are' : 'were'); }, 'Plural: “both … are”'],
    [/\bboth of (us|you|them) (has|does)\b/gi, function (m, p, v) { return 'both of ' + p + ' ' + (v === 'has' ? 'have' : 'do'); }, 'Plural: “both … have”']
  ];
  GRAM_PRE.push.apply(GRAM_PRE, [
    [new RegExp('\\b(' + PLUR + '|many people|most people|some people|a lot of people|lots of people|many students|most students|my friends|my parents|our children|families|workers|employees|students|teachers|parents) (' + alt(BASES.map(function (b) { return VERB[b][0]; }).filter(function (v) { return !/^(has|does|is)$/.test(v); })) + ')\\b', 'gi'), function (m, s, v) { var b = FORM[v.toLowerCase()]; if (!b || b === 'be') return m; if (/^(you)$/i.test(s) && false) return m; return s + ' ' + b; }, 'Plural subject: no “s” on the verb'],
    [/\b(this|that|the|a|an|my|your|his|her|its|our|their|every|each|one) ((?!children|people|men|women|police|staff|team|family|government|sheep|fish|news|series|data)[a-z]+[^s\s’']) (have|do|don’t|don't)\b(?! to\b)/gi, function (m, d, n, v) { if (FORM[n.toLowerCase()] || /^(only|other|same|first|last|best|most|whole|own|very)$/i.test(n)) return m; var x = v.toLowerCase(); return d + ' ' + n + ' ' + (x === 'have' ? 'has' : x === 'do' ? 'does' : 'doesn’t'); }, 'Singular subject: “has/does”'],
    [new RegExp('(^|[.!?;]\\s+|,\\s+)((?:Working|Living|Studying|Learning|Reading|Travelling|Traveling|Cooking|Exercising|Walking|Shopping|Eating|Using|Having|Being|Playing|Saving|Owning|Driving|Moving|Speaking|Writing|Volunteering)(?: (?:from|at|in|on|abroad|online|with|for)(?: [a-z]+){0,2})?) (save|help|make|give|cost|take|allow|mean|cause|improve|reduce|create|lead|keep|offer|provide|let|bring|become|seem|need|require|teach|give)\\b', 'gi'), function (m, pre, subj, v) { v = v.toLowerCase(); return VERB[v] ? pre + subj + ' ' + VERB[v][0] : m; }, 'An -ing subject is singular: “Working from home saves…”'],
    [/\b(miss|love|see|visit|call|with|and|of|to|for|help|ask|meet|like|about) there (colleagues|friends|family|families|children|kids|parents|house|home|car|cars|money|jobs?|teachers?|boss|partners?|work|lives|life|own|time|homes|neighbours|culture|language|country)\b/gi, function (m, a, n) { return a + ' their ' + n; }, '“their” = belonging to them'],
  ]);

  /* ---------- punctuation ---------- */
  var INTRO = 'However|Therefore|Firstly|Secondly|Thirdly|Finally|Lastly|In addition|Furthermore|Moreover|For example|For instance|In conclusion|To sum up|On the other hand|Unfortunately|Fortunately|Luckily|Sadly|Meanwhile|Overall|Of course|In fact|As a result|Nevertheless|Consequently|Additionally|Besides|Otherwise|Honestly|Personally|In my opinion|In my view|First of all|After that|Also|Then again|On balance|Instead|Surprisingly|Hopefully|Basically|Anyway|By the way|Please note|(?:Well|Yes|No|Sorry|Okay|OK|Oh)(?= (?:I|I’m|we|you|he|she|it|they|that|this|there|thanks|thank|please|of course)\\b)';
  var PUNCT = [
    [new RegExp('(^|[.!?]\\s+|\\n)(' + INTRO + ') (?=[A-Za-z])', 'g'), function (m, pre, w) { return pre + w + ', '; }, 'Add a comma after an opening word or phrase'],
    [/(^|\n)(Hi|Hello|Hey|Kia ora|Dear|Good morning|Good afternoon|Good evening|Morning) ([A-Z][a-z]+(?: [A-Z][a-z]+)?) (?=(how|I|I’m|we|thank|thanks|hope|just|it|this|i)\b)/g, function (m, pre, g, n) { return pre + g + ' ' + n + ', '; }, 'Add a comma after the greeting'],
    [/(^|\n)(Dear|Hi|Hello|Kia ora) ([A-Z][a-z]+(?: [A-Z][a-z]+)?)[ \t]*(?=\n)/g, function (m, pre, g, n) { return pre + g + ' ' + n + ','; }, 'Add a comma after the greeting'],
    [/(^|\n)(Kind regards|Best regards|Warm regards|Best wishes|Regards|Yours sincerely|Yours faithfully|Many thanks|Thanks again|Cheers|Ngā mihi|Nga mihi|Love|Take care)[ \t]+(?=[A-Z][a-z]+\s*$)/gm, function (m, pre, w) { return pre + w + ',\n'; }, 'Put a comma after the sign-off and your name on the next line'],
    [/(^|\n)(Kind regards|Best regards|Warm regards|Best wishes|Regards|Yours sincerely|Yours faithfully|Many thanks|Ngā mihi|Nga mihi)[ \t]*(?=\n)/g, function (m, pre, w) { return pre + w + ','; }, 'Add a comma after the sign-off'],
    [/([a-z]) (but|so|yet) (I|we|he|she|they|it|you|my \w+|the \w+|there) (?=\w)/g, function (m, a, c, s2) { return a + ', ' + c + ' ' + s2 + ' '; }, 'Add a comma before “but/so” joining two sentences'],
    [/\b(home|today|yesterday|tonight|now|later|there|here|again|too|late|early|soon|tired|happy|sad|busy|done|finished|okay|fine|great|outside|inside|work|school|cold|hot|warm|wet|sunny|raining|well|morning|afternoon|evening|night|week|weekend|year|month|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|January|February|March|April|June|July|August|September|October|November|December) (i|I|we|they|he|she|it|my \w+|it’s|it's|it is|there’s|there is|that’s|that is|this is) ((?:am|was|were|is|are|have|had|will|went|think|thought|feel|felt|got|need|want|can|could|did|do|love|like|hope|wish|always|never|really|so|very|a|an|the|not|too|still|just|free|busy|ready|here|there|going|coming)\b)/g, function (m, a, s2, v, off, all) {
      var before = all.slice(0, off).split(/[.!?\n]/).pop();
      if (/,\s*$/.test(all.slice(0, off)) || /^(now|then|well|there|here)$/i.test(a)) return m;
      var hasVerb = before.split(/[^A-Za-z’']+/).some(function (t) { var l = t.toLowerCase(); return l && (FORM[l] || /^(am|is|are|was|were|be|been|can|could|will|would|should|must|let’s|it’s|that’s)$/.test(l)); });
      if (!hasVerb) return m;
      if (/\b(so|such|too|the first|the last|the only|the best|the worst)\s+\S+\s*$/i.test(before + ' ' + a.split(/\s+/).pop()) || /\b(so|such|too)\s+$/i.test(before)) return m;
      var S = s2 === 'i' ? 'I' : s2.charAt(0).toUpperCase() + s2.slice(1); return a + '. ' + S + ' ' + v; }, 'Two sentences: add a full stop'],
    [/([a-z]) (isn’t|isn't|aren’t|aren't|don’t|don't|doesn’t|doesn't|won’t|won't|wasn’t|wasn't|didn’t|didn't) (it|he|she|they|you|we|there)\s*[.]?\s*$/gim, function (m, a, t, p2) { return a + ', ' + t + ' ' + p2 + '?'; }, 'A tag question ends with “?”'],
    [/,\s*(isn’t|isn't|aren’t|aren't|don’t|don't|doesn’t|doesn't|won’t|won't|can’t|can't|didn’t|didn't|wasn’t|wasn't|right|okay|eh) ?(it|he|she|they|you|we|I|there)?\s*\./gi, function (m, t, p2) { return ', ' + t + (p2 ? ' ' + p2 : '') + '?'; }, 'A tag question ends with “?”'],
    [/\b(my|your|his|her|our|their|the|a) (mum|dad|mom|mother|father|sister|brother|friend|son|daughter|wife|husband|boss|teacher|neighbour|neighbor|baby|dog|cat|grandma|grandpa|nana|uncle|aunty|auntie|aunt|cousin|partner|child|girlfriend|boyfriend|colleague|manager)s (house|home|car|birthday|name|room|phone|job|school|party|wedding|bag|toys?|food|bed|work|place|family|friends?|kids|children|address|number|email|idea|advice|help|book|clothes|shoes|garden)\b/gi, function (m, d, n, o) { return d + ' ' + n + '’s ' + o; }, 'Use ’s to show belonging (my mum’s house)'],
    [/\b(childrens|womens|mens|peoples) (book|books|clothes|toys?|day|room|shoes|rights|health|party|hospital|team|section)\b/gi, function (m, w, n) { return w.slice(0, -1) + '’s ' + n; }, 'Use ’s to show belonging (children’s books)'],
    [/\b(lets) (go|start|eat|play|meet|see|try|talk|do|make|get|have|celebrate|pray|begin|be)\b/gi, function (m, l, v) { return keepCase(l, 'let’s') + ' ' + v; }, '“let’s” = let us'],
    [/\b(theyre|youre|were’nt|wer’ent|shes|hes|whos|theres|heres|wheres|thats|whats|isnt|wasnt|weve|theyve|youve|youll|theyll|well(?= be\b)|Ill(?= be\b| go\b| call\b| see\b| send\b| do\b| try\b)|id(?= like\b| love\b| be\b)|Id(?= like\b| love\b| be\b))\b/g, function (m) { var x = m.toLowerCase(), map = { theyre: 'they’re', youre: 'you’re', shes: 'she’s', hes: 'he’s', whos: 'who’s', theres: 'there’s', heres: 'here’s', wheres: 'where’s', thats: 'that’s', whats: 'what’s', isnt: 'isn’t', wasnt: 'wasn’t', weve: 'we’ve', theyve: 'they’ve', youve: 'you’ve', youll: 'you’ll', theyll: 'they’ll', well: 'we’ll', ill: 'I’ll', id: 'I’d' }; var o = map[x] || m; return x === 'ill' || x === 'id' ? o : keepCase(m, o); }, 'Add the apostrophe'],
    [/\b(how are you|how are you doing|how have you been|how was your (?:day|weekend|week|trip|holiday)|how is (?:everyone|the family|your family|work)|are you (?:well|okay|ok|free))\s*,\s*(?=[A-Za-z])/gi, function (m, q) { return q + '? '; }, 'A question ends with “?”'],
    [/,{2,}/g, ',', 'One comma is enough'],
    [/,\./g, '.', 'Remove the extra comma'],
    [/(?<!\.)\.\.(?!\.)/g, '.', 'One full stop is enough'],
    [/\.{4,}/g, '…', 'Use three dots for an ellipsis'],
    [/([!?])\.(?=\s|$)/g, function (m, a) { return a; }, 'No full stop after ! or ?'],
    [/\s+([’'](?:s|re|ve|ll|d|m|t))\b/g, function (m, a) { return a; }, 'No space before the apostrophe'],
    [/\b(\w+) ,(\w)/g, function (m, a, b) { return a + ', ' + b; }, 'Comma goes straight after the word'],
    [/\(\s+/g, '(', 'No space inside brackets'],
    [/\s+\)/g, ')', 'No space inside brackets'],
    [/"([^"\n]+)"/g, function (m, a) { return '“' + a + '”'; }, '']
  ];
  GRAM_PRE.push.apply(GRAM_PRE, PUNCT.filter(function (r) { return r[2]; }));

  /* ---------- advanced grammar: tenses, passives, clauses, connectives, punctuation ---------- */
  function pp(v) { var b = FORM[v.toLowerCase()]; return b && VERB[b] ? VERB[b][3] : v; }
  function pastOf(v) { var b = FORM[v.toLowerCase()]; return b && VERB[b] ? VERB[b][1] : v; }
  function adverb(a) { var x = a.toLowerCase(); if (x === 'good') return 'well'; if (/y$/.test(x)) return x.slice(0, -1) + 'ily'; if (/le$/.test(x)) return x.slice(0, -1) + 'y'; if (/ic$/.test(x)) return x + 'ally'; return x + 'ly'; }
  function plur2(n) { var l = n.toLowerCase(); if (/s$/.test(l) || IRRPL[l] && IRRPL[l] === l) return n; return plural(l); }
  var SUBJ1 = 'I|you|we|they|he|she|it|my \\w+|our \\w+|your \\w+|his \\w+|her \\w+|their \\w+|the \\w+';
  var FAM = 'sister|brother|mother|father|mum|mom|dad|son|daughter|husband|wife|aunt|aunty|auntie|uncle|cousin|grandmother|grandfather|grandma|grandpa|nana|niece|nephew|partner|boss|teacher|friend|neighbour|neighbor|colleague|doctor|parents';
  var UNIQUE = 'mum|mom|dad|mother|father|husband|wife|partner|grandmother|grandfather|boss';
  var STATIVE = { knowing: 'know', liking: 'like', believing: 'believe', understanding: 'understand', owning: 'own', needing: 'need', wanting: 'want', preferring: 'prefer', belonging: 'belong', meaning: 'mean', hating: 'hate', seeming: 'seem', remembering: 'remember', recognising: 'recognise', recognizing: 'recognize', containing: 'contain', deserving: 'deserve', costing: 'cost' };
  var AMBIG = 'work|help|play|love|walk|talk|call|answer|look|change|plan|book|order|text|email|rest|shop|drink|fix|park|cook|hope|care|kiss|hug|smile|laugh|dance|run|show|turn|pick|check|visit|use|need|want|like|share|stay|travel|wait|start|stop|return|reply|study|time|fun|cut|set|hit|put|cost|read|let|hurt|shut|come|become|be|lunch|dinner|breakfast|money|kids|children|friends|family|a|an|the|no|some|any|to|got|been|done|seen';
  function third2(subj, b) { if (b === 'be') return /^i$/i.test(subj) ? 'am' : /^(you|we|they)$/i.test(subj) || /s$/.test(subj) && !/^(his|this|its)$/i.test(subj) ? 'are' : 'is'; if (/^(he|she|it)$/i.test(subj) || /^(my|our|your|his|her|their|the) \w+[^s]$/i.test(subj)) return VERB[b] ? VERB[b][0] : b + 's'; return b; }
  var GRAM_ADV = [
    // --- verb tenses ---
    [/\b(already) (\w+)\b/gi, function (m, a, v, off, all) {
      var sent = all.slice(0, off).split(/[.!?\n]/).pop() + m;
      if (!/\b(when|by the time|before|after|as soon as)\b[^,]*\b(\w+ed|came|went|got|arrived|left|saw|woke|began|ran)\b/i.test(sent)) return m;
      var low = v.toLowerCase(), b = FORM[low]; if (!b || low === b || VERB[b][1] !== low && VERB[b][3] !== low) return m; if (/\bhad\s+$/.test(all.slice(Math.max(0, off - 6), off))) return m;
      return 'had ' + a + ' ' + VERB[b][3];
    }, 'Earlier past action: use the past perfect (had already started)'],
    [new RegExp('\\b(By (?:next \\w+|the end of (?:the )?\\w+|20\\d\\d|tomorrow|then|the time \\w+ \\w+|Friday|Monday|June|December)),? (' + SUBJ1 + ') will (?!have\\b)(' + RX_BASE + ')\\b', 'g'), function (m, by, s, v) { return by + ', ' + s + ' will have ' + VERB[v.toLowerCase()][3]; }, 'By + future time: use “will have + past participle”'],
    [/\b(I|you|we|they|he|she|it|my \w+|the \w+|people|everyone|nobody) (am|is|are|was|were|’m|’re|’s) (knowing|liking|believing|understanding|owning|needing|wanting|preferring|belonging|meaning|hating|seeming|remembering|recognising|recognizing|containing|deserving|costing)\b/gi, function (m, s, be, v) {
      var b = STATIVE[v.toLowerCase()], past = /^(was|were)$/i.test(be);
      return s + ' ' + (past ? VERB[b] ? VERB[b][1] : b + 'ed' : third2(s, b));
    }, 'This verb describes a state, not an action: use the simple form (I know)'],
    [/\b(I|you|we|they|he|she|it|my \w+|the \w+) (am|is|are|’m|’re|’s) having (a|an|two|three|four|no|many|any|some|one|lots of) (car|cars|house|houses|dog|dogs|cat|cats|brother|brothers|sister|sisters|child|children|kids|son|sons|daughter|daughters|job|jobs|money|phone|computer|garden|bike|boat|degree|problem|problems|headache|cold|idea|ideas)\b/gi, function (m, s, be, d, n) { return s + ' ' + third2(s, 'have') + ' ' + d + ' ' + n; }, '“Have” for owning is not used in the -ing form'],
    [new RegExp('^(While|As|When) (I|he|she|it|we|they|you|my \\w+) (cooked|walked|watched|slept|drove|studied|ate|played|worked|talked|waited|cleaned|ran|swam|danced|showered|travelled|traveled|shopped|read|wrote|sat|stood|waited|listened|cycled|jogged|swept|washed|ironed|gardened|painted),? (?=(the|a|my|I|we|he|she|they|someone|somebody|suddenly|it)\\b[^.!?]*\\b(rang|called|came|arrived|started|began|broke|fell|knocked|saw|heard|happened|appeared|stopped|went))', 'g'), function (m, w, s, v) {
      var b = FORM[v.toLowerCase()] || v.toLowerCase(); var be = /^(I|he|she|it)$/i.test(s) || /^my /i.test(s) ? 'was' : 'were';
      return w + ' ' + s + ' ' + be + ' ' + (VERB[b] ? VERB[b][2] : b + 'ing') + ', ';
    }, 'Longer background action: use the past continuous (I was cooking)'],
    [new RegExp('\\b(have|has|had|haven’t|hasn’t|hadn’t|I’ve|you’ve|we’ve|they’ve|’ve) (' + RX_BASE + ')\\b(?! (to|of|on|off|out|up|for|with|and)\\b)', 'gi'), function (m, h2, v) {
      var b = v.toLowerCase(); if (new RegExp('^(' + AMBIG + ')$').test(b) || !VERB[b] || VERB[b][3] === b) return m; return h2 + ' ' + VERB[b][3];
    }, 'After have/has/had use the past participle (have finished)'],
    [/\b(I|you|we|they|he|she|my \w+) use to (\w+)\b/gi, function (m, s, v) { return s + ' used to ' + v; }, '“used to” for past habits'],
    [/\b(didn’t|didn't|did not|never) used to\b/gi, function (m, a) { return a + ' use to'; }, 'After “didn’t”, write “use to”'],
    [new RegExp('\\b(am|is|are|was|were|’m|’re|’s|get|gets|got|getting|become|became) used to (' + RX_BASE + ')\\b', 'gi'), function (m, a, v) { var b = v.toLowerCase(); return a + ' used to ' + (VERB[b] ? VERB[b][2] : b + 'ing'); }, '“be used to” + -ing (I am used to waking up early)'],
    [new RegExp('\\b(It is|It’s|It has been|it is|it’s) (raining|snowing|pouring)\\b([^.!?]{0,20}?)\\b(since (?:morning|this morning|yesterday|last night|lunch|lunchtime|breakfast|\\d{1,2}(?: ?[ap]m)?|monday|tuesday|wednesday|thursday|friday|saturday|sunday)|for (?:' + NUMW + ') (?:hours?|days?|weeks?|minutes?))', 'gi'), function (m, s, v, mid, t) { return keepCase(s, 'it') + ' has been ' + v + mid + t; }, 'With “since/for”, use “has been + -ing”'],
    // --- passive voice ---
    [new RegExp('\\b(is|are|was|were|be|been|being|isn’t|aren’t|wasn’t|weren’t) (' + alt(BASES.filter(function (b) { return VERB[b][3] !== b && !new RegExp('^(back|move|correct|warm|dry|empty|clear|slow|double|calm|smooth|level|cool|open|close|clean|free|like|tidy|use|care|rest|hope|wait|love|work|play|plan|book|park|shop|check|order|text|email|fix|cook|answer|call|change|show|turn|pick|share|stay|travel|start|stop|return|reply|study|visit|need|want|look|talk|walk|help|kiss|hug|smile|laugh|dance|pray|bake|paint|push|pull|thank|agree|believe|pass|miss|join|follow|save|invite|attend|receive|explain|prepare|complete|relax|worry|drop|text|cross|fill|earn|rent|note|notice|collect|offer|manage|graduate|hate|prefer|promise|refuse|expect|intend|afford|continue|lie|light|set|dig|stick|lead|mean|stand|sit|feel|keep|find|hold|run|lose|win|fight|fall|hang|bring|become)$').test(b); }).concat(['wrote', 'took', 'gave', 'ate', 'broke', 'spoke', 'chose', 'drove', 'stole', 'began', 'sang', 'drank', 'swam', 'flew', 'knew', 'grew', 'threw', 'wore', 'rode', 'hid', 'bit', 'froze', 'forgot', 'forgave', 'shook', 'woke', 'blew', 'drew', 'saw', 'did'])) + ')\\b(?! (to|for|me|you|him|her|us|them|it)\\b)', 'gi'), function (m, be, v) {
      var low = v.toLowerCase(), b = FORM[low] || low; if (!VERB[b]) return m; if (low === VERB[b][3]) return m; return be + ' ' + VERB[b][3];
    }, 'Passive: be + past participle (was built, was written)'],
    [/\b(was|were|is|are|has been|have been|had been|be|been) (happened|occurred|arrived|died|existed|disappeared|emerged|risen|appeared|seemed|belonged|consisted|happen|occur|exist|disappear|appear|belong|consist)\b/gi, function (m, be, v) {
      var x = v.toLowerCase().replace(/ed$/, '').replace(/^(happen|occurr|occur|arriv|di|exist|disappear|emerg|appear|seem|belong|consist|ris)$/, function (y) { return { occurr: 'occur', arriv: 'arrive', di: 'die', emerg: 'emerge', ris: 'rise' }[y] || y; });
      if (x === 'risen') x = 'rise'; var past = { occur: 'occurred', arrive: 'arrived', die: 'died', emerge: 'emerged', rise: 'rose' }[x] || x + 'ed';
      var low = be.toLowerCase(); if (/^(was|were)$/.test(low)) return past; if (/^(is)$/.test(low)) return x + 's'; if (low === 'are') return x; if (/^(has been|have been)$/.test(low)) return low.split(' ')[0] + ' ' + (x === 'rise' ? 'risen' : past); if (low === 'had been') return 'had ' + (x === 'rise' ? 'risen' : past); return m;
    }, 'This verb has no passive (it happened, not it was happened)'],
    [/\b(the|a|my|our|your|his|her|their|this|that) (window|door|glass|cup|vase|car|house|letter|cake|book|phone|bridge|road|wall|plate|bike|computer|email|report|song|picture|painting|poem|meal|dinner|fence|roof|toy|chair|table|tree|bag|wallet|money|tyre|tire) (broke|wrote|built|made|painted|took|stole|ate|cleaned|fixed|repaired|designed|cooked|sent|opened|closed|damaged|destroyed|cut|sold|bought|found|lost|chose|drew|sang|planted|delivered) by\b/gi, function (m, d, n, v) { return d + ' ' + n + ' was ' + pp(v) + ' by'; }, 'Passive: “was broken by”'],
    // --- adjective (relative) clauses ---
    [new RegExp('\\b((?:my|our|your|his|her|their|the|a) (?:' + FAM + ')) which\\b', 'gi'), function (m, n) { return n + ' who'; }, 'Use “who” for people'],
    [/\b(man|woman|person|boy|girl|friend|family|people|student|students|teacher|neighbour|neighbor|child|children|company|lady|guy|men|women|doctor|customer) (that|who) (his|her|their|its) (\w+)\b/gi, function (m, n, r, p2, o) { return n + ' whose ' + o; }, 'Use “whose” for belonging'],
    [/\bwhere ((?:I|we|you|they|he|she|my \w+|our \w+) (?:grew up|live|lived|work|worked|stay|stayed|study|studied|was born|were born|met|go|went)) (in|at|to)\b(?=\s+(?:is|was|are|were|has|have|will|still|used)\b|\s*[,.!?])/gi, function (m, c) { return 'where ' + c; }, 'After “where”, no extra “in/at”'],
    [/\b(which|that|where|who|whom) ((?:I|we|you|they|he|she) \w+(?: (?:in|at|on|to|with|for|about|from))?) (it|them|him|her)\b(?= (?:is|was|are|were|has|have|will|can|looks?|seems?)\b)/gi, function (m, r, c) { return r + ' ' + c; }, 'Don’t repeat the object after which/that'],
    [/\b(people|students|children|men|women|friends|kids|workers|parents|teachers|man|woman|person|boy|girl|teacher|lady|student|child|friend|ones?) (who|that) (they|he|she) (?=\w)/gi, function (m, n, r) { return n + ' ' + r + ' '; }, 'Don’t repeat the subject after who/that'],
    [/\b(a|an|some|any|another|one|two|three|several|many) (\w+), (who|that) (?=\w)/gi, function (m, d, n, r) { return d + ' ' + n + ' ' + r + ' '; }, 'No comma before a clause that identifies which one'],
    [/\b(\w+), that (is|was|are|were|has|have|had|can|will|would|I|we|you|they|he|she|it)\b/g, function (m, n, x, off, all) { if (/\b(so|such|said|say|says|think|know|believe|hope|feel|mean|told|tell|sure|clear|true|fact)$/i.test(n)) return m; if (/^(I|we|you|they|he|she|it)$/.test(x)) return m; return n + ', which ' + x; }, 'After a comma, use “which” (not “that”)'],
    // --- noun clauses and reported speech ---
    [/\b(asked|wondered|wanted to know|didn’t know|did not know|couldn’t remember|forgot|had no idea|wasn’t sure) ((?:me|him|her|us|them) )?(where|what|when|why|how|who|what time|how much|how many|how long|how often|which \w+|if|whether) (do|does|did|is|are|was|were|can|will) (I|you|we|they|he|she|it|the \w+|my \w+|your \w+) (\w+)\b/gi, function (m, v, o, w, aux, s, verb) {
      var a = aux.toLowerCase(), b = FORM[verb.toLowerCase()];
      if (/^(do|does|did)$/.test(a)) { if (!b) return m; return v + ' ' + (o || '') + w + ' ' + s + ' ' + VERB[b][1]; }
      var map = { is: 'was', are: 'were', was: 'was', were: 'were', can: 'could', will: 'would' };
      return v + ' ' + (o || '') + w + ' ' + s + ' ' + map[a] + ' ' + verb;
    }, 'Reported question: normal word order and a past tense (where I lived)'],
    [/\b(tell me|know|wonder|understand|explain|sure|remember|idea|let me know|find out|check|show me|ask him|ask her|ask them) (what time|how much|how many|how long|how often|which \w+) (do|does|did) (you|he|she|they|we|I|it|the \w+|my \w+) (\w+)/gi, function (m, a, w, d, sb, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; var out = d.toLowerCase() === 'did' ? VERB[b][1] : d.toLowerCase() === 'does' || /^(he|she|it)$/i.test(sb) || /^(the|my) \w+[^s]$/i.test(sb) ? VERB[b][0] : b; return a + ' ' + w + ' ' + sb + ' ' + out; }, 'Inside a sentence, keep normal word order (what time the shop opens)'],
    [/\b(said|told (?:me|him|her|us|them|everyone)|explained|replied|mentioned|added|complained|admitted|claimed|announced) (that )?(he|she|they|I|we|it|you|the \w+|my \w+) (is|are|am|has|have|will|can|does|do|doesn’t|don’t|isn’t|aren’t|won’t|can’t)\b/gi, function (m, v, t, s, a) {
      var map = { is: 'was', am: 'was', are: 'were', has: 'had', have: 'had', will: 'would', can: 'could', does: 'did', do: 'did', 'doesn’t': 'didn’t', 'don’t': 'didn’t', 'isn’t': 'wasn’t', 'aren’t': 'weren’t', 'won’t': 'wouldn’t', 'can’t': 'couldn’t' };
      return v + ' ' + (t || '') + s + ' ' + map[a.toLowerCase()];
    }, 'Reported speech: shift the tense back (is → was)'],
    // --- conjunctions, connectives, adverb clauses ---
    [new RegExp('\\b(Despite|despite|In spite of|in spite of) (it|I|we|he|she|they|you|there|the \\w+|my \\w+|our \\w+) (was|were|is|are|had|has|have|did|didn’t|wasn’t|weren’t|could|couldn’t|' + RX_PAST + ')\\b', 'g'), function (m, d, s, v) { return keepCase(d, 'although') + ' ' + s + ' ' + v; }, '“Despite” + noun; use “although” + clause'],
    [/(^|[.!?]\s+|,\s+)(Even|even) (I|you|we|they|he|she|it|my \w+|the \w+|there) (was|were|is|are|had|have|did|didn’t|wasn’t|am|can|could|\w+ed)\b/g, function (m, pre, e, s, v) { return pre + keepCase(e, 'even') + ' though ' + s + ' ' + v; }, '“even though” + clause'],
    [new RegExp('\\b(due to|because of|owing to) (I|we|you|they|he|she|it|there|the \\w+|my \\w+) (was|were|is|are|had|has|have|did|didn’t|wasn’t|couldn’t|could|' + RX_PAST + ')\\b', 'gi'), function (m, d, s, v) { return 'because ' + s + ' ' + v; }, '“due to” + noun; use “because” + clause'],
    [/\b(Unless|unless) (I|you|we|they|he|she|it|the \w+|my \w+) (don’t|doesn’t|do not|does not) (\w+)/g, function (m, u, s, n, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; return u + ' ' + s + ' ' + third2(s, b); }, '“unless” already means “if not”'],
    [/(\w),\s+(however|therefore|moreover|furthermore|consequently|nevertheless|nonetheless|otherwise|thus|hence|meanwhile|instead|besides|in addition|as a result|for example|for instance|in fact|on the other hand),?\s+(I|we|he|she|they|it|you|my \w+|our \w+|the \w+|there|this|that|these|those|most|many|some)\b/g, function (m, a, t, s) { return a + '; ' + t + ', ' + s; }, 'Use a semicolon before however/therefore joining two sentences'],
    [/(\w),\s+(let’s|let's|let us) /g, function (m, a, l) { return a + '; ' + l + ' '; }, 'Two sentences: use a semicolon or full stop'],
    [/\b(Because|because|Since|As) ([^,.!?]{3,60}), so /g, function (m, c, mid) { return c + ' ' + mid + ', '; }, 'Don’t use “so” after “because”'],
    [/\b(Although|Though|Even though) ([^,.!?]{3,60}), (but|yet|however) /g, function (m, c, mid) { return c + ' ' + mid + ', '; }, 'Don’t use “but” after “although”'],
    // --- agreement and structure ---
    [/\b(Each|each|Every one|every one|Neither|neither|Either|either) of (the|my|our|your|his|her|their|these|those|them|us|you)\b ?(\w+)? (have|are|were|do|don’t|aren’t|weren’t)\b/g, function (m, e, d, n, v) { var map = { have: 'has', are: 'is', were: 'was', do: 'does', 'don’t': 'doesn’t', 'aren’t': 'isn’t', 'weren’t': 'wasn’t' }; return e + ' of ' + d + (n ? ' ' + n : '') + ' ' + map[v]; }, '“Each/neither of …” takes a singular verb'],
    [new RegExp('\\b(One|one) of (the|my|our|your|his|her|their|these|those) (\\w+) (' + RX_BASE + '|have|are|were|do)\\b', 'g'), function (m, o, d, n, v) {
      if (/^(best|worst|most|few|main|biggest|greatest|top)$/i.test(n)) return m;
      var map = { have: 'has', are: 'is', were: 'was', do: 'does' }, vv = map[v] || (VERB[v.toLowerCase()] ? VERB[v.toLowerCase()][0] : v); return o + ' of ' + d + ' ' + plur2(n) + ' ' + vv;
    }, '“One of my friends lives …” (plural noun, singular verb)'],
    [/\b(One|one) of (the|my|our|your|his|her|their|these|those) (best|worst|most \w+|biggest|greatest|top|few|main|nicest|oldest|largest|smallest|happiest|richest|fastest|tallest) ([a-z]{3,})\b/g, function (m, o, d, a, n) { if (/^(in|of|and|for|the|ever|that|who|which|i|we|you)$/.test(n) || /s$/.test(n) || IRRPL[n] === undefined && /(ing|ly|ed)$/.test(n)) return m; return o + ' of ' + d + ' ' + a + ' ' + plur2(n); }, '“one of the best players” (plural)'],
    [/\b(The|the) number of (\w+) (are|were|have)\b/g, function (m, t, n, v) { return t + ' number of ' + n + ' ' + { are: 'is', were: 'was', have: 'has' }[v]; }, '“The number of …” is singular'],
    [/\b(A|a) number of (\w+) (is|was|has)\b/g, function (m, t, n, v) { return t + ' number of ' + n + ' ' + { is: 'are', was: 'were', has: 'have' }[v]; }, '“A number of …” is plural'],
    [new RegExp('\\b((?:the|this|that|some|my|your|our|more|all the|much|any|their|his|her) (?:' + UNCOUNT + '))(s)? (are|were|have)\\b', 'gi'), function (m, n, s2, v) { return n + ' ' + { are: 'is', were: 'was', have: 'has' }[v.toLowerCase()]; }, 'Uncountable noun: singular verb (the information is)'],
    [/\b(feel|feels|felt|feeling|look|looks|looked|smell|smells|smelled|smelt|taste|tastes|tasted|sound|sounds|sounded|seem|seems|seemed) (badly)\b/gi, function (m, v) { return v + ' bad'; }, 'After feel/look/seem use an adjective (feel bad)'],
    [/\b(drive|drives|drove|driving|speak|speaks|spoke|speaking|talk|talks|talked|work|works|worked|working|walk|walks|walked|run|runs|ran|write|writes|wrote|play|plays|played|sing|sings|sang|cook|cooks|cooked|answer|answered|listen|listens|listened|move|moves|moved|act|acted|behave|behaves|behaved|dress|dressed|eat|eats|ate|drive|think|thinks|thought|breathe|breathes|explain|explained|finish|finished|react|reacted|reply|replied|respond|responded) (careful|quick|slow|quiet|loud|bad|happy|easy|clear|proper|correct|beautiful|nice|honest|safe|calm|polite|serious|perfect|fluent|patient|gentle|sudden|careless|brave|kind|warm|soft|neat|regular|direct|angry|nervous|confident|smooth|rude|polite|quick)\b(?! (and|or)\b)/gi, function (m, v, a) { return v + ' ' + adverb(a); }, 'Use an adverb to describe how (drives carefully)'],
    [/\b(suggest|suggests|suggested|suggesting|recommend|recommends|recommended) to (\w+)\b/gi, function (m, a, v) { var b = FORM[v.toLowerCase()]; if (!b || v.toLowerCase() !== b) return m; return a + ' ' + VERB[b][2]; }, '“suggest + -ing” (suggested going)'],
    [/\b(I|we|you|they|he|she) (married|marry) (with|to) /g, function (m, s, v) { return s + ' ' + v + ' '; }, '“I married her” (no “with”)'],
    [/\b(revert back|revert) (to (?:me|us|him|her|them)|on this|on (?:the|my) email)\b/gi, function (m, a, t) { return /^to/i.test(t) ? 'reply ' + t : 'reply'; }, 'Say “reply” (revert means go back to a previous state)'],
    [/\brevert back\b/gi, function (m) { return keepCase(m, 'reply'); }, 'Say “reply”'],
    [/\b(do|does|did|kindly do) the needful\b/gi, function (m) { return 'do what is needed'; }, 'Say “do what is needed”'],
    [/\bprepone(d)?\b/gi, function (m, d) { return d ? 'brought forward' : 'bring forward'; }, 'Say “bring forward”'],
    [/\bcope up with\b/gi, function (m) { return keepCase(m, 'cope with'); }, '“cope with” (no “up”)'],
    [/\bbetween you and I\b/gi, function (m) { return keepCase(m, 'between you and me'); }, 'Say “between you and me”'],
    // --- punctuation ---
    [/\b((?:two|three|four|five|six|seven|several|the following|these|a few) (?:things|items|reasons|steps|tips|ingredients|places|countries|subjects|languages|people|options|ways|colours|colors|foods|questions|rules|tools|skills|cities))\s+(?!(?:to|for|in|on|at|of|that|which|are|is|were|was)\b)(\w+(?: \w+)?, \w+(?: \w+)?,? (?:and|or) \w+)/gi, function (m, a, list) { return a + ': ' + list; }, 'Use a colon before a list'],
    [/\b(are|is|were|was|include|includes|including|such as|like)[;:]\s+/gi, function (m, a) { return a + ' '; }, 'No colon or semicolon straight after a verb'],
    [/\b(\w+ed|wagged|lost|has|had|in|on|of|with|into|from|by|at|for|about|under|change|changed|lost|know|find|found|took|gave) (it’s|it's) (tail|own|name|colour|color|shape|size|way|purpose|leaves|paws|nest|head|eyes|legs|wings|value|price|best|place|food|toys?|owner|home|history|people|roots|surface|engine|doors?|windows?|roof|branches|fur|ears|mouth|nose|teeth|beauty|charm|job|work|role|power|meaning|course|end|side|top|bottom|centre|center|own way)\b/gi, function (m, a, i, n) { return a + ' its ' + n; }, '“its” (no apostrophe) shows belonging'],
    [/\b(the|my|our|your|their|his|her) (kids|parents|students|girls|boys|teachers|friends|neighbours|neighbors|dogs|cats|players|workers|babies|sisters|brothers|grandparents|customers|guests) (toys?|room|rooms|house|names|bags|books|shoes|clothes|bikes|school|teacher|lunches|lunch|homework|rights|party|car|cars|team|ideas|future|safety|health|bedroom|bedrooms|beds|food|bowls|uniforms|birthday|birthdays|wedding|anniversary|questions|feedback|home|faces|work|marks|results)\b/gi, function (m, d, n, o) { return d + ' ' + n + '’ ' + o; }, 'Plural owner: add the apostrophe after s (the kids’ toys)'],
    [/\b(said|asked|replied|shouted|whispered|says|asks|cried|answered|explained|added),?\s*["“]([a-z])([^"”\n]*?)["”]\s*([?!.])/gi, function (m, v, f, r, p2) { return v + ', “' + f.toUpperCase() + r + p2 + '”'; }, 'Quotation: comma before, capital letter, and the ? inside the quotation marks'],
    [/\b(said|asked|replied|shouted|whispered|says|asks|answered),?\s*["“]([A-Z])([^"”\n]*?)["”]\s*([?!.])/g, function (m, v, f, r, p2) { return v + ', “' + f + r + p2 + '”'; }, 'Quotation: the ? goes inside the quotation marks'],
    [/, (and|or), (?=\w)/g, function (m, c) { return ' ' + c + ' '; }, 'No comma after “and” in a list'],
    [/\b(Thank you|Thanks|Sorry|Congratulations|Well done|Good luck|Happy birthday|Excuse me|See you) ([A-Z][a-z]+) (for|on|with|and|again|tomorrow|soon|later)\b/g, function (m, t, n, w) { return t + ', ' + n + ', ' + w; }, 'Put commas around the name of the person you are talking to'],
    [/\b(Thank you|Thanks|Sorry|Congratulations|Well done|Good luck|Happy birthday|Bye|Goodbye|See you|Good night|Good morning) ([A-Z][a-z]+)(?=[.!?]|$)/gm, function (m, t, n) { return /^(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Everyone|All)$/.test(n) ? m : t + ', ' + n; }, 'Put a comma before the name of the person you are talking to'],
    [/(^|[.!?]\s+|\n)(After|Before|During|Despite|Because of|Due to|Thanks to|According to|Unlike|Like|Besides|Apart from|Instead of|In spite of) ([a-z]+(?: [a-z]+){0,4}) (I|we|you|he|she|they|it|there|my \w+|our \w+|the \w+|people|everyone|most \w+) (?=\w)/g, function (m, pre, p2, phr, s) {
      if (/\b(I|we|you|he|she|they|it)\b/.test(phr) || /(^| )(is|was|are|were|had|have|did)( |$)/.test(phr)) return m;
      return pre + p2 + ' ' + phr + ', ' + s + ' ';
    }, 'Add a comma after an opening phrase'],
    [/(^|[.!?]\s+|\n)(When|If|Although|Though|Even though|Because|While|As soon as|Once|Unless|After|Before|Since|Until|Whenever|Wherever|As long as) ((?:I|we|you|he|she|they|it|there|my \w+|our \w+|the \w+|people|everyone|\w+) (?:[\w’']+ ){0,8}?[\w’']+) (I|we|you|he|she|they|there|my \w+|our \w+|the \w+|people|everyone) (will|would|can|could|should|must|might|may|am|is|are|was|were|have|has|had|went|go|goes|felt|feel|got|get|stayed|stay|called|call|cooked|cook|left|leave|came|come|ran|run|love|loved|helped|help|watched|watch|made|make|took|take|saw|see|did|do|didn’t|don’t|won’t|can’t|couldn’t|always|never|usually|often|still|also|just|then|need|needed|want|wanted|ate|eat|slept|sleep|started|start|stopped|stop|bought|buy|tried|try|decided|decide|knew|know|met|meet|found|find|said|say|told|tell|asked|ask)\b/g, function (m, pre, c, cl, s, v) {
      var words = cl.split(/\s+/); if (words.length < 2) return m;
      var hasVerb = words.some(function (t) { var l = t.toLowerCase(); return FORM[l] || /^(am|is|are|was|were|be|been|can|could|will|would|should|must|’s|’re|’m|didn’t|don’t|doesn’t|won’t|can’t|isn’t|wasn’t)$/.test(l) || /(ed|’s|’re|’m|n’t)$/.test(l); });
      if (!hasVerb) return m;
      return pre + c + ' ' + cl + ', ' + s + ' ' + v;
    }, 'Put a comma after an opening clause (When I got home, I cooked)'],
    [/(^|\n)(I wonder|I don’t know|I do not know|I’m not sure|I am not sure|I asked|She asked|He asked|They asked|We asked|I want to know|I’d like to know|I would like to know|I’m wondering|I am wondering|Please let me know|Let me know)\b([^?\n"“”]*)\?/g, function (m, pre, a, rest) { return pre + a + rest + '.'; }, 'An indirect question ends with a full stop'],
    [/\b([Oo]n )?the (\d{1,2})(?:st|nd|rd|th)? of (January|February|March|April|May|June|July|August|September|October|November|December)\b/g, function (m, on, d, mo) { return (on ? on : '') + d + ' ' + mo; }, 'NZ date style: 5 May'],
    [/\b(\d{1,2})(st|nd|rd|th) (January|February|March|April|May|June|July|August|September|October|November|December)\b/g, function (m, d, s2, mo) { return d + ' ' + mo; }, 'NZ date style: 5 May'],
    [/([a-z]) (it is|it’s|they are|they’re|we are|we’re|I am|I’m|she is|she’s|he is|he’s|there is|there are) (?=(?:so|very|really|a|an|the|beautiful|amazing|lovely|great|good|nice|fun|delicious|expensive|cheap|cold|hot|big|small|busy|quiet|easy|hard|my|our|always|never|not|too)\b)/g, function (m, a, s2, off, all) {
      var before = all.slice(0, off + 1).split(/[.!?\n;:,]/).pop(), words = before.trim().split(/\s+/), last = words[words.length - 1] || '';
      if (words.length < 3) return m;
      if (/^(and|but|or|so|because|that|if|when|while|although|though|since|after|before|until|unless|which|who|where|as|than|think|thought|know|knew|said|says|hope|believe|feel|felt|guess|mean|wish|say|tell|told|is|was|are|were|be|am|do|does|did|can|could|will|would|should|must|to|of|in|on|at|for|with|from|by|about|like|what|how|why|whether|even|also|then|sure|glad|happy|sorry|afraid|seems|seemed|realise|realize|realised|realized|show|shows|showed|means|meant|because)$/i.test(last)) return m;
      var hasVerb = words.some(function (t) { var l = t.toLowerCase().replace(/[^a-z’']/g, ''); return FORM[l] || /^(am|is|are|was|were|can|could|will|would|let’s)$/.test(l); });
      if (!hasVerb) return m;
      return a + '. ' + s2.charAt(0).toUpperCase() + s2.slice(1) + ' ';
    }, 'Two sentences run together: add a full stop'],
  ];

  GRAM_PRE.push.apply(GRAM_PRE, GRAM_ADV);
  /* ---------- everyday-writing patterns (learned from real messages) ---------- */
  var ADVS = 'always|usually|often|never|sometimes|also|really|still|just|only|already|now|then|normally|generally|rarely|seldom|even|actually|currently|mostly';
  var RX_ING = alt(BASES.map(function (b) { return VERB[b][2]; }));
  var GRAM_REAL = [
    [/\b(send|sent|sending|sends|write|wrote|writing|writes|got|get|gets|receive|received|reply to|replied to|check|checked|read) ((?:you|me|him|her|them|us) )?(email|text|message|letter|invoice|quote|receipt|reminder|update)\b/gi, function (m, v, o, n, off, all) { return v + ' ' + (o || '') + (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n; }, 'Add “a/an” (send you an email)'],
    [/\b(borrow|borrows|borrowed|borrowing) (me|him|her|us|them) (your|his|her|their|my|our|a|an|the|some)\b/gi, function (m, v, o, d) { var map = { borrow: 'lend', borrows: 'lends', borrowed: 'lent', borrowing: 'lending' }; return keepCase(v, map[v.toLowerCase()]) + ' ' + o + ' ' + d; }, '“lend me” (you borrow FROM someone)'],
    [/\b(wait|waits|waited|waiting) (you|me|him|her|us|them)\b(?! (?:to|for)\b)/gi, function (m, v, o) { return v + ' for ' + o; }, '“wait for you”'],
    [/\b(my|his|her|our|their|your) (son|daughter|brother|sister|mum|mom|dad|mother|father|husband|wife|friend|cousin|partner|kids|children|parents|boss|niece|nephew) (is|are|was|were) (study|work|live|stay|cook|play|watch|sleep|eat|drive|wait|learn|teach|read|write|travel|visit|run|swim|walk|talk|clean|help|shop|go|come|look|try|plan|use|do|make|take|get|have|feel|think|prepare)\b/gi, function (m, d, n, be, v) { return d + ' ' + n + ' ' + be + ' ' + VERB[v.toLowerCase()][2]; }, 'Use the -ing form after is/are (is studying)'],
    [/\b(university|University) of ([a-z]+)\b/g, function (m, u, c) { return 'University of ' + c.charAt(0).toUpperCase() + c.slice(1); }, 'Capital letters for a university name'],
    [/\b(the|The|my|My|our|Our|your|their|these|those) ((?:\w+ )?)([a-z]{3,}[^su\s’'])s (is|was|has)\b/g, function (m, d, adj, n, v) { var w = n + 's'; if (/^(news|series|species|maths|physics|economics|politics|lens|bus|gas|glass|class|boss|dress|address|business|process|success|stress|kindness|illness|happiness|fitness|wellness|mess|loss|access|bonus|campus|virus|status|crisis|analysis|basis|thesis|christmas|lens|always|sometimes|perhaps|yes|this|his|its|us|plus|minus)$/.test(w) || /(ss|us|is)$/.test(w)) return m; return d + ' ' + adj + w + ' ' + { is: 'are', was: 'were', has: 'have' }[v]; }, 'Plural subject: use “are/were/have”'],
    [/\b(The|the|My|my|Our|our|This|this|That|that) ((?:\w+ )?)(food|service|weather|money|information|advice|furniture|news|music|traffic|equipment|homework|luggage|water|rice|bread|coffee|tea|milk|meat|staff|team|family|government|company) (were|are|have)\b/g, function (m, d, adj, n, v) { if (/^(staff|team|family|government|company|police)$/.test(n)) return m; return d + ' ' + adj + n + ' ' + { were: 'was', are: 'is', have: 'has' }[v]; }, 'Singular/uncountable noun: use “is/was”'],
    [new RegExp('\\b(a|an|this|one|the|my|our|his|her|their|your) ((?:[a-z]+ ){0,2})([a-z]+) (that|which|who) (' + RX_BASE + ')\\b', 'gi'), function (m, d, adj, n, r, v) { var nl = n.toLowerCase(); if (/s$/.test(nl) && !/(ss|us|is)$/.test(nl) || /^(people|children|men|women|police|staff|sheep|fish|data|kids|ones|i|you|we|they)$/.test(nl) || FORM[nl]) return m; var b = v.toLowerCase(); if (!VERB[b] || /^(let|put|cut|hit|set|cost|shut|read|hurt)$/.test(b)) return m; return d + ' ' + adj + n + ' ' + r + ' ' + VERB[b][0]; }, 'Singular noun + who/that: add “s” (a dog that barks)'],
    [/\b(Can|Could|Would|Will) you (help|assist) (me|us|him|her|them) to (\w+)\b/g, function (m, a, h2, o, v) { return a + ' you ' + h2 + ' ' + o + ' ' + v; }, '“help me fix” (no “to” needed)'],
    [/\b(my|your|his|her|our|their) (son|daughter|mum|mom|dad|mother|father|sister|brother|wife|husband|friend|boss|baby|child|grandmother|grandfather|nana|uncle|aunty|aunt|cousin|niece|nephew|partner|neighbour|neighbor|teacher|dog|cat) (birthday|party|school|teacher|wedding|house|home|car|room|name|friends?|job|graduation|christening|baptism|funeral|anniversary|phone|bag|toys?|clothes|shoes|work|office|place|family|kids|children|husband|wife|boyfriend|girlfriend|class|homework|doctor|bed|bike|lunch|food)\b/gi, function (m, d, n, o) { return d + ' ' + n + '’s ' + o; }, 'Use ’s to show belonging (my son’s birthday)'],
    [/\b(car|bike|computer|laptop|phone|washing machine|fridge|tv|TV|printer|van|truck|bus|dishwasher|heater) (was|is|got|has) (broke|broken) down\b/gi, function (m, n, v) { return n + (/^(is|has)$/i.test(v) ? ' has broken down' : ' broke down'); }, '“My car broke down” (no “was”)'],
    [/\blate (in|on|to) (work|school|class|church|the meeting|my appointment|the appointment)\b/gi, function (m, p, w) { return 'late for ' + w; }, '“late for work”'],
    [/\b(first|last|next|second) day (in|on) (school|work|the job|kindy|kindergarten|university|uni)\b/gi, function (m, a, p, w) { return a + ' day at ' + w; }, '“first day at school”'],
    [/\b(posted|advertised|listed|found|saw|seen|read|published) (in|at) (your|the|our|their|this) (website|site|page|app|facebook page|seek|trade me|social media)\b/gi, function (m, v, p, d, n) { return v + ' on ' + d + ' ' + n; }, '“on your website”'],
    [/\b(appointment) (in|at) (the|my) (doctor|dentist|gp|GP|optometrist|physio|nurse|vet)\b/gi, function (m, a, p, d, n) { return a + ' with ' + d + ' ' + n; }, '“an appointment with the doctor”'],
    [/\b(excited|nervous|worried|scared|anxious) for (his|her|my|the|our|their|your) (first|new|big|exam|exams|trip|holiday|test|interview|wedding|birthday|party|results)\b/gi, function (m, a, d, n) { return a + ' about ' + d + ' ' + n; }, '“excited about”'],
    [/\b(good|bad|great|better|best|excellent|terrible|clever|poor|weak|strong|brilliant|amazing) in (\w+ing)\b/gi, function (m, a, w) { return a + ' at ' + w; }, '“good at reading”'],
    [/\b(regarding|concerning|considering) to\b/gi, function (m, a) { return a; }, 'No “to” after regarding'],
    [/\b(told|tells|tell) that\b/gi, function (m, t) { return { told: 'said', tells: 'says', tell: 'say' }[t.toLowerCase()] + ' that'; }, '“said that” (or “told me that”)'],
    [/\b(apply|applying|applied|applies) (the|a|an|this|that) (position|job|role|vacancy|course|scholarship|visa|loan|programme|program)\b/gi, function (m, v, d, n) { return v + ' for ' + d + ' ' + n; }, '“apply for the position”'],
    [/\b(went|go|goes|going|came|come)( \w+){0,6}? and (swim|build|play|eat|buy|make|watch|have|cook|walk|run|see|take|get|visit|meet|drink|sing|dance|read|talk|rest|relax|shop|explore|stay|ride|catch|fly|climb|sit|sleep)\b(?:(?: \w+){0,6}? and (swim|build|play|eat|buy|make|watch|have|cook|walk|run|see|take|get|visit|meet|drink|sing|dance|read|talk|rest|relax|shop|explore|stay|ride|catch|fly|climb|sit|sleep)\b)?/g, function (m, v1) {
      if (!/^(went|came)$/i.test(v1)) return m;
      return m.replace(/\band (swim|build|play|eat|buy|make|watch|have|cook|walk|run|see|take|get|visit|meet|drink|sing|dance|read|talk|rest|relax|shop|explore|stay|ride|catch|fly|climb|sit|sleep)\b/g, function (x, v) { return 'and ' + VERB[v][1]; });
    }, 'Keep the same time: went … and swam'],
    [/\bThanks God\b/g, 'Thank God', '“Thank God”'],
    [/\b(My|Our|The|my|our|the) (husband|wife|son|daughter|mum|mom|dad|mother|father|sister|brother|friend|boss|teacher|neighbour|partner|baby|kids|children|parents|family|company|team) (he|she|they|it) (?=\w)/g, function (m, d, n) { return d + ' ' + n + ' '; }, 'Don’t repeat the subject (my husband works…)'],
    [/\b(work|works|worked|working) (in|at|for) ((?:(?!(?:the|a|an|this|that|my|our|his|her|their|your|its) )\w+ )?(?:company|factory|firm|shop|bank|restaurant|cafe|café|hotel|warehouse|supermarket|hospital|school|rest home|call centre|office))\b/gi, function (m, v, p, n, off, all) { if (/\b(a|an|the|my|our|this|that)\s*$/i.test(all.slice(0, off + m.length - n.length))) return m; return v + ' ' + (/company|firm/.test(n) ? 'for' : p.toLowerCase()) + ' a ' + n; }, 'Add “a”: works for a construction company'],
    [/\b(on|in|at) (next|last|this) (week|month|year|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday|summer|winter|spring|autumn|time|morning|night)\b/gi, function (m, p, a, n) { return a + ' ' + n; }, 'No “on/in” before next/last/this (next week)'],
    [/\b(am|is|are|was|were|be|been|’m|’re|’s) leaving in ([A-Z][a-z]+(?: [A-Z][a-z]+)?)(?! (?:on|at)\b)/g, function (m, be, place) { if (/^(January|February|March|April|May|June|July|August|September|October|November|December|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday|Christmas|Easter)$/.test(place)) return m; return be + ' living in ' + place; }, '“living in Auckland” (leaving = going away)'],
    [/\b(I|[Ww]e|[Tt]hey|[Yy]ou|[Hh]e|[Ss]he) (am|are|is|’m|’re|’s) (already )?(\d+|two|three|four|five|six|seven|eight|nine|ten|many|several) (years?|months?|weeks?) (here )?(in [A-Z]\w+(?: [A-Z]\w+)?)?/g, function (m, s, be, al, n, u, here, where) { var hv = /^(he|she)$/i.test(s) ? 'has' : 'have'; return s + ' ' + hv + ' been ' + (here || where ? (where ? where.trim() : 'here') + ' ' : 'here ') + 'for ' + n + ' ' + u + (al ? ' already' : ''); }, '“We have been here for three years”'],
    [/\b(I am|I’m|she is|she’s|he is|he’s|we are|we’re|they are|they’re|you are|you’re) (a|an|the) (\w+)((?: \w+){0,3}?) (since (?:\d{4}|last \w+|\w+ ago|I was|we were|childhood|then))\b/gi, function (m, sb, a, n, mid, since) { var subj = sb.replace(/’re$| are$| is$|’s$| am$|’m$/i, ''); var hv = /^(he|she)$/i.test(subj) ? 'has' : 'have'; return subj + ' ' + hv + ' been ' + a + ' ' + n + (mid || '') + ' ' + since; }, 'With “since”, use “have been”'],
    [/\b(I am|I’m|she is|she’s|he is|he’s|we are|we’re|they are|they’re|you are|you’re|it is|it’s) ([a-z]+ing)\b([^.!?]{0,30}?)\b(since (?:morning|this morning|yesterday|last night|lunch|lunchtime|breakfast|\d{1,2}(?: ?[ap]m)?|monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|may|june|july|august|september|october|november|december|\d{4}|last \w+|\w+ ago|then|I was|we were|childhood))/gi, function (m, sb, v, mid, t) { var subj = sb.replace(/’re$| are$| is$|’s$| am$|’m$/i, ''); var hv = /^(he|she|it)$/i.test(subj) ? 'has' : 'have'; return subj + ' ' + hv + ' been ' + v + mid + t; }, 'With “since”, use “have been + -ing”'],
    [/\b(I|you|we|they|he|she|it|my \w+|the \w+) (didn’t|did not|didn't) (\w+)\b([^.!?]{0,40}?)\byet\b/gi, function (m, s, d, v, mid) { var b = FORM[v.toLowerCase()]; if (!b || !VERB[b]) return m; var hv = /^(he|she|it)$/i.test(s) || /^(my|the) \w+[^s]$/i.test(s) ? 'hasn’t' : 'haven’t'; return s + ' ' + hv + ' ' + VERB[b][3] + mid + 'yet'; }, 'With “yet”, use “haven’t/hasn’t + past participle”'],
    [/\bmake noise\b/gi, function (m) { return keepCase(m, 'make any noise'); }, '“make any noise”'],

    [/\b(in|to|from|visit|visited|visiting|visits) (philippines|netherlands|united states|united kingdom|usa|uk|uae|united arab emirates|bahamas|maldives|czech republic|dominican republic|cook islands|solomon islands|marshall islands|gambia)\b/gi, function (m, p, c) { var C = { usa: 'USA', uk: 'UK', uae: 'UAE' }[c.toLowerCase()] || c.replace(/(^|\s)\w/g, function (x) { return x.toUpperCase(); }); return p + ' the ' + C; }, 'Add “the” (the Philippines, the USA)'],
    [/\b(punctuations|vocabularies|grammars|sceneries|stuffs|jewelleries|jewelries|machineries|softwares|hardwares|staffs|researches|evidences|knowledges|trainings)\b/gi, function (m) { var x = m.toLowerCase(), o = { vocabularies: 'vocabulary', sceneries: 'scenery', jewelleries: 'jewellery', jewelries: 'jewelry', machineries: 'machinery' }[x] || x.replace(/s$/, ''); return keepCase(m, o); }, 'This word has no plural'],
    [/\b(any|if I have) (question|questions|problem|concern|issue|query|suggestion|comment)\b(?! (?:of|about|for)\b)/gi, function (m, a, n) { return a + ' ' + (/s$/.test(n) ? n : n + 's'); }, 'Use the plural after “any” (any questions)'],
    [/\bPlease kindly\b/g, 'Please', '“Please” is enough (no “kindly”)'],
    [/\bplease kindly\b/g, 'please', '“please” is enough (no “kindly”)'],
    [new RegExp('\\b(he|she|it|my (?:mum|mom|dad|mother|father|son|daughter|brother|sister|friend|husband|wife|boss|teacher|baby|child|dog|cat|family|neighbour|partner|manager)|the (?:baby|child|boy|girl|dog|cat|man|woman|teacher|shop|car|company|team|website|app|page|system)|everyone|everybody|nobody|someone|somebody|[A-Z][a-z]+) ((?:(?:' + ADVS + ') )+)(' + RX_BASE + ')\\b', 'g'), function (m, s, adv, v, off, all) {
      var b = v.toLowerCase(); if (!VERB[b] || /^(let|put|cut|hit|set|cost|shut|read|hurt)$/.test(b)) return m;
      if (/^[A-Z]/.test(s) && !/^(He|She|It|My|The|Everyone|Everybody|Nobody|Someone|Somebody)\b/.test(s) && (off === 0 || /[.!?]\s*$/.test(all.slice(0, off))) && COMMON[s.toLowerCase()]) return m;
      if (/^[A-Z]/.test(s) && /^(I|We|You|They|Please|Then|Now|Also|Just|Still|Always|Often|Never|Sometimes|Really|And|But|So)$/.test(s)) return m;
      return s + ' ' + adv + VERB[b][0];
    }, 'He/she/it: add “s” to the verb (she always asks)'],
    [new RegExp('(^|[.!?;,]\\s+|\\b(?:and|but|so|because|when|while|that) )(I|you|we|they|he|she|my \\w+|[A-Z][a-z]+) ((?:(?:' + ADVS + '|not) )+)(' + RX_ING + '|(?!(?:morning|evening|thing|something|nothing|anything|everything|building|wedding|ceiling|king|ring|spring|string|during|sing|bring|swing|wing|sibling|pudding|darling|ling)\\b)[a-z]{3,}ing)\\b', 'g'), function (m, pre, s, adv, v) {
      if (/^(Then|Now|Also|Just|Still|Always|Often|Never|Sometimes|Really|Please|And|But|So|Not)$/.test(s)) return m;
      var be = /^I$/.test(s) ? 'am' : /^(you|we|they)$/i.test(s) || /^my \w+s$/i.test(s) && !/ss$/.test(s) ? 'are' : 'is';
      return pre + s + ' ' + be + ' ' + adv + v;
    }, 'Add “am/is/are” before the -ing verb'],
    [new RegExp('\\b(was|were|had|did|went|came|saw|got|said|told|' + RX_PAST + ')\\b([^.!?]{0,80}?)\\b(when|while|before|after|until|as soon as|because) (it|he|she|they|we|I|you|the \\w+|my \\w+|someone|everyone) (' + RX_BASE + '|' + RX_THIRD + ')\\b(?! (?:to|for)\\b(?=\\s+be))', 'gi'), function (m, v1, mid, c, s, v2) {
      var b = FORM[v2.toLowerCase()]; if (!b || b === 'be' || /^(will|can|may|must)$/i.test(v2)) return m; if (v2.toLowerCase() === VERB[b][1]) return m;
      if (/\b(will|tomorrow|next|always|every|usually|now|today)\b/i.test(mid)) return m;
      return v1 + mid + c + ' ' + s + ' ' + VERB[b][1];
    }, 'Keep the same time: past + past (when it started)'],
    [/\b(a|an|A|An) ((?:new |old |nice |good |black |white |red |blue |pink |cheap |expensive |big |small |pretty |cute |warm |clean )?)(shoes|clothes|glasses|jeans|pants|trousers|scissors|shorts|sneakers|socks|boots|sandals|jandals|headphones|earphones|sunglasses|pyjamas)\b/g, function (m, a, adj, n) { var out = adj + n; return /^A/.test(a) ? out.charAt(0).toUpperCase() + out.slice(1) : out; }, 'No “a” with plural words like shoes or jeans'],
    [/\b(eat|ate|eating|eats|dinner|lunch|breakfast|met|meet|work|works|worked|working) (in|at) restaurant\b/gi, function (m, v) { return v + ' at a restaurant'; }, 'Add “a”: at a restaurant'],
    [/\b(in|to|at) (mall|beach|park|cinema|movies|supermarket|airport|dentist|gym|library|pharmacy|bank|post office|station|zoo|museum|market|clinic|restaurant|shop|shops|playground|pool|city centre|doctor)\b(?!\s*(?:’s|'s))/gi, function (m, p, n) { var pr = p.toLowerCase(); if (/^(mall|beach)$/i.test(n) && pr === 'in') pr = 'at'; if (/^doctor$/i.test(n)) return (pr === 'in' ? 'at' : pr) + ' the doctor’s'; return pr + ' the ' + n; }, 'Add “the” (to the mall, at the beach)'],
    [/\b(accepted|hired|chosen|selected|shortlisted) (in|on|at) (the|a|this|that) (job|position|role|course|programme|program|scholarship|team)\b/gi, function (m, v, p, d, n) { return v + ' for ' + d + ' ' + n; }, '“accepted for the job”'],
    [/\b(job|position|role|course|programme|program|scholarship|visa|loan|house|flat|rental) (that|which) (I|we|he|she|they|you) (applied)\b(?! (?:for|to))/gi, function (m, n, r, s, v) { return n + ' ' + r + ' ' + s + ' applied for'; }, '“the job that I applied for”'],
    [/\b(apply|applied|applying|applies) (in|on|to) (a|the|this|that|my|your) (job|position|role|scholarship|visa|loan)\b/gi, function (m, v, p, d, n) { return v + ' for ' + d + ' ' + n; }, '“apply for a job”'],
    [/\b(I|we|you|they|he|she|it|my \w+|the \w+) (have|has) (a|an) (fever|cold|cough|headache|flu|sore \w+|rash|toothache|tummy ache|stomach ache|allergy|temperature|runny nose|bad back|migraine)\b([^.!?]{0,25}?)\b(since|for)\b/gi, function (m, s, h2, a, n, mid, sf) { return s + ' ' + h2 + ' had ' + a + ' ' + n + mid + sf; }, 'With since/for, use “has had”'],
    [new RegExp('\\b(he|she|my (?:mum|dad|mother|father|son|daughter|brother|sister|friend|husband|wife|boss)) (lives|works|knows|studies|teaches|stays|plays) ((?:here |there |in [A-Z]\\w+(?: [A-Z]\\w+)? |at \\w+ |him |her |them |this \\w+ )?)(for (?:' + NUMW + ') (?:years?|months?|weeks?)|since (?:\\d{4}|last \\w+|\\w+ ago|yesterday|childhood))', 'gi'), function (m, s, v, mid, t) { var b = FORM[v.toLowerCase()]; return s + ' has ' + VERB[b][3] + ' ' + mid + t; }, 'With for/since, use “has + past participle”'],
    [/\b(have|has) been (\w+ing)\b([^.!?]*\b(?:for|since)\b[^.!?]*?)\band (I|we|you|they|he|she) (learn|meet|make|see|get|gain|find|grow|improve|enjoy|save|build|earn)\b/gi, function (m, h2, v, mid, s, v2) { var hv = /^(he|she)$/i.test(s) ? 'has' : 'have'; return h2 + ' been ' + v + mid + 'and ' + s + ' ' + hv + ' ' + VERB[v2.toLowerCase()][3]; }, 'Keep the present perfect: “and I have learned”'],
    [/\b(sharing|share|shares|shared|open|opens|opened|opening|show|shows|showed|showing|go to|goes to|went to|back to|on|in|at|from|to) (main page|home page|homepage|first page|front page|cover page|last page|next page|website)\b/gi, function (m, p, n) { return p + ' the ' + n; }, 'Add “the” (the main page)'],
    [/\b(I|we|you|they|he|she|it) (no|not) (understand|know|like|want|need|have|agree|think|remember|see|go|come|eat|work)\b/g, function (m, s, n, v) { var dn = /^(he|she|it)$/i.test(s) ? 'doesn’t' : 'don’t'; return s + ' ' + dn + ' ' + v; }, 'Use “don’t/doesn’t” before the verb'],
    [/\b(I|we|you|they) (am|are|is) (agree|disagree|understand|know|like|want|need|believe|remember|think)\b/g, function (m, s, be, v) { return s + ' ' + v; }, 'No “am/is/are” with this verb'],
    [/\b(he|she|it) (is) (agree|disagree|understand|know|like|want|need|believe|remember)\b/g, function (m, s, be, v) { return VERB[v] ? s + ' ' + VERB[v][0] : m; }, 'No “is” with this verb'],
    [/\b(more|less) (better|worse)\b/gi, function (m, a, b) { return b; }, '“better” already means “more good”'],
    [/\b(is|are|was|were|am) (so|very|really|too) (much )?(like|love|enjoy|want|need|appreciate)\b/gi, function (m, be, a, mu, v) { return 'really ' + v; }, 'Say “I really like…”'],
    [/\b(how to say|how can I say|how do you say) ([^?.!]{2,40}) in english\b/gi, function (m, a, w) { return a + ' ' + w + ' in English'; }, 'Capital E in “English”'],
    [/\b(\w+) (?:the|a) (?:the|a)\b/g, function (m) { return m; }, ''],
    [/\b(i|I) (am|was) (confuse|bore|interest|excite|worry|tire|amaze|surprise|disappoint|embarrass|satisfy|scare|frighten|annoy)\b/g, function (m, s, be, v) { var e = /y$/.test(v) ? v.slice(0, -1) + 'ied' : /e$/.test(v) ? v + 'd' : v + 'ed'; return 'I ' + be + ' ' + e; }, 'For feelings use “-ed” (I am confused)'],
    [/\b(has|have|had) (been )?(went|did|saw|ate|wrote|took|gave|came|ran|began|drank|spoke|broke|chose|drove|flew|forgot|knew|rode|sang|swam|threw|wore|woke|grew|fell|stole|hid)\b/gi, function (m, h2, been, v) { return h2 + ' ' + (been || '') + pp(v); }, 'After have/has/had use the past participle'],
    [/\b(do|does|did|can|could|will|would|should|must|may|might|to) (not )?(went|did|saw|ate|wrote|took|gave|came|ran|began|drank|spoke|broke|chose|drove|flew|forgot|knew|bought|thought|brought|caught|taught|felt|kept|left|lost|made|met|paid|said|sent|sold|told|understood|won)\b/gi, function (m, a, n, v) { if (/^to$/i.test(a) && /^(paid|said|sent|sold|told|left|lost|made|met|kept|felt|won|understood)$/i.test(v)) return m; return a + ' ' + (n || '') + base(v); }, 'Use the base verb here (did not go, can see)']
  ];
  GRAM_PRE.push.apply(GRAM_PRE, GRAM_REAL.filter(function (r) { return r[2]; }));

  var GRAM_POST = [
    [/\b(an|a) some\b/gi, 'some', 'Use “some”']
  ];


  var ADJ = 'big|small|new|old|nice|good|bad|beautiful|lovely|great|little|large|huge|tiny|young|happy|sad|cheap|expensive|different|important|interesting|amazing|wonderful|other|more|few|extra|main|local|best|first|last|next|same|whole|full|easy|hard|long|short|hot|cold|warm|cool|red|blue|green|white|black|clean|free|real|true|big|fresh|famous|popular|special|small';
  var NOTNOUN = 'and|or|but|of|to|in|on|at|for|with|from|by|the|a|an|my|your|our|their|his|her|its|this|that|these|those|more|less|than|times|hundred|thousand|million|billion|dozen|percent|per|o’clock|am|pm|kg|km|cm|mm|ml|g|l|m|degrees|year|years|old|days|hours|minutes|weeks|months|people|children|men|women|sheep|fish|data|series|each|other|one|ones|much|many|very|so|too|also|already|just|only|ago|later|earlier|before|after|then|now|here|there|today|tomorrow|yesterday|time|night|morning|week|month|day';
  var ING_BASE = {}; Object.keys(VERB).forEach(function (b) { ING_BASE[VERB[b][2]] = b; });
  GRAM_POST.push(
    [/\b(thank you|thanks|grateful|thankful|sorry|apologise|apologize|excuse me|forgive me) for (help|support|call|visit|come|invite|share|send|teach|listen|wait|understand|care|bring|give|make|take|look|join|remind|check|reply|answer|organise|organize|cook|drive|pray|encourage|tell|show|let|be|do|keep) (me|us|him|her|them|my|our|the|this|that|it|everything|all|so|such|to|in|with|on|for|a|an|your)\b/gi, function (m, a, v, o) { var b = v.toLowerCase(); var ing = VERB[b] ? VERB[b][2] : (/e$/.test(b) && !/ee$/.test(b) ? b.slice(0, -1) : b) + 'ing'; if (b === 'let') ing = 'letting'; if (b === 'be') ing = 'being'; return a + ' for ' + ing + ' ' + o; }, 'After “thank you for”, use the -ing form: “thank you for helping me”'],
    [/\breply (you|me|him|her|them|us)\b/gi, function (m, o) { return 'reply to ' + o; }, '“Reply to someone”'],
    [/\b(replied|replies|replying) (you|me|him|her|them|us)\b/gi, function (m, v, o) { return v + ' to ' + o; }, '“Reply to someone”'],
    [/\bplease question(s)?\b/gi, function (m) { return /^P/.test(m) ? 'Please ask questions' : 'please ask questions'; }, '“Please ask questions”'],
    [/\b(in|at) end\b(?! of)/gi, function (m, p) { return 'at the end'; }, '“At the end”'],
    [/\b(in|at) end of\b/gi, 'at the end of', '“At the end of”'],
    [/\bin the end of\b/gi, 'at the end of', '“At the end of”'],
    [/(^|[.!?]\s+)(Last|Lastly|Finally|Firstly|First|Secondly|Next|Then) (I|we)\b/g, function (m, a, w, p) { var W = w === 'Last' ? 'Lastly' : w; if (W === 'Then' || W === 'Next') return m; return a + W + ', ' + p; }, 'Put a comma after a linking word: “Lastly, I …”'],
    [/(^|[.!?]\s+)(Today|Tonight|Now|This morning|This afternoon|This evening|This week|Right now) (I|we) (present|give|show|share|start|teach|lead|run|explain|talk|speak|introduce|demonstrate|work|study|go|travel|visit|meet|cook|write|prepare|celebrate|play|watch|read)\b(?! (?:to|every|always|usually|often))/g, function (m, a, t, p, v) { var be = p === 'I' ? 'am' : 'are'; return a + t + ' ' + p + ' ' + be + ' ' + (VERB[v] ? VERB[v][2] : (/[^aeiou]e$/.test(v) ? v.slice(0, -1) : v) + 'ing'); }, 'Happening today or now: use “am / are + -ing” (“Today I am presenting”)'],
    [/\b(will|would|can|could|should|must|may|might|shall) (not )?([a-z]+ing)\b/g, function (m, md, nt, v) { var b = ING_BASE[v]; if (!b || b === v || !VERB[b] || /^(thing|something|anything|nothing|everything|morning|evening|king|ring|sing|bring|spring|string|swing|wing|sting|cling|fling|sling|ping)$/.test(v) || VERB[b][2] !== v) return m; return md + ' ' + (nt || '') + b; }, 'After “will / can / should”, use the base verb: “I will go”'],
    [/\b(is|was|am|’s|becomes|became|seems|seemed) (very |really |so |such |quite |a very )?(kind|good|nice|great|hard-working|hardworking|honest|friendly|lovely|smart|beautiful|bad|happy|funny|caring|generous|helpful|busy|important|big|small|old|young|new|clever|wonderful|amazing|excellent|interesting|beautiful|strong|quiet|polite|humble|patient|loving|famous|popular|simple|difficult|easy|fun|safe|special|true|real|perfect|brave|wise|rich|poor|cheap|expensive) (person|man|woman|boy|girl|teacher|friend|student|place|city|town|day|book|idea|job|house|car|country|thing|problem|question|story|movie|film|game|family|worker|mother|father|mum|dad|leader|boss|doctor|nurse|neighbour|neighbor|colleague|cook|chef|singer|player|church|school|company|restaurant|café|cafe|area|suburb|experience|lesson|trip|holiday|week|year|life|child|baby|dog|cat)\b/gi, function (m, v, adv, adj, n) { if (adv && /a very/i.test(adv)) return m; var first = (adv || '').trim() || adj; if (/^such$/i.test(first)) return v + ' such ' + (/^[aeiou]/i.test(adj) ? 'an ' : 'a ') + adj + ' ' + n; var art = /^[aeiou]/i.test(first) ? 'an' : 'a'; return v + ' ' + art + ' ' + (adv || '') + adj + ' ' + n; }, 'Use “a / an” before one person or thing: “a very kind person”'],
    [/\b(have|has|had|got|need|needs|want|wants|attend|attended|join|joined|book|booked|schedule|scheduled|arrange|arranged|there is|there’s|there was) (meeting|appointment|interview|exam|test|question|problem|idea|class|lesson|party|plan|job|car|house|headache|cold|fever|cough|break|chance|request|suggestion|issue|presentation|deadline|day off|doctor’s appointment|emergency|accident|baby|reason|concern|complaint|booking|reservation|flight|holiday|birthday party|quick question|small favour|favour|favor)\b(?!s| (?:room|rooms|notes|minutes|time|times|point|points|results|papers|marks|fees|dates|days|paper|schedule|venue|centre|center|room|link|questions|plans|ideas)\b)/gi, function (m, v, n) { if (/^(is|was)$/i.test(v) && /^(meeting|presentation|holiday|party)$/i.test(n)) return m; return v + ' ' + (/^[aeiou]/i.test(n) ? 'an ' : 'a ') + n; }, 'Use “a / an” before one thing: “I have a meeting”'],
    [/\b(give|gave|giving|make|made|making|do|did|doing|deliver|delivered|present|presented) (presentation|speech|talk)\b/gi, function (m, v, n) { return v + ' ' + (/^present/i.test(v) ? 'the ' : 'a ') + n; }, 'Use “a / the” before one thing: “give a presentation”'],
    [/\b(go|went|going|goes) (to )?(market|supermarket|shop|mall|hospital|doctor|dentist|beach|park|library|airport|station|gym|bank|post office|cinema|movies)\b/gi, function (m, v, t, n) { return v + ' to the ' + n; }, '“Go to the market / the beach”'],
    [/\b(go|went|going|goes) (to )?(church|school|work|bed|home|university|college|town|class|mass)\b/gi, function (m, v, t, n) { return v + (/^home$/i.test(n) ? ' ' : ' to ') + n; }, '“Go to church / school / work”, “go home”']
  );
  GRAM_POST.push([new RegExp('\\b(two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|several|many|few|both|these|those|[2-9]|\\d{2,}) ((?:(?:' + ADJ + ') )?)([a-z]{3,})(?=\\s*(?:and|or|,|\\.|!|\\?|in|on|at|for|with|that|which|to|is|are|were|was|$))', 'gi'), function (m, n, adj, w, off, all) {
    var l = w.toLowerCase();
    if (/s$/.test(l) || new RegExp('^(' + NOTNOUN + '|' + ADJ + ')$').test(l) || FORM[l] || /(ing|ed|ly|ful|ous|ive|ish|est|er)$/.test(l) && !/(er)$/.test(l) || /^(two|three|four|five|six|seven|eight|nine|ten|twenty|thirty|forty|fifty|hundred)$/.test(l)) return m;
    if (/^(year|month|week|day|hour|minute|kilo|metre|litre|dollar|cent|percent)$/.test(l) && /\-/.test(all.slice(off, off + m.length + 2))) return m;
    if (WORDS && !WORDS[l]) return m;
    return n + ' ' + adj + plural(l);
  }, 'Use the plural (three bedrooms)']);

  /* questions and word order — applied sentence by sentence */
  var QW = '(What time|How much|How many|How often|How long|Which \\w+|What|Where|When|Why|How|Who)';
  function fixQuestion(s) {
    var m;
    if (!/\?\s*$/.test(s)) return s;
    // Where you are going? -> Where are you going?
    m = s.match(new RegExp('^' + QW + ' (you|we|they|he|she|it|I|your \\w+|my \\w+|the \\w+) (am|are|is|was|were|can|will|should|could|would|have|has|had) (.*)\\?\\s*$'));
    if (m) return m[1] + ' ' + m[3] + ' ' + (m[2] === 'I' ? 'I' : m[2]) + ' ' + m[4] + '?';
    // How long you live here? -> How long have you lived here?
    m = s.match(/^(How long) (you|we|they|he|she) (live|work|know|study|stay|wait|have|use)\b(.*)\?\s*$/i);
    if (m) { var hv = /^(he|she)$/i.test(m[2]) ? 'has' : 'have'; return m[1] + ' ' + hv + ' ' + m[2] + ' ' + (VERB[m[3].toLowerCase()] ? VERB[m[3].toLowerCase()][3] : m[3]) + m[4] + '?'; }
    // What you want? -> What do you want?   What she wants? -> What does she want?
    m = s.match(new RegExp('^' + QW + ' (you|we|they|I|he|she|it|your \\w+|my \\w+) (' + RX_BASE + '|' + RX_THIRD + ')\\b(.*)\\?\\s*$'));
    if (m) {
      if (/^Who$/.test(m[1])) return s;
      var subj = m[2], v = base(m[3]), sing = /^(he|she|it)$/i.test(subj) || /^(your|my) \w+[^s]$/i.test(subj);
      if (v === 'be') return s;
      if (m[3].toLowerCase() === VERB[v][1] && VERB[v][1] !== v) return m[1] + ' did ' + subj + ' ' + v + m[4] + '?';
      return m[1] + ' ' + (sing ? 'does' : 'do') + ' ' + subj + ' ' + v + m[4] + '?';
    }
    // You like coffee? (statement order with a question mark) — leave, it is fine in speech
    return s;
  }
  // Can you tell me where is the station? -> where the station is?
  function embedded(s) {
    var TRIG = '(tell me|show me|know|wonder|wondering|ask|asked|understand|explain|sure|remember|idea|let me know|find out|check|ask you|tell us)';
    s = s.replace(new RegExp('\\b' + TRIG + ' (where|what|when|why|how|who|what time|how much|how many|how long|if|whether) (is|are|was|were) ((?:the|my|your|his|her|our|their|this|that|these|those|a|an) [\\w’\']+(?: (?!tomorrow|today|tonight|now|yesterday|later|again|here|there|this|next|last|in|on|at)[\\w’\']+)?|it|he|she|they|you|we)((?: (?:tomorrow|today|tonight|now|yesterday|later|again|here|there|this \\w+|next \\w+|last \\w+|in \\w+(?: \\w+)?|on \\w+|at \\w+))?)(?=\\s*[?.!,]|\\s*$)', 'gi'), function (m, a, w, v, n, tail) { return a + ' ' + w + ' ' + n + ' ' + v + (tail || ''); });
    s = s.replace(/\b(tell me|know|wonder|ask|understand|explain|sure|remember|idea|let me know|find out) (where|what|when|why|how) (do|does|did) (you|he|she|they|we|I|the \w+|my \w+) (\w+)/gi, function (m, a, w, d, sb, v) { var b = FORM[v.toLowerCase()]; if (!b) return m; var out = d.toLowerCase() === 'did' ? VERB[b][1] : d.toLowerCase() === 'does' ? VERB[b][0] : b; return a + ' ' + w + ' ' + sb + ' ' + out; });
    return s;
  }

  // comma splices: "the food was cold, the staff was rude" -> split
  var CLAUSE = new RegExp(',\\s+(?:(I|we|they|he|she|it|you|my \\w+|our \\w+|the \\w+|this|that|there|these|those)\\s+(?:always |usually |often |never |sometimes |also |really |still |just |only |already |now |then )?(am|is|are|was|were|has|have|had|will|can|could|would|should|did|do|does|don’t|doesn’t|didn’t|can’t|won’t|isn’t|wasn’t|’m|’re|’s|’ll|\\w+ed|' + RX_THIRD + '|' + RX_PAST + ')\\b|(please|kindly|let’s|let\\s+me|thank you|thanks|sorry)\\b|(?:I|we|you|they)\\s+(?:' + RX_BASE + ')\\b|(do|does|did|can|could|would|will|are|is|should|shall|have|has)\\s+(you|we|they|he|she|I|it)\\b)');
  function splice(s) {
    if (/\b(and|but|so|because|which|who|although|when|if|while|or)\b[^,]*$/i.test(s.split(',')[0]) && false) return s;
    var parts = [], rest = s, m, n = 0;
    while ((m = rest.match(CLAUSE)) && n < 4) {
      var before = rest.slice(0, m.index);
      var lastBit = before.split(/[,;]/).pop();
      if (!new RegExp('\\b(am|is|are|was|were|be|been|can|cannot|could|will|would|should|must|' + RX_ANYV + ')\\b|’(re|s|m|ll|ve|d)\\b|n’t\\b|\\b\\w{3,}ing\\b', 'i').test(lastBit) || /^\s*(I|we|you|they|he|she|it)\s*$/i.test(lastBit)) break;
      if (/^(please|kindly)\b/i.test(rest.slice(m.index + 1).trim()) && !/\b(I|we|you|they|he|she|it|can|could|will|would|is|are|was|were|am|cannot)\b/i.test(lastBit)) break;
      if (/^\s*[A-Za-z]+(ing|ed)\b/.test(lastBit) || /^\s*(to|in|on|at|for|with|after|before|during|by|from)\s/i.test(lastBit)) break;
      if (/\b(if|when|because|although|though|while|after|before|since|as|unless|until|whether|even)\b/i.test(lastBit) || /^(However|Firstly|Secondly|Finally|Also|Then|Next|Yes|No|Well|So|Overall|In addition|For example)$/i.test(before.trim())) break;
      parts.push(before); rest = rest.slice(m.index + 1).replace(/^\s+/, ''); n++;
    }
    if (!parts.length) return s;
    parts.push(rest);
    // two clauses -> join with "and"; three+ -> full stop then ", and"
    function cap(x) { return x.charAt(0).toUpperCase() + x.slice(1); }
    var q2 = /^(do|does|did|can|could|would|will|are|is|should|shall|have|has)\s+(you|we|they|he|she|I|it)\b/i;
    function isQ(A) { return /^\s*(can|could|would|will|do|does|did|is|are|should|may|have|has)\s+(you|we|I|he|she|they|it)\b/i.test(A) || /^\s*(what|where|when|why|how|who|which)\s+(is|are|do|does|did|can|could|would|will)\b/i.test(A); }
    function stopBefore(A, B) { return isQ(A) || /^(please|kindly|let’s|let\s+me|thank you|thanks|sorry)\b/i.test(B) || q2.test(B) || /^(I|we)\s+(will|’ll|am|’m|can|would|hope|look|think|need|want)\b/.test(B) || /^(thank|thanks|sorry|hi|hello|yes|no|ok|okay|sure|great|wow)\b/i.test(A.trim()); }
    var out = parts[0].replace(/\s+$/, '');
    for (var k = 1; k < parts.length; k++) {
      var A = parts[k - 1], B = parts[k], last = k === parts.length - 1;
      if (isQ(A)) out += '? ' + cap(B);
      else if (stopBefore(A, B) || (parts.length === 2 && A.trim().split(/\s+/).length <= 6 && /^(I|we)\b/.test(B))) out += '. ' + cap(B);
      else if (parts.length > 2 && !last) out += '. ' + cap(B);
      else out += ', and ' + B;
      if (q2.test(B) && last && !/\?\s*$/.test(out)) out = out.replace(/[.!]?\s*$/, '?');
    }
    return out;
  }

  /* extra (non-identifying) information about a named person or place goes between commas */
  function relCommas(s) {
    var m = s.match(new RegExp('^(\\s*)((?:My|Our|my|our) (?:' + FAM + ')|[A-Z][a-zāēīōū]+(?: [A-Z][a-zāēīōū]+){0,3}) (who|which|whose) (.+)$'));
    if (m && !/,/.test(m[4].split(/\b(is|are|was|were|has|have|had)\b/)[0])) {
      var np = m[2], first = np.split(' ')[0].toLowerCase();
      var proper = !/^(my|our)$/.test(first);
      if (proper && (COMMON[first] || FORM[first] || /^(the|this|that|these|those|a|an|it|he|she|they|we|i|people|everyone|someone|anyone|nobody|children|students|men|women|kids|friends|parents|most|many|some|all|each|every|one|there|here)$/.test(first))) return s;
      var words = m[4].split(' '), seenVerb = false, cut = -1;
      for (var i = 0; i < words.length; i++) {
        var w = words[i].toLowerCase().replace(/[^a-z’']/g, ''), isV = FORM[w] || /^(am|is|are|was|were|can|could|will|would|should|must|has|have|had)$/.test(w);
        if (!seenVerb) { if (isV) seenVerb = true; continue; }
        if (isV && i > 0 && (/^(is|are|was|were|has|have|had|will|can|could|would|should|must)$/.test(w) || FORM[w] && FORM[w] !== w) && !/^(to|and|or|who|which|that|i|we|you|they|he|she)$/i.test(words[i - 1].toLowerCase())) { cut = i; break; }
      }
      if (cut > 1 && /^(still|also|always|never|often|usually|really|just|now|then|sometimes|already|only|even|rarely|seldom)$/i.test(words[cut - 1])) cut--;
      if (cut > 0) return m[1] + np + ', ' + m[3] + ' ' + words.slice(0, cut).join(' ') + ', ' + words.slice(cut).join(' ');
      return s;
    }
    return s.replace(/\b([a-z]+ )([A-Z][a-zāēīōū]+(?: [A-Z][a-zāēīōū]+){0,3}) (which|who) (?=\w)/g, function (x, pre, np, r) { if (/^(and|or|of|the|a|an|to|for|in|on|at|with)\s$/.test(pre) && !/^(in|to|at|visited|from)\s$/.test(pre)) return x; return pre + np + ', ' + r + ' '; });
  }
  /* run-on sentences with no comma: "My English is not good please correct me" */
  var NOSPLIT_PREV = /^(now|then|here|there|currently|presently|meanwhile|and|but|or|so|because|if|when|that|than|what|where|why|how|who|which|while|before|after|until|since|as|think|know|hope|believe|said|say|says|guess|wish|feel|mean|sure|tell|told|then|maybe|also|can|could|would|will|should|do|did|does|am|actually|just|even|only|really|you|me|could|please|let|make|made|help|see|saw|heard|hear|watch|thank|thanks|whom|whose|whether|unless|though|although|once|where|wherever|whenever|cause|coz|cuz|bc|is|are|was|were|be|not|never|always|did)$/i;
  var VERBY = new RegExp('\\b(am|is|are|was|were|be|been|can|cannot|could|will|would|should|must|have|has|had|' + RX_ANYV + ')\\b|’(re|s|m|ll|ve|d)\\b|n’t\\b', 'i');
  function runOn(s) {
    if (/,/.test(s) && /,\s+(I|please)\b/i.test(s)) return s; // comma splices are handled by splice()
    var words = s.split(/(\s+)/), out = '', seg = '', segN = 0;
    for (var i = 0; i < words.length; i++) {
      var w = words[i];
      if (/^\s+$/.test(w)) { out += w; seg += w; continue; }
      var bare = w.replace(/[^\p{L}’']/gu, ''), next = (words[i + 2] || '').replace(/[^\p{L}’']/gu, '').toLowerCase();
      var prevW = (words[i - 2] || '').replace(/[^\p{L}’']/gu, '');
      var startsClause = false;
      if (segN >= 3 && VERBY.test(seg) && !/[,;:]\s*$/.test(seg) && !NOSPLIT_PREV.test(prevW)) {
        if (/\b(so|such|too|the first|the last|the only|the best|the worst|every|each|the same)\s+\S+\s*$/i.test(seg) || /^(time|day|way|reason|thing|things|place|moment|one|person|man|woman|people|stuff|year|week|night|morning|food|book|movie|film|car|house|job|everything|something|anything|nothing|all|someone|anyone|everyone|friend|friends|money|song|word|words|story|gift|present)$/i.test(prevW)) { out += w; seg += w; segN++; continue; }
        if (/,\s*\S+\s*$/.test(seg)) { out += w; seg += w; segN++; continue; }
        if (/^please$/i.test(bare) && /^(be|ask|send|call|let|come|bring|tell|check|correct|reply|help|note|find|keep|make|remember|don’t|do|share|give|join|contact|feel|read|see|wait|forgive|pray|text|email|sign|fill|confirm|have|take|look|use|bear|accept|update|advise|stay|try|enjoy|go|leave|question|questions)$/.test(next)) startsClause = true;
        if (/^(I|we|it)$/.test(bare) && /^(will|would|can|could|am|’m|need|want|hope|think|have|had|was|is|really|also|just|must|should|don’t|didn’t|can’t|won’t|wasn’t|isn’t|love|like|feel|know|look|apologise|apologize|appreciate|wanted|needed|got|went|came|did|present|’ll|’ve)$/.test(next)) startsClause = true;
        if (/^it$/i.test(bare) && !/^(was|is|will|has|had|’s|looks|looked|seems|seemed|made|makes|took|takes)$/.test(next)) startsClause = false;
        if (/^(last|lastly|finally|then|after that|also)$/i.test(bare) && /^(i|we)$/.test(next)) startsClause = true;
      }
      if (startsClause) {
        var W2 = w.charAt(0).toUpperCase() + w.slice(1); if (/^(Last|Lastly|Finally|Then|Also)$/.test(W2)) W2 = (W2 === 'Last' ? 'Lastly' : W2) + ',';
        out = out.replace(/\s+$/, '') + '. ' + W2; seg = w; segN = 1;
        if (i + 1 < words.length) { out += words[i + 1]; seg += words[i + 1]; i++; }
        continue;
      }
      out += w; seg += w; segN++;
    }
    return out;
  }
  /* "What time we are meeting tomorrow" is a question */
  function bareQuestion(s) {
    if (/[?]\s*$/.test(s)) return s;
    var m = s.match(new RegExp('^\\s*' + QW + ' (you|we|they|he|she|it|I) (am|are|is|was|were|can|will|should|could|would|have|has|do|does|did) ([^.!?]*?)[.!]?\\s*$'));
    if (!m || m[4].split(/\s+/).length > 7 || /\b(is|was|means|makes)\b/.test(m[4])) return s;
    return s.replace(/[.!]?\s*$/, '?');
  }
  function sentenceFix(s, changes) {
    var o = s, n;
    n = bareQuestion(o); if (n !== o) o = n;
    n = runOn(o); if (n !== o) { changes.push({ from: o, to: n, why: 'Run-on sentence: start a new sentence for a new idea' }); o = n; }
    n = fixQuestion(o); if (n !== o) { changes.push({ from: o, to: n, why: 'Question word order: “Where are you going?”' }); o = n; }
    n = embedded(o); if (n !== o) { changes.push({ from: o, to: n, why: 'Inside a sentence, keep normal order: “tell me where the station is”' }); o = n; }
    n = relCommas(o); if (n !== o) { changes.push({ from: o, to: n, why: 'Extra information about a named person or place goes between commas' }); o = n; }
    n = splice(o); if (n !== o) { changes.push({ from: o, to: n, why: 'Run-on sentence: join ideas with “and” or a full stop' }); o = n; }
    return o;
  }
  /* writing tips that need a human decision */
  function grammarTips(text) {
    var tips = [], sents = text.split(/(?<=[.!?])\s+/).filter(function (x) { return x.trim(); });
    sents.forEach(function (s) {
      var w = s.split(/\s+/).length;
      if (/^(Because|Although|Though|Even though|While|Which|If|When|Since|Unless)\b[^,]*[.!]$/i.test(s.trim()) && w < 14) tips.push('“' + s.trim().slice(0, 50) + '” is only half a sentence. Add the main idea (e.g. “Because I was tired, I went to bed.”).');
      if (/^[A-Z][a-z]+ing\b[^,]{0,45},\s+(the|a|an|it|there|this|my|our|his|her|their)\b/.test(s.trim()) && !/^(During|According|Including|Regarding|Considering|Following|Excluding|Concerning|Morning|Evening|Spring|Nothing|Something|Everything|Anything|Wedding|Building|Ceiling|Thing|King|Ring|Sing|Bring|Swing)\b/.test(s.trim())) tips.push('“' + s.trim().slice(0, 45) + '…” — check who is doing the -ing action. Put that person straight after the comma (e.g. “Walking to school, I got caught in the rain.”).');
      if (/^(And|But|So|Or)\b/.test(s.trim()) && w < 5) tips.push('“' + s.trim() + '” is very short — join it to the sentence before.');
      if (w > 40) tips.push('One sentence has ' + w + ' words. Try splitting it into two for clarity.');
      if (!s.split(/[^A-Za-z’']+/).some(function (t) { var l = t.toLowerCase(); return FORM[l] || /^(am|is|are|was|were|be|been|can|could|will|would|should|must|may|might|shall)$/.test(l) || /(ed|es)$/.test(l) && l.length > 4 || WORDS && /s$/.test(l) && FORM[l.slice(0, -1)]; }) && w > 3 && w < 20 && !/[?]$/.test(s)) tips.push('“' + s.trim().slice(0, 50) + '” may be missing a verb.');
    });
    var paras = text.split(/\n\s*\n/).filter(function (x) { return x.trim(); });
    var words = text.split(/\s+/).filter(Boolean).length;
    if (words > 180 && paras.length < 2) tips.push('Break your writing into paragraphs — one main idea in each.');
    return tips;
  }

  var GRAM = [
    // spelling first
    [/\b([A-Za-z]+)\b/g, function (m, w) { var k = w.toLowerCase(); if (!Object.prototype.hasOwnProperty.call(MISSPELL, k) || MISSPELL[k] === null) return m; if (k === 'u' && w === 'U') return m; return keepCase(w, MISSPELL[k]); }, 'Spelling'],
    [/\bi\b/g, 'I', 'Capitalise “I”'],
    [/\b(could|would|should|must|might) of\b/gi, function (m, a) { return a + ' have'; }, '“have”, not “of”'],
    [/\b(dont|doesnt|didnt|cant|wont|isnt|wasnt|arent|werent|havent|hasnt|hadnt|couldnt|wouldnt|shouldnt)\b/gi, function (m) { var x = m.toLowerCase(); var o = x === 'cant' ? 'can’t' : x === 'wont' ? 'won’t' : x.slice(0, -2) + 'n’t'; return keepCase(m, o); }, 'Missing apostrophe'],
    // be
    [/\bI (is|are)\b/g, function (m, v, off, all) { if (/\band\s+$/.test(all.slice(Math.max(0, off - 5), off))) return m; return 'I am'; }, 'Use “I am”'],
    [/\bI (was|were) (\w+)/g, function (m, a, b) { return a === 'were' && !/^(to|if)$/.test(b) ? 'I was ' + b : m; }, 'Use “I was”'],
    [new RegExp('\\b(' + PLUR + ') (is|was)\\b', 'gi'), function (m, s, v) { return s + ' ' + (v.toLowerCase() === 'is' ? 'are' : 'were'); }, 'Plural subject: use “are/were”'],
    [new RegExp('\\b(' + SING + ') (are|were)\\b', 'gi'), function (m, s, v) { return s + ' ' + (v.toLowerCase() === 'are' ? 'is' : 'was'); }, 'Singular subject: use “is/was”'],
    [/\b(there|There) is (many|several|two|three|four|five|lots of|a lot of|some people|people)\b/g, function (m, t, n) { return t + ' are ' + n; }, 'Use “there are” with plurals'],
    [/\b(there|There) was (many|several|two|three|four|five|lots of|a lot of)\b/g, function (m, t, n) { return t + ' were ' + n; }, 'Use “there were” with plurals'],
    // have / do agreement
    [new RegExp('\\b(' + SING + ') (have|do|don’t|don\'t)\\b', 'gi'), function (m, s, v) { var x = v.toLowerCase(); return s + ' ' + (x === 'have' ? 'has' : x === 'do' ? 'does' : 'doesn’t'); }, 'Singular subject: “has/does/doesn’t”'],
    [new RegExp('\\b(I|' + PLUR + ') (has|does|doesn’t|doesn\'t)\\b', 'gi'), function (m, s, v, off, all) { if (/\b(each|one|neither|either|every one|none|any|which) of\s+$/i.test(all.slice(Math.max(0, off - 20), off))) return m; var x = v.toLowerCase(); return s + ' ' + (x === 'has' ? 'have' : x === 'does' ? 'do' : 'don’t'); }, 'Use “have/do/don’t” here'],
    [/\b(everyone|everybody|nobody|someone|somebody) (have|do)\b/gi, function (m, s, v) { return s + ' ' + (v.toLowerCase() === 'have' ? 'has' : 'does'); }, 'Use “has/does” with everyone'],
    // modal / do-support / to + base verb
    [new RegExp('\\b(can|could|will|would|shall|should|may|might|must|can’t|cannot|won’t|wouldn’t|shouldn’t|couldn’t|don’t|doesn’t|didn’t|do|does|did|to) (' + RX_THIRD + '|' + RX_PAST + ')\\b', 'gi'),
      function (m, mod, v) { var b = base(v); if (b === v.toLowerCase() || b === 'be') return m; if (/^to$/i.test(mod) && VERB[b] && VERB[b][3] === v.toLowerCase() && VERB[b][1] !== v.toLowerCase()) return m; if (/^(do|does|did)$/i.test(mod) && /^(done|gone|been)$/i.test(v)) return m; return mod + ' ' + b; }, 'Use the base verb after this word'],
    [/\b(should|must|can|could|will|would) to (\w+)/gi, function (m, a, b) { return a + ' ' + b; }, 'No “to” after this word'],
    [/\b(am|is|are|was|were) (agree|disagree)\b/gi, function (m, a, b) { return b; }, 'Say “I agree”, not “I am agree”'],
    [new RegExp('\\b(I am|I’m|you are|you’re|we are|we’re|they are|they’re|he is|he’s|she is|she’s|it is|it’s) (' + alt(['go', 'come', 'play', 'work', 'eat', 'cook', 'study', 'read', 'write', 'watch', 'wait', 'sleep', 'swim', 'run', 'walk', 'talk', 'look', 'live', 'stay', 'travel', 'learn']) + ')\\b', 'gi'),
      function (m, a, b) { return a + ' ' + VERB[b.toLowerCase()][2]; }, 'Use the “-ing” form after am/is/are'],
    // third person present
    [new RegExp('\\b(he|she|it|my (?:mum|mom|dad|son|daughter|brother|sister|friend|husband|wife|boss|teacher|baby)|everyone|everybody|nobody) (' + RX_BASE + ')\\b', 'gi'),
      function (m, s, v) { var b = v.toLowerCase(); if (!VERB[b] || /^(let|put|cut|hit|set|cost|shut|read|hurt)$/.test(b)) return m; return s + ' ' + VERB[b][0]; }, 'Add “s”: he/she/it goes'],
    [/\b(I|you|we|they) (goes|does|has|says|wants|likes|needs|makes|takes|gets|comes|loves|lives|works|plays|thinks|knows)\b/g, function (m, s, v) { return s + ' ' + base(v); }, 'Drop the “s” here'],
    [/\b(have|has|had|haven’t|hasn’t|hadn’t|I’ve|you’ve|we’ve|they’ve|he’s|she’s) (went|did|saw|ate|wrote|took|gave|came|ran|began|drank|spoke|broke|chose|drove|flew|forgot|knew|rode|sang|swam|threw|wore|woke|grew|fell|stole|hid|bit|blew|froze|shook|forgave)\b/gi, function (m, a, v) { return a + ' ' + VERB[FORM[v.toLowerCase()]][3]; }, 'Use the past participle (have gone, has eaten)'],
    [/\b(I|we|they|you|he|she) (seen|done)\b(?! by)/g, function (m, s, v) { return s + ' ' + (v === 'seen' ? 'saw' : 'did'); }, 'Use “saw/did” (or “have seen/done”)'],
    [/\b(peoples|childrens|womens|mens|sheeps|fishes)\b/gi, function (m) { return keepCase(m, { peoples: 'people', childrens: 'children', womens: 'women', mens: 'men', sheeps: 'sheep', fishes: 'fish' }[m.toLowerCase()]); }, 'Already plural'],
    [/\b(plays?|played|sings?|sang|speaks?|spoke|writes?|wrote|cooks?|cooked|works?|worked|runs?|ran|swims?|swam|dances?|danced|draws?|drew|did|does|do|drives?|drove|reads?) (\w+ )?(very |really |so )?good\b/gi, function (m, v, o, adv) { if (o && /^(is|was|are|were|be|been|am|it|that|this|seems?|looks?|feels?|tastes?|smells?|sounds?|books?|stories|story|articles?|a|the) $/i.test(o)) return m; if (/^(read|reads)$/i.test(v)) return m; return v + ' ' + (o || '') + (adv || '') + 'well'; }, 'Use “well” to describe how you do something'],
    // double negatives
    [/\b(don’t|doesn’t|didn’t|can’t|won’t|isn’t|aren’t|wasn’t|never|not) (\w+ )?(no|nothing|nobody|nowhere|none)\b/gi, function (m, a, mid, n) { var r = { no: 'any', nothing: 'anything', nobody: 'anybody', nowhere: 'anywhere', none: 'any' }[n.toLowerCase()]; return a + ' ' + (mid || '') + r; }, 'Double negative'],
    // comparatives and quantities
    [/\b(more|most) (better|best|worse|worst|bigger|biggest|smaller|easier|easiest|harder|faster|happier|happiest|older|younger)\b/gi, function (m, a, b) { return b; }, 'Remove “more/most”'],
    [/\bmuch (people|children|kids|friends|things|books|cars|students|times|days)\b/gi, function (m, n) { return 'many ' + n; }, 'Use “many” with countable nouns'],
    [/\bmany (money|water|time|information|advice|homework|furniture|traffic|rain|food|work)\b/gi, function (m, n) { return 'much ' + n; }, 'Use “much” with uncountable nouns'],
    [/\b(informations|advices|furnitures|homeworks|equipments|luggages|feedbacks)\b/gi, function (m) { return m.slice(0, -1); }, 'This word has no plural'],
    [new RegExp('\\b(' + NUM + ') (' + alt(NOUNS) + ')\\b', 'gi'), function (m, n, w) { return n + ' ' + plural(w.toLowerCase()); }, 'Use the plural'],
    [/\b(one|a|an|each|every) (children|people|men|women|books|friends|days|weeks|years)\b/gi, function (m, a, n) { var s = { children: 'child', people: 'person', men: 'man', women: 'woman' }[n.toLowerCase()] || n.slice(0, -1); return a + ' ' + s; }, 'Use the singular'],
    // articles
    [/\b(a|A) ([aeiouAEIOU]\w*|hour\w*|honest\w*|honou?r\w*)\b/g, function (m, a, w) { if (VOWEL_EXC_A.test(w)) return m; return (a === 'A' ? 'An ' : 'an ') + w; }, 'Use “an” before a vowel sound'],
    [/\b(an|An) ([b-df-hj-np-tv-zB-DF-HJ-NP-TV-Z]\w*|uni\w*|use\w*|one\w*|euro\w*)\b/g, function (m, a, w) { if (VOWEL_EXC_AN.test(w)) return m; return (a === 'An' ? 'A ' : 'a ') + w; }, 'Use “a” before a consonant sound'],
    [/\ban other\b/gi, function (m) { return keepCase(m, 'another'); }, '“another” is one word'],
    // word choice
    [/\b(their|there) (going|coming|doing|not|always|never|very|so|really|here)\b/gi, function (m, a, b) { return keepCase(a, 'they’re') + ' ' + b; }, 'Did you mean “they’re”?'],
    [/\btheir (is|are|was|were)\b/gi, function (m, a) { return keepCase(m, 'there') + ' ' + a; }, 'Use “there is/are”'],
    [/\byour (welcome|right|wrong|going|coming|doing|not|very|so|the best|amazing|late|early|well|okay|ok|sure|kidding|joking|kind|lucky|invited|always|never|too)\b/gi, function (m, a) { return keepCase(m, 'you’re') + ' ' + a; }, 'Did you mean “you’re”?'],
    [/\bits (a|an|the|been|not|going|very|so|too|time|important|raining|snowing|hard|easy|ok|okay|fine|cold|hot|warm|sunny|windy|nice|great|late|early|true|my|your|our|their|his|her|always|never|really|quite|getting|about|all|just|only|still|almost|already|here|there|over|up|done|good|bad|lovely|beautiful|amazing|hard|difficult|possible|impossible|clear|obvious)\b/gi, function (m, a) { return keepCase(m, 'it’s') + ' ' + a; }, 'Use “it’s” for “it is”'],
    [/\b(more|less|better|worse|bigger|smaller|faster|slower|rather|other|older|younger|taller) then\b/gi, function (m, a) { return a + ' than'; }, 'Use “than” for comparisons'],
    [/\bloose (weight|track|touch|my|your|the game|it)\b/gi, function (m, a) { return keepCase(m, 'lose') + ' ' + a; }, '“lose”, not “loose”'],
    [/\bless (people|children|kids|cars|books|friends|mistakes|things)\b/gi, function (m, n) { return keepCase(m, 'fewer') + ' ' + n; }, 'Use “fewer” with countable nouns'],
    [/\b(discuss|discussed|discussing) about\b/gi, function (m, a) { return a; }, 'No “about” after discuss'],
    [/\b(return|returned) back\b/gi, function (m, a) { return a; }, '“return” already means go back'],
    [/\b(repeat|repeated) again\b/gi, function (m, a) { return a; }, '“repeat” already means again'],
    [/\b(Me|me) and (my \w+|him|her|them|\w+) (\w+)\b/g, function (m, me, o, v) { var low = v.toLowerCase(); if (!FORM[low] && !/^(are|were|will|can|could|would|should)$/.test(low)) return m; var vv = low === 'is' ? 'are' : low === 'was' ? 'were' : FORM[low] && FORM[low] !== 'be' && VERB[FORM[low]][0] === low ? FORM[low] : v; var who = { him: 'he', her: 'she', them: 'they' }[o.toLowerCase()] || o; return keepCase(me, who) + ' and I ' + vv; }, 'Say “… and I”'],
    [/\b(\w+) \1\b/gi, function (m, a) { return /^(that|had)$/i.test(a) ? m : a; }, 'Repeated word'],
    // more word choice
    [/\b(its|it’s|it's) (to|too) (\w+)/gi, function (m, a, t, w) { return keepCase(a, 'it’s') + ' too ' + w; }, 'Say “it’s too …”'],
    [/\bto (much|many|late|early|big|small|hot|cold|expensive|cheap|hard|easy|far|long|fast|slow|soon|bad|good|busy|tired|young|old|loud|quiet|heavy|sweet|spicy)\b(?! (to|for) \w+ing)/gi, function (m, w) { return keepCase(m, 'too') + ' ' + w; }, 'Use “too” (meaning “very/also”)'],
    [/\b(me|you|us|him|her|them|it) to([.!?,]|$)/gi, function (m, a, p) { return a + ' too' + p; }, 'Use “too” (meaning “also”)'],
    [/\b(can|could|will|would|should|do|does|did|shall|may|must) (you|I|we|they|he|she|it|someone|anyone) (\w+)\b/gi, function (m, mod, s, v, off, all) { var b = FORM[v.toLowerCase()]; if (!b || b === 'be' || b === v.toLowerCase()) return m; if (VERB[b][2] === v.toLowerCase()) return m; if (mod === 'May' && off > 0 && !/[.!?\n]\s*$/.test(all.slice(0, off))) return m; if (/^(did|do|does)$/i.test(mod) && !/\?/.test(all.slice(off, off + 200).split(/[.!\n]/)[0])) return m; return mod + ' ' + s + ' ' + b; }, 'Use the base verb in questions'],
    [new RegExp('\\b(a lot of|lots of|plenty of|some of the|all the|all of the|many of the) (' + alt(NOUNS) + ')\\b', 'gi'), function (m, q, w) { return q + ' ' + plural(w.toLowerCase()); }, 'Use the plural'],
    [/\beveryday(?=\s*([.!?,;]|$|and\b|at\b|in\b|for\b|after\b|before\b|with\b|to\b|until\b))/gi, function (m) { return keepCase(m, 'every day'); }, '“every day” (two words) means each day'],
    [/\b(who’s|who's) (car|house|book|bag|phone|turn|idea|dog|kids|children|job)\b/gi, function (m, a, n) { return keepCase(a, 'whose') + ' ' + n; }, 'Use “whose” for belonging'],
    [/\bwhose (going|coming|there|that|this|ready|next)\b/gi, function (m, n) { return keepCase(m, 'who’s') + ' ' + n; }, 'Use “who’s” (who is)'],
    [/\b(we|you|they) where\b/gi, function (m, a) { return a + ' were'; }, 'Use “were”'],
    [/\bwere (is|are|was|do|did|can|should)\b/gi, function (m, a) { return keepCase(m, 'where') + ' ' + a; }, 'Use “where” for places'],
    [/\bcould care less\b/gi, 'couldn’t care less', 'Say “couldn’t care less”'],
    [/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december|christmas|easter|matariki|new zealand|aotearoa|auckland|wellington|christchurch|hamilton|tauranga|dunedin|english|maori|māori|god|jesus|mary|sunday school|philippines|filipino|filipina|india|indian|china|chinese|japan|japanese|korea|korean|australia|australian|samoa|samoan|tonga|tongan|fiji|fijian|america|american|canada|canadian|england|english|britain|british|scotland|scottish|ireland|irish|france|french|germany|german|italy|italian|spain|spanish|mexico|mexican|brazil|thailand|thai|vietnam|vietnamese|indonesia|indonesian|malaysia|malaysian|singapore|pakistan|nepal|sri lanka|bangladesh|dubai|europe|european|asia|asian|africa|african|pacific|kiwi|kiwis|manila|cebu|davao|kerala|mumbai|delhi|sydney|melbourne|brisbane|london|paris|rome|tokyo|rotorua|queenstown|nelson|napier|hastings|palmerston north|invercargill|whangarei|gisborne|new plymouth|whanganui|taupo|taupō|waikato|northland|canterbury|otago|southland|bay of plenty|hawke’s bay|hawkes bay|tagalog|hindi|monday school|catholic|christian|bible|google|facebook|whatsapp|youtube|instagram|iphone|ipad|android|microsoft|powerpoint|ielts|nzcel|ncea|nzqa|kiwisaver|pak’nsave|paknsave)\b/g, function (m) { if (m === 'march' || m === 'may') return m; if (m === 'maori') return 'Māori'; var SP = { ielts: 'IELTS', nzcel: 'NZCEL', ncea: 'NCEA', nzqa: 'NZQA', ird: 'IRD', acc: 'ACC', iphone: 'iPhone', ipad: 'iPad', kiwisaver: 'KiwiSaver', whatsapp: 'WhatsApp', youtube: 'YouTube', paknsave: 'PAK’nSAVE', 'pak’nsave': 'PAK’nSAVE', 'word document': 'Word document', 'bay of plenty': 'Bay of Plenty' }; if (SP[m]) return SP[m]; if (m === 'acc' || m === 'ird') return m; return m.replace(/(^|\s)\w/g, function (c) { return c.toUpperCase(); }); }, 'Capital letter for names, days and months'],
    // punctuation tidy
    [/ {2,}/g, ' ', 'Extra space'],
    [/ +([,.;:!?])/g, function (m, a) { return a; }, 'No space before punctuation'],
    [/([,;:])(?=[A-Za-z])/g, function (m, a) { return a + ' '; }, 'Space after punctuation'],
    [/([.!?])(?=[A-Z][a-z])/g, function (m, a) { return a + ' '; }, 'Space after a full stop'],
    [/!{2,}/g, '!', 'One exclamation mark is enough'],
    [/\?{2,}/g, '?', 'One question mark is enough']
  ];
  var PAST_MARK = /\b(yesterday|last (night|week|month|year|weekend|monday|tuesday|wednesday|thursday|friday|saturday|sunday|time|summer|winter|christmas|easter)|ago|this morning|in 20[01]\d|in 19\d\d|when I was (young|little|a child|a kid))\b/i;
  var PSUBJ = /\b((?:my \w+|\w+) and I|I|we|they|you|he|she|it|my \w+|the \w+|(?!(?:Yesterday|Last|This|When|In|On|At|The|And|But|So|Then|After|Before)\b)[A-Z][a-z]+)\s+(?:also |really |just |then |all |both )?(\w+)\b/g;
  function pastTense(sentence) {
    if (!PAST_MARK.test(sentence) || /\b(will|going to|tomorrow|next|since)\b/i.test(sentence)) return sentence;
    // split into clauses; shift only the clause that holds the time word, plus "and/then" clauses that follow it
    var bits = sentence.split(/(\s*,\s*|\s+(?:that|which|who|because|but|although|though|if|so|as)\s+)/);
    if (bits.length > 1) {
      var on = false, outB = [];
      for (var bi = 0; bi < bits.length; bi++) {
        var b = bits[bi];
        if (bi % 2 === 1) { outB.push(b); if (/^\s*,\s*$/.test(b)) { var nxt = bits[bi + 1] || ''; if (/^\s*(?:(?:and|but|so|then)\s+)?(I|we|you|they|he|she|it|my|our|the|this|there|his|her|their|your|its)\b/i.test(nxt)) on = false; } else on = false; continue; }
        if (PAST_MARK.test(b)) on = true;
        outB.push(on ? pastTense1(b) : b);
      }
      return outB.join('');
    }
    return pastTense1(sentence);
  }
  function pastTense1(sentence) {
    if (!PAST_MARK.test(sentence) && !/^\s*(and|then)\b/i.test(sentence)) { /* clause after the marker */ }
    return sentence.replace(PSUBJ, function (m, s, v) {
      var low = v.toLowerCase(), b = FORM[low];
      if (/^(am|is|are)$/.test(low)) return m.slice(0, m.length - v.length) + keepCase(v, (/^(I|he|she|it)$/i.test(s) || /^(my|the) /i.test(s) && !/s$/.test(s) ? 'was' : 'were'));
      if (!b || b === 'be') return m;
      if (low !== b && low !== VERB[b][0]) return m; // already past or another form
      return m.slice(0, m.length - v.length) + keepCase(v, VERB[b][1]);
    });
  }
  function pastAnd(sentence) {
    if (!PAST_MARK.test(sentence) || /\b(will|going to|tomorrow|next|since)\b/i.test(sentence)) return sentence;
    return sentence.replace(/\b(and|then|but|so) (also |then )?(\w+)\b/gi, function (m, c, adv, v) {
      var low = v.toLowerCase(), b = FORM[low]; if (!b || b === 'be') return m;
      if (low !== b && low !== VERB[b][0]) return m;
      if (/^(I|you|we|they|he|she|it|the|a|my|your|our|their|his|her)$/i.test(v)) return m;
      return c + ' ' + (adv || '') + keepCase(v, VERB[b][1]);
    });
  }
  /* ---------- spelling: a full word list checked on this device ---------- */
  var WORDS = null;
  var COMMON = {};
  ('the be to of and a in that have I it for not on with he as you do at this but his by from they we say her she or an will my one all would there their what so up out if about who get which go me when make can like time no just him know take people into year your good some could them see other than then now look only come its over think also back after use two how our work first well way even new want because any these give day most us is was are were has had did said went made got came saw took knew thought told gave found left felt kept brought began wrote stood heard meant met ran paid sat spoke read grew lost sent built understood spent cut drove bought wore chose ate drank slept swam sang taught caught flew forgot won sold fought threw woke rode hid shut put hit cost fed ' +
   'very really much many more most less few little lot lots every each both again always never often sometimes usually today tomorrow yesterday tonight morning afternoon evening night week month weekend monday tuesday wednesday thursday friday saturday sunday january february march april june july august september october november december ' +
   'home house school work job family friend friends mother father mum dad brother sister son daughter husband wife child children baby kids parents grandmother grandfather teacher student doctor nurse church car bus train city country world water food money weather beach park shop shopping market garden kitchen room bed table chair door window book books letter email phone computer music movie film game party holiday birthday christmas easter dinner lunch breakfast coffee tea milk bread rice fish chicken meat fruit vegetables apple ' +
   'happy sad tired busy free ready sure sorry glad nice kind lovely beautiful great big small long short old young new hot cold warm cool easy hard difficult important interesting boring excited bored worried different same early late fast slow quick quiet loud clean dirty cheap expensive healthy safe best better worse worst favourite ' +
   'because although however therefore moreover furthermore nevertheless whereas while unless until since whether either neither also too instead otherwise meanwhile finally firstly secondly lastly overall example instance addition contrast conclusion opinion believe agree disagree think feel hope wish want need like love hate prefer enjoy ' +
   'help call ask answer try study learn teach play watch listen speak talk write read walk run drive travel visit stay live move leave arrive start begin finish stop wait open close buy sell pay spend save cook eat drink sleep wake clean wash carry bring take give send receive get keep find lose win remember forget understand explain describe suggest recommend improve change decide plan prepare organise celebrate thank apologise invite attend join meet').split(' ').forEach(function (w) { COMMON[w] = 1; });
  var RANK = {};
  function setWords(str, freq) { RANK = {}; String(freq || '').split(' ').forEach(function (w, i) { if (w && !(w in RANK)) RANK[w] = i; }); WORDS = {}; 'english maori māori zealand nz kiwi kiwis philippines filipino filipina pinoy pinay tagalog cebuano ilocano visayan manila cebu davao baguio iloilo boracay palawan india indian kerala malayalam hindi tamil punjabi sikh mumbai delhi chennai bangalore bengaluru kolkata hyderabad goa indore samoa samoan tonga tongan fiji fijian niue cook rarotonga australia australian aussie sydney melbourne brisbane perth adelaide auckland wellington christchurch hamilton tauranga dunedin rotorua queenstown napier hastings nelson taupo whanganui whangarei gisborne invercargill otago canterbury waikato northland china chinese japan japanese korea korean thailand thai vietnam vietnamese indonesia indonesian malaysia malaysian singapore pakistan nepal bangladesh dubai uae usa uk us america american canada canadian england british scotland ireland irish europe asia africa asap fyi btw lol omg tbh imo ok okay pls thx diy pdf faq ceo hr it ict ielts nzcel ncea nzqa ird acc kiwisaver gst covid whatsapp facebook instagram youtube tiktok google gmail iphone ipad android wifi app apps online email emails website websites login logout signup mateo sijoy james jandals togs bach hangi hāngī whanau whānau aroha kia ora mahi kai marae iwi te reo pakeha pākehā matariki tamariki mokopuna haka powhiri pōwhiri karakia waiata koha kaitiaki manaakitanga'.split(' ').forEach(function (w) { WORDS[w] = 1; }); String(str).split(' ').forEach(function (w) { WORDS[w] = 1; }); Object.keys(FORM).forEach(function (w) { WORDS[w] = 1; }); Object.keys(COMMON).forEach(function (w) { WORDS[w] = 1; }); Object.keys(MISSPELL).forEach(function (k) { var v = MISSPELL[k]; if (v) v.toLowerCase().split(/[ ’']/).forEach(function (w) { WORDS[w] = 1; }); }); }
  function inW(w) { return !!WORDS[w]; }
  function known(w) {
    if (!WORDS) return true;
    w = w.toLowerCase();
    if (inW(w)) return true;
    var c = [];
    if (/’s$|'s$/.test(w)) c.push(w.slice(0, -2));
    if (/s’$|s'$/.test(w)) c.push(w.slice(0, -1));
    if (/ies$/.test(w)) c.push(w.slice(0, -3) + 'y');
    if (/es$/.test(w)) c.push(w.slice(0, -2));
    if (/s$/.test(w)) c.push(w.slice(0, -1));
    if (/ied$/.test(w)) c.push(w.slice(0, -3) + 'y');
    if (/ed$/.test(w)) { if (!cvc(w.slice(0, -2))) c.push(w.slice(0, -2)); c.push(w.slice(0, -1)); if (/(.)\1ed$/.test(w)) c.push(w.slice(0, -3)); }
    function cvc(x) { return /^[^aeiou]*[aeiou][^aeiouwxy]$/.test(x) && x.length <= 5; }
    if (/ing$/.test(w)) { var st = w.slice(0, -3); if (!cvc(st)) c.push(st); c.push(st + 'e'); if (/(.)\1$/.test(st)) c.push(st.slice(0, -1)); if (/y$/.test(st)) c.push(st.slice(0, -1) + 'ie'); }
    if (/ings$/.test(w)) c.push(w.slice(0, -4), w.slice(0, -4) + 'e');
    if (/ily$/.test(w)) c.push(w.slice(0, -3) + 'y');
    if (/ly$/.test(w)) c.push(w.slice(0, -2), w.slice(0, -2) + 'le', w.slice(0, -1) + 'e');
    if (/ier$|iest$/.test(w)) c.push(w.replace(/ier$|iest$/, 'y'));
    if (/er$|est$/.test(w)) { var b2 = w.replace(/er$|est$/, ''); c.push(b2, b2 + 'e'); if (/(.)\1$/.test(b2)) c.push(b2.slice(0, -1)); }
    if (/ers$/.test(w)) c.push(w.slice(0, -3), w.slice(0, -2));
    if (/(ness|ment|ful|less|ship|hood|able|ible|ism|ist|ity)$/.test(w)) c.push(w.replace(/(ness|ment|ful|less|ship|hood|able|ible|ism|ist|ity)$/, ''), w.replace(/iness$/, 'y'), w.replace(/(able|ible)$/, 'e'));
    if (/^(un|re|pre|dis|mis|non|over|under|out|self)/.test(w)) c.push(w.replace(/^(un|re|pre|dis|mis|non|over|under|out|self)-?/, ''));
    if (/-/.test(w)) return w.split('-').every(function (p) { return !p || known(p); });
    return c.some(function (x) { return x.length > 1 && inW(x); });
  }
  var ABC = 'abcdefghijklmnopqrstuvwxyz';
  function edits1(w) {
    var out = [], i, j;
    for (i = 0; i <= w.length; i++) {
      var L = w.slice(0, i), R2 = w.slice(i);
      if (R2) out.push(L + R2.slice(1));
      if (R2.length > 1) out.push(L + R2[1] + R2[0] + R2.slice(2));
      for (j = 0; j < 26; j++) { if (R2) out.push(L + ABC[j] + R2.slice(1)); out.push(L + ABC[j] + R2); }
    }
    return out;
  }
  function suggest(word) {
    var w = word.toLowerCase(), seen = {}, list = [];
    function add(c, d) { if (seen[c] || c === w || c.length < 2) return; seen[c] = 1; if (inW(c) || (c in RANK) && known(c)) list.push({ w: c, d: d }); }
    var e1 = edits1(w); e1.forEach(function (c) { add(c, 1); });
    if (list.length < 2 && w.length > 4) e1.forEach(function (c) { if (c.length < w.length - 1) return; edits1(c).forEach(function (c2) { add(c2, 2); }); });
    function rk(x) { var r = RANK[x]; return r === undefined ? 0 : r < 500 ? 8 : r < 2000 ? 6 : r < 5000 ? 4 : r < 12000 ? 2 : 0; }
    list.forEach(function (x) { x.s = x.d * 10 - rk(x.w) - (COMMON[x.w] || COMMON[FORM[x.w]] ? 4 : 0) - (FORM[x.w] ? 2 : 0) - (x.w[0] === w[0] ? 2 : 0) + Math.abs(x.w.length - w.length) + (x.w.length < 3 ? 4 : 0); });
    list.sort(function (a, b) { return a.s - b.s; });
    return list.slice(0, 3);
  }
  function spellCheck(text) {
    if (!WORDS) return { text: text, changes: [], tips: [] };
    var changes = [], tips = [], count = 0, flagged = {};
    var out = text.replace(/(^|[^\p{L}’'@\/.\-])(\p{L}[\p{Ll}’']*\p{Ll})(?=[^\p{L}’'@]|$)/gu, function (m, pre, wd, off) {
      if (count > 30) return m;
      var bare = wd.replace(/[’']+$/, '');
      if (bare.length < 3 || /’|'/.test(bare) && !/’s$|'s$/.test(bare)) return m;
      var startOfSentence = /(^|[.!?]\s*|\n\s*)$/.test(text.slice(0, off + pre.length));
      if (/[^a-zA-Z’']/.test(bare)) return m; // te reo Māori and other words with macrons
      if (/^[A-Z]/.test(bare) && !known(bare)) return m; // names and places
      if (known(bare)) return m;
      var lb = bare.toLowerCase();
      if (Object.prototype.hasOwnProperty.call(MISSPELL, lb) || /^(dont|doesnt|didnt|cant|wont|isnt|wasnt|arent|werent|havent|hasnt|hadnt|couldnt|wouldnt|shouldnt|im|ive|youre|theyre|thats|whats|lets|its|id|ill|hes|shes|theres|wheres|whos)$/.test(lb)) return m;
      if (/^[A-Z]{2,}$/.test(bare)) return m;
      count++;
      var s = suggest(bare);
      var topRank = s.length ? RANK[s[0].w] : undefined;
      if (s.length && (s[0].d === 1 && bare.length >= 5 || s[0].d === 2 && bare.length >= 8) && topRank !== undefined && topRank < 8000 && (s.length === 1 || s[1].s - s[0].s >= 3)) {
        var fix = keepCase(bare, s[0].w);
        changes.push({ from: bare, to: fix, why: 'Spelling' });
        return pre + fix + wd.slice(bare.length);
      }
      if (!flagged[bare.toLowerCase()]) { flagged[bare.toLowerCase()] = 1; tips.push('Check the spelling of “' + bare + '”' + (s.length ? ' — did you mean ' + s.map(function (x) { return '“' + keepCase(bare, x.w) + '”'; }).join(' or ') + '?' : '.')); }
      return m;
    });
    return { text: out, changes: changes, tips: tips };
  }

  function grammarFix(text) {
    var cur = text.replace(/(\w)'(\w)/g, '$1’$2'), changes = [];
    var pre0 = cur;
    cur = cur.replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); })
      .replace(/\bi\b/g, 'I')
      .replace(/(^|\n\s*)(Hi|Hello|Hey|Dear|Kia ora|Morning|Good morning|Good afternoon|Good evening) ([a-z])([a-z]+)\b/g, function (m, a, g, f, r) { return /^(everyone|all|there|team|guys|friends|sir|madam|whānau|whanau|both)$/.test(f + r) ? m : a + g + ' ' + f.toUpperCase() + r; })
      .replace(/(^|\n\s*)(kind regards|best regards|warm regards|best wishes|regards|yours sincerely|yours faithfully|many thanks|cheers|ngā mihi|nga mihi|love|take care)\b/gi, function (m, a, w) { return a + w.charAt(0).toUpperCase() + w.slice(1); })
      .replace(/(\n\s*)([a-z])([a-z]+)\s*$/g, function (m, a, f, r) { return a + f.toUpperCase() + r; });
    if (pre0 !== cur) changes.push({ from: '', to: '', why: 'Capital letters at the start of sentences, for “I” and for names' });
    var ALLR = GRAM_PRE.concat(GRAM, GRAM_POST);
    for (var pass = 0; pass < 2; pass++) {
      ALLR.forEach(function (r) {
        var rx = new RegExp(r[0].source, r[0].flags);
        cur = cur.replace(rx, function () {
          var args = Array.prototype.slice.call(arguments), m = args[0];
          var out = typeof r[1] === 'function' ? r[1].apply(null, args) : r[1];
          if (out !== m) changes.push({ from: m, to: out, why: r[2] });
          return out;
        });
      });
    }
    // past-time sentences
    cur = cur.split(/((?<=[.!?])\s+|\n+)/).map(function (s, idx) { if (idx % 2 === 1 || !s.trim()) return s; s = sentenceFix(s, changes); var o = pastAnd(pastTense(s)); if (o !== s) changes.push({ from: s, to: o, why: 'Past time: use the past tense' }); return o; }).join('');
    var seen = {}; changes = changes.filter(function (c) { var k = c.from + '>' + c.to; if (seen[k]) return false; seen[k] = 1; return true; });
    return { text: cur, changes: changes };
  }
/* ---------- fixing engine ---------- */
  function applyFix(text, it, fix) {
    var v = fix === undefined ? it.fix : fix;
    if (v === null || v === undefined) return text;
    var before = text.slice(0, it.start), after = text.slice(it.end);
    if (v === '') { before = before.replace(/ $/, ''); }
    return (before + v + after).replace(/ {2,}/g, ' ');
  }
  function isQuestion(q) {
    if (/^How (lovely|nice|great|wonderful|kind|sweet|beautiful)\b/.test(q)) return false;
    if (/^(What|Why|How|Where|When|Who|Which)\b/.test(q)) return /^(What|Why|How|Where|When|Who|Which)(?: \w+)?\s+(is|are|was|were|do|does|did|can|could|will|would|should|shall|has|have|had|may|might|must|am|’s|’re|about|many|much|long|often|old|far|wants?|knows?|likes?|needs?|says?|thinks?)\b/.test(q);
    if (/^(Can|Could|Would|Will|Do|Does|Did|Is|Are|Was|Were|Shall|Should|Have|Has|May)\b/.test(q)) return /^\w+\s+(I|you|we|they|he|she|it|there|this|that|these|those|my|your|our|his|her|their|the|a|an|anyone|someone|everyone|not)\b/i.test(q) || /^\w+n’t\b/.test(q);
    return false;
  }
  function tidy(text) {
    var t = text.replace(/[ \t]+\n/g, '\n').replace(/^\s+|\s+$/g, '');
    t = t.replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
    t = t.replace(/\s+([,.;:!?])/g, '$1');
    // questions end with a question mark
    t = t.replace(/(^|[.!?]\s+|\n)((?:Can|Could|Would|Will|Do|Does|Did|Is|Are|Was|Were|What|Why|How|Where|When|Who|Which|Shall|Should|Have|Has|May)\b[^.!?\n]*)([.]|(?=\n)|$)/g, function (m, a, q, p) { if (/^How (lovely|nice|great|wonderful|kind|sweet|beautiful)\b/.test(q)) return m; if (/^(What|Why|How|Where|When|Who|Which)\b/.test(q) && !/^(What|Why|How|Where|When|Who|Which)(?: \w+)?\s+(is|are|was|were|do|does|did|can|could|will|would|should|shall|has|have|had|may|might|must|am|’s|’re|about|many|much|long|often|old|far|wants?|knows?|likes?|needs?|says?|thinks?)\b/.test(q)) return m; if (/^(Can|Could|Would|Will|Do|Does|Did|Is|Are|Was|Were|Shall|Should|Have|Has|May)\b/.test(q) && !/^\w+\s+(I|you|we|they|he|she|it|there|this|that|these|those|my|your|our|his|her|their|the|a|an|anyone|someone|everyone|n’t|not)\b/i.test(q)) return m; return a + q.replace(/\s+$/, '') + '?'; });
    t = t.split('\n').map(function (line, i, all) {
      var L = line.replace(/\s+$/, ''); if (!L.trim()) return L;
      if (/[.!?…:;,"”)\]]$/.test(L)) return L;
      var words = L.trim().split(/\s+/).length;
      if (/^(Hi|Hello|Hey|Dear|Kia ora|To whom)/i.test(L.trim()) && words <= 5) return L + ',';
      if (/^(Kind regards|Best regards|Warm regards|Best wishes|Regards|Yours sincerely|Yours faithfully|Many thanks|Cheers|Ngā mihi|Nga mihi|Love|Take care|Thanks|Thank you)$/i.test(L.trim())) return L + ',';
      if (words < 3 || /^[-•*\d]/.test(L.trim()) || /^#/.test(L.trim())) return L;
      if (isQuestion(L.trim())) return L + '?';
      return L + '.';
    }).join('\n');
    return t;
  }

  /* polish: stronger, precise words for flat "very + adjective" phrases */
  var POLISH = { 'very good': 'excellent', 'very bad': 'terrible', 'very big': 'huge', 'very large': 'enormous', 'very small': 'tiny', 'very happy': 'delighted', 'very tired': 'exhausted', 'very important': 'essential', 'very hungry': 'starving', 'very cold': 'freezing', 'very beautiful': 'stunning', 'very interesting': 'fascinating', 'very difficult': 'challenging', 'very easy': 'simple', 'very scared': 'terrified', 'very angry': 'furious', 'very surprised': 'astonished', 'very clean': 'spotless', 'very dirty': 'filthy', 'very funny': 'hilarious', 'very nice': 'lovely', 'very pretty': 'gorgeous', 'very smart': 'brilliant', 'very rich': 'wealthy', 'very sure': 'certain', 'very worried': 'anxious', 'very excited': 'thrilled', 'very boring': 'tedious', 'very expensive': 'costly', 'very cheap': 'inexpensive', 'very hot': 'scorching', 'very strong': 'powerful', 'really good': 'excellent', 'really bad': 'terrible', 'really big': 'huge', 'really happy': 'delighted', 'really tired': 'exhausted', 'really important': 'essential', 'really interesting': 'fascinating', 'really funny': 'hilarious', 'a lot of time': 'plenty of time', 'kind of': 'rather', 'sort of': 'somewhat', 'got better': 'improved', 'get better': 'improve', 'gets better': 'improves', 'got worse': 'worsened', 'find out': 'discover', 'found out': 'discovered', 'look into': 'investigate', 'looked into': 'investigated', 'think about': 'consider', 'thought about': 'considered', 'talk about': 'discuss', 'talked about': 'discussed', 'a little bit': 'slightly', 'lots of': 'many', 'nowadays': 'today', 'big problem': 'major problem', 'good chance': 'strong chance' };
  var POLISH_CASUAL = { 'kind of': 1, 'sort of': 1, 'find out': 1, 'found out': 1, 'look into': 1, 'looked into': 1, 'think about': 1, 'thought about': 1, 'talk about': 1, 'talked about': 1, 'lots of': 1, 'nowadays': 1, 'got better': 1, 'get better': 1, 'gets better': 1, 'got worse': 1, 'a little bit': 1 };
  function polishText(text, mode) {
    var changes = [], formal = /^(academic|business|email)$/.test(mode);
    var keys = Object.keys(POLISH).filter(function (k) { return formal || !POLISH_CASUAL[k]; }).sort(function (a, b) { return b.length - a.length; });
    var rx = new RegExp('\\b(' + keys.map(function (k) { return k.replace(/ /g, '\\s+'); }).join('|') + ')\\b', 'gi');
    var out = text.replace(rx, function (m) { var k = m.toLowerCase().replace(/\s+/g, ' '); var v = POLISH[k]; if (!v) return m; if (/^lots of$/.test(k) && /^\s*(time|money|water|work|fun|food|love|help|information|advice)\b/i.test(text.slice(text.indexOf(m) + m.length))) return m; var r = /^[A-Z]/.test(m) ? v.charAt(0).toUpperCase() + v.slice(1) : v; changes.push({ from: m, to: r, why: 'Polish: a stronger, more precise word' }); return r; });
    out = out.replace(/\b(a|A|an|An) (excellent|enormous|essential|astonished|ancient|impoverished|anxious|inexpensive|huge|terrible|tiny|delighted|stunning|fascinating|challenging|simple|hilarious|lovely|gorgeous|brilliant|silent|wealthy|certain|thrilled|tedious|costly|rapid|sluggish|heartbroken|soaked|scorching|powerful|feeble|major|strong)\b/g, function (m, art, w) { var an = /^[aeiou]/i.test(w); var A = /^A/.test(art) ? (an ? 'An' : 'A') : (an ? 'an' : 'a'); return A + ' ' + w; });
    return { text: out, changes: changes };
  }

  var ABBR = [[/\be\.?g\.?(?=[\s,)])/gi, 'e.g.'], [/\bi\.?e\.?(?=[\s,)])/gi, 'i.e.'], [/\betc\.?(?=[\s,)]|$)/gi, 'etc.'], [/\b(a|p)\.m\.?(?=[\s,)]|$)/gi, '$1m'], [/\b(Mr|Mrs|Ms|Dr|St|Prof|vs|approx|No)\.(?=\s)/g, '$1']];
  function protect(t) { var keep = []; ABBR.forEach(function (r) { t = t.replace(r[0], function () { var out = r[1].replace(/\$1/g, arguments[1] || ''); keep.push(out); return '\u2063' + (keep.length - 1) + '\u2063'; }); }); t = t.replace(/(https?:\/\/\S+|www\.\S+|\S+@\S+\.\w+|\b[\w-]+\/[\w\/-]+\b)/g, function (m) { keep.push(m); return '\u2063' + (keep.length - 1) + '\u2063'; }); return { t: t, keep: keep }; }
  function unprotect(t, keep) { return t.replace(/\u2063(\d+)\u2063/g, function (m, i) { return keep[+i]; }); }
  function fixText(text, mode, opts) {
    var pr = protect(text), res = fixText0(pr.t, mode, opts);
    res.text = unprotect(res.text, pr.keep);
    res.changes.forEach(function (c) { if (c.from) c.from = unprotect(c.from, pr.keep); if (c.to) c.to = unprotect(c.to, pr.keep); });
    return res;
  }
  function fixText0(text, mode, opts) {
    var sp = spellCheck(text);
    var g = grammarFix(sp.text);
    var cur = g.text, changes = sp.changes.concat(g.changes), tips = sp.tips.slice(0, 4), seenTip = {};
    grammarTips(g.text).forEach(function (t) { if (!seenTip[t]) { seenTip[t] = 1; tips.push(t); } });
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
    if (!(opts && opts.noPolish) && mode !== 'creative') { var pl = polishText(cur, mode); if (pl.changes.length) { cur = pl.text; changes = changes.concat(pl.changes); } }
    var tidied = tidy(cur);
    if (tidied !== cur.trim()) changes.push({ from: '', to: '', why: 'Capital letters and full stops tidied.' });
    return { text: tidied, changes: changes.reverse(), tips: tips.slice(0, 8) };
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
    var bz = useState(false), busy = bz[0], setBusy = bz[1];
    useEffect(function () { loadWords(); }, []);
    function run() { setMsg(''); setBusy(true); loadWords().then(function () { setBusy(false); setRes(fixText(text, mode)); }); }
    return h('div', { className: 'jx-wb' },
      h('div', { className: 'jx-wb-way', role: 'tablist', 'aria-label': 'Writing help' },
        [['fix', '✨ Fix my writing'], ['draft', '📝 Write it for me'], ['exam', '🎓 Exam practice']].map(function (x) {
          return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': way === x[0], className: way === x[0] ? 'is-on' : '', onClick: function () { setWay(x[0]); setMsg(''); } }, x[1]);
        })),
      way === 'exam' ? h('div', { className: 'jx-wb-pane' }, JNZX.ExamPractice ? h(JNZX.ExamPractice) : h('p', null, 'Loading…')) :
      way === 'fix' ? h('div', { className: 'jx-wb-pane' },
        h(JNZX.Chips, { label: 'Kind of writing', options: STYLES.map(function (x) { return { value: x.id, label: x.label }; }), value: mode, onChange: function (v) { setMode(v); setRes(null); } }),
        h('label', { className: 'jx-sr', htmlFor: 'jx-wb-text' }, 'Your writing'),
        h('textarea', { id: 'jx-wb-text', rows: 6, value: text, maxLength: 20000, spellCheck: true, placeholder: 'Paste or type your writing here…', onChange: function (ev) { setText(ev.target.value); setRes(null); } }),
        h('div', { className: 'jx-row' },
          h('button', { type: 'button', className: 'primary', disabled: !text.trim() || busy, onClick: run }, busy ? 'Checking…' : '✨ Fix it'),
          !text && h('button', { type: 'button', className: 'secondary', onClick: function () { setText(SAMPLES[mode]); } }, 'Try an example'),
          text && h('button', { type: 'button', className: 'secondary', onClick: function () { setText(''); setRes(null); } }, 'Clear'),
          text && h('small', { className: 'jx-muted' }, st.words + ' words' + (st.words > 20 ? ' · ' + readLabel(st.flesch).toLowerCase() : ''))),
        res && h('div', { className: 'jx-wb-out', 'aria-live': 'polite' },
          h('p', { className: 'jx-wb-label' }, res.changes.length ? 'Here’s your polished version' : 'Looks good — nothing to fix.'),
          res.changes.length > 0 && h('div', { className: 'jx-wb-result' }, res.text),
          h('div', { className: 'jx-row' },
            res.changes.length > 0 && h('button', { type: 'button', className: 'primary', onClick: function () { setText(res.text); setRes(null); setMsg('Done — your text is updated.'); } }, 'Use this'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { copyText(res.changes.length ? res.text : text, setMsg); } }, 'Copy')),
          res.changes.length > 0 && h('details', { className: 'jx-wb-why' }, h('summary', null, 'What I changed (' + expandChanges(res.changes).length + ')'),
            h('ul', null, expandChanges(res.changes).slice(0, 20).map(function (c, i) { return h('li', { key: i }, c.from === '…' ? h('span', null, 'added ', h('strong', null, '“' + c.to + '”'), ' · ') : c.from ? h('span', null, h('s', null, c.from), ' → ', h('strong', null, c.to === '' ? '(removed)' : c.to), ' · ') : null, c.why); }))),
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
  var wordsReady = null;
  function loadWords() {
    if (!wordsReady) wordsReady = JNZX.load('./data/words.json').then(function (w) { setWords(w, (window.JNZDATA || {})['./data/wordfreq.json']); return true; }, function () { wordsReady = null; return false; });
    return wordsReady;
  }
  JNZX.loadWords = loadWords;
  JNZX.WriteBuddy = WriteBuddy; JNZX._grammar = grammarFix; JNZX._fix = fixText; JNZX._setWords = setWords; JNZX._reply = function (q) { return reply(q, 0); };
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
  var HELP = [
    [/since.*\bfor\b|\bfor\b.*since/, 'Since or for?', '“For” + a length of time: for two years, for a week. “Since” + a starting point: since 2019, since Monday, since I was a child. Both usually go with have/has: “I have lived here for five years / since 2021.”'],
    [/present perfect|have \+|have been|past simple|simple past/, 'Present perfect or past simple?', 'Past simple for a finished time: “I went to Rotorua last year.” Present perfect when the time isn’t finished or isn’t said: “I have been to Rotorua twice.” Never use the present perfect with yesterday, last week or ago.'],
    [/\ban\b.*\ba\b|articles?|\bthe\b.*\ba\b/, 'A, an or the?', 'Use “a” before a consonant sound (a car, a university) and “an” before a vowel sound (an apple, an hour). Use “the” when the listener knows which one: “I bought a car. The car is blue.” Don’t use “a” with uncountable nouns: some advice, some information.'],
    [/much.*many|many.*much|countable|uncountable|fewer|less/, 'Much/many, less/fewer', '“Many” and “fewer” with things you can count (many friends, fewer cars). “Much” and “less” with things you can’t count (much time, less money). “A lot of” works for both.'],
    [/their|there|they're|they’re/, 'Their, there, they’re', '“Their” = belongs to them (their house). “There” = place or “there is/are”. “They’re” = they are (they’re coming).'],
    [/\bits\b|it's|it’s/, 'Its or it’s?', '“It’s” = it is / it has (it’s raining). “Its” = belonging to it (the dog wagged its tail).'],
    [/your|you're|you’re/, 'Your or you’re?', '“Your” = belonging to you (your coat). “You’re” = you are (you’re welcome).'],
    [/affect|effect/, 'Affect or effect?', '“Affect” is usually the verb (the rain affected the game). “Effect” is usually the noun (the rain had a big effect).'],
    [/gerund|infinitive|-ing or to|ing or to|enjoy|want to/, '-ing or to?', 'Some verbs take -ing: enjoy, finish, avoid, mind, suggest, keep (I enjoy swimming). Some take to: want, need, decide, hope, plan, promise (I want to swim). Like, love and hate can take both. After “look forward to” use -ing: I look forward to hearing from you.'],
    [/conditional|\bif\b.*will|if clause/, 'If sentences (conditionals)', 'Real future: If it rains, we will stay home (not “if it will rain”). Imaginary: If I had more time, I would learn the guitar. Past regret: If I had known, I would have come.'],
    [/passive/, 'The passive', 'Use be + past participle when the action matters more than who did it: “The bridge was built in 1932.” “Mistakes were made.” Add “by …” only if it matters: “written by a local author”.'],
    [/compar|superlative|-er|more easy|easier/, 'Comparatives and superlatives', 'Short adjectives: big → bigger → the biggest; easy → easier → the easiest. Longer adjectives: more interesting → the most interesting. Never “more easier”. Irregular: good → better → best, bad → worse → worst.'],
    [/preposition|\bin\b.*\bon\b.*\bat\b|on monday|in the morning|at night/, 'In, on or at (time)?', '“At” for clock times and night (at 6 pm, at night). “On” for days and dates (on Monday, on 6 February). “In” for months, years and parts of the day (in May, in 2026, in the morning).'],
    [/reported speech|said.*told|say.*tell|tell.*say/, 'Say or tell?', 'You tell someone something: “She told me the news.” You say something (to someone): “She said that she was tired.” Never “she said me”.'],
    [/question|word order|where is|do you/, 'Question word order', 'Question: “Where is the station?” “What do you want?” Inside a sentence the order goes back to normal: “Can you tell me where the station is?” “I don’t know what he wants.”'],
    [/comma|run-on|full stop|punctuation|sentence structure|long sentence/, 'Commas and full stops', 'Don’t join two complete sentences with only a comma (“The food was cold, the staff were rude”). Use a full stop, or a joining word: “The food was cold, and the staff were rude.” Put a comma after an opening phrase: “In the morning, we left.”'],
    [/capital|capitalis/, 'Capital letters', 'Capitalise the first word of a sentence, “I”, names, places, days, months, languages and nationalities: “On Monday I flew to Wellington with Aroha. We speak English and Māori.”'],
    [/linking|connector|cohesive|transition/, 'Linking words', 'Adding: also, in addition, furthermore. Contrast: however, although, whereas. Cause/result: because, so, therefore, as a result. Example: for example, such as. Ending: in conclusion, overall, on balance. Use a range — not the same one every time.'],
    [/semicolon|semi-colon/, 'Semicolons', 'Use a semicolon to join two complete sentences that are closely linked: “I like tea; my husband prefers coffee.” Use one before however/therefore when they join two sentences: “It rained; however, we went out.”'],
    [/\bcolons?\b/, 'Colons', 'Use a colon after a complete sentence to introduce a list, an example or an explanation: “I need three things: milk, bread and eggs.” Don’t put a colon straight after a verb (“My favourites are pizza and pasta”).'],
    [/relative|which or that|who or which|whose|adjective clause/, 'Who, which, that and whose', 'Who for people, which for things, that for both, whose for belonging (“the man whose car was stolen”). If the information is extra (the person or place is already clear), put it between commas: “My mother, who is 70, still works.” If it tells you which one, no commas: “The students who passed were happy.”'],
    [/noun clause|reported|indirect/, 'Reported speech and indirect questions', 'Reported speech usually moves the tense back: “I am tired” → She said she was tired. Indirect questions use normal word order and no question mark: “Where do you live?” → He asked where I lived.'],
    [/fragment|half a sentence|incomplete sentence/, 'Sentence fragments', 'A sentence needs a subject and a verb and must make sense alone. “Because it rained.” is only half — add the main idea: “Because it rained, we stayed inside.”'],
    [/dangling|modifier/, 'Dangling modifiers', 'An opening -ing phrase must describe the subject that comes straight after the comma. Wrong: “Walking to school, the rain started.” Right: “Walking to school, I got caught in the rain.”'],
    [/adverb clause|subordinat|although|because|unless/, 'Adverb clauses', 'Clauses with although, because, when, if, unless and while need a main clause. Put a comma after the opening clause: “When I got home, I cooked dinner.” Don’t add “but” after although or “so” after because.'],
    [/stative|state verb|knowing|liking/, 'State verbs', 'Verbs for states — know, like, love, want, need, believe, understand, own, belong — are not usually used in the -ing form: “I know the answer” (not “I am knowing”).'],
    [/past perfect|had \+|had already/, 'Past perfect', 'Use had + past participle for the earlier of two past actions: “When I arrived, the film had already started.”'],
    [/apostrophe|possessive/, 'Apostrophes', 'Use ’s for one owner (my mum’s car) and s’ for plural owners (the kids’ toys). Its = belonging to it; it’s = it is. Use apostrophes for short forms: don’t, can’t, I’m, let’s.'],
    [/ielts/, 'IELTS tips', 'Writing Task 1 (20 min, 150+ words): give an overview and key figures, no opinion. Task 2 (40 min, 250+ words): answer every part of the question, give a clear position, 4–5 paragraphs. Try the 🎓 Exam practice tab — I’ll time you, count your words and give a practice band.'],
    [/cambridge|b2 first|\bfce\b|c1 advanced|\bcae\b|c2 proficiency|\bcpe\b/, 'Cambridge tips', 'B2 First writing: 140–190 words each. C1 Advanced: 220–260. C2 Proficiency: 240–280 (summary essay) and 280–320. Plan for 5 minutes, use the right style for the reader, show a range of linking words and structures, and leave time to check. Practise in 🎓 Exam practice.'],
    [/nzcel|new zealand certificate in english/, 'NZCEL tips', 'NZCEL runs from Foundation to Level 6, with General, Employment and Academic strands at Levels 3–5. Focus on purpose and audience, clear paragraphs, accurate grammar and (for Academic) formal language with sources. Practise in 🎓 Exam practice.']
  ];
  function wordDiff(a, b) {
    var A = a.split(/\s+/), B = b.split(/\s+/), n = A.length, m = B.length, L = [], i, j;
    for (i = 0; i <= n; i++) { L.push([]); for (j = 0; j <= m; j++) L[i].push(0); }
    for (i = n - 1; i >= 0; i--) for (j = m - 1; j >= 0; j--) L[i][j] = A[i].toLowerCase() === B[j].toLowerCase() ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
    var out = [], da = [], db = []; i = 0; j = 0;
    function flush() { if (da.length || db.length) out.push([da.join(' '), db.join(' ')]); da = []; db = []; }
    while (i < n || j < m) {
      if (i < n && j < m && A[i].toLowerCase() === B[j].toLowerCase()) { flush(); i++; j++; }
      else if (j < m && (i >= n || L[i][j + 1] >= L[i + 1][j])) db.push(B[j++]);
      else da.push(A[i++]);
    }
    flush();
    return out;
  }
  function expandChanges(list) { var out = []; list.forEach(function (c) { if (c.from && c.to && c.from.split(/\s+/).length > 4) wordDiff(c.from, c.to).forEach(function (d) { out.push({ from: d[0] || '…', to: d[1], why: c.why }); }); else out.push(c); }); return out; }
  JNZX._expand = expandChanges;
  function cleanChanges(list) {
    var out = [];
    list.forEach(function (c) {
      if (!c.from || /tidied|Capitalise “I”|space|Space|exclamation|question mark|capital letter/i.test(c.why)) return;
      if (c.from.split(/\s+/).length > 4 && c.to) wordDiff(c.from, c.to).forEach(function (d) { if (d[0] || d[1]) out.push({ from: d[0] || '…', to: d[1], why: c.why }); });
      else out.push(c);
    });
    return out;
  }
  function correctReply(src, explicit) {
    var f = fixText(src, 'improve'), ch = cleanChanges(f.changes);
    if (!ch.length && !explicit) return null;
    if (!ch.length) return { text: '✅ That looks right to me!' + (f.tips.length ? '\n\n💡 ' + f.tips.slice(0, 2).join('\n💡 ') : '') };
    return { text: '✏️ Here’s a corrected version:\n\n“' + f.text + '”\n\nWhat I changed:\n' + ch.slice(0, 8).map(function (c) { return '• ' + (c.from === '…' ? 'added “' + c.to + '”' : !c.to ? 'removed “' + c.from + '”' : c.from + ' → ' + c.to) + ' (' + c.why + ')'; }).join('\n') + (f.tips.length ? '\n\n💡 ' + f.tips[0] : ''), write: 'fix' };
  }
  function reply(q, n) {
    var s = q.trim(), low = s.toLowerCase();
    var ex = s.match(/^(?:please\s+)?(?:can you\s+)?(?:correct|check|fix|proofread|improve|edit)(?:\s+(?:this|my|the))?(?:\s+(?:sentence|sentences|writing|text|grammar|spelling|email|paragraph|essay|message))?(?:\s+please)?\s*[:\-–—]\s*([\s\S]+)$/i) || s.match(/^["“](.+)["”]\s*(?:is (?:this|it) (?:correct|right)\??)?$/i) || s.match(/^is (?:this|it) (?:correct|right)\??\s*[:\-–—]?\s*["“]?(.+?)["”]?$/i);
    if (ex && ex[1] && ex[1].trim().split(/\s+/).length >= 2) return correctReply(ex[1].trim(), true);
    if (/^(what|how|when|which|explain|difference|help)|\?$|grammar|rule|tips?\b/.test(low)) { for (var i = 0; i < HELP.length; i++) if (HELP[i][0].test(low) && /(what|how|when|which|explain|difference|rule|use|tips?|help|vs|or\b|\?)/.test(low)) return { text: '📘 ' + HELP[i][1] + '\n\n' + HELP[i][2] + '\n\nWant me to check a sentence? Type “correct:” and then your sentence.', write: /ielts|cambridge|nzcel|b2|c1|c2/.test(low) ? 'exam' : undefined }; }
    if (/ielts|cambridge|b2 first|c1 advanced|c2 proficiency|nzcel|exam practice|practice test|mock exam/.test(low)) return { text: '🎓 Let’s practise! I have timed writing tasks for IELTS (Academic & General), Cambridge B2 First, C1 Advanced, C2 Proficiency and NZCEL, plus speaking cue cards. I’ll count your words and give you a practice score with tips.', write: 'exam' };
    var nWords = s.split(/\s+/).length;
    var isRequest = nWords < 14 && /^(tell|give|share|show|send me|make|write|help|can you|could you|would you|will you|please|i need|i want|i would like|i'd like|i’d like|any|a |an |what|how|why|who|where|when|is there|do you|are you)\b/i.test(s) || /\?\s*$/.test(s) && nWords < 9 || /\bplease\.?\s*$/i.test(s) && nWords < 9;
    if (nWords >= 4 && !isRequest) {
      var crr = correctReply(s, false);
      if (crr) { var md = moodOf(s); if (md !== 'everyday') crr.text = (md === 'calm' ? '💛 That sounds like a lot — be gentle with yourself.\n\n' : md === 'grief' ? '💛 I’m so sorry. I’m here with you.\n\n' : md === 'healing' ? '💛 Sending you care.\n\n' : md === 'thanks' ? '😊 I love that!\n\n' : '') + crr.text; return crr; }
    }
    if ((isRequest || nWords < 4) && /write|email|letter|essay|grammar|spell|proofread|check my|fix my|word(ing)?|message to|card/.test(low)) return { text: 'I’d love to help you write. Tap below and I’ll fix your text or start a draft for you. Tip: you can also type “correct:” and your sentence right here.', write: /fix|check|proofread|grammar|spell/.test(low) ? 'fix' : 'draft' };
    if (GREET.test(s) && nWords <= 4) return { text: 'Kia ora! I’m Mateo. I can share a little hope, a quiet prayer, a coffee thought — or help you write something. What would you like?' };
    if (/^(thanks|thank you|cheers|ta)\b/i.test(s)) return { text: 'You’re very welcome. I’m always here for a little kindness.' };
    if (/\btime\b/.test(low) && /what/.test(low)) return { text: 'In New Zealand it’s ' + new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', hour: 'numeric', minute: '2-digit' }).format(new Date()) + '.' };
    if (/\b(date|day is it|today)\b/.test(low) && /what/.test(low)) return { text: 'In New Zealand it’s ' + new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }).format(new Date()) + '.' };
    if (/coffee|cuppa|latte|flat white|tea\b|break/.test(low) && (isRequest || nWords < 6)) return { text: '☕ Coffee thought: ' + pick(COFFEE, n) + '\n\nNow sit for a minute — you’ve earned it.' };
    if (/joke|funny|laugh/.test(low) && (isRequest || nWords < 6)) return { text: pick(['Why did the kiwi cross the road? To prove it wasn’t chicken. 🥝', 'I told my coffee a joke. It didn’t laugh — it was too bitter.', 'What do you call a sheep with no legs? A cloud. ☁️'], n) };
    var mood = moodOf(s), base = (messages && messages[mood]) || { quotes: [], prayer: '' };
    if (/pray|prayer|amen|bless/.test(low) && (isRequest || nWords < 8)) return { text: '🙏 Here’s a short prayer you can make your own:\n\n' + (base.prayer || messages.everyday.prayer) };
    if (mood === 'everyday' && s.split(/\s+/).length >= 3 && !GREET.test(s)) { var cr = correctReply(s, false); if (cr) return cr; }
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
    useEffect(function () { loadWords(); }, []);
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
        h('div', null, h('h1', null, 'Ask Mateo'), h('p', null, 'A little kindness, help with writing, grammar and exam English.')),
        h('div', { className: 'jx-mateo-switch', role: 'tablist', 'aria-label': 'Choose' },
          h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'chat', className: view === 'chat' ? 'is-on' : '', onClick: function () { setView('chat'); } }, '💬 Chat'),
          h('button', { type: 'button', role: 'tab', 'aria-selected': view === 'write', className: view === 'write' ? 'is-on' : '', onClick: function () { openWrite(wway); } }, '✍️ Write'))),
      view === 'chat' ? h('div', { className: 'jx-mateo-chat' },
        h('div', { className: 'jx-mateo-log', role: 'log', 'aria-live': 'polite' },
          h('div', { className: 'jx-bub mateo' }, 'Kia ora! Tap an idea or type to me. To check your English, type “correct:” and your sentence — or ask me a grammar question like “since or for?”'),
          msgs.map(function (m, i) {
            return h('div', { key: i, className: 'jx-bub ' + m.who },
              m.text,
              m.who === 'mateo' && h('span', { className: 'jx-bub-tools' },
                m.write && h('button', { type: 'button', className: 'primary', onClick: function () { openWrite(m.write); } }, m.write === 'exam' ? '🎓 Open exam practice' : '✍️ Open writing help'),
                canSpeak && h('button', { type: 'button', className: 'jx-bub-btn', 'aria-label': 'Listen', onClick: function () { speak(m.text); } }, '🔊'),
                h('button', { type: 'button', className: 'jx-bub-btn', 'aria-label': 'Copy', onClick: function () { copyText(m.text, function () {}); } }, '📋')));
          }),
          h('div', { ref: end })),
        h('div', { className: 'jx-mateo-ideas' },
          IDEAS.map(function (x) { return h('button', { key: x[1], type: 'button', onClick: function () { say(x[2]); } }, x[0] + ' ' + x[1]); }),
          h('button', { type: 'button', className: 'is-write', onClick: function () { openWrite('fix'); } }, '✍️ Help me write'),
          h('button', { type: 'button', className: 'is-write', onClick: function () { openWrite('exam'); } }, '🎓 Exam practice')),
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
