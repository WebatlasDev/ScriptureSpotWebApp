import { Metadata } from 'next';
import BibleChaptersPage from '@/components/bible/BibleChaptersPage';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { notFound } from 'next/navigation';
import { isValidVersion } from '@/utils/versionValidator';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { version, book } = await params;
  const bookName = slugToBookName(book);
  const versionName = version.toUpperCase();
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, [env.defaultVersion, book]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(`${bookName} - ${versionName}`)}`;
  const pageTitle = `${bookName} Chapters | ${versionName} Bible | Scripture Spot`;
  const description = `Browse all chapters of ${bookName} in the ${versionName} Bible. Select a chapter to read the full text with verse-by-verse commentary.`;

  return {
    title: pageTitle,
    description,
    keywords: [
      `${bookName}`,
      `${bookName} chapters`,
      `${versionName} Bible`,
      `${bookName} ${versionName}`,
      'Bible chapters',
      'Scripture Spot'
    ],
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: 'Scripture Spot',
      type: 'website',
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
  const { version, book } = await params;
  const valid = await isValidVersion(version);
  if (!valid) notFound();
  const queryClient = createServerQueryClient();
  await queryClient.prefetchQuery({
    queryKey: ['bibleChapters', book],
    queryFn: async () => {
      const result = await agent.Bible.listBibleChapters({ BookSlug: book });
      return result || [];
    },
  });

  const chapters = queryClient.getQueryData<any[]>(['bibleChapters', book]) || [];
  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <BibleChaptersPage initialChapters={chapters} />
    </ReactQueryHydrate>
  );
}
