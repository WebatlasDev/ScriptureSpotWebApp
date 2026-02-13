'use client';

import { Box, Card, CardContent, Typography } from '@mui/material';
import { ArrowForward as ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import { useState } from 'react';
import { SearchEntry } from './BaseSearchCard';
import { SearchResultSnippet } from '@/components/ui/HighlightedText';
import { useAuthorByName } from '@/contexts/AuthorContext';
import { createSmartSearchSnippet } from '@/utils/htmlSanitizer';
import { slugToBookName } from '@/utils/stringHelpers';

interface CommentarySearchCardProps {
  entry: SearchEntry;
  searchTerms: string[];
}

function extractVerseReference(slug: string): string | null {
  if (!slug) return null;
  const match = slug.match(/\/commentators\/[^/]+\/commentaries\/([^/]+)\/(\d+)\/(.+)/);
  if (match) {
    const [, bookSlug, chapter, verseRange] = match;
    const bookName = slugToBookName(bookSlug);
    return `${bookName} ${chapter}:${verseRange.replace('verses-', '')}`;
  }
  return null;
}

const slugify = (text: string) => {
  return text.toString().toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
}

export default function CommentarySearchCard({ entry, searchTerms }: CommentarySearchCardProps) {
  const author = useAuthorByName(entry.authorName);
  const verseRef = extractVerseReference(entry.slug) || entry.reference;
  
  // Parse the existing slug to get the commentary URL structure
  const slugParts = entry.slug?.split('/') || [];
  const authorSlugFromPath = slugParts[2] || ''; // e.g. "expositor-s-bible-commentary"
  const bookSlug = slugParts[4] || '';
  const chapter = slugParts[5] || '';
  const versePart = slugParts[6] || '';
  
  // Build the direct commentary link using the existing URL structure
  const commentaryLink = `/commentators/${authorSlugFromPath}/commentaries/${bookSlug}/${chapter}/${versePart}`;

  // Author-specific styling
  const cardBackground = author?.colorScheme?.gradient || 
    'linear-gradient(0deg, rgba(39, 129, 255, 0.10) 0%, rgba(39, 129, 255, 0.10) 100%), #121212';
  const chipTextColor = author?.colorScheme?.chipText || '#96C2FF';
  const fadeColor = (() => {
    // First, try to use the author's specific fade color
    if (author?.colorScheme?.fadeColor) {
      return author.colorScheme.fadeColor;
    }
    
    // If we have an author gradient, extract the end color (usually dark)
    if (author?.colorScheme?.gradient) {
      // Most gradients end with black or a dark color
      if (author.colorScheme.gradient.includes('black')) return '#000000';
      if (author.colorScheme.gradient.includes('#121212')) return '#121212';
      return '#121212'; // Default fallback
    }
    
    // Default card background color
    return '#121212';
  })();

  const headerContent = entry.authorName ? (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      {/* Author Avatar */}
      <Box sx={{ position: 'relative', width: 28.5, height: 28.5 }}>
        <Box
          sx={{
            width: 28.5,
            height: 28.5,
            borderRadius: '50%',
            background: author?.colorScheme?.primary
              ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
              : 'linear-gradient(216deg, #278EFF 0%, black 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {author?.image ? (
            <Image
              src={author.image}
              alt={author.name}
              width={28.5}
              height={28.5}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center bottom'
              }}
            />
          ) : (
            <Typography
              sx={{
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 600,
                textShadow: '0 1px 2px rgba(0,0,0,0.5)'
              }}
            >
              {entry.authorName.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 2)}
            </Typography>
          )}
        </Box>
      </Box>
      
      {/* Author Name and Verse Reference */}
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
        {author?.name || entry.authorName}
        {verseRef && (
          <>
            {' on '}
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
          </>
        )}
      </Typography>
    </Box>
  ) : null;

  // Create a custom card since we need author-specific outline
  const [isHovered, setIsHovered] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // Validate required parts exist
    if (!authorSlugFromPath || !bookSlug || !chapter || !versePart) {
      return;
    }
    
    
    // Navigate directly to the commentary page
    window.location.href = commentaryLink;
  };

  return (
    <Box onClick={handleClick} style={{ textDecoration: 'none', cursor: 'pointer' }}>
      <Card
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          background: cardBackground,
          borderRadius: 3.5,
          outline: `2px ${author?.colorScheme?.outline || 'rgba(39, 129, 255, 0.20)'} solid`,
          outlineOffset: '-2px',
          boxShadow: isHovered ? '0px 8px 16px rgba(0,0,0,0.2)' : 'none',
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          height: '296px', // 30% taller than 228px
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
          {/* Header */}
          <Box sx={{ mb: 2 }}>
            {headerContent}
          </Box>
          
          {/* Content */}
          <Box sx={{ flex: 1, mb: 0, overflow: 'hidden', position: 'relative' }}>
            {(() => {
              const smartSnippet = createSmartSearchSnippet(entry.text || '', searchTerms, 400);
              
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
                color: chipTextColor,
                height: '20px',
                width: isHovered ? '60px' : '20px',
                transition: 'width 0.3s ease',
                overflow: 'hidden',
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
        </CardContent>
      </Card>
    </Box>
  );
}