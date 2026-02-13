'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Typography, useTheme, useMediaQuery } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import {
  Accordion as MuiAccordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { PersonIcon } from '@/components/ui/phosphor-icons';
import { PeopleIcon } from '@/components/ui/phosphor-icons';
import { EditIcon } from '@/components/ui/phosphor-icons';
import { KeyboardArrowDownIcon } from '@/components/ui/phosphor-icons';
import { LightbulbOutlinedIcon } from '@/components/ui/phosphor-icons';
import { MenuBookOutlinedIcon } from '@/components/ui/phosphor-icons';
import { ArchitectureOutlinedIcon } from '@/components/ui/phosphor-icons';
import { AutoAwesomeOutlinedIcon } from '@/components/ui/phosphor-icons';
import { SchoolOutlinedIcon } from '@/components/ui/phosphor-icons';
import { PublicOutlinedIcon } from '@/components/ui/phosphor-icons';
import { AccountBalanceOutlinedIcon } from '@/components/ui/phosphor-icons';
import { FlagOutlinedIcon } from '@/components/ui/phosphor-icons';
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

interface BookOverviewModalProps {
  open: boolean;
  onClose: () => void;
  bookName: string;
  bookOverview: any;
  verseTakeaways: any;
  verseVersion: string;
}

type TabKey = 'background' | 'content' | 'themes' | 'context';

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

interface OverviewSectionConfig {
  key: string;
  title: string;
  icon: React.ReactNode;
  html: string;
}

const FONT_FAMILY = 'Inter, sans-serif';
const TEXT_COLOR_PRIMARY = '#F2FFFD';
const TEXT_COLOR_SECONDARY = 'rgba(225, 246, 242, 0.72)';
const HEADER_GRADIENT = [
  'linear-gradient(90deg, rgba(33, 161, 241, 0.48) 0%, rgba(18, 135, 90, 0) 68%)',
  'linear-gradient(90deg, rgba(12, 95, 156, 0.16) 40%, rgba(13, 179, 100, 0.62) 100%)',
  'linear-gradient(0deg, rgba(4, 30, 41, 0.94) 0%, rgba(3, 18, 26, 0.98) 100%)',
  '#021018',
].join(', ');
const HEADER_CHIP_BACKGROUND = 'rgba(27, 156, 238, 0.28)';
const HEADER_CHIP_TEXT = '#D9FAFF';
const NOISE_TEXTURE = `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2.5' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.03'/%3E%3C/svg%3E`;
const OVERVIEW_CARD_GRADIENT = 'linear-gradient(133deg, rgba(30, 143, 189, 0.05) 0%, rgba(11, 146, 59, 0.05) 100%)';
const OVERVIEW_CARD_BASE_COLOR = 'rgba(255, 255, 255, 0.05)';
const OVERVIEW_CARD_SHADOW = '0px 30px 68px rgba(0, 0, 0, 0.32)';
const SIDEBAR_BACKGROUND = 'rgba(5, 26, 34, 0.95)';
const SIDEBAR_OUTLINE = '2px rgba(94, 210, 181, 0.18) solid';
const SIDEBAR_ICON_SIZE = 44;
const ICON_BOX_SIZE = 36;
const ICON_BADGE_BACKGROUND = 'linear-gradient(45deg, #1CD280 0%, #2C9BFF 100%)';
const SHARE_HOVER_COLOR = '#4A9EFF';
const BOOKMARK_HOVER_COLOR = '#FF8C3A';
const CLOSE_HOVER_COLOR = '#FF4D57';
const ACTION_BUTTON_BASE_COLOR = '#151515';
const ACTION_BUTTON_ICON_COLOR = 'rgba(255, 255, 255, 0.85)';
const MODAL_MOBILE_PADDING = '20px';
const OVERVIEW_BODY_FONT_SIZE_DESKTOP = 20;
const OVERVIEW_BODY_LINE_HEIGHT_DESKTOP = 30;
const OVERVIEW_BODY_FONT_SIZE_MOBILE = 18;
const OVERVIEW_BODY_LINE_HEIGHT_MOBILE = 27;

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const mobileModalVariants = {
  hidden: { opacity: 0, y: '100%' },
  visible: {
    opacity: 1,
    y: 0,
    transitionEnd: { transform: 'none' },
  },
};

const desktopModalVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transitionEnd: { transform: 'none' },
  },
};

const htmlTypographySx = {
  '& > *:first-child': { marginTop: 0 },
  '& > *:last-child': { marginBottom: 0 },
  '& p': { margin: '0 0 1em 0' },
  '& p:last-child': { marginBottom: 0 },
  '& ul, & ol': {
    paddingLeft: '20px',
    margin: '1em 0',
    listStylePosition: 'outside',
  },
  '& ul': { listStyleType: 'disc' },
  '& ol': { listStyleType: 'decimal' },
  '& ul ul': {
    listStyleType: 'circle',
    paddingLeft: '25px',
  },
  '& ol ol': {
    listStyleType: 'lower-alpha',
    paddingLeft: '25px',
  },
  '& li': { marginBottom: '0.5em' },
  '& li:last-child': { marginBottom: 0 },
};

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
    const resolvedBaseColor = baseColor ?? 'rgba(255, 255, 255, 0.12)';
    const resolvedHoverIcon = hoverIconColor ?? 'rgba(255, 255, 255, 0.95)';
    const resolvedIconColor = active ? resolvedHoverIcon : iconColor ?? 'rgba(255, 255, 255, 0.85)';

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

const IconBadge: React.FC<{ size?: number; children: React.ReactNode }> = ({ size = ICON_BOX_SIZE, children }) => (
  <Box
    sx={{
      position: 'relative',
      width: size,
      height: size,
      background: ICON_BADGE_BACKGROUND,
      borderRadius: size >= 40 ? '0 0 14px 14px' : '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'rgba(255,255,255,0.92)',
      isolation: 'isolate',
      overflow: 'visible',
      zIndex: 0,
      boxShadow: '0px 22px 52px rgba(31, 169, 239, 0.32)',
      '& > span': {
        position: 'relative',
        zIndex: 2,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
      },
    }}
  >
    <span>{children}</span>
  </Box>
);

const SidebarPanel: React.FC<{ icon: React.ReactNode; children: React.ReactNode }> = ({ icon, children }) => (
  <Box
    sx={{
      position: 'relative',
      backgroundColor: SIDEBAR_BACKGROUND,
      borderRadius: '30px',
      outline: SIDEBAR_OUTLINE,
      outlineOffset: '-1px',
      overflow: 'hidden',
      boxShadow: '0px 28px 42px rgba(0, 0, 0, 0.28)',
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
        color: 'rgba(255,255,255,0.9)',
      }}
    >
      <IconBadge size={SIDEBAR_ICON_SIZE}>{icon}</IconBadge>
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

interface OverviewCardProps {
  title: string;
  icon: React.ReactNode;
  html: string;
  typographySx: any;
}

const OverviewCard: React.FC<OverviewCardProps> = ({ title, icon, html, typographySx }) => (
  <MuiAccordion
    disableGutters
    square
    sx={{
      backgroundColor: OVERVIEW_CARD_BASE_COLOR,
      backgroundImage: `url('${NOISE_TEXTURE}'), ${OVERVIEW_CARD_GRADIENT}`,
      backgroundRepeat: 'repeat, no-repeat',
      backgroundSize: '240% 240%, 100% 100%',
      backgroundPosition: 'center center, center center',
      backgroundBlendMode: 'soft-light, normal',
      borderRadius: '26px',
      boxShadow: OVERVIEW_CARD_SHADOW,
      overflow: 'hidden',
      transition: 'transform 0.18s ease',
      '&:before': { display: 'none' },
      '&.MuiAccordion-root': { margin: 0 },
      '&.Mui-expanded': { margin: 0 },
      '&:hover': {
        transform: 'translateY(-1px)',
      },
    }}
  >
    <AccordionSummary
      expandIcon={<KeyboardArrowDownIcon sx={{ fontSize: 20, color: 'rgba(255,255,255,0.9)' }} />}
      sx={{
        px: { xs: 3, md: 4 },
        pt: { xs: 3.5, md: 4.5 },
        pb: { xs: 3.45, md: 3.95 },
        '& .MuiAccordionSummary-content': {
          margin: 0,
          display: 'flex',
          alignItems: 'center',
        gap: { xs: 1.5, md: 2 },
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
      },
    }}
  >
    <IconBadge size={32}>{icon}</IconBadge>
    <Typography
      sx={{
        fontSize: { xs: 17, md: 18 },
        fontWeight: 700,
        color: TEXT_COLOR_PRIMARY,
        flex: 1,
        minWidth: 0,
        position: 'relative',
        zIndex: 1,
      }}
    >
      {title}
    </Typography>
  </AccordionSummary>
    <AccordionDetails
      sx={{
        px: { xs: 3, md: 4 },
        pt: 0,
        pb: { xs: 3, md: 3.5 },
        position: 'relative',
        zIndex: 1,
      }}
    >
      <Typography
        sx={{ ...typographySx, color: TEXT_COLOR_PRIMARY }}
        component="div"
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </AccordionDetails>
  </MuiAccordion>
);

const getMobileBookName = (bookName: string, isMobile: boolean): string => {
  if (!isMobile) return bookName;

  switch (bookName) {
    case 'Song Of Solomon':
      return 'Songs';
    default:
      return bookName;
  }
};

export default function BookOverviewModal({ open, onClose, verseVersion, bookName, bookOverview }: BookOverviewModalProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState<boolean>(false);
  const contentScrollRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { fontScale } = useAdaptiveFontScale();

  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();
  const bookOverviewBookmarkId = useMemo(
    () =>
      resolveBookmarkId(
        bookOverview?.id,
        bookOverview?.bookOverviewId,
        bookOverview?.overviewId,
        bookOverview?.bibleBookOverviewId,
        bookOverview?.referenceId,
        bookOverview?.bibleBookId,
        bookOverview?.bookId,
      ),
    [bookOverview],
  );

  const baseOverviewFontSize = isMobile ? OVERVIEW_BODY_FONT_SIZE_MOBILE : OVERVIEW_BODY_FONT_SIZE_DESKTOP;
  const baseOverviewLineHeight = isMobile ? OVERVIEW_BODY_LINE_HEIGHT_MOBILE : OVERVIEW_BODY_LINE_HEIGHT_DESKTOP;
  const scaledOverviewFontSize = baseOverviewFontSize * fontScale;
  const scaledOverviewLineHeight = baseOverviewLineHeight * fontScale;

  const overviewBodyTypographySx = useMemo(
    () => ({
      color: TEXT_COLOR_PRIMARY,
      fontSize: scaledOverviewFontSize,
      lineHeight: `${scaledOverviewLineHeight}px`,
      fontWeight: 400,
      '& *, & *::before, & *::after': {
        fontSize: `${scaledOverviewFontSize}px`,
        lineHeight: `${scaledOverviewLineHeight}px`,
      },
      '& p': {
        margin: '0 0 1.1em',
      },
      '& p:last-child': {
        marginBottom: 0,
      },
    }),
    [scaledOverviewFontSize, scaledOverviewLineHeight],
  );

  const authorHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.author || ''),
    [bookOverview?.author, verseVersion],
  );
  const audienceHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.audience || ''),
    [bookOverview?.audience, verseVersion],
  );
  const compositionHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.composition || ''),
    [bookOverview?.composition, verseVersion],
  );
  const objectiveHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.objective || ''),
    [bookOverview?.objective, verseVersion],
  );
  const uniqueElementsHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.uniqueElements || ''),
    [bookOverview?.uniqueElements, verseVersion],
  );
  const bookStructureHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.bookStructure || ''),
    [bookOverview?.bookStructure, verseVersion],
  );
  const keyThemesHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.keyThemes || ''),
    [bookOverview?.keyThemes, verseVersion],
  );
  const teachingHighlightsHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.teachingHighlights || ''),
    [bookOverview?.teachingHighlights, verseVersion],
  );
  const historicalContextHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.historicalContext || ''),
    [bookOverview?.historicalContext, verseVersion],
  );
  const culturalBackgroundHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.culturalBackground || ''),
    [bookOverview?.culturalBackground, verseVersion],
  );
  const politicalLandscapeHtml = useMemo(
    () => replaceReferenceShortcodes(verseVersion, bookOverview?.politicalLandscape || ''),
    [bookOverview?.politicalLandscape, verseVersion],
  );

  const sectionsByTab = useMemo<Record<TabKey, OverviewSectionConfig[]>>(
    () => ({
      background: [
        { key: 'author', title: 'Author', icon: <PersonIcon sx={{ fontSize: 20 }} />, html: authorHtml },
        { key: 'audience', title: 'Audience', icon: <PeopleIcon sx={{ fontSize: 20 }} />, html: audienceHtml },
        { key: 'composition', title: 'Composition', icon: <EditIcon sx={{ fontSize: 20 }} />, html: compositionHtml },
      ].filter(section => Boolean(section.html?.trim())),
      content: [
        { key: 'objective', title: 'Objective', icon: <LightbulbOutlinedIcon sx={{ fontSize: 20 }} />, html: objectiveHtml },
        { key: 'uniqueElements', title: 'Unique Elements', icon: <MenuBookOutlinedIcon sx={{ fontSize: 20 }} />, html: uniqueElementsHtml },
        { key: 'bookStructure', title: 'Book Structure', icon: <ArchitectureOutlinedIcon sx={{ fontSize: 20 }} />, html: bookStructureHtml },
      ].filter(section => Boolean(section.html?.trim())),
      themes: [
        { key: 'keyThemes', title: 'Key Themes', icon: <AutoAwesomeOutlinedIcon sx={{ fontSize: 20 }} />, html: keyThemesHtml },
        { key: 'teachingHighlights', title: 'Teaching Highlights', icon: <SchoolOutlinedIcon sx={{ fontSize: 20 }} />, html: teachingHighlightsHtml },
      ].filter(section => Boolean(section.html?.trim())),
      context: [
        { key: 'historicalContext', title: 'Historical Context', icon: <PublicOutlinedIcon sx={{ fontSize: 20 }} />, html: historicalContextHtml },
        { key: 'culturalBackground', title: 'Cultural Background', icon: <AccountBalanceOutlinedIcon sx={{ fontSize: 20 }} />, html: culturalBackgroundHtml },
        { key: 'politicalLandscape', title: 'Political Landscape', icon: <FlagOutlinedIcon sx={{ fontSize: 20 }} />, html: politicalLandscapeHtml },
      ].filter(section => Boolean(section.html?.trim())),
    }),
    [
      authorHtml,
      audienceHtml,
      compositionHtml,
      objectiveHtml,
      uniqueElementsHtml,
      bookStructureHtml,
      keyThemesHtml,
      teachingHighlightsHtml,
      historicalContextHtml,
      culturalBackgroundHtml,
      politicalLandscapeHtml,
    ],
  );

  const sectionGroups = useMemo(
    () => (
      [
        {
          id: 'background' as const,
          label: 'Background',
          summary: 'Foundational details on authorship, audience, and how the book came together.',
          sections: sectionsByTab.background,
        },
        {
          id: 'content' as const,
          label: 'Content',
          summary: 'High-level objectives, unique elements, and how the book is structured.',
          sections: sectionsByTab.content,
        },
        {
          id: 'themes' as const,
          label: 'Themes',
          summary: 'Recurring ideas and teaching highlights to watch for while reading.',
          sections: sectionsByTab.themes,
        },
        {
          id: 'context' as const,
          label: 'Context',
          summary: 'Historical, cultural, and political backdrop that frames the narrative.',
          sections: sectionsByTab.context,
        },
      ].filter(group => group.sections.length > 0)
    ),
    [sectionsByTab],
  );

  const generateShareUrl = () => {
    if (typeof window !== 'undefined') {
      const baseUrl = window.location.origin + window.location.pathname;
      const anchor = `#book-overview`;
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
          title: `${bookName} - Book Overview`,
          text: `Explore the book overview for ${bookName}`,
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

    if (!bookOverviewBookmarkId) {
      toast.error('Book overview ID is required for bookmarking');
      return;
    }

    try {
      if (!isBookmarked) {
        await createBookmark({
          id: bookOverviewBookmarkId,
          type: BookmarkType.BOOK_OVERVIEW,
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
      const anchor = `#book-overview`;
      window.history.replaceState(null, '', window.location.pathname + anchor);
    }
  }, [open]);

  useEffect(() => {
    if (open) {
      refreshModalAds();
    }
  }, [open]);

  const renderContentGroups = () => {
    if (!sectionGroups.length) {
      return (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 220,
            borderRadius: '24px',
            border: '1px dashed rgba(255, 255, 255, 0.12)',
            bgcolor: 'rgba(255, 255, 255, 0.04)',
            px: 3,
            textAlign: 'center',
          }}
        >
          <Typography sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 18 }}>
            This overview hasn’t been written yet.
          </Typography>
        </Box>
      );
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 4, md: 4.5 } }}>
        {sectionGroups.map(group => (
          <Box key={group.id} sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2, md: 2.5 } }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.6 }}>
              <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEXT_COLOR_PRIMARY }}>
                {group.label}
              </Typography>
              <Typography sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 14.5, lineHeight: '22px' }}>
                {group.summary}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 3 } }}>
              {group.sections.map(section => (
                <OverviewCard
                  key={`${group.id}-${section.key}`}
                  title={section.title}
                  icon={section.icon}
                  html={section.html}
                  typographySx={{ ...htmlTypographySx, ...overviewBodyTypographySx }}
                />
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    );
  };

  const renderSidebar = () => {
    const structures = bookOverview?.bibleBookStructures ?? [];

    if (!structures.length) {
      return null;
    }

    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 } }}>
        <SidebarPanel icon={<MenuBookOutlinedIcon sx={{ fontSize: 22 }} />}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: TEXT_COLOR_PRIMARY }}>
              Book Outline
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {structures.map((item: any, index: number) => (
                <Box
                  key={`${item?.title ?? 'outline'}-${index}`}
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.75,
                    pb: index !== structures.length - 1 ? 1.5 : 0,
                    borderBottom: index !== structures.length - 1 ? '1px solid rgba(255, 255, 255, 0.08)' : 'none',
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      gap: 1.5,
                      flexWrap: 'wrap',
                    }}
                  >
                    <Typography sx={{ fontSize: 15.5, fontWeight: 600, color: TEXT_COLOR_PRIMARY }}>
                      {item.title}
                    </Typography>
                    {item.verses && (
                      <CustomChip
                        label={item.verses}
                        bgColor='rgba(44, 155, 255, 0.18)'
                        textColor='rgba(223, 248, 255, 0.9)'
                        fontSize={12}
                        fontWeight={500}
                        borderRadius={10}
                        padding="2px 8px"
                      />
                    )}
                  </Box>
                  {item.description && (
                    <Typography
                      sx={{
                        fontSize: 14.5,
                        color: 'rgba(223, 248, 255, 0.78)',
                        lineHeight: 1.45,
                      }}
                    >
                      {item.description}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        </SidebarPanel>
        <ResponsiveAd slotId="CONTENT_RESPONSIVE" placement="modal" showPlaceholder={false} />
      </Box>
    );
  };

  const modalTitle = bookName ? `Book overview for ${bookName}` : 'Book overview';
  const modalDescription = `Explore key background, themes, and context for ${bookName}.`;

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
            Book Overview
          </Typography>
          <CustomChip
            label={getMobileBookName(bookName, isMobile)}
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
            label="Share book overview"
            icon={<IosShareIcon sx={{ fontSize: 22 }} />}
            hoverColor={SHARE_HOVER_COLOR}
            onClick={handleShare}
            baseColor={ACTION_BUTTON_BASE_COLOR}
            iconColor={ACTION_BUTTON_ICON_COLOR}
          />
          <ModalActionButton
            label={isBookmarked ? 'Overview bookmarked' : 'Bookmark overview'}
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
            background: '#020E14',
            px: MODAL_MOBILE_PADDING,
            pt: '16px',
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
          {renderContentGroups()}
          <Box sx={{ mt: 2.5 }}>{renderSidebar()}</Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'row',
            gap: 0,
            background: '#020E14',
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
              display: 'flex',
              flexDirection: 'column',
              gap: 3,
              minHeight: 0,
            }}
          >
            <Box
              ref={contentScrollRef}
              sx={{
                flex: '1 1 auto',
                minHeight: 0,
                overflowY: 'auto',
                pr: 2,
                display: 'flex',
                flexDirection: 'column',
                gap: 3.5,
                '&::-webkit-scrollbar': { width: 8 },
                '&::-webkit-scrollbar-track': { background: 'transparent' },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(221, 247, 255, 0.22)',
                  borderRadius: 4,
                  transition: 'opacity 0.3s ease',
                },
                '&:hover::-webkit-scrollbar-thumb': { background: 'rgba(221, 247, 255, 0.38)' },
                scrollbarColor: 'rgba(221, 247, 255, 0.22) transparent',
              }}
            >
              {renderContentGroups()}
            </Box>
          </Box>
          <Box
            sx={{
              width: '1px',
              alignSelf: 'stretch',
              background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.9) 50%, rgba(255, 255, 255, 0) 100%)',
              opacity: 0.45,
              mx: 2,
            }}
          />
          <Box
            sx={{
              flex: '0 0 320px',
              minHeight: 0,
              overflowY: 'auto',
              pl: 1,
              '&::-webkit-scrollbar': { width: 8 },
              '&::-webkit-scrollbar-track': { background: 'transparent' },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(221, 247, 255, 0.22)',
                borderRadius: 4,
                transition: 'opacity 0.3s ease',
              },
              '&:hover::-webkit-scrollbar-thumb': { background: 'rgba(221, 247, 255, 0.38)' },
              scrollbarColor: 'rgba(221, 247, 255, 0.22) transparent',
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
                    backgroundColor: 'rgba(1, 4, 6, 0.85)',
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
