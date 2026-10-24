/* The James NZ — Learning › Math: scientific calculator, graphing calculator,
   guide, Monte Carlo simulations and trigonometry theorems (October 2026).
   Uses JNZXMath from extras-mathcore.js. Not affiliated with Casio. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef, useMemo = R.useMemo, useCallback = R.useCallback;
  var M = window.JNZXMath;
  var fmt = function (x, o) { return M.format(x, o); };
  function nums(text) { return String(text).split(/[\s,;]+/).map(function (s) { return s.trim(); }).filter(Boolean).map(Number).filter(function (n) { return isFinite(n); }); }

  /* ======================= SCIENTIFIC CALCULATOR ======================= */
  var KEYS = [
    ['sin', 'sin('], ['cos', 'cos('], ['tan', 'tan('], ['sin⁻¹', 'sin⁻¹('], ['cos⁻¹', 'cos⁻¹('], ['tan⁻¹', 'tan⁻¹('],
    ['x²', '²'], ['x³', '³'], ['xʸ', '^('], ['√', '√('], ['∛', '∛('], ['ʸ√x', 'root('],
    ['log', 'log('], ['ln', 'ln('], ['10ˣ', '10^('], ['eˣ', 'e^('], ['logₐb', 'log(', 'log(base,x)'], ['x⁻¹', '^(-1)'],
    ['(', '('], [')', ')'], [',', ','], ['x!', '!'], ['%', '%'], ['°', '°'],
    ['π', 'π'], ['e', 'e'], ['Ans', 'Ans'], ['nCr', 'nCr('], ['nPr', 'nPr('], ['Abs', 'abs(']
  ];
  var PAD = [['7', '8', '9', 'DEL', 'AC'], ['4', '5', '6', '×', '÷'], ['1', '2', '3', '+', '−'], ['0', '.', '×10ˣ', '(−)', '=']];

  function SciCalc() {
    var ex = useState(''), expr = ex[0], setExpr = ex[1];
    var an = JNZX.useStored('jnzx-calc-angle', 'deg'), angle = an[0], setAngle = an[1];
    var va = JNZX.useStored('jnzx-calc-vars', { Ans: 0, A: 0, B: 0, C: 0, D: 0, E: 0, F: 0, M: 0, x: 0, y: 0 }), vars = va[0], setVars = va[1];
    var hi = JNZX.useStored('jnzx-calc-history', []), hist = hi[0], setHist = hi[1];
    var rs = useState(null), res = rs[0], setRes = rs[1];
    var vw = useState(0), view = vw[0], setView = vw[1];
    var sto = useState(false), storing = sto[0], setStoring = sto[1];
    var inp = useRef(null);
    var preview = useMemo(function () { if (!expr.trim()) return ''; try { return fmt(M.calc(expr, { angle: angle, vars: vars })); } catch (e) { return ''; } }, [expr, angle, vars]);
    function insert(t) {
      var el = inp.current, typing = el && document.activeElement === el, s = typing ? el.selectionStart : expr.length, e = typing ? el.selectionEnd : expr.length;
      if (res && /^[+\-×÷*/^²³!%]/.test(t) && s === expr.length && expr === '') { t = 'Ans' + t; }
      var next = expr.slice(0, s) + t + expr.slice(e);
      setExpr(next); setRes(null);
      if (typing) requestAnimationFrame(function () { var c = s + t.length; try { el.setSelectionRange(c, c); } catch (x) {} });
    }
    function equals() {
      if (!expr.trim()) return;
      try {
        var v = M.calc(expr, { angle: angle, vars: Object.assign({}, vars) });
        var nv = Object.assign({}, vars, { Ans: v }); setVars(nv);
        setRes({ v: v, expr: expr }); setView(0);
        setHist([{ e: expr, v: v }].concat(hist).slice(0, 30));
      } catch (e) { setRes({ err: e.message, expr: expr }); }
    }
    function key(k) {
      if (k === 'AC') { setExpr(''); setRes(null); return; }
      if (k === 'DEL') { setExpr(expr.slice(0, -1)); setRes(null); return; }
      if (k === '=') { equals(); return; }
      if (k === '×10ˣ') return insert('E');
      if (k === '(−)') return insert('-');
      if (res && !res.err && expr === res.expr && /^[×÷+−]$/.test(k)) { setExpr('Ans' + k); setRes(null); return; }
      if (res && expr === res.expr) { setExpr(k); setRes(null); return; }
      insert(k);
    }
    function store(name) { if (!res || res.err) return; var nv = Object.assign({}, vars); nv[name] = res.v; setVars(nv); setStoring(false); }
    function mem(op) { var v = res && !res.err ? res.v : (function () { try { return M.calc(expr, { angle: angle, vars: vars }); } catch (e) { return null; } })(); if (v === null) return; var nv = Object.assign({}, vars); nv.M = (nv.M || 0) + (op === '+' ? v : -v); setVars(nv); }
    var shown = '';
    if (res && !res.err) {
      var exact = M.exactText(res.v), mixed = M.fractionText(res.v, true);
      var forms = [exact || fmt(res.v), fmt(res.v), mixed || fmt(res.v), fmt(res.v, { eng: true }), M.toDMS(res.v)];
      shown = forms[view % forms.length];
    }
    return h('div', { className: 'jx-calc' },
      h('div', { className: 'jx-calc-body' },
        h('div', { className: 'jx-calc-top' },
          h('span', { className: 'jx-calc-brand' }, 'JNZ-991'),
          h('div', { className: 'jx-seg', role: 'group', 'aria-label': 'Angle unit' }, ['deg', 'rad', 'grad'].map(function (m) {
            return h('button', { key: m, type: 'button', className: angle === m ? 'is-on' : '', 'aria-pressed': angle === m, onClick: function () { setAngle(m); } }, m === 'deg' ? 'Deg' : m === 'rad' ? 'Rad' : 'Gra');
          }))),
        h('div', { className: 'jx-display', 'aria-live': 'polite' },
          h('input', { ref: inp, className: 'jx-disp-in', value: expr, 'aria-label': 'Expression', spellCheck: false, autoComplete: 'off', inputMode: 'text',
            onChange: function (e) { setExpr(e.target.value); setRes(null); }, onKeyDown: function (e) { if (e.key === 'Enter') { e.preventDefault(); equals(); } } }),
          h('div', { className: 'jx-disp-out' + (res && res.err ? ' is-err' : '') }, res ? (res.err || shown) : (preview ? h('span', { className: 'jx-preview' }, preview) : '0'))),
        h('div', { className: 'jx-calc-util' },
          h('button', { type: 'button', onClick: function () { setView(view + 1); }, disabled: !res || !!res.err, title: 'Switch exact, decimal, mixed fraction, engineering and degrees-minutes-seconds' }, 'S⇔D'),
          h('button', { type: 'button', onClick: function () { setStoring(!storing); }, disabled: !res || !!res.err }, 'STO'),
          h('button', { type: 'button', onClick: function () { mem('+'); } }, 'M+'), h('button', { type: 'button', onClick: function () { mem('-'); } }, 'M−'),
          h('button', { type: 'button', onClick: function () { insert('M'); } }, 'MR'),
          ['A', 'B', 'C', 'D', 'x', 'y'].map(function (v) { return h('button', { key: v, type: 'button', onClick: function () { storing ? store(v) : insert(v); }, className: storing ? 'is-hot' : '', title: storing ? 'Store Ans in ' + v : 'Insert ' + v + ' = ' + fmt(vars[v] || 0) }, v); })),
        storing && h('p', { className: 'small-note' }, 'Choose a variable (A, B, C, D, x or y) to store the result.'),
        h('div', { className: 'jx-keys-fn' }, KEYS.map(function (k) { return h('button', { key: k[0], type: 'button', onClick: function () { insert(k[1]); }, title: k[2] || '' }, k[0]); })),
        h('div', { className: 'jx-keys-num' }, PAD.map(function (row, i) {
          return row.map(function (k) { return h('button', { key: i + k, type: 'button', className: k === '=' ? 'is-eq' : /DEL|AC/.test(k) ? 'is-del' : /[×÷+−]/.test(k) ? 'is-op' : '', onClick: function () { key(k); } }, k); });
        }))),
      h('div', { className: 'jx-calc-side' },
        h('h3', null, 'History'),
        hist.length ? h('ol', { className: 'jx-hist' }, hist.map(function (x, i) {
          return h('li', { key: i }, h('button', { type: 'button', onClick: function () { setExpr(x.e); setRes(null); } }, x.e), h('span', null, '= ' + fmt(x.v)));
        })) : h('p', { className: 'jx-muted' }, 'Your calculations appear here. Tap one to edit it again.'),
        hist.length > 0 && h('button', { type: 'button', className: 'secondary', onClick: function () { setHist([]); } }, 'Clear history'),
        h('h3', null, 'Memory'),
        h('p', { className: 'jx-muted' }, ['A', 'B', 'C', 'D', 'x', 'y', 'M'].map(function (k) { return k + ' = ' + fmt(vars[k] || 0); }).join(' · ')),
        h('p', { className: 'small-note' }, 'Type with your keyboard too: 2sin30, √(2)², 3!, nCr(5,2), log(2,8), 1.5E3. Press Enter for =.')));
  }

  /* ---------- advanced modes ---------- */
  function StatsMode() {
    var x = useState('2, 4, 4, 4, 5, 5, 7, 9'), xs = x[0], setX = x[1];
    var y = useState(''), ys = y[0], setY = y[1];
    var t = useState('linear'), type = t[0], setType = t[1];
    var X = nums(xs), Y = nums(ys);
    var s1 = X.length ? M.stats1(X) : null;
    var two = Y.length && Y.length === X.length;
    var reg = two ? M.regression(X, Y, type) : null;
    function row(k, v) { return h('tr', { key: k }, h('th', null, k), h('td', null, typeof v === 'number' ? fmt(v) : v)); }
    return h('div', { className: 'jx-cards2' },
      h('div', null,
        h('label', { className: 'jx-wide' }, 'x values (separate with commas or spaces)', h('textarea', { rows: 3, value: xs, onChange: function (e) { setX(e.target.value); } })),
        h('label', { className: 'jx-wide' }, 'y values (optional, for 2-variable regression)', h('textarea', { rows: 3, value: ys, onChange: function (e) { setY(e.target.value); }, placeholder: 'e.g. 2.2, 4.1, 6.2, 7.9, 10.1' })),
        two && h('label', null, 'Regression', h('select', { value: type, onChange: function (e) { setType(e.target.value); } },
          [['linear', 'y = a + bx'], ['quadratic', 'y = a + bx + cx²'], ['log', 'y = a + b·ln x'], ['exp', 'y = a·e^(bx)'], ['power', 'y = a·x^b']].map(function (o) { return h('option', { key: o[0], value: o[0] }, o[1]); }))),
        Y.length > 0 && !two && h('p', { className: 'small-note' }, 'Enter the same number of x and y values (' + X.length + ' x, ' + Y.length + ' y).')),
      h('div', { className: 'jx-table-wrap' }, s1 && h('table', null, h('tbody', null,
        row('n', s1.n), row('x̄ (mean)', s1.mean), row('Σx', s1.sum), row('Σx²', s1.sum2), row('σx (population SD)', s1.popSD), row('sx (sample SD)', s1.sampSD),
        row('min', s1.min), row('Q1', s1.q1), row('median', s1.median), row('Q3', s1.q3), row('max', s1.max), row('range', s1.range), row('mode', s1.modes.length ? s1.modes.join(', ') : 'none'),
        reg && row('Model', reg.eq), reg && row('a', reg.a), reg && row('b', reg.b), reg && reg.c !== undefined && row('c', reg.c), reg && reg.r !== undefined && row('r', reg.r), reg && row('r²', reg.r2)))));
  }
  function DistMode() {
    var d = useState('normal'), dist = d[0], setDist = d[1];
    var p = useState({ x: '1.96', mu: '0', sd: '1', lo: '-1', hi: '1', area: '0.975', n: '10', pr: '0.5', k: '3', lam: '3' }), v = p[0], setV = p[1];
    function f(k) { return h('input', { value: v[k], inputMode: 'decimal', onChange: function (e) { var o = Object.assign({}, v); o[k] = e.target.value; setV(o); } }); }
    var N = function (k) { return parseFloat(v[k]); };
    var out = [];
    try {
      if (dist === 'normal') {
        out.push(['P(X ≤ x) Normal CD', M.normCdf(N('x'), N('mu'), N('sd'))], ['P(lo ≤ X ≤ hi)', M.normCdf(N('hi'), N('mu'), N('sd')) - M.normCdf(N('lo'), N('mu'), N('sd'))], ['Normal PD at x', M.normPdf(N('x'), N('mu'), N('sd'))], ['Inverse normal (left area)', M.invNorm(N('area'), N('mu'), N('sd'))]);
      } else if (dist === 'binomial') {
        out.push(['P(X = k)', M.binomPdf(N('k'), N('n'), N('pr'))], ['P(X ≤ k)', M.binomCdf(N('k'), N('n'), N('pr'))], ['P(X ≥ k)', 1 - M.binomCdf(N('k') - 1, N('n'), N('pr'))], ['Mean np', N('n') * N('pr')], ['SD √(np(1−p))', Math.sqrt(N('n') * N('pr') * (1 - N('pr')))]);
      } else {
        out.push(['P(X = k)', M.poissonPdf(N('k'), N('lam'))], ['P(X ≤ k)', M.poissonCdf(N('k'), N('lam'))], ['P(X ≥ k)', 1 - M.poissonCdf(N('k') - 1, N('lam'))], ['Mean = variance = λ', N('lam')]);
      }
    } catch (e) { out = [['Error', e.message]]; }
    return h('div', null,
      h(JNZX.Chips, { label: 'Distribution', options: [{ value: 'normal', label: 'Normal' }, { value: 'binomial', label: 'Binomial' }, { value: 'poisson', label: 'Poisson' }], value: dist, onChange: setDist }),
      h('div', { className: 'jx-row jx-form' },
        dist === 'normal' && [h('label', { key: 1 }, 'x', f('x')), h('label', { key: 2 }, 'μ (mean)', f('mu')), h('label', { key: 3 }, 'σ (SD)', f('sd')), h('label', { key: 4 }, 'lower', f('lo')), h('label', { key: 5 }, 'upper', f('hi')), h('label', { key: 6 }, 'area (for inverse)', f('area'))],
        dist === 'binomial' && [h('label', { key: 1 }, 'n trials', f('n')), h('label', { key: 2 }, 'p success', f('pr')), h('label', { key: 3 }, 'k', f('k'))],
        dist === 'poisson' && [h('label', { key: 1 }, 'λ (mean)', f('lam')), h('label', { key: 2 }, 'k', f('k'))]),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, out.map(function (r) { return h('tr', { key: r[0] }, h('th', null, r[0]), h('td', null, typeof r[1] === 'number' ? fmt(r[1]) : r[1])); })))));
  }
  function EquationMode() {
    var t = useState('poly'), type = t[0], setType = t[1];
    var dg = useState(2), deg = dg[0], setDeg = dg[1];
    var co = useState(['1', '-3', '2', '0', '0']), coef = co[0], setCoef = co[1];
    var nn = useState(2), n = nn[0], setN = nn[1];
    var sy = useState([['2', '1', '5'], ['1', '3', '10'], ['0', '0', '0'], ['0', '0', '0']].map(function (r) { return r.concat(['0', '0']); })), sys = sy[0], setSys = sy[1];
    var fx = useState('x^3-2x-5'), fexp = fx[0], setF = fx[1];
    var gs = useState('2'), guess = gs[0], setGuess = gs[1];
    var out = null;
    try {
      if (type === 'poly') {
        var c = coef.slice(0, deg + 1).map(Number);
        var roots = M.polyRoots(c);
        out = h('ol', null, roots.map(function (r, i) { return h('li', { key: i }, 'x' + (i + 1) + ' = ' + fmt(r.re) + (r.im ? (r.im > 0 ? ' + ' : ' − ') + fmt(Math.abs(r.im)) + 'i' : '') + (!r.im && M.exactText(r.re) && M.exactText(r.re) !== fmt(r.re) ? '  (' + M.exactText(r.re) + ')' : '')); }));
        if (deg === 2 && c[0]) { var a = c[0], b = c[1], cc = c[2], D = b * b - 4 * a * cc; out = h('div', null, out, h('p', { className: 'jx-muted' }, 'Discriminant b² − 4ac = ' + fmt(D) + (D > 0 ? ' (two real roots)' : D === 0 ? ' (one repeated root)' : ' (two complex roots)') + '. Turning point (' + fmt(-b / (2 * a)) + ', ' + fmt(cc - b * b / (4 * a)) + ').')); }
      } else if (type === 'sys') {
        var A = sys.slice(0, n).map(function (r) { return r.slice(0, n).map(Number); }), B = sys.slice(0, n).map(function (r) { return Number(r[n]); });
        var sol = M.solveLinear(A, B);
        out = sol ? h('p', null, sol.map(function (v, i) { return 'xyzw'[i] + ' = ' + fmt(v); }).join(',   ')) : h('p', null, 'No unique solution (the equations are dependent or inconsistent).');
      } else {
        var f = M.compile(fexp, 'x', 'rad'); var r = M.solve(f, parseFloat(guess) || 0);
        out = isFinite(r) ? h('p', null, 'x = ' + fmt(r) + '   (check: f(x) = ' + fmt(f(r) || 0) + ')') : h('p', null, 'No solution found near this starting value. Try another guess.');
      }
    } catch (e) { out = h('p', { role: 'alert' }, e.message); }
    function cin(i) { return h('input', { key: i, value: coef[i], inputMode: 'decimal', 'aria-label': 'coefficient ' + 'abcde'[i], onChange: function (e) { var c2 = coef.slice(); c2[i] = e.target.value; setCoef(c2); } }); }
    return h('div', null,
      h(JNZX.Chips, { label: 'Equation type', options: [{ value: 'poly', label: 'Polynomial' }, { value: 'sys', label: 'Simultaneous' }, { value: 'solve', label: 'Solve f(x) = 0' }], value: type, onChange: setType }),
      type === 'poly' && h('div', null,
        h(JNZX.Chips, { label: 'Degree', options: [{ value: 2, label: 'ax²+bx+c' }, { value: 3, label: 'ax³+…+d' }, { value: 4, label: 'ax⁴+…+e' }], value: deg, onChange: setDeg }),
        h('div', { className: 'jx-row jx-form' }, Array.from({ length: deg + 1 }, function (_, i) { return h('label', { key: i }, 'abcde'[i], cin(i)); }))),
      type === 'sys' && h('div', null,
        h(JNZX.Chips, { label: 'Unknowns', options: [2, 3, 4].map(function (k) { return { value: k, label: k + ' unknowns' }; }), value: n, onChange: setN }),
        h('div', { className: 'jx-table-wrap' }, h('table', { className: 'jx-matrix' }, h('tbody', null, sys.slice(0, n).map(function (r, i) {
          return h('tr', { key: i }, r.slice(0, n + 1).map(function (cell, j) {
            return h('td', { key: j }, h('input', { value: cell, inputMode: 'decimal', 'aria-label': 'row ' + (i + 1) + (j === n ? ' constant' : ' ' + 'xyzw'[j]), onChange: function (e) { var s2 = sys.map(function (q) { return q.slice(); }); s2[i][j] = e.target.value; setSys(s2); } }), j < n - 1 ? h('span', null, ' ' + 'xyzw'[j] + ' +') : j === n - 1 ? h('span', null, ' ' + 'xyzw'[j] + ' =') : null);
          }));
        }))))),
      type === 'solve' && h('div', { className: 'jx-row jx-form' }, h('label', null, 'f(x) =', h('input', { value: fexp, onChange: function (e) { setF(e.target.value); } })), h('label', null, 'Start near x =', h('input', { value: guess, onChange: function (e) { setGuess(e.target.value); } }))),
      h('div', { className: 'jx-result' }, h('h4', null, 'Solution'), out));
  }
  function MatrixMode() {
    var sz = useState(2), n = sz[0], setN = sz[1];
    var a = useState([['2', '1', '0', '0'], ['1', '3', '0', '0'], ['0', '0', '1', '0'], ['0', '0', '0', '1']]), A = a[0], setA = a[1];
    var b = useState([['1', '2', '0', '0'], ['0', '1', '0', '0'], ['0', '0', '1', '0'], ['0', '0', '0', '1']]), B = b[0], setB = b[1];
    var o = useState('det'), op = o[0], setOp = o[1];
    function num(Mx) { return Mx.slice(0, n).map(function (r) { return r.slice(0, n).map(Number); }); }
    function grid(Mx, set, name) {
      return h('div', null, h('h4', null, 'Matrix ' + name), h('table', { className: 'jx-matrix' }, h('tbody', null, Mx.slice(0, n).map(function (r, i) {
        return h('tr', { key: i }, r.slice(0, n).map(function (c, j) { return h('td', { key: j }, h('input', { value: c, inputMode: 'decimal', 'aria-label': name + ' row ' + (i + 1) + ' column ' + (j + 1), onChange: function (e) { var m2 = Mx.map(function (q) { return q.slice(); }); m2[i][j] = e.target.value; set(m2); } })); }));
      }))));
    }
    var res;
    var NA = num(A), NB = num(B);
    if (op === 'det') res = 'det(A) = ' + fmt(M.det(NA));
    else if (op === 'inv') { var inv = M.inverse(NA); res = inv || 'A has no inverse (det = 0).'; }
    else if (op === 'mul') res = M.matMul(NA, NB);
    else if (op === 'add') res = NA.map(function (r, i) { return r.map(function (v, j) { return v + NB[i][j]; }); });
    else if (op === 'sub') res = NA.map(function (r, i) { return r.map(function (v, j) { return v - NB[i][j]; }); });
    else if (op === 'tr') res = M.transpose(NA);
    else if (op === 'sq') res = M.matMul(NA, NA);
    return h('div', null,
      h(JNZX.Chips, { label: 'Size', options: [2, 3, 4].map(function (k) { return { value: k, label: k + '×' + k }; }), value: n, onChange: setN }),
      h('div', { className: 'jx-row jx-mats' }, grid(A, setA, 'A'), grid(B, setB, 'B')),
      h(JNZX.Chips, { label: 'Operation', options: [{ value: 'det', label: 'det(A)' }, { value: 'inv', label: 'A⁻¹' }, { value: 'tr', label: 'Aᵀ' }, { value: 'sq', label: 'A²' }, { value: 'add', label: 'A + B' }, { value: 'sub', label: 'A − B' }, { value: 'mul', label: 'A × B' }], value: op, onChange: setOp }),
      h('div', { className: 'jx-result' }, typeof res === 'string' ? h('p', null, res) : h('table', { className: 'jx-matrix jx-matrix-out' }, h('tbody', null, res.map(function (r, i) { return h('tr', { key: i }, r.map(function (v, j) { var fr = M.fractionText(v); return h('td', { key: j }, fr || fmt(v)); })); })))));
  }
  function BaseMode() {
    var v = useState('255'), val = v[0], setVal = v[1];
    var b = useState(10), base = b[0], setBase = b[1];
    var w = useState('15'), other = w[0], setOther = w[1];
    var n, err = '';
    try { n = M.fromBase(val, base); } catch (e) { err = e.message; }
    var m2 = 0; try { m2 = M.fromBase(other, base); } catch (e) {}
    function row(label, v2) { return h('tr', { key: label }, h('th', null, label), h('td', null, h('code', null, v2))); }
    return h('div', null,
      h(JNZX.Chips, { label: 'Input base', options: [{ value: 10, label: 'DEC' }, { value: 16, label: 'HEX' }, { value: 2, label: 'BIN' }, { value: 8, label: 'OCT' }], value: base, onChange: function (nb) { if (!err) setVal(M.toBase(n, nb)); setBase(nb); } }),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Number', h('input', { value: val, onChange: function (e) { setVal(e.target.value); } })), h('label', null, 'Second number (for logic)', h('input', { value: other, onChange: function (e) { setOther(e.target.value); } }))),
      err ? h('p', { role: 'alert' }, err) : h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null,
        row('DEC', String(n)), row('HEX', M.toBase(n, 16)), row('BIN', M.toBase(n, 2)), row('OCT', M.toBase(n, 8)),
        row('A AND B', M.toBase((n & m2) >>> 0, base)), row('A OR B', M.toBase((n | m2) >>> 0, base)), row('A XOR B', M.toBase((n ^ m2) >>> 0, base)), row('NOT A (32-bit)', M.toBase((~n) >>> 0, base))))),
      h('p', { className: 'small-note' }, 'Logic operations use unsigned 32-bit integers.'));
  }
  function CalculusMode() {
    var f = useState('x^2·sin(x)'.replace('·', '*')), fe = f[0], setF = f[1];
    var a = useState('0'), lo = a[0], setLo = a[1], b = useState('3.14159265'), hi = b[0], setHi = b[1], p = useState('1'), at = p[0], setAt = p[1];
    var s = useState('k^2'), se = s[0], setS = s[1], s1 = useState('1'), sa = s1[0], setSa = s1[1], s2 = useState('10'), sb = s2[0], setSb = s2[1];
    var rows = [];
    try {
      var g = M.compile(fe, 'x', 'rad');
      rows.push(['d/dx f(x) at x = ' + at, fmt(M.derivative(g, parseFloat(at)))]);
      rows.push(['∫ f(x) dx from ' + lo + ' to ' + hi, fmt(M.integrate(g, M.calc(lo, { angle: 'rad' }), M.calc(hi, { angle: 'rad' })))]);
    } catch (e) { rows.push(['Error', e.message]); }
    try {
      var k = M.parse(se.replace(/k/g, 'x')), from = Math.round(parseFloat(sa)), to = Math.round(parseFloat(sb)), sum = 0;
      if (to - from > 100000) throw Error('Range too large (max 100 000 terms).');
      for (var i = from; i <= to; i++) sum += M.evaluate(k, { angle: 'rad', vars: { x: i } });
      rows.push(['Σ (' + se + ') for k = ' + from + '…' + to, fmt(sum)]);
    } catch (e) { rows.push(['Σ error', e.message]); }
    return h('div', null,
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'f(x) =', h('input', { value: fe, onChange: function (e) { setF(e.target.value); } })), h('label', null, 'd/dx at x =', h('input', { value: at, onChange: function (e) { setAt(e.target.value); } })), h('label', null, '∫ from', h('input', { value: lo, onChange: function (e) { setLo(e.target.value); } })), h('label', null, 'to', h('input', { value: hi, onChange: function (e) { setHi(e.target.value); } }))),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Σ term in k', h('input', { value: se, onChange: function (e) { setS(e.target.value); } })), h('label', null, 'from k =', h('input', { value: sa, onChange: function (e) { setSa(e.target.value); } })), h('label', null, 'to', h('input', { value: sb, onChange: function (e) { setSb(e.target.value); } }))),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, rows.map(function (r) { return h('tr', { key: r[0] }, h('th', null, r[0]), h('td', null, r[1])); })))),
      h('p', { className: 'small-note' }, 'Calculus uses radians. Results are numerical approximations (accurate to about 10 significant figures for smooth functions).'));
  }
  function TableMode() {
    var f = useState('x^2-3x+1'), fe = f[0], setF = f[1], g = useState(''), ge = g[0], setG = g[1];
    var a = useState('-2'), s = a[0], setS = a[1], b = useState('5'), e = b[0], setE = b[1], c = useState('1'), st = c[0], setSt = c[1];
    var rows = [], err = '';
    try {
      var F = M.compile(fe, 'x', 'rad'), G = ge ? M.compile(ge, 'x', 'rad') : null, x0 = parseFloat(s), x1 = parseFloat(e), dx = parseFloat(st);
      if (!(dx > 0)) throw Error('Step must be positive.');
      for (var x = x0, i = 0; x <= x1 + 1e-12 && i < 200; x += dx, i++) rows.push([x, F(x), G ? G(x) : null]);
    } catch (x) { err = x.message; }
    return h('div', null,
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'f(x) =', h('input', { value: fe, onChange: function (ev) { setF(ev.target.value); } })), h('label', null, 'g(x) = (optional)', h('input', { value: ge, onChange: function (ev) { setG(ev.target.value); } })), h('label', null, 'Start', h('input', { value: s, onChange: function (ev) { setS(ev.target.value); } })), h('label', null, 'End', h('input', { value: e, onChange: function (ev) { setE(ev.target.value); } })), h('label', null, 'Step', h('input', { value: st, onChange: function (ev) { setSt(ev.target.value); } }))),
      err ? h('p', { role: 'alert' }, err) : h('div', { className: 'jx-table-wrap jx-scroll' }, h('table', null, h('thead', null, h('tr', null, h('th', null, 'x'), h('th', null, 'f(x)'), ge && h('th', null, 'g(x)'))), h('tbody', null, rows.map(function (r, i) { return h('tr', { key: i }, h('td', null, fmt(r[0])), h('td', null, isFinite(r[1]) ? fmt(r[1]) : 'ERROR'), ge && h('td', null, isFinite(r[2]) ? fmt(r[2]) : 'ERROR')); })))));
  }

  function ScientificTab() {
    return h('div', null,
      h(JNZX.Tabs, { id: 'sci-modes', label: 'Calculator mode', items: [
        { id: 'calc', label: 'Calculate', render: function () { return h(SciCalc); } },
        { id: 'stat', label: 'Statistics', render: function () { return h(StatsMode); } },
        { id: 'dist', label: 'Distribution', render: function () { return h(DistMode); } },
        { id: 'eqn', label: 'Equation', render: function () { return h(EquationMode); } },
        { id: 'mat', label: 'Matrix', render: function () { return h(MatrixMode); } },
        { id: 'calcu', label: 'Calculus & Σ', render: function () { return h(CalculusMode); } },
        { id: 'table', label: 'Table', render: function () { return h(TableMode); } },
        { id: 'base', label: 'Base-N', render: function () { return h(BaseMode); } }
      ] }));
  }

  /* ======================= GRAPHING CALCULATOR ======================= */
  var COLORS = ['#1f5fbf', '#c62828', '#2e7d32', '#8e24aa', '#ef6c00', '#00838f'];
  function Graphing() {
    var fs = JNZX.useStored('jnzx-graph-fns', [
      { on: true, type: 'y', e: 'sin(x)' }, { on: true, type: 'y', e: 'x^2/4-1' }, { on: false, type: 'y', e: '' }, { on: false, type: 'y', e: '' }, { on: false, type: 'y', e: '' }, { on: false, type: 'y', e: '' }
    ]), fns = fs[0], setFns = fs[1];
    var vw = useState({ x0: -10, x1: 10, y0: -6, y1: 6 }), view = vw[0], setView = vw[1];
    var tr = useState(null), trace = tr[0], setTrace = tr[1];
    var so = useState({ kind: 'roots', f: 0, g: 1, a: '-3', b: '3' }), solve = so[0], setSolve = so[1];
    var canvas = useRef(null), drag = useRef(null), wrap = useRef(null);
    var compiled = useMemo(function () {
      return fns.map(function (f) { if (!f.on || !f.e.trim()) return null; try { M.parse(f.e); return M.compile(f.e, f.type === 'r' ? 'θ' : 'x', 'rad'); } catch (e) { return 'err'; } });
    }, [fns]);
    var draw = useCallback(function () {
      var c = canvas.current; if (!c) return;
      var dpr = window.devicePixelRatio || 1, W = c.clientWidth, H = c.clientHeight;
      c.width = W * dpr; c.height = H * dpr;
      var g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var dark = document.documentElement.dataset.readingTheme === 'dark';
      g.fillStyle = dark ? '#0f1d27' : '#ffffff'; g.fillRect(0, 0, W, H);
      var X = function (x) { return (x - view.x0) / (view.x1 - view.x0) * W; }, Y = function (y) { return H - (y - view.y0) / (view.y1 - view.y0) * H; };
      function step(span) { var raw = span / 10, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p; return (m < 1.5 ? 1 : m < 3.5 ? 2 : m < 7.5 ? 5 : 10) * p; }
      var sx = step(view.x1 - view.x0), sy = step(view.y1 - view.y0);
      g.lineWidth = 1; g.strokeStyle = dark ? '#22394a' : '#e6edf3'; g.fillStyle = dark ? '#9fb3c4' : '#5d7387'; g.font = '11px Arial';
      for (var gx = Math.ceil(view.x0 / sx) * sx; gx <= view.x1; gx += sx) { g.beginPath(); g.moveTo(X(gx), 0); g.lineTo(X(gx), H); g.stroke(); if (Math.abs(gx) > sx / 2) g.fillText(fmt(+gx.toPrecision(6)), X(gx) + 2, Math.min(H - 4, Math.max(12, Y(0) + 12))); }
      for (var gy = Math.ceil(view.y0 / sy) * sy; gy <= view.y1; gy += sy) { g.beginPath(); g.moveTo(0, Y(gy)); g.lineTo(W, Y(gy)); g.stroke(); if (Math.abs(gy) > sy / 2) g.fillText(fmt(+gy.toPrecision(6)), Math.min(W - 30, Math.max(2, X(0) + 4)), Y(gy) - 2); }
      g.strokeStyle = dark ? '#8aa0b2' : '#33475b'; g.lineWidth = 1.5;
      g.beginPath(); g.moveTo(0, Y(0)); g.lineTo(W, Y(0)); g.moveTo(X(0), 0); g.lineTo(X(0), H); g.stroke();
      // shaded integral
      if (solve.kind === 'integral' && typeof compiled[solve.f] === 'function') {
        var fI = compiled[solve.f], a = parseFloat(solve.a), b = parseFloat(solve.b);
        if (isFinite(a) && isFinite(b)) { g.fillStyle = COLORS[solve.f] + '33'; g.beginPath(); g.moveTo(X(a), Y(0)); for (var px = X(a); px <= X(b); px++) { var xv = view.x0 + px / W * (view.x1 - view.x0); var yv = fI(xv); if (isFinite(yv)) g.lineTo(px, Y(yv)); } g.lineTo(X(b), Y(0)); g.closePath(); g.fill(); }
      }
      compiled.forEach(function (f, i) {
        if (typeof f !== 'function') return;
        g.strokeStyle = COLORS[i]; g.lineWidth = 2.2; g.beginPath();
        var pen = false, lastY = null;
        if (fns[i].type === 'r') {
          for (var t = 0; t <= Math.PI * 4 + 1e-9; t += Math.PI / 360) { var r = f(t); if (!isFinite(r)) { pen = false; continue; } var x = r * Math.cos(t), y = r * Math.sin(t); if (!pen) { g.moveTo(X(x), Y(y)); pen = true; } else g.lineTo(X(x), Y(y)); }
        } else {
          for (var px2 = 0; px2 <= W; px2 += 1) {
            var xv2 = view.x0 + px2 / W * (view.x1 - view.x0), yv2 = f(xv2);
            if (!isFinite(yv2)) { pen = false; continue; }
            var py = Y(yv2);
            if (pen && lastY !== null && Math.abs(py - lastY) > H * 1.5) pen = false; // asymptote
            if (!pen) { g.moveTo(px2, py); pen = true; } else g.lineTo(px2, py);
            lastY = py;
          }
        }
        g.stroke();
      });
      if (trace) { g.fillStyle = COLORS[trace.i]; g.beginPath(); g.arc(X(trace.x), Y(trace.y), 5, 0, Math.PI * 2); g.fill(); }
      (solveResult.points || []).forEach(function (p) { g.fillStyle = '#111'; g.strokeStyle = '#fff'; g.lineWidth = 2; g.beginPath(); g.arc(X(p[0]), Y(p[1]), 5, 0, Math.PI * 2); g.fill(); g.stroke(); });
    });
    var solveResult = useMemo(function () {
      var f = compiled[solve.f], g2 = compiled[solve.g];
      if (typeof f !== 'function' || fns[solve.f].type === 'r') return { text: 'Choose a y = function that is switched on.', points: [] };
      var a = view.x0, b = view.x1;
      if (solve.kind === 'roots') { var r = M.roots(f, a, b, 800); return { text: r.length ? 'Roots (x-intercepts) in view: ' + r.map(function (x) { return fmt(x); }).join(', ') : 'No roots in the current view.', points: r.map(function (x) { return [x, 0]; }) }; }
      if (solve.kind === 'yint') { var y0 = f(0); return { text: isFinite(y0) ? 'y-intercept: (0, ' + fmt(y0) + ')' : 'Undefined at x = 0.', points: isFinite(y0) ? [[0, y0]] : [] }; }
      if (solve.kind === 'ext') { var e = M.extrema(f, a, b); return { text: e.length ? e.map(function (p) { return (p.kind === 'max' ? 'Max' : 'Min') + ' (' + fmt(p.x) + ', ' + fmt(p.y) + ')'; }).join(' · ') : 'No turning points in view.', points: e.map(function (p) { return [p.x, p.y]; }) }; }
      if (solve.kind === 'int') {
        if (typeof g2 !== 'function' || fns[solve.g].type === 'r' || solve.g === solve.f) return { text: 'Choose a second, different y = function.', points: [] };
        var d = function (x) { return f(x) - g2(x); }, xs = M.roots(d, a, b, 800);
        return { text: xs.length ? 'Intersections: ' + xs.map(function (x) { return '(' + fmt(x) + ', ' + fmt(f(x)) + ')'; }).join(', ') : 'No intersections in view.', points: xs.map(function (x) { return [x, f(x)]; }) };
      }
      if (solve.kind === 'integral') { var lo = parseFloat(solve.a), hi = parseFloat(solve.b); if (!isFinite(lo) || !isFinite(hi)) return { text: 'Enter the lower and upper limits.', points: [] }; return { text: '∫ from ' + fmt(lo) + ' to ' + fmt(hi) + ' = ' + fmt(M.integrate(f, lo, hi)), points: [] }; }
      return { text: '', points: [] };
    }, [compiled, solve, view, fns]);
    useEffect(function () { draw(); });
    useEffect(function () { var on = function () { draw(); }; window.addEventListener('resize', on); return function () { window.removeEventListener('resize', on); }; }, [draw]);
    function zoom(k, cx, cy) {
      var mx = cx === undefined ? (view.x0 + view.x1) / 2 : cx, my = cy === undefined ? (view.y0 + view.y1) / 2 : cy;
      setView({ x0: mx - (mx - view.x0) * k, x1: mx + (view.x1 - mx) * k, y0: my - (my - view.y0) * k, y1: my + (view.y1 - my) * k });
    }
    function toWorld(e) { var c = canvas.current, r = c.getBoundingClientRect(); return { x: view.x0 + (e.clientX - r.left) / r.width * (view.x1 - view.x0), y: view.y1 - (e.clientY - r.top) / r.height * (view.y1 - view.y0), r: r }; }
    function onMove(e) {
      var w = toWorld(e);
      if (drag.current) {
        var dxp = e.clientX - drag.current.cx, dyp = e.clientY - drag.current.cy, v0 = drag.current.v;
        var dx = dxp / w.r.width * (v0.x1 - v0.x0), dy = dyp / w.r.height * (v0.y1 - v0.y0);
        setView({ x0: v0.x0 - dx, x1: v0.x1 - dx, y0: v0.y0 + dy, y1: v0.y1 + dy }); return;
      }
      var best = null;
      compiled.forEach(function (f, i) { if (typeof f !== 'function' || fns[i].type === 'r') return; var y = f(w.x); if (!isFinite(y)) return; var d = Math.abs(y - w.y); if (!best || d < best.d) best = { i: i, x: w.x, y: y, d: d }; });
      setTrace(best);
    }
    function autoFit() {
      var ys = [];
      compiled.forEach(function (f, i) { if (typeof f !== 'function' || fns[i].type === 'r') return; for (var k = 0; k <= 200; k++) { var y = f(view.x0 + k / 200 * (view.x1 - view.x0)); if (isFinite(y)) ys.push(y); } });
      if (!ys.length) return; ys.sort(function (a, b) { return a - b; });
      var lo = ys[Math.floor(ys.length * 0.02)], hi = ys[Math.floor(ys.length * 0.98)], pad = (hi - lo) * 0.1 || 1;
      setView(Object.assign({}, view, { y0: lo - pad, y1: hi + pad }));
    }
    function setFn(i, patch) { var n = fns.map(function (f, j) { return j === i ? Object.assign({}, f, patch) : f; }); setFns(n); }
    return h('div', { className: 'jx-graph' },
      h('div', { className: 'jx-graph-side' },
        fns.map(function (f, i) {
          return h('div', { key: i, className: 'jx-fn' },
            h('input', { type: 'checkbox', checked: f.on, 'aria-label': 'Show function ' + (i + 1), onChange: function (e) { setFn(i, { on: e.target.checked }); } }),
            h('select', { value: f.type, 'aria-label': 'Function type', onChange: function (e) { setFn(i, { type: e.target.value }); } }, h('option', { value: 'y' }, 'Y' + (i + 1) + '='), h('option', { value: 'r' }, 'r' + (i + 1) + '=')),
            h('input', { className: 'jx-fn-in', value: f.e, style: { borderColor: COLORS[i] }, placeholder: f.type === 'r' ? 'e.g. 2sin(3θ)' : 'e.g. x^3-2x', 'aria-label': 'Function ' + (i + 1), onChange: function (e) { setFn(i, { e: e.target.value, on: true }); } }),
            compiled[i] === 'err' && h('span', { className: 'jx-bad', title: 'Syntax error' }, '!'));
        }),
        h('div', { className: 'jx-row jx-form jx-window' },
          ['x0', 'x1', 'y0', 'y1'].map(function (k) { return h('label', { key: k }, { x0: 'x min', x1: 'x max', y0: 'y min', y1: 'y max' }[k], h('input', { type: 'number', value: +view[k].toPrecision(6), onChange: function (e) { var v = parseFloat(e.target.value); if (isFinite(v)) { var o = Object.assign({}, view); o[k] = v; setView(o); } } })); })),
        h('div', { className: 'jx-row' },
          h('button', { type: 'button', className: 'secondary', onClick: function () { zoom(0.5); } }, 'Zoom in'), h('button', { type: 'button', className: 'secondary', onClick: function () { zoom(2); } }, 'Zoom out'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { setView({ x0: -10, x1: 10, y0: -6, y1: 6 }); } }, 'Standard'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { setView({ x0: -2 * Math.PI, x1: 2 * Math.PI, y0: -1.6, y1: 1.6 }); } }, 'Trig'),
          h('button', { type: 'button', className: 'secondary', onClick: autoFit }, 'Auto fit')),
        h('h4', null, 'G-Solve'),
        h('div', { className: 'jx-row jx-form' },
          h('label', null, 'Find', h('select', { value: solve.kind, onChange: function (e) { setSolve(Object.assign({}, solve, { kind: e.target.value })); } },
            [['roots', 'Roots'], ['ext', 'Max / Min'], ['yint', 'y-intercept'], ['int', 'Intersections'], ['integral', '∫ dx (area)']].map(function (o) { return h('option', { key: o[0], value: o[0] }, o[1]); }))),
          h('label', null, 'of', h('select', { value: solve.f, onChange: function (e) { setSolve(Object.assign({}, solve, { f: +e.target.value })); } }, fns.map(function (f, i) { return h('option', { key: i, value: i }, 'Y' + (i + 1)); }))),
          solve.kind === 'int' && h('label', null, 'and', h('select', { value: solve.g, onChange: function (e) { setSolve(Object.assign({}, solve, { g: +e.target.value })); } }, fns.map(function (f, i) { return h('option', { key: i, value: i }, 'Y' + (i + 1)); }))),
          solve.kind === 'integral' && [h('label', { key: 'a' }, 'from', h('input', { value: solve.a, onChange: function (e) { setSolve(Object.assign({}, solve, { a: e.target.value })); } })), h('label', { key: 'b' }, 'to', h('input', { value: solve.b, onChange: function (e) { setSolve(Object.assign({}, solve, { b: e.target.value })); } }))]),
        h('p', { className: 'jx-solve', 'aria-live': 'polite' }, solveResult.text)),
      h('div', { className: 'jx-graph-main', ref: wrap },
        h('canvas', { ref: canvas, className: 'jx-canvas', role: 'img', 'aria-label': 'Graph of the active functions',
          onPointerDown: function (e) { drag.current = { cx: e.clientX, cy: e.clientY, v: view }; try { e.target.setPointerCapture(e.pointerId); } catch (x) {} },
          onPointerUp: function () { drag.current = null; }, onPointerLeave: function () { drag.current = null; setTrace(null); }, onPointerMove: onMove,
          onWheel: function (e) { e.preventDefault(); var w = toWorld(e); zoom(e.deltaY > 0 ? 1.15 : 1 / 1.15, w.x, w.y); } }),
        h('p', { className: 'jx-trace' }, trace ? 'Trace Y' + (trace.i + 1) + ':  x = ' + fmt(trace.x) + ',  y = ' + fmt(trace.y) : 'Move over the graph to trace. Drag to pan; scroll or use the buttons to zoom.')));
  }

  /* ======================= GUIDE ======================= */
  var GUIDE = [
    ['Getting started', ['Type with the keys or your keyboard. Press = (or Enter) to calculate.', 'Choose Deg, Rad or Gra (gradians) for angles before using sin, cos or tan. The scientific calculator remembers your choice.', 'The live preview under your expression shows the answer as you type.', 'AC clears the expression; DEL deletes the last character. Tap a line in History to edit it again.']],
    ['Natural display & S⇔D', ['Results first appear in exact form where possible: fractions (3/4), surds (√3/2) and multiples of π (π/4).', 'Press S⇔D to cycle through decimal, mixed fraction (2 1/2), engineering notation (12.3×10^3) and degrees-minutes-seconds (30°30′45″).', 'Casio equivalent: the S⇔D key and the FORMAT menu on the fx-991CW.']],
    ['Powers, roots and logs', ['x² and x³ square and cube; xʸ (^) raises to any power: 2^10.', '√( ) square root, ∛( ) cube root, root(n, x) the nth root: root(4, 81) = 3.', 'log(x) is base 10, ln(x) is base e, log(b, x) is log base b of x: log(2, 8) = 3.', '×10ˣ enters scientific notation: 1.5E3 means 1.5 × 10³.']],
    ['Trigonometry', ['sin, cos, tan and their inverses sin⁻¹, cos⁻¹, tan⁻¹ use the current angle unit.', 'Add ° to an angle to force degrees in any mode: sin(90°).', 'Hyperbolic functions: type sinh(, cosh(, tanh(.', 'Pol(x, y) converts rectangular to polar (stores r in X and θ in Y); Rec(r, θ) converts back.']],
    ['Memory and variables', ['Ans holds the last answer. Starting a new calculation with an operator (+ × …) uses Ans automatically.', 'STO then a letter stores the result in A, B, C, D, x or y. Tap the letter later to use it.', 'M+ adds the current result to independent memory M; M− subtracts; MR recalls M.']],
    ['Statistics', ['Enter x values for one-variable statistics: mean, sum, population (σx) and sample (sx) standard deviation, quartiles and mode.', 'Add matching y values for two-variable regression: linear, quadratic, logarithmic, exponential and power, with r and r².', 'Quartiles use the same method as Casio scientific calculators (median of each half, excluding the median when n is odd).']],
    ['Distribution', ['Normal: P(X ≤ x), area between two values, probability density, and inverse normal from a left-tail area.', 'Binomial: P(X = k), P(X ≤ k), P(X ≥ k) for n trials with success probability p.', 'Poisson: the same probabilities for a mean rate λ.']],
    ['Equation, Matrix, Base-N', ['Polynomial solves degree 2 to 4 (real and complex roots) and shows the discriminant and turning point for quadratics.', 'Simultaneous solves 2 to 4 linear equations. Solve finds a root of any f(x) = 0 near your starting value.', 'Matrix: determinant, inverse, transpose, square, add, subtract and multiply for 2×2 to 4×4.', 'Base-N converts between decimal, hexadecimal, binary and octal, with AND, OR, XOR and NOT.']],
    ['Calculus and tables', ['d/dx gives the derivative of f(x) at a point; ∫ gives a definite integral; Σ adds a series. These use radians.', 'Table lists f(x) (and optionally g(x)) from a start value to an end value in steps.']],
    ['Graphing calculator', ['Enter up to six functions. Choose Y= for y = f(x), or r= for polar graphs r = f(θ).', 'Drag the graph to pan; scroll, pinch or use the buttons to zoom. Standard sets −10 to 10; Trig sets −2π to 2π; Auto fit scales y to your graphs.', 'Move over the graph to trace coordinates.', 'G-Solve finds roots, maximum and minimum points, the y-intercept, intersections between two graphs, and the area under a curve (shaded).', 'Casio equivalent: the G-Solve menu (SHIFT F5) on the fx-CG50.']],
    ['Good habits for exams', ['Check your angle unit — it is the most common source of wrong trig answers.', 'Estimate first so you can spot an impossible answer.', 'Use brackets generously: 1/(2π) is clearer than 1/2π (this calculator, like Casio, treats 2π as one term).', 'Our calculators are learning tools. In NZQA assessments, follow the official list of approved calculators and exam conditions.']]
  ];
  function GuideTab() {
    return h('div', null,
      h('p', { className: 'jx-muted' }, 'How to use the scientific and graphing calculators. Key names match common Casio models (fx-991CW and fx-CG50) so the skills transfer to a real calculator. The James NZ is not affiliated with Casio; features and results may differ from physical calculators.'),
      h(JNZX.Accordion, { openFirst: true, items: GUIDE.map(function (g) { return { title: g[0], body: function () { return h('ul', null, g[1].map(function (x, i) { return h('li', { key: i }, x); })); } }; }) }));
  }

  /* ======================= MONTE CARLO SIMULATIONS ======================= */
  function useCanvas(drawFn, deps) {
    var ref = useRef(null);
    useEffect(function () {
      var c = ref.current; if (!c) return;
      var dpr = window.devicePixelRatio || 1, W = c.clientWidth, H = c.clientHeight; c.width = W * dpr; c.height = H * dpr;
      var g = c.getContext('2d'); g.setTransform(dpr, 0, 0, dpr, 0, 0);
      var dark = document.documentElement.dataset.readingTheme === 'dark';
      g.fillStyle = dark ? '#0f1d27' : '#fff'; g.fillRect(0, 0, W, H);
      drawFn(g, W, H, dark);
    }, deps);
    return ref;
  }
  function bars(g, W, H, dark, values, labels, color, refLine) {
    var max = Math.max.apply(null, values.concat(refLine || [])) || 1, n = values.length, bw = (W - 40) / n;
    g.fillStyle = color;
    values.forEach(function (v, i) { var bh = v / max * (H - 30); g.fillRect(30 + i * bw + 1, H - 20 - bh, Math.max(1, bw - 2), bh); });
    if (refLine) { g.strokeStyle = dark ? '#ffd36b' : '#b42132'; g.lineWidth = 2; g.beginPath(); refLine.forEach(function (v, i) { var y = H - 20 - v / max * (H - 30), x = 30 + i * bw + bw / 2; if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke(); }
    g.fillStyle = dark ? '#b5c4d2' : '#4b6077'; g.font = '11px Arial';
    var every = Math.ceil(n / 14);
    labels.forEach(function (l, i) { if (i % every === 0) g.fillText(l, 30 + i * bw + bw / 2 - 6, H - 5); });
  }
  function SimPi() {
    var n = useState(5000), N = n[0], setN = n[1], s = useState(1), seed = s[0], setSeed = s[1];
    var data = useMemo(function () { var r = M.rng(seed), pts = [], inside = 0, conv = []; for (var i = 1; i <= N; i++) { var x = r(), y = r(), hit = x * x + y * y <= 1; if (hit) inside++; if (i <= 4000) pts.push([x, y, hit]); if (i % Math.max(1, Math.floor(N / 200)) === 0) conv.push(4 * inside / i); } return { pts: pts, est: 4 * inside / N, conv: conv }; }, [N, seed]);
    var ref = useCanvas(function (g, W, H, dark) {
      var S = Math.min(W, H) - 10;
      g.strokeStyle = dark ? '#8aa0b2' : '#33475b'; g.strokeRect(5, 5, S, S); g.beginPath(); g.arc(5, 5 + S, S, -Math.PI / 2, 0); g.stroke();
      data.pts.forEach(function (p) { g.fillStyle = p[2] ? '#1f5fbf' : '#ef6c00'; g.fillRect(5 + p[0] * S - 1, 5 + S - p[1] * S - 1, 2, 2); });
    }, [data]);
    return h('div', { className: 'jx-sim' },
      h('p', null, 'Throw random darts at a 1 × 1 square. The share that land inside the quarter circle approaches π/4, so 4 × (inside ÷ total) estimates π.'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Darts: ' + N.toLocaleString(), h('input', { type: 'range', min: 100, max: 200000, step: 100, value: N, onChange: function (e) { setN(+e.target.value); } })), h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'Run again')),
      h('div', { className: 'jx-cards2' }, h('canvas', { ref: ref, className: 'jx-canvas jx-sq', role: 'img', 'aria-label': 'Dart positions' }),
        h('div', null, h('p', { className: 'jx-big' }, 'π ≈ ' + data.est.toFixed(5)), h('p', null, 'Error: ' + (data.est - Math.PI).toFixed(5) + ' (' + (Math.abs(data.est - Math.PI) / Math.PI * 100).toFixed(3) + '%)'), h('p', { className: 'jx-muted' }, 'The error shrinks roughly like 1/√n: 100 times more darts gives about 10 times more accuracy. (The picture shows up to 4 000 darts.)'))));
  }
  function SimDice() {
    var k = useState(2), K = k[0], setK = k[1], n = useState(10000), N = n[0], setN = n[1], s = useState(1), seed = s[0], setSeed = s[1];
    var data = useMemo(function () {
      var r = M.rng(seed), counts = new Array(6 * K + 1).fill(0);
      for (var i = 0; i < N; i++) { var t = 0; for (var j = 0; j < K; j++) t += 1 + Math.floor(r() * 6); counts[t]++; }
      var exact = [1]; for (var d = 0; d < K; d++) { var nx = new Array(exact.length + 6).fill(0); exact.forEach(function (p, a) { for (var f = 1; f <= 6; f++) nx[a + f] += p / 6; }); exact = nx; }
      var sums = [], obs = [], exp = []; for (var v = K; v <= 6 * K; v++) { sums.push(String(v)); obs.push(counts[v] / N); exp.push(exact[v] || 0); }
      return { sums: sums, obs: obs, exp: exp };
    }, [K, N, seed]);
    var ref = useCanvas(function (g, W, H, dark) { bars(g, W, H, dark, data.obs, data.sums, '#1f5fbf', data.exp); }, [data]);
    var mode = data.sums[data.obs.indexOf(Math.max.apply(null, data.obs))];
    return h('div', { className: 'jx-sim' },
      h('p', null, 'Roll several dice many times and record the total. Bars show simulated results; the line shows the exact probabilities.'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Dice', h('select', { value: K, onChange: function (e) { setK(+e.target.value); } }, [1, 2, 3, 4, 5, 6].map(function (x) { return h('option', { key: x, value: x }, x); }))), h('label', null, 'Rolls', h('select', { value: N, onChange: function (e) { setN(+e.target.value); } }, [100, 1000, 10000, 100000].map(function (x) { return h('option', { key: x, value: x }, x.toLocaleString()); }))), h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'Roll again')),
      h('canvas', { ref: ref, className: 'jx-canvas jx-wide-canvas', role: 'img', 'aria-label': 'Histogram of dice totals' }),
      h('p', { className: 'jx-muted' }, 'Most common total in this run: ' + mode + '. With more dice the shape looks like a bell curve — the central limit theorem in action.'));
  }
  function SimMonty() {
    var n = useState(3000), N = n[0], setN = n[1], s = useState(1), seed = s[0], setSeed = s[1];
    var r = useMemo(function () { var g = M.rng(seed), stay = 0, sw = 0; for (var i = 0; i < N; i++) { var car = Math.floor(g() * 3), pick = Math.floor(g() * 3); if (pick === car) stay++; else sw++; } return { stay: stay / N, sw: sw / N }; }, [N, seed]);
    return h('div', { className: 'jx-sim' },
      h('p', null, 'A prize is behind one of three doors. You pick one; the host, who knows where the prize is, opens another door with nothing behind it. Should you switch?'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Games: ' + N.toLocaleString(), h('input', { type: 'range', min: 100, max: 100000, step: 100, value: N, onChange: function (e) { setN(+e.target.value); } })), h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'Play again')),
      h('div', { className: 'jx-cards2' }, h('div', { className: 'jx-card' }, h('h4', null, 'Always stay'), h('p', { className: 'jx-big' }, (r.stay * 100).toFixed(1) + '% wins'), h('div', { className: 'jx-meter' }, h('span', { style: { width: r.stay * 100 + '%' } }))),
        h('div', { className: 'jx-card' }, h('h4', null, 'Always switch'), h('p', { className: 'jx-big' }, (r.sw * 100).toFixed(1) + '% wins'), h('div', { className: 'jx-meter' }, h('span', { style: { width: r.sw * 100 + '%' } })))),
      h('p', { className: 'jx-muted' }, 'Switching wins about 2/3 of the time, because your first pick is wrong 2 times in 3, and the host’s choice then points to the prize.'));
  }
  function SimBirthday() {
    var k = useState(23), K = k[0], setK = k[1], s = useState(1), seed = s[0], setSeed = s[1];
    var r = useMemo(function () { var g = M.rng(seed), hits = 0, N = 20000; for (var i = 0; i < N; i++) { var seen = new Uint8Array(365), dup = false; for (var j = 0; j < K; j++) { var d = Math.floor(g() * 365); if (seen[d]) { dup = true; break; } seen[d] = 1; } if (dup) hits++; } var p = 1; for (var q = 0; q < K; q++) p *= (365 - q) / 365; return { sim: hits / N, exact: 1 - p }; }, [K, seed]);
    return h('div', { className: 'jx-sim' },
      h('p', null, 'How likely is it that at least two people in a group share a birthday? (Ignoring 29 February and assuming birthdays are equally likely.)'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Group size: ' + K, h('input', { type: 'range', min: 2, max: 80, value: K, onChange: function (e) { setK(+e.target.value); } })), h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'Simulate again')),
      h('p', { className: 'jx-big' }, 'Simulated: ' + (r.sim * 100).toFixed(1) + '%   ·   Exact: ' + (r.exact * 100).toFixed(1) + '%'),
      h('p', { className: 'jx-muted' }, 'With just 23 people the chance passes 50%; with 57 it is over 99%. Our intuition underestimates how many pairs a group contains: 23 people make 253 pairs.'));
  }
  function SimWalk() {
    var n = useState(500), N = n[0], setN = n[1], s = useState(1), seed = s[0], setSeed = s[1];
    var path = useMemo(function () { var g = M.rng(seed), p = [0]; for (var i = 0; i < N; i++) p.push(p[p.length - 1] + (g() < 0.5 ? -1 : 1)); return p; }, [N, seed]);
    var ref = useCanvas(function (g, W, H, dark) {
      var mx = Math.max(5, Math.max.apply(null, path.map(Math.abs)));
      g.strokeStyle = dark ? '#3c5263' : '#d7e0e8'; g.beginPath(); g.moveTo(0, H / 2); g.lineTo(W, H / 2); g.stroke();
      g.strokeStyle = '#2e7d32'; g.lineWidth = 1.6; g.beginPath(); path.forEach(function (v, i) { var x = i / N * W, y = H / 2 - v / mx * (H / 2 - 8); if (i) g.lineTo(x, y); else g.moveTo(x, y); }); g.stroke();
      g.strokeStyle = dark ? '#ffd36b' : '#b42132'; g.setLineDash([4, 4]); g.beginPath(); for (var i = 0; i <= N; i += 2) { var x = i / N * W, y = H / 2 - Math.sqrt(i) / mx * (H / 2 - 8); if (i) g.lineTo(x, y); else g.moveTo(x, y); } g.stroke();
      g.beginPath(); for (var j = 0; j <= N; j += 2) { var x2 = j / N * W, y2 = H / 2 + Math.sqrt(j) / mx * (H / 2 - 8); if (j) g.lineTo(x2, y2); else g.moveTo(x2, y2); } g.stroke(); g.setLineDash([]);
    }, [path]);
    return h('div', { className: 'jx-sim' },
      h('p', null, 'Flip a coin each step: heads move up one, tails move down one. Where do you end up?'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Steps', h('select', { value: N, onChange: function (e) { setN(+e.target.value); } }, [100, 500, 2000, 10000].map(function (x) { return h('option', { key: x, value: x }, x.toLocaleString()); }))), h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'New walk')),
      h('canvas', { ref: ref, className: 'jx-canvas jx-wide-canvas', role: 'img', 'aria-label': 'Random walk path' }),
      h('p', { className: 'jx-muted' }, 'Final position: ' + path[path.length - 1] + '. The dashed curves show ±√n — typical distance grows with the square root of the number of steps.'));
  }
  function SimRisk() {
    var t = JNZX.useStored('jnzx-sim-risk', [
      { name: 'Design', lo: 8, ml: 10, hi: 16 }, { name: 'Procurement', lo: 12, ml: 15, hi: 25 }, { name: 'Construction', lo: 30, ml: 38, hi: 55 }, { name: 'Testing & handover', lo: 4, ml: 5, hi: 9 }
    ]), tasks = t[0], setTasks = t[1];
    var b = useState('70'), budget = b[0], setBudget = b[1], u = useState('days'), unit = u[0], setUnit = u[1], s = useState(1), seed = s[0], setSeed = s[1];
    function tri(r, a, m, c) { if (c <= a) return a; var F = (m - a) / (c - a), x = r(); return x < F ? a + Math.sqrt(x * (c - a) * (m - a)) : c - Math.sqrt((1 - x) * (c - a) * (c - m)); }
    var res = useMemo(function () {
      var g = M.rng(seed), N = 20000, tot = new Float64Array(N);
      for (var i = 0; i < N; i++) { var s2 = 0; tasks.forEach(function (k) { var a = +k.lo, m = +k.ml, c = +k.hi; s2 += tri(g, Math.min(a, m, c), Math.min(Math.max(m, Math.min(a, c)), Math.max(a, c)), Math.max(a, m, c)); }); tot[i] = s2; }
      var arr = Array.from(tot).sort(function (a, b2) { return a - b2; }), q = function (p) { return arr[Math.floor(p * (N - 1))]; };
      var lo = arr[0], hi = arr[N - 1], bins = 30, w = (hi - lo) / bins || 1, hist = new Array(bins).fill(0);
      arr.forEach(function (v) { hist[Math.min(bins - 1, Math.floor((v - lo) / w))]++; });
      var bud = parseFloat(budget), under = isFinite(bud) ? arr.filter(function (v) { return v <= bud; }).length / N : null;
      var mlSum = tasks.reduce(function (s3, k) { return s3 + (+k.ml || 0); }, 0);
      return { p10: q(0.1), p50: q(0.5), p80: q(0.8), p90: q(0.9), mean: arr.reduce(function (a2, b3) { return a2 + b3; }, 0) / N, hist: hist.map(function (c) { return c / N; }), labels: hist.map(function (_, i) { return String(Math.round(lo + i * w)); }), under: under, ml: mlSum, pML: arr.filter(function (v) { return v <= mlSum; }).length / N };
    }, [tasks, budget, seed]);
    var ref = useCanvas(function (g, W, H, dark) { bars(g, W, H, dark, res.hist, res.labels, '#8e24aa'); }, [res]);
    function set(i, k, v) { setTasks(tasks.map(function (x, j) { if (j !== i) return x; var o = Object.assign({}, x); o[k] = k === 'name' ? v : v; return o; })); }
    return h('div', { className: 'jx-sim' },
      h('p', null, 'Estimate a project’s total time or cost when each task is uncertain. For each task give an optimistic, most-likely and pessimistic value (a three-point estimate). The simulation samples each task from a triangular distribution 20 000 times.'),
      h('div', { className: 'jx-table-wrap' }, h('table', { className: 'jx-risk' }, h('thead', null, h('tr', null, h('th', null, 'Task'), h('th', null, 'Optimistic'), h('th', null, 'Most likely'), h('th', null, 'Pessimistic'), h('th', null, ''))),
        h('tbody', null, tasks.map(function (k, i) {
          return h('tr', { key: i }, h('td', null, h('input', { value: k.name, 'aria-label': 'Task name', onChange: function (e) { set(i, 'name', e.target.value); } })),
            ['lo', 'ml', 'hi'].map(function (f) { return h('td', { key: f }, h('input', { type: 'number', value: k[f], 'aria-label': f, onChange: function (e) { set(i, f, e.target.value); } })); }),
            h('td', null, h('button', { type: 'button', className: 'secondary jx-fix', onClick: function () { setTasks(tasks.filter(function (_, j) { return j !== i; })); } }, 'Remove')));
        })))),
      h('div', { className: 'jx-row jx-form' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setTasks(tasks.concat([{ name: 'New task', lo: 1, ml: 2, hi: 4 }])); } }, '+ Add task'),
        h('label', null, 'Target / budget', h('input', { type: 'number', value: budget, onChange: function (e) { setBudget(e.target.value); } })),
        h('label', null, 'Unit', h('input', { value: unit, onChange: function (e) { setUnit(e.target.value); } })),
        h('button', { type: 'button', className: 'secondary', onClick: function () { setSeed(seed + 1); } }, 'Run again')),
      h('canvas', { ref: ref, className: 'jx-canvas jx-wide-canvas', role: 'img', 'aria-label': 'Distribution of simulated totals' }),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null,
        h('tr', null, h('th', null, 'Sum of most-likely values'), h('td', null, fmt(res.ml) + ' ' + unit + ' — only ' + (res.pML * 100).toFixed(0) + '% of simulations finish within this')),
        h('tr', null, h('th', null, 'Mean'), h('td', null, fmt(res.mean) + ' ' + unit)),
        h('tr', null, h('th', null, 'P10 / P50 / P80 / P90'), h('td', null, [res.p10, res.p50, res.p80, res.p90].map(function (v) { return fmt(+v.toFixed(2)); }).join(' / ') + ' ' + unit)),
        res.under !== null && h('tr', null, h('th', null, 'Chance of meeting the target'), h('td', null, (res.under * 100).toFixed(1) + '%'))))),
      h('p', { className: 'jx-muted' }, 'P90 means 90% of simulated outcomes were at or below that value — a common basis for contingency in risk management. Tasks are treated as independent; real projects often have correlated risks, which widen the spread.'));
  }
  function SimsTab() {
    return h('div', null,
      h('p', { className: 'jx-muted' }, 'A Monte Carlo simulation uses many random trials to estimate something that is hard to calculate directly. Change the settings and run each one again — every run is a new random experiment.'),
      h(JNZX.Tabs, { id: 'sims', label: 'Simulation', items: [
        { id: 'pi', label: 'Estimate π', render: function () { return h(SimPi); } },
        { id: 'dice', label: 'Dice totals', render: function () { return h(SimDice); } },
        { id: 'risk', label: 'Project risk (cost & time)', render: function () { return h(SimRisk); } },
        { id: 'monty', label: 'Monty Hall', render: function () { return h(SimMonty); } },
        { id: 'bday', label: 'Birthday problem', render: function () { return h(SimBirthday); } },
        { id: 'walk', label: 'Random walk', render: function () { return h(SimWalk); } }
      ] }));
  }

  /* ======================= TRIGONOMETRY ======================= */
  var TRIG = [
    ['Right-angled triangles (SOH CAH TOA)', ['sin θ = opposite / hypotenuse', 'cos θ = adjacent / hypotenuse', 'tan θ = opposite / adjacent = sin θ / cos θ', 'Pythagoras: a² + b² = c² (c is the hypotenuse)', 'Special triangles: 45°–45°–90° has sides 1 : 1 : √2; 30°–60°–90° has sides 1 : √3 : 2']],
    ['Reciprocal and quotient identities', ['csc θ = 1 / sin θ', 'sec θ = 1 / cos θ', 'cot θ = 1 / tan θ = cos θ / sin θ']],
    ['Pythagorean identities', ['sin²θ + cos²θ = 1', '1 + tan²θ = sec²θ', '1 + cot²θ = csc²θ']],
    ['Even, odd and cofunction identities', ['sin(−θ) = −sin θ   (odd)', 'cos(−θ) = cos θ   (even)', 'tan(−θ) = −tan θ   (odd)', 'sin(90° − θ) = cos θ;   cos(90° − θ) = sin θ;   tan(90° − θ) = cot θ']],
    ['Periodicity', ['sin(θ + 360°) = sin θ;   cos(θ + 360°) = cos θ   (period 2π)', 'tan(θ + 180°) = tan θ   (period π)', 'sin(180° − θ) = sin θ;   cos(180° − θ) = −cos θ']],
    ['Compound (sum and difference) angle formulas', ['sin(A ± B) = sin A cos B ± cos A sin B', 'cos(A ± B) = cos A cos B ∓ sin A sin B', 'tan(A ± B) = (tan A ± tan B) / (1 ∓ tan A tan B)']],
    ['Double-angle formulas', ['sin 2θ = 2 sin θ cos θ', 'cos 2θ = cos²θ − sin²θ = 2cos²θ − 1 = 1 − 2sin²θ', 'tan 2θ = 2 tan θ / (1 − tan²θ)']],
    ['Triple-angle formulas', ['sin 3θ = 3 sin θ − 4 sin³θ', 'cos 3θ = 4 cos³θ − 3 cos θ', 'tan 3θ = (3 tan θ − tan³θ) / (1 − 3 tan²θ)']],
    ['Half-angle and power-reduction formulas', ['sin(θ/2) = ±√((1 − cos θ)/2)', 'cos(θ/2) = ±√((1 + cos θ)/2)', 'tan(θ/2) = sin θ / (1 + cos θ) = (1 − cos θ) / sin θ', 'sin²θ = (1 − cos 2θ)/2;   cos²θ = (1 + cos 2θ)/2', 'The sign of a half-angle result depends on the quadrant of θ/2.']],
    ['Product-to-sum formulas', ['sin A cos B = ½[sin(A + B) + sin(A − B)]', 'cos A sin B = ½[sin(A + B) − sin(A − B)]', 'cos A cos B = ½[cos(A − B) + cos(A + B)]', 'sin A sin B = ½[cos(A − B) − cos(A + B)]']],
    ['Sum-to-product formulas', ['sin A + sin B = 2 sin((A + B)/2) cos((A − B)/2)', 'sin A − sin B = 2 cos((A + B)/2) sin((A − B)/2)', 'cos A + cos B = 2 cos((A + B)/2) cos((A − B)/2)', 'cos A − cos B = −2 sin((A + B)/2) sin((A − B)/2)']],
    ['Harmonic (R-form) identity', ['a sin θ + b cos θ = R sin(θ + α), where R = √(a² + b²) and tan α = b/a (choose α in the correct quadrant)', 'Useful for finding the maximum (R) and minimum (−R) of a combined wave.']],
    ['Sine rule (law of sines)', ['a / sin A = b / sin B = c / sin C = 2R (R = circumradius)', 'Use it with two angles and a side (AAS, ASA), or two sides and a non-included angle (SSA).', 'SSA can give two triangles (the ambiguous case) when a < b and a > b sin A.']],
    ['Cosine rule (law of cosines)', ['a² = b² + c² − 2bc cos A', 'cos A = (b² + c² − a²) / (2bc)', 'Use it with three sides (SSS) or two sides and the included angle (SAS).']],
    ['Tangent rule and Mollweide’s formula', ['(a − b)/(a + b) = tan(½(A − B)) / tan(½(A + B))', '(a − b)/c = sin(½(A − B)) / cos(½C)   — a handy check on a solved triangle']],
    ['Area of a triangle', ['Area = ½ ab sin C', 'Heron’s formula: Area = √(s(s − a)(s − b)(s − c)), where s = (a + b + c)/2', 'Area = abc / (4R)  and  Area = rs (r = inradius)']],
    ['Angle sum and exterior angle', ['A + B + C = 180° in any triangle', 'An exterior angle equals the sum of the two opposite interior angles.']],
    ['Radians, arcs and sectors', ['π radians = 180°, so 1 rad ≈ 57.2958°', 'Arc length s = rθ (θ in radians)', 'Sector area = ½ r²θ;   segment area = ½ r²(θ − sin θ)']],
    ['Inverse trigonometric functions', ['sin⁻¹ x has range −90° to 90°', 'cos⁻¹ x has range 0° to 180°', 'tan⁻¹ x has range −90° to 90° (exclusive)', 'sin⁻¹ x + cos⁻¹ x = 90°']],
    ['Complex numbers and calculus links', ['Euler’s formula: e^(iθ) = cos θ + i sin θ', 'De Moivre’s theorem: (cos θ + i sin θ)ⁿ = cos nθ + i sin nθ', 'd/dx sin x = cos x;   d/dx cos x = −sin x;   d/dx tan x = sec²x (x in radians)', 'Small angles (radians): sin x ≈ x,   tan x ≈ x,   cos x ≈ 1 − x²/2']]
  ];
  var UNIT = [[0, '0', '0', '1', '0'], [30, 'π/6', '1/2', '√3/2', '√3/3'], [45, 'π/4', '√2/2', '√2/2', '1'], [60, 'π/3', '√3/2', '1/2', '√3'], [90, 'π/2', '1', '0', 'undefined'], [120, '2π/3', '√3/2', '−1/2', '−√3'], [135, '3π/4', '√2/2', '−√2/2', '−1'], [150, '5π/6', '1/2', '−√3/2', '−√3/3'], [180, 'π', '0', '−1', '0'], [270, '3π/2', '−1', '0', 'undefined'], [360, '2π', '0', '1', '0']];
  function TriangleSolver() {
    var c = useState('SSS'), kind = c[0], setKind = c[1];
    var v = useState({ a: '7', b: '8', c: '9', A: '40', B: '60', C: '' }), val = v[0], setVal = v[1];
    var D = Math.PI / 180, out = [], err = '';
    function f(k) { return parseFloat(val[k]); }
    function finish(a, b, c2, A, B, C) { var area = 0.5 * b * c2 * Math.sin(A * D); out.push({ a: a, b: b, c: c2, A: A, B: B, C: C, area: area, per: a + b + c2 }); }
    try {
      if (kind === 'SSS') { var a = f('a'), b = f('b'), c3 = f('c'); if (!(a > 0 && b > 0 && c3 > 0)) throw Error('Enter three positive sides.'); if (a + b <= c3 || a + c3 <= b || b + c3 <= a) throw Error('These sides cannot make a triangle (triangle inequality).'); var A = Math.acos((b * b + c3 * c3 - a * a) / (2 * b * c3)) / D, B = Math.acos((a * a + c3 * c3 - b * b) / (2 * a * c3)) / D; finish(a, b, c3, A, B, 180 - A - B); }
      else if (kind === 'SAS') { var b2 = f('b'), c4 = f('c'), A2 = f('A'); if (!(b2 > 0 && c4 > 0 && A2 > 0 && A2 < 180)) throw Error('Enter sides b, c and the angle A between them.'); var a2 = Math.sqrt(b2 * b2 + c4 * c4 - 2 * b2 * c4 * Math.cos(A2 * D)); var B2 = Math.acos((a2 * a2 + c4 * c4 - b2 * b2) / (2 * a2 * c4)) / D; finish(a2, b2, c4, A2, B2, 180 - A2 - B2); }
      else if (kind === 'ASA' || kind === 'AAS') { var A3 = f('A'), B3 = f('B'), a3 = f('a'); if (!(A3 > 0 && B3 > 0 && A3 + B3 < 180 && a3 > 0)) throw Error('Enter angles A and B (sum under 180°) and side a.'); var C3 = 180 - A3 - B3, k = a3 / Math.sin(A3 * D); finish(a3, k * Math.sin(B3 * D), k * Math.sin(C3 * D), A3, B3, C3); }
      else if (kind === 'SSA') { var a4 = f('a'), b4 = f('b'), A4 = f('A'); if (!(a4 > 0 && b4 > 0 && A4 > 0 && A4 < 180)) throw Error('Enter sides a, b and angle A (opposite a).'); var sB = b4 * Math.sin(A4 * D) / a4; if (sB > 1 + 1e-12) throw Error('No triangle: side a is too short to reach.'); var Bs = [Math.asin(Math.min(1, sB)) / D]; if (Bs[0] < 90 && 180 - Bs[0] + A4 < 180 && Math.abs(sB - 1) > 1e-12) Bs.push(180 - Bs[0]); Bs.forEach(function (B4) { var C4 = 180 - A4 - B4; if (C4 <= 0) return; finish(a4, b4, a4 * Math.sin(C4 * D) / Math.sin(A4 * D), A4, B4, C4); }); if (!out.length) throw Error('No triangle with these values.'); }
    } catch (e) { err = e.message; }
    var need = { SSS: ['a', 'b', 'c'], SAS: ['b', 'c', 'A'], ASA: ['A', 'B', 'a'], AAS: ['A', 'B', 'a'], SSA: ['a', 'b', 'A'] }[kind];
    return h('div', { className: 'jx-card' },
      h('h3', null, 'Triangle solver'),
      h('p', { className: 'jx-muted' }, 'Sides a, b, c are opposite angles A, B, C. Angles are in degrees.'),
      h(JNZX.Chips, { label: 'What you know', options: ['SSS', 'SAS', 'ASA', 'AAS', 'SSA'], value: kind, onChange: setKind }),
      h('div', { className: 'jx-row jx-form' }, need.map(function (k) { return h('label', { key: k }, (k === k.toUpperCase() ? 'Angle ' : 'Side ') + k, h('input', { value: val[k], inputMode: 'decimal', onChange: function (e) { var o = Object.assign({}, val); o[k] = e.target.value; setVal(o); } })); })),
      err ? h('p', { role: 'alert' }, err) : out.map(function (t, i) {
        return h('div', { key: i, className: 'jx-result' }, out.length > 1 && h('h4', null, 'Solution ' + (i + 1) + ' of 2 (ambiguous case)'),
          h('p', null, 'a = ' + fmt(t.a) + ',  b = ' + fmt(t.b) + ',  c = ' + fmt(t.c)), h('p', null, 'A = ' + fmt(t.A) + '°,  B = ' + fmt(t.B) + '°,  C = ' + fmt(t.C) + '°'), h('p', null, 'Area = ' + fmt(t.area) + ',  perimeter = ' + fmt(t.per)));
      }));
  }
  function TrigTab() {
    return h('div', null,
      h('p', { className: 'jx-muted' }, 'The key trigonometric definitions, identities, rules and theorems, with exact values and a solver for any triangle.'),
      h(TriangleSolver),
      h('h3', null, 'Exact values (unit circle)'),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, ['Degrees', 'Radians', 'sin', 'cos', 'tan'].map(function (x) { return h('th', { key: x }, x); }))), h('tbody', null, UNIT.map(function (r) { return h('tr', { key: r[0] }, r.map(function (c, i) { return h('td', { key: i }, i === 0 ? c + '°' : c); })); })))),
      h('p', { className: 'small-note' }, 'Signs by quadrant — “All Stations To Central”: All positive in Q1, Sin in Q2, Tan in Q3, Cos in Q4.'),
      h(JNZX.Accordion, { items: TRIG.map(function (t) { return { title: t[0], body: function () { return h('ul', { className: 'jx-formulae' }, t[1].map(function (x, i) { return h('li', { key: i }, x); })); } }; }) }));
  }

  /* ======================= PAGE ======================= */
  JNZX.register('x:math', function MathPage(props) {
    if (!M) return h('p', null, 'The maths tools could not load. Please refresh the page.');
    return h('div', null,
      JNZX.Header('LEARNING · MATH', 'Maths tools for every level.', 'A scientific calculator, a graphing calculator, a guide to using them, Monte Carlo simulations and the essential trigonometry theorems — free, in your browser.'),
      h(JNZX.Tabs, { id: 'math', label: 'Math tools', items: [
        { id: 'sci', label: '🧮 Scientific calculator', render: function () { return h(ScientificTab); } },
        { id: 'graph', label: '📈 Graphing calculator', render: function () { return h(Graphing); } },
        { id: 'guide', label: '📘 Calculator guide', render: function () { return h(GuideTab); } },
        { id: 'sim', label: '🎲 Simulations', render: function () { return h(SimsTab); } },
        { id: 'trig', label: '📐 Trigonometry', render: function () { return h(TrigTab); } }
      ] }),
      h(JNZX.ShareBar, { tab: props.tab }));
  });
})();
