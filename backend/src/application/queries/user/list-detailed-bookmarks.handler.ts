/**
 * List Detailed Bookmarks Query Handler
 * Retrieves all bookmarks for a user with formatted details (no nested entities)
 * Converted from C# Application/Queries/User/ListDetailedBookmarks/ListDetailedBookmarksQueryHandler.cs
 */

import { prisma } from '@/lib/prisma';
import {
  ListDetailedBookmarksQuery,
  ListDetailedBookmarksQueryResult,
} from './list-detailed-bookmarks.query';
import { BookmarkDetailedModel } from '@/application/models/user-models/bookmark-detailed.model';
import { AuthorModel } from '@/application/models/author-models/author.model';
import { BookmarkType } from '@/domain/enums/bookmark-type.enum';
import {
  formatRangeReference,
  formatSingleVerseReference,
  buildVerseDescription,
  firstNonEmpty,
  stripHtml,
} from './common/bookmark-formatting-helper';

export class ListDetailedBookmarksQueryHandler {
  async handle(query: ListDetailedBookmarksQuery): Promise<ListDetailedBookmarksQueryResult> {
    // Fetch all bookmarks for the user
    const bookmarks = await prisma.bookmarks.findMany({
      where: {
        UserId: query.userId ?? undefined,
      },
      orderBy: {
        CreatedDate: 'desc',
      },
    });

    // Extract reference IDs by type
    const commentaryIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.Commentary && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    const quoteIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.BookHighlight && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    const verseIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.Verse && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    const verseVersionIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.VerseVersion && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    const overviewIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.BookOverview && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    const takeawayIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.Takeaway && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    const strongsIds = bookmarks
      .filter((x: any) => x.Type === BookmarkType.StrongsConcordance && x.ReferenceId)
      .map((x: any) => x.ReferenceId!)
      .filter((id: string, index: number, self: string[]) => self.indexOf(id) === index);

    // Fetch all referenced entities with includes
    const commentariesData =
      commentaryIds.length === 0
        ? []
        : await prisma.commentaries.findMany({
            where: { Id: { in: commentaryIds } },
          });

    const quotesData =
      quoteIds.length === 0
        ? []
        : await prisma.quotes.findMany({
            where: { Id: { in: quoteIds } },
          });

    const versesData =
      verseIds.length === 0
        ? []
        : await prisma.bibleVerses.findMany({
            where: { Id: { in: verseIds } },
          });

    const verseVersionsData =
      verseVersionIds.length === 0
        ? []
        : await prisma.bibleVerseVersions.findMany({
            where: { Id: { in: verseVersionIds } },
          });

    const overviewsData =
      overviewIds.length === 0
        ? []
        : await prisma.bibleBookOverviews.findMany({
            where: { Id: { in: overviewIds } },
          });

    const takeawaysData =
      takeawayIds.length === 0
        ? []
        : await prisma.bibleVerseTakeaways.findMany({
            where: { Id: { in: takeawayIds } },
          });

    const strongsData =
      strongsIds.length === 0
        ? []
        : await prisma.strongsLexicons.findMany({
            where: { Id: { in: strongsIds } },
          });

    // Create lookup dictionaries
    const commentaries = new Map(commentariesData.map((c: any) => [c.Id, c]));
    const quotes = new Map(quotesData.map((q: any) => [q.Id, q]));
    const verses = new Map(versesData.map((v: any) => [v.Id, v]));
    const verseVersions = new Map(verseVersionsData.map((vv: any) => [vv.Id, vv]));
    const overviews = new Map(overviewsData.map((o: any) => [o.Id, o]));
    const takeaways = new Map(takeawaysData.map((t: any) => [t.id, t]));
    const strongsEntries = new Map(strongsData.map((s: any) => [s.id, s]));

    const result: BookmarkDetailedModel[] = [];

    // Process each bookmark and create detailed model
    for (const bookmark of bookmarks) {
      if (!bookmark.ReferenceId) {
        result.push(this.createBasicModel(bookmark));
        continue;
      }

      switch (bookmark.Type as BookmarkType) {
        case BookmarkType.Commentary: {
          const commentary = commentaries.get(bookmark.ReferenceId);
          if (commentary) {
            result.push(this.createCommentaryModel(bookmark, commentary));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        case BookmarkType.BookHighlight: {
          const quote = quotes.get(bookmark.ReferenceId);
          if (quote) {
            result.push(this.createQuoteModel(bookmark, quote));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        case BookmarkType.Verse: {
          const verse = verses.get(bookmark.ReferenceId);
          if (verse) {
            result.push(this.createVerseModel(bookmark, verse));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        case BookmarkType.VerseVersion: {
          const verseVersion = verseVersions.get(bookmark.ReferenceId);
          if (verseVersion) {
            result.push(this.createVerseVersionModel(bookmark, verseVersion));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        case BookmarkType.BookOverview: {
          const overview = overviews.get(bookmark.ReferenceId);
          if (overview) {
            result.push(this.createOverviewModel(bookmark, overview));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        case BookmarkType.Takeaway: {
          const takeaway = takeaways.get(bookmark.ReferenceId);
          if (takeaway) {
            result.push(this.createTakeawayModel(bookmark, takeaway));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        case BookmarkType.StrongsConcordance: {
          const strongs = strongsEntries.get(bookmark.ReferenceId);
          if (strongs) {
            result.push(this.createStrongsModel(bookmark, strongs));
          } else {
            result.push(this.createBasicModel(bookmark));
          }
          break;
        }

        default:
          result.push(this.createBasicModel(bookmark));
          break;
      }
    }

    return result;
  }

  // Helper methods to create detailed models
  private createBasicModel(bookmark: any): BookmarkDetailedModel {
    return {
      id: bookmark.Id,
      userId: bookmark.UserId,
      contentType: bookmark.Type as BookmarkType,
      contentId: bookmark.ReferenceId,
      title: null,
      description: null,
      reference: null,
      author: null,
      slug: null,
      tags: [],
      createdAt: bookmark.CreatedDate,
      updatedAt: bookmark.CreatedDate,
    };
  }

  private createCommentaryModel(bookmark: any, commentary: any): BookmarkDetailedModel {
    const reference = formatRangeReference(
      commentary.bibleVerseReference?.startVerse ?? null,
      commentary.bibleVerseReference?.endVerse ?? null
    );
    const excerptHtml = commentary.excerpts?.[0]?.content ?? null;
    const excerptText = stripHtml(excerptHtml);

    const model = this.createBasicModel(bookmark);
    model.title = commentary.source ?? null;
    model.description = excerptText;
    model.reference = reference;
    model.author = commentary.author ? this.mapAuthorModel(commentary.author) : null;
    model.slug = commentary.slug ?? null;
    return model;
  }

  private createQuoteModel(bookmark: any, quote: any): BookmarkDetailedModel {
    const reference = formatSingleVerseReference(quote.bibleVerse ?? null);
    const model = this.createBasicModel(bookmark);
    model.title = quote.author?.name ?? 'Book Highlight';
    model.description = quote.content ?? null;
    model.reference = reference;
    model.author = quote.author ? this.mapAuthorModel(quote.author) : null;
    model.slug = quote.slug ?? null;
    return model;
  }

  private createVerseModel(bookmark: any, verse: any): BookmarkDetailedModel {
    const reference = formatSingleVerseReference(verse);
    const description = buildVerseDescription(verse);

    const model = this.createBasicModel(bookmark);
    model.title = reference;
    model.description = description;
    model.reference = reference;
    model.slug = verse.bibleChapter?.bibleBook?.slug ?? null;
    return model;
  }

  private createVerseVersionModel(bookmark: any, verseVersion: any): BookmarkDetailedModel {
    const reference = formatSingleVerseReference(verseVersion.bibleVerse ?? null);
    const versionName =
      verseVersion.bibleVersion?.abbreviation ?? verseVersion.bibleVersion?.name;
    const title =
      versionName && reference
        ? `${versionName} – ${reference}`
        : reference ?? versionName ?? null;

    const model = this.createBasicModel(bookmark);
    model.title = title;
    model.description = verseVersion.content ?? null;
    model.reference = reference;
    model.slug = verseVersion.bibleVerse?.bibleChapter?.bibleBook?.slug ?? null;
    return model;
  }

  private createOverviewModel(bookmark: any, overview: any): BookmarkDetailedModel {
    const model = this.createBasicModel(bookmark);
    model.title = overview.bibleBook?.name ?? 'Book Overview';
    model.description = firstNonEmpty(
      overview.objective,
      overview.keyThemes,
      overview.teachingHighlights,
      overview.uniqueElements,
      overview.historicalContext,
      overview.culturalBackground,
      overview.politicalLandscape
    );
    model.reference = overview.bibleBook?.name ?? null;
    model.slug = overview.bibleBook?.slug ?? null;
    return model;
  }

  private createTakeawayModel(bookmark: any, takeaway: any): BookmarkDetailedModel {
    const reference = formatRangeReference(
      takeaway.bibleVerseReference?.startVerse ?? null,
      takeaway.bibleVerseReference?.endVerse ?? null
    );
    const excerpt = stripHtml(takeaway.excerpts?.[0]?.content ?? null);
    const quote = stripHtml(takeaway.quotes?.[0]?.content ?? null);

    const model = this.createBasicModel(bookmark);
    model.title = reference ?? 'Takeaway';
    model.description = excerpt && excerpt.trim() ? excerpt : quote;
    model.reference = reference;
    model.slug = takeaway.slug ?? null;
    return model;
  }

  private createStrongsModel(bookmark: any, strongs: any): BookmarkDetailedModel {
    const model = this.createBasicModel(bookmark);
    model.title = strongs.strongsKey ?? strongs.originalWord ?? 'Strongs Entry';
    model.description = strongs.strongsDef ?? strongs.shortDefinition ?? null;
    model.reference = strongs.transliteration ?? strongs.originalWord ?? null;
    model.slug = strongs.strongsKey ?? null;
    return model;
  }

  private mapAuthorModel(data: any): AuthorModel {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      birthYear: data.birthYear,
      deathYear: data.deathYear,
      religiousTradition: data.religiousTradition,
      biography: data.biography,
      isBook: data.isBook || false,
    };
  }
}
