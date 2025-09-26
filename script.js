"use strict";

(() => {
  const NUM_ROWS = 6;
  const WORD_LENGTH = 5;
  const LS_SETTINGS_KEY = "wyrdl_settings_v1";
  const LS_STATS_KEY = "wyrdl_stats_v1";
  const LS_STATE_KEY = "wyrdl_state_v1";
  const EPOCH_MS = Date.UTC(2022, 0, 1); // Jan 1, 2022 UTC

  /**
   * Minimal 5-letter dictionary. We'll expand later.
   * Include common letters for playability.
   */
  const DICTIONARY = [
    "about","other","which","their","there","first","would","these","thing","think",
    "three","place","great","again","after","world","small","sound","house","point",
    "water","right","paper","group","often","until","never","light","below","ebook",
    "apple","grape","pearl","chair","table","heart","smile","brave","crane","frame",
    "trace","slate","stare","raise","arise","irate","rates","tears","stale","later",
    "cigar","rebut","sissy","humph","awake","blush","focal","evade","naval","serve",
    "heath","dwarf","model","karma","stink","grade","quiet","bench","abate","adobe"
  ].filter(w => w.length === WORD_LENGTH);

  // Runtime state
  let settings = loadSettings();
  applySettingsToDocument(settings);
  let stats = loadStats();
  const dayIndex = getDayIndex();
  let state = loadStateOrCreate(settings.mode);
  let currentRowIndex = state.guesses.length;
  let currentGuess = "";
  let gameStatus = state.status; // 'in_progress' | 'won' | 'lost'
  const usedKeyStates = new Map(); // letter -> state: correct|present|miss

  const boardEl = document.getElementById("board");
  const keyboardEl = document.getElementById("keyboard");
  const toastEl = document.getElementById("toast");
  const modalEl = document.getElementById("modal");
  const modalTitleEl = document.getElementById("modalTitle");
  const modalBodyEl = document.getElementById("modalBody");
  const closeModalBtn = document.getElementById("closeModal");
  const helpBtn = document.getElementById("helpBtn");
  const statsBtn = document.getElementById("statsBtn");
  const settingsBtn = document.getElementById("settingsBtn");

  initBoard();
  initKeyboard();
  bindEvents();
  renderFromState();

  function getDayIndex() {
    const now = Date.now();
    return Math.floor((now - EPOCH_MS) / 86400000);
  }

  function decideDailyTarget(index) {
    // Deterministic daily target based on index cycling through dictionary
    const ix = index % DICTIONARY.length;
    return DICTIONARY[ix];
  }

  function chooseRandomTarget() {
    const ix = Math.floor(Math.random() * DICTIONARY.length);
    return DICTIONARY[ix];
  }

  function defaultSettings() {
    return { mode: "daily", theme: "dark", colorblind: false, animations: true };
  }

  function loadSettings() {
    try {
      const raw = localStorage.getItem(LS_SETTINGS_KEY);
      if (!raw) return defaultSettings();
      const parsed = JSON.parse(raw);
      return { ...defaultSettings(), ...parsed };
    } catch {
      return defaultSettings();
    }
  }

  function saveSettings(next) {
    settings = { ...settings, ...next };
    localStorage.setItem(LS_SETTINGS_KEY, JSON.stringify(settings));
    applySettingsToDocument(settings);
  }

  function applySettingsToDocument(s) {
    document.body.classList.toggle("theme-light", s.theme === "light");
    document.body.classList.toggle("colorblind", Boolean(s.colorblind));
  }

  function defaultStats() {
    return {
      gamesPlayed: 0,
      gamesWon: 0,
      currentStreak: 0,
      maxStreak: 0,
      guessDistribution: [0,0,0,0,0,0], // wins in 1..6
      lastPlayedDay: null,
      lastAnswer: null
    };
  }

  function loadStats() {
    try {
      const raw = localStorage.getItem(LS_STATS_KEY);
      if (!raw) return defaultStats();
      const parsed = JSON.parse(raw);
      const base = defaultStats();
      for (const k in base) if (!(k in parsed)) parsed[k] = base[k];
      return parsed;
    } catch {
      return defaultStats();
    }
  }

  function saveStats() {
    localStorage.setItem(LS_STATS_KEY, JSON.stringify(stats));
  }

  function createNewState(mode) {
    const isDaily = mode === "daily";
    const target = isDaily ? decideDailyTarget(dayIndex) : chooseRandomTarget();
    return {
      mode,
      dayIndex: isDaily ? dayIndex : null,
      target,
      guesses: [],
      status: "in_progress"
    };
  }

  function loadStateOrCreate(mode) {
    try {
      const raw = localStorage.getItem(LS_STATE_KEY);
      if (!raw) return createNewState(mode);
      const parsed = JSON.parse(raw);
      // If mode mismatch or daily rollover, start fresh
      if (parsed.mode !== mode) return createNewState(mode);
      if (mode === "daily" && parsed.dayIndex !== dayIndex) return createNewState(mode);
      if (!parsed.target || parsed.target.length !== WORD_LENGTH) return createNewState(mode);
      if (!Array.isArray(parsed.guesses)) parsed.guesses = [];
      if (!parsed.status) parsed.status = "in_progress";
      return parsed;
    } catch {
      return createNewState(mode);
    }
  }

  function saveState() {
    localStorage.setItem(LS_STATE_KEY, JSON.stringify(state));
  }

  function initBoard() {
    boardEl.innerHTML = "";
    for (let r = 0; r < NUM_ROWS; r++) {
      const row = document.createElement("div");
      row.className = "row";
      for (let c = 0; c < WORD_LENGTH; c++) {
        const tile = document.createElement("div");
        tile.className = "tile";
        tile.setAttribute("data-row", String(r));
        tile.setAttribute("data-col", String(c));
        tile.setAttribute("aria-label", `Row ${r + 1} Column ${c + 1}`);
        row.appendChild(tile);
      }
      boardEl.appendChild(row);
    }
  }

  function initKeyboard() {
    keyboardEl.innerHTML = "";
    const layout = [
      "QWERTYUIOP",
      "ASDFGHJKL",
      "ZXCVBNM"
    ];

    const makeKey = (label, wide = false) => {
      const btn = document.createElement("button");
      btn.className = `key${wide ? " key-wide" : ""}`;
      btn.textContent = label;
      btn.setAttribute("data-key", label);
      btn.setAttribute("aria-label", label);
      btn.addEventListener("click", () => handleKey(label));
      return btn;
    };

    // First row
    for (const ch of layout[0]) keyboardEl.appendChild(makeKey(ch));

    // Spacer columns to center rows visually using CSS grid columns
    keyboardEl.appendChild(spacer(1));
    for (const ch of layout[1]) keyboardEl.appendChild(makeKey(ch));
    keyboardEl.appendChild(spacer(1));

    // Third row with Enter and Backspace
    keyboardEl.appendChild(makeKey("ENTER", true));
    for (const ch of layout[2]) keyboardEl.appendChild(makeKey(ch));
    keyboardEl.appendChild(makeKey("⌫", true));
  }

  function spacer(span) {
    const s = document.createElement("div");
    s.style.gridColumn = `span ${span}`;
    return s;
  }

  function bindEvents() {
    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keydown", onEscapeClose);
    closeModalBtn.addEventListener("click", () => modalEl.close());
    modalEl.addEventListener("click", (e) => {
      if (e.target === modalEl) modalEl.close();
    });
    helpBtn.addEventListener("click", () => openHelp());
    statsBtn.addEventListener("click", () => openStats());
    settingsBtn.addEventListener("click", () => openSettings());
  }

  function onEscapeClose(e) {
    if (e.key === "Escape" && modalEl.open) modalEl.close();
  }

  function onKeyDown(e) {
    if (modalEl.open) return;
    const key = e.key;
    if (key === "Enter") return handleKey("ENTER");
    if (key === "Backspace") return handleKey("⌫");
    const upper = key.toUpperCase();
    if (/^[A-Z]$/.test(upper)) return handleKey(upper);
  }

  function handleKey(label) {
    if (isGameOver()) return;

    if (label === "ENTER") {
      if (currentGuess.length !== WORD_LENGTH) {
        shakeRow(currentRowIndex);
        return showToast("Not enough letters");
      }
      if (!DICTIONARY.includes(currentGuess)) {
        shakeRow(currentRowIndex);
        return showToast("Not in word list");
      }
      submitGuess();
      return;
    }

    if (label === "⌫") {
      if (currentGuess.length > 0) {
        currentGuess = currentGuess.slice(0, -1);
        updateRowTiles();
      }
      return;
    }

    if (/^[A-Z]$/.test(label)) {
      if (currentGuess.length < WORD_LENGTH) {
        currentGuess += label.toLowerCase();
        updateRowTiles();
      }
      return;
    }
  }

  function updateRowTiles() {
    const rowEl = boardEl.children[currentRowIndex];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = rowEl.children[i];
      const ch = currentGuess[i];
      tile.textContent = ch ? ch.toUpperCase() : "";
      tile.classList.toggle("filled", Boolean(ch));
      if (ch && settings.animations) animatePop(tile);
    }
  }

  function submitGuess() {
    state.guesses.push(currentGuess);
    const evaluation = evaluateGuess(currentGuess, state.target);
    revealRow(evaluation);
    updateKeyboardStates(evaluation);

    if (currentGuess === state.target) {
      showToast(randomWinPhrase());
      concludeGame(true);
    } else if (currentRowIndex === NUM_ROWS - 1) {
      showToast(`The word was ${state.target.toUpperCase()}`);
      concludeGame(false);
    } else {
      currentRowIndex += 1;
      currentGuess = "";
      saveState();
    }
  }

  function evaluateGuess(guess, target) {
    const result = new Array(WORD_LENGTH).fill("miss");
    const targetCounts = new Map();
    for (const ch of target) targetCounts.set(ch, (targetCounts.get(ch) || 0) + 1);

    // First pass: correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
      if (guess[i] === target[i]) {
        result[i] = "correct";
        targetCounts.set(guess[i], targetCounts.get(guess[i]) - 1);
      }
    }

    // Second pass: present elsewhere
    for (let i = 0; i < WORD_LENGTH; i++) {
      const ch = guess[i];
      if (result[i] === "correct") continue;
      const remaining = targetCounts.get(ch) || 0;
      if (remaining > 0) {
        result[i] = "present";
        targetCounts.set(ch, remaining - 1);
      }
    }

    return result; // array of 'correct' | 'present' | 'miss'
  }

  function revealRow(evaluation) {
    const rowEl = boardEl.children[currentRowIndex];
    for (let i = 0; i < WORD_LENGTH; i++) {
      const tile = rowEl.children[i];
      tile.classList.add("reveal");
      tile.classList.add(`state-${evaluation[i]}`);
      if (settings.animations) {
        tile.style.animationDelay = `${i * 0.08}s`;
        tile.classList.add("tile-flip");
        tile.addEventListener("animationend", () => tile.classList.remove("tile-flip"), { once: true });
      }
    }
  }

  function updateKeyboardStates(evaluation) {
    for (let i = 0; i < WORD_LENGTH; i++) {
      const letter = currentGuess[i].toUpperCase();
      const state = evaluation[i];
      const prev = usedKeyStates.get(letter);
      if (prev === "correct") continue;
      if (prev === "present" && state === "miss") continue;
      usedKeyStates.set(letter, state);
    }
    for (const btn of keyboardEl.querySelectorAll(".key")) {
      const label = btn.getAttribute("data-key");
      if (!label || label.length !== 1) continue;
      const state = usedKeyStates.get(label);
      btn.classList.remove("state-correct", "state-present", "state-miss");
      if (state) btn.classList.add(`state-${state}`);
    }
  }

  function concludeGame(won) {
    gameStatus = won ? "won" : "lost";
    state.status = gameStatus;
    if (settings.mode === "daily") stats.lastPlayedDay = dayIndex;
    stats.gamesPlayed += 1;
    if (won) {
      stats.gamesWon += 1;
      stats.currentStreak += 1;
      if (stats.currentStreak > stats.maxStreak) stats.maxStreak = stats.currentStreak;
      const guessesUsed = currentRowIndex + 1;
      if (guessesUsed >= 1 && guessesUsed <= 6) stats.guessDistribution[guessesUsed - 1] += 1;
    } else {
      stats.currentStreak = 0;
    }
    stats.lastAnswer = state.target;
    saveStats();
    saveState();
    document.removeEventListener("keydown", onKeyDown);
    setTimeout(() => {
      openStats(won);
    }, 600);
  }

  function showToast(msg) {
    toastEl.textContent = msg;
    toastEl.classList.add("show");
    window.clearTimeout(showToast._t);
    showToast._t = window.setTimeout(() => toastEl.classList.remove("show"), 1200);
  }

  function openHelp() {
    modalTitleEl.textContent = "How to play";
    modalBodyEl.innerHTML = `
      <p>Guess the <strong>${WORD_LENGTH}-letter</strong> word in ${NUM_ROWS} tries.</p>
      <p>Each guess must be a valid word. Press Enter to submit.</p>
      <p>After each guess, the tiles will show how close your guess was.</p>
      <div style="display:flex; gap:8px; margin-top:8px;">
        <div class="tile state-correct" style="width:40px;height:40px;">A</div>
        <div class="tile state-present" style="width:40px;height:40px;">B</div>
        <div class="tile state-miss" style="width:40px;height:40px;">C</div>
      </div>
    `;
    modalEl.showModal();
    requestAnimationFrame(() => closeModalBtn.focus());
  }

  function openStats(won) {
    modalTitleEl.textContent = "Statistics";
    const playedMsg = won === true ? "You won!" : won === false ? "Better luck next time." : "Play a game to see stats.";
    const distBars = stats.guessDistribution.map((n, i) => {
      const totalWins = stats.guessDistribution.reduce((a, b) => a + b, 0) || 1;
      const pct = Math.round((n / totalWins) * 100);
      return `<div class="dist-row"><span>${i + 1}</span><div class="dist-bar" style="width:${Math.max(6, pct)}%"><span>${n}</span></div></div>`;
    }).join("");
    modalBodyEl.innerHTML = `
      <div class="stats-grid">
        <div><div class="stat-num">${stats.gamesPlayed}</div><div class="stat-label">Played</div></div>
        <div><div class="stat-num">${stats.gamesWon}</div><div class="stat-label">Wins</div></div>
        <div><div class="stat-num">${stats.currentStreak}</div><div class="stat-label">Streak</div></div>
        <div><div class="stat-num">${stats.maxStreak}</div><div class="stat-label">Max Streak</div></div>
      </div>
      <p style="margin-top:8px;">${playedMsg}</p>
      <div class="dist">${distBars}</div>
      <div style="display:flex; gap:8px; margin-top:12px;">
        <button id="shareBtn" class="key key-wide">Share</button>
        <button id="newGameBtn" class="key key-wide">${settings.mode === "daily" ? "Practice" : "New Game"}</button>
      </div>
    `;
    modalEl.showModal();
    requestAnimationFrame(() => closeModalBtn.focus());
    const shareBtn = document.getElementById("shareBtn");
    const newGameBtn = document.getElementById("newGameBtn");
    if (shareBtn) shareBtn.addEventListener("click", () => shareResult());
    if (newGameBtn) newGameBtn.addEventListener("click", () => {
      if (settings.mode === "daily") startNewGame("random");
      else startNewGame("random");
      modalEl.close();
    });
  }

  function openSettings() {
    modalTitleEl.textContent = "Settings";
    const isLight = settings.theme === "light";
    const isDaily = settings.mode === "daily";
    const isColorblind = Boolean(settings.colorblind);
    const anim = Boolean(settings.animations);
    modalBodyEl.innerHTML = `
      <div class="settings">
        <label class="setting"><span>Theme</span>
          <select id="themeSelect">
            <option value="dark" ${!isLight ? "selected" : ""}>Dark</option>
            <option value="light" ${isLight ? "selected" : ""}>Light</option>
          </select>
        </label>
        <label class="setting"><span>Colorblind mode</span>
          <input id="cbToggle" type="checkbox" ${isColorblind ? "checked" : ""} />
        </label>
        <label class="setting"><span>Animations</span>
          <input id="animToggle" type="checkbox" ${anim ? "checked" : ""} />
        </label>
        <label class="setting"><span>Game Mode</span>
          <select id="modeSelect">
            <option value="daily" ${isDaily ? "selected" : ""}>Daily</option>
            <option value="random" ${!isDaily ? "selected" : ""}>Random</option>
          </select>
        </label>
      </div>
    `;
    modalEl.showModal();
    requestAnimationFrame(() => closeModalBtn.focus());
    const themeSelect = document.getElementById("themeSelect");
    const modeSelect = document.getElementById("modeSelect");
    const cbToggle = document.getElementById("cbToggle");
    const animToggle = document.getElementById("animToggle");
    if (themeSelect) themeSelect.addEventListener("change", (e) => {
      const v = themeSelect.value === "light" ? "light" : "dark";
      saveSettings({ theme: v });
    });
    if (cbToggle) cbToggle.addEventListener("change", () => {
      saveSettings({ colorblind: cbToggle.checked });
    });
    if (animToggle) animToggle.addEventListener("change", () => {
      saveSettings({ animations: animToggle.checked });
    });
    if (modeSelect) modeSelect.addEventListener("change", () => {
      const nextMode = modeSelect.value === "daily" ? "daily" : "random";
      if (nextMode !== settings.mode) {
        saveSettings({ mode: nextMode });
        startNewGame(nextMode);
        modalEl.close();
      }
    });
  }

  function shareResult() {
    const rows = [];
    for (let r = 0; r <= currentRowIndex; r++) {
      const rowEl = boardEl.children[r];
      const blocks = [];
      for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = rowEl.children[i];
        if (tile.classList.contains("state-correct")) blocks.push("🟩");
        else if (tile.classList.contains("state-present")) blocks.push("🟨");
        else blocks.push("⬜");
      }
      rows.push(blocks.join(""));
    }
    const header = settings.mode === "daily" ? `Wyrdl Daily ${dayIndex}` : "Wyrdl";
    const score = isGameOver() && gameStatus === "won" ? `${currentRowIndex + 1}` : "X";
    const text = `${header} ${score}/${NUM_ROWS}\n` + rows.join("\n");
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).then(() => showToast("Copied results!"));
    } else {
      showToast(text);
    }
  }

  function startNewGame(mode) {
    state = createNewState(mode);
    currentRowIndex = 0;
    currentGuess = "";
    gameStatus = "in_progress";
    usedKeyStates.clear();
    saveSettings({ mode });
    saveState();
    initBoard();
    initKeyboard();
    renderFromState();
    document.addEventListener("keydown", onKeyDown);
  }

  function isGameOver() {
    return gameStatus !== "in_progress";
  }

  function randomWinPhrase() {
    const phrases = [
      "Genius!","Magnificent!","Impressive!","Splendid!","Great!","Phew!"
    ];
    return phrases[Math.floor(Math.random() * phrases.length)];
  }

  function renderFromState() {
    // Apply existing guesses
    for (let r = 0; r < state.guesses.length; r++) {
      const guess = state.guesses[r];
      const rowEl = boardEl.children[r];
      for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = rowEl.children[i];
        const ch = guess[i];
        tile.textContent = ch.toUpperCase();
        tile.classList.add("filled");
      }
      const evaluation = evaluateGuess(guess, state.target);
      for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = rowEl.children[i];
        tile.classList.add("reveal");
        tile.classList.add(`state-${evaluation[i]}`);
      }
      // update keyboard with all letters from this guess
      updateKeyboardStates(evaluation);
    }
    // Restore game status
    if (state.status && state.status !== "in_progress") {
      gameStatus = state.status;
    }
  }

  function animatePop(tile) {
    tile.classList.add("tile-pop");
    tile.addEventListener("animationend", () => tile.classList.remove("tile-pop"), { once: true });
  }

  function shakeRow(rowIndex) {
    const rowEl = boardEl.children[rowIndex];
    if (!rowEl) return;
    rowEl.classList.add("row-shake");
    rowEl.addEventListener("animationend", () => rowEl.classList.remove("row-shake"), { once: true });
  }
})();

