/**
 * Text highlighting utilities for search results and other highlighting needs
 */

export interface HighlightOptions {
  caseSensitive?: boolean;
  wholeWordsOnly?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Highlights search terms in text and returns an array of text segments and highlighted parts
 * @param text - The text to highlight
 * @param searchTerms - Single term or array of terms to highlight
 * @param options - Highlighting options
 * @returns Array of objects with {text: string, isHighlighted: boolean}
 */
export function highlightSearchTerms(
  text: string,
  searchTerms: string | string[],
  options: HighlightOptions = {}
): Array<{ text: string; isHighlighted: boolean }> {
  if (!text || !searchTerms) {
    return [{ text, isHighlighted: false }];
  }

  const { caseSensitive = false, wholeWordsOnly = false } = options;
  
  // Normalize search terms
  const terms = Array.isArray(searchTerms) 
    ? searchTerms.filter(term => term.trim().length > 0)
    : [searchTerms].filter(term => term.trim().length > 0);
  
  if (terms.length === 0) {
    return [{ text, isHighlighted: false }];
  }

  // Create regex pattern for all terms
  const escapedTerms = terms.map(term => escapeRegExp(term.trim()));
  const pattern = wholeWordsOnly 
    ? `\\b(${escapedTerms.join('|')})\\b`
    : `(${escapedTerms.join('|')})`;
  
  const flags = caseSensitive ? 'g' : 'gi';
  const regex = new RegExp(pattern, flags);

  // Split text into segments
  const segments: Array<{ text: string; isHighlighted: boolean }> = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    // Add non-highlighted text before match
    if (match.index > lastIndex) {
      segments.push({
        text: text.substring(lastIndex, match.index),
        isHighlighted: false
      });
    }

    // Add highlighted match
    segments.push({
      text: match[0],
      isHighlighted: true
    });

    lastIndex = match.index + match[0].length;
    
    // Prevent infinite loops with zero-width matches
    if (match.index === regex.lastIndex) {
      regex.lastIndex++;
    }
  }

  // Add remaining non-highlighted text
  if (lastIndex < text.length) {
    segments.push({
      text: text.substring(lastIndex),
      isHighlighted: false
    });
  }

  return segments;
}

/**
 * Creates a text snippet around search terms for search results
 * @param text - The full text
 * @param searchTerms - Terms to find and center the snippet around
 * @param maxLength - Maximum length of the snippet (default: 200)
 * @returns Object with snippet text and whether it was truncated
 */
export function createSearchSnippet(
  text: string,
  searchTerms: string | string[],
  maxLength: number = 200
): { snippet: string; truncated: boolean } {
  if (!text || text.length <= maxLength) {
    return { snippet: text, truncated: false };
  }

  const terms = Array.isArray(searchTerms) ? searchTerms : [searchTerms];
  const normalizedTerms = terms.filter(term => term.trim().length > 0);
  
  if (normalizedTerms.length === 0) {
    return { 
      snippet: text.substring(0, maxLength) + '...', 
      truncated: true 
    };
  }

  // Find the first occurrence of any search term
  let earliestIndex = text.length;
  for (const term of normalizedTerms) {
    const index = text.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1 && index < earliestIndex) {
      earliestIndex = index;
    }
  }

  if (earliestIndex === text.length) {
    // No terms found, return beginning of text
    return { 
      snippet: text.substring(0, maxLength) + '...', 
      truncated: true 
    };
  }

  // Calculate snippet boundaries to center around the first match
  const halfLength = Math.floor(maxLength / 2);
  let start = Math.max(0, earliestIndex - halfLength);
  let end = Math.min(text.length, start + maxLength);

  // Adjust start if we hit the end boundary
  if (end - start < maxLength) {
    start = Math.max(0, end - maxLength);
  }

  // Try to break at word boundaries
  if (start > 0) {
    const spaceIndex = text.indexOf(' ', start);
    if (spaceIndex !== -1 && spaceIndex - start < 20) {
      start = spaceIndex + 1;
    }
  }

  if (end < text.length) {
    const spaceIndex = text.lastIndexOf(' ', end);
    if (spaceIndex !== -1 && end - spaceIndex < 20) {
      end = spaceIndex;
    }
  }

  const snippet = text.substring(start, end);
  const prefix = start > 0 ? '...' : '';
  const suffix = end < text.length ? '...' : '';

  return {
    snippet: prefix + snippet + suffix,
    truncated: start > 0 || end < text.length
  };
}

/**
 * Extracts search terms from a query string, handling phrases and individual words
 * @param query - The search query
 * @returns Array of search terms
 */
export function extractSearchTerms(query: string): string[] {
  if (!query.trim()) return [];

  const terms: string[] = [];
  const regex = /"([^"]+)"|(\S+)/g;
  let match;

  while ((match = regex.exec(query)) !== null) {
    const term = match[1] || match[2]; // Quoted phrase or individual word
    if (term && term.trim().length > 0) {
      terms.push(term.trim());
    }
  }

  return terms;
}