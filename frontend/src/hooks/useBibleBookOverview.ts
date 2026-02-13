'use client';

import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

export function useBibleBookOverview(slug: string) {
  return useApiQuery(
    ['bibleBookOverview', slug],
    async () => {
      const result = await agent.Bible.getBibleBookOverview({ slug });
      return result;
    },
    { enabled: !!slug, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true  }
  );
}
