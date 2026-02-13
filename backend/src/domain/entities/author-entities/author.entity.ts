import { Book } from './book.entity';
import { Fact } from './fact.entity';
import { Work } from './work.entity';
import { Quote } from './quote.entity';
import { Commentary } from './commentary.entity';

export interface Author {
  id: string;
  name?: string | null;
  nicknameOrTitle?: string | null;
  birthYear?: number | null;
  deathYear?: number | null;
  nationality?: string | null;
  occupation?: string | null;
  religiousTradition?: string | null;
  sermonsPreached?: number | null;
  booksWritten?: number | null;
  biography?: string | null;
  slug?: string | null;
  colors?: string | null;
  image?: string | null;
  fullResImage?: string | null;
  isBook: boolean;
  updatedDate?: Date | null;
  readingLevel?: string | null;

  // Navigation properties
  books?: Book[] | null;
  facts?: Fact[] | null;
  works?: Work[] | null;
  quotes?: Quote[] | null;
  commentaries?: Commentary[] | null;
}
