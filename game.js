// Wordle Clone Game Logic

// Valid 5-letter words for the game
const WORDS = [
    'REACT', 'WORLD', 'HOUSE', 'PLANE', 'SNAKE', 'BREAD', 'CHAIR', 'CLOUD',
    'DANCE', 'EARTH', 'FLAME', 'GRASS', 'HEART', 'IMAGE', 'JEWEL', 'KNIFE',
    'LEMON', 'MUSIC', 'NIGHT', 'OCEAN', 'PIANO', 'QUEEN', 'RIVER', 'SHARK',
    'TIGER', 'UNCLE', 'VIRUS', 'WHEAT', 'XYLEM', 'YACHT', 'ZEBRA', 'ANGEL',
    'BRAIN', 'COMET', 'DREAM', 'EAGLE', 'FIBER', 'GHOST', 'HONEY', 'IVORY',
    'JOKER', 'KOALA', 'LASER', 'MAGIC', 'NOBLE', 'OLIVE', 'PIZZA', 'QUILT',
    'RADIO', 'SNAIL', 'TEMPO', 'UNITY', 'VAPOR', 'WHALE', 'YOUNG', 'ZONES'
];

// Game state variables
let targetWord = '';
let currentRow = 0;
let currentCell = 0;
let gameOver = false;
let score = 0;
let gamesPlayed = 0;
let gamesWon = 0;
let currentStreak = 0;
let maxStreak = 0;
let guessDistribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};

// DOM elements
const messageEl = document.getElementById('message');
const attemptsEl = document.getElementById('attempts');
const scoreEl = document.getElementById('score');
const newGameBtn = document.getElementById('new-game-btn');
const statsBtn = document.getElementById('stats-btn');
const shareBtn = document.getElementById('share-btn');
const statsModal = document.getElementById('stats-modal');
const closeStatsBtn = document.getElementById('close-stats');
const keyboardKeys = document.querySelectorAll('.key');

// Load statistics from localStorage
function loadStats() {
    const stats = localStorage.getItem('wordleStats');
    if (stats) {
        const parsedStats = JSON.parse(stats);
        gamesPlayed = parsedStats.gamesPlayed || 0;
        gamesWon = parsedStats.gamesWon || 0;
        currentStreak = parsedStats.currentStreak || 0;
        maxStreak = parsedStats.maxStreak || 0;
        guessDistribution = parsedStats.guessDistribution || {1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0};
    }
}

// Save statistics to localStorage
function saveStats() {
    const stats = {
        gamesPlayed,
        gamesWon,
        currentStreak,
        maxStreak,
        guessDistribution
    };
    localStorage.setItem('wordleStats', JSON.stringify(stats));
}

// Initialize game
function initGame() {
    loadStats();

    targetWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    currentRow = 0;
    currentCell = 0;
    gameOver = false;
    score = 0;

    // Reset game board
    document.querySelectorAll('.cell').forEach(cell => {
        cell.textContent = '';
        cell.className = 'cell';
    });

    // Reset keyboard
    document.querySelectorAll('.key').forEach(key => {
        key.className = 'key';
    });

    // Reset UI
    messageEl.textContent = '';
    updateStatsDisplay();

    console.log('Target word:', targetWord); // For debugging
}

// Update statistics display
function updateStatsDisplay() {
    const winPercentage = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    attemptsEl.textContent = `Attempts: 0/6 | Games: ${gamesPlayed} | Wins: ${winPercentage}%`;
    scoreEl.textContent = `Score: ${score} | Streak: ${currentStreak} | Max: ${maxStreak}`;
}

// Check if word is valid (5 letters)
function isValidWord(word) {
    return word.length === 5 && /^[A-Z]+$/.test(word);
}

// Handle letter input
function handleLetterInput(letter) {
    if (gameOver || currentCell >= 5) return;

    const cell = document.querySelector(`#row-${currentRow} .cell[data-pos="${currentCell}"]`);
    cell.textContent = letter;
    cell.classList.add('filled');
    currentCell++;
}

// Handle backspace
function handleBackspace() {
    if (gameOver || currentCell <= 0) return;

    currentCell--;
    const cell = document.querySelector(`#row-${currentRow} .cell[data-pos="${currentCell}"]`);
    cell.textContent = '';
    cell.classList.remove('filled');
}

// Handle enter/guess submission
function handleEnter() {
    if (gameOver) return;

    if (currentCell < 5) {
        showMessage('Not enough letters!');
        shakeRow();
        return;
    }

    const guess = getCurrentGuess();
    if (!isValidWord(guess)) {
        showMessage('Not a valid word!');
        shakeRow();
        return;
    }

    // Check the guess
    checkGuess(guess);
    currentRow++;
    currentCell = 0;

    if (currentRow >= 6) {
        gameOver = true;
        gamesPlayed++;
        currentStreak = 0;
        updateStatsDisplay();
        saveStats();

        setTimeout(() => {
            showMessage(`Game Over! The word was ${targetWord}`);
        }, 500);
    }
}

// Get current guess from the board
function getCurrentGuess() {
    const cells = document.querySelectorAll(`#row-${currentRow} .cell`);
    return Array.from(cells).map(cell => cell.textContent).join('');
}

// Check guess against target word
function checkGuess(guess) {
    const guessArray = guess.split('');
    const targetArray = targetWord.split('');
    const result = [];

    // First pass: check for correct positions (green)
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === targetArray[i]) {
            result[i] = 'correct';
            guessArray[i] = null; // Mark as used
            targetArray[i] = null; // Mark as used
        }
    }

    // Second pass: check for correct letters in wrong positions (yellow)
    for (let i = 0; i < 5; i++) {
        if (result[i] !== 'correct' && guessArray[i] !== null) {
            const targetIndex = targetArray.indexOf(guessArray[i]);
            if (targetIndex !== -1) {
                result[i] = 'present';
                targetArray[targetIndex] = null; // Mark as used
            } else {
                result[i] = 'absent';
            }
        }
    }

    // Apply results to board
    setTimeout(() => {
        const cells = document.querySelectorAll(`#row-${currentRow} .cell`);
        cells.forEach((cell, index) => {
            cell.classList.add(result[index]);
            cell.style.animationDelay = `${index * 0.1}s`;
            cell.classList.add('flip');
        });

        // Update keyboard colors
        updateKeyboardColors(guessArray, result);

        // Check win condition
        if (guess === targetWord) {
            gameOver = true;
            const pointsEarned = (6 - currentRow) * 10 + 50; // Base points + bonus for fewer attempts
            score += pointsEarned;
            gamesWon++;
            currentStreak++;
            if (currentStreak > maxStreak) {
                maxStreak = currentStreak;
            }
            gamesPlayed++;

            // Track guess distribution
            guessDistribution[currentRow + 1]++;

            updateStatsDisplay();
            saveStats();

            setTimeout(() => {
                showMessage(`Congratulations! You won! +${pointsEarned} points`);
            }, 500);
        } else {
            attemptsEl.textContent = `Attempts: ${currentRow + 1}/6`;
        }
    }, 100);
}

// Update keyboard colors based on guess results
function updateKeyboardColors(guessArray, result) {
    guessArray.forEach((letter, index) => {
        if (letter === null) return;

        const key = document.querySelector(`[data-letter="${letter}"]`);
        if (!key) return;

        // Only update if the new state is "better" than the current state
        if (result[index] === 'correct' && !key.classList.contains('correct')) {
            key.className = 'key correct';
        } else if (result[index] === 'present' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.className = 'key present';
        } else if (result[index] === 'absent' && !key.classList.contains('correct') && !key.classList.contains('present')) {
            key.className = 'key absent';
        }
    });
}

// Show message with animation
function showMessage(text) {
    messageEl.textContent = text;
    messageEl.classList.add('pop');
    setTimeout(() => {
        messageEl.classList.remove('pop');
    }, 300);
}

// Shake current row animation
function shakeRow() {
    const row = document.getElementById(`row-${currentRow}`);
    row.classList.add('shake');
    setTimeout(() => {
        row.classList.remove('shake');
    }, 500);
}

// Show statistics modal
function showStats() {
    updateStatsModal();
    statsModal.classList.add('show');
}

// Hide statistics modal
function hideStats() {
    statsModal.classList.remove('show');
}

// Update statistics modal content
function updateStatsModal() {
    const gamesPlayedEl = document.getElementById('games-played');
    const winPercentageEl = document.getElementById('win-percentage');
    const currentStreakEl = document.getElementById('current-streak');
    const maxStreakEl = document.getElementById('max-streak');
    const guessDistEl = document.getElementById('guess-dist');

    const winPercentage = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;

    gamesPlayedEl.textContent = gamesPlayed;
    winPercentageEl.textContent = `${winPercentage}%`;
    currentStreakEl.textContent = currentStreak;
    maxStreakEl.textContent = maxStreak;

    // Update guess distribution
    guessDistEl.innerHTML = '';
    const maxGuesses = Math.max(...Object.values(guessDistribution));

    for (let i = 1; i <= 6; i++) {
        const count = guessDistribution[i];
        const percentage = maxGuesses > 0 ? (count / maxGuesses) * 100 : 0;

        const barDiv = document.createElement('div');
        barDiv.className = 'distribution-bar';
        barDiv.innerHTML = `
            <span class="distribution-label">${i}</span>
            <span class="distribution-value">${count}</span>
            <div class="distribution-visual" style="width: ${percentage}%"></div>
        `;
        guessDistEl.appendChild(barDiv);
    }
}

// Share game results
function shareResults() {
    if (gamesPlayed === 0) {
        showMessage('No games played yet!');
        return;
    }

    const winPercentage = gamesPlayed > 0 ? Math.round((gamesWon / gamesPlayed) * 100) : 0;
    const shareText = `Wordle Clone Stats\nGames: ${gamesPlayed}\nWins: ${winPercentage}%\nCurrent Streak: ${currentStreak}\nMax Streak: ${maxStreak}`;

    if (navigator.share) {
        navigator.share({
            title: 'Wordle Clone Stats',
            text: shareText
        });
    } else {
        navigator.clipboard.writeText(shareText).then(() => {
            showMessage('Stats copied to clipboard!');
        });
    }
}

// Event listeners
document.addEventListener('keydown', (e) => {
    if (gameOver) return;

    const key = e.key.toUpperCase();

    if (key === 'ENTER') {
        handleEnter();
    } else if (key === 'BACKSPACE') {
        handleBackspace();
    } else if (/^[A-Z]$/.test(key)) {
        handleLetterInput(key);
    }

    // Close modal with Escape key
    if (e.key === 'Escape' && statsModal.classList.contains('show')) {
        hideStats();
    }
});

// Keyboard button clicks
document.querySelectorAll('.key').forEach(key => {
    key.addEventListener('click', () => {
        if (gameOver) return;

        const letter = key.dataset.letter;
        const action = key.dataset.action;

        if (action === 'ENTER') {
            handleEnter();
        } else if (action === 'BACKSPACE') {
            handleBackspace();
        } else if (letter) {
            handleLetterInput(letter);
        }
    });
});

// Button event listeners
newGameBtn.addEventListener('click', initGame);
statsBtn.addEventListener('click', showStats);
shareBtn.addEventListener('click', shareResults);
closeStatsBtn.addEventListener('click', hideStats);

// Close modal when clicking outside
statsModal.addEventListener('click', (e) => {
    if (e.target === statsModal) {
        hideStats();
    }
});

// Start the game
initGame();