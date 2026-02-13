import { Metadata } from 'next';
import TranslationsPage from '@/components/bible/TranslationsPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['translations']);

export const metadata: Metadata = {
  title: 'Bible Translations | Scripture Spot',
  description: 'Explore different Bible translations and versions available on Scripture Spot.',
  keywords: ['Bible translations', 'Bible versions', 'ASV', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Bible Translations | Scripture Spot',
    description: 'Explore different Bible translations and versions available on Scripture Spot.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Bible Translations`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bible Translations | Scripture Spot',
    description: 'Explore different Bible translations and versions available on Scripture Spot.',
    images: [`${env.site}/api/og?title=Bible Translations`],
  },
};

export default function Page() {
  return <TranslationsPage />
}