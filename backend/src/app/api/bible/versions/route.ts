import { NextRequest, NextResponse } from 'next/server';
import { ListVersionsQueryHandler } from '@/application/queries/bible/versions/list-versions.handler';
import { ListVersionsQuery } from '@/application/queries/bible/versions/list-versions.query';

// Force dynamic rendering - don't try to statically generate at build time
export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/bible/versions:
 *   get:
 *     summary: List all Bible versions
 *     description: Returns a list of all available Bible translations/versions
 *     tags: [Bible]
 *     responses:
 *       200:
 *         description: List of Bible versions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/BibleVersion'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
export async function GET(request: NextRequest) {
  try {
    const handler = new ListVersionsQueryHandler();
    const query = new ListVersionsQuery();
    
    const result = await handler.handle(query);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/bible/versions:', error);
    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
