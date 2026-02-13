'use client';

import React, { useState, useEffect } from 'react';
import {
  Popper,
  Paper,
  Typography,
  Box,
  Fade,
  useTheme,
  CircularProgress,
} from '@mui/material';
import { useBibleVerseVersion } from '@/hooks/useBibleVerseVersion';

interface VersePreviewProps {
  anchorEl: HTMLElement | null;
  reference: string;
  version: string;
  open: boolean;
}

// Parse Bible reference like "John 3:16" or "1 John 2:5"
const parseReference = (reference: string) => {
  const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
  if (match) {
    const bookName = match[1].trim();
    const chapter = parseInt(match[2]);
    const verse = parseInt(match[3]);
    
    // Convert book name to slug format
    const bookSlug = bookName
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');
    
    return { bookSlug, chapter, verse, bookName };
  }
  return null;
};

export default function VersePreview({
  anchorEl,
  reference,
  version,
  open,
}: VersePreviewProps) {
  const theme = useTheme();
  const [parsedRef, setParsedRef] = useState<{
    bookSlug: string;
    chapter: number;
    verse: number;
    bookName: string;
  } | null>(null);

  useEffect(() => {
    if (reference) {
      setParsedRef(parseReference(reference));
    }
  }, [reference]);

  const { data: verseData, isLoading } = useBibleVerseVersion(
    parsedRef?.bookSlug || '',
    parsedRef?.chapter || 0,
    parsedRef?.verse || 0,
    version
  );

  if (!open || !anchorEl || !parsedRef) {
    return null;
  }

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      placement="top"
      transition
      sx={{ zIndex: 1300 }}
    >
      {({ TransitionProps }) => (
        <Fade {...TransitionProps} timeout={200}>
          <Paper
            sx={{
              p: 2,
              maxWidth: 320,
              borderRadius: 2,
              boxShadow: theme.shadows[8],
              border: `1px solid ${theme.palette.divider}`,
              bgcolor: theme.palette.background.paper,
            }}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Loading verse...
                </Typography>
              </Box>
            ) : verseData?.content ? (
              <Box>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{
                    fontWeight: 600,
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px',
                    mb: 1,
                    display: 'block',
                  }}
                >
                  {parsedRef.bookName} {parsedRef.chapter}:{parsedRef.verse} ({version})
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    lineHeight: 1.5,
                    color: theme.palette.text.primary,
                    // Handle HTML content if needed
                    '& sup': {
                      fontSize: '10px',
                      fontWeight: 600,
                      color: theme.palette.text.secondary,
                      marginRight: '2px',
                    },
                  }}
                  dangerouslySetInnerHTML={{ __html: verseData.content }}
                />
              </Box>
            ) : (
              <Typography variant="body2" color="text.secondary">
                Verse not found
              </Typography>
            )}
          </Paper>
        </Fade>
      )}
    </Popper>
  );
}