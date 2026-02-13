import { Metadata } from 'next';
import BookmarksPage from '@/components/bookmarks/BookmarksPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['bookmarks']);

export const metadata: Metadata = {
  title: 'Bookmarks | Scripture Spot',
  description: 'Your saved passages and notes will appear here soon.',
  keywords: ['Bookmarks', 'Saved Verses', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Bookmarks | Scripture Spot',
    description: 'Your saved passages and notes will appear here soon.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Bookmarks`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bookmarks | Scripture Spot',
    description: 'Your saved passages and notes will appear here soon.',
    images: [`${env.site}/api/og?title=Bookmarks`],
  },
};

export default function Page() {
  return <BookmarksPage />
}
