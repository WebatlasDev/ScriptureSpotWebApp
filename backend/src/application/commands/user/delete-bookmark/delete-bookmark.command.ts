import { IRequest } from '@/lib/mediator';

export class DeleteBookmarkCommand implements IRequest<boolean> {
  id?: string | null;
  userId?: string | null;
}
