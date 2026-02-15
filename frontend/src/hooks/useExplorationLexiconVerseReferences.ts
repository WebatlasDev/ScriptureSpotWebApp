import agent from "@/app/api/agent";
import { useApiQuery } from "./useApiQuery";

interface PaginatedVerseReferences {
  results: Array<{
    book?: string;
    bookSlug?: string;
    chapter?: number;
    verse?: number;
    reference?: string;
    text?: string | null;
  }>;
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export function useExplorationLexiconVerseReferences(
  strongsKey: string, 
  version: string, 
  page: number = 1, 
  pageSize: number = 20
) {
  return useApiQuery<PaginatedVerseReferences>(
    ['explorationLexiconVerseReferences', strongsKey, version, page, pageSize],
    async () => {
      const result = await agent.Exploration.getLexiconVerseReference({ 
        StrongsKey: strongsKey, 
        Version: version,
        Page: page,
        PageSize: pageSize,
      });
      return result || { results: [], totalCount: 0, page: 1, pageSize: 20, totalPages: 0 };
    },
    { enabled: !!strongsKey && !!version, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true}
  );
}