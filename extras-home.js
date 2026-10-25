/* The James NZ — Family Together upgrades (October 2026):
   recipe nutrition + shareable recipe cards, grocery list, My Money Plan,
   My Kiwi Adventures bucket-list poster, flip-book sharing for stories and
   greetings on shared Hello, World! pictures. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef, Frag = R.Fragment;
  var INIT_HASH = String(location.hash || '');
  function hashParam(k) { var m = new RegExp('[#&]' + k + '=([^&]*)').exec(INIT_HASH); return m ? decodeURIComponent(m[1]) : null; }
  function uid() { return Math.random().toString(36).slice(2, 10); }
  function money(n) { n = Number(n) || 0; return (n < 0 ? '−$' : '$') + Math.abs(n).toLocaleString('en-NZ', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); }
  function num(v) { var n = parseFloat(String(v).replace(/[^0-9.\-]/g, '')); return isFinite(n) ? n : 0; }

  /* ============================ POSTER KIT ============================ */
  var THEMES = [
    { id: 'garden', name: 'Kitchen garden', bg: '#fbf8f1', ink: '#22312a', accent: '#3f7d4e' },
    { id: 'pohutukawa', name: 'Pōhutukawa', bg: '#fff7f5', ink: '#3a1f22', accent: '#c8323c' },
    { id: 'ocean', name: 'Ocean', bg: '#f3f8fb', ink: '#14324a', accent: '#1f6fa8' },
    { id: 'kowhai', name: 'Kōwhai', bg: '#fffbea', ink: '#3b3210', accent: '#b98700' },
    { id: 'lavender', name: 'Lavender', bg: '#f8f5fd', ink: '#2f2546', accent: '#7451b3' },
    { id: 'blush', name: 'Blush', bg: '#fdf2f4', ink: '#4a2a33', accent: '#c95f78' },
    { id: 'charcoal', name: 'Charcoal', bg: '#161616', ink: '#f3f3f3', accent: '#f2b84b' }
  ];
  var BOX = ['#e8833a', '#3f9a57', '#2f8fc9', '#d0454c', '#d08a2a', '#1f9aa0', '#8a55c2', '#c9a300', '#6b7a8f', '#d0679b', '#5d8a3a'];
  function themeOf(v) { var t = THEMES.find(function (x) { return x.id === (v && v.id); }) || THEMES[0]; return Object.assign({}, t, v && v.accent ? { accent: v.accent } : {}, v && v.bg ? { bg: v.bg } : {}, v && v.ink ? { ink: v.ink } : {}); }
  function hexA(hex, a) { var c = hex.replace('#', ''); if (c.length === 3) c = c.split('').map(function (x) { return x + x; }).join(''); var n = parseInt(c, 16); return 'rgba(' + (n >> 16 & 255) + ',' + (n >> 8 & 255) + ',' + (n & 255) + ',' + a + ')'; }
  function isDarkHex(hex) { var c = hex.replace('#', ''), n = parseInt(c.length === 3 ? c.split('').map(function (x) { return x + x; }).join('') : c, 16); return ((n >> 16 & 255) * 0.299 + (n >> 8 & 255) * 0.587 + (n & 255) * 0.114) < 110; }
  function ThemePicker(props) {
    var v = props.value || {}, t = themeOf(v);
    function set(o) { props.onChange(Object.assign({}, v, o)); }
    return h('div', { className: 'jx-theme jx-keep-colour' },
      h('div', { className: 'jx-theme-row', role: 'group', 'aria-label': 'Colour theme' }, THEMES.map(function (x) {
        return h('button', { key: x.id, type: 'button', className: 'jx-swatch' + (t.id === x.id ? ' is-on' : ''), title: x.name, 'aria-label': x.name, 'aria-pressed': t.id === x.id, style: { background: 'linear-gradient(135deg,' + x.bg + ' 0 50%,' + x.accent + ' 50% 100%)' }, onClick: function () { props.onChange(Object.assign({}, props.keep || {}, { id: x.id, design: v.design })); } });
      })),
      h('div', { className: 'jx-theme-row' },
        h('label', { className: 'jx-colour' }, h('input', { type: 'color', value: t.accent, onChange: function (e) { set({ accent: e.target.value }); } }), 'Accent'),
        h('label', { className: 'jx-colour' }, h('input', { type: 'color', value: t.bg, onChange: function (e) { set({ bg: e.target.value }); } }), 'Background'),
        h('label', { className: 'jx-colour' }, h('input', { type: 'color', value: t.ink, onChange: function (e) { set({ ink: e.target.value }); } }), 'Text'),
        props.designs && h('label', null, 'Design', h('select', { value: v.design || props.designs[0][0], onChange: function (e) { set({ design: e.target.value }); } }, props.designs.map(function (d) { return h('option', { key: d[0], value: d[0] }, d[1]); })))));
  }
  function rr(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function wrap(g, text, maxW) {
    var out = [];
    String(text).split('\n').forEach(function (para) {
      var words = para.split(/\s+/), cur = '';
      words.forEach(function (w) {
        while (g.measureText(w).width > maxW && w.length > 1) { var k = w.length; while (k > 1 && g.measureText(w.slice(0, k)).width > maxW) k--; if (cur) { out.push(cur); cur = ''; } out.push(w.slice(0, k)); w = w.slice(k); }
        var t = cur ? cur + ' ' + w : w;
        if (g.measureText(t).width > maxW && cur) { out.push(cur); cur = w; } else cur = t;
      });
      out.push(cur);
    });
    return out;
  }
  var SANS = 'Inter, Arial, Helvetica, sans-serif', SERIF = 'Georgia, "Times New Roman", serif';
  function loadImg(src) { return new Promise(function (res) { if (!src) return res(null); var im = new Image(); im.onload = function () { res(im); }; im.onerror = function () { res(null); }; im.src = src; }); }
  function cover(g, im, x, y, w, hh) { var s = Math.max(w / im.width, hh / im.height), sw = w / s, sh = hh / s; g.drawImage(im, (im.width - sw) / 2, (im.height - sh) / 2, sw, sh, x, y, w, hh); }
  function pdfFromCanvas(canvas, title) {
    return new Promise(function (resolve) {
      canvas.toBlob(function (b) {
        b.arrayBuffer().then(function (buf) {
          var jpg = new Uint8Array(buf), enc = new TextEncoder(), parts = [], offs = [], len = 0;
          function add(x) { var v = typeof x === 'string' ? enc.encode(x) : x; parts.push(v); len += v.length; }
          function obj(n, body, stream) { offs[n] = len; add(n + ' 0 obj\n'); add(body); if (stream) { add('\nstream\n'); add(stream); add('\nendstream'); } add('\nendobj\n'); }
          var W = 595.28, H = +(W * canvas.height / canvas.width).toFixed(2);
          add('%PDF-1.4\n%\xE2\xE3\xCF\xD3\n');
          obj(1, '<< /Type /Catalog /Pages 2 0 R >>');
          obj(2, '<< /Type /Pages /Kids [3 0 R] /Count 1 >>');
          obj(3, '<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ' + W + ' ' + H + '] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>');
          obj(4, '<< /Type /XObject /Subtype /Image /Width ' + canvas.width + ' /Height ' + canvas.height + ' /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ' + jpg.length + ' >>', jpg);
          var c = 'q ' + W + ' 0 0 ' + H + ' 0 0 cm /Im0 Do Q'; obj(5, '<< /Length ' + c.length + ' >>', enc.encode(c));
          obj(6, '<< /Title (' + String(title).replace(/[\\()]/g, '\\$&').replace(/[^\x20-\x7E]/g, '') + ') /Creator (The James NZ) >>');
          var x = len; add('xref\n0 7\n0000000000 65535 f \n'); for (var i = 1; i <= 6; i++) add(String(offs[i]).padStart(10, '0') + ' 00000 n \n');
          add('trailer\n<< /Size 7 /Root 1 0 R /Info 6 0 R >>\nstartxref\n' + x + '\n%%EOF');
          resolve(new Blob(parts, { type: 'application/pdf' }));
        });
      }, 'image/jpeg', 0.93);
    });
  }
  function save(blob, name) { var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500); }
  function ExportBar(props) {
    var m = useState(''), msg = m[0], setMsg = m[1];
    function cv() { return props.canvasRef.current; }
    function png() { cv().toBlob(function (b) { save(b, props.name + '.png'); setMsg('Picture downloaded.'); }, 'image/png'); }
    function pdf() { pdfFromCanvas(cv(), props.title).then(function (b) { save(b, props.name + '.pdf'); setMsg('PDF downloaded.'); }); }
    function share() {
      cv().toBlob(async function (b) {
        var f = new File([b], props.name + '.png', { type: 'image/png' });
        if (navigator.canShare && navigator.canShare({ files: [f] })) { try { await navigator.share({ files: [f], title: props.title, text: props.text || props.title }); return; } catch (e) { if (e.name === 'AbortError') return; } }
        save(b, f.name); setMsg('Sharing pictures isn’t available on this device, so it was downloaded instead.');
      }, 'image/png');
    }
    function print() {
      var url = cv().toDataURL('image/png'), w = window.open('', '_blank');
      if (!w) { setMsg('Allow pop-ups to print, or download the PDF.'); return; }
      w.document.write('<!doctype html><title>' + props.title.replace(/</g, '') + '</title><style>@page{margin:10mm}body{margin:0}img{width:100%;display:block}</style><img src="' + url + '" onload="setTimeout(function(){print()},200)">'); w.document.close();
    }
    return h('div', null, h('div', { className: 'jx-row' },
      h('button', { type: 'button', className: 'primary', onClick: share }, '↗ Share picture'),
      h('button', { type: 'button', className: 'secondary', onClick: png }, 'Download picture'),
      h('button', { type: 'button', className: 'secondary', onClick: pdf }, 'Download PDF'),
      h('button', { type: 'button', className: 'secondary', onClick: print }, 'Print'),
      props.extra),
      msg && h('p', { className: 'small-note', role: 'status' }, msg));
  }
  function usePoster(draw, deps) {
    var ref = useRef(null);
    useEffect(function () { var alive = true; Promise.resolve(draw(ref.current, function () { return alive; })); return function () { alive = false; }; }, deps);
    return ref;
  }
  function footer(g, t, W, y, line) {
    g.fillStyle = hexA(t.ink, 0.6); g.font = '22px ' + SANS; g.textAlign = 'left'; g.fillText(line || 'The James NZ · thejamesnz.com', 64, y); g.textAlign = 'left';
  }
  JNZX.poster = { THEMES: THEMES, ThemePicker: ThemePicker, ExportBar: ExportBar, wrap: wrap, rr: rr, themeOf: themeOf, pdfFromCanvas: pdfFromCanvas };

  /* ======================= FROM OUR KITCHEN ======================= */
  var NUTRI = {"lentil-soup":{"kcal":281,"kj":1180,"protein":14.7,"carbs":46.9,"sugars":9.4,"fat":5.1,"satfat":0.6,"fibre":8.8,"sodium":920},"bean-pasta":{"kcal":376,"kj":1570,"protein":15.2,"carbs":68.4,"sugars":8.3,"fat":5.0,"satfat":0.8,"fibre":9.8,"sodium":305},"banana-pancakes":{"kcal":324,"kj":1360,"protein":9.7,"carbs":50.7,"sugars":8.1,"fat":9.0,"satfat":2.8,"fibre":2.4,"sodium":195},"vegetable-frittata":{"kcal":216,"kj":900,"protein":14.5,"carbs":4.8,"sugars":2.1,"fat":15.5,"satfat":5.9,"fibre":1.2,"sodium":205},"bean-potatoes":{"kcal":224,"kj":940,"protein":8.1,"carbs":42.5,"sugars":6.6,"fat":1.7,"satfat":0.3,"fibre":8.5,"sodium":355},"porridge":{"kcal":377,"kj":1580,"protein":14.4,"carbs":55.0,"sugars":21.2,"fat":11.6,"satfat":6.0,"fibre":6.7,"sodium":105},"mini-pizzas":{"kcal":295,"kj":1230,"protein":13.3,"carbs":37.3,"sugars":5.7,"fat":10.5,"satfat":5.7,"fibre":3.3,"sodium":545},"chickpea-wraps":{"kcal":314,"kj":1310,"protein":11.8,"carbs":52.3,"sugars":7.2,"fat":6.9,"satfat":2.1,"fibre":7.6,"sodium":540},"rice-porridge":{"kcal":269,"kj":1130,"protein":10.4,"carbs":46.3,"sugars":8.8,"fat":5.2,"satfat":0.8,"fibre":4.1,"sodium":105},"egg-spinach":{"kcal":170,"kj":710,"protein":13.5,"carbs":1.8,"sugars":0.5,"fat":11.9,"satfat":3.4,"fibre":0.7,"sodium":165},"avocado-toast":{"kcal":167,"kj":700,"protein":5.2,"carbs":22.3,"sugars":3.5,"fat":6.7,"satfat":1.0,"fibre":5.9,"sodium":185},"overnight-chia":{"kcal":212,"kj":890,"protein":10.1,"carbs":21.1,"sugars":5.4,"fat":11.3,"satfat":1.4,"fibre":11.2,"sodium":80},"breakfast-rice":{"kcal":249,"kj":1040,"protein":6.2,"carbs":51.2,"sugars":7.8,"fat":2.7,"satfat":0.5,"fibre":3.4,"sodium":30},"mushroom-eggs":{"kcal":190,"kj":800,"protein":15.5,"carbs":5.5,"sugars":3.5,"fat":12.1,"satfat":3.4,"fibre":1.5,"sodium":150},"corn-fritters":{"kcal":222,"kj":930,"protein":7.8,"carbs":28.4,"sugars":4.3,"fat":9.4,"satfat":2.3,"fibre":1.4,"sodium":275},"quinoa-salad":{"kcal":293,"kj":1230,"protein":11.2,"carbs":46.6,"sugars":5.4,"fat":7.7,"satfat":0.9,"fibre":7.9,"sodium":150},"tuna-bean":{"kcal":159,"kj":670,"protein":18.0,"carbs":17.3,"sugars":2.5,"fat":2.5,"satfat":0.4,"fibre":6.3,"sodium":325},"hummus":{"kcal":87,"kj":370,"protein":3.7,"carbs":10.8,"sugars":1.8,"fat":3.8,"satfat":0.5,"fibre":3.1,"sodium":100},"pumpkin-soup":{"kcal":105,"kj":440,"protein":2.7,"carbs":17.6,"sugars":7.8,"fat":3.8,"satfat":0.5,"fibre":1.5,"sodium":605},"carrot-soup":{"kcal":115,"kj":480,"protein":2.1,"carbs":19.0,"sugars":9.2,"fat":3.9,"satfat":0.5,"fibre":4.7,"sodium":705},"minestrone":{"kcal":254,"kj":1060,"protein":10.1,"carbs":44.8,"sugars":10.4,"fat":4.7,"satfat":0.6,"fibre":8.5,"sodium":565},"chickpea-curry":{"kcal":277,"kj":1160,"protein":12.6,"carbs":40.3,"sugars":12.8,"fat":8.6,"satfat":1.9,"fibre":10.5,"sodium":465},"lentil-bolognese":{"kcal":446,"kj":1870,"protein":19.2,"carbs":81.7,"sugars":8.8,"fat":5.5,"satfat":0.8,"fibre":9.0,"sodium":160},"tofu-stirfry":{"kcal":244,"kj":1020,"protein":19.8,"carbs":15.3,"sugars":5.6,"fat":13.8,"satfat":1.9,"fibre":6.6,"sodium":360},"fish-parcel":{"kcal":174,"kj":730,"protein":28.2,"carbs":3.9,"sugars":2.8,"fat":4.8,"satfat":0.8,"fibre":1.0,"sodium":130},"chicken-tray":{"kcal":248,"kj":1040,"protein":27.2,"carbs":10.9,"sugars":4.5,"fat":11.4,"satfat":2.5,"fibre":3.7,"sodium":165},"beef-stirfry":{"kcal":232,"kj":970,"protein":29.2,"carbs":9.5,"sugars":2.9,"fat":9.6,"satfat":2.4,"fibre":3.3,"sodium":405},"turkey-balls":{"kcal":279,"kj":1170,"protein":28.1,"carbs":14.1,"sugars":6.3,"fat":11.8,"satfat":3.3,"fibre":2.7,"sodium":415},"bean-chilli":{"kcal":245,"kj":1020,"protein":13.1,"carbs":40.6,"sugars":7.9,"fat":4.5,"satfat":0.7,"fibre":14.9,"sodium":540},"stuffed-capsicum":{"kcal":267,"kj":1120,"protein":9.5,"carbs":53.0,"sugars":11.3,"fat":3.1,"satfat":0.4,"fibre":10.2,"sodium":280},"salmon-pan":{"kcal":303,"kj":1270,"protein":25.8,"carbs":7.8,"sugars":3.6,"fat":18.1,"satfat":4.0,"fibre":2.7,"sodium":75},"potato-leek":{"kcal":178,"kj":750,"protein":3.9,"carbs":32.3,"sugars":4.5,"fat":3.9,"satfat":0.5,"fibre":3.9,"sodium":695},"vegetable-rice":{"kcal":332,"kj":1390,"protein":9.3,"carbs":67.9,"sugars":6.9,"fat":2.9,"satfat":0.5,"fibre":5.2,"sodium":425},"egg-rice":{"kcal":231,"kj":970,"protein":11.0,"carbs":24.4,"sugars":4.0,"fat":9.6,"satfat":2.3,"fibre":3.6,"sodium":420},"cucumber-salad":{"kcal":112,"kj":470,"protein":5.0,"carbs":16.1,"sugars":3.9,"fat":3.9,"satfat":0.5,"fibre":5.4,"sodium":140},"broccoli-slaw":{"kcal":55,"kj":230,"protein":1.8,"carbs":12.1,"sugars":6.5,"fat":0.8,"satfat":0.3,"fibre":2.8,"sodium":30},"roast-vege":{"kcal":169,"kj":710,"protein":6.0,"carbs":26.4,"sugars":6.5,"fat":5.2,"satfat":0.7,"fibre":6.8,"sodium":200},"cauli-peas":{"kcal":140,"kj":590,"protein":7.1,"carbs":19.1,"sugars":7.6,"fat":5.3,"satfat":0.7,"fibre":7.4,"sodium":405},"white-bean-dip":{"kcal":57,"kj":240,"protein":2.5,"carbs":6.8,"sugars":0.2,"fat":2.4,"satfat":0.4,"fibre":2.6,"sodium":90},"pea-dip":{"kcal":58,"kj":240,"protein":2.5,"carbs":6.7,"sugars":2.7,"fat":2.4,"satfat":0.4,"fibre":2.7,"sodium":35},"baked-apples":{"kcal":94,"kj":390,"protein":0.5,"carbs":25.2,"sugars":18.0,"fat":0.4,"satfat":0.0,"fibre":4.3,"sodium":0},"frozen-banana":{"kcal":99,"kj":410,"protein":1.8,"carbs":23.7,"sugars":12.5,"fat":0.8,"satfat":0.1,"fibre":3.6,"sodium":10},"yoghurt-fruit":{"kcal":132,"kj":550,"protein":5.2,"carbs":20.1,"sugars":13.8,"fat":4.4,"satfat":2.6,"fibre":2.5,"sodium":60},"rice-cakes":{"kcal":147,"kj":610,"protein":8.7,"carbs":21.7,"sugars":4.5,"fat":3.1,"satfat":1.1,"fibre":1.8,"sodium":210},"kumara-wedges":{"kcal":116,"kj":480,"protein":1.6,"carbs":20.0,"sugars":4.2,"fat":3.5,"satfat":0.5,"fibre":3.0,"sodium":55},"asparagus":{"kcal":36,"kj":150,"protein":2.8,"carbs":5.1,"sugars":2.5,"fat":1.3,"satfat":0.2,"fibre":2.6,"sodium":5},"cabbage-pan":{"kcal":69,"kj":290,"protein":1.6,"carbs":9.2,"sugars":4.8,"fat":3.5,"satfat":0.5,"fibre":3.5,"sodium":40},"roasted-beets":{"kcal":81,"kj":340,"protein":1.9,"carbs":12.0,"sugars":8.2,"fat":3.6,"satfat":0.5,"fibre":3.4,"sodium":95},"mushroom-lentils":{"kcal":197,"kj":830,"protein":13.5,"carbs":29.2,"sugars":4.6,"fat":4.1,"satfat":0.6,"fibre":10.9,"sodium":255},"chicken-salad":{"kcal":232,"kj":970,"protein":28.4,"carbs":8.6,"sugars":4.3,"fat":9.4,"satfat":1.5,"fibre":2.2,"sodium":75},"tomato-omelette":{"kcal":174,"kj":730,"protein":13.1,"carbs":3.0,"sugars":2.0,"fat":11.9,"satfat":3.4,"fibre":0.7,"sodium":145},"polenta":{"kcal":209,"kj":880,"protein":6.0,"carbs":36.6,"sugars":3.1,"fat":4.5,"satfat":0.6,"fibre":2.4,"sodium":755},"filipino-adobo":{"kcal":226,"kj":940,"protein":30.7,"carbs":2.0,"sugars":0.2,"fat":10.2,"satfat":2.6,"fibre":0.2,"sodium":795},"filipino-tinola":{"kcal":249,"kj":1040,"protein":28.0,"carbs":8.4,"sugars":4.5,"fat":11.8,"satfat":2.7,"fibre":1.9,"sodium":485},"filipino-munggo":{"kcal":235,"kj":980,"protein":13.7,"carbs":38.2,"sugars":6.1,"fat":4.2,"satfat":0.6,"fibre":9.7,"sodium":30},"filipino-pancit":{"kcal":260,"kj":1090,"protein":5.4,"carbs":49.9,"sugars":4.6,"fat":4.0,"satfat":0.6,"fibre":3.2,"sodium":750},"filipino-sinangag":{"kcal":193,"kj":810,"protein":3.6,"carbs":35.2,"sugars":0.1,"fat":3.8,"satfat":0.6,"fibre":0.6,"sodium":0},"filipino-tortang-talong":{"kcal":229,"kj":960,"protein":11.9,"carbs":15.5,"sugars":9.1,"fat":14.4,"satfat":3.3,"fibre":7.5,"sodium":110},"indian-dal":{"kcal":235,"kj":980,"protein":13.0,"carbs":37.4,"sugars":3.8,"fat":4.6,"satfat":0.6,"fibre":6.8,"sodium":10},"indian-chana":{"kcal":244,"kj":1020,"protein":10.5,"carbs":38.2,"sugars":10.5,"fat":6.8,"satfat":0.8,"fibre":10.1,"sodium":430},"indian-pulao":{"kcal":330,"kj":1380,"protein":7.3,"carbs":64.6,"sugars":4.0,"fat":4.1,"satfat":0.6,"fibre":3.9,"sodium":45},"indian-aloo-gobi":{"kcal":137,"kj":570,"protein":4.2,"carbs":23.3,"sugars":4.5,"fat":3.9,"satfat":0.5,"fibre":4.7,"sodium":40},"indian-raita":{"kcal":43,"kj":180,"protein":2.4,"carbs":4.2,"sugars":3.5,"fat":2.1,"satfat":1.3,"fibre":0.2,"sodium":30},"indian-chapati":{"kcal":222,"kj":930,"protein":8.1,"carbs":45.0,"sugars":0.2,"fat":2.7,"satfat":0.4,"fibre":6.7,"sodium":0},"oct3-recipe-0":{"kcal":278,"kj":1160,"protein":36.5,"carbs":8.5,"sugars":2.1,"fat":11.1,"satfat":1.8,"fibre":2.4,"sodium":100},"oct3-recipe-1":{"kcal":184,"kj":770,"protein":13.5,"carbs":13.4,"sugars":7.3,"fat":8.9,"satfat":4.5,"fibre":2.0,"sodium":45},"oct3-recipe-2":{"kcal":221,"kj":920,"protein":15.1,"carbs":23.7,"sugars":2.7,"fat":7.5,"satfat":2.0,"fibre":9.4,"sodium":325},"oct3-recipe-3":{"kcal":204,"kj":860,"protein":9.8,"carbs":31.0,"sugars":6.5,"fat":5.6,"satfat":0.7,"fibre":9.1,"sodium":315},"oct3-recipe-4":{"kcal":275,"kj":1150,"protein":22.2,"carbs":10.1,"sugars":3.9,"fat":17.9,"satfat":2.6,"fibre":5.4,"sodium":320},"oct3-recipe-5":{"kcal":371,"kj":1550,"protein":23.3,"carbs":62.2,"sugars":3.5,"fat":4.5,"satfat":0.6,"fibre":11.2,"sodium":10},"oct3-recipe-6":{"kcal":241,"kj":1010,"protein":29.1,"carbs":7.8,"sugars":6.0,"fat":10.5,"satfat":1.8,"fibre":2.5,"sodium":80},"oct3-recipe-7":{"kcal":174,"kj":730,"protein":14.1,"carbs":2.4,"sugars":1.2,"fat":11.9,"satfat":3.4,"fibre":0.7,"sodium":155},"oct3-recipe-8":{"kcal":223,"kj":930,"protein":28.4,"carbs":6.8,"sugars":3.6,"fat":9.1,"satfat":1.4,"fibre":2.7,"sodium":140},"oct3-recipe-9":{"kcal":72,"kj":300,"protein":6.3,"carbs":0.3,"sugars":0.2,"fat":4.8,"satfat":1.6,"fibre":0.0,"sodium":70},"oct3-recipe-10":{"kcal":269,"kj":1130,"protein":24.0,"carbs":0.0,"sugars":0.0,"fat":17.9,"satfat":4.0,"fibre":0.0,"sodium":70},"oct3-recipe-11":{"kcal":300,"kj":1250,"protein":45.0,"carbs":0.0,"sugars":0.0,"fat":11.9,"satfat":2.1,"fibre":0.0,"sodium":90},"oct3-recipe-12":{"kcal":292,"kj":1220,"protein":31.4,"carbs":5.6,"sugars":3.5,"fat":16.2,"satfat":3.4,"fibre":1.8,"sodium":155},"oct3-recipe-13":{"kcal":195,"kj":820,"protein":10.7,"carbs":17.7,"sugars":1.9,"fat":8.5,"satfat":2.1,"fibre":3.1,"sodium":265},"oct3-recipe-14":{"kcal":184,"kj":770,"protein":11.7,"carbs":29.7,"sugars":5.4,"fat":2.9,"satfat":0.4,"fibre":11.2,"sodium":265},"oct3-recipe-15":{"kcal":383,"kj":1600,"protein":14.7,"carbs":55.9,"sugars":19.3,"fat":11.6,"satfat":6.1,"fibre":6.0,"sodium":105},"oct3-recipe-16":{"kcal":386,"kj":1610,"protein":33.4,"carbs":46.8,"sugars":4.0,"fat":5.9,"satfat":1.3,"fibre":4.6,"sodium":120},"oct3-recipe-17":{"kcal":263,"kj":1100,"protein":10.6,"carbs":44.4,"sugars":7.0,"fat":5.6,"satfat":0.7,"fibre":10.3,"sodium":295},"oct3-recipe-18":{"kcal":45,"kj":190,"protein":2.9,"carbs":7.9,"sugars":0.4,"fat":0.3,"satfat":0.0,"fibre":1.4,"sodium":5},"oct3-recipe-19":{"kcal":42,"kj":170,"protein":5.5,"carbs":1.9,"sugars":0.8,"fat":1.3,"satfat":0.6,"fibre":0.1,"sodium":15},"oct3-recipe-20":{"kcal":79,"kj":330,"protein":4.0,"carbs":10.2,"sugars":2.2,"fat":2.4,"satfat":0.8,"fibre":1.5,"sodium":65},"oct3-recipe-21":{"kcal":241,"kj":1010,"protein":6.7,"carbs":51.7,"sugars":5.6,"fat":1.0,"satfat":0.2,"fibre":4.1,"sodium":105},"oct3-recipe-22":{"kcal":92,"kj":390,"protein":1.4,"carbs":23.1,"sugars":12.7,"fat":0.5,"satfat":0.1,"fibre":3.8,"sodium":0},"oct3-recipe-23":{"kcal":221,"kj":920,"protein":8.6,"carbs":29.5,"sugars":4.4,"fat":7.1,"satfat":2.5,"fibre":1.6,"sodium":80},"kiwi-pikelets":{"kcal":210,"kj":880,"protein":6.3,"carbs":29.4,"sugars":5.5,"fat":7.2,"satfat":3.4,"fibre":0.8,"sodium":165},"kiwi-scones":{"kcal":216,"kj":900,"protein":7.1,"carbs":25.4,"sugars":1.3,"fat":9.3,"satfat":5.8,"fibre":0.8,"sodium":275},"kiwi-kumara-soup":{"kcal":199,"kj":830,"protein":3.5,"carbs":38.4,"sugars":10.3,"fat":3.9,"satfat":0.5,"fibre":5.9,"sodium":860},"kiwi-kumara-wedges":{"kcal":232,"kj":970,"protein":3.2,"carbs":40.0,"sugars":8.4,"fat":7.0,"satfat":0.9,"fibre":6.0,"sodium":110},"kiwi-leek-soup":{"kcal":176,"kj":740,"protein":3.9,"carbs":31.9,"sugars":4.5,"fat":3.9,"satfat":0.5,"fibre":3.8,"sodium":695},"kiwi-corn-fritters":{"kcal":165,"kj":690,"protein":6.6,"carbs":20.6,"sugars":3.5,"fat":6.8,"satfat":1.5,"fibre":1.5,"sodium":150},"kiwi-feijoa-crumble":{"kcal":265,"kj":1110,"protein":3.4,"carbs":44.8,"sugars":22.2,"fat":9.4,"satfat":5.3,"fibre":6.8,"sodium":65},"kiwi-mini-pavlovas":{"kcal":213,"kj":890,"protein":2.5,"carbs":31.4,"sugars":29.8,"fat":9.1,"satfat":5.8,"fibre":0.8,"sodium":35},"kiwi-anzac":{"kcal":108,"kj":450,"protein":1.4,"carbs":13.8,"sugars":6.1,"fat":5.4,"satfat":3.6,"fibre":1.0,"sodium":65},"kiwi-afghan":{"kcal":148,"kj":620,"protein":1.3,"carbs":19.1,"sugars":10.4,"fat":7.9,"satfat":4.9,"fibre":0.8,"sodium":75},"kiwi-mince-pies":{"kcal":371,"kj":1550,"protein":15.3,"carbs":25.5,"sugars":2.0,"fat":22.3,"satfat":9.4,"fibre":1.5,"sodium":395},"kiwi-fish-cakes":{"kcal":280,"kj":1170,"protein":17.7,"carbs":34.8,"sugars":2.0,"fat":7.7,"satfat":1.5,"fibre":2.9,"sodium":575}};
  var DI = { kj: 8700, protein: 50, fat: 70, satfat: 24, carbs: 310, sugars: 90, fibre: 30, sodium: 2300 };
  var NROWS = [['Energy', 'kj', ' kJ'], ['Protein', 'protein', ' g'], ['Fat, total', 'fat', ' g'], ['– saturated', 'satfat', ' g'], ['Carbohydrate', 'carbs', ' g'], ['– sugars', 'sugars', ' g'], ['Dietary fibre', 'fibre', ' g'], ['Sodium', 'sodium', ' mg']];
  function NutritionPanel(props) {
    var n = NUTRI[props.recipe.id]; if (!n) return null;
    return h('section', { className: 'jx-nutri' },
      h('h2', null, 'Nutrition information'),
      h('p', { className: 'jx-muted' }, 'Estimated per serving · serves ' + props.recipe.serves),
      h('table', null, h('thead', null, h('tr', null, h('th', null, ''), h('th', null, 'Per serving'), h('th', null, '% daily intake*'))),
        h('tbody', null, NROWS.map(function (r) { return h('tr', { key: r[1] }, h('th', null, r[0]), h('td', null, (r[1] === 'kj' ? n.kj.toLocaleString('en-NZ') + ' kJ (' + n.kcal + ' kcal)' : n[r[1]] + r[2])), h('td', null, Math.round(n[r[1]] / DI[r[1]] * 100) + '%')); }))),
      h('p', { className: 'small-note' }, '*Based on an average adult diet of 8700 kJ. Values are estimated from typical New Zealand and international food composition data for the listed ingredients and exclude optional items and serving suggestions. Brands, portion sizes and cooking change the numbers — check labels if you need exact values, and ask a dietitian for medical diets.'));
  }
  function drawRecipe(c, r, t, alive) {
    var n = NUTRI[r.id], W = 1240, M = 64, colL = 440, gap = 44, colR = W - 2 * M - colL - gap;
    var g = c.getContext('2d');
    return loadImg(recipePhoto(r)).then(function (im) {
      if (!alive()) return;
      function pass(draw) {
        var y = 0;
        if (draw) { g.fillStyle = t.bg; g.fillRect(0, 0, W, c.height); }
        var ph = 500;
        if (draw) { g.fillStyle = hexA(t.accent, 0.15); g.fillRect(0, 0, W, ph); if (im) cover(g, im, 0, 0, W, ph); var gr = g.createLinearGradient(0, ph - 160, 0, ph); gr.addColorStop(0, 'rgba(0,0,0,0)'); gr.addColorStop(1, 'rgba(0,0,0,.35)'); g.fillStyle = gr; g.fillRect(0, ph - 160, W, 160); g.fillStyle = t.accent; g.fillRect(0, ph, W, 10); }
        y = ph + 74;
        g.font = 'bold 24px ' + SANS; if (draw) { g.fillStyle = t.accent; g.fillText((r.category + ' · FROM OUR KITCHEN').toUpperCase(), M, y); }
        y += 66; g.font = '62px ' + SERIF; wrap(g, r.name, W - 2 * M).forEach(function (l) { if (draw) { g.fillStyle = t.ink; g.fillText(l, M, y); } y += 70; });
        g.font = '29px ' + SANS; wrap(g, r.description, W - 2 * M).forEach(function (l) { if (draw) { g.fillStyle = hexA(t.ink, 0.78); g.fillText(l, M, y); } y += 40; });
        y += 14;
        var chips = ['⏱ ' + r.minutes + ' min', '👥 Serves ' + r.serves].concat((r.tags || []).slice(0, 3)), x = M;
        g.font = '24px ' + SANS;
        chips.forEach(function (ch) { var w = g.measureText(ch).width + 36; if (x + w > W - M) { x = M; y += 56; } if (draw) { g.fillStyle = hexA(t.accent, 0.13); rr(g, x, y - 32, w, 46, 23); g.fill(); g.fillStyle = t.ink; g.fillText(ch, x + 18, y); } x += w + 12; });
        y += 74;
        var top = y, yl = y, yr = y;
        g.font = 'bold 34px ' + SANS; if (draw) { g.fillStyle = t.accent; g.fillText('Ingredients', M, yl); g.fillText('Method', M + colL + gap, yr); }
        yl += 50; yr += 50;
        g.font = '26px ' + SANS;
        r.ingredients.forEach(function (it) { var ls = wrap(g, it, colL - 34); if (draw) { g.fillStyle = t.accent; g.beginPath(); g.arc(M + 8, yl - 9, 6, 0, 7); g.fill(); } ls.forEach(function (l) { if (draw) { g.fillStyle = t.ink; g.fillText(l, M + 30, yl); } yl += 36; }); yl += 8; });
        r.steps.forEach(function (st, i) {
          var ls = wrap(g, st, colR - 66);
          if (draw) { g.fillStyle = t.accent; g.beginPath(); g.arc(M + colL + gap + 20, yr - 10, 20, 0, 7); g.fill(); g.fillStyle = isDarkHex(t.accent) ? '#fff' : '#111'; g.font = 'bold 22px ' + SANS; g.textAlign = 'center'; g.fillText(String(i + 1), M + colL + gap + 20, yr - 2); g.textAlign = 'left'; g.font = '26px ' + SANS; }
          ls.forEach(function (l) { if (draw) { g.fillStyle = t.ink; g.fillText(l, M + colL + gap + 58, yr); } yr += 36; }); yr += 14;
        });
        if (draw) { g.strokeStyle = hexA(t.ink, 0.14); g.lineWidth = 2; g.beginPath(); g.moveTo(M + colL + gap / 2, top - 30); g.lineTo(M + colL + gap / 2, Math.max(yl, yr) - 20); g.stroke(); }
        y = Math.max(yl, yr) + 24;
        if (n) {
          var bh = 250;
          if (draw) {
            g.fillStyle = hexA(t.accent, 0.1); rr(g, M, y, W - 2 * M, bh, 24); g.fill();
            g.fillStyle = t.accent; g.font = 'bold 30px ' + SANS; g.fillText('Nutrition per serving (estimated)', M + 32, y + 52);
            var cells = [['Energy', n.kj.toLocaleString('en-NZ') + ' kJ', n.kcal + ' kcal'], ['Protein', n.protein + ' g'], ['Fat', n.fat + ' g', 'sat. ' + n.satfat + ' g'], ['Carbs', n.carbs + ' g', 'sugars ' + n.sugars + ' g'], ['Fibre', n.fibre + ' g'], ['Sodium', n.sodium + ' mg']];
            var cw = (W - 2 * M - 64) / 6;
            cells.forEach(function (cl, i) { var cx = M + 32 + i * cw; g.fillStyle = hexA(t.ink, 0.65); g.font = '22px ' + SANS; g.fillText(cl[0], cx, y + 108); g.fillStyle = t.ink; g.font = 'bold 34px ' + SANS; g.fillText(cl[1], cx, y + 152); if (cl[2]) { g.fillStyle = hexA(t.ink, 0.65); g.font = '21px ' + SANS; g.fillText(cl[2], cx, y + 186); } });
            g.fillStyle = hexA(t.ink, 0.6); g.font = '19px ' + SANS; g.fillText('Estimated from typical ingredient values; excludes optional items. Brands and portions vary.', M + 32, y + 226);
          }
          y += bh + 28;
        }
        g.font = '25px ' + SANS;
        var tip = wrap(g, '💡 ' + r.tip, W - 2 * M - 64), al = wrap(g, 'Allergens: ' + r.allergens, W - 2 * M - 64), th = (tip.length + al.length) * 36 + 60;
        if (draw) { g.strokeStyle = hexA(t.accent, 0.5); g.lineWidth = 2; rr(g, M, y, W - 2 * M, th, 20); g.stroke(); }
        var yy = y + 46; tip.concat(al).forEach(function (l) { if (draw) { g.fillStyle = t.ink; g.fillText(l, M + 32, yy); } yy += 36; });
        y += th + 60;
        if (draw) { g.fillStyle = t.accent; g.fillRect(0, y - 6, W, 4); footer(g, t, W, y + 40, 'From Our Kitchen · The James NZ · thejamesnz.com'); }
        return y + 72;
      }
      c.width = W; c.height = 3000; var H = pass(false); c.height = H; pass(true);
    });
  }
  function RecipeCard(props) {
    var r = props.recipe;
    var tv = JNZX.useStored('jnzx-recipe-theme', { id: 'garden' }), theme = tv[0], setTheme = tv[1];
    var t = themeOf(theme);
    var ref = usePoster(function (c, alive) { return c && drawRecipe(c, r, t, alive); }, [r.id, JSON.stringify(theme)]);
    return h('section', { className: 'jx-poster-sec' },
      h('h2', null, 'Share this recipe'),
      h('p', { className: 'jx-muted' }, 'A complete recipe card — photo, ingredients, method, nutrition and tip. Choose your colours, then share or save.'),
      h(ThemePicker, { value: theme, onChange: setTheme }),
      h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Recipe card preview for ' + r.name })),
      h(ExportBar, { canvasRef: ref, name: 'TheJamesNZ-recipe-' + r.id, title: r.name + ' · From Our Kitchen', text: r.name + ' — a recipe from The James NZ', extra: props.extra }));
  }
  try {
    var baseRecipeExports = q7RecipeExports;
    q7RecipeExports = function (props) {
      return h(Frag, null, h(NutritionPanel, { recipe: props.recipe }), h(RecipeCard, { recipe: props.recipe, extra: h('button', { type: 'button', className: 'secondary', onClick: function () { var host = document.querySelector('.jx-old-recipe-exports button.secondary'); if (host) host.click(); } }, 'Download web page') }), h('div', { className: 'jx-old-recipe-exports', hidden: true }, h(baseRecipeExports, props)));
    };
  } catch (e) { console.warn('[JNZX] recipes', e); }

  /* ======================= SHOPPING MADE SIMPLE ======================= */
  var CATS = [['Fresh produce', '🥦'], ['Pantry staples', '🍚'], ['Dry goods', '🫘'], ['Meat & protein', '🍗'], ['Canned goods', '🥫'], ['Frozen foods', '🧊'], ['Dairy & chilled', '🥛'], ['Bakery', '🍞'], ['Household', '🧽'], ['Baby & kids', '🍼'], ['Other', '🛒']];
  var OLDCAT = { Produce: 'Fresh produce', Pantry: 'Pantry staples', Chilled: 'Dairy & chilled', Frozen: 'Frozen foods', Household: 'Household', Baby: 'Baby & kids', Other: 'Other' };
  var STARTERS = {
    'Budget staples': [['Fresh produce', ['Potatoes', 'Onions', 'Carrots', 'Kūmara', 'Seasonal veges on special', 'Bananas or apples', 'Garlic']], ['Pantry staples', ['Rice', 'Pasta', 'Rolled oats', 'Flour', 'Cooking oil', 'Salt and pepper', 'Dried herbs and spices']], ['Dry goods', ['Red lentils', 'Dried beans', 'Crackers']], ['Meat & protein', ['Chicken thighs', 'Beef or pork mince', 'Sausages', 'Eggs']], ['Canned goods', ['Chopped tomatoes', 'Baked beans', 'Chickpeas', 'Tuna', 'Stock']], ['Frozen foods', ['Mixed veges', 'Peas', 'Frozen berries']], ['Dairy & chilled', ['Milk', 'Block cheese', 'Butter or spread', 'Plain yoghurt']], ['Bakery', ['Bread (freeze half)']]],
    'Weekly family shop': [['Fresh produce', ['Apples', 'Bananas', 'Mandarins or kiwifruit', 'Broccoli', 'Lettuce', 'Tomatoes', 'Cucumber', 'Carrots']], ['Meat & protein', ['Chicken breast', 'Mince', 'Fish fillets', 'Eggs']], ['Dairy & chilled', ['Milk', 'Cheese', 'Yoghurt', 'Butter']], ['Bakery', ['Sandwich bread', 'Wraps']], ['Pantry staples', ['Breakfast cereal', 'Rice', 'Pasta', 'Pasta sauce', 'Peanut butter']], ['Household', ['Dishwashing liquid', 'Toilet paper', 'Laundry powder']]],
    'Lunchbox week': [['Bakery', ['Wholegrain bread', 'Wraps']], ['Fresh produce', ['Apples', 'Mandarins', 'Carrot sticks', 'Cherry tomatoes', 'Cucumber']], ['Dairy & chilled', ['Cheese slices', 'Yoghurt pottles', 'Ham or chicken slices']], ['Pantry staples', ['Crackers', 'Rice crackers', 'Popcorn kernels', 'Muesli bars']], ['Other', ['Reusable containers', 'Water bottles']]],
    'Baby essentials': [['Baby & kids', ['Nappies', 'Wipes', 'Nappy cream', 'Baby wash', 'Infant formula (if used)', 'Baby cereal or first foods']], ['Fresh produce', ['Avocado', 'Banana', 'Kūmara', 'Pumpkin', 'Pears']], ['Household', ['Laundry liquid (sensitive)', 'Tissues']]],
    'BBQ & picnic': [['Meat & protein', ['Sausages', 'Chicken kebabs', 'Veggie patties']], ['Bakery', ['Bread rolls', 'Sliced bread']], ['Fresh produce', ['Lettuce', 'Tomatoes', 'Red onion', 'Corn cobs', 'Watermelon']], ['Pantry staples', ['Tomato sauce', 'Mustard', 'Chippies', 'Lemonade or juice']], ['Other', ['Ice', 'Sunscreen', 'Rubbish bags']]]
  };
  var SHOP_TIPS = ['Make a meal plan and shop with a list', 'Compare unit prices ($ per kg or per 100 g)', 'Try home brands', 'Buy fruit and veges in season — see Fresh Picks Today', 'Check specials and stock up only on what you use', 'Freeze bread, leftovers and ripe bananas', 'Bulk out mince with lentils, beans or grated veges', 'Shop after a meal, not when hungry'];
  function migrateGrocery() {
    try {
      var old = JSON.parse(localStorage.getItem('james-grocery-v1') || 'null');
      if (old && old.items && old.items.length) return { title: old.title || 'Our grocery list', budget: '', items: old.items.map(function (r) { return { id: uid(), name: r.name, qty: r.qty || '', cat: OLDCAT[r.category] || 'Other', price: '', done: !!r.done }; }), theme: { id: 'garden', design: 'boxes' } };
    } catch (e) {}
    return null;
  }
  function drawGrocery(c, d, t) {
    var W = 1240, M = 56, g = c.getContext('2d'), design = (d.theme && d.theme.design) || 'boxes';
    var cats = CATS.map(function (cc, i) { return { name: cc[0], emoji: cc[1], col: design === 'boxes' ? BOX[i % BOX.length] : t.accent, items: d.items.filter(function (it) { return it.cat === cc[0]; }) }; }).filter(function (cc) { return cc.items.length; });
    var colW = (W - 2 * M - 32) / 2;
    function boxH(cc) { g.font = '27px ' + SANS; var n = 0; cc.items.forEach(function (it) { n += wrap(g, it.name + (it.qty ? ' · ' + it.qty : ''), colW - 110).length; }); return 92 + n * 40 + 22; }
    function pass(draw) {
      if (draw) { g.fillStyle = t.bg; g.fillRect(0, 0, W, c.height); g.fillStyle = t.accent; rr(g, M, 40, W - 2 * M, 24, 12); g.fill(); }
      var y = 150; g.font = 'bold 74px ' + SANS; g.textAlign = 'center';
      wrap(g, d.title || 'Our grocery list', W - 2 * M).forEach(function (l) { if (draw) { g.fillStyle = t.ink; g.fillText(l, W / 2, y); } y += 82; });
      g.font = '26px ' + SANS; var sub = [d.items.length + ' items'], est = d.items.reduce(function (s, it) { return s + num(it.price); }, 0);
      if (est) sub.push('estimated ' + money(est)); if (num(d.budget)) sub.push('budget ' + money(d.budget));
      if (draw) { g.fillStyle = hexA(t.ink, 0.7); g.fillText(sub.join(' · '), W / 2, y - 18); }
      g.textAlign = 'left'; y += 30;
      var cols = [y, y];
      var boxes = cats.map(function (cc) { return { cc: cc, h: boxH(cc) }; });
      g.font = '27px ' + SANS; boxes.push({ tips: true, h: 92 + SHOP_TIPS.reduce(function (n, tp) { return n + wrap(g, tp, colW - 90).length; }, 0) * 40 + 22 });
      boxes.forEach(function (b) {
        var ci = cols[0] <= cols[1] ? 0 : 1, x = M + ci * (colW + 32), yy = cols[ci];
        if (draw) {
          var col = b.tips ? t.accent : b.cc.col;
          g.fillStyle = hexA(col, isDarkHex(t.bg) ? 0.2 : 0.09); rr(g, x, yy, colW, b.h, 22); g.fill(); g.strokeStyle = col; g.lineWidth = 3; rr(g, x, yy, colW, b.h, 22); g.stroke();
          g.fillStyle = col; g.font = 'bold 32px ' + SANS; g.textAlign = 'center'; g.fillText(b.tips ? '💰 MONEY-SAVING TIPS' : b.cc.emoji + ' ' + b.cc.name.toUpperCase(), x + colW / 2, yy + 56); g.textAlign = 'left';
          var ly = yy + 104; g.font = '27px ' + SANS;
          (b.tips ? SHOP_TIPS.map(function (s) { return { name: s, tip: true }; }) : b.cc.items).forEach(function (it) {
            var lines = b.tips ? wrap(g, it.name, colW - 90) : wrap(g, it.name + (it.qty ? ' · ' + it.qty : ''), colW - 110);
            g.strokeStyle = hexA(t.ink, 0.55); g.lineWidth = 2;
            if (b.tips) { g.fillStyle = col; g.fillText('✓', x + 26, ly); } else { g.strokeRect(x + 26, ly - 22, 24, 24); if (it.done) { g.fillStyle = col; g.fillText('✓', x + 27, ly); } }
            lines.forEach(function (l, li) { g.fillStyle = t.ink; g.fillText(l, x + 64, ly); if (li === 0 && !b.tips && num(it.price)) { g.textAlign = 'right'; g.fillStyle = hexA(t.ink, 0.6); g.font = '23px ' + SANS; g.fillText(money(it.price), x + colW - 22, ly); g.textAlign = 'left'; g.font = '27px ' + SANS; } ly += 40; });
          });
        }
        cols[ci] += b.h + 26;
      });
      y = Math.max(cols[0], cols[1]) + 10;
      if (draw) { g.fillStyle = t.accent; rr(g, M, y, W - 2 * M, 64, 14); g.fill(); g.fillStyle = isDarkHex(t.accent) ? '#fff' : '#111'; g.font = '25px ' + SANS; g.textAlign = 'center'; g.fillText('Good food, smart choices, happy budget ♥  ·  thejamesnz.com', W / 2, y + 42); g.textAlign = 'left'; }
      return y + 104;
    }
    c.width = W; c.height = 4000; var H = pass(false); c.height = Math.max(H, 600); pass(true);
  }
  try {
    GroceryList = function GroceryListV2() {
      var st = JNZX.useStored('jnzx-grocery-v2', null), raw = st[0], setRaw = st[1];
      var d = raw || migrateGrocery() || { title: 'Our grocery list', budget: '', items: [].concat.apply([], STARTERS['Budget staples'].map(function (grp) { return grp[1].map(function (n) { return { id: 'st-' + n, name: n, qty: '', cat: grp[0], price: '', done: false }; }); })), theme: { id: 'garden', design: 'boxes' } };
      function set(fn) { setRaw(function (prev) { var base = prev || d; return typeof fn === 'function' ? fn(base) : fn; }); }
      var nm = useState(''), name = nm[0], setName = nm[1], qt = useState(''), qty = qt[0], setQty = qt[1], pr = useState(''), price = pr[0], setPrice = pr[1], ct = useState('Fresh produce'), cat = ct[0], setCat = ct[1];
      var hb = useState(false), hideBought = hb[0], setHideBought = hb[1];
      var t = themeOf(d.theme);
      var ref = usePoster(function (c) { if (c) drawGrocery(c, d, t); }, [JSON.stringify(d)]);
      function upd(id, o) { set(function (x) { return Object.assign({}, x, { items: x.items.map(function (it) { return it.id === id ? Object.assign({}, it, o) : it; }) }); }); }
      function addItem(e) { e.preventDefault(); var n = name.trim(); if (!n) return; set(function (x) { return Object.assign({}, x, { items: x.items.concat([{ id: uid(), name: n, qty: qty.trim(), cat: cat, price: price, done: false }]) }); }); setName(''); setQty(''); setPrice(''); }
      function starter(k) { if (!k) return; set(function (x) { var have = {}; x.items.forEach(function (it) { have[it.name.toLowerCase()] = 1; }); var add = []; STARTERS[k].forEach(function (grp) { grp[1].forEach(function (n) { if (!have[n.toLowerCase()]) add.push({ id: uid(), name: n, qty: '', cat: grp[0], price: '', done: false }); }); }); return Object.assign({}, x, { items: x.items.concat(add) }); }); }
      var total = d.items.reduce(function (s, it) { return s + num(it.price); }, 0), spent = d.items.reduce(function (s, it) { return s + (it.done ? num(it.price) : 0); }, 0), budget = num(d.budget);
      var bought = d.items.filter(function (it) { return it.done; }).length;
      var text = (d.title || 'Grocery list') + '\n' + CATS.map(function (cc) { var its = d.items.filter(function (it) { return it.cat === cc[0]; }); return its.length ? cc[1] + ' ' + cc[0] + '\n' + its.map(function (it) { return (it.done ? '☑ ' : '☐ ') + it.name + (it.qty ? ' · ' + it.qty : ''); }).join('\n') : ''; }).filter(Boolean).join('\n\n');
      function copyText() { try { navigator.clipboard.writeText(text); } catch (e) {} }
      return h('div', { className: 'jx-page' },
        JNZX.Header('FAMILY TOGETHER · SHOPPING MADE SIMPLE', 'Grocery list.', 'Plan your shop by aisle, set a budget, tick things off as you go, and share a colourful printable list. Everything saves on this device.'),
        h('div', { className: 'jx-row jx-form' },
          h('label', null, 'List name', h('input', { value: d.title, maxLength: 60, style: { minWidth: '16em' }, onChange: function (e) { var v = e.target.value; set(function (x) { return Object.assign({}, x, { title: v }); }); } })),
          h('label', null, 'Budget (NZD)', h('input', { type: 'number', min: 0, step: 1, value: d.budget, style: { width: '9em' }, onChange: function (e) { var v = e.target.value; set(function (x) { return Object.assign({}, x, { budget: v }); }); } })),
          h('label', null, 'Add a starter list', h('select', { value: '', onChange: function (e) { starter(e.target.value); } }, h('option', { value: '' }, 'Choose…'), Object.keys(STARTERS).map(function (k) { return h('option', { key: k }, k); })))),
        h('div', { className: 'jx-stats' },
          h('div', { className: 'jx-stat' }, h('span', null, 'Items'), h('strong', null, bought + ' / ' + d.items.length), h('small', null, 'bought')),
          h('div', { className: 'jx-stat' }, h('span', null, 'Estimated total'), h('strong', null, money(total))),
          h('div', { className: 'jx-stat' }, h('span', null, 'Spent so far'), h('strong', null, money(spent))),
          budget > 0 && h('div', { className: 'jx-stat' + (total > budget ? ' is-bad' : ' is-good') }, h('span', null, total > budget ? 'Over budget by' : 'Under budget by'), h('strong', null, money(Math.abs(budget - total))))),
        h('form', { className: 'jx-row jx-form jx-add-item', onSubmit: addItem },
          h('label', null, 'Item', h('input', { value: name, maxLength: 80, placeholder: 'e.g. Milk', onChange: function (e) { setName(e.target.value); } })),
          h('label', null, 'Quantity', h('input', { value: qty, maxLength: 30, placeholder: '2 L', style: { width: '7em' }, onChange: function (e) { setQty(e.target.value); } })),
          h('label', null, 'Est. price', h('input', { type: 'number', min: 0, step: 0.01, value: price, placeholder: '$', style: { width: '7em' }, onChange: function (e) { setPrice(e.target.value); } })),
          h('label', null, 'Aisle', h('select', { value: cat, onChange: function (e) { setCat(e.target.value); } }, CATS.map(function (cc) { return h('option', { key: cc[0], value: cc[0] }, cc[1] + ' ' + cc[0]); }))),
          h('button', { type: 'submit', className: 'primary' }, 'Add')),
        h('div', { className: 'jx-row' },
          h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: hideBought, onChange: function (e) { setHideBought(e.target.checked); } }), h('span', null, 'Hide bought items')),
          h('button', { type: 'button', className: 'secondary', disabled: !bought, onClick: function () { set(function (x) { return Object.assign({}, x, { items: x.items.map(function (it) { return Object.assign({}, it, { done: false }); }) }); }); } }, 'Untick all'),
          h('button', { type: 'button', className: 'secondary', disabled: !bought, onClick: function () { set(function (x) { return Object.assign({}, x, { items: x.items.filter(function (it) { return !it.done; }) }); }); } }, 'Remove bought'),
          h('button', { type: 'button', className: 'secondary', disabled: !d.items.length, onClick: function () { if (confirm('Clear the whole list?')) set(function (x) { return Object.assign({}, x, { items: [] }); }); } }, 'Clear list')),
        !d.items.length && h('div', { className: 'jx-note' }, 'Your list is empty. Add items above, or choose a starter list such as “Budget staples”.'),
        h('div', { className: 'jx-aisles' }, CATS.map(function (cc, ci) {
          var its = d.items.filter(function (it) { return it.cat === cc[0] && !(hideBought && it.done); });
          if (!its.length) return null;
          return h('section', { key: cc[0], className: 'jx-aisle jx-keep-colour', style: { '--aisle': BOX[ci % BOX.length] } },
            h('h3', null, cc[1] + ' ' + cc[0]),
            its.map(function (it) {
              return h('div', { key: it.id, className: 'jx-aisle-row' + (it.done ? ' is-done' : '') },
                h('input', { type: 'checkbox', checked: it.done, 'aria-label': 'Bought ' + it.name, onChange: function (e) { upd(it.id, { done: e.target.checked }); } }),
                h('input', { className: 'jx-aisle-name', value: it.name, 'aria-label': 'Item name', onChange: function (e) { upd(it.id, { name: e.target.value }); } }),
                h('input', { className: 'jx-aisle-qty', value: it.qty, placeholder: 'qty', 'aria-label': 'Quantity for ' + it.name, onChange: function (e) { upd(it.id, { qty: e.target.value }); } }),
                h('input', { className: 'jx-aisle-price', type: 'number', min: 0, step: 0.01, value: it.price, placeholder: '$', 'aria-label': 'Price for ' + it.name, onChange: function (e) { upd(it.id, { price: e.target.value }); } }),
                h('select', { className: 'jx-aisle-move', value: it.cat, 'aria-label': 'Move ' + it.name + ' to aisle', onChange: function (e) { upd(it.id, { cat: e.target.value }); } }, CATS.map(function (c2) { return h('option', { key: c2[0], value: c2[0] }, c2[1]); })),
                h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Remove ' + it.name, onClick: function () { set(function (x) { return Object.assign({}, x, { items: x.items.filter(function (y) { return y.id !== it.id; }) }); }); } }, '×'));
            }));
        })),
        h('div', { className: 'jx-card jx-tipbox' }, h('h3', null, '💰 Money-saving tips'), h('ul', null, SHOP_TIPS.map(function (s) { return h('li', { key: s }, s); }))),
        h('section', { className: 'jx-poster-sec' },
          h('h2', null, 'Print or share your list'),
          h(ThemePicker, { value: d.theme, designs: [['boxes', 'Colourful boxes'], ['mono', 'One colour']], onChange: function (v) { set(function (x) { return Object.assign({}, x, { theme: v }); }); } }),
          h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Printable grocery list preview' })),
          h(ExportBar, { canvasRef: ref, name: 'TheJamesNZ-grocery-list', title: d.title || 'Grocery list', extra: h('button', { type: 'button', className: 'secondary', onClick: copyText }, 'Copy as text') })),
        h('p', { className: 'small-note' }, 'Prices are your own estimates. Your list is saved only in this browser.'));
    };
  } catch (e) { console.warn('[JNZX] grocery', e); }

  /* ========================= MY MONEY PLAN ========================= */
  var MGROUPS = [['income', 'Income', '💵'], ['bills', 'Bills', '🧾'], ['expenses', 'Expenses', '🛒'], ['savings', 'Savings', '🐷'], ['debts', 'Debts', '💳']];
  var MDEFAULT = {
    income: [['Pay #1', 0], ['Pay #2', 0], ['Working for Families / other', 0]],
    bills: [['Rent or mortgage', 0], ['Power', 0], ['Internet', 0], ['Mobile phones', 0], ['Insurance', 0], ['Rates or water', 0]],
    expenses: [['Groceries', 0], ['Petrol & transport', 0], ['Kids & school', 0], ['Eating out & takeaways', 0], ['Clothes', 0], ['Giving & church', 0], ['Fun & hobbies', 0]],
    savings: [['Emergency fund', 0], ['KiwiSaver extra', 0], ['Holiday', 0]],
    debts: [['Credit card', 0], ['Car loan', 0]]
  };
  function blankMonth() { var o = {}; Object.keys(MDEFAULT).forEach(function (k) { o[k] = MDEFAULT[k].map(function (r) { return { id: uid(), name: r[0], plan: '', actual: '' }; }); }); return o; }
  function migrateBudget() {
    try {
      var old = JSON.parse(localStorage.getItem('james-budget-v1') || 'null'); if (!old) return null;
      var months = {};
      Object.keys(old).forEach(function (m) { var d = old[m], b = blankMonth(); b.income = [{ id: uid(), name: 'Income', plan: d.plannedIncome || '', actual: d.actualIncome || '' }]; b.expenses = (d.rows || []).map(function (r) { return { id: uid(), name: r.name, plan: r.planned || '', actual: r.actual || '' }; }); months[m] = b; });
      return Object.keys(months).length ? months : null;
    } catch (e) { return null; }
  }
  function totals(m) { var o = {}; MGROUPS.forEach(function (g) { var rows = m[g[0]] || []; o[g[0]] = { plan: rows.reduce(function (s, r) { return s + num(r.plan); }, 0), actual: rows.reduce(function (s, r) { return s + num(r.actual); }, 0) }; }); return o; }
  function shades(accent, n) { var out = [], c = accent.replace('#', ''), r = parseInt(c.slice(0, 2), 16), g = parseInt(c.slice(2, 4), 16), b = parseInt(c.slice(4, 6), 16); for (var i = 0; i < n; i++) { var f = 1 - i / (n + 0.5); out.push('rgb(' + Math.round(r * f + 255 * (1 - f)) + ',' + Math.round(g * f + 255 * (1 - f)) + ',' + Math.round(b * f + 255 * (1 - f)) + ')'); } return out; }
  function Donut(props) {
    var data = props.data.filter(function (d) { return d.v > 0; }), sum = data.reduce(function (s, d) { return s + d.v; }, 0), a = -Math.PI / 2;
    if (!sum) return h('p', { className: 'jx-muted' }, 'Add actual amounts to see your spending breakdown.');
    return h('div', { className: 'jx-donut' }, h('svg', { viewBox: '0 0 200 200', role: 'img', 'aria-label': 'Spending breakdown: ' + data.map(function (d) { return d.label + ' ' + Math.round(d.v / sum * 100) + '%'; }).join(', ') },
      data.map(function (d, i) { var a2 = a + d.v / sum * Math.PI * 2, large = a2 - a > Math.PI ? 1 : 0; var p = data.length === 1 ? 'M100 15 A85 85 0 1 1 99.99 15 Z' : 'M100 100 L' + (100 + 85 * Math.cos(a)) + ' ' + (100 + 85 * Math.sin(a)) + ' A85 85 0 ' + large + ' 1 ' + (100 + 85 * Math.cos(a2)) + ' ' + (100 + 85 * Math.sin(a2)) + ' Z'; a = a2; return h('path', { key: i, d: p, fill: d.c, stroke: props.bg, strokeWidth: 2 }); }),
      h('circle', { cx: 100, cy: 100, r: 48, fill: props.bg })),
      h('ul', { className: 'jx-legend' }, data.map(function (d, i) { return h('li', { key: i }, h('span', { className: 'jx-key', style: { background: d.c } }), d.label + ' ', h('strong', null, Math.round(d.v / sum * 100) + '%')); })));
  }
  function Bars(props) {
    var max = Math.max.apply(null, props.data.map(function (d) { return Math.max(d.plan, d.actual); }).concat([1]));
    return h('div', { className: 'jx-bars' }, props.data.map(function (d) {
      return h('div', { key: d.label, className: 'jx-bar-g' },
        h('div', { className: 'jx-bar-pair' }, h('span', { style: { height: d.plan / max * 100 + '%', background: props.c1 }, title: 'Planned ' + money(d.plan) }), h('span', { style: { height: d.actual / max * 100 + '%', background: props.c2 }, title: 'Actual ' + money(d.actual) })),
        h('small', null, d.label));
    }), h('p', { className: 'jx-legend-inline' }, h('span', { className: 'jx-key', style: { background: props.c1 } }), 'Planned ', h('span', { className: 'jx-key', style: { background: props.c2 } }), 'Actual'));
  }
  function drawMoney(c, monthLabel, m, t) {
    var W = 1240, M = 56, g = c.getContext('2d'), T = totals(m), out = T.bills.actual + T.expenses.actual + T.savings.actual + T.debts.actual, cols = shades(t.accent, 4);
    var rows = MGROUPS.slice(1).map(function (gr, i) { return [gr[1], T[gr[0]].plan, T[gr[0]].actual, cols[i], gr[0]]; });
    c.width = W; c.height = 860 + 64 + 5 * 62 + 60 + 50;
    g.fillStyle = t.bg; g.fillRect(0, 0, W, c.height);
    g.fillStyle = t.ink; g.font = '64px ' + SERIF; g.textAlign = 'center'; g.fillText('My Money Plan', W / 2, 110);
    g.font = 'bold 28px ' + SANS; g.fillStyle = t.accent; g.fillText(monthLabel.toUpperCase(), W / 2, 158); g.textAlign = 'left';
    var tiles = [['Total income', T.income.actual || T.income.plan], ['Total spending', out], ['Left to spend', (T.income.actual || T.income.plan) - out], ['Left to allocate', T.income.plan - (T.bills.plan + T.expenses.plan + T.savings.plan + T.debts.plan)]];
    var tw = (W - 2 * M - 3 * 20) / 4;
    tiles.forEach(function (tl, i) { var x = M + i * (tw + 20); g.fillStyle = hexA(t.accent, 0.12); rr(g, x, 200, tw, 140, 18); g.fill(); g.fillStyle = hexA(t.ink, 0.7); g.font = '23px ' + SANS; g.fillText(tl[0], x + 22, 244); g.fillStyle = tl[1] < 0 ? '#c0392b' : t.ink; g.font = 'bold 38px ' + SANS; g.fillText(money(tl[1]), x + 22, 300); });
    // donut
    var sum = rows.reduce(function (s, r) { return s + r[2]; }, 0), a = -Math.PI / 2, cx = M + 200, cy = 590;
    g.fillStyle = t.ink; g.font = 'bold 28px ' + SANS; g.fillText('Spending breakdown', M, 400);
    if (sum) rows.forEach(function (r) { if (!r[2]) return; var a2 = a + r[2] / sum * Math.PI * 2; g.fillStyle = r[3]; g.beginPath(); g.moveTo(cx, cy); g.arc(cx, cy, 170, a, a2); g.closePath(); g.fill(); a = a2; });
    else { g.strokeStyle = hexA(t.ink, 0.2); g.lineWidth = 3; g.beginPath(); g.arc(cx, cy, 170, 0, 7); g.stroke(); }
    g.fillStyle = t.bg; g.beginPath(); g.arc(cx, cy, 90, 0, 7); g.fill();
    rows.forEach(function (r, i) { var y = 470 + i * 52; g.fillStyle = r[3]; rr(g, M + 420, y - 24, 30, 30, 6); g.fill(); g.fillStyle = t.ink; g.font = '26px ' + SANS; g.fillText(r[0] + (sum ? ' · ' + Math.round(r[2] / sum * 100) + '%' : ''), M + 466, y); });
    // bars
    var bx = 760, bw = W - M - bx, by = 440, bh = 300, max = Math.max.apply(null, rows.map(function (r) { return Math.max(r[1], r[2]); }).concat([1]));
    g.fillStyle = t.ink; g.font = 'bold 28px ' + SANS; g.fillText('Planned vs actual', bx, 400);
    rows.forEach(function (r, i) { var gx = bx + i * (bw / 4) + 14, w = (bw / 4 - 40) / 2; var p = r[1] / max * bh, q = r[2] / max * bh; g.fillStyle = hexA(t.accent, 0.35); g.fillRect(gx, by + bh - p, w, p); g.fillStyle = t.accent; g.fillRect(gx + w + 4, by + bh - q, w, q); g.fillStyle = t.ink; g.font = '20px ' + SANS; g.fillText(r[0], gx, by + bh + 30); });
    // table
    var ty = 860; g.fillStyle = t.accent; rr(g, M, ty, W - 2 * M, 64, 14); g.fill(); g.fillStyle = isDarkHex(t.accent) ? '#fff' : '#111'; g.font = 'bold 26px ' + SANS;
    [['Budget', M + 24], ['Planned', M + 420], ['Actual', M + 680], ['Status', M + 940]].forEach(function (hd) { g.fillText(hd[0], hd[1], ty + 42); });
    var all = [['Income', T.income.plan, T.income.actual, null, 'income']].concat(rows);
    all.forEach(function (r, i) { var y = ty + 64 + i * 62 + 42; g.fillStyle = i % 2 ? hexA(t.accent, 0.06) : 'transparent'; if (i % 2) g.fillRect(M, y - 42, W - 2 * M, 62); g.fillStyle = t.ink; g.font = '26px ' + SANS; g.fillText(r[0], M + 24, y); g.fillText(money(r[1]), M + 420, y); g.fillText(money(r[2]), M + 680, y); var ok = r[4] === 'savings' || r[4] === 'income' ? r[2] >= r[1] : r[2] <= r[1]; g.fillStyle = ok ? '#2e8b57' : '#c0392b'; g.font = 'bold 30px ' + SANS; g.fillText(r[1] || r[2] ? (ok ? '✓' : '✗') : '—', M + 960, y); });
    var fy = ty + 64 + all.length * 62 + 60; g.fillStyle = hexA(t.ink, 0.55); g.font = '21px ' + SANS; g.fillText('Household plan in NZD. A personal record, not financial advice. · thejamesnz.com', M, fy);
  }
  try {
    BudgetTracker = function MoneyPlan() {
      var st = JNZX.useStored('jnzx-money-v2', null), raw = st[0], setRaw = st[1];
      var data = raw || { months: migrateBudget() || {}, theme: { id: 'blush' } };
      var today = new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' }).slice(0, 7);
      var ms = useState(today), month = ms[0], setMonth = ms[1];
      var m = data.months[month] || blankMonth();
      var t = themeOf(data.theme);
      function setData(fn) { setRaw(function (prev) { return fn(prev || data); }); }
      function setMonthData(fn) { setData(function (d) { var months = Object.assign({}, d.months); months[month] = fn(d.months[month] || blankMonth()); return Object.assign({}, d, { months: months }); }); }
      function updRow(gk, id, o) { setMonthData(function (mm) { var x = Object.assign({}, mm); x[gk] = mm[gk].map(function (r) { return r.id === id ? Object.assign({}, r, o) : r; }); return x; }); }
      var T = totals(m), out = T.bills.actual + T.expenses.actual + T.savings.actual + T.debts.actual, planOut = T.bills.plan + T.expenses.plan + T.savings.plan + T.debts.plan;
      var inc = T.income.actual || T.income.plan;
      var cols = shades(t.accent, 4);
      var monthLabel = (function () { var p = month.split('-'); return new Date(Date.UTC(+p[0], +p[1] - 1, 15)).toLocaleDateString('en-NZ', { month: 'long', year: 'numeric', timeZone: 'UTC' }); })();
      var ref = usePoster(function (c) { if (c) drawMoney(c, monthLabel, m, t); }, [JSON.stringify(m), JSON.stringify(data.theme), month]);
      var prevKey = (function () { var p = month.split('-'), d = new Date(Date.UTC(+p[0], +p[1] - 2, 1)); return d.toISOString().slice(0, 7); })();
      function copyPrev() { var p = data.months[prevKey]; if (!p) return; setMonthData(function () { var x = {}; MGROUPS.forEach(function (gr) { x[gr[0]] = (p[gr[0]] || []).map(function (r) { return { id: uid(), name: r.name, plan: r.plan, actual: '' }; }); }); return x; }); }
      function csv() { var L = [['Month', 'Group', 'Item', 'Planned NZD', 'Actual NZD']]; MGROUPS.forEach(function (gr) { (m[gr[0]] || []).forEach(function (r) { L.push([month, gr[1], r.name, num(r.plan).toFixed(2), num(r.actual).toFixed(2)]); }); }); save(new Blob(['\ufeff' + L.map(function (r) { return r.map(function (x) { return '"' + String(x).replace(/"/g, '""') + '"'; }).join(','); }).join('\r\n')], { type: 'text/csv' }), 'TheJamesNZ-money-plan-' + month + '.csv'); }
      var cv = useState({ amt: '', from: 'week' }), conv = cv[0], setConv = cv[1];
      var perMonth = num(conv.amt) * ({ week: 52, fortnight: 26, month: 12, year: 1 }[conv.from]) / 12;
      return h('div', { className: 'jx-page jx-money', style: { '--mp': t.accent } },
        JNZX.Header('FAMILY TOGETHER · MY MONEY PLAN', 'My Money Plan.', 'A monthly household budget in New Zealand dollars: plan your income, bills, everyday spending, savings and debts, then track what really happened. Saved on this device.'),
        h('div', { className: 'jx-row jx-form' },
          h('label', null, 'Month', h('input', { type: 'month', value: month, onChange: function (e) { if (e.target.value) setMonth(e.target.value); } })),
          data.months[prevKey] && h('button', { type: 'button', className: 'secondary', onClick: copyPrev }, 'Copy plan from last month')),
        h('div', { className: 'jx-stats jx-keep-colour' },
          h('div', { className: 'jx-stat' }, h('span', null, 'Total income'), h('strong', null, money(inc))),
          h('div', { className: 'jx-stat' }, h('span', null, 'Total spending'), h('strong', null, money(out))),
          h('div', { className: 'jx-stat' + (inc - out < 0 ? ' is-bad' : ' is-good') }, h('span', null, 'Left to spend'), h('strong', null, money(inc - out))),
          h('div', { className: 'jx-stat' + (T.income.plan - planOut < 0 ? ' is-bad' : '') }, h('span', null, 'Left to allocate'), h('strong', null, money(T.income.plan - planOut)))),
        h('div', { className: 'jx-money-charts jx-keep-colour' },
          h('div', { className: 'jx-card' }, h('h3', null, 'Spending breakdown'), h(Donut, { bg: 'var(--jx-card)', data: MGROUPS.slice(1).map(function (gr, i) { return { label: gr[1], v: T[gr[0]].actual, c: cols[i] }; }) })),
          h('div', { className: 'jx-card' }, h('h3', null, 'Planned vs actual'), h(Bars, { c1: hexA(t.accent, 0.35), c2: t.accent, data: MGROUPS.slice(1).map(function (gr) { return { label: gr[1], plan: T[gr[0]].plan, actual: T[gr[0]].actual }; }) }))),
        h('div', { className: 'jx-card jx-table-wrap' }, h('h3', null, 'Allocation overview'), h('table', null,
          h('thead', null, h('tr', null, ['Budget', 'Planned', 'Actual', 'Status'].map(function (x) { return h('th', { key: x }, x); }))),
          h('tbody', null, MGROUPS.map(function (gr) { var a = T[gr[0]], ok = gr[0] === 'savings' || gr[0] === 'income' ? a.actual >= a.plan : a.actual <= a.plan; return h('tr', { key: gr[0] }, h('th', null, gr[2] + ' ' + gr[1]), h('td', null, money(a.plan)), h('td', null, money(a.actual)), h('td', { className: ok ? 'jx-ok' : 'jx-bad' }, a.plan || a.actual ? (ok ? '✓ on track' : gr[0] === 'income' ? '✗ below plan' : gr[0] === 'savings' ? '✗ under target' : '✗ over') : '—')); })))),
        h('div', { className: 'jx-money-groups' }, MGROUPS.map(function (gr) {
          var rows = m[gr[0]] || [], tt = T[gr[0]];
          return h('section', { key: gr[0], className: 'jx-card jx-money-g' },
            h('h3', null, gr[2] + ' ' + gr[1]),
            h('div', { className: 'jx-money-head' }, h('span', null, gr[0] === 'income' ? 'Source' : 'Item'), h('span', null, gr[0] === 'income' ? 'Expected' : 'Planned'), h('span', null, 'Actual'), h('span', null, '')),
            rows.map(function (r) {
              var over = gr[0] !== 'income' && gr[0] !== 'savings' && num(r.actual) > num(r.plan) && num(r.plan) > 0;
              return h('div', { key: r.id, className: 'jx-money-row' + (over ? ' is-over' : '') },
                h('input', { value: r.name, 'aria-label': gr[1] + ' item name', onChange: function (e) { updRow(gr[0], r.id, { name: e.target.value }); } }),
                h('input', { type: 'number', min: 0, step: 0.01, value: r.plan, placeholder: '0.00', 'aria-label': 'Planned amount for ' + r.name, onChange: function (e) { updRow(gr[0], r.id, { plan: e.target.value }); } }),
                h('input', { type: 'number', min: 0, step: 0.01, value: r.actual, placeholder: '0.00', 'aria-label': 'Actual amount for ' + r.name, onChange: function (e) { updRow(gr[0], r.id, { actual: e.target.value }); } }),
                h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Remove ' + r.name, onClick: function () { setMonthData(function (mm) { var x = Object.assign({}, mm); x[gr[0]] = mm[gr[0]].filter(function (y) { return y.id !== r.id; }); return x; }); } }, '×'));
            }),
            h('div', { className: 'jx-money-row jx-money-total' }, h('strong', null, 'Total'), h('strong', null, money(tt.plan)), h('strong', null, money(tt.actual)), h('span')),
            h('button', { type: 'button', className: 'secondary', onClick: function () { setMonthData(function (mm) { var x = Object.assign({}, mm); x[gr[0]] = (mm[gr[0]] || []).concat([{ id: uid(), name: 'New item', plan: '', actual: '' }]); return x; }); } }, '+ Add ' + gr[1].toLowerCase().replace(/s$/, '')));
        })),
        h('div', { className: 'jx-card' }, h('h3', null, 'Pay or bill converter'), h('div', { className: 'jx-row jx-form' },
          h('label', null, 'Amount (NZD)', h('input', { type: 'number', min: 0, step: 0.01, value: conv.amt, style: { width: '9em' }, onChange: function (e) { setConv(Object.assign({}, conv, { amt: e.target.value })); } })),
          h('label', null, 'Every', h('select', { value: conv.from, onChange: function (e) { setConv(Object.assign({}, conv, { from: e.target.value })); } }, [['week', 'week'], ['fortnight', 'fortnight'], ['month', 'month'], ['year', 'year']].map(function (x) { return h('option', { key: x[0], value: x[0] }, x[1]); }))),
          h('p', { className: 'jx-big-sm' }, '= ' + money(perMonth) + ' a month · ' + money(perMonth * 12 / 52) + ' a week'))),
        h('section', { className: 'jx-poster-sec' },
          h('h2', null, 'Your monthly summary'),
          h('p', { className: 'jx-muted' }, 'Choose colours for your summary and charts, then save or print it.'),
          h(ThemePicker, { value: data.theme, onChange: function (v) { setData(function (d) { return Object.assign({}, d, { theme: v }); }); } }),
          h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Monthly money summary preview' })),
          h(ExportBar, { canvasRef: ref, name: 'TheJamesNZ-money-plan-' + month, title: 'My Money Plan · ' + monthLabel, extra: h('button', { type: 'button', className: 'secondary', onClick: csv }, 'Download spreadsheet (CSV)') })),
        h('div', { className: 'jx-note' }, h('strong', null, 'Helpful, free and independent: '), 'Sorted (sorted.org.nz) has budgeting guides and tools, and MoneyTalks (0800 345 123) offers free financial help.'),
        h('p', { className: 'small-note' }, 'Your figures stay in this browser. Sharing the summary picture shares your numbers, so choose what you’re comfortable with. This is a household record, not financial advice.'));
    };
  } catch (e) { console.warn('[JNZX] money', e); }

  /* ======================= MY KIWI ADVENTURES ======================= */
  var IDEAS = [['🏖️', 'Swim at a surf beach between the flags'], ['🥾', 'Walk a Great Walk (or part of one)'], ['🌋', 'Climb a volcano or maunga'], ['🐧', 'Spot a little blue penguin'], ['🐋', 'See whales or dolphins'], ['🥝', 'Pick your own berries or apples'], ['🍦', 'Eat hokey pokey ice cream'], ['🐟', 'Have fish and chips on the beach'], ['⛺', 'Camp at a DOC campsite'], ['✨', 'See glowworms'], ['🌌', 'Stargaze in a Dark Sky Reserve'], ['🌟', 'Find Matariki in the winter sky'], ['🚲', 'Ride a cycle trail'], ['🛶', 'Paddle a kayak or waka'], ['🎣', 'Catch (and release) a fish'], ['🌊', 'Visit a waterfall'], ['♨️', 'Soak in a hot pool'], ['🏔️', 'Play in the snow'], ['🗺️', 'Visit Cape Reinga / Te Rerenga Wairua'], ['🪨', 'Find the Moeraki Boulders'], ['🦭', 'See fur seals at a colony'], ['🐦', 'Hear a tūī or bellbird in the bush'], ['🌳', 'See a giant kauri tree'], ['🏛️', 'Explore Te Papa'], ['🚂', 'Ride a heritage train'], ['🎡', 'Go to an A&P show'], ['🥧', 'Taste a classic mince and cheese pie'], ['🍓', 'Try a pavlova with fresh fruit'], ['🧺', 'Have a picnic at a regional park'], ['🏉', 'Watch a rugby or netball game live'], ['🎆', 'Watch Guy Fawkes or Matariki fireworks'], ['🌅', 'Watch the first sunrise of the year'], ['🏝️', 'Take a ferry to an island'], ['🦕', 'Fossick for fossils or pretty stones'], ['🐑', 'Visit a farm and feed the animals'], ['🌿', 'Plant a native tree'], ['🧹', 'Join a beach clean-up'], ['📚', 'Borrow a library book about Aotearoa'], ['🗣️', 'Learn a mihi in te reo Māori'], ['🎶', 'Learn a waiata as a family'], ['🍞', 'Try rēwena bread or a hāngī'], ['🏊', 'Jump off a jetty (where it’s safe)'], ['🚶', 'Walk a coastal track at low tide'], ['🔭', 'Visit a planetarium or observatory'], ['🎨', 'Paint a Kiwi landscape'], ['🏕️', 'Toast marshmallows on a campfire'], ['🐚', 'Collect shells (and leave living ones)'], ['🛝', 'Find the best playground in your town'], ['⛪', 'Visit a historic church'], ['📸', 'Make a family photo book']];
  var DESIGNS = [['summer', 'Summer pop'], ['bush', 'Bush & beach'], ['night', 'Matariki night sky'], ['clean', 'Clean & simple']];
  function drawBucket(c, d, t) {
    var W = 1240, H = 1754, g = c.getContext('2d'), design = (d.theme && d.theme.design) || 'summer';
    var ink = t.ink, bg = t.bg, acc = t.accent;
    if (design === 'night' && !(d.theme && d.theme.bg)) { bg = '#0f1a33'; ink = '#f4f1e8'; }
    c.width = W; c.height = H;
    g.fillStyle = bg; g.fillRect(0, 0, W, H);
    if (design === 'summer') {
      g.fillStyle = hexA(acc, 0.9); g.fillRect(0, 0, W, 230); g.fillStyle = '#ffd23f'; g.beginPath(); g.arc(W - 105, 105, 42, 0, 7); g.fill();
      g.strokeStyle = '#ffd23f'; g.lineWidth = 8; for (var k = 0; k < 12; k++) { var a = k * Math.PI / 6; g.beginPath(); g.moveTo(W - 105 + Math.cos(a) * 54, 105 + Math.sin(a) * 54); g.lineTo(W - 105 + Math.cos(a) * 74, 105 + Math.sin(a) * 74); g.stroke(); }
      g.strokeStyle = hexA(acc, 0.9); g.lineWidth = 22; rr(g, 11, 11, W - 22, H - 22, 30); g.stroke();
    } else if (design === 'bush') {
      g.fillStyle = hexA(acc, 0.12); g.fillRect(0, 0, W, 250);
      for (var i = 0; i < 3; i++) { g.fillStyle = hexA(acc, 0.18 + i * 0.12); g.beginPath(); g.moveTo(0, H - 120 + i * 30); for (var x = 0; x <= W; x += 40) g.lineTo(x, H - 120 + i * 30 + Math.sin(x / 90 + i) * 14); g.lineTo(W, H); g.lineTo(0, H); g.fill(); }
      g.fillStyle = hexA(acc, 0.5); [[90, 170], [160, 150], [1100, 160]].forEach(function (p) { g.beginPath(); g.moveTo(p[0], p[1] - 110); g.lineTo(p[0] - 50, p[1]); g.lineTo(p[0] + 50, p[1]); g.fill(); });
    } else if (design === 'night') {
      for (var s = 0; s < 140; s++) { var sx = (s * 977) % W, sy = (s * 613) % H; g.fillStyle = 'rgba(255,255,255,' + (0.15 + (s % 5) / 10) + ')'; g.beginPath(); g.arc(sx, sy, (s % 3) + 1, 0, 7); g.fill(); }
      var stars = [[980, 90], [1020, 120], [1060, 100], [1000, 150], [1050, 160], [1090, 140], [1030, 70], [1075, 60], [960, 130]];
      stars.forEach(function (p) { g.fillStyle = '#fff6c9'; g.beginPath(); g.arc(p[0], p[1], 6, 0, 7); g.fill(); });
    } else { g.fillStyle = acc; g.fillRect(0, 0, W, 16); }
    var headInk = design === 'summer' ? (isDarkHex(acc) ? '#fff' : '#111') : ink;
    g.textAlign = 'center'; g.fillStyle = headInk; var tsz = 82, ttl = (d.title || 'Our Kiwi bucket list').toUpperCase().slice(0, 30); do { g.font = 'bold ' + tsz + 'px ' + SANS; tsz -= 2; } while (g.measureText(ttl).width > W - 380 && tsz > 30); g.fillText(ttl, W / 2, 132);
    g.font = 'italic 34px ' + SERIF; g.fillStyle = design === 'summer' ? headInk : acc; g.fillText(d.subtitle || '', W / 2, 190);
    g.textAlign = 'left';
    var items = d.items, n = items.length, perCol = Math.ceil(n / 2), top = 300, avail = H - top - 150, lh = Math.min(54, avail / Math.max(1, perCol));
    var fs = Math.max(18, Math.min(30, lh * 0.56)), colW = (W - 160) / 2;
    var longest = items.reduce(function (a, it) { var l = (it.e ? it.e + ' ' : '') + it.t; return l.length > a.length ? l : a; }, '');
    while (fs > 19) { g.font = fs + 'px ' + SANS; if (g.measureText(longest).width <= colW - fs - 24) break; fs -= 1; }
    if (design !== 'summer' && design !== 'clean') { g.fillStyle = design === 'night' ? 'rgba(255,255,255,.06)' : hexA('#ffffff', 0.55); rr(g, 50, top - 40, W - 100, perCol * lh + 50, 24); g.fill(); }
    items.forEach(function (it, i) {
      var col = i < perCol ? 0 : 1, row = col ? i - perCol : i, x = 70 + col * (colW + 20), y = top + row * lh;
      g.strokeStyle = design === 'night' ? '#f4f1e8' : hexA(ink, 0.7); g.lineWidth = 2.5; g.strokeRect(x, y - fs + 2, fs, fs);
      if (it.done) { g.fillStyle = acc; g.font = 'bold ' + (fs + 4) + 'px ' + SANS; g.fillText('✓', x + 1, y); }
      g.font = fs + 'px ' + SANS; g.fillStyle = design === 'night' ? '#f4f1e8' : ink;
      var label = (it.e ? it.e + ' ' : '') + it.t; while (g.measureText(label).width > colW - fs - 24 && label.length > 4) label = label.slice(0, -2);
      if (label !== (it.e ? it.e + ' ' : '') + it.t) label = label.replace(/\s?\S?$/, '') + '…';
      g.fillText(label, x + fs + 14, y);
    });
    var done = items.filter(function (i) { return i.done; }).length;
    g.textAlign = 'center'; g.fillStyle = design === 'night' ? '#f4f1e8' : ink; g.font = 'bold 30px ' + SANS; g.fillText(done + ' of ' + n + ' done', W / 2, H - 92);
    g.font = '22px ' + SANS; g.fillStyle = design === 'night' ? 'rgba(244,241,232,.7)' : hexA(ink, 0.6); g.fillText('My Kiwi Adventures · The James NZ · thejamesnz.com', W / 2, H - 52); g.textAlign = 'left';
  }
  try {
    var BaseBucket = NZBucket;
    NZBucket = function KiwiAdventures() {
      var st = JNZX.useStored('jnzx-kiwi-bucket', null), raw = st[0], setRaw = st[1];
      var d = raw || { title: 'Our Kiwi bucket list', subtitle: '50 adventures in Aotearoa', items: IDEAS.map(function (x) { return { id: uid(), e: x[0], t: x[1], done: false }; }), theme: { id: 'ocean', design: 'summer' } };
      function set(fn) { setRaw(function (p) { return fn(p || d); }); }
      var tb = useState('poster'), tab = tb[0], setTab = tb[1];
      var nw = useState(''), newIdea = nw[0], setNewIdea = nw[1], em = useState('⭐'), emoji = em[0], setEmoji = em[1];
      var pk = useState(null), pick = pk[0], setPick = pk[1];
      var t = themeOf(d.theme);
      var ref = usePoster(function (c) { if (c) drawBucket(c, d, t); }, [JSON.stringify(d), tab]);
      var done = d.items.filter(function (i) { return i.done; }).length;
      function upd(id, o) { set(function (x) { return Object.assign({}, x, { items: x.items.map(function (i) { return i.id === id ? Object.assign({}, i, o) : i; }) }); }); }
      return h('div', { className: 'jx-page' },
        JNZX.Header('KIWI ADVENTURES · EXPLORE & DISCOVER', 'My Kiwi Adventures.', 'A family bucket list of things to see, taste and do around Aotearoa — tick them off, add your own and make a printable poster in your own colours.'),
        h('div', { className: 'jx-tablist', role: 'tablist' },
          h('button', { type: 'button', role: 'tab', 'aria-selected': tab === 'poster', className: 'jx-tab' + (tab === 'poster' ? ' is-on' : ''), onClick: function () { setTab('poster'); } }, '🗺️ Family bucket list'),
          h('button', { type: 'button', role: 'tab', 'aria-selected': tab === 'cities', className: 'jx-tab' + (tab === 'cities' ? ' is-on' : ''), onClick: function () { setTab('cities'); } }, '🏙️ City & town lists')),
        tab === 'cities' ? h(BaseBucket) : h(Frag, null,
          h('div', { className: 'jx-row jx-form' },
            h('label', null, 'Title', h('input', { value: d.title, maxLength: 30, onChange: function (e) { var v = e.target.value; set(function (x) { return Object.assign({}, x, { title: v }); }); } })),
            h('label', null, 'Subtitle', h('input', { value: d.subtitle, maxLength: 50, onChange: function (e) { var v = e.target.value; set(function (x) { return Object.assign({}, x, { subtitle: v }); }); } }))),
          h('p', { className: 'jx-muted' }, done + ' of ' + d.items.length + ' adventures done'),
          h('div', { className: 'jx-progress' }, h('span', { style: { width: (d.items.length ? done / d.items.length * 100 : 0) + '%' } })),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'secondary', onClick: function () { var left = d.items.filter(function (i) { return !i.done; }); setPick(left.length ? left[Math.floor(Math.random() * left.length)] : null); } }, '🎲 Pick one for this weekend'),
            pick && h('strong', { role: 'status' }, pick.e + ' ' + pick.t)),
          h('div', { className: 'jx-bucket-grid' }, d.items.map(function (it) {
            return h('div', { key: it.id, className: 'jx-bucket-item' + (it.done ? ' is-done' : '') },
              h('input', { type: 'checkbox', checked: it.done, 'aria-label': 'Done: ' + it.t, onChange: function (e) { upd(it.id, { done: e.target.checked }); } }),
              h('span', { className: 'jx-bucket-e', 'aria-hidden': true }, it.e),
              h('input', { className: 'jx-bucket-t', value: it.t, 'aria-label': 'Adventure', onChange: function (e) { upd(it.id, { t: e.target.value }); } }),
              h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Remove ' + it.t, onClick: function () { set(function (x) { return Object.assign({}, x, { items: x.items.filter(function (y) { return y.id !== it.id; }) }); }); } }, '×'));
          })),
          h('form', { className: 'jx-row jx-form', onSubmit: function (e) { e.preventDefault(); var v = newIdea.trim(); if (!v) return; set(function (x) { return Object.assign({}, x, { items: x.items.concat([{ id: uid(), e: emoji, t: v, done: false }]) }); }); setNewIdea(''); } },
            h('label', null, 'Emoji', h('select', { value: emoji, onChange: function (e) { setEmoji(e.target.value); } }, ['⭐', '🏖️', '🥾', '🚗', '🍦', '🐟', '🌋', '🏔️', '🌿', '🐦', '🎉', '📸', '❤️', '⛪'].map(function (x) { return h('option', { key: x }, x); }))),
            h('label', null, 'Add your own adventure', h('input', { value: newIdea, maxLength: 70, placeholder: 'e.g. Visit Nana in Gisborne', onChange: function (e) { setNewIdea(e.target.value); } })),
            h('button', { type: 'submit', className: 'primary' }, 'Add')),
          h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { if (confirm('Go back to the original 50 ideas? Your own ideas and ticks will be cleared.')) setRaw(null); } }, 'Reset to the 50 ideas')),
          h('section', { className: 'jx-poster-sec' },
            h('h2', null, 'Make your poster'),
            h(ThemePicker, { value: d.theme, designs: DESIGNS, onChange: function (v) { set(function (x) { return Object.assign({}, x, { theme: v }); }); } }),
            h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Bucket list poster preview' })),
            h(ExportBar, { canvasRef: ref, name: 'TheJamesNZ-kiwi-bucket-list', title: d.title })),
          h('p', { className: 'small-note' }, 'Check access, weather, tides, fire bans and track conditions before you go. Stay on marked tracks, take your rubbish home and follow the Water Safety Code.')));
    };
  } catch (e) { console.warn('[JNZX] bucket', e); }

  /* ======================= FLIP-BOOK SHARING ======================= */
  function storyIndexFor(post) {
    if (!post || typeof stories === 'undefined') return -1;
    for (var i = 0; i < stories.length; i++) { var s = stories[i]; if (s && s.paragraphs && post.text === s.paragraphs.join('\n\n')) return i; }
    return -1;
  }
  function isBible(i) { try { return jBibleData.some(function (b) { return b.index === i; }); } catch (e) { return false; } }
  function bookUrl(i) { return JNZX.pageUrl('x:book') + '&story=' + i; }
  function FlipShare(props) {
    var i = props.index, s = stories[i];
    var o = useState(false), open = o[0], setOpen = o[1];
    function openBook() { try { sessionStorage.setItem('jnzx-book-story', String(i)); } catch (e) {} if (JNZX._nav) JNZX._nav('x:book'); else location.href = bookUrl(i); }
    return h('div', { className: 'jx-flipshare' },
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'primary', onClick: function () { setOpen(!open); } }, '📖 Share as flip-book'),
        h('button', { type: 'button', className: 'secondary', onClick: openBook }, 'Preview flip-book')),
      open && h(JNZX.ShareBar, { tab: 'x:book', url: bookUrl(i), title: s.title, text: s.title + ' — a flip-book story from The James NZ', label: 'Send flip-book link' }),
      props.base && h('details', { className: 'jx-more-share' }, h('summary', null, 'Share a picture instead'), h(props.base, { post: props.post })));
  }
  function greetingFor(country) {
    try {
      var c = octCountries.find(function (x) { return x.name === country; }); if (!c) return null;
      var slug = country === 'New Zealand' ? 'maori' : c.slug, l = languages.find(function (x) { return x.slug === slug; });
      var gr = l && l.greetings && l.greetings[0] ? l.greetings[0][1] : octGreetings[slug];
      if (!gr) return null;
      gr = String(gr).split(' · ')[0].replace(/[?!.]+$/, '');
      return { text: gr, lang: l ? l.name : slug.charAt(0).toUpperCase() + slug.slice(1) };
    } catch (e) { return null; }
  }
  try {
    var BasePhotoShare = PhotoShare;
    PhotoShare = function (props) {
      var post = props && props.post || {};
      var si = storyIndexFor(post);
      if (si >= 0) return h(FlipShare, { index: si, post: post, base: BasePhotoShare });
      if (post.filename && /^james-country-/.test(post.filename)) {
        var country = String(post.title || '').replace(/^\S+\s/, '').trim(), gr = greetingFor(country);
        if (gr) { var p2 = Object.assign({}, post, { title: post.title + ' — ' + gr.text + '!', text: 'Say hello in ' + gr.lang + ': ' + gr.text + '!' + (post.text ? '\n' + post.text : ''), credit: 'Hello, World! · The James NZ' }); return h(BasePhotoShare, { post: p2 }); }
      }
      return h(BasePhotoShare, props);
    };
  } catch (e) { console.warn('[JNZX] share', e); }

  function bookPages(i) {
    var s = stories[i], pages = [];
    pages.push({ kind: 'cover', img: s.image, alt: s.imageAlt || s.title, title: s.title, sub: [s.level, s.theme, s.reference].filter(Boolean).join(' · ') });
    s.paragraphs.forEach(function (p, k) { var pic = storyIllustration(i, k + 1) || {}; pages.push({ kind: 'pic', img: pic.image || s.image, alt: pic.alt || '' }); pages.push({ kind: 'text', text: p, n: k + 1 }); });
    pages.push({ kind: 'end', title: 'The End', sub: s.title });
    return pages;
  }
  function Face(props) {
    var p = props.p; if (!p) return h('div', { className: 'jx-fb-face jx-fb-blank' });
    if (p.kind === 'cover') return h('div', { className: 'jx-fb-face jx-fb-cover' }, h('img', { src: p.img, alt: p.alt }), h('div', { className: 'jx-fb-cover-txt' }, h('h2', null, p.title), h('p', null, p.sub), h('small', null, 'The James NZ')));
    if (p.kind === 'pic') return h('div', { className: 'jx-fb-face jx-fb-pic' }, h('img', { src: p.img, alt: p.alt, loading: 'lazy' }));
    if (p.kind === 'text') return h('div', { className: 'jx-fb-face jx-fb-text' }, h('p', null, p.text), h('span', { className: 'jx-fb-num' }, p.n));
    if (p.kind === 'combo') return h('div', { className: 'jx-fb-face jx-fb-combo' }, h('img', { src: p.img, alt: p.alt, loading: 'lazy' }), h('p', null, p.text), h('span', { className: 'jx-fb-num' }, p.n));
    return h('div', { className: 'jx-fb-face jx-fb-end' }, h('h2', null, p.title), h('p', null, p.sub), h('p', null, '✿'), h('small', null, 'thejamesnz.com'));
  }
  function FlipBook(props) {
    var mq = useState(function () { try { return matchMedia('(max-width: 720px)').matches; } catch (e) { return false; } }), single = mq[0], setSingle = mq[1];
    useEffect(function () { try { var m = matchMedia('(max-width: 720px)'), f = function () { setSingle(m.matches); }; m.addEventListener('change', f); return function () { m.removeEventListener('change', f); }; } catch (e) {} }, []);
    var pages = props.pages;
    var faces = useMemo(function () {
      if (!single) { var lv = []; for (var k = 0; k < pages.length; k += 2) lv.push([pages[k], pages[k + 1] || null]); return lv; }
      var out = [], k2 = 0; while (k2 < pages.length) { var p = pages[k2]; if (p.kind === 'pic' && pages[k2 + 1] && pages[k2 + 1].kind === 'text') { out.push([{ kind: 'combo', img: p.img, alt: p.alt, text: pages[k2 + 1].text, n: pages[k2 + 1].n }, null]); k2 += 2; } else { out.push([p, null]); k2++; } }
      return out;
    }, [pages, single]);
    var tn = useState(0), turned = tn[0], setTurned = tn[1];
    var an = useState(-1), anim = an[0], setAnim = an[1];
    useEffect(function () { setTurned(0); }, [single]);
    var n = faces.length;
    function go(dir) { var nt = Math.max(0, Math.min(n - (single ? 1 : 0), turned + dir)); if (nt === turned) return; setAnim(dir > 0 ? turned : nt); setTurned(nt); setTimeout(function () { setAnim(-1); }, 800); }
    useEffect(function () { function k(e) { if (e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) return; if (e.key === 'ArrowRight') go(1); if (e.key === 'ArrowLeft') go(-1); } addEventListener('keydown', k); return function () { removeEventListener('keydown', k); }; });
    var touch = useRef(null);
    var P = pages.filter(function (x) { return x.kind === 'text'; }).length, pos = single ? turned : turned;
    var label = pos === 0 ? 'Cover' : pos > P ? 'The End' : 'Page ' + pos + ' of ' + P;
    return h('div', { className: 'jx-fb jx-keep-colour' + (single ? ' is-single' : '') + (turned === 0 && !single ? ' at-start' : '') + (turned >= n && !single ? ' at-end' : '') },
      h('div', { className: 'jx-fb-book', onTouchStart: function (e) { touch.current = e.touches[0].clientX; }, onTouchEnd: function (e) { if (touch.current == null) return; var dx = e.changedTouches[0].clientX - touch.current; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); touch.current = null; } },
        faces.map(function (f, k) {
          var isT = k < turned, z = k === anim ? 1000 : isT ? k + 1 : n - k + 1;
          return h('div', { key: k, className: 'jx-fb-leaf' + (isT ? ' is-turned' : ''), style: { zIndex: z }, onClick: function () { go(isT ? -1 : 1); } },
            h(Face, { p: f[0] }), h('div', { className: 'jx-fb-back' }, h(Face, { p: f[1] })));
        })),
      h('div', { className: 'jx-fb-nav' },
        h('button', { type: 'button', className: 'secondary', disabled: turned === 0, onClick: function () { go(-1); }, 'aria-label': 'Previous page' }, '‹ Back'),
        h('span', { role: 'status' }, label),
        h('button', { type: 'button', className: 'primary', disabled: turned >= n - (single ? 1 : 0), onClick: function () { go(1); }, 'aria-label': 'Next page' }, 'Turn page ›')));
  }
  JNZX.register('x:book', function BookPage(props) {
    var init = useMemo(function () { var q = hashParam('story'); var ss = null; try { ss = sessionStorage.getItem('jnzx-book-story'); } catch (e) {} var v = parseInt(q != null ? q : ss, 10); return isFinite(v) && stories[v] ? v : 0; }, []);
    var si = useState(init), i = si[0], setI = si[1];
    useEffect(function () { try { sessionStorage.setItem('jnzx-book-story', String(i)); } catch (e) {} }, [i]);
    var s = stories[i], pages = useMemo(function () { return bookPages(i); }, [i]);
    var bible = isBible(i);
    var options = stories.map(function (x, k) { return [k, x.title, isBible(k)]; });
    return h('div', null,
      JNZX.Header(bible ? 'BIBLE STORIES FOR LITTLE HEARTS · FLIP-BOOK' : 'THE STORY NOOK · FLIP-BOOK', s.title, [s.level, s.theme, s.reference].filter(Boolean).join(' · ')),
      h(FlipBook, { key: i, pages: pages }),
      h('div', { className: 'jx-row jx-form' },
        h('label', null, 'Choose another book', h('select', { value: i, onChange: function (e) { setI(+e.target.value); } },
          h('optgroup', { label: 'The Story Nook' }, options.filter(function (o) { return !o[2]; }).map(function (o) { return h('option', { key: o[0], value: o[0] }, o[1]); })),
          h('optgroup', { label: 'Bible Stories for Little Hearts' }, options.filter(function (o) { return o[2]; }).map(function (o) { return h('option', { key: o[0], value: o[0] }, o[1]); })))),
        h('button', { type: 'button', className: 'secondary', onClick: function () { props.navigate(bible ? 'Bible stories for kids' : 'Reading nook'); } }, bible ? 'More Bible stories' : 'Back to The Story Nook')),
      bible && h('p', { className: 'small-note' }, 'An original child-friendly retelling, not a word-for-word Bible translation.'),
      h(JNZX.ShareBar, { tab: 'x:book', url: bookUrl(i), title: s.title, text: s.title + ' — a flip-book story from The James NZ', label: 'Share this flip-book' }));
  });
})();
