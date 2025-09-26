# WordMaster - The Addictive Word Game

A modern, addictive word-guessing game inspired by Wordle with enhanced features and beautiful UI.

## Features

🎯 **Core Gameplay**
- Guess the 5-letter word in 6 attempts
- Color-coded feedback system (Green = Correct position, Yellow = Wrong position, Gray = Not in word)
- Comprehensive word validation

🎨 **Beautiful Design**
- Modern dark theme with gradient backgrounds
- Smooth animations and transitions
- Responsive design for all devices
- Interactive virtual keyboard

📊 **Advanced Statistics**
- Win/loss tracking
- Current and maximum streak counters
- Guess distribution charts
- Persistent stats using localStorage

🎉 **Addictive Features**
- Toast notifications for feedback
- Share results functionality
- Keyboard animations based on letter status
- Victory animations
- Help modal with examples

## How to Play

1. **Objective**: Guess the hidden 5-letter word within 6 attempts
2. **Making Guesses**: Type letters using your keyboard or click the virtual keyboard
3. **Submitting**: Press ENTER to submit your guess
4. **Feedback Colors**:
   - 🟩 **Green**: Letter is in the word and in the correct position
   - 🟨 **Yellow**: Letter is in the word but in the wrong position
   - ⬛ **Gray**: Letter is not in the word at all
5. **Winning**: Guess the word correctly to win and maintain your streak!

## File Structure

```
/workspace/
├── index.html      # Main HTML structure
├── style.css       # Modern CSS styling with animations
├── script.js       # Game logic and interactions
├── words.js        # Word database and validation
└── README.md       # This file
```

## Running the Game

### Option 1: Local Web Server (Recommended)
```bash
# Navigate to the project directory
cd /workspace

# Start a local web server
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

### Option 2: Direct File Access
Simply open `index.html` in any modern web browser.

## Technical Highlights

- **Vanilla JavaScript**: No dependencies, lightweight and fast
- **Modern CSS**: Uses CSS Grid, Flexbox, and custom properties
- **Animations**: Smooth tile flips, bounces, and shake effects
- **Responsive**: Works perfectly on desktop, tablet, and mobile
- **Accessible**: Keyboard navigation and screen reader friendly
- **Performance**: Optimized for smooth 60fps animations

## Game Statistics

The game tracks comprehensive statistics:
- Total games played
- Win percentage
- Current winning streak
- Maximum winning streak achieved
- Distribution of guesses (1-6 attempts)

All statistics are saved locally and persist between sessions.

## Customization

You can easily customize the game by modifying:
- **Word Lists**: Edit `words.js` to add/remove words
- **Styling**: Modify CSS custom properties in `style.css`
- **Game Rules**: Adjust constants in `script.js` (attempts, word length, etc.)
- **Colors**: Change the color scheme via CSS custom properties

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Enjoy Playing WordMaster!

Challenge yourself to maintain the longest winning streak possible. The addictive gameplay loop and satisfying feedback will keep you coming back for more!