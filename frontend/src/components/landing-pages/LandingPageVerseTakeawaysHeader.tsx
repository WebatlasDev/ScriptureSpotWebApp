'use client';

import { Box, Typography, useTheme, Avatar } from '@mui/material';
import Image from 'next/image';

interface LandingPageVerseTakeawaysHeaderProps {
  title: string;
  subtitle?: string;
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
  '/assets/images/authors/Thomas_Aquinas_Small.webp',
  '/assets/images/authors/John_Gill_Small.webp',
];

// Animated Commentator Array Component
interface AnimatedCommentatorArrayProps {
  isMobile?: boolean;
}

function AnimatedCommentatorArray({ isMobile = false }: AnimatedCommentatorArrayProps) {
  const baseAvatarSize = isMobile ? 45 : 60;
  const gap = isMobile ? 1.5 : 1.5;
  
  const sizeVariations = [1.0, 0.9, 0.8];
  const getRandomSize = () => sizeVariations[Math.floor(Math.random() * sizeVariations.length)];
  
  const generateSizeMultipliers = (count: number) => {
    return Array.from({ length: count }, () => getRandomSize());
  };
  
  if (isMobile) {
    const allCommentators = [...COMMENTATOR_IMAGES, ...COMMENTATOR_IMAGES, ...COMMENTATOR_IMAGES];
    const sizeMultipliers = generateSizeMultipliers(allCommentators.length);
    
    return (
      <Box
        sx={{
          position: 'absolute',
          left: -75,
          top: '30%',
          transform: 'translateY(-50%)',
          width: 400,
          height: 60,
          display: 'flex',
          alignItems: 'center',
          '@keyframes floatingMove': {
            '0%': { 
              transform: 'translateX(0%) translateY(0px)' 
            },
            '25%': { 
              transform: `translateX(-${(baseAvatarSize + 12) * COMMENTATOR_IMAGES.length * 0.25}px) translateY(-8px)` 
            },
            '50%': { 
              transform: `translateX(-${(baseAvatarSize + 12) * COMMENTATOR_IMAGES.length * 0.5}px) translateY(0px)` 
            },
            '75%': { 
              transform: `translateX(-${(baseAvatarSize + 12) * COMMENTATOR_IMAGES.length * 0.75}px) translateY(8px)` 
            },
            '100%': { 
              transform: `translateX(-${(baseAvatarSize + 12) * COMMENTATOR_IMAGES.length}px) translateY(0px)` 
            }
          }
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap,
            animation: 'floatingMove 30s linear infinite alternate',
            willChange: 'transform',
          }}
        >
          {allCommentators.map((imagePath, index) => {
            const avatarSize = Math.round(baseAvatarSize * sizeMultipliers[index]);
            const shouldBreathe = index % 3 === 0;
            const shouldFloatUp = index % 4 === 1;
            const shouldFloatDown = index % 5 === 2;
            const shouldRotate = !shouldBreathe && !shouldFloatUp && !shouldFloatDown;
            
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
                ...(shouldBreathe && {
                  '@keyframes breathe': {
                    '0%, 100%': { transform: 'scale(1)' },
                    '50%': { transform: 'scale(1.05)' }
                  },
                  animation: `breathe ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
                  animationDelay: `${index * 0.5}s`
                }),
                ...(shouldFloatUp && {
                  '@keyframes floatUp': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-4px)' }
                  },
                  animation: `floatUp ${3.5 + (index % 3) * 0.8}s ease-in-out infinite`,
                  animationDelay: `${index * 0.7}s`
                }),
                ...(shouldFloatDown && {
                  '@keyframes floatDown': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(4px)' }
                  },
                  animation: `floatDown ${4 + (index % 3) * 0.6}s ease-in-out infinite`,
                  animationDelay: `${index * 0.8}s`
                }),
                ...(shouldRotate && {
                  '@keyframes rotateMobile': {
                    '0%, 100%': { transform: 'rotate(-5deg)' },
                    '50%': { transform: 'rotate(5deg)' }
                  },
                  animation: `rotateMobile ${6 + (index % 3)}s ease-in-out infinite alternate`,
                  animationDelay: `${index * 0.2}s`
                }),
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
  const desktopAvatarSize = Math.round(baseAvatarSize * 1.25);
  const allCommentators = COMMENTATOR_IMAGES;
  const sizeMultipliers = generateSizeMultipliers(allCommentators.length);
  
  const generateFloatDirection = (index: number) => {
    const directions = [
      { x: -4, y: -3 }, { x: 4, y: -3 },  { x: -4, y: 3 },  { x: 4, y: 3 },   
      { x: -5, y: 0 },  { x: 5, y: 0 },   { x: 0, y: -4 },  { x: 0, y: 4 },   
    ];
    return directions[index % directions.length];
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        left: -40,
        top: '40%',
        transform: 'translateY(-50%)',
        width: 300,
        height: 180,
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridTemplateRows: 'repeat(3, 1fr)',
        gap: 0.375,
        alignItems: 'center',
        justifyItems: 'center',
      }}
    >
      {allCommentators.map((imagePath, index) => {
        const avatarSize = Math.round(desktopAvatarSize * sizeMultipliers[index]);
        const shouldBreathe = index % 3 === 0;
        const shouldFloat = index % 2 === 1;
        const shouldRotate = !shouldBreathe && !shouldFloat;
        const floatDirection = generateFloatDirection(index);
        
        let gridColumn: number, gridRow: number;
        
        if (index < 3) {
          gridColumn = index * 2 + 1;
          gridRow = 1;
        } else if (index < 5) {
          gridColumn = (index - 3) * 2 + 2;
          gridRow = 2;
        } else {
          gridColumn = (index - 5) * 2 + 1;
          gridRow = 3;
        }
        
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
              ...(shouldBreathe && {
                '@keyframes breatheDesktopGrid': {
                  '0%, 100%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.1)' }
                },
                animation: `breatheDesktopGrid ${2 + (index % 3) * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.4}s`
              }),
              ...(shouldFloat && {
                [`@keyframes floatDesktopGrid${index}`]: {
                  '0%, 100%': { transform: 'translate(0px, 0px)' },
                  '50%': { transform: `translate(${floatDirection.x}px, ${floatDirection.y}px)` }
                },
                animation: `floatDesktopGrid${index} ${3.5 + (index % 4) * 0.5}s ease-in-out infinite`,
                animationDelay: `${index * 0.3}s`
              }),
              ...(shouldRotate && {
                '@keyframes rotateDesktop': {
                  '0%, 100%': { transform: 'rotate(-5deg)' },
                  '50%': { transform: 'rotate(5deg)' }
                },
                animation: `rotateDesktop ${8 + (index % 3)}s ease-in-out infinite alternate`,
                animationDelay: `${index * 0.2}s`
              }),
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

export default function LandingPageVerseTakeawaysHeader({
  title,
  subtitle
}: LandingPageVerseTakeawaysHeaderProps) {
  const theme = useTheme();

  const baseDarkBackground = '#121212';
  
  // Background for the right-side panel with the strong gradient
  const rightGradientPanelBg = `linear-gradient(216deg, ${VERSE_TAKEAWAYS_COLORS.primary} 0%, black 100%)`;

  // Background for the main content area (left side) - subtle gradient
  const contentAreaBgColor = `linear-gradient(0deg, rgba(237, 39, 255, 0.07) 0%, rgba(237, 39, 255, 0.07) 100%), ${baseDarkBackground}`;
  
  // Determine if this is a chapter study guide
  const isChapterStudyGuide = title.toLowerCase().includes('study guide');
  
  // Generate proper subtitle for chapter study guides
  let displaySubtitle = subtitle;
  if (isChapterStudyGuide && subtitle === title) {
    // Extract book and chapter from title for dynamic subtitle
    const studyGuidePattern = /^(.+?\s+\d+)\s+study guide$/i;
    const match = title.match(studyGuidePattern);
    if (match) {
      const bookAndChapter = match[1];
      displaySubtitle = `Here's what the top Christian pastors, scholars, and theologians from history say about ${bookAndChapter}.`;
    }
  }

  // Enhanced title rendering with verse bolding for landing pages
  const renderLandingPageTitle = (_isMobile = false) => {
    // Pattern for "What does [Book Chapter:Verse] mean?"
    const versePattern = /What does (.+?) mean\?/i;
    const verseMatch = title.match(versePattern);
    
    if (verseMatch) {
      const biblicalReference = verseMatch[1];
      return (
        <>
          What does{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {biblicalReference}
          </Box>
          {' '}mean?
        </>
      );
    }

    // Pattern for "What do top commentators say about/on [reference]?"
    const commentatorPattern = /What do top commentators say (about|on) (.+?)\?/i;
    const commentatorMatch = title.match(commentatorPattern);
    
    if (commentatorMatch) {
      const preposition = commentatorMatch[1];
      const reference = commentatorMatch[2];
      return (
        <>
          What do top commentators say {preposition}{' '}
          <Box component="span" sx={{ fontWeight: 700 }}>
            {reference}
          </Box>
          ?
        </>
      );
    }

    // Pattern for "[Book] [Chapter] study guide"
    const studyGuidePattern = /^(.+?)\s+(\d+)\s+study guide$/i;
    const studyGuideMatch = title.match(studyGuidePattern);
    
    if (studyGuideMatch) {
      const bookName = studyGuideMatch[1];
      const chapter = studyGuideMatch[2];
      return (
        <>
          <Box component="span" sx={{ fontWeight: 700 }}>
            {bookName} {chapter}
          </Box>
          {' '}Study Guide
        </>
      );
    }

    // Fallback: return title as-is
    return title;
  };

  // Right panel width
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
          p: 3.5, // Increased padding for landing page
        }}
      >
        {/* Animated commentator array for mobile */}
        <Box
          sx={{
            position: 'relative',
            mb: 2, // Increased margin
            width: '100%',
            height: 60,
          }}
        >
          <AnimatedCommentatorArray isMobile={true} />
        </Box>

        {/* Eyebrow text - mobile */}
        <Typography
          sx={{
            color: VERSE_TAKEAWAYS_COLORS.chipText,
            fontSize: 14,
            fontWeight: 400,
            mb: 1.5,
            textDecoration: 'none',
          }}
        >
          {isChapterStudyGuide ? 'Bible Study' : 'Top Commentaries'}
        </Typography>

        {/* Title - larger for landing page */}
        <Typography
          component="h1"
          sx={{
            color: '#FFFAFA',
            fontSize: { xs: 28, sm: 32 }, // Increased from 24/26
            fontWeight: 400,
            lineHeight: 1.2, // Tighter line height for larger text
            mb: displaySubtitle ? 2 : 2,
          }}
        >
          {renderLandingPageTitle(true)}
        </Typography>
        
        {/* Subtitle if provided */}
        {displaySubtitle && (
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              fontSize: { xs: 16, sm: 19 }, // Slightly increased
              fontWeight: 400,
              lineHeight: 1.4,
              mb: 2,
            }}
          >
            {displaySubtitle}
          </Typography>
        )}
      </Box>

      {/* Desktop Layout - md and up */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: '220px', // Increased height for larger text
        }}
      >
        {/* Left Text Content Area */}
        <Box
          sx={{
            flex: 1,
            minWidth: 0,
            background: contentAreaBgColor,
            py: 6, // Increased padding
            pl: 5, // Increased padding
            pr: 7,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            zIndex: 1,
          }}
        >
          {/* Eyebrow text - desktop */}
          <Typography
            sx={{
              color: VERSE_TAKEAWAYS_COLORS.chipText,
              fontSize: 14,
              fontWeight: 400,
              mb: 1.5,
              textDecoration: 'none',
            }}
          >
            {isChapterStudyGuide ? 'Bible Study' : 'Top Commentaries'}
          </Typography>

          <Typography
            component="h1"
            sx={{
              color: '#FFFAFA',
              fontSize: 38, // Increased from 32
              fontWeight: 400,
              lineHeight: 1.2,
              mb: displaySubtitle ? 2 : 2,
            }}
          >
            {renderLandingPageTitle()}
          </Typography>
          
          {/* Subtitle */}
          {displaySubtitle && (
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.7)',
                fontSize: 18, // Increased from 20
                fontWeight: 400,
                lineHeight: 1.3,
                mb: 2,
                pr: 3,
              }}
            >
              {displaySubtitle}
            </Typography>
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
          <Box
            sx={{
              position: 'relative',
              width: '100%',
              height: '100%',
            }}
          >
            <AnimatedCommentatorArray isMobile={false} />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}