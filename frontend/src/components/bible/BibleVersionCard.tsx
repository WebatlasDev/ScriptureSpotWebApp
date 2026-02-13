'use client';

import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { KeyboardArrowRight as KeyboardArrowRightIcon } from '@/components/ui/phosphor-icons';

interface BibleVersionCardProps {
  version: {
    name: string;
    shortName?: string;
    description?: string;
    year?: number;
    tradition?: string;
  };
}

export default function BibleVersionCard({ version }: BibleVersionCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  // Bible-specific color scheme (blue theme)
  const colors = {
    primary: '#278EFF',
    gradient: 'linear-gradient(0deg, rgba(39, 129, 255, 0.10) 0%, rgba(39, 129, 255, 0.10) 100%), #121212',
    outline: 'rgba(39, 129, 255, 0.20)',
    chipBackground: 'rgba(39, 129, 255, 0.30)',
    chipText: '#96C2FF',
    fadeColor: '#141D2A',
  };
  
  // Create version slug using abbreviation (e.g., "ASV")
  const versionSlug = version.shortName?.toLowerCase() || 'asv';
  
  // Create display tags
  const displayTags: string[] = [];
  const displayTagsMobile: string[] = [];
  
  if (version.year) {
    displayTags.push(version.year.toString());
    displayTagsMobile.push(version.year.toString());
  }
  if (version.tradition) {
    displayTags.push(version.tradition);
    if (displayTagsMobile.length < 2) {
      displayTagsMobile.push(version.tradition);
    }
  }

  return (
    <Link href={`/${versionSlug}`} passHref style={{ textDecoration: 'none' }}>
      <Box
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        sx={{
          width: '100%',
          padding: 2.5,
          background: colors.gradient,
          borderRadius: 4.5,
          outline: `2px ${colors.outline} solid`,
          outlineOffset: '-2px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: isHovered ? '0px 8px 16px rgba(0,0,0,0.2)' : 'none',
          cursor: 'pointer',
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
        }}
      >
        {/* Version section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            zIndex: 2,
          }}
        >
          {/* Bible icon placeholder */}
          <Box sx={{ position: 'relative', width: 64, height: 64 }}>
            {/* Base shape for version icon */}
            <Box
              sx={{
                width: 51,
                height: 51,
                borderRadius: '12px',
                background: '#1A1A1A',
                position: 'absolute',
                left: 0,
                zIndex: 0,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            
            {/* Version icon with primary color background */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '12px',
                background: `linear-gradient(216deg, ${colors.primary} 0%, black 100%)`,
                position: 'absolute',
                zIndex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Bible icon or abbreviation */}
              <Typography
                sx={{
                  color: '#FFFAFA',
                  fontSize: 14,
                  fontWeight: 700,
                  textAlign: 'center',
                  lineHeight: 1.2,
                }}
              >
                {version.shortName || 'ASV'}
              </Typography>
            </Box>
          </Box>
          
          {/* Version info */}
          <Box sx={{ flex: 1 }}>
            <Typography
              sx={{
                color: '#FFFAFA',
                fontSize: 18,
                fontWeight: 700,
                lineHeight: 1.4,
                mb: 0.5,
              }}
            >
              {version.name}
            </Typography>
            
            {version.shortName && (
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.4,
                  mb: 1,
                }}
              >
                {version.shortName}
              </Typography>
            )}
            
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
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
              
              {/* Mobile tags */}
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
        
        {/* Arrow icon */}
        <KeyboardArrowRightIcon
          className="arrow-icon"
          sx={{
            color: colors.chipText,
            opacity: 0.7,
            fontSize: 32,
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            zIndex: 2,
          }}
        />
      </Box>
    </Link>
  );
}