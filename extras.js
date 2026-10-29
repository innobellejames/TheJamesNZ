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
    calendar: icon(['M3 5h18v16H3z', 'M3 10h18', 'M8 3v4', 'M16 3v4', 'M8 14h.01', 'M12 14h.01', 'M16 14h.01', 'M8 18h.01', 'M12 18h.01']),
    briefcase: icon(['M3 7h18v13H3z', 'M8 7V4h8v3', 'M3 13h18']),
    hand: icon(['M18 11V6a2 2 0 0 0-4 0v5', 'M14 10V4a2 2 0 0 0-4 0v6', 'M10 10.5V6a2 2 0 0 0-4 0v8', 'M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.9-6-2.4l-3.6-3.6a2 2 0 0 1 2.8-2.8L7 15']),
    timer: icon(['M10 2h4', 'M12 14l3-3', 'M12 22a8 8 0 1 0 0-16 8 8 0 0 0 0 16z']),
    gift: icon(['M20 12v10H4V12', 'M2 7h20v5H2z', 'M12 22V7', 'M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z', 'M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z'])
  };

  /* ---------- registry ---------- */
  var pages = {};
  var JNZX = window.JNZX = {
    Icons: Icons,
    icon: icon,
    register: function (name, comp) { pages[name] = comp; },
    has: function (name) { return !!pages[name]; },
    page: function (tab, navigate, canEdit) {
      if (typeof tab !== 'string') return null;
      JNZX._nav = navigate; JNZX._tab = tab;
      if (tab.indexOf('group:') === 0) return h(GroupLanding, { key: tab, tab: tab, navigate: navigate });
      var C = pages[tab], sub = JNZX.hubOf && JNZX.hubOf(tab) ? h(JNZX.SubNav, { key: 'sub-' + tab, tab: tab, navigate: navigate }) : null, main = null;
      if (!C && JNZX.extrasFor && JNZX.extrasFor[tab]) main = h(JNZX.extrasFor[tab], { key: 'extra-' + tab, navigate: navigate, tab: tab });
      else if (C) main = h(PageFrame, { key: tab, tab: tab, navigate: navigate }, h(C, { navigate: navigate, canEdit: canEdit, tab: tab }));
      if (!sub) return main;
      return h(R.Fragment, { key: 'wrap-' + tab }, sub, main);
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
      keep('Focus time', 'Focus'),
      keep('Workouts', 'Move Your Way'),
      keep('Water tracker', 'Water Intake')
    ] },
    { title: 'Kiwi Adventures', blurb: 'Weather, seasonal food, places to explore and know-how for staying safe in Aotearoa.', image: './photo-share/savings-groceries.webp', items: [
      overview('Kiwi Adventures'),
      keep('Weather & OOTD', 'Weather & What to Wear', 'Plan your day'),
      keep('Today’s fruit & vege picks', 'Fresh Picks Today'),
      add('x:seasons', 'Flowers & Fruit Picking', Icons.leaf),
      keep('NZ bucket lists', 'My Kiwi Adventures', 'Explore & discover'),
      keep('NZ quiz', 'How Kiwi Are You?'),
      keep('NZ safety & know-how', 'Safety & Know-how'),
      add('x:world-clock', 'World Clock', Icons.timer),
      add('x:citizenship', 'Mock Citizenship Test', Icons.award, 'Becoming a Kiwi')
    ] },
    { title: 'Family Together', blurb: 'Stories and play, family cooking, baby and toddler, love and connection, and celebrations.', image: './story-pages/story-02-middle.webp', items: [
      overview('Family Together'),
      keep('Reading nook', 'The Story Nook', 'Stories & play'),
      add('x:holidays', 'School Holiday Fun', Icons.puzzle),
      keep('Homemade recipes', 'From Our Kitchen', 'Kitchen'),
      add('x:baby', 'Baby & Toddler', Icons.star, 'Family life & love'),
      keep('Pregnancy & baby age', 'Bump & Baby Milestones', undefined, { hidden: true }),
      keep('Pregnancy quotes & tips', 'Growing a Little Life', undefined, { hidden: true }),
      keep('Breastfeeding quotes & tips', 'Feeding with Love', undefined, { hidden: true }),
      add('x:potty', 'Potty Training Made Easy', Icons.star, undefined, { hidden: true }),
      keep('Parenting quotes & tips', 'Parenting with Heart', undefined, { hidden: true }),
      add('x:love', 'Love & Connection', Icons.halo),
      keep('Partnership quotes & tips', 'Together Time', undefined, { hidden: true }),
      keep('Husband & wife quotes & tips', 'Love Notes & Little Kindnesses', undefined, { hidden: true }),
      keep('Parent–child & child–parent', 'Our Memory Jar', undefined, { hidden: true }),
      add('x:celebrations', 'Christmas, Easter & Matariki', Icons.star),
      add('x:book', 'Flip-book reader', Icons.book, undefined, { hidden: true })
    ] },
    { title: 'Learning', blurb: 'Languages, little learners, science, maths, English, leadership and speech.', image: './story-pages/story-03-end.webp', items: [
      overview('Learning'),
      keep('Languages', 'Hello, World!', 'Explore'),
      keep('Kids’ learning & activities', 'Little Learners'),
      add('x:science', 'Science', Icons.flask, 'Subjects'),
      add('x:math', 'Math', Icons.calc),
      add('x:english', 'English', Icons.book),
      add('x:exam', 'Exam English (IELTS · Cambridge · NZCEL)', Icons.award),
      add('x:leadership', 'Leadership', Icons.award),
      keep('Speaking practice', 'Speech'),
      add('x:speaking-time', 'Speaking Time Calculator', Icons.timer),
      add('x:nzsl', 'NZ Sign Language', Icons.hand),
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
      keep('Bible stories for kids', 'Bible Stories for Little Hearts', 'For little hearts'),
      add('x:saints', 'Saints & Martyrs', Icons.halo, 'Go deeper'),
      add('x:faith-formation', 'Faith Formation Library', Icons.library),
      add('x:bible-dictionary', 'Bible Dictionary', Icons.scroll)
    ] },
    { title: 'Modern & Lifestyle', blurb: 'Creative tools, digital skills, money and shopping, and home and DIY ideas for modern life.', image: './photo-share/inspiration.webp', items: [
      overview('Modern & Lifestyle'),
      add('x:design', 'Design Studio', Icons.palette, 'Create & work smarter'),
      add('x:shortcuts', 'Office Shortcuts', Icons.keyboard),
      keep('Saving tips', 'Smart Little Savings', 'Money & shopping'),
      keep('Budget tracker', 'My Money Plan'),
      keep('Grocery list', 'Shopping Made Simple'),
      add('x:hometips', 'Home Tips & Checklists', Icons.grid, 'Home & living'),
      keep('Family tips', 'Family Life, Made Easier', undefined, { hidden: true }),
      keep('Family checklists', 'Family Checklists', undefined, { hidden: true }),
      add('x:diy', 'DIY Home Projects', Icons.hammer)
    ] },
    { title: 'Community', blurb: 'Our story, local makers, website help and greener living.', image: './oct13/about-storybook-texture.png', items: [
      overview('Community'),
      keep('About us', 'About Us', 'Meet our community'),
      keep('Small business', 'Meet Local Makers'),
      keep('How to use this website', 'Start Here: Website Guide', 'Find your way'),
      keep('FAQ', 'Good to Know'),
      keep('Home & garden', 'Home & Green', 'Live lightly'),
      add('x:sustainable', 'Sustainable Living & Recycling', Icons.leaf),
      add('x:public-holidays', 'NZ Public Holidays', Icons.calendar, 'Plan & work'),
      add('x:jobs', 'Job Search NZ', Icons.briefcase)
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
    var homeCards = ['Everyday Joy', 'Kiwi Adventures', 'Family Together', 'Learning', 'Faith & Hope', 'Community'];
    collections = homeCards.map(function (title, i) {
      var g = GROUPS.find(function (x) { return x.title === title; });
      var base = collections[i] || {};
      return Object.assign({}, base, { title: g.title, section: 'group:' + g.title, image: base.image || jAsset(g.image) });
    });
    zHomeCopy[3] = ['Keep', 'learning.', 'Science, maths, English, leadership and speech.'];
    zHomeCopy[5] = ['Good company.', 'Little connections.', 'Our family, local makers, guides and greener living.'];
  } catch (e) { console.warn('[JNZX] home cards', e); }

  /* ---------- hub pages: short menus, related topics grouped together ---------- */
  var HUBS = {
    'x:hometips': { kicker: 'MODERN & LIFESTYLE · HOME TIPS & CHECKLISTS', title: 'Home tips & checklists.', blurb: 'Practical ideas that make home life easier, and ready-made checklists for big family moments.', kids: ['Family tips', 'Family checklists'] },
    'x:baby': { kicker: 'FAMILY TOGETHER · BABY & TODDLER', title: 'Baby & toddler.', blurb: 'From bump to big kid: milestones, pregnancy, feeding, potty training and parenting — all in one place.', kids: ['Pregnancy & baby age', 'Pregnancy quotes & tips', 'Breastfeeding quotes & tips', 'x:potty', 'Parenting quotes & tips'] },
    'x:love': { kicker: 'FAMILY TOGETHER · LOVE & CONNECTION', title: 'Love & connection.', blurb: 'Little ways to stay close — date ideas, love notes and memories to treasure.', kids: ['Partnership quotes & tips', 'Husband & wife quotes & tips', 'Parent–child & child–parent'] }
  };
  var HUB_OF = {};
  Object.keys(HUBS).forEach(function (k) { HUBS[k].kids.forEach(function (c) { HUB_OF[c] = k; }); });
  JNZX.hubs = HUBS;
  JNZX.hubOf = function (tab) { return HUB_OF[tab] || null; };
  JNZX.SubNav = function SubNav(props) {
    var hub = HUB_OF[props.tab]; if (!hub) return null;
    return h('nav', { className: 'jx-subnav', 'aria-label': JNZX.label(hub) },
      h('button', { type: 'button', className: 'jx-subnav-hub', onClick: function () { props.navigate(hub); } }, '← ' + JNZX.label(hub)),
      HUBS[hub].kids.map(function (k) { return h('button', { key: k, type: 'button', className: k === props.tab ? 'is-on' : '', 'aria-current': k === props.tab ? 'page' : undefined, onClick: function () { props.navigate(k); } }, JNZX.label(k)); }));
  };
  function HubPage(props) {
    var hb = HUBS[props.tab];
    return h('div', { className: 'jx-hub' },
      JNZX.Header(hb.kicker, hb.title, hb.blurb),
      h('span', { className: 'mk-label' }, 'WHAT’S INSIDE'),
      h('div', { className: 'mk-grid' }, hb.kids.map(function (k) {
        var drawn = JNZX.cover && JNZX.cover(k), info = TOPIC[k] || [null, ''], src = drawn || (info[0] ? jAsset(info[0]) : null), emo = (JNZX.coverEmoji && JNZX.coverEmoji(k)) || '✨';
        return h('button', { key: k, type: 'button', className: 'mk-card', onClick: function () { props.navigate(k); } },
          h('span', { className: 'mk-card-media' }, src ? h('img', { src: src, alt: '', loading: 'lazy' }) : null, h('span', { className: 'mk-card-shade' }), h('span', { className: 'mk-card-badge', 'aria-hidden': true }, emo)),
          h('span', { className: 'mk-card-body' }, h('strong', { className: 'mk-card-title' }, JNZX.label(k)), info[1] && h('span', { className: 'mk-card-desc' }, info[1]), h('span', { className: 'mk-card-go' }, 'Explore ', h('span', { 'aria-hidden': true }, '→'))));
      })),
      h(ShareBar, { tab: props.tab }));
  }
  Object.keys(HUBS).forEach(function (k) { JNZX.register(k, HubPage); });


  /* Header "Share this page": a short intro plus a link that opens the page directly */
  JNZX.shareIntro = function (tab) {
    tab = tab || JNZX._tab || 'Home';
    if (tab === 'Home') return 'Kia ora! 🌿 The James NZ — faith, family and little discoveries from Aotearoa: stories, recipes, learning, prayer and everyday joy. Have a look:';
    var info = (TOPIC[tab] || [])[1] || (tab.indexOf('group:') === 0 ? ((GROUPS.find(function (g) { return 'group:' + g.title === tab; }) || {}).blurb || '') : '');
    return JNZX.label(tab) + ' · The James NZ' + (info ? ' — ' + info : '') + ' Have a look:';
  };
  try {
    uSharePage = async function (url, withImage, nav) {
      nav = nav || navigator;
      var intro = JNZX.shareIntro(), text = intro + '\n' + url;
      async function copy(msg) { try { await nav.clipboard.writeText(text); return msg || 'Copied: the intro and link are ready to paste.'; } catch (e) { return uCopyLink(url, nav); } }
      if (withImage) {
        var file = null; try { file = lGetPageBannerFile(); } catch (e) {}
        if (file && nav.share && nav.canShare && nav.canShare({ files: [file] })) {
          try { JNZX.copyText(text).catch(function () {}); await nav.share({ files: [file], title: 'The James NZ', text: text }); return 'Shared! The intro and link were also copied — paste them under the picture if your app drops the text.'; }
          catch (e) { if (e && e.name === 'AbortError') return ''; }
        }
        return copy('Pictures can’t be shared from this browser, so the intro and link were copied instead.');
      }
      if (nav.share) { try { await nav.share({ title: 'The James NZ', text: intro + '\n' + url }); return 'Sharing menu opened.'; } catch (e) { if (e && e.name === 'AbortError') return ''; } }
      return copy();
    };
    uCopyLink = (function (base) { return async function (url, nav) { nav = nav || navigator; try { await nav.clipboard.writeText(JNZX.shareIntro() + '\n' + url); return 'Intro and link copied.'; } catch (e) { return base(url, nav); } }; })(uCopyLink);
  } catch (e) { console.warn('[JNZX] page share', e); }
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
      if (tab === 'x:speaking-time' || tab === 'x:nzsl') {
        out.push(h('button', { key: 'p', type: 'button', className: 'jx-crumb-link', onClick: function () { navigate('Speaking practice'); } }, 'Speech'));
        out.push(h('span', { key: 's2' }, '/'));
      }
      var hub = JNZX.hubOf && JNZX.hubOf(tab);
      if (hub) {
        out.push(h('button', { key: 'hub', type: 'button', className: 'jx-crumb-link', onClick: function () { navigate(hub); } }, JNZX.label(hub)));
        out.push(h('span', { key: 'sh' }, '/'));
      }
      if (tab === 'Leadership practice') {
        out.push(h('button', { key: 'p', type: 'button', className: 'jx-crumb-link', onClick: function () { navigate('x:leadership'); } }, 'Leadership'));
        out.push(h('span', { key: 's2' }, '/'));
      }
    }
    out.push(h('span', { key: 'c', className: 'jx-crumb-current' }, JNZX.label(tab)));
    return out;
  };


  /* The printed/shared QR code used to point at the bare domain. Redraw it for www so every scan opens the site. */
  try {
    (function () {
      var qr = qrcode(0, 'M'); qr.addData('https://www.thejamesnz.com/'); qr.make();
      var n = qr.getModuleCount(), pad = 4, cell = 8, W = (n + pad * 2) * cell, c = document.createElement('canvas'); c.width = c.height = W;
      var g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, W, W); g.fillStyle = '#102a21';
      for (var r = 0; r < n; r++) for (var k = 0; k < n; k++) if (qr.isDark(r, k)) g.fillRect((k + pad) * cell, (r + pad) * cell, cell, cell);
      var url = c.toDataURL('image/png');
      if (window.THE_JAMES_MEDIA) window.THE_JAMES_MEDIA['./october/website-qr.png'] = url;
    })();
  } catch (e) { console.warn('[JNZX] qr', e); }
  /* ---------- links and sharing ---------- */
  JNZX.pageUrl = function (tab) {
    // Every page gets its own address (?p=…) so link previews never reuse an old cached copy.
    var base = 'https://www.thejamesnz.com/';
    try { if (/^https?:/.test(location.protocol) && location.hostname && !/thejamesnz\.com$/.test(location.hostname) && !/github\.io$/.test(location.hostname)) base = location.origin + location.pathname; } catch (e) {}
    var key = tab === 'Mateo · AI friend' ? 'Ask Mateo' : tab;
    var slug = String(tab === 'Home' ? 'home' : JNZX.label ? JNZX.label(tab) : key).toLowerCase().replace(/^group:/, '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'home';
    return base + '?p=' + slug + (tab === 'Home' ? '' : '#section=' + encodeURIComponent(key));
  };

  function ShareBar(props) {
    var tab = props.tab, title = props.title || JNZX.label(tab);
    var o0 = useState(0); var dyn = props.getInfo ? props.getInfo() : null; if (dyn) title = dyn.title || title;
    var url = props.url || JNZX.pageUrl(tab);
    var text = (dyn && dyn.text) || props.text || (title + ' · The James NZ');
    var st = useState(''), msg = st[0], setMsg = st[1];
    var o = useState(false), open = o[0], setOpen = o[1];
    function copy() {
      var done = function () { setMsg('Link copied.'); };
      JNZX.copyText(url).then(done, function () { setMsg('Copy this link: ' + url); });
    }
    var ss = useState(null), sheet = ss[0], setSheet = ss[1];
    function share() {
      if (props.getInfo) { var d2 = props.getInfo(); title = d2.title || title; text = d2.text || text; }
      var blurb = (TOPIC[tab] || [])[1] || '';
      if (!blurb && tab && tab.indexOf('group:') === 0) { var gg = GROUPS.find(function (x) { return 'group:' + x.title === tab; }); blurb = gg ? gg.blurb : ''; }
      var words = text.indexOf(blurb) < 0 && blurb ? title + '\n' + blurb : text;
      setSheet({ title: title, text: words, url: url, bg: props.bg || JNZX.bgFor(tab) });
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
      msg && h('p', { className: 'small-note', role: 'status' }, msg),
      sheet && h(ShareSheet, { o: sheet, onClose: function () { setSheet(null); } }));
  }
  JNZX.ShareBar = ShareBar;
  /* Share bar at the end of pages that came from the original site */
  function viewing() {
    var seen = {}, out = [];
    document.querySelectorAll('main .filters button.selected, main button[aria-pressed="true"], main [role="tab"][aria-selected="true"], main .jx-tab.is-on').forEach(function (b) { var t = (b.textContent || '').replace(/\s+/g, ' ').trim(); if (t && t.length < 40 && !seen[t]) { seen[t] = 1; out.push(t); } });
    return out.slice(0, 4);
  }
  JNZX.ownShare = { 'Water tracker': 1, 'Coffee corner': 1, 'Kids’ learning & activities': 1 };
  JNZX.pageEnd = function (tab, navigate) {
    if (typeof tab !== 'string' || tab === 'Home' || tab.indexOf('group:') === 0 || pages[tab] || JNZX.ownShare[tab]) return null;
    return h('div', { key: 'jx-end-' + tab, className: 'jx-page jx-page-end' }, h(ShareBar, { tab: tab, getInfo: function () { var v = viewing(), base = JNZX.label(tab); return { title: v.length ? base + ' — ' + v.join(' · ') : base, text: (v.length ? base + ' — ' + v.join(' · ') : base) + ' · The James NZ' }; } }));
  };
  /* Small share button for one item on a page (an activity, a project, a workout). */
  /* ---------- sharing that works on every device ----------
     Phones and tablets (iPhone, iPad, Android) use the device's own share menu.
     Computers and in-app browsers without one get a simple menu: picture,
     WhatsApp, email, text message and copy. The words always travel inside the
     message, with a link that opens just this post. */
  JNZX.copyText = function (text) {
    return new Promise(function (ok, bad) {
      function legacy() {
        try { var ta = document.createElement('textarea'); ta.value = text; ta.setAttribute('readonly', ''); ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;font-size:16px'; document.body.appendChild(ta); ta.focus(); ta.select(); ta.setSelectionRange(0, text.length); var done = document.execCommand('copy'); document.body.removeChild(ta); done ? ok() : bad(Error('copy')); } catch (e) { bad(e); }
      }
      try { if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(text).then(ok, legacy); else legacy(); } catch (e) { legacy(); }
    });
  };
  JNZX.postLink = function (title, body) { try { return q7ShareURL({ title: title, text: body, credit: 'The James NZ' }); } catch (e) { return JNZX.pageUrl(JNZX._tab || 'Home'); } };
  JNZX.sharePost = async function (o) {
    // o: {title, text, url} → shares text with the link inside it (apps that ignore a separate url still get everything)
    var msg = o.text + '\n\n' + o.url;
    if (navigator.share) {
      try { await navigator.share({ title: o.title, text: msg }); return 'shared'; }
      catch (e) { if (e && e.name === 'AbortError') return 'cancelled'; }
    }
    return 'menu';
  };
  JNZX.bgFor = function (tab) {
    tab = tab || JNZX._tab || '';
    try {
      var t = TOPIC[tab]; if (t && t[0]) return jAsset(t[0]);
      var g = GROUPS.find(function (x) { return 'group:' + x.title === tab || x.items.some(function (it) { return it.name === tab; }); });
      if (JNZX.cover && JNZX.cover(tab)) return JNZX.cover(tab);
      if (g && g.image) return jAsset(g.image);
    } catch (e) {}
    return jAsset('./photo-share/inspiration.webp');
  };
  JNZX.makePicture = function (o) {
    return createPhotoPost({ title: o.title, text: o.text, credit: o.credit || 'Shared with love from The James NZ', background: o.bg || JNZX.bgFor(), filename: 'TheJamesNZ-' + String(o.title || 'post').toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40) });
  };
  JNZX.sendPicture = async function (file, o) {
    // called straight from a tap so phones (especially iPhone and iPad) allow the share
    var msg = o.text + '\n\n' + o.url;
    if (navigator.share && navigator.canShare && navigator.canShare({ files: [file] })) {
      JNZX.copyText(msg).catch(function () {});
      try { await navigator.share({ files: [file], title: o.title, text: msg }); return 'Shared! The words and link were also copied, in case your app only sends the picture.'; }
      catch (e) { if (e && e.name === 'AbortError') return ''; }
    }
    savePhotoFile(file); JNZX.copyText(msg).catch(function () {});
    return 'Picture saved to your device. Attach it in any app — the words and link are copied too.';
  };
  function ShareSheet(props) {
    var o = props.o, enc = encodeURIComponent, msg = o.text + '\n\n' + o.url;
    var st = useState(''), note = st[0], setNote = st[1], bz = useState(false), busy = bz[0], setBusy = bz[1], pc = useState(null), pic = pc[0], setPic = pc[1];
    var ref = useRef(null);
    useEffect(function () { return function () { if (pic && pic.url) URL.revokeObjectURL(pic.url); }; }, [pic]);
    useEffect(function () { var b = ref.current && ref.current.querySelector('button'); if (b) b.focus(); function k(e) { if (e.key === 'Escape') props.onClose(); } document.addEventListener('keydown', k); return function () { document.removeEventListener('keydown', k); }; }, []);
    var ios = /iP(hone|ad|od)/.test(navigator.userAgent) || navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
    var sms = 'sms:' + (ios ? '&' : '?') + 'body=' + enc(msg);
    var pe = useState(false), picFail = pe[0], setPicFail = pe[1];
    useEffect(function () {
      var live = true;
      Promise.resolve().then(function () { return JNZX.makePicture(o); }).then(function (f) { if (live) setPic({ file: f, url: URL.createObjectURL(f) }); }, function () {
        // background could not load: try the plain default picture
        return JNZX.makePicture(Object.assign({}, o, { bg: jAsset('./photo-share/inspiration.webp') })).then(function (f) { if (live) setPic({ file: f, url: URL.createObjectURL(f) }); }, function () { if (live) setPicFail(true); });
      });
      return function () { live = false; };
    }, []);
    function act(fn) { return function () { setBusy(true); setNote(''); Promise.resolve(fn()).then(function (r) { setBusy(false); if (r) setNote(r); }, function (e) { setBusy(false); setNote((e && e.message) || 'Something went wrong — try Copy instead.'); }); }; }
    return typeof import_react_dom !== "undefined" && import_react_dom.createPortal ? import_react_dom.createPortal(h('div', { className: 'jx-ssheet-back', onClick: function (e) { if (e.target === e.currentTarget) props.onClose(); } },
      h('div', { className: 'jx-ssheet', role: 'dialog', 'aria-modal': 'true', 'aria-label': 'Share ' + o.title, ref: ref },
        h('div', { className: 'jx-ssheet-head' }, h('strong', null, 'Share'), h('button', { type: 'button', className: 'jx-ssheet-x', 'aria-label': 'Close', onClick: props.onClose }, '✕')),
        pic ? h('img', { className: 'jx-ssheet-img', src: pic.url, alt: 'Picture of this post with The James NZ footer' }) :
          h('div', { className: 'jx-ssheet-wait' }, picFail ? h('p', { className: 'jx-ssheet-preview' }, o.text.length > 220 ? o.text.slice(0, 220) + '…' : o.text) : h('p', { className: 'jx-ssheet-preview' }, '🖼️ Preparing your picture…')),
        h('button', { type: 'button', className: 'jx-ssheet-main', disabled: busy || (!pic && !picFail), onClick: act(function () {
          if (pic) return JNZX.sendPicture(pic.file, o).then(function (r) { return r; });
          return JNZX.sharePost(o).then(function (r) { if (r === 'shared') props.onClose(); if (r === 'menu') return 'Choose an app below.'; return ''; });
        }) }, pic ? '📤 Share picture, words & link' : (picFail ? '📤 Share words & link' : 'Preparing…')),
        h('div', { className: 'jx-ssheet-grid' },
          navigator.share && h('button', { type: 'button', disabled: busy, onClick: act(function () { return JNZX.sharePost(o).then(function (r) { if (r === 'shared') props.onClose(); return ''; }); }) }, h('span', null, '💬'), 'Words & link only'),
          pic && h('button', { type: 'button', onClick: function () { savePhotoFile(pic.file); setNote('Picture saved. Attach it to any message or post.'); } }, h('span', null, '⬇️'), 'Save picture'),
          h('a', { href: 'https://wa.me/?text=' + enc(msg), target: '_blank', rel: 'noopener noreferrer' }, h('span', null, '🟢'), 'WhatsApp'),
          h('a', { href: 'https://www.facebook.com/sharer/sharer.php?u=' + enc(o.url) + '&quote=' + enc(o.text), target: '_blank', rel: 'noopener noreferrer' }, h('span', null, '📘'), 'Facebook'),
          h('a', { href: 'mailto:?subject=' + enc(o.title + ' · The James NZ') + '&body=' + enc(msg) }, h('span', null, '✉️'), 'Email'),
          h('a', { href: sms }, h('span', null, '📱'), 'Text message'),
          h('button', { type: 'button', onClick: act(function () { return JNZX.copyText(msg).then(function () { return '✅ Copied — paste it anywhere.'; }, function () { return 'Press and hold the text to copy it.'; }); }) }, h('span', null, '📋'), 'Copy words & link')),
        h('p', { className: 'jx-ssheet-tip' }, 'WhatsApp, Facebook, email and text send the words and link. To include the picture there, use “Save picture” and attach it.'),
        note && h('p', { className: 'jx-ssheet-note', role: 'status' }, note))), document.body) : null;
  }
  JNZX.ShareSheet = ShareSheet;
  JNZX.ShareMini = function ShareMini(props) {
    var sh = useState(null), sheet = sh[0], setSheet = sh[1];
    function build(ev) {
      var body = props.text || props.title;
      var line = JNZX.catchyFor ? JNZX.catchyFor(ev && ev.currentTarget, props.title, body) : '';
      if (line && body.indexOf(line) < 0) body += '\n\n' + line;
      return { title: props.title, text: body, url: props.url || JNZX.postLink(props.title, body), bg: props.bg };
    }
    function go(ev) { setSheet(build(ev)); }
    return h('span', { className: 'jx-sharemini' },
      h('button', { type: 'button', className: 'secondary jx-sharemini-btn', onClick: go, 'aria-label': 'Share ' + props.title, 'aria-haspopup': 'dialog' }, h(Icons.share, { size: 15 }), props.label || 'Share'),
      sheet && h(ShareSheet, { o: sheet, onClose: function () { setSheet(null); } }));
  };

  /* ---------- shared building blocks ---------- */
  function PageFrame(props) {
    useEffect(function () { try { window.scrollTo({ top: 0 }); } catch (e) {} }, [props.tab]);
    return h('div', { className: 'jx-page' }, props.children);
  }
  JNZX.Header = function (kicker, title, text) {
    var t = String(title || ''), m = t.match(/^(.*?)(\S+?)([.!?…]*)$/), tt = m && m[1] ? [m[1], h('span', { key: 'a', className: 'mk-accent' }, m[2]), m[3]] : t;
    return h('header', { className: 'jx-head mk-head' }, h('p', { className: 'eyebrow' }, kicker), h('h1', null, tt), text && h('p', { className: 'jx-lead' }, text));
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
      h('div', { className: 'jx-tabpanel', role: 'tabpanel', key: 'panel-' + item.id }, item.render()));
  };
  /* Cached JSON loader for the data/ folder */
  var cache = {};
  /* Data files ship as root-level scripts (data-elements.js, data-dict-a.js …) so they
     load on any static host; the JSON copies in /data are only a fallback. */
  function dataScriptName(path) { return './data-' + path.replace(/^\.\/data\//, '').replace(/\.json$/, '').replace(/\//g, '-') + '.js?v=20261027'; }
  function loadScriptData(path) {
    return new Promise(function (ok, bad) {
      var store = window.JNZDATA = window.JNZDATA || {};
      if (store[path]) return ok(store[path]);
      var s = document.createElement('script');
      s.src = dataScriptName(path); s.async = true;
      s.onload = function () { if (store[path]) ok(store[path]); else bad(Error('empty')); };
      s.onerror = function () { bad(Error('Could not load ' + path)); };
      document.head.appendChild(s);
    });
  }
  JNZX.load = function (path) {
    if (!cache[path]) cache[path] = loadScriptData(path).catch(function () {
      return fetch(path, { cache: 'force-cache' }).then(function (r) { if (!r.ok) throw Error('Could not load ' + path); return r.json(); });
    });
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
  var TOPIC = {
    'Inspiration': ['./photo-share/inspiration.webp', 'Quotes for leadership, faith, parenting, kindness and more.'],
    'Coffee corner': ['./coffee-posts/coffee-02.webp', 'Coffee facts, quotes, brew guides and a few jokes.'],
    'x:personal-improvement': ['./workout-photos/easy-outdoor.webp', 'Focus, movement and water — small daily habits.'],
    'Focus time': ['./mindfulness-scenes/stream.webp', 'Calm focus timers with gentle moving scenes.'],
    'Workouts': ['./workout-photos/med-home.webp', 'Easy to intense workouts at home or outdoors.'],
    'Water tracker': ['./mindfulness-scenes/sky.webp', 'Fill a drop for each glass and keep a water journal.'],
    'Weather & OOTD': ['./family-walk-consistent.webp', 'Today’s weather and what to wear.'],
    'Today’s fruit & vege picks': ['./oct13/produce-sheet.png', 'What’s in season and good value this week.'],
    'NZ bucket lists': ['./family-seaside-consistent.webp', 'A family bucket list and poster for Aotearoa.'],
    'NZ quiz': ['./family-play-consistent.webp', 'Test your Kiwi knowledge with a fun quiz.'],
    'x:seasons': [null, 'When to see the flowers and pick your own fruit, month by month.'],
    'x:citizenship': [null, 'A 20-question practice test: 45 minutes, pass with 15.'],
    'x:hometips': [null, 'Family Life, Made Easier and Family Checklists.'],
    'x:baby': [null, 'Milestones, pregnancy, feeding, potty training and parenting.'],
    'x:potty': [null, 'Readiness check, a calm 3-day plan, tips and a sticker chart.'],
    'x:love': [null, 'Together Time, Love Notes and Our Memory Jar.'],
    'x:world-clock': [null, 'Spin the globe: the time anywhere, next to NZ time.'],
    'NZ safety & know-how': ['./oct15/preparedness.png', 'Be prepared: first aid, sun, road and emergencies.'],
    'Reading nook': ['./story-pages/story-02-middle.webp', 'Original family stories as page-turning flip-books.'],
    'Family tips': ['./family-home-clothes.png', 'Practical tips that make home life easier.'],
    'Homemade recipes': ['./recipe-photos/soup.webp', '325 easy recipes for every meal, diet and cuisine, with nutrition.'],
    'Grocery list': ['./photo-share/savings-groceries.webp', 'A colourful grocery list with a budget.'],
    'Budget tracker': ['./photo-share/savings-money.webp', 'Plan income, bills, spending and savings.'],
    'x:diy': [null, '18 simple home projects with NZ safety notes.'],
    'x:holidays': ['./story-cartoons/story-05.webp', '36 indoor activities for rainy school holidays.'],
    'x:celebrations': ['./october/loaves-0.webp', 'Christmas, Easter, Matariki and important NZ days.'],
    'Languages': ['./oct7-country/about-humans.webp', 'Greetings and phrases from around the world.'],
    'Kids’ learning & activities': ['./story-cartoons/story-03.webp', 'Age-based activities and 53 focus games.'],
    'x:science': [null, 'An interactive periodic table and science basics.'],
    'x:math': [null, 'Scientific and graphing calculators, simulations and trigonometry.'],
    'x:english': [null, 'A 128,000-word dictionary and Kiwi expressions.'],
    'x:exam': [null, 'Writing and speaking practice for IELTS, Cambridge B2 First, C1 Advanced, C2 Proficiency and NZCEL, with instant feedback.'],
    'x:leadership': [null, 'A free course with a 30-question assessment and certificate.'],
    'Speaking practice': ['./mateo-smile-clean.webp', 'Tips, practice tools and quizzes for speaking with confidence.'],
    'x:speaking-time': [null, 'How long will your speech take? Find out and practise.'],
    'x:nzsl': [null, 'Start learning New Zealand Sign Language.'],
    'Today’s prayer': ['./photo-share/prayer.webp', 'Prayers for daily life, worries and the people you love.'],
    'Communal prayers': ['./faith/guardian-angels.webp', 'Everyday prayers to pray together.'],
    'How to pray the rosary': ['./rosary-natural.webp', 'Pray the rosary at your own pace.'],
    'Bible & Gospel': ['./october/creation-0.webp', 'Read Scripture and today’s Gospel.'],
    'Saints day': ['./faith/therese.webp', 'A saint for every day of the year.'],
    'Catholic songs & guitar': [null, 'Original devotional songs with guitar chords.'],
    'Lives that inspire': ['./faith/francis.webp', 'True stories of faith and courage.'],
    'Catholic churches': ['./faith/auckland.webp', 'Find a Catholic church near you in New Zealand.'],
    'Bible stories for kids': ['./october/noah-1.webp', '50 Bible story flip-books for little hearts.'],
    'x:saints': ['./faith/saint-denis.webp', '117 saints and martyrs with their stories.'],
    'x:faith-formation': ['./october/children-0.webp', 'Faith formation topics, worksheets and lessons.'],
    'x:bible-dictionary': ['./october/samaritan-0.webp', '4,860 people, places and words of the Bible.'],
    'x:design': [null, 'Design invitations and posters, then share them.'],
    'x:shortcuts': [null, '184 Office and Windows keyboard shortcuts.'],
    'Saving tips': ['./photo-share/savings-home.webp', 'Small ways to save money at home.'],
    'Family checklists': ['./family-smart-casual.png', 'Ready-made checklists for family life.'],
    'Pregnancy & baby age': ['./expansion/care-photos-0.webp', 'Track pregnancy weeks and baby’s age.'],
    'Pregnancy quotes & tips': ['./expansion/care-photos-1.webp', 'Gentle words and tips for pregnancy.'],
    'Parenting quotes & tips': ['./expansion/care-photos-2.webp', 'Encouragement and tips for parents.'],
    'Breastfeeding quotes & tips': ['./expansion/care-photos-3.webp', 'Support and tips for feeding with love.'],
    'Partnership quotes & tips': ['./expansion/life-photos-0.webp', 'Ideas for time together as a couple.'],
    'Husband & wife quotes & tips': ['./expansion/life-photos-1.webp', 'Little notes and kindnesses for each other.'],
    'Parent–child & child–parent': ['./expansion/life-photos-2.webp', 'Memories and words between parents and children.'],
    'About us': ['./oct13/about-storybook-texture.png', 'Meet the family behind The James NZ.'],
    'Small business': ['./oct9/about-family-cover.png', 'Discover local makers and small businesses.'],
    'How to use this website': ['./mateo-poses.webp', 'A quick guide to finding your way around.'],
    'FAQ': [null, 'Answers to common questions.'],
    'Home & garden': ['./mindfulness-scenes/garden.webp', 'Seasonal tips for home and garden.'],
    'x:sustainable': [null, 'Recycling rules, eco tips and a family challenge.'],
    'x:public-holidays': [null, 'NZ public holidays for any year.'],
    'x:jobs': [null, 'Trusted NZ job sites and career help.']
  };
  var TILE = ['#e8f3ee', '#fdeee4', '#e8f0fb', '#f3ecfb', '#fff6d9', '#fde9ee', '#e6f6f6'];
  function GroupLanding(props) {
    var title = props.tab.slice(6);
    var g = GROUPS.find(function (x) { return x.title === title; });
    var q = useState(''), qq = q[0], setQ = q[1];
    useEffect(function () { try { window.scrollTo({ top: 0 }); } catch (e) {} }, [title]);
    if (!g) return h('p', null, 'This section has moved. Choose a topic from the menu.');
    var items = g.items.filter(function (it) { return it.name.indexOf('group:') !== 0 && !it.hidden; });
    var sections = [];
    items.forEach(function (it) {
      if (it.menuHeading || !sections.length) sections.push({ heading: it.menuHeading || 'Explore', items: [] });
      sections[sections.length - 1].items.push(it);
    });
    var first = items[0];
    function card(it, k) {
      var info = TOPIC[it.name] || [null, ''], Ico = it.icon || Icons.grid, img = info[0];
      var drawn = JNZX.cover && JNZX.cover(it.name), witty = JNZX.coverLine ? JNZX.coverLine(it.name) : '';
      var src = drawn || (img ? jAsset(img) : null);
      return h('button', { key: it.name, type: 'button', className: 'jx-shop-card', onClick: function () { props.navigate(it.name); } },
        h('span', { className: 'jx-shop-img' + (drawn ? ' is-drawn' : ''), style: src ? null : { background: TILE[k % TILE.length] } }, src ? h('img', { src: src, alt: '', loading: 'lazy' }) : h(Ico, { size: 44 })),
        h('span', { className: 'jx-shop-body' }, h('strong', null, it.displayName || it.name), info[1] && h('span', { className: 'jx-shop-desc' }, info[1]), witty && h('em', { className: 'jx-shop-witty' }, '“' + witty + '”'), h('span', { className: 'jx-shop-go' }, 'Open →')));
    }
    var found = qq.trim() ? items.filter(function (it) { return ((it.displayName || it.name) + ' ' + ((TOPIC[it.name] || [])[1] || '')).toLowerCase().indexOf(qq.toLowerCase()) >= 0; }) : null;
    var k = 0;
    var words = title.split(' '), accent = words.pop(), lead = words.join(' ');
    var GEMO = { 'Everyday Joy': '☕', 'Kiwi Adventures': '🥝', 'Family Together': '🏡', 'Learning': '📚', 'Faith & Hope': '🙏', 'Modern & Lifestyle': '💡', 'Community': '🤝' };
    function mcard(it, kk) {
      var info = TOPIC[it.name] || [null, ''], Ico = it.icon || Icons.grid, img = info[0];
      var drawn = JNZX.cover && JNZX.cover(it.name), emo = (JNZX.coverEmoji && JNZX.coverEmoji(it.name)) || GEMO[title] || '✨';
      var src = drawn || (img ? jAsset(img) : null);
      return h('button', { key: it.name, type: 'button', className: 'mk-card', onClick: function () { props.navigate(it.name); } },
        h('span', { className: 'mk-card-media', style: src ? null : { background: TILE[kk % TILE.length] } }, src ? h('img', { src: src, alt: '', loading: 'lazy' }) : h(Ico, { size: 44 }), h('span', { className: 'mk-card-shade' }), h('span', { className: 'mk-card-badge', 'aria-hidden': true }, emo)),
        h('span', { className: 'mk-card-body' }, h('strong', { className: 'mk-card-title' }, it.displayName || it.name), info[1] && h('span', { className: 'mk-card-desc' }, info[1]), h('span', { className: 'mk-card-go' }, 'Explore ', h('span', { 'aria-hidden': true }, '→'))));
    }
    return h('div', { className: 'jx-page jx-landing mk-landing' },
      h('header', { className: 'mk-hero' },
        h('nav', { className: 'mk-crumb', 'aria-label': 'Breadcrumb' }, h('button', { type: 'button', onClick: function () { props.navigate('Home'); } }, 'Home'), h('span', { 'aria-hidden': true }, '›'), h('span', null, title)),
        h('h1', { className: 'mk-hero-title' }, lead ? lead + ' ' : '', h('span', { className: 'mk-accent' }, accent)),
        h('p', { className: 'mk-hero-text' }, g.blurb),
        h('div', { className: 'mk-hero-actions' },
          first && h('button', { type: 'button', className: 'mk-btn', onClick: function () { props.navigate(first.name); } }, 'Start with ' + (first.displayName || first.name) + ' →'),
          h('span', { className: 'mk-hero-count' }, items.length + ' topics'))),
      h('div', { className: 'mk-tools' },
        h('nav', { className: 'mk-pills', 'aria-label': title + ' sections' }, sections.map(function (sec, si) { return h('button', { key: si, type: 'button', onClick: function () { setQ(''); setTimeout(function () { var el = document.getElementById('jx-shop-' + si); if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 30); } }, sec.heading); })),
        h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Search ' + items.length + ' topics in ' + title })),
      found ? h('section', { className: 'mk-sec' }, h('span', { className: 'mk-label' }, 'SEARCH RESULTS'), h('h2', { className: 'mk-h2' }, found.length + ' topic' + (found.length === 1 ? '' : 's') + ' found'), h('div', { className: 'mk-grid' }, found.map(function (it, i) { return mcard(it, i); })))
        : sections.map(function (sec, si) {
          return h('section', { key: si, id: 'jx-shop-' + si, className: 'mk-sec' },
            h('span', { className: 'mk-label' }, si === 0 ? 'WHAT WE OFFER' : title.toUpperCase()),
            h('h2', { className: 'mk-h2' }, sec.heading === 'Explore' ? 'All of ' + title : sec.heading),
            h('div', { className: 'mk-grid' }, sec.items.map(function (it) { return mcard(it, k++); })));
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

/* Dark mode: turn any remaining dark teal, green or navy panels into neutral black/grey. */
(function () {
  'use strict';
  var root = document.documentElement, timer = null;
  function isDark() { return root.getAttribute('data-reading-theme') === 'dark'; }
  function grey(r, g, b, a) {
    var R = r / 255, G = g / 255, B = b / 255, mx = Math.max(R, G, B), mn = Math.min(R, G, B), l = (mx + mn) / 2, d = mx - mn;
    if (d < 0.04 || l > 0.36) return null;
    var s = d / (1 - Math.abs(2 * l - 1)), hue;
    if (mx === R) hue = 60 * (((G - B) / d) % 6); else if (mx === G) hue = 60 * ((B - R) / d + 2); else hue = 60 * ((R - G) / d + 4);
    if (hue < 0) hue += 360;
    if (s < 0.12 || hue < 130 || hue > 255) return null;
    var v = Math.round(l * 255 * 0.7);
    return a < 1 ? 'rgba(' + v + ',' + v + ',' + v + ',' + a + ')' : 'rgb(' + v + ',' + v + ',' + v + ')';
  }
  function conv(str) {
    var changed = false;
    var out = str.replace(/rgba?\(([^)]+)\)/g, function (m, inner) { var p = inner.split(',').map(parseFloat), a = p.length > 3 ? p[3] : 1; if (a === 0) return m; var gg = grey(p[0], p[1], p[2], a); if (gg) { changed = true; return gg; } return m; });
    return changed ? out : null;
  }
  function scan() {
    timer = null;
    if (!isDark()) { document.querySelectorAll('[data-jx-dk]').forEach(function (el) { el.style.removeProperty('background-color'); el.style.removeProperty('background-image'); el.removeAttribute('data-jx-dk'); }); return; }
    var els = document.querySelectorAll('#root *:not(svg *):not(canvas):not(img):not(.jx-keep-colour):not(.jx-keep-colour *)');
    for (var i = 0; i < els.length; i++) {
      var el = els[i]; if (el.hasAttribute('data-jx-dk')) continue;
      var cs = getComputedStyle(el), bg = conv(cs.backgroundColor), bi = cs.backgroundImage;
      var gi = bi && bi !== 'none' && bi.indexOf('url(') < 0 ? conv(bi) : null;
      if (bg) el.style.setProperty('background-color', bg, 'important');
      if (gi) el.style.setProperty('background-image', gi, 'important');
      if (bg || gi) el.setAttribute('data-jx-dk', '');
    }
  }
  function soon() { if (!timer) timer = setTimeout(scan, 250); }
  function start() {
    new MutationObserver(soon).observe(document.getElementById('root') || document.body, { childList: true, subtree: true });
    new MutationObserver(function () { document.querySelectorAll('[data-jx-dk]').forEach(function (el) { el.style.removeProperty('background-color'); el.style.removeProperty('background-image'); el.removeAttribute('data-jx-dk'); }); soon(); }).observe(root, { attributes: true, attributeFilter: ['data-reading-theme'] });
    soon();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
