'use client';

import React, { useMemo, useState } from 'react';
import { Box, Typography } from '@mui/material';
import Image from 'next/image';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { WbSunnyOutlinedIcon } from '@/components/ui/phosphor-icons';
import { LocalLibraryIcon } from '@/components/ui/phosphor-icons';
import { ShortTextIcon } from '@/components/ui/phosphor-icons';
import { MusicNoteIcon } from '@/components/ui/phosphor-icons';
import { CampaignIcon } from '@/components/ui/phosphor-icons';
import { SchoolIcon } from '@/components/ui/phosphor-icons';
import { GavelIcon } from '@/components/ui/phosphor-icons';
import { FavoriteIcon } from '@/components/ui/phosphor-icons';
import { HighlightIcon } from '@/components/ui/phosphor-icons';
import { FormatQuoteIcon } from '@/components/ui/phosphor-icons';
import { BookmarkDisplay, BookmarkType } from '@/types/bookmark';
import { useDeleteBookmark } from '@/hooks/useBookmarkMutations';
import useResponsive from '@/hooks/useResponsive';
import { useRouter } from 'next/navigation';
import BookmarkDeleteModal from './BookmarkDeleteModal';
import { replaceReferenceShortcodes, bookNameToSlug } from '@/utils/stringHelpers';
import { getLastVersion } from '@/utils/localStorageUtils';
import { interlinearThemes } from '@/styles/interlinearThemes';
import { Primitive } from '@radix-ui/react-primitive';
import * as Tooltip from '@radix-ui/react-tooltip';
import { CustomChip } from '@/components/ui/CustomChip';

function firstDefined<T>(...values: Array<T | null | undefined>): T | undefined {
  return values.find((value) => value !== undefined && value !== null);
}

function appendHash(path: string, hash: string) {
  const [base] = path.split('#');
  return `${base}#${hash}`;
}

interface VerseParts {
  version?: string;
  bookSlug?: string;
  chapter?: number;
  verse?: number;
}

function parseVersePartsFromSlug(slug?: string | null): VerseParts {
  if (!slug) return {};

  const withoutHash = slug.split('#')[0] || '';
  if (!withoutHash) return {};

  const normalized = withoutHash.startsWith('/') ? withoutHash : `/${withoutHash}`;
  const segments = normalized.split('/').filter(Boolean);
  if (segments.length === 0) return {};

  const VERSION_PATTERN = /^[a-z0-9]{2,6}$/i;

  let version: string | undefined;
  let bookSlug: string | undefined;
  let chapter: number | undefined;
  let verse: number | undefined;

  let cursor = segments.length - 1;

  const isNumeric = (value?: string) => !!value && /^\d+$/.test(value);

  if (cursor >= 0 && isNumeric(segments[cursor])) {
    const parsed = Number.parseInt(segments[cursor]!, 10);
    cursor -= 1;

    if (cursor >= 0 && isNumeric(segments[cursor])) {
      verse = parsed;
      chapter = Number.parseInt(segments[cursor]!, 10);
      cursor -= 1;
    } else {
      chapter = parsed;
    }
  }

  if (cursor >= 0) {
    bookSlug = segments[cursor]!.toLowerCase();
    cursor -= 1;
  }

  if (cursor >= 0 && VERSION_PATTERN.test(segments[cursor]!)) {
    version = segments[cursor]!.toLowerCase();
  }

  return { version, bookSlug, chapter, verse };
}

function parseVersePartsFromReference(reference?: string | null): VerseParts {
  if (!reference) return {};

  const match = reference
    .trim()
    .replace(/\u2013/g, '-')
    .match(/^([1-3]?\s?[A-Za-z .']+?)\s+(\d+)(?::(\d+))?/);

  if (!match) return {};

  const [, bookPart, chapterPart, versePart] = match;
  const bookSlug = bookNameToSlug(bookPart.trim());
  const chapter = Number.parseInt(chapterPart ?? '', 10);
  const verse = versePart ? Number.parseInt(versePart, 10) : undefined;

  return {
    bookSlug,
    chapter: Number.isNaN(chapter) ? undefined : chapter,
    verse: verse && !Number.isNaN(verse) ? verse : undefined,
  };
}

function buildVersePath(parts: VerseParts, hash?: string) {
  const version = (parts.version ?? getLastVersion() ?? 'web').replace(/^\/+|\/+$/g, '').toLowerCase();
  const bookSlug = parts.bookSlug;
  if (!bookSlug) return null;

  const chapter = parts.chapter ?? 1;
  const verse = parts.verse ?? 1;

  const base = `/${version}/${bookSlug}/${chapter}/${verse}`;
  return hash ? appendHash(base, hash) : base;
}

function getBookmarkDestination(bookmark: BookmarkDisplay): string | null {
  const baseDestination = bookmark.slug ?? null;

  switch (bookmark.contentType) {
    case BookmarkType.TAKEAWAY: {
      const startVerse = bookmark.takeaway?.bibleVerseReference?.startVerse;
      const slugParts = parseVersePartsFromSlug(bookmark.slug);
      const referenceParts = parseVersePartsFromReference(
        bookmark.reference || bookmark.formattedReference || bookmark.title,
      );

      const verseParts: VerseParts = {
        version: slugParts.version,
        bookSlug: firstDefined(
          startVerse?.bookSlug?.toLowerCase(),
          slugParts.bookSlug,
          referenceParts.bookSlug,
        ),
        chapter: firstDefined(startVerse?.chapterNumber ?? undefined, slugParts.chapter, referenceParts.chapter),
        verse: firstDefined(startVerse?.verseNumber ?? undefined, slugParts.verse, referenceParts.verse),
      };

      const versePath = buildVersePath(verseParts, 'verse-takeaways');
      if (versePath) {
        return versePath;
      }

      return baseDestination ? appendHash(baseDestination, 'verse-takeaways') : null;
    }

    case BookmarkType.BOOK_OVERVIEW: {
      const slugParts = parseVersePartsFromSlug(bookmark.slug);
      const referenceParts = parseVersePartsFromReference(
        bookmark.reference || bookmark.formattedReference || bookmark.title,
      );

      const chapterFromBookmark = bookmark.bookChapter
        ? Number.parseInt(bookmark.bookChapter, 10)
        : undefined;

      const verseParts: VerseParts = {
        version: slugParts.version,
        bookSlug: firstDefined(
          bookmark.bookOverview?.bibleBook?.slug?.toLowerCase(),
          slugParts.bookSlug,
          referenceParts.bookSlug,
        ),
        chapter: firstDefined(chapterFromBookmark, slugParts.chapter, referenceParts.chapter),
        verse: firstDefined(slugParts.verse, referenceParts.verse),
      };

      const versePath = buildVersePath(verseParts, 'book-overview');
      if (versePath) {
        return versePath;
      }

      return baseDestination ? appendHash(baseDestination, 'book-overview') : null;
    }

    case BookmarkType.STRONGS_CONCORDANCE: {
      const key = bookmark.strongsEntry?.strongsKey;
      if (key) {
        return `/strongs/${key.toLowerCase()}`;
      }
      return baseDestination;
    }

    case BookmarkType.VERSE:
    case BookmarkType.VERSE_VERSION: {
      const slugParts = parseVersePartsFromSlug(bookmark.slug);
      const referenceParts = parseVersePartsFromReference(
        bookmark.reference || bookmark.formattedReference || bookmark.title,
      );

      const verseParts: VerseParts = {
        version: firstDefined(
          bookmark.contentType === BookmarkType.VERSE_VERSION
            ? bookmark.verseVersion?.versionName?.trim().toLowerCase().replace(/\s+/g, '-')
            : undefined,
          slugParts.version,
        ),
        bookSlug: firstDefined(
          bookmark.verse?.bookSlug?.toLowerCase(),
          slugParts.bookSlug,
          referenceParts.bookSlug,
        ),
        chapter: firstDefined(
          bookmark.verse?.chapterNumber ?? undefined,
          slugParts.chapter,
          referenceParts.chapter,
        ),
        verse: firstDefined(
          bookmark.verse?.verseNumber ?? undefined,
          slugParts.verse,
          referenceParts.verse,
        ),
      };

      const versePath = buildVersePath(verseParts);
      if (versePath) {
        return versePath;
      }

      return baseDestination;
    }

    default:
      return baseDestination;
  }
}

const createLineClamp = (lines: number) => ({
  display: '-webkit-box',
  WebkitLineClamp: lines,
  WebkitBoxOrient: 'vertical' as const,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

interface BookmarkCardProps {
  bookmark: BookmarkDisplay;
  onBookmarkDeleted?: (bookmarkId: string) => void;
}

interface BookmarkTheme {
  icon: React.ReactNode;
  iconGradient: string;
  glowColor: string;
  labelColor: string;
  iconBoxShadow: string;
}

const getBookmarkAuthor = (bookmark: BookmarkDisplay) =>
  bookmark.commentary?.author ?? bookmark.author;

function getBookmarkTheme(bookmark: BookmarkDisplay): BookmarkTheme {
  const author = getBookmarkAuthor(bookmark);

  // For commentary, we'll handle the author avatar specially
  if (bookmark.contentType === BookmarkType.COMMENTARY) {
    const primary = author?.colorScheme?.primary || '#278EFF';
    return {
      icon: null, // Will be replaced with author avatar
      iconGradient: `linear-gradient(135deg, ${primary} 0%, #000000 100%)`,
      glowColor: `rgba(${hexToRgb(primary)}, 0.3)`,
      labelColor: author?.colorScheme?.chipText || '#96C2FF',
      iconBoxShadow: `0 0 20px rgba(${hexToRgb(primary)}, 0.25)`,
    };
  }

  switch (bookmark.contentType) {
    case BookmarkType.TAKEAWAY:
      return {
        icon: <WbSunnyOutlinedIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #7F38BE 0%, #A632D5 100%)',
        glowColor: 'rgba(159, 56, 230, 0.3)',
        labelColor: '#E0BAFF',
        iconBoxShadow: '0 0 20px rgba(159, 56, 230, 0.25)',
      };

    case BookmarkType.BOOK_OVERVIEW:
      return {
        icon: <LocalLibraryIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #1F8FC9 0%, #10915F 100%)',
        glowColor: 'rgba(46, 196, 182, 0.3)',
        labelColor: '#B7F0E3',
        iconBoxShadow: '0 0 20px rgba(46, 196, 182, 0.25)',
      };

    case BookmarkType.VERSE:
      return {
        icon: <BookmarkBorderIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #1B9CEE 0%, #0C5F9C 100%)',
        glowColor: 'rgba(27, 156, 238, 0.3)',
        labelColor: '#D9FAFF',
        iconBoxShadow: '0 0 20px rgba(27, 156, 238, 0.25)',
      };

    case BookmarkType.VERSE_VERSION:
      return {
        icon: <ShortTextIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #278EFF 0%, #1A2E60 100%)',
        glowColor: 'rgba(39, 142, 255, 0.3)',
        labelColor: '#C8DCFF',
        iconBoxShadow: '0 0 20px rgba(39, 142, 255, 0.25)',
      };

    case BookmarkType.STRONGS_CONCORDANCE: {
      const language = detectStrongsLanguage(bookmark);
      const theme = interlinearThemes[language];
      const isHebrew = language === 'HEBREW';

      return {
        icon: (
          <Typography sx={{ color: 'white', fontSize: isHebrew ? 23 : 20, fontWeight: 400, lineHeight: 1, mt: isHebrew ? '-3px' : '-1px' }}>
            {isHebrew ? 'א' : 'α'}
          </Typography>
        ),
        iconGradient: isHebrew
          ? 'linear-gradient(135deg, #F9D849 0%, #998100 100%)'
          : 'linear-gradient(135deg, #89B7F9 0%, #4A7BC8 100%)',
        glowColor: `rgba(${hexToRgb(theme.buttonActiveBg)}, 0.3)`,
        labelColor: isHebrew ? '#F4D87A' : '#C8DCFF',
        iconBoxShadow: `0 0 20px rgba(${hexToRgb(theme.buttonActiveBg)}, 0.25)`,
      };
    }

    case BookmarkType.HYMN:
      return {
        icon: <MusicNoteIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #E91E63 0%, #880E4F 100%)',
        glowColor: 'rgba(233, 30, 99, 0.3)',
        labelColor: '#FFCDD2',
        iconBoxShadow: '0 0 20px rgba(233, 30, 99, 0.25)',
      };

    case BookmarkType.SERMON:
      return {
        icon: <CampaignIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #FF6F00 0%, #E65100 100%)',
        glowColor: 'rgba(255, 111, 0, 0.3)',
        labelColor: '#FFD180',
        iconBoxShadow: '0 0 20px rgba(255, 111, 0, 0.25)',
      };

    case BookmarkType.CATECHISM:
      return {
        icon: <SchoolIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        glowColor: 'rgba(76, 175, 80, 0.3)',
        labelColor: '#C8E6C9',
        iconBoxShadow: '0 0 20px rgba(76, 175, 80, 0.25)',
      };

    case BookmarkType.CREED:
      return {
        icon: <GavelIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #3F51B5 0%, #1A237E 100%)',
        glowColor: 'rgba(63, 81, 181, 0.3)',
        labelColor: '#C5CAE9',
        iconBoxShadow: '0 0 20px rgba(63, 81, 181, 0.25)',
      };

    case BookmarkType.DEVOTIONAL:
      return {
        icon: <FavoriteIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)',
        glowColor: 'rgba(244, 67, 54, 0.3)',
        labelColor: '#FFCDD2',
        iconBoxShadow: '0 0 20px rgba(244, 67, 54, 0.25)',
      };

    case BookmarkType.BOOK_HIGHLIGHT:
      return {
        icon: <HighlightIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #FFC107 0%, #F57C00 100%)',
        glowColor: 'rgba(255, 193, 7, 0.3)',
        labelColor: '#FFE082',
        iconBoxShadow: '0 0 20px rgba(255, 193, 7, 0.25)',
      };

    default:
      return {
        icon: <FormatQuoteIcon sx={{ color: 'white', fontSize: 19 }} />,
        iconGradient: 'linear-gradient(135deg, #9E9E9E 0%, #424242 100%)',
        glowColor: 'rgba(158, 158, 158, 0.3)',
        labelColor: 'rgba(255, 255, 255, 0.75)',
        iconBoxShadow: '0 0 20px rgba(158, 158, 158, 0.25)',
      };
  }
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return '255, 255, 255';
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}

// Helper to detect if Strong's number is Greek or Hebrew
function detectStrongsLanguage(bookmark: BookmarkDisplay): 'GREEK' | 'HEBREW' {
  const key = bookmark.strongsEntry?.strongsKey || '';

  // Check for explicit G or H prefix
  if (key.toUpperCase().startsWith('G')) return 'GREEK';
  if (key.toUpperCase().startsWith('H')) return 'HEBREW';

  // Fallback: Extract number and use ranges
  // Hebrew: H1-H8674
  // Greek: G1-G5624
  const numMatch = key.match(/\d+/);
  if (numMatch) {
    const num = parseInt(numMatch[0], 10);
    // If number is greater than Greek range, assume Hebrew
    return num > 5624 ? 'HEBREW' : 'GREEK';
  }

  // Default to Hebrew (most common in OT)
  return 'HEBREW';
}

function getContentTypeLabel(type: BookmarkType): string {
  switch (type) {
    case BookmarkType.COMMENTARY:
      return 'COMMENTARY';
    case BookmarkType.HYMN:
      return 'HYMN';
    case BookmarkType.SERMON:
      return 'SERMON';
    case BookmarkType.CATECHISM:
      return 'CATECHISM';
    case BookmarkType.CREED:
      return 'CREED';
    case BookmarkType.DEVOTIONAL:
      return 'DEVOTIONAL';
    case BookmarkType.BOOK_HIGHLIGHT:
      return 'BOOK HIGHLIGHT';
    case BookmarkType.VERSE:
      return 'VERSE';
    case BookmarkType.VERSE_VERSION:
      return 'VERSE VERSION';
    case BookmarkType.BOOK_OVERVIEW:
      return 'BOOK OVERVIEW';
    case BookmarkType.TAKEAWAY:
      return 'TAKEAWAY';
    case BookmarkType.STRONGS_CONCORDANCE:
      return "STRONG'S CONCORDANCE";
    default:
      return 'OTHER';
  }
}

// Smart preview text generation
function getPreviewParts(bookmark: BookmarkDisplay) {
  const MAX_PREVIEW_LENGTH = 150;
  const author = getBookmarkAuthor(bookmark);

  const truncate = (text: string, maxLength: number = MAX_PREVIEW_LENGTH) => {
    if (!text) return '';
    const cleaned = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    if (cleaned.length <= maxLength) return cleaned;
    return cleaned.substring(0, maxLength).trim() + '...';
  };

  const first = (s?: string | null) => (s ?? '').trim();
  const nonEmpty = (...vals: (string | null | undefined)[]) =>
    vals.find((v) => (v ?? '').trim().length > 0)?.trim() ?? '';

  switch (bookmark.contentType) {
    case BookmarkType.COMMENTARY:
      return {
        title: bookmark.formattedReference || bookmark.reference || 'Scripture',
        label: author?.name || 'Commentary',
        body: truncate(replaceReferenceShortcodes(getLastVersion(), first(bookmark.excerpt) || first(bookmark.description) || '')),
        metadata: null,
      };

    case BookmarkType.TAKEAWAY: {
      const ex = bookmark.takeaway?.excerpts?.[0];
      const totalCount = bookmark.takeaway?.excerpts?.length || 0;
      const content = first(ex?.content) || '';
      const bodyText = ex?.title ? `*${ex.title}:* ${content}` : content;
      const processedBody = replaceReferenceShortcodes(getLastVersion(), bodyText);
      return {
        title: bookmark.formattedReference || bookmark.reference || 'Takeaways',
        label: 'Takeaways',
        body: truncate(processedBody),
        metadata: totalCount > 0 ? `${totalCount} Available` : null,
      };
    }

    case BookmarkType.BOOK_OVERVIEW: {
      const highlights = bookmark.highlights?.filter(h => h?.value) ?? [];
      return {
        title: nonEmpty(bookmark.bookOverview?.bibleBook?.name, bookmark.title, 'Book Overview'),
        label: 'Book Overview',
        body: truncate(first(bookmark.description) || first(highlights[0]?.value) || ''),
        metadata: null,
      };
    }

    case BookmarkType.VERSE:
      return {
        title: nonEmpty(bookmark.formattedReference, bookmark.reference, bookmark.title, 'Verse'),
        label: 'Verse',
        body: truncate(first(bookmark.description) || ''),
        metadata: null,
      };

    case BookmarkType.VERSE_VERSION: {
      // Extract version acronym and reference from title (e.g., "WEB - Genesis 1:1")
      const rawTitle = (bookmark.title || '').trim();
      const dashIndex = rawTitle.indexOf(' - ');
      const versionAcronym = dashIndex !== -1 ? rawTitle.substring(0, dashIndex).trim() : rawTitle;
      const referenceFromTitle = dashIndex !== -1 ? rawTitle.substring(dashIndex + 3).trim() : '';

      const combinedTitle = (() => {
        if (!rawTitle) {
          return nonEmpty(referenceFromTitle, bookmark.reference, bookmark.formattedReference, 'Verse');
        }

        if (dashIndex !== -1) {
          const pieces = [versionAcronym, referenceFromTitle].filter(Boolean);
          if (pieces.length) {
            return pieces.join(' ');
          }
        }

        return rawTitle;
      })();

      const metadataValue = versionAcronym && versionAcronym !== combinedTitle ? versionAcronym : null;

      return {
        title: combinedTitle,
        label: 'Verse',
        body: truncate(first(bookmark.verseVersion?.content) || first(bookmark.description) || ''),
        metadata: metadataValue,
      };
    }

    case BookmarkType.HYMN:
      return {
        title: nonEmpty(bookmark.title, 'Hymn'),
        label: 'Hymn',
        body: truncate(replaceReferenceShortcodes(getLastVersion(), first(bookmark.hymnText) || first(bookmark.description) || '')),
        metadata: author?.name ? `by ${author.name}` : null,
      };

    case BookmarkType.SERMON:
      return {
        title: nonEmpty(bookmark.title, 'Sermon'),
        label: 'Sermon',
        body: truncate(replaceReferenceShortcodes(getLastVersion(), first(bookmark.sermonText) || first(bookmark.description) || '')),
        metadata: author?.name ? `by ${author.name}` : null,
      };

    case BookmarkType.BOOK_HIGHLIGHT:
      return {
        title: nonEmpty(bookmark.bookTitle, bookmark.title, 'Book Highlight'),
        label: 'Book Highlight',
        body: truncate(replaceReferenceShortcodes(getLastVersion(), first(bookmark.highlightedText) || first(bookmark.description) || '')),
        metadata: author?.name ? `by ${author.name}` : null,
      };

    case BookmarkType.STRONGS_CONCORDANCE: {
      const s = bookmark.strongsEntry;
      const language = detectStrongsLanguage(bookmark);
      const primaryDefinition = first(s?.shortDefinition) || first(bookmark.description) || first(s?.strongsDef) || '';
      const truncatedPrimary = truncate(primaryDefinition);

      return {
        title: nonEmpty(s?.originalWord, bookmark.title, "Strong's Entry"),
        label: language === 'HEBREW' ? 'Hebrew Word' : 'Greek Word',
        body: truncatedPrimary,
        metadata: null,
      };
    }

    default:
      return {
        title: nonEmpty(bookmark.title, 'Content'),
        label: getContentTypeLabel(bookmark.contentType),
        body: truncate(first(bookmark.description) || ''),
        metadata: null,
      };
  }
}

export default function BookmarkCard({
  bookmark,
  onBookmarkDeleted,
}: BookmarkCardProps) {
  const [isRemoving, setIsRemoving] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { isMdUp } = useResponsive();
  const { deleteBookmark, isLoading } = useDeleteBookmark();
  const router = useRouter();

  const author = useMemo(() => getBookmarkAuthor(bookmark), [bookmark]);
  const theme = useMemo(() => getBookmarkTheme(bookmark), [bookmark]);
  const preview = useMemo(() => getPreviewParts(bookmark), [bookmark]);
  const destination = useMemo(() => getBookmarkDestination(bookmark), [bookmark]);
  const canNavigate = Boolean(destination);

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isLoading || isRemoving) return;

    if (!isMdUp) {
      setShowDeleteModal(true);
      return;
    }
    handleDeleteBookmark();
  };

  const handleDeleteBookmark = async () => {
    if (isLoading || isRemoving) return;

    setIsRemoving(true);
    setShowDeleteModal(false);

    try {
      await new Promise((resolve) => setTimeout(resolve, 300));
      await deleteBookmark({
        id: bookmark.id,
        userId: bookmark.userId,
      });
      onBookmarkDeleted?.(bookmark.id);
    } catch {
      setIsRemoving(false);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
  };

  const handleNavigateToBookmark = () => {
    if (!destination) return;

    router.push(destination);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (!destination) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleNavigateToBookmark();
    }
  };

  return (
    <>
      <Box
        component="div"
        onMouseEnter={() => isMdUp && setIsHovered(true)}
        onMouseLeave={() => isMdUp && setIsHovered(false)}
        onClick={handleNavigateToBookmark}
        onKeyDown={handleCardKeyDown}
        role={canNavigate ? 'button' : undefined}
        tabIndex={canNavigate ? 0 : -1}
        aria-disabled={!canNavigate}
        sx={{
          width: '100%',
          height: isMdUp ? 273 : 247,
          p: 3,
          borderRadius: 3.5,
          display: 'flex',
          flexDirection: 'column',
          background: '#1A1A1A',
          border: 'none',
          textAlign: 'left',
          font: 'inherit',
          color: 'inherit',
          appearance: 'none',
          WebkitTapHighlightColor: 'transparent',
          cursor: canNavigate ? 'pointer' : 'default',
          position: 'relative',
          overflow: 'hidden',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          boxShadow: isHovered && isMdUp ? '0px 8px 24px rgba(0,0,0,0.3)' : 'none',
          transform: isHovered && canNavigate && isMdUp ? 'translateY(-4px)' : 'none',
          outline: 'none',
          '&:focus-visible': {
            outline: '3px solid rgba(255, 255, 255, 0.75)',
            outlineOffset: '4px',
          },
          '&:hover .bookmark-arrow': canNavigate && isMdUp ? {
            transform: 'translateX(4px)',
            color: '#FFFAFA',
          } : undefined,
          '&:hover .bookmark-footer': canNavigate && isMdUp ? {
            color: '#FFFAFA',
          } : undefined,
        }}
      >
        {/* Header with Icon Box and Delete Button */}
        <Box sx={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          mb: 4.5,
          position: 'relative',
          zIndex: 2,
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            {/* Icon Box with Glow (matching HomepageMissionSection pattern) */}
            <Box sx={{
              width: 34,
              height: 34,
              position: 'relative',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              {/* Large glow effect layer */}
              <Box sx={{
                position: 'absolute',
                width: '750px',
                height: '750px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.glowColor} 0%, ${theme.glowColor.replace('0.3', '0.15')} 50%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%',
                opacity: isHovered && isMdUp ? 1 : 0.7,
                pointerEvents: 'none',
                filter: 'blur(12px)',
                transition: 'opacity 0.2s ease',
              }} />

              {/* Small glow effect layer */}
              <Box sx={{
                position: 'absolute',
                width: '100px',
                height: '100px',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${theme.glowColor} 0%, ${theme.glowColor.replace('0.3', '0.15')} 50%, transparent 70%)`,
                transform: 'translate(-50%, -50%)',
                top: '50%',
                left: '50%',
                opacity: isHovered && isMdUp ? 1 : 0.7,
                pointerEvents: 'none',
                filter: 'blur(12px)',
                transition: 'opacity 0.2s ease',
              }} />

              {/* Icon circle */}
              <Box sx={{
                width: 34,
                height: 34,
                background: theme.iconGradient,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                boxShadow: theme.iconBoxShadow,
                overflow: 'hidden',
              }}>
                {bookmark.contentType === BookmarkType.COMMENTARY && author?.image ? (
                  <Image
                    src={author.image}
                    alt={author.name}
                    width={34}
                    height={34}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      objectPosition: 'center',
                    }}
                  />
                ) : (
                  theme.icon
                )}
              </Box>
            </Box>

            {/* Label text */}
            <Typography sx={{
              fontSize: 14,
              color: theme.labelColor,
              fontWeight: 500,
            }}>
              {preview.label}
            </Typography>
          </Box>

          {/* Delete button */}
          {isMdUp ? (
            <Tooltip.Provider delayDuration={300}>
              <Tooltip.Root>
                <Tooltip.Trigger asChild>
                  <Box
                    component={Primitive.button}
                    type="button"
                    onClick={handleDeleteClick}
                    aria-label="Remove Bookmark"
                    sx={{
                      width: 28,
                      height: 28,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      borderRadius: '50%',
                      color: 'rgba(255, 255, 255, 0.4)',
                      border: 'none',
                      background: 'transparent',
                      padding: 0,
                      transition: 'background-color 0.2s ease, color 0.2s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: 'rgba(255, 255, 255, 0.6)',
                      },
                      '&:focus-visible': {
                        outline: '2px solid rgba(255, 255, 255, 0.6)',
                        outlineOffset: '2px',
                      },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 18 }} />
                  </Box>
                </Tooltip.Trigger>
                <Tooltip.Portal>
                  <Tooltip.Content
                    side="left"
                    sideOffset={5}
                    style={{
                      backgroundColor: 'rgba(16,16,16,0.92)',
                      color: '#FFFAFA',
                      padding: '6px 12px',
                      borderRadius: '8px',
                      fontSize: '13px',
                      fontWeight: 500,
                      boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
                      zIndex: 1000,
                    }}
                  >
                    Remove Bookmark
                    <Tooltip.Arrow
                      style={{
                        fill: 'rgba(16,16,16,0.92)',
                      }}
                    />
                  </Tooltip.Content>
                </Tooltip.Portal>
              </Tooltip.Root>
            </Tooltip.Provider>
          ) : (
            <Box
              component={Primitive.button}
              type="button"
              onClick={handleDeleteClick}
              aria-label="Remove Bookmark"
              sx={{
                width: 28,
                height: 28,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                borderRadius: '50%',
                color: 'rgba(255, 255, 255, 0.4)',
                border: 'none',
                background: 'transparent',
                padding: 0,
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </Box>
          )}
        </Box>

        {/* Content Area */}
        <Box sx={{
          flexGrow: 1,
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          gap: 1,
          position: 'relative',
          zIndex: 2,
        }}>
          {/* Title */}
          {bookmark.contentType === BookmarkType.COMMENTARY ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{
                fontSize: { xs: 18, md: 20 },
                fontWeight: 700,
                lineHeight: 1.3,
                color: '#FFFAFA',
              }}>
                {preview.title}
              </Typography>
              <CustomChip
                label="Commentary"
                bgColor={`${author?.colorScheme?.primary || '#278EFF'}4D`}
                textColor={author?.colorScheme?.chipText || '#96C2FF'}
                fontSize={12}
                fontWeight={500}
                borderRadius={1}
                padding="2px 8px"
              />
            </Box>
          ) : bookmark.contentType === BookmarkType.TAKEAWAY && preview.metadata ? (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Typography sx={{
                fontSize: { xs: 18, md: 20 },
                fontWeight: 700,
                lineHeight: 1.3,
                color: '#FFFAFA',
              }}>
                {preview.title}
              </Typography>
              <CustomChip
                label={preview.metadata}
                bgColor="rgba(127, 56, 190, 0.30)"
                textColor="#E0BAFF"
                fontSize={12}
                fontWeight={500}
                borderRadius={1}
                padding="2px 8px"
              />
            </Box>
          ) : (
            <Typography sx={{
              fontSize: { xs: 18, md: 20 },
              fontWeight: 700,
              lineHeight: 1.3,
              color: '#FFFAFA',
              ...createLineClamp(2),
            }}>
              {preview.title}
            </Typography>
          )}

          {/* Preview text */}
          <Typography
            sx={{
              fontSize: 14,
              lineHeight: 1.6,
              color: 'rgba(255, 255, 255, 0.75)',
              ...createLineClamp(isMdUp ? 4 : 3),
              '& strong': {
                fontWeight: 700,
              },
            }}
            dangerouslySetInnerHTML={{ __html: preview.body }}
          />

          {/* Metadata if present (excluding TAKEAWAY which shows in chip) */}
          {preview.metadata &&
           bookmark.contentType !== BookmarkType.TAKEAWAY && (
            <Typography sx={{
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.5)',
              fontWeight: 500,
            }}>
              {preview.metadata}
            </Typography>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pt: 2,
          borderTop: '1px solid rgba(255, 255, 255, 0.06)',
          position: 'relative',
          zIndex: 2,
        }}>
          <Typography
            className="bookmark-footer"
            sx={{
              fontSize: 12,
              color: 'rgba(255, 255, 255, 0.4)',
              transition: 'color 0.15s ease-out',
            }}
          >
            Saved on {bookmark.formattedDate || 'Unknown date'}
          </Typography>
          <ArrowForwardIcon
            className="bookmark-arrow"
            sx={{
              fontSize: 16,
              color: 'rgba(255, 255, 255, 0.4)',
              transition: 'transform 0.15s ease-out, color 0.15s ease-out',
            }}
          />
        </Box>
      </Box>

      <BookmarkDeleteModal
        open={showDeleteModal}
        onClose={handleCloseModal}
        onConfirm={handleDeleteBookmark}
        bookmark={bookmark}
        isLoading={isLoading}
      />
    </>
  );
}
