import { Metadata } from 'next';
import DoctrinesPage from '@/components/doctrines/DoctrinesPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['doctrines']);

export const metadata: Metadata = {
  title: 'Doctrines | Scripture Spot',
  description: 'Discover biblical doctrines and theological teachings.',
  keywords: ['Bible doctrine', 'Theology', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Doctrines | Scripture Spot',
    description: 'Discover biblical doctrines and theological teachings.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Doctrines`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Doctrines | Scripture Spot',
    description: 'Discover biblical doctrines and theological teachings.',
    images: [`${env.site}/api/og?title=Doctrines`],
  },
};

export default function Page() {
  return <DoctrinesPage />
}
