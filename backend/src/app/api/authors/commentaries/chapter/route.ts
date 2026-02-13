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
    const authorSlug = searchParams.get('AuthorSlug') || searchParams.get('authorSlug');
    const bookSlug = searchParams.get('BookSlug') || searchParams.get('bookSlug');
    const chapterNumber = searchParams.get('ChapterNumber') || searchParams.get('chapterNumber');
    const requestType = (searchParams.get('RequestType') || searchParams.get('requestType') || 'Combined') as CommentaryExcerptRequestType;
    const versionAbbreviation = searchParams.get('VersionAbbreviation') || searchParams.get('versionAbbreviation');

    if (!bookSlug || !chapterNumber) {
      return NextResponse.json(
        { error: 'bookSlug and chapterNumber are required' },
        { status: 400 }
      );
    }

    const chapterNum = parseInt(chapterNumber);

    const where: any = {
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
    };

    if (authorSlug) {
      where.Authors = { Slug: authorSlug };
    }

    const commentaries = await prisma.commentaries.findMany({
      where,
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
            BibleVerses_BibleVerseReferences_EndVerseIdToBibleVerses: true,
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

    const groups = new Map<string, any>();
    const colorCache = new Map<string, any>();

    for (const commentary of commentaries) {
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

      const cleanedExcerpts = excerpts.map((excerpt: any) => ({
        id: excerpt.Id,
        commentaryId: excerpt.CommentaryId,
        order: excerpt.Order,
        content: (excerpt.Content || '')
          .replace(/\n/g, '')
          .replace(/```/g, '')
          .replace(/html/g, '')
          .replace(/\s{2,}/g, ' ')
          .trim(),
        type: excerpt.Type,
      }));

      let colorScheme = null;
      if (commentary.Authors?.Colors && !colorCache.has(commentary.Authors.Id)) {
        try {
          colorScheme = JSON.parse(commentary.Authors.Colors);
          colorCache.set(commentary.Authors.Id, colorScheme);
        } catch (e) {}
      } else if (commentary.Authors?.Id) {
        colorScheme = colorCache.get(commentary.Authors.Id);
      }

      const mapped = {
        id: commentary.Id,
        slug: commentary.Slug,
        source: commentary.Source,
        sourceUrl: commentary.SourceUrl,
        groupId: commentary.GroupId,
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

      const verseNumber =
        commentary.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.VerseNumber || 0;
      const verseRange =
        commentary.Slug?.split('/')?.[6] ||
        commentary.BibleVerseReferences?.BibleVerses_BibleVerseReferences_StartVerseIdToBibleVerses?.VerseNumber?.toString() ||
        '0';
      const groupId = commentary.GroupId || 'default';
      const key = `${groupId}-${verseRange}`;

      if (!groups.has(key)) {
        groups.set(key, {
          verseNumber,
          verseRange,
          groupId: commentary.GroupId,
          commentaries: [mapped],
          verses: [],
        });
      } else {
        groups.get(key).commentaries.push(mapped);
      }
    }

    let result = Array.from(groups.values()).sort((a, b) => {
      const groupCompare = (a.groupId || 'default').localeCompare(b.groupId || 'default');
      if (groupCompare !== 0) return groupCompare;
      return a.verseNumber - b.verseNumber;
    });

    const verseNumbers = new Set<number>();
    result.forEach((group) => {
      const numbers = parseVerseNumbers(group.verseRange, group.verseNumber);
      numbers.forEach((n) => verseNumbers.add(n));
    });

    const verseLookup = new Map<number, { content: string | null; version: string | null }>();

    if (verseNumbers.size > 0) {
      const verseArray = Array.from(verseNumbers);
      const verseVersions = await prisma.bibleVerseVersions.findMany({
        where: {
          BibleVerses: {
            VerseNumber: { in: verseArray },
            BibleChapters: {
              BibleBooks: {
                Slug: bookSlug,
              },
              ChapterNumber: chapterNum,
            },
          },
        },
        include: {
          BibleVerses: true,
          BibleVersions: true,
        },
      });

      const versionGrouped = new Map<number, typeof verseVersions>();
      verseVersions.forEach((v: any) => {
        const vn = v.BibleVerses?.VerseNumber;
        if (vn) {
          if (!versionGrouped.has(vn)) {
            versionGrouped.set(vn, []);
          }
          versionGrouped.get(vn)!.push(v);
        }
      });

      versionGrouped.forEach((versions, vn) => {
        let selected = versions[0];
        if (versionAbbreviation) {
          const preferred = versions.find(
            (v: any) => v.BibleVersions?.Abbreviation?.toLowerCase() === versionAbbreviation.toLowerCase()
          );
          if (preferred) selected = preferred;
        }
        verseLookup.set(vn, {
          content: selected.Content,
          version: selected.BibleVersions?.Abbreviation || selected.BibleVersions?.Name || null,
        });
      });
    }

    result.forEach((group) => {
      const numbers = parseVerseNumbers(group.verseRange, group.verseNumber);
      group.verses = numbers.map((n) => {
        const verseData = verseLookup.get(n);
        return {
          verseNumber: n,
          verse: verseData?.content || null,
          version: verseData?.version || null,
        };
      });
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error in GET /api/authors/commentaries/chapter:', error);
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

function parseVerseNumbers(verseRange: string | null | undefined, verseNumber: number): number[] {
  if (!verseRange) {
    return verseNumber > 0 ? [verseNumber] : [];
  }

  const result: number[] = [];
  const segments = verseRange.split(',');

  for (const segment of segments) {
    const trimmed = segment.trim();
    if (!trimmed) continue;

    if (trimmed.includes('-')) {
      const [startStr, endStr] = trimmed.split('-').map((s) => s.trim());
      const start = parseInt(startStr);
      const end = parseInt(endStr);
      if (!isNaN(start) && !isNaN(end)) {
        const [min, max] = start > end ? [end, start] : [start, end];
        for (let i = min; i <= max; i++) {
          result.push(i);
        }
      }
    } else {
      const num = parseInt(trimmed);
      if (!isNaN(num)) {
        result.push(num);
      }
    }
  }

  if (result.length === 0 && verseNumber > 0) {
    result.push(verseNumber);
  }

  return Array.from(new Set(result)).sort((a, b) => a - b);
}
