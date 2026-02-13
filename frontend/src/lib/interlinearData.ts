export const mockApiData = {
  HEBREW: {
    language: 'HEBREW',
    words: [
      {
        english_word: "In",
        transliteration: "bə·rê·šîṯ",
        strongs_key: "H7225",
        grammar_compact: "N‑fs",
        grammar_detailed: "Noun - feminine singular",
        punctuation: null,
        word_position: 1,
        hebrew_word: "בְּרֵאשִׁ֖ית",
        greek_word: null
      },
      {
        english_word: "God",
        transliteration: "'ĕ·lō·hîm",
        strongs_key: "H430",
        grammar_compact: "N‑mp",
        grammar_detailed: "Noun - masculine plural",
        punctuation: ";",
        word_position: 2,
        hebrew_word: "אֱלֹהִ֑ים",
        greek_word: null
      },
      {
        english_word: "created",
        transliteration: "bā·rā",
        strongs_key: "H1254",
        grammar_compact: "V‑Qal‑Perf‑3ms",
        grammar_detailed: "Verb - Qal - Perfect - third person masculine singular",
        punctuation: null,
        word_position: 3,
        hebrew_word: "בָּרָ֣א",
        greek_word: null
      },
      {
        english_word: "the",
        transliteration: "'êṯ",
        strongs_key: "H853",
        grammar_compact: "DirObjM",
        grammar_detailed: "Direct object marker",
        punctuation: "-",
        word_position: 4,
        hebrew_word: "אֵ֥ת",
        greek_word: null
      },
      {
        english_word: "heavens",
        transliteration: "haš·šā·ma·yim",
        strongs_key: "H8064",
        grammar_compact: "Art | N‑mp",
        grammar_detailed: "Article | Noun - masculine plural",
        punctuation: null,
        word_position: 5,
        hebrew_word: "הַשָּׁמַ֖יִם",
        greek_word: null
      },
      {
        english_word: "and",
        transliteration: "wə·'êṯ",
        strongs_key: "H853",
        grammar_compact: "Conj‑w | DirObjM",
        grammar_detailed: "Conjunctive waw | Direct object marker",
        punctuation: null,
        word_position: 6,
        hebrew_word: "וְאֵ֥ת",
        greek_word: null
      },
      {
        english_word: "earth",
        transliteration: "hā·'ā·reṣ",
        strongs_key: "H776",
        grammar_compact: "Art | N‑fs",
        grammar_detailed: "Article | Noun - feminine singular",
        punctuation: ".",
        word_position: 7,
        hebrew_word: "הָאָֽרֶץ",
        greek_word: null
      }
    ],
  },
  GREEK: {
    language: 'GREEK',
    words: [
      {
        english_word: "In",
        transliteration: "en",
        strongs_key: "G1722",
        grammar_compact: "Prep",
        grammar_detailed: "Preposition",
        punctuation: null,
        word_position: 1,
        hebrew_word: null,
        greek_word: "ἐν"
      },
      {
        english_word: "beginning",
        transliteration: "archē",
        strongs_key: "G746",
        grammar_compact: "N‑DFS",
        grammar_detailed: "Noun - Dative Feminine Singular",
        punctuation: null,
        word_position: 2,
        hebrew_word: null,
        greek_word: "ἀρχῇ"
      },
      {
        english_word: "was",
        transliteration: "ēn",
        strongs_key: "G1510",
        grammar_compact: "V‑IIA‑3S",
        grammar_detailed: "Verb - Imperfect Indicative Active - 3rd Person Singular",
        punctuation: null,
        word_position: 3,
        hebrew_word: null,
        greek_word: "ἦν"
      },
      {
        english_word: "the",
        transliteration: "ho",
        strongs_key: "G3588",
        grammar_compact: "T‑NMS",
        grammar_detailed: "Article - Nominative Masculine Singular",
        punctuation: null,
        word_position: 4,
        hebrew_word: null,
        greek_word: "ὁ"
      },
      {
        english_word: "Word",
        transliteration: "logos",
        strongs_key: "G3056",
        grammar_compact: "N‑NMS",
        grammar_detailed: "Noun - Nominative Masculine Singular",
        punctuation: ",",
        word_position: 5,
        hebrew_word: null,
        greek_word: "λόγος"
      },
      {
        english_word: "and",
        transliteration: "kai",
        strongs_key: "G2532",
        grammar_compact: "Conj",
        grammar_detailed: "Conjunction",
        punctuation: null,
        word_position: 6,
        hebrew_word: null,
        greek_word: "καὶ"
      },
      {
        english_word: "the",
        transliteration: "ho",
        strongs_key: "G3588",
        grammar_compact: "T‑NMS",
        grammar_detailed: "Article - Nominative Masculine Singular",
        punctuation: null,
        word_position: 7,
        hebrew_word: null,
        greek_word: "ὁ"
      },
      {
        english_word: "Word",
        transliteration: "logos",
        strongs_key: "G3056",
        grammar_compact: "N‑NMS",
        grammar_detailed: "Noun - Nominative Masculine Singular",
        punctuation: null,
        word_position: 8,
        hebrew_word: null,
        greek_word: "λόγος"
      },
      {
        english_word: "was",
        transliteration: "ēn",
        strongs_key: "G1510",
        grammar_compact: "V‑IIA‑3S",
        grammar_detailed: "Verb - Imperfect Indicative Active - 3rd Person Singular",
        punctuation: null,
        word_position: 9,
        hebrew_word: null,
        greek_word: "ἦν"
      },
      {
        english_word: "with",
        transliteration: "pros",
        strongs_key: "G4314",
        grammar_compact: "Prep",
        grammar_detailed: "Preposition",
        punctuation: null,
        word_position: 10,
        hebrew_word: null,
        greek_word: "πρὸς"
      },
      {
        english_word: "God",
        transliteration: "theos",
        strongs_key: "G2316",
        grammar_compact: "N‑AMS",
        grammar_detailed: "Noun - Accusative Masculine Singular",
        punctuation: ".",
        word_position: 11,
        hebrew_word: null,
        greek_word: "θεόν"
      }
    ],
  },
};

export const fetchInterlinearData = async (language: 'GREEK' | 'HEBREW') => {
  return Promise.resolve(mockApiData[language]);
};
