/* The James NZ — maths engine for the calculators (October 2026).
   A safe expression parser (no eval) with scientific functions, statistics,
   distributions, equation solving, matrices and number formatting. */
(function (root) {
  'use strict';
  var M = {};

  /* ---------- tokenizer ---------- */
  var FUNCS = {
    sin: 1, cos: 1, tan: 1, asin: 1, acos: 1, atan: 1, sinh: 1, cosh: 1, tanh: 1, asinh: 1, acosh: 1, atanh: 1,
    sec: 1, csc: 1, cot: 1, log: 1, ln: 1, sqrt: 1, cbrt: 1, abs: 1, exp: 1, floor: 1, ceil: 1, round: 1, int: 1, frac: 1, sign: 1,
    root: 2, logb: 2, nPr: 2, nCr: 2, gcd: 2, lcm: 2, mod: 2, max: -1, min: -1, ranint: 2, rand: 0, pol: 2, rec: 2,
    deg: 1, rad: 1, factorial: 1
  };
  var ALIASES = { 'sin⁻¹': 'asin', 'cos⁻¹': 'acos', 'tan⁻¹': 'atan', arcsin: 'asin', arccos: 'acos', arctan: 'atan', '√': 'sqrt', '∛': 'cbrt', Abs: 'abs', Int: 'int', Frac: 'frac', Ran: 'rand', RanInt: 'ranint', Pol: 'pol', Rec: 'rec' };
  function tokenize(src) {
    var s = String(src).replace(/[×✕]/g, '*').replace(/÷/g, '/').replace(/[−–]/g, '-').replace(/\s+/g, ' ').replace(/⁻¹/g, '⁻¹');
    var out = [], i = 0;
    while (i < s.length) {
      var c = s[i];
      if (c === ' ') { i++; continue; }
      var num = /^(\d+\.?\d*|\.\d+)(E[+-]?\d+)?/.exec(s.slice(i));
      if (num) { out.push({ t: 'num', v: parseFloat(num[0]) }); i += num[0].length; continue; }
      if (c === 'π') { out.push({ t: 'const', v: 'pi' }); i++; continue; }
      if (c === '√' || c === '∛') { out.push({ t: 'func', v: c === '√' ? 'sqrt' : 'cbrt' }); i++; continue; }
      if (c === '°') { out.push({ t: 'post', v: 'deg' }); i++; continue; }
      if ('+-*/^(),!%'.indexOf(c) >= 0) { out.push({ t: c === '(' || c === ')' || c === ',' ? c : (c === '!' || c === '%' ? 'post' : 'op'), v: c }); i++; continue; }
      if (c === '²') { out.push({ t: 'op', v: '^' }); out.push({ t: 'num', v: 2 }); i++; continue; }
      if (c === '³') { out.push({ t: 'op', v: '^' }); out.push({ t: 'num', v: 3 }); i++; continue; }
      var id = /^[A-Za-z_]+(⁻¹)?/.exec(s.slice(i));
      if (id) {
        var w = id[0]; i += w.length;
        if (ALIASES[w]) w = ALIASES[w];
        if (FUNCS[w] !== undefined) { out.push({ t: 'func', v: w }); continue; }
        if (w === 'pi') { out.push({ t: 'const', v: 'pi' }); continue; }
        if (w === 'e' ) { out.push({ t: 'const', v: 'e' }); continue; }
        if (w === 'Ans' || w === 'ans') { out.push({ t: 'var', v: 'Ans' }); continue; }
        if (/^[A-Fa-fMxyzXYZθt]$/.test(w) || w === 'theta') { out.push({ t: 'var', v: w === 'theta' ? 'θ' : (/^[xyzt]$/.test(w) ? w : w.toUpperCase() === w ? w : w) }); continue; }
        // split multi-letter unknown words into single variables, e.g. "xy" → x*y
        var ok = true;
        for (var k = 0; k < w.length; k++) if (!/[A-FMxyzXYZt]/.test(w[k])) ok = false;
        if (ok) { for (var k2 = 0; k2 < w.length; k2++) out.push({ t: 'var', v: w[k2] }); continue; }
        throw Error('Syntax ERROR: unknown name “' + w + '”');
      }
      if (c === 'θ') { out.push({ t: 'var', v: 'θ' }); i++; continue; }
      throw Error('Syntax ERROR at “' + c + '”');
    }
    // implicit multiplication
    var res = [];
    for (var j = 0; j < out.length; j++) {
      var a = res[res.length - 1], b = out[j];
      if (a && (a.t === 'num' || a.t === 'const' || a.t === 'var' || a.t === ')' || (a.t === 'post')) && (b.t === 'num' || b.t === 'const' || b.t === 'var' || b.t === '(' || b.t === 'func')) res.push({ t: 'op', v: 'imul' });
      res.push(b);
    }
    return res;
  }

  /* ---------- Pratt parser → AST ---------- */
  var BP = { '+': 10, '-': 10, '*': 20, '/': 20, 'imul': 25, '^': 40 };
  function parse(src) {
    var toks = tokenize(src), p = 0;
    function peek() { return toks[p]; }
    function next() { return toks[p++]; }
    function expect(t) { var x = next(); if (!x || x.t !== t) throw Error('Syntax ERROR: missing “' + t + '”'); return x; }
    function nud(tok) {
      if (!tok) throw Error('Syntax ERROR: incomplete expression');
      if (tok.t === 'num') return { k: 'num', v: tok.v };
      if (tok.t === 'const') return { k: 'const', v: tok.v };
      if (tok.t === 'var') return { k: 'var', v: tok.v };
      if (tok.t === '(') { var e = expr(0); if (peek() && peek().t === ')') next(); return e; } // allow missing ) at end like Casio
      if (tok.t === 'op' && (tok.v === '-' || tok.v === '+')) { var r = expr(30); return tok.v === '-' ? { k: 'neg', a: r } : r; }
      if (tok.t === 'func') {
        var args = [];
        if (peek() && peek().t === '(') {
          next();
          if (peek() && peek().t === ')') { next(); }
          else {
            args.push(expr(0));
            while (peek() && peek().t === ',') { next(); args.push(expr(0)); }
            if (peek() && peek().t === ')') next();
          }
        } else if (FUNCS[tok.v] !== 0) {
          args.push(expr(30)); // e.g. sin30, √2
        }
        return { k: 'call', f: tok.v, args: args };
      }
      throw Error('Syntax ERROR near “' + (tok.v || tok.t) + '”');
    }
    function expr(rbp) {
      var left = nud(next());
      for (;;) {
        var t = peek();
        if (!t) break;
        if (t.t === 'post') { next(); left = { k: 'post', op: t.v, a: left }; continue; }
        if (t.t !== 'op') break;
        var bp = BP[t.v];
        if (bp <= rbp) break;
        next();
        var right = expr(t.v === '^' ? bp - 1 : bp);
        left = { k: 'bin', op: t.v, a: left, b: right };
      }
      return left;
    }
    var ast = expr(0);
    while (peek() && peek().t === ')') next();
    if (p < toks.length) throw Error('Syntax ERROR near “' + (toks[p].v || toks[p].t) + '”');
    return ast;
  }

  /* ---------- evaluation ---------- */
  function fact(n) {
    if (n < 0 || n !== Math.floor(n)) return gamma(n + 1);
    if (n > 170) return Infinity;
    var r = 1; for (var i = 2; i <= n; i++) r *= i; return r;
  }
  function gamma(z) { // Lanczos
    if (z < 0.5) return Math.PI / (Math.sin(Math.PI * z) * gamma(1 - z));
    z -= 1; var g = 7, c = [0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059, 12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7];
    var x = c[0]; for (var i = 1; i < g + 2; i++) x += c[i] / (z + i);
    var t = z + g + 0.5; return Math.sqrt(2 * Math.PI) * Math.pow(t, z + 0.5) * Math.exp(-t) * x;
  }
  function gcd(a, b) { a = Math.abs(Math.round(a)); b = Math.abs(Math.round(b)); while (b) { var t = b; b = a % b; a = t; } return a; }
  function toRad(x, mode) { return mode === 'deg' ? x * Math.PI / 180 : mode === 'grad' ? x * Math.PI / 200 : x; }
  function fromRad(x, mode) { return mode === 'deg' ? x * 180 / Math.PI : mode === 'grad' ? x * 200 / Math.PI : x; }
  function clean(x) { return Math.abs(x) < 1e-13 ? 0 : x; }
  function evaluate(ast, env) {
    env = env || {};
    var mode = env.angle || 'deg', vars = env.vars || {};
    function ev(n) {
      switch (n.k) {
        case 'num': return n.v;
        case 'const': return n.v === 'pi' ? Math.PI : Math.E;
        case 'var': if (vars[n.v] === undefined) return 0; return vars[n.v];
        case 'neg': return -ev(n.a);
        case 'post': var a = ev(n.a); return n.op === '!' ? fact(a) : n.op === '%' ? a / 100 : n.op === 'deg' ? (mode === 'rad' ? a * Math.PI / 180 : mode === 'grad' ? a * 200 / 180 : a) : a;
        case 'bin':
          var x = ev(n.a), y = ev(n.b);
          switch (n.op) {
            case '+': return x + y; case '-': return x - y; case '*': case 'imul': return x * y;
            case '/': if (y === 0) throw Error('Math ERROR: division by zero'); return x / y;
            case '^': if (x < 0 && Math.abs(y) < 1 && y !== 0) { var inv = 1 / y; if (Math.abs(inv - Math.round(inv)) < 1e-9 && Math.round(inv) % 2 === 1) return -Math.pow(-x, y); } return Math.pow(x, y);
          }
          break;
        case 'call':
          var A = n.args.map(ev), f = n.f, v = A[0];
          var need = FUNCS[f];
          if (need > 0 && A.length < need) throw Error('Syntax ERROR: ' + f + ' needs ' + need + ' value' + (need > 1 ? 's' : ''));
          switch (f) {
            case 'sin': return clean(Math.sin(toRad(v, mode)));
            case 'cos': return clean(Math.cos(toRad(v, mode)));
            case 'tan': var c = Math.cos(toRad(v, mode)); if (Math.abs(c) < 1e-13) throw Error('Math ERROR: tan is undefined here'); return clean(Math.tan(toRad(v, mode)));
            case 'sec': return 1 / Math.cos(toRad(v, mode));
            case 'csc': return 1 / Math.sin(toRad(v, mode));
            case 'cot': return 1 / Math.tan(toRad(v, mode));
            case 'asin': if (Math.abs(v) > 1) throw Error('Math ERROR: sin⁻¹ needs −1 ≤ x ≤ 1'); return fromRad(Math.asin(v), mode);
            case 'acos': if (Math.abs(v) > 1) throw Error('Math ERROR: cos⁻¹ needs −1 ≤ x ≤ 1'); return fromRad(Math.acos(v), mode);
            case 'atan': return fromRad(Math.atan(v), mode);
            case 'sinh': return Math.sinh(v); case 'cosh': return Math.cosh(v); case 'tanh': return Math.tanh(v);
            case 'asinh': return Math.asinh(v); case 'acosh': return Math.acosh(v); case 'atanh': return Math.atanh(v);
            case 'log': if (A.length === 2) return Math.log(A[1]) / Math.log(A[0]); if (v <= 0) throw Error('Math ERROR: log needs a positive number'); return Math.log10(v);
            case 'logb': return Math.log(A[1]) / Math.log(A[0]);
            case 'ln': if (v <= 0) throw Error('Math ERROR: ln needs a positive number'); return Math.log(v);
            case 'sqrt': if (v < 0) throw Error('Math ERROR: √ of a negative number (use Complex in a CAS)'); return Math.sqrt(v);
            case 'cbrt': return Math.cbrt(v);
            case 'root': return A[0] % 2 === 1 && A[1] < 0 ? -Math.pow(-A[1], 1 / A[0]) : Math.pow(A[1], 1 / A[0]);
            case 'abs': return Math.abs(v); case 'exp': return Math.exp(v);
            case 'floor': return Math.floor(v); case 'ceil': return Math.ceil(v); case 'round': return A.length > 1 ? Math.round(v * Math.pow(10, A[1])) / Math.pow(10, A[1]) : Math.round(v);
            case 'int': return Math.trunc(v); case 'frac': return v - Math.trunc(v); case 'sign': return Math.sign(v);
            case 'factorial': return fact(v);
            case 'nPr': return fact(A[0]) / fact(A[0] - A[1]);
            case 'nCr': return Math.round(fact(A[0]) / (fact(A[1]) * fact(A[0] - A[1])));
            case 'gcd': return gcd(A[0], A[1]);
            case 'lcm': return Math.abs(Math.round(A[0]) * Math.round(A[1])) / gcd(A[0], A[1]);
            case 'mod': return ((A[0] % A[1]) + A[1]) % A[1];
            case 'max': return Math.max.apply(null, A); case 'min': return Math.min.apply(null, A);
            case 'rand': return Math.random();
            case 'ranint': return Math.floor(Math.random() * (Math.floor(A[1]) - Math.ceil(A[0]) + 1)) + Math.ceil(A[0]);
            case 'pol': var r = Math.hypot(A[0], A[1]); vars.X = r; vars.Y = fromRad(Math.atan2(A[1], A[0]), mode); return r;
            case 'rec': var xx = A[0] * Math.cos(toRad(A[1], mode)); vars.X = xx; vars.Y = A[0] * Math.sin(toRad(A[1], mode)); return xx;
            case 'deg': return v * 180 / Math.PI; case 'rad': return v * Math.PI / 180;
          }
      }
      throw Error('Syntax ERROR');
    }
    var out = ev(ast);
    if (typeof out !== 'number' || isNaN(out)) throw Error('Math ERROR');
    if (!isFinite(out)) throw Error('Math ERROR: result too large');
    return out;
  }
  M.parse = parse;
  M.evaluate = evaluate;
  M.calc = function (src, env) { return evaluate(parse(src), env); };
  /* Compile f(var) for graphing / tables */
  M.compile = function (src, variable, angle) {
    var ast = parse(src), v = variable || 'x';
    return function (x, extra) { var vars = Object.assign({}, extra || {}); vars[v] = x; if (v === 'x') vars.X = x; try { return evaluate(ast, { angle: angle || 'rad', vars: vars }); } catch (e) { return NaN; } };
  };

  /* ---------- formatting ---------- */
  M.format = function (x, opts) {
    opts = opts || {};
    if (typeof x !== 'number' || !isFinite(x)) return 'Math ERROR';
    if (x === 0) return '0';
    var ax = Math.abs(x), digits = opts.digits || 10;
    if (opts.eng) { var e3 = Math.floor(Math.log10(ax) / 3) * 3; return trimNum((x / Math.pow(10, e3)).toPrecision(digits)) + '×10^' + e3; }
    if (opts.sci || ax >= 1e10 || ax < 1e-9) { var s = x.toExponential(digits - 1).split('e'); return trimNum(s[0]) + '×10^' + parseInt(s[1], 10); }
    return trimNum(parseFloat(x.toPrecision(digits)).toString());
  };
  function trimNum(s) { if (s.indexOf('.') < 0 || /e/i.test(s)) return s; return s.replace(/0+$/, '').replace(/\.$/, ''); }
  /* decimal → fraction (continued fractions) */
  M.toFraction = function (x, maxDen) {
    maxDen = maxDen || 10000;
    if (!isFinite(x)) return null;
    var sign = x < 0 ? -1 : 1; x = Math.abs(x);
    var h1 = 1, h0 = 0, k1 = 0, k0 = 1, b = x;
    for (var i = 0; i < 40; i++) {
      var a = Math.floor(b), h2 = a * h1 + h0, k2 = a * k1 + k0;
      if (k2 > maxDen) break;
      h0 = h1; h1 = h2; k0 = k1; k1 = k2;
      if (Math.abs(x - h1 / k1) < 1e-12 * Math.max(1, x)) break;
      b = 1 / (b - a);
      if (!isFinite(b)) break;
    }
    if (Math.abs(x - h1 / k1) > 1e-11 * Math.max(1, x)) return null;
    return { n: sign * h1, d: k1 };
  };
  M.fractionText = function (x, mixed) {
    var f = M.toFraction(x); if (!f || f.d === 1) return null;
    if (mixed && Math.abs(f.n) > f.d) { var w = Math.trunc(f.n / f.d), r = Math.abs(f.n % f.d); return w + ' ' + r + '/' + f.d; }
    return f.n + '/' + f.d;
  };
  M.toDMS = function (x) {
    var s = x < 0 ? '−' : ''; x = Math.abs(x);
    var d = Math.floor(x), mf = (x - d) * 60, m = Math.floor(mf), sec = (mf - m) * 60;
    if (sec > 59.9995) { sec = 0; m++; } if (m >= 60) { m = 0; d++; }
    return s + d + '°' + m + '′' + (Math.round(sec * 100) / 100) + '″';
  };
  /* exact-value recognition for common surds and π multiples */
  M.exactText = function (x) {
    var fr = M.fractionText(x); if (fr) return fr;
    var cands = [[Math.SQRT2, '√2'], [Math.sqrt(3), '√3'], [Math.sqrt(5), '√5'], [Math.sqrt(6), '√6'], [Math.PI, 'π']];
    for (var i = 0; i < cands.length; i++) {
      var q = x / cands[i][0], f = M.toFraction(q, 1000);
      if (f && Math.abs(q - f.n / f.d) < 1e-11) {
        var num = f.n === 1 ? '' : f.n === -1 ? '−' : String(f.n);
        return num + cands[i][1] + (f.d === 1 ? '' : '/' + f.d);
      }
    }
    return null;
  };

  /* ---------- base-N ---------- */
  M.toBase = function (n, base) { n = Math.trunc(n); if (n < 0) n = (n >>> 0); return n.toString(base).toUpperCase(); };
  M.fromBase = function (s, base) { var v = parseInt(String(s).trim(), base); if (isNaN(v)) throw Error('Syntax ERROR: not a valid base-' + base + ' number'); return v; };

  /* ---------- statistics ---------- */
  M.stats1 = function (xs, fs) {
    var data = []; xs.forEach(function (x, i) { var f = fs && fs[i] !== undefined ? fs[i] : 1; for (var k = 0; k < f; k++) data.push(x); });
    var n = data.length; if (!n) return null;
    var sum = data.reduce(function (a, b) { return a + b; }, 0), sum2 = data.reduce(function (a, b) { return a + b * b; }, 0), mean = sum / n;
    var ss = data.reduce(function (a, b) { return a + (b - mean) * (b - mean); }, 0);
    var s = data.slice().sort(function (a, b) { return a - b; });
    function med(arr) { var m = arr.length; return m % 2 ? arr[(m - 1) / 2] : (arr[m / 2 - 1] + arr[m / 2]) / 2; }
    var half = Math.floor(n / 2), lower = s.slice(0, half), upper = s.slice(n % 2 ? half + 1 : half);
    var counts = {}, best = 0; s.forEach(function (v) { counts[v] = (counts[v] || 0) + 1; best = Math.max(best, counts[v]); });
    var modes = best > 1 ? Object.keys(counts).filter(function (k) { return counts[k] === best; }).map(Number) : [];
    return { n: n, sum: sum, sum2: sum2, mean: mean, popSD: Math.sqrt(ss / n), sampSD: n > 1 ? Math.sqrt(ss / (n - 1)) : NaN, popVar: ss / n, sampVar: n > 1 ? ss / (n - 1) : NaN,
      min: s[0], q1: lower.length ? med(lower) : s[0], median: med(s), q3: upper.length ? med(upper) : s[n - 1], max: s[n - 1], range: s[n - 1] - s[0], modes: modes };
  };
  function lsq(X, Y, cols) { // least squares with design columns fns
    var n = X.length, k = cols.length, A = [], b = [];
    for (var i = 0; i < k; i++) { A.push(new Array(k).fill(0)); b.push(0); }
    for (var r = 0; r < n; r++) { var row = cols.map(function (f) { return f(X[r]); }); for (var i2 = 0; i2 < k; i2++) { b[i2] += row[i2] * Y[r]; for (var j = 0; j < k; j++) A[i2][j] += row[i2] * row[j]; } }
    return M.solveLinear(A, b);
  }
  function rsq(X, Y, f) { var my = Y.reduce(function (a, b) { return a + b; }, 0) / Y.length, sst = 0, sse = 0; for (var i = 0; i < X.length; i++) { sst += (Y[i] - my) * (Y[i] - my); sse += (Y[i] - f(X[i])) * (Y[i] - f(X[i])); } return sst ? 1 - sse / sst : 1; }
  M.regression = function (X, Y, type) {
    if (X.length < 2) return null;
    var c, f, eq;
    if (type === 'linear') { c = lsq(X, Y, [function () { return 1; }, function (x) { return x; }]); f = function (x) { return c[0] + c[1] * x; }; eq = 'y = a + bx'; return { eq: eq, a: c[0], b: c[1], r2: rsq(X, Y, f), r: pearson(X, Y), f: f }; }
    if (type === 'quadratic') { c = lsq(X, Y, [function () { return 1; }, function (x) { return x; }, function (x) { return x * x; }]); f = function (x) { return c[0] + c[1] * x + c[2] * x * x; }; return { eq: 'y = a + bx + cx²', a: c[0], b: c[1], c: c[2], r2: rsq(X, Y, f), f: f }; }
    if (type === 'log') { c = lsq(X, Y, [function () { return 1; }, function (x) { return Math.log(x); }]); f = function (x) { return c[0] + c[1] * Math.log(x); }; return { eq: 'y = a + b·ln x', a: c[0], b: c[1], r2: rsq(X, Y, f), f: f }; }
    if (type === 'exp') { var LY = Y.map(Math.log); c = lsq(X, LY, [function () { return 1; }, function (x) { return x; }]); f = function (x) { return Math.exp(c[0]) * Math.exp(c[1] * x); }; return { eq: 'y = a·e^(bx)', a: Math.exp(c[0]), b: c[1], r2: rsq(X, Y, f), f: f }; }
    if (type === 'power') { var LX = X.map(Math.log), LY2 = Y.map(Math.log); c = lsq(LX, LY2, [function () { return 1; }, function (x) { return x; }]); f = function (x) { return Math.exp(c[0]) * Math.pow(x, c[1]); }; return { eq: 'y = a·x^b', a: Math.exp(c[0]), b: c[1], r2: rsq(X, Y, f), f: f }; }
    return null;
  };
  function pearson(X, Y) { var n = X.length, mx = 0, my = 0; for (var i = 0; i < n; i++) { mx += X[i]; my += Y[i]; } mx /= n; my /= n; var sxy = 0, sxx = 0, syy = 0; for (var j = 0; j < n; j++) { sxy += (X[j] - mx) * (Y[j] - my); sxx += (X[j] - mx) * (X[j] - mx); syy += (Y[j] - my) * (Y[j] - my); } return sxy / Math.sqrt(sxx * syy); }

  /* ---------- distributions ---------- */
  function erf(x) { // Abramowitz-Stegun 7.1.26 refined with series for small x
    var s = x < 0 ? -1 : 1; x = Math.abs(x);
    if (x < 2.5) { var sum = x, term = x, n = 0; while (Math.abs(term) > 1e-16 * Math.abs(sum) && n < 200) { n++; term *= -x * x / n; sum += term / (2 * n + 1); } return s * 2 / Math.sqrt(Math.PI) * sum; }
    // continued fraction for erfc
    var t = 0; for (var k = 60; k >= 1; k--) t = k / 2 / (x + t);
    var erfc = Math.exp(-x * x) / Math.sqrt(Math.PI) / (x + t);
    return s * (1 - erfc);
  }
  M.normPdf = function (x, mu, sd) { mu = mu || 0; sd = sd || 1; var z = (x - mu) / sd; return Math.exp(-z * z / 2) / (sd * Math.sqrt(2 * Math.PI)); };
  M.normCdf = function (x, mu, sd) { mu = mu || 0; sd = sd || 1; return 0.5 * (1 + erf((x - mu) / (sd * Math.SQRT2))); };
  M.invNorm = function (p, mu, sd) { // Acklam with one Newton step
    mu = mu || 0; sd = sd === undefined ? 1 : sd;
    if (p <= 0 || p >= 1) throw Error('Math ERROR: area must be between 0 and 1');
    var a = [-3.969683028665376e1, 2.209460984245205e2, -2.759285104469687e2, 1.383577518672690e2, -3.066479806614716e1, 2.506628277459239], b = [-5.447609879822406e1, 1.615858368580409e2, -1.556989798598866e2, 6.680131188771972e1, -1.328068155288572e1], c = [-7.784894002430293e-3, -3.223964580411365e-1, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783], d = [7.784695709041462e-3, 3.224671290700398e-1, 2.445134137142996, 3.754408661907416];
    var q, r, x, pl = 0.02425;
    if (p < pl) { q = Math.sqrt(-2 * Math.log(p)); x = (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    else if (p <= 1 - pl) { q = p - 0.5; r = q * q; x = (((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1); }
    else { q = Math.sqrt(-2 * Math.log(1 - p)); x = -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1); }
    var e = M.normCdf(x) - p, u = e * Math.sqrt(2 * Math.PI) * Math.exp(x * x / 2); x = x - u / (1 + x * u / 2);
    return mu + sd * x;
  };
  function lnChoose(n, k) { return lgamma(n + 1) - lgamma(k + 1) - lgamma(n - k + 1); }
  function lgamma(z) { return Math.log(Math.abs(gamma(z))); }
  M.binomPdf = function (x, n, p) { if (x < 0 || x > n || x !== Math.floor(x)) return 0; if (p === 0) return x === 0 ? 1 : 0; if (p === 1) return x === n ? 1 : 0; return Math.exp(lnChoose(n, x) + x * Math.log(p) + (n - x) * Math.log(1 - p)); };
  M.binomCdf = function (x, n, p) { var s = 0; for (var k = 0; k <= Math.floor(x); k++) s += M.binomPdf(k, n, p); return Math.min(1, s); };
  M.poissonPdf = function (x, l) { if (x < 0 || x !== Math.floor(x)) return 0; return Math.exp(x * Math.log(l) - l - lgamma(x + 1)); };
  M.poissonCdf = function (x, l) { var s = 0; for (var k = 0; k <= Math.floor(x); k++) s += M.poissonPdf(k, l); return Math.min(1, s); };

  /* ---------- linear algebra ---------- */
  M.solveLinear = function (A, b) {
    var n = A.length, m = A.map(function (r, i) { return r.slice().concat([b[i]]); });
    for (var c = 0; c < n; c++) {
      var piv = c; for (var r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
      if (Math.abs(m[piv][c]) < 1e-12) return null;
      var tmp = m[c]; m[c] = m[piv]; m[piv] = tmp;
      for (var r2 = 0; r2 < n; r2++) if (r2 !== c) { var f = m[r2][c] / m[c][c]; for (var k = c; k <= n; k++) m[r2][k] -= f * m[c][k]; }
    }
    return m.map(function (row, i) { return clean(row[n] / row[i]); });
  };
  M.det = function (A) {
    var n = A.length, m = A.map(function (r) { return r.slice(); }), d = 1;
    for (var c = 0; c < n; c++) {
      var piv = c; for (var r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
      if (Math.abs(m[piv][c]) < 1e-14) return 0;
      if (piv !== c) { var t = m[c]; m[c] = m[piv]; m[piv] = t; d = -d; }
      d *= m[c][c];
      for (var r2 = c + 1; r2 < n; r2++) { var f = m[r2][c] / m[c][c]; for (var k = c; k < n; k++) m[r2][k] -= f * m[c][k]; }
    }
    return clean(d);
  };
  M.inverse = function (A) {
    var n = A.length, m = A.map(function (r, i) { return r.slice().concat(Array.from({ length: n }, function (_, j) { return i === j ? 1 : 0; })); });
    for (var c = 0; c < n; c++) {
      var piv = c; for (var r = c + 1; r < n; r++) if (Math.abs(m[r][c]) > Math.abs(m[piv][c])) piv = r;
      if (Math.abs(m[piv][c]) < 1e-12) return null;
      var t = m[c]; m[c] = m[piv]; m[piv] = t;
      var pv = m[c][c]; for (var k = 0; k < 2 * n; k++) m[c][k] /= pv;
      for (var r2 = 0; r2 < n; r2++) if (r2 !== c) { var f = m[r2][c]; for (var k2 = 0; k2 < 2 * n; k2++) m[r2][k2] -= f * m[c][k2]; }
    }
    return m.map(function (r) { return r.slice(n).map(clean); });
  };
  M.matMul = function (A, B) { if (A[0].length !== B.length) return null; return A.map(function (r) { return B[0].map(function (_, j) { return clean(r.reduce(function (s, v, k) { return s + v * B[k][j]; }, 0)); }); }); };
  M.transpose = function (A) { return A[0].map(function (_, j) { return A.map(function (r) { return r[j]; }); }); };

  /* ---------- polynomial roots (Durand–Kerner), coefficients highest first ---------- */
  M.polyRoots = function (coef) {
    while (coef.length && Math.abs(coef[0]) < 1e-15) coef = coef.slice(1);
    var n = coef.length - 1; if (n < 1) return [];
    var a = coef.map(function (c) { return c / coef[0]; });
    if (n === 1) return [{ re: -a[1], im: 0 }];
    if (n === 2) { var B = a[1], C = a[2], D = B * B - 4 * C; if (D >= 0) { var s = Math.sqrt(D); var r1 = (-B - Math.sign(B || 1) * s) / 2; var r2 = r1 !== 0 ? C / r1 : (-B + s) / 2; return [{ re: Math.min(r1, r2), im: 0 }, { re: Math.max(r1, r2), im: 0 }]; } return [{ re: -B / 2, im: -Math.sqrt(-D) / 2 }, { re: -B / 2, im: Math.sqrt(-D) / 2 }]; }
    var roots = []; for (var i = 0; i < n; i++) roots.push({ re: Math.cos(2 * Math.PI * i / n + 0.4) * 0.9 + 0.4 * (i % 2), im: Math.sin(2 * Math.PI * i / n + 0.4) * 0.9 });
    function cmul(x, y) { return { re: x.re * y.re - x.im * y.im, im: x.re * y.im + x.im * y.re }; }
    function cdiv(x, y) { var d = y.re * y.re + y.im * y.im; return { re: (x.re * y.re + x.im * y.im) / d, im: (x.im * y.re - x.re * y.im) / d }; }
    function peval(z) { var r = { re: 1, im: 0 }; for (var k = 1; k <= n; k++) { r = cmul(r, z); r.re += a[k]; } return r; }
    for (var it = 0; it < 500; it++) {
      var maxd = 0;
      for (var i2 = 0; i2 < n; i2++) {
        var den = { re: 1, im: 0 };
        for (var j = 0; j < n; j++) if (j !== i2) den = cmul(den, { re: roots[i2].re - roots[j].re, im: roots[i2].im - roots[j].im });
        var dl = cdiv(peval(roots[i2]), den);
        roots[i2] = { re: roots[i2].re - dl.re, im: roots[i2].im - dl.im };
        maxd = Math.max(maxd, Math.hypot(dl.re, dl.im));
      }
      if (maxd < 1e-14) break;
    }
    // polish with Newton on real ones
    return roots.map(function (z) { if (Math.abs(z.im) < 1e-8) z = { re: z.re, im: 0 }; return { re: clean(z.re), im: clean(z.im) }; })
      .sort(function (p, q) { return (p.im !== 0) - (q.im !== 0) || p.re - q.re || p.im - q.im; });
  };

  /* ---------- calculus ---------- */
  M.derivative = function (f, x) { var hh = 1e-5 * Math.max(1, Math.abs(x)); return (-f(x + 2 * hh) + 8 * f(x + hh) - 8 * f(x - hh) + f(x - 2 * hh)) / (12 * hh); };
  M.integrate = function (f, a, b) { // adaptive Simpson
    function simpson(a, b, fa, fm, fb) { return (b - a) / 6 * (fa + 4 * fm + fb); }
    function rec(a, b, fa, fm, fb, whole, eps, depth) {
      var m = (a + b) / 2, lm = (a + m) / 2, rm = (m + b) / 2, flm = f(lm), frm = f(rm);
      var left = simpson(a, m, fa, flm, fm), right = simpson(m, b, fm, frm, fb);
      if (depth <= 0 || Math.abs(left + right - whole) <= 15 * eps) return left + right + (left + right - whole) / 15;
      return rec(a, m, fa, flm, fm, left, eps / 2, depth - 1) + rec(m, b, fm, frm, fb, right, eps / 2, depth - 1);
    }
    var fa = f(a), fb = f(b), fm = f((a + b) / 2);
    return rec(a, b, fa, fm, fb, simpson(a, b, fa, fm, fb), 1e-10, 40);
  };
  M.solve = function (f, guess) { // Newton with bisection fallback scan
    var x = guess || 0;
    for (var i = 0; i < 80; i++) { var fx = f(x), d = M.derivative(f, x); if (!isFinite(fx)) break; if (Math.abs(fx) < 1e-13) return x; if (!d) break; var nx = x - fx / d; if (!isFinite(nx)) break; if (Math.abs(nx - x) < 1e-13 * Math.max(1, Math.abs(x))) return nx; x = nx; }
    var span = [1, 10, 100, 1000];
    for (var s = 0; s < span.length; s++) { var r = M.roots(f, (guess || 0) - span[s], (guess || 0) + span[s], 400); if (r.length) return r.sort(function (p, q) { return Math.abs(p - (guess || 0)) - Math.abs(q - (guess || 0)); })[0]; }
    return NaN;
  };
  M.roots = function (f, a, b, steps) {
    steps = steps || 600; var out = [], dx = (b - a) / steps, x0 = a, y0 = f(a);
    for (var i = 1; i <= steps; i++) {
      var x1 = a + i * dx, y1 = f(x1);
      if (isFinite(y0) && isFinite(y1)) {
        if (y0 === 0) out.push(x0);
        else if (y0 * y1 < 0 && Math.abs(y1 - y0) < 1e6) { var lo = x0, hi = x1, flo = y0; for (var k = 0; k < 80; k++) { var mid = (lo + hi) / 2, fm = f(mid); if (flo * fm <= 0) hi = mid; else { lo = mid; flo = fm; } } out.push((lo + hi) / 2); }
      }
      x0 = x1; y0 = y1;
    }
    return out.filter(function (r, i) { return i === 0 || Math.abs(r - out[i - 1]) > dx / 2; }).map(clean);
  };
  M.extrema = function (f, a, b) {
    var d = function (x) { return M.derivative(f, x); };
    return M.roots(d, a, b, 500).map(function (x) { var c = M.derivative(d, x); return { x: x, y: f(x), kind: c < 0 ? 'max' : c > 0 ? 'min' : 'flat' }; }).filter(function (p) { return isFinite(p.y); });
  };

  /* ---------- random (seedable) ---------- */
  M.rng = function (seed) { var s = (seed >>> 0) || (Math.random() * 4294967296) >>> 0; return function () { s += 0x6D2B79F5; var t = s; t = Math.imul(t ^ (t >>> 15), t | 1); t ^= t + Math.imul(t ^ (t >>> 7), t | 61); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; }; };

  root.JNZXMath = M;
  if (typeof module !== 'undefined') module.exports = M;
})(typeof window !== 'undefined' ? window : globalThis);
