import { Metadata } from 'next';
import VerseTakeawaysVersePage from '@/components/commentators/VerseTakeawaysVersePage';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { bookId, chapter, verseRange } = await params;
  const bookName = slugToBookName(bookId);
  const formattedReference = `${bookName} ${chapter}:${verseRange}`;
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', 'verse-takeaways', 'commentaries', bookId, chapter, verseRange]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(formattedReference)}&subtitle=Verse%20Takeaways`;
  const pageTitle = `${formattedReference} Verse Takeaways & Meaning | Scripture Spot`;
  const description = `Discover what ${formattedReference} means. Read verse takeaways and insights from trusted Bible commentaries for deeper understanding and study.`;

  const keywords = [
    `what does ${formattedReference} mean`,
    `${formattedReference} explained`,
    `${formattedReference} commentary`,
    'Bible verse meaning',
    'Scripture Spot',
  ];

  return {
    title: pageTitle,
    description,
    keywords: keywords,
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: 'Scripture Spot',
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

function parseVerseRange(range: string) {
  const [start, end] = range.split('-').map(Number);
  if (!end || Number.isNaN(end)) {
    return [Number.isNaN(start) ? 1 : start];
  }
  const verses: number[] = [];
  for (let i = start; i <= end; i += 1) {
    verses.push(i);
  }
  return verses;
}

export default async function Page({ params }: any) {
  const { bookId, chapter, verseRange } = await params;
  const chapterNumber = Number(chapter);
  const verseNumbers = parseVerseRange(verseRange);
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['bibleBooks'],
    queryFn: async () => agent.Bible.listBibleBooks({}),
  });

  await Promise.all(
    verseNumbers.map((verseNumber) =>
      Promise.all([
        queryClient.prefetchQuery({
          queryKey: ['bibleVerseTakeaways', bookId, chapterNumber, verseNumber],
          queryFn: async () => {
            const result = await agent.Bible.getBibleVerseTakeaways({
              BookSlug: bookId,
              ChapterNumber: chapterNumber,
              VerseNumber: verseNumber,
            });
            return result || [];
          },
        }),
        queryClient.prefetchQuery({
          queryKey: ['bibleVerseVersion', bookId, chapterNumber, verseNumber, 'ASV'],
          queryFn: async () => {
            const result = await agent.Bible.getBibleVerseVersion({
              BookSlug: bookId,
              ChapterNumber: chapterNumber,
              VerseNumber: verseNumber,
              VersionName: 'ASV',
            });
            return result || null;
          },
        }),
        queryClient.prefetchQuery({
          queryKey: ['authorCommentaries', bookId, chapterNumber, verseNumber, undefined],
          queryFn: async () => {
            const result = await agent.Authors.listCommentariesByVerse({
              BookSlug: bookId,
              ChapterNumber: chapterNumber,
              VerseNumber: verseNumber,
              RequestType: 'Combined',
            });
            return result || [];
          },
        }),
      ])
    )
  );

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <VerseTakeawaysVersePage />
    </ReactQueryHydrate>
  );
}