// ============================================================
// Randomness Lab — script.js
// ============================================================

let currentStage = 1;
let practiceScore = { correct: 0, total: 0 };

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

  // Lazy redraws when entering a stage
  if (stage === 4) redrawNormal();
  if (stage === 5) drawGaltonBoard();
}

// ============================================================
// PRACTICE SCORE
// ============================================================
function loadPracticeScore() {
  const saved = localStorage.getItem('rand-score');
  if (saved) { try { practiceScore = JSON.parse(saved); } catch (e) {} }
  updateScoreDisplay();
}
function savePracticeScore() {
  localStorage.setItem('rand-score', JSON.stringify(practiceScore));
  updateScoreDisplay();
}
function updateScoreDisplay() {
  document.getElementById('score-display').textContent =
    `Practice score: ${practiceScore.correct} / ${practiceScore.total}`;
}
function resetPracticeScore() {
  practiceScore = { correct: 0, total: 0 };
  savePracticeScore();
  document.querySelectorAll('.mc-option').forEach(o => {
    o.classList.remove('correct', 'incorrect');
    o.style.pointerEvents = '';
  });
  document.querySelectorAll('.mc-feedback').forEach(f => {
    f.textContent = '';
    f.dataset.answered = '';
  });
}

// ============================================================
// STAGE 1: COIN FLIPS
// ============================================================
let heads = 0, tails = 0;
const COIN_FACES = ['H', 'T'];

function flipOne() {
  const result = Math.random() < 0.5 ? 'H' : 'T';
  if (result === 'H') heads++; else tails++;
  const coin = document.getElementById('coin');
  coin.classList.remove('flipping');
  void coin.offsetWidth; // restart animation
  coin.classList.add('flipping');
  coin.textContent = result === 'H' ? 'H' : 'T';
  updateFlipStats();
}

function flipMany(n) {
  let h = 0;
  for (let i = 0; i < n; i++) if (Math.random() < 0.5) h++;
  heads += h;
  tails += (n - h);
  document.getElementById('coin').textContent = (n > 1) ? '🪙' : (Math.random() < 0.5 ? 'H' : 'T');
  updateFlipStats();
}

function resetFlips() {
  heads = 0; tails = 0;
  document.getElementById('coin').textContent = '?';
  updateFlipStats();
}

function updateFlipStats() {
  const total = heads + tails;
  document.getElementById('heads-count').textContent = heads;
  document.getElementById('tails-count').textContent = tails;
  document.getElementById('flip-total').textContent = total;
  const pct = total === 0 ? '—' : ((heads / total) * 100).toFixed(1) + '%';
  document.getElementById('heads-pct').textContent = pct;

  // Bars: width = fraction
  if (total > 0) {
    const hPct = (heads / total) * 100;
    const tPct = (tails / total) * 100;
    document.getElementById('heads-bar').style.width = hPct + '%';
    document.getElementById('heads-bar').textContent = hPct.toFixed(1) + '%';
    document.getElementById('tails-bar').style.width = tPct + '%';
    document.getElementById('tails-bar').textContent = tPct.toFixed(1) + '%';
  } else {
    document.getElementById('heads-bar').style.width = '0';
    document.getElementById('heads-bar').textContent = '';
    document.getElementById('tails-bar').style.width = '0';
    document.getElementById('tails-bar').textContent = '';
  }
}

document.getElementById('coin').addEventListener('click', flipOne);

// ============================================================
// STAGE 2: SINGLE DIE
// ============================================================
let diceRolls = 0;
let diceCounts = [0, 0, 0, 0, 0, 0]; // index = face - 1
let diceSum = 0;
const DIE_FACES = ['⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

function rollDie(n) {
  let lastFace = 0;
  for (let i = 0; i < n; i++) {
    const f = Math.floor(Math.random() * 6) + 1;
    diceCounts[f - 1]++;
    diceSum += f;
    diceRolls++;
    lastFace = f;
  }
  const die = document.getElementById('big-die');
  die.classList.remove('rolling');
  void die.offsetWidth;
  die.classList.add('rolling');
  die.textContent = DIE_FACES[lastFace - 1];
  updateDiceStats();
  drawDiceHistogram();
}

function resetDice() {
  diceRolls = 0;
  diceSum = 0;
  diceCounts = [0, 0, 0, 0, 0, 0];
  document.getElementById('big-die').textContent = '?';
  updateDiceStats();
  drawDiceHistogram();
}

function updateDiceStats() {
  document.getElementById('dice-rolls').textContent = diceRolls;
  document.getElementById('dice-avg').textContent =
    diceRolls === 0 ? '—' : (diceSum / diceRolls).toFixed(3);
}

function drawDiceHistogram() {
  const canvas = document.getElementById('dice-histogram');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const padding = 30;
  const barW = (w - 2 * padding) / 6 - 8;
  const maxCount = Math.max(1, ...diceCounts);
  const expected = diceRolls / 6;

  for (let i = 0; i < 6; i++) {
    const x = padding + i * ((w - 2 * padding) / 6) + 4;
    const barH = (diceCounts[i] / maxCount) * (h - 50);
    const y = h - 30 - barH;

    // bar
    const grad = ctx.createLinearGradient(0, y, 0, h - 30);
    grad.addColorStop(0, '#7e57c2');
    grad.addColorStop(1, '#5e35b1');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);

    // count text
    ctx.fillStyle = '#311b92';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    if (diceCounts[i] > 0) ctx.fillText(diceCounts[i], x + barW / 2, y - 4);

    // face label
    ctx.font = '20px Arial';
    ctx.fillStyle = '#333';
    ctx.fillText(DIE_FACES[i], x + barW / 2, h - 8);
  }

  // expected line
  if (diceRolls > 0) {
    const expY = h - 30 - (expected / maxCount) * (h - 50);
    ctx.strokeStyle = '#e53935';
    ctx.setLineDash([6, 4]);
    ctx.beginPath();
    ctx.moveTo(padding, expY);
    ctx.lineTo(w - padding, expY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#e53935';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`expected: ${expected.toFixed(0)}`, padding + 4, expY - 4);
  }
}

// ============================================================
// STAGE 3: SUM OF TWO DICE
// ============================================================
let sumCounts = new Array(11).fill(0); // sums 2..12

function rollSum(n) {
  for (let i = 0; i < n; i++) {
    const a = Math.floor(Math.random() * 6) + 1;
    const b = Math.floor(Math.random() * 6) + 1;
    sumCounts[a + b - 2]++;
  }
  drawSumHistogram();
}
function resetSum() {
  sumCounts = new Array(11).fill(0);
  drawSumHistogram();
}
function drawSumHistogram() {
  const canvas = document.getElementById('sum-histogram');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const padding = 30;
  const total = sumCounts.reduce((a, b) => a + b, 0);
  const maxCount = Math.max(1, ...sumCounts);
  const slot = (w - 2 * padding) / 11;
  const barW = slot - 6;

  // theoretical triangle
  const theoretical = [1,2,3,4,5,6,5,4,3,2,1].map(n => (n / 36) * total);

  for (let i = 0; i < 11; i++) {
    const x = padding + i * slot + 3;
    const barH = (sumCounts[i] / maxCount) * (h - 60);
    const y = h - 40 - barH;
    const grad = ctx.createLinearGradient(0, y, 0, h - 40);
    grad.addColorStop(0, '#42a5f5');
    grad.addColorStop(1, '#1565c0');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);

    // theoretical line marker
    if (total > 0) {
      const tY = h - 40 - (theoretical[i] / maxCount) * (h - 60);
      ctx.fillStyle = '#e53935';
      ctx.fillRect(x, tY - 2, barW, 3);
    }

    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(i + 2, x + barW / 2, h - 18);
    if (sumCounts[i] > 0) {
      ctx.fillStyle = '#311b92';
      ctx.font = 'bold 10px Arial';
      ctx.fillText(sumCounts[i], x + barW / 2, y - 3);
    }
  }
  // legend
  ctx.fillStyle = '#e53935';
  ctx.font = 'bold 11px Arial';
  ctx.textAlign = 'left';
  ctx.fillText('— red marks: theoretical 1/2/3/4/5/6/5/4/3/2/1 out of 36', padding, 14);
}

// ============================================================
// STAGE 3: MANY DICE → CLT
// ============================================================
let manyDiceCounts = {}; // sum -> count
let manyDiceN = 5;

function updateDiceLabel() {
  document.getElementById('num-dice-label').textContent =
    document.getElementById('num-dice').value;
}

function rollManyDice(rolls) {
  const n = parseInt(document.getElementById('num-dice').value);
  if (n !== manyDiceN) {
    manyDiceCounts = {};
    manyDiceN = n;
  }
  for (let i = 0; i < rolls; i++) {
    let s = 0;
    for (let j = 0; j < n; j++) s += Math.floor(Math.random() * 6) + 1;
    manyDiceCounts[s] = (manyDiceCounts[s] || 0) + 1;
  }
  drawManyDice();
}

function resetManyDice() {
  manyDiceCounts = {};
  drawManyDice();
}

function drawManyDice() {
  const canvas = document.getElementById('many-dice-histogram');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const n = manyDiceN;
  const minSum = n;
  const maxSum = 6 * n;
  const range = maxSum - minSum + 1;

  const padding = 30;
  const slot = (w - 2 * padding) / range;
  const barW = Math.max(1, slot - 1);
  const counts = [];
  for (let s = minSum; s <= maxSum; s++) counts.push(manyDiceCounts[s] || 0);
  const maxCount = Math.max(1, ...counts);
  const total = counts.reduce((a, b) => a + b, 0);

  for (let i = 0; i < range; i++) {
    const x = padding + i * slot;
    const barH = (counts[i] / maxCount) * (h - 50);
    const y = h - 30 - barH;
    const grad = ctx.createLinearGradient(0, y, 0, h - 30);
    grad.addColorStop(0, '#26c6da');
    grad.addColorStop(1, '#00838f');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);
  }

  // overlay theoretical Gaussian curve
  if (total > 0) {
    const mean = (n * 3.5);
    const variance = n * 35 / 12; // var of single die = 35/12
    const sd = Math.sqrt(variance);
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let firstPoint = true;
    for (let i = 0; i < range; i++) {
      const s = minSum + i;
      const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-((s - mean) ** 2) / (2 * variance));
      const expectedCount = pdf * total; // since sum width = 1
      const y = h - 30 - (expectedCount / maxCount) * (h - 50);
      const x = padding + i * slot + barW / 2;
      if (firstPoint) { ctx.moveTo(x, y); firstPoint = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // x-axis labels (sparse)
  ctx.fillStyle = '#666';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  const tickEvery = Math.max(1, Math.floor(range / 8));
  for (let i = 0; i < range; i += tickEvery) {
    ctx.fillText(minSum + i, padding + i * slot + barW / 2, h - 14);
  }

  // title
  ctx.fillStyle = '#333';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`Sum of ${n} dice (${total} rolls). Red = theoretical Gaussian.`, padding, 16);
}

// ============================================================
// STAGE 4: GAUSSIAN VISUALIZER
// ============================================================
function redrawNormal() {
  const mu = parseFloat(document.getElementById('mean-slider').value);
  const sd = parseFloat(document.getElementById('sd-slider').value);
  document.getElementById('mean-label').textContent = mu.toFixed(1);
  document.getElementById('sd-label').textContent = sd.toFixed(1);

  // main slider canvas
  const canvas = document.getElementById('normal-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  // axis range fixed
  const xMin = -10, xMax = 10;
  const xPx = x => ((x - xMin) / (xMax - xMin)) * w;
  const peakPdf = 1 / (sd * Math.sqrt(2 * Math.PI));
  const yScale = (h - 50) / Math.max(peakPdf, 0.5);
  const yPx = y => h - 30 - y * yScale;

  // grid + axis
  ctx.strokeStyle = '#eee';
  ctx.lineWidth = 1;
  for (let x = xMin; x <= xMax; x += 1) {
    ctx.beginPath();
    ctx.moveTo(xPx(x), 10);
    ctx.lineTo(xPx(x), h - 30);
    ctx.stroke();
  }
  ctx.strokeStyle = '#999';
  ctx.beginPath();
  ctx.moveTo(0, h - 30);
  ctx.lineTo(w, h - 30);
  ctx.stroke();

  // shade ±1, ±2, ±3 sigma bands
  const bands = [
    { range: 3, color: 'rgba(149,117,205,0.15)' },
    { range: 2, color: 'rgba(149,117,205,0.25)' },
    { range: 1, color: 'rgba(149,117,205,0.40)' },
  ];
  bands.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(xPx(mu - b.range * sd), h - 30);
    for (let px = xPx(mu - b.range * sd); px <= xPx(mu + b.range * sd); px += 2) {
      const x = xMin + (px / w) * (xMax - xMin);
      const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
      ctx.lineTo(px, yPx(pdf));
    }
    ctx.lineTo(xPx(mu + b.range * sd), h - 30);
    ctx.closePath();
    ctx.fill();
  });

  // curve
  ctx.strokeStyle = '#5e35b1';
  ctx.lineWidth = 3;
  ctx.beginPath();
  for (let px = 0; px <= w; px += 1) {
    const x = xMin + (px / w) * (xMax - xMin);
    const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
    if (px === 0) ctx.moveTo(px, yPx(pdf));
    else ctx.lineTo(px, yPx(pdf));
  }
  ctx.stroke();

  // mean line
  ctx.strokeStyle = '#e53935';
  ctx.setLineDash([4, 4]);
  ctx.beginPath();
  ctx.moveTo(xPx(mu), 10);
  ctx.lineTo(xPx(mu), h - 30);
  ctx.stroke();
  ctx.setLineDash([]);

  // x-axis ticks
  ctx.fillStyle = '#555';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  for (let x = xMin; x <= xMax; x += 2) {
    ctx.fillText(x, xPx(x), h - 14);
  }

  // labels
  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`μ = ${mu.toFixed(1)}, σ = ${sd.toFixed(1)}`, 14, 20);

  // also redraw rule canvas
  drawRuleCanvas();
}

function drawRuleCanvas() {
  const canvas = document.getElementById('rule-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const xMin = -4, xMax = 4;
  const mu = 0, sd = 1;
  const xPx = x => ((x - xMin) / (xMax - xMin)) * w;
  const peakPdf = 1 / (sd * Math.sqrt(2 * Math.PI));
  const yScale = (h - 60) / peakPdf;
  const yPx = y => h - 40 - y * yScale;

  // bands
  const bands = [
    { r: 3, color: '#e1bee7', label: '99.7%' },
    { r: 2, color: '#ce93d8', label: '95%' },
    { r: 1, color: '#ab47bc', label: '68%' },
  ];
  bands.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(xPx(-b.r), h - 40);
    for (let px = xPx(-b.r); px <= xPx(b.r); px += 1) {
      const x = xMin + (px / w) * (xMax - xMin);
      const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-x * x / 2);
      ctx.lineTo(px, yPx(pdf));
    }
    ctx.lineTo(xPx(b.r), h - 40);
    ctx.closePath();
    ctx.fill();
  });

  // curve
  ctx.strokeStyle = '#311b92';
  ctx.lineWidth = 2;
  ctx.beginPath();
  for (let px = 0; px <= w; px += 1) {
    const x = xMin + (px / w) * (xMax - xMin);
    const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-x * x / 2);
    if (px === 0) ctx.moveTo(px, yPx(pdf));
    else ctx.lineTo(px, yPx(pdf));
  }
  ctx.stroke();

  // sigma labels at ±1,2,3
  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'center';
  ['-3σ','-2σ','-1σ','μ','+1σ','+2σ','+3σ'].forEach((lbl, i) => {
    const x = i - 3;
    ctx.fillText(lbl, xPx(x), h - 18);
  });

  // band labels
  ctx.fillStyle = 'white';
  ctx.font = 'bold 13px Arial';
  ctx.fillText('68%', xPx(0), yPx(0.2));
  ctx.fillStyle = '#4a148c';
  ctx.fillText('95%', xPx(1.5), yPx(0.05));
  ctx.fillText('99.7%', xPx(2.5), yPx(0.02));
}

// ============================================================
// STAGE 4: PRACTICE
// ============================================================
const NORMAL_PROBLEMS = [
  {
    q: 'Adult heights have μ ≈ 5\'7" and σ ≈ 3". About what % of adults are between 5\'4" and 5\'10"?',
    options: [
      { v: 'A', t: '~50%' },
      { v: 'B', t: '~68%' },
      { v: 'C', t: '~95%' },
      { v: 'D', t: '~99%' },
    ],
    correct: 'B',
    explain: '5\'4" to 5\'10" is exactly μ ± 1σ. The 68-95-99.7 rule says about 68% fall in this range.'
  },
  {
    q: 'A test has mean 70 and std dev 10. About what % of students score between 50 and 90?',
    options: [
      { v: 'A', t: '~50%' },
      { v: 'B', t: '~68%' },
      { v: 'C', t: '~95%' },
      { v: 'D', t: '~99.7%' },
    ],
    correct: 'C',
    explain: '50 to 90 is μ ± 2σ (since σ=10). About 95% of values are within 2 standard deviations.'
  },
  {
    q: 'If you make σ smaller, the curve becomes...',
    options: [
      { v: 'A', t: 'Wider and shorter' },
      { v: 'B', t: 'Narrower and taller' },
      { v: 'C', t: 'Shifted to the right' },
      { v: 'D', t: 'Flat and rectangular' },
    ],
    correct: 'B',
    explain: 'σ controls spread. Smaller σ = values cluster tightly near the mean = narrow, tall peak.'
  },
  {
    q: 'Why does the bell curve appear so often in nature?',
    options: [
      { v: 'A', t: 'Because nature loves symmetry.' },
      { v: 'B', t: 'Because of the Central Limit Theorem: when many small random effects add up, the result tends to be Gaussian.' },
      { v: 'C', t: 'It\'s a coincidence.' },
    ],
    correct: 'B',
    explain: 'The Central Limit Theorem is the deep reason. Heights, errors, test scores — they\'re all sums of many small random factors.'
  },
];

// ============================================================
// STAGE 2: PRACTICE
// ============================================================
const RV_PROBLEMS = [
  {
    q: 'You roll a single 6-sided die. What is the expected value of the result?',
    options: [
      { v: 'A', t: '3' },
      { v: 'B', t: '3.5' },
      { v: 'C', t: '4' },
      { v: 'D', t: '6' },
    ],
    correct: 'B',
    explain: '(1+2+3+4+5+6)/6 = 21/6 = 3.5. Even though no face shows 3.5, that\'s the long-run average.'
  },
  {
    q: 'You flip a fair coin. Let X = 1 if heads, 0 if tails. What is E[X]?',
    options: [
      { v: 'A', t: '0' },
      { v: 'B', t: '0.5' },
      { v: 'C', t: '1' },
    ],
    correct: 'B',
    explain: 'Half the time you get 1, half the time you get 0, so the average is 0.5.'
  },
  {
    q: 'You roll a die 10 times and get all sixes (avg = 6). Should you bet your friend the next 10 will avg less than 3?',
    options: [
      { v: 'A', t: 'Yes — the die "owes" you low rolls now.' },
      { v: 'B', t: 'No — past rolls don\'t affect future ones. The die has no memory.' },
    ],
    correct: 'B',
    explain: 'This is the gambler\'s fallacy! Each roll is independent. The next 10 rolls still have expected average 3.5.'
  },
];

// ============================================================
// MULTIPLE CHOICE RENDERER (used in stages 2 + 4)
// ============================================================
function renderMC(containerId, problems) {
  const container = document.getElementById(containerId);
  if (!container) return;
  container.innerHTML = '';
  problems.forEach((prob, idx) => {
    const id = `${containerId}-${idx}`;
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.innerHTML = `
      <div class="problem-text">${prob.q}</div>
      <div class="mc-options" id="opts-${id}">
        ${prob.options.map(o => `<button class="mc-option" data-v="${o.v}">${o.v}) ${o.t}</button>`).join('')}
      </div>
      <div class="mc-feedback" id="fb-${id}"></div>
    `;
    container.appendChild(card);
    card.querySelectorAll('.mc-option').forEach(btn => {
      btn.addEventListener('click', () => answerMC(id, btn.dataset.v, prob));
    });
  });
}

function answerMC(id, choice, prob) {
  const fb = document.getElementById(`fb-${id}`);
  if (fb.dataset.answered) return;
  fb.dataset.answered = '1';
  const opts = document.querySelectorAll(`#opts-${id} .mc-option`);
  const correct = choice === prob.correct;
  practiceScore.total++;
  if (correct) practiceScore.correct++;
  savePracticeScore();
  opts.forEach(o => {
    o.style.pointerEvents = 'none';
    if (o.dataset.v === prob.correct) o.classList.add('correct');
    else if (o.dataset.v === choice) o.classList.add('incorrect');
  });
  fb.innerHTML = (correct ? '✅ Correct! ' : `❌ Not quite. The answer is ${prob.correct}. `) +
    `<em>${prob.explain}</em>`;
  fb.className = 'mc-feedback ' + (correct ? 'correct' : 'incorrect');
}

// ============================================================
// STAGE 5: GALTON BOARD
// ============================================================
let galtonRows = 10;
let galtonBins = new Array(11).fill(0); // (rows + 1) bins
let galtonTotal = 0;
let galtonRecentPath = null; // for animating one ball

function updateGaltonRows() {
  galtonRows = parseInt(document.getElementById('galton-rows').value);
  document.getElementById('galton-rows-label').textContent = galtonRows;
  galtonBins = new Array(galtonRows + 1).fill(0);
  galtonTotal = 0;
  drawGaltonBoard();
  updateGaltonStats();
}

function dropGaltonBalls(n) {
  for (let i = 0; i < n; i++) {
    let bin = 0;
    for (let r = 0; r < galtonRows; r++) {
      if (Math.random() < 0.5) bin++;
    }
    galtonBins[bin]++;
    galtonTotal++;
    if (i === 0 && n === 1) {
      // record path of single ball for animation
      galtonRecentPath = simulatePath(bin);
    }
  }
  drawGaltonBoard();
  updateGaltonStats();
  if (n === 1) animateBall();
}

// generate a random path that lands in given bin
function simulatePath(bin) {
  // need exactly `bin` rights out of galtonRows, in some order
  const moves = [];
  let rights = bin, lefts = galtonRows - bin;
  for (let r = 0; r < galtonRows; r++) {
    const goRight = Math.random() < (rights / (rights + lefts));
    moves.push(goRight ? 1 : 0);
    if (goRight) rights--; else lefts--;
  }
  return moves;
}

function resetGalton() {
  galtonBins = new Array(galtonRows + 1).fill(0);
  galtonTotal = 0;
  galtonRecentPath = null;
  drawGaltonBoard();
  updateGaltonStats();
}

function updateGaltonStats() {
  document.getElementById('galton-total').textContent = galtonTotal;
  if (galtonTotal === 0) {
    document.getElementById('galton-mean').textContent = '—';
    return;
  }
  let sum = 0;
  for (let i = 0; i < galtonBins.length; i++) sum += i * galtonBins[i];
  document.getElementById('galton-mean').textContent = (sum / galtonTotal).toFixed(2);
}

function drawGaltonBoard(highlightPath) {
  const canvas = document.getElementById('galton-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const rows = galtonRows;
  const bins = rows + 1;
  const pegSpacing = Math.min((w - 80) / (bins + 1), 30);
  const rowSpacing = Math.min(22, (h - 200) / rows);
  const startX = w / 2;
  const startY = 30;

  // draw pegs
  ctx.fillStyle = '#7e57c2';
  const pegPositions = [];
  for (let r = 0; r < rows; r++) {
    const rowY = startY + r * rowSpacing;
    for (let c = 0; c <= r; c++) {
      const pegX = startX + (c - r / 2) * pegSpacing;
      pegPositions.push({ x: pegX, y: rowY });
      ctx.beginPath();
      ctx.arc(pegX, rowY, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // draw path (animation)
  if (highlightPath) {
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let x = startX;
    let y = startY - 10;
    ctx.moveTo(x, y);
    let bin = 0;
    for (let r = 0; r < rows; r++) {
      const rowY = startY + r * rowSpacing;
      // peg at column related to r/2 + bin offset
      const pegX = startX + (bin - r / 2) * pegSpacing;
      ctx.lineTo(pegX, rowY - 4);
      // bounce
      const goRight = highlightPath[r] === 1;
      if (goRight) bin++;
      const nextX = startX + (bin - (r+1) / 2) * pegSpacing;
      const nextY = rowY + rowSpacing - 4;
      ctx.lineTo(nextX - (goRight ? -4 : 4), rowY + 4);
      ctx.lineTo(nextX, nextY);
    }
    ctx.stroke();

    // ball at end
    ctx.fillStyle = '#ff9800';
    const finalX = startX + (bin - rows / 2) * pegSpacing;
    const finalY = startY + rows * rowSpacing;
    ctx.beginPath();
    ctx.arc(finalX, finalY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  // draw bins
  const binsTop = startY + rows * rowSpacing + 10;
  const binsBottom = h - 30;
  const binsHeight = binsBottom - binsTop;
  const maxCount = Math.max(1, ...galtonBins);

  for (let i = 0; i < bins; i++) {
    const binX = startX + (i - rows / 2) * pegSpacing - pegSpacing / 2;
    const binW = pegSpacing - 2;
    const fillH = (galtonBins[i] / maxCount) * binsHeight;
    const fillY = binsBottom - fillH;

    // bin outline
    ctx.strokeStyle = '#bdbdbd';
    ctx.lineWidth = 1;
    ctx.strokeRect(binX, binsTop, binW, binsHeight);

    // ball stack
    const grad = ctx.createLinearGradient(0, fillY, 0, binsBottom);
    grad.addColorStop(0, '#7e57c2');
    grad.addColorStop(1, '#311b92');
    ctx.fillStyle = grad;
    ctx.fillRect(binX + 1, fillY, binW - 2, fillH);

    // count label
    if (galtonBins[i] > 0) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(galtonBins[i], binX + binW / 2, fillY + 12);
    }
  }

  // overlay theoretical bell curve
  if (galtonTotal > 0) {
    const mean = rows / 2;
    const variance = rows / 4;
    const sd = Math.sqrt(variance);
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2;
    ctx.beginPath();
    let first = true;
    for (let i = 0; i <= bins - 1; i += 0.1) {
      const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-((i - mean) ** 2) / (2 * variance));
      const expected = pdf * galtonTotal;
      const x = startX + (i - rows / 2) * pegSpacing;
      const y = binsBottom - (expected / maxCount) * binsHeight;
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // title
  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`${galtonTotal} balls dropped through ${rows} rows`, 20, 18);
}

// simple animation: draw the path stepwise
function animateBall() {
  if (!galtonRecentPath) return;
  let step = 0;
  const total = galtonRecentPath.length;
  const tick = () => {
    if (step > total) return;
    drawGaltonBoard(galtonRecentPath.slice(0, step));
    step++;
    if (step <= total) setTimeout(tick, 80);
  };
  tick();
}

// ============================================================
// STAGE 6: SPOT THE FAKE GAME
// ============================================================
let randGame = null;

// Generate a real random sequence — re-roll until it has at least one run of 4+
// (statistically very likely with 30 flips, this just guarantees the lesson works)
function realRandom(n) {
  for (let attempt = 0; attempt < 50; attempt++) {
    let s = '';
    for (let i = 0; i < n; i++) s += Math.random() < 0.5 ? 'H' : 'T';
    if (longestRun(s) >= 4) return s;
  }
  // fallback (shouldn't happen)
  let s = '';
  for (let i = 0; i < n; i++) s += Math.random() < 0.5 ? 'H' : 'T';
  return s;
}

// Generate a "fake human-style random" sequence: avoids long streaks
function fakeRandom(n) {
  const s = [];
  let runChar = null;
  let runLen = 0;
  // Cap runs at 2 — humans pretending to be random almost never write more
  const maxRun = 2;
  for (let i = 0; i < n; i++) {
    let pick;
    if (runChar !== null && runLen >= maxRun) {
      // forbid extending the run
      pick = runChar === 'H' ? 'T' : 'H';
    } else {
      // slight bias toward switching (humans alternate too much)
      const switchProb = 0.62;
      if (runChar === null) pick = Math.random() < 0.5 ? 'H' : 'T';
      else if (Math.random() < switchProb) pick = (runChar === 'H' ? 'T' : 'H');
      else pick = runChar;
    }
    if (pick === runChar) runLen++;
    else { runChar = pick; runLen = 1; }
    s.push(pick);
  }
  return s.join('');
}

function longestRun(s) {
  let max = 1, cur = 1;
  for (let i = 1; i < s.length; i++) {
    if (s[i] === s[i-1]) { cur++; if (cur > max) max = cur; }
    else cur = 1;
  }
  return max;
}

function startRandomGame() {
  const p1 = (document.getElementById('rand-p1').value.trim() || 'Player 1');
  const p2 = (document.getElementById('rand-p2').value.trim() || 'Player 2');
  const mode = document.getElementById('rand-mode').value;
  const rounds = parseInt(document.getElementById('rand-rounds').value);

  randGame = {
    p1, p2, mode, rounds,
    currentRound: 0,
    p1Score: 0, p2Score: 0,
    turn: 1, // whose pick is being collected
    realSeq: '', fakeSeq: '', realIs: '',
    p1Choice: null, p2Choice: null,
  };

  document.getElementById('game-setup-card').classList.add('hidden');
  document.getElementById('game-final-card').classList.add('hidden');
  document.getElementById('game-active-card').classList.remove('hidden');

  document.getElementById('rand-p1-display').textContent = p1;
  document.getElementById('rand-p2-display').textContent = p2;

  // hide P2 box in solo mode
  document.getElementById('rand-p2-box').style.display = mode === 'solo' ? 'none' : '';
  document.getElementById('rand-scoreboard').style.gridTemplateColumns =
    mode === 'solo' ? '1fr auto' : '1fr auto 1fr';

  loadRandRound();
}

function loadRandRound() {
  const seqLen = 30;
  const real = realRandom(seqLen);
  const fake = fakeRandom(seqLen);
  // randomize which side is real
  const realOnLeft = Math.random() < 0.5;
  randGame.realIs = realOnLeft ? 'A' : 'B';
  randGame.seqA = realOnLeft ? real : fake;
  randGame.seqB = realOnLeft ? fake : real;
  randGame.p1Choice = null;
  randGame.p2Choice = null;
  randGame.turn = 1;

  document.getElementById('seq-A-content').textContent = formatSeq(randGame.seqA);
  document.getElementById('seq-B-content').textContent = formatSeq(randGame.seqB);
  document.getElementById('seq-A').className = 'seq-btn';
  document.getElementById('seq-B').className = 'seq-btn';
  document.getElementById('seq-A').disabled = false;
  document.getElementById('seq-B').disabled = false;

  document.getElementById('rand-round-num').textContent =
    `${randGame.currentRound + 1} / ${randGame.rounds}`;
  document.getElementById('rand-p1-pts').textContent = randGame.p1Score;
  document.getElementById('rand-p2-pts').textContent = randGame.p2Score;
  document.getElementById('rand-reveal').classList.add('hidden');

  updateScoreboardHighlight();

  if (randGame.mode === 'solo') {
    document.getElementById('rand-turn-info').textContent = 'Pick the REAL random sequence!';
  } else {
    document.getElementById('rand-turn-info').innerHTML =
      `<strong>${randGame.p1}</strong>'s turn — pick the REAL sequence (no peeking, ${randGame.p2}!)`;
  }
}

function formatSeq(s) {
  // group in 5s
  return s.match(/.{1,5}/g).join(' ');
}

function updateScoreboardHighlight() {
  const p1Box = document.getElementById('rand-p1-box');
  const p2Box = document.getElementById('rand-p2-box');
  p1Box.classList.remove('leader', 'active-turn');
  p2Box.classList.remove('leader', 'active-turn');
  if (randGame.mode === 'vs') {
    if (randGame.turn === 1) p1Box.classList.add('active-turn');
    else p2Box.classList.add('active-turn');
  }
  if (randGame.p1Score > randGame.p2Score) p1Box.classList.add('leader');
  else if (randGame.p2Score > randGame.p1Score) p2Box.classList.add('leader');
}

function pickSequence(letter) {
  if (randGame.mode === 'solo') {
    randGame.p1Choice = letter;
    finishRound();
    return;
  }
  if (randGame.turn === 1) {
    randGame.p1Choice = letter;
    randGame.turn = 2;
    document.getElementById('rand-turn-info').innerHTML =
      `<strong>${randGame.p2}</strong>'s turn — pick the REAL sequence!`;
    updateScoreboardHighlight();
    // hide highlight of p1's choice (so p2 doesn't see it)
  } else {
    randGame.p2Choice = letter;
    finishRound();
  }
}

function finishRound() {
  document.getElementById('seq-A').disabled = true;
  document.getElementById('seq-B').disabled = true;

  const realIs = randGame.realIs;
  const fakeIs = realIs === 'A' ? 'B' : 'A';
  document.getElementById(`seq-${realIs}`).classList.add('correct');
  document.getElementById(`seq-${fakeIs}`).classList.add('incorrect');

  const p1Right = randGame.p1Choice === realIs;
  const p2Right = randGame.mode === 'vs' && randGame.p2Choice === realIs;

  if (p1Right) randGame.p1Score++;
  if (p2Right) randGame.p2Score++;

  const realSeq = realIs === 'A' ? randGame.seqA : randGame.seqB;
  const fakeSeq = fakeIs === 'A' ? randGame.seqA : randGame.seqB;

  let txt = `<strong>Sequence ${realIs}</strong> was the REAL one!<br>`;
  txt += `Longest run in REAL: <strong>${longestRun(realSeq)}</strong> &nbsp;·&nbsp; longest run in FAKE: <strong>${longestRun(fakeSeq)}</strong><br>`;
  txt += `<em>Real randomness usually has runs of 4 or more. Humans rarely write that.</em><br><br>`;

  if (randGame.mode === 'solo') {
    txt += p1Right ? `🎯 <strong>${randGame.p1}</strong> got it right! +1 point.` : `❌ <strong>${randGame.p1}</strong> missed.`;
  } else {
    txt += `<strong>${randGame.p1}</strong> picked ${randGame.p1Choice} — ${p1Right ? '✅ +1' : '❌ +0'}<br>`;
    txt += `<strong>${randGame.p2}</strong> picked ${randGame.p2Choice} — ${p2Right ? '✅ +1' : '❌ +0'}`;
  }

  document.getElementById('rand-reveal-text').innerHTML = txt;
  document.getElementById('rand-reveal').classList.remove('hidden');

  document.getElementById('rand-p1-pts').textContent = randGame.p1Score;
  document.getElementById('rand-p2-pts').textContent = randGame.p2Score;
  updateScoreboardHighlight();

  if (randGame.currentRound + 1 >= randGame.rounds) {
    document.getElementById('next-rand-btn').textContent = '🏁 See Final Result';
  } else {
    document.getElementById('next-rand-btn').textContent = '➡️ Next Round';
  }
}

function nextRandomRound() {
  if (randGame.currentRound + 1 >= randGame.rounds) {
    finishRandomGame();
  } else {
    randGame.currentRound++;
    loadRandRound();
  }
}

function finishRandomGame() {
  document.getElementById('game-active-card').classList.add('hidden');
  document.getElementById('game-final-card').classList.remove('hidden');

  let banner;
  if (randGame.mode === 'solo') {
    banner = `🎉 ${randGame.p1}: ${randGame.p1Score} / ${randGame.rounds}`;
  } else {
    if (randGame.p1Score > randGame.p2Score) banner = `🏆 ${randGame.p1} wins!`;
    else if (randGame.p2Score > randGame.p1Score) banner = `🏆 ${randGame.p2} wins!`;
    else banner = `🤝 Tie at ${randGame.p1Score}!`;
  }
  document.getElementById('rand-winner-banner').textContent = banner;

  let html = `
    <div class="final-score-card ${randGame.p1Score >= randGame.p2Score ? 'winner' : ''}">
      <div class="fs-name">${randGame.p1}</div>
      <div class="fs-pts">${randGame.p1Score}</div>
    </div>
  `;
  if (randGame.mode === 'vs') {
    html += `
      <div class="final-score-card ${randGame.p2Score >= randGame.p1Score ? 'winner' : ''}">
        <div class="fs-name">${randGame.p2}</div>
        <div class="fs-pts">${randGame.p2Score}</div>
      </div>
    `;
  }
  document.getElementById('rand-final-scores').innerHTML = html;
  document.getElementById('rand-final-scores').style.gridTemplateColumns =
    randGame.mode === 'solo' ? '1fr' : '1fr 1fr';
}

function resetRandomGame() {
  document.getElementById('game-setup-card').classList.remove('hidden');
  document.getElementById('game-active-card').classList.add('hidden');
  document.getElementById('game-final-card').classList.add('hidden');
  randGame = null;
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadPracticeScore();
  renderMC('practice-2', RV_PROBLEMS);
  renderMC('practice-4', NORMAL_PROBLEMS);
  updateFlipStats();
  drawDiceHistogram();
  drawSumHistogram();
  drawManyDice();
  redrawNormal();
  drawGaltonBoard();
  showStage(1);
}

init();
