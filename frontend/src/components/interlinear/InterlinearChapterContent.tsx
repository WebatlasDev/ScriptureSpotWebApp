// components/interlinear/InterlinearChapterContent.tsx
import { useState, useCallback } from 'react';
import { Box, Typography, ButtonBase, Tooltip, useMediaQuery, useTheme } from '@mui/material';
import { interlinearThemes } from '@/styles/interlinearThemes';
import StrongsModal from '@/components/verse/StrongsModal';
import React from 'react';
import Link from 'next/link';
import { useExplorationLexiconEntry } from '@/hooks/useExplorationLexiconEntry';
import { bookNameToSlug } from '@/utils/stringHelpers';
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

interface VerseData {
  verseNumber: number;
  words: Word[];
  language: 'GREEK' | 'HEBREW';
}

interface InterlinearChapterContentProps {
  verses: VerseData[];
  currentChapter: {
    book: string;
    chapter: number;
    version: string;
  };
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
        p: { xs: 1.5, sm: 2, md: 2.5 },
        background: cardStyles.bg,
        border: cardStyles.border,
        borderRadius: { xs: 2, md: 3 },
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'all 0.2s ease-in-out',
        minWidth: { xs: '75px', sm: '85px', md: '95px' },
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
      <Typography sx={{ color: 'white', fontSize: { xs: 15, md: 20 }, fontWeight: '700', pb: 0.5 }}>
        {originalText}
      </Typography>
      <Typography sx={{ color: 'rgba(255, 255, 255, 0.60)', fontSize: { xs: 12, md: 13 }, mb: 0.5 }}>
        {word.transliteration}
      </Typography>
      <Typography sx={{ color: 'white', fontSize: { xs: 12, md: 13 }, fontWeight: '700', mb: 0.5 }}>
        {word.englishWord}
      </Typography>
      <Typography sx={{ color: theme.strongsColor, fontSize: { xs: 12, md: 14 }, fontWeight: '400' }}>
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

// Main Interlinear Chapter Content Component
export default function InterlinearChapterContent({ 
  verses, 
  currentChapter 
}: InterlinearChapterContentProps) {
  const [selectedWord, setSelectedWord] = useState<Word | null>(null);
  const [selectedWordIndex, setSelectedWordIndex] = useState<number>(-1);
  const [selectedVerse, setSelectedVerse] = useState<number>(-1);
  const [strongsModalOpen, setStrongsModalOpen] = useState<boolean>(false);
  const [selectedStrongsKey, setSelectedStrongsKey] = useState<string | null>(null);
  
  // Get language from first verse (all verses in a chapter should be the same language)
  const language: 'GREEK' | 'HEBREW' = verses.length > 0 && verses[0].words.length > 0 && verses[0].words[0].hebrewWord ? 'HEBREW' : 'GREEK';
  const theme = interlinearThemes[language];
  const isHebrew = language === 'HEBREW';
  const direction = isHebrew ? 'rtl' : 'ltr';

  // Handle word card click to open Strong's modal
  const handleWordCardClick = (word: Word, wordIndex: number, verseNumber: number) => {
    setSelectedWord(word);
    setSelectedWordIndex(wordIndex);
    setSelectedVerse(verseNumber);
    setSelectedStrongsKey(word.strongLexiconKey);
    setStrongsModalOpen(true);
  };

  // Handle navigation to a specific word
  const handleNavigateToWord = (wordIndex: number) => {
    const currentVerseData = verses.find(v => v.verseNumber === selectedVerse);
    if (currentVerseData && currentVerseData.words[wordIndex]) {
      const word = currentVerseData.words[wordIndex];
      handleWordCardClick(word, wordIndex, selectedVerse);
    }
  };

  const handleCloseStrongsModal = () => {
    setStrongsModalOpen(false);
    setSelectedStrongsKey(null);
    setSelectedWordIndex(-1);
    setSelectedVerse(-1);
  };

  if (!verses || verses.length === 0) {
    return <Box sx={{ p: 2, color: 'white' }}>No interlinear data available.</Box>;
  }

  return (
    <Box sx={{ width: '100%' }}>
      {verses.map((verseData) => (
        <Box 
          key={verseData.verseNumber}
          id={`verse-${verseData.verseNumber}`}
          sx={{ 
            mb: { xs: 4, md: 5 },
            scrollMarginTop: '100px'
          }}
        >
          {/* Verse Header - More subtle and integrated */}
          <Typography 
            variant="h6" 
            component="h2"
            sx={{ 
              color: 'white',
              fontWeight: 400,
              mb: { xs: 2, md: 2.5 },
              fontSize: { xs: '1rem', md: '1.1rem' },
              borderLeft: isHebrew ? 'none' : '3px solid',
              borderRight: isHebrew ? '3px solid' : 'none',
              borderColor: theme.strongsColor,
              pl: isHebrew ? 0 : 2,
              pr: isHebrew ? 2 : 0,
              textAlign: isHebrew ? 'right' : 'left',
              opacity: 0.9
            }}
          >
            <Link 
              href={`/${currentChapter.version}/${bookNameToSlug(currentChapter.book)}/${currentChapter.chapter}/${verseData.verseNumber}`}
              style={{ 
                textDecoration: 'none',
                color: 'inherit',
                transition: 'color 0.2s ease'
              }}
            >
              <Box
                component="span"
                sx={{
                  cursor: 'pointer',
                  '&:hover': {
                    color: theme.strongsColor
                  }
                }}
              >
                Verse <Box component="span" sx={{ fontWeight: 700 }}>{verseData.verseNumber}</Box>
              </Box>
            </Link>
          </Typography>

          {/* Word Cards - Flex wrap layout without background container */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              direction: direction,
              gap: { xs: 1.2, md: 1.5 },
              alignItems: 'flex-start',
              width: '100%',
            }}
          >
            {verseData.words.map((word, index) => (
              <React.Fragment key={`${verseData.verseNumber}-${index}`}>
                <WordCard
                  word={word}
                  theme={theme}
                  language={language}
                  isSelected={
                    selectedWord?.strongLexiconKey === word.strongLexiconKey && 
                    selectedWord?.wordPosition === word.wordPosition &&
                    selectedVerse === verseData.verseNumber
                  }
                  onSelect={() => handleWordCardClick(word, index, verseData.verseNumber)}
                />
                {word.punctuation && (
                  <Box
                    key={`punctuation-${verseData.verseNumber}-${word.strongLexiconKey}-${word.wordPosition}`}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      minWidth: 'auto',
                      height: 'fit-content',
                      mt: { xs: 1, md: 1.5 }
                    }}
                  >
                    <Typography
                      sx={{
                        color: 'white',
                        fontSize: { xs: 18, md: 24 },
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
        </Box>
      ))}

      {/* Strong's Modal */}
      {selectedStrongsKey && selectedVerse !== -1 && (
        <StrongsModal
          open={strongsModalOpen}
          onClose={handleCloseStrongsModal}
          strongsKey={selectedStrongsKey}
          currentWordIndex={selectedWordIndex}
          wordsList={verses.find(v => v.verseNumber === selectedVerse)?.words || []}
          onNavigateToWord={handleNavigateToWord}
          version={currentChapter.version}
        />
      )}
    </Box>
  );
}
