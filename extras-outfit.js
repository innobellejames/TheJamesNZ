/* The James NZ — Kiwi Adventures › Weather & What to Wear: "Playtime with Mateo".
   The whole family playing ball with Mateo, dressed for the style and the weather,
   in an animated weather scene, with an outfit check for each person.
   Family pictures: outfit-family/*.webp. Outfits for every style × weather. Original text. */
(function () {
  'use strict';
  var JNZX = window.JNZX = window.JNZX || {};
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect;

  // [emoji, who, outfit]
  var OUT = {
    'Casual': {
      mild: [['👨', 'Dad', 'Cotton tee, light chino shorts or chinos, canvas sneakers and a cap'], ['👩', 'Mum', 'Breezy linen top, cropped trousers or a sundress, comfy sandals'], ['👧', 'Sue & Rae', 'Bright tees, shorts or a play dress, secure sneakers and sunhats'], ['👶', 'Mye', 'Light cotton romper, wide-brim sunhat and a muslin wrap in the pram'], ['🐶', 'Mateo', 'Harness, lead and a water bottle — walk in the shade']],
      cold: [['👨', 'Dad', 'Long-sleeve tee, hoodie or fleece, jeans and walking shoes'], ['👩', 'Mum', 'Knit jumper, puffer vest, jeans and ankle boots'], ['👧', 'Sue & Rae', 'Hoodies, leggings or track pants, warm socks and sneakers'], ['👶', 'Mye', 'Onesie, knitted cardigan, beanie and a blanket over the pram'], ['🐶', 'Mateo', 'Harness and lead — a quick towel-dry after the walk']],
      rain: [['👨', 'Dad', 'Rain jacket with a hood, quick-dry trousers and waterproof shoes'], ['👩', 'Mum', 'Hooded raincoat, dark jeans and gumboots'], ['👧', 'Sue & Rae', 'Bright raincoats, leggings and gumboots — puddle time!'], ['👶', 'Mye', 'Warm onesie, beanie and the pram rain cover'], ['🐶', 'Mateo', 'Lead and an old towel by the door for muddy paws']]
    },
    'Smart casual': {
      mild: [['👨', 'Dad', 'Short-sleeve collared shirt, chinos and loafers or clean sneakers'], ['👩', 'Mum', 'Floaty blouse, midi skirt or linen trousers, flat sandals'], ['👧', 'Sue & Rae', 'Pretty cotton dresses or tidy tops and skirts, sandals with straps'], ['👶', 'Mye', 'Cotton dress or romper with a matching sunhat'], ['🐶', 'Mateo', 'His best collar — and a shady spot to sit']],
      cold: [['👨', 'Dad', 'Collared shirt, knit jumper, chinos and leather shoes'], ['👩', 'Mum', 'Fine-knit top, trench coat or blazer, trousers and ankle boots'], ['👧', 'Sue & Rae', 'Cardigans over dresses, warm tights and Mary Jane shoes'], ['👶', 'Mye', 'Knit dress or jumpsuit, tights, cardigan and a soft beanie'], ['🐶', 'Mateo', 'Collar, lead and a warm blanket in the car']],
      rain: [['👨', 'Dad', 'Shirt and jumper under a smart waterproof jacket, dark chinos and boots'], ['👩', 'Mum', 'Trench coat, trousers, water-resistant boots and a compact umbrella'], ['👧', 'Sue & Rae', 'Raincoats over their outfits, tights and closed shoes or gumboots'], ['👶', 'Mye', 'Warm layers and the pram rain cover'], ['🐶', 'Mateo', 'A short walk and a towel at the door']]
    },
    'Formal': {
      mild: [['👨', 'Dad', 'Light suit or blazer, crisp shirt, tie optional, polished shoes'], ['👩', 'Mum', 'Elegant midi dress or tailored outfit with comfortable block heels'], ['👧', 'Sue & Rae', 'Occasion dresses, cardigans for later and shoes they can walk in'], ['👶', 'Mye', 'Soft occasion dress or romper and a sunhat'], ['🐶', 'Mateo', 'Staying home with a chew toy — or a bow tie for photos!']],
      cold: [['👨', 'Dad', 'Wool suit, shirt and tie, overcoat and leather shoes'], ['👩', 'Mum', 'Long-sleeve dress or tailored suit, wool coat, tights and boots'], ['👧', 'Sue & Rae', 'Velvet or knit dresses, warm tights, coats and dress shoes'], ['👶', 'Mye', 'Knit dress, tights, cardigan and a cosy blanket'], ['🐶', 'Mateo', 'Snug at home — leave the heater on low']],
      rain: [['👨', 'Dad', 'Suit with a dark raincoat, a big umbrella and water-resistant shoes'], ['👩', 'Mum', 'Dress or tailored outfit, trench coat, boots — change into heels inside'], ['👧', 'Sue & Rae', 'Dresses with raincoats over the top, gumboots for the car park'], ['👶', 'Mye', 'Warm layers and the pram rain cover'], ['🐶', 'Mateo', 'Dry and cosy at home']]
    },
    'Home clothes': {
      mild: [['👨', 'Dad', 'Soft tee and shorts'], ['👩', 'Mum', 'Relaxed tee and lounge pants'], ['👧', 'Sue & Rae', 'Play clothes and bare feet or slippers'], ['👶', 'Mye', 'Light cotton bodysuit'], ['🐶', 'Mateo', 'A cool tiled floor and fresh water']],
      cold: [['👨', 'Dad', 'Hoodie, trackpants and warm socks'], ['👩', 'Mum', 'Cosy cardigan, leggings and slippers'], ['👧', 'Sue & Rae', 'Fleece onesies or PJs and non-slip socks'], ['👶', 'Mye', 'Footed sleepsuit and a sleeping bag at nap time'], ['🐶', 'Mateo', 'His bed near the heater']],
      rain: [['👨', 'Dad', 'Comfy jumper and trackpants — movie day'], ['👩', 'Mum', 'Snuggly knit and lounge pants'], ['👧', 'Sue & Rae', 'PJs or comfy play clothes for a blanket fort'], ['👶', 'Mye', 'Warm sleepsuit'], ['🐶', 'Mateo', 'Curled up on the rug']]
    }
  };
  var SCENE = {
    'Casual': { mild: './story-pages/story-15-begin.webp', cold: './story-pages/story-22-end.webp', rain: './story-pages/story-07-begin.webp' },
    'Smart casual': { mild: './story-pages/story-29-begin.webp', cold: './story-pages/story-08-end.webp', rain: './story-pages/story-26-end.webp' },
    'Formal': { mild: './expansion/church-book-0.webp', cold: './expansion/church-book-2.webp', rain: './expansion/church-book-1.webp' },
    'Home clothes': { mild: './story-pages/story-26-begin.webp', cold: './expansion/appachan-book-0.webp', rain: './story-pages/story-07-end.webp' }
  };
  var WX = { mild: ['☀️', 'Warm & dry'], cold: ['🌬️', 'Cool & windy'], rain: ['🌧️', 'Rainy day'] };
  function norm(k) { return k === 'cold' || k === 'rain' ? k : 'mild'; }
  JNZX.outfitList = function (style, kind) { var s = OUT[style] || OUT.Casual; return s[norm(kind)].slice(0, 3).map(function (x) { return x[1] + ': ' + x[2] + '.'; }); };
  JNZX.outfitSet = function (style, kind) { return (OUT[style] || OUT.Casual)[norm(kind)]; };
  JNZX.outfitScene = function (style, kind) { try { return jAsset((SCENE[style] || SCENE.Casual)[norm(kind)]); } catch (e) { return null; } };

  /* ---------- "Playtime with Mateo" outfit check (Nov 2026)
     The whole family playing ball with Mateo, dressed for the weather (sprite sheets:
     4 movement frames across x 3 weather rows: warm, cool, rain), standing in an animated
     weather scene, with the story features: progress bars, badges, a "getting dressed"
     intro, outfit cards for each person, an end card, pause/replay and tap to skip.
     To use new artwork, upload new sheets and change the file names in FAMILY below. ---------- */
  var TIP = {
    mild: ['🧴', 'Slip, slop, slap & wrap: sunscreen on before you go!'],
    cold: ['🧣', 'Pop a spare layer in the bag. Kiwi weather changes fast!'],
    rain: ['🥾', 'Gumboots by the door, and puddle jumping is allowed!']
  };
  var STK = [[/umbrella/i, '☂️'], [/raincoat|rain jacket|jacket|coat|puffer|blazer|parka/i, '🧥'], [/jumper|knit|hoodie|fleece|cardigan|sweater|merino/i, '🧶'],
    [/dress|skirt/i, '👗'], [/shorts/i, '🩳'], [/jeans|trousers|chinos|pants|leggings|track/i, '👖'], [/tee|t-shirt|shirt|top|polo|blouse/i, '👕'],
    [/\btie\b/i, '👔'], [/sunhat|wide-brim|hat/i, '👒'], [/\bcap\b|beanie/i, '🧢'], [/scarf/i, '🧣'], [/gloves|mittens/i, '🧤'],
    [/gumboots|boots/i, '🥾'], [/sandals|jandals/i, '🩴'], [/heels|flats/i, '👠'], [/sneakers|shoes|trainers/i, '👟'],
    [/sunglasses/i, '🕶️'], [/sunscreen/i, '🧴'], [/water/i, '💧'], [/harness|lead/i, '🦮'], [/towel/i, '🧺'], [/blanket|wrap|muslin|onesie|romper/i, '🍼']];
  function stickers(text) { var out = []; STK.forEach(function (s) { if (out.length < 4 && s[0].test(text) && out.indexOf(s[1]) < 0) out.push(s[1]); }); return out; }
  function isNight() { try { var hr = +new Intl.DateTimeFormat('en-NZ', { hour: 'numeric', hourCycle: 'h23', timeZone: 'Pacific/Auckland' }).format(new Date()); return hr >= 20 || hr < 6; } catch (e) { var x = new Date().getHours(); return x >= 20 || x < 6; } }
  function readTemp() { try { var td = document.querySelector('.r-hourly-weather tbody tr td'); var m = td && /(-?\d+)\s*°/.exec(td.textContent); return m ? +m[1] : null; } catch (e) { return null; } }

  function Weather(props) {
    var k = props.kind, night = props.night, bits = [], i;
    bits.push(h('i', { key: 'c1', className: 'jx-ow-cloud c1' }), h('i', { key: 'c2', className: 'jx-ow-cloud c2' }));
    if (k === 'rain') {
      bits.push(h('i', { key: 'c3', className: 'jx-ow-cloud c3 is-dark' }));
      for (i = 0; i < 46; i++) bits.push(h('i', { key: 'd' + i, className: 'jx-ow-drop' + (i % 3 ? '' : ' is-far'), style: { left: (i * 37 % 110 - 5) + '%', animationDelay: (i * 0.11 % 1.1) + 's', animationDuration: (0.55 + (i % 5) * 0.09) + 's' } }));
      for (i = 0; i < 6; i++) bits.push(h('i', { key: 'r' + i, className: 'jx-ow-ripple', style: { left: (8 + i * 16) + '%', bottom: (4 + (i * 7 % 12)) + '%', animationDelay: (i * 0.37) + 's' } }));
    } else if (k === 'cold') {
      for (i = 0; i < 9; i++) bits.push(h('i', { key: 'g' + i, className: 'jx-ow-gust', style: { top: (8 + i * 10) + '%', animationDelay: (i * 0.45) + 's' } }));
      ['🍂', '🍃', '🍁', '🍃', '🍂', '🍃'].forEach(function (e, n) { bits.push(h('span', { key: 'l' + n, className: 'jx-ow-leaf', style: { top: (12 + n * 14) + '%', animationDelay: (n * 0.8) + 's' } }, e)); });
      bits.push(h('span', { key: 'kite', className: 'jx-ow-kite' }, '🪁'));
    } else if (night) {
      bits.push(h('i', { key: 'moon', className: 'jx-ow-moon' }));
      for (i = 0; i < 18; i++) bits.push(h('span', { key: 's' + i, className: 'jx-ow-star', style: { left: (4 + i * 31 % 92) + '%', top: (4 + i * 13 % 38) + '%', animationDelay: (i * 0.27 % 2.4) + 's' } }, '✦'));
    } else {
      bits.push(h('i', { key: 'sun', className: 'jx-ow-sun' }, h('b', null)));
      for (i = 0; i < 8; i++) bits.push(h('span', { key: 'p' + i, className: 'jx-ow-spark', style: { left: (8 + i * 11) + '%', top: (12 + (i * 23 % 55)) + '%', animationDelay: (i * 0.35) + 's' } }, '✦'));
      ['🦋', '🐦', '🦋'].forEach(function (e, n) { bits.push(h('span', { key: 'b' + n, className: 'jx-ow-fly f' + n }, e)); });
    }
    return h('div', { className: 'jx-ow-wx' + (night ? ' is-night' : ''), 'aria-hidden': true }, bits);
  }

  function Glyph(props) {
    var k = props.kind;
    if (k === 'rain') return h('div', { className: 'jx-ow-glyph is-rain' }, h('span', null, '☁️'), h('i', null), h('i', null), h('i', null));
    if (k === 'cold') return h('div', { className: 'jx-ow-glyph is-cold' }, h('span', null, '🌬️'));
    return h('div', { className: 'jx-ow-glyph ' + (props.night ? 'is-moon' : 'is-mild') }, h('span', null, props.night ? '🌙' : '☀️'));
  }

  function CountUp(props) {
    var s = useState(props.to - 8), v = s[0], set = s[1];
    useEffect(function () { var cur = props.to - 8, id = setInterval(function () { cur++; set(cur); if (cur >= props.to) clearInterval(id); }, 70); return function () { clearInterval(id); }; }, [props.to]);
    return h('b', { className: 'jx-ow-temp' }, v + '°C');
  }

  // Family sprite sheets: 1448 x 1086 px, 4 columns (movement frames) x 3 rows (warm, cool, rain), transparent background
  var FAMILY = { 'Casual': './outfit-family/casual.webp', 'Smart casual': './outfit-family/smart-casual.webp', 'Formal': './outfit-family/formal.webp', 'Home clothes': './outfit-family/home-clothes.webp' };
  var ROW = { mild: 0, cold: 1, rain: 2 };
  function familyUrl(style) { return FAMILY[style] || FAMILY.Casual; }
  function Family(props) { return h('div', { className: 'jx-ow-fam is-' + props.row + (props.moving ? ' is-moving' : '') + (props.cls ? ' ' + props.cls : ''), style: { backgroundImage: 'url("' + props.url + '")', backgroundPositionY: (ROW[props.row] * 50) + '%' }, role: props.label ? 'img' : null, 'aria-label': props.label || null, 'aria-hidden': props.label ? null : true }); }

  function OutfitCheck(props) {
    var style = props.style || 'Casual', kind = norm(props.kind), set = OUT[style] ? OUT[style][kind] : OUT.Casual[kind];
    var STEP = 3000, n = set.length + 2, url = familyUrl(style);
    var st = useState(0), step = st[0], setStep = st[1], pl = useState(true), play = pl[0], setPlay = pl[1];
    var red = useState(false), reduced = red[0], setRed = red[1], tp = useState(null), temp = tp[0], setTemp = tp[1];
    var dr = useState(-1), dress = dr[0], setDress = dr[1];
    var night = kind === 'mild' && isNight();
    useEffect(function () { try { var q = matchMedia('(prefers-reduced-motion: reduce)'); setRed(q.matches); } catch (e) {} var id = setTimeout(function () { setTemp(readTemp()); }, 600); return function () { clearTimeout(id); }; }, []);
    useEffect(function () { setStep(0); }, [style, kind]);
    // "getting dressed": the family flips through warm, cool and rain clothes, then lands on today's
    useEffect(function () { if (step !== 0 || reduced) { setDress(-1); return; } var i = 0; setDress(0); var id = setInterval(function () { i++; if (i >= 6) { clearInterval(id); setDress(-1); } else setDress(i); }, 260); return function () { clearInterval(id); }; }, [step, style, kind, reduced]);
    var dur = step === n - 1 ? STEP + 1500 : STEP;
    useEffect(function () { if (!play || reduced) return; var id = setTimeout(function () { setStep(function (s) { return (s + 1) % n; }); }, dur); return function () { clearTimeout(id); }; }, [step, play, reduced, style, kind]);
    function go(d) { setStep(function (s) { return (s + d + n) % n; }); }
    var w = WX[kind], tip = TIP[kind];
    var who = !reduced && step >= 1 && step <= set.length ? set[step - 1] : null;
    var last = step === n - 1 && !reduced, first = step === 0 && !reduced;
    var shown = reduced || last ? set.length : Math.max(0, Math.min(set.length, step));
    var dressRow = dress >= 0 ? ['mild', 'cold', 'rain', 'mild', 'cold', 'rain'][dress] : null;
    var badge = night ? ['🌙', 'Clear night'] : w, moving = play && !reduced;
    var info;
    if (first) info = h('div', { className: 'jx-ow-hello', key: 'hello' }, h(Glyph, { kind: kind, night: night }), h('div', null, h('strong', null, dress >= 0 ? 'Getting dressed… 👕' : 'Kia ora, whānau! ✨'), h('span', null, dress >= 0 ? 'Which clothes for today?' : 'Dressed for ' + (night ? 'a clear night' : w[1].toLowerCase()) + '. Outfit check!')), temp != null && h(CountUp, { to: temp }));
    else if (last) info = h('div', { className: 'jx-ow-end', key: 'end' }, h('strong', null, 'Ready to go! 💖'), h('p', { className: 'jx-ow-tip' }, tip[0] + ' ' + tip[1]), h('span', null, 'The James NZ · www.thejamesnz.com'));
    else info = h('div', { className: 'jx-ow-person', key: 'p' + step },
      who && h('div', { className: 'jx-ow-turn' }, h('span', { className: 'jx-ow-turn-e' }, who[0]), who[1] + '’s look',
        h('span', { className: 'jx-ow-stk', 'aria-hidden': true }, stickers(who[2]).map(function (e, i) { return h('span', { key: i, className: 'jx-ow-s', style: { animationDelay: (0.2 + i * 0.15) + 's' } }, e); }))),
      h('div', { className: 'jx-ow-chips' }, set.slice(0, shown).slice(-3).map(function (x, i, arr) { var isNew = i === arr.length - 1 && !reduced; return h('div', { key: x[1], className: 'jx-ow-chip' + (isNew ? ' is-new' : '') }, h('span', { className: 'jx-ow-e' }, x[0]), h('span', null, h('b', null, x[1] + ': '), x[2]), h('i', { className: 'jx-ow-tick' }, '✓')); })));
    var label = 'Dad, Mum, Sue, Rae, Mye and Mateo playing together in ' + style.toLowerCase() + ' clothes with ' + (kind === 'rain' ? 'waterproof coats' : kind === 'cold' ? 'warm layers' : 'light layers');
    return h('figure', { className: 'family-outfit-figure jx-oc jx-ow jx-keep-colour' },
      h('div', { className: 'jx-ow-card', key: style + kind },
        h('div', { className: 'jx-ow-stage is-' + kind + (night ? ' is-night' : '') + (moving ? ' is-play' : '') },
          h('div', { className: 'jx-fs-sky', 'aria-hidden': true }),
          h('div', { className: 'jx-fs-hills', 'aria-hidden': true }),
          moving && h(Weather, { kind: kind, night: night }),
          h('div', { className: 'jx-fs-ground', 'aria-hidden': true }),
          dressRow ? [h(Family, { key: 'dress' + dress, url: url, row: dressRow, cls: 'is-flip' }), h('span', { key: 'poof' + dress, className: 'jx-ow-poof', 'aria-hidden': true }, '✨')]
            : h(Family, { key: 'fam', url: url, row: kind, moving: moving, label: label }),
          kind === 'rain' && moving && h('div', { className: 'jx-fs-front', 'aria-hidden': true }, Array.apply(null, Array(24)).map(function (_, i) { return h('i', { key: i, className: 'jx-ow-drop', style: { left: (i * 41 % 100) + '%', animationDelay: (i * 0.13 % 1) + 's', animationDuration: (0.6 + (i % 4) * 0.1) + 's' } }); })),
          last && h('div', { className: 'jx-ow-party', 'aria-hidden': true },
            kind === 'rain' && h('i', { className: 'jx-ow-rainbow' }),
            Array.apply(null, Array(28)).map(function (_, i) { return h('i', { key: i, className: 'jx-ow-conf', style: { left: (i * 37 % 100) + '%', background: ['#ffd36b', '#ff8fa3', '#7fd6c8', '#9db7ff', '#d5b16d'][i % 5], animationDelay: (i * 0.06) + 's', animationDuration: (1.8 + (i % 4) * 0.3) + 's' } }); })),
          h('div', { className: 'jx-ow-bars' }, Array.apply(null, Array(n)).map(function (_, i) { return h('span', { key: i, className: i < step ? 'done' : i === step ? 'now' : '' }, h('b', { style: i === step && play && !reduced ? { animationDuration: dur + 'ms' } : null })); })),
          h('div', { className: 'jx-ow-top' }, h('span', { className: 'jx-ow-badge' }, badge[0] + ' ' + badge[1]), temp != null && h('span', { className: 'jx-ow-badge' }, '🌡️ ' + temp + '°C now'), h('span', { className: 'jx-ow-badge is-style' }, style)),
          !reduced && h('button', { type: 'button', className: 'jx-ow-tap is-prev', 'aria-label': 'Previous', onClick: function () { go(-1); } }),
          !reduced && h('button', { type: 'button', className: 'jx-ow-tap is-next', 'aria-label': 'Next', onClick: function () { go(1); } })),
        h('div', { className: 'jx-ow-info', 'aria-live': 'polite' }, info)),
      h('p', { className: 'family-scene-label' }, 'Playtime with Mateo'),
      h('div', { className: 'jx-ow-ctl' },
        h('button', { type: 'button', className: 'secondary', onClick: function () { setPlay(!play); } }, play ? '⏸ Pause' : '▶ Play'),
        h('button', { type: 'button', className: 'secondary', onClick: function () { setStep(0); setPlay(true); } }, '↺ Replay')),
      h('figcaption', null, style + ' · ' + w[1] + (props.manual ? ' · your selected look' : props.confirmed ? ' · matched to today’s forecast' : '') + '. Tap the sides of the picture to skip. Animation inspired by our family.'));
  }
  try { FamilyOutfitAnimation = OutfitCheck; } catch (e) { console.warn('[JNZX] outfit', e); }
  JNZX.OutfitCheck = OutfitCheck;

  var css = '.jx-ow{margin:0;display:grid;gap:10px;justify-items:center}' +
    '.jx-ow-card{width:100%;max-width:460px;border-radius:24px;overflow:hidden;background:#14243a;box-shadow:0 12px 32px rgba(20,36,58,.28)}' +
    '.jx-ow-stage{position:relative;width:100%;aspect-ratio:1/1;overflow:hidden;background:#1d2a3a;isolation:isolate}' +
    '.jx-ow-poof{position:absolute;z-index:3;left:50%;top:46%;font-size:56px;transform:translate(-50%,-50%);animation:jxOwPoof .26s ease-out both;pointer-events:none}@keyframes jxOwPoof{from{opacity:1;transform:translate(-50%,-50%) scale(.4)}to{opacity:0;transform:translate(-50%,-50%) scale(1.6)}}' +
    '.jx-fs-sky{position:absolute;inset:0;background:linear-gradient(#7ec8ff,#cdeeff 62%)}.is-cold .jx-fs-sky{background:linear-gradient(#8aa4c0,#d8e3ee 62%)}.is-rain .jx-fs-sky{background:linear-gradient(#56657d,#a9b6c8 62%)}.is-night .jx-fs-sky{background:linear-gradient(#0d1a45,#2c3f7a 62%)}' +
    '.jx-fs-hills{position:absolute;left:-10%;right:-10%;bottom:22%;height:30%;background:radial-gradient(60% 100% at 25% 100%,#7cc47a 60%,transparent 61%),radial-gradient(55% 90% at 80% 100%,#5fae6a 60%,transparent 61%)}.is-play .jx-fs-hills{animation:jxFsHills 30s ease-in-out infinite alternate}.is-cold .jx-fs-hills{filter:saturate(.6)}.is-rain .jx-fs-hills{filter:saturate(.5) brightness(.85)}.is-night .jx-fs-hills{filter:brightness(.45) saturate(.6)}@keyframes jxFsHills{to{transform:translateX(-5%)}}' +
    '.jx-fs-ground{position:absolute;left:0;right:0;bottom:0;height:24%;background:linear-gradient(#8fd17f,#6dbb63)}.is-cold .jx-fs-ground{background:linear-gradient(#9fbf8f,#86a878)}.is-rain .jx-fs-ground{background:linear-gradient(#6f9a6a,#5b8257)}.is-night .jx-fs-ground{background:linear-gradient(#2f4a36,#243a2b)}' +
    '.is-rain .jx-fs-ground:after{content:"";position:absolute;left:12%;right:12%;top:30%;height:26%;border-radius:50%;background:rgba(160,190,220,.55);filter:blur(1px)}' +
    '.jx-ow-fam{position:absolute;left:9%;bottom:2%;width:82%;aspect-ratio:1;z-index:3;background-repeat:no-repeat;background-size:400% 300%;background-position-x:0;filter:drop-shadow(0 10px 8px rgba(0,0,0,.22))}' +
    '.jx-ow-fam.is-moving{animation:jxOwFrames 1.6s step-end infinite,jxOwFamBob 1.6s ease-in-out infinite}@keyframes jxOwFrames{0%,100%{background-position-x:0%}25%{background-position-x:33.3333%}50%{background-position-x:66.6667%}75%{background-position-x:100%}}' +
    '@keyframes jxOwFamBob{0%,100%{transform:translateY(0)}25%{transform:translateY(-4px) rotate(-.4deg)}50%{transform:translateY(0)}75%{transform:translateY(-3px) rotate(.4deg)}}' +
    '.jx-ow-fam.is-flip{animation:jxOwFlip .26s ease both}@keyframes jxOwFlip{from{opacity:.4;transform:scale(1.04) rotate(-.6deg)}to{opacity:1;transform:none}}.is-night .jx-ow-fam{filter:drop-shadow(0 10px 8px rgba(0,0,0,.3)) brightness(.88)}' +
    '.jx-fs-front{position:absolute;inset:0;z-index:4;pointer-events:none;overflow:hidden;opacity:.6}' +
    '.jx-ow-stage:after{content:"";position:absolute;inset:0;z-index:4;background:linear-gradient(rgba(0,0,0,.25),rgba(0,0,0,0) 18%);pointer-events:none}' +
    '.jx-ow-wx{position:absolute;inset:0;z-index:1;pointer-events:none;overflow:hidden}' +
    '.jx-ow-cloud{position:absolute;width:150px;height:46px;border-radius:40px;background:rgba(255,255,255,.75);filter:blur(2px);animation:jxOwCloud 26s linear infinite}.jx-ow-cloud:before,.jx-ow-cloud:after{content:"";position:absolute;background:inherit;border-radius:50%}.jx-ow-cloud:before{width:70px;height:70px;left:22px;top:-32px}.jx-ow-cloud:after{width:52px;height:52px;left:78px;top:-22px}' +
    '.jx-ow-cloud.c1{top:10%;left:-40%}.jx-ow-cloud.c2{top:20%;left:-40%;transform:scale(.7);opacity:.7;animation-duration:34s;animation-delay:-14s}.jx-ow-cloud.c3{top:4%;left:-40%;animation-duration:20s;animation-delay:-6s}.jx-ow-cloud.is-dark,.is-rain .jx-ow-cloud{background:rgba(120,135,160,.85)}.is-night .jx-ow-cloud{background:rgba(160,170,210,.35)}' +
    '@keyframes jxOwCloud{to{left:130%}}' +
    '.jx-ow-drop{position:absolute;top:-12%;width:2px;height:20px;background:linear-gradient(transparent,rgba(225,238,255,.95));border-radius:2px;animation:jxOwRain .7s linear infinite}.jx-ow-drop.is-far{height:12px;opacity:.5}' +
    '@keyframes jxOwRain{to{transform:translate(-36px,560px)}}' +
    '.jx-ow-ripple{position:absolute;width:34px;height:10px;border:2px solid rgba(255,255,255,.7);border-radius:50%;opacity:0;animation:jxOwRip 1.6s ease-out infinite}@keyframes jxOwRip{0%{transform:scale(.2);opacity:.9}100%{transform:scale(1.6);opacity:0}}' +
    '.jx-ow-gust{position:absolute;left:-40%;width:45%;height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);animation:jxOwGust 3s ease-in infinite}@keyframes jxOwGust{0%{transform:translateX(0);opacity:0}20%{opacity:1}100%{transform:translateX(330%);opacity:0}}' +
    '.jx-ow-leaf{position:absolute;left:-10%;font-size:22px;animation:jxOwLeaf 4.6s linear infinite}@keyframes jxOwLeaf{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(250px,36px) rotate(200deg)}100%{transform:translate(520px,-10px) rotate(420deg)}}' +
    '.jx-ow-kite{position:absolute;right:10%;top:16%;font-size:34px;animation:jxOwKite 2.2s ease-in-out infinite alternate}@keyframes jxOwKite{from{transform:translate(0,0) rotate(-12deg)}to{transform:translate(-14px,10px) rotate(14deg)}}' +
    '.jx-ow-sun{position:absolute;right:-50px;top:-50px;width:200px;height:200px;border-radius:50%;background:radial-gradient(rgba(255,244,190,.95),rgba(255,214,107,.4) 45%,transparent 70%);animation:jxOwPulse 4s ease-in-out infinite}' +
    '.jx-ow-sun b{position:absolute;inset:-30px;border-radius:50%;background:repeating-conic-gradient(rgba(255,236,160,.35) 0 6deg,transparent 6deg 22deg);-webkit-mask:radial-gradient(transparent 30%,#000 45%,transparent 72%);mask:radial-gradient(transparent 30%,#000 45%,transparent 72%);animation:jxOwSpin 24s linear infinite}' +
    '@keyframes jxOwPulse{0%,100%{transform:scale(1)}50%{transform:scale(1.12)}}@keyframes jxOwSpin{to{transform:rotate(360deg)}}' +
    '.jx-ow-spark,.jx-ow-star{position:absolute;color:#fff6c8;font-size:15px;text-shadow:0 0 8px #ffd36b;animation:jxOwTw 2.4s ease-in-out infinite;opacity:0}.jx-ow-star{font-size:11px;color:#fff;text-shadow:0 0 6px #b9c8ff}' +
    '@keyframes jxOwTw{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.2)}}' +
    '.jx-ow-moon{position:absolute;right:14px;top:40px;width:38px;height:38px;border-radius:50%;box-shadow:-10px 6px 0 0 #fff3c4;filter:drop-shadow(0 0 14px rgba(255,243,196,.7));animation:jxOwPulse 5s ease-in-out infinite}' +
    '.jx-ow-fly{position:absolute;font-size:20px}.jx-ow-fly.f0{top:28%;animation:jxOwFly 9s linear infinite}.jx-ow-fly.f1{top:14%;font-size:16px;animation:jxOwFly 12s linear infinite;animation-delay:-5s}.jx-ow-fly.f2{top:40%;font-size:16px;animation:jxOwFly 10s linear infinite reverse;animation-delay:-3s}' +
    '@keyframes jxOwFly{0%{left:-10%;transform:translateY(0)}25%{transform:translateY(-18px)}50%{transform:translateY(6px)}75%{transform:translateY(-12px)}100%{left:110%;transform:translateY(0)}}' +
    '.jx-ow-party{position:absolute;inset:0;z-index:3;pointer-events:none;overflow:hidden}.jx-ow-conf{position:absolute;top:-14px;width:8px;height:12px;border-radius:2px;animation:jxOwConf 2s ease-in both}' +
    '@keyframes jxOwConf{0%{transform:translateY(0) rotate(0);opacity:1}100%{transform:translateY(480px) rotate(560deg);opacity:0}}' +
    '.jx-ow-rainbow{position:absolute;left:50%;top:6%;width:300px;height:150px;margin-left:-150px;border-radius:150px 150px 0 0;background:radial-gradient(circle at 50% 100%,transparent 52%,#9d6bff 53%,#5b8cff 59%,#4cc3ff 65%,#6bd36b 71%,#ffe066 77%,#ffa94d 83%,#ff6b6b 89%,transparent 90%);opacity:.7;animation:jxOwPop 1s ease both}' +
    '.jx-ow-bars{position:absolute;z-index:5;left:12px;right:12px;top:10px;display:flex;gap:4px}.jx-ow-bars span{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.35);overflow:hidden}' +
    '.jx-ow-bars span.done b{width:100%}.jx-ow-bars b{display:block;height:100%;width:0;background:#fff}.jx-ow-bars span.now b{animation:jxOwBar linear forwards}.jx-ow-stage:not(.is-play) .jx-ow-bars span.now b{width:100%;animation:none}@keyframes jxOwBar{to{width:100%}}' +
    '.jx-ow-top{position:absolute;z-index:5;left:12px;right:12px;top:22px;display:flex;gap:6px;flex-wrap:wrap}' +
    '.jx-ow-badge{background:rgba(255,255,255,.92);color:#14243a;border-radius:999px;padding:4px 11px;font-size:13px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.15)}.jx-ow-badge.is-style{background:#d5b16d;color:#14243a}' +
    '.jx-ow-tap{position:absolute;z-index:6;top:12%;bottom:0;width:30%;background:transparent!important;border:0!important;padding:0!important;cursor:pointer;opacity:0}.jx-ow-tap.is-prev{left:0}.jx-ow-tap.is-next{right:0}.jx-ow-tap:focus-visible{opacity:1;outline:3px solid #d5b16d!important}' +
    '.jx-ow-info{background:#14243a;color:#fff;padding:12px 12px 14px;min-height:178px;display:grid;align-content:start}' +
    '.jx-ow-hello{display:grid;grid-template-columns:auto 1fr auto;gap:12px;align-items:center;padding:8px 6px;animation:jxOwPop .5s ease both}.jx-ow-hello strong,.jx-ow-end strong{display:block;font-family:"Playfair Display",Georgia,serif;font-size:26px;line-height:1.15;color:#fff}.jx-ow-hello span{color:#cfd9e6;font-weight:600;font-size:14px}' +
    '.jx-ow-temp{font-size:38px;font-weight:900;line-height:1;color:#ffe7a6}' +
    '.jx-ow-glyph{position:relative;font-size:52px;line-height:1;width:62px;height:62px;display:grid;place-items:center}.jx-ow-hello .jx-ow-glyph span{font-size:52px;color:inherit}.jx-ow-glyph.is-mild span{display:inline-block;animation:jxOwSpin 10s linear infinite}.jx-ow-glyph.is-cold span{display:inline-block;animation:jxOwWob 1.2s ease-in-out infinite alternate}.jx-ow-glyph.is-moon span,.jx-ow-glyph.is-rain span{display:inline-block;animation:jxOwBob 1.6s ease-in-out infinite alternate}' +
    '.jx-ow-glyph.is-rain i{position:absolute;top:46px;width:3px;height:12px;border-radius:2px;background:#bfe0ff;animation:jxOwGl 1s linear infinite}.jx-ow-glyph.is-rain i:nth-of-type(1){left:28%}.jx-ow-glyph.is-rain i:nth-of-type(2){left:48%;animation-delay:.3s}.jx-ow-glyph.is-rain i:nth-of-type(3){left:68%;animation-delay:.6s}' +
    '@keyframes jxOwWob{from{transform:rotate(-10deg)}to{transform:rotate(10deg) translateX(6px)}}@keyframes jxOwBob{from{transform:translateY(0)}to{transform:translateY(-6px)}}@keyframes jxOwGl{from{transform:translateY(0);opacity:1}to{transform:translateY(22px);opacity:0}}' +
    '.jx-ow-person{display:grid;gap:8px}.jx-ow-turn{display:flex;gap:8px;align-items:center;font-weight:800;font-size:16px;color:#ffe7a6;animation:jxOwSlide .45s cubic-bezier(.2,1.3,.5,1) both}.jx-ow-turn-e{font-size:24px}' +
    '.jx-ow-stk{display:flex;gap:6px;margin-left:auto}.jx-ow-s{width:38px;height:38px;display:grid;place-items:center;font-size:22px;background:#fff;border-radius:50%;box-shadow:0 0 0 2px #d5b16d;animation:jxOwStk .55s cubic-bezier(.2,1.5,.5,1) both}' +
    '@keyframes jxOwStk{0%{opacity:0;transform:translateY(10px) scale(.2) rotate(-30deg)}70%{opacity:1;transform:scale(1.15) rotate(8deg)}100%{opacity:1;transform:none}}' +
    '.jx-ow-chips{display:grid;gap:6px}' +
    '.jx-ow-chip{display:flex;gap:8px;align-items:flex-start;background:rgba(255,255,255,.95);color:#1f2a2a;border-radius:14px;padding:7px 11px;font-size:13px;line-height:1.35}.jx-ow-chip > span:nth-child(2){flex:1}' +
    '.jx-ow-chip b{color:#14243a}.jx-ow-chip.is-new{animation:jxOwSlide .5s cubic-bezier(.2,1.3,.5,1) both}.jx-ow-e{font-size:20px;line-height:1}' +
    '.jx-ow-tick{font-style:normal;font-weight:900;color:#fff;background:#168c89;border-radius:50%;width:20px;height:20px;display:grid;place-items:center;font-size:12px;flex:none}.jx-ow-chip.is-new .jx-ow-tick{animation:jxOwTick .4s ease 1s both}' +
    '@keyframes jxOwSlide{from{opacity:0;transform:translateX(-24px) scale(.95)}to{opacity:1;transform:none}}@keyframes jxOwTick{from{transform:scale(0)}70%{transform:scale(1.3)}to{transform:scale(1)}}' +
    '@keyframes jxOwPop{from{opacity:0;transform:translateY(12px) scale(.94)}to{opacity:1;transform:none}}' +
    '.jx-ow-end{display:grid;gap:8px;justify-items:center;text-align:center;padding:10px 6px;animation:jxOwPop .5s ease both}.jx-ow-tip{margin:0;background:rgba(255,255,255,.95);color:#14243a;border-radius:14px;padding:8px 12px;font-size:14px;font-weight:700}.jx-ow-end span{color:#cfd9e6;font-size:13px;font-weight:600}' +
    '.jx-ow-ctl{display:flex;gap:8px}.jx-ow figcaption{font-size:.85rem;color:#657184;text-align:center}' +
    '@media (prefers-reduced-motion:reduce){.jx-ow-wx,.jx-ow-party,.jx-fs-front{display:none}.jx-ow-fam,.jx-fs-hills{animation:none!important}}' +
    'html[data-reading-theme="dark"] .jx-ow figcaption{color:#b8c4c1}';
  var el = document.createElement('style'); el.id = 'jx-ow-css'; el.textContent = css; document.head.appendChild(el);
})();
