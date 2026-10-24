/* The James NZ — site structure and shared tools (October 2026).
   Loaded after script.js. Adds the nine-section menu, topic pages,
   clickable breadcrumbs, page links and the share bar used by new pages.
   Feature pages register themselves with JNZX.register() from the other
   extras-*.js files. */
(function () {
  'use strict';
  var R = import_react, h = jH;
  var useState = R.useState, useEffect = R.useEffect, useRef = R.useRef, useMemo = R.useMemo;

  /* ---------- tiny icon set (stroke icons, 24×24) ---------- */
  function icon(paths) {
    return function JnzIcon(props) {
      var size = (props && props.size) || 20;
      return h('svg', { xmlns: 'http://www.w3.org/2000/svg', width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true },
        paths.map(function (d, i) { return h('path', { d: d, key: i }); }));
    };
  }
  var Icons = {
    grid: icon(['M3 3h7v7H3z', 'M14 3h7v7h-7z', 'M14 14h7v7h-7z', 'M3 14h7v7H3z']),
    sparkle: icon(['M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z', 'M19 17v4', 'M17 19h4']),
    target: icon(['M12 21a9 9 0 1 0 0-18 9 9 0 0 0 0 18z', 'M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 13a1 1 0 1 0 0-2 1 1 0 0 0 0 2z']),
    hammer: icon(['M15 12l-8.5 8.5a2.1 2.1 0 0 1-3-3L12 9', 'M17.6 15L22 10.6', 'M20.9 11.7l-1.3-1.3a2 2 0 0 1-.6-1.4V7.9l-2.3-2.4a5.9 5.9 0 0 0-4.2-1.7H9l.9.8A6.2 6.2 0 0 1 12 9.2v1.1l2 2h2.5a2 2 0 0 1 1.4.6l1.3 1.3']),
    puzzle: icon(['M19.4 15.4a2 2 0 1 0-2.8-2.8l-1.6-1.6 1.6-1.6a2 2 0 1 0-2.8-2.8L12.2 8.2 10.6 6.6a1 1 0 0 0-1.4 0L6.6 9.2a1 1 0 0 0 0 1.4l1.6 1.6-1.6 1.6a2 2 0 1 0 2.8 2.8l1.6-1.6 1.6 1.6a1 1 0 0 0 1.4 0l2.6-2.6z']),
    star: icon(['M12 2l3.1 6.3 6.9 1-5 4.9 1.2 6.8L12 17.8 5.8 21l1.2-6.8-5-4.9 6.9-1z']),
    flask: icon(['M9 3h6', 'M10 3v6L4.6 18.4A1.7 1.7 0 0 0 6.1 21h11.8a1.7 1.7 0 0 0 1.5-2.6L14 9V3', 'M7 15h10']),
    calc: icon(['M6 2h12a2 2 0 0 1 2 2v16a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z', 'M8 6h8v4H8z', 'M8 14h.01', 'M12 14h.01', 'M16 14h.01', 'M8 18h.01', 'M12 18h.01', 'M16 18h.01']),
    book: icon(['M4 19.5A2.5 2.5 0 0 1 6.5 17H20', 'M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z']),
    award: icon(['M12 15a7 7 0 1 0 0-14 7 7 0 0 0 0 14z', 'M8.2 13.9L7 23l5-3 5 3-1.2-9.1']),
    mic: icon(['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3']),
    halo: icon(['M12 8a6 2 0 1 0 0-4 6 2 0 0 0 0 4z', 'M12 22a6 6 0 0 0 6-6v-2H6v2a6 6 0 0 0 6 6z', 'M12 10v4']),
    scroll: icon(['M8 21h12a2 2 0 0 0 2-2v-2H10v2a2 2 0 1 1-4 0V5a2 2 0 1 0-4 0v3h4', 'M19 17V5a2 2 0 0 0-2-2H4']),
    library: icon(['M4 4v16', 'M8 4v16', 'M12 4l4 16', 'M18 4v16', 'M2 20h20']),
    leaf: icon(['M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 2 4.2 2 8 0 5.5-4.8 10-10 10z', 'M2 21c0-3 1.9-5.4 5.1-6']),
    palette: icon(['M12 22a10 10 0 1 1 10-10c0 2.8-2.2 4-4 4h-2a2 2 0 0 0-1.4 3.4A1.6 1.6 0 0 1 12 22z', 'M7.5 10.5h.01', 'M12 7.5h.01', 'M16.5 10.5h.01']),
    keyboard: icon(['M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1z', 'M6 10h.01', 'M10 10h.01', 'M14 10h.01', 'M18 10h.01', 'M7 14h10']),
    share: icon(['M18 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M6 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M18 22a3 3 0 1 0 0-6 3 3 0 0 0 0 6z', 'M8.6 13.5l6.8 4', 'M15.4 6.5l-6.8 4']),
    gift: icon(['M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'])
  };

  /* ---------- registry ---------- */
  var pages = {};
  var JNZX = window.JNZX = {
    Icons: Icons,
    icon: icon,
    register: function (name, comp) { pages[name] = comp; },
    page: function (tab, navigate, canEdit) {
      if (typeof tab !== 'string') return null;
      if (tab.indexOf('group:') === 0) return h(GroupLanding, { key: tab, tab: tab, navigate: navigate });
      var C = pages[tab];
      if (!C) return null;
      return h(PageFrame, { key: tab, tab: tab, navigate: navigate }, h(C, { navigate: navigate, canEdit: canEdit, tab: tab }));
    }
  };

  /* ---------- the nine-section structure ---------- */
  var old = {};
  navGroups.forEach(function (g) { g.items.forEach(function (it) { old[it.name] = it; }); });
  function keep(name, display, heading, extra) {
    var it = old[name];
    if (!it) { console.warn('[JNZX] missing topic', name); return null; }
    var o = Object.assign({}, it, { displayName: display || it.displayName || it.name, menuHeading: heading });
    return Object.assign(o, extra || {});
  }
  function add(name, display, iconComp, heading, extra) {
    return Object.assign({ name: name, displayName: display, icon: iconComp, menuHeading: heading }, extra || {});
  }
  function overview(title) { return add('group:' + title, 'All ' + title + ' topics', Icons.grid, undefined); }

  var GROUPS = [
    { title: 'Everyday Joy', blurb: 'Little lifts, a good coffee and gentle habits that help you feel your best.', image: './coffee-posts/coffee-01.webp', items: [
      overview('Everyday Joy'),
      keep('Inspiration', 'A Little Lift', 'Enjoy the everyday'),
      keep('Coffee corner', 'Coffee & a Smile'),
      add('x:personal-improvement', 'Personal Improvement', Icons.target, 'Personal Improvement'),
      keep('Focus time', 'Focus'),
      keep('Workouts', 'Move Your Way'),
      keep('Water tracker', 'Water Intake')
    ] },
    { title: 'Kiwi Adventures', blurb: 'Weather, seasonal food, places to explore and know-how for staying safe in Aotearoa.', image: './photo-share/savings-groceries.webp', items: [
      overview('Kiwi Adventures'),
      keep('Weather & OOTD', 'Weather & What to Wear', 'Plan your day'),
      keep('Today’s fruit & vege picks', 'Fresh Picks Today'),
      keep('NZ bucket lists', 'My Kiwi Adventures', 'Explore & discover'),
      keep('NZ quiz', 'How Kiwi Are You?'),
      keep('NZ safety & know-how', 'Safety & Know-how')
    ] },
    { title: 'Family Together', blurb: 'Stories, home life, cooking, money, projects and celebrations to share as a family.', image: './story-pages/story-02-middle.webp', items: [
      overview('Family Together'),
      keep('Reading nook', 'The Story Nook', 'Read & grow'),
      keep('Family tips', 'Family Life, Made Easier', 'Run the home'),
      keep('Homemade recipes', 'From Our Kitchen'),
      keep('Grocery list', 'Shopping Made Simple'),
      keep('Budget tracker', 'My Money Plan'),
      add('x:diy', 'DIY Home Projects', Icons.hammer, 'Make & do'),
      add('x:holidays', 'School Holiday Fun', Icons.puzzle),
      add('x:celebrations', 'Christmas, Easter & Matariki', Icons.star, 'Celebrate together')
    ] },
    { title: 'Learning', blurb: 'Languages, little learners, science, maths, English, leadership and speech.', image: './story-pages/story-03-end.webp', items: [
      overview('Learning'),
      keep('Languages', 'Hello, World!', 'Explore'),
      keep('Kids’ learning & activities', 'Little Learners'),
      add('x:science', 'Science', Icons.flask, 'Subjects'),
      add('x:math', 'Math', Icons.calc),
      add('x:english', 'English', Icons.book),
      add('x:leadership', 'Leadership', Icons.award),
      keep('Speaking practice', 'Speech'),
      keep('Leadership practice', 'Lead with Heart practice', undefined, { hidden: true })
    ] },
    { title: 'Faith & Hope', blurb: 'Prayer, Scripture, the saints, music and places to worship.', image: './photo-share/prayer.webp', items: [
      overview('Faith & Hope'),
      keep('Today’s prayer', 'Today’s Prayer', 'A moment of prayer'),
      keep('Communal prayers', 'Pray Together'),
      keep('How to pray the rosary', 'The Rosary, Step by Step'),
      keep('Bible & Gospel', 'Scripture & Today’s Gospel', 'Learn & be inspired'),
      keep('Saints day', 'Saint of the Day'),
      keep('Catholic songs & guitar', 'Songs of Faith'),
      keep('Lives that inspire', 'Lives to Learn From'),
      keep('Catholic churches', 'Find a Catholic Church'),
      add('x:saints', 'Saints & Martyrs', Icons.halo, 'Go deeper'),
      add('x:faith-formation', 'Faith Formation Library', Icons.library),
      add('x:bible-dictionary', 'Bible Dictionary', Icons.scroll)
    ] },
    { title: 'Community', blurb: 'Our story, local makers, website help and greener living.', image: './family-seaside-consistent.webp', items: [
      overview('Community'),
      keep('About us', 'About Us', 'Meet our community'),
      keep('Small business', 'Meet Local Makers'),
      keep('How to use this website', 'Start Here: Website Guide', 'Find your way'),
      keep('FAQ', 'Good to Know'),
      keep('Home & garden', 'Home & Green', 'Live lightly'),
      add('x:sustainable', 'Sustainable Living & Recycling', Icons.leaf)
    ] },
    { title: 'Modern & Lifestyle', blurb: 'Creative tools, digital skills and life-stage guides for modern family life.', image: './photo-share/inspiration.webp', items: [
      overview('Modern & Lifestyle'),
      add('x:design', 'Design Studio', Icons.palette, 'Create & work smarter'),
      add('x:shortcuts', 'Office Shortcuts', Icons.keyboard),
      keep('Saving tips', 'Smart Little Savings', 'Life & home'),
      keep('Family checklists', 'Family Checklists'),
      keep('Bible stories for kids', 'Bible Stories for Little Hearts'),
      keep('Pregnancy & baby age', 'Bump & Baby Milestones', 'Growing families'),
      keep('Pregnancy quotes & tips', 'Growing a Little Life'),
      keep('Parenting quotes & tips', 'Parenting with Heart'),
      keep('Breastfeeding quotes & tips', 'Feeding with Love'),
      keep('Partnership quotes & tips', 'Together Time', 'Love & connection'),
      keep('Husband & wife quotes & tips', 'Love Notes & Little Kindnesses'),
      keep('Parent–child & child–parent', 'Our Memory Jar')
    ] }
  ];
  GROUPS.forEach(function (g) { g.items = g.items.filter(Boolean); });
  JNZX.groups = GROUPS;

  navGroups = GROUPS.map(function (g) { return { label: g.title.toUpperCase(), items: g.items }; });
  titles = GROUPS.map(function (g) { return g.title; });
  JNZX.groupTab = function (i) { return 'group:' + GROUPS[i].title; };

  var labels = {};
  GROUPS.forEach(function (g) {
    labels['group:' + g.title] = g.title;
    g.items.forEach(function (it) { labels[it.name] = it.displayName || it.name; });
  });
  labels['Mateo · AI friend'] = 'Ask Mateo';
  try { Object.keys(labels).forEach(function (k) { vTopicLabels[k] = labels[k]; }); } catch (e) {}
  /* Website guide: describe the new menu and remove the old sign-in wording */
  try {
    var guideBefore = NavigationGuide;
    NavigationGuide = function JnzGuide(props) {
      return rTransform(guideBefore(props), function (n) {
        if (typeof n.props.children !== 'string') return n;
        var t = n.props.children;
        if (t.indexOf('open a category along the top') >= 0) t = 'On a computer, click a section name along the top (for example Learning) to see all of its topics, or click the small arrow beside it for a quick menu. On a phone, tap Menu, then expand a section. The path at the top of each page (Home / LEARNING / Math) is clickable too.';
        t = t.replace('Some tools save in this browser; signed-in family checklists save progress to your account.', 'Your lists, ticks and progress save in this browser on this device.');
        t = t.replace('Open Catholic songs & guitar under Faith & Hope', 'Open Songs of Faith under Faith & Hope');
        return t === n.props.children ? n : import_react.cloneElement(n, {}, t);
      });
    };
  } catch (e) { console.warn('[JNZX] guide', e); }
  JNZX.label = function (tab) { return labels[tab] || (typeof vTopicLabels !== 'undefined' && vTopicLabels[tab]) || tab; };
  JNZX.groupOf = function (tab) {
    for (var i = 0; i < GROUPS.length; i++) if (GROUPS[i].items.some(function (it) { return it.name === tab; })) return i;
    return -1;
  };

  /* Home page discovery cards now open the topic pages. */
  try {
    var homeCards = [0, 1, 2, 3, 4, 5];
    collections = homeCards.map(function (gi, i) {
      var g = GROUPS[gi];
      var base = collections[i] || {};
      return Object.assign({}, base, { title: g.title, section: 'group:' + g.title, image: base.image || jAsset(g.image) });
    });
    zHomeCopy[3] = ['Keep', 'learning.', 'Science, maths, English, leadership and speech.'];
    zHomeCopy[5] = ['Good company.', 'Little connections.', 'Our family, local makers, guides and greener living.'];
  } catch (e) { console.warn('[JNZX] home cards', e); }

  /* ---------- breadcrumbs ---------- */
  JNZX.crumbs = function (tab, navigate) {
    if (tab.indexOf('group:') === 0) return [h('strong', { key: 'g', className: 'jx-crumb-current' }, tab.slice(6).toUpperCase())];
    var gi = JNZX.groupOf(tab);
    var out = [];
    if (gi >= 0) {
      out.push(h('button', { key: 'g', type: 'button', className: 'jx-crumb-link', onClick: function () { navigate(JNZX.groupTab(gi)); } }, GROUPS[gi].title.toUpperCase()));
      out.push(h('span', { key: 's' }, '/'));
      var parent = GROUPS[gi].items.find(function (it) { return it.name === 'x:personal-improvement'; });
      if (parent && ['Focus time', 'Workouts', 'Water tracker'].indexOf(tab) >= 0) {
        out.push(h('button', { key: 'p', type: 'button', className: 'jx-crumb-link', onClick: function () { navigate('x:personal-improvement'); } }, 'Personal Improvement'));
        out.push(h('span', { key: 's2' }, '/'));
      }
      if (tab === 'Leadership practice') {
        out.push(h('button', { key: 'p', type: 'button', className: 'jx-crumb-link', onClick: function () { navigate('x:leadership'); } }, 'Leadership'));
        out.push(h('span', { key: 's2' }, '/'));
      }
    }
    out.push(h('span', { key: 'c', className: 'jx-crumb-current' }, JNZX.label(tab)));
    return out;
  };

  /* ---------- links and sharing ---------- */
  JNZX.pageUrl = function (tab) {
    var base = 'https://thejamesnz.com/';
    try { if (/^https?:/.test(location.protocol) && location.hostname && location.hostname !== 'thejamesnz.com') base = location.origin + location.pathname; } catch (e) {}
    return base + '#section=' + encodeURIComponent(tab);
  };

  function ShareBar(props) {
    var tab = props.tab, title = props.title || JNZX.label(tab);
    var url = JNZX.pageUrl(tab);
    var text = props.text || (title + ' · The James NZ');
    var st = useState(''), msg = st[0], setMsg = st[1];
    var o = useState(false), open = o[0], setOpen = o[1];
    function copy() {
      var done = function () { setMsg('Link copied.'); };
      try { navigator.clipboard.writeText(url).then(done, function () { setMsg('Copy this link: ' + url); }); } catch (e) { setMsg('Copy this link: ' + url); }
    }
    async function share() {
      if (navigator.share) {
        try { await navigator.share({ title: title, text: text, url: url }); setMsg(''); return; }
        catch (e) { if (e && e.name === 'AbortError') return; }
      }
      setOpen(true);
    }
    var enc = encodeURIComponent;
    return h('div', { className: 'jx-share' },
      h('button', { type: 'button', className: 'primary', onClick: share }, h(Icons.share, { size: 17 }), props.label || 'Share this page'),
      h('button', { type: 'button', className: 'secondary', onClick: function () { setOpen(!open); } }, open ? 'Hide options' : 'More ways'),
      open && h('div', { className: 'jx-share-row' },
        h('a', { className: 'secondary', href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(url), target: '_blank', rel: 'noopener noreferrer' }, 'Facebook'),
        h('a', { className: 'secondary', href: 'https://wa.me/?text=' + enc(text + ' ' + url), target: '_blank', rel: 'noopener noreferrer' }, 'WhatsApp'),
        h('a', { className: 'secondary', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + enc(url), target: '_blank', rel: 'noopener noreferrer' }, 'LinkedIn'),
        h('a', { className: 'secondary', href: 'mailto:?subject=' + enc(title + ' · The James NZ') + '&body=' + enc(text + '\n' + url) }, 'Email'),
        h('button', { type: 'button', className: 'secondary', onClick: copy }, 'Copy link'),
        props.printable && h('button', { type: 'button', className: 'secondary', onClick: function () { window.print(); } }, 'Print or save as PDF')),
      msg && h('p', { className: 'small-note', role: 'status' }, msg));
  }
  JNZX.ShareBar = ShareBar;

  /* ---------- shared building blocks ---------- */
  function PageFrame(props) {
    useEffect(function () { try { window.scrollTo({ top: 0 }); } catch (e) {} }, [props.tab]);
    return h('div', { className: 'jx-page' }, props.children);
  }
  JNZX.Header = function (kicker, title, text) {
    return h('header', { className: 'jx-head' }, h('p', { className: 'eyebrow' }, kicker), h('h1', null, title), text && h('p', { className: 'jx-lead' }, text));
  };
  /* Tabs: [{id,label,render()}] */
  JNZX.Tabs = function Tabs(props) {
    var key = 'jnzx-tab-' + props.id;
    var init = props.items[0].id;
    try { var saved = sessionStorage.getItem(key); if (saved && props.items.some(function (t) { return t.id === saved; })) init = saved; } catch (e) {}
    var s = useState(init), cur = s[0], setCur = s[1];
    var item = props.items.find(function (t) { return t.id === cur; }) || props.items[0];
    return h('div', { className: 'jx-tabs' },
      h('div', { className: 'jx-tablist', role: 'tablist', 'aria-label': props.label || 'Sections' }, props.items.map(function (t) {
        return h('button', { key: t.id, type: 'button', role: 'tab', 'aria-selected': t.id === item.id, className: 'jx-tab' + (t.id === item.id ? ' is-on' : ''),
          onClick: function () { setCur(t.id); try { sessionStorage.setItem(key, t.id); } catch (e) {} } }, t.label);
      })),
      h('div', { className: 'jx-tabpanel', role: 'tabpanel' }, item.render()));
  };
  /* Cached JSON loader for the data/ folder */
  var cache = {};
  JNZX.load = function (path) {
    if (!cache[path]) cache[path] = fetch(path, { cache: 'force-cache' }).then(function (r) { if (!r.ok) throw Error('Could not load ' + path); return r.json(); });
    cache[path].catch(function () { delete cache[path]; });
    return cache[path];
  };
  JNZX.useData = function (path) {
    var s = useState({ data: null, error: '' }), st = s[0], set = s[1];
    useEffect(function () {
      var live = true;
      if (!path) return;
      JNZX.load(path).then(function (d) { if (live) set({ data: d, error: '' }); }, function () { if (live) set({ data: null, error: 'This section could not load. Check your connection and try again.' }); });
      return function () { live = false; };
    }, [path]);
    return st;
  };
  /* localStorage-backed state */
  JNZX.useStored = function (key, initial) {
    var s = useState(function () { try { var v = localStorage.getItem(key); return v === null ? initial : JSON.parse(v); } catch (e) { return initial; } });
    useEffect(function () { try { localStorage.setItem(key, JSON.stringify(s[0])); } catch (e) {} }, [key, s[0]]);
    return s;
  };
  JNZX.Search = function (props) {
    return h('label', { className: 'jx-search' }, h('span', { className: 'jx-sr' }, props.label || 'Search'),
      h('input', { type: 'search', value: props.value, placeholder: props.placeholder || 'Search', onChange: function (e) { props.onChange(e.target.value); } }));
  };
  JNZX.Chips = function (props) {
    return h('div', { className: 'jx-chips', role: 'group', 'aria-label': props.label || 'Filter' }, props.options.map(function (o) {
      var v = typeof o === 'string' ? o : o.value, l = typeof o === 'string' ? o : o.label;
      return h('button', { key: v, type: 'button', className: 'jx-chip' + (props.value === v ? ' is-on' : ''), 'aria-pressed': props.value === v, onClick: function () { props.onChange(v); } }, l);
    }));
  };
  JNZX.Pager = function (props) {
    if (props.pages <= 1) return null;
    return h('div', { className: 'jx-pager' },
      h('button', { type: 'button', className: 'secondary', disabled: props.page <= 0, onClick: function () { props.onPage(props.page - 1); } }, '← Previous'),
      h('span', null, 'Page ' + (props.page + 1) + ' of ' + props.pages),
      h('button', { type: 'button', className: 'secondary', disabled: props.page >= props.pages - 1, onClick: function () { props.onPage(props.page + 1); } }, 'Next →'));
  };
  JNZX.esc = function (s) { return String(s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); };
  /* Simple accordion list: [{title, body(), meta}] */
  JNZX.Accordion = function (props) {
    var s = useState(props.openFirst ? 0 : -1), open = s[0], setOpen = s[1];
    return h('div', { className: 'jx-acc' }, props.items.map(function (it, i) {
      var on = open === i;
      return h('section', { key: it.key || i, className: 'jx-acc-item' + (on ? ' is-open' : '') },
        h('button', { type: 'button', className: 'jx-acc-head', 'aria-expanded': on, onClick: function () { setOpen(on ? -1 : i); } },
          h('span', null, it.title), it.meta && h('small', null, it.meta), h('span', { className: 'jx-acc-sign', 'aria-hidden': true }, on ? '−' : '+')),
        on && h('div', { className: 'jx-acc-body' }, it.body()));
    }));
  };

  /* ---------- topic landing pages ---------- */
  function GroupLanding(props) {
    var title = props.tab.slice(6);
    var g = GROUPS.find(function (x) { return x.title === title; });
    useEffect(function () { try { window.scrollTo({ top: 0 }); } catch (e) {} }, [title]);
    if (!g) return h('p', null, 'This section has moved. Choose a topic from the menu.');
    var items = g.items.filter(function (it) { return it.name.indexOf('group:') !== 0 && !it.hidden; });
    var sections = [];
    items.forEach(function (it) {
      if (it.menuHeading || !sections.length) sections.push({ heading: it.menuHeading || '', items: [] });
      sections[sections.length - 1].items.push(it);
    });
    return h('div', { className: 'jx-page jx-landing' },
      h('header', { className: 'jx-landing-head' },
        h('div', null, h('p', { className: 'eyebrow' }, 'THE JAMES NZ · ' + title.toUpperCase()), h('h1', null, title), h('p', { className: 'jx-lead' }, g.blurb)),
        h('img', { src: jAsset(g.image), alt: '', loading: 'lazy', className: 'jx-landing-img' })),
      sections.map(function (sec, si) {
        return h('section', { key: si, className: 'jx-landing-sec' },
          sec.heading && h('h2', null, sec.heading),
          h('div', { className: 'jx-topic-grid' }, sec.items.map(function (it) {
            var Ico = it.icon || Icons.grid;
            return h('button', { key: it.name, type: 'button', className: 'jx-topic', onClick: function () { props.navigate(it.name); } },
              h('span', { className: 'jx-topic-ico' }, h(Ico, { size: 22 })),
              h('span', { className: 'jx-topic-name' }, it.displayName || it.name),
              h('span', { className: 'jx-topic-go', 'aria-hidden': true }, '→'));
          })));
      }),
      h(ShareBar, { tab: props.tab, title: title }));
  }

  /* Personal Improvement overview */
  JNZX.register('x:personal-improvement', function PersonalImprovement(props) {
    var cards = [
      ['Focus time', 'Focus', 'Short focus sessions, a noticing game and simple mindfulness to settle a busy mind.'],
      ['Workouts', 'Move Your Way', 'Gentle to intense sessions by body area, with clear safety notes.'],
      ['Water tracker', 'Water Intake', 'Log glasses through the day and see your progress at a glance.']
    ];
    return h('div', null,
      JNZX.Header('EVERYDAY JOY · PERSONAL IMPROVEMENT', 'A little better, at your pace.', 'Three small habits that add up: focus, movement and water. Choose one to start today.'),
      h('div', { className: 'jx-cards3' }, cards.map(function (c) {
        return h('article', { key: c[0], className: 'jx-card' }, h('h2', null, c[1]), h('p', null, c[2]),
          h('button', { type: 'button', className: 'primary', onClick: function () { props.navigate(c[0]); } }, 'Open ' + c[1] + ' →'));
      })),
      h('div', { className: 'jx-note' }, h('strong', null, 'Tip: '), 'Pair a habit with something you already do — a glass of water with your morning coffee, a five-minute focus session before checking messages, a short walk after dinner.'),
      h(ShareBar, { tab: props.tab }));
  });

  /* Hidden routes still open from links */
  var prevInitial = cInitialSection;
  cInitialSection = function () {
    try {
      var p = new URLSearchParams(cLocationHash().slice(1)), sec = p.get('section');
      if (sec && (sec.indexOf('group:') === 0 && GROUPS.some(function (g) { return 'group:' + g.title === sec; }) || pages[sec])) return sec;
    } catch (e) {}
    return prevInitial();
  };
})();
