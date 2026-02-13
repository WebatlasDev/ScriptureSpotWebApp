'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import Link from 'next/link';
import { Box, Menu, MenuItem, useMediaQuery, Modal, Typography } from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { useTheme } from '@mui/material/styles';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useBibleVersions } from '@/hooks/useBibleVersions';
import { usePrefetchVerse } from '@/hooks/usePrefetchVerse';
import { ArrowBackIosNewIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIosIcon } from '@/components/ui/phosphor-icons';
import { safeSetItem } from '@/utils/localStorageUtils';
import { getChapterCount, getVerseCount } from '@/data/bibleStructure';
import { buildUrl } from '@/utils/navigation';
import IconActionButton from './IconActionButton';
import VersePickerSheet from '@/components/common/VersePickerSheet';

const MOBILE_BOOK_NAME_MAP: Record<string, string> = {
  'Song of Solomon': 'Songs',
  Deuteronomy: 'Deut.',
  '1 Chronicles': '1 Chr.',
  '2 Chronicles': '2 Chr.',
  '1 Corinthians': '1 Cor.',
  '2 Corinthians': '2 Cor.',
  Ephesians: 'Eph.',
  Philippians: 'Phil.',
  Colossians: 'Col.',
  '1 Thessalonians': '1 Thess.',
  '2 Thessalonians': '2 Thess.',
  '1 Timothy': '1 Tim.',
  '2 Timothy': '2 Tim.',
  Philemon: 'Phlm.',
  Revelation: 'Rev.',
};

const getMobileBookName = (name: string) => MOBILE_BOOK_NAME_MAP[name] ?? name;

interface BibleBook {
  slug: string;
  name: string;
}

interface VerseNavigationBarProps {
  version: string;
  bookSlug: string;
  bookName: string;
  chapterNumber: number;
  verseNumber: number;
  onNavigateStart?: () => void;
}

export default function VerseNavigationBar({
  version,
  bookSlug,
  bookName,
  chapterNumber,
  verseNumber,
  onNavigateStart,
}: VerseNavigationBarProps) {
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const { data: books } = useBibleBooks();
  const { data: versions } = useBibleVersions();
  const { prefetchAdjacentVerses } = usePrefetchVerse();

  const booksList = useMemo(() => (Array.isArray(books) ? (books as BibleBook[]) : []), [books]);

  const bookNameBySlug = useMemo(() => {
    if (!booksList.length) {
      return {} as Record<string, string>;
    }

    return booksList.reduce((acc, book) => {
      acc[book.slug] = book.name;
      return acc;
    }, {} as Record<string, string>);
  }, [booksList]);

  const maxChapters = getChapterCount(bookSlug) || 1;
  const maxVerses = getVerseCount(bookSlug, chapterNumber) || 1;

  const prevVerse = verseNumber > 1 ? verseNumber - 1 : null;
  const nextVerse = verseNumber < maxVerses ? verseNumber + 1 : null;
  const prevChapter = chapterNumber > 1 ? chapterNumber - 1 : null;
  const nextChapter = chapterNumber < maxChapters ? chapterNumber + 1 : null;
  const lastVerseInPrevChapter = prevChapter ? getVerseCount(bookSlug, prevChapter) || 1 : null;

  const previousTarget = prevVerse
    ? { chapter: chapterNumber.toString(), verse: prevVerse.toString() }
    : prevChapter
      ? { chapter: prevChapter.toString(), verse: (lastVerseInPrevChapter ?? 1).toString() }
      : null;

  const nextTarget = nextVerse
    ? { chapter: chapterNumber.toString(), verse: nextVerse.toString() }
    : nextChapter
      ? { chapter: nextChapter.toString(), verse: '1' }
      : null;

  const prevHref = previousTarget
    ? buildUrl({ version, book: bookSlug, chapter: previousTarget.chapter, verse: previousTarget.verse })
    : undefined;

  const nextHref = nextTarget
    ? buildUrl({ version, book: bookSlug, chapter: nextTarget.chapter, verse: nextTarget.verse })
    : undefined;

  // Prefetch adjacent verses on mount and when navigation changes
  useEffect(() => {
    if (bookSlug && chapterNumber && verseNumber && version) {
      prefetchAdjacentVerses(
        bookSlug,
        chapterNumber,
        verseNumber,
        version,
        maxVerses,
        maxChapters
      );
    }
  }, [bookSlug, chapterNumber, verseNumber, version, maxVerses, maxChapters, prefetchAdjacentVerses]);

  // Version menu state
  const [versionMenuAnchor, setVersionMenuAnchor] = useState<null | HTMLElement>(null);

  const [pickerMode, setPickerMode] = useState<'mobile' | 'desktop' | null>(null);
  const [pickerValues, setPickerValues] = useState({
    book: bookSlug,
    chapter: chapterNumber,
    verse: verseNumber,
  });

  useEffect(() => {
    setPickerValues({
      book: bookSlug,
      chapter: chapterNumber,
      verse: verseNumber,
    });
  }, [bookSlug, chapterNumber, verseNumber]);

  // Refs for auto-scrolling to current selections
  const desktopBookScrollRef = useRef<HTMLDivElement>(null);
  const desktopChapterScrollRef = useRef<HTMLDivElement>(null);
  const desktopVerseScrollRef = useRef<HTMLDivElement>(null);

  // Static counts for picker - instant response
  const pickerMaxChapters = getChapterCount(pickerValues.book) || 1;
  const pickerMaxVerses = getVerseCount(pickerValues.book, pickerValues.chapter) || 1;
  const pickerHref = buildUrl({
    version,
    book: pickerValues.book,
    chapter: pickerValues.chapter.toString(),
    verse: pickerValues.verse.toString(),
  });

  // Auto-scroll utility function
  const scrollToSelected = (
    containerRef: React.RefObject<HTMLDivElement | null>,
    value: string
  ) => {
    const container = containerRef.current;
    if (!container) {
      return;
    }

    const target = container.querySelector<HTMLElement>(`[data-value="${value}"]`);
    target?.scrollIntoView({ block: 'center', behavior: 'auto' });
  };

  useEffect(() => {
    if (pickerMode !== 'desktop' || !booksList.length) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToSelected(desktopBookScrollRef, pickerValues.book);
      scrollToSelected(desktopChapterScrollRef, pickerValues.chapter.toString());
      scrollToSelected(desktopVerseScrollRef, pickerValues.verse.toString());
    });
  }, [pickerMode, booksList, pickerValues.book, pickerValues.chapter, pickerValues.verse]);

  const updateLastVerse = (
    newVersion: string,
    newBook: string,
    newChapter: number | string,
    newVerse: number | string
  ) => {
    if (typeof window !== 'undefined') {
      try {
        const chapterValue = newChapter.toString();
        const verseValue = newVerse.toString();
        const bookName = bookNameBySlug[newBook] ?? newBook;
        const formattedReference = `${bookName} ${chapterValue}:${verseValue}`;
        const path = buildUrl({
          version: newVersion,
          book: newBook,
          chapter: chapterValue,
          verse: verseValue,
        });
        const lastVerseData = {
          path,
          reference: formattedReference,
        };
        safeSetItem('lastVerse', JSON.stringify(lastVerseData));
      } catch {
        // Ignore storage errors
      }
    }
  };

  const handlePreviousClick = () => {
    if (previousTarget) {
      onNavigateStart?.();
      updateLastVerse(version, bookSlug, previousTarget.chapter, previousTarget.verse);
    }
  };

  const handleNextClick = () => {
    if (nextTarget) {
      onNavigateStart?.();
      updateLastVerse(version, bookSlug, nextTarget.chapter, nextTarget.verse);
    }
  };

  const openPicker = (mode: 'mobile' | 'desktop') => {
    setPickerValues({
      book: bookSlug,
      chapter: chapterNumber,
      verse: verseNumber,
    });
    setPickerMode(mode);
  };

  const closePicker = () => {
    setPickerMode(null);
  };

  const renderDesktopDropdown = () => (
    <Modal
      open={pickerMode === 'desktop'}
      onClose={closePicker}
      closeAfterTransition
      disableAutoFocus
      disableEnforceFocus
      sx={{
        '&:focus-visible': { outline: 'none' },
        '&:focus': { outline: 'none' },
        '& .MuiModal-backdrop': { '&:focus-visible': { outline: 'none' }, '&:focus': { outline: 'none' } }
      }}
      slotProps={{
        backdrop: {
          timeout: 300,
          style: { backgroundColor: 'rgba(0, 0, 0, 0.75)' }
        }
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          backgroundColor: '#1A1A1A',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: 2.5,
          p: 3,
          color: 'text.primary',
          width: 580,
          boxShadow: '0px 10px 38px -10px rgba(0, 0, 0, 0.35), 0px 10px 20px -15px rgba(0, 0, 0, 0.2)',
          height: 430,
          display: 'flex',
          flexDirection: 'column',
          outline: 'none',
        }}
      >
        <Typography variant="subtitle1" sx={{ mb: 2.5, textAlign: 'center', color: 'text.primary', fontWeight: 500 }}>
          Navigate to Verse
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2, mb: 3, flex: 1 }}>
          {/* Book Picker */}
          <Box sx={{ flex: 2 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 500 }}>
              Book
            </Typography>
            <Box 
              ref={desktopBookScrollRef}
              sx={{ 
                height: 240, 
                overflowY: 'auto', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: 1,
                backgroundColor: '#1A1A1A',
                overscrollBehavior: 'contain'
              }}
            >
              {booksList.map((b: { slug: string; name: string }) => (
                <Box
                  key={b.slug}
                  data-value={b.slug}
                  onClick={() => setPickerValues(prev => ({ ...prev, book: b.slug, chapter: 1, verse: 1 }))}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    backgroundColor: pickerValues.book === b.slug ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                    color: 'text.primary',
                    '&:hover': pickerValues.book === b.slug ? {} : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                    fontSize: '0.875rem',
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.25,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {b.name}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Chapter Picker */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 500 }}>
              Chapter
            </Typography>
            <Box 
              ref={desktopChapterScrollRef}
              sx={{ 
                height: 240, 
                overflowY: 'auto', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: 1,
                backgroundColor: '#1A1A1A',
                overscrollBehavior: 'contain'
              }}
            >
              {Array.from({ length: pickerMaxChapters }, (_, i) => i + 1).map((chapterNum) => (
                <Box
                  key={chapterNum}
                  data-value={chapterNum.toString()}
                  onClick={() => setPickerValues(prev => ({ ...prev, chapter: chapterNum, verse: 1 }))}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: pickerValues.chapter === chapterNum ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                    color: 'text.primary',
                    '&:hover': pickerValues.chapter === chapterNum ? {} : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                    fontSize: '0.875rem',
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.25,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {chapterNum}
                </Box>
              ))}
            </Box>
          </Box>

          {/* Verse Picker */}
          <Box sx={{ flex: 1 }}>
            <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary', fontWeight: 500 }}>
              Verse
            </Typography>
            <Box 
              ref={desktopVerseScrollRef}
              sx={{ 
                height: 240, 
                overflowY: 'auto', 
                border: '1px solid rgba(255,255,255,0.2)', 
                borderRadius: 1,
                backgroundColor: '#1A1A1A',
                overscrollBehavior: 'contain'
              }}
            >
              {Array.from({ length: pickerMaxVerses }, (_, i) => i + 1).map((verseNum) => (
                <Box
                  key={verseNum}
                  data-value={verseNum.toString()}
                  onClick={() => setPickerValues(prev => ({ ...prev, verse: verseNum }))}
                  sx={{
                    p: 1,
                    cursor: 'pointer',
                    textAlign: 'center',
                    backgroundColor: pickerValues.verse === verseNum ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                    color: 'text.primary',
                    '&:hover': pickerValues.verse === verseNum ? {} : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                    fontSize: '0.875rem',
                    borderRadius: 1,
                    mx: 0.5,
                    my: 0.25,
                    transition: 'background-color 0.15s ease',
                  }}
                >
                  {verseNum}
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {/* Buttons with inline Selected preview */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            color: 'text.secondary',
            fontSize: '0.875rem',
          }}>
            <Typography variant="caption" sx={{ mr: 1, color: 'text.secondary' }}>
              Selected:
            </Typography>
            <Typography variant="body2" sx={{ color: '#FFD700', fontWeight: 500 }}>
              {(bookNameBySlug[pickerValues.book] ?? pickerValues.book)} {pickerValues.chapter}:{pickerValues.verse}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              component={Primitive.button}
              type="button"
              onClick={closePicker}
              sx={{
                color: 'text.secondary',
                background: 'none',
                border: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
                cursor: 'pointer',
                px: 1.5,
                py: 1,
                borderRadius: 2,
                transition: 'background-color 0.2s ease, color 0.2s ease',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                '&:focus-visible': {
                  outline: '2px solid rgba(255,255,255,0.35)',
                  outlineOffset: '2px',
                },
              }}
            >
              Cancel
            </Box>
            <Box
              component={Primitive.button}
              type="button"
              onClick={() => {
                onNavigateStart?.();
                updateLastVerse(version, pickerValues.book, pickerValues.chapter, pickerValues.verse);
                closePicker();
                window.location.href = pickerHref;
              }}
              sx={{
                backgroundColor: '#FFD700',
                color: '#000',
                fontWeight: 600,
                px: 3,
                py: 1.2,
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                '&:hover': { backgroundColor: '#E6C200' },
                '&:focus-visible': {
                  outline: '2px solid rgba(0,0,0,0.6)',
                  outlineOffset: '2px',
                },
              }}
            >
              Go
            </Box>
          </Box>
        </Box>
      </Box>
    </Modal>
  );

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 1,
        width: '100%',
      }}
    >
      {/* Connected button group: prev arrow + verse selector + next arrow */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            '& > *:first-child': {
              borderRadius: '10px 0 0 10px !important',
            },
            '& > *:not(:first-child):not(:last-child)': {
              borderRadius: '0 !important',
              borderLeft: '1px solid rgba(255, 255, 255, 0.08)',
              borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            },
            '& > *:last-child': {
              borderRadius: '0 10px 10px 0 !important',
            },
          }}
        >
          <IconActionButton
            label="Previous verse"
            tooltip={isSmDown ? undefined : "Previous verse"}
            icon={<ArrowBackIosNewIcon sx={{ fontSize: 16 }} />}
            hoverColor="rgba(255, 255, 255, 0.18)"
            href={prevHref}
            onClick={handlePreviousClick}
            disabled={!prevHref}
            baseColor={!prevHref ? 'rgba(255, 255, 255, 0.03)' : undefined}
            iconColor={!prevHref ? 'rgba(255, 255, 255, 0.25)' : undefined}
            hoverIconColor={!prevHref ? 'rgba(255, 255, 255, 0.25)' : undefined}
            glowColor={prevHref && !isSmDown ? 'rgba(255, 255, 255, 0.08)' : undefined}
          />
          <IconActionButton
            label="Open verse picker"
            hoverColor="rgba(255, 255, 255, 0.2)"
            onClick={() => openPicker(isSmDown ? 'mobile' : 'desktop')}
            text={isSmDown ? `${getMobileBookName(bookName)} ${chapterNumber}:${verseNumber}` : `${bookName} ${chapterNumber}:${verseNumber}`}
          />
          <IconActionButton
            label="Next verse"
            tooltip={isSmDown ? undefined : "Next verse"}
            icon={<ArrowForwardIosIcon sx={{ fontSize: 16 }} />}
            hoverColor="rgba(255, 255, 255, 0.18)"
            href={nextHref}
            onClick={handleNextClick}
            disabled={!nextHref}
            baseColor={!nextHref ? 'rgba(255, 255, 255, 0.03)' : undefined}
            iconColor={!nextHref ? 'rgba(255, 255, 255, 0.25)' : undefined}
            hoverIconColor={!nextHref ? 'rgba(255, 255, 255, 0.25)' : undefined}
            glowColor={nextHref && !isSmDown ? 'rgba(255, 255, 255, 0.08)' : undefined}
          />
        </Box>
      </Box>

      {/* Separate version button */}
      <IconActionButton
        label="Choose version"
        hoverColor="rgba(255, 255, 255, 0.2)"
        onClick={(event) => setVersionMenuAnchor(event.currentTarget)}
        text={version.toUpperCase()}
      />

      {/* Verse Picker Modals */}
      {!isSmDown && renderDesktopDropdown()}

      <VersePickerSheet
        open={pickerMode === 'mobile'}
        books={booksList}
        initialValue={{
          book: pickerValues.book,
          chapter: pickerValues.chapter,
          verse: pickerValues.verse,
        }}
        onClose={closePicker}
        onConfirm={(next) => {
          setPickerValues(next);
          onNavigateStart?.();
          updateLastVerse(version, next.book, next.chapter, next.verse);
          closePicker();
          window.location.href = buildUrl({
            version,
            book: next.book,
            chapter: next.chapter,
            verse: next.verse,
          });
        }}
        confirmLabel="Go"
      />

      {/* Version Menu for both mobile and desktop */}
      <Menu
        anchorEl={versionMenuAnchor}
        open={!!versionMenuAnchor}
        onClose={() => setVersionMenuAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: '#0E0E0E',
              color: 'rgba(255, 255, 255, 0.95)',
              maxHeight: 400,
              borderRadius: '8px',
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              mt: 0.5,
            }
          }
        }}>
        {versions?.map((v: { abbreviation: string; name: string }) => (
          <MenuItem
            key={v.abbreviation}
            component={Link}
            href={buildUrl({
              version: v.abbreviation,
              book: bookSlug,
              chapter: chapterNumber.toString(),
              verse: verseNumber.toString(),
            })}
            onClick={() => {
              const normalizedVersion = v.abbreviation.toLowerCase();
              if (typeof window !== 'undefined') {
                try {
                  safeSetItem('lastVersion', normalizedVersion);
                } catch {}
              }
              updateLastVerse(
                normalizedVersion,
                bookSlug,
                chapterNumber.toString(),
                verseNumber.toString()
              );
              setVersionMenuAnchor(null);
            }}
            selected={v.abbreviation.toLowerCase() === version.toLowerCase()}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
              py: 1.25,
              px: 2,
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '13px',
              fontWeight: 500,
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              },
              '&.Mui-selected': {
                backgroundColor: 'rgba(255, 215, 0, 0.15)'
              },
              '&.Mui-selected:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.2)'
              },
            }}
          >
            <Box sx={{
              width: 'auto',
              minWidth: 40,
              height: 22,
              background: 'rgba(255, 255, 255, 0.12)',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              px: 1,
              flexShrink: 0,
            }}>
              <Typography sx={{
                color: 'rgba(255, 255, 255, 0.95)',
                fontSize: '11px',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.3px',
              }}>
                {v.abbreviation}
              </Typography>
            </Box>
            <Typography sx={{
              color: 'rgba(255, 255, 255, 0.95)',
              fontSize: '13px',
              fontWeight: 500,
            }}>
              {v.name}
            </Typography>
          </MenuItem>
        ))}
        
        {/* Promo card */}
        <Box sx={{
          m: 1.5,
          mt: 1,
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.04)',
          borderRadius: '6px',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        }}>
          <Typography sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            fontSize: '11px',
            textAlign: 'center',
            fontStyle: 'italic',
            fontWeight: 500,
          }}>
            Stay tuned! More versions on the way!
          </Typography>
        </Box>
      </Menu>
    </Box>
  );
}
