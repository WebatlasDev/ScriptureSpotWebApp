import { Author } from './author.entity';

export interface Book {
  id: string;
  authorId?: string | null;
  content?: string | null;
  slug?: string | null;

  // Navigation properties
  author?: Author | null;
}
