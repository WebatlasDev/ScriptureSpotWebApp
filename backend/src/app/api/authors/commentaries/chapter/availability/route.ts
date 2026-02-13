import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const authorSlug = body.AuthorSlug || body.authorSlug;
    const bookSlug = body.BookSlug || body.bookSlug;
    const chapterNumbers = body.ChapterNumbers || body.chapterNumbers;

    if (!authorSlug || !bookSlug || !chapterNumbers || !Array.isArray(chapterNumbers)) {
      return NextResponse.json(
        { error: 'authorSlug, bookSlug, and chapterNumbers (array) are required' },
        { status: 400 }
      );
    }

    const uniqueChapters = [...new Set(chapterNumbers)];
    const result: Record<number, boolean> = {};
    uniqueChapters.forEach((chapter) => {
      result[chapter] = false;
    });

    if (!authorSlug || !bookSlug || uniqueChapters.length === 0) {
      return NextResponse.json(result);
    }

    const availableChapters = await prisma.commentaries.findMany({
      where: {
        Authors: {
          Slug: authorSlug,
        },
        BibleVerseReferences: {
          BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
            BibleChapters: {
              BibleBooks: {
                Slug: bookSlug,
              },
              ChapterNumber: {
                in: uniqueChapters,
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
                    ChapterNumber: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    const chapterSet = new Set<number>();
    availableChapters.forEach((commentary: any) => {
      const chapterNum =
        commentary.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.BibleChapters
          ?.ChapterNumber;
      if (chapterNum !== null && chapterNum !== undefined) {
        chapterSet.add(chapterNum);
      }
    });

    chapterSet.forEach((chapter) => {
      result[chapter] = true;
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in POST /api/authors/commentaries/chapter/availability:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
