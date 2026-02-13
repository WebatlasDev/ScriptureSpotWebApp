'use client';

import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  IconButton,
  Typography,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
  useMediaQuery,
} from '@mui/material';
import {
  SearchOutlined,
  BookmarkBorderOutlined,
  ShareOutlined,
  Settings,
  ArrowBack,
  MoreVert,
} from '@/components/ui/phosphor-icons';
import { useRouter } from 'next/navigation';

interface ReaderHeaderProps {
  book: {
    name: string;
    slug: string;
  };
  author: {
    name: string;
    slug: string;
    image?: string;
    colorScheme?: any;
  };
  chapter: number;
  readerTheme: 'light' | 'sepia' | 'dark';
  onSearchToggle: () => void;
  onBookmark: () => void;
  onShare: () => void;
  onSettingsOpen: () => void;
  isMobile: boolean;
  settingsOpen: boolean;
  scrollContainerRef?: React.RefObject<HTMLDivElement | null>;
}

export default function ReaderHeader({
  book,
  author,
  chapter: _chapter,
  readerTheme,
  onSearchToggle,
  onBookmark,
  onShare,
  onSettingsOpen,
  isMobile,
  settingsOpen,
  scrollContainerRef,
}: ReaderHeaderProps) {
  const theme = useTheme();
  const router = useRouter();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  // Set mounted state
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleMenuAction = (action: () => void) => {
    action();
    handleMenuClose();
  };

  useEffect(() => {
    if (!mounted) return;

    let ticking = false;
    let cachedScrollableHeight = 0;

    const updateScrollProgress = () => {
      const container = scrollContainerRef?.current;
      if (!container) {
        // Fallback to window scroll
        const windowHeight = window.innerHeight;
        const documentHeight = document.documentElement.scrollHeight;
        const scrollTop = window.scrollY;
        cachedScrollableHeight = documentHeight - windowHeight;
        
        if (cachedScrollableHeight > 0) {
          const progress = Math.min((scrollTop / cachedScrollableHeight) * 100, 100);
          setScrollProgress(progress);
        }
      } else {
        // Use container scroll
        const scrollTop = container.scrollTop;
        const scrollHeight = container.scrollHeight;
        const clientHeight = container.clientHeight;
        cachedScrollableHeight = scrollHeight - clientHeight;
        
        if (cachedScrollableHeight > 0) {
          const progress = Math.min((scrollTop / cachedScrollableHeight) * 100, 100);
          setScrollProgress(progress);
        }
      }
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(updateScrollProgress);
        ticking = true;
      }
    };

    const container = scrollContainerRef?.current;
    
    if (container) {
      container.addEventListener('scroll', handleScroll, { passive: true });
    } else {
      window.addEventListener('scroll', handleScroll, { passive: true });
    }
    
    // Initial calculation
    updateScrollProgress();

    return () => {
      if (container) {
        container.removeEventListener('scroll', handleScroll);
      } else {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, [scrollContainerRef, mounted]);

  // Get reader styles based on theme
  const getReaderStyles = () => {
    switch (readerTheme) {
      case 'light':
        return {
          color: '#000000',
        };
      case 'sepia':
        return {
          color: '#5C4B3A',
        };
      case 'dark':
      default:
        return {
          color: '#FFFAFA',
        };
    }
  };

  const readerStyles = getReaderStyles();

  // Don't show header in certain conditions
  if (isMobile && settingsOpen) {
    return null;
  }

  return (
    <AppBar 
      position="sticky"
      elevation={0}
      sx={{ 
        top: 0, 
        zIndex: 40,
        borderBottom: '1px solid rgba(32, 38, 52, 1)',
        backdropFilter: 'blur(8px)',
        background: readerTheme === 'dark' 
          ? 'linear-gradient(180deg, rgba(17, 21, 27, 0.88), rgba(17, 21, 27, 0.78))'
          : readerTheme === 'sepia'
          ? 'linear-gradient(180deg, rgba(244, 241, 232, 0.95), rgba(244, 241, 232, 0.85))'
          : 'linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.85))',
      }}
    >
      <Toolbar sx={{ 
        justifyContent: 'space-between',
        minHeight: '56px !important',
        px: { xs: 1, sm: 2 },
        gap: 1,
      }}>
        {/* Left section: Back Arrow + Avatar */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {/* Back Arrow */}
          <IconButton
            sx={{
              width: 32,
              height: 32,
              borderRadius: '8px',
              bgcolor: 'transparent',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: readerStyles.color,
              p: 0.5,
              '&:hover': {
                bgcolor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
            onClick={() => router.back()}
            aria-label="Go back"
          >
            <ArrowBack sx={{ fontSize: 18 }} />
          </IconButton>

          {/* Author Avatar with gradient background like CommentaryCard */}
          <Box sx={{ position: 'relative', width: 28, height: 28, flexShrink: 0 }}>
            <Box
              sx={{
                width: 28,
                height: 28,
                borderRadius: '50%',
                background: author.colorScheme?.primary 
                  ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
                  : 'linear-gradient(216deg, #278EFF 0%, black 100%)',
                position: 'absolute',
                zIndex: 1,
                overflow: 'hidden',
              }}
            >
              {author.image && (
                <Box
                  component="img"
                  src={author.image}
                  alt={author.name}
                  sx={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'center bottom',
                    display: 'block',
                  }}
                />
              )}
            </Box>
          </Box>
        </Box>

        {/* Center section: Title with truncation */}
        <Box 
          sx={{ 
            flex: 1,
            minWidth: 0,
            display: 'flex',
            alignItems: 'center',
            mx: 1,
          }}
        >
          <Tooltip 
            title={book.name} 
            enterDelay={500}
            enterTouchDelay={0}
            placement="bottom"
            slotProps={{
              popper: {
                sx: {
                  '& .MuiTooltip-tooltip': {
                    bgcolor: readerTheme === 'dark'
                      ? 'rgba(28, 32, 40, 0.95)'
                      : readerTheme === 'sepia'
                      ? 'rgba(244, 241, 232, 0.95)'
                      : 'rgba(97, 97, 97, 0.92)',
                    color: readerTheme === 'dark'
                      ? '#FFFAFA'
                      : readerTheme === 'sepia'
                      ? '#5C4B3A'
                      : '#FFFFFF',
                    fontSize: '0.875rem',
                    fontWeight: 500,
                    py: 0.75,
                    px: 1.5,
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  },
                },
              },
            }}
          >
            <Typography 
              variant="h6" 
              sx={{ 
                color: readerStyles.color,
                fontSize: isSmallScreen ? '0.95rem' : '1.05rem',
                fontWeight: 700,
                letterSpacing: '0.01em',
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
              }}
            >
              {book.name}
            </Typography>
          </Tooltip>
        </Box>

        {/* Right section: Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexShrink: 0 }}>
          {isSmallScreen || isMobile ? (
            <>
              {/* Three-dot menu for mobile */}
              <IconButton
                onClick={handleMenuOpen}
                sx={{
                  width: 32,
                  height: 32,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: readerStyles.color,
                  p: 0.5,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.15)',
                  },
                }}
                aria-label="More options"
              >
                <MoreVert sx={{ fontSize: 20 }} />
              </IconButton>

              {/* Settings button - always visible */}
              <IconButton 
                onClick={onSettingsOpen}
                sx={{ 
                  width: 32,
                  height: 32,
                  borderRadius: '8px',
                  background: 'linear-gradient(46deg, rgba(255, 215, 0, 0.8) 0%, rgba(184, 134, 11, 0.8) 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0px 2px 192.8px 12px #FFD700',
                  transition: 'all 0.2s ease',
                  p: 0.5,
                  '&:hover': {
                    background: 'linear-gradient(46deg, rgba(255, 228, 77, 0.9) 0%, rgba(212, 160, 23, 0.9) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0px 2px 192.8px 16px #FFD700',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
                aria-label="Reader settings"
              >
                <Settings sx={{ 
                  fontSize: 20,
                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
                }} />
              </IconButton>

              {/* Dropdown Menu */}
              <Menu
                anchorEl={menuAnchorEl}
                open={Boolean(menuAnchorEl)}
                onClose={handleMenuClose}
                slotProps={{
                  paper: {
                    sx: {
                    mt: 1,
                    minWidth: 200,
                    bgcolor: readerTheme === 'dark'
                      ? 'rgba(28, 32, 40, 0.98)'
                      : readerTheme === 'sepia'
                      ? 'rgba(244, 241, 232, 0.98)'
                      : 'rgba(255, 255, 255, 0.98)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid',
                    borderColor: readerTheme === 'dark'
                      ? 'rgba(255, 255, 255, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                    '& .MuiMenuItem-root': {
                      color: readerStyles.color,
                      '&:hover': {
                        bgcolor: readerTheme === 'dark'
                          ? 'rgba(255, 255, 255, 0.08)'
                          : 'rgba(0, 0, 0, 0.04)',
                      },
                    },
                  }
                  },
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <MenuItem onClick={() => handleMenuAction(onSearchToggle)}>
                  <ListItemIcon>
                    <SearchOutlined sx={{ color: readerStyles.color }} />
                  </ListItemIcon>
                  <ListItemText>Search</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction(onBookmark)}>
                  <ListItemIcon>
                    <BookmarkBorderOutlined sx={{ color: readerStyles.color }} />
                  </ListItemIcon>
                  <ListItemText>Bookmark</ListItemText>
                </MenuItem>
                <MenuItem onClick={() => handleMenuAction(onShare)}>
                  <ListItemIcon>
                    <ShareOutlined sx={{ color: readerStyles.color }} />
                  </ListItemIcon>
                  <ListItemText>Share</ListItemText>
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              {/* Desktop view - individual buttons */}
              <IconButton 
                onClick={onSearchToggle}
                sx={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  color: readerStyles.color,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <SearchOutlined sx={{ fontSize: 22 }} />
              </IconButton>
              
              <IconButton 
                onClick={onBookmark}
                sx={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  color: readerStyles.color,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <BookmarkBorderOutlined sx={{ fontSize: 22 }} />
              </IconButton>
              
              <IconButton 
                onClick={onShare}
                sx={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  color: readerStyles.color,
                  '&:hover': {
                    bgcolor: 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                <ShareOutlined sx={{ fontSize: 22 }} />
              </IconButton>

              <IconButton 
                onClick={onSettingsOpen}
                sx={{ 
                  width: 36,
                  height: 36,
                  borderRadius: '8px',
                  background: 'linear-gradient(46deg, rgba(255, 215, 0, 0.8) 0%, rgba(184, 134, 11, 0.8) 100%)',
                  color: '#FFFFFF',
                  boxShadow: '0px 2px 192.8px 16px #FFD700',
                  transition: 'all 0.2s ease',
                  ml: 0.5,
                  '&:hover': {
                    background: 'linear-gradient(46deg, rgba(255, 228, 77, 0.9) 0%, rgba(212, 160, 23, 0.9) 100%)',
                    transform: 'translateY(-1px)',
                    boxShadow: '0px 2px 192.8px 20px #FFD700',
                  },
                  '&:active': {
                    transform: 'translateY(0)',
                  },
                }}
                aria-label="Reader settings"
              >
                <Settings sx={{ 
                  fontSize: 22,
                  filter: 'drop-shadow(0px 2px 4px rgba(0, 0, 0, 0.3))',
                }} />
              </IconButton>
            </>
          )}
        </Box>
      </Toolbar>

      {/* Progress bar */}
      <Box sx={{ 
        height: 3,
        bgcolor: readerTheme === 'dark'
          ? 'rgba(11, 14, 19, 0.5)'
          : 'rgba(0, 0, 0, 0.05)',
        overflow: 'hidden',
      }}>
        {mounted && (
          <Box
            sx={{
              height: '100%',
              width: '100%',
              background: 'linear-gradient(46deg, rgba(255, 215, 0, 0.8) 0%, rgba(184, 134, 11, 0.8) 100%)',
              transform: `translateX(${scrollProgress - 100}%)`,
              willChange: 'transform',
            }}
          />
        )}
      </Box>
    </AppBar>
  );
}