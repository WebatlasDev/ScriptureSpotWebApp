import { AuthorFromAPI } from './author';

export enum BookmarkType {
  COMMENTARY = 'Commentary',
  HYMN = 'Hymn',
  SERMON = 'Sermon',
  CATECHISM = 'Catechism',
  CREED = 'Creed',
  DEVOTIONAL = 'Devotional',
  BOOK_HIGHLIGHT = 'BookHighlight',
  VERSE = 'Verse',
  VERSE_VERSION = 'VerseVersion',
  BOOK_OVERVIEW = 'BookOverview',
  TAKEAWAY = 'Takeaway',
  STRONGS_CONCORDANCE = 'StrongsConcordance'
}

export type CommentaryExcerptType = 'Original' | 'Modern';

export interface CommentaryExcerptFromAPI {
  id: string;
  order?: number | null;
  content?: string | null;
  type?: CommentaryExcerptType | null;
}

export interface BibleVerseFromAPI {
  id: string;
  chapterId?: string | null;
  verseNumber?: number | null;
  chapterNumber?: number | null;
  bookSlug?: string | null;
}

export interface BibleVerseReferenceFromAPI {
  id: string;
  startVerseId?: string | null;
  endVerseId?: string | null;
  startVerse?: BibleVerseFromAPI | null;
  endVerse?: BibleVerseFromAPI | null;
  referenceText?: string | null;
}

export interface CommentaryFromAPI {
  id: string;
  authorId?: string | null;
  bibleReferenceId?: string | null;
  slug?: string | null;
  source?: string | null;
  sourceUrl?: string | null;
  groupId?: string | null;
  previewContent?: string | null;
  bibleVerseReference?: BibleVerseReferenceFromAPI | null;
  author?: AuthorFromAPI | null;
  excerpts?: CommentaryExcerptFromAPI[];
}

export interface QuoteFromAPI {
  id: string;
  verseId?: string | null;
  authorId?: string | null;
  content?: string | null;
  bibleVerse?: BibleVerseFromAPI | null;
  author?: AuthorFromAPI | null;
}

export interface BibleVerseVersionFromAPI {
  id: string;
  verseId?: string | null;
  bibleVersionId?: string | null;
  content?: string | null;
  versionName?: string | null;
  slug?: string | null;
}

export interface BibleBookFromAPI {
  id: string;
  name?: string | null;
  bookNumber?: number | null;
  slug?: string | null;
}

export interface BibleBookStructureFromAPI {
  id: string;
  bookOverviewId?: string | null;
  order?: number | null;
  title?: string | null;
  description?: string | null;
  verses?: string | null;
  verseReferenceSlug?: string | null;
}

export interface BibleBookOverviewFromAPI {
  id: string;
  bookId?: string | null;
  author?: string | null;
  audience?: string | null;
  composition?: string | null;
  objective?: string | null;
  uniqueElements?: string | null;
  bookStructure?: string | null;
  keyThemes?: string | null;
  teachingHighlights?: string | null;
  historicalContext?: string | null;
  culturalBackground?: string | null;
  politicalLandscape?: string | null;
  bibleBook?: BibleBookFromAPI | null;
  bibleBookStructures?: BibleBookStructureFromAPI[] | null;
}

export interface BibleVerseTakeawayExcerptFromAPI {
  id: string;
  takeAwayId?: string | null;
  order?: number | null;
  title?: string | null;
  content?: string | null;
}

export interface BibleVerseTakeawayQuoteFromAPI {
  id: string;
  takeAwayId?: string | null;
  authorId?: string | null;
  order?: number | null;
  title?: string | null;
  content?: string | null;
  source?: string | null;
  author?: AuthorFromAPI | null;
}

export interface BibleVerseTakeawayFromAPI {
  id: string;
  bibleReferenceId?: string | null;
  slug?: string | null;
  commentaryAuthors?: string | null;
  bibleVerseReference?: BibleVerseReferenceFromAPI | null;
  excerpts?: BibleVerseTakeawayExcerptFromAPI[];
  quotes?: BibleVerseTakeawayQuoteFromAPI[];
}

export interface StrongsLexiconEntryFromAPI {
  id: string;
  strongsKey?: string | null;
  shortDefinition?: string | null;
  originalWord?: string | null;
  partOfSpeech?: string | null;
  transliteration?: string | null;
  pronunciation?: string | null;
  phoneticSpelling?: string | null;
  kjvTranslation?: string | null;
  nasbTranslation?: string | null;
  wordOrigin?: string | null;
  strongsDef?: string | null;
  bdbDef?: string | null;
  frequency?: number | null;
  language?: string | null;
}

export interface BookmarkHighlight {
  label: string;
  value: string;
}

export interface BookmarkFromAPI {
  id: string;
  userId: string;
  contentType: BookmarkType;
  contentId: string;
  title: string;
  description?: string;
  reference?: string;
  author?: AuthorFromAPI;
  slug?: string;
  tags?: string[];
  createdAt: string;
  updatedAt: string;
  commentary?: CommentaryFromAPI;
  quote?: QuoteFromAPI;
  verse?: BibleVerseFromAPI;
  verseVersion?: BibleVerseVersionFromAPI;
  bookOverview?: BibleBookOverviewFromAPI;
  takeaway?: BibleVerseTakeawayFromAPI;
  strongsEntry?: StrongsLexiconEntryFromAPI;
  highlights?: BookmarkHighlight[];
}

export interface BookmarkDisplay extends BookmarkFromAPI {
  // Computed fields for display
  formattedReference?: string;
  formattedDate?: string;
  displayTags?: string[];
  excerpt?: string;

  // For grouping
  monthYear?: string;

  // For commentary bookmarks
  excerpts?: Array<{
    id: string;
    content: string;
  }>;

  // For hymn bookmarks
  hymnText?: string;

  // For sermon bookmarks
  sermonText?: string;

  // For book highlights
  highlightedText?: string;
  bookTitle?: string;
  bookChapter?: string;
}

export interface BookmarkGroup {
  monthYear: string;
  displayName: string;
  bookmarks: BookmarkDisplay[];
  count: number;
}

export interface BookmarkFilters {
  contentTypes: BookmarkType[];
  searchQuery: string;
  sortBy: 'newest' | 'oldest' | 'alphabetical';
}

export interface CreateBookmarkRequest {
  id: string;
  type: BookmarkType | string;
  userId: string;
}

export interface DeleteBookmarkRequest {
  id: string;
  userId: string;
}

export interface BookmarksResponse {
  bookmarks: BookmarkFromAPI[];
  totalCount: number;
  hasMore: boolean;}