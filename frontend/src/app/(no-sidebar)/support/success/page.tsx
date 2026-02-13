import { Metadata } from 'next';
import DonateSuccessPage from '@/components/donate/DonateSuccessPage';
import React, { Suspense } from 'react';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['support', 'success']);

export const metadata: Metadata = {
  title: 'Thank You for Supporting Scripture Spot',
  description: 'Your donation helps us build more Bible study resources.',
  keywords: ['Donate', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Thank You for Supporting Scripture Spot',
    description: 'Your donation helps us build more Bible study resources.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Thank%20You`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Thank You for Supporting Scripture Spot',
    description: 'Your donation helps us build more Bible study resources.',
    images: [`${env.site}/api/og?title=Thank%20You`],
  },
};

export default function Page() {
  return (
    <Suspense fallback={<div style={{ color: 'white', textAlign: 'center', padding: '2rem' }}>Loading...</div>}>
      <DonateSuccessPage />
    </Suspense>
  );
}
