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
})();
