'use client';

import { Box, Typography, Button, Menu, MenuItem, ListItemIcon, ListItemText, Collapse } from '@mui/material';
import { CustomChip } from '@/components/ui';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { MoreHorizIcon } from '@/components/ui/phosphor-icons';
import { OpenInNewIcon } from '@/components/ui/phosphor-icons';
import { AutoAwesomeMotionOutlinedIcon } from '@/components/ui/phosphor-icons';
import { TranslateIcon } from '@/components/ui/phosphor-icons';
import React, { useState, forwardRef, useImperativeHandle } from 'react';
import VerseCard from './VerseCard';
import { replaceReferenceShortcodes } from '@/utils/stringHelpers';
import { useCreateBookmark, useDeleteBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { ContentWithAds } from '@/components/ads/ContentAd';
import ResponsiveAd from '@/components/ads/ResponsiveAd';
import useResponsive from '@/hooks/useResponsive';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import { toast } from 'react-toastify';
import { useCommentaryNavigation } from '@/hooks/useCommentaryNavigation';
import IconActionButton from '@/components/verse/IconActionButton';
import { toGlowColor, toHoverColor, toIconColor } from '@/utils/colorUtils';

const BOOKMARK_ACTION_COLOR = '#FF9800';
const SHARE_ACTION_COLOR = '#4A9EFF';
const ACTION_BASE_COLOR = 'rgba(255, 255, 255, 0.10)';
const ACTION_ICON_COLOR = 'rgba(255, 255, 255, 0.70)';
const SECTION_DIVIDER_GRADIENT = 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(237,240,245,0))';
const SEE_MORE_INSIGHTS_HOVER = 'rgba(255, 193, 7, 0.30)';
const SEE_MORE_INSIGHTS_ICON_COLOR = 'rgba(255, 193, 7, 0.90)';
const SEE_MORE_INSIGHTS_GLOW = 'rgba(255, 193, 7, 0.15)';

interface CommentaryProps {
  commentary: {
    id: string;
    excerpts: Array<{
      id: string;
      content: string;
    }>;
    source?: string;
    tags?: string[];
    verse?: string;
    author: {
      name: string;
      colorScheme: {
        primary: string;
        chipBackground: string;
        chipText: string;
      };
    };
  };
  mode: 'chapter' | 'verse' | 'verse-range';
  verseRange?: string;
  showVerseButton?: boolean;
  bookSlug?: string;
  chapterNumber?: number;
  verseNumber?: number;
  verseContent?: string;
  verseVersion?: string;
  verseReference?: string;
}

export interface CommentaryRef {
  scrollIntoView: () => void;
}

const Commentary = forwardRef<CommentaryRef, CommentaryProps>(({
  commentary,
  mode,
  verseRange,
  showVerseButton = false,
  bookSlug,
  chapterNumber,
  verseNumber,
  verseContent,
  verseVersion = 'KJV',
  verseReference
}, ref) => {
  const [isVerseCardVisible, setIsVerseCardVisible] = useState(false);
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [isOldEnglish, setIsOldEnglish] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState<boolean>(false);
  const { isMdDown } = useResponsive();


  // Extract verse number from verseRange for fetching other commentaries
  const getFirstVerseNumber = () => {
    if (verseNumber) return verseNumber;
    if (verseRange) {
      const match = verseRange.match(/\d+/);
      return match ? parseInt(match[0]) : null;
    }
    return null;
  };

  const firstVerseNumber = getFirstVerseNumber();

  const handleVerseButtonClick = () => {
    setIsVerseCardVisible(!isVerseCardVisible);
  };

  const handleMenuClick = (event: React.MouseEvent<SVGSVGElement | HTMLElement>) => {
    setMenuAnchorEl(event.currentTarget as HTMLElement);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();
  const { deleteBookmark } = useDeleteBookmark();
  const [isBookmarked, setIsBookmarked] = useState(false);

  const otherCommentariesHref = bookSlug && chapterNumber && firstVerseNumber
    ? `/${(verseVersion || 'KJV').toLowerCase()}/${bookSlug}/${chapterNumber}/${firstVerseNumber}`
    : '';

  const {
    isNavigating: isNavigatingOtherCommentaries,
    handleClick: handleOtherCommentariesClick,
  } = useCommentaryNavigation(otherCommentariesHref);

  const handleBookmark = async () => {
    handleMenuClose();

    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    try {
      if (!isBookmarked) {
        await createBookmark({
          id: commentary.id,
          type: BookmarkType.COMMENTARY,
          userId: user.id,
        });
        setIsBookmarked(true);
      }
    } catch {
      toast.error('Bookmark error');
    }
  };

  const handleShare = async () => {
    // Create the same URL as the "Open commentary" link
    const authorSlug = commentary.author.name.toLowerCase().replace(/\s+/g, '-');
    const verseRangeForUrl = verseRange ? verseRange.replace(/^Verses?\s+/, '') : firstVerseNumber;
    const commentaryUrl = `${window.location.origin}/commentators/${authorSlug}/commentaries/${bookSlug}/${chapterNumber}/${verseRangeForUrl}`;
    
    const shareData = {
      title: `${commentary.author.name}'s Commentary`,
      text: `Check out this commentary by ${commentary.author.name} on ${verseRange || `verse ${firstVerseNumber}`}`,
      url: commentaryUrl,
    };

    try {
      // Use Web Share API if available (mobile browsers, some desktop)
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(commentaryUrl);
        // You could add a toast notification here to let user know it was copied
      }
    } catch (error) {
      // If both Web Share API and clipboard fail, fallback to basic copy
      try {
        await navigator.clipboard.writeText(commentaryUrl);
      } catch (clipboardError) {
      }
    }
    
    handleMenuClose();
  };

  const handleOpenCommentary = () => {
    // Create URL for individual commentary page
    const authorSlug = commentary.author.name.toLowerCase().replace(/\s+/g, '-');
    // Extract just the verse numbers from verseRange (e.g., "Verses 1-2" -> "1-2")
    const verseRangeForUrl = verseRange ? verseRange.replace(/^Verses?\s+/, '') : firstVerseNumber;
    const commentaryUrl = `/commentators/${authorSlug}/commentaries/${bookSlug}/${chapterNumber}/${verseRangeForUrl}`;
    window.open(commentaryUrl, '_blank');
    handleMenuClose();
  };

  const handleToggleEnglish = () => {
    setIsOldEnglish(!isOldEnglish);
    handleMenuClose();
  };

  useImperativeHandle(ref, () => ({
    scrollIntoView: () => {
      const element = document.getElementById(`commentary-${commentary.id}`);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    },
  }));

  // Safeguard against undefined data
  if (!commentary || !commentary.excerpts) {
    return null;
  }

  const shouldShowSectionDivider =
    (mode === 'verse' && (commentary.source || commentary.tags?.length)) ||
    (mode === 'verse-range' && commentary.tags?.length);
  const isGlowEnabled = !isMdDown;

  return (
    <>
    <Box
      id={`commentary-${commentary.id}`}
      sx={{
        mb: 4,
        width: '100%',
        scrollMarginTop: '10vh',
      }}
    >
      {/* Commentary Content Box */}
      <Box
        sx={{
          backgroundColor: { xs: 'transparent', sm: 'rgba(255, 255, 255, 0.05)' },
          borderRadius: 3.5,
          p: { xs: 0, sm: 4, md: 4 },
          position: 'relative',
          overflow: { xs: 'visible', sm: 'hidden' },
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Verse Range Header (inside the box for chapter mode) */}
        {mode === 'chapter' && verseRange && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              gap: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Typography
                variant="h4"
                sx={{
                  color: '#FFFAFA',
                  fontSize: { xs: 20, sm: 20, md: 24 },
                  fontWeight: 400,
                  '& span:last-child': {
                    fontWeight: 700,
                  }
                }}
              >
                {verseRange.split(' ').map((part, index) => (
                  <span key={index}>{part} </span>
                ))}
              </Typography>
              {showVerseButton && (
                <Button
                  variant="text"
                  size="medium"
                  onClick={handleVerseButtonClick}
                  sx={{
                    color: 'rgba(255, 250, 250, 0.6)',
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    fontSize: 13,
                    fontWeight: 400,
                    textTransform: 'none',
                    px: 2,
                    py: 0,
                    whiteSpace: 'nowrap',
                    minWidth: 'auto',
                    '&:hover': {
                      color: '#FFFAFA',
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                  }}
                >
                  {isVerseCardVisible ? 'Hide verse' : 'Show verse'}
                </Button>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2.5 }}>
              <MoreHorizIcon
                onClick={handleMenuClick}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 24,
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#FFFAFA',
                  },
                }}
              />
            </Box>
          </Box>
        )}

        {/* Verse Card */}
        {showVerseButton && verseRange && (
          <Collapse in={isVerseCardVisible}>
            <VerseCard
              verseRange={verseRange}
              verseContent={verseContent || commentary.verse || 'Loading verse...'}
              versionName={verseVersion}
              backgroundColor="rgba(255, 255, 255, 0.05)"
              verseReference={verseReference}
            />
          </Collapse>
        )}

        {/* Commentary Header */}
        <Box
          sx={{
            display: mode === 'chapter' ? { xs: 'none', sm: 'flex' } : 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 2,
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25 }}>
            <Typography
              variant="h6"
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 13,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.07em',
              }}
            >
              COMMENTARY
            </Typography>
          </Box>
          {mode !== 'chapter' && (
            <Box sx={{ display: 'flex', gap: 3.5 }}>
              <MoreHorizIcon
                onClick={handleMenuClick}
                sx={{
                  color: 'rgba(255, 255, 255, 0.6)',
                  fontSize: 20,
                  cursor: 'pointer',
                  '&:hover': {
                    color: '#FFFAFA',
                  },
                }}
              />
            </Box>
          )}
        </Box>

        {/* Commentary Text */}
        <Box
          id={`commentary-content-${commentary.id}`}
          sx={{
            lineHeight: '1.6em',
            position: 'relative',
          }}
        >
          {commentary.excerpts.map((excerpt, index) => {
            const htmlWithLinks = replaceReferenceShortcodes(verseVersion, excerpt.content, commentary.author.colorScheme);

            // Use ContentWithAds for verse-range mode (mobile and desktop) or chapter mode (mobile only)
            const shouldUseContentAds = mode === 'verse-range' || (mode === 'chapter' && isMdDown);
            
            return shouldUseContentAds ? (
              <ContentWithAds
                key={excerpt.id}
                htmlContent={htmlWithLinks}
                slotId="COMMENTARY_RESPONSIVE"
                showPlaceholder={false}
                style={{
                  color: '#FFFAFA',
                  fontSize: isMdDown ? '16px' : '18px',
                  fontWeight: 400,
                  lineHeight: 1.6,
                  marginBottom: index < commentary.excerpts.length - 1 ? '24px' : '0',
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                }}
              />
            ) : (
              <Typography
                key={excerpt.id}
                sx={{
                  color: '#FFFAFA',
                  fontSize: { xs: 16, md: 18 },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  mb: index < commentary.excerpts.length - 1 ? 3 : 0,
                  wordBreak: 'break-word',
                  overflowWrap: 'break-word',
                  '& > *:first-child': {
                    marginTop: 0,
                  },
                  '& > *:last-child': {
                    marginBottom: 0,
                  },
                  '& p': {
                    margin: '1em 0',
                  },
                  '& p:first-child': {
                    marginTop: 0,
                  },
                  '& p:last-child': {
                    marginBottom: 0,
                  },
                  '& ul, & ol': {
                    paddingLeft: '20px',
                    margin: '1em 0',
                    listStylePosition: 'outside',
                  },
                  '& ul': {
                    listStyleType: 'disc',
                  },
                  '& ol': {
                    listStyleType: 'decimal',
                  },
                  '& ul ul': {
                    listStyleType: 'circle',
                    paddingLeft: '25px',
                  },
                  '& ol ol': {
                    listStyleType: 'lower-alpha',
                    paddingLeft: '25px',
                  },
                  '& li': {
                    marginBottom: '0.5em',
                  },
                  '& li:last-child': {
                    marginBottom: 0,
                  },
                }}
                dangerouslySetInnerHTML={{
                  __html: htmlWithLinks,
                }}
              />
            );
            })}
          {/* Divider */}
          {shouldShowSectionDivider && (
            <Box
              sx={{
                width: '100%',
                maxWidth: '100%',
                height: 2,
                background: SECTION_DIVIDER_GRADIENT,
                borderRadius: 999,
                opacity: 0.6,
                mt: 3,
                mb: 3,
                display: 'block',
              }}
            />
          )}

          {/* Source */}
          {mode === 'verse' && commentary.source && (
            <Typography
              sx={{
                color: 'rgba(255, 255, 255, 0.6)',
                fontSize: 16,
                fontWeight: 400,
                fontStyle: 'italic',
                mb: commentary.tags?.length ? 2 : 0,
              }}
            >
              Source: {commentary.source}
            </Typography>
          )}


          {/* Tags */}
          {commentary.tags && commentary.tags.length > 0 && (
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: 1,
              }}
            >
              {commentary.tags.map((tag) => (
                <CustomChip
                  key={tag}
                  label={tag}
                  bgColor={commentary.author.colorScheme.chipBackground}
                  textColor={commentary.author.colorScheme.chipText}
                  fontSize={14}
                  fontWeight={500}
                  borderRadius={2}
                  padding="6px 12px"
                />
              ))}
            </Box>
          )}
        </Box>

        {/* Action bar + static CTA */}
        {mode === 'chapter' && (
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              alignItems: 'center',
              gap: 1,
              mt: 2,
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconActionButton
                label={isBookmarked ? 'Bookmarked commentary' : 'Bookmark commentary'}
                tooltip={isBookmarked ? 'Bookmarked commentary' : 'Bookmark commentary'}
                tooltipPlacement="bottom"
                icon={isBookmarked ? <BookmarkIcon sx={{ fontSize: 20 }} /> : <BookmarkBorderIcon sx={{ fontSize: 20 }} />}
                hoverColor={toHoverColor(BOOKMARK_ACTION_COLOR, 0.3)}
                onClick={handleBookmark}
                active={isBookmarked}
                baseColor={ACTION_BASE_COLOR}
                iconColor={isBookmarked ? toIconColor(BOOKMARK_ACTION_COLOR, 1) : ACTION_ICON_COLOR}
                hoverIconColor={toIconColor(BOOKMARK_ACTION_COLOR, 1)}
                glowColor={isGlowEnabled ? toGlowColor(BOOKMARK_ACTION_COLOR, 0.12) : undefined}
              />
              <IconActionButton
                label="Share commentary"
                tooltip="Share commentary"
                tooltipPlacement="bottom"
                icon={<IosShareIcon sx={{ fontSize: 20 }} />}
                hoverColor={toHoverColor(SHARE_ACTION_COLOR, 0.3)}
                onClick={handleShare}
                baseColor={ACTION_BASE_COLOR}
                iconColor={ACTION_ICON_COLOR}
                hoverIconColor={toIconColor(SHARE_ACTION_COLOR, 1)}
                glowColor={isGlowEnabled ? toGlowColor(SHARE_ACTION_COLOR, 0.12) : undefined}
              />
            </Box>

            {otherCommentariesHref && (
              <IconActionButton
                label="See more commentary insights on this passage"
                icon={
                  <AutoAwesomeMotionOutlinedIcon
                    sx={{
                      fontSize: 22,
                      color: 'inherit',
                    }}
                  />
                }
                hoverColor={SEE_MORE_INSIGHTS_HOVER}
                onClick={handleOtherCommentariesClick}
                loading={isNavigatingOtherCommentaries}
                disabled={isNavigatingOtherCommentaries}
                baseColor={ACTION_BASE_COLOR}
                iconColor={ACTION_ICON_COLOR}
                hoverIconColor={SEE_MORE_INSIGHTS_ICON_COLOR}
                text={isNavigatingOtherCommentaries ? 'Loading...' : 'See More Insights'}
                textColor="rgba(255, 255, 255, 0.90)"
                glowColor={isGlowEnabled ? SEE_MORE_INSIGHTS_GLOW : undefined}
              />
            )}
          </Box>
        )}

        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          slotProps={{
            paper: {
              sx: {
                backgroundColor: '#121212',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                borderRadius: 2.5,
                minWidth: 200,
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                '& .MuiMenuItem-root': {
                  borderRadius: 1,
                  mx: 0.5,
                  my: 0.25,
                  transition: 'background-color 0.15s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  },
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleOpenCommentary}>
            <ListItemIcon>
              <OpenInNewIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary="Open commentary"
              sx={{
                '& .MuiTypography-root': {
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                },
              }}
            />
          </MenuItem>
          <MenuItem onClick={handleToggleEnglish}>
            <ListItemIcon>
              <TranslateIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
            </ListItemIcon>
            <ListItemText
              primary={isOldEnglish ? 'Read Modern English' : 'Read Old English'}
              sx={{
                '& .MuiTypography-root': {
                  color: 'text.primary',
                  fontSize: '0.875rem',
                  fontWeight: 400,
                },
              }}
            />
          </MenuItem>
          {mode !== 'chapter' && (
            <>
              <MenuItem onClick={handleBookmark}>
                <ListItemIcon>
                  {isBookmarked ? (
                    <BookmarkIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  ) : (
                    <BookmarkBorderIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                  )}
                </ListItemIcon>
                <ListItemText
                  primary={isBookmarked ? 'Bookmarked commentary' : 'Bookmark commentary'}
                  sx={{
                    '& .MuiTypography-root': {
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                    },
                  }}
                />
              </MenuItem>
              <MenuItem onClick={handleShare}>
                <ListItemIcon>
                  <IosShareIcon sx={{ color: 'text.secondary', fontSize: 18 }} />
                </ListItemIcon>
                <ListItemText
                  primary="Share commentary"
                  sx={{
                    '& .MuiTypography-root': {
                      color: 'text.primary',
                      fontSize: '0.875rem',
                      fontWeight: 400,
                    },
                  }}
                />
              </MenuItem>
            </>
          )}
        </Menu>
      </Box>

    </Box>

    <BookmarkPromoModal
      open={bookmarkPromoOpen}
      onClose={() => setBookmarkPromoOpen(false)}
      onUpgrade={() => {
        setBookmarkPromoOpen(false);
      }}
    />
    </>
  );
});

Commentary.displayName = 'Commentary';

export default Commentary;
