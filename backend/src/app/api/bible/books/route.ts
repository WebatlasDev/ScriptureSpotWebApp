import { NextRequest, NextResponse } from 'next/server';
import { ListBooksQueryHandler } from '@/application/queries/bible/books/list-books.handler';
import { ListBooksQuery } from '@/application/queries/bible/books/list-books.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/bible/books:
 *   get:
 *     summary: List all Bible books
 *     description: Returns all books of the Bible ordered by book number (Genesis to Revelation)
 *     tags: [Bible]
 *     responses:
 *       200:
 *         description: List of Bible books
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BibleBook'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const handler = new ListBooksQueryHandler();
    const query = new ListBooksQuery();
    
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/books:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
