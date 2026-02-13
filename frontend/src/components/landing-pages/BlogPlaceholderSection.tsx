'use client'

import { Box, Typography } from '@mui/material'

interface BlogPlaceholderSectionProps {
  componentType: string
}

export default function BlogPlaceholderSection({ componentType }: BlogPlaceholderSectionProps) {
  return (
    <Box sx={{ p: 2, border: '1px dashed', borderColor: 'divider' }}>
      <Typography component="h2" sx={{ fontSize: { xs: '1.4rem', md: '1.6rem' }, fontWeight: 700 }}>
        {componentType}
      </Typography>
      <Typography sx={{ mt: 1 }}>
        This component is not yet implemented.
      </Typography>
    </Box>
  )
}
