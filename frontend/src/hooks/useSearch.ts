import agent from "@/app/api/agent";
import { useApiQuery } from "./useApiQuery";

export function useSearch(query: string, page: number, pageSize: number) {
  return useApiQuery(
    ['searchQuery', query, page, pageSize],
    async () => {
      const result = await agent.Search.listSearchResults({ Query: query, Page: page, PageSize: pageSize });
      return result || [];
    },
    { enabled: !!query && !!page && !!pageSize, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true }
  );
}
