// components/verse/InterlinearDrawer.tsx
import { useState, useRef, useEffect, useCallback, useMemo, memo } from 'react';
import { Box, Typography } from '@mui/material';
import { ArrowBack, ArrowForward } from '@/components/ui/phosphor-icons';
import { SubjectIcon } from '@/components/ui/phosphor-icons';
import { interlinearThemes } from '@/styles/interlinearThemes'; // Import our themes
import { skeletonBaseSx } from '@/styles/skeletonStyles';
import dynamic from 'next/dynamic';
import { useDeferredRender } from '@/hooks/useDeferredRender';
const StrongsModal = dynamic(() => import('./StrongsModal'), { ssr: false });
import React from 'react';
import { useExplorationInterlinearVerse } from '@/hooks/useExplorationInterlinearVerse';
import { useExplorationLexiconEntry } from '@/hooks/useExplorationLexiconEntry';
import { useQueryClient } from '@tanstack/react-query';
import { Primitive } from '@radix-ui/react-primitive';
import IconActionButton from './IconActionButton';
import { hexToRgba } from '@/utils/colorUtils';

const BASE_BUTTON_COLOR = 'rgba(255, 255, 255, 0.10)';

// Define the shape of a single word's data
interface Word {
  englishWord: string;
  transliteration: string;
  strongLexiconKey: string;
  grammarCompact: string;
  grammarDetailed: string;
  punctuation?: string | null;
  wordPosition: number;
  hebrewWord: string | null;
  greekWord: string | null;
}

interface InterlinearDrawerProps {
  currentVerse: {
    book: string;
    chapter: number;
    verse: number;
    version: string;
  };
}

// Sub-component for a single word card with punctuation
const WordCard = memo(function WordCard({
  word,
  theme,
  isSelected,
  onSelect,
  language,
  index,
}: {
  word: Word;
  theme: (typeof interlinearThemes)['HEBREW'];
  isSelected: boolean;
  onSelect: (wordIndex: number) => void;
  language: 'GREEK' | 'HEBREW';
  index: number;
}) {
  const originalText = language === 'HEBREW' ? word.hebrewWord : word.greekWord;
  const isCardHebrew = language === 'HEBREW';
  const queryClient = useQueryClient();
  const queryKey = ['explorationLexiconEntry', word.strongLexiconKey] as const;
  const [shouldLoadLexicon, setShouldLoadLexicon] = useState(() => !!queryClient.getQueryData(queryKey));
  const selectedBorderColor = hexToRgba(theme.strongsColor, 0.5);
  const hoverBorderColor = hexToRgba(theme.strongsColor, 0.24);
  const baseHex = theme.card?.default?.bg ?? (isCardHebrew ? '#352E1E' : '#1F2836');
  const selectedHex = theme.card?.selected?.bg ?? (isCardHebrew ? '#6B5A2B' : '#3B4E6B');
  const hoverHex = isCardHebrew ? '#6B5A2B' : '#3B4E6B';

  const baseBackground = baseHex;
  const selectedBackground = selectedHex;
  const hoverBackground = hoverHex;
  const focusOutlineColor = hexToRgba(theme.strongsColor, 0.5);
  const innerShadow = 'inset 0 0 12px rgba(0, 0, 0, 0.28)';

  useExplorationLexiconEntry(word.strongLexiconKey, { enabled: shouldLoadLexicon });

  const ensureLexiconRequested = useCallback(() => {
    setShouldLoadLexicon(true);
  }, []);

  const handleCardClick = useCallback(() => {
    ensureLexiconRequested();
    onSelect(index);
  }, [ensureLexiconRequested, index, onSelect]);

  useEffect(() => {
    if (isSelected) {
      ensureLexiconRequested();
    }
  }, [isSelected, ensureLexiconRequested]);

  const cardElement = (
    <Box
      component={Primitive.button}
      type="button"
      onClick={handleCardClick}
      sx={{
        p: { xs: 1.75, sm: 2.25, md: 3 },
        backgroundColor: isSelected ? selectedBackground : baseBackground,
        borderRadius: { xs: 2.25, md: 3.5 },
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexShrink: 0,
        transition: 'all 0.25s ease-in-out',
        minWidth: { xs: '78px', sm: '92px', md: '110px' },
        position: 'relative',
        cursor: 'pointer',
        backdropFilter: 'blur(18px)',
        WebkitBackdropFilter: 'blur(18px)',
        border: '2px solid transparent',
        borderColor: isSelected ? selectedBorderColor : 'transparent',
        boxShadow: isSelected ? innerShadow : 'none',
        color: 'inherit',
        outline: 'none',
        '&:hover': {
          backgroundColor: hoverBackground,
          borderColor: hoverBorderColor,
          boxShadow: innerShadow,
        },
        '&:focus-visible': {
          outline: `2px solid ${focusOutlineColor}`,
          outlineOffset: '4px',
        },
        '&:active': {
          transform: 'scale(0.97)',
        },
      }}
      onMouseEnter={ensureLexiconRequested}
      onFocus={ensureLexiconRequested}
      onTouchStart={ensureLexiconRequested}
    >
      <Typography sx={{ color: 'white', fontSize: { xs: 16, md: 24 }, fontWeight: '700', pb: 0.75 }}>
        {originalText}
      </Typography>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.60)', fontSize: { xs: 13, md: 14 } }}>
        {word.transliteration}
      </Typography>
      <Typography sx={{ color: 'white', fontSize: { xs: 13, md: 15 }, fontWeight: '700', pt: 0.5 }}>
        {word.englishWord}
      </Typography>
      <Typography sx={{ color: theme.strongsColor, fontSize: { xs: 13, md: 15 }, fontWeight: '500', pt: 0.75 }}>
        {word.strongLexiconKey}
      </Typography>
    </Box>
  );

  return cardElement;
});


// Main Drawer Component
export default function InterlinearDrawer({ currentVerse }: InterlinearDrawerProps) {
  const bookSlug = currentVerse.book.toLowerCase().replace(/\s+/g, '-');
  const { data, isLoading, isFetching, isError, error } = useExplorationInterlinearVerse(
    bookSlug,
    currentVerse.chapter,
    currentVerse.verse
  );
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(-1); // Track selected word index
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedStrongsKey, setSelectedStrongsKey] = useState<string | null>(null);
  const [canScroll, setCanScroll] = useState<boolean>(true);
  const [scrolledToStart, setScrolledToStart] = useState<boolean>(false);
  const [scrolledToEnd, setScrolledToEnd] = useState<boolean>(false);
  const [strongsModalOpen, setStrongsModalOpen] = useState<boolean>(false);
  const shouldRenderStrongsModal = useDeferredRender(strongsModalOpen);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const words: Word[] = useMemo(() => data ?? [], [data]);
  const wordsLength = words.length;
  const language: 'GREEK' | 'HEBREW' = wordsLength > 0 && words[0].hebrewWord ? 'HEBREW' : 'GREEK';
  const theme = interlinearThemes[language];

  // Language-specific settings
  const isHebrew = language === 'HEBREW';
  const drawerColor = theme.drawerBg ?? (isHebrew ? '#6B5A2B' : '#131820');
  const fadeColorStart = drawerColor;
  const fadeColorTransparent = hexToRgba(drawerColor, 0);
  const direction = isHebrew ? 'rtl' : 'ltr';
  const drawerBackgroundColor = drawerColor;
  const strongsHoverColor = useMemo(() => hexToRgba(theme.strongsColor, 0.30), [theme.strongsColor]);
  const buttonBaseColor = theme.card?.default?.bg ?? BASE_BUTTON_COLOR;
  const buttonHoverColor = theme.card?.selected?.bg ?? strongsHoverColor;

  // Handle word card click to open Strong's modal
  const handleWordSelect = useCallback((wordIndex: number) => {
    const word = words[wordIndex];
    if (!word) return;
    setSelectedWordIndex(wordIndex);
    setSelectedWord(word);
    setSelectedStrongsKey(word.strongLexiconKey ?? null);
    setStrongsModalOpen(true);
  }, [words]);

  // Handle navigation to a specific word
  const handleNavigateToWord = useCallback((wordIndex: number) => {
    if (wordIndex >= 0 && wordIndex < wordsLength) {
      const word = words[wordIndex];
      if (!word) return;
      setSelectedWordIndex(wordIndex);
      setSelectedWord(word);
      setSelectedStrongsKey(word.strongLexiconKey ?? null);
      setStrongsModalOpen(true);
    }
  }, [words, wordsLength]);

  const handleCloseStrongsModal = () => {
    setStrongsModalOpen(false);
    setSelectedWordIndex(-1);
    setSelectedWord(null);
    setSelectedStrongsKey(null);
  };

  useEffect(() => {
    if (selectedWordIndex >= wordsLength) {
      setStrongsModalOpen(false);
      setSelectedWordIndex(-1);
      setSelectedWord(null);
      setSelectedStrongsKey(null);
    }
  }, [selectedWordIndex, wordsLength]);

  useEffect(() => {
    if (selectedWordIndex >= 0 && selectedWordIndex < wordsLength) {
      const word = words[selectedWordIndex];
      if (word && (selectedWord?.strongLexiconKey !== word.strongLexiconKey || selectedWord?.wordPosition !== word.wordPosition)) {
        setSelectedWord(word);
        setSelectedStrongsKey(word.strongLexiconKey ?? null);
      }
    }
  }, [selectedWordIndex, selectedWord?.strongLexiconKey, selectedWord?.wordPosition, words, wordsLength]);

  const isQueryLoading = (isLoading || isFetching) && wordsLength === 0;

  // Check scroll state with proper detection logic for both LTR and RTL
  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const canScrollHorizontally = scrollWidth > clientWidth;
      const maxScrollLeft = scrollWidth - clientWidth;

      let isAtStart: boolean;
      let isAtEnd: boolean;
      if (isHebrew) {
        // For RTL (Hebrew): start = rightmost (beginning of text), end = leftmost
        isAtStart = !canScrollHorizontally || Math.abs(scrollLeft - maxScrollLeft) < 5;
        isAtEnd = !canScrollHorizontally || Math.abs(scrollLeft) < 5;
      } else {
        // For LTR (Greek): start = leftmost, end = rightmost
        isAtStart = !canScrollHorizontally || Math.abs(scrollLeft) < 5;
        isAtEnd = !canScrollHorizontally || Math.abs(scrollLeft - maxScrollLeft) < 5;
      }

      setCanScroll(canScrollHorizontally);
      setScrolledToStart(isAtStart);
      setScrolledToEnd(isAtEnd);
    }
  }, [isHebrew]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const maxScrollLeft = scrollWidth - clientWidth;

      if (isHebrew) {
        // For RTL (Hebrew): start = rightmost (beginning of text), end = leftmost
        setScrolledToStart(Math.abs(scrollLeft - maxScrollLeft) < 5);
        setScrolledToEnd(Math.abs(scrollLeft) < 5);
      } else {
        // For LTR (Greek): start = leftmost, end = rightmost
        setScrolledToStart(Math.abs(scrollLeft) < 5);
        setScrolledToEnd(Math.abs(scrollLeft - maxScrollLeft) < 5);
      }
    }
  }, [isHebrew]);

  // Calculate items per page based on container width
  const getItemsPerPage = useCallback(() => {
    if (!scrollContainerRef.current) return 2;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const cardWidth = 118; // minWidth(100) + gap(18) approximately
    const itemsVisible = Math.floor(containerWidth / cardWidth);
    return Math.max(itemsVisible, 1);
  }, []);

  // Navigate left/right with overlap for context
  const navigateToPage = useCallback((direction: 'left' | 'right') => {
    if (!scrollContainerRef.current) return;
    
    const container = scrollContainerRef.current;
    const itemsPerPage = getItemsPerPage();
    const overlap = itemsPerPage > 2 ? 2 : 1;
    const scrollAmount = (itemsPerPage - overlap) * 118;

    const currentScrollLeft = container.scrollLeft;
    const maxScrollLeft = container.scrollWidth - container.clientWidth;
    const baseDirection = direction === 'right' ? 1 : -1;
    let newScrollLeft = currentScrollLeft + baseDirection * scrollAmount;

    newScrollLeft = Math.min(Math.max(newScrollLeft, 0), Math.max(maxScrollLeft, 0));

    container.scrollTo({
      left: newScrollLeft,
      behavior: 'smooth'
    });
  }, [getItemsPerPage]);

  // Initial check and scroll listener setup
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      checkScrollability();
      scrollContainer.addEventListener('scroll', handleScroll);
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [words, checkScrollability, handleScroll]);

  // Initialize scroll position for Hebrew (RTL)
  useEffect(() => {
    if (isHebrew && scrollContainerRef.current && words.length > 0) {
      const container = scrollContainerRef.current;
      // For RTL, scroll to the rightmost position (start of Hebrew text)
      // Set to maximum scroll position to reach rightmost edge
      container.scrollLeft = container.scrollWidth - container.clientWidth;
      requestAnimationFrame(() => checkScrollability());
    }
  }, [isHebrew, words.length, checkScrollability]);

  const skeletonContent = (
    <Box
      role="status"
      aria-live="polite"
      sx={{
        p: { xs: 2.5, md: 4 },
        backgroundColor: drawerBackgroundColor,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 3.5,
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      <Box sx={{ position: 'relative' }}>
        <Box
          sx={{
            display: 'flex',
            gap: { xs: 1.5, md: 2 },
            overflow: 'hidden',
          }}
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <Box
              key={`interlinear-card-skeleton-${index}`}
              sx={{
                ...skeletonBaseSx,
                minWidth: { xs: '78px', sm: '92px', md: '110px' },
                height: { xs: 110, md: 142 },
                borderRadius: { xs: 2.25, md: 3.5 },
              }}
            />
          ))}
        </Box>
      </Box>

      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
        <Box
          sx={{
            ...skeletonBaseSx,
            width: 156,
            height: 40,
            borderRadius: 999,
          }}
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Box
            sx={{
              ...skeletonBaseSx,
              width: 40,
              height: 40,
              borderRadius: 999,
            }}
          />
          <Box
            sx={{
              ...skeletonBaseSx,
              width: 40,
              height: 40,
              borderRadius: 999,
            }}
          />
        </Box>
      </Box>
    </Box>
  );

  const resolvedErrorMessage = error instanceof Error ? error.message : 'Interlinear data is currently unavailable. Please try again later.';

  const errorContent = (
    <Box
      sx={{
        background: '#18181B',
        borderRadius: 3,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        p: { xs: 3, md: 4 },
        mt: 3,
      }}
    >
      <Typography sx={{ color: 'white', fontSize: { xs: 18, md: 20 }, fontWeight: 600, mb: 1 }}>
        Interlinear Data Unavailable
      </Typography>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.65)', fontSize: { xs: 14, md: 16 }, lineHeight: 1.6 }}>
        {resolvedErrorMessage}
      </Typography>
    </Box>
  );

  const emptyStateContent = (
    <Box sx={{ p: 2, color: 'white' }}>No interlinear data available.</Box>
  );

  if (isQueryLoading) {
    return skeletonContent;
  }

  if (isError) {
    return errorContent;
  }

  if (!wordsLength) {
    return emptyStateContent;
  }
  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 4 },
        backgroundColor: drawerBackgroundColor,
        backgroundImage: 'none',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderRadius: 3.5,
        position: 'relative',
        overflow: 'hidden',
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        display: 'flex',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Horizontally Scrolling Word List */}
      <Box sx={{ position: 'relative', overflow: 'visible' }}>
        <Box
          ref={scrollContainerRef}
          sx={{
            overflowX: 'auto',
            overflowY: 'visible',
            pb: 1,
            minWidth: 0,
            '&::-webkit-scrollbar': {
              height: 6,
              '&:hover': { height: 8 }
            },
            '&::-webkit-scrollbar-track': {
              background: 'rgba(255,255,255,0.05)',
              borderRadius: 3,
            },
            '&::-webkit-scrollbar-thumb': {
              background: 'rgba(255,255,255,0.2)',
              borderRadius: 3,
              '&:hover': {
                background: 'rgba(255,255,255,0.3)',
              }
            }
          }}
        >
          <Box
            sx={{
              display: 'flex',
              direction: direction,
              gap: { xs: 1.5, md: 2 },
              minWidth: 'fit-content',
              overflow: 'visible',
            }}
          >
          {words.map((word, index) => {
            const fragmentKey = `${word.strongLexiconKey}-${word.wordPosition}-${index}`;
            return (
              <React.Fragment key={fragmentKey}>
                <WordCard
                  word={word}
                  theme={theme}
                  language={language}
                  isSelected={selectedWordIndex === index}
                  onSelect={handleWordSelect}
                  index={index}
                />
                {word.punctuation && (
                  <Box
                    key={`punctuation-${fragmentKey}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      minWidth: 'auto',
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: { xs: 20, md: 28 },
                        fontWeight: '700',
                        lineHeight: 1,
                      }}
                    >
                      {word.punctuation}
                    </Typography>
                  </Box>
                )}
              </React.Fragment>
            );
          })}
          </Box>
        </Box>
        
        {/* Left fade overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: { xs: '7.5%', sm: '10%', md: '10%' },
            background: `linear-gradient(to right, ${fadeColorStart}, ${fadeColorTransparent})`,
            opacity: canScroll ? (isHebrew ? (scrolledToEnd ? 0 : 1) : (scrolledToStart ? 0 : 1)) : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none',
          }}
        />

        {/* Right fade overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            bottom: 0,
            width: { xs: '7.5%', sm: '10%', md: '10%' },
            background: `linear-gradient(to left, ${fadeColorStart}, ${fadeColorTransparent})`,
            opacity: canScroll ? (isHebrew ? (scrolledToStart ? 0 : 1) : (scrolledToEnd ? 0 : 1)) : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Footer Section */}
      <Box sx={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: 1.5 }}>
        <IconActionButton
          label="View interlinear for full chapter"
          icon={<SubjectIcon sx={{ fontSize: 20 }} />}
          hoverColor={buttonHoverColor}
          hoverIconColor="rgba(255, 255, 255, 0.95)"
          baseColor={buttonBaseColor}
          iconColor="rgba(255, 255, 255, 0.8)"
          href={`/${currentVerse.version}/${bookSlug}/${currentVerse.chapter}/interlinear`}
          text="Full Chapter"
          textColor="rgba(255, 255, 255, 0.88)"
        />
        <Box sx={{ display: 'flex', gap: 1 }}>
          <IconActionButton
            label="Scroll to previous words"
            icon={<ArrowBack sx={{ fontSize: 18 }} />}
            hoverColor={buttonHoverColor}
            hoverIconColor="rgba(255, 255, 255, 0.95)"
            baseColor={buttonBaseColor}
            iconColor="rgba(255, 255, 255, 0.8)"
            onClick={() => navigateToPage(isHebrew ? 'right' : 'left')}
            disabled={!canScroll || scrolledToStart}
          />
          <IconActionButton
            label="Scroll to next words"
            icon={<ArrowForward sx={{ fontSize: 18 }} />}
            hoverColor={buttonHoverColor}
            hoverIconColor="rgba(255, 255, 255, 0.95)"
            baseColor={buttonBaseColor}
            iconColor="rgba(255, 255, 255, 0.8)"
            onClick={() => navigateToPage(isHebrew ? 'left' : 'right')}
            disabled={!canScroll || scrolledToEnd}
          />
        </Box>
      </Box>

      {/* Strong's Modal */}
      {shouldRenderStrongsModal && selectedStrongsKey && (
        <StrongsModal
          open={strongsModalOpen}
          onClose={handleCloseStrongsModal}
          strongsKey={selectedStrongsKey}
          currentWordIndex={selectedWordIndex}
          wordsList={words}
          onNavigateToWord={handleNavigateToWord}
          version={currentVerse.version}
        />
      )}
    </Box>
  );
}
