'use client';

import { Box, Typography, Breadcrumbs, useTheme, Avatar } from '@mui/material';
import { keyframes } from '@emotion/react';
import { ReactNode, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface VerseTakeawaysHeaderProps {
  title: string;
  book?: string;
  chapter?: string;
  subtitle?: string;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  showIcon?: boolean;
  actions?: ReactNode; // For buttons like navigation, expand/collapse
}

// Verse Takeaways color scheme
const VERSE_TAKEAWAYS_COLORS = {
  primary: '#ED27FF',
  secondary: '#164880',
  gradient: 'linear-gradient(135deg,rgba(237, 39, 255, 0.6) 0%,rgba(30, 77, 139, 0) 100%)',
  iconGradient: 'linear-gradient(46deg, #ED27FF 0%, #164880 100%)',
  chipText: '#F4BFFF',
  outline: 'rgba(237, 39, 255, 0.20)'
};

// Hardcoded commentator images
const COMMENTATOR_IMAGES = [
  '/assets/images/authors/Albert_Barnes_Small.webp',
  '/assets/images/authors/Charles_Ellicott_Small.webp',
  '/assets/images/authors/Charles_Spurgeon_Small.webp',
  '/assets/images/authors/John_Calvin_Small.webp',
  '/assets/images/authors/Matthew_Henry_Small.webp',
  '/assets/images/authors/AT_Robertson_Small.webp',
  '/assets/images/authors/Thomas_Aquinas_Small.webp', // Moved to index 6 (third row)
  '/assets/images/authors/John_Gill_Small.webp',
];

const MOBILE_BREATHE = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const MOBILE_FLOAT_UP = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-4px); }
`;

const MOBILE_FLOAT_DOWN = keyframes`
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(4px); }
`;

const MOBILE_ROTATE = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

const DESKTOP_BREATHE = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.1); }
`;

const DESKTOP_ROTATE = keyframes`
  0%, 100% { transform: rotate(-5deg); }
  50% { transform: rotate(5deg); }
`;

const FLOAT_DIRECTIONS = [
  { x: -4, y: -3 }, // up-left
  { x: 4, y: -3 },  // up-right
  { x: -4, y: 3 },  // down-left
  { x: 4, y: 3 },   // down-right
  { x: -5, y: 0 },  // left
  { x: 5, y: 0 },   // right
  { x: 0, y: -4 },  // up
  { x: 0, y: 4 },   // down
] as const;

const DESKTOP_FLOAT_KEYFRAMES = FLOAT_DIRECTIONS.map(
  ({ x, y }) => keyframes`
    0%, 100% { transform: translate(0px, 0px); }
    50% { transform: translate(${x}px, ${y}px); }
  `
);

// Animated Commentator Array Component
interface AnimatedCommentatorArrayProps {
  isMobile?: boolean;
}

function AnimatedCommentatorArray({ isMobile = false }: AnimatedCommentatorArrayProps) {
  const baseAvatarSize = isMobile ? 45 : 60;
  const gap = 1.5;
  const repeatCount = isMobile ? 2 : 1;
  const allCommentators = useMemo(() => {
    if (repeatCount === 1) {
      return COMMENTATOR_IMAGES;
    }
    return Array.from({ length: repeatCount }, () => COMMENTATOR_IMAGES).flat();
  }, [repeatCount]);
  const commentatorCount = allCommentators.length;
  const sizeMultipliers = useMemo(() => {
    return Array.from({ length: commentatorCount }, (_, index) => {
      const pseudoRandom = Math.abs(Math.sin((index + 1) * 13.37));
      const fractional = pseudoRandom - Math.floor(pseudoRandom);
      return Number((0.85 + fractional * 0.25).toFixed(2));
    });
  }, [commentatorCount]);
  const getAvatarSize = (index: number, multiplierOverride?: number) => {
    const multiplier = multiplierOverride ?? sizeMultipliers[index] ?? 1;
    const baseSize = isMobile ? baseAvatarSize : Math.round(baseAvatarSize * 1.25);
    return Math.round(baseSize * multiplier);
  };
  const mobileTrackDistance = useMemo(() => {
    if (!isMobile) {
      return 0;
    }
    return (baseAvatarSize + 12) * COMMENTATOR_IMAGES.length;
  }, [baseAvatarSize, isMobile]);
  const mobileFloatingAnimation = useMemo(() => {
    if (!isMobile) {
      return null;
    }
    return keyframes`
      0% { transform: translateX(0%) translateY(0px); }
      25% { transform: translateX(-${mobileTrackDistance * 0.25}px) translateY(-8px); }
      50% { transform: translateX(-${mobileTrackDistance * 0.5}px) translateY(0px); }
      75% { transform: translateX(-${mobileTrackDistance * 0.75}px) translateY(8px); }
      100% { transform: translateX(-${mobileTrackDistance}px) translateY(0px); }
    `;
  }, [isMobile, mobileTrackDistance]);

  if (isMobile) {
    return (
      <Box
        sx={{
          position: 'absolute',
          left: -75,
          top: '30%', // Moved closer to top (was 50%, now 30% = 20% closer to top)
          transform: 'translateY(-50%)',
          width: 400,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap,
            animation: mobileFloatingAnimation ? `${mobileFloatingAnimation} 30s linear infinite alternate` : 'none',
            willChange: 'transform',
            '@media (prefers-reduced-motion: reduce)': {
              animation: 'none',
            },
          }}
        >
          {allCommentators.map((imagePath, index) => {
            const avatarSize = getAvatarSize(index);
            const shouldBreathe = index % 3 === 0; // Every 3rd avatar breathes
            const shouldFloatUp = index % 4 === 1; // Every 4th avatar floats up
            const shouldFloatDown = index % 5 === 2; // Every 5th avatar (offset) floats down
            const shouldRotate = !shouldBreathe && !shouldFloatUp && !shouldFloatDown;
            const isPriorityImage = index < 3;
            
            return (
            <Avatar
              key={`mobile-${index}`}
              sx={{
                width: avatarSize,
                height: avatarSize,
                background: `
                  linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
                  linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box
                `,
                backgroundSize: 'cover, cover',
                backgroundPosition: 'center, center',
                border: '2px solid transparent',
                flexShrink: 0,
                position: 'relative',
                // Add breathing animation to every 3rd avatar
                ...(shouldBreathe && {
                  animation: `${MOBILE_BREATHE} ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.5}s`
                }),
                ...(shouldFloatUp && {
                  animation: `${MOBILE_FLOAT_UP} ${3.5 + (index % 3) * 0.8}s ease-in-out infinite`,
                  animationDelay: `${index * 0.7}s`
                }),
                ...(shouldFloatDown && {
                  animation: `${MOBILE_FLOAT_DOWN} ${4 + (index % 3) * 0.6}s ease-in-out infinite`,
                  animationDelay: `${index * 0.8}s`
                }),
                ...(shouldRotate && {
                  animation: `${MOBILE_ROTATE} ${6 + (index % 3)}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.2}s`
                }),
                '@media (prefers-reduced-motion: reduce)': {
                  animation: 'none'
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.7)',
                  borderRadius: '50%',
                  zIndex: 1,
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 2,
                },
              }}
            >
              <Image
                src={imagePath}
                alt="Commentator"
                width={avatarSize}
                height={avatarSize}
                priority={isPriorityImage}
                loading={isPriorityImage ? undefined : 'lazy'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)',
                }}
              />
            </Avatar>
            );
          })}
        </Box>
      </Box>
    );
  }

  // Desktop: Offset grid layout

  return (
    <Box
      sx={{
        position: 'absolute',
        left: -40,
        top: '40%',
        transform: 'translateY(-50%)',
        width: 300, // Further increased width to maintain avatar sizes with tighter spacing
        height: 180,
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)', // 6 columns for offset effect
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 0.375, // Reduced by 25% (0.5 * 0.75 = 0.375)
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      {allCommentators.map((imagePath, index) => {
        const shouldBreathe = index % 3 === 0; // Every 3rd avatar breathes
        const shouldFloat = index % 2 === 1; // Every other avatar floats
        const shouldRotate = !shouldBreathe && !shouldFloat;
        const floatKeyframe = DESKTOP_FLOAT_KEYFRAMES[index % DESKTOP_FLOAT_KEYFRAMES.length];
        const isPriorityImage = index < 3;
        
        // Calculate grid position for hourglass pattern (3-2-3)
        let gridColumn, gridRow;
        
        if (index < 3) {
          // Top row: 3 avatars (positions 1, 3, 5)
          gridColumn = index * 2 + 1;
          gridRow = 1;
        } else if (index < 5) {
          // Middle row: 2 avatars (positions 2, 4) - centered
          gridColumn = (index - 3) * 2 + 2;
          gridRow = 2;
        } else {
          // Bottom row: 3 avatars (positions 1, 3, 5)
          gridColumn = (index - 5) * 2 + 1;
          gridRow = 3;
        }
        
        const avatarSize = getAvatarSize(index);
        return (
          <Avatar
            key={`desktop-grid-${index}`}
            sx={{
              gridColumn: gridColumn,
              gridRow: gridRow,
              width: avatarSize,
              height: avatarSize,
              background: `
                linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
                linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box
              `,
              backgroundSize: 'cover, cover',
              backgroundPosition: 'center, center',
              border: '2px solid transparent',
              flexShrink: 0,
              position: 'relative',
              boxShadow: '0 8px 24px rgba(0, 0, 0, 0.4)',
              // Add breathing animation to every 3rd avatar
              ...(shouldBreathe && {
                animation: `${DESKTOP_BREATHE} ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.4}s`
              }),
              // Add randomized floating animation to every other avatar
              ...(shouldFloat && {
                animation: `${floatKeyframe} ${3.5 + (index % 4) * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`
              }),
              // Add rotation for the least active avatars
              ...(shouldRotate && {
                animation: `${DESKTOP_ROTATE} ${8 + (index % 3)}s ease-in-out infinite alternate`,
                animationDelay: `${index * 0.2}s`
              }),
              '@media (prefers-reduced-motion: reduce)': {
                animation: 'none'
              },
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                borderRadius: '50%',
                zIndex: 1,
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
            }}
            >
              <Image
                src={imagePath}
                alt="Commentator"
                width={avatarSize}
                height={avatarSize}
                priority={isPriorityImage}
                loading={isPriorityImage ? undefined : 'lazy'}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'grayscale(100%)',
              }}
            />
          </Avatar>
        );
      })}
    </Box>
  );
}

export default function VerseTakeawaysHeader({
  title,
  book,
  chapter,
  subtitle,
  breadcrumbItems,
  showIcon = true,
  actions
}: VerseTakeawaysHeaderProps) {
  const theme = useTheme();

  const baseDarkBackground = '#121212';
  
  // Background for the right-side panel with the strong gradient
  const rightGradientPanelBg = `linear-gradient(216deg, ${VERSE_TAKEAWAYS_COLORS.primary} 0%, black 100%)`;

  // Background for the main content area (left side) - subtle gradient
  const contentAreaBgColor = `linear-gradient(0deg, rgba(237, 39, 255, 0.07) 0%, rgba(237, 39, 255, 0.07) 100%), ${baseDarkBackground}`;

  // Helper function to get mobile-friendly book name (matching VerseNavigationBar.tsx)
  const getMobileBookName = (name: string) => {
    switch (name) {
      case 'Song of Solomon':
        return 'Songs';
      case 'Deuteronomy':
        return 'Deut.';
      case '1 Chronicles':
        return '1 Chr.';
      case '2 Chronicles':
        return '2 Chr.';
      case '1 Corinthians':
        return '1 Cor.';
      case '2 Corinthians':
        return '2 Cor.';
      case 'Ephesians':
        return 'Eph.';
      case 'Philippians':
        return 'Phil.';
      case 'Colossians':
        return 'Col.';
      case '1 Thessalonians':
        return '1 Thess.';
      case '2 Thessalonians':
        return '2 Thess.';
      case '1 Timothy':
        return '1 Tim.';
      case '2 Timothy':
        return '2 Tim.';
      case 'Philemon':
        return 'Phlm.';
      case 'Revelation':
        return 'Rev.';
      default:
        return name;
    }
  };

  // Transform labels for responsive display
  const getResponsiveLabel = (label: string) => {
    if (label === 'Verse Takeaways') {
      return {
        mobile: 'Takeaways',
        desktop: label
      };
    }
    if (label.startsWith('Chapter ')) {
      const chapterNum = label.replace('Chapter ', '');
      return {
        mobile: chapterNum,
        desktop: `Ch. ${chapterNum}`
      };
    }
    // Remove "Verse " prefix and just show the number/range on mobile
    if (label.toLowerCase().startsWith('verse ')) {
      const verseNum = label.replace(/^verse /i, '');
      return {
        mobile: verseNum,
        desktop: label
      };
    }
    // Apply mobile book name abbreviations
    return {
      mobile: getMobileBookName(label),
      desktop: label
    };
  };

  // Right panel width - can be narrower than the image to emphasize overlap
  const rightPanelWidth = theme.spacing(40);

  return (
    <Box
      sx={{
        borderRadius: 4.5,
        border: '2px solid transparent',
        background: `
          linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
          linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box
        `,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        overflow: 'hidden',
        mb: 4,
        position: 'relative',
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
          transition: 'background 0.3s ease',
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
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
        {/* Animated commentator array for mobile */}
        {showIcon && (
          <Box
            sx={{
              position: 'relative',
              mb: 0.5,
              width: '100%',
              height: 60,
            }}
          >
            <AnimatedCommentatorArray isMobile={true} />
          </Box>
        )}

        {/* Breadcrumbs */}
        <Breadcrumbs
          separator="›"
          sx={{
            mb: 1.5,
            '& .MuiBreadcrumbs-separator': {
              color: VERSE_TAKEAWAYS_COLORS.chipText,
              fontSize: '14px',
            },
          }}
        >
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const responsiveLabel = getResponsiveLabel(item.label);

            return isLast ? (
              <Typography
                key={index}
                sx={{
                  color: VERSE_TAKEAWAYS_COLORS.chipText,
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: 'none',
                }}
              >
                {responsiveLabel.mobile}
              </Typography>
            ) : (
              <Typography
                key={index}
                sx={{
                  color: VERSE_TAKEAWAYS_COLORS.chipText,
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: 'none',
                  cursor: item.href ? 'pointer' : 'default',
                  '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                }}
                component={item.href ? Link : 'span'}
                href={item.href}
              >
                {responsiveLabel.mobile}
              </Typography>
            );
          })}
        </Breadcrumbs>

        {/* Title - smaller on mobile and left aligned */}
        <Typography
            component="p"
            sx={{
              color: '#FFFAFA',
              fontSize: { xs: 24, sm: 26 },
              fontWeight: 400,
              lineHeight: 1.25,
              mb: subtitle ? 1 : 1,
            }}
          >
            {book && chapter ? (
              <>
                What do top commentators say about <Box component="span" sx={{ fontWeight: 'bold' }}>{book} {chapter}</Box>?
              </>
            ) : title === "Available Takeaways" ? (
              <>
                Available{' '}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  Takeaways
                </Box>
              </>
            ) : title.endsWith(' Verse Takeaways') ? (
              <>
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {title.replace(' Verse Takeaways', '')}
                </Box>
                {' '}Verse Takeaways
              </>
            ) : title.includes('What do top commentators say') && title.includes('means?') ? (
              <>
                What do top commentators say{' '}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {title.replace('What do top commentators say ', '').replace(' means?', '')}
                </Box>
                {' '}means?
              </>
            ) : (
              title
            )}
          </Typography>
        
        {/* Subtitle if provided */}
        {subtitle && (
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: 15, sm: 17 },
              fontWeight: 400,
              lineHeight: 1.25,
              mb: 2,
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Actions for mobile */}
        {actions && (
          <Box sx={{ mt: 2 }}>
            {actions}
          </Box>
        )}
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
            pr: 7,
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
                color: VERSE_TAKEAWAYS_COLORS.chipText,
                fontSize: '14px',
              },
            }}
          >
            {breadcrumbItems.map((item, index) => {
              const isLast = index === breadcrumbItems.length - 1;
              const responsiveLabel = getResponsiveLabel(item.label);

              return isLast ? (
                <Typography
                  key={index}
                  sx={{
                    color: VERSE_TAKEAWAYS_COLORS.chipText,
                    fontSize: 14,
                    fontWeight: 400,
                    textDecoration: 'none',
                  }}
                >
                  {responsiveLabel.desktop}
                </Typography>
              ) : (
                <Typography
                  key={index}
                  sx={{
                    color: VERSE_TAKEAWAYS_COLORS.chipText,
                    fontSize: 14,
                    fontWeight: 400,
                    textDecoration: 'none',
                    cursor: item.href ? 'pointer' : 'default',
                    '&:hover': { color: item.href ? 'rgba(255, 255, 255, 0.85)' : 'inherit' },
                  }}
                  component={item.href ? Link : 'span'}
                  href={item.href}
                >
                  {responsiveLabel.desktop}
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
              mb: subtitle ? 1 : 1.5,
            }}
          >
            {book && chapter ? (
              <>
                What do top commentators say on <Box component="span" sx={{ fontWeight: 'bold' }}>{book} {chapter}</Box>?
              </>
            ) : title === "Available Takeaways" ? (
              <>
                Available{' '}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  Takeaways
                </Box>
              </>
            ) : title.endsWith(' Verse Takeaways') ? (
              <>
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {title.replace(' Verse Takeaways', '')}
                </Box>
                {' '}Verse Takeaways
              </>
            ) : title.includes('What do top commentators say') && title.includes('means?') ? (
              <>
                What do top commentators say{' '}
                <Box component="span" sx={{ fontWeight: 'bold' }}>
                  {title.replace('What do top commentators say ', '').replace(' means?', '')}
                </Box>
                {' '}means?
              </>
            ) : (
              title
            )}
          </Typography>
          
          {/* Subtitle if provided */}
          {subtitle && (
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 18,
                fontWeight: 400,
                lineHeight: 1.25,
                mb: 2,
                pr: 3,
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* Actions for desktop */}
          {actions && (
            <Box sx={{ mt: 2 }}>
              {actions}
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Animated commentator array - Desktop only */}
          {showIcon && (
            <Box
              sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
              }}
            >
              <AnimatedCommentatorArray isMobile={false} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
}
