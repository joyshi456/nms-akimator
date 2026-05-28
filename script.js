// ============================================================
// The Language Lab — script.js
// ============================================================

// === Speech ===
function speak(text) {
  if (!window.speechSynthesis) return;
  try {
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.75;
    speechSynthesis.speak(u);
  } catch (e) { /* ignore */ }
}

// === Sound data ===
const CONSONANTS = {
  'Lips (labial)': ['p', 'b', 'm', 'w', 'f', 'v'],
  'Tongue tip (coronal)': ['t', 'd', 'n', 's', 'z', 'l', 'r'],
  'Back of mouth (dorsal)': ['k', 'g', 'h'],
  'Blends &amp; clusters': ['sh', 'ch', 'th', 'j', 'ng'],
};
const ALL_CONSONANTS = Object.values(CONSONANTS).flat();
const VOWELS = ['a', 'e', 'i', 'o', 'u', 'ai', 'ee', 'oo'];

// === NAV ===
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => showStage(parseInt(tab.dataset.stage)));
});
function showStage(stage) {
  document.querySelectorAll('.stage').forEach(s => s.classList.add('hidden'));
  document.getElementById(`stage-${stage}`).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => t.classList.toggle('active', parseInt(t.dataset.stage) === stage));
  window.scrollTo(0, 0);
  if (stage === 2) renderSoundMap();
  if (stage === 5) renderGrammarRules();
  if (stage === 6) initBuilder();
}

// === helpers ===
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function randInt(a, b) { return a + Math.floor(Math.random() * (b - a + 1)); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }

// ============================================================
// STAGE 1: PRACTICE
// ============================================================
const Q1 = [
  {
    q: 'Which layer of language concerns the actual speech sounds and how they combine?',
    options: [{v:'A',t:'Syntax'},{v:'B',t:'Phonology'},{v:'C',t:'Semantics'}],
    correct: 'B',
    explain: 'Phonology studies the sound system — the lowest level of the language stack.'
  },
  {
    q: 'In "unhappy", the piece "un-" attached to the front is called a…',
    options: [{v:'A',t:'Suffix'},{v:'B',t:'Prefix'},{v:'C',t:'Clause'}],
    correct: 'B',
    explain: 'A prefix attaches before the root. "un-" negates, giving "not happy".'
  },
  {
    q: 'A grammar rule like S → NP VP belongs to which kind of grammar?',
    options: [{v:'A',t:'A formal (rewrite-rule) grammar'},{v:'B',t:'A morphological typology'},{v:'C',t:'A phoneme inventory'}],
    correct: 'A',
    explain: 'Rewrite rules that expand symbols into other symbols define a formal grammar — the basis of the Chomsky hierarchy.'
  },
];

function renderMC(containerId, problems) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.innerHTML = '';
  problems.forEach((prob, idx) => {
    const id = `${containerId}-${idx}`;
    const card = document.createElement('div');
    card.className = 'problem-card';
    card.innerHTML = `
      <div class="problem-text">${prob.q}</div>
      <div class="mc-options" id="opts-${id}">
        ${prob.options.map(o => `<button class="mc-option" data-v="${o.v}">${o.v}) ${o.t}</button>`).join('')}
      </div>
      <div class="mc-feedback" id="fb-${id}"></div>`;
    c.appendChild(card);
    card.querySelectorAll('.mc-option').forEach(btn => {
      btn.addEventListener('click', () => {
        const fb = document.getElementById(`fb-${id}`);
        if (fb.dataset.answered) return;
        fb.dataset.answered = '1';
        const correct = btn.dataset.v === prob.correct;
        card.querySelectorAll('.mc-option').forEach(o => {
          o.style.pointerEvents = 'none';
          if (o.dataset.v === prob.correct) o.classList.add('correct');
          else if (o.dataset.v === btn.dataset.v) o.classList.add('incorrect');
        });
        fb.innerHTML = (correct ? 'Correct. ' : `The answer is ${prob.correct}. `) + `<em>${prob.explain}</em>`;
        fb.className = 'mc-feedback ' + (correct ? 'correct' : 'incorrect');
      });
    });
  });
}

// ============================================================
// STAGE 2: SOUND MAP
// ============================================================
function renderSoundMap() {
  const map = document.getElementById('sound-map');
  if (!map || map.dataset.built) return;
  map.dataset.built = '1';
  let html = '';
  for (const [group, sounds] of Object.entries(CONSONANTS)) {
    html += `<div class="sound-group"><div class="sound-group-title">${group}</div><div class="sound-row">`;
    html += sounds.map(s => `<button class="sound-btn" data-sound="${s}">${s}</button>`).join('');
    html += `</div></div>`;
  }
  html += `<div class="sound-group"><div class="sound-group-title">Vowels</div><div class="sound-row">`;
  html += VOWELS.map(v => `<button class="sound-btn vowel" data-sound="${v}">${v}</button>`).join('');
  html += `</div></div>`;
  map.innerHTML = html;
  map.querySelectorAll('.sound-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const s = btn.dataset.sound;
      const sample = btn.classList.contains('vowel') ? s : s + 'a';
      speak(sample);
      btn.classList.add('playing');
      setTimeout(() => btn.classList.remove('playing'), 500);
    });
  });
}

// ============================================================
// STAGE 3: WORD GENERATOR
// ============================================================
function genSyllable(pattern, cons, vows) {
  return [...pattern].map(ch => ch === 'C' ? pick(cons) : ch === 'V' ? pick(vows) : ch).join('');
}
function genWord(pattern, syls, cons, vows) {
  let w = '';
  for (let i = 0; i < syls; i++) w += genSyllable(pattern, cons, vows);
  return w;
}
function generateWords() {
  const pattern = document.getElementById('gen-pattern').value;
  const syls = parseInt(document.getElementById('gen-syls').value);
  const cons = ['p','t','k','m','n','s','l','r','b','d','g'];
  const vows = ['a','e','i','o','u'];
  const out = document.getElementById('gen-output');
  out.innerHTML = '';
  for (let i = 0; i < 10; i++) {
    const w = genWord(pattern, syls, cons, vows);
    const span = document.createElement('span');
    span.className = 'gen-word';
    span.textContent = w;
    span.title = 'Click to hear it';
    span.addEventListener('click', () => speak(w));
    out.appendChild(span);
  }
}

// ============================================================
// STAGE 4: SENTENCE BUILDER
// ============================================================
function orderWords(order, s, v, o) {
  const map = { S: `<span class="role-s">${s}</span>`, V: `<span class="role-v">${v}</span>`, O: `<span class="role-o">${o}</span>` };
  return [...order].map(ch => map[ch]).join(' ');
}
function buildSentence() {
  const s = document.getElementById('sb-subject').value;
  const v = document.getElementById('sb-verb').value;
  const o = document.getElementById('sb-object').value;
  const order = document.getElementById('sb-order').value;
  document.getElementById('sentence-output').innerHTML = orderWords(order, s, v, o) + ' .';
}

// ============================================================
// STAGE 5: GRAMMAR MACHINE (context-free grammar)
// ============================================================
const CFG = {
  S:  [['NP', 'VP']],
  NP: [['Det', 'Adj', 'N'], ['Det', 'N'], ['Name']],
  VP: [['V', 'NP'], ['V', 'NP', 'PP']],
  PP: [['P', 'NP']],
  Det: [['the'], ['a'], ['my']],
  Adj: [['red'], ['tiny'], ['clever'], ['grumpy'], ['ancient']],
  N:  [['cat'], ['dragon'], ['robot'], ['wizard'], ['comet']],
  Name: [['Soren'], ['Mira'], ['Kael']],
  V:  [['sees'], ['chases'], ['outsmarts'], ['befriends']],
  P:  [['near'], ['behind'], ['under']],
};
const NONTERMINALS = new Set(Object.keys(CFG));

function renderGrammarRules() {
  const el = document.getElementById('grammar-rules');
  if (!el || el.dataset.built) return;
  el.dataset.built = '1';
  let html = '';
  for (const [lhs, rhsList] of Object.entries(CFG)) {
    const rhs = rhsList.map(seq =>
      seq.map(sym => NONTERMINALS.has(sym)
        ? `<span class="gr-nonterm">${sym}</span>`
        : `<span class="gr-term">${sym}</span>`).join(' ')
    ).join(' <span class="gr-arrow">|</span> ');
    html += `<div><span class="gr-nonterm">${lhs}</span> <span class="gr-arrow">→</span> ${rhs}</div>`;
  }
  el.innerHTML = html;
}

function expandSymbol(sym, depth, steps) {
  if (!NONTERMINALS.has(sym)) return [sym];
  if (depth > 12) return []; // safety against runaway recursion
  const choice = pick(CFG[sym]);
  let result = [];
  for (const s of choice) result = result.concat(expandSymbol(s, depth + 1, steps));
  return result;
}

function generateGrammarSentence() {
  renderGrammarRules();
  const words = expandSymbol('S', 0, []);
  const sentence = cap(words.join(' ')) + '.';
  const out = document.getElementById('grammar-output');
  const div = document.createElement('div');
  div.className = 'gen-sentence';
  div.innerHTML = sentence + `<span class="deriv">S → … → ${words.join(' ')}</span>`;
  out.prepend(div);
  while (out.children.length > 8) out.removeChild(out.lastChild);
}
function generateGrammarBatch() {
  for (let i = 0; i < 5; i++) generateGrammarSentence();
}

// ============================================================
// STAGE 6: LANGUAGE BUILDER
// ============================================================
let builderInit = false;
let conlang = null;

const GLYPHS = ['ᚠ','ᚢ','ᚦ','ᚨ','ᚱ','ᚲ','ᚷ','ᚹ','ᚺ','ᚾ','ᛁ','ᛃ','ᛇ','ᛈ','ᛉ','ᛊ','ᛏ','ᛒ','ᛖ','ᛗ','ᛚ','ᛜ','ᛞ','ᛟ','ᛣ','ᛤ','ᛥ','◆','◇','○','●','△','▽','□','◫','⬡','⬢','✦','✧','⟁','⌬'];

const CONCEPTS = [
  ['I', 'pronoun'], ['you', 'pronoun'], ['we', 'pronoun'],
  ['water', 'noun'], ['sun', 'noun'], ['food', 'noun'], ['friend', 'noun'], ['tree', 'noun'], ['star', 'noun'], ['house', 'noun'],
  ['see', 'verb'], ['eat', 'verb'], ['love', 'verb'], ['go', 'verb'], ['make', 'verb'],
  ['big', 'adj'], ['good', 'adj'], ['happy', 'adj'],
];

function initBuilder() {
  if (builderInit) return;
  builderInit = true;
  const cp = document.getElementById('consonant-picker');
  cp.innerHTML = ALL_CONSONANTS.map(c =>
    `<button class="pick-chip${['p','t','k','m','n','s','l','r'].includes(c) ? ' selected' : ''}" data-sound="${c}">${c}</button>`).join('');
  cp.querySelectorAll('.pick-chip').forEach(b => b.addEventListener('click', () => b.classList.toggle('selected')));

  const vp = document.getElementById('vowel-picker');
  vp.innerHTML = VOWELS.map(v =>
    `<button class="pick-chip vowel${['a','e','i','o'].includes(v) ? ' selected' : ''}" data-sound="${v}">${v}</button>`).join('');
  vp.querySelectorAll('.pick-chip').forEach(b => b.addEventListener('click', () => b.classList.toggle('selected')));

  const saved = localStorage.getItem('langlab-conlang');
  if (saved) {
    try { conlang = JSON.parse(saved); restoreBuilderUI(); renderLanguage(); } catch (e) {}
  }
}

function restoreBuilderUI() {
  if (!conlang) return;
  document.getElementById('lang-name').value = conlang.name;
  document.getElementById('lang-pattern').value = conlang.pattern;
  document.getElementById('lang-order').value = conlang.order;
  if (conlang.grammar) document.getElementById('lang-grammar').value = conlang.grammar;
  document.querySelectorAll('#consonant-picker .pick-chip').forEach(b =>
    b.classList.toggle('selected', conlang.consonants.includes(b.dataset.sound)));
  document.querySelectorAll('#vowel-picker .pick-chip').forEach(b =>
    b.classList.toggle('selected', conlang.vowels.includes(b.dataset.sound)));
}

function generateLanguage() {
  const name = (document.getElementById('lang-name').value.trim() || 'Mylang');
  const cons = [...document.querySelectorAll('#consonant-picker .pick-chip.selected')].map(b => b.dataset.sound);
  const vows = [...document.querySelectorAll('#vowel-picker .pick-chip.selected')].map(b => b.dataset.sound);
  const pattern = document.getElementById('lang-pattern').value;
  const order = document.getElementById('lang-order').value;
  const grammar = document.getElementById('lang-grammar').value;

  if (cons.length < 4) { alert('Select at least 4 consonants.'); return; }
  if (vows.length < 2) { alert('Select at least 2 vowels.'); return; }

  const used = new Set();
  const lexicon = {};
  CONCEPTS.forEach(([eng]) => {
    let w, tries = 0;
    do { w = genWord(pattern, randInt(1, 2), cons, vows); tries++; } while (used.has(w) && tries < 50);
    used.add(w); lexicon[eng] = w;
  });

  // Grammar markers (a plural and a past-tense morpheme), distinct from lexicon
  function freshMorpheme(len) {
    let m, tries = 0;
    do { m = genWord('CV', len, cons, vows); tries++; } while (used.has(m) && tries < 50);
    used.add(m); return m;
  }
  const pluralMarker = freshMorpheme(1);
  const pastMarker = freshMorpheme(1);

  const allSounds = [...cons, ...vows];
  const shuffledGlyphs = [...GLYPHS].sort(() => Math.random() - 0.5);
  const script = {};
  allSounds.forEach((s, i) => { script[s] = shuffledGlyphs[i % shuffledGlyphs.length]; });

  conlang = { name, consonants: cons, vowels: vows, pattern, order, grammar, lexicon, pluralMarker, pastMarker, script };
  renderLanguage();
  document.getElementById('lang-result').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Apply grammar: returns the surface form of a word given features
function inflect(word, { plural = false, past = false } = {}) {
  if (!conlang) return word;
  if (conlang.grammar === 'agglutinative') {
    // stack suffixes directly onto the word
    let w = word;
    if (plural) w += conlang.pluralMarker;
    if (past) w += conlang.pastMarker;
    return w;
  } else {
    // isolating: grammar markers are separate words placed after
    let parts = [word];
    if (plural) parts.push(conlang.pluralMarker);
    if (past) parts.push(conlang.pastMarker);
    return parts.join(' ');
  }
}

function renderLanguage() {
  if (!conlang) return;
  document.getElementById('lang-result').classList.remove('hidden');
  document.getElementById('result-lang-name').textContent = conlang.name;
  document.getElementById('result-lang-name-2').textContent = conlang.name;

  // Dictionary
  document.getElementById('lang-dictionary').innerHTML = CONCEPTS.map(([eng]) => {
    const w = conlang.lexicon[eng];
    return `<div class="dict-entry"><span class="dict-english">${eng}</span><span class="dict-conlang">${w}</span><button class="dict-speak" onclick="speak('${w}')" title="Hear it">🔊</button></div>`;
  }).join('');

  // Grammar rules summary
  const isAgg = conlang.grammar === 'agglutinative';
  const exFriendSingular = conlang.lexicon['friend'];
  const exFriendPlural = inflect(exFriendSingular, { plural: true });
  const exSee = conlang.lexicon['see'];
  const exSeePast = inflect(exSee, { past: true });
  document.getElementById('lang-grammar-rules').innerHTML = `
    <div class="gram-rule"><strong>Type:</strong> ${isAgg ? 'Agglutinative — grammar markers attach as suffixes' : 'Isolating — grammar markers are separate words'}</div>
    <div class="gram-rule"><strong>Word order:</strong> ${conlang.order}</div>
    <div class="gram-rule"><strong>Plural</strong> uses the marker "<span class="ex">${conlang.pluralMarker}</span>".<br>
      ${exFriendSingular} (friend) → <span class="ex">${exFriendPlural}</span> (friends)</div>
    <div class="gram-rule"><strong>Past tense</strong> uses the marker "<span class="ex">${conlang.pastMarker}</span>".<br>
      ${exSee} (see) → <span class="ex">${exSeePast}</span> (saw)</div>
  `;

  // Sample sentences
  const samples = [['I','see','sun'],['you','eat','food'],['we','love','friend']];
  document.getElementById('lang-sentences').innerHTML = samples.map(([s,v,o]) => {
    return `<div class="lang-sentence"><span class="ls-conlang">${makeSentence(s,v,o)}</span><span class="ls-english">"${cap(s)} ${v} ${o}"</span></div>`;
  }).join('');

  // Custom dropdowns
  const pronouns = CONCEPTS.filter(([,r]) => r === 'pronoun').map(([e]) => e);
  const verbs = CONCEPTS.filter(([,r]) => r === 'verb').map(([e]) => e);
  const nouns = CONCEPTS.filter(([,r]) => r === 'noun').map(([e]) => e);
  document.getElementById('cs-subject').innerHTML = pronouns.map(p => `<option>${p}</option>`).join('');
  document.getElementById('cs-verb').innerHTML = verbs.map(v => `<option>${v}</option>`).join('');
  document.getElementById('cs-object').innerHTML = nouns.map(n => `<option>${n}</option>`).join('');
  document.getElementById('cs-output').textContent = '';

  // Script
  document.getElementById('lang-script').innerHTML = Object.entries(conlang.script).map(([letter, glyph]) =>
    `<div class="script-glyph-card"><div class="script-glyph">${glyph}</div><div class="script-letter">${letter}</div></div>`).join('');
  document.getElementById('script-input').value = '';
  document.getElementById('script-word-output').textContent = '';

  // Summary
  document.getElementById('lang-summary').innerHTML = `
    <div><strong>Name:</strong> ${conlang.name}</div>
    <div><strong>Consonants (${conlang.consonants.length}):</strong> ${conlang.consonants.join(' ')}</div>
    <div><strong>Vowels (${conlang.vowels.length}):</strong> ${conlang.vowels.join(' ')}</div>
    <div><strong>Syllable structure:</strong> ${conlang.pattern}</div>
    <div><strong>Word order:</strong> ${conlang.order}</div>
    <div><strong>Grammar type:</strong> ${isAgg ? 'Agglutinative' : 'Isolating'}</div>
    <div><strong>Lexicon size:</strong> ${Object.keys(conlang.lexicon).length} roots + 2 grammar markers</div>
    <div><strong>Script glyphs:</strong> ${Object.keys(conlang.script).length}</div>
  `;
  document.getElementById('save-status').textContent = '';
}

function makeSentence(s, v, o, feats = {}) {
  const ws = inflect(conlang.lexicon[s] || s, {});
  const wv = inflect(conlang.lexicon[v] || v, { past: feats.past });
  const wo = inflect(conlang.lexicon[o] || o, { plural: feats.plural });
  const map = { S: ws, V: wv, O: wo };
  return cap([...conlang.order].map(ch => map[ch]).join(' '));
}

function buildCustomSentence() {
  const s = document.getElementById('cs-subject').value;
  const v = document.getElementById('cs-verb').value;
  const o = document.getElementById('cs-object').value;
  const past = document.getElementById('cs-past').checked;
  const plural = document.getElementById('cs-plural').checked;
  const conSentence = makeSentence(s, v, o, { past, plural });
  const engV = past ? v + 'd' : v;
  const engO = plural ? o + 's' : o;
  document.getElementById('cs-output').innerHTML =
    `${conSentence}<div style="font-size:0.8rem;color:#8a7273;font-family:'Segoe UI',sans-serif;margin-top:6px">"${cap(s)} ${engV} ${engO}"</div>`;
  speak(conSentence);
}

function renderScriptWord() {
  const raw = document.getElementById('script-input').value.toLowerCase();
  const out = document.getElementById('script-word-output');
  if (!conlang) return;
  const sounds = Object.keys(conlang.script).sort((a, b) => b.length - a.length);
  let result = '', i = 0;
  while (i < raw.length) {
    let matched = false;
    for (const snd of sounds) {
      if (raw.startsWith(snd, i)) { result += conlang.script[snd] + ' '; i += snd.length; matched = true; break; }
    }
    if (!matched) { result += raw[i] === ' ' ? '  ' : '·'; i++; }
  }
  out.textContent = result;
}

function saveLanguage() {
  if (!conlang) return;
  localStorage.setItem('langlab-conlang', JSON.stringify(conlang));
  document.getElementById('save-status').textContent = 'Saved.';
}

// ============================================================
// INIT
// ============================================================
function init() {
  renderMC('practice-1', Q1);
  buildSentence();
  generateWords();
  renderGrammarRules();
  showStage(1);
}
init();
