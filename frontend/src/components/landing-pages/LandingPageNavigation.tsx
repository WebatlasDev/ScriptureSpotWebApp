'use client';

import React from 'react';
import { Box, Button } from '@mui/material';
import { ChevronLeftIcon } from '@/components/ui/phosphor-icons';
import { ChevronRightIcon } from '@/components/ui/phosphor-icons';
import Link from 'next/link';

interface NavigationButton {
  label: string;
  href: string;
  direction: 'prev' | 'next';
}

interface LandingPageNavigationProps {
  // For determining navigation context
  pageType: 'chapter-study' | 'verse-takeaway' | 'book-overview';
  
  // Book/chapter/verse context
  bookSlug?: string;
  bookName?: string;
  chapterNumber?: number;
  verseNumber?: number;
  verseRange?: string;
  totalChapters?: number; // For knowing max chapters
  
  // For book overview sections
  currentSection?: string;
  sections?: string[];
  
  // Custom navigation if needed
  customPrevious?: NavigationButton;
  customNext?: NavigationButton;
  
  // Color scheme for buttons (for chapter study)
  colorScheme?: {
    primary: string;
    gradient?: string;
    outline: string;
    chipText: string;
  };
}

export default function LandingPageNavigation({
  pageType,
  bookSlug,
  bookName,
  chapterNumber,
  verseNumber,
  verseRange,
  totalChapters,
  currentSection,
  sections = [],
  customPrevious,
  customNext,
  colorScheme = {
    primary: '#ED27FF',
    gradient: 'linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%)',
    outline: 'rgba(237, 39, 255, 0.5)',
    chipText: '#FFFFFF'
  }
}: LandingPageNavigationProps) {
  
  // Book overview color scheme (blue version)
  const BOOK_COLORS = {
    primary: '#278EFF',
    gradient: 'linear-gradient(36deg, rgba(39, 142, 255, 0.30) 0%, rgba(9, 146, 50, 0.30) 100%)',
    outline: 'rgba(39, 142, 255, 0.5)',
    chipText: '#FFFFFF'
  };
  
  // Determine navigation buttons based on page type
  const getNavigationButtons = (): { previous?: NavigationButton; next?: NavigationButton } => {
    // Use custom navigation if provided
    if (customPrevious || customNext) {
      return { previous: customPrevious, next: customNext };
    }
    
    switch (pageType) {
      case 'chapter-study':
        // Navigate between chapters
        if (!bookSlug || !chapterNumber) return {};
        
        const prevChapter = chapterNumber > 1 ? chapterNumber - 1 : null;
        const nextChapter = totalChapters && chapterNumber < totalChapters ? chapterNumber + 1 : null;
        
        return {
          previous: prevChapter ? {
            label: `${prevChapter}`,
            href: `/landing/${bookSlug}-${prevChapter}-study-guide`,
            direction: 'prev' as const
          } : undefined,
          next: nextChapter ? {
            label: `${nextChapter}`,
            href: `/landing/${bookSlug}-${nextChapter}-study-guide`,
            direction: 'next' as const
          } : undefined
        };
        
      case 'verse-takeaway':
        // Navigate between verses
        if (!bookSlug || !chapterNumber || !verseNumber) return {};
        
        const prevVerse = verseNumber > 1 ? verseNumber - 1 : null;
        const nextVerse = verseNumber + 1;
        
        return {
          previous: prevVerse ? {
            label: `Verse ${prevVerse}`,
            href: `/landing/${bookSlug}-${chapterNumber}-${prevVerse}-takeaways`,
            direction: 'prev' as const
          } : undefined,
          next: {
            label: `Verse ${nextVerse}`,
            href: `/landing/${bookSlug}-${chapterNumber}-${nextVerse}-takeaways`,
            direction: 'next' as const
          }
        };
        
      case 'book-overview':
        // Book overview sections in order with their URL slugs
        const bookSections = [
          { label: 'Author', slug: 'author' },
          { label: 'Audience', slug: 'audience' },
          { label: 'Composition', slug: 'composition' },
          { label: 'Objective', slug: 'objective' },
          { label: 'Unique Elements', slug: 'unique-elements' },
          { label: 'Key Themes', slug: 'key-themes' },
          { label: 'Teaching Highlights', slug: 'teaching-highlights' },
          { label: 'Historical Context', slug: 'historical-background' },
          { label: 'Cultural Background', slug: 'cultural-background' },
          { label: 'Political Landscape', slug: 'political-landscape' }
        ];
        
        // Find current section index
        const sectionIndex = currentSection ? bookSections.findIndex(s => 
          s.label.toLowerCase() === currentSection.toLowerCase()
        ) : 0;
        
        const prevSectionIndex = sectionIndex > 0 ? sectionIndex - 1 : -1;
        const nextSectionIndex = sectionIndex < bookSections.length - 1 ? sectionIndex + 1 : -1;
        
        return {
          previous: prevSectionIndex >= 0 && bookSlug ? {
            label: bookSections[prevSectionIndex].label,
            href: `/landing/${bookSections[prevSectionIndex].slug}-of-${bookSlug}`,
            direction: 'prev' as const
          } : undefined,
          next: nextSectionIndex >= 0 && bookSlug ? {
            label: bookSections[nextSectionIndex].label,
            href: `/landing/${bookSections[nextSectionIndex].slug}-of-${bookSlug}`,
            direction: 'next' as const
          } : undefined
        };
        
      default:
        return {};
    }
  };
  
  const { previous, next } = getNavigationButtons();
  
  // Determine which color scheme to use
  const buttonColors = pageType === 'book-overview' ? BOOK_COLORS : colorScheme;
  
  // Don't render if no navigation buttons
  if (!previous && !next) return null;
  
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        gap: 3, 
        mt: 6, 
        mb: 4,
        width: '100%',
        flexDirection: 'row'
      }}
    >
      {/* Previous Button */}
      <Link 
        href={previous?.href || '#'} 
        style={{ 
          textDecoration: 'none', 
          flex: 1,
          pointerEvents: previous ? 'auto' : 'none'
        }}
      >
        <Button
          disabled={!previous}
          sx={{
            width: '100%',
            background: previous ? (buttonColors.gradient || `linear-gradient(0deg, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.10) 0%, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.10) 100%), #121212`) : 'rgba(255, 255, 255, 0.05)',
            color: previous ? '#FFFAFA' : 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3.5,
            px: { xs: 2, sm: 4 },
            py: 2,
            fontSize: 16,
            fontWeight: 500,
            textTransform: 'none',
            minHeight: 56,
            border: previous ? `2px solid ${buttonColors.outline}` : '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: previous ? (buttonColors.gradient || `linear-gradient(0deg, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.15) 0%, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.15) 100%), #121212`) : 'rgba(255, 255, 255, 0.05)',
              borderColor: previous ? buttonColors.outline : 'rgba(255, 255, 255, 0.1)',
              opacity: previous ? 0.9 : 1,
            },
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiButton-startIcon': {
              color: previous ? buttonColors.chipText : 'rgba(255, 255, 255, 0.3)',
              fontSize: 22,
            },
          }}
          startIcon={<ChevronLeftIcon sx={{ fontSize: 22 }} />}
        >
          {previous ? (
            pageType === 'book-overview' ? (
              <span><strong>{previous.label}</strong></span>
            ) : (
              <span>Chapter <strong>{previous.label}</strong></span>
            )
          ) : (
            'Previous'
          )}
        </Button>
      </Link>
      
      {/* Next Button */}
      <Link 
        href={next?.href || '#'} 
        style={{ 
          textDecoration: 'none', 
          flex: 1,
          pointerEvents: next ? 'auto' : 'none'
        }}
      >
        <Button
          disabled={!next}
          sx={{
            width: '100%',
            background: next ? (buttonColors.gradient || `linear-gradient(0deg, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.10) 0%, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.10) 100%), #121212`) : 'rgba(255, 255, 255, 0.05)',
            color: next ? '#FFFAFA' : 'rgba(255, 255, 255, 0.3)',
            borderRadius: 3.5,
            px: { xs: 2, sm: 4 },
            py: 2,
            fontSize: 16,
            fontWeight: 500,
            textTransform: 'none',
            minHeight: 56,
            border: next ? `2px solid ${buttonColors.outline}` : '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              background: next ? (buttonColors.gradient || `linear-gradient(0deg, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.15) 0%, rgba(${parseInt(buttonColors.primary.slice(1, 3), 16)}, ${parseInt(buttonColors.primary.slice(3, 5), 16)}, ${parseInt(buttonColors.primary.slice(5, 7), 16)}, 0.15) 100%), #121212`) : 'rgba(255, 255, 255, 0.05)',
              borderColor: next ? buttonColors.outline : 'rgba(255, 255, 255, 0.1)',
              opacity: next ? 0.9 : 1,
            },
            '&:disabled': {
              color: 'rgba(255, 255, 255, 0.3)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
            },
            '& .MuiButton-endIcon': {
              color: next ? buttonColors.chipText : 'rgba(255, 255, 255, 0.3)',
              fontSize: 22,
            },
          }}
          endIcon={<ChevronRightIcon sx={{ fontSize: 22 }} />}
        >
          {next ? (
            pageType === 'book-overview' ? (
              <span><strong>{next.label}</strong></span>
            ) : (
              <span>Chapter <strong>{next.label}</strong></span>
            )
          ) : (
            'Next'
          )}
        </Button>
      </Link>
    </Box>
  );
}