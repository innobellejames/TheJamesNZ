/* The James NZ — original illustrated covers (October 2026).
   Every topic card and section banner in Kiwi Adventures, Family Together,
   Learning, Modern & Lifestyle and Community gets its own drawn cover:
   a soft scene, a big friendly icon and a witty line. Drawn in code, so
   they're light, sharp on every screen and entirely our own. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var PAL = {
    sky: ['#cfe8ff', '#fef6e4'], sun: ['#ffd9a8', '#fff3dc'], sea: ['#bfe6ee', '#f2fbff'], green: ['#d5f0d0', '#f6fbe9'], rose: ['#ffd9df', '#fff4ef'],
    lilac: ['#e4dcff', '#fbf7ff'], cream: ['#fbe7c6', '#fffaf0'], night: ['#2c3e72', '#6c7fc2'], dusk: ['#f7b8a2', '#ffe7c7'], mint: ['#c9f0e4', '#f3fffa'], gold: ['#ffe8a3', '#fffbe9']
  };
  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;'); }
  function ground(type, W, H) {
    var y = H * 0.72, s = '';
    if (type === 'hills') s = '<path d="M0 ' + (y - 40) + ' Q' + W * 0.25 + ' ' + (y - 140) + ' ' + W * 0.5 + ' ' + (y - 50) + ' T' + W + ' ' + (y - 70) + ' V' + H + ' H0Z" fill="#8fcf9a" opacity=".75"/><path d="M0 ' + y + ' Q' + W * 0.35 + ' ' + (y - 70) + ' ' + W * 0.7 + ' ' + (y - 10) + ' T' + W + ' ' + (y - 20) + ' V' + H + ' H0Z" fill="#5fae74"/>';
    else if (type === 'mountains') s = '<path d="M0 ' + y + ' L' + W * 0.2 + ' ' + (y - 150) + ' L' + W * 0.32 + ' ' + (y - 90) + ' L' + W * 0.5 + ' ' + (y - 190) + ' L' + W * 0.7 + ' ' + (y - 80) + ' L' + W * 0.85 + ' ' + (y - 140) + ' L' + W + ' ' + (y - 60) + ' V' + H + ' H0Z" fill="#7d94b8"/><path d="M' + W * 0.44 + ' ' + (y - 150) + ' L' + W * 0.5 + ' ' + (y - 190) + ' L' + W * 0.56 + ' ' + (y - 150) + ' Q' + W * 0.5 + ' ' + (y - 140) + ' ' + W * 0.44 + ' ' + (y - 150) + 'Z" fill="#fff"/><rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#8ccbe0"/><path d="M0 ' + (y + 18) + ' H' + W + '" stroke="#fff" stroke-opacity=".6" stroke-width="3" stroke-dasharray="30 22"/>';
    else if (type === 'sea') s = '<rect y="' + (y - 20) + '" width="' + W + '" height="' + (H - y + 20) + '" fill="#7cc6d9"/><path d="M0 ' + (y - 20) + ' q30 -14 60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0 t60 0" fill="none" stroke="#fff" stroke-width="5" opacity=".8"/><path d="M0 ' + (H - 40) + ' Q' + W / 2 + ' ' + (H - 80) + ' ' + W + ' ' + (H - 30) + ' V' + H + ' H0Z" fill="#f3dcaa"/>';
    else if (type === 'room') s = '<rect x="' + W * 0.62 + '" y="' + H * 0.12 + '" width="' + W * 0.26 + '" height="' + H * 0.36 + '" rx="10" fill="#fff" opacity=".85"/><path d="M' + W * 0.75 + ' ' + H * 0.12 + ' V' + H * 0.48 + ' M' + W * 0.62 + ' ' + H * 0.3 + ' H' + W * 0.88 + '" stroke="#e7d3b8" stroke-width="6"/><rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#e6c79f"/><path d="M0 ' + y + ' H' + W + '" stroke="#cfa978" stroke-width="6"/>';
    else if (type === 'kitchen') s = '<rect x="' + W * 0.08 + '" y="' + H * 0.2 + '" width="' + W * 0.84 + '" height="10" rx="5" fill="#c79a6b"/><rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#d8b48a"/><path d="M0 ' + (y + 14) + ' H' + W + '" stroke="#fff" stroke-opacity=".35" stroke-width="4"/>';
    else if (type === 'desk') s = '<rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#c99b6d"/><rect x="' + W * 0.12 + '" y="' + (y - 18) + '" width="' + W * 0.3 + '" height="22" rx="4" fill="#fff" transform="rotate(-4 ' + W * 0.27 + ' ' + y + ')"/><rect x="' + W * 0.62 + '" y="' + (y - 30) + '" width="' + W * 0.16 + '" height="34" rx="6" fill="#4d7cc7" opacity=".8"/>';
    else if (type === 'garden') s = '<rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#79c07f"/>' + [0.08, 0.2, 0.34, 0.66, 0.8, 0.92].map(function (x, i) { var cx = W * x, cy = y - 18 - (i % 2) * 14; return '<path d="M' + cx + ' ' + y + ' V' + (cy + 8) + '" stroke="#3f8a4d" stroke-width="4"/><circle cx="' + cx + '" cy="' + cy + '" r="11" fill="' + ['#ff8fab', '#ffd166', '#ffffff', '#ff9e64', '#c3a6ff', '#ffd166'][i] + '"/><circle cx="' + cx + '" cy="' + cy + '" r="4" fill="#f4a261"/>'; }).join('');
    else if (type === 'rain') s = '<g fill="#fff" opacity=".9"><ellipse cx="' + W * 0.25 + '" cy="' + H * 0.18 + '" rx="70" ry="28"/><ellipse cx="' + W * 0.32 + '" cy="' + H * 0.14 + '" rx="50" ry="30"/><ellipse cx="' + W * 0.75 + '" cy="' + H * 0.2 + '" rx="64" ry="24"/></g>' + Array.apply(null, Array(26)).map(function (_, i) { var x = (i * 47) % W, yy = 90 + (i * 29) % (H * 0.5); return '<path d="M' + x + ' ' + yy + ' l-6 16" stroke="#5f9bd1" stroke-width="3" stroke-linecap="round" opacity=".6"/>'; }).join('') + '<rect y="' + y + '" width="' + W + '" height="' + (H - y) + '" fill="#a9c6a0"/>';
    if (type === 'night') s = Array.apply(null, Array(30)).map(function (_, i) { return '<circle cx="' + ((i * 83) % W) + '" cy="' + ((i * 41) % (H * 0.65)) + '" r="' + (1.5 + (i % 3)) + '" fill="#fff" opacity="' + (0.5 + (i % 4) / 8) + '"/>'; }).join('') + '<circle cx="' + W * 0.82 + '" cy="' + H * 0.2 + '" r="34" fill="#fff6cf"/><circle cx="' + (W * 0.82 + 14) + '" cy="' + (H * 0.2 - 8) + '" r="30" fill="#3d5191"/><path d="M0 ' + y + ' Q' + W / 2 + ' ' + (y - 60) + ' ' + W + ' ' + y + ' V' + H + ' H0Z" fill="#24335f"/>';
    return s;
  }
  function svg(o, W, H, big) {
    var p = PAL[o.p] || PAL.sky, id = 'g' + Math.abs(hash(o.e + o.p + W));
    var sun = (o.s === 'night' || o.s === 'rain' || o.s === 'room' || o.s === 'kitchen' || o.s === 'desk') ? '' : '<circle cx="' + W * 0.84 + '" cy="' + H * 0.2 + '" r="' + H * 0.09 + '" fill="#ffd166" opacity=".9"/>';
    var small = (o.m || []).map(function (e, i) {
      var pos = [[0.14, 0.26], [0.86, 0.6], [0.2, 0.66], [0.78, 0.3], [0.1, 0.48]][i % 5];
      return '<text x="' + W * pos[0] + '" y="' + H * pos[1] + '" font-size="' + H * (big ? 0.1 : 0.13) + '" text-anchor="middle" dominant-baseline="central" transform="rotate(' + ((i % 2 ? 1 : -1) * 10) + ' ' + W * pos[0] + ' ' + H * pos[1] + ')">' + e + '</text>';
    }).join('');
    var cx = big ? W * 0.5 : W * 0.5, cy = H * 0.46, r = H * (big ? 0.2 : 0.24);
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + W + ' ' + H + '" width="' + W + '" height="' + H + '"><defs><linearGradient id="' + id + '" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="' + p[0] + '"/><stop offset="1" stop-color="' + p[1] + '"/></linearGradient></defs>' +
      '<rect width="' + W + '" height="' + H + '" fill="url(#' + id + ')"/>' + sun + ground(o.s, W, H) + small +
      '<circle cx="' + cx + '" cy="' + (cy + 6) + '" r="' + r + '" fill="#000" opacity=".08"/><circle cx="' + cx + '" cy="' + cy + '" r="' + r + '" fill="#fff" opacity=".92"/>' +
      '<text x="' + cx + '" y="' + (cy + r * 0.05) + '" font-size="' + r * 1.15 + '" text-anchor="middle" dominant-baseline="central">' + o.e + '</text></svg>';
  }
  function hash(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 31 + s.charCodeAt(i)) | 0; return x; }
  function uri(s) { return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(s); }

  // name: [scene, palette, icon, [motifs], witty line]
  var C = {
    // Kiwi Adventures
    'Weather & OOTD': ['hills', 'sky', '🌦️', ['🧥', '🩴', '☂️'], 'Four seasons in one day — dress for all of them.'],
    'Today’s fruit & vege picks': ['garden', 'green', '🥝', ['🍎', '🥕', '🥦'], 'An apple a day keeps the doctor away.'],
    'NZ bucket lists': ['mountains', 'sky', '🗺️', ['⛺', '🚐', '🥾'], 'Life’s short. Take the scenic route.'],
    'NZ quiz': ['sea', 'sun', '❓', ['🐑', '🏉', '🥝'], 'Sweet as — let’s see how Kiwi you are.'],
    'x:world-clock': ['sea', 'sky', '🌏', ['⏰', '✈️', '📞'], 'Somewhere it’s always coffee o’clock.'],
    'NZ safety & know-how': ['hills', 'mint', '🩹', ['🧴', '🔦', '🚗'], 'She’ll be right — once the first-aid kit is packed.'],
    // Family Together
    'Reading nook': ['night', 'night', '📚', ['⭐', '🧸', '🌙'], 'Once upon a time is the best time.'],
    'Family tips': ['room', 'cream', '🏡', ['🧺', '🧽', '⏰'], 'A tidy house is nice; a happy one is better.'],
    'Family checklists': ['desk', 'gold', '✅', ['📝', '🎒', '📌'], 'Lists today, calm tomorrow.'],
    'Homemade recipes': ['kitchen', 'cream', '🍲', ['🥕', '🧄', '🍞'], 'Made with love — and a little butter.'],
    'Grocery list': ['kitchen', 'mint', '🛒', ['🍎', '🥛', '🧀'], 'Shop the list, not the aisle.'],
    'Budget tracker': ['desk', 'green', '💰', ['🐷', '📊', '🪙'], 'Look after the cents and the dollars follow.'],
    'Pregnancy & baby age': ['hills', 'rose', '🤰', ['📅', '🍼', '💕'], 'Growing a whole human — no big deal.'],
    'Pregnancy quotes & tips': ['garden', 'rose', '🌱', ['💕', '🌷', '✨'], 'Little feet, big love.'],
    'Parenting quotes & tips': ['hills', 'sun', '👨‍👩‍👧', ['🎈', '🧸', '💛'], 'Kids don’t need perfect — they need present.'],
    'Breastfeeding quotes & tips': ['room', 'lilac', '🤱', ['🌙', '💛', '💧'], 'Every feed is a cuddle with benefits.'],
    'Partnership quotes & tips': ['night', 'night', '💑', ['☕', '🌹', '🌙'], 'Date night can be a cuppa on the couch.'],
    'Husband & wife quotes & tips': ['hills', 'dusk', '💌', ['❤️', '🌹', '🕯️'], 'Love is noticing who refilled the kettle.'],
    'Parent–child & child–parent': ['garden', 'sky', '🫶', ['🪁', '🌈', '📸'], 'The best memories come with muddy boots.'],
    'x:diy': ['room', 'gold', '🔨', ['🪚', '🎨', '🪴'], 'Someone’s trash is someone’s treasure — upcycle it!'],
    'x:holidays': ['rain', 'sky', '🏕️', ['🎲', '🖍️', '🧁'], 'Rainy days were made for pillow forts.'],
    'x:celebrations': ['night', 'night', '✨', ['🎄', '🐣', '⭐'], 'Every season brings a reason to gather.'],
    // Learning
    'Languages': ['hills', 'sky', '👋', ['🌏', '💬', '🗣️'], 'Kia ora, hola, bonjour — hello, world!'],
    'Kids’ learning & activities': ['garden', 'gold', '🧸', ['🔤', '🎨', '🧩'], 'Little minds, big wonders.'],
    'x:science': ['night', 'night', '⚗️', ['⚛️', '🔬', '🧪'], 'Chemistry jokes? Only if I get a reaction.'],
    'x:math': ['desk', 'lilac', '➗', ['📐', '🧮', '📈'], 'Maths: the only place where 60 watermelons is normal.'],
    'x:english': ['room', 'cream', '📖', ['✏️', '🔤', '💬'], 'Words are free. Use them beautifully.'],
    'x:leadership': ['mountains', 'sun', '🧭', ['🏆', '🤝', '⛰️'], 'Lead from the front, care from the heart.'],
    'Speaking practice': ['hills', 'dusk', '🎤', ['🗣️', '👏', '⏱️'], 'Nervous? That just means it matters.'],
    'x:speaking-time': ['desk', 'mint', '⏱️', ['🎤', '📝', '⌛'], 'Time flies when you’re talking.'],
    'x:nzsl': ['hills', 'sky', '🤟', ['👋', '🙌', '✋'], 'Say it with your hands.'],
    // Modern & Lifestyle
    'x:design': ['hills', 'dusk', '🎨', ['✏️', '🖼️', '✨'], 'Make it pretty, make it yours.'],
    'x:shortcuts': ['night', 'night', '⌨️', ['⚡', '🖱️', '💻'], 'Ctrl + Z: the life skill we all wish for.'],
    'Saving tips': ['room', 'green', '🐷', ['🪙', '💡', '🛒'], 'Small savings, big smiles.'],
    // Community
    'About us': ['sea', 'sky', '🏠', ['🐶', '💛', '🌿'], 'Faith, family and a very good dog.'],
    'Small business': ['garden', 'sun', '🧺', ['🧁', '🪴', '🧵'], 'Shop local — your neighbour says thanks.'],
    'How to use this website': ['hills', 'mint', '🧭', ['🐾', '📍', '💡'], 'Lost? Mateo knows the way.'],
    'FAQ': ['desk', 'lilac', '💬', ['❓', '💡', '✅'], 'Good questions deserve simple answers.'],
    'Home & garden': ['garden', 'green', '🌻', ['🪴', '🥕', '🐝'], 'Bloom where you’re planted.'],
    'x:sustainable': ['hills', 'green', '♻️', ['🌍', '🌿', '🚲'], 'Reduce, reuse, re-smile.'],
    'x:public-holidays': ['sea', 'sun', '📅', ['🎉', '🏖️', '🥝'], 'Long weekends: a true national treasure.'],
    'x:jobs': ['desk', 'sky', '💼', ['📄', '🤝', '🌟'], 'Your next adventure might start on Monday.']
  };
  var HERO = {
    'Kiwi Adventures': ['mountains', 'sky', '🥝', ['🏔️', '🚐', '🐑', '🌿', '🏖️']],
    'Family Together': ['hills', 'dusk', '🏡', ['👨‍👩‍👧‍👧', '🐶', '🍲', '📚', '💛']],
    'Learning': ['desk', 'sky', '📚', ['✏️', '🔬', '🧮', '🌏', '🎤']],
    'Modern & Lifestyle': ['hills', 'lilac', '💡', ['🎨', '⌨️', '🐷', '📱', '✨']],
    'Community': ['sea', 'sun', '🤝', ['🏘️', '🧺', '🌻', '♻️', '🐾']]
  };
  var cache = {};
  JNZX.cover = function (name) {
    var c = C[name]; if (!c) return null;
    return cache[name] || (cache[name] = uri(svg({ s: c[0], p: c[1], e: c[2], m: c[3] }, 600, 400)));
  };
  JNZX.coverLine = function (name) { var c = C[name]; return c ? c[4] : ''; };
  JNZX.heroCover = function (group) {
    var c = HERO[group]; if (!c) return null;
    return cache['h:' + group] || (cache['h:' + group] = uri(svg({ s: c[0], p: c[1], e: c[2], m: c[3] }, 1000, 640, true)));
  };
})();
