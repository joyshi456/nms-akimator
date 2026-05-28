// ============================================================
// Number Bases Explorer — script.js
// ============================================================

let currentStage = 1;
let score = { correct: 0, total: 0 };



// ============================================================
// TABS & NAVIGATION
// ============================================================
document.querySelectorAll('.tab').forEach(tab => {
  tab.addEventListener('click', () => {
    showStage(parseInt(tab.dataset.stage));
  });
});

function showStage(stage) {
  currentStage = stage;
  document.querySelectorAll('.stage').forEach(s => s.classList.add('hidden'));
  document.getElementById(`stage-${stage}`).classList.remove('hidden');
  document.querySelectorAll('.tab').forEach(t => {
    t.classList.toggle('active', parseInt(t.dataset.stage) === stage);
  });
}

// ============================================================
// SCORE
// ============================================================
function loadScore() {
  const saved = localStorage.getItem('numbases-score');
  if (saved) {
    try { score = JSON.parse(saved); } catch (e) { /* ignore */ }
  }
  updateScoreDisplay();
}

function saveScore() {
  localStorage.setItem('numbases-score', JSON.stringify(score));
  updateScoreDisplay();
}

function updateScoreDisplay() {
  document.getElementById('score-display').textContent = `Score: ${score.correct} / ${score.total}`;
}

function resetScore() {
  score = { correct: 0, total: 0 };
  saveScore();
  // Reset all problem cards
  document.querySelectorAll('.problem-card').forEach(card => {
    card.classList.remove('correct', 'incorrect');
  });
  document.querySelectorAll('.problem-input').forEach(inp => {
    inp.classList.remove('correct', 'incorrect');
    inp.value = '';
    inp.disabled = false;
  });
  document.querySelectorAll('.mc-option').forEach(opt => {
    opt.classList.remove('correct', 'incorrect', 'selected');
    opt.style.pointerEvents = '';
  });
  document.querySelectorAll('.problem-feedback').forEach(fb => {
    fb.textContent = '';
    fb.className = 'problem-feedback';
  });
  document.querySelectorAll('.btn-check').forEach(btn => {
    btn.disabled = false;
  });
}

// ============================================================
// STAGE 1: EXPANSION TOOL
// ============================================================
function showExpansion() {
  const numStr = document.getElementById('expand-number').value.trim().toUpperCase();
  const base = parseInt(document.getElementById('expand-base').value);
  const result = document.getElementById('expansion-result');

  if (!numStr) { result.innerHTML = 'Please enter a number.'; return; }

  // Validate digits for the base
  for (let ch of numStr) {
    const d = parseInt(ch, base);
    if (isNaN(d) || d >= base) {
      result.innerHTML = `<span style="color:#c62828">Digit "${ch}" is not valid in base ${base}. ` +
        `Use digits 0 to ${base - 1}${base > 10 ? ' (A=' + 10 + '...' + ')' : ''}.</span>`;
      return;
    }
  }

  const digits = numStr.split('').map(ch => parseInt(ch, base));
  const len = digits.length;

  let terms = [];
  let values = [];
  for (let i = 0; i < len; i++) {
    const power = len - 1 - i;
    const placeVal = Math.pow(base, power);
    terms.push(`${digits[i]} &times; ${base}<sup>${power}</sup>`);
    values.push(`${digits[i]} &times; ${placeVal}`);
  }

  const decimalVal = digits.reduce((sum, d, i) => sum + d * Math.pow(base, len - 1 - i), 0);

  result.innerHTML =
    `<strong>${numStr}<sub>${base}</sub></strong> = ${terms.join(' + ')}<br>` +
    `= ${values.join(' + ')}<br>` +
    `= <strong>${decimalVal}<sub>10</sub></strong>`;
}

// ============================================================
// STAGE 2: INTERACTIVE COUNTER
// ============================================================
let counterValue = 0;
let counterHistory = [];

function resetCounter() {
  counterValue = 0;
  counterHistory = [0];
  updateCounterDisplay();
}

function counterStep(dir) {
  counterValue += dir;
  if (counterValue < 0) counterValue = 0;
  if (!counterHistory.includes(counterValue)) {
    counterHistory.push(counterValue);
    counterHistory.sort((a, b) => a - b);
  }
  updateCounterDisplay();
}

function updateCounterDisplay() {
  const base = parseInt(document.getElementById('counter-base').value);
  document.getElementById('counter-value').textContent = counterValue.toString(base).toUpperCase();
  document.getElementById('counter-decimal').textContent = counterValue;

  const seqEl = document.getElementById('counter-sequence');
  // Show sequence from 0 to current
  let nums = [];
  for (let i = 0; i <= Math.min(counterValue, 40); i++) {
    const isCurrent = i === counterValue;
    nums.push(`<span class="seq-num${isCurrent ? ' current' : ''}">${i.toString(base).toUpperCase()}</span>`);
  }
  if (counterValue > 40) nums.push('<span class="seq-num">...</span>');
  seqEl.innerHTML = nums.join('');
}

// ============================================================
// STAGE 3: BASE ARITHMETIC CALCULATOR
// ============================================================
function doBaseCalc() {
  const aStr = document.getElementById('calc-a').value.trim().toUpperCase();
  const bStr = document.getElementById('calc-b').value.trim().toUpperCase();
  const op = document.getElementById('calc-op').value;
  const base = parseInt(document.getElementById('calc-base').value);
  const result = document.getElementById('calc-result');

  if (!aStr || !bStr) { result.innerHTML = 'Enter both numbers.'; return; }

  // Validate
  const aVal = parseInt(aStr, base);
  const bVal = parseInt(bStr, base);
  if (isNaN(aVal)) { result.innerHTML = `<span style="color:#c62828">"${aStr}" is not valid in base ${base}.</span>`; return; }
  if (isNaN(bVal)) { result.innerHTML = `<span style="color:#c62828">"${bStr}" is not valid in base ${base}.</span>`; return; }

  // Check digits are valid
  for (let ch of aStr) {
    if (parseInt(ch, base) >= base || isNaN(parseInt(ch, base))) {
      result.innerHTML = `<span style="color:#c62828">Digit "${ch}" is not valid in base ${base}.</span>`;
      return;
    }
  }
  for (let ch of bStr) {
    if (parseInt(ch, base) >= base || isNaN(parseInt(ch, base))) {
      result.innerHTML = `<span style="color:#c62828">Digit "${ch}" is not valid in base ${base}.</span>`;
      return;
    }
  }

  let res;
  let opSymbol;
  switch (op) {
    case '+': res = aVal + bVal; opSymbol = '+'; break;
    case '-': res = aVal - bVal; opSymbol = '&minus;'; break;
    case '*': res = aVal * bVal; opSymbol = '&times;'; break;
  }

  if (res < 0) {
    result.innerHTML = `<span style="color:#c62828">Result is negative (${res} in decimal). The first number must be larger for subtraction.</span>`;
    return;
  }

  const resBase = res.toString(base).toUpperCase();
  result.innerHTML =
    `<strong>${aStr}<sub>${base}</sub> ${opSymbol} ${bStr}<sub>${base}</sub> = ${resBase}<sub>${base}</sub></strong><br>` +
    `<span style="color:#888">(In decimal: ${aVal} ${op === '*' ? '&times;' : op === '-' ? '&minus;' : '+'} ${bVal} = ${res})</span>`;
}

// ============================================================
// STAGE 4: BASE CONVERTER
// ============================================================
function doConvert() {
  const numStr = document.getElementById('conv-number').value.trim().toUpperCase();
  const fromBase = parseInt(document.getElementById('conv-from').value);
  const toBase = parseInt(document.getElementById('conv-to').value);
  const result = document.getElementById('conv-result');
  const steps = document.getElementById('conv-steps');

  if (!numStr) { result.innerHTML = 'Enter a number.'; steps.innerHTML = ''; return; }

  // Validate
  for (let ch of numStr) {
    const d = parseInt(ch, fromBase);
    if (isNaN(d) || d >= fromBase) {
      result.innerHTML = `<span style="color:#c62828">Digit "${ch}" is not valid in base ${fromBase}.</span>`;
      steps.innerHTML = '';
      return;
    }
  }

  const decVal = parseInt(numStr, fromBase);
  const converted = decVal.toString(toBase).toUpperCase();

  result.innerHTML = `<strong>${numStr}<sub>${fromBase}</sub> = ${converted}<sub>${toBase}</sub></strong>`;

  // Show steps
  let stepsHtml = '';

  // Step 1: to decimal
  if (fromBase !== 10) {
    const digits = numStr.split('').map(ch => parseInt(ch, fromBase));
    const len = digits.length;
    let terms = digits.map((d, i) => `${d}&times;${fromBase}<sup>${len-1-i}</sup>`);
    stepsHtml += `<strong>Step 1:</strong> ${numStr}<sub>${fromBase}</sub> to decimal<br>`;
    stepsHtml += terms.join(' + ') + ` = <strong>${decVal}</strong><br><br>`;
  }

  // Step 2: to target base
  if (toBase !== 10) {
    stepsHtml += `<strong>${fromBase !== 10 ? 'Step 2' : 'Steps'}:</strong> ${decVal}<sub>10</sub> to base ${toBase} (division method)<br>`;
    let n = decVal;
    let remainders = [];
    if (n === 0) {
      stepsHtml += '0 is 0 in any base.<br>';
    } else {
      while (n > 0) {
        const rem = n % toBase;
        const quot = Math.floor(n / toBase);
        const remStr = rem >= 10 ? String.fromCharCode(55 + rem) : rem.toString();
        stepsHtml += `${n} &divide; ${toBase} = ${quot} remainder <strong>${remStr}</strong><br>`;
        remainders.push(remStr);
        n = quot;
      }
      stepsHtml += `Read remainders bottom &rarr; top: <strong>${remainders.reverse().join('')}<sub>${toBase}</sub></strong>`;
    }
  }

  steps.innerHTML = stepsHtml;
}

// ============================================================
// PRACTICE PROBLEMS
// ============================================================

const PROBLEMS = {
  1: [
    {
      q: 'What is the largest digit you can use in base 5?',
      answer: '4',
      hint: 'In base b, digits go from 0 to b-1.',
      type: 'input'
    },
    {
      q: 'How many different digits does base 8 use?',
      answer: '8',
      hint: 'Base b uses digits 0, 1, 2, ..., b-1. How many is that?',
      type: 'input'
    },
    {
      q: 'Expand 32 in base 8: what is 3&times;8 + 2?',
      answer: '26',
      hint: '3 eights plus 2 ones.',
      type: 'input'
    },
    {
      q: 'Expand 32 in base 5: what is 3&times;5 + 2?',
      answer: '17',
      hint: '3 fives plus 2 ones.',
      type: 'input'
    },
    {
      q: 'What is 4321<sub>10</sub> expanded? (Pick the correct expansion)',
      answer: 'B',
      type: 'mc',
      options: [
        { label: 'A', text: '4&times;10 + 3&times;10 + 2&times;10 + 1' },
        { label: 'B', text: '4&times;1000 + 3&times;100 + 2&times;10 + 1&times;1' },
        { label: 'C', text: '4&times;10000 + 3&times;1000 + 2&times;100 + 1&times;10' },
      ],
      hint: 'The leftmost digit multiplies the highest power of 10.'
    },
    {
      q: 'In base 2 (binary), what digits can you use?',
      answer: 'A',
      type: 'mc',
      options: [
        { label: 'A', text: '0 and 1 only' },
        { label: 'B', text: '0, 1, and 2' },
        { label: 'C', text: '1 and 2 only' },
      ],
      hint: 'Base 2 means digits from 0 to 2-1.'
    },
  ],
  2: [
    {
      q: 'In base 4, what comes after 3?',
      answer: '10',
      hint: '3 is the largest digit in base 4. What happens when you go one more?',
      type: 'input'
    },
    {
      q: 'In base 5, what is the 20th counting number? (Count: 1, 2, 3, 4, 10, 11, ...)',
      answer: '40',
      hint: '20 = 4&times;5 + 0. Convert 20 to base 5.',
      type: 'input'
    },
    {
      q: 'In base 8, what is the 20th counting number?',
      answer: '24',
      hint: '20 = 2&times;8 + 4. Convert 20 to base 8.',
      type: 'input'
    },
    {
      q: 'In base 2, what is the 8th counting number?',
      answer: '1000',
      hint: '8 in binary is 2^3 = 1000.',
      type: 'input'
    },
    {
      q: 'In base 4, what is the 21st counting number?',
      answer: '111',
      hint: '21 = 1&times;16 + 1&times;4 + 1&times;1. Convert 21 to base 4.',
      type: 'input'
    },
    {
      q: 'In base 2, what comes after 111?',
      answer: '1000',
      hint: '111 in binary is 7. What is 8 in binary?',
      type: 'input'
    },
  ],
  3: [
    {
      q: 'In base 6: 2 + 4 = ?',
      answer: '10',
      hint: '2+4=6, but 6 is the base! Write 10 in base 6.',
      type: 'input'
    },
    {
      q: 'In base 6: 3 + 5 = ?',
      answer: '12',
      hint: '3+5=8. 8 = 1&times;6 + 2 = 12 in base 6.',
      type: 'input'
    },
    {
      q: 'In base 2: 1 + 1 = ?',
      answer: '10',
      hint: '1+1=2, and 2 in binary is 10.',
      type: 'input'
    },
    {
      q: 'In base 2: 11 + 11 = ?',
      answer: '110',
      hint: '11 is 3 in decimal. 3+3=6. Convert 6 to binary.',
      type: 'input'
    },
    {
      q: 'In base 5: 12<sub>5</sub> &minus; 4<sub>5</sub> = ?',
      answer: '3',
      hint: 'Borrow from the fives column: 12 in base 5 is 7 in decimal. 7-4=3.',
      type: 'input'
    },
    {
      q: 'In base 5: 32<sub>5</sub> + 13<sub>5</sub> = ?',
      answer: '100',
      hint: '32 in base 5 is 17, 13 in base 5 is 8. 17+8=25. Convert 25 to base 5.',
      type: 'input'
    },
    {
      q: 'In base 8: 2 &times; 4 = ?',
      answer: '10',
      hint: '2&times;4=8, but 8 is the base! That is 10 in base 8.',
      type: 'input'
    },
    {
      q: 'In base 8: 2 &times; 6 = ?',
      answer: '14',
      hint: '2&times;6=12. 12 = 1&times;8 + 4 = 14 in base 8.',
      type: 'input'
    },
  ],
  4: [
    {
      q: 'Convert 42<sub>5</sub> to base 10.',
      answer: '22',
      hint: '4&times;5 + 2 = ?',
      type: 'input'
    },
    {
      q: 'Convert 123<sub>8</sub> to base 10.',
      answer: '83',
      hint: '1&times;64 + 2&times;8 + 3&times;1 = ?',
      type: 'input'
    },
    {
      q: 'Convert 35<sub>7</sub> to base 10.',
      answer: '26',
      hint: '3&times;7 + 5 = ?',
      type: 'input'
    },
    {
      q: 'Convert 26 (base 10) to base 3.',
      answer: '222',
      hint: '26 &divide; 3 = 8 R2, 8 &divide; 3 = 2 R2, 2 &divide; 3 = 0 R2.',
      type: 'input'
    },
    {
      q: 'Convert 35 (base 10) to base 3.',
      answer: '1022',
      hint: '35 &divide; 3 = 11 R2, 11 &divide; 3 = 3 R2, 3 &divide; 3 = 1 R0, 1 &divide; 3 = 0 R1. Read remainders: 1022.',
      type: 'input'
    },
    {
      q: 'Convert 125 (base 10) to base 8.',
      answer: '175',
      hint: '125 &divide; 8 = 15 R5, 15 &divide; 8 = 1 R7, 1 &divide; 8 = 0 R1. Read: 175.',
      type: 'input'
    },
    {
      q: 'Convert 332<sub>5</sub> to base 8.',
      answer: '134',
      hint: 'First convert to base 10: 3&times;25+3&times;5+2=92. Then 92 to base 8.',
      type: 'input'
    },
    {
      q: 'What is 245 (base 10) in binary (base 2)?',
      answer: '11110101',
      hint: '245 = 128+64+32+16+0+4+0+1.',
      type: 'input'
    },
  ],
  5: [
    {
      q: 'What hex color code is pure red? (Write as 6 hex digits, no #)',
      answer: 'FF0000',
      hint: 'Red=FF (max), Green=00, Blue=00.',
      type: 'input'
    },
    {
      q: 'The hex color #00FF00 is which color?',
      answer: 'B',
      type: 'mc',
      options: [
        { label: 'A', text: 'Red' },
        { label: 'B', text: 'Green' },
        { label: 'C', text: 'Blue' },
        { label: 'D', text: 'Yellow' },
      ],
      hint: 'The middle two hex digits (FF) control green.'
    },
    {
      q: 'What decimal number is FF in hex (base 16)?',
      answer: '255',
      hint: 'F=15. FF = 15&times;16 + 15 = ?',
      type: 'input'
    },
    {
      q: 'The letter "A" has ASCII code 65. What is 65 in binary?',
      answer: '1000001',
      hint: '65 = 64 + 1 = 2^6 + 2^0.',
      type: 'input'
    },
    {
      q: 'Using finger binary (thumb=1, index=2, middle=4, ring=8, pinky=16), what number is thumb + middle + ring?',
      answer: '13',
      hint: '1 + 4 + 8 = ?',
      type: 'input'
    },
    {
      q: 'How many different values can 8 binary bits represent?',
      answer: '256',
      hint: '2^8 = ?',
      type: 'input'
    },
  ],
  6: [
    {
      q: 'Find base b: if 21<sub>b</sub> &times; 54<sub>b</sub> = 1354<sub>b</sub>, what is b?',
      answer: '8',
      hint: '(2b+1)(5b+4) = b\u00B3+3b\u00B2+5b+4. Expand and simplify.',
      type: 'input'
    },
    {
      q: '15<sub>b</sub> &times; 15<sub>b</sub> = 321<sub>b</sub>. What is b?',
      answer: '6',
      hint: '(b+5)\u00B2 = 3b\u00B2+2b+1. Solve the quadratic.',
      type: 'input'
    },
    {
      q: 'What is the sum of 101<sub>2</sub> and 1011<sub>2</sub>? Give your answer in base 2.',
      answer: '10000',
      hint: '101 is 5, 1011 is 11. 5+11=16. Convert 16 to binary.',
      type: 'input'
    },
    {
      q: 'The base-10 numbers 235 and 57 are multiplied. What is the units digit of the product in base 6?',
      answer: '3',
      hint: 'Only the units digit matters. 235&times;57 mod 6 = (235 mod 6)&times;(57 mod 6) mod 6.',
      type: 'input'
    },
    {
      q: 'In base 3: 2012<sub>3</sub> &times; 201<sub>3</sub> = ? Give your answer in base 3.',
      answer: '1112112',
      hint: 'Do long multiplication in base 3, or convert both to decimal, multiply, convert back.',
      type: 'input'
    },
    {
      q: 'b is the smallest positive integer base where 301<sub>b</sub> is a perfect square. What is b?',
      answer: '4',
      hint: '301 in base b = 3b\u00B2+1. Try b=4: 3(16)+1=49=7\u00B2.',
      type: 'input'
    },
    {
      q: 'When 363 (base 10) is written as 123<sub>b</sub>, what is b?',
      answer: '18',
      hint: 'b\u00B2 + 2b + 3 = 363. Solve: b\u00B2 + 2b - 360 = 0.',
      type: 'input'
    },
    {
      q: 'In another world, people use base y. If 4&times;6=30 and 4&times;7=34 in their system, what is y?',
      answer: '8',
      hint: '4&times;6=24 in decimal. 30 in base y means 3y. So 3y=24, y=8.',
      type: 'input'
    },
    {
      q: 'How many zeros does 100! end with in base 6?',
      answer: '48',
      hint: 'In base 6, a trailing zero needs a factor of 6=2&times;3. Count factors of 3 in 100! (there are fewer 3s than 2s).',
      type: 'input'
    },
    {
      q: 'The repeating base-3 decimal 0.121212...<sub>3</sub> equals what fraction (base 10)? Write as a/b in lowest terms.',
      answer: '5/8',
      hint: 'x = 0.12 repeating in base 3. Multiply by 3\u00B2=9: 9x = 12.12... So 9x - x = 12 (base 3) = 5. Thus 8x = 5.',
      type: 'input'
    },
  ]
};

function renderAllProblems() {
  for (let stage = 1; stage <= 6; stage++) {
    const container = document.getElementById(`practice-${stage}`);
    if (!container) continue;
    container.innerHTML = '';

    PROBLEMS[stage].forEach((prob, idx) => {
      const id = `p${stage}-${idx}`;
      const card = document.createElement('div');
      card.className = 'problem-card';
      card.id = `card-${id}`;

      let inputHtml = '';
      if (prob.type === 'mc') {
        inputHtml = `<div class="mc-options" id="mc-${id}">` +
          prob.options.map(opt =>
            `<button class="mc-option" data-value="${opt.label}" onclick="selectMC('${id}', '${opt.label}')">${opt.label}) ${opt.text}</button>`
          ).join('') +
          '</div>';
      } else {
        inputHtml = `<div class="problem-input-row">
          <input type="text" class="problem-input" id="input-${id}" placeholder="Answer..."
            onkeydown="if(event.key==='Enter') checkAnswer('${id}', ${stage}, ${idx})">
          <button class="btn-check" id="btn-${id}" onclick="checkAnswer('${id}', ${stage}, ${idx})">Check</button>
          <button class="btn-hint" onclick="showHint('${id}', ${stage}, ${idx})">Hint</button>
        </div>`;
      }

      card.innerHTML = `
        <div class="problem-number">Problem ${idx + 1}</div>
        <div class="problem-text">${prob.q}</div>
        ${inputHtml}
        ${prob.type === 'mc' ? `<div class="problem-input-row" style="margin-top:8px">
          <button class="btn-check" id="btn-${id}" onclick="checkAnswer('${id}', ${stage}, ${idx})">Check</button>
          <button class="btn-hint" onclick="showHint('${id}', ${stage}, ${idx})">Hint</button>
        </div>` : ''}
        <div class="problem-feedback" id="fb-${id}"></div>
      `;
      container.appendChild(card);
    });
  }
}

let selectedMC = {};

function selectMC(id, value) {
  selectedMC[id] = value;
  document.querySelectorAll(`#mc-${id} .mc-option`).forEach(opt => {
    opt.classList.toggle('selected', opt.dataset.value === value);
  });
}

function checkAnswer(id, stage, idx) {
  const prob = PROBLEMS[stage][idx];
  const card = document.getElementById(`card-${id}`);
  const fb = document.getElementById(`fb-${id}`);
  const btn = document.getElementById(`btn-${id}`);

  let userAnswer;
  if (prob.type === 'mc') {
    userAnswer = selectedMC[id] || '';
  } else {
    const input = document.getElementById(`input-${id}`);
    userAnswer = input.value.trim().toUpperCase();
  }

  if (!userAnswer) {
    fb.textContent = 'Please enter an answer!';
    fb.className = 'problem-feedback incorrect';
    return;
  }

  // Already answered
  if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;

  const correct = userAnswer === prob.answer.toUpperCase();

  score.total++;
  if (correct) {
    score.correct++;
    fb.textContent = 'Correct! Great job!';
    fb.className = 'problem-feedback correct';
    card.classList.add('correct');
  } else {
    fb.textContent = `Not quite. The answer is ${prob.answer}.`;
    fb.className = 'problem-feedback incorrect';
    card.classList.add('incorrect');
  }

  // Disable input
  if (prob.type === 'mc') {
    document.querySelectorAll(`#mc-${id} .mc-option`).forEach(opt => {
      opt.style.pointerEvents = 'none';
      if (opt.dataset.value === prob.answer.toUpperCase()) opt.classList.add('correct');
      else if (opt.dataset.value === userAnswer) opt.classList.add('incorrect');
    });
  } else {
    const input = document.getElementById(`input-${id}`);
    input.disabled = true;
    input.classList.add(correct ? 'correct' : 'incorrect');
  }
  btn.disabled = true;

  saveScore();
}

function showHint(id, stage, idx) {
  const prob = PROBLEMS[stage][idx];
  const fb = document.getElementById(`fb-${id}`);
  const card = document.getElementById(`card-${id}`);
  if (card.classList.contains('correct') || card.classList.contains('incorrect')) return;
  fb.textContent = 'Hint: ' + prob.hint;
  fb.className = 'problem-feedback hint';
}

// ============================================================
// STAGE 5: HEX COLOR MIXER
// ============================================================
function updateColorPreview() {
  const r = parseInt(document.getElementById('color-r').value);
  const g = parseInt(document.getElementById('color-g').value);
  const b = parseInt(document.getElementById('color-b').value);

  const hexR = r.toString(16).toUpperCase().padStart(2, '0');
  const hexG = g.toString(16).toUpperCase().padStart(2, '0');
  const hexB = b.toString(16).toUpperCase().padStart(2, '0');

  document.getElementById('hex-r').textContent = hexR;
  document.getElementById('hex-g').textContent = hexG;
  document.getElementById('hex-b').textContent = hexB;

  const hex = `#${hexR}${hexG}${hexB}`;
  document.getElementById('color-swatch').style.background = hex;
  document.getElementById('color-code').textContent = hex;
  document.getElementById('color-decimal').textContent = `rgb(${r}, ${g}, ${b})`;

  // Also change the header color as a fun demo
  document.querySelector('header').style.background =
    `linear-gradient(135deg, ${hex}, ${shiftColor(hex, -40)})`;
}

function shiftColor(hex, amount) {
  const r = Math.max(0, Math.min(255, parseInt(hex.slice(1,3), 16) + amount));
  const g = Math.max(0, Math.min(255, parseInt(hex.slice(3,5), 16) + amount));
  const b = Math.max(0, Math.min(255, parseInt(hex.slice(5,7), 16) + amount));
  return `rgb(${r},${g},${b})`;
}

function setColorPreset(btn) {
  document.getElementById('color-r').value = btn.dataset.r;
  document.getElementById('color-g').value = btn.dataset.g;
  document.getElementById('color-b').value = btn.dataset.b;
  updateColorPreview();
}

// ============================================================
// STAGE 5: BINARY MESSAGE ENCODER
// ============================================================
function encodeBinaryMessage() {
  const msg = document.getElementById('binary-message').value.toUpperCase();
  const output = document.getElementById('binary-output');
  if (!msg) { output.innerHTML = ''; return; }

  let lines = [];
  for (let ch of msg) {
    const code = ch.charCodeAt(0);
    if (code >= 32 && code <= 126) {
      const bin = code.toString(2).padStart(8, '0');
      lines.push(`<span style="color:#1565c0;font-weight:700">${ch === ' ' ? '(space)' : ch}</span> = ${bin}`);
    }
  }
  output.innerHTML = lines.join('<br>');
}

// ============================================================
// STAGE 5: BINARY LIGHT SWITCHES
// ============================================================
let switchBits = [0, 0, 0, 0, 0, 0, 0, 0];

function initSwitches() {
  const row = document.getElementById('switch-row');
  if (!row) return;
  row.innerHTML = '';
  for (let i = 0; i < 8; i++) {
    const btn = document.createElement('button');
    btn.className = 'bit-switch';
    btn.textContent = '0';
    btn.dataset.index = i;
    btn.addEventListener('click', () => toggleBit(i));
    row.appendChild(btn);
  }
  updateSwitchDisplay();
}

function toggleBit(i) {
  switchBits[i] = switchBits[i] ? 0 : 1;
  updateSwitchDisplay();
}

function updateSwitchDisplay() {
  const row = document.getElementById('switch-row');
  if (!row) return;
  const buttons = row.querySelectorAll('.bit-switch');
  buttons.forEach((btn, i) => {
    btn.textContent = switchBits[i];
    btn.classList.toggle('on', switchBits[i] === 1);
  });

  const binStr = switchBits.join('');
  const dec = parseInt(binStr, 2);
  const hex = dec.toString(16).toUpperCase().padStart(2, '0');

  document.getElementById('switch-binary').textContent = binStr;
  document.getElementById('switch-decimal').textContent = dec;
  document.getElementById('switch-hex').textContent = hex;
}

// ============================================================
// START
// ============================================================
function init() {
  loadScore();
  showStage(1);
  renderAllProblems();
  resetCounter();
  initSwitches();
  updateColorPreview();
}

init();
