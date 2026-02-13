/**
 * Parsed Bible Reference
 * Helper class for parsing various Bible reference formats
 * Converted from C# Infrastructure/Services/BibleVerseCrossReferenceImportService.ParsedBibleReference
 */

export class ParsedBibleReference {
  book: string = '';
  chapter: number = 0;
  startVerse: number = 0;
  endChapter: number = 0;
  endVerse: number = 0;

  /**
   * Parses a Bible reference string into structured components
   * @param input The reference string (e.g., "John 3:16", "1:1-2:3", "16-18")
   * @param defaultBook Optional default book name for partial references
   * @param defaultChapter Optional default chapter number for verse-only references
   * @returns Parsed reference object
   * @throws Error if format is invalid
   */
  static parse(
    input: string,
    defaultBook?: string,
    defaultChapter?: number
  ): ParsedBibleReference {
    input = input.trim();

    // Remove trailing punctuation
    input = input.replace(/[,;.\)\]\}]+$/, '');

    // Pattern with explicit book name and cross-chapter range: "John 1:1-2:3"
    const crossBookRegex = /^(?<book>[\d\s\w]+?)\s+(?<startChapter>\d+):(?<startVerse>\d+)-(?<endChapter>\d+):(?<endVerse>\d+)$/i;
    let match = input.match(crossBookRegex);
    if (match && match.groups) {
      const result = new ParsedBibleReference();
      result.book = match.groups.book.trim();
      result.chapter = parseInt(match.groups.startChapter, 10);
      result.startVerse = parseInt(match.groups.startVerse, 10);
      result.endChapter = parseInt(match.groups.endChapter, 10);
      result.endVerse = parseInt(match.groups.endVerse, 10);
      return result;
    }

    // Pattern with explicit book name within single chapter: "John 3:16-18"
    const fullRegex = /^(?<book>[\d\s\w]+?)\s+(?<chapter>\d+):(?<startVerse>\d+)(?:[-:](?<endVerse>\d+))?$/i;
    match = input.match(fullRegex);
    if (match && match.groups) {
      const result = new ParsedBibleReference();
      result.book = match.groups.book.trim();
      result.chapter = parseInt(match.groups.chapter, 10);
      result.startVerse = parseInt(match.groups.startVerse, 10);
      result.endChapter = result.chapter;
      result.endVerse = match.groups.endVerse
        ? parseInt(match.groups.endVerse, 10)
        : result.startVerse;
      return result;
    }

    // Pattern with cross-chapter range, no book: "1:1-2:3"
    const crossNoBookRegex = /^(?<startChapter>\d+):(?<startVerse>\d+)-(?<endChapter>\d+):(?<endVerse>\d+)$/i;
    match = input.match(crossNoBookRegex);
    if (match && match.groups && defaultBook) {
      const result = new ParsedBibleReference();
      result.book = defaultBook;
      result.chapter = parseInt(match.groups.startChapter, 10);
      result.startVerse = parseInt(match.groups.startVerse, 10);
      result.endChapter = parseInt(match.groups.endChapter, 10);
      result.endVerse = parseInt(match.groups.endVerse, 10);
      return result;
    }

    // Pattern with chapter only: "3:16-18"
    const chapterRegex = /^(?<chapter>\d+):(?<startVerse>\d+)(?:[-:](?<endVerse>\d+))?$/i;
    match = input.match(chapterRegex);
    if (match && match.groups) {
      if (!defaultBook) {
        throw new Error(`Invalid Bible reference format: '${input}'`);
      }

      const result = new ParsedBibleReference();
      result.book = defaultBook;
      result.chapter = parseInt(match.groups.chapter, 10);
      result.startVerse = parseInt(match.groups.startVerse, 10);
      result.endChapter = result.chapter;
      result.endVerse = match.groups.endVerse
        ? parseInt(match.groups.endVerse, 10)
        : result.startVerse;
      return result;
    }

    // Pattern with just verses: "16-18"
    const verseRegex = /^(?<startVerse>\d+)(?:[-:](?<endVerse>\d+))?$/i;
    match = input.match(verseRegex);
    if (match && match.groups && defaultBook && defaultChapter) {
      const result = new ParsedBibleReference();
      result.book = defaultBook;
      result.chapter = defaultChapter;
      result.startVerse = parseInt(match.groups.startVerse, 10);
      result.endChapter = defaultChapter;
      result.endVerse = match.groups.endVerse
        ? parseInt(match.groups.endVerse, 10)
        : result.startVerse;
      return result;
    }

    throw new Error(`Invalid Bible reference format: '${input}'`);
  }
}
