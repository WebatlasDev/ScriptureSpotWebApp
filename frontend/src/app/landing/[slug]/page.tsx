import { Metadata } from 'next'
import LandingPageView from '@/components/landing-pages/LandingPageView'
import agent from '@/app/api/agent'
import { env } from '@/types/env'
import { buildCanonical } from '@/utils/urlHelpers'

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { slug } = await params;
  try {
    const page = await agent.LandingPages.getLandingPage({ slug })
    const canonical = buildCanonical(env.site, ['landing-pages', slug])
    return {
      title: page?.header || 'Landing Page',
      description: page?.metaDescription || undefined,
      keywords: page?.metaKeywords ? page.metaKeywords.split(',') : undefined,
      alternates: { canonical }
    }
  } catch {
    return {}
  }
}

export default function Page() {
  return <LandingPageView />
}
