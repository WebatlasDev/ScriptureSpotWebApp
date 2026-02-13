import { Metadata } from 'next';
import BibleBooksPage from '@/components/bible/BibleBooksPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { notFound } from 'next/navigation';
import { isValidVersion } from '@/utils/versionValidator';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { version } = await params;
  const versionName = version.toUpperCase();
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, [env.defaultVersion]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(`${versionName} Bible`)}`;
  const pageTitle = `${versionName} Bible Books | Scripture Spot`;
  const description = `Browse all books of the Bible in the ${versionName} translation. Select a book to read chapters and explore commentaries.`;

  return {
    title: pageTitle,
    description,
    keywords: [`${versionName} Bible`, 'Bible books', 'Old Testament', 'New Testament', 'Scripture Spot'],
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: 'Scripture Spot',
      type: 'website',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: any) {
  const { version } = await params;
  const valid = await isValidVersion(version);
  if (!valid) notFound();
  return <BibleBooksPage />;
}