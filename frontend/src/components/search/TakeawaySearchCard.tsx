'use client';

import { Box, Typography } from '@mui/material';
import { WbSunnyOutlined as WbSunnyOutlinedIcon, ArrowForward as ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { useState } from 'react';
import { SearchEntry } from './BaseSearchCard';
import { SearchResultSnippet } from '@/components/ui/HighlightedText';
import { createSmartSearchSnippet } from '@/utils/htmlSanitizer';



interface TakeawaySearchCardProps {
  entry: SearchEntry;
  searchTerms: string[];
}

export default function TakeawaySearchCard({ entry, searchTerms }: TakeawaySearchCardProps) {
  let verseRef = '';
  if (entry.bookName && entry.chapterNumber && entry.verseNumber) {
    verseRef = `${entry.bookName} ${entry.chapterNumber}:${entry.verseNumber}`;
  } else {
    verseRef = entry.reference;
  }

  // Parse the slug to get the takeaway URL structure
  const slugParts = entry.slug?.split('/') || [];
  const bookSlug = slugParts[2] || '';
  const chapter = slugParts[3] || '';
  const verse = slugParts[4] || '';
  
  // Build the direct takeaway link using the dedicated takeaway page structure
  const takeawayLink = `/commentators/verse-takeaways/commentaries/${bookSlug}/${chapter}/${verse}`;
  

  const headerContent = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Icon section - matching commentary card sizing exactly */}
      <Box sx={{ position: 'relative', width: 28.5, height: 28.5 }}>
        <Box
          sx={{
            width: 28.5,
            height: 28.5,
            borderRadius: '50%',
            background: 'linear-gradient(45deg, #ED27FF 0%, #164880 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          <WbSunnyOutlinedIcon 
            sx={{ 
              color: 'white', 
              fontSize: 18 
            }} 
          />
        </Box>
      </Box>

      {/* Takeaway text and verse reference */}
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: '0.875rem',
          fontWeight: 500,
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          flex: 1
        }}
      >
        Takeaway for{' '}
        <Box 
          component="span" 
          sx={{ 
            fontWeight: 700,
            color: '#FFFAFA'
          }}
        >
          <SearchResultSnippet
            text={verseRef}
            searchTerms={searchTerms}
            maxLength={80}
            showEllipsis={false}
            highlightSx={{
              backgroundColor: 'rgba(255, 215, 0, 0.25)',
              color: 'inherit'
            }}
          />
        </Box>
      </Typography>
    </Box>
  );

  // We need to create a custom card here instead of using BaseSearchCard 
  // to match CommentatorConsensusCard exactly
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate required parts exist
    if (!bookSlug || !chapter || !verse) {
      return;
    }
    
    
    // Navigate directly to the takeaway page
    window.location.href = takeawayLink;
  };

  return (
    <Box onClick={handleClick} style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: 2.5,
          width: '100%',
          height: '296px', // 30% taller than 228px
          borderRadius: 3.5,
          border: '2px solid rgba(237, 39, 255, 0.20)',
          background: '#1B0C26',
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: isHovered ? '0px 8px 16px rgba(0, 0, 0, 0.3)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
          // Shimmer effect on hover (desktop only)
          '&::before': isHovered ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
            animation: 'shimmer 1.5s infinite',
            zIndex: 1,
            '@media (max-width: 768px)': {
              display: 'none', // Disable shimmer on mobile
            },
          } : {},
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' }
          },
        }}
      >
        {/* Header */}
        <Box sx={{ mb: 2 }}>
          {headerContent}
        </Box>
        
        {/* Content - show takeaway with search highlighting and fade effects */}
        <Box sx={{ flex: '1 1 auto', mb: 0, overflow: 'hidden', minHeight: 0, position: 'relative' }}>
          {(() => {
            const smartSnippet = createSmartSearchSnippet(entry.text || '', searchTerms, 400);
            const fadeColor = '#1B0C26'; // Use the card's background color for fading
            
            return (
              <>
                <Box
                  sx={{
                    color: '#FFFAFA',
                    lineHeight: 1.5,
                    fontSize: '16px',
                    paddingBottom: '30px', // Space for read button area
                    '& p': { mb: 1, '&:last-child': { mb: 0 } },
                    '& strong, & b': { fontWeight: 600 },
                    '& em, & i': { fontStyle: 'italic' },
                    '& mark': {
                      backgroundColor: '#FFD700 !important',
                      color: '#000000 !important',
                      fontWeight: '700 !important',
                      borderRadius: '3px',
                      padding: '2px 4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    },
                  }}
                  dangerouslySetInnerHTML={{
                    __html: smartSnippet.highlightedHtml
                  }}
                />
                
                {/* Static fade overlay positioned above read button */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40px', // Fixed height to cover read button area
                    background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 60%, ${fadeColor} 100%)`,
                    pointerEvents: 'none',
                    zIndex: 1,
                  }}
                />
              </>
            );
          })()}
        </Box>
        
        {/* Read button */}
        <Box
            sx={{
              alignSelf: 'flex-start',
              position: 'relative',
              cursor: 'pointer',
              color: '#F4BFFF',
              height: '20px',
              width: isHovered ? '60px' : '20px',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
              mt: '-0.5em', // Pull the button up slightly to close the gap
              zIndex: 2, // Ensure button appears above fade effect
            }}
          >
            <Typography
              sx={{
                position: 'absolute',
                left: '0px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 13,
                fontWeight: 600,
                letterSpacing: '0.8px',
                opacity: isHovered ? 1 : 0,
                transition: 'opacity 0.3s ease',
                whiteSpace: 'nowrap',
              }}
            >
              READ
            </Typography>
            <ArrowForwardIcon
              sx={{
                position: 'absolute',
                right: '0px',
                top: '50%',
                transform: 'translateY(-50%)',
                fontSize: 16,
                color: 'inherit',
                transition: 'right 0.3s ease',
              }}
            />
          </Box>
      </Box>
    </Box>
  );
}