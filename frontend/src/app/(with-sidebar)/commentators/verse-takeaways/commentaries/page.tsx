import { Metadata } from 'next';
import VerseTakeawaysCommentariesPage from '@/components/commentators/VerseTakeawaysCommentariesPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['commentators', 'verse-takeaways', 'commentaries']);

export const metadata: Metadata = {
  title: 'Verse Takeaways - Explore Every Bible Book | Scripture Spot',
  description:
    'Select a book of the Bible to explore verse takeaways compiled from multiple commentaries. Gain insights and context for each book before reading.',
  keywords: ['Verse Takeaways', 'Bible Books', 'Commentary', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Verse Takeaways - Explore Every Bible Book | Scripture Spot',
    description:
      'Select a book of the Bible to explore verse takeaways compiled from multiple commentaries. Gain insights and context for each book before reading.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Verse%20Takeaways%20-%20Books`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Verse Takeaways - Explore Every Bible Book | Scripture Spot',
    description:
      'Select a book of the Bible to explore verse takeaways compiled from multiple commentaries. Gain insights and context for each book before reading.',
    images: [`${env.site}/api/og?title=Verse%20Takeaways%20-%20Books`],
  },
};

export default function Page() {
  return <VerseTakeawaysCommentariesPage />;
}