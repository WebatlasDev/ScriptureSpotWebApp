'use client'

import { Box, Typography } from '@mui/material'
import { FormatQuoteIcon } from '@/components/ui/phosphor-icons'

interface PurpleQuoteBoxProps {
  quote: string
  author?: string
}

export default function PurpleQuoteBox({ quote, author }: PurpleQuoteBoxProps) {
  return (
    <Box
      sx={{
        p: 2,
        mt: 2,
        borderRadius: 2,
        background:
          'linear-gradient(222deg,rgba(147, 53, 202, 0.7) 0%,rgba(22, 71, 128, 0.07) 100%)',
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
      }}
    >
      <Box
        sx={{
          width: 30,
          height: 30,
          background: 'linear-gradient(46deg, #ED27FF 0%, #164880 100%)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          mt: { xs: 0, sm: 0.5 },
          mb: { xs: 1, sm: 0 },
        }}
      >
        <FormatQuoteIcon sx={{ color: 'white', fontSize: 22 }} />
      </Box>
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{ fontStyle: 'italic', mb: 1, fontSize: 18, lineHeight: 1.4, color: '#FFFAFA' }}
        >
          {quote}
        </Typography>
        {author && (
          <Typography component="h6" sx={{ fontWeight: 700, fontSize: 14, color: '#FFFAFA' }}>
            {author}
          </Typography>
        )}
      </Box>
    </Box>
  )
}
