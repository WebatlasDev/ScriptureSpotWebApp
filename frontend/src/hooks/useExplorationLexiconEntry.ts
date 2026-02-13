import agent from "@/app/api/agent";
import { useApiQuery } from "./useApiQuery";

interface UseExplorationLexiconEntryOptions {
  enabled?: boolean;
}

export function useExplorationLexiconEntry(strongsKey: string, options?: UseExplorationLexiconEntryOptions) {
  const isEnabled = options?.enabled ?? !!strongsKey;

  return useApiQuery(
    ['explorationLexiconEntry', strongsKey],
    async () => {
      const result = await agent.Exploration.getLexiconEntry({ StrongsKey: strongsKey });
      return result || [];
    },
    { enabled: !!strongsKey && isEnabled, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true }
  );
}
