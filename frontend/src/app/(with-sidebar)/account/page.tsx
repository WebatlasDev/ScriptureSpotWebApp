import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { Protect, UserProfile } from '@clerk/nextjs';

const canonical = buildCanonical(env.site, ['account']);

export const metadata: Metadata = {
  title: 'Account | Scripture Spot',
  description: 'Manage your Scripture Spot account.',
  keywords: ['Account', 'User Profile', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Account | Scripture Spot',
    description: 'Manage your Scripture Spot account.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Account`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Account | Scripture Spot',
    description: 'Manage your Scripture Spot account.',
    images: [`${env.site}/api/og?title=Account`],
  },
};

export default function Page() {
  return (
    <Protect fallback={<p>You must sign in to view your account.</p>}>
      <UserProfile />
    </Protect>
  );
}
