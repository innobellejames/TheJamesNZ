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
    'email', 'order', 'book', 'pick', 'join', 'turn', 'show', 'follow', 'save', 'invite', 'attend', 'receive', 'explain', 'prepare', 'complete', 'return', 'check', 'park', 'rest', 'relax', 'hug', 'worry', 'tidy'];
  var VERB = {};
  function regForms(b) {
    var third = /(s|sh|ch|x|z|o)$/.test(b) ? b + 'es' : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + 'ies' : b + 's';
    var dbl = /^(stop|plan|shop|drop|hug|travel)$/.test(b);
    var past = /e$/.test(b) ? b + 'd' : /[^aeiou]y$/.test(b) ? b.slice(0, -1) + 'ied' : dbl ? b + b.slice(-1) + 'ed' : b + 'ed';
    var ing = /ie$/.test(b) ? b.slice(0, -2) + 'ying' : /[^e]e$/.test(b) && !/(see|agree)$/.test(b) ? b.slice(0, -1) + 'ing' : dbl ? b + b.slice(-1) + 'ing' : b + 'ing';
    return [third, past, ing, past];
  }
  Object.keys(IRR).forEach(function (b) { VERB[b] = IRR[b]; });
  REG.forEach(function (b) { VERB[b] = regForms(b); });
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

  var GRAM = [
    // spelling first
    [/\b([A-Za-z]+)\b/g, function (m, w) { var k = w.toLowerCase(); if (!Object.prototype.hasOwnProperty.call(MISSPELL, k) || MISSPELL[k] === null) return m; if (k === 'u' && w === 'U') return m; return keepCase(w, MISSPELL[k]); }, 'Spelling'],
    [/\bi\b/g, 'I', 'Capitalise “I”'],
    [/\b(could|would|should|must|might) of\b/gi, function (m, a) { return a + ' have'; }, '“have”, not “of”'],
    [/\b(dont|doesnt|didnt|cant|wont|isnt|wasnt|arent|werent|havent|hasnt|hadnt|couldnt|wouldnt|shouldnt)\b/gi, function (m) { var x = m.toLowerCase(); var o = x === 'cant' ? 'can’t' : x === 'wont' ? 'won’t' : x.slice(0, -2) + 'n’t'; return keepCase(m, o); }, 'Missing apostrophe'],
    // be
    [/\bI (is|are)\b/g, 'I am', 'Use “I am”'],
    [/\bI (was|were) (\w+)/g, function (m, a, b) { return a === 'were' && !/^(to|if)$/.test(b) ? 'I was ' + b : m; }, 'Use “I was”'],
    [new RegExp('\\b(' + PLUR + ') (is|was)\\b', 'gi'), function (m, s, v) { return s + ' ' + (v.toLowerCase() === 'is' ? 'are' : 'were'); }, 'Plural subject: use “are/were”'],
    [new RegExp('\\b(' + SING + ') (are|were)\\b', 'gi'), function (m, s, v) { return s + ' ' + (v.toLowerCase() === 'are' ? 'is' : 'was'); }, 'Singular subject: use “is/was”'],
    [/\b(there|There) is (many|several|two|three|four|five|lots of|a lot of|some people|people)\b/g, function (m, t, n) { return t + ' are ' + n; }, 'Use “there are” with plurals'],
    [/\b(there|There) was (many|several|two|three|four|five|lots of|a lot of)\b/g, function (m, t, n) { return t + ' were ' + n; }, 'Use “there were” with plurals'],
    // have / do agreement
    [new RegExp('\\b(' + SING + ') (have|do|don’t|don\'t)\\b', 'gi'), function (m, s, v) { var x = v.toLowerCase(); return s + ' ' + (x === 'have' ? 'has' : x === 'do' ? 'does' : 'doesn’t'); }, 'Singular subject: “has/does/doesn’t”'],
    [new RegExp('\\b(I|' + PLUR + ') (has|does|doesn’t|doesn\'t)\\b', 'g'), function (m, s, v) { var x = v.toLowerCase(); return s + ' ' + (x === 'has' ? 'have' : x === 'does' ? 'do' : 'don’t'); }, 'Use “have/do/don’t” here'],
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
      function (m, s, v) { var b = v.toLowerCase(); if (!VERB[b] || /^(let|put|cut|hit|set|cost|shut|read)$/.test(b) && false) return m; return s + ' ' + VERB[b][0]; }, 'Add “s”: he/she/it goes'],
    [/\b(I|you|we|they) (goes|does|has|says|wants|likes|needs|makes|takes|gets|comes|loves|lives|works|plays|thinks|knows)\b/g, function (m, s, v) { return s + ' ' + base(v); }, 'Drop the “s” here'],
    [/\b(have|has|had|haven’t|hasn’t|hadn’t|I’ve|you’ve|we’ve|they’ve|he’s|she’s) (went|did|saw|ate|wrote|took|gave|came|ran|began|drank|spoke|broke|chose|drove|flew|forgot|knew|rode|sang|swam|threw|wore|woke|grew|fell|stole|hid|bit|blew|froze|shook|forgave)\b/gi, function (m, a, v) { return a + ' ' + VERB[FORM[v.toLowerCase()]][3]; }, 'Use the past participle (have gone, has eaten)'],
    [/\b(I|we|they|you|he|she) (seen|done)\b(?! by)/g, function (m, s, v) { return s + ' ' + (v === 'seen' ? 'saw' : 'did'); }, 'Use “saw/did” (or “have seen/done”)'],
    [/\b(peoples|childrens|womens|mens|sheeps|fishes)\b/gi, function (m) { return keepCase(m, { peoples: 'people', childrens: 'children', womens: 'women', mens: 'men', sheeps: 'sheep', fishes: 'fish' }[m.toLowerCase()]); }, 'Already plural'],
    [/\b(plays?|played|sings?|sang|speaks?|spoke|writes?|wrote|cooks?|cooked|works?|worked|runs?|ran|swims?|swam|dances?|danced|draws?|drew|did|does|do|drives?|drove|reads?) (\w+ )?(very |really |so )?good\b/gi, function (m, v, o, adv) { return v + ' ' + (o || '') + (adv || '') + 'well'; }, 'Use “well” to describe how you do something'],
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
    [/\byour (welcome|right|wrong|going|coming|doing|not|very|so|the best|amazing|late|early)\b/gi, function (m, a) { return keepCase(m, 'you’re') + ' ' + a; }, 'Did you mean “you’re”?'],
    [/\bits (a|an|the|been|not|going|very|so|time|important|raining|hard|easy|ok|okay|fine)\b/gi, function (m, a) { return keepCase(m, 'it’s') + ' ' + a; }, 'Use “it’s” for “it is”'],
    [/\b(more|less|better|worse|bigger|smaller|faster|slower|rather|other|older|younger|taller) then\b/gi, function (m, a) { return a + ' than'; }, 'Use “than” for comparisons'],
    [/\bloose (weight|track|touch|my|your|the game|it)\b/gi, function (m, a) { return keepCase(m, 'lose') + ' ' + a; }, '“lose”, not “loose”'],
    [/\bless (people|children|kids|cars|books|friends|mistakes|things)\b/gi, function (m, n) { return keepCase(m, 'fewer') + ' ' + n; }, 'Use “fewer” with countable nouns'],
    [/\b(discuss|discussed|discussing) about\b/gi, function (m, a) { return a; }, 'No “about” after discuss'],
    [/\b(return|returned) back\b/gi, function (m, a) { return a; }, '“return” already means go back'],
    [/\b(repeat|repeated) again\b/gi, function (m, a) { return a; }, '“repeat” already means again'],
    [/\b(Me|me) and (my \w+|him|her|them|\w+) (\w+)\b/g, function (m, me, o, v) { var low = v.toLowerCase(); if (!FORM[low] && !/^(are|were|will|can|could|would|should)$/.test(low)) return m; var vv = low === 'is' ? 'are' : low === 'was' ? 'were' : FORM[low] && FORM[low] !== 'be' && VERB[FORM[low]][0] === low ? FORM[low] : v; var who = { him: 'he', her: 'she', them: 'they' }[o.toLowerCase()] || o; return keepCase(me, who) + ' and I ' + vv; }, 'Say “… and I”'],
    [/\bbetween you and I\b/gi, 'between you and me', 'Say “between you and me”'],
    [/\b(\w+) \1\b/gi, function (m, a) { return /^(that|had)$/i.test(a) ? m : a; }, 'Repeated word'],
    // more word choice
    [/\b(its|it’s|it's) (to|too) (\w+)/gi, function (m, a, t, w) { return keepCase(a, 'it’s') + ' too ' + w; }, 'Say “it’s too …”'],
    [/\bto (much|many|late|early|big|small|hot|cold|expensive|cheap|hard|easy|far|long|fast|slow|soon|bad|good|busy|tired|young|old|loud|quiet|heavy|sweet|spicy)\b(?! (to|for) \w+ing)/gi, function (m, w) { return keepCase(m, 'too') + ' ' + w; }, 'Use “too” (meaning “very/also”)'],
    [/\b(me|you|us|him|her|them|it) to([.!?,]|$)/gi, function (m, a, p) { return a + ' too' + p; }, 'Use “too” (meaning “also”)'],
    [/\b(can|could|will|would|should|do|does|did|shall|may|must) (you|I|we|they|he|she|it|someone|anyone) (\w+)\b/gi, function (m, mod, s, v) { var b = FORM[v.toLowerCase()]; if (!b || b === 'be' || b === v.toLowerCase()) return m; if (VERB[b][2] === v.toLowerCase()) return m; return mod + ' ' + s + ' ' + b; }, 'Use the base verb in questions'],
    [new RegExp('\\b(a lot of|lots of|plenty of|some of the|all the|all of the|many of the) (' + alt(NOUNS) + ')\\b', 'gi'), function (m, q, w) { return q + ' ' + plural(w.toLowerCase()); }, 'Use the plural'],
    [/\beveryday(?=\s*([.!?,;]|$|and\b|at\b|in\b|for\b|after\b|before\b|with\b|to\b|until\b))/gi, function (m) { return keepCase(m, 'every day'); }, '“every day” (two words) means each day'],
    [/\b(who’s|who's) (car|house|book|bag|phone|turn|idea|dog|kids|children|job)\b/gi, function (m, a, n) { return keepCase(a, 'whose') + ' ' + n; }, 'Use “whose” for belonging'],
    [/\bwhose (going|coming|there|that|this|ready|next)\b/gi, function (m, n) { return keepCase(m, 'who’s') + ' ' + n; }, 'Use “who’s” (who is)'],
    [/\b(we|you|they) where\b/gi, function (m, a) { return a + ' were'; }, 'Use “were”'],
    [/\bwere (is|are|was|do|did|can|should)\b/gi, function (m, a) { return keepCase(m, 'where') + ' ' + a; }, 'Use “where” for places'],
    [/\bcould care less\b/gi, 'couldn’t care less', 'Say “couldn’t care less”'],
    [/\b(monday|tuesday|wednesday|thursday|friday|saturday|sunday|january|february|march|april|june|july|august|september|october|november|december|christmas|easter|matariki|new zealand|aotearoa|auckland|wellington|christchurch|hamilton|tauranga|dunedin|english|maori|māori|god|jesus|mary|sunday school)\b/g, function (m) { if (m === 'march' || m === 'may') return m; if (m === 'maori') return 'Māori'; return m.replace(/(^|\s)\w/g, function (c) { return c.toUpperCase(); }); }, 'Capital letter for names, days and months'],
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
    if (!PAST_MARK.test(sentence) || /\b(will|going to|tomorrow|next)\b/i.test(sentence)) return sentence;
    return sentence.replace(PSUBJ, function (m, s, v) {
      var low = v.toLowerCase(), b = FORM[low];
      if (/^(am|is|are)$/.test(low)) return m.slice(0, m.length - v.length) + keepCase(v, (/^(I|he|she|it)$/i.test(s) || /^(my|the) /i.test(s) && !/s$/.test(s) ? 'was' : 'were'));
      if (!b || b === 'be') return m;
      if (low !== b && low !== VERB[b][0]) return m; // already past or another form
      return m.slice(0, m.length - v.length) + keepCase(v, VERB[b][1]);
    });
  }
  function pastAnd(sentence) {
    if (!PAST_MARK.test(sentence) || /\b(will|going to|tomorrow|next)\b/i.test(sentence)) return sentence;
    return sentence.replace(/\b(and|then|but|so) (also |then )?(\w+)\b/gi, function (m, c, adv, v) {
      var low = v.toLowerCase(), b = FORM[low]; if (!b || b === 'be') return m;
      if (low !== b && low !== VERB[b][0]) return m;
      if (/^(I|you|we|they|he|she|it|the|a|my|your|our|their|his|her)$/i.test(v)) return m;
      return c + ' ' + (adv || '') + keepCase(v, VERB[b][1]);
    });
  }
  function grammarFix(text) {
    var cur = text.replace(/(\w)'(\w)/g, '$1’$2'), changes = [];
    for (var pass = 0; pass < 2; pass++) {
      GRAM.forEach(function (r) {
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
    cur = cur.split(/(?<=[.!?])\s+/).map(function (s) { var o = pastAnd(pastTense(s)); if (o !== s) changes.push({ from: s.slice(0, 60), to: o.slice(0, 60), why: 'Past time: use the past tense' }); return o; }).join(' ');
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
  function tidy(text) {
    var t = text.replace(/[ \t]+\n/g, '\n').replace(/^\s+|\s+$/g, '');
    t = t.replace(/(^|[.!?]\s+|\n\s*)([a-z])/g, function (m, a, b) { return a + b.toUpperCase(); });
    t = t.replace(/\s+([,.;:!?])/g, '$1');
    // questions end with a question mark
    t = t.replace(/(^|[.!?]\s+|\n)((?:Can|Could|Would|Will|Do|Does|Did|Is|Are|Was|Were|What|Why|How|Where|When|Who|Which|Shall|Should|Have|Has|May)\b[^.!?\n]*)([.]|(?=\n)|$)/g, function (m, a, q, p) { if (/^How (lovely|nice|great|wonderful|kind|sweet|beautiful)\b/.test(q)) return m; return a + q.replace(/\s+$/, '') + '?'; });
    if (t && !/[.!?…:"”)]$/.test(t) && !/\n/.test(t.slice(-40))) t += '.';
    return t;
  }
  function fixText(text, mode) {
    var g = grammarFix(text);
    var cur = g.text, changes = g.changes.slice(), tips = [], seenTip = {};
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
  JNZX.WriteBuddy = WriteBuddy; JNZX._grammar = grammarFix; JNZX._fix = fixText;
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
