'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Box,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { WbSunnyOutlinedIcon } from '@/components/ui/phosphor-icons';
import { FormatQuoteIcon } from '@/components/ui/phosphor-icons';
import { toast } from 'react-toastify';
import { Tooltip, CustomChip } from '@/components/ui';
import { useCreateBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import VerticalAd from '@/components/ads/VerticalAd';
import ResponsiveAd from '@/components/ads/ResponsiveAd';
import { refreshModalAds } from '@/utils/adUtils';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import { replaceReferenceShortcodes } from '@/utils/stringHelpers';
import { resolveBookmarkId } from '@/utils/bookmarkUtils';
import { useAdaptiveFontScale } from '@/hooks/useAdaptiveFontScale';

interface VerseTakeawaysModalProps {
  open: boolean;
  onClose: () => void;
  reference: string;
  verseTakeaways: any;
}

const FONT_FAMILY = 'Inter, sans-serif';
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.80)';
const HEADER_GRADIENT = 'linear-gradient(90deg, rgba(168, 50, 214, 0.55) 0%, rgba(168, 50, 214, 0.00) 68%), linear-gradient(90deg, rgba(52, 68, 145, 0.06) 59%, rgba(168, 50, 214, 0.60) 100%), linear-gradient(1deg, rgba(168, 50, 214, 0.30) 0%, rgba(52, 68, 145, 0.03) 100%), linear-gradient(90deg, rgba(168, 50, 214, 0.10) 0%, #344491 100%), #121212';
const HEADER_CHIP_BACKGROUND = 'rgba(168, 50, 214, 0.51)';
const HEADER_CHIP_TEXT = '#F7E1FF';
const TAKEAWAY_CARD_BACKGROUND = 'linear-gradient(133deg, rgba(22, 72, 128, 0.01) 0%, rgba(168, 50, 214, 0.05) 100%), rgba(255, 255, 255, 0.10)';
const TAKEAWAY_CARD_SHADOW = '0px 30px 68px rgba(0, 0, 0, 0.35)';
const SIDEBAR_BACKGROUND = 'rgba(18, 18, 18, 0.92)';
const SIDEBAR_OUTLINE = '2px rgba(255, 255, 255, 0.10) solid';
const SIDEBAR_ICON_SIZE = 44;
const ICON_BOX_SIZE = 36;
const ICON_BOX_BACKGROUND = 'rgba(255, 255, 255, 0.10)';
const ICON_BOX_TEXT = 'rgba(255, 255, 255, 0.8)';
const TAKEAWAY_BADGE_BACKGROUND = 'linear-gradient(45deg, #9637CB 0%, #394394 100%)';
const TAKEAWAY_BADGE_GLOW = [
  'radial-gradient(100% 100% at 50% 45%, rgba(150, 55, 203, 0.88) 0%, rgba(150, 55, 203, 0.58) 40%, rgba(150, 55, 203, 0.28) 72%, rgba(150, 55, 203, 0.08) 92%, rgba(150, 55, 203, 0) 100%)',
  'radial-gradient(135% 135% at 72% 32%, rgba(57, 67, 148, 0.7) 0%, rgba(57, 67, 148, 0.46) 42%, rgba(57, 67, 148, 0.22) 74%, rgba(57, 67, 148, 0.06) 94%, rgba(57, 67, 148, 0) 100%)',
].join(', ');
const SHARE_HOVER_COLOR = '#4A9EFF';
const BOOKMARK_HOVER_COLOR = '#FF8C3A';
const CLOSE_HOVER_COLOR = '#FF4D57';
const ACTION_BUTTON_BASE_COLOR = '#151515';
const ACTION_BUTTON_ICON_COLOR = 'rgba(255, 255, 255, 0.85)';
const TAKEAWAY_BADGE_SIZE = 22;
const TAKEAWAY_BADGE_FONT_SIZE = 11;
const TAKEAWAY_BODY_FONT_SIZE_DESKTOP = 20;
const TAKEAWAY_BODY_LINE_HEIGHT_DESKTOP = 30;
const TAKEAWAY_BODY_FONT_SIZE_MOBILE = 18;
const TAKEAWAY_BODY_LINE_HEIGHT_MOBILE = 27;
const MODAL_MOBILE_PADDING = '20px';

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const mobileModalVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: { opacity: 1, y: 0 },
};

const desktopModalVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;

interface ModalActionButtonProps extends Omit<PrimitiveButtonProps, 'children'> {
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
  tooltip?: string;
  active?: boolean;
  baseColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  text?: string;
  borderColor?: string;
}

const ModalActionButton = React.forwardRef<HTMLButtonElement, ModalActionButtonProps>(
  (
    {
      label,
      icon,
      hoverColor,
      tooltip,
      active = false,
      disabled = false,
      baseColor,
      iconColor,
      hoverIconColor,
      text,
      borderColor,
      onClick,
      onMouseDown,
      ...primitiveProps
    },
    ref,
  ) => {
    const resolvedBaseColor = baseColor ?? ICON_BOX_BACKGROUND;
    const resolvedHoverIcon = hoverIconColor ?? 'rgba(255, 255, 255, 0.95)';
    const resolvedIconColor = active ? resolvedHoverIcon : iconColor ?? ICON_BOX_TEXT;

    const button = (
      <Box
        component={Primitive.button}
        ref={ref as any}
        type="button"
        aria-label={label}
        aria-pressed={active ? 'true' : 'false'}
        aria-disabled={disabled ? 'true' : undefined}
        data-state={active ? 'active' : 'inactive'}
        disabled={disabled}
        tabIndex={-1}
        onClick={event => {
          if (disabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClick?.(event);
        }}
        onMouseDown={event => {
          event.preventDefault();
          onMouseDown?.(event);
        }}
        {...primitiveProps}
        sx={{
          width: text ? 'auto' : ICON_BOX_SIZE,
          height: ICON_BOX_SIZE,
          borderRadius: { xs: '12px', md: '10px' },
          backgroundColor: active ? hoverColor : resolvedBaseColor,
          color: resolvedIconColor,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: text ? '6px' : 0,
          pl: text ? '8px' : 0,
          pr: text ? '10px' : 0,
          transition: 'transform 0.18s ease, background-color 0.24s ease, color 0.24s ease, border-color 0.24s ease',
          border: borderColor ? `1px solid ${borderColor}` : 'none',
          outline: 'none',
          textDecoration: 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          boxShadow: 'none',
          pointerEvents: disabled ? 'none' : 'auto',
          font: 'inherit',
          '& > svg': {
            fontSize: text ? 20 : 22,
          },
          '&:disabled': {
            opacity: 0.45,
            cursor: 'not-allowed',
          },
          '@media (hover: hover)': {
            '&:hover': {
              backgroundColor: hoverColor,
              color: resolvedHoverIcon,
            },
          },
          '&:focus-visible': {
            outline: '2px solid rgba(255, 255, 255, 0.55)',
            outlineOffset: { xs: '3px', md: '4px' },
          },
          '&:active': {
            transform: disabled ? 'none' : `scale(${text ? 0.96 : 0.92})`,
          },
          '&[data-state="active"]': {
            backgroundColor: hoverColor,
            color: resolvedHoverIcon,
          },
        }}
      >
        {icon}
        {text && (
          <Typography sx={{ fontSize: 15, fontWeight: 400, whiteSpace: 'nowrap' }}>
            {text}
          </Typography>
        )}
      </Box>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow enterDelay={300} placement="top">
          <span style={{ display: 'inline-flex' }}>{button}</span>
        </Tooltip>
      );
    }

    return button;
  },
);

ModalActionButton.displayName = 'ModalActionButton';

const getMobileReference = (reference: string, isMobile: boolean): string => {
  if (!isMobile) {
    return reference;
  }

  return reference
    .replace('Song Of Solomon', 'Songs')
    .replace('Deuteronomy', 'Deut.')
    .replace('1 Chronicles', '1 Chr.')
    .replace('2 Chronicles', '2 Chr.')
    .replace('1 Corinthians', '1 Cor.')
    .replace('2 Corinthians', '2 Cor.')
    .replace('Ephesians', 'Eph.')
    .replace('Philippians', 'Phil.')
    .replace('Colossians', 'Col.')
    .replace('1 Thessalonians', '1 Thess.')
    .replace('2 Thessalonians', '2 Thess.')
    .replace('1 Timothy', '1 Tim.')
    .replace('2 Timothy', '2 Tim.')
    .replace('Philemon', 'Phlm.')
    .replace('Revelation', 'Rev.');
};

const SidebarPanel: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <Box
    sx={{
      position: 'relative',
      backgroundColor: SIDEBAR_BACKGROUND,
      borderRadius: '30px',
      outline: SIDEBAR_OUTLINE,
      outlineOffset: '-1px',
      overflow: 'hidden',
      boxShadow: '0px 28px 44px rgba(0, 0, 0, 0.28)',
    }}
  >
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: { xs: 24, md: 32 },
        width: SIDEBAR_ICON_SIZE,
        height: SIDEBAR_ICON_SIZE,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: TAKEAWAY_BADGE_BACKGROUND,
        borderRadius: '0 0 14px 14px',
        color: 'rgba(255,255,255,0.92)',
        isolation: 'isolate',
        overflow: 'visible',
        zIndex: 1,
        boxShadow: 'none',
        '&::after': {
          content: '""',
          position: 'absolute',
          left: '50%',
          top: '68%',
          width: '320%',
          height: '320%',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          background: TAKEAWAY_BADGE_GLOW,
          pointerEvents: 'none',
          zIndex: -1,
          opacity: 0.82,
          filter: 'blur(48px)',
          mixBlendMode: 'normal',
        },
      }}
    >
      <Box
        component="span"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          height: '100%',
        }}
      >
        {icon}
      </Box>
    </Box>
    <Box
      sx={{
        position: 'relative',
        zIndex: 2,
        px: { xs: 3, md: 3.75 },
        pt: { xs: 6.75, md: 7.25 },
        pb: { xs: 4, md: 4.5 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 2.5, md: 3 },
      }}
    >
      {children}
    </Box>
  </Box>
);

export default function VerseTakeawaysModal({
  open,
  onClose,
  reference,
  verseTakeaways,
}: VerseTakeawaysModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState<boolean>(false);
  const { fontScale } = useAdaptiveFontScale();

  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();
  const verseTakeawaysBookmarkId = useMemo(
    () =>
      resolveBookmarkId(
        verseTakeaways?.id,
        verseTakeaways?.takeawayId,
        verseTakeaways?.verseTakeawayId,
        verseTakeaways?.referenceId,
        verseTakeaways?.bibleVerseId,
        verseTakeaways?.verseId,
      ),
    [verseTakeaways],
  );
  const modalTitle = reference ? `Verse takeaways for ${reference}` : 'Verse takeaways';
  const modalDescription = reference
    ? `Read curated insights and reflections drawn from ${reference} to deepen your study.`
    : 'Read curated verse takeaways to deepen your study.';

  const commentatorsList = useMemo(() => {
    if (!verseTakeaways?.commentaryAuthors) {
      return [] as string[];
    }
    return verseTakeaways.commentaryAuthors.split(',').map((name: string) => name.trim()).filter(Boolean);
  }, [verseTakeaways]);

  const baseTakeawayFontSize = isMobile ? TAKEAWAY_BODY_FONT_SIZE_MOBILE : TAKEAWAY_BODY_FONT_SIZE_DESKTOP;
  const baseTakeawayLineHeight = isMobile ? TAKEAWAY_BODY_LINE_HEIGHT_MOBILE : TAKEAWAY_BODY_LINE_HEIGHT_DESKTOP;
  const scaledTakeawayFontSize = baseTakeawayFontSize * fontScale;
  const scaledTakeawayLineHeight = baseTakeawayLineHeight * fontScale;
  const modalStyle: React.CSSProperties = isMobile
    ? {
        position: 'fixed',
        inset: 0,
        zIndex: 1501,
        outline: 'none',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
      }
    : {
        position: 'fixed',
        inset: 0,
        zIndex: 1501,
        outline: 'none',
      };

  const generateShareUrl = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin + window.location.pathname;
      const anchor = '#verse-takeaways';
      return baseUrl + anchor;
    }
    return '';
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    const shareUrl = generateShareUrl();

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${reference} - Key Takeaways`,
          text: `Explore key takeaways for ${reference} from multiple commentaries`,
          url: shareUrl,
        });
      } catch (err) {
        if (err instanceof Error && err.name !== 'AbortError') {
          handleCopyLink(shareUrl);
        }
      }
    } else {
      handleCopyLink(shareUrl);
    }
  };

  const handleBookmark = async () => {
    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    if (!verseTakeawaysBookmarkId) {
      toast.error('Verse takeaway ID is required for bookmarking');
      return;
    }

    try {
      if (!isBookmarked) {
        await createBookmark({
          id: verseTakeawaysBookmarkId,
          type: BookmarkType.TAKEAWAY,
          userId: user.id,
        });
        setIsBookmarked(true);
      }
    } catch {
      toast.error('Bookmark error');
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined' && open) {
      const anchor = '#verse-takeaways';
      window.history.replaceState(null, '', window.location.pathname + anchor);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      refreshModalAds();
    }
  }, [open]);

  const renderTakeawayCards = () => {
    if (!verseTakeaways?.excerpts?.length) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 200,
            borderRadius: '24px',
            border: '1px dashed rgba(255, 255, 255, 0.1)',
            bgcolor: 'rgba(255, 255, 255, 0.02)',
          }}
        >
          <Typography sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 18, textAlign: 'center' }}>
            No takeaways available for this verse
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3.5, md: 3 }, mt: { xs: 1, md: 0 } }}>
        {verseTakeaways.excerpts.map((excerpt: any, index: number) => (
          <React.Fragment key={excerpt.id ?? index}>
              <Box
                sx={{
                  position: 'relative',
                  p: { xs: 3, md: 4 },
                  background: TAKEAWAY_CARD_BACKGROUND,
                  borderRadius: '25px',
                  boxShadow: TAKEAWAY_CARD_SHADOW,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: { xs: 1.75, md: 2.25 },
                  overflow: 'hidden',
                  isolation: 'isolate',
                }}
              >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: TAKEAWAY_BADGE_SIZE,
                    height: TAKEAWAY_BADGE_SIZE,
                    background: TAKEAWAY_BADGE_BACKGROUND,
                    borderRadius: '5px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    zIndex: 0,
                    isolation: 'isolate',
                    overflow: 'visible',
                    boxShadow: 'none',
                    '&::after': {
                      content: '""',
                      position: 'absolute',
                      left: '50%',
                      top: '50%',
                      width: '420%',
                      height: '420%',
                      transform: 'translate(-50%, -50%)',
                      borderRadius: '50%',
                      background: TAKEAWAY_BADGE_GLOW,
                      pointerEvents: 'none',
                      zIndex: -1,
                      opacity: 0.96,
                      filter: 'blur(46px)',
                      mixBlendMode: 'normal',
                    },
                  }}
                >
                  <Typography
                    sx={{
                      color: 'white',
                      fontSize: TAKEAWAY_BADGE_FONT_SIZE,
                      fontWeight: 800,
                      lineHeight: 1,
                      position: 'relative',
                      zIndex: 1,
                    }}
                  >
                    {index + 1}
                  </Typography>
                </Box>
                <Typography
                  sx={{
                    color: TEXT_COLOR_PRIMARY,
                    fontSize: { xs: 17, md: 18 },
                    fontWeight: 700,
                    lineHeight: { xs: '26px', md: '28px' },
                    position: 'relative',
                    zIndex: 1,
                  }}
                >
                  {excerpt.title.replace(':', '')}
                </Typography>
              </Box>
      <Typography
        sx={{
          color: TEXT_COLOR_PRIMARY,
          fontSize: scaledTakeawayFontSize,
          lineHeight: `${scaledTakeawayLineHeight}px`,
          fontWeight: 400,
          position: 'relative',
          zIndex: 1,
          '& *, & *::before, & *::after': {
            fontSize: `${scaledTakeawayFontSize}px`,
            lineHeight: `${scaledTakeawayLineHeight}px`,
          },
          '& p': {
            margin: '0 0 1.1em',
          },
          '& p:last-child': {
            marginBottom: 0,
          },
        }}
        component="div"
        dangerouslySetInnerHTML={{
          __html: replaceReferenceShortcodes('ASV', excerpt.content, { chipText: '#ED27FF' }),
        }}
      />
            </Box>

            {index === 0 && verseTakeaways.excerpts.length > 1 && isMobile && !isPremium && (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 2 }}>
                <ResponsiveAd slotId="CONTENT_RESPONSIVE" showPlaceholder={false} />
              </Box>
            )}
          </React.Fragment>
        ))}
      </Box>
    );
  };

  const renderSidebar = () => {
    const quote = verseTakeaways?.quotes?.[0];
    const quoteAuthor = quote?.author?.name || quote?.attribution;
    const quoteSource = quote?.author?.workTitle || quote?.workTitle || quote?.sourceTitle || quote?.source;

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 3.5 } }}>
        {commentatorsList.length > 0 && (
          <SidebarPanel icon={<WbSunnyOutlinedIcon sx={{ fontSize: 22 }} />}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography sx={{ fontSize: 16, fontWeight: 700, color: TEXT_COLOR_PRIMARY }}>
                {commentatorsList.length} Commentaries{' '}
                <Box component="span" sx={{ fontWeight: 400, color: 'rgba(255, 249, 249, 0.8)' }}>
                  sourced to create these three takeaways
                </Box>
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, alignItems: 'flex-start' }}>
                {commentatorsList.slice(0, 9).map((name, index) => {
                  const authorAnchor = `#${name.replace(/\s+/g, '-').toLowerCase()}`;

                  const handleAuthorClick = (event: React.MouseEvent<HTMLButtonElement>) => {
                    event.preventDefault();
                    onClose();
                    setTimeout(() => {
                      window.location.hash = authorAnchor.slice(1);
                    }, 100);
                  };

                  return (
                    <Box
                      key={`${name}-${index}`}
                      component={Primitive.button}
                      type="button"
                      onClick={handleAuthorClick}
                      sx={{
                        px: 1.5,
                        py: 0.75,
                        borderRadius: '10px',
                        background: 'rgba(102, 102, 102, 0.3)',
                        color: 'rgba(255, 255, 255, 0.8)',
                        fontSize: 12,
                        fontWeight: 500,
                        textDecoration: 'none',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer',
                        border: 'none',
                        outline: 'none',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 0.5,
                        mr: 0.25,
                        mb: 0.25,
                        backgroundImage: 'none',
                        '&:hover': {
                          background: 'rgba(102, 102, 102, 0.45)',
                          color: 'rgba(255,255,255,1)',
                          transform: 'translateY(-1px)',
                        },
                        '@media (hover: none)': {
                          '&:active': {
                            transform: 'translateY(0)',
                          },
                        },
                        '&:focus-visible': {
                          outline: '2px solid rgba(255, 255, 255, 0.6)',
                          outlineOffset: 2,
                        },
                      }}
                    >
                      {name}
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </SidebarPanel>
        )}

        {quote && (
          <SidebarPanel icon={<FormatQuoteIcon sx={{ fontSize: 23 }} />}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.25 }}>
              <Typography sx={{ fontSize: 17, fontStyle: 'italic', color: TEXT_COLOR_PRIMARY, lineHeight: '26px' }}>
                {quote.content}
              </Typography>
              {(quoteAuthor || quoteSource) && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.7 }}>
                  {quoteAuthor && (
                    <Typography sx={{ fontSize: 15, fontWeight: 700, color: TEXT_COLOR_PRIMARY }}>
                      {quoteAuthor}
                    </Typography>
                  )}
                  {quoteSource && (
                    <Typography sx={{ fontSize: 13, color: 'rgba(255, 249, 249, 0.8)' }}>
                      {quoteSource}
                    </Typography>
                  )}
                </Box>
              )}
            </Box>
          </SidebarPanel>
        )}
      </Box>
    );
  };

  const renderModalContent = () => (
    <Box
      sx={{
        width: '100%',
        maxWidth: 1008,
        height: isMobile ? '100%' : '90vh',
        maxHeight: isMobile ? '95vh' : '90vh',
        display: 'flex',
        flexDirection: 'column',
        borderRadius: isMobile ? '20px 20px 0 0' : '35px',
        overflow: 'hidden',
        color: TEXT_COLOR_PRIMARY,
        fontFamily: FONT_FAMILY,
        backgroundColor: 'transparent',
        minHeight: 0,
      }}
    >
      <Box
        sx={{
          background: HEADER_GRADIENT,
          px: { xs: MODAL_MOBILE_PADDING, md: 5 },
          pt: { xs: '18px', md: 3.75 },
          pb: { xs: '42px', md: 7.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: { xs: 2, md: 3 },
          flexWrap: { xs: 'wrap', md: 'nowrap' },
          rowGap: { xs: '12px', md: 0 },
          borderTopLeftRadius: { xs: 20, md: 35 },
          borderTopRightRadius: { xs: 20, md: 35 },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            alignItems: { xs: 'flex-start', md: 'center' },
            gap: { xs: 0.75, md: 2 },
            minWidth: 0,
            flex: { xs: '1 1 auto', md: 'unset' },
          }}
        >
          <Typography
            sx={{
              fontSize: { xs: 17, md: 22 },
              fontWeight: 700,
              color: TEXT_COLOR_PRIMARY,
              whiteSpace: { xs: 'initial', md: 'nowrap' },
            }}
          >
            Verse Takeaways
          </Typography>
          <CustomChip
            label={getMobileReference(reference, isMobile)}
            bgColor={HEADER_CHIP_BACKGROUND}
            textColor={HEADER_CHIP_TEXT}
            fontSize={isMobile ? 13 : 14}
            fontWeight={500}
            borderRadius={10}
            padding="2px 8px"
            sx={{ lineHeight: 1, mt: { xs: 0.1, md: 0 } }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: { xs: '10px', md: 1.5 },
            flexShrink: 0,
          }}
        >
          <ModalActionButton
            label="Share takeaways"
            icon={<IosShareIcon sx={{ fontSize: 22 }} />}
            hoverColor={SHARE_HOVER_COLOR}
            onClick={handleShare}
            baseColor={ACTION_BUTTON_BASE_COLOR}
            iconColor={ACTION_BUTTON_ICON_COLOR}
          />
          <ModalActionButton
            label={isBookmarked ? 'Takeaways bookmarked' : 'Bookmark takeaways'}
            icon={isBookmarked ? <BookmarkIcon sx={{ fontSize: 22 }} /> : <BookmarkBorderIcon sx={{ fontSize: 22 }} />}
            hoverColor={BOOKMARK_HOVER_COLOR}
            onClick={handleBookmark}
            active={isBookmarked}
            baseColor={ACTION_BUTTON_BASE_COLOR}
            iconColor={ACTION_BUTTON_ICON_COLOR}
          />
          <ModalActionButton
            label="Close"
            icon={<CloseIcon sx={{ fontSize: 22 }} />}
            hoverColor={CLOSE_HOVER_COLOR}
            onClick={onClose}
            baseColor={ACTION_BUTTON_BASE_COLOR}
            borderColor={isMobile ? 'rgba(255, 255, 255, 0.22)' : undefined}
            iconColor={ACTION_BUTTON_ICON_COLOR}
          />
        </Box>
      </Box>

      {isMobile ? (
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            backgroundColor: '#000',
            px: MODAL_MOBILE_PADDING,
            pt: '14px',
            pb: `calc(28px + env(safe-area-inset-bottom, 0px))`,
            mt: '-24px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0px -18px 46px rgba(0, 0, 0, 0.45)',
            zIndex: 1,
            minHeight: 0,
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          {renderTakeawayCards()}
          <Box sx={{ mt: 2.5 }}>
            {renderSidebar()}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 0,
            backgroundColor: '#000',
            px: 5,
            pt: 5,
            pb: 5,
            mt: '-32px',
            borderTopLeftRadius: '35px',
            borderTopRightRadius: '35px',
            boxShadow: '0px -18px 46px rgba(0, 0, 0, 0.45)',
            zIndex: 1,
            minHeight: 0,
          }}
        >
          <Box
            sx={{
              flex: '1 1 auto',
              minWidth: 0,
              minHeight: 0,
              overflowY: 'auto',
              pr: 2,
              display: 'flex',
              flexDirection: 'column',
              gap: 3.5,
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: 4,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.4)' },
              scrollbarColor: 'rgba(255, 255, 255, 0.25) transparent',
            }}
          >
            {renderTakeawayCards()}
          </Box>
          <Box
            sx={{
              width: '1px',
              alignSelf: 'stretch',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)',
              opacity: 0.5,
            }}
          />
          <Box
            sx={{
              flex: '0 0 320px',
              minHeight: 0,
              overflow: 'auto',
              pl: 2,
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.25)',
                borderRadius: 4,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::-webkit-scrollbar-thumb': { background: 'rgba(255, 255, 255, 0.4)' },
              scrollbarColor: 'rgba(255, 255, 255, 0.25) transparent',
            }}
          >
            {renderSidebar()}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={state => {
          if (!state) {
            onClose();
          }
        }}
      >
        <AnimatePresence>
          {open && (
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div
                  variants={overlayVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    backdropFilter: 'blur(2px)',
                    zIndex: 1500,
                  }}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                onOpenAutoFocus={event => event.preventDefault()}
                onCloseAutoFocus={event => event.preventDefault()}
              >
                <motion.div
                  variants={isMobile ? mobileModalVariants : desktopModalVariants}
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={modalStyle}
                >
                  <Dialog.Title asChild>
                    <VisuallyHidden>{modalTitle}</VisuallyHidden>
                  </Dialog.Title>
                  <Dialog.Description asChild>
                    <VisuallyHidden>{modalDescription}</VisuallyHidden>
                  </Dialog.Description>
                  {isMobile ? (
                    renderModalContent()
                  ) : (
                    <Box
                      onClick={() => onClose()}
                      sx={{
                        height: '100vh',
                        width: '100vw',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: { xs: 1.5, md: 4 },
                      }}
                    >
                      <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
                        <VerticalAd slotId="MODAL_VERTICAL_LEFT" placement="modal" showPlaceholder={false} />
                      </Box>
                      <Box
                        onClick={event => event.stopPropagation()}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        {renderModalContent()}
                      </Box>
                      <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
                        <VerticalAd slotId="MODAL_VERTICAL_RIGHT" placement="modal" showPlaceholder={false} />
                      </Box>
                    </Box>
                  )}
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <BookmarkPromoModal
        open={bookmarkPromoOpen}
        onClose={() => setBookmarkPromoOpen(false)}
        onUpgrade={() => {
          setBookmarkPromoOpen(false);
        }}
      />
    </>
  );
}
