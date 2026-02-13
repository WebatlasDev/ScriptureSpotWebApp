import { Metadata } from 'next';
import DonatePage from '@/components/donate/DonatePage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['support']);

export const metadata: Metadata = {
  title: 'Support Scripture Spot | Donate',
  description:
    'Help expand Scripture Spot by becoming a monthly supporter or giving a one-time gift.',
  keywords: ['Donate', 'Support Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Support Scripture Spot | Donate',
    description:
      'Help expand Scripture Spot by becoming a monthly supporter or giving a one-time gift.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Support%20Scripture%20Spot`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Support Scripture Spot | Donate',
    description:
      'Help expand Scripture Spot by becoming a monthly supporter or giving a one-time gift.',
    images: [`${env.site}/api/og?title=Support%20Scripture%20Spot`],
  },
};

export default function Page() {
  return <DonatePage />;
}
