import { Box, Typography } from '@mui/material';
import CrossLoader from './CrossLoader';

interface LoadingSpinnerProps {
  message?: string;
}

export default function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 2,
        padding: 4,
      }}
    >
      <CrossLoader size={40} />
      <Typography color="text.secondary">{message}</Typography>
    </Box>
  );
}