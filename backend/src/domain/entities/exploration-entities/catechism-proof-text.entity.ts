import { CatechismItem } from './catechism-item.entity';

export interface CatechismProofText {
  id: string;
  catechismItemId?: string | null;
  proofText?: string | null;

  // Navigation properties
  catechismItem?: CatechismItem | null;
}
