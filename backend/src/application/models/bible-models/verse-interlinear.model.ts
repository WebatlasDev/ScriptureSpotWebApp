import { InterlinearWordModel } from './interlinear-word.model';

export interface VerseInterlinearModel {
  verseNumber: number;
  language?: string | null;
  words: InterlinearWordModel[];
}
