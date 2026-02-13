import { IRequestHandler } from '@/lib/mediator';
import { GetSitemapIndexQuery } from './get-sitemap-index.query';
import { ISitemapService } from '@/application/common/interfaces/sitemap-service.interface';

/**
 * Handler for GetSitemapIndexQuery
 * Generates the sitemap index XML listing all sitemap files
 */
export class GetSitemapIndexQueryHandler implements IRequestHandler<GetSitemapIndexQuery, string> {
  constructor(private readonly sitemapService: ISitemapService) {}

  async handle(request: GetSitemapIndexQuery): Promise<string> {
    return await this.sitemapService.generateSitemapIndexXml();
  }
}
