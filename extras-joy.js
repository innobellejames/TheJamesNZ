/* The James NZ — Everyday Joy upgrades (October 2026): smaller QR codes on
   shared pictures, moving photo banner on A Little Lift, Coffee & a Smile
   categories page and an engaging Water Intake tracker with a journal. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo, useRef = R.useRef, Frag = R.Fragment;
  function asset(k) { try { return __jamesAsset(k); } catch (e) { return k; } }

  /* ---------------- smaller QR codes on every shared picture ---------------- */
  try {
    var baseQR = q7DrawPostQR;
    q7DrawPostQR = function (ctx, x, y, size, post) { var s = Math.round(size * 0.55); return baseQR(ctx, x + size - s, y + size - s, s, post); };
  } catch (e) {}
  try {
    var baseJQR = jDrawQR;
    jDrawQR = function (ctx, x, y, size) { var s = Math.round(size * 0.55); return baseJQR(ctx, x + size - s, y + size - s, s); };
  } catch (e) {}
  try {
    jDownloadHTML = function (name, title, body) {
      var qr = __jamesEmbedded['./october/website-qr.png'];
      var html = '<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + jEscape(title) + '</title><style>body{font:19px/1.7 system-ui;color:#17352e;background:#fff9ee;max-width:850px;margin:auto;padding:28px}h1,h2{line-height:1.2}section{break-after:page;margin:30px 0;padding:24px;background:white;border-radius:18px}img.illustration{width:100%;max-height:480px;object-fit:contain}table{width:100%;border-collapse:collapse}th,td{padding:10px;border:1px solid #ccd8ce;text-align:left}svg{width:100%;max-height:480px}footer{display:flex;align-items:center;gap:12px;margin-top:24px;font-size:15px}footer img{width:56px;height:56px}a{color:#12644a}@media print{body{padding:0;background:white}section{border-radius:0}}</style><h1>' + jEscape(title) + '</h1>' + body + '<footer><a href="' + jURL + '"><img src="' + qr + '" alt="QR code linking to www.thejamesnz.com"></a><a href="' + jURL + '">www.thejamesnz.com</a></footer></html>';
      savePhotoFile(new File([html], name + '.html', { type: 'text/html' }));
    };
  } catch (e) {}

  /* ---------------- A Little Lift: moving photo banner ---------------- */
  var KEN = ['./mindfulness-scenes/sky.webp', './mindfulness-scenes/stream.webp', './mindfulness-scenes/garden.webp'];
  function enhanceBanners() {
    document.querySelectorAll('.inspiration-feature .photo-text-card:not(.jx-ken)').forEach(function (card) {
      var bg = getComputedStyle(card).backgroundImage, m = bg.match(/url\("?([^")]+)"?\)\s*$/);
      var srcs = (m ? [m[1]] : []).concat(KEN.map(asset));
      card.classList.add('jx-ken');
      var wrap = document.createElement('div'); wrap.className = 'jx-ken-layers'; wrap.setAttribute('aria-hidden', 'true');
      srcs.forEach(function (s, i) { var d = document.createElement('div'); d.className = 'jx-ken-slide'; d.style.backgroundImage = 'url("' + s + '")'; d.style.animationDelay = (i * 8) + 's'; wrap.appendChild(d); });
      wrap.style.setProperty('--n', srcs.length);
      var shade = document.createElement('div'); shade.className = 'jx-ken-shade';
      card.insertBefore(shade, card.firstChild); card.insertBefore(wrap, card.firstChild);
    });
  }
  var kt = null;
  function soon() { if (!kt) kt = setTimeout(function () { kt = null; enhanceBanners(); }, 200); }
  function start() { new MutationObserver(soon).observe(document.getElementById('root') || document.body, { childList: true, subtree: true }); soon(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start); else start();

  /* ---------------- Coffee & a Smile (simple, all original) ---------------- */
  var CQ = [
    'A warm cup, a kind word, a fresh beginning.',
    'Let the coffee cool while the conversation warms.',
    'Pour a little patience into your morning.',
    'Good company is the best thing beside a coffee cup.',
    'Some mornings begin with coffee; every morning can begin with kindness.',
    'There is room at this table for your story.',
    'Take your time. Even a small cup can hold a lovely moment.',
    'Life is too short for lukewarm coffee and half-hearted hugs.',
    'Sip slowly. The emails will still be there.',
    'Coffee first, then conquer the world — gently.',
    'Every great plan started over a cuppa.',
    'A refill is just a second chance in a mug.',
    'Steam rising, worries lifting.',
    'Friendship is sharing the last biscuit with your flat white.',
    'Today’s forecast: 100% chance of coffee and kindness.',
    'Grind the beans, not yourself.',
    'The best conversations happen between the first sip and the last.',
    'Warm hands, warm heart, warm cup.',
    'Make your coffee strong and your words gentle.',
    'A quiet cup in the morning is a little prayer of thanks.',
    'You’re the cream in someone’s coffee today.',
    'Pause, pour, breathe, begin.',
    'Great things brew slowly.',
    'Hold the cup, hold the moment.',
    'Some problems shrink after a hot drink and a friend.',
    'Mugs are for hugging, coffee is for sharing.',
    'Wake up, smell the coffee, notice the sunshine.',
    'A coffee date is a small promise: I have time for you.',
    'When in doubt, add a little froth.',
    'Your morning cup doesn’t judge. It just helps.',
    'Brew kindness by the potful.',
    'A cuppa on the deck is a holiday in ten minutes.',
    'Let the kettle sing and the day begin.',
    'Coffee tastes better when someone else made it with love.',
    'Busy day? Coffee helps. Friends help more.',
    'Here’s to slow sips and fast friendships.',
    'The secret ingredient is always good company.',
    'A café table for two can fix a week of worries.',
    'Rise and grind — but mostly rise.',
    'Even the strongest espresso needs a gentle hand.',
    'Every mug has a story. What’s in yours today?',
    'Sit, sip, smile, repeat.',
    'A shared pot of coffee is a small feast.',
    'Coffee breaks are tiny holidays. Take them seriously.',
    'Be like a flat white: smooth, warm and quietly strong.',
    'Fill your cup and then fill someone else’s.',
    'Mornings are softer with a mug in hand.',
    'May your coffee be hot and your day be kind.',
    'One cup, two chairs, endless stories.',
    'Slow down — good coffee and good days both take time.'
  ];
  var CF = [
    ['It’s really a seed', 'A coffee bean is the seed found inside a small red fruit called a coffee cherry. Most cherries hold two seeds.'],
    ['Two main types', 'Most coffee comes from two plants: Arabica, which tastes smoother and sweeter, and Robusta, which is stronger and has more caffeine.'],
    ['Grows near the equator', 'Coffee grows best in the “bean belt” — warm, rainy places between the Tropics of Cancer and Capricorn.'],
    ['Cherries ripen unevenly', 'On one branch you can find green, yellow and red cherries at the same time, so careful farms pick by hand several times.'],
    ['Green before roasting', 'Raw coffee beans are pale green and smell grassy. Roasting turns them brown and creates hundreds of aroma compounds.'],
    ['First crack', 'During roasting, beans make a popping sound called “first crack” as moisture escapes — a little like popcorn.'],
    ['Light vs dark roast', 'Light roasts keep more of the bean’s fruity flavour; dark roasts taste bolder and more bitter. Caffeine is very similar in both.'],
    ['Freshness matters', 'Roasted beans taste best within about two to four weeks. Keep them in an airtight container away from light and heat.'],
    ['Grind just before brewing', 'Ground coffee loses aroma quickly. Grinding right before you brew keeps the flavour brighter.'],
    ['Water temperature', 'Just off the boil — around 92–96 °C — is ideal. Boiling water can make coffee taste harsh.'],
    ['Mostly water', 'A cup of brewed coffee is about 98% water, so good-tasting water makes better coffee.'],
    ['Crema', 'The golden foam on an espresso is called crema. It forms when pressure pushes oils and gases out of fresh coffee.'],
    ['Espresso means pressed', 'An espresso is made by pushing hot water through finely ground coffee under high pressure in about 25–30 seconds.'],
    ['Cold brew is slow', 'Cold brew steeps in cold water for 12–24 hours. It tastes smoother and less acidic than hot coffee.'],
    ['Decaf isn’t zero', 'Decaffeinated coffee still has a tiny amount of caffeine — usually just a few milligrams per cup.'],
    ['Caffeine takes time', 'Caffeine usually starts working about 15–45 minutes after your first sip.'],
    ['Milk microfoam', 'Silky café milk is steamed to around 60–65 °C. Hotter milk loses its natural sweetness.'],
    ['Latte art needs microfoam', 'Hearts and rosettas only work when milk has tiny, glossy bubbles — big bubbles won’t hold a pattern.'],
    ['Flat white fame', 'The flat white is a café favourite in Aotearoa: espresso with a thin layer of velvety milk.'],
    ['A fruit tea too', 'The dried skins of coffee cherries can be steeped as a fruity tea called cascara.'],
    ['Coffee trees live long', 'A coffee plant can keep producing cherries for 20 years or more with good care.'],
    ['Shade-grown coffee', 'Some coffee grows under taller trees, which shelters birds and helps protect the soil.'],
    ['Altitude and flavour', 'Beans grown high in the mountains ripen slowly and often taste brighter and more complex.'],
    ['Bloom', 'When hot water first hits fresh grounds, they puff up and bubble. Baristas call this the “bloom”.'],
    ['Grind size matters', 'Fine grounds suit espresso, medium suits pour-over, and coarse grounds suit plungers and cold brew.'],
    ['The golden ratio', 'A good starting point is about 1 gram of coffee to 15–17 grams of water.'],
    ['Tasting like a pro', 'Coffee tasters slurp loudly to spray coffee across the tongue and pick up more flavour.'],
    ['Aroma is half the taste', 'Much of what we “taste” in coffee is really smell. Try sipping while holding your nose — it’s much flatter!'],
    ['Acidity is a good thing', 'In coffee, “acidity” means a bright, lively taste — like a crisp apple — not sourness.'],
    ['Storage myth', 'The fridge isn’t the best place for beans: moisture and smells can sneak in. A cool cupboard is better.'],
    ['Used grounds in the garden', 'Used coffee grounds can be mixed into compost. Add them a little at a time with other green waste.'],
    ['Takeaway cups', 'Most takeaway cups have a plastic lining and can’t go in kerbside recycling. A reusable cup is a small, kind swap.'],
    ['Plunger, a.k.a. French press', 'A plunger steeps coffee in water for about four minutes, then a mesh filter presses the grounds to the bottom.'],
    ['Stovetop pressure', 'A stovetop moka pot uses steam pressure to push water up through the coffee into the top chamber.'],
    ['Pour-over patience', 'Pour-over coffee is made by slowly pouring water in circles through a paper filter for a clean, light cup.'],
    ['Milk alternatives', 'Oat milk steams especially well because it contains natural sugars and a little fat.'],
    ['Why coffee smells so good', 'Roasting creates more than 800 aroma compounds — more than red wine.'],
    ['A cuppa for the kids', 'A “fluffy” — frothed milk with a chocolate dusting and a marshmallow — is a Kiwi café treat with no coffee at all.'],
    ['Sweet without sugar', 'A pinch of cinnamon in the grounds adds warmth and a hint of sweetness without sugar.'],
    ['Coffee and sleep', 'Caffeine can stay in your body for hours, so many people enjoy their last coffee before early afternoon.']
  ];
  var CJ = [
    ['Why did the flat white sit by the window?', 'It wanted a view of the latte-tude.'],
    ['What did the barista say to the shy cup?', 'Don’t worry — you’re going to be grounded in no time.'],
    ['Why did the coffee bean join the choir?', 'It had a rich, full-bodied voice.'],
    ['What’s a coffee cup’s favourite Kiwi beach?', 'Mug-Bay. (Close enough to Mount Maunganui.)'],
    ['Why was the plunger so good at its job?', 'It always pressed on, no matter what.'],
    ['What did the milk say to the espresso?', 'You’re a shot above the rest.'],
    ['Why did the coffee take a nap?', 'It was feeling a little drip-ped out.'],
    ['How does a stovetop pot tell a secret?', 'It lets off a little steam.'],
    ['Why did the kettle get a medal?', 'It always rose to the boil-casion.'],
    ['What do you call a coffee that loves tramping?', 'A long walk black.'],
    ['Why did the biscuit dive into the coffee?', 'It wanted to be dunk-ed into the deep end.'],
    ['What’s the coffee bean’s favourite dance?', 'The roast-a-nova.'],
    ['Why don’t coffee cups ever get lost?', 'They always follow the aroma home.'],
    ['What did the mug say on Monday?', 'Fill me up — I’m running on empty.'],
    ['Why was the cold brew so relaxed?', 'It took its time, all twelve hours of it.'],
    ['How do coffee beans keep fit?', 'Daily grind, of course.'],
    ['What did the sugar cube say before jumping in?', 'Here goes nothing — I’m dissolving my fears!'],
    ['Why did the café hire a sheep?', 'For extra-woolly foam.'],
    ['What did the pour-over say to the impatient customer?', 'Good things filter through slowly.'],
    ['What’s a barista’s favourite game?', 'Hide and steam.'],
    ['Why was the teaspoon always invited?', 'It knew how to stir up a good time.'],
    ['What do you call a coffee with great manners?', 'A pour-lite brew.'],
    ['Why did the latte blush?', 'Someone drew a heart on it.'],
    ['How does a kiwi bird order coffee?', 'Very quietly, at night, with a long beak in the foam.'],
    ['Why did the coffee refuse to argue?', 'It didn’t want things to get bitter.'],
    ['What did one coffee bean say to the other on the farm?', 'Stick with me — we’re a pair from the same cherry.'],
    ['Why did the espresso go to school?', 'To get a little more grounded.'],
    ['What’s the café cat’s favourite drink?', 'A purr-over.'],
    ['Why did the jandal visit the café?', 'For a quick flip and a flat white.'],
    ['What did the empty mug say to the coffee pot?', 'I’ve missed you a hole lot.']
  ].concat([["Why did the espresso keep checking its watch?", "It was always short on time."], ["Why did the coffee bring a tissue to the movie?", "It knew the ending would be a little bitter."], ["Why did the latte break up with the teabag?", "It felt steeped in drama."], ["How does a coffee bean say goodbye?", "Brew-bye for now!"], ["What did the barista say when the milk ran out?", "That’s an udder disaster."], ["Why did the mug go to the doctor?", "It had a bad case of chips."], ["What’s a coffee’s favourite kind of music?", "Anything with a good beat — and a strong finish."], ["Why did the coffee bean go to the gym?", "To work on its roast."], ["What do you call a cow that makes coffee?", "A moo-cha machine."], ["Why are coffee shops so friendly?", "Everyone’s always brewing up conversation."], ["What did the coffee say to the tired parent?", "I’ve got your back — and your Monday."], ["How do you know a coffee is in love?", "It’s head over heels for its cream."], ["Why did the decaf feel left out?", "Nobody gave it a buzz."], ["What did the grinder say at the party?", "Let’s get this party crushed!"], ["Why was the coffee cup so polite?", "It was raised well."], ["What’s a barista’s favourite exercise?", "The press-up."], ["How does a latte stay warm in winter?", "It wears a foam jacket."], ["Why did the coffee call the library?", "It wanted to check out a few brews."], ["What do coffee beans do before they sleep?", "They say their prayers — “Give us this day our daily bread… and roast.”"], ["Why did the teapot apologise?", "It spoke out of spout."], ["What kind of coffee does a ghost drink?", "Boo-ccino."], ["Why did the coffee shop owner become a judge?", "She was great at reading the grounds."], ["What did the milk jug say to the tamper?", "Stop pressuring me!"], ["Why was the café so calm?", "It had a lot of hot chocolate and good vibes."], ["What do you call coffee in Antarctica?", "Iced — no matter what you order."], ["Why don’t mugs ever tell lies?", "They’re always crystal clear about what’s inside."], ["How does a coffee pot win an argument?", "It has the perfect pour-suasion."], ["What did the cappuccino say to the croissant?", "You’re flaky, but I like you."], ["What’s a coffee bean’s favourite holiday?", "Brew Year’s Day."], ["Why was the coffee always on time?", "It never missed a perc-ing chance."], ["Why did the sleepy farmer bring coffee to the paddock?", "The cows needed a moo-tivational talk."], ["Why did the coffee get a job at the bank?", "It was great with cream-dit."], ["What did the hot chocolate say to the marshmallow?", "You make my day so much softer."], ["How does a coffee machine sing?", "In a deep, steamy baritone."], ["Why did the tea bag stay calm?", "It always knew how to steep it easy."], ["What do you call a coffee that’s been to university?", "A well-grounded graduate."], ["Why did the mocha join the band?", "It had great chocolate rhythm."], ["What did the café owner say to the leaking cup?", "You’ve really let me drip down."], ["Why don’t coffee beans play hide and seek?", "You can always smell them out."], ["What did the latte artist say to her boss?", "I put my heart into every cup."], ["Why did the coffee start a podcast?", "It had a lot of hot takes."], ["How does a coffee cup greet a friend?", "“Hey, mug! Long time no sip!”"], ["What did the coffee say to the alarm clock?", "You wake them; I’ll do the rest."], ["Why do coffee lovers make great friends?", "They always espresso their feelings."], ["What kind of car does a coffee drive?", "A Cappu-cheeno."], ["Why did the café install more mirrors?", "So the coffee could reflect on its choices."], ["What did the teaspoon say to the sugar?", "You’re so sweet — let’s mix it up."], ["What did the barista name her goldfish?", "Latte, because he swims in circles."], ["How does a coffee bean propose?", "“Will you be my roast-mate forever?”"], ["Why did the flat white feel confident?", "It had nothing to foam about."], ["What did the espresso say to the hot water?", "Long time, no see — let’s make an Americano."], ["Why did the kettle sing in the morning?", "It was whistle-ly happy."], ["What do you call a café on the moon?", "The Milky Way Café — great foam, no atmosphere."], ["Why did the biscuit cry?", "Its mum had been a wafer too long."], ["What did the mug say to the dishwasher?", "Thanks for the spa day."], ["Why is coffee like a good friend?", "It’s warm, strong and always there in the morning."], ["How did the coffee feel after the race?", "Completely drained."], ["What do you call a coffee bean that tells stories?", "A bean-ventor of tales."], ["Why did the cappuccino go to art school?", "It wanted to learn foam drawing."], ["What did the cold brew say to the hot coffee?", "Chill — good things take time."], ["Why was the coffee so good at maths?", "It could always find the brew-t of the problem."], ["What does a barista do at the beach?", "Makes sandcastle lattes."], ["Why did the coffee cup get promoted?", "It always handled things well."], ["What’s a coffee bean’s favourite game?", "Tag — you’re ground!"], ["Why did the latte go to therapy?", "It had too many layers."], ["What do you call an Italian coffee that tells jokes?", "A funny-ccino."], ["How do coffee beans stay in touch?", "They send each other bean-mails."], ["Why was the coffee nervous at the party?", "It didn’t want to spill the beans."], ["What did the steam wand say to the milk?", "Let’s make some noise!"], ["Why did the café’s Wi-Fi password change?", "Someone kept latte-ing the neighbours in."], ["What did the teapot say to the kettle?", "You’re just my type — hot and bubbly."], ["Why did the coffee get a ticket?", "It was speeding — double shot."], ["How do you make a coffee laugh?", "Tell it a really grounded joke."], ["What did the sugar say to the coffee on its birthday?", "Have a sweet one!"], ["Why did the coffee shop open a library?", "For brew-ks and books."], ["What did the coffee bean say to the grinder?", "I’m going to pieces without you."], ["Why was the latte always invited to weddings?", "It was great at toasts."], ["What does a coffee do on a rainy day?", "Stays in and drips."], ["Why don’t you tell secrets near a coffee pot?", "It might spill."], ["What do you call a coffee that won’t share?", "Selfish brew."], ["Why was the teabag a great listener?", "It always soaked it all in."], ["What’s the best time to drink coffee?", "Brew o’clock."], ["Why did the espresso take up yoga?", "To find its inner calm-puccino."], ["What did the coffee cup say to the saucer?", "I’m nothing without your support."], ["Why did the coffee sit on the clock?", "It wanted to be on time for once."], ["What do you call a coffee with a cold?", "Achoo-ccino."], ["Why did the milk go to school?", "To become a little more cultured."], ["What did the mug wear to the party?", "A cosy knitted sleeve."], ["Why was the coffee bean the best detective?", "It always got to the grounds of the case."], ["What did the barista say to the impatient dog?", "Pup-uccino coming right up!"], ["Why do coffee and morning get along?", "They’re both a little bit bitter until they warm up."], ["What do you call a coffee that sings opera?", "A soprano-ccino."], ["Why was the coffee shop so quiet?", "Everyone was in a brew-tiful mood."], ["What did one coffee say to another on Valentine’s Day?", "I like you a latte."], ["Why did the coffee beans throw a party?", "It was the grand opening of the new grind."], ["What’s a coffee’s favourite fairy tale?", "Brew-ty and the Beast."], ["Why did the coffee cup go to the gym?", "To get a better handle on things."], ["What did the coffee say when it was finished?", "That’s the last drop!"], ["Why did the barista win the race?", "She had a strong finish and great crema."], ["What do you call a coffee that is always late?", "A lazy latte."], ["How does a coffee bean apologise?", "“I’m sorry — I bean thinking about it.”"], ["What did the café say to the rain?", "Come in, sit down, have a drink."], ["Why do coffee pots never get lonely?", "They always have a mug to talk to."], ["What did the cup of tea say to the coffee?", "You’re strong, but I’m calm."], ["Why did the coffee run away?", "It felt it was being pressed too hard."], ["What did the espresso say to the barista?", "You complete my shot."], ["How do coffee beans get to work?", "They take the grind line."], ["What did the coffee say after a long day?", "I’m all poured out."], ["Why did the latte take the stairs?", "It was trying to stay fit — no lift needed."], ["What kind of coffee do pirates drink?", "Arrr-abica."], ["Why did the tea feel left out at the café?", "Everyone kept spilling the coffee news."], ["What’s a coffee’s favourite sport?", "Cup-ball."], ["Why did the barista stay calm in the rush?", "She knew how to keep the pressure at nine bars."], ["What did the coffee say to the doughnut?", "You make me feel whole."], ["Why was the cup so tired?", "It had a long day at the office mug-shelf."], ["What did the coffee shop say on its first birthday?", "It’s been a great brew-ginning."], ["Why do coffee beans love New Zealand?", "The flat whites make them feel at home."], ["What did the lid say to the takeaway cup?", "I’ve got you covered."], ["Why did the coffee cup refuse to fight?", "It didn’t want to get chipped."], ["Why did the kiwi bird refuse to fly?", "It said walking is more its pace — and the view is better at ground level."], ["Why did the sheep sign up for a choir?", "It had a lovely baaa-ritone."], ["Why did the jandal break up with the sneaker?", "It needed more freedom between its toes."], ["What’s a pavlova’s favourite type of weather?", "Anything that isn’t humid."], ["Why did the tūī start a band?", "It already had two voices."], ["What did the pōhutukawa say in December?", "Time to dress up red for Christmas!"], ["Why do Kiwis love tramping?", "It’s the only time “I walked all weekend” counts as a holiday."], ["Why did the ram get a sports car?", "It wanted to go from zero to sixty in two baaas."], ["Why did the wētā go to school?", "To learn how to bug its teacher properly."], ["What did the sandcastle say when the tide came in?", "Well, that was a short lease."], ["Why did the pūkeko cross the road?", "To show the kiwi it could be done."], ["What do you call a hokey pokey that tells jokes?", "A crack-up ice cream."], ["Why did the Wellington wind join the orchestra?", "It already knew how to blow everyone away."], ["What did the dormant volcano say to Auckland?", "Don’t worry, I’m just resting my eyes."], ["Why don’t sheep ever win at poker?", "Their faces always say “baaa-d hand”."], ["What did the sausage sizzle say to the bread?", "You’ve got me wrapped up."], ["Why did the surfer bring a ladder to Raglan?", "He heard the waves were really high."], ["Why did the cloud follow the shepherd home?", "It thought it was one of the flock."], ["Why did the kūmara go to the party?", "It wanted to be the hottest thing in the hāngī."], ["What’s the fanciest thing a seagull eats?", "Hot chips with a view."], ["Why did the gumboot feel important?", "It had a whole day named after it in Taihape."], ["What did the jandal say to the hot sand?", "Ouch — thanks for keeping me on my toes."], ["Why are pīwakawaka always happy?", "They never stop wagging their tails."], ["What did one glacier say to the other?", "Don’t rush me — I’m moving at my own pace."], ["Why did the possum become a comedian?", "It was brilliant at playing dead on stage."], ["What do you call a kiwi with a great memory?", "A bird who never forgets the night shift."], ["Why did the hāngī have so many friends?", "It was the warmest thing at the party."], ["What did the bach say to the family?", "Welcome back — I kept the jandals by the door."], ["Why did the fizzy drink go to the gym?", "To be world famous in New Zealand for its fitness."], ["What did the rugby ball say to the fan?", "I get a real kick out of you."], ["Why did the sheepdog get a pay rise?", "It always rounded up the numbers."], ["What do you call a rainy day in Auckland?", "Tuesday."], ["Why did the penguin visit Ōamaru?", "For the blue-tie event of the year."], ["What did the kea say to the car?", "Nice wipers — mine now!"], ["Why did the mince and cheese pie win the award?", "It had the best filling in town."], ["What’s a Kiwi’s favourite type of story?", "A tall tale about a long white cloud."], ["Why did the Cook Strait ferry feel dizzy?", "It kept going back and forth all day."], ["What did the cicada say in summer?", "I’m not loud — I’m enthusiastic!"], ["Why do kererū always look so round?", "They never skip a feed of berries."], ["What did the sunscreen say to the Kiwi?", "Slip, slop, slap — and don’t forget me again."], ["Why did the trampoline get a medal?", "It kept bouncing back."], ["What do you call a flat street in Wellington?", "A rumour."], ["Why did the campervan sing?", "It had plenty of room for a tune."], ["Why did the dog refuse to leave the beach?", "It had finally dug to the good sand."], ["Why did the dinghy go to school?", "To learn a few more knots."], ["Why did the snapper start a choir?", "It knew all the right scales."], ["Why don’t pāua ever brag?", "They keep their beauty on the inside."], ["Why did the wave apologise to the beach?", "It came on a little strong."], ["Why did the crab walk sideways into the meeting?", "It didn’t want to look too forward."], ["What does a sheep say when it’s tired?", "Time for a lamb nap."], ["Why did the bee start a business?", "It had a great buzz-iness plan."], ["What did the duck say at the café?", "Just a quack-uccino, please."], ["Why did the calf climb the hill?", "It wanted to see what the moo-ntain was about."], ["What do you call a dog that loves gardening?", "A bloom-hound."], ["Why do cats sit on keyboards?", "They want to keep an eye on the mouse."], ["What did the goldfish say to the bowl?", "I’ve been around you all day."], ["Why did the hen sit on the clock?", "She wanted to be on time for once."], ["What do you call a sleepy bear in spring?", "Unbearably grumpy."], ["Why did the owl get top marks?", "It gave a hoot about homework."], ["Why did the horse go to the bakery?", "It wanted a neigh-bourly loaf."], ["Why do bees make the best friends?", "They always bee there for you."], ["What did the puppy say after chewing a shoe?", "It was a step in the right direction."], ["Why did the snail join a running club?", "It wanted to pick up the pace — eventually."], ["Why do alligators make bad receptionists?", "They always snap at the phone."], ["Why did the elephant pack a trunk?", "It was going on holiday — obviously."], ["What did the pig say on a hot day?", "I’m bacon out here!"], ["Why did the frog stay calm in traffic?", "It knew how to hop to it."], ["Why did the kangaroo visit New Zealand?", "It heard the flat whites were worth the hop."], ["Why are fish good at keeping secrets?", "Everything they say is under water."], ["What do you call a cow that tells jokes?", "A laughing stock."], ["What did the kitten say to the ball of wool?", "You’ve got me all wound up."], ["Why was the dog such a great storyteller?", "Every story had a happy tail."], ["Why did the cat take up bowling?", "It loved knocking things over."], ["Why did the cows have a party?", "It was the moo-n festival."], ["Why did the puppy sit by the fan?", "It wanted to be a cool dog."], ["What did the parrot say at the library?", "Nothing — it was told to keep it down, so it repeated that."], ["Why did the lion become a chef?", "It loved making roar-st dinners."], ["What did the tomato say to the slow tomato?", "Hurry up and catch up!"], ["Why did the banana go to the party alone?", "Its bunch was running late."], ["Why did the cheese go to the gym?", "To get a little more mature."], ["Why did the cookie go to the nurse?", "It was feeling a bit crumbly."], ["What did the lettuce say to the gardener?", "Thanks for helping me grow up."], ["Why did the grape win the race?", "It never wine-d once."], ["What do you call a strawberry that sings?", "A jam session."], ["Why did the toast stay so calm?", "It was used to the heat."], ["What did the spaghetti say at the party?", "Let’s get tangled up in some fun!"], ["Why do mushrooms always get invited back?", "They know how to grow on people."], ["What did the sushi roll say to the chopsticks?", "Thanks for picking me."], ["Why did the orange win the spelling bee?", "It knew how to keep its peel together."], ["Why was the noodle such a good listener?", "It always went with the flow."], ["Why was the egg so good at comedy?", "It always cracked everyone up."], ["What did the burger say to the chips?", "You’re my favourite side."], ["Why did the potato become a detective?", "It had great eyes."], ["Why did the doughnut get an award?", "It always gave its whole heart — and the hole too."], ["Why don’t eggs go to parties?", "They’re afraid of getting scrambled."], ["What did the apple say to the orange?", "We may be different, but we’re both a-peeling."], ["Why did the carrot become a lifeguard?", "It had excellent eyesight."], ["Why did the peanut become an astronaut?", "It wanted to see the Milky Way up close."], ["Why did the chocolate bar stay calm in the heat?", "It had a cool head and a soft centre."], ["What did the corn say when it heard the joke?", "That’s a-maize-ing!"], ["Why did the pancake become a teacher?", "It loved flipping through books."], ["Why did the pizza go to the doctor?", "It was feeling a little cheesy."], ["Why did the lemon become a coach?", "It knew how to make people pucker up and try."], ["Why did the pumpkin win the talent show?", "It had the best gourd performance."], ["Why did the kiwifruit get invited everywhere?", "It had a fuzzy personality and a heart of gold — well, green."], ["What do you call a sandwich that tells the truth?", "An honest toastie."], ["Why was the bread so relaxed?", "It knew how to take a loaf day."], ["What did the popcorn say to the microwave?", "You really make me pop!"], ["Why did the soup call its friend?", "It needed someone to spoon with."], ["Why did the salad win the argument?", "It had the best dressing."], ["Why did the watermelon throw a party?", "It wanted to have a seedy good time."], ["What did the ice cream say on a hot day?", "I’m melting with happiness."], ["Why did the feijoa feel special?", "Everyone in April talks about it."], ["Why did the sausage roll get a promotion?", "It always rolled up early."], ["Why did the scone apologise?", "It was a little crumbly at the meeting."], ["Why did the lamington get its photo taken?", "It was coconut-ly gorgeous."], ["Why did the toddler bring a ladder to dinner?", "He heard dessert was on the top shelf."], ["Why did Dad mow the lawn in his best shirt?", "He heard the neighbours were judging the garden show."], ["What did the baby say to the nappy?", "I think we need to talk — you’re a bit full of yourself."], ["Why did the kids put the clock in the oven?", "They wanted a hot time for dinner."], ["Why did Mum bring a broom to bed?", "She wanted to sweep everyone off to sleep."], ["What did the lunchbox say on Friday?", "Please, no more forgotten banana surprises."], ["Why did the boy wear a raincoat to the bath?", "He heard there was a forecast of bubbles."], ["What did the school bag say to the student?", "You’re carrying way too much on your back."], ["Why did the pencil go to sleep?", "It was feeling a little dull."], ["What did the maths book say to the reading book?", "You’ve got a lot of chapters; I’ve got a lot of problems."], ["Why did the homework go missing every Friday?", "It liked to start the weekend early."], ["Why did the calculator join the family meeting?", "Someone had to keep track of whose turn it was to do the dishes."], ["What did the ruler say at the school assembly?", "I’m here to measure up."], ["Why did the recorder hide in the toy box?", "It heard the class concert was today."], ["What did the eraser say after a long day?", "I’ve made so many mistakes disappear."], ["Why did the teacher bring a torch to class?", "She wanted to help everyone see the light at the end of the test."], ["Why was the school clock always in trouble?", "It kept tocking in class."], ["What did the glue say to the paper?", "I’m stuck on you."], ["Why did the scissors stay home from school?", "They were feeling a bit sharp."], ["What did one plate say to the other?", "Dinner’s on me tonight."], ["Why did the family bring a tent to the lounge?", "The kids wanted to camp near the snacks."], ["Why did Grandpa bring a deckchair to the supermarket?", "He knew the queue would be a while."], ["What did Grandma say when the cake fell?", "That’s the way the cookie crumbles — let’s have it with ice cream."], ["Why did the teenager bring a phone charger to breakfast?", "She didn’t want her energy to drop before school."], ["What did the remote control say to the family?", "Stop fighting over me — I can only change one channel at a time."], ["Why did the washing machine laugh?", "It heard the sock’s joke and couldn’t stop spinning."], ["Where do lost socks go on holiday?", "To the land of single feet."], ["Why did the bed refuse to be made on Saturday?", "It said weekends are for sleeping in."], ["What did the alarm clock say to the snooze button?", "We need to stop meeting like this."], ["Why did the dishwasher get a medal?", "For services to family peace."], ["What did the fridge say when the door was left open?", "Brrr-ing it back!"], ["Why did the vacuum cleaner feel important?", "It really picked up the place."], ["What did the broom say to the dustpan?", "We make a great team — you get everything I sweep."], ["Why did the lightbulb volunteer for the school play?", "It loved being in the spotlight."], ["What did the clock say to the family on Sunday?", "Take your time — I’ll wait."], ["Why did the umbrella go to school?", "It wanted to get a little cover-age."], ["What did the shoe say to the sock?", "I’ve got you covered from heel to toe."], ["Why did the kid bring a compass to school?", "To find the shortest way to morning tea."], ["Why did the boy tidy his room in record time?", "Mum said the ice cream was melting."], ["What did the sandwich say to the lunchbox?", "You complete me."], ["Why did the bike park itself in the shade?", "It didn’t want a flat — or a sunburn."], ["What did the roundabout say to the driver?", "Round and round we go — just pick an exit!"], ["Why was the road so tired?", "Cars had been running over it all day."], ["What did the car say to the petrol station?", "You fill me with joy."], ["Why did the computer need a cup of tea?", "It had too many tabs open."], ["What did the phone say to the charger?", "You’re my energy."], ["Why did the laptop take a holiday?", "It needed to reboot its attitude."], ["What did the spreadsheet say to the meeting?", "I’ve got cells full of ideas."], ["Why did the office chair spin around?", "It wanted to see who was behind it."], ["What did the printer say on Monday?", "Paper jam? I don’t want to talk about it."], ["Why did the email go to the beach?", "It needed some time out of the inbox."], ["Why was the stapler so popular?", "It always held people together."], ["What did the calendar say to the busy mum?", "Your days are numbered — and colour-coded."], ["Why did the paper clip apply for the job?", "It was great at holding things together."], ["What did the keyboard say to the coffee?", "Please don’t spill on my keys again."], ["Why was the boss so calm?", "She had a good handle on things — and a fresh coffee."], ["Why did the gardener talk to her tomatoes?", "They needed a little encouragement to ketchup."], ["What did the seed say to the gardener?", "Give me some time — I’m putting down roots."], ["Why did the tomato plant blush?", "It saw the zucchini growing next door."], ["What did the flower say to the bee?", "Buzz off — kidding, come on in!"], ["Why did the hose win the argument?", "It had a strong point of view."], ["What did the lawnmower say on Saturday?", "Not again!"], ["Why did the leaf go to the doctor?", "It was feeling a little green."], ["What did the tree say in spring?", "I’m turning over a new leaf."], ["Why did the sun come out after the rain?", "It wanted to dry everyone’s washing."], ["Why did the umbrella stay home on Sunday?", "The forecast said “fine, with a chance of brunch”."], ["Why was the cloud always calm?", "It had its head in the right place — the sky."], ["Why did the snowman ask for a fan?", "He was feeling a bit melty about the meeting."], ["Why did the rainbow get a medal?", "It always showed up after the hard times."], ["What did the thunder say to the lightning?", "You’re shocking!"], ["Why did the wind refuse to play cards?", "It kept blowing the deck away."], ["Why did the moon skip dinner?", "It was already full."], ["Why did the sunrise get applause?", "It always made an entrance."], ["What did the beach towel say to the sun?", "You’re hot today!"], ["Why did the family bring a map to dinner?", "They wanted to find the right fork."], ["What did the birthday candle say to the cake?", "We make a lit team."], ["Why did the present wear a bow?", "It wanted to look its best for the party."], ["Why did the balloon float to the ceiling at the party?", "It was rising above the drama."], ["Why did the party hat feel left out?", "Everyone else had their heads in the game."], ["What did the wrapping paper say at Christmas?", "I’m tired of being torn."], ["Why did the Christmas tree go to the barber?", "It needed a little trim."], ["Why did the reindeer visit New Zealand in December?", "To practise landing on jandals instead of snow."], ["Why did the Easter egg wear sunglasses?", "It didn’t want to be spotted before Sunday."], ["What did the pavlova say at Christmas lunch?", "I’m the reason you saved room."], ["Why did the stars come out early at Matariki?", "They didn’t want to miss the celebration."], ["Why did the choir sit near the window?", "They wanted to reach the high notes outside."], ["What did the church bell say to the clock?", "We both know how to keep people on time."], ["Why did the hymn book feel popular?", "Everyone kept singing its praises."], ["Why did the candle love Sunday?", "It got to shine in the quiet."], ["What did the prayer say to the busy day?", "Pause with me for a moment."], ["Why did the Bible go to the library?", "It wanted to visit its relatives — the other good books."], ["Why are church pews so patient?", "They’ve heard every sermon twice."], ["Why did the angel get a job at the café?", "She was heaven-sent with the coffee."], ["What did the friendly neighbour say?", "My door’s always open — and so is my biscuit tin."], ["Why did the community garden grow so fast?", "Everyone pitched in."], ["What did the volunteer say to the busy day?", "Bring it on — I came to help."], ["Why did the kind word win the race?", "It travelled faster than anything else."], ["What did the smile say to the frown?", "Turn that around — you’ll feel better."], ["Why did the hug become famous?", "It made everyone feel squeezed in."], ["What did the thank-you card say?", "You made someone’s day!"], ["Why was the friendship bracelet so strong?", "It was tied with a lot of good memories."], ["What did the board game say to the family?", "Let’s play nice this time."], ["Why did the jigsaw piece feel lost?", "It didn’t know where it fit — until the family helped."], ["What did the puzzle say when it was finished?", "I feel complete!"], ["Why was the library so tall?", "It had lots of stories."], ["What did the book say to the reader?", "You’ve really turned my page."], ["Why did the bookmark feel needed?", "It always kept people in their place."], ["What did the storybook say at bedtime?", "Just one more chapter… I promise."], ["Why did the dinosaur borrow a library book?", "It wanted to read about its family tree — the one it ate."], ["What do you call a dinosaur that never gives up?", "A try-ceratops."], ["Why did the robot go on holiday?", "It needed to recharge."], ["What did the astronaut say to the moon?", "I’ve been over the moon to meet you."], ["Why did the superhero do the dishes?", "Even heroes need to save the day — and the plates."], ["Why did the bubble bath feel proud?", "It made everyone squeaky clean."], ["What did the toothbrush say to the toothpaste?", "Squeeze me tight — I’m ready."], ["Why did the hairbrush go to school?", "It wanted to get to the root of things."], ["What did the pillow say at night?", "I’ve got your head covered."], ["Why did the blanket feel loved?", "Everyone wanted to snuggle with it."], ["Why did the teddy bear go to bed early?", "It had a big day of being hugged tomorrow."], ["Why did the dad joke cross the road?", "To get to the punchline — and an eye-roll."], ["Why are dad jokes like coffee?", "You groan at the first sip, then you’re smiling by the end."]]);
  var KIWI_CAFE = [
    ['Flat white', 'Espresso with a thin layer of velvety microfoam. A Kiwi café classic — ask for it “extra hot” if you like it steaming.'],
    ['Long black', 'Hot water first, then a double espresso poured on top so the crema stays. Bold and smooth.'],
    ['Fluffy', 'Frothed milk with a chocolate dusting and usually a marshmallow on the side. The kids’ café favourite — no coffee at all.'],
    ['Mochaccino', 'Espresso, chocolate and steamed milk. A sweet treat for a cold afternoon.'],
    ['“Trim” and “extra shot”', 'Trim means low-fat milk. An extra shot adds more espresso. Oat, almond and soy milk are on most café menus.'],
    ['How ordering works', 'Order and pay at the counter, take your table number and your food comes to you. Tipping isn’t expected.'],
    ['Cheese scones and slices', 'A warm cheese scone or a piece of caramel slice beside a flat white is a much-loved café combo.'],
    ['Road-trip stops', 'Coffee caravans, small-town bakeries and old tearooms make a cuppa part of almost every road trip.'],
    ['Bring your own cup', 'Many cafés happily fill reusable cups — and some take a little off the price.'],
    ['Weekend brunch', 'Eggs bene, smashed avo and a long queue on Sunday mornings — brunch is a Kiwi social sport.']
  ];
  var BREW = [
    ['Plunger (French press)', './expansion/coffee-photos-1.webp', '4 min', ['Add 2 heaped tablespoons of coarse coffee per cup.', 'Pour in water just off the boil and stir gently.', 'Put the lid on and wait 4 minutes.', 'Press the plunger down slowly and pour straight away.'], 'Pour it all out so it doesn’t keep brewing and turn bitter.'],
    ['Pour-over', './expansion/coffee-photos-2.webp', '3–4 min', ['Rinse a paper filter with hot water and tip the water out.', 'Add medium-ground coffee (about 15 g for a mug).', 'Pour a little water to wet the grounds and wait 30 seconds for the bloom.', 'Pour the rest slowly in small circles until you reach about 250 ml.'], 'A gooseneck kettle gives you more control, but any kettle works with a steady hand.'],
    ['Stovetop pot', './expansion/coffee-photos-3.webp', '5 min', ['Fill the bottom chamber with hot water up to the valve.', 'Fill the basket with fine coffee and level it — don’t press down.', 'Screw it together and heat on medium.', 'Take it off the heat as soon as it starts to gurgle.'], 'Cool the base under a cold tap to stop it tasting burnt.'],
    ['Espresso machine', './expansion/coffee-photos-0.webp', '30 sec', ['Grind fine and fill the basket (about 18 g for a double).', 'Tamp firmly and evenly.', 'Lock in and brew for about 25–30 seconds.', 'You’re aiming for about 36 g of espresso with golden crema.'], 'Too fast and sour? Grind finer. Too slow and bitter? Grind coarser.'],
    ['Flat white at home', './coffee-posts/coffee-01.webp', '3 min', ['Make a double espresso or very strong stovetop coffee.', 'Heat milk to about 60 °C (too hot to hold for long).', 'Froth just a little to make silky microfoam, then tap and swirl.', 'Pour from low and close so the foam stays thin.'], 'No frother? Shake warm milk in a jar with the lid on, then microwave 20 seconds.'],
    ['Cold brew', './coffee-posts/coffee-02.webp', '12–24 hr', ['Mix 1 cup of coarse coffee with 4 cups of cold water.', 'Cover and leave in the fridge overnight.', 'Strain through a sieve and paper filter.', 'Serve over ice, diluted with water or milk to taste.'], 'Keeps in the fridge for about a week — perfect for summer.'],
    ['Iced latte', './coffee-posts/coffee-03.webp', '2 min', ['Fill a glass with ice.', 'Pour in cold milk, leaving room at the top.', 'Pour a double espresso or strong coffee over the top.', 'Stir, sweeten if you like and enjoy.'], 'Freeze leftover coffee in ice-cube trays so your drink never gets watery.']
  ];
  var CPICS = ['./coffee-posts/coffee-01.webp', './coffee-posts/coffee-02.webp', './coffee-posts/coffee-03.webp', './expansion/coffee-photos-0.webp', './expansion/coffee-photos-1.webp', './expansion/coffee-photos-2.webp', './expansion/coffee-photos-3.webp'];
  function rndi(n, not) { var x = Math.floor(Math.random() * n); if (n > 1 && x === not) x = (x + 1) % n; return x; }
  function SeeAll(props) {
    var o = useState(false), open = o[0], setOpen = o[1], nn = useState(40), shown = nn[0], setShown = nn[1];
    return h('div', { className: 'jx-cs-all' },
      h('button', { type: 'button', className: 'secondary', 'aria-expanded': open, onClick: function () { setOpen(!open); setShown(40); } }, open ? 'Hide the list' : '📜 See all ' + props.items.length),
      open && h('ul', { className: 'jx-lift-list' }, props.items.slice(0, shown).map(function (x, i) {
        return h('li', { key: i }, h('span', null, props.render(x)), h('span', { className: 'jx-lift-li-tools' }, h(JNZX.ShareMini, { title: props.title, text: props.share(x), label: 'Share', bg: props.bg })));
      })),
      open && shown < props.items.length && h('button', { type: 'button', className: 'secondary', onClick: function () { setShown(shown + 40); } }, 'Show more (' + (props.items.length - shown) + ' left)'));
  }
  var CTABS = [['quote', '☕ Quotes'], ['fact', '💡 Facts'], ['joke', '😄 Jokes'], ['brew', '🫖 How to brew'], ['kiwi', '🥝 Kiwi café']];
  function CoffeeSmile() {
    var t = JNZX.useStored('jnzx-coffee-tab', 'quote'), tab = t[0], setTab = t[1];
    var qi = useState(function () { return rndi(CQ.length); }), fi = useState(function () { return rndi(CF.length); }), ji = useState(function () { return rndi(CJ.length); }), ki = useState(0), bi = useState(-1), pun = useState(false);
    var q = CQ[qi[0]], f = CF[fi[0]], j = CJ[ji[0]], k = KIWI_CAFE[ki[0] % KIWI_CAFE.length];
    var body;
    if (tab === 'quote') body = h('div', null,
      h('div', { className: 'jx-cs-photo' }, h(PhotoCard, { text: '“' + q + '”', credit: 'Coffee & a Smile · The James NZ', background: jAsset(CPICS[qi[0] % CPICS.length]), filename: 'TheJamesNZ-coffee-smile', kind: 'coffee' })),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { qi[1](rndi(CQ.length, qi[0])); } }, '🔄 Another quote')),
      h(SeeAll, { items: CQ, title: 'Coffee & a Smile', render: function (x) { return x; }, share: function (x) { return '“' + x + '” — The James NZ'; } }));
    else if (tab === 'fact') body = h('div', null,
      h('div', { className: 'jx-cs-card jx-keep-colour' }, h('small', null, 'DID YOU KNOW? · ' + (fi[0] + 1) + ' OF ' + CF.length), h('h3', null, f[0]), h('p', null, f[1])),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { fi[1](rndi(CF.length, fi[0])); } }, '🔄 Another fact'), h(JNZX.ShareMini, { title: 'Coffee fact', text: 'Did you know? ' + f[0] + ': ' + f[1], label: 'Share' })),
      h(SeeAll, { items: CF, title: 'Coffee fact', render: function (x) { return h(R.Fragment, null, h('strong', null, x[0] + '. '), x[1]); }, share: function (x) { return 'Did you know? ' + x[0] + ': ' + x[1]; } }));
    else if (tab === 'joke') body = h('div', null,
      h('div', { className: 'jx-cs-card jx-cs-joke jx-keep-colour' }, h('small', null, 'JOKE ' + (ji[0] + 1) + ' OF ' + CJ.length), h('h3', null, j[0]), pun[0] ? h('p', { className: 'jx-cs-pun' }, j[1]) : h('button', { type: 'button', className: 'secondary', onClick: function () { pun[1](true); } }, 'Show the punchline ☕')),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { ji[1](rndi(CJ.length, ji[0])); pun[1](false); } }, '🔄 Another joke'), h(JNZX.ShareMini, { title: 'A smile from The James NZ', text: j[0] + '\n' + j[1] + ' 😄', label: 'Share this joke', bg: jAsset(CPICS[ji[0] % CPICS.length]) })),
      h(SeeAll, { items: CJ, bg: jAsset(CPICS[0]), title: 'A smile from The James NZ', render: function (x) { return h(R.Fragment, null, h('strong', null, x[0] + ' '), x[1]); }, share: function (x) { return x[0] + '\n' + x[1] + ' 😄'; } }));
    else if (tab === 'brew') { var B = bi[0] >= 0 ? BREW[bi[0]] : null; body = B ? h('div', { className: 'jx-cs-brew' },
      h('button', { type: 'button', className: 'secondary', onClick: function () { bi[1](-1); } }, '← All brew guides'),
      h('img', { src: jAsset(B[1]), alt: B[0], className: 'jx-cs-brew-img' }),
      h('h3', null, B[0], ' ', h('small', null, '· ' + B[2])),
      h('ol', null, B[3].map(function (s, i) { return h('li', { key: i }, s); })),
      h('p', { className: 'jx-cs-tip' }, '💡 ' + B[4]),
      h(JNZX.ShareMini, { title: B[0] + ' — brew guide', text: B[0] + ' (' + B[2] + '):\n' + B[3].map(function (s, i) { return (i + 1) + '. ' + s; }).join('\n') + '\nTip: ' + B[4], label: 'Share this guide' }))
      : h('div', { className: 'jx-cs-tiles' }, BREW.map(function (x, i) { return h('button', { key: i, type: 'button', className: 'jx-cs-tile', onClick: function () { bi[1](i); } }, h('img', { src: jAsset(x[1]), alt: '' }), h('strong', null, x[0]), h('small', null, x[2])); })); }
    else body = h('div', null,
      h('div', { className: 'jx-cs-card jx-keep-colour' }, h('small', null, 'KIWI CAFÉ CULTURE · ' + ((ki[0] % KIWI_CAFE.length) + 1) + ' OF ' + KIWI_CAFE.length), h('h3', null, k[0]), h('p', null, k[1])),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { ki[1](ki[0] + 1); } }, '🔄 Next'), h(JNZX.ShareMini, { title: 'Kiwi café culture', text: k[0] + ': ' + k[1], label: 'Share' })),
      h(SeeAll, { items: KIWI_CAFE, title: 'Kiwi café culture', render: function (x) { return h(R.Fragment, null, h('strong', null, x[0] + '. '), x[1]); }, share: function (x) { return x[0] + ': ' + x[1]; } }));
    return h('div', { className: 'jx-page jx-coffee jx-cs' },
      JNZX.Header('EVERYDAY JOY · COFFEE & A SMILE', 'Coffee & a smile.', 'Pick one, enjoy it, share it. All written for The James NZ.'),
      h('div', { className: 'jx-cs-tabs', role: 'tablist', 'aria-label': 'Coffee & a Smile' }, CTABS.map(function (x) {
        return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': tab === x[0], className: tab === x[0] ? 'is-on' : '', onClick: function () { setTab(x[0]); bi[1](-1); } }, x[1]);
      })),
      h('div', { className: 'jx-cs-body', role: 'tabpanel' }, body),
      h('p', { className: 'small-note' }, 'Enjoy coffee in moderation. A fluffy is a great café treat for little ones.'),
      h(JNZX.ShareBar, { tab: 'Coffee corner' }));
  }
  try { CoffeeCorner = CoffeeSmile; } catch (e) { console.warn('[JNZX] coffee', e); }

  /* ---------------- Water Intake ---------------- */
  var DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var MOODS = [['😄', 'Great'], ['🙂', 'Good'], ['😐', 'Okay'], ['😕', 'Low'], ['😫', 'Rough']];
  var TAGS = ['Hot day', 'Exercise', 'Headache', 'Tired', 'Focused', 'Busy day', 'Lots of coffee', 'Felt great'];
  var IDEAS = ['Add a slice of lemon, orange or cucumber', 'Drop in frozen berries as ice cubes', 'Fill a bottle at night and keep it by the bed', 'Have a glass with every meal', 'Keep a jug of water in the fridge with mint leaves', 'Drink a glass when you brush your teeth', 'Set a glass at each family member’s place at dinner', 'Swap one fizzy drink for sparkling water'];
  function iso(d) { return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10); }
  function todayISO() { return new Date().toLocaleDateString('en-CA', { timeZone: 'Pacific/Auckland' }); }
  function parse(s) { var p = s.split('-'); return new Date(+p[0], +p[1] - 1, +p[2]); }
  function monday(s) { var d = parse(s), w = (d.getDay() + 6) % 7; d.setDate(d.getDate() - w); return d; }
  function addD(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function loadJSON(k, f) { try { var v = JSON.parse(localStorage.getItem(k)); return v == null ? f : v; } catch (e) { return f; } }
  function saveJSON(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) {} }
  function Drop(props) {
    return h('button', { type: 'button', className: 'jx-drop' + (props.on ? ' is-on' : ''), style: { '--wc': props.colour }, 'aria-label': props.label, 'aria-pressed': !!props.on, onClick: props.onClick },
      h('svg', { viewBox: '0 0 24 32', 'aria-hidden': true }, h('path', { d: 'M12 2 C12 2 3 14 3 20 a9 9 0 0 0 18 0 C21 14 12 2 12 2 Z' })));
  }
  function Glass(props) {
    var pct = Math.max(0, Math.min(1, props.pct)), y = 150 - pct * 130;
    return h('svg', { viewBox: '0 0 120 170', className: 'jx-glass', role: 'img', 'aria-label': Math.round(pct * 100) + '% of today’s goal' },
      h('defs', null, h('clipPath', { id: 'jx-glass-clip' }, h('path', { d: 'M15 12 L105 12 L94 158 Q93 164 86 164 L34 164 Q27 164 26 158 Z' }))),
      h('g', { clipPath: 'url(#jx-glass-clip)' },
        h('rect', { x: 0, y: 0, width: 120, height: 170, fill: 'rgba(120,170,200,.10)' }),
        h('g', { className: 'jx-wave', style: { transform: 'translateY(' + y + 'px)' } },
          h('path', { d: 'M-120 6 Q-90 -4 -60 6 T0 6 T60 6 T120 6 T180 6 T240 6 V200 H-120 Z', fill: props.colour, opacity: 0.85, className: 'jx-wave-a' }),
          h('path', { d: 'M-120 10 Q-90 2 -60 10 T0 10 T60 10 T120 10 T180 10 T240 10 V200 H-120 Z', fill: props.colour, opacity: 0.55, className: 'jx-wave-b' }))),
      h('path', { d: 'M15 12 L105 12 L94 158 Q93 164 86 164 L34 164 Q27 164 26 158 Z', fill: 'none', stroke: 'currentColor', strokeWidth: 3, opacity: 0.5 }),
      h('text', { x: 60, y: 95, textAnchor: 'middle', className: 'jx-glass-pct' }, Math.round(pct * 100) + '%'));
  }
  function drawWeek(c, wk, rec, prefs, t) {
    var W = 1240, H = 1600, g = c.getContext('2d'), n = Math.max(4, Math.min(12, Math.round(prefs.goal / prefs.cup)));
    c.width = W; c.height = H;
    g.fillStyle = t.bg; g.fillRect(0, 0, W, H);
    g.strokeStyle = t.accent; g.lineWidth = 18; g.strokeRect(30, 30, W - 60, H - 60);
    g.textAlign = 'center'; g.fillStyle = t.ink; g.font = 'bold 110px Arial, sans-serif'; g.fillText('WATER TRACKER', W / 2, 190);
    g.fillStyle = t.accent; g.font = 'bold 30px Arial, sans-serif'; g.fillText('FILL IN A DROP FOR EACH GLASS YOU DRINK', W / 2, 260);
    g.fillStyle = t.ink; g.font = 'bold 28px Arial, sans-serif'; g.fillText(('GOAL: ' + n + ' GLASSES A DAY · WEEK OF ' + wk[0].toLocaleDateString('en-NZ', { day: 'numeric', month: 'long' })).toUpperCase(), W / 2, 315);
    var rowH = 150, top = 420, dropW = Math.min(70, (W - 600) / n);
    DAYS.forEach(function (d, i) {
      var y = top + i * rowH, key = iso(wk[i]), cnt = Math.min(n, Math.round(((rec[key] || []).reduce(function (a, b) { return a + b; }, 0)) / prefs.cup));
      g.textAlign = 'left'; g.fillStyle = i % 2 ? t.accent : t.ink; g.font = 'bold 52px Arial, sans-serif'; g.fillText(d.toUpperCase(), 80, y + 20);
      for (var k = 0; k < n; k++) {
        var x = 530 + k * dropW + dropW / 2, s = dropW / 24 * 0.95;
        g.save(); g.translate(x - 12 * s, y - 34); g.scale(s, s);
        var p = new Path2D('M12 2 C12 2 3 14 3 20 a9 9 0 0 0 18 0 C21 14 12 2 12 2 Z');
        if (k < cnt) { g.fillStyle = t.accent; g.fill(p); }
        g.lineWidth = 1.4; g.strokeStyle = t.ink; g.stroke(p); g.restore();
      }
    });
    g.textAlign = 'center'; g.fillStyle = t.ink; g.font = '26px Arial, sans-serif'; g.fillText((prefs.name ? prefs.name + ' · ' : '') + 'Water Intake · The James NZ · www.thejamesnz.com', W / 2, H - 80);
  }
  function WaterIntake() {
    var rs = useState(function () { return jWaterLoad(); }), rec = rs[0], setRec = rs[1];
    var ps = useState(function () { return jWaterPrefs(); }), prefs = ps[0], setPrefs = ps[1];
    var jn = useState(function () { return loadJSON('jnzx-water-journal', {}); }), journal = jn[0], setJournal = jn[1];
    var th = JNZX.useStored('jnzx-water-theme', { id: 'ocean' }), theme = th[0], setTheme = th[1];
    var ds = useState(todayISO()), date = ds[0], setDate = ds[1];
    var cs = useState(''), custom = cs[0], setCustom = cs[1];
    var tb = useState('today'), tab = tb[0], setTab = tb[1];
    var cel = useState(false), party = cel[0], setParty = cel[1];
    useEffect(function () { saveJSON('james-water-v2', rec); }, [rec]);
    useEffect(function () { saveJSON('james-water-prefs', prefs); }, [prefs]);
    useEffect(function () { saveJSON('jnzx-water-journal', journal); }, [journal]);
    var entries = rec[date] || [], total = entries.reduce(function (a, b) { return a + b; }, 0), goal = prefs.goal, cup = prefs.cup, colour = prefs.colour;
    var n = Math.max(4, Math.min(12, Math.round(goal / cup))), glasses = Math.round(total / cup);
    function setDay(list) { var o = Object.assign({}, rec); if (list.length) o[date] = list; else delete o[date]; setRec(o); var tot = list.reduce(function (a, b) { return a + b; }, 0); if (total < goal && tot >= goal) { setParty(true); setTimeout(function () { setParty(false); }, 3200); } }
    function add(ml) { ml = Math.round(ml); if (ml > 0 && ml <= 1000) setDay(entries.concat([ml])); }
    function setGlasses(k) { var list = []; for (var i = 0; i < k; i++) list.push(cup); setDay(list); }
    // streaks
    var streak = 0; for (var i = 0; i < 400; i++) { var k = iso(addD(parse(todayISO()), -i)), tt = (rec[k] || []).reduce(function (a, b) { return a + b; }, 0); if (tt >= goal) streak++; else if (i > 0) break; }
    var goalsMet = Object.keys(rec).filter(function (k) { return rec[k].reduce(function (a, b) { return a + b; }, 0) >= goal; }).length;
    var BADGES = [['💧', 'First sip', Object.keys(rec).length > 0], ['🎯', 'First goal', goalsMet >= 1], ['🔥', '3-day streak', streak >= 3], ['🌊', '7-day streak', streak >= 7], ['🏅', '10 goals met', goalsMet >= 10], ['🏆', '30-day streak', streak >= 30]];
    var wk = useMemo(function () { var m = monday(date); return DAYS.map(function (_, i) { return addD(m, i); }); }, [date]);
    var t = JNZX.poster ? JNZX.poster.themeOf(theme) : { bg: '#fff', ink: '#1f2a44', accent: '#2f8fc9' };
    var ref = useRef(null);
    useEffect(function () { if (ref.current) drawWeek(ref.current, wk, rec, prefs, t); }, [tab, JSON.stringify(rec), JSON.stringify(prefs), JSON.stringify(theme), date]);
    var J = journal[date] || { mood: '', energy: 3, note: '', tags: [] };
    function setJ(o) { var x = Object.assign({}, journal); x[date] = Object.assign({}, J, o); setJournal(x); }
    var jdates = Object.keys(journal).filter(function (k) { var e = journal[k]; return e && (e.mood || e.note || (e.tags && e.tags.length)); }).sort().reverse();
    function exportJournal() {
      var txt = 'My water journal — The James NZ\n\n' + jdates.map(function (k) { var e = journal[k], tt = (rec[k] || []).reduce(function (a, b) { return a + b; }, 0); return k + ' · ' + tt + ' ml' + (e.mood ? ' · ' + e.mood : '') + ' · energy ' + e.energy + '/5' + (e.tags && e.tags.length ? ' · ' + e.tags.join(', ') : '') + (e.note ? '\n' + e.note : ''); }).join('\n\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([txt], { type: 'text/plain' })); a.download = 'my-water-journal.txt'; document.body.appendChild(a); a.click(); setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 1500);
    }
    var tabs = [['today', '💧 Today'], ['week', '📅 This week'], ['journal', '📓 Journal'], ['tips', '💡 Ideas & settings']];
    return h('div', { className: 'jx-page jx-water', style: { '--wc': colour } },
      JNZX.Header('EVERYDAY JOY · PERSONAL IMPROVEMENT', 'Water intake.', 'Fill a drop for each glass, watch your glass fill up, keep your streak going and jot down how you feel in your water journal.'),
      h('div', { className: 'jx-tablist', role: 'tablist' }, tabs.map(function (x) { return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': tab === x[0], className: 'jx-tab' + (tab === x[0] ? ' is-on' : ''), onClick: function () { setTab(x[0]); } }, x[1]); })),
      h('div', { className: 'jx-row jx-form' }, h('label', null, 'Day', h('input', { type: 'date', value: date, max: todayISO(), onChange: function (e) { if (e.target.value) setDate(e.target.value); } })), date !== todayISO() && h('button', { type: 'button', className: 'secondary', onClick: function () { setDate(todayISO()); } }, 'Back to today')),
      tab === 'today' && h('div', { className: 'jx-water-today' },
        h('div', { className: 'jx-card jx-water-glass jx-keep-colour' }, h(Glass, { pct: total / goal, colour: colour }),
          h('p', { className: 'jx-big' }, total.toLocaleString('en-NZ') + ' ml'), h('p', { className: 'jx-muted' }, 'of ' + goal.toLocaleString('en-NZ') + ' ml · ' + glasses + ' of ' + n + ' glasses'),
          party && h('p', { className: 'jx-party', role: 'status' }, '🎉 Ka pai! Goal reached!')),
        h('div', null,
          h('h2', null, 'Tap a drop for each glass'),
          h('div', { className: 'jx-drops' }, Array.from({ length: n }, function (_, k) { return h(Drop, { key: k, on: k < glasses, colour: colour, label: 'Glass ' + (k + 1), onClick: function () { setGlasses(k < glasses && k === glasses - 1 ? k : k + 1); } }); })),
          h('div', { className: 'jx-row' },
            h('button', { type: 'button', className: 'primary', onClick: function () { add(cup); } }, '+ Glass (' + cup + ' ml)'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { add(500); } }, '+ Bottle (500 ml)'),
            h('button', { type: 'button', className: 'secondary', onClick: function () { add(150); } }, '+ Small cup (150 ml)'),
            h('button', { type: 'button', className: 'secondary', disabled: !entries.length, onClick: function () { setDay(entries.slice(0, -1)); } }, '↶ Undo')),
          h('form', { className: 'jx-row jx-form', onSubmit: function (e) { e.preventDefault(); add(+custom); setCustom(''); } }, h('label', null, 'Other amount (ml)', h('input', { type: 'number', min: 10, max: 1000, value: custom, style: { width: '8em' }, onChange: function (e) { setCustom(e.target.value); } })), h('button', { type: 'submit', className: 'secondary' }, 'Add')),
          h('div', { className: 'jx-stats' },
            h('div', { className: 'jx-stat' }, h('span', null, 'Current streak'), h('strong', null, '🔥 ' + streak + ' day' + (streak === 1 ? '' : 's'))),
            h('div', { className: 'jx-stat' }, h('span', null, 'Goals met'), h('strong', null, '🎯 ' + goalsMet))),
          h('h3', null, 'Badges'),
          h('div', { className: 'jx-badges' }, BADGES.map(function (b) { return h('span', { key: b[1], className: 'jx-badge' + (b[2] ? ' is-on' : '') }, h('span', { 'aria-hidden': true }, b[0]), b[1]); })))),
      tab === 'week' && h('div', null,
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setDate(iso(addD(wk[0], -7))); } }, '← Last week'), h('strong', null, 'Week of ' + wk[0].toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' })), h('button', { type: 'button', className: 'secondary', disabled: iso(addD(wk[0], 7)) > todayISO(), onClick: function () { setDate(iso(addD(wk[0], 7))); } }, 'Next week →')),
        h('div', { className: 'jx-week' }, wk.map(function (d, i) {
          var key = iso(d), cnt = Math.round(((rec[key] || []).reduce(function (a, b) { return a + b; }, 0)) / cup), future = key > todayISO();
          return h('div', { key: key, className: 'jx-week-row' + (key === date ? ' is-sel' : '') },
            h('button', { type: 'button', className: 'jx-week-day', onClick: function () { setDate(key); setTab('today'); } }, DAYS[i], h('small', null, d.getDate() + '/' + (d.getMonth() + 1))),
            h('div', { className: 'jx-drops' }, Array.from({ length: n }, function (_, k) { return h(Drop, { key: k, on: k < cnt, colour: colour, label: DAYS[i] + ' glass ' + (k + 1), onClick: function () { if (future) return; var o = Object.assign({}, rec), list = []; var target = k < cnt && k === cnt - 1 ? k : k + 1; for (var z = 0; z < target; z++) list.push(cup); if (list.length) o[key] = list; else delete o[key]; setRec(o); } }); })));
        })),
        h('h2', null, 'Printable weekly tracker'),
        JNZX.poster && h(JNZX.poster.ThemePicker, { value: theme, onChange: setTheme }),
        h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Weekly water tracker poster' })),
        JNZX.poster && h(JNZX.poster.ExportBar, { canvasRef: ref, name: 'TheJamesNZ-water-tracker', title: 'Water tracker' })),
      tab === 'journal' && h('div', null,
        h('div', { className: 'jx-card' },
          h('h2', null, 'How did you feel today?'),
          h('div', { className: 'jx-chips' }, MOODS.map(function (m) { return h('button', { key: m[1], type: 'button', className: 'jx-chip jx-mood' + (J.mood === m[0] + ' ' + m[1] ? ' is-on' : ''), onClick: function () { setJ({ mood: m[0] + ' ' + m[1] }); } }, m[0] + ' ' + m[1]); })),
          h('label', { className: 'jx-block' }, 'Energy: ' + J.energy + ' / 5', h('input', { type: 'range', min: 1, max: 5, value: J.energy, onChange: function (e) { setJ({ energy: +e.target.value }); } })),
          h('div', { className: 'jx-chips' }, TAGS.map(function (tg) { var on = (J.tags || []).indexOf(tg) >= 0; return h('button', { key: tg, type: 'button', className: 'jx-chip' + (on ? ' is-on' : ''), onClick: function () { setJ({ tags: on ? J.tags.filter(function (x) { return x !== tg; }) : (J.tags || []).concat([tg]) }); } }, tg); })),
          h('label', { className: 'jx-block' }, 'Notes', h('textarea', { rows: 4, value: J.note, placeholder: 'e.g. Drank more after my walk — fewer afternoon headaches.', onChange: function (e) { setJ({ note: e.target.value }); } })),
          h('p', { className: 'jx-muted' }, 'Water today: ' + total + ' ml. Your journal is saved on this device only.')),
        h('h2', null, 'Past entries'),
        !jdates.length && h('p', { className: 'jx-muted' }, 'No entries yet. Your notes will appear here.'),
        h('div', { className: 'jx-journal' }, jdates.slice(0, 30).map(function (k) { var e = journal[k], tt = (rec[k] || []).reduce(function (a, b) { return a + b; }, 0); return h('article', { key: k, className: 'jx-card' }, h('p', { className: 'eyebrow' }, parse(k).toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()), h('p', null, h('strong', null, (e.mood || '') + ' · ' + tt + ' ml · energy ' + e.energy + '/5')), e.tags && e.tags.length > 0 && h('p', { className: 'jx-muted' }, e.tags.join(' · ')), e.note && h('p', null, e.note)); })),
        jdates.length > 0 && h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: exportJournal }, 'Download my journal'))),
      tab === 'tips' && h('div', null,
        h('h2', null, 'Ideas to drink more water'),
        h('div', { className: 'jx-cards3' }, IDEAS.map(function (x) { return h('div', { key: x, className: 'jx-card' }, h('p', null, '💧 ' + x)); })),
        h('h2', null, 'My settings'),
        h('div', { className: 'jx-row jx-form' },
          h('label', null, 'Name (optional)', h('input', { value: prefs.name, maxLength: 32, onChange: function (e) { setPrefs(Object.assign({}, prefs, { name: e.target.value })); } })),
          h('label', null, 'Daily goal (ml)', h('input', { type: 'number', min: 500, max: 5000, step: 50, value: goal, style: { width: '8em' }, onChange: function (e) { var v = Math.min(5000, Math.max(500, +e.target.value || 2000)); setPrefs(Object.assign({}, prefs, { goal: v })); } })),
          h('label', null, 'Glass size (ml)', h('input', { type: 'number', min: 50, max: 1000, step: 10, value: cup, style: { width: '8em' }, onChange: function (e) { var v = Math.min(1000, Math.max(50, +e.target.value || 250)); setPrefs(Object.assign({}, prefs, { cup: v })); } })),
          h('label', { className: 'jx-colour' }, h('input', { type: 'color', value: colour, onChange: function (e) { setPrefs(Object.assign({}, prefs, { colour: e.target.value })); } }), 'Drop colour')),
        h('div', { className: 'jx-note' }, 'How much water you need depends on your age, size, activity, the weather and your health. Thirst and pale-yellow urine are good everyday guides. Drink more on hot days and when exercising, and check with your doctor or midwife if you have a health condition, are pregnant or breastfeeding.')),
      h(JNZX.ShareBar, { tab: 'Water tracker', text: 'I’m tracking my water with The James NZ' + (streak > 1 ? ' — ' + streak + '-day streak!' : '.') }));
  }
  try { WaterTracker = WaterIntake; } catch (e) { console.warn('[JNZX] water', e); }
})();

/* Kiwi Adventures › Fresh Picks Today: witty quotes and a shareable picture */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useRef = R.useRef;
  var WIT = {
    'Peaches': 'Life’s a peach — enjoy every juicy bite.', 'Nectarines': 'A nectarine is just a peach that skipped the fuzz.', 'Apricots': 'Apricots: little suns you can eat.',
    'Plums': 'Plum-believably good.', 'Strawberries': 'Berry happy days start here.', 'Blueberries': 'Feeling blue? Grab a handful of blueberries.',
    'Courgettes': 'Plant one courgette, feed the whole street.', 'Tomatoes': 'Knowledge is knowing a tomato is a fruit. Wisdom is not putting it in a fruit salad.', 'Sweetcorn': 'Summer on a cob — simply a-maize-ing.',
    'Cucumber': 'Stay cool as a cucumber.', 'Capsicum': 'Red, orange or green — nature’s own traffic lights.', 'Green beans': 'Full of beans and ready for the day!',
    'Apples': 'An apple a day keeps the doctor away.', 'Pears': 'The perfect pear for any lunchbox.', 'Feijoas': 'Feijoa season: when Kiwis leave mystery bags on the neighbours’ doorstep.',
    'Kiwifruit': 'Small, fuzzy and full of goodness — a true Kiwi.', 'Persimmons': 'Persimmons: autumn’s sweetest little secret.', 'Grapes': 'Grape things come in bunches.',
    'Pumpkin': 'Soup weather? You gourd-n’t ask for better.', 'Kūmara': 'Every roast is better with a bit of kūmara.', 'Broccoli': 'Tiny trees for growing tall.',
    'Carrots': 'Carrots won’t give you night vision — but they will brighten your plate.', 'Beetroot': 'Simply unbeetable colour.', 'Cauliflower': 'Cauliflower: broccoli’s clever cousin.',
    'Mandarins': 'Easy-peel winter sunshine.', 'Oranges': 'Orange you glad it’s citrus season?', 'Lemons': 'When life gives you lemons, make lemonade.',
    'Leeks': 'Leek-ing with flavour.', 'Cabbage': 'One cabbage, a whole week of crunch.', 'Silverbeet': 'The garden gift that keeps on giving.',
    'Brussels sprouts': 'Love them or not, they’re tiny cabbages full of goodness.', 'Grapefruit': 'A zesty wake-up call.', 'Avocados': 'Holy guacamole — avocados are in!',
    'Asparagus': 'Spring has sprung, and so has the asparagus.', 'Radishes': 'Small, crunchy and totally rad.', 'Lettuce': 'Lettuce celebrate salad season!',
    'Spinach': 'Little leaves, big strength.', 'Spring onions': 'The finishing touch on every dish.'
  };
  var GENERIC = ['Eat a rainbow every day.', 'Fresh from the garden, straight to your heart.', 'Good food is good mood.', 'In season, on the plate, money in your pocket.'];
  function wit(n) { return WIT[n] || GENERIC[n.length % GENERIC.length]; }
  function todayPicks() {
    var date = (typeof nzDate === 'function' ? nzDate() : new Date().toISOString().slice(0, 10)), m = Number(date.slice(5, 7)), season = m === 12 || m <= 2 ? 'Summer' : m <= 5 ? 'Autumn' : m <= 8 ? 'Winter' : 'Spring', data = seasons[season], off = Number(date.slice(8)) % 6;
    var fr = [0, 1, 2].map(function (i) { return data.fruit[(off + i) % 6]; }), vg = [0, 1, 2].map(function (i) { return data.vege[(off + i) % 6]; });
    return { season: season, date: date, fruit: fr, vege: vg, all: fr.concat(vg) };
  }
  function drawPicks(c, p, quoteIdx, sheet) {
    var W = 1080, H = 1350, g = c.getContext('2d'); c.width = W; c.height = H;
    g.fillStyle = '#fbf6ec'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#2f6b3a'; g.fillRect(0, 0, W, 190);
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.font = 'bold 64px Georgia, serif'; g.fillText('Today’s fresh picks', W / 2, 105);
    g.font = '30px Arial, sans-serif'; g.fillText(p.season + ' in Aotearoa · ' + new Date(p.date + 'T12:00:00').toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }), W / 2, 155);
    var tile = 300, gap = 30, x0 = (W - 3 * tile - 2 * gap) / 2;
    p.all.forEach(function (n, i) {
      var x = x0 + (i % 3) * (tile + gap), y = 230 + Math.floor(i / 3) * (tile + 80), idx = uProduceNames.indexOf(n);
      g.fillStyle = '#fff'; g.beginPath(); g.roundRect ? g.roundRect(x, y, tile, tile, 24) : g.rect(x, y, tile, tile); g.fill();
      if (sheet && idx >= 0) { var sw = sheet.width / 8, sh = sheet.height / 5; g.save(); g.beginPath(); g.roundRect ? g.roundRect(x, y, tile, tile, 24) : g.rect(x, y, tile, tile); g.clip(); g.drawImage(sheet, (idx % 8) * sw, Math.floor(idx / 8) * sh, sw, sh, x, y, tile, tile); g.restore(); }
      g.fillStyle = '#2b2622'; g.font = 'bold 30px Arial, sans-serif'; g.fillText(n, x + tile / 2, y + tile + 44);
    });
    var q = wit(p.all[quoteIdx % p.all.length]);
    g.fillStyle = '#2f6b3a'; g.font = 'italic 44px Georgia, serif';
    var words = q.split(' '), lines = [], cur = ''; words.forEach(function (w) { var t = cur ? cur + ' ' + w : w; if (g.measureText(t).width > W - 160 && cur) { lines.push(cur); cur = w; } else cur = t; }); lines.push(cur);
    var y0 = 1050 - (lines.length - 1) * 28; lines.forEach(function (l, i) { g.fillText((i === 0 ? '“' : '') + l + (i === lines.length - 1 ? '”' : ''), W / 2, y0 + i * 58); });
    g.fillStyle = '#6b5f55'; g.font = '26px Arial, sans-serif'; g.fillText('Fresh Picks Today · The James NZ · www.thejamesnz.com', W / 2, H - 50);
  }
  function PicksShare() {
    var p = todayPicks(), qi = useState(0), qIdx = qi[0], setQ = qi[1], ref = useRef(null), sh = useState(null), sheet = sh[0], setSheet = sh[1];
    useEffect(function () { var im = new Image(); im.onload = function () { setSheet(im); }; im.src = jAsset('./oct13/produce-sheet.png'); }, []);
    useEffect(function () { if (ref.current) drawPicks(ref.current, p, qIdx, sheet); }, [qIdx, sheet, p.date]);
    var name = p.all[qIdx % p.all.length];
    return h('section', { className: 'jx-page jx-picks-share' },
      h('div', { className: 'jx-card jx-picks-quote' }, h('p', { className: 'eyebrow' }, 'TODAY’S WITTY PICK · ' + name.toUpperCase()), h('p', { className: 'jx-picks-q' }, '“' + wit(name) + '”'),
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setQ(qIdx + 1); } }, '🔄 Another quote'), h(JNZX.ShareMini, { title: 'Fresh Picks Today', text: 'Today’s fresh picks: ' + p.all.join(', ') + '.\n“' + wit(name) + '”' }))),
      h('h2', null, 'Share today’s picks'),
      h('div', { className: 'jx-poster-preview jx-keep-colour' }, h('canvas', { ref: ref, 'aria-label': 'Fresh picks picture' })),
      JNZX.poster && h(JNZX.poster.ExportBar, { canvasRef: ref, name: 'TheJamesNZ-fresh-picks', title: 'Today’s fresh picks', text: '“' + wit(name) + '” — today’s fresh picks from The James NZ' }));
  }
  try {
    var baseCard = uProducePhoto;
    uProducePhoto = function (props) { return h('div', { className: 'jx-produce-wrap' }, h(baseCard, props), h('p', { className: 'jx-produce-wit' }, wit(props.name)), h('div', { className: 'jx-produce-share' }, h(JNZX.ShareMini, { title: props.name + ' · Fresh Picks Today', text: '🥝 Fresh pick today: ' + props.name + ' — “' + wit(props.name) + '” #FreshPicksNZ', label: 'Share' })) ); };
    var baseSP = SeasonalProduce;
    SeasonalProduce = function FreshPicks() { return h(R.Fragment, null, h(baseSP), h(PicksShare)); };
    JNZX.ownShare['Today’s fruit & vege picks'] = 0;
  } catch (e) { console.warn('[JNZX] picks', e); }
})();
