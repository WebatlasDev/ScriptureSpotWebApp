'use client';

import React from 'react';
import { Box, CircularProgress, Paper, Typography } from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';

interface BibleBookCardProps {
  book: {
    slug: string;
    name: string;
  };
  version: string;
  onSelect: (slug: string) => void;
  pending?: boolean;
  disabled?: boolean;
}

// Helper function to convert hex color to RGB for rgba values
const hexToRgb = (hex: string) => {
  // Remove # if present
  hex = hex.replace('#', '');
  
  // Parse hex
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  
  // Return RGB values as string
  return `${r}, ${g}, ${b}`;
};

export default function BibleBookCard({ book, version, onSelect, pending = false, disabled = false }: BibleBookCardProps) {
  // Bible-specific color scheme
  const bibleColor = '#278EFF';
  const bibleColorRgb = hexToRgb(bibleColor);

  return (
    <Paper
      component={Primitive.button as any}
      type="button"
      onClick={() => onSelect(book.slug)}
      disabled={disabled}
      sx={{
        padding: 2,
        textAlign: 'center',
        borderRadius: 2,
        background: `rgba(${bibleColorRgb}, 0.2)`,
        transition: 'all 0.2s',
        cursor: disabled ? 'not-allowed' : 'pointer',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        border: `1px solid rgba(${bibleColorRgb}, 0.5)`,
        opacity: disabled && !pending ? 0.75 : 1,
        width: '100%',
        pointerEvents: disabled ? 'none' : 'auto',
        '&:hover': !disabled ? {
          background: `rgba(${bibleColorRgb}, 0.3)`,
          transform: 'translateY(-2px)',
        } : {},
        '&:focus-visible': {
          outline: '2px solid rgba(255, 255, 255, 0.35)',
          outlineOffset: 2,
        },
        '&:disabled': {
          transform: 'none',
        },
      }}
      aria-busy={pending}
    >
      {pending ? (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
          <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
          <Typography color="#FFFFFF" fontWeight={600} fontSize={14}>
            Loading...
          </Typography>
        </Box>
      ) : (
        <Typography color="white" fontWeight={500}>
          {book.name}
        </Typography>
      )}
    </Paper>
  );
}
