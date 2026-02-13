import agent from "@/app/api/agent";
import { useApiQuery } from "./useApiQuery";

export function useExplorationLexiconVerseReferences(strongsKey: string, version: string) {
  return useApiQuery(
    ['explorationLexiconVerseReferences', strongsKey, version],
    async () => {
      const result = await agent.Exploration.getLexiconVerseReference({ StrongsKey: strongsKey, Version: version });
      return result || [];
    },
    { enabled: !!strongsKey && !!version, staleTime: 1000 * 60 * 5, refetchOnWindowFocus: true}
  );
}