import React, { useState, useRef, useEffect, useCallback, useMemo, useTransition } from 'react';
import {
  Box,
  Typography,
  Slider,
  CircularProgress,
} from '@mui/material';
import { Tooltip } from '@/components/ui';
import { alpha } from '@mui/material/styles';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import * as Dialog from '@radix-ui/react-dialog';
import { Primitive } from '@radix-ui/react-primitive';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import * as Popover from '@radix-ui/react-popover';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { ArrowBackIcon } from '@/components/ui/phosphor-icons';
import { InfoOutlinedIcon } from '@/components/ui/phosphor-icons';
import { InfoIcon } from '@/components/ui/phosphor-icons';
import { ParagraphIcon } from '@/components/ui/phosphor-icons';
import { lighten, desaturate } from 'color2k';
import { replaceReferenceShortcodes, slugToBookName } from '@/utils/stringHelpers';
import { useBibleVerseRange, extractVerseRangeFromSlug, extractBookChapterFromSlug } from '@/hooks/useBibleVerseRange';
import VerticalAd from '@/components/ads/VerticalAd';
import { refreshModalAds } from '@/utils/adUtils';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { useCreateBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { toast } from 'react-toastify';
import ModernizationTooltip from './ModernizationTooltip';
import { CustomChip } from '@/components/ui';
import AuthorBioModal from '@/components/author/AuthorBioModal';
import {
  useAdaptiveFontScale,
  ADAPTIVE_FONT_SCALE_DEFAULT_STEP,
  ADAPTIVE_FONT_SCALE_MIN_STEP,
  ADAPTIVE_FONT_SCALE_MAX_STEP,
} from '@/hooks/useAdaptiveFontScale';
import { formatCenturyFromYear } from '@/utils/century';
import { textStyles, fontFamilies, type TextStyle } from '@/styles/textStyles';

interface CommentaryModalProps {
  open: boolean;
  onClose: () => void;
  initialCommentaryId: string | null;
  reference: string;
  commentaries: any;
  verseContent: string;
  verseVersion: string;
}

const FONT_FAMILY = fontFamilies.body;
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249.70, 249.70, 0.60)';
const FADE_HEIGHT = '35px';
const HOVER_LIGHTEN_AMOUNT = 0.08;
const HOVER_DESATURATE_AMOUNT = 0.1;
const ICON_BOX_SIZE = 36;
const ICON_BOX_BACKGROUND = 'rgba(255, 255, 255, 0.10)';
const ICON_BOX_TEXT = 'rgba(255, 255, 255, 0.8)';
const SHARE_HOVER_COLOR = '#4A9EFF';
const BOOKMARK_HOVER_COLOR = '#FF8C3A';
const CLOSE_HOVER_COLOR = '#FF4D57';

const withoutParagraphSpacing = ({ paragraphSpacing, ...style }: TextStyle) => style;
const headingMediumStyle = withoutParagraphSpacing(textStyles.heading.medium.m);
const labelEyebrowStyle = withoutParagraphSpacing(textStyles.label.eyebrow.s);
const bodyLargeStyle = withoutParagraphSpacing(textStyles.body.regular.l);

const getHoverShadow = (color: string) => {
  try {
    return `0px 12px 26px ${alpha(color, 0.35)}`;
  } catch (error) {
    return 'none';
  }
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
  loading?: boolean;
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
      onClick,
      onMouseDown,
      loading = false,
      ...primitiveProps
    },
    ref,
  ) => {
    const resolvedBaseColor = baseColor ?? ICON_BOX_BACKGROUND;
    const resolvedHoverIcon = hoverIconColor ?? 'rgba(255, 255, 255, 0.95)';
    const resolvedIconColor = active ? resolvedHoverIcon : iconColor ?? ICON_BOX_TEXT;
    const isLoading = Boolean(loading);
    const isDisabled = disabled || isLoading;
    const spinnerColor = active ? resolvedHoverIcon : resolvedIconColor;
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
        aria-label={label}
        aria-pressed={active ? 'true' : 'false'}
        aria-disabled={isDisabled ? 'true' : undefined}
        aria-busy={isLoading ? 'true' : undefined}
        data-state={active ? 'active' : 'inactive'}
        disabled={isDisabled}
        tabIndex={-1}
        onClick={event => {
          if (isDisabled) {
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
          borderRadius: '10px',
          backgroundColor: active ? hoverColor : resolvedBaseColor,
          color: resolvedIconColor,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: text ? '6px' : 0,
          pl: text ? '8px' : 0,
          pr: text ? '10px' : 0,
          transition: 'transform 0.25s ease, background-color 0.25s ease, color 0.25s ease',
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          position: 'relative',
          boxShadow: 'none',
          pointerEvents: isDisabled ? 'none' : 'auto',
          font: 'inherit',
          '& > svg': {
            fontSize: text ? 20 : 24,
          },
          '@media (hover: hover)': {
            '&:hover': !isDisabled ? {
              backgroundColor: hoverColor,
              color: resolvedHoverIcon,
            } : {},
          },
          '&:focus-visible': {
            outline: '2px solid rgba(255, 255, 255, 0.55)',
            outlineOffset: '4px',
          },
          '&:active': {
            transform: isDisabled ? 'none' : `scale(${text ? 0.95 : 0.9})`,
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

const buildAuthorBadges = (author: any, commentaryTags?: string[]): string[] => {
  if (commentaryTags && commentaryTags.length > 0) {
    return commentaryTags;
  }

  const badges: string[] = [];
  if (author?.religiousTradition) badges.push(author.religiousTradition);
  if (author?.occupation) badges.push(author.occupation);
  if (author?.nationality) badges.push(author.nationality);
  if (author?.birthYear) {
    const century = formatCenturyFromYear(author.birthYear);
    if (century && !badges.includes(century)) {
      badges.push(century);
    }
  }
  return badges;
};

const getLastName = (name?: string) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  return parts[parts.length - 1] || name;
};

export default function CommentaryModalDesktop({
  open,
  onClose,
  initialCommentaryId,
  reference,
  commentaries,
  verseContent,
  verseVersion
}: CommentaryModalProps) {
  const { user } = useUser();
  const router = useRouter();
  const isPremium = usePremium();
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [selectedCommentaryIndex, setSelectedCommentaryIndex] = useState<number>(0);
  const [bookmarkedCommentaries, setBookmarkedCommentaries] = useState<Set<string>>(new Set());
  const [fontPopoverOpen, setFontPopoverOpen] = useState<boolean>(false);
  const {
    fontScaleStep,
    fontScale,
    setFontScaleStep: setSharedFontScaleStep,
    resetFontScaleStep: resetSharedFontScaleStep,
  } = useAdaptiveFontScale();
  const isFontPopoverOpen = fontPopoverOpen;
  const tagsContainerRef = useRef<HTMLDivElement | null>(null);
  const tagsContentRef = useRef<HTMLDivElement | null>(null);
  const [shouldScrollTags, setShouldScrollTags] = useState<boolean>(false);
  const [tagsScrollDistance, setTagsScrollDistance] = useState<number>(0);
  
  const commentaryScrollRef = useRef<HTMLDivElement | null>(null);
  const verseScrollRef = useRef<HTMLDivElement | null>(null);
  const modalContentRef = useRef<HTMLDivElement | null>(null);
  const [commentaryCanScroll, setCommentaryCanScroll] = useState<boolean>(true);
  const [verseCanScroll, setVerseCanScroll] = useState<boolean>(true);
  const [commentaryScrolledToBottom, setCommentaryScrolledToBottom] = useState<boolean>(false);
  const [verseScrolledToBottom, setVerseScrolledToBottom] = useState<boolean>(false);
  const [isPrevHovered, setIsPrevHovered] = useState<boolean>(false);
  const [isNextHovered, setIsNextHovered] = useState<boolean>(false);
  const [adRefreshVersion, setAdRefreshVersion] = useState<number>(0);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState<boolean>(false);
  const [authorBioOpen, setAuthorBioOpen] = useState<boolean>(false);
  const { createBookmark } = useCreateBookmark();
  const [isChapterNavigationPending, startChapterNavigation] = useTransition();

  const handleBookmark = async (commentaryId: string) => {
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

  const handleCloseFontPopover = useCallback(() => {
    setFontPopoverOpen(false);
  }, []);

  const handleFontPopoverOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (nextOpen) {
        setFontPopoverOpen(true);
      } else {
        handleCloseFontPopover();
      }
    },
    [handleCloseFontPopover, setFontPopoverOpen],
  );

  const handleDismissRequest = useCallback(() => {
    if (isFontPopoverOpen) {
      handleCloseFontPopover();
      return;
    }
    onClose();
  }, [isFontPopoverOpen, handleCloseFontPopover, onClose]);

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

  const checkScrollability = useCallback(() => {
    let commCanScroll = false; let commIsBottom = true;
    if (commentaryScrollRef.current) { const { scrollHeight, clientHeight, scrollTop } = commentaryScrollRef.current; commCanScroll = scrollHeight > clientHeight; commIsBottom = !commCanScroll || Math.abs(scrollHeight - clientHeight - scrollTop) < 5; }
    setCommentaryCanScroll(commCanScroll); setCommentaryScrolledToBottom(commIsBottom);
    let vsCanScroll = false; let vsIsBottom = true;
    if (verseScrollRef.current) { const { scrollHeight, clientHeight, scrollTop } = verseScrollRef.current; vsCanScroll = scrollHeight > clientHeight; vsIsBottom = !vsCanScroll || Math.abs(scrollHeight - clientHeight - scrollTop) < 5; }
    setVerseCanScroll(vsCanScroll); setVerseScrolledToBottom(vsIsBottom);
  }, []);

  const resetScrollStates = useCallback(() => {
    if (commentaryScrollRef.current) commentaryScrollRef.current.scrollTop = 0;
    if (verseScrollRef.current) verseScrollRef.current.scrollTop = 0;
    checkScrollability();
  }, [checkScrollability]);

  const handleScroll = useCallback((type: 'commentary' | 'verse') => {
    if (type === 'commentary' && commentaryScrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = commentaryScrollRef.current;
      setCommentaryScrolledToBottom(Math.abs(scrollHeight - clientHeight - scrollTop) < 5);
    } else if (type === 'verse' && verseScrollRef.current) {
      const { scrollHeight, clientHeight, scrollTop } = verseScrollRef.current;
      setVerseScrolledToBottom(Math.abs(scrollHeight - clientHeight - scrollTop) < 5);
    }
  }, []);

  useEffect(() => {
    const initialIndex = commentaries.findIndex(comm => comm.id === initialCommentaryId);
    setCurrentIndex(initialIndex >= 0 ? initialIndex : 0);
  }, [initialCommentaryId, commentaries, open]);

  // Refresh ads when navigating between commentaries
  useEffect(() => {
    if (open) {
      setAdRefreshVersion(prev => prev + 1);
      refreshModalAds();
    }
  }, [currentIndex, open]);

  useEffect(() => {
    resetScrollStates();
    const frame = window.requestAnimationFrame(checkScrollability);
    return () => window.cancelAnimationFrame(frame);
  }, [currentIndex, resetScrollStates, checkScrollability]);

  useEffect(() => {
    if (!open) {
      return;
    }

    checkScrollability();
    const frame = window.requestAnimationFrame(checkScrollability);
    return () => window.cancelAnimationFrame(frame);
  }, [open, checkScrollability]);


  const currentCommentary = commentaries[currentIndex];
  const author = currentCommentary.author;
  const authorBadges = useMemo(
    () => buildAuthorBadges(author, currentCommentary.tags),
    [author, currentCommentary.tags]
  );
  const chipBackground = author.colorScheme?.chipBackground || 'rgba(233, 36, 154, 0.30)';
  const chipTextColor = author.colorScheme?.chipText || '#FF72C6';
  const authorProfileUrl = `/commentators/${author.slug}`;
  const avatarOutline = author.colorScheme?.outline || 'rgba(233, 36, 154, 0.35)';
  const avatarGradient = author.colorScheme?.primary
    ? `linear-gradient(216deg, ${author.colorScheme.primary} 0%, black 100%)`
    : 'linear-gradient(216deg, #E9249A 0%, black 100%)';
  const authorActionBaseColor = useMemo(() => bumpOpacity(chipBackground, -0.1), [chipBackground]);
  const authorActionHoverColor = useMemo(() => getHoverColor(authorActionBaseColor, chipBackground), [authorActionBaseColor, chipBackground]);
  const tagsAnimationDuration = useMemo(() => {
    if (!shouldScrollTags || tagsScrollDistance <= 0) {
      return 0;
    }
    const base = Math.max(tagsScrollDistance / 32, 14);
    return Math.min(base, 32);
  }, [shouldScrollTags, tagsScrollDistance]);
  const baseCommentaryFontSize = 20;
  const baseCommentaryLineHeight = 30;
  const baseVerseFontSize = 18;
  const baseVerseLineHeight = 27;
  const baseSupFontSize = 12;
  const scaledCommentaryFontSize = baseCommentaryFontSize * fontScale;
  const scaledCommentaryLineHeight = baseCommentaryLineHeight * fontScale;
  const scaledVerseFontSize = baseVerseFontSize * fontScale;
  const scaledVerseLineHeight = baseVerseLineHeight * fontScale;
  const scaledSupFontSize = baseSupFontSize * fontScale;

  useEffect(() => {
    if (!open) {
      setShouldScrollTags(false);
      setTagsScrollDistance(0);
      setFontPopoverOpen(false);
      return;
    }

    const evaluateOverflow = () => {
      if (!tagsContainerRef.current || !tagsContentRef.current) {
        setShouldScrollTags(false);
        setTagsScrollDistance(0);
        return;
      }

      const containerWidth = tagsContainerRef.current.getBoundingClientRect().width;
      const contentWidth = tagsContentRef.current.scrollWidth;
      const overflow = contentWidth - containerWidth;
      const needsScroll = overflow > 10;
      setShouldScrollTags(needsScroll);
      setTagsScrollDistance(needsScroll ? overflow : 0);
    };

    const timer = window.setTimeout(evaluateOverflow, 120);
    evaluateOverflow();
    window.addEventListener('resize', evaluateOverflow);

    return () => {
      window.clearTimeout(timer);
      window.removeEventListener('resize', evaluateOverflow);
    };
  }, [open, currentCommentary?.id, authorBadges.length]);

  useEffect(() => {
    setFontPopoverOpen(false);
  }, [currentIndex]);

  // Track if we're programmatically updating the URL to prevent loops
  const updatingUrlRef = useRef(false);

  // Handle URL anchor on mount and cleanup on close
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (open) {
        // Add anchor when modal opens or author changes
        const anchor = `#${author.name.replace(/\s+/g, '-').toLowerCase()}`;
        updatingUrlRef.current = true;
        window.history.replaceState(null, '', window.location.pathname + anchor);
        // Reset flag after a short delay to allow for any potential hashchange events
        setTimeout(() => {
          updatingUrlRef.current = false;
        }, 10);
      } else {
        // Remove anchor when modal closes
        if (window.location.hash) {
          updatingUrlRef.current = true;
          window.history.replaceState(null, '', window.location.pathname);
          setTimeout(() => {
            updatingUrlRef.current = false;
          }, 10);
        }
      }
    }
  }, [open, author]);
  
  // Extract verse range from current commentary slug
  const verseRange = currentCommentary.slug ? extractVerseRangeFromSlug(currentCommentary.slug) : null;
  const bookChapter = currentCommentary.slug ? extractBookChapterFromSlug(currentCommentary.slug) : null;

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
  
  // Fetch verse content for the current commentary's range
  const { data: verseRangeData, isLoading: isVerseLoading } = useBibleVerseRange(
    bookChapter?.bookSlug || '',
    bookChapter?.chapter || 0,
    verseRange || '1',
    verseVersion
  );
  
  // Use enhanced verse content if available, otherwise fall back to original
  const enhancedVerseContent = verseRangeData?.content || verseContent;

  // Determine if showing single verse or multiple verses
  const verseHeaderText = verseRange?.includes('-') ? 'Verses' : 'Verse';

  // Group commentaries by author
  const currentAuthorCommentaries = commentaries.filter(comm => comm.author.id === author.id);
  
  const uniqueAuthors = useMemo(() => {
    const list: any[] = [];
    const seen = new Set();
    commentaries.forEach((commentary: any, index: number) => {
      if (!seen.has(commentary.author.id)) {
        seen.add(commentary.author.id);
        list.push({
          author: commentary.author,
          firstIndex: index
        });
      }
    });
    return list;
  }, [commentaries]);
  const currentAuthorIndex = uniqueAuthors.findIndex(item => item.author.id === author.id);
  
  // Handle hashchange events while modal is open
  useEffect(() => {
    if (!open) return;

    const handleHashChange = () => {
      // Ignore hashchange events if we're programmatically updating the URL
      if (updatingUrlRef.current) return;
      
      const hash = window.location.hash.slice(1); // Remove #
      
      // Check if hash is for verse-takeaways - if so, close this modal
      if (hash === 'verse-takeaways') {
        onClose();
        return;
      }
      
      // If hash is empty and we're in a commentary modal, close it
      if (!hash) {
        onClose();
        return;
      }

      // Convert hash back to author name (hyphenated to spaces)
      const targetAuthorName = hash.replace(/-/g, ' ');
      
      // Find the author that matches the hash
      const targetAuthorIndex = uniqueAuthors.findIndex(item => 
        item.author.name.toLowerCase() === targetAuthorName.toLowerCase()
      );
      
      // Get current author index at the time of the event
      const currentAuthorIdx = uniqueAuthors.findIndex(item => item.author.id === author.id);
      
      if (targetAuthorIndex !== -1 && targetAuthorIndex !== currentAuthorIdx) {
        const targetCommentaryIndex = uniqueAuthors[targetAuthorIndex].firstIndex;
        setCurrentIndex(targetCommentaryIndex);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [open, uniqueAuthors, author.id, onClose]); // Add onClose to deps
  
  // Reset selected commentary index when author changes
  useEffect(() => {
    setSelectedCommentaryIndex(0);
  }, [currentIndex]);
  
  // Find previous and next authors
  const prevAuthorIndex = currentAuthorIndex > 0 ? currentAuthorIndex - 1 : -1;
  const nextAuthorIndex = currentAuthorIndex < uniqueAuthors.length - 1 ? currentAuthorIndex + 1 : -1;

  const prevAuthor = (prevAuthorIndex !== -1 && uniqueAuthors[prevAuthorIndex]) ? uniqueAuthors[prevAuthorIndex].author : null;
  const nextAuthor = (nextAuthorIndex !== -1 && uniqueAuthors[nextAuthorIndex]) ? uniqueAuthors[nextAuthorIndex].author : null;
  const navFallbackBackground = 'rgba(255, 255, 255, 0.08)';
  const prevNavBackground = bumpOpacity(prevAuthor?.colorScheme?.chipBackground || navFallbackBackground, 0.1);
  const nextNavBackground = bumpOpacity(nextAuthor?.colorScheme?.chipBackground || navFallbackBackground, 0.1);
  const prevNavIconColor = prevAuthor?.colorScheme?.chipText || 'rgba(255, 255, 255, 0.85)';
  const nextNavIconColor = nextAuthor?.colorScheme?.chipText || 'rgba(255, 255, 255, 0.85)';
  const prevNavHoverBackground = prevAuthor ? getHoverColor(prevNavBackground, prevNavBackground) : prevNavBackground;
  const nextNavHoverBackground = nextAuthor ? getHoverColor(nextNavBackground, nextNavBackground) : nextNavBackground;
  
  // Get the commentary indices for navigation
  const prevCommentaryIndex = prevAuthorIndex !== -1 ? uniqueAuthors[prevAuthorIndex].firstIndex : -1;
  const nextCommentaryIndex = nextAuthorIndex !== -1 ? uniqueAuthors[nextAuthorIndex].firstIndex : -1;
  

  const handlePrevious = useCallback(() => {
    if (prevCommentaryIndex === -1) {
      return;
    }
    setCurrentIndex(prevCommentaryIndex);
    refreshModalAds();
  }, [prevCommentaryIndex]);

  const handleNext = useCallback(() => {
    if (nextCommentaryIndex === -1) {
      return;
    }
    setCurrentIndex(nextCommentaryIndex);
    refreshModalAds();
  }, [nextCommentaryIndex]);

  const handleShare = async () => {
    const shareUrl = generateShareUrl();
    if (!shareUrl) {
      toast.error('Unable to generate share link');
      return;
    }
    
    if (navigator.share) {
      try {
        await navigator.share({
          url: shareUrl,
        });
      } catch (err) {
        // Fallback to clipboard if share is cancelled
        if ((err as Error).name !== 'AbortError') {
          handleCopyLink(shareUrl);
        }
      }
    } else {
      handleCopyLink(shareUrl);
    }
  };

  const handleCopyLink = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  };
  


  if (!currentCommentary || !author) return null;

  // Parse verse reference from commentary slug to get the dynamic reference for current commentary
  const getCurrentReference = () => {
    const parts = currentCommentary.slug?.split('/');
    const bookSlug = parts?.[4] ?? '';
    const chapter = parts?.[5] ?? '';
    const versePart = parts?.[6] ?? '';

    const book = slugToBookName(bookSlug);

    const formatted = versePart.includes('-')
      ? `${book} ${chapter}:${versePart.split('-')[0]}–${versePart.split('-')[1]}`
      : `${book} ${chapter}:${versePart}`;

    return formatted;
  };

  const currentReference = getCurrentReference();

  // Parse reference to extract book and chapter for the URL
  const parseReference = (reference: string) => {
    // Handle references like "Matthew 3:12" or "1 John 2:5"
    const match = reference.match(/^(.+?)\s+(\d+):(\d+)$/);
    if (match) {
      const bookName = match[1].trim();
      const chapter = match[2];
      // Convert book name to slug format (lowercase, spaces to hyphens)
      const bookSlug = bookName.toLowerCase().replace(/\s+/g, '-');
      return { bookSlug, chapter };
    }
    return null;
  };

  const referenceData = parseReference(reference);
  const chapterUrl = bookChapter?.bookSlug && bookChapter?.chapter
    ? `/commentators/${author.slug}/commentaries/${bookChapter.bookSlug}/${bookChapter.chapter}`
    : referenceData
      ? `/commentators/${author.slug}/commentaries/${referenceData.bookSlug}/${referenceData.chapter}`
      : `/commentators/${author.slug}/commentaries`;

  const authorBannerImageGradient = `linear-gradient(216deg, ${author.colorScheme?.primary} 0%, ${author.colorScheme?.primary || 'black'} 100%)`;

  const modalVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  const handlePointerDownOutside = useCallback<NonNullable<Dialog.DialogContentProps['onPointerDownOutside']>>(
    event => {
      if (isFontPopoverOpen) {
        event.preventDefault();
        handleCloseFontPopover();
      }
    },
    [isFontPopoverOpen, handleCloseFontPopover],
  );

  const handleEscapeKeyDown = useCallback<NonNullable<Dialog.DialogContentProps['onEscapeKeyDown']>>(
    event => {
      if (isFontPopoverOpen) {
        event.preventDefault();
        handleCloseFontPopover();
      }
    },
    [isFontPopoverOpen, handleCloseFontPopover],
  );

  const handleNavigateToChapter = useCallback(() => {
    if (!chapterUrl || isChapterNavigationPending) {
      return;
    }
    if (isFontPopoverOpen) {
      handleCloseFontPopover();
    }
    startChapterNavigation(() => {
      onClose();
      router.push(chapterUrl);
    });
  }, [chapterUrl, isChapterNavigationPending, isFontPopoverOpen, handleCloseFontPopover, onClose, router, startChapterNavigation]);

  const modalTitle = author?.name
    ? `${author.name} commentary on ${currentReference}`
    : `Commentary on ${currentReference}`;
  const modalDescription = `Read curated commentary insights, switch authors, adjust text size, and access related resources for ${currentReference}.`;

  return (
    <>
      <Dialog.Root
        open={open}
        onOpenChange={state => {
          if (!state) {
            if (isFontPopoverOpen) {
              handleCloseFontPopover();
            }
            onClose();
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
                    backgroundColor: 'rgba(0, 0, 0, 0.85)',
                    zIndex: 1500,
                  }}
                />
              </Dialog.Overlay>
              <Dialog.Content
                asChild
                onOpenAutoFocus={event => event.preventDefault()}
                onCloseAutoFocus={event => event.preventDefault()}
                onPointerDownOutside={handlePointerDownOutside}
                onEscapeKeyDown={handleEscapeKeyDown}
              >
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="hidden"
                  variants={modalVariants}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    position: 'fixed',
                    inset: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1501,
                    outline: 'none',
                  }}
                >
                <Dialog.Title asChild>
                  <VisuallyHidden>{modalTitle}</VisuallyHidden>
                </Dialog.Title>
                <Dialog.Description asChild>
                  <VisuallyHidden>{modalDescription}</VisuallyHidden>
                </Dialog.Description>
                <Box
                  onClick={event => {
                    if (event.target === event.currentTarget) {
                      handleDismissRequest();
                    }
                  }}
                  sx={{ height: '100vh', width: '100vw', display: 'flex', alignItems: 'center', justifyContent: 'center', p: { xs: 1, sm: 2, md: 4 }, outline: 'none', '&:focus-visible': { outline: 'none' }, '&:focus': { outline: 'none' } }}
                >
                  {/* Left Vertical Ad */}
                  <Box sx={{ display: { xs: 'none', md: 'block' }, mr: 2 }}>
                    <VerticalAd
                      key={`commentary-left-${adRefreshVersion}`}
                      slotId="MODAL_VERTICAL_LEFT" 
                      placement="modal"
                      showPlaceholder={false}
                    />
                  </Box>
                  
                  <Box
                    onClick={(e) => {
                      e.stopPropagation();
                      if (isFontPopoverOpen) {
                        handleCloseFontPopover();
                      }
                    }}
                    ref={modalContentRef}
                    sx={{ width: '100%', maxWidth: { xs: '95%', sm: '90%', md: 1000 }, maxHeight: '90vh', display: 'flex', flexDirection: 'column', borderRadius: '35px', overflow: 'hidden', bgcolor: 'black', color: TEXT_COLOR_PRIMARY, fontFamily: FONT_FAMILY, height: '90vh', outline: 'none', '&:focus-visible': { outline: 'none' }, '&:focus': { outline: 'none' } }}
                  >
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                px: '36px',
                py: '18px',
                bgcolor: 'black',
                gap: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
                flexShrink: 0,
              }}
            >
              <Box sx={{
                backgroundColor: 'rgba(255, 255, 255, 0.10)',
                borderRadius: '10px',
                px: '12px',
                py: '5px',
                display: 'inline-flex',
                alignItems: 'center'
              }}>
                <Typography sx={{ ...bodyLargeStyle, color: TEXT_COLOR_PRIMARY, opacity: 0.8 }}>
                  {(() => {
                    // Split reference into book name and chapter:verse
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
              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ModalActionButton
                  label="Share commentary"
                  icon={<IosShareIcon sx={{ fontSize: 22 }} />}
                  hoverColor={SHARE_HOVER_COLOR}
                  onClick={handleShare}
                />
                <ModalActionButton
                  label={bookmarkedCommentaries.has(currentAuthorCommentaries[selectedCommentaryIndex]?.id) ? 'Commentary bookmarked' : 'Bookmark commentary'}
                  icon={bookmarkedCommentaries.has(currentAuthorCommentaries[selectedCommentaryIndex]?.id) ? <BookmarkIcon sx={{ fontSize: 23 }} /> : <BookmarkBorderIcon sx={{ fontSize: 23 }} />}
                  hoverColor={BOOKMARK_HOVER_COLOR}
                  onClick={() => handleBookmark(currentAuthorCommentaries[selectedCommentaryIndex]?.id)}
                  active={bookmarkedCommentaries.has(currentAuthorCommentaries[selectedCommentaryIndex]?.id)}
                />
                <ModalActionButton
                  label="Close"
                  icon={<CloseIcon sx={{ fontSize: 23 }} />}
                  hoverColor={CLOSE_HOVER_COLOR}
                  onClick={() => {
                    if (isFontPopoverOpen) {
                      handleCloseFontPopover();
                    }
                    onClose();
                  }}
                />
              </Box>
            </Box>
            <Box
              sx={{
                px: '36px',
                pt: '26px',
                pb: '60px',
                background: author.colorScheme?.gradient || 'linear-gradient(90deg, rgba(252, 170, 88, 0.10) 0%, rgba(252, 170, 88, 0.05) 100%), rgba(233, 36, 154, 0.10)',
                position: 'relative',
                flexShrink: 0,
                overflow: 'hidden',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: '16px',
                }}
              >
                <Box
                  sx={{
                    position: 'relative',
                    width: 51,
                    height: 51,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    mr: 0,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: '-120%',
                      borderRadius: '50%',
                      background: author.colorScheme?.primary
                        ? `radial-gradient(circle, ${author.colorScheme.primary} 0%, ${alpha(author.colorScheme.primary, 0.6)} 60%, rgba(0,0,0,0) 90%)`
                        : 'radial-gradient(circle, rgba(233, 36, 154, 1) 0%, rgba(233, 36, 154, 0.6) 60%, rgba(0,0,0,0) 90%)',
                      filter: 'blur(85px)',
                      opacity: 1,
                      zIndex: 0,
                      pointerEvents: 'none',
                      transform: 'scale(1.6)',
                    }}
                  />
                  <Box
                    sx={{
                      position: 'relative',
                      width: '100%',
                      height: '100%',
                      borderRadius: '50%',
                      overflow: 'hidden',
                      background: avatarGradient,
                      outline: `2px solid ${avatarOutline}`,
                      outlineOffset: '-2px',
                      boxShadow: `0 0 36px ${alpha(author.colorScheme?.primary || '#E9249A', 0.35)}`,
                      zIndex: 1,
                    }}
                  >
                    {author.image && (
                      <Image
                        src={author.image}
                        alt={author.name}
                        width={51}
                        height={51}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center bottom', display: 'block' }}
                      />
                    )}
                    <Box
                      sx={{
                        position: 'absolute',
                        inset: 0,
                        borderRadius: '50%',
                        boxShadow: 'inset 0px -12px 18px rgba(0,0,0,0.45)',
                        pointerEvents: 'none',
                      }}
                    />
                  </Box>
                </Box>

                <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px', minWidth: 0 }}>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: { xs: 'column', md: 'row' },
                      alignItems: { xs: 'flex-start', md: 'center' },
                      justifyContent: 'space-between',
                      gap: { xs: 1.25, md: 1.5 },
                      width: '100%',
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '16px', minWidth: 0, overflow: 'hidden' }}>
                      <Typography sx={{ ...headingMediumStyle, color: TEXT_COLOR_PRIMARY, position: 'relative', zIndex: 2 }}>
                        {author.name}
                      </Typography>
                      {authorBadges.length > 0 && (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          {authorBadges.map((tag, index) => (
                            <CustomChip
                              key={`${tag}-${index}`}
                              label={tag}
                              bgColor={chipBackground}
                              textColor={chipTextColor}
                              fontSize={12}
                              fontWeight={500}
                              borderRadius={1}
                              padding="2px 8px"
                              sx={{ whiteSpace: 'nowrap' }}
                            />
                          ))}
                        </Box>
                      )}
                  </Box>

                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        flexShrink: 0,
                        justifyContent: { xs: 'flex-start', md: 'flex-end' },
                      }}
                    >
                      <ModalActionButton
                        label="About commentator"
                        tooltip="About commentator"
                        icon={<InfoOutlinedIcon sx={{ fontSize: 21 }} />}
                        hoverColor={alpha(authorActionHoverColor, 0.55)}
                        onClick={() => setAuthorBioOpen(true)}
                        baseColor={authorActionBaseColor}
                        iconColor={'rgba(255, 255, 255, 0.8)'}
                        hoverIconColor={'rgba(255, 255, 255, 0.95)'}
                      />
                      <ModalActionButton
                        label="Open full commentary"
                        icon={<ParagraphIcon sx={{ fontSize: 21 }} />}
                        hoverColor={alpha(authorActionHoverColor, 0.55)}
                        onClick={handleNavigateToChapter}
                        baseColor={authorActionBaseColor}
                        iconColor={'rgba(255, 255, 255, 0.8)'}
                        hoverIconColor={'rgba(255, 255, 255, 0.95)'}
                        text="Full Commentary"
                        loading={isChapterNavigationPending}
                      />
                      <Box
                        sx={{
                          width: '1px',
                          height: 26,
                          background: 'rgba(255,255,255,0.15)',
                          borderRadius: '999px',
                        }}
                      />
                      <Popover.Root open={fontPopoverOpen} onOpenChange={handleFontPopoverOpenChange}>
                        <Popover.Trigger asChild>
                          <ModalActionButton
                            label="Adjust text size"
                            tooltip="Adjust text size"
                            icon={
                              <Box
                                sx={{
                                  fontWeight: 600,
                                  fontSize: 15,
                                }}
                              >
                                Aa
                              </Box>
                            }
                            hoverColor={alpha(authorActionHoverColor, 0.55)}
                            baseColor={authorActionBaseColor}
                            iconColor={'rgba(255, 255, 255, 0.8)'}
                            hoverIconColor={'rgba(255, 255, 255, 0.95)'}
                            active={isFontPopoverOpen}
                            aria-haspopup="dialog"
                            aria-expanded={isFontPopoverOpen ? 'true' : 'false'}
                          />
                        </Popover.Trigger>
                        <Popover.Portal>
                          <Popover.Content
                            asChild
                            side="bottom"
                            align="end"
                            sideOffset={12}
                            collisionPadding={16}
                            onOpenAutoFocus={event => event.preventDefault()}
                            onCloseAutoFocus={event => event.preventDefault()}
                          >
                            <Box
                              onMouseDown={event => event.stopPropagation()}
                              onClick={event => event.stopPropagation()}
                              sx={{
                                background: '#111111',
                                borderRadius: '12px',
                                px: '16px',
                                py: '14px',
                                boxShadow: '0 12px 28px rgba(0,0,0,0.5)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                color: TEXT_COLOR_PRIMARY,
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '14px',
                                width: 160,
                                zIndex: 1601,
                              }}
                            >
                              <Typography sx={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)' }}>
                                Text size
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
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
                                  slotProps={{
                                    thumb: { tabIndex: -1 },
                                    input: { tabIndex: -1 },
                                  }}
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
                                        opacity: 0.4,
                                      },
                                    },
                                    '& .MuiSlider-thumb': {
                                      width: 14,
                                      height: 14,
                                      backgroundColor: '#fff',
                                      '&::before': {
                                        boxShadow: 'none',
                                      },
                                      '&:hover': {
                                        boxShadow: `0 0 0 8px ${alpha(author.colorScheme?.primary || '#E9249A', 0.16)}`,
                                      },
                                    },
                                  }}
                                />
                                <Typography sx={{ fontSize: 19, fontWeight: 500, color: 'rgba(255,255,255,0.7)' }}>A</Typography>
                              </Box>
                              {fontScaleStep !== ADAPTIVE_FONT_SCALE_DEFAULT_STEP && (
                                <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                  <Box
                                    component={Primitive.button}
                                    type="button"
                                    onClick={handleResetFontScale}
                                    tabIndex={-1}
                                    onMouseDown={event => event.preventDefault()}
                                    sx={{
                                      border: 'none',
                                      background: 'none',
                                      color: 'rgba(255,255,255,0.5)',
                                      fontSize: 12,
                                      fontWeight: 500,
                                      cursor: 'pointer',
                                      padding: '4px 8px',
                                      borderRadius: '6px',
                                      transition: 'all 0.2s ease',
                                      fontFamily: 'inherit',
                                      '@media (hover: hover)': {
                                        '&:hover': {
                                          color: 'rgba(255,255,255,0.85)',
                                          backgroundColor: 'rgba(255,255,255,0.08)',
                                        },
                                      },
                                      '&:focus-visible': {
                                        outline: '2px solid rgba(255,255,255,0.6)',
                                        outlineOffset: '4px',
                                      },
                                      '&:active': {
                                        transform: 'scale(0.96)',
                                      },
                                    }}
                                  >
                                    Reset
                                  </Box>
                                </Box>
                              )}
                            </Box>
                          </Popover.Content>
                        </Popover.Portal>
                      </Popover.Root>
                    </Box>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                position: 'relative',
                mt: '-32px',
                px: '36px',
                pt: '40px',
                pb: '24px',
                bgcolor: 'black',
                borderTopLeftRadius: '35px',
                borderTopRightRadius: '35px',
                flex: '1 1 auto',
                overflow: 'hidden',
                minHeight: 0,
                boxShadow: '0 -12px 32px rgba(0,0,0,0.25)',
              }}
            >
              <Box sx={{ flex: '1 1 0', display: 'flex', flexDirection: 'column', minWidth: 0, minHeight: 0, position: 'relative', pr: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0, mb: '15px' }}>
                  {currentAuthorCommentaries.length === 1 ? (
                    <>
                      {currentAuthorCommentaries[0]?.excerpts?.[0]?.type === "Modern" ? (
                        <Tooltip
                          title={<ModernizationTooltip />}
                          arrow
                          placement="right"
                          maxWidth="none"
                        >
                          <Typography
                            sx={{
                              ...labelEyebrowStyle,
                              color: TEXT_COLOR_SECONDARY,
                              borderBottom: '1.5px dotted rgba(255, 255, 255, 0.3)',
                              cursor: 'help',
                              display: 'inline-block',
                              transition: 'border-color 0.2s ease',
                              '&:hover': {
                                borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                              }
                            }}
                          >
                            Commentary
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography sx={{ ...labelEyebrowStyle, color: TEXT_COLOR_SECONDARY }}>
                          Commentary
                        </Typography>
                      )}
                    </>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      {currentAuthorCommentaries[selectedCommentaryIndex]?.excerpts?.[0]?.type === "Modern" ? (
                        <Tooltip
                          title={<ModernizationTooltip />}
                          arrow
                          placement="right"
                          maxWidth="none"
                        >
                          <Typography
                            sx={{
                              ...labelEyebrowStyle,
                              color: TEXT_COLOR_SECONDARY,
                              borderBottom: '1.5px dotted rgba(255, 255, 255, 0.3)',
                              cursor: 'help',
                              display: 'inline-block',
                              transition: 'border-color 0.2s ease',
                              '&:hover': {
                                borderBottomColor: 'rgba(255, 255, 255, 0.5)',
                              }
                            }}
                          >
                            Select Commentary:
                          </Typography>
                        </Tooltip>
                      ) : (
                        <Typography sx={{ ...labelEyebrowStyle, color: TEXT_COLOR_SECONDARY }}>
                          Select Commentary:
                        </Typography>
                      )}
                      {currentAuthorCommentaries.map((commentary: any, index: number) => (
                        <CustomChip
                          key={commentary.id}
                          label={`${index + 1}`}
                          bgColor={selectedCommentaryIndex === index ? chipBackground : 'rgba(255, 255, 255, 0.08)'}
                          textColor={selectedCommentaryIndex === index ? chipTextColor : 'rgba(255, 255, 255, 0.5)'}
                          fontSize={13}
                          fontWeight={600}
                          borderRadius={1.25}
                          padding="6px 11px"
                          onClick={() => setSelectedCommentaryIndex(index)}
                          sx={{
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minWidth: '32px',
                            '&:hover': {
                              backgroundColor: selectedCommentaryIndex === index ? chipBackground : 'rgba(255, 255, 255, 0.12)',
                              transform: 'translateY(-1px)',
                            }
                          }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
                <Box
                  ref={commentaryScrollRef}
                  onScroll={() => handleScroll('commentary')}
                  sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      borderRadius: '999px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.28)',
                    },
                    scrollbarWidth: 'thin',
                    msOverflowStyle: 'auto',
                  }}
                >
                  {currentAuthorCommentaries[selectedCommentaryIndex]?.excerpts.map((excerpt: any) => {
                    const htmlWithLinks = replaceReferenceShortcodes(verseVersion, excerpt.content, currentAuthorCommentaries[selectedCommentaryIndex].author.colorScheme);

                    return (
                      <Typography
                        key={excerpt.id}
                        sx={{
                          color: TEXT_COLOR_PRIMARY,
                          fontSize: scaledCommentaryFontSize,
                          fontWeight: 400,
                          lineHeight: `${scaledCommentaryLineHeight}px`,
                          whiteSpace: 'pre-line',
                          mb: '20px',
                          '& > *:first-child': {
                            marginTop: 0,
                          },
                          '& > *:last-child': {
                            marginBottom: 0,
                          },
                          '& hr': {
                            opacity: 0.2,
                            border: 'none',
                            borderTop: '1px solid currentColor',
                            margin: '20px 0'
                          },
                          '& sup': {
                            fontSize: scaledSupFontSize,
                            fontWeight: 600,
                            color: TEXT_COLOR_SECONDARY,
                            marginRight: '4px'
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
                        dangerouslySetInnerHTML={{ __html: htmlWithLinks }}
                      >
                      </Typography>
                    )
                  })}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    <Typography sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 14, fontWeight: 500, lineHeight: '21px' }}>Source: <Box component="span" sx={{ fontStyle: 'italic' }}>{currentCommentary.source}</Box></Typography>
                    {/* <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>{currentCommentary.tags.map(tag => (<Chip key={tag} label={tag} size="small" sx={{ background: author.colorScheme?.chipBackground, color: author.colorScheme?.chipText, borderRadius: '10px', height: 'auto', fontSize: 12, fontWeight: 500, fontFamily: FONT_FAMILY, '.MuiChip-label': { padding: '7px 10px' } }} />))}</Box> */}
                  </Box>
                </Box>
                <Box sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: FADE_HEIGHT,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
                  opacity: commentaryCanScroll ? (commentaryScrolledToBottom ? 0 : 1) : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  pointerEvents: 'none'
                }} />
              </Box>
              <Box sx={{ width: '1px', alignSelf: 'stretch', background: 'linear-gradient(to bottom, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 1) 50%, rgba(255, 255, 255, 0) 100%)', opacity: 0.5 }} />
              <Box sx={{ width: { xs: '100%', md: 280 }, display: 'flex', flexDirection: 'column', position: 'relative', pl: '20px', minHeight: 0 }}>
                <Typography sx={{ ...labelEyebrowStyle, color: TEXT_COLOR_SECONDARY, flexShrink: 0, mb: '15px' }}>{verseHeaderText}</Typography>
                <Box
                  ref={verseScrollRef}
                  onScroll={() => handleScroll('verse')}
                  sx={{
                    flexGrow: 1,
                    minHeight: 0,
                    overflowY: 'auto',
                    pb: '8px',
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: 'rgba(255, 255, 255, 0.18)',
                      borderRadius: '999px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.28)',
                    },
                    scrollbarWidth: 'thin',
                    msOverflowStyle: 'auto',
                  }}
                >
                  <Typography
                    sx={{
                      color: TEXT_COLOR_PRIMARY,
                      fontSize: scaledVerseFontSize,
                      fontWeight: 400,
                      lineHeight: `${scaledVerseLineHeight}px`,
                      whiteSpace: 'pre-line',
                      '& sup': {
                        fontSize: scaledSupFontSize,
                        fontWeight: 600,
                        color: TEXT_COLOR_SECONDARY,
                        marginRight: '4px',
                        verticalAlign: 'baseline',
                        position: 'relative',
                        top: '-0.4em'
                      }
                    }}
                    dangerouslySetInnerHTML={{ __html: enhancedVerseContent }}
                  />
                </Box>
                <Box sx={{
                  position: 'absolute',
                  bottom: '15px',
                  left: 0,
                  right: 0,
                  height: FADE_HEIGHT,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,1) 100%)',
                  opacity: verseCanScroll ? (verseScrolledToBottom ? 0 : 1) : 0,
                  transition: 'opacity 0.3s ease-in-out',
                  pointerEvents: 'none'
                }} />
                <Typography sx={{ color: TEXT_COLOR_SECONDARY, fontSize: 14, fontWeight: 500, lineHeight: '21px', mt: 'auto', flexShrink: 0 }}>{currentReference} ({verseVersion.toUpperCase()})</Typography>
              </Box>
            </Box>
            {/* Navigation footer for author carousel */}
            <Box
              sx={{
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                bgcolor: 'black',
                flexShrink: 0,
                py: '20px',
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '24px',
                  px: '40px',
                  position: 'relative',
                }}
              >
                <Box sx={{ flex: '0 0 auto' }}>
                  <Box
                    component={Primitive.button}
                    type="button"
                    onClick={prevAuthor ? handlePrevious : undefined}
                    onMouseEnter={() => prevAuthor && setIsPrevHovered(true)}
                    onMouseLeave={() => setIsPrevHovered(false)}
                    disabled={!prevAuthor}
                    aria-label={prevAuthor ? `View ${getLastName(prevAuthor.name)} commentary` : 'Previous commentary'}
                    tabIndex={-1}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isPrevHovered ? '8px' : '0px',
                      padding: '8px 16px',
                      borderRadius: '14px',
                      background: prevNavBackground,
                      cursor: prevAuthor ? 'pointer' : 'default',
                      opacity: prevAuthor ? 1 : 0.3,
                      transition: 'all 0.3s ease',
                      color: prevNavIconColor,
                      width: 'auto',
                      boxShadow: prevAuthor ? '0 8px 18px rgba(0,0,0,0.35)' : 'none',
                      border: 'none',
                      outline: 'none',
                      font: 'inherit',
                      textAlign: 'left',
                      backgroundClip: 'padding-box',
                      '@media (hover: hover)': {
                        '&:hover': {
                          background: prevNavHoverBackground,
                          transform: prevAuthor ? 'translateX(-3px)' : 'none',
                        },
                      },
                      '&:focus-visible': {
                        outline: '2px solid rgba(255, 255, 255, 0.6)',
                        outlineOffset: '4px',
                      },
                      '&:active': {
                        transform: prevAuthor ? 'translateX(-2px) scale(0.97)' : 'none',
                      },
                      '&:disabled': {
                        cursor: 'not-allowed',
                        opacity: 0.3,
                        boxShadow: 'none',
                      },
                    }}
                  >
                    <ArrowBackIcon sx={{ fontSize: 22, color: prevNavIconColor }} />
                    {prevAuthor && (
                      <Box
                        sx={{
                          overflow: 'hidden',
                          maxWidth: isPrevHovered ? '200px' : '0px',
                          transition: 'max-width 0.4s ease',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.8)',
                            opacity: isPrevHovered ? 0.9 : 0,
                            transform: `translateX(${isPrevHovered ? 0 : -10}px)`,
                            transition: 'opacity 0.4s ease, transform 0.4s ease',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {getLastName(prevAuthor.name)}
                        </Typography>
                      </Box>
                    )}
                  </Box>
                </Box>

                <Box sx={{ position: 'absolute', left: '50%', transform: 'translateX(-50%)', display: 'flex', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {(() => {
                      const totalDots = uniqueAuthors.length;
                      const maxVisibleDots = 5;

                      if (totalDots <= maxVisibleDots) {
                        return uniqueAuthors.map((_, index: number) => {
                          const distance = Math.abs(index - currentAuthorIndex);
                          let size = 7;
                          let opacity = 0.35;

                          if (distance === 0) {
                            size = 9;
                            opacity = 1;
                          } else if (distance === 1) {
                            size = 8;
                            opacity = 0.7;
                          }

                          return (
                            <Box
                              key={index}
                              sx={{
                                width: size,
                                height: size,
                                borderRadius: '50%',
                                backgroundColor: 'white',
                                opacity,
                                transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                transform: `scale(${distance === 0 ? 1.1 : 1})`,
                              }}
                            />
                          );
                        });
                      }

                      const dotSize = 15;
                      const containerWidth = maxVisibleDots * dotSize;
                      const totalWidth = totalDots * dotSize;
                      let offset = -(currentAuthorIndex * dotSize) + (containerWidth / 2) - (dotSize / 2);
                      const maxOffset = 10;
                      const minOffset = -(totalWidth - containerWidth) - 10;
                      offset = Math.max(minOffset, Math.min(maxOffset, offset));

                      return (
                        <Box sx={{ width: containerWidth, overflow: 'hidden', height: 20 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '8px',
                              transform: `translateX(${offset}px)`,
                              transition: 'transform 0.45s cubic-bezier(0.4, 0, 0.2, 1)',
                            }}
                          >
                            {uniqueAuthors.map((_, index: number) => {
                              const distance = Math.abs(index - currentAuthorIndex);
                              let size = 7;
                              let opacity = 0.35;

                              if (distance === 0) {
                                size = 9;
                                opacity = 1;
                              } else if (distance === 1) {
                                size = 8;
                                opacity = 0.7;
                              } else if (distance === 2) {
                                size = 7.5;
                                opacity = 0.5;
                              }

                              return (
                                <Box
                                  key={index}
                                  sx={{
                                    width: size,
                                    height: size,
                                    borderRadius: '50%',
                                    backgroundColor: 'white',
                                    opacity,
                                    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                                    transform: `scale(${distance === 0 ? 1.08 : 1})`,
                                    flexShrink: 0,
                                  }}
                                />
                              );
                            })}
                          </Box>
                        </Box>
                      );
                    })()}
                  </Box>
                </Box>

                <Box sx={{ flex: '0 0 auto' }}>
                  <Box
                    component={Primitive.button}
                    type="button"
                    onClick={nextAuthor ? handleNext : undefined}
                    onMouseEnter={() => nextAuthor && setIsNextHovered(true)}
                    onMouseLeave={() => setIsNextHovered(false)}
                    disabled={!nextAuthor}
                    aria-label={nextAuthor ? `View ${getLastName(nextAuthor.name)} commentary` : 'Next commentary'}
                    tabIndex={-1}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: isNextHovered ? '8px' : '0px',
                      padding: '8px 16px',
                      borderRadius: '14px',
                      background: nextNavBackground,
                      cursor: nextAuthor ? 'pointer' : 'default',
                      opacity: nextAuthor ? 1 : 0.3,
                      transition: 'all 0.3s ease',
                      color: nextNavIconColor,
                      width: 'auto',
                      boxShadow: nextAuthor ? '0 8px 18px rgba(0,0,0,0.35)' : 'none',
                      border: 'none',
                      outline: 'none',
                      font: 'inherit',
                      textAlign: 'left',
                      backgroundClip: 'padding-box',
                      '@media (hover: hover)': {
                        '&:hover': {
                          background: nextNavHoverBackground,
                          transform: nextAuthor ? 'translateX(3px)' : 'none',
                        },
                      },
                      '&:focus-visible': {
                        outline: '2px solid rgba(255, 255, 255, 0.6)',
                        outlineOffset: '4px',
                      },
                      '&:active': {
                        transform: nextAuthor ? 'translateX(2px) scale(0.97)' : 'none',
                      },
                      '&:disabled': {
                        cursor: 'not-allowed',
                        opacity: 0.3,
                        boxShadow: 'none',
                      },
                    }}
                  >
                    {nextAuthor && (
                      <Box
                        sx={{
                          overflow: 'hidden',
                          maxWidth: isNextHovered ? '200px' : '0px',
                          transition: 'max-width 0.4s ease',
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: 15,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.8)',
                            opacity: isNextHovered ? 0.9 : 0,
                            transform: `translateX(${isNextHovered ? 0 : 10}px)`,
                            transition: 'opacity 0.4s ease, transform 0.4s ease',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {getLastName(nextAuthor.name)}
                        </Typography>
                      </Box>
                    )}
                    <ArrowForwardIcon sx={{ fontSize: 22, color: nextNavIconColor }} />
                  </Box>
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Right Vertical Ad */}
          <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
            <VerticalAd
              key={`commentary-right-${adRefreshVersion}`}
              slotId="MODAL_VERTICAL_RIGHT" 
              placement="modal"
              showPlaceholder={false}
            />
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
        onUpgrade={() => {
          setBookmarkPromoOpen(false);
        }}
      />

      <AuthorBioModal
        open={authorBioOpen}
        onClose={() => setAuthorBioOpen(false)}
        author={author}
      />
    </>
  );
}
