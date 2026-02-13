import { Metadata } from 'next';
import HymnsPage from '@/components/hymns/HymnsPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['hymns']);

export const metadata: Metadata = {
  title: 'Hymns | Scripture Spot',
  description: 'Browse hymns and worship songs to enrich your devotional life.',
  keywords: ['Hymns', 'Worship songs', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Hymns | Scripture Spot',
    description: 'Browse hymns and worship songs to enrich your devotional life.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Hymns`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hymns | Scripture Spot',
    description: 'Browse hymns and worship songs to enrich your devotional life.',
    images: [`${env.site}/api/og?title=Hymns`],
  },
};

export default function Page() {
  return <HymnsPage />
}
