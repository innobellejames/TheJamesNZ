/* The James NZ — Family Together › Potty Training Made Easy (October 2026).
   Original tips written for the site: readiness check, a calm 3-day plan,
   everyday tips, poo worries, nights, accidents, out and about, hygiene and a
   tap-a-star sticker chart. General guidance only — every child is different. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState;
  var READY = ['Stays dry for 1–2 hours at a time, or wakes dry from a nap', 'Tells you (or shows you) when they’ve done a wee or poo', 'Hides or goes quiet when doing a poo', 'Can walk to the potty and sit for a few minutes', 'Can pull pants down and up with a little help', 'Follows simple two-step instructions (“get your book and sit down”)', 'Is curious about the toilet or copies family members', 'Dislikes a wet or dirty nappy', 'Poos at fairly regular times', 'Wants to be a “big kid” and likes praise'];
  var TIPS = {
    '🧰 Getting ready': [
      ['Pick a calm week', 'Avoid starting during a move, a new baby’s arrival or a new childcare. Calm weeks work best.'],
      ['Read potty books together', 'Story books and songs about potties make the idea familiar and fun before you begin.'],
      ['Let them watch', 'Children learn by copying. Let them see family members use the toilet and wash their hands.'],
      ['Choose the gear together', 'Let your child choose a potty or a toilet seat and a step. Ownership builds excitement.'],
      ['Try big-kid undies', 'Shopping for undies with favourite characters gives them something to keep dry.'],
      ['Practise sitting', 'Sit on the potty fully clothed for a story at first, so it feels safe and normal.'],
      ['Dress for success', 'Elastic-waist pants and no tricky buttons or onesies make getting there in time easier.'],
      ['Stock up', 'Have spare clothes, wipes, a small towel, cleaning spray and a wet bag ready.'],
      ['Agree on words', 'Use the same simple words (wee, poo, potty) at home, with grandparents and at childcare.'],
      ['Talk to childcare', 'Share your plan so everyone uses the same routine and praise.']
    ],
    '📅 A calm 3-day start': [
      ['Day 1 morning: nappies off', 'At home, say goodbye to nappies together. Bare bottom or loose pants makes it easy to notice.'],
      ['Day 1: offer the potty often', 'Offer every 20–30 minutes, after meals and after waking. Keep it short — a minute or two is enough.'],
      ['Day 1: watch for signs', 'Wriggling, crossing legs or going quiet means “potty now!” Calmly guide them there.'],
      ['Day 1: celebrate tries', 'Praise sitting and trying, not just success. “You sat on the potty — great listening!”'],
      ['Day 2: let them lead', 'Ask less, watch more. Encourage them to notice their body: “Do you need a wee?”'],
      ['Day 2: short outing', 'Try a quick trip to the park or shop after a wee, with spare clothes in the car.'],
      ['Day 3: build confidence', 'Add undies and normal clothes. Keep praise warm and simple.'],
      ['Day 3: practise “hold on”', 'Show them how to stop playing and walk to the toilet — practise a pretend race.'],
      ['Keep drinks normal', 'Offer normal amounts of water. Don’t limit drinks — they need practice!'],
      ['It’s not a race', 'Some children click in three days, many take a few weeks. Both are normal.']
    ],
    '💡 Everyday tips': [
      ['Use a timer', 'A fun timer or song can remind them to try every hour or so.'],
      ['Sit after meals', 'The gut wakes up after eating — a good time for a poo try.'],
      ['Make it cosy', 'A footstool helps them feel steady and helps poos come more easily.'],
      ['Keep a potty nearby', 'In the early days, a potty in the living area beats a long walk to the bathroom.'],
      ['Let them flush', 'Pressing the button (or waving bye-bye) can be the best part!'],
      ['Read a book', 'A small basket of potty-time books helps them sit and relax.'],
      ['Copy a teddy', 'Let teddy “use” the potty first. Kids love teaching their toys.'],
      ['Praise specifically', '“You felt the wee coming and ran to the potty!” teaches what they did right.'],
      ['Offer choices', '“Potty or big toilet?” gives control without a power struggle.'],
      ['Keep calm about misses', 'Say “Oops, wees go in the potty” and clean up together — no fuss.'],
      ['Use a sticker chart', 'A sticker for every try (not just successes) keeps motivation high.'],
      ['Mind the pants', 'Tight jeans and belts slow things down — choose easy clothes.']
    ],
    '💩 Poo worries': [
      ['Wee but not poo?', 'Very common. Some children feel scared to “let go”. Stay relaxed and keep trying.'],
      ['Nappy for poo', 'If they ask for a nappy to poo, let them — then slowly do it in the bathroom, then on the potty.'],
      ['Feet flat, knees up', 'A step under the feet helps the body relax for a poo.'],
      ['Fibre and water', 'Fruit, vegetables, wholegrains and plenty of water help keep poos soft.'],
      ['Blow bubbles', 'Blowing bubbles or a pretend birthday candle helps them relax and push gently.'],
      ['No hurry', 'Let them sit for a few minutes with a book. Rushing makes it harder.'],
      ['Watch for constipation', 'Hard, painful poos or going less often can make kids hold on. Talk to your GP, nurse or Plunket.'],
      ['Explain where it goes', 'Some children worry about poos “disappearing”. A simple, calm explanation helps.']
    ],
    '🌙 Nights & naps': [
      ['Daytime first', 'Night dryness usually comes later than daytime — often months or years later.'],
      ['Keep night nappies for now', 'Use pull-ups or nappies at night until they wake dry most mornings.'],
      ['Wee before bed', 'Make a last wee part of the bedtime routine.'],
      ['Protect the mattress', 'A waterproof cover and a spare sheet layer make night changes quick.'],
      ['Light the way', 'A night light and a potty in the bedroom help if they wake needing to go.'],
      ['Don’t restrict water', 'Offer drinks through the day; just avoid big drinks right before bed.'],
      ['Bedwetting is common', 'Many children wet the bed until 5 or later. It isn’t naughty and isn’t their fault.'],
      ['Sleepovers', 'Discreet pull-ups, a sleeping bag and a trusted adult who knows make sleepovers easier.'],
      ['When to get advice', 'Talk to your GP if bedwetting continues after about age 6, or starts again after a long dry spell.']
    ],
    '🌀 Accidents & setbacks': [
      ['Expect accidents', 'Accidents are part of learning — even for weeks after things are going well.'],
      ['Stay neutral', 'Calm words, a quick change and back to play. Shame slows progress.'],
      ['Look for patterns', 'Are accidents during busy play, at childcare or late afternoon? Plan reminders then.'],
      ['Big changes', 'A new sibling, house or school can bring setbacks. Extra cuddles and patience help.'],
      ['Take a break', 'If it’s a daily battle, it’s okay to pause for a few weeks and try again.'],
      ['Illness', 'Tummy bugs and urinary infections can cause accidents. See a doctor if weeing hurts or is very frequent.'],
      ['Don’t compare', 'Cousins, siblings and friends all learn at their own pace.']
    ],
    '🚗 Out & about': [
      ['Pack a potty kit', 'Spare undies and pants, wipes, a plastic bag and a small towel.'],
      ['Travel potty or seat', 'A folding seat or travel potty makes public toilets less scary.'],
      ['Go before you go', 'Try for a wee before leaving home and when you arrive.'],
      ['Know the loos', 'Note where toilets are at the mall, park and library.'],
      ['Cover the auto-flush', 'A sticky note over automatic flush sensors stops surprise flushes.'],
      ['Car seat cover', 'A waterproof liner on the car seat saves a big clean-up.'],
      ['Long trips', 'Plan regular stops every 1–2 hours.']
    ],
    '🧼 Hygiene': [
      ['Wipe front to back', 'Teach girls (and all children) to wipe from front to back.'],
      ['Practise wiping', 'Let them try, then check and finish. Wet wipes can help at first.'],
      ['Handwashing song', 'Wash with soap for the length of a short song, then dry well.'],
      ['Boys: sit first', 'Many boys learn sitting down first, especially for poos. Standing can come later.'],
      ['Aim game', 'For standing boys, a floating cereal “target” makes aiming fun.'],
      ['Lid down, flush', 'Teach lid down before flushing to keep germs in.']
    ],
    '🚫 What to avoid': [
      ['No punishment', 'Never punish or tease for accidents — it creates fear and slows learning.'],
      ['No forcing', 'Don’t hold a child on the potty. Short, happy tries work better.'],
      ['Don’t start too early', 'Starting before they’re ready often means a longer, harder journey.'],
      ['Don’t overdo rewards', 'Small, simple rewards and praise work best; big prizes can backfire.'],
      ['Don’t make a big deal of poo smell', 'Kids pick up on our reactions. Keep faces neutral!']
    ]
  };
  function count() { return Object.keys(TIPS).reduce(function (n, k) { return n + TIPS[k].length; }, 0); }
  function PottyPage(props) {
    var rd = JNZX.useStored('jnzx-potty-ready', {}), ready = rd[0], setReady = rd[1];
    var c = useState(Object.keys(TIPS)[0]), cat = c[0], setCat = c[1];
    var st = JNZX.useStored('jnzx-potty-stars', 0), stars = st[0], setStars = st[1];
    var nm = JNZX.useStored('jnzx-potty-name', ''), name = nm[0], setName = nm[1];
    var yes = READY.filter(function (x) { return ready[x]; }).length;
    var verdict = yes >= 7 ? 'Looks ready — choose a calm week and give it a go!' : yes >= 4 ? 'Getting there — start with potty books and practice sits.' : 'Not yet — that’s okay. Check again in a few weeks.';
    return h('div', null,
      JNZX.Header('FAMILY TOGETHER · BABY & TODDLER', 'Potty training made easy.', count() + ' gentle, practical tips — from first sits to dry nights. Most children are ready somewhere between 18 months and 3 years.'),
      h('section', { className: 'jx-card jx-potty-ready' },
        h('h2', null, '✅ Is my child ready?'),
        h('p', { className: 'jx-muted' }, 'Tick what you’ve noticed lately.'),
        READY.map(function (x) { return h('label', { key: x, className: 'jx-check' }, h('input', { type: 'checkbox', checked: !!ready[x], onChange: function (e) { var o = Object.assign({}, ready); o[x] = e.target.checked; setReady(o); } }), h('span', null, x)); }),
        h('p', { className: 'jx-potty-verdict' }, h('strong', null, yes + ' / ' + READY.length + ' · '), verdict)),
      h('h2', { className: 'jx-potty-h' }, '💛 Tips'),
      h(JNZX.Chips, { label: 'Tip type', options: Object.keys(TIPS).map(function (k) { return { value: k, label: k + ' (' + TIPS[k].length + ')' }; }), value: cat, onChange: setCat }),
      h('div', { className: 'jx-care-grid' }, TIPS[cat].map(function (t) {
        return h('article', { key: t[0], className: 'jx-card jx-potty-tip' }, h('h3', null, t[0]), h('p', null, t[1]), h(JNZX.ShareMini, { title: 'Potty tip: ' + t[0], text: '🚽 Potty tip — ' + t[0] + ': ' + t[1], label: 'Share' }));
      })),
      h('section', { className: 'jx-card jx-potty-chart' },
        h('h2', null, '⭐ Sticker chart'),
        h('label', null, 'Name ', h('input', { value: name, maxLength: 30, placeholder: 'Your child’s name', onChange: function (e) { setName(e.target.value); } })),
        h('div', { className: 'jx-potty-stars', 'aria-label': stars + ' stars' }, Array.apply(null, Array(20)).map(function (_, i) { return h('span', { key: i, className: i < stars ? 'on' : '' }, i < stars ? '⭐' : '○'); })),
        h('div', { className: 'jx-row' },
          h('button', { type: 'button', className: 'primary', onClick: function () { setStars(Math.min(20, stars + 1)); } }, '+ Add a star'),
          h('button', { type: 'button', className: 'secondary', disabled: !stars, onClick: function () { setStars(Math.max(0, stars - 1)); } }, 'Undo'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { setStars(0); } }, 'New chart')),
        stars >= 20 && h('p', { className: 'jx-potty-verdict' }, '🎉 ' + (name || 'Superstar') + ' filled the chart! Time for a celebration.'),
        h('p', { className: 'small-note' }, 'Give a star for every try — sitting counts! Saved on this device.')),
      h('div', { className: 'jx-note' }, h('strong', null, 'When to ask for help: '), 'pain when weeing or pooing, blood, hard poos that hurt, sudden accidents after being dry, or bedwetting after about age 6. Talk to your GP, Plunket nurse or call PlunketLine 0800 933 922 (free, 24/7).'),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:potty', PottyPage);
})();
