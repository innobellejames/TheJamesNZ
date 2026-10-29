/* The James NZ — Move Your Way (Everyday Joy), rebuilt October 2026.
   One clear set of choices: body area, effort and place. Every choice changes
   the photo, the moves, the amounts and the timer straight away. */
(function () {
  'use strict';
  var R = import_react, h = jH, useState = R.useState, useEffect = R.useEffect;
  function asset(k) { try { return __jamesAsset(k); } catch (e) { return k; } }

  var LEVELS = ['Easy', 'Normal', 'Intense'];
  var PLACES = ['Indoor', 'Outdoor'];
  var PHOTO = { Easy: 'easy', Normal: 'med', Intense: 'intense' };
  var DOSE = {
    Easy: { work: 20, rest: 40, rounds: 1, note: '5 slow, comfortable repetitions of each move. Rest as long as you like.' },
    Normal: { work: 30, rest: 30, rounds: 2, note: '8–10 controlled repetitions of each move, 2 rounds, with a short rest between.' },
    Intense: { work: 40, rest: 20, rounds: 3, note: '10–12 strong, controlled repetitions, 3 rounds. Only step up when Normal feels easy.' }
  };
  var ICON = { 'Arms & shoulders': '💪', 'Legs & hips': '🦵', 'Abdomen & core': '🧘', 'Back & posture': '🧍', 'Whole body': '🌿' };

  /* Each move: [Easy name, how], [Normal name, how], [Intense name, how] */
  var MOVES = {
    'Arms & shoulders': {
      Indoor: [
        [['Wall push-up', 'Hands on the wall at chest height. Bend your elbows slowly, then press back.'], ['Kitchen-bench push-up', 'Hands on a sturdy bench. Lower your chest towards it and push away with a straight body.'], ['Floor push-up', 'On a mat, knees or toes down. Lower with control and push up without letting your hips sag.']],
        [['Seated arm raise', 'Sit tall, lift both arms forward to shoulder height and lower slowly.'], ['Water-bottle press', 'Hold a full bottle in each hand at your shoulders and press up overhead, then lower.'], ['Bottle press & hold', 'Press the bottles overhead, hold for 3 breaths, lower for a slow count of 3.']],
        [['Arm circles', 'Arms out to the sides, draw small circles forwards then backwards.'], ['Chair dip (feet close)', 'Hands on the front of a fixed chair, feet close. Bend your elbows a little and rise.'], ['Chair dip (feet forward)', 'Walk your feet further out and dip a little deeper, keeping your shoulders down.']]
      ],
      Outdoor: [
        [['Fence push-away', 'Hands on a sturdy fence rail. Lean in by bending your elbows, then push away.'], ['Park-bench push-up', 'Hands on the edge of a fixed bench. Lower your chest and push up with a long body.'], ['Grass push-up', 'On a towel on the grass, knees or toes down. Slow down, fast up, steady breathing.']],
        [['Walking arm swings', 'Walk at an easy pace and swing your arms a little higher than normal.'], ['Power-walk punches', 'Walk briskly and punch gently forwards, alternating arms, for 10 steps at a time.'], ['Hill-walk punches', 'Walk up a gentle slope while punching forwards and up. Keep your shoulders relaxed.']],
        [['Tree stretch', 'Hold a branch or post at shoulder height and lean back gently to open your chest.'], ['Bench dip', 'Hands on the edge of a fixed bench, knees bent. Dip a little and press up.'], ['Bench dip (legs long)', 'Straighten your legs and dip with control. Stop before your shoulders feel pinched.']]
      ]
    },
    'Legs & hips': {
      Indoor: [
        [['Sit-to-stand', 'Stand up from a stable chair and sit back down slowly. Use your hands if you need to.'], ['Chair squat', 'Lower until you just touch the seat, then stand without using your hands.'], ['Slow squat', 'Squat without a chair, taking 3 counts down and 1 count up.']],
        [['Supported heel raise', 'Hold a bench, rise onto your toes and lower slowly.'], ['Heel raise', 'Rise onto your toes without holding on, pause at the top, lower slowly.'], ['Single-leg heel raise', 'Hold the bench lightly and lift one heel at a time. Change sides.']],
        [['Side leg lift', 'Hold a chair and lift one leg out to the side a little. Change sides.'], ['Back lunge (supported)', 'Hold a chair, step one foot back and bend both knees a little. Change sides.'], ['Back lunge', 'Step back into a lunge without support, front knee over your ankle, then stand.']]
      ],
      Outdoor: [
        [['Bench sit-to-stand', 'Sit on a park bench and stand up tall. Sit back down slowly.'], ['Walking lunges (short)', 'Take short lunge steps along a flat path. Rest after 6 steps.'], ['Walking lunges', 'Take full lunge steps along the path, keeping your chest up. Turn and come back.']],
        [['Kerb heel raise', 'Hold a post and rise onto your toes on flat ground. Lower slowly.'], ['Step-ups', 'Step up onto a low, stable step or kerb and back down. Change your leading leg.'], ['Fast step-ups', 'Step up and down a stable step at a steady quick pace, holding a rail if there is one.']],
        [['Easy walk', 'Walk at a pace where you can sing. Lift your knees a little more than usual.'], ['Brisk walk', 'Walk so you can talk but not sing. Swing your arms.'], ['Hill intervals', 'Walk briskly up a gentle hill, walk slowly down. Repeat.']]
      ]
    },
    'Abdomen & core': {
      Indoor: [
        [['Seated tummy brace', 'Sit tall, gently tighten your tummy and breathe normally for 5 breaths.'], ['Dead bug (arms only)', 'Lie on a mat, knees bent. Reach one arm back over your head while your back stays flat.'], ['Dead bug', 'Lie on a mat, knees up. Stretch out the opposite arm and leg slowly, then change.']],
        [['Seated knee lift', 'Sit on a chair edge and lift one knee a little. Change sides.'], ['Bird dog', 'On hands and knees, stretch out the opposite arm and leg without twisting.'], ['Bird dog with hold', 'Reach out the arm and leg, hold for 3 breaths, then change.']],
        [['Wall plank', 'Forearms on the wall, step your feet back and hold with a straight body.'], ['Kneeling plank', 'On a mat, forearms and knees down. Hold while breathing steadily.'], ['Full plank', 'Forearms and toes down, body long. Stop when your hips start to drop.']]
      ],
      Outdoor: [
        [['Tall walking', 'Walk tall with your tummy gently drawn in, as if a string lifts your head.'], ['Bench plank', 'Hands on a fixed bench, step back and hold a straight body.'], ['Bench plank walk', 'In a bench plank, step one hand at a time along the bench and back.']],
        [['Standing knee lift', 'Hold a post and lift alternate knees slowly.'], ['Marching on the spot', 'March with high knees and arms swinging, back tall.'], ['Bench mountain climber', 'Hands on a fixed bench, drive alternate knees towards it at a steady pace.']],
        [['Side bend', 'Stand tall and slide one hand down the side of your leg. Change sides.'], ['Standing twist', 'Arms folded, turn gently from side to side while your hips face forward.'], ['Woodchop (no weight)', 'Clasp your hands and move from one hip up across to the other shoulder. Change sides.']]
      ]
    },
    'Back & posture': {
      Indoor: [
        [['Shoulder blade squeeze', 'Sit tall and gently draw your shoulder blades together, then relax.'], ['Wall angels', 'Back near a wall, slide your arms up and down like a slow snow angel.'], ['Wall angels with hold', 'Slide your arms up, hold for 3 breaths at the top, lower slowly.']],
        [['Cat and cow', 'On hands and knees, round your back gently, then let it dip a little.'], ['Hip hinge', 'Hands on your hips, push your hips back with a flat back, then stand tall.'], ['Good morning', 'Hands behind your head, hinge forward from the hips, back long, then rise.']],
        [['Chin tuck', 'Sit tall and gently draw your chin straight back, then release.'], ['Superman lift (arms)', 'Lie face down and lift your arms and chest a little off the mat.'], ['Superman lift', 'Lie face down and lift arms and legs a little, hold briefly, lower slowly.']]
      ],
      Outdoor: [
        [['Tall-posture walk', 'Walk with your shoulders back and down and your eyes on the horizon.'], ['Fence row', 'Hold a sturdy rail, lean back with straight arms, then pull your chest towards it.'], ['Low fence row', 'Use a lower rail so you lean back further. Pull with your shoulder blades.']],
        [['Tree chest opener', 'Hold a post behind you with one hand and turn gently away. Change sides.'], ['Bench hip hinge', 'Stand in front of a bench, push your hips back to touch it lightly, then stand.'], ['Single-leg reach', 'Hold a post, hinge forward on one leg as the other reaches back. Change sides.']],
        [['Shoulder rolls', 'Roll your shoulders slowly up, back and down while you walk.'], ['Swimming arms', 'Standing tall, make big slow backstroke circles with each arm.'], ['Brisk walk with backstroke', 'Walk briskly while making backstroke arm circles.']]
      ]
    },
    'Whole body': {
      Indoor: [
        [['Step touch', 'Step side to side, touching your feet together, arms swinging.'], ['Squat to reach', 'Squat a little, then stand and reach both arms up high.'], ['Squat to press', 'Squat, then stand and press your hands up fast. Keep it controlled.']],
        [['Marching', 'March on the spot with arms swinging.'], ['Jumping-jack (low)', 'Step one foot out at a time as your arms lift. No jumping needed.'], ['Jumping jack', 'Jump your feet out and in while your arms go up and down. Land softly.']],
        [['Wall push & march', 'Do 5 wall push-ups, then 10 marches. Repeat.'], ['Bench push & squat', 'Do 6 bench push-ups, then 6 chair squats.'], ['Floor push & squat', 'Do 8 floor push-ups, then 10 squats, with little rest.']]
      ],
      Outdoor: [
        [['Easy walk', 'Walk at a comfortable pace on a flat path.'], ['Walk & lunge', 'Walk 30 steps, then 6 short lunges. Repeat.'], ['Walk, lunge & jog', 'Walk 30 steps, 8 lunges, then an easy 30-second jog.']],
        [['Bench step', 'Step up onto a low step and back down with a rail nearby.'], ['Bench step & push', 'Do 10 step-ups, then 6 bench push-ups.'], ['Park circuit', 'Step-ups, bench push-ups, bench squats — 10 of each, with little rest.']],
        [['Gentle hill walk', 'Walk slowly up a gentle slope and enjoy the view.'], ['Hill walk & march', 'Walk up the slope and march with high knees for the last 10 steps.'], ['Hill jog intervals', 'Jog gently up a slope, walk down to recover. Repeat.']]
      ]
    }
  };

  var STORE = 'jnzx-move-choice';
  function load() { try { var v = JSON.parse(localStorage.getItem(STORE)); if (v && MOVES[v.part]) return v; } catch (e) {} return { part: 'Arms & shoulders', level: 'Easy', place: 'Indoor' }; }
  function save(v) { try { localStorage.setItem(STORE, JSON.stringify(v)); } catch (e) {} }

  function Choice(props) {
    return h('div', { className: 'jx-move-group', role: 'group', 'aria-label': props.label },
      h('p', { className: 'jx-move-label' }, props.label),
      h('div', { className: 'jx-move-chips' }, props.items.map(function (it) {
        var on = props.value === it;
        return h('button', {
          key: it, type: 'button', className: 'jx-move-chip' + (on ? ' on' : ''), 'aria-pressed': on,
          onClick: function () { props.onPick(it); }
        }, (props.icons && props.icons[it] ? props.icons[it] + ' ' : '') + it);
      })));
  }


  /* ---------- share & print: a tidy session card ---------- */
  function rr(g, x, y, w, hh, r) { g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + hh, r); g.arcTo(x + w, y + hh, x, y + hh, r); g.arcTo(x, y + hh, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); }
  function wrapT(g, t, w) { var out = [], cur = ''; String(t).split(' ').forEach(function (x) { var n = cur ? cur + ' ' + x : x; if (g.measureText(n).width > w && cur) { out.push(cur); cur = x; } else cur = n; }); if (cur) out.push(cur); return out; }
  function drawSession(o, img) {
    var W = 1240, H = 1754, c = document.createElement('canvas'); c.width = W; c.height = H; var g = c.getContext('2d');
    g.fillStyle = '#f7f4ec'; g.fillRect(0, 0, W, H);
    g.fillStyle = '#14243a'; g.fillRect(0, 0, W, 210);
    g.textAlign = 'center'; g.fillStyle = '#d5b16d'; g.font = '600 30px Georgia, serif'; g.fillText('M O V E   Y O U R   W A Y', W / 2, 80);
    g.fillStyle = '#fff'; g.font = '700 60px "Playfair Display", Georgia, serif'; g.fillText((ICON[o.part] || '') + ' ' + o.part, W / 2, 160);
    var px = 70, py = 250, pw = W - 140, ph = 520;
    g.save(); rr(g, px, py, pw, ph, 30); g.clip();
    if (img) { var k = Math.max(pw / img.naturalWidth, ph / img.naturalHeight), dw = img.naturalWidth * k, dh = img.naturalHeight * k; g.drawImage(img, px + (pw - dw) / 2, py + (ph - dh) * 0.25, dw, dh); } else { g.fillStyle = '#dfe9e3'; g.fillRect(px, py, pw, ph); }
    g.restore();
    var chips = [o.level + ' effort', o.place, o.list.length + ' moves', 'about ' + o.mins + ' min'], cx = px, cy = py + ph + 40;
    g.font = '700 28px Arial, sans-serif'; g.textAlign = 'left';
    chips.forEach(function (t) { var w = g.measureText(t).width + 48; rr(g, cx, cy, w, 54, 27); g.fillStyle = '#245a45'; g.fill(); g.fillStyle = '#fff'; g.fillText(t, cx + 24, cy + 37); cx += w + 14; });
    var y = cy + 100;
    o.list.forEach(function (m, i) {
      g.font = '26px Arial, sans-serif'; var lines = wrapT(g, m[1], W - 300), hh = 84 + lines.length * 36;
      rr(g, 70, y, W - 140, hh, 22); g.fillStyle = '#ffffff'; g.fill(); g.strokeStyle = '#dfe7e2'; g.lineWidth = 2; g.stroke();
      g.fillStyle = '#e7f0ea'; g.beginPath(); g.arc(130, y + 48, 32, 0, 7); g.fill(); g.fillStyle = '#245a45'; g.font = '800 32px Arial, sans-serif'; g.textAlign = 'center'; g.fillText(String(i + 1), 130, y + 59);
      g.textAlign = 'left'; g.fillStyle = '#14243a'; g.font = '700 34px Georgia, serif'; g.fillText(m[0], 190, y + 58);
      g.fillStyle = '#3b4a46'; g.font = '26px Arial, sans-serif'; lines.forEach(function (l, j) { g.fillText(l, 190, y + 100 + j * 36); });
      y += hh + 20;
    });
    g.fillStyle = '#5a6b66'; g.font = 'italic 26px Georgia, serif'; g.textAlign = 'left';
    wrapT(g, o.d.note + ' Move ' + o.d.work + 's, rest ' + o.d.rest + 's.', W - 160).forEach(function (l) { y += 36; g.fillText(l, 80, y); });
    g.font = '22px Arial, sans-serif'; g.fillStyle = '#7a8a86'; y += 20;
    wrapT(g, 'Warm up first, breathe normally and stop if anything hurts. Check with your doctor or physio if you are pregnant, injured or managing a health condition.', W - 160).forEach(function (l) { if (y < H - 140) { y += 30; g.fillText(l, 80, y); } });
    g.textAlign = 'center'; g.fillStyle = '#14243a'; g.font = '700 32px Georgia, serif'; g.fillText('T H E   J A M E S   N Z', W / 2, H - 70);
    g.fillStyle = '#657184'; g.font = '24px Arial, sans-serif'; g.fillText('www.thejamesnz.com', W / 2, H - 32);
    return c;
  }
  function withImg(src, fn) { var im = new Image(); im.onload = function () { fn(im); }; im.onerror = function () { fn(null); }; im.src = src; }
  function sessionCard(o) { return new Promise(function (ok, bad) { withImg(o.photo, function (im) { drawSession(o, im).toBlob(function (b) { b ? ok(new File([b], 'TheJamesNZ-move-your-way.png', { type: 'image/png' })) : bad(Error('blob')); }, 'image/png'); }); }); }
  function printCard(o) {
    var w = window.open('', '_blank'); if (!w) { alert('Please allow pop-ups to print.'); return; }
    w.document.write('<!doctype html><title>Move Your Way</title><p style="font-family:sans-serif">Preparing your page…</p>');
    withImg(o.photo, function (im) { var url = drawSession(o, im).toDataURL('image/png'); w.document.open(); w.document.write('<!doctype html><title>Move Your Way · The James NZ</title><style>@page{size:A4;margin:8mm}body{margin:0}img{width:100%;display:block}</style><img src="' + url + '" onload="setTimeout(function(){print()},300)">'); w.document.close(); });
  }

  function MoveYourWay() {
    var st = useState(load), c = st[0], setC = st[1];
    var part = c.part, level = c.level, place = c.place;
    function pick(k) { return function (v) { var n = Object.assign({}, c); n[k] = v; setC(n); save(n); }; }
    var li = LEVELS.indexOf(level), d = DOSE[level];
    var list = MOVES[part][place].map(function (m) { return m[li]; });
    var photo = asset('./workout-photos/' + PHOTO[level] + '-' + (place === 'Indoor' ? 'home' : 'outdoor') + '.webp');
    var seq = [];
    for (var r = 0; r < d.rounds; r++) list.forEach(function (m, i) { seq.push({ name: m[0], how: m[1], round: r + 1, i: i }); });

    var t = useState({ step: 0, phase: 'Move', left: d.work, run: false }), T = t[0], setT = t[1];
    useEffect(function () { setT({ step: 0, phase: 'Move', left: d.work, run: false }); }, [part, level, place]);
    useEffect(function () {
      if (!T.run) return;
      var id = setInterval(function () {
        setT(function (s) {
          if (s.left > 1) return Object.assign({}, s, { left: s.left - 1 });
          try { navigator.vibrate && navigator.vibrate(120); } catch (e) {}
          if (s.phase === 'Move') {
            if (s.step >= seq.length - 1) return { step: s.step, phase: 'Done', left: 0, run: false };
            return { step: s.step, phase: 'Rest', left: d.rest, run: true };
          }
          return { step: s.step + 1, phase: 'Move', left: d.work, run: true };
        });
      }, 1000);
      return function () { clearInterval(id); };
    }, [T.run, part, level, place]);
    var cur = seq[Math.min(T.step, seq.length - 1)], nxt = seq[T.step + 1];
    var total = seq.length * d.work + (seq.length - 1) * d.rest;
    var shareText = 'My Move Your Way session: ' + part + ' · ' + level + ' · ' + place + '\n' + list.map(function (m, i) { return (i + 1) + '. ' + m[0]; }).join('\n') + '\n' + d.note;

    return h('section', { className: 'j-section jx-move' },
      h('p', { className: 'eyebrow' }, 'EVERYDAY JOY · MOVE YOUR WAY'),
      h('h1', null, 'A little movement, your way.'),
      h('p', null, 'Tap a body area, how hard you want to work and where you are. Your moves, photo and timer change straight away.'),
      h('div', { className: 'jx-move-pickers' },
        h(Choice, { label: '1. Body area', items: Object.keys(MOVES), value: part, onPick: pick('part'), icons: ICON }),
        h(Choice, { label: '2. Effort', items: LEVELS, value: level, onPick: pick('level'), icons: { Easy: '🌱', Normal: '🚶', Intense: '🔥' } }),
        h(Choice, { label: '3. Where', items: PLACES, value: place, onPick: pick('place'), icons: { Indoor: '🏠', Outdoor: '🌳' } })),
      h('div', { className: 'jx-move-hero2', key: level + place },
        h('div', { className: 'jx-move-pic' }, h('img', { src: photo, alt: 'The James family moving together' }), h('span', { className: 'jx-move-pill' }, (ICON[part] || '') + ' ' + part + ' · ' + level + ' · ' + place)),
        h('div', { className: 'jx-move-info' },
          h('h2', null, list.length + ' moves · about ' + Math.max(1, Math.round(total / 60)) + ' min'),
          h('div', { className: 'jx-move-stats' },
            h('span', null, h('b', null, d.work + 's'), ' move'), h('span', null, h('b', null, d.rest + 's'), ' rest'), h('span', null, h('b', null, d.rounds), d.rounds > 1 ? ' rounds' : ' round')),
          h('p', null, d.note))),
      h('ol', { className: 'jx-move-list', key: part + level + place }, list.map(function (m, i) {
        return h('li', { key: m[0], className: cur && cur.i === i && T.phase !== 'Done' && (T.run || T.step > 0) ? 'now' : '' }, h('h3', null, m[0]), h('p', null, m[1]));
      })),
      h('div', { className: 'jx-move-timer', 'aria-live': 'polite' },
        h('div', null,
          h('p', { className: 'eyebrow' }, T.phase === 'Done' ? 'ALL DONE' : T.phase === 'Rest' ? 'REST · UP NEXT: ' + (nxt ? nxt.name : '') : 'ROUND ' + cur.round + ' OF ' + d.rounds + ' · MOVE ' + (T.step + 1) + ' OF ' + seq.length),
          h('h3', null, T.phase === 'Done' ? 'Well done! 🎉 Have a drink of water.' : T.phase === 'Rest' ? (place === 'Outdoor' ? 'Easy walking' : 'Rest and breathe') : cur.name),
          T.phase !== 'Done' && h('p', { className: 'jx-move-count' }, T.left + 's')),
        h('div', { className: 'jx-row' },
          T.phase !== 'Done' && h('button', { type: 'button', className: 'primary', onClick: function () { setT(Object.assign({}, T, { run: !T.run })); } }, T.run ? '⏸ Pause' : '▶ Start'),
          T.phase !== 'Done' && h('button', { type: 'button', className: 'secondary', onClick: function () {
            if (T.phase === 'Move' && T.step >= seq.length - 1) setT({ step: T.step, phase: 'Done', left: 0, run: false });
            else if (T.phase === 'Move') setT({ step: T.step, phase: 'Rest', left: d.rest, run: T.run });
            else setT({ step: T.step + 1, phase: 'Move', left: d.work, run: T.run });
          } }, '⏭ Skip'),
          h('button', { type: 'button', className: 'secondary', onClick: function () { setT({ step: 0, phase: 'Move', left: d.work, run: false }); } }, '↺ Restart'))),
      h('p', { className: 'small-note' }, 'Warm up with 2 minutes of easy marching or walking and finish with gentle stretches. Breathe normally and stop if you feel pain, dizziness or unusual breathlessness. If you are pregnant, recovering after birth, injured or managing a health condition, check with your doctor or physio first. Intense means a harder version — not moving as fast as possible.'),
      h('div', { className: 'jx-row jx-move-out' },
        JNZX.ShareMini && h(JNZX.ShareMini, { title: 'Move Your Way — ' + part, text: shareText, label: 'Share this session', picture: function () { return sessionCard(info()); } }),
        h('button', { type: 'button', className: 'secondary', onClick: function () { printCard(info()); } }, '🖨️ Print this session')));
    function info() { return { part: part, level: level, place: place, photo: photo, list: list, d: d, mins: Math.max(1, Math.round(total / 60)) }; }
  }

  try { Workouts = MoveYourWay; BodyWorkouts = function () { return null; }; } catch (e) { console.warn('[JNZX] move', e); }

  var css = '.jx-move-pickers{display:grid;gap:14px;margin:18px 0}.jx-move-label{margin:0 0 6px;font-weight:700;font-size:15px}' +
    '.jx-move-chips{display:flex;flex-wrap:wrap;gap:8px}.jx-move-chip{position:relative;z-index:2;touch-action:manipulation;-webkit-tap-highlight-color:transparent;cursor:pointer;min-height:44px;padding:9px 16px;border-radius:999px;border:2px solid #c9d6cf;background:#fff;color:#1f2a2a;font:inherit;font-size:15px;font-weight:600}' +
    '.jx-move-chip.on{background:#245a45;border-color:#245a45;color:#fff}.jx-move-chip:focus-visible{outline:3px solid #f0b84a;outline-offset:2px}' +
    '.jx-move-hero{border-radius:18px;padding:90px 22px 22px;background-size:cover;background-position:center;color:#fff;animation:jxMoveIn .35s ease}.jx-move-hero h2{color:#fff;margin:10px 0 6px}.jx-move-hero p{color:#f1f5f3;margin:0}' +
    '.jx-move-pill{display:inline-block;background:#fff;color:#8a1f2c;border-radius:999px;padding:5px 12px;font-weight:700;font-size:13px}' +
    '.jx-move-list{list-style:none;padding:0;margin:18px 0;display:grid;gap:12px;counter-reset:mv;animation:jxMoveIn .35s ease}.jx-move-list li{counter-increment:mv;position:relative;padding:14px 16px 14px 58px;border:1px solid #dfe7e2;border-radius:14px;background:#fff}' +
    '.jx-move-list li:before{content:counter(mv);position:absolute;left:14px;top:14px;width:32px;height:32px;border-radius:50%;background:#e7f0ea;color:#245a45;font-weight:800;display:grid;place-items:center}.jx-move-list li.now{border-color:#245a45;box-shadow:0 0 0 2px #245a4533}.jx-move-list h3{margin:0 0 4px;font-size:18px}.jx-move-list p{margin:0}' +
    '.jx-move-timer{display:flex;flex-wrap:wrap;gap:14px;justify-content:space-between;align-items:center;padding:16px 18px;border-radius:16px;background:#f3f7f4;margin-bottom:14px}.jx-move-timer h3{margin:2px 0}.jx-move-count{font-size:34px;font-weight:800;margin:0}' +
    '.jx-move-hero2{display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:0;border-radius:20px;overflow:hidden;background:#fff;box-shadow:0 4px 14px rgba(20,36,58,.1);animation:jxMoveIn .35s ease}' +
    '.jx-move-pic{position:relative;min-height:260px}.jx-move-pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover;object-position:50% 45%}.jx-move-pic .jx-move-pill{position:absolute;left:14px;bottom:14px;box-shadow:0 2px 8px rgba(0,0,0,.2)}' +
    '.jx-move-info{padding:22px 24px;display:flex;flex-direction:column;justify-content:center;gap:10px}.jx-move-info h2{margin:0;font-family:"Playfair Display",Georgia,serif;color:#14243a}.jx-move-info p{margin:0;color:#3b4a46}' +
    '.jx-move-stats{display:flex;gap:8px;flex-wrap:wrap}.jx-move-stats span{background:#e7f0ea;color:#245a45;border-radius:12px;padding:6px 12px;font-size:.9rem}.jx-move-stats b{font-size:1.1rem;margin-right:2px}' +
    '@media (max-width:700px){.jx-move-hero2{grid-template-columns:1fr}.jx-move-pic{min-height:220px}}' +
    'html[data-reading-theme="dark"] .jx-move-hero2{background:#18211f}html[data-reading-theme="dark"] .jx-move-info h2{color:#f1f4f3}html[data-reading-theme="dark"] .jx-move-info p{color:#d7e2de}html[data-reading-theme="dark"] .jx-move-stats span{background:#26322f;color:#bfe6d2}' +
    '@keyframes jxMoveIn{from{opacity:.3;transform:translateY(6px)}to{opacity:1;transform:none}}' +
    'html[data-reading-theme="dark"] .jx-move-chip{background:#1c2626;color:#eef3f1;border-color:#3d4d4a}html[data-reading-theme="dark"] .jx-move-chip.on{background:#7fc4a2;color:#0f1a17;border-color:#7fc4a2}' +
    'html[data-reading-theme="dark"] .jx-move-list li{background:#1c2626;border-color:#33433f;color:#eef3f1}html[data-reading-theme="dark"] .jx-move-list li:before{background:#2b3b37;color:#bfe6d2}html[data-reading-theme="dark"] .jx-move-timer{background:#1c2626;color:#eef3f1}' +
    'html[data-reading-theme="dark"] .jx-move-list h3,html[data-reading-theme="dark"] .jx-move-timer h3,html[data-reading-theme="dark"] .jx-move-label{color:#eef3f1}';
  var s = document.createElement('style'); s.textContent = css; document.head.appendChild(s);
})();
