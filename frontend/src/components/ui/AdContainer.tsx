'use client';

import { Box, Typography } from '@mui/material';

interface AdContainerProps {
  slotId: string;
  width: number | string;
  height: number | string;
}

export default function AdContainer({ slotId, width, height }: AdContainerProps) {
  return (
    <Box
      sx={{
        width,
        height,
        background: '#4D4D4D',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Typography sx={{ color: 'rgba(255,255,255,0.6)' }}>
        Advertisement
      </Typography>
    </Box>
  );
}