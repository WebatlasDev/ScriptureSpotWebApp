'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import Link from 'next/link';
import { useState, ReactNode } from 'react';
import { createSmartSearchSnippet } from '@/utils/htmlSanitizer';

export interface SearchEntry {
  id: string;
  slug: string;
  reference: string;
  text: string;
  authorName?: string | null;
  // Additional fields for BibleVerseTakeaway entries
  bookName?: string;
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: number;
}

interface BaseSearchCardProps {
  entry: SearchEntry;
  searchTerms: string[];
  headerContent: ReactNode;
  cardBackground?: string;
  chipTextColor?: string;
  fadeColor?: string;
}

export default function BaseSearchCard({ 
  entry, 
  searchTerms, 
  headerContent,
  cardBackground = 'linear-gradient(0deg, rgba(39, 129, 255, 0.10) 0%, rgba(39, 129, 255, 0.10) 100%), #121212',
  chipTextColor = '#96C2FF',
  fadeColor = '#121212'
}: BaseSearchCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        background: cardBackground,
        borderRadius: 3.5,
        outline: `2px rgba(39, 129, 255, 0.20) solid`,
        outlineOffset: '-2px',
        boxShadow: isHovered ? '0px 8px 16px rgba(0,0,0,0.2)' : 'none',
        transform: isHovered ? 'scale(1.01)' : 'scale(1)',
        transition: 'transform 0.2s, box-shadow 0.2s',
        height: '420px',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
        '&::before': isHovered ? {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent)',
          animation: 'shimmer 1.5s infinite',
          zIndex: 10,
        } : {},
        '@keyframes shimmer': {
          '0%': { left: '-100%' },
          '100%': { left: '100%' }
        },
      }}
    >
      <CardContent sx={{ p: 3, flex: 1, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {/* Header with dynamic content */}
        <Box sx={{ mb: 2, zIndex: 2 }}>
          {headerContent}
        </Box>
        
        {/* Content */}
        <Box sx={{ flex: 1, mb: 1, zIndex: 2, overflow: 'hidden' }}>
          {(() => {
            const smartSnippet = createSmartSearchSnippet(entry.text || '', searchTerms, 400);
            
            // Create dynamic fade styles
            const fadeStyles = {
              position: 'relative' as const,
              maxHeight: '16.3em', // Increased to allow text under the 1.8em gradient
              overflow: 'hidden' as const,
              '&::before': smartSnippet.fadeTop ? {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '1.8em', // Reduced to 60% for proper fade
                background: `linear-gradient(to bottom, ${fadeColor} 0%, transparent 100%)`,
                pointerEvents: 'none',
                zIndex: 0, // Below shimmer
              } : {},
              '&::after': smartSnippet.fadeBottom ? {
                content: '""',
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '1.8em', // Reduced to 60% for proper fade
                background: `linear-gradient(to bottom, transparent 0%, ${fadeColor} 100%)`,
                pointerEvents: 'none',
                zIndex: 0, // Below shimmer
              } : {},
            };

            return (
              <Box
                sx={{
                  color: '#FFFAFA',
                  lineHeight: 1.5,
                  fontSize: '16px',
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
                  ...fadeStyles,
                }}
                dangerouslySetInnerHTML={{
                  __html: smartSnippet.highlightedHtml
                }}
              />
            );
          })()}
        </Box>
        
        {/* Read button */}
        <Link href={entry.slug || '#'} style={{ textDecoration: 'none' }}>
          <Box
            sx={{
              alignSelf: 'flex-start',
              zIndex: 2,
              position: 'relative',
              cursor: 'pointer',
              color: chipTextColor,
              height: '20px',
              width: isHovered ? '60px' : '20px',
              transition: 'width 0.3s ease',
              overflow: 'hidden',
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
        </Link>
      </CardContent>
    </Card>
  );
}