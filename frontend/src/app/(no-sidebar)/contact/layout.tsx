import { Metadata } from 'next';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

const canonical = buildCanonical(env.site, ['contact']);

export const metadata: Metadata = {
  title: 'Contact Scripture Spot | Get in Touch',
  description: 'Have a question, suggestion, or just want to say hello? We\'d love to hear from you.',
  keywords: ['Contact', 'Scripture Spot', 'Support', 'Get in Touch'],
  alternates: {
    canonical,
  },
  openGraph: {
    title: 'Contact Scripture Spot | Get in Touch',
    description: 'Have a question, suggestion, or just want to say hello? We\'d love to hear from you.',
    url: canonical,
    siteName: 'Scripture Spot',
    type: 'website',
    images: [`${env.site}/api/og?title=Contact%20Scripture%20Spot`],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Scripture Spot | Get in Touch',
    description: 'Have a question, suggestion, or just want to say hello? We\'d love to hear from you.',
    images: [`${env.site}/api/og?title=Contact%20Scripture%20Spot`],
  },
};

export default function ContactLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}