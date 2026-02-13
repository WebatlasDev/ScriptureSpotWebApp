import { IRequestHandler } from '@/lib/mediator';
import { GetLandingPageQuery } from './get-landing-page.query';
import { LandingPageModel } from '@/application/models/page-models';
import { prisma } from '@/lib/prisma';

export class GetLandingPageQueryHandler
  implements IRequestHandler<GetLandingPageQuery, LandingPageModel | null>
{
  async handle(
    request: GetLandingPageQuery,
    signal?: AbortSignal
  ): Promise<LandingPageModel | null> {
    const page = await prisma.landingPages.findFirst({
      where: {
        OR: [{ Slug: request.slug }, { ReferenceSlug: request.slug }],
      },
      include: {
        LandingPageComponents: {
          orderBy: { Order: 'asc' },
        },
      },
    });

    if (!page) {
      return null;
    }

    return {
      id: page.Id ?? undefined,
      slug: page.Slug ?? undefined,
      referenceSlug: page.ReferenceSlug ?? undefined,
      header: page.Header ?? undefined,
      subheader: page.Subheader ?? undefined,
      metaKeywords: page.MetaKeywords ?? undefined,
      metaDescription: page.MetaDescription ?? undefined,
      components: page.LandingPageComponents?.map((component) => ({
        id: component.Id ?? undefined,
        landingPageId: component.LandingPageId ?? undefined,
        componentType: component.ComponentType ?? undefined,
        entityId: component.EntityId ?? undefined,
        order: component.Order ?? undefined,
        allowRandomOrder: component.AllowRandomOrder ?? undefined,
        data: undefined,
      })) ?? [],
    } as LandingPageModel;
  }
}
