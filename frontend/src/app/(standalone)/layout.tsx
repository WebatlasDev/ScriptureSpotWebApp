import { Box } from '@mui/material';
import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['login']);

export const metadata: Metadata = {
  title: 'Authentication | Scripture Spot',
  description: 'Access your Scripture Spot account.',
  keywords: ['Authentication', 'Scripture Spot'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Authentication | Scripture Spot',
    description: 'Access your Scripture Spot account.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Authentication`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Authentication | Scripture Spot',
    description: 'Access your Scripture Spot account.',
    images: [`${env.site}/api/og?title=Authentication`],
  },  
  icons: {
    icon: '/assets/images/logos/Scripture-Spot-Favicon.svg',
  },
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box sx={{ minHeight: '100vh', background: '#111111', display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
  );
}
