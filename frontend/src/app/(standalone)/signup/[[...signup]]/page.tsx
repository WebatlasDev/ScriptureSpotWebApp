import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import SignupPage from '@/components/user/SignupPage';

const canonical = buildCanonical(env.site, ['signup']);

export const metadata: Metadata = {
  title: 'Create Account | Scripture Spot',
  description: 'Sign up for a Scripture Spot account.',
  keywords: ['Sign up', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Create Account | Scripture Spot',
    description: 'Sign up for a Scripture Spot account.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Create%20Account`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create Account | Scripture Spot',
    description: 'Sign up for a Scripture Spot account.',
    images: [`${env.site}/api/og?title=Create%20Account`],
  },
};

export default function Page() {
  return <SignupPage />;
}
