'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';

interface LandingPageBookOverviewHeaderProps {
  title: string;
  subtitle?: string;
}

export default function LandingPageBookOverviewHeader({
  title,
  subtitle
}: LandingPageBookOverviewHeaderProps) {
  // Color scheme matching BookOverviewCard
  const BOOK_COLORS = {
    primary: '#278EFF',
    secondary: '#099232',
    accent: 'rgba(108, 231, 201, 1)',
    gradient: 'linear-gradient(75deg, #278EFF 0%, #099232 100%)',
    darkGradient: 'linear-gradient(90deg, rgba(34, 143, 220, 0.2) 0%, #009A38 100%)',
    outlineGradient: 'linear-gradient(222deg, rgba(38, 142, 244, 0.70) 0%, rgba(1, 152, 58, 0.07) 100%)',
  };
  
  // Enhanced title rendering with book name bolding for landing pages
  const renderLandingPageTitle = (_isMobile = false) => {
    // Pattern for "[Book] Overview"
    const overviewPattern = /(.+?)\s+Overview$/i;
    const overviewMatch = title.match(overviewPattern);
    
    if (overviewMatch) {
      const bookName = overviewMatch[1];
      return (
        <>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {bookName}
          </Box>
          {' '}Overview
        </>
      );
    }

    // Pattern for "[Book] [Chapter] study guide"
    const studyGuidePattern = /(.+?)\s+(\d+)\s+study guide$/i;
    const studyGuideMatch = title.match(studyGuidePattern);
    
    if (studyGuideMatch) {
      const bookName = studyGuideMatch[1];
      const chapter = studyGuideMatch[2];
      return (
        <>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {bookName} {chapter}
          </Box>
          {' '}study guide
        </>
      );
    }

    // Pattern for various book overview sections
    // "Audience of [Book]", "Key Themes of [Book]", "Historical Context of [Book]", etc.
    const sectionPatterns = [
      { pattern: /^(Author)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Audience)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Composition)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Objective)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Unique Elements)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Key Themes)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Teaching Highlights)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Historical Context|Historical Background)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Cultural Background)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Political Landscape)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Structure)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^(Book Outline)\s+of\s+(.+)$/i, boldIndex: 1 },
      { pattern: /^What does\s+(.+)\s+mean$/i, boldIndex: 0 } // For "What does Genesis mean"
    ];

    for (const { pattern, boldIndex } of sectionPatterns) {
      const match = title.match(pattern);
      if (match) {
        if (boldIndex === 0) {
          // Special case for "What does [Book] mean"
          return (
            <>
              What does{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {match[1]}
              </Box>
              {' '}mean
            </>
          );
        } else {
          // Standard pattern: "[Section] of [Book]"
          const section = match[1];
          const bookName = match[2];
          return (
            <>
              <Box component="span" sx={{ fontWeight: 700 }}>
                {section}
              </Box>
              {' '}of {bookName}
            </>
          );
        }
      }
    }

    // Check for standalone titles like "Book Outline" without "of [Book]"
    const standalonePatterns = ['Book Outline', 'Key Themes', 'Teaching Highlights', 'Historical Context', 'Cultural Background'];
    for (const keyword of standalonePatterns) {
      if (title.toLowerCase() === keyword.toLowerCase()) {
        return (
          <Box component="span" sx={{ fontWeight: 700 }}>
            {title}
          </Box>
        );
      }
    }

    // Fallback: return title as-is
    return title;
  };

  return (
    <Box
      sx={{
        borderRadius: 3.5,
        overflow: 'hidden',
        position: 'relative',
        background: BOOK_COLORS.gradient,
      }}
    >
      {/* Mobile Layout - xs and sm */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          position: 'relative',
          p: 3,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            zIndex: 1,
          },
          '& > *': {
            position: 'relative',
            zIndex: 2,
          },
        }}
      >
        {/* Eyebrow text - Mobile */}
        <Typography
          sx={{
            color: BOOK_COLORS.accent,
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1,
            opacity: 0.95,
            mb: 1.5,
          }}
        >
          Book Overview
        </Typography>

        {/* Title */}
        <Typography
          component="h1"
          sx={{
            color: '#FFFFFF',
            fontSize: { xs: 26, sm: 30 },
            fontWeight: 400,
            lineHeight: 1.2,
            mb: subtitle ? 1.5 : 0,
          }}
        >
          {renderLandingPageTitle(true)}
        </Typography>
        
        {/* Subtitle if provided */}
        {subtitle && (
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.75)',
              fontSize: { xs: 15, sm: 17 },
              fontWeight: 400,
              lineHeight: 1.4,
            }}
          >
            {subtitle}
          </Typography>
        )}
      </Box>

      {/* Desktop Layout - md and up */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          position: 'relative',
          alignItems: 'center',
          p: 4,
          minHeight: '160px',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.35)',
            zIndex: 1,
          },
        }}
      >
        {/* Content Container */}
        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            width: '100%',
          }}
        >
          {/* Eyebrow text */}
          <Typography
            sx={{
              color: BOOK_COLORS.accent,
              fontSize: 14,
              fontWeight: 400,
              mb: 1.5,
              opacity: 0.95,
            }}
          >
            Book Overview
          </Typography>

          <Typography
            component="h1"
            sx={{
              color: '#FFFFFF',
              fontSize: 36,
              fontWeight: 400,
              lineHeight: 1.1,
              mb: subtitle ? 1.5 : 0,
            }}
          >
            {renderLandingPageTitle()}
          </Typography>
          
          {/* Subtitle */}
          {subtitle && (
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: 17,
                fontWeight: 400,
                lineHeight: 1.4,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
}