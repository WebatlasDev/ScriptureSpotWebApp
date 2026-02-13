import { IRequestHandler } from '@/lib/mediator';
import { DeleteBookmarkCommand } from './delete-bookmark.command';
import { prisma } from '@/lib/prisma';

export class DeleteBookmarkCommandHandler implements IRequestHandler<DeleteBookmarkCommand, boolean> {
  async handle(request: DeleteBookmarkCommand, cancellationToken?: AbortSignal): Promise<boolean> {
    // Find the bookmark
    const bookmark = await prisma.bookmarks.findFirst({
      where: {
        Id: request.id || undefined,
        UserId: request.userId || undefined,
      },
    });

    if (!bookmark) {
      throw new Error('Bookmark not found for user');
    }

    // Delete the bookmark
    await prisma.bookmarks.delete({
      where: {
        Id: bookmark.Id,
      },
    });

    return true;
  }
}
