'use client';

import React from 'react';
import { Box, Grid } from '@mui/material';
import { motion } from 'framer-motion';
import { BookmarkDisplay } from '@/types/bookmark';
import BookmarkCard from './BookmarkCard';
import { fadeSlideUpVariants } from '@/hooks/useScrollAnimation';

interface BookmarkGridProps {
  bookmarks: BookmarkDisplay[];
  onBookmarkDeleted?: (bookmarkId: string) => void;
}

// Animated wrapper for individual bookmark cards
function AnimatedBookmarkCard({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeSlideUpVariants}
    >
      {children}
    </motion.div>
  );
}

export default function BookmarkGrid({ bookmarks, onBookmarkDeleted }: BookmarkGridProps) {
  if (bookmarks.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          padding: 4,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.60)',
        }}
      >
        No bookmarks in this period.
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Grid container spacing={3}>
        {bookmarks.map((bookmark) => (
          <Grid item xs={12} md={6} key={bookmark.id}>
            <AnimatedBookmarkCard>
              <BookmarkCard
                bookmark={bookmark}
                onBookmarkDeleted={onBookmarkDeleted}
              />
            </AnimatedBookmarkCard>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}