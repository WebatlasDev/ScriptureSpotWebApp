'use client';

import { Box, Typography, Breadcrumbs, useTheme, ButtonBase, IconButton } from '@mui/material';
import { ArrowBack, ArrowForward, Share, BookmarkBorder, Bookmark } from '@/components/ui/phosphor-icons';
import { interlinearThemes } from '@/styles/interlinearThemes';
import { useRouter } from 'next/navigation';

interface StrongsData {
  strongsNumber: string;
  originalWord: string;
  transliteration: string;
  englishWord: string;
  rootWord: string;
  shortDefinition: string;
  frequency: number;
  grammar: string;
  morphology: string;
  definition: string;
  language: 'HEBREW' | 'GREEK';
}

interface StrongsHeaderProps {
  strongsData: StrongsData;
  breadcrumbItems: Array<{
    label: string;
    href?: string;
  }>;
  onShare?: () => void;
  onBookmark?: () => void;
  isBookmarked?: boolean;
}

export default function StrongsHeader({
  strongsData,
  breadcrumbItems,
  onShare,
  onBookmark,
  isBookmarked = false
}: StrongsHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  
  // Get theme colors based on language
  const interlinearTheme = interlinearThemes[strongsData.language];
  
  // Create author-like color scheme from interlinear theme
  const authorColorScheme = {
    primary: interlinearTheme.strongsColor,
    outline: `${interlinearTheme.strongsColor}33`, // 20% opacity
    chipBackground: `${interlinearTheme.strongsColor}26`, // 15% opacity
    chipText: interlinearTheme.strongsColor,
  };

  // Base dark background
  const baseDarkBackground = '#121212';

  // Background for the main content area with pattern
  const contentAreaBgColor = interlinearTheme.drawerBg;

  // Navigation logic for Strong's numbers
  const getNavigationNumbers = () => {
    const strongsNumber = strongsData.strongsNumber;
    const prefix = strongsNumber.charAt(0); // 'G' or 'H'
    const number = parseInt(strongsNumber.substring(1));
    
    const previousNumber = number > 1 ? `${prefix}${number - 1}` : null;
    const nextNumber = `${prefix}${number + 1}`;
    
    return { previousNumber, nextNumber };
  };

  const { previousNumber, nextNumber } = getNavigationNumbers();

  const handleNavigation = (strongsNumber: string) => {
    router.push(`/strongs/${strongsNumber}`);
  };

  const renderCombinedTitle = () => {
    return (
      <>
        <Box component="span" sx={{ fontWeight: 700 }}>
          {strongsData.originalWord}
        </Box>
        {strongsData.transliteration && (
          <>
            {' ('}
            <Box component="span" sx={{ fontStyle: 'italic' }}>
              {strongsData.transliteration}
            </Box>
            {')'}
          </>
        )}
      </>
    );
  };

  const renderNavigationButtons = () => {
    return (
      <Box sx={{ display: 'flex', gap: 1 }}>
        <ButtonBase
          onClick={() => previousNumber && handleNavigation(previousNumber)}
          disabled={!previousNumber}
          sx={{
            padding: '4px 14px',
            backgroundColor: previousNumber ? authorColorScheme.chipBackground : 'rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            border: `2px solid ${previousNumber ? authorColorScheme.chipText + '40' : 'rgba(255, 255, 255, 0.2)'}`,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: previousNumber ? 'pointer' : 'default',
            opacity: previousNumber ? 1 : 0.5,
            boxShadow: previousNumber ? '0 2px 8px rgba(0, 0, 0, 0.15)' : 'none',
            transition: 'all 0.2s ease',
            '&:hover': previousNumber ? {
              backgroundColor: `${authorColorScheme.chipBackground}DD`,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            } : {},
          }}
        >
          <ArrowBack sx={{ fontSize: 14, color: authorColorScheme.chipText }} />
          <Typography sx={{
            color: authorColorScheme.chipText,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {previousNumber || 'Prev'}
          </Typography>
        </ButtonBase>

        <ButtonBase
          onClick={() => handleNavigation(nextNumber)}
          sx={{
            padding: '4px 14px',
            backgroundColor: authorColorScheme.chipBackground,
            borderRadius: '12px',
            border: `2px solid ${authorColorScheme.chipText}40`,
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
            transition: 'all 0.2s ease',
            '&:hover': {
              backgroundColor: `${authorColorScheme.chipBackground}DD`,
              transform: 'translateY(-1px)',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
            },
          }}
        >
          <Typography sx={{
            color: authorColorScheme.chipText,
            fontSize: 12,
            fontWeight: 500,
          }}>
            {nextNumber}
          </Typography>
          <ArrowForward sx={{ fontSize: 14, color: authorColorScheme.chipText }} />
        </ButtonBase>
      </Box>
    );
  };

  // Define dimensions for the image and the right panel
  const imageWidth = 310;
  const imageHeight = 243;
  const rightPanelWidth = theme.spacing(18);
  const imageOffsetLeft = { xs: '-70px', sm: '-80px', md: '-145px' };

  return (
    <Box
      sx={{
        borderRadius: 3.5,
        outline: `2px solid ${authorColorScheme.outline}`,
        outlineOffset: '-2px',
        overflow: 'hidden',
        mb: 4,
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

        {/* Breadcrumbs */}
        <Breadcrumbs
          separator="›"
          sx={{
            mb: 1.5,
            '& .MuiBreadcrumbs-separator': {
              color: authorColorScheme.chipText,
              fontSize: '14px',
            },
          }}
        >
          {breadcrumbItems.map((item, index) => (
            <Typography
              key={index}
              sx={{
                color: authorColorScheme.chipText,
                fontSize: 14,
                fontWeight: 400,
                textDecoration: 'none',
                cursor: item.href ? 'pointer' : 'default',
                '&:hover': item.href ? { color: 'rgba(255, 255, 255, 0.85)' } : {},
              }}
              component={item.href ? 'a' : 'span'}
              href={item.href}
            >
              {item.label}
            </Typography>
          ))}
        </Breadcrumbs>

        {/* Title - smaller on mobile and left aligned */}
        <Typography
          component="h1"
          sx={{
            color: '#FFFAFA',
            fontSize: { xs: 24, sm: 26 },
            fontWeight: 400,
            lineHeight: 1.25,
            mb: 2,
          }}
        >
          {renderCombinedTitle()}
        </Typography>
        
        {/* Navigation buttons */}
        {renderNavigationButtons()}
      </Box>

      {/* Desktop Layout - md and up */}
      <Box
        sx={{
          display: { xs: 'none', md: 'flex' },
          minHeight: '160px',
          background: contentAreaBgColor,
          py: 5,
          px: 4,
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Left Side - Content */}
        <Box sx={{ flex: 1 }}>
          <Breadcrumbs
            separator="›"
            sx={{
              mb: 1.5,
              '& .MuiBreadcrumbs-separator': {
                color: authorColorScheme.chipText,
                fontSize: '14px',
              },
            }}
          >
            {breadcrumbItems.map((item, index) => (
              <Typography
                key={index}
                sx={{
                  color: authorColorScheme.chipText,
                  fontSize: 14,
                  fontWeight: 400,
                  textDecoration: 'none',
                  cursor: item.href ? 'pointer' : 'default',
                  '&:hover': item.href ? { color: 'rgba(255, 255, 255, 0.85)' } : {},
                }}
                component={item.href ? 'a' : 'span'}
                href={item.href}
              >
                {item.label}
              </Typography>
            ))}
          </Breadcrumbs>

          <Typography
            component="h1"
            sx={{
              color: '#FFFAFA',
              fontSize: 32,
              fontWeight: 400,
              lineHeight: 1.25,
              mb: 2,
            }}
          >
            {renderCombinedTitle()}
          </Typography>
          
          {/* Navigation buttons */}
          {renderNavigationButtons()}
        </Box>

        {/* Right Side - Action buttons */}
        {(onShare || onBookmark) && (
          <Box
            sx={{
              display: 'flex',
              gap: 1,
              ml: 4,
            }}
          >
            {onShare && (
              <IconButton 
                onClick={onShare}
                size="small" 
                sx={{ 
                  color: 'rgba(255, 255, 255, 0.8)',
                  width: 40,
                  height: 40,
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: 'white',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                <Share sx={{ fontSize: 18 }} />
              </IconButton>
            )}
            {onBookmark && (
              <IconButton 
                onClick={onBookmark}
                size="small" 
                sx={{ 
                  color: isBookmarked ? '#FF9800' : 'rgba(255, 255, 255, 0.8)',
                  width: 40,
                  height: 40,
                  border: `2px solid ${isBookmarked ? '#FF9800' + '40' : 'rgba(255, 255, 255, 0.2)'}`,
                  borderRadius: '20px',
                  transition: 'all 0.2s ease',
                  '&:hover': { 
                    color: isBookmarked ? '#FFB74D' : 'white',
                    backgroundColor: isBookmarked ? 'rgba(255, 152, 0, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                    borderColor: isBookmarked ? '#FF9800' + '60' : 'rgba(255, 255, 255, 0.3)',
                    transform: 'translateY(-1px)',
                  }
                }}
              >
                {isBookmarked ? <Bookmark sx={{ fontSize: 18 }} /> : <BookmarkBorder sx={{ fontSize: 18 }} />}
              </IconButton>
            )}
          </Box>
        )}
      </Box>
    </Box>
  );
}