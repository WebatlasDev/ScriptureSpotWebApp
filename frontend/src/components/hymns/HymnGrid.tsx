'use client';

import { Box, Typography, Card, CardContent, CardActionArea } from '@mui/material';
import { useRouter } from 'next/navigation';

const mockHymns = [
  {
    id: 'hymn-1',
    title: 'Amazing Grace',
    author: 'John Newton',
    year: '1779',
    excerpt: 'Amazing grace, how sweet the sound, that saved a wretch like me...'
  },
  {
    id: 'hymn-2',
    title: 'Be Thou My Vision',
    author: 'Dallan Forgaill',
    year: '8th Century',
    excerpt: 'Be Thou my Vision, O Lord of my heart; Naught be all else to me, save that Thou art...'
  },
  {
    id: 'hymn-3',
    title: 'Holy, Holy, Holy',
    author: 'Reginald Heber',
    year: '1826',
    excerpt: 'Holy, holy, holy! Lord God Almighty! Early in the morning our song shall rise to Thee...'
  }
];

export default function HymnGrid({ verseReference }: { verseReference: string }) {
  const router = useRouter();
  
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: 3
      }}
    >
      {mockHymns.map(hymn => (
        <Card 
          key={hymn.id}
          sx={{ 
            width: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' },
            backgroundColor: '#1A1A1A',
            color: 'text.primary',
            borderRadius: 4,
            transition: 'transform 0.2s',
            '&:hover': {
              transform: 'translateY(-4px)',
            }
          }}
        >
          <CardActionArea onClick={() => router.push(`/hymns/${hymn.id}`)}>
            <CardContent sx={{ p: 3 }}>
              <Typography 
                variant="h5" 
                sx={{ 
                  color: 'primary.main',
                  fontWeight: 600,
                  mb: 1
                }}
              >
                {hymn.title}
              </Typography>              
              <Typography 
                sx={{ 
                  color: 'text.secondary',
                  fontSize: '0.875rem',
                  mb: 2
                }}
              >
                {hymn.author} • {hymn.year}
              </Typography>              
              <Typography sx={{ color: 'text.primary' }}>
                {hymn.excerpt}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}