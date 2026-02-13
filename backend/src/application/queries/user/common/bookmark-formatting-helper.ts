/**
 * Bookmark Formatting Helper
 * Utility functions for formatting bookmarks and Bible references
 * Converted from C# Application/Queries/User/Common/BookmarkFormattingHelper.cs
 */

import { normalizeUnicodeReplacementCharacters } from '@/application/common/extensions/string-extensions';
import { BibleVerse } from '@/domain/entities/bible-entities/bible-verse.entity';

/**
 * Formats a verse range reference (e.g., "John 3:16–18" or "John 3:16")
 * @param startVerse The starting verse of the range
 * @param endVerse The ending verse of the range (optional)
 * @returns Formatted reference string or null if data is missing
 */
export function formatRangeReference(
  startVerse: BibleVerse | null | undefined,
  endVerse: BibleVerse | null | undefined
): string | null {
  const bookName = startVerse?.bibleChapter?.bibleBook?.name;
  const chapterNumber = startVerse?.bibleChapter?.chapterNumber;
  const startVerseNumber = startVerse?.verseNumber;
  const endVerseNumber = endVerse?.verseNumber;

  if (!bookName || chapterNumber == null || startVerseNumber == null) {
    return null;
  }

  // If there's an end verse and it's different from start, show range
  if (endVerseNumber != null && endVerseNumber !== startVerseNumber) {
    return `${bookName} ${chapterNumber}:${startVerseNumber}–${endVerseNumber}`;
  }

  // Otherwise just show single verse
  return `${bookName} ${chapterNumber}:${startVerseNumber}`;
}

/**
 * Formats a single verse reference (e.g., "John 3:16")
 * @param verse The verse to format
 * @returns Formatted reference string or null if data is missing
 */
export function formatSingleVerseReference(
  verse: BibleVerse | null | undefined
): string | null {
  const bookName = verse?.bibleChapter?.bibleBook?.name;
  const chapterNumber = verse?.bibleChapter?.chapterNumber;
  const verseNumber = verse?.verseNumber;

  if (!bookName || chapterNumber == null || verseNumber == null) {
    return null;
  }

  return `${bookName} ${chapterNumber}:${verseNumber}`;
}

/**
 * Builds a verse description with content from multiple Bible versions
 * Formats each version as "VERSION: content" on separate lines
 * @param verse The verse with loaded versions
 * @returns Formatted description or null if no versions available
 */
export function buildVerseDescription(
  verse: BibleVerse | null | undefined
): string | null {
  if (!verse?.versions) {
    return null;
  }

  const segments = verse.versions
    .filter((v) => v.content && v.content.trim().length > 0)
    .map((v) => {
      const normalizedContent = normalizeUnicodeReplacementCharacters(v.content ?? '');
      const label = v.bibleVersion?.abbreviation ?? v.bibleVersion?.name;
      return label ? `${label}: ${normalizedContent}` : normalizedContent;
    })
    .filter((s): s is string => s != null && s.trim().length > 0)
    .map((s) => normalizeUnicodeReplacementCharacters(s) ?? '');

  return segments.length === 0 ? null : segments.join('\n');
}

/**
 * Returns the first non-empty string from the provided values
 * @param values Array of string values to check
 * @returns First non-empty trimmed string or null
 */
export function firstNonEmpty(...values: (string | null | undefined)[]): string | null {
  for (const value of values) {
    if (value && value.trim().length > 0) {
      return value.trim();
    }
  }
  return null;
}

/**
 * Strips HTML tags from a string
 * @param value The string to strip HTML from
 * @returns String without HTML tags
 */
export function stripHtml(value: string | null | undefined): string {
  if (!value || value.trim().length === 0) {
    return '';
  }

  const charArray: string[] = [];
  let inside = false;

  for (const ch of value) {
    if (ch === '<') {
      inside = true;
      continue;
    }
    if (ch === '>') {
      inside = false;
      continue;
    }

    if (!inside) {
      charArray.push(ch);
    }
  }

  const result = charArray.join('').trim();
  return normalizeUnicodeReplacementCharacters(result) ?? '';
}
