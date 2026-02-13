/**
 * Verse Reference Shortcode Helper
 * Shared utility for injecting verse reference shortcodes into text content
 * Converts Bible references like "John 3:16" to "[Reference John 3:16]" format
 * Used by multiple import services
 */

export class VerseReferenceShortcodeHelper {
  /**
   * Injects verse reference shortcodes into content text
   * @param content The text content to process
   * @param bookAbbreviations Map of normalized book keys to full book names
   * @returns Content with injected shortcodes
   */
  static injectVerseReferenceShortcodes(
    content: string | undefined | null,
    bookAbbreviations: Map<string, string>
  ): string | null {
    if (!content || content.trim().length === 0) return null;

    let result = content;

    const getProtectedRanges = (input: string): Array<{ start: number; end: number }> => {
      const matches = input.matchAll(/\[Reference\s[^\]]+\]/g);
      return Array.from(matches).map((m) => ({
        start: m.index!,
        end: m.index! + m[0].length,
      }));
    };

    const isInProtectedRange = (
      index: number,
      ranges: Array<{ start: number; end: number }>
    ): boolean => {
      return ranges.some((r) => index >= r.start && index < r.end);
    };

    const normalizeBookKey = (raw: string): string => {
      if (!raw || raw.trim().length === 0) return '';
      let normalized = raw.replace(/\./g, '').trim();
      normalized = normalized.replace(/\bIII\b/gi, '3');
      normalized = normalized.replace(/\bII\b/gi, '2');
      normalized = normalized.replace(/\bI\b/gi, '1');
      normalized = normalized.replace(/[^a-z0-9]/gi, '');
      return normalized.toLowerCase();
    };

    const bookPattern = '(?:[1-3I]{0,3}\\s*)?(?:[A-Z][a-z]+\\s*){1,3}';

    // Pass 1: Handle grouped references like "(Matt 1:1; 2:4; Mark 3:5)"
    let protectedRanges = getProtectedRanges(result);
    result = result.replace(/\(([^)]+)\)/g, (match, group, offset) => {
      if (isInProtectedRange(offset, protectedRanges)) return match;

      const refs = group.split(';');
      const output: string[] = [];
      let currentBook: string | null = null;

      for (const part of refs) {
        const cleanPart = part.trim();
        const partMatch = cleanPart.match(
          new RegExp(`^(?:(?<book>${bookPattern})\\s*)?(?<ref>\\d+:\\d+(?:[-–:]\\d+)?)$`, 'i')
        );

        if (partMatch && partMatch.groups) {
          const book = partMatch.groups.book?.trim();
          const reference = partMatch.groups.ref?.trim().replace(/\s/g, '');

          if (book) {
            const bookKey = normalizeBookKey(book);
            const resolved = bookAbbreviations.get(bookKey);
            if (resolved) {
              currentBook = resolved;
            } else {
              output.push(cleanPart);
              continue;
            }
          }

          if (currentBook && reference) {
            output.push(`[Reference ${currentBook} ${reference}]`);
          } else {
            output.push(cleanPart);
          }
        } else {
          output.push(cleanPart);
        }
      }

      return `(${output.join('; ')})`;
    });

    protectedRanges = getProtectedRanges(result);

    // Pass 2: Match single full references like "1 Peter 2:9", "Song of Solomon 1:1"
    result = result.replace(
      new RegExp(`(${bookPattern})\\s+(\\d+:\\d+(?:[-–:]\\d+)?)`, 'gi'),
      (match, book, reference, offset) => {
        if (isInProtectedRange(offset, protectedRanges)) return match;

        const cleanBook = book.trim();
        const cleanReference = reference.replace(/\s/g, '');
        const bookKey = normalizeBookKey(cleanBook);
        const resolvedBook = bookAbbreviations.get(bookKey);

        if (resolvedBook) {
          return `[Reference ${resolvedBook} ${cleanReference}]`;
        }

        return match;
      }
    );

    protectedRanges = getProtectedRanges(result);

    // Pass 3: Match "Book Chapter" only if not followed by colon
    result = result.replace(
      new RegExp(`(?<!\\[Reference\\s)(${bookPattern})\\s+(\\d{1,3})(?!\\s*[:])`, 'gi'),
      (match, book, chapter, offset) => {
        if (isInProtectedRange(offset, protectedRanges)) return match;

        const cleanBook = book.trim();
        const bookKey = normalizeBookKey(cleanBook);
        const resolvedBook = bookAbbreviations.get(bookKey);

        if (resolvedBook) {
          return `[Reference ${resolvedBook} ${chapter}]`;
        }

        return match;
      }
    );

    return result;
  }

  /**
   * Normalizes book key for lookup
   * @param raw The raw book name/abbreviation
   * @returns Normalized lowercase key
   */
  static normalizeBookKey(raw: string): string {
    if (!raw || raw.trim().length === 0) return '';
    let normalized = raw.replace(/[^a-z0-9]/gi, '');
    normalized = normalized.replace(/\bIII\b/gi, '3');
    normalized = normalized.replace(/\bII\b/gi, '2');
    normalized = normalized.replace(/\bI\b/gi, '1');
    return normalized.toLowerCase();
  }
}
