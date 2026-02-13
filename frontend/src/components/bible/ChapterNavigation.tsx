'use client';

import React, { useTransition, useState } from 'react';
import { Box, Typography, Button, useMediaQuery, CircularProgress } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Primitive } from '@radix-ui/react-primitive';
import { useRouter } from 'next/navigation';

import { buildUrl } from '@/utils/navigation';
import { ArrowBackIosNewIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIosIcon } from '@/components/ui/phosphor-icons';

// Design constants
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';

interface ChapterNavigationProps {
  chapters: Array<{
    chapterNumber: number;
  }>;
  currentChapter: number;
  version: string;
  bookSlug: string;
  bookName: string;
}

export default function ChapterNavigation({
  chapters,
  currentChapter,
  version,
  bookSlug,
  bookName
}: ChapterNavigationProps) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const router = useRouter();
  const [pendingTarget, setPendingTarget] = useState<'prev' | 'next' | null>(null);
  const [, startTransition] = useTransition();

  // Bible-specific color scheme
  const bibleColor = '#278EFF';
  const bibleGradient = `linear-gradient(216deg, ${bibleColor} 0%, #1a5fb8 100%)`;

  // Find previous and next chapters
  const currentIndex = chapters.findIndex(ch => ch.chapterNumber === currentChapter);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const previousHref = prevChapter
    ? buildUrl({ version, book: bookSlug, chapter: prevChapter.chapterNumber })
    : undefined;

  const nextHref = nextChapter
    ? buildUrl({ version, book: bookSlug, chapter: nextChapter.chapterNumber })
    : undefined;

  const handleNavigate = (href: string | undefined, target: 'prev' | 'next') => {
    if (!href || pendingTarget) {
      return;
    }

    setPendingTarget(target);
    startTransition(() => {
      try {
        router.push(href);
      } catch {
        setPendingTarget(null);
      }
    });
  };

  // Button styles matching VerseNavigationBar.tsx
  const buttonStyles = {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'text.primary',
    minWidth: { xs: 'auto', sm: 80 },
    px: 1.5,
    '&:hover': {
      borderColor: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
  };

  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 3.5,
        p: 3,
        width: '100%',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
      }}
    >
      <Button
        component={Primitive.button as any}
        type="button"
        onClick={() => handleNavigate(previousHref, 'prev')}
        disabled={!previousHref || (pendingTarget !== null && pendingTarget !== 'prev')}
        aria-busy={pendingTarget === 'prev'}
        variant={isMdDown ? 'text' : 'outlined'}
        sx={{
          ...(isMdDown ? {} : buttonStyles),
          color: !prevChapter ? 'rgba(255, 255, 255, 0.25)' : (isMdDown ? 'text.secondary' : 'text.secondary'),
          minWidth: 'auto',
          px: isMdDown ? 1 : 2,
          py: isMdDown ? 1 : 0.75,
          fontSize: isMdDown ? '1rem' : '0.875rem',
          transition: 'color 0.2s ease',
          ...(!isMdDown && {
            '&:hover': {
              borderColor: '#FFD700',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFFFFF',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              opacity: 0.4,
            },
          }),
          ...(isMdDown && {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
            },
            '&:disabled': {
              opacity: 0.4,
            },
          }),
        }}
      >
        {pendingTarget === 'prev' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: '#FFFAFA' }} />
            {!isMdDown && <span>Loading...</span>}
          </Box>
        ) : (
          <>
            <ArrowBackIosNewIcon sx={{ fontSize: isMdDown ? '1.3rem' : '0.875rem' }} />
            {!isMdDown && <span style={{ marginLeft: 4 }}>Previous</span>}
          </>
        )}
      </Button>
      
      {/* Current Chapter Indicator */}
      <Box sx={{ textAlign: 'center' }}>
        <Typography
          sx={{
            color: TEXT_COLOR_SECONDARY,
            fontSize: 12,
            fontWeight: 500,
            lineHeight: 1.2,
            mb: 0.5,
          }}
        >
          {bookName}
        </Typography>
        <Typography
          sx={{
            color: TEXT_COLOR_PRIMARY,
            fontSize: 18,
            fontWeight: 700,
            lineHeight: 1.2,
          }}
        >
          Chapter {currentChapter}
        </Typography>
        <Typography
          sx={{
            color: TEXT_COLOR_SECONDARY,
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.2,
            mt: 0.5,
          }}
        >
          {currentChapter} of {chapters.length}
        </Typography>
      </Box>

      <Button
        component={Primitive.button as any}
        type="button"
        onClick={() => handleNavigate(nextHref, 'next')}
        disabled={!nextHref || (pendingTarget !== null && pendingTarget !== 'next')}
        aria-busy={pendingTarget === 'next'}
        variant={isMdDown ? 'text' : 'outlined'}
        sx={{
          ...(isMdDown ? {} : buttonStyles),
          color: !nextChapter ? 'rgba(255, 255, 255, 0.25)' : (isMdDown ? 'text.secondary' : 'text.secondary'),
          minWidth: 'auto',
          px: isMdDown ? 1 : 2,
          py: isMdDown ? 1 : 0.75,
          fontSize: isMdDown ? '1rem' : '0.875rem',
          transition: 'color 0.2s ease',
          ...(!isMdDown && {
            '&:hover': {
              borderColor: '#FFD700',
              backgroundColor: 'rgba(255, 215, 0, 0.1)',
              color: '#FFFFFF',
            },
            '&:disabled': {
              borderColor: 'rgba(255, 255, 255, 0.05)',
              color: 'rgba(255, 255, 255, 0.25)',
              backgroundColor: 'rgba(255, 255, 255, 0.02)',
              opacity: 0.4,
            },
          }),
          ...(isMdDown && {
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFFFF',
            },
            '&:disabled': {
              opacity: 0.4,
            },
          }),
        }}
      >
        {pendingTarget === 'next' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: '#FFFAFA' }} />
            {!isMdDown && <span>Loading...</span>}
          </Box>
        ) : (
          <>
            {!isMdDown && <span style={{ marginRight: 4 }}>Next</span>}
            <ArrowForwardIosIcon sx={{ fontSize: isMdDown ? '1.3rem' : '0.875rem' }} />
          </>
        )}
      </Button>
    </Box>
  );
}
