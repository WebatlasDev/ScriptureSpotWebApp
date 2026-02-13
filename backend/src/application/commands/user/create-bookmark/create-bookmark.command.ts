import { IRequest } from '@/lib/mediator';
import { BookmarkType } from '@/domain/enums/bookmark-type.enum';

export class CreateBookmarkCommand implements IRequest<boolean> {
  id?: string | null;
  type?: BookmarkType | null;
  userId?: string | null;
}
