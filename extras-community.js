/* The James NZ — Community › Sustainable Living & Recycling and
   Modern & Lifestyle › Office Shortcuts (October 2026). */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useMemo = R.useMemo;
  function ul(a) { return h('ul', null, a.map(function (x, i) { return h('li', { key: i }, x); })); }

  /* ======================= SUSTAINABLE LIVING ======================= */
  // [item, where, tip]
  var BINS = { R: ['Recycling bin', '♻️'], X: ['Rubbish bin', '🗑️'], F: ['Food scraps / compost', '🍂'], D: ['Drop-off or special collection', '📍'], O: ['Op shop, reuse or donate', '💚'] };
  var ITEMS = [
    ['Glass bottles and jars', 'R', 'Empty and rinse. Remove lids and put them in the rubbish (or a metal-lid collection if your council has one).'],
    ['Drinking glasses, window glass, Pyrex, mirrors', 'X', 'These melt at different temperatures from bottle glass. Wrap broken glass before binning.'],
    ['Paper and newspaper', 'R', 'Keep it dry. Shredded paper is best composted.'],
    ['Cardboard boxes', 'R', 'Flatten. Remove plastic tape where you can.'],
    ['Pizza boxes', 'R', 'Clean parts can be recycled; tear off greasy or food-stained parts and compost or bin them. Check your council.'],
    ['Plastic bottles, trays and tubs marked 1, 2 or 5', 'R', 'Rinse, remove lids, and keep them bigger than 50 mm and no more than 4 litres.'],
    ['Plastics marked 3, 4, 6 or 7', 'X', 'Not accepted in kerbside recycling anywhere in New Zealand.'],
    ['Bottle lids and caps', 'X', 'Too small to sort. Some schools and charities collect lids — ask locally.'],
    ['Small items under 50 mm', 'X', 'Such as spice jars, cosmetic sample tubs and caps — they fall through the sorting machines.'],
    ['Aluminium and steel cans', 'R', 'Rinse. Leave labels on.'],
    ['Aerosol cans', 'X', 'Not accepted kerbside. Some transfer stations take empty aerosols — check.'],
    ['Aluminium foil and foil trays', 'X', 'Not accepted kerbside. Reuse clean foil where possible.'],
    ['Milk and juice cartons (Tetra Pak)', 'X', 'Liquid paperboard is not accepted kerbside. Choose bottles or refills where you can.'],
    ['Soft plastics (bread bags, wrappers)', 'D', 'Not kerbside. Some supermarkets and stores have soft plastic drop-off bins — check which items they take.'],
    ['Coffee cups (takeaway)', 'X', 'Most are plastic-lined. Bring a reusable cup.'],
    ['Food scraps', 'F', 'Use your council food-scraps bin if you have one, or a home compost, worm farm or bokashi.'],
    ['Garden waste', 'F', 'Compost, mulch, or use a garden-waste collection.'],
    ['Batteries (all types)', 'D', 'Never put batteries in any bin — they cause fires in trucks and plants. Use battery drop-off points.'],
    ['Phones, laptops and e-waste', 'D', 'Take to an e-waste drop-off or a retailer take-back. Wipe your data first.'],
    ['Light bulbs and fluorescent tubes', 'D', 'Fluorescent bulbs contain mercury — use a drop-off. Standard incandescent bulbs go in the rubbish, wrapped.'],
    ['Paint and chemicals', 'D', 'Take to a hazardous waste or paint take-back drop-off. Never pour down drains.'],
    ['Medicines', 'D', 'Return unused or expired medicines to a pharmacy.'],
    ['Clothes and shoes in good condition', 'O', 'Donate to an op shop or clothing bin. Worn-out textiles can become rags.'],
    ['Furniture and appliances', 'O', 'Sell, give away or donate. Large items can go to a transfer station or inorganic collection.'],
    ['Nappies', 'X', 'Wrap and bin. Reusable cloth nappies cut waste.'],
    ['Tissues and paper towels', 'F', 'Compost if not contaminated with chemicals; otherwise rubbish.'],
    ['Plastic bags', 'D', 'Single-use plastic shopping bags are banned in NZ. Reuse thicker bags; use soft plastic drop-off where available.'],
    ['Polystyrene', 'X', 'Not accepted kerbside. Avoid where you can.'],
    ['Gas bottles (LPG)', 'D', 'Swap or return to a gas retailer — never in a bin.'],
    ['Car batteries and oil', 'D', 'Most service stations and transfer stations accept these.']
  ];
  var TIPS = [
    ['Recycle right', ['Since 1 February 2024 every council takes the same materials in household kerbside recycling: glass bottles and jars, paper and cardboard, plastic bottles, trays and containers marked 1, 2 and 5, and aluminium and steel cans.', 'Lids off, rinse quickly, and keep it loose — not bagged.', 'If in doubt, leave it out. One wrong item can contaminate a whole load.', 'Soft plastics, aerosols, cartons, foil, items smaller than 50 mm and items bigger than 4 litres do not go in kerbside recycling.']],
    ['Cut food waste', ['Plan meals for the week and shop with a list (see Family Together › Shopping Made Simple).', 'Store food well: herbs in water, bread in the freezer, leftovers labelled with a date.', 'Use the “first in, first out” rule in the fridge and pantry.', 'Compost, worm farm or bokashi bin for scraps. Many councils sell subsidised compost bins and worm farms.', 'Love Food Hate Waste NZ has recipes for leftovers.']],
    ['Save power', ['Switch to LED bulbs — they use far less power than incandescent bulbs.', 'Set heat pumps to about 18–21 °C in winter and clean filters regularly.', 'Wash clothes in cold water and dry them outside or on a rack.', 'Turn appliances off at the wall when not in use.', 'Keep your hot water cylinder at 60 °C or above to prevent Legionella; lagging the pipes saves heat.', 'Gen Less (EECA) has independent advice on home energy.']],
    ['Save water', ['Keep showers to about four minutes and fit a low-flow showerhead.', 'Fix dripping taps — one drip a second can waste thousands of litres a year.', 'Run dishwashers and washing machines only when full.', 'Water the garden early or late, and mulch to keep moisture in.', 'Collect rainwater for the garden where your council allows.']],
    ['Shop and live lightly', ['Bring reusable bags, cups and containers.', 'Choose refills, bulk bins and products with less packaging.', 'Buy second-hand: op shops, Marketplace and Trade Me.', 'Repair before you replace — look for a local Repair Café.', 'Borrow tools from neighbours, a tool library or a toy library.']],
    ['Get around greener', ['Walk, scoot or cycle for short trips — many schools run walking school buses.', 'Use public transport where you can, and car-pool for regular journeys.', 'Keep tyres pumped up and remove roof racks when not in use to save fuel.', 'Combine errands into one trip.']],
    ['Garden for nature', ['Plant natives such as harakeke (flax), kōwhai and pūriri to feed tūī, korimako (bellbirds) and kererū.', 'Leave a corner a little wild for insects and lizards.', 'Use mulch instead of sprays, and avoid slug pellets that can harm pets and birds.', 'Keep cats in at night to protect native birds and lizards.']]
  ];
  var CHALLENGES = ['Take reusable bags on every shop this week', 'Have one meat-free day', 'Fix or repair one broken item', 'Sort a cupboard and donate what you do not need', 'Try a “no food waste” week', 'Walk, scoot or bike for one regular trip', 'Swap five light bulbs for LEDs', 'Start a compost, worm farm or bokashi bin', 'Plant a native tree or shrub', 'Join a beach, river or park clean-up', 'Take a reusable cup for every takeaway coffee', 'Shorten showers to four minutes', 'Buy something second-hand instead of new', 'Make a family “recycle right” poster for the kitchen'];
  JNZX.register('x:sustainable', function SustainablePage(props) {
    var q = useState(''), qq = q[0], setQ = q[1];
    var d = JNZX.useStored('jnzx-eco-done', {}), done = d[0], setDone = d[1];
    var rows = ITEMS.filter(function (x) { return !qq || (x[0] + ' ' + x[2]).toLowerCase().indexOf(qq.toLowerCase()) >= 0; });
    var count = CHALLENGES.filter(function (c) { return done[c]; }).length;
    return h('div', null,
      JNZX.Header('COMMUNITY · SUSTAINABLE LIVING', 'Live lightly, together.', 'Recycling made simple under New Zealand’s national kerbside rules, plus practical ways to waste less, save power and water, and care for Papatūānuku.'),
      h('div', { className: 'jx-cards3 jx-bins' },
        h('div', { className: 'jx-card jx-bin-r' }, h('h3', null, '♻️ Yes — recycling bin'), ul(['Glass bottles and jars (lids off)', 'Paper and cardboard', 'Plastic bottles, trays and tubs marked 1, 2 and 5', 'Aluminium and steel cans'])),
        h('div', { className: 'jx-card jx-bin-x' }, h('h3', null, '🚫 No — not kerbside recycling'), ul(['Lids of any kind', 'Plastics 3, 4, 6 and 7', 'Soft plastics and plastic bags', 'Aerosols, foil and foil trays', 'Cartons (Tetra Pak)', 'Items smaller than 50 mm or bigger than 4 litres'])),
        h('div', { className: 'jx-card jx-bin-d' }, h('h3', null, '📍 Take to a drop-off'), ul(['Batteries — never in any bin', 'E-waste and phones', 'Paint, chemicals and gas bottles', 'Medicines (to a pharmacy)', 'Fluorescent bulbs']))),
      h('h2', null, 'Can I recycle this?'),
      h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Type an item, e.g. pizza box, battery, yoghurt pottle' }),
      h('div', { className: 'jx-table-wrap' }, h('table', null, h('tbody', null, rows.map(function (x) { var b = BINS[x[1]]; return h('tr', { key: x[0] }, h('th', null, x[0]), h('td', { className: 'jx-bin-tag jx-tag-' + x[1] }, b[1] + ' ' + b[0]), h('td', null, x[2])); })))),
      !rows.length && h('p', null, 'Not listed. Check your council’s recycling guide — or if in doubt, leave it out.'),
      h('p', { className: 'small-note' }, 'Collection rules for rubbish, food scraps, garden waste and drop-offs vary between councils. Check your local council website for days, bins and drop-off locations.'),
      h('h2', null, 'Everyday ways to make a difference'),
      h(JNZX.Accordion, { openFirst: true, items: TIPS.map(function (t) { return { title: t[0], body: function () { return ul(t[1]); } }; }) }),
      h('h2', null, 'Family eco challenge'),
      h('p', { className: 'jx-muted' }, count + ' of ' + CHALLENGES.length + ' done. Tick them off as a family — progress is saved on this device.'),
      h('div', { className: 'jx-progress' }, h('span', { style: { width: count / CHALLENGES.length * 100 + '%' } })),
      h('div', { className: 'jx-checks' }, CHALLENGES.map(function (c) { return h('label', { key: c, className: 'jx-check' }, h('input', { type: 'checkbox', checked: !!done[c], onChange: function (e) { var o = Object.assign({}, done); o[c] = e.target.checked; setDone(o); } }), h('span', null, c)); })),
      h('div', { className: 'jx-note' }, h('strong', null, 'Kaitiakitanga: '), 'Caring for the environment is a shared responsibility — for our tamariki and mokopuna, and for the whenua, the awa and the moana we share.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true }));
  });

  /* ======================= OFFICE SHORTCUTS ======================= */
  // app: [section, [keys, action]...]
  var SC = {
    'All Office apps': [
      ['Files', [['Ctrl+N', 'New document, workbook, presentation or item'], ['Ctrl+O', 'Open'], ['Ctrl+S', 'Save'], ['F12', 'Save As'], ['Ctrl+P', 'Print'], ['Ctrl+W', 'Close the current file or window'], ['Ctrl+F2', 'Print preview (Word, PowerPoint)']]],
      ['Editing', [['Ctrl+C', 'Copy'], ['Ctrl+X', 'Cut'], ['Ctrl+V', 'Paste'], ['Ctrl+Z', 'Undo'], ['Ctrl+Y', 'Redo or repeat'], ['Ctrl+A', 'Select all'], ['Ctrl+F', 'Find (in Outlook this forwards a message)'], ['Ctrl+H', 'Replace (Word, Excel, PowerPoint)'], ['Ctrl+K', 'Insert a hyperlink'], ['F7', 'Spelling and grammar check']]],
      ['Formatting', [['Ctrl+B', 'Bold'], ['Ctrl+I', 'Italic'], ['Ctrl+U', 'Underline'], ['Ctrl+Shift+C', 'Copy formatting (Word, PowerPoint)'], ['Ctrl+Shift+V', 'Paste formatting (PowerPoint, older Word) — in current Microsoft 365 Word it pastes as text only']]],
      ['Getting around', [['Alt', 'Show ribbon key tips — then press the letters shown'], ['Alt+Q', 'Jump to the Search / “Tell me” box (Microsoft 365)'], ['F1', 'Help'], ['Ctrl+F1', 'Show or hide the ribbon'], ['F6', 'Move between ribbon, document and status bar']]]
    ],
    'Word': [
      ['Text and paragraphs', [['Ctrl+E', 'Centre align'], ['Ctrl+L', 'Left align'], ['Ctrl+R', 'Right align'], ['Ctrl+J', 'Justify'], ['Ctrl+1 / Ctrl+2 / Ctrl+5', 'Single / double / 1.5 line spacing'], ['Ctrl+M / Ctrl+Shift+M', 'Indent / remove indent'], ['Ctrl+T', 'Hanging indent'], ['Ctrl+Q', 'Remove paragraph formatting'], ['Ctrl+Space', 'Remove character formatting']]],
      ['Styles and lists', [['Ctrl+Shift+N', 'Apply Normal style'], ['Ctrl+Alt+1 / 2 / 3', 'Apply Heading 1 / 2 / 3'], ['Ctrl+Shift+L', 'Apply List Bullet style'], ['Ctrl+Shift+S', 'Apply Styles box']]],
      ['Font', [['Ctrl+D', 'Font dialog'], ['Ctrl+Shift+> / Ctrl+Shift+<', 'Increase / decrease font size'], ['Ctrl+] / Ctrl+[', 'Increase / decrease font by 1 point'], ['Shift+F3', 'Change case (lower, UPPER, Title)'], ['Ctrl+= / Ctrl+Shift+=', 'Subscript / superscript']]],
      ['Insert', [['Ctrl+Enter', 'Page break'], ['Ctrl+Alt+M', 'New comment'], ['Alt+Ctrl+F', 'Footnote'], ['Alt+Ctrl+D', 'Endnote'], ['Alt+Shift+D', 'Current date'], ['Alt+Shift+T', 'Current time'], ['Ctrl+Alt+C / T / R', '© / ™ / ®']]],
      ['Review and navigate', [['Ctrl+Shift+E', 'Turn Track Changes on or off'], ['Shift+F7', 'Thesaurus'], ['Ctrl+Shift+8', 'Show or hide formatting marks (¶)'], ['Ctrl+G', 'Go to a page, section or bookmark'], ['Ctrl+Home / Ctrl+End', 'Start / end of the document'], ['Ctrl+Backspace / Ctrl+Delete', 'Delete one word left / right'], ['F4', 'Repeat the last action']]]
    ],
    'Excel': [
      ['Move and select', [['Ctrl+Arrow key', 'Move to the edge of the data region'], ['Ctrl+Shift+Arrow key', 'Select to the edge of the data region'], ['Ctrl+Space', 'Select the whole column'], ['Shift+Space', 'Select the whole row'], ['Ctrl+Home / Ctrl+End', 'Go to A1 / the last used cell'], ['Ctrl+Page Up / Page Down', 'Previous / next worksheet'], ['Ctrl+G or F5', 'Go to']]],
      ['Enter and edit', [['F2', 'Edit the active cell'], ['Alt+Enter', 'New line inside a cell'], ['Ctrl+Enter', 'Fill the selected cells with the current entry'], ['Ctrl+D / Ctrl+R', 'Fill down / fill right'], ['Ctrl+E', 'Flash Fill'], ['Ctrl+;', 'Insert today’s date'], ['Ctrl+Shift+;', 'Insert the current time'], ['Ctrl+Alt+V', 'Paste Special']]],
      ['Formulas', [['=', 'Start a formula'], ['Alt+=', 'AutoSum'], ['F4', 'Cycle absolute/relative references ($A$1)'], ['Ctrl+`', 'Show formulas'], ['F9', 'Calculate all workbooks'], ['Shift+F3', 'Insert function'], ['Ctrl+Shift+U', 'Expand or collapse the formula bar']]],
      ['Format', [['Ctrl+1', 'Format Cells dialog'], ['Ctrl+Shift+$', 'Currency format'], ['Ctrl+Shift+%', 'Percentage format'], ['Ctrl+Shift+!', 'Number format with thousands separator'], ['Ctrl+Shift+#', 'Date format'], ['Ctrl+Shift+&', 'Add outline border'], ['Ctrl+Shift+_', 'Remove borders']]],
      ['Tables, rows and charts', [['Ctrl+T', 'Create a table'], ['Ctrl+Shift+L', 'Turn filters on or off'], ['Alt+Down Arrow', 'Open a filter or drop-down list'], ['Ctrl++ / Ctrl+-', 'Insert / delete cells, rows or columns'], ['Ctrl+9 / Ctrl+0', 'Hide rows / hide columns'], ['Shift+F11', 'Insert a new worksheet'], ['Alt+F1', 'Create a chart on this sheet'], ['F11', 'Create a chart on a new sheet']]]
    ],
    'PowerPoint': [
      ['Building slides', [['Ctrl+M', 'New slide'], ['Ctrl+D', 'Duplicate the selected slide or object'], ['Ctrl+G / Ctrl+Shift+G', 'Group / ungroup objects'], ['Ctrl+Shift+C / Ctrl+Shift+V', 'Copy / paste formatting'], ['Ctrl+] / Ctrl+[', 'Increase / decrease font size'], ['Shift + drag', 'Keep proportions or move in a straight line'], ['Ctrl + drag', 'Copy an object'], ['Alt+F9', 'Show or hide guides']]],
      ['Presenting', [['F5', 'Start from the first slide'], ['Shift+F5', 'Start from the current slide'], ['Alt+F5', 'Start in Presenter View'], ['Esc', 'End the slide show'], ['N, Space or →', 'Next slide or animation'], ['P or ←', 'Previous slide'], ['Number + Enter', 'Go to that slide'], ['B / W', 'Black / white screen (press again to return)'], ['Ctrl+P', 'Pen during a slide show'], ['Ctrl+L', 'Laser pointer'], ['E', 'Erase ink on the slide'], ['Ctrl+A', 'Show the arrow pointer'], ['Ctrl+H', 'Hide the pointer']]]
    ],
    'Outlook': [
      ['Navigate', [['Ctrl+1', 'Mail'], ['Ctrl+2', 'Calendar'], ['Ctrl+3', 'People (contacts)'], ['Ctrl+4', 'Tasks'], ['Ctrl+Y', 'Go to a folder'], ['Ctrl+E or F3', 'Search']]],
      ['Messages', [['Ctrl+N', 'New item in the current view'], ['Ctrl+Shift+M', 'New email from anywhere'], ['Ctrl+R', 'Reply'], ['Ctrl+Shift+R', 'Reply all'], ['Ctrl+F', 'Forward'], ['Alt+S', 'Send'], ['Ctrl+K', 'Check names'], ['Ctrl+Shift+B', 'Address book'], ['Ctrl+Q / Ctrl+U', 'Mark as read / unread'], ['Insert', 'Flag or unflag'], ['Backspace', 'Archive (Outlook 2016 and later)'], ['Ctrl+D or Delete', 'Delete'], ['Ctrl+Shift+V', 'Move to a folder'], ['F9', 'Send/receive all']]],
      ['Calendar', [['Ctrl+Shift+A', 'New appointment'], ['Ctrl+Shift+Q', 'New meeting request'], ['Ctrl+G', 'Go to a date'], ['Alt+1 … Alt+0', 'Show 1 to 10 days']]]
    ],
    'Teams': [
      ['General', [['Ctrl+.', 'Show all keyboard shortcuts'], ['Ctrl+E', 'Go to search'], ['Ctrl+N', 'Start a new chat'], ['Ctrl+1 … Ctrl+6', 'Open Activity, Chat, Teams, Calendar, Calls, Files (order may vary)'], ['Ctrl+Shift+X', 'Expand the compose box'], ['Alt+Shift+R', 'Reply to a thread']]],
      ['Meetings and calls', [['Ctrl+Shift+M', 'Mute or unmute'], ['Ctrl+Shift+O', 'Turn camera on or off'], ['Ctrl+Shift+K', 'Raise or lower your hand'], ['Ctrl+Shift+E', 'Start screen sharing'], ['Ctrl+Shift+P', 'Turn background blur on or off'], ['Ctrl+Shift+S', 'Accept an audio call'], ['Ctrl+Shift+D', 'Decline a call'], ['Ctrl+Shift+H', 'Leave the call or meeting']]]
    ],
    'OneNote': [
      ['Notes', [['Ctrl+N', 'New page'], ['Ctrl+1', 'To Do tag (checkbox)'], ['Ctrl+.', 'Bulleted list'], ['Ctrl+/', 'Numbered list'], ['Ctrl+Alt+1 / 2 / 3', 'Heading 1 / 2 / 3'], ['Ctrl+Shift+N', 'Clear formatting'], ['Alt+Shift+D', 'Insert date'], ['Alt+Shift+F', 'Insert date and time'], ['Ctrl+K', 'Insert a link'], ['Ctrl+E', 'Search all notebooks']]]
    ],
    'Windows': [
      ['Everyday', [['Win', 'Open Start'], ['Win+E', 'File Explorer'], ['Win+D', 'Show the desktop'], ['Win+L', 'Lock the computer'], ['Win+I', 'Settings'], ['Win+V', 'Clipboard history'], ['Win+.', 'Emoji panel'], ['Win+H', 'Voice typing'], ['Win+Shift+S', 'Screenshot a region (Snipping Tool)'], ['Win+PrtScn', 'Save a full-screen screenshot']]],
      ['Windows and apps', [['Alt+Tab', 'Switch between apps'], ['Win+Tab', 'Task View'], ['Win+Arrow keys', 'Snap windows to the sides or maximise'], ['Win+Ctrl+D', 'New virtual desktop'], ['Ctrl+Shift+Esc', 'Task Manager'], ['Win+R', 'Run'], ['Win+P', 'Project to a second screen'], ['F2', 'Rename the selected file'], ['Ctrl+Shift+N', 'New folder in File Explorer']]]
    ]
  };

  // Mac versions (Microsoft 365 for Mac and macOS). '—' means there is no direct Mac shortcut.
  var MAC = {
    'All Office apps|F12': 'Cmd+Shift+S', 'All Office apps|Ctrl+F2': 'Cmd+P', 'All Office apps|Ctrl+Y': 'Cmd+Y or Cmd+Shift+Z', 'All Office apps|Ctrl+H': 'Ctrl+H or Cmd+Shift+H',
    'All Office apps|F7': 'Cmd+Option+L', 'All Office apps|Alt': '—', 'All Office apps|Alt+Q': '—', 'All Office apps|F1': 'Cmd+/', 'All Office apps|Ctrl+F1': 'Cmd+Option+R', 'All Office apps|F6': '—',
    'Word|Ctrl+Space': 'Ctrl+Space', 'Word|Shift+F3': 'Fn+Shift+F3', 'Word|Ctrl+Enter': 'Cmd+Return', 'Word|Ctrl+Alt+M': 'Cmd+Option+A', 'Word|Alt+Ctrl+F': 'Cmd+Option+F', 'Word|Alt+Ctrl+D': 'Cmd+Option+E',
    'Word|Alt+Shift+D': 'Ctrl+Shift+D', 'Word|Alt+Shift+T': 'Ctrl+Shift+T', 'Word|Ctrl+Alt+C / T / R': 'Option+G / Option+2 / Option+R', 'Word|Shift+F7': 'Fn+Shift+F7', 'Word|Ctrl+Shift+8': 'Cmd+8',
    'Word|Ctrl+G': 'Cmd+Option+G', 'Word|Ctrl+Home / Ctrl+End': 'Cmd+Fn+← / Cmd+Fn+→', 'Word|Ctrl+Backspace / Ctrl+Delete': 'Option+Delete / Option+Fn+Delete', 'Word|F4': 'Cmd+Y',
    'Excel|Ctrl+Space': 'Ctrl+Space', 'Excel|Ctrl+Home / Ctrl+End': 'Fn+Ctrl+← / Fn+Ctrl+→', 'Excel|Ctrl+Page Up / Page Down': 'Option+← / Option+→', 'Excel|Ctrl+G or F5': 'Ctrl+G',
    'Excel|F2': 'Ctrl+U', 'Excel|Alt+Enter': 'Ctrl+Option+Return', 'Excel|Ctrl+Enter': 'Ctrl+Return', 'Excel|Ctrl+E': 'Ctrl+E', 'Excel|Ctrl+;': 'Ctrl+;', 'Excel|Ctrl+Shift+;': 'Cmd+;',
    'Excel|Ctrl+Alt+V': 'Cmd+Ctrl+V', 'Excel|Alt+=': 'Cmd+Shift+T', 'Excel|F4': 'Cmd+T', 'Excel|Ctrl+`': 'Ctrl+`', 'Excel|F9': 'Cmd+=', 'Excel|Shift+F3': 'Fn+Shift+F3', 'Excel|Ctrl+Shift+U': 'Ctrl+Shift+U',
    'Excel|Ctrl+Shift+$': 'Ctrl+Shift+$', 'Excel|Ctrl+Shift+%': 'Ctrl+Shift+%', 'Excel|Ctrl+Shift+!': 'Ctrl+Shift+!', 'Excel|Ctrl+Shift+#': 'Ctrl+Shift+#', 'Excel|Ctrl+Shift+&': 'Cmd+Option+0', 'Excel|Ctrl+Shift+_': 'Cmd+Option+-',
    'Excel|Ctrl+T': 'Ctrl+T', 'Excel|Ctrl+Shift+L': 'Cmd+Shift+F', 'Excel|Ctrl++ / Ctrl+-': 'Cmd+Shift++ / Cmd+-', 'Excel|Ctrl+9 / Ctrl+0': 'Ctrl+9 / Ctrl+0', 'Excel|Shift+F11': 'Fn+Shift+F11', 'Excel|Alt+F1': 'Fn+Option+F1', 'Excel|F11': 'Fn+F11',
    'PowerPoint|Ctrl+M': 'Cmd+Shift+N', 'PowerPoint|Ctrl+G / Ctrl+Shift+G': 'Cmd+Option+G / Cmd+Option+Shift+G', 'PowerPoint|Ctrl + drag': 'Option + drag', 'PowerPoint|Alt+F9': '—',
    'PowerPoint|F5': 'Cmd+Shift+Return', 'PowerPoint|Shift+F5': 'Cmd+Return', 'PowerPoint|Alt+F5': 'Option+Return', 'PowerPoint|Number + Enter': 'Number + Return', 'PowerPoint|Ctrl+H': 'Ctrl+H',
    'Outlook|Ctrl+Y': '—', 'Outlook|Ctrl+E or F3': 'Cmd+Option+F', 'Outlook|Ctrl+Shift+M': 'Cmd+N (in Mail)', 'Outlook|Ctrl+F': 'Cmd+J', 'Outlook|Alt+S': 'Cmd+Return', 'Outlook|Ctrl+K': 'Ctrl+Cmd+C',
    'Outlook|Ctrl+Shift+B': '—', 'Outlook|Ctrl+Q / Ctrl+U': 'Cmd+T / Cmd+Shift+T', 'Outlook|Insert': '—', 'Outlook|Backspace': '—', 'Outlook|Ctrl+D or Delete': 'Delete', 'Outlook|Ctrl+Shift+V': 'Cmd+Shift+M',
    'Outlook|F9': 'Cmd+K', 'Outlook|Ctrl+Shift+A': 'Cmd+N (in Calendar)', 'Outlook|Ctrl+Shift+Q': '—', 'Outlook|Ctrl+G': '—', 'Outlook|Alt+1 … Alt+0': '—',
    'OneNote|Alt+Shift+D': 'Cmd+D', 'OneNote|Alt+Shift+F': 'Cmd+Shift+D', 'OneNote|Ctrl+E': 'Cmd+Option+F',
    'Windows|Win': 'Cmd+Space', 'Windows|Win+E': 'Cmd+Option+Space', 'Windows|Win+D': 'Cmd+F3', 'Windows|Win+L': 'Ctrl+Cmd+Q', 'Windows|Win+I': '—', 'Windows|Win+V': '—', 'Windows|Win+.': 'Ctrl+Cmd+Space',
    'Windows|Win+H': 'Fn Fn', 'Windows|Win+Shift+S': 'Cmd+Shift+4', 'Windows|Win+PrtScn': 'Cmd+Shift+3', 'Windows|Alt+Tab': 'Cmd+Tab', 'Windows|Win+Tab': 'Ctrl+↑', 'Windows|Win+Arrow keys': 'Fn+Ctrl+Arrow keys',
    'Windows|Win+Ctrl+D': '—', 'Windows|Ctrl+Shift+Esc': 'Cmd+Option+Esc', 'Windows|Win+R': 'Cmd+Space', 'Windows|Win+P': 'Cmd+F1', 'Windows|F2': 'Return', 'Windows|Ctrl+Shift+N': 'Cmd+Shift+N'
  };
  var MAC_DESC = { 'Windows|Win': 'Spotlight search (open apps and files)', 'Windows|Win+E': 'Finder search window', 'Windows|Win+I': 'Apple menu › System Settings', 'Windows|Win+V': 'No built-in clipboard history',
    'Windows|Win+H': 'Dictation (press Fn twice)', 'Windows|Win+Tab': 'Mission Control', 'Windows|Win+Arrow keys': 'Tile windows (macOS Sequoia and later)', 'Windows|Win+Ctrl+D': 'Add a desktop in Mission Control',
    'Windows|Ctrl+Shift+Esc': 'Force Quit apps', 'Windows|Win+R': 'Open an app with Spotlight', 'Windows|Win+P': 'Mirror displays', 'Windows|F2': 'Rename the selected file (Finder)', 'Windows|Ctrl+Shift+N': 'New folder in Finder',
    'All Office apps|Alt': 'Use the menu bar instead of ribbon key tips', 'All Office apps|Alt+Q': 'Click the search box at the top of the window', 'Outlook|Ctrl+Y': 'Use the folder list', 'Outlook|Ctrl+G': 'Use the mini calendar' };
  function toMac(app, k) {
    var key = app + '|' + k;
    if (Object.prototype.hasOwnProperty.call(MAC, key)) return MAC[key];
    return k.replace(/Ctrl\+/g, 'Cmd+').replace(/Ctrl \+/g, 'Cmd +').replace(/Alt\+/g, 'Option+').replace(/\bWin\b/g, 'Cmd').replace(/\bEnter\b/g, 'Return').replace(/\bBackspace\b/g, 'Delete');
  }
  JNZX.macKeys = toMac;
  function Keys(props) { return h('span', { className: 'jx-keys' }, props.k.split(' / ').map(function (combo, i) { return h(R.Fragment, { key: i }, i > 0 && h('span', { className: 'jx-or' }, ' / '), combo.split(' or ').map(function (c, j) { return h(R.Fragment, { key: j }, j > 0 && h('span', { className: 'jx-or' }, ' or '), c.split(/\+(?!$)/).map(function (k, n) { return h(R.Fragment, { key: n }, n > 0 && '+', h('kbd', null, k.trim())); })); })); })); }
  JNZX.register('x:shortcuts', function ShortcutsPage(props) {
    var a = useState('All apps'), app = a[0], setApp = a[1];
    var q = useState(''), qq = q[0], setQ = q[1];
    var m = JNZX.useStored('jnzx-sc-mac', false), mac = m[0], setMac = m[1];
    var apps = Object.keys(SC);
    var shown = (app === 'All apps' ? apps : [app]).map(function (ap) {
      return [ap, SC[ap].map(function (sec) { return [sec[0], sec[1].filter(function (r) { return !qq || (r[0] + ' ' + r[1]).toLowerCase().indexOf(qq.toLowerCase()) >= 0; })]; }).filter(function (sec) { return sec[1].length; })];
    }).filter(function (x) { return x[1].length; });
    function macify(k, ap) { return mac ? toMac(ap, k) : k; }
    var total = apps.reduce(function (n, ap) { return n + SC[ap].reduce(function (m2, s) { return m2 + s[1].length; }, 0); }, 0);
    return h('div', null,
      JNZX.Header('MODERN & LIFESTYLE · OFFICE SHORTCUTS', 'Work faster with keyboard shortcuts.', total + ' tried-and-true shortcuts for Word, Excel, PowerPoint, Outlook, Teams, OneNote and Windows — with Mac keys too. Search, print a cheat sheet or share this page with your team.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true, label: 'Share this page', text: 'Keyboard shortcuts for Word, Excel, PowerPoint, Outlook and Teams' }),
      h('div', { className: 'jx-row jx-noprint' }, h(JNZX.Search, { value: qq, onChange: setQ, placeholder: 'Search, e.g. date, paste, mute' }),
        h('div', { className: 'jx-os', role: 'group', 'aria-label': 'Computer' }, h('button', { type: 'button', className: !mac ? 'is-on' : '', 'aria-pressed': !mac, onClick: function () { setMac(false); } }, '🪟 Windows'), h('button', { type: 'button', className: mac ? 'is-on' : '', 'aria-pressed': mac, onClick: function () { setMac(true); } }, '🍎 Mac'))),
      mac && h('p', { className: 'small-note jx-mac-note' }, '🍎 Showing Mac keys for Microsoft 365 for Mac and macOS. Cmd = ⌘ Command · Option = ⌥ · Ctrl = ⌃ Control · Shift = ⇧. On laptops, F-keys may need Fn.'),
      h(JNZX.Chips, { label: 'App', options: ['All apps'].concat(apps), value: app, onChange: setApp }),
      shown.map(function (ap) {
        return h('section', { key: ap[0], className: 'jx-sc-app' }, h('h2', null, mac && ap[0] === 'Windows' ? 'macOS (instead of Windows)' : ap[0]),
          h('div', { className: 'jx-sc-grid' }, ap[1].map(function (sec) {
            return h('div', { key: sec[0], className: 'jx-card jx-sc-card' }, h('h3', null, sec[0]),
              h('table', null, h('tbody', null, sec[1].map(function (r) { var mk = macify(r[0], ap[0]), md = mac && MAC_DESC[ap[0] + '|' + r[0]]; return h('tr', { key: r[0] + r[1] }, h('td', { className: 'jx-sc-k' }, mk === '—' ? h('span', { className: 'jx-muted' }, 'Not on Mac') : h(Keys, { k: mk })), h('td', null, md || r[1])); }))));
          })));
      }),
      !shown.length && h('p', null, 'No shortcuts match “' + qq + '”.'),
      h('div', { className: 'jx-note' }, h('strong', null, 'Tips: '), 'In Microsoft 365 apps, press Alt to see a letter on every ribbon command — no memorising needed. Shortcuts can differ slightly between versions, languages and Mac, web and Windows editions; in a web browser, some shortcuts are taken by the browser itself. On a Mac, most Ctrl shortcuts use Cmd, but not all.'),
      h(JNZX.ShareBar, { tab: props.tab, printable: true, text: 'Keyboard shortcuts for Word, Excel, PowerPoint, Outlook and Teams' }));
  });
})();
