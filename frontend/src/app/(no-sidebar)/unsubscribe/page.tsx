import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import UnsubscribePage from '@/components/unsubscribe/UnsubscribePage';

const canonical = buildCanonical(env.site, ['unsubscribe']);

export const metadata: Metadata = {
  title: 'Unsubscribe | Scripture Spot',
  description: 'Remove your email from our list.',
  keywords: ['Unsubscribe', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Unsubscribe | Scripture Spot',
    description: 'Remove your email from our list.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Unsubscribe`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Unsubscribe | Scripture Spot',
    description: 'Remove your email from our list.',
    images: [`${env.site}/api/og?title=Unsubscribe`],
  },
};

export default function Page() {
  return <UnsubscribePage />;
}
