export interface InterlinearWordModel {
  id: string;
  bibleReferenceId?: string | null;
  strongLexiconKey?: string | null;
  englishWord?: string | null;
  transliteration?: string | null;
  grammarCompact?: string | null;
  grammarDetailed?: string | null;
  punctuation?: string | null;
  wordPosition?: number | null;
  hebrewWord?: string | null;
  greekWord?: string | null;
}
