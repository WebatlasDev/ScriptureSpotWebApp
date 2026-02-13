import { AD_CONFIG } from '@/config/adConfig';

/**
 * Analyzes text content to find paragraphs suitable for ad placement
 */
export function findAdPlacementPositions(htmlContent: string): number[] {
  if (!htmlContent) return [];
  
  const globalScope: any = typeof globalThis !== 'undefined' ? globalThis : undefined;
  const supportsDomParser = Boolean(globalScope?.DOMParser);
  const validParagraphs: number[] = [];
  if (supportsDomParser) {
    const parser = new globalScope.DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const paragraphs = doc.querySelectorAll('p');
    
    paragraphs.forEach((paragraph, index) => {
      const text = paragraph.textContent || '';
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount >= AD_CONFIG.CONTENT_AD_RULES.MIN_PARAGRAPH_WORDS) {
        validParagraphs.push(index);
      }
    });
  } else {
    const paragraphRegex = /<p\b[^>]*>([\s\S]*?)<\/p>/gi;
    const matches = Array.from(htmlContent.matchAll(paragraphRegex));
    
    matches.forEach((match, index) => {
      const innerHtml = match[1] || '';
      const text = innerHtml.replace(/<[^>]*>/g, ' ');
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      if (wordCount >= AD_CONFIG.CONTENT_AD_RULES.MIN_PARAGRAPH_WORDS) {
        validParagraphs.push(index);
      }
    });
  }
  
  const placements: number[] = [];
  const totalValidParagraphs = validParagraphs.length;
  
  // Check each configured position
  AD_CONFIG.CONTENT_AD_RULES.PARAGRAPH_POSITIONS.forEach(position => {
    // Find the actual paragraph index for this position
    const paragraphIndex = validParagraphs[position - 1]; // Convert to 0-based
    
    if (paragraphIndex !== undefined) {
      // Check if we're not too close to the end
      const distanceFromEnd = totalValidParagraphs - position;
      if (distanceFromEnd >= AD_CONFIG.CONTENT_AD_RULES.MIN_DISTANCE_FROM_END) {
        placements.push(paragraphIndex);
      }
    }
  });
  
  // Always try to add one at the end if content is long enough
  if (totalValidParagraphs > 3) {
    const lastParagraphIndex = validParagraphs[validParagraphs.length - 1];
    if (lastParagraphIndex !== undefined && !placements.includes(lastParagraphIndex)) {
      placements.push(lastParagraphIndex);
    }
  }

  if (placements.length === 0 && totalValidParagraphs > 0 && totalValidParagraphs <= 2) {
    const fallbackIndex = validParagraphs[Math.min(1, totalValidParagraphs - 1)];

    if (fallbackIndex !== undefined) {
      placements.push(fallbackIndex);
    }
  }

  return placements.sort((a, b) => a - b);
}

/**
 * Inserts ad placeholders into HTML content at specified positions
 */
export function insertAdPlaceholders(htmlContent: string, adPositions: number[], adComponent: string): string {
  if (!htmlContent || adPositions.length === 0) return htmlContent;
  const globalScope: any = typeof globalThis !== 'undefined' ? globalThis : undefined;
  if (!globalScope?.DOMParser) {
    return htmlContent;
  }
  
  const parser = new globalScope.DOMParser();
  const doc = parser.parseFromString(htmlContent, 'text/html');
  const paragraphs = doc.querySelectorAll('p');
  
  // Insert ads in reverse order to maintain correct indices
  const sortedPositions = [...adPositions].sort((a, b) => b - a);
  
  sortedPositions.forEach(position => {
    const targetParagraph = paragraphs[position];
    if (targetParagraph && targetParagraph.parentNode) {
      // Create ad placeholder element
      const adDiv = doc.createElement('div');
      adDiv.className = 'ad-placeholder-content';
      adDiv.setAttribute('data-ad-component', adComponent);
      
      // Insert after the target paragraph
      targetParagraph.parentNode.insertBefore(adDiv, targetParagraph.nextSibling);
    }
  });
  
  return doc.body.innerHTML;
}

/**
 * Checks if the current device is mobile based on screen width
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < AD_CONFIG.BREAKPOINTS.MOBILE;
}

/**
 * Gets the appropriate ad size based on device and ad type
 */
export function getAdSize(adType: keyof typeof AD_CONFIG.AD_SIZES): [number, number] {
  const sizes = AD_CONFIG.AD_SIZES[adType];
  const isMobile = isMobileDevice();
  
  if (isMobile && 'mobile' in sizes) {
    return sizes.mobile as [number, number];
  }
  
  return sizes.desktop as [number, number];
}

/**
 * Generates a unique ad ID for tracking
 */
export function generateAdId(type: string, location: string): string {
  return `ad-${type}-${location}-${Date.now()}`;
}

/**
 * Refreshes ads in modal contexts (for navigation)
 */
export function refreshModalAds(): void {
  if (typeof window === 'undefined' || !window.adsbygoogle) {
    return;
  }

  try {
    const modalRoots = document.querySelectorAll<HTMLElement>('.MuiModal-root');

    modalRoots.forEach(root => {
      const modalAds = root.querySelectorAll<HTMLElement>('.adsbygoogle');
      modalAds.forEach(ad => {
        ad.removeAttribute('data-ad-status');
      });
    });

    (window.adsbygoogle = window.adsbygoogle || []).push({});
  } catch {
  }
}

/**
 * Creates placeholder styles for development/testing
 */
export function createAdPlaceholderStyles(width: number, height: number) {
  return {
    width: `${width}px`,
    height: `${height}px`,
    backgroundColor: '#f0f0f0',
    border: '1px dashed #ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    color: '#666',
    fontFamily: 'Arial, sans-serif',
  };
}
