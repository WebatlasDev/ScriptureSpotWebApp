import { Box, Typography } from '@mui/material';

export default function ComingSoon({ title }: { title: string }) {
  return (
    <Box
      sx={{
        alignSelf: 'stretch',
        padding: { xs: 3, sm: 3.5, md: 4 },
        background: '#1A1A1A',
        borderRadius: { xs: 2, sm: 3, md: 4.5 },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: { xs: 1.5, sm: 2, md: 2.5 },
        display: 'flex',
      }}
    >
      <Typography
        variant="h2"
        sx={{
          marginTop: '5px',
          color: 'text.primary',
          fontSize: { xs: '1.25rem', md: '1.75rem' },
          fontWeight: 700,
        }}
      >
        {title} Coming Soon
      </Typography>
    </Box>
  );
}
