'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Box, Button, Modal, Typography, TextField, IconButton } from '@mui/material';
import { Close as CloseIcon, ArrowForward as ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { motion } from 'framer-motion';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import { useBibleVerses } from '@/hooks/useBibleVerses';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';

interface MobileSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export default function MobileSearchModal({ open, onClose }: MobileSearchModalProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState('matthew');
  const [selectedChapter, setSelectedChapter] = useState('1');
  const [selectedVerse, setSelectedVerse] = useState('1');
  const router = useRouter();

  // API hooks
  const { data: books } = useBibleBooks({ enabled: open });
  const chapterNumber = parseInt(selectedChapter, 10) || 0;
  const { data: chapters } = useBibleChapters(selectedBook, { enabled: open && !!selectedBook });
  const { data: verses } = useBibleVerses(selectedBook, chapterNumber, { enabled: open && !!selectedBook && chapterNumber > 0 });

  // Dynamic counts
  const maxChapters = chapters?.length || 1;
  const maxVerses = verses?.length || 1;

  // Refs for auto-scrolling to current selections
  const bookScrollRef = useRef<HTMLDivElement>(null);
  const chapterScrollRef = useRef<HTMLDivElement>(null);
  const verseScrollRef = useRef<HTMLDivElement>(null);

  // Initialize book selection when data loads
  useEffect(() => {
    if (!open || !books?.length) {
      return;
    }

    if (!selectedBook || !books.some((book: any) => book.slug === selectedBook)) {
      const matthewBook = books.find((book: any) => book.slug === 'matthew');
      setSelectedBook(matthewBook ? matthewBook.slug : books[0].slug);
    }
  }, [books, open, selectedBook]);

  // Reset chapter and verse when book changes
  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedChapter('1');
    setSelectedVerse('1');
  }, [selectedBook, open]);

  // Reset verse when chapter changes
  useEffect(() => {
    if (!open) {
      return;
    }
    setSelectedVerse('1');
  }, [selectedChapter, open]);

  // Auto-scroll utility function
  const scrollToSelected = (containerRef: React.RefObject<HTMLDivElement | null>, selectedValue: string, isNumeric: boolean = false) => {
    if (!containerRef.current) return;
    
    const container = containerRef.current;
    const items = container.children;
    let selectedIndex = -1;
    
    if (isNumeric) {
      selectedIndex = parseInt(selectedValue) - 1;
    } else {
      // For books, find the index based on the selected book slug
      for (let i = 0; i < items.length; i++) {
        const item = items[i] as HTMLElement;
        if (item.getAttribute('data-value') === selectedValue) {
          selectedIndex = i;
          break;
        }
      }
    }
    
    if (selectedIndex >= 0 && selectedIndex < items.length) {
      const selectedItem = items[selectedIndex] as HTMLElement;
      const containerHeight = container.clientHeight;
      const itemHeight = selectedItem.offsetHeight;
      const itemTop = selectedItem.offsetTop;
      
      // Calculate the ideal scroll position to center the item vertically
      const idealScrollTop = itemTop - (containerHeight / 2) + (itemHeight / 2);
      
      container.scrollTo({
        top: Math.max(0, idealScrollTop),
        behavior: 'auto'
      });
    }
  };

  // Auto-scroll effects - only on initial open
  useEffect(() => {
    if (open && books?.length) {
      // Use requestAnimationFrame to ensure DOM is fully rendered
      requestAnimationFrame(() => {
        setTimeout(() => {
          scrollToSelected(bookScrollRef, selectedBook);
          scrollToSelected(chapterScrollRef, selectedChapter, true);
          scrollToSelected(verseScrollRef, selectedVerse, true);
        }, 50);
      });
    }
  }, [open, books, selectedBook, selectedChapter, selectedVerse]);

  const handleTextSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      onClose();
    }
  };


  const handleVerseSearch = () => {
    if (selectedBook && selectedChapter && selectedVerse) {
      const version = typeof window !== 'undefined'
        ? getLastVersion()
        : env.defaultVersion;
      router.push(`/${version}/${selectedBook}/${selectedChapter}/${selectedVerse}`);
      onClose();
    }
  };

  // Animation variants
  const mobileModalVariants = {
    hidden: { 
      opacity: 0, 
      y: '100%'
    },
    visible: { 
      opacity: 1, 
      y: 0
    },
  };

  return (
    <>
      <style>{`
        .mobile-search-modal {
          max-height: 85vh !important;
        }
        @supports (height: 100dvh) {
          .mobile-search-modal {
            max-height: 85dvh !important;
          }
        }
      `}</style>
      <Modal
        open={open}
        onClose={onClose}
        closeAfterTransition
        disableAutoFocus
        disableEnforceFocus
        sx={{
          backdropFilter: 'blur(2px)',
          '&:focus-visible': { outline: 'none' },
          '&:focus': { outline: 'none' },
          '& .MuiModal-backdrop': { '&:focus-visible': { outline: 'none' }, '&:focus': { outline: 'none' } }
        }}
        slotProps={{
          backdrop: {
            timeout: 300,
            style: { backgroundColor: 'rgba(25, 25, 25, 0.1)' }
          }
        }}
      >
        <motion.div
          className="mobile-search-modal"
          initial="hidden"
          animate={open ? "visible" : "hidden"}
          variants={mobileModalVariants}
          transition={{ 
            duration: 0.3, 
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
          style={{
            position: 'fixed',
            left: 0,
            right: 0,
            bottom: 0,
            width: '100vw',
            maxWidth: 500,
            backgroundColor: '#1A1A1A',
            borderRadius: '16px 16px 0 0',
            padding: '24px',
            paddingBottom: 'calc(24px + env(safe-area-inset-bottom, 0px))',
            color: 'white',
            marginLeft: 'auto',
            marginRight: 'auto',
            outline: 'none',
            WebkitOverflowScrolling: 'touch',
            overflowY: 'auto',
          }}
        >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" sx={{ color: 'text.primary', fontWeight: 600 }}>
            Search Scripture Spot
          </Typography>
          <Button
            onClick={onClose}
            sx={{ 
              minWidth: 'auto', 
              p: 0.5, 
              color: 'text.secondary',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.05)' }
            }}
          >
            <CloseIcon fontSize="small" />
          </Button>
        </Box>

        {/* Text Search Section */}
        <Box sx={{ mb: 3 }}>
          <Box
            component="form"
            onSubmit={handleTextSearch}
            sx={{ position: 'relative' }}
          >
            <TextField
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search verses, topics, authors..."
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 2,
                  pr: 6,
                  '& fieldset': {
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                  },
                  '&:hover fieldset': {
                    border: '1px solid rgba(255, 255, 255, 0.3)',
                  },
                  '&.Mui-focused fieldset': {
                    border: '1px solid rgba(255, 215, 0, 0.6)',
                  },
                  '& input': {
                    color: 'text.primary',
                    fontSize: '16px',
                  },
                },
                '& .MuiInputBase-input::placeholder': {
                  color: 'rgba(255, 255, 255, 0.5)',
                  opacity: 1,
                }
              }}
            />
            <IconButton
              type="submit"
              sx={{
                position: 'absolute',
                right: 8,
                top: '50%',
                transform: 'translateY(-50%)',
                backgroundColor: '#FFD700',
                width: 32,
                height: 32,
                '&:hover': {
                  backgroundColor: '#E6C200',
                },
              }}
            >
              <ArrowForwardIcon sx={{ color: '#1a1a1a', fontSize: '18px' }} />
            </IconButton>
          </Box>
        </Box>

        {/* Laser Effect Divider with "Or" overlay */}
        <Box
          sx={{
            height: 32, // Increased height to accommodate text
            width: 'calc(100% + 48px)', // Extend beyond padding (24px on each side)
            position: 'relative',
            background: '#1A1A1A',
            my: 4, // More vertical spacing above and below
            ml: -3, // Negative margin to offset padding
            mr: -3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Laser line positioned in the middle */}
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: 0,
              right: 0,
              height: 2,
              transform: 'translateY(-50%)',
              overflow: 'hidden',
              background: '#1A1A1A',
            }}
          >
            <Box
              sx={{
                position: 'absolute',
                top: 0,
                left: '-200%',
                width: '200%',
                height: '100%',
                background: 'linear-gradient(90deg, #1A1A1A 0%, #FFD700 50%, #1A1A1A 100%)',
                animation: 'laserSweep 4s linear infinite',
                '@keyframes laserSweep': {
                  '0%': {
                    left: '-200%',
                  },
                  '100%': {
                    left: '100%',
                  },
                },
              }}
            />
          </Box>
          {/* "Or" overlay */}
          <Box
            sx={{
              backgroundColor: '#1A1A1A',
              px: 2,
              py: 0.5,
              zIndex: 1,
            }}
          >
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary', 
                fontSize: '12px', 
                fontWeight: 700, 
                letterSpacing: 0.6 
              }}
            >
              OR
            </Typography>
          </Box>
        </Box>

        {/* Verse Locator */}
        <Box>
          
          <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'space-between' }}>
            {/* Book Picker */}
            <Box sx={{ flex: 2 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Book
              </Typography>
              <Box 
                ref={bookScrollRef}
                sx={{ 
                  height: 180,
                  overflowY: 'auto', 
                  border: '1px solid rgba(255,255,255,0.2)', 
                  borderRadius: 1,
                  backgroundColor: '#1A1A1A',
                  overscrollBehavior: 'contain',
                }}
              >
                {books?.map((b: { slug: string; name: string }) => (
                  <Box
                    key={b.slug}
                    data-value={b.slug}
                    onClick={() => setSelectedBook(b.slug)}
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      backgroundColor: selectedBook === b.slug ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      color: 'text.primary',
                      '&:hover': selectedBook === b.slug ? {} : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                      fontSize: '0.875rem',
                    }}
                  >
                    {b.name}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Chapter Picker */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Chapter
              </Typography>
              <Box 
                ref={chapterScrollRef}
                sx={{ height: 180, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1, backgroundColor: '#1A1A1A' }}
              >
                {Array.from({ length: maxChapters }, (_, i) => i + 1).map((chapterNum) => (
                  <Box
                    key={chapterNum}
                    onClick={() => setSelectedChapter(chapterNum.toString())}
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: selectedChapter === chapterNum.toString() ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      color: 'text.primary',
                      '&:hover': selectedChapter === chapterNum.toString() ? {} : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                      fontSize: '0.875rem',
                    }}
                  >
                    {chapterNum}
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Verse Picker */}
            <Box sx={{ flex: 1 }}>
              <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                Verse
              </Typography>
              <Box 
                ref={verseScrollRef}
                sx={{ height: 180, overflowY: 'auto', border: '1px solid rgba(255,255,255,0.2)', borderRadius: 1, backgroundColor: '#1A1A1A' }}
              >
                {Array.from({ length: maxVerses }, (_, i) => i + 1).map((verseNum) => (
                  <Box
                    key={verseNum}
                    onClick={() => setSelectedVerse(verseNum.toString())}
                    sx={{
                      p: 1,
                      cursor: 'pointer',
                      textAlign: 'center',
                      backgroundColor: selectedVerse === verseNum.toString() ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                      color: 'text.primary',
                      '&:hover': selectedVerse === verseNum.toString() ? {} : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                      fontSize: '0.875rem',
                    }}
                  >
                    {verseNum}
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>

          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
            <Button
              onClick={onClose}
              sx={{ color: 'text.secondary' }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleVerseSearch}
              variant="contained"
              sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 600,
                '&:hover': { backgroundColor: '#E6C200' },
              }}
            >
              Go
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Modal>
    </>
  );
}
