import { Author } from './author.entity';

export interface Fact {
  id: string;
  authorId?: string | null;
  content?: string | null;

  // Navigation properties
  author?: Author | null;
}
