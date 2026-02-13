import { Metadata } from 'next';
import VerseTakeawaysChapterSelectPage from '@/components/commentators/VerseTakeawaysChapterSelectPage';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { bookId } = await params;
  const bookName = slugToBookName(bookId);
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', 'verse-takeaways', 'commentaries', bookId]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(bookName)}&subtitle=Verse%20Takeaways`;
  const pageTitle = `${bookName} Verse Takeaways & Commentary | Scripture Spot`;
  const description = `Understand the themes, structure, and major takeaways from the book of ${bookName}. Dive into commentary summaries and practical insights.`;
  
  const keywords = [
  `${bookName} Bible overview`,
  `${bookName} commentary summary`,
  `${bookName} meaning`,
  'Bible study tools',
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
  const { bookId } = await params;
  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['bibleBooks'],
      queryFn: async () => agent.Bible.listBibleBooks({}),
    }),
    queryClient.prefetchQuery({
      queryKey: ['bibleChapters', bookId],
      queryFn: async () => {
        const result = await agent.Bible.listBibleChapters({ BookSlug: bookId });
        return result || [];
      },
    }),
  ]);

  const books = queryClient.getQueryData<any[]>(['bibleBooks']) || [];
  const chapters = queryClient.getQueryData<any[]>(['bibleChapters', bookId]) || [];

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <VerseTakeawaysChapterSelectPage initialBooks={books} initialChapters={chapters} />
    </ReactQueryHydrate>
  );
}
