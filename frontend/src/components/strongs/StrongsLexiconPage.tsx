'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { useParams } from 'next/navigation';
import { interlinearThemes } from '@/styles/interlinearThemes';
import { useExplorationLexiconEntry } from '@/hooks/useExplorationLexiconEntry';
import { useStrongsVerseReferences } from '@/hooks/useStrongsVerseReferences';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import { useCreateBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { toast } from 'react-toastify';
import dynamic from 'next/dynamic';
import StrongsHeader from '@/components/strongs/StrongsHeader';
import { extractStrongsKeywords } from '@/utils/stringHelpers';
import { resolveBookmarkId } from '@/utils/bookmarkUtils';
import ResponsiveAd from '@/components/ads/ResponsiveAd';

const StrongsVerseReferences = dynamic(() => import('@/components/verse/StrongsVerseReferences'), {
  ssr: false,
  loading: () => <LoadingSpinner message="Loading occurrences..." />,
});

const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';

export default function StrongsLexiconPage() {
  const params = useParams();
  const strongsNumber = params.strongsNumber as string;
  // Default to ASV for verse references (only version available in API)
  const version = 'ASV';
  
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState<boolean>(false);
  const [leftColumnHeight, setLeftColumnHeight] = useState<number | null>(null);
  const leftColumnRef = useRef<HTMLDivElement>(null);

  const { data: lexiconEntry, isLoading } = useExplorationLexiconEntry(strongsNumber);
  
  const { 
    enhancedReferences: verseReferences, 
    referencesLoading, 
    totalCount, 
    hasMore,
    loadMore 
  } = useStrongsVerseReferences(strongsNumber, version, 10);

  const strongsData = useMemo(
    () =>
      lexiconEntry
        ? {
            strongsNumber: lexiconEntry.strongsKey,
            originalWord: lexiconEntry.originalWord,
            transliteration: lexiconEntry.transliteration,
            englishWord: lexiconEntry.kjvTranslation,
            rootWord: lexiconEntry.wordOrigin,
            shortDefinition: lexiconEntry.shortDefinition,
            frequency: lexiconEntry.frequency,
            grammar: lexiconEntry.partOfSpeech,
            morphology: lexiconEntry.phoneticSpelling,
            definition: lexiconEntry.strongsDef || lexiconEntry.bdbDef,
            language: lexiconEntry.language === 'Hebrew' ? 'HEBREW' as const : 'GREEK' as const,
          }
        : null,
    [lexiconEntry]
  );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Effect to measure left column height
  useEffect(() => {
    if (leftColumnRef.current && !isMobile) {
      const resizeObserver = new ResizeObserver(() => {
        if (leftColumnRef.current) {
          setLeftColumnHeight(leftColumnRef.current.offsetHeight);
        }
      });
      resizeObserver.observe(leftColumnRef.current);
      
      // Initial measurement
      setLeftColumnHeight(leftColumnRef.current.offsetHeight);
      
      return () => resizeObserver.disconnect();
    }
  }, [strongsData, isMobile]);
  
  // User and bookmark functionality
  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();

  if (isLoading) {
    return (
      <Box sx={{ py: 4 }}>
        <LoadingSpinner message="Loading Strong's entry..." />
      </Box>
    );
  }

  if (!strongsData) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" color="error" textAlign="center">
          Strong's entry not found: {strongsNumber}
        </Typography>
      </Box>
    );
  }

  const interlinearTheme = interlinearThemes[strongsData.language];

  // Extract keywords for highlighting in verse references
  const highlightTerms = extractStrongsKeywords(
    strongsData.shortDefinition,
    strongsData.definition,
    strongsData.rootWord,
    strongsData.grammar
  );

  // Generate anchor link for sharing
  const generateShareUrl = () => {
    if (typeof window !== 'undefined') {
      return window.location.href;
    }
    return '';
  };

  // Handle share functionality
  const handleShare = async () => {
    const shareUrl = generateShareUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${strongsData.strongsNumber} - Word Study`,
          text: `Explore the Strong's Concordance entry for ${strongsData.originalWord} (${strongsData.englishWord})`,
          url: shareUrl,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopyLink(shareUrl);
        }
      }
    } else {
      handleCopyLink(shareUrl);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  // Handle bookmark functionality
  const handleBookmark = async () => {
    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    const bookmarkId = resolveBookmarkId(
      lexiconEntry?.id,
      lexiconEntry?.lexiconEntryId,
      lexiconEntry?.entryId,
    );

    if (!bookmarkId) {
      toast.error("Strong's entry ID is required for bookmarking");
      return;
    }

    try {
      if (!isBookmarked) {
        await createBookmark({
          id: bookmarkId,
          type: BookmarkType.STRONGS_CONCORDANCE,
          userId: user.id,
        });
        setIsBookmarked(true);
      }
    } catch {
      toast.error('Bookmark error');
    }
  };

  // Function to get highlighted verse text (simplified for lexicon page)
  const getHighlightedVerseText = () => {
    // This is kept for component interface compatibility
    return '';
  };

  // Generate breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: 'Strong\'s Concordance' },
    { label: strongsData.strongsNumber }
  ];

  return (
    <Box>
      {/* New StrongsHeader Component */}
      <StrongsHeader 
        strongsData={strongsData}
        breadcrumbItems={breadcrumbItems}
        onShare={handleShare}
        onBookmark={handleBookmark}
        isBookmarked={isBookmarked}
      />
      
      {/* Content Grid */}
      <Box sx={{
        display: 'grid',
        gridTemplateColumns: { xs: '1fr', lg: '2fr 1fr' },
        gap: 4,
        alignItems: 'start',
      }}>
        {/* Left Column - Definition */}
        <Box ref={leftColumnRef}>
          {/* Main definition card */}
          <Box sx={{
            background: '#1A1A1A',
            borderRadius: 4,
            p: 4,
            mb: 3,
          }}>
            <Typography sx={{ 
              color: TEXT_COLOR_SECONDARY, 
              fontSize: 14, 
              fontWeight: '600',
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Definition
            </Typography>
            <Typography sx={{ 
              color: 'white', 
              fontSize: { xs: 16, md: 18 }, 
              fontWeight: '400',
              lineHeight: 1.4,
            }}>
              {strongsData.shortDefinition}
            </Typography>
          </Box>

          {/* Mobile Ad Injection - Only on mobile */}
          {isMobile && (
            <Box sx={{ mb: 3 }}>
              <ResponsiveAd 
                slotId="STRONGS_LEXICON_MOBILE" 
                showPlaceholder={false}
              />
            </Box>
          )}

          {/* Details Card */}
          <Box sx={{
            background: '#1A1A1A',
            borderRadius: 4,
            p: 4,
            mb: 3,
          }}>
            <Typography sx={{ 
              color: TEXT_COLOR_SECONDARY, 
              fontSize: 14, 
              fontWeight: '600',
              mb: 2,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Details
            </Typography>
            
            <Box sx={{ 
              display: 'grid', 
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              gap: 2.5,
            }}>
              {/* Language */}
              <Box>
                <Typography sx={{ 
                  color: TEXT_COLOR_SECONDARY, 
                  fontSize: 14,
                  fontWeight: 500,
                  mb: 0.75,
                }}>
                  Language
                </Typography>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: 16,
                  fontWeight: 500,
                }}>
                  {strongsData.language === 'HEBREW' ? 'Hebrew' : 'Greek'}
                </Typography>
              </Box>

              {/* Grammar */}
              <Box>
                <Typography sx={{ 
                  color: TEXT_COLOR_SECONDARY, 
                  fontSize: 14,
                  fontWeight: 500,
                  mb: 0.75,
                }}>
                  Grammar
                </Typography>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: 16,
                  fontWeight: 500,
                }}>
                  {strongsData.grammar}
                </Typography>
              </Box>

              {/* Root Word */}
              <Box sx={{ gridColumn: { xs: '1', sm: '1 / -1' } }}>
                <Typography sx={{ 
                  color: TEXT_COLOR_SECONDARY, 
                  fontSize: 14,
                  fontWeight: 500,
                  mb: 0.75,
                }}>
                  Root Word
                </Typography>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: 16,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}>
                  {strongsData.rootWord}
                </Typography>
              </Box>

              {/* Morphology */}
              <Box>
                <Typography sx={{ 
                  color: TEXT_COLOR_SECONDARY, 
                  fontSize: 14,
                  fontWeight: 500,
                  mb: 0.75,
                }}>
                  Morphology
                </Typography>
                <Box sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.08)',
                  px: 1.5,
                  py: 0.75,
                  borderRadius: 1,
                  display: 'inline-block',
                }}>
                  <Typography sx={{ 
                    color: 'white', 
                    fontSize: 13,
                    fontWeight: 500,
                    fontFamily: 'monospace',
                  }}>
                    {strongsData.morphology}
                  </Typography>
                </Box>
              </Box>

              {/* Frequency */}
              <Box>
                <Typography sx={{ 
                  color: TEXT_COLOR_SECONDARY, 
                  fontSize: 14,
                  fontWeight: 500,
                  mb: 0.75,
                }}>
                  Frequency
                </Typography>
                <Typography sx={{ 
                  color: 'white', 
                  fontSize: 16,
                  fontWeight: 500,
                }}>
                  {strongsData.frequency} occurrences
                </Typography>
              </Box>
            </Box>
          </Box>

          {/* Full Definition */}
          <Box sx={{
            background: '#1A1A1A',
            borderRadius: 4,
            p: 4,
          }}>
            <Typography sx={{ 
              color: TEXT_COLOR_SECONDARY, 
              fontSize: 14,
              fontWeight: 600,
              mb: 1.5,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Strong's Definition
            </Typography>
            <Typography sx={{ 
              color: 'white', 
              fontSize: 16,
              lineHeight: 1.5,
              fontWeight: 400,
            }}>
              {strongsData.definition}
            </Typography>
          </Box>
        </Box>

        {/* Right Column - References */}
        <Box sx={{ 
          display: 'flex',
          flexDirection: 'column',
          height: leftColumnHeight ? `${leftColumnHeight}px` : 'auto',
        }}>
          <StrongsVerseReferences
            verseReferences={verseReferences}
            referencesLoading={referencesLoading}
            visibleOccurrences={0}
            setVisibleOccurrences={() => {}}
            interlinearTheme={interlinearTheme}
            getHighlightedVerseText={getHighlightedVerseText}
            isMobile={false}
            textColorSecondary={TEXT_COLOR_SECONDARY}
            strongsNumber={strongsData.strongsNumber}
            totalCount={totalCount}
            hasMore={hasMore}
            onLoadMore={loadMore}
            highlightTerms={highlightTerms}
          />
        </Box>
      </Box>

      <BookmarkPromoModal
        open={bookmarkPromoOpen}
        onClose={() => setBookmarkPromoOpen(false)}
        onUpgrade={() => {
          setBookmarkPromoOpen(false);
        }}
      />
    </Box>
  );
}