// Public domain English word list for predictive keyboard
// Common words organized by frequency for better predictions

export const wordList: string[] = [
  // Most common words
  "the", "be", "to", "of", "and", "a", "in", "that", "have", "i",
  "it", "for", "not", "on", "with", "he", "as", "you", "do", "at",
  "this", "but", "his", "by", "from", "they", "we", "say", "her", "she",
  "or", "an", "will", "my", "one", "all", "would", "there", "their", "what",
  "so", "up", "out", "if", "about", "who", "get", "which", "go", "me",
  "when", "make", "can", "like", "time", "no", "just", "him", "know", "take",
  "people", "into", "year", "your", "good", "some", "could", "them", "see", "other",
  "than", "then", "now", "look", "only", "come", "its", "over", "think", "also",
  "back", "after", "use", "two", "how", "our", "work", "first", "well", "way",
  "even", "new", "want", "because", "any", "these", "give", "day", "most", "us",

  // Movie related words
  "movie", "movies", "film", "films", "actor", "actress", "director", "cinema",
  "action", "comedy", "drama", "horror", "thriller", "romance", "adventure",
  "animation", "documentary", "fantasy", "mystery", "science", "fiction",
  "western", "musical", "crime", "war", "history", "biography", "family",
  "sport", "superhero", "sequel", "prequel", "trilogy", "series", "episode",
  "season", "cast", "crew", "producer", "writer", "screenplay", "script",
  "scene", "plot", "story", "character", "hero", "villain", "ending",
  "trailer", "poster", "review", "rating", "award", "oscar", "golden",
  "globe", "emmy", "grammy", "premiere", "release", "box", "office",
  "blockbuster", "indie", "classic", "remake", "reboot", "adaptation",
  "sequel", "franchise", "universe", "cinematic", "theatrical", "streaming",

  // Popular movie titles (single words)
  "avatar", "titanic", "avengers", "endgame", "infinity", "panther",
  "joker", "frozen", "lion", "king", "aladdin", "inception", "interstellar",
  "gladiator", "matrix", "batman", "superman", "spider", "man", "iron",
  "thor", "hulk", "captain", "america", "wonder", "woman", "aquaman",
  "shazam", "justice", "league", "guardians", "galaxy", "deadpool",
  "wolverine", "xmen", "fantastic", "four", "venom", "carnage",
  "transformers", "terminator", "predator", "alien", "aliens", "prometheus",
  "jurassic", "park", "world", "godzilla", "kong", "pacific", "rim",
  "star", "wars", "trek", "force", "awakens", "jedi", "skywalker",
  "harry", "potter", "hobbit", "rings", "lord", "narnia", "chronicles",
  "hunger", "games", "divergent", "maze", "runner", "twilight", "vampire",
  "pirates", "caribbean", "mission", "impossible", "bond", "james", "bourne",
  "john", "wick", "fast", "furious", "mad", "max", "fury", "road",
  "rocky", "creed", "rambo", "expendables", "taken", "equalizer",
  "die", "hard", "lethal", "weapon", "bad", "boys", "rush", "hour",
  "ocean", "eleven", "heist", "casino", "royale", "spectre", "skyfall",
  "dark", "knight", "rises", "begins", "returns", "forever", "robin",
  "wonder", "shrek", "toy", "story", "finding", "nemo", "dory",
  "incredibles", "monsters", "inc", "cars", "ratatouille", "wall",
  "brave", "inside", "coco", "moana", "tangled", "wreck", "ralph",
  "zootopia", "big", "hero", "six", "lilo", "stitch", "mulan",
  "pocahontas", "hercules", "tarzan", "atlantis", "treasure", "planet",

  // Common search terms
  "best", "top", "new", "old", "latest", "upcoming", "popular", "trending",
  "watch", "stream", "download", "free", "full", "hd", "quality",
  "english", "spanish", "french", "german", "italian", "japanese", "korean",
  "chinese", "indian", "bollywood", "hollywood", "british", "australian",
  "canadian", "american", "european", "asian", "african", "latin",

  // Years (for search)
  "2024", "2023", "2022", "2021", "2020", "2019", "2018", "2017", "2016", "2015",
  "2014", "2013", "2012", "2011", "2010", "2009", "2008", "2007", "2006", "2005",
  "2000", "1999", "1998", "1997", "1996", "1995", "1994", "1993", "1992", "1991",
  "1990", "1989", "1988", "1987", "1986", "1985", "1984", "1983", "1982", "1981",
  "1980", "1979", "1978", "1977", "1976", "1975", "1974", "1973", "1972", "1971",

  // Additional common words
  "love", "life", "night", "home", "house", "man", "men", "woman", "women",
  "child", "children", "boy", "girl", "baby", "young", "old", "little", "big",
  "small", "great", "long", "short", "high", "low", "left", "right", "last",
  "next", "same", "different", "own", "place", "end", "hand", "part", "week",
  "company", "system", "program", "question", "government", "number", "school",
  "night", "point", "city", "community", "policy", "student", "group", "country",
  "problem", "service", "thing", "mother", "father", "brother", "sister", "friend",
  "power", "money", "change", "read", "write", "learn", "play", "move", "live",
  "believe", "hold", "bring", "happen", "must", "before", "large", "million",
  "always", "those", "both", "often", "run", "under", "turn", "real", "leave",
  "put", "while", "keep", "let", "begin", "seem", "help", "show", "hear", "play",
  "run", "small", "set", "every", "found", "still", "between", "name", "should",
  "home", "side", "water", "again", "never", "call", "world", "last", "night",
  "off", "much", "mean", "old", "end", "against", "ask", "open", "need", "become",
  "why", "three", "state", "too", "public", "without", "place", "program", "during",
  "order", "might", "close", "such", "social", "nothing", "black", "white", "red",
  "blue", "green", "yellow", "orange", "purple", "pink", "brown", "grey", "gray",
  "gold", "silver", "dark", "light", "bright", "deep", "true", "false", "real",
  "fake", "good", "bad", "happy", "sad", "angry", "funny", "scary", "beautiful",
  "ugly", "pretty", "handsome", "cool", "hot", "cold", "warm", "perfect", "amazing",
  "awesome", "great", "excellent", "wonderful", "fantastic", "incredible", "brilliant",
  "epic", "legendary", "ultimate", "supreme", "extreme", "super", "ultra", "mega",
  "secret", "hidden", "lost", "found", "final", "eternal", "infinite", "immortal",
  "deadly", "magical", "mystical", "ancient", "modern", "future", "past", "present",

  // Names commonly in movie searches
  "tom", "hanks", "cruise", "brad", "pitt", "leonardo", "dicaprio", "robert",
  "downey", "chris", "evans", "hemsworth", "pratt", "scarlett", "johansson",
  "jennifer", "lawrence", "aniston", "emma", "watson", "stone", "margot", "robbie",
  "gal", "gadot", "ryan", "reynolds", "gosling", "denzel", "washington", "morgan",
  "freeman", "samuel", "jackson", "will", "smith", "dwayne", "johnson", "rock",
  "vin", "diesel", "jason", "statham", "keanu", "reeves", "nicolas", "cage",
  "johnny", "depp", "christian", "bale", "matt", "damon", "ben", "affleck",
  "george", "clooney", "meryl", "streep", "julia", "roberts", "angelina", "jolie",
  "anne", "hathaway", "natalie", "portman", "cate", "blanchett", "kate", "winslet",
  "charlize", "theron", "sandra", "bullock", "nicole", "kidman", "amy", "adams",
  "spielberg", "nolan", "tarantino", "scorsese", "cameron", "lucas", "kubrick",
  "hitchcock", "coppola", "fincher", "villeneuve", "ridley", "scott", "james",
  "peter", "jackson", "christopher", "martin", "quentin", "francis", "ford"
];

// Create a map for quick lookup by numeric sequence
export const numericToChars: { [key: string]: string } = {
  '2': 'abc',
  '3': 'def',
  '4': 'ghi',
  '5': 'jkl',
  '6': 'mno',
  '7': 'pqrs',
  '8': 'tuv',
  '9': 'wxyz'
};

// Convert a word to its numeric sequence
export function wordToNumeric(word: string): string {
  const charToNum: { [key: string]: string } = {};
  Object.entries(numericToChars).forEach(([num, chars]) => {
    chars.split('').forEach(char => {
      charToNum[char] = num;
    });
  });

  return word.toLowerCase().split('').map(char => charToNum[char] || '').join('');
}

// Build a trie-like structure for fast prediction lookup
export interface PredictionNode {
  words: string[];
  children: { [key: string]: PredictionNode };
}

function buildPredictionTree(): PredictionNode {
  const root: PredictionNode = { words: [], children: {} };

  wordList.forEach(word => {
    const numericSeq = wordToNumeric(word);
    if (!numericSeq) return;

    let node = root;
    for (let i = 0; i < numericSeq.length; i++) {
      const digit = numericSeq[i];
      if (!node.children[digit]) {
        node.children[digit] = { words: [], children: {} };
      }
      node = node.children[digit];
      // Add word to each prefix node for partial matching
      if (!node.words.includes(word)) {
        node.words.push(word);
      }
    }
  });

  return root;
}

export const predictionTree = buildPredictionTree();

// Get word predictions for a numeric sequence
export function getPredictions(numericSequence: string, limit: number = 5): string[] {
  if (!numericSequence) return [];

  let node: PredictionNode | undefined = predictionTree;

  for (const digit of numericSequence) {
    if (!node?.children[digit]) {
      return [];
    }
    node = node.children[digit];
  }

  if (!node) return [];

  // Sort by word length (shorter first) and then alphabetically
  return node.words
    .sort((a, b) => {
      // Prioritize exact length matches
      const aNumeric = wordToNumeric(a);
      const bNumeric = wordToNumeric(b);
      const aExact = aNumeric.length === numericSequence.length;
      const bExact = bNumeric.length === numericSequence.length;

      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;

      // Then by length
      if (a.length !== b.length) return a.length - b.length;

      // Then alphabetically
      return a.localeCompare(b);
    })
    .slice(0, limit);
}
