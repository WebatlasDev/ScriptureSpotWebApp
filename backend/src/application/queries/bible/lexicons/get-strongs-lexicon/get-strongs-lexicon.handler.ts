import { IRequestHandler } from '@/lib/mediator';
import { GetStrongsLexiconQuery } from './get-strongs-lexicon.query';
import { StrongsLexiconModel } from '@/application/models/bible-models';
import { prisma } from '@/lib/prisma';

export class GetStrongsLexiconQueryHandler
  implements IRequestHandler<GetStrongsLexiconQuery, StrongsLexiconModel | null>
{
  async handle(
    request: GetStrongsLexiconQuery,
    signal?: AbortSignal
  ): Promise<StrongsLexiconModel | null> {
    const lexicon = await prisma.strongsLexicons.findFirst({
      where: {
        StrongsKey: request.strongsKey,
      },
    });

    if (!lexicon) {
      return null;
    }

    return {
      id: lexicon.Id ?? undefined,
      strongsKey: lexicon.StrongsKey ?? undefined,
      originalWord: lexicon.OriginalWord ?? undefined,
      transliteration: lexicon.Transliteration ?? undefined,
      pronunciation: lexicon.Pronunciation ?? undefined,
      strongsDef: lexicon.StrongsDef ?? undefined,
      shortDefinition: lexicon.ShortDefinition ?? undefined,
      wordOrigin: lexicon.WordOrigin ?? undefined,
    } as StrongsLexiconModel;
  }
}
