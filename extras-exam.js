/* The James NZ — Exam English with Mateo (October 2026).
   Writing and speaking practice for IELTS (Academic and General Training),
   Cambridge B2 First, C1 Advanced, C2 Proficiency and the New Zealand
   Certificate in English Language (NZCEL). Original tasks, a timer, a live word
   count and instant feedback with an indicative practice score. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect, useMemo = R.useMemo;

  /* ---------------- the tasks ---------------- */
  // kind: essay | letter | chart | article | review | report | proposal | email | summary | message
  var EXAMS = [
    { id: 'ielts-a1', exam: 'IELTS', group: 'IELTS Academic', name: 'Writing Task 1 · Describe data', kind: 'chart', mins: 20, min: 150, max: 0, scale: 'ielts',
      how: 'Summarise the main features, make comparisons and give an overview. Don’t give your opinion. Write at least 150 words.',
      prompts: [
        { q: 'The table shows the percentage of households in one city that recycled four types of waste in 2010 and 2025. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.', table: [['Waste', '2010', '2025'], ['Paper', '48%', '71%'], ['Glass', '35%', '62%'], ['Plastic', '12%', '44%'], ['Food scraps', '4%', '38%']] },
        { q: 'The table gives the average number of hours per week that young people (16–24) spent on four activities in 2015 and 2025. Summarise the main features and make comparisons where relevant.', table: [['Activity', '2015', '2025'], ['Watching TV', '14', '6'], ['Online video', '7', '19'], ['Sport', '5', '4'], ['Reading for fun', '4', '2']] },
        { q: 'The table shows how visitors travelled to a national park in summer and winter. Summarise the information and make comparisons where relevant.', table: [['Transport', 'Summer', 'Winter'], ['Private car', '62%', '74%'], ['Tour bus', '21%', '9%'], ['Bicycle', '11%', '2%'], ['Shuttle', '6%', '15%']] },
        { q: 'The process below shows how a small community garden turns food scraps into compost. Summarise the information by describing the stages.', table: [['Stage', 'What happens'], ['1', 'Households drop scraps in sealed bins'], ['2', 'Volunteers mix scraps with leaves and cardboard'], ['3', 'Piles rest for 8–10 weeks and are turned weekly'], ['4', 'Compost is sieved and bagged'], ['5', 'Bags are given back to gardeners']] }
      ] },
    { id: 'ielts-g1', exam: 'IELTS', group: 'IELTS General Training', name: 'Writing Task 1 · Letter', kind: 'letter', mins: 20, min: 150, max: 0, scale: 'ielts',
      how: 'Cover all three bullet points. Choose the right tone (formal, semi-formal or friendly). Write at least 150 words. Begin “Dear …”.',
      prompts: [
        { q: 'You recently bought a kitchen appliance online, but it arrived damaged. Write a letter to the company. In your letter: • describe what you bought and when • explain what is wrong with it • say what you would like the company to do.' },
        { q: 'A friend from overseas is coming to stay with you for a week. Write a letter to your friend. In your letter: • suggest some things you could do together • explain what the weather will be like • tell them what they should bring.' },
        { q: 'Your neighbour’s dog barks for long periods when they are at work. Write a letter to your neighbour. In your letter: • introduce yourself • describe the problem and how it affects you • suggest a solution.' },
        { q: 'You would like to do a part-time course at a local college. Write a letter to the college. In your letter: • say which course you are interested in and why • ask about times and fees • explain any special needs you have.' }
      ] },
    { id: 'ielts-2', exam: 'IELTS', group: 'IELTS Academic & General', name: 'Writing Task 2 · Essay', kind: 'essay', mins: 40, min: 250, max: 0, scale: 'ielts', opinion: true,
      how: 'Answer every part of the question, give a clear position, support your ideas with reasons and examples, and write at least 250 words in 4–5 paragraphs.',
      prompts: [
        { q: 'Some people believe that children should start learning a second language at primary school, while others think it is better to wait until secondary school. Discuss both views and give your own opinion.' },
        { q: 'In many cities, people spend a long time travelling to and from work each day. What problems does this cause, and what can be done to solve them?' },
        { q: 'More and more people are working from home. Do the advantages of this development outweigh the disadvantages?' },
        { q: 'Some people think that governments should spend money on public transport rather than on building new roads. To what extent do you agree or disagree?' },
        { q: 'Online shopping is replacing shopping in local stores. Is this a positive or negative development?' },
        { q: 'Many young people today want to become famous. Why is this, and is it a good thing?' }
      ] },
    { id: 'b2-1', exam: 'Cambridge', group: 'B2 First', name: 'Writing Part 1 · Essay', kind: 'essay', mins: 40, min: 140, max: 190, scale: 'b2', opinion: true,
      how: 'Write an essay using both notes and add a third idea of your own. Give reasons for your point of view. 140–190 words.',
      prompts: [
        { q: 'In your English class you have been talking about free time. Now your teacher has asked you to write an essay. “Is it better to spend free time with friends or alone?” Notes — write about: 1. relaxing 2. learning new things 3. ……… (your own idea)' },
        { q: '“Should all young people learn to cook at school?” Notes — write about: 1. health 2. saving money 3. ……… (your own idea)' },
        { q: '“Is it better to live in a city or in the countryside?” Notes — write about: 1. jobs 2. the environment 3. ……… (your own idea)' },
        { q: '“Do mobile phones help or harm friendships?” Notes — write about: 1. staying in touch 2. spending time face to face 3. ……… (your own idea)' }
      ] },
    { id: 'b2-2', exam: 'Cambridge', group: 'B2 First', name: 'Writing Part 2 · Article, email, review or report', kind: 'article', mins: 40, min: 140, max: 190, scale: 'b2',
      how: 'Choose a task. Use the right style for the reader. 140–190 words.',
      prompts: [
        { q: 'Article — You see this announcement in an English-language magazine: “A place that makes me happy. Tell us about a place you love to visit. Why is it special, and what do you do there?” Write your article.', kind: 'article' },
        { q: 'Email — Your English-speaking friend Sam writes: “I’m starting a new hobby and can’t decide between photography and playing the guitar. Which one would you choose, and why?” Write your email.', kind: 'email' },
        { q: 'Review — An international website asks readers for reviews of a café or restaurant. Describe the food, the service and the atmosphere, and say whether you would recommend it. Write your review.', kind: 'review' },
        { q: 'Report — Your college director wants to improve the student common room. Write a report describing the room now, explaining what students dislike and recommending two changes. Write your report.', kind: 'report' }
      ] },
    { id: 'c1-1', exam: 'Cambridge', group: 'C1 Advanced', name: 'Writing Part 1 · Essay', kind: 'essay', mins: 45, min: 220, max: 260, scale: 'c1', opinion: true,
      how: 'Discuss two of the three points, explain which is more important and give reasons. Opinions from a discussion may be used but use your own words. 220–260 words.',
      prompts: [
        { q: 'Your class has attended a panel discussion on how local councils can encourage people to live more sustainably. Write an essay discussing TWO of the following: • free public transport • community gardens • rubbish charges. Explain which would be more effective, giving reasons.' },
        { q: 'Your class has discussed ways to improve health in the community. Write an essay discussing TWO of: • sugar taxes • free sports facilities • health education in schools. Explain which would be more effective.' },
        { q: 'After a lecture on the future of work, write an essay discussing TWO ways employers could improve staff well-being: • flexible hours • a four-day week • mentoring programmes. Explain which is more important.' },
        { q: 'Write an essay discussing TWO ways a city could make its centre more attractive: • car-free streets • more green spaces • cultural events. Say which would make the biggest difference and why.' }
      ] },
    { id: 'c1-2', exam: 'Cambridge', group: 'C1 Advanced', name: 'Writing Part 2 · Proposal, report, review or letter', kind: 'proposal', mins: 45, min: 220, max: 260, scale: 'c1',
      how: 'Choose a task. Organise clearly (headings help in a report or proposal). 220–260 words.',
      prompts: [
        { q: 'Proposal — The manager of the library where you volunteer wants ideas to attract more teenagers. Write a proposal describing the current situation, suggesting two activities and explaining how they would benefit the library.', kind: 'proposal' },
        { q: 'Report — You recently took part in an exchange programme. Write a report for the organisers evaluating the accommodation, the course and the social activities, and recommending improvements.', kind: 'report' },
        { q: 'Review — A culture magazine invites reviews of a documentary that changed the way you think. Describe the documentary, explain what you learned and say who should watch it.', kind: 'review' },
        { q: 'Letter — A local newspaper has published an article saying that young people are not interested in their community. Write a letter to the editor responding to this view, giving examples.', kind: 'letter' }
      ] },
    { id: 'c2-1', exam: 'Cambridge', group: 'C2 Proficiency', name: 'Writing Part 1 · Summary essay', kind: 'summary', mins: 45, min: 240, max: 280, scale: 'c2',
      how: 'Summarise and evaluate the key points of BOTH texts and give your own view. Use your own words. 240–280 words.',
      prompts: [
        { q: 'Read the two texts and write an essay summarising and evaluating the key points from both, using your own words and including your own ideas.', texts: ['Text 1 — Supporters of remote learning claim it opens doors: a student in a small town can attend lectures given on another continent, and lessons can be replayed until a difficult concept finally makes sense. Yet independence comes at a price; without the rhythm of a timetable, many learners drift.', 'Text 2 — Classrooms are not merely places where information is delivered. They are where students argue, misunderstand and recover, often in the same ten minutes. Technology can replicate the lecture, but it struggles to reproduce the friction from which real understanding grows.'] },
        { q: 'Read the two texts and write an essay summarising and evaluating the key points from both, using your own words and including your own ideas.', texts: ['Text 1 — Tourism is often blamed for crowded streets and rising rents, but for many regions it is the only industry that keeps young people from leaving. Managed well, visitors fund the very museums, trails and festivals that locals enjoy.', 'Text 2 — The trouble with tourism is that its benefits are counted in dollars while its costs are measured in quieter ways: a beach that no longer belongs to the people who live beside it, or a village whose shops sell souvenirs instead of bread.'] }
      ] },
    { id: 'c2-2', exam: 'Cambridge', group: 'C2 Proficiency', name: 'Writing Part 2 · Article, letter, report or review', kind: 'article', mins: 45, min: 280, max: 320, scale: 'c2',
      how: 'Choose a task. Show a wide range of language and a consistent, appropriate style. 280–320 words.',
      prompts: [
        { q: 'Article — A magazine is running a series called “The skill nobody taught me”. Write an article about a skill you had to learn on your own, how you learned it and why schools should (or should not) teach it.', kind: 'article' },
        { q: 'Review — A literary website invites reviews of a book that deals with a difficult subject in a hopeful way. Write a review explaining how the writer achieves this and whether the book succeeds.', kind: 'review' },
        { q: 'Report — Your workplace is considering replacing its annual conference with smaller regional meetings. Write a report for the board weighing up the benefits and drawbacks and making a recommendation.', kind: 'report' }
      ] },
    { id: 'nzcel-3', exam: 'NZCEL', group: 'NZCEL Level 3 (General / Applied)', name: 'Writing · Everyday text', kind: 'message', mins: 30, min: 150, max: 220, scale: 'nzcel',
      how: 'Write a clear, connected text for an everyday purpose. Use paragraphs, linking words and a range of simple and compound sentences. About 150–220 words.',
      prompts: [
        { q: 'Write an email to your child’s school to say your child will be away for three days. Explain why, ask what work they will miss and thank the teacher.', kind: 'email' },
        { q: 'Write a description of a celebration from your culture for a community newsletter in New Zealand. Explain when it happens, what people do and why it is important.' },
        { q: 'Write a short text for new migrants giving advice about finding a place to rent in your town. Include at least three tips.' }
      ] },
    { id: 'nzcel-4e', exam: 'NZCEL', group: 'NZCEL Level 4 (Employment)', name: 'Writing · Workplace text', kind: 'email', mins: 40, min: 200, max: 280, scale: 'nzcel',
      how: 'Write a workplace text with a clear purpose, the right level of formality and well-organised paragraphs. About 200–280 words.',
      prompts: [
        { q: 'Write an incident report for your supervisor about a customer who slipped on a wet floor at your workplace. Describe what happened, what you did and what should change to prevent it happening again.', kind: 'report' },
        { q: 'Write an email to your manager asking for a change to your roster for two months. Explain the reason, suggest how your shifts could be covered and thank them.', kind: 'email' },
        { q: 'Write a cover letter applying for a job as a team leader at a supermarket. Describe your experience, your strengths and why you want the role.', kind: 'letter' }
      ] },
    { id: 'nzcel-4a', exam: 'NZCEL', group: 'NZCEL Level 4 (Academic)', name: 'Writing · Academic essay', kind: 'essay', mins: 50, min: 250, max: 350, scale: 'nzcel', opinion: true,
      how: 'Write an academic essay with an introduction (thesis), body paragraphs with topic sentences and support, and a conclusion. Use formal language. About 250–350 words.',
      prompts: [
        { q: 'Should New Zealand make learning te reo Māori compulsory in all primary schools? Discuss the arguments for and against and give your view.' },
        { q: 'What are the main benefits and challenges for international students studying in New Zealand?' },
        { q: '“Social media does more harm than good for teenagers.” To what extent do you agree?' }
      ] },
    { id: 'nzcel-5a', exam: 'NZCEL', group: 'NZCEL Level 5 (Academic)', name: 'Writing · Research-informed essay', kind: 'essay', mins: 60, min: 350, max: 500, scale: 'nzcel', opinion: true, sources: true,
      how: 'Write a research-informed essay. Develop an argument, use evidence and cite sources (e.g. Author, year), use a formal, objective style and a wide range of academic vocabulary. About 350–500 words.',
      prompts: [
        { q: 'Evaluate the effectiveness of one strategy a New Zealand city could use to reduce traffic congestion. Support your argument with evidence.' },
        { q: 'To what extent should governments regulate the use of artificial sweeteners and sugar in children’s food? Use evidence to support your position.' },
        { q: 'Discuss how remote and hybrid work are changing the way New Zealanders live. Use evidence to evaluate both the benefits and the risks.' }
      ] }
  ];

  var SPEAK = {
    ielts: { name: 'IELTS Speaking Part 2 · Long turn', prep: 60, talk: 120, how: 'You have one minute to prepare and up to two minutes to talk. Make notes on each point.',
      cards: [
        ['Describe a place in nature that you enjoy visiting.', ['where it is', 'how often you go there', 'what you do there', 'and explain why you enjoy it']],
        ['Describe a skill you learned as an adult.', ['what the skill is', 'how you learned it', 'how difficult it was', 'and explain how it has helped you']],
        ['Describe a person who helped you when you moved to a new place.', ['who the person is', 'how you met', 'what they did', 'and explain why you remember them']],
        ['Describe a family celebration you attended.', ['what it was for', 'who was there', 'what happened', 'and explain how you felt']],
        ['Describe a time you changed your mind about something.', ['what it was', 'what you thought before', 'what made you change', 'and explain how you feel about it now']],
        ['Describe something you bought that you are very happy with.', ['what it is', 'where you bought it', 'how you use it', 'and explain why you are happy with it']]
      ],
      part3: ['Why do some people prefer to live in cities rather than near nature?', 'Should adults be encouraged to keep learning new skills? Why?', 'How have celebrations changed compared with the past?', 'Do people today buy too many things? Why do you think so?'] },
    cambridge: { name: 'Cambridge Speaking · Long turn & discussion', prep: 15, talk: 60, how: 'Talk for one minute comparing the two situations and answering the question. Then discuss the follow-up questions.',
      cards: [
        ['Compare two ways of relaxing after a busy day: going for a run, or watching a film at home.', ['Why do people choose these ways to relax?', 'Which do you think is more effective?']],
        ['Compare learning a language in a classroom with learning it while living abroad.', ['What are the advantages of each?', 'Which leads to faster progress?']],
        ['Compare celebrating a birthday with a big party and with a quiet family meal.', ['Why might people prefer each one?', 'Which would be more memorable?']],
        ['Compare working in a busy café with working in a quiet office.', ['What skills does each job need?', 'Which would be more satisfying?']]
      ],
      part3: ['Is it important for young people to have a part-time job?', 'How might technology change the way we learn in the future?', 'Do you think people are more stressed now than in the past?', 'What makes a community a good place to live?'] }
  };

  /* ---------------- feedback ---------------- */
  var LINK = {
    addition: ['in addition', 'furthermore', 'moreover', 'also', 'as well as', 'what is more', 'besides', 'additionally', 'not only'],
    contrast: ['however', 'although', 'though', 'whereas', 'while', 'on the other hand', 'nevertheless', 'despite', 'in spite of', 'but', 'yet', 'even though', 'in contrast', 'conversely'],
    cause: ['because', 'since', 'as a result', 'therefore', 'consequently', 'so', 'due to', 'this means', 'thus', 'owing to', 'which leads to', 'hence'],
    example: ['for example', 'for instance', 'such as', 'in particular', 'to illustrate', 'namely', 'including'],
    sequence: ['firstly', 'first', 'secondly', 'second', 'finally', 'lastly', 'then', 'next', 'after that', 'to begin with', 'subsequently'],
    conclusion: ['in conclusion', 'to sum up', 'overall', 'in summary', 'all in all', 'to conclude', 'on balance', 'in short']
  };
  var ACAD = 'analyse analysis approach area assess assume authority available benefit concept consist constitute context contract create data define derive distribute economy environment establish estimate evident export factor finance formula function identify income indicate individual interpret involve issue labour legal legislate major method occur percent period policy principle proceed process require research respond role section sector significant similar source specific structure theory vary achieve acquire administrate affect appropriate aspect assist category chapter commission community complex compute conclude conduct consequent construct consume credit culture design distinct element equate evaluate feature final focus impact injure institute invest item journal maintain normal obtain participate perceive positive potential previous primary purchase range region regulate relevant reside resource restrict secure seek select site strategy survey text tradition transfer alternative circumstance comment compensate component consent considerable constant constrain contribute convene coordinate core corporate correspond criteria deduce demonstrate document dominate emphasis ensure exclude framework fund illustrate immigrate imply initial instance interact justify layer link locate maximise minor negate outcome partner philosophy physical proportion publish react register rely remove scheme sequence sex shift specify sufficient task technical technique technology valid volume access adequate annual apparent approximate attitude attribute civil code commit communicate concentrate conference contrast cycle debate despite dimension domestic emerge error ethnic goal grant hence hypothesis implement implicate impose integrate internal investigate job label mechanism obvious occupy option output overall parallel parameter phase predict principal prior professional project promote regime resolve retain series statistic status stress subsequent sum summary undertake'.split(' ');
  var ACADSET = {}; ACAD.forEach(function (w) { ACADSET[w] = 1; });
  var FUNC = 'the a an and or but so of to in on at by for from with is are was were be been it this that these those i you he she we they my your our their his her its me him us them as if not no do does did have has had will would can could should may might must there here than then also very more most some any all each every which who what when where why how one two just about into over after before because while'.split(' ');
  var FUNCSET = {}; FUNC.forEach(function (w) { FUNCSET[w] = 1; });

  function countWords(t) { return (t.match(/[A-Za-zÀ-ž’'-]+/g) || []).length; }
  function analyse(text, task) {
    var kind = task.kind, words = countWords(text);
    var paras = text.split(/\n\s*\n|\n(?=\s*[A-Z])/).map(function (p) { return p.trim(); }).filter(function (p) { return countWords(p) > 0; });
    var sents = text.split(/(?<=[.!?])\s+/).filter(function (s) { return countWords(s) > 2; });
    var low = ' ' + text.toLowerCase().replace(/[’]/g, "'") + ' ';
    var linkFound = {}, linkTypes = 0, linkTotal = 0;
    Object.keys(LINK).forEach(function (k) { LINK[k].forEach(function (p) { var rx = new RegExp('[^a-z]' + p.replace(/ /g, '\\s+') + '[^a-z]', 'g'), m = low.match(rx); if (m) { linkFound[k] = (linkFound[k] || []).concat([p]); linkTotal += m.length; } }); if (linkFound[k]) linkTypes++; });
    var toks = (low.match(/[a-z']+/g) || []), content = toks.filter(function (w) { return !FUNCSET[w] && w.length > 2; });
    var freq = {}; content.forEach(function (w) { freq[w] = (freq[w] || 0) + 1; });
    var uniq = Object.keys(freq).length, ttr = content.length ? uniq / content.length : 0;
    var repeats = Object.keys(freq).filter(function (w) { return freq[w] >= Math.max(4, Math.round(words / 45)); }).sort(function (a, b) { return freq[b] - freq[a]; }).slice(0, 4);
    var acad = Object.keys(freq).filter(function (w) { return ACADSET[w] || ACADSET[w.replace(/(s|es|ed|ing|ly|al|ation|ment|ity)$/, '')] || ACADSET[w.replace(/(ed|ing|es|s)$/, 'e')]; });
    var longW = content.filter(function (w) { return w.length >= 8; }).length;
    var lens = sents.map(countWords), avg = lens.length ? lens.reduce(function (a, b) { return a + b; }, 0) / lens.length : 0;
    var complex = sents.filter(function (s) { return /\b(although|because|which|who|whom|whose|that|when|while|if|unless|whereas|since|so that|even though|whether|having|despite)\b/i.test(s); }).length;
    var passive = (text.match(/\b(is|are|was|were|be|been|being)\s+(\w+ed|built|done|made|given|taken|seen|written|known|shown|found|held|kept|told|paid|sold|brought|thought|spent|taught)\b/gi) || []).length;
    var cond = /\bif\b[^.]*\b(would|will|could|might)\b|\bwere I\b|\bhad I\b|\bshould you\b/i.test(text);
    var starts = {}; sents.forEach(function (s) { var w = (s.match(/[A-Za-z']+/) || [''])[0].toLowerCase(); starts[w] = (starts[w] || 0) + 1; });
    var sameStart = Object.keys(starts).filter(function (w) { return starts[w] >= 3 && starts[w] / sents.length > 0.3; });
    var fix = JNZX._fix ? JNZX._fix(text, kind === 'essay' || kind === 'summary' || kind === 'report' || kind === 'proposal' ? 'academic' : kind === 'letter' || kind === 'email' ? 'email' : 'improve') : { changes: [], tips: [], text: text };
    var errs = (JNZX._expand ? JNZX._expand(fix.changes) : fix.changes).filter(function (c) { return c.from && !/tidied|Extra space|space/i.test(c.why) && !/^(Avoid|Informal|Personal pronoun|Hedge|Intensifier|Filler|Wordy|Contraction|Polish)/i.test(c.why); });
    var contractions = (text.match(/\b\w+(n't|'re|'ll|'ve|'d|’re|’ll|’ve|’d|n’t)\b/gi) || []).length;
    var formalTask = /essay|summary|report|proposal/.test(kind) || task.scale === 'ielts' && kind !== 'letter';

    var notes = [], good = [];
    // ---- 1 task / content
    var s1 = 1;
    if (words < task.min) { var short = (task.min - words) / task.min; s1 -= Math.min(0.7, 0.1 + short * 1.6); notes.push('📏 You wrote ' + words + ' words — aim for at least ' + task.min + '.'); }
    else if (task.max && words > task.max * 1.1) { s1 -= 0.15; notes.push('📏 ' + words + ' words is over the limit (' + task.min + '–' + task.max + '). Cut repetition so every sentence earns its place.'); }
    else good.push('📏 Good length: ' + words + ' words.');
    if (kind === 'letter' || kind === 'email') {
      if (!/^\s*(dear|hi|hello|kia ora|to whom)/i.test(text)) { s1 -= 0.15; notes.push('✉️ Start with a greeting (e.g. “Dear Mr Smith,” or “Hi Sam,”).'); }
      if (!/(yours (sincerely|faithfully)|kind regards|best wishes|regards|warm regards|ngā mihi|love|cheers|take care|see you soon|thank you for)[\s\S]{0,60}$/i.test(text.trim())) { s1 -= 0.1; notes.push('✉️ Finish with a sign-off (e.g. “Kind regards,” / “Yours sincerely,” and your name).'); }
    }
    if (kind === 'chart') {
      if (!/\b(overall|in general|it is clear that|generally|the most striking)\b/i.test(text)) { s1 -= 0.25; notes.push('📊 Add an overview sentence (“Overall, recycling rose for every type of waste…”). It is one of the most important parts of Task 1.'); } else good.push('📊 You included an overview.');
      if (!/\d/.test(text)) { s1 -= 0.2; notes.push('📊 Support your description with figures from the table.'); }
      if (/\b(I think|in my opinion|I believe)\b/i.test(text)) { s1 -= 0.1; notes.push('📊 Don’t give your opinion in Task 1 — just report the information.'); }
    }
    if (task.opinion && !/\b(I (strongly )?(believe|think|feel|agree|disagree)|in my (view|opinion)|from my perspective|it seems to me|I would argue|this essay (will )?argue|I am convinced)\b/i.test(text)) { s1 -= 0.15; notes.push('🧭 Make your position clear (e.g. “In my view, …” / “This essay will argue that …”).'); }
    if (kind === 'summary' && !/\b(first|second|both) (text|writer|extract|passage)|\b(text|writer) (1|2|one|two)\b|\bthe (former|latter)\b/i.test(text)) { s1 -= 0.2; notes.push('📚 Refer to both texts (“The first writer argues…, whereas the second…”).'); }
    if ((kind === 'report' || kind === 'proposal') && paras.filter(function (p) { return countWords(p) <= 6 && !/[.!?]$/.test(p); }).length < 2) { s1 -= 0.1; notes.push('🗂️ Use short headings in a report or proposal (e.g. “Introduction”, “Recommendations”).'); }
    if (task.sources && !/\(\s*[A-Z][A-Za-z-]+(,| et al\.?,?)\s*\d{4}\s*\)|according to [A-Z]/.test(text)) { s1 -= 0.15; notes.push('🔎 Support your argument with sources and cite them, e.g. “(Smith, 2023)”.'); }
    // ---- 2 organisation
    var s2 = 1, needParas = kind === 'message' ? 2 : kind === 'chart' ? 3 : (kind === 'letter' || kind === 'email') ? 3 : 4;
    if (paras.length < needParas) { s2 -= 0.3; notes.push('🧱 Use at least ' + needParas + ' paragraphs (you have ' + paras.length + '). Leave a blank line between them.'); } else good.push('🧱 Clear paragraphs (' + paras.length + ').');
    if (linkTypes < 3) { s2 -= 0.25; var miss = Object.keys(LINK).filter(function (k) { return !linkFound[k]; }).slice(0, 3); notes.push('🔗 Use a wider range of linking words — try ' + miss.map(function (k) { return k + ' (“' + LINK[k][0] + '”)'; }).join(', ') + '.'); }
    else good.push('🔗 Good range of linking words: ' + Object.keys(linkFound).map(function (k) { return linkFound[k][0]; }).join(', ') + '.');
    if (linkTotal > Math.max(6, words / 18)) { s2 -= 0.1; notes.push('🔗 Linking words feel overused — let some sentences connect naturally.'); }
    if (formalTask && kind !== 'chart' && !linkFound.conclusion) { s2 -= 0.1; notes.push('🏁 Signal your conclusion (“In conclusion, …” / “On balance, …”).'); }
    // ---- 3 vocabulary
    var guiraud = content.length ? uniq / Math.sqrt(content.length) : 0;
    var s3 = 0.2 + Math.min(0.45, Math.max(0, (guiraud - 4) / 6)) + Math.min(0.2, acad.length * 0.018) + Math.min(0.15, longW / Math.max(1, content.length) * 0.6);
    if (repeats.length) { s3 -= 0.1; notes.push('📖 You repeat ' + repeats.map(function (w) { return '“' + w + '”'; }).join(', ') + ' often. Try synonyms or pronouns.'); }
    if (acad.length >= 6) good.push('📖 Good topic and academic vocabulary (e.g. ' + acad.slice(0, 4).join(', ') + ').');
    else if (formalTask) notes.push('📖 Add more precise, formal vocabulary (e.g. “significant”, “consequently”, “a considerable number of”).');
    if (formalTask && contractions > 0) { s3 -= 0.1; notes.push('🎩 Avoid contractions in formal writing (“do not”, not “don’t”).'); }
    var spellErr = errs.filter(function (c) { return c.why === 'Spelling'; }).length;
    if (spellErr) { s3 -= Math.min(0.25, spellErr * 0.04); notes.push('🔤 ' + spellErr + ' spelling mistake' + (spellErr > 1 ? 's' : '') + ' fixed — see the corrected version below.'); }
    // ---- 4 grammar
    var gErr = errs.length - spellErr, rate = words ? gErr / words * 100 : 0;
    var s4 = 0.92 - Math.min(0.6, rate * 0.15) - (words < task.min ? 0.05 : 0);
    if (complex / Math.max(1, sents.length) < 0.3) { s4 -= 0.1; notes.push('🧩 Use more complex sentences — relative clauses (“which…”, “who…”), “although…”, “if…”.'); } else good.push('🧩 Good mix of complex sentences.');
    if (avg > 32) { s4 -= 0.05; notes.push('✂️ Some sentences are very long (average ' + Math.round(avg) + ' words). Split one or two.'); }
    if (avg && avg < 9) { s4 -= 0.08; notes.push('🧵 Sentences are short (average ' + Math.round(avg) + ' words). Join some ideas with “and”, “because”, “which”.'); }
    if (sameStart.length) notes.push('🔁 Many sentences start with “' + sameStart[0] + '”. Vary your openings.');
    if (formalTask && !passive && words > 150) notes.push('🧩 Try one passive sentence for variety (“It is widely believed that…”).');
    if (task.scale !== 'nzcel' && /b2|ielts/.test(task.scale) && !cond && words > 120) notes.push('🧩 A conditional sentence can show range (“If cities invested in…, they would…”).');
    if (gErr) notes.push('✏️ ' + gErr + ' grammar point' + (gErr > 1 ? 's' : '') + ' corrected — check “What I changed” below.'); else good.push('✏️ No common grammar errors found.');

    var sc = [s1, s2, s3, s4].map(function (x) { return Math.max(0, Math.min(1, x)); });
    var avgS = (sc[0] + sc[1] + sc[2] + sc[3]) / 4;
    return { words: words, paras: paras.length, sents: sents.length, avgLen: avg, sc: sc, avg: avgS, notes: notes, good: good, fix: fix, errs: errs, linkFound: linkFound, score: scoreFor(task, sc, avgS, words) };
  }
  function half(x) { return Math.round(x * 2) / 2; }
  function scoreFor(task, sc, avgS, words) {
    if (task.scale === 'ielts') {
      var crit = (task.kind === 'chart' || task.kind === 'letter' ? ['Task Achievement', 'Coherence & Cohesion', 'Lexical Resource', 'Grammatical Range & Accuracy'] : ['Task Response', 'Coherence & Cohesion', 'Lexical Resource', 'Grammatical Range & Accuracy']);
      var bands = sc.map(function (s) { return Math.max(3, Math.min(9, Math.floor(3 + s * 6.2))); });
      if (words < task.min) bands[0] = Math.min(bands[0], words < task.min * 0.8 ? 5 : 6);
      if (words < task.min * 0.6) bands = bands.map(function (b) { return Math.min(b, 5); });
      if (words < 120) bands = bands.map(function (b) { return Math.min(b, 6); });
      var overall = half(bands.reduce(function (a, b) { return a + b; }, 0) / 4);
      return { label: 'Band ' + overall.toFixed(1), sub: crit.map(function (c, i) { return [c, String(bands[i])]; }), headline: overall >= 7 ? 'Strong — keep polishing range and accuracy.' : overall >= 6 ? 'Competent — work on the points below to move up.' : 'Building — focus on the first two or three points below.' };
    }
    var crit2 = ['Content', 'Communicative Achievement', 'Organisation', 'Language'];
    var marks = [sc[0], (sc[0] + sc[3]) / 2, sc[1], (sc[2] + sc[3]) / 2].map(function (s) { return Math.round(s * 5); });
    var total = marks.reduce(function (a, b) { return a + b; }, 0);
    if (task.scale === 'nzcel') {
      var lv = avgS >= 0.8 ? 'Achieved — confident' : avgS >= 0.62 ? 'Achieved' : avgS >= 0.45 ? 'Nearly there' : 'Working towards';
      return { label: lv, sub: [['Purpose & audience', marks[0] + '/5'], ['Organisation & cohesion', marks[2] + '/5'], ['Vocabulary', Math.round(sc[2] * 5) + '/5'], ['Grammar & accuracy', Math.round(sc[3] * 5) + '/5']], headline: 'NZCEL outcomes are assessed by your provider. Use this to see which outcome needs the most work.' };
    }
    var R0 = { b2: [140, 190, [[180, 'Grade A (C1 level)'], [173, 'Grade B'], [160, 'Grade C'], [140, 'B1 level']]], c1: [160, 210, [[200, 'Grade A (C2 level)'], [193, 'Grade B'], [180, 'Grade C'], [160, 'B2 level']]], c2: [180, 230, [[220, 'Grade A'], [213, 'Grade B'], [200, 'Grade C'], [180, 'C1 level']]] }[task.scale];
    var scale = Math.round(R0[0] + (R0[1] - R0[0]) * Math.pow(total / 20, 1.15));
    var grade = R0[2].find(function (g) { return scale >= g[0]; }) || R0[2][R0[2].length - 1];
    return { label: total + '/20 · ≈ ' + scale + ' on the scale', sub: crit2.map(function (c, i) { return [c, marks[i] + '/5']; }), headline: grade[1] + ' — an indicative estimate for this one piece of writing.' };
  }

  var PHRASES = {
    essay: ['It is often argued that …', 'There are several reasons why …', 'A further point to consider is …', 'Critics, however, point out that …', 'This is particularly true of …', 'On balance, I believe that …'],
    chart: ['The table illustrates/compares …', 'Overall, the most noticeable trend is …', '… rose sharply from X to Y', 'By contrast, … fell slightly', '… accounted for the largest share', '… remained relatively stable'],
    letter: ['I am writing to … / I’m writing because …', 'I would be grateful if you could …', 'Could you please let me know …', 'I look forward to hearing from you.', 'Yours faithfully (Dear Sir/Madam) / Yours sincerely (Dear Ms Lee)', 'Best wishes / Take care (to a friend)'],
    email: ['Thanks for your email about …', 'I’m writing to ask whether …', 'Would it be possible to …?', 'Please let me know if …', 'Kind regards,', 'Looking forward to hearing from you.'],
    article: ['Have you ever wondered …?', 'Picture this: …', 'What makes it special is …', 'To my surprise, …', 'If you only do one thing, …', 'So next time you …'],
    review: ['If you’re looking for …, look no further.', 'The highlight for me was …', 'My only criticism is …', 'It is well worth …', 'I would thoroughly recommend it to …', 'Overall, I’d give it four stars out of five.'],
    report: ['Introduction — The aim of this report is to …', 'Findings — Most students said …', 'It was found that …', 'A significant number of …', 'Recommendations — I would recommend …', 'In conclusion, …'],
    proposal: ['Purpose — This proposal outlines …', 'Current situation — At present, …', 'Suggestions — One option would be to …', 'Benefits — This would allow …', 'I strongly believe that …', 'I hope you will consider these suggestions.'],
    summary: ['Both writers discuss …', 'The first writer contends that …', 'In contrast, the second writer suggests …', 'While this is a valid point, …', 'I find the second argument more persuasive because …', 'Ultimately, …'],
    message: ['I’m writing to let you know …', 'Here are a few tips: …', 'First of all, … / Another thing to remember is …', 'It is important because …', 'Thank you for …', 'Please contact me if …']
  };
  var PLAN = {
    essay: ['Introduction: paraphrase the question + your position', 'Body 1: main idea + reason + example', 'Body 2: second idea (or the other view) + example', 'Body 3 (optional): your own idea / counter-argument', 'Conclusion: restate your position — no new ideas'],
    chart: ['Introduction: paraphrase what the table shows', 'Overview: the 2–3 biggest trends (no numbers needed)', 'Detail 1: biggest changes with figures', 'Detail 2: other comparisons with figures'],
    letter: ['Greeting + reason for writing', 'Bullet point 1', 'Bullet point 2', 'Bullet point 3', 'Closing sentence + sign-off'],
    email: ['Greeting', 'Why you are writing', 'Main details / request', 'What happens next', 'Sign-off'],
    article: ['Catchy title', 'Hook the reader with a question or picture', 'Main description / story', 'Why it matters', 'Memorable ending speaking to the reader'],
    review: ['Title + what you are reviewing', 'Description', 'Good points', 'Weak points', 'Recommendation'],
    report: ['Heading: Introduction (aim)', 'Heading: Findings 1', 'Heading: Findings 2', 'Heading: Recommendations'],
    proposal: ['Heading: Purpose', 'Heading: Current situation', 'Heading: Suggestions', 'Heading: Benefits / Conclusion'],
    summary: ['Introduction: the shared topic', 'Text 1 key points + your evaluation', 'Text 2 key points + your evaluation', 'Your own view + conclusion'],
    message: ['Opening / purpose', 'Main point 1', 'Main point 2', 'Closing']
  };

  /* ---------------- components ---------------- */
  function readKey(k, d) { try { var v = localStorage.getItem(k); return v === null ? d : JSON.parse(v); } catch (e) { return d; } }
  function useKeyed(key, init) {
    var s = useState(function () { return { k: key, v: readKey(key, init) }; }), cur = s[0];
    if (cur.k !== key) { cur = { k: key, v: readKey(key, init) }; s[1](cur); }
    return [cur.v, function (v) { s[1]({ k: key, v: v }); try { localStorage.setItem(key, JSON.stringify(v)); } catch (e) {} }];
  }
  function fmt(s) { s = Math.max(0, s); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); }
  function Timer(props) {
    var t = useState(props.secs), left = t[0], setLeft = t[1], r = useState(false), run = r[0], setRun = r[1];
    useEffect(function () { setLeft(props.secs); setRun(false); }, [props.secs, props.reset]);
    useEffect(function () { if (!run) return; var id = setInterval(function () { setLeft(function (x) { if (x <= 1) { setRun(false); try { navigator.vibrate && navigator.vibrate(200); } catch (e) {} return 0; } return x - 1; }); }, 1000); return function () { clearInterval(id); }; }, [run]);
    return h('div', { className: 'jx-ex-timer' + (left === 0 ? ' done' : left < 60 ? ' low' : '') },
      h('span', { 'aria-live': 'polite' }, left === 0 ? '⏰ Time’s up' : '⏱ ' + fmt(left)),
      h('button', { type: 'button', className: 'secondary', onClick: function () { setRun(!run); } }, run ? 'Pause' : left === props.secs ? 'Start timer' : 'Resume'),
      h('button', { type: 'button', className: 'secondary', onClick: function () { setLeft(props.secs); setRun(false); } }, 'Reset'));
  }
  function WritingPractice() {
    var g = JNZX.useStored('jnzx-ex-exam', 'IELTS'), exam = g[0], setExam = g[1];
    var list = EXAMS.filter(function (e) { return e.exam === exam; });
    var tk = JNZX.useStored('jnzx-ex-task', 'ielts-2'), tid = tk[0], setTid = tk[1];
    var task = list.find(function (e) { return e.id === tid; }) || list[0];
    var pi = useKeyed('jnzx-ex-p-' + task.id, 0), pIdx = pi[0] % task.prompts.length, setP = pi[1];
    var prompt = task.prompts[pIdx];
    var tx = useKeyed('jnzx-ex-text-' + task.id + '-' + pIdx, ''), text = tx[0], setText = tx[1];
    var rs = useState(null), res = rs[0], setRes = rs[1];
    var bz = useState(false), busy = bz[0], setBusy = bz[1];
    var words = countWords(text);
    useEffect(function () { setRes(null); }, [task.id, pIdx]);
    useEffect(function () { JNZX.loadWords && JNZX.loadWords(); }, []);
    function check() { setBusy(true); (JNZX.loadWords ? JNZX.loadWords() : Promise.resolve()).then(function () { setBusy(false); setRes(analyse(text, Object.assign({}, task, prompt.kind ? { kind: prompt.kind } : {}))); }); }
    var kind = prompt.kind || task.kind;
    var target = task.max ? task.min + '–' + task.max + ' words' : 'at least ' + task.min + ' words';
    var wc = words < task.min ? 'under' : task.max && words > task.max ? 'over' : 'ok';
    return h('div', { className: 'jx-ex' },
      h(JNZX.Chips, { label: 'Exam', options: [{ value: 'IELTS', label: '🌏 IELTS' }, { value: 'Cambridge', label: '🎓 Cambridge (B2 · C1 · C2)' }, { value: 'NZCEL', label: '🥝 NZCEL' }], value: exam, onChange: function (v) { setExam(v); var f = EXAMS.find(function (e) { return e.exam === v; }); setTid(f.id); } }),
      h(JNZX.Chips, { label: 'Task', options: list.map(function (e) { return { value: e.id, label: e.group + ' · ' + e.name }; }), value: task.id, onChange: setTid }),
      h('div', { className: 'jx-card jx-ex-task' },
        h('div', { className: 'jx-ex-taskhead' }, h('p', { className: 'eyebrow' }, task.group.toUpperCase() + ' · ' + task.name.toUpperCase()), h('span', { className: 'jx-ex-pill' }, '⏱ ' + task.mins + ' min · ✍️ ' + target)),
        h('p', { className: 'jx-ex-q' }, prompt.q),
        prompt.table && h('div', { className: 'jx-ex-tablewrap' }, h('table', { className: 'jx-ex-table' }, h('thead', null, h('tr', null, prompt.table[0].map(function (c, i) { return h('th', { key: i }, c); }))), h('tbody', null, prompt.table.slice(1).map(function (r, i) { return h('tr', { key: i }, r.map(function (c, j) { return h('td', { key: j }, c); })); })))),
        prompt.texts && prompt.texts.map(function (t, i) { return h('blockquote', { key: i, className: 'jx-ex-text' }, t); }),
        h('p', { className: 'jx-muted' }, '💡 ' + task.how),
        h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'secondary', onClick: function () { setP(pIdx + 1); } }, '🔄 Another task (' + (pIdx + 1) + '/' + task.prompts.length + ')'), h(Timer, { secs: task.mins * 60, reset: task.id + pIdx })),
        h('details', { className: 'jx-ex-help' }, h('summary', null, '🗺️ Plan & useful phrases'),
          h('div', { className: 'jx-ex-cols' },
            h('div', null, h('strong', null, 'Plan'), h('ol', null, (PLAN[kind] || PLAN.essay).map(function (x, i) { return h('li', { key: i }, x); }))),
            h('div', null, h('strong', null, 'Useful phrases'), h('ul', null, (PHRASES[kind] || PHRASES.essay).map(function (x, i) { return h('li', { key: i }, x); })))))),
      h('label', { className: 'jx-sr', htmlFor: 'jx-ex-text' }, 'Your answer'),
      h('textarea', { id: 'jx-ex-text', className: 'jx-ex-area', rows: 14, value: text, spellCheck: false, placeholder: 'Write your answer here. Leave a blank line between paragraphs.', onChange: function (e) { setText(e.target.value); } }),
      h('div', { className: 'jx-row jx-ex-bar' },
        h('span', { className: 'jx-ex-wc ' + wc }, words + ' words · ' + (wc === 'under' ? (task.min - words) + ' to go' : wc === 'over' ? (words - task.max) + ' over' : 'on target ✓')),
        h('button', { type: 'button', className: 'primary', disabled: words < 20 || busy, onClick: check }, busy ? 'Checking…' : '🎓 Check my writing'),
        text && h('button', { type: 'button', className: 'secondary', onClick: function () { setText(''); setRes(null); } }, 'Clear')),
      res && h(Feedback, { res: res, task: task, onUse: function (t) { setText(t); setRes(null); } }));
  }
  function okTip(t) { return !/Personal pronoun|passive voice|exclamation|Hedge word|Intensifier|starting a formal sentence/i.test(t); }
  function Feedback(props) {
    var res = props.res, s = res.score;
    return h('div', { className: 'jx-card jx-ex-fb', 'aria-live': 'polite' },
      h('div', { className: 'jx-ex-score' }, h('div', null, h('p', { className: 'eyebrow' }, 'MATEO’S PRACTICE SCORE'), h('p', { className: 'jx-ex-big' }, s.label), h('p', { className: 'jx-muted' }, s.headline)),
        h('ul', { className: 'jx-ex-crit' }, s.sub.map(function (c) { return h('li', { key: c[0] }, h('span', null, c[0]), h('strong', null, c[1])); }))),
      res.good.length > 0 && h('div', { className: 'jx-ex-good' }, h('strong', null, '🌟 What’s working'), h('ul', null, res.good.map(function (x, i) { return h('li', { key: i }, x); }))),
      res.notes.length > 0 && h('div', { className: 'jx-ex-notes' }, h('strong', null, '🎯 To score higher'), h('ul', null, res.notes.map(function (x, i) { return h('li', { key: i }, x); }))),
      res.errs.length > 0 && h('details', { className: 'jx-wb-why', open: res.errs.length <= 6 }, h('summary', null, 'What I changed (' + res.errs.length + ')'),
        h('ul', null, res.errs.slice(0, 20).map(function (c, i) { return h('li', { key: i }, c.from === '…' ? h('span', null, 'added ', h('strong', null, '“' + c.to + '”')) : h('span', null, h('s', null, c.from), ' → ', h('strong', null, c.to === '' ? '(removed)' : c.to)), ' · ', c.why); }))),
      res.fix.tips && res.fix.tips.filter(okTip).length > 0 && h('div', { className: 'jx-wb-tips' }, h('strong', null, '💡 Also check'), h('ul', null, res.fix.tips.filter(okTip).slice(0, 6).map(function (x, i) { return h('li', { key: i }, x); }))),
      res.errs.length > 0 && h('div', null, h('p', { className: 'jx-wb-label' }, 'Corrected version'), h('div', { className: 'jx-wb-result' }, res.fix.text), h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: function () { props.onUse(res.fix.text); } }, 'Use corrected version'))),
      h('p', { className: 'small-note' }, 'This is a practice estimate from Mateo’s checks (length, organisation, linking words, vocabulary range, sentence variety and accuracy). It is not an official result — real examiners also judge ideas, tone and how fully you answer the task.'));
  }
  function SpeakingPractice() {
    var w = JNZX.useStored('jnzx-ex-speak', 'ielts'), which = w[0], setWhich = w[1];
    var d = SPEAK[which];
    var c = useState(0), ci = c[0], setCi = c[1];
    var card = d.cards[ci % d.cards.length];
    var ph = useState('ready'), phase = ph[0], setPhase = ph[1], lt = useState(0), left = lt[0], setLeft = lt[1];
    useEffect(function () {
      if (phase !== 'prep' && phase !== 'talk') return;
      var id = setInterval(function () { setLeft(function (x) { if (x <= 1) { if (phase === 'prep') { setPhase('talk'); try { navigator.vibrate && navigator.vibrate(150); } catch (e) {} return d.talk; } setPhase('done'); return 0; } return x - 1; }); }, 1000);
      return function () { clearInterval(id); };
    }, [phase, which]);
    useEffect(function () { setPhase('ready'); }, [which, ci]);
    return h('div', { className: 'jx-ex' },
      h(JNZX.Chips, { label: 'Speaking test', options: [{ value: 'ielts', label: '🌏 IELTS Part 2' }, { value: 'cambridge', label: '🎓 Cambridge long turn' }], value: which, onChange: setWhich }),
      h('div', { className: 'jx-card jx-ex-cue' },
        h('p', { className: 'eyebrow' }, d.name.toUpperCase()),
        h('h3', null, card[0]),
        h('ul', null, card[1].map(function (x, i) { return h('li', { key: i }, x); })),
        h('p', { className: 'jx-muted' }, d.how),
        h('div', { className: 'jx-ex-speakbar' },
          h('span', { className: 'jx-ex-phase', 'aria-live': 'polite' }, phase === 'ready' ? 'Ready when you are' : phase === 'prep' ? '📝 Prepare · ' + fmt(left) : phase === 'talk' ? '🗣️ Speak now · ' + fmt(left) : '✅ Well done!'),
          phase === 'ready' || phase === 'done' ? h('button', { type: 'button', className: 'primary', onClick: function () { setLeft(d.prep); setPhase('prep'); } }, phase === 'done' ? 'Try again' : '▶ Start') : h('button', { type: 'button', className: 'secondary', onClick: function () { if (phase === 'prep') { setPhase('talk'); setLeft(d.talk); } else setPhase('done'); } }, phase === 'prep' ? 'Start speaking now' : 'Finish'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { setCi(ci + 1); } }, '🔄 Another card'))),
      h('div', { className: 'jx-card' }, h('strong', null, '💬 Discussion questions'), h('ul', null, d.part3.map(function (x, i) { return h('li', { key: i }, x); })),
        h('p', { className: 'jx-muted' }, 'Tip: answer, give a reason, add an example — then say what others might think. Record yourself on your phone and listen back for “um”s, speed and clear endings.')));
  }
  var INFO = [
    ['🌏 IELTS', 'Four parts: Listening (about 30 minutes, 40 questions), Reading (60 minutes, 40 questions), Writing (60 minutes: Task 1 at least 150 words, Task 2 at least 250 words) and Speaking (11–14 minutes, three parts). Results are bands from 0 to 9. Writing is marked on task achievement/response, coherence and cohesion, lexical resource, and grammatical range and accuracy. Academic Task 1 describes a chart, table, map or process; General Training Task 1 is a letter.'],
    ['🎓 Cambridge B2 First', 'Reading & Use of English (1 h 15 min), Writing (1 h 20 min, two tasks of 140–190 words: a compulsory essay, then an article, email/letter, report or review), Listening (about 40 min) and Speaking (14 min, with a partner). Scale 160–190: Grade A 180–190, B 173–179, C 160–172.'],
    ['🎓 Cambridge C1 Advanced', 'Reading & Use of English (1 h 30 min), Writing (1 h 30 min, two tasks of 220–260 words: an essay, then a letter/email, proposal, report or review), Listening (about 40 min) and Speaking (15 min). Scale 180–210: Grade A 200–210, B 193–199, C 180–192.'],
    ['🎓 Cambridge C2 Proficiency', 'Reading & Use of English (1 h 30 min), Writing (1 h 30 min: an essay summarising two texts, 240–280 words, then an article, letter, report or review, 280–320 words), Listening (about 40 min) and Speaking (16 min). Scale 200–230: Grade A 220–230, B 213–219, C 200–212.'],
    ['🥝 NZCEL', 'The New Zealand Certificate in English Language is a set of NZQA qualifications from Foundation to Level 6: Level 3 (General, Applied, Academic), Level 4 (General, Employment, Academic), Level 5 (General, Employment, Academic) and Level 6 (Advanced). Courses are run by tertiary providers and assessed through tasks across listening, speaking, reading and writing. Ask your provider which level and strand you need for study or work.']
  ];
  function ExamPractice(props) {
    var m = JNZX.useStored('jnzx-ex-mode', 'write'), mode = m[0], setMode = m[1];
    return h('div', { className: 'jx-exam' },
      h('div', { className: 'jx-wb-way', role: 'tablist', 'aria-label': 'Exam practice' },
        [['write', '✍️ Writing'], ['speak', '🗣️ Speaking'], ['about', 'ℹ️ About']].map(function (x) { return h('button', { key: x[0], type: 'button', role: 'tab', 'aria-selected': mode === x[0], className: mode === x[0] ? 'is-on' : '', onClick: function () { setMode(x[0]); } }, x[1]); })),
      mode === 'write' ? h(WritingPractice) : mode === 'speak' ? h(SpeakingPractice) :
        h('div', { className: 'jx-ex-about' }, INFO.map(function (x) { return h('div', { key: x[0], className: 'jx-card' }, h('h3', null, x[0]), h('p', null, x[1])); }),
          h('p', { className: 'small-note' }, 'Formats are summarised for practice and can change — always check the official exam information before you book.')));
  }
  JNZX.ExamPractice = ExamPractice;
  JNZX._exam = { analyse: analyse, EXAMS: EXAMS };

  JNZX.register('x:exam', function ExamPage(props) {
    return h('div', null,
      JNZX.Header('LEARNING · EXAM ENGLISH', 'Exam English with Mateo.', 'Practise writing and speaking for IELTS, Cambridge B2 First, C1 Advanced, C2 Proficiency and NZCEL — with a timer, a live word count and instant feedback.'),
      h(ExamPractice),
      h(JNZX.ShareBar, { tab: props.tab }));
  });

  var css = '.jx-ex{display:grid;gap:14px;margin-top:10px}.jx-ex-task{display:grid;gap:10px}.jx-ex-taskhead{display:flex;flex-wrap:wrap;justify-content:space-between;gap:8px;align-items:center}.jx-ex-taskhead .eyebrow{margin:0}' +
    '.jx-ex-pill{background:#eef4f0;color:#1f4d3a;border-radius:999px;padding:4px 12px;font-size:14px;font-weight:700}.jx-ex-q{font-size:18px;line-height:1.6;margin:0}' +
    '.jx-ex-tablewrap{overflow-x:auto}.jx-ex-table{border-collapse:collapse;min-width:280px}.jx-ex-table th,.jx-ex-table td{border:1px solid #cfdad3;padding:7px 12px;text-align:left}.jx-ex-table th{background:#f1f6f3}' +
    '.jx-ex-text{margin:0;padding:12px 16px;border-left:4px solid #b8cfc2;background:#f7faf8;border-radius:8px;font-style:italic}' +
    '.jx-ex-timer{display:inline-flex;gap:8px;align-items:center;flex-wrap:wrap}.jx-ex-timer span{font-weight:800;font-variant-numeric:tabular-nums;min-width:86px}.jx-ex-timer.low span{color:#b5562a}.jx-ex-timer.done span{color:#a12a3a}' +
    '.jx-ex-help summary{cursor:pointer;font-weight:700}.jx-ex-cols{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr));gap:12px;margin-top:8px}' +
    '.jx-ex-area{width:100%;box-sizing:border-box;font:inherit;font-size:17px;line-height:1.65;padding:14px;border-radius:14px;border:1px solid #cdd8d2;min-height:300px}' +
    '.jx-ex-bar{align-items:center}.jx-ex-wc{font-weight:700;padding:6px 12px;border-radius:999px;background:#f4f1e8}.jx-ex-wc.ok{background:#e5f3ea;color:#1f5c3d}.jx-ex-wc.over{background:#fbeee3;color:#8a4316}' +
    '.jx-ex-fb{display:grid;gap:12px}.jx-ex-score{display:flex;flex-wrap:wrap;gap:16px;justify-content:space-between;align-items:center}.jx-ex-big{font-size:30px;font-weight:800;margin:2px 0}' +
    '.jx-ex-crit{list-style:none;padding:0;margin:0;display:grid;gap:6px;min-width:min(100%,300px)}.jx-ex-crit li{display:flex;justify-content:space-between;gap:12px;padding:7px 12px;border-radius:10px;background:#f3f7f4}' +
    '.jx-ex-good ul,.jx-ex-notes ul{margin:6px 0 0;padding-left:20px}.jx-ex-good li,.jx-ex-notes li{margin:4px 0}.jx-ex-cue h3{margin:6px 0}' +
    '.jx-ex-speakbar{display:flex;flex-wrap:wrap;gap:10px;align-items:center}.jx-ex-phase{font-weight:800;font-size:18px;min-width:180px}.jx-ex-about{display:grid;gap:12px}' +
    'html[data-reading-theme="dark"] .jx-ex-pill,html[data-reading-theme="dark"] .jx-ex-crit li,html[data-reading-theme="dark"] .jx-ex-table th,html[data-reading-theme="dark"] .jx-ex-text,html[data-reading-theme="dark"] .jx-ex-wc{background:#22302d;color:#eef3f1}' +
    'html[data-reading-theme="dark"] .jx-ex-area{background:#18211f;color:#eef3f1;border-color:#3a4a46}html[data-reading-theme="dark"] .jx-ex-table td,html[data-reading-theme="dark"] .jx-ex-table th{border-color:#3a4a46;color:#eef3f1}' +
    'html[data-reading-theme="dark"] .jx-ex-wc.ok{background:#1f3b2c;color:#c9f0d8}html[data-reading-theme="dark"] .jx-ex-wc.over{background:#3d2a1c;color:#ffd9bd}html[data-reading-theme="dark"] .jx-ex-timer.low span{color:#ffb38a}html[data-reading-theme="dark"] .jx-ex-timer.done span{color:#ff9aa8}';
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);
})();
