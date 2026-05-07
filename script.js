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

  if (stage === 2) drawBellChart();
  if (stage === 3) { redrawNormal(); drawAllBoxes(); }
  if (stage === 4) drawGaltonBoard();
  if (stage === 5) { updateHash(); buildAvalancheList(); drawHashUniformity(); }
}

// ============================================================
// SCORE
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
}

// ============================================================
// STAGE 1: MYSTERY BOX
// ============================================================
let mysterySource = 'coin';
let mysteryStream = [];

function setSource(src) {
  mysterySource = src;
  mysteryStream = [];
  document.querySelectorAll('.box-option').forEach(b =>
    b.classList.toggle('active', b.dataset.source === src));
  document.getElementById('mystery-stream').innerHTML = '';
  document.getElementById('mb-output').textContent = '—';
}

function pressMystery() {
  let val;
  switch (mysterySource) {
    case 'coin': val = Math.random() < 0.5 ? 'H' : 'T'; break;
    case 'die':  val = Math.floor(Math.random() * 6) + 1; break;
    case 'd100': val = Math.floor(Math.random() * 100) + 1; break;
    case 'real': val = Math.random().toFixed(4); break;
    default:     val = '?';
  }
  const out = document.getElementById('mb-output');
  out.textContent = val;
  out.classList.remove('pop');
  void out.offsetWidth;
  out.classList.add('pop');

  mysteryStream.push(val);
  if (mysteryStream.length > 60) mysteryStream.shift();
  renderStream();
}

function renderStream() {
  const el = document.getElementById('mystery-stream');
  el.innerHTML = mysteryStream.map((v, i) => {
    const isLatest = i === mysteryStream.length - 1;
    return `<span class="stream-num${isLatest ? ' latest' : ''}">${v}</span>`;
  }).join('');
}

function resetMystery() {
  mysteryStream = [];
  document.getElementById('mb-output').textContent = '—';
  document.getElementById('mystery-stream').innerHTML = '';
}

// ============================================================
// STAGE 2: BUILD YOUR OWN BELL CURVE
// ============================================================
const BELL_DICE_COUNT = 5;
const BELL_MIN = BELL_DICE_COUNT;       // 5
const BELL_MAX = BELL_DICE_COUNT * 6;   // 30
const BELL_BINS = BELL_MAX - BELL_MIN + 1; // 26
let bellCounts = new Array(BELL_BINS).fill(0);
let bellTotal = 0;
let bellSum = 0;
let bellLastBin = -1;

function dropOneBell() {
  let s = 0;
  for (let i = 0; i < BELL_DICE_COUNT; i++) s += Math.floor(Math.random() * 6) + 1;
  const bin = s - BELL_MIN;
  bellCounts[bin]++;
  bellTotal++;
  bellSum += s;
  bellLastBin = bin;
  drawBellChart();
  updateBellStats();
}

function dropManyBells(n) {
  for (let i = 0; i < n; i++) {
    let s = 0;
    for (let j = 0; j < BELL_DICE_COUNT; j++) s += Math.floor(Math.random() * 6) + 1;
    const bin = s - BELL_MIN;
    bellCounts[bin]++;
    bellTotal++;
    bellSum += s;
    bellLastBin = bin;
  }
  drawBellChart();
  updateBellStats();
}

function resetBells() {
  bellCounts = new Array(BELL_BINS).fill(0);
  bellTotal = 0;
  bellSum = 0;
  bellLastBin = -1;
  drawBellChart();
  updateBellStats();
}

function updateBellStats() {
  document.getElementById('bell-total').textContent = bellTotal;
  document.getElementById('bell-mean').textContent =
    bellTotal === 0 ? '—' : (bellSum / bellTotal).toFixed(2);
}

function drawBellChart() {
  const canvas = document.getElementById('bell-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const padding = 30;
  const chartW = w - 2 * padding;
  const slot = chartW / BELL_BINS;
  const barW = Math.max(2, slot - 2);
  const maxCount = Math.max(1, ...bellCounts);
  const chartH = h - 60;

  // x-axis
  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 13px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`${bellTotal} balls dropped`, padding, 18);

  // axis line
  ctx.strokeStyle = '#bdbdbd';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(padding, h - 30);
  ctx.lineTo(w - padding, h - 30);
  ctx.stroke();

  // theoretical curve
  if (bellTotal > 0) {
    const mean = BELL_DICE_COUNT * 3.5;
    const variance = BELL_DICE_COUNT * 35 / 12;
    const sd = Math.sqrt(variance);
    ctx.strokeStyle = '#e53935';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let first = true;
    for (let i = 0; i <= BELL_BINS - 1; i += 0.1) {
      const s = BELL_MIN + i;
      const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-((s - mean) ** 2) / (2 * variance));
      const expected = pdf * bellTotal;
      const x = padding + i * slot + slot / 2;
      const y = h - 30 - (expected / maxCount) * chartH;
      if (first) { ctx.moveTo(x, y); first = false; }
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
  }

  // draw bars
  for (let i = 0; i < BELL_BINS; i++) {
    const x = padding + i * slot + 1;
    const barH = (bellCounts[i] / maxCount) * chartH;
    const y = h - 30 - barH;
    const grad = ctx.createLinearGradient(0, y, 0, h - 30);
    if (i === bellLastBin) {
      grad.addColorStop(0, '#ffeb3b');
      grad.addColorStop(1, '#ffa726');
    } else {
      grad.addColorStop(0, '#9575cd');
      grad.addColorStop(1, '#5e35b1');
    }
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);
  }

  // x-axis labels (sparse)
  ctx.fillStyle = '#666';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  for (let i = 0; i < BELL_BINS; i += 4) {
    ctx.fillText(BELL_MIN + i, padding + i * slot + slot / 2, h - 14);
  }

  // legend
  if (bellTotal > 0) {
    ctx.fillStyle = '#e53935';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'right';
    ctx.fillText('— theoretical bell curve', w - padding, 18);
  }
}

// ============================================================
// STAGE 3: DIFFERENT BOXES (4 mini-charts)
// ============================================================
let boxData = {
  coin: [0, 0],                 // H, T
  die:  [0, 0, 0, 0, 0, 0],
  d2:   new Array(11).fill(0),  // sums 2..12
  d10:  {},                     // dynamic dict for sums 10..60
};

function runAllBoxes(n) {
  for (let i = 0; i < n; i++) {
    // coin
    if (Math.random() < 0.5) boxData.coin[0]++; else boxData.coin[1]++;
    // die
    boxData.die[Math.floor(Math.random() * 6)]++;
    // 2 dice
    const a = Math.floor(Math.random() * 6) + 1;
    const b = Math.floor(Math.random() * 6) + 1;
    boxData.d2[a + b - 2]++;
    // 10 dice
    let s = 0;
    for (let j = 0; j < 10; j++) s += Math.floor(Math.random() * 6) + 1;
    boxData.d10[s] = (boxData.d10[s] || 0) + 1;
  }
  drawAllBoxes();
}

function resetAllBoxes() {
  boxData = {
    coin: [0, 0],
    die: [0, 0, 0, 0, 0, 0],
    d2: new Array(11).fill(0),
    d10: {},
  };
  drawAllBoxes();
}

function drawSimpleBars(canvas, values, labels, color1, color2) {
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);
  const padding = 22;
  const chartW = w - 2 * padding;
  const slot = chartW / values.length;
  const barW = Math.max(2, slot - 2);
  const maxVal = Math.max(1, ...values);
  const chartH = h - 40;
  for (let i = 0; i < values.length; i++) {
    const x = padding + i * slot + 1;
    const barH = (values[i] / maxVal) * chartH;
    const y = h - 25 - barH;
    const grad = ctx.createLinearGradient(0, y, 0, h - 25);
    grad.addColorStop(0, color1);
    grad.addColorStop(1, color2);
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);
  }
  ctx.fillStyle = '#666';
  ctx.font = '10px Arial';
  ctx.textAlign = 'center';
  // sparse labels
  const stride = Math.max(1, Math.ceil(values.length / 8));
  for (let i = 0; i < values.length; i += stride) {
    ctx.fillText(labels[i], padding + i * slot + slot / 2, h - 8);
  }
}

function drawAllBoxes() {
  drawSimpleBars(document.getElementById('box-coin'), boxData.coin, ['H', 'T'], '#ffd54f', '#ff9800');
  drawSimpleBars(document.getElementById('box-die'), boxData.die, ['1','2','3','4','5','6'], '#42a5f5', '#1565c0');
  const d2labels = []; for (let i = 2; i <= 12; i++) d2labels.push(i);
  drawSimpleBars(document.getElementById('box-2dice'), boxData.d2, d2labels, '#66bb6a', '#2e7d32');
  // d10
  const d10vals = [], d10labels = [];
  for (let s = 10; s <= 60; s++) { d10vals.push(boxData.d10[s] || 0); d10labels.push(s); }
  drawSimpleBars(document.getElementById('box-10dice'), d10vals, d10labels, '#ab47bc', '#6a1b9a');
}

// ============================================================
// STAGE 3: GAUSSIAN SLIDERS
// ============================================================
function redrawNormal() {
  const muEl = document.getElementById('mean-slider');
  const sdEl = document.getElementById('sd-slider');
  if (!muEl || !sdEl) return;
  const mu = parseFloat(muEl.value);
  const sd = parseFloat(sdEl.value);
  document.getElementById('mean-label').textContent = mu.toFixed(1);
  document.getElementById('sd-label').textContent = sd.toFixed(1);

  const canvas = document.getElementById('normal-canvas');
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const xMin = -10, xMax = 10;
  const xPx = x => ((x - xMin) / (xMax - xMin)) * w;
  const peakPdf = 1 / (sd * Math.sqrt(2 * Math.PI));
  const yScale = (h - 40) / Math.max(peakPdf, 0.5);
  const yPx = y => h - 25 - y * yScale;

  // grid
  ctx.strokeStyle = '#eee';
  for (let x = xMin; x <= xMax; x += 1) {
    ctx.beginPath();
    ctx.moveTo(xPx(x), 8);
    ctx.lineTo(xPx(x), h - 25);
    ctx.stroke();
  }

  // shaded sigma bands
  const bands = [
    { range: 3, color: 'rgba(149,117,205,0.15)' },
    { range: 2, color: 'rgba(149,117,205,0.30)' },
    { range: 1, color: 'rgba(149,117,205,0.50)' },
  ];
  bands.forEach(b => {
    ctx.fillStyle = b.color;
    ctx.beginPath();
    ctx.moveTo(xPx(mu - b.range * sd), h - 25);
    for (let px = xPx(mu - b.range * sd); px <= xPx(mu + b.range * sd); px += 1) {
      const x = xMin + (px / w) * (xMax - xMin);
      const pdf = (1 / (sd * Math.sqrt(2 * Math.PI))) * Math.exp(-((x - mu) ** 2) / (2 * sd * sd));
      ctx.lineTo(px, yPx(pdf));
    }
    ctx.lineTo(xPx(mu + b.range * sd), h - 25);
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
  ctx.moveTo(xPx(mu), 8);
  ctx.lineTo(xPx(mu), h - 25);
  ctx.stroke();
  ctx.setLineDash([]);

  // axis ticks
  ctx.fillStyle = '#555';
  ctx.font = '11px Arial';
  ctx.textAlign = 'center';
  for (let x = xMin; x <= xMax; x += 2) ctx.fillText(x, xPx(x), h - 10);

  // label
  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`μ = ${mu.toFixed(1)}, σ = ${sd.toFixed(1)}`, 12, 18);
}

// ============================================================
// STAGE 4: GALTON BOARD (kept from previous version)
// ============================================================
let galtonRows = 10;
let galtonBins = new Array(11).fill(0);
let galtonTotal = 0;
let galtonRecentPath = null;

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
    if (i === 0 && n === 1) galtonRecentPath = simulatePath(bin);
  }
  drawGaltonBoard();
  updateGaltonStats();
  if (n === 1) animateBall();
}

function simulatePath(bin) {
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

  // pegs
  ctx.fillStyle = '#7e57c2';
  for (let r = 0; r < rows; r++) {
    const rowY = startY + r * rowSpacing;
    for (let c = 0; c <= r; c++) {
      const pegX = startX + (c - r / 2) * pegSpacing;
      ctx.beginPath();
      ctx.arc(pegX, rowY, 3, 0, 2 * Math.PI);
      ctx.fill();
    }
  }

  // path
  if (highlightPath) {
    ctx.strokeStyle = '#ff9800';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    let bin = 0;
    ctx.moveTo(startX, startY - 10);
    for (let r = 0; r < rows; r++) {
      const rowY = startY + r * rowSpacing;
      const pegX = startX + (bin - r / 2) * pegSpacing;
      ctx.lineTo(pegX, rowY - 4);
      const goRight = highlightPath[r] === 1;
      if (goRight) bin++;
      const nextX = startX + (bin - (r + 1) / 2) * pegSpacing;
      const nextY = rowY + rowSpacing - 4;
      ctx.lineTo(nextX, nextY);
    }
    ctx.stroke();
    ctx.fillStyle = '#ff9800';
    const finalX = startX + (bin - rows / 2) * pegSpacing;
    const finalY = startY + rows * rowSpacing;
    ctx.beginPath();
    ctx.arc(finalX, finalY, 6, 0, 2 * Math.PI);
    ctx.fill();
  }

  // bins
  const binsTop = startY + rows * rowSpacing + 10;
  const binsBottom = h - 30;
  const binsHeight = binsBottom - binsTop;
  const maxCount = Math.max(1, ...galtonBins);

  for (let i = 0; i < bins; i++) {
    const binX = startX + (i - rows / 2) * pegSpacing - pegSpacing / 2;
    const binW = pegSpacing - 2;
    const fillH = (galtonBins[i] / maxCount) * binsHeight;
    const fillY = binsBottom - fillH;
    ctx.strokeStyle = '#bdbdbd';
    ctx.strokeRect(binX, binsTop, binW, binsHeight);
    const grad = ctx.createLinearGradient(0, fillY, 0, binsBottom);
    grad.addColorStop(0, '#7e57c2');
    grad.addColorStop(1, '#311b92');
    ctx.fillStyle = grad;
    ctx.fillRect(binX + 1, fillY, binW - 2, fillH);
    if (galtonBins[i] > 0) {
      ctx.fillStyle = '#fff';
      ctx.font = 'bold 10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(galtonBins[i], binX + binW / 2, fillY + 12);
    }
  }

  // bell overlay
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

  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`${galtonTotal} balls dropped through ${rows} rows`, 20, 18);
}

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
// STAGE 5: HASH FUNCTIONS
// ============================================================

// FNV-1a 32-bit hash. Real hash function used in many systems.
// Deterministic, fast, with good avalanche properties.
function fnv1a(s) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  return h.toString(16).padStart(8, '0');
}

let lastInput = '';
let lastHash = '';

function updateHash() {
  const input = document.getElementById('hash-input').value;
  const hash = fnv1a(input);
  document.getElementById('hash-input-display').textContent = input || '(empty)';

  // highlight changed characters
  const out = document.getElementById('hash-result');
  let html = '';
  for (let i = 0; i < hash.length; i++) {
    const changed = lastHash && hash[i] !== lastHash[i];
    html += `<span class="hash-char${changed ? ' changed' : ''}">${hash[i]}</span>`;
  }
  out.innerHTML = html;

  lastInput = input;
  lastHash = hash;
}

function buildAvalancheList() {
  const samples = ['cat', 'cAt', 'cat!', 'cats', 'bat', 'rat', 'cat ', 'cot'];
  const html = samples.map(s => {
    const h = fnv1a(s);
    return `<div class="avalanche-row">
      <span class="avalanche-input">"${s}"</span>
      <span class="avalanche-hash">${h}</span>
    </div>`;
  }).join('');
  document.getElementById('avalanche-list').innerHTML = html;
}

let hashUniformityCounts = new Array(16).fill(0);
let hashUniformityTotal = 0;

function runHashUniformity(n) {
  // hash a bunch of distinct strings
  for (let i = 0; i < n; i++) {
    const s = 'word' + (hashUniformityTotal + i) + '!' + Math.random();
    const h = fnv1a(s);
    const firstHex = parseInt(h[0], 16);
    hashUniformityCounts[firstHex]++;
  }
  hashUniformityTotal += n;
  drawHashUniformity();
}

function resetHashUniformity() {
  hashUniformityCounts = new Array(16).fill(0);
  hashUniformityTotal = 0;
  drawHashUniformity();
}

function drawHashUniformity() {
  const canvas = document.getElementById('hash-uniformity');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const w = canvas.width, h = canvas.height;
  ctx.clearRect(0, 0, w, h);

  const padding = 30;
  const chartW = w - 2 * padding;
  const slot = chartW / 16;
  const barW = slot - 4;
  const maxCount = Math.max(1, ...hashUniformityCounts);
  const chartH = h - 60;

  // expected line
  if (hashUniformityTotal > 0) {
    const expected = hashUniformityTotal / 16;
    const expY = h - 30 - (expected / maxCount) * chartH;
    ctx.strokeStyle = '#e53935';
    ctx.setLineDash([6, 4]);
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(padding, expY);
    ctx.lineTo(w - padding, expY);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle = '#e53935';
    ctx.font = 'bold 11px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`expected: ${expected.toFixed(0)} per bucket (red dashed line)`, padding, expY - 4);
  }

  // bars
  const HEX = '0123456789abcdef';
  for (let i = 0; i < 16; i++) {
    const x = padding + i * slot + 2;
    const barH = (hashUniformityCounts[i] / maxCount) * chartH;
    const y = h - 30 - barH;
    const grad = ctx.createLinearGradient(0, y, 0, h - 30);
    grad.addColorStop(0, '#26c6da');
    grad.addColorStop(1, '#00838f');
    ctx.fillStyle = grad;
    ctx.fillRect(x, y, barW, barH);
    ctx.fillStyle = '#333';
    ctx.font = 'bold 12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(HEX[i], x + barW / 2, h - 14);
  }

  ctx.fillStyle = '#311b92';
  ctx.font = 'bold 12px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(`${hashUniformityTotal} hashes`, padding, 18);
}

// ============================================================
// STAGE 6: SPOT THE FAKE GAME
// ============================================================
let randGame = null;

function realRandom(n) {
  for (let attempt = 0; attempt < 50; attempt++) {
    let s = '';
    for (let i = 0; i < n; i++) s += Math.random() < 0.5 ? 'H' : 'T';
    if (longestRun(s) >= 4) return s;
  }
  let s = '';
  for (let i = 0; i < n; i++) s += Math.random() < 0.5 ? 'H' : 'T';
  return s;
}

function fakeRandom(n) {
  const s = [];
  let runChar = null;
  let runLen = 0;
  const maxRun = 2;
  for (let i = 0; i < n; i++) {
    let pick;
    if (runChar !== null && runLen >= maxRun) {
      pick = runChar === 'H' ? 'T' : 'H';
    } else {
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
    if (s[i] === s[i - 1]) { cur++; if (cur > max) max = cur; }
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
    turn: 1,
    realIs: '', seqA: '', seqB: '',
    p1Choice: null, p2Choice: null,
  };

  document.getElementById('game-setup-card').classList.add('hidden');
  document.getElementById('game-final-card').classList.add('hidden');
  document.getElementById('game-active-card').classList.remove('hidden');
  document.getElementById('rand-p1-display').textContent = p1;
  document.getElementById('rand-p2-display').textContent = p2;

  document.getElementById('rand-p2-box').style.display = mode === 'solo' ? 'none' : '';
  document.getElementById('rand-scoreboard').style.gridTemplateColumns =
    mode === 'solo' ? '1fr auto' : '1fr auto 1fr';

  loadRandRound();
}

function loadRandRound() {
  const seqLen = 30;
  const real = realRandom(seqLen);
  const fake = fakeRandom(seqLen);
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

  document.getElementById('next-rand-btn').textContent =
    (randGame.currentRound + 1 >= randGame.rounds) ? '🏁 See Final Result' : '➡️ Next Round';
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
    </div>`;
  if (randGame.mode === 'vs') {
    html += `
      <div class="final-score-card ${randGame.p2Score >= randGame.p1Score ? 'winner' : ''}">
        <div class="fs-name">${randGame.p2}</div>
        <div class="fs-pts">${randGame.p2Score}</div>
      </div>`;
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
  drawBellChart();
  drawAllBoxes();
  redrawNormal();
  drawGaltonBoard();
  buildAvalancheList();
  updateHash();
  drawHashUniformity();
  showStage(1);
}

init();
