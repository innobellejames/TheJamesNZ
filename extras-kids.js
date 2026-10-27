/* The James NZ — Learning › Little Learners (October 2026):
   age-appropriate options and a Focus Games arcade with 53 games. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef, Frag = R.Fragment;
  function rnd(n) { return Math.floor(Math.random() * n); }
  function pick(a) { return a[rnd(a.length)]; }
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = rnd(i + 1), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function sample(a, n) { return shuffle(a).slice(0, n); }
  function E(s) { return Array.from(s.replace(/\s/g, '')).reduce(function (out, ch) { if (/[️‍]/.test(ch) && out.length) out[out.length - 1] += ch; else out.push(ch); return out; }, []); }

  var AGES = [['2-3', 'Toddlers', '2–3 years', 2, 3], ['3-5', 'Preschool', '3–5 years', 3, 5], ['5-6', 'New entrants', '5–6 years', 5, 6], ['6-8', 'Juniors', '6–8 years', 6, 8], ['8-10', 'Middle', '8–10 years', 8, 10], ['10-12', 'Seniors', '10–12 years', 10, 12]];
  var GUIDE = {
    '2-3': { focus: 'Play in short bursts of 2–5 minutes, side by side with a grown-up.', learn: ['Name colours, animals and body parts', 'Count 1 to 5 with fingers and toys', 'Big crayons and scribbling', 'Simple matching (4 memory cards)', 'Songs, rhymes and actions'], topics: 'Counting · Colouring · Focus games', screen: 'Screen time isn’t recommended for children under two; from two to five, keep it under an hour a day and share it with them.' },
    '3-5': { focus: 'Aim for 5–10 minutes, then move or play outside.', learn: ['First letter sounds: s, a, t, p, i, n', 'Count to 10, then 20', 'Cutting straight lines with child-safe scissors', 'Odd-one-out and simple patterns', 'Memory games with 6–8 cards'], topics: 'Phonics · Counting · Cutting · Crafts · Colouring · Focus games', screen: 'Keep screen time under an hour a day, and choose slow, interactive activities.' },
    '5-6': { focus: '10 minutes of focus, then a movement break.', learn: ['Blend three-letter words (c-a-t)', 'First sight words (the, and, is)', 'Numbers to 50; adding within 10', 'Patterns and sorting', 'Memory with 8–12 cards'], topics: 'Phonics · Sight words · Counting · Easy maths · Focus games', screen: 'For 5 to 17 year olds, guidelines suggest less than two hours of recreational screen time a day.' },
    '6-8': { focus: '10–15 minutes, with a clear goal (“beat your best time”).', learn: ['Read short books aloud', 'More sight words and spelling patterns', 'Add and subtract within 20', 'Number grids (find 1 to 9)', 'Longer memory sequences'], topics: 'Sight words · Easy maths · Step-by-step practice · Focus games', screen: 'Less than two hours of recreational screen time a day, and screens off an hour before bed.' },
    '8-10': { focus: '15–20 minutes; let them set their own challenge.', learn: ['Times tables', 'Reading chapter books', 'Number grids to 16', 'Colour–word challenges (attention control)', '16-card memory'], topics: 'Easy maths · Step-by-step practice · Focus games', screen: 'Less than two hours of recreational screen time a day. Balance with sport, outdoor play and sleep.' },
    '10-12': { focus: '20 minutes; mix fast games with calm breathing.', learn: ['Mental maths strategies', 'Reading for pleasure and research', 'Number grids to 25', 'Fast Stroop and reaction games', 'Breathing to reset focus'], topics: 'Step-by-step practice · Focus games', screen: 'Less than two hours of recreational screen time a day, plus plenty of movement and 9–11 hours of sleep.' }
  };

  var T = {
    animals: E('🐶🐱🐭🐹🐰🦊🐻🐼🐨🐯🦁🐮🐷🐸🐵'), fruit: E('🍎🍐🍊🍋🍌🍉🍇🍓🫐🍒🍑🥭🍍🥝'), vehicles: E('🚗🚕🚙🚌🚎🚓🚑🚒🚐🚚🚜🚲🛵🚂'),
    faces: E('😀😃😄😁😆😊🙂😉😍😎🤓😮😴🤔'), shapes: E('🔴🟠🟡🟢🔵🟣🟤⚫⚪🟥🟧🟨🟩🟦🟪'), nz: E('🥝🐑🏉🌿🐧🌋🏔️🌊🐟🛶🦭🐋🌲🐚'),
    weather: E('☀️🌤️⛅🌥️☁️🌦️🌧️⛈️🌩️🌨️❄️🌈💨'), sports: E('⚽🏀🏈⚾🎾🏐🏉🏓🏸🥅🏒🏑🥏🏏'), ocean: E('🐟🐠🐡🦈🐙🦑🦀🦞🦐🐚🐬🐳🐋🦭'),
    bugs: E('🐝🐞🦋🐛🐜🪲🦗🕷️🐌🪳🦟🪰'), space: E('🌍🌙⭐🌟☀️🪐☄️🚀🛸🌌👽🔭🌠🌑'), garden: E('🌻🌷🌹🌼🌸🪴🌱🌿🍀🌵🌳🍄🪻💐'),
    veg: E('🥕🥦🥬🥒🌽🧅🧄🥔🍆🫑🫛🍠'), land: E('🐶🐱🐮🐷🐑🐴🦒🐘🦁🐯🐻🐰🦊🦌'), hot: E('☀️🔥🌶️☕🍲🌋🏜️🫖🧯♨️'), cold: E('❄️⛄🧊🍦🏔️🧤🥶🐧🌨️🧣'),
    day: E('☀️🌤️🌻🐓🏖️🌈🪁🌞🏫'), night: E('🌙⭐🦉🌌🛌🌃🦇🌠🌛'), birds: E('🐦🐧🦆🦅🦉🦜🕊️🦢🐓🦩🦚')
  };
  var COLOURS = [['RED', '#d62828'], ['BLUE', '#1d63d8'], ['GREEN', '#1f9a4a'], ['YELLOW', '#e0a800'], ['PURPLE', '#7b3fbf'], ['ORANGE', '#ef7d00']];
  var NUMWORDS = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen', 'twenty'];
  var FIRSTL = [['🍎', 'A'], ['🐝', 'B'], ['🐱', 'C'], ['🐶', 'D'], ['🥚', 'E'], ['🐟', 'F'], ['🍇', 'G'], ['🏠', 'H'], ['🍦', 'I'], ['🧃', 'J'], ['🥝', 'K'], ['🦁', 'L'], ['🌙', 'M'], ['👃', 'N'], ['🐙', 'O'], ['🐧', 'P'], ['👑', 'Q'], ['🌈', 'R'], ['☀️', 'S'], ['🐯', 'T'], ['☂️', 'U'], ['🎻', 'V'], ['🐋', 'W'], ['🦊', 'F'], ['🪀', 'Y'], ['🦓', 'Z']];

  /* -------- question generators (lv: 0 easy, 1 medium, 2 hard) -------- */
  function gOdd(theme) { return function (lv) { var n = [9, 16, 25][lv], cols = Math.sqrt(n), two = sample(T[theme], 2), ans = rnd(n); return { prompt: 'Tap the one that is different', cells: Array.from({ length: n }, function (_, i) { return i === ans ? two[1] : two[0]; }), cols: cols, answer: ans }; }; }
  function gFind(target, crowd) { return function (lv) { var n = [16, 25, 36][lv], ans = rnd(n), pool = T[crowd].filter(function (x) { return x !== target; }); return { prompt: 'Find the ' + target, cells: Array.from({ length: n }, function (_, i) { return i === ans ? target : pick(pool); }), cols: Math.sqrt(n), answer: ans }; }; }
  function gCount(target, theme) { return function (lv) { var k = 2 + rnd([5, 8, 11][lv]), n = [12, 16, 20][lv], cells = shuffle(Array.from({ length: n }, function (_, i) { return i < k ? target : pick(T[theme].filter(function (x) { return x !== target; })); })), opts = shuffle([k, k + 1, Math.max(1, k - 1), k + 2].filter(function (v, i, a) { return a.indexOf(v) === i; })); return { prompt: 'How many ' + target + '?', show: cells, cols: 4, options: opts, answer: k }; }; }
  function gStroop(mode) { return function () { var w = pick(COLOURS), ink = pick(COLOURS.filter(function (c) { return c !== w; })), ask = mode === 'mix' && Math.random() < 0.5 ? 'word' : 'colour'; var others = sample(COLOURS.filter(function (c) { return c !== w && c !== ink; }), 2); return { prompt: ask === 'colour' ? 'Tap the COLOUR of the ink' : 'Tap what the WORD says', big: w[0], bigColor: ink[1], options: shuffle([w, ink].concat(others)).map(function (c) { return c[0]; }), answer: ask === 'colour' ? ink[0] : w[0] }; }; }
  function gPattern(kind) {
    return function (lv) {
      var a = sample(T.shapes.concat(T.fruit), 3), seq, ans;
      if (kind === 'ab') { seq = [a[0], a[1], a[0], a[1], a[0]]; ans = a[1]; }
      else if (kind === 'abc') { seq = [a[0], a[1], a[2], a[0], a[1]]; ans = a[2]; }
      else if (kind === 'aab') { seq = [a[0], a[0], a[1], a[0], a[0]]; ans = a[1]; }
      else { var st = 1 + rnd(5), step = [1, 2, 3 + rnd(3)][lv]; seq = [0, 1, 2, 3].map(function (i) { return String(st + i * step); }); ans = String(st + 4 * step); return { prompt: 'What number comes next?', big: seq.join('  ') + '  ?', options: shuffle([ans, String(+ans + 1), String(+ans - 1), String(+ans + step)].filter(function (v, i, x) { return x.indexOf(v) === i; })), answer: ans }; }
      return { prompt: 'What comes next?', big: seq.join(' ') + ' ❓', options: shuffle(a.slice(0, kind === 'abc' ? 3 : 2).concat([pick(T.animals)])), answer: ans };
    };
  }
  function gSame(len) { return function () { var a = sample(T.animals.concat(T.fruit), len), b = a.slice(), same = Math.random() < 0.5; if (!same) { var i = rnd(len); b[i] = pick(T.animals.filter(function (x) { return a.indexOf(x) < 0; })); } return { prompt: 'Are these the same?', big: a.join(' ') + '\n' + b.join(' '), options: ['Same', 'Different'], answer: same ? 'Same' : 'Different' }; }; }
  function gCase() { return function () { var L = String.fromCharCode(65 + rnd(26)), opts = shuffle([L.toLowerCase()].concat(sample('abcdefghijklmnopqrstuvwxyz'.split('').filter(function (x) { return x !== L.toLowerCase(); }), 3))); return { prompt: 'Find the small letter for', big: L, options: opts, answer: L.toLowerCase() }; }; }
  function gNumWord() { return function (lv) { var max = [5, 10, 20][lv], n = 1 + rnd(max), opts = shuffle([NUMWORDS[n]].concat(sample(NUMWORDS.slice(1, max + 1).filter(function (w) { return w !== NUMWORDS[n]; }), 3))); return { prompt: 'Which word matches the number?', big: String(n), options: opts, answer: NUMWORDS[n] }; }; }
  function gFirst() { return function () { var p = pick(FIRSTL), opts = shuffle([p[1]].concat(sample('ABCDEFGHIJKLMNOPRSTW'.split('').filter(function (x) { return x !== p[1]; }), 3))); return { prompt: 'Which letter does it start with?', big: p[0], options: opts, answer: p[1] }; }; }
  function gSort(a, b, la, lb) { return function () { var isA = Math.random() < 0.5, item = pick(isA ? T[a] : T[b]); return { prompt: 'Sort it!', big: item, options: [la, lb], answer: isA ? la : lb }; }; }

  var G = [];
  function add(id, name, emoji, kind, skill, ages, opt) { G.push(Object.assign({ id: id, name: name, emoji: emoji, kind: kind, skill: skill, ages: ages }, opt || {})); }
  [['animals', 'Animals', '🐶'], ['fruit', 'Fruit', '🍎'], ['vehicles', 'Vehicles', '🚗'], ['faces', 'Funny faces', '😀'], ['shapes', 'Colour dots', '🔵'], ['nz', 'Kiwi icons', '🥝'], ['weather', 'Weather', '⛅'], ['sports', 'Sports', '⚽'], ['ocean', 'Ocean', '🐠'], ['bugs', 'Bugs', '🐞']].forEach(function (t) { add('odd-' + t[0], 'Odd one out: ' + t[1], t[2], 'quiz', 'Attention', [3, 12], { gen: gOdd(t[0]) }); });
  [['animals', 'Animal pairs', '🐼'], ['fruit', 'Fruit pairs', '🍓'], ['space', 'Space pairs', '🚀'], ['ocean', 'Ocean pairs', '🐬'], ['nz', 'Kiwi pairs', '🥝'], ['vehicles', 'Transport pairs', '🚌'], ['sports', 'Sport pairs', '🏉'], ['garden', 'Garden pairs', '🌻']].forEach(function (t) { add('mem-' + t[0], t[1], t[2], 'memory', 'Memory', [2, 12], { theme: t[0] }); });
  add('simon-colours', 'Copy the colours', '🟢', 'simon', 'Memory', [4, 12], { pads: ['#1f9a4a', '#d62828', '#e0a800', '#1d63d8'], labels: ['', '', '', ''] });
  add('simon-animals', 'Copy the animals', '🐸', 'simon', 'Memory', [3, 10], { pads: ['#e9f7ef', '#fdecea', '#fff6d6', '#e8f0ff'], labels: ['🐸', '🐷', '🐥', '🐳'] });
  add('simon-numbers', 'Remember the numbers', '🔢', 'digits', 'Memory', [6, 12]);
  add('schulte-3', 'Number hunt 1–9', '9️⃣', 'schulte', 'Speed', [5, 9], { size: 3 });
  add('schulte-4', 'Number hunt 1–16', '🔟', 'schulte', 'Speed', [7, 12], { size: 4 });
  add('schulte-5', 'Number hunt 1–25', '🎯', 'schulte', 'Speed', [9, 12], { size: 5 });
  [['🍎', 'fruit', 'Count the apples'], ['⭐', 'space', 'Count the stars'], ['🐟', 'ocean', 'Count the fish'], ['🐑', 'land', 'Count the sheep'], ['🐞', 'bugs', 'Count the ladybirds']].forEach(function (t, i) { add('count-' + i, t[2], t[0], 'quiz', 'Counting', [3, 8], { gen: gCount(t[0], t[1]) }); });
  add('stroop', 'Colour clash', '🎨', 'quiz', 'Attention', [7, 12], { gen: gStroop('colour'), rounds: 15 });
  add('stroop-mix', 'Word or colour?', '🌈', 'quiz', 'Attention', [9, 12], { gen: gStroop('mix'), rounds: 15 });
  add('weta', 'Whack-a-wētā', '🦗', 'whack', 'Speed', [3, 12]);
  add('star', 'Catch the star', '⭐', 'catch', 'Speed', [3, 10]);
  add('green', 'Wait for green', '🟢', 'reaction', 'Self-control', [5, 12]);
  [['ab', 'Patterns: AB AB', '🔴'], ['abc', 'Patterns: ABC', '🔺'], ['aab', 'Patterns: AAB', '🟨'], ['num', 'Number patterns', '➕']].forEach(function (t) { add('pat-' + t[0], t[1], t[2], 'quiz', 'Patterns', t[0] === 'num' ? [6, 12] : [3, 9], { gen: gPattern(t[0]) }); });
  add('same-3', 'Same or different? (3)', '👀', 'quiz', 'Attention', [3, 7], { gen: gSame(3) });
  add('same-5', 'Same or different? (5)', '🔍', 'quiz', 'Attention', [6, 12], { gen: gSame(5) });
  add('case', 'Big letter, small letter', '🔤', 'quiz', 'Letters', [4, 7], { gen: gCase() });
  add('numword', 'Number words', '🔢', 'quiz', 'Counting', [5, 9], { gen: gNumWord() });
  add('first', 'First letter sounds', '🅰️', 'quiz', 'Letters', [4, 7], { gen: gFirst() });
  [['🥝', 'birds', 'Find the kiwi'], ['⭐', 'space', 'Find the star'], ['🏉', 'sports', 'Find the rugby ball'], ['🐧', 'birds', 'Find the penguin'], ['🌈', 'weather', 'Find the rainbow']].forEach(function (t, i) { add('find-' + i, t[2], t[0], 'quiz', 'Attention', [3, 10], { gen: gFind(t[0], t[1]) }); });
  add('breathe', 'Calm breathing star', '🌟', 'breathe', 'Calm', [2, 12]);
  add('sort-fv', 'Fruit or vegetable?', '🥕', 'quiz', 'Sorting', [3, 8], { gen: gSort('fruit', 'veg', 'Fruit', 'Vegetable'), rounds: 12 });
  add('sort-ls', 'Land or sea?', '🐳', 'quiz', 'Sorting', [3, 8], { gen: gSort('land', 'ocean', 'Land', 'Sea'), rounds: 12 });
  add('sort-hc', 'Hot or cold?', '🔥', 'quiz', 'Sorting', [3, 8], { gen: gSort('hot', 'cold', 'Hot', 'Cold'), rounds: 12 });
  add('sort-dn', 'Day or night?', '🌙', 'quiz', 'Sorting', [3, 8], { gen: gSort('day', 'night', 'Day', 'Night'), rounds: 12 });
  JNZX.focusGames = G;

  function lvFor(age) { var i = AGES.findIndex(function (a) { return a[0] === age; }); return i <= 1 ? 0 : i <= 3 ? 1 : 2; }
  function useBest(id) { var b = JNZX.useStored('jnzx-focus-best', {}), best = b[0], setBest = b[1]; return [best[id], function (v, lower) { var cur = best[id]; if (cur == null || (lower ? v < cur : v > cur)) { var o = Object.assign({}, best); o[id] = v; setBest(o); return true; } return false; }]; }
  function Done(props) {
    return h('div', { className: 'jx-game-done' }, h('p', { className: 'jx-big' }, props.big), props.sub && h('p', null, props.sub), props.record && h('p', { className: 'jx-party' }, '🏆 New best!'),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: props.again }, 'Play again'), h('button', { type: 'button', className: 'secondary', onClick: props.back }, 'All games')));
  }

  function Quiz(props) {
    var g = props.game, lv = props.lv, rounds = g.rounds || 10;
    var st = useState(function () { return { i: 0, score: 0, q: g.gen(lv), fb: '', t0: Date.now(), done: false }; }), s = st[0], set = st[1];
    var best = useBest(g.id);
    var rec = useRef(false);
    function answer(v) {
      if (s.fb) return;
      var ok = v === s.q.answer, score = s.score + (ok ? 1 : 0);
      set(Object.assign({}, s, { score: score, fb: ok ? 'yes' : 'no', chosen: v }));
      setTimeout(function () {
        if (s.i + 1 >= rounds) { var secs = Math.round((Date.now() - s.t0) / 1000); rec.current = best[1](score * 1000 - secs); set(Object.assign({}, s, { score: score, done: true, secs: secs })); }
        else set({ i: s.i + 1, score: score, q: g.gen(lv), fb: '', t0: s.t0, done: false });
      }, ok ? 450 : 900);
    }
    if (s.done) return h(Done, { big: s.score + ' / ' + rounds, sub: 'in ' + s.secs + ' seconds', record: rec.current, again: props.again, back: props.back });
    var q = s.q;
    return h('div', { className: 'jx-game-quiz' + (s.fb ? ' fb-' + s.fb : '') },
      h('p', { className: 'jx-muted' }, 'Round ' + (s.i + 1) + ' of ' + rounds + ' · Score ' + s.score),
      h('p', { className: 'jx-game-prompt' }, q.prompt),
      q.big && h('p', { className: 'jx-game-big', style: q.bigColor ? { color: q.bigColor } : null }, q.big),
      q.show && h('div', { className: 'jx-game-grid is-show', style: { gridTemplateColumns: 'repeat(' + q.cols + ',1fr)' } }, q.show.map(function (c, i) { return h('span', { key: i }, c); })),
      q.cells && h('div', { className: 'jx-game-grid', style: { gridTemplateColumns: 'repeat(' + q.cols + ',1fr)' } }, q.cells.map(function (c, i) { return h('button', { key: i, type: 'button', className: s.fb && i === q.answer ? 'is-answer' : '', onClick: function () { answer(i); } }, c); })),
      q.options && h('div', { className: 'jx-game-opts' }, q.options.map(function (o) { return h('button', { key: o, type: 'button', className: s.fb && o === q.answer ? 'is-answer' : s.fb && o === s.chosen ? 'is-wrong' : '', onClick: function () { answer(o); } }, o); })),
      h('p', { className: 'jx-game-fb', role: 'status' }, s.fb === 'yes' ? '✅ Ka pai!' : s.fb === 'no' ? '💛 Nearly — the answer is highlighted' : ''));
  }
  function Memory(props) {
    var g = props.game, pairs = [3, 4, 6, 6, 8, 8][Math.max(0, AGES.findIndex(function (a) { return a[0] === props.age; }))] || 6;
    var init = function () { return shuffle(sample(T[g.theme], pairs).reduce(function (a, e) { return a.concat([e, e]); }, [])).map(function (e, i) { return { e: e, id: i, up: false, done: false }; }); };
    var cs = useState(init), cards = cs[0], setCards = cs[1];
    var ms = useState(0), moves = ms[0], setMoves = ms[1];
    var t0 = useRef(Date.now()), lock = useRef(false), rec = useRef(false);
    var best = useBest(g.id + '-' + pairs);
    var done = cards.every(function (c) { return c.done; });
    var secs = useRef(0);
    function flip(c) {
      if (lock.current || c.up || c.done) return;
      var up = cards.filter(function (x) { return x.up && !x.done; });
      var next = cards.map(function (x) { return x.id === c.id ? Object.assign({}, x, { up: true }) : x; });
      setCards(next);
      if (up.length === 1) {
        setMoves(moves + 1);
        if (up[0].e === c.e) { setTimeout(function () { setCards(function (cur) { var n2 = cur.map(function (x) { return x.e === c.e ? Object.assign({}, x, { done: true }) : x; }); if (n2.every(function (x) { return x.done; })) { secs.current = Math.round((Date.now() - t0.current) / 1000); rec.current = best[1](moves + 1, true); } return n2; }); }, 250); }
        else { lock.current = true; setTimeout(function () { setCards(function (cur) { return cur.map(function (x) { return x.done ? x : Object.assign({}, x, { up: false }); }); }); lock.current = false; }, 850); }
      }
    }
    if (done) return h(Done, { big: moves + ' moves', sub: pairs + ' pairs in ' + secs.current + ' seconds', record: rec.current, again: props.again, back: props.back });
    var cols = pairs * 2 <= 6 ? 3 : pairs * 2 <= 8 ? 4 : 4;
    return h('div', null, h('p', { className: 'jx-muted' }, 'Find the pairs · ' + moves + ' moves' + (best[0] != null ? ' · best ' + best[0] : '')),
      h('div', { className: 'jx-game-grid jx-mem', style: { gridTemplateColumns: 'repeat(' + cols + ',1fr)' } }, cards.map(function (c) { return h('button', { key: c.id, type: 'button', className: (c.up || c.done ? 'is-up' : '') + (c.done ? ' is-done' : ''), 'aria-label': c.up || c.done ? c.e : 'Hidden card', onClick: function () { flip(c); } }, c.up || c.done ? c.e : '❔'); })));
  }
  function Simon(props) {
    var g = props.game, digits = g.kind === 'digits';
    var st = useState({ seq: [], show: -1, input: [], over: false, lit: -1, phase: 'ready' }), s = st[0], set = st[1];
    var best = useBest(g.id), rec = useRef(false);
    function play(seq) {
      set({ seq: seq, show: 0, input: [], over: false, lit: -1, phase: 'show' });
      seq.forEach(function (v, i) { setTimeout(function () { set(function (c) { return Object.assign({}, c, { lit: v, shownDigit: digits ? v : null }); }); }, 700 * i + 400); setTimeout(function () { set(function (c) { return Object.assign({}, c, { lit: -1 }); }); }, 700 * i + 900); });
      setTimeout(function () { set(function (c) { return Object.assign({}, c, { phase: 'input', shownDigit: null }); }); }, 700 * seq.length + 500);
    }
    function start() { play([rnd(digits ? 9 : 4) + (digits ? 1 : 0)]); }
    function press(v) {
      if (s.phase !== 'input') return;
      var inp = s.input.concat([v]), i = inp.length - 1;
      set(Object.assign({}, s, { input: inp, lit: v })); setTimeout(function () { set(function (c) { return Object.assign({}, c, { lit: -1 }); }); }, 200);
      if (inp[i] !== s.seq[i]) { var sc = s.seq.length - 1; rec.current = best[1](sc); set(Object.assign({}, s, { phase: 'over', score: sc })); return; }
      if (inp.length === s.seq.length) setTimeout(function () { play(s.seq.concat([rnd(digits ? 9 : 4) + (digits ? 1 : 0)])); }, 600);
    }
    if (s.phase === 'over') return h(Done, { big: s.score + ' in a row', sub: 'You remembered a sequence of ' + s.score + '.', record: rec.current, again: props.again, back: props.back });
    return h('div', { className: 'jx-simon' },
      h('p', { className: 'jx-muted' }, s.phase === 'ready' ? 'Watch, then copy the sequence. It gets one longer each time.' : s.phase === 'show' ? 'Watch carefully… (' + s.seq.length + ')' : 'Your turn! (' + s.input.length + ' of ' + s.seq.length + ')'),
      digits ? h('div', null, h('p', { className: 'jx-game-big' }, s.shownDigit != null && s.lit !== -1 ? s.shownDigit : s.phase === 'input' ? '?' : '…'),
        h('div', { className: 'jx-game-opts jx-keypad' }, [1, 2, 3, 4, 5, 6, 7, 8, 9].map(function (n) { return h('button', { key: n, type: 'button', onClick: function () { press(n); } }, n); })))
        : h('div', { className: 'jx-pads' }, g.pads.map(function (c, i) { return h('button', { key: i, type: 'button', className: s.lit === i ? 'is-lit' : '', style: { background: c }, 'aria-label': 'Pad ' + (i + 1), onClick: function () { press(i); } }, g.labels[i]); })),
      s.phase === 'ready' && h('button', { type: 'button', className: 'primary', onClick: start }, 'Start'));
  }
  function Schulte(props) {
    var n = props.game.size, total = n * n;
    var cs = useState(function () { return shuffle(Array.from({ length: total }, function (_, i) { return i + 1; })); }), cells = cs[0];
    var nx = useState(1), next = nx[0], setNext = nx[1];
    var t0 = useRef(0), secs = useRef(0), rec = useRef(false), best = useBest(props.game.id);
    var wr = useState(0), wrong = wr[0], setWrong = wr[1];
    function tap(v) { if (next === 1 && v === 1) t0.current = Date.now(); if (v === next) { if (v === total) { secs.current = ((Date.now() - t0.current) / 1000).toFixed(1); rec.current = best[1](+secs.current, true); } setNext(next + 1); } else setWrong(wrong + 1); }
    if (next > total) return h(Done, { big: secs.current + ' seconds', sub: wrong + ' wrong taps' + (best[0] != null ? ' · best ' + best[0] + ' s' : ''), record: rec.current, again: props.again, back: props.back });
    return h('div', null, h('p', { className: 'jx-muted' }, 'Tap the numbers in order. Find: ', h('strong', null, next)),
      h('div', { className: 'jx-game-grid jx-schulte', style: { gridTemplateColumns: 'repeat(' + n + ',1fr)' } }, cells.map(function (v) { return h('button', { key: v, type: 'button', className: v < next ? 'is-done' : '', onClick: function () { tap(v); } }, v); })));
  }
  function Whack(props) {
    var catchMode = props.game.kind === 'catch';
    var st = useState({ pos: -1, hits: 0, misses: 0, left: 30, on: false, xy: [50, 50] }), s = st[0], set = st[1];
    var best = useBest(props.game.id), rec = useRef(false);
    var speed = [1100, 900, 750][props.lv];
    useEffect(function () {
      if (!s.on) return;
      var mv = setInterval(function () { set(function (c) { return Object.assign({}, c, { pos: rnd(9), xy: [8 + rnd(84), 10 + rnd(80)] }); }); }, speed);
      var tk = setInterval(function () { set(function (c) { if (c.left <= 1) { rec.current = best[1](c.hits); return Object.assign({}, c, { on: false, left: 0, done: true }); } return Object.assign({}, c, { left: c.left - 1 }); }); }, 1000);
      return function () { clearInterval(mv); clearInterval(tk); };
    }, [s.on]);
    function hit(ok) { set(function (c) { return Object.assign({}, c, ok ? { hits: c.hits + 1, pos: -1, xy: [-50, -50] } : { misses: c.misses + 1 }); }); }
    if (s.done) return h(Done, { big: s.hits + ' caught', sub: s.misses + ' misses in 30 seconds', record: rec.current, again: props.again, back: props.back });
    return h('div', null, h('p', { className: 'jx-muted' }, (catchMode ? 'Tap the star as fast as you can!' : 'Tap the wētā when it pops up!') + ' · ' + s.left + ' s · ' + s.hits + ' caught'),
      !s.on ? h('button', { type: 'button', className: 'primary', onClick: function () { set({ pos: -1, hits: 0, misses: 0, left: 30, on: true, xy: [50, 50] }); } }, 'Start')
        : catchMode ? h('div', { className: 'jx-catch', onClick: function (e) { if (e.target === e.currentTarget) hit(false); } }, h('button', { type: 'button', className: 'jx-catch-star', style: { left: s.xy[0] + '%', top: s.xy[1] + '%' }, onClick: function (e) { e.stopPropagation(); hit(true); } }, '⭐'))
          : h('div', { className: 'jx-game-grid jx-holes', style: { gridTemplateColumns: 'repeat(3,1fr)' } }, Array.from({ length: 9 }, function (_, i) { return h('button', { key: i, type: 'button', className: i === s.pos ? 'is-up' : '', onClick: function () { hit(i === s.pos); } }, i === s.pos ? '🦗' : ''); })));
  }
  function Reaction(props) {
    var st = useState({ phase: 'idle', times: [], msg: '' }), s = st[0], set = st[1];
    var t = useRef(null), t0 = useRef(0), best = useBest(props.game.id), rec = useRef(false);
    useEffect(function () { return function () { clearTimeout(t.current); }; }, []);
    function begin() { set(Object.assign({}, s, { phase: 'wait', msg: 'Wait for green…' })); t.current = setTimeout(function () { t0.current = performance.now(); set(function (c) { return Object.assign({}, c, { phase: 'go', msg: 'TAP!' }); }); }, 1200 + rnd(2500)); }
    function tap() {
      if (s.phase === 'idle' || s.phase === 'result') return begin();
      if (s.phase === 'wait') { clearTimeout(t.current); return set(Object.assign({}, s, { phase: 'result', msg: 'Too soon! Wait for green. Tap to try again.' })); }
      var ms = Math.round(performance.now() - t0.current), times = s.times.concat([ms]);
      if (times.length >= 5) { var avg = Math.round(times.reduce(function (a, b) { return a + b; }, 0) / times.length); rec.current = best[1](avg, true); return set({ phase: 'done', times: times, avg: avg }); }
      set({ phase: 'result', times: times, msg: ms + ' ms — tap for the next one (' + times.length + ' of 5)' });
    }
    if (s.phase === 'done') return h(Done, { big: s.avg + ' ms', sub: 'average of 5 tries' + (best[0] != null ? ' · best ' + best[0] + ' ms' : ''), record: rec.current, again: props.again, back: props.back });
    return h('button', { type: 'button', className: 'jx-react is-' + s.phase, onClick: tap }, s.phase === 'idle' ? 'Tap to start. When the box turns green, tap as fast as you can!' : s.msg);
  }
  function Breathe(props) {
    var st = useState({ on: false, n: 0, phase: 'Breathe in' }), s = st[0], set = st[1];
    useEffect(function () {
      if (!s.on) return;
      var seq = [['Breathe in', 4000], ['Hold', 2000], ['Breathe out', 5000]], i = 0, n = 0, tm;
      function step() { set({ on: true, n: n, phase: seq[i][0] }); tm = setTimeout(function () { i = (i + 1) % 3; if (i === 0) n++; if (n >= 5) { set({ on: false, n: 5, phase: 'Done', done: true }); return; } step(); }, seq[i][1]); }
      step(); return function () { clearTimeout(tm); };
    }, [s.on]);
    if (s.done) return h(Done, { big: '5 calm breaths', sub: 'Notice how your body feels now.', again: props.again, back: props.back });
    return h('div', { className: 'jx-breathe' }, h('div', { className: 'jx-breathe-star ph-' + s.phase.replace(/\s/g, '') }, '🌟'), h('p', { className: 'jx-game-prompt' }, s.on ? s.phase + ' · ' + (s.n + 1) + ' of 5' : 'Follow the star: breathe in as it grows, hold, and breathe out as it shrinks.'),
      !s.on && h('button', { type: 'button', className: 'primary', onClick: function () { set({ on: true, n: 0, phase: 'Breathe in' }); } }, 'Start'));
  }
  function Player(props) {
    var k = useState(0), key = k[0], setKey = k[1], g = props.game, lv = lvFor(props.age);
    var C = { quiz: Quiz, memory: Memory, simon: Simon, digits: Simon, schulte: Schulte, whack: Whack, catch: Whack, reaction: Reaction, breathe: Breathe }[g.kind];
    useEffect(function () { try { document.querySelector('.jx-game-player').scrollIntoView({ behavior: 'smooth', block: 'start' }); } catch (e) {} }, [g.id]);
    return h('div', { className: 'jx-card jx-game-player jx-keep-colour' },
      h('div', { className: 'jx-row jx-game-top' }, h('h3', null, g.emoji + ' ' + g.name), h('span', { className: 'jx-pill is-lw' }, g.skill), h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Close game', onClick: props.back }, '×')),
      h(C, { key: key, game: g, lv: lv, age: props.age, again: function () { setKey(key + 1); }, back: props.back }));
  }
  function Arcade(props) {
    var sk = useState('All'), skill = sk[0], setSkill = sk[1];
    var gm = useState(null), game = gm[0], setGame = gm[1];
    var a = AGES.find(function (x) { return x[0] === props.age; });
    var list = G.filter(function (g) { return (!a || (g.ages[0] <= a[4] && g.ages[1] >= a[3])) && (skill === 'All' || g.skill === skill); });
    var skills = ['All'].concat(Array.from(new Set(G.map(function (g) { return g.skill; }))));
    var bs = JNZX.useStored('jnzx-focus-best', {}), best = bs[0];
    var mo = useState(false), more = mo[0], setMore = mo[1];
    var shown = more ? list : list.slice(0, 12);
    return h('section', { className: 'jx-arcade' },
      h('div', { className: 'jx-cat-sec-head' }, h('h2', null, '🎮 Focus games'), h('span', { className: 'jx-muted' }, list.length + ' of ' + G.length + ' games for ' + (a ? a[2] : 'all ages'))),
      h(JNZX.Chips, { label: 'Skill', options: skills, value: skill, onChange: setSkill }),
      game && h(Player, { game: game, age: props.age, back: function () { setGame(null); } }),
      h('div', { className: 'jx-game-cards' }, shown.map(function (g) {
        var played = Object.keys(best).some(function (k) { return k.indexOf(g.id) === 0; });
        return h('button', { key: g.id, type: 'button', className: 'jx-game-card' + (game && game.id === g.id ? ' is-on' : ''), onClick: function () { setGame(g); } }, h('span', { className: 'jx-game-emoji', 'aria-hidden': true }, g.emoji), h('strong', null, g.name), h('small', null, g.skill + ' · ages ' + g.ages[0] + '–' + g.ages[1] + (played ? ' · ✓ played' : '')));
      })),
      list.length > 12 && h('button', { type: 'button', className: 'secondary jx-more-games', onClick: function () { setMore(!more); } }, more ? 'Show fewer' : 'Show all ' + list.length + ' games'));
  }
  function AgeGuide(props) {
    var gd = GUIDE[props.age];
    return h('div', { className: 'jx-age-guide-mini' },
      h('strong', null, '✨ Try at this age: '), gd.learn.slice(0, 4).join(' · '),
      h('small', null, ' ⏱️ ' + gd.focus));
  }
  var AGE_EMO = { '2-3': '🧸', '3-5': '🖍️', '5-6': '🎒', '6-8': '📖', '8-10': '🧩', '10-12': '🚀' };
  try {
    var BaseKids = KidsLearning;
    KidsLearning = function LittleLearners() {
      var ag = JNZX.useStored('jnzx-kids-age', '3-5'), age = ag[0], setAge = ag[1];
      var vw = JNZX.useStored('jnzx-kids-view', 'play'), view = vw[0], setView = vw[1];
      // When the age changes, the Learn tab jumps to the best topic for that age and marks the good ones
      useEffect(function () {
        if (view !== 'learn') return;
        var tm = setTimeout(function () {
          var gd = GUIDE[age], want = (gd && gd.topics || '').split('·').map(function (x) { return x.trim(); }).filter(Boolean);
          var btns = Array.prototype.slice.call(document.querySelectorAll('.jx-kids-base .filters button'));
          btns.forEach(function (b) { b.classList.toggle('jx-best-age', want.indexOf(b.textContent.trim()) >= 0); });
          var first = btns.find(function (b) { return b.textContent.trim() === want[0]; });
          if (first && !first.classList.contains('selected')) first.click();
          setTimeout(function () { Array.prototype.forEach.call(document.querySelectorAll('.jx-kids-base .filters button'), function (b) { b.classList.toggle('jx-best-age', want.indexOf(b.textContent.trim()) >= 0); }); }, 200);
        }, 60);
        return function () { clearTimeout(tm); };
      }, [age, view]);
      return h(Frag, null,
        h('div', { className: 'jx-page jx-little' },
          h('p', { className: 'eyebrow' }, 'LEARNING · LITTLE LEARNERS'),
          h('h1', { className: 'jx-little-h' }, 'Little Learners'),
          h('p', { className: 'jx-muted' }, 'Pick an age, then play or learn.'),
          h('div', { className: 'jx-age-row', role: 'group', 'aria-label': 'Age' }, AGES.map(function (a) { return h('button', { key: a[0], type: 'button', className: 'jx-age' + (age === a[0] ? ' is-on' : ''), 'aria-pressed': age === a[0], onClick: function () { setAge(a[0]); } }, h('strong', null, AGE_EMO[a[0]] + ' ' + a[1]), h('small', null, a[2])); })),
          h(AgeGuide, { age: age }),
          h('div', { className: 'jx-cs-tabs', role: 'tablist', 'aria-label': 'Play or learn' },
            [['play', '🎮 Focus games'], ['learn', '📚 Learn & make']].map(function (x) { return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': view === x[0], className: view === x[0] ? 'is-on' : '', onClick: function () { setView(x[0]); } }, x[1]); })),
          view === 'play' && h(Arcade, { key: 'arcade-' + age, age: age })),
        view === 'learn' && h('div', { className: 'jx-kids-base' }, h(BaseKids)),
        h('div', { className: 'jx-page jx-page-end' }, h(JNZX.ShareBar, { tab: 'Kids’ learning & activities' })));
    };
  } catch (e) { console.warn('[JNZX] kids', e); }
})();
