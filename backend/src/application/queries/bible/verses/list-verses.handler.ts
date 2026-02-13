import { prisma } from '@/lib/prisma';
import { BibleVerseModel } from '@/application/models/bible-models/bible-verse.model';
import { ListVersesQuery, ListVersesQueryResponse } from './list-verses.query';

/**
 * Handler for retrieving all verses in a chapter
 */
export class ListVersesQueryHandler {
  async handle(query: ListVersesQuery): Promise<ListVersesQueryResponse> {
    if (!query.bookSlug || !query.chapterNumber) {
      return [];
    }

    const verses = await prisma.bibleVerses.findMany({
      where: {
        BibleChapters: {
          BibleBooks: {
            Slug: query.bookSlug
          },
          ChapterNumber: query.chapterNumber
        }
      },
      orderBy: {
        VerseNumber: 'asc'
      }
    });

    return verses.map(verse => ({
      id: verse.Id ?? undefined,
      bibleChapterId: verse.ChapterId ?? undefined,
      verseNumber: verse.VerseNumber ?? undefined
    }));
  }
}
