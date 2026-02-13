'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Box, Modal, Typography } from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { getChapterCount, getVerseCount } from '@/data/bibleStructure';
import { skeletonBaseSx } from '@/styles/skeletonStyles';

interface BibleBook {
  slug: string;
  name: string;
}

export interface VersePickerValue {
  book: string | null;
  chapter: number | null;
  verse: number | null;
}

interface VersePickerSheetProps {
  open: boolean;
  books: BibleBook[];
  initialValue?: VersePickerValue;
  onClose: () => void;
  onConfirm: (value: { book: string; chapter: number; verse: number }) => void;
  title?: string;
  confirmLabel?: string;
  loading?: boolean;
}

const defaultValue: VersePickerValue = {
  book: null,
  chapter: null,
  verse: null,
};

const scrollToSelected = (
  containerRef: React.RefObject<HTMLDivElement | null>,
  value: string | null,
) => {
  if (!containerRef.current || !value) {
    return;
  }

  const target = containerRef.current.querySelector<HTMLElement>(`[data-value="${value}"]`);
  target?.scrollIntoView({ block: 'center', behavior: 'auto' });
};

export default function VersePickerSheet({
  open,
  books,
  initialValue,
  onClose,
  onConfirm,
  title = 'Choose Verse',
  confirmLabel = 'Go',
  loading = false,
}: VersePickerSheetProps) {
  const [value, setValue] = useState<VersePickerValue>(() => initialValue ?? defaultValue);

  const bookScrollRef = useRef<HTMLDivElement>(null);
  const chapterScrollRef = useRef<HTMLDivElement>(null);
  const verseScrollRef = useRef<HTMLDivElement>(null);

  const resolvedBook = useMemo(() => {
    if (value.book) {
      return value.book;
    }

    return books.length ? books[0].slug : null;
  }, [books, value.book]);

  const resolvedChapter = useMemo(() => {
    if (resolvedBook && value.chapter) {
      return value.chapter;
    }

    return resolvedBook ? 1 : null;
  }, [resolvedBook, value.chapter]);

  const resolvedVerse = useMemo(() => {
    if (resolvedBook && resolvedChapter && value.verse) {
      return value.verse;
    }

    return resolvedBook && resolvedChapter ? 1 : null;
  }, [resolvedBook, resolvedChapter, value.verse]);

  useEffect(() => {
    if (!open) {
      return;
    }

    setValue(initialValue ?? defaultValue);
  }, [initialValue, open]);

  useEffect(() => {
    if (!open) {
      return;
    }

    requestAnimationFrame(() => {
      scrollToSelected(bookScrollRef, resolvedBook);
      scrollToSelected(chapterScrollRef, resolvedChapter?.toString() ?? null);
      scrollToSelected(verseScrollRef, resolvedVerse?.toString() ?? null);
    });
  }, [open, resolvedBook, resolvedChapter, resolvedVerse]);

  const pickerChapters = useMemo(() => {
    if (!resolvedBook) {
      return [];
    }

    const count = Math.max(getChapterCount(resolvedBook), 1);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [resolvedBook]);

  const pickerVerses = useMemo(() => {
    if (!resolvedBook || !resolvedChapter) {
      return [];
    }

    const count = Math.max(getVerseCount(resolvedBook, resolvedChapter), 1);
    return Array.from({ length: count }, (_, index) => index + 1);
  }, [resolvedBook, resolvedChapter]);

  const isConfirmDisabled = loading || !resolvedBook || !resolvedChapter || !resolvedVerse;

  const renderScrollSkeleton = () => (
    <Box
      sx={{
        height: 250,
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 1,
        ...skeletonBaseSx,
      }}
    />
  );

  const renderEmptyState = () => (
    <Box
      sx={{
        flex: 1,
        minHeight: 250,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        px: 2,
        textAlign: 'center',
        border: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 1,
      }}
    >
      <Typography variant="body2" color="text.secondary">
        Unable to load books right now. Please close this sheet and try again.
      </Typography>
    </Box>
  );

  const showEmptyState = !loading && books.length === 0;

  const handleBookClick = (book: string) => {
    setValue({ book, chapter: 1, verse: 1 });
  };

  const handleChapterClick = (chapter: number) => {
    setValue((prev) => ({
      book: resolvedBook,
      chapter,
      verse: 1,
    }));
  };

  const handleVerseClick = (verse: number) => {
    setValue((prev) => ({
      book: resolvedBook,
      chapter: resolvedChapter,
      verse,
    }));
  };

  const handleConfirm = () => {
    if (isConfirmDisabled || !resolvedBook || !resolvedChapter || !resolvedVerse) {
      return;
    }

    onConfirm({
      book: resolvedBook,
      chapter: resolvedChapter,
      verse: resolvedVerse,
    });
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      closeAfterTransition
      disableAutoFocus
      disableEnforceFocus
      sx={{
        '&:focus-visible': { outline: 'none' },
        '&:focus': { outline: 'none' },
        '& .MuiModal-backdrop': {
          '&:focus-visible': { outline: 'none' },
          '&:focus': { outline: 'none' },
        },
      }}
      slotProps={{
        backdrop: {
          timeout: 300,
          style: { backgroundColor: 'rgba(0, 0, 0, 0.75)' },
        },
      }}
    >
      <Box
        sx={{
          position: 'fixed',
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          maxWidth: 500,
          backgroundColor: '#1A1A1A',
          borderRadius: '16px 16px 0 0',
          p: 3,
          pb: 'calc(16px + env(safe-area-inset-bottom, 0px))',
          color: 'text.primary',
          maxHeight: '80vh',
          marginLeft: 'auto',
          marginRight: 'auto',
          outline: 'none',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography variant="h6" sx={{ mb: 3, textAlign: 'center', color: 'text.primary' }}>
          {title}
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, mb: 4, justifyContent: 'space-between', flexWrap: 'nowrap' }}>
          {showEmptyState ? (
            renderEmptyState()
          ) : (
            <>
              <Box sx={{ flex: 2, minWidth: 0 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  Book
                </Typography>
                {loading ? (
                  renderScrollSkeleton()
                ) : (
                  <Box
                    ref={bookScrollRef}
                    sx={{
                      height: 250,
                      overflowY: 'auto',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 1,
                      backgroundColor: '#1A1A1A',
                      overscrollBehavior: 'contain',
                    }}
                  >
                    {books.map((book) => (
                      <Box
                        key={book.slug}
                        data-value={book.slug}
                        onClick={() => handleBookClick(book.slug)}
                        sx={{
                          p: 1,
                          cursor: 'pointer',
                          backgroundColor: resolvedBook === book.slug ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                          color: 'text.primary',
                          '&:hover':
                            resolvedBook === book.slug
                              ? {}
                              : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                          fontSize: '0.875rem',
                        }}
                      >
                        {book.name}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  Chapter
                </Typography>
                {loading ? (
                  renderScrollSkeleton()
                ) : (
                  <Box
                    ref={chapterScrollRef}
                    sx={{
                      height: 250,
                      overflowY: 'auto',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 1,
                    }}
                  >
                    {pickerChapters.map((chapter) => (
                      <Box
                        key={chapter}
                        data-value={chapter.toString()}
                        onClick={() => handleChapterClick(chapter)}
                        sx={{
                          p: 1,
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: resolvedChapter === chapter ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                          color: 'text.primary',
                          '&:hover':
                            resolvedChapter === chapter
                              ? {}
                              : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                          fontSize: '0.875rem',
                        }}
                      >
                        {chapter}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography variant="caption" sx={{ display: 'block', mb: 1, color: 'text.secondary' }}>
                  Verse
                </Typography>
                {loading ? (
                  renderScrollSkeleton()
                ) : (
                  <Box
                    ref={verseScrollRef}
                    sx={{
                      height: 250,
                      overflowY: 'auto',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: 1,
                    }}
                  >
                    {pickerVerses.map((verse) => (
                      <Box
                        key={verse}
                        data-value={verse.toString()}
                        onClick={() => handleVerseClick(verse)}
                        sx={{
                          p: 1,
                          cursor: 'pointer',
                          textAlign: 'center',
                          backgroundColor: resolvedVerse === verse ? 'rgba(255, 215, 0, 0.2)' : 'transparent',
                          color: 'text.primary',
                          '&:hover':
                            resolvedVerse === verse
                              ? {}
                              : { backgroundColor: 'rgba(255, 215, 0, 0.08)' },
                          fontSize: '0.875rem',
                        }}
                      >
                        {verse}
                      </Box>
                    ))}
                  </Box>
                )}
              </Box>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Box
            component={Primitive.button}
            type="button"
            onClick={onClose}
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
                backgroundColor: 'rgba(255,255,255,0.08)',
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
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            sx={{
              backgroundColor: isConfirmDisabled ? 'rgba(255,255,255,0.08)' : '#FFD700',
              color: isConfirmDisabled ? 'rgba(255,255,255,0.45)' : '#000',
              px: 3,
              py: 1.2,
              borderRadius: 999,
              fontWeight: 700,
              border: 'none',
              cursor: isConfirmDisabled ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: isConfirmDisabled ? 'rgba(255,255,255,0.08)' : '#E6C200',
              },
              '&:focus-visible': {
                outline: isConfirmDisabled ? 'none' : '2px solid rgba(0,0,0,0.65)',
                outlineOffset: '2px',
              },
            }}
          >
            {confirmLabel}
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}
