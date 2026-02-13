import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authorSlug = body.AuthorSlug || body.authorSlug;
    const bookSlugs = body.BookSlugs || body.bookSlugs;

    if (!authorSlug || !bookSlugs || !Array.isArray(bookSlugs)) {
      return NextResponse.json(
        { error: 'authorSlug and bookSlugs (array) are required' },
        { status: 400 }
      );
    }

    const uniqueSlugs = [...new Set(bookSlugs)];
    const result: Record<string, boolean> = {};
    uniqueSlugs.forEach((slug) => {
      result[slug] = false;
    });

    if (!authorSlug || uniqueSlugs.length === 0) {
      return NextResponse.json(result);
    }

    const availableSlugs = await prisma.commentaries.findMany({
      where: {
        Authors: {
          Slug: authorSlug,
        },
        BibleVerseReferences: {
          BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
            BibleChapters: {
              BibleBooks: {
                Slug: {
                  in: uniqueSlugs,
                },
              },
            },
          },
        },
      },
      select: {
        BibleVerseReferences: {
          select: {
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              select: {
                BibleChapters: {
                  select: {
                    BibleBooks: {
                      select: {
                        Slug: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    const slugSet = new Set<string>();
    availableSlugs.forEach((commentary: any) => {
      const slug =
        commentary.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters
          ?.BibleBooks?.Slug;
      if (slug) {
        slugSet.add(slug);
      }
    });

    slugSet.forEach((slug) => {
      result[slug] = true;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/authors/commentaries/availability:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
