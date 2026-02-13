/**
 * HTML sanitization utilities for safely rendering user content
 */

import { replaceReferenceShortcodes } from './stringHelpers';

/**
 * Escapes special regex characters in a string
 */
function escapeRegExp(string: string): string {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Allowed HTML tags for search results and commentary content
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'b', 'em', 'i', 'u', 'span', 'div',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li',
  'blockquote', 'cite', 'q',
  'a', 'sub', 'sup',
  'small', 'mark'
];

// Allowed attributes for specific tags
const ALLOWED_ATTRIBUTES: Record<string, string[]> = {
  'a': ['href', 'title', 'target'],
  'span': ['class', 'style'],
  'div': ['class', 'style'],
  'p': ['class', 'style'],
  'blockquote': ['cite', 'class'],
  '*': ['id', 'class'] // Allow id and class on any tag
};

/**
 * Basic HTML sanitizer that removes dangerous tags and attributes
 * This is a simple implementation - for production use, consider using a library like DOMPurify
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // Create a temporary DOM element to parse HTML
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Recursively clean the DOM tree
  function cleanElement(element: Element): void {
    const tagName = element.tagName.toLowerCase();
    
    // Remove disallowed tags
    if (!ALLOWED_TAGS.includes(tagName)) {
      element.remove();
      return;
    }

    // Clean attributes
    const allowedAttrs = [
      ...(ALLOWED_ATTRIBUTES[tagName] || []),
      ...(ALLOWED_ATTRIBUTES['*'] || [])
    ];

    // Remove disallowed attributes
    Array.from(element.attributes).forEach(attr => {
      if (!allowedAttrs.includes(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      }
    });

    // Clean href attributes to prevent javascript: and data: URLs
    if (element.hasAttribute('href')) {
      const href = element.getAttribute('href') || '';
      if (href.toLowerCase().startsWith('javascript:') || 
          href.toLowerCase().startsWith('data:') ||
          href.toLowerCase().startsWith('vbscript:')) {
        element.removeAttribute('href');
      }
    }

    // Clean style attributes to remove dangerous CSS
    if (element.hasAttribute('style')) {
      const style = element.getAttribute('style') || '';
      // Remove potentially dangerous CSS properties
      const cleanStyle = style
        .replace(/expression\s*\(/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/onload/gi, '')
        .replace(/onerror/gi, '');
      
      if (cleanStyle !== style) {
        element.setAttribute('style', cleanStyle);
      }
    }

    // Recursively clean child elements
    Array.from(element.children).forEach(child => {
      cleanElement(child);
    });
  }

  // Clean all elements
  Array.from(tempDiv.children).forEach(child => {
    cleanElement(child);
  });

  return tempDiv.innerHTML;
}

/**
 * Sanitize HTML specifically for search result content
 * This version is more restrictive and focuses on common formatting tags
 */
export function sanitizeSearchResultHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  // More restrictive tag list for search results
  const searchAllowedTags = [
    'p', 'br', 'strong', 'b', 'em', 'i', 'span',
    'blockquote', 'cite', 'q', 'sub', 'sup', 'small'
  ];

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  function cleanSearchElement(element: Element): void {
    const tagName = element.tagName.toLowerCase();
    
    // Remove disallowed tags but keep their content
    if (!searchAllowedTags.includes(tagName)) {
      // Replace with span to preserve content
      const span = document.createElement('span');
      span.innerHTML = element.innerHTML;
      element.parentNode?.replaceChild(span, element);
      cleanSearchElement(span);
      return;
    }

    // Remove all attributes except basic styling
    Array.from(element.attributes).forEach(attr => {
      if (!['class'].includes(attr.name.toLowerCase())) {
        element.removeAttribute(attr.name);
      }
    });

    // Recursively clean child elements
    Array.from(element.children).forEach(child => {
      cleanSearchElement(child);
    });
  }

  Array.from(tempDiv.children).forEach(child => {
    cleanSearchElement(child);
  });

  return tempDiv.innerHTML;
}

/**
 * Highlight search terms in HTML content while preserving HTML structure
 */
export function highlightTermsInHtml(html: string, searchTerms: string[]): string {
  if (!html || !searchTerms || searchTerms.length === 0) {
    return html;
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Create regex pattern for all terms
  const escapedTerms = searchTerms.map(term => escapeRegExp(term.trim()));
  const pattern = `\\b(${escapedTerms.join('|')})\\b`;
  const regex = new RegExp(pattern, 'gi');

  function highlightInTextNodes(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent || '';
      if (regex.test(text)) {
        const highlightedText = text.replace(regex, '<mark style="background-color: #FFD700; color: #000000; font-weight: 700; border-radius: 3px; padding: 2px 4px; box-shadow: 0 1px 2px rgba(0,0,0,0.2);">$1</mark>');
        const wrapper = document.createElement('span');
        wrapper.innerHTML = highlightedText;
        node.parentNode?.replaceChild(wrapper, node);
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Don't highlight inside existing mark tags
      if ((node as Element).tagName.toLowerCase() !== 'mark') {
        Array.from(node.childNodes).forEach(child => {
          highlightInTextNodes(child);
        });
      }
    }
  }

  Array.from(tempDiv.childNodes).forEach(child => {
    highlightInTextNodes(child);
  });

  return tempDiv.innerHTML;
}


/**
 * Creates a DOM-aware text snippet that properly handles HTML structure
 * Returns both the snippet and fade information for proper styling
 */
export function createSmartSearchSnippet(
  text: string, 
  searchTerms: string[], 
  maxLength: number = 400,
  bibleVersion: string = 'ESV',
  authorColorScheme?: { chipText?: string }
): { 
  snippet: string; 
  fadeTop: boolean; 
  fadeBottom: boolean; 
  highlightedHtml: string;
} {
  if (!text || !searchTerms || searchTerms.length === 0) {
    const processedText = replaceReferenceShortcodes(bibleVersion, text, authorColorScheme);
    const truncated = processedText.substring(0, maxLength);
    return { 
      snippet: stripHtml(truncated), 
      fadeTop: false, 
      fadeBottom: processedText.length > maxLength,
      highlightedHtml: sanitizeSearchResultHtml(truncated)
    };
  }

  // Process shortcodes first using the existing function
  const processedText = replaceReferenceShortcodes(bibleVersion, text, authorColorScheme);
  const plainText = stripHtml(processedText);
  
  // Find the first occurrence of any search term in plain text
  let firstMatchIndex = plainText.length;
  let matchLength = 0;
  
  for (const term of searchTerms) {
    const index = plainText.toLowerCase().indexOf(term.toLowerCase());
    if (index !== -1 && index < firstMatchIndex) {
      firstMatchIndex = index;
      matchLength = term.length;
    }
  }

  // If no match found, show from beginning
  if (firstMatchIndex === plainText.length) {
    const truncated = processedText.substring(0, maxLength);
    return {
      snippet: stripHtml(truncated),
      fadeTop: false,
      fadeBottom: processedText.length > maxLength,
      highlightedHtml: highlightTermsInHtml(sanitizeSearchResultHtml(truncated), searchTerms)
    };
  }

  // Use DOM-based extraction for better HTML handling
  if (containsHtml(processedText)) {
    return createDomAwareSnippet(processedText, plainText, firstMatchIndex, matchLength, searchTerms, maxLength);
  }

  // For plain text, use the simpler approach
  return createPlainTextSnippet(processedText, plainText, firstMatchIndex, matchLength, searchTerms, maxLength);
}

/**
 * Creates snippet using DOM parsing for accurate HTML handling
 */
function createDomAwareSnippet(
  html: string,
  plainText: string,
  matchIndex: number,
  matchLength: number,
  searchTerms: string[],
  maxLength: number
): { snippet: string; fadeTop: boolean; fadeBottom: boolean; highlightedHtml: string; } {
  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;

  // Build a map of plain text positions to DOM positions
  const textNodes: { node: Text; startPos: number; endPos: number; }[] = [];
  let currentPos = 0;

  function walkTextNodes(node: Node): void {
    if (node.nodeType === Node.TEXT_NODE) {
      const textContent = node.textContent || '';
      if (textContent.length > 0) {
        textNodes.push({
          node: node as Text,
          startPos: currentPos,
          endPos: currentPos + textContent.length
        });
        currentPos += textContent.length;
      }
    } else {
      Array.from(node.childNodes).forEach(walkTextNodes);
    }
  }

  walkTextNodes(tempDiv);

  // Find which text nodes contain our target range
  const halfLength = Math.floor(maxLength / 2);
  const matchCenter = matchIndex + Math.floor(matchLength / 2);
  
  let desiredStart = Math.max(0, matchCenter - halfLength);
  let desiredEnd = Math.min(plainText.length, desiredStart + maxLength);
  
  // Adjust if we can't fill the full length
  if (desiredEnd - desiredStart < maxLength) {
    desiredStart = Math.max(0, desiredEnd - maxLength);
  }

  // Find word boundaries
  if (desiredStart > 0) {
    const spaceIndex = plainText.indexOf(' ', desiredStart);
    if (spaceIndex !== -1 && spaceIndex - desiredStart < 50) {
      desiredStart = spaceIndex + 1;
    }
  }

  if (desiredEnd < plainText.length) {
    const spaceIndex = plainText.lastIndexOf(' ', desiredEnd);
    if (spaceIndex !== -1 && desiredEnd - spaceIndex < 50) {
      desiredEnd = spaceIndex;
    }
  }

  // Find the DOM nodes that contain our desired range
  const startNode = textNodes.find(tn => tn.startPos <= desiredStart && tn.endPos > desiredStart);
  const endNode = textNodes.find(tn => tn.startPos < desiredEnd && tn.endPos >= desiredEnd);

  if (!startNode || !endNode) {
    // Fallback to simple approach
    return createPlainTextSnippet(html, plainText, matchIndex, matchLength, searchTerms, maxLength);
  }

  // Extract the HTML content preserving structure
  const range = document.createRange();
  
  // Set range start
  const startOffset = Math.max(0, desiredStart - startNode.startPos);
  range.setStart(startNode.node, startOffset);
  
  // Set range end
  const endOffset = Math.min(endNode.node.textContent?.length || 0, desiredEnd - endNode.startPos);
  range.setEnd(endNode.node, endOffset);

  // Extract the content
  const extractedContent = range.extractContents();
  const containerDiv = document.createElement('div');
  containerDiv.appendChild(extractedContent);
  
  const htmlSnippet = containerDiv.innerHTML;
  const snippet = stripHtml(htmlSnippet);

  return {
    snippet,
    fadeTop: desiredStart > 0,
    fadeBottom: desiredEnd < plainText.length,
    highlightedHtml: highlightTermsInHtml(sanitizeSearchResultHtml(htmlSnippet), searchTerms)
  };
}

/**
 * Creates snippet for plain text content
 */
function createPlainTextSnippet(
  text: string,
  plainText: string,
  matchIndex: number,
  matchLength: number,
  searchTerms: string[],
  maxLength: number
): { snippet: string; fadeTop: boolean; fadeBottom: boolean; highlightedHtml: string; } {
  const halfLength = Math.floor(maxLength / 2);
  const matchCenter = matchIndex + Math.floor(matchLength / 2);
  
  let start = Math.max(0, matchCenter - halfLength);
  let end = Math.min(plainText.length, start + maxLength);
  
  // Adjust if we can't fill the full length
  if (end - start < maxLength) {
    start = Math.max(0, end - maxLength);
  }

  // Word boundary adjustments
  if (start > 0) {
    const spaceIndex = plainText.indexOf(' ', start);
    if (spaceIndex !== -1 && spaceIndex - start < 50) {
      start = spaceIndex + 1;
    }
  }

  if (end < plainText.length) {
    const spaceIndex = plainText.lastIndexOf(' ', end);
    if (spaceIndex !== -1 && end - spaceIndex < 50) {
      end = spaceIndex;
    }
  }

  const snippet = plainText.substring(start, end);
  const htmlSnippet = text.substring(start, end);

  return {
    snippet,
    fadeTop: start > 0,
    fadeBottom: end < plainText.length,
    highlightedHtml: highlightTermsInHtml(sanitizeSearchResultHtml(htmlSnippet), searchTerms)
  };
}

/**
 * Strip all HTML tags and return plain text
 */
export function stripHtml(html: string): string {
  if (!html || typeof html !== 'string') {
    return '';
  }

  const tempDiv = document.createElement('div');
  tempDiv.innerHTML = html;
  return tempDiv.textContent || tempDiv.innerText || '';
}

/**
 * Check if a string contains HTML tags
 */
export function containsHtml(text: string): boolean {
  if (!text || typeof text !== 'string') {
    return false;
  }
  
  return /<[^>]*>/g.test(text);
}