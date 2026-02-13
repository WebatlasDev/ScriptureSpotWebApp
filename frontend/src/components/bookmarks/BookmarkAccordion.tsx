'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { BookmarkGroup } from '@/types/bookmark';
import BookmarkGrid from './BookmarkGrid';

interface BookmarkAccordionProps {
  bookmarkGroups: BookmarkGroup[];
  onBookmarkDeleted?: (bookmarkId: string) => void;
}

export default function BookmarkAccordion({ bookmarkGroups, onBookmarkDeleted }: BookmarkAccordionProps) {
  if (bookmarkGroups.length === 0) {
    return (
      <Box
        sx={{
          width: '100%',
          padding: 6,
          textAlign: 'center',
          color: 'rgba(255, 255, 255, 0.60)',
        }}
      >
        <Typography sx={{ fontSize: 18, fontWeight: 400 }}>
          No bookmarks found. Start bookmarking your favorite commentaries and content!
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 5 }}>
      {bookmarkGroups.map((group) => (
        <Box
          key={group.monthYear}
          sx={{
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2.5, md: 3 },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              width: '100%',
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 21, md: 23 },
                fontWeight: 700,
                lineHeight: 1,
                color: '#FFFFFF',
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(240, 242, 247, 0.85) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {group.displayName}
            </Typography>
            <Box
              sx={{
                px: 1.25,
                py: 0.25,
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                borderRadius: 1.25,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: 32,
              }}
            >
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.8)',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}
              >
                {group.count}
              </Typography>
            </Box>
            <Box
              sx={{
                flexGrow: 1,
                height: 2,
                borderRadius: 999,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(237,240,245,0))',
                opacity: 0.6,
              }}
            />
          </Box>

          <BookmarkGrid 
            bookmarks={group.bookmarks} 
            onBookmarkDeleted={onBookmarkDeleted}
          />
        </Box>
      ))}
    </Box>
  );
}
