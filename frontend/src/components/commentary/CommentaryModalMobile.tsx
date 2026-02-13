import React, { useState, useRef, useEffect, useCallback, useMemo, useTransition } from 'react';
import { Box, Typography, IconButton, Slider, CircularProgress } from '@mui/material';
import MuiTooltip from '@mui/material/Tooltip';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { Primitive } from '@radix-ui/react-primitive';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { ArrowBackIcon } from '@/components/ui/phosphor-icons';
import { InfoOutlinedIcon } from '@/components/ui/phosphor-icons';
import { SettingsOutlinedIcon } from '@/components/ui/phosphor-icons';
import { KeyboardArrowDownIcon } from '@/components/ui/phosphor-icons';
import { lighten, desaturate } from 'color2k';
import { toast } from 'react-toastify';
import { replaceReferenceShortcodes, slugToBookName } from '@/utils/stringHelpers';
import { ContentWithAds } from '@/components/ads/ContentAd';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { useCreateBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { Tooltip } from '@/components/ui';
import AuthorBioModal from '@/components/author/AuthorBioModal';
import ModernizationTooltip from './ModernizationTooltip';
import { extractBookChapterFromSlug, extractVerseRangeFromSlug } from '@/hooks/useBibleVerseRange';
import {
  useAdaptiveFontScale,
  ADAPTIVE_FONT_SCALE_DEFAULT_STEP,
  ADAPTIVE_FONT_SCALE_MIN_STEP,
  ADAPTIVE_FONT_SCALE_MAX_STEP,
} from '@/hooks/useAdaptiveFontScale';

export interface CommentaryModalProps {
  open: boolean;
  onClose: () => void;
  initialCommentaryId: string | null;
  reference: string;
  commentaries: any;
  verseContent: string;
  verseVersion: string;
}

const FONT_FAMILY = 'Inter, sans-serif';
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';
const BOOKMARK_COLOR = '#FF9800';
const MODAL_MOBILE_PADDING = '20px';
const ICON_BOX_SIZE = 36;
const ICON_BOX_BACKGROUND = 'rgba(255, 255, 255, 0.12)';
const ICON_BOX_TEXT = 'rgba(255, 255, 255, 0.85)';
const SHARE_HOVER_COLOR = '#4A9EFF';
const BOOKMARK_HOVER_COLOR = '#FF8C3A';
const CLOSE_HOVER_COLOR = '#FF4D57';
const HOVER_LIGHTEN_AMOUNT = 0.08;
const HOVER_DESATURATE_AMOUNT = 0.1;
const AVATAR_SIZE = 32;
const CONTENT_OFFSET = '-20px';
const CONTENT_BOTTOM_GUTTER = 88;

const getHoverColor = (darkColor: string, primaryColor: string): string => {
  try {
    const lighter = lighten(darkColor, HOVER_LIGHTEN_AMOUNT);
    const desaturated = desaturate(lighter, HOVER_DESATURATE_AMOUNT);
    return desaturated;
  } catch (e) {
    return primaryColor;
  }
};

const bumpOpacity = (color: string, delta = 0.1) => {
  const rgbaMatch = color.match(/rgba\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*\)/i);
  if (rgbaMatch) {
    const [, r, g, b, a] = rgbaMatch;
    const nextAlpha = Math.max(0, Math.min(1, parseFloat(a) + delta));
    return `rgba(${Number(r)}, ${Number(g)}, ${Number(b)}, ${Number(nextAlpha.toFixed(2))})`;
  }

  if (color.startsWith('#')) {
    return color;
  }

  return color;
};

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;

interface ModalActionButtonProps extends Omit<PrimitiveButtonProps, 'children'> {
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
  tooltip?: string;
  pressed?: boolean;
  baseColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  text?: string;
  borderColor?: string;
  ariaExpanded?: boolean;
  ariaHasPopup?: boolean;
  loading?: boolean;
}

const ModalActionButton = React.forwardRef<HTMLButtonElement, ModalActionButtonProps>(
  (
    props,
    ref,
  ) => {
    const {
      label,
      icon,
      hoverColor,
      onClick,
      tooltip,
      pressed,
      disabled = false,
      baseColor,
      iconColor,
      hoverIconColor,
      text,
      borderColor,
      ariaExpanded,
      ariaHasPopup,
      loading = false,
      ...primitiveProps
    } = props;
    const resolvedBaseColor = baseColor ?? ICON_BOX_BACKGROUND;
    const resolvedHoverIcon = hoverIconColor ?? 'rgba(255, 255, 255, 0.95)';
    const resolvedIconColor = pressed ? resolvedHoverIcon : iconColor ?? ICON_BOX_TEXT;
    const isLoading = Boolean(loading);
    const isDisabled = disabled || isLoading;
    const spinnerColor = pressed ? resolvedHoverIcon : resolvedIconColor;
    const renderedIcon = isLoading ? (
      <CircularProgress size={text ? 16 : 20} thickness={4} sx={{ color: spinnerColor }} />
    ) : (
      icon
    );

    const button = (
      <Box
        component={Primitive.button}
        ref={ref as any}
        type="button"
        onClick={event => {
          if (isDisabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClick?.(event);
        }}
        disabled={isDisabled}
        data-state={pressed ? 'active' : 'inactive'}
        aria-label={label}
        aria-pressed={typeof pressed === 'boolean' ? (pressed ? 'true' : 'false') : undefined}
        aria-expanded={ariaExpanded}
        aria-haspopup={ariaHasPopup}
        aria-busy={isLoading ? 'true' : undefined}
        {...primitiveProps}
        sx={{
          width: text ? 'auto' : ICON_BOX_SIZE,
          height: ICON_BOX_SIZE,
          borderRadius: '12px',
          backgroundColor: pressed ? hoverColor : resolvedBaseColor,
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
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          boxShadow: 'none',
          fontFamily: 'inherit',
          '& > svg': {
            fontSize: text ? 20 : 22,
          },
          '&:disabled': {
            opacity: 0.45,
            cursor: 'not-allowed',
          },
          '@media (hover: hover)': {
            '&:hover': !isDisabled ? {
              backgroundColor: hoverColor,
              color: resolvedHoverIcon,
            } : {},
          },
          '&:focus-visible': {
            outline: '2px solid rgba(255, 255, 255, 0.55)',
            outlineOffset: '3px',
          },
          '&:active': {
            transform: isDisabled ? 'none' : `scale(${text ? 0.96 : 0.92})`,
          },
          '&[data-state="active"]': {
            backgroundColor: hoverColor,
            color: resolvedHoverIcon,
          },
        }}
      >
        {renderedIcon}
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

export default function CommentaryModalMobile({
  open,
  onClose,
  initialCommentaryId,
  reference,
  commentaries,
  verseContent: _unusedVerseContent,
  verseVersion,
}: CommentaryModalProps) {
  const router = useRouter();
  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [bookmarkedCommentaries, setBookmarkedCommentaries] = useState<Set<string>>(new Set());
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState<boolean>(false);
  const [isFullCommentaryPending, startFullCommentaryTransition] = useTransition();
  const [authorBioOpen, setAuthorBioOpen] = useState<boolean>(false);
  const [actionSheet, setActionSheet] = useState<'full' | 'settings' | null>(null);
  const [settingsMenuOpen, setSettingsMenuOpen] = useState(false);
  const [infoMenuOpen, setInfoMenuOpen] = useState(false);
  const {
    fontScaleStep,
    fontScale,
    setFontScaleStep: setSharedFontScaleStep,
    resetFontScaleStep: resetSharedFontScaleStep,
  } = useAdaptiveFontScale();
  const contentScrollRef = useRef<HTMLDivElement | null>(null);
  const [collapsedSections, setCollapsedSections] = useState<Record<string, boolean>>({});
  const updatingUrlRef = useRef(false);

  const toggleSection = useCallback((commentaryId: string) => {
    setCollapsedSections(prev => ({
      ...prev,
      [commentaryId]: !prev[commentaryId],
    }));
  }, []);

  const handleBookmarkClick = async (commentaryId: string) => {
    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    try {
      await createBookmark({
        id: commentaryId,
        type: BookmarkType.COMMENTARY,
        userId: user.id,
      });
      setBookmarkedCommentaries(prev => new Set(prev).add(commentaryId));
    } catch {
      toast.error('Bookmark error');
    }
  };

  const handleFontScaleChange = useCallback(
    (_event: Event, value: number | number[]) => {
      const numericValue = Array.isArray(value) ? value[0] : value;
      setSharedFontScaleStep(numericValue);
    },
    [setSharedFontScaleStep],
  );

  const handleResetFontScale = useCallback(() => {
    resetSharedFontScaleStep();
  }, [resetSharedFontScaleStep]);

  useEffect(() => {
    const initialIndex = commentaries.findIndex((comm: any) => comm.id === initialCommentaryId);
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [initialCommentaryId, commentaries, open]);

  useEffect(() => {
    if (contentScrollRef.current) {
      contentScrollRef.current.scrollTop = 0;
    }
  }, [currentIndex, commentaries]);

  useEffect(() => {
    if (typeof window === 'undefined' || !open) {
      return undefined;
    }

    const { body } = document;
    const previous = {
      overflow: body.style.overflow,
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
    };

    const scrollY = window.scrollY;

    body.style.overflow = 'hidden';
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';

    return () => {
      body.style.overflow = previous.overflow;
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const currentCommentary = commentaries[currentIndex];
  const author = currentCommentary?.author;

  const currentAuthorCommentaries = useMemo(
    () =>
      author
        ? commentaries.filter((comm: any) => comm.author.id === author.id)
        : [],
    [commentaries, author],
  );

  const uniqueAuthors: Array<{ author: any; firstIndex: number }> = useMemo(() => {
    const list: Array<{ author: any; firstIndex: number }> = [];
    const seenAuthorIds = new Set<string>();

    commentaries.forEach((commentary: any, index: number) => {
      if (!commentary?.author) return;
      if (!seenAuthorIds.has(commentary.author.id)) {
        seenAuthorIds.add(commentary.author.id);
        list.push({
          author: commentary.author,
          firstIndex: index,
        });
      }
    });

    return list;
  }, [commentaries]);

  const currentAuthorIndex = useMemo(
    () => (author ? uniqueAuthors.findIndex(item => item.author.id === author.id) : -1),
    [uniqueAuthors, author],
  );

  useEffect(() => {
    if (typeof window === 'undefined' || !author) return;

    if (open) {
      const anchor = `#${author.name.replace(/\s+/g, '-').toLowerCase()}`;
      updatingUrlRef.current = true;
      window.history.replaceState(null, '', window.location.pathname + anchor);
      const timeout = setTimeout(() => {
        updatingUrlRef.current = false;
      }, 10);
      return () => clearTimeout(timeout);
    }

    if (window.location.hash) {
      updatingUrlRef.current = true;
      window.history.replaceState(null, '', window.location.pathname);
      const timeout = setTimeout(() => {
        updatingUrlRef.current = false;
      }, 10);
      return () => clearTimeout(timeout);
    }
  }, [open, author]);

  useEffect(() => {
    if (!open || !author) return;

    const handleHashChange = () => {
      if (updatingUrlRef.current) return;

      const hash = window.location.hash.slice(1);
      if (hash === 'verse-takeaways') {
        onClose();
        return;
      }

      if (!hash) {
        onClose();
        return;
      }

      const targetAuthorName = hash.replace(/-/g, ' ');
      const targetAuthorIndex = uniqueAuthors.findIndex(item =>
        item.author.name.toLowerCase() === targetAuthorName.toLowerCase(),
      );

      if (targetAuthorIndex !== -1) {
        const targetCommentaryIndex = uniqueAuthors[targetAuthorIndex].firstIndex;
        if (targetCommentaryIndex !== currentIndex) {
          setCurrentIndex(targetCommentaryIndex);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [open, uniqueAuthors, author, currentIndex, onClose]);

  useEffect(() => {
    setCollapsedSections({});
  }, [currentAuthorIndex]);

  const prevAuthorIndex = currentAuthorIndex > 0 ? currentAuthorIndex - 1 : -1;
  const nextAuthorIndex = currentAuthorIndex < uniqueAuthors.length - 1 ? currentAuthorIndex + 1 : -1;
  const prevAuthor = prevAuthorIndex !== -1 ? uniqueAuthors[prevAuthorIndex].author : null;
  const nextAuthor = nextAuthorIndex !== -1 ? uniqueAuthors[nextAuthorIndex].author : null;

  const prevCommentaryIndex = prevAuthorIndex !== -1 ? uniqueAuthors[prevAuthorIndex].firstIndex : -1;
  const nextCommentaryIndex = nextAuthorIndex !== -1 ? uniqueAuthors[nextAuthorIndex].firstIndex : -1;

  const handlePrevious = useCallback(() => {
    if (prevCommentaryIndex !== -1) {
      setCurrentIndex(prevCommentaryIndex);
    }
  }, [prevCommentaryIndex]);

  const handleNext = useCallback(() => {
    if (nextCommentaryIndex !== -1) {
      setCurrentIndex(nextCommentaryIndex);
    }
  }, [nextCommentaryIndex]);

  if (!currentCommentary || !author) {
    return null;
  }

  const chipBackground = author.colorScheme?.chipBackground || 'rgba(233, 36, 154, 0.30)';
  const avatarOutline = author.colorScheme?.outline || 'rgba(233, 36, 154, 0.35)';
  const avatarGradient = author.colorScheme?.primary
    ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
    : 'linear-gradient(216deg, #E9249A 0%, black 100%)';
  const authorActionBaseColor = useMemo(
    () => bumpOpacity(chipBackground, -0.1),
    [chipBackground],
  );
  const authorActionHoverColor = useMemo(
    () => getHoverColor(authorActionBaseColor, chipBackground),
    [authorActionBaseColor, chipBackground],
  );

  const baseCommentaryFontSize = 18;
  const baseCommentaryLineHeight = 28;
  const baseSupFontSize = 11;
  const scaledCommentaryFontSize = baseCommentaryFontSize * fontScale;
  const scaledCommentaryLineHeight = baseCommentaryLineHeight * fontScale;
  const scaledSupFontSize = Math.max(10, baseSupFontSize * fontScale);

  const showPrimaryBookmark = currentAuthorCommentaries.length === 1;
  const firstExcerpt = currentAuthorCommentaries[0]?.excerpts?.[0];
  const isFirstExcerptModern = showPrimaryBookmark && firstExcerpt?.type === 'Modern';
  const isCurrentBookmarked = bookmarkedCommentaries.has(currentCommentary.id);

  const navFallbackBackground = 'rgba(255, 255, 255, 0.08)';
  const prevNavBackground = bumpOpacity(prevAuthor?.colorScheme?.chipBackground || navFallbackBackground, 0.12);
  const nextNavBackground = bumpOpacity(nextAuthor?.colorScheme?.chipBackground || navFallbackBackground, 0.12);
  const prevNavHoverBackground = prevAuthor
    ? getHoverColor(prevNavBackground, prevAuthor.colorScheme?.chipBackground || prevNavBackground)
    : prevNavBackground;
  const nextNavHoverBackground = nextAuthor
    ? getHoverColor(nextNavBackground, nextAuthor.colorScheme?.chipBackground || nextNavBackground)
    : nextNavBackground;
  const prevNavIconColor = prevAuthor?.colorScheme?.chipText || 'rgba(255, 255, 255, 0.85)';
  const nextNavIconColor = nextAuthor?.colorScheme?.chipText || 'rgba(255, 255, 255, 0.85)';

  const getCurrentReference = useCallback(() => {
    const parts = currentCommentary.slug?.split('/') ?? [];
    const bookSlug = parts[4] ?? '';
    const chapter = parts[5] ?? '';
    const versePart = parts[6] ?? '';

    const book = slugToBookName(bookSlug);

    if (!book) {
      return reference;
    }

    if (versePart.includes('-')) {
      const [start, end] = versePart.split('-');
      return `${book} ${chapter}:${start}–${end}`;
    }

    return `${book} ${chapter}:${versePart}`;
  }, [currentCommentary.slug, reference]);

  const currentReference = getCurrentReference();

  const parseReference = useCallback((value: string) => {
    const match = value.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const bookName = match[1].trim();
      const chapter = match[2];
      const bookSlug = bookName.toLowerCase().replace(/\s+/g, '-');
      return { bookSlug, chapter };
    }
    return null;
  }, []);

  const verseRange = currentCommentary.slug ? extractVerseRangeFromSlug(currentCommentary.slug) : null;
  const bookChapter = currentCommentary.slug ? extractBookChapterFromSlug(currentCommentary.slug) : null;

  const referenceData = parseReference(reference);
  const chapterUrl = bookChapter?.bookSlug && bookChapter?.chapter
    ? `/commentators/${author.slug}/commentaries/${bookChapter.bookSlug}/${bookChapter.chapter}`
    : referenceData
      ? `/commentators/${author.slug}/commentaries/${referenceData.bookSlug}/${referenceData.chapter}`
      : `/commentators/${author.slug}/commentaries`;

  const sharePath = useMemo(() => {
    if (bookChapter?.bookSlug && bookChapter?.chapter && verseRange) {
      return `/commentators/${author.slug}/commentaries/${bookChapter.bookSlug}/${bookChapter.chapter}/${verseRange}`;
    }
    const slugPath = currentCommentary.slug || '';
    if (!slugPath) {
      return '';
    }
    return slugPath.startsWith('/') ? slugPath : `/${slugPath}`;
  }, [
    author.slug,
    bookChapter?.bookSlug,
    bookChapter?.chapter,
    verseRange,
    currentCommentary.slug,
  ]);

  const generateShareUrl = useCallback(() => {
    if (!sharePath) {
      return '';
    }
    if (typeof window === 'undefined') {
      return sharePath;
    }
    return `${window.location.origin}${sharePath}`;
  }, [sharePath]);

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
    if (!shareUrl) {
      toast.error('Unable to generate share link');
      return;
    }

    if (navigator.share) {
      try {
        await navigator.share({ url: shareUrl });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink(shareUrl);
        }
      }
    } else {
      handleCopyLink(shareUrl);
    }
  };

  const handleModalClose = useCallback(() => {
    setActionSheet(null);
    setInfoMenuOpen(false);
    setAuthorBioOpen(false);
    setSettingsMenuOpen(false);
    onClose();
  }, [onClose]);

  const handleContinueToFullCommentary = useCallback(() => {
    if (!chapterUrl || isFullCommentaryPending) {
      return;
    }

    const destination = chapterUrl;
    setActionSheet(null);
    setInfoMenuOpen(false);
    setAuthorBioOpen(false);
    setSettingsMenuOpen(false);

    startFullCommentaryTransition(() => {
      onClose();
      router.push(destination);
    });
  }, [chapterUrl, isFullCommentaryPending, onClose, router, setActionSheet, setInfoMenuOpen, setAuthorBioOpen, setSettingsMenuOpen, startFullCommentaryTransition]);

  const mobileModalVariants = {
    hidden: {
      opacity: 0,
      y: '95vh',
    },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <>
      <style>{`
        .commentary-modal-mobile {
          top: 5vh !important;
          height: 95vh !important;
        }
        @supports (height: 100dvh) {
          .commentary-modal-mobile {
            top: 5dvh !important;
            height: 95dvh !important;
          }
        }
        .settings-menu-content {
          min-width: 200px;
          background-color: #111111;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.08);
          box-shadow: 0px 12px 32px rgba(0,0,0,0.45);
          padding: 6px;
          color: ${TEXT_COLOR_PRIMARY};
          z-index: 1600;
        }
        .settings-menu-item {
          width: 100%;
          border-radius: 10px;
          cursor: pointer;
          outline: none;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 500;
          color: rgba(255,255,255,0.82);
        }
        .settings-menu-item[data-highlighted] {
          background-color: rgba(255, 255, 255, 0.08);
          color: rgba(255, 255, 255, 0.95);
        }
        .settings-menu-item:focus-visible {
          outline: 2px solid rgba(255,255,255,0.35);
          outline-offset: 3px;
        }
        .settings-menu-arrow {
          fill: rgba(255,255,255,0.08);
        }
      `}</style>
      <Dialog.Root
        open={open}
        onOpenChange={value => {
          if (!value) {
            handleModalClose();
          }
        }}
      >
        <AnimatePresence>
          {open && (
            <Dialog.Portal>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1400,
                    backgroundColor: 'rgba(0,0,0,0.55)',
                  }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  className="commentary-modal-mobile"
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={mobileModalVariants}
                  transition={{
                    duration: 0.3,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  style={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    width: '100vw',
                    display: 'flex',
                    flexDirection: 'column',
                    borderRadius: '28px 28px 0 0',
                    overflow: 'hidden',
                    backgroundColor: 'transparent',
                    zIndex: 1401,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      height: '100%',
                      bgcolor: 'black',
                      color: TEXT_COLOR_PRIMARY,
                      fontFamily: FONT_FAMILY,
                    }}
                  >
                    <Dialog.Title asChild>
                      <VisuallyHidden>
                        Commentary from {author?.name ?? 'selected author'} on {currentReference}
                      </VisuallyHidden>
                    </Dialog.Title>
                    <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                px: MODAL_MOBILE_PADDING,
                pt: '18px',
                pb: '14px',
                gap: '12px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                flexShrink: 0,
                bgcolor: 'black',
              }}
            >
              <Box
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.10)',
                  borderRadius: '11px',
                  px: '14px',
                  py: '6px',
                  display: 'inline-flex',
                  alignItems: 'center',
                }}
              >
                <Typography sx={{ fontSize: 15, lineHeight: '22px', color: TEXT_COLOR_PRIMARY, opacity: 0.85 }}>
                  {(() => {
                    const match = currentReference.match(/^(.+?)\s+(\d+:.+)$/);
                    if (match) {
                      return (
                        <>
                          <span style={{ fontWeight: 400 }}>{match[1]}</span>
                          <span style={{ fontWeight: 600 }}> {match[2]}</span>
                        </>
                      );
                    }
                    return currentReference;
                  })()}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <ModalActionButton
                  label="Share commentary"
                  icon={<IosShareIcon sx={{ fontSize: 21 }} />}
                  hoverColor={SHARE_HOVER_COLOR}
                  onClick={handleShare}
                />
                {showPrimaryBookmark && (
                  <ModalActionButton
                    label={isCurrentBookmarked ? 'Commentary bookmarked' : 'Bookmark commentary'}
                    icon={isCurrentBookmarked ? <BookmarkIcon sx={{ fontSize: 22 }} /> : <BookmarkBorderIcon sx={{ fontSize: 22 }} />}
                    hoverColor={BOOKMARK_HOVER_COLOR}
                    onClick={() => handleBookmarkClick(currentCommentary.id)}
                    pressed={isCurrentBookmarked}
                    tooltip={isCurrentBookmarked ? 'Commentary bookmarked' : 'Bookmark commentary'}
                    baseColor={ICON_BOX_BACKGROUND}
                  />
                )}
                <Dialog.Close asChild>
                  <ModalActionButton
                    label="Close modal"
                    icon={<CloseIcon sx={{ fontSize: 22 }} />}
                    hoverColor={CLOSE_HOVER_COLOR}
                    baseColor="rgba(255, 255, 255, 0.18)"
                    borderColor="rgba(255, 255, 255, 0.22)"
                  />
                </Dialog.Close>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'relative',
                flexShrink: 0,
                px: MODAL_MOBILE_PADDING,
                pt: '14px',
                pb: '32px',
                background: author.colorScheme?.gradient || `linear-gradient(216deg, ${author.colorScheme?.primary || '#111'} 0%, black 100%)`,
                overflow: 'hidden',
              }}
            >
                <Box
                  sx={{
                    position: 'absolute',
                    inset: 0,
                    opacity: 0.35,
                  background: author.colorScheme?.primary
                    ? `radial-gradient(circle at 0% 0%, ${alpha(author.colorScheme.primary, 0.55)} 0%, rgba(0, 0, 0, 0) 70%)`
                    : 'radial-gradient(circle at 0% 0%, rgba(233, 36, 154, 0.55) 0%, rgba(0, 0, 0, 0) 70%)',
                  pointerEvents: 'none',
                }}
              />
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: '12px', position: 'relative', zIndex: 1 }}>
                <Box
                  sx={{
                    position: 'relative',
                    width: AVATAR_SIZE,
                    height: AVATAR_SIZE,
                    borderRadius: '50%',
                    overflow: 'hidden',
                    background: avatarGradient,
                    outline: `2px solid ${avatarOutline}`,
                    outlineOffset: '-2px',
                    boxShadow: `0 0 32px ${alpha(author.colorScheme?.primary || '#E9249A', 0.32)}`,
                    flexShrink: 0,
                    mt: '2px',
                  }}
                >
                  {author.image && (
                    <Image
                      src={author.image}
                      alt={author.name}
                      width={AVATAR_SIZE}
                      height={AVATAR_SIZE}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  )}
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: '50%',
                      boxShadow: 'inset 0px -8px 14px rgba(0,0,0,0.35)',
                      pointerEvents: 'none',
                    }}
                  />
                </Box>
                <Box
                  sx={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '2px',
                    mt: '0px',
                  }}
                >
                  <Box
                    sx={{
                      display: 'grid',
                      gridTemplateColumns: 'minmax(0,1fr) auto',
                      alignItems: 'center',
                      columnGap: '10px',
                      width: '100%',
                    }}
                  >
                    <Typography
                      noWrap
                      sx={{
                        fontSize: 19,
                        fontWeight: 700,
                        lineHeight: 1.2,
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {author.name}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        flexShrink: 0,
                      }}
                    >
                      <DropdownMenu.Root open={infoMenuOpen} onOpenChange={setInfoMenuOpen}>
                        <DropdownMenu.Trigger asChild>
                          <ModalActionButton
                            label="Author options"
                            icon={<InfoOutlinedIcon sx={{ fontSize: 20 }} />}
                            hoverColor={alpha(authorActionHoverColor, 0.55)}
                            baseColor={authorActionBaseColor}
                            iconColor="rgba(255,255,255,0.8)"
                            hoverIconColor="rgba(255,255,255,0.95)"
                            pressed={infoMenuOpen}
                            ariaExpanded={infoMenuOpen}
                            ariaHasPopup
                          />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            sideOffset={10}
                            align="end"
                            collisionPadding={12}
                            className="settings-menu-content"
                          >
                            <DropdownMenu.Item
                              className="settings-menu-item"
                              onSelect={event => {
                                event.preventDefault();
                                setInfoMenuOpen(false);
                                setAuthorBioOpen(true);
                              }}
                            >
                              About Author
                            </DropdownMenu.Item>
                            <DropdownMenu.Item
                              className="settings-menu-item"
                              onSelect={event => {
                                event.preventDefault();
                                setInfoMenuOpen(false);
                                setActionSheet('full');
                              }}
                            >
                              Full Commentary
                            </DropdownMenu.Item>
                            <DropdownMenu.Arrow offset={8} className="settings-menu-arrow" />
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                      <DropdownMenu.Root open={settingsMenuOpen} onOpenChange={setSettingsMenuOpen}>
                        <DropdownMenu.Trigger asChild>
                          <ModalActionButton
                            label="Text settings"
                            icon={<SettingsOutlinedIcon sx={{ fontSize: 20 }} />}
                            hoverColor={alpha(authorActionHoverColor, 0.55)}
                            baseColor={authorActionBaseColor}
                            iconColor="rgba(255,255,255,0.8)"
                            hoverIconColor="rgba(255,255,255,0.95)"
                            pressed={settingsMenuOpen || actionSheet === 'settings'}
                            ariaExpanded={settingsMenuOpen}
                            ariaHasPopup
                          />
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Portal>
                          <DropdownMenu.Content
                            sideOffset={10}
                            align="end"
                            collisionPadding={12}
                            className="settings-menu-content"
                          >
                            <DropdownMenu.Item
                              onSelect={event => {
                                event.preventDefault();
                                setSettingsMenuOpen(false);
                                setActionSheet('settings');
                              }}
                              className="settings-menu-item"
                            >
                              Text size
                            </DropdownMenu.Item>
                            <DropdownMenu.Arrow offset={8} className="settings-menu-arrow" />
                          </DropdownMenu.Content>
                        </DropdownMenu.Portal>
                      </DropdownMenu.Root>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                flex: '1 1 auto',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                mt: CONTENT_OFFSET,
                px: 0,
                zIndex: 2,
                minHeight: 0,
              }}
            >
                  <Box
                    sx={{
                      flex: 1,
                      display: 'flex',
                      flexDirection: 'column',
                      borderTopLeftRadius: '21px',
                      borderTopRightRadius: '21px',
                      backgroundColor: 'black',
                      boxShadow: 'none',
                      border: '1px solid rgba(255, 255, 255, 0.06)',
                      overflow: 'hidden',
                      minHeight: 0,
                    }}
                  >
                <Box
                  sx={{
                    px: MODAL_MOBILE_PADDING,
                    pt: '12px',
                    pb: showPrimaryBookmark ? '10px' : '12px',
                    flexShrink: 0,
                  }}
                >
                  {showPrimaryBookmark ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      {isFirstExcerptModern ? (
                        <Tooltip title={<ModernizationTooltip />} arrow placement="right">
                          <Typography
                            sx={{
                              color: TEXT_COLOR_SECONDARY,
                              fontSize: 12,
                              fontWeight: 700,
                              textTransform: 'uppercase',
                              lineHeight: 1,
                              letterSpacing: '0.70px',
                              borderBottom: '1.5px dotted rgba(255, 255, 255, 0.35)',
                              cursor: 'help',
                              pb: '3px',
                            }}
                          >
                            Commentary
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography
                          sx={{
                            color: TEXT_COLOR_SECONDARY,
                            fontSize: 12,
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            lineHeight: 1,
                            letterSpacing: '0.70px',
                          }}
                        >
                          Commentary
                        </Typography>
                      )}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Typography
                        sx={{
                          color: TEXT_COLOR_SECONDARY,
                          fontSize: 12,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          lineHeight: 1,
                          letterSpacing: '0.70px',
                        }}
                      >
                        Commentary
                      </Typography>
                      <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: 12, fontWeight: 500 }}>
                        {currentAuthorCommentaries.length} selections
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Box
                  ref={contentScrollRef}
                  sx={{
                    flex: 1,
                    overflowY: 'auto',
                    WebkitOverflowScrolling: 'touch',
                    px: MODAL_MOBILE_PADDING,
                    pt: 0,
                    pb: `calc(${CONTENT_BOTTOM_GUTTER}px + env(safe-area-inset-bottom, 0px))`,
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      borderRadius: '999px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    scrollbarWidth: 'thin',
                    msOverflowStyle: 'auto',
                    minHeight: 0,
                    '& .commentary-content': {
                      color: TEXT_COLOR_PRIMARY,
                      fontSize: `${scaledCommentaryFontSize}px`,
                      fontWeight: 400,
                      lineHeight: `${scaledCommentaryLineHeight}px`,
                      whiteSpace: 'pre-line',
                      letterSpacing: '-0.01em',
                    },
                    '& .commentary-content sup': {
                      fontSize: `${scaledSupFontSize}px`,
                      fontWeight: 600,
                      color: TEXT_COLOR_SECONDARY,
                      marginRight: '4px',
                    },
                    '& .commentary-content p': {
                      margin: '1em 0',
                    },
                    '& .commentary-content p:first-of-type': {
                      marginTop: 0,
                    },
                    '& .commentary-content p:last-of-type': {
                      marginBottom: 0,
                    },
                    '& .commentary-content ul, & .commentary-content ol': {
                      paddingLeft: '20px',
                      margin: '1em 0',
                    },
                    '& .commentary-content li': {
                      marginBottom: '0.5em',
                    },
                  }}
                >
                  {showPrimaryBookmark ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      {currentAuthorCommentaries[0]?.excerpts.map((excerpt: any) => {
                        const htmlWithLinks = replaceReferenceShortcodes(
                          verseVersion,
                          excerpt.content,
                          currentAuthorCommentaries[0].author.colorScheme,
                        );

                        return (
                          <Box key={excerpt.id}>
                            <ContentWithAds
                              htmlContent={htmlWithLinks}
                              slotId="CONTENT_RESPONSIVE"
                              showPlaceholder={false}
                              className="commentary-content"
                            />
                          </Box>
                        );
                      })}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {currentAuthorCommentaries.map((commentary: any, commentaryIndex: number) => {
                        const isCollapsed = collapsedSections[commentary.id];
                        const commentaryBookmarked = bookmarkedCommentaries.has(commentary.id);
                        const commentaryFirstExcerpt = commentary.excerpts?.[0];

                        return (
                          <Box
                            key={commentary.id}
                            sx={{
                              borderRadius: '18px',
                              border: '1px solid rgba(255, 255, 255, 0.07)',
                              background: 'rgba(255,255,255,0.03)',
                              overflow: 'hidden',
                            }}
                          >
                            <Box
                              onClick={() => toggleSection(commentary.id)}
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '12px',
                                px: '16px',
                                py: '14px',
                                cursor: 'pointer',
                                transition: 'background 0.2s ease',
                                '&:hover': {
                                  background: 'rgba(255,255,255,0.04)',
                                },
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
                                <KeyboardArrowDownIcon
                                  sx={{
                                    fontSize: 18,
                                    color: TEXT_COLOR_SECONDARY,
                                    transform: isCollapsed ? 'rotate(-90deg)' : 'rotate(0deg)',
                                    transition: 'transform 0.25s ease',
                                
                                  }}
                                />
                                <Typography
                                  sx={{
                                    color: TEXT_COLOR_SECONDARY,
                                    fontSize: 12,
                                    fontWeight: 700,
                                    textTransform: 'uppercase',
                                    letterSpacing: '0.70px',
                                  }}
                                >
                                  Commentary #{commentaryIndex + 1}
                                </Typography>
                                {commentaryFirstExcerpt?.type === 'Modern' && (
                                  <MuiTooltip title={<ModernizationTooltip />} placement="bottom" arrow>
                                    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center' }}>
                                      <InfoOutlinedIcon sx={{ fontSize: 14, color: TEXT_COLOR_SECONDARY }} />
                                    </Box>
                                  </MuiTooltip>
                                )}
                              </Box>
                              <IconButton
                                onClick={event => {
                                  event.stopPropagation();
                                  handleBookmarkClick(commentary.id);
                                }}
                                size="small"
                                sx={{
                                  color: commentaryBookmarked ? BOOKMARK_COLOR : TEXT_COLOR_SECONDARY,
                                  p: 0.5,
                                  '&:hover': {
                                    color: commentaryBookmarked ? BOOKMARK_COLOR : TEXT_COLOR_PRIMARY,
                                  },
                                }}
                              >
                                {commentaryBookmarked ? (
                                  <BookmarkIcon sx={{ fontSize: 18 }} />
                                ) : (
                                  <BookmarkBorderIcon sx={{ fontSize: 18 }} />
                                )}
                              </IconButton>
                            </Box>
                            {!isCollapsed && (
                              <Box
                                sx={{
                                  px: '16px',
                                  pb: '16px',
                                  pt: '4px',
                                  display: 'flex',
                                  flexDirection: 'column',
                                  gap: '16px',
                                }}
                              >
                                {commentary.excerpts.map((excerpt: any) => {
                                  const htmlWithLinks = replaceReferenceShortcodes(
                                    verseVersion,
                                    excerpt.content,
                                    commentary.author.colorScheme,
                                  );

                                  return (
                                    <ContentWithAds
                                      key={excerpt.id}
                                      htmlContent={htmlWithLinks}
                                      slotId="CONTENT_RESPONSIVE"
                                      showPlaceholder={false}
                                      className="commentary-content"
                                    />
                                  );
                                })}
                              </Box>
                            )}
                          </Box>
                        );
                      })}
                    </Box>
                  )}

                  <Box sx={{ mt: '32px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <Typography
                      sx={{
                        color: TEXT_COLOR_SECONDARY,
                        fontSize: 14,
                        fontWeight: 500,
                        lineHeight: '21px',
                      }}
                    >
                      Source:{' '}
                      <Box component="span" sx={{ fontStyle: 'italic' }}>
                        {currentCommentary.source}
                      </Box>
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

            <Box
              sx={{
                position: 'relative',
                flexShrink: 0,
                pt: '18px',
                pb: `calc(18px + env(safe-area-inset-bottom, 0px))`,
                px: MODAL_MOBILE_PADDING,
              }}
            >
              <Box
                sx={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <Box
                  component={Primitive.button}
                  type="button"
                  onClick={handlePrevious}
                  disabled={!prevAuthor}
                  aria-label="Previous commentator"
                  sx={{
                    width: 92,
                    height: 44,
                    borderRadius: '22px',
                    background: prevAuthor ? prevNavBackground : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: prevAuthor ? 'pointer' : 'not-allowed',
                    boxShadow: prevAuthor ? '0 8px 18px rgba(0,0,0,0.35)' : 'none',
                    transition: 'background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    '@media (hover: hover)': {
                      '&:hover': {
                        background: prevAuthor ? prevNavHoverBackground : 'rgba(255,255,255,0.06)',
                        boxShadow: prevAuthor ? '0 12px 24px rgba(0,0,0,0.45)' : 'none',
                        transform: prevAuthor ? 'translateY(-1px)' : 'none',
                      },
                    },
                    '&:active': {
                      transform: prevAuthor ? 'scale(0.92)' : 'none',
                      background: prevAuthor
                        ? alpha(prevNavHoverBackground, 1)
                        : 'rgba(255,255,255,0.06)',
                      boxShadow: prevAuthor ? '0 10px 22px rgba(0,0,0,0.5)' : 'none',
                    },
                    '&:disabled': {
                      opacity: 0.3,
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: '2px solid rgba(255, 255, 255, 0.4)',
                      outlineOffset: '3px',
                    },
                  }}
                >
                  <ArrowBackIcon
                    sx={{
                      fontSize: 22,
                      color: prevAuthor ? prevNavIconColor : 'rgba(255,255,255,0.2)',
                    }}
                  />
                </Box>

                <Box
                  component={Primitive.button}
                  type="button"
                  onClick={handleNext}
                  disabled={!nextAuthor}
                  aria-label="Next commentator"
                  sx={{
                    width: 92,
                    height: 44,
                    borderRadius: '22px',
                    background: nextAuthor ? nextNavBackground : 'rgba(255,255,255,0.06)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    position: 'relative',
                    cursor: nextAuthor ? 'pointer' : 'not-allowed',
                    boxShadow: nextAuthor ? '0 8px 18px rgba(0,0,0,0.35)' : 'none',
                    transition: 'background-color 0.18s ease, transform 0.18s ease, box-shadow 0.18s ease',
                    touchAction: 'manipulation',
                    WebkitTapHighlightColor: 'transparent',
                    '@media (hover: hover)': {
                      '&:hover': {
                        background: nextAuthor ? nextNavHoverBackground : 'rgba(255,255,255,0.06)',
                        boxShadow: nextAuthor ? '0 12px 24px rgba(0,0,0,0.45)' : 'none',
                        transform: nextAuthor ? 'translateY(-1px)' : 'none',
                      },
                    },
                    '&:active': {
                      transform: nextAuthor ? 'scale(0.92)' : 'none',
                      background: nextAuthor
                        ? alpha(nextNavHoverBackground, 1)
                        : 'rgba(255,255,255,0.06)',
                      boxShadow: nextAuthor ? '0 10px 22px rgba(0,0,0,0.5)' : 'none',
                    },
                    '&:disabled': {
                      opacity: 0.3,
                      boxShadow: 'none',
                    },
                    '&:focus-visible': {
                      outline: '2px solid rgba(255, 255, 255, 0.4)',
                      outlineOffset: '3px',
                    },
                  }}
                >
                  <ArrowForwardIcon
                    sx={{
                      fontSize: 22,
                      color: nextAuthor ? nextNavIconColor : 'rgba(255,255,255,0.2)',
                    }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
            </motion.div>
          </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

      <BookmarkPromoModal
        open={bookmarkPromoOpen}
        onClose={() => setBookmarkPromoOpen(false)}
        onUpgrade={() => setBookmarkPromoOpen(false)}
      />

      <AuthorBioModal
        open={authorBioOpen}
        onClose={() => setAuthorBioOpen(false)}
        author={author}
      />

      <Dialog.Root
        open={Boolean(actionSheet)}
        onOpenChange={openState => {
          if (!openState) {
            setActionSheet(null);
            setSettingsMenuOpen(false);
          }
        }}
      >
        <AnimatePresence>
          {actionSheet && (
            <Dialog.Portal forceMount>
              <Dialog.Overlay asChild>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    zIndex: 1401,
                    backgroundColor: 'rgba(0,0,0,0.55)',
                  }}
                />
              </Dialog.Overlay>
              <Dialog.Content asChild>
                <motion.div
                  key={actionSheet}
                  initial={{ opacity: 0, y: 60 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 60 }}
                  transition={{ duration: 0.25, ease: [0.25, 0.46, 0.45, 0.94] }}
                  style={{
                    position: 'fixed',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: 1402,
                    display: 'flex',
                    justifyContent: 'center',
                    pointerEvents: 'none',
                  }}
                >
                  <Box sx={{ width: '100%', maxWidth: 520, px: '16px', pb: '16px', pointerEvents: 'auto' }}>
                    <Box
                      sx={{
                        backgroundColor: '#0E0E0E',
                        borderRadius: '24px 24px 0 0',
                        border: '1px solid rgba(255,255,255,0.08)',
                        boxShadow: '0 -12px 32px rgba(0,0,0,0.45)',
                        color: TEXT_COLOR_PRIMARY,
                        fontFamily: FONT_FAMILY,
                        px: '22px',
                        pt: '20px',
                        pb: `calc(20px + env(safe-area-inset-bottom, 0px))`,
                      }}
                    >
                      {actionSheet === 'settings' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '16px' }}>
                            <Dialog.Title asChild>
                              <Typography sx={{ fontSize: 17, fontWeight: 600 }}>Text size</Typography>
                            </Dialog.Title>
                            <Dialog.Close asChild>
                              <IconButton
                                size="small"
                                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                              >
                                <CloseIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Dialog.Close>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px', mb: '12px' }}>
                            <Typography sx={{ fontSize: 12, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>A</Typography>
                            <Slider
                              size="small"
                              value={fontScaleStep}
                              onChange={handleFontScaleChange}
                              min={ADAPTIVE_FONT_SCALE_MIN_STEP}
                              max={ADAPTIVE_FONT_SCALE_MAX_STEP}
                              step={0.25}
                              marks={[
                                { value: ADAPTIVE_FONT_SCALE_MIN_STEP },
                                { value: ADAPTIVE_FONT_SCALE_DEFAULT_STEP },
                                { value: 0 },
                                { value: 1 },
                                { value: ADAPTIVE_FONT_SCALE_MAX_STEP },
                              ]}
                              sx={{
                                flexGrow: 1,
                                color: author.colorScheme?.primary || '#E9249A',
                                '& .MuiSlider-rail': {
                                  opacity: 0.2,
                                  backgroundColor: 'rgba(255,255,255,0.2)',
                                },
                                '& .MuiSlider-track': {
                                  border: 'none',
                                },
                                '& .MuiSlider-mark': {
                                  width: 4,
                                  height: 4,
                                  borderRadius: '50%',
                                  backgroundColor: 'rgba(255,255,255,0.25)',
                                  '&.MuiSlider-markActive': {
                                    backgroundColor: 'currentColor',
                                    opacity: 0.45,
                                  },
                                },
                                '& .MuiSlider-thumb': {
                                  width: 14,
                                  height: 14,
                                  backgroundColor: '#fff',
                                  '&::before': {
                                    boxShadow: 'none',
                                  },
                                },
                              }}
                            />
                            <Typography sx={{ fontSize: 18, fontWeight: 500, color: 'rgba(255,255,255,0.75)' }}>A</Typography>
                          </Box>
                          <Box sx={{ display: 'flex', justifyContent: 'center', mt: '8px' }}>
                            <Box
                              component={Primitive.button}
                              type="button"
                              onClick={handleResetFontScale}
                              disabled={fontScaleStep === ADAPTIVE_FONT_SCALE_DEFAULT_STEP}
                              sx={{
                                border: 'none',
                                background: 'none',
                                color: fontScaleStep === ADAPTIVE_FONT_SCALE_DEFAULT_STEP ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.65)',
                                fontSize: 13,
                                fontWeight: 500,
                                cursor: fontScaleStep === ADAPTIVE_FONT_SCALE_DEFAULT_STEP ? 'default' : 'pointer',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                transition: 'all 0.2s ease',
                                opacity: fontScaleStep === ADAPTIVE_FONT_SCALE_DEFAULT_STEP ? 0.7 : 1,
                                '@media (hover: hover)': {
                                  '&:hover': {
                                    backgroundColor: fontScaleStep === ADAPTIVE_FONT_SCALE_DEFAULT_STEP ? 'none' : 'rgba(255,255,255,0.08)',
                                    color: fontScaleStep === ADAPTIVE_FONT_SCALE_DEFAULT_STEP ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.92)',
                                  },
                                },
                                '&:focus-visible': {
                                  outline: '2px solid rgba(255,255,255,0.35)',
                                  outlineOffset: '3px',
                                },
                              }}
                            >
                              Reset to default
                            </Box>
                          </Box>
                        </>
                      )}

                      {actionSheet === 'full' && (
                        <>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: '12px' }}>
                            <Dialog.Title asChild>
                              <Typography sx={{ fontSize: 17, fontWeight: 600 }}>Open full commentary?</Typography>
                            </Dialog.Title>
                            <Dialog.Close asChild>
                              <IconButton
                                size="small"
                                sx={{ color: 'rgba(255,255,255,0.7)', '&:hover': { color: 'white' } }}
                              >
                                <CloseIcon sx={{ fontSize: 20 }} />
                              </IconButton>
                            </Dialog.Close>
                          </Box>
                          <Dialog.Description asChild>
                            <Typography sx={{ fontSize: 14, lineHeight: 1.6, color: 'rgba(255,255,255,0.75)' }}>
                              Continue to {author.name}'s commentary for{' '}
                              <Box component="span" sx={{ fontWeight: 600, color: 'rgba(255,255,255,0.92)' }}>
                                {referenceData ? `${slugToBookName(referenceData.bookSlug)} ${referenceData.chapter}` : currentReference}
                              </Box>{' '}
                              in a full-page view.
                            </Typography>
                          </Dialog.Description>
                          <Box sx={{ display: 'flex', gap: '12px', mt: '22px' }}>
                            <Dialog.Close asChild>
                              <Box
                                component={Primitive.button}
                                type="button"
                                sx={{
                                  flex: 1,
                                  borderRadius: '14px',
                                  border: '1px solid rgba(255,255,255,0.12)',
                                  backgroundColor: 'rgba(255,255,255,0.08)',
                                  color: 'rgba(255,255,255,0.85)',
                                  fontSize: 15,
                                  fontWeight: 500,
                                  padding: '12px 0',
                                  cursor: 'pointer',
                                  transition: 'all 0.2s ease',
                                  '@media (hover: hover)': {
                                    '&:hover': {
                                      backgroundColor: 'rgba(255,255,255,0.12)',
                                    },
                                  },
                                  '&:focus-visible': {
                                    outline: '2px solid rgba(255,255,255,0.35)',
                                    outlineOffset: '3px',
                                  },
                                }}
                              >
                                Go Back
                              </Box>
                            </Dialog.Close>
                            <Box
                              component={Primitive.button}
                              type="button"
                              onClick={handleContinueToFullCommentary}
                              disabled={isFullCommentaryPending}
                              aria-busy={isFullCommentaryPending ? 'true' : undefined}
                              sx={{
                                flex: 1,
                                borderRadius: '14px',
                                border: 'none',
                                backgroundColor: author.colorScheme?.chipBackground || SHARE_HOVER_COLOR,
                                color: '#fff',
                                fontSize: 15,
                                fontWeight: 600,
                                padding: '12px 0',
                                cursor: isFullCommentaryPending ? 'not-allowed' : 'pointer',
                                transition: 'background-color 0.2s ease, opacity 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 8,
                                opacity: isFullCommentaryPending ? 0.7 : 1,
                                '@media (hover: hover)': {
                                  '&:hover': !isFullCommentaryPending ? {
                                    backgroundColor: alpha(author.colorScheme?.chipBackground || SHARE_HOVER_COLOR, 0.85),
                                  } : {},
                                },
                                '&:focus-visible': {
                                  outline: '2px solid rgba(255,255,255,0.35)',
                                  outlineOffset: '3px',
                                },
                              }}
                            >
                              {isFullCommentaryPending ? (
                                <CircularProgress size={18} thickness={4} sx={{ color: '#fff' }} />
                              ) : null}
                              <Typography component="span" sx={{ fontSize: 15, fontWeight: 600 }}>
                                Continue
                              </Typography>
                            </Box>
                          </Box>
                        </>
                      )}
                    </Box>
                  </Box>
                </motion.div>
              </Dialog.Content>
            </Dialog.Portal>
          )}
        </AnimatePresence>
      </Dialog.Root>

    </>
  );
}
