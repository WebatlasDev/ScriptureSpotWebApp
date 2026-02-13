import { prisma } from '@/lib/prisma';
import { BibleVerseVersionModel } from '@/application/models/bible-models/bible-verse-version.model';
import { ListVerseVersionsQuery, ListVerseVersionsQueryResponse } from './list-verse-versions.query';

/**
 * Handler for retrieving all versions of a specific verse
 */
export class ListVerseVersionsQueryHandler {
  async handle(query: ListVerseVersionsQuery): Promise<ListVerseVersionsQueryResponse> {
    if (!query.bookSlug || !query.chapterNumber || !query.verseNumber) {
      return [];
    }

    const verseVersions = await prisma.bibleVerseVersions.findMany({
      where: {
        BibleVerses: {
          BibleChapters: {
            BibleBooks: {
              Slug: query.bookSlug
            },
            ChapterNumber: query.chapterNumber
          },
          VerseNumber: query.verseNumber
        }
      },
      include: {
        BibleVerses: true,
        BibleVersions: true
      },
      orderBy: {
        BibleVersions: {
          Name: 'asc'
        }
      }
    });

    return verseVersions.map(vv => ({
      id: vv.Id,
      bibleVerseId: vv.VerseId,
      bibleVersionId: vv.BibleVersionId,
      content: vv.Content ?? undefined,
      verseNumber: vv.BibleVerses?.VerseNumber ?? undefined,
      name: vv.BibleVersions?.Name ?? undefined,
      abbreviation: vv.BibleVersions?.Abbreviation ?? undefined
    }));
  }
}
