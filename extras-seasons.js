/* The James NZ — Kiwi Adventures › Flowers & Fruit Picking (October 2026).
   When to see New Zealand's favourite flowers and when to pick your own fruit.
   Months are typical — seasons shift a few weeks with weather and region. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState;
  var MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  function range(a, b) { var o = []; for (var m = a; ; m = m % 12 + 1) { o.push(m); if (m === b) break; } return o; }
  // [emoji, name, months, where, tip]
  var FLOWERS = [
    ['🌸', 'Cherry blossoms', range(9, 10), 'Hagley Park (Christchurch), Cornwall Park (Auckland), Hamilton Gardens, Wellington Botanic Garden', 'Go on a weekday morning for soft light and fewer crowds. Pack a picnic blanket.'],
    ['🌹', 'Roses', range(11, 3), 'Parnell Rose Garden (Auckland), Hamilton Gardens, Lady Norwood Rose Garden (Wellington), Mona Vale (Christchurch)', 'Peak bloom is late November; many gardens re-flower into autumn.'],
    ['💠', 'Hydrangeas', range(12, 2), 'Country gardens across NZ — Taranaki and Waikato gardens are lovely', 'Soil changes their colour: blue in acidic soil, pink in alkaline.'],
    ['🌼', 'Daffodils', range(8, 9), 'Hagley Park and Victoria Park (Christchurch), country roadsides, many town parks', 'Daffodil Day is in late August — wear a daffodil to support cancer care.'],
    ['🌷', 'Tulips', range(9, 10), 'Botanic gardens in spring, tulip festivals and bulb farms (check local listings)', 'Some bulb farms open for a few weekends only — check before you go.'],
    ['🌳', 'Kōwhai', range(8, 10), 'Native bush, riverbanks and parks all over the country', 'Listen for tūī — they love kōwhai nectar. Seeds are poisonous, so don’t let little ones eat them.'],
    ['🌺', 'Pōhutukawa', range(12, 1), 'Coastlines of the upper North Island — Auckland beaches, Coromandel, Northland', 'Known as the New Zealand Christmas tree for its red summer flowers.'],
    ['❤️', 'Northern & southern rātā', range(12, 2), 'West Coast (southern rātā), Northland and Coromandel forests (northern rātā)', 'A tough native tree that can start life growing on another tree.'],
    ['💜', 'Lupins', range(11, 1), 'Lake Tekapo and the Mackenzie Basin', 'Lovely to look at but an invasive weed — take photos, not seeds.'],
    ['🪻', 'Lavender', range(12, 2), 'Lavender farms in Canterbury, Central Otago, Wānaka and Hawke’s Bay', 'Many farms sell lavender ice cream and let you pick a bunch.'],
    ['🌻', 'Sunflowers', range(1, 3), 'Pick-your-own sunflower fields in Canterbury, Waikato and Hawke’s Bay', 'Bring secateurs or a knife (adults only) and a bucket of water for the car.'],
    ['🌸', 'Magnolias', range(7, 9), 'Botanic gardens and older suburbs — Auckland Domain, Christchurch Botanic Gardens', 'One of the first big spring shows, often before the leaves appear.'],
    ['🌺', 'Rhododendrons & azaleas', range(9, 11), 'Pukeiti and Pukekura Park (Taranaki), Dunedin Botanic Garden', 'Taranaki’s garden festival celebrates them every spring.'],
    ['🌸', 'Camellias', range(6, 9), 'Parks and home gardens across the country', 'A cheerful winter flower when little else is blooming.'],
    ['💜', 'Wisteria', range(10, 11), 'Old villas, pergolas and public gardens', 'Smell it on a warm afternoon — it’s at its sweetest then.'],
    ['🌸', 'Peonies', range(11, 12), 'Central Otago and Southland flower farms', 'Short season! Some farms sell bunches at the gate.'],
    ['💐', 'Freesias', range(8, 10), 'Home gardens and roadside patches, especially in the north', 'One of spring’s best-smelling flowers.'],
    ['🔵', 'Bluebells', range(9, 10), 'Woodland gardens and older parks', 'Stay on paths so the bulbs keep coming back each year.'],
    ['🤍', 'Puawānanga (native clematis)', range(8, 10), 'Native forest edges, climbing through the canopy', 'Look up — the white stars hang high in the trees.'],
    ['🤍', 'Mānuka', range(11, 1), 'Scrubland and hills nationwide', 'Bees turn its nectar into famous mānuka honey.'],
    ['🌼', 'Dahlias', range(1, 4), 'Botanic gardens and dahlia society shows', 'Great for cut flowers — pick in the cool of the morning.'],
    ['🌸', 'Spring blossom (apple, plum, peach)', range(9, 10), 'Orchard regions — Hawke’s Bay, Central Otago, Nelson', 'Blossom season is a beautiful road trip before the fruit comes.']
  ];
  var FRUIT = [
    ['🍓', 'Strawberry picking', range(11, 2), 'Pick-your-own farms near Auckland, Waikato, Hawke’s Bay, Nelson and Canterbury', 'Go early in the day; check the farm’s page for the day’s picking status.'],
    ['🫐', 'Blueberry picking', range(12, 3), 'Waikato, Bay of Plenty, Hawke’s Bay, Canterbury and Otago farms', 'Ripe blueberries roll off easily — leave the reddish ones to ripen.'],
    ['🍒', 'Cherry picking', range(12, 1), 'Central Otago (Cromwell, Clyde, Alexandra) and Marlborough', 'Peak is Christmas to mid-January; bring a hat and sunscreen.'],
    ['🍇', 'Raspberries', range(12, 2), 'Canterbury, Otago and Nelson berry farms', 'Pick into a shallow container so they don’t squash.'],
    ['🫐', 'Boysenberries', range(12, 1), 'Nelson, Marlborough and Waikato', 'A Kiwi favourite — perfect for jam and ice cream.'],
    ['🍑', 'Apricots', range(1, 2), 'Central Otago orchards', 'Sun-warm apricots are a summer treat; fruit stalls sell seconds for jam.'],
    ['🍑', 'Peaches & nectarines', range(1, 3), 'Hawke’s Bay and Central Otago', 'Hold gently in your palm and twist — don’t squeeze.'],
    ['🟣', 'Plums', range(1, 3), 'Hawke’s Bay, Nelson and backyards everywhere', 'Share a glut with neighbours or freeze halves for crumbles.'],
    ['🍎', 'Apples', range(2, 5), 'Hawke’s Bay and Nelson orchards and roadside stalls', 'Lift and twist upward; a ripe apple comes away easily.'],
    ['🍐', 'Pears', range(2, 4), 'Hawke’s Bay, Nelson and Central Otago', 'Pears ripen best off the tree — leave them on the bench a few days.'],
    ['💚', 'Feijoas', range(3, 6), 'Gardens all over the North Island; feijoa stalls and markets', 'Collect fallen ones from the ground — that’s when they’re ripe.'],
    ['🥝', 'Kiwifruit', range(4, 6), 'Bay of Plenty orchards and orchard-gate stalls', 'Most orchards are commercial — look for orchard-gate sales.'],
    ['🍊', 'Mandarins & citrus', range(5, 9), 'Gisborne, Northland and Bay of Plenty', 'A winter vitamin-C boost; lemons fruit most of the year.'],
    ['🍅', 'Tamarillos', range(5, 9), 'Northland, Auckland and Bay of Plenty', 'Scoop out with a spoon or poach with a little sugar.'],
    ['🥑', 'Avocados', range(9, 3), 'Bay of Plenty and Northland', 'Avocados ripen after picking — buy firm and wait.'],
    ['🎃', 'Pumpkin patches', range(3, 4), 'Pick-your-own pumpkin patches near most cities in autumn', 'Great family outing before Halloween-style autumn crafts.'],
    ['🍇', 'Grapes', range(3, 4), 'Hawke’s Bay, Gisborne, Marlborough and Central Otago', 'Table grapes are sold at roadside stalls during harvest.'],
    ['🟢', 'Gooseberries & currants', range(12, 1), 'Canterbury, Otago and Southland berry farms', 'Tart and tasty in jam and cordial.'],
    ['💜', 'Passionfruit', range(2, 6), 'Northland, Auckland and Bay of Plenty gardens', 'Wrinkly skin means sweet and ripe!'],
    ['🌽', 'Sweetcorn', range(1, 3), 'Roadside stalls in Waikato, Gisborne and Canterbury', 'Cook it the same day for the sweetest corn.']
  ];
  // Regions and their main towns; each place in a guide is matched to its region by name.
  var REGIONS = [
    ['Northland', ['Whangārei', 'Kerikeri', 'Kaitaia', 'Paihia', 'Dargaville'], /northland|kerikeri|whang[aā]rei|upper north island/i],
    ['Auckland', ['Auckland', 'North Shore', 'Manukau', 'Pukekohe', 'Waiheke Island'], /auckland|parnell|cornwall park|upper north island/i],
    ['Waikato', ['Hamilton', 'Cambridge', 'Taupō', 'Thames', 'Coromandel', 'Tokoroa'], /waikato|hamilton|coromandel|upper north island/i],
    ['Bay of Plenty', ['Tauranga', 'Rotorua', 'Whakatāne', 'Te Puke', 'Katikati'], /bay of plenty|tauranga|te puke|upper north island/i],
    ['Gisborne', ['Gisborne'], /gisborne/i],
    ["Hawke's Bay", ['Napier', 'Hastings', 'Havelock North', 'Waipukurau'], /hawke/i],
    ['Taranaki', ['New Plymouth', 'Stratford', 'Hāwera'], /taranaki|pukeiti|pukekura/i],
    ['Manawatū-Whanganui', ['Palmerston North', 'Whanganui', 'Feilding', 'Levin'], /manawat|whanganui|palmerston/i],
    ['Wellington', ['Wellington', 'Lower Hutt', 'Upper Hutt', 'Porirua', 'Masterton'], /wellington|lady norwood|wairarapa/i],
    ['Tasman & Nelson', ['Nelson', 'Richmond', 'Motueka', 'Tākaka'], /nelson|tasman|motueka/i],
    ['Marlborough', ['Blenheim', 'Picton', 'Kaikōura'], /marlborough|blenheim/i],
    ['West Coast', ['Greymouth', 'Hokitika', 'Westport'], /west coast/i],
    ['Canterbury', ['Christchurch', 'Timaru', 'Ashburton', 'Rangiora', 'Tekapo'], /canterbury|christchurch|hagley|mona vale|tekapo|mackenzie/i],
    ['Otago', ['Dunedin', 'Queenstown', 'Wānaka', 'Cromwell', 'Alexandra', 'Oamaru'], /otago|dunedin|queenstown|w[aā]naka|cromwell|clyde|alexandra/i],
    ['Southland', ['Invercargill', 'Gore', 'Te Anau'], /southland|invercargill/i]
  ];
  var EVERYWHERE = /all over|across nz|across the country|nationwide|everywhere|near most cities|many town parks|home gardens|country gardens|botanic gardens|older parks|old villas|woodland gardens|native forest|native bush|scrubland|parks and home|dahlia society|bulb farms|roadside|backyards/i;
  var NORTH = /north island/i;
  function inRegion(x, ri) {
    if (ri < 0) return 'yes';
    var where = x[3], R = REGIONS[ri];
    if (R[2].test(where)) return 'yes';
    if (NORTH.test(where) && !/upper north island/i.test(where) && ri <= 8) return 'yes';
    if (EVERYWHERE.test(where)) return 'wide';
    return '';
  }
  function Months(props) {
    return h('div', { className: 'jx-mon', 'aria-label': 'Months: ' + props.m.map(function (x) { return MON[x - 1]; }).join(', ') },
      MON.map(function (n, i) { return h('span', { key: n, className: props.m.indexOf(i + 1) >= 0 ? 'on' : '' }, n.charAt(0)); }));
  }
  function SeasonsPage(props) {
    var now = new Date().getMonth() + 1;
    var t = JNZX.useStored('jnzx-seasons-type', 'flowers'), type = t[0], setType = t[1];
    var mm = useState(now), month = mm[0], setMonth = mm[1];
    var rg = JNZX.useStored('jnzx-seasons-region', -1), ri = +rg[0], setRi = rg[1];
    var tw = JNZX.useStored('jnzx-seasons-town', ''), town = tw[0], setTown = tw[1];
    var list = (type === 'flowers' ? FLOWERS : FRUIT).filter(function (x) { return (!month || x[2].indexOf(month) >= 0) && inRegion(x, ri); });
    list.sort(function (a, b) { return (inRegion(a, ri) === 'yes' ? 0 : 1) - (inRegion(b, ri) === 'yes' ? 0 : 1); });
    var placeName = ri < 0 ? 'New Zealand' : (town || REGIONS[ri][0]);
    return h('div', null,
      JNZX.Header('KIWI ADVENTURES · SEASONS', 'Flowers to see and fruit to pick.', 'What’s blooming and what’s ripe across Aotearoa, month by month.'),
      h('div', { className: 'jx-cs-tabs', role: 'tablist', 'aria-label': 'Flowers or fruit' },
        [['flowers', '🌸 Flowers (' + FLOWERS.length + ')'], ['fruit', '🍓 Fruit picking (' + FRUIT.length + ')']].map(function (x) { return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': type === x[0], className: type === x[0] ? 'is-on' : '', onClick: function () { setType(x[0]); } }, x[1]); })),
      h('div', { className: 'jx-row jx-form jx-season-where' },
        h('label', null, '📍 Region', h('select', { value: ri, onChange: function (e) { setRi(+e.target.value); setTown(''); } },
          h('option', { value: -1 }, 'All of New Zealand'), REGIONS.map(function (r, i) { return h('option', { key: r[0], value: i }, r[0]); }))),
        h('label', null, '🏘️ City or town', h('select', { value: town, disabled: ri < 0, onChange: function (e) { setTown(e.target.value); } },
          h('option', { value: '' }, ri < 0 ? 'Choose a region first' : 'Anywhere in ' + REGIONS[ri][0]), ri < 0 ? null : REGIONS[ri][1].map(function (t) { return h('option', { key: t, value: t }, t); })))),
      h(JNZX.Chips, { label: 'Month', options: [{ value: 0, label: 'All year' }].concat(MON.map(function (n, i) { return { value: i + 1, label: n + (i + 1 === now ? ' • now' : '') }; })), value: month, onChange: setMonth }),
      h('p', { className: 'small-note' }, list.length + (type === 'flowers' ? ' flowers ' : ' fruits ') + (ri >= 0 ? 'near ' + placeName + ' ' : '') + (month ? 'in ' + MON[month - 1] : 'through the year') + (ri >= 0 && town ? ' (we list places for the whole ' + REGIONS[ri][0] + ' region)' : '') + '. Months are typical and shift with weather and region — check opening times before you go.'),
      list.length ? null : h('p', { className: 'jx-note' }, 'Nothing listed for ' + placeName + (month ? ' in ' + MON[month - 1] : '') + ' yet — try “All year” or a nearby region.'),
      h('div', { className: 'jx-season-grid' }, list.map(function (x) {
        var when = x[2].length === 12 ? 'All year' : MON[x[2][0] - 1] + '–' + MON[x[2][x[2].length - 1] - 1];
        return h('article', { key: x[1], className: 'jx-card jx-season' },
          h('div', { className: 'jx-season-top' }, h('span', { className: 'jx-season-emo', 'aria-hidden': true }, x[0]), h('div', null, h('h3', null, x[1]), h('small', null, '📅 ' + when))),
          h(Months, { m: x[2] }),
          h('p', null, h('strong', null, '📍 '), x[3]),
          ri >= 0 && inRegion(x, ri) === 'wide' ? h('p', { className: 'jx-season-wide' }, '🇳🇿 Found in many places across NZ — look in your local parks, gardens and markets.') : null,
          h('p', { className: 'jx-muted' }, '💡 ' + x[4]),
          h(JNZX.ShareMini, { title: x[1] + (ri >= 0 ? ' near ' + placeName : ' in NZ'), text: x[0] + ' ' + x[1] + ' — ' + when + '. ' + x[3] + '.\n💡 ' + x[4], label: 'Share' }));
      })),
      h('div', { className: 'jx-note' }, h('strong', null, 'Picking tips: '), 'Bring containers, water, hats and sunscreen. Some farms take cards only, some cash only. Pay for what you eat on the farm! Only pick where it’s allowed — never native plants or public gardens.'),
      h(JNZX.ShareBar, { tab: props.tab }));
  }
  JNZX.register('x:seasons', SeasonsPage);
})();
