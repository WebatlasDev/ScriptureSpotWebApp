import { Metadata } from 'next';
import StrongsLexiconPage from '@/components/strongs/StrongsLexiconPage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { strongsNumber } = await params;
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['strongs', strongsNumber]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(`Strong's ${strongsNumber} - Word Study`)}`;
  
  // Determine if it's Hebrew or Greek based on the Strong's number format
  const isHebrew = strongsNumber.startsWith('H');
  const isGreek = strongsNumber.startsWith('G');
  const language = isHebrew ? 'Hebrew' : isGreek ? 'Greek' : 'Biblical';
  
  // We'll need to fetch the word data for the title, but for now use a placeholder
  // TODO: Consider fetching lexicon data here for better SEO titles
  const pageTitle = `${strongsNumber} - ${language} Word Study | Scripture Spot`;
  const description = `Study the ${language} word ${strongsNumber} with complete lexicon entry including original word, transliteration, definition, grammar, and all Bible verse occurrences.`;

  return {
    title: pageTitle,
    description,
    keywords: [
      `Strong's ${strongsNumber}`,
      `${strongsNumber} Strong's concordance`,
      `${language} word study`,
      `${language} Bible dictionary`,
      `${strongsNumber} lexicon`,
      `${strongsNumber} definition`,
      `${strongsNumber} meaning`,
      'Bible study',
      'Strong\'s concordance',
      'Biblical word study',
      'Original language Bible',
      `${language} Bible study`,
      'Scripture analysis',
      'Bible lexicon',
      'Biblical Hebrew',
      'Biblical Greek',
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
    other: {
      'article:section': 'Bible Study',
      'article:tag': `Strong's ${strongsNumber}`,
    },
  };
}

export default function Page() {
  return <StrongsLexiconPage />;
}