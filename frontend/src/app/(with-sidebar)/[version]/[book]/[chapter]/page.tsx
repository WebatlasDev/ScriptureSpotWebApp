import { Metadata } from 'next';
import BibleChapterPage from '@/components/bible/BibleChapterPage';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { notFound } from 'next/navigation';
import { isValidVersion } from '@/utils/versionValidator';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';
import { getVerseCount, getChaptersArray } from '@/data/bibleStructure';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { version, book, chapter } = await params;
  const bookName = slugToBookName(book);
  const versionName = version.toUpperCase();
  const formattedReference = `${bookName} ${chapter}`;
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, [env.defaultVersion, book, chapter]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(`${formattedReference} - ${versionName}`)}`;
  const pageTitle = `${formattedReference} | ${versionName} Bible | Scripture Spot`;
  const description = `Read ${formattedReference} from the ${versionName} Bible. Explore the full chapter with verse-by-verse text and commentary insights.`;

  return {
    title: pageTitle,
    description,
    keywords: [
      `${formattedReference}`,
      `${bookName}`,
      `${bookName} ${chapter}`,
      `${versionName} Bible`,
      'Bible chapter',
      'Scripture reading',
      'Scripture Spot'
    ],
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
  const { version, book, chapter } = await params;
  const valid = await isValidVersion(version);
  if (!valid) notFound();
  const chapterNumber = Number(chapter);
  const queryClient = createServerQueryClient();
  const versionShortName = String(version).toUpperCase();
  const staticVerseCount = getVerseCount(book, chapterNumber);
  const staticVerseRange = staticVerseCount > 1 ? `1-${staticVerseCount}` : staticVerseCount === 1 ? '1' : null;
  const staticChaptersList = getChaptersArray(book).map(chapterNum => ({ chapterNumber: chapterNum }));

  const prefetchPromises = [
    queryClient.prefetchQuery({
      queryKey: ['bibleVerses', book, chapterNumber],
      queryFn: async () => {
        const result = await agent.Bible.listBibleVerses({ BookSlug: book, ChapterNumber: chapterNumber });
        return result || [];
      },
    }),
  ];

  if (staticVerseRange) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ['bibleVerseRange', book, chapterNumber, staticVerseRange, versionShortName],
        queryFn: async () => {
          const result = await agent.Bible.listBibleVerseRange({
            BookSlug: book,
            ChapterNumber: chapterNumber,
            VerseRange: staticVerseRange,
            VersionName: versionShortName,
          });
          return result || [];
        },
      })
    );
  }

  if (staticChaptersList.length === 0) {
    prefetchPromises.push(
      queryClient.prefetchQuery({
        queryKey: ['bibleChapters', book],
        queryFn: async () => {
          const result = await agent.Bible.listBibleChapters({ BookSlug: book });
          return result || [];
        },
      })
    );
  }

  await Promise.all(prefetchPromises);

  const verses = queryClient.getQueryData<any[]>(['bibleVerses', book, chapterNumber]) || [];
  const chapters = staticChaptersList.length
    ? staticChaptersList
    : queryClient.getQueryData<any[]>(['bibleChapters', book]) || [];
  const effectiveVerseCount = verses.length || staticVerseCount;
  const hydratedVerseRange = effectiveVerseCount > 1 ? `1-${effectiveVerseCount}` : effectiveVerseCount === 1 ? '1' : null;
  let verseRangeData: any = hydratedVerseRange
    ? queryClient.getQueryData<any>(['bibleVerseRange', book, chapterNumber, hydratedVerseRange, versionShortName]) || null
    : null;

  if (!verseRangeData && hydratedVerseRange) {
    await queryClient.prefetchQuery({
      queryKey: ['bibleVerseRange', book, chapterNumber, hydratedVerseRange, versionShortName],
      queryFn: async () => {
        const result = await agent.Bible.listBibleVerseRange({
          BookSlug: book,
          ChapterNumber: chapterNumber,
          VerseRange: hydratedVerseRange,
          VersionName: versionShortName,
        });
        return result || [];
      },
    });
    verseRangeData = queryClient.getQueryData<any>([
      'bibleVerseRange',
      book,
      chapterNumber,
      hydratedVerseRange,
      versionShortName,
    ]) || null;
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <BibleChapterPage
        initialVerses={verses}
        initialChapters={chapters}
        initialVerseRange={verseRangeData}
      />
    </ReactQueryHydrate>
  );
}
