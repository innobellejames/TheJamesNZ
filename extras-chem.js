/* The James NZ — Learning › Science › Chemistry (October 2026):
   equation balancer, molar mass, stoichiometry, solutions, gas laws, pH,
   empirical formula, a calculator and guides. All calculations run in the browser. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, Frag = R.Fragment;
  var MASS = null, MASS_P = null;
  function masses() { if (!MASS_P) MASS_P = JNZX.load('./data/elements.json').then(function (els) { MASS = {}; els.forEach(function (e) { MASS[e.symbol] = e.atomic_mass; }); return MASS; }); return MASS_P; }
  function useMasses() { var s = useState(MASS), m = s[0], set = s[1]; useEffect(function () { if (!m) masses().then(set); }, []); return m; }
  function fmt(x, sig) { if (x === null || x === undefined || !isFinite(x)) return '—'; sig = sig || 4; if (x === 0) return '0'; var a = Math.abs(x); if (a >= 1e5 || a < 1e-3) return x.toExponential(sig - 1).replace('e', ' × 10^').replace('^+', '^'); return String(+x.toPrecision(sig)); }
  var SUB = { '0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉' };
  function pretty(f) { return f.replace(/([A-Za-z)\]])(\d+)/g, function (m, a, d) { return a + d.replace(/\d/g, function (c) { return SUB[c]; }); }).replace(/\*/g, '·'); }

  /* ---------- formula parser: H2O, Ca(OH)2, CuSO4·5H2O, [Fe(CN)6]4- ---------- */
  function parseFormula(str) {
    var f = String(str).trim().replace(/\s+/g, '').replace(/[·•.*]/g, '*').replace(/\^?\d*[+-]$/, '').replace(/\(aq\)|\(s\)|\(l\)|\(g\)$/g, '');
    if (!f) throw new Error('Type a formula, for example H2O.');
    var parts = f.split('*'), total = {};
    parts.forEach(function (part, pi) {
      var mult = 1, m = /^(\d+)(.*)$/.exec(part);
      if (pi > 0 && m) { mult = +m[1]; part = m[2]; }
      var i = 0;
      function group() {
        var out = {};
        while (i < part.length) {
          var c = part[i];
          if (c === '(' || c === '[') { i++; var inner = group(); if (part[i] !== ')' && part[i] !== ']') throw new Error('Missing closing bracket in ' + str); i++; var n = num(); for (var k in inner) out[k] = (out[k] || 0) + inner[k] * n; }
          else if (c === ')' || c === ']') return out;
          else if (/[A-Z]/.test(c)) { var sym = c; i++; if (i < part.length && /[a-z]/.test(part[i])) { sym += part[i]; i++; } if (MASS && !(sym in MASS)) throw new Error('“' + sym + '” isn’t an element symbol. Check capitals: Co is cobalt, CO is carbon monoxide.'); var n2 = num(); out[sym] = (out[sym] || 0) + n2; }
          else throw new Error('Unexpected “' + c + '” in ' + str + '. Use capitals for element symbols, e.g. NaCl.');
        }
        return out;
      }
      function num() { var s = ''; while (i < part.length && /\d/.test(part[i])) s += part[i++]; return s ? +s : 1; }
      var g = group(); if (i < part.length) throw new Error('Check the brackets in ' + str);
      for (var k in g) total[k] = (total[k] || 0) + g[k] * mult;
    });
    return total;
  }
  function molarMass(counts) { var m = 0; for (var k in counts) m += MASS[k] * counts[k]; return m; }

  /* ---------- equation balancer ---------- */
  function splitSide(s) { return s.split(/\s\+\s|\s*\+\s*(?=[A-Z(\[0-9])/).map(function (x) { return x.trim(); }).filter(Boolean); }
  function parseEq(eq) {
    var sides = eq.replace(/⟶|→|->|=>|=/g, '→').split('→');
    if (sides.length !== 2) throw new Error('Use an arrow between reactants and products, for example: H2 + O2 -> H2O');
    var L = splitSide(sides[0]), Rr = splitSide(sides[1]);
    if (!L.length || !Rr.length) throw new Error('Add at least one reactant and one product.');
    function clean(x) { return x.replace(/^\d+\s*/, ''); }
    return { left: L.map(clean), right: Rr.map(clean) };
  }
  function balance(eq) {
    var p = parseEq(eq), all = p.left.concat(p.right), comp = all.map(parseFormula), els = [];
    comp.forEach(function (c) { for (var k in c) if (els.indexOf(k) < 0) els.push(k); });
    var n = all.length, M = els.map(function (e) { return all.map(function (_, j) { return (comp[j][e] || 0) * (j < p.left.length ? 1 : -1); }); });
    // RREF with floats
    var rows = M.map(function (r) { return r.slice(); }), lead = 0, piv = [];
    for (var r = 0; r < rows.length && lead < n; r++) {
      var i = r; while (Math.abs(rows[i][lead]) < 1e-12) { i++; if (i === rows.length) { i = r; lead++; if (lead === n) break; } }
      if (lead === n) break;
      var t = rows[i]; rows[i] = rows[r]; rows[r] = t;
      var lv = rows[r][lead]; rows[r] = rows[r].map(function (v) { return v / lv; });
      for (var k = 0; k < rows.length; k++) if (k !== r) { var f = rows[k][lead]; rows[k] = rows[k].map(function (v, c) { return v - f * rows[r][c]; }); }
      piv.push(lead); lead++;
    }
    var free = []; for (var c = 0; c < n; c++) if (piv.indexOf(c) < 0) free.push(c);
    if (free.length === 0) throw new Error('This equation can’t be balanced — check the formulas (an element may only appear on one side).');
    if (free.length > 1) throw new Error('This equation has more than one way to balance it. Split it into simpler reactions.');
    var fc = free[0], x = new Array(n).fill(0); x[fc] = 1;
    piv.forEach(function (pc, ri) { x[pc] = -rows[ri][fc]; });
    if (x.some(function (v) { return v <= 1e-9; })) { x = x.map(function (v) { return -v; }); }
    if (x.some(function (v) { return v <= 1e-9; })) throw new Error('No positive solution — check that the reactants and products are correct.');
    var best = null;
    for (var mlt = 1; mlt <= 2000; mlt++) { var y = x.map(function (v) { return v * mlt / Math.min.apply(null, x); }); if (y.every(function (v) { return Math.abs(v - Math.round(v)) < 1e-6; })) { best = y.map(Math.round); break; } }
    if (!best) throw new Error('Couldn’t find whole-number coefficients.');
    var g = best.reduce(function gcd(a, b) { return b ? gcd(b, a % b) : a; }); best = best.map(function (v) { return v / g; });
    return { left: p.left, right: p.right, coef: best, els: els, comp: comp };
  }
  function eqText(b, html) {
    function side(list, off) { return list.map(function (s, i) { var c = b.coef[off + i]; return (c > 1 ? c + ' ' : '') + (html ? pretty(s) : s); }).join(' + '); }
    return side(b.left, 0) + ' → ' + side(b.right, b.left.length);
  }

  var REACTIONS = [
    ['Combustion of methane (natural gas)', 'CH4 + O2 -> CO2 + H2O'], ['Burning hydrogen', 'H2 + O2 -> H2O'], ['Photosynthesis', 'CO2 + H2O -> C6H12O6 + O2'],
    ['Respiration (glucose)', 'C6H12O6 + O2 -> CO2 + H2O'], ['Neutralisation: hydrochloric acid + sodium hydroxide', 'HCl + NaOH -> NaCl + H2O'], ['Baking soda + vinegar', 'NaHCO3 + CH3COOH -> CH3COONa + H2O + CO2'],
    ['Rusting of iron', 'Fe + O2 -> Fe2O3'], ['Heating limestone (making lime)', 'CaCO3 -> CaO + CO2'], ['Electrolysis of water', 'H2O -> H2 + O2'],
    ['Combustion of propane (BBQ gas)', 'C3H8 + O2 -> CO2 + H2O'], ['Magnesium burning', 'Mg + O2 -> MgO'], ['Making ammonia (Haber process)', 'N2 + H2 -> NH3'],
    ['Acid + carbonate', 'CaCO3 + HCl -> CaCl2 + H2O + CO2'], ['Precipitation: silver chloride', 'AgNO3 + NaCl -> AgCl + NaNO3'], ['Thermite reaction', 'Al + Fe2O3 -> Al2O3 + Fe'],
    ['Fermentation (making ethanol)', 'C6H12O6 -> C2H5OH + CO2'], ['Zinc + hydrochloric acid', 'Zn + HCl -> ZnCl2 + H2'], ['Combustion of octane (petrol)', 'C8H18 + O2 -> CO2 + H2O']
  ];

  function Card(props) { return h('div', { className: 'jx-card jx-chem-card' }, props.title && h('h3', null, props.title), props.children); }
  function Field(props) { return h('label', null, props.label, h('input', { type: props.type || 'text', inputMode: props.type === 'number' ? 'decimal' : undefined, value: props.value, placeholder: props.ph, style: props.w ? { width: props.w } : null, onChange: function (e) { props.set(e.target.value); } })); }
  function Err(props) { return props.e ? h('p', { className: 'jx-chem-err', role: 'alert' }, '⚠️ ' + props.e) : null; }
  function Tip(props) { return h('div', { className: 'jx-note' }, h('strong', null, '💡 Tip: '), props.children); }

  /* ---------- Balancer + stoichiometry ---------- */
  function Balancer() {
    var M = useMasses();
    var q = JNZX.useStored('jnzx-chem-eq', 'CH4 + O2 -> CO2 + H2O'), eq = q[0], setEq = q[1];
    var am = useState({}), amt = am[0], setAmt = am[1];
    var res = useMemo(function () { if (!M) return null; try { return { b: balance(eq) }; } catch (e) { return { err: e.message }; } }, [eq, M]);
    if (!M) return h('p', null, 'Loading element data…');
    var b = res && res.b, species = b ? b.left.concat(b.right) : [], mm = b ? b.comp.map(molarMass) : [];
    // stoichiometry from entered reactant masses
    var given = species.map(function (s, i) { var v = parseFloat(amt[i]); return isFinite(v) && v > 0 ? v / mm[i] : null; });
    var nL = b ? b.left.length : 0, ext = null, limit = -1;
    if (b) species.forEach(function (_, i) { if (i < nL && given[i] != null) { var e = given[i] / b.coef[i]; if (ext === null || e < ext) { ext = e; limit = i; } } });
    return h('div', null,
      h(Card, { title: '⚖️ Balance a chemical equation' },
        h('label', { className: 'jx-block' }, 'Equation (use -> or = between sides)', h('input', { value: eq, onChange: function (e) { setEq(e.target.value); setAmt({}); }, spellCheck: false, className: 'jx-mono' })),
        h('div', { className: 'jx-row jx-wrap-chips' }, h('span', { className: 'jx-muted' }, 'Try:'), REACTIONS.slice(0, 6).map(function (r) { return h('button', { key: r[1], type: 'button', className: 'jx-chip', onClick: function () { setEq(r[1]); setAmt({}); } }, r[0].split(':')[0].split('(')[0].trim()); })),
        h(Err, { e: res && res.err }),
        b && h(Frag, null,
          h('p', { className: 'jx-chem-eq' }, eqText(b, true)),
          h('div', { className: 'jx-table-wrap' }, h('table', null, h('caption', null, 'Atom check — the same number of each atom on both sides'),
            h('thead', null, h('tr', null, h('th', null, 'Element'), h('th', null, 'Reactants'), h('th', null, 'Products'))),
            h('tbody', null, b.els.map(function (el) { var l = 0, r = 0; b.comp.forEach(function (c, j) { if (j < nL) l += (c[el] || 0) * b.coef[j]; else r += (c[el] || 0) * b.coef[j]; }); return h('tr', { key: el }, h('th', null, el), h('td', null, l), h('td', null, r + (l === r ? ' ✓' : ''))); })))),
          h(JNZX.ShareMini, { title: 'Balanced equation', text: eqText(b, false) }))),
      b && h(Card, { title: '🧮 Reacting amounts (stoichiometry)' },
        h('p', { className: 'jx-muted' }, 'Enter the mass of one or more reactants. We’ll find the limiting reactant and how much of each product you can make.'),
        h('div', { className: 'jx-table-wrap' }, h('table', null,
          h('thead', null, h('tr', null, h('th', null, 'Substance'), h('th', null, 'Coefficient'), h('th', null, 'Molar mass (g/mol)'), h('th', null, 'Your mass (g)'), h('th', null, 'Moles'), h('th', null, 'Result'))),
          h('tbody', null, species.map(function (s, i) {
            var isR = i < nL, mol = ext !== null ? ext * b.coef[i] : null;
            return h('tr', { key: i, className: i === limit ? 'is-limit' : '' },
              h('th', null, pretty(s), h('small', { className: 'jx-muted' }, isR ? ' reactant' : ' product')), h('td', null, b.coef[i]), h('td', null, fmt(mm[i], 5)),
              h('td', null, isR ? h('input', { type: 'number', min: 0, step: 'any', value: amt[i] || '', style: { width: '7em' }, onChange: function (e) { var o = Object.assign({}, amt); o[i] = e.target.value; setAmt(o); } }) : '—'),
              h('td', null, isR ? fmt(given[i]) : fmt(mol)),
              h('td', null, ext === null ? '' : isR ? (i === limit ? 'Limiting — all used' : given[i] != null ? fmt((given[i] - mol) * mm[i]) + ' g left over' : 'needs ' + fmt(mol * mm[i]) + ' g') : 'makes ' + fmt(mol * mm[i]) + ' g'));
          })))),
        ext !== null && h('p', { className: 'small-note' }, 'Method: moles = mass ÷ molar mass. Divide each reactant’s moles by its coefficient — the smallest result is the limiting reactant. Multiply that by each coefficient for the moles used or made, then × molar mass for grams. These are theoretical yields; real reactions usually make less (percentage yield = actual ÷ theoretical × 100).')),
      h(Card, { title: '📚 Common reactions to explore' }, h('div', { className: 'jx-chem-rx' }, REACTIONS.map(function (r) { return h('button', { key: r[1], type: 'button', onClick: function () { setEq(r[1]); setAmt({}); try { window.scrollTo({ top: 0, behavior: 'smooth' }); } catch (e) {} } }, h('strong', null, r[0]), h('span', { className: 'jx-mono' }, pretty(r[1].replace('->', '→')))); }))));
  }

  /* ---------- Molar mass & composition ---------- */
  function MolarMass() {
    var M = useMasses();
    var f = JNZX.useStored('jnzx-chem-formula', 'CuSO4·5H2O'), form = f[0], setForm = f[1];
    var mm = useState('10'), mass = mm[0], setMass = mm[1];
    var r = useMemo(function () { if (!M) return null; try { var c = parseFormula(form); return { c: c, m: molarMass(c) }; } catch (e) { return { err: e.message }; } }, [form, M]);
    if (!M) return h('p', null, 'Loading element data…');
    var n = r && r.m ? parseFloat(mass) / r.m : null;
    return h('div', null,
      h(Card, { title: '⚛️ Molar mass and percentage composition' },
        h('div', { className: 'jx-row jx-form' }, h(Field, { label: 'Formula', value: form, set: setForm, ph: 'e.g. Ca(OH)2' })),
        h('div', { className: 'jx-row jx-wrap-chips' }, ['H2O', 'NaCl', 'CO2', 'C6H12O6', 'CaCO3', 'H2SO4', 'Ca(OH)2', 'NH4NO3', 'CuSO4·5H2O', 'C8H10N4O2'].map(function (x) { return h('button', { key: x, type: 'button', className: 'jx-chip', onClick: function () { setForm(x); } }, pretty(x)); })),
        h(Err, { e: r && r.err }),
        r && r.m && h(Frag, null,
          h('p', { className: 'jx-chem-eq' }, pretty(form) + ' = ' + fmt(r.m, 6) + ' g/mol'),
          h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, ['Element', 'Atoms', 'Atomic mass', 'Mass in formula', '% by mass'].map(function (x) { return h('th', { key: x }, x); }))),
            h('tbody', null, Object.keys(r.c).map(function (el) { var part = M[el] * r.c[el]; return h('tr', { key: el }, h('th', null, el), h('td', null, r.c[el]), h('td', null, fmt(M[el], 6)), h('td', null, fmt(part, 6)), h('td', null, (part / r.m * 100).toFixed(2) + '%')); })))),
          h('div', { className: 'jx-row jx-form' }, h(Field, { label: 'Mass of sample (g)', value: mass, set: setMass, type: 'number', w: '8em' }),
            h('p', { className: 'jx-big-sm' }, '= ' + fmt(n) + ' mol = ' + fmt(n * 6.02214076e23) + ' particles')))),
      h(Tip, null, 'Molar mass = sum of (number of atoms × atomic mass). Brackets multiply everything inside: Ca(OH)₂ has 1 Ca, 2 O and 2 H. Use · or a full stop for hydrates, e.g. CuSO4.5H2O. Caffeine is C8H10N4O2 — try it!'));
  }

  /* ---------- Solutions ---------- */
  function Solutions() {
    var M = useMasses();
    var a = useState({ f: 'NaCl', c: '0.5', v: '250' }), mk = a[0], setMk = a[1];
    var d = useState({ c1: '2', v1: '', c2: '0.5', v2: '100' }), dl = d[0], setDl = d[1];
    var p = useState({ mode: 'H', val: '0.001' }), ph = p[0], setPh = p[1];
    var mmk = null, err = null; if (M) { try { mmk = molarMass(parseFormula(mk.f)); } catch (e) { err = e.message; } }
    var need = mmk ? +mk.c * (+mk.v / 1000) * mmk : null;
    var blanks = ['c1', 'v1', 'c2', 'v2'].filter(function (k) { return dl[k] === '' || isNaN(+dl[k]); }), dres = null;
    if (blanks.length === 1) { var k = blanks[0], c1 = +dl.c1, v1 = +dl.v1, c2 = +dl.c2, v2 = +dl.v2; dres = [k, k === 'c1' ? c2 * v2 / v1 : k === 'v1' ? c2 * v2 / c1 : k === 'c2' ? c1 * v1 / v2 : c1 * v1 / c2]; }
    var x = +ph.val, pH = null; if (x > 0) { if (ph.mode === 'H') pH = -Math.log10(x); else if (ph.mode === 'OH') pH = 14 + Math.log10(x); else if (ph.mode === 'pH') pH = x; }
    return h('div', null,
      h(Card, { title: '🧪 Make a solution (molarity)' },
        h('div', { className: 'jx-row jx-form' }, h(Field, { label: 'Solute formula', value: mk.f, set: function (v) { setMk(Object.assign({}, mk, { f: v })); } }), h(Field, { label: 'Concentration (mol/L)', type: 'number', w: '8em', value: mk.c, set: function (v) { setMk(Object.assign({}, mk, { c: v })); } }), h(Field, { label: 'Volume (mL)', type: 'number', w: '8em', value: mk.v, set: function (v) { setMk(Object.assign({}, mk, { v: v })); } })),
        h(Err, { e: err }),
        need !== null && h('p', { className: 'jx-chem-eq' }, 'Dissolve ' + fmt(need) + ' g of ' + pretty(mk.f) + ', then top up with water to ' + mk.v + ' mL.'),
        h('p', { className: 'small-note' }, 'n = c × V (V in litres) and m = n × M. Here: ' + mk.c + ' × ' + (+mk.v / 1000) + ' L × ' + fmt(mmk, 5) + ' g/mol.')),
      h(Card, { title: '💧 Dilution: C₁V₁ = C₂V₂' },
        h('p', { className: 'jx-muted' }, 'Fill in three values and leave one blank.'),
        h('div', { className: 'jx-row jx-form' }, [['c1', 'C₁ (mol/L)'], ['v1', 'V₁ (mL)'], ['c2', 'C₂ (mol/L)'], ['v2', 'V₂ (mL)']].map(function (f2) { return h(Field, { key: f2[0], label: f2[1], type: 'number', w: '7em', value: dl[f2[0]], set: function (v) { var o = Object.assign({}, dl); o[f2[0]] = v; setDl(o); } }); })),
        dres ? h('p', { className: 'jx-chem-eq' }, { c1: 'C₁', v1: 'V₁', c2: 'C₂', v2: 'V₂' }[dres[0]] + ' = ' + fmt(dres[1]) + (dres[0][0] === 'c' ? ' mol/L' : ' mL')) : h('p', { className: 'small-note' }, blanks.length ? 'Leave exactly one box blank.' : 'Clear one box to solve for it.'),
        dres && dres[0] === 'v1' && h('p', { className: 'small-note' }, 'Measure ' + fmt(dres[1]) + ' mL of the stock solution and add water to make ' + dl.v2 + ' mL. Always add acid to water, never water to acid.')),
      h(Card, { title: '🍋 pH calculator' },
        h('div', { className: 'jx-row jx-form' }, h('label', null, 'I know', h('select', { value: ph.mode, onChange: function (e) { setPh(Object.assign({}, ph, { mode: e.target.value })); } }, h('option', { value: 'H' }, '[H⁺] (mol/L)'), h('option', { value: 'OH' }, '[OH⁻] (mol/L)'), h('option', { value: 'pH' }, 'pH'))), h(Field, { label: 'Value', type: 'number', w: '9em', value: ph.val, set: function (v) { setPh(Object.assign({}, ph, { val: v })); } })),
        pH !== null && isFinite(pH) && h('div', null, h('p', { className: 'jx-chem-eq' }, 'pH = ' + pH.toFixed(2) + ' · pOH = ' + (14 - pH).toFixed(2) + ' · [H⁺] = ' + fmt(Math.pow(10, -pH)) + ' mol/L'),
          h('div', { className: 'jx-ph-bar', 'aria-hidden': true }, h('span', { style: { left: Math.max(0, Math.min(14, pH)) / 14 * 100 + '%' } })),
          h('p', { className: 'jx-muted' }, pH < 7 ? 'Acidic — like ' + (pH < 3 ? 'lemon juice or stomach acid' : pH < 5 ? 'vinegar or orange juice' : 'black coffee or rain') + '.' : pH === 7 ? 'Neutral — like pure water.' : 'Basic (alkaline) — like ' + (pH < 9 ? 'baking soda or sea water' : pH < 12 ? 'soap or ammonia' : 'oven cleaner') + '.')),
        h('p', { className: 'small-note' }, 'pH = −log₁₀[H⁺] and pH + pOH = 14 at 25 °C. This assumes a strong acid or base that fully dissociates.')));
  }

  /* ---------- Gas laws ---------- */
  function Gases() {
    var g = useState({ P: '101.325', V: '', n: '1', T: '25' }), s = g[0], set = g[1];
    var c = useState({ P1: '100', V1: '2', T1: '20', P2: '200', V2: '', T2: '20' }), cg = c[0], setCg = c[1];
    var Rk = 8.314462618, blanks = ['P', 'V', 'n', 'T'].filter(function (k) { return s[k] === '' || isNaN(+s[k]); }), out = null;
    if (blanks.length === 1) { var P = +s.P, V = +s.V, n = +s.n, T = +s.T + 273.15, k = blanks[0]; out = [k, k === 'P' ? n * Rk * T / V : k === 'V' ? n * Rk * T / P : k === 'n' ? P * V / (Rk * T) : P * V / (n * Rk) - 273.15]; }
    var cb = ['P1', 'V1', 'T1', 'P2', 'V2', 'T2'].filter(function (k) { return cg[k] === '' || isNaN(+cg[k]); }), co = null;
    if (cb.length === 1) { var K = function (t) { return +t + 273.15; }, P1 = +cg.P1, V1 = +cg.V1, T1 = K(cg.T1), P2 = +cg.P2, V2 = +cg.V2, T2 = K(cg.T2), kk = cb[0], lhs = P1 * V1 / T1, rhs = P2 * V2 / T2;
      co = [kk, kk === 'P2' ? lhs * T2 / V2 : kk === 'V2' ? lhs * T2 / P2 : kk === 'T2' ? P2 * V2 / lhs - 273.15 : kk === 'P1' ? rhs * T1 / V1 : kk === 'V1' ? rhs * T1 / P1 : P1 * V1 / rhs - 273.15]; }
    var unit = { P: ' kPa', V: ' L', n: ' mol', T: ' °C', P1: ' kPa', P2: ' kPa', V1: ' L', V2: ' L', T1: ' °C', T2: ' °C' };
    return h('div', null,
      h(Card, { title: '🎈 Ideal gas law: PV = nRT' },
        h('p', { className: 'jx-muted' }, 'Leave one box blank to solve for it. R = 8.314 J/(mol·K); kPa × L = J.'),
        h('div', { className: 'jx-row jx-form' }, [['P', 'Pressure P (kPa)'], ['V', 'Volume V (L)'], ['n', 'Amount n (mol)'], ['T', 'Temperature (°C)']].map(function (f) { return h(Field, { key: f[0], label: f[1], type: 'number', w: '8em', value: s[f[0]], set: function (v) { var o = Object.assign({}, s); o[f[0]] = v; set(o); } }); })),
        out ? h('p', { className: 'jx-chem-eq' }, out[0] + ' = ' + fmt(out[1]) + unit[out[0]]) : h('p', { className: 'small-note' }, 'Leave exactly one box blank.'),
        h('p', { className: 'small-note' }, 'At 0 °C and 101.3 kPa one mole of gas takes up about 22.4 L; at 25 °C about 24.5 L. Always convert °C to kelvin (+273.15) in gas calculations — the tool does this for you.')),
      h(Card, { title: '🌡️ Combined gas law: P₁V₁/T₁ = P₂V₂/T₂' },
        h('div', { className: 'jx-row jx-form' }, [['P1', 'P₁ (kPa)'], ['V1', 'V₁ (L)'], ['T1', 'T₁ (°C)'], ['P2', 'P₂ (kPa)'], ['V2', 'V₂ (L)'], ['T2', 'T₂ (°C)']].map(function (f) { return h(Field, { key: f[0], label: f[1], type: 'number', w: '6.5em', value: cg[f[0]], set: function (v) { var o = Object.assign({}, cg); o[f[0]] = v; setCg(o); } }); })),
        co ? h('p', { className: 'jx-chem-eq' }, co[0].replace('1', '₁').replace('2', '₂') + ' = ' + fmt(co[1]) + unit[co[0]]) : h('p', { className: 'small-note' }, 'Leave exactly one box blank.'),
        h('p', { className: 'small-note' }, 'Keep the temperature the same and this becomes Boyle’s law (P₁V₁ = P₂V₂); keep the pressure the same and it is Charles’s law (V₁/T₁ = V₂/T₂).')));
  }

  /* ---------- Empirical formula ---------- */
  function Empirical() {
    var M = useMasses();
    var r = useState([['C', '40.0'], ['H', '6.7'], ['O', '53.3']]), rows = r[0], setRows = r[1];
    var mm = useState('180'), molar = mm[0], setMolar = mm[1];
    if (!M) return h('p', null, 'Loading element data…');
    var ok = rows.every(function (x) { return M[x[0]] && +x[1] > 0; }), result = null, mol = null;
    if (ok) {
      mol = rows.map(function (x) { return +x[1] / M[x[0]]; }); var min = Math.min.apply(null, mol), ratio = mol.map(function (v) { return v / min; });
      for (var k = 1; k <= 6; k++) { var t = ratio.map(function (v) { return v * k; }); if (t.every(function (v) { return Math.abs(v - Math.round(v)) < 0.1; })) { result = t.map(Math.round); break; } }
    }
    var emp = result ? rows.map(function (x, i) { return x[0] + (result[i] > 1 ? result[i] : ''); }).join('') : null, empM = result ? rows.reduce(function (s, x, i) { return s + M[x[0]] * result[i]; }, 0) : null, factor = empM && +molar > 0 ? Math.round(+molar / empM) : null;
    return h('div', null, h(Card, { title: '🔬 Empirical and molecular formula from % composition' },
      h('p', { className: 'jx-muted' }, 'Enter each element and its percentage (or grams) by mass.'),
      rows.map(function (x, i) { return h('div', { key: i, className: 'jx-row jx-form' }, h(Field, { label: 'Element', w: '5em', value: x[0], set: function (v) { var o = rows.slice(); o[i] = [v, x[1]]; setRows(o); } }), h(Field, { label: '% or g', type: 'number', w: '7em', value: x[1], set: function (v) { var o = rows.slice(); o[i] = [x[0], v]; setRows(o); } }), rows.length > 1 && h('button', { type: 'button', className: 'jx-x', 'aria-label': 'Remove', onClick: function () { setRows(rows.filter(function (_, j) { return j !== i; })); } }, '×')); }),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setRows(rows.concat([['N', '']])); } }, '+ Add element'), h(Field, { label: 'Molar mass if known (g/mol)', type: 'number', w: '8em', value: molar, set: setMolar })),
      !ok && h('p', { className: 'small-note' }, 'Use element symbols (C, H, O…) and positive numbers.'),
      ok && h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, ['Element', 'Mass', '÷ atomic mass = moles', '÷ smallest', 'Whole number'].map(function (x) { return h('th', { key: x }, x); }))),
        h('tbody', null, rows.map(function (x, i) { var min = Math.min.apply(null, mol); return h('tr', { key: i }, h('th', null, x[0]), h('td', null, x[1]), h('td', null, fmt(mol[i])), h('td', null, fmt(mol[i] / min, 3)), h('td', null, result ? result[i] : '?')); })))),
      emp && h('p', { className: 'jx-chem-eq' }, 'Empirical formula: ' + pretty(emp) + ' (' + fmt(empM, 5) + ' g/mol)' + (factor && factor > 1 ? ' · Molecular formula: ' + pretty(rows.map(function (x, i) { var n = result[i] * factor; return x[0] + (n > 1 ? n : ''); }).join('')) : '')),
      ok && !emp && h('p', { className: 'small-note' }, 'The ratios aren’t close to whole numbers — check your data.')));
  }

  /* ---------- Guide ---------- */
  var GUIDE = [
    ['How to balance an equation', ['Write the correct formulas first — never change a formula to balance it, only the numbers in front (coefficients).', 'Count the atoms of each element on both sides.', 'Balance elements that appear in only one substance on each side first; leave hydrogen and oxygen until last.', 'Treat polyatomic ions (like SO₄ or NO₃) as one unit if they appear unchanged on both sides.', 'Use the smallest whole numbers, and check every element again at the end.', 'Example: CH₄ + 2O₂ → CO₂ + 2H₂O. Carbon 1 = 1, hydrogen 4 = 4, oxygen 4 = 4. ✓']],
    ['The mole in one minute', ['A mole is a counting number: 6.022 × 10²³ particles (Avogadro’s number) — like a “dozen”, but huge.', 'One mole of an element has a mass in grams equal to its atomic mass: 12.0 g of carbon, 16.0 g of oxygen.', 'n = m ÷ M (moles = mass ÷ molar mass).', 'c = n ÷ V (concentration in mol/L, with volume in litres).', 'Coefficients in a balanced equation are mole ratios: in 2H₂ + O₂ → 2H₂O, 2 mol of hydrogen react with 1 mol of oxygen.']],
    ['Types of reactions', ['Combustion: fuel + oxygen → carbon dioxide + water (+ energy).', 'Neutralisation: acid + base → salt + water.', 'Acid + metal → salt + hydrogen; acid + carbonate → salt + water + carbon dioxide.', 'Precipitation: two solutions mix and form an insoluble solid.', 'Decomposition: one substance breaks into simpler ones (e.g. CaCO₃ → CaO + CO₂).', 'Synthesis: simple substances combine (e.g. N₂ + 3H₂ → 2NH₃).', 'Redox: electrons move from one substance to another (rusting, batteries, burning).']],
    ['Calculator tips', ['Use brackets: mass = moles × molar mass, e.g. 0.25 × (2×1.008 + 16.00).', 'Use the ×10ˣ key for big and small numbers: 6.022×10²³ is 6.022E23.', 'For pH use log: pH = −log(0.001) = 3; and [H⁺] = 10^(−pH).', 'Keep full precision until the end, then round to the least number of significant figures in your data.', 'Check units: mL → L ÷ 1000; °C → K + 273.15; g → kg ÷ 1000.']],
    ['Lab safety', ['Wear eye protection and tie back long hair.', 'Add acid to water, never water to acid.', 'Never taste chemicals, and smell by wafting, not sniffing.', 'Know where the eyewash and fire blanket are.', 'Dispose of chemicals as your teacher instructs — not down the sink unless told it’s safe.', 'At home, never mix cleaning products such as bleach and ammonia or acids — they release toxic gases.']]
  ];
  JNZX.chemTabs = [
    { id: 'balance', label: '⚖️ Equations & amounts', render: function () { return h(Balancer); } },
    { id: 'molar', label: '⚛️ Molar mass', render: function () { return h(MolarMass); } },
    { id: 'solutions', label: '🧪 Solutions & pH', render: function () { return h(Solutions); } },
    { id: 'gases', label: '🎈 Gas laws', render: function () { return h(Gases); } },
    { id: 'empirical', label: '🔬 Empirical formula', render: function () { return h(Empirical); } },
    { id: 'calc', label: '🧮 Calculator', render: function () { return h('div', null, h('p', { className: 'jx-muted' }, 'A full scientific calculator for your chemistry working. Tip: use the ×10ˣ key for numbers like 6.022 × 10²³, and log for pH.'), JNZX.SciCalc ? h(JNZX.SciCalc) : h('p', null, 'Open Learning › Math for the calculator.')); } },
    { id: 'chemguide', label: '📘 Chemistry guide', render: function () { return h(JNZX.Accordion, { openFirst: true, items: GUIDE.map(function (g) { return { title: g[0], body: function () { return h('ul', null, g[1].map(function (x, i) { return h('li', { key: i }, x); })); } }; }) }); } }
  ];
  JNZX._chem = { parseFormula: parseFormula, balance: balance, masses: masses, molarMass: molarMass, eqText: eqText };
})();
