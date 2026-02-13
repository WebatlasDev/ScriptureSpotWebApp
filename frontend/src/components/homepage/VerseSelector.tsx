'use client';

import { Fragment, useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { useRouter } from 'next/navigation';
import { styled, useTheme } from '@mui/material/styles';
import * as Select from '@radix-ui/react-select';
import { Check, ArrowRight } from '@/components/ui/phosphor-icons';
import { KeyboardArrowDownIcon } from '@/components/ui/phosphor-icons';
import { KeyboardArrowRightIcon } from '@/components/ui/phosphor-icons';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { getChapterCount, getVerseCount } from '@/data/bibleStructure';
import { buildUrl } from '@/utils/navigation';
import { getLastVersion } from '@/utils/localStorageUtils';
import { env } from '@/types/env';
import VersePickerSheet from '@/components/common/VersePickerSheet';
import { keyframes } from '@mui/system';

const Trigger = styled(Select.Trigger)(({ theme }) => ({
  all: 'unset',
  boxSizing: 'border-box',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: '8px',
  width: '100%',
  padding: '10px 18px',
  borderRadius: theme.spacing(2),
  background: '#313131',
  border: 'none',
  color: '#FFFFFF',
  fontSize: '16px',
  fontFamily: 'Inter',
  fontWeight: 400,
  lineHeight: '22px',
  transition: 'background 0.2s ease, color 0.2s ease',
  cursor: 'pointer',
  '&[data-placeholder]': {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  '&:focus-visible': {
    outline: '2px solid rgba(255, 215, 0, 0.5)',
    outlineOffset: '3px',
  },
  '@media (hover: hover)': {
    '&:not([data-disabled]):hover': {
      background: '#3A3A3A',
      color: '#FFFFFF',
      '&[data-placeholder]': {
        color: '#FFFFFF',
      },
    },
  },
  '&[data-disabled]': {
    cursor: 'not-allowed',
    opacity: 0.55,
    '@media (hover: hover)': {
      '&:hover': {
        background: '#313131',
      },
    },
  },
}));

const Content = styled(Select.Content)(({ theme }) => ({
  background: '#313131',
  color: '#FFFFFF',
  borderRadius: theme.spacing(2),
  border: 'none',
  overflow: 'hidden',
  boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.5)',
  minWidth: 'var(--radix-select-trigger-width)',
  width: 'var(--radix-select-trigger-width)',
  zIndex: 1600,
}));

const Viewport = styled(Select.Viewport)(() => ({
  padding: '0.6rem',
  maxHeight: '16rem',
}));

const Item = styled(Select.Item)(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 400,
  fontFamily: 'Inter',
  borderRadius: theme.spacing(2),
  padding: '10px 16px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  cursor: 'pointer',
  transition: 'background 0.2s ease',
  '&[data-state="checked"]': {
    background: 'rgba(255, 215, 0, 0.15)',
  },
  '&[data-highlighted]': {
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.1)',
  },
}));

const ItemIndicator = styled(Select.ItemIndicator)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const selectPopperProps = {
  position: 'popper' as const,
  side: 'bottom' as const,
  sideOffset: 8,
  avoidCollisions: false,
};

const Icon = styled(Select.Icon)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
}));

const Label = styled(Select.Label)(() => ({
  display: 'block',
  fontSize: '12px',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  color: 'rgba(255, 255, 255, 0.55)',
  marginBottom: '0.35rem',
  padding: '0 0.25rem',
}));

interface BibleBook {
  slug: string;
  name: string;
}

type VerseSelectorState = {
  book: string | null;
  chapter: number | null;
  verse: number | null;
};

const ensureChapterWithinBounds = (book: string | null, chapter: number | null) => {
  if (!book || !chapter) {
    return null;
  }

  const maxChapters = Math.max(getChapterCount(book), 1);
  return Math.min(Math.max(chapter, 1), maxChapters);
};

const ensureVerseWithinBounds = (
  book: string | null,
  chapter: number | null,
  verse: number | null,
) => {
  if (!book || !chapter || !verse) {
    return null;
  }

  const maxVerses = Math.max(getVerseCount(book, chapter), 1);
  return Math.min(Math.max(verse, 1), maxVerses);
};

const shimmer = keyframes`
  0% {
    background-position: -150% 0;
  }
  100% {
    background-position: 150% 0;
  }
`;

export default function VerseSelector() {
  const router = useRouter();
  const { data: books, isLoading: isBooksLoading } = useBibleBooks();
  const availableBooks = useMemo(() => {
    return Array.isArray(books) ? (books as BibleBook[]) : [];
  }, [books]);
  const hasBooks = availableBooks.length > 0;
  const booksLoading = isBooksLoading && !hasBooks;

  const bookNameBySlug = useMemo(() => {
    return availableBooks.reduce((acc: Record<string, string>, book) => {
      acc[book.slug] = book.name;
      return acc;
    }, {});
  }, [availableBooks]);

  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const [state, setState] = useState<VerseSelectorState>({
    book: null,
    chapter: null,
    verse: null,
  });
  const [mobileSheetOpen, setMobileSheetOpen] = useState(false);
  const [isNavigating, startNavigationTransition] = useTransition();
  const showMobileLoadingState = isSmDown && isNavigating;

  useEffect(() => {
    if (!hasBooks) {
      setState((prev) => {
        if (prev.book || prev.chapter || prev.verse) {
          return {
            book: null,
            chapter: null,
            verse: null,
          };
        }

        return prev;
      });

      return;
    }

    setState((prev) => {
      if (prev.book && !availableBooks.some((book) => book.slug === prev.book)) {
        return {
          book: null,
          chapter: null,
          verse: null,
        };
      }

      const nextChapter = ensureChapterWithinBounds(prev.book, prev.chapter);
      const nextVerse = ensureVerseWithinBounds(prev.book, nextChapter, prev.verse);

      if (nextChapter !== prev.chapter || nextVerse !== prev.verse) {
        return {
          ...prev,
          chapter: nextChapter,
          verse: nextVerse,
        };
      }

      return prev;
    });
  }, [availableBooks, hasBooks]);

  const chapterOptions = useMemo(() => {
    if (!state.book) {
      return [];
    }

    const maxChapters = Math.max(getChapterCount(state.book), 1);
    return Array.from({ length: maxChapters }, (_, index) => index + 1);
  }, [state.book]);

  const verseOptions = useMemo(() => {
    if (!state.book || !state.chapter) {
      return [];
    }

    const maxVerses = Math.max(getVerseCount(state.book, state.chapter), 1);
    return Array.from({ length: maxVerses }, (_, index) => index + 1);
  }, [state.book, state.chapter]);

  const navigateToSelection = useCallback((selection: { book: string; chapter: number; verse: number }) => {
    if (isNavigating) {
      return;
    }

    startNavigationTransition(() => {
      const version = typeof window !== 'undefined' ? getLastVersion() : env.defaultVersion;
      const href = buildUrl({
        version,
        book: selection.book,
        chapter: selection.chapter,
        verse: selection.verse,
      });
      router.push(href);
    });
  }, [isNavigating, router, startNavigationTransition]);

  const handleNavigate = () => {
    const { book, chapter, verse } = state;

    if (!book || !chapter || !verse || isNavigating) {
      return;
    }

    navigateToSelection({ book, chapter, verse });
  };

  const handleSheetConfirm = (selection: { book: string; chapter: number; verse: number }) => {
    setState({
      book: selection.book,
      chapter: selection.chapter,
      verse: selection.verse,
    });
    setMobileSheetOpen(false);
    if (!isNavigating) {
      navigateToSelection(selection);
    }
  };

  const mobileButtonDisabled = showMobileLoadingState;
  const mobileHasSelection = Boolean(state.book && state.chapter && state.verse);
  const mobileSelectionLabel = mobileHasSelection && state.book && state.chapter && state.verse
    ? `${bookNameBySlug[state.book] ?? state.book} ${state.chapter}:${state.verse}`
    : 'Choose passage';

  const bookDisabled = !hasBooks;
  const chapterDisabled = bookDisabled || !state.book;
  const verseDisabled = chapterDisabled || !state.chapter;
  const actionDisabled = verseDisabled || !state.verse;

  return (
    <Fragment>
      <Box
        component="form"
        onSubmit={(event) => {
          event.preventDefault();
          handleNavigate();
        }}
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          width: { xs: '100%', md: 'fit-content' },
          background: '#1A1A1A',
          borderRadius: 2.5,
          border: 'none',
          boxShadow: '0px 21px 62px rgba(0, 0, 0, 0.33)',
          padding: '20px',
          alignSelf: { xs: 'stretch', md: 'center' },
        }}
      >
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: { xs: '10px', sm: '12px', md: '15px' },
          flex: { xs: '1 1 0', md: 'initial' },
          flexWrap: { xs: 'wrap', sm: 'nowrap' },
          width: { xs: '100%', md: 'auto' },
        }}
      >
        <Box
          component="button"
          type="button"
          onClick={() => {
            if (mobileButtonDisabled) {
              return;
            }

            setMobileSheetOpen(true);
          }}
          disabled={mobileButtonDisabled}
          aria-busy={showMobileLoadingState}
          sx={{
            display: { xs: 'flex', md: 'none' },
            width: '100%',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '10px',
            padding: '12px 22px',
            borderRadius: '18px',
            backgroundColor: '#313131',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '18px',
            fontFamily: 'Inter',
            fontWeight: 500,
            lineHeight: '24px',
            cursor: mobileButtonDisabled ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease',
            '&:hover': {
              background: mobileButtonDisabled ? '#313131' : '#3A3A3A',
            },
            '&:disabled': {
              opacity: 0.5,
            },
            '&:focus-visible': {
              outline: mobileButtonDisabled ? 'none' : '2px solid rgba(255, 215, 0, 0.5)',
              outlineOffset: '3px',
            },
          }}
        >
          {showMobileLoadingState ? (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '100%',
              }}
            >
              <Box
                component="span"
                sx={{
                  fontWeight: 600,
                  letterSpacing: 0.2,
                  color: '#FFFAFA',
                  background: 'linear-gradient(90deg, rgba(255, 250, 250, 0.175) 0%, rgba(255, 250, 250, 0.475) 50%, rgba(255, 250, 250, 0.175) 100%)',
                  backgroundSize: '200% 100%',
                  animation: `${shimmer} 1.8s ease-in-out infinite`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  display: 'inline-block',
                }}
              >
                Loading...
              </Box>
            </Box>
          ) : (
            <>
              <Box
                component="span"
                sx={{
                  color: mobileHasSelection ? '#FFFFFF' : 'rgba(255, 255, 255, 0.7)',
                  textAlign: 'left',
                  flex: 1,
                }}
              >
                {mobileSelectionLabel}
              </Box>
              <KeyboardArrowRightIcon sx={{ fontSize: 28, color: 'rgba(255, 255, 255, 0.5)' }} />
            </>
          )}
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: { xs: '100%', sm: '200px', md: '200px' },
            alignSelf: 'stretch',
          }}
        >
          <Select.Root
            value={state.book ?? ''}
            onValueChange={(value) =>
              setState({
                book: value || null,
                chapter: null,
                verse: null,
              })
            }
            disabled={bookDisabled}
          >
            <Trigger aria-label="Select book">
              <Select.Value placeholder="Book" />
              <Icon>
                <KeyboardArrowDownIcon sx={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.5)' }} />
              </Icon>
            </Trigger>
            <Select.Portal>
              <Content {...selectPopperProps}>
                <Viewport>
                  <Select.Group>
                    <Label>Book</Label>
                    {availableBooks.map((book) => (
                      <Item key={book.slug} value={book.slug}>
                        <Select.ItemText>{book.name}</Select.ItemText>
                        <ItemIndicator>
                          <Check size={16} />
                        </ItemIndicator>
                      </Item>
                    ))}
                  </Select.Group>
                </Viewport>
              </Content>
            </Select.Portal>
          </Select.Root>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: { xs: '100%', sm: '140px', md: '140px' },
            alignSelf: 'stretch',
          }}
        >
          <Select.Root
            value={state.chapter ? state.chapter.toString() : ''}
            onValueChange={(value) =>
              setState((prev) => ({
                ...prev,
                chapter: value ? Number(value) : null,
                verse: null,
              }))
            }
            disabled={chapterDisabled}
          >
            <Trigger aria-label="Select chapter">
              <Select.Value placeholder="Chapter" />
              <Icon>
                <KeyboardArrowDownIcon sx={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.5)' }} />
              </Icon>
            </Trigger>
            <Select.Portal>
              <Content {...selectPopperProps}>
                <Viewport>
                  <Select.Group>
                    <Label>Chapter</Label>
                    {chapterOptions.map((chapter) => (
                      <Item key={chapter} value={chapter.toString()}>
                        <Select.ItemText>{chapter}</Select.ItemText>
                        <ItemIndicator>
                          <Check size={16} />
                        </ItemIndicator>
                      </Item>
                    ))}
                  </Select.Group>
                </Viewport>
              </Content>
            </Select.Portal>
          </Select.Root>
        </Box>

        <Box
          sx={{
            display: { xs: 'none', md: 'block' },
            width: { xs: '100%', sm: '120px', md: '120px' },
            alignSelf: 'stretch',
          }}
        >
          <Select.Root
            value={state.verse ? state.verse.toString() : ''}
            onValueChange={(value) =>
              setState((prev) => ({
                ...prev,
                verse: value ? Number(value) : null,
              }))
            }
            disabled={verseDisabled}
          >
            <Trigger aria-label="Select verse">
              <Select.Value placeholder="Verse" />
              <Icon>
                <KeyboardArrowDownIcon sx={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.5)' }} />
              </Icon>
            </Trigger>
            <Select.Portal>
              <Content {...selectPopperProps}>
                <Viewport>
                  <Select.Group>
                    <Label>Verse</Label>
                    {verseOptions.map((verse) => (
                      <Item key={verse} value={verse.toString()}>
                        <Select.ItemText>{verse}</Select.ItemText>
                        <ItemIndicator>
                          <Check size={16} />
                        </ItemIndicator>
                      </Item>
                    ))}
                  </Select.Group>
                </Viewport>
              </Content>
            </Select.Portal>
          </Select.Root>
        </Box>

        <Box
          component="button"
          type="submit"
          onClick={handleNavigate}
          disabled={actionDisabled || isNavigating}
          aria-busy={isNavigating}
          sx={{
            display: { xs: 'none', md: 'flex' },
            flex: { xs: '1 1 0', md: '0 0 auto' },
            alignSelf: 'stretch',
            borderRadius: (theme) => theme.spacing(2),
            border: 'none',
            outline: 'none',
            background: actionDisabled || isNavigating
              ? 'rgba(255, 255, 255, 0.10)'
              : 'rgba(255, 215, 0, 0.30)',
            cursor: actionDisabled || isNavigating ? 'not-allowed' : 'pointer',
            transition: 'background 0.2s ease, transform 0.2s ease',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '10px 20px',
            minWidth: { xs: '100%', sm: '80px', md: '90px' },
            maxWidth: { xs: '100%', sm: '110px', md: '120px' },
            '@media (hover: hover)': {
              '&:hover': {
                background: actionDisabled || isNavigating
                  ? 'rgba(255, 255, 255, 0.10)'
                  : 'rgba(255, 215, 0, 0.45)',
              },
            },
            '&:focus-visible': {
              outline: actionDisabled || isNavigating ? 'none' : '2px solid rgba(255, 215, 0, 0.5)',
              outlineOffset: 3,
            },
          }}
        >
          {isNavigating ? (
            <Box
              component="span"
              sx={{
                fontWeight: 600,
                letterSpacing: 0.2,
                color: '#FFFAFA',
                background: 'linear-gradient(90deg, rgba(255, 250, 250, 0.175) 0%, rgba(255, 250, 250, 0.475) 50%, rgba(255, 250, 250, 0.175) 100%)',
                backgroundSize: '200% 100%',
                animation: `${shimmer} 1.8s ease-in-out infinite`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                display: 'inline-block',
              }}
            >
              Loading...
            </Box>
          ) : (
            <ArrowRight
              size={24}
              style={{ color: actionDisabled ? 'rgba(255, 255, 255, 0.3)' : '#FFD700' }}
            />
          )}
        </Box>
      </Box>
      </Box>

      <VersePickerSheet
        open={mobileSheetOpen}
        books={availableBooks}
        initialValue={state}
        onClose={() => setMobileSheetOpen(false)}
        onConfirm={handleSheetConfirm}
        confirmLabel="Go"
        title="Choose Passage"
        loading={booksLoading}
      />
    </Fragment>
  );
}
