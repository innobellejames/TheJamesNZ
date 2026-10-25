/* The James NZ — Family Together: DIY home projects, school holiday fun and
   family celebrations (Advent & Christmas, Lent, Holy Week, Easter, Matariki). */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useMemo = R.useMemo;

  function list(items, ordered) { return h(ordered ? 'ol' : 'ul', null, items.map(function (x, i) { return h('li', { key: i }, x); })); }

  /* ================= DIY HOME PROJECTS ================= */
  // [id, title, area, level, time, cost, tools, materials, steps, safety, kids]
  var DIY = [
    ['tap-washer', 'Fix a dripping tap (replace the washer)', 'Kitchen & bathroom', 'Beginner', '30–45 min', '$',
      ['Adjustable spanner', 'Flat and Phillips screwdrivers', 'Old towel', 'Torch'],
      ['Tap washer kit to suit your tap (take the old washer to the shop)', 'Plumber’s grease (tap-safe)'],
      ['Turn off the water at the toby or under-sink isolation valve, then open the tap to drain it.', 'Put the plug in so small parts cannot fall down the drain, and lay a towel in the basin.', 'Prise off the tap cap, undo the handle screw and lift off the handle.', 'Wrap the headgear nut with a cloth and undo it with the spanner. Lift out the jumper valve and washer.', 'Fit the new washer (and O-ring if worn), smear with tap grease, and reassemble in reverse order.', 'Turn the water back on slowly and check for drips. Ceramic-disc taps use a cartridge instead of a washer — replace the cartridge with the same model.'],
      'Homeowners may replace tap washers and cartridges. Leaks inside walls, new pipework, valves on hot-water cylinders and anything involving gas must be done by an authorised plumber or gasfitter.',
      'Children can hold the torch and keep the screws safe in a cup.'],
    ['silicone', 'Re-silicone a shower or bath', 'Kitchen & bathroom', 'Beginner', '2 hrs + 24 hr cure', '$',
      ['Silicone gun', 'Plastic scraper', 'Utility knife', 'Masking tape', 'Spray bottle'],
      ['Bathroom-grade mould-resistant silicone', 'Silicone remover', 'Methylated spirits', 'Lint-free cloth'],
      ['Cut and scrape out all the old silicone. Use remover for the last film; mould grows back through leftovers.', 'Clean the joint with methylated spirits and let it dry completely — at least a few hours, ideally overnight.', 'Run masking tape either side of the joint, 3–4 mm from the gap, for a straight line.', 'Cut the nozzle at 45° slightly smaller than the gap and apply one steady, continuous bead.', 'Mist the bead lightly with soapy water and smooth it with a finger or tool in one pass. Pull the tape off straight away.', 'Leave the shower unused for the cure time printed on the tube (usually 24 hours).'],
      'Open a window while working. If the joint keeps leaking or tiles move, there may be water damage behind — get it checked.',
      'Older children can help tape the lines and check they are straight.'],
    ['plasterboard', 'Patch a small hole in plasterboard', 'Walls & paint', 'Beginner', '1 hr + drying', '$',
      ['Putty knife or broad knife', 'Utility knife', 'Sanding block (180–240 grit)', 'Dust sheet'],
      ['Self-adhesive mesh patch (holes up to ~100 mm)', 'Lightweight plasterboard filler or joint compound', 'Primer and matching paint'],
      ['Trim loose paper and crumbs from around the hole.', 'Stick the mesh patch centred over the hole.', 'Spread a thin coat of filler past the patch edges by about 50 mm. Let it dry.', 'Apply a second, wider and thinner coat and feather the edges. Let it dry fully.', 'Sand lightly until smooth, wipe off dust, prime the patch, then paint the whole wall section for an even finish.'],
      'Before cutting or sanding walls in homes built or renovated between about 1940 and 2000, check for asbestos (for example in textured “popcorn” ceilings and some wall linings). If in doubt, do not sand — get a sample tested.',
      'Kids can help mix colour samples or choose the paint.'],
    ['paint-room', 'Paint a bedroom', 'Walls & paint', 'Intermediate', '1–2 days', '$$',
      ['Roller and tray', '50–63 mm angled brush', 'Drop sheets', 'Masking tape', 'Step ladder', 'Sugar soap and sponge'],
      ['Water-based interior paint (low-VOC)', 'Primer/undercoat for repairs or big colour changes', 'Gap filler'],
      ['Move furniture to the middle and cover it. Remove switch-plate screws only if you know how — otherwise tape around them.', 'Wash walls with sugar soap, rinse and let them dry. Fill gaps and holes, sand and spot-prime.', 'Cut in with the brush around ceilings, corners and trims, about 50 mm wide.', 'Roll in a W shape, then fill in with straight vertical passes, keeping a wet edge.', 'Apply a second coat after the recommended drying time. Remove tape while the last coat is still slightly soft.', 'Ventilate the room until the paint smell is gone before sleeping in it.'],
      'Houses painted before the 1980s may have lead-based paint. Test before sanding or scraping (kits are sold at hardware stores), and keep children and pregnant family members away from lead dust.',
      'Children can paint a test board or a small cupboard with supervision.'],
    ['cabinets', 'Refresh kitchen cabinet doors and handles', 'Kitchen & bathroom', 'Intermediate', 'A weekend', '$$',
      ['Screwdriver or drill', 'Sanding block', 'Mini foam roller', 'Measuring tape', 'Handle-drilling jig (optional)'],
      ['Degreaser', 'Bonding primer suited to laminate or painted timber', 'Durable cabinet/enamel paint', 'New handles (check hole spacing)'],
      ['Label each door and remove doors and hinges.', 'Degrease thoroughly, scuff-sand, wipe clean and apply bonding primer.', 'Apply two or three thin coats with a foam roller, sanding lightly between coats.', 'Measure handle spacing carefully, use a jig, and drill from the front with tape over the spot to stop splintering.', 'Re-hang the doors and adjust hinges so the gaps are even.'],
      'Give paint the full curing time (often 7 days) before heavy use. Wear eye protection when drilling.',
      'Kids can sort the new screws and handles into labelled cups.'],
    ['shelf', 'Fix a shelf or towel rail into studs', 'Walls & paint', 'Beginner', '1 hr', '$',
      ['Stud finder', 'Drill and bits', 'Spirit level', 'Pencil', 'Screwdriver'],
      ['Shelf bracket or rail', 'Screws long enough to reach 30 mm+ into timber studs', 'Plasterboard anchors only for light items'],
      ['Find studs (usually 400–600 mm apart in NZ framing) and mark them.', 'Use the stud finder’s wire/pipe setting and avoid drilling directly above or below switches and sockets, where cables often run.', 'Hold the bracket level, mark holes, drill pilot holes and screw into the studs.', 'Check level again and load-test before adding heavy items.'],
      'If you hit a wire or pipe, stop immediately. Heavy shelves above beds or couches should be fixed into studs and kept clear of heavy objects in case of earthquakes.',
      'Children can hold the level and watch the bubble.'],
    ['quake', 'Earthquake-proof your home in an afternoon', 'Safety', 'Beginner', '2–3 hrs', '$',
      ['Drill and screwdriver', 'Stud finder'],
      ['Furniture straps or L-brackets', 'Closed picture hooks', 'Museum/quake putty', 'Child-safe cupboard latches'],
      ['Strap tall furniture such as bookcases, drawers and TV units to wall studs.', 'Replace open picture hooks with closed hooks; avoid heavy frames over beds.', 'Use putty under ornaments and latches on kitchen cupboards so contents stay in.', 'Store heavy items on lower shelves.', 'Check that your hot-water cylinder is strapped. If it is not, ask a plumber to fit seismic restraints.'],
      'Strapping furniture also stops toddlers tipping drawers onto themselves. Get Ready (getready.govt.nz) has a full home checklist.',
      'Make it a family “drop, cover and hold” practice afterwards.'],
    ['draught', 'Stop draughts around doors and windows', 'Warm & dry home', 'Beginner', '1–2 hrs', '$',
      ['Scissors', 'Utility knife', 'Screwdriver', 'Incense stick or a lit candle held carefully (to find draughts)'],
      ['Self-adhesive foam or rubber weather-strip', 'Door draught stopper or brush seal', 'Window film kit (optional)'],
      ['On a windy day, hold an incense stick near frames; moving smoke shows a draught.', 'Clean the frame, then stick weather-strip where the door or window closes against it.', 'Fit a brush seal along the bottom of external doors, or use a fabric “snake”.', 'Close curtains at dusk to keep in the day’s warmth.'],
      'Keep ventilation in kitchens and bathrooms — a warm, dry home still needs fresh air. Gen Less (EECA) has more energy-saving ideas.',
      'Kids love being “draught detectives” with the incense test (with an adult holding it).'],
    ['curtains', 'Hang thermal curtains', 'Warm & dry home', 'Beginner', '1–2 hrs', '$$',
      ['Drill', 'Spirit level', 'Stud finder', 'Measuring tape'],
      ['Curtain track or rod with brackets', 'Thermal-lined curtains', 'Wall plugs or timber screws'],
      ['Measure the window. Curtains should extend 150 mm past each side and ideally reach the sill or floor.', 'Mount the track 100–150 mm above the frame, fixing into framing where possible.', 'Hang curtains and check they close fully without gaps at the centre.', 'A pelmet or ceiling-mounted track stops warm air escaping over the top.'],
      'Secure blind and curtain cords out of children’s reach; loose cords are a strangulation risk.',
      'Children can help count curtain hooks and rings.'],
    ['garden-bed', 'Build a raised vegetable bed', 'Garden & outdoors', 'Intermediate', 'Half a day', '$$',
      ['Drill/driver', 'Saw', 'Spade', 'Spirit level', 'Tape measure'],
      ['Untreated macrocarpa or a ready-made galvanised kit', 'Timber screws (stainless or galvanised)', 'Cardboard (no tape)', 'Compost and vegetable mix'],
      ['Choose a sunny spot (6+ hours of sun) and level the ground.', 'Cut boards to size; a 1.2 m width lets you reach the middle from both sides.', 'Screw corners together with corner posts, check it is square and level.', 'Lay cardboard on the base to smother grass, then fill with a mix of compost and garden mix.', 'Water well, plant, and mulch.'],
      'Many gardeners avoid CCA-treated timber for food gardens; use untreated durable timber, or line treated timber with plastic. Wear gloves when handling compost and potting mix — they can carry Legionella; dampen the mix first and do not breathe the dust.',
      'Kids can plant seedlings and make name labels.'],
    ['deck', 'Clean and oil a timber deck', 'Garden & outdoors', 'Beginner', 'A weekend', '$$',
      ['Stiff broom or deck brush', 'Garden hose', 'Lamb’s-wool applicator or wide brush'],
      ['Deck cleaner', 'Deck oil or stain'],
      ['Sweep and remove pots. Check for raised nail heads and punch them down.', 'Apply deck cleaner, scrub along the grain and rinse well.', 'Let it dry for 2–3 days of fine weather.', 'Apply oil thinly along the full length of two or three boards at a time to avoid lap marks.', 'Keep foot traffic off until dry.'],
      'Oily rags can self-heat and catch fire. Lay them flat outside to dry or soak them in water in a sealed metal container before disposal.',
      'Children can rinse with the hose (in old clothes!).'],
    ['grout', 'Refresh tile grout', 'Kitchen & bathroom', 'Intermediate', '2–4 hrs', '$',
      ['Grout rake', 'Rubber float', 'Sponge and bucket'],
      ['Grout (matching colour)', 'Grout sealer'],
      ['Rake out loose or cracked grout to about 2–3 mm deep; vacuum dust.', 'Mix grout to the packet’s consistency and press it diagonally across the joints with the float.', 'Wipe the haze with a barely damp sponge, rinsing often.', 'Buff dry later and apply sealer after the cure time.'],
      'Wear a dust mask and eye protection when raking. Cracked tiles or soft walls may mean a leak — get it checked.',
      'Kids can wipe the tiles at the end with a damp cloth.'],
    ['showerhead', 'Swap to a water-saving showerhead', 'Kitchen & bathroom', 'Beginner', '20 min', '$',
      ['Adjustable spanner', 'Cloth'],
      ['Low-flow showerhead (look for a WELS star rating)', 'Thread seal tape'],
      ['Unscrew the old head, protecting chrome with a cloth.', 'Clean the thread and wrap it clockwise with two or three turns of thread tape.', 'Screw on the new head hand-tight, then a quarter turn with the spanner.', 'Run the water and check for leaks.'],
      'Low-pressure (gravity) hot-water systems need a head designed for low pressure. Check the label.',
      'Time a shower with a sand timer — four minutes saves water and power.'],
    ['squeak', 'Fix a squeaky or sticking door', 'Around the house', 'Beginner', '30 min', '$',
      ['Screwdriver', 'Hammer and nail set', 'Candle wax or a block plane'],
      ['Silicone spray or light oil', 'Longer hinge screws (if hinges are loose)'],
      ['Squeaks: tap the hinge pin up, spray or oil it, and tap it back.', 'Sagging: replace one screw in the top hinge with a longer screw that reaches the frame stud.', 'Sticking: rub candle wax on the rubbing edge; plane only as a last resort and reseal the timber.'],
      'Lift heavy doors with a helper.',
      'Children can listen for the squeak and tell you when it is gone.'],
    ['unblock', 'Unblock a slow sink or shower drain', 'Kitchen & bathroom', 'Beginner', '30 min', '$',
      ['Plunger', 'Plastic drain snake', 'Bucket', 'Gloves'],
      ['Hot (not boiling) water', 'Baking soda and white vinegar (optional)'],
      ['Remove the plug and pull out visible hair with the drain snake.', 'Fill with a little water and plunge firmly, covering the overflow with a wet cloth.', 'Flush with hot water. A baking soda and vinegar fizz can help loosen grease.', 'If several drains are slow, or the gully trap outside overflows, call a drainlayer.'],
      'Avoid mixing chemical drain cleaners with other products — they can release toxic gas. Never use them with a plunger.',
      'Kids can help spot what goes down drains: fats, wipes and hair cause most blockages.'],
    ['toiletseat', 'Replace a toilet seat', 'Kitchen & bathroom', 'Beginner', '20 min', '$',
      ['Screwdriver', 'Pliers'],
      ['New seat (check the shape and bolt spacing)'],
      ['Open the bolt covers and undo the nuts underneath (hold the bolt with pliers).', 'Clean the area thoroughly.', 'Fit the new seat, centre it and tighten snugly — over-tightening can crack porcelain.'],
      'Wear gloves and disinfect tools afterwards.',
      'Children choosing a soft-close seat is a winner for everyone.'],
    ['smoke-alarm', 'Test and replace smoke alarms', 'Safety', 'Beginner', '30 min', '$',
      ['Step ladder', 'Broom handle (to press the test button)'],
      ['Photoelectric 10-year long-life alarms', 'Screws'],
      ['Press the test button on each alarm monthly.', 'Replace any alarm over 10 years old (check the date on the back).', 'Fire and Emergency NZ recommends long-life photoelectric alarms in every bedroom, living area and hallway, interconnected if possible.', 'Make a family escape plan with two ways out of every room.'],
      'Use the ladder with someone holding it. Fire and Emergency NZ can advise and sometimes install alarms for free.',
      'Children can draw the escape plan and be the “meeting place” leader.'],
    ['mould', 'Clean mould and keep it away', 'Warm & dry home', 'Beginner', '1 hr', '$',
      ['Gloves, mask and eye protection', 'Microfibre cloths', 'Spray bottle'],
      ['White vinegar (undiluted) or a mould remover'],
      ['Ventilate the room. Spray vinegar on the mould, leave for an hour, then wipe and dry.', 'Wash cloths hot or throw them away.', 'Prevent return: open windows for 10 minutes daily, use extractor fans, dry washing outside or in a vented dryer, and keep furniture slightly off external walls.'],
      'Large areas of mould, or mould that keeps returning, can indicate leaks or poor ventilation. Under the Healthy Homes Standards, rental homes must have adequate heating, insulation, ventilation and moisture control.',
      'Children can wipe window condensation each morning — make it a race!']
  ];

  function DIYPage(props) {
    var a = useState('All'), area = a[0], setArea = a[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var areas = ['All'].concat(Array.from(new Set(DIY.map(function (d) { return d[2]; }))));
    var rows = DIY.filter(function (d) { return (area === 'All' || d[2] === area) && (d[1] + ' ' + d[8].join(' ')).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
    return h('div', null,
      JNZX.Header('FAMILY TOGETHER · DIY HOME PROJECTS', 'Simple home projects, done safely.', 'Step-by-step guides for small jobs most households can tackle in a weekend, with New Zealand safety and legal notes for each one.'),
      h('div', { className: 'jx-note warn' }, h('strong', null, 'Before you start: '),
        'In New Zealand, electrical work (beyond very limited homeowner tasks), gasfitting and most plumbing and drainlaying must be done by licensed or authorised tradespeople. Some building work needs a building consent, even when the work itself is simple. If a project involves structure, wet areas, wiring, gas or drains, check with your council or a qualified tradesperson first. Watch for asbestos (common in homes built or renovated between about 1940 and 2000) and lead paint (common before the 1980s).'),
      h('div', { className: 'jx-row' }, h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Search projects or tools' })),
      h(JNZX.Chips, { label: 'Area', options: areas, value: area, onChange: setArea }),
      h('p', { className: 'jx-muted' }, rows.length + ' project' + (rows.length === 1 ? '' : 's')),
      h(JNZX.Accordion, { items: rows.map(function (d) {
        return { key: d[0], title: d[1], meta: d[3] + ' · ' + d[4] + ' · ' + d[5], body: function () {
          return h('div', { className: 'jx-diy' },
            h('div', { className: 'jx-cards2' },
              h('div', null, h('h3', null, 'Tools'), list(d[6])),
              h('div', null, h('h3', null, 'Materials'), list(d[7]))),
            h('h3', null, 'Steps'), list(d[8], true),
            h('div', { className: 'jx-note warn' }, h('strong', null, 'Safety & rules: '), d[9]),
            h('p', null, h('strong', null, 'Family helpers: '), d[10]),
            h(JNZX.ShareMini, { title: d[1], text: d[1] + ' (' + d[3] + ', ' + d[4] + ')\nTools: ' + d[6].join(', ') + '\nMaterials: ' + d[7].join(', ') + '\n' + d[8].map(function (x, i) { return (i + 1) + '. ' + x; }).join('\n') + '\nSafety: ' + d[9] }));
        } };
      }) }),
      h('p', { className: 'small-note' }, 'Cost guide: $ under about $50, $$ about $50–$300. Prices vary by store and season. These are general guides, not professional advice; follow product instructions.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  }
  JNZX.register('x:diy', DIYPage);

  /* ================= SCHOOL HOLIDAY FUN (indoors) ================= */
  // [title, type, ages, time, mess, materials, how, tip]
  var ACT = [
    ['Cardboard city', 'Make & create', '3–10', '1–3 hrs', 'Medium', 'Boxes, tape, scissors, markers', 'Flatten and cut boxes into buildings, roads and a harbour. Add toy cars and invent a city name, a mayor and a bus route.', 'Keep it up all week and add one new building a day.'],
    ['Blanket fort reading camp', 'Quiet & reading', '2–12', '1–2 hrs', 'Low', 'Blankets, chairs, pegs, torch, books', 'Build a fort, turn the lights down and read by torchlight. Take turns to read a page aloud.', 'Pick a theme: space, the bush, under the sea.'],
    ['Kitchen science: lava lamp', 'Science & STEM', '5–12', '30 min', 'Medium', 'Clear bottle, water, cooking oil, food colouring, effervescent tablet', 'Fill a quarter with water and the rest with oil. Add colouring, then drop in a piece of tablet and watch the bubbles rise.', 'Ask: why do oil and water not mix? (Different densities, and oil is non-polar.)'],
    ['Paper plane championships', 'Science & STEM', '5–14', '1 hr', 'Low', 'A4 paper, tape measure, masking tape', 'Fold three different designs. Mark a launch line in the hallway and measure distance and time in the air.', 'Change one thing at a time (wing size, a paperclip on the nose) — that is a fair test.'],
    ['Make playdough', 'Make & create', '2–7', '30 min + play', 'Medium', '1 cup flour, ½ cup salt, 2 tsp cream of tartar, 1 tbsp oil, 1 cup water, food colouring', 'Stir everything in a pot over low heat until it forms a ball. Cool, then knead. Store in a sealed bag.', 'Not for eating — very salty. Keep away from dogs.'],
    ['Indoor obstacle course', 'Active indoors', '3–12', '45 min', 'Low', 'Cushions, chairs, wool, timer', 'Crawl under chairs, balance along a tape line, jump cushion to cushion, weave through a wool “laser” maze. Time each run.', 'Clear sharp corners and use bare feet on rugs, not slippery floors.'],
    ['Family bake-off', 'Cook together', '4–14', '1–2 hrs', 'High', 'A simple recipe (scones, pikelets, muffins)', 'Everyone helps measure and mix. Decorate and judge on taste, looks and teamwork.', 'Older kids can double or halve the recipe — real-life maths.'],
    ['Pikelet art', 'Cook together', '4–12', '45 min', 'Medium', 'Pikelet batter, squeeze bottle, pan', 'Pipe shapes or letters into a warm pan, cook briefly, then pour batter over the top. Flip to reveal the picture.', 'An adult handles the stovetop.'],
    ['Living-room movie cinema', 'Quiet & reading', 'All ages', '2 hrs', 'Low', 'A family film, tickets, popcorn', 'Make tickets and a snack menu, set up rows of cushions and have an usher with a torch.', 'Pause halfway for an “intermission” stretch.'],
    ['Junk-modelling robots', 'Make & create', '4–12', '1–2 hrs', 'Medium', 'Recycling (clean), bottle caps, tape, glue', 'Build a robot and give it a name, a job and a superpower. Write a short instruction manual.', 'Afterwards, sort what is left into the right recycling bins.'],
    ['Puppet show', 'Make & create', '3–10', '1–2 hrs', 'Low', 'Socks or paper bags, felt, glue, a table for a stage', 'Make puppets, write a three-scene story (beginning, problem, ending) and perform it.', 'Film it for grandparents.'],
    ['Board game tournament', 'Games', '5+', '2 hrs', 'Low', 'Two or three family games, scorecard', 'Run a round-robin. Points for winning, plus a “good sport” prize.', 'Let the youngest choose the first game.'],
    ['Treasure hunt with clues', 'Games', '4–12', '1 hr', 'Low', 'Paper, pens, a small “treasure”', 'Hide 6–10 rhyming clues around the house, each leading to the next.', 'Older siblings can write clues for younger ones.'],
    ['Build a marble run', 'Science & STEM', '5–14', '1–2 hrs', 'Medium', 'Paper towel tubes, tape, cardboard, a marble', 'Tape tubes to a wall or box to build a run. Time the marble and redesign to make it slower or faster.', 'Talk about gravity, friction and slope.'],
    ['Grow a bean in a jar', 'Science & STEM', '3–10', '10 min + 2 weeks', 'Low', 'Jar, paper towel, dried bean', 'Wedge a damp paper towel inside the jar and place a bean between the towel and the glass. Keep damp and watch the roots and shoot.', 'Draw it every day in a growth diary.'],
    ['Dance party freeze', 'Active indoors', '2–10', '20 min', 'Low', 'Music', 'Dance while the music plays; freeze when it stops. Add rules: freeze like a statue, a tree or a weka!', 'Great to burn energy before quiet time.'],
    ['Write and post a letter', 'Kindness & service', '5–12', '45 min', 'Low', 'Paper, envelope, stamp', 'Write to a grandparent, cousin or someone in a rest home. Include a drawing and a question.', 'Address it together and walk to the post box.'],
    ['Kindness jar', 'Kindness & service', '3–12', '30 min + all week', 'Low', 'Jar, paper strips', 'Write small kind acts on strips (make a sibling’s bed, help with dishes). Pick one each morning.', 'Talk at dinner about how it felt.'],
    ['Origami animals', 'Make & create', '7–14', '1 hr', 'Low', 'Square paper', 'Start with a cup, a fox face or a crane. Follow a diagram step by step.', 'Make a mobile from the finished animals.'],
    ['Science: invisible ink', 'Science & STEM', '6–12', '30 min', 'Low', 'Lemon juice, cotton bud, paper, a warm light bulb or iron (adult)', 'Write a message in lemon juice and let it dry. An adult gently warms the paper to reveal it.', 'The acid weakens the paper so it browns first when heated.'],
    ['Family photo shoot', 'Make & create', '6+', '1 hr', 'Low', 'Phone or camera, dress-ups', 'Choose a theme, set up a “studio” by a window, and take turns being photographer.', 'Print a favourite for the fridge or a Memory Jar.'],
    ['Lego (or block) challenges', 'Games', '4–12', '1 hr', 'Low', 'Building blocks, challenge cards', 'Draw challenge cards: tallest tower in 5 minutes, a bridge between two books, an animal using only 20 pieces.', 'Swap roles so a child sets the challenges.'],
    ['Learn a card trick', 'Games', '7+', '30 min', 'Low', 'A deck of cards', 'Learn one simple trick, practise in front of a mirror, then perform at dinner.', 'Practise patter — what you say while you do it.'],
    ['Make a family recipe book', 'Cook together', '6+', '1–2 hrs', 'Low', 'Paper, photos, stapler', 'Each person chooses a favourite family recipe, writes it out and draws or photographs it.', 'Ask grandparents for a recipe and its story.'],
    ['Indoor bowling', 'Active indoors', '3–10', '30 min', 'Low', '10 plastic bottles, a soft ball', 'Line up bottles in a triangle in the hallway and keep score.', 'Add water to make the pins harder to knock over.'],
    ['Plant a windowsill herb garden', 'Science & STEM', '4–12', '45 min', 'Medium', 'Pots or egg cartons, potting mix, herb seeds', 'Fill containers, sow seeds at the depth on the packet, label and water gently.', 'Wear gloves with potting mix and wash hands afterwards.'],
    ['Make a comic strip', 'Make & create', '6–14', '1 hr', 'Low', 'Paper, pens, a ruler', 'Rule six boxes, invent a hero and a problem, and tell the story in pictures and speech bubbles.', 'Bind several strips into a holiday comic book.'],
    ['Science: how many drops on a coin?', 'Science & STEM', '6–12', '20 min', 'Low', 'Coin, dropper, water, dish soap', 'Predict, then count drops until the dome breaks. Repeat with a little soap in the water.', 'Surface tension holds the dome; soap weakens it.'],
    ['Quiet reading challenge', 'Quiet & reading', '5–14', 'All holidays', 'Low', 'Library books, a reading log', 'Set a family goal (for example 20 books between you) and log titles on a chart.', 'Many public libraries run free holiday programmes — ask at yours.'],
    ['Simple sewing: a felt pouch', 'Make & create', '8+', '1–2 hrs', 'Low', 'Felt, blunt needle, embroidery thread, button', 'Cut two rectangles, sew three sides with running stitch, add a button and loop.', 'Teach how to thread and knot first.'],
    ['Family yoga & stretch', 'Active indoors', 'All ages', '20 min', 'Low', 'Towels or mats', 'Copy animal poses: cat, cow, cobra, tree, and a sleeping kiwi (child’s pose).', 'Finish with three slow breaths together.'],
    ['Charades & Pictionary', 'Games', '5+', '45 min', 'Low', 'Paper slips, a bowl, a timer', 'Write films, animals and places on slips. Act them out or draw them in 60 seconds.', 'Make a Kiwi edition: pavlova, jandals, Aoraki, tuatara.'],
    ['Kitchen science: rainbow milk', 'Science & STEM', '3–10', '15 min', 'Medium', 'Full-fat milk, plate, food colouring, dish soap, cotton bud', 'Pour milk on a plate, add drops of colour, then touch the centre with a soapy cotton bud.', 'Soap breaks the surface tension and chases the fat — colours swirl.'],
    ['Make bird feeders for winter', 'Kindness & service', '4–12', '45 min', 'Medium', 'Orange halves, string, bird seed, or a sugar-water feeder', 'Hollow out an orange half, thread string through and fill with seed. Hang it out of reach of cats.', 'Tauhou (silvereyes) love winter feeders; keep feeders clean.'],
    ['Write a family newspaper', 'Quiet & reading', '7–14', '2 hrs', 'Low', 'Paper or a document, photos', 'Assign roles: editor, reporter, photographer, weather presenter. Interview family members.', 'Include a crossword or a recipe page.'],
    ['Musical instruments from recycling', 'Make & create', '3–10', '45 min', 'Medium', 'Containers, rice, rubber bands, tubes', 'Make shakers, a tissue-box guitar and drums, then form a family band.', 'Record a song and play it back.']
  ];
  function HolidaysPage(props) {
    var t = useState('All'), type = t[0], setType = t[1];
    var a = useState('All'), age = a[0], setAge = a[1];
    var plan = JNZX.useStored('jnzx-holiday-plan', []), myPlan = plan[0], setPlan = plan[1];
    var pick = useState(null), picked = pick[0], setPicked = pick[1];
    var types = ['All'].concat(Array.from(new Set(ACT.map(function (x) { return x[1]; }))));
    function ageOk(r) {
      if (age === 'All' || r === 'All ages') return true;
      var m = r.match(/(\d+)(?:–(\d+)|\+)?/); if (!m) return true;
      var lo = +m[1], hi = m[2] ? +m[2] : 99, want = { 'Under 5': [0, 4], '5–8': [5, 8], '9–12': [9, 12], 'Teens': [13, 18] }[age];
      return lo <= want[1] && hi >= want[0];
    }
    var rows = ACT.filter(function (x) { return (type === 'All' || x[1] === type) && ageOk(x[2]); });
    function toggle(title) { setPlan(myPlan.indexOf(title) >= 0 ? myPlan.filter(function (x) { return x !== title; }) : myPlan.concat([title])); }
    return h('div', null,
      JNZX.Header('FAMILY TOGETHER · SCHOOL HOLIDAYS', 'Indoor fun for rainy holidays.', ACT.length + ' low-cost activities using things you already have. Filter by age and type, or let Mateo pick one for you.'),
      h('div', { className: 'jx-row' },
        h('button', { type: 'button', className: 'primary', onClick: function () { setPicked(rows[Math.floor(Math.random() * rows.length)] || null); } }, '🎲 Pick an activity for us'),
        picked && h('span', { className: 'jx-pick' }, h('strong', null, picked[0]), ' — ', picked[6])),
      h(JNZX.Chips, { label: 'Type', options: types, value: type, onChange: setType }),
      h(JNZX.Chips, { label: 'Age', options: ['All', 'Under 5', '5–8', '9–12', 'Teens'], value: age, onChange: setAge }),
      myPlan.length > 0 && h('div', { className: 'jx-note' }, h('strong', null, 'Our holiday plan (' + myPlan.length + '): '), myPlan.join(' · '), ' ', h('button', { type: 'button', className: 'secondary jx-fix', onClick: function () { setPlan([]); } }, 'Clear plan')),
      h('div', { className: 'jx-cards3' }, rows.map(function (x) {
        var on = myPlan.indexOf(x[0]) >= 0;
        return h('article', { key: x[0], className: 'jx-card jx-act' },
          h('p', { className: 'eyebrow' }, x[1].toUpperCase()),
          h('h3', null, x[0]),
          h('p', { className: 'jx-muted' }, 'Ages ' + x[2] + ' · ' + x[3] + ' · Mess: ' + x[4]),
          h('p', null, h('strong', null, 'You need: '), x[5]),
          h('p', null, x[6]),
          h('p', { className: 'small-note' }, '💡 ' + x[7]),
          h('div', { className: 'jx-row' }, h('button', { type: 'button', className: on ? 'primary' : 'secondary', 'aria-pressed': on, onClick: function () { toggle(x[0]); } }, on ? '✓ In our plan' : '+ Add to our plan'), h(JNZX.ShareMini, { title: x[0], text: x[0] + ' (ages ' + x[2] + ', ' + x[3] + ')\nYou need: ' + x[5] + '\n' + x[6] + '\nTip: ' + x[7] })));
      })),
      h('div', { className: 'jx-note' }, h('strong', null, 'Holiday tips: '), 'Plan one “big” activity a day and leave space for boredom — it sparks creativity. Many councils and libraries run free or low-cost school holiday programmes; check your local library or council website.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  }
  JNZX.register('x:holidays', HolidaysPage);

  /* ================= CELEBRATIONS ================= */
  function easter(y) { // Anonymous Gregorian algorithm
    var a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3), hh = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - hh - k) % 7, m = Math.floor((a + 11 * hh + 22 * l) / 451), month = Math.floor((hh + l - 7 * m + 114) / 31), day = ((hh + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  function addDays(d, n) { var x = new Date(d); x.setDate(x.getDate() + n); return x; }
  function fmt(d) { return d.toLocaleDateString('en-NZ', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }); }
  function advent(y) { var xmas = new Date(y, 11, 25); var dow = xmas.getDay(); return addDays(xmas, -(dow === 0 ? 28 : dow + 21)); }
  var MATARIKI = { 2026: [6, 10], 2027: [5, 25], 2028: [6, 14], 2029: [6, 6], 2030: [5, 21], 2031: [6, 11], 2032: [6, 2] };
  function dates(y) {
    var e = easter(y);
    var out = [
      ['Ash Wednesday (Lent begins)', addDays(e, -46)], ['Palm Sunday', addDays(e, -7)], ['Holy Thursday', addDays(e, -3)], ['Good Friday (public holiday)', addDays(e, -2)],
      ['Holy Saturday · Easter Vigil', addDays(e, -1)], ['Easter Sunday', e], ['Easter Monday (public holiday)', addDays(e, 1)], ['Divine Mercy Sunday', addDays(e, 7)], ['Pentecost', addDays(e, 49)]
    ];
    if (MATARIKI[y]) out.push(['Matariki public holiday', new Date(y, MATARIKI[y][0], MATARIKI[y][1])]);
    out.push(['First Sunday of Advent', advent(y)], ['Christmas Day', new Date(y, 11, 25)]);
    NZEVENTS.forEach(function (ev) { var d = ev[1] && ev[1](y); if (d) out.push([ev[0], d]); });
    return out.sort(function (a, b) { return a[1] - b[1]; });
  }

  function nthDow(y, m, dow, n) { var d = new Date(y, m, 1); while (d.getDay() !== dow) d = addDays(d, 1); return addDays(d, 7 * (n - 1)); }
  function lastDow(y, m, dow) { var d = new Date(y, m + 1, 0); while (d.getDay() !== dow) d = addDays(d, -1); return d; }
  var LUNAR = { 2026: [1, 17], 2027: [1, 6], 2028: [0, 26], 2029: [1, 13], 2030: [1, 3] };
  // [name, function(y) -> Date | null, when (text), about, family idea]
  var NZEVENTS = [
    ['Waitangi Day', function (y) { return new Date(y, 1, 6); }, '6 February', 'Marks the signing of Te Tiriti o Waitangi (the Treaty of Waitangi) in 1840 — New Zealand’s founding document.', 'Visit a local Waitangi Day event or read a children’s book about Te Tiriti together and talk about partnership and promises.'],
    ['Lunar New Year', function (y) { return LUNAR[y] ? new Date(y, LUNAR[y][0], LUNAR[y][1]) : null; }, 'January or February', 'Celebrated by Chinese, Korean, Vietnamese and other communities with lantern festivals, family meals and red envelopes.', 'Go to a lantern festival (Auckland and Christchurch hold big ones), make paper lanterns or try making dumplings.'],
    ['Daylight saving ends', function (y) { return nthDow(y, 3, 0, 1); }, 'First Sunday in April', 'Clocks go back one hour at 3 am.', 'Check smoke alarms and emergency kits on the same day each year.'],
    ['Anzac Day', function (y) { return new Date(y, 3, 25); }, '25 April', 'Remembers New Zealanders and Australians who served and died in war, beginning with the Gallipoli landings in 1915.', 'Go to a dawn service or a local wreath-laying, make paper poppies and bake Anzac biscuits.'],
    ['Mother’s Day', function (y) { return nthDow(y, 4, 0, 2); }, 'Second Sunday in May', 'A day to thank mothers, grandmothers and the women who care for us.', 'Make breakfast, write a card or plant something together.'],
    ['NZ Sign Language Week', null, 'May (usually early May)', 'Celebrates NZSL, one of our official languages, and the Deaf community.', 'Learn ten signs together — see Learning › Speech › NZ Sign Language.'],
    ['Pink Shirt Day', null, 'May', 'Speaks up against bullying and celebrates diversity and inclusion.', 'Wear pink and talk with children about being an upstander.'],
    ['King’s Birthday', function (y) { return nthDow(y, 5, 1, 1); }, 'First Monday in June', 'A public holiday marking the Sovereign’s official birthday.', 'Enjoy a long-weekend winter walk or a family movie afternoon.'],
    ['Arbor Day', function (y) { return new Date(y, 5, 5); }, '5 June', 'A day for planting trees and caring for the environment.', 'Plant a native tree or join a community planting day.'],
    ['Pacific language weeks', null, 'May to October', 'Weeks celebrating Samoan, Cook Islands Māori, Tongan, Tuvaluan, Fijian, Niuean, Tokelauan and other Pacific languages.', 'Learn a greeting in a Pacific language each week — try Hello, World! in Learning.'],
    ['Father’s Day', function (y) { return nthDow(y, 8, 0, 1); }, 'First Sunday in September', 'A day to thank fathers, grandfathers and the men who care for us.', 'Make a “Dad’s day” coupon book or cook his favourite meal together.'],
    ['Te Wiki o te Reo Māori', null, 'September (Māori Language Week)', 'A week celebrating te reo Māori, an official language of Aotearoa. It marks the 1972 Māori language petition.', 'Use one new kupu (word) a day at home, and learn a mihi or waiata as a family.'],
    ['Suffrage Day', function (y) { return new Date(y, 8, 19); }, '19 September', 'In 1893 New Zealand became the first self-governing country in the world where women won the right to vote.', 'Talk about Kate Sheppard and why voting matters; find her on the $10 note.'],
    ['Daylight saving starts', function (y) { return lastDow(y, 8, 0); }, 'Last Sunday in September', 'Clocks go forward one hour at 2 am.', 'Plan an evening walk to enjoy the longer light.'],
    ['Labour Day', function (y) { return nthDow(y, 9, 1, 4); }, 'Fourth Monday in October', 'Celebrates the eight-hour working day, won by New Zealand workers in the 1840s.', 'A traditional weekend for planting the vegetable garden — sow tomatoes and beans together.'],
    ['Diwali', null, 'October or November', 'The Hindu, Sikh and Jain festival of lights, celebrated with lamps, sweets and fireworks.', 'Visit a Diwali festival, make clay diya lamps or rangoli patterns with coloured rice.'],
    ['Guy Fawkes and Parihaka Day', function (y) { return new Date(y, 10, 5); }, '5 November', 'Fireworks night, and also the day Parihaka in Taranaki is remembered for its peaceful resistance led by Te Whiti o Rongomai and Tohu Kākahi in 1881.', 'Watch a public fireworks display safely, and learn the story of Parihaka and its white feather symbol of peace.'],
    ['New Year’s Eve', function (y) { return new Date(y, 11, 31); }, '31 December', 'The end of the year, often with summer barbecues and fireworks.', 'Write family hopes for the new year and open last year’s.']
  ];
  JNZX.nzEvents = NZEVENTS;
  var FEASTS = {
    christmas: { title: 'Advent & Christmas', kicker: 'PREPARE AND REJOICE', intro: 'Advent is the four weeks of joyful waiting before Christmas, when the Church prepares to celebrate the birth of Jesus and looks forward to his coming again. Christmas is a season, not just a day: it runs from Christmas Eve to the Baptism of the Lord in January. In Aotearoa it falls in summer, so many traditions happen outdoors.',
      meaning: ['The Advent wreath has four candles — three purple and one rose (for the third Sunday, Gaudete, “rejoice”). Light one more each Sunday.', 'The colours: purple for preparation, white and gold at Christmas for joy and light.', 'The nativity scene (crib) recalls the humble birth of Jesus in Bethlehem. Many families add the figure of Jesus on Christmas Eve and the Magi on Epiphany.'],
      acts: [['Make an Advent wreath', 'All ages', 'Use a ring of greenery (pōhutukawa, rosemary or pine), four candles (or paper flames for little ones) and a short prayer each Sunday.'], ['Jesse Tree', '4–12', 'Each day of Advent, read a short Bible story from Creation to John the Baptist and hang a paper symbol on a branch.'], ['Kindness Advent calendar', 'All ages', 'Behind each door, a kind act instead of a treat: help a neighbour, phone a grandparent, donate a toy.'], ['Build a family nativity', '3–10', 'Make figures from pegs, clay or cardboard. Leave the manger empty until Christmas Eve.'], ['Straw for the manger', '3–10', 'Each good deed earns a piece of straw (or yellow wool) for the manger so it is soft for baby Jesus.'], ['Carols by candlelight', 'All ages', 'Learn a carol together, such as “Silent Night” or the Kiwi “Te Harinui”, and sing it at a local carols event.'], ['Christmas cards with a message', '5+', 'Make cards for people who live alone or in a rest home, with a picture and a short blessing.'], ['Summer Christmas picnic', 'All ages', 'After Mass, have a family picnic or beach lunch. Keep food cold and safe in the heat — chilly bins and ice packs.'], ['Bless the Christmas tree', 'All ages', 'Gather around the tree, read John 1:1–5 (“the light shines in the darkness”) and switch on the lights.'], ['Epiphany chalk blessing', '6+', 'On Epiphany, write 20 + C + M + B + 27 above the door (for the coming year) — an old blessing for the home.']] },
    lent: { title: 'Lent', kicker: 'FORTY DAYS OF GROWING', intro: 'Lent begins on Ash Wednesday and lasts about forty days until Holy Thursday. Christians prepare for Easter through prayer, fasting and almsgiving (giving to those in need) — three habits that turn our hearts to God and to others.',
      meaning: ['Ashes remind us that life is a gift and that we can always turn back to God.', 'Fasting is not about dieting; it is about making room. Children are not required to fast — they can give up a small treat or screen time instead.', 'Purple is the colour of Lent, for repentance and preparation.'],
      acts: [['Family Lenten promise', 'All ages', 'Choose one thing to give up and one good thing to add (a daily prayer, a kind act).'], ['Almsgiving box', 'All ages', 'Decorate a box and add coins saved by skipping treats. Donate it to Caritas Aotearoa New Zealand or a local food bank at Easter.'], ['Pretzel prayers', '4+', 'Pretzels were once a Lenten food shaped like arms crossed in prayer. Bake them together and say a short prayer.'], ['Stations of the Cross for families', '6+', 'Walk the stations at your parish or at home with simple pictures and one-line prayers.'], ['Bare-branch tree', '3+', 'Put a bare branch in a vase. Add a paper leaf for each kind act; add flowers at Easter.']] },
    holyweek: { title: 'Holy Week', kicker: 'THE HEART OF THE CHRISTIAN YEAR', intro: 'Holy Week begins on Palm Sunday and leads to Easter. Its final three days — the Easter Triduum of Holy Thursday, Good Friday and the Easter Vigil — are the most important days of the Church’s year.',
      meaning: ['Palm Sunday: Jesus enters Jerusalem and the crowd waves palms. Palms are blessed at Mass and taken home, often tucked behind a crucifix.', 'Holy Thursday: the Last Supper, when Jesus gives us the Eucharist and washes his disciples’ feet.', 'Good Friday: Jesus dies on the cross. A day of fasting and abstinence for adults; there is no Mass, but a solemn liturgy with veneration of the cross.', 'Holy Saturday: a day of quiet waiting. At night the Easter Vigil begins with the new fire and the Easter candle.'],
      acts: [['Palm Sunday procession', '3+', 'Make palms from green paper or flax and process around the house singing “Hosanna”.'], ['Family foot-washing', '5+', 'On Holy Thursday, read John 13:1–15 and take turns washing each other’s feet (or hands) to show serving love.'], ['Upper-room meal', 'All ages', 'Share a simple meal with bread and grape juice, and talk about the Last Supper. (This is a family meal, not a Mass.)'], ['Good Friday quiet hours', 'All ages', 'Turn off screens from noon to 3 pm, make a simple cross and read the Passion from a children’s Bible.'], ['Hot cross buns', '4+', 'Bake buns and talk about the cross on top. Share some with neighbours.'], ['Easter garden', '4+', 'On Holy Saturday, make a small garden in a tray with a tomb made from a pot and a stone to roll away on Sunday morning.']] },
    easter: { title: 'Easter', kicker: 'HE IS RISEN!', intro: 'Easter Sunday celebrates the resurrection of Jesus, the centre of the Christian faith. Easter is also a season of fifty days, lasting until Pentecost, when the Holy Spirit came upon the disciples.',
      meaning: ['Eggs are a symbol of new life bursting out of the tomb.', 'The Easter candle (Paschal candle) stands near the altar all season, reminding us that Christ is our light.', 'White and gold are the colours of Easter joy, and “Alleluia” returns after Lent.'],
      acts: [['Empty-tomb reveal', '3+', 'Roll the stone away in your Easter garden at breakfast and read Luke 24:1–12.'], ['Resurrection eggs', '4–10', 'Fill 12 plastic eggs with small symbols of the Easter story (a leaf, a coin, a cross, an empty one last) and open one at a time.'], ['Egg hunt with a twist', 'All ages', 'Put a short Bible verse or kindness challenge inside each egg.'], ['Decorate eggs naturally', '5+', 'Dye hard-boiled eggs with onion skins, beetroot or turmeric.'], ['Alleluia banner', '3+', 'Paint a big ALLELUIA banner for the front door.'], ['Easter Monday outing', 'All ages', 'A family walk or picnic in autumn colours — notice signs of new life even as the season changes.'], ['Pentecost wind and fire', '4+', 'Fifty days later, make red streamers or a paper dove to celebrate the gift of the Holy Spirit.']] },
    matariki: { title: 'Matariki', kicker: 'MĀORI NEW YEAR · TE MĀTAHI O TE TAU', intro: 'Matariki is the Māori name for the star cluster also known as the Pleiades. When it rises in the pre-dawn sky in mid-winter, it marks the Māori New Year — a time to remember those who have died, celebrate the present and plan for the year ahead. Since 2022, Matariki has been a New Zealand public holiday, and it is a celebration for everyone who calls Aotearoa home.',
      meaning: ['Three principles: Matariki Hunga Nui — gathering together; Matariki Ahunga Nui — the abundance of food; Matariki Manako Nui — wishes and hopes for the year ahead. People also remember (whakamaumahara), celebrate the present (whakanui) and look to the future (te tau hou).', 'Nine stars are named and each is linked to an aspect of life: Matariki (wellbeing and gathering), Pōhutukawa (those who have passed), Waitī (fresh water), Waitā (the ocean), Waipuna-ā-Rangi (rain), Tupuānuku (food grown in the ground), Tupuārangi (food from above, such as birds and fruit), Ururangi (the winds) and Hiwa-i-te-rangi (wishes and dreams).', 'In some areas, especially in the west and far north, Puanga (Rigel) marks the new year instead. Follow the practices of local iwi where you live.'],
      acts: [['Star-gazing at dawn', '6+', 'Rise before dawn around the Matariki holiday and look low in the east-northeast. Find Tautoru (the three stars of Orion’s belt), follow their line to the left past the bright orange star Taumatakuku, and you will reach the small, misty cluster of Matariki. Bring hot drinks!'], ['Remember loved ones', 'All ages', 'Share stories and photos of whānau who have died since last Matariki. Light a candle and say their names.'], ['Wishes for Hiwa-i-te-rangi', 'All ages', 'Write hopes for the new year on paper stars and hang them in a window.'], ['Shared kai', 'All ages', 'Cook a winter meal with food from the earth (kūmara, pumpkin) and invite friends or neighbours. Learn a karakia mō te kai (a blessing for food) from your local kura or iwi resources.'], ['Make a nine-star mobile', '4–12', 'Cut out nine stars, label each with its name and meaning, and hang them from a stick.'], ['Plant for the year', '5+', 'Plan your spring garden or plant a native tree — a way to look after Papatūānuku.'], ['Learn a waiata', 'All ages', 'Learn a Matariki song from Te Papa or your local school, and practise correct pronunciation.'], ['Clean up together', 'All ages', 'Join a local beach, river or park clean-up, honouring Waitī and Waitā.'], ['Kite flying', '5+', 'Make a simple kite; manu tukutuku (kites) were traditionally flown at this time of year to connect earth and sky.']] }
  };
  function CelebrationsPage(props) {
    var now = new Date();
    var y = useState(now.getMonth() === 11 && now.getDate() > 25 ? now.getFullYear() + 1 : now.getFullYear()), year = y[0], setYear = y[1];
    var items = dates(year).concat(dates(year + 1)).filter(function (x) { return x[1] >= new Date(now.getFullYear(), now.getMonth(), now.getDate()); }).slice(0, 8);
    function feast(id) {
      var f = FEASTS[id];
      return h('div', { className: 'jx-feast' },
        h('p', { className: 'eyebrow' }, f.kicker), h('h2', null, f.title), h('p', null, f.intro),
        h('h3', null, 'What it means'), list(f.meaning),
        h('h3', null, 'Family activities'),
        h('div', { className: 'jx-cards3' }, f.acts.map(function (a) { return h('article', { key: a[0], className: 'jx-card' }, h('h4', null, a[0]), h('p', { className: 'jx-muted' }, 'Ages: ' + a[1]), h('p', null, a[2])); })));
    }
    return h('div', null,
      JNZX.Header('FAMILY TOGETHER · CELEBRATE TOGETHER', 'Christmas, Easter, Matariki & NZ days.', 'The meaning behind each season, important New Zealand days, the dates for the year ahead and simple activities to share at home.'),
      h('div', { className: 'jx-card' }, h('h2', null, 'Coming up'),
        h('ul', { className: 'jx-dates' }, items.map(function (x) { return h('li', { key: x[0] + x[1] }, h('strong', null, x[0]), h('span', null, fmt(x[1]))); })),
        h('p', { className: 'small-note' }, 'Church dates are calculated with the standard Easter formula used by the Catholic Church. Matariki dates are those set by the Government for the public holiday. Mass times vary — check with your parish.')),
      h(JNZX.Tabs, { id: 'celebrations', label: 'Celebration', items: [
        { id: 'christmas', label: '🎄 Advent & Christmas', render: function () { return feast('christmas'); } },
        { id: 'lent', label: 'Lent', render: function () { return feast('lent'); } },
        { id: 'holyweek', label: '✝️ Holy Week', render: function () { return feast('holyweek'); } },
        { id: 'easter', label: '🥚 Easter', render: function () { return feast('easter'); } },
        { id: 'matariki', label: '✨ Matariki', render: function () { return feast('matariki'); } },
        { id: 'nzdays', label: '🇳🇿 NZ days', render: function () { return h('div', { className: 'jx-feast' },
          h('p', { className: 'eyebrow' }, 'IMPORTANT DAYS IN AOTEAROA'), h('h2', null, 'New Zealand days to mark together'),
          h('p', null, 'National days, remembrance and the cultures that make up Aotearoa — with a simple family idea for each.'),
          h('div', { className: 'jx-cards3' }, NZEVENTS.map(function (ev) { var d = ev[1] && ev[1](year); return h('article', { key: ev[0], className: 'jx-card' }, h('h4', null, ev[0]), h('p', { className: 'jx-muted' }, d ? fmt(d) : ev[2]), h('p', null, ev[3]), h('p', null, h('strong', null, 'Family idea: '), ev[4]), h(JNZX.ShareMini, { title: ev[0], text: ev[0] + ' — ' + ev[4] })); })),
          h('p', { className: 'small-note' }, 'Events shown by month vary each year — check the organisers’ websites for exact dates. Lunar New Year dates are listed for 2026–2030.')); } }
      ] }),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  }
  JNZX.register('x:celebrations', CelebrationsPage);
  JNZX._easter = easter;
})();
