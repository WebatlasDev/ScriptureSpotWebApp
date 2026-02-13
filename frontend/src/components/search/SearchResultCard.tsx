'use client';

import TakeawaySearchCard from './TakeawaySearchCard';
import CommentarySearchCard from './CommentarySearchCard';
import AuthorSearchCard from './AuthorSearchCard';
import BibleVerseSearchCard from './BibleVerseSearchCard';
import { SearchEntry } from './BaseSearchCard';

interface SearchResultCardProps {
  entry: SearchEntry & { type?: string };
  searchTerms: string[];
  groupType?: string; // Add groupType as fallback for entry type
}

export default function SearchResultCard({ entry, searchTerms, groupType }: SearchResultCardProps) {
  // Determine the entry type - use entry.type if available, otherwise use groupType
  const entryType = entry.type || groupType;

  switch (entryType) {
    case 'Takeaway':
    case 'BibleVerseTakeaway':
      return <TakeawaySearchCard entry={entry} searchTerms={searchTerms} />;
    case 'Commentary':
      return <CommentarySearchCard entry={entry} searchTerms={searchTerms} />;
    case 'Author':
      return <AuthorSearchCard entry={entry} searchTerms={searchTerms} />;
    case 'BibleVerse':
    case 'BibleVerseVersion':
      return <BibleVerseSearchCard entry={entry} searchTerms={searchTerms} />;
    default:
      // Default to commentary card for unknown types
      return <CommentarySearchCard entry={entry} searchTerms={searchTerms} />;
  }
}