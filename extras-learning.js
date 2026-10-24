/* The James NZ — Learning › Science (periodic table) and English
   (dictionary and Kiwi expressions). October 2026.
   Element data: Periodic-Table-JSON by Bowserinator (CC BY-SA 3.0).
   Dictionary: Open English WordNet (CC BY 4.0), derived from Princeton WordNet. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef;

  /* ======================= SCIENCE: PERIODIC TABLE ======================= */
  var CAT = {
    'alkali metal': ['Alkali metals', '#ff9a7a'], 'alkaline earth metal': ['Alkaline earth metals', '#ffd27a'], 'transition metal': ['Transition metals', '#f2b8c6'],
    'post-transition metal': ['Post-transition metals', '#b9d7a8'], 'metalloid': ['Metalloids', '#a7d8d1'], 'polyatomic nonmetal': ['Reactive nonmetals', '#a9c8ff'],
    'diatomic nonmetal': ['Reactive nonmetals', '#a9c8ff'], 'noble gas': ['Noble gases', '#d0b8ff'], 'lanthanide': ['Lanthanides', '#ffc2e2'], 'actinide': ['Actinides', '#f7c6a3'], 'unknown': ['Unknown properties', '#d6dbe0']
  };
  function catKey(c) { return CAT[c] ? c : 'unknown'; }
  function K2C(k) { return k === null || k === undefined ? '—' : (Math.round((k - 273.15) * 10) / 10) + ' °C'; }
  function phaseAt(el, T) { if (el.melt === null || el.melt === undefined) return el.phase; if (T < el.melt) return 'Solid'; if (el.boil !== null && el.boil !== undefined && T >= el.boil) return 'Gas'; return 'Liquid'; }

  function ElementDetail(props) {
    var e = props.el, ck = catKey(e.category);
    useEffect(function () { function k(ev) { if (ev.key === 'Escape') props.onClose(); } window.addEventListener('keydown', k); return function () { window.removeEventListener('keydown', k); }; }, []);
    var rows = [
      ['Atomic number', e.number], ['Atomic mass', e.atomic_mass ? (+e.atomic_mass.toFixed(4)) + ' u' : '—'], ['Category', e.category], ['Group · Period · Block', (e.group || '—') + ' · ' + e.period + ' · ' + e.block],
      ['Phase at room temperature', e.phase], ['Electron configuration', e.electron_configuration_semantic], ['Electrons per shell', (e.shells || []).join(', ')],
      ['Electronegativity (Pauling)', e.electronegativity_pauling === null || e.electronegativity_pauling === undefined ? '—' : e.electronegativity_pauling],
      ['Density', e.density === null || e.density === undefined ? '—' : e.density + ' g/cm³'], ['Melting point', K2C(e.melt)], ['Boiling point', K2C(e.boil)],
      ['Discovered by', e.discovered_by || '—'], ['Named by', e.named_by || '—'], ['Appearance', e.appearance || '—']
    ];
    return h('div', { className: 'jx-el-overlay', role: 'dialog', 'aria-modal': true, 'aria-label': e.name, onClick: function (ev) { if (ev.target === ev.currentTarget) props.onClose(); } },
      h('article', { className: 'jx-el-detail' },
        h('button', { type: 'button', className: 'jx-el-close', onClick: props.onClose, 'aria-label': 'Close' }, '×'),
        h('div', { className: 'jx-el-hero', style: { background: CAT[ck][1] } },
          h('span', { className: 'jx-el-num' }, e.number), h('span', { className: 'jx-el-sym' }, e.symbol), h('span', { className: 'jx-el-name' }, e.name)),
        h('div', { className: 'jx-el-body' },
          h('p', null, e.summary),
          h('div', { className: 'jx-el-pics' },
            e.bohr && h('figure', null, h('img', { src: e.bohr, alt: 'Bohr model of ' + e.name, loading: 'lazy', onError: function (ev) { ev.target.parentNode.style.display = 'none'; } }), h('figcaption', null, 'Bohr model')),
            e.img && h('figure', null, h('img', { src: e.img, alt: e.name + ' sample', loading: 'lazy', onError: function (ev) { ev.target.parentNode.style.display = 'none'; } }), h('figcaption', null, 'Photo: ' + (e.imgCredit || 'images-of-elements.com')))),
          h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, rows.map(function (r) { return h('tr', { key: r[0] }, h('th', null, r[0]), h('td', null, String(r[1]))); })))),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'secondary', disabled: e.number <= 1, onClick: function () { props.onGo(e.number - 1); } }, '← ' + (props.prev || 'Previous')),
            h('button', { type: 'button', className: 'secondary', disabled: e.number >= 118, onClick: function () { props.onGo(e.number + 1); } }, (props.next || 'Next') + ' →'),
            e.source && h('a', { className: 'secondary', href: e.source, target: '_blank', rel: 'noopener noreferrer' }, 'Read more on Wikipedia')),
          h('p', { className: 'small-note' }, 'Summary text from Wikipedia via Periodic-Table-JSON (CC BY-SA 3.0).'))));
  }

  function PeriodicTable() {
    var st = JNZX.useData('./data/elements.json'), els = st.data;
    var s = useState(null), sel = s[0], setSel = s[1];
    var f = useState('all'), filt = f[0], setFilt = f[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var t = useState(298), temp = t[0], setTemp = t[1];
    var m = useState('category'), mode = m[0], setMode = m[1];
    if (st.error) return h('p', { role: 'alert' }, st.error);
    if (!els) return h('p', { className: 'jx-muted' }, 'Loading the periodic table…');
    var byNum = {}; els.forEach(function (e) { byNum[e.number] = e; });
    var cats = []; els.forEach(function (e) { var k = CAT[catKey(e.category)][0]; if (cats.indexOf(k) < 0) cats.push(k); });
    function match(e) {
      var ql = qq.trim().toLowerCase();
      if (ql && !(e.name.toLowerCase().indexOf(ql) >= 0 || e.symbol.toLowerCase() === ql || String(e.number) === ql)) return false;
      if (filt === 'all') return true;
      if (filt.indexOf('cat:') === 0) return CAT[catKey(e.category)][0] === filt.slice(4);
      if (filt.indexOf('blk:') === 0) return e.block === filt.slice(4);
      return true;
    }
    function colour(e) {
      if (mode === 'phase') { var p = phaseAt(e, temp); return p === 'Solid' ? '#c9d6e3' : p === 'Liquid' ? '#7fb2ff' : '#ffb48a'; }
      if (mode === 'eneg') { var v = e.electronegativity_pauling; if (v === null || v === undefined) return '#e5e7eb'; var k = Math.min(1, v / 4); return 'hsl(' + (220 - 220 * k) + ',75%,' + (82 - 22 * k) + '%)'; }
      return CAT[catKey(e.category)][1];
    }
    var cells = els.map(function (e) {
      var on = match(e);
      return h('button', { key: e.number, type: 'button', className: 'jx-el' + (on ? '' : ' is-dim'), style: { gridColumn: e.xpos, gridRow: e.ypos, background: colour(e) }, onClick: function () { setSel(e.number); }, 'aria-label': e.name + ', atomic number ' + e.number },
        h('span', { className: 'jx-el-n' }, e.number), h('strong', null, e.symbol), h('span', { className: 'jx-el-nm' }, e.name));
    });
    var labels = [h('div', { key: 'l1', className: 'jx-el-label', style: { gridColumn: 3, gridRow: 6 } }, '57–71'), h('div', { key: 'l2', className: 'jx-el-label', style: { gridColumn: 3, gridRow: 7 } }, '89–103')];
    return h('div', null,
      h('div', { className: 'jx-row' }, h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Find an element: name, symbol or number' }),
        h('label', null, 'Colour by', h('select', { value: mode, onChange: function (e) { setMode(e.target.value); } }, h('option', { value: 'category' }, 'Category'), h('option', { value: 'phase' }, 'State at a temperature'), h('option', { value: 'eneg' }, 'Electronegativity')))),
      mode === 'phase' && h('label', { className: 'jx-wide jx-temp' }, 'Temperature: ' + temp + ' K (' + Math.round(temp - 273.15) + ' °C) — blue = liquid, orange = gas, grey = solid', h('input', { type: 'range', min: 0, max: 6000, step: 1, value: temp, onChange: function (e) { setTemp(+e.target.value); } })),
      h(JNZX.Chips, { label: 'Highlight', value: filt, onChange: setFilt, options: [{ value: 'all', label: 'All' }].concat(cats.map(function (c) { return { value: 'cat:' + c, label: c }; })).concat(['s', 'p', 'd', 'f'].map(function (b) { return { value: 'blk:' + b, label: b + '-block' }; })) }),
      h('div', { className: 'jx-ptable-wrap' }, h('div', { className: 'jx-ptable' }, cells, labels)),
      mode === 'category' && h('div', { className: 'jx-legend' }, cats.map(function (c) { var key = Object.keys(CAT).find(function (k) { return CAT[k][0] === c; }); return h('span', { key: c }, h('i', { style: { background: CAT[key][1] } }), c); })),
      h('p', { className: 'small-note' }, 'Tap any element for its properties, electron configuration, Bohr model and a short history. Data: Periodic-Table-JSON (CC BY-SA 3.0). Melting and boiling points are at standard pressure.'),
      sel && byNum[sel] && h(ElementDetail, { el: byNum[sel], prev: byNum[sel - 1] && byNum[sel - 1].name, next: byNum[sel + 1] && byNum[sel + 1].name, onClose: function () { setSel(null); }, onGo: setSel }));
  }

  function ElementQuiz() {
    var st = JNZX.useData('./data/elements.json'), els = st.data;
    var s = useState(0), seed = s[0], setSeed = s[1];
    var sc = useState({ right: 0, total: 0 }), score = sc[0], setScore = sc[1];
    var a = useState(null), ans = a[0], setAns = a[1];
    var qn = useMemo(function () {
      if (!els) return null;
      var pool = els.filter(function (e) { return e.number <= 56 || [78, 79, 80, 82, 86, 92].indexOf(e.number) >= 0; });
      var pick = pool[Math.floor(Math.random() * pool.length)], type = Math.random() < 0.5 ? 'sym' : 'name';
      var opts = [pick]; while (opts.length < 4) { var o = pool[Math.floor(Math.random() * pool.length)]; if (opts.indexOf(o) < 0) opts.push(o); }
      opts.sort(function () { return Math.random() - 0.5; });
      return { e: pick, type: type, opts: opts };
    }, [els, seed]);
    if (!qn) return null;
    function choose(o) { if (ans) return; setAns(o); setScore({ right: score.right + (o === qn.e ? 1 : 0), total: score.total + 1 }); }
    return h('div', { className: 'jx-card' },
      h('h3', null, 'Element quiz'),
      h('p', null, qn.type === 'sym' ? 'Which element has the symbol ' : 'What is the symbol for ', h('strong', null, qn.type === 'sym' ? qn.e.symbol : qn.e.name), '?'),
      h('div', { className: 'jx-row' }, qn.opts.map(function (o) {
        var cls = 'secondary' + (ans ? (o === qn.e ? ' jx-right' : o === ans ? ' jx-wrong' : '') : '');
        return h('button', { key: o.number, type: 'button', className: cls, onClick: function () { choose(o); } }, qn.type === 'sym' ? o.name : o.symbol);
      })),
      ans && h('p', null, ans === qn.e ? 'Correct! ' : 'Not quite — it is ' + qn.e.name + ' (' + qn.e.symbol + '). ', 'Atomic number ' + qn.e.number + '.'),
      h('div', { className: 'jx-row' }, h('span', null, 'Score: ' + score.right + ' / ' + score.total), ans && h('button', { type: 'button', className: 'primary', onClick: function () { setAns(null); setSeed(seed + 1); } }, 'Next question')));
  }

  var SCI_BASICS = [
    ['How to read an element tile', ['The big letters are the chemical symbol (Fe for iron, from the Latin ferrum).', 'The atomic number is the number of protons in the nucleus. It defines the element.', 'The atomic mass is the average mass of the atoms, including the mix of isotopes found in nature.']],
    ['Groups and periods', ['Columns are groups (1–18). Elements in a group have the same number of outer electrons, so they behave alike: the alkali metals in group 1 all react strongly with water.', 'Rows are periods (1–7). Each new period starts filling a new electron shell.', 'The f-block (lanthanides and actinides) is shown below the main table to keep it a sensible width.']],
    ['Metals, nonmetals and metalloids', ['Metals (left and centre) are usually shiny, conduct electricity and can be shaped.', 'Nonmetals (top right) are often gases or brittle solids and are poor conductors.', 'Metalloids such as silicon sit between the two and are vital for electronics.']],
    ['Trends across the table', ['Atoms get smaller from left to right across a period and larger down a group.', 'Electronegativity — how strongly an atom pulls on shared electrons — increases to the top right (fluorine is highest).', 'Noble gases (group 18) have full outer shells, so they rarely react.']],
    ['Science in Aotearoa', ['New Zealand’s geothermal areas, such as Rotorua, smell of hydrogen sulfide (H₂S) and deposit sulfur.', 'Ironsand on west-coast beaches is rich in titanomagnetite, an iron–titanium oxide.', 'Ernest Rutherford, born near Nelson, discovered the atomic nucleus in 1911 and won the 1908 Nobel Prize in Chemistry.']]
  ];
  JNZX.register('x:science', function SciencePage(props) {
    return h('div', null,
      JNZX.Header('LEARNING · SCIENCE', 'The periodic table, explored.', 'All 118 elements in an interactive table. Tap an element to learn about it, colour the table by category, state or electronegativity, and test yourself with the element quiz.'),
      h(JNZX.Tabs, { id: 'science', label: 'Science', items: [
        { id: 'table', label: '⚛️ Periodic table', render: function () { return h(PeriodicTable); } },
        { id: 'basics', label: 'How the table works', render: function () { return h(JNZX.Accordion, { openFirst: true, items: SCI_BASICS.map(function (b) { return { title: b[0], body: function () { return h('ul', null, b[1].map(function (x, i) { return h('li', { key: i }, x); })); } }; }) }); } },
        { id: 'quiz', label: 'Element quiz', render: function () { return h(ElementQuiz); } }
      ] }),
      h(JNZX.ShareBar, { tab: props.tab }));
  });

  /* ======================= ENGLISH: DICTIONARY ======================= */
  var POSN = { noun: 'noun', verb: 'verb', adj: 'adjective', adv: 'adverb' };
  function bucket(w) { var c = (w[0] || '').toLowerCase(); return c >= 'a' && c <= 'z' ? c : '0'; }
  function speak(word) { try { var u = new SpeechSynthesisUtterance(word); u.lang = 'en-NZ'; var v = speechSynthesis.getVoices().find(function (x) { return /en-(NZ|AU|GB)/.test(x.lang); }); if (v) u.voice = v; u.rate = 0.9; speechSynthesis.cancel(); speechSynthesis.speak(u); } catch (e) {} }
  function Dictionary() {
    var idx = JNZX.useData('./data/dict/index.json');
    var q = useState(''), qq = q[0], setQ = q[1];
    var w = useState(null), word = w[0], setWord = w[1];
    var e = useState({ word: null, senses: null, err: '' }), entry = e[0], setEntry = e[1];
    var hs = JNZX.useStored('jnzx-dict-recent', []), recent = hs[0], setRecent = hs[1];
    var lower = useMemo(function () { return idx.data ? idx.data.map(function (x) { return x.toLowerCase(); }) : null; }, [idx.data]);
    var sugg = useMemo(function () {
      if (!lower || !qq.trim()) return [];
      var t = qq.trim().toLowerCase().replace(/\s+/g, ' '), out = [], lo = 0, hi = lower.length;
      while (lo < hi) { var mid = (lo + hi) >> 1; if (lower[mid] < t) lo = mid + 1; else hi = mid; }
      for (var i = lo; i < lower.length && out.length < 12 && lower[i].indexOf(t) === 0; i++) out.push(idx.data[i]);
      return out;
    }, [qq, lower]);
    function open(wd) {
      setWord(wd); setQ(wd); setEntry({ word: wd, senses: null, err: '' });
      JNZX.load('./data/dict/' + bucket(wd) + '.json').then(function (d) {
        var key = d[wd] ? wd : Object.keys(d).find(function (k) { return k.toLowerCase() === wd.toLowerCase(); });
        setEntry({ word: key || wd, senses: key ? d[key] : [], err: '' });
        if (key) setRecent([key].concat(recent.filter(function (x) { return x !== key; })).slice(0, 12));
      }, function () { setEntry({ word: wd, senses: null, err: 'The dictionary could not load. Check your connection and try again.' }); });
    }
    function lookup() {
      var t = qq.trim(); if (!t) return;
      var exact = lower && lower.indexOf(t.toLowerCase());
      if (exact >= 0) return open(idx.data[exact]);
      var base = t.toLowerCase().replace(/(ies)$/, 'y').replace(/(es|s|ed|ing)$/, '');
      var guess = lower && (lower.indexOf(base) >= 0 ? idx.data[lower.indexOf(base)] : lower.indexOf(base + 'e') >= 0 ? idx.data[lower.indexOf(base + 'e')] : null);
      if (guess) return open(guess);
      if (sugg[0]) return open(sugg[0]);
      setEntry({ word: t, senses: [], err: '' });
    }
    function random() { if (idx.data) { var c; do { c = idx.data[Math.floor(Math.random() * idx.data.length)]; } while (/[\d ]/.test(c)); open(c); } }
    var groups = {};
    (entry.senses || []).forEach(function (s) { (groups[s[0]] = groups[s[0]] || []).push(s); });
    return h('div', { className: 'jx-dict' },
      h('div', { className: 'jx-row' },
        h('label', { className: 'jx-search' }, h('span', { className: 'jx-sr' }, 'Look up a word'),
          h('input', { type: 'search', value: qq, placeholder: idx.data ? 'Look up any of ' + idx.data.length.toLocaleString() + ' words and phrases' : 'Loading dictionary…', 'aria-autocomplete': 'list', onChange: function (ev) { setQ(ev.target.value); setWord(null); }, onKeyDown: function (ev) { if (ev.key === 'Enter') lookup(); } })),
        h('button', { type: 'button', className: 'primary', onClick: lookup, disabled: !idx.data }, 'Define'),
        h('button', { type: 'button', className: 'secondary', onClick: random, disabled: !idx.data }, 'Surprise me')),
      idx.error && h('p', { role: 'alert' }, idx.error),
      !word && sugg.length > 0 && h('ul', { className: 'jx-sugg', role: 'listbox' }, sugg.map(function (s) { return h('li', { key: s }, h('button', { type: 'button', onClick: function () { open(s); } }, s)); })),
      entry.word && h('article', { className: 'jx-card jx-entry' },
        h('div', { className: 'jx-entry-head' }, h('h2', null, entry.word), h('button', { type: 'button', className: 'secondary jx-fix', onClick: function () { speak(entry.word); }, 'aria-label': 'Hear ' + entry.word }, '🔊 Listen')),
        entry.err && h('p', { role: 'alert' }, entry.err),
        !entry.senses && !entry.err && h('p', { className: 'jx-muted' }, 'Looking it up…'),
        entry.senses && entry.senses.length === 0 && (function () {
          var wl = entry.word.toLowerCase(), kiwi = KIWI.filter(function (k) { return k[0].toLowerCase().split(/\s*\/\s*|\s*\(/).some(function (p) { return p.replace(/\)$/, '').trim() === wl; }) || k[0].toLowerCase() === wl; });
          return h('div', null,
            kiwi.length ? kiwi.map(function (k) { return h('div', { key: k[0], className: 'jx-result' }, h('h4', null, k[0] + ' · ' + k[3]), h('p', null, k[1]), h('p', null, h('em', null, k[2]))); })
              : h('p', null, 'No entry found for “' + entry.word + '”. Check the spelling, or try the base form (for example “run” for “running”). Names, slang and very new words may not be included.'),
            h('p', null, h('a', { href: 'https://maoridictionary.co.nz/search?keywords=' + encodeURIComponent(entry.word), target: '_blank', rel: 'noopener noreferrer' }, 'Look up “' + entry.word + '” in Te Aka Māori Dictionary →')));
        })(),
        Object.keys(groups).map(function (p) {
          return h('section', { key: p }, h('h3', { className: 'jx-pos' }, POSN[p] || p),
            h('ol', null, groups[p].map(function (s, i) {
              return h('li', { key: i }, h('span', null, s[1]),
                s[2] && s[2].length > 0 && h('div', { className: 'jx-ex' }, s[2].map(function (x, j) { return h('q', { key: j }, x); })),
                s[3] && s[3].length > 0 && h('div', { className: 'jx-syn' }, 'Similar: ', s[3].map(function (x, j) { return h('button', { key: j, type: 'button', onClick: function () { open(x); } }, x); })));
            })));
        })),
      recent.length > 0 && h('p', { className: 'jx-muted' }, 'Recently viewed: ', recent.map(function (r) { return h('button', { key: r, type: 'button', className: 'jx-link', onClick: function () { open(r); } }, r); })),
      h('p', { className: 'small-note' }, 'Definitions from Open English WordNet (CC BY 4.0), based on Princeton WordNet. Spellings are mostly American; New Zealand English usually uses British spellings (colour, organise, centre). Pronunciation uses your device’s voice.'));
  }

  /* ======================= ENGLISH: KIWI EXPRESSIONS ======================= */
  // [expression, meaning, example, category, note]
  var KIWI = [
    ['Sweet as', 'Great; no problem; all good.', '“Can you pick me up at six?” “Sweet as.”', 'Everyday chat'],
    ['Chur', 'Thanks; cheers; awesome.', '“I saved you a seat.” “Chur, bro.”', 'Everyday chat'],
    ['Yeah, nah', 'No (a soft, polite no).', '“Coming for a swim?” “Yeah, nah, too cold.”', 'Everyday chat'],
    ['Nah, yeah', 'Yes (after thinking about it).', '“Is it worth the drive?” “Nah, yeah, it’s beautiful.”', 'Everyday chat'],
    ['She’ll be right', 'It will be fine; don’t worry (sometimes a bit too relaxed).', 'The tyre’s a bit flat, but she’ll be right.', 'Everyday chat'],
    ['Good as gold', 'Fine; perfectly all right.', '“How’s Nana?” “Good as gold, thanks.”', 'Everyday chat'],
    ['No worries', 'No problem; you’re welcome.', '“Thanks for helping.” “No worries.”', 'Everyday chat'],
    ['Good on ya', 'Well done; good for you.', 'You finished the half-marathon? Good on ya!', 'Everyday chat'],
    ['Shot', 'Thanks; nice one; well done.', '“Here’s your coffee.” “Shot!”', 'Everyday chat'],
    ['Cheers', 'Thanks; goodbye; or a toast.', 'Cheers for that — see you tomorrow.', 'Everyday chat'],
    ['Ta', 'Thanks (short and casual).', '“Pass the sauce?” “Here.” “Ta.”', 'Everyday chat'],
    ['Gidday', 'Hello (informal).', 'Gidday, how’s things?', 'Everyday chat'],
    ['How’s it going? / How’s it?', 'A friendly greeting meaning “How are you?”', '“How’s it?” “Not bad, you?”', 'Everyday chat'],
    ['Too right', 'Absolutely; I agree completely.', '“That was a great game.” “Too right!”', 'Everyday chat'],
    ['Fair enough', 'That is reasonable; I accept that.', '“I can’t come — work.” “Fair enough.”', 'Everyday chat'],
    ['Not even', 'No way; that is not true.', '“You ate the last biscuit.” “Not even!”', 'Everyday chat'],
    ['Hard out', 'Definitely; or with full effort.', 'We were going hard out on the garden all weekend.', 'Everyday chat'],
    ['Choice', 'Excellent; great.', 'Those fish and chips were choice.', 'Everyday chat'],
    ['Mean / mean as', 'Really good (not unkind!).', 'That new skatepark is mean as.', 'Everyday chat'],
    ['Heaps', 'A lot; very.', 'Thanks heaps. / There were heaps of people.', 'Everyday chat'],
    ['Sorted', 'Arranged; finished; dealt with.', 'Tickets are sorted for Saturday.', 'Everyday chat'],
    ['Away laughing', 'Everything is going well now.', 'Once the printer was fixed we were away laughing.', 'Everyday chat'],
    ['Box of birds', 'Very well; happy.', '“How are you?” “Box of birds, thanks.”', 'Feelings & reactions'],
    ['Box of fluffy ducks', 'Very happy (playful).', 'After the good news she was a box of fluffy ducks.', 'Feelings & reactions'],
    ['Stoked', 'Delighted; very pleased.', 'I’m stoked with my exam results.', 'Feelings & reactions'],
    ['Gutted', 'Very disappointed.', 'We were gutted when the trip was cancelled.', 'Feelings & reactions'],
    ['Knackered', 'Exhausted.', 'After the tramp we were knackered.', 'Feelings & reactions'],
    ['Crook', 'Sick; unwell (or, of a thing, not working).', 'I’m feeling a bit crook today.', 'Feelings & reactions'],
    ['Pack a sad', 'To sulk or get upset.', 'He packed a sad when he lost the game.', 'Feelings & reactions'],
    ['Spit the dummy', 'To throw a tantrum.', 'The toddler spat the dummy at the supermarket.', 'Feelings & reactions'],
    ['Throw a wobbly', 'To lose your temper.', 'Dad threw a wobbly when the dog dug up the garden.', 'Feelings & reactions'],
    ['Like a possum in the headlights', 'Frozen with surprise or fear.', 'When the teacher asked me, I was like a possum in the headlights.', 'Feelings & reactions'],
    ['Taking the mickey', 'Teasing; joking at someone’s expense.', 'Relax, I’m just taking the mickey.', 'Feelings & reactions'],
    ['Pull your head in', 'Calm down; mind your own business.', 'Pull your head in, mate — it was an accident.', 'Feelings & reactions'],
    ['Rark up', 'To tell someone off, or to stir up excitement.', 'The coach rarked up the team at half-time.', 'Feelings & reactions'],
    ['Bro / cuz / cuzzie', 'Friend; mate (cuz also means cousin).', 'Thanks, cuz.', 'People'],
    ['Mate', 'Friend; a friendly way to address anyone.', 'Cheers, mate.', 'People'],
    ['Hard case', 'A funny, likeable, slightly eccentric person.', 'Uncle Tom is a real hard case.', 'People'],
    ['Dag', 'A funny person; a character.', 'You’re such a dag!', 'People'],
    ['Egg', 'A silly person (mild).', 'Don’t be an egg — wear your helmet.', 'People'],
    ['Sook', 'A crybaby; someone who complains easily.', 'Don’t be a sook, it’s only a little rain.', 'People'],
    ['Hoon', 'A reckless, noisy person, especially a driver.', 'Some hoon was doing burnouts outside.', 'People'],
    ['Boy racer', 'A young driver with a modified, noisy car.', 'Boy racers gathered in the car park.', 'People'],
    ['Bludger', 'Someone lazy who lets others do the work.', 'Stop being a bludger and help with the dishes.', 'People'],
    ['Sticky beak', 'A nosy person.', 'The neighbour is a bit of a sticky beak.', 'People'],
    ['Rellies', 'Relatives.', 'The rellies are coming for Christmas.', 'People'],
    ['Sparky / chippie / brickie', 'Electrician / carpenter / bricklayer.', 'The sparky is coming Tuesday.', 'Work & school'],
    ['Hard yakka', 'Hard physical work.', 'Building that fence was hard yakka.', 'Work & school'],
    ['Smoko', 'A short work break, often with tea.', 'Let’s finish this row, then smoko.', 'Work & school'],
    ['Get stuck in', 'Start with enthusiasm.', 'Grab a rake and get stuck in.', 'Work & school'],
    ['Rattle your dags', 'Hurry up.', 'Rattle your dags or we’ll miss the ferry!', 'Work & school'],
    ['Number 8 wire', 'Kiwi ingenuity: fixing things with whatever is at hand.', 'He fixed the gate with real number 8 wire thinking.', 'Kiwi culture'],
    ['Tall poppy syndrome', 'Criticising or cutting down people who are successful.', 'She plays down her success because of tall poppy syndrome.', 'Kiwi culture'],
    ['Mufti day', 'A day when students wear their own clothes instead of uniform.', 'Bring a gold coin for mufti day.', 'Work & school'],
    ['Wagging', 'Skipping school (truanting).', 'He got caught wagging.', 'Work & school'],
    ['Pinged', 'Caught or fined.', 'I got pinged for speeding.', 'Everyday chat'],
    ['My shout', 'I’ll pay (for drinks or food).', 'Put your wallet away — my shout.', 'Food & drink'],
    ['Bring a plate', 'Bring food to share (not an empty plate!).', 'The church lunch is bring a plate.', 'Food & drink'],
    ['Tea', 'The evening meal (as well as the drink).', 'What’s for tea tonight?', 'Food & drink'],
    ['Cuppa', 'A cup of tea or coffee.', 'Time for a cuppa?', 'Food & drink'],
    ['Brekkie', 'Breakfast.', 'Eggs for brekkie?', 'Food & drink'],
    ['Arvo', 'Afternoon.', 'See you this arvo.', 'Everyday chat'],
    ['Sammie', 'A sandwich.', 'I packed sammies for the trip.', 'Food & drink'],
    ['Chips', 'Both hot fries and packet crisps.', 'Fish and chips on the beach.', 'Food & drink'],
    ['Fizzy', 'A soft drink.', 'No fizzy before dinner.', 'Food & drink'],
    ['Lolly', 'A sweet or candy.', 'A bag of lollies for the road.', 'Food & drink'],
    ['Pav', 'Pavlova, a meringue dessert.', 'Who brought the pav?', 'Food & drink'],
    ['Hokey pokey', 'Vanilla ice cream with crunchy honeycomb toffee.', 'Two scoops of hokey pokey, please.', 'Food & drink'],
    ['Chilly bin', 'A portable cooler box.', 'Put the drinks in the chilly bin.', 'Home & clothing'],
    ['Jandals', 'Flip-flops (from “Japanese sandals”).', 'Don’t forget your jandals.', 'Home & clothing'],
    ['Togs', 'Swimwear.', 'Pack your togs and a towel.', 'Home & clothing'],
    ['Jersey', 'A sweater or jumper.', 'Take a jersey, it gets cold at night.', 'Home & clothing'],
    ['Gumboots', 'Rubber boots.', 'Gumboots by the back door, please.', 'Home & clothing'],
    ['Swannie', 'A Swanndri — a heavy woollen bush shirt.', 'He wore his old Swannie on the farm.', 'Home & clothing'],
    ['Hottie', 'A hot-water bottle.', 'I need a hottie tonight.', 'Home & clothing'],
    ['Dunny / long drop', 'A toilet / a simple pit toilet.', 'The campsite only has a long drop.', 'Home & clothing'],
    ['Section', 'A plot of land for a house.', 'They bought a big section in Tauranga.', 'Home & clothing'],
    ['Op shop', 'A second-hand charity shop.', 'I found this jacket at the op shop.', 'Home & clothing'],
    ['Dairy', 'A corner shop selling milk, bread and treats.', 'Nip down to the dairy for milk.', 'Outdoors & places'],
    ['Bach (crib in the South)', 'A small holiday home, often by the beach.', 'We’re heading to the bach for Easter.', 'Outdoors & places'],
    ['Tramping', 'Hiking, especially overnight in the bush.', 'We went tramping in the Tararuas.', 'Outdoors & places'],
    ['The bush', 'Native forest.', 'There’s a great walk through the bush.', 'Outdoors & places'],
    ['The wop-wops', 'The remote countryside; the middle of nowhere.', 'They live out in the wop-wops.', 'Outdoors & places'],
    ['Tiki tour', 'A roundabout or scenic route.', 'We took the tiki tour home.', 'Outdoors & places'],
    ['Ute', 'A utility vehicle; a pickup truck.', 'Throw it in the back of the ute.', 'Outdoors & places'],
    ['Lifestyle block', 'A small rural property, lived on for lifestyle rather than farming income.', 'They swapped Auckland for a lifestyle block.', 'Outdoors & places'],
    ['Godzone', '“God’s own country” — New Zealand.', 'Back home in Godzone at last.', 'Kiwi culture'],
    ['Kiwi as', 'Typically New Zealand.', 'A sausage sizzle at Bunnings? Kiwi as.', 'Kiwi culture'],
    ['World famous in New Zealand', 'Well known here, but nowhere else.', 'L&P: world famous in New Zealand.', 'Kiwi culture'],
    ['Chocka', 'Completely full.', 'The car park was chocka.', 'Everyday chat'],
    ['Munted', 'Broken or wrecked.', 'My phone screen is munted.', 'Everyday chat', 'Informal.'],
    ['Puckeroo', 'Broken (from te reo Māori pakaru).', 'The washing machine’s puckeroo.', 'Everyday chat'],
    ['Dodgy', 'Suspicious, unreliable or poor quality.', 'That ladder looks dodgy.', 'Everyday chat'],
    ['Rough as guts', 'Very rough or crude.', 'The road to the bach is rough as guts.', 'Everyday chat'],
    ['Gone pear-shaped', 'Gone wrong.', 'The barbecue went pear-shaped when it rained.', 'Everyday chat'],
    ['Up the boohai', 'Hopelessly lost or wrong; far away.', 'His directions sent us up the boohai.', 'Everyday chat'],
    ['Fair go', 'A fair chance; also “be reasonable!”', 'Fair go — let the little ones have a turn.', 'Kiwi culture'],
    ['Dob in', 'To report someone; tell on them.', 'Who dobbed me in?', 'People'],
    ['Bush telegraph', 'The informal gossip network.', 'News travels fast on the bush telegraph.', 'Kiwi culture'],
    ['Waka-jumping', 'An MP switching political parties.', 'The law on waka-jumping was debated again.', 'Kiwi culture'],
    ['Kia ora', 'Hello; thank you; good health (te reo Māori).', 'Kia ora, everyone!', 'Te reo Māori in everyday English'],
    ['Mōrena', 'Good morning.', 'Mōrena, whānau!', 'Te reo Māori in everyday English'],
    ['Ka pai', 'Good; well done.', 'Ka pai, that’s perfect.', 'Te reo Māori in everyday English'],
    ['Kai', 'Food.', 'Time for kai!', 'Te reo Māori in everyday English'],
    ['Whānau', 'Extended family; a close community.', 'The whole whānau came to the hāngī.', 'Te reo Māori in everyday English'],
    ['Mahi', 'Work.', 'Great mahi this week, team.', 'Te reo Māori in everyday English'],
    ['Puku', 'Belly; stomach.', 'My puku is full.', 'Te reo Māori in everyday English'],
    ['Koha', 'A gift or donation, often to hosts.', 'Entry is by koha.', 'Te reo Māori in everyday English'],
    ['Kōrero', 'A talk, discussion or conversation.', 'Let’s have a kōrero about the plan.', 'Te reo Māori in everyday English'],
    ['Aroha', 'Love, compassion and care.', 'Sending aroha to your family.', 'Te reo Māori in everyday English'],
    ['Tamariki / mokopuna', 'Children / grandchildren.', 'The tamariki loved the show.', 'Te reo Māori in everyday English'],
    ['Haere mai', 'Welcome; come here.', 'Haere mai — come on in.', 'Te reo Māori in everyday English'],
    ['Ka kite anō', 'See you again.', 'Ka kite anō, see you next week.', 'Te reo Māori in everyday English'],
    ['Hāngī', 'Food cooked in an earth oven; the feast itself.', 'There’s a hāngī for the fundraiser.', 'Te reo Māori in everyday English'],
    ['Whare', 'House; building.', 'Welcome to our whare.', 'Te reo Māori in everyday English'],
    ['Mana', 'Prestige, authority and respect.', 'She has real mana in the community.', 'Te reo Māori in everyday English'],
    ['Tapu', 'Sacred; restricted.', 'That area is tapu — please don’t enter.', 'Te reo Māori in everyday English'],
    ['Kaitiakitanga', 'Guardianship and care, especially of the environment.', 'Beach clean-ups are an act of kaitiakitanga.', 'Te reo Māori in everyday English'],
    ['Manaakitanga', 'Hospitality, kindness and care for guests.', 'Their manaakitanga made us feel at home.', 'Te reo Māori in everyday English'],
    ['Aotearoa', 'The Māori name for New Zealand.', 'Welcome to Aotearoa.', 'Te reo Māori in everyday English'],
    ['Pākehā', 'A New Zealander of European descent.', 'Pākehā and Māori worked together on the project.', 'Te reo Māori in everyday English']
  ];
  function KiwiExpressions() {
    var c = useState('All'), cat = c[0], setCat = c[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var z = useState(null), quiz = z[0], setQuiz = z[1];
    var cats = ['All'].concat(Array.from(new Set(KIWI.map(function (k) { return k[3]; }))));
    var rows = KIWI.filter(function (k) { return (cat === 'All' || k[3] === cat) && (k[0] + ' ' + k[1] + ' ' + k[2]).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
    function newQuiz() { var a = KIWI[Math.floor(Math.random() * KIWI.length)], opts = [a]; while (opts.length < 3) { var o = KIWI[Math.floor(Math.random() * KIWI.length)]; if (opts.indexOf(o) < 0) opts.push(o); } setQuiz({ a: a, opts: opts.sort(function () { return Math.random() - 0.5; }), pick: null }); }
    return h('div', null,
      h('div', { className: 'jx-row' }, h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Search ' + KIWI.length + ' expressions' }), h('button', { type: 'button', className: 'primary', onClick: newQuiz }, 'Quiz me')),
      quiz && h('div', { className: 'jx-card' }, h('p', null, 'What does ', h('strong', null, '“' + quiz.a[0] + '”'), ' mean?'),
        h('div', { className: 'jx-quiz-opts' }, quiz.opts.map(function (o, i) { var cls = 'secondary' + (quiz.pick ? (o === quiz.a ? ' jx-right' : o === quiz.pick ? ' jx-wrong' : '') : ''); return h('button', { key: i, type: 'button', className: cls, onClick: function () { if (!quiz.pick) setQuiz(Object.assign({}, quiz, { pick: o })); } }, o[1]); })),
        quiz.pick && h('p', null, (quiz.pick === quiz.a ? 'Correct! ' : 'Not quite. ') + 'Example: ' + quiz.a[2], ' ', h('button', { type: 'button', className: 'secondary jx-fix', onClick: newQuiz }, 'Next'))),
      h(JNZX.Chips, { label: 'Category', options: cats, value: cat, onChange: setCat }),
      h('div', { className: 'jx-table-wrap' }, h('table', { className: 'jx-idioms' }, h('thead', null, h('tr', null, h('th', null, 'Expression'), h('th', null, 'Meaning'), h('th', null, 'Example'))),
        h('tbody', null, rows.map(function (k) { return h('tr', { key: k[0] }, h('td', null, h('strong', null, k[0]), h('button', { type: 'button', className: 'jx-say', 'aria-label': 'Hear ' + k[0], onClick: function () { speak(k[0].split('/')[0]); } }, '🔊')), h('td', null, k[1], k[4] && h('small', { className: 'jx-muted' }, ' ' + k[4])), h('td', null, h('em', null, k[2]))); })))),
      h('p', { className: 'small-note' }, 'Many of these are casual, so save them for friends rather than formal writing. Te reo Māori words have their own grammar and pronunciation — macrons (ā, ē, ī, ō, ū) mark long vowels and change meaning.'));
  }
  var ENG_TIPS = [
    ['NZ spelling', ['New Zealand uses British spelling: colour, favourite, organise, centre, travelling, programme (but computer program).', 'Dates are written day–month–year: 24/10/2026 or 24 October 2026.', 'Te reo Māori words keep their macrons: Māori, whānau, Ōtautahi.']],
    ['Commonly confused words', ['their (belonging to them) · there (place) · they’re (they are)', 'your (belonging to you) · you’re (you are)', 'its (belonging to it) · it’s (it is / it has)', 'affect (usually a verb) · effect (usually a noun)', 'practice (noun in NZ) · practise (verb in NZ)', 'licence (noun in NZ) · license (verb in NZ)']],
    ['Punctuation basics', ['Use an apostrophe for possession (the dog’s bowl) and contractions (don’t), never for plurals (two dogs).', 'A comma separates items in a list and follows most introductory phrases: After lunch, we walked.', 'A semicolon joins two closely linked sentences: It rained; we stayed in.']]
  ];
  JNZX.register('x:english', function EnglishPage(props) {
    return h('div', null,
      JNZX.Header('LEARNING · ENGLISH', 'Words, meanings and Kiwi English.', 'A full dictionary of over 128 000 words and phrases with meanings, examples and similar words, plus a guide to Kiwi expressions and everyday te reo Māori.'),
      h(JNZX.Tabs, { id: 'english', label: 'English', items: [
        { id: 'dict', label: '📖 Dictionary', render: function () { return h(Dictionary); } },
        { id: 'kiwi', label: '🥝 Kiwi expressions', render: function () { return h(KiwiExpressions); } },
        { id: 'tips', label: 'NZ English tips', render: function () { return h(JNZX.Accordion, { openFirst: true, items: ENG_TIPS.map(function (t) { return { title: t[0], body: function () { return h('ul', null, t[1].map(function (x, i) { return h('li', { key: i }, x); })); } }; }) }); } }
      ] }),
      h('div', { className: 'jx-note' }, h('strong', null, 'Want to polish your writing? '), 'Ask Mateo now has a writing check for academic, business, email and creative writing. ', h('button', { type: 'button', className: 'secondary jx-fix', onClick: function () { props.navigate('Mateo · AI friend'); } }, 'Open Ask Mateo →')),
      h(JNZX.ShareBar, { tab: props.tab }));
  });
})();
