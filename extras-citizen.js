/* The James NZ — Kiwi Adventures › Mock NZ Citizenship Test (October 2026).
   A practice test written for the site: 20 multiple-choice questions drawn from
   a larger bank, 45 minutes, pass mark 15 out of 20 (75%). Topics follow those the
   Department of Internal Affairs has announced for the citizenship test planned
   from late 2027: laws and rights, voting and democracy, the system of government,
   and travel to and from New Zealand. Not an official test. */
(function () {
  'use strict';
  if (!window.JNZX) return;
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect;
  // [topic, question, [options], correct index, explanation]
  var Q = [
    ['Government', 'What kind of system of government does New Zealand have?', ['A constitutional monarchy with a parliamentary democracy', 'A presidential republic', 'A federal system of states', 'A one-party state'], 0, 'New Zealand is a constitutional monarchy: the King is head of state, and the country is governed by an elected Parliament.'],
    ['Government', 'Who is New Zealand’s head of state?', ['The Prime Minister', 'The King, represented in New Zealand by the Governor-General', 'The Speaker of the House', 'The Chief Justice'], 1, 'The Sovereign (currently King Charles III) is head of state. The Governor-General represents the King in New Zealand.'],
    ['Government', 'Who leads the government of New Zealand?', ['The Governor-General', 'The Chief Justice', 'The Prime Minister', 'The Mayor of Wellington'], 2, 'The Prime Minister leads the government and chairs Cabinet.'],
    ['Government', 'How many houses (chambers) does New Zealand’s Parliament have?', ['One — the House of Representatives', 'Two — a House and a Senate', 'Three', 'None — laws are made by the courts'], 0, 'New Zealand has had a single-chamber Parliament since the Legislative Council was abolished in 1951.'],
    ['Government', 'What is the capital city of New Zealand?', ['Auckland', 'Christchurch', 'Wellington', 'Hamilton'], 2, 'Wellington is the capital and the home of Parliament.'],
    ['Government', 'How does a bill become law in New Zealand?', ['The Prime Minister signs it', 'It passes its readings in Parliament and receives the Royal assent from the Governor-General', 'A judge approves it', 'It is approved by a referendum every time'], 1, 'A bill must pass through Parliament and then receive the Royal assent, given by the Governor-General.'],
    ['Government', 'Which court is the highest court in New Zealand?', ['The District Court', 'The High Court', 'The Supreme Court of New Zealand', 'The Environment Court'], 2, 'The Supreme Court, set up in 2004, is New Zealand’s final court of appeal.'],
    ['Government', 'Why is it important that the courts are independent?', ['So judges can decide cases on the law and evidence without pressure from the government', 'So judges can make new taxes', 'So the courts can run elections', 'So judges can choose the Prime Minister'], 0, 'An independent judiciary applies the law fairly to everyone, including the government.'],
    ['Government', 'What does the Ombudsman do?', ['Collects taxes', 'Investigates complaints about government agencies and helps people get official information', 'Commands the Defence Force', 'Writes the national budget'], 1, 'The Ombudsman is an independent officer of Parliament who looks into complaints about government agencies.'],
    ['Government', 'Which groups make up local government?', ['City and district councils, and regional councils', 'The Supreme Court', 'Embassies', 'Government departments only'], 0, 'Local councils provide services like roads, water and parks. Local elections are held every three years.'],
    ['Government', 'Which languages are official languages of New Zealand by law?', ['English and French', 'Te reo Māori and New Zealand Sign Language', 'Only English', 'Samoan and Tongan'], 1, 'Te reo Māori (1987) and NZ Sign Language (2006) are official by law. English is widely used as a de facto official language.'],
    ['Government', 'What is the Treaty of Waitangi (Te Tiriti o Waitangi)?', ['A trade deal with Australia', 'An agreement signed in 1840 between the British Crown and many Māori chiefs', 'New Zealand’s first road code', 'A sports agreement'], 1, 'Te Tiriti o Waitangi was first signed on 6 February 1840 and is regarded as a founding document of New Zealand.'],
    ['Government', 'On which date is Waitangi Day, New Zealand’s national day?', ['25 April', '6 February', '1 January', '25 December'], 1, 'Waitangi Day on 6 February marks the first signing of the Treaty in 1840.'],
    ['Government', 'What are New Zealand’s two national anthems?', ['“God Defend New Zealand” and “God Save the King”', '“Pōkarekare Ana” and “Ten Guitars”', '“Advance Australia Fair” and “Waltzing Matilda”', 'There is no national anthem'], 0, 'Both have equal status; “God Defend New Zealand” is usually sung in te reo Māori and English.'],
    ['Voting', 'How often are general elections usually held?', ['Every year', 'At least every three years', 'Every five years', 'Every ten years'], 1, 'Parliament’s term is up to three years, so general elections are held at least every three years.'],
    ['Voting', 'What voting system does New Zealand use for general elections?', ['First past the post only', 'Mixed Member Proportional (MMP)', 'Online votes only', 'Votes chosen by the courts'], 1, 'MMP has been used since 1996.'],
    ['Voting', 'Under MMP, how many votes does each voter have in a general election?', ['One', 'Two — a party vote and an electorate vote', 'Three', 'As many as they like'], 1, 'The party vote decides each party’s share of seats; the electorate vote chooses your local MP.'],
    ['Voting', 'What is the minimum age to vote in a general election?', ['16', '18', '20', '21'], 1, 'You must be 18 or over to vote in a general election.'],
    ['Voting', 'Which statement about voting in New Zealand is true?', ['Enrolling to vote is required by law, but voting itself is not compulsory', 'Voting is compulsory and you will be fined if you do not vote', 'Only property owners can vote', 'Only people born in New Zealand can vote'], 0, 'Eligible people must enrol. Voting is a right and a responsibility, but it is not compulsory.'],
    ['Voting', 'Why is voting by secret ballot important?', ['It lets people vote freely without pressure or fear', 'It makes counting faster', 'It means only some people can vote', 'It lets employers check how staff voted'], 0, 'A secret ballot protects voters from pressure and keeps elections free and fair.'],
    ['Voting', 'Which people can usually enrol and vote in New Zealand?', ['Only citizens born in New Zealand', 'Citizens and permanent residents aged 18 and over who meet the residence rules', 'Anyone visiting on a tourist visa', 'Only people who own a house'], 1, 'Permanent residents can vote too, if they have lived in New Zealand continuously for at least one year at some time.'],
    ['Voting', 'How many members does Parliament usually have?', ['About 50', 'Usually 120', 'About 300', 'Exactly 10'], 1, 'Parliament usually has 120 members, sometimes slightly more because of overhang seats.'],
    ['Voting', 'What are the Māori electorates?', ['Electorates where voters on the Māori electoral roll elect their MPs', 'Seats reserved for the Governor-General', 'Local councils in Northland', 'Seats chosen by the courts'], 0, 'People of Māori descent can choose whether to enrol on the Māori roll or the general roll.'],
    ['Voting', 'Can New Zealand citizens living overseas still vote?', ['Never', 'Yes, if they have been in New Zealand within the last three years', 'Only if they live in Australia', 'Only by flying home'], 1, 'Citizens overseas can vote if they have visited New Zealand within the past three years.'],
    ['Voting', 'In 1893, New Zealand became the first self-governing country in the world to…', ['Give women the right to vote in national elections', 'Hold the Olympic Games', 'Use paper money', 'Build a railway'], 0, 'Women won the right to vote in 1893, after a campaign led by Kate Sheppard and others.'],
    ['Laws & rights', 'Which law protects rights such as freedom of expression, freedom of religion and the right to vote?', ['The Land Transport Act', 'The New Zealand Bill of Rights Act 1990', 'The Dog Control Act', 'The Copyright Act'], 1, 'The Bill of Rights Act 1990 affirms civil and political rights, including freedom of expression, religion and peaceful assembly.'],
    ['Laws & rights', 'What does the Human Rights Act 1993 do?', ['Sets speed limits', 'Makes it unlawful to discriminate in areas like jobs, housing and services on grounds such as sex, race, religion, disability or age', 'Sets tax rates', 'Decides school holidays'], 1, 'The Human Rights Act protects people from unlawful discrimination.'],
    ['Laws & rights', 'Where can you make a complaint about discrimination?', ['The Human Rights Commission', 'The Reserve Bank', 'A real estate agent', 'The local library'], 0, 'The Human Rights Commission offers free, confidential help with discrimination complaints.'],
    ['Laws & rights', 'Does New Zealand have an official state religion?', ['Yes, everyone must follow one religion', 'No — people are free to follow any religion, or none', 'Yes, but only in Auckland', 'Only on public holidays'], 1, 'Freedom of thought, conscience and religion is protected by the Bill of Rights Act.'],
    ['Laws & rights', 'Is it legal for a parent to use physical force (such as smacking) to correct a child?', ['Yes, always', 'No — the law does not allow force to be used to correct or punish a child', 'Only at home', 'Only for children over 10'], 1, 'Since 2007, the Crimes Act does not allow parents to use force for the purpose of correction.'],
    ['Laws & rights', 'Family violence, including violence against a partner, is…', ['A private family matter', 'A crime — in an emergency, call 111', 'Allowed if it happens at home', 'Only illegal in cities'], 1, 'Violence is a crime wherever it happens. Help is available, and in an emergency you should call 111.'],
    ['Laws & rights', 'What is the emergency phone number in New Zealand for police, fire and ambulance?', ['911', '999', '111', '000'], 2, 'Dial 111 in an emergency. For non-urgent police matters, call 105.'],
    ['Laws & rights', 'What number do you call for non-emergency police matters?', ['105', '111', '1737', '0800 POLICE only'], 0, '105 is the police non-emergency number, by phone or online.'],
    ['Laws & rights', 'What is the minimum age to buy alcohol in New Zealand?', ['16', '18', '20', '21'], 1, 'You must be 18 or over to buy alcohol.'],
    ['Laws & rights', 'What is the legal alcohol limit for drivers under 20 years old?', ['Zero — they must not drink and drive at all', 'The same as adults', 'Two drinks', 'There is no limit'], 0, 'Drivers under 20 have a zero alcohol limit.'],
    ['Laws & rights', 'Is it an offence to leave a child under 14 without reasonable supervision and care?', ['Yes', 'No', 'Only at night', 'Only in cars'], 0, 'The law makes it an offence to leave a child under 14 without reasonable supervision and care.'],
    ['Laws & rights', 'Is it legal to offer money or a gift to a police officer or official so they will give you special treatment?', ['Yes, it is a polite custom', 'No — bribery of officials is a serious crime', 'Only small gifts', 'Only on weekends'], 1, 'Offering or accepting bribes is a crime. New Zealand is known for low corruption.'],
    ['Laws & rights', 'In a car in New Zealand, who must wear a seatbelt or child restraint?', ['Only the driver', 'Everyone in the vehicle; young children must use an approved child restraint', 'Only front-seat passengers', 'Nobody on short trips'], 1, 'All occupants must be restrained. Children under 7 must be in an approved child restraint.'],
    ['Laws & rights', 'On which side of the road do people drive in New Zealand?', ['The right', 'The left', 'Either side', 'The middle'], 1, 'New Zealand drives on the left.'],
    ['Laws & rights', 'Since 2013, the law in New Zealand allows…', ['Marriage between two people regardless of their sex or gender', 'Only arranged marriages', 'People to marry at 12', 'Marriage only in churches'], 0, 'The Marriage (Definition of Marriage) Amendment Act 2013 allows same-sex couples to marry.'],
    ['Laws & rights', 'Which statement about work in New Zealand is true?', ['Employees must be paid at least the minimum wage and have a written employment agreement', 'Employers can pay any amount they like', 'Only citizens have employment rights', 'Written agreements are illegal'], 0, 'Employment law protects all employees, including minimum pay, breaks, holidays and a written agreement.'],
    ['Laws & rights', 'What is a responsibility of New Zealand citizens?', ['To obey New Zealand law', 'To join a political party', 'To live in Wellington', 'To own a car'], 0, 'Citizens are expected to obey the law, respect the rights of others, enrol to vote and serve on a jury if summoned.'],
    ['Laws & rights', 'Who can be called for jury service?', ['Only lawyers', 'People who are enrolled to vote', 'Only police officers', 'Tourists'], 1, 'Jurors are chosen at random from the electoral roll.'],
    ['Laws & rights', 'Which of these is protected by the New Zealand Bill of Rights Act?', ['The right to peaceful assembly', 'The right to drive without a licence', 'The right to avoid paying tax', 'The right to ignore court orders'], 0, 'Peaceful assembly, association and movement are among the rights the Act affirms.'],
    ['Travel', 'Which document do New Zealand citizens use to travel overseas?', ['A driver licence', 'A New Zealand passport, issued by the Department of Internal Affairs', 'A library card', 'A birth certificate only'], 1, 'New Zealand passports are issued by the Department of Internal Affairs.'],
    ['Travel', 'For how long is an adult New Zealand passport usually valid?', ['1 year', '5 years', '10 years', 'For life'], 2, 'Adult passports are usually valid for 10 years; children’s for 5 years.'],
    ['Travel', 'Does a New Zealand citizen need a visa to enter New Zealand?', ['Yes, every time', 'No — citizens have the right to enter New Zealand', 'Only after six months away', 'Only at Auckland Airport'], 1, 'Citizens have the right to enter and live in New Zealand.'],
    ['Travel', 'Can you keep your other citizenship when you become a New Zealand citizen?', ['New Zealand allows dual citizenship, but your other country may have its own rules', 'No, you must give it up', 'Only if you were born in Europe', 'Only for children'], 0, 'New Zealand does not require you to give up another citizenship, but check the rules of your other country.'],
    ['Travel', 'When you arrive in New Zealand, what must you do with food, plants or animal products in your bags?', ['Hide them', 'Declare them for biosecurity — there are fines if you don’t', 'Eat them on the plane', 'Nothing'], 1, 'Biosecurity protects New Zealand’s farms and nature. Declare it or dispose of it in the amnesty bins.'],
    ['Travel', 'What does the Trans-Tasman Travel Arrangement allow New Zealand citizens to do?', ['Live and work in Australia', 'Travel to Antarctica without permission', 'Drive in any country', 'Avoid customs checks everywhere'], 0, 'New Zealand and Australian citizens can travel to live and work in each other’s country.'],
    ['Travel', 'If your New Zealand passport is lost or stolen overseas, what should you do?', ['Report it and contact the nearest New Zealand embassy, high commission or consulate', 'Keep travelling without it', 'Buy a new one from a shop', 'Use a photocopy'], 0, 'Report it to the police and passport office straight away and contact the nearest New Zealand diplomatic post for help.'],
    ['Travel', 'Which government agency is responsible for New Zealand citizenship and passports?', ['The Department of Internal Affairs', 'The Ministry of Health', 'The Reserve Bank', 'New Zealand Post'], 0, 'The Department of Internal Affairs (Te Tari Taiwhenua) manages citizenship and passports.'],
    ['History', 'When is ANZAC Day, when New Zealanders remember those who served and died in war?', ['25 April', '6 February', '5 November', '25 December'], 0, 'ANZAC Day, 25 April, marks the Gallipoli landings in 1915 and honours all who served.'],
    ['History', 'What happens at a citizenship ceremony?', ['New citizens take an oath or affirmation of allegiance', 'New citizens sit a driving test', 'New citizens choose a new name', 'Nothing — it is optional paperwork only'], 0, 'At a ceremony, new citizens make an oath or affirmation of allegiance and receive their citizenship certificate.'],
    ['History', 'Who are the two partners to the Treaty of Waitangi?', ['The Crown and Māori', 'Australia and New Zealand', 'Councils and schools', 'Farmers and miners'], 0, 'Te Tiriti o Waitangi is an agreement between the Crown and Māori.'],
    ['History', 'What is the Waitangi Tribunal?', ['A body that hears claims that the Crown has breached the Treaty of Waitangi', 'A rugby team', 'A tax office', 'A tourist board'], 0, 'The Waitangi Tribunal was set up in 1975 to inquire into claims about breaches of the Treaty.']
  ];
  var N = 20, PASS = 15, MINUTES = 45;
  function shuffle(a) { a = a.slice(); for (var i = a.length - 1; i > 0; i--) { var j = Math.floor(Math.random() * (i + 1)), t = a[i]; a[i] = a[j]; a[j] = t; } return a; }
  function newTest() {
    // spread across topics: shuffle each topic and deal round-robin
    var by = {}; Q.forEach(function (q, i) { (by[q[0]] = by[q[0]] || []).push(i); });
    var piles = Object.keys(by).map(function (k) { return shuffle(by[k]); }), out = [];
    while (out.length < N) { piles.forEach(function (p) { if (p.length && out.length < N) out.push(p.pop()); }); }
    return shuffle(out).map(function (qi) { var q = Q[qi], order = shuffle([0, 1, 2, 3]); return { qi: qi, order: order, correct: order.indexOf(q[3]) }; });
  }
  function fmt(s) { var m = Math.floor(s / 60), r = s % 60; return m + ':' + (r < 10 ? '0' : '') + r; }
  function CitizenTest(props) {
    var st = useState('intro'), stage = st[0], setStage = st[1];
    var tt = useState([]), test = tt[0], setTest = tt[1];
    var aa = useState({}), ans = aa[0], setAns = aa[1];
    var ii = useState(0), cur = ii[0], setCur = ii[1];
    var ff = useState({}), flag = ff[0], setFlag = ff[1];
    var tl = useState(MINUTES * 60), left = tl[0], setLeft = tl[1];
    var best = JNZX.useStored('jnzx-citizen-best', null);
    useEffect(function () {
      if (stage !== 'test') return;
      var end = Date.now() + left * 1000;
      var id = setInterval(function () { var s = Math.max(0, Math.round((end - Date.now()) / 1000)); setLeft(s); if (s <= 0) { clearInterval(id); setStage('done'); } }, 1000);
      return function () { clearInterval(id); };
    }, [stage]);
    function start() { setTest(newTest()); setAns({}); setFlag({}); setCur(0); setLeft(MINUTES * 60); setStage('test'); try { window.scrollTo({ top: 0 }); } catch (e) {} }
    var score = test.reduce(function (n, t, i) { return n + (ans[i] === t.correct ? 1 : 0); }, 0);
    useEffect(function () { if (stage === 'done') { if (!best[0] || score > best[0]) best[1](score); try { window.scrollTo({ top: 0 }); } catch (e) {} } }, [stage]);
    if (stage === 'intro') return h('div', { className: 'jx-cit' },
      h('div', { className: 'jx-cit-rules' },
        h('div', null, h('strong', null, '20'), h('span', null, 'questions')),
        h('div', null, h('strong', null, '45'), h('span', null, 'minutes')),
        h('div', null, h('strong', null, '15/20'), h('span', null, 'to pass (75%)'))),
      h('p', null, 'Questions cover New Zealand laws and rights, voting and democracy, the system of government, and travel to and from New Zealand, plus a little history. Each test picks 20 questions at random from a bank of ' + Q.length + '.'),
      best[0] != null && h('p', { className: 'jx-muted' }, 'Your best score so far: ' + best[0] + ' / 20'),
      h('button', { type: 'button', className: 'primary jx-cit-start', onClick: start }, '▶ Start the practice test'),
      h('p', { className: 'small-note' }, 'This is a free practice test written by The James NZ — not the official test. The Department of Internal Affairs has announced a 20-question multiple-choice citizenship test with a 75% pass mark, planned from late 2027; its official study resources and time limit will be published by the Department.'));
    if (stage === 'test') {
      var t = test[cur], q = Q[t.qi], answered = Object.keys(ans).length;
      return h('div', { className: 'jx-cit' },
        h('div', { className: 'jx-cit-bar' + (left < 300 ? ' is-low' : '') }, h('span', null, '⏱ ' + fmt(left)), h('span', null, 'Question ' + (cur + 1) + ' of ' + N), h('span', null, answered + ' answered')),
        h('div', { className: 'jx-cit-q' },
          h('small', null, q[0].toUpperCase()),
          h('h3', null, (cur + 1) + '. ' + q[1]),
          h('div', { className: 'jx-cit-opts', role: 'radiogroup', 'aria-label': 'Answers' }, t.order.map(function (oi, k) {
            var on = ans[cur] === k;
            return h('button', { key: k, type: 'button', role: 'radio', 'aria-checked': on, className: 'jx-cit-opt' + (on ? ' is-on' : ''), onClick: function () { var o = Object.assign({}, ans); o[cur] = k; setAns(o); } }, h('b', null, 'ABCD'[k]), q[2][oi]);
          }))),
        h('div', { className: 'jx-row jx-cit-nav' },
          h('button', { type: 'button', className: 'secondary', disabled: cur === 0, onClick: function () { setCur(cur - 1); } }, '← Back'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { var o = Object.assign({}, flag); o[cur] = !o[cur]; setFlag(o); } }, flag[cur] ? '🚩 Flagged' : '🏳️ Flag'),
          cur < N - 1 ? h('button', { type: 'button', className: 'primary', onClick: function () { setCur(cur + 1); } }, 'Next →')
            : h('button', { type: 'button', className: 'primary', onClick: function () { if (answered < N && !confirmSubmit(N - answered)) return; setStage('done'); } }, 'Finish test')),
        h('div', { className: 'jx-cit-grid', 'aria-label': 'Jump to a question' }, test.map(function (x, i) {
          return h('button', { key: i, type: 'button', className: (i === cur ? 'is-cur ' : '') + (ans[i] != null ? 'is-done ' : '') + (flag[i] ? 'is-flag' : ''), onClick: function () { setCur(i); }, 'aria-label': 'Question ' + (i + 1) }, i + 1);
        })),
        h('button', { type: 'button', className: 'secondary jx-cit-finish', onClick: function () { if (answered < N && !confirmSubmit(N - answered)) return; setStage('done'); } }, 'Submit now'));
    }
    var pass = score >= PASS;
    return h('div', { className: 'jx-cit' },
      h('div', { className: 'jx-cit-result ' + (pass ? 'is-pass' : 'is-fail') },
        h('strong', null, score + ' / ' + N), h('span', null, pass ? '🎉 Pass! Ka pai — well done.' : 'Not yet — you need ' + PASS + ' correct to pass. Keep practising!'),
        h('small', null, Math.round(score / N * 100) + '% · time used ' + fmt(MINUTES * 60 - left))),
      h('div', { className: 'jx-row' }, h('button', { type: 'button', className: 'primary', onClick: start }, '🔄 Try a new test'),
        h(JNZX.ShareMini, { title: 'My NZ citizenship practice score', text: 'I scored ' + score + '/20 on The James NZ mock citizenship test ' + (pass ? '🎉' : '— practising for next time!'), label: 'Share my score' })),
      h('h3', null, 'Review your answers'),
      h('ol', { className: 'jx-cit-review' }, test.map(function (t, i) {
        var q = Q[t.qi], mine = ans[i], ok = mine === t.correct;
        return h('li', { key: i, className: ok ? 'is-ok' : 'is-no' },
          h('p', null, h('strong', null, (ok ? '✅ ' : '❌ ') + q[1])),
          !ok && h('p', null, 'Your answer: ' + (mine == null ? '(not answered)' : q[2][t.order[mine]])),
          h('p', null, 'Correct answer: ', h('strong', null, q[2][q[3]])),
          h('p', { className: 'jx-muted' }, q[4]));
      })));
  }
  function confirmSubmit(n) { return window.confirm ? window.confirm(n + ' question' + (n === 1 ? ' is' : 's are') + ' unanswered. Submit anyway?') : true; }
  JNZX.register('x:citizenship', function CitizenPage(props) {
    return h('div', null, JNZX.Header('KIWI ADVENTURES · MOCK CITIZENSHIP TEST', 'Practise for New Zealand citizenship.', '20 questions · 45 minutes · pass with 15 or more correct.'), h(CitizenTest, {}), h(JNZX.ShareBar, { tab: props.tab }));
  });
  JNZX.citizenBank = Q;
})();
