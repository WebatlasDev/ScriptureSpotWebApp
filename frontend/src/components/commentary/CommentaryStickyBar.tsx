'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { KeyboardArrowDownIcon } from '@/components/ui/phosphor-icons';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';

interface CommentaryStickyBarProps {
  verseRanges: Array<{
    verseNumber: number;
    verseRange: string;
  }>;
  onJumpToVerse: (verseNumber: number) => void;
  authorColorScheme?: {
    chipBackground: string;
    chipText: string;
  };
}

export default function CommentaryStickyBar({
  verseRanges,
  onJumpToVerse,
  authorColorScheme,
}: CommentaryStickyBarProps) {
  const [selectedVerse, setSelectedVerse] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(true);

  const selectedLabel = useMemo(() => {
    if (selectedVerse === null) return '';
    const match = verseRanges.find((verse) => verse.verseNumber === selectedVerse);
    if (!match) return '';
    return match.verseRange || match.verseNumber.toString();
  }, [selectedVerse, verseRanges]);

  const handleVerseSelect = (verseNumber: number) => {
    setSelectedVerse(verseNumber);
    onJumpToVerse(verseNumber);
  };

  const isDropdownDisabled = verseRanges.length === 0;

  useEffect(() => {
    const footer = document.querySelector('footer');
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(!entry.isIntersecting);
      },
      {
        rootMargin: '50px 0px 0px 0px', // Start hiding 50px before footer comes into view
        threshold: 0,
      }
    );

    observer.observe(footer);

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 14,
        left: { 
          xs: '50%', 
          lg: 'calc(50% + 100px)' // Adjust for sidebar offset - content is shifted right from center
        },
        transform: 'translateX(-50%)',
        zIndex: 1000,
        backgroundColor: '#1A1A1A',
        borderRadius: '24px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        px: 1.5,
        py: 1.5,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        backdropFilter: 'blur(10px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
        maxWidth: { xs: 'calc(100vw - 48px)', sm: 'auto' },
        transition: isVisible ? 'opacity 0.2s ease-in' : 'opacity 0.6s ease-out',
        opacity: isVisible ? 1 : 0,
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
    >
      <Typography
        sx={{
          color: 'rgba(255, 255, 255, 0.8)',
          fontSize: 14,
          fontWeight: 500,
          whiteSpace: 'nowrap',
        }}
      >
        Jump to:
      </Typography>

      <DropdownMenu.Root>
        <DropdownMenu.Trigger asChild>
          <Box
            component="button"
            type="button"
            disabled={isDropdownDisabled}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFAFA',
              borderRadius: '12px',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              px: 2,
              py: 1,
              fontSize: 14,
              fontWeight: 500,
              cursor: isDropdownDisabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease, border-color 0.2s ease',
              minWidth: 140,
              justifyContent: 'space-between',
              '&:hover': {
                backgroundColor: isDropdownDisabled ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.08)',
                borderColor: isDropdownDisabled ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.3)',
              },
              '&:focus-visible': {
                outline: 'none',
                borderColor: authorColorScheme?.chipText || '#FFD700',
                boxShadow: '0 0 0 2px rgba(255, 255, 255, 0.15)',
              },
              opacity: isDropdownDisabled ? 0.6 : 1,
            }}
          >
            <Box
              component="span"
              sx={{
                textAlign: 'left',
                flex: 1,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {selectedVerse !== null && selectedLabel
                ? `Verse ${selectedLabel}`
                : 'Select Verse'}
            </Box>
            <KeyboardArrowDownIcon sx={{ fontSize: 20, color: 'rgba(255, 255, 255, 0.6)' }} />
          </Box>
        </DropdownMenu.Trigger>

        <DropdownMenu.Portal>
          <DropdownMenu.Content
            sideOffset={8}
            align="start"
            style={{
              backgroundColor: '#1A1A1A',
              border: '1px solid rgba(255, 255, 255, 0.2)',
              borderRadius: 12,
              padding: '8px',
              maxHeight: '40vh',
              overflowY: 'auto',
              boxShadow: '0 10px 32px rgba(0, 0, 0, 0.45)',
              minWidth: 180,
            }}
          >
            {verseRanges.map((verse) => (
              <DropdownMenu.Item
                key={verse.verseNumber}
                onSelect={() => handleVerseSelect(verse.verseNumber)}
                asChild
              >
                <Box
                  sx={{
                    color: '#FFFAFA',
                    fontSize: 14,
                    fontWeight: 400,
                    px: 1.5,
                    py: 1,
                    borderRadius: 1.5,
                    cursor: 'pointer',
                    transition: 'background-color 0.2s ease, color 0.2s ease',
                    '&[data-highlighted]': {
                      backgroundColor: 'rgba(255, 255, 255, 0.12)',
                    },
                  }}
                >
                  Verse {verse.verseRange || verse.verseNumber}
                </Box>
              </DropdownMenu.Item>
            ))}
          </DropdownMenu.Content>
        </DropdownMenu.Portal>
      </DropdownMenu.Root>
    </Paper>
  );
}
