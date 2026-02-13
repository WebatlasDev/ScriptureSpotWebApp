import { AuthorColorSchemeModel } from './author-color-scheme.model';

export interface AuthorModel {
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
  image?: string | null;
  fullResImage?: string | null;
  isBook: boolean;
  updatedDate?: Date | null;
  readingLevel?: string | null;
  colorScheme?: AuthorColorSchemeModel | null;
}
