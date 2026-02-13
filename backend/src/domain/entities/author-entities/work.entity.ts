import { Author } from './author.entity';

export interface Work {
  id: string;
  authorId?: string | null;
  content?: string | null;
  slug?: string | null;
  aaUrl?: string | null;

  // Navigation properties
  author?: Author | null;
}
