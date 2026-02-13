import { IRequestHandler } from '@/lib/mediator';
import { ListVersionsQuery } from './list-versions.query';
import { BibleVersionModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class ListVersionsQueryHandler
  implements IRequestHandler<ListVersionsQuery, BibleVersionModel[]>
{
  async handle(
    request: ListVersionsQuery,
    signal?: AbortSignal
  ): Promise<BibleVersionModel[]> {
    const versions = await prisma.bibleVersions.findMany({
      orderBy: { Name: 'asc' },
    });

    return versions.map(
      (version) =>
        ({
          id: version.Id,
          name: version.Name,
          abbreviation: version.Abbreviation,
          language: version.Language,
          year: version.PublishYear,
        } as BibleVersionModel)
    );
  }
}
