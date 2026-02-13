import { Metadata } from 'next';
import AuthorPage from '@/components/commentators/AuthorPage';
import agent from '@/app/api/agent';
import { env } from '@/types/env';
import { buildCanonical } from '@/utils/urlHelpers';

type AuthorParams = {
  id: string;
};

export async function generateMetadata({
  params,
}: {
  params: Promise<AuthorParams>;
}): Promise<Metadata> {
  const { id } = await params;
  const authors = await agent.Authors.listAuthors({});
  const author = authors?.find((a: any) => a.slug === id);
  const baseUrl = env.site;
  const canonical = buildCanonical(baseUrl, ['commentators', id]);
  const ogImage = `${baseUrl}/api/og?title=${encodeURIComponent(author?.name || 'Commentator')}`;
  const pageTitle = `${author?.name || 'Commentator'} | Scripture Spot`;
  const description = author
    ? `Learn about ${author.name} and explore their commentaries.`
    : 'Learn about this Bible commentator and explore their writings.';

  return {
    title: pageTitle,
    description,
    keywords: [author?.name || 'Bible commentator', 'Scripture Spot'],
    alternates: { canonical },
    openGraph: {
      title: pageTitle,
      description,
      url: canonical,
      siteName: 'Scripture Spot',
      type: 'profile',
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
  params: Promise<AuthorParams>;
}) {
  const { id } = await params;
  const authors = await agent.Authors.listAuthors({});
  const author = authors?.find((a: any) => a.slug === id);
  return <AuthorPage initialAuthor={author} />;
}
