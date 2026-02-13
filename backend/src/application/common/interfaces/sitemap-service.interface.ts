export interface ISitemapService {
  generateSitemapXml(identifier: string, signal?: AbortSignal): Promise<string>;
  generateSitemapIndexXml(signal?: AbortSignal): Promise<string>;
}
