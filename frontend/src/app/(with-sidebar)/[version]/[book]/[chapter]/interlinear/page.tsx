import { Metadata } from 'next';
import InterlinearChapterPage from '@/components/interlinear/InterlinearChapterPage';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { notFound } from 'next/navigation';
import { isValidVersion } from '@/utils/versionValidator';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { version, book, chapter } = await params;
  const bookName = slugToBookName(book);
  const versionName = version.toUpperCase();
  const formattedReference = `${bookName} ${chapter}`;
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, [env.defaultVersion, book, chapter, 'interlinear']);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(`${formattedReference} - Interlinear Text`)}`;
  const pageTitle = `${formattedReference} Interlinear | ${versionName} Bible | Scripture Spot`;
  const description = `Study ${formattedReference} with complete interlinear text showing original Hebrew/Greek words, transliterations, and English translations. Explore Strong's numbers and word meanings.`;

  return {
    title: pageTitle,
    description,
    keywords: [
      `${formattedReference} interlinear`,
      `${bookName} interlinear`,
      `${bookName} ${chapter} Hebrew`,
      `${bookName} ${chapter} Greek`,
      `${versionName} interlinear Bible`,
      'Bible interlinear text',
      'Strong\'s concordance',
      'Original language Bible',
      'Hebrew Bible study',
      'Greek Bible study',
      'Scripture Spot'
    ],
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: 'Scripture Spot',
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
    },
  };
}

export default async function Page({ params }: any) {
  const { version } = await params;
  const valid = await isValidVersion(version);
  if (!valid) notFound();
  return <InterlinearChapterPage />;
}