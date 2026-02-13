'use client';

import agent from '@/app/api/agent';
import { useApiQuery } from './useApiQuery';

export function useBibleVersions() {
  return useApiQuery(
    ['bible-versions'],
    async () => {
      const result = await agent.Bible.listBibleVersions({});
      return result;
    },
    { staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true }
  );
}
