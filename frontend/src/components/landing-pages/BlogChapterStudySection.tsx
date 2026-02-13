'use client'

import { Box, Typography } from '@mui/material'
import { ResponsiveAd } from '../ads'

interface BlogChapterStudySectionProps {
  chapterData?: any
}

export default function BlogChapterStudySection({ chapterData }: BlogChapterStudySectionProps) {
  if (!chapterData) return null

  return (
    <>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          p: { xs: 2, sm: 3 },
          borderRadius: 3.5,
          background: '#262626',
          outline: '1px solid rgba(255,255,255,0.05)',
          outlineOffset: '-1px',
        }}
      >
        <Typography component="h3" sx={{ fontSize: { xs: '1.1rem', md: '1.25rem' }, fontWeight: 600 }}>
          Chapter Study Guide
        </Typography>
        
        <Typography sx={{ mt: 1, color: 'text.secondary' }}>
          Chapter study content will be displayed here when available.
        </Typography>
      </Box>
      
      <Box sx={{ my: 4 }}>
        <ResponsiveAd slotId="CONTENT_RESPONSIVE" showPlaceholder />
      </Box>
    </>
  )
}