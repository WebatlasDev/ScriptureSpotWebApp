import crypto from 'crypto';
import { version } from 'os';

export function slugToBookName(slug: string): string {
    return slug
      .split('-')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }

  export function bookNameToSlug(bookName: string): string {
    return bookName.trim().toLowerCase().replace(/\s+/g, '-');
  }  

  export function getCacheKey(path: string, query: Record<string, string>) {
    const data = `${path}?${Object.entries(query).map(([k, v]) => `${k}=${v}`).join('&')}`;
    return crypto.createHash('md5').update(data).digest('hex');
  }
  
  export const getEnvVar = (key: string) => {
    const value = process.env[key];
    if (!value) throw new Error(`Missing env var: ${key}`);
    return value;
  };

function escapeHtml(input: string): string {
  if (typeof input !== 'string') {
    return String(input ?? '');
  }

  return input.replace(/[&<>"']/g, (char) => {
    switch (char) {
      case '&':
        return '&amp;';
      case '<':
        return '&lt;';
      case '>':
        return '&gt;';
      case '"':
        return '&quot;';
      case "'":
        return '&#39;';
      default:
        return char;
    }
  });
}

export function replaceReferenceShortcodes(bibleVersion: string, html: string, authorColorScheme?: { chipText?: string }) {
  if (!html) return html;

  let result = html.replace(/\[Reference\s+([A-Za-z0-9\s]+)\s+(\d+)(?::(\d+)(?:[-–](\d+))?)?\]/g, (_, book, chapter, verse, endVerse) => {
    const escapedBook = escapeHtml(book.trim());
    const escapedChapter = escapeHtml(chapter);
    const escapedVerse = verse ? escapeHtml(verse) : '1'; // Default to verse 1 if no verse specified
    const escapedEndVerse = endVerse ? escapeHtml(endVerse) : null;
    
    const version = escapeHtml(bibleVersion);
    const bookSlug = book.trim().toLowerCase().replace(/\s+/g, '-');
    let url = `/${version}/${bookSlug}/${escapedChapter}/${escapedVerse}`;

    const displayText = verse 
      ? `${escapedBook} ${escapedChapter}:${escapedVerse}${escapedEndVerse ? `–${escapedEndVerse}` : ''}`
      : `${escapedBook} ${escapedChapter}`;
    const tooltipText = `Read ${displayText}`;
    
    const linkColor = authorColorScheme?.chipText || '#96C2FF';
    const colorStyle = `color: ${escapeHtml(linkColor)};`;

    return `<a href="${escapeHtml(url)}" class="scripture-link" style="${colorStyle}" title="${escapeHtml(tooltipText)}">${displayText}</a>`;
  });

  // Add spacing before references when they follow punctuation or letters without space
  result = result.replace(/([a-zA-Z\.,!?;:])(<a[^>]*class="scripture-link"[^>]*>[^<]*<\/a>)/g, '$1 $2');
  
  // Convert asterisk formatting to bold HTML tags
  result = result.replace(/\*([^*]+)\*/g, '<strong>$1</strong>');
  
  return result;
}

/**
 * Extracts meaningful search terms from Strong's definition fields for highlighting
 * @param shortDefinition - The short definition
 * @param definition - The full Strong's definition
 * @param rootWord - The root word/origin
 * @param grammar - Part of speech
 * @returns Array of search terms for highlighting
 */
export function extractStrongsKeywords(
  shortDefinition?: string,
  definition?: string,
  rootWord?: string,
  grammar?: string
): string[] {
  const keywords: string[] = [];
  
  // Common words to filter out
  const stopWords = new Set([
    'a', 'an', 'and', 'are', 'as', 'at', 'be', 'by', 'for', 'from', 'has', 'he', 
    'in', 'is', 'it', 'its', 'of', 'on', 'that', 'the', 'to', 'was', 'will', 
    'with', 'this', 'they', 'them', 'their', 'or', 'but', 'not', 'all', 'any',
    'can', 'had', 'her', 'his', 'how', 'man', 'may', 'new', 'now', 'old', 'see',
    'two', 'way', 'who', 'boy', 'did', 'has', 'let', 'put', 'say', 'she', 'too',
    'use', 'also', 'each', 'made', 'make', 'most', 'over', 'said', 'some', 'time',
    'very', 'what', 'word', 'work', 'been', 'call', 'come', 'could', 'first',
    'find', 'long', 'look', 'part', 'than', 'these', 'would', 'write', 'like',
    'other', 'many', 'then', 'them', 'well', 'were'
  ]);

  // Extract from short definition (highest priority)
  if (shortDefinition) {
    const terms = shortDefinition
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ') // Remove punctuation
      .split(/\s+/)
      .filter(term => term.length > 2 && !stopWords.has(term));
    keywords.push(...terms);
  }

  // Extract from root word
  if (rootWord) {
    const cleanedRoot = rootWord
      .replace(/[^\w\s]/g, ' ')
      .replace(/\b(from|derived|akin|to|probably|apparently|uncertain|origin|root)\b/gi, '')
      .trim();
    
    const rootTerms = cleanedRoot
      .toLowerCase()
      .split(/\s+/)
      .filter(term => term.length > 2 && !stopWords.has(term));
    keywords.push(...rootTerms);
  }

  // Extract key terms from full definition (lower priority)
  if (definition) {
    // Look for quoted terms or parenthetical explanations
    const quotedTerms = definition.match(/"([^"]+)"/g);
    if (quotedTerms) {
      quotedTerms.forEach(quoted => {
        const term = quoted.replace(/"/g, '').toLowerCase().trim();
        if (term.length > 2 && !stopWords.has(term)) {
          keywords.push(term);
        }
      });
    }

    // Extract first few significant words from definition
    const defWords = definition
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .slice(0, 8) // Only first 8 words to avoid too much highlighting
      .filter(term => term.length > 3 && !stopWords.has(term));
    keywords.push(...defWords);
  }

  // Remove duplicates and return
  return [...new Set(keywords)].filter(term => term.length > 2);
}
  
