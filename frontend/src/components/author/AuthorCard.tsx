'use client';

import { Box, CircularProgress, Typography } from '@mui/material';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useState, useTransition } from 'react';
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@/components/ui/phosphor-icons';
import { keyframes } from '@mui/system';
import { useRouter } from 'next/navigation';
import type { MouseEvent } from 'react';
import { AuthorFromAPI } from '@/types/author';
import { Primitive } from '@radix-ui/react-primitive';
import { formatCenturyFromYear } from '@/utils/century';

const shimmer = keyframes`
  0% {
    background-position: -150% 0;
  }
  100% {
    background-position: 150% 0;
  }
`;

interface AuthorCardProps {
  author: AuthorFromAPI;
}

export default function AuthorCard({ author }: AuthorCardProps) {
  const router = useRouter();
  const [isHovered, setIsHovered] = useState(false);
  const [isNavigating, startNavigationTransition] = useTransition();

  const defaultColors = {
    primary: '#278EFF',
    gradient: 'linear-gradient(0deg, rgba(39, 129, 255, 0.10) 0%, rgba(39, 129, 255, 0.10) 100%), #121212',
    outline: 'rgba(39, 129, 255, 0.20)',
    chipBackground: 'rgba(39, 129, 255, 0.30)',
    chipText: '#96C2FF',
    fadeColor: '#141D2A',
  };

  const colors = author.colorScheme ?? defaultColors;
  
  // Create formatted years display
  const yearsDisplay = (() => {
    if (author.birthYear && author.deathYear) {
      return `${author.birthYear}–${author.deathYear}`;
    } else if (author.birthYear) {
      return `${author.birthYear}–`;
    }
    return '';
  })();

  const birthCenturyTag = formatCenturyFromYear(author.birthYear);

  // Select which tags to display (like CommentaryCard - century first, then occupation, then tradition)
  const displayTags: string[] = [];
  const displayTagsMobile: string[] = [];
  
  // Desktop tags (century and religious tradition only)
  if (birthCenturyTag) {
    displayTags.push(birthCenturyTag);
  }
  if (author.religiousTradition) {
    displayTags.push(author.religiousTradition);
  }
  
  // Mobile tags (no occupation, no nationality)
  if (birthCenturyTag) {
    displayTagsMobile.push(birthCenturyTag);
  }
  if (author.religiousTradition && displayTagsMobile.length < 3) {
    displayTagsMobile.push(author.religiousTradition);
  }

  const href = `/commentators/${author.slug}/commentaries`;

  const handleClick = useCallback((event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1) {
      return;
    }

    event.preventDefault();

    if (isNavigating) {
      return;
    }

    startNavigationTransition(() => {
      router.push(href);
    });
  }, [href, isNavigating, router, startNavigationTransition]);

  return (
    <Primitive.button
      asChild
      aria-busy={isNavigating}
      aria-live="polite"
      data-loading={isNavigating ? '' : undefined}
    >
      <Link
        href={href}
        onClick={handleClick}
        style={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Box
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            width: '100%',
            padding: 2.5,
            background: colors.gradient,
            borderRadius: 3.5,
            outline: `2px ${colors.outline} solid`,
            outlineOffset: '-2px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            transform: isHovered ? 'scale(1.01)' : 'scale(1)',
            transition: 'transform 0.2s, box-shadow 0.2s',
            boxShadow: isHovered ? '0px 8px 16px rgba(0,0,0,0.2)' : 'none',
            cursor: isNavigating ? 'not-allowed' : 'pointer',
            position: 'relative',
            overflow: 'hidden',
            // Shimmer effect on hover (desktop only)
            '&::before': isHovered ? {
              content: '""',
              position: 'absolute',
              top: 0,
              left: '-100%',
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
              animation: 'shimmer 1.5s infinite',
              zIndex: 1,
              '@media (max-width: 768px)': {
                display: 'none', // Disable shimmer on mobile
              },
            } : {},
            '@keyframes shimmer': {
              '0%': { left: '-100%' },
              '100%': { left: '100%' }
            },
            '&:hover .arrow-icon': {
              opacity: 1,
            },
            opacity: isNavigating ? 0.85 : 1,
            textDecoration: 'none',
            '&:hover, &:focus, &:visited': {
              textDecoration: 'none',
            },
            '& .MuiTypography-root': {
              textDecoration: 'none',
            },
          }}
        >
          {/* Author section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 2,
          }}
        >
          {/* Author image with circular masking */}
          <Box sx={{ position: 'relative', width: 64, height: 64 }}>
            {/* Base shape for author image */}
            <Box
              sx={{
                width: 51,
                height: 51,
                borderRadius: '50%',
                background: '#1A1A1A',
                position: 'absolute',
                left: 0,
                zIndex: 0,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            
            {/* Author image with primary color background */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: `linear-gradient(216deg, ${colors.primary} 0%, black 100%)`,
                position: 'absolute',
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              {author.image && (
                <Image
                  src={author.image}
                  alt={author.name}
                  width={64}
                  height={64}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}
            </Box>
          </Box>
          
          {/* Author info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: '#FFFAFA',
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.4,
              }}
            >
              {author.name}
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
                mt: 1,
              }}
            >
              {/* Desktop tags */}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, flexWrap: 'wrap', gap: 1 }}>
                {displayTags.map((tag: string) => (
                  <Box
                    key={tag}
                    sx={{
                      padding: '2px 8px',
                      background: colors.chipBackground,
                      borderRadius: 1,
                      fontSize: 12,
                    }}
                  >
                    <Typography
                      sx={{
                        color: colors.chipText,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
              
              {/* Mobile tags (no occupation) */}
              <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexWrap: 'wrap', gap: 1 }}>
                {displayTagsMobile.map((tag: string) => (
                  <Box
                    key={tag}
                    sx={{
                      padding: '2px 8px',
                      background: colors.chipBackground,
                      borderRadius: 1,
                      fontSize: 12,
                    }}
                  >
                    <Typography
                      sx={{
                        color: colors.chipText,
                        fontSize: 12,
                        fontWeight: 500,
                      }}
                    >
                      {tag}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
        
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: isNavigating ? 1 : 0,
            minWidth: 80,
            zIndex: 2,
          }}
        >
          {isNavigating ? (
            <>
              <CircularProgress size={20} sx={{ color: colors.chipText }} />
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  background: 'linear-gradient(90deg, rgba(255, 250, 250, 0.175) 0%, rgba(255, 250, 250, 0.475) 50%, rgba(255, 250, 250, 0.175) 100%)',
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 1.8s ease-in-out infinite`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                Loading...
              </Typography>
            </>
          ) : (
            <KeyboardArrowRightIcon
              className="arrow-icon"
              sx={{
                color: colors.chipText,
                opacity: 0.7,
                fontSize: 32,
                cursor: 'pointer',
                transition: 'opacity 0.2s',
              }}
            />
          )}
        </Box>
        </Box>
      </Link>
    </Primitive.button>
  );
}
