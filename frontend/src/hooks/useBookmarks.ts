'use client';

import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';
import { useAuth } from '@clerk/nextjs';
import { env } from '@/types/env';
import {
  BookmarkType,
  BookmarkFromAPI,
  BookmarksResponse,
  BibleBookOverviewFromAPI,
  BibleVerseTakeawayFromAPI,
  BookmarkHighlight,
  CommentaryFromAPI,
  StrongsLexiconEntryFromAPI,
} from '@/types/bookmark';
import { slugToBookName } from '@/utils/stringHelpers';

const BOOKMARK_TYPE_NUMERIC_MAP: Record<number, BookmarkType> = {
  0: BookmarkType.COMMENTARY,
  1: BookmarkType.HYMN,
  2: BookmarkType.SERMON,
  3: BookmarkType.CATECHISM,
  4: BookmarkType.CREED,
  5: BookmarkType.DEVOTIONAL,
  6: BookmarkType.BOOK_HIGHLIGHT,
  7: BookmarkType.VERSE,
  8: BookmarkType.VERSE_VERSION,
  9: BookmarkType.BOOK_OVERVIEW,
  10: BookmarkType.TAKEAWAY,
  11: BookmarkType.STRONGS_CONCORDANCE,
};

function normalizeContentType(value: unknown): BookmarkType {
  if (typeof value === 'number' && value in BOOKMARK_TYPE_NUMERIC_MAP) {
    return BOOKMARK_TYPE_NUMERIC_MAP[value];
  }

  if (typeof value === 'string') {
    const match = Object.values(BookmarkType).find(
      type => type.toLowerCase() === value.toLowerCase()
    );
    if (match) {
      return match as BookmarkType;
    }
  }

  return BookmarkType.COMMENTARY;
}

function stripHtmlTags(value?: string | null): string {
  if (!value) return '';

  return value
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function toIsoString(value: unknown, fallbackIso: string): string {
  if (!value) return fallbackIso;

  const date = new Date(value as string);
  if (Number.isNaN(date.getTime())) {
    return fallbackIso;
  }

  return date.toISOString();
}

function parseReferenceFromSlug(slug?: string | null): { bookName?: string; reference?: string } {
  if (!slug) return {};

  const segments = slug.split('/').filter(Boolean);
  if (segments.length === 0) return {};

  const last = segments[segments.length - 1];
  const secondLast = segments[segments.length - 2];
  const thirdLast = segments[segments.length - 3];

  const isNumeric = (value?: string) => !!value && /^\d+$/.test(value);
  const isVerseSegment = (value?: string) => !!value && (/^\d+(?:-\d+)?$/.test(value) || /^\d+:\d+(?:-\d+)?$/.test(value));

  let bookSlug: string | undefined;
  let chapter: string | undefined;
  let verseSegment: string | undefined;

  if (isNumeric(secondLast) && isVerseSegment(last)) {
    bookSlug = thirdLast;
    chapter = secondLast;
    verseSegment = last;
  } else if (isVerseSegment(last) && !isNumeric(secondLast)) {
    bookSlug = secondLast;
    verseSegment = last;
  } else if (isNumeric(last) && !isNumeric(secondLast)) {
    bookSlug = secondLast;
    chapter = last;
  } else {
    bookSlug = last;
  }

  if (!bookSlug) return {};

  const bookName = slugToBookName(bookSlug);

  if (chapter && verseSegment) {
    if (verseSegment.includes(':')) {
      const cleaned = verseSegment.replace(/-/g, '–');
      return { bookName, reference: `${bookName} ${cleaned}` };
    }

    if (verseSegment.includes('-')) {
      const [start, end] = verseSegment.split('-');
      return { bookName, reference: `${bookName} ${chapter}:${start}–${end}` };
    }

    return { bookName, reference: `${bookName} ${chapter}:${verseSegment}` };
  }

  if (chapter) {
    return { bookName, reference: `${bookName} ${chapter}` };
  }

  return { bookName, reference: bookName };
}

function sanitizeTakeaway(takeaway?: BibleVerseTakeawayFromAPI | null): BibleVerseTakeawayFromAPI | undefined {
  if (!takeaway) return undefined;

  return {
    ...takeaway,
    excerpts: takeaway.excerpts?.map(excerpt => ({
      ...excerpt,
      content: stripHtmlTags(excerpt.content),
    })),
    quotes: takeaway.quotes?.map(quote => ({
      ...quote,
      content: stripHtmlTags(quote.content),
    })),
  };
}

function buildOverviewHighlights(bookOverview?: BibleBookOverviewFromAPI | null): BookmarkHighlight[] | undefined {
  if (!bookOverview) return undefined;

  const highlights: BookmarkHighlight[] = [];

  const addHighlight = (label: string, value?: string | null) => {
    const cleaned = stripHtmlTags(value);
    if (cleaned) {
      highlights.push({ label, value: cleaned });
    }
  };

  addHighlight('Objective', bookOverview.objective);
  addHighlight('Key Themes', bookOverview.keyThemes);
  addHighlight('Teaching Highlights', bookOverview.teachingHighlights);
  addHighlight('Composition', bookOverview.composition);
  addHighlight('Unique Elements', bookOverview.uniqueElements);
  addHighlight('Historical Context', bookOverview.historicalContext);

  return highlights.length ? highlights : undefined;
}

function sanitizeBookOverview(bookOverview?: BibleBookOverviewFromAPI | null): BibleBookOverviewFromAPI | undefined {
  if (!bookOverview) return undefined;

  return {
    ...bookOverview,
    objective: stripHtmlTags(bookOverview.objective),
    keyThemes: stripHtmlTags(bookOverview.keyThemes),
    teachingHighlights: stripHtmlTags(bookOverview.teachingHighlights),
    composition: stripHtmlTags(bookOverview.composition),
    uniqueElements: stripHtmlTags(bookOverview.uniqueElements),
    historicalContext: stripHtmlTags(bookOverview.historicalContext),
    culturalBackground: stripHtmlTags(bookOverview.culturalBackground),
    politicalLandscape: stripHtmlTags(bookOverview.politicalLandscape),
  };
}

function sanitizeStrongsEntry(entry?: StrongsLexiconEntryFromAPI | null): StrongsLexiconEntryFromAPI | undefined {
  if (!entry) return undefined;

  return {
    ...entry,
    shortDefinition: stripHtmlTags(entry.shortDefinition),
    strongsDef: stripHtmlTags(entry.strongsDef),
    bdbDef: stripHtmlTags(entry.bdbDef),
    wordOrigin: stripHtmlTags(entry.wordOrigin),
  };
}

function mapBookmarkFromApi(raw: any): BookmarkFromAPI {
  const fallbackDate = new Date().toISOString();
  const createdAtIso = toIsoString(raw?.createdAt ?? raw?.createdDate, fallbackDate);
  const updatedAtIso = toIsoString(raw?.updatedAt ?? raw?.updatedDate ?? raw?.createdDate, createdAtIso);
  const contentType = normalizeContentType(raw?.contentType ?? raw?.type);

  const base: BookmarkFromAPI = {
    id: String(raw?.id ?? ''),
    userId: String(raw?.userId ?? ''),
    contentType,
    contentId: String(raw?.contentId ?? raw?.referenceId ?? raw?.id ?? ''),
    title: raw?.title ?? '',
    description: raw?.description ?? undefined,
    reference: raw?.reference ?? undefined,
    author: raw?.author ?? undefined,
    slug: raw?.slug ?? undefined,
    tags: Array.isArray(raw?.tags) ? raw.tags : [],
    createdAt: createdAtIso,
    updatedAt: updatedAtIso,
  };

  switch (contentType) {
    case BookmarkType.COMMENTARY: {
      const commentary = raw?.commentary as CommentaryFromAPI | undefined;
      const slug = commentary?.slug ?? base.slug;
      const { reference } = parseReferenceFromSlug(slug);
      const excerptHtml = commentary?.excerpts?.[0]?.content ?? commentary?.previewContent ?? base.description;
      const description = stripHtmlTags(excerptHtml) || base.description;

      return {
        ...base,
        contentId: String(raw?.referenceId ?? commentary?.id ?? base.contentId),
        title: base.title || commentary?.source || commentary?.author?.name || 'Commentary',
        description,
        reference: reference ?? base.reference ?? commentary?.bibleVerseReference?.referenceText ?? undefined,
        author: commentary?.author ?? base.author,
        slug: slug ?? base.slug,
        commentary,
      };
    }

    case BookmarkType.TAKEAWAY: {
      const takeaway = sanitizeTakeaway(raw?.takeaway);
      const slug = takeaway?.slug ?? base.slug;
      const { reference } = parseReferenceFromSlug(slug);
      const firstExcerpt = takeaway?.excerpts?.[0];
      const description = stripHtmlTags(firstExcerpt?.content) || base.description;

      return {
        ...base,
        title: base.title || (reference ? `Takeaways for ${reference}` : 'Verse Takeaways'),
        description,
        reference: reference ?? base.reference ?? takeaway?.bibleVerseReference?.referenceText ?? undefined,
        slug: slug ?? base.slug,
        takeaway,
      };
    }

    case BookmarkType.BOOK_OVERVIEW: {
      const bookOverviewRaw = raw?.bookOverview as BibleBookOverviewFromAPI | undefined;
      const bookOverview = sanitizeBookOverview(bookOverviewRaw);
      const highlights = buildOverviewHighlights(bookOverview);
      const bookName = bookOverview?.bibleBook?.name ?? parseReferenceFromSlug(base.slug).bookName;
      const description = base.description || highlights?.[0]?.value;

      return {
        ...base,
        contentId: String(raw?.contentId ?? raw?.referenceId ?? bookOverview?.id ?? base.contentId),
        title: base.title || (bookName ? `${bookName} Overview` : 'Book Overview'),
        description,
        reference: bookName ?? base.reference,
        slug:
          base.slug ??
          (bookOverview?.bibleBook?.slug
            ? `/commentators/book-overviews/${bookOverview.bibleBook.slug}`
            : undefined),
        bookOverview,
        highlights,
      };
    }

    case BookmarkType.VERSE_VERSION: {
      const verseVersion = raw?.verseVersion;
      const slug = verseVersion?.slug ?? base.slug;
      const { reference } = parseReferenceFromSlug(slug);
      const description = verseVersion?.content ?? base.description;

      return {
        ...base,
        title: base.title || 'Verse Version',
        description,
        reference: reference ?? base.reference,
        slug,
        verseVersion,
      };
    }

    case BookmarkType.STRONGS_CONCORDANCE: {
      const strongsEntry = sanitizeStrongsEntry(raw?.strongsEntry);
      const description = base?.description || strongsEntry?.shortDefinition || strongsEntry?.strongsDef

      return {
        ...base,
        title: base.title || strongsEntry?.strongsKey || "Strong's Entry",
        description: description ?? " ",
        reference: base.reference ?? strongsEntry?.originalWord ?? strongsEntry?.transliteration ?? undefined,
        strongsEntry,
      };
    }

    case BookmarkType.VERSE: {
      const slug = base.slug;
      const { reference } = parseReferenceFromSlug(slug);

      return {
        ...base,
        title: base.title || reference || 'Verse',
        reference: reference ?? base.reference,
      };
    }

    default:
      return {
        ...base,
        title: base.title || 'Bookmark',
      };
  }
}

export function useBookmarks(enabled: boolean = true) {
  const { getToken, userId } = useAuth();

  return useApiQuery(
    ['userBookmarks'],
    async () => {
      const token = await getToken({ template: env.clerkJwtTemplate });
      const result = await agent.User.listBookmarks(token || '', { UserId: userId });

      if (Array.isArray(result)) {
        const bookmarks: BookmarkFromAPI[] = result.map(mapBookmarkFromApi);

        return {
          bookmarks,
          totalCount: bookmarks.length,
          hasMore: false,
        } satisfies BookmarksResponse;
      }

      if (Array.isArray((result as any)?.bookmarks)) {
        const rawResponse = result as BookmarksResponse;
        const bookmarks = rawResponse.bookmarks.map(mapBookmarkFromApi);

        return {
          ...rawResponse,
          bookmarks,
        } satisfies BookmarksResponse;
      }

      return result as BookmarksResponse;
    },
    { refetchOnWindowFocus: true, enabled }
  );
}
