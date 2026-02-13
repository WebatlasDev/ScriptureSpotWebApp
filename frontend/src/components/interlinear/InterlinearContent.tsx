// components/interlinear/InterlinearContent.tsx
import { useState, useRef, useEffect, useCallback } from 'react';
import { Box, Typography, ButtonBase, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { ArrowBack, ArrowForward } from '@/components/ui/phosphor-icons';
import { interlinearThemes } from '@/styles/interlinearThemes';
import StrongsModal from '@/components/verse/StrongsModal';
import React from 'react';
import { useExplorationLexiconEntry } from '@/hooks/useExplorationLexiconEntry';
import { useQueryClient } from '@tanstack/react-query';

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

interface InterlinearContentProps {
  words: Word[];
  currentVerse: {
    book: string;
    chapter: number;
    verse: number;
    version: string;
  };
  showNavigation?: boolean;
  showFooter?: boolean;
}

// Sub-component for a single word card with punctuation
function WordCard({
  word,
  theme,
  isSelected,
  onSelect,
  language,
}: {
  word: Word;
  theme: (typeof interlinearThemes)['HEBREW'];
  isSelected: boolean;
  onSelect: () => void;
  language: 'GREEK' | 'HEBREW';
}) {
  const muiTheme = useTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const cardStyles = isSelected ? theme.card.selected : theme.card.default;
  const originalText = language === 'HEBREW' ? word.hebrewWord : word.greekWord;
  const queryClient = useQueryClient();
  const queryKey = ['explorationLexiconEntry', word.strongLexiconKey] as const;
  const [shouldLoadLexicon, setShouldLoadLexicon] = useState(() => !!queryClient.getQueryData(queryKey));

  const { data: lexiconEntry } = useExplorationLexiconEntry(
    word.strongLexiconKey,
    { enabled: shouldLoadLexicon }
  );

  const ensureLexiconRequested = useCallback(() => {
    setShouldLoadLexicon((prev) => prev || true);
  }, []);

  const handleCardClick = useCallback(() => {
    ensureLexiconRequested();
    onSelect();
  }, [ensureLexiconRequested, onSelect]);

  const tooltipContent = lexiconEntry ? (
    <Box sx={{ p: 1, maxWidth: 300 }}>
      <Typography sx={{ fontWeight: 700, mb: 0.5, fontSize: 14 }}>
        {lexiconEntry.originalWord}
      </Typography>
      <Typography sx={{ mb: 0.5, fontSize: 12, opacity: 0.8 }}>
        {lexiconEntry.transliteration}
      </Typography>
      <Typography sx={{ mb: 0.5, fontSize: 12, fontWeight: 600 }}>
        {lexiconEntry.partOfSpeech}
      </Typography>
      <Typography sx={{ fontSize: 12, lineHeight: 1.4 }}>
        {lexiconEntry.shortDefinition}
      </Typography>
    </Box>
  ) : shouldLoadLexicon && !isMobile ? (
    <Typography sx={{ fontSize: 12, color: 'rgba(255,255,255,0.7)' }}>
      Loading definition...
    </Typography>
  ) : null;

  const cardElement = (
    <ButtonBase
      onClick={handleCardClick}
      sx={{
        p: { xs: 1.5, sm: 2, md: 3 },
        background: cardStyles.bg,
        border: cardStyles.border,
        borderRadius: { xs: 2, md: 3.5 },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        flexShrink: 0,
        transition: 'all 0.2s ease-in-out',
        minWidth: { xs: '80px', sm: '90px', md: '100px' },
        position: 'relative',
        '@media (hover: hover)': {
          '&:hover': {
            background: `${theme.strongsColor}33`,
          },
        },
        '& .MuiTouchRipple-root': {
          color: theme.strongsColor,
        },
      }}
      onMouseEnter={ensureLexiconRequested}
      onFocus={ensureLexiconRequested}
      onTouchStart={ensureLexiconRequested}
    >
      <Typography sx={{ color: 'white', fontSize: { xs: 16, md: 24 }, fontWeight: '700', pb: 1 }}>
        {originalText}
      </Typography>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.60)', fontSize: { xs: 14, md: 14 } }}>
        {word.transliteration}
      </Typography>
      <Typography sx={{ color: 'white', fontSize: { xs: 14, md: 14 }, fontWeight: '700' }}>
        {word.englishWord}
      </Typography>
      <Typography sx={{ color: theme.strongsColor, fontSize: { xs: 14, md: 16 }, fontWeight: '400' }}>
        {word.strongLexiconKey}
      </Typography>
    </ButtonBase>
  );

  if (tooltipContent && !isMobile) {
    return (
      <Tooltip
        title={tooltipContent}
        arrow
        placement="top"
        enterDelay={300}
        leaveDelay={100}
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: '#1A1A1A',
              borderRadius: 2,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
              '& .MuiTooltip-arrow': {
                color: '#1A1A1A'
              }
            }
          }
        }}
      >
        {cardElement}
      </Tooltip>
    );
  }

  return cardElement;
}

// Main Interlinear Content Component
export default function InterlinearContent({ 
  words, 
  currentVerse, 
  showNavigation = true,
  showFooter = true 
}: InterlinearContentProps) {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(-1);
  const [canScroll, setCanScroll] = useState<boolean>(true);
  const [scrolledToStart, setScrolledToStart] = useState<boolean>(false);
  const [scrolledToEnd, setScrolledToEnd] = useState<boolean>(false);
  const [strongsModalOpen, setStrongsModalOpen] = useState<boolean>(false);
  const [selectedStrongsKey, setSelectedStrongsKey] = useState<string | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  const language: 'GREEK' | 'HEBREW' = words.length > 0 && words[0].hebrewWord ? 'HEBREW' : 'GREEK';
  const theme = interlinearThemes[language];

  // Language-specific settings
  const isHebrew = language === 'HEBREW';
  const fadeColor = isHebrew ? '#1D1A15' : '#242629';
  const direction = isHebrew ? 'rtl' : 'ltr';

  // Handle word card click to open Strong's modal
  const handleWordCardClick = (word: Word, wordIndex: number) => {
    setSelectedWord(word);
    setSelectedWordIndex(wordIndex);
    setSelectedStrongsKey(word.strongLexiconKey);
    setStrongsModalOpen(true);
  };

  // Handle navigation to a specific word
  const handleNavigateToWord = (wordIndex: number) => {
    const word = words[wordIndex];
    if (word) {
      handleWordCardClick(word, wordIndex);
    }
  };

  const handleCloseStrongsModal = () => {
    setStrongsModalOpen(false);
    setSelectedStrongsKey(null);
    setSelectedWordIndex(-1);
  };

  // Check scroll state with proper detection logic for both LTR and RTL
  const checkScrollability = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      const canScrollHorizontally = scrollWidth > clientWidth;
      
      let isAtStart, isAtEnd;
      if (isHebrew) {
        isAtStart = !canScrollHorizontally || Math.abs(scrollWidth - clientWidth + scrollLeft) < 5;
        isAtEnd = !canScrollHorizontally || Math.abs(scrollLeft) < 5;
      } else {
        isAtStart = !canScrollHorizontally || Math.abs(scrollLeft) < 5;
        isAtEnd = !canScrollHorizontally || Math.abs(scrollWidth - clientWidth - scrollLeft) < 5;
      }
      
      setCanScroll(canScrollHorizontally);
      setScrolledToStart(isAtStart);
      setScrolledToEnd(isAtEnd);
    }
  }, [isHebrew]);

  const handleScroll = useCallback(() => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      
      if (isHebrew) {
        setScrolledToStart(Math.abs(scrollWidth - clientWidth + scrollLeft) < 5);
        setScrolledToEnd(Math.abs(scrollLeft) < 5);
      } else {
        setScrolledToStart(Math.abs(scrollLeft) < 5);
        setScrolledToEnd(Math.abs(scrollWidth - clientWidth - scrollLeft) < 5);
      }
    }
  }, [isHebrew]);

  // Calculate items per page based on container width
  const getItemsPerPage = useCallback(() => {
    if (!scrollContainerRef.current) return 2;
    const containerWidth = scrollContainerRef.current.clientWidth;
    const cardWidth = 118;
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
    let newScrollLeft;
    
    if (direction === 'right') {
      newScrollLeft = currentScrollLeft + scrollAmount;
    } else {
      newScrollLeft = currentScrollLeft - scrollAmount;
    }
    
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

  if (!words || words.length === 0) {
    return <Box sx={{ p: 2, color: 'white' }}>No interlinear data available.</Box>;
  }

  return (
    <Box
      sx={{
        p: { xs: 2.5, md: 4 },
        background: theme.drawerBg,
        borderRadius: 3.5,
        flexDirection: 'column',
        gap: { xs: 2, md: 3 },
        display: 'flex',
        width: '100%',
        maxWidth: '100%',
        boxSizing: 'border-box',
      }}
    >
      {/* Horizontally Scrolling Word List */}
      <Box sx={{ position: 'relative' }}>
        <Box
          ref={scrollContainerRef}
          sx={{
            display: 'flex',
            direction: direction,
            gap: { xs: 1.5, md: 2 },
            overflowX: 'auto',
            overflowY: 'hidden',
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
          {words.map((word, index) => (
            <React.Fragment key={index}>
              <WordCard
                key={word.strongLexiconKey + word.wordPosition}
                word={word}
                theme={theme}
                language={language}
                isSelected={selectedWord?.strongLexiconKey === word.strongLexiconKey && selectedWord?.wordPosition === word.wordPosition}
                onSelect={() => handleWordCardClick(word, index)}
              />
              {word.punctuation && (
                <Box
                  key={`punctuation-${word.strongLexiconKey}-${word.wordPosition}`}
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
          ))}
        </Box>
        
        {/* Left fade overlay */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            bottom: 0,
            width: { xs: '7.5%', sm: '10%', md: '10%' },
            background: `linear-gradient(to right, ${fadeColor}, transparent)`,
            opacity: canScroll ? (scrolledToStart ? 0 : 1) : 0,
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
            background: `linear-gradient(to left, ${fadeColor}, transparent)`,
            opacity: canScroll ? (scrolledToEnd ? 0 : 1) : 0,
            transition: 'opacity 0.3s ease-in-out',
            pointerEvents: 'none',
          }}
        />
      </Box>

      {/* Footer Section */}
      {showFooter && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography sx={{ color: 'rgba(255, 255, 255, 0.60)', fontSize: 14 }}>
            <Box component="span" sx={{ display: { xs: 'inline', md: 'none' } }}>
              View full interlinear
            </Box>
            <Box component="span" sx={{ display: { xs: 'none', md: 'inline' } }}>
              View interlinear for entire chapter
            </Box>
          </Typography>
          {showNavigation && (
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <ButtonBase
                onClick={() => navigateToPage('left')}
                disabled={!canScroll || scrolledToStart}
                sx={{
                  width: 30,
                  height: 30,
                  background: (!canScroll || scrolledToStart) ? 'rgba(255,255,255,0.1)' : theme.navButtonBg,
                  borderRadius: '50%',
                  color: (!canScroll || scrolledToStart) ? 'rgba(255,255,255,0.3)' : 'white',
                  cursor: (!canScroll || scrolledToStart) ? 'default' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '@media (hover: hover)': {
                    '&:hover': {
                      background: (!canScroll || scrolledToStart) ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    },
                  },
                  '& .MuiTouchRipple-root': {
                    color: theme.strongsColor,
                  },
                }}
              >
                <ArrowBack fontSize="small" />
              </ButtonBase>
              <ButtonBase
                onClick={() => navigateToPage('right')}
                disabled={!canScroll || scrolledToEnd}
                sx={{
                  width: 30,
                  height: 30,
                  background: (!canScroll || scrolledToEnd) ? 'rgba(255,255,255,0.1)' : theme.navButtonBg,
                  borderRadius: '50%',
                  color: (!canScroll || scrolledToEnd) ? 'rgba(255,255,255,0.3)' : 'white',
                  cursor: (!canScroll || scrolledToEnd) ? 'default' : 'pointer',
                  transition: 'all 0.2s ease-in-out',
                  '@media (hover: hover)': {
                    '&:hover': {
                      background: (!canScroll || scrolledToEnd) ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.2)',
                    },
                  },
                  '& .MuiTouchRipple-root': {
                    color: theme.strongsColor,
                  },
                }}
              >
                <ArrowForward fontSize="small" />
              </ButtonBase>
            </Box>
          )}
        </Box>
      )}

      {/* Strong's Modal */}
      {selectedStrongsKey && (
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
