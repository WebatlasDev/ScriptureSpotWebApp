'use client';

import { useApiQuery } from './useApiQuery';
import agent from '@/app/api/agent';

export function useVerseOfTheDay(version: string) {
  return useApiQuery(
    ['bibleVerseOfTheDayVersion', version],
    async () => {
      const result = await agent.VerseOfTheDay.getVerse({ Version: version });
      return result || [];
    },
    { enabled: !!version, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true }
  );
}
