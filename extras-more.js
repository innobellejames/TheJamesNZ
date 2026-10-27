/* The James NZ — Community › NZ Public Holidays and Job Search NZ;
   Learning › Speech › Speaking Time Calculator and NZ Sign Language (October 2026). */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef;
  function ul(a) { return h('ul', null, a.map(function (x, i) { return h('li', { key: i }, x); })); }
  function ext(href, text) { return h('a', { href: href, target: '_blank', rel: 'noopener noreferrer' }, text); }

  /* =========================== PUBLIC HOLIDAYS =========================== */
  var DAY = 86400000;
  function D(y, m, d) { var x = new Date(Date.UTC(2000, m - 1, d)); x.setUTCFullYear(y); return x; }
  function add(d, n) { return new Date(d.getTime() + n * DAY); }
  function dow(d) { return d.getUTCDay(); }
  function easter(y) {
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3),
      hh = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - hh - k) % 7, m = Math.floor((a + 11 * hh + 22 * l) / 451),
      month = Math.floor((hh + l - 7 * m + 114) / 31), day = ((hh + l - 7 * m + 114) % 31) + 1;
    return D(y, month, day);
  }
  function nthWeekday(y, m, wd, n) { var d = D(y, m, 1); while (dow(d) !== wd) d = add(d, 1); return add(d, 7 * (n - 1)); }
  function mondayNearest(d) { var w = dow(d); var off = { 0: 1, 1: 0, 2: -1, 3: -2, 4: -3, 5: 3, 6: 2 }[w]; return add(d, off); }
  function nextMonday(d) { var x = add(d, 1); while (dow(x) !== 1) x = add(x, 1); return x; }
  // Te Kāhui o Matariki Public Holiday Act 2022, Schedule 1
  var MATARIKI = { 2022: [6, 24], 2023: [7, 14], 2024: [6, 28], 2025: [6, 20], 2026: [7, 10], 2027: [6, 25], 2028: [7, 14], 2029: [7, 6], 2030: [6, 21], 2031: [7, 11], 2032: [7, 2], 2033: [6, 24], 2034: [7, 7], 2035: [6, 29], 2036: [7, 18], 2037: [7, 10], 2038: [6, 25], 2039: [7, 15], 2040: [7, 6], 2041: [7, 19], 2042: [7, 11], 2043: [7, 3], 2044: [6, 24], 2045: [7, 7], 2046: [6, 29], 2047: [7, 19], 2048: [7, 3], 2049: [6, 25], 2050: [7, 15], 2051: [6, 30], 2052: [6, 21] };
  // pair: two consecutive holidays (25/26 Dec, 1/2 Jan) — Holidays Act 2003 transfer rules
  function pair(y, m, d1, n1, n2) {
    var a = D(y, m, d1), b = add(a, 1), wa = dow(a), oa = null, ob = null;
    if (wa === 5) ob = add(b, 2); // Fri + Sat → Sat observed Monday
    else if (wa === 6) { oa = add(a, 2); ob = add(a, 3); } // Sat + Sun → Mon + Tue
    else if (wa === 0) oa = add(a, 2); // Sun + Mon → Sun observed Tuesday
    return [{ name: n1, date: a, observed: oa }, { name: n2, date: b, observed: ob }];
  }
  function single(name, date, mondayise) { var w = dow(date); return { name: name, date: date, observed: mondayise && (w === 0 || w === 6) ? nextMonday(date) : null }; }
  function national(y) {
    var out = [];
    pair(y, 1, 1, 'New Year’s Day', 'Day after New Year’s Day').forEach(function (x) { out.push(x); });
    if (y >= 1974) out.push(single(y <= 1976 ? 'New Zealand Day (Waitangi Day)' : 'Waitangi Day', D(y, 2, 6), y >= 2014));
    var e = easter(y);
    out.push({ name: 'Good Friday', date: add(e, -2) });
    out.push({ name: 'Easter Monday', date: add(e, 1) });
    if (y >= 1921) out.push(single('Anzac Day', D(y, 4, 25), y >= 2015));
    if (y >= 1952) out.push({ name: y >= 2023 || y === 1952 ? 'King’s Birthday' : 'Queen’s Birthday', date: nthWeekday(y, 6, 1, 1) });
    if (y === 1952) out[out.length - 1].name = 'Queen’s Birthday';
    if (MATARIKI[y]) out.push({ name: 'Matariki', date: D(y, MATARIKI[y][0], MATARIKI[y][1]) });
    if (y >= 1910) out.push({ name: 'Labour Day', date: nthWeekday(y, 10, 1, 4) });
    pair(y, 12, 25, 'Christmas Day', 'Boxing Day').forEach(function (x) { out.push(x); });
    out.forEach(function (x) { x.kind = 'National'; });
    if (y === 2022) out.push({ name: 'Queen Elizabeth II Memorial Day', date: D(2022, 9, 26), kind: 'National', note: 'One-off public holiday in 2022.' });
    return out;
  }
  var REGIONS = [
    ['Auckland', 'Auckland Anniversary Day', 'Northland, Auckland, Waikato, Bay of Plenty, Gisborne and nearby areas', function (y) { return mondayNearest(D(y, 1, 29)); }, 'Monday nearest 29 January'],
    ['Wellington', 'Wellington Anniversary Day', 'Wellington, Wairarapa, Manawatū-Whanganui and nearby areas', function (y) { return mondayNearest(D(y, 1, 22)); }, 'Monday nearest 22 January'],
    ['Nelson', 'Nelson Anniversary Day', 'Nelson and Tasman', function (y) { return mondayNearest(D(y, 2, 1)); }, 'Monday nearest 1 February'],
    ['Taranaki', 'Taranaki Anniversary Day', 'Taranaki', function (y) { return nthWeekday(y, 3, 1, 2); }, 'Second Monday in March'],
    ['Otago', 'Otago Anniversary Day', 'Otago', function (y) { var d = mondayNearest(D(y, 3, 23)); return d.getTime() === add(easter(y), 1).getTime() ? add(d, 1) : d; }, 'Monday nearest 23 March (Tuesday if that is Easter Monday)'],
    ['Southland', 'Southland Anniversary Day', 'Southland', function (y) { return y >= 2012 ? add(easter(y), 2) : mondayNearest(D(y, 1, 17)); }, 'Easter Tuesday (since 2012)'],
    ['South Canterbury', 'South Canterbury Anniversary Day', 'South Canterbury', function (y) { return nthWeekday(y, 9, 1, 4); }, 'Fourth Monday in September'],
    ['Hawke’s Bay', 'Hawke’s Bay Anniversary Day', 'Hawke’s Bay', function (y) { return add(nthWeekday(y, 10, 1, 4), -3); }, 'Friday before Labour Day'],
    ['Marlborough', 'Marlborough Anniversary Day', 'Marlborough', function (y) { return add(nthWeekday(y, 10, 1, 4), 7); }, 'First Monday after Labour Day'],
    ['Canterbury', 'Canterbury Anniversary Day (Show Day)', 'Christchurch and Canterbury', function (y) { var t = nthWeekday(y, 11, 2, 1); return add(t, 10); }, 'Second Friday after the first Tuesday in November'],
    ['Chatham Islands', 'Chatham Islands Anniversary Day', 'Chatham Islands', function (y) { return mondayNearest(D(y, 11, 30)); }, 'Monday nearest 30 November'],
    ['Westland', 'Westland Anniversary Day', 'West Coast (dates vary by town)', function (y) { return mondayNearest(D(y, 12, 1)); }, 'Monday nearest 1 December (varies within Westland)']
  ];
  function holidays(y, region) {
    var list = national(y);
    REGIONS.forEach(function (r) { if (region === 'All regions' || region === r[0]) list.push({ name: r[1], date: r[3](y), kind: 'Regional', area: r[2], rule: r[4] }); });
    return list.sort(function (a, b) { return (a.observed || a.date) - (b.observed || b.date); });
  }
  JNZX.nzHolidays = holidays;
  var WD = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MO = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  function fmt(d) { return WD[dow(d)] + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()] + ' ' + d.getUTCFullYear(); }
  function short(d) { return WD[dow(d)].slice(0, 3) + ' ' + d.getUTCDate() + ' ' + MO[d.getUTCMonth()].slice(0, 3); }
  function iso(d) { var y = d.getUTCFullYear(), s = String(Math.abs(y)).padStart(4, '0'); return s + '-' + String(d.getUTCMonth() + 1).padStart(2, '0') + '-' + String(d.getUTCDate()).padStart(2, '0'); }
  function todayNZ() { var p = new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' }).split('-'); return D(+p[0], +p[1], +p[2]); }
  function longWeekend(x) { var d = x.observed || x.date, w = dow(d); return w === 1 || w === 5; }
  function ics(list, label) {
    var L = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//The James NZ//NZ Public Holidays//EN', 'CALSCALE:GREGORIAN'];
    list.forEach(function (x, i) { var d = x.observed || x.date; L.push('BEGIN:VEVENT', 'UID:' + iso(d) + '-' + i + '@thejamesnz.com', 'DTSTAMP:' + new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z', 'DTSTART;VALUE=DATE:' + iso(d).replace(/-/g, ''), 'DTEND;VALUE=DATE:' + iso(add(d, 1)).replace(/-/g, ''), 'SUMMARY:' + x.name + (x.observed ? ' (observed)' : ''), 'TRANSP:TRANSPARENT', 'END:VEVENT'); });
    L.push('END:VCALENDAR');
    var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([L.join('\r\n')], { type: 'text/calendar' })); a.download = label + '.ics'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
  }
  function HolidayRow(props) {
    var x = props.x, today = props.today, d = x.observed || x.date, days = Math.round((d - today) / DAY);
    return h('tr', { className: days === 0 ? 'is-today' : '' },
      h('td', { className: 'jx-hol-date' }, h('strong', null, short(d)), h('span', { className: 'jx-muted' }, ' ' + d.getUTCFullYear())),
      h('td', null, h('strong', null, x.name), x.kind === 'Regional' && h('div', { className: 'jx-muted' }, x.area),
        x.observed && h('div', { className: 'jx-muted' }, 'Falls on ' + fmt(x.date) + ' — observed ' + WD[dow(x.observed)] + ' for people who don’t normally work that day.'),
        x.note && h('div', { className: 'jx-muted' }, x.note)),
      h('td', null, h('span', { className: 'jx-pill ' + (x.kind === 'National' ? 'is-nat' : 'is-reg') }, x.kind), longWeekend(x) && h('span', { className: 'jx-pill is-lw' }, 'Long weekend')),
      h('td', { className: 'jx-muted' }, days === 0 ? 'Today' : days > 0 ? 'in ' + days.toLocaleString('en-NZ') + ' day' + (days === 1 ? '' : 's') : Math.abs(days).toLocaleString('en-NZ') + ' day' + (days === -1 ? '' : 's') + ' ago'));
  }
  JNZX.register('x:public-holidays', function HolidaysPage(props) {
    var today = useMemo(todayNZ, []);
    var ty = today.getUTCFullYear();
    var ys = useState(ty), year = ys[0], setYear = ys[1];
    var yt = useState(String(ty)), yearText = yt[0], setYearText = yt[1];
    var rg = JNZX.useStored('jnzx-hol-region', 'Auckland'), region = rg[0], setRegion = rg[1];
    var q = useState(''), query = q[0], setQuery = q[1];
    var f = useState(String(ty)), from = f[0], setFrom = f[1];
    var t = useState(String(ty + 10)), to = t[0], setTo = t[1];
    var cd = useState(iso(today)), check = cd[0], setCheck = cd[1];
    var list = useMemo(function () { return holidays(year, region); }, [year, region]);
    function goYear(y) { y = Math.max(1, Math.min(9999, y)); setYear(y); setYearText(String(y)); }
    var upcoming = useMemo(function () { var all = holidays(ty, region).concat(holidays(ty + 1, region)); return all.filter(function (x) { return (x.observed || x.date) >= today; }).slice(0, 3); }, [region]);
    var fy = parseInt(from, 10), ly = parseInt(to, 10), span = isNaN(fy) || isNaN(ly) ? 0 : Math.abs(ly - fy);
    var results = useMemo(function () {
      if (!query.trim() || isNaN(fy) || isNaN(ly)) return [];
      var a = Math.max(1, Math.min(fy, ly)), b = Math.min(9999, Math.max(fy, ly)), out = [], qq = query.trim().toLowerCase();
      if (b - a > 400) b = a + 400;
      for (var y = a; y <= b; y++) holidays(y, 'All regions').forEach(function (x) { if (x.name.toLowerCase().indexOf(qq) >= 0 || (x.area || '').toLowerCase().indexOf(qq) >= 0) out.push(x); });
      return out;
    }, [query, from, to]);
    var checkResult = useMemo(function () {
      var m = /^(\d{1,4})-(\d{2})-(\d{2})$/.exec(check); if (!m) return null;
      var d = D(+m[1], +m[2], +m[3]), hits = holidays(+m[1], 'All regions').filter(function (x) { var o = x.observed || x.date; return o.getTime() === d.getTime() || x.date.getTime() === d.getTime(); });
      return { d: d, hits: hits };
    }, [check]);
    var nextH = upcoming[0];
    return h('div', null,
      JNZX.Header('COMMUNITY · PLAN & WORK', 'New Zealand public holidays.', 'National public holidays and regional anniversary days for any year — past or future — with Mondayised dates, long weekends and a calendar download.'),
      nextH && h('div', { className: 'jx-card jx-hol-next' }, h('p', { className: 'eyebrow' }, 'NEXT HOLIDAY' + (region !== 'All regions' ? ' · ' + region.toUpperCase() : '')), h('h2', null, nextH.name), h('p', null, fmt(nextH.observed || nextH.date) + ' · ' + (function () { var n = Math.round(((nextH.observed || nextH.date) - today) / DAY); return n === 0 ? 'today' : 'in ' + n + ' day' + (n === 1 ? '' : 's'); })())),
      h('div', { className: 'jx-row jx-form jx-hol-controls' },
        h('label', null, 'Year', h('span', { className: 'jx-row jx-tight' },
          h('button', { type: 'button', className: 'secondary', 'aria-label': 'Previous year', onClick: function () { goYear(year - 1); } }, '‹'),
          h('input', { type: 'number', inputMode: 'numeric', min: 1, max: 9999, value: yearText, style: { width: '7em' }, onChange: function (e) { setYearText(e.target.value); var n = parseInt(e.target.value, 10); if (n >= 1 && n <= 9999) setYear(n); } }),
          h('button', { type: 'button', className: 'secondary', 'aria-label': 'Next year', onClick: function () { goYear(year + 1); } }, '›'),
          year !== ty && h('button', { type: 'button', className: 'secondary', onClick: function () { goYear(ty); } }, 'This year'))),
        h('label', null, 'Region', h('select', { value: region, onChange: function (e) { setRegion(e.target.value); } }, ['All regions', 'National only'].concat(REGIONS.map(function (r) { return r[0]; })).map(function (r) { return h('option', { key: r }, r); })))),
      year > 2052 && h('p', { className: 'jx-note' }, 'Matariki isn’t listed: the law sets its dates only up to 2052. Future dates will be added once they are confirmed.'),
      year < 1910 && h('p', { className: 'jx-note' }, 'For years this early, holidays follow today’s rules for New Year, Easter and Christmas. Historic observances may have differed.'),
      h('div', { className: 'jx-table-wrap' }, h('table', { className: 'jx-hol-table' },
        h('caption', null, year + ' · ' + list.length + ' holidays'),
        h('tbody', null, list.map(function (x, i) { return h(HolidayRow, { key: i, x: x, today: today }); })))),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'primary', onClick: function () { ics(list, 'NZ-public-holidays-' + year + (region !== 'All regions' && region !== 'National only' ? '-' + region.replace(/\W+/g, '-') : '')); } }, 'Add ' + year + ' to my calendar (.ics)'),
        h('button', { type: 'button', className: 'secondary', onClick: function () { window.print(); } }, 'Print this year')),
      h('h2', null, 'Search any holiday across the years'),
      h('div', { className: 'jx-row jx-form' },
        h('label', null, 'Holiday or region', h('input', { type: 'search', value: query, style: { minWidth: '18em' }, placeholder: 'e.g. Matariki, Easter, Labour, Canterbury', onChange: function (e) { setQuery(e.target.value); } })),
        h('label', null, 'From year', h('input', { type: 'number', value: from, style: { width: '7em' }, onChange: function (e) { setFrom(e.target.value); } })),
        h('label', null, 'To year', h('input', { type: 'number', value: to, style: { width: '7em' }, onChange: function (e) { setTo(e.target.value); } }))),
      span > 400 && h('p', { className: 'small-note' }, 'Showing the first 401 years of that range. Narrow the years to see the rest.'),
      query.trim() && h('p', { className: 'jx-muted', role: 'status' }, results.length.toLocaleString('en-NZ') + ' match' + (results.length === 1 ? '' : 'es')),
      results.length > 0 && h('div', { className: 'jx-table-wrap jx-hol-results' }, h('table', null, h('tbody', null, results.slice(0, 600).map(function (x, i) { return h(HolidayRow, { key: i, x: x, today: today }); })))),
      results.length > 600 && h('p', { className: 'small-note' }, 'Showing the first 600 matches.'),
      h('h2', null, 'Is this date a public holiday?'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Date', h('input', { type: 'date', value: check, min: '0001-01-01', max: '9999-12-31', onChange: function (e) { setCheck(e.target.value); } }))),
      checkResult && h('div', { className: 'jx-note' }, h('strong', null, fmt(checkResult.d) + ': '), checkResult.hits.length ? checkResult.hits.map(function (x) { return x.name + (x.kind === 'Regional' ? ' (' + x.area + ')' : '') + (x.observed && x.observed.getTime() === checkResult.d.getTime() ? ' — observed' : ''); }).join('; ') + '.' : 'not a national public holiday or regional anniversary day.'),
      h('h2', null, 'Regional anniversary days'),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, REGIONS.map(function (r) { return h('tr', { key: r[0] }, h('th', null, r[1]), h('td', null, r[4]), h('td', { className: 'jx-muted' }, r[2])); })))),
      h(JNZX.Accordion, { items: [
        { title: 'How the dates are worked out', body: function () { return ul([
          'Christmas Day, Boxing Day, New Year’s Day and 2 January: if one falls on a weekend and you don’t normally work that day, the holiday moves to the following Monday (or Tuesday).',
          'Waitangi Day and Anzac Day have been “Mondayised” the same way since 2014 and 2015.',
          'Easter is calculated with the Gregorian church calendar, so Good Friday and Easter Monday are correct for any year.',
          'Matariki dates are set in law by Te Kāhui o Matariki Public Holiday Act 2022 for 2022 to 2052. Later dates haven’t been set yet, so they aren’t shown.',
          'King’s Birthday is the first Monday in June (Queen’s Birthday from 1952 to 2022). Labour Day is the fourth Monday in October.',
          'Holidays only appear for years they existed: Labour Day from 1910, Anzac Day from 1921, Waitangi Day from 1974 (New Zealand Day 1974–76). Earlier years and very old dates follow today’s rules for Christmas, New Year and Easter, and historic observances may have differed.',
          'Regional anniversary dates are set by local custom and can vary within a region. Check your council or employment agreement.'
        ]); } },
        { title: 'Your holiday rights at work', body: function () { return h('p', null, 'If you work on a public holiday that is an otherwise working day for you, you are entitled to be paid at least time and a half, and to an alternative holiday (a day in lieu). See ', ext('https://www.employment.govt.nz/leave-and-holidays/public-holidays/', 'Employment New Zealand: public holidays'), ' for the full rules.'); } }
      ] }),
      h('p', { className: 'small-note' }, 'Sources: Holidays Act 2003; Te Kāhui o Matariki Public Holiday Act 2022; Employment New Zealand. This is general information, not legal advice.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  });

  /* =========================== JOB SEARCH =========================== */
  var JOBS = [
    ['All kinds of jobs', [
      ['SEEK New Zealand', 'https://nz.seek.com/', 'New Zealand’s largest job board, with job alerts and company reviews.'],
      ['Jora', 'https://nz.jora.com/All-jobs', 'Searches thousands of NZ listings from many job sites in one place.'],
      ['Trade Me Jobs', 'https://www.trademe.co.nz/a/jobs', 'Kiwi-owned listings across every industry and region.'],
      ['Indeed New Zealand', 'https://nz.indeed.com/', 'Large international job search with salary information.'],
      ['LinkedIn Jobs', 'https://www.linkedin.com/jobs/', 'Professional roles, recruiters and networking.'],
      ['MyJobSpace', 'https://www.myjobspace.co.nz/', 'Entry-level, retail, hospitality and part-time jobs.']
    ]],
    ['Public sector, education and health', [
      ['NZ Government jobs', 'https://jobs.govt.nz/', 'Official site for jobs in government departments and agencies.'],
      ['Education Gazette vacancies', 'https://gazette.education.govt.nz/vacancies/', 'Teaching and school roles across Aotearoa.'],
      ['Kiwi Health Jobs', 'https://www.kiwihealthjobs.com/', 'Jobs at Health New Zealand | Te Whatu Ora and health providers.']
    ]],
    ['Students, volunteers and community roles', [
      ['Student Job Search (SJS)', 'https://www.sjs.co.nz/', 'Part-time, casual and holiday work for tertiary students.'],
      ['Do Good Jobs', 'https://dogoodjobs.co.nz/', 'Jobs with charities, social enterprises and purpose-driven employers.']
    ]],
    ['Help to find work', [
      ['Careers New Zealand', 'https://www.careers.govt.nz/', 'Free CV and cover-letter tools, career quizzes and interview tips.'],
      ['Work and Income', 'https://www.workandincome.govt.nz/', 'Free job search support, training and help with costs of starting work.'],
      ['Employment New Zealand', 'https://www.employment.govt.nz/', 'Your rights: minimum wage, contracts, leave and pay.']
    ]]
  ];
  JNZX.register('x:jobs', function JobsPage(props) {
    return h('div', null,
      JNZX.Header('COMMUNITY · PLAN & WORK', 'Find a job in New Zealand.', 'Trusted job boards and free career help, in one place. Every link goes to the official site.'),
      JOBS.map(function (grp) {
        return h('section', { key: grp[0] }, h('h2', null, grp[0]),
          h('div', { className: 'jx-cards3' }, grp[1].map(function (j) {
            var host = j[1].replace(/^https:\/\//, '').replace(/\/$/, '');
            return h('a', { key: j[0], className: 'jx-card jx-job', href: j[1], target: '_blank', rel: 'noopener noreferrer' }, h('h3', null, j[0], ' ↗'), h('p', null, j[2]), h('span', { className: 'jx-muted' }, host));
          })));
      }),
      h('h2', null, 'Stay safe from job scams'),
      h('div', { className: 'jx-note' }, ul([
        'Never pay to get a job, for training “kits”, or to receive your first pay.',
        'Don’t send your passport, driver licence, IRD number or bank details until you have checked the employer is real and you have a written offer.',
        'Be wary of jobs offered by text or social media without an interview, “too good to be true” pay, or being asked to receive and send money.',
        'Check the business on the Companies Office register and look for a real address and landline.',
        'If something feels wrong, stop. Report scams to Netsafe (netsafe.org.nz) or the National Cyber Security Centre (ncsc.govt.nz).'
      ])),
      h('h2', null, 'Quick checklist'),
      ul(['Update your CV — Careers NZ has a free CV builder.', 'Set up job alerts on two or three sites.', 'Tailor each cover letter to the job ad.', 'Ask a friend to do a practice interview (try Learning › Speech).', 'Know your rights — check the current minimum wage on Employment New Zealand.']),
      h('p', { className: 'small-note' }, 'The James NZ is not linked to these websites and doesn’t receive payment for listing them. Listings and services are provided by each site.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  });

  /* ======================= SPEAKING TIME CALCULATOR ======================= */
  var PACES = [['Slow', 110, 'Formal speeches, readings, children'], ['Average', 140, 'Most presentations and talks'], ['Fast', 170, 'Lively, conversational delivery']];
  function countWords(t) { var m = t.trim().match(/[\p{L}\p{N}][\p{L}\p{N}’'\-]*/gu); return m ? m.length : 0; }
  function mmss(sec) { sec = Math.round(sec); var m = Math.floor(sec / 60), s = sec % 60; return (m ? m + ' min ' : '') + s + ' sec'; }
  JNZX.register('x:speaking-time', function SpeakingTime(props) {
    var st = JNZX.useStored('jnzx-speech-draft', ''), text = st[0], setText = st[1];
    var p = JNZX.useStored('jnzx-speech-wpm', 140), wpm = p[0], setWpm = p[1];
    var ps = JNZX.useStored('jnzx-speech-pause', 1), pause = ps[0], setPause = ps[1];
    var tg = useState(5), target = tg[0], setTarget = tg[1];
    var rd = useState(false), reading = rd[0], setReading = rd[1];
    var sw = useState(null), started = sw[0], setStarted = sw[1];
    var el = useState(0), elapsed = el[0], setElapsed = el[1];
    useEffect(function () { if (!started) return; var id = setInterval(function () { setElapsed((Date.now() - started) / 1000); }, 200); return function () { clearInterval(id); }; }, [started]);
    useEffect(function () { return function () { try { speechSynthesis.cancel(); } catch (e) {} }; }, []);
    var words = countWords(text), chars = text.replace(/\s/g, '').length;
    var sentences = (text.match(/[.!?…]+(\s|$)/g) || []).length || (words ? 1 : 0), paragraphs = text.split(/\n\s*\n/).filter(function (x) { return x.trim(); }).length;
    var pauseSec = paragraphs > 1 ? (paragraphs - 1) * pause : 0;
    var secs = words / wpm * 60 + pauseSec;
    function speak() {
      try {
        if (reading) { speechSynthesis.cancel(); setReading(false); return; }
        var u = new SpeechSynthesisUtterance(text); u.rate = Math.max(0.5, Math.min(2, wpm / 160)); u.lang = 'en-NZ';
        u.onend = u.onerror = function () { setReading(false); };
        speechSynthesis.cancel(); speechSynthesis.speak(u); setReading(true);
      } catch (e) { setReading(false); }
    }
    var myWpm = started === null && elapsed > 5 && words ? Math.round(words / (elapsed / 60)) : null;
    return h('div', null,
      JNZX.Header('LEARNING · SPEECH', 'Speaking time calculator.', 'Paste your speech, talk or reading to see how long it will take to say out loud — then practise with a timer and find your own pace.'),
      h('div', { className: 'jx-speak' },
        h('div', null,
          h('label', { className: 'jx-block' }, 'Your speech', h('textarea', { rows: 12, value: text, placeholder: 'Kia ora koutou. Paste or type your speech here…', onChange: function (e) { setText(e.target.value); } })),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'secondary', disabled: !words, onClick: speak }, reading ? '■ Stop reading' : '▶ Read it aloud'),
            h('button', { type: 'button', className: 'secondary', disabled: !text, onClick: function () { setText(''); } }, 'Clear'))),
        h('div', { className: 'jx-card jx-speak-result', 'aria-live': 'polite' },
          h('p', { className: 'eyebrow' }, 'SPEAKING TIME'),
          h('p', { className: 'jx-big' }, words ? mmss(secs) : '—'),
          h('p', { className: 'jx-muted' }, words.toLocaleString('en-NZ') + ' words · ' + chars.toLocaleString('en-NZ') + ' characters · ' + sentences + ' sentence' + (sentences === 1 ? '' : 's') + ' · ' + paragraphs + ' paragraph' + (paragraphs === 1 ? '' : 's')),
          h('p', { className: 'jx-muted' }, 'Silent reading: about ' + (words ? mmss(words / 238 * 60) : '—')),
          h('div', { className: 'jx-chips' }, PACES.map(function (x) { return h('button', { key: x[0], type: 'button', className: 'jx-chip' + (wpm === x[1] ? ' is-on' : ''), title: x[2], onClick: function () { setWpm(x[1]); } }, x[0] + ' · ' + x[1]); })),
          h('label', { className: 'jx-block' }, 'Pace: ' + wpm + ' words per minute', h('input', { type: 'range', min: 80, max: 220, step: 5, value: wpm, onChange: function (e) { setWpm(+e.target.value); } })),
          h('label', { className: 'jx-block' }, 'Pause between paragraphs: ' + pause + ' sec', h('input', { type: 'range', min: 0, max: 5, step: 0.5, value: pause, onChange: function (e) { setPause(+e.target.value); } })))),
      h('h2', null, 'How many words do I need?'),
      h('div', { className: 'jx-row jx-form' },
        h('label', null, 'Time to fill (minutes)', h('input', { type: 'number', min: 0.5, max: 180, step: 0.5, value: target, style: { width: '8em' }, onChange: function (e) { setTarget(+e.target.value || 0); } })),
        h('p', { className: 'jx-big-sm' }, '≈ ' + Math.round(target * wpm).toLocaleString('en-NZ') + ' words at ' + wpm + ' wpm')),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('thead', null, h('tr', null, h('th', null, 'Length'), PACES.map(function (x) { return h('th', { key: x[0] }, x[0] + ' (' + x[1] + ')'); }))),
        h('tbody', null, [1, 2, 3, 5, 7, 10, 15, 20, 30].map(function (m) { return h('tr', { key: m }, h('th', null, m + ' min'), PACES.map(function (x) { return h('td', { key: x[0] }, (m * x[1]).toLocaleString('en-NZ') + ' words'); })); })))),
      h('h2', null, 'Practise and find your pace'),
      h('p', null, 'Press Start, read your speech out loud at a natural pace, then press Stop. We’ll work out your own words per minute.'),
      h('div', { className: 'jx-row' },
        h('p', { className: 'jx-big' }, mmss(elapsed)),
        started === null ? h('button', { type: 'button', className: 'primary', disabled: !words, onClick: function () { setElapsed(0); setStarted(Date.now()); } }, 'Start practice')
          : h('button', { type: 'button', className: 'primary', onClick: function () { setElapsed((Date.now() - started) / 1000); setStarted(null); } }, 'Stop'),
        myWpm && h('button', { type: 'button', className: 'secondary', onClick: function () { setWpm(Math.max(80, Math.min(220, Math.round(myWpm / 5) * 5))); } }, 'Use my pace (' + myWpm + ' wpm)')),
      myWpm && h('p', { className: 'jx-note' }, 'You spoke at about ' + myWpm + ' words per minute. ' + (myWpm < 110 ? 'That’s unhurried — great for clarity. Make sure the energy stays up.' : myWpm > 170 ? 'That’s quick. Try pausing at full stops and slowing your key points.' : 'That’s a comfortable, easy-to-follow pace.')),
      h(JNZX.Accordion, { items: [{ title: 'Tips for timing a speech', body: function () { return ul(['Most people speak at 120–160 words per minute. Nerves usually make us faster — plan for a slower pace.', 'Leave about 10% of your time spare for pauses, laughter and applause.', 'Pause for a breath at each full stop and for two seconds after a key message.', 'For a wedding toast or eulogy, 3–5 minutes (about 400–700 words) is plenty.', 'Practise with the timer at least three times, then trim — shorter is almost always better.']); } }] }),
      h('p', { className: 'small-note' }, 'Your text stays on this device. Read-aloud uses your device’s own voices.'),
      h(JNZX.ShareBar, { tab: props.tab }));
  });

  /* ========================= NZ SIGN LANGUAGE ========================= */
  var VOWELS = [['A', 'thumb'], ['E', 'index finger'], ['I', 'middle finger'], ['O', 'ring finger'], ['U', 'little finger']];
  var FIRST = [['hello', 'Hello'], ['thank you', 'Thank you'], ['please', 'Please'], ['sorry', 'Sorry'], ['yes', 'Yes'], ['no', 'No'], ['name', 'Name'], ['family', 'Family'], ['mum', 'Mum'], ['dad', 'Dad'], ['friend', 'Friend'], ['love', 'Love'], ['eat', 'Eat'], ['drink', 'Drink'], ['water', 'Water'], ['help', 'Help'], ['good', 'Good'], ['happy', 'Happy'], ['school', 'School'], ['home', 'Home'], ['pray', 'Pray'], ['deaf', 'Deaf'], ['kia ora', 'Kia ora'], ['whānau', 'Whānau']];
  function nzsl(word) { return 'https://www.nzsl.nz/signs/search?s=' + encodeURIComponent(word); }
  function HandSVG(props) {
    var on = props.on; // index into VOWELS
    var tips = [[46, 118], [74, 40], [98, 28], [120, 36], [140, 58]];
    var fingers = [
      'M40 150 C 30 132, 32 118, 46 112 C 58 108, 66 120, 64 134 L 60 160',
      'M66 160 L 68 52 C 68 40, 82 38, 82 52 L 84 150',
      'M86 150 L 90 40 C 90 26, 106 26, 106 40 L 104 150',
      'M106 150 L 112 48 C 113 34, 128 36, 127 50 L 122 156',
      'M124 160 L 132 70 C 134 58, 148 60, 147 74 L 140 168'];
    return h('svg', { viewBox: '0 0 190 230', className: 'jx-hand', role: 'img', 'aria-label': on == null ? 'Your passive hand, palm facing you' : 'Point to the ' + VOWELS[on][1] + ' for ' + VOWELS[on][0] },
      h('path', { d: 'M60 160 C 56 200, 76 222, 104 222 C 134 222, 150 200, 142 160 Z', className: 'jx-hand-palm', transform: 'translate(190 0) scale(-1 1)' }),
      h('g', { transform: 'translate(190 0) scale(-1 1)' }, fingers.map(function (d, i) { return h('path', { key: i, d: d, className: 'jx-hand-f' + (on === i ? ' is-on' : '') }); })),
      tips.map(function (t, i) { var x = 190 - t[0]; return h('g', { key: 't' + i }, h('circle', { cx: x, cy: t[1], r: 11, className: 'jx-hand-tip' + (on === i ? ' is-on' : '') }), h('text', { x: x, y: t[1] + 4, textAnchor: 'middle' }, VOWELS[i][0])); }));
  }
  JNZX.register('x:nzsl', function NZSLPage(props) {
    var v = useState(null), vowel = v[0], setVowel = v[1];
    var n = useState(''), name = n[0], setName = n[1];
    var qz = useState(function () { return Math.floor(Math.random() * 5); }), qv = qz[0], setQv = qz[1];
    var sc = JNZX.useStored('jnzx-nzsl-score', { right: 0, tries: 0 }), score = sc[0], setScore = sc[1];
    var fb = useState(''), feedback = fb[0], setFeedback = fb[1];
    var dn = JNZX.useStored('jnzx-nzsl-learnt', {}), learnt = dn[0], setLearnt = dn[1];
    var letters = name.toUpperCase().replace(/[^A-ZĀĒĪŌŪ ]/g, '').slice(0, 24).split('');
    var macron = { 'Ā': 'A', 'Ē': 'E', 'Ī': 'I', 'Ō': 'O', 'Ū': 'U' };
    function answer(i) { var ok = i === qv; setScore({ right: score.right + (ok ? 1 : 0), tries: score.tries + 1 }); setFeedback(ok ? 'Ka pai! ' + VOWELS[qv][0] + ' is the ' + VOWELS[qv][1] + '.' : 'Not quite — that was the ' + VOWELS[i][1] + ' (' + VOWELS[i][0] + ').'); if (ok) setTimeout(function () { setQv(Math.floor(Math.random() * 5)); setFeedback(''); }, 900); }
    var learntCount = FIRST.filter(function (w) { return learnt[w[0]]; }).length;
    return h('div', null,
      JNZX.Header('LEARNING · SPEECH', 'New Zealand Sign Language.', 'Te Reo Rotarota — one of New Zealand’s official languages. Start with the two-handed alphabet, spell your name, learn your first signs and get to know Deaf culture.'),
      h('div', { className: 'jx-cards3' },
        h('div', { className: 'jx-card' }, h('h3', null, '🤟 An official language'), h('p', null, 'NZSL became an official language of New Zealand in 2006, joining te reo Māori. It is the first language of many Deaf New Zealanders.')),
        h('div', { className: 'jx-card' }, h('h3', null, '👐 Two hands'), h('p', null, 'NZSL fingerspelling uses both hands, like British and Australian sign languages. NZSL is its own language, though, with its own signs and grammar.')),
        h('div', { className: 'jx-card' }, h('h3', null, '😊 Faces matter'), h('p', null, 'Facial expression and body movement are part of the grammar — they show questions, feelings and emphasis.'))),
      h('h2', null, '1. The vowels: point to your fingertips'),
      h('p', null, 'Hold up your passive hand (left, if you are right-handed) with the palm facing you, so your thumb is on the right. With your other index finger, touch a fingertip. Tap a letter to see which finger.'),
      h('div', { className: 'jx-nzsl-vowels' },
        h(HandSVG, { on: vowel }),
        h('div', null,
          h('div', { className: 'jx-chips' }, VOWELS.map(function (x, i) { return h('button', { key: x[0], type: 'button', className: 'jx-chip jx-chip-lg' + (vowel === i ? ' is-on' : ''), onClick: function () { setVowel(i); } }, x[0]); })),
          vowel != null && h('p', { className: 'jx-big-sm' }, VOWELS[vowel][0] + ' = touch the tip of your ' + VOWELS[vowel][1] + '.'),
          h('div', { className: 'jx-card jx-quiz-mini' }, h('h3', null, 'Quick quiz'), h('p', null, 'Which letter is the ' + VOWELS[qv][1] + '?'),
            h('div', { className: 'jx-chips' }, VOWELS.map(function (x, i) { return h('button', { key: x[0], type: 'button', className: 'jx-chip jx-chip-lg', onClick: function () { answer(i); } }, x[0]); })),
            feedback && h('p', { role: 'status' }, feedback), h('p', { className: 'jx-muted' }, 'Score: ' + score.right + ' / ' + score.tries)))),
      h('h2', null, '2. The full alphabet'),
      h('figure', { className: 'jx-nzsl-chart' }, h('img', { src: 'https://upload.wikimedia.org/wikipedia/commons/5/54/Bimanual_alphabet.jpg', alt: 'Chart of the two-handed manual alphabet used in NZSL, Auslan and BSL, A to Z, shown from the signer’s point of view.', loading: 'lazy' }),
        h('figcaption', null, 'The two-handed alphabet used in NZSL, Auslan and British Sign Language. Chart: Neil Evans, public domain, via Wikimedia Commons.')),
      h('h2', null, '3. Spell your name'),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Your name', h('input', { value: name, maxLength: 24, placeholder: 'e.g. Mateo', onChange: function (e) { setName(e.target.value); } }))),
      letters.length > 0 && h('div', { className: 'jx-spell' }, letters.map(function (L, i) {
        if (L === ' ') return h('span', { key: i, className: 'jx-spell-gap' });
        var base = macron[L] || L, vi = VOWELS.findIndex(function (x) { return x[0] === base; });
        return h('div', { key: i, className: 'jx-spell-tile' + (vi >= 0 ? ' is-vowel' : '') }, h('strong', null, L), h('span', null, vi >= 0 ? 'tip of ' + VOWELS[vi][1] : 'see chart'));
      })),
      letters.length > 0 && h('p', { className: 'small-note' }, 'Spell smoothly at chest height. In NZSL, people often fingerspell names the first time, then use a name sign — which Deaf people give, rather than choose for themselves.'),
      h('h2', null, '4. Your first 24 signs'),
      h('p', null, 'Tap a word to watch the sign on NZSL Online, the official NZSL dictionary from Victoria University of Wellington. Tick it off when you can sign it.'),
      h('p', { className: 'jx-muted' }, learntCount + ' of ' + FIRST.length + ' learnt'),
      h('div', { className: 'jx-progress' }, h('span', { style: { width: learntCount / FIRST.length * 100 + '%' } })),
      h('div', { className: 'jx-sign-grid' }, FIRST.map(function (w) {
        return h('div', { key: w[0], className: 'jx-sign' + (learnt[w[0]] ? ' is-done' : '') },
          h('a', { href: nzsl(w[0]), target: '_blank', rel: 'noopener noreferrer' }, w[1], ' ↗'),
          h('label', { className: 'jx-check' }, h('input', { type: 'checkbox', checked: !!learnt[w[0]], onChange: function (e) { var o = Object.assign({}, learnt); o[w[0]] = e.target.checked; setLearnt(o); } }), h('span', null, 'Learnt')));
      })),
      h('h2', null, '5. Deaf culture and good manners'),
      h('div', { className: 'jx-note' }, ul([
        'To get someone’s attention, wave gently in their line of sight, tap their shoulder lightly, or flick the lights.',
        'Keep eye contact — looking away is like turning your back while someone talks.',
        'Don’t shout or over-exaggerate your mouth. Speak normally and face the person in good light.',
        'Don’t walk between two people who are signing; if you must, go quickly without stopping.',
        'Pen and paper, or typing on a phone, is always fine. Ask what works best.',
        'For important appointments, a qualified NZSL interpreter helps everyone communicate.'
      ])),
      h('h2', null, 'Keep learning'),
      h('div', { className: 'jx-cards3' },
        h('a', { className: 'jx-card jx-job', href: 'https://www.nzsl.nz/', target: '_blank', rel: 'noopener noreferrer' }, h('h3', null, 'NZSL Online ↗'), h('p', null, 'The official dictionary with videos of thousands of signs.')),
        h('a', { className: 'jx-card jx-job', href: 'https://www.deaf.org.nz/', target: '_blank', rel: 'noopener noreferrer' }, h('h3', null, 'Deaf Aotearoa ↗'), h('p', null, 'Classes, NZSL Week (every May) and Deaf community services.')),
        h('a', { className: 'jx-card jx-job', href: 'https://auckland-deaf.org.nz/', target: '_blank', rel: 'noopener noreferrer' }, h('h3', null, 'Auckland Deaf Society ↗'), h('p', null, 'Beginner NZSL courses, in person and online.'))),
      h('p', { className: 'small-note' }, 'This page is an introduction made by The James NZ. Learning from Deaf tutors is the best way to learn NZSL properly.'),
      h(JNZX.ShareBar, { tab: props.tab }));
  });

  /* Speech page: link to the new tools */
  JNZX.extrasFor = JNZX.extrasFor || {};
  JNZX.extrasFor['Speaking practice'] = function SpeechExtras(props) {
    return h('div', { className: 'jx-page' }, h('div', { className: 'jx-related' }, h('span', { className: 'eyebrow' }, 'MORE SPEECH TOOLS'),
      h('button', { type: 'button', className: 'secondary', onClick: function () { props.navigate('x:speaking-time'); } }, '⏱ Speaking Time Calculator'),
      h('button', { type: 'button', className: 'secondary', onClick: function () { props.navigate('x:nzsl'); } }, '🤟 NZ Sign Language')));
  };

  /* ---------- Speaking practice (original, Oct 27) ---------- */
  var TOPICS = {
    'Everyday': ['The best thing that happened to you this week', 'A small habit that makes your day better', 'Your perfect Saturday morning', 'Something you changed your mind about', 'The most useful thing in your kitchen', 'A skill you would love to learn', 'Your favourite way to unwind', 'A time you got lost', 'The best advice you have ever been given', 'Something that always makes you laugh'],
    'Family': ['A family tradition worth keeping', 'What your grandparents taught you', 'The best family holiday you remember', 'A meal that tastes like home', 'How your family celebrates birthdays', 'One thing every child should learn by ten', 'A lesson your kids taught you', 'Your family in three words', 'The funniest thing a child has said to you', 'How to make a rainy day fun'],
    'Kiwi life': ['Your favourite New Zealand beach or walk', 'Pineapple lumps or jaffas — make your case', 'What makes a perfect Kiwi barbecue', 'A place every visitor should see', 'The best thing about where you live', 'Jandals, sneakers or bare feet?', 'What “she’ll be right” means to you', 'Your favourite te reo Māori word and why', 'The great pavlova debate', 'A Kiwi invention you are proud of'],
    'Faith & hope': ['A moment you felt grateful', 'Someone who shows kindness without being asked', 'What hope looks like on a hard day', 'A prayer or quote that stays with you', 'How you make time for quiet', 'A saint or hero you admire', 'Why small acts of kindness matter', 'What forgiveness taught you', 'A time a stranger helped you', 'Where you find peace'],
    'Work & school': ['The best teacher or boss you have had', 'How you stay organised', 'A mistake that taught you something', 'What makes a great team', 'Your first job', 'How to give feedback kindly', 'A goal for this year', 'Working from home: love it or leave it?', 'The most important skill for the future', 'How to stay calm under pressure'],
    'Just for fun': ['If you could have any superpower', 'The animal that best describes you', 'Your dream dinner guest', 'If you won a holiday tomorrow', 'The world’s most underrated vegetable', 'An invention the world still needs', 'If you were in charge for a day', 'The best smell in the world', 'Cats or dogs — convince me', 'Your theme song and why']
  };
  var DRILLS = [
    ['⏸️ Power pause', 'Say one sentence, pause for two full seconds, then say the next. Pauses make you sound calm and give listeners time to think.', 'Try: “Today I want to share one idea. [pause] It changed how I start my mornings.”'],
    ['🎯 One-breath point', 'Sum up your whole message in one breath. If you can’t, your point is still too big.', 'Try it with your last idea or the topic above.'],
    ['🔁 Rule of three', 'Make your point with three examples. Three feels complete and is easy to remember.', 'Try: three reasons to visit your town.'],
    ['📣 Voice ladder', 'Say “Good morning, everyone” softly, then normally, then to the back of the room. Find the middle step for most talks.', 'Notice how your breath changes.'],
    ['🐢 Slow the start', 'Speak your first three sentences at half your normal speed. Nerves speed us up; slowing down reads as confident.', 'Record yourself and listen back.'],
    ['🚫 Filler swap', 'Every time you want to say “um”, close your mouth and pause instead. Ask a friend to clap when they hear a filler.', 'Use the filler counter below.'],
    ['👀 Eye-contact sweep', 'Pick three spots in the room — left, centre, right. Finish a whole sentence looking at one before you move.', 'At home, use three photos or cushions.'],
    ['📖 Mini story', 'Tell a 60-second story: where you were, what went wrong, what you did, what changed.', 'End with the lesson in one line.'],
    ['✋ Purposeful hands', 'Rest your hands loosely at waist height. Use them only to show size, number or direction.', 'Try counting “one, two, three” on your fingers.'],
    ['🎬 Strong finish', 'End with a call to action or a picture, then stop and smile. Don’t trail off with “so… yeah”.', 'Write your last sentence first.'],
    ['🗣️ Word painting', 'Describe your breakfast so well the listener can taste it. Use colour, sound and smell.', 'Swap “nice” for something specific.'],
    ['🔄 Answer the question', 'Ask a friend for a surprise question. Answer with: point, reason, example, point again.', 'This works for interviews too.']
  ];
  var FILLERS = ['um', 'ah', 'like', 'so', 'you know', 'basically'];
  var REVIEW = ['I had one clear message', 'My opening grabbed attention', 'I paused instead of using fillers', 'I looked at my listeners', 'My voice changed pace and volume', 'My hands helped, not distracted', 'I finished with a strong closing line', 'I kept to time'];

  function SpeakTimer() {
    var L = useState(2), len = L[0], setLen = L[1];
    var S = useState(0), sec = S[0], setSec = S[1];
    var R2 = useState(false), run = R2[0], setRun = R2[1];
    R.useEffect(function () { if (!run) return; var id = setInterval(function () { setSec(function (x) { return x + 1; }); }, 1000); return function () { clearInterval(id); }; }, [run]);
    var total = len * 60, light = sec >= total ? 'red' : sec >= total - 30 ? 'amber' : sec >= total * 0.5 ? 'green' : 'off';
    var mm = Math.floor(sec / 60), ss = ('0' + (sec % 60)).slice(-2);
    return h('div', { className: 'jx-card jx-sp-timer' },
      h('h3', null, '⏱️ Practice timer'),
      h(JNZX.Chips, { label: 'Speech length', options: [1, 2, 3, 5, 7].map(function (n) { return { value: n, label: n + ' min' }; }), value: len, onChange: function (v) { setLen(v); setSec(0); setRun(false); } }),
      h('div', { className: 'jx-sp-light jx-sp-' + light, 'aria-live': 'polite' }, h('strong', null, mm + ':' + ss), h('span', null, light === 'off' ? (sec ? 'Keep going' : 'Ready when you are') : light === 'green' ? 'Halfway — you’re on track' : light === 'amber' ? '30 seconds left — start wrapping up' : 'Time! Finish your sentence')),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { setRun(!run); } }, run ? 'Pause' : sec ? 'Resume' : 'Start'), h('button', { type: 'button', className: 'secondary', onClick: function () { setRun(false); setSec(0); } }, 'Reset')));
  }
  function SpeakPractice() {
    var c = useState('Everyday'), cat = c[0], setCat = c[1];
    var n = useState(function () { return Math.floor(Math.random() * 10); }), idx = n[0], setIdx = n[1];
    var f = useState({}), fills = f[0], setFills = f[1];
    var d = useState(0), di = d[0], setDi = d[1];
    var rv = JNZX.useStored('jnzx-speak-review', {}), rev = rv[0], setRev = rv[1];
    var o = JNZX.useStored('jnzx-speak-outline', { hook: '', p1: '', p2: '', p3: '', close: '' }), ol = o[0], setOl = o[1];
    var topic = TOPICS[cat][idx % TOPICS[cat].length];
    var totalF = Object.keys(fills).reduce(function (a, k) { return a + fills[k]; }, 0);
    var score = REVIEW.filter(function (x) { return rev[x]; }).length;
    var outline = ['Opening: ' + (ol.hook || '…'), 'Point 1: ' + (ol.p1 || '…'), 'Point 2: ' + (ol.p2 || '…'), 'Point 3: ' + (ol.p3 || '…'), 'Closing: ' + (ol.close || '…')].join('\n');
    function field(k, label, ph) { return h('label', { key: k }, label, h('input', { value: ol[k], maxLength: 140, placeholder: ph, onChange: function (e) { var x = Object.assign({}, ol); x[k] = e.target.value; setOl(x); } })); }
    return h('div', { className: 'jx-sp' },
      h('p', { className: 'jx-muted' }, 'Pick a topic, set the timer and speak. Short, regular practice builds confidence fast.'),
      h(JNZX.Tabs, { id: 'speak-practice', label: 'Speaking practice', items: [
        { id: 'topic', label: '🎲 Quick talk', render: function () { return h('div', null,
          h(JNZX.Chips, { label: 'Topic type', options: Object.keys(TOPICS), value: cat, onChange: function (v) { setCat(v); setIdx(Math.floor(Math.random() * 10)); } }),
          h('div', { className: 'jx-card jx-sp-topic' }, h('small', null, cat.toUpperCase() + ' · TALK FOR 1–2 MINUTES'), h('p', null, topic),
            h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setIdx(idx + 1 + Math.floor(Math.random() * 3)); } }, '🔄 Another topic'), h(JNZX.ShareMini, { title: 'Speaking topic', text: 'Can you talk for one minute on: “' + topic + '”?', label: 'Share' }))),
          h('p', { className: 'small-note' }, 'Quick plan: one point, one example, one closing line. Take a breath, smile, begin.'),
          h(SpeakTimer)); } },
        { id: 'build', label: '🧱 Speech builder', render: function () { return h('div', { className: 'jx-card jx-sp-build' },
          h('p', { className: 'jx-muted' }, 'Fill in five lines and you have a speech.'),
          field('hook', 'Opening — a question, story or surprising fact', 'Have you ever…?'),
          field('p1', 'Point 1', 'My first reason or idea'), field('p2', 'Point 2', 'An example or story'), field('p3', 'Point 3', 'What it means for the listener'),
          field('close', 'Closing — what should they do or remember?', 'So next time you…'),
          h('pre', { className: 'jx-sp-outline' }, outline),
          h('div', { className: 'jx-row' }, h(JNZX.ShareMini, { title: 'My speech outline', text: outline, label: 'Share outline' }), h('button', { type: 'button', className: 'secondary', onClick: function () { setOl({ hook: '', p1: '', p2: '', p3: '', close: '' }); } }, 'Clear'))); } },
        { id: 'drills', label: '💪 Drills', render: function () { var x = DRILLS[di % DRILLS.length]; return h('div', null,
          h('div', { className: 'jx-card jx-sp-topic' }, h('small', null, 'DRILL ' + ((di % DRILLS.length) + 1) + ' OF ' + DRILLS.length), h('h3', null, x[0]), h('p', null, x[1]), h('p', { className: 'jx-muted' }, x[2]),
            h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setDi(di + 1); } }, '🔄 Next drill'))),
          h('div', { className: 'jx-card' }, h('h3', null, '🔢 Filler counter'), h('p', { className: 'jx-muted' }, 'Ask a listener to tap each time they hear one.'),
            h('div', { className: 'jx-sp-fill' }, FILLERS.map(function (w) { return h('button', { key: w, type: 'button', className: 'secondary', onClick: function () { var x2 = Object.assign({}, fills); x2[w] = (x2[w] || 0) + 1; setFills(x2); } }, w + ' · ' + (fills[w] || 0)); })),
            h('p', null, h('strong', null, totalF + ' filler' + (totalF === 1 ? '' : 's')), ' ', totalF ? h('button', { type: 'button', className: 'secondary jx-fix', onClick: function () { setFills({}); } }, 'Reset') : null))); } },
        { id: 'review', label: '✅ Self-review', render: function () { return h('div', { className: 'jx-card' },
          h('p', { className: 'jx-muted' }, 'After you speak, tick what went well.'),
          REVIEW.map(function (x) { return h('label', { key: x, className: 'jx-check' }, h('input', { type: 'checkbox', checked: !!rev[x], onChange: function (e) { var y = Object.assign({}, rev); y[x] = e.target.checked; setRev(y); } }), h('span', null, x)); }),
          h('p', null, h('strong', null, score + ' / ' + REVIEW.length), ' — ', score >= 7 ? 'Brilliant! Try a longer talk next.' : score >= 4 ? 'Good progress. Pick one item to work on next time.' : 'Every speaker starts here. Try one drill today.'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { setRev({}); } }, 'Start a new review')); } }
      ] }));
  }
  JNZX.SpeakPractice = SpeakPractice;

  /* ---------- My Kiwi Adventures: 10+ ideas for every city and town ---------- */
  var CITY = {
    'Auckland': ['Walk up Maungawhau / Mt Eden for city views', 'Take the ferry to Devonport or Waiheke Island', 'Explore Auckland Museum in the Domain', 'Try fresh fish and chips at Mission Bay', 'Spot gannets at Muriwai on the west coast'],
    'Whangārei': ['See Whangārei Falls and the loop walk', 'Wander the Town Basin marina and art galleries', 'Climb Mt Manaia at Whangārei Heads', 'Try a local kūmara dish or fresh Northland citrus'],
    'Hamilton': ['Explore the themed Hamilton Gardens', 'Walk or bike the Waikato River paths', 'Visit Hamilton Zoo', 'Grab brunch on Hood Street'],
    'Tauranga': ['Climb Mauao (Mount Maunganui) at sunrise', 'Swim at Main Beach or the hot salt-water pools', 'Pick up fresh kiwifruit from a roadside stall', 'Walk The Strand waterfront'],
    'Rotorua': ['Watch the geysers and mud pools at a geothermal park', 'Walk among the giant trees of the Redwoods', 'Enjoy a hāngī at a cultural evening', 'Ride the gondola and luge', 'Soak in a natural hot pool'],
    'Taupō': ['See the roaring Huka Falls', 'Walk the lakefront and spot the snowy volcanoes', 'Soak in the free Spa Park hot stream', 'Try trout-shaped treats at a local bakery'],
    'Gisborne': ['Be among the first in the world to see the sunrise', 'Swim or surf at Wainui Beach', 'Walk up Titirangi / Kaiti Hill', 'Taste fresh local citrus and seasonal fruit'],
    'Napier': ['Take an Art Deco walk through the city', 'Stroll Marine Parade and the sunken gardens', 'Visit the National Aquarium', 'Try a fresh fruit ice cream from Hawke’s Bay'],
    'Hastings': ['Climb Te Mata Peak for huge views', 'Visit the Hawke’s Bay Farmers’ Market', 'Pick your own berries in summer', 'Explore Splash Planet with the kids'],
    'New Plymouth': ['Walk the Coastal Walkway to Te Rewa Rewa Bridge', 'Visit Pukekura Park and its lights in summer', 'See the Len Lye Centre', 'View Taranaki Maunga on a clear day'],
    'Whanganui': ['Ride the historic Durie Hill elevator', 'Paddle or cruise on the Whanganui River', 'Visit the Sarjeant Gallery', 'Explore Virginia Lake'],
    'Palmerston North': ['Walk the Manawatū River pathway', 'Visit Te Manawa museum and science centre', 'Explore the Victoria Esplanade gardens', 'Catch a game at the Arena'],
    'Wellington': ['Ride the Cable Car to the Botanic Garden', 'Explore Te Papa museum (free entry)', 'Walk up Mount Victoria lookout', 'Try a flat white in a Cuba Street café', 'Spot seals on the south coast'],
    'Lower Hutt': ['Walk the Hutt River trail', 'Visit the Dowse Art Museum', 'Picnic at Percy Scenic Reserve', 'Explore Eastbourne’s bays'],
    'Upper Hutt': ['Explore Kaitoke Regional Park and its swing bridge', 'Walk Harcourt Park', 'Visit Staglands wildlife reserve', 'Try a local berry farm in summer'],
    'Porirua': ['Walk Te Ara Piko at Pāuatahanui Inlet', 'Visit Pātaka Art + Museum', 'Swim at Plimmerton Beach', 'Climb up to Colonial Knob'],
    'Masterton': ['Visit Pūkaha National Wildlife Centre', 'Explore Queen Elizabeth Park', 'Take a trip to Castlepoint lighthouse', 'Try a Wairarapa market treat'],
    'Nelson': ['Walk to the Centre of New Zealand lookout', 'Visit the Saturday market', 'Swim at Tāhunanui Beach', 'Explore local art studios'],
    'Blenheim': ['Visit the Omaka Aviation Heritage Centre', 'Bike through the Marlborough countryside', 'Try fresh green-lipped mussels', 'Walk the Taylor River reserve'],
    'Christchurch': ['Wander the Botanic Gardens and Hagley Park', 'Ride a punt on the Avon River', 'Take the gondola up the Port Hills', 'Explore the Riverside Market'],
    'Timaru': ['Swim at Caroline Bay and its playground', 'Watch little blue penguins at dusk', 'Visit the Aigantighe Art Gallery', 'Try a South Canterbury cheese'],
    'Dunedin': ['See albatross and penguins on the Otago Peninsula', 'Walk up Baldwin Street, one of the world’s steepest', 'Visit Larnach Castle', 'Explore the Otago Museum'],
    'Invercargill': ['Spend time in Queens Park', 'Visit Bluff for the signpost and oysters in season', 'See the tuatara at the local museum', 'Explore Oreti Beach'],
    'Queenstown': ['Ride the Skyline gondola', 'Walk the Queenstown Hill Time Walk', 'Take a lake cruise on Whakatipu', 'Try a famous gourmet burger'],
    'Wānaka': ['Photograph the Wānaka tree', 'Climb Roys Peak or Mt Iron', 'Swim at Glendhu Bay', 'Explore Puzzling World'],
    'Whakatāne': ['Walk the Kōhī Point track', 'Visit Ōhope Beach', 'See the Wairaka statue', 'Look out to Moutohorā Island'],
    'Richmond': ['Bike the Great Taste Trail', 'Visit Washbourn Gardens', 'Pick fruit in the Waimea Plains', 'Explore Rabbit Island beach'],
    'Greymouth': ['Visit Shantytown heritage park', 'See the Pancake Rocks at Punakaiki', 'Walk the floodwall at sunset', 'Try West Coast whitebait in season'],
    'Oamaru': ['Explore the Victorian precinct', 'Watch the blue penguins come ashore', 'Visit the Steampunk HQ', 'See the Moeraki Boulders nearby'],
    'Ashburton': ['Walk the Ashburton Domain', 'Visit the Ashburton Art Gallery', 'Explore the Hakatere river mouth', 'Try a farmers’ market treat'],
    'Cambridge': ['Walk Lake Te Koo Utu', 'Bike the Te Awa river ride', 'Visit Maungakawa scenic reserve', 'Browse the town’s antique shops'],
    'Tokoroa': ['Walk Lake Moana-Nui', 'See the Talking Poles', 'Explore the Kinleith forest trails', 'Visit Lake Arapuni'],
    'Pukekohe': ['Visit a market garden stand for fresh vegetables', 'Walk Pukekohe Hill', 'Explore the Waiuku forest', 'Pick strawberries in summer'],
    'Kaitaia': ['Drive to Cape Rēinga lighthouse', 'Explore Ninety Mile Beach', 'Slide down the Te Paki sand dunes', 'Try fresh local seafood'],
    'Kerikeri': ['Visit the Stone Store, NZ’s oldest stone building', 'Walk to Rainbow Falls', 'Explore the Waitangi Treaty Grounds nearby', 'Taste local citrus and chocolate']
  };
  var CITY_GENERIC = [
    ['Go to', 'A local library — free events, books and holiday programmes'],
    ['Go to', 'The best playground in town for a family picnic'],
    ['Food to try', 'A pie from the local bakery — rate it out of ten'],
    ['Food to try', 'Fish and chips eaten on the beach or by the river'],
    ['Must experience', 'A weekend farmers’ market'],
    ['Must experience', 'A sunset walk at a local lookout'],
    ['Must experience', 'A free community event or festival'],
    ['Go to', 'The local i-SITE for maps and hidden gems']
  ];
  try {
    xCityDefault = function (city) {
      var own = (CITY[city] || ['Choose a local park, museum or public garden', 'Find a walking track near town', 'Visit the local museum or gallery']).map(function (t, i) { return { kind: i === CITY[city] && CITY[city].length - 1 ? 'Food to try' : /try|taste|grab|brunch|pie|treat|mussels|oyster|whitebait|seafood|burger/i.test(t) ? 'Food to try' : i % 2 ? 'Must experience' : 'Go to', text: t, done: false }; });
      var extra = CITY_GENERIC.map(function (g) { return { kind: g[0], text: g[1], done: false }; });
      return own.concat(extra).slice(0, Math.max(10, own.length + extra.length));
    };
  } catch (e) {}

  /* ---------- Smart Little Savings: one tip at a time, share any tip ---------- */
  try {
    var SAVE_PIC = { 'Groceries': './photo-share/savings-groceries.webp', 'Money habits': './photo-share/savings-money.webp', 'Home & bills': './photo-share/savings-home.webp' };
    SavingTips = function SmartSavings() {
      var all = expandedSavingTips, cats = ['All tips'].concat(savingCategories);
      var f = useState('All tips'), filter = f[0], setFilter = f[1];
      var q = useState(''), qq = q[0], setQ = q[1];
      var pg = useState(0), page = pg[0], setPage = pg[1];
      var pool = all.filter(function (t) { return filter === 'All tips' || t.category === filter; });
      var ix = useState(function () { return Math.floor(Math.random() * all.length); }), i = ix[0], setI = ix[1];
      var cur = pool[i % pool.length] || all[0];
      var list = pool.filter(function (t) { return !qq || (t.title + ' ' + t.text).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
      var per = 12, pages = Math.max(1, Math.ceil(list.length / per)), p = Math.min(page, pages - 1);
      var pic = SAVE_PIC[cur.category] || './photo-share/savings-home.webp', src; try { src = jAsset(pic); } catch (e) { src = pic; }
      function another() { var n = i; if (pool.length > 1) while (n % pool.length === i % pool.length) n = Math.floor(Math.random() * pool.length); setI(n); }
      return h('div', { className: 'jx-page jx-save' },
        JNZX.Header('MODERN & LIFESTYLE · SMART LITTLE SAVINGS', 'Small savings, big smiles.', all.length + ' original money-saving ideas for groceries, money habits and home & bills.'),
        h(JNZX.Chips, { label: 'Category', options: cats.map(function (c) { return { value: c, label: c === 'All tips' ? 'All' : c }; }), value: filter, onChange: function (v) { setFilter(v); setPage(0); setI(Math.floor(Math.random() * 100)); } }),
        h('div', { className: 'jx-save-hero', style: { backgroundImage: 'linear-gradient(90deg,rgba(10,30,25,.82),rgba(10,30,25,.35)),url("' + src + '")' } },
          h('small', null, '💡 ' + cur.category.toUpperCase()), h('h2', null, cur.title), h('p', null, cur.text)),
        h('div', { className: 'jx-row' },
          h('button', { type: 'button', className: 'primary', onClick: another }, '🔄 Another tip'),
          h(JNZX.ShareMini, { title: 'Saving tip: ' + cur.title, text: '💰 Saving tip — ' + cur.title + ': ' + cur.text + ' (The James NZ)', label: 'Share this tip' })),
        h('h3', { className: 'jx-save-h' }, 'Browse all tips'),
        h(JNZX.Search, { value: qq, onChange: function (v) { setQ(v); setPage(0); }, placeholder: 'Search bills, lunch, goals…' }),
        h('p', { className: 'small-note' }, list.length + ' tips · page ' + (p + 1) + ' of ' + pages),
        h('ul', { className: 'jx-lift-list' }, list.slice(p * per, p * per + per).map(function (t) {
          return h('li', { key: t.id }, h('span', null, h('strong', null, t.title + '. '), t.text, h('small', null, ' · ' + t.category)),
            h('span', { className: 'jx-lift-li-tools' }, h(JNZX.ShareMini, { title: 'Saving tip: ' + t.title, text: '💰 Saving tip — ' + t.title + ': ' + t.text + ' (The James NZ)', label: 'Share' })));
        })),
        pages > 1 && h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', disabled: p === 0, onClick: function () { setPage(p - 1); } }, '← Previous'), h('button', { type: 'button', className: 'secondary', disabled: p >= pages - 1, onClick: function () { setPage(p + 1); } }, 'Next →')),
        h(JNZX.ShareBar, { tab: 'Saving tips' }));
    };
    JNZX.ownShare['Saving tips'] = 1;
  } catch (e) { console.warn('[JNZX] savings', e); }

  /* ---------- Home & Green: one tip at a time with 🔄 Another ---------- */
  var HG = [
    ['⏰ Time', 'Pick three must-dos for today and let the rest be bonus points.'], ['⏰ Time', 'Set a 10-minute timer and race it — tidying feels shorter with a deadline.'],
    ['⏰ Time', 'Do the two-minute jobs straight away: hang the towel, rinse the cup.'], ['⏰ Time', 'Lay out tomorrow’s clothes and bags tonight. Future you says thanks.'],
    ['⏰ Time', 'Batch the errands: post shop, pharmacy and supermarket in one loop.'], ['⏰ Time', 'Keep one “home admin” half-hour a week for bills, forms and emails.'],
    ['⏰ Time', 'Leave a 15-minute buffer between plans for traffic, toddlers and surprises.'], ['⏰ Time', 'Make the bed first thing — one win before breakfast.'],
    ['⏰ Time', 'Cook once, eat twice: double the dinner and freeze half.'], ['⏰ Time', 'Put a basket at the bottom of the stairs for things that live upstairs.'],
    ['🌱 Garden', 'Plant herbs near the kitchen door so you actually use them.'], ['🌱 Garden', 'Water the roots in the early morning, not the leaves at midday.'],
    ['🌱 Garden', 'Mulch around plants to keep moisture in and weeds out.'], ['🌱 Garden', 'Sow a short row of lettuce every few weeks for a steady supply.'],
    ['🌱 Garden', 'Grow mint in a pot — in the garden it takes over the neighbourhood.'], ['🌱 Garden', 'Save egg cartons for seedlings and plant the whole cup later.'],
    ['🌱 Garden', 'Feed the soil with compost and it will feed you back.'], ['🌱 Garden', 'Plant flowers among the veges to invite bees and helpful insects.'],
    ['🌱 Garden', 'In spring, plant tomatoes after the last frost in your area.'], ['🌱 Garden', 'In autumn, plant garlic, broad beans and winter greens.'],
    ['🌱 Garden', 'Let kids own a small patch — strawberries and sunflowers are winners.'], ['🌱 Garden', 'Collect rainwater in a barrel for the garden in summer.'],
    ['🧽 Cleaning', 'Clean top to bottom: dust shelves first, then the floor.'], ['🧽 Cleaning', 'A squeegee after each shower keeps glass and tiles mould-free.'],
    ['🧽 Cleaning', 'Wipe the microwave by heating a bowl of water and lemon for two minutes.'], ['🧽 Cleaning', 'Open windows for 10 minutes a day to dry out damp air.'],
    ['🧽 Cleaning', 'Wash pillows and the doormat more often than you think.'], ['🧽 Cleaning', 'Never mix bleach with vinegar or ammonia — the fumes are dangerous.'],
    ['🧽 Cleaning', 'Keep a caddy with cloths and spray in the bathroom for quick wipes.'], ['🧽 Cleaning', 'One load of washing a day beats a mountain on Saturday.'],
    ['🧽 Cleaning', 'Baking soda on a damp cloth lifts marks from sinks and stovetops.'], ['🧽 Cleaning', 'Vacuum the fridge coil once a year — it runs cheaper.'],
    ['🏡 Warm & dry', 'Close curtains at dusk in winter to hold in the day’s warmth.'], ['🏡 Warm & dry', 'Dry washing outside or in a ventilated space to cut indoor damp.'],
    ['🏡 Warm & dry', 'Use extractor fans while cooking and showering, and for 10 minutes after.'], ['🏡 Warm & dry', 'Block draughts under doors with a rolled towel or a snake.'],
    ['🏡 Warm & dry', 'Wipe condensation off windows each morning to stop mould.'], ['🏡 Warm & dry', 'Aim for a comfortable 18–20 °C in living areas in winter.'],
    ['🏡 Warm & dry', 'Move furniture a little away from outside walls so air can circulate.'], ['🏡 Warm & dry', 'Test smoke alarms monthly and change batteries when needed.'],
    ['♻️ Green', 'Check your council’s recycling rules — they differ around the country.'], ['♻️ Green', 'Rinse containers before recycling; dirty items can spoil a whole load.'],
    ['♻️ Green', 'Keep a bag in the car for shopping and a cup for takeaway coffee.'], ['♻️ Green', 'Start a compost bin or worm farm for food scraps.'],
    ['♻️ Green', 'Fix before you replace: a loose button or wobbly chair is often a 5-minute job.'], ['♻️ Green', 'Swap clothes and toys with friends instead of buying new.'],
    ['♻️ Green', 'Turn off lights and switch off at the wall when you leave a room.'], ['♻️ Green', 'Wash clothes in cold water — it saves power and colours.'],
    ['♻️ Green', 'Plan meals to waste less food, and freeze leftovers early.'], ['♻️ Green', 'Walk or bike short trips — better for you and the planet.'],
    ['♻️ Green', 'Take soft plastics to a drop-off point if your area has one.'], ['♻️ Green', 'Choose a refill station for soap and cleaning products.'],
    ['🧺 Organise', 'One in, one out: when something new comes home, something old leaves.'], ['🧺 Organise', 'Label shelves and boxes so everyone knows where things live.'],
    ['🧺 Organise', 'Keep a donate bag in the wardrobe for clothes that no longer fit.'], ['🧺 Organise', 'Give every room a five-minute reset before bed.'],
    ['🧺 Organise', 'Hooks by the door for keys, bags and jackets save the morning hunt.'], ['🧺 Organise', 'Store like with like: batteries together, tape together, chargers together.']
  ];
  try {
    var BaseHG = HomeGarden;
    HomeGarden = function HomeGreen() {
      var ix = useState(function () { return Math.floor(Math.random() * HG.length); }), i = ix[0], setI = ix[1];
      var c = useState('All'), cat = c[0], setCat = c[1];
      var cats = ['All'].concat(HG.map(function (x) { return x[0]; }).filter(function (x, k, a) { return a.indexOf(x) === k; }));
      var pool = HG.filter(function (x) { return cat === 'All' || x[0] === cat; }), cur = pool[i % pool.length];
      function another() { var n = i; if (pool.length > 1) while (n % pool.length === i % pool.length) n = Math.floor(Math.random() * 1000); setI(n); }
      return h(R.Fragment, null,
        h('section', { className: 'jx-hg' },
          h('p', { className: 'eyebrow' }, 'COMMUNITY · HOME & GREEN'),
          h('h2', null, 'A little tip for your home'),
          h(JNZX.Chips, { label: 'Tip type', options: cats, value: cat, onChange: function (v) { setCat(v); setI(Math.floor(Math.random() * 1000)); } }),
          h('div', { className: 'jx-cs-card jx-hg-card jx-keep-colour' }, h('small', null, cur[0].toUpperCase()), h('p', null, cur[1])),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'primary', onClick: another }, '🔄 Another tip'),
            h(JNZX.ShareMini, { title: 'Home & Green tip', text: '🏡 ' + cur[1] + ' (The James NZ)', label: 'Share this tip' }))),
        h(BaseHG));
    };
  } catch (e) { console.warn('[JNZX] home green', e); }
})();
