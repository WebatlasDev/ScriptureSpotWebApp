import { prisma } from '@/lib/prisma';
import { BibleVerseVersionModel } from '@/application/models/bible-models/bible-verse-version.model';
import { GetVerseVersionQuery, GetVerseVersionQueryResponse } from './get-verse-version.query';

/**
 * Handler for retrieving a specific verse version
 */
export class GetVerseVersionQueryHandler {
  async handle(query: GetVerseVersionQuery): Promise<GetVerseVersionQueryResponse> {
    if (!query.bookSlug || !query.chapterNumber || !query.verseNumber || !query.versionName) {
      return null;
    }

    const verseVersion = await prisma.bibleVerseVersions.findFirst({
      where: {
        BibleVerses: {
          BibleChapters: {
            BibleBooks: {
              Slug: query.bookSlug
            },
            ChapterNumber: query.chapterNumber
          },
          VerseNumber: query.verseNumber
        },
        BibleVersions: {
          Abbreviation: {
            equals: query.versionName,
            mode: 'insensitive'
          }
        }
      },
      include: {
        BibleVerses: true,
        BibleVersions: true
      }
    });

    if (!verseVersion) {
      return null;
    }

    return {
      id: verseVersion.Id ?? undefined,
      verseId: verseVersion.VerseId ?? undefined,
      bibleVersionId: verseVersion.BibleVersionId ?? undefined,
      content: verseVersion.Content ?? undefined,
    };
  }
}
