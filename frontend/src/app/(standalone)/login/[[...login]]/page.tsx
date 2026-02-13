import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import LoginPage from '@/components/user/LoginPage';

const canonical = buildCanonical(env.site, ['login']);

export const metadata: Metadata = {
  title: 'Sign In | Scripture Spot',
  description: 'Access your Scripture Spot account.',
  keywords: ['Sign in', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Sign In | Scripture Spot',
    description: 'Access your Scripture Spot account.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Sign%20In`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign In | Scripture Spot',
    description: 'Access your Scripture Spot account.',
    images: [`${env.site}/api/og?title=Sign%20In`],
  },
};

export default function Page() {
  return <LoginPage />;
}
