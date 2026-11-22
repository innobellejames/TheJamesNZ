/* The James NZ — support page, privacy & terms, monthly
   email sign-up, "Add to home screen" and AdSense helpers (November 2026).
   Settings live in jnz-config.js. */
(function () {
  'use strict';
  var JNZX = window.JNZX; if (!JNZX || !JNZX.register) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef;
  var C = window.JNZ_CONFIG || {};
  function cfg(k, d) { return C[k] != null ? C[k] : d; }
  function go(props, tab) { if (props && props.navigate) props.navigate(tab); else location.hash = 'section=' + encodeURIComponent(tab); try { window.scrollTo(0, 0); } catch (e) {} }

  /* The printables shop was removed (November 2026). Old links to it open Home. */
  try { localStorage.removeItem('jnzx-basket'); sessionStorage.removeItem('jnzx-ribbon-x'); } catch (e) {}

  /* ---------------- Add to home screen ---------------- */
  var deferred = null, listeners = [];
  window.addEventListener('beforeinstallprompt', function (e) { e.preventDefault(); deferred = e; listeners.forEach(function (f) { f(); }); });
  window.addEventListener('appinstalled', function () { deferred = null; try { localStorage.setItem('jnzx-installed', '1'); } catch (e) {} listeners.forEach(function (f) { f(); }); });
  if ('serviceWorker' in navigator && location.protocol === 'https:') { window.addEventListener('load', function () { navigator.serviceWorker.register('./sw.js').catch(function () {}); }); }
  function standalone() { try { return window.matchMedia('(display-mode: standalone)').matches || navigator.standalone === true; } catch (e) { return false; } }
  function isIOS() { return /iP(hone|ad|od)/.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1); }
  function InstallButton(props) {
    var st = useState(0), bump = st[1], hs = useState(false), help = hs[0], setHelp = hs[1];
    useEffect(function () { var f = function () { bump(function (n) { return n + 1; }); }; listeners.push(f); return function () { listeners = listeners.filter(function (x) { return x !== f; }); }; }, []);
    if (standalone()) return props.quiet ? null : h('p', { className: 'small-note' }, '✅ The James NZ is on your home screen. Thank you!');
    function click() {
      if (deferred) { var d = deferred; d.prompt(); d.userChoice.then(function () { deferred = null; bump(function (n) { return n + 1; }); }); return; }
      setHelp(!help);
    }
    var ios = isIOS();
    return h('div', { className: 'jx-install' },
      h('button', { type: 'button', className: props.primary ? 'primary' : 'secondary', onClick: click }, '📲 Add to home screen'),
      help && h('div', { className: 'jx-install-help', role: 'note' },
        ios ? h('ol', null, h('li', null, 'Tap the ', h('b', null, 'Share'), ' button (the square with an arrow ⬆️) in Safari.'), h('li', null, 'Scroll down and tap ', h('b', null, 'Add to Home Screen'), '.'), h('li', null, 'Tap ', h('b', null, 'Add'), '. The James NZ now opens like an app!'))
          : h('ol', null, h('li', null, 'Open your browser menu (⋮ or ⋯).'), h('li', null, 'Tap ', h('b', null, 'Add to Home screen'), ' or ', h('b', null, 'Install app'), '.'), h('li', null, 'Confirm — The James NZ now opens like an app!'))));
  }
  JNZX.InstallButton = InstallButton;

  /* ---------------- Monthly email sign-up ---------------- */
  function Newsletter(props) {
    var action = cfg('newsletterAction', ''), field = cfg('newsletterEmailField', 'email');
    var e = useState(''), email = e[0], setEmail = e[1], c = useState(false), ok = c[0], setOk = c[1], s = useState(false), sent = s[0], setSent = s[1];
    if (!action) return null;
    return h('section', { className: 'jx-news jx-keep-colour' + (props.compact ? ' is-compact' : '') },
      h('div', { className: 'jx-news-txt' }, h('span', { className: 'jx-news-e', 'aria-hidden': true }, '💌'), h('div', null, h('h3', null, 'Get our monthly family ideas'), h('p', null, 'One friendly email a month: new activities, seasonal faith ideas, jokes and more. No spam, ever.'))),
      sent ? h('p', { className: 'jx-news-thanks', role: 'status' }, '🎉 Thank you! Please check your inbox and confirm your email.') :
      h('form', { action: action, method: 'post', target: '_blank', onSubmit: function (ev) { if (!ok) { ev.preventDefault(); return; } setTimeout(function () { setSent(true); }, 300); } },
        h('label', { className: 'jx-news-row' }, h('span', { className: 'sr-only' }, 'Email address'), h('input', { type: 'email', name: field, required: true, value: email, placeholder: 'you@example.com', autoComplete: 'email', onChange: function (ev) { setEmail(ev.target.value); } }),
          h('button', { type: 'submit', className: 'primary', disabled: !ok }, 'Sign me up')),
        h('label', { className: 'jx-news-ok' }, h('input', { type: 'checkbox', checked: ok, onChange: function (ev) { setOk(ev.target.checked); } }), h('span', null, 'Yes, send me The James NZ monthly email. I can unsubscribe at any time using the link in every email. ', h('a', { href: '#section=x%3Aprivacy' }, 'Privacy'))),
        h('input', { type: 'hidden', name: 'embed', value: '1' })));
  }
  JNZX.Newsletter = Newsletter;

  /* ---------------- AdSense ad space (optional slot) ---------------- */
  function AdSlot() {
    var slot = cfg('adSlot', ''), client = cfg('adClient', ''), ref = useRef(null);
    useEffect(function () { if (!slot || !client || !ref.current) return; try { (window.adsbygoogle = window.adsbygoogle || []).push({}); } catch (e) {} }, [slot]);
    if (!slot || !client) return null;
    return h('aside', { className: 'jx-ad', 'aria-label': 'Advertisement' }, h('small', null, 'Advertisement'), h('ins', { ref: ref, className: 'adsbygoogle', style: { display: 'block' }, 'data-ad-client': client, 'data-ad-slot': slot, 'data-ad-format': 'auto', 'data-full-width-responsive': 'true' }));
  }
  JNZX.AdSlot = AdSlot;

  /* ---------------- Support strip shown at the end of pages ---------------- */
  function Connect(props) {
    return h('div', { className: 'jx-connect' },
      h(Newsletter, { compact: true }),
      h('div', { className: 'jx-connect-row' },
        h('button', { type: 'button', className: 'jx-support-btn', onClick: function () { go(props, 'x:support'); } }, '💛 Support The James NZ'),
        h(InstallButton, { quiet: true })),
      h(AdSlot));
  }
  var basePageEnd = JNZX.pageEnd;
  var OWN = { 'x:support': 1, 'x:privacy': 1 };
  JNZX.pageEnd = function (tab, navigate) {
    var a = basePageEnd ? basePageEnd(tab, navigate) : null;
    if (OWN[tab]) return a;
    return h(R.Fragment, { key: 'jx-end2-' + tab }, a, h('div', { className: 'jx-page' }, h(Connect, { navigate: navigate })));
  };

  /* Old printables links (#section=x:shop) go to Home */
  function OldShop(props) { useEffect(function () { go(props, 'Home'); }, []); return null; }
  JNZX.register('x:shop', OldShop);

  /* ---------------- Support ---------------- */
  function SupportPage(props) {
    var url = cfg('supportUrl', '');
    return h('div', { className: 'jx-page jx-support' },
      JNZX.Header('COMMUNITY · SUPPORT US', 'Support The James NZ.', 'The James NZ is a free family website made with love in Aotearoa. If it has helped or made you smile, here are some easy ways to keep it going.'),
      h('div', { className: 'jx-sup-grid' },
        url && h('div', { className: 'jx-sup-card is-main' }, h('div', { className: 'jx-sup-e' }, '☕'), h('h3', null, 'Buy us a coffee'), h('p', null, 'A small one-off gift helps pay for hosting and new content. Every coffee is truly appreciated!'), h('a', { className: 'jx-buy', href: url, target: '_blank', rel: 'noopener' }, '💛 Support with a coffee')),
        h('div', { className: 'jx-sup-card' }, h('div', { className: 'jx-sup-e' }, '📣'), h('h3', null, 'Share with a friend'), h('p', null, 'Tell a friend, your parish group or school community about the website. It costs nothing and helps a lot.'), h(JNZX.ShareMini, { label: 'Share The James NZ', title: 'The James NZ', text: 'A free family website from Aotearoa — jokes, prayers, Kiwi adventures, holiday ideas and more. www.thejamesnz.com' })),
        h('div', { className: 'jx-sup-card' }, h('div', { className: 'jx-sup-e' }, '📲'), h('h3', null, 'Keep us close'), h('p', null, 'Add The James NZ to your phone’s home screen so it opens like an app.'), h(InstallButton, { primary: true }))),
      h(Newsletter, {}),
      h('p', { className: 'small-note' }, 'The James NZ is a family-run website, not a registered charity, so gifts are not tax-deductible. Thank you for your kindness. 🙏'),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:support', SupportPage);

  /* ---------------- Privacy & Terms ---------------- */
  function PrivacyPage(props) {
    var mail = cfg('contactEmail', '');
    var contact = mail ? h('a', { href: 'mailto:' + mail }, mail) : 'the contact details on our About Us page';
    function S(t) { return h('h2', null, t); }
    return h('div', { className: 'jx-page jx-legal' },
      JNZX.Header('COMMUNITY · GOOD TO KNOW', 'Privacy & Terms.', 'How The James NZ looks after your information, and the terms for using our website. Last updated November 2026.'),
      h('section', { className: 'jx-card' },
        S('Who we are'),
        h('p', null, 'The James NZ (www.thejamesnz.com) is a family-run website based in Aotearoa New Zealand. For any privacy question or request, contact us using ', contact, '.'),
        S('What we collect, and why'),
        h('ul', null,
          h('li', null, h('b', null, 'Things you save on the website'), ' — your lists, budgets, plans, quiz results and settings are saved only in your own browser on your device. We can’t see them. Clearing your browser data deletes them.'),
          h('li', null, h('b', null, 'Ask Mateo'), ' — Mateo works on your device. What you type is not sent to us.'),
          h('li', null, h('b', null, 'Monthly email'), ' — if you sign up, we collect your email address only to send our monthly family ideas email. It is held by our email service provider. We never sell or share it. Every email has an unsubscribe link.'),
          h('li', null, h('b', null, 'Gifts and coffees'), ' — handled by the support platform you choose; they share your name and any message with us.'),
          h('li', null, h('b', null, 'Our hosting provider'), ' may record basic technical information (such as IP address and browser type) to keep the site running and secure.')),
        S('Analytics, advertising and cookies'),
        h('p', null, 'We use Google Analytics to understand how many people visit and which pages they use, so we can improve the site. It uses cookies and collects information such as your approximate location, device and the pages you view; it does not tell us who you are. You can opt out with the ', h('a', { href: 'https://tools.google.com/dlpage/gaoptout', target: '_blank', rel: 'noopener' }, 'Google Analytics opt-out add-on'), '.'),
        h('p', null, 'We use Google AdSense to show ads, which helps keep The James NZ free. Google and its partners use cookies to show ads based on your visits to this and other websites. You can turn off personalised ads at ', h('a', { href: 'https://adssettings.google.com', target: '_blank', rel: 'noopener' }, 'Google Ad Settings'), ', and read how Google uses information at ', h('a', { href: 'https://policies.google.com/technologies/partner-sites', target: '_blank', rel: 'noopener' }, 'policies.google.com'), '.'),
        S('Your rights'),
        h('p', null, 'Under the Privacy Act 2020 you can ask to see the personal information we hold about you and ask us to correct it. Contact us using ', contact, '. If you’re not happy with our response, you can contact the Office of the Privacy Commissioner at privacy.org.nz.'),
        S('Children'),
        h('p', null, 'Much of our website is made for families to enjoy together. We don’t knowingly collect personal information from children — email sign-ups are for adults.')),
      h('section', { className: 'jx-card' },
        S('Using this website'),
        h('ul', null,
          h('li', null, 'All words, activities, prayers, jokes and pictures on The James NZ are original and © The James NZ unless stated. You’re welcome to share links and use the share buttons.'),
          h('li', null, 'Our information is general and for families. It is not professional medical, legal or financial advice — check with a qualified person for your situation.'),
          h('li', null, 'Links to other websites are provided for convenience; we are not responsible for their content.'),
          h('li', null, 'Gifts and coffees are voluntary and non-refundable except where the law requires. The James NZ is not a registered charity, so gifts are not tax-deductible.'))),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:privacy', PrivacyPage);

  /* ---------------- styles ---------------- */
  var css = '.sr-only{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}' +
    '.jx-connect{display:grid;gap:14px;margin:18px 0 6px}.jx-connect-row{display:flex;flex-wrap:wrap;gap:10px;align-items:flex-start;justify-content:center}' +
    '.jx-support-btn,.jx-hdr-support{background:#d5b16d!important;color:#14243a!important;border:0!important;border-radius:999px!important;font-weight:800!important;padding:10px 18px!important;cursor:pointer}' +
    '.jx-hdr-support{padding:7px 14px!important}' +
    '.jx-install{display:grid;gap:8px;justify-items:center}.jx-install-help{background:#f3f7f6;border-radius:14px;padding:10px 14px;max-width:420px;text-align:left}.jx-install-help ol{margin:0;padding-left:20px;line-height:1.6}' +
    '.jx-news{background:linear-gradient(135deg,#14243a,#1e3355);color:#fff;border-radius:22px;padding:22px 24px;display:grid;gap:14px;margin:22px 0}' +
    '.jx-news-txt{display:flex;gap:14px;align-items:flex-start}.jx-news-e{font-size:38px;line-height:1}.jx-news h3{margin:0 0 4px;color:#fff!important;font-family:"Playfair Display",Georgia,serif;font-size:1.4rem}.jx-news p{margin:0;color:rgba(255,255,255,.82)!important}' +
    '.jx-news form{display:grid;gap:10px}.jx-news-row{display:flex;gap:8px;flex-wrap:wrap}.jx-news-row input{flex:1 1 220px;min-width:0;font-size:16px;border-radius:12px;border:0;padding:12px 14px}' +
    '.jx-news-row button{background:#d5b16d!important;color:#14243a!important;border:0!important;font-weight:800;border-radius:12px!important;padding:12px 18px!important}.jx-news-row button:disabled{opacity:.55}' +
    '.jx-news-ok{display:flex;gap:8px;align-items:flex-start;font-size:.88rem;color:rgba(255,255,255,.85)}.jx-news-ok input{margin-top:3px;width:18px;height:18px}.jx-news a{color:#d5b16d}.jx-news-thanks{font-weight:700}' +
    '.jx-ad{margin:18px 0;text-align:center}.jx-ad small{display:block;color:#8a9a96;font-size:.72rem;letter-spacing:.08em;text-transform:uppercase;margin-bottom:4px}' +
    '.jx-buy{display:inline-block;background:#168c89;color:#fff!important;text-decoration:none;font-weight:800;border-radius:999px;padding:12px 22px}.jx-soon{display:inline-block;background:#eef1f0;color:#5a6b66;border-radius:999px;padding:10px 18px;font-weight:700}' +
    '.jx-terms p{line-height:1.6}.jx-legal .jx-card{margin-bottom:18px}.jx-legal h2{font-size:1.3rem;margin:18px 0 6px}.jx-legal h2:first-child{margin-top:0}.jx-legal li{margin-bottom:8px;line-height:1.55}' +
    '.jx-sup-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,250px),1fr));gap:18px;margin:6px 0 10px}' +
    '.jx-sup-card{background:#fff;border-radius:20px;padding:20px;box-shadow:0 4px 12px rgba(20,36,58,.08);display:flex;flex-direction:column;gap:8px;align-items:flex-start}.jx-sup-card.is-main{background:#fff8e8}.jx-sup-card p{margin:0;color:#3b4a46;flex:1}.jx-sup-card h3{margin:0;font-family:"Playfair Display",Georgia,serif}.jx-sup-e{font-size:36px}' +
    '.jx-a2hs{position:fixed;left:12px;right:12px;bottom:12px;z-index:60;background:#14243a;color:#fff;border-radius:18px;padding:12px 14px;display:flex;gap:10px;align-items:center;box-shadow:0 10px 30px rgba(0,0,0,.3)}.jx-a2hs p{margin:0;flex:1;font-size:.92rem}.jx-a2hs .jx-install{justify-items:end}.jx-a2hs .jx-install-help{color:#1f2a2a}.jx-a2hs-x{background:none!important;border:0!important;color:#fff!important;font-size:20px;padding:4px 8px!important}' +
    'html[data-reading-theme="dark"] .jx-sup-card{background:#18211f}html[data-reading-theme="dark"] .jx-sup-card.is-main{background:#2a2617}' +
    'html[data-reading-theme="dark"] .jx-sup-card h3{color:#f1f4f3}html[data-reading-theme="dark"] .jx-sup-card p{color:#d7e2de}' +
    'html[data-reading-theme="dark"] .jx-install-help{background:#1b2524;color:#e6efec}html[data-reading-theme="dark"] .jx-soon{background:#26322f;color:#d7e2de}' +
    'html[data-reading-theme="dark"] .jx-note{color:#f6f6f6}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  /* ---------------- gentle "add to home screen" banner on phones (once) ---------------- */
  function A2HSBanner() {
    var s = useState(false), show = s[0], setShow = s[1];
    useEffect(function () {
      var seen = 0; try { seen = +(localStorage.getItem('jnzx-a2hs-seen') || 0); } catch (e) {}
      var visits = 0; try { visits = +(localStorage.getItem('jnzx-visits') || 0) + 1; localStorage.setItem('jnzx-visits', String(visits)); } catch (e) {}
      if (seen || standalone() || visits < 2 || !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent)) return;
      var t = setTimeout(function () { setShow(true); }, 25000); return function () { clearTimeout(t); };
    }, []);
    if (!show) return null;
    function close() { setShow(false); try { localStorage.setItem('jnzx-a2hs-seen', '1'); } catch (e) {} }
    return h('div', { className: 'jx-a2hs', role: 'dialog', 'aria-label': 'Add The James NZ to your home screen' }, h('span', { style: { fontSize: 26 } }, '☀️'), h('p', null, 'Keep The James NZ one tap away.'), h(InstallButton, { primary: true }), h('button', { type: 'button', className: 'jx-a2hs-x', 'aria-label': 'Close', onClick: close }, '✕'));
  }
  try { var host = document.createElement('div'); document.body.appendChild(host); import_client.createRoot(host).render(h(A2HSBanner)); } catch (e) {}
})();
