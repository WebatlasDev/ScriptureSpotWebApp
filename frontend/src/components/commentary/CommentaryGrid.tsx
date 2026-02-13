'use client';

import { Box, Typography, Grid, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import CrossLoader from '@/components/ui/CrossLoader';
import { motion } from 'framer-motion';
import CommentaryCard from './CommentaryCard';
import { useAuthorsCommentaries } from '@/hooks/useAuthorsCommentaries';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useScrollAnimation, fadeSlideUpVariants } from '@/hooks/useScrollAnimation';
import CommentarySlider from './CommentarySlider';

interface CommentaryGridProps {
  verseReference: string;
  verseContent: string;
  verseVersion: string;
}

// Animated wrapper for individual cards
function AnimatedCard({ children, disableAnimation = false }: { children: React.ReactNode; disableAnimation?: boolean }) {
  if (disableAnimation) {
    return (
      <motion.div
        style={{ cursor: 'pointer', height: '100%', display: 'flex' }}
        initial="visible"
        animate="visible"
        variants={{ visible: { opacity: 1, y: 0 } }}
        transition={{ duration: 0 }}
      >
        {children}
      </motion.div>
    );
  }

  return <AnimatedCardWithMotion>{children}</AnimatedCardWithMotion>;
}

function AnimatedCardWithMotion({ children }: { children: React.ReactNode }) {
  const { elementRef, isVisible } = useScrollAnimation({
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  return (
    <motion.div
      ref={elementRef}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      variants={fadeSlideUpVariants}
      style={{ cursor: 'pointer', height: '100%', display: 'flex' }}
    >
      {children}
    </motion.div>
  );
}

function groupCommentariesByAuthor(commentaries: any[] | undefined | null) {
  if (!commentaries || commentaries.length === 0) {
    return [];
  }

  const grouped = commentaries.reduce((acc: any, commentary: any) => {
    const authorId = commentary.author.id;
    if (!acc[authorId]) {
      acc[authorId] = {
        author: commentary.author,
        commentaries: [],
        representativeCommentary: commentary
      };
    }
    acc[authorId].commentaries.push(commentary);
    return acc;
  }, {});

  return Object.values(grouped);
}

export default function CommentaryGrid({ verseReference, verseContent, verseVersion }: CommentaryGridProps) {
  const [initialAuthor, setInitialAuthor] = useState<string | null>(null);
  const previewCount = 150;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'), { defaultMatches: false, noSsr: true });
  const isMdUp = !isMobile;
  
  const match = verseReference.match(/^([\w\s]+)\s+(\d+):(\d+)$/);

  if (!match) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Invalid verse reference format: <strong>{verseReference}</strong>
      </Box>
    );
  }

  const [, bookName, chapter, verse] = match;
  const bookSlug = bookName.trim().toLowerCase().replace(/\s+/g, '-');
  const chapterNumber = parseInt(chapter, 10);
  const verseNumber = parseInt(verse, 10);

  const { data: commentaries, isLoading, error } = useAuthorsCommentaries(bookSlug, chapterNumber, verseNumber, "Combined", previewCount);

  const authorGroups = useMemo(() => groupCommentariesByAuthor(commentaries), [commentaries]);

  useEffect(() => {
    const checkUrlHash = () => {
      if (typeof window !== 'undefined') {
        const hash = window.location.hash;
        if (hash) {
          const authorName = hash.substring(1).replace(/-/g, ' ');
          setInitialAuthor(authorName);
        }
      }
    };

    checkUrlHash();

    const handleHashChange = () => checkUrlHash();
    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const renderItemContent = useCallback((item: any) => (
    <AnimatedCard disableAnimation={isMobile}>
      <CommentaryCard
        commentary={(item as any).representativeCommentary}
        commentaries={commentaries}
        verseContent={verseContent}
        verseVersion={verseVersion}
        initialAuthor={initialAuthor}
        isMdUp={isMdUp}
      />
    </AnimatedCard>
  ), [commentaries, initialAuthor, isMdUp, isMobile, verseContent, verseVersion]);

  const getItemKey = useCallback((item: any) => String((item as any).author.id), []);

  let content: React.ReactNode;

  if (isLoading) {
    content = (
      <Box sx={{ padding: 3, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <CrossLoader size={50} />
        <Typography color="text.secondary" sx={{ mt: 2 }}>
          Loading commentaries...
        </Typography>
      </Box>
    );
  } else if (error) {
    const message = error instanceof Error ? error.message : String(error);
    content = (
      <Box sx={{ padding: 3, color: 'error.main' }}>
        Error loading commentaries: {message}
      </Box>
    );
  } else if (!commentaries || commentaries.length === 0) {
    content = (
      <Box sx={{ padding: 3, color: 'text.secondary', textAlign: 'center' }}>
        <Typography>No commentaries found for this verse: {verseReference}</Typography>
      </Box>
    );
  } else if (isMobile) {
    content = (
      <CommentarySlider items={authorGroups} renderItem={renderItemContent} getItemKey={getItemKey} />
    );
  } else {
    content = (
      <Grid container spacing={3}>
        {authorGroups.map(item => (
          <Grid item xs={12} md={4} key={getItemKey(item)}>
            {renderItemContent(item)}
          </Grid>
        ))}
      </Grid>
    );
  }

  return <Box sx={{ width: '100%', mb: 4 }}>{content}</Box>;
}

export function CommentaryGridWithAnalytics({ verseReference, verseContent, verseVersion }: CommentaryGridProps) {
  return (
    <CommentaryGrid
      verseReference={verseReference}
      verseContent={verseContent}
      verseVersion={verseVersion}
    />
  );
}
