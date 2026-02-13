import { cache } from 'react'
import { env } from '@/types/env'
import { AuthorFromAPI } from '@/types/author'
import { camelCaseKeys } from '@/utils/camelCaseKeys'

const endpoint = `${env.api}/Authors/Authors`

export const fetchAuthors = cache(async (): Promise<AuthorFromAPI[]> => {
  const response = await fetch(endpoint, {
    method: 'GET',
    cache: 'force-cache',
    next: { revalidate: 60 * 60 },
  })

  if (!response.ok) {
    throw new Error('Unable to load commentators right now.')
  }

  const raw = await response.json()
  return camelCaseKeys(raw) as AuthorFromAPI[]
})
