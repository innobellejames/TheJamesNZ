/* The James NZ — catchy lines for every item in Family Together (October 2026).
   Each card, jar draw, recipe, tip, project and activity gets a short, original,
   cheerful line that matches what it's about. Lines are chosen from the item's
   own words, so "Make a dessert to share" gets a dessert line and "A song we sang"
   gets a singing line. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var THEMES = [
    [/dessert|cake|cupcake|pudding|pavlova|sweet|treat|biscuit|cookie|slice|muffin|scone|pikelet|pancake|ice cream|chocolate/i, ['Desserts make everything better.', 'Life is short — eat the pudding first.', 'Sharing is caring, especially when it’s cake.', 'A little sugar, a lot of love.', 'Dessert first is a family rule worth keeping.']],
    [/song|sing|sang|music|playlist|guitar|instrument|band|dance|dance|dancing|danced/i, ['The only thing better than singing is more singing.', 'Turn it up and dance like nobody’s watching.', 'Every family needs a theme song.', 'Off-key and full of love — that’s the best kind of music.', 'When words run out, hum a tune.']],
    [/laugh|laughs|laughed|laughing|laughter|joke|funny|silly|giggle|smile/i, ['Laugh until your tummy hurts.', 'Laughter turns a house into a home.', 'Giggles are free and they never run out.', 'Be silly — it’s good for the soul.']],
    [/walk|stroll|hike|tramp|bush|track|beach|sea|coast|park|outdoor|outside|nature|sunset|sunrise|stars|sky|picnic/i, ['Every step is better side by side.', 'Fresh air: nature’s own reset button.', 'The best views come after a little walk.', 'Picnic blankets hold the best stories.', 'Sand in your shoes means a good day out.']],
    [/garden|plant|seed|herb|grow|flower|vege|compost|weed/i, ['Grow where you’re planted.', 'A garden is proof that patience pays.', 'Dirty hands, happy heart.', 'Plant seeds of kindness and watch them bloom.']],
    [/cook|dinner|lunch|breakfast|meal|recipe|soup|bake|kitchen|eat|food|curry|stew|pasta|rice|salad|roast|bread|egg|chicken|fish|lentil|noodle|vegetable|fruit/i, ['Good food, good mood.', 'The secret ingredient is always love.', 'Families that cook together, stick together.', 'Made with love (and a little butter).', 'Home is where the good smells are.', 'Eat well, laugh often, share always.']],
    [/movie|film|cinema|popcorn|watch/i, ['Popcorn tastes better on the couch together.', 'Lights down, phones off, cuddles on.', 'Every family movie night is a blockbuster.']],
    [/read|book|story|stories|library|letter|word|poem|journal|write|note|card/i, ['Once upon a time is the best time.', 'A book is a dream you can hold.', 'Little notes, big feelings.', 'Write it down — memories fade, ink stays.', 'Words are tiny hugs on paper.']],
    [/game|board|puzzle|cards|quiz|treasure|hunt|lego|block|challenge|bowling|charades/i, ['Win or lose, we laugh together.', 'Family game night: where legends are made.', 'Playing together is the best kind of learning.', 'It’s not about winning — it’s about the snacks.']],
    [/photo|picture|camera|album|frame|scrapbook/i, ['Take the picture. Frame the memory.', 'Snap the smile, keep the moment.', 'Say cheese — and mean it!', 'Every photo tells a love story.']],
    [/memory|remember|first|tradition|childhood|grandparent|grandma|grandad|nana|koro|kuia|whānau|ancestor|ancestors|history/i, ['Memories are the treasures we keep in our hearts.', 'Today’s moments are tomorrow’s stories.', 'Traditions are love passed down.', 'Hold on to the moments that make you smile.']],
    [/coffee|tea\b|cuppa|hot chocolate|drink/i, ['Life happens over a good cuppa.', 'A warm drink and a warm heart.', 'Pour a cup, share a story.']],
    [/hug|cuddle|kiss|love|heart|appreciate|appreciated|appreciation|thank|grateful|gratitude|compliment|kind|praise|encourage|encouraging|encouragement/i, ['Love grows best in little moments.', 'A hug is the shortest way to say “I care”.', 'Gratitude makes an ordinary day feel golden.', 'Kind words are free — spend them generously.', 'Small acts, big love.']],
    [/listen|talk|conversation|chat|question|ask|share|feel|emotion|sorry|apolog|forgive|repair|argue|argument|arguments|conflict/i, ['Listen with your heart, not just your ears.', 'Sorry is a small word with a big hug inside.', 'The best conversations start with “Tell me more”.', 'Talk it out, hug it out.']],
    [/date|couple|partner|husband|wife|marriage|together|romance|candle/i, ['Date night can be a cuppa on the couch.', 'Love is a team sport.', 'Still choosing you, every single day.', 'Two hearts, one adventure.']],
    [/surprise|gift|present|party|celebrate|celebration|celebrations|birthday|anniversary|special/i, ['Little surprises make big smiles.', 'Every day is worth celebrating.', 'The best gifts can’t be wrapped.']],
    [/money|budget|save|saving|spend|cost|cheap|price|bill|dollar|income|bank|debt/i, ['Look after the cents and the dollars will follow.', 'A budget is telling your money where to go.', 'Small savings, big smiles.', 'Spend less, live more.']],
    [/shop|shopping|grocer|grocery|groceries|supermarket|market|trolley/i, ['Shop the list, not the aisle.', 'Never shop hungry.', 'A good list is half the shopping.']],
    [/recycle|recycling|recycled|reuse|upcycle|upcycling|junk|cardboard|box|bottle cap|rubbish|waste|bin/i, ['Someone’s trash is someone’s treasure.', 'Reduce, reuse, re-smile.', 'Give it a second life.', 'The greenest thing is the thing you already have.']],
    [/declutter|tidy|clean|wash|laundry|dishes|chore|organise|organising|organiser|storage|vacuum/i, ['A tidy home is a happy home — mostly.', 'Many hands make light work.', 'Less stuff, more space for fun.', 'Clean up, cheer up.']],
    [/dog|puppy|cat|kitten|pet|animal/i, ['Home is where the dog hair is.', 'Pets: the furry heart of the family.', 'Paws, wags and unconditional love.']],
    [/baby|newborn|infant|pēpi|nappy|bottle|formula|sterilise|sterilising|cot|bassinet|swaddle|swaddling|burp/i, ['Tiny feet, huge love.', 'Small hands, big heart, endless cuddles.', 'Sleep is for the weak — and the baby, hopefully.', 'Little one, big adventure.']],
    [/breast|feed|feeding|express|pump|milk|latch|wean/i, ['Every feed is a cuddle with benefits.', 'Fed with love, every single time.', 'Patience, practice and plenty of water.']],
    [/sleep|bed\b|bedtime|nap\b|naps|night|rest\b|rested/i, ['Sweet dreams are made of cosy routines.', 'Early to bed, happy instead.', 'Rest is part of the plan.']],
    [/pregnant|pregnancy|bump|midwife|maternity|antenatal|due date|trimester|birth|labour/i, ['Growing a whole human — no big deal.', 'Little kicks, big love.', 'Nine months of dreaming.', 'One day at a time, one kick at a time.']],
    [/potty|toilet/i, ['Big kid pants, big kid dreams.', 'Every accident is a step forward.', 'Patience is the real potty-training secret.']],
    [/hair|braid|plait|ponytail|bun/i, ['Good hair days start with good company.', 'Braids, bows and big smiles.', 'Messy hair, don’t care.']],
    [/school|homework|learn|study|teacher|class|maths|science|spelling/i, ['Little minds, big wonders.', 'Learning is a treasure that follows you everywhere.', 'Mistakes are proof you’re trying.']],
    [/holiday|rainy|rain|indoor|fort|blanket|camp/i, ['Rainy days were made for pillow forts.', 'Boredom is just adventure waiting to happen.', 'Holidays are for making memories.']],
    [/craft|paint|draw|colour|glue|paper|origami|sew|felt|puppet|comic|model|robot|playdough|marble/i, ['Make a mess, make a masterpiece.', 'Messy hands make magic.', 'Wobbly lines are part of the fun.', 'Make it, love it, show it off.']],
    [/science|experiment|lava|ink|magnet|drops|fizz|volcano/i, ['Science is just magic with explanations.', 'Ask why — then find out!', 'Little scientists, big discoveries.']],
    [/christmas|advent|nativity|santa|tree|carol/i, ['Christmas is love wrapped up in family.', 'Joy to the world — and to our living room.', 'The best present is presence.']],
    [/easter|lent|egg hunt|resurrection|palm/i, ['Easter: new life, new hope.', 'Hop into joy!', 'He is risen — and so is our hope.']],
    [/matariki|stars|new year|puanga/i, ['Look up — Matariki is calling us together.', 'New year, new stars, new hopes.', 'Remember, celebrate, look forward.']],
    [/pray|prayer|church|mass|bless|faith|god|jesus|saint|holy|rosary/i, ['A family that prays together stays together.', 'Faith makes all things possible.', 'Hope is the anchor of the soul.']],
    [/volunteer|neighbour|community|help|donate|donation|donations|kindness/i, ['Be the reason someone smiles today.', 'Kindness is contagious — spread it.', 'Helping hands make happy hearts.']],
    [/tap|washer|plumb|leak|drip|silicone|shower|bath/i, ['Fix the drip, save the trip (and the water bill).', 'Small fix, big relief.', 'A dry home is a happy home.']],
    [/wall|plaster|hole|shelf|stud|rail|drill|screw|hang/i, ['Measure twice, drill once.', 'A little DIY goes a long way.', 'Hang in there — your shelf will too.']],
    [/paint|bedroom|colour|roller|brush/i, ['A fresh coat, a fresh start.', 'Paint the room, brighten the mood.']],
    [/kitchen|cabinet|door|handle|bench/i, ['New handles, new feeling.', 'Small changes, big upgrade.']],
    [/earthquake|safe|safety|smoke alarm|first aid|emergency|fire|mould|damp|warm|dry|insulation|insulate|draught|curtain|heat/i, ['Be prepared, not scared.', 'Safe home, sound sleep.', 'Warm, dry and happy — the Kiwi home dream.', 'Better safe than sorry.']],
    [/car|road|trip|drive|travel|bus|train/i, ['Are we there yet? Doesn’t matter — we’re together.', 'Road trips: snacks, songs and scenery.']],
    [/sun|summer|swim|pool|water/i, ['Slip, slop, slap and wrap — then have fun!', 'Sunny days, salty hair, happy hearts.']],
    [/goal|plan|routine|habit|schedule|calendar|checklist|list|step/i, ['Lists today, calm tomorrow.', 'One thing at a time.', 'A goal without a plan is just a wish.', 'Little steps, big progress.']],
    [/dad|father|mum|mom|mother|parent|child|kid|son|daughter|sibling|brother|sister|family/i, ['Family: where life begins and love never ends.', 'Kids don’t need perfect — they need present.', 'The days are long but the hugs are longer.', 'Home is wherever we’re together.']]
  ];
  var GENERIC = ['Small moments, big memories.', 'Love lives in the little things.', 'Together is our favourite place to be.', 'Make today a story worth telling.', 'Happiness is homemade.', 'Every day is a good day to start.'];
  function hash(s) { var x = 0; for (var i = 0; i < s.length; i++) x = (x * 33 + s.charCodeAt(i)) >>> 0; return x; }
  THEMES.forEach(function (th) { th[0] = new RegExp('\\b(?:' + th[0].source + ')(?:s|es|ed|ing)?\\b', 'i'); });
  // more specific themes first
  var ORDER = ['dessert', 'song', 'recycle', 'craft', 'science', 'tap', 'wall', 'paint', 'kitchen', 'earthquake', 'christmas', 'easter', 'matariki', 'potty', 'hair', 'breast', 'pregnant', 'baby', 'dog', 'movie', 'game', 'photo', 'coffee', 'garden', 'walk', 'holiday', 'cook', 'date', 'surprise', 'money', 'shop', 'declutter', 'sleep', 'pray', 'volunteer', 'laugh', 'memory', 'hug', 'listen', 'read', 'school', 'car', 'sun', 'goal', 'dad'];
  THEMES.sort(function (a, b) { function k(t) { for (var i = 0; i < ORDER.length; i++) if (t[0].source.indexOf(ORDER[i]) >= 0) return i; return 99; } return k(a) - k(b); });
  function lineFor(title, body) {
    title = String(title || '').replace(/\s*·\s*[A-Z][a-z]+$/, '');
    var t = title + ' ' + (body || ''), h = hash(title || t);
    for (var i = 0; i < THEMES.length; i++) if (THEMES[i][0].test(title || '')) return THEMES[i][1][h % THEMES[i][1].length];
    for (var j = 0; j < THEMES.length; j++) if (THEMES[j][0].test(t)) return THEMES[j][1][h % THEMES[j][1].length];
    return GENERIC[h % GENERIC.length];
  }
  JNZX.catchy = lineFor;

  var FAMILY = ['x:potty', 'Reading nook', 'Family tips', 'Family checklists', 'Homemade recipes', 'Grocery list', 'Budget tracker', 'Pregnancy & baby age', 'Pregnancy quotes & tips', 'Parenting quotes & tips', 'Breastfeeding quotes & tips', 'Partnership quotes & tips', 'Husband & wife quotes & tips', 'Parent–child & child–parent', 'x:diy', 'x:holidays', 'x:celebrations', 'x:book'];
  var SEL = 'main article, main .j-card, main .jx-card, main .jx-act, main .story-card, main .l-jar-result, main .jx-acc-item, main .jx-cards3 > *, main .checklist-panel li';
  function inFamily(tab) {
    tab = tab || JNZX._tab;
    if (FAMILY.indexOf(tab) >= 0) return true;
    try { var gi = JNZX.groupOf(tab); return gi >= 0 && JNZX.groupTab(gi) === 'group:Family Together' && tab.indexOf('group:') !== 0; } catch (e) { return false; }
  }
  JNZX.inFamily = inFamily;
  function scan() {
    if (!inFamily()) return;
    document.querySelectorAll(SEL).forEach(function (card) {
      if (card.closest('.jx-shop, .jx-share, .jx-sharemini, header, nav, form') || card.classList.contains('jx-catchy')) return;
      if (card.querySelector(SEL.replace(/main /g, '').split(', ').join(','))) return; // only innermost cards
      if (card.matches('form')) return;
      var hd = card.querySelector('h2, h3, h4, summary, strong, label') || (card.matches('.jx-acc-item') ? card.querySelector('button') : null);
      var title = hd ? hd.textContent.trim() : '';
      if (!title) { var pp = card.querySelectorAll('p'); title = pp.length > 1 ? pp[1].textContent.trim().slice(0, 90) : pp.length ? pp[0].textContent.trim().slice(0, 90) : ''; }
      if (card.matches('li')) title = card.textContent.trim();
      if (!title || title.length < 3 || /^(share|download|open|📋)/i.test(title)) return;
      var body = Array.prototype.map.call(card.querySelectorAll('p, li, blockquote, span:not(.jx-catchy)'), function (x) { return x.closest('button, a, .jx-sharemini, .photo-share, .jx-share') ? '' : x.textContent; }).join(' ').replace(/share this photo|download|open/gi, '').slice(0, 300);
      var want = lineFor(title, body);
      var el = card.querySelector(':scope > .jx-catchy, :scope .jx-catchy');
      if (el && el.getAttribute('data-for') === title) return;
      if (!el) { el = document.createElement(card.matches('li') ? 'span' : 'p'); el.className = 'jx-catchy'; }
      el.setAttribute('data-for', title);
      el.textContent = '✨ “' + want + '”';
      if (!el.isConnected) {
        if (card.matches('li')) card.appendChild(el);
        else if (hd && hd.parentNode === card && hd.tagName !== 'SUMMARY') hd.insertAdjacentElement('afterend', el);
        else card.appendChild(el);
      }
    });
  }
  function prompts() {
    if (!inFamily()) return;
    document.querySelectorAll('main .l-memory-prompt').forEach(function (pr) {
      var title = pr.textContent.trim(), el = pr.nextElementSibling;
      if (!el || !el.classList.contains('jx-catchy')) { el = document.createElement('p'); el.className = 'jx-catchy'; pr.insertAdjacentElement('afterend', el); }
      if (el.getAttribute('data-for') !== title) { el.setAttribute('data-for', title); el.textContent = '✨ “' + lineFor(title, '') + '”'; }
    });
  }

  /* ---------- the catchy line travels with every shared post ---------- */
  function shownLine(el) {
    for (var n = el; n && n.nodeType === 1 && n.tagName !== 'MAIN' && n !== document.body; n = n.parentElement) {
      var c = n.querySelectorAll('.jx-catchy');
      if (c.length === 1) return c[0].textContent.trim();
      if (c.length > 1) return '';
    }
    return '';
  }
  JNZX.catchyFor = function (el, title, body) {
    var shown = el ? shownLine(el) : '';
    if (shown) return shown;
    if (!inFamily()) return '';
    return '✨ “' + lineFor(title, body) + '”';
  };
  try {
    var BasePS = PhotoShare;
    PhotoShare = function PhotoShareWithLine(props) {
      var post = props && props.post || {};
      var extra = import_react.useRef('');
      var wrapped = import_react.useMemo(function () {
        var p = {};
        Object.keys(post).forEach(function (k) { if (k !== 'text') p[k] = post[k]; });
        Object.defineProperty(p, 'text', { enumerable: true, get: function () { var t = post.text || ''; return extra.current && t.indexOf(extra.current) < 0 ? (t ? t + '\n\n' : '') + extra.current : t; } });
        return p;
      }, [post, post.title, post.text]);
      function capture(e) {
        if (e.target && e.target.closest && e.target.closest('.photo-share-trigger')) extra.current = JNZX.catchyFor(e.target, post.title, post.text) || '';
        JNZX._sharePost = { post: wrapped, at: Date.now() };
      }
      return jH('span', { className: 'jx-ps-wrap', style: { display: 'contents' }, onPointerDownCapture: capture, onClickCapture: capture }, jH(BasePS, Object.assign({}, props, { post: wrapped })));
    };
    /* when a post picture is shared, send its words and its own link too */
    var baseSend = sharePhotoFile;
    sharePhotoFile = async function (file, title) {
      var ctx = JNZX._sharePost, nav = navigator;
      if (!ctx || Date.now() - ctx.at > 10 * 60 * 1000) return baseSend(file, title);
      var p = ctx.post, url = '';
      try { url = q7ShareURL(p); } catch (e) {}
      var text = (p.title ? p.title + '\n' : '') + (p.text || '') + (url ? '\n\n' + url : '');
      JNZX.copyText ? JNZX.copyText(text).catch(function () {}) : null;
      if (file && nav.share && nav.canShare && nav.canShare({ files: [file] })) {
        try { await nav.share({ files: [file], title: (p.title || 'The James NZ'), text: text }); return { kind: 'shared', message: 'Shared! The words and link were also copied.' }; }
        catch (e) { if (e && e.name === 'AbortError') return { kind: 'cancelled', message: 'Sharing cancelled. Your picture is still ready.' }; }
      }
      return baseSend(file, title);
    };
  } catch (e) { console.warn('[JNZX] catchy share', e); }

  var t = null;
  function soon() { if (!t) t = setTimeout(function () { t = null; try { scan(); prompts(); } catch (e) {} }, 120); }
  function start() { new MutationObserver(soon).observe(document.getElementById('root') || document.body, { childList: true, subtree: true, characterData: true }); soon(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();
})();
