import { InterlinearWord } from './interlinear-word.entity';

export interface StrongsLexicon {
  id: string;
  strongsKey?: string | null;
  shortDefinition?: string | null;
  originalWord?: string | null;
  partOfSpeech?: string | null;
  transliteration?: string | null;
  pronunciation?: string | null;
  phoneticSpelling?: string | null;
  kjvTranslation?: string | null;
  nasbTranslation?: string | null;
  wordOrigin?: string | null;
  strongsDef?: string | null;
  bdbDef?: string | null;
  frequency?: number | null;
  language?: string | null;

  // Navigation properties
  interlinearWords?: InterlinearWord[] | null;
}
