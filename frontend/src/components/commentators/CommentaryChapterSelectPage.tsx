'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  CircularProgress,
  Grid,
  Paper,
  Alert,
} from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';
import { AuthorFromAPI } from '@/types/author';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import { useChapterCommentaryAvailability } from '@/hooks/useChapterCommentaryAvailability';
import AuthorHeader from '@/components/author/AuthorHeader';
import CrossLoader from '@/components/ui/CrossLoader';
import { hexToRgb } from '@/utils/color';


interface CommentaryChapterSelectPageProps {
  initialAuthor?: AuthorFromAPI;
}

export default function CommentaryChapterSelectPage({ initialAuthor }: CommentaryChapterSelectPageProps) {
  const params = useParams();
  const router = useRouter();
  const {
    data: authors,
    isLoading: authorsLoading,
    error: authorsError,
  } = useAuthorsAuthors(
    initialAuthor ? { enabled: false, initialData: [initialAuthor] } : undefined
  );
  const { data: bibleBooks, isLoading: booksLoading, error: booksError } = useBibleBooks();
  const { data: chapters, isLoading: chaptersLoading, error: chaptersError } = useBibleChapters(params.bookId as string);
  const [pendingChapter, setPendingChapter] = useState<number | null>(null);
  const [, startNavigation] = useTransition();
  
  // Find the author by slug from the authors list or use initialAuthor
  const author = initialAuthor || authors?.find(a => a.slug === params.id);
  
  // Find book information from the bookId
  const book = bibleBooks?.find(b => b.slug === params.bookId);
  
  // Get chapter numbers for availability checking
  const chapterNumbers = useMemo(
    () => (chapters ?? []).map((ch) => ch.chapterNumber),
    [chapters]
  );
  
  // Check commentary availability for all chapters
  const {
    data: chapterAvailability,
    isLoading: availabilityLoading,
    error: availabilityError,
  } = useChapterCommentaryAvailability(params.id as string, params.bookId as string, chapterNumbers);
  const hasAvailabilityError = Boolean(availabilityError);
  
  const isLoading = authorsLoading || booksLoading || chaptersLoading;
  const error = authorsError || booksError || chaptersError;
  
  
  const handleChapterSelect = (chapterNumber: number, hasCommentary: boolean) => {
    if (!hasCommentary || pendingChapter) {
      return;
    }

    setPendingChapter(chapterNumber);
    startNavigation(() => {
      try {
        router.push(`/commentators/${params.id}/commentaries/${params.bookId}/${chapterNumber}`);
      } catch {
        setPendingChapter(null);
      }
    });
  };
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (error || !author || !book) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading chapter information
      </Box>
    );
  }

  const breadcrumbItems = [
    { label: 'Commentators', href: '/commentators' },
    { label: author.name, href: `/commentators/${params.id}/commentaries` },
    { label: book.name }
  ];

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <AuthorHeader
        author={author}
        title={`${book.name} Commentary`}
        subtitle="Select a chapter to explore"
        breadcrumbItems={breadcrumbItems}
      />
      
      {/* Loading state - show loader below header */}
      {availabilityLoading ? (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '300px',
            textAlign: 'center',
            mb: 4,
          }}
        >
          <CrossLoader size={60} />
          <Typography color="white" sx={{ mt: 3, opacity: 0.9, fontSize: '1.1rem' }}>
            Loading available chapters...
          </Typography>
        </Box>
      ) : (
        <Box sx={{ width: '100%', mb: 4 }}>
          {hasAvailabilityError && (
            <Alert severity="warning" sx={{ mb: 2, background: 'rgba(255, 193, 7, 0.12)', color: 'white' }}>
              We couldn’t confirm which chapters have commentary right now. Please try again later.
            </Alert>
          )}
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Chapters
          </Typography>
          <Grid container spacing={2}>
            {chapters?.map((chapter) => {
              const hasCommentary = hasAvailabilityError ? false : !!chapterAvailability?.[chapter.chapterNumber];
              const isPending = pendingChapter === chapter.chapterNumber;
              const isDisabled = !hasCommentary || (pendingChapter !== null && pendingChapter !== chapter.chapterNumber) || isPending;

              return (
                <Grid item xs={4} sm={3} md={2} lg={1} key={chapter.chapterNumber}>
                  <Paper
                    component={Primitive.button as any}
                    onClick={() => handleChapterSelect(chapter.chapterNumber, hasCommentary)}
                    type="button"
                    disabled={isDisabled}
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      background: hasCommentary 
                        ? `rgba(${author.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.2)`
                        : 'rgba(128, 128, 128, 0.1)',
                      transition: 'all 0.2s',
                      cursor: !isDisabled ? 'pointer' : 'default',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border: hasCommentary 
                        ? `1px solid rgba(${author.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.5)`
                        : '1px solid rgba(128, 128, 128, 0.3)',
                      opacity: hasCommentary ? (isDisabled ? 0.75 : 1) : 0.4,
                      position: 'relative',
                      pointerEvents: isDisabled ? 'none' : 'auto',
                      width: '100%',
                      '&:hover': hasCommentary && !isDisabled ? {
                        background: `rgba(${author.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.3)`,
                        transform: 'translateY(-2px)',
                      } : {},
                      '&:focus-visible': {
                        outline: '2px solid rgba(255, 255, 255, 0.35)',
                        outlineOffset: 2,
                      },
                      '&:disabled': {
                        transform: 'none',
                      },
                    }}
                    aria-busy={isPending}
                    aria-live={isPending ? 'polite' : undefined}
                  >
                    {isPending ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                      </Box>
                    ) : (
                      <Typography color={hasCommentary ? "white" : "rgba(255, 255, 255, 0.5)"} fontWeight={500}>
                        {chapter.chapterNumber}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        
        {/* If no chapters available, show a message */}
        {!isLoading && (!chapters || chapters.length === 0) && (
          <Box sx={{ textAlign: 'center', my: 8, color: 'rgba(255, 255, 255, 0.7)' }}>
            <Typography variant="h6">
              No commentaries available for any chapters in {book.name}.
            </Typography>
          </Box>
        )}
      </Box>
      )}
    </Box>
  );
}
