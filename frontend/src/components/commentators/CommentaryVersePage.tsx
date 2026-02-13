import React from 'react';
import { Box, Typography, Button, Avatar } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRightIcon } from '@/components/ui/phosphor-icons';
import AuthorHeader from '@/components/author/AuthorHeader';
import Commentary from '@/components/commentary/Commentary';
import ViewOtherCommentariesButton from '@/components/commentators/ViewOtherCommentariesButton';
import { AuthorFromAPI } from '@/types/author';

type VerseParams = {
  id: string;
  bookId: string;
  chapter: string;
  verseRange: string;
};

interface CommentaryVersePageProps {
  params: VerseParams;
  author: AuthorFromAPI;
  book: any;
  commentaries: any[];
  verseContent: string;
  formattedReference: string;
  otherAuthors: any[];
  otherCommentariesHref: string;
}

export default function CommentaryVersePage({
  params,
  author,
  book,
  commentaries,
  verseContent,
  formattedReference,
  otherAuthors,
  otherCommentariesHref,
}: CommentaryVersePageProps) {
  if (!author || !book) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Unable to load commentary information.
      </Box>
    );
  }

  const breadcrumbItems = [
    { label: 'Commentators', href: '/commentators' },
    { label: author.name.split(' ').pop() || author.name, href: `/commentators/${params.id}/commentaries` },
    { label: book.name, href: `/commentators/${params.id}/commentaries/${params.bookId}` },
    { label: `Ch. ${params.chapter}`, href: `/commentators/${params.id}/commentaries/${params.bookId}/${params.chapter}` },
    { label: `Verse ${params.verseRange}` },
  ];

  const authorCommentaries = (commentaries || []).filter(
    (commentary: any) => commentary.author.slug === params.id,
  );

  const displayOtherAuthors = otherAuthors.slice(0, 5);

  const authorImageSrc = author.image ? author.image.replace(/\\/g, '/') : '';

  const authorForHeader = {
    id: author.id,
    name: author.name,
    slug: author.slug,
    image: author.image,
    colorScheme: author.colorScheme,
    birthYear: author.birthYear ?? undefined,
    deathYear: author.deathYear ?? undefined,
    religiousTradition: author.religiousTradition ?? undefined,
    occupation: author.occupation ?? undefined,
    nationality: author.nationality ?? undefined,
  };

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <AuthorHeader
        author={authorForHeader}
        title={`${author.name}'s Commentary`}
        subtitle={`on ${formattedReference}`}
        breadcrumbItems={breadcrumbItems}
      />

      {verseContent && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            mb: 3,
            position: 'relative',
            maxHeight:
              verseContent.length > 200
                ? { xs: '300px', sm: '200px' }
                : verseContent.length > 100
                  ? { xs: '240px', sm: '160px' }
                  : { xs: '180px', sm: '120px' },
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              mb: 2,
            }}
          >
            SCRIPTURE
          </Typography>
          <Box
            sx={{
              maxHeight:
                verseContent.length > 200
                  ? { xs: '180px', sm: '120px' }
                  : verseContent.length > 100
                    ? { xs: '120px', sm: '80px' }
                    : { xs: '90px', sm: '60px' },
              overflow: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.4)',
                },
              },
            }}
          >
            <Typography
              sx={{
                color: '#FFFAFA',
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 400,
                lineHeight: 1.4,
                fontStyle: 'italic',
              }}
            >
              "{verseContent}" — {formattedReference} (ASV)
            </Typography>
          </Box>
        </Box>
      )}

      {authorCommentaries.length > 0 ? (
        authorCommentaries.map((commentary: any) => (
          <Commentary
            key={commentary.id}
            commentary={commentary}
            mode="verse-range"
            bookSlug={params.bookId}
            chapterNumber={parseInt(params.chapter, 10)}
          />
        ))
      ) : (
        <Box sx={{ textAlign: 'center', my: 8, color: 'rgba(255, 255, 255, 0.7)' }}>
          <Typography variant="h6">
            No commentary available for {formattedReference}.
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: 'flex',
          gap: 3,
          mt: 4,
          mb: 4,
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' },
        }}
      >
        {otherAuthors.length > 0 && otherCommentariesHref ? (
          <ViewOtherCommentariesButton
            href={otherCommentariesHref}
            authors={displayOtherAuthors}
            totalCount={otherAuthors.length}
          />
        ) : (
          <Box sx={{ flex: 1 }} />
        )}

        <Link
          href={`/commentators/${params.id}/commentaries/${params.bookId}/${params.chapter}`}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <Button
            sx={{
              background:
                author?.colorScheme?.gradient ||
                `linear-gradient(0deg, rgba(${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(1, 3), 16) : 39}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(3, 5), 16) : 129}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(5, 7), 16) : 255}, 0.10) 0%, rgba(${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(1, 3), 16) : 39}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(3, 5), 16) : 129}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(5, 7), 16) : 255}, 0.10) 100%), #121212`,
              color: '#FFFAFA',
              borderRadius: 3.5,
              px: 4,
              py: 2,
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              minHeight: 56,
              width: '100%',
              border: `2px solid ${author?.colorScheme?.outline || 'rgba(255, 255, 255, 0.2)'}`,
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              '&:hover': {
                background:
                  author?.colorScheme?.gradient ||
                  `linear-gradient(0deg, rgba(${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(1, 3), 16) : 39}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(3, 5), 16) : 129}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(5, 7), 16) : 255}, 0.15) 0%, rgba(${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(1, 3), 16) : 39}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(3, 5), 16) : 129}, ${author?.colorScheme?.primary ? parseInt(author.colorScheme.primary.slice(5, 7), 16) : 255}, 0.15) 100%), #121212`,
                borderColor: author?.colorScheme?.outline || 'rgba(255, 255, 255, 0.3)',
                opacity: 0.9,
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {authorImageSrc && (
                <Avatar
                  alt={author.name}
                  sx={{
                    width: 32,
                    height: 32,
                    background: author.colorScheme?.primary
                      ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
                      : '#5B41DE',
                  }}
                >
                  <Image
                    src={authorImageSrc}
                    alt={author.name}
                    width={32}
                    height={32}
                    loading="lazy"
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Avatar>
              )}
              <Box sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                Full {book.name} {params.chapter} commentary
              </Box>
            </Box>
            <ChevronRightIcon sx={{ color: author?.colorScheme?.chipText || '#FFFAFA' }} />
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
