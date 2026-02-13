/**
 * List Detailed Bookmarks Query
 * Retrieves all bookmarks for a user with detailed formatted information
 * Converted from C# Application/Queries/User/ListDetailedBookmarks/ListDetailedBookmarksQuery.cs
 */

import { BookmarkDetailedModel } from '@/application/models/user-models/bookmark-detailed.model';

export interface ListDetailedBookmarksQuery {
  userId?: string | null;
}

export type ListDetailedBookmarksQueryResult = BookmarkDetailedModel[];
