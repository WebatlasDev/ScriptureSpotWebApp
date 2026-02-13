import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import ForgotPasswordPage from '@/components/user/ForgotPasswordPage';

const canonical = buildCanonical(env.site, ['forgot-password']);

export const metadata: Metadata = {
  title: 'Forgot Password | Scripture Spot',
  description: 'Reset your Scripture Spot password.',
  keywords: ['Forgot password', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Forgot Password | Scripture Spot',
    description: 'Reset your Scripture Spot password.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Forgot%20Password`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Forgot Password | Scripture Spot',
    description: 'Reset your Scripture Spot password.',
    images: [`${env.site}/api/og?title=Forgot%20Password`],
  },
};

export default function Page() {
  return <ForgotPasswordPage />;
}
