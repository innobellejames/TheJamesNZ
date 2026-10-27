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

  /* ---------------- Coffee & a Smile (simple, all original) ---------------- */
  var CQ = [
    'A warm cup, a kind word, a fresh beginning.',
    'Let the coffee cool while the conversation warms.',
    'Pour a little patience into your morning.',
    'Good company is the best thing beside a coffee cup.',
    'Some mornings begin with coffee; every morning can begin with kindness.',
    'There is room at this table for your story.',
    'Take your time. Even a small cup can hold a lovely moment.',
    'Life is too short for lukewarm coffee and half-hearted hugs.',
    'Sip slowly. The emails will still be there.',
    'Coffee first, then conquer the world — gently.',
    'Every great plan started over a cuppa.',
    'A refill is just a second chance in a mug.',
    'Steam rising, worries lifting.',
    'Friendship is sharing the last biscuit with your flat white.',
    'Today’s forecast: 100% chance of coffee and kindness.',
    'Grind the beans, not yourself.',
    'The best conversations happen between the first sip and the last.',
    'Warm hands, warm heart, warm cup.',
    'Make your coffee strong and your words gentle.',
    'A quiet cup in the morning is a little prayer of thanks.',
    'You’re the cream in someone’s coffee today.',
    'Pause, pour, breathe, begin.',
    'Great things brew slowly.',
    'Hold the cup, hold the moment.',
    'Some problems shrink after a hot drink and a friend.',
    'Mugs are for hugging, coffee is for sharing.',
    'Wake up, smell the coffee, notice the sunshine.',
    'A coffee date is a small promise: I have time for you.',
    'When in doubt, add a little froth.',
    'Your morning cup doesn’t judge. It just helps.',
    'Brew kindness by the potful.',
    'A cuppa on the deck is a holiday in ten minutes.',
    'Let the kettle sing and the day begin.',
    'Coffee tastes better when someone else made it with love.',
    'Busy day? Coffee helps. Friends help more.',
    'Here’s to slow sips and fast friendships.',
    'The secret ingredient is always good company.',
    'A café table for two can fix a week of worries.',
    'Rise and grind — but mostly rise.',
    'Even the strongest espresso needs a gentle hand.',
    'Every mug has a story. What’s in yours today?',
    'Sit, sip, smile, repeat.',
    'A shared pot of coffee is a small feast.',
    'Coffee breaks are tiny holidays. Take them seriously.',
    'Be like a flat white: smooth, warm and quietly strong.',
    'Fill your cup and then fill someone else’s.',
    'Mornings are softer with a mug in hand.',
    'May your coffee be hot and your day be kind.',
    'One cup, two chairs, endless stories.',
    'Slow down — good coffee and good days both take time.'
  ];
  var CF = [
    ['It’s really a seed', 'A coffee bean is the seed found inside a small red fruit called a coffee cherry. Most cherries hold two seeds.'],
    ['Two main types', 'Most coffee comes from two plants: Arabica, which tastes smoother and sweeter, and Robusta, which is stronger and has more caffeine.'],
    ['Grows near the equator', 'Coffee grows best in the “bean belt” — warm, rainy places between the Tropics of Cancer and Capricorn.'],
    ['Cherries ripen unevenly', 'On one branch you can find green, yellow and red cherries at the same time, so careful farms pick by hand several times.'],
    ['Green before roasting', 'Raw coffee beans are pale green and smell grassy. Roasting turns them brown and creates hundreds of aroma compounds.'],
    ['First crack', 'During roasting, beans make a popping sound called “first crack” as moisture escapes — a little like popcorn.'],
    ['Light vs dark roast', 'Light roasts keep more of the bean’s fruity flavour; dark roasts taste bolder and more bitter. Caffeine is very similar in both.'],
    ['Freshness matters', 'Roasted beans taste best within about two to four weeks. Keep them in an airtight container away from light and heat.'],
    ['Grind just before brewing', 'Ground coffee loses aroma quickly. Grinding right before you brew keeps the flavour brighter.'],
    ['Water temperature', 'Just off the boil — around 92–96 °C — is ideal. Boiling water can make coffee taste harsh.'],
    ['Mostly water', 'A cup of brewed coffee is about 98% water, so good-tasting water makes better coffee.'],
    ['Crema', 'The golden foam on an espresso is called crema. It forms when pressure pushes oils and gases out of fresh coffee.'],
    ['Espresso means pressed', 'An espresso is made by pushing hot water through finely ground coffee under high pressure in about 25–30 seconds.'],
    ['Cold brew is slow', 'Cold brew steeps in cold water for 12–24 hours. It tastes smoother and less acidic than hot coffee.'],
    ['Decaf isn’t zero', 'Decaffeinated coffee still has a tiny amount of caffeine — usually just a few milligrams per cup.'],
    ['Caffeine takes time', 'Caffeine usually starts working about 15–45 minutes after your first sip.'],
    ['Milk microfoam', 'Silky café milk is steamed to around 60–65 °C. Hotter milk loses its natural sweetness.'],
    ['Latte art needs microfoam', 'Hearts and rosettas only work when milk has tiny, glossy bubbles — big bubbles won’t hold a pattern.'],
    ['Flat white fame', 'The flat white is a café favourite in Aotearoa: espresso with a thin layer of velvety milk.'],
    ['A fruit tea too', 'The dried skins of coffee cherries can be steeped as a fruity tea called cascara.'],
    ['Coffee trees live long', 'A coffee plant can keep producing cherries for 20 years or more with good care.'],
    ['Shade-grown coffee', 'Some coffee grows under taller trees, which shelters birds and helps protect the soil.'],
    ['Altitude and flavour', 'Beans grown high in the mountains ripen slowly and often taste brighter and more complex.'],
    ['Bloom', 'When hot water first hits fresh grounds, they puff up and bubble. Baristas call this the “bloom”.'],
    ['Grind size matters', 'Fine grounds suit espresso, medium suits pour-over, and coarse grounds suit plungers and cold brew.'],
    ['The golden ratio', 'A good starting point is about 1 gram of coffee to 15–17 grams of water.'],
    ['Tasting like a pro', 'Coffee tasters slurp loudly to spray coffee across the tongue and pick up more flavour.'],
    ['Aroma is half the taste', 'Much of what we “taste” in coffee is really smell. Try sipping while holding your nose — it’s much flatter!'],
    ['Acidity is a good thing', 'In coffee, “acidity” means a bright, lively taste — like a crisp apple — not sourness.'],
    ['Storage myth', 'The fridge isn’t the best place for beans: moisture and smells can sneak in. A cool cupboard is better.'],
    ['Used grounds in the garden', 'Used coffee grounds can be mixed into compost. Add them a little at a time with other green waste.'],
    ['Takeaway cups', 'Most takeaway cups have a plastic lining and can’t go in kerbside recycling. A reusable cup is a small, kind swap.'],
    ['Plunger, a.k.a. French press', 'A plunger steeps coffee in water for about four minutes, then a mesh filter presses the grounds to the bottom.'],
    ['Stovetop pressure', 'A stovetop moka pot uses steam pressure to push water up through the coffee into the top chamber.'],
    ['Pour-over patience', 'Pour-over coffee is made by slowly pouring water in circles through a paper filter for a clean, light cup.'],
    ['Milk alternatives', 'Oat milk steams especially well because it contains natural sugars and a little fat.'],
    ['Why coffee smells so good', 'Roasting creates more than 800 aroma compounds — more than red wine.'],
    ['A cuppa for the kids', 'A “fluffy” — frothed milk with a chocolate dusting and a marshmallow — is a Kiwi café treat with no coffee at all.'],
    ['Sweet without sugar', 'A pinch of cinnamon in the grounds adds warmth and a hint of sweetness without sugar.'],
    ['Coffee and sleep', 'Caffeine can stay in your body for hours, so many people enjoy their last coffee before early afternoon.']
  ];
  var CJ = [
    ['Why did the flat white sit by the window?', 'It wanted a view of the latte-tude.'],
    ['What did the barista say to the shy cup?', 'Don’t worry — you’re going to be grounded in no time.'],
    ['Why did the coffee bean join the choir?', 'It had a rich, full-bodied voice.'],
    ['What’s a coffee cup’s favourite Kiwi beach?', 'Mug-Bay. (Close enough to Mount Maunganui.)'],
    ['Why was the plunger so good at its job?', 'It always pressed on, no matter what.'],
    ['What did the milk say to the espresso?', 'You’re a shot above the rest.'],
    ['Why did the coffee take a nap?', 'It was feeling a little drip-ped out.'],
    ['How does a stovetop pot tell a secret?', 'It lets off a little steam.'],
    ['Why did the kettle get a medal?', 'It always rose to the boil-casion.'],
    ['What do you call a coffee that loves tramping?', 'A long walk black.'],
    ['Why did the biscuit dive into the coffee?', 'It wanted to be dunk-ed into the deep end.'],
    ['What’s the coffee bean’s favourite dance?', 'The roast-a-nova.'],
    ['Why don’t coffee cups ever get lost?', 'They always follow the aroma home.'],
    ['What did the mug say on Monday?', 'Fill me up — I’m running on empty.'],
    ['Why was the cold brew so relaxed?', 'It took its time, all twelve hours of it.'],
    ['How do coffee beans keep fit?', 'Daily grind, of course.'],
    ['What did the sugar cube say before jumping in?', 'Here goes nothing — I’m dissolving my fears!'],
    ['Why did the café hire a sheep?', 'For extra-woolly foam.'],
    ['What did the pour-over say to the impatient customer?', 'Good things filter through slowly.'],
    ['What’s a barista’s favourite game?', 'Hide and steam.'],
    ['Why was the teaspoon always invited?', 'It knew how to stir up a good time.'],
    ['What do you call a coffee with great manners?', 'A pour-lite brew.'],
    ['Why did the latte blush?', 'Someone drew a heart on it.'],
    ['How does a kiwi bird order coffee?', 'Very quietly, at night, with a long beak in the foam.'],
    ['Why did the coffee refuse to argue?', 'It didn’t want things to get bitter.'],
    ['What did one coffee bean say to the other on the farm?', 'Stick with me — we’re a pair from the same cherry.'],
    ['Why did the espresso go to school?', 'To get a little more grounded.'],
    ['What’s the café cat’s favourite drink?', 'A purr-over.'],
    ['Why did the jandal visit the café?', 'For a quick flip and a flat white.'],
    ['What did the empty mug say to the coffee pot?', 'I’ve missed you a hole lot.']
  ];
  var KIWI_CAFE = [
    ['Flat white', 'Espresso with a thin layer of velvety microfoam. A Kiwi café classic — ask for it “extra hot” if you like it steaming.'],
    ['Long black', 'Hot water first, then a double espresso poured on top so the crema stays. Bold and smooth.'],
    ['Fluffy', 'Frothed milk with a chocolate dusting and usually a marshmallow on the side. The kids’ café favourite — no coffee at all.'],
    ['Mochaccino', 'Espresso, chocolate and steamed milk. A sweet treat for a cold afternoon.'],
    ['“Trim” and “extra shot”', 'Trim means low-fat milk. An extra shot adds more espresso. Oat, almond and soy milk are on most café menus.'],
    ['How ordering works', 'Order and pay at the counter, take your table number and your food comes to you. Tipping isn’t expected.'],
    ['Cheese scones and slices', 'A warm cheese scone or a piece of caramel slice beside a flat white is a much-loved café combo.'],
    ['Road-trip stops', 'Coffee caravans, small-town bakeries and old tearooms make a cuppa part of almost every road trip.'],
    ['Bring your own cup', 'Many cafés happily fill reusable cups — and some take a little off the price.'],
    ['Weekend brunch', 'Eggs bene, smashed avo and a long queue on Sunday mornings — brunch is a Kiwi social sport.']
  ];
  var BREW = [
    ['Plunger (French press)', './expansion/coffee-photos-1.webp', '4 min', ['Add 2 heaped tablespoons of coarse coffee per cup.', 'Pour in water just off the boil and stir gently.', 'Put the lid on and wait 4 minutes.', 'Press the plunger down slowly and pour straight away.'], 'Pour it all out so it doesn’t keep brewing and turn bitter.'],
    ['Pour-over', './expansion/coffee-photos-2.webp', '3–4 min', ['Rinse a paper filter with hot water and tip the water out.', 'Add medium-ground coffee (about 15 g for a mug).', 'Pour a little water to wet the grounds and wait 30 seconds for the bloom.', 'Pour the rest slowly in small circles until you reach about 250 ml.'], 'A gooseneck kettle gives you more control, but any kettle works with a steady hand.'],
    ['Stovetop pot', './expansion/coffee-photos-3.webp', '5 min', ['Fill the bottom chamber with hot water up to the valve.', 'Fill the basket with fine coffee and level it — don’t press down.', 'Screw it together and heat on medium.', 'Take it off the heat as soon as it starts to gurgle.'], 'Cool the base under a cold tap to stop it tasting burnt.'],
    ['Espresso machine', './expansion/coffee-photos-0.webp', '30 sec', ['Grind fine and fill the basket (about 18 g for a double).', 'Tamp firmly and evenly.', 'Lock in and brew for about 25–30 seconds.', 'You’re aiming for about 36 g of espresso with golden crema.'], 'Too fast and sour? Grind finer. Too slow and bitter? Grind coarser.'],
    ['Flat white at home', './coffee-posts/coffee-01.webp', '3 min', ['Make a double espresso or very strong stovetop coffee.', 'Heat milk to about 60 °C (too hot to hold for long).', 'Froth just a little to make silky microfoam, then tap and swirl.', 'Pour from low and close so the foam stays thin.'], 'No frother? Shake warm milk in a jar with the lid on, then microwave 20 seconds.'],
    ['Cold brew', './coffee-posts/coffee-02.webp', '12–24 hr', ['Mix 1 cup of coarse coffee with 4 cups of cold water.', 'Cover and leave in the fridge overnight.', 'Strain through a sieve and paper filter.', 'Serve over ice, diluted with water or milk to taste.'], 'Keeps in the fridge for about a week — perfect for summer.'],
    ['Iced latte', './coffee-posts/coffee-03.webp', '2 min', ['Fill a glass with ice.', 'Pour in cold milk, leaving room at the top.', 'Pour a double espresso or strong coffee over the top.', 'Stir, sweeten if you like and enjoy.'], 'Freeze leftover coffee in ice-cube trays so your drink never gets watery.']
  ];
  var CPICS = ['./coffee-posts/coffee-01.webp', './coffee-posts/coffee-02.webp', './coffee-posts/coffee-03.webp', './expansion/coffee-photos-0.webp', './expansion/coffee-photos-1.webp', './expansion/coffee-photos-2.webp', './expansion/coffee-photos-3.webp'];
  function rndi(n, not) { var x = Math.floor(Math.random() * n); if (n > 1 && x === not) x = (x + 1) % n; return x; }
  function SeeAll(props) {
    var o = useState(false), open = o[0], setOpen = o[1];
    return h('div', { className: 'jx-cs-all' },
      h('button', { type: 'button', className: 'secondary', 'aria-expanded': open, onClick: function () { setOpen(!open); } }, open ? 'Hide the list' : '📜 See all ' + props.items.length),
      open && h('ul', { className: 'jx-lift-list' }, props.items.map(function (x, i) {
        return h('li', { key: i }, h('span', null, props.render(x)), h('span', { className: 'jx-lift-li-tools' }, h(JNZX.ShareMini, { title: props.title, text: props.share(x), label: 'Share' })));
      })));
  }
  var CTABS = [['quote', '☕ Quotes'], ['fact', '💡 Facts'], ['joke', '😄 Jokes'], ['brew', '🫖 How to brew'], ['kiwi', '🥝 Kiwi café']];
  function CoffeeSmile() {
    var t = JNZX.useStored('jnzx-coffee-tab', 'quote'), tab = t[0], setTab = t[1];
    var qi = useState(function () { return rndi(CQ.length); }), fi = useState(function () { return rndi(CF.length); }), ji = useState(function () { return rndi(CJ.length); }), ki = useState(0), bi = useState(-1), pun = useState(false);
    var q = CQ[qi[0]], f = CF[fi[0]], j = CJ[ji[0]], k = KIWI_CAFE[ki[0] % KIWI_CAFE.length];
    var body;
    if (tab === 'quote') body = h('div', null,
      h('div', { className: 'jx-cs-photo' }, h(PhotoCard, { text: '“' + q + '”', credit: 'Coffee & a Smile · The James NZ', background: jAsset(CPICS[qi[0] % CPICS.length]), filename: 'TheJamesNZ-coffee-smile', kind: 'coffee' })),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { qi[1](rndi(CQ.length, qi[0])); } }, '🔄 Another quote')),
      h(SeeAll, { items: CQ, title: 'Coffee & a Smile', render: function (x) { return x; }, share: function (x) { return '“' + x + '” — The James NZ'; } }));
    else if (tab === 'fact') body = h('div', null,
      h('div', { className: 'jx-cs-card jx-keep-colour' }, h('small', null, 'DID YOU KNOW? · ' + (fi[0] + 1) + ' OF ' + CF.length), h('h3', null, f[0]), h('p', null, f[1])),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { fi[1](rndi(CF.length, fi[0])); } }, '🔄 Another fact'), h(JNZX.ShareMini, { title: 'Coffee fact', text: 'Did you know? ' + f[0] + ': ' + f[1], label: 'Share' })),
      h(SeeAll, { items: CF, title: 'Coffee fact', render: function (x) { return h(R.Fragment, null, h('strong', null, x[0] + '. '), x[1]); }, share: function (x) { return 'Did you know? ' + x[0] + ': ' + x[1]; } }));
    else if (tab === 'joke') body = h('div', null,
      h('div', { className: 'jx-cs-card jx-cs-joke jx-keep-colour' }, h('small', null, 'COFFEE JOKE'), h('h3', null, j[0]), pun[0] ? h('p', { className: 'jx-cs-pun' }, j[1]) : h('button', { type: 'button', className: 'secondary', onClick: function () { pun[1](true); } }, 'Show the punchline ☕')),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { ji[1](rndi(CJ.length, ji[0])); pun[1](false); } }, '🔄 Another joke'), h(JNZX.ShareMini, { title: 'Coffee joke', text: j[0] + ' … ' + j[1] + ' ☕', label: 'Share' })),
      h(SeeAll, { items: CJ, title: 'Coffee joke', render: function (x) { return h(R.Fragment, null, h('strong', null, x[0] + ' '), x[1]); }, share: function (x) { return x[0] + ' … ' + x[1] + ' ☕'; } }));
    else if (tab === 'brew') { var B = bi[0] >= 0 ? BREW[bi[0]] : null; body = B ? h('div', { className: 'jx-cs-brew' },
      h('button', { type: 'button', className: 'secondary', onClick: function () { bi[1](-1); } }, '← All brew guides'),
      h('img', { src: jAsset(B[1]), alt: B[0], className: 'jx-cs-brew-img' }),
      h('h3', null, B[0], ' ', h('small', null, '· ' + B[2])),
      h('ol', null, B[3].map(function (s, i) { return h('li', { key: i }, s); })),
      h('p', { className: 'jx-cs-tip' }, '💡 ' + B[4]),
      h(JNZX.ShareMini, { title: B[0] + ' — brew guide', text: B[0] + ' (' + B[2] + '):\n' + B[3].map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\nTip: ' + B[4], label: 'Share this guide' }))
      : h('div', { className: 'jx-cs-tiles' }, BREW.map(function (x, i) { return h('button', { key: i, type: 'button', className: 'jx-cs-tile', onClick: function () { bi[1](i); } }, h('img', { src: jAsset(x[1]), alt: '' }), h('strong', null, x[0]), h('small', null, x[2])); })); }
    else body = h('div', null,
      h('div', { className: 'jx-cs-card jx-keep-colour' }, h('small', null, 'KIWI CAFÉ CULTURE · ' + ((ki[0] % KIWI_CAFE.length) + 1) + ' OF ' + KIWI_CAFE.length), h('h3', null, k[0]), h('p', null, k[1])),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { ki[1](ki[0] + 1); } }, '🔄 Next'), h(JNZX.ShareMini, { title: 'Kiwi café culture', text: k[0] + ': ' + k[1], label: 'Share' })),
      h(SeeAll, { items: KIWI_CAFE, title: 'Kiwi café culture', render: function (x) { return h(R.Fragment, null, h('strong', null, x[0] + '. '), x[1]); }, share: function (x) { return x[0] + ': ' + x[1]; } }));
    return h('div', { className: 'jx-page jx-coffee jx-cs' },
      JNZX.Header('EVERYDAY JOY · COFFEE & A SMILE', 'Coffee & a smile.', 'Pick one, enjoy it, share it. All written for The James NZ.'),
      h('div', { className: 'jx-cs-tabs', role: 'tablist', 'aria-label': 'Coffee & a Smile' }, CTABS.map(function (x) {
        return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': tab === x[0], className: tab === x[0] ? 'is-on' : '', onClick: function () { setTab(x[0]); bi[1](-1); } }, x[1]);
      })),
      h('div', { className: 'jx-cs-body', role: 'tabpanel' }, body),
      h('p', { className: 'small-note' }, 'Enjoy coffee in moderation. A fluffy is a great café treat for little ones.'),
      h(JNZX.ShareBar, { tab: 'Coffee corner' }));
  }
  try { CoffeeCorner = CoffeeSmile; } catch (e) { console.warn('[JNZX] coffee', e); }

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
    uProducePhoto = function (props) { return h('div', { className: 'jx-produce-wrap' }, h(baseCard, props), h('p', { className: 'jx-produce-wit' }, wit(props.name)), h('div', { className: 'jx-produce-share' }, h(JNZX.ShareMini, { title: props.name + ' · Fresh Picks Today', text: '🥝 Fresh pick today: ' + props.name + ' — “' + wit(props.name) + '” #FreshPicksNZ', label: 'Share' })) ); };
    var baseSP = SeasonalProduce;
    SeasonalProduce = function FreshPicks() { return h(R.Fragment, null, h(baseSP), h(PicksShare)); };
    JNZX.ownShare['Today’s fruit & vege picks'] = 0;
  } catch (e) { console.warn('[JNZX] picks', e); }
})();
