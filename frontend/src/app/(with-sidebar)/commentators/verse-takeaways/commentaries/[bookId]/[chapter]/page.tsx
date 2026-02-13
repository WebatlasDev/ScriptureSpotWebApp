import { Metadata } from 'next';
import VerseTakeawaysChapterPage from '@/components/commentators/VerseTakeawaysChapterPage';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { bookId, chapter } = await params;
  const bookName = slugToBookName(bookId);
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', 'verse-takeaways', 'commentaries', bookId, chapter]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(bookName + ' ' + chapter)}&subtitle=Verse%20Takeaways`;
  const pageTitle = `${bookName} ${chapter} Verse Takeaways | Scripture Spot`;
  const description = `Explore ${bookName} chapter ${chapter} with verse-by-verse insights, summarized commentary, and key takeaways to help you study and reflect.`;

  const keywords = [
    `${bookName} chapter ${chapter} meaning`,
    `${bookName} chapter ${chapter} explained`,
    'Bible chapter summary',
    'Verse commentary',
    'Scripture Spot',
  ];

  return {
    title: pageTitle,
    description,
    keywords: keywords,
    alternates: { canonical },
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

export default async function Page({ params }: any) {
  const { bookId, chapter } = await params;
  const chapterNumber = Number(chapter);
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['bibleBooks'],
      queryFn: async () => agent.Bible.listBibleBooks({})
    }),
    queryClient.prefetchQuery({
      queryKey: ['bibleChapters', bookId],
      queryFn: async () => {
        const result = await agent.Bible.listBibleChapters({ BookSlug: bookId });
        return result || [];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['bibleVerses', bookId, chapterNumber],
      queryFn: async () => {
        const result = await agent.Bible.listBibleVerses({ BookSlug: bookId, ChapterNumber: chapterNumber });
        return result || [];
      },
    }),
  ]);

  const books = queryClient.getQueryData<any[]>(['bibleBooks']) || [];
  const chapters = queryClient.getQueryData<any[]>(['bibleChapters', bookId]) || [];
  const verses = queryClient.getQueryData<any[]>(['bibleVerses', bookId, chapterNumber]) || [];

  await Promise.all(
    verses.map((verse: any) => {
      const verseNumber = verse?.verseNumber;
      if (!verseNumber) {
        return Promise.resolve();
      }

      return Promise.all([
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
            return result || [];
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
              PreviewCount: 150,
            });
            return result || [];
          },
        }),
      ]);
    })
  );

  const verseTakeawaysMap: Record<number, any> = {};
  const verseVersionsMap: Record<number, any> = {};
  const verseCommentariesMap: Record<number, any> = {};

  verses.forEach((verse: any) => {
    const verseNumber = verse?.verseNumber;
    if (!verseNumber) {
      return;
    }

    verseTakeawaysMap[verseNumber] =
      queryClient.getQueryData(['bibleVerseTakeaways', bookId, chapterNumber, verseNumber]) || null;
    verseVersionsMap[verseNumber] =
      queryClient.getQueryData(['bibleVerseVersion', bookId, chapterNumber, verseNumber, 'ASV']) || null;
    verseCommentariesMap[verseNumber] =
      queryClient.getQueryData(['authorCommentaries', bookId, chapterNumber, verseNumber, undefined]) || null;
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <VerseTakeawaysChapterPage
        initialBooks={books}
        initialChapters={chapters}
        initialVerses={verses}
        initialVerseTakeaways={verseTakeawaysMap}
        initialVerseVersions={verseVersionsMap}
        initialVerseCommentaries={verseCommentariesMap}
      />
    </ReactQueryHydrate>
  );
}
