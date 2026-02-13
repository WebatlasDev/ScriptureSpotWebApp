/**
 * Create Bookmark Command Handler
 */

import { CreateBookmarkCommand } from './create-bookmark.command';
import { prisma } from '@/lib/prisma';

export class CreateBookmarkCommandHandler {
  async handle(command: CreateBookmarkCommand): Promise<boolean> {
    // Check if bookmark already exists
    const existing = await prisma.bookmarks.findFirst({
      where: {
        ReferenceId: command.id,
        UserId: command.userId,
      },
    });

    if (existing) {
      return false;
    }

    // Create new bookmark
    await prisma.bookmarks.create({
      data: {
        UserId: command.userId!,
        CreatedDate: new Date(),
        ReferenceId: command.id,
        Type: command.type,
      },
    });

    return true;
  }
}
