import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth-helper';
import { ListBookmarksQueryHandler } from '@/application/queries/user/list-bookmarks.handler';
import { ListBookmarksQuery } from '@/application/queries/user/list-bookmarks.query';

export const dynamic = 'force-dynamic';

/**
 * GET /api/user/bookmarks
 * Lists user bookmarks
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
    
    const query: ListBookmarksQuery = {
      userId: userId,
    };
    
    const handler = new ListBookmarksQueryHandler();
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/user/bookmarks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
