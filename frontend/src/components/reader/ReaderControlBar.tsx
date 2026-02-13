'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  IconButton,
  Typography,
  Tooltip,
  useTheme,
  useMediaQuery,
  BottomNavigation,
  BottomNavigationAction,
} from '@mui/material';
import {
  ArrowBack,
  ArrowForward,
  FormatListNumbered,
} from '@/components/ui/phosphor-icons';

interface ReaderControlBarProps {
  currentChapter: number;
  bookSlug: string;
  authorSlug: string;
  version: string;
  fontFamily?: 'serif' | 'sans';
  onChapterChange: (chapter: number) => void;
}

export default function ReaderControlBar({
  currentChapter,
  bookSlug,
  authorSlug,
  version,
  fontFamily = 'serif',
  onChapterChange,
}: ReaderControlBarProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [showTableOfContents, setShowTableOfContents] = useState(false);

  // Mock data - in production this would come from API
  const totalChapters = 25; // Calvin's Institutes Book 1 has 25 chapters
  
  // Get font family for typography
  const getFontFamily = () => {
    return fontFamily === 'serif' 
      ? '"Literata", Georgia, "Times New Roman", serif'
      : 'var(--font-plus-jakarta), "Inter", "Helvetica", "Arial", sans-serif';
  };
  
  // Mock chapter titles for Table of Contents
  const chapterTitles = Array.from({ length: totalChapters }, (_, i) => ({
    number: i + 1,
    title: `Chapter ${i + 1}: ${getChapterTitle(i + 1)}`, // You'd get real titles from API
  }));
  
  // Mock function for chapter titles - Calvin's Institutes Book 1
  function getChapterTitle(chapter: number) {
    const titles = [
      'The Knowledge of God and of Ourselves',
      'What It Is to Know God',
      'The Knowledge of God Implanted in the Human Mind',
      'This Knowledge Stifled or Corrupted',
      'The Knowledge of God from the Creation',
      'Scripture Is Needed as Guide and Teacher',
      'Scripture Must Be Confirmed by the Holy Spirit',
      'Rational Proofs of Scripture',
      'Fanatics Wrongly Appeal to the Holy Spirit',
      'Scripture Is Superior to All Human Wisdom',
      'Scripture Speaks Through the Prophets',
      'Christ the Sole Object of Doctrine',
      'The Unity and Trinity of God',
      'The Trinity in Scripture',
      'Heresies Opposing the Trinity',
      'The Divine Trinity Expressed in Scripture',
      'The Distinction of Persons in the Godhead',
      'The Trinity Confirmed',
      'Errors Concerning the Trinity',
      'The Trinity in the Old Testament',
      'The Trinity in Creation and Providence',
      'God Distinguished from Idols',
      'Images and the Worship of God',
      'God Alone to Be Worshipped',
      'The Trinity and Christian Worship',
    ];
    // For chapters beyond 25, generate generic titles
    if (chapter <= 25) {
      return titles[chapter - 1] || `Chapter ${chapter}`;
    }
    return `Chapter ${chapter}`;
  }

  const handlePreviousChapter = () => {
    if (currentChapter > 1) {
      onChapterChange(currentChapter - 1);
    }
  };

  const handleNextChapter = () => {
    if (currentChapter < totalChapters) {
      onChapterChange(currentChapter + 1);
    }
  };

  const handleChapterSelect = (chapter: number) => {
    onChapterChange(chapter);
  };

  if (isMobile) {
    return (
      <>
      <Paper 
        elevation={8}
        sx={{ 
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: theme.palette.background.paper,
          borderTop: `1px solid ${theme.palette.divider}`,
        }}
      >
        <BottomNavigation
          sx={{
            bgcolor: 'transparent',
            '& .MuiBottomNavigationAction-root': {
              minWidth: 'auto',
              paddingX: 2,
              flex: 1,
            },
          }}
        >
          <BottomNavigationAction
            icon={<ArrowBack />}
            onClick={handlePreviousChapter}
            disabled={currentChapter <= 1}
            sx={{ 
              color: currentChapter <= 1 
                ? theme.palette.action.disabled 
                : theme.palette.text.primary,
            }}
          />
          
          <BottomNavigationAction
            icon={<FormatListNumbered />}
            onClick={() => setShowTableOfContents(true)}
            label="Chapters"
            sx={{ 
              flexDirection: 'column',
              '& .MuiBottomNavigationAction-label': {
                fontSize: '11px',
                fontWeight: 600,
              },
            }}
          />
          
          <BottomNavigationAction
            icon={<ArrowForward />}
            onClick={handleNextChapter}
            disabled={currentChapter >= totalChapters}
            sx={{ 
              color: currentChapter >= totalChapters 
                ? theme.palette.action.disabled 
                : theme.palette.text.primary,
            }}
          />
        </BottomNavigation>
      </Paper>

      {/* Table of Contents Modal for Mobile */}
      {showTableOfContents && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
          }}
          onClick={() => setShowTableOfContents(false)}
        >
          {/* Header */}
          <Box
            sx={{
              p: 2.5,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              variant="h5"
              sx={{
                textAlign: 'center',
                color: '#FFFAFA',
                fontWeight: 700,
                fontFamily: getFontFamily(),
              }}
            >
              Table of Contents
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 0.5,
                fontFamily: getFontFamily(),
              }}
            >
              Calvin's Institutes - Book I
            </Typography>
          </Box>

          {/* Chapter List */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: 2,
              py: 2,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {chapterTitles.map((chapter) => (
              <Box
                key={chapter.number}
                onClick={() => {
                  handleChapterSelect(chapter.number);
                  setShowTableOfContents(false);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  mb: 1,
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  border: '1px solid',
                  borderColor: chapter.number === currentChapter 
                    ? 'rgba(255, 215, 0, 0.5)' 
                    : 'transparent',
                  bgcolor: chapter.number === currentChapter
                    ? 'rgba(255, 215, 0, 0.1)'
                    : 'transparent',
                  '&:active': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <Typography
                  sx={{
                    minWidth: 40,
                    color: chapter.number === currentChapter
                      ? '#FFD700'
                      : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '1.5rem',
                    fontWeight: 700,
                    fontFamily: getFontFamily(),
                  }}
                >
                  {chapter.number.toString().padStart(2, '0')}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: '#FFFAFA',
                      fontSize: '0.9rem',
                      fontWeight: 500,
                      fontFamily: getFontFamily(),
                    }}
                  >
                    {chapter.title}
                  </Typography>
                  {chapter.number === currentChapter && (
                    <Typography
                      sx={{
                        color: '#FFD700',
                        fontSize: '0.75rem',
                        fontWeight: 600,
                        mt: 0.25,
                        fontFamily: getFontFamily(),
                      }}
                    >
                      Currently Reading
                    </Typography>
                  )}
                </Box>
                <ArrowForward
                  sx={{
                    color: 'rgba(255, 255, 255, 0.3)',
                    fontSize: 18,
                  }}
                />
              </Box>
            ))}
          </Box>
        </Box>
      )}
      </>
    );
  }

  // Desktop version
  return (
    <>
    <Paper 
      elevation={8}
      sx={{ 
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        borderRadius: '25px',
        bgcolor: theme.palette.background.paper,
        border: `1px solid ${theme.palette.divider}`,
        zIndex: 1000,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          px: 3,
          py: 1.5,
        }}
      >
        {/* Previous Chapter */}
        {currentChapter > 1 ? (
          <Tooltip 
            title="Previous Chapter"
            disableInteractive
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: '#0E0E0E',
                  color: '#FFFAFA',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  '& .MuiTooltip-arrow': {
                    color: '#0E0E0E',
                    '&::before': {
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }
                  }
                }
              },
              popper: {
                sx: {
                  pointerEvents: 'none'
                }
              }
            }}
          >
            <IconButton
              onClick={handlePreviousChapter}
              sx={{
                color: '#FFFAFA',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
              aria-label="Previous chapter"
            >
              <ArrowBack />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            disabled
            sx={{
              color: 'rgba(255, 255, 255, 0.3)',
            }}
            aria-label="Previous chapter"
          >
            <ArrowBack />
          </IconButton>
        )}

        {/* Table of Contents */}
        <Tooltip 
          title="Table of Contents"
          disableInteractive
          slotProps={{
            tooltip: {
              sx: {
                bgcolor: '#0E0E0E',
                color: '#FFFAFA',
                fontSize: '12px',
                fontWeight: 500,
                border: '1px solid rgba(255, 215, 0, 0.2)',
                '& .MuiTooltip-arrow': {
                  color: '#0E0E0E',
                  '&::before': {
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                  }
                }
              }
            },
            popper: {
              sx: {
                pointerEvents: 'none'
              }
            }
          }}
        >
          <Box
            component="button"
            onClick={() => setShowTableOfContents(true)}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.75,
              py: 0.875,
              bgcolor: 'rgba(255, 215, 0, 0.08)',
              border: '1px solid rgba(255, 215, 0, 0.15)',
              borderRadius: '10px',
              color: 'rgba(255, 250, 250, 0.9)',
              fontSize: '13px',
              fontWeight: 600,
              fontFamily: getFontFamily(),
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              '&:hover': {
                bgcolor: 'rgba(255, 215, 0, 0.12)',
                borderColor: 'rgba(255, 215, 0, 0.2)',
              },
              '&:active': {
                transform: 'scale(0.98)',
              },
            }}
            aria-label="Table of Contents"
          >
            <FormatListNumbered sx={{ fontSize: 18, opacity: 0.9 }} />
          <Typography
            sx={{
              fontSize: '14px',
              fontWeight: 600,
              fontFamily: getFontFamily(),
            }}
          >
            Chapter {currentChapter} of {totalChapters}
          </Typography>
          </Box>
        </Tooltip>

        {/* Next Chapter */}
        {currentChapter < totalChapters ? (
          <Tooltip 
            title="Next Chapter"
            disableInteractive
            slotProps={{
              tooltip: {
                sx: {
                  bgcolor: '#0E0E0E',
                  color: '#FFFAFA',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: '1px solid rgba(255, 215, 0, 0.2)',
                  '& .MuiTooltip-arrow': {
                    color: '#0E0E0E',
                    '&::before': {
                      border: '1px solid rgba(255, 215, 0, 0.2)',
                    }
                  }
                }
              },
              popper: {
                sx: {
                  pointerEvents: 'none'
                }
              }
            }}
          >
            <IconButton
              onClick={handleNextChapter}
              sx={{
                color: '#FFFAFA',
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                },
              }}
              aria-label="Next chapter"
            >
              <ArrowForward />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton
            disabled
            sx={{
              color: 'rgba(255, 255, 255, 0.3)',
            }}
            aria-label="Next chapter"
          >
            <ArrowForward />
          </IconButton>
        )}
      </Box>
    </Paper>
      
    {/* Table of Contents Modal */}
    {showTableOfContents && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: 'rgba(0, 0, 0, 0.95)',
            zIndex: 1400,
            display: 'flex',
            flexDirection: 'column',
            animation: 'fadeIn 0.3s ease',
            '@keyframes fadeIn': {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
          onClick={() => setShowTableOfContents(false)}
        >
          {/* Header */}
          <Box
            sx={{
              p: 3,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
              backdropFilter: 'blur(10px)',
              background: 'linear-gradient(180deg, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.6))',
            }}
          >
            <Typography
              variant="h4"
              sx={{
                textAlign: 'center',
                color: '#FFFAFA',
                fontWeight: 700,
                letterSpacing: '0.02em',
                fontFamily: getFontFamily(),
              }}
            >
              Table of Contents
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                color: 'rgba(255, 255, 255, 0.6)',
                mt: 1,
                fontFamily: getFontFamily(),
              }}
            >
              Calvin's Institutes - Book I
            </Typography>
          </Box>

          {/* Chapter List */}
          <Box
            sx={{
              flex: 1,
              overflowY: 'auto',
              px: { xs: 2, sm: 4, md: 6 },
              py: 4,
              maxWidth: 800,
              mx: 'auto',
              width: '100%',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.05)',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 215, 0, 0.3)',
                borderRadius: '4px',
              },
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {chapterTitles.map((chapter) => (
              <Box
                key={chapter.number}
                onClick={() => {
                  handleChapterSelect(chapter.number);
                  setShowTableOfContents(false);
                }}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 3,
                  p: 2.5,
                  mb: 1.5,
                  borderRadius: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  border: '1px solid',
                  borderColor: chapter.number === currentChapter 
                    ? 'rgba(255, 215, 0, 0.5)' 
                    : 'transparent',
                  bgcolor: chapter.number === currentChapter
                    ? 'rgba(255, 215, 0, 0.1)'
                    : 'transparent',
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    transform: 'translateX(8px)',
                  },
                }}
              >
                <Typography
                  sx={{
                    minWidth: 60,
                    color: chapter.number === currentChapter
                      ? '#FFD700'
                      : 'rgba(255, 255, 255, 0.5)',
                    fontSize: '2rem',
                    fontWeight: 700,
                    lineHeight: 1,
                    fontFamily: getFontFamily(),
                  }}
                >
                  {chapter.number.toString().padStart(2, '0')}
                </Typography>
                <Box sx={{ flex: 1 }}>
                  <Typography
                    sx={{
                      color: '#FFFAFA',
                      fontSize: '1.125rem',
                      fontWeight: 500,
                      mb: 0.5,
                      fontFamily: getFontFamily(),
                    }}
                  >
                    {chapter.title}
                  </Typography>
                  {chapter.number === currentChapter && (
                    <Typography
                      sx={{
                        color: '#FFD700',
                        fontSize: '0.875rem',
                        fontWeight: 600,
                        fontFamily: getFontFamily(),
                      }}
                    >
                      Currently Reading
                    </Typography>
                  )}
                </Box>
                <ArrowForward
                  sx={{
                    color: 'rgba(255, 255, 255, 0.3)',
                    fontSize: 20,
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Close hint */}
          <Box
            sx={{
              p: 2,
              textAlign: 'center',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255, 255, 255, 0.4)',
                fontFamily: getFontFamily(),
              }}
            >
              Click anywhere or press ESC to close
            </Typography>
          </Box>
        </Box>
      )}
    </>
  );
}