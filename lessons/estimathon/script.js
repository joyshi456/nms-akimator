// ============================================================
// Estimathon! Fermi Problem Lab — script.js
// ============================================================

let currentStage = 1;
let practiceScore = { correct: 0, total: 0 };

// ============================================================
// PROBLEM BANKS
// ============================================================

// Stage 1: Multiple choice "thinking like Fermi"
const FERMI_THINKING = [
  {
    q: 'Question: <strong>How many basketballs would fit in a school gym?</strong> What\'s the best first step?',
    options: [
      { label: 'A', text: 'Look up the volume of a basketball online.' },
      { label: 'B', text: 'Estimate the gym\'s length, width, and height in feet — then estimate a basketball\'s size.' },
      { label: 'C', text: 'Count basketballs at your school until you have a rough idea.' },
    ],
    correct: 'B',
    explain: 'Break it down! Estimate volumes first — that\'s the Fermi way. You divide gym volume by ball volume.'
  },
  {
    q: 'Question: <strong>How many slices of pizza does the USA eat per year?</strong> What\'s the best breakdown?',
    options: [
      { label: 'A', text: '(US population) × (slices per person per year)' },
      { label: 'B', text: '(Number of pizzerias) × (1000)' },
      { label: 'C', text: 'Just guess a really big number.' },
    ],
    correct: 'A',
    explain: 'Multiply the population by an average per-person rate. Most Americans probably eat ~30-50 slices per year.'
  },
  {
    q: 'Question: <strong>How many heartbeats in your lifetime?</strong> Which estimate makes sense?',
    options: [
      { label: 'A', text: '(beats per second) × (seconds in a lifetime)' },
      { label: 'B', text: '(beats per minute) × (minutes per day) × (days per year) × (years lived)' },
      { label: 'C', text: 'Both A and B work — they\'re the same idea, just different units!' },
    ],
    correct: 'C',
    explain: 'Both work! Pick whichever units feel easiest. ~70 bpm × 60 min × 24 hr × 365 days × 80 years ≈ 3 billion.'
  },
  {
    q: 'Fermi\'s rule: which sentence is the BEST estimator mindset?',
    options: [
      { label: 'A', text: '"I need the exact answer or I won\'t guess at all."' },
      { label: 'B', text: '"If I\'m within 10× of the right answer, I\'m doing great!"' },
      { label: 'C', text: '"Bigger numbers are usually right."' },
    ],
    correct: 'B',
    explain: 'Estimation is about ballparks, not exact numbers. Same order of magnitude is the goal.'
  },
];

// Stage 2: Order of magnitude practice
const OOM_PROBLEMS = [
  {
    q: 'What is the order of magnitude of <strong>4,300</strong>?',
    options: [
      { label: 'A', text: '10² (hundreds)' },
      { label: 'B', text: '10³ (thousands)' },
      { label: 'C', text: '10⁴ (ten thousands)' },
    ],
    correct: 'B',
    explain: '4,300 is between 1,000 and 10,000, so its order of magnitude is 10³.'
  },
  {
    q: 'You guessed <strong>500</strong>. The real answer is <strong>1,200</strong>. How many points (using our scoring)?',
    options: [
      { label: 'A', text: '10 points (within 2×)' },
      { label: 'B', text: '7 points (within 5×)' },
      { label: 'C', text: '5 points (within 10×)' },
      { label: 'D', text: '0 points (way off)' },
    ],
    correct: 'B',
    explain: '1200 ÷ 500 = 2.4. That\'s within 5×, so you get 7 points. (You\'d need within 2× for 10 pts.)'
  },
  {
    q: 'You guessed <strong>1,000,000</strong>. The real answer is <strong>50</strong>. Score?',
    options: [
      { label: 'A', text: '5 points' },
      { label: 'B', text: '2 points' },
      { label: 'C', text: '0 points' },
    ],
    correct: 'C',
    explain: '1,000,000 ÷ 50 = 20,000. That\'s WAY more than 100×, so 0 points. You overshot by 4 orders of magnitude!'
  },
  {
    q: 'About how many seconds are in 32 years?',
    options: [
      { label: 'A', text: '~10⁶ (1 million)' },
      { label: 'B', text: '~10⁹ (1 billion)' },
      { label: 'C', text: '~10¹² (1 trillion)' },
    ],
    correct: 'B',
    explain: '32 yr × 365 days × 24 hr × 3600 sec ≈ 1 billion. A useful fact for Fermi problems!'
  },
];

// Stage 3: Warm-up problems (easier, with definite answers)
const WARMUP_PROBLEMS = [
  {
    q: 'How many seconds are in a single day?',
    answer: 86400,
    answerLabel: '86,400',
    breakdown: '24 hours × 60 minutes × 60 seconds = 86,400 seconds.'
  },
  {
    q: 'How many minutes are in a year?',
    answer: 525600,
    answerLabel: '525,600',
    breakdown: '365 days × 24 hours × 60 minutes ≈ 525,600 minutes. (The musical "Rent" sang about this!)'
  },
  {
    q: 'About how many hairs are on a typical human head?',
    answer: 100000,
    answerLabel: '~100,000',
    breakdown: 'Most people have between 80,000 and 150,000 head hairs. About 100,000 is a great estimate.'
  },
  {
    q: 'How many pages are there in roughly all 7 Harry Potter books combined?',
    answer: 4100,
    answerLabel: '~4,100',
    breakdown: 'The 7 Harry Potter books total about 4,100 pages (3,407 in the US edition, ~4,100 with bigger UK editions).'
  },
  {
    q: 'How many feet tall is the Statue of Liberty (including the pedestal)?',
    answer: 305,
    answerLabel: '305 feet',
    breakdown: 'The statue itself is 151 ft, the pedestal adds ~154 ft, total ≈ 305 ft (93 meters).'
  },
  {
    q: 'How many heartbeats does a person have in an 80-year lifetime?',
    answer: 3000000000,
    answerLabel: '~3 billion',
    breakdown: '~70 beats/min × 60 min × 24 hr × 365 days × 80 years ≈ 3 billion heartbeats.'
  },
  {
    q: 'How many words are in the King James Bible?',
    answer: 783000,
    answerLabel: '~783,000',
    breakdown: 'About 783,000 words across both testaments. (For comparison: the Harry Potter series has ~1.1 million words.)'
  },
  {
    q: 'How many breaths does an average person take in one day?',
    answer: 23000,
    answerLabel: '~23,000',
    breakdown: '~16 breaths/minute × 60 min × 24 hours ≈ 23,000 breaths per day.'
  },
];

// Stage 4: Classic hard Fermi problems
const CLASSIC_PROBLEMS = [
  {
    q: 'How many piano tuners are there in Chicago?',
    answer: 150,
    answerLabel: '~150',
    breakdown: 'Fermi\'s original problem! Chicago ~3M people / ~3 per household = 1M households. ~1 in 20 has a piano = 50,000 pianos. Tuned once a year, with each tuner doing ~1000 tunings/year → ~50-150 tuners. Real answer: ~150.',
    hint: 'Population of Chicago → households → pianos → tunings per year → tuners needed.'
  },
  {
    q: 'How many cats live in the United States?',
    answer: 73000000,
    answerLabel: '~73 million',
    breakdown: 'US has ~330 million people, ~120 million households. About 1 in 4 households owns cats, with avg ~2 cats per cat-owning home. So ~30M × 2.5 ≈ 75 million cats. (Real estimates: 60–95 million.)',
    hint: 'Households × fraction with cats × cats per household.'
  },
  {
    q: 'How many golf balls would fit in a typical school bus?',
    answer: 600000,
    answerLabel: '~500,000-700,000',
    breakdown: 'A school bus is roughly 35 ft × 8 ft × 6 ft ≈ 1,680 cubic feet ≈ 2.9 million cubic inches. A golf ball volume is ~2.5 cubic inches, but with packing inefficiency, a ball "uses" ~5 cubic inches. So ~600,000 balls.',
    hint: 'Volume of bus / effective volume per golf ball (account for empty space between balls).'
  },
  {
    q: 'How many slices of pizza does the USA eat per year?',
    answer: 3000000000,
    answerLabel: '~3 billion',
    breakdown: '330M Americans × ~9 slices/person/year ≈ 3 billion. (Some estimates go up to 10 billion if you count all pizza-portions.)',
    hint: 'Population × average slices per person per year.'
  },
  {
    q: 'How many ants are alive on Earth right now?',
    answer: 20000000000000000,
    answerLabel: '~20 quadrillion (2×10¹⁶)',
    breakdown: 'Recent biology studies estimate around 20,000,000,000,000,000 ants on Earth — roughly 2.5 million ants per human!',
    hint: 'This one is wild. Try ants per square meter × Earth\'s land surface area.'
  },
  {
    q: 'How many hot dogs do Americans eat at baseball games each year?',
    answer: 20000000,
    answerLabel: '~20 million',
    breakdown: '~30 MLB teams × ~80 home games × ~30,000 fans × ~25% who eat a hot dog ≈ 18-20 million hot dogs per year.',
    hint: 'Teams × games × fans per game × fraction who buy a hot dog.'
  },
  {
    q: 'How many trees are in the Amazon rainforest?',
    answer: 390000000000,
    answerLabel: '~390 billion',
    breakdown: 'Studies estimate ~390 billion trees across the ~5.5 million km² of Amazon rainforest — about 70,000 trees per km².',
    hint: 'Trees per square meter × area of Amazon (~5.5 million km²).'
  },
  {
    q: 'How many smartphones are active in the world today?',
    answer: 7000000000,
    answerLabel: '~7 billion',
    breakdown: 'World population is ~8 billion. With smartphone adoption near 85% globally, that\'s ~6.8-7 billion active devices.',
    hint: 'World population × fraction who own a smartphone.'
  },
  {
    q: 'How many breaths does a person take in a 75-year lifetime?',
    answer: 600000000,
    answerLabel: '~600 million',
    breakdown: '~16 breaths/min × 60 × 24 × 365 × 75 ≈ 630 million breaths.',
    hint: 'Breaths per minute × minutes per year × years lived.'
  },
  {
    q: 'How much money would a stack of 1 million $1 bills be worth in height (in inches)?',
    answer: 4300,
    answerLabel: '~4,300 inches (358 ft tall!)',
    breakdown: 'A dollar bill is ~0.0043 inches thick. 1,000,000 × 0.0043 = ~4,300 inches, or 358 feet — taller than the Statue of Liberty!',
    hint: 'Thickness of one bill × 1 million.'
  },
  {
    q: 'How many words has a typical 20-year-old spoken in their lifetime?',
    answer: 150000000,
    answerLabel: '~150 million',
    breakdown: 'Average ~16,000 words/day × 365 days × ~20 years (excluding babyhood) ≈ 100-150 million words.',
    hint: 'Words per day × days × years (subtract a few baby years).'
  },
  {
    q: 'How many gallons of milk do Americans drink per year?',
    answer: 6000000000,
    answerLabel: '~6 billion gallons',
    breakdown: '330M Americans × ~18 gal/year per person ≈ 6 billion gallons. (Per capita milk consumption has been falling for years.)',
    hint: 'Population × gallons per person per year.'
  },
];

// Estimathon game question pool (similar to classics, but a bigger pool)
const GAME_QUESTIONS = [
  { q: 'How many cats live in the United States?', answer: 73000000, label: '~73 million' },
  { q: 'How many golf balls fit in a school bus?', answer: 600000, label: '~600,000' },
  { q: 'How many slices of pizza are eaten in the US per year?', answer: 3000000000, label: '~3 billion' },
  { q: 'How many ants are alive on Earth?', answer: 20000000000000000, label: '~20 quadrillion' },
  { q: 'How many hot dogs do MLB fans eat per year?', answer: 20000000, label: '~20 million' },
  { q: 'How many trees are in the Amazon rainforest?', answer: 390000000000, label: '~390 billion' },
  { q: 'How many active smartphones are in the world?', answer: 7000000000, label: '~7 billion' },
  { q: 'How many breaths in a 75-year human lifetime?', answer: 600000000, label: '~600 million' },
  { q: 'How many piano tuners are in Chicago?', answer: 150, label: '~150' },
  { q: 'How many hairs on a typical human head?', answer: 100000, label: '~100,000' },
  { q: 'How many heartbeats in an 80-year life?', answer: 3000000000, label: '~3 billion' },
  { q: 'How many seconds are in a year?', answer: 31536000, label: '~31.5 million' },
  { q: 'How many McDonald\'s restaurants are in the world?', answer: 40000, label: '~40,000' },
  { q: 'How many books has the average person read by age 80?', answer: 1000, label: '~1,000' },
  { q: 'How many languages are spoken in the world today?', answer: 7000, label: '~7,000' },
  { q: 'How many stars in the Milky Way galaxy?', answer: 200000000000, label: '~200 billion' },
  { q: 'How many bricks in the Empire State Building?', answer: 10000000, label: '~10 million' },
  { q: 'How many words in the entire Wikipedia (English)?', answer: 4500000000, label: '~4.5 billion' },
  { q: 'How many Lego bricks have been made in history?', answer: 700000000000, label: '~700 billion' },
  { q: 'How many honey bees in a typical hive?', answer: 50000, label: '~50,000' },
  { q: 'How many words in the average paperback novel?', answer: 90000, label: '~90,000' },
  { q: 'How many gallons of water in an Olympic swimming pool?', answer: 660000, label: '~660,000' },
  { q: 'How many people fly on US airlines each day?', answer: 2500000, label: '~2.5 million' },
  { q: 'How many YouTube videos are uploaded per minute?', answer: 500, label: '~500 hours of video' },
  { q: 'How many eggs do Americans eat per year (in dozens)?', answer: 8000000000, label: '~8 billion eggs' },
];

// ============================================================
// SCORING
// ============================================================
function scoreGuess(guess, real) {
  const g = Math.abs(parseFloat(guess));
  const r = Math.abs(parseFloat(real));
  if (!isFinite(g) || g <= 0) return { points: 0, tier: 'miss', label: 'Invalid guess' };
  const ratio = Math.max(g, r) / Math.min(g, r);
  if (ratio < 2)   return { points: 10, tier: 'excellent', label: '🎯 Bullseye!' };
  if (ratio < 5)   return { points: 7,  tier: 'great',     label: '🌟 Great guess!' };
  if (ratio < 10)  return { points: 5,  tier: 'good',      label: '👍 Same order of magnitude!' };
  if (ratio < 100) return { points: 2,  tier: 'ok',        label: '😅 Off by 1-2 orders' };
  return { points: 0, tier: 'miss', label: '❌ Way off' };
}

function formatBig(n) {
  const abs = Math.abs(n);
  if (abs >= 1e15) return (n/1e15).toPrecision(3) + ' quadrillion';
  if (abs >= 1e12) return (n/1e12).toPrecision(3) + ' trillion';
  if (abs >= 1e9)  return (n/1e9).toPrecision(3) + ' billion';
  if (abs >= 1e6)  return (n/1e6).toPrecision(3) + ' million';
  if (abs >= 1e3)  return Math.round(n).toLocaleString();
  return n.toLocaleString();
}

function parseGuess(str) {
  if (!str) return NaN;
  let s = String(str).trim().toLowerCase().replace(/,/g, '').replace(/\s+/g, '');
  // Handle "k", "m", "b", "t", "quad" suffixes
  const suffixes = [
    { re: /quadrillion|quad/, mul: 1e15 },
    { re: /trillion|^t$|t$/, mul: 1e12 },
    { re: /billion|^b$|b$/, mul: 1e9 },
    { re: /million|^m$|mil|m$/, mul: 1e6 },
    { re: /thousand|^k$|k$/, mul: 1e3 },
  ];
  for (const { re, mul } of suffixes) {
    if (re.test(s)) {
      const num = parseFloat(s);
      if (!isNaN(num)) return num * mul;
    }
  }
  return parseFloat(s);
}

// ============================================================
// NAVIGATION
// ============================================================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => showStage(parseInt(tab.dataset.stage)));
});

function showStage(stage) {
  currentStage = stage;
  document.querySelectorAll('.stage').forEach(s => s.classList.add('hidden'));
  document.getElementById(`stage-${stage}`).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.stage) === stage);
  });
  window.scrollTo(0, 0);
}

// ============================================================
// PRACTICE SCORE
// ============================================================
function loadPracticeScore() {
  const saved = localStorage.getItem('estimathon-score');
  if (saved) {
    try { practiceScore = JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  updatePracticeScoreDisplay();
}

function savePracticeScore() {
  localStorage.setItem('estimathon-score', JSON.stringify(practiceScore));
  updatePracticeScoreDisplay();
}

function updatePracticeScoreDisplay() {
  document.getElementById('score-display').textContent =
    `Practice score: ${practiceScore.correct} / ${practiceScore.total}`;
}

function resetPracticeScore() {
  practiceScore = { correct: 0, total: 0 };
  savePracticeScore();
  // Also reset all visible state
  document.querySelectorAll('.mc-option').forEach(opt => {
    opt.classList.remove('correct', 'incorrect', 'selected');
    opt.style.pointerEvents = '';
  });
  document.querySelectorAll('.mc-feedback').forEach(fb => {
    fb.textContent = '';
    fb.className = 'mc-feedback';
  });
  document.querySelectorAll('.problem-card').forEach(c => c.classList.remove('scored'));
  document.querySelectorAll('.guess-input').forEach(inp => {
    inp.value = ''; inp.disabled = false;
  });
  document.querySelectorAll('.reveal-block, .hint-block').forEach(b => b.remove());
  document.querySelectorAll('.btn-reveal').forEach(b => b.disabled = false);
}

// ============================================================
// STAGE 1 & 2 RENDER: Multiple choice
// ============================================================
function renderMCProblems(containerId, problems) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  problems.forEach((prob, idx) => {
    const id = `${containerId}-${idx}`;
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.innerHTML = `
      <div class="problem-number">Question ${idx + 1}</div>
      <div class="problem-text">${prob.q}</div>
      <div class="mc-options" id="opts-${id}">
        ${prob.options.map(opt =>
          `<button class="mc-option" data-value="${opt.label}">${opt.label}) ${opt.text}</button>`
        ).join('')}
      </div>
      <div class="mc-feedback" id="fb-${id}"></div>
    `;
    container.appendChild(card);
    // wire up clicks
    card.querySelectorAll('.mc-option').forEach(btn => {
      btn.addEventListener('click', () => answerMC(id, btn.dataset.value, prob));
    });
  });
}

function answerMC(id, choice, prob) {
  const fb = document.getElementById(`fb-${id}`);
  const opts = document.querySelectorAll(`#opts-${id} .mc-option`);
  // already answered?
  if (fb.dataset.answered) return;
  fb.dataset.answered = '1';

  const correct = choice === prob.correct;
  practiceScore.total++;
  if (correct) practiceScore.correct++;
  savePracticeScore();

  opts.forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.dataset.value === prob.correct) o.classList.add('correct');
    else if (o.dataset.value === choice) o.classList.add('incorrect');
  });

  fb.innerHTML = (correct ? '✅ Correct! ' : `❌ Not quite. The answer is ${prob.correct}. `) +
    `<em>${prob.explain}</em>`;
  fb.className = 'mc-feedback ' + (correct ? 'correct' : 'incorrect');
}

// ============================================================
// STAGE 2: OOM TOOLS
// ============================================================
function showOOM() {
  const v = parseGuess(document.getElementById('oom-input').value);
  const out = document.getElementById('oom-result');
  if (!isFinite(v) || v <= 0) {
    out.innerHTML = '<span style="color:#c62828">Enter a positive number.</span>';
    return;
  }
  const oom = Math.round(Math.log10(v));
  const tenPow = Math.pow(10, oom);
  out.innerHTML =
    `<strong>${v.toLocaleString()}</strong> is closest to <strong>10<sup>${oom}</sup> = ${tenPow.toLocaleString()}</strong>.<br>` +
    `Its order of magnitude is <strong>${oom}</strong>.`;
}

function calcScore() {
  const guess = parseGuess(document.getElementById('score-guess').value);
  const real  = parseGuess(document.getElementById('score-real').value);
  const out = document.getElementById('score-calc-result');
  if (!isFinite(guess) || guess <= 0 || !isFinite(real) || real <= 0) {
    out.innerHTML = '<span style="color:#c62828">Enter two positive numbers.</span>';
    return;
  }
  const r = scoreGuess(guess, real);
  const ratio = (Math.max(guess, real) / Math.min(guess, real)).toFixed(2);
  out.innerHTML =
    `Your guess <strong>${guess.toLocaleString()}</strong> vs. answer <strong>${real.toLocaleString()}</strong><br>` +
    `Ratio: <strong>${ratio}×</strong> &nbsp; → &nbsp; ${r.label} &nbsp; <strong>(${r.points} pts)</strong>`;
}

// ============================================================
// STAGE 3 & 4: Warm-up + Classic problems
// ============================================================
function renderEstimateProblems(containerId, problems, includeHint) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  problems.forEach((prob, idx) => {
    const id = `${containerId}-${idx}`;
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.id = `card-${id}`;
    card.innerHTML = `
      <div class="problem-number">Problem ${idx + 1}</div>
      <div class="problem-text">${prob.q}</div>
      <div class="problem-row">
        <input type="text" class="guess-input" id="g-${id}" placeholder="Your guess..."
          onkeydown="if(event.key==='Enter') revealEstimate('${id}', ${JSON.stringify(containerId)}, ${idx})">
        <button class="btn-reveal" onclick="revealEstimate('${id}', '${containerId}', ${idx})">🎲 Reveal Answer</button>
        ${includeHint && prob.hint ? `<button class="btn-hint-toggle" onclick="toggleHint('${id}', '${containerId}', ${idx})">💡 Hint</button>` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

function toggleHint(id, source, idx) {
  const card = document.getElementById(`card-${id}`);
  let block = card.querySelector('.hint-block');
  if (block) { block.remove(); return; }
  const problems = source === 'classic-problems' ? CLASSIC_PROBLEMS : WARMUP_PROBLEMS;
  block = document.createElement('div');
  block.className = 'hint-block';
  block.innerHTML = `💡 <strong>Hint:</strong> ${problems[idx].hint}`;
  card.appendChild(block);
}

function revealEstimate(id, source, idx) {
  const card = document.getElementById(`card-${id}`);
  const input = document.getElementById(`g-${id}`);
  if (card.classList.contains('scored')) return;

  const problems = source === 'classic-problems' ? CLASSIC_PROBLEMS : WARMUP_PROBLEMS;
  const prob = problems[idx];
  const guessRaw = input.value.trim();
  const guess = parseGuess(guessRaw);

  const block = document.createElement('div');
  if (!isFinite(guess) || guess <= 0) {
    block.className = 'reveal-block ok';
    block.innerHTML = `
      <div>You didn't enter a guess this time — that's okay!</div>
      <div class="reveal-answer">Answer: ${prob.answerLabel}</div>
      <div class="reveal-explanation">${prob.breakdown}</div>
    `;
  } else {
    const r = scoreGuess(guess, prob.answer);
    practiceScore.total += 10;
    practiceScore.correct += r.points;
    savePracticeScore();
    block.className = 'reveal-block ' + r.tier;
    const ratio = (Math.max(guess, prob.answer) / Math.min(guess, prob.answer)).toFixed(2);
    block.innerHTML = `
      <div>You guessed <strong>${guess.toLocaleString()}</strong></div>
      <div class="reveal-answer">Real answer: ${prob.answerLabel}</div>
      <div class="reveal-points">${r.label} — <strong>${r.points} / 10 points</strong> (off by ${ratio}×)</div>
      <div class="reveal-explanation">${prob.breakdown}</div>
    `;
  }
  card.appendChild(block);
  card.classList.add('scored');
  input.disabled = true;
  card.querySelector('.btn-reveal').disabled = true;
}

// ============================================================
// STAGE 5: ESTIMATHON GAME
// ============================================================
let game = null; // { p1, p2, p1Score, p2Score, rounds, currentRound, questions, p1Guess, p2Guess, history, phase }

function startGame() {
  const p1 = (document.getElementById('p1-name').value.trim() || 'Player 1');
  const p2 = (document.getElementById('p2-name').value.trim() || 'Player 2');
  const rounds = parseInt(document.getElementById('game-rounds').value);

  // pick `rounds` random questions (no repeats)
  const pool = [...GAME_QUESTIONS];
  const questions = [];
  for (let i = 0; i < rounds && pool.length > 0; i++) {
    const idx = Math.floor(Math.random() * pool.length);
    questions.push(pool.splice(idx, 1)[0]);
  }

  game = {
    p1, p2,
    p1Score: 0, p2Score: 0,
    rounds, currentRound: 0,
    questions,
    p1Guess: null, p2Guess: null,
    history: [],
    phase: 'p1'
  };

  document.getElementById('game-setup').classList.add('hidden');
  document.getElementById('game-final').classList.add('hidden');
  document.getElementById('game-active').classList.remove('hidden');
  document.getElementById('p1-display').textContent = p1;
  document.getElementById('p2-display').textContent = p2;
  document.getElementById('phase-p1-label').innerHTML = `📝 <strong>${p1}</strong>, enter your guess (${p2}, look away!):`;
  document.getElementById('phase-p2-label').innerHTML = `📝 <strong>${p2}</strong>, your turn! Enter your guess:`;

  loadRound();
}

function loadRound() {
  const q = game.questions[game.currentRound];
  document.getElementById('game-question-text').textContent = q.q;
  document.getElementById('round-num').textContent = `${game.currentRound + 1} / ${game.rounds}`;
  document.getElementById('p1-pts').textContent = game.p1Score;
  document.getElementById('p2-pts').textContent = game.p2Score;

  // Highlight leader
  const p1Box = document.getElementById('p1-score-box');
  const p2Box = document.getElementById('p2-score-box');
  p1Box.classList.toggle('leader', game.p1Score > game.p2Score);
  p2Box.classList.toggle('leader', game.p2Score > game.p1Score);

  // Reset phase visibility
  document.getElementById('phase-p1').classList.remove('hidden');
  document.getElementById('phase-p2').classList.add('hidden');
  document.getElementById('phase-reveal').classList.add('hidden');
  document.getElementById('phase-result').classList.add('hidden');
  document.getElementById('p1-guess').value = '';
  document.getElementById('p2-guess').value = '';
  document.getElementById('p1-guess').focus();
  game.phase = 'p1';
  game.p1Guess = null;
  game.p2Guess = null;
}

function submitGuess(player) {
  const inputId = `p${player}-guess`;
  const input = document.getElementById(inputId);
  const raw = input.value.trim();
  const v = parseGuess(raw);
  if (!isFinite(v) || v <= 0) {
    input.style.borderColor = '#c62828';
    input.focus();
    return;
  }
  input.style.borderColor = '';

  if (player === 1) {
    game.p1Guess = v;
    game.phase = 'p2';
    document.getElementById('phase-p1').classList.add('hidden');
    document.getElementById('phase-p2').classList.remove('hidden');
    document.getElementById('p2-guess').focus();
  } else {
    game.p2Guess = v;
    game.phase = 'reveal';
    document.getElementById('phase-p2').classList.add('hidden');
    document.getElementById('phase-reveal').classList.remove('hidden');
  }
}

function revealRound() {
  const q = game.questions[game.currentRound];
  const r1 = scoreGuess(game.p1Guess, q.answer);
  const r2 = scoreGuess(game.p2Guess, q.answer);

  game.p1Score += r1.points;
  game.p2Score += r2.points;

  game.history.push({
    q: q.q,
    answer: q.label,
    p1Guess: game.p1Guess,
    p2Guess: game.p2Guess,
    p1Pts: r1.points,
    p2Pts: r2.points
  });

  document.getElementById('phase-reveal').classList.add('hidden');
  document.getElementById('phase-result').classList.remove('hidden');

  document.getElementById('answer-reveal').innerHTML =
    `🎉 The answer is: <span class="answer-num">${q.label}</span>`;

  const p1Won = r1.points > r2.points;
  const p2Won = r2.points > r1.points;
  document.getElementById('round-results').innerHTML = `
    <div class="player-result ${p1Won ? 'winner' : ''}">
      <div class="player-result-name">${game.p1} ${p1Won ? '🏅' : ''}</div>
      <div class="player-result-guess">${game.p1Guess.toLocaleString()}</div>
      <div class="player-result-pts">${r1.label} — +${r1.points} pts</div>
    </div>
    <div class="player-result ${p2Won ? 'winner' : ''}">
      <div class="player-result-name">${game.p2} ${p2Won ? '🏅' : ''}</div>
      <div class="player-result-guess">${game.p2Guess.toLocaleString()}</div>
      <div class="player-result-pts">${r2.label} — +${r2.points} pts</div>
    </div>
  `;

  // Update scoreboard live
  document.getElementById('p1-pts').textContent = game.p1Score;
  document.getElementById('p2-pts').textContent = game.p2Score;

  // Last round?
  if (game.currentRound + 1 >= game.rounds) {
    document.getElementById('next-round-btn').textContent = '🏁 See Final Results';
  } else {
    document.getElementById('next-round-btn').textContent = '➡️ Next Round';
  }
}

function nextRound() {
  if (game.currentRound + 1 >= game.rounds) {
    finishGame();
  } else {
    game.currentRound++;
    loadRound();
  }
}

function finishGame() {
  document.getElementById('game-active').classList.add('hidden');
  document.getElementById('game-final').classList.remove('hidden');

  const p1Won = game.p1Score > game.p2Score;
  const p2Won = game.p2Score > game.p1Score;
  const tied = game.p1Score === game.p2Score;

  let banner;
  if (tied) banner = `🤝 It's a tie at ${game.p1Score} points!`;
  else if (p1Won) banner = `🏆 ${game.p1} wins!`;
  else banner = `🏆 ${game.p2} wins!`;
  document.getElementById('winner-banner').textContent = banner;

  document.getElementById('final-scores').innerHTML = `
    <div class="final-score-card ${p1Won ? 'winner' : ''}">
      <div class="fs-name">${game.p1}</div>
      <div class="fs-pts">${game.p1Score}</div>
    </div>
    <div class="final-score-card ${p2Won ? 'winner' : ''}">
      <div class="fs-name">${game.p2}</div>
      <div class="fs-pts">${game.p2Score}</div>
    </div>
  `;

  let recap = '<h4 style="margin-bottom:8px;color:#bf360c">📜 Round-by-round recap</h4>';
  game.history.forEach((h, i) => {
    recap += `
      <div class="recap-row">
        <span class="recap-q">${i+1}.</span>
        <span>${h.q}</span>
        <span class="recap-ans">${h.answer}</span>
        <span>${game.p1}: ${h.p1Guess.toLocaleString()} (+${h.p1Pts}) vs ${game.p2}: ${h.p2Guess.toLocaleString()} (+${h.p2Pts})</span>
      </div>
    `;
  });
  document.getElementById('final-recap').innerHTML = recap;
}

function resetGame() {
  document.getElementById('game-setup').classList.remove('hidden');
  document.getElementById('game-active').classList.add('hidden');
  document.getElementById('game-final').classList.add('hidden');
  game = null;
}

function quitGame() {
  if (confirm('Quit the current match? All progress will be lost.')) {
    resetGame();
  }
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadPracticeScore();
  renderMCProblems('practice-1', FERMI_THINKING);
  renderMCProblems('practice-2', OOM_PROBLEMS);
  renderEstimateProblems('warmup-problems', WARMUP_PROBLEMS, false);
  renderEstimateProblems('classic-problems', CLASSIC_PROBLEMS, true);
  showStage(1);
}

init();
