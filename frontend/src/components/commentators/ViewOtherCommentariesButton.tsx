'use client';

import React from 'react';
import { Box, Avatar, CircularProgress } from '@mui/material';
import { ChevronRightIcon } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import { Primitive } from '@radix-ui/react-primitive';
import { useCommentaryNavigation } from '@/hooks/useCommentaryNavigation';

interface ViewOtherCommentariesButtonProps {
  href: string;
  authors: any[];
  totalCount: number;
}

export default function ViewOtherCommentariesButton({
  href,
  authors,
  totalCount,
}: ViewOtherCommentariesButtonProps) {
  const { isNavigating, handleClick } = useCommentaryNavigation(href);

  if (!href) {
    return null;
  }

  return (
    <Box
      component={Primitive.button}
      type="button"
      onClick={handleClick}
      disabled={isNavigating}
      aria-busy={isNavigating}
      aria-label={`View ${totalCount} other commentaries on this passage`}
      sx={{
        flex: 1,
        minHeight: 56,
        borderRadius: 28,
        px: 4,
        py: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        color: '#FFFAFA',
        width: '100%',
        border: '2px solid rgba(255, 255, 255, 0.1)',
        transition: 'all 0.2s ease-in-out',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        cursor: isNavigating ? 'not-allowed' : 'pointer',
        pointerEvents: isNavigating ? 'none' : 'auto',
        '&:focus-visible': {
          outline: '2px solid rgba(255, 255, 255, 0.35)',
          outlineOffset: 4,
        },
        '&:hover': {
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          borderColor: 'rgba(255, 255, 255, 0.2)',
          opacity: 0.9,
        },
        '&:disabled': {
          cursor: 'not-allowed',
          opacity: 0.65,
          pointerEvents: 'none',
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Box sx={{ display: 'flex', gap: -0.5 }}>
          {authors.map((commentaryItem: any, index: number) => (
            <Avatar
              key={`${commentaryItem.author.name}-${index}`}
              alt={commentaryItem.author.name}
              sx={{
                width: 32,
                height: 32,
                marginLeft: index > 0 ? '-8px' : 0,
                zIndex: authors.length - index,
                fontSize: 12,
                background: commentaryItem.author.colorScheme?.primary
                  ? `linear-gradient(216deg, ${commentaryItem.author.colorScheme.primary} 0%, black 100%)`
                  : '#5B41DE',
              }}
            >
              {commentaryItem.author.image ? (
                <Image
                  src={commentaryItem.author.image}
                  alt={commentaryItem.author.name}
                  width={32}
                  height={32}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              ) : (
                commentaryItem.author.name.charAt(0)
              )}
            </Avatar>
          ))}
        </Box>
        <Box
          sx={{
            textAlign: 'left',
            whiteSpace: 'nowrap',
            fontSize: { xs: 15, sm: 16 },
            fontWeight: 500,
            lineHeight: 1.2,
          }}
        >
          {isNavigating ? 'Loading...' : `View ${totalCount} more`}
        </Box>
      </Box>
      {isNavigating ? (
        <CircularProgress size={20} sx={{ color: '#FFFAFA' }} />
      ) : (
        <ChevronRightIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
      )}
    </Box>
  );
}
