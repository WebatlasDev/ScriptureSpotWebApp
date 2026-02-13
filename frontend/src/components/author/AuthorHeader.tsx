'use client';

import { Box, Typography, Breadcrumbs, useTheme } from '@mui/material'; // Added useTheme
import Image from 'next/image';
import { CustomChip } from '@/components/ui';

interface AuthorHeaderProps {
  author: {
    id: string;
    name: string;
    slug: string;
    image?: string;
    colorScheme: {
      primary: string;
      gradient?: string; // For subtle content background if provided as full string
      outline: string;
      chipBackground: string;
      chipText: string;
    };
    birthYear?: number;
    deathYear?: number;
    religiousTradition?: string;
    occupation?: string;
    nationality?: string;
  };
  title: string;
  subtitle?: string;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  tags?: string[];
}

export default function AuthorHeader({
  author,
  title,
  subtitle,
  breadcrumbItems,
  tags = []
}: AuthorHeaderProps) {
  const theme = useTheme(); // For spacing units

  const defaultColors = {
    primary: theme.palette.primary.main,
    gradient: undefined,
    outline: 'rgba(39, 129, 255, 0.20)',
    chipBackground: 'rgba(39, 129, 255, 0.30)',
    chipText: '#96C2FF',
  };

  const colors = author.colorScheme ?? defaultColors;

  const isValidUrl = (url?: string): boolean => {
    if (!url || typeof url !== 'string' || url.trim() === '') return false;
    
    // Normalize backslashes to forward slashes for relative paths
    const normalizedUrl = url.replace(/\\/g, '/');
    
    // Check if it's a relative path starting with assets, public paths, or absolute URL
    if (normalizedUrl.startsWith('/') || normalizedUrl.startsWith('assets/') || normalizedUrl.startsWith('./') || normalizedUrl.startsWith('../')) {
      return true;
    }
    
    try {
      new URL(normalizedUrl);
      return true;
    } catch {
      return false;
    }
  };

  const generateTags = () => {
    const generatedTags: string[] = [];
    if (author.birthYear && author.deathYear) {
      generatedTags.push(`${author.birthYear}–${author.deathYear}`);
    } else if (author.birthYear) {
      generatedTags.push(`${author.birthYear}–`);
    }
    if (author.occupation) generatedTags.push(author.occupation);
    if (author.nationality) generatedTags.push(author.nationality);
    if (author.religiousTradition) generatedTags.push(author.religiousTradition);
    return generatedTags;
  };

  const displayTags = tags.length > 0 ? tags : generateTags();
  const baseDarkBackground = '#121212';
  const showImage = author.image && isValidUrl(author.image);

  // Background for the right-side panel with the strong gradient
  const rightGradientPanelBg = colors.primary
    ? `linear-gradient(216deg, ${colors.primary} 0%, black 100%)`
    : theme.palette.grey[800]; // Fallback for the gradient panel

  // Background for the main content area (left side) - subtle gradient or dark
  const contentAreaBgColor = colors.gradient ||
    (colors.primary && !colors.gradient
      ? `linear-gradient(0deg, rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.07) 0%, rgba(${parseInt(colors.primary.slice(1, 3), 16)}, ${parseInt(colors.primary.slice(3, 5), 16)}, ${parseInt(colors.primary.slice(5, 7), 16)}, 0.07) 100%), ${baseDarkBackground}`
      : baseDarkBackground);

  const renderCombinedTitle = () => {
    if (!subtitle) {
      return title;
    }
    
    // Check if author name already ends with "Commentary" to avoid redundancy
    const authorEndsWithCommentary = author.name.toLowerCase().endsWith('commentary');
    
    const prefixText = "on ";
    if (subtitle.toLowerCase().startsWith(prefixText)) {
      const mainPart = subtitle.substring(prefixText.length);
      
      // If author name already ends with "Commentary", don't add "'s Commentary"
      if (authorEndsWithCommentary) {
        return (
          <>
            {author.name} {prefixText}
            <Box component="span" sx={{ fontWeight: 700 }}>
              {mainPart}
            </Box>
          </>
        );
      }
      
      // Original logic for regular author names
      return (
        <>
          {title} {prefixText}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {mainPart}
          </Box>
        </>
      );
    }
    
    // Handle special title formatting
    if (title === "Available Commentaries") {
      return (
        <>
          Available{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            Commentaries
          </Box>
        </>
      );
    }
    
    // Handle book commentary titles (e.g., "Genesis Commentary")
    if (title.endsWith(" Commentary")) {
      const bookName = title.replace(" Commentary", "");
      return (
        <>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {bookName}
          </Box>
          {' '}Commentary
        </>
      );
    }
    
    // For simple subtitles, just return the title (subtitle will be rendered separately)
    return title;
  };
  
  const shouldShowSeparateSubtitle = () => {
    if (!subtitle) return false;
    // Only show separate subtitle if it doesn't start with "on " (which gets combined with title)
    return !subtitle.toLowerCase().startsWith("on ");
  };

  // Define dimensions for the image and the right panel
  // Image dimensions (responsive)
  const imageWidth = 310;
  const imageHeight = 243;

  // Right panel width - can be narrower than the image to emphasize overlap
  const rightPanelWidth = theme.spacing(18); // e.g., 64px, 72px, 80px

  // Image offset to the left, making it overlap the content area
  // This value means how much the image's left edge is shifted leftwards from the right panel's left edge
  const imageOffsetLeft = { xs: '-70px', sm: '-80px', md: '-145px' }; // Tune these values

  return (
    <Box
      sx={{
        borderRadius: 3.5,
        outline: `2px solid ${colors.outline || 'rgba(39, 129, 255, 0.20)'}`,
        outlineOffset: '-2px',
        overflow: 'hidden',
        mb: 3,
        background: baseDarkBackground,
        position: 'relative',
      }}
    >
      {/* Mobile Layout - xs and sm */}
      <Box
        sx={{
          display: { xs: 'block', md: 'none' },
          background: contentAreaBgColor,
          p: 2.5,
        }}
      >
        {/* Small profile image at top for mobile */}
        {showImage && (
          <Box
            sx={{
              display: 'flex',
              mb: 2,
            }}
          >
            <Box
              sx={{
                position: 'relative',
                width: 60,
                height: 60,
              }}
            >
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  borderRadius: '50%',
                  background: `linear-gradient(216deg, ${colors.primary} 0%, black 100%)`,
                  overflow: 'hidden',
                }}
              >
                <Image
                  src={author.image!.replace(/\\/g, '/')}
                  alt={author.name}
                  width={60}
                  height={60}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                    display: 'block',
                  }}
                />
              </Box>
            </Box>
          </Box>
        )}

        {/* Breadcrumbs */}
        <Breadcrumbs
          separator="›"
          sx={{
            mb: 1.5,
            '& .MuiBreadcrumbs-separator': {
              color: colors.chipText,
              fontSize: '14px',
            },
          }}
        >
          {breadcrumbItems.map((item, index) => {
            // Create mobile-friendly breadcrumb labels
            let mobileLabel = item.label;
            
            // Replace "Commentators" with "Authors" on mobile
            if (mobileLabel === 'Commentators') {
              mobileLabel = 'Authors';
            }
            
            // Remove "Ch. " prefix and just show the number
            if (mobileLabel.startsWith('Ch. ')) {
              mobileLabel = mobileLabel.replace('Ch. ', '');
            }
            
            // Remove "verse " prefix and just show the number/range
            if (mobileLabel.toLowerCase().startsWith('verse ')) {
              mobileLabel = mobileLabel.replace(/^verse /i, '');
            }
            
            return (
              <Typography
                key={index}
                sx={{
                  color: colors.chipText,
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: 'none',
                  '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                }}
                component={item.href ? 'a' : 'span'}
                href={item.href}
              >
                {mobileLabel}
              </Typography>
            );
          })}
        </Breadcrumbs>

        {/* Title - smaller on mobile and left aligned */}
        <Typography
          component="h1"
          sx={{
            color: '#FFFAFA',
            fontSize: { xs: 24, sm: 26 },
            fontWeight: 400,
            lineHeight: 1.25,
            mb: shouldShowSeparateSubtitle() ? 1 : 2,
          }}
        >
          {renderCombinedTitle()}
        </Typography>
        
        {/* Separate subtitle if applicable */}
        {shouldShowSeparateSubtitle() && (
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

        {/* Tags - left aligned, limited to 3 on mobile */}
        {(() => {
          // Generate mobile-specific tags: birth date, denomination, nationality
          const mobileTags: string[] = [];
          
          // 1. Birth date (birth year - death year or birth year -)
          if (author.birthYear && author.deathYear) {
            mobileTags.push(`${author.birthYear}–${author.deathYear}`);
          } else if (author.birthYear) {
            mobileTags.push(`${author.birthYear}–`);
          }
          
          // 2. Denomination (religious tradition)
          if (author.religiousTradition) {
            mobileTags.push(author.religiousTradition);
          }
          
          // 3. Nationality
          if (author.nationality) {
            mobileTags.push(author.nationality);
          }
          
          return mobileTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {mobileTags.map((tag) => (
                <CustomChip
                  key={tag}
                  label={tag}
                  bgColor={colors.chipBackground}
                  textColor={colors.chipText}
                  fontSize={12}
                  fontWeight={500}
                  borderRadius="16px"
                  padding="6px 12px"
                />
              ))}
            </Box>
          );
        })()}
      </Box>

      {/* Desktop Layout - md and up */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: '190px',
        }}
      >
        {/* Left Text Content Area */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            background: contentAreaBgColor,
            py: 5,
            pl: 4,
            pr: { 
              md: `calc(${Math.abs(parseInt(imageOffsetLeft.md, 10))}px + ${theme.spacing(4)})`
            },
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          <Breadcrumbs
            separator="›"
            sx={{
              mb: 1.5,
              '& .MuiBreadcrumbs-separator': {
                color: colors.chipText,
                fontSize: '14px',
              },
            }}
          >
            {breadcrumbItems.map((item, index) => {
              // Create desktop-friendly breadcrumb labels
              let desktopLabel = item.label;
              
              // Replace "verse X" with "v. X" on desktop
              if (desktopLabel.toLowerCase().startsWith('verse ')) {
                desktopLabel = desktopLabel.replace(/^verse /i, 'v. ');
              }
              
              return (
                <Typography
                  key={index}
                  sx={{
                  color: colors.chipText,
                    fontSize: 14,
                    fontWeight: 400,
                    textDecoration: 'none',
                    '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                  }}
                  component={item.href ? 'a' : 'span'}
                  href={item.href}
                >
                  {desktopLabel}
                </Typography>
              );
            })}
          </Breadcrumbs>

          <Typography
            component="h1"
            sx={{
              color: '#FFFAFA',
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1.25,
              mb: shouldShowSeparateSubtitle() ? 1 : 2,
            }}
          >
            {renderCombinedTitle()}
          </Typography>
          
          {/* Separate subtitle if applicable */}
          {shouldShowSeparateSubtitle() && (
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

          {displayTags.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {displayTags.map((tag) => (
                <CustomChip
                  key={tag}
                  label={tag}
                  bgColor={colors.chipBackground}
                  textColor={colors.chipText}
                  fontSize={12}
                  fontWeight={500}
                  borderRadius="16px"
                  padding="6px 12px"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Right Gradient Panel - Desktop only */}
        <Box
          sx={{
            width: rightPanelWidth,
            alignSelf: 'stretch',
            position: 'relative',
            zIndex: 2,
            background: rightGradientPanelBg,
          }}
        >
          {/* Large Image - Desktop only */}
          {showImage && (
            <Box
              sx={{
                position: 'absolute',
                top: '54%',
                transform: 'translateY(-50%)',
                left: imageOffsetLeft,
                width: imageWidth,
                height: imageHeight,
                zIndex: 1,
                boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
              }}
            >
              <Image
                src={author.image!.replace(/\\/g, '/')}
                alt={author.name}
                width={imageWidth}
                height={imageHeight}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'contain',
                  objectPosition: 'center bottom',
                  display: 'block',
                }}
              />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}