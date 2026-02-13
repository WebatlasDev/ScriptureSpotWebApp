'use client'

import agent from '@/app/api/agent'
import { useApiQuery } from './useApiQuery'

export function useLandingPage(slug: string) {
  return useApiQuery(
    ['landingPage', slug],
    async () => {
      const result = await agent.LandingPages.getLandingPage({ slug })
      return result
    },
    { enabled: !!slug }
  )
}
