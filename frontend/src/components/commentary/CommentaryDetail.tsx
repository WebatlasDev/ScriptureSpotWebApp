'use client';

import { Box, Typography, Button, Chip, Divider } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface CommentaryDetailProps {
  commentary: any;
  isModal?: boolean;
  book: string;
  version: string;
  chapter: string;
}

export default function CommentaryDetail({ commentary, isModal = false }: CommentaryDetailProps) {
  const router = useRouter();
  const [fontSize, setFontSize] = useState('normal');

  const handleClose = () => {
    if (isModal) {
      router.back();
    } else {
      router.push(`/verse/${commentary.reference.toLowerCase().replace(/[ :]/g, '-')}`);
    }
  };

  const handleFontSizeChange = (size: string) => {
    setFontSize(size);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        background: '#121212',
        overflow: 'hidden',
        borderRadius: isModal ? 0 : 4.5,
        display: 'flex',
        flexDirection: { xs: 'column', md: 'row' },
      }}
    >
      <Box
        sx={{
          width: { xs: '100%', md: 277 },
          minWidth: { xs: 'auto', md: 277 },
          padding: 3.75,
          background: commentary.author?.colorScheme?.gradient || 'linear-gradient(0deg, rgba(233, 36, 154, 0.10) 0%, rgba(233, 36, 154, 0.10) 100%), #121212',
          borderRight: '1px solid rgba(255,255,255,0.05)',
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Box
            sx={{
              width: 177,
              height: 137,
              background: '#D9D9D9',
              marginBottom: 2,
              borderRadius: 1,
            }}
          />
          <Box
            sx={{
              width: '100%',
              height: 97,
              background: `linear-gradient(39deg, black 0%, ${commentary.author?.colorScheme?.primary || '#E9249A'} 100%)`,
              borderTopLeftRadius: 4.5,
              borderTopRightRadius: 4.5,
              borderBottomRightRadius: 0.5,
              borderBottomLeftRadius: 0.5,
            }}
          />
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
          <Typography
            sx={{
              color: '#FAFAFA',
              fontSize: 34,
              fontFamily: 'Inter',
              fontWeight: 700,
            }}
          >
            {commentary.author?.name || 'Author Name'}
          </Typography>          
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.60)',
              fontSize: 20,
              fontFamily: 'Inter',
              fontWeight: 500,
            }}
          >
            {commentary.author?.nicknameOrTitle || 'Pastor and Commentator'}
          </Typography>
        </Box>
        <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.60)',
              fontSize: 12,
              fontFamily: 'Inter',
              fontWeight: 700,
            }}
          >
            SOURCE
          </Typography>          
          <Typography
            sx={{
              color: 'white',
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: 500,
            }}
          >
            {commentary.source || 'Commentary Source'}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.25 }}>
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.60)',
              fontSize: 12,
              fontFamily: 'Inter',
              fontWeight: 700,
            }}
          >
            TAGS
          </Typography>          
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 1,
            }}
          >
            {commentary.tags?.map((tag: string) => (
              <Chip
                key={tag}
                label={tag}
                sx={{
                  background: commentary.author?.colors?.chipBackground || 'rgba(233, 36, 154, 0.20)',
                  color: commentary.author?.colors?.chipText || '#FF72C6',
                  fontSize: 14,
                  fontWeight: 500,
                  borderRadius: 1.25,
                }}
              />
            ))}
          </Box>
        </Box>
        <Link 
          href={`/commentators/${commentary.author.slug}`} 
          passHref 
          style={{ textDecoration: 'none', marginTop: 'auto' }}
        >
          <Button
            fullWidth
            sx={{
              padding: '8px 0',
              background: 'rgba(255, 255, 255, 0.10)',
              borderRadius: 1.25,
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1,
              color: 'white',
              transition: 'background 0.2s',
              '&:hover': {
                background: 'rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <Typography
              sx={{
                textAlign: 'center',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: 500,
              }}
            >
              View Author
            </Typography>
            <Box
              sx={{
                width: 13,
                height: 13,
                background: 'white',
                clipPath: 'polygon(0% 0%, 75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%)'
              }}
            />
          </Button>
        </Link>
      </Box>
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          maxHeight: isModal ? '80vh' : 'none',
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            padding: 3.75,
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            borderBottom: '1px solid rgba(255,255,255,0.05)',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 3.75,
              }}
            >
              <Box
                sx={{
                  width: 20,
                  height: 18,
                  background: commentary.author?.colors?.primary || '#FF4FB0',
                  border: `2px ${commentary.author?.colors?.primary || '#FF4FB0'}90 solid`,
                }}
              />
              
              <Box
                sx={{
                  width: 14,
                  height: 18,
                  background: '#DCA647',
                }}
              />
            </Box>
            
            {/* Font size controls */}
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                size="small"
                onClick={() => handleFontSizeChange('small')}
                sx={{ color: fontSize === 'small' ? 'primary.main' : 'text.secondary', minWidth: 'auto' }}
              >
                A-
              </Button>
              <Button 
                size="small"
                onClick={() => handleFontSizeChange('normal')}
                sx={{ color: fontSize === 'normal' ? 'primary.main' : 'text.secondary', minWidth: 'auto' }}
              >
                A
              </Button>
              <Button 
                size="small"
                onClick={() => handleFontSizeChange('large')}
                sx={{ color: fontSize === 'large' ? 'primary.main' : 'text.secondary', minWidth: 'auto' }}
              >
                A+
              </Button>
            </Box>
          </Box>
          
          {/* Commentary title */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 1.5,
            }}
          >
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.60)',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: 500,
                lineHeight: '24px',
              }}
            >
              Commentary On <strong>{commentary.reference}</strong> by {commentary.author?.name || 'Author'}
            </Typography>
          </Box>
          
          {/* Divider */}
          <Divider sx={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }} />
          
          {/* Back link */}
          <Button
            onClick={handleClose}
            sx={{
              justifyContent: 'flex-start',
              color: 'rgba(255, 255, 255, 0.60)',
              fontSize: 16,
              fontFamily: 'Inter',
              fontWeight: 400,
              lineHeight: '24px',
              '&:hover': {
                background: 'transparent',
                color: 'white',
              },
            }}
            startIcon={
              <Box
                sx={{
                  width: 6,
                  height: 11,
                  transform: 'rotate(-180deg)',
                  background: 'rgba(255, 255, 255, 0.60)',
                }}
              />
            }
          >
            Back To Commentary
          </Button>
          
          {/* Bible verse */}
          <Typography
            sx={{
              color: 'white',
              fontSize: 20,
              fontFamily: 'Inter',
              fontWeight: 400,
              lineHeight: '30px',
              padding: 2,
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 2,
              borderLeft: '4px solid rgba(255,255,255,0.1)',
            }}
          >
            <sup style={{ fontWeight: 700 }}>23</sup> "The virgin will conceive and give birth to a son, and they will call him Immanuel" (which means "God with us").
            <br/>
            <sup style={{ fontWeight: 700 }}>24</sup> When Joseph woke up, he did what the angel of the Lord had commanded him and took Mary home as his wife.
            <br/>
            <sup style={{ fontWeight: 700 }}>25</sup> But he did not consummate their marriage until she gave birth to a son.
          </Typography>
        </Box>
        
        {/* Commentary content */}
        <Box
          sx={{
            padding: 3.75,
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Typography
            sx={{
              color: 'white',
              fontSize: fontSize === 'small' ? 16 : fontSize === 'large' ? 24 : 20,
              fontFamily: 'Inter',
              fontWeight: 400,
              lineHeight: fontSize === 'small' ? 1.6 : fontSize === 'large' ? 1.8 : 1.7,
              marginBottom: 4,
            }}
          >
            {commentary.text || 'Commentary text goes here.'}
            
            {/* Extended commentary for demonstration */}
            <br/><br/>
            The prophecy contained in Isaiah 7:14 finds its perfect fulfillment in the birth of Jesus Christ. While the immediate context of Isaiah's prophecy may have had an initial fulfillment in his time, the Gospel writer Matthew, under the inspiration of the Holy Spirit, applies it definitively to the virgin birth of Jesus.
            <br/><br/>
            The name "Immanuel," meaning "God with us," encapsulates the mystery and glory of the incarnation. In Jesus, God did not merely send a representative but came Himself to dwell among His people. The eternal Word became flesh and made His dwelling among us (John 1:14).
            <br/><br/>
            Joseph's obedience is also noteworthy. Upon receiving divine instruction through the angel, he immediately acted in faith, taking Mary as his wife despite the social implications. His abstinence until after Jesus' birth further confirms the miraculous nature of this conception and birth.
            <br/><br/>
            This passage stands as a cornerstone of Christian faith, affirming both the deity and humanity of Christ. In Jesus, we see the perfect union of God and man, the fulfillment of ancient prophecy, and the inauguration of God's redemptive plan for humanity.
          </Typography>
          
          {/* Navigation buttons */}
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              gap: 2,
              marginTop: 'auto',
              paddingTop: 4,
              borderTop: '1px solid rgba(255,255,255,0.05)',
            }}
          >
            <Button
              variant="contained"
              sx={{
                flex: 1,
                padding: '10px 0',
                background: 'rgba(255, 255, 255, 0.10)',
                borderRadius: 1.25,
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              Previous Commentary
            </Button>
            
            <Button
              variant="contained"
              sx={{
                flex: 1,
                padding: '10px 0',
                background: 'rgba(255, 255, 255, 0.10)',
                borderRadius: 1.25,
                color: 'white',
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.15)',
                },
              }}
            >
              Next Commentary
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}