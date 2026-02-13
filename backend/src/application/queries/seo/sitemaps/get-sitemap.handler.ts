import { IRequestHandler } from '@/lib/mediator';
import { GetSitemapQuery } from './get-sitemap.query';
import { ISitemapService } from '@/application/common/interfaces/sitemap-service.interface';

/**
 * Handler for GetSitemapQuery
 * Generates a sitemap XML file for a specific identifier (book, author, etc.)
 */
export class GetSitemapQueryHandler implements IRequestHandler<GetSitemapQuery, string> {
  constructor(private readonly sitemapService: ISitemapService) {}

  async handle(request: GetSitemapQuery): Promise<string> {
    return await this.sitemapService.generateSitemapXml(request.identifier || '');
  }
}
