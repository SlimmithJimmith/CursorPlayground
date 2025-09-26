import { wordsCommon5, wordsAnswers5 } from '/words5.js';

const DEFAULT_WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const KEY_ROWS = [
  ['q','w','e','r','t','y','u','i','o','p'],
  ['a','s','d','f','g','h','j','k','l'],
  ['enter','z','x','c','v','b','n','m','backspace']
];

const qs = (sel) => document.querySelector(sel);
const qsa = (sel) => Array.from(document.querySelectorAll(sel));

function getTodayKey() {
  const now = new Date();
  // yyyy-mm-dd
  return now.toISOString().slice(0, 10);
}

function loadSettings() {
  const s = JSON.parse(localStorage.getItem('wordlet:settings') || '{}');
  return {
    dark: s.dark ?? (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches),
    wordLength: s.wordLength || DEFAULT_WORD_LENGTH,
    mode: s.mode || 'daily',
  };
}

function saveSettings(settings) {
  localStorage.setItem('wordlet:settings', JSON.stringify(settings));
}

function loadStats() {
  const s = JSON.parse(localStorage.getItem('wordlet:stats') || '{}');
  return {
    played: s.played || 0,
    wins: s.wins || 0,
    streak: s.streak || 0,
    maxStreak: s.maxStreak || 0,
    distribution: s.distribution || [0,0,0,0,0,0],
    lastPlayedDay: s.lastPlayedDay || null,
  };
}

function saveStats(stats) {
  localStorage.setItem('wordlet:stats', JSON.stringify(stats));
}

function showToast(msg) {
  const el = qs('#toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 1500);
}

function pickDailyAnswer() {
  // Deterministic by day index
  const epoch = new Date('2021-06-19T00:00:00Z');
  const today = new Date();
  const days = Math.floor((today - epoch) / (24*60*60*1000));
  const idx = days % wordsAnswers5.length;
  return wordsAnswers5[idx];
}

function pickRandomAnswer() {
  return wordsAnswers5[Math.floor(Math.random()*wordsAnswers5.length)];
}

function validWordSet(wordLength) {
  // Filter to length
  const wl = wordLength;
  const valid = new Set();
  for (const w of wordsCommon5) { if (w.length === wl) valid.add(w); }
  for (const w of wordsAnswers5) { if (w.length === wl) valid.add(w); }
  return valid;
}

function evaluateGuess(guess, answer) {
  // returns array of states: 'correct' | 'present' | 'absent'
  const result = Array(guess.length).fill('absent');
  const answerChars = answer.split('');
  const used = Array(guess.length).fill(false);

  // First pass: correct
  for (let i=0;i<guess.length;i++) {
    if (guess[i] === answer[i]) {
      result[i] = 'correct';
      used[i] = true;
      answerChars[i] = null;
    }
  }
  // Second pass: present
  for (let i=0;i<guess.length;i++) {
    if (result[i] === 'correct') continue;
    const ch = guess[i];
    const idx = answerChars.indexOf(ch);
    if (idx !== -1) {
      result[i] = 'present';
      answerChars[idx] = null;
    }
  }
  return result;
}

function createRows(wordLength) {
  const board = qs('#board');
  board.style.setProperty('--word-length', String(wordLength));
  board.innerHTML = '';
  for (let r=0;r<MAX_GUESSES;r++) {
    const row = document.createElement('div');
    row.className = 'row';
    row.setAttribute('role', 'row');
    for (let c=0;c<wordLength;c++) {
      const tile = document.createElement('div');
      tile.className = 'tile';
      tile.setAttribute('role', 'gridcell');
      tile.textContent = '';
      row.appendChild(tile);
    }
    board.appendChild(row);
  }
}

function createKeyboard() {
  const container = qs('#keyboard');
  container.innerHTML = '';
  for (const rowKeys of KEY_ROWS) {
    const row = document.createElement('div');
    row.className = 'key-row';
    for (const key of rowKeys) {
      const btn = document.createElement('button');
      btn.className = 'key';
      btn.dataset.key = key;
      btn.textContent = key === 'backspace' ? '⌫' : (key === 'enter' ? 'Enter' : key);
      btn.addEventListener('click', () => onKeyPress(key));
      row.appendChild(btn);
    }
    container.appendChild(row);
  }
}

function setDarkMode(enabled) {
  document.documentElement.classList.toggle('dark', enabled);
}

function updateStatsModal(stats) {
  qs('#stat-played').textContent = String(stats.played);
  qs('#stat-winrate').textContent = stats.played ? String(Math.round(100*stats.wins/stats.played)) : '0';
  qs('#stat-streak').textContent = String(stats.streak);
  qs('#stat-maxstreak').textContent = String(stats.maxStreak);
}

function updateKeyboardColors(guesses, evaluations) {
  // Highest priority: correct > present > absent
  const keyState = new Map();
  const rank = { absent: 0, present: 1, correct: 2 };
  for (let i=0;i<guesses.length;i++) {
    const g = guesses[i];
    const e = evaluations[i];
    for (let j=0;j<g.length;j++) {
      const ch = g[j];
      const st = e[j];
      const cur = keyState.get(ch);
      if (!cur || rank[st] > rank[cur]) keyState.set(ch, st);
    }
  }
  qsa('.key').forEach(k => {
    const key = k.dataset.key;
    if (!key || key.length !== 1) return;
    k.classList.remove('correct','present','absent');
    const st = keyState.get(key);
    if (st) k.classList.add(st);
  });
}

function serializeBoard(guesses, evaluations) {
  return guesses.map((g,i) => g.split('').map((ch,j) => {
    const e = evaluations[i][j];
    if (e === 'correct') return '🟩';
    if (e === 'present') return '🟨';
    return '⬜';
  }).join('')).join('\n');
}

function copyShare(text) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => showToast('Copied'));
  } else {
    const ta = document.createElement('textarea');
    ta.value = text; document.body.appendChild(ta); ta.select();
    try { document.execCommand('copy'); showToast('Copied'); } finally { document.body.removeChild(ta); }
  }
}

// Game state
let settings = loadSettings();
let stats = loadStats();
let validSet = validWordSet(settings.wordLength);
let answer = settings.mode === 'daily' ? pickDailyAnswer() : pickRandomAnswer();
answer = answer.slice(0, settings.wordLength);

let guesses = [];
let evaluations = [];
let current = '';
let isRevealing = false;
let gameOver = false;

function resetGame({ mode = settings.mode, wordLength = settings.wordLength, seededAnswer } = {}) {
  settings.mode = mode;
  settings.wordLength = wordLength;
  saveSettings(settings);
  validSet = validWordSet(settings.wordLength);
  answer = seededAnswer || (mode === 'daily' ? pickDailyAnswer() : pickRandomAnswer());
  answer = answer.slice(0, settings.wordLength);
  guesses = [];
  evaluations = [];
  current = '';
  gameOver = false;
  createRows(settings.wordLength);
  createKeyboard();
  updateKeyboardColors(guesses, evaluations);
}

function bumpTile(rowIdx, colIdx) {
  const tile = qs(`#board .row:nth-child(${rowIdx+1}) .tile:nth-child(${colIdx+1})`);
  if (!tile) return;
  tile.classList.remove('bump');
  void tile.offsetWidth;
  tile.classList.add('bump');
}

function renderCurrent() {
  const row = qs(`#board .row:nth-child(${guesses.length+1})`);
  if (!row) return;
  const chars = current.split('');
  qsa('.tile', row).forEach((tile, idx) => {
    const ch = chars[idx] || '';
    tile.textContent = ch;
    tile.classList.toggle('filled', !!ch);
  });
}

function shakeRow(rowIdx) {
  const row = qs(`#board .row:nth-child(${rowIdx+1})`);
  if (!row) return;
  qsa('.tile', row).forEach(tile => {
    tile.classList.remove('shake');
    void tile.offsetWidth;
    tile.classList.add('shake');
  });
}

async function revealRow(rowIdx, evals) {
  isRevealing = true;
  const row = qs(`#board .row:nth-child(${rowIdx+1})`);
  const tiles = qsa('.tile', row);
  for (let i=0;i<tiles.length;i++) {
    await new Promise(res => setTimeout(res, 250));
    const tile = tiles[i];
    tile.classList.add('revealed', evals[i]);
  }
  isRevealing = false;
}

function submitCurrent() {
  if (isRevealing || gameOver) return;
  if (current.length !== settings.wordLength) { shakeRow(guesses.length); showToast('Not enough letters'); return; }
  if (!validSet.has(current)) { shakeRow(guesses.length); showToast('Not in word list'); return; }
  const evals = evaluateGuess(current, answer);
  guesses.push(current);
  evaluations.push(evals);
  current = '';
  renderCurrent();
  updateKeyboardColors(guesses, evaluations);
  revealRow(guesses.length-1, evals).then(() => {
    const won = evals.every(s => s === 'correct');
    if (won || guesses.length === MAX_GUESSES) {
      gameOver = true;
      const dayKey = getTodayKey();
      const newStats = { ...stats };
      newStats.played += 1;
      const wonNow = won;
      if (wonNow) {
        newStats.wins += 1;
        newStats.streak = (newStats.lastPlayedDay === dayKey ? newStats.streak : 0) + 1;
        newStats.maxStreak = Math.max(newStats.maxStreak, newStats.streak);
        if (guesses.length >= 1 && guesses.length <= 6) newStats.distribution[guesses.length-1] += 1;
      } else {
        newStats.streak = 0;
      }
      newStats.lastPlayedDay = dayKey;
      stats = newStats; saveStats(stats); updateStatsModal(stats);
      if (wonNow) showToast('You win!'); else showToast(answer.toUpperCase());
    }
  });
}

function onKeyPress(key) {
  if (gameOver) return;
  if (key === 'enter') { submitCurrent(); return; }
  if (key === 'backspace') {
    if (current.length > 0) {
      current = current.slice(0, -1);
      renderCurrent();
    }
    return;
  }
  if (/^[a-z]$/.test(key)) {
    if (current.length < settings.wordLength) {
      current += key;
      renderCurrent();
      bumpTile(guesses.length, current.length-1);
    }
    return;
  }
}

function handlePhysicalKeyboard(ev) {
  const key = ev.key.toLowerCase();
  if (key === 'enter' || key === 'backspace' || /^[a-z]$/.test(key)) {
    ev.preventDefault();
    onKeyPress(key);
  }
}

function bindUI() {
  document.addEventListener('keydown', handlePhysicalKeyboard);
  qs('#btn-stats').addEventListener('click', () => {
    updateStatsModal(stats);
    qs('#modal-stats').showModal();
  });
  qs('#btn-settings').addEventListener('click', () => {
    const chk = qs('#toggle-dark');
    chk.checked = settings.dark;
    qs('#word-length').value = String(settings.wordLength);
    qs('#modal-settings').showModal();
  });
  qs('#btn-help').addEventListener('click', () => qs('#modal-help').showModal());
  qs('#toggle-dark').addEventListener('change', (e) => {
    settings.dark = e.target.checked; setDarkMode(settings.dark); saveSettings(settings);
  });
  qs('#word-length').addEventListener('change', (e) => {
    const wl = parseInt(e.target.value, 10);
    resetGame({ wordLength: wl });
  });
  qs('#btn-share').addEventListener('click', (e) => {
    e.preventDefault();
    const title = `Wordlet ${settings.mode === 'daily' ? getTodayKey() : 'Random'}`;
    const grid = serializeBoard(guesses, evaluations);
    copyShare(`${title}\n${guesses.length}/${MAX_GUESSES}\n\n${grid}`);
  });
  qs('#mode-daily').addEventListener('click', () => resetGame({ mode: 'daily' }));
  qs('#mode-random').addEventListener('click', () => resetGame({ mode: 'random' }));
}

function hydrateDark() {
  setDarkMode(settings.dark);
}

function init() {
  createRows(settings.wordLength);
  createKeyboard();
  bindUI();
  hydrateDark();
}

init();

