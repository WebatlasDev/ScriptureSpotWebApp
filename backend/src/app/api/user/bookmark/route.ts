import { NextRequest, NextResponse } from 'next/server';
import { getAuth } from '@/lib/auth-helper';
import { CreateBookmarkCommandHandler } from '@/application/commands/user/create-bookmark.handler';
import { CreateBookmarkCommand } from '@/application/commands/user/create-bookmark.command';

export const dynamic = 'force-dynamic';

/**
 * POST /api/user/bookmark
 * Creates a bookmark
 */
export async function POST(request: NextRequest) {
  try{
    
    const { userId } = await getAuth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    const command = new CreateBookmarkCommand();
    command.id = body.entityId;
    command.type = body.bookmarkType;
    command.userId = userId;
    
    const handler = new CreateBookmarkCommandHandler();
    const result = await handler.handle(command);
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error in POST /api/user/bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * @swagger
 * /api/user/bookmark:
 *   delete:
 *     summary: Delete a bookmark
 *     description: Removes a bookmark for the authenticated user
 *     tags: [User]
 *     security:
 *       - ClerkAuth: []
 *     parameters:
 *       - in: query
 *         name: entityId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: ID of the bookmarked entity to remove
 *     responses:
 *       200:
 *         description: Bookmark deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *       400:
 *         description: Bad request - entityId is required
 *       401:
 *         description: Unauthorized - authentication required
 *       500:
 *         description: Internal server error
 */
export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await getAuth();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    // Read from query params (test sends ?verseId=1&bookmarkType=favorite)
    const { searchParams } = new URL(request.url);
    const entityId = searchParams.get('entityId') || searchParams.get('verseId') || searchParams.get('id');
    
    if (!entityId) {
      return NextResponse.json(
        { error: 'Bad Request: entityId is required' },
        { status: 400 }
      );
    }
    
    const { DeleteBookmarkCommandHandler } = await import('@/application/commands/user/delete-bookmark.handler');
    const { DeleteBookmarkCommand } = await import('@/application/commands/user/delete-bookmark.command');
    
    const command = new DeleteBookmarkCommand();
    command.id = entityId;
    command.userId = userId;
    
    const handler = new DeleteBookmarkCommandHandler();
    const result = await handler.handle(command);
    
    return NextResponse.json({ success: result });
  } catch (error) {
    console.error('Error in DELETE /api/user/bookmark:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
