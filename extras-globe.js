/* The James NZ — Kiwi Adventures › World Clock globe (October 2026).
   A spinning globe you can drag. Tap a dot to see the date and time there,
   side by side with New Zealand time. Continents are simplified outlines drawn
   for the site; when the visitor is online a more detailed coastline is used. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef;

  // [name, flag, city, lat, lon, IANA time zone]
  var PLACES = [
    ['New Zealand', '🇳🇿', 'Wellington', -41.29, 174.78, 'Pacific/Auckland'],
    ['Australia (Sydney)', '🇦🇺', 'Sydney', -33.87, 151.21, 'Australia/Sydney'],
    ['Australia (Brisbane)', '🇦🇺', 'Brisbane', -27.47, 153.03, 'Australia/Brisbane'],
    ['Australia (Perth)', '🇦🇺', 'Perth', -31.95, 115.86, 'Australia/Perth'],
    ['Australia (Adelaide)', '🇦🇺', 'Adelaide', -34.93, 138.6, 'Australia/Adelaide'],
    ['Fiji', '🇫🇯', 'Suva', -18.14, 178.44, 'Pacific/Fiji'],
    ['Samoa', '🇼🇸', 'Apia', -13.83, -171.76, 'Pacific/Apia'],
    ['Tonga', '🇹🇴', 'Nukuʻalofa', -21.14, -175.2, 'Pacific/Tongatapu'],
    ['Cook Islands', '🇨🇰', 'Avarua', -21.21, -159.78, 'Pacific/Rarotonga'],
    ['Niue', '🇳🇺', 'Alofi', -19.06, -169.92, 'Pacific/Niue'],
    ['French Polynesia', '🇵🇫', 'Papeete', -17.53, -149.57, 'Pacific/Tahiti'],
    ['New Caledonia', '🇳🇨', 'Nouméa', -22.27, 166.45, 'Pacific/Noumea'],
    ['Vanuatu', '🇻🇺', 'Port Vila', -17.73, 168.32, 'Pacific/Efate'],
    ['Solomon Islands', '🇸🇧', 'Honiara', -9.43, 159.95, 'Pacific/Guadalcanal'],
    ['Papua New Guinea', '🇵🇬', 'Port Moresby', -9.44, 147.18, 'Pacific/Port_Moresby'],
    ['Kiribati', '🇰🇮', 'Tarawa', 1.45, 172.98, 'Pacific/Tarawa'],
    ['Tuvalu', '🇹🇻', 'Funafuti', -8.52, 179.2, 'Pacific/Funafuti'],
    ['Hawaiʻi (USA)', '🇺🇸', 'Honolulu', 21.31, -157.86, 'Pacific/Honolulu'],
    ['Philippines', '🇵🇭', 'Manila', 14.6, 120.98, 'Asia/Manila'],
    ['Indonesia', '🇮🇩', 'Jakarta', -6.21, 106.85, 'Asia/Jakarta'],
    ['Malaysia', '🇲🇾', 'Kuala Lumpur', 3.14, 101.69, 'Asia/Kuala_Lumpur'],
    ['Singapore', '🇸🇬', 'Singapore', 1.35, 103.82, 'Asia/Singapore'],
    ['Thailand', '🇹🇭', 'Bangkok', 13.76, 100.5, 'Asia/Bangkok'],
    ['Vietnam', '🇻🇳', 'Hanoi', 21.03, 105.85, 'Asia/Ho_Chi_Minh'],
    ['Cambodia', '🇰🇭', 'Phnom Penh', 11.56, 104.92, 'Asia/Phnom_Penh'],
    ['Myanmar', '🇲🇲', 'Yangon', 16.87, 96.2, 'Asia/Yangon'],
    ['China', '🇨🇳', 'Beijing', 39.9, 116.4, 'Asia/Shanghai'],
    ['Hong Kong', '🇭🇰', 'Hong Kong', 22.32, 114.17, 'Asia/Hong_Kong'],
    ['Taiwan', '🇹🇼', 'Taipei', 25.03, 121.57, 'Asia/Taipei'],
    ['Japan', '🇯🇵', 'Tokyo', 35.68, 139.69, 'Asia/Tokyo'],
    ['South Korea', '🇰🇷', 'Seoul', 37.57, 126.98, 'Asia/Seoul'],
    ['Mongolia', '🇲🇳', 'Ulaanbaatar', 47.89, 106.91, 'Asia/Ulaanbaatar'],
    ['India', '🇮🇳', 'New Delhi', 28.61, 77.21, 'Asia/Kolkata'],
    ['Sri Lanka', '🇱🇰', 'Colombo', 6.93, 79.86, 'Asia/Colombo'],
    ['Nepal', '🇳🇵', 'Kathmandu', 27.72, 85.32, 'Asia/Kathmandu'],
    ['Bangladesh', '🇧🇩', 'Dhaka', 23.81, 90.41, 'Asia/Dhaka'],
    ['Pakistan', '🇵🇰', 'Islamabad', 33.68, 73.05, 'Asia/Karachi'],
    ['Afghanistan', '🇦🇫', 'Kabul', 34.56, 69.21, 'Asia/Kabul'],
    ['Iran', '🇮🇷', 'Tehran', 35.69, 51.39, 'Asia/Tehran'],
    ['United Arab Emirates', '🇦🇪', 'Dubai', 25.2, 55.27, 'Asia/Dubai'],
    ['Qatar', '🇶🇦', 'Doha', 25.29, 51.53, 'Asia/Qatar'],
    ['Saudi Arabia', '🇸🇦', 'Riyadh', 24.71, 46.68, 'Asia/Riyadh'],
    ['Israel', '🇮🇱', 'Jerusalem', 31.77, 35.21, 'Asia/Jerusalem'],
    ['Lebanon', '🇱🇧', 'Beirut', 33.89, 35.5, 'Asia/Beirut'],
    ['Türkiye', '🇹🇷', 'Ankara', 39.93, 32.86, 'Europe/Istanbul'],
    ['Russia (Moscow)', '🇷🇺', 'Moscow', 55.76, 37.62, 'Europe/Moscow'],
    ['Russia (Vladivostok)', '🇷🇺', 'Vladivostok', 43.12, 131.89, 'Asia/Vladivostok'],
    ['Ukraine', '🇺🇦', 'Kyiv', 50.45, 30.52, 'Europe/Kyiv'],
    ['Greece', '🇬🇷', 'Athens', 37.98, 23.73, 'Europe/Athens'],
    ['Italy', '🇮🇹', 'Rome', 41.9, 12.5, 'Europe/Rome'],
    ['Vatican City', '🇻🇦', 'Vatican City', 41.9, 12.45, 'Europe/Vatican'],
    ['Germany', '🇩🇪', 'Berlin', 52.52, 13.4, 'Europe/Berlin'],
    ['France', '🇫🇷', 'Paris', 48.86, 2.35, 'Europe/Paris'],
    ['Spain', '🇪🇸', 'Madrid', 40.42, -3.7, 'Europe/Madrid'],
    ['Portugal', '🇵🇹', 'Lisbon', 38.72, -9.14, 'Europe/Lisbon'],
    ['Netherlands', '🇳🇱', 'Amsterdam', 52.37, 4.9, 'Europe/Amsterdam'],
    ['Switzerland', '🇨🇭', 'Bern', 46.95, 7.45, 'Europe/Zurich'],
    ['Poland', '🇵🇱', 'Warsaw', 52.23, 21.01, 'Europe/Warsaw'],
    ['Sweden', '🇸🇪', 'Stockholm', 59.33, 18.07, 'Europe/Stockholm'],
    ['Norway', '🇳🇴', 'Oslo', 59.91, 10.75, 'Europe/Oslo'],
    ['Finland', '🇫🇮', 'Helsinki', 60.17, 24.94, 'Europe/Helsinki'],
    ['Ireland', '🇮🇪', 'Dublin', 53.35, -6.26, 'Europe/Dublin'],
    ['United Kingdom', '🇬🇧', 'London', 51.51, -0.13, 'Europe/London'],
    ['Iceland', '🇮🇸', 'Reykjavík', 64.15, -21.94, 'Atlantic/Reykjavik'],
    ['Egypt', '🇪🇬', 'Cairo', 30.04, 31.24, 'Africa/Cairo'],
    ['Kenya', '🇰🇪', 'Nairobi', -1.29, 36.82, 'Africa/Nairobi'],
    ['Ethiopia', '🇪🇹', 'Addis Ababa', 9.03, 38.74, 'Africa/Addis_Ababa'],
    ['Nigeria', '🇳🇬', 'Lagos', 6.52, 3.38, 'Africa/Lagos'],
    ['Ghana', '🇬🇭', 'Accra', 5.6, -0.19, 'Africa/Accra'],
    ['Morocco', '🇲🇦', 'Rabat', 34.02, -6.83, 'Africa/Casablanca'],
    ['South Africa', '🇿🇦', 'Johannesburg', -26.2, 28.05, 'Africa/Johannesburg'],
    ['Zimbabwe', '🇿🇼', 'Harare', -17.83, 31.05, 'Africa/Harare'],
    ['Mauritius', '🇲🇺', 'Port Louis', -20.16, 57.5, 'Indian/Mauritius'],
    ['Canada (Toronto)', '🇨🇦', 'Toronto', 43.65, -79.38, 'America/Toronto'],
    ['Canada (Vancouver)', '🇨🇦', 'Vancouver', 49.28, -123.12, 'America/Vancouver'],
    ['USA (New York)', '🇺🇸', 'New York', 40.71, -74.01, 'America/New_York'],
    ['USA (Chicago)', '🇺🇸', 'Chicago', 41.88, -87.63, 'America/Chicago'],
    ['USA (Denver)', '🇺🇸', 'Denver', 39.74, -104.99, 'America/Denver'],
    ['USA (Los Angeles)', '🇺🇸', 'Los Angeles', 34.05, -118.24, 'America/Los_Angeles'],
    ['USA (Alaska)', '🇺🇸', 'Anchorage', 61.22, -149.9, 'America/Anchorage'],
    ['Mexico', '🇲🇽', 'Mexico City', 19.43, -99.13, 'America/Mexico_City'],
    ['Cuba', '🇨🇺', 'Havana', 23.11, -82.37, 'America/Havana'],
    ['Jamaica', '🇯🇲', 'Kingston', 18.02, -76.8, 'America/Jamaica'],
    ['Colombia', '🇨🇴', 'Bogotá', 4.71, -74.07, 'America/Bogota'],
    ['Peru', '🇵🇪', 'Lima', -12.05, -77.04, 'America/Lima'],
    ['Chile', '🇨🇱', 'Santiago', -33.45, -70.67, 'America/Santiago'],
    ['Argentina', '🇦🇷', 'Buenos Aires', -34.6, -58.38, 'America/Argentina/Buenos_Aires'],
    ['Brazil', '🇧🇷', 'São Paulo', -23.55, -46.63, 'America/Sao_Paulo'],
    ['Antarctica (Scott Base)', '🇦🇶', 'Scott Base', -77.85, 166.76, 'Antarctica/McMurdo']
  ];
  // Simplified continents [lon, lat], drawn for the site
  var LAND = [
    [[-168,66],[-162,70],[-156,71],[-140,70],[-128,70],[-115,68],[-100,68],[-95,72],[-85,70],[-80,63],[-90,58],[-94,59],[-82,52],[-78,55],[-77,60],[-70,59],[-65,60],[-60,55],[-56,52],[-60,47],[-66,45],[-70,42],[-74,40],[-76,35],[-81,31],[-80,26],[-82,26],[-83,29],[-90,30],[-94,29],[-97,26],[-97,21],[-95,18],[-90,21],[-87,21],[-88,16],[-84,15],[-83,10],[-79,9],[-80,7],[-85,10],[-87,13],[-92,14],[-97,16],[-105,20],[-106,23],[-110,24],[-112,29],[-115,31],[-117,32],[-120,34],[-124,40],[-124,46],[-125,49],[-130,54],[-135,58],[-140,60],[-146,61],[-152,59],[-158,57],[-162,55],[-158,59],[-165,61],[-166,64]],
    [[-73,78],[-60,82],[-35,83],[-20,80],[-18,75],[-22,70],[-30,68],[-40,65],[-44,60],[-50,63],[-53,67],[-56,71],[-60,76]],
    [[-80,73],[-68,70],[-62,66],[-73,64],[-80,68]], [[-118,72],[-100,73],[-102,69],[-112,68]], [[-90,81],[-65,82],[-75,77],[-90,77]],
    [[-85,22],[-80,23],[-75,20],[-78,20]], [[-74,19],[-69,19],[-69,18],[-74,18]],
    [[-80,8],[-77,8],[-72,12],[-64,10],[-60,8],[-52,5],[-50,0],[-44,-2],[-35,-5],[-35,-9],[-39,-14],[-41,-22],[-48,-26],[-53,-34],[-58,-38],[-62,-39],[-65,-42],[-67,-46],[-69,-51],[-68,-55],[-72,-53],[-74,-47],[-73,-40],[-71,-30],[-70,-18],[-76,-14],[-80,-6],[-81,-2],[-80,1],[-78,4]],
    [[-10,36],[-9,39],[-9,43],[-2,43],[-1,46],[-4,48],[2,51],[5,53],[8,54],[8,57],[11,58],[6,58],[5,61],[10,64],[14,67],[18,69],[25,71],[31,70],[40,68],[44,66],[52,68],[60,69],[66,69],[60,60],[60,50],[50,47],[48,42],[40,41],[29,41],[26,40],[23,36],[20,40],[19,42],[13,45],[16,41],[12,38],[10,44],[7,44],[3,43],[0,39],[-5,36]],
    [[-5,50],[1,51],[2,53],[0,54],[-2,56],[-2,58],[-5,58],[-6,56],[-5,55],[-3,54],[-4,52]], [[-10,52],[-6,52],[-6,55],[-8,55],[-10,54]], [[-24,64],[-22,66],[-15,66],[-13,65],[-18,63]],
    [[-17,21],[-13,28],[-10,30],[-6,35],[0,36],[10,37],[11,33],[20,31],[25,32],[32,31],[35,28],[37,22],[39,16],[43,12],[51,12],[51,10],[48,5],[42,-1],[40,-5],[40,-10],[36,-18],[35,-24],[33,-28],[30,-31],[26,-34],[20,-35],[18,-33],[16,-28],[12,-18],[13,-12],[12,-5],[9,-1],[9,4],[5,5],[0,5],[-5,5],[-8,4],[-13,8],[-17,12],[-17,15]],
    [[44,-25],[47,-25],[50,-15],[49,-12],[44,-16]],
    [[26,40],[36,36],[35,33],[34,28],[39,21],[43,13],[45,13],[52,16],[57,19],[59,23],[56,26],[50,30],[48,30],[52,27],[57,25],[62,25],[67,24],[72,21],[73,16],[77,8],[80,10],[80,15],[87,21],[92,22],[94,17],[98,16],[98,8],[101,3],[104,1],[103,6],[101,13],[105,9],[109,12],[108,16],[106,20],[109,21],[113,22],[117,23],[120,26],[122,30],[121,32],[119,35],[122,37],[118,38],[121,40],[125,40],[129,35],[129,38],[129,42],[135,43],[140,48],[141,53],[136,54],[143,59],[155,59],[160,61],[163,66],[175,66],[180,66],[180,70],[160,70],[150,72],[140,72],[130,71],[113,74],[105,78],[100,76],[88,75],[80,73],[70,73],[66,69],[60,69],[60,60],[60,50],[50,47],[48,42],[40,41],[29,41]],
    [[156,51],[160,54],[163,57],[162,61],[156,58]],
    [[130,31],[132,34],[135,34],[140,35],[141,38],[142,41],[140,41],[140,38],[137,37],[133,35],[130,33]], [[140,42],[145,43],[143,45],[141,45]],
    [[80,6],[82,7],[81,9],[80,9]], [[120,22],[122,25],[121,25]],
    [[95,5],[98,4],[104,-2],[106,-6],[102,-4]], [[105,-6],[114,-7],[114,-8],[106,-7]], [[109,1],[110,-3],[116,-4],[118,1],[119,5],[117,7],[113,4]], [[119,-5],[121,-2],[124,1],[121,1],[120,-1]],
    [[131,-1],[138,-2],[146,-6],[150,-10],[143,-9],[138,-8],[132,-4]], [[120,18],[122,18],[124,13],[126,8],[126,6],[122,7],[123,11],[120,14]],
    [[113,-22],[114,-26],[115,-34],[118,-35],[123,-34],[131,-31],[135,-35],[138,-35],[140,-38],[146,-39],[150,-37],[153,-31],[153,-25],[149,-21],[146,-18],[145,-15],[142,-11],[141,-14],[141,-17],[136,-15],[137,-12],[132,-11],[130,-13],[125,-14],[122,-17],[119,-20]],
    [[145,-41],[148,-41],[148,-43],[146,-44]],
    [[172.7,-34.4],[174.5,-36],[175.5,-36.5],[178.5,-37.7],[177.9,-39.2],[176.9,-39.7],[176,-41.3],[174.8,-41.5],[174.5,-40],[173.8,-39.2],[174.6,-38.5],[174.6,-37],[173,-35]],
    [[172.5,-40.5],[174.3,-41.7],[173.2,-43],[172.6,-43.8],[171.2,-44.5],[170.8,-45.9],[169,-46.6],[166.5,-46],[166.7,-45.2],[168.2,-44],[170.5,-43],[171.5,-41.8],[172.1,-40.8]],
    [[-180,-70],[-120,-73],[-60,-64],[-30,-77],[0,-70],[60,-67],[120,-66],[180,-70],[180,-90],[-180,-90]]
  ];
  var MW = 720, MH = 360, mask = null;
  function buildMask(polys) {
    var c = document.createElement('canvas'); c.width = MW; c.height = MH;
    var g = c.getContext('2d'); g.fillStyle = '#000'; g.fillRect(0, 0, MW, MH); g.fillStyle = '#fff';
    polys.forEach(function (ring) {
      g.beginPath();
      ring.forEach(function (p, i) { var x = (p[0] + 180) / 360 * MW, y = (90 - p[1]) / 180 * MH; if (i) g.lineTo(x, y); else g.moveTo(x, y); });
      g.closePath(); g.fill();
    });
    var d = g.getImageData(0, 0, MW, MH).data, m = new Uint8Array(MW * MH);
    for (var i = 0; i < m.length; i++) m[i] = d[i * 4] > 127 ? 1 : 0;
    return m;
  }
  // Optional detailed coastline (Natural Earth via world-atlas) when online
  function topoRings(topo) {
    var t = topo.transform, arcs = topo.arcs.map(function (a) { var x = 0, y = 0; return a.map(function (p) { x += p[0]; y += p[1]; return [x * t.scale[0] + t.translate[0], y * t.scale[1] + t.translate[1]]; }); });
    function arc(i) { return i < 0 ? arcs[~i].slice().reverse() : arcs[i]; }
    var out = [];
    function geom(gm) {
      if (gm.type === 'GeometryCollection') return gm.geometries.forEach(geom);
      var polys = gm.type === 'Polygon' ? [gm.arcs] : gm.type === 'MultiPolygon' ? gm.arcs : [];
      polys.forEach(function (poly) { poly.forEach(function (ring) { var pts = []; ring.forEach(function (ai) { var a = arc(ai); pts = pts.concat(pts.length ? a.slice(1) : a); }); out.push(pts); }); });
    }
    geom(topo.objects.land);
    return out;
  }
  var detailTried = false;
  function loadDetail(done) {
    if (detailTried) return; detailTried = true;
    try {
      fetch('https://cdn.jsdelivr.net/npm/world-atlas@2.0.2/land-110m.json').then(function (r) { if (!r.ok) throw Error(); return r.json(); })
        .then(function (topo) { var rings = topoRings(topo).filter(function (r) { return r.length > 3; }); if (rings.length > 20) { mask = buildMask(rings); done(); } }).catch(function () {});
    } catch (e) {}
  }

  var D2R = Math.PI / 180;
  function project(lat, lon, lat0, lon0) {
    var p = lat * D2R, l = (lon - lon0) * D2R, p0 = lat0 * D2R;
    var cosc = Math.sin(p0) * Math.sin(p) + Math.cos(p0) * Math.cos(p) * Math.cos(l);
    return { x: Math.cos(p) * Math.sin(l), y: Math.cos(p0) * Math.sin(p) - Math.sin(p0) * Math.cos(p) * Math.cos(l), vis: cosc > 0.02 };
  }
  function render(cv, view, sel, dark) {
    var S = cv.width, r = S / 2 - 4, cx = S / 2, cy = S / 2, g = cv.getContext('2d');
    if (!mask) mask = buildMask(LAND);
    var img = g.createImageData(S, S), d = img.data;
    var p0 = view.lat * D2R, sp0 = Math.sin(p0), cp0 = Math.cos(p0), l0 = view.lon * D2R;
    for (var py = 0; py < S; py++) {
      var y = (cy - py) / r;
      for (var px = 0; px < S; px++) {
        var x = (px - cx) / r, rho2 = x * x + y * y, o = (py * S + px) * 4;
        if (rho2 > 1) { continue; }
        var rho = Math.sqrt(rho2), c = Math.asin(Math.min(1, rho)), sc = Math.sin(c), cc = Math.cos(c);
        var lat = rho < 1e-9 ? p0 : Math.asin(cc * sp0 + (y * sc * cp0) / rho);
        var lon = l0 + Math.atan2(x * sc, rho * cc * cp0 - y * sc * sp0);
        var LON = ((lon / D2R + 540) % 360) - 180, LAT = lat / D2R;
        var mx = Math.min(MW - 1, Math.max(0, Math.floor((LON + 180) / 360 * MW))), my = Math.min(MH - 1, Math.max(0, Math.floor((90 - LAT) / 180 * MH)));
        var land = mask[my * MW + mx], shade = 0.55 + 0.45 * cc;
        var grid = (Math.abs(LAT % 15) < 0.35 || Math.abs(LON % 15) < 0.35) ? 0.9 : 1;
        var R0, G0, B0;
        if (land) { if (LAT < -62) { R0 = 236; G0 = 242; B0 = 246; } else { R0 = 120 + 40 * (LAT > 50 ? 1 : 0); G0 = 182; B0 = 112; } }
        else { R0 = 52; G0 = 132; B0 = 196; }
        d[o] = R0 * shade * grid; d[o + 1] = G0 * shade * grid; d[o + 2] = B0 * shade * grid; d[o + 3] = 255;
      }
    }
    g.clearRect(0, 0, S, S); g.putImageData(img, 0, 0);
    // rim and glow
    g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.lineWidth = 2; g.strokeStyle = dark ? 'rgba(255,255,255,.35)' : 'rgba(20,60,90,.35)'; g.stroke();
    var hl = g.createRadialGradient(cx - r * 0.4, cy - r * 0.45, r * 0.05, cx - r * 0.3, cy - r * 0.3, r * 1.1);
    hl.addColorStop(0, 'rgba(255,255,255,.28)'); hl.addColorStop(1, 'rgba(255,255,255,0)'); g.fillStyle = hl; g.beginPath(); g.arc(cx, cy, r, 0, Math.PI * 2); g.fill();
    // places
    var dots = [];
    PLACES.forEach(function (pl, i) {
      var q = project(pl[3], pl[4], view.lat, view.lon); if (!q.vis) return;
      var X = cx + q.x * r, Y = cy - q.y * r, isNZ = i === 0, isSel = sel === i;
      g.beginPath(); g.arc(X, Y, isSel ? 7 : isNZ ? 6 : 4.2, 0, Math.PI * 2);
      g.fillStyle = isSel ? '#ffcf33' : isNZ ? '#ff5a5f' : '#ffffff'; g.fill();
      g.lineWidth = 1.5; g.strokeStyle = 'rgba(0,0,0,.55)'; g.stroke();
      if (isSel || isNZ) { g.font = '600 ' + Math.round(S / 26) + 'px system-ui, sans-serif'; g.fillStyle = '#fff'; g.strokeStyle = 'rgba(0,0,0,.7)'; g.lineWidth = 3; var lab = isNZ ? 'NZ' : pl[2]; g.strokeText(lab, X + 9, Y - 8); g.fillText(lab, X + 9, Y - 8); }
      dots.push({ i: i, x: X, y: Y });
    });
    return dots;
  }

  function parts(date, tz) {
    var f = new Intl.DateTimeFormat('en-NZ', { timeZone: tz, year: 'numeric', month: 'numeric', day: 'numeric', hour: 'numeric', minute: 'numeric', hourCycle: 'h23' }).formatToParts(date), o = {};
    f.forEach(function (p) { o[p.type] = p.value; });
    return Date.UTC(+o.year, +o.month - 1, +o.day, +o.hour % 24, +o.minute);
  }
  function show(date, tz) {
    return new Intl.DateTimeFormat('en-NZ', { timeZone: tz, weekday: 'short', day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true }).format(date).replace(/\b(am|pm)\b/i, function (m) { return m.toLowerCase(); });
  }
  function diffText(date, tz) {
    var m = Math.round((parts(date, tz) - parts(date, 'Pacific/Auckland')) / 60000);
    if (m === 0) return 'Same time as New Zealand';
    var a = Math.abs(m), hh = Math.floor(a / 60), mm = a % 60;
    return (hh ? hh + ' hour' + (hh === 1 ? '' : 's') : '') + (mm ? (hh ? ' ' : '') + mm + ' min' : '') + (m < 0 ? ' behind' : ' ahead of') + ' New Zealand';
  }
  function nzLabel(date) {
    try { var n = new Intl.DateTimeFormat('en-NZ', { timeZone: 'Pacific/Auckland', timeZoneName: 'short' }).formatToParts(date).find(function (p) { return p.type === 'timeZoneName'; }); return n ? n.value : 'NZT'; } catch (e) { return 'NZT'; }
  }

  function WorldGlobe(props) {
    var cvRef = useRef(null), dotsRef = useRef([]), viewRef = useRef({ lat: -15, lon: 150 }), drag = useRef(null), spin = useRef(true), frame = useRef(0);
    var st = useState(18), sel = st[0], setSel = st[1];
    var nw = useState(Date.now()), now = nw[0], setNow = nw[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var dark = (function () { try { return document.documentElement.getAttribute('data-reading-theme') === 'dark'; } catch (e) { return false; } })();
    useEffect(function () { var id = setInterval(function () { setNow(Date.now()); }, 15000); return function () { clearInterval(id); }; }, []);
    useEffect(function () {
      var cv = cvRef.current; if (!cv) return;
      var alive = true, target = null;
      function draw() { dotsRef.current = render(cv, viewRef.current, selRef.current, dark); }
      function loop() {
        if (!alive) return;
        var v = viewRef.current;
        if (target) {
          var dl = ((target.lon - v.lon + 540) % 360) - 180, dp = target.lat - v.lat;
          v.lon += dl * 0.12; v.lat += dp * 0.12;
          if (Math.abs(dl) < 0.3 && Math.abs(dp) < 0.3) target = null;
          draw();
        } else if (spin.current && !drag.current) { v.lon = ((v.lon + 0.25 + 540) % 360) - 180; draw(); }
        frame.current = requestAnimationFrame(loop);
      }
      cv._goto = function (i) { spin.current = false; target = { lat: Math.max(-60, Math.min(60, PLACES[i][3])), lon: PLACES[i][4] }; };
      cv._draw = draw;
      draw(); loop();
      loadDetail(draw);
      var reduce = false; try { reduce = matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}
      if (reduce) spin.current = false;
      return function () { alive = false; cancelAnimationFrame(frame.current); };
    }, []);
    var selRef = useRef(sel); selRef.current = sel;
    useEffect(function () { var cv = cvRef.current; if (cv && cv._draw) cv._draw(); }, [sel]);
    function pos(e) { var cv = cvRef.current, b = cv.getBoundingClientRect(); return { x: (e.clientX - b.left) * cv.width / b.width, y: (e.clientY - b.top) * cv.height / b.height }; }
    function down(e) { var p = pos(e); drag.current = { x: p.x, y: p.y, lat: viewRef.current.lat, lon: viewRef.current.lon, moved: false }; spin.current = false; try { e.target.setPointerCapture(e.pointerId); } catch (x) {} }
    function move(e) {
      var d = drag.current; if (!d) return; var p = pos(e), k = 180 / (cvRef.current.width);
      if (Math.abs(p.x - d.x) + Math.abs(p.y - d.y) > 4) d.moved = true;
      viewRef.current.lon = ((d.lon - (p.x - d.x) * k + 540) % 360) - 180; viewRef.current.lat = Math.max(-75, Math.min(75, d.lat + (p.y - d.y) * k));
      cvRef.current._draw();
    }
    function up(e) {
      var d = drag.current; drag.current = null; if (!d || d.moved) return;
      var p = pos(e), best = null, bd = 1e9;
      dotsRef.current.forEach(function (o) { var dd = (o.x - p.x) * (o.x - p.x) + (o.y - p.y) * (o.y - p.y); if (dd < bd) { bd = dd; best = o; } });
      if (best && bd < 22 * 22 * (cvRef.current.width / 360) * (cvRef.current.width / 360)) { setSel(best.i); }
    }
    function choose(i) { setSel(i); if (cvRef.current && cvRef.current._goto) cvRef.current._goto(i); }
    var P = PLACES[sel], date = new Date(now), nz = show(date, 'Pacific/Auckland'), there = show(date, P[5]);
    var list = PLACES.map(function (p, i) { return [p, i]; }).filter(function (x) { return !qq || (x[0][0] + ' ' + x[0][2]).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
    var shareText = P[1] + ' ' + P[0] + ' (' + P[2] + '): ' + there + '\n🇳🇿 ' + nzLabel(date) + ': ' + nz;
    return h('section', { className: 'jx-globe' + (props.compact ? ' is-compact' : '') },
      h('div', { className: 'jx-globe-head' }, h('h2', null, '🌏 World clock'), h('p', { className: 'jx-muted' }, 'Spin the globe and tap a dot to see the time there and in New Zealand.')),
      h('div', { className: 'jx-globe-body' },
        h('div', { className: 'jx-globe-stage' },
          h('canvas', { ref: cvRef, width: 360, height: 360, className: 'jx-globe-canvas', role: 'img', 'aria-label': 'Globe showing ' + P[0], onPointerDown: down, onPointerMove: move, onPointerUp: up, onPointerCancel: function () { drag.current = null; } }),
          h('div', { className: 'jx-row jx-globe-ctl' },
            h('button', { type: 'button', className: 'secondary', onClick: function () { spin.current = !spin.current; } }, '⟳ Spin'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { choose(0); } }, '🇳🇿 Home'))),
        h('div', { className: 'jx-globe-info', 'aria-live': 'polite' },
          h('div', { className: 'jx-globe-card is-there' }, h('small', null, P[1] + ' ' + P[0].toUpperCase()), h('strong', null, there), h('span', null, P[2])),
          h('div', { className: 'jx-globe-card is-nz' }, h('small', null, '🇳🇿 ' + nzLabel(date) + ' · NEW ZEALAND'), h('strong', null, nz), h('span', null, sel === 0 ? 'You’re home!' : diffText(date, P[5]))),
          h('div', { className: 'jx-row' }, h(JNZX.ShareMini, { title: 'Time in ' + P[0], text: shareText, label: 'Share these times' })),
          h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Find a country or city' }),
          h('div', { className: 'jx-globe-list' }, list.map(function (x) {
            return h('button', { key: x[1], type: 'button', className: 'jx-chip' + (x[1] === sel ? ' is-on' : ''), onClick: function () { choose(x[1]); } }, x[0][1] + ' ' + x[0][0]);
          })))));
  }
  JNZX.WorldGlobe = WorldGlobe;
  JNZX.register('x:world-clock', function WorldClockPage(props) {
    return h('div', null, JNZX.Header('KIWI ADVENTURES · WORLD CLOCK', 'What time is it there?', 'Keep in touch with whānau and friends overseas — check their time before you call.'), h(WorldGlobe, {}), h(JNZX.ShareBar, { tab: props.tab }));
  });
})();
