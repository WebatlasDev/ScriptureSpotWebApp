import { AuthorModel } from '../author-models/author.model';
import { BookmarkType } from '@/domain/enums/bookmark-type.enum';

export interface BookmarkDetailedModel {
  id: string;
  userId?: string | null;
  contentType?: BookmarkType | null;
  contentId?: string | null;
  title?: string | null;
  description?: string | null;
  reference?: string | null;
  author?: AuthorModel | null;
  slug?: string | null;
  tags: string[];
  createdAt?: Date | null;
  updatedAt?: Date | null;
}
