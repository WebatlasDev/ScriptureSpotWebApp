import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

enum CommentaryExcerptType {
  Original = 0,
  Modern = 1,
}

enum CommentaryExcerptRequestType {
  Original = 'Original',
  Modern = 'Modern',
  Combined = 'Combined',
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const bookSlug = searchParams.get('BookSlug') || searchParams.get('bookSlug');
    const chapterNumber = searchParams.get('ChapterNumber') || searchParams.get('chapterNumber');
    const verseNumber = searchParams.get('VerseNumber') || searchParams.get('verseNumber');
    const requestType = (searchParams.get('RequestType') || searchParams.get('requestType') || 'Combined') as CommentaryExcerptRequestType;
    const previewCount = parseInt(searchParams.get('PreviewCount') || searchParams.get('previewCount') || '150');

    if (!bookSlug || !chapterNumber || !verseNumber) {
      return NextResponse.json(
        { error: 'bookSlug, chapterNumber, and verseNumber are required' },
        { status: 400 }
      );
    }

    const chapterNum = parseInt(chapterNumber);
    const verseNum = parseInt(verseNumber);

    const allCommentaries = await prisma.commentaries.findMany({
      where: {
        BibleVerseReferences: {
          BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
            BibleChapters: {
              BibleBooks: {
                Slug: bookSlug,
              },
              ChapterNumber: chapterNum,
            },
          },
        },
      },
      include: {
        Authors: true,
        BibleVerseReferences: {
          include: {
            BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: {
              include: {
                BibleChapters: {
                  include: {
                    BibleBooks: true,
                  },
                },
              },
            },
            BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses: {
              include: {
                BibleChapters: {
                  include: {
                    BibleBooks: true,
                  },
                },
              },
            },
          },
        },
        CommentaryExcerpt: {
          orderBy: { Order: 'asc' },
        },
      },
      orderBy: [
        { Authors: { Name: 'asc' } },
        { BibleVerseReferences: { BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses: { VerseNumber: 'asc' } } },
      ],
    });

    const commentaries = allCommentaries.filter((commentary: any) => {
      const startVerse = commentary.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses;
      const endVerse = commentary.BibleVerseReferences?.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses;
      
      if (!startVerse) return false;
      
      const startVerseNum = startVerse.VerseNumber;
      const endVerseNum = endVerse?.VerseNumber;
      
      if (endVerseNum === null || endVerseNum === undefined) {
        return startVerseNum === verseNum;
      }
      
      return startVerseNum <= verseNum && endVerseNum >= verseNum;
    });

    console.log('✅ [Commentary API] After filtering:', commentaries.length, 'commentaries match verse', verseNum);

    console.log('🔨 [Commentary API] Mapping response for', commentaries.length, 'commentaries');

    const result = commentaries.map((commentary: any) => {
      let excerpts = commentary.CommentaryExcerpt || [];

      switch (requestType) {
        case CommentaryExcerptRequestType.Original:
          excerpts = excerpts.filter((x: any) => x.Type === CommentaryExcerptType.Original);
          break;
        case CommentaryExcerptRequestType.Modern:
          excerpts = excerpts.filter((x: any) => x.Type === CommentaryExcerptType.Modern);
          break;
        case CommentaryExcerptRequestType.Combined:
          if (excerpts.some((x: any) => x.Type === CommentaryExcerptType.Modern)) {
            const grouped = new Map();
            excerpts.forEach((e: any) => {
              const key = `${e.CommentaryId}-${e.Order}`;
              if (!grouped.has(key)) {
                grouped.set(key, e);
              } else if (e.Type === CommentaryExcerptType.Modern) {
                grouped.set(key, e);
              }
            });
            excerpts = Array.from(grouped.values());
          } else {
            excerpts = excerpts.filter((x: any) => x.Type === CommentaryExcerptType.Original);
          }
          break;
      }

      let previewContent = '';
      const cleanedExcerpts = excerpts.map((excerpt: any) => {
        const cleaned = (excerpt.Content || '')
          .replace(/\r\n/g, ' ')
          .replace(/\n/g, ' ')
          .replace(/```/g, '')
          .replace(/html/g, '')
          .trim()
          .replace(/\s{2,}/g, ' ');

        if (previewContent.length < previewCount) {
          const remaining = previewCount - previewContent.length;
          previewContent += cleaned.substring(0, remaining);
        }

        return {
          id: excerpt.Id,
          commentaryId: excerpt.CommentaryId,
          order: excerpt.Order,
          content: cleaned,
          type: excerpt.Type,
        };
      });

      const fullLength = cleanedExcerpts.reduce((sum: number, e: any) => sum + (e.content?.length || 0), 0);
      if (fullLength > previewContent.length) {
        previewContent += '…';
      }

      let colorScheme = null;
      if (commentary.Authors?.Colors) {
        try {
          colorScheme = JSON.parse(commentary.Authors.Colors);
        } catch (e) {}
      }

      return {
        id: commentary.Id,
        slug: commentary.Slug,
        source: commentary.Source,
        sourceUrl: commentary.SourceUrl,
        groupId: commentary.GroupId,
        previewContent,
        author: commentary.Authors
          ? {
              id: commentary.Authors.Id,
              name: commentary.Authors.Name,
              slug: commentary.Authors.Slug,
              image: commentary.Authors.Image,
              fullResImage: commentary.Authors.FullResImage,
              ...colorScheme,
            }
          : null,
        bibleVerseReference: commentary.BibleVerseReferences
          ? {
              id: commentary.BibleVerseReferences.Id,
              startVerse: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
                ? {
                    id: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.Id,
                    verseNumber:
                      commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
                        .VerseNumber,
                    bibleChapter: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
                      .BibleChapters
                      ? {
                          id: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
                            .BibleChapters.Id,
                          chapterNumber:
                            commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
                              .BibleChapters.ChapterNumber,
                          bibleBook: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses
                            .BibleChapters.BibleBooks
                            ? {
                                id: commentary.BibleVerseReferences
                                  .BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.BibleChapters.BibleBooks.Id,
                                name: commentary.BibleVerseReferences
                                  .BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.BibleChapters.BibleBooks.Name,
                                slug: commentary.BibleVerseReferences
                                  .BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses.BibleChapters.BibleBooks.Slug,
                              }
                            : null,
                        }
                      : null,
                  }
                : null,
              endVerse: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses
                ? {
                    id: commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses.Id,
                    verseNumber:
                      commentary.BibleVerseReferences.BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses.VerseNumber,
                  }
                : null,
            }
          : null,
        excerpts: cleanedExcerpts,
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/authors/commentaries/verse:', error);
    console.error('Error in GET /api/authors/commentaries/verse:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
