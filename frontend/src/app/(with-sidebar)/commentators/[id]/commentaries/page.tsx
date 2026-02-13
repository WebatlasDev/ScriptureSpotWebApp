import { Metadata } from 'next';
import AuthorCommentariesPage from '@/components/commentators/AuthorCommentariesPage';
import agent from '@/app/api/agent';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { dehydrate } from '@tanstack/react-query';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';
import { ALL_BIBLE_BOOK_SLUGS } from '@/data/bibleBooks';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { id } = await params;
  const authors = await agent.Authors.listAuthors({});
  const author = authors?.find((a: any) => a.slug === id);
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', id, 'commentaries']);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(author?.name || 'Commentaries')}`;
  const pageTitle = `${author?.name || 'Author'} Commentaries | Scripture Spot`;
  const description = author
    ? `Explore commentaries by ${author.name} across different books of the Bible.`
    : 'Select a book to read commentaries from this author.';

  return {
    title: pageTitle,
    description,
    keywords: [author?.name || 'Commentaries', 'Scripture Spot'],
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
  const { id } = await params;
  const queryClient = createServerQueryClient();

  await queryClient.prefetchQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const result = await agent.Authors.listAuthors({});
      return result || [];
    },
  });

  if (id) {
    await queryClient.prefetchQuery({
      queryKey: ['bookCommentaryAvailability', id, ALL_BIBLE_BOOK_SLUGS],
      queryFn: async () =>
        agent.Authors.listCommentariesAvailability({
          AuthorSlug: id,
          BookSlugs: [...ALL_BIBLE_BOOK_SLUGS],
        }),
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <AuthorCommentariesPage />
    </ReactQueryHydrate>
  );
}
