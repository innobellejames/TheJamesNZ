/* The James NZ — printables shop, support page, privacy & terms, monthly
   email sign-up, "Add to home screen" and AdSense helpers (November 2026).
   Settings live in jnz-config.js. */
(function () {
  'use strict';
  var JNZX = window.JNZX; if (!JNZX || !JNZX.register) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef;
  var C = window.JNZ_CONFIG || {};
  function cfg(k, d) { return C[k] != null ? C[k] : d; }
  function go(props, tab) { if (props && props.navigate) props.navigate(tab); else location.hash = 'section=' + encodeURIComponent(tab); try { window.scrollTo(0, 0); } catch (e) {} }

  var PRODUCTS = [
    { id: 'kiwi-bucket-list', cat: 'kiwi', title: 'Kiwi Family Bucket List', emoji: '🗺️', pages: 22, sub: '20 family ideas for each of New Zealand’s 16 regions, plus an adventure log and space for your own plans.', inside: ['16 region pages with 20 tick-box ideas each (320 ideas)', 'How-to-use and safety page', '“Our own adventures” page', '2-page adventure log with star ratings'] },
    { id: 'school-holiday-fun', cat: 'kids', title: 'School Holiday Fun Pack', emoji: '🎨', pages: 13, sub: 'Rainy days sorted: homemade creations, 36 indoor activities, a planner, “I’m bored” jar slips and bingo.', inside: ['9 homemade creation recipe cards (playdough, bubbles, cloud dough …)', 'Fridge poster', '36 indoor activities checklist', '2-week holiday planner', '36 “I’m bored” jar slips', 'Boredom bingo card'] },
    { id: 'family-money-planner', cat: 'home', title: 'Family Money Planner', emoji: '💰', pages: 13, sub: 'Simple NZ-dollar budget pages for Kiwi households — print and reuse every month.', inside: ['Monthly budget (income, bills, spending, savings, debts)', 'Weekly spending tracker', 'Fortnightly pay-day planner', '12-month bill tracker', '100-square savings goal', 'Debt payoff tracker, sinking funds, 30-day no-spend challenge, year in review'] },
    { id: 'advent-christmas-pack', cat: 'faith', title: 'Advent & Christmas Family Pack', emoji: '🎄', pages: 11, sub: 'Prepare for Jesus together — one small activity for each day of Advent.', inside: ['Advent wreath guide with 4 Sunday prayers', '24-day Advent calendar + 24 cut-out cards', '20 ways to share Christmas joy', '8 Christmas blessing cards', 'Gift & Christmas budget planner', '“Dear Baby Jesus” letter page'] },
    { id: 'lent-easter-pack', cat: 'faith', title: 'Lent & Easter Family Pack', emoji: '✝️', pages: 9, sub: 'Pray, give and love through Lent, walk through Holy Week and celebrate Easter.', inside: ['What is Lent? + family promises page', '40-day calendar of small acts', 'Holy Week family guide', 'Easter egg hunt with 12 rhyming clues', '6 Lent & Easter prayer cards'] },
    { id: 'family-prayer-cards', cat: 'faith', title: 'Family Prayer Cards', emoji: '🙏', pages: 9, sub: '31 original prayers for every moment of family life, ready to cut out and keep.', inside: ['31 prayer cards in 16 themes', 'Morning, night, school, work, healing, worry, grief, thanks, travel, new baby, Aotearoa …', 'Contents page'] },
    { id: 'lunchbox-joke-cards', cat: 'kids', title: 'Lunchbox Joke Cards', emoji: '😄', pages: 15, sub: 'Pop a joke in the lunchbox! Kiwi, animal and food jokes kids love.', inside: ['120 colourful joke cards', '20 riddle cards with fold-back answers', 'Blank cards for your own jokes'] },
    { id: 'matariki-aotearoa-pack', cat: 'kiwi', title: 'Matariki & Aotearoa Days Pack', emoji: '✨', pages: 9, sub: 'Remember, celebrate and look ahead — the nine stars with a family activity for each, plus special New Zealand days and everyday te reo Māori.', inside: ['What is Matariki? family guide', 'The nine stars — an activity for each', 'Wishes for the year (Hiwa-i-te-rangi)', '“We remember” page and Matariki kai plan', 'Special days in Aotearoa calendar', '16 everyday te reo Māori fridge cards'] },
    { id: 'faith-formation-sheets', cat: 'faith', title: 'Faith Formation Study Sheets', emoji: '📖', pages: 16, sub: '13 one-page guides to the Catholic faith — clear, simple and ready for home, Sunday school or sacrament preparation.', inside: ['The Church year & colours · Parts of the Mass', 'The seven sacraments · Ten Commandments', 'The Beatitudes · Works of Mercy · Gifts of the Holy Spirit', 'Virtues · Stations of the Cross · Catholic symbols', 'Books of the Bible · Names of Jesus · Prayers every family knows', 'A family activity on every page'] },
    { id: 'meal-planner-grocery', cat: 'home', title: 'Meal Planner & Grocery Lists', emoji: '🥕', pages: 9, sub: 'Plan the week, shop by aisle and waste less — with 20 budget family dinner ideas.', inside: ['Weekly meal planner (2 copies)', 'Grocery list sorted by supermarket aisle', 'Pantry & freezer list', 'Lunchbox planner', '20 budget family dinners', '4 recipe cards'] },
    { id: 'routines-chore-charts', cat: 'kids', title: 'Family Routines & Chore Charts', emoji: '⭐', pages: 10, sub: 'Calmer mornings and happier evenings — picture routines, chores by age and a reward chart.', inside: ['Morning and bedtime picture routines', 'Chores by age (2–3 up to 10+)', 'Weekly chore chart and 30-star reward chart', '“In this family” rules poster', 'Screen-time family promise', '18 kindness jar slips'] },
    { id: 'family-emergency-plan', cat: 'home', title: 'Family Emergency Plan & Safety Pack', emoji: '🚨', pages: 8, sub: 'Be ready together — a fill-in plan, fridge contacts, grab-bag and home kit checklists.', inside: ['Fridge contacts page (111, Healthline, Poisons Centre)', 'Family emergency plan', 'Grab bag and home emergency kit checklists', 'Home safety check', 'Fire escape plan grid', 'Kids’ “What would I do?” page'] }
  ];
  JNZX.products = PRODUCTS;
  function shopInfo(id) { var s = (C.shop || {})[id] || {}; return { url: s.url || '', price: s.price || '' }; }
  var GST = function () { return cfg('gstRegistered', false) ? ' incl. GST' : ''; };


  /* ---------------- multi-buy offer & bundle basket ---------------- */
  var CATS = [['all', 'All packs'], ['faith', '🙏 Faith'], ['kids', '🧒 Kids & fun'], ['home', '🏡 Home & money'], ['kiwi', '🇳🇿 Kiwi life']];
  var P = C.promo || {};
  function promoOn() { return P.on !== false && P.two && P.two.percent; }
  function num(pr) { var m = String(pr || '').replace(/,/g, '').match(/[\d.]+/); return m ? +m[0] : 0; }
  function money(n) { return 'NZ$' + (Math.round(n * 100) / 100).toFixed(n % 1 ? 2 : 0); }
  function tier(n) { if (!promoOn() || n < 2) return null; return (n >= 3 && P.three && P.three.percent) ? P.three : P.two; }
  var bk = []; try { bk = JSON.parse(localStorage.getItem('jnzx-basket') || '[]').filter(function (id) { return PRODUCTS.some(function (p) { return p.id === id; }); }); } catch (e) { bk = []; }
  var bkL = [];
  function bkSet(next) { bk = next; try { localStorage.setItem('jnzx-basket', JSON.stringify(bk)); } catch (e) {} bkL.forEach(function (f) { f(); }); }
  function bkToggle(id) { bkSet(bk.indexOf(id) >= 0 ? bk.filter(function (x) { return x !== id; }) : bk.concat([id])); }
  function useBasket() { var s = useState(0), set = s[1]; useEffect(function () { var f = function () { set(function (n) { return n + 1; }); }; bkL.push(f); return function () { bkL = bkL.filter(function (x) { return x !== f; }); }; }, []); return bk; }
  function offerLine() { var t = P.three && P.three.percent ? ', ' + P.three.percent + '% off 3 or more' : ''; return 'Buy any 2 packs, save ' + P.two.percent + '%' + t; }
  JNZX.promo = { on: promoOn, line: offerLine };

  function BundleBar(props) {
    var b = useBasket(), s2 = useState(false), copied = s2[0], setCopied = s2[1]; if (!b.length) return null;
    var items = b.map(function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; }).filter(Boolean);
    var total = items.reduce(function (a, p) { return a + num(shopInfo(p.id).price); }, 0);
    var t = tier(items.length), save = t ? total * t.percent / 100 : 0;
    var store = P.storeUrl || '', next = items.length === 1 && promoOn() ? 'Add 1 more pack to save ' + P.two.percent + '%' : (items.length === 2 && P.three && P.three.percent ? 'Add 1 more to save ' + P.three.percent + '%' : '');
    var coll = shopInfo('complete-collection'), collN = num(coll.price);
    function copy() { if (!t) return; (JNZX.copyText ? JNZX.copyText(t.code) : Promise.reject()).then(function () { setCopied(true); setTimeout(function () { setCopied(false); }, 1800); }, function () {}); }
    return h('aside', { className: 'jx-bundle', 'aria-label': 'My bundle' },
      h('div', { className: 'jx-bundle-top' },
        h('strong', null, '🎁 My bundle · ' + items.length + (items.length === 1 ? ' pack' : ' packs')),
        h('button', { type: 'button', className: 'jx-bundle-clear', onClick: function () { bkSet([]); } }, 'Clear')),
      h('ul', { className: 'jx-bundle-items' }, items.map(function (p) { var u = shopInfo(p.id).url; return h('li', { key: p.id },
        h('span', null, p.emoji + ' ' + p.title + (shopInfo(p.id).price ? ' · ' + shopInfo(p.id).price : '')),
        u && h('a', { href: u, target: '_blank', rel: 'noopener', className: 'jx-bundle-open' }, 'Add to cart ↗'),
        h('button', { type: 'button', className: 'jx-bundle-rm', 'aria-label': 'Remove ' + p.title, onClick: function () { bkToggle(p.id); } }, '✕')); })),
      h('div', { className: 'jx-bundle-sum' },
        total > 0 && h('span', null, 'Packs: ', h('b', null, money(total))),
        t && h('span', { className: 'jx-bundle-save' }, 'You save ' + t.percent + '%: ', h('b', null, '−' + money(save))),
        t && total > 0 && h('span', null, 'You pay: ', h('b', { className: 'jx-bundle-pay' }, money(total - save)))),
      next && h('p', { className: 'jx-bundle-next' }, '💡 ' + next),
      t && h('div', { className: 'jx-bundle-code' }, h('span', null, 'Use code at checkout:'), h('button', { type: 'button', onClick: copy, 'aria-label': 'Copy code ' + t.code }, h('code', null, t.code), copied ? ' ✓ copied' : ' 📋')),
      collN && (total - save) > collN && h('p', { className: 'jx-bundle-next' }, '⭐ Tip: the Complete Family Collection (all 12 packs) is only ' + coll.price + '.'),
      h('div', { className: 'jx-bundle-go' },
        store ? h('a', { className: 'jx-buy', href: store, target: '_blank', rel: 'noopener' }, 'Go to checkout →')
          : (items.some(function (p) { return shopInfo(p.id).url; }) ? null : h('span', { className: 'jx-soon' }, 'Checkout opening soon')),
        h('small', null, 'Tap “Add to cart” for each pack (it opens our secure shop), then enter the code at checkout. The discount is applied by the shop.')));
  }

  function Ribbon() {
    var s = useState(function () { try { return sessionStorage.getItem('jnzx-ribbon-x') === '1'; } catch (e) { return false; } }), hid = s[0], setHid = s[1];
    var b = useBasket();
    if (hid || !promoOn() || /x%3Ashop|x:shop/.test(location.hash)) return null;
    function open() { location.hash = 'section=' + encodeURIComponent('x:shop'); try { window.scrollTo(0, 0); } catch (e) {} }
    return h('div', { className: 'jx-ribbon jx-keep-colour', role: 'region', 'aria-label': 'Special offer' },
      h('button', { type: 'button', className: 'jx-ribbon-go', onClick: open }, '🎁 ', h('b', null, 'Family printables: '), offerLine() + (b.length ? ' · ' + b.length + ' in your bundle' : '') + ' →'),
      h('button', { type: 'button', className: 'jx-ribbon-x', 'aria-label': 'Hide offer', onClick: function () { setHid(true); try { sessionStorage.setItem('jnzx-ribbon-x', '1'); } catch (e) {} } }, '✕'));
  }

  function RibbonHost() { var s = useState(0), set = s[1]; useEffect(function () { var f = function () { set(function (n) { return n + 1; }); }; var last = location.hash, t = setInterval(function () { if (location.hash !== last) { last = location.hash; f(); } }, 400); window.addEventListener('hashchange', f); return function () { clearInterval(t); window.removeEventListener('hashchange', f); }; }, []); return h(Ribbon); }
  function HomePromo(props) {
    if (!promoOn()) return null;
    var picks = ['kiwi-bucket-list', 'advent-christmas-pack', 'routines-chore-charts', 'matariki-aotearoa-pack'];
    return h('section', { className: 'jx-home-promo jx-keep-colour' },
      h('div', { className: 'jx-hp-txt' },
        h('span', { className: 'jx-hp-k' }, 'NEW · FAMILY PRINTABLES'),
        h('h2', null, '12 printable packs for Kiwi families'),
        h('p', null, offerLine() + '. Bucket lists, Advent & Lent, Matariki, chore charts, meal planners, prayer cards and more — print at home on A4.'),
        h('button', { type: 'button', className: 'jx-buy', onClick: function () { go(props, 'x:shop'); } }, 'Build my bundle →')),
      h('div', { className: 'jx-hp-pics', 'aria-hidden': 'true' }, picks.map(function (id) { return h('img', { key: id, src: './shop-' + id + '-0.webp', alt: '', loading: 'lazy' }); })));
  }


  /* ---------------- Community › Meet Local Makers spotlight ---------------- */
  function MakersSpot(props) {
    var b = useBasket();
    var coll = shopInfo('complete-collection');
    var feat = ['kiwi-bucket-list', 'advent-christmas-pack', 'matariki-aotearoa-pack', 'routines-chore-charts'].map(function (id) { return PRODUCTS.filter(function (p) { return p.id === id; })[0]; });
    return h('section', { className: 'jx-maker jx-keep-colour', 'aria-label': 'Local maker: The James NZ Family Printables' },
      h('div', { className: 'jx-maker-head' },
        h('span', { className: 'jx-hp-k' }, 'LOCAL MAKER SPOTLIGHT · AOTEAROA'),
        h('h2', null, 'The James NZ — Family Printables'),
        h('p', null, 'A small New Zealand family business making printable packs for Kiwi families: bucket lists, Matariki, Advent & Lent, faith guides, chore charts, meal planners, emergency plans and more. Instant download, print at home on A4.'),
        promoOn() && h('p', { className: 'jx-maker-offer' }, '🎁 ' + offerLine() + (coll.price ? ' · all 12 packs ' + coll.price : ''))),
      h('div', { className: 'jx-maker-grid' }, feat.map(function (p) { var s = shopInfo(p.id), inB = b.indexOf(p.id) >= 0; return h('div', { key: p.id, className: 'jx-maker-item' },
        h('img', { src: './shop-' + p.id + '-0.webp', alt: p.title + ' cover', loading: 'lazy' }),
        h('b', null, p.title), h('span', null, (s.price || '') + ' · ' + p.pages + ' pages'),
        s.url ? h('a', { className: 'jx-buy', href: s.url, target: '_blank', rel: 'noopener' }, 'Buy →')
          : (promoOn() ? h('button', { type: 'button', className: 'jx-add' + (inB ? ' is-in' : ''), 'aria-pressed': inB, onClick: function () { bkToggle(p.id); } }, inB ? '✓ In bundle' : '＋ Bundle') : h('span', { className: 'jx-soon' }, 'Coming soon'))); })),
      h('div', { className: 'jx-maker-go' },
        h('button', { type: 'button', className: 'jx-buy', onClick: function () { go(props, 'x:shop'); } }, 'See all 12 packs →'),
        b.length ? h('span', null, '🎁 ' + b.length + ' in your bundle') : null));
  }
  JNZX.makersSpot = function (navigate) { return h(MakersSpot, { key: 'jx-makers', navigate: navigate }); };

  /* ---------------- Add to home screen ---------------- */
  var deferred = null, listeners = [];
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; listeners.forEach(function (f) { f(); }); });
  window.addEventListener('appinstalled', function () { deferred = null; try { localStorage.setItem('jnzx-installed', '1'); } catch (e) {} listeners.forEach(function (f) { f(); }); });
  if ('serviceWorker' in navigator && location.protocol === 'https:') { window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); }); }
  function standalone() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } }
  function isIOS() { return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function InstallButton(props) {
    var st = useState(0), bump = st[1], hs = useState(false), help = hs[0], setHelp = hs[1];
    useEffect(function () { var f = function () { bump(function (n) { return n + 1; }); }; listeners.push(f); return function () { listeners = listeners.filter(function (x) { return x !== f; }); }; }, []);
    if (standalone()) return props.quiet ? null : h('p', { className: 'small-note' }, '✅ The James NZ is on your home screen. Thank you!');
    function click() {
      if (deferred) { var d = deferred; d.prompt(); d.userChoice.then(function () { deferred = null; bump(function (n) { return n + 1; }); }); return; }
      setHelp(!help);
    }
    var ios = isIOS();
    return h('div', { className: 'jx-install' },
      h('button', { type: 'button', className: props.primary ? 'primary' : 'secondary', onClick: click }, '📲 Add to home screen'),
      help && h('div', { className: 'jx-install-help', role: 'note' },
        ios ? h('ol', null, h('li', null, 'Tap the ', h('b', null, 'Share'), ' button (the square with an arrow ⬆️) in Safari.'), h('li', null, 'Scroll down and tap ', h('b', null, 'Add to Home Screen'), '.'), h('li', null, 'Tap ', h('b', null, 'Add'), '. The James NZ now opens like an app!'))
          : h('ol', null, h('li', null, 'Open your browser menu (⋮ or ⋯).'), h('li', null, 'Tap ', h('b', null, 'Add to Home screen'), ' or ', h('b', null, 'Install app'), '.'), h('li', null, 'Confirm — The James NZ now opens like an app!'))));
  }
  JNZX.InstallButton = InstallButton;

  /* ---------------- Monthly email sign-up ---------------- */
  function Newsletter(props) {
    var action = cfg('newsletterAction', ''), field = cfg('newsletterEmailField', 'email');
    var e = useState(''), email = e[0], setEmail = e[1], c = useState(false), ok = c[0], setOk = c[1], s = useState(false), sent = s[0], setSent = s[1];
    if (!action) return null;
    return h('section', { className: 'jx-news jx-keep-colour' + (props.compact ? ' is-compact' : '') },
      h('div', { className: 'jx-news-txt' }, h('span', { className: 'jx-news-e', 'aria-hidden': true }, '💌'), h('div', null, h('h3', null, 'Get our monthly family ideas'), h('p', null, 'One friendly email a month: new activities, seasonal faith ideas, jokes and free printables. No spam, ever.'))),
      sent ? h('p', { className: 'jx-news-thanks', role: 'status' }, '🎉 Thank you! Please check your inbox and confirm your email.') :
      h('form', { action: action, method: 'post', target: '_blank', onSubmit: function (ev) { if (!ok) { ev.preventDefault(); return; } setTimeout(function () { setSent(true); }, 300); } },
        h('label', { className: 'jx-news-row' }, h('span', { className: 'sr-only' }, 'Email address'), h('input', { type: 'email', name: field, required: true, value: email, placeholder: 'you@example.com', autoComplete: 'email', onChange: function (ev) { setEmail(ev.target.value); } }),
          h('button', { type: 'submit', className: 'primary', disabled: !ok }, 'Sign me up')),
        h('label', { className: 'jx-news-ok' }, h('input', { type: 'checkbox', checked: ok, onChange: function (ev) { setOk(ev.target.checked); } }), h('span', null, 'Yes, send me The James NZ monthly email. I can unsubscribe at any time using the link in every email. ', h('a', { href: '#section=x%3Aprivacy' }, 'Privacy'))),
        h('input', { type: 'hidden', name: 'embed', value: '1' })));
  }
  JNZX.Newsletter = Newsletter;

  /* ---------------- AdSense ad space (optional slot) ---------------- */
  function AdSlot() {
    var slot = cfg('adSlot', ''), client = cfg('adClient', ''), ref = useRef(null);
    useEffect(function () { if (!slot || !client || !ref.current) return; try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} }, [slot]);
    if (!slot || !client) return null;
    return h('aside', { className: 'jx-ad', 'aria-label': 'Advertisement' }, h('small', null, 'Advertisement'), h('ins', { ref: ref, className: 'adsbygoogle', style: { display: 'block' }, 'data-ad-client': client, 'data-ad-slot': slot, 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' }));
  }
  JNZX.AdSlot = AdSlot;

  /* ---------------- Support strip shown at the end of pages ---------------- */
  function Connect(props) {
    return h('div', { className: 'jx-connect' },
      h(Newsletter, { compact: true }),
      h('div', { className: 'jx-connect-row' },
        h('button', { type: 'button', className: 'jx-support-btn', onClick: function () { go(props, 'x:support'); } }, '💛 Support The James NZ'),
        h('button', { type: 'button', className: 'secondary', onClick: function () { go(props, 'x:shop'); } }, '🖨️ Family printables'),
        h(InstallButton, { quiet: true })),
      h(AdSlot));
  }
  var basePageEnd = JNZX.pageEnd;
  var OWN = { 'x:shop': 1, 'x:support': 1, 'x:privacy': 1 };
  JNZX.pageEnd = function (tab, navigate) {
    var a = basePageEnd ? basePageEnd(tab, navigate) : null;
    if (OWN[tab]) return a;
    return h(R.Fragment, { key: 'jx-end2-' + tab }, a, h('div', { className: 'jx-page' }, tab === 'Home' && h(HomePromo, { navigate: navigate }), h(Connect, { navigate: navigate })));
  };

  /* ---------------- Shop ---------------- */
  function Product(props) {
    var p = props.p, s = shopInfo(p.id), ix = useState(0), i = ix[0], setI = ix[1], b = useBasket(), inB = b.indexOf(p.id) >= 0;
    var pics = [0, 1, 2].map(function (n) { return './shop-' + p.id + '-' + n + '.webp'; });
    return h('article', { className: 'jx-prod' + (inB ? ' is-in' : ''), id: 'jx-p-' + p.id },
      h('div', { className: 'jx-prod-pics' },
        h('img', { className: 'jx-prod-main', src: pics[i], alt: p.title + ' — preview page ' + (i + 1), loading: 'lazy' }),
        h('div', { className: 'jx-prod-thumbs' }, pics.map(function (src, n) { return h('button', { key: n, type: 'button', 'aria-label': 'Show preview ' + (n + 1), className: n === i ? 'is-on' : '', onClick: function () { setI(n); } }, h('img', { src: src, alt: '', loading: 'lazy' })); }))),
      h('div', { className: 'jx-prod-body' },
        h('h3', null, p.emoji + ' ' + p.title),
        h('p', { className: 'jx-prod-sub' }, p.sub),
        h('ul', null, p.inside.map(function (x) { return h('li', { key: x }, x); })),
        h('p', { className: 'jx-prod-meta' }, 'Instant PDF download · ' + p.pages + ' A4 pages · print at home'),
        h('div', { className: 'jx-prod-buy' },
          s.price && h('strong', { className: 'jx-prod-price' }, s.price + GST()),
          s.url ? h('a', { className: 'jx-buy', href: s.url, target: '_blank', rel: 'noopener' }, 'Buy & download →')
            : h('span', { className: 'jx-soon' }, 'Coming soon'),
          promoOn() && h('button', { type: 'button', className: 'jx-add' + (inB ? ' is-in' : ''), 'aria-pressed': inB, onClick: function () { bkToggle(p.id); } }, inB ? '✓ In my bundle' : '＋ Add to my bundle'))));
  }
  function ShopPage(props) {
    var anyOpen = PRODUCTS.some(function (p) { return shopInfo(p.id).url; });
    var f = useState('all'), cat = f[0], setCat = f[1];
    var list = PRODUCTS.filter(function (p) { return cat === 'all' || p.cat === cat; });
    var coll = shopInfo('complete-collection'), sum = PRODUCTS.reduce(function (a, p) { return a + num(shopInfo(p.id).price); }, 0);
    return h('div', { className: 'jx-page jx-shop' },
      JNZX.Header('COMMUNITY · SUPPORT US', 'Family printables.', 'Printable packs made by our family for yours — bucket lists, holiday fun, Matariki, Advent and Lent, faith guides, chore charts, meal planners, emergency plans, money planners, prayer cards and lunchbox jokes. Buy once, print at home as often as your family needs.'),
      h('div', { className: 'jx-shop-trust' }, ['📥 Instant digital download', '🖨️ Print at home on A4', '🇳🇿 Made in Aotearoa', '✨ 100% original content'].map(function (t) { return h('span', { key: t }, t); })),
      promoOn() && h('section', { className: 'jx-offer jx-keep-colour' },
        h('div', { className: 'jx-offer-e' }, '🎁'),
        h('div', null,
          h('h2', null, 'Multi-buy offer'),
          h('div', { className: 'jx-offer-tiers' },
            h('span', null, h('b', null, 'Any 2 packs'), h('em', null, P.two.percent + '% off'), h('code', null, P.two.code)),
            P.three && P.three.percent && h('span', null, h('b', null, '3 or more'), h('em', null, P.three.percent + '% off'), h('code', null, P.three.code)),
            coll.price && h('span', null, h('b', null, 'All 12 packs'), h('em', null, coll.price), h('small', null, sum ? 'packs bought singly: ' + money(sum) : ''))),
          h('p', null, 'Tap “Add to my bundle” on the packs you want. We’ll show your saving and the code to use at checkout.' + (P.ends ? ' Offer ends ' + P.ends + '.' : '')))),
      !anyOpen && h('p', { className: 'jx-note' }, 'Our shop is opening soon. Have a look at what’s coming — and sign up below to hear first.'),
      coll.price && h('article', { className: 'jx-coll jx-keep-colour' },
        h('div', { className: 'jx-coll-pics', 'aria-hidden': 'true' }, PRODUCTS.slice(0, 12).map(function (p) { return h('img', { key: p.id, src: './shop-' + p.id + '-0.webp', alt: '', loading: 'lazy' }); })),
        h('div', null,
          h('span', { className: 'jx-hp-k' }, 'BEST VALUE'),
          h('h3', null, '⭐ The Complete Family Collection'),
          h('p', null, 'All 12 packs — ' + PRODUCTS.reduce(function (a, p) { return a + p.pages; }, 0) + ' printable pages for the whole year: faith, fun, home and Kiwi life.'),
          h('div', { className: 'jx-prod-buy' },
            h('strong', { className: 'jx-prod-price' }, coll.price + GST()),
            coll.url ? h('a', { className: 'jx-buy', href: coll.url, target: '_blank', rel: 'noopener' }, 'Get all 12 →') : h('span', { className: 'jx-soon' }, 'Coming soon')))),
      h('div', { className: 'jx-cats', role: 'tablist', 'aria-label': 'Filter packs' }, CATS.map(function (c) { return h('button', { key: c[0], type: 'button', role: 'tab', 'aria-selected': cat === c[0], className: cat === c[0] ? 'is-on' : '', onClick: function () { setCat(c[0]); } }, c[1]); })),
      h('div', { className: 'jx-prod-list' }, list.map(function (p) { return h(Product, { key: p.id, p: p }); })),
      h(BundleBar, props),
      h(Newsletter, {}),
      h('section', { className: 'jx-card jx-terms' },
        h('h2', null, 'How buying works'),
        h('p', null, 'Printables are sold by ', h('b', null, 'The James NZ'), ', a small New Zealand family business. When you tap “Buy”, our online shop provider handles payment securely and emails your download link — we never see your card details.'),
        h('p', null, h('b', null, 'Prices'), ' are in New Zealand dollars' + (cfg('gstRegistered', false) ? ' and include GST' : '') + '. There is no postage — everything is a digital download.'),
        h('p', null, h('b', null, 'Your licence: '), 'print and use your pack for your own family. Teachers, parish and community-group leaders may print copies for the group they run. Please don’t resell, share or upload the files.'),
        promoOn() && h('p', null, h('b', null, 'Multi-buy offer: '), offerLine() + ' when you buy different packs in one order and enter the code at checkout. One code per order; it can’t be combined with the Complete Family Collection or other offers. The discount is taken off our normal prices shown on this page. We may change or end the offer at any time — orders already placed keep their discount.'),
        h('p', null, h('b', null, 'If something isn’t right: '), 'if a file is faulty, won’t open or isn’t as described, contact us and we’ll fix it, replace it or refund you. Your rights under the Consumer Guarantees Act and Fair Trading Act are not affected.'),
        h('p', null, 'Full details: ', h('a', { href: '#section=x%3Aprivacy' }, 'Privacy & Terms'), '.')),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:shop', ShopPage);

  /* ---------------- Support ---------------- */
  function SupportPage(props) {
    var url = cfg('supportUrl', '');
    return h('div', { className: 'jx-page jx-support' },
      JNZX.Header('COMMUNITY · SUPPORT US', 'Support The James NZ.', 'The James NZ is a free family website made with love in Aotearoa. If it has helped or made you smile, here are some easy ways to keep it going.'),
      h('div', { className: 'jx-sup-grid' },
        url && h('div', { className: 'jx-sup-card is-main' }, h('div', { className: 'jx-sup-e' }, '☕'), h('h3', null, 'Buy us a coffee'), h('p', null, 'A small one-off gift helps pay for hosting and new content. Every coffee is truly appreciated!'), h('a', { className: 'jx-buy', href: url, target: '_blank', rel: 'noopener' }, '💛 Support with a coffee')),
        h('div', { className: 'jx-sup-card' }, h('div', { className: 'jx-sup-e' }, '🖨️'), h('h3', null, 'Get a printable pack'), h('p', null, '12 packs: bucket lists, Matariki, Advent & Lent, chore charts, meal planners and more. Buy 2 or more and save — you get something lovely, we keep creating.'), h('button', { type: 'button', className: 'primary', onClick: function () { go(props, 'x:shop'); } }, 'See the printables')),
        h('div', { className: 'jx-sup-card' }, h('div', { className: 'jx-sup-e' }, '📣'), h('h3', null, 'Share with a friend'), h('p', null, 'Tell a friend, your parish group or school community about the website. It costs nothing and helps a lot.'), h(JNZX.ShareMini, { label: 'Share The James NZ', title: 'The James NZ', text: 'A free family website from Aotearoa — jokes, prayers, Kiwi adventures, holiday ideas and more. www.thejamesnz.com' })),
        h('div', { className: 'jx-sup-card' }, h('div', { className: 'jx-sup-e' }, '📲'), h('h3', null, 'Keep us close'), h('p', null, 'Add The James NZ to your phone’s home screen so it opens like an app.'), h(InstallButton, { primary: true }))),
      h(Newsletter, {}),
      h('p', { className: 'small-note' }, 'The James NZ is a family-run website, not a registered charity, so gifts are not tax-deductible. Thank you for your kindness. 🙏'),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:support', SupportPage);

  /* ---------------- Privacy & Terms ---------------- */
  function PrivacyPage(props) {
    var mail = cfg('contactEmail', '');
    var contact = mail ? h('a', { href: 'mailto:' + mail }, mail) : 'the contact details on our About Us page';
    function S(t) { return h('h2', null, t); }
    return h('div', { className: 'jx-page jx-legal' },
      JNZX.Header('COMMUNITY · GOOD TO KNOW', 'Privacy & Terms.', 'How The James NZ looks after your information, and the terms for using our website and buying our printables. Last updated November 2026.'),
      h('section', { className: 'jx-card' },
        S('Who we are'),
        h('p', null, 'The James NZ (www.thejamesnz.com) is a family-run website based in Aotearoa New Zealand. For any privacy question or request, contact us using ', contact, '.'),
        S('What we collect, and why'),
        h('ul', null,
          h('li', null, h('b', null, 'Things you save on the website'), ' — your lists, budgets, plans, quiz results and settings are saved only in your own browser on your device. We can’t see them. Clearing your browser data deletes them.'),
          h('li', null, h('b', null, 'Ask Mateo'), ' — Mateo works on your device. What you type is not sent to us.'),
          h('li', null, h('b', null, 'Monthly email'), ' — if you sign up, we collect your email address only to send our monthly family ideas email. It is held by our email service provider. We never sell or share it. Every email has an unsubscribe link.'),
          h('li', null, h('b', null, 'Buying printables'), ' — purchases are handled by our online shop provider, which collects your name, email and payment details to process the order and send your download. We receive your name and email for the order record; we never see your card details.'),
          h('li', null, h('b', null, 'Gifts and coffees'), ' — handled by the support platform you choose; they share your name and any message with us.'),
          h('li', null, h('b', null, 'Our hosting provider'), ' may record basic technical information (such as IP address and browser type) to keep the site running and secure.')),
        S('Advertising and cookies'),
        h('p', null, 'We use Google AdSense to show ads, which helps keep The James NZ free. Google and its partners use cookies to show ads based on your visits to this and other websites. You can turn off personalised ads at ', h('a', { href: 'https://adssettings.google.com', target: '_blank', rel: 'noopener' }, 'Google Ad Settings'), ', and read how Google uses information at ', h('a', { href: 'https://policies.google.com/technologies/partner-sites', target: '_blank', rel: 'noopener' }, 'policies.google.com'), '.'),
        S('Your rights'),
        h('p', null, 'Under the Privacy Act 2020 you can ask to see the personal information we hold about you and ask us to correct it. Contact us using ', contact, '. If you’re not happy with our response, you can contact the Office of the Privacy Commissioner at privacy.org.nz.'),
        S('Children'),
        h('p', null, 'Much of our website is made for families to enjoy together. We don’t knowingly collect personal information from children — email sign-ups and purchases are for adults.')),
      h('section', { className: 'jx-card' },
        S('Terms of sale — printables'),
        h('ul', null,
          h('li', null, 'Printables are sold by The James NZ, a small New Zealand family business (we are in trade). Prices are shown in New Zealand dollars' + (cfg('gstRegistered', false) ? ', including GST.' : '.')),
          h('li', null, 'Products are digital PDF downloads delivered by email or download link straight after payment. Nothing is posted.'),
          h('li', null, 'Licence: you may print the files for your own household. Teachers, parish and community-group leaders may print copies for the group they run. You may not resell, share, upload or claim the content as your own.'),
          h('li', null, 'If a file is faulty, won’t open or isn’t as described, contact us and we will fix it, send a replacement or give you a refund. Nothing in these terms limits your rights under the Consumer Guarantees Act 1993 or the Fair Trading Act 1986.'),
          h('li', null, 'Please check the description, page count and previews before buying, and make sure you can open PDF files and print on A4.')),
        S('Using this website'),
        h('ul', null,
          h('li', null, 'All words, activities, prayers, jokes and pictures on The James NZ are original and © The James NZ unless stated. You’re welcome to share links and use the share buttons.'),
          h('li', null, 'Our information is general and for families. It is not professional medical, legal or financial advice — check with a qualified person for your situation.'),
          h('li', null, 'Links to other websites are provided for convenience; we are not responsible for their content.'),
          h('li', null, 'Gifts and coffees are voluntary and non-refundable except where the law requires. The James NZ is not a registered charity, so gifts are not tax-deductible.'))),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:privacy', PrivacyPage);

  /* ---------------- styles ---------------- */
  var css = '.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '.jx-connect{display:grid;gap:14px;margin:18px 0 6px}.jx-connect-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;justify-content:center}' +
    '.jx-support-btn,.jx-hdr-support{background:#d5b16d!important;color:#14243a!important;border:0!important;border-radius:999px!important;font-weight:800!important;padding:10px 18px!important;cursor:pointer}' +
    '.jx-hdr-support{padding:7px 14px!important}' +
    '.jx-install{display:grid;gap:8px;justify-items:center}.jx-install-help{background:#f3f7f6;border-radius:14px;padding:10px 14px;max-width:420px;text-align:left}.jx-install-help ol{margin:0;padding-left:20px;line-height:1.6}' +
    '.jx-news{background:linear-gradient(135deg,#14243a,#1e3355);color:#fff;border-radius:22px;padding:22px 24px;display:grid;gap:14px;margin:22px 0}' +
    '.jx-news-txt{display:flex;gap:14px;align-items:flex-start}.jx-news-e{font-size:38px;line-height:1}.jx-news h3{margin:0 0 4px;color:#fff!important;font-family:"Playfair Display",Georgia,serif;font-size:1.4rem}.jx-news p{margin:0;color:rgba(255,255,255,.82)!important}' +
    '.jx-news form{display:grid;gap:10px}.jx-news-row{display:flex;gap:8px;flex-wrap:wrap}.jx-news-row input{flex:1 1 220px;min-width:0;font-size:16px;border-radius:12px;border:0;padding:12px 14px}' +
    '.jx-news-row button{background:#d5b16d!important;color:#14243a!important;border:0!important;font-weight:800;border-radius:12px!important;padding:12px 18px!important}.jx-news-row button:disabled{opacity:.55}' +
    '.jx-news-ok{display:flex;gap:8px;align-items:flex-start;font-size:.88rem;color:rgba(255,255,255,.85)}.jx-news-ok input{margin-top:3px;width:18px;height:18px}.jx-news a{color:#d5b16d}.jx-news-thanks{font-weight:700}' +
    '.jx-ad{margin:18px 0;text-align:center}.jx-ad small{display:block;color:#8a9a96;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}' +
    '.jx-shop-trust{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 18px}.jx-shop-trust span{background:#eef6f3;color:#1f5a4a;border-radius:999px;padding:6px 12px;font-weight:700;font-size:.88rem}' +
    '.jx-prod-list{display:grid;gap:22px}' +
    '.jx-prod{display:grid;grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:22px;background:#fff;border-radius:22px;padding:18px;box-shadow:0 4px 14px rgba(20,36,58,.08)}' +
    '.jx-prod-pics{display:grid;gap:8px}.jx-prod-main{width:100%;aspect-ratio:210/297;object-fit:cover;border-radius:12px;box-shadow:0 4px 14px rgba(0,0,0,.12);background:#f5efe4}' +
    '.jx-prod-thumbs{display:flex;gap:8px}.jx-prod-thumbs button{flex:1;padding:0!important;border:2px solid transparent!important;border-radius:8px!important;overflow:hidden;background:none!important;cursor:pointer}.jx-prod-thumbs button.is-on{border-color:#168c89!important}.jx-prod-thumbs img{width:100%;aspect-ratio:210/297;object-fit:cover;display:block}' +
    '.jx-prod-body h3{margin:0 0 6px;font-family:"Playfair Display",Georgia,serif;font-size:1.5rem;color:#14243a}.jx-prod-sub{margin:0 0 8px;color:#3b4a46}.jx-prod-body ul{margin:0 0 10px;padding-left:20px;line-height:1.6;color:#34443f}' +
    '.jx-prod-meta{font-size:.88rem;color:#657184;margin:0 0 12px}.jx-prod-buy{display:flex;gap:14px;align-items:center;flex-wrap:wrap}.jx-prod-price{font-size:1.5rem;color:#14243a}' +
    '.jx-buy{display:inline-block;background:#168c89;color:#fff!important;text-decoration:none;font-weight:800;border-radius:999px;padding:12px 22px}.jx-soon{display:inline-block;background:#eef1f0;color:#5a6b66;border-radius:999px;padding:10px 18px;font-weight:700}' +
    '@media (max-width:700px){.jx-prod{grid-template-columns:1fr}.jx-prod-pics{max-width:340px;margin:0 auto}}' +
    '.jx-terms p{line-height:1.6}.jx-legal .jx-card{margin-bottom:18px}.jx-legal h2{font-size:1.3rem;margin:18px 0 6px}.jx-legal h2:first-child{margin-top:0}.jx-legal li{margin-bottom:8px;line-height:1.55}' +
    '.jx-sup-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:18px;margin:6px 0 10px}' +
    '.jx-sup-card{background:#fff;border-radius:20px;padding:20px;box-shadow:0 4px 12px rgba(20,36,58,.08);display:flex;flex-direction:column;gap:8px;align-items:flex-start}.jx-sup-card.is-main{background:#fff8e8}.jx-sup-card p{margin:0;color:#3b4a46;flex:1}.jx-sup-card h3{margin:0;font-family:"Playfair Display",Georgia,serif}.jx-sup-e{font-size:36px}' +
    '.jx-a2hs{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;background:#14243a;color:#fff;border-radius:18px;padding:12px 14px;display:flex;gap:10px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.3)}.jx-a2hs p{margin:0;flex:1;font-size:.92rem}.jx-a2hs .jx-install{justify-items:end}.jx-a2hs .jx-install-help{color:#1f2a2a}.jx-a2hs-x{background:none!important;border:0!important;color:#fff!important;font-size:20px;padding:4px 8px!important}' +
    'html[data-reading-theme="dark"] .jx-prod,html[data-reading-theme="dark"] .jx-sup-card{background:#18211f}html[data-reading-theme="dark"] .jx-sup-card.is-main{background:#2a2617}' +
    'html[data-reading-theme="dark"] .jx-prod-body h3,html[data-reading-theme="dark"] .jx-prod-price,html[data-reading-theme="dark"] .jx-sup-card h3{color:#f1f4f3}html[data-reading-theme="dark"] .jx-prod-sub,html[data-reading-theme="dark"] .jx-prod-body ul,html[data-reading-theme="dark"] .jx-sup-card p{color:#d7e2de}' +
    'html[data-reading-theme="dark"] .jx-shop-trust span{background:#123a37;color:#9fe7dc}html[data-reading-theme="dark"] .jx-install-help{background:#1b2524;color:#e6efec}html[data-reading-theme="dark"] .jx-soon{background:#26322f;color:#d7e2de}' +
    '.jx-cats{display:flex;flex-wrap:wrap;gap:8px;margin:18px 0 14px}.jx-cats button{border-radius:999px!important;padding:8px 14px!important;background:#eef1f0!important;color:#22332f!important;border:0!important;font-weight:700;cursor:pointer}.jx-cats button.is-on{background:#14243a!important;color:#fff!important}' +
    '.jx-add{border-radius:999px!important;padding:10px 16px!important;border:2px solid #d5b16d!important;background:#fffaf0!important;color:#6b4d12!important;font-weight:800;cursor:pointer}.jx-add.is-in{background:#d5b16d!important;color:#14243a!important}.jx-prod.is-in{box-shadow:0 0 0 3px #d5b16d,0 4px 14px rgba(20,36,58,.08)}' +
    '.jx-offer{display:flex;gap:16px;align-items:flex-start;background:linear-gradient(135deg,#fff4dc,#ffe9c2);border:2px dashed #d5b16d;border-radius:22px;padding:18px 20px;margin:0 0 18px;color:#3a2a08}.jx-offer-e{font-size:44px;line-height:1}.jx-offer h2{margin:0 0 8px;font-family:"Playfair Display",Georgia,serif;color:#3a2a08!important}.jx-offer p{margin:10px 0 0;color:#4d3b14!important}' +
    '.jx-offer-tiers{display:flex;flex-wrap:wrap;gap:10px}.jx-offer-tiers span{background:#fff;border-radius:14px;padding:8px 12px;display:grid;gap:2px;min-width:120px;color:#3a2a08}.jx-offer-tiers em{font-style:normal;font-weight:900;font-size:1.35rem;color:#b5401f}.jx-offer-tiers code{font-weight:800;color:#14243a;background:#f3ead6;border-radius:6px;padding:1px 6px;justify-self:start}.jx-offer-tiers small{color:#6b5a35}' +
    '.jx-coll{display:grid;grid-template-columns:minmax(0,320px) minmax(0,1fr);gap:20px;align-items:center;background:linear-gradient(135deg,#14243a,#24406b);color:#fff;border-radius:22px;padding:18px;margin:0 0 6px}.jx-coll h3{margin:4px 0 6px;font-family:"Playfair Display",Georgia,serif;font-size:1.6rem;color:#fff!important}.jx-coll p{color:rgba(255,255,255,.85)!important;margin:0 0 12px}.jx-coll .jx-prod-price{color:#ffd98a!important}' +
    '.jx-coll-pics{display:grid;grid-template-columns:repeat(4,1fr);gap:6px}.jx-coll-pics img{width:100%;aspect-ratio:210/297;object-fit:cover;border-radius:6px;box-shadow:0 2px 8px rgba(0,0,0,.3)}' +
    '.jx-hp-k{display:inline-block;font-size:.72rem;letter-spacing:.12em;font-weight:900;color:#d5b16d}' +
    '.jx-bundle{position:sticky;bottom:10px;z-index:30;margin:22px 0;background:#fff;border:2px solid #d5b16d;border-radius:20px;padding:14px 16px;box-shadow:0 10px 30px rgba(20,36,58,.18);display:grid;gap:8px;color:#14243a}' +
    '.jx-bundle-top{display:flex;justify-content:space-between;align-items:center;gap:10px}.jx-bundle-clear{background:none!important;border:0!important;color:#7a6a4a!important;text-decoration:underline;cursor:pointer;padding:2px!important}' +
        '.jx-bundle-sum{display:flex;flex-wrap:wrap;gap:14px;font-size:.98rem}.jx-bundle-save{color:#b5401f}.jx-bundle-pay{font-size:1.2rem}.jx-bundle-next{margin:0;font-size:.9rem;color:#5b4a26}' +
    '.jx-bundle-code{display:flex;gap:8px;align-items:center;flex-wrap:wrap}.jx-bundle-code button{background:#14243a!important;color:#fff!important;border:0!important;border-radius:10px!important;padding:6px 12px!important;cursor:pointer}.jx-bundle-code code{font-weight:900;letter-spacing:.06em;color:#ffd98a}' +
    '.jx-bundle-go{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.jx-bundle-go small{color:#657184;flex:1 1 220px}' +
    '.jx-ribbon{display:flex;align-items:stretch;background:linear-gradient(90deg,#b5401f,#d5713a);color:#fff;font-size:.92rem;position:relative;z-index:40}.jx-ribbon-go{flex:1;background:none!important;border:0!important;color:#fff!important;padding:8px 12px!important;text-align:center;cursor:pointer;font:inherit}.jx-ribbon-go b{color:#fff}.jx-ribbon-x{background:none!important;border:0!important;color:#fff!important;padding:0 14px!important;font-size:16px;cursor:pointer}' +
    '.jx-home-promo{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:18px;align-items:center;background:linear-gradient(135deg,#fff4dc,#ffe4c4);border-radius:24px;padding:20px 22px;margin:22px 0;color:#3a2a08}.jx-home-promo h2{margin:4px 0 6px;font-family:"Playfair Display",Georgia,serif;color:#14243a!important}.jx-home-promo p{color:#4d3b14!important;margin:0 0 12px}.jx-home-promo .jx-hp-k{color:#b5401f}.jx-home-promo .jx-buy{border:0;cursor:pointer;font-size:1rem}' +
    '.jx-hp-pics{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.jx-hp-pics img{width:100%;aspect-ratio:210/297;object-fit:cover;border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,.18)}.jx-hp-pics img:nth-child(odd){transform:rotate(-3deg)}.jx-hp-pics img:nth-child(even){transform:rotate(3deg) translateY(6px)}' +
    '@media (max-width:700px){.jx-coll,.jx-home-promo{grid-template-columns:1fr}.jx-offer{flex-direction:column;gap:6px}.jx-ribbon{font-size:.82rem}.jx-bundle{bottom:6px}}' +
    'html[data-reading-theme="dark"] .jx-bundle{background:#18211f;color:#f1f4f3}html[data-reading-theme="dark"] .jx-bundle-next,html[data-reading-theme="dark"] .jx-bundle-go small{color:#d7e2de}html[data-reading-theme="dark"] .jx-cats button{background:#26322f!important;color:#e6efec!important}html[data-reading-theme="dark"] .jx-cats button.is-on{background:#d5b16d!important;color:#14243a!important}' +
    '.jx-bundle-items{list-style:none;margin:0;padding:0;display:grid;gap:6px}.jx-bundle-items li{display:flex;gap:10px;align-items:center;flex-wrap:wrap;background:#f6efe0;border-radius:12px;padding:6px 10px;color:#3a2a08}.jx-bundle-items li span{flex:1 1 200px;font-weight:700;font-size:.92rem}' +
    '.jx-bundle-open{background:#168c89;color:#fff!important;text-decoration:none;font-weight:800;border-radius:999px;padding:5px 12px;font-size:.85rem}.jx-bundle-rm{background:none!important;border:0!important;color:#7a6a4a!important;cursor:pointer;padding:2px 6px!important}' +
    /* dark mode for the offer, promo and bundle */
    'html[data-reading-theme="dark"] .jx-offer,html[data-reading-theme="dark"] .jx-home-promo{background:linear-gradient(135deg,#2b2312,#3a2c12)!important;border-color:#d5b16d!important;color:#f6ead2!important}' +
    'html[data-reading-theme="dark"] .jx-offer h2,html[data-reading-theme="dark"] .jx-home-promo h2{color:#ffe2a8!important}' +
    'html[data-reading-theme="dark"] .jx-offer p,html[data-reading-theme="dark"] .jx-home-promo p,html[data-reading-theme="dark"] .jx-offer-tiers b,html[data-reading-theme="dark"] .jx-offer-tiers small{color:#f6ead2!important}' +
    'html[data-reading-theme="dark"] .jx-offer-tiers span{background:#1d1d1d!important;color:#f6ead2!important;border:1px solid #5a4a28}html[data-reading-theme="dark"] .jx-offer-tiers em,html[data-reading-theme="dark"] .jx-home-promo .jx-hp-k,html[data-reading-theme="dark"] .jx-bundle-save,html[data-reading-theme="dark"] .jx-bundle-save b{color:#ff9f7a!important}' +
    'html[data-reading-theme="dark"] .jx-offer-tiers code{background:#3a3020!important;color:#ffd98a!important}' +
    'html[data-reading-theme="dark"] .jx-coll .jx-prod-price{color:#ffd98a!important}html[data-reading-theme="dark"] .jx-hp-k{color:#e8c98a!important}' +
    'html[data-reading-theme="dark"] .jx-bundle{background:#1d1d1d!important;border-color:#d5b16d!important}html[data-reading-theme="dark"] .jx-bundle-items li{background:#2b2312!important}html[data-reading-theme="dark"] .jx-bundle-items li span,html[data-reading-theme="dark"] .jx-bundle-next{color:#f6ead2!important}html[data-reading-theme="dark"] .jx-bundle-rm,html[data-reading-theme="dark"] .jx-bundle-clear{color:#e8c98a!important}' +
    'html[data-reading-theme="dark"] .jx-add{background:#2b2312!important;color:#ffd98a!important}html[data-reading-theme="dark"] .jx-add.is-in{background:#d5b16d!important;color:#14243a!important}' +
    'html[data-reading-theme="dark"] .jx-prod-meta{color:#c9d3d0!important}html[data-reading-theme="dark"] .jx-note{color:#f6f6f6}' +
    'html[data-reading-theme="dark"] .jx-cats button{background:#292929!important;color:#f6f6f6!important;border:1px solid #575757!important}html[data-reading-theme="dark"] .jx-cats button.is-on{background:#d5b16d!important;color:#14243a!important}' +
    '.jx-maker{background:linear-gradient(135deg,#fff4dc,#ffe9c2);border:2px solid #d5b16d;border-radius:24px;padding:20px 22px;margin:18px 0;display:grid;gap:14px;color:#3a2a08}.jx-maker h2{margin:4px 0 6px;font-family:"Playfair Display",Georgia,serif;color:#14243a!important}.jx-maker p{margin:0 0 6px;color:#4d3b14!important}.jx-maker .jx-hp-k{color:#b5401f}.jx-maker-offer{font-weight:800;color:#b5401f!important}' +
    '.jx-maker-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(128px,1fr));gap:12px}.jx-maker-item{background:#fff;border-radius:14px;padding:10px;display:grid;gap:6px;justify-items:start;box-shadow:0 2px 8px rgba(20,36,58,.08)}.jx-maker-item img{width:100%;aspect-ratio:210/297;object-fit:cover;border-radius:8px}.jx-maker-item b{font-size:.92rem;color:#14243a}.jx-maker-item span{font-size:.82rem;color:#5b4a26}.jx-maker-item .jx-buy,.jx-maker-item .jx-add{padding:6px 12px!important;font-size:.85rem}' +
    '.jx-maker-go{display:flex;gap:12px;align-items:center;flex-wrap:wrap}.jx-maker-go .jx-buy{border:0;cursor:pointer;font-size:1rem}.jx-maker-go span{font-weight:700}' +
    'html[data-reading-theme="dark"] .jx-maker{background:linear-gradient(135deg,#2b2312,#3a2c12)!important}html[data-reading-theme="dark"] .jx-maker h2{color:#ffe2a8!important}html[data-reading-theme="dark"] .jx-maker p,html[data-reading-theme="dark"] .jx-maker-go span{color:#f6ead2!important}html[data-reading-theme="dark"] .jx-maker-offer,html[data-reading-theme="dark"] .jx-maker .jx-hp-k{color:#ff9f7a!important}' +
    'html[data-reading-theme="dark"] .jx-maker-item{background:#1d1d1d!important}html[data-reading-theme="dark"] .jx-maker-item b{color:#f6f6f6!important}html[data-reading-theme="dark"] .jx-maker-item span{color:#e6d9b8!important}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------------- gentle "add to home screen" banner on phones (once) ---------------- */
  function A2HSBanner() {
    var s = useState(false), show = s[0], setShow = s[1];
    useEffect(function () {
      var seen = 0; try { seen = +(localStorage.getItem('jnzx-a2hs-seen') || 0); } catch (e) {}
      var visits = 0; try { visits = +(localStorage.getItem('jnzx-visits') || 0) + 1; localStorage.setItem('jnzx-visits', String(visits)); } catch (e) {}
      if (seen || standalone() || visits < 2 || !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
      var t = setTimeout(function () { setShow(true); }, 25000); return function () { clearTimeout(t); };
    }, []);
    if (!show) return null;
    function close() { setShow(false); try { localStorage.setItem('jnzx-a2hs-seen', '1'); } catch (e) {} }
    return h('div', { className: 'jx-a2hs', role: 'dialog', 'aria-label': 'Add The James NZ to your home screen' }, h('span', { style: { fontSize: 26 } }, '☀️'), h('p', null, 'Keep The James NZ one tap away.'), h(InstallButton, { primary: true }), h('button', { type: 'button', className: 'jx-a2hs-x', 'aria-label': 'Close', onClick: close }, '✕'));
  }
  try { var host = document.createElement('div'); document.body.appendChild(host); import_client.createRoot(host).render(h(A2HSBanner)); } catch (e) {}
  try { var rb = document.createElement('div'); rb.id = 'jx-ribbon-host'; var root = document.getElementById('root'); root.parentNode.insertBefore(rb, root); import_client.createRoot(rb).render(h(RibbonHost)); } catch (e) {}
})();
