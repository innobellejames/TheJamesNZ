/* The James NZ — Family Together › School Holiday Fun (October 2026 refresh).
   Three tabs: Homemade creations (9 kid-friendly recipes + printable poster),
   36 indoor activities (dropdown filters, search, compact cards) and a
   Monday–Sunday holiday plan. All wording is original to The James NZ. */
(function () {
  'use strict';
  var JNZX = window.JNZX; if (!JNZX || !JNZX.register) return;
  var R = import_react, h = jH, useState = R.useState, useMemo = R.useMemo, useRef = R.useRef, useEffect = R.useEffect;

  // [emoji, title, colour, ages, time, ingredients[], steps[], note]
  var MAKES = [
    ['🟣', 'Soft playdough', '#f6c8d6', '2–7', '20 min', ['1 cup plain flour', '½ cup salt', '2 tsp cream of tartar', '1 tbsp cooking oil', '1 cup water', 'Food colouring'],
      ['Mix everything in a pot.', 'Stir over low heat until it pulls into a ball (an adult does this part).', 'Cool, then knead until smooth.', 'Store in a sealed bag or container.'], 'Very salty — not for eating, and keep away from dogs.'],
    ['⭐', 'Salt dough keepsakes', '#fde6b8', '3–12', '30 min + drying', ['2 cups plain flour', '1 cup salt', '¾ cup warm water'],
      ['Mix flour and salt, then add water a little at a time.', 'Knead, roll out and cut shapes or press a handprint.', 'Poke a hole for hanging.', 'Air-dry for 2–3 days, or bake at 100 °C for about 2–3 hours, then paint.'], 'An adult handles the oven. Not for eating.'],
    ['☁️', 'Cloud dough', '#d9ecfb', '2–8', '10 min', ['4 cups plain flour', '½ cup cooking oil'],
      ['Pour the flour into a big tub.', 'Add the oil and rub it through with your fingers.', 'It should hold a shape when squeezed and crumble when poked.', 'Add cups, spoons and toy diggers.'], 'Play on a tray or outside — it gets everywhere (in the best way).'],
    ['🫧', 'Bubble mix', '#d6f3ef', '2–10', '5 min + resting', ['4 cups water', '½ cup dishwashing liquid', '1 tbsp sugar (or glycerine)'],
      ['Stir gently so it doesn’t foam.', 'Leave to rest for an hour for stronger bubbles.', 'Make a wand from a bent pipe cleaner or a straw.', 'Blow slowly and watch them float.'], 'Keep it away from eyes. Rinse hands afterwards.'],
    ['🖍️', 'Chalk paint', '#ffe0cc', '3–10', '10 min', ['½ cup cornflour', '½ cup water', 'Food colouring'],
      ['Mix cornflour and water until smooth.', 'Pour into a muffin tin and add a few drops of colour to each hole.', 'Paint on the driveway or path with old brushes.', 'Rinse away with the hose when you’re done.'], 'Test a small patch first and check with your landlord or council about painted paths.'],
    ['🎨', 'Finger paint', '#e7dcfb', '1–6', '20 min', ['½ cup cornflour', '2 cups cold water', 'Food colouring'],
      ['Whisk cornflour into cold water in a pot.', 'An adult heats it, stirring, until thick like custard.', 'Cool, divide into jars and colour.', 'Paint on paper, a tray or the bath wall.'], 'Store in the fridge and use within a few days.'],
    ['🌀', 'Oobleck (magic goo)', '#dff2d8', '3–12', '10 min', ['2 cups cornflour', '1 cup water', 'Food colouring (optional)'],
      ['Tip cornflour into a bowl.', 'Add water slowly and stir.', 'Squeeze it fast — it feels solid. Let go — it runs like liquid.', 'Ask: why does it change?'], 'Scrape leftovers into the bin, not down the sink.'],
    ['🌈', 'Rainbow sensory rice', '#fff1b3', '2–8', '15 min + drying', ['1 cup uncooked rice per colour', '1 tsp white vinegar', 'Food colouring', 'Zip-lock bags'],
      ['Put rice, vinegar and colour in a bag.', 'Seal and shake until coated.', 'Spread on a tray to dry for an hour.', 'Mix the colours in a tub with scoops and cups.'], 'Watch little ones closely — rice is a choking risk for under-3s.'],
    ['🧴', 'Homemade paste', '#eae4da', '3–10', '10 min', ['½ cup plain flour', '½ cup water', 'A pinch of salt'],
      ['Stir flour and water into a smooth paste.', 'Add a little more water if it’s too thick.', 'Spread with a brush or a paddle-pop stick.', 'Use for paper craft, collages and papier-mâché.'], 'Keep in a sealed jar in the fridge for a few days.']
  ];

  function roundRect(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function wrap(g, text, maxW) { var words = text.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { lines.push(cur); cur = w; } else cur = t; }); if (cur) lines.push(cur); return lines; }
  function shade(hex, k) { var n = parseInt(hex.slice(1), 16), r = n >> 16, gg = n >> 8 & 255, b = n & 255; function c(v) { return Math.max(0, Math.min(255, Math.round(v * k))); } return 'rgb(' + c(r) + ',' + c(gg) + ',' + c(b) + ')'; }
  function drawPoster(c) {
    var W = 1240, H = 1754, g = c.getContext('2d'); c.width = W; c.height = H;
    g.fillStyle = '#fffaf0'; g.fillRect(0, 0, W, H);
    // little decorations
    g.fillStyle = '#ffd36b'; g.beginPath(); g.arc(110, 110, 52, 0, 7); g.fill();
    g.strokeStyle = '#ffd36b'; g.lineWidth = 8; for (var i = 0; i < 10; i++) { var a = i * Math.PI / 5; g.beginPath(); g.moveTo(110 + Math.cos(a) * 66, 110 + Math.sin(a) * 66); g.lineTo(110 + Math.cos(a) * 88, 110 + Math.sin(a) * 88); g.stroke(); }
    ['#f28b82', '#fbbc6e', '#fde68a', '#9fd9a8', '#8ec5f0', '#b79cf0'].forEach(function (col, k) { g.strokeStyle = col; g.lineWidth = 14; g.beginPath(); g.arc(1120, 170, 100 - k * 14, Math.PI, 0); g.stroke(); });
    g.textAlign = 'center'; g.fillStyle = '#2f5d50'; g.font = '800 78px "Playfair Display", Georgia, serif';
    g.fillText('9 Homemade Creations', W / 2, 150);
    g.fillStyle = '#d9792b'; g.font = '700 40px Georgia, serif'; g.fillText('for rainy-day hands', W / 2, 205);
    roundRect(g, 220, 238, 800, 58, 29); g.fillStyle = '#fde9b8'; g.fill();
    g.fillStyle = '#5b4a2f'; g.font = '26px Arial, sans-serif'; g.fillText('Simple things kids can make with a grown-up helper', W / 2, 276);
    var cw = 360, ch = 370, gx = 40, x0 = (W - 3 * cw - 2 * gx) / 2, y0 = 330;
    MAKES.forEach(function (m, k) {
      var x = x0 + (k % 3) * (cw + gx), y = y0 + Math.floor(k / 3) * (ch + 28);
      g.save(); g.shadowColor = 'rgba(0,0,0,.08)'; g.shadowBlur = 16; g.shadowOffsetY = 4; roundRect(g, x, y, cw, ch, 26); g.fillStyle = '#fff'; g.fill(); g.restore();
      roundRect(g, x, y, cw, 150, 26); g.fillStyle = m[2]; g.fill(); g.fillRect(x, y + 120, cw, 30);
      g.fillStyle = shade(m[2], 0.55); g.beginPath(); g.arc(x + 42, y + 42, 26, 0, 7); g.fill();
      g.fillStyle = '#fff'; g.font = '800 30px Arial, sans-serif'; g.textAlign = 'center'; g.fillText(String(k + 1), x + 42, y + 53);
      g.font = '84px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillText(m[0], x + cw / 2 + 20, y + 110);
      g.textAlign = 'left'; g.fillStyle = '#2b3a36'; g.font = '700 30px Georgia, serif'; g.fillText(m[1], x + 24, y + 196);
      g.fillStyle = '#7a8a86'; g.font = '20px Arial, sans-serif'; g.fillText('Ages ' + m[3] + ' · ' + m[4], x + 24, y + 226);
      g.fillStyle = '#34443f'; g.font = '22px Arial, sans-serif'; var yy = y + 262;
      m[5].forEach(function (ing) { wrap(g, '• ' + ing, cw - 48).forEach(function (l) { if (yy < y + ch - 12) { g.fillText(l, x + 24, yy); yy += 29; } }); });
    });
    var fy = y0 + 3 * (ch + 28) + 4;
    roundRect(g, 260, fy, 720, 70, 35); g.fillStyle = '#cfe8d5'; g.fill();
    g.textAlign = 'center'; g.fillStyle = '#2f5d50'; g.font = '700 34px Georgia, serif'; g.fillText('Wholesome family fun', W / 2, fy + 47);
    g.fillStyle = '#7a6a55'; g.font = '22px Arial, sans-serif'; g.fillText('Grown-up help recommended. Not for eating. Use food-grade colouring.', W / 2, fy + 106);
    g.fillStyle = '#14243a'; g.font = '700 30px Georgia, serif'; g.fillText('T H E   J A M E S   N Z', W / 2, H - 58);
    g.fillStyle = '#657184'; g.font = '22px Arial, sans-serif'; g.fillText('www.thejamesnz.com', W / 2, H - 24);
  }
  function posterFile() { return new Promise(function (ok, bad) { var c = document.createElement('canvas'); drawPoster(c); c.toBlob(function (b) { b ? ok(new File([b], 'TheJamesNZ-homemade-creations.png', { type: 'image/png' })) : bad(Error('blob')); }, 'image/png'); }); }
  function makeFile(m, k) {
    return new Promise(function (ok, bad) {
      var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
      g.fillStyle = '#fffaf0'; g.fillRect(0, 0, W, H);
      roundRect(g, 60, 60, W - 120, 380, 40); g.fillStyle = m[2]; g.fill();
      g.textAlign = 'center'; g.font = '200px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.fillText(m[0], W / 2, 330);
      g.fillStyle = '#2b3a36'; g.font = '800 64px "Playfair Display", Georgia, serif'; g.fillText(m[1], W / 2, 540);
      g.fillStyle = '#7a8a86'; g.font = '30px Arial, sans-serif'; g.fillText('Ages ' + m[3] + ' · ' + m[4], W / 2, 590);
      g.textAlign = 'left'; g.fillStyle = '#2f5d50'; g.font = '700 34px Arial, sans-serif'; g.fillText('You need', 100, 660);
      g.fillStyle = '#34443f'; g.font = '29px Arial, sans-serif'; var y = 705;
      m[5].forEach(function (s) { g.fillText('• ' + s, 110, y); y += 40; });
      y += 20; g.fillStyle = '#2f5d50'; g.font = '700 34px Arial, sans-serif'; g.fillText('How to make it', 100, y); y += 45; g.fillStyle = '#34443f'; g.font = '28px Arial, sans-serif';
      m[6].forEach(function (s, i) { wrap(g, (i + 1) + '. ' + s, W - 220).forEach(function (l, j) { if (y < H - 150) { g.fillText(j ? '    ' + l : l, 110, y); y += 38; } }); });
      g.textAlign = 'center'; g.fillStyle = '#14243a'; g.font = '700 30px Georgia, serif'; g.fillText('T H E   J A M E S   N Z', W / 2, H - 70);
      g.fillStyle = '#657184'; g.font = '24px Arial, sans-serif'; g.fillText('www.thejamesnz.com', W / 2, H - 32);
      c.toBlob(function (b) { b ? ok(new File([b], 'TheJamesNZ-' + m[1].toLowerCase().replace(/[^a-z]+/g, '-') + '.png', { type: 'image/png' })) : bad(Error('blob')); }, 'image/png');
    });
  }

  function Makes() {
    var ref = useRef(null), op = useState(-1), open = op[0], setOpen = op[1];
    useEffect(function () { if (ref.current) drawPoster(ref.current); try { document.fonts && document.fonts.ready.then(function () { if (ref.current) drawPoster(ref.current); }); } catch (e) {} }, []);
    function download() { posterFile().then(function (f) { var a = document.createElement('a'); a.href = URL.createObjectURL(f); a.download = f.name; document.body.appendChild(a); a.click(); a.remove(); }); }
    function print() { var c = ref.current; if (!c) return; var w = window.open('', '_blank'); if (!w) return; w.document.write('<!doctype html><title>Homemade creations</title><style>@page{margin:8mm}body{margin:0}img{width:100%}</style><img src="' + c.toDataURL('image/png') + '" onload="setTimeout(function(){print()},300)">'); w.document.close(); }
    return h('div', null,
      h('p', { className: 'jx-hol-intro' }, 'Nine simple things to make together from pantry staples. Tap a card for the steps, share one with a friend, or print the poster for the fridge.'),
      h('div', { className: 'jx-make-grid' }, MAKES.map(function (m, k) {
        var on = open === k;
        return h('article', { key: m[1], className: 'jx-make jx-keep-colour' + (on ? ' is-open' : '') },
          h('button', { type: 'button', className: 'jx-make-top', style: { background: m[2] }, 'aria-expanded': on, onClick: function () { setOpen(on ? -1 : k); } },
            h('span', { className: 'jx-make-n' }, k + 1), h('span', { className: 'jx-make-e', 'aria-hidden': true }, m[0])),
          h('div', { className: 'jx-make-body' },
            h('h3', null, m[1]), h('p', { className: 'jx-make-meta' }, 'Ages ' + m[3] + ' · ' + m[4]),
            h('ul', null, m[5].map(function (x) { return h('li', { key: x }, x); })),
            on && h('ol', { className: 'jx-make-steps' }, m[6].map(function (x, i) { return h('li', { key: i }, x); })),
            on && h('p', { className: 'jx-make-note' }, '🦺 ' + m[7]),
            h('div', { className: 'jx-make-tools' },
              h('button', { type: 'button', className: 'secondary', onClick: function () { setOpen(on ? -1 : k); } }, on ? 'Hide steps' : '📋 How to make it'),
              h(JNZX.ShareMini, { label: 'Share', title: m[1] + ' · homemade creation', text: m[0] + ' ' + m[1] + ' (ages ' + m[3] + ')\nYou need: ' + m[5].join(', ') + '\n' + m[6].map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\n🦺 ' + m[7], picture: function () { return makeFile(m, k); } }))));
      })),
      h('section', { className: 'jx-make-poster' },
        h('h2', null, 'The fridge poster'),
        h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Poster of nine homemade creations' })),
        h('div', { className: 'jx-row' },
          h(JNZX.ShareMini, { label: 'Share the poster', title: '9 homemade creations for rainy days', text: '9 homemade creations to make with the kids: ' + MAKES.map(function (m) { return m[1]; }).join(', ') + '.', picture: posterFile }),
          h('button', { type: 'button', className: 'secondary', onClick: download }, '⬇️ Download picture'),
          h('button', { type: 'button', className: 'secondary', onClick: print }, '🖨️ Print'))));
  }

  var TYPE_EMOJI = { 'Make & create': '✂️', 'Quiet & reading': '📚', 'Science & STEM': '🔬', 'Active indoors': '🤸', 'Cook together': '🧁', 'Games': '🎲', 'Kindness & service': '💛' };
  var TYPE_COL = { 'Make & create': '#fde2e4', 'Quiet & reading': '#e2ecfb', 'Science & STEM': '#dff4ec', 'Active indoors': '#fff0cf', 'Cook together': '#ffe6d5', 'Games': '#ece2fb', 'Kindness & service': '#fdf3c4' };
  var AGES = ['All ages', 'Under 5', '5–8', '9–12', 'Teens'];
  function ageOk(r, age) {
    if (age === 'All ages' || r === 'All ages') return true;
    var m = r.match(/(\d+)(?:–(\d+)|\+)?/); if (!m) return true;
    var lo = +m[1], hi = m[2] ? +m[2] : 99, want = { 'Under 5': [0, 4], '5–8': [5, 8], '9–12': [9, 12], 'Teens': [13, 18] }[age];
    return lo <= want[1] && hi >= want[0];
  }
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  function Activities(props) {
    var D = JNZX.holidayData, ACT = D.ACT, FULL = D.ACT_FULL;
    var t = JNZX.useStored('jnzx-hol-type', 'All types'), type = t[0], setType = t[1];
    var a = JNZX.useStored('jnzx-hol-age', 'All ages'), age = a[0], setAge = a[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var pk = useState(null), picked = pk[0], setPicked = pk[1];
    var types = ['All types'].concat(Array.from(new Set(ACT.map(function (x) { return x[1]; }))));
    var rows = ACT.filter(function (x) { return (type === 'All types' || x[1] === type) && ageOk(x[2], age) && (!qq.trim() || (x[0] + ' ' + x[5] + ' ' + x[6]).toLowerCase().indexOf(qq.trim().toLowerCase()) >= 0); });
    var plan = props.plan, setPlan = props.setPlan;
    function inPlan(title) { return plan.some(function (p) { return p.t === title; }); }
    function toggle(title) { setPlan(inPlan(title) ? plan.filter(function (p) { return p.t !== title; }) : plan.concat([{ t: title, d: DAYS[plan.length % 5] }])); }
    return h('div', null,
      h('div', { className: 'jx-hol-filters' },
        h('label', null, 'Type', h('select', { value: type, onChange: function (e) { setType(e.target.value); } }, types.map(function (x) { return h('option', { key: x, value: x }, (TYPE_EMOJI[x] ? TYPE_EMOJI[x] + ' ' : '') + x); }))),
        h('label', null, 'Age', h('select', { value: age, onChange: function (e) { setAge(e.target.value); } }, AGES.map(function (x) { return h('option', { key: x, value: x }, x); }))),
        h('label', null, 'Search', h('input', { type: 'search', value: qq, placeholder: 'e.g. paper, baking, science', onChange: function (e) { setQ(e.target.value); } }))),
      h('div', { className: 'jx-row jx-hol-pick' },
        h('button', { type: 'button', className: 'primary', onClick: function () { setPicked(rows.length ? rows[Math.floor(Math.random() * rows.length)] : null); } }, '🎲 Pick one for us'),
        h('span', { className: 'jx-muted' }, rows.length + ' of ' + ACT.length + ' activities')),
      picked && h('div', { className: 'jx-hol-picked jx-keep-colour', style: { background: TYPE_COL[picked[1]] } }, h('span', { className: 'jx-hol-pe', 'aria-hidden': true }, TYPE_EMOJI[picked[1]] || '✨'), h('div', null, h('strong', null, 'Today: ' + picked[0]), h('p', null, picked[6]))),
      rows.length ? null : h('p', { className: 'jx-note' }, 'No activities match — try “All types” or a different age.'),
      h('div', { className: 'jx-hol-grid' }, rows.map(function (x) {
        var on = inPlan(x[0]), F = FULL[x[0]];
        return h('article', { key: x[0], className: 'jx-hol-card' },
          h('div', { className: 'jx-hol-tile jx-keep-colour', style: { background: TYPE_COL[x[1]] || '#eef2f5' } }, h('span', { 'aria-hidden': true }, TYPE_EMOJI[x[1]] || '✨'), h('small', null, x[1])),
          h('div', { className: 'jx-hol-body' },
            h('h3', null, x[0]),
            h('div', { className: 'jx-hol-badges' }, h('span', null, '👧 ' + x[2]), h('span', null, '⏱ ' + x[3]), h('span', null, '🧽 ' + x[4] + ' mess')),
            h('p', null, x[6]),
            h('details', { className: 'jx-act-full' }, h('summary', null, '📋 You need & full steps'),
              h('p', null, h('strong', null, 'You need: '), x[5]),
              F && h('ol', null, F[0].map(function (s, i) { return h('li', { key: i }, s); })),
              F && h('p', null, h('strong', null, '🌱 What they learn: '), F[1]),
              F && h('p', null, h('strong', null, '🦺 Safety: '), F[2]),
              F && h('p', null, h('strong', null, '⬇️ Easier: '), F[3], ' ', h('strong', null, '⬆️ Harder: '), F[4]),
              F && h('p', null, h('strong', null, '🧹 Clean-up: '), F[5]),
              h('p', { className: 'small-note' }, '💡 ' + x[7])),
            h('div', { className: 'jx-row' },
              h('button', { type: 'button', className: on ? 'primary' : 'secondary', 'aria-pressed': on, onClick: function () { toggle(x[0]); } }, on ? '✓ In our plan' : '+ Add to plan'),
              h(JNZX.ShareMini, { title: x[0], text: (TYPE_EMOJI[x[1]] || '') + ' ' + x[0] + ' (ages ' + x[2] + ', ' + x[3] + ')\nYou need: ' + x[5] + '\n' + x[6] + '\n💡 ' + x[7] }))));
      })));
  }

  function planFile(plan) {
    return new Promise(function (ok, bad) {
      var W = 1080, H = 1350, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d'), D = JNZX.holidayData;
      g.fillStyle = '#fffaf0'; g.fillRect(0, 0, W, H);
      g.textAlign = 'center'; g.fillStyle = '#2f5d50'; g.font = '800 68px "Playfair Display", Georgia, serif'; g.fillText('Our holiday plan', W / 2, 120);
      g.fillStyle = '#d9792b'; g.font = '30px Georgia, serif'; g.fillText('School Holiday Fun · The James NZ', W / 2, 168);
      var y = 220;
      DAYS.forEach(function (d) {
        var items = plan.filter(function (p) { return p.d === d; }); if (!items.length) return;
        if (y > H - 200) return;
        roundRect(g, 80, y, W - 160, 52 + items.length * 42, 22); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#eadfca'; g.lineWidth = 2; g.stroke();
        g.textAlign = 'left'; g.fillStyle = '#14243a'; g.font = '700 32px Georgia, serif'; g.fillText(d, 110, y + 42);
        g.font = '27px Arial, sans-serif'; g.fillStyle = '#34443f';
        items.forEach(function (p, i) { var a = D.ACT.find(function (x) { return x[0] === p.t; }); g.fillText((a && TYPE_EMOJI[a[1]] ? TYPE_EMOJI[a[1]] + '  ' : '• ') + p.t, 130, y + 88 + i * 42); });
        y += 72 + items.length * 42;
      });
      g.textAlign = 'center'; g.fillStyle = '#14243a'; g.font = '700 30px Georgia, serif'; g.fillText('T H E   J A M E S   N Z', W / 2, H - 70);
      g.fillStyle = '#657184'; g.font = '24px Arial, sans-serif'; g.fillText('www.thejamesnz.com', W / 2, H - 32);
      c.toBlob(function (b) { b ? ok(new File([b], 'TheJamesNZ-holiday-plan.png', { type: 'image/png' })) : bad(Error('blob')); }, 'image/png');
    });
  }
  function Plan(props) {
    var plan = props.plan, setPlan = props.setPlan;
    if (!plan.length) return h('div', { className: 'jx-note' }, 'Your plan is empty. Open “Activities” and tap “+ Add to plan” on the ones you like — they’ll appear here, ready to spread across the week.');
    function setDay(t, d) { setPlan(plan.map(function (p) { return p.t === t ? { t: t, d: d } : p; })); }
    var text = 'Our holiday plan\n' + DAYS.map(function (d) { var it = plan.filter(function (p) { return p.d === d; }); return it.length ? d + ': ' + it.map(function (p) { return p.t; }).join(', ') : ''; }).filter(Boolean).join('\n');
    return h('div', null,
      h('div', { className: 'jx-plan-week' }, DAYS.map(function (d) {
        var it = plan.filter(function (p) { return p.d === d; });
        return h('section', { key: d, className: 'jx-plan-day' + (it.length ? '' : ' is-empty') },
          h('h3', null, d),
          it.length ? it.map(function (p) {
            return h('div', { key: p.t, className: 'jx-plan-item' },
              h('span', null, p.t),
              h('select', { 'aria-label': 'Move ' + p.t, value: p.d, onChange: function (e) { setDay(p.t, e.target.value); } }, DAYS.map(function (x) { return h('option', { key: x, value: x }, x.slice(0, 3)); })),
              h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Remove ' + p.t, onClick: function () { setPlan(plan.filter(function (z) { return z.t !== p.t; })); } }, '×'));
          }) : h('p', { className: 'jx-muted' }, 'A free day — leave room for boredom!'));
      })),
      h('div', { className: 'jx-row' },
        h(JNZX.ShareMini, { label: 'Share our plan', title: 'Our holiday plan', text: text, picture: function () { return planFile(plan); } }),
        h('button', { type: 'button', className: 'secondary', onClick: function () { if (confirm('Clear the whole plan?')) setPlan([]); } }, 'Clear plan')));
  }

  function HolidaysPage(props) {
    var tb = JNZX.useStored('jnzx-hol-tab', 'makes'), tab = tb[0], setTab = tb[1];
    var pl = JNZX.useStored('jnzx-holiday-plan2', null), raw = pl[0], setPlan = pl[1];
    var plan = useMemo(function () {
      if (raw) return raw;
      try { var old = JSON.parse(localStorage.getItem('jnzx-holiday-plan') || '[]'); return old.map(function (t, i) { return { t: t, d: DAYS[i % 5] }; }); } catch (e) { return []; }
    }, [raw]);
    var TABS = [['makes', '🎨 Homemade creations'], ['acts', '🏠 Activities (' + JNZX.holidayData.ACT.length + ')'], ['plan', '📅 Our plan' + (plan.length ? ' (' + plan.length + ')' : '')]];
    return h('div', { className: 'jx-hol' },
      JNZX.Header('FAMILY TOGETHER · SCHOOL HOLIDAYS', 'Rainy-day fun for the whole family.', 'Homemade creations, ' + JNZX.holidayData.ACT.length + ' low-cost indoor activities and a simple week planner — all with things you already have at home.'),
      h('div', { className: 'jx-tablist', role: 'tablist' }, TABS.map(function (x) { return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': tab === x[0], className: 'jx-tab' + (tab === x[0] ? ' is-on' : ''), onClick: function () { setTab(x[0]); } }, x[1]); })),
      tab === 'makes' ? h(Makes) : tab === 'acts' ? h(Activities, { plan: plan, setPlan: setPlan }) : h(Plan, { plan: plan, setPlan: setPlan }),
      h('div', { className: 'jx-note' }, h('strong', null, 'Holiday tips: '), 'Plan one “big” activity a day and leave space for free play. Many councils and libraries run free or low-cost school holiday programmes — check your local library’s website.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  }
  JNZX.register('x:holidays', HolidaysPage);

  var css = '.jx-hol-intro{max-width:720px;color:#4a5a56}' +
    '.jx-make-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,260px),1fr));gap:18px;margin:14px 0 26px}' +
    '.jx-make{background:#fff;border-radius:22px;overflow:hidden;box-shadow:0 4px 14px rgba(20,36,58,.08);display:flex;flex-direction:column}' +
    '.jx-make-top{position:relative;border:0!important;border-radius:0!important;padding:0!important;height:120px;display:flex;align-items:center;justify-content:center;cursor:pointer;width:100%}' +
    '.jx-make-n{position:absolute;left:14px;top:14px;width:34px;height:34px;border-radius:50%;background:rgba(0,0,0,.35);color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center}' +
    '.jx-make-e{font-size:64px;line-height:1;filter:drop-shadow(0 4px 6px rgba(0,0,0,.15))}' +
    '.jx-make-body{padding:16px 18px 18px;display:flex;flex-direction:column;gap:6px;flex:1}.jx-make-body h3{margin:0;font-family:"Playfair Display",Georgia,serif;font-size:1.3rem;color:#1f2f2b}' +
    '.jx-make-meta{margin:0;color:#7a8a86;font-size:.88rem}.jx-make-body ul{margin:4px 0;padding-left:18px;font-size:.92rem;color:#34443f}.jx-make-steps{margin:6px 0;padding-left:20px;font-size:.92rem}' +
    '.jx-make-note{margin:0;font-size:.85rem;color:#8a5a2a}.jx-make-tools{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto;padding-top:8px}' +
    '.jx-make-poster canvas{width:100%;max-width:560px;height:auto;display:block;margin:0 auto;border-radius:14px;box-shadow:0 6px 20px rgba(0,0,0,.1)}' +
    '.jx-hol-filters{display:flex;flex-wrap:wrap;gap:12px;margin:14px 0}.jx-hol-filters label{flex:1 1 200px;display:grid;gap:6px;font-weight:700;min-width:0}.jx-hol-filters select,.jx-hol-filters input{width:100%;box-sizing:border-box;font-size:16px}' +
    '.jx-hol-pick{align-items:center}.jx-hol-picked{display:flex;gap:14px;align-items:center;border-radius:18px;padding:14px 18px;margin:10px 0}.jx-hol-picked p{margin:4px 0 0}.jx-hol-pe{font-size:40px}' +
    '.jx-hol-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,290px),1fr));gap:18px;margin:12px 0 24px}' +
    '.jx-hol-card{background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 12px rgba(20,36,58,.08);display:flex;flex-direction:column}' +
    '.jx-hol-tile{display:flex;align-items:center;gap:12px;padding:14px 18px}.jx-hol-tile span{font-size:34px}.jx-hol-tile small{font-weight:700;letter-spacing:.06em;text-transform:uppercase;color:#3b4a46;font-size:.75rem}' +
    '.jx-hol-body{padding:14px 18px 18px;display:flex;flex-direction:column;gap:8px;flex:1}.jx-hol-body h3{margin:0;font-family:"Playfair Display",Georgia,serif;font-size:1.25rem;color:#14243a}.jx-hol-body>p{margin:0;color:#3b4a46;font-size:.95rem;line-height:1.55}' +
    '.jx-hol-badges{display:flex;flex-wrap:wrap;gap:6px}.jx-hol-badges span{background:#f1f5f4;border-radius:999px;padding:3px 10px;font-size:.8rem;color:#3b4a46}' +
    '.jx-hol-body .jx-row{margin-top:auto}' +
    '.jx-plan-week{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,240px),1fr));gap:14px;margin:14px 0}' +
    '.jx-plan-day{background:#fff;border-radius:18px;padding:14px 16px;box-shadow:0 3px 10px rgba(20,36,58,.07)}.jx-plan-day h3{margin:0 0 8px;font-family:"Playfair Display",Georgia,serif}.jx-plan-day.is-empty{opacity:.7}' +
    '.jx-plan-item{display:flex;align-items:center;gap:8px;padding:6px 0;border-top:1px solid #eef1f0}.jx-plan-item span{flex:1;min-width:0}.jx-plan-item select{width:auto;font-size:15px;padding:4px 6px;min-height:34px}' +
    'html[data-reading-theme="dark"] .jx-make,html[data-reading-theme="dark"] .jx-hol-card,html[data-reading-theme="dark"] .jx-plan-day{background:#18211f}' +
    'html[data-reading-theme="dark"] .jx-make-body h3,html[data-reading-theme="dark"] .jx-hol-body h3,html[data-reading-theme="dark"] .jx-plan-day h3{color:#f1f4f3}' +
    'html[data-reading-theme="dark"] .jx-make-body ul,html[data-reading-theme="dark"] .jx-make-steps,html[data-reading-theme="dark"] .jx-hol-body>p,html[data-reading-theme="dark"] .jx-hol-intro{color:#d7e2de}' +
    'html[data-reading-theme="dark"] .jx-hol-badges span{background:#26322f;color:#d7e2de}html[data-reading-theme="dark"] .jx-make-note{color:#f0c48a}html[data-reading-theme="dark"] .jx-hol-tile small,html[data-reading-theme="dark"] .jx-hol-picked *{color:#1f2a2a}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
