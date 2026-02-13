import { Author, AuthorFromAPI } from '@/types/author';
import { authorBiographies, AuthorBiography } from '@/data/authorBiographies';

/**
 * Get biography for an author
 *
 * Priority:
 * 1. Check if author object already has biography from API
 * 2. Fall back to temporary data file
 * 3. Return null if not found
 *
 * When API includes biography data, the fallback will automatically be skipped.
 * To fully migrate: Remove authorBiographies import and fallback logic.
 */
export function getAuthorBiography(author: Author | AuthorFromAPI): AuthorBiography | null {
  // Check if author already has biography from API
  if ('biography' in author && author.biography) {
    return author.biography;
  }

  // Fall back to temporary data
  if (author.slug && authorBiographies[author.slug]) {
    return authorBiographies[author.slug];
  }

  // No biography found
  return null;
}
