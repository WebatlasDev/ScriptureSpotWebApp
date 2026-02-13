import { Metadata } from 'next';
import CommentaryChapterSelectPage from '@/components/commentators/CommentaryChapterSelectPage';
import agent from '@/app/api/agent';
import { slugToBookName } from '@/utils/stringHelpers';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';
import { dehydrate } from '@tanstack/react-query';
import ReactQueryHydrate from '@/providers/ReactQueryHydrate';
import createServerQueryClient from '@/lib/react-query/createServerQueryClient';

type BookParams = {
  id: string;
  bookId: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<BookParams>;
}): Promise<Metadata> {
  const { id, bookId } = await params;
  const authors = await agent.Authors.listAuthors({});
  const author = authors?.find((a: any) => a.slug === id);
  const bookName = slugToBookName(bookId);
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', id, 'commentaries', bookId]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(bookName)}&subtitle=${encodeURIComponent(author?.name || 'Commentary')}`;
  const pageTitle = `${bookName} Commentary by ${author?.name || 'Author'} | Scripture Spot`;
  const description = author
    ? `Read ${author.name}'s commentary for ${bookName}. Choose a chapter to begin.`
    : 'Choose a chapter to view commentary from this author.';

  return {
    title: pageTitle,
    description,
    keywords: [bookName, author?.name || 'Commentary', 'Scripture Spot'],
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

export default async function Page({
  params,
}: {
  params: Promise<BookParams>;
}) {
  const { id, bookId } = await params;
  const queryClient = createServerQueryClient();

  const authorsPromise = queryClient.prefetchQuery({
    queryKey: ['authors'],
    queryFn: async () => {
      const result = await agent.Authors.listAuthors({});
      return result || [];
    },
  });

  const chaptersPromise = queryClient.prefetchQuery({
    queryKey: ['bibleChapters', bookId],
    queryFn: async () => {
      const result = await agent.Bible.listBibleChapters({ BookSlug: bookId });
      return result || [];
    },
  });

  await Promise.all([authorsPromise, chaptersPromise]);

  const authors = queryClient.getQueryData<any[]>(['authors']);
  const author = authors?.find((a) => a.slug === id);

  const chapters = queryClient.getQueryData<any[]>(['bibleChapters', bookId]) || [];
  const chapterNumbers = chapters.map((ch: any) => ch.chapterNumber);

  if (id && chapterNumbers.length > 0) {
    await queryClient.prefetchQuery({
      queryKey: ['chapterCommentaryAvailability', id, bookId, chapterNumbers],
      queryFn: async () =>
        agent.Authors.listCommentariesChapterAvailability({
          AuthorSlug: id,
          BookSlug: bookId,
          ChapterNumbers: [...chapterNumbers],
        }),
    });
  }

  await queryClient.prefetchQuery({
    queryKey: ['bibleBooks'],
    queryFn: async () => agent.Bible.listBibleBooks({}),
  });

  const dehydratedState = dehydrate(queryClient);

  return (
    <ReactQueryHydrate state={dehydratedState}>
      <CommentaryChapterSelectPage initialAuthor={author} />
    </ReactQueryHydrate>
  );
}
