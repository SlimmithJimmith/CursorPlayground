// Minimal word lists. Extend as desired.
// Five-letter solutions; also used as allowed guesses for simplicity.
const SOLUTIONS = [
  "about","other","which","their","there","first","could","sound","great","again",
  "still","every","small","found","those","never","under","house","world","heart",
  "water","point","place","think","right","three","where","thing","times","light",
  "story","young","after","child","woman","group","begin","black","white","south",
  "north","sweet","music","short","bring","class","clear","field","guess","happy",
  "large","learn","month","night","paper","party","plant","poor","power","quick",
  "reach","round","scale","shape","share","shine","sleep","smile","sound","space",
  "spoke","stand","start","state","table","teach","thank","these","think","today",
  "until","voice","watch","while","whole","women","would","write","young","zesty"
];

const WORDS = SOLUTIONS;
const WORD_SET = new Set(WORDS.map(w => w.toUpperCase()));

