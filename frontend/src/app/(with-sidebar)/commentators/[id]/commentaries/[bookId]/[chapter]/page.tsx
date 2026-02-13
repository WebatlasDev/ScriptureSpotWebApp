import { Metadata } from 'next';
import CommentaryChapterPage from '@/components/commentators/CommentaryChapterPage';
import agent from '@/app/api/agent';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { dehydrate } from '@tanstack/react-query';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';
import { extractPaginatedItems } from '@/utils/pagination';

type ChapterParams = {
  id: string;
  bookId: string;
  chapter: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<ChapterParams>;
}): Promise<Metadata> {
  const { id, bookId, chapter } = await params;
  const authors = await agent.Authors.listAuthors({});
  const author = authors?.find((a: any) => a.slug === id);
  const bookName = slugToBookName(bookId);
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', id, 'commentaries', bookId, chapter]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(bookName + ' ' + chapter)}&subtitle=${encodeURIComponent(author?.name || 'Commentary')}`;
  const pageTitle = `${bookName} ${chapter} Commentary by ${author?.name || 'Author'} | Scripture Spot`;
  const description = author
    ? `Read ${author.name}'s commentary for ${bookName} chapter ${chapter}.`
    : 'Read the commentary for this chapter.';

  return {
    title: pageTitle,
    description,
    keywords: [bookName, 'chapter ' + chapter, author?.name || 'Commentary', 'Scripture Spot'],
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
  };
}

export default async function Page({
  params,
}: {
  params: Promise<ChapterParams>;
}) {
  const { id, bookId, chapter } = await params;
  const chapterNumber = Number(chapter);
  const defaultVersion = env.defaultVersion.toUpperCase();
  const queryClient = createServerQueryClient();

  const authorsPromise = queryClient.prefetchQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const result = await agent.Authors.listAuthors({});
      return result || [];
    },
  });

  const bibleBooksPromise = queryClient.prefetchQuery({
    queryKey: ['bibleBooks'],
    queryFn: async () => {
      const result = await agent.Bible.listBibleBooks({});
      return result || [];
    },
  });

  const bibleChaptersPromise = queryClient.prefetchQuery({
    queryKey: ['bibleChapters', bookId],
    queryFn: async () => {
      const result = await agent.Bible.listBibleChapters({
        BookSlug: bookId,
      });
      return result || [];
    },
  });

  const commentariesPromise = queryClient.prefetchQuery({
    queryKey: ['authorCommentariesByChapter', id, bookId, chapterNumber, 'Combined', defaultVersion],
    queryFn: async () => {
      const result = await agent.Authors.listCommentariesByChapter({
        AuthorSlug: id,
        BookSlug: bookId,
        ChapterNumber: chapterNumber,
        RequestType: 'Combined',
        VersionName: defaultVersion,
      });
      const normalizedResult = extractPaginatedItems<any[]>(result);
      return Array.isArray(normalizedResult) ? normalizedResult : [];
    },
  });

  await Promise.all([authorsPromise, bibleBooksPromise, bibleChaptersPromise, commentariesPromise]);

  const authors = queryClient.getQueryData<any[]>(['authors']);
  const author = authors?.find((a) => a.slug === id);
  const bibleBooks = queryClient.getQueryData<any[]>(['bibleBooks']);
  const bibleChapters = queryClient.getQueryData<any[]>(['bibleChapters', bookId]) || [];
  const commentariesData = queryClient.getQueryData<any[] | undefined>([
    'authorCommentariesByChapter',
    id,
    bookId,
    chapterNumber,
    'Combined',
    defaultVersion,
  ]);
  const commentaries = extractPaginatedItems<any[] | undefined>(commentariesData) || [];

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <CommentaryChapterPage
        initialAuthor={author}
        initialBibleBooks={bibleBooks}
        initialChapters={bibleChapters}
        initialCommentaries={commentaries}
        initialVersion={defaultVersion}
      />
    </ReactQueryHydrate>
  );
}
