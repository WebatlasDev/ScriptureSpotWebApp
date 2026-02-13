'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, useTheme } from '@mui/material';
import Link from 'next/link';

interface LandingPageHeaderProps {
  title: string;
  subtitle?: string;
  variant: 'main' | 'book-overview' | 'verse-takeaways' | 'commentary';
  breadcrumbItems?: Array<{ label: string; href?: string; }>;
  bookName?: string; // For book overview bolding
  verseNumber?: string; // For verse takeaway bolding  
  author?: { 
    name: string; 
    colorScheme: {
      primary: string;
      gradient?: string;
      outline: string;
      chipBackground: string;
      chipText: string;
    }
  }; // For commentary headers
}

// Color schemes for different variants
const COLOR_SCHEMES = {
  'verse-takeaways': {
    primary: '#ED27FF',
    secondary: '#164880',
    gradient: 'linear-gradient(70deg, #ED27FF 0%, #164880 100%)',
    contentGradient: 'linear-gradient(0deg, rgba(237, 39, 255, 0.07) 0%, rgba(237, 39, 255, 0.07) 100%)',
    chipText: '#F4BFFF',
    outline: 'rgba(237, 39, 255, 0.20)'
  },
  'book-overview': {
    primary: '#278EFF',
    secondary: '#099232',
    gradient: 'linear-gradient(75deg, #278EFF 0%, #099232 100%)',
    contentGradient: 'linear-gradient(0deg, rgba(39, 142, 255, 0.07) 0%, rgba(39, 142, 255, 0.07) 100%)',
    chipText: '#96C2FF',
    outline: 'rgba(39, 142, 255, 0.20)'
  },
  'main': {
    primary: '#278EFF',
    secondary: '#164880',
    gradient: 'linear-gradient(70deg, #278EFF 0%, #164880 100%)',
    contentGradient: 'linear-gradient(0deg, rgba(39, 142, 255, 0.07) 0%, rgba(39, 142, 255, 0.07) 100%)',
    chipText: '#96C2FF',
    outline: 'rgba(39, 142, 255, 0.20)'
  }
};

export default function LandingPageHeader({
  title,
  subtitle,
  variant,
  breadcrumbItems = [],
  bookName,
  verseNumber,
  author
}: LandingPageHeaderProps) {
  const theme = useTheme();
  const baseDarkBackground = '#121212';
  
  // Get color scheme based on variant or author
  const colorScheme = author?.colorScheme || COLOR_SCHEMES[variant] || COLOR_SCHEMES['main'];
  
  // Background for the main content area
  const contentAreaBgColor = author?.colorScheme?.gradient || 
    colorScheme.contentGradient ||
    `${colorScheme.contentGradient}, ${baseDarkBackground}`;

  // Helper function to get mobile-friendly breadcrumb labels
  const getMobileLabel = (label: string) => {
    // Replace "Commentators" with "Authors" on mobile
    if (label === 'Commentators') return 'Authors';
    
    // Remove "Ch. " prefix and just show the number
    if (label.startsWith('Ch. ')) return label.replace('Ch. ', '');
    
    // Remove "verse " prefix and just show the number/range
    if (label.toLowerCase().startsWith('verse ')) {
      return label.replace(/^verse /i, '');
    }
    
    // Apply mobile book name abbreviations
    switch (label) {
      case 'Song of Solomon': return 'Songs';
      case 'Deuteronomy': return 'Deut.';
      case '1 Chronicles': return '1 Chr.';
      case '2 Chronicles': return '2 Chr.';
      case '1 Corinthians': return '1 Cor.';
      case '2 Corinthians': return '2 Cor.';
      case 'Ephesians': return 'Eph.';
      case 'Philippians': return 'Phil.';
      case 'Colossians': return 'Col.';
      case '1 Thessalonians': return '1 Thess.';
      case '2 Thessalonians': return '2 Thess.';
      case '1 Timothy': return '1 Tim.';
      case '2 Timothy': return '2 Tim.';
      case 'Philemon': return 'Phlm.';
      case 'Revelation': return 'Rev.';
      default: return label;
    }
  };

  // Get desktop-friendly breadcrumb labels
  const getDesktopLabel = (label: string) => {
    // Replace "verse X" with "v. X" on desktop
    if (label.toLowerCase().startsWith('verse ')) {
      return label.replace(/^verse /i, 'v. ');
    }
    return label;
  };

  // Title rendering logic with bolding
  const renderTitle = (isMobile = false) => {
    // Main page titles - keep simple
    if (variant === 'main') {
      return title;
    }

    // Book overview titles - bold the book name
    if (variant === 'book-overview' && bookName) {
      if (title.endsWith(' Overview')) {
        const bookPart = title.replace(' Overview', '');
        return (
          <>
            <Box component="span" sx={{ fontWeight: 700 }}>
              {bookPart}
            </Box>
            {' '}Overview
          </>
        );
      }
    }

    // Verse takeaway titles - bold key parts
    if (variant === 'verse-takeaways') {
      if (title.startsWith('Key Takeaways For Verse') && verseNumber) {
        return (
          <>
            <Box component="span" sx={{ fontWeight: 700 }}>
              Key Takeaways
            </Box>
            {' '}For Verse{' '}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {verseNumber}
            </Box>
          </>
        );
      }
      
      if (title.includes('What do top commentators say') && bookName) {
        if (title.includes('means?')) {
          return (
            <>
              What do top commentators say{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {title.replace('What do top commentators say ', '').replace(' means?', '')}
              </Box>
              {' '}means?
            </>
          );
        } else {
          return (
            <>
              What do top commentators say {isMobile ? 'about' : 'on'}{' '}
              <Box component="span" sx={{ fontWeight: 700 }}>
                {bookName}
              </Box>
              ?
            </>
          );
        }
      }
    }

    // Commentary titles - bold biblical references
    if (variant === 'commentary' && author) {
      const prefixText = "on ";
      if (subtitle && subtitle.toLowerCase().startsWith(prefixText)) {
        const mainPart = subtitle.substring(prefixText.length);
        return (
          <>
            {author.name} {prefixText}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {mainPart}
            </Box>
          </>
        );
      }
    }

    // Default: return title as-is
    return title;
  };

  // Determine if we should show gradient header vs simple header
  const showGradientHeader = variant !== 'main';
  const gradientBackground = colorScheme.gradient;

  return (
    <Box
      sx={{
        borderRadius: 3.5,
        outline: `2px solid ${colorScheme.outline}`,
        outlineOffset: '-2px',
        overflow: 'hidden',
        background: baseDarkBackground,
        position: 'relative',
      }}
    >
      {/* Mobile Layout - xs and sm */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          background: showGradientHeader ? 'transparent' : contentAreaBgColor,
        }}
      >
        {/* Gradient header for mobile if needed */}
        {showGradientHeader && (
          <Box
            sx={{
              background: gradientBackground,
              p: { xs: 3, sm: 3 },
            }}
          >
            <Typography 
              component="h2"
              sx={{
                color: '#ffffff',
                fontSize: { xs: '1.4rem', sm: '1.6rem' },
                fontWeight: 700,
                lineHeight: 1.2,
              }}
            >
              {renderTitle(true)}
            </Typography>
          </Box>
        )}

        {/* Content area for mobile */}
        <Box sx={{ 
          background: showGradientHeader ? contentAreaBgColor : 'transparent',
          p: 2.5 
        }}>
          {/* Breadcrumbs */}
          {breadcrumbItems.length > 0 && (
            <Breadcrumbs
              separator="›"
              sx={{
                mb: 1.5,
                '& .MuiBreadcrumbs-separator': {
                  color: colorScheme.chipText,
                  fontSize: '14px',
                },
              }}
            >
              {breadcrumbItems.map((item, index) => (
                <Typography
                  key={index}
                  sx={{
                    color: colorScheme.chipText,
                    fontSize: 14,
                    fontWeight: 400,
                    textDecoration: 'none',
                    '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                  }}
                  component={item.href ? Link : 'span'}
                  href={item.href}
                >
                  {getMobileLabel(item.label)}
                </Typography>
              ))}
            </Breadcrumbs>
          )}

          {/* Title for main variant on mobile */}
          {!showGradientHeader && (
            <Typography 
              component="h1" 
              sx={{
                color: '#FFFAFA',
                fontSize: { xs: 24, sm: 26 },
                fontWeight: 700,
                lineHeight: 1.25,
                mb: subtitle ? 1 : 2,
              }}
            >
              {renderTitle(true)}
            </Typography>
          )}
          
          {/* Subtitle */}
          {subtitle && (
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 400,
                lineHeight: 1.25,
                mb: 2,
              }}
            >
              {subtitle}
            </Typography>
          )}
        </Box>
      </Box>

      {/* Desktop Layout - md and up */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: '190px',
        }}
      >
        {showGradientHeader ? (
          // Gradient header layout for desktop
          <>
            {/* Gradient header section */}
            <Box
              sx={{
                background: gradientBackground,
                p: { xs: 3, md: 4 },
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              <Typography 
                component="h2"
                sx={{
                  color: '#ffffff',
                  fontSize: { xs: '1.4rem', md: '1.6rem' },
                  fontWeight: 700,
                  lineHeight: 1.2,
                }}
              >
                {renderTitle()}
              </Typography>
            </Box>
            
            {/* Content section */}
            <Box
              sx={{
                background: contentAreaBgColor,
                p: { xs: 3, md: 4 },
                flex: 2,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
              }}
            >
              {/* Breadcrumbs */}
              {breadcrumbItems.length > 0 && (
                <Breadcrumbs
                  separator="›"
                  sx={{
                    mb: 1.5,
                    '& .MuiBreadcrumbs-separator': {
                      color: colorScheme.chipText,
                      fontSize: '14px',
                    },
                  }}
                >
                  {breadcrumbItems.map((item, index) => (
                    <Typography
                      key={index}
                      sx={{
                        color: colorScheme.chipText,
                        fontSize: 14,
                        fontWeight: 400,
                        textDecoration: 'none',
                        '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                      }}
                      component={item.href ? Link : 'span'}
                      href={item.href}
                    >
                      {getDesktopLabel(item.label)}
                    </Typography>
                  ))}
                </Breadcrumbs>
              )}

              {/* Subtitle */}
              {subtitle && (
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: 20,
                    fontWeight: 400,
                    lineHeight: 1.25,
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>
          </>
        ) : (
          // Simple header layout for main variant
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              background: contentAreaBgColor,
              py: 5,
              pl: 4,
              pr: 7,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              zIndex: 1,
            }}
          >
            {/* Breadcrumbs */}
            {breadcrumbItems.length > 0 && (
              <Breadcrumbs
                separator="›"
                sx={{
                  mb: 1.5,
                  '& .MuiBreadcrumbs-separator': {
                    color: colorScheme.chipText,
                    fontSize: '14px',
                  },
                }}
              >
                {breadcrumbItems.map((item, index) => (
                  <Typography
                    key={index}
                    sx={{
                      color: colorScheme.chipText,
                      fontSize: 14,
                      fontWeight: 400,
                      textDecoration: 'none',
                      '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                    }}
                    component={item.href ? Link : 'span'}
                    href={item.href}
                  >
                    {getDesktopLabel(item.label)}
                  </Typography>
                ))}
              </Breadcrumbs>
            )}

            <Typography
              component="h1"
              sx={{
                color: '#FFFAFA',
                fontSize: 32,
                fontWeight: 400,
                lineHeight: 1.25,
                mb: subtitle ? 1 : 2,
              }}
            >
              {renderTitle()}
            </Typography>
            
            {/* Subtitle */}
            {subtitle && (
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 20,
                  fontWeight: 400,
                  lineHeight: 1.25,
                  mb: 2,
                }}
              >
                {subtitle}
              </Typography>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}