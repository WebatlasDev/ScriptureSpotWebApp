import { NextRequest, NextResponse } from 'next/server';
import { ListDetailedBookmarksQueryHandler } from '@/application/queries/user/list-detailed-bookmarks.handler';
import { ListDetailedBookmarksQuery } from '@/application/queries/user/list-detailed-bookmarks.query';
import { getAuth } from '@/lib/auth-helper';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * GET /api/user/bookmarks/detailed
 * Lists detailed bookmarks for the authenticated user with populated entity data
 * Query params: bookmarkType? (optional)
 * Requires authentication
 */
export async function GET(request: NextRequest) {
  try {
    const { userId } = await getAuth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const query: ListDetailedBookmarksQuery = {
      userId: userId,
    };
    
    const handler = new ListDetailedBookmarksQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/user/bookmarks/detailed:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
