import { IRequestHandler } from '@/lib/mediator';
import { GetStrongsLexiconQuery } from './get-strongs-lexicon.query';
import { StrongsLexiconModel } from '@/application/models';
import { prisma } from '@/lib/prisma';

/**
 * Handler for GetStrongsLexiconQuery
 * Retrieves a Strong's concordance lexicon entry by key
 */
export class GetStrongsLexiconQueryHandler
  implements IRequestHandler<GetStrongsLexiconQuery, StrongsLexiconModel | null>
{
  async handle(request: GetStrongsLexiconQuery): Promise<StrongsLexiconModel | null> {
    const lexicon = await prisma.strongsLexicons.findFirst({
      where: {
        StrongsKey: request.strongsKey || undefined,
      },
    });

    if (!lexicon) {
      return null;
    }

    return {
      id: lexicon.Id ?? undefined,
      strongsKey: lexicon.StrongsKey ?? undefined,
      shortDefinition: lexicon.ShortDefinition ?? undefined,
      originalWord: lexicon.OriginalWord ?? undefined,
      partOfSpeech: lexicon.PartOfSpeech ?? undefined,
      transliteration: lexicon.Transliteration ?? undefined,
      pronunciation: lexicon.Pronunciation ?? undefined,
      phoneticSpelling: lexicon.PhoneticSpelling ?? undefined,
      kjvTranslation: lexicon.KjvTranslation ?? undefined,
      nasbTranslation: lexicon.NasbTranslation ?? undefined,
      wordOrigin: lexicon.WordOrigin ?? undefined,
      strongsDef: lexicon.StrongsDef ?? undefined,
      bdbDef: lexicon.BdbDef ?? undefined,
      frequency: lexicon.Frequency ?? undefined,
      language: lexicon.Language ?? undefined,
    };
  }
}
