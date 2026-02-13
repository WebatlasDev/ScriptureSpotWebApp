'use client';

import React, { useMemo, useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  CircularProgress, 
  Grid,
  Paper
} from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';
import { useBookCommentaryAvailability } from '@/hooks/useBookCommentaryAvailability';
import AuthorHeader from '@/components/author/AuthorHeader';
import CrossLoader from '@/components/ui/CrossLoader';
import { NEW_TESTAMENT_BOOKS, OLD_TESTAMENT_BOOKS } from '@/data/bibleBooks';
import { hexToRgb } from '@/utils/color';


export default function AuthorCommentariesPage() {
  const params = useParams();
  const router = useRouter();
  const { data: authors, isLoading: authorsLoading, error: authorsError } = useAuthorsAuthors();
  const [pendingBook, setPendingBook] = useState<string | null>(null);
  const [, startNavigation] = useTransition();
  
  // Find the author by slug from the authors list
  const author = authors?.find(a => a.slug === params.id);
  
  const isLoading = authorsLoading;
  const error = authorsError;

  // Handle book selection
  const handleBookSelect = (bookSlug: string, hasCommentary: boolean) => {
    if (!hasCommentary || pendingBook) {
      return;
    }

    setPendingBook(bookSlug);
    startNavigation(() => {
      try {
        router.push(`/commentators/${params.id}/commentaries/${bookSlug}`);
      } catch {
        setPendingBook(null);
      }
    });
  };
  
  // Use hardcoded Bible books for now - all 66 books
  const oldTestament = OLD_TESTAMENT_BOOKS;
  const newTestament = NEW_TESTAMENT_BOOKS;
  
  // Get all book slugs for availability checking
  const allBookSlugs = useMemo(
    () => [...OLD_TESTAMENT_BOOKS, ...NEW_TESTAMENT_BOOKS].map((book) => book.slug),
    []
  );
  
  // Check commentary availability for all books
  const { data: bookAvailability, isLoading: availabilityLoading } = useBookCommentaryAvailability(
    params.id as string, 
    allBookSlugs
  );
  
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (error || !author) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading author commentaries
      </Box>
    );
  }

  // Default color if not set in author data
  const authorColor = author?.colorScheme?.primary || '#5B41DE';
  
  const breadcrumbItems = [
    { label: 'Commentators', href: '/commentators' },
    { label: author.name }
  ];

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <AuthorHeader
        author={author}
        title="Available Commentaries"
        subtitle="Select a book of the Bible"
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
            minHeight: '400px',
            textAlign: 'center',
          }}
        >
          <CrossLoader size={60} />
          <Typography color="white" sx={{ mt: 3, opacity: 0.9, fontSize: '1.1rem' }}>
            Loading available commentaries...
          </Typography>
        </Box>
      ) : (
        /* Bible book grid */
        <Box sx={{ width: '100%' }}>
        
        {/* Old Testament */}
        {oldTestament.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              color="white" 
              sx={{ mb: 2, fontWeight: 500 }}
            >
              Old Testament
            </Typography>
            {/* Check if any Old Testament books have commentaries */}
            {(() => {
              const hasAnyOTCommentary = oldTestament.some(book => bookAvailability?.[book.slug]);
              
              if (!hasAnyOTCommentary && bookAvailability) {
                return (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(128, 128, 128, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(128, 128, 128, 0.2)'
                  }}>
                    <Typography variant="body1">
                      No Old Testament commentaries are available for {author.name} at the moment.
                    </Typography>
                  </Box>
                );
              }
              
              return (
                <Grid container spacing={2}>
                  {oldTestament.map((book) => {
                    const hasCommentary = bookAvailability?.[book.slug] ?? true; // Default to true while loading
                    const isPending = pendingBook === book.slug;
                    const isDisabled = !hasCommentary || (pendingBook !== null && pendingBook !== book.slug) || isPending;
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.slug}>
                        <Paper
                          component={Primitive.button as any}
                          onClick={() => handleBookSelect(book.slug, hasCommentary)}
                          type="button"
                          disabled={isDisabled}
                          sx={{
                            padding: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            background: hasCommentary 
                              ? `rgba(${author?.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.2)`
                              : 'rgba(128, 128, 128, 0.1)',
                            transition: 'all 0.2s',
                            cursor: !isDisabled ? 'pointer' : 'default',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: hasCommentary 
                              ? `1px solid rgba(${author?.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.5)`
                              : '1px solid rgba(128, 128, 128, 0.3)',
                            opacity: hasCommentary ? (isDisabled ? 0.75 : 1) : 0.4,
                            position: 'relative',
                            pointerEvents: isDisabled ? 'none' : 'auto',
                            width: '100%',
                            '&:hover': hasCommentary && !isDisabled ? {
                              background: `rgba(${author?.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.3)`,
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
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                              <Typography color="#FFFFFF" fontWeight={600} fontSize={14}>
                                Loading...
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color={hasCommentary ? "white" : "rgba(255, 255, 255, 0.5)"} fontWeight={500}>
                              {book.name}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })()}
          </Box>
        )}
        
        {/* New Testament */}
        {newTestament.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Typography 
              variant="h5" 
              component="h2" 
              color="white" 
              sx={{ mb: 2, fontWeight: 500 }}
            >
              New Testament
            </Typography>
            {/* Check if any New Testament books have commentaries */}
            {(() => {
              const hasAnyNTCommentary = newTestament.some(book => bookAvailability?.[book.slug]);
              
              if (!hasAnyNTCommentary && bookAvailability) {
                return (
                  <Box sx={{ 
                    textAlign: 'center', 
                    py: 4, 
                    color: 'rgba(255, 255, 255, 0.7)',
                    background: 'rgba(128, 128, 128, 0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(128, 128, 128, 0.2)'
                  }}>
                    <Typography variant="body1">
                      No New Testament commentaries are available for {author.name} at the moment.
                    </Typography>
                  </Box>
                );
              }
              
              return (
                <Grid container spacing={2}>
                  {newTestament.map((book) => {
                    const hasCommentary = bookAvailability?.[book.slug] ?? true; // Default to true while loading
                    const isPending = pendingBook === book.slug;
                    const isDisabled = !hasCommentary || (pendingBook !== null && pendingBook !== book.slug) || isPending;
                    return (
                      <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.slug}>
                        <Paper
                          component={Primitive.button as any}
                          onClick={() => handleBookSelect(book.slug, hasCommentary)}
                          type="button"
                          disabled={isDisabled}
                          sx={{
                            padding: 2,
                            textAlign: 'center',
                            borderRadius: 2,
                            background: hasCommentary 
                              ? `rgba(${author?.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.2)`
                              : 'rgba(128, 128, 128, 0.1)',
                            transition: 'all 0.2s',
                            cursor: !isDisabled ? 'pointer' : 'default',
                            height: '100%',
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            border: hasCommentary 
                              ? `1px solid rgba(${author?.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.5)`
                              : '1px solid rgba(128, 128, 128, 0.3)',
                            opacity: hasCommentary ? (isDisabled ? 0.75 : 1) : 0.4,
                            position: 'relative',
                            pointerEvents: isDisabled ? 'none' : 'auto',
                            width: '100%',
                            '&:hover': hasCommentary && !isDisabled ? {
                              background: `rgba(${author?.colorScheme?.primary ? hexToRgb(author.colorScheme.primary) : '91, 65, 222'}, 0.3)`,
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
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                              <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                              <Typography color="#FFFFFF" fontWeight={600} fontSize={14}>
                                Loading...
                              </Typography>
                            </Box>
                          ) : (
                            <Typography color={hasCommentary ? "white" : "rgba(255, 255, 255, 0.5)"} fontWeight={500}>
                              {book.name}
                            </Typography>
                          )}
                        </Paper>
                      </Grid>
                    );
                  })}
                </Grid>
              );
            })()}
          </Box>
        )}
        
      </Box>
      )}
    </Box>
  );
}

// Bible books data - all 66 books
