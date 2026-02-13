import { Metadata } from 'next';
import { Box } from '@mui/material';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import HomepageContent from '@/components/homepage/HomepageContent';

const canonical = buildCanonical(env.site);

// Next.js requires config fields to be literal values (no expressions)
export const revalidate = 86400;

export const metadata: Metadata = {
  title: 'Scripture Spot | Immerse Yourself in Scripture',
  description:
    'Your personal Scripture Spot dashboard offers verse of the day, powerful search tools, and personalized content to help you deepen your Bible study.',
  keywords: ['Scripture Spot', 'Bible Study', 'Verse Finder', 'Commentary', 'Devotional'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Scripture Spot | Immerse Yourself in Scripture',
    description:
      'Your personal Scripture Spot dashboard offers verse of the day, powerful search tools, and personalized content to help you deepen your Bible study.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Scripture%20Spot%20Homepage`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Scripture Spot | Immerse Yourself in Scripture',
    description:
      'Your personal Scripture Spot dashboard offers verse of the day, powerful search tools, and personalized content to help you deepen your Bible study.',
    images: [`${env.site}/api/og?title=Scripture%20Spot%20Homepage`],
  },
};

export default function HomepagePage() {
  return (
    <>
      <Box component="h1" sx={{ position: 'absolute', left: '-10000px', top: 'auto', width: '1px', height: '1px', overflow: 'hidden' }}>
        Scripture Spot Bible Study Home
      </Box>
      <HomepageContent />
    </>
  );
}
