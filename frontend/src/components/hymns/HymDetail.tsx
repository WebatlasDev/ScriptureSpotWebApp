'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Button, Divider } from '@mui/material';
import CrossLoader from '@/components/ui/CrossLoader';

const hymnsData = {
  'hymn-1': {
    id: 'hymn-1',
    title: 'O Come, O Come, Emmanuel',
    author: 'John Mason Neale',
    year: '1851',
    theme: 'Advent / Incarnation',
    excerpt: 'O come, O come, Emmanuel, And ransom captive Israel, That mourns in lonely exile here, Until the Son of God appear.',
    music: 'Thomas Helmore',
    scripture: 'Isaiah 7:14, Matthew 1:23',
    fullText: [
      'O come, O come, Emmanuel,',
      'And ransom captive Israel,',
      'That mourns in lonely exile here,',
      'Until the Son of God appear.',
      '',
      'Chorus:',
      'Rejoice! Rejoice! Emmanuel',
      'Shall come to thee, O Israel.',
      '',
      'O come, Thou Rod of Jesse, free',
      'Thine own from Satan\'s tyranny;',
      'From depths of hell Thy people save,',
      'And give them victory o\'er the grave.',
      '',
      'Chorus',
      '',
      'O come, Thou Dayspring, from on high,',
      'And cheer us by Thy drawing nigh;',
      'Disperse the gloomy clouds of night,',
      'And death\'s dark shadows put to flight.',
      '',
      'Chorus',
      '',
      'O come, Thou Key of David, come',
      'And open wide our heav\'nly home;',
      'Make safe the way that leads on high,',
      'And close the path to misery.',
      '',
      'Chorus',
      '',
      'O come, Adonai, Lord of might,',
      'Who to Thy tribes, on Sinai\'s height,',
      'In ancient times didst give the law',
      'In cloud and majesty and awe.',
      '',
      'Chorus'
    ],
    background: 'This hymn is a translation of a Latin hymn, "Veni, Veni, Emmanuel," which was a series of antiphons sung during Advent. The original Latin text dates back to the 12th century. John Mason Neale translated it into English in 1851. The melody is based on a 15th-century French processional and was adapted by Thomas Helmore in 1856.'
  },
};

export default function HymnPage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [hymn, setHymn] = useState<any>(null);
  
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const hymnData = hymnsData[params.id as keyof typeof hymnsData];
      setHymn(hymnData);
      setLoading(false);
    }, 500);
  }, [params.id]);
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (!hymn) {
    return (
      <Box sx={{ padding: 4, textAlign: 'center' }}>
        <Typography variant="h5" sx={{ color: 'text.secondary', mb: 2 }}>
          Hymn not found
        </Typography>
        <Button 
          onClick={() => router.push('/hymns')}
          sx={{ 
            color: '#36B71C',
            borderColor: '#36B71C',
            '&:hover': {
              borderColor: '#36B71C',
              backgroundColor: 'rgba(54, 183, 28, 0.05)'
            }
          }}
          variant="outlined"
        >
          Browse Hymns
        </Button>
      </Box>
    );
  }
  
  return (
    <Box
      sx={{
        maxWidth: 900,
        mx: 'auto',
        p: { xs: 2, md: 4 },
      }}
    >
      <Box sx={{ mb: 4 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            color: 'text.primary',
            fontWeight: 700,
            mb: 1
          }}
        >
          {hymn.title}
        </Typography>        
        <Typography 
          sx={{ 
            color: 'text.secondary',
            fontSize: { xs: '1rem', md: '1.25rem' },
            mb: 2
          }}
        >
          {hymn.author}, {hymn.year} • Music: {hymn.music}
        </Typography>        
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <Box
            sx={{
              padding: '4px 10px',
              backgroundColor: 'rgba(54, 183, 28, 0.1)',
              borderRadius: 2,
              display: 'inline-flex',
            }}
          >
            <Typography sx={{ color: '#36B71C', fontSize: '0.875rem' }}>
              {hymn.theme}
            </Typography>
          </Box>          
          <Box
            sx={{
              padding: '4px 10px',
              backgroundColor: 'rgba(54, 183, 28, 0.1)',
              borderRadius: 2,
              display: 'inline-flex',
            }}
          >
            <Typography sx={{ color: '#36B71C', fontSize: '0.875rem' }}>
              Scripture: {hymn.scripture}
            </Typography>
          </Box>
        </Box>
      </Box>      
      <Divider sx={{ mb: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
      <Box sx={{ mb: 6 }}>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#36B71C',
            mb: 3,
            fontWeight: 500
          }}
        >
          Lyrics
        </Typography>        
        <Box
          sx={{
            backgroundColor: 'rgba(54, 183, 28, 0.05)',
            padding: 3,
            borderRadius: 2,
            borderLeft: '4px solid #36B71C',
          }}
        >
          {hymn.fullText.map((line: string, index: number) => (
            <Typography 
              key={index}
              sx={{ 
                color: 'text.primary',
                fontSize: '1.1rem',
                lineHeight: 1.8,
                fontFamily: 'serif',
                mb: line === '' ? 2 : 0.5,
                fontStyle: line.includes('Chorus') ? 'italic' : 'normal',
                fontWeight: line.includes('Chorus') ? 600 : 400,
              }}
            >
              {line === '' ? ' ' : line}
            </Typography>
          ))}
        </Box>
      </Box>
      <Box>
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#36B71C',
            mb: 2,
            fontWeight: 500
          }}
        >
          Background
        </Typography>        
        <Typography
          sx={{
            color: 'text.primary',
            lineHeight: 1.7,
          }}
        >
          {hymn.background}
        </Typography>
      </Box>      
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          mt: 6,
          pt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)'
        }}
      >
        <Button
          sx={{
            color: 'text.secondary',
            '&:hover': {
              color: '#36B71C',
              backgroundColor: 'transparent'
            }
          }}
          onClick={() => router.push('/hymns')}
        >
          ← Back to Hymns
        </Button>        
        <Button
          sx={{
            backgroundColor: 'rgba(54, 183, 28, 0.1)',
            color: '#36B71C',
            padding: '8px 16px',
            borderRadius: 2,
            '&:hover': {
              backgroundColor: 'rgba(54, 183, 28, 0.2)'
            }
          }}
        >
          Add to Favorites
        </Button>
      </Box>
    </Box>
  );
}