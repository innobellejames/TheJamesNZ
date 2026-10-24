/* The James NZ — Modern & Lifestyle › Design Studio (October 2026).
   A simple Canva-style editor for invitations, posters and social posts.
   Everything runs in the browser; designs are saved on this device and can
   be exported (PNG, JPG, PDF), shared as a picture, or shared as a link. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef, useMemo = R.useMemo, useCallback = R.useCallback;

  var SIZES = [
    ['a4p', 'A4 poster (portrait)', 1240, 1754, [595.28, 841.89]], ['a4l', 'A4 (landscape)', 1754, 1240, [841.89, 595.28]], ['a5p', 'A5 invitation', 874, 1240, [419.53, 595.28]],
    ['sq', 'Square post (Instagram/Facebook)', 1080, 1080], ['story', 'Story (phone, 9:16)', 1080, 1920], ['fb', 'Link/event banner (1200×630)', 1200, 630], ['card', 'Greeting card 5×7"', 1050, 1500, [360, 504]]
  ];
  var FONTS = [['Georgia, serif', 'Georgia (classic)'], ['"Times New Roman", serif', 'Times'], ['Arial, Helvetica, sans-serif', 'Arial'], ['"Trebuchet MS", sans-serif', 'Trebuchet'], ['Verdana, sans-serif', 'Verdana'], ['Impact, "Arial Black", sans-serif', 'Impact (bold)'], ['"Courier New", monospace', 'Courier'], ['"Brush Script MT", "Segoe Script", cursive', 'Script'], ['"Palatino Linotype", Palatino, serif', 'Palatino']];
  var SWATCH = ['#ffffff', '#1f2a37', '#b42132', '#1b6b63', '#244f9f', '#f2c14e', '#ff8fab', '#7e57c2', '#2e7d32', '#ef6c00', '#00838f', '#6d4c41', '#000000', '#fdf3e1'];
  var STICKERS = ['⭐', '🎉', '🎂', '🎈', '💒', '✝️', '🕊️', '🌸', '🌿', '🥝', '☕', '🍰', '🎵', '❤️', '🙏', '🌟', '🎄', '🥚', '✨', '📅', '📍', '🌺', '🏖️', '⚽'];
  var uid = function () { return Math.random().toString(36).slice(2, 9); };

  function T(o) { return Object.assign({ id: uid(), type: 'text', x: 100, y: 100, w: 800, h: 120, rot: 0, opacity: 1, text: 'Your text', font: FONTS[0][0], size: 72, bold: false, italic: false, align: 'center', color: '#1f2a37', lineH: 1.2, spacing: 0, shadow: false, upper: false }, o); }
  function Sh(o) { return Object.assign({ id: uid(), type: 'rect', x: 100, y: 100, w: 300, h: 200, rot: 0, opacity: 1, fill: '#f2c14e', stroke: '', strokeW: 0, radius: 0 }, o); }
  function template(kind) {
    var W, H;
    if (kind === 'birthday') { W = 874; H = 1240; return { w: W, h: H, size: 'a5p', bg: { type: 'grad', c1: '#ffe8f0', c2: '#ffd6a5', angle: 160 }, objs: [
      Sh({ type: 'ellipse', x: -120, y: -120, w: 420, h: 420, fill: '#ff8fab', opacity: 0.35 }), Sh({ type: 'ellipse', x: 600, y: 980, w: 420, h: 420, fill: '#f2c14e', opacity: 0.4 }),
      T({ type: 'emoji', text: '🎈', x: 80, y: 120, w: 160, h: 160, size: 140 }), T({ type: 'emoji', text: '🎂', x: 337, y: 150, w: 200, h: 200, size: 170 }), T({ type: 'emoji', text: '🎉', x: 640, y: 120, w: 160, h: 160, size: 140 }),
      T({ text: 'You’re invited!', x: 60, y: 400, w: 754, h: 110, font: FONTS[7][0], size: 96, color: '#b42132' }),
      T({ text: 'SUE IS TURNING 7', x: 60, y: 530, w: 754, h: 80, font: FONTS[2][0], size: 54, bold: true, color: '#1f2a37', spacing: 4 }),
      T({ text: 'Saturday 14 November · 2 pm–4 pm\n12 Kōwhai Street, Hamilton', x: 60, y: 660, w: 754, h: 140, size: 40, color: '#1f2a37', lineH: 1.4 }),
      Sh({ x: 237, y: 880, w: 400, h: 90, fill: '#b42132', radius: 45 }),
      T({ text: 'RSVP to Mum by 7 Nov', x: 237, y: 897, w: 400, h: 60, font: FONTS[2][0], size: 34, bold: true, color: '#ffffff' }),
      T({ text: 'Games · cake · lots of fun', x: 60, y: 1030, w: 754, h: 60, size: 34, italic: true, color: '#6d4c41' })] }; }
    if (kind === 'church') { W = 1240; H = 1754; return { w: W, h: H, size: 'a4p', bg: { type: 'grad', c1: '#163d6b', c2: '#0b1f36', angle: 180 }, objs: [
      Sh({ type: 'ellipse', x: 370, y: 140, w: 500, h: 500, fill: '#f2c14e', opacity: 0.18 }), T({ type: 'emoji', text: '🕊️', x: 470, y: 230, w: 300, h: 300, size: 260 }),
      T({ text: 'PARISH FAMILY DAY', x: 80, y: 700, w: 1080, h: 90, font: FONTS[2][0], size: 64, bold: true, color: '#f2c14e', spacing: 8 }),
      T({ text: 'Faith, food & fun\nfor all ages', x: 80, y: 820, w: 1080, h: 280, size: 110, color: '#ffffff', lineH: 1.15 }),
      Sh({ type: 'line', x: 420, y: 1160, w: 400, h: 0, stroke: '#f2c14e', strokeW: 6 }),
      T({ text: 'Sunday 22 November after 10 am Mass\nSt Mary’s Parish Hall', x: 80, y: 1210, w: 1080, h: 170, size: 54, color: '#e9eef3', lineH: 1.45 }),
      T({ text: 'Bring a plate · Children’s games · Sausage sizzle', x: 80, y: 1450, w: 1080, h: 70, size: 40, italic: true, color: '#f2c14e' }),
      T({ text: 'All welcome — haere mai!', x: 80, y: 1580, w: 1080, h: 70, font: FONTS[2][0], size: 44, bold: true, color: '#ffffff' })] }; }
    if (kind === 'sale') { W = 1080; H = 1080; return { w: W, h: H, size: 'sq', bg: { type: 'solid', c1: '#f2c14e' }, objs: [
      Sh({ x: 60, y: 60, w: 960, h: 960, fill: '', stroke: '#1f2a37', strokeW: 10, radius: 30 }),
      T({ text: 'GARAGE', x: 80, y: 150, w: 920, h: 200, font: FONTS[5][0], size: 210, color: '#1f2a37' }), T({ text: 'SALE', x: 80, y: 340, w: 920, h: 200, font: FONTS[5][0], size: 210, color: '#b42132' }),
      T({ text: 'Toys · books · furniture · baby gear', x: 80, y: 590, w: 920, h: 70, size: 46, color: '#1f2a37' }),
      Sh({ x: 190, y: 720, w: 700, h: 170, fill: '#1f2a37', radius: 20 }),
      T({ text: 'Sat 7 Nov · 8 am – 12 pm\n45 Pōhutukawa Drive', x: 190, y: 745, w: 700, h: 130, font: FONTS[2][0], size: 44, bold: true, color: '#ffffff', lineH: 1.35 }),
      T({ text: 'Cash or bank transfer · No early birds please', x: 80, y: 930, w: 920, h: 50, size: 30, color: '#1f2a37' })] }; }
    if (kind === 'baptism') { W = 874; H = 1240; return { w: W, h: H, size: 'a5p', bg: { type: 'solid', c1: '#fdf8f0' }, objs: [
      Sh({ x: 40, y: 40, w: 794, h: 1160, fill: '', stroke: '#c9a227', strokeW: 4, radius: 10 }), Sh({ x: 60, y: 60, w: 754, h: 1120, fill: '', stroke: '#c9a227', strokeW: 1.5, radius: 6 }),
      T({ type: 'emoji', text: '✝️', x: 357, y: 130, w: 160, h: 160, size: 120 }),
      T({ text: 'Please join us for the', x: 80, y: 320, w: 714, h: 60, size: 36, italic: true, color: '#6d4c41' }),
      T({ text: 'Baptism', x: 80, y: 390, w: 714, h: 140, font: FONTS[7][0], size: 130, color: '#1b6b63' }),
      T({ text: 'of', x: 80, y: 540, w: 714, h: 50, size: 34, italic: true, color: '#6d4c41' }),
      T({ text: 'MYE ROSE', x: 80, y: 600, w: 714, h: 90, font: FONTS[0][0], size: 72, color: '#1f2a37', spacing: 8 }),
      T({ text: 'Sunday 6 December at 11:30 am\nSacred Heart Church\nMorning tea to follow', x: 80, y: 760, w: 714, h: 200, size: 36, color: '#1f2a37', lineH: 1.5 }),
      T({ text: '“Let the little children come to me.” — Matthew 19:14', x: 80, y: 1050, w: 714, h: 60, size: 26, italic: true, color: '#1b6b63' })] }; }
    if (kind === 'fundraiser') { W = 1080; H = 1920; return { w: W, h: H, size: 'story', bg: { type: 'grad', c1: '#1b6b63', c2: '#0f3d39', angle: 180 }, objs: [
      T({ type: 'emoji', text: '🥝', x: 390, y: 180, w: 300, h: 300, size: 240 }),
      T({ text: 'QUIZ NIGHT', x: 60, y: 560, w: 960, h: 170, font: FONTS[5][0], size: 160, color: '#f2c14e' }),
      T({ text: 'Fundraiser for our school camp', x: 60, y: 760, w: 960, h: 80, size: 54, color: '#ffffff' }),
      Sh({ x: 140, y: 920, w: 800, h: 420, fill: '#ffffff', radius: 40, opacity: 0.12 }),
      T({ text: 'Friday 20 November\n7 pm · School Hall\nTables of 6 · $60 per table', x: 160, y: 980, w: 760, h: 300, size: 60, color: '#ffffff', lineH: 1.5 }),
      T({ text: 'Raffles · spot prizes · supper', x: 60, y: 1450, w: 960, h: 80, size: 48, italic: true, color: '#f2c14e' }),
      T({ text: 'Book: office@ourschool.example', x: 60, y: 1650, w: 960, h: 70, font: FONTS[2][0], size: 42, bold: true, color: '#ffffff' })] }; }
    if (kind === 'wedding') { W = 1050; H = 1500; return { w: W, h: H, size: 'card', bg: { type: 'solid', c1: '#ffffff' }, objs: [
      T({ type: 'emoji', text: '🌿', x: 60, y: 60, w: 200, h: 200, size: 170, rot: -20 }), T({ type: 'emoji', text: '🌸', x: 790, y: 1240, w: 200, h: 200, size: 170, rot: 15 }),
      T({ text: 'Together with their families', x: 80, y: 330, w: 890, h: 60, size: 36, italic: true, color: '#6d4c41' }),
      T({ text: 'Aroha & Sam', x: 80, y: 420, w: 890, h: 160, font: FONTS[7][0], size: 140, color: '#1b6b63' }),
      T({ text: 'request the pleasure of your company\nat the celebration of their marriage', x: 80, y: 620, w: 890, h: 120, size: 36, color: '#1f2a37', lineH: 1.5 }),
      Sh({ type: 'line', x: 375, y: 790, w: 300, h: 0, stroke: '#c9a227', strokeW: 3 }),
      T({ text: 'SATURDAY 20 MARCH 2027\n2 PM · ST JOSEPH’S CHURCH\nRECEPTION TO FOLLOW', x: 80, y: 840, w: 890, h: 200, font: FONTS[0][0], size: 40, color: '#1f2a37', lineH: 1.6, spacing: 3 }),
      T({ text: 'RSVP by 1 February', x: 80, y: 1120, w: 890, h: 60, size: 32, italic: true, color: '#6d4c41' })] }; }
    var sz = SIZES.find(function (s) { return s[0] === kind; }) || SIZES[3];
    return { w: sz[2], h: sz[3], size: sz[0], bg: { type: 'solid', c1: '#ffffff' }, objs: [T({ text: 'Tap to edit your heading', x: sz[2] * 0.08, y: sz[3] * 0.4, w: sz[2] * 0.84, h: 140, size: Math.round(sz[2] / 14) })] };
  }
  var TEMPLATES = [['birthday', '🎂 Birthday invitation'], ['baptism', '✝️ Baptism invitation'], ['wedding', '💒 Wedding invitation'], ['church', '🕊️ Parish event poster'], ['fundraiser', '🥝 Fundraiser story'], ['sale', '🏷️ Garage sale post']];

  /* ---------- drawing ---------- */
  var imgCache = {};
  function getImg(src, cb) { if (!src) return null; var im = imgCache[src]; if (im) return im.complete ? im : null; im = new Image(); im.onload = cb; im.src = src; imgCache[src] = im; return null; }
  function wrap(g, text, maxW) {
    var out = [];
    String(text).split('\n').forEach(function (para) {
      var words = para.split(' '), cur = '';
      words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t; });
      out.push(cur);
    });
    return out;
  }
  function fontOf(o) { return (o.italic ? 'italic ' : '') + (o.bold ? '700 ' : '400 ') + o.size + 'px ' + o.font; }
  function draw(g, doc, opts, redraw) {
    opts = opts || {};
    var W = doc.w, H = doc.h;
    g.save(); g.clearRect(0, 0, W, H);
    var bg = doc.bg || { type: 'solid', c1: '#fff' };
    if (bg.type === 'grad') { var a = (bg.angle || 180) * Math.PI / 180, cx = W / 2, cy = H / 2, r = Math.abs(W * Math.sin(a)) / 2 + Math.abs(H * Math.cos(a)) / 2; var gr = g.createLinearGradient(cx - Math.sin(a) * r, cy + Math.cos(a) * r, cx + Math.sin(a) * r, cy - Math.cos(a) * r); gr.addColorStop(0, bg.c1); gr.addColorStop(1, bg.c2 || bg.c1); g.fillStyle = gr; } else g.fillStyle = bg.c1 || '#fff';
    g.fillRect(0, 0, W, H);
    if (doc.bgImage) { var bi = getImg(doc.bgImage, redraw); if (bi) { var s = Math.max(W / bi.width, H / bi.height); g.globalAlpha = doc.bgImageOpacity === undefined ? 1 : doc.bgImageOpacity; g.drawImage(bi, (W - bi.width * s) / 2, (H - bi.height * s) / 2, bi.width * s, bi.height * s); g.globalAlpha = 1; } }
    doc.objs.forEach(function (o) {
      if (o.hidden) return;
      g.save(); g.globalAlpha = o.opacity === undefined ? 1 : o.opacity;
      g.translate(o.x + o.w / 2, o.y + o.h / 2); g.rotate((o.rot || 0) * Math.PI / 180); g.translate(-o.w / 2, -o.h / 2);
      if (o.type === 'rect') { g.beginPath(); if (g.roundRect) g.roundRect(0, 0, o.w, o.h, Math.min(o.radius || 0, o.w / 2, o.h / 2)); else g.rect(0, 0, o.w, o.h); if (o.fill) { g.fillStyle = o.fill; g.fill(); } if (o.stroke && o.strokeW) { g.lineWidth = o.strokeW; g.strokeStyle = o.stroke; g.stroke(); } }
      else if (o.type === 'ellipse') { g.beginPath(); g.ellipse(o.w / 2, o.h / 2, Math.abs(o.w / 2), Math.abs(o.h / 2), 0, 0, Math.PI * 2); if (o.fill) { g.fillStyle = o.fill; g.fill(); } if (o.stroke && o.strokeW) { g.lineWidth = o.strokeW; g.strokeStyle = o.stroke; g.stroke(); } }
      else if (o.type === 'line') { g.beginPath(); g.moveTo(0, o.h / 2); g.lineTo(o.w, o.h / 2); g.lineWidth = o.strokeW || 4; g.strokeStyle = o.stroke || '#000'; g.lineCap = 'round'; g.stroke(); }
      else if (o.type === 'image') { var im = getImg(o.src, redraw); if (im) { g.save(); if (o.radius) { g.beginPath(); if (g.roundRect) g.roundRect(0, 0, o.w, o.h, o.radius); else g.rect(0, 0, o.w, o.h); g.clip(); } g.drawImage(im, 0, 0, o.w, o.h); g.restore(); } else { g.fillStyle = '#e5e7eb'; g.fillRect(0, 0, o.w, o.h); } }
      else if (o.type === 'emoji') { g.font = o.size + 'px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'; g.textAlign = 'center'; g.textBaseline = 'middle'; g.fillText(o.text, o.w / 2, o.h / 2 + o.size * 0.05); }
      else if (o.type === 'text') {
        g.font = fontOf(o); g.fillStyle = o.color; g.textBaseline = 'top';
        try { g.letterSpacing = (o.spacing || 0) + 'px'; } catch (e) {}
        if (o.shadow) { g.shadowColor = 'rgba(0,0,0,.35)'; g.shadowBlur = o.size * 0.15; g.shadowOffsetY = o.size * 0.05; }
        var lines = wrap(g, o.upper ? String(o.text).toUpperCase() : o.text, o.w), lh = o.size * (o.lineH || 1.2);
        lines.forEach(function (l, i) { var x = o.align === 'left' ? 0 : o.align === 'right' ? o.w : o.w / 2; g.textAlign = o.align || 'center'; g.fillText(l, x, i * lh + (lh - o.size) / 2); });
        o._lines = lines.length; o._needH = lines.length * lh;
      }
      g.restore();
    });
    if (opts.sel) {
      var o = doc.objs.find(function (x) { return x.id === opts.sel; });
      if (o) {
        var k = opts.scale || 1, hs = 9 / k;
        g.save(); g.translate(o.x + o.w / 2, o.y + o.h / 2); g.rotate((o.rot || 0) * Math.PI / 180); g.translate(-o.w / 2, -o.h / 2);
        g.strokeStyle = '#2f6fd0'; g.lineWidth = 2 / k; g.setLineDash([6 / k, 4 / k]); g.strokeRect(0, 0, o.w, Math.max(o.h, 1)); g.setLineDash([]);
        g.fillStyle = '#fff'; g.lineWidth = 2 / k;
        [[0, 0], [o.w, 0], [0, o.h], [o.w, o.h]].forEach(function (p) { g.beginPath(); g.rect(p[0] - hs, p[1] - hs, hs * 2, hs * 2); g.fill(); g.stroke(); });
        g.beginPath(); g.moveTo(o.w / 2, 0); g.lineTo(o.w / 2, -34 / k); g.stroke(); g.beginPath(); g.arc(o.w / 2, -40 / k, 8 / k, 0, Math.PI * 2); g.fill(); g.stroke();
        g.restore();
      }
      if (opts.guides) { g.strokeStyle = '#e11d74'; g.lineWidth = 1.5 / (opts.scale || 1); opts.guides.forEach(function (gd) { g.beginPath(); if (gd[0] === 'v') { g.moveTo(gd[1], 0); g.lineTo(gd[1], H); } else { g.moveTo(0, gd[1]); g.lineTo(W, gd[1]); } g.stroke(); }); }
    }
    g.restore();
  }
  function toLocal(o, px, py) { var cx = o.x + o.w / 2, cy = o.y + o.h / 2, a = -(o.rot || 0) * Math.PI / 180, dx = px - cx, dy = py - cy; return { x: dx * Math.cos(a) - dy * Math.sin(a) + o.w / 2, y: dx * Math.sin(a) + dy * Math.cos(a) + o.h / 2 }; }

  /* ---------- share-link encoding ---------- */
  async function encodeDoc(doc) {
    var json = JSON.stringify(doc, function (k, v) { return k[0] === '_' ? undefined : v; });
    var bytes = new TextEncoder().encode(json);
    try { var cs = new CompressionStream('deflate-raw'); var out = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(cs)).arrayBuffer()); bytes = out; json = null; } catch (e) { json = 'J'; }
    var b = ''; bytes.forEach(function (x) { b += String.fromCharCode(x); });
    return (json === 'J' ? 'J' : 'Z') + btoa(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }
  async function decodeDoc(s) {
    var kind = s[0], raw = atob(s.slice(1).replace(/-/g, '+').replace(/_/g, '/')), bytes = Uint8Array.from(raw, function (c) { return c.charCodeAt(0); });
    if (kind === 'Z') { var ds = new DecompressionStream('deflate-raw'); bytes = new Uint8Array(await new Response(new Blob([bytes]).stream().pipeThrough(ds)).arrayBuffer()); }
    var doc = JSON.parse(new TextDecoder().decode(bytes));
    if (!doc || !Array.isArray(doc.objs) || doc.objs.length > 300) throw Error('bad');
    doc.objs = doc.objs.filter(function (o) { return o && /^(text|rect|ellipse|line|emoji|image)$/.test(o.type); }).map(function (o) { o.id = o.id || uid(); if (o.type === 'image' && !/^data:image\/(png|jpe?g|webp|gif);/.test(o.src || '')) o.src = ''; return o; });
    if (doc.bgImage && !/^data:image\//.test(doc.bgImage)) doc.bgImage = null;
    return doc;
  }
  function readLinkParam() { try { var hsh = (window.location.hash || ''); try { if (!hsh) hsh = window.parent.location.hash; } catch (e) {} var p = new URLSearchParams(hsh.slice(1)); return p.get('design'); } catch (e) { return null; } }
  function fileToDataURL(file, maxSide) {
    return new Promise(function (res, rej) {
      var fr = new FileReader(); fr.onerror = rej;
      fr.onload = function () { var im = new Image(); im.onload = function () { var s = Math.min(1, maxSide / Math.max(im.width, im.height)), c = document.createElement('canvas'); c.width = Math.round(im.width * s); c.height = Math.round(im.height * s); c.getContext('2d').drawImage(im, 0, 0, c.width, c.height); res({ src: c.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', 0.88), w: c.width, h: c.height }); }; im.onerror = rej; im.src = fr.result; };
      fr.readAsDataURL(file);
    });
  }
  function dl(blob, name) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }

  /* ---------- editor ---------- */
  function Studio(props) {
    var saved = JNZX.useStored('jnzx-design-docs', []), docs = saved[0], setDocs = saved[1];
    var d = useState(function () { return template('birthday'); }), doc = d[0], setDocRaw = d[1];
    var nm = useState('My design'), name = nm[0], setName = nm[1];
    var s = useState(null), sel = s[0], setSel = s[1];
    var gu = useState(null), guides = gu[0], setGuides = gu[1];
    var ms = useState(''), msg = ms[0], setMsg = ms[1];
    var hist = useRef({ past: [], future: [] });
    var cv = useRef(null), wrapRef = useRef(null), drag = useRef(null), fileRef = useRef(null), bgFileRef = useRef(null);
    var sc = useState(0.4), scale = sc[0], setScale = sc[1];
    var tick = useState(0), redrawN = tick[1];
    function setDoc(next, noHist) { if (!noHist) { hist.current.past.push(JSON.stringify(doc)); if (hist.current.past.length > 60) hist.current.past.shift(); hist.current.future = []; } setDocRaw(next); }
    function undo() { var p = hist.current.past.pop(); if (!p) return; hist.current.future.push(JSON.stringify(doc)); setDocRaw(JSON.parse(p)); }
    function redo() { var f = hist.current.future.pop(); if (!f) return; hist.current.past.push(JSON.stringify(doc)); setDocRaw(JSON.parse(f)); }
    var selObj = doc.objs.find(function (o) { return o.id === sel; });
    function patch(p, noHist) { setDoc(Object.assign({}, doc, { objs: doc.objs.map(function (o) { return o.id === sel ? Object.assign({}, o, p) : o; }) }), noHist); }
    // open from link
    useEffect(function () { var p = readLinkParam(); if (p) decodeDoc(p).then(function (dd) { setDocRaw(dd); setMsg('Design opened from a shared link. Save it to keep a copy on this device.'); }, function () { setMsg('That design link could not be opened.'); }); }, []);
    // fit to width
    useEffect(function () { function fit() { var el = wrapRef.current; if (!el) return; var avail = el.clientWidth - 4, availH = Math.max(320, window.innerHeight * 0.72); setScale(Math.min(avail / doc.w, availH / doc.h, 1)); } fit(); window.addEventListener('resize', fit); return function () { window.removeEventListener('resize', fit); }; }, [doc.w, doc.h]);
    useEffect(function () { var c = cv.current; if (!c) return; var dpr = window.devicePixelRatio || 1; c.width = doc.w * scale * dpr; c.height = doc.h * scale * dpr; c.style.width = doc.w * scale + 'px'; c.style.height = doc.h * scale + 'px'; var g = c.getContext('2d'); g.setTransform(scale * dpr, 0, 0, scale * dpr, 0, 0); draw(g, doc, { sel: sel, scale: scale, guides: guides }, function () { redrawN(Date.now()); }); });
    // keyboard
    useEffect(function () {
      function k(e) {
        var tag = (e.target.tagName || '').toLowerCase(); if (tag === 'input' || tag === 'textarea' || tag === 'select') return;
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); e.shiftKey ? redo() : undo(); return; }
        if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') { e.preventDefault(); redo(); return; }
        if (!selObj) return;
        if (e.key === 'Delete' || e.key === 'Backspace') { e.preventDefault(); remove(); }
        var step = e.shiftKey ? 10 : 1, mv = { ArrowLeft: [-step, 0], ArrowRight: [step, 0], ArrowUp: [0, -step], ArrowDown: [0, step] }[e.key];
        if (mv) { e.preventDefault(); patch({ x: selObj.x + mv[0], y: selObj.y + mv[1] }); }
      }
      window.addEventListener('keydown', k); return function () { window.removeEventListener('keydown', k); };
    });
    function pos(e) { var r = cv.current.getBoundingClientRect(); return { x: (e.clientX - r.left) / scale, y: (e.clientY - r.top) / scale }; }
    function down(e) {
      var p = pos(e), hs = 14 / scale;
      if (selObj) {
        var l = toLocal(selObj, p.x, p.y);
        if (Math.hypot(l.x - selObj.w / 2, l.y + 40 / scale) < hs) { drag.current = { mode: 'rot', o: selObj, start: JSON.stringify(doc) }; return cap(e); }
        var corners = [[0, 0, 'nw'], [selObj.w, 0, 'ne'], [0, selObj.h, 'sw'], [selObj.w, selObj.h, 'se']];
        for (var i = 0; i < corners.length; i++) if (Math.abs(l.x - corners[i][0]) < hs && Math.abs(l.y - corners[i][1]) < hs) { drag.current = { mode: 'resize', corner: corners[i][2], o: Object.assign({}, selObj), p0: p, start: JSON.stringify(doc) }; return cap(e); }
      }
      for (var j = doc.objs.length - 1; j >= 0; j--) {
        var o = doc.objs[j]; if (o.locked || o.hidden) continue;
        var lo = toLocal(o, p.x, p.y), pad = o.type === 'line' ? 14 / scale : 0;
        if (lo.x >= -pad && lo.x <= o.w + pad && lo.y >= -pad - (o.type === 'line' ? 0 : 0) && lo.y <= Math.max(o.h, 1) + pad) { setSel(o.id); drag.current = { mode: 'move', o: Object.assign({}, o), p0: p, start: JSON.stringify(doc) }; return cap(e); }
      }
      setSel(null);
    }
    function cap(e) { try { cv.current.setPointerCapture(e.pointerId); } catch (x) {} }
    function move(e) {
      var dg = drag.current; if (!dg) return;
      var p = pos(e), o = dg.o, np;
      if (dg.mode === 'move') {
        var nx = o.x + p.x - dg.p0.x, ny = o.y + p.y - dg.p0.y, gl = [], th = 8 / scale;
        var cxx = nx + o.w / 2, cyy = ny + o.h / 2;
        if (Math.abs(cxx - doc.w / 2) < th) { nx = doc.w / 2 - o.w / 2; gl.push(['v', doc.w / 2]); }
        if (Math.abs(cyy - doc.h / 2) < th) { ny = doc.h / 2 - o.h / 2; gl.push(['h', doc.h / 2]); }
        setGuides(gl.length ? gl : null); np = { x: Math.round(nx), y: Math.round(ny) };
      } else if (dg.mode === 'resize') {
        var a = (o.rot || 0) * Math.PI / 180, dx = p.x - dg.p0.x, dy = p.y - dg.p0.y, lx = dx * Math.cos(-a) - dy * Math.sin(-a), ly = dx * Math.sin(-a) + dy * Math.cos(-a);
        var w = o.w, hh = o.h, x = o.x, y = o.y, c = dg.corner;
        if (c.indexOf('e') >= 0) w = o.w + lx; else { w = o.w - lx; x = o.x + lx; }
        if (c.indexOf('s') >= 0) hh = o.h + ly; else { hh = o.h - ly; y = o.y + ly; }
        if (o.type === 'emoji' || o.type === 'image' || e.shiftKey) { var r2 = o.w / Math.max(1, o.h); if (Math.abs(w / o.w) > Math.abs(hh / Math.max(1, o.h))) hh = w / r2; else w = hh * r2; if (c.indexOf('w') >= 0) x = o.x + o.w - w; if (c.indexOf('n') >= 0) y = o.y + o.h - hh; }
        w = Math.max(20, w); hh = o.type === 'line' ? 0 : Math.max(10, hh);
        np = { x: Math.round(x), y: Math.round(y), w: Math.round(w), h: Math.round(hh) };
        if (o.type === 'emoji') np.size = Math.round(Math.min(w, hh) * 0.85);
        if (o.type === 'text' && c === 'se' && e.altKey) np.size = Math.max(8, Math.round(o.size * w / o.w));
      } else if (dg.mode === 'rot') {
        var cx2 = o.x + o.w / 2, cy2 = o.y + o.h / 2, ang = Math.atan2(p.y - cy2, p.x - cx2) * 180 / Math.PI + 90;
        if (!e.shiftKey) { var snap = Math.round(ang / 15) * 15; if (Math.abs(snap - ang) < 4) ang = snap; }
        np = { rot: Math.round(((ang % 360) + 360) % 360) };
      }
      setDocRaw(function (cur) { return Object.assign({}, cur, { objs: cur.objs.map(function (x) { return x.id === o.id ? Object.assign({}, x, np) : x; }) }); });
    }
    function up() { var dg = drag.current; if (dg) { hist.current.past.push(dg.start); hist.current.future = []; } drag.current = null; setGuides(null); }
    function addObj(o) { setDoc(Object.assign({}, doc, { objs: doc.objs.concat([o]) })); setSel(o.id); }
    function remove() { if (!sel) return; setDoc(Object.assign({}, doc, { objs: doc.objs.filter(function (o) { return o.id !== sel; }) })); setSel(null); }
    function dup() { if (!selObj) return; var c = Object.assign({}, selObj, { id: uid(), x: selObj.x + 30, y: selObj.y + 30 }); addObj(c); }
    function layer(dir) { if (!selObj) return; var arr = doc.objs.slice(), i = arr.findIndex(function (o) { return o.id === sel; }), it = arr.splice(i, 1)[0]; var j = dir === 'top' ? arr.length : dir === 'bottom' ? 0 : Math.max(0, Math.min(arr.length, i + (dir === 'up' ? 1 : -1))); arr.splice(j, 0, it); setDoc(Object.assign({}, doc, { objs: arr })); }
    function centre(axis) { if (!selObj) return; patch(axis === 'x' ? { x: Math.round((doc.w - selObj.w) / 2) } : { y: Math.round((doc.h - selObj.h) / 2) }); }
    function fitText() { if (selObj && selObj.type === 'text' && selObj._needH) patch({ h: Math.ceil(selObj._needH) }); }
    function newSize(id) { var sz = SIZES.find(function (x) { return x[0] === id; }); if (!sz) return; var fx = sz[2] / doc.w, fy = sz[3] / doc.h, f = Math.min(fx, fy); setDoc(Object.assign({}, doc, { w: sz[2], h: sz[3], size: id, objs: doc.objs.map(function (o) { var n = Object.assign({}, o, { x: Math.round(o.x * fx), y: Math.round(o.y * fy), w: Math.round(o.w * f), h: Math.round(o.h * f) }); if (o.size) n.size = Math.round(o.size * f); if (o.strokeW) n.strokeW = o.strokeW * f; return n; }) })); }
    function render(type, q) { return new Promise(function (res) { var c = document.createElement('canvas'); c.width = doc.w; c.height = doc.h; var g = c.getContext('2d'); draw(g, doc, {}); setTimeout(function () { draw(g, doc, {}); c.toBlob(function (b) { res({ blob: b, canvas: c }); }, type, q); }, 60); }); }
    async function exportPNG() { var r = await render('image/png'); dl(r.blob, slug() + '.png'); setMsg('PNG downloaded.'); }
    async function exportJPG() { var r = await render('image/jpeg', 0.92); dl(r.blob, slug() + '.jpg'); setMsg('JPG downloaded.'); }
    async function exportPDF() {
      var r = await render('image/jpeg', 0.95), bytes = new Uint8Array(await r.blob.arrayBuffer()), sz = SIZES.find(function (x) { return x[0] === doc.size; });
      var pt = sz && sz[4] ? sz[4] : [doc.w * 0.75, doc.h * 0.75];
      dl(pdf(bytes, doc.w, doc.h, pt[0], pt[1], name), slug() + '.pdf'); setMsg('PDF downloaded — ready to print.');
    }
    async function shareImage() { var r = await render('image/png'), f = new File([r.blob], slug() + '.png', { type: 'image/png' }); if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: name }); return; } catch (e) { if (e.name === 'AbortError') return; } } dl(r.blob, f.name); setMsg('Sharing isn’t available on this device, so the picture was downloaded instead.'); }
    async function shareLink() {
      var hasImg = doc.bgImage || doc.objs.some(function (o) { return o.type === 'image'; });
      if (hasImg) { setMsg('Links can’t include uploaded photos (they are too big). Share the picture instead, or remove photos to share an editable link.'); return; }
      var code = await encodeDoc(doc), url = JNZX.pageUrl('x:design') + '&design=' + code;
      if (url.length > 7500) { setMsg('This design is too detailed for a link. Share the picture instead.'); return; }
      if (navigator.share) { try { await navigator.share({ title: name, text: 'Open and edit my design on The James NZ', url: url }); return; } catch (e) { if (e.name === 'AbortError') return; } }
      try { await navigator.clipboard.writeText(url); setMsg('Editable link copied — anyone with the link can open a copy of this design.'); } catch (e) { setMsg('Copy this link: ' + url); }
    }
    function slug() { return (name || 'design').replace(/[^a-z0-9]+/gi, '-').replace(/^-|-$/g, '').toLowerCase() || 'design'; }
    function saveLocal() {
      var item = { id: doc.id || uid(), name: name || 'My design', at: Date.now(), doc: Object.assign({}, doc) };
      item.doc.id = item.id;
      var rest = docs.filter(function (x) { return x.id !== item.id; });
      try { var next = [item].concat(rest).slice(0, 12); localStorage.setItem('jnzx-test', JSON.stringify(next)); localStorage.removeItem('jnzx-test'); setDocs(next); setDoc(item.doc, true); setMsg('Saved on this device.'); }
      catch (e) { setMsg('This device is out of storage for designs (photos take a lot of space). Delete an older design, or download the picture.'); }
    }
    function exportFile() { dl(new Blob([JSON.stringify({ app: 'thejamesnz-design', v: 1, name: name, doc: doc })], { type: 'application/json' }), slug() + '.jamesdesign.json'); setMsg('Design file downloaded. Open it later with “Open design file”.'); }
    function importFile(f) { var fr = new FileReader(); fr.onload = function () { try { var j = JSON.parse(fr.result); if (j.app !== 'thejamesnz-design' || !j.doc || !Array.isArray(j.doc.objs)) throw Error(); setDoc(j.doc); setName(j.name || 'Imported design'); setSel(null); setMsg('Design opened.'); } catch (e) { setMsg('That file is not a The James NZ design file.'); } }; fr.readAsText(f); }
    async function addImage(f, asBg) { try { var r = await fileToDataURL(f, 1600); if (asBg) setDoc(Object.assign({}, doc, { bgImage: r.src, bgImageOpacity: 1 })); else { var w = Math.min(doc.w * 0.6, r.w), hh = w * r.h / r.w; addObj({ id: uid(), type: 'image', src: r.src, x: Math.round((doc.w - w) / 2), y: Math.round((doc.h - hh) / 2), w: Math.round(w), h: Math.round(hh), rot: 0, opacity: 1, radius: 0 }); } } catch (e) { setMsg('That picture could not be added.'); } }

    function colorRow(val, on) { return h('div', { className: 'jx-swatches' }, SWATCH.map(function (c) { return h('button', { key: c, type: 'button', className: 'jx-sw' + (val === c ? ' is-on' : ''), style: { background: c }, 'aria-label': 'Colour ' + c, onClick: function () { on(c); } }); }), h('input', { type: 'color', value: /^#[0-9a-f]{6}$/i.test(val || '') ? val : '#000000', onChange: function (e) { on(e.target.value); }, 'aria-label': 'Custom colour' })); }
    function num(label, key, min, max, step) { return h('label', { key: key }, label, h('input', { type: 'number', min: min, max: max, step: step || 1, value: selObj[key] === undefined ? '' : (Math.round(selObj[key] * 100) / 100), onChange: function (e) { var v = parseFloat(e.target.value); if (isFinite(v)) { var p = {}; p[key] = v; patch(p); } } })); }

    var panel;
    if (!selObj) {
      panel = h('div', null,
        h('h4', null, 'Page'),
        h('label', { className: 'jx-wide' }, 'Size', h('select', { value: doc.size || '', onChange: function (e) { newSize(e.target.value); } }, SIZES.map(function (s2) { return h('option', { key: s2[0], value: s2[0] }, s2[1] + ' · ' + s2[2] + '×' + s2[3]); }), !doc.size && h('option', { value: '' }, 'Custom'))),
        h('label', null, 'Background', h('select', { value: doc.bg.type, onChange: function (e) { setDoc(Object.assign({}, doc, { bg: Object.assign({}, doc.bg, { type: e.target.value, c2: doc.bg.c2 || '#ffffff', angle: doc.bg.angle || 180 }) })); } }, h('option', { value: 'solid' }, 'Solid colour'), h('option', { value: 'grad' }, 'Gradient'))),
        colorRow(doc.bg.c1, function (c) { setDoc(Object.assign({}, doc, { bg: Object.assign({}, doc.bg, { c1: c }) })); }),
        doc.bg.type === 'grad' && [h('p', { key: 'l', className: 'small-note' }, 'Second colour'), h('div', { key: 'c' }, colorRow(doc.bg.c2, function (c) { setDoc(Object.assign({}, doc, { bg: Object.assign({}, doc.bg, { c2: c }) })); })), h('label', { key: 'a' }, 'Angle', h('input', { type: 'range', min: 0, max: 360, value: doc.bg.angle || 180, onChange: function (e) { setDoc(Object.assign({}, doc, { bg: Object.assign({}, doc.bg, { angle: +e.target.value }) }), true); } }))],
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { bgFileRef.current.click(); } }, '🖼️ Background photo'), doc.bgImage && h('button', { type: 'button', className: 'secondary', onClick: function () { setDoc(Object.assign({}, doc, { bgImage: null })); } }, 'Remove photo')),
        doc.bgImage && h('label', null, 'Photo opacity', h('input', { type: 'range', min: 0.1, max: 1, step: 0.05, value: doc.bgImageOpacity === undefined ? 1 : doc.bgImageOpacity, onChange: function (e) { setDoc(Object.assign({}, doc, { bgImageOpacity: +e.target.value }), true); } })),
        h('p', { className: 'small-note' }, 'Tip: tap any item on the design to edit it. Drag to move, use the corners to resize and the round handle to rotate. Arrow keys nudge; Delete removes; Ctrl+Z undoes.'));
    } else {
      var o = selObj, isText = o.type === 'text';
      panel = h('div', null,
        h('h4', null, { text: 'Text', emoji: 'Sticker', rect: 'Rectangle', ellipse: 'Circle / ellipse', line: 'Line', image: 'Photo' }[o.type]),
        isText && h('label', { className: 'jx-wide' }, 'Text', h('textarea', { rows: 3, value: o.text, onChange: function (e) { patch({ text: e.target.value }, true); }, onBlur: function () { hist.current.past.push(JSON.stringify(doc)); } })),
        o.type === 'emoji' && h('div', { className: 'jx-stickers' }, STICKERS.map(function (st) { return h('button', { key: st, type: 'button', onClick: function () { patch({ text: st }); } }, st); })),
        isText && h('label', { className: 'jx-wide' }, 'Font', h('select', { value: o.font, onChange: function (e) { patch({ font: e.target.value }); } }, FONTS.map(function (f) { return h('option', { key: f[0], value: f[0], style: { fontFamily: f[0] } }, f[1]); }))),
        isText && h('div', { className: 'jx-row jx-form' }, num('Size', 'size', 6, 600), num('Line height', 'lineH', 0.8, 3, 0.05), num('Spacing', 'spacing', -5, 40)),
        isText && h('div', { className: 'jx-row jx-toggles' },
          h('button', { type: 'button', className: o.bold ? 'is-on' : '', onClick: function () { patch({ bold: !o.bold }); }, 'aria-pressed': o.bold }, h('b', null, 'B')),
          h('button', { type: 'button', className: o.italic ? 'is-on' : '', onClick: function () { patch({ italic: !o.italic }); }, 'aria-pressed': o.italic }, h('i', null, 'I')),
          h('button', { type: 'button', className: o.upper ? 'is-on' : '', onClick: function () { patch({ upper: !o.upper }); }, 'aria-pressed': o.upper }, 'AA'),
          h('button', { type: 'button', className: o.shadow ? 'is-on' : '', onClick: function () { patch({ shadow: !o.shadow }); }, 'aria-pressed': o.shadow }, 'Shadow'),
          ['left', 'center', 'right'].map(function (a) { return h('button', { key: a, type: 'button', className: o.align === a ? 'is-on' : '', onClick: function () { patch({ align: a }); } }, a === 'left' ? '⟸' : a === 'right' ? '⟹' : '≡'); }),
          h('button', { type: 'button', onClick: fitText, title: 'Make the box fit the text' }, 'Fit box')),
        isText && [h('p', { key: 'c', className: 'small-note' }, 'Text colour'), h('div', { key: 'cr' }, colorRow(o.color, function (c) { patch({ color: c }); }))],
        (o.type === 'rect' || o.type === 'ellipse') && [h('p', { key: 'f', className: 'small-note' }, 'Fill'), h('div', { key: 'fr' }, colorRow(o.fill, function (c) { patch({ fill: c }); })), h('button', { key: 'nf', type: 'button', className: 'secondary jx-fix', onClick: function () { patch({ fill: '' }); } }, 'No fill')],
        (o.type === 'rect' || o.type === 'ellipse' || o.type === 'line') && [h('p', { key: 's', className: 'small-note' }, o.type === 'line' ? 'Line colour' : 'Outline'), h('div', { key: 'sr' }, colorRow(o.stroke, function (c) { patch({ stroke: c, strokeW: o.strokeW || 4 }); })), h('div', { key: 'sw', className: 'jx-row jx-form' }, num('Thickness', 'strokeW', 0, 100), o.type === 'rect' && num('Corner radius', 'radius', 0, 1000))],
        o.type === 'image' && h('div', { className: 'jx-row jx-form' }, num('Corner radius', 'radius', 0, 1000)),
        h('label', null, 'Transparency', h('input', { type: 'range', min: 0.05, max: 1, step: 0.05, value: o.opacity === undefined ? 1 : o.opacity, onChange: function (e) { patch({ opacity: +e.target.value }, true); } })),
        h('div', { className: 'jx-row jx-form' }, num('X', 'x', -5000, 5000), num('Y', 'y', -5000, 5000), num('Width', 'w', 10, 10000), o.type !== 'line' && num('Height', 'h', 1, 10000), num('Rotate °', 'rot', 0, 360)),
        h('div', { className: 'jx-row jx-toggles' },
          h('button', { type: 'button', onClick: function () { centre('x'); } }, 'Centre ↔'), h('button', { type: 'button', onClick: function () { centre('y'); } }, 'Centre ↕'),
          h('button', { type: 'button', onClick: function () { layer('top'); } }, 'Bring to front'), h('button', { type: 'button', onClick: function () { layer('up'); } }, 'Forward'), h('button', { type: 'button', onClick: function () { layer('down'); } }, 'Backward'), h('button', { type: 'button', onClick: function () { layer('bottom'); } }, 'Send to back')),
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: dup }, 'Duplicate'), h('button', { type: 'button', className: 'secondary', onClick: function () { patch({ locked: true }); setSel(null); } }, '🔒 Lock'), h('button', { type: 'button', className: 'secondary jx-danger', onClick: remove }, 'Delete'), h('button', { type: 'button', className: 'secondary', onClick: function () { setSel(null); } }, 'Done')));
    }
    var locked = doc.objs.filter(function (o2) { return o2.locked; });
    return h('div', { className: 'jx-studio' },
      h('div', { className: 'jx-studio-bar' },
        h('label', { className: 'jx-studio-name' }, h('span', { className: 'jx-sr' }, 'Design name'), h('input', { value: name, onChange: function (e) { setName(e.target.value); }, maxLength: 60 })),
        h('button', { type: 'button', className: 'secondary', onClick: undo, disabled: !hist.current.past.length, title: 'Undo (Ctrl+Z)' }, '↶ Undo'), h('button', { type: 'button', className: 'secondary', onClick: redo, disabled: !hist.current.future.length, title: 'Redo' }, '↷ Redo'),
        h('button', { type: 'button', className: 'secondary', onClick: saveLocal }, '💾 Save'),
        h('button', { type: 'button', className: 'primary', onClick: exportPNG }, '⬇ PNG'), h('button', { type: 'button', className: 'secondary', onClick: exportJPG }, 'JPG'), h('button', { type: 'button', className: 'secondary', onClick: exportPDF }, 'PDF (print)'),
        h('button', { type: 'button', className: 'secondary', onClick: shareImage }, '📤 Share picture'), h('button', { type: 'button', className: 'secondary', onClick: shareLink }, '🔗 Share editable link')),
      msg && h('p', { className: 'jx-studio-msg', role: 'status' }, msg, ' ', h('button', { type: 'button', className: 'jx-link', onClick: function () { setMsg(''); } }, 'OK')),
      h('div', { className: 'jx-studio-main' },
        h('aside', { className: 'jx-studio-tools' },
          h('h4', null, 'Add'),
          h('div', { className: 'jx-addgrid' },
            h('button', { type: 'button', onClick: function () { addObj(T({ text: 'Heading', x: doc.w * 0.1, y: doc.h * 0.1, w: doc.w * 0.8, h: Math.round(doc.w / 9), size: Math.round(doc.w / 12), bold: true })); } }, 'H', h('small', null, 'Heading')),
            h('button', { type: 'button', onClick: function () { addObj(T({ text: 'Add your details here', x: doc.w * 0.1, y: doc.h * 0.45, w: doc.w * 0.8, h: Math.round(doc.w / 18), size: Math.round(doc.w / 26) })); } }, 'T', h('small', null, 'Text')),
            h('button', { type: 'button', onClick: function () { addObj(Sh({ x: doc.w * 0.3, y: doc.h * 0.3, w: doc.w * 0.4, h: doc.h * 0.15 })); } }, '▭', h('small', null, 'Box')),
            h('button', { type: 'button', onClick: function () { var s3 = doc.w * 0.3; addObj(Sh({ type: 'ellipse', x: (doc.w - s3) / 2, y: doc.h * 0.3, w: s3, h: s3, fill: '#ff8fab' })); } }, '◯', h('small', null, 'Circle')),
            h('button', { type: 'button', onClick: function () { addObj(Sh({ type: 'line', x: doc.w * 0.3, y: doc.h * 0.5, w: doc.w * 0.4, h: 0, fill: '', stroke: '#1f2a37', strokeW: 6 })); } }, '—', h('small', null, 'Line')),
            h('button', { type: 'button', onClick: function () { var s4 = Math.round(doc.w * 0.18); addObj(T({ type: 'emoji', text: '⭐', x: (doc.w - s4) / 2, y: doc.h * 0.2, w: s4, h: s4, size: Math.round(s4 * 0.85) })); } }, '⭐', h('small', null, 'Sticker')),
            h('button', { type: 'button', onClick: function () { fileRef.current.click(); } }, '🖼️', h('small', null, 'Photo'))),
          h('input', { ref: fileRef, type: 'file', accept: 'image/*', hidden: true, onChange: function (e) { if (e.target.files[0]) addImage(e.target.files[0]); e.target.value = ''; } }),
          h('input', { ref: bgFileRef, type: 'file', accept: 'image/*', hidden: true, onChange: function (e) { if (e.target.files[0]) addImage(e.target.files[0], true); e.target.value = ''; } }),
          h('h4', null, 'Start from a template'),
          h('div', { className: 'jx-tpl' }, TEMPLATES.map(function (t2) { return h('button', { key: t2[0], type: 'button', onClick: function () { setDoc(template(t2[0])); setName(t2[1].replace(/^\S+\s/, '')); setSel(null); } }, t2[1]); }),
            h('button', { type: 'button', onClick: function () { setDoc(template('sq')); setName('Blank design'); setSel(null); } }, '⬜ Blank')),
          docs.length > 0 && [h('h4', { key: 'h' }, 'Saved on this device'), h('ul', { key: 'l', className: 'jx-saved' }, docs.map(function (it) { return h('li', { key: it.id }, h('button', { type: 'button', onClick: function () { setDoc(it.doc); setName(it.name); setSel(null); } }, it.name, h('small', null, new Date(it.at).toLocaleDateString('en-NZ'))), h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Delete ' + it.name, onClick: function () { setDocs(docs.filter(function (x) { return x.id !== it.id; })); } }, '×')); }))],
          h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary jx-fix', onClick: exportFile }, 'Download design file'),
            h('label', { className: 'secondary jx-fix jx-filebtn' }, 'Open design file', h('input', { type: 'file', accept: '.json,application/json', hidden: true, onChange: function (e) { if (e.target.files[0]) importFile(e.target.files[0]); e.target.value = ''; } }))),
          locked.length > 0 && h('button', { type: 'button', className: 'secondary jx-fix', onClick: function () { setDoc(Object.assign({}, doc, { objs: doc.objs.map(function (o3) { return Object.assign({}, o3, { locked: false }); }) })); } }, '🔓 Unlock ' + locked.length + ' item' + (locked.length > 1 ? 's' : ''))),
        h('div', { className: 'jx-studio-stage', ref: wrapRef },
          h('canvas', { ref: cv, className: 'jx-studio-canvas', role: 'img', 'aria-label': 'Design canvas', onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: up,
            onDoubleClick: function () { if (selObj && selObj.type === 'text') { var ta = document.querySelector('.jx-studio-panel textarea'); if (ta) ta.focus(); } } }),
          h('p', { className: 'small-note' }, doc.w + ' × ' + doc.h + ' px · ' + Math.round(scale * 100) + '% zoom')),
        h('aside', { className: 'jx-studio-panel' }, panel)),
      h('p', { className: 'small-note' }, 'Your designs and photos stay in your browser. Use your own photos or ones you have permission to use. Shared links contain the design itself (text, colours and layout), so anyone with the link can see and edit a copy.'));
  }
  function pdf(jpegBytes, imgW, imgH, W, H, title) {
    var enc = new TextEncoder(), parts = [], offsets = [], len = 0;
    function add(x) { var b = typeof x === 'string' ? enc.encode(x) : x; parts.push(b); len += b.length; }
    function obj(n, body, stream) { offsets[n] = len; add(n + ' 0 obj\n'); add(body); if (stream) { add('\nstream\n'); add(stream); add('\nendstream'); } add('\nendobj\n'); }
    var t = '(' + String(title || 'Design').replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '') + ')';
    add('%PDF-1.4\n');
    obj(1, '<< /Type /Catalog /Pages 2 0 R >>'); obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
    obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
    obj(4, '<< /Type /XObject /Subtype /Image /Width ' + imgW + ' /Height ' + imgH + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpegBytes.length + ' >>', jpegBytes);
    var c = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im0 Do Q'; obj(5, '<< /Length ' + c.length + ' >>', enc.encode(c));
    obj(6, '<< /Title ' + t + ' /Creator (The James NZ Design Studio) >>');
    var x = len; add('xref\n0 7\n0000000000 65535 f \n'); for (var i = 1; i <= 6; i++) add(String(offsets[i]).padStart(10, '0') + ' 00000 n \n');
    add('trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + x + '\n%%EOF');
    return new Blob(parts, { type: 'application/pdf' });
  }

  JNZX.register('x:design', function DesignPage(props) {
    return h('div', null,
      JNZX.Header('MODERN & LIFESTYLE · DESIGN STUDIO', 'Make invitations and posters in minutes.', 'Start from a template or a blank page, then change the words, colours, fonts, stickers and photos. Download for printing, share the picture, or send an editable link.'),
      h(Studio),
      h(JNZX.ShareBar, { tab: props.tab }));
  });
  JNZX._design = { template: template, encodeDoc: encodeDoc, decodeDoc: decodeDoc };
})();
