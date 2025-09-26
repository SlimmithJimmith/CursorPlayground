// Game State
let gameState = {
    targetWord: '',
    currentRow: 0,
    currentTile: 0,
    gameOver: false,
    guesses: [],
    evaluations: [],
    keyboardState: {},
    startTime: null,
    practiceMode: false
};

// Statistics
let stats = {
    gamesPlayed: 0,
    gamesWon: 0,
    currentStreak: 0,
    maxStreak: 0,
    guessDistribution: [0, 0, 0, 0, 0, 0],
    totalScore: 0,
    lastPlayed: null,
    lastCompleted: null
};

// Constants
const WORD_LENGTH = 5;
const MAX_GUESSES = 6;
const FLIP_ANIMATION_DURATION = 500;
const DANCE_ANIMATION_DURATION = 500;

// Keyboard layout
const KEYBOARD_LAYOUT = [
    ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
    ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
    ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', '⌫']
];

// Initialize game on load
document.addEventListener('DOMContentLoaded', () => {
    loadStats();
    initializeGame();
    createGameBoard();
    createKeyboard();
    setupEventListeners();
});

// Initialize game
function initializeGame() {
    // Check if it's a new day or practice mode
    const today = new Date().toDateString();
    const lastPlayed = localStorage.getItem('lastPlayed');
    
    if (lastPlayed === today && !gameState.practiceMode) {
        // Player already played today, load their progress
        loadGameState();
    } else {
        // New game for today
        startNewGame();
    }
}

// Start a new game
function startNewGame() {
    // Reset game state
    gameState = {
        targetWord: getWordOfTheDay(),
        currentRow: 0,
        currentTile: 0,
        gameOver: false,
        guesses: [],
        evaluations: [],
        keyboardState: {},
        startTime: Date.now(),
        practiceMode: false
    };
    
    // Clear the board
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.textContent = '';
        tile.className = 'tile';
    });
    
    // Reset keyboard
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (!['ENTER', '⌫'].includes(key.textContent)) {
            key.className = 'key';
        }
    });
    
    saveGameState();
}

// Get word of the day (deterministic based on date)
function getWordOfTheDay() {
    if (gameState.practiceMode) {
        return TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)].toUpperCase();
    }
    
    const today = new Date();
    const start = new Date(2024, 0, 1); // Start date for the game
    const daysSinceStart = Math.floor((today - start) / (1000 * 60 * 60 * 24));
    const wordIndex = daysSinceStart % TARGET_WORDS.length;
    return TARGET_WORDS[wordIndex].toUpperCase();
}

// Create game board
function createGameBoard() {
    const gameBoard = document.getElementById('gameBoard');
    gameBoard.innerHTML = '';
    
    for (let i = 0; i < MAX_GUESSES; i++) {
        const row = document.createElement('div');
        row.className = 'row';
        row.setAttribute('data-row', i);
        
        for (let j = 0; j < WORD_LENGTH; j++) {
            const tile = document.createElement('div');
            tile.className = 'tile';
            tile.setAttribute('data-row', i);
            tile.setAttribute('data-col', j);
            row.appendChild(tile);
        }
        
        gameBoard.appendChild(row);
    }
}

// Create keyboard
function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';
    
    KEYBOARD_LAYOUT.forEach((row, rowIndex) => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';
        
        row.forEach(key => {
            const button = document.createElement('button');
            button.className = 'key';
            button.textContent = key;
            button.setAttribute('data-key', key);
            
            if (key === 'ENTER' || key === '⌫') {
                button.classList.add('wide');
            }
            
            button.addEventListener('click', () => handleKeyPress(key));
            keyboardRow.appendChild(button);
        });
        
        keyboard.appendChild(keyboardRow);
    });
}

// Setup event listeners
function setupEventListeners() {
    // Physical keyboard input
    document.addEventListener('keydown', (e) => {
        if (gameState.gameOver) return;
        
        if (e.key === 'Enter') {
            handleKeyPress('ENTER');
        } else if (e.key === 'Backspace' || e.key === 'Delete') {
            handleKeyPress('⌫');
        } else if (/^[a-zA-Z]$/.test(e.key)) {
            handleKeyPress(e.key.toUpperCase());
        }
    });
    
    // Modal controls
    const helpBtn = document.getElementById('helpBtn');
    const statsBtn = document.getElementById('statsBtn');
    const helpModal = document.getElementById('helpModal');
    const statsModal = document.getElementById('statsModal');
    const closeBtns = document.querySelectorAll('.close');
    
    helpBtn.addEventListener('click', () => showModal(helpModal));
    statsBtn.addEventListener('click', () => {
        updateStatsDisplay();
        showModal(statsModal);
    });
    
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            hideModal(e.target.closest('.modal'));
        });
    });
    
    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        if (e.target.classList.contains('modal')) {
            hideModal(e.target);
        }
    });
    
    // Share and new game buttons
    const shareBtn = document.getElementById('shareBtn');
    const newGameBtn = document.getElementById('newGameBtn');
    
    shareBtn.addEventListener('click', shareResults);
    newGameBtn.addEventListener('click', startPracticeGame);
}

// Handle key press
function handleKeyPress(key) {
    if (gameState.gameOver) return;
    
    if (key === 'ENTER') {
        submitGuess();
    } else if (key === '⌫') {
        deleteLetter();
    } else if (/^[A-Z]$/.test(key)) {
        addLetter(key);
    }
}

// Add letter to current position
function addLetter(letter) {
    if (gameState.currentTile < WORD_LENGTH) {
        const tile = document.querySelector(
            `.tile[data-row="${gameState.currentRow}"][data-col="${gameState.currentTile}"]`
        );
        tile.textContent = letter;
        tile.classList.add('filled');
        gameState.currentTile++;
    }
}

// Delete last letter
function deleteLetter() {
    if (gameState.currentTile > 0) {
        gameState.currentTile--;
        const tile = document.querySelector(
            `.tile[data-row="${gameState.currentRow}"][data-col="${gameState.currentTile}"]`
        );
        tile.textContent = '';
        tile.classList.remove('filled');
    }
}

// Submit guess
function submitGuess() {
    if (gameState.currentTile !== WORD_LENGTH) {
        showMessage('Not enough letters', 'error');
        shakeRow(gameState.currentRow);
        return;
    }
    
    const guess = getCurrentGuess();
    
    if (!isValidWord(guess)) {
        showMessage('Not in word list', 'error');
        shakeRow(gameState.currentRow);
        return;
    }
    
    // Evaluate the guess
    const evaluation = evaluateGuess(guess);
    gameState.guesses.push(guess);
    gameState.evaluations.push(evaluation);
    
    // Reveal tiles with animation
    revealTiles(evaluation);
    
    // Update keyboard
    updateKeyboard(guess, evaluation);
    
    // Check win/lose conditions
    if (guess === gameState.targetWord) {
        setTimeout(() => {
            endGame(true);
        }, FLIP_ANIMATION_DURATION * WORD_LENGTH);
    } else if (gameState.currentRow === MAX_GUESSES - 1) {
        setTimeout(() => {
            endGame(false);
        }, FLIP_ANIMATION_DURATION * WORD_LENGTH);
    } else {
        // Move to next row
        gameState.currentRow++;
        gameState.currentTile = 0;
        saveGameState();
    }
}

// Get current guess from tiles
function getCurrentGuess() {
    let guess = '';
    for (let i = 0; i < WORD_LENGTH; i++) {
        const tile = document.querySelector(
            `.tile[data-row="${gameState.currentRow}"][data-col="${i}"]`
        );
        guess += tile.textContent;
    }
    return guess;
}

// Check if word is valid
function isValidWord(word) {
    return VALID_WORDS.includes(word.toLowerCase()) || 
           TARGET_WORDS.includes(word.toLowerCase());
}

// Evaluate guess against target word
function evaluateGuess(guess) {
    const evaluation = [];
    const targetLetters = gameState.targetWord.split('');
    const guessLetters = guess.split('');
    
    // First pass: mark correct positions
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] === targetLetters[i]) {
            evaluation[i] = 'correct';
            targetLetters[i] = null;
            guessLetters[i] = null;
        }
    }
    
    // Second pass: mark present letters
    for (let i = 0; i < WORD_LENGTH; i++) {
        if (guessLetters[i] !== null) {
            const targetIndex = targetLetters.indexOf(guessLetters[i]);
            if (targetIndex !== -1) {
                evaluation[i] = 'present';
                targetLetters[targetIndex] = null;
            } else {
                evaluation[i] = 'absent';
            }
        }
    }
    
    return evaluation;
}

// Reveal tiles with animation
function revealTiles(evaluation) {
    evaluation.forEach((status, index) => {
        setTimeout(() => {
            const tile = document.querySelector(
                `.tile[data-row="${gameState.currentRow}"][data-col="${index}"]`
            );
            tile.classList.add('reveal', status);
        }, index * 100);
    });
}

// Update keyboard colors
function updateKeyboard(guess, evaluation) {
    guess.split('').forEach((letter, index) => {
        const key = document.querySelector(`.key[data-key="${letter}"]`);
        const status = evaluation[index];
        
        // Only update if new status is better than current
        const currentStatus = gameState.keyboardState[letter];
        if (!currentStatus || 
            status === 'correct' || 
            (status === 'present' && currentStatus === 'absent')) {
            gameState.keyboardState[letter] = status;
            
            setTimeout(() => {
                key.className = `key ${status}`;
            }, FLIP_ANIMATION_DURATION);
        }
    });
}

// Shake row animation
function shakeRow(rowIndex) {
    const tiles = document.querySelectorAll(`.tile[data-row="${rowIndex}"]`);
    tiles.forEach(tile => {
        tile.classList.add('shake');
        setTimeout(() => tile.classList.remove('shake'), 500);
    });
}

// End game
function endGame(won) {
    gameState.gameOver = true;
    
    if (won) {
        const timeElapsed = Math.floor((Date.now() - gameState.startTime) / 1000);
        const score = calculateScore(gameState.currentRow + 1, timeElapsed);
        
        showMessage(`Excellent! +${score} points`, 'success');
        
        // Animate winning row
        const tiles = document.querySelectorAll(`.tile[data-row="${gameState.currentRow}"]`);
        tiles.forEach((tile, index) => {
            setTimeout(() => {
                tile.classList.add('bounce');
            }, index * 100);
        });
        
        // Update stats
        if (!gameState.practiceMode) {
            updateStats(true, gameState.currentRow + 1, score);
        }
    } else {
        showMessage(`The word was ${gameState.targetWord}`, 'info');
        
        // Update stats
        if (!gameState.practiceMode) {
            updateStats(false, 0, 0);
        }
    }
    
    // Show stats modal after delay
    setTimeout(() => {
        updateStatsDisplay();
        showModal(document.getElementById('statsModal'));
    }, 2000);
    
    saveGameState();
}

// Calculate score
function calculateScore(guesses, timeInSeconds) {
    let score = 0;
    
    // Base score for winning
    score += 100;
    
    // Bonus for fewer guesses
    score += (7 - guesses) * 50;
    
    // Speed bonus (under 60 seconds)
    if (timeInSeconds < 60) {
        score += 100;
    } else if (timeInSeconds < 120) {
        score += 50;
    }
    
    // Streak bonus
    score += Math.min(stats.currentStreak * 10, 100);
    
    return score;
}

// Update statistics
function updateStats(won, guesses, score) {
    stats.gamesPlayed++;
    
    if (won) {
        stats.gamesWon++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
        stats.guessDistribution[guesses - 1]++;
        stats.totalScore += score;
    } else {
        stats.currentStreak = 0;
    }
    
    stats.lastPlayed = new Date().toDateString();
    stats.lastCompleted = new Date().toDateString();
    
    saveStats();
}

// Update statistics display
function updateStatsDisplay() {
    document.getElementById('totalPlayed').textContent = stats.gamesPlayed;
    document.getElementById('winPercentage').textContent = 
        stats.gamesPlayed > 0 ? Math.round((stats.gamesWon / stats.gamesPlayed) * 100) : 0;
    document.getElementById('currentStreak').textContent = stats.currentStreak;
    document.getElementById('maxStreak').textContent = stats.maxStreak;
    document.getElementById('totalScore').textContent = stats.totalScore.toLocaleString();
    
    // Update guess distribution
    const distribution = document.getElementById('guessDistribution');
    distribution.innerHTML = '';
    
    const maxDistribution = Math.max(...stats.guessDistribution, 1);
    
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'distribution-row';
        
        const label = document.createElement('div');
        label.className = 'guess-number';
        label.textContent = i + 1;
        
        const bar = document.createElement('div');
        bar.className = 'bar';
        const width = stats.guessDistribution[i] > 0 
            ? Math.max((stats.guessDistribution[i] / maxDistribution) * 100, 7)
            : 7;
        bar.style.width = `${width}%`;
        bar.textContent = stats.guessDistribution[i];
        
        // Highlight if this was the last game's result
        if (gameState.gameOver && gameState.currentRow === i && !gameState.practiceMode) {
            bar.classList.add('highlight');
        }
        
        row.appendChild(label);
        row.appendChild(bar);
        distribution.appendChild(row);
    }
}

// Share results
function shareResults() {
    if (!gameState.gameOver) return;
    
    const won = gameState.guesses[gameState.guesses.length - 1] === gameState.targetWord;
    const attempts = won ? gameState.currentRow + 1 : 'X';
    
    let shareText = `Lexicon ${attempts}/6\n\n`;
    
    // Build emoji grid
    gameState.evaluations.forEach(evaluation => {
        evaluation.forEach(status => {
            if (status === 'correct') shareText += '🟩';
            else if (status === 'present') shareText += '🟨';
            else shareText += '⬜';
        });
        shareText += '\n';
    });
    
    shareText += `\nStreak: ${stats.currentStreak} 🔥\n`;
    shareText += `Score: ${stats.totalScore.toLocaleString()} 💎`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareText).then(() => {
        showMessage('Results copied to clipboard!', 'success');
    }).catch(() => {
        showMessage('Failed to copy results', 'error');
    });
}

// Start practice game
function startPracticeGame() {
    gameState.practiceMode = true;
    gameState.targetWord = TARGET_WORDS[Math.floor(Math.random() * TARGET_WORDS.length)].toUpperCase();
    
    // Reset game
    gameState.currentRow = 0;
    gameState.currentTile = 0;
    gameState.gameOver = false;
    gameState.guesses = [];
    gameState.evaluations = [];
    gameState.keyboardState = {};
    gameState.startTime = Date.now();
    
    // Clear board
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.textContent = '';
        tile.className = 'tile';
    });
    
    // Reset keyboard
    const keys = document.querySelectorAll('.key');
    keys.forEach(key => {
        if (!['ENTER', '⌫'].includes(key.textContent)) {
            key.className = 'key';
        }
    });
    
    hideModal(document.getElementById('statsModal'));
    showMessage('Practice mode - This won\'t affect your stats!', 'info');
}

// Show message
function showMessage(text, type) {
    const message = document.getElementById('message');
    message.textContent = text;
    message.className = `message show ${type}`;
    
    setTimeout(() => {
        message.classList.remove('show');
    }, 3000);
}

// Show modal
function showModal(modal) {
    modal.classList.add('show');
}

// Hide modal
function hideModal(modal) {
    modal.classList.remove('show');
}

// Save game state
function saveGameState() {
    localStorage.setItem('gameState', JSON.stringify(gameState));
    localStorage.setItem('lastPlayed', new Date().toDateString());
}

// Load game state
function loadGameState() {
    const saved = localStorage.getItem('gameState');
    const lastPlayed = localStorage.getItem('lastPlayed');
    const today = new Date().toDateString();
    
    if (saved && lastPlayed === today) {
        gameState = JSON.parse(saved);
        
        // Restore board
        gameState.guesses.forEach((guess, rowIndex) => {
            guess.split('').forEach((letter, colIndex) => {
                const tile = document.querySelector(
                    `.tile[data-row="${rowIndex}"][data-col="${colIndex}"]`
                );
                tile.textContent = letter;
                tile.classList.add('filled', 'reveal', gameState.evaluations[rowIndex][colIndex]);
            });
        });
        
        // Restore keyboard
        Object.keys(gameState.keyboardState).forEach(letter => {
            const key = document.querySelector(`.key[data-key="${letter}"]`);
            if (key) {
                key.classList.add(gameState.keyboardState[letter]);
            }
        });
        
        // Check if game was already completed
        if (gameState.gameOver) {
            showMessage('You already played today! Try practice mode.', 'info');
        }
    } else {
        startNewGame();
    }
}

// Save statistics
function saveStats() {
    localStorage.setItem('statistics', JSON.stringify(stats));
}

// Load statistics
function loadStats() {
    const saved = localStorage.getItem('statistics');
    if (saved) {
        stats = JSON.parse(saved);
    }
}