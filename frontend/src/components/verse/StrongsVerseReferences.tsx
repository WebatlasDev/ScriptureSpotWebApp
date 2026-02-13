'use client';

import React, { useMemo } from 'react';
import { Box, Typography, Button, IconButton } from '@mui/material';
import Link from 'next/link';
import { OpenInNewIcon } from '@/components/ui/phosphor-icons';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HighlightedText from '@/components/ui/HighlightedText';

import { buildUrl } from '@/utils/navigation';

interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  bookSlug?: string;
  verseContent?: string; // Actual Bible verse text
}

interface Props {
  verseReferences?: VerseReference[];
  referencesLoading: boolean;
  visibleOccurrences: number;
  setVisibleOccurrences: React.Dispatch<React.SetStateAction<number>>;
  interlinearTheme: { strongsColor: string };
  getHighlightedVerseText: (
    book: string,
    chapter: number,
    verse: number,
    fallbackText: string
  ) => React.ReactNode;
  isMobile: boolean;
  textColorSecondary: string;
  strongsNumber: string;
  referencesScrollRef?: React.RefObject<HTMLDivElement | null>;
  handleScroll?: (type: 'references') => void;
  referencesCanScroll?: boolean;
  referencesScrolledToBottom?: boolean;
  totalCount?: number;
  hasMore?: boolean;
  onLoadMore?: () => void;
  highlightTerms?: string[];
}

export default function StrongsVerseReferences({
  verseReferences,
  referencesLoading,
  visibleOccurrences,
  setVisibleOccurrences,
  interlinearTheme,
  getHighlightedVerseText,
  isMobile,
  textColorSecondary,
  strongsNumber,
  referencesScrollRef,
  handleScroll,
  referencesCanScroll,
  referencesScrolledToBottom,
  totalCount,
  hasMore,
  onLoadMore,
  highlightTerms = [],
}: Props) {
  
  const references = verseReferences ?? [];
  const displayCount = totalCount ?? references.length;

  const versionSlug = useMemo(() => {
    if (typeof window === 'undefined') {
      return env.defaultVersion.toLowerCase();
    }
    const storedVersion = getLastVersion();
    return (storedVersion || env.defaultVersion).toLowerCase();
  }, []);

  
  // Debug logs removed

  const handleShowMore = () => {
    if (onLoadMore) {
      onLoadMore();
    }
    // Remove the old pagination logic since we now handle it in the hook
  };

  // Get the verse text to display - use fetched verse content or fallback
  const getVerseText = (ref: VerseReference) => {
    if (ref.verseContent) {
      return ref.verseContent;
    }
    if (ref.text) {
      return ref.text;
    }
    // Show a helpful message if no verse content is available
    return `Click to view ${ref.reference}`;
  };

  const getReferenceHref = (ref: VerseReference) => {
    const bookSlug = ref.bookSlug || ref.book.toLowerCase().replace(/\s+/g, '-');
    return buildUrl({
      version: versionSlug,
      book: bookSlug,
      chapter: ref.chapter,
      verse: ref.verse,
    });
  };

  return (
    <Box sx={{ 
      position: 'relative',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      <Typography
        sx={{
          color: textColorSecondary,
          fontSize: 14,
          fontWeight: 700,
          textTransform: 'uppercase',
          mb: 3,
          lineHeight: isMobile ? undefined : '21px',
          letterSpacing: isMobile ? undefined : '0.70px',
          flexShrink: 0,
        }}
      >
        Occurrences
      </Typography>
      <Box
        ref={isMobile ? undefined : referencesScrollRef}
        onScroll={isMobile ? undefined : (handleScroll ? () => handleScroll('references') : undefined)}
        sx={{
          flexGrow: isMobile ? 0 : 1,
          minHeight: isMobile ? 'auto' : 0, // Allow shrinking on desktop only
          overflowY: isMobile ? 'visible' : 'auto',
          contain: isMobile ? 'none' : 'layout style paint',
          // Show scrollbars on desktop, hide on mobile
          '&::-webkit-scrollbar': isMobile ? { display: 'none' } : { 
            width: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
          },
          '&::-webkit-scrollbar-thumb': isMobile ? {} : {
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
            borderRadius: '4px',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
            },
          },
          '&::-webkit-scrollbar-track': isMobile ? {} : {
            backgroundColor: 'transparent',
          },
          scrollbarWidth: isMobile ? 'none' : 'thin',
          scrollbarColor: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.3) transparent',
          msOverflowStyle: isMobile ? 'none' : 'auto',
        }}
      >
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {referencesLoading ? (
            <LoadingSpinner message="Loading occurrences..." />
          ) : references.length > 0 ? (
            <>
              {references.map((ref, index) => (
                <Box
                  key={index}
                  component={Link}
                  href={getReferenceHref(ref)}
                  sx={{
                    p: 3,
                    bgcolor: '#1a1a1a',
                    borderRadius: 2,
                    border: '2px solid rgba(255, 255, 255, 0.1)',
                    position: 'relative',
                    cursor: 'pointer',
                    textDecoration: 'none',
                    ...(!isMobile && {
                      '&:hover': {
                        bgcolor: '#252525',
                        borderColor: 'rgba(255, 255, 255, 0.25)',
                        '& .verse-link-icon': {
                          color: interlinearTheme.strongsColor,
                        },
                      },
                    }),
                  }}
                >
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Typography sx={{ color: interlinearTheme.strongsColor, fontSize: 14, fontWeight: 600 }}>
                      {ref.reference}
                    </Typography>
                    <IconButton
                      component={Link}
                      href={getReferenceHref(ref)}
                      size="small"
                      className="verse-link-icon"
                      sx={{
                        color: 'rgba(255, 255, 255, 0.6)',
                        width: 28,
                        height: 28,
                        ml: 1,
                        transition: 'color 0.15s ease',
                        ...(!isMobile && {
                          '&:hover': {
                            color: interlinearTheme.strongsColor,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                          },
                        }),
                      }}
                    >
                      <OpenInNewIcon sx={{ fontSize: 16 }} />
                    </IconButton>
                  </Box>
                  <HighlightedText
                    text={getVerseText(ref)}
                    searchTerms={highlightTerms}
                    component={Typography}
                    sx={{ color: 'white', fontSize: 16, lineHeight: 1.6 }}
                    highlightSx={{
                      backgroundColor: interlinearTheme.strongsColor,
                      color: '#000000',
                      fontWeight: 700,
                      borderRadius: '3px',
                      padding: '2px 4px',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
                    }}
                    options={{ caseSensitive: false, wholeWordsOnly: false }}
                  />
                </Box>
              ))}
              {hasMore && (
                <Button
                  onClick={handleShowMore}
                  variant={isMobile ? 'text' : 'outlined'}
                  sx={{
                    mt: 2,
                    mb: isMobile ? 10 : 0,
                    color: interlinearTheme.strongsColor,
                    borderColor: isMobile ? undefined : interlinearTheme.strongsColor,
                    textTransform: 'none',
                    fontWeight: 500,
                    py: isMobile ? undefined : 1.5,
                    '&:hover':
                      isMobile
                        ? {}
                        : {
                            borderColor: interlinearTheme.strongsColor,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                          },
                  }}
                >
                  {isMobile
                    ? `Show ${Math.min(10, displayCount - references.length)} more`
                    : `Load More (${Math.min(10, displayCount - references.length)} remaining)`}
                </Button>
              )}
            </>
          ) : (
            <Box
              sx={{
                p: isMobile ? 0 : 4,
                textAlign: isMobile ? 'left' : 'center',
                bgcolor: isMobile ? 'transparent' : 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: textColorSecondary,
                  fontSize: isMobile ? 14 : 16,
                  fontStyle: isMobile ? 'italic' : undefined,
                }}
              >
                {isMobile ? 'No occurrences found' : `No verse references found for ${strongsNumber}`}
              </Typography>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
