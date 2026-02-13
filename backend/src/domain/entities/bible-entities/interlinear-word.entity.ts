import { BibleVerseReference } from './bible-verse-reference.entity';
import { StrongsLexicon } from './strongs-lexicon.entity';

export interface InterlinearWord {
  id: string;
  bibleReferenceId?: string | null;
  strongsLexiconId?: string | null;
  englishWord?: string | null;
  transliteration?: string | null;
  grammarCompact?: string | null;
  grammarDetailed?: string | null;
  punctuation?: string | null;
  wordPosition?: number | null;
  hebrewWord?: string | null;
  greekWord?: string | null;

  // Navigation properties
  bibleVerseReference?: BibleVerseReference | null;
  strongsLexicon?: StrongsLexicon | null;
}
