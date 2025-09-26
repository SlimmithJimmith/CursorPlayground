class WordGuessGame {
    constructor() {
        this.wordList = [
            'ABOUT', 'ABOVE', 'ABUSE', 'ACTOR', 'ACUTE', 'ADMIT', 'ADOPT', 'ADULT', 'AFTER', 'AGAIN',
            'AGENT', 'AGREE', 'AHEAD', 'ALARM', 'ALBUM', 'ALERT', 'ALIEN', 'ALIGN', 'ALIKE', 'ALIVE',
            'ALLOW', 'ALONE', 'ALONG', 'ALTER', 'AMONG', 'ANGER', 'ANGLE', 'ANGRY', 'APART', 'APPLE',
            'APPLY', 'ARENA', 'ARGUE', 'ARISE', 'ARRAY', 'ASIDE', 'ASSET', 'AVOID', 'AWAKE', 'AWARD',
            'AWARE', 'BADLY', 'BAKER', 'BASES', 'BASIC', 'BEACH', 'BEGAN', 'BEGIN', 'BEING', 'BELOW',
            'BENCH', 'BILLY', 'BIRTH', 'BLACK', 'BLAME', 'BLANK', 'BLIND', 'BLOCK', 'BLOOD', 'BOARD',
            'BOOST', 'BOOTH', 'BOUND', 'BRAIN', 'BRAND', 'BRASS', 'BRAVE', 'BREAD', 'BREAK', 'BREED',
            'BRIEF', 'BRING', 'BROAD', 'BROKE', 'BROWN', 'BUILD', 'BUILT', 'BUYER', 'CABLE', 'CALIF',
            'CARRY', 'CATCH', 'CAUSE', 'CHAIN', 'CHAIR', 'CHAOS', 'CHARM', 'CHART', 'CHASE', 'CHEAP',
            'CHECK', 'CHEST', 'CHIEF', 'CHILD', 'CHINA', 'CHOSE', 'CIVIL', 'CLAIM', 'CLASS', 'CLEAN',
            'CLEAR', 'CLICK', 'CLIMB', 'CLOCK', 'CLOSE', 'CLOUD', 'COACH', 'COAST', 'COULD', 'COUNT',
            'COURT', 'COVER', 'CRAFT', 'CRASH', 'CRAZY', 'CREAM', 'CRIME', 'CROSS', 'CROWD', 'CROWN',
            'CRUDE', 'CURVE', 'CYCLE', 'DAILY', 'DANCE', 'DATED', 'DEALT', 'DEATH', 'DEBUT', 'DELAY',
            'DEPTH', 'DOING', 'DOUBT', 'DOZEN', 'DRAFT', 'DRAMA', 'DRANK', 'DRAWN', 'DREAM', 'DRESS',
            'DRILL', 'DRINK', 'DRIVE', 'DROVE', 'DYING', 'EAGER', 'EARLY', 'EARTH', 'EIGHT', 'ELITE',
            'EMPTY', 'ENEMY', 'ENJOY', 'ENTER', 'ENTRY', 'EQUAL', 'ERROR', 'EVENT', 'EVERY', 'EXACT',
            'EXIST', 'EXTRA', 'FAITH', 'FALSE', 'FAULT', 'FIBER', 'FIELD', 'FIFTH', 'FIFTY', 'FIGHT',
            'FINAL', 'FIRST', 'FIXED', 'FLASH', 'FLEET', 'FLOOR', 'FLUID', 'FOCUS', 'FORCE', 'FORTH',
            'FORTY', 'FORUM', 'FOUND', 'FRAME', 'FRANK', 'FRAUD', 'FRESH', 'FRONT', 'FROST', 'FRUIT',
            'FULLY', 'FUNNY', 'GIANT', 'GIVEN', 'GLASS', 'GLOBE', 'GOING', 'GRACE', 'GRADE', 'GRAND',
            'GRANT', 'GRASS', 'GRAVE', 'GREAT', 'GREEN', 'GROSS', 'GROUP', 'GROWN', 'GUARD', 'GUESS',
            'GUEST', 'GUIDE', 'HAPPY', 'HARRY', 'HEART', 'HEAVY', 'HORSE', 'HOTEL', 'HOUSE', 'HUMAN',
            'IDEAL', 'IMAGE', 'INDEX', 'INNER', 'INPUT', 'ISSUE', 'JAPAN', 'JIMMY', 'JOINT', 'JONES',
            'JUDGE', 'KNOWN', 'LABEL', 'LARGE', 'LASER', 'LATER', 'LAUGH', 'LAYER', 'LEARN', 'LEASE',
            'LEAST', 'LEAVE', 'LEGAL', 'LEVEL', 'LEWIS', 'LIGHT', 'LIMIT', 'LINKS', 'LIVES', 'LOCAL',
            'LOOSE', 'LOWER', 'LUCKY', 'LUNCH', 'LYING', 'MAGIC', 'MAJOR', 'MAKER', 'MARCH', 'MARIA',
            'MATCH', 'MAYBE', 'MAYOR', 'MEANT', 'MEDIA', 'METAL', 'MIGHT', 'MINOR', 'MINUS', 'MIXED',
            'MODEL', 'MONEY', 'MONTH', 'MORAL', 'MOTOR', 'MOUNT', 'MOUSE', 'MOUTH', 'MOVED', 'MOVIE',
            'NEEDS', 'NEVER', 'NEWLY', 'NIGHT', 'NOISE', 'NORTH', 'NOTED', 'NOVEL', 'NURSE', 'OCCUR',
            'OCEAN', 'OFFER', 'OFTEN', 'ORDER', 'OTHER', 'OUGHT', 'PAINT', 'PANEL', 'PAPER', 'PARTY',
            'PEACE', 'PETER', 'PHASE', 'PHONE', 'PHOTO', 'PIANO', 'PIECE', 'PILOT', 'PITCH', 'PLACE',
            'PLAIN', 'PLANE', 'PLANT', 'PLATE', 'PLAZA', 'PLOT', 'PLUG', 'PLUS', 'POINT', 'POUND',
            'POWER', 'PRESS', 'PRICE', 'PRIDE', 'PRIME', 'PRINT', 'PRIOR', 'PRIZE', 'PROOF', 'PROUD',
            'PROVE', 'QUEEN', 'QUICK', 'QUIET', 'QUITE', 'RADIO', 'RAISE', 'RANGE', 'RAPID', 'RATIO',
            'REACH', 'READY', 'REALM', 'REBEL', 'REFER', 'RELAX', 'REPAY', 'REPLY', 'RIGHT', 'RIGID',
            'RIVER', 'ROBIN', 'ROGER', 'ROMAN', 'ROUGH', 'ROUND', 'ROUTE', 'ROYAL', 'RURAL', 'SCALE',
            'SCENE', 'SCOPE', 'SCORE', 'SENSE', 'SERVE', 'SETUP', 'SEVEN', 'SHALL', 'SHAPE', 'SHARE',
            'SHARP', 'SHEET', 'SHELF', 'SHELL', 'SHIFT', 'SHINE', 'SHIRT', 'SHOCK', 'SHOOT', 'SHORT',
            'SHOWN', 'SIDED', 'SIGHT', 'SILLY', 'SINCE', 'SIXTY', 'SIZED', 'SKILL', 'SLEEP', 'SLIDE',
            'SMALL', 'SMART', 'SMILE', 'SMITH', 'SMOKE', 'SNAKE', 'SNOW', 'SOLAR', 'SOLID', 'SOLVE',
            'SORRY', 'SOUND', 'SOUTH', 'SPACE', 'SPARE', 'SPEAK', 'SPEED', 'SPEND', 'SPENT', 'SPLIT',
            'SPOKE', 'SPORT', 'STAFF', 'STAGE', 'STAKE', 'STAND', 'START', 'STATE', 'STEAM', 'STEEL',
            'STEEP', 'STEER', 'STEPS', 'STICK', 'STILL', 'STOCK', 'STONE', 'STOOD', 'STORE', 'STORM',
            'STORY', 'STRIP', 'STUCK', 'STUDY', 'STUFF', 'STYLE', 'SUGAR', 'SUITE', 'SUPER', 'SWEET',
            'TABLE', 'TAKEN', 'TASTE', 'TAXES', 'TEACH', 'TEETH', 'TERRY', 'TEXAS', 'THANK', 'THEFT',
            'THEIR', 'THEME', 'THERE', 'THESE', 'THICK', 'THING', 'THINK', 'THIRD', 'THOSE', 'THREE',
            'THREW', 'THROW', 'THUMB', 'TIGHT', 'TIMER', 'TIMES', 'TITLE', 'TODAY', 'TOPIC', 'TOTAL',
            'TOUCH', 'TOUGH', 'TOWER', 'TRACK', 'TRADE', 'TRAIN', 'TREAT', 'TREND', 'TRIAL', 'TRIBE',
            'TRICK', 'TRIED', 'TRIES', 'TRUCK', 'TRULY', 'TRUNK', 'TRUST', 'TRUTH', 'TWICE', 'TWIST',
            'TYLER', 'UNDER', 'UNDUE', 'UNION', 'UNITY', 'UNTIL', 'UPPER', 'UPSET', 'URBAN', 'USAGE',
            'USUAL', 'VALID', 'VALUE', 'VIDEO', 'VIRUS', 'VISIT', 'VITAL', 'VOCAL', 'WASTE', 'WATCH',
            'WATER', 'WAVES', 'WAYS', 'WEIRD', 'WELSH', 'WHEEL', 'WHERE', 'WHICH', 'WHILE', 'WHITE',
            'WHOLE', 'WHOSE', 'WOMAN', 'WOMEN', 'WORLD', 'WORRY', 'WORSE', 'WORST', 'WORTH', 'WOULD',
            'WRITE', 'WRONG', 'WROTE', 'YOUNG', 'YOUTH'
        ];
        
        this.currentWord = '';
        this.currentGuess = '';
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.startTime = null;
        this.endTime = null;
        this.attempts = 0;
        this.maxAttempts = 6;
        this.hintsUsed = 0;
        this.maxHints = 2;
        
        this.stats = this.loadStats();
        this.initializeGame();
        this.setupEventListeners();
    }

    initializeGame() {
        this.currentWord = this.wordList[Math.floor(Math.random() * this.wordList.length)];
        this.currentGuess = '';
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameStarted = false;
        this.gameEnded = false;
        this.startTime = null;
        this.endTime = null;
        this.attempts = 0;
        this.hintsUsed = 0;
        
        this.createGameBoard();
        this.createKeyboard();
        this.updateStats();
        this.updateTimer();
        this.updateAttempts();
        
        console.log('Word to guess:', this.currentWord); // For debugging
    }

    createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let row = 0; row < 6; row++) {
            const rowElement = document.createElement('div');
            rowElement.className = 'row';
            rowElement.id = `row-${row}`;
            
            for (let col = 0; col < 5; col++) {
                const letterElement = document.createElement('div');
                letterElement.className = 'letter';
                letterElement.id = `letter-${row}-${col}`;
                rowElement.appendChild(letterElement);
            }
            
            gameBoard.appendChild(rowElement);
        }
    }

    createKeyboard() {
        const keyboard = document.getElementById('keyboard');
        keyboard.innerHTML = '';
        
        const keyboardLayout = [
            ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
            ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
            ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
        ];
        
        keyboardLayout.forEach((row, rowIndex) => {
            const rowElement = document.createElement('div');
            rowElement.className = 'keyboard-row';
            
            row.forEach(key => {
                const keyElement = document.createElement('button');
                keyElement.className = 'key';
                keyElement.textContent = key;
                keyElement.id = `key-${key.toLowerCase()}`;
                
                if (key === 'ENTER' || key === 'BACKSPACE') {
                    keyElement.classList.add('wide');
                }
                
                keyElement.addEventListener('click', () => this.handleKeyPress(key));
                rowElement.appendChild(keyElement);
            });
            
            keyboard.appendChild(rowElement);
        });
    }

    setupEventListeners() {
        document.addEventListener('keydown', (e) => {
            if (this.gameEnded) return;
            
            const key = e.key.toUpperCase();
            
            if (key === 'ENTER') {
                this.handleKeyPress('ENTER');
            } else if (key === 'BACKSPACE') {
                this.handleKeyPress('BACKSPACE');
            } else if (key >= 'A' && key <= 'Z') {
                this.handleKeyPress(key);
            }
        });

        document.getElementById('play-again').addEventListener('click', () => {
            this.closeModal();
            this.initializeGame();
        });

        document.getElementById('share-result').addEventListener('click', () => {
            this.shareResult();
        });

        document.getElementById('use-hint').addEventListener('click', () => {
            this.useHint();
        });

        document.getElementById('close-hint').addEventListener('click', () => {
            this.closeHintModal();
        });

        // Show hint modal after 30 seconds if no progress
        setTimeout(() => {
            if (!this.gameEnded && this.currentRow === 0 && this.currentCol === 0) {
                this.showHintModal();
            }
        }, 30000);
    }

    handleKeyPress(key) {
        if (this.gameEnded) return;
        
        if (!this.gameStarted) {
            this.gameStarted = true;
            this.startTime = Date.now();
            this.startTimer();
        }
        
        if (key === 'BACKSPACE') {
            this.handleBackspace();
        } else if (key === 'ENTER') {
            this.handleEnter();
        } else if (key >= 'A' && key <= 'Z' && this.currentCol < 5) {
            this.handleLetter(key);
        }
    }

    handleLetter(letter) {
        if (this.currentCol < 5) {
            const letterElement = document.getElementById(`letter-${this.currentRow}-${this.currentCol}`);
            letterElement.textContent = letter;
            letterElement.classList.add('filled');
            
            this.currentGuess += letter;
            this.currentCol++;
        }
    }

    handleBackspace() {
        if (this.currentCol > 0) {
            this.currentCol--;
            this.currentGuess = this.currentGuess.slice(0, -1);
            
            const letterElement = document.getElementById(`letter-${this.currentRow}-${this.currentCol}`);
            letterElement.textContent = '';
            letterElement.classList.remove('filled');
        }
    }

    handleEnter() {
        if (this.currentCol === 5) {
            this.submitGuess();
        }
    }

    submitGuess() {
        if (this.currentGuess.length !== 5) return;
        
        this.attempts++;
        this.updateAttempts();
        
        const guess = this.currentGuess;
        const word = this.currentWord;
        const letterStates = this.evaluateGuess(guess, word);
        
        // Animate the letters
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const letterElement = document.getElementById(`letter-${this.currentRow}-${i}`);
                letterElement.classList.add(letterStates[i]);
                
                // Update keyboard
                const keyElement = document.getElementById(`key-${guess[i].toLowerCase()}`);
                if (!keyElement.classList.contains('correct')) {
                    keyElement.classList.add(letterStates[i]);
                }
            }, i * 200);
        }
        
        // Check win condition
        if (guess === word) {
            setTimeout(() => {
                this.endGame(true);
            }, 1000);
            return;
        }
        
        // Check lose condition
        if (this.currentRow === 5) {
            setTimeout(() => {
                this.endGame(false);
            }, 1000);
            return;
        }
        
        // Move to next row
        this.currentRow++;
        this.currentCol = 0;
        this.currentGuess = '';
    }

    evaluateGuess(guess, word) {
        const states = new Array(5).fill('absent');
        const wordLetters = word.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct letters
        for (let i = 0; i < 5; i++) {
            if (guessLetters[i] === wordLetters[i]) {
                states[i] = 'correct';
                wordLetters[i] = null; // Mark as used
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < 5; i++) {
            if (states[i] === 'absent') {
                const letterIndex = wordLetters.indexOf(guessLetters[i]);
                if (letterIndex !== -1) {
                    states[i] = 'present';
                    wordLetters[letterIndex] = null; // Mark as used
                }
            }
        }
        
        return states;
    }

    endGame(won) {
        this.gameEnded = true;
        this.endTime = Date.now();
        this.stopTimer();
        
        this.updateStats(won);
        this.showModal(won);
    }

    showModal(won) {
        const modal = document.getElementById('game-modal');
        const title = document.getElementById('modal-title');
        const message = document.getElementById('modal-message');
        const time = document.getElementById('modal-time');
        const attempts = document.getElementById('modal-attempts');
        
        if (won) {
            title.textContent = '🎉 Congratulations!';
            message.textContent = `You guessed "${this.currentWord}"!`;
        } else {
            title.textContent = '😔 Game Over';
            message.textContent = `The word was "${this.currentWord}"`;
        }
        
        time.textContent = this.getFormattedTime();
        attempts.textContent = this.attempts;
        
        modal.style.display = 'flex';
    }

    closeModal() {
        const modal = document.getElementById('game-modal');
        modal.style.display = 'none';
    }

    showHintModal() {
        if (this.hintsUsed >= this.maxHints || this.gameEnded) return;
        
        const hintModal = document.getElementById('hint-modal');
        const hintText = document.getElementById('hint-text');
        
        const firstLetter = this.currentWord[0];
        hintText.textContent = `The word starts with the letter "${firstLetter}"`;
        
        hintModal.style.display = 'flex';
    }

    closeHintModal() {
        const hintModal = document.getElementById('hint-modal');
        hintModal.style.display = 'none';
    }

    useHint() {
        if (this.hintsUsed >= this.maxHints) return;
        
        this.hintsUsed++;
        this.closeHintModal();
        
        // Reveal the first letter
        const firstLetter = this.currentWord[0];
        const letterElement = document.getElementById(`letter-${this.currentRow}-0`);
        letterElement.textContent = firstLetter;
        letterElement.classList.add('filled', 'correct');
        
        // Update keyboard
        const keyElement = document.getElementById(`key-${firstLetter.toLowerCase()}`);
        keyElement.classList.add('correct');
        
        // Update current guess if at the beginning
        if (this.currentCol === 0) {
            this.currentGuess = firstLetter;
            this.currentCol = 1;
        }
    }

    startTimer() {
        this.timerInterval = setInterval(() => {
            this.updateTimer();
        }, 1000);
    }

    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
        }
    }

    updateTimer() {
        const timerElement = document.getElementById('timer');
        if (this.startTime) {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            timerElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        } else {
            timerElement.textContent = '00:00';
        }
    }

    getFormattedTime() {
        if (this.startTime && this.endTime) {
            const elapsed = Math.floor((this.endTime - this.startTime) / 1000);
            const minutes = Math.floor(elapsed / 60);
            const seconds = elapsed % 60;
            return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        }
        return '00:00';
    }

    updateAttempts() {
        const attemptsElement = document.getElementById('attempts');
        attemptsElement.textContent = `Attempts: ${this.attempts}/${this.maxAttempts}`;
    }

    updateStats(won = null) {
        if (won !== null) {
            this.stats.gamesPlayed++;
            if (won) {
                this.stats.gamesWon++;
                this.stats.currentStreak++;
                this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
            } else {
                this.stats.currentStreak = 0;
            }
            this.saveStats();
        }
        
        document.getElementById('games-played').textContent = this.stats.gamesPlayed;
        document.getElementById('win-percentage').textContent = 
            this.stats.gamesPlayed > 0 ? Math.round((this.stats.gamesWon / this.stats.gamesPlayed) * 100) + '%' : '0%';
        document.getElementById('current-streak').textContent = this.stats.currentStreak;
    }

    loadStats() {
        const defaultStats = {
            gamesPlayed: 0,
            gamesWon: 0,
            currentStreak: 0,
            maxStreak: 0
        };
        
        try {
            const saved = localStorage.getItem('wordguess-stats');
            return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
        } catch {
            return defaultStats;
        }
    }

    saveStats() {
        try {
            localStorage.setItem('wordguess-stats', JSON.stringify(this.stats));
        } catch (e) {
            console.error('Failed to save stats:', e);
        }
    }

    shareResult() {
        const result = `WordGuess Result:
🎯 Word: ${this.currentWord}
⏱️ Time: ${this.getFormattedTime()}
🎮 Attempts: ${this.attempts}/6
${this.attempts <= 3 ? '🔥' : this.attempts <= 5 ? '👍' : '💪'}

Play WordGuess - the addictive word game!`;

        if (navigator.share) {
            navigator.share({
                title: 'WordGuess Result',
                text: result
            });
        } else {
            navigator.clipboard.writeText(result).then(() => {
                alert('Result copied to clipboard!');
            });
        }
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new WordGuessGame();
});