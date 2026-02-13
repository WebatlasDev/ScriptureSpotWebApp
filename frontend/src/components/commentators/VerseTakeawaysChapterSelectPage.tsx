'use client';

import React, { useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Grid, 
  Paper,
  CircularProgress,
} from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import CrossLoader from '@/components/ui/CrossLoader';
import VerseTakeawaysHeader from '@/components/commentators/VerseTakeawaysHeader';
import { hexToRgb } from '@/utils/color';

// Verse Takeaways color scheme
const VERSE_TAKEAWAYS_COLORS = {
  primary: '#ED27FF',
  secondary: '#164880',
  gradient: 'linear-gradient(135deg,rgba(237, 39, 255, 0.6) 0%,rgba(30, 77, 139, 0) 100%)',
  iconGradient: 'linear-gradient(46deg, #ED27FF 0%, #164880 100%)',
  headerGradient: 'linear-gradient(90deg, rgba(214, 31, 255, 0.1) 50%,rgba(54, 68, 145, 1) 100%), #1A1A1A'
};

interface VerseTakeawaysChapterSelectPageProps {
  initialBooks?: any[];
  initialChapters?: any[];
}

export default function VerseTakeawaysChapterSelectPage({ initialBooks, initialChapters }: VerseTakeawaysChapterSelectPageProps) {
  const params = useParams();
  const router = useRouter();
  const {
    data: bibleBooks,
    isLoading: booksLoading,
    error: booksError,
  } = useBibleBooks({ initialData: initialBooks });
  const {
    data: chapters,
    isLoading: chaptersLoading,
    error: chaptersError,
  } = useBibleChapters(params.bookId as string, { initialData: initialChapters });
  const [pendingChapter, setPendingChapter] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  
  // Find book information from the bookId
  const book = bibleBooks?.find(b => b.slug === params.bookId);
  
  const isLoading = booksLoading || chaptersLoading;
  const error = booksError || chaptersError;
  const handleChapterSelect = (chapterNumber: number) => {
    if (pendingChapter) {
      return;
    }

    setPendingChapter(chapterNumber);
    startTransition(() => {
      try {
        router.push(`/commentators/verse-takeaways/commentaries/${params.bookId}/${chapterNumber}`);
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
  
  if (error || !book) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading chapter information
      </Box>
    );
  }

  const breadcrumbItems = [
    { label: 'Verse Takeaways', href: '/commentators/verse-takeaways/commentaries' },
    { label: book.name }
  ];

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      {/* Header */}
      <VerseTakeawaysHeader
        title={`${book.name} Verse Takeaways`}
        subtitle="Select a chapter to explore"
        breadcrumbItems={breadcrumbItems}
      />
      
      {/* Chapter grid */}
      <Box sx={{ width: '100%', mb: 4 }}>
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
            const isPending = pendingChapter === chapter.chapterNumber;
            const isDisabled = Boolean((pendingChapter && pendingChapter !== chapter.chapterNumber) || isPending);

            return (
              <Grid item xs={4} sm={3} md={2} lg={1} key={chapter.chapterNumber}>
                <Paper
                  component={Primitive.button as any}
                  onClick={() => handleChapterSelect(chapter.chapterNumber)}
                  type="button"
                  disabled={isDisabled}
                  aria-busy={isPending}
                  aria-live={isPending ? 'polite' : undefined}
                  sx={{
                    padding: 2,
                    textAlign: 'center',
                    borderRadius: 2,
                    background: `rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.2)`,
                    transition: 'all 0.2s',
                    cursor: isDisabled ? 'not-allowed' : 'pointer',
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    border: `1px solid rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.5)`,
                    width: '100%',
                    opacity: isDisabled ? 0.75 : 1,
                    pointerEvents: isDisabled ? 'none' : 'auto',
                    '&:hover': !isDisabled ? {
                      background: `rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.3)`,
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
                >
                  {isPending ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                    </Box>
                  ) : (
                    <Typography 
                      color="white" 
                      fontWeight={500}
                    >
                      {chapter.chapterNumber}
                    </Typography>
                  )}
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Box>
  );
}
