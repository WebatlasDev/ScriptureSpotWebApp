'use client';

import React, { useState } from 'react';
import { Box, Typography, CircularProgress } from '@mui/material';
import Link from 'next/link';
import { useBibleVerseRange } from '@/hooks/useBibleVerseRange';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import useResponsive from '@/hooks/useResponsive';

import { buildUrl } from '@/utils/navigation';

// Design constants
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';

interface ParsedVerse {
  number: string;
  text: string;
}

interface ChapterContentProps {
  verses: Array<{
    verseNumber: number;
    content: string;
  }>;
  reference: string;
  version: string;
  bookSlug: string;
  chapterNumber: number;
  initialVerseRange?: any;
}

export default function ChapterContent({ 
  verses, 
  reference, 
  version, 
  bookSlug, 
  chapterNumber,
  initialVerseRange,
}: ChapterContentProps) {
  const { isMdDown } = useResponsive();
  const [loadingVerseNumber, setLoadingVerseNumber] = useState<number | null>(null);

  const verseRange = verses.length > 1 ? `1-${verses.length}` : verses.length === 1 ? '1' : '';
  
  const { data: verseRangeData, isLoading: isVerseLoading } = useBibleVerseRange(
    bookSlug,
    chapterNumber,
    verseRange,
    version.toUpperCase(),
    { initialData: initialVerseRange }
  );
  
  const enhancedVerseContent = verseRangeData?.content || '';

  const parseVersesForGrid = (): ParsedVerse[] => {
    if (!enhancedVerseContent) {
      return [];
    }
    
    const verseRegex = /<sup>(\d+)<\/sup>([\s\S]*?)(?=<sup>|$)/g;
    const parsedVerses: ParsedVerse[] = [];
    let match;

    while ((match = verseRegex.exec(enhancedVerseContent)) !== null) {
      const verseNumber = match[1];
      const verseText = match[2].trim();

      if (verseNumber && verseText) {
        parsedVerses.push({
          number: verseNumber,
          text: verseText,
        });
      }
    }
    
    return parsedVerses;
  };

  const MobileVerseCard = ({ verse }: { verse: ParsedVerse }) => {
    const verseNumber = parseInt(verse.number);
    const verseHref = buildUrl({
      version,
      book: bookSlug,
      chapter: chapterNumber,
      verse: verseNumber,
    });
    const isLoading = loadingVerseNumber === verseNumber;
    const isDimmed = loadingVerseNumber !== null && !isLoading;
    const isAnyVerseLoading = loadingVerseNumber !== null;

    return (
      <Box
        component={Link}
        href={verseHref}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          p: 3,
          mb: 2,
          position: 'relative',
          display: 'block',
          width: '100%',
          pointerEvents: isAnyVerseLoading ? 'none' : 'auto',
          opacity: isDimmed ? 0.45 : 1,
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:active': {
            transform: 'scale(0.98)',
            backgroundColor: 'rgba(255, 255, 255, 0.08)',
          },
          textDecoration: 'none',
        }}
        onClick={() => setLoadingVerseNumber(verseNumber)}
      >
        {isLoading && (
          <Box
            sx={{
              position: 'absolute',
              inset: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(17, 17, 17, 0.7)',
              borderRadius: 'inherit',
              zIndex: 2,
            }}
          >
            <CircularProgress size={24} sx={{ color: '#E7D000' }} />
          </Box>
        )}
        <Typography
          sx={{
            fontSize: 12,
            fontWeight: 600,
            color: TEXT_COLOR_SECONDARY,
            mb: 1,
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
          }}
        >
          Verse {verse.number}
        </Typography>
        
        <Typography
          sx={{
            color: TEXT_COLOR_PRIMARY,
            fontSize: 16,
            fontWeight: 400,
            lineHeight: '24px',
            pr: 4,
          }}
        >
          {verse.text}
        </Typography>
        
        <ArrowForwardIcon
          sx={{
            position: 'absolute',
            bottom: 12,
            right: 12,
            fontSize: 16,
            color: 'rgba(255, 255, 255, 0.5)',
          }}
        />
      </Box>
    );
  };

  // VerseRow component with the new "reveal from baseline" hover effect.
  const VerseRow = ({ verse }: { verse: ParsedVerse }) => {
    const verseNumber = parseInt(verse.number);
    const verseHref = buildUrl({
      version,
      book: bookSlug,
      chapter: chapterNumber,
      verse: verseNumber,
    });
    const isLoading = loadingVerseNumber === verseNumber;
    const isDimmed = loadingVerseNumber !== null && !isLoading;
    const isAnyVerseLoading = loadingVerseNumber !== null;

    return (
      <Link
        key={verse.number}
        href={verseHref}
        onClick={() => setLoadingVerseNumber(verseNumber)}
        style={{
          display: 'contents',
          textDecoration: 'none',
          pointerEvents: isAnyVerseLoading ? 'none' : 'auto',
          opacity: isDimmed ? 0.4 : 1,
        }}
      >
        {/* Verse Number Column */}
        <Box
          sx={{
            fontSize: '12px',
            fontWeight: 600,
            color: TEXT_COLOR_SECONDARY,
            opacity: isDimmed ? 0.5 : 1,
            textAlign: 'right',
            pr: 1,
            pt: '2px',
            minWidth: '24px',
            userSelect: 'none',
            transition: 'color 0.3s ease-in-out',
            '@media (hover: hover)': {
              '&:has(+ .verse-text-container:hover)': {
                color: '#FFD700',
              }
            }
          }}
        >
          {verse.number}
        </Box>
        
        {/* Verse Text Container */}
        <Box
          className="verse-text-container"
          sx={{
            mb: 1.5,
            position: 'relative',
            px: '6px', 
            pointerEvents: isAnyVerseLoading ? 'none' : 'auto',
            opacity: isDimmed ? 0.45 : 1,
            '@media (hover: hover)': {
              '&:hover .hover-background': {
                opacity: 1,
                transform: 'scaleY(1)', 
              },
              
              '&:hover .arrow-icon': {
                opacity: 1,
                transform: 'translateX(4px)',
              }
            }
          }}
        >
          {/* Hover background with the new animation */}
          <Box
            className="hover-background"
            sx={{
              position: 'absolute',
              top: '-6px',
              left: '-6px',
              right: '-6px',
              bottom: '-6px',
              backgroundColor: 'rgba(255, 215, 0, 0.15)',
              borderRadius: '8px',
              opacity: 0,
              transform: 'scaleY(0)', 
              transformOrigin: 'bottom', 
              transition: 'all 0.2s ease-out',
              zIndex: 0,
            }}
          />
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                top: '-6px',
                left: '-6px',
                right: '-6px',
                bottom: '-6px',
                borderRadius: '8px',
                backgroundColor: 'rgba(17, 17, 17, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 2,
              }}
            >
              <CircularProgress size={18} sx={{ color: '#E7D000' }} />
            </Box>
          )}
          {/* Verse Text content */}
          <Typography
            className="verse-text"
            sx={{
              fontSize: 18,
              fontWeight: 400,
              lineHeight: '27px',
              color: TEXT_COLOR_PRIMARY,
              display: 'inline',
              position: 'relative',
              zIndex: 1,
              transition: 'color 0.2s ease-out',
            }}
          >
            {verse.text}
            <Box
              className="arrow-icon"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.25,
                ml: 0.4,
                opacity: 0,
                transform: 'translateX(0)',
                transition: 'all 0.15s ease-out',
              }}
            >
              <Typography
                sx={{
                  fontSize: 10,
                  fontWeight: 600,
                  color: 'rgb(231, 208, 0)',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                }}
              >
                EXPLORE
              </Typography>
              <ArrowForwardIcon
                sx={{
                  fontSize: 12,
                  color: 'rgb(231, 208, 0)',
                }}
              />
            </Box>
          </Typography>
        </Box>
    </Link>
  );
  };


  return (
    <Box
      sx={{
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 3.5,
        p: { xs: 3, sm: 4, md: 4 },
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ width: '100%', pb: 2 }}>
        {isVerseLoading ? (
          <Typography sx={{ color: TEXT_COLOR_SECONDARY, textAlign: 'center', py: 4 }}>
            Loading chapter content...
          </Typography>
        ) : enhancedVerseContent ? (
          isMdDown ? (
            <Box>
              {parseVersesForGrid().map((verse) => (
                <MobileVerseCard key={verse.number} verse={verse} />
              ))}
            </Box>
          ) : (
            <Box
              sx={{
                display: 'grid',
                gridTemplateColumns: 'auto 1fr',
                gap: '12px',
                alignItems: 'start',
              }}
            >
              {parseVersesForGrid().map((verse) => (
                <VerseRow key={verse.number} verse={verse} />
              ))}
            </Box>
          )
        ) : (
          <Typography sx={{ color: TEXT_COLOR_SECONDARY, textAlign: 'center', py: 4 }}>
            No content available for this chapter.
          </Typography>
        )}
      </Box>

      <Box
        sx={{
          mt: 3,
          pt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Typography
          sx={{
            color: TEXT_COLOR_SECONDARY,
            fontSize: 14,
            fontWeight: 500,
            textAlign: 'center',
          }}
        >
          {reference} ({version.toUpperCase()})
        </Typography>
        <Typography
          sx={{
            color: TEXT_COLOR_SECONDARY,
            fontSize: 12,
            fontWeight: 400,
            textAlign: 'center',
            mt: 1,
            opacity: 0.7,
          }}
        >
          Click verse numbers to view individual verses with commentary
        </Typography>
        
        <Box sx={{ textAlign: 'center', mt: 1.5 }}>
          <Link
            href={`${buildUrl({ version, book: bookSlug, chapter: chapterNumber })}/interlinear`}
            style={{ textDecoration: 'none' }}
          >
            <Typography
              sx={{
                color: '#E2B64B',
                fontSize: 12,
                fontWeight: 500,
                cursor: 'pointer',
                transition: 'color 0.2s ease',
                '&:hover': {
                  color: '#F9D849',
                  textDecoration: 'underline'
                }
              }}
            >
              View interlinear text with original Hebrew/Greek →
            </Typography>
          </Link>
        </Box>
      </Box>
    </Box>
  );
}
