import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import CommentaryVersePage from '@/components/commentators/CommentaryVersePage';
import agent from '@/app/api/agent';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

type VerseParams = {
  id: string;
  bookId: string;
  chapter: string;
  verseRange: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<VerseParams>;
}): Promise<Metadata> {
  const { id, bookId, chapter, verseRange } = await params;
  const authors = await agent.Authors.listAuthors({});
  const author = authors?.find((a: any) => a.slug === id);
  const bookName = slugToBookName(bookId);
  const formattedReference = `${bookName} ${chapter}:${verseRange}`;
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', id, 'commentaries', bookId, chapter, verseRange]);
  const ogImage = buildCanonical(canonical, ['image']);
  const pageTitle = `${formattedReference} Commentary by ${author?.name || 'Commentator'} | Scripture Spot`;
  const description = `Read ${author?.name || 'Bible'} commentary on ${formattedReference}. Gain insights and study notes from trusted resources.`;

  return {
    title: pageTitle,
    description,
    keywords: [
      formattedReference,
      bookName,
      'Bible commentary',
      author?.name || 'commentary',
      'Scripture Spot',
    ],
    alternates: {
      canonical,
    },
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
  };
}

function parseVerseRange(verseRange: string) {
  const parts = verseRange.split('-');
  const startVerse = Number(parts[0]);
  const endVerse = parts[1] ? Number(parts[1]) : startVerse;
  const verses: number[] = [];
  for (let i = startVerse; i <= endVerse; i += 1) {
    verses.push(i);
  }
  return verses;
}

export default async function Page({ params }: { params: Promise<VerseParams> }) {
  const { id, bookId, chapter, verseRange } = await params;
  const chapterNumber = Number(chapter);
  const verseNumbers = parseVerseRange(verseRange);
  const startingVerse = verseNumbers[0] ?? 1;

  const [authors, bibleBooks] = await Promise.all([
    agent.Authors.listAuthors({}).catch(() => []),
    agent.Bible.listBibleBooks({}).catch(() => []),
  ]);

  const author = authors?.find((a: any) => a.slug === id) ?? null;
  const book = bibleBooks?.find((b: any) => b.slug === bookId) ?? null;

  if (!author || !book) {
    notFound();
  }

  const commentaries =
    (await agent.Authors.listCommentariesByVerse({
      BookSlug: bookId,
      ChapterNumber: chapterNumber,
      VerseNumber: startingVerse,
      RequestType: 'Combined',
    }).catch(() => [])) ?? [];

  const verseResponses = await Promise.all(
    verseNumbers.map((verseNumber) =>
      agent.Bible.getBibleVerseVersion({
        BookSlug: bookId,
        ChapterNumber: chapterNumber,
        VerseNumber: verseNumber,
        VersionName: 'ASV',
      }).catch(() => null),
    ),
  );

  const verseContent = verseResponses
    .map((result) => result?.content)
    .filter(Boolean)
    .join(' ');

  const allOtherAuthors = commentaries
    .filter((c: any) => c.author.slug !== id)
    .reduce((unique: any[], commentary: any) => {
      if (!unique.some((item) => item.author.slug === commentary.author.slug)) {
        unique.push(commentary);
      }
      return unique;
    }, []);

  const viewOtherCommentariesHref =
    allOtherAuthors.length > 0 ? `/ASV/${bookId}/${chapter}/${startingVerse}` : '';

  const formattedReference = `${book.name} ${chapter}:${verseRange}`;

  return (
    <CommentaryVersePage
      params={{ id, bookId, chapter, verseRange }}
      author={author}
      book={book}
      commentaries={commentaries}
      verseContent={verseContent}
      formattedReference={formattedReference}
      otherAuthors={allOtherAuthors}
      otherCommentariesHref={viewOtherCommentariesHref}
    />
  );
}
