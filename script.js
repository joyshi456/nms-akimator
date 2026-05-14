// ============================================================
// Symmetry Arena — script.js
// Game engine for 3 brain teasers, 3 levels each.
// ============================================================

// ============================================================
// PROGRESS / STARS
// ============================================================
let progress = {
  coin: [0, 0, 0],   // stars per level (0-3)
  bags: [0, 0, 0],
  wise: [0, 0, 0],
};

function loadProgress() {
  const saved = localStorage.getItem('arena-progress');
  if (saved) { try { progress = { ...progress, ...JSON.parse(saved) }; } catch (e) {} }
  refreshHubProgress();
}
function saveProgress() {
  localStorage.setItem('arena-progress', JSON.stringify(progress));
  refreshHubProgress();
}
function refreshHubProgress() {
  ['coin', 'bags', 'wise'].forEach(p => {
    const sum = progress[p].reduce((a, b) => a + b, 0);
    const el = document.getElementById(`${p}-progress`);
    if (el) el.innerHTML = renderStars(sum, 9, true);
  });
  const totalStars = ['coin', 'bags', 'wise']
    .map(p => progress[p].reduce((a, b) => a + b, 0))
    .reduce((a, b) => a + b, 0);
  document.getElementById('total-stars').textContent = totalStars;
  // Show master section if all 9 stars (3 levels × 3 stars… wait, we count differently)
  // Each puzzle has max 9 stars (3 per level × 3 levels). Total max = 27.
  // But the hub shows X/9 — meaning we count per-level completion (max 3 per puzzle = 9).
  // Let's recount: we show 1 star per LEVEL completed, max 9.
  const levelsDone = ['coin','bags','wise'].reduce((sum, p) => sum + progress[p].filter(s => s > 0).length, 0);
  document.getElementById('total-stars').textContent = levelsDone;
  const masterEl = document.getElementById('symmetry-master');
  if (masterEl) masterEl.style.display = levelsDone === 9 ? 'block' : 'none';
}

function renderStars(value, max, doubleUp) {
  // For tile progress, show 3 small stars (max 3 levels) but use doubleUp logic
  if (doubleUp) {
    // value = total stars in 3 levels (max 9), show 3 stars filled by level completion
    const lvlsDone = progress[currentTilePuzzle || ''] ? progress[currentTilePuzzle].filter(s => s > 0).length : 0;
    // Simpler: show as many ⭐ as max stars (1 per level reached)
    return '';
  }
  return '';
}

function refreshHubProgress() {
  ['coin', 'bags', 'wise'].forEach(p => {
    const arr = progress[p];
    const el = document.getElementById(`${p}-progress`);
    if (!el) return;
    // Show 3 star slots, one per level. Filled if level cleared.
    el.innerHTML = arr.map(s => s > 0 ? '<span class="star-on">⭐</span>' : '<span class="star-off">⭐</span>').join('');
  });
  const levelsDone = ['coin', 'bags', 'wise'].reduce((sum, p) => sum + progress[p].filter(s => s > 0).length, 0);
  document.getElementById('total-stars').textContent = levelsDone;
  const masterEl = document.getElementById('symmetry-master');
  if (masterEl) masterEl.style.display = levelsDone === 9 ? 'block' : 'none';
}

// ============================================================
// NAVIGATION
// ============================================================
let currentPuzzle = null;
let currentLevel = null;
let lastEarnedStars = 0;

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
  window.scrollTo(0, 0);
}

function goHub() {
  currentPuzzle = null;
  currentLevel = null;
  refreshHubProgress();
  showScreen('hub');
}

function enterPuzzle(puzzle) {
  currentPuzzle = puzzle;
  document.getElementById('level-puzzle-title').textContent = PUZZLES[puzzle].name;
  document.getElementById('level-subtitle').textContent = PUZZLES[puzzle].subtitle;
  renderLevelCards();
  showScreen('level-select');
}

function goLevelSelect() {
  if (!currentPuzzle) goHub();
  else { renderLevelCards(); showScreen('level-select'); }
}

function quitGame() {
  goLevelSelect();
}

const PUZZLES = {
  coin: {
    name: '🪙 Coin Piles',
    subtitle: 'Separate coins into equal-heads piles — blindfolded!',
    levels: [
      { num: 1, name: 'Tutorial', desc: '4 coins, 1 head. The smallest case.', emoji: '📚', total: 4, heads: 1 },
      { num: 2, name: 'Apply', desc: '50 coins, 8 heads. Solo run.', emoji: '🎯', total: 50, heads: 8 },
      { num: 3, name: 'Master', desc: '100 coins, 12 heads. Boss mode.', emoji: '🏆', total: 100, heads: 12 },
    ],
    start: (lvl) => startCoinLevel(lvl),
  },
  bags: {
    name: '🍎 Bag Detective',
    subtitle: 'Identify mislabeled bags in minimum picks.',
    levels: [
      { num: 1, name: 'Tutorial', desc: '3 bags. Hint shown.', emoji: '📚' },
      { num: 2, name: 'Apply', desc: 'No hint. 1 pick for ⭐⭐⭐.', emoji: '🎯' },
      { num: 3, name: 'Speed Round', desc: 'Solve 3 fresh rounds, 1 pick each!', emoji: '🏆', rounds: 3 },
    ],
    start: (lvl) => startBagsLevel(lvl),
  },
  wise: {
    name: '🍷 The Spokesman',
    subtitle: 'YOU are the spokesman. When do you declare?',
    levels: [
      { num: 1, name: 'Tutorial', desc: '4 men. See the strategy clearly.', emoji: '📚', n: 4 },
      { num: 2, name: 'Apply', desc: '15 men. Quicker pace.', emoji: '🎯', n: 15 },
      { num: 3, name: 'Master', desc: '50 men. The classic.', emoji: '🏆', n: 50 },
    ],
    start: (lvl) => startWiseLevel(lvl),
  },
};

function renderLevelCards() {
  const row = document.getElementById('level-row');
  row.innerHTML = '';
  const puzzleProgress = progress[currentPuzzle];
  const levels = PUZZLES[currentPuzzle].levels;

  levels.forEach((lvl, i) => {
    const stars = puzzleProgress[i];
    const prev = i === 0 ? 1 : puzzleProgress[i - 1];
    const locked = prev === 0;
    const card = document.createElement('div');
    card.className = 'level-card' + (locked ? ' locked' : '');
    card.innerHTML = `
      <div class="level-num">LEVEL ${lvl.num}</div>
      <div class="lc-emoji">${lvl.emoji}</div>
      <h3>${lvl.name}</h3>
      <div class="lc-desc">${lvl.desc}</div>
      <div class="stars-row">${[1,2,3].map(s => s <= stars ? '<span class="star-on">⭐</span>' : '<span class="star-off">⭐</span>').join('')}</div>
    `;
    if (!locked) {
      card.addEventListener('click', () => {
        currentLevel = i;
        PUZZLES[currentPuzzle].start(i);
      });
    } else {
      const lock = document.createElement('div');
      lock.style.cssText = 'position:absolute; top:8px; right:8px; font-size:1.4rem;';
      lock.textContent = '🔒';
      card.appendChild(lock);
    }
    row.appendChild(card);
  });
}

// ============================================================
// RESULT MODAL
// ============================================================
function showResult(stars, title, body) {
  lastEarnedStars = stars;
  document.getElementById('result-title').textContent = title;
  const starsEl = document.getElementById('result-stars');
  starsEl.innerHTML = [1,2,3].map(s => s <= stars ? '<span class="star">⭐</span>' : '<span class="star" style="filter:grayscale(1) opacity(0.3)">⭐</span>').join('');
  document.getElementById('result-body').innerHTML = body;
  document.getElementById('result-modal').classList.remove('hidden');
  if (stars > 0) launchConfetti();
}
function hideResult() {
  document.getElementById('result-modal').classList.add('hidden');
}
function onNextLevel() {
  hideResult();
  // Advance to next level if exists
  if (currentLevel + 1 < PUZZLES[currentPuzzle].levels.length) {
    const next = currentLevel + 1;
    if (progress[currentPuzzle][next - 1] > 0 || next === 0) {
      currentLevel = next;
      PUZZLES[currentPuzzle].start(next);
      return;
    }
  }
  goLevelSelect();
}

function awardStars(stars) {
  if (stars > progress[currentPuzzle][currentLevel]) {
    progress[currentPuzzle][currentLevel] = stars;
    saveProgress();
  } else {
    // Still mark as completed (at least 1 star)
    if (stars > 0 && progress[currentPuzzle][currentLevel] === 0) {
      progress[currentPuzzle][currentLevel] = stars;
      saveProgress();
    }
  }
}

// ============================================================
// CONFETTI
// ============================================================
function launchConfetti() {
  const container = document.getElementById('confetti');
  const colors = ['#ffd96a', '#43a047', '#1976d2', '#e53935', '#ab47bc'];
  for (let i = 0; i < 50; i++) {
    const p = document.createElement('div');
    p.className = 'confetti-piece';
    p.style.left = Math.random() * 100 + '%';
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    p.style.animationDelay = (Math.random() * 0.4) + 's';
    p.style.animationDuration = (1.8 + Math.random() * 1.5) + 's';
    p.style.transform = `rotate(${Math.random() * 360}deg)`;
    container.appendChild(p);
    setTimeout(() => p.remove(), 4000);
  }
}

// ============================================================
// COIN GAME
// ============================================================
let coinLvl = 0;
let coinState = null; // { coins: [{isHeads, inPileA, flipped, revealed}], total, heads, attempts, flipsUsed }

function startCoinLevel(lvl) {
  coinLvl = lvl;
  const def = PUZZLES.coin.levels[lvl];
  document.getElementById('coin-level-tag').textContent = `COIN PILES · L${lvl + 1} · ${def.name.toUpperCase()}`;
  document.getElementById('coin-need').textContent = def.heads;
  document.getElementById('coin-goal').innerHTML =
    `You're blindfolded with <strong>${def.total} coins</strong>. Exactly <strong>${def.heads}</strong> are heads-up. ` +
    `Split into two piles with the <strong>same number of heads</strong>. You may flip any coins.`;

  // generate coins
  const coins = new Array(def.total).fill(null).map(() => ({ isHeads: false, inPileA: false, flipped: false, revealed: false }));
  // randomly mark `heads` of them as heads
  const indices = [...Array(def.total).keys()].sort(() => Math.random() - 0.5);
  for (let i = 0; i < def.heads; i++) coins[indices[i]].isHeads = true;
  coinState = { coins, total: def.total, heads: def.heads, attempts: 0, flipped: false };

  renderCoinGame();
  if (lvl === 0) {
    document.getElementById('coin-hint').innerHTML =
      `💡 <strong>Tutorial tip:</strong> Click <strong>${def.heads}</strong> coins to put them in Pile A. Then hit FLIP, then SUBMIT.`;
  } else if (lvl === 1) {
    document.getElementById('coin-hint').innerHTML =
      `💡 Same strategy: pick ${def.heads} coins for Pile A, flip them, submit. 1st-try win = ⭐⭐⭐`;
  } else {
    document.getElementById('coin-hint').innerHTML =
      `💡 The classic. Solo run. Get it on the first try!`;
  }
  document.getElementById('btn-flip').disabled = false;
  document.getElementById('btn-coin-submit').disabled = false;
  showScreen('coin-game');
  // Auto-open walkthrough on Tutorial level if first time
  if (lvl === 0 && progress.coin[0] === 0) setTimeout(() => openWalkthrough('coin'), 350);
}

function renderCoinGame() {
  const pileA = document.getElementById('coin-pile-a');
  const table = document.getElementById('coin-table');
  pileA.innerHTML = '';
  table.innerHTML = '';

  coinState.coins.forEach((c, idx) => {
    const el = document.createElement('div');
    el.className = 'coin';
    if (!c.revealed) el.classList.add('face-down');
    else el.classList.add('revealed', c.isHeads ? 'heads' : 'tails');
    if (c.flipped) el.classList.add('flipped');
    el.addEventListener('click', () => {
      if (c.revealed) return;
      c.inPileA = !c.inPileA;
      renderCoinGame();
    });
    if (c.inPileA) pileA.appendChild(el);
    else table.appendChild(el);
  });

  document.getElementById('coin-pile-a-count').textContent =
    coinState.coins.filter(c => c.inPileA).length;
  document.getElementById('coin-flipped').textContent = coinState.flipped ? 'Yes' : 'No';
}

function coinFlipPileA() {
  if (!coinState || coinState.coins.some(c => c.revealed)) return;
  coinState.coins.forEach(c => { if (c.inPileA) { c.isHeads = !c.isHeads; c.flipped = !c.flipped; } });
  coinState.flipped = true;
  renderCoinGame();
}

function coinSubmit() {
  if (!coinState) return;
  coinState.attempts++;
  // reveal
  coinState.coins.forEach(c => c.revealed = true);
  renderCoinGame();
  let aH = 0, bH = 0;
  coinState.coins.forEach(c => { if (c.isHeads) (c.inPileA ? aH++ : bH++); });
  const aSize = coinState.coins.filter(c => c.inPileA).length;
  const bSize = coinState.total - aSize;

  document.getElementById('btn-flip').disabled = true;
  document.getElementById('btn-coin-submit').disabled = true;

  const success = aH === bH;
  let stars = 0;
  if (success) {
    if (coinState.attempts === 1) stars = 3;
    else if (coinState.attempts === 2) stars = 2;
    else stars = 1;
    awardStars(stars);
  }

  const body = success
    ? `✅ Pile A: <strong>${aH}</strong> heads · Pile B: <strong>${bH}</strong> heads. They match!<br><br>` +
      `Attempts: <strong>${coinState.attempts}</strong>${stars === 3 ? ' — FIRST TRY!' : ''}` +
      (aSize === coinState.heads && coinState.flipped ? '<br>🎩 You used the symmetry trick perfectly!' : '')
    : `❌ Pile A: <strong>${aH}</strong> heads · Pile B: <strong>${bH}</strong> heads — not equal.<br><br>` +
      `<em>Try again. Tip: put <strong>exactly ${coinState.heads}</strong> coins in Pile A, then flip them all.</em>`;
  showResult(stars, success ? '🎉 LEVEL CLEARED!' : '❌ Almost!', body);
}

// ============================================================
// BAGS GAME
// ============================================================
let bagsLvl = 0;
let bagsState = null; // { bags, picks, roundIdx, totalRounds, roundsWon, streakPerfect }

const BAGS_FRUITS = { apple: '🍎', orange: '🍊', mix: '🍇' };

function makeBagSet() {
  // 3 bags. Each must have a wrong label.
  const labels = ['APPLES', 'ORANGES', 'MIX'];
  const trueTypes = ['apple', 'orange', 'mix'];
  // find a derangement: assign trueType[i] != label[i]'s expected type
  // valid derangement of ['apple','orange','mix'] given labels ['APPLES','ORANGES','MIX']:
  // bag labeled APPLES (expected apple) must have orange or mix
  // bag labeled ORANGES must have apple or mix
  // bag labeled MIX must have apple or orange
  // 2 valid derangements: (orange, mix, apple) and (mix, apple, orange)
  const derangements = [
    ['orange', 'mix', 'apple'],
    ['mix', 'apple', 'orange'],
  ];
  const pick = derangements[Math.floor(Math.random() * 2)];
  return labels.map((label, i) => ({ label, trueType: pick[i], picks: 0 }));
}

function startBagsLevel(lvl) {
  bagsLvl = lvl;
  const def = PUZZLES.bags.levels[lvl];
  document.getElementById('bags-level-tag').textContent = `BAG DETECTIVE · L${lvl + 1} · ${def.name.toUpperCase()}`;
  document.getElementById('bags-goal').innerHTML =
    lvl < 2
      ? `Three bags with <strong>wrong</strong> labels. Click a bag to pick a fruit. Pick as <strong>FEW</strong> as possible. Then assign each bag its real contents.`
      : `<strong>Speed Round!</strong> Solve <strong>3 fresh bag puzzles in a row</strong>, each in <strong>1 pick</strong> for full stars!`;

  bagsState = {
    bags: makeBagSet(),
    picks: 0,
    roundIdx: 0,
    totalRounds: def.rounds || 1,
    roundsWon: 0,
    streakPerfect: 0,
    totalPicks: 0,
  };
  document.getElementById('bags-round').textContent = `1 / ${bagsState.totalRounds}`;
  document.getElementById('bags-streak').textContent = '0';
  document.getElementById('bags-guess-form').classList.add('hidden');
  document.getElementById('bags-last-pick').innerHTML = 'Click a bag to pick a fruit.';

  if (lvl === 0) {
    document.getElementById('bags-hint').innerHTML =
      `💡 <strong>Tip:</strong> Pick from the bag labeled <strong>"MIX"</strong> — it can't actually be mix (mislabeled!), so one fruit gives you the answer!`;
  } else {
    document.getElementById('bags-hint').innerHTML = `💡 The asymmetric bag is the key.`;
  }
  renderBagsGame();
  showScreen('bags-game');
  if (lvl === 0 && progress.bags[0] === 0) setTimeout(() => openWalkthrough('bags'), 350);
}

function renderBagsGame() {
  const arena = document.getElementById('bags-arena');
  arena.innerHTML = '';
  bagsState.bags.forEach((bag, i) => {
    const el = document.createElement('div');
    el.className = 'bag';
    el.innerHTML = `
      <div class="bag-icon">🛍️</div>
      <div class="bag-label">${bag.label}</div>
      ${bag.picks > 0 ? `<div class="bag-pick-count">${bag.picks}×</div>` : ''}
    `;
    el.addEventListener('click', () => bagPick(i));
    arena.appendChild(el);
  });
  document.getElementById('bags-picks').textContent = bagsState.picks;
}

function bagPick(idx) {
  const bag = bagsState.bags[idx];
  let fruit;
  if (bag.trueType === 'mix') fruit = Math.random() < 0.5 ? 'apple' : 'orange';
  else fruit = bag.trueType;
  bag.picks++;
  bagsState.picks++;
  document.getElementById('bags-last-pick').innerHTML =
    `<span class="fruit-pop">${BAGS_FRUITS[fruit]}</span> Pulled an <strong>${fruit}</strong> from <strong>"${bag.label}"</strong>.`;
  renderBagsGame();
}

function bagsStartGuessing() {
  const form = document.getElementById('bags-guess-form');
  const grid = document.getElementById('bags-guess-grid');
  grid.innerHTML = '';
  bagsState.bags.forEach((bag, i) => {
    const row = document.createElement('div');
    row.className = 'bag-guess-row';
    row.innerHTML = `
      <strong>"${bag.label}" really has</strong>
      <select id="bagsel-${i}">
        <option value="">—</option>
        <option value="apple">apples only 🍎</option>
        <option value="orange">oranges only 🍊</option>
        <option value="mix">mix 🍇</option>
      </select>
    `;
    grid.appendChild(row);
  });
  form.classList.remove('hidden');
}

function bagsSubmit() {
  const guesses = bagsState.bags.map((_, i) => document.getElementById(`bagsel-${i}`).value);
  if (guesses.some(g => !g)) { alert('Pick a contents for each bag.'); return; }
  if (new Set(guesses).size !== 3) { alert('Each bag must be a different type.'); return; }
  const correct = bagsState.bags.every((b, i) => guesses[i] === b.trueType);

  if (!correct) {
    // Failure path — single attempt
    let body = `❌ Not quite. The truth:<br>` +
      bagsState.bags.map((b, i) => {
        const ok = guesses[i] === b.trueType;
        return `${ok ? '✅' : '❌'} "${b.label}" → ${BAGS_FRUITS[b.trueType]} ${b.trueType} (you said ${guesses[i]})`;
      }).join('<br>');
    body += `<br><br><em>Restart and try again. Remember: pick from MIX first!</em>`;
    showResult(0, '❌ Wrong!', body);
    return;
  }

  // Correct! Score this round.
  bagsState.totalPicks += bagsState.picks;
  bagsState.roundsWon++;
  if (bagsState.picks === 1) bagsState.streakPerfect++;
  document.getElementById('bags-streak').textContent = bagsState.streakPerfect;

  // If multi-round, advance
  if (bagsState.roundIdx + 1 < bagsState.totalRounds) {
    bagsState.roundIdx++;
    document.getElementById('bags-round').textContent = `${bagsState.roundIdx + 1} / ${bagsState.totalRounds}`;
    bagsState.bags = makeBagSet();
    bagsState.picks = 0;
    document.getElementById('bags-picks').textContent = 0;
    document.getElementById('bags-guess-form').classList.add('hidden');
    document.getElementById('bags-last-pick').innerHTML = `✅ Round ${bagsState.roundIdx} done! ${bagsState.picks === 1 ? '⭐ Perfect!' : ''} Click a bag to begin round ${bagsState.roundIdx + 1}.`;
    renderBagsGame();
    return;
  }

  // All rounds done. Score.
  let stars;
  if (bagsState.totalRounds === 1) {
    stars = bagsState.totalPicks === 1 ? 3 : bagsState.totalPicks === 2 ? 2 : 1;
  } else {
    // speed round: stars = # perfect rounds
    stars = Math.min(3, bagsState.streakPerfect);
  }
  awardStars(stars);

  let body;
  if (bagsState.totalRounds === 1) {
    body = `🎉 Solved in <strong>${bagsState.totalPicks} pick${bagsState.totalPicks === 1 ? '' : 's'}</strong>!<br><br>` +
      (stars === 3 ? '🏆 <strong>OPTIMAL!</strong> One pick from the MIX bag identifies all three.' :
       stars === 2 ? 'Great! But it\'s actually possible in just 1 pick. Try again for ⭐⭐⭐!' :
       'Pretty solid! Optimal is just 1 pick from the "MIX" bag.');
  } else {
    body = `🎉 You solved all ${bagsState.totalRounds} rounds!<br>` +
      `Perfect (1-pick) rounds: <strong>${bagsState.streakPerfect} / ${bagsState.totalRounds}</strong><br><br>` +
      (stars === 3 ? '🏆 <strong>FLAWLESS!</strong>' : 'Try again for a flawless speed run.');
  }
  showResult(stars, '🎉 LEVEL CLEARED!', body);
}

// ============================================================
// WISE MEN GAME (player = spokesman)
// ============================================================
let wiseLvl = 0;
let wiseState = null;
// { n, men: [{called, flipped}], glassUp, count, day, awaitingDecision, declared, won }

function startWiseLevel(lvl) {
  wiseLvl = lvl;
  const def = PUZZLES.wise.levels[lvl];
  const n = def.n;
  document.getElementById('wise-level-tag').textContent = `THE SPOKESMAN · L${lvl + 1} · ${def.name.toUpperCase()}`;
  document.getElementById('wise-target').textContent = n - 1;
  document.getElementById('wise-goal').innerHTML =
    `🎩 You're the <strong>Spokesman</strong>. ${n - 1} other wise men each follow this rule: "First time I see the glass <strong>down</strong>, I flip it <strong>up</strong>. After that, I never touch it."<br>` +
    `Your job: every time YOU see the glass <strong>up</strong>, flip it down and add 1 to your count. When count = <strong>${n - 1}</strong>, declare!`;

  wiseState = {
    n,
    men: new Array(n).fill(null).map(() => ({ called: false, flipped: false })),
    glassUp: false,
    count: 0,
    day: 0,
    awaiting: false,
    declared: false,
    won: false,
    lvl,
  };
  // Player is index 0 (spokesman)
  document.getElementById('wise-day').textContent = 0;
  document.getElementById('wise-count').textContent = 0;
  setGlass(false, false);
  document.getElementById('wise-visitor').innerHTML = `<p class="visitor-text">Press <strong>NEXT VISIT</strong> to start. The sultan will randomly summon one of the ${n} wise men each minute.</p>`;
  document.getElementById('wise-actions').classList.remove('hidden');
  document.getElementById('wise-decide').classList.add('hidden');
  document.getElementById('btn-wise-next').disabled = false;
  document.getElementById('btn-declare').disabled = false;
  document.getElementById('wise-log').innerHTML = '';

  if (lvl === 0) {
    document.getElementById('wise-hint').innerHTML =
      `💡 <strong>Tutorial:</strong> When YOU visit (Spokesman), if the glass is UP, flip it down + count. If DOWN, do nothing. Declare when count = ${n - 1}.`;
  } else if (lvl === 1) {
    document.getElementById('wise-hint').innerHTML = `💡 The strategy still works. Just keep counting!`;
  } else {
    document.getElementById('wise-hint').innerHTML = `💡 The Classic. Patience is key — this can take a while.`;
  }
  showScreen('wise-game');
  if (lvl === 0 && progress.wise[0] === 0) setTimeout(() => openWalkthrough('wise'), 350);
}

function setGlass(up, animate) {
  const g = document.getElementById('wise-glass');
  wiseState.glassUp = up;
  if (animate) {
    g.classList.remove('flipping');
    void g.offsetWidth;
    g.classList.add('flipping');
  }
  g.className = 'glass-emoji' + (up ? ' up' : '');
  if (animate) g.classList.add('flipping');
  document.getElementById('wise-glass-label').textContent = up ? 'upside-down' : 'bottom-down';
}

function wiseLog(html) {
  const log = document.getElementById('wise-log');
  const e = document.createElement('div');
  e.className = 'log-entry';
  e.innerHTML = html;
  log.appendChild(e);
  log.scrollTop = log.scrollHeight;
  while (log.children.length > 100) log.removeChild(log.firstChild);
}

function wiseNext() {
  if (wiseState.awaiting || wiseState.declared) return;
  wiseState.day++;
  document.getElementById('wise-day').textContent = wiseState.day;
  const idx = Math.floor(Math.random() * wiseState.n);
  wiseState.men[idx].called = true;

  if (idx === 0) {
    // Spokesman — that's the player!
    wiseState.awaiting = true;
    document.getElementById('wise-visitor').innerHTML =
      `<p class="visitor-text">⏰ Minute ${wiseState.day} — <span class="visitor-spotlight visitor-spokesman">🎩 YOU (Spokesman)</span> are called!</p>`;
    const stateText = wiseState.glassUp ? 'UP' : 'DOWN';
    document.getElementById('wise-decide-state').textContent = stateText;
    document.getElementById('wise-actions').classList.add('hidden');
    document.getElementById('wise-decide').classList.remove('hidden');
  } else {
    // Other wise man — auto-resolve following the strategy
    const m = wiseState.men[idx];
    let action;
    if (!wiseState.glassUp && !m.flipped) {
      m.flipped = true;
      setGlass(true, true);
      action = '<span class="action">flipped the glass UP (first time)</span>';
    } else {
      action = '<span class="action">did nothing</span>';
    }
    document.getElementById('wise-visitor').innerHTML =
      `<p class="visitor-text">⏰ Min ${wiseState.day} — <span class="visitor-spotlight">👤 Wise Man #${idx}</span> visits.<br>Glass is now <strong>${wiseState.glassUp ? 'UP' : 'DOWN'}</strong>.</p>`;
    wiseLog(`<span class="who">Min ${wiseState.day}: #${idx}</span> — ${action}.`);
  }
}

function wiseAction(action) {
  if (!wiseState.awaiting) return;
  wiseState.awaiting = false;
  document.getElementById('wise-decide').classList.add('hidden');
  document.getElementById('wise-actions').classList.remove('hidden');

  const correctAction = wiseState.glassUp ? 'flip' : 'skip';
  const playerCorrect = action === correctAction;

  if (action === 'flip' && wiseState.glassUp) {
    setGlass(false, true);
    wiseState.count++;
    document.getElementById('wise-count').textContent = wiseState.count;
    wiseLog(`<span class="who you">Min ${wiseState.day}: 🎩 YOU</span> — flipped DOWN, count = ${wiseState.count}.`);
  } else if (action === 'flip' && !wiseState.glassUp) {
    // wrong move — but allow it
    setGlass(true, true);
    wiseLog(`<span class="who you">Min ${wiseState.day}: 🎩 YOU</span> — ⚠️ flipped UP (shouldn't!). Strategy broken!`);
    wiseState.strategyBroken = true;
  } else if (action === 'skip' && wiseState.glassUp) {
    wiseLog(`<span class="who you">Min ${wiseState.day}: 🎩 YOU</span> — ⚠️ skipped while UP (missed a count!). Strategy broken!`);
    wiseState.strategyBroken = true;
  } else {
    wiseLog(`<span class="who you">Min ${wiseState.day}: 🎩 YOU</span> — correctly skipped.`);
  }
  document.getElementById('wise-visitor').innerHTML =
    `<p class="visitor-text">${playerCorrect ? '✅ Good choice.' : '⚠️ Hmm.'} Glass is now <strong>${wiseState.glassUp ? 'UP' : 'DOWN'}</strong>. Press NEXT VISIT to continue.</p>`;
}

function wiseDeclare() {
  if (wiseState.declared) return;
  wiseState.declared = true;
  const allCalled = wiseState.men.every(m => m.called);
  const correctCount = wiseState.count >= wiseState.n - 1;
  // True success: all called
  const success = allCalled;

  let stars = 0;
  if (success) {
    if (!wiseState.strategyBroken && wiseState.count === wiseState.n - 1) stars = 3;
    else if (wiseState.count >= wiseState.n - 1) stars = 2;
    else stars = 1;
    awardStars(stars);
  }

  let body;
  if (success) {
    body = `🎩 You declared on day <strong>${wiseState.day}</strong> with count = ${wiseState.count}.<br>` +
      `All ${wiseState.n} wise men had indeed been called → <strong>EVERYONE LIVES! 🎉</strong><br><br>` +
      (wiseState.strategyBroken ? '⚠️ But you broke the strategy along the way (lost a star).' :
       stars === 3 ? '🏆 <strong>FLAWLESS run.</strong>' : 'Good work!');
  } else {
    body = `💀 You declared too early! Only ${wiseState.men.filter(m => m.called).length} of ${wiseState.n} wise men had been called.<br><br>` +
      `<em>The sultan executes everyone. Restart and wait until your count reaches ${wiseState.n - 1}.</em>`;
  }
  showResult(stars, success ? '🎉 EVERYONE GOES FREE!' : '💀 PREMATURE!', body);
}

// ============================================================
// WALKTHROUGH SYSTEM
// ============================================================
let walkState = { puzzle: null, step: 0, steps: [] };

function openWalkthrough(puzzle) {
  walkState.puzzle = puzzle;
  walkState.step = 0;
  walkState.steps = WALKTHROUGHS[puzzle];
  document.getElementById('walk-puzzle').textContent =
    puzzle === 'coin' ? '🪙 COIN PILES' : puzzle === 'bags' ? '🍎 BAG DETECTIVE' : '🍷 THE SPOKESMAN';
  document.getElementById('walk-modal').classList.remove('hidden');
  renderWalkStep();
}

function closeWalkthrough() {
  document.getElementById('walk-modal').classList.add('hidden');
}

function walkStep(delta) {
  const next = walkState.step + delta;
  if (next < 0 || next >= walkState.steps.length) {
    if (next >= walkState.steps.length) { closeWalkthrough(); return; }
    return;
  }
  walkState.step = next;
  renderWalkStep();
}

function renderWalkStep() {
  const stp = walkState.steps[walkState.step];
  document.getElementById('walk-step-count').textContent =
    `Step ${walkState.step + 1} of ${walkState.steps.length}`;
  document.getElementById('walk-text').innerHTML = stp.text;
  document.getElementById('walk-visual').innerHTML = stp.visual;
  document.getElementById('walk-back').disabled = walkState.step === 0;
  const nextBtn = document.getElementById('walk-next');
  nextBtn.textContent = walkState.step === walkState.steps.length - 1 ? '✓ Got it!' : 'Next →';
}

// ---- Helper builders for walkthrough visuals ----

function coinHtml(state, opts = {}) {
  // state: 'heads' | 'tails' | 'hidden'
  const cls = ['walk-coin'];
  if (state === 'heads') cls.push('heads');
  else if (state === 'tails') cls.push('tails');
  else cls.push('hidden-state');
  if (opts.pileA) cls.push('in-pile-a');
  if (opts.flip) cls.push('flip-anim');
  const letter = state === 'heads' ? 'H' : state === 'tails' ? 'T' : '?';
  return `<div class="${cls.join(' ')}">${letter}</div>`;
}

function coinsRow(states, opts = {}) {
  return `<div class="walk-coins-row">${states.map((s, i) =>
    coinHtml(s, opts.pileMask && opts.pileMask[i] ? { pileA: true, flip: opts.flip } : { flip: opts.flip })
  ).join('')}</div>`;
}

function pilesView(pileA, pileB, opts = {}) {
  const aHeads = pileA.filter(s => s === 'heads').length;
  const bHeads = pileB.filter(s => s === 'heads').length;
  return `<div class="walk-piles">
    <div class="walk-pile-box pile-a">
      <div class="walk-pile-title">📦 Pile A</div>
      <div class="walk-pile-coins">${pileA.map(s => coinHtml(s)).join('') || '<em style="color:#999">empty</em>'}</div>
      ${opts.showCounts ? `<div style="margin-top:8px;color:#ffd96a;font-weight:700">${aHeads} heads</div>` : ''}
    </div>
    <div class="walk-pile-box">
      <div class="walk-pile-title">📦 Pile B</div>
      <div class="walk-pile-coins">${pileB.map(s => coinHtml(s)).join('') || '<em style="color:#999">empty</em>'}</div>
      ${opts.showCounts ? `<div style="margin-top:8px;color:#ffd96a;font-weight:700">${bHeads} heads</div>` : ''}
    </div>
  </div>`;
}

function bagHtml(label, opts = {}) {
  const cls = ['walk-bag'];
  if (opts.active) cls.push('active');
  if (opts.solved) cls.push('solved');
  return `<div class="${cls.join(' ')}">
    <div class="walk-bag-icon">🛍️</div>
    <div class="walk-bag-label">${label}</div>
    ${opts.truth ? `<span class="walk-bag-truth">→ ${opts.truth}</span>` : ''}
    ${opts.fruit ? `<span class="walk-bag-fruit">${opts.fruit}</span>` : ''}
  </div>`;
}

function bagsRow(bags) {
  return `<div class="walk-bags">${bags.map(b => bagHtml(b.label, b)).join('')}</div>`;
}

function personHtml(opts = {}) {
  const cls = ['walk-person'];
  if (opts.spoke) cls.push('spoke');
  if (opts.flipped) cls.push('flipped');
  if (opts.active) cls.push('active');
  return `<div class="${cls.join(' ')}" data-tag="${opts.tag || ''}">${opts.label || ''}</div>`;
}

// ---- COIN WALKTHROUGH STEPS ----
const COIN_WALK = [
  {
    visual: `<div style="text-align:center;font-size:0.95rem">${coinsRow(['heads', 'tails', 'tails', 'tails'])}</div>`,
    text: `Imagine <strong>4 coins</strong> on the floor. <strong>1 is heads-up</strong> (gold H), and 3 are tails-up (silver T). Easy to see for now.`,
  },
  {
    visual: coinsRow(['hidden', 'hidden', 'hidden', 'hidden']),
    text: `Now you put on a <strong>blindfold</strong>. You can't tell which coin is which — they all look the same. But you DO know: exactly <strong>1 of the 4 is heads</strong>.`,
  },
  {
    visual: pilesView(['hidden'], ['hidden', 'hidden', 'hidden']),
    text: `🎩 <strong>The trick:</strong> since there's <strong>1 heads</strong>, you pick <strong>1 coin</strong> (any coin!) and put it in Pile A. The other 3 stay as Pile B. <em>You don't know which coin you picked — that's okay!</em>`,
  },
  {
    visual: pilesView(['hidden'], ['hidden', 'hidden', 'hidden']) +
      `<div style="margin-top:10px;color:#ffd96a;font-weight:700">🔄 Now FLIP your one coin!</div>`,
    text: `Now <strong>flip every coin in Pile A</strong>. If it was heads, it becomes tails. If it was tails, it becomes heads. <em>You still don't know what it is — but that doesn't matter.</em>`,
  },
  {
    visual: `<div style="margin-bottom:8px;color:#80deea;font-weight:700">💡 Let's check all 4 possible scenarios for which coin you picked:</div>` +
      `<div class="walk-scenarios">
        <div class="walk-scenario success">
          <div class="walk-scenario-label">You picked the HEADS coin</div>
          <div class="walk-scenario-coins"><div class="walk-scenario-coin tails">T</div></div>
          <div style="font-size:0.7rem;color:#aaa">after flip</div>
          <div class="walk-scenario-result">Pile A: 0 heads · Pile B: 0 heads ✅</div>
        </div>
        <div class="walk-scenario success">
          <div class="walk-scenario-label">You picked a TAILS coin</div>
          <div class="walk-scenario-coins"><div class="walk-scenario-coin heads">H</div></div>
          <div style="font-size:0.7rem;color:#aaa">after flip</div>
          <div class="walk-scenario-result">Pile A: 1 head · Pile B: 1 head ✅</div>
        </div>
      </div>`,
    text: `Either way → <strong>Pile A heads = Pile B heads</strong>. It works <em>no matter which coin you happen to pick!</em>`,
  },
  {
    visual: `<div class="walk-math">
      <div>Pile A picks <span class="var">k</span> of the heads. (k = 0 or 1)</div>
      <div>So Pile B has <span class="var">1 − k</span> heads (1 is the total).</div>
      <div>&nbsp;</div>
      <div>🔄 Flip Pile A:</div>
      <div>&nbsp;&nbsp;heads → tails (so k heads vanish)</div>
      <div>&nbsp;&nbsp;tails → heads (the <span class="var">1−k</span> tails become heads)</div>
      <div>&nbsp;</div>
      <div class="eq">→ Pile A: <span class="var">1−k</span> heads</div>
      <div class="eq">→ Pile B: <span class="var">1−k</span> heads</div>
      <div class="eq">✅ EQUAL — always!</div>
    </div>`,
    text: `Here's the math. The <strong>k cancels out</strong> when you flip. That's the symmetry magic!`,
  },
  {
    visual: `<div style="text-align:center;font-size:1.05rem;line-height:1.7">
      🎯 The general rule:<br>
      <strong>Pick H coins → flip them all → done.</strong><br>
      <span style="color:#80deea">(H = the number of heads you were told.)</span>
    </div>`,
    text: `Same trick works for <strong>any</strong> size: 10 coins / 3 heads → pick 3, flip them. 1000 coins / 20 heads → pick 20, flip them. Now go try it!`,
  },
];

// ---- BAGS WALKTHROUGH STEPS ----
const BAGS_WALK = [
  {
    visual: bagsRow([
      { label: 'APPLES' }, { label: 'ORANGES' }, { label: 'MIX' }
    ]),
    text: `Three bags. One has <strong>apples</strong>, one has <strong>oranges</strong>, one has a <strong>mix</strong> — but <strong style="color:#ff5252">every label is WRONG</strong>.`,
  },
  {
    visual: bagsRow([
      { label: 'APPLES' }, { label: 'ORANGES' }, { label: 'MIX', active: true }
    ]),
    text: `🔑 The <strong>"MIX"</strong> bag is the special one. Its label is wrong → so the bag is <strong>NOT mix</strong>. It must be <strong>pure apples</strong> or <strong>pure oranges</strong>.`,
  },
  {
    visual: bagsRow([
      { label: 'APPLES' }, { label: 'ORANGES' }, { label: 'MIX', active: true, fruit: '🍎' }
    ]),
    text: `Pick one fruit from the <strong>"MIX"</strong> bag. Say you get an 🍎 apple. <strong>Boom!</strong> That bag is pure apples (it can't be mixed, and it's not labeled correctly).`,
  },
  {
    visual: bagsRow([
      { label: 'APPLES', active: true }, { label: 'ORANGES' }, { label: 'MIX', solved: true, truth: 'apples 🍎' }
    ]),
    text: `Now use elimination. The bag labeled <strong>"ORANGES"</strong> can't be oranges (wrong label) and can't be apples (taken). So it must be the <strong>MIX</strong>.`,
  },
  {
    visual: bagsRow([
      { label: 'APPLES', solved: true, truth: 'oranges 🍊' },
      { label: 'ORANGES', solved: true, truth: 'mix 🍇' },
      { label: 'MIX', solved: true, truth: 'apples 🍎' }
    ]),
    text: `Last one — bag labeled <strong>"APPLES"</strong> must be <strong>oranges</strong> by elimination. <strong style="color:#76ff03">Solved in ONE pick! 🎉</strong>`,
  },
  {
    visual: `<div style="text-align:center;color:#80deea;line-height:1.7">
      🪞 If you'd picked from <strong>"APPLES"</strong> or <strong>"ORANGES"</strong> first, you'd only get partial info — those choices are <em>symmetric</em>.<br><br>
      🎯 <strong>"MIX"</strong> is the <em>asymmetric</em> bag — its wrong label is uniquely informative.
    </div>`,
    text: `That's the symmetry trick: always pick from the bag whose label is special. Now go try it yourself!`,
  },
];

// ---- WISE-MEN WALKTHROUGH STEPS ----
function walkPeopleRow(state) {
  // state: array of 4 men. 0 = spokesman.
  // each: { active?, flipped? }
  return `<div class="walk-people-row">
    ${state.map((m, i) => personHtml({
      spoke: i === 0, flipped: m.flipped, active: m.active,
      label: i === 0 ? '★' : '',
      tag: i === 0 ? 'YOU' : `#${i}`,
    })).join('')}
  </div>`;
}
function walkGlass(up, count, target) {
  return `<div class="walk-glass-row">
    <span class="walk-glass${up ? ' up' : ''}">🍷</span>
    <span class="walk-count-badge">Count: ${count} / ${target}</span>
  </div>`;
}

const WISE_WALK = [
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(false, 0, 3)}
      ${walkPeopleRow([{}, {}, {}, {}])}
    </div>`,
    text: `<strong>4 wise men</strong>: YOU (the gold ★ <strong>Spokesman</strong>) plus 3 others. A glass starts <strong>bottom-down</strong>.`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(false, 0, 3)}
      ${walkPeopleRow([{}, {}, {}, {}])}
      <div style="color:#80deea;font-size:0.9rem;text-align:center">
        Each of the <strong>3 others</strong>: "First time I see glass DOWN, flip it UP. After that, never touch."
      </div>
    </div>`,
    text: `The 3 regular wise men share <strong>one rule</strong>. They're <em>symmetric</em> — interchangeable.`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(false, 0, 3)}
      ${walkPeopleRow([{ active: true }, {}, {}, {}])}
      <div style="color:#ffd96a;font-size:0.9rem;text-align:center">
        YOU (Spokesman): "When I see glass UP, flip it DOWN, count +1."
      </div>
    </div>`,
    text: `You're the <strong>asymmetric</strong> one — the only counter. Your goal: count to <strong>3</strong> (= number of others).`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(true, 0, 3)}
      ${walkPeopleRow([{}, { active: true, flipped: true }, {}, {}])}
      <div style="color:#76ff03;font-size:0.85rem;text-align:center">Min 1: #1 visits. Glass was DOWN → flips it UP.</div>
    </div>`,
    text: `Suppose <strong>#1</strong> visits first. Glass is down, so they flip it up (first time). Glass: <strong>UP</strong>.`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(false, 1, 3)}
      ${walkPeopleRow([{ active: true }, { flipped: true }, {}, {}])}
      <div style="color:#ffd96a;font-size:0.85rem;text-align:center">Min 2: YOU visit. Glass is UP → flip down, count +1.</div>
    </div>`,
    text: `Then <strong>YOU</strong> visit. Glass is up → flip it down, count = <strong>1</strong>. (Now you know <em>at least 1 other person</em> has been called.)`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(false, 1, 3)}
      ${walkPeopleRow([{}, { active: true, flipped: true }, {}, {}])}
      <div style="color:#aaa;font-size:0.85rem;text-align:center">Min 3: #1 visits AGAIN. Already flipped → does nothing.</div>
    </div>`,
    text: `If <strong>#1</strong> comes back, they remember they already flipped → <em>don't touch the glass.</em>`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(true, 1, 3)}
      ${walkPeopleRow([{}, { flipped: true }, {}, { active: true, flipped: true }])}
      <div style="color:#76ff03;font-size:0.85rem;text-align:center">Min 4: #3 visits. Glass DOWN → flips UP (first time).</div>
    </div>`,
    text: `Eventually <strong>#3</strong> visits for the first time → flips glass up.`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(true, 2, 3)}
      ${walkPeopleRow([{}, { flipped: true }, {}, { flipped: true }])}
      <div style="color:#ffd96a;font-size:0.9rem;text-align:center">…lots of visits later… Spokesman count = 2</div>
    </div>`,
    text: `Over many minutes, the count grows by 1 each time a new regular flips the glass up and you flip it back down.`,
  },
  {
    visual: `<div class="walk-wise-area">
      ${walkGlass(false, 3, 3)}
      ${walkPeopleRow([{ active: true }, { flipped: true }, { flipped: true }, { flipped: true }])}
      <div style="color:#76ff03;font-size:1rem;font-weight:800;text-align:center">🎉 Count = 3! ALL 3 others have flipped → all have visited.</div>
    </div>`,
    text: `When count = <strong>3</strong>, all 3 regulars have flipped exactly once — so all 3 have been called at least once. Plus YOU were just called (you're flipping right now). <strong>All 4 have visited → DECLARE!</strong>`,
  },
  {
    visual: `<div style="text-align:center;color:#80deea;line-height:1.8">
      Same logic works for any n.<br>
      <strong style="color:#ffd96a">Count to n−1, then declare.</strong><br><br>
      <em>For 50 men: count to 49.</em>
    </div>`,
    text: `That's the strategy. <strong>Watch carefully when YOU are called</strong> — flip only if the glass is up. Now try it!`,
  },
];

const WALKTHROUGHS = {
  coin: COIN_WALK,
  bags: BAGS_WALK,
  wise: WISE_WALK,
};

// ============================================================
// INIT
// ============================================================
function init() {
  loadProgress();
  goHub();
}
init();
