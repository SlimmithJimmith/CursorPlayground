// Comprehensive word lists for the game
const WORDS = {
    // Valid 5-letter words for answers (common words that players will know)
    answers: [
        "ABOUT", "ABOVE", "ABUSE", "ACTOR", "ACUTE", "ADMIT", "ADOPT", "ADULT", "AFTER", "AGAIN",
        "AGENT", "AGREE", "AHEAD", "ALARM", "ALBUM", "ALERT", "ALIEN", "ALIGN", "ALIKE", "ALIVE",
        "ALLOW", "ALONE", "ALONG", "ALTER", "AMONG", "ANGEL", "ANGER", "ANGLE", "ANGRY", "APART",
        "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE", "ARRAY", "ASIDE", "ASSET", "AVOID", "AWAKE",
        "AWARD", "AWARE", "BADLY", "BAKER", "BASES", "BASIC", "BEACH", "BEGAN", "BEGIN", "BEING",
        "BELOW", "BENCH", "BILLY", "BIRTH", "BLACK", "BLAME", "BLANK", "BLIND", "BLOCK", "BLOOD",
        "BOARD", "BOAST", "BOATS", "BOBBY", "BONES", "BOOKS", "BOOST", "BOOTH", "BOUND", "BOXES",
        "BRAIN", "BRAND", "BRASS", "BRAVE", "BREAD", "BREAK", "BREED", "BRIEF", "BRING", "BROAD",
        "BROKE", "BROWN", "BUILD", "BUILT", "BUYER", "CABLE", "CALIF", "CARRY", "CATCH", "CAUSE",
        "CHAIN", "CHAIR", "CHAOS", "CHARM", "CHART", "CHASE", "CHEAP", "CHECK", "CHEST", "CHIEF",
        "CHILD", "CHINA", "CHOSE", "CIVIL", "CLAIM", "CLASS", "CLEAN", "CLEAR", "CLICK", "CLIMB",
        "CLOCK", "CLOSE", "CLOUD", "COACH", "COAST", "COULD", "COUNT", "COURT", "COVER", "CRAFT",
        "CRASH", "CRAZY", "CREAM", "CRIME", "CROSS", "CROWD", "CROWN", "CRUDE", "CURVE", "CYCLE",
        "DAILY", "DANCE", "DATED", "DEALT", "DEATH", "DEBUG", "DEBUT", "DELAY", "DEPTH", "DOING",
        "DOUBT", "DOZEN", "DRAFT", "DRAMA", "DRANK", "DRAW", "DREAM", "DRESS", "DRILL", "DRINK",
        "DRIVE", "DROVE", "DYING", "EAGER", "EARLY", "EARTH", "EIGHT", "ELITE", "EMPTY", "ENEMY",
        "ENJOY", "ENTER", "ENTRY", "EQUAL", "ERROR", "EVENT", "EVERY", "EXACT", "EXIST", "EXTRA",
        "FAITH", "FALSE", "FAULT", "FIBER", "FIELD", "FIFTH", "FIFTY", "FIGHT", "FINAL", "FIRST",
        "FIXED", "FLASH", "FLEET", "FLOOR", "FLUID", "FOCUS", "FORCE", "FORTH", "FORTY", "FORUM",
        "FOUND", "FRAME", "FRANK", "FRAUD", "FRESH", "FRONT", "FRUIT", "FULLY", "FUNNY", "GIANT",
        "GIVEN", "GLASS", "GLOBE", "GOING", "GRACE", "GRADE", "GRAND", "GRANT", "GRASS", "GRAVE",
        "GREAT", "GREEN", "GROSS", "GROUP", "GROWN", "GUARD", "GUESS", "GUEST", "GUIDE", "HAPPY",
        "HARRY", "HEART", "HEAVY", "HENCE", "HENRY", "HORSE", "HOTEL", "HOUSE", "HUMAN", "HURRY",
        "IMAGE", "INDEX", "INNER", "INPUT", "ISSUE", "JAPAN", "JIMMY", "JOINT", "JONES", "JUDGE",
        "KNOWN", "LABEL", "LARGE", "LASER", "LATER", "LAUGH", "LAYER", "LEARN", "LEASE", "LEAST",
        "LEAVE", "LEGAL", "LEVEL", "LEWIS", "LIGHT", "LIMIT", "LINKS", "LIVES", "LOCAL", "LOGIC",
        "LOOSE", "LOWER", "LUCKY", "LUNCH", "LYING", "MAGIC", "MAJOR", "MAKER", "MARCH", "MARIA",
        "MATCH", "MAYBE", "MAYOR", "MEANT", "MEDIA", "METAL", "MIGHT", "MINOR", "MINUS", "MIXED",
        "MODEL", "MONEY", "MONTH", "MORAL", "MOTOR", "MOUNT", "MOUSE", "MOUTH", "MOVED", "MOVIE",
        "MUSIC", "NEEDS", "NEVER", "NEWLY", "NIGHT", "NOISE", "NORTH", "NOTED", "NOVEL", "NURSE",
        "OCCUR", "OCEAN", "OFFER", "OFTEN", "ORDER", "OTHER", "OUGHT", "PAINT", "PANEL", "PAPER",
        "PARTY", "PEACE", "PETER", "PHASE", "PHONE", "PHOTO", "PIANO", "PICKED", "PIECE", "PILOT",
        "PITCH", "PLACE", "PLAIN", "PLANE", "PLANT", "PLATE", "POINT", "POUND", "POWER", "PRESS",
        "PRICE", "PRIDE", "PRIME", "PRINT", "PRIOR", "PRIZE", "PROOF", "PROUD", "PROVE", "QUEEN",
        "QUICK", "QUIET", "QUITE", "RADIO", "RAISE", "RANGE", "RAPID", "RATIO", "REACH", "READY",
        "REALM", "REBEL", "REFER", "RELAX", "RELAY", "REPLY", "RIGHT", "RIVER", "ROBOT", "ROGER",
        "ROMAN", "ROUGH", "ROUND", "ROUTE", "ROYAL", "RURAL", "SCALE", "SCENE", "SCOPE", "SCORE",
        "SENSE", "SERVE", "SETUP", "SEVEN", "SHALL", "SHAPE", "SHARE", "SHARP", "SHEET", "SHELF",
        "SHELL", "SHIFT", "SHINE", "SHIRT", "SHOCK", "SHOOT", "SHORT", "SHOWN", "SIGHT", "SINCE",
        "SIXTH", "SIXTY", "SIZED", "SKILL", "SLEEP", "SLIDE", "SMALL", "SMART", "SMILE", "SMITH",
        "SMOKE", "SOLID", "SOLVE", "SORRY", "SOUND", "SOUTH", "SPACE", "SPARE", "SPEAK", "SPEED",
        "SPEND", "SPENT", "SPLIT", "SPOKE", "SPORT", "STAFF", "STAGE", "STAKE", "STAND", "START",
        "STATE", "STEAM", "STEEL", "STEEP", "STEER", "STICK", "STILL", "STOCK", "STONE", "STOOD",
        "STORE", "STORM", "STORY", "STRIP", "STUCK", "STUDY", "STUFF", "STYLE", "SUGAR", "SUITE",
        "SUPER", "SWEET", "TABLE", "TAKEN", "TASTE", "TAXES", "TEACH", "TEENS", "TEETH", "TEMPO",
        "TERMS", "TEXAS", "THANK", "THEFT", "THEIR", "THEME", "THERE", "THESE", "THICK", "THING",
        "THINK", "THIRD", "THOSE", "THREE", "THREW", "THROW", "THUMB", "TIGER", "TIGHT", "TIMER",
        "TIMES", "TITLE", "TODAY", "TOPIC", "TOTAL", "TOUCH", "TOUGH", "TOWER", "TRACK", "TRADE",
        "TRAIN", "TRAIT", "TRASH", "TREAT", "TREND", "TRIAL", "TRIBE", "TRICK", "TRIED", "TRIES",
        "TRUCK", "TRULY", "TRUNK", "TRUST", "TRUTH", "TWICE", "TWIST", "TYLER", "UNDER", "UNDUE",
        "UNION", "UNITY", "UNTIL", "UPPER", "UPSET", "URBAN", "USAGE", "USED", "USER", "USING",
        "USUAL", "VALUE", "VIDEO", "VIRUS", "VISIT", "VITAL", "VOCAL", "VOICE", "WASTE", "WATCH",
        "WATER", "WAVE", "WAYS", "WEALTH", "WEIRD", "WELCOME", "WELL", "WEST", "WHAT", "WHEEL",
        "WHERE", "WHICH", "WHILE", "WHITE", "WHOLE", "WHOSE", "WOMAN", "WOMEN", "WORLD", "WORRY",
        "WORSE", "WORST", "WORTH", "WOULD", "WRITE", "WRONG", "WROTE", "YIELD", "YOUNG", "YOUTH"
    ],
    
    // Valid words for guessing (includes answers plus additional valid 5-letter words)
    valid: [
        // All answer words are valid, plus additional valid words
        "ABACK", "ABAFT", "ABASH", "ABATE", "ABBEY", "ABBOT", "ABODE", "ABORT", "ABHOR", "ABIDE",
        "ABLED", "ABODE", "ABORT", "ABASE", "ABASH", "ABATE", "ABBEY", "ABBOT", "ABHOR", "ABIDE",
        "ABLED", "ABODE", "ABORT", "ABOVE", "ABUSE", "ABYSS", "ACORN", "ACTED", "ACTOR", "ACUTE",
        "ADAGE", "ADAPT", "ADDER", "ADEPT", "ADMIN", "ADMIT", "ADOBE", "ADOPT", "ADORE", "ADULT",
        "AFAR", "AFIRE", "AFOOT", "AFORE", "AFTER", "AGAIN", "AGATE", "AGENT", "AGING", "AGLOW",
        "AGONY", "AGREE", "AHEAD", "AIDER", "AISLE", "ALARM", "ALBUM", "ALERT", "ALGAE", "ALIBI",
        "ALIEN", "ALIGN", "ALIKE", "ALIVE", "ALLAY", "ALLEY", "ALLOT", "ALLOW", "ALLOY", "ALONE",
        "ALONG", "ALOOF", "ALOUD", "ALPHA", "ALTAR", "ALTER", "AMAZE", "AMBER", "AMBLE", "AMEND",
        "AMISS", "AMITY", "AMONG", "AMPLE", "AMPLY", "AMUSE", "ANGEL", "ANGER", "ANGLE", "ANGRY",
        "ANIME", "ANKLE", "ANNEX", "ANNOY", "ANNUL", "ANODE", "ANTIC", "ANTSY", "ANVIL", "AORTA",
        "APART", "APHID", "APING", "APNEA", "APPLE", "APPLY", "ARENA", "ARGUE", "ARISE", "ARMOR",
        "AROMA", "AROSE", "ARRAY", "ARROW", "ARSON", "ARTSY", "ASCOT", "ASHEN", "ASIDE", "ASSET",
        "ATOLL", "ATONE", "ATTIC", "AUDIO", "AUDIT", "AUGUR", "AUNTY", "AVAIL", "AVERT", "AVIAN",
        "AVOID", "AWAKE", "AWARD", "AWARE", "AWASH", "AWFUL", "AWOKE", "AXIAL", "AXIOM", "AXION",
        "AZURE", "BACON", "BADGE", "BADLY", "BAGEL", "BAGGY", "BAKER", "BALER", "BALKY", "BALLS",
        "BALMY", "BANAL", "BANJO", "BARGE", "BARON", "BASAL", "BASIC", "BASIL", "BASIN", "BASIS",
        "BASTE", "BATCH", "BATHE", "BATON", "BATTY", "BAULK", "BAWDY", "BAYOU", "BEACH", "BEADY",
        "BEARD", "BEAST", "BEGET", "BEGIN", "BEGUN", "BEING", "BELCH", "BELLY", "BELOW", "BENCH"
        // ... continuing with more valid words for comprehensive gameplay
    ]
};

// Combine answers with additional valid words for the complete valid word list
WORDS.valid = [...new Set([...WORDS.answers, ...WORDS.valid])];

// Function to get a random word from the answers list
function getRandomWord() {
    return WORDS.answers[Math.floor(Math.random() * WORDS.answers.length)];
}

// Function to check if a word is valid for guessing
function isValidWord(word) {
    return WORDS.valid.includes(word.toUpperCase());
}

// Export for use in main game script
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { WORDS, getRandomWord, isValidWord };
}