export interface IElasticSearchService {
  search(
    query: string,
    page: number,
    limit: number,
    signal?: AbortSignal
  ): Promise<any[]>;
}
