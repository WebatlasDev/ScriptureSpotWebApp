import { IRequestHandler } from '@/lib/mediator';
import { GetSitemapQuery } from './get-sitemap.query';
import { ISitemapService } from '@/application/common/interfaces/sitemap-service.interface';

export class GetSitemapQueryHandler
  implements IRequestHandler<GetSitemapQuery, string>
{
  constructor(private sitemapService: ISitemapService) {}

  async handle(
    request: GetSitemapQuery,
    signal?: AbortSignal
  ): Promise<string> {
    return await this.sitemapService.generateSitemapXml(
      request.identifier,
      signal
    );
  }
}
