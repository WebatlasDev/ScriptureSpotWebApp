'use client';
import { Box, Button, Typography } from '@mui/material';
import Link from 'next/link';

export default function LoginPrompt() {
  return (
    <Box sx={{ textAlign: 'center', py: 6 }}>
      <Typography variant="h6" color="text.primary" sx={{ mb: 2 }}>
        Create an account or login to save and view bookmarks.
      </Typography>
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button
          component={Link}
          href="/login"
          variant="contained"
          color="secondary"
          sx={{ textTransform: 'none' }}
        >
          Login To View Bookmarks
        </Button>
      </Box>
    </Box>
  );
}
