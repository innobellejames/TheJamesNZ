/* The James NZ — Everyday Joy upgrades (October 2026): smaller QR codes on
   shared pictures, moving photo banner on A Little Lift, Coffee & a Smile
   categories page and an engaging Water Intake tracker with a journal. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef, Frag = R.Fragment;
  function asset(k) { try { return __jamesAsset(k); } catch (e) { return k; } }

  /* ---------------- smaller QR codes on every shared picture ---------------- */
  try {
    var baseQR = q7DrawPostQR;
    q7DrawPostQR = function (ctx, x, y, size, post) { var s = Math.round(size * 0.55); return baseQR(ctx, x + size - s, y + size - s, s, post); };
  } catch (e) {}
  try {
    var baseJQR = jDrawQR;
    jDrawQR = function (ctx, x, y, size) { var s = Math.round(size * 0.55); return baseJQR(ctx, x + size - s, y + size - s, s); };
  } catch (e) {}
  try {
    jDownloadHTML = function (name, title, body) {
      var qr = __jamesEmbedded['./october/website-qr.png'];
      var html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + jEscape(title) + '</title><style>body{font:19px/1.7 system-ui;color:#17352e;background:#fff9ee;max-width:850px;margin:auto;padding:28px}h1,h2{line-height:1.2}section{break-after:page;margin:30px 0;padding:24px;background:white;border-radius:18px}img.illustration{width:100%;max-height:480px;object-fit:contain}table{width:100%;border-collapse:collapse}th,td{padding:10px;border:1px solid #ccd8ce;text-align:left}svg{width:100%;max-height:480px}footer{display:flex;align-items:center;gap:12px;margin-top:24px;font-size:15px}footer img{width:56px;height:56px}a{color:#12644a}@media print{body{padding:0;background:white}section{border-radius:0}}</style><h1>' + jEscape(title) + '</h1>' + body + '<footer><a href="' + jURL + '"><img src="' + qr + '" alt="QR code linking to TheJamesNZ.com"></a><a href="' + jURL + '">TheJamesNZ.com</a></footer></html>';
      savePhotoFile(new File([html], name + '.html', { type: 'text/html' }));
    };
  } catch (e) {}

  /* ---------------- A Little Lift: moving photo banner ---------------- */
  var KEN = ['./mindfulness-scenes/sky.webp', './mindfulness-scenes/stream.webp', './mindfulness-scenes/garden.webp'];
  function enhanceBanners() {
    document.querySelectorAll('.inspiration-feature .photo-text-card:not(.jx-ken)').forEach(function (card) {
      var bg = getComputedStyle(card).backgroundImage, m = bg.match(/url\("?([^")]+)"?\)\s*$/);
      var srcs = (m ? [m[1]] : []).concat(KEN.map(asset));
      card.classList.add('jx-ken');
      var wrap = document.createElement('div'); wrap.className = 'jx-ken-layers'; wrap.setAttribute('aria-hidden', 'true');
      srcs.forEach(function (s, i) { var d = document.createElement('div'); d.className = 'jx-ken-slide'; d.style.backgroundImage = 'url("' + s + '")'; d.style.animationDelay = (i * 8) + 's'; wrap.appendChild(d); });
      wrap.style.setProperty('--n', srcs.length);
      var shade = document.createElement('div'); shade.className = 'jx-ken-shade';
      card.insertBefore(shade, card.firstChild); card.insertBefore(wrap, card.firstChild);
    });
  }
  var kt = null;
  function soon() { if (!kt) kt = setTimeout(function () { kt = null; enhanceBanners(); }, 200); }
  function start() { new MutationObserver(soon).observe(document.getElementById('root') || document.body, { childList: true, subtree: true }); soon(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  /* ---------------- Coffee & a Smile ---------------- */
  var KIWI_CAFE = [
    ['Flat white', 'A Kiwi café favourite: espresso with velvety, finely textured milk and a thin layer of microfoam. Both New Zealand and Australia claim to have invented it in the 1980s.'],
    ['Long black', 'Hot water first, then a double shot of espresso on top, keeping the crema. Stronger and smoother than an Americano.'],
    ['Fluffy', 'A Kiwi kids’ café treat: frothed milk in a small cup, dusted with chocolate and often served with a marshmallow. (No coffee!)'],
    ['Mochaccino', 'Espresso, chocolate and steamed milk — a popular sweet choice.'],
    ['Ordering like a local', '“Can I grab a large flat white, trim, extra hot?” Trim means low-fat milk; many cafés also offer oat, almond and soy.'],
    ['Café etiquette', 'Order at the counter, take your number to the table and wait for food to come to you. Tipping isn’t expected in New Zealand.'],
    ['Takeaway cups', 'Most takeaway cups are lined with plastic and can’t go in kerbside recycling. Many cafés welcome reusable cups.'],
    ['Small-town cafés', 'From roadside coffee caravans to historic main-street tearooms, a coffee stop is part of almost every Kiwi road trip.']
  ];
  var JOKES = [
    ['Why did the coffee file a police report?', 'It got mugged.'], ['What do you call a sad cup of coffee?', 'A depresso.'], ['How does a coffee bean say goodbye?', 'See you latte!'],
    ['Why are coffee beans so good at school?', 'They’re full of good grounds.'], ['What’s a barista’s favourite exercise?', 'The French press.'], ['Why did the latte go to the doctor?', 'It was feeling a bit flat.'],
    ['What do kiwis drink in the morning?', 'Kiwi-ccinos — a flat white with a hop in its step.'], ['How do you know your coffee is happy?', 'It’s full of bean.'], ['Why do coffee lovers make great friends?', 'They always espresso their feelings.'],
    ['What did the sugar say to the coffee?', 'I’m sweet on you.'], ['Why did the cappuccino get a gold star?', 'It foamed its best.'], ['What do you call a cow that has just had a baby?', 'Decalfinated.'],
    ['What’s the best day for a cuppa?', 'Brew-sday.'], ['Why was the coffee so calm?', 'It was decaf-inated from worry.'], ['How do you comfort a sad espresso?', 'Give it a little cream and a lot of time.'], ['What do coffee cups say when they meet?', 'Mug to meet you!']
  ];
  var SECTIONS = [['fact', 'Did you know?'], ['facts', 'Fun facts'], ['quotes', 'Coffee quotes'], ['brew', 'Brew guide & coffee art'], ['kiwi', 'Kiwi café culture'], ['jokes', 'Coffee & a smile']];
  function Sec(props) {
    return h('section', { id: 'jx-coffee-' + props.id, className: 'jx-cat-sec' },
      h('div', { className: 'jx-cat-sec-head' }, h('h2', null, props.title, props.isNew && h('span', { className: 'jx-new' }, 'New')), props.count != null && h('span', { className: 'jx-muted' }, props.count)),
      h('p', { className: 'jx-cat-sec-intro' }, props.intro), props.children);
  }
  try {
    CoffeeCorner = function CoffeeSmile() {
      var fs = useState(function () { return Math.floor(Math.random() * coffeeFacts.length); }), fi = fs[0], setFi = fs[1];
      var q = useState(''), qq = q[0], setQ = q[1];
      var pg = useState(0), page = pg[0], setPage = pg[1];
      var js = useState({}), shown = js[0], setShown = js[1];
      var only = useState('all'), sec = only[0], setSec = only[1];
      var f = coffeeFacts[fi];
      var facts = coffeeFacts.filter(function (x) { return !qq || (x.title + ' ' + x.text).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
      var quotes = coffeeQuotes.filter(function (x) { return !qq || x.toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
      var per = 12, pages = Math.max(1, Math.ceil(quotes.length / per)), pq = quotes.slice(Math.min(page, pages - 1) * per, Math.min(page, pages - 1) * per + per);
      function vis(id) { return sec === 'all' || sec === id; }
      function jump(id) { setSec(id); setTimeout(function () { var el = document.getElementById('jx-coffee-' + id) || document.querySelector('.jx-cat-bar'); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30); }
      return h('div', { className: 'jx-page jx-coffee' },
        JNZX.Header('EVERYDAY JOY · COFFEE & A SMILE', 'Coffee & a smile.', coffeeFacts.length + ' sourced facts, ' + coffeeQuotes.length + ' original quotes, a brew guide, Kiwi café culture and a few terrible coffee jokes — for your next coffee break.'),
        h('nav', { className: 'jx-cat-bar', 'aria-label': 'Coffee categories' },
          h('button', { type: 'button', className: sec === 'all' ? 'is-on' : '', onClick: function () { setSec('all'); } }, 'All'),
          SECTIONS.map(function (s) { return h('button', { key: s[0], type: 'button', className: sec === s[0] ? 'is-on' : '', onClick: function () { jump(s[0]); } }, s[1]); })),
        h('div', { className: 'jx-row' }, h(JNZX.Search, { value: qq, onChange: function (v) { setQ(v); setPage(0); }, placeholder: 'Search facts and quotes' })),
        vis('fact') && h(Sec, { id: 'fact', title: 'Did you know?', intro: 'One coffee fact at a time — perfect for a quick break.' },
          h('div', { className: 'jx-card jx-coffee-feature jx-keep-colour' },
            h('p', { className: 'eyebrow' }, 'FACT ' + (fi + 1) + ' OF ' + coffeeFacts.length), h('h3', null, f.title), h('p', null, f.text),
            f.source && h('a', { href: f.source, target: '_blank', rel: 'noopener noreferrer' }, 'Source'),
            h('div', { className: 'jx-row' },
              h('button', { type: 'button', className: 'secondary', onClick: function () { setFi((fi - 1 + coffeeFacts.length) % coffeeFacts.length); } }, '← Previous'),
              h('button', { type: 'button', className: 'primary', onClick: function () { setFi((fi + 1) % coffeeFacts.length); } }, 'Next fact →'),
              h('button', { type: 'button', className: 'secondary', onClick: function () { setFi(Math.floor(Math.random() * coffeeFacts.length)); } }, '🎲 Surprise me'),
              h(JNZX.ShareMini, { title: f.title, text: 'Did you know? ' + f.title + ' — ' + f.text })))),
        vis('facts') && h(Sec, { id: 'facts', title: 'Fun facts', count: facts.length + ' facts', intro: 'Short, sourced facts about coffee plants, beans, brewing and history.' },
          h('ul', { className: 'jx-cat-list' }, facts.map(function (x, i) { return h('li', { key: i }, h('strong', null, x.title), h('span', null, x.text), x.source && h('a', { href: x.source, target: '_blank', rel: 'noopener noreferrer' }, 'Source')); }))),
        vis('quotes') && h(Sec, { id: 'quotes', title: 'Coffee quotes', count: quotes.length + ' quotes', intro: 'Original lines from The James NZ to share with a friend over a cuppa.' },
          h('div', { className: 'jx-quote-grid' }, pq.map(function (x, i) { return h('figure', { key: i, className: 'jx-quote-card' }, h('blockquote', null, '“' + x + '”'), h('figcaption', null, 'The James NZ · original'), h(JNZX.ShareMini, { title: 'Coffee quote', text: '“' + x + '” — The James NZ' })); })),
          pages > 1 && h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', disabled: page === 0, onClick: function () { setPage(page - 1); } }, '← Previous'), h('span', { className: 'jx-muted' }, 'Page ' + (Math.min(page, pages - 1) + 1) + ' of ' + pages), h('button', { type: 'button', className: 'secondary', disabled: page >= pages - 1, onClick: function () { setPage(page + 1); } }, 'Next →'))),
        vis('brew') && h(Sec, { id: 'brew', title: 'Brew guide & coffee art', intro: 'Coffee types, brewing methods and preparation times, plus latte-art ideas and techniques. Open a guide to explore.' }, h(CoffeeGuide)),
        vis('kiwi') && h(Sec, { id: 'kiwi', title: 'Kiwi café culture', isNew: true, count: KIWI_CAFE.length + ' entries', intro: 'Flat whites, fluffies and how to order like a local in Aotearoa.' },
          h('ul', { className: 'jx-cat-list' }, KIWI_CAFE.map(function (x) { return h('li', { key: x[0] }, h('strong', null, x[0]), h('span', null, x[1])); }))),
        vis('jokes') && h(Sec, { id: 'jokes', title: 'Coffee & a smile', isNew: true, count: JOKES.length + ' jokes', intro: 'Family-friendly coffee jokes. Tap a joke to see the punchline.' },
          h('div', { className: 'jx-joke-grid' }, JOKES.map(function (j, i) { var on = shown[i]; return h('button', { key: i, type: 'button', className: 'jx-joke' + (on ? ' is-on' : ''), 'aria-expanded': !!on, onClick: function () { var o = Object.assign({}, shown); o[i] = !on; setShown(o); } }, h('strong', null, j[0]), h('span', null, on ? j[1] : 'Tap for the punchline ☕')); }))),
        h('p', { className: 'small-note' }, 'Enjoy coffee in moderation. Children, and people who are pregnant or sensitive to caffeine, may need to limit it — a fluffy is a great café treat for little ones.'),
        h(JNZX.ShareBar, { tab: 'Coffee corner' }));
    };
  } catch (e) { console.warn('[JNZX] coffee', e); }

  /* ---------------- Water Intake ---------------- */
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var MOODS = [['😄', 'Great'], ['🙂', 'Good'], ['😐', 'Okay'], ['😕', 'Low'], ['😫', 'Rough']];
  var TAGS = ['Hot day', 'Exercise', 'Headache', 'Tired', 'Focused', 'Busy day', 'Lots of coffee', 'Felt great'];
  var IDEAS = ['Add a slice of lemon, orange or cucumber', 'Drop in frozen berries as ice cubes', 'Fill a bottle at night and keep it by the bed', 'Have a glass with every meal', 'Keep a jug of water in the fridge with mint leaves', 'Drink a glass when you brush your teeth', 'Set a glass at each family member’s place at dinner', 'Swap one fizzy drink for sparkling water'];
  function iso(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function todayISO() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' }); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function monday(s) { var d = parse(s), w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return d; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function loadJSON(k, f) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch (e) { return f; } }
  function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function Drop(props) {
    return h('button', { type: 'button', className: 'jx-drop' + (props.on ? ' is-on' : ''), style: { '--wc': props.colour }, 'aria-label': props.label, 'aria-pressed': !!props.on, onClick: props.onClick },
      h('svg', { viewBox: '0 0 24 32', 'aria-hidden': true }, h('path', { d: 'M12 2 C12 2 3 14 3 20 a9 9 0 0 0 18 0 C21 14 12 2 12 2 Z' })));
  }
  function Glass(props) {
    var pct = Math.max(0, Math.min(1, props.pct)), y = 150 - pct * 130;
    return h('svg', { viewBox: '0 0 120 170', className: 'jx-glass', role: 'img', 'aria-label': Math.round(pct * 100) + '% of today’s goal' },
      h('defs', null, h('clipPath', { id: 'jx-glass-clip' }, h('path', { d: 'M15 12 L105 12 L94 158 Q93 164 86 164 L34 164 Q27 164 26 158 Z' }))),
      h('g', { clipPath: 'url(#jx-glass-clip)' },
        h('rect', { x: 0, y: 0, width: 120, height: 170, fill: 'rgba(120,170,200,.10)' }),
        h('g', { className: 'jx-wave', style: { transform: 'translateY(' + y + 'px)' } },
          h('path', { d: 'M-120 6 Q-90 -4 -60 6 T0 6 T60 6 T120 6 T180 6 T240 6 V200 H-120 Z', fill: props.colour, opacity: 0.85, className: 'jx-wave-a' }),
          h('path', { d: 'M-120 10 Q-90 2 -60 10 T0 10 T60 10 T120 10 T180 10 T240 10 V200 H-120 Z', fill: props.colour, opacity: 0.55, className: 'jx-wave-b' }))),
      h('path', { d: 'M15 12 L105 12 L94 158 Q93 164 86 164 L34 164 Q27 164 26 158 Z', fill: 'none', stroke: 'currentColor', strokeWidth: 3, opacity: 0.5 }),
      h('text', { x: 60, y: 95, textAnchor: 'middle', className: 'jx-glass-pct' }, Math.round(pct * 100) + '%'));
  }
  function drawWeek(c, wk, rec, prefs, t) {
    var W = 1240, H = 1600, g = c.getContext('2d'), n = Math.max(4, Math.min(12, Math.round(prefs.goal / prefs.cup)));
    c.width = W; c.height = H;
    g.fillStyle = t.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = t.accent; g.lineWidth = 18; g.strokeRect(30, 30, W - 60, H - 60);
    g.textAlign = 'center'; g.fillStyle = t.ink; g.font = 'bold 110px Arial, sans-serif'; g.fillText('WATER TRACKER', W / 2, 190);
    g.fillStyle = t.accent; g.font = 'bold 30px Arial, sans-serif'; g.fillText('FILL IN A DROP FOR EACH GLASS YOU DRINK', W / 2, 260);
    g.fillStyle = t.ink; g.font = 'bold 28px Arial, sans-serif'; g.fillText(('GOAL: ' + n + ' GLASSES A DAY · WEEK OF ' + wk[0].toLocaleDateString('en-NZ', { day: 'numeric', month: 'long' })).toUpperCase(), W / 2, 315);
    var rowH = 150, top = 420, dropW = Math.min(70, (W - 600) / n);
    DAYS.forEach(function (d, i) {
      var y = top + i * rowH, key = iso(wk[i]), cnt = Math.min(n, Math.round(((rec[key] || []).reduce(function (a, b) { return a + b; }, 0)) / prefs.cup));
      g.textAlign = 'left'; g.fillStyle = i % 2 ? t.accent : t.ink; g.font = 'bold 52px Arial, sans-serif'; g.fillText(d.toUpperCase(), 80, y + 20);
      for (var k = 0; k < n; k++) {
        var x = 530 + k * dropW + dropW / 2, s = dropW / 24 * 0.95;
        g.save(); g.translate(x - 12 * s, y - 34); g.scale(s, s);
        var p = new Path2D('M12 2 C12 2 3 14 3 20 a9 9 0 0 0 18 0 C21 14 12 2 12 2 Z');
        if (k < cnt) { g.fillStyle = t.accent; g.fill(p); }
        g.lineWidth = 1.4; g.strokeStyle = t.ink; g.stroke(p); g.restore();
      }
    });
    g.textAlign = 'center'; g.fillStyle = t.ink; g.font = '26px Arial, sans-serif'; g.fillText((prefs.name ? prefs.name + ' · ' : '') + 'Water Intake · The James NZ · thejamesnz.com', W / 2, H - 80);
  }
  function WaterIntake() {
    var rs = useState(function () { return jWaterLoad(); }), rec = rs[0], setRec = rs[1];
    var ps = useState(function () { return jWaterPrefs(); }), prefs = ps[0], setPrefs = ps[1];
    var jn = useState(function () { return loadJSON('jnzx-water-journal', {}); }), journal = jn[0], setJournal = jn[1];
    var th = JNZX.useStored('jnzx-water-theme', { id: 'ocean' }), theme = th[0], setTheme = th[1];
    var ds = useState(todayISO()), date = ds[0], setDate = ds[1];
    var cs = useState(''), custom = cs[0], setCustom = cs[1];
    var tb = useState('today'), tab = tb[0], setTab = tb[1];
    var cel = useState(false), party = cel[0], setParty = cel[1];
    useEffect(function () { saveJSON('james-water-v2', rec); }, [rec]);
    useEffect(function () { saveJSON('james-water-prefs', prefs); }, [prefs]);
    useEffect(function () { saveJSON('jnzx-water-journal', journal); }, [journal]);
    var entries = rec[date] || [], total = entries.reduce(function (a, b) { return a + b; }, 0), goal = prefs.goal, cup = prefs.cup, colour = prefs.colour;
    var n = Math.max(4, Math.min(12, Math.round(goal / cup))), glasses = Math.round(total / cup);
    function setDay(list) { var o = Object.assign({}, rec); if (list.length) o[date] = list; else delete o[date]; setRec(o); var tot = list.reduce(function (a, b) { return a + b; }, 0); if (total < goal && tot >= goal) { setParty(true); setTimeout(function () { setParty(false); }, 3200); } }
    function add(ml) { ml = Math.round(ml); if (ml > 0 && ml <= 1000) setDay(entries.concat([ml])); }
    function setGlasses(k) { var list = []; for (var i = 0; i < k; i++) list.push(cup); setDay(list); }
    // streaks
    var streak = 0; for (var i = 0; i < 400; i++) { var k = iso(addD(parse(todayISO()), -i)), tt = (rec[k] || []).reduce(function (a, b) { return a + b; }, 0); if (tt >= goal) streak++; else if (i > 0) break; }
    var goalsMet = Object.keys(rec).filter(function (k) { return rec[k].reduce(function (a, b) { return a + b; }, 0) >= goal; }).length;
    var BADGES = [['💧', 'First sip', Object.keys(rec).length > 0], ['🎯', 'First goal', goalsMet >= 1], ['🔥', '3-day streak', streak >= 3], ['🌊', '7-day streak', streak >= 7], ['🏅', '10 goals met', goalsMet >= 10], ['🏆', '30-day streak', streak >= 30]];
    var wk = useMemo(function () { var m = monday(date); return DAYS.map(function (_, i) { return addD(m, i); }); }, [date]);
    var t = JNZX.poster ? JNZX.poster.themeOf(theme) : { bg: '#fff', ink: '#1f2a44', accent: '#2f8fc9' };
    var ref = useRef(null);
    useEffect(function () { if (ref.current) drawWeek(ref.current, wk, rec, prefs, t); }, [tab, JSON.stringify(rec), JSON.stringify(prefs), JSON.stringify(theme), date]);
    var J = journal[date] || { mood: '', energy: 3, note: '', tags: [] };
    function setJ(o) { var x = Object.assign({}, journal); x[date] = Object.assign({}, J, o); setJournal(x); }
    var jdates = Object.keys(journal).filter(function (k) { var e = journal[k]; return e && (e.mood || e.note || (e.tags && e.tags.length)); }).sort().reverse();
    function exportJournal() {
      var txt = 'My water journal — The James NZ\n\n' + jdates.map(function (k) { var e = journal[k], tt = (rec[k] || []).reduce(function (a, b) { return a + b; }, 0); return k + ' · ' + tt + ' ml' + (e.mood ? ' · ' + e.mood : '') + ' · energy ' + e.energy + '/5' + (e.tags && e.tags.length ? ' · ' + e.tags.join(', ') : '') + (e.note ? '\n' + e.note : ''); }).join('\n\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' })); a.download = 'my-water-journal.txt'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }
    var tabs = [['today', '💧 Today'], ['week', '📅 This week'], ['journal', '📓 Journal'], ['tips', '💡 Ideas & settings']];
    return h('div', { className: 'jx-page jx-water', style: { '--wc': colour } },
      JNZX.Header('EVERYDAY JOY · PERSONAL IMPROVEMENT', 'Water intake.', 'Fill a drop for each glass, watch your glass fill up, keep your streak going and jot down how you feel in your water journal.'),
      h('div', { className: 'jx-tablist', role: 'tablist' }, tabs.map(function (x) { return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': tab === x[0], className: 'jx-tab' + (tab === x[0] ? ' is-on' : ''), onClick: function () { setTab(x[0]); } }, x[1]); })),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Day', h('input', { type: 'date', value: date, max: todayISO(), onChange: function (e) { if (e.target.value) setDate(e.target.value); } })), date !== todayISO() && h('button', { type: 'button', className: 'secondary', onClick: function () { setDate(todayISO()); } }, 'Back to today')),
      tab === 'today' && h('div', { className: 'jx-water-today' },
        h('div', { className: 'jx-card jx-water-glass jx-keep-colour' }, h(Glass, { pct: total / goal, colour: colour }),
          h('p', { className: 'jx-big' }, total.toLocaleString('en-NZ') + ' ml'), h('p', { className: 'jx-muted' }, 'of ' + goal.toLocaleString('en-NZ') + ' ml · ' + glasses + ' of ' + n + ' glasses'),
          party && h('p', { className: 'jx-party', role: 'status' }, '🎉 Ka pai! Goal reached!')),
        h('div', null,
          h('h2', null, 'Tap a drop for each glass'),
          h('div', { className: 'jx-drops' }, Array.from({ length: n }, function (_, k) { return h(Drop, { key: k, on: k < glasses, colour: colour, label: 'Glass ' + (k + 1), onClick: function () { setGlasses(k < glasses && k === glasses - 1 ? k : k + 1); } }); })),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'primary', onClick: function () { add(cup); } }, '+ Glass (' + cup + ' ml)'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { add(500); } }, '+ Bottle (500 ml)'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { add(150); } }, '+ Small cup (150 ml)'),
            h('button', { type: 'button', className: 'secondary', disabled: !entries.length, onClick: function () { setDay(entries.slice(0, -1)); } }, '↶ Undo')),
          h('form', { className: 'jx-row jx-form', onSubmit: function (e) { e.preventDefault(); add(+custom); setCustom(''); } }, h('label', null, 'Other amount (ml)', h('input', { type: 'number', min: 10, max: 1000, value: custom, style: { width: '8em' }, onChange: function (e) { setCustom(e.target.value); } })), h('button', { type: 'submit', className: 'secondary' }, 'Add')),
          h('div', { className: 'jx-stats' },
            h('div', { className: 'jx-stat' }, h('span', null, 'Current streak'), h('strong', null, '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's'))),
            h('div', { className: 'jx-stat' }, h('span', null, 'Goals met'), h('strong', null, '🎯 ' + goalsMet))),
          h('h3', null, 'Badges'),
          h('div', { className: 'jx-badges' }, BADGES.map(function (b) { return h('span', { key: b[1], className: 'jx-badge' + (b[2] ? ' is-on' : '') }, h('span', { 'aria-hidden': true }, b[0]), b[1]); })))),
      tab === 'week' && h('div', null,
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setDate(iso(addD(wk[0], -7))); } }, '← Last week'), h('strong', null, 'Week of ' + wk[0].toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })), h('button', { type: 'button', className: 'secondary', disabled: iso(addD(wk[0], 7)) > todayISO(), onClick: function () { setDate(iso(addD(wk[0], 7))); } }, 'Next week →')),
        h('div', { className: 'jx-week' }, wk.map(function (d, i) {
          var key = iso(d), cnt = Math.round(((rec[key] || []).reduce(function (a, b) { return a + b; }, 0)) / cup), future = key > todayISO();
          return h('div', { key: key, className: 'jx-week-row' + (key === date ? ' is-sel' : '') },
            h('button', { type: 'button', className: 'jx-week-day', onClick: function () { setDate(key); setTab('today'); } }, DAYS[i], h('small', null, d.getDate() + '/' + (d.getMonth() + 1))),
            h('div', { className: 'jx-drops' }, Array.from({ length: n }, function (_, k) { return h(Drop, { key: k, on: k < cnt, colour: colour, label: DAYS[i] + ' glass ' + (k + 1), onClick: function () { if (future) return; var o = Object.assign({}, rec), list = []; var target = k < cnt && k === cnt - 1 ? k : k + 1; for (var z = 0; z < target; z++) list.push(cup); if (list.length) o[key] = list; else delete o[key]; setRec(o); } }); })));
        })),
        h('h2', null, 'Printable weekly tracker'),
        JNZX.poster && h(JNZX.poster.ThemePicker, { value: theme, onChange: setTheme }),
        h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Weekly water tracker poster' })),
        JNZX.poster && h(JNZX.poster.ExportBar, { canvasRef: ref, name: 'TheJamesNZ-water-tracker', title: 'Water tracker' })),
      tab === 'journal' && h('div', null,
        h('div', { className: 'jx-card' },
          h('h2', null, 'How did you feel today?'),
          h('div', { className: 'jx-chips' }, MOODS.map(function (m) { return h('button', { key: m[1], type: 'button', className: 'jx-chip jx-mood' + (J.mood === m[0] + ' ' + m[1] ? ' is-on' : ''), onClick: function () { setJ({ mood: m[0] + ' ' + m[1] }); } }, m[0] + ' ' + m[1]); })),
          h('label', { className: 'jx-block' }, 'Energy: ' + J.energy + ' / 5', h('input', { type: 'range', min: 1, max: 5, value: J.energy, onChange: function (e) { setJ({ energy: +e.target.value }); } })),
          h('div', { className: 'jx-chips' }, TAGS.map(function (tg) { var on = (J.tags || []).indexOf(tg) >= 0; return h('button', { key: tg, type: 'button', className: 'jx-chip' + (on ? ' is-on' : ''), onClick: function () { setJ({ tags: on ? J.tags.filter(function (x) { return x !== tg; }) : (J.tags || []).concat([tg]) }); } }, tg); })),
          h('label', { className: 'jx-block' }, 'Notes', h('textarea', { rows: 4, value: J.note, placeholder: 'e.g. Drank more after my walk — fewer afternoon headaches.', onChange: function (e) { setJ({ note: e.target.value }); } })),
          h('p', { className: 'jx-muted' }, 'Water today: ' + total + ' ml. Your journal is saved on this device only.')),
        h('h2', null, 'Past entries'),
        !jdates.length && h('p', { className: 'jx-muted' }, 'No entries yet. Your notes will appear here.'),
        h('div', { className: 'jx-journal' }, jdates.slice(0, 30).map(function (k) { var e = journal[k], tt = (rec[k] || []).reduce(function (a, b) { return a + b; }, 0); return h('article', { key: k, className: 'jx-card' }, h('p', { className: 'eyebrow' }, parse(k).toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()), h('p', null, h('strong', null, (e.mood || '') + ' · ' + tt + ' ml · energy ' + e.energy + '/5')), e.tags && e.tags.length > 0 && h('p', { className: 'jx-muted' }, e.tags.join(' · ')), e.note && h('p', null, e.note)); })),
        jdates.length > 0 && h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: exportJournal }, 'Download my journal'))),
      tab === 'tips' && h('div', null,
        h('h2', null, 'Ideas to drink more water'),
        h('div', { className: 'jx-cards3' }, IDEAS.map(function (x) { return h('div', { key: x, className: 'jx-card' }, h('p', null, '💧 ' + x)); })),
        h('h2', null, 'My settings'),
        h('div', { className: 'jx-row jx-form' },
          h('label', null, 'Name (optional)', h('input', { value: prefs.name, maxLength: 32, onChange: function (e) { setPrefs(Object.assign({}, prefs, { name: e.target.value })); } })),
          h('label', null, 'Daily goal (ml)', h('input', { type: 'number', min: 500, max: 5000, step: 50, value: goal, style: { width: '8em' }, onChange: function (e) { var v = Math.min(5000, Math.max(500, +e.target.value || 2000)); setPrefs(Object.assign({}, prefs, { goal: v })); } })),
          h('label', null, 'Glass size (ml)', h('input', { type: 'number', min: 50, max: 1000, step: 10, value: cup, style: { width: '8em' }, onChange: function (e) { var v = Math.min(1000, Math.max(50, +e.target.value || 250)); setPrefs(Object.assign({}, prefs, { cup: v })); } })),
          h('label', { className: 'jx-colour' }, h('input', { type: 'color', value: colour, onChange: function (e) { setPrefs(Object.assign({}, prefs, { colour: e.target.value })); } }), 'Drop colour')),
        h('div', { className: 'jx-note' }, 'How much water you need depends on your age, size, activity, the weather and your health. Thirst and pale-yellow urine are good everyday guides. Drink more on hot days and when exercising, and check with your doctor or midwife if you have a health condition, are pregnant or breastfeeding.')),
      h(JNZX.ShareBar, { tab: 'Water tracker', text: 'I’m tracking my water with The James NZ' + (streak > 1 ? ' — ' + streak + '-day streak!' : '.') }));
  }
  try { WaterTracker = WaterIntake; } catch (e) { console.warn('[JNZX] water', e); }
})();

/* Kiwi Adventures › Fresh Picks Today: witty quotes and a shareable picture */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef;
  var WIT = {
    'Peaches': 'Life’s a peach — enjoy every juicy bite.', 'Nectarines': 'A nectarine is just a peach that skipped the fuzz.', 'Apricots': 'Apricots: little suns you can eat.',
    'Plums': 'Plum-believably good.', 'Strawberries': 'Berry happy days start here.', 'Blueberries': 'Feeling blue? Grab a handful of blueberries.',
    'Courgettes': 'Plant one courgette, feed the whole street.', 'Tomatoes': 'Knowledge is knowing a tomato is a fruit. Wisdom is not putting it in a fruit salad.', 'Sweetcorn': 'Summer on a cob — simply a-maize-ing.',
    'Cucumber': 'Stay cool as a cucumber.', 'Capsicum': 'Red, orange or green — nature’s own traffic lights.', 'Green beans': 'Full of beans and ready for the day!',
    'Apples': 'An apple a day keeps the doctor away.', 'Pears': 'The perfect pear for any lunchbox.', 'Feijoas': 'Feijoa season: when Kiwis leave mystery bags on the neighbours’ doorstep.',
    'Kiwifruit': 'Small, fuzzy and full of goodness — a true Kiwi.', 'Persimmons': 'Persimmons: autumn’s sweetest little secret.', 'Grapes': 'Grape things come in bunches.',
    'Pumpkin': 'Soup weather? You gourd-n’t ask for better.', 'Kūmara': 'Every roast is better with a bit of kūmara.', 'Broccoli': 'Tiny trees for growing tall.',
    'Carrots': 'Carrots won’t give you night vision — but they will brighten your plate.', 'Beetroot': 'Simply unbeetable colour.', 'Cauliflower': 'Cauliflower: broccoli’s clever cousin.',
    'Mandarins': 'Easy-peel winter sunshine.', 'Oranges': 'Orange you glad it’s citrus season?', 'Lemons': 'When life gives you lemons, make lemonade.',
    'Leeks': 'Leek-ing with flavour.', 'Cabbage': 'One cabbage, a whole week of crunch.', 'Silverbeet': 'The garden gift that keeps on giving.',
    'Brussels sprouts': 'Love them or not, they’re tiny cabbages full of goodness.', 'Grapefruit': 'A zesty wake-up call.', 'Avocados': 'Holy guacamole — avocados are in!',
    'Asparagus': 'Spring has sprung, and so has the asparagus.', 'Radishes': 'Small, crunchy and totally rad.', 'Lettuce': 'Lettuce celebrate salad season!',
    'Spinach': 'Little leaves, big strength.', 'Spring onions': 'The finishing touch on every dish.'
  };
  var GENERIC = ['Eat a rainbow every day.', 'Fresh from the garden, straight to your heart.', 'Good food is good mood.', 'In season, on the plate, money in your pocket.'];
  function wit(n) { return WIT[n] || GENERIC[n.length % GENERIC.length]; }
  function todayPicks() {
    var date = (typeof nzDate === 'function' ? nzDate() : new Date().toISOString().slice(0, 10)), m = Number(date.slice(5, 7)), season = m === 12 || m <= 2 ? 'Summer' : m <= 5 ? 'Autumn' : m <= 8 ? 'Winter' : 'Spring', data = seasons[season], off = Number(date.slice(8)) % 6;
    var fr = [0, 1, 2].map(function (i) { return data.fruit[(off + i) % 6]; }), vg = [0, 1, 2].map(function (i) { return data.vege[(off + i) % 6]; });
    return { season: season, date: date, fruit: fr, vege: vg, all: fr.concat(vg) };
  }
  function drawPicks(c, p, quoteIdx, sheet) {
    var W = 1080, H = 1350, g = c.getContext('2d'); c.width = W; c.height = H;
    g.fillStyle = '#fbf6ec'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#2f6b3a'; g.fillRect(0, 0, W, 190);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 64px Georgia, serif'; g.fillText('Today’s fresh picks', W / 2, 105);
    g.font = '30px Arial, sans-serif'; g.fillText(p.season + ' in Aotearoa · ' + new Date(p.date + 'T12:00:00').toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, 155);
    var tile = 300, gap = 30, x0 = (W - 3 * tile - 2 * gap) / 2;
    p.all.forEach(function (n, i) {
      var x = x0 + (i % 3) * (tile + gap), y = 230 + Math.floor(i / 3) * (tile + 80), idx = uProduceNames.indexOf(n);
      g.fillStyle = '#fff'; g.beginPath(); g.roundRect ? g.roundRect(x, y, tile, tile, 24) : g.rect(x, y, tile, tile); g.fill();
      if (sheet && idx >= 0) { var sw = sheet.width / 8, sh = sheet.height / 5; g.save(); g.beginPath(); g.roundRect ? g.roundRect(x, y, tile, tile, 24) : g.rect(x, y, tile, tile); g.clip(); g.drawImage(sheet, (idx % 8) * sw, Math.floor(idx / 8) * sh, sw, sh, x, y, tile, tile); g.restore(); }
      g.fillStyle = '#2b2622'; g.font = 'bold 30px Arial, sans-serif'; g.fillText(n, x + tile / 2, y + tile + 44);
    });
    var q = wit(p.all[quoteIdx % p.all.length]);
    g.fillStyle = '#2f6b3a'; g.font = 'italic 44px Georgia, serif';
    var words = q.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > W - 160 && cur) { lines.push(cur); cur = w; } else cur = t; }); lines.push(cur);
    var y0 = 1050 - (lines.length - 1) * 28; lines.forEach(function (l, i) { g.fillText((i === 0 ? '“' : '') + l + (i === lines.length - 1 ? '”' : ''), W / 2, y0 + i * 58); });
    g.fillStyle = '#6b5f55'; g.font = '26px Arial, sans-serif'; g.fillText('Fresh Picks Today · The James NZ · thejamesnz.com', W / 2, H - 50);
  }
  function PicksShare() {
    var p = todayPicks(), qi = useState(0), qIdx = qi[0], setQ = qi[1], ref = useRef(null), sh = useState(null), sheet = sh[0], setSheet = sh[1];
    useEffect(function () { var im = new Image(); im.onload = function () { setSheet(im); }; im.src = jAsset('./oct13/produce-sheet.png'); }, []);
    useEffect(function () { if (ref.current) drawPicks(ref.current, p, qIdx, sheet); }, [qIdx, sheet, p.date]);
    var name = p.all[qIdx % p.all.length];
    return h('section', { className: 'jx-page jx-picks-share' },
      h('div', { className: 'jx-card jx-picks-quote' }, h('p', { className: 'eyebrow' }, 'TODAY’S WITTY PICK · ' + name.toUpperCase()), h('p', { className: 'jx-picks-q' }, '“' + wit(name) + '”'),
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setQ(qIdx + 1); } }, '🔄 Another quote'), h(JNZX.ShareMini, { title: 'Fresh Picks Today', text: 'Today’s fresh picks: ' + p.all.join(', ') + '.\n“' + wit(name) + '”' }))),
      h('h2', null, 'Share today’s picks'),
      h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Fresh picks picture' })),
      JNZX.poster && h(JNZX.poster.ExportBar, { canvasRef: ref, name: 'TheJamesNZ-fresh-picks', title: 'Today’s fresh picks', text: '“' + wit(name) + '” — today’s fresh picks from The James NZ' }));
  }
  try {
    var baseCard = uProducePhoto;
    uProducePhoto = function (props) { return h('div', { className: 'jx-produce-wrap' }, h(baseCard, props), h('p', { className: 'jx-produce-wit' }, wit(props.name))); };
    var baseSP = SeasonalProduce;
    SeasonalProduce = function FreshPicks() { return h(R.Fragment, null, h(baseSP), h(PicksShare)); };
    JNZX.ownShare['Today’s fruit & vege picks'] = 0;
  } catch (e) { console.warn('[JNZX] picks', e); }
})();
