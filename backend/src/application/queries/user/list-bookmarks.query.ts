/**
 * List Bookmarks Query
 * Retrieves all bookmarks for a specific user
 * Converted from C# Application/Queries/User/ListBookmarks/ListBookmarksQuery.cs
 */

import { BookmarkModel } from '@/application/models/user-models/bookmark.model';

export interface ListBookmarksQuery {
  userId?: string | null;
}

export type ListBookmarksQueryResult = BookmarkModel[];
