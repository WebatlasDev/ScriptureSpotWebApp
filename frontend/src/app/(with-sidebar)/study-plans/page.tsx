import { Metadata } from 'next';
import StudyPlansPage from '@/components/study-plans/StudyPlansPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['study-plans']);

export const metadata: Metadata = {
  title: 'Study Plans | Scripture Spot',
  description: 'Bible reading plans and studies coming soon.',
  keywords: ['Bible reading plans', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Study Plans | Scripture Spot',
    description: 'Bible reading plans and studies coming soon.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Study%20Plans`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Study Plans | Scripture Spot',
    description: 'Bible reading plans and studies coming soon.',
    images: [`${env.site}/api/og?title=Study%20Plans`],
  },
};

export default function Page() {
  return <StudyPlansPage />
}
