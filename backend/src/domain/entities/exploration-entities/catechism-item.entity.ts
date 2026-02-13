import { Catechism } from './catechism.entity';
import { CatechismProofText } from './catechism-proof-text.entity';

export interface CatechismItem {
  id: string;
  catechismId: string;
  section?: string | null;
  number?: number | null;
  question?: string | null;
  answer?: string | null;
  slug?: string | null;

  // Navigation properties
  catechism?: Catechism | null;
  proofTexts?: CatechismProofText[] | null;
}
