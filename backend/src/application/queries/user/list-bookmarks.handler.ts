/**
 * List Bookmarks Query Handler
 * Retrieves all bookmarks for a user with full entity details and formatting
 * Converted from C# Application/Queries/User/ListBookmarks/ListBookmarksQueryHandler.cs
 */

import { prisma } from '@/lib/prisma';
import { ListBookmarksQuery, ListBookmarksQueryResult } from './list-bookmarks.query';
import { BookmarkModel } from '@/application/models/user-models/bookmark.model';
import { CommentaryModel } from '@/application/models/author-models/commentary.model';
import { QuoteModel } from '@/application/models/author-models/quote.model';
import { BibleVerseModel } from '@/application/models/bible-models/bible-verse.model';
import { BibleVerseVersionModel } from '@/application/models/bible-models/bible-verse-version.model';
import { BibleBookOverviewModel } from '@/application/models/bible-models/bible-book-overview.model';
import { BibleVerseTakeawayModel } from '@/application/models/bible-models/bible-verse-takeaway.model';
import { StrongsLexiconModel } from '@/application/models/bible-models/strongs-lexicon.model';
import { AuthorModel } from '@/application/models/author-models/author.model';
import { BookmarkType } from '@/domain/enums/bookmark-type.enum';
import {
  formatRangeReference,
  formatSingleVerseReference,
  buildVerseDescription,
  firstNonEmpty,
  stripHtml,
} from './common/bookmark-formatting-helper';

export class ListBookmarksQueryHandler {
  async handle(query: ListBookmarksQuery): Promise<ListBookmarksQueryResult> {
    // Fetch all bookmarks for the user
    const bookmarksData = await prisma.bookmarks.findMany({
      where: {
        UserId: query.userId ?? undefined,
      },
      orderBy: {
        CreatedDate: 'desc',
      },
    });

    // Map to BookmarkModel structure
    const bookmarks: BookmarkModel[] = bookmarksData.map((b: any): BookmarkModel => ({
      id: b.Id ?? undefined,
      type: b.Type as BookmarkType,
      referenceId: b.ReferenceId ?? undefined,
      userId: b.UserId ?? undefined,
      createdDate: b.CreatedDate ?? undefined,
      contentType: b.ContentType as BookmarkType | null,
      contentId: b.ContentId ?? undefined,
      title: null,
      description: null,
      reference: null,
      author: null,
      slug: null,
      tags: [],
      createdAt: b.createdAt,
      updatedAt: b.updatedAt,
      commentary: null,
      quote: null,
      verse: null,
      verseVersion: null,
      bookOverview: null,
      takeaway: null,
      strongsEntry: null,
    }));

    // Extract reference IDs by type
    const commentaryIds = bookmarks
      .filter((x) => x.type === BookmarkType.Commentary && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    const bookHighlightIds = bookmarks
      .filter((x) => x.type === BookmarkType.BookHighlight && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    const verseIds = bookmarks
      .filter((x) => x.type === BookmarkType.Verse && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    const verseVersionIds = bookmarks
      .filter((x) => x.type === BookmarkType.VerseVersion && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    const bookOverviewIds = bookmarks
      .filter((x) => x.type === BookmarkType.BookOverview && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    const takeawayIds = bookmarks
      .filter((x) => x.type === BookmarkType.Takeaway && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    const strongsIds = bookmarks
      .filter((x) => x.type === BookmarkType.StrongsConcordance && x.referenceId)
      .map((x) => x.referenceId!)
      .filter((id, index, self) => self.indexOf(id) === index);

    // Fetch all referenced entities with includes
    const commentariesData =
      commentaryIds.length === 0
        ? []
        : await prisma.commentaries.findMany({
            where: { Id: { in: commentaryIds } },
          });

    const quotesData =
      bookHighlightIds.length === 0
        ? []
        : await prisma.quotes.findMany({
            where: { Id: { in: bookHighlightIds } },
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

    const bookOverviewsData =
      bookOverviewIds.length === 0
        ? []
        : await prisma.bibleBookOverviews.findMany({
            where: { Id: { in: bookOverviewIds } },
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
    const bookOverviews = new Map(bookOverviewsData.map((bo: any) => [bo.Id, bo]));
    const takeaways = new Map(takeawaysData.map((t: any) => [t.Id, t]));
    const strongsEntries = new Map(strongsData.map((s: any) => [s.Id, s]));

    // Populate bookmark details based on type
    for (const bookmark of bookmarks) {
      if (!bookmark.referenceId) {
        continue;
      }

      bookmark.tags = bookmark.tags ?? [];

      switch (bookmark.type) {
        case BookmarkType.Commentary: {
          const commentary = commentaries.get(bookmark.referenceId) as any;
          if (commentary) {
            bookmark.commentary = this.mapCommentaryModel(commentary);
            bookmark.title = commentary.source ?? null;
            bookmark.description = stripHtml(
              commentary.excerpts?.[0]?.content ?? null
            );
            bookmark.reference = formatRangeReference(
              commentary.bibleVerseReference?.startVerse ?? null,
              commentary.bibleVerseReference?.endVerse ?? null
            );
            bookmark.author = commentary.author
              ? this.mapAuthorModel(commentary.author)
              : null;
            bookmark.slug = commentary.slug;
          }
          break;
        }

        case BookmarkType.BookHighlight: {
          const quote = quotes.get(bookmark.referenceId) as any;
          if (quote) {
            bookmark.quote = this.mapQuoteModel(quote);
            bookmark.title = quote.author?.name ?? 'Book Highlight';
            bookmark.description = quote.content;
            bookmark.reference = formatSingleVerseReference(quote.bibleVerse ?? null);
            bookmark.author = quote.author ? this.mapAuthorModel(quote.author) : null;
            bookmark.slug = quote.slug;
          }
          break;
        }

        case BookmarkType.Verse: {
          const verse = verses.get(bookmark.referenceId) as any;
          if (verse) {
            bookmark.verse = this.mapBibleVerseModel(verse);
            const verseReference = formatSingleVerseReference(verse);
            bookmark.title = verseReference;
            bookmark.description = buildVerseDescription(verse);
            bookmark.reference = verseReference;
            bookmark.slug = verse.bibleChapter?.bibleBook?.slug ?? null;
          }
          break;
        }

        case BookmarkType.VerseVersion: {
          const verseVersion = verseVersions.get(bookmark.referenceId) as any;
          if (verseVersion) {
            bookmark.verseVersion = this.mapBibleVerseVersionModel(verseVersion);
            const verseVersionReference = formatSingleVerseReference(
              verseVersion.bibleVerse ?? null
            );
            const versionName =
              verseVersion.bibleVersion?.abbreviation ??
              verseVersion.bibleVersion?.name;
            bookmark.title =
              versionName && verseVersionReference
                ? `${versionName} – ${verseVersionReference}`
                : verseVersionReference ?? versionName ?? null;
            bookmark.description = verseVersion.content;
            bookmark.reference = verseVersionReference;
            bookmark.slug =
              verseVersion.bibleVerse?.bibleChapter?.bibleBook?.slug ?? null;
          }
          break;
        }

        case BookmarkType.BookOverview: {
          const overview = bookOverviews.get(bookmark.referenceId) as any;
          if (overview) {
            bookmark.bookOverview = this.mapBibleBookOverviewModel(overview);
            bookmark.title = overview.bibleBook?.name ?? 'Book Overview';
            bookmark.description = firstNonEmpty(
              overview.objective,
              overview.keyThemes,
              overview.teachingHighlights,
              overview.uniqueElements,
              overview.historicalContext,
              overview.culturalBackground,
              overview.politicalLandscape
            );
            bookmark.reference = overview.bibleBook?.name ?? null;
            bookmark.slug = overview.bibleBook?.slug ?? null;
          }
          break;
        }

        case BookmarkType.Takeaway: {
          const takeaway = takeaways.get(bookmark.referenceId) as any;
          if (takeaway) {
            bookmark.takeaway = this.mapBibleVerseTakeawayModel(takeaway);
            const takeawayReference = formatRangeReference(
              takeaway.bibleVerseReference?.startVerse ?? null,
              takeaway.bibleVerseReference?.endVerse ?? null
            );
            const takeawayExcerpt = stripHtml(
              takeaway.excerpts?.[0]?.content ?? null
            );
            const takeawayQuote = stripHtml(takeaway.quotes?.[0]?.content ?? null);
            bookmark.title = takeawayReference ?? 'Takeaway';
            bookmark.description =
              takeawayExcerpt && takeawayExcerpt.trim()
                ? takeawayExcerpt
                : takeawayQuote;
            bookmark.reference = takeawayReference;
            bookmark.slug = takeaway.slug ?? null;
          }
          break;
        }

        case BookmarkType.StrongsConcordance: {
          const strongs = strongsEntries.get(bookmark.referenceId) as any;
          if (strongs) {
            bookmark.strongsEntry = this.mapStrongsLexiconModel(strongs);
            bookmark.title =
              strongs.strongsKey ?? strongs.originalWord ?? 'Strongs Entry';
            bookmark.description = strongs.strongsDef ?? strongs.shortDefinition ?? null;
            bookmark.reference = strongs.transliteration ?? strongs.originalWord ?? null;
            bookmark.slug = strongs.strongsKey ?? null;
          }
          break;
        }
      }
    }

    return bookmarks;
  }

  // Helper mapping methods
  private mapCommentaryModel(data: any): CommentaryModel {
    return {
      id: data.id,
      authorId: data.authorId,
      bibleReferenceId: data.bibleVerseReferenceId,
      source: data.source,
      slug: data.slug,
      excerpts: data.excerpts?.map((e: any) => ({
        id: e.id,
        commentaryId: e.commentaryId,
        content: e.content,
        order: e.order,
        type: e.type,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
      })),
      author: data.author ? this.mapAuthorModel(data.author) : null,
      bibleVerseReference: data.bibleVerseReference
        ? {
            id: data.bibleVerseReference.id,
            startVerseId: data.bibleVerseReference.startVerseId,
            endVerseId: data.bibleVerseReference.endVerseId,
          }
        : null,
    };
  }

  private mapQuoteModel(data: any): QuoteModel {
    return {
      id: data.id,
      authorId: data.authorId,
      content: data.content,
      author: data.author ? this.mapAuthorModel(data.author) : null,
      bibleVerse: data.bibleVerse ? this.mapBibleVerseModel(data.bibleVerse) : null,
    };
  }

  private mapAuthorModel(data: any): AuthorModel {
    return {
      id: data.id,
      name: data.name,
      slug: data.slug,
      birthYear: data.birthYear,
      deathYear: data.deathYear,
      religiousTradition: data.religiousTradition,
      isBook: data.isBook || false,
    };
  }

  private mapBibleVerseModel(data: any): BibleVerseModel {
    return {
      id: data.id,
      chapterId: data.chapterId,
      verseNumber: data.verseNumber,
    };
  }

  private mapBibleVerseVersionModel(data: any): BibleVerseVersionModel {
    return {
      id: data.id,
      verseId: data.verseId,
      bibleVersionId: data.bibleVersionId,
      content: data.content,
    };
  }

  private mapBibleBookOverviewModel(data: any): BibleBookOverviewModel {
    return {
      id: data.id,
      bookId: data.bibleBookId,
      objective: data.objective,
      keyThemes: data.keyThemes,
      teachingHighlights: data.teachingHighlights,
      uniqueElements: data.uniqueElements,
      historicalContext: data.historicalContext,
      culturalBackground: data.culturalBackground,
      politicalLandscape: data.politicalLandscape,
      bibleBook: data.bibleBook
        ? {
            id: data.bibleBook.id,
            name: data.bibleBook.name,
            slug: data.bibleBook.slug,
          }
        : null,
    };
  }

  private mapBibleVerseTakeawayModel(data: any): BibleVerseTakeawayModel {
    return {
      id: data.id,
      bibleReferenceId: data.bibleVerseReferenceId,
      slug: data.slug,
      excerpts: data.excerpts?.map((e: any) => ({
        id: e.id,
        takeAwayId: e.bibleVerseTakeawayId,
        content: e.content,
        order: e.order,
        type: e.type,
      })),
      quotes: data.quotes?.map((q: any) => ({
        id: q.id,
        takeAwayId: q.bibleVerseTakeawayId,
        content: q.content,
        order: q.order,
        author: q.author ? this.mapAuthorModel(q.author) : null,
      })),
    };
  }

  private mapStrongsLexiconModel(data: any): StrongsLexiconModel {
    return {
      id: data.id,
      strongsKey: data.strongsKey,
      originalWord: data.originalWord,
      transliteration: data.transliteration,
      strongsDef: data.strongsDef,
      shortDefinition: data.shortDefinition,
      language: data.language,
    };
  }
}
