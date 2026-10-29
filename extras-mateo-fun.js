/* The James NZ — Ask Mateo › "Make me smile" and "A quiet prayer" (October 2026).
   All jokes, riddles, facts and prayers here are original to The James NZ.
   Mateo picks from these on the device; nothing is sent anywhere. */
(function () {
  'use strict';
  var JNZX = window.JNZX = window.JNZX || {};

  /* ---------------- Make me smile ---------------- */
  var KIWI = [
    ['Why did the pūkeko bring a map to the paddock?', 'It kept getting lost in its own thoughts — and the long grass.'],
    ['What do you call a kiwi who loves maths?', 'A calcu-later bird — it only works at night.'],
    ['Why did the jandal win the race?', 'It had a good flip-flop strategy.'],
    ['What did the hokey pokey say on a hot day?', 'I’m in pieces over you.'],
    ['Why do sheep make great neighbours?', 'They never pull the wool over your eyes.'],
    ['Why did the Wellington umbrella quit?', 'It was tired of being blown away by the job.'],
    ['What does a tūī say when it answers the phone?', 'Kia ora — and also beep, click, whistle and gurgle.'],
    ['Why did the feijoa sit alone at lunch?', 'Everyone else had already been picked up.'],
    ['How do you know a pavlova is nervous?', 'It starts to crack under pressure.'],
    ['Why did the gumboot go to school?', 'It wanted to be a bit more polished.'],
    ['What do you call a sleepy dog on a long drive?', 'A lab-or-ador who’s had enough.'],
    ['Why did the cabbage tree get invited to every barbecue?', 'It always brought good shade.'],
    ['What did the ferry say to the island?', 'I’ll be back — I always come round.'],
    ['Why did the kūmara blush?', 'It saw the salad dressing.'],
    ['What do you call a weta who tells great stories?', 'A legend-weta.']
  ];
  var RIDDLES = [
    ['I have keys but open no doors. What am I?', 'A piano (or a keyboard).'],
    ['The more you take, the more you leave behind. What are they?', 'Footsteps.'],
    ['What has a neck but no head?', 'A bottle.'],
    ['What gets wetter the more it dries?', 'A towel.'],
    ['I’m tall when I’m young and short when I’m old. What am I?', 'A candle.'],
    ['What can you catch but never throw?', 'A cold.'],
    ['What has many teeth but can’t bite?', 'A comb.'],
    ['What goes up but never comes down?', 'Your age.'],
    ['What has one eye but can’t see?', 'A needle.'],
    ['What building has the most stories?', 'A library.'],
    ['What runs but never walks, and has a bed but never sleeps?', 'A river.'],
    ['I’m full of holes but still hold water. What am I?', 'A sponge.'],
    ['What can fill a room but takes up no space?', 'Light — or laughter.'],
    ['What has hands but can’t clap?', 'A clock.'],
    ['What begins with T, ends with T and has tea in it?', 'A teapot.'],
    ['What has a thumb and four fingers but isn’t alive?', 'A glove.'],
    ['What kind of band never plays music?', 'A rubber band.'],
    ['Where does Friday come before Thursday?', 'In the dictionary.'],
    ['What is always in front of you but can’t be seen?', 'The future.'],
    ['What word is spelled wrong in every dictionary?', '“Wrong”.']
  ];
  var FACTS = [
    'A group of kiwi is sometimes called a “parliament” — very serious birds.',
    'Sea otters hold hands while they sleep so they don’t drift apart.',
    'Honey never really goes off. It just slowly crystallises.',
    'A snail can sleep for up to three years when the weather is too dry.',
    'Kea are so clever they have been seen working together to solve puzzles.',
    'Bananas are berries, but strawberries are not — botanists love a surprise.',
    'Octopuses have three hearts and blue blood.',
    'A day on Venus is longer than its whole year.',
    'Cows have best friends and are calmer when they are together.',
    'Aotearoa has no native land snakes at all.',
    'Butterflies taste with their feet.',
    'A sneeze can travel faster than a car on the motorway.',
    'The dot over a lowercase “i” or “j” is called a tittle.',
    'Hippos can’t really swim — they push off the bottom and bounce along.',
    'Wombats make cube-shaped poo. Nature is wonderfully odd.',
    'Little blue penguins are the smallest penguins in the world — and they live right here.',
    'Laughing for a few minutes can relax your muscles for a while afterwards.',
    'Dogs’ nose prints are as unique as our fingerprints.'
  ];
  var CHALLENGES = [
    'Smile challenge: send a “thinking of you” message to someone you haven’t talked to this week.',
    'Smile challenge: make the next cuppa for someone else.',
    'Smile challenge: say three things you like about the person nearest to you.',
    'Smile challenge: put on one song you loved as a teenager and sing the chorus — loudly.',
    'Smile challenge: leave a kind note on the fridge for the family to find.',
    'Smile challenge: do your best dog impression for Mateo. He’s a tough critic.',
    'Smile challenge: step outside, look up and find one cloud shape.',
    'Smile challenge: tell a child a joke from this page — then let them tell you one back.'
  ];
  var WOULD = [
    'Would you rather have a pet kea or a pet penguin?',
    'Would you rather eat pavlova for breakfast or pancakes for dinner?',
    'Would you rather be able to talk to dogs or understand babies?',
    'Would you rather spend a day at the beach or a day in the snow?',
    'Would you rather have a slide in your house or a trampoline in your bedroom?',
    'Would you rather read minds for a day or be invisible for an hour?',
    'Would you rather have hiccups forever or always have a song stuck in your head?',
    'Would you rather visit space or the bottom of the ocean?'
  ];
  var TWISTERS = [
    'Try this three times fast: “Six slippery seals slid slowly seaward.”',
    'Try this three times fast: “Kiwi keep quiet, kiwi keep quiet.”',
    'Try this three times fast: “Fresh feijoas, fresh feijoas, fresh feijoas.”',
    'Try this three times fast: “Mateo makes muddy marks on Mum’s mat.”',
    'Try this three times fast: “Red lorry, yellow lorry.”',
    'Try this three times fast: “Pip packed plenty of purple pikelets.”'
  ];
  var used = {}, lastRiddle = null;
  function next(list, key) {
    var u = used[key] = used[key] || [];
    if (u.length >= list.length) u.length = 0;
    var i; do { i = Math.floor(Math.random() * list.length); } while (u.indexOf(i) >= 0);
    u.push(i); return list[i];
  }
  var SMILE_CHIPS = [['😂', 'Another joke', 'Tell me another joke.'], ['🧩', 'A riddle', 'Give me a riddle.'], ['🤓', 'Fun fact', 'Tell me a fun fact.'], ['🎲', 'Would you rather', 'Ask me a would you rather.'], ['👅', 'Tongue twister', 'Give me a tongue twister.'], ['🌟', 'Smile challenge', 'Give me a smile challenge.']];
  function smile(kind) {
    var t;
    if (kind === 'answer') { if (!lastRiddle) return { text: 'Ask me for a riddle first! 🧩', chips: SMILE_CHIPS }; t = '💡 ' + lastRiddle[1] + '\n\nDid you get it?'; lastRiddle = null; }
    else if (kind === 'riddle') { var r = next(RIDDLES, 'r'); lastRiddle = r; return { text: '🧩 Riddle: ' + r[0] + '\n\nHave a think… tap “Show the answer” when you’re ready.', chips: [['💡', 'Show the answer', 'Show me the answer.']].concat(SMILE_CHIPS) }; }
    else if (kind === 'fact') t = '🤓 Fun fact: ' + next(FACTS, 'f');
    else if (kind === 'would') t = '🎲 ' + next(WOULD, 'w') + '\n\nAsk the family at dinner — everyone has to explain their answer!';
    else if (kind === 'twister') t = '👅 ' + next(TWISTERS, 't');
    else if (kind === 'challenge') t = '🌟 ' + next(CHALLENGES, 'c');
    else {
      var pool = (JNZX.jokes || []).concat(KIWI), j = next(pool, 'j');
      t = '😄 ' + j[0] + '\n\n' + j[1];
    }
    return { text: t, chips: SMILE_CHIPS };
  }
  function smileKind(low) {
    if (/^(show (me )?the answer|answer|tell me the answer|i give up|what'?s the answer)/.test(low)) return 'answer';
    if (/riddle/.test(low)) return 'riddle';
    if (/fact/.test(low)) return 'fact';
    if (/would you rather/.test(low)) return 'would';
    if (/tongue twister|twister/.test(low)) return 'twister';
    if (/challenge/.test(low)) return 'challenge';
    if (/joke|funny|laugh|smile|cheer me up|make me happy/.test(low)) return 'joke';
    return '';
  }

  /* ---------------- A quiet prayer ---------------- */
  var PRAY = {
    family: ['A prayer for my family', [
      'Loving God, thank you for the people under this roof. Keep us patient with each other, quick to forgive and slow to grumble. Bless our meals, our work and our play, and keep us close to you and to one another. Amen.',
      'Lord, hold my family in your hands today — the ones beside me and the ones far away. Where we are tired, give us rest; where we are worried, give us peace; where we are happy, help us say thank you. Amen.',
      'Holy Family of Nazareth, teach our home to be a place of kindness. Help us listen, share the jobs and laugh often. May everyone who comes through our door feel welcome. Amen.']],
    children: ['A prayer for our children', [
      'Father, bless our children. Guard their hearts, guide their steps and grow their kindness. When they fall, help them get up; when they shine, keep them humble. Let them always know they are loved. Amen.',
      'Jesus, friend of children, walk with our little ones today — at school, at play and in every new thing they try. Give them good friends, brave hearts and a peaceful sleep tonight. Amen.']],
    morning: ['A morning prayer', [
      'Good morning, Lord. Thank you for this new day and the breath in my lungs. Help me use today well — to work honestly, speak gently and notice the people who need a kind word. Amen.',
      'God of new beginnings, as the sun comes up, lift my heart too. Whatever today holds, walk ahead of me and stay beside me. Amen.']],
    night: ['A night prayer', [
      'Lord, the day is done. Thank you for the good in it, and forgive me where I fell short. Watch over my family as we sleep, and wake us rested and ready to love again. Amen.',
      'Guardian angel, stay close tonight. Quiet my thoughts, settle my worries and keep our home safe until morning. Amen.']],
    work: ['A prayer for work', [
      'Lord, bless the work of my hands and mind today. Give me focus, honesty and a cheerful spirit. Help me treat my colleagues with respect and do even small jobs well. Amen.',
      'Saint Joseph, quiet worker, pray for me. When the job is hard, help me keep going; when it goes well, help me give thanks. Amen.']],
    study: ['A prayer before study or exams', [
      'Holy Spirit, clear my mind and calm my nerves. Help me remember what I have learned, understand what I read and do my honest best. Whatever the result, remind me that I am more than a mark. Amen.',
      'Lord, as I sit down to learn, give me patience with the hard parts and joy in the new things I discover. Amen.']],
    healing: ['A prayer for healing', [
      'Gentle Jesus, you healed the sick and comforted the hurting. Be close to everyone who is unwell today. Ease their pain, guide the hands of doctors and nurses, and give their families strength. Amen.',
      'Lord, I bring you the one who is sick. Wrap them in your peace, give their body rest and their heart hope. Amen.']],
    worry: ['A prayer when I am worried', [
      'Lord, my mind is full and my heart is heavy. I hand you the things I cannot fix tonight. Give me the next small step and the peace to take it. Amen.',
      'Jesus, you said, “Do not be afraid.” Help me believe it today. Slow my breathing, steady my thoughts and stay with me. Amen.']],
    grief: ['A prayer in grief', [
      'Loving God, I miss them so much. Hold the one we have lost in your eternal light, and hold us in our sorrow. Help us remember with love and grieve with hope. Amen.',
      'Lord, there are no right words today. Sit with us in the quiet, and let our tears become prayers. Amen.']],
    thanks: ['A prayer of thanks', [
      'Thank you, God, for the ordinary gifts — warm food, a safe home, a friend’s message, a child’s laugh. Help me notice them and share them. Amen.',
      'Lord, my heart is full. Thank you for answered prayers and for the ones you are still answering in your own time. Amen.']],
    meal: ['A grace before meals', [
      'Bless us, O Lord, and this food we share. Thank you for the hands that grew it, carried it and cooked it. Help us remember those who are hungry today. Amen.',
      'For food, for family, for friendship and for faith — thank you, Lord. Amen.']],
    travel: ['A prayer for travel', [
      'Lord, keep us safe on the road (or in the air) today. Guide every driver, calm every nerve and bring us home again with stories to tell. Amen.',
      'Saint Christopher, pray for us as we travel. May we arrive safely and be a blessing to those we meet. Amen.']],
    baby: ['A prayer for a new baby or pregnancy', [
      'Creator God, thank you for this new little life. Keep mother and baby safe and well. Fill our home with patience for the long nights and joy for every small milestone. Amen.',
      'Mary, Mother of Jesus, you know what it is to wait for a child. Pray for us as we wait and prepare. Amen.']],
    peace: ['A prayer for peace', [
      'Prince of Peace, where there is anger, bring calm; where there is hurt, bring healing; where there is war, bring an end to fighting. Start with my own heart. Amen.',
      'Lord, make me a peacemaker today — in my words, my messages and my home. Amen.']],
    kindness: ['A prayer to be kind', [
      'Lord, open my eyes to the person who is struggling, and open my hands to help. Let my kindness be quiet, real and generous. Amen.']],
    nz: ['A prayer for Aotearoa', [
      'God of all peoples, bless Aotearoa New Zealand — our land, our waters and every family who calls it home. Help us care for creation, welcome the stranger and look after one another. Amen.']]
  };
  var PRAY_WORDS = [
    ['grief', /\bgrief|griev|loss|lost (my|our)|passed away|died|funeral|miss (him|her|them)\b/],
    ['healing', /\bsick|ill|illness|hospital|healing|surgery|pain|unwell|recovery|operation\b/],
    ['study', /\bexam|test|study|assignment|ielts|school work|homework\b/],
    ['baby', /\b(pregnan|new baby|newborn|expecting|baby)\b/],
    ['worry', /\bworr|anxious|stress|overwhelm|scared|afraid|fear|nervous\b/],
    ['travel', /\btravel|trip|journey|flight|drive|road\b/],
    ['work', /\bwork|job|boss|interview|business|career\b/],
    ['meal', /\bmeal|food|grace|dinner|lunch|breakfast\b/],
    ['morning', /\bmorning|start (of|my) day|today ahead\b/],
    ['night', /\bnight|bed ?time|sleep|evening\b/],
    ['thanks', /\bthank|grateful|gratitude|blessed\b/],
    ['peace', /\bpeace|war|anger|conflict\b/],
    ['kindness', /\bkind|kindness|patien\b/],
    ['nz', /\bnew zealand|aotearoa|nz\b|country\b/],
    ['children', /\b(child|children|kids?|son|daughter|baby girl|baby boy|little ones?|school)\b/],
    ['family', /\bfamily|home|whānau|whanau|husband|wife|parents?|mum|dad\b/]
  ];
  var PRAY_CHIPS = [['👨‍👩‍👧', 'Family', 'A prayer for my family.'], ['🧒', 'Children', 'A prayer for our children.'], ['🌅', 'Morning', 'A morning prayer.'], ['🌙', 'Night', 'A night prayer.'], ['💼', 'Work', 'A prayer for work.'], ['📚', 'Exams', 'A prayer before exams.'], ['🤒', 'Healing', 'A prayer for healing.'], ['😟', 'Worry', 'A prayer when I am worried.'], ['🕊️', 'Grief', 'A prayer in grief.'], ['🙌', 'Thanks', 'A prayer of thanks.'], ['🍽️', 'Grace', 'A grace before meals.'], ['🚗', 'Travel', 'A prayer for travel.'], ['🍼', 'New baby', 'A prayer for a new baby.'], ['☮️', 'Peace', 'A prayer for peace.'], ['🇳🇿', 'Aotearoa', 'A prayer for Aotearoa.']];
  function prayer(low) {
    var theme = '';
    for (var i = 0; i < PRAY_WORDS.length; i++) if (PRAY_WORDS[i][1].test(low)) { theme = PRAY_WORDS[i][0]; break; }
    if (!theme) { var keys = Object.keys(PRAY); theme = keys[Math.floor(Math.random() * keys.length)]; }
    var p = PRAY[theme], text = next(p[1], 'p-' + theme);
    return { text: '🙏 ' + p[0] + '\n\n' + text + '\n\nChoose another below, or simply sit quietly for a moment.', chips: PRAY_CHIPS };
  }
  JNZX.mateoFun = { smile: smile, smileKind: smileKind, prayer: prayer, SMILE_CHIPS: SMILE_CHIPS, PRAY_CHIPS: PRAY_CHIPS };
})();
