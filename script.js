// ============================================================
// The Math of Words — script.js
// ============================================================

// ===== WORD LIST (curated, ~400 words) =====
const WORDS = [
  // common 5-letter (Wordle answer pool)
  'about','above','abuse','actor','adieu','admit','adopt','adult','after','again','agent','agree','ahead','aisle','alarm','album','alert','alike','alive','allow','alone','along','aloud','alpha','altar','amber','among','angel','anger','angle','angry','ankle','annex','apple','apply','arena','argue','arise','armor','aroma','array','arrow','aside','asset','audio','avoid','award','aware','away','awoke','badge','baker','basic','beach','beard','beast','began','begin','bench','bible','black','blade','blame','blank','blast','bleak','blend','bless','blind','block','blood','board','boast','bonus','boost','bored','brain','brand','brave','bread','break','breed','brick','brief','bring','broad','brown','brush','build','built','burnt','buyer','cabin','cable','candy','canoe','cargo','carve','catch','cause','cease','chain','chair','chalk','charm','chart','chase','cheap','check','chest','chief','child','china','chose','civic','civil','claim','class','clean','clear','climb','clock','close','cloth','cloud','clown','coach','coast','cocoa','color','comic','count','court','cover','crack','craft','crane','crash','crazy','cream','crime','crisp','cross','crowd','crown','crude','curse','curve','daddy','daily','dance','death','debit','delay','delta','depth','digit','dimes','dirty','dizzy','dough','dozen','draft','drain','drama','drank','dream','dress','drift','drill','drink','drive','drove','drown','dwarf','eager','eagle','early','earth','eaten','elbow','elder','elite','empty','enemy','enjoy','enter','entry','equal','error','event','every','exact','exist','extra','fable','faint','fairy','faith','false','fancy','fault','favor','feast','fence','fever','fewer','fiber','field','fifty','fight','final','first','fixed','flame','flash','flask','fleet','flesh','flick','flier','float','flock','flood','floor','flour','flush','folly','force','forge','forth','forty','found','frame','fresh','fried','front','frost','fruit','fully','funny','gauge','gazer','genre','ghost','giant','given','glass','glory','glove','goose','grace','grade','grand','grant','grape','graph','grass','grave','great','green','greet','grief','groan','group','grove','grown','guard','guess','guest','guide','gully','habit','happy','harsh','haste','haunt','heard','heart','heavy','hedge','hello','hence','hover','human','humor','hurry','image','imply','index','inner','input','irony','issue','jelly','jewel','jolly','judge','juice','kayak','knack','knead','kneel','knelt','knife','knock','known','label','labor','large','laser','later','laugh','layer','learn','least','leave','legal','lemon','level','light','liked','liver','local','logic','loose','lover','lucky','lunch','lying','madam','magic','major','maker','manor','maple','march','match','maybe','mayor','meant','medal','media','melon','mercy','merit','metal','meter','might','minor','minus','mixed','model','money','month','moose','moral','motor','mound','mount','mouse','mouth','movie','mover','music','naive','naked','named','nasty','naval','needy','nerve','never','newly','nicer','night','ninth','noble','noise','north','nosey','noted','notes','novel','nurse','occur','ocean','octet','offer','often','olive','onion','opera','orbit','order','organ','other','ought','outer','owner','paint','panel','panic','paper','parry','party','paste','patch','pause','peace','peach','pearl','penny','perch','peril','phase','phone','photo','piano','pilot','pixel','pizza','place','plain','plane','plant','plate','plaza','plead','plumb','plump','poach','point','poker','polar','porch','poser','pouch','pound','power','prank','press','price','pride','prime','print','prior','prize','probe','prone','proof','proud','prove','prune','psalm','pulse','punch','queen','quest','queue','quick','quiet','quill','quilt','quirk','quite','quote','rabbi','radar','radio','raise','rajah','rally','ranch','range','rapid','ratio','razor','reach','ready','realm','rebar','rebel','rebut','rebid','recap','reset','rider','ridge','rifle','right','rigid','rinse','ripen','risen','river','roast','robin','robot','rocky','rodeo','rogue','roman','roomy','roost','rotor','rough','round','route','royal','rural','salad','sandy','sauce','scale','scarf','scare','scene','scent','scoop','scope','score','scorn','scout','scram','scrap','scrub','seedy','seize','sense','seven','sever','shade','shake','shaky','shame','shape','share','shark','sharp','sheen','sheep','sheer','sheet','shelf','shell','shift','shine','shiny','shirt','shock','shoot','shore','short','shout','shove','shown','shrub','shrug','sigma','silly','since','sixty','skate','skill','skirt','skull','slept','slice','slide','slimy','sling','sloop','small','smart','smell','smile','smoke','snail','snake','sneak','snore','snowy','sober','solar','solid','solve','sonar','sorry','sound','south','space','spare','spark','speak','speed','spell','spend','spent','spice','spicy','spike','spine','spirit','spite','splat','split','spoil','spoke','spool','spoon','sport','spree','spray','staff','stage','stair','stake','stale','stalk','stamp','stand','stare','start','state','steel','steep','steer','stern','stiff','still','sting','stink','stock','stole','stomp','stone','stony','store','storm','story','strap','straw','strip','stuck','study','stuff','stump','style','sugar','suite','sunny','super','swamp','swarm','sweat','sweep','sweet','swept','swift','swing','swims','sworn','table','taken','taker','tasty','taunt','teach','tease','tepee','terry','testy','thank','theft','their','theme','there','these','thick','thief','thigh','thing','think','third','thong','those','threw','throw','thumb','tiger','tight','timer','tired','title','toast','today','token','tooth','topic','torch','total','touch','tough','tower','toxic','trade','train','trait','trash','tread','treat','trend','trial','tribe','trick','tried','tries','trout','truck','truly','trump','trust','truth','twist','tying','ultra','uncle','under','undid','union','unite','unity','until','unzip','upset','urban','usage','usual','utter','vague','valid','valor','value','vapor','vault','vegan','venom','venue','verge','verse','vicar','video','vigil','viola','vital','vivid','vocal','vodka','vogue','voice','voted','vowel','wagon','waist','waive','wakes','watch','water','weary','weave','wedge','weigh','weird','whale','wharf','wheat','wheel','where','which','while','whine','whirl','whisk','white','whole','whose','widen','widow','width','wield','wince','windy','wiped','wiper','wired','wires','wiser','witch','woman','woods','world','worry','worse','worst','worth','would','wound','woven','wreck','wrist','write','wrong','wrote','yacht','yeast','yield','young','youth','zebra','zesty','zoned',
  // shorter & longer extras
  'a','i','am','an','as','at','be','by','do','go','he','hi','if','in','is','it','me','my','no','of','on','or','so','to','up','us','we','cat','dog','god','tac','rat','tar','art','sun','tip','pit','red','der','noon','mom','dad','pop','eye','wow','sos','sis','oxo','oho','mow','toot','poop','peep','deed','noon','solos','tenet','rotor','minim','radar',
  'ant','bat','car','egg','fox','hat','ice','jet','kid','log','net','owl','pen','queen','rip','sit','tea','umbra','van','win','xray','yes','zoo',
  'apricot','banana','cherry','dragon','elephant','flower','garden','helicopter','iguana','jungle','kangaroo','library','mountain','number','octopus','penguin','question','rainbow','spider','telephone','umbrella','volcano','window','xylophone','yellow','zipper',
  'palindrome','symmetric','alphabet','vowel','consonant','almost','biopsy','cousins','dialog','effort','fluffy','gummy','happily','imply','jumbo','knight','lovely','mostly','nightly','onion','pretty','quirky','rusty','simply','tongue','useful','virtual','whoosh','xerox','yummy','zenith'
];

// Sanitize: lowercase, alphabetic only, dedupe
const _wordSet = new Set();
const ALL_WORDS = [];
for (const w of WORDS) {
  const c = String(w).toLowerCase().replace(/[^a-z]/g, '');
  if (c && !_wordSet.has(c)) { _wordSet.add(c); ALL_WORDS.push(c); }
}
// Ensure SOREN is in the pool
if (!_wordSet.has('soren')) { ALL_WORDS.push('soren'); _wordSet.add('soren'); }
const FIVE_LETTER_WORDS = ALL_WORDS.filter(w => w.length === 5);

// Weighted target pool: SOREN appears 50x, every other 5-letter word appears once.
const WORDLE_TARGET_POOL = (() => {
  const pool = [...FIVE_LETTER_WORDS];
  for (let i = 0; i < 49; i++) pool.push('soren'); // 1 base + 49 extras = 50
  return pool;
})();

// ============================================================
// NAVIGATION
// ============================================================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => showStage(parseInt(tab.dataset.stage)));
});
function showStage(stage) {
  document.querySelectorAll('.stage').forEach(s => s.classList.add('hidden'));
  document.getElementById(`stage-${stage}`).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.stage) === stage);
  });
  window.scrollTo(0, 0);
  if (stage === 1) analyzeWord();
  if (stage === 2) {
    checkPalindrome(); showVCPattern(); showDistance(); showAlphabetic(); showRotation();
  }
  if (stage === 3) renderToolbox(), renderChallengeTabs(), loadChallenge(currentChallenge);
  if (stage === 4 && !wordleState) newWordleGame();
  if (stage === 4 && wordleState) updateWordleMath();
}

// ============================================================
// HELPERS used by both UI and IDE
// ============================================================
function isVowel(ch) { return 'aeiouAEIOU'.includes(ch); }
function vowelsOf(w) { return [...w].filter(isVowel); }
function reverseStr(s) { return [...s].reverse().join(''); }
function isPalindrome(w) {
  const s = String(w).toLowerCase().replace(/[^a-z]/g, '');
  return s.length > 0 && s === reverseStr(s);
}
function letterIndex(c) { return c.toLowerCase().charCodeAt(0) - 96; } // a=1, z=26
function alphabetDistance(w) {
  const s = String(w).toLowerCase().replace(/[^a-z]/g, '');
  let total = 0;
  for (let i = 1; i < s.length; i++) total += Math.abs(letterIndex(s[i]) - letterIndex(s[i - 1]));
  return total;
}
function longestAlphabeticSubstring(w) {
  const s = String(w).toLowerCase().replace(/[^a-z]/g, '');
  let bestStart = 0, bestLen = 1, curStart = 0, curLen = 1;
  for (let i = 1; i < s.length; i++) {
    if (s.charCodeAt(i) >= s.charCodeAt(i - 1)) curLen++;
    else { curStart = i; curLen = 1; }
    if (curLen > bestLen) { bestLen = curLen; bestStart = curStart; }
  }
  return { substring: s.slice(bestStart, bestStart + bestLen), start: bestStart, length: bestLen };
}
// Letters that look the same rotated 180°
const ROTATE_SAFE = new Set(['h','i','n','o','s','x','z','m','w']);
const ROTATE_MAP = { 'b':'q','q':'b','d':'p','p':'d','h':'h','i':'i','l':'l','m':'w','w':'m','n':'n','o':'o','s':'s','x':'x','z':'z' };
function isRotationallySymmetric(w) {
  const s = String(w).toLowerCase().replace(/[^a-z]/g, '');
  for (let i = 0; i < s.length; i++) {
    const a = s[i], b = s[s.length - 1 - i];
    if (!ROTATE_MAP[a] || ROTATE_MAP[a] !== b) return false;
  }
  return s.length > 0;
}

// ============================================================
// STAGE 1: WORD ANALYZER
// ============================================================
function analyzeWord() {
  const raw = document.getElementById('analyzer-input').value;
  const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
  document.getElementById('analyzer-input').value = w;
  if (!w) { document.getElementById('analyzer-result').innerHTML = '<em>Type a word above.</em>'; return; }

  const positions = [...w].map(c => `<span class="letter-position">${c}<span class="small">${letterIndex(c)}</span></span>`).join('');
  const sum = [...w].reduce((s, c) => s + letterIndex(c), 0);
  const numV = vowelsOf(w).length;
  const reversed = reverseStr(w);
  const palin = isPalindrome(w);

  document.getElementById('analyzer-result').innerHTML = `
    <div class="analyzer-row"><span class="ar-label">📏 Length</span><span class="ar-value"><strong>${w.length}</strong> letters</span></div>
    <div class="analyzer-row"><span class="ar-label">🔢 Positions</span><span class="ar-value">${positions}</span></div>
    <div class="analyzer-row"><span class="ar-label">➕ Sum</span><span class="ar-value">${[...w].map(c => letterIndex(c)).join(' + ')} = <strong>${sum}</strong></span></div>
    <div class="analyzer-row"><span class="ar-label">🎵 Vowels</span><span class="ar-value"><strong>${numV}</strong> (${vowelsOf(w).join(', ') || 'none'})</span></div>
    <div class="analyzer-row"><span class="ar-label">🪞 Reversed</span><span class="ar-value">${reversed}</span></div>
    <div class="analyzer-row"><span class="ar-label">🔁 Palindrome?</span><span class="ar-value">${palin ? '<span class="green">✅ YES</span>' : '<span class="red">No</span>'}</span></div>
  `;
}

// ============================================================
// STAGE 2: PROPERTY EXPLORERS
// ============================================================
function checkPalindrome() {
  const raw = document.getElementById('palin-input').value;
  const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
  document.getElementById('palin-input').value = w;
  const out = document.getElementById('palin-result');
  if (!w) { out.innerHTML = '<em>Type a word…</em>'; out.className = 'prop-result'; return; }
  const rev = reverseStr(w);
  const yes = w === rev;
  out.className = 'prop-result ' + (yes ? 'yes' : 'no');
  out.innerHTML = `
    <div class="big-result">${yes ? '✅ Palindrome!' : '❌ Not a palindrome'}</div>
    <div><strong>${w}</strong> reversed = <strong>${rev}</strong></div>
    ${yes ? '<div style="margin-top:6px">Same forwards and back. Cool!</div>' :
            '<div style="margin-top:6px">Try: LEVEL, NOON, KAYAK, REFER, MADAM, RACECAR</div>'}
  `;
}

function showVCPattern() {
  const raw = document.getElementById('vc-input').value;
  const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
  document.getElementById('vc-input').value = w;
  const out = document.getElementById('vc-result');
  if (!w) { out.innerHTML = '<em>Type a word…</em>'; out.className = 'prop-result'; return; }
  const pat = [...w].map(c => isVowel(c) ? 'V' : 'C').join('');
  const visual = [...w].map(c => `<span class="${isVowel(c) ? 'vc-v' : 'vc-c'}">${c}</span>`).join('');
  out.className = 'prop-result';
  out.innerHTML = `
    <div class="vc-pattern">${visual}</div>
    <div style="margin-top:6px"><strong>Pattern:</strong> <span style="font-family:'Courier New',monospace;font-size:1.1rem;font-weight:800;color:#ffd4c2">${pat}</span></div>
    <div style="margin-top:4px;color:#d8c4b0;font-size:0.9rem">${vowelsOf(w).length} vowel(s), ${w.length - vowelsOf(w).length} consonant(s).</div>
  `;
}

function showDistance() {
  const raw = document.getElementById('dist-input').value;
  const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
  document.getElementById('dist-input').value = w;
  const out = document.getElementById('dist-result');
  if (!w || w.length < 2) { out.innerHTML = '<em>Type at least 2 letters…</em>'; out.className = 'prop-result'; return; }
  const steps = [];
  let total = 0;
  for (let i = 1; i < w.length; i++) {
    const d = Math.abs(letterIndex(w[i]) - letterIndex(w[i - 1]));
    steps.push(`<strong>${w[i-1]}→${w[i]}</strong>: ${d}`);
    total += d;
  }
  out.className = 'prop-result';
  out.innerHTML = `
    <div class="big-result">Total distance: <span class="green">${total}</span></div>
    <div style="margin-top:6px;line-height:1.7">${steps.join(' &nbsp;·&nbsp; ')}</div>
    <div style="margin-top:6px;color:#d8c4b0;font-size:0.9rem">Aaronson's longest 5-letter "alphabet traveler" is <strong>RAYAS</strong> (distance 83).</div>
  `;
}

function showAlphabetic() {
  const raw = document.getElementById('alpha-input').value;
  const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
  document.getElementById('alpha-input').value = w;
  const out = document.getElementById('alpha-result');
  if (!w) { out.innerHTML = '<em>Type a word…</em>'; out.className = 'prop-result'; return; }
  const result = longestAlphabeticSubstring(w);
  const before = w.slice(0, result.start);
  const middle = w.slice(result.start, result.start + result.length);
  const after = w.slice(result.start + result.length);
  out.className = 'prop-result';
  out.innerHTML = `
    <div class="big-result">Longest alphabetic chunk: <span class="green">${result.substring.toUpperCase()}</span> (${result.length} letters)</div>
    <div style="font-family:'Courier New',monospace;font-size:1.2rem;letter-spacing:2px;margin-top:6px">
      <span style="opacity:0.4">${before}</span><span style="background:#538d4e;padding:2px 4px;border-radius:4px">${middle.toUpperCase()}</span><span style="opacity:0.4">${after}</span>
    </div>
  `;
}

function showRotation() {
  const raw = document.getElementById('rot-input').value;
  const w = raw.toUpperCase().replace(/[^A-Z]/g, '');
  document.getElementById('rot-input').value = w;
  const out = document.getElementById('rot-result');
  if (!w) { out.innerHTML = '<em>Type a word…</em>'; out.className = 'prop-result'; return; }
  const yes = isRotationallySymmetric(w);
  out.className = 'prop-result ' + (yes ? 'yes' : 'no');
  // Build the flipped display (mapping)
  const flipped = [...w.toLowerCase()].reverse().map(c => (ROTATE_MAP[c] || '?').toUpperCase()).join('');
  out.innerHTML = `
    <div class="big-result">${yes ? '🔄 Looks the same upside-down!' : '↕️ Different when flipped'}</div>
    <div style="margin-top:6px;font-family:'Courier New',monospace">Normal: <strong>${w}</strong><br>Flipped: <strong>${flipped}</strong></div>
    ${yes ? '<div style="margin-top:6px">Letters that work: <strong>H, I, L, M, N, O, S, W, X, Z</strong> (some also pair: b↔q, d↔p)</div>' :
            '<div style="margin-top:6px">Try: NOON, MOM, WOW, SIS, OHO, SWIMS</div>'}
  `;
}

// ============================================================
// STAGE 3: CODE LAB
// ============================================================

const TOOLBOX_DEFS = [
  { name: 'words', desc: 'List of all words available' },
  { name: 'fiveLetter', desc: 'Only 5-letter words' },
  { name: 'print(...)', desc: 'Show something in the output' },
  { name: 'isVowel(c)', desc: 'True if c is a, e, i, o, or u' },
  { name: 'vowels(w)', desc: 'Get array of vowels in w' },
  { name: 'reverse(w)', desc: 'Flip the word backwards' },
  { name: 'isPalindrome(w)', desc: 'True if w reads same backwards' },
  { name: 'letters(w)', desc: 'Array of letters in w' },
  { name: 'len(w)', desc: 'Length of word w' },
  { name: 'sortByLength(arr)', desc: 'Sort words by length' },
];

function renderToolbox() {
  const tb = document.getElementById('toolbox');
  tb.innerHTML = TOOLBOX_DEFS.map(t =>
    `<div class="tool-chip"><div class="tool-name">${t.name}</div><div class="tool-desc">${t.desc}</div></div>`
  ).join('');
}

const CHALLENGES = [
  {
    id: 'palindromes',
    title: 'Find all palindromes',
    desc: 'Look through every word, print the ones that read the same backwards. (Try not to look at the solution!)',
    starter: `// Print every palindrome in the word list.
for (let w of words) {
  if (isPalindrome(w)) {
    print(w);
  }
}`,
    solution: `// Print every palindrome in the word list.
for (let w of words) {
  if (isPalindrome(w)) {
    print(w);
  }
}`,
  },
  {
    id: 'most-vowels',
    title: 'Word with the most vowels',
    desc: 'Go through every word, count its vowels, keep the best one. Print it at the end.',
    starter: `// Find the word with the most vowels.
let best = '';
let bestCount = 0;
for (let w of words) {
  let n = vowels(w).length;
  if (n > bestCount) {
    bestCount = n;
    best = w;
  }
}
print(best, 'has', bestCount, 'vowels');`,
    solution: `let best = '';
let bestCount = 0;
for (let w of words) {
  const n = vowels(w).length;
  if (n > bestCount) { bestCount = n; best = w; }
}
print(best, 'has', bestCount, 'vowels');`,
  },
  {
    id: 'no-vowels',
    title: 'Words with NO vowels',
    desc: 'Some real words have zero vowels (like "hm" or "tsk"). Find them all.',
    starter: `// Print words that have no vowels at all.
for (let w of words) {
  if (vowels(w).length === 0) {
    print(w);
  }
}`,
    solution: `for (let w of words) {
  if (vowels(w).length === 0) print(w);
}`,
  },
  {
    id: 'reversed-pairs',
    title: 'Word pairs that reverse',
    desc: 'Find pairs of words where one is the reverse of the other (like CAT/TAC, DOG/GOD).',
    starter: `// Find pairs where one word is the reverse of another.
const wordSet = new Set(words);
for (let w of words) {
  const r = reverse(w);
  if (r !== w && wordSet.has(r) && w < r) {
    print(w, '<->', r);
  }
}`,
    solution: `const wordSet = new Set(words);
for (let w of words) {
  const r = reverse(w);
  if (r !== w && wordSet.has(r) && w < r) {
    print(w, '<->', r);
  }
}`,
  },
  {
    id: 'longest-alpha',
    title: 'Top "alphabet runs"',
    desc: 'For each word, find its longest run of letters in ABC order. Print the words with runs of length 4 or more.',
    starter: `// Find words with a long ABC-ordered run.
function longestAlpha(w) {
  let best = 1, cur = 1;
  for (let i = 1; i < w.length; i++) {
    if (w.charCodeAt(i) >= w.charCodeAt(i-1)) cur++;
    else cur = 1;
    if (cur > best) best = cur;
  }
  return best;
}

for (let w of words) {
  if (longestAlpha(w) >= 4) {
    print(w, '(run of', longestAlpha(w), 'letters)');
  }
}`,
    solution: `function longestAlpha(w) {
  let best = 1, cur = 1;
  for (let i = 1; i < w.length; i++) {
    if (w.charCodeAt(i) >= w.charCodeAt(i-1)) cur++;
    else cur = 1;
    if (cur > best) best = cur;
  }
  return best;
}

for (let w of words) {
  if (longestAlpha(w) >= 4) print(w, '(run of', longestAlpha(w), ')');
}`,
  },
];

let currentChallenge = 0;
let solvedChallenges = JSON.parse(localStorage.getItem('mow-solved') || '{}');

function renderChallengeTabs() {
  const c = document.getElementById('challenge-tabs');
  c.innerHTML = CHALLENGES.map((ch, i) =>
    `<button class="challenge-tab${i === currentChallenge ? ' active' : ''}${solvedChallenges[ch.id] ? ' solved' : ''}" onclick="loadChallenge(${i})">${i + 1}. ${ch.title}</button>`
  ).join('');
}

function loadChallenge(i) {
  currentChallenge = i;
  const ch = CHALLENGES[i];
  document.getElementById('challenge-title').textContent = `Challenge ${i + 1}: ${ch.title}`;
  document.getElementById('challenge-desc').textContent = ch.desc;
  document.getElementById('code-editor').value = ch.starter;
  document.getElementById('code-output').textContent = 'Click ▶ RUN to see the result.';
  document.getElementById('code-output').classList.remove('error');
  renderChallengeTabs();
}

function loadStarter() { document.getElementById('code-editor').value = CHALLENGES[currentChallenge].starter; }
function loadSolution() { document.getElementById('code-editor').value = CHALLENGES[currentChallenge].solution; }
function clearOutput() {
  document.getElementById('code-output').textContent = '';
  document.getElementById('code-output').classList.remove('error');
}

function runCode() {
  const code = document.getElementById('code-editor').value;
  const out = document.getElementById('code-output');
  let lines = [];
  const sandboxPrint = (...args) => {
    lines.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));
    if (lines.length > 5000) throw new Error('Too much output! (over 5000 lines)');
  };
  try {
    const fn = new Function(
      'words', 'fiveLetter', 'print', 'isVowel', 'vowels', 'reverse', 'isPalindrome', 'letters', 'len', 'sortByLength',
      code
    );
    fn(
      ALL_WORDS,
      FIVE_LETTER_WORDS,
      sandboxPrint,
      isVowel,
      vowelsOf,
      reverseStr,
      isPalindrome,
      (w) => [...w],
      (w) => String(w).length,
      (arr) => [...arr].sort((a, b) => a.length - b.length)
    );
    out.classList.remove('error');
    out.textContent = lines.length ? lines.join('\n') : '(no output — did your code print anything?)';
    // Mark solved if produced output without error
    if (lines.length > 0) {
      solvedChallenges[CHALLENGES[currentChallenge].id] = true;
      localStorage.setItem('mow-solved', JSON.stringify(solvedChallenges));
      renderChallengeTabs();
    }
  } catch (e) {
    out.classList.add('error');
    out.textContent = '❌ Error: ' + e.message + '\n\n(Check for typos. Each line should end without a missing bracket or quote.)';
  }
}

// Tab key inside editor → insert spaces
document.addEventListener('keydown', (e) => {
  if (e.target && e.target.id === 'code-editor' && e.key === 'Tab') {
    e.preventDefault();
    const ta = e.target;
    const s = ta.selectionStart, t = ta.selectionEnd;
    ta.value = ta.value.slice(0, s) + '  ' + ta.value.slice(t);
    ta.selectionStart = ta.selectionEnd = s + 2;
  }
});

// ============================================================
// STAGE 4: WORDLE
// ============================================================
let wordleState = null;
// { target, guesses: [], current: '', won: false, lost: false, letterStates: {a:'absent', ...} }

// ===== Pattern + entropy helpers (3B1B-style) =====
function getPattern(guess, target) {
  const states = new Array(5).fill(0); // 0=absent, 1=present, 2=correct
  const counts = {};
  for (const c of target) counts[c] = (counts[c] || 0) + 1;
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) { states[i] = 2; counts[guess[i]]--; }
  }
  for (let i = 0; i < 5; i++) {
    if (states[i] !== 2 && counts[guess[i]] > 0) {
      states[i] = 1; counts[guess[i]]--;
    }
  }
  // encode as base-3 number for fast hashing
  return states[0] * 81 + states[1] * 27 + states[2] * 9 + states[3] * 3 + states[4];
}

function entropyOfGuess(guess, candidates) {
  const buckets = {};
  for (const c of candidates) {
    const p = getPattern(guess, c);
    buckets[p] = (buckets[p] || 0) + 1;
  }
  let H = 0;
  const total = candidates.length;
  for (const k in buckets) {
    const pi = buckets[k] / total;
    H -= pi * Math.log2(pi);
  }
  return H;
}

function bestGuessFor(candidates, pool) {
  let best = null, bestH = -Infinity;
  for (const g of pool) {
    const H = entropyOfGuess(g, candidates);
    if (H > bestH) { bestH = H; best = g; }
  }
  return { word: best, bits: bestH };
}

function newWordleGame() {
  const target = WORDLE_TARGET_POOL[Math.floor(Math.random() * WORDLE_TARGET_POOL.length)];
  wordleState = {
    target,
    guesses: [],
    current: '',
    won: false,
    lost: false,
    letterStates: {},
    candidates: [...FIVE_LETTER_WORDS],
    bitsHistory: [],
  };
  document.getElementById('wordle-status').textContent = `Guess the 5-letter word!`;
  document.getElementById('wordle-message').textContent = '';
  document.getElementById('wordle-message').className = 'wordle-message';
  document.getElementById('wmath-suggestion').innerHTML = '';
  document.getElementById('wmath-history').innerHTML = '';
  renderWordleGrid();
  renderWordleKeyboard();
  updateWordleMath();
}

function renderWordleGrid() {
  const grid = document.getElementById('wordle-grid');
  grid.innerHTML = '';
  for (let r = 0; r < 6; r++) {
    const row = document.createElement('div');
    row.className = 'wordle-row';
    let word, states;
    if (r < wordleState.guesses.length) {
      word = wordleState.guesses[r].word;
      states = wordleState.guesses[r].states;
    } else if (r === wordleState.guesses.length && !wordleState.won && !wordleState.lost) {
      word = wordleState.current.padEnd(5, ' ');
      states = null;
    } else {
      word = '     ';
      states = null;
    }
    for (let c = 0; c < 5; c++) {
      const cell = document.createElement('div');
      cell.className = 'wordle-cell';
      const ch = (word[c] || '').trim();
      if (ch) cell.textContent = ch.toUpperCase();
      if (states) cell.classList.add(states[c], 'flip');
      else if (ch) cell.classList.add('filled');
      row.appendChild(cell);
    }
    grid.appendChild(row);
  }
}

const KEYBOARD = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['ENTER','z','x','c','v','b','n','m','BACK'],
];

function renderWordleKeyboard() {
  const kb = document.getElementById('wordle-keyboard');
  kb.innerHTML = '';
  KEYBOARD.forEach(row => {
    const r = document.createElement('div');
    r.className = 'kb-row';
    row.forEach(key => {
      const b = document.createElement('button');
      b.className = 'kb-key';
      if (key === 'ENTER' || key === 'BACK') b.classList.add('wide');
      b.textContent = key === 'BACK' ? '⌫' : key === 'ENTER' ? 'Enter' : key.toUpperCase();
      const state = wordleState.letterStates[key];
      if (state) b.classList.add(state);
      b.addEventListener('click', () => handleWordleKey(key));
      r.appendChild(b);
    });
    kb.appendChild(r);
  });
}

function handleWordleKey(key) {
  if (wordleState.won || wordleState.lost) return;
  if (key === 'ENTER') return submitWordleGuess();
  if (key === 'BACK') { wordleState.current = wordleState.current.slice(0, -1); renderWordleGrid(); return; }
  if (wordleState.current.length >= 5) return;
  wordleState.current += key.toLowerCase();
  renderWordleGrid();
}

function submitWordleGuess() {
  if (wordleState.current.length !== 5) {
    flash('Need 5 letters!');
    return;
  }
  const guess = wordleState.current;
  // Score
  const target = wordleState.target;
  const states = new Array(5).fill('absent');
  const targetCounts = {};
  for (const c of target) targetCounts[c] = (targetCounts[c] || 0) + 1;
  // First pass: correct
  for (let i = 0; i < 5; i++) {
    if (guess[i] === target[i]) { states[i] = 'correct'; targetCounts[guess[i]]--; }
  }
  // Second pass: present
  for (let i = 0; i < 5; i++) {
    if (states[i] !== 'correct' && targetCounts[guess[i]] > 0) {
      states[i] = 'present'; targetCounts[guess[i]]--;
    }
  }
  wordleState.guesses.push({ word: guess, states });
  // === 3B1B math: filter candidates and record bits gained ===
  const before = wordleState.candidates.length;
  const patternCode = getPattern(guess, target);
  wordleState.candidates = wordleState.candidates.filter(c => getPattern(guess, c) === patternCode);
  const after = Math.max(1, wordleState.candidates.length);
  const bitsGained = Math.log2(before / after);
  wordleState.bitsHistory.push({ guess, before, after: wordleState.candidates.length, bits: bitsGained });
  updateWordleMath();
  // Update letter states (only upgrade, never downgrade)
  for (let i = 0; i < 5; i++) {
    const ch = guess[i];
    const cur = wordleState.letterStates[ch];
    const newS = states[i];
    if (cur === 'correct') continue;
    if (cur === 'present' && newS === 'absent') continue;
    wordleState.letterStates[ch] = newS;
  }
  wordleState.current = '';
  if (guess === target) {
    wordleState.won = true;
    const msgs = ['🎉 GENIUS!', '🌟 BRILLIANT!', '🎯 NICE!', '✨ GREAT!', '👏 PHEW!', '😅 BARELY!'];
    flash(msgs[wordleState.guesses.length - 1] + `  The word was ${target.toUpperCase()}.`, 'win');
  } else if (wordleState.guesses.length >= 6) {
    wordleState.lost = true;
    flash(`Out of tries! The word was ${target.toUpperCase()}.`, 'lose');
  }
  renderWordleGrid();
  renderWordleKeyboard();
}

function updateWordleMath() {
  if (!wordleState) return;
  const left = wordleState.candidates.length || 1;
  const bits = Math.log2(left);
  document.getElementById('wmath-left').textContent = left;
  document.getElementById('wmath-bits').textContent = bits.toFixed(2);

  const last = wordleState.bitsHistory[wordleState.bitsHistory.length - 1];
  const gainEl = document.getElementById('wmath-gain');
  if (last) {
    gainEl.textContent = '+' + last.bits.toFixed(2);
    gainEl.classList.add('delta-pos');
  } else {
    gainEl.textContent = '—';
    gainEl.classList.remove('delta-pos');
  }

  // history
  document.getElementById('wmath-history').innerHTML =
    wordleState.bitsHistory.map(h =>
      `<div class="hist-line">"<span class="hist-word">${h.guess.toUpperCase()}</span>": ${h.before} → ${h.after} words &nbsp;<span class="bits-gained">+${h.bits.toFixed(2)} bits</span></div>`
    ).join('');
}

function toggleMathHelp() {
  document.getElementById('wmath-help').classList.toggle('hidden');
}

function suggestBestGuess() {
  if (!wordleState) return;
  const out = document.getElementById('wmath-suggestion');
  if (wordleState.won || wordleState.lost) { out.innerHTML = '<em>Start a new game first.</em>'; return; }
  if (wordleState.candidates.length === 1) {
    out.innerHTML = `Only 1 word left! It must be <span class="sugg-word">${wordleState.candidates[0].toUpperCase()}</span>`;
    return;
  }
  out.innerHTML = '⏳ thinking...';
  // Compute on next tick so UI updates
  setTimeout(() => {
    // Pool = remaining candidates + a small set of "all-purpose" probes to ensure coverage
    // For simplicity, use the remaining candidates as the guess pool
    const pool = wordleState.candidates.length <= 2
      ? wordleState.candidates
      : wordleState.candidates;
    const { word, bits } = bestGuessFor(wordleState.candidates, pool);
    out.innerHTML = `Try <span class="sugg-word">${word.toUpperCase()}</span> — it'll give you <span class="sugg-bits">≈ ${bits.toFixed(2)} bits</span> of info on average.`;
  }, 30);
}

function flash(msg, cls) {
  const m = document.getElementById('wordle-message');
  m.textContent = msg;
  m.className = 'wordle-message' + (cls ? ' ' + cls : ' shake');
  if (!cls) setTimeout(() => m.classList.remove('shake'), 500);
}

function giveUp() {
  if (!wordleState || wordleState.won) return;
  wordleState.lost = true;
  flash(`The word was ${wordleState.target.toUpperCase()}.`, 'lose');
  renderWordleGrid();
}

// Keyboard input for Wordle
document.addEventListener('keydown', (e) => {
  if (!document.getElementById('stage-4').classList.contains('hidden')) {
    if (!wordleState || wordleState.won || wordleState.lost) return;
    if (e.key === 'Enter') { e.preventDefault(); handleWordleKey('ENTER'); }
    else if (e.key === 'Backspace') { e.preventDefault(); handleWordleKey('BACK'); }
    else if (/^[a-zA-Z]$/.test(e.key)) handleWordleKey(e.key.toLowerCase());
  }
});

// ============================================================
// INIT
// ============================================================
function init() {
  analyzeWord();
  checkPalindrome();
  showVCPattern();
  showDistance();
  showAlphabetic();
  showRotation();
  renderToolbox();
  renderChallengeTabs();
  loadChallenge(0);
  showStage(1);
}
init();
