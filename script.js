// WordMaster Game Logic
class WordMasterGame {
    constructor() {
        this.maxAttempts = 6;
        this.wordLength = 5;
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameEnded = false;
        this.targetWord = '';
        this.guesses = [];
        this.keyboardState = {};
        
        // Game statistics
        this.stats = this.loadStats();
        
        this.init();
    }
    
    init() {
        this.createGameBoard();
        this.setupEventListeners();
        this.newGame();
        this.updateDisplay();
    }
    
    createGameBoard() {
        const gameBoard = document.getElementById('game-board');
        gameBoard.innerHTML = '';
        
        for (let i = 0; i < this.maxAttempts; i++) {
            const row = document.createElement('div');
            row.className = 'board-row';
            row.id = `row-${i}`;
            
            for (let j = 0; j < this.wordLength; j++) {
                const tile = document.createElement('div');
                tile.className = 'tile';
                tile.id = `tile-${i}-${j}`;
                row.appendChild(tile);
            }
            
            gameBoard.appendChild(row);
        }
    }
    
    setupEventListeners() {
        // Physical keyboard
        document.addEventListener('keydown', (e) => this.handleKeyPress(e.key));
        
        // Virtual keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.addEventListener('click', () => this.handleKeyPress(key.dataset.key));
        });
        
        // Modal handlers
        document.getElementById('help-btn').addEventListener('click', () => this.showModal('help-modal'));
        document.getElementById('stats-btn').addEventListener('click', () => this.showModal('stats-modal'));
        
        document.querySelectorAll('.modal-close').forEach(btn => {
            btn.addEventListener('click', (e) => this.hideModal(e.target.dataset.modal));
        });
        
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.hideModal(modal.id);
                }
            });
        });
        
        // Game control buttons
        document.getElementById('play-again-btn').addEventListener('click', () => this.newGame());
        document.getElementById('share-btn').addEventListener('click', () => this.shareResults());
    }
    
    newGame() {
        this.targetWord = getRandomWord();
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameEnded = false;
        this.guesses = [];
        this.keyboardState = {};
        
        // Clear board
        document.querySelectorAll('.tile').forEach(tile => {
            tile.textContent = '';
            tile.className = 'tile';
        });
        
        // Reset keyboard
        document.querySelectorAll('.key').forEach(key => {
            key.className = key.className.replace(/\s*(correct|present|absent)/, '');
        });
        
        // Hide game status
        document.getElementById('game-status').classList.add('hidden');
        
        console.log('New game started. Target word:', this.targetWord); // For debugging
    }
    
    handleKeyPress(key) {
        if (this.gameEnded) return;
        
        key = key.toUpperCase();
        
        if (key === 'ENTER') {
            this.submitGuess();
        } else if (key === 'BACKSPACE') {
            this.deleteLetter();
        } else if (/^[A-Z]$/.test(key) && this.currentCol < this.wordLength) {
            this.addLetter(key);
        }
    }
    
    addLetter(letter) {
        if (this.currentCol >= this.wordLength) return;
        
        const tile = document.getElementById(`tile-${this.currentRow}-${this.currentCol}`);
        tile.textContent = letter;
        tile.classList.add('filled');
        
        this.currentCol++;
    }
    
    deleteLetter() {
        if (this.currentCol === 0) return;
        
        this.currentCol--;
        const tile = document.getElementById(`tile-${this.currentRow}-${this.currentCol}`);
        tile.textContent = '';
        tile.classList.remove('filled');
    }
    
    submitGuess() {
        if (this.currentCol !== this.wordLength) {
            this.showToast('Not enough letters', 'warning');
            this.animateRow('invalid');
            return;
        }
        
        const guess = this.getCurrentGuess();
        
        if (!isValidWord(guess)) {
            this.showToast('Not in word list', 'error');
            this.animateRow('invalid');
            return;
        }
        
        this.processGuess(guess);
    }
    
    getCurrentGuess() {
        let guess = '';
        for (let i = 0; i < this.wordLength; i++) {
            const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
            guess += tile.textContent;
        }
        return guess;
    }
    
    processGuess(guess) {
        const result = this.checkGuess(guess);
        this.guesses.push({ word: guess, result });
        
        // Animate tiles with staggered timing
        result.forEach((status, index) => {
            setTimeout(() => {
                const tile = document.getElementById(`tile-${this.currentRow}-${index}`);
                tile.classList.add(status);
                
                // Update keyboard state
                const letter = guess[index];
                if (!this.keyboardState[letter] || this.getStatusPriority(status) > this.getStatusPriority(this.keyboardState[letter])) {
                    this.keyboardState[letter] = status;
                    this.updateKeyboard(letter, status);
                }
            }, index * 100);
        });
        
        setTimeout(() => {
            if (guess === this.targetWord) {
                this.endGame(true);
                this.animateRow('winning');
            } else if (this.currentRow === this.maxAttempts - 1) {
                this.endGame(false);
            } else {
                this.currentRow++;
                this.currentCol = 0;
            }
        }, result.length * 100 + 100);
    }
    
    checkGuess(guess) {
        const result = new Array(this.wordLength).fill('absent');
        const targetLetters = this.targetWord.split('');
        const guessLetters = guess.split('');
        
        // First pass: mark correct positions
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] === targetLetters[i]) {
                result[i] = 'correct';
                targetLetters[i] = null;
                guessLetters[i] = null;
            }
        }
        
        // Second pass: mark present letters
        for (let i = 0; i < this.wordLength; i++) {
            if (guessLetters[i] && targetLetters.includes(guessLetters[i])) {
                result[i] = 'present';
                targetLetters[targetLetters.indexOf(guessLetters[i])] = null;
            }
        }
        
        return result;
    }
    
    getStatusPriority(status) {
        const priorities = { 'correct': 3, 'present': 2, 'absent': 1 };
        return priorities[status] || 0;
    }
    
    updateKeyboard(letter, status) {
        const key = document.querySelector(`[data-key="${letter}"]`);
        if (key) {
            key.classList.remove('correct', 'present', 'absent');
            key.classList.add(status);
        }
    }
    
    animateRow(animation) {
        for (let i = 0; i < this.wordLength; i++) {
            const tile = document.getElementById(`tile-${this.currentRow}-${i}`);
            tile.classList.add(animation);
            
            setTimeout(() => {
                tile.classList.remove(animation);
            }, 500);
        }
    }
    
    endGame(won) {
        this.gameEnded = true;
        
        // Update statistics
        this.updateStats(won);
        
        // Show game status
        const gameStatus = document.getElementById('game-status');
        const statusMessage = document.getElementById('status-message');
        
        if (won) {
            const messages = [
                'Genius!', 'Magnificent!', 'Impressive!', 'Splendid!', 'Great!', 'Phew!'
            ];
            statusMessage.textContent = messages[this.currentRow] || 'Amazing!';
            statusMessage.classList.add('win');
            this.showToast(`You got it in ${this.currentRow + 1} ${this.currentRow === 0 ? 'try' : 'tries'}!`, 'success');
        } else {
            statusMessage.textContent = `The word was: ${this.targetWord}`;
            statusMessage.classList.add('lose');
            this.showToast('Better luck next time!', 'error');
        }
        
        gameStatus.classList.remove('hidden');
        
        // Update display
        this.updateDisplay();
    }
    
    updateStats(won) {
        this.stats.played++;
        
        if (won) {
            this.stats.wins++;
            this.stats.currentStreak++;
            this.stats.maxStreak = Math.max(this.stats.maxStreak, this.stats.currentStreak);
            this.stats.guessDistribution[this.currentRow + 1]++;
        } else {
            this.stats.currentStreak = 0;
        }
        
        this.stats.winPercentage = Math.round((this.stats.wins / this.stats.played) * 100);
        this.saveStats();
    }
    
    loadStats() {
        const defaultStats = {
            played: 0,
            wins: 0,
            winPercentage: 0,
            currentStreak: 0,
            maxStreak: 0,
            guessDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0 }
        };
        
        const saved = localStorage.getItem('wordmaster-stats');
        return saved ? { ...defaultStats, ...JSON.parse(saved) } : defaultStats;
    }
    
    saveStats() {
        localStorage.setItem('wordmaster-stats', JSON.stringify(this.stats));
    }
    
    updateDisplay() {
        // Update streak display
        document.getElementById('current-streak').textContent = this.stats.currentStreak;
        document.getElementById('max-streak').textContent = this.stats.maxStreak;
        
        // Update stats modal
        document.getElementById('games-played').textContent = this.stats.played;
        document.getElementById('win-percentage').textContent = this.stats.winPercentage;
        document.getElementById('current-streak-stat').textContent = this.stats.currentStreak;
        document.getElementById('max-streak-stat').textContent = this.stats.maxStreak;
        
        // Update guess distribution
        this.updateGuessDistribution();
    }
    
    updateGuessDistribution() {
        const container = document.getElementById('guess-bars');
        container.innerHTML = '';
        
        const maxCount = Math.max(...Object.values(this.stats.guessDistribution));
        
        for (let i = 1; i <= 6; i++) {
            const count = this.stats.guessDistribution[i];
            const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
            
            const bar = document.createElement('div');
            bar.className = 'guess-bar';
            
            bar.innerHTML = `
                <span class="guess-number">${i}</span>
                <div class="guess-progress">
                    <div class="guess-fill" style="width: ${Math.max(percentage, count > 0 ? 10 : 0)}%">
                        ${count}
                    </div>
                </div>
            `;
            
            container.appendChild(bar);
        }
    }
    
    showModal(modalId) {
        document.getElementById(modalId).classList.remove('hidden');
        if (modalId === 'stats-modal') {
            this.updateDisplay();
        }
    }
    
    hideModal(modalId) {
        document.getElementById(modalId).classList.add('hidden');
    }
    
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;
        
        const container = document.getElementById('toast-container');
        container.appendChild(toast);
        
        // Animate in
        setTimeout(() => toast.classList.add('show'), 10);
        
        // Remove after delay
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => container.removeChild(toast), 200);
        }, 2000);
    }
    
    shareResults() {
        const result = this.generateShareText();
        
        if (navigator.share) {
            navigator.share({
                title: 'WordMaster',
                text: result
            });
        } else if (navigator.clipboard) {
            navigator.clipboard.writeText(result).then(() => {
                this.showToast('Results copied to clipboard!', 'success');
            });
        } else {
            // Fallback for older browsers
            const textarea = document.createElement('textarea');
            textarea.value = result;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            this.showToast('Results copied to clipboard!', 'success');
        }
    }
    
    generateShareText() {
        const gameNumber = this.stats.played;
        const attempts = this.gameEnded && this.guesses[this.guesses.length - 1].word === this.targetWord 
            ? this.guesses.length 
            : 'X';
        
        let result = `WordMaster #${gameNumber} ${attempts}/6\n\n`;
        
        this.guesses.forEach(guess => {
            guess.result.forEach(status => {
                if (status === 'correct') result += '🟩';
                else if (status === 'present') result += '🟨';
                else result += '⬛';
            });
            result += '\n';
        });
        
        return result;
    }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new WordMasterGame();
});