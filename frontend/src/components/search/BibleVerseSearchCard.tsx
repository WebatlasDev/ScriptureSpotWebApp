'use client';

import { Box, Typography, Chip, Card, CardContent } from '@mui/material';
import { MenuBook as MenuBookIcon, ArrowForward as ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { SearchEntry } from './BaseSearchCard';
import { SearchResultSnippet } from '@/components/ui/HighlightedText';
import { createSmartSearchSnippet } from '@/utils/htmlSanitizer';
import { slugToBookName } from '@/utils/stringHelpers';
import { useState } from 'react';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';

interface BibleVerseSearchCardProps {
  entry: SearchEntry;
  searchTerms: string[];
}

export default function BibleVerseSearchCard({ entry, searchTerms }: BibleVerseSearchCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  
  // Parse the verse reference to build the URL
  // Format: "BookName Chapter:Verse" -> /asv/book-slug/chapter/verse
  const parseVerseReference = (reference: string) => {
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const [, bookName, chapter, verse] = match;
      const bookSlug = bookName.toLowerCase().replace(/\s+/g, '-');
      const displayName = slugToBookName(bookSlug);
      return { bookSlug, chapter, verse, displayName };
    }
    return null;
  };

  const parsed = parseVerseReference(entry.reference);
  const version = typeof window !== 'undefined'
    ? getLastVersion()
    : env.defaultVersion;
  const verseLink = parsed ? `/${version}/${parsed.bookSlug}/${parsed.chapter}/${parsed.verse}` : '#';

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!parsed) {
      return;
    }
    
    
    // Navigate directly to the verse page
    window.location.href = verseLink;
  };

  const headerContent = (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Verse Reference */}
      <Box sx={{ flex: 1 }}>
        <Typography
          sx={{
            color: '#FFFAFA',
            fontSize: '1.125rem',
            fontWeight: 400,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
            mb: 0.5
          }}
        >
          {parsed?.displayName ? (
            <>
              <SearchResultSnippet
                text={parsed.displayName}
                searchTerms={searchTerms}
                maxLength={80}
                showEllipsis={false}
                highlightSx={{
                  backgroundColor: 'rgba(255, 215, 0, 0.25)',
                  color: 'inherit'
                }}
              />
              <Box component="span" sx={{ fontWeight: 900 }}>
                {` ${parsed.chapter}:${parsed.verse}`}
              </Box>
            </>
          ) : (
            <SearchResultSnippet
              text={entry.reference}
              searchTerms={searchTerms}
              maxLength={80}
              showEllipsis={false}
              highlightSx={{
                backgroundColor: 'rgba(255, 215, 0, 0.25)',
                color: 'inherit'
              }}
            />
          )}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Box onClick={handleClick} style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          p: 2.5,
          width: '100%',
          height: '228px',
          borderRadius: 3.5,
          border: '2px solid rgba(255, 255, 255, 0.1)',
          background: '#1a1a1a',
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
        
        {/* Content - show verse with search highlighting and fade effects */}
        <Box sx={{ flex: '1 1 auto', mb: 0, overflow: 'hidden', minHeight: 0, position: 'relative' }}>
          {(() => {
            const smartSnippet = createSmartSearchSnippet(entry.text || '', searchTerms, 400);
            const fadeColor = '#1a1a1a'; // Use the card's background color for fading
            
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
              color: '#FFD700',
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