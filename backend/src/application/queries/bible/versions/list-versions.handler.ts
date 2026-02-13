import { prisma } from '@/lib/prisma';
import { BibleVersionModel } from '@/application/models/bible-models/bible-version.model';
import { ListVersionsQuery, ListVersionsQueryResponse } from './list-versions.query';

/**
 * Handler for retrieving all Bible versions
 */
export class ListVersionsQueryHandler {
  async handle(query: ListVersionsQuery): Promise<ListVersionsQueryResponse> {
    const versions = await prisma.bibleVersions.findMany({
      orderBy: {
        Name: 'asc'
      }
    });

    return versions.map(version => ({
      id: version.Id,
      name: version.Name ?? undefined,
      abbreviation: version.Abbreviation ?? undefined,
      language: version.Language ?? undefined,
      description: version.Description ?? undefined
    }));
  }
}
