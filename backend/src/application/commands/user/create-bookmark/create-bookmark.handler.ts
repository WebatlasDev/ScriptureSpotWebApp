import { IRequestHandler } from '@/lib/mediator';
import { CreateBookmarkCommand } from './create-bookmark.command';
import { prisma } from '@/lib/prisma';

export class CreateBookmarkCommandHandler implements IRequestHandler<CreateBookmarkCommand, boolean> {
  async handle(request: CreateBookmarkCommand, cancellationToken?: AbortSignal): Promise<boolean> {
    // Check if bookmark already exists
    const existing = await prisma.bookmarks.findFirst({
      where: {
        ReferenceId: request.id || undefined,
        UserId: request.userId || undefined,
      },
    });

    if (existing) {
      return false;
    }

    // Create new bookmark
    await prisma.bookmarks.create({
      data: {
        Id: crypto.randomUUID(),
        UserId: request.userId,
        CreatedDate: new Date(),
        ReferenceId: request.id,
        Type: request.type,
      },
    });

    return true;
  }
}
