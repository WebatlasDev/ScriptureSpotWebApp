'use client';

import React, { useEffect, useState, useRef, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
} from '@mui/material';
import { ChevronLeftIcon } from '@/components/ui/phosphor-icons';
import { ChevronRightIcon } from '@/components/ui/phosphor-icons';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';
import { AuthorFromAPI } from '@/types/author';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useChapterCommentaries } from '@/hooks/useChapterCommentaries';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import AuthorHeader from '@/components/author/AuthorHeader';
import Commentary, { CommentaryRef } from '@/components/commentary/Commentary';
import CommentaryStickyBar from '@/components/commentary/CommentaryStickyBar';
import CrossLoader from '@/components/ui/CrossLoader';
import ResponsiveAd from '@/components/ads/ResponsiveAd';
import useResponsive from '@/hooks/useResponsive';
import { Primitive } from '@radix-ui/react-primitive';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';
import { hexToRgb } from '@/utils/color';
import { extractPaginatedItems } from '@/utils/pagination';

const DEFAULT_AUTHOR_COLOR_SCHEME = {
  primary: '#5B41DE',
  gradient: undefined as string | undefined,
  chipBackground: 'rgba(91, 65, 222, 0.25)',
  chipText: '#FFFAFA',
  outline: 'rgba(255, 255, 255, 0.2)',
};

const MOBILE_COMMENTARY_DIVIDER_GRADIENT = 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(237,240,245,0))';


interface CommentaryChapterPageProps {
  initialAuthor?: AuthorFromAPI;
  initialBibleBooks?: any[];
  initialChapters?: any[];
  initialCommentaries?: any[] | { items?: any[] };
  initialVersion?: string;
}

export default function CommentaryChapterPage({
  initialAuthor,
  initialBibleBooks,
  initialChapters,
  initialCommentaries,
  initialVersion,
}: CommentaryChapterPageProps) {
  const params = useParams();
  const router = useRouter();
  const commentaryRefs = useRef<{ [key: string]: CommentaryRef }>({});
  const { isMdDown } = useResponsive();
  const [version, setVersion] = useState((initialVersion || env.defaultVersion).toUpperCase());
  const [pendingNav, setPendingNav] = useState<'prev' | 'next' | null>(null);
  const [, startNavigationTransition] = useTransition();

  useEffect(() => {
    const clientVersion = getLastVersion()?.toUpperCase();
    if (clientVersion && clientVersion !== version) {
      setVersion(clientVersion);
    }
  }, [version]);

  const { data: authors, isLoading: authorsLoading, error: authorsError } = useAuthorsAuthors(
    initialAuthor ? { enabled: false, initialData: [initialAuthor] } : undefined
  );
  const { data: bibleBooks, isLoading: booksLoading, error: booksError } = useBibleBooks({
    initialData: initialBibleBooks,
  });
  const normalizedInitialCommentaries = React.useMemo(() => {
    const extracted = extractPaginatedItems<any[] | undefined>(initialCommentaries);
    if (Array.isArray(extracted)) {
      return extracted;
    }
    if (Array.isArray(initialCommentaries)) {
      return initialCommentaries;
    }
    return [];
  }, [initialCommentaries]);

  const { data: chapterCommentaries, isLoading: commentariesLoading, error: commentariesError } = useChapterCommentaries(
    params.id as string,
    params.bookId as string,
    parseInt(params.chapter as string),
    version,
    {
      initialData: normalizedInitialCommentaries,
      placeholderData: (prev) => prev ?? normalizedInitialCommentaries,
    }
  );
  const { data: chapters, isLoading: chaptersLoading } = useBibleChapters(params.bookId as string, {
    initialData: initialChapters,
  });
  
  // Find the author by slug from the authors list or use initialAuthor
  const author = initialAuthor || authors?.find(a => a.slug === params.id);
  
  // Find book information from the bookId
  const book = bibleBooks?.find(b => b.slug === params.bookId);
  
  const hasAuthors = Boolean(initialAuthor || (authors && authors.length));
  const hasBooks = Boolean((initialBibleBooks && initialBibleBooks.length) || (bibleBooks && bibleBooks.length));
  const hasChapters = Boolean((initialChapters && initialChapters.length) || (chapters && chapters.length));
  const hasCommentaryData = Array.isArray(chapterCommentaries);

  const isLoadingInitialData =
    (!hasAuthors && authorsLoading) ||
    (!hasBooks && booksLoading) ||
    (!hasChapters && chaptersLoading) ||
    (!hasCommentaryData && commentariesLoading);

  const error = authorsError || booksError || commentariesError;
  
  
  // const handleCommentarySelect = (verseRange: string) => {
  //   // Navigate to the specific verse range page
  //   router.push(`/commentators/${params.id}/commentaries/${params.bookId}/${params.chapter}/${verseRange}`);
  // };

  const handleJumpToVerse = (verseNumber: number) => {
    const verseCommentary = chapterCommentaries?.find(vc => vc.verseNumber === verseNumber);
    if (verseCommentary && verseCommentary.commentaries.length > 0) {
      const commentaryId = verseCommentary.commentaries[0].id;
      const ref = commentaryRefs.current[commentaryId];
      if (ref) {
        ref.scrollIntoView();
      }
    }
  };

  // Navigation logic
  const currentChapter = parseInt(params.chapter as string);
  const maxChapters = chapters?.length || 0;
  const hasPreviousChapter = currentChapter > 1;
  const hasNextChapter = currentChapter < maxChapters;

  const handlePreviousChapter = () => {
    if (!hasPreviousChapter || pendingNav) {
      return;
    }

    setPendingNav('prev');
    startNavigationTransition(() => {
      try {
        router.push(`/commentators/${params.id}/commentaries/${params.bookId}/${currentChapter - 1}`);
      } catch {
        setPendingNav(null);
      }
    });
  };

  const handleNextChapter = () => {
    if (!hasNextChapter || pendingNav) {
      return;
    }

    setPendingNav('next');
    startNavigationTransition(() => {
      try {
        router.push(`/commentators/${params.id}/commentaries/${params.bookId}/${currentChapter + 1}`);
      } catch {
        setPendingNav(null);
      }
    });
  };

  const getVerseNumbersFromGroup = (verseCommentary: any): number[] => {
    if (verseCommentary?.verses?.length) {
      return verseCommentary.verses
        .map((verse: any) => verse?.verseNumber)
        .filter((num: number | undefined) => typeof num === 'number')
        .sort((a: number, b: number) => a - b);
    }

    if (typeof verseCommentary?.verseNumber === 'number') {
      return [verseCommentary.verseNumber];
    }

    if (typeof verseCommentary?.verseRange === 'string' && verseCommentary.verseRange.trim() !== '') {
      const cleanedRange = verseCommentary.verseRange
        .replace(/^Verses?\s+/i, '')
        .replace(/\s/g, '');

      if (!cleanedRange) {
        return [];
      }

      const [startStr, endStr] = cleanedRange.split('-');
      const start = Number.parseInt(startStr, 10);
      if (Number.isNaN(start)) {
        return [];
      }

      const end = endStr ? Number.parseInt(endStr, 10) : start;
      const lower = Math.min(start, end);
      const upper = Math.max(start, end);
      return Array.from({ length: upper - lower + 1 }, (_, index) => lower + index);
    }

    return [];
  };

  const getCompactVerseRange = (verseCommentary: any): string => {
    const verseNumbers = getVerseNumbersFromGroup(verseCommentary);
    if (verseNumbers.length === 0) {
      if (typeof verseCommentary?.verseRange === 'string' && verseCommentary.verseRange.trim() !== '') {
        return verseCommentary.verseRange;
      }

      if (typeof verseCommentary?.verseNumber === 'number') {
        return verseCommentary.verseNumber.toString();
      }

      return '';
    }

    if (verseNumbers.length === 1) {
      return verseNumbers[0].toString();
    }

    return `${verseNumbers[0]}-${verseNumbers[verseNumbers.length - 1]}`;
  };

  const getDisplayVerseRange = (verseCommentary: any): string => {
    const compactRange = getCompactVerseRange(verseCommentary);
    if (!compactRange) {
      return '';
    }

    return compactRange.includes('-') ? `Verses ${compactRange}` : `Verse ${compactRange}`;
  };

  const buildVerseReference = (verseCommentary: any): string => {
    if (!book) {
      return '';
    }

    const compactRange = getCompactVerseRange(verseCommentary);
    if (!compactRange) {
      return `${book.name} ${params.chapter}`;
    }

    return `${book.name} ${params.chapter}:${compactRange}`;
  };

  const buildVerseContent = (verseCommentary: any): string => {
    if (!verseCommentary?.verses?.length) {
      return '';
    }

    return verseCommentary.verses
      .map((verse: any) => verse?.verse || verse?.content || verse?.text || '')
      .filter((content: string | undefined) => Boolean(content))
      .join(' ');
  };

  const deriveVerseVersion = (verseCommentary: any): string => {
    const verseWithVersion = verseCommentary?.verses?.find((verse: any) =>
      verse?.version || verse?.versionName || verse?.versionShortName
    );
    const resolvedVersion =
      verseWithVersion?.version ||
      verseWithVersion?.versionName ||
      verseWithVersion?.versionShortName ||
      version ||
      env.defaultVersion;
    return resolvedVersion.toUpperCase();
  };

  // Group commentaries by groupId
  const groupedCommentaries = React.useMemo(() => {
    if (!chapterCommentaries) return [];
    
    // Check if any commentaries have groupId
    const hasGroupIds = chapterCommentaries.some(c => c.groupId);
    
    if (!hasGroupIds) {
      // No groupIds found, return as single group
      return [{
        groupId: 'default',
        commentaries: chapterCommentaries,
        firstVerseNumber: chapterCommentaries[0]?.verseNumber || 0,
        hasRealGroups: false
      }];
    }
    
    const groups: { [key: string]: any[] } = {};
    
    chapterCommentaries.forEach(commentary => {
      const groupId = commentary.groupId || 'default';
      if (!groups[groupId]) {
        groups[groupId] = [];
      }
      groups[groupId].push(commentary);
    });
    
    // Sort each group by verse number
    Object.keys(groups).forEach(groupId => {
      groups[groupId].sort((a, b) => a.verseNumber - b.verseNumber);
    });
    
    // Convert to array and sort by the first verse number in each group
    return Object.entries(groups)
      .map(([groupId, commentaries]) => ({
        groupId,
        commentaries,
        firstVerseNumber: commentaries[0]?.verseNumber || 0,
        hasRealGroups: true
      }))
      .sort((a, b) => a.firstVerseNumber - b.firstVerseNumber);
  }, [chapterCommentaries]);

  // Component to render Commentary with enriched verse information
  const CommentaryWithVerse = ({
    commentary,
    verseCommentary,
    commentaryRef,
  }: {
    commentary: any;
    verseCommentary: any;
    commentaryRef: (ref: CommentaryRef | null) => void;
  }) => {
    const formattedVerseRange = getDisplayVerseRange(verseCommentary);
    const verseReference = buildVerseReference(verseCommentary);
    const enrichedVerseContent = buildVerseContent(verseCommentary);
    const enrichedVerseVersion = deriveVerseVersion(verseCommentary);

    const verseContent = enrichedVerseContent;
    const verseVersionLabel = (enrichedVerseVersion || version).toUpperCase();

    return (
      <Commentary
        ref={commentaryRef}
        commentary={commentary}
        mode="chapter"
        verseRange={formattedVerseRange}
        showVerseButton={true}
        bookSlug={params.bookId as string}
        chapterNumber={parseInt(params.chapter as string)}
        verseContent={verseContent}
        verseVersion={verseVersionLabel}
        verseReference={verseReference}
      />
    );
  };

  // Prepare verse ranges for the sticky bar using enriched verse information
  const verseRanges = (chapterCommentaries || []).map(vc => ({
    verseNumber: vc.verseNumber,
    verseRange: getCompactVerseRange(vc),
  }));

  
  if (isLoadingInitialData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (error || !author || !book) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading commentary information
      </Box>
    );
  }
  
  const breadcrumbItems = [
    { label: 'Commentators', href: '/commentators' },
    { label: author.name.split(' ').pop() || author.name, href: `/commentators/${params.id}/commentaries` },
    { label: book.name, href: `/commentators/${params.id}/commentaries/${params.bookId}` },
    { label: `Ch. ${params.chapter}` }
  ];
  const colorScheme = {
    ...DEFAULT_AUTHOR_COLOR_SCHEME,
    ...(author?.colorScheme ?? {}),
  };
  const primaryRgb = hexToRgb(colorScheme.primary);

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto', position: 'relative' }}>
      <AuthorHeader
        author={author}
        title={`${author.name}'s Commentary`}
        subtitle={`on ${book.name} ${params.chapter}`}
        breadcrumbItems={breadcrumbItems}
      />
      
      {/* Table of Contents */}
      {groupedCommentaries.length > 1 && groupedCommentaries[0]?.hasRealGroups && (
        <Box 
          sx={{ 
            mb: 4, 
            p: 3, 
            background: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 1, 
              color: 'rgba(255, 255, 255, 0.9)',
              fontSize: '1.1rem',
              fontWeight: 500
            }}
          >
            Commentary Groups
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              mb: 2, 
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: '0.875rem',
              lineHeight: 1.5
            }}
          >
            This author has written multiple commentaries over their lifetime on this chapter. We have grouped their commentaries for easier reading.
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {groupedCommentaries.map((group, index) => (
              <Button
                key={group.groupId}
                onClick={() => {
                  const element = document.getElementById(`commentary-group-${group.groupId}`);
                  if (element) {
                    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                sx={{
                  background: colorScheme.chipBackground,
                  color: colorScheme.chipText,
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textTransform: 'none',
                  px: 2,
                  py: 0.5,
                  borderRadius: 1,
                  minHeight: 'auto',
                  '&:hover': {
                    opacity: 0.8,
                  },
                }}
              >
                Commentary #{index + 1}
              </Button>
            ))}
          </Box>
        </Box>
      )}
      
      {chapterCommentaries && chapterCommentaries.length > 0 ? (
        <>
          {groupedCommentaries.map((group, groupIndex) => (
            <Box key={group.groupId} id={`commentary-group-${group.groupId}`}>
              {/* Group Divider */}
              {groupedCommentaries.length > 1 && group.hasRealGroups && (
                <Box 
                  sx={{ 
                    mb: 4, 
                    pt: groupIndex === 0 ? 0 : 6,
                    borderTop: groupIndex === 0 ? 'none' : '2px solid rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Box 
                    sx={{ 
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      mb: 3,
                      pt: groupIndex === 0 ? 0 : 2,
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: 'rgba(255, 255, 255, 0.6)',
                        fontWeight: 400,
                        fontSize: '0.875rem'
                      }}
                    >
                      Commentary #{groupIndex + 1}
                    </Typography>
                    <Box 
                      sx={{ 
                        height: '1px',
                        flex: 1,
                        backgroundColor: 'rgba(255, 255, 255, 0.2)'
                      }}
                    />
                  </Box>
                </Box>
              )}
              
              {/* Render commentaries in this group */}
              {group.commentaries.map((verseCommentary, verseIndex) => (
                <React.Fragment key={`${verseCommentary.verseNumber}-${verseCommentary.groupId}`}>
                  <Box>
                    <CommentaryWithVerse
                      commentary={verseCommentary.commentaries[0]}
                      verseCommentary={verseCommentary}
                      commentaryRef={(ref) => {
                        if (ref) {
                          commentaryRefs.current[verseCommentary.commentaries[0].id] = ref;
                        }
                      }}
                    />
                    {/* Mobile divider between individual commentary components */}
                    {!(verseIndex === group.commentaries.length - 1) && (
                      <Box
                        sx={{
                          display: { xs: 'block', sm: 'none' },
                          width: '100%',
                          height: 2,
                          background: MOBILE_COMMENTARY_DIVIDER_GRADIENT,
                          opacity: 0.6,
                          my: 4,
                          borderRadius: 999,
                        }}
                      />
                    )}
                    {/* Desktop spacing */}
                    <Box sx={{ display: { xs: 'none', sm: 'block' }, mb: 4 }} />
                  </Box>
                  
                  {/* Responsive ad between every other commentary component */}
                  {verseIndex % 2 === 1 && verseIndex < group.commentaries.length - 1 && (
                    <Box sx={{ my: 4 }}>
                      <ResponsiveAd 
                        slotId="COMMENTARY_RESPONSIVE" 
                        showPlaceholder={false}
                      />
                    </Box>
                  )}
                </React.Fragment>
              ))}
            </Box>
          ))}
          
          {/* Sticky Bar */}
          {verseRanges.length > 0 && (
            <CommentaryStickyBar
              verseRanges={verseRanges}
              onJumpToVerse={handleJumpToVerse}
              authorColorScheme={{
                chipBackground: colorScheme.chipBackground,
                chipText: colorScheme.chipText,
              }}
            />
          )}
          
          {/* Chapter Navigation */}
          <Box 
            sx={{ 
              display: 'flex', 
              gap: 3, 
              mt: 6, 
              mb: 4,
              width: '100%',
              flexDirection: 'row'
            }}
          >
            <Button
              component={Primitive.button as any}
              type="button"
              onClick={handlePreviousChapter}
            disabled={!hasPreviousChapter || (pendingNav !== null && pendingNav !== 'prev')}
              aria-busy={pendingNav === 'prev'}
              aria-live={pendingNav === 'prev' ? 'polite' : undefined}
              sx={{
                background: hasPreviousChapter
                  ? (colorScheme.gradient ||
                    `linear-gradient(0deg, rgba(${primaryRgb}, 0.10) 0%, rgba(${primaryRgb}, 0.10) 100%), #121212`)
                  : 'rgba(255, 255, 255, 0.05)',
                color: hasPreviousChapter ? '#FFFAFA' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: 3.5,
                px: { xs: 2, sm: 4 },
                py: 2,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'none',
                minHeight: 56,
                flex: 1,
                border: hasPreviousChapter ? `2px solid ${colorScheme.outline}` : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease-in-out',
                cursor: hasPreviousChapter && (!pendingNav || pendingNav === 'prev') ? 'pointer' : 'not-allowed',
                '&:hover': hasPreviousChapter && (!pendingNav || pendingNav === 'prev') ? {
                  background: colorScheme.gradient ||
                    `linear-gradient(0deg, rgba(${primaryRgb}, 0.15) 0%, rgba(${primaryRgb}, 0.15) 100%), #121212`,
                  borderColor: colorScheme.outline,
                  opacity: 0.9,
                } : {},
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                '& .MuiButton-startIcon': {
                  color: hasPreviousChapter ? colorScheme.chipText : 'rgba(255, 255, 255, 0.3)',
                  fontSize: 22,
                },
              }}
            >
              {pendingNav === 'prev' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#FFFAFA' }} />
                  <Typography sx={{ fontWeight: 600 }}>Loading...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <ChevronLeftIcon sx={{ fontSize: 22 }} />
                  <Typography>
                    {hasPreviousChapter ? (
                      <span>Chapter <strong>{currentChapter - 1}</strong></span>
                    ) : (
                      'Previous'
                    )}
                  </Typography>
                </Box>
              )}
            </Button>
            
            <Button
              component={Primitive.button as any}
              type="button"
              onClick={handleNextChapter}
            disabled={!hasNextChapter || (pendingNav !== null && pendingNav !== 'next')}
              aria-busy={pendingNav === 'next'}
              aria-live={pendingNav === 'next' ? 'polite' : undefined}
              sx={{
                background: hasNextChapter
                  ? (colorScheme.gradient ||
                    `linear-gradient(0deg, rgba(${primaryRgb}, 0.10) 0%, rgba(${primaryRgb}, 0.10) 100%), #121212`)
                  : 'rgba(255, 255, 255, 0.05)',
                color: hasNextChapter ? '#FFFAFA' : 'rgba(255, 255, 255, 0.3)',
                borderRadius: 3.5,
                px: { xs: 2, sm: 4 },
                py: 2,
                fontSize: 16,
                fontWeight: 500,
                textTransform: 'none',
                minHeight: 56,
                flex: 1,
                border: hasNextChapter ? `2px solid ${colorScheme.outline}` : '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'all 0.2s ease-in-out',
                cursor: hasNextChapter && (!pendingNav || pendingNav === 'next') ? 'pointer' : 'not-allowed',
                '&:hover': hasNextChapter && (!pendingNav || pendingNav === 'next') ? {
                  background: colorScheme.gradient ||
                    `linear-gradient(0deg, rgba(${primaryRgb}, 0.15) 0%, rgba(${primaryRgb}, 0.15) 100%), #121212`,
                  borderColor: colorScheme.outline,
                  opacity: 0.9,
                } : {},
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                },
                '& .MuiButton-endIcon': {
                  color: hasNextChapter ? colorScheme.chipText : 'rgba(255, 255, 255, 0.3)',
                  fontSize: 22,
                },
              }}
            >
              {pendingNav === 'next' ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CircularProgress size={20} sx={{ color: '#FFFAFA' }} />
                  <Typography sx={{ fontWeight: 600 }}>Loading...</Typography>
                </Box>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography>
                    {hasNextChapter ? (
                      <span>Chapter <strong>{currentChapter + 1}</strong></span>
                    ) : (
                      'Next'
                    )}
                  </Typography>
                  <ChevronRightIcon sx={{ fontSize: 22 }} />
                </Box>
              )}
            </Button>
          </Box>
        </>
      ) : (
        !isLoadingInitialData && (
          <Box sx={{ textAlign: 'center', my: 8, color: 'rgba(255, 255, 255, 0.7)' }}>
            <Typography variant="h6">
              No commentary available for {book.name} chapter {params.chapter}.
            </Typography>
          </Box>
        )
      )}
    </Box>
  );
}
