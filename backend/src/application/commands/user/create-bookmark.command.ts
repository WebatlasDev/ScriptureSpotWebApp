/**
 * Create Bookmark Command
 */

import { BookmarkType } from '@/domain/enums/bookmark-type.enum';

export class CreateBookmarkCommand {
  id?: string;
  type?: BookmarkType;
  userId?: string;
}
