import { Metadata } from 'next';
import { slugToBookName } from '@/utils/stringHelpers';
import VersePage from '@/components/verse/VersePage';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { notFound } from 'next/navigation';
import { isValidVersion } from '@/utils/versionValidator';
import { dehydrate } from '@tanstack/react-query';
import agent from '@/app/api/agent';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

export async function generateMetadata({ params }: any): Promise<Metadata> {
  const { version, book, chapter, verse } = await params;
  const bookName = slugToBookName(book);
  const formattedReference = `${bookName} ${chapter}:${verse}`;
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, [env.defaultVersion, book, chapter, verse]);
  const ogImage = buildCanonical(baseUrl, [env.defaultVersion, book, chapter, verse, 'image']);

  return {
    title: `${formattedReference} Meaning, Study, & Commentary | ${version.toUpperCase()} | Scripture Spot`,
    description: `Study ${formattedReference} from the ${version.toUpperCase()} Bible. Discover meaning, cross-references, and verse insights with trusted commentary tools.`,
    keywords: [
      `${formattedReference}`,
      `${bookName}`,
      `${bookName} ${chapter}:${verse}`,
      "Bible study",
      "Scripture Spot",
      "Bible commentary",
      "Bible meaning",
      "verse meaning",
      "Bible cross-references",
      "study the Bible",
      "Bible insights"
    ],
    alternates: {
      canonical,
    },
    openGraph: {
      title: `${formattedReference} Meaning, Study, & Commentary | ${version.toUpperCase()} | Scripture Spot`,
      description: `Study ${formattedReference} from the ${version.toUpperCase()} Bible. Discover meaning, cross-references, and verse insights with trusted commentary tools.`,
      url: canonical,
      siteName: 'Scripture Spot',
      type: 'article',
      images: [ogImage],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${formattedReference} Meaning, Study, & Commentary | ${version.toUpperCase()} | Scripture Spot`,
      description: `Study ${formattedReference} from the ${version.toUpperCase()} Bible. Discover meaning, cross-references, and verse insights with trusted commentary tools.`,
      images: [ogImage],
    },
  };
}

export default async function Page({ params }: any) {
  const { version, book, chapter, verse } = await params;
  const valid = await isValidVersion(version);
  if (!valid) notFound();
  const bookName = slugToBookName(book);
  const formattedReference = `${bookName} ${chapter}:${verse}`;
  const canonical = buildCanonical(env.site, [env.defaultVersion, book, chapter, verse]);

  const chapterNumber = Number(chapter);
  const verseNumber = Number(verse);

  const queryClient = createServerQueryClient();

  await Promise.all([
    queryClient.prefetchQuery({
      queryKey: ['bibleVerseVersion', book, chapterNumber, verseNumber, version],
      queryFn: async () => {
        const result = await agent.Bible.getBibleVerseVersion({
          BookSlug: book,
          ChapterNumber: chapterNumber,
          VerseNumber: verseNumber,
          VersionName: version,
        });
        return result || null;
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['bibleBookOverview', book],
      queryFn: async () => agent.Bible.getBibleBookOverview({ slug: book }),
    }),
    queryClient.prefetchQuery({
      queryKey: ['bibleVerseTakeaways', book, chapterNumber, verseNumber],
      queryFn: async () => {
        const result = await agent.Bible.getBibleVerseTakeaways({
          BookSlug: book,
          ChapterNumber: chapterNumber,
          VerseNumber: verseNumber,
        });
        return result || [];
      },
    }),
    queryClient.prefetchQuery({
      queryKey: ['authorCommentaries', book, chapterNumber, verseNumber, 150],
      queryFn: async () => {
        const result = await agent.Authors.listCommentariesByVerse({
          BookSlug: book,
          ChapterNumber: chapterNumber,
          VerseNumber: verseNumber,
          RequestType: 'Combined',
          PreviewCount: 150,
        });
        return result || [];
      },
    }),
  ]);

  const dehydratedState = dehydrate(queryClient);

  return (
    <>
      <ReactQueryHydrate state={dehydratedState}>
        <VersePage />
      </ReactQueryHydrate>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            headline: `${formattedReference} Meaning, Commentary and Cross-References | ${version.toUpperCase()} | Scripture Spot`,
            description: `Discover the meaning of ${formattedReference} in the ${version.toUpperCase()} Bible with commentary, theological insights, and cross-references. Explore Scripture Spot’s in-depth Bible study tools.`,
            url: canonical,
            author: {
              "@type": "Organization",
              name: "Scripture Spot",
            },
            publisher: {
              "@type": "Organization",
              name: "Scripture Spot",
            },
          }),
        }}
      />
    </>
  );
}
