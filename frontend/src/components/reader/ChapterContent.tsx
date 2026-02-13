'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import useResponsive from '@/hooks/useResponsive';
import VersePreview from './VersePreview';

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

interface ChapterContentProps {
  processedHtml: string;
  onTextSelection: (selection: TextSelection | null) => void;
  highlights: Highlight[];
  underlines: Underline[];
  searchTerm: string;
  fontSize: number;
  lineHeight: number;
  fontFamily: 'serif' | 'sans';
  readerTheme: 'light' | 'sepia' | 'dark';
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
  bookName?: string;
  chapterNumber?: number;
  chapterTitle?: string;
}

export default function ChapterContent({
  processedHtml,
  onTextSelection,
  highlights,
  underlines,
  searchTerm,
  fontSize,
  lineHeight,
  fontFamily,
  readerTheme,
  scrollContainerRef,
  bookName,
  chapterNumber,
  chapterTitle,
}: ChapterContentProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const { isMdDown } = useResponsive();
  const [versePreview, setVersePreview] = useState<{
    anchorEl: HTMLElement;
    reference: string;
  } | null>(null);

  // Enhanced sentence detection with multiple fallback strategies
  const findSentenceElement = useCallback((target: Element, range?: Range): Element | null => {
    // Strategy 1: Direct sentence element or closest sentence ancestor
    let sentenceElement = target.closest('.sentence');
    if (sentenceElement) return sentenceElement;

    // Strategy 2: If we have a range, try to find sentence from range
    if (range) {
      let currentNode: Node | null = range.commonAncestorContainer;
      
      while (currentNode && currentNode !== contentRef.current) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          const element = currentNode as Element;
          if (element.classList?.contains('sentence')) {
            return element;
          }
        }
        currentNode = currentNode.parentNode;
      }

      // Try start container
      currentNode = range.startContainer;
      while (currentNode && currentNode !== contentRef.current) {
        if (currentNode.nodeType === Node.ELEMENT_NODE) {
          const element = currentNode as Element;
          if (element.classList?.contains('sentence')) {
            return element;
          }
        }
        currentNode = currentNode.parentNode;
      }
    }

    // Strategy 3: Look for sentence elements among siblings
    let parent = target.parentElement;
    while (parent && parent !== contentRef.current) {
      const sentences = parent.querySelectorAll('.sentence');
      for (const sentence of sentences) {
        if (sentence.contains(target)) {
          return sentence;
        }
      }
      parent = parent.parentElement;
    }

    // Strategy 4: Find by data-sentence-id attribute (fallback)
    const elementWithId = target.closest('[data-sentence-id]');
    if (elementWithId && elementWithId.classList?.contains('sentence')) {
      return elementWithId;
    }

    return null;
  }, []);

  // Unified selection handler with enhanced sentence detection
  const handleSelection = useCallback((event: Event, forceSelectSentence = false) => {
    const selection = window.getSelection();
    const target = event.target as Element;
    
    // Clear any existing selection state first
    let selectedText = '';
    let sentenceElement: Element | null = null;
    let range: Range | null = null;
    let isFullSentence = false;


    // Check if we have a text selection (drag selection)
    if (selection && !selection.isCollapsed && !forceSelectSentence) {
      range = selection.getRangeAt(0);
      selectedText = selection.toString().trim();
      
      if (selectedText) {
        // Use enhanced sentence detection
        sentenceElement = findSentenceElement(target, range);
      }
    }

    // If no drag selection or force sentence selection, try to select the clicked sentence
    if (!selectedText || forceSelectSentence) {
      sentenceElement = findSentenceElement(target);
      
      if (sentenceElement) {
        const sentenceText = sentenceElement.textContent || '';
        
        if (sentenceText.trim()) {
          // Create range for the entire sentence
          range = document.createRange();
          range.selectNodeContents(sentenceElement);
          selectedText = sentenceText.trim();
          isFullSentence = true;
          
          // Clear browser selection to avoid conflicts
          if (selection) {
            selection.removeAllRanges();
          }
        }
      }
    }

    // If we still don't have a valid selection, clear the popover
    if (!selectedText || !sentenceElement || !range) {
      onTextSelection(null);
      return;
    }

    // Get sentence ID with fallback
    let sentenceId = sentenceElement.getAttribute('data-sentence-id');
    
    if (!sentenceId) {
      // Generate a fallback ID based on text content
      sentenceId = `fallback-${selectedText.substring(0, 20).replace(/\s+/g, '-').toLowerCase()}`;
      sentenceElement.setAttribute('data-sentence-id', sentenceId);
    }

    // Calculate position for popover with better positioning
    const rect = range.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    // Center horizontally, but ensure it stays within viewport
    let x = rect.left + rect.width / 2;
    x = Math.max(160, Math.min(x, viewportWidth - 160)); // Keep 160px from edges
    
    // Position above selection, but ensure it's visible
    let y = rect.top - 10;
    if (y < 80) { // If too close to top, position below
      y = rect.bottom + 10;
    }

    
    onTextSelection({
      text: selectedText,
      sentenceId,
      range,
      x,
      y,
    });
  }, [onTextSelection, findSentenceElement]);

  // Handle mouseup for drag selections
  const handleMouseUp = useCallback((event: Event) => {
    // Add small delay to ensure selection is complete
    setTimeout(() => {
      handleSelection(event, false);
    }, 10);
  }, [handleSelection]);

  // Handle single click on sentences
  const handleSentenceClick = useCallback((event: Event) => {
    const target = event.target as Element;
    
    // Only proceed if clicking directly on a sentence element
    if (target.closest('.sentence')) {
      // Prevent event if there's already a text selection
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        return;
      }
      
      // Force sentence selection
      handleSelection(event, true);
    }
  }, [handleSelection]);

  // Handle verse reference hover
  const handleVerseHover = useCallback((event: Event) => {
    const target = event.target as HTMLElement;
    
    // Check if hovering over a verse reference link
    if (target.matches('a[href*="#verse"]') || target.closest('a[href*="#verse"]')) {
      const link = target.matches('a') ? target : target.closest('a');
      if (link) {
        const href = link.getAttribute('href');
        const referenceMatch = href?.match(/#verse-(.+)/);
        if (referenceMatch) {
          const reference = referenceMatch[1].replace(/-/g, ' ');
          setVersePreview({
            anchorEl: link as HTMLElement,
            reference: reference,
          });
        }
      }
    }
  }, []);

  const handleVerseLeave = useCallback(() => {
    setVersePreview(null);
  }, []);

  // Track mouse state to differentiate clicks from drags
  const mouseStateRef = useRef<{
    isMouseDown: boolean;
    startX: number;
    startY: number;
    hasMoved: boolean;
  }>({ isMouseDown: false, startX: 0, startY: 0, hasMoved: false });

  // Handle mouse down to track drag start
  const handleMouseDown = useCallback((event: Event) => {
    const mouseEvent = event as MouseEvent;
    mouseStateRef.current = {
      isMouseDown: true,
      startX: mouseEvent.clientX,
      startY: mouseEvent.clientY,
      hasMoved: false,
    };
  }, []);

  // Handle mouse move to detect drag
  const handleMouseMove = useCallback((event: Event) => {
    if (!mouseStateRef.current.isMouseDown) return;
    
    const mouseEvent = event as MouseEvent;
    const deltaX = Math.abs(mouseEvent.clientX - mouseStateRef.current.startX);
    const deltaY = Math.abs(mouseEvent.clientY - mouseStateRef.current.startY);
    
    // Consider it a drag if moved more than 5 pixels
    if (deltaX > 5 || deltaY > 5) {
      mouseStateRef.current.hasMoved = true;
    }
  }, []);

  // Enhanced mouseup handler that considers mouse state
  const handleMouseUpWithState = useCallback((event: Event) => {
    const mouseState = mouseStateRef.current;
    
    // Reset mouse state
    mouseStateRef.current = { isMouseDown: false, startX: 0, startY: 0, hasMoved: false };
    
    // If it was a drag operation or there's a text selection, handle as drag
    const selection = window.getSelection();
    if (mouseState.hasMoved || (selection && !selection.isCollapsed)) {
      // Add small delay to ensure selection is complete
      setTimeout(() => {
        handleSelection(event, false);
      }, 10);
    } else {
      // It was a click - try to select the sentence
      setTimeout(() => {
        handleSelection(event, true);
      }, 10);
    }
  }, [handleSelection]);

  // Touch handling for mobile
  const touchStateRef = useRef<{
    startX: number;
    startY: number;
    startTime: number;
  }>({ startX: 0, startY: 0, startTime: 0 });

  const handleTouchStart = useCallback((event: TouchEvent) => {
    const touch = event.touches[0];
    touchStateRef.current = {
      startX: touch.clientX,
      startY: touch.clientY,
      startTime: Date.now(),
    };
  }, []);

  const handleTouchEnd = useCallback((event: TouchEvent) => {
    const touchState = touchStateRef.current;
    const duration = Date.now() - touchState.startTime;
    
    // If it was a quick tap (< 300ms), treat as sentence selection
    // If longer, let normal text selection handle it
    if (duration < 300) {
      setTimeout(() => {
        handleSelection(event as any, true);
      }, 10);
    } else {
      setTimeout(() => {
        handleSelection(event as any, false);
      }, 10);
    }
  }, [handleSelection]);

  // Set up event listeners with improved handling
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;

    // Mouse events
    contentElement.addEventListener('mousedown', handleMouseDown);
    contentElement.addEventListener('mousemove', handleMouseMove);
    contentElement.addEventListener('mouseup', handleMouseUpWithState);
    
    // Touch events for mobile
    contentElement.addEventListener('touchstart', handleTouchStart as EventListener);
    contentElement.addEventListener('touchend', handleTouchEnd as EventListener);

    // Verse reference hover handlers
    contentElement.addEventListener('mouseover', handleVerseHover);
    contentElement.addEventListener('mouseleave', handleVerseLeave);

    return () => {
      contentElement.removeEventListener('mousedown', handleMouseDown);
      contentElement.removeEventListener('mousemove', handleMouseMove);
      contentElement.removeEventListener('mouseup', handleMouseUpWithState);
      contentElement.removeEventListener('touchstart', handleTouchStart as EventListener);
      contentElement.removeEventListener('touchend', handleTouchEnd as EventListener);
      contentElement.removeEventListener('mouseover', handleVerseHover);
      contentElement.removeEventListener('mouseleave', handleVerseLeave);
    };
  }, [handleMouseDown, handleMouseMove, handleMouseUpWithState, handleTouchStart, handleTouchEnd, handleVerseHover, handleVerseLeave, processedHtml]);

  // Apply highlights and underlines directly to DOM as fallback
  useEffect(() => {
    const contentElement = contentRef.current;
    if (!contentElement) return;
    
    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      const allSentences = contentElement.querySelectorAll('.sentence');
      
      // Create sets for efficient lookups
      const highlightMap = new Map(highlights.map(h => [h.sentenceId, h.color]));
      const underlineSet = new Set(underlines.map(u => u.sentenceId));
      
      allSentences.forEach(sentence => {
        const sentenceId = sentence.getAttribute('data-sentence-id');
        if (!sentenceId) return;
        
        // Handle highlights
        const highlightColors = ['yellow', 'green', 'blue', 'red', 'purple'];
        const currentHighlightColor = highlightMap.get(sentenceId);
        
        highlightColors.forEach(color => {
          const className = `highlight-${color}`;
          if (currentHighlightColor === color) {
            // Add if not already present
            if (!sentence.classList.contains(className)) {
              sentence.classList.add(className);
            }
          } else {
            // Remove if present but shouldn't be
            if (sentence.classList.contains(className)) {
              sentence.classList.remove(className);
            }
          }
        });
        
        // Handle underlines
        if (underlineSet.has(sentenceId)) {
          // Add underline if not already present
          if (!sentence.classList.contains('underline')) {
            sentence.classList.add('underline');
          }
        } else {
          // Remove underline if present but shouldn't be
          if (sentence.classList.contains('underline')) {
            sentence.classList.remove('underline');
          }
        }
      });
    }, 50);

    return () => clearTimeout(timer);
  }, [highlights, underlines, processedHtml]);

  // Apply highlights and underlines to HTML
  const applyHighlightsAndUnderlines = useCallback((html: string) => {
    let processedHtml = html;
    
    // Apply user highlights
    highlights.forEach(highlight => {
      // Create a regex that matches the span with the specific sentence ID
      // This regex handles attributes in any order
      const regex = new RegExp(
        `<span([^>]*?)data-sentence-id="${highlight.sentenceId}"([^>]*?)>`,
        'gi'
      );
      
      processedHtml = processedHtml.replace(regex, (match, beforeId, afterId) => {
        const fullMatch = beforeId + `data-sentence-id="${highlight.sentenceId}"` + afterId;
        
        // Check if there's already a class attribute
        if (fullMatch.includes('class="')) {
          // Remove any existing highlight classes and add the new one
          let modifiedMatch = match.replace(/highlight-\w+\s*/g, '');
          modifiedMatch = modifiedMatch.replace(
            /class="([^"]*)"/,
            (classMatch, classContent) => {
              // Add highlight class at the beginning of the class list
              return `class="highlight-${highlight.color} ${classContent.trim()}"`;
            }
          );
          return modifiedMatch;
        } else {
          // No class attribute, add one
          return match.replace('>', ` class="highlight-${highlight.color}">`)
        }
      });
    });
    
    // Apply underlines
    underlines.forEach(underline => {
      const regex = new RegExp(
        `<span([^>]*?)data-sentence-id="${underline.sentenceId}"([^>]*?)>`,
        'gi'
      );
      
      processedHtml = processedHtml.replace(regex, (match, beforeId, afterId) => {
        const fullMatch = beforeId + `data-sentence-id="${underline.sentenceId}"` + afterId;
        
        // Check if there's already a class attribute
        if (fullMatch.includes('class="')) {
          // Add underline class if not already present
          if (!match.includes('underline')) {
            return match.replace(
              /class="([^"]*)"/,
              (classMatch, classContent) => {
                return `class="${classContent.trim()} underline"`;
              }
            );
          }
          return match;
        } else {
          // No class attribute, add one
          return match.replace('>', ` class="underline">`)
        }
      });
    });
    
    return processedHtml;
  }, [highlights, underlines]);

  // Highlight search terms
  const highlightSearchTerms = useCallback((html: string) => {
    if (!searchTerm) return html;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return html.replace(regex, '<mark class="search-highlight">$1</mark>');
  }, [searchTerm]);

  // Get font family CSS
  const getFontFamily = () => {
    return fontFamily === 'serif' 
      ? '"Literata", Georgia, "Times New Roman", serif'
      : '"Inter", "Roboto", "Helvetica", "Arial", sans-serif';
  };

  // Get theme colors
  const getThemeColors = () => {
    switch (readerTheme) {
      case 'light':
        return {
          text: '#000000',
          textSecondary: 'rgba(0, 0, 0, 0.7)',
          background: '#FFFFFF',
        };
      case 'sepia':
        return {
          text: '#5C4B3A',
          textSecondary: 'rgba(92, 75, 58, 0.7)',
          background: '#F4F1E8',
        };
      case 'dark':
      default:
        return {
          text: '#FFFAFA',
          textSecondary: 'rgba(255, 249, 249, 0.6)',
          background: '#111111',
        };
    }
  };

  const themeColors = getThemeColors();
  // Apply highlights and underlines first, then search highlighting
  const contentWithHighlights = applyHighlightsAndUnderlines(processedHtml);
  const processedContent = highlightSearchTerms(contentWithHighlights);

  return (
    <>
      <Box 
        ref={scrollContainerRef || internalScrollRef}
        sx={{ 
        flex: 1,
        overflow: 'auto',
        width: '100%',
        // Hide scrollbar for Chrome, Safari and Opera
        '&::-webkit-scrollbar': {
          display: 'none',
        },
        // Hide scrollbar for IE, Edge
        msOverflowStyle: 'none',
        // Hide scrollbar for Firefox
        scrollbarWidth: 'none',
      }}>
        <Box
          sx={{
            px: { xs: 2, sm: 3, md: 4, lg: 6 },
            py: { xs: 3, sm: 4, md: 5 },
            pb: { xs: 11, sm: 11, md: 14 },
            maxWidth: 800,
            mx: 'auto',
            width: '100%',
          }}
        >
          {/* Chapter Header */}
          {chapterNumber && (
            <Box
              sx={{
                textAlign: 'center',
                mb: { xs: 5, sm: 6, md: 8 },
                pb: { xs: 4, sm: 5, md: 6 },
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: 0,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  width: { xs: '80px', sm: '100px', md: '120px' },
                  height: '1px',
                  background: readerTheme === 'dark'
                    ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15) 20%, rgba(255, 255, 255, 0.15) 80%, transparent)'
                    : readerTheme === 'sepia'
                    ? 'linear-gradient(90deg, transparent, rgba(92, 75, 58, 0.2) 20%, rgba(92, 75, 58, 0.2) 80%, transparent)'
                    : 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.12) 20%, rgba(0, 0, 0, 0.12) 80%, transparent)',
                },
              }}
            >
              
              {/* Ornamental element above chapter */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  mb: 2,
                  opacity: 0.4,
                }}
              >
                <Box
                  sx={{
                    width: { xs: '40px', sm: '50px', md: '60px' },
                    height: '1px',
                    background: readerTheme === 'dark'
                      ? 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3))'
                      : readerTheme === 'sepia'
                      ? 'linear-gradient(90deg, transparent, rgba(92, 75, 58, 0.4))'
                      : 'linear-gradient(90deg, transparent, rgba(0, 0, 0, 0.25))',
                  }}
                />
                <Typography
                  sx={{
                    mx: 2,
                    fontSize: { xs: '1rem', sm: '1.1rem', md: '1.2rem' },
                    color: themeColors.text,
                    opacity: 0.6,
                    lineHeight: 1,
                  }}
                >
                  ❦
                </Typography>
                <Box
                  sx={{
                    width: { xs: '40px', sm: '50px', md: '60px' },
                    height: '1px',
                    background: readerTheme === 'dark'
                      ? 'linear-gradient(270deg, transparent, rgba(255, 255, 255, 0.3))'
                      : readerTheme === 'sepia'
                      ? 'linear-gradient(270deg, transparent, rgba(92, 75, 58, 0.4))'
                      : 'linear-gradient(270deg, transparent, rgba(0, 0, 0, 0.25))',
                  }}
                />
              </Box>

              <>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '0.65rem', sm: '0.7rem', md: '0.75rem' },
                      fontFamily: fontFamily === 'serif' ? '"Literata", serif' : 'var(--font-plus-jakarta)',
                      fontWeight: 600,
                      letterSpacing: '0.25em',
                      textTransform: 'uppercase',
                      color: themeColors.textSecondary,
                      mb: 1,
                      opacity: 0.5,
                    }}
                  >
                    Chapter
                  </Typography>
                  <Typography
                    component="div"
                    sx={{
                      fontSize: { xs: '2.5rem', sm: '3rem', md: '3.5rem' },
                      fontFamily: fontFamily === 'serif' ? '"Literata", serif' : 'var(--font-plus-jakarta)',
                      fontWeight: 200,
                      color: themeColors.text,
                      lineHeight: 1,
                      mb: chapterTitle ? 3 : 0,
                      letterSpacing: '0.02em',
                      // Roman numeral style for classic look
                      fontVariantNumeric: 'oldstyle-nums',
                    }}
                  >
                    {chapterNumber}
                  </Typography>
                  
                  {chapterTitle && (
                    <>
                      {/* Small decorative element */}
                      <Box
                        sx={{
                          width: '40px',
                          height: '1px',
                          background: readerTheme === 'dark'
                            ? 'rgba(255, 255, 255, 0.15)'
                            : readerTheme === 'sepia'
                            ? 'rgba(92, 75, 58, 0.2)'
                            : 'rgba(0, 0, 0, 0.1)',
                          mx: 'auto',
                          mb: 2.5,
                        }}
                      />
                      <Typography
                        sx={{
                          fontSize: { xs: '1rem', sm: '1.15rem', md: '1.3rem' },
                          fontFamily: fontFamily === 'serif' ? '"Literata", serif' : 'var(--font-plus-jakarta)',
                          fontWeight: 400,
                          fontStyle: 'italic',
                          color: themeColors.text,
                          lineHeight: 1.5,
                          maxWidth: '650px',
                          mx: 'auto',
                          px: 3,
                          opacity: 0.9,
                          letterSpacing: '0.01em',
                        }}
                      >
                        {chapterTitle}
                      </Typography>
                    </>
                  )}
                </>
              
              {/* Small ornamental element at bottom */}
              <Box
                sx={{
                  mt: { xs: 3, sm: 4 },
                  fontSize: { xs: '0.8rem', sm: '0.9rem' },
                  color: themeColors.text,
                  opacity: 0.3,
                }}
              >
                ◆ ◆ ◆
              </Box>
            </Box>
          )}

          <Box
            ref={contentRef}
            className={`reader-content reader-theme-${readerTheme}`}
            sx={{
            fontSize: `${fontSize}px`,
            lineHeight: lineHeight,
            fontFamily: getFontFamily(),
            color: themeColors.text,
            userSelect: 'text',
            
            // Sentence styling with enhanced hover effects
            '& .sentence': {
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              position: 'relative',
              
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.12)',
                borderRadius: '4px',
              },
            },

            // Bible verse reference links
            '& a[href*="#verse"]': {
              color: themeColors.text,
              textDecoration: 'underline',
              textDecorationColor: 'rgba(40, 142, 255, 0.4)',
              textUnderlineOffset: '2px',
              transition: 'all 0.2s ease',
              
              '&:hover': {
                color: '#278EFF',
                textDecorationColor: '#278EFF',
                cursor: 'pointer',
              },
            },


            // Paragraph spacing
            '& p': {
              marginBottom: '1.2em',
              textAlign: 'justify',
              '&:last-child': {
                marginBottom: 0,
              },
            },

            // Responsive typography
            [isMdDown ? '@media (max-width: 960px)' : '']: {
              fontSize: `${Math.max(fontSize - 2, 14)}px`,
            },

            // Improved text rendering
            textRendering: 'optimizeLegibility',
            WebkitFontSmoothing: 'antialiased',
            MozOsxFontSmoothing: 'grayscale',

            // Better word wrapping
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            hyphens: 'auto',
          }}
          dangerouslySetInnerHTML={{ __html: processedContent }}
        />
        </Box>
      </Box>

      {/* Verse Preview Tooltip */}
      <VersePreview
        anchorEl={versePreview?.anchorEl || null}
        reference={versePreview?.reference || ''}
        version="BSB" // This could be made dynamic
        open={!!versePreview}
      />
    </>
  );
}