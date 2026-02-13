import { Metadata } from 'next';
import CommentatorsPage from '@/components/commentators/CommentatorsPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { fetchAuthors } from '@/lib/server/fetchAuthors';
import { AuthorFromAPI } from '@/types/author';

const canonical = buildCanonical(env.site, ['commentators']);

// Next.js requires config fields to be literal values (no expressions)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Commentators | Scripture Spot',
  description: 'Browse Bible commentators and explore their works.',
  keywords: ['Bible commentators', 'Commentary', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Commentators | Scripture Spot',
    description: 'Browse Bible commentators and explore their works.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Commentators`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Commentators | Scripture Spot',
    description: 'Browse Bible commentators and explore their works.',
    images: [`${env.site}/api/og?title=Commentators`],
  },
};

export default async function Page() {
  let authors: AuthorFromAPI[] = [];
  let fetchError: string | null = null;

  try {
    authors = await fetchAuthors();
  } catch (error) {
    fetchError = error instanceof Error ? error.message : 'Unable to load commentators.';
  }

  return <CommentatorsPage authors={authors} fetchError={fetchError} />;
}
