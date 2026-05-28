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
  if (stage === 6) renderPuzzles();
  if (stage === 7) initBuilder();
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
// PUZZLES
// ============================================================
function clueTable(pairs, head1, head2) {
  return `<table class="clue-table"><thead><tr><th>${head1}</th><th>${head2}</th></tr></thead><tbody>` +
    pairs.map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('') + '</tbody></table>';
}
function glyphLegend(pairs) {
  return `<div class="glyph-legend">` +
    pairs.map(([g, s]) => `<div class="glyph-pair"><span class="gp-glyph">${g}</span><span class="gp-sound">${s}</span></div>`).join('') +
    `</div>`;
}

const PUZZLE_SECTIONS = [
  {
    title: 'Secret Scripts',
    blurb: 'A writing system maps symbols to sounds (or letters). Use the key to read the hidden message.',
    puzzles: [
      {
        id: 'p1', diff: 'easy',
        title: 'The Glyph Key',
        rules: glyphLegend([['✦','m'],['◆','o'],['●','n'],['▲','s'],['⬡','u']]),
        task: `Using the key above, decode this word: <span class="target">✦◆◆●</span>`,
        answers: ['moon'],
        hint: 'Replace each glyph with its sound, left to right: ✦=m, ◆=o, ◆=o, ●=n.',
        explain: '✦◆◆● → m-o-o-n → <strong>moon</strong>. A glyph-to-sound mapping like this is exactly how real alphabets work.'
      },
      {
        id: 'p2', diff: 'medium',
        title: 'Shifted Cipher',
        rules: `<p style="margin:0;color:#d4c6c6">Every letter has been shifted <strong>forward by one</strong> in the alphabet, so the original <code>a</code> was written as <code>b</code>, <code>b</code> as <code>c</code>, and so on.</p>`,
        task: `Decode the coded word: <span class="target">dpx</span>`,
        answers: ['cow'],
        hint: 'Shift each letter BACK by one: d→c, p→o, x→w.',
        explain: 'd→c, p→o, x→w → <strong>cow</strong>. This is a "Caesar cipher" — Julius Caesar really used shift-ciphers to hide military messages.'
      },
    ]
  },
  {
    title: 'Rosetta Stone',
    blurb: 'You\'re given sentences in a mystery language with English translations. Figure out which word means what, then translate something new.',
    puzzles: [
      {
        id: 'p3', diff: 'easy',
        title: 'Birds and Fish',
        rules: clueTable([['tomi kasu','red bird'],['vana pelu','blue fish'],['grun kasu','green bird']], 'Mystery language', 'English'),
        task: `Translate into English: <span class="target">tomi pelu</span>`,
        answers: ['red fish', 'a red fish'],
        hint: 'From "tomi kasu = red bird" and "vana pelu = blue fish", work out which word is the color and which is the animal.',
        explain: 'tomi = red, kasu = bird, vana = blue, pelu = fish, grun = green. So <strong>tomi pelu = red fish</strong>.'
      },
      {
        id: 'p4', diff: 'medium',
        title: 'Say It Yourself',
        rules: clueTable([['tomi kasu','red bird'],['vana pelu','blue fish'],['grun kasu','green bird']], 'Mystery language', 'English'),
        task: `Now go the other way. How do you say <span class="target">blue bird</span> in the mystery language?`,
        answers: ['vana kasu'],
        hint: 'You know vana = blue (from "vana pelu") and kasu = bird (from "tomi kasu" / "grun kasu").',
        explain: 'blue = vana, bird = kasu → <strong>vana kasu</strong>. The adjective comes first, just like in the examples.'
      },
    ]
  },
  {
    title: 'Word Machines',
    blurb: 'In agglutinative languages, words are built by stacking pieces (morphemes). Spot each piece, then assemble or take apart a word.',
    puzzles: [
      {
        id: 'p5', diff: 'medium',
        title: 'Building Houses',
        rules: clueTable([['ev','house'],['evler','houses'],['evim','my house']], 'Word', 'Meaning'),
        task: `Decode this stacked word: <span class="target">evlerim</span>`,
        answers: ['my houses', 'houses my'],
        hint: '-ler means "plural" (more than one), and -im means "my". The word is ev + ler + im.',
        explain: 'ev (house) + ler (plural) + im (my) = <strong>my houses</strong>. This is real Turkish! Each ending adds one piece of meaning.'
      },
      {
        id: 'p6', diff: 'medium',
        title: 'Verb Stacks',
        rules: clueTable([['jala','jump'],['jalak','jumped'],['jalamu','we jump']], 'Word', 'Meaning'),
        task: `Decode: <span class="target">jalakmu</span>`,
        answers: ['we jumped', 'jumped we'],
        hint: '-k marks the past tense and -mu means "we". The word is jala + k + mu.',
        explain: 'jala (jump) + k (past) + mu (we) = <strong>we jumped</strong>. The endings stack in order: root, then tense, then subject.'
      },
    ]
  },
  {
    title: 'Counting Systems',
    blurb: 'Languages build numbers in clever ways. Crack how this one counts.',
    puzzles: [
      {
        id: 'p7', diff: 'medium',
        title: 'Crack the Count',
        rules: clueTable([['su','1'],['ne','2'],['vi','3'],['tan','10'],['tan su','11'],['ne tan','20'],['ne tan vi','23']], 'Words', 'Number'),
        task: `What number is <span class="target">vi tan ne</span>?`,
        answers: ['32'],
        hint: 'A digit BEFORE "tan" multiplies it (ne tan = 2×10 = 20). A digit AFTER "tan" adds on (tan su = 10+1 = 11).',
        explain: 'vi tan = 3×10 = 30, then + ne (2) = <strong>32</strong>. Many languages, like Welsh and French, build big numbers from "tens" and "ones" exactly like this.'
      },
      {
        id: 'p8', diff: 'hard',
        title: 'Count It Back',
        rules: clueTable([['su','1'],['ne','2'],['vi','3'],['tan','10'],['tan su','11'],['ne tan','20'],['ne tan vi','23']], 'Words', 'Number'),
        task: `Going the other way: how do you write <span class="target">31</span> in this system?`,
        answers: ['vi tan su'],
        hint: '31 = (3 × 10) + 1. Put the multiplier before "tan" and the ones after.',
        explain: '3×10 + 1 → vi tan su → <strong>vi tan su</strong>.'
      },
    ]
  },
  {
    title: 'Word Order',
    blurb: 'Different languages arrange Subject, Object, and Verb differently. Match the pattern.',
    puzzles: [
      {
        id: 'p9', diff: 'easy',
        title: 'Verb Goes Last',
        rules: clueTable([['fox hen eat','the fox eats the hen'],['cat fish eat','the cat eats the fish']], 'Mystery language', 'English'),
        task: `This language puts the verb LAST (Subject-Object-Verb). How would it say <span class="target">the hen eats the fox</span>?`,
        answers: ['hen fox eat'],
        hint: 'Subject first (hen), then object (fox), then the verb (eat).',
        explain: 'Subject (hen) + Object (fox) + Verb (eat) → <strong>hen fox eat</strong>. This SOV order is used by Japanese, Korean, Turkish, and Latin.'
      },
    ]
  },
  {
    title: 'Olympiad Challenge',
    blurb: 'Real competition-level puzzles, adapted from the kind posed at NACLO (the North American Computational Linguistics Olympiad). Each uses authentic patterns from real languages. Take your time.',
    puzzles: [
      {
        id: 'h1', diff: 'hard',
        title: 'Turkish — Vowel Harmony',
        rules: clueTable([
          ['ev → evler', 'house → houses'],
          ['göl → göller', 'lake → lakes'],
          ['diş → dişler', 'tooth → teeth'],
          ['yol → yollar', 'road → roads'],
          ['kuş → kuşlar', 'bird → birds'],
          ['kız → kızlar', 'girl → girls'],
        ], 'Singular → Plural', 'Meaning'),
        task: `The plural ending is sometimes <strong>-ler</strong> and sometimes <strong>-lar</strong>. Work out the rule, then give the plural of <span class="target">köy</span> (village).`,
        answers: ['köyler', 'koyler'],
        hint: 'Sort the roots into two groups by which ending they take. Look at the vowel in each root. Some vowels (e, i, ö, ü) are made at the FRONT of the mouth; others (a, ı, o, u) at the BACK. The ending must "harmonize" with the root vowel.',
        explain: 'This is Turkish <strong>vowel harmony</strong>. Front vowels (e, i, ö, ü) take <strong>-ler</strong>; back vowels (a, ı, o, u) take <strong>-lar</strong>. "köy" contains ö (a front vowel), so the plural is <strong>köyler</strong>.'
      },
      {
        id: 'h2', diff: 'hard',
        title: 'Yoruba — Counting by Subtraction',
        rules: clueTable([
          ['ban le da', '12'],
          ['ban le fe', '14'],
          ['kor le ti', '23'],
          ['kor din da', '18'],
          ['kor din ti', '17'],
        ], 'Words', 'Number'),
        task: `Two of these words are operators, not numbers. Crack the system, then decode <span class="target">kor din fe</span>.`,
        answers: ['16'],
        hint: '"le" and "din" aren\'t numbers — they\'re operations. From "ban le da = 12" you can tell ban = 10 and le = "plus". From "kor din da = 18" you get kor = 20 and din = "minus". Now find fe.',
        explain: 'ban = 10, kor = 20, le = "+", din = "−", da = 2, ti = 3, fe = 4. So kor din fe = 20 − 4 = <strong>16</strong>. Yoruba genuinely builds many numbers by subtraction from the next round number.'
      },
      {
        id: 'h3', diff: 'hard',
        title: 'Swahili — Verb Assembly',
        rules: clueTable([
          ['nilikuona', 'I saw you'],
          ['ulinipenda', 'you loved me'],
          ['nitakupenda', 'I will love you'],
          ['alikuona', 'she saw you'],
        ], 'Swahili', 'English'),
        task: `Each verb is built from four stacked pieces: subject + tense + object + verb-root. Assemble the single word for <span class="target">she will love me</span>.`,
        answers: ['atanipenda'],
        hint: 'Subjects: ni = I, u = you, a = she. Tenses: li = past, ta = future. Objects: ku = you, ni = me. Roots: ona = see, penda = love. Stack them in that order with no spaces.',
        explain: 'she (a) + future (ta) + me (ni) + love (penda) → <strong>atanipenda</strong>. This is exactly how real Swahili verbs work — one word carries the whole sentence.'
      },
    ]
  },
];

// Special visual puzzle: Venn / Set Match
const VENN = {
  circles: { A: 'FRUIT', B: 'RED', C: 'SWEET' },
  // region number -> set membership
  regions: {
    1: 'FRUIT only',
    2: 'FRUIT + RED',
    3: 'RED only',
    4: 'FRUIT + SWEET',
    5: 'FRUIT + RED + SWEET',
    6: 'RED + SWEET',
    7: 'SWEET only',
  },
  items: [
    { name: 'lemon', note: 'a sour yellow fruit', region: 1 },
    { name: 'cranberry', note: 'a tart red fruit', region: 2 },
    { name: 'fire engine', note: 'red, not a fruit, not sweet', region: 3 },
    { name: 'ripe banana', note: 'a sweet yellow fruit', region: 4 },
    { name: 'strawberry', note: 'a sweet red fruit', region: 5 },
    { name: 'red gummy bear', note: 'a sweet red candy', region: 6 },
    { name: 'honey', note: 'sweet, not red, not a fruit', region: 7 },
  ],
};

function vennSvg() {
  // viewBox 0 0 520 400; A top-left, B top-right, C bottom
  return `<svg viewBox="0 0 520 400" class="venn-svg" xmlns="http://www.w3.org/2000/svg">
    <circle cx="190" cy="165" r="125" fill="rgba(229,56,59,0.18)" stroke="#ff5a5f" stroke-width="2"/>
    <circle cx="330" cy="165" r="125" fill="rgba(232,162,74,0.16)" stroke="#e8a24a" stroke-width="2"/>
    <circle cx="260" cy="275" r="125" fill="rgba(63,185,80,0.14)" stroke="#7ee787" stroke-width="2"/>
    <text x="95" y="60" class="venn-circle-label" fill="#ff5a5f">FRUIT</text>
    <text x="395" y="60" class="venn-circle-label" fill="#e8a24a">RED</text>
    <text x="260" y="395" class="venn-circle-label" fill="#7ee787">SWEET</text>
    <text x="120" y="160" class="venn-num">1</text>
    <text x="260" y="115" class="venn-num">2</text>
    <text x="400" y="160" class="venn-num">3</text>
    <text x="195" y="255" class="venn-num">4</text>
    <text x="260" y="195" class="venn-num">5</text>
    <text x="325" y="255" class="venn-num">6</text>
    <text x="260" y="335" class="venn-num">7</text>
  </svg>`;
}

function vennSectionHtml() {
  const itemRows = VENN.items.map((it, i) => `
    <div class="venn-item-row">
      <span class="venn-item-name">${it.name} <span class="venn-item-note">(${it.note})</span></span>
      <select class="venn-select" id="venn-sel-${i}">
        <option value="">region…</option>
        ${[1,2,3,4,5,6,7].map(n => `<option value="${n}">${n}</option>`).join('')}
      </select>
    </div>`).join('');
  return `
    <div class="puzzle-section-title">Set Match (Venn)</div>
    <div class="puzzle-section-blurb">A circle for "small dog" sits entirely inside "dog"; "red things" only overlaps "fruit". Each numbered region is a different combination of the three labelled circles. Match every item to the region it belongs in.</div>
    <div class="puzzle-card" id="card-venn">
      <div class="puzzle-head"><span class="puzzle-title">Where Does It Belong?</span><span class="puzzle-diff hard">hard</span></div>
      <div class="venn-wrap">${vennSvg()}</div>
      <div class="venn-items">${itemRows}</div>
      <div class="puzzle-input-row" style="margin-top:12px">
        <button class="btn-check" onclick="checkVenn()">Check all</button>
        <button class="btn-mini" onclick="revealVenn()">Reveal</button>
      </div>
      <div class="puzzle-feedback" id="fb-venn"></div>
    </div>`;
}

function checkVenn() {
  let correct = 0;
  VENN.items.forEach((it, i) => {
    const sel = document.getElementById(`venn-sel-${i}`);
    const val = parseInt(sel.value);
    if (val === it.region) { correct++; sel.style.borderColor = '#3fb950'; }
    else sel.style.borderColor = val ? '#e5383b' : '#5a1f22';
  });
  const fb = document.getElementById('fb-venn');
  if (correct === VENN.items.length) {
    fb.innerHTML = 'All correct! You read the Venn diagram perfectly.';
    fb.className = 'puzzle-feedback correct';
    document.getElementById('card-venn').classList.add('solved');
  } else {
    fb.innerHTML = `${correct} / ${VENN.items.length} correct. The green boxes are right — rethink the red ones.`;
    fb.className = 'puzzle-feedback incorrect';
    document.getElementById('card-venn').classList.remove('solved');
  }
}
function revealVenn() {
  VENN.items.forEach((it, i) => {
    const sel = document.getElementById(`venn-sel-${i}`);
    sel.value = String(it.region);
    sel.style.borderColor = '#3fb950';
  });
  const fb = document.getElementById('fb-venn');
  fb.innerHTML = 'Region 5 (the very center) is FRUIT + RED + SWEET — the strawberry. A region inside only one circle means the item has just that one property.';
  fb.className = 'puzzle-feedback correct';
}

let puzzlesRendered = false;
function renderPuzzles() {
  const container = document.getElementById('puzzle-sections');
  if (!container || puzzlesRendered) return;
  puzzlesRendered = true;
  let html = '';
  PUZZLE_SECTIONS.forEach(sec => {
    html += `<div class="puzzle-section-title">${sec.title}</div>`;
    html += `<div class="puzzle-section-blurb">${sec.blurb}</div>`;
    sec.puzzles.forEach(p => {
      html += `
        <div class="puzzle-card" id="card-${p.id}">
          <div class="puzzle-head">
            <span class="puzzle-title">${p.title}</span>
            <span class="puzzle-diff ${p.diff}">${p.diff}</span>
          </div>
          <div class="puzzle-rules">${p.rules}</div>
          <div class="puzzle-task">${p.task}</div>
          <div class="puzzle-input-row">
            <input type="text" class="puzzle-answer" id="ans-${p.id}" placeholder="your answer..."
              onkeydown="if(event.key==='Enter') checkPuzzle('${p.id}')">
            <button class="btn-check" onclick="checkPuzzle('${p.id}')">Check</button>
            <button class="btn-mini" onclick="hintPuzzle('${p.id}')">Hint</button>
            <button class="btn-mini" onclick="revealPuzzle('${p.id}')">Reveal</button>
          </div>
          <div class="puzzle-feedback" id="fb-${p.id}"></div>
        </div>`;
    });
  });
  html += vennSectionHtml();
  container.innerHTML = html;
}

function findPuzzle(id) {
  for (const sec of PUZZLE_SECTIONS) for (const p of sec.puzzles) if (p.id === id) return p;
  return null;
}
function normalizeAns(s) {
  return s.toLowerCase().trim().replace(/[.,!?;:]/g, '').replace(/\s+/g, ' ');
}
function checkPuzzle(id) {
  const p = findPuzzle(id);
  const input = document.getElementById(`ans-${id}`);
  const fb = document.getElementById(`fb-${id}`);
  const card = document.getElementById(`card-${id}`);
  const val = normalizeAns(input.value);
  if (!val) { fb.textContent = 'Type your answer first.'; fb.className = 'puzzle-feedback incorrect'; return; }
  const ok = p.answers.some(a => normalizeAns(a) === val);
  if (ok) {
    input.classList.remove('incorrect'); input.classList.add('correct');
    card.classList.add('solved');
    fb.innerHTML = 'Correct! Well decoded.';
    fb.className = 'puzzle-feedback correct';
    showExplain(id);
  } else {
    input.classList.remove('correct'); input.classList.add('incorrect');
    fb.textContent = 'Not quite — study the clues again, or tap Hint.';
    fb.className = 'puzzle-feedback incorrect';
  }
}
function hintPuzzle(id) {
  const p = findPuzzle(id);
  const card = document.getElementById(`card-${id}`);
  if (card.querySelector('.puzzle-hint')) return;
  const div = document.createElement('div');
  div.className = 'puzzle-hint';
  div.innerHTML = 'Hint: ' + p.hint;
  card.appendChild(div);
}
function revealPuzzle(id) {
  const p = findPuzzle(id);
  const input = document.getElementById(`ans-${id}`);
  input.value = p.answers[0];
  input.classList.add('correct');
  showExplain(id);
}
function showExplain(id) {
  const p = findPuzzle(id);
  const card = document.getElementById(`card-${id}`);
  if (card.querySelector('.puzzle-explain')) return;
  const div = document.createElement('div');
  div.className = 'puzzle-explain';
  div.innerHTML = 'Answer: <strong>' + p.answers[0] + '</strong>. ' + p.explain;
  card.appendChild(div);
}

// ============================================================
// INIT
// ============================================================
function init() {
  renderMC('practice-1', Q1);
  buildSentence();
  generateWords();
  renderGrammarRules();
  renderPuzzles();
  showStage(1);
}
init();
