// ============================================================
// Mini Akinator for Kids — script.js
// ============================================================

// --- Stage unlock codes (lightly obfuscated with btoa) ---
const CODES = {
  1: atob('Q1gxNTI='),       // CX152
  2: atob('Rk9VUlBJ'),       // FOURPI
  3: atob('VFJFRVM='),       // TREES
  4: atob('MTcyOA=='),       // 1728
};

// --- Default characters ---
const DEFAULT_CHARACTERS = [
  { name: 'Pikachu',     emoji: '\u26A1', fromVideoGame: true,  fromMovie: true,  hasMagic: true,  wearsMask: false, canFly: false, isHuman: false, isVillain: false, isRobot: false, hasWeapon: false, isFast: true,  isStrong: false, isFunny: false, isScary: false, isSmall: true,  livesInWater: false, hasTeam: false },
  { name: 'Elsa',        emoji: '\u2744\uFE0F', fromVideoGame: false, fromMovie: true,  hasMagic: true,  wearsMask: false, canFly: false, isHuman: true, isVillain: false, isRobot: false, hasWeapon: false, isFast: false, isStrong: false, isFunny: false, isScary: false, isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'Mario',       emoji: '\uD83C\uDF44', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: false, canFly: false, isHuman: true, isVillain: false, isRobot: false, hasWeapon: false, isFast: false, isStrong: false, isFunny: true,  isScary: false, isSmall: true,  livesInWater: false, hasTeam: true },
  { name: 'Batman',      emoji: '\uD83E\uDD87', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: true,  canFly: true,  isHuman: true, isVillain: false, isRobot: false, hasWeapon: true, isFast: false, isStrong: true,  isFunny: false, isScary: true,  isSmall: false, livesInWater: false, hasTeam: true },
  { name: 'Spider-Man',  emoji: '\uD83D\uDD77\uFE0F', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: true,  canFly: false, isHuman: true, isVillain: false, isRobot: false, hasWeapon: false, isFast: true,  isStrong: true,  isFunny: true,  isScary: false, isSmall: false, livesInWater: false, hasTeam: true },
  { name: 'Sonic',       emoji: '\uD83D\uDCA8', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: false, canFly: false, isHuman: false, isVillain: false, isRobot: false, hasWeapon: false, isFast: true,  isStrong: false, isFunny: true,  isScary: false, isSmall: true,  livesInWater: false, hasTeam: true },
  { name: 'Harry Potter',emoji: '\uD83E\uDE84', fromVideoGame: true,  fromMovie: true,  hasMagic: true,  wearsMask: false, canFly: true,  isHuman: true, isVillain: false, isRobot: false, hasWeapon: true, isFast: false, isStrong: false, isFunny: false, isScary: false, isSmall: false, livesInWater: false, hasTeam: true },
  { name: 'Iron Man',    emoji: '\uD83E\uDD16', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: true,  canFly: true,  isHuman: true, isVillain: false, isRobot: false, hasWeapon: true, isFast: true,  isStrong: true,  isFunny: true,  isScary: false, isSmall: false, livesInWater: false, hasTeam: true },
  // Portal
  { name: 'Chell',       emoji: '\uD83D\uDD2B', fromVideoGame: true,  fromMovie: false, hasMagic: false, wearsMask: false, canFly: false, isHuman: true, isVillain: false, isRobot: false, hasWeapon: true, isFast: false, isStrong: false, isFunny: false, isScary: false, isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'GLaDOS',      emoji: '\uD83E\uDD16', fromVideoGame: true,  fromMovie: false, hasMagic: false, wearsMask: false, canFly: false, isHuman: false, isVillain: true, isRobot: true, hasWeapon: false, isFast: false, isStrong: false, isFunny: true,  isScary: true,  isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'Wheatley',    emoji: '\uD83D\uDCA1', fromVideoGame: true,  fromMovie: false, hasMagic: false, wearsMask: false, canFly: true,  isHuman: false, isVillain: true, isRobot: true, hasWeapon: false, isFast: false, isStrong: false, isFunny: true,  isScary: false, isSmall: true,  livesInWater: false, hasTeam: false },
  // Minecraft
  { name: 'Steve',       emoji: '\u26CF\uFE0F', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: false, canFly: false, isHuman: true, isVillain: false, isRobot: false, hasWeapon: true, isFast: false, isStrong: true,  isFunny: false, isScary: false, isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'Creeper',     emoji: '\uD83D\uDCA5', fromVideoGame: true,  fromMovie: true,  hasMagic: false, wearsMask: false, canFly: false, isHuman: false, isVillain: true, isRobot: false, hasWeapon: false, isFast: false, isStrong: false, isFunny: false, isScary: true,  isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'Enderman',    emoji: '\uD83D\uDC7E', fromVideoGame: true,  fromMovie: true,  hasMagic: true,  wearsMask: false, canFly: false, isHuman: false, isVillain: true, isRobot: false, hasWeapon: false, isFast: true,  isStrong: true,  isFunny: false, isScary: true,  isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'Ender Dragon',emoji: '\uD83D\uDC32', fromVideoGame: true,  fromMovie: false, hasMagic: true,  wearsMask: false, canFly: true,  isHuman: false, isVillain: true, isRobot: false, hasWeapon: false, isFast: true,  isStrong: true,  isFunny: false, isScary: true,  isSmall: false, livesInWater: false, hasTeam: false },
  { name: 'Wither',      emoji: '\uD83D\uDC80', fromVideoGame: true,  fromMovie: false, hasMagic: true,  wearsMask: false, canFly: true,  isHuman: false, isVillain: true, isRobot: false, hasWeapon: true, isFast: false, isStrong: true,  isFunny: false, isScary: true,  isSmall: false, livesInWater: false, hasTeam: false },
  // Geometry Dash
  { name: 'Cube (GD)',   emoji: '\uD83D\uDFE8', fromVideoGame: true,  fromMovie: false, hasMagic: false, wearsMask: false, canFly: false, isHuman: false, isVillain: false, isRobot: false, hasWeapon: false, isFast: true,  isStrong: false, isFunny: false, isScary: false, isSmall: true,  livesInWater: false, hasTeam: false },
  { name: 'Ship (GD)',   emoji: '\uD83D\uDE80', fromVideoGame: true,  fromMovie: false, hasMagic: false, wearsMask: false, canFly: true,  isHuman: false, isVillain: false, isRobot: false, hasWeapon: false, isFast: true,  isStrong: false, isFunny: false, isScary: false, isSmall: true,  livesInWater: false, hasTeam: false },
  { name: 'RobTop',      emoji: '\uD83C\uDFAE', fromVideoGame: true,  fromMovie: false, hasMagic: false, wearsMask: false, canFly: false, isHuman: true, isVillain: false, isRobot: false, hasWeapon: false, isFast: false, isStrong: false, isFunny: true,  isScary: false, isSmall: false, livesInWater: false, hasTeam: false },
];

const TRAIT_LABELS = {
  fromVideoGame: 'Video Game',
  fromMovie: 'Movie',
  hasMagic: 'Magic',
  wearsMask: 'Mask',
  canFly: 'Can Fly',
  isHuman: 'Human',
  isVillain: 'Villain',
  isRobot: 'Robot',
  hasWeapon: 'Weapon',
  isFast: 'Fast',
  isStrong: 'Strong',
  isFunny: 'Funny',
  isScary: 'Scary',
  isSmall: 'Small',
  livesInWater: 'Water',
  hasTeam: 'Team',
};

const QUESTIONS = [
  { key: 'fromVideoGame', label: 'Is the character from a video game?' },
  { key: 'fromMovie',     label: 'Is the character from a movie or TV show?' },
  { key: 'hasMagic',      label: 'Can the character use magic or special powers?' },
  { key: 'wearsMask',     label: 'Does the character wear a mask or helmet?' },
  { key: 'canFly',        label: 'Can the character fly?' },
  { key: 'isHuman',       label: 'Is the character a human person?' },
  { key: 'isVillain',     label: 'Is the character a villain or bad guy?' },
  { key: 'isRobot',       label: 'Is the character a robot or machine?' },
  { key: 'hasWeapon',     label: 'Does the character use a weapon or tool to fight?' },
  { key: 'isFast',        label: 'Is the character known for being super fast?' },
  { key: 'isStrong',      label: 'Is the character super strong?' },
  { key: 'isFunny',       label: 'Is the character funny or makes jokes?' },
  { key: 'isScary',       label: 'Is the character scary or creepy?' },
  { key: 'isSmall',       label: 'Is the character small or tiny?' },
  { key: 'livesInWater',  label: 'Does the character live in or near water?' },
  { key: 'hasTeam',       label: 'Does the character work with a team or group?' },
];

// --- State ---
let characters = [];
let stageUnlocked = { 1: false, 2: false, 3: false, 4: false };
let currentStage = 1;
let editingIndex = -1; // -1 = adding new

// Game state
let gameRemaining = [];
let gameQuestionsUsed = [];

// ============================================================
// INIT
// ============================================================
function init() {
  loadCharacters();
  loadUnlockState();
  renderCharacterGrid();
  renderQuestionButtons();
  updateTabs();
  showStage(1);

  // Enter key for code inputs
  for (let i = 1; i <= 4; i++) {
    const input = document.getElementById(`code-${i}`);
    if (input) {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') tryUnlock(i);
      });
    }
  }
}

// ============================================================
// PERSISTENCE
// ============================================================
function loadCharacters() {
  const currentVersion = DEFAULT_CHARACTERS.length + '-' + DEFAULT_CHARACTERS.map(c => c.name).join(',');
  const savedVersion = localStorage.getItem('akinator-char-version');
  if (savedVersion === currentVersion) {
    const saved = localStorage.getItem('akinator-characters');
    if (saved) {
      try { characters = JSON.parse(saved); return; } catch (e) { /* fall through */ }
    }
  }
  characters = JSON.parse(JSON.stringify(DEFAULT_CHARACTERS));
  localStorage.setItem('akinator-char-version', currentVersion);
  saveCharacters();
}

function saveCharacters() {
  localStorage.setItem('akinator-characters', JSON.stringify(characters));
}

function loadUnlockState() {
  const saved = localStorage.getItem('akinator-unlocked');
  if (saved) {
    try { stageUnlocked = JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  for (let i = 1; i <= 4; i++) {
    if (stageUnlocked[i]) {
      const overlay = document.getElementById(`lock-${i}`);
      if (overlay) overlay.classList.add('unlocked');
    }
  }
}

function saveUnlockState() {
  localStorage.setItem('akinator-unlocked', JSON.stringify(stageUnlocked));
}

// ============================================================
// CODE GATING
// ============================================================
function tryUnlock(stage) {
  const input = document.getElementById(`code-${stage}`);
  const error = document.getElementById(`error-${stage}`);
  const val = input.value.trim().toUpperCase();

  if (val === CODES[stage].toUpperCase()) {
    stageUnlocked[stage] = true;
    saveUnlockState();
    const overlay = document.getElementById(`lock-${stage}`);
    overlay.classList.add('unlocked');
    error.textContent = '';
    updateTabs();

    // Auto-start game when stage 3 unlocked
    if (stage === 3) startGame();
  } else {
    error.textContent = 'Wrong code! Try again.';
    input.value = '';
    input.focus();
  }
}

// ============================================================
// TABS & NAVIGATION
// ============================================================
function updateTabs() {
  document.querySelectorAll('.tab').forEach(tab => {
    const stage = parseInt(tab.dataset.stage);
    tab.classList.remove('active', 'unlocked', 'locked');
    if (stage === currentStage) {
      tab.classList.add('active');
    } else if (stageUnlocked[stage]) {
      tab.classList.add('unlocked');
    } else {
      tab.classList.add('locked');
    }
    // Update text
    if (stageUnlocked[stage]) {
      tab.textContent = tab.textContent.replace('🔒 ', '');
    }
  });
}

function showStage(stage) {
  currentStage = stage;
  document.querySelectorAll('.stage').forEach(s => s.classList.add('hidden'));
  document.getElementById(`stage-${stage}`).classList.remove('hidden');
  updateTabs();

  if (stage === 2 && stageUnlocked[2]) renderQuestionButtons();
  if (stage === 3 && stageUnlocked[3] && gameRemaining.length === 0) startGame();
}

// Tab click handler
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    const stage = parseInt(tab.dataset.stage);
    showStage(stage);
  });
});

// ============================================================
// STAGE 1: CHARACTER EXPLORER
// ============================================================
function renderCharacterGrid() {
  const grid = document.getElementById('character-grid');
  grid.innerHTML = '';

  characters.forEach((char, idx) => {
    const card = document.createElement('div');
    card.className = 'char-card';
    card.innerHTML = `
      <button class="btn-edit-char" onclick="openEditCharacter(${idx})" title="Edit">✏️</button>
      <div class="char-emoji">${char.emoji || '❓'}</div>
      <div class="char-name">${escapeHtml(char.name)}</div>
      <div class="char-traits">
        ${Object.keys(TRAIT_LABELS).map(key =>
          `<span class="trait-tag ${char[key] ? 'yes' : 'no'}">${char[key] ? '✓' : '✗'} ${TRAIT_LABELS[key]}</span>`
        ).join('')}
      </div>
    `;
    grid.appendChild(card);
  });
}

function openEditCharacter(idx) {
  editingIndex = idx;
  const char = characters[idx];
  document.getElementById('modal-title').textContent = 'Edit Character';
  document.getElementById('modal-name').value = char.name;
  document.getElementById('modal-emoji').value = char.emoji || '';
  document.getElementById('btn-modal-delete').style.display = 'block';
  renderModalTraits(char);
  document.getElementById('modal-overlay').style.display = 'flex';
}

function openAddCharacter() {
  editingIndex = -1;
  document.getElementById('modal-title').textContent = 'Add Character';
  document.getElementById('modal-name').value = '';
  document.getElementById('modal-emoji').value = '';
  document.getElementById('btn-modal-delete').style.display = 'none';
  const blank = {};
  Object.keys(TRAIT_LABELS).forEach(k => blank[k] = false);
  renderModalTraits(blank);
  document.getElementById('modal-overlay').style.display = 'flex';
}

function renderModalTraits(char) {
  const container = document.getElementById('modal-traits');
  container.innerHTML = '';
  Object.keys(TRAIT_LABELS).forEach(key => {
    const div = document.createElement('div');
    div.className = 'trait-toggle';
    div.innerHTML = `
      <label>${TRAIT_LABELS[key]}</label>
      <label class="toggle-switch">
        <input type="checkbox" data-trait="${key}" ${char[key] ? 'checked' : ''}>
        <span class="toggle-slider"></span>
      </label>
    `;
    container.appendChild(div);
  });
}

function saveCharacter() {
  const name = document.getElementById('modal-name').value.trim();
  if (!name) { alert('Please enter a name!'); return; }

  const emoji = document.getElementById('modal-emoji').value.trim();
  const char = { name, emoji: emoji || '❓' };
  document.querySelectorAll('#modal-traits input[type="checkbox"]').forEach(cb => {
    char[cb.dataset.trait] = cb.checked;
  });

  if (editingIndex === -1) {
    characters.push(char);
  } else {
    characters[editingIndex] = char;
  }

  saveCharacters();
  renderCharacterGrid();
  closeModal();
}

function deleteCharacter() {
  if (editingIndex === -1) return;
  if (!confirm(`Delete ${characters[editingIndex].name}?`)) return;
  characters.splice(editingIndex, 1);
  saveCharacters();
  renderCharacterGrid();
  closeModal();
}

function closeModal() {
  document.getElementById('modal-overlay').style.display = 'none';
}

// Close modal on overlay click
document.getElementById('modal-overlay').addEventListener('click', (e) => {
  if (e.target === e.currentTarget) closeModal();
});

// ============================================================
// STAGE 2: QUESTION EXPLORER
// ============================================================
function renderQuestionButtons() {
  const container = document.getElementById('question-buttons');
  container.innerHTML = '';
  QUESTIONS.forEach((q, idx) => {
    const btn = document.createElement('button');
    btn.textContent = q.label;
    btn.addEventListener('click', () => {
      container.querySelectorAll('button').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      showSplit(q);
    });
    container.appendChild(btn);
  });
}

function showSplit(question) {
  const yesGroup = characters.filter(c => c[question.key]);
  const noGroup = characters.filter(c => !c[question.key]);
  const diff = Math.abs(yesGroup.length - noGroup.length);

  document.getElementById('split-view').style.display = 'block';
  document.getElementById('current-question-label').textContent = question.label;

  // Split score
  const scoreBox = document.getElementById('split-score-box');
  let scoreText, scoreClass;
  if (diff === 0) {
    scoreText = `⭐ Excellent split! (${yesGroup.length} vs ${noGroup.length})`;
    scoreClass = 'excellent';
  } else if (diff <= 2) {
    scoreText = `👍 Okay split (${yesGroup.length} vs ${noGroup.length})`;
    scoreClass = 'okay';
  } else {
    scoreText = `😬 Poor split (${yesGroup.length} vs ${noGroup.length})`;
    scoreClass = 'poor';
  }
  scoreBox.textContent = scoreText;
  scoreBox.className = 'split-score-box ' + scoreClass;

  // Yes / No lists
  document.getElementById('yes-list').innerHTML = yesGroup.map(c =>
    `<span class="split-char">${c.emoji || ''} ${escapeHtml(c.name)}</span>`
  ).join('');
  document.getElementById('no-list').innerHTML = noGroup.map(c =>
    `<span class="split-char">${c.emoji || ''} ${escapeHtml(c.name)}</span>`
  ).join('');
}

// ============================================================
// STAGE 3: DECISION TREE GAME
// ============================================================
function startGame() {
  gameRemaining = [...characters];
  gameQuestionsUsed = [];
  document.getElementById('game-result').style.display = 'none';
  document.getElementById('btn-restart').style.display = 'none';
  renderGameState();
  askNextGameQuestion();
}

function renderGameState() {
  const container = document.getElementById('game-remaining');
  container.innerHTML = `<p style="text-align:center;width:100%;margin-bottom:8px;font-weight:600;color:#4a148c;">Characters left: ${gameRemaining.length}</p>` +
    gameRemaining.map(c =>
      `<span class="game-char">${c.emoji || ''} ${escapeHtml(c.name)}</span>`
    ).join('');
}

function askNextGameQuestion() {
  const area = document.getElementById('game-question-area');

  // Find unused questions that actually split
  const available = QUESTIONS.filter(q => {
    if (gameQuestionsUsed.includes(q.key)) return false;
    const yesCount = gameRemaining.filter(c => c[q.key]).length;
    return yesCount > 0 && yesCount < gameRemaining.length;
  });

  if (gameRemaining.length === 1) {
    showGameResult(gameRemaining[0]);
    return;
  }
  if (gameRemaining.length === 0) {
    showGameResult(null);
    return;
  }
  if (available.length === 0) {
    showGameResult(gameRemaining.length === 1 ? gameRemaining[0] : 'multiple');
    return;
  }

  // Pick the best available question (most balanced split)
  available.sort((a, b) => {
    const diffA = Math.abs(gameRemaining.filter(c => c[a.key]).length - gameRemaining.filter(c => !c[a.key]).length);
    const diffB = Math.abs(gameRemaining.filter(c => c[b.key]).length - gameRemaining.filter(c => !c[b.key]).length);
    return diffA - diffB;
  });
  const question = available[0];

  area.innerHTML = `
    <h3>${question.label}</h3>
    <div class="game-btns">
      <button class="btn-yes" onclick="answerGame('${question.key}', true)">✅ YES</button>
      <button class="btn-no" onclick="answerGame('${question.key}', false)">❌ NO</button>
    </div>
  `;
}

function answerGame(key, answer) {
  gameQuestionsUsed.push(key);
  gameRemaining = gameRemaining.filter(c => c[key] === answer);
  renderGameState();
  askNextGameQuestion();
}

function showGameResult(result) {
  const area = document.getElementById('game-question-area');
  area.innerHTML = '';
  const resultDiv = document.getElementById('game-result');
  resultDiv.style.display = 'block';
  document.getElementById('btn-restart').style.display = 'block';

  if (result === null) {
    resultDiv.innerHTML = `
      <div class="result-emoji">🤔</div>
      <h2>No match!</h2>
      <p>No character matches your answers. Try again!</p>
    `;
  } else if (result === 'multiple') {
    resultDiv.innerHTML = `
      <div class="result-emoji">🤷</div>
      <h2>More than one left!</h2>
      <p>We ran out of questions. The remaining characters are:</p>
      <p style="font-weight:700;margin-top:8px;">${gameRemaining.map(c => `${c.emoji || ''} ${escapeHtml(c.name)}`).join(', ')}</p>
    `;
  } else {
    resultDiv.innerHTML = `
      <div class="result-emoji">${result.emoji || '🎉'}</div>
      <h2>It's ${escapeHtml(result.name)}!</h2>
      <p>We guessed it! 🎉</p>
    `;
  }
}

// ============================================================
// STAGE 4: BEST QUESTION HELPER
// ============================================================
function findBestQuestion() {
  const scores = QUESTIONS.map(q => {
    const yesCount = characters.filter(c => c[q.key]).length;
    const noCount = characters.length - yesCount;
    const diff = Math.abs(yesCount - noCount);
    return { ...q, yesCount, noCount, diff };
  });

  scores.sort((a, b) => a.diff - b.diff);

  const best = scores[0];
  const maxDiff = characters.length; // worst possible

  document.getElementById('best-result').innerHTML = `
    <h3>🏆 Best Question:</h3>
    <p style="font-size:1.2rem;font-weight:700;color:#ff6f00;margin-top:8px;">"${best.label}"</p>
    <p style="margin-top:4px;">Splits into ${best.yesCount} YES and ${best.noCount} NO — ${best.diff === 0 ? 'a perfect split!' : `difference of ${best.diff}`}</p>
  `;

  const container = document.getElementById('all-scores');
  container.innerHTML = '<h3 style="text-align:center;margin-bottom:12px;color:#4a148c;">All Questions Ranked</h3>';

  scores.forEach((q, idx) => {
    const pct = maxDiff === 0 ? 100 : Math.round(((maxDiff - q.diff) / maxDiff) * 100);
    let barClass = 'poor';
    if (q.diff === 0) barClass = 'excellent';
    else if (q.diff <= 2) barClass = 'okay';

    const row = document.createElement('div');
    row.className = 'score-row' + (idx === 0 ? ' best' : '');
    row.innerHTML = `
      <span class="score-label">${q.label}</span>
      <div class="score-bar-wrap"><div class="score-bar ${barClass}" style="width:${pct}%"></div></div>
      <span class="score-value">${q.yesCount} vs ${q.noCount}</span>
    `;
    container.appendChild(row);
  });
}

// ============================================================
// UTILITY
// ============================================================
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = str;
  return div.innerHTML;
}

// ============================================================
// START
// ============================================================
init();
