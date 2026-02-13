/**
 * Delete Bookmark Command Handler
 */

import { DeleteBookmarkCommand } from './delete-bookmark.command';
import { prisma } from '@/lib/prisma';

export class DeleteBookmarkCommandHandler {
  async handle(command: DeleteBookmarkCommand): Promise<boolean> {
    // Find the bookmark
    const bookmark = await prisma.bookmarks.findFirst({
      where: {
        Id: command.id,
        UserId: command.userId,
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
