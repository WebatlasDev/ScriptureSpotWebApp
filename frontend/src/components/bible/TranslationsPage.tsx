'use client'
import { Box, Typography } from '@mui/material'
import BibleVersionGrid from './BibleVersionGrid'

export default function TranslationsPage() {
  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3.5,
          p: { xs: 3, sm: 4, md: 4 },
          mb: 4,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        <Typography
          component='h1'
          sx={{
            color: '#FFFAFA',
            fontSize: { xs: 24, sm: 26, md: 32 },
            fontWeight: 400,
            lineHeight: 1.25,
            mb: 1,
          }}
        >
          Bible{' '}
          <Box component='span' sx={{ fontWeight: 700 }}>
            Translations
          </Box>
        </Typography>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: { xs: 14, md: 16 },
            fontWeight: 400,
            lineHeight: 1.6,
            maxWidth: '800px',
          }}
        >
          Choose from different Bible translations and versions to explore Scripture
          with trusted commentaries and insights.
        </Typography>
      </Box>

      <BibleVersionGrid />
    </Box>
  )
}