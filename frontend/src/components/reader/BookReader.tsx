'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Box,
  IconButton,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Settings,
} from '@/components/ui/phosphor-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import ChapterContent from './ChapterContent';
import ReaderHeader from './ReaderHeader';
import ReaderControlBar from './ReaderControlBar';
import ActionPopover from './ActionPopover';
import ReaderSettingsDrawer from './ReaderSettingsDrawer';
import ReaderSettingsMobile from './ReaderSettingsMobile';
import SearchPanel from './SearchPanel';

interface Author {
  name: string;
  slug: string;
  image?: string;
  colorScheme?: any;
}

interface Book {
  name: string;
  slug: string;
}

interface BookReaderProps {
  processedHtml: string;
  title: string;
  author: Author;
  book: Book;
  chapter: number;
  version: string;
  initialHighlight?: string;
}

interface TextSelection {
  text: string;
  sentenceId?: string;
  range: Range;
  x: number;
  y: number;
}

interface Highlight {
  sentenceId: string;
  color: string;
  text: string;
}

interface Underline {
  sentenceId: string;
  text: string;
}

export default function BookReader({
  processedHtml,
  title,
  author,
  book,
  chapter,
  version,
  initialHighlight,
}: BookReaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // State management with localStorage persistence
  const [selectedText, setSelectedText] = useState<TextSelection | null>(null);
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [underlines, setUnderlines] = useState<Underline[]>([]);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Initialize reader settings from localStorage or defaults
  const [fontSize, setFontSize] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readerFontSize');
      return saved ? parseInt(saved) : (isMobile ? 20 : 22);
    }
    return isMobile ? 20 : 22;
  });
  
  const [lineHeight, setLineHeight] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readerLineHeight');
      return saved ? parseFloat(saved) : 2.0;
    }
    return 2.0;
  });
  
  const [fontFamily, setFontFamily] = useState<'serif' | 'sans'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readerFontFamily');
      return (saved as 'serif' | 'sans') || 'serif';
    }
    return 'serif';
  });
  
  const [readerTheme, setReaderTheme] = useState<'light' | 'sepia' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readerTheme');
      return (saved as 'light' | 'sepia' | 'dark') || 'dark';
    }
    return 'dark';
  });
  
  const [focusMode, setFocusMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('readerFocusMode');
      return saved === 'true';
    }
    return false;
  });

  // Save reader settings to localStorage whenever they change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readerFontSize', fontSize.toString());
    }
  }, [fontSize]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readerLineHeight', lineHeight.toString());
    }
  }, [lineHeight]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readerFontFamily', fontFamily);
    }
  }, [fontFamily]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readerTheme', readerTheme);
    }
  }, [readerTheme]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('readerFocusMode', focusMode.toString());
    }
  }, [focusMode]);

  // Handle initial highlight from URL
  useEffect(() => {
    if (initialHighlight) {
      const timer = setTimeout(() => {
        const targetElement = document.querySelector(
          `[data-sentence-id="${initialHighlight}"]`
        );
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetElement.classList.add('jump-in-highlight');
        }
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [initialHighlight]);

  // Handle search result navigation
  const handleSearchResultSelect = useCallback((sentenceId: string) => {
    const targetElement = document.querySelector(
      `[data-sentence-id="${sentenceId}"]`
    );
    if (targetElement) {
      targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
      // Temporarily highlight the search result
      targetElement.classList.add('jump-in-highlight');
      setTimeout(() => {
        targetElement.classList.remove('jump-in-highlight');
      }, 3000);
    }
  }, []);

  // Handle text selection
  const handleTextSelection = useCallback((selection: TextSelection | null) => {
    setSelectedText(selection);
  }, []);

  // Handle popover actions
  const handleHighlight = useCallback((color: string) => {
    if (selectedText?.sentenceId) {
      // Check if this sentence already has a highlight
      const existingHighlightIndex = highlights.findIndex(
        h => h.sentenceId === selectedText.sentenceId
      );
      
      if (existingHighlightIndex >= 0) {
        // Update existing highlight with new color
        const updatedHighlights = [...highlights];
        updatedHighlights[existingHighlightIndex] = {
          ...updatedHighlights[existingHighlightIndex],
          color
        };
        setHighlights(updatedHighlights);
      } else {
        // Add new highlight
        const newHighlight: Highlight = {
          sentenceId: selectedText.sentenceId,
          color,
          text: selectedText.text
        };
        setHighlights([...highlights, newHighlight]);
      }
    }
    
    setSelectedText(null);
  }, [selectedText, highlights]);

  const handleRemoveHighlight = useCallback(() => {
    if (selectedText?.sentenceId) {
      setHighlights(highlights.filter(h => h.sentenceId !== selectedText.sentenceId));
    }
    setSelectedText(null);
  }, [selectedText, highlights]);

  const handleToggleUnderline = useCallback(() => {
    if (selectedText?.sentenceId) {
      const existingUnderlineIndex = underlines.findIndex(
        u => u.sentenceId === selectedText.sentenceId
      );
      
      if (existingUnderlineIndex >= 0) {
        // Remove underline
        setUnderlines(underlines.filter(u => u.sentenceId !== selectedText.sentenceId));
      } else {
        // Add underline
        const newUnderline: Underline = {
          sentenceId: selectedText.sentenceId,
          text: selectedText.text
        };
        setUnderlines([...underlines, newUnderline]);
      }
    }
    setSelectedText(null);
  }, [selectedText, underlines]);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + F to open search
      if ((e.metaKey || e.ctrlKey) && e.key === 'f') {
        e.preventDefault();
        setSearchOpen(true);
      }
      // Escape to close search, popover, or exit focus mode
      else if (e.key === 'Escape') {
        if (selectedText) {
          setSelectedText(null);
        } else if (searchOpen) {
          setSearchOpen(false);
          setSearchTerm('');
        } else if (focusMode) {
          setFocusMode(false);
        }
      }
      // F key to toggle focus mode (when not in search)
      else if (e.key === 'f' && !e.metaKey && !e.ctrlKey && !searchOpen && !selectedText) {
        setFocusMode(!focusMode);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [searchOpen, focusMode, selectedText]);

  const handleNote = useCallback((note: string) => {
    // Implement note saving logic
    console.log('Note:', note);
    setSelectedText(null);
  }, []);

  const handleBookmark = useCallback(() => {
    // Implement bookmark logic
    console.log('Bookmarking chapter');
  }, []);

  const handleShare = useCallback(() => {
    const url = window.location.href;
    if (navigator.share) {
      navigator.share({
        title: title,
        text: `${title} by ${author.name}`,
        url: url,
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  }, [title, author.name]);

  const handleBack = useCallback(() => {
    router.back();
  }, [router]);

  // Theme styles
  const getReaderStyles = () => {
    switch (readerTheme) {
      case 'light':
        return {
          bgcolor: '#FFFFFF',
          color: '#000000',
        };
      case 'sepia':
        return {
          bgcolor: '#F4F1E8',
          color: '#5C4B3A',
        };
      case 'dark':
      default:
        return {
          bgcolor: theme.palette.background.default,
          color: theme.palette.text.primary,
        };
    }
  };

  const readerStyles = getReaderStyles();

  return (
    <Box sx={{ 
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      ...readerStyles,
      transition: 'all 0.3s ease',
    }}>
      {/* Reader Header */}
      {!focusMode && (
        <ReaderHeader
          book={book}
          author={author}
          chapter={chapter}
          readerTheme={readerTheme}
          onSearchToggle={() => setSearchOpen(!searchOpen)}
          onBookmark={handleBookmark}
          onShare={handleShare}
          onSettingsOpen={() => setSettingsOpen(true)}
          isMobile={isMobile}
          settingsOpen={settingsOpen}
          scrollContainerRef={scrollContainerRef}
        />
      )}

      {/* Focus Mode Settings Button */}
      {focusMode && (
        <IconButton
          onClick={() => setSettingsOpen(true)}
          sx={{
            position: 'fixed',
            top: 20,
            right: 20,
            zIndex: 1300,
            bgcolor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            backdropFilter: 'blur(4px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            width: 48,
            height: 48,
            '&:hover': {
              bgcolor: 'rgba(0, 0, 0, 0.8)',
              transform: 'scale(1.05)',
            },
            transition: 'all 0.2s ease',
          }}
        >
          <Settings />
        </IconButton>
      )}


      {/* Search Panel */}
      <Box sx={{ position: 'relative', zIndex: 1200 }}>
        <SearchPanel
          open={searchOpen}
          onClose={() => {
            setSearchOpen(false);
            setSearchTerm('');
          }}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onResultSelect={handleSearchResultSelect}
        />
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        flex: 1, 
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}>
        <ChapterContent
          processedHtml={processedHtml}
          onTextSelection={handleTextSelection}
          highlights={highlights}
          underlines={underlines}
          searchTerm={searchTerm}
          fontSize={fontSize}
          lineHeight={lineHeight}
          fontFamily={fontFamily}
          readerTheme={readerTheme}
          scrollContainerRef={scrollContainerRef}
          bookName={book.name}
          chapterNumber={chapter}
          chapterTitle={chapter === 1 ? "The Knowledge of God and That of Ourselves Are Connected" : undefined}
        />
      </Box>

      {/* Bottom Control Bar */}
      {!focusMode && (
        <ReaderControlBar
          currentChapter={chapter}
          bookSlug={book.slug}
          authorSlug={author.slug}
          version={version}
          fontFamily={fontFamily}
          onChapterChange={(newChapter) => {
            router.push(`/books/${author.slug}/${book.slug}/${newChapter}`);
          }}
        />
      )}

      {/* Text Selection Popover */}
      <ActionPopover
        selection={selectedText}
        onHighlight={handleHighlight}
        onRemoveHighlight={handleRemoveHighlight}
        onToggleUnderline={handleToggleUnderline}
        onNote={handleNote}
        onClose={() => setSelectedText(null)}
        hasHighlight={selectedText ? highlights.some(h => h.sentenceId === selectedText.sentenceId) : false}
        hasUnderline={selectedText ? underlines.some(u => u.sentenceId === selectedText.sentenceId) : false}
      />

      {/* Settings - Desktop Drawer */}
      <ReaderSettingsDrawer
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        lineHeight={lineHeight}
        onLineHeightChange={setLineHeight}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        theme={readerTheme}
        onThemeChange={setReaderTheme}
        focusMode={focusMode}
        onFocusModeChange={setFocusMode}
        processedHtml={processedHtml}
      />

      {/* Settings - Mobile Modal */}
      <ReaderSettingsMobile
        open={settingsOpen && isMobile}
        onClose={() => setSettingsOpen(false)}
        fontSize={fontSize}
        onFontSizeChange={setFontSize}
        lineHeight={lineHeight}
        onLineHeightChange={setLineHeight}
        fontFamily={fontFamily}
        onFontFamilyChange={setFontFamily}
        theme={readerTheme}
        onThemeChange={setReaderTheme}
        focusMode={focusMode}
        onFocusModeChange={setFocusMode}
        processedHtml={processedHtml}
      />
    </Box>
  );
}