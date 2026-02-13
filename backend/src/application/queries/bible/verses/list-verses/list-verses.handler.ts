import { IRequestHandler } from '@/lib/mediator';
import { ListVersesQuery } from './list-verses.query';
import { BibleVerseModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListVersesQueryHandler implements IRequestHandler<ListVersesQuery, BibleVerseModel[]> {
  async handle(request: ListVersesQuery, cancellationToken?: AbortSignal): Promise<BibleVerseModel[]> {
    const verses = await prisma.bibleVerses.findMany({
      where: {
        BibleChapters: {
          BibleBooks: {
            Slug: request.bookSlug || undefined,
          },
          ChapterNumber: request.chapterNumber || undefined,
        },
      },
      orderBy: {
        VerseNumber: 'asc',
      },
      select: {
        Id: true,
        ChapterId: true,
        VerseNumber: true,
      },
    });

    return verses.map((verse) => ({
      id: verse.Id ?? undefined,
      chapterId: verse.ChapterId ?? undefined,
      verseNumber: verse.VerseNumber ?? undefined,
    }));
  }
}
