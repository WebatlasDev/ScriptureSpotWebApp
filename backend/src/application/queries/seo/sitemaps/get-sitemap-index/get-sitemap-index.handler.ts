import { IRequestHandler } from '@/lib/mediator';
import { GetSitemapIndexQuery } from './get-sitemap-index.query';
import { ISitemapService } from '@/application/common/interfaces/sitemap-service.interface';

export class GetSitemapIndexQueryHandler
  implements IRequestHandler<GetSitemapIndexQuery, string>
{
  constructor(private sitemapService: ISitemapService) {}

  async handle(
    request: GetSitemapIndexQuery,
    signal?: AbortSignal
  ): Promise<string> {
    return await this.sitemapService.generateSitemapIndexXml(signal);
  }
}
