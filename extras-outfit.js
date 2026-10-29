/* The James NZ — Kiwi Adventures › Weather & What to Wear: "Outfit check".
   A short, story-style animation: the camera pans slowly over the family,
   weather moves across the scene (sun, wind, rain) and each person's
   outfit pops up in turn. Outfits for every style × weather. Original text. */
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

  function Weather(props) {
    var k = props.kind, bits = [];
    if (k === 'rain') { for (var i = 0; i < 40; i++) bits.push(h('i', { key: i, className: 'jx-oc-drop', style: { left: (i * 37 % 100) + '%', animationDelay: (i * 0.13 % 1.2) + 's', animationDuration: (0.6 + (i % 5) * 0.08) + 's' } })); }
    else if (k === 'cold') { for (var j = 0; j < 9; j++) bits.push(h('i', { key: j, className: 'jx-oc-gust', style: { top: (8 + j * 10) + '%', animationDelay: (j * 0.45) + 's' } })); ['🍂', '🍃', '🍂', '🍃', '🍁'].forEach(function (e, n) { bits.push(h('span', { key: 'l' + n, className: 'jx-oc-leaf', style: { top: (15 + n * 16) + '%', animationDelay: (n * 0.9) + 's' } }, e)); }); }
    else { bits.push(h('i', { key: 's', className: 'jx-oc-sun' })); for (var m = 0; m < 10; m++) bits.push(h('span', { key: 'p' + m, className: 'jx-oc-spark', style: { left: (8 + m * 9) + '%', top: (10 + (m * 23 % 60)) + '%', animationDelay: (m * 0.3) + 's' } }, '✦')); }
    return h('div', { className: 'jx-oc-wx', 'aria-hidden': true }, bits);
  }

  function OutfitCheck(props) {
    var style = props.style || 'Casual', kind = norm(props.kind), set = OUT[style] ? OUT[style][kind] : OUT.Casual[kind];
    var STEP = 2600, n = set.length + 2;
    var st = useState(0), step = st[0], setStep = st[1], pl = useState(true), play = pl[0], setPlay = pl[1];
    var red = useState(false), reduced = red[0], setRed = red[1];
    useEffect(function () { try { var q = matchMedia('(prefers-reduced-motion: reduce)'); setRed(q.matches); } catch (e) {} }, []);
    useEffect(function () { setStep(0); }, [style, kind]);
    useEffect(function () { if (!play || reduced) return; var id = setTimeout(function () { setStep(function (s) { return (s + 1) % n; }); }, STEP); return function () { clearTimeout(id); }; }, [step, play, reduced, style, kind]);
    var src = JNZX.outfitScene(style, kind), w = WX[kind];
    var shown = reduced ? set.length : Math.max(0, Math.min(set.length, step - 0));
    return h('figure', { className: 'family-outfit-figure jx-oc jx-keep-colour' },
      h('div', { className: 'jx-oc-stage is-' + kind + (play && !reduced ? ' is-play' : ''), key: style + kind },
        h('img', { className: 'jx-oc-img', src: src, alt: 'The James family dressed ' + style.toLowerCase() + ' for ' + w[1].toLowerCase() + ' weather' }),
        h(Weather, { kind: kind }),
        h('div', { className: 'jx-oc-bars' }, Array.apply(null, Array(n)).map(function (_, i) { return h('span', { key: i, className: i < step ? 'done' : i === step ? 'now' : '' }, h('b', { style: i === step && play && !reduced ? { animationDuration: STEP + 'ms' } : null })); })),
        h('div', { className: 'jx-oc-top' }, h('span', { className: 'jx-oc-badge' }, w[0] + ' ' + w[1]), h('span', { className: 'jx-oc-badge is-style' }, style)),
        step === 0 && !reduced && h('div', { className: 'jx-oc-hello' }, h('strong', null, 'Kia ora, whānau! ✨'), h('span', null, 'Let’s do a quick outfit check')),
        h('div', { className: 'jx-oc-chips' }, set.slice(0, shown).slice(-3).map(function (x, i, arr) { return h('div', { key: x[1], className: 'jx-oc-chip' + (i === arr.length - 1 && !reduced ? ' is-new' : '') }, h('span', { className: 'jx-oc-e' }, x[0]), h('span', null, h('b', null, x[1] + ': '), x[2])); })),
        step === n - 1 && !reduced && h('div', { className: 'jx-oc-end' }, h('strong', null, 'Ready to go! 💖'), h('span', null, 'The James NZ · www.thejamesnz.com'))),
      h('div', { className: 'jx-oc-ctl' },
        h('button', { type: 'button', className: 'secondary', onClick: function () { setPlay(!play); } }, play ? '⏸ Pause' : '▶ Play'),
        h('button', { type: 'button', className: 'secondary', onClick: function () { setStep(0); setPlay(true); } }, '↺ Replay')),
      h('figcaption', null, style + ' · ' + w[1] + (props.manual ? ' · your selected look' : props.confirmed ? ' · matched to today’s forecast' : '') + '. Animation inspired by our family.'));
  }
  try { FamilyOutfitAnimation = OutfitCheck; } catch (e) { console.warn('[JNZX] outfit', e); }
  JNZX.OutfitCheck = OutfitCheck;

  var css = '.jx-oc{margin:0;display:grid;gap:10px;justify-items:center}' +
    '.jx-oc-stage{position:relative;width:100%;max-width:380px;aspect-ratio:9/14;border-radius:22px;overflow:hidden;background:#1d2a3a;box-shadow:0 10px 30px rgba(20,36,58,.25)}' +
    'html body main .jx-oc-stage img.jx-oc-img{position:absolute!important;left:0;top:0;width:100%!important;height:100%!important;max-width:none!important;max-height:none!important;margin:0!important;border-radius:0!important;object-fit:cover!important;object-position:50% 0%;transform:scale(1.04)}' +
    '.jx-oc-stage.is-play .jx-oc-img{animation:jxOcPan 9s ease-in-out infinite alternate}' +
    '@keyframes jxOcPan{0%{object-position:50% 0%;transform:scale(1.08)}100%{object-position:50% 100%;transform:scale(1)}}' +
    '.jx-oc-stage:after{content:"";position:absolute;inset:0;background:linear-gradient(rgba(0,0,0,.35),rgba(0,0,0,0) 22%,rgba(0,0,0,0) 45%,rgba(0,0,0,.55));pointer-events:none}' +
    '.jx-oc-stage.is-rain:after{background:linear-gradient(rgba(30,45,70,.45),rgba(30,45,70,.12) 30%,rgba(0,0,0,.55))}' +
    '.jx-oc-stage.is-cold:after{background:linear-gradient(rgba(60,90,130,.35),rgba(0,0,0,0) 30%,rgba(0,0,0,.55))}' +
    '.jx-oc-wx{position:absolute;inset:0;z-index:2;pointer-events:none;overflow:hidden}' +
    '.jx-oc-drop{position:absolute;top:-10%;width:2px;height:18px;background:linear-gradient(transparent,rgba(220,235,255,.95));border-radius:2px;animation:jxOcRain .8s linear infinite}' +
    '@keyframes jxOcRain{to{transform:translate(-30px,120vh)}}' +
    '.jx-oc-gust{position:absolute;left:-40%;width:45%;height:3px;border-radius:3px;background:linear-gradient(90deg,transparent,rgba(255,255,255,.85),transparent);animation:jxOcGust 3.2s ease-in infinite}' +
    '@keyframes jxOcGust{0%{transform:translateX(0);opacity:0}20%{opacity:1}100%{transform:translateX(330%);opacity:0}}' +
    '.jx-oc-leaf{position:absolute;left:-10%;font-size:22px;animation:jxOcLeaf 4.5s linear infinite}' +
    '@keyframes jxOcLeaf{0%{transform:translate(0,0) rotate(0)}50%{transform:translate(60vw,30px) rotate(200deg)}100%{transform:translate(130vw,-10px) rotate(420deg)}}' +
    '.jx-oc-sun{position:absolute;right:-60px;top:-60px;width:220px;height:220px;border-radius:50%;background:radial-gradient(rgba(255,240,180,.9),rgba(255,214,107,.35) 45%,transparent 70%);animation:jxOcSun 4s ease-in-out infinite}' +
    '@keyframes jxOcSun{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}' +
    '.jx-oc-spark{position:absolute;color:#fff6c8;font-size:16px;text-shadow:0 0 8px #ffd36b;animation:jxOcTw 2.4s ease-in-out infinite;opacity:0}' +
    '@keyframes jxOcTw{0%,100%{opacity:0;transform:scale(.5)}50%{opacity:1;transform:scale(1.2)}}' +
    '.jx-oc-bars{position:absolute;z-index:4;left:12px;right:12px;top:10px;display:flex;gap:4px}.jx-oc-bars span{flex:1;height:3px;border-radius:3px;background:rgba(255,255,255,.35);overflow:hidden}' +
    '.jx-oc-bars span.done b{width:100%}.jx-oc-bars b{display:block;height:100%;width:0;background:#fff}.jx-oc-bars span.now b{animation:jxOcBar linear forwards}' +
    '.jx-oc-stage:not(.is-play) .jx-oc-bars span.now b{width:100%;animation:none}@keyframes jxOcBar{to{width:100%}}' +
    '.jx-oc-top{position:absolute;z-index:4;left:12px;right:12px;top:24px;display:flex;gap:6px;flex-wrap:wrap}' +
    '.jx-oc-badge{background:rgba(255,255,255,.92);color:#14243a;border-radius:999px;padding:4px 11px;font-size:13px;font-weight:700;box-shadow:0 2px 6px rgba(0,0,0,.15)}.jx-oc-badge.is-style{background:#d5b16d;color:#14243a}' +
    '.jx-oc-hello,.jx-oc-end{position:absolute;z-index:4;left:16px;right:16px;top:38%;text-align:center;color:#fff;display:grid;gap:6px;animation:jxOcPop .5s ease both;text-shadow:0 2px 10px rgba(0,0,0,.6)}' +
    '.jx-oc-hello strong,.jx-oc-end strong{font-family:"Playfair Display",Georgia,serif;font-size:30px;line-height:1.15}.jx-oc-hello span,.jx-oc-end span{font-size:16px;font-weight:600}' +
    '.jx-oc-chips{position:absolute;z-index:4;left:10px;right:10px;bottom:12px;display:grid;gap:6px}' +
    '.jx-oc-chip{display:flex;gap:8px;align-items:flex-start;background:rgba(255,255,255,.94);color:#1f2a2a;border-radius:14px;padding:7px 11px;font-size:13px;line-height:1.35;box-shadow:0 3px 10px rgba(0,0,0,.18)}' +
    '.jx-oc-chip b{color:#14243a}.jx-oc-chip.is-new{animation:jxOcPop .45s cubic-bezier(.2,1.4,.5,1) both}.jx-oc-e{font-size:20px;line-height:1}' +
    '@keyframes jxOcPop{from{opacity:0;transform:translateY(14px) scale(.92)}to{opacity:1;transform:none}}' +
    '.jx-oc-ctl{display:flex;gap:8px}.jx-oc figcaption{font-size:.85rem;color:#657184;text-align:center}' +
    '@media (prefers-reduced-motion:reduce){.jx-oc-wx{display:none}.jx-oc-img{transform:none}}' +
    'html[data-reading-theme="dark"] .jx-oc figcaption{color:#b8c4c1}';
  var el = document.createElement('style'); el.textContent = css; document.head.appendChild(el);
})();
