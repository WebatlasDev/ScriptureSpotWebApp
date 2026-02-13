import { CatechismItem } from './catechism-item.entity';

export interface Catechism {
  id: string;
  source?: string | null;
  slug?: string | null;

  // Navigation properties
  items?: CatechismItem[] | null;
}
