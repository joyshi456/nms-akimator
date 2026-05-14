// ============================================================
// Symmetry Lab — Brain Teasers script.js
// ============================================================

let currentStage = 1;
let solvedPuzzles = { warm: false, coin: false, bags: false, wise: false };

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

  if (stage === 2) setupCoins();
  if (stage === 3) restartBags();
  if (stage === 4) resetWiseMen();
}

// ============================================================
// SCORE
// ============================================================
function loadProgress() {
  const saved = localStorage.getItem('symmetry-progress');
  if (saved) { try { solvedPuzzles = { ...solvedPuzzles, ...JSON.parse(saved) }; } catch (e) {} }
  updateScore();
}
function saveProgress() {
  localStorage.setItem('symmetry-progress', JSON.stringify(solvedPuzzles));
  updateScore();
}
function updateScore() {
  const n = Object.values(solvedPuzzles).filter(Boolean).length;
  document.getElementById('score-display').textContent = `Puzzles solved: ${n} / 4`;
}
function resetPracticeScore() {
  solvedPuzzles = { warm: false, coin: false, bags: false, wise: false };
  saveProgress();
}

// ============================================================
// STAGE 1: WARM-UP MC
// ============================================================
function setupWarmUp() {
  document.querySelectorAll('#warm-opts .mc-option').forEach(btn => {
    btn.addEventListener('click', () => {
      if (document.getElementById('warm-fb').dataset.answered) return;
      const choice = btn.dataset.v;
      const correct = choice === 'B';
      document.getElementById('warm-fb').dataset.answered = '1';
      document.querySelectorAll('#warm-opts .mc-option').forEach(b => {
        b.style.pointerEvents = 'none';
        if (b.dataset.v === 'B') b.classList.add('correct');
        else if (b.dataset.v === choice) b.classList.add('incorrect');
      });
      const fb = document.getElementById('warm-fb');
      fb.innerHTML = correct ? '✅ Correct! Now see the full reasoning below.' : '❌ Not quite — the answer is B (2 weighings). See why below!';
      fb.className = 'mc-feedback ' + (correct ? 'correct' : 'incorrect');
      document.getElementById('warm-explain').classList.remove('hidden');
      if (correct) { solvedPuzzles.warm = true; saveProgress(); }
    });
  });
}

// ============================================================
// STAGE 2: COIN PILES
// ============================================================
let coins = []; // {isHeads: bool}
let coinTotal = 100;
let coinHeads = 10;

function setupCoins() {
  coinTotal = parseInt(document.getElementById('coin-total-slider').value);
  coinHeads = Math.min(parseInt(document.getElementById('coin-head-slider').value), coinTotal - 1);
  document.getElementById('coin-total-label').textContent = coinTotal;
  document.getElementById('coin-head-label').textContent = coinHeads;
  document.getElementById('coin-total-1').textContent = coinTotal;
  document.getElementById('coin-heads-1').textContent = coinHeads;
  document.getElementById('coin-h-text').textContent = coinHeads;

  // shuffle: place coinHeads at random positions
  coins = new Array(coinTotal).fill(null).map(() => ({ isHeads: false, pile: null }));
  const positions = new Set();
  while (positions.size < coinHeads) positions.add(Math.floor(Math.random() * coinTotal));
  positions.forEach(p => coins[p].isHeads = true);

  renderCoins();
  document.getElementById('split-result').innerHTML = '';
  document.getElementById('symmetry-result').innerHTML = '';
}

function renderCoins() {
  const grid = document.getElementById('coin-grid');
  grid.innerHTML = '';
  coins.forEach((c, i) => {
    const el = document.createElement('div');
    el.className = 'coin ' + (c.isHeads ? 'heads' : 'tails');
    if (c.pile === 'a') el.classList.add('pile-a');
    if (c.pile === 'b') el.classList.add('pile-b');
    el.textContent = c.isHeads ? 'H' : 'T';
    grid.appendChild(el);
  });
  // summary
  const headsCount = coins.filter(c => c.isHeads).length;
  document.getElementById('coin-summary').innerHTML =
    `<strong>${coinTotal}</strong> coins · <strong>${headsCount}</strong> heads-up (gold) · <strong>${coinTotal - headsCount}</strong> tails-up (silver)`;
}

function trySplitHalf() {
  // first half = pile A, rest = pile B
  const splitAt = Math.floor(coinTotal / 2);
  let headsA = 0, headsB = 0;
  coins.forEach((c, i) => {
    c.pile = i < splitAt ? 'a' : 'b';
    if (c.isHeads) (i < splitAt ? headsA++ : headsB++);
  });
  renderCoins();
  const success = headsA === headsB;
  const box = document.getElementById('split-result');
  box.className = 'result-box ' + (success ? 'success' : 'fail');
  box.innerHTML = `
    <div><strong>Pile A:</strong> ${headsA} heads &nbsp;·&nbsp; <strong>Pile B:</strong> ${headsB} heads</div>
    <div style="margin-top:6px;font-size:1.05rem"><strong>${success ? '✅ Lucky — equal!' : `❌ Off by ${Math.abs(headsA - headsB)}. Doesn't work.`}</strong></div>
  `;
}

function trySymmetryTrick() {
  // pile A = first coinHeads coins (we're blindfolded, so just "pick any H coins")
  // shuffle indices to make it visibly "random"
  const indices = [...Array(coinTotal).keys()].sort(() => Math.random() - 0.5);
  const pickedA = new Set(indices.slice(0, coinHeads));

  // flip everything in pile A
  coins.forEach((c, i) => {
    c.pile = pickedA.has(i) ? 'a' : 'b';
    if (pickedA.has(i)) c.isHeads = !c.isHeads;
  });
  renderCoins();

  let headsA = 0, headsB = 0;
  coins.forEach((c, i) => {
    if (c.isHeads) (pickedA.has(i) ? headsA++ : headsB++);
  });

  const success = headsA === headsB;
  const box = document.getElementById('symmetry-result');
  box.className = 'result-box ' + (success ? 'success' : 'fail');
  box.innerHTML = `
    <div>Picked ${coinHeads} random coins, flipped all of them.</div>
    <div style="margin-top:6px"><strong>Pile A:</strong> ${headsA} heads &nbsp;·&nbsp; <strong>Pile B:</strong> ${headsB} heads</div>
    <div style="margin-top:6px;font-size:1.1rem"><strong>${success ? '🎉 EQUAL! The symmetry trick always works!' : '😱 Something broke (shouldn\'t happen).'}</strong></div>
  `;
  if (success) { solvedPuzzles.coin = true; saveProgress(); }
}

function runCoinBot() {
  const trials = 1000;
  let symmetryWins = 0;
  let halfWins = 0;
  for (let t = 0; t < trials; t++) {
    const n = 100;
    const h = 10;
    // generate random coin config
    const cfg = new Array(n).fill(false);
    const pos = new Set();
    while (pos.size < h) pos.add(Math.floor(Math.random() * n));
    pos.forEach(p => cfg[p] = true);

    // half-and-half strategy
    let aH = 0, bH = 0;
    for (let i = 0; i < n; i++) (i < n/2 ? (cfg[i] && aH++) : (cfg[i] && bH++));
    if (aH === bH) halfWins++;

    // symmetry strategy: pick h random, flip them
    const ind = [...Array(n).keys()].sort(() => Math.random() - 0.5);
    const picked = new Set(ind.slice(0, h));
    let aH2 = 0, bH2 = 0;
    for (let i = 0; i < n; i++) {
      const isH = picked.has(i) ? !cfg[i] : cfg[i];
      if (isH) (picked.has(i) ? aH2++ : bH2++);
    }
    if (aH2 === bH2) symmetryWins++;
  }
  document.getElementById('coin-bot-result').innerHTML = `
    <div><strong>Symmetry trick:</strong> won ${symmetryWins} / ${trials} = <span style="color:#2e7d32"><strong>${(symmetryWins/trials*100).toFixed(1)}%</strong></span></div>
    <div><strong>Half-and-half (naive):</strong> won ${halfWins} / ${trials} = <span style="color:#c62828"><strong>${(halfWins/trials*100).toFixed(1)}%</strong></span></div>
    <div style="margin-top:8px;font-style:italic;color:#555">The symmetry strategy is guaranteed. The naive split only matches by luck.</div>
  `;
}
function resetCoinBot() {
  document.getElementById('coin-bot-result').innerHTML = '';
}

// ============================================================
// STAGE 3: MISLABELED BAGS
// ============================================================
const FRUITS = { apple: '🍎', orange: '🍊', mix: '🍇' };
const BAG_TYPES = ['apple', 'orange', 'mix'];
const LABELS = ['APPLES', 'ORANGES', 'MIX'];

let bags = []; // [{ trueType, label, picks }]
let bagPickCount = 0;
let bagsSolved = false;

function shuffleBags() {
  // Derangement of trueType to label: each bag must have a label != its trueType
  // Easy: pick any permutation that's a derangement
  while (true) {
    const trueTypes = [...BAG_TYPES].sort(() => Math.random() - 0.5);
    if (trueTypes.every((t, i) => t.toUpperCase() + 'S' !== LABELS[i] && (t === 'mix' ? LABELS[i] !== 'MIX' : true))) {
      // map bag i: label = LABELS[i], trueType = trueTypes[i]
      bags = LABELS.map((label, i) => ({
        trueType: trueTypes[i],
        label,
        picks: 0,
      }));
      // verify all mislabeled
      const ok = bags.every(b => labelMatchesType(b.label, b.trueType) === false);
      if (ok) return;
    }
  }
}

function labelMatchesType(label, type) {
  return (label === 'APPLES' && type === 'apple') ||
         (label === 'ORANGES' && type === 'orange') ||
         (label === 'MIX' && type === 'mix');
}

function pickFruitFromBag(bag) {
  if (bag.trueType === 'mix') return Math.random() < 0.5 ? 'apple' : 'orange';
  return bag.trueType; // 'apple' or 'orange'
}

function renderBags() {
  const row = document.getElementById('bags-row');
  row.innerHTML = '';
  bags.forEach((bag, i) => {
    const el = document.createElement('div');
    el.className = 'bag';
    el.dataset.idx = i;
    el.innerHTML = `
      <div class="bag-icon">🛍️</div>
      <div class="bag-label">${bag.label}</div>
      ${bag.picks > 0 ? `<div class="bag-pick-count">${bag.picks} pick${bag.picks > 1 ? 's' : ''}</div>` : ''}
    `;
    el.addEventListener('click', () => {
      if (bagsSolved) return;
      const fruit = pickFruitFromBag(bag);
      bag.picks++;
      bagPickCount++;
      document.getElementById('bag-picks').textContent = bagPickCount;
      document.getElementById('bag-last-pick').innerHTML =
        `<span class="fruit">${FRUITS[fruit]}</span> You picked an <strong>${fruit}</strong> from the bag labeled <strong>${bag.label}</strong>.`;
      renderBags();
    });
    row.appendChild(el);
  });
}

function restartBags() {
  shuffleBags();
  bagPickCount = 0;
  bagsSolved = false;
  document.getElementById('bag-picks').textContent = 0;
  document.getElementById('bag-optimal').textContent = '1';
  document.getElementById('bag-last-pick').innerHTML = 'Click a bag to pick a fruit from it.';
  document.getElementById('bag-result').innerHTML = '';
  document.getElementById('bag-result').className = 'result-box';
  document.getElementById('bag-guess-form').classList.add('hidden');
  document.getElementById('btn-guess').disabled = false;
  renderBags();
}

function startGuessing() {
  if (bagsSolved) return;
  const form = document.getElementById('bag-guess-form');
  form.classList.remove('hidden');
  const grid = document.getElementById('bag-guess-grid');
  grid.innerHTML = '';
  bags.forEach((bag, i) => {
    const row = document.createElement('div');
    row.className = 'bag-guess-row';
    row.innerHTML = `
      <strong>Bag labeled "${bag.label}"</strong>
      <select id="guess-${i}">
        <option value="">-- pick --</option>
        <option value="apple">apples only 🍎</option>
        <option value="orange">oranges only 🍊</option>
        <option value="mix">mix 🍇</option>
      </select>
    `;
    grid.appendChild(row);
  });
}

function submitBagGuess() {
  const guesses = bags.map((_, i) => document.getElementById(`guess-${i}`).value);
  if (guesses.some(g => !g)) {
    alert('Pick a contents for each bag first!');
    return;
  }
  // must be a permutation
  const set = new Set(guesses);
  if (set.size !== 3) {
    alert('Each bag must have a different type! Try again.');
    return;
  }

  const allCorrect = bags.every((b, i) => guesses[i] === b.trueType);
  bagsSolved = true;
  document.getElementById('btn-guess').disabled = true;

  const box = document.getElementById('bag-result');
  if (allCorrect) {
    box.className = 'result-box success';
    let summary = `🎉 <strong>All correct!</strong> You solved it in <strong>${bagPickCount} pick${bagPickCount !== 1 ? 's' : ''}</strong>.`;
    if (bagPickCount === 1) summary += ' 🏆 That\'s the OPTIMAL solution!';
    else if (bagPickCount <= 2) summary += ' Pretty good — but it\'s actually possible in just 1!';
    else summary += ` But it's actually possible in just <strong>1 pick</strong>. Try again!`;
    summary += `<br><br><strong>The bags really were:</strong><br>` +
      bags.map(b => `• "${b.label}" → ${FRUITS[b.trueType]} ${b.trueType}`).join('<br>');
    box.innerHTML = summary;
    solvedPuzzles.bags = true;
    saveProgress();
  } else {
    box.className = 'result-box fail';
    box.innerHTML = `❌ Not quite. <strong>The truth:</strong><br>` +
      bags.map((b, i) => {
        const ok = guesses[i] === b.trueType;
        return `${ok ? '✅' : '❌'} "${b.label}" → ${FRUITS[b.trueType]} ${b.trueType} (you guessed ${guesses[i]})`;
      }).join('<br>');
  }
}

// ============================================================
// STAGE 4: WISE MEN & GLASS
// ============================================================
let wise = null; // { n, men: [{hasFlipped, called}], glassUp, spokesmanCount, day, victory }
let wisePlaying = false;
let wiseInterval = null;

function resetWiseMen() {
  if (wiseInterval) { clearInterval(wiseInterval); wiseInterval = null; }
  wisePlaying = false;
  document.getElementById('wise-play').textContent = '▶️ Auto-play';
  const n = parseInt(document.getElementById('wise-count').value);
  document.getElementById('wise-count-label').textContent = n;
  wise = {
    n,
    men: new Array(n).fill(null).map((_, i) => ({
      isSpokesman: i === 0,
      hasFlipped: false,  // for non-spokesman: has done their single flip
      called: false,
    })),
    glassUp: false,
    spokesmanCount: 0,
    day: 0,
    victory: false,
    lastCalled: null,
  };
  renderWiseGrid();
  updateWiseStats();
  document.getElementById('wise-log').innerHTML = '';
  document.getElementById('wise-victory').classList.add('hidden');
}

function renderWiseGrid() {
  const grid = document.getElementById('wise-grid');
  grid.innerHTML = '';
  wise.men.forEach((m, i) => {
    const el = document.createElement('div');
    el.className = 'wise-man';
    if (m.isSpokesman) el.classList.add('spokesman');
    if (m.hasFlipped) el.classList.add('flipped');
    if (wise.lastCalled === i) el.classList.add('active');
    el.title = m.isSpokesman ? 'Spokesman' : `Wise Man #${i}`;
    el.textContent = m.isSpokesman ? '★' : '';
    grid.appendChild(el);
  });
}

function updateWiseStats() {
  document.getElementById('wise-day').textContent = wise.day.toLocaleString();
  document.getElementById('wise-count-stat').textContent = `${wise.spokesmanCount} / ${wise.n - 1}`;
  const glass = document.getElementById('glass');
  glass.className = 'glass' + (wise.glassUp ? ' up' : '');
  document.getElementById('glass-label').textContent = wise.glassUp ? 'upside-down' : 'bottom-down';
}

function logEvent(text) {
  const log = document.getElementById('wise-log');
  const entry = document.createElement('div');
  entry.className = 'log-entry';
  entry.innerHTML = text;
  log.appendChild(entry);
  log.scrollTop = log.scrollHeight;
  // limit history
  while (log.children.length > 200) log.removeChild(log.firstChild);
}

function stepWise() {
  if (wise.victory) return;
  wise.day++;
  const idx = Math.floor(Math.random() * wise.n);
  const man = wise.men[idx];
  man.called = true;
  wise.lastCalled = idx;

  let actionDesc = 'does nothing';
  let didFlip = false;

  if (man.isSpokesman) {
    // Spokesman: flip down + count if glass is up
    if (wise.glassUp) {
      wise.glassUp = false;
      wise.spokesmanCount++;
      didFlip = true;
      actionDesc = `<span class="action">flips glass down (count = ${wise.spokesmanCount})</span>`;
      if (wise.spokesmanCount === wise.n - 1) {
        wise.victory = true;
        actionDesc += ' <strong style="color:#76ff03">— DECLARES VICTORY!</strong>';
      }
    }
  } else {
    // Regular: flip up if glass is down AND hasn't flipped yet
    if (!wise.glassUp && !man.hasFlipped) {
      wise.glassUp = true;
      man.hasFlipped = true;
      didFlip = true;
      actionDesc = `<span class="action">flips glass up (first time!)</span>`;
    }
  }

  const who = man.isSpokesman ? '🎩 Spokesman' : `Man #${idx}`;
  logEvent(`<span class="log-entry">Min ${wise.day}: <span class="who">${who}</span> — ${actionDesc}</span>`);

  if (didFlip) {
    const glass = document.getElementById('glass');
    glass.classList.remove('flipping');
    void glass.offsetWidth;
    glass.classList.add('flipping');
  }

  renderWiseGrid();
  updateWiseStats();

  if (wise.victory) {
    if (wiseInterval) { clearInterval(wiseInterval); wiseInterval = null; }
    wisePlaying = false;
    document.getElementById('wise-play').textContent = '▶️ Auto-play';
    const allCalled = wise.men.every(m => m.called);
    const banner = document.getElementById('wise-victory');
    banner.classList.remove('hidden');
    banner.innerHTML = `🎉 The spokesman declared on day <strong>${wise.day.toLocaleString()}</strong>!<br>` +
      `All ${wise.n} wise men were called: <strong>${allCalled ? '✅ TRUE — they all go free!' : '❌ FALSE (shouldn\'t happen)'}</strong>`;
    solvedPuzzles.wise = true;
    saveProgress();
  }
}

function playWise() {
  const btn = document.getElementById('wise-play');
  if (wisePlaying) {
    if (wiseInterval) clearInterval(wiseInterval);
    wiseInterval = null;
    wisePlaying = false;
    btn.textContent = '▶️ Auto-play';
    return;
  }
  wisePlaying = true;
  btn.textContent = '⏸️ Pause';
  const speed = parseInt(document.getElementById('wise-speed').value);
  const delay = Math.max(8, 250 - speed);
  // when speed is large, step multiple times per tick
  const stepsPerTick = speed > 100 ? Math.ceil((speed - 100) / 5) : 1;
  wiseInterval = setInterval(() => {
    for (let i = 0; i < stepsPerTick; i++) {
      if (!wise.victory) stepWise();
    }
  }, delay);
}

function runWiseBot(trials) {
  const n = wise ? wise.n : 50;
  const results = [];
  for (let t = 0; t < trials; t++) {
    let glassUp = false;
    let count = 0;
    let flipped = new Array(n).fill(false);
    let day = 0;
    while (count < n - 1) {
      day++;
      const idx = Math.floor(Math.random() * n);
      const isSpokesman = idx === 0;
      if (isSpokesman) {
        if (glassUp) { glassUp = false; count++; }
      } else {
        if (!glassUp && !flipped[idx]) { glassUp = true; flipped[idx] = true; }
      }
      if (day > 1000000) break; // safety
    }
    results.push(day);
  }
  results.sort((a, b) => a - b);
  const avg = results.reduce((a, b) => a + b, 0) / trials;
  const min = results[0];
  const max = results[trials - 1];
  const median = results[Math.floor(trials / 2)];
  document.getElementById('wise-bot-result').innerHTML = `
    <div><strong>${trials} simulations</strong> with ${n} wise men:</div>
    <div style="margin-top:8px">
      📊 <strong>Average:</strong> ${avg.toFixed(0).toLocaleString()} minutes<br>
      📐 <strong>Median:</strong> ${median.toLocaleString()} minutes<br>
      ⚡ <strong>Fastest:</strong> ${min.toLocaleString()} &nbsp;·&nbsp; 🐌 <strong>Slowest:</strong> ${max.toLocaleString()}
    </div>
    <div style="margin-top:8px;font-style:italic;color:#555">Always works — even though it's slow!</div>
  `;
}
function resetWiseBot() {
  document.getElementById('wise-bot-result').innerHTML = '';
}

// ============================================================
// INIT
// ============================================================
function init() {
  loadProgress();
  setupWarmUp();
  showStage(1);
  setupCoins();
  restartBags();
  resetWiseMen();
}

init();
