import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { redirect } from 'next/navigation';

const canonical = buildCanonical(env.site, ['commentators', 'verse-takeaways', 'commentaries']);

export const metadata: Metadata = {
  title: 'Explore Bible Verse Takeaways by Book | Scripture Spot',
  description:
    'Study the Bible verse by verse. Scripture Spot offers clear takeaways from trusted commentaries to help you understand the meaning and context of each verse.',
  keywords: [
    'Bible study',
    'Bible verse meaning',
    'Verse by verse commentary',
    'Scripture insights',
    'Bible books explained',
    'Christian study tools',
    'Bible verse summaries',
    'Verse takeaways',
    'Scripture Spot'
  ],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Explore Bible Verse Takeaways by Book | Scripture Spot',
    description:
      'Get verse takeaways from reliable Bible commentaries. Browse books of the Bible to better understand God’s Word.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Bible%20Verse%20Takeaways`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Bible Verse Takeaways by Book | Scripture Spot',
    description:
      'Browse books of the Bible for clear takeaways and commentary insights. A helpful resource for Bible study and learning.',
    images: [`${env.site}/api/og?title=Bible%20Verse%20Takeaways`],
  },
};

export default function VerseTakeawaysPage() {
  // Redirect to commentaries page since this is the entry point
  redirect('/commentators/verse-takeaways/commentaries');
}