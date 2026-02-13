'use client';

import { Box, Typography } from '@mui/material';

interface VerseCardProps {
  verseRange: string;
  verseContent: string;
  versionName?: string;
  backgroundColor?: string;
  verseReference?: string;
}

export default function VerseCard({
  verseRange,
  verseContent,
  versionName = 'KJV',
  backgroundColor = 'rgba(255, 255, 255, 0.05)',
  verseReference
}: VerseCardProps) {

  return (
    <Box
      sx={{
        backgroundColor,
        borderRadius: 3,
        p: { xs: 3, sm: 4 },
        mb: 3,
        position: 'relative',
        // Dynamic height based on content length (accounting for reference text at bottom)
        maxHeight: verseContent && verseContent.length > 200 ? { xs: '300px', sm: '200px' } : verseContent && verseContent.length > 100 ? { xs: '240px', sm: '160px' } : { xs: '180px', sm: '120px' },
        overflow: 'hidden',
      }}
    >


      {/* Verse content with reference - all in one block */}
      <Box
        sx={{
          // Dynamic scroll area height based on content length
          maxHeight: verseContent && verseContent.length > 200 ? { xs: '180px', sm: '120px' } : verseContent && verseContent.length > 100 ? { xs: '120px', sm: '80px' } : { xs: '90px', sm: '60px' },
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
          "{verseContent}" — {verseReference || verseRange} ({versionName.toUpperCase()})
        </Typography>
      </Box>
    </Box>
  );
}