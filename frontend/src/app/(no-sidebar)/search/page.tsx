export const dynamic = 'force-dynamic';

import { Metadata } from 'next';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import SearchPage from '@/components/search/SearchPage';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

const SEARCH_PAGE_SIZE = 500;

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Search Scripture | Scripture Spot',
    description: 'Search Scripture Spot to explore verses, commentaries, authors, and verse takeaways.',
  };
}

type SearchPageProps = {
  params?: Promise<Record<string, never>>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
};

export default async function Page({ searchParams }: SearchPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {};
  const query = typeof resolvedSearchParams.q === 'string' ? resolvedSearchParams.q : '';
  const queryClient = createServerQueryClient();

  if (query) {
    await queryClient.prefetchQuery({
      queryKey: ['searchQuery', query, 1, SEARCH_PAGE_SIZE],
      queryFn: async () => {
        const result = await agent.Search.listSearchResults({
          Query: query,
          Page: 1,
          PageSize: SEARCH_PAGE_SIZE,
        });
        return result || [];
      },
    });
  }

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <SearchPage />
    </ReactQueryHydrate>
  );
}
