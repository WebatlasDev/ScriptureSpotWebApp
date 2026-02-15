'use client';

import React, {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Box,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import { IosShareIcon } from '@/components/ui/phosphor-icons';
import { ArrowBackIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { OpenInNewIcon } from '@/components/ui/phosphor-icons';
import { MenuBookOutlinedIcon } from '@/components/ui/phosphor-icons';
import { Primitive } from '@radix-ui/react-primitive';
import * as Dialog from '@radix-ui/react-dialog';
import { Root as VisuallyHidden } from '@radix-ui/react-visually-hidden';
import { toast } from 'react-toastify';

import { interlinearThemes } from '@/styles/interlinearThemes';
import VerticalAd from '@/components/ads/VerticalAd';
import { refreshModalAds } from '@/utils/adUtils';
import BookmarkPromoModal from '@/components/marketing/BookmarkPromoModal';
import { useCreateBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { useExplorationLexiconEntry } from '@/hooks/useExplorationLexiconEntry';
import { useExplorationLexiconVerseReferences } from '@/hooks/useExplorationLexiconVerseReferences';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import HighlightedText from '@/components/ui/HighlightedText';
import { CustomChip } from '@/components/ui';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';
import { buildUrl } from '@/utils/navigation';
import { extractStrongsKeywords } from '@/utils/stringHelpers';
import { resolveBookmarkId } from '@/utils/bookmarkUtils';

interface StrongsModalProps {
  open: boolean;
  onClose: () => void;
  strongsKey: string;
  interlinearData?: any;
  currentWordIndex?: number;
  wordsList?: any[];
  onNavigateToWord?: (wordIndex: number) => void;
  version: string;
}

interface VerseReference {
  book: string;
  chapter: number;
  verse: number;
  text: string;
  reference: string;
  bookSlug?: string;
  verseContent?: string;
}

const FONT_FAMILY = 'Inter, sans-serif';
const TEXT_COLOR_PRIMARY = '#FFFAFA';
const TEXT_COLOR_SECONDARY = 'rgba(255, 249, 249, 0.72)';
const ACTION_BUTTON_BASE_COLOR = '#151515';
const ACTION_BUTTON_ICON_COLOR = 'rgba(255, 255, 255, 0.85)';
const SHARE_HOVER_COLOR = '#4A9EFF';
const BOOKMARK_HOVER_COLOR = '#FF8C3A';
const CLOSE_HOVER_COLOR = '#FF4D57';
const SIDEBAR_ICON_SIZE = 44;
const ICON_BOX_SIZE = 36;
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

interface LanguageStyle {
  headerGradient: string;
  headerChipBackground: string;
  headerChipText: string;
  accentColor: string;
  accentMuted: string;
  wordCardBackground: string;
  wordCardShadow: string;
  wordGlowColor: string;
  wordTextGradient: string;
  wordTextShadow: string;
  cardBackground: string;
  sidebarBackground: string;
  sidebarOutline: string;
  badgeGradient: string;
  badgeGlow: string;
  occurrenceCardBackground: string;
  occurrenceCardBorder: string;
  highlightDotGradient: string;
  highlightDotShadow: string;
  loadMoreBorder: string;
  loadMoreHover: string;
}

const LANGUAGE_VARIANTS: Record<'HEBREW' | 'GREEK', LanguageStyle> = {
  HEBREW: {
    headerGradient:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(90deg, rgba(226, 182, 75, 0.04) 50%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(90deg, rgba(226, 182, 75, 0.06) 59%, rgba(249, 216, 73, 0.60) 100%), linear-gradient(1deg, rgba(226, 182, 75, 0.03) 0%, rgba(249, 216, 73, 0.30) 100%), linear-gradient(90deg, rgba(249, 216, 73, 0.10) 0%, #E2B64B 100%), #121212',
    headerChipBackground: '#8A7400',
    headerChipText: '#F7E1FF',
    accentColor: '#F0D043',
    accentMuted: 'rgba(249, 216, 73, 0.68)',
    wordCardBackground:
      'linear-gradient(133deg, rgba(91, 91, 91, 0.01) 0%, rgba(255, 215, 0, 0.05) 100%), rgba(255, 255, 255, 0.10)',
    wordCardShadow: '0px 36px 70px rgba(249, 216, 73, 0.18)',
    wordGlowColor: 'rgba(249, 216, 73, 0.32)',
    wordTextGradient: 'linear-gradient(110deg, #FFF8C1 0%, #FAD74E 48%, #CFA22A 100%)',
    wordTextShadow: '0px 4px 8px rgba(0, 0, 0, 0.7), 0px 0px 75px rgba(249, 216, 73, 0.82), 0px 0px 90px rgba(249, 216, 73, 0.46), 0px 0px 50px rgba(249, 216, 73, 0.7)',
    cardBackground: '#1C1C1C',
    sidebarBackground: 'rgba(18, 18, 18, 0.92)',
    sidebarOutline: '2px rgba(255, 255, 255, 0.12) solid',
    badgeGradient: 'linear-gradient(219deg, #F9D849 0%, #998100 100%)',
    badgeGlow: '0px 0px 160px rgba(249, 216, 73, 0.42)',
    occurrenceCardBackground: 'rgba(255, 255, 255, 0.10)',
    occurrenceCardBorder: '1px solid rgba(249, 216, 73, 0.18)',
    highlightDotGradient: 'linear-gradient(219deg, #FFD700 0%, #B69900 100%)',
    highlightDotShadow: '0px 0px 16px rgba(255, 215, 0, 0.68)',
    loadMoreBorder: 'rgba(249, 216, 73, 0.75)',
    loadMoreHover: 'rgba(249, 216, 73, 0.08)',
  },
  GREEK: {
    headerGradient:
      'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(90deg, rgba(137, 183, 249, 0.04) 0%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(90deg, rgba(137, 183, 249, 0.06) 26%, rgba(80, 130, 203, 0.60) 100%), linear-gradient(1deg, rgba(137, 183, 249, 0.03) 0%, rgba(80, 130, 203, 0.30) 100%), linear-gradient(90deg, rgba(80, 130, 203, 0.26) 0%, #89B7F9 100%), #121212',
    headerChipBackground: 'rgba(80, 130, 203, 0.42)',
    headerChipText: '#F7E1FF',
    accentColor: '#96C2FF',
    accentMuted: 'rgba(137, 183, 249, 0.72)',
    wordCardBackground:
      'linear-gradient(133deg, rgba(91, 91, 91, 0.01) 0%, rgba(137, 183, 249, 0.10) 100%), rgba(255, 255, 255, 0.10)',
    wordCardShadow: '0px 36px 70px rgba(137, 183, 249, 0.25)',
    wordGlowColor: 'rgba(137, 183, 249, 0.34)',
    wordTextGradient: 'linear-gradient(110deg, #F0F6FF 0%, #AEC7FF 45%, #5E7DD6 100%)',
    wordTextShadow: '0px 4px 8px rgba(0, 0, 0, 0.7), 0px 0px 75px rgba(137, 183, 249, 0.9), 0px 0px 90px rgba(137, 183, 249, 0.48), 0px 0px 50px rgba(137, 183, 249, 0.76)',
    cardBackground: '#1C1C1C',
    sidebarBackground: 'rgba(20, 24, 34, 0.92)',
    sidebarOutline: '2px rgba(134, 190, 255, 0.18) solid',
    badgeGradient: 'linear-gradient(225deg, #A2C8FF 0%, #4F81C9 100%)',
    badgeGlow: '0px 0px 160px rgba(150, 194, 255, 0.45)',
    occurrenceCardBackground: 'rgba(255, 255, 255, 0.10)',
    occurrenceCardBorder: '1px solid rgba(134, 190, 255, 0.18)',
    highlightDotGradient: 'linear-gradient(219deg, #89B7F9 0%, #6695D8 100%)',
    highlightDotShadow: '0px 0px 16px rgba(137, 183, 249, 0.68)',
    loadMoreBorder: 'rgba(137, 183, 249, 0.75)',
    loadMoreHover: 'rgba(137, 183, 249, 0.08)',
  },
};

type PrimitiveButtonProps = React.ComponentPropsWithoutRef<typeof Primitive.button>;

interface ModalActionButtonProps extends Omit<PrimitiveButtonProps, 'children'> {
  label: string;
  icon: React.ReactNode;
  hoverColor: string;
  active?: boolean;
  baseColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  borderColor?: string;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const ModalActionButton = React.forwardRef<HTMLButtonElement, ModalActionButtonProps>(
  (
    {
      label,
      icon,
      hoverColor,
      active = false,
      baseColor = ACTION_BUTTON_BASE_COLOR,
      iconColor = 'rgba(255, 255, 255, 0.85)',
      hoverIconColor = 'rgba(255, 255, 255, 0.95)',
      borderColor,
      disabled = false,
      onClick,
      ...primitiveProps
    },
    ref,
  ) => (
    <Box
      component={Primitive.button}
      ref={ref as any}
      type="button"
      aria-label={label}
      data-state={active ? 'active' : 'inactive'}
      aria-disabled={disabled ? 'true' : undefined}
      disabled={disabled}
      onClick={event => {
        if (disabled) {
          event.preventDefault();
          return;
        }
        onClick?.(event as React.MouseEvent<HTMLButtonElement>);
      }}
      {...primitiveProps}
      sx={{
        width: ICON_BOX_SIZE,
        height: ICON_BOX_SIZE,
        borderRadius: { xs: '12px', md: '10px' },
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: active ? hoverColor : baseColor,
        color: active ? hoverIconColor : iconColor,
        transition: 'transform 0.18s ease, background-color 0.24s ease, color 0.24s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        outline: 'none',
        border: borderColor ? `1px solid ${borderColor}` : 'none',
        font: 'inherit',
        '& > svg': { fontSize: 22 },
        '@media (hover: hover)': {
          '&:hover': {
            backgroundColor: hoverColor,
            color: hoverIconColor,
          },
        },
        '&:focus-visible': {
          outline: '2px solid rgba(255, 255, 255, 0.6)',
          outlineOffset: 3,
        },
        '&:active': {
          transform: disabled ? 'none' : 'scale(0.92)',
        },
        '&[data-state="active"]': {
          backgroundColor: hoverColor,
          color: hoverIconColor,
        },
      }}
    >
      {icon}
    </Box>
  ),
);
ModalActionButton.displayName = 'ModalActionButton';

const formatNumber = (value: number | string | null | undefined) => {
  if (value === null || value === undefined) {
    return '—';
  }

  const numeric =
    typeof value === 'string' ? Number(value.replace(/[^0-9.-]/g, '')) : Number(value);

  if (!Number.isNaN(numeric) && Number.isFinite(numeric)) {
    return new Intl.NumberFormat().format(numeric);
  }

  return String(value);
};

export default function StrongsModal({
  open,
  onClose,
  strongsKey,
  interlinearData,
  currentWordIndex,
  wordsList,
  onNavigateToWord,
  version,
}: StrongsModalProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [allLoadedReferences, setAllLoadedReferences] = useState<VerseReference[]>([]);
  const [adRefreshVersion, setAdRefreshVersion] = useState(0);
  const occurrencesScrollRef = useRef<HTMLDivElement | null>(null);
  const pendingScrollToIndexRef = useRef<number | null>(null);
  const occurrenceItemRefs = useRef<Map<number, HTMLElement>>(new Map());

  const registerOccurrenceItem = useCallback((index: number, node: HTMLElement | null) => {
    if (node) {
      occurrenceItemRefs.current.set(index, node);
    } else {
      occurrenceItemRefs.current.delete(index);
    }
  }, []);

  const { data: lexiconEntry, isLoading } = useExplorationLexiconEntry(strongsKey);
  const strongsBookmarkId = useMemo(
    () =>
      resolveBookmarkId(
        lexiconEntry?.id,
        lexiconEntry?.lexiconEntryId,
        lexiconEntry?.entryId,
      ),
    [lexiconEntry],
  );
  const {
    data: verseReferencesData,
    isLoading: referencesLoading,
    isFetching: referencesFetching,
  } = useExplorationLexiconVerseReferences(strongsKey, version, currentPage, 20);

  const strongsData = useMemo(() => {
    if (!lexiconEntry) return null;
    return {
      strongsNumber: lexiconEntry.strongsKey,
      originalWord: lexiconEntry.originalWord,
      transliteration: lexiconEntry.transliteration,
      englishWord: lexiconEntry.kjvTranslation,
      rootWord: lexiconEntry.wordOrigin,
      shortDefinition: lexiconEntry.shortDefinition,
      frequency: lexiconEntry.frequency,
      grammar: lexiconEntry.partOfSpeech,
      morphology: lexiconEntry.phoneticSpelling,
      definition: lexiconEntry.strongsDef || lexiconEntry.bdbDef,
      language: lexiconEntry.language === 'Hebrew' ? 'HEBREW' : 'GREEK',
    } as const;
  }, [lexiconEntry]);

  // Determine language-specific theming
  // Detect language from strongsKey during loading to ensure correct colors immediately
  const detectedLanguage = useMemo(() => {
    if (strongsData?.language) return strongsData.language;
    // Detect from strongsKey during loading
    const keyUpper = strongsKey?.toUpperCase() ?? '';
    if (keyUpper.startsWith('G')) return 'GREEK';
    if (keyUpper.startsWith('H')) return 'HEBREW';
    return 'HEBREW'; // fallback
  }, [strongsData?.language, strongsKey]);

  const languageKey = detectedLanguage;
  const languageStyle = LANGUAGE_VARIANTS[languageKey];
  const interlinearTheme = interlinearThemes[languageKey];

  const verseReferences = allLoadedReferences;

  const totalCount = verseReferencesData?.totalCount ?? 0;
  const totalPages = verseReferencesData?.totalPages ?? 0;
  const hasMore = currentPage < totalPages;
  const loadMore = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  }, [currentPage, totalPages]);

  const highlightTerms = useMemo(() => {
    if (!strongsData) return [] as string[];

    const collected = new Set(
      extractStrongsKeywords(
        strongsData.shortDefinition,
        strongsData.definition,
        strongsData.rootWord,
        strongsData.grammar,
      ),
    );

    const addTerm = (value?: string) => {
      if (!value) return;
      const trimmed = value.trim();
      if (!trimmed) return;
      collected.add(trimmed.toLowerCase());

      trimmed
        .split(/[\s,;/]+/)
        .map(term => term.trim().toLowerCase())
        .filter(term => term.length > 2)
        .forEach(term => collected.add(term));
    };

    addTerm(strongsData.englishWord);
    addTerm(strongsData.originalWord);
    addTerm(strongsData.transliteration);

    return Array.from(collected);
  }, [strongsData]);

  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();

  const handleBookmark = useCallback(async () => {
    if (!strongsBookmarkId) {
      toast.error("Strong's entry ID is required for bookmarking");
      return;
    }

    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    try {
      if (!isBookmarked) {
        await createBookmark({
          id: strongsBookmarkId,
          type: BookmarkType.STRONGS_CONCORDANCE,
          userId: user.id,
        });
        setIsBookmarked(true);
      }
    } catch {
      toast.error('Bookmark error');
    }
  }, [createBookmark, isBookmarked, isPremium, strongsBookmarkId, user]);

  const generateShareUrl = useCallback(() => {
    if (typeof window !== 'undefined' && strongsData?.strongsNumber) {
      const baseUrl = window.location.origin + window.location.pathname;
      return `${baseUrl}#strongs-${strongsData.strongsNumber.toLowerCase()}`;
    }
    return '';
  }, [strongsData?.strongsNumber]);

  const handleCopyLink = useCallback(async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
    } catch {
      toast.error('Failed to copy link');
    }
  }, []);

  const handleShare = useCallback(async () => {
    const shareUrl = generateShareUrl();
    if (!shareUrl) return;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${strongsData?.strongsNumber ?? ''} - Word Study`,
          text: strongsData?.originalWord
            ? `Explore the Strong's Concordance entry for ${strongsData.originalWord}`
            : 'Explore this Strong’s Concordance entry',
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
  }, [generateShareUrl, handleCopyLink, strongsData?.originalWord, strongsData?.strongsNumber]);

  const previousWordWithStrongs = useMemo(() => {
    if (!wordsList || currentWordIndex === undefined) return null;
    for (let i = currentWordIndex - 1; i >= 0; i -= 1) {
      const word = wordsList[i];
      if (word?.strongLexiconKey) {
        return { word, index: i };
      }
    }
    return null;
  }, [currentWordIndex, wordsList]);

  const nextWordWithStrongs = useMemo(() => {
    if (!wordsList || currentWordIndex === undefined) return null;
    for (let i = currentWordIndex + 1; i < (wordsList?.length ?? 0); i += 1) {
      const word = wordsList[i];
      if (word?.strongLexiconKey) {
        return { word, index: i };
      }
    }
    return null;
  }, [currentWordIndex, wordsList]);

  const canNavigatePrevious = Boolean(previousWordWithStrongs);
  const canNavigateNext = Boolean(nextWordWithStrongs);

  const handlePrevious = useCallback(() => {
    if (canNavigatePrevious && onNavigateToWord && previousWordWithStrongs) {
      onNavigateToWord(previousWordWithStrongs.index);
      refreshModalAds();
    }
  }, [canNavigatePrevious, onNavigateToWord, previousWordWithStrongs]);

  const handleNext = useCallback(() => {
    if (canNavigateNext && onNavigateToWord && nextWordWithStrongs) {
      onNavigateToWord(nextWordWithStrongs.index);
      refreshModalAds();
    }
  }, [canNavigateNext, onNavigateToWord, nextWordWithStrongs]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (!open) return;
      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        handlePrevious();
      } else if (event.key === 'ArrowRight') {
        event.preventDefault();
        handleNext();
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [handleNext, handlePrevious, onClose, open]);

  useEffect(() => {
    if (open) {
      setAdRefreshVersion(prev => prev + 1);
      refreshModalAds();
    }
  }, [currentWordIndex, open]);

  useEffect(() => {
    if (open) {
      setCurrentPage(1);
      setAllLoadedReferences([]);
      pendingScrollToIndexRef.current = null;
      occurrenceItemRefs.current.clear();
    }
  }, [open, strongsKey]);

  // Accumulate loaded references across pages
  useEffect(() => {
    if (verseReferencesData?.results && verseReferencesData.page === currentPage) {
      if (currentPage === 1) {
        // First page: replace all
        setAllLoadedReferences(verseReferencesData.results as VerseReference[]);
      } else {
        // Subsequent pages: append
        setAllLoadedReferences(prev => [
          ...prev,
          ...(verseReferencesData.results as VerseReference[])
        ]);
      }
    }
  }, [verseReferencesData, currentPage]);

  useLayoutEffect(() => {
    if (!isMobile) {
      pendingScrollToIndexRef.current = null;
      return;
    }
    const targetIndex = pendingScrollToIndexRef.current;
    if (targetIndex == null) {
      return;
    }
    const scroller = occurrencesScrollRef.current;
    const target = occurrenceItemRefs.current.get(targetIndex);
    if (!scroller || !target) {
      pendingScrollToIndexRef.current = null;
      return;
    }
    requestAnimationFrame(() => {
      const paddingLeft = parseFloat(getComputedStyle(scroller).paddingLeft || '0');
      const newScrollLeft = target.offsetLeft - paddingLeft;
      scroller.scrollTo({ left: newScrollLeft, behavior: 'auto' });
      pendingScrollToIndexRef.current = null;
    });
  }, [isMobile, currentPage]);

  const getHighlightedVerseText = useCallback(
    (book: string, chapter: number, verse: number, fallbackText: string) => {
      if (!interlinearData || !strongsData?.strongsNumber) {
        return fallbackText;
      }

      const bookKey = book.toLowerCase().replace(/\s+/g, '');
      const verseData = interlinearData[bookKey]?.[String(chapter)]?.[String(verse)];

      if (!Array.isArray(verseData)) {
        return fallbackText;
      }

      return (
        <Box component="span">
          {verseData.map((wordData: any, index: number) => {
            const isTargetWord = wordData.strongLexiconKey === strongsData.strongsNumber;
            const punctuation = wordData.punctuation || '';
            const needsSpace = index < verseData.length - 1 && !punctuation;

            return (
              <React.Fragment key={`${wordData.englishWord ?? ''}-${index}`}>
                <Box
                  component="span"
                  sx={{
                    backgroundColor: isTargetWord ? interlinearTheme.strongsColor : 'transparent',
                    color: isTargetWord ? '#000000' : 'inherit',
                    borderRadius: isTargetWord ? '6px' : '0',
                    px: isTargetWord ? 0.75 : 0,
                    py: isTargetWord ? 0.25 : 0,
                    fontWeight: isTargetWord ? 700 : 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {wordData.englishWord}
                </Box>
                {punctuation && <span>{punctuation}</span>}
                {needsSpace && <span> </span>}
              </React.Fragment>
            );
          })}
        </Box>
      );
    },
    [interlinearData, interlinearTheme.strongsColor, strongsData?.strongsNumber],
  );

  const versionSlug = useMemo(() => {
    if (typeof window === 'undefined') {
      return env.defaultVersion.toLowerCase();
    }
    const stored = getLastVersion();
    return (stored || env.defaultVersion).toLowerCase();
  }, []);

  const getReferenceHref = useCallback(
    (ref: VerseReference) => {
      const bookSlug = ref.bookSlug || ref.book.toLowerCase().replace(/\s+/g, '-');
      return buildUrl({
        version: versionSlug,
        book: bookSlug,
        chapter: ref.chapter,
        verse: ref.verse,
      });
    },
    [versionSlug],
  );

  const getVerseText = useCallback((ref: VerseReference) => {
    if (ref.verseContent) {
      return ref.verseContent;
    }
    if (ref.text) {
      return ref.text;
    }
    return `Click to view ${ref.reference}`;
  }, []);

  const frequencyLabel = useMemo(() => {
    if (totalCount > 0) {
      return formatNumber(totalCount);
    }
    if (strongsData?.frequency) {
      return formatNumber(strongsData.frequency);
    }
    return '—';
  }, [strongsData?.frequency, totalCount]);

  const modalTitle = strongsData
    ? `${strongsData.strongsNumber} Word Study`
    : 'Strong’s Word Study';
  const modalDescription = strongsData
    ? `Explore lexical details, related definitions, and occurrences for ${strongsData.originalWord}.`
    : 'Detailed lexical insights from Strong’s Concordance.';

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

  const renderHeader = () => (
    <Box
      sx={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: { xs: 'wrap', md: 'nowrap' },
        columnGap: { xs: 2, md: 3.5 },
        rowGap: { xs: 1.5, md: 0 },
        px: { xs: MODAL_MOBILE_PADDING, md: 5 },
        pt: { xs: '18px', md: 3.75 },
        pb: { xs: '42px', md: 7.5 },
        background: languageStyle.headerGradient,
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
          flex: { xs: '1 1 auto', md: '0 0 auto' },
        }}
      >
        <Typography
          component="h2"
          sx={{
            fontSize: { xs: 20, md: 24 },
            fontWeight: 700,
            color: TEXT_COLOR_PRIMARY,
            letterSpacing: '0.6px',
            lineHeight: 1.1,
          }}
        >
          Word Study
        </Typography>
        <CustomChip
          label="Strong’s Concordance"
          bgColor={languageStyle.headerChipBackground}
          textColor={languageStyle.headerChipText}
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
          label="Share word study"
          icon={<IosShareIcon sx={{ fontSize: 22 }} />}
          hoverColor={SHARE_HOVER_COLOR}
          onClick={handleShare}
          baseColor={ACTION_BUTTON_BASE_COLOR}
          iconColor={ACTION_BUTTON_ICON_COLOR}
        />
        <ModalActionButton
          label="Bookmark word study"
          icon={isBookmarked ? <BookmarkIcon sx={{ fontSize: 22 }} /> : <BookmarkBorderIcon sx={{ fontSize: 22 }} />}
          hoverColor={BOOKMARK_HOVER_COLOR}
          active={isBookmarked}
          onClick={handleBookmark}
          baseColor={ACTION_BUTTON_BASE_COLOR}
          iconColor={ACTION_BUTTON_ICON_COLOR}
        />
        <ModalActionButton
          label="Close word study"
          icon={<CloseIcon sx={{ fontSize: 22 }} />}
          hoverColor={CLOSE_HOVER_COLOR}
          onClick={() => onClose()}
          baseColor={ACTION_BUTTON_BASE_COLOR}
          borderColor={isMobile ? 'rgba(255, 255, 255, 0.22)' : undefined}
          iconColor={ACTION_BUTTON_ICON_COLOR}
        />
      </Box>
    </Box>
  );

  const renderWordHero = () => {
    if (!strongsData) return null;

    return (
      <Box
        sx={{
          position: 'relative',
          zIndex: 'auto',
          borderRadius: '28px',
          background: languageStyle.wordCardBackground,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          gap: { xs: 2.5, md: 3 },
          px: { xs: 3, sm: 4, md: 6 },
          py: { xs: 4, md: 6 },
          overflow: 'visible',
        }}
      >
        {strongsData.originalWord && (
          <Typography
            sx={{
              fontSize: { xs: 34, sm: 40, md: 52 },
              fontWeight: 700,
              letterSpacing: '0.5px',
              backgroundImage: languageStyle.wordTextGradient,
              WebkitBackgroundClip: 'text',
              color: languageStyle.accentColor,
              textShadow: languageStyle.wordTextShadow,
              display: 'inline-block',
              lineHeight: 1,
              position: 'relative',
              zIndex: 0,
            }}
          >
            {strongsData.originalWord}
          </Typography>
        )}
        <Box
          sx={{
            position: 'relative',
            zIndex: 3,
            display: 'inline-flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1.25,
          }}
        >
          {strongsData.transliteration && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: '12px',
                backgroundColor: '#474747',
                position: 'relative',
                zIndex: 3,
                display: 'inline-flex',
                alignItems: 'center',
              }}
            >
              <Typography sx={{ fontSize: 18, fontWeight: 500, color: TEXT_COLOR_PRIMARY }}>
                {strongsData.transliteration}
              </Typography>
            </Box>
          )}
          {strongsData.strongsNumber && (
            <Box
              sx={{
                px: 2,
                py: 1,
                borderRadius: '12px',
                backgroundColor: '#474747',
                position: 'relative',
                zIndex: 3,
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: '999px',
                  background: languageStyle.highlightDotGradient,
                  boxShadow: languageStyle.highlightDotShadow,
                }}
              />
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: TEXT_COLOR_PRIMARY }}>
                {strongsData.strongsNumber}
              </Typography>
            </Box>
          )}
        </Box>
        {strongsData.englishWord && (
          <Typography
            sx={{
              fontSize: 18,
              lineHeight: 1.6,
              color: TEXT_COLOR_PRIMARY,
              maxWidth: 420,
              fontWeight: 400,
              position: 'relative',
              zIndex: 3,
            }}
          >
            {strongsData.englishWord}
          </Typography>
        )}
      </Box>
    );
  };

  const renderDefinitionCards = () => {
    if (!strongsData) return null;

    const detailItems: Array<{
      label: string;
      value: string;
      chip?: boolean;
      monospace?: boolean;
      typographySx?: object;
    }> = [
      { label: 'Root Word', value: strongsData.rootWord || '—' },
      { label: 'Grammar', value: strongsData.grammar || '—' },
      {
        label: 'Morphology',
        value: strongsData.morphology || '—',
        chip: true,
        monospace: true,
      },
      {
        label: 'Short Definition',
        value: strongsData.shortDefinition || '—',
        typographySx: {
          color: TEXT_COLOR_PRIMARY,
          fontSize: 17,
          fontWeight: 400,
          lineHeight: 1.6,
        },
      },
      {
        label: 'Frequency',
        value: strongsData.frequency
          ? `${formatNumber(strongsData.frequency)} occurrences`
          : '—',
      },
    ];

    return (
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(2, minmax(0, 1fr))' },
          gap: { xs: 3, md: 3.5 },
        }}
      >
        <Box
          sx={{
            background: languageStyle.wordCardBackground,
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
           gap: { xs: 1.5, md: 2.25 },
            gridRow: { xs: 2, md: 'auto' },
          }}
        >
          <Typography
            sx={{
          color: languageStyle.accentColor,
              fontSize: 12,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.7px',
              lineHeight: 1,
              mb: 0,
              opacity: 1,
            }}
          >
            Strong’s Definition
          </Typography>
          <Typography
            sx={{
              color: TEXT_COLOR_PRIMARY,
              fontSize: 17,
              lineHeight: 1.5,
              whiteSpace: 'pre-wrap',
            }}
          >
            {strongsData.definition || 'No definition available for this entry.'}
          </Typography>
          {strongsData.strongsNumber && (
            <Button
              component={Link}
              href={`/strongs/${strongsData.strongsNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              sx={{
                alignSelf: 'flex-start',
              px: 0,
              py: 0,
              textTransform: 'none',
              fontWeight: 500,
              fontSize: 16,
              color: languageStyle.accentColor,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 1,
                mt: 0.5,
                '&:hover': {
                  backgroundColor: 'transparent',
                  color: TEXT_COLOR_PRIMARY,
                },
              }}
            >
              View Full Lexicon
              <ArrowForwardIcon sx={{ fontSize: 18 }} />
            </Button>
          )}
        </Box>
        <Box
          sx={{
            background: languageStyle.wordCardBackground,
            borderRadius: '24px',
            p: { xs: 3, md: 4 },
            display: 'flex',
            flexDirection: 'column',
            gap: 2.5,
            gridRow: { xs: 1, md: 'auto' },
          }}
        >
          {detailItems.map(item => (
            <Box key={item.label} sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Typography
                sx={{
                  color: TEXT_COLOR_SECONDARY,
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.7px',
                  textTransform: 'uppercase',
                  lineHeight: 1,
                }}
              >
                {item.label}
              </Typography>
              {item.chip ? (
                <Box
                  sx={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    px: 1.5,
                    py: 0.75,
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.12)',
                  }}
                >
                  <Typography
                    sx={{
                      color: TEXT_COLOR_PRIMARY,
                      fontSize: 15,
                      fontWeight: 500,
                      fontFamily: item.monospace ? 'Fira Mono, monospace' : 'inherit',
                    }}
                  >
                    {item.value}
                  </Typography>
                </Box>
              ) : (
                <Typography
                  sx={{
                    color: TEXT_COLOR_PRIMARY,
                    fontSize: 18,
                    fontWeight: 400,
                    ...(item.typographySx ?? {}),
                  }}
                >
                  {item.value}
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    );
  };

  const renderNavigationRow = () => {
    if (!onNavigateToWord) {
      return null;
    }

    const previousWord = previousWordWithStrongs?.word;
    const nextWord = nextWordWithStrongs?.word;

    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 2,
          pt: { xs: 1, md: 2 },
        }}
      >
        <Box
          component={Primitive.button}
          type="button"
          disabled={!canNavigatePrevious}
          onClick={handlePrevious}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: TEXT_COLOR_PRIMARY,
            opacity: canNavigatePrevious ? 1 : 0.35,
            cursor: canNavigatePrevious ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease',
            font: 'inherit',
            outline: 'none',
            '&:hover': {
              backgroundColor: canNavigatePrevious ? 'rgba(255, 255, 255, 0.08)' : undefined,
            },
            '&:active': {
              transform: canNavigatePrevious ? 'scale(0.97)' : 'none',
            },
            '&:focus-visible': {
              outline: '2px solid rgba(255, 255, 255, 0.55)',
              outlineOffset: 4,
            },
          }}
        >
          <ArrowBackIcon sx={{ fontSize: 20 }} />
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {previousWord?.englishWord ?? 'Previous'}
          </Typography>
        </Box>
        <Box
          component={Primitive.button}
          type="button"
          disabled={!canNavigateNext}
          onClick={handleNext}
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 1.5,
            px: 2.5,
            py: 1.5,
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.12)',
            background: 'rgba(255, 255, 255, 0.04)',
            color: TEXT_COLOR_PRIMARY,
            opacity: canNavigateNext ? 1 : 0.35,
            cursor: canNavigateNext ? 'pointer' : 'not-allowed',
            transition: 'background-color 0.2s ease, transform 0.2s ease, opacity 0.2s ease',
            font: 'inherit',
            outline: 'none',
            '&:hover': {
              backgroundColor: canNavigateNext ? 'rgba(255, 255, 255, 0.08)' : undefined,
            },
            '&:active': {
              transform: canNavigateNext ? 'scale(0.97)' : 'none',
            },
            '&:focus-visible': {
              outline: '2px solid rgba(255, 255, 255, 0.55)',
              outlineOffset: 4,
            },
          }}
        >
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {nextWord?.englishWord ?? 'Next'}
          </Typography>
          <ArrowForwardIcon sx={{ fontSize: 20 }} />
        </Box>
      </Box>
    );
  };

  const router = useRouter();

  const handleOccurrenceClick = useCallback(
    (event: React.MouseEvent<HTMLElement>, href: string) => {
      event.preventDefault();
      if (!href) return;

      if (event.metaKey || event.ctrlKey) {
        if (typeof window !== 'undefined') {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
        return;
      }

      router.push(href);
    },
    [router],
  );

  const handleOccurrenceAuxClick = useCallback((event: React.MouseEvent<HTMLElement>, href: string) => {
    if (event.button !== 1) return;
    event.preventDefault();
    if (typeof window !== 'undefined') {
      window.open(href, '_blank', 'noopener,noreferrer');
    }
  }, []);

  const renderOccurrences = () => {
    const remainingOccurrences = Math.max(totalCount - verseReferences.length, 0);

    const occurrenceCards = verseReferences.map((ref, index) => {
      const verseText = getVerseText(ref);
      const highlighted = getHighlightedVerseText(ref.book, ref.chapter, ref.verse, verseText);
      const href = getReferenceHref(ref);

      return (
        <Box
          key={`${ref.reference}-${index}`}
          ref={node => {
            registerOccurrenceItem(index, node instanceof HTMLElement ? node : null);
          }}
          component={Primitive.button}
          type="button"
          aria-label={`Open ${ref.reference}`}
          onClick={event => handleOccurrenceClick(event, href)}
          onAuxClick={event => handleOccurrenceAuxClick(event, href)}
          sx={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: 1.5,
            minWidth: isMobile ? { xs: '85%', sm: 320 } : undefined,
            maxWidth: isMobile ? 420 : '100%',
            width: isMobile ? 'auto' : '100%',
            scrollSnapAlign: isMobile ? 'start' : undefined,
            padding: { xs: 2.5, md: 3 },
            borderRadius: '22px',
            background: languageStyle.occurrenceCardBackground,
            border: languageStyle.occurrenceCardBorder,
            appearance: 'none',
            textAlign: 'left',
            textDecoration: 'none',
            color: TEXT_COLOR_PRIMARY,
            transition:
              'transform 0.24s ease, background-color 0.24s ease, border-color 0.24s ease, color 0.24s ease',
            cursor: 'pointer',
            outline: 'none',
            '@media (hover: hover)': {
              '&:hover': {
                transform: 'translateY(-2px)',
                backgroundColor: 'rgba(255, 255, 255, 0.14)',
                borderColor: 'rgba(255, 255, 255, 0.22)',
              },
              '&:hover .occurrence-reference': {
                color: languageStyle.accentColor,
              },
              '&:hover .occurrence-icon': {
                color: languageStyle.accentColor,
              },
            },
            '&:focus-visible': {
              outline: '2px solid rgba(255, 255, 255, 0.65)',
              outlineOffset: 4,
            },
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                className="occurrence-reference"
                sx={{
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.7px',
                  textTransform: 'uppercase',
                  color: languageStyle.accentColor,
                  transition: 'color 0.2s ease',
                }}
              >
                {ref.reference}
              </Typography>
            </Box>
            <Box
              className="occurrence-icon"
              sx={{
                width: 32,
                height: 32,
                borderRadius: '10px',
                background: 'rgba(255, 255, 255, 0.08)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'rgba(255, 255, 255, 0.72)',
                transition: 'background-color 0.24s ease, color 0.24s ease',
                '@media (hover: hover)': {
                  '&:hover': {
                    backgroundColor: 'rgba(255, 255, 255, 0.16)',
                  },
                },
              }}
            >
              <OpenInNewIcon sx={{ fontSize: 18 }} />
            </Box>
          </Box>
          <Box sx={{ color: TEXT_COLOR_PRIMARY, fontSize: 15, lineHeight: 1.6 }}>
            {typeof highlighted === 'string' ? (
              <HighlightedText
                text={highlighted}
                searchTerms={highlightTerms}
                component="span"
                sx={{ color: TEXT_COLOR_PRIMARY, fontSize: 15, lineHeight: 1.6 }}
                highlightSx={{
                  backgroundColor: interlinearTheme.strongsColor,
                  color: '#000000',
                  fontWeight: 700,
                  borderRadius: '4px',
                  px: 0.75,
                  py: 0.25,
                }}
                options={{ caseSensitive: false, wholeWordsOnly: true }}
              />
            ) : (
              highlighted
            )}
          </Box>
        </Box>
      );
    });

    const occurrencesContent = (referencesLoading && currentPage === 1) ? (
      <Box sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner message="Loading occurrences..." />
      </Box>
    ) : verseReferences.length > 0 ? (
      <Box
        ref={occurrencesScrollRef}
        sx={
          isMobile
            ? {
                display: 'flex',
                flexDirection: 'row',
                gap: { xs: 2, md: 2.5 },
                flexWrap: 'nowrap',
                width: '100%',
                overflowX: 'auto',
                overflowY: 'hidden',
                pb: 1,
                scrollSnapType: 'x mandatory',
                '&::-webkit-scrollbar': {
                  height: 0,
                },
              }
            : {
                display: 'grid',
                gridTemplateColumns: {
                  md: 'repeat(2, minmax(0, 1fr))',
                  lg: 'repeat(2, minmax(0, 1fr))',
                },
                gap: { md: 2.5, lg: 3 },
              }
        }
      >
        {occurrenceCards}
        {isMobile && hasMore && (
          <Box
            component={Primitive.button}
            type="button"
            aria-label="Load more occurrences"
            onClick={loadMore}
            disabled={referencesFetching}
            sx={{
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              gap: 1,
              minWidth: { xs: '85%', sm: 320 },
              maxWidth: 420,
              width: 'auto',
              scrollSnapAlign: 'start',
              padding: { xs: 2.5, md: 3 },
              borderRadius: '22px',
              background: 'rgba(255, 255, 255, 0.08)',
              border: `1px dashed ${languageStyle.loadMoreBorder}`,
              color: languageStyle.accentColor,
              fontWeight: 600,
              textAlign: 'center',
              opacity: referencesFetching ? 0.5 : 1,
              cursor: referencesFetching ? 'wait' : 'pointer',
              transition: 'transform 0.24s ease, background-color 0.24s ease, border-color 0.24s ease',
              outline: 'none',
              '@media (hover: hover)': {
                '&:hover': {
                  transform: 'translateY(-2px)',
                  backgroundColor: 'rgba(255, 255, 255, 0.14)',
                  borderColor: languageStyle.loadMoreBorder,
                },
              },
              '&:focus-visible': {
                outline: '2px solid rgba(255, 255, 255, 0.65)',
                outlineOffset: 4,
              },
            }}
          >
            <Typography sx={{ fontSize: 15, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
              {referencesFetching ? 'Loading...' : 'View More'}
            </Typography>
            <Typography sx={{ fontSize: 13, color: TEXT_COLOR_SECONDARY, letterSpacing: '0.4px' }}>
              {referencesFetching ? 'Please wait' : `(${remainingOccurrences} remaining)`}
            </Typography>
          </Box>
        )}
      </Box>
    ) : (
      <Box
        sx={{
          p: { xs: 0, md: 2 },
          textAlign: isMobile ? 'left' : 'center',
          color: TEXT_COLOR_SECONDARY,
          fontSize: 15,
        }}
      >
        No occurrences available for this entry yet.
      </Box>
    );

    return (
      <Box
        sx={{
          background: languageStyle.wordCardBackground,
          borderRadius: '24px',
          boxShadow: 'none',
          p: { xs: 3, md: 4 },
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2.5, md: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.25, minWidth: 0 }}>
            <Box
              sx={{
                width: 36,
                height: 32,
                borderRadius: '12px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.18)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuBookOutlinedIcon sx={{ fontSize: 18, color: 'rgba(255, 255, 255, 0.9)' }} />
            </Box>
            <Typography sx={{ fontSize: 20, fontWeight: 700, color: TEXT_COLOR_PRIMARY }}>
              Occurrences
            </Typography>
            <Box
              sx={{
                px: 1,
                py: 0.35,
                background: 'rgba(255, 255, 255, 0.08)',
                borderRadius: '8px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Typography sx={{ fontSize: 12.5, fontWeight: 500, color: TEXT_COLOR_SECONDARY }}>
                {frequencyLabel}
              </Typography>
            </Box>
          </Box>
        </Box>

        {occurrencesContent}

        {!isMobile && hasMore && (
          <Box
            component={Primitive.button}
            type="button"
            onClick={loadMore}
            disabled={referencesFetching}
            sx={{
              alignSelf: 'stretch',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 1.5,
              px: 3,
              py: 1.4,
              borderRadius: '16px',
              border: `1px solid ${languageStyle.loadMoreBorder}`,
              backgroundColor: 'transparent',
              color: languageStyle.accentColor,
              fontSize: 16,
              opacity: referencesFetching ? 0.5 : 1,
              cursor: referencesFetching ? 'wait' : 'pointer',
              fontWeight: 500,
              textTransform: 'none',
              transition: 'background-color 0.2s ease, color 0.2s ease, transform 0.2s ease',
              outline: 'none',
              '&:hover': {
                backgroundColor: languageStyle.loadMoreHover,
                transform: 'translateY(-1px)',
              },
              '&:focus-visible': {
                outline: '2px solid rgba(255, 255, 255, 0.35)',
                outlineOffset: 4,
              },
              '&:active': {
                transform: 'translateY(0)',
              },
            }}
          >
            {referencesFetching ? 'Loading...' : 'View More'}
          </Box>
        )}
      </Box>
    );
  };
  const renderMainSections = () => (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4.25 } }}>
        {renderWordHero()}
        {renderDefinitionCards()}
      </Box>
      {renderOccurrences()}
      {renderNavigationRow()}
    </Box>
  );

  const renderBodyContent = () => {
    if (!strongsData) {
      return (
        <Box sx={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          py: 6,
          minWidth: { xs: '100%', md: 600 }
        }}>
          <LoadingSpinner message={isLoading ? 'Loading word study...' : 'Word study unavailable'} />
        </Box>
      );
    }

    return renderMainSections();
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
        minHeight: { xs: 'auto', md: 0 },
      }}
    >
      {renderHeader()}
      {isMobile ? (
        <Box
          sx={{
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            gap: { xs: 2, md: 3 },
            background: '#050505',
            px: { xs: 0, sm: MODAL_MOBILE_PADDING },
            pt: { xs: 0, sm: '16px' },
            pb: `calc(28px + env(safe-area-inset-bottom, 0px))`,
            mt: '-24px',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            boxShadow: '0px -18px 46px rgba(0, 0, 0, 0.45)',
            zIndex: 1,
            minHeight: 'auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            WebkitOverflowScrolling: 'touch',
            overscrollBehavior: 'contain',
          }}
        >
          <Box
            sx={{
              background: '#080808',
              borderRadius: '24px',
              px: { xs: 2.5, md: 4 },
              py: { xs: 3, md: 4 },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 4, md: 5 },
              minHeight: 'auto',
              isolation: 'isolate',
            }}
          >
            {renderBodyContent()}
          </Box>
        </Box>
      ) : (
        <Box
          sx={{
            position: 'relative',
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
            background: '#050505',
            px: 4,
            pt: 4,
            pb: 4,
            mt: '-32px',
            borderTopLeftRadius: '35px',
            borderTopRightRadius: '35px',
            boxShadow: '0px -18px 46px rgba(0, 0, 0, 0.45)',
            zIndex: 1,
            minHeight: { xs: 'auto', md: 0 },
          }}
        >
          <Box
            sx={{
              flex: 1,
              minHeight: { xs: 'auto', md: 0 },
              overflow: 'auto',
              borderRadius: '30px',
              background: '#080808',
              px: { xs: 3, md: 0 },
              py: { xs: 3, md: 0 },
            }}
          >
            {renderBodyContent()}
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
                    backgroundColor: 'rgba(4, 4, 4, 0.82)',
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
                  onAnimationComplete={() => {
                    window.setTimeout(() => {
                      const dialogContent = document.querySelector('[data-radix-dialog-content]');
                      if (dialogContent instanceof HTMLElement) {
                        dialogContent.style.setProperty('transform', 'none');
                      }
                    }, 300);
                  }}
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
                        <VerticalAd
                          key={`strongs-left-${adRefreshVersion}`}
                          slotId="MODAL_VERTICAL_LEFT"
                          placement="modal"
                          showPlaceholder={false}
                        />
                      </Box>
                      <Box
                        onClick={event => event.stopPropagation()}
                        sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                      >
                        {renderModalContent()}
                      </Box>
                      <Box sx={{ display: { xs: 'none', md: 'block' }, ml: 2 }}>
                        <VerticalAd
                          key={`strongs-right-${adRefreshVersion}`}
                          slotId="MODAL_VERTICAL_RIGHT"
                          placement="modal"
                          showPlaceholder={false}
                        />
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
