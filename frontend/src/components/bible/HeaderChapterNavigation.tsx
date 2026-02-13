'use client';

import React, { useState, useTransition } from 'react';
import { Box, Button, CircularProgress, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { ArrowBackIosNew, ArrowForwardIos } from '@/components/ui/phosphor-icons';
import { useParams, useRouter } from 'next/navigation';
import { Primitive } from '@radix-ui/react-primitive';
import { useBibleChapters } from '@/hooks/useBibleChapters';

import { buildUrl } from '@/utils/navigation';

interface HeaderChapterNavigationProps {
  // Only show navigation on chapter pages
  showNavigation?: boolean;
  // Navigate to interlinear pages instead of regular chapter pages
  interlinearMode?: boolean;
}

export default function HeaderChapterNavigation({ showNavigation = false, interlinearMode = false }: HeaderChapterNavigationProps) {
  const theme = useTheme();
  const isMdDown = useMediaQuery(theme.breakpoints.down('md'));
  const params = useParams();
  const router = useRouter();
  const [pendingNav, setPendingNav] = useState<'prev' | 'next' | null>(null);
  const [, startTransition] = useTransition();
  
  if (!showNavigation) return null;
  
  const version = params.version as string;
  const bookSlug = params.book as string;
  const chapterNumber = parseInt(params.chapter as string);
  
  const { data: chapters } = useBibleChapters(bookSlug);
  
  if (!chapters || chapters.length === 0) return null;
  
  // Find previous and next chapters
  const currentIndex = chapters.findIndex(ch => ch.chapterNumber === chapterNumber);
  const prevChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;
  const nextChapter = currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;

  const buildChapterHref = (chapterValue: number | null | undefined) => {
    if (!chapterValue) {
      return undefined;
    }

    const basePath = buildUrl({ version, book: bookSlug, chapter: chapterValue });
    return interlinearMode ? `${basePath}/interlinear` : basePath;
  };

  const previousHref = buildChapterHref(prevChapter?.chapterNumber);
  const nextHref = buildChapterHref(nextChapter?.chapterNumber);

  // Button styles exactly matching VerseNavigationBar.tsx
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

  const handleNavigate = (href: string | undefined, target: 'prev' | 'next') => {
    if (!href || pendingNav) {
      return;
    }

    setPendingNav(target);
    startTransition(() => {
      try {
        router.push(href);
      } catch {
        setPendingNav(null);
      }
    });
  };

  return {
    previousButton: (
      <Button
        component={Primitive.button as any}
        type="button"
        onClick={() => handleNavigate(previousHref, 'prev')}
        disabled={!previousHref || (pendingNav !== null && pendingNav !== 'prev')}
        aria-busy={pendingNav === 'prev'}
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
        {pendingNav === 'prev' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: '#FFFAFA' }} />
            {!isMdDown && <span>Loading...</span>}
          </Box>
        ) : (
          <>
            <ArrowBackIosNew sx={{ fontSize: isMdDown ? '1.3rem' : '0.875rem' }} />
            {!isMdDown && <span style={{ marginLeft: 4 }}>Previous</span>}
          </>
        )}
      </Button>
    ),
    nextButton: (
      <Button
        component={Primitive.button as any}
        type="button"
        onClick={() => handleNavigate(nextHref, 'next')}
        disabled={!nextHref || (pendingNav !== null && pendingNav !== 'next')}
        aria-busy={pendingNav === 'next'}
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
        {pendingNav === 'next' ? (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CircularProgress size={18} sx={{ color: '#FFFAFA' }} />
            {!isMdDown && <span>Loading...</span>}
          </Box>
        ) : (
          <>
            {!isMdDown && <span style={{ marginRight: 4 }}>Next</span>}
            <ArrowForwardIos sx={{ fontSize: isMdDown ? '1.3rem' : '0.875rem' }} />
          </>
        )}
      </Button>
    )
  };
}
