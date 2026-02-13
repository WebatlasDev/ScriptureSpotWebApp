'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import {
  Box,
  Typography,
  Button,
  Avatar,
  CircularProgress,
} from '@mui/material';
import { useBibleBooks } from '@/hooks/useBibleBooks';
import { useAuthorsCommentaries } from '@/hooks/useAuthorsCommentaries';
import VerseTakeawaysHeader from '@/components/commentators/VerseTakeawaysHeader';
import CrossLoader from '@/components/ui/CrossLoader';
import { ChevronRightIcon } from '@/components/ui/phosphor-icons';
import { FormatQuoteIcon } from '@/components/ui/phosphor-icons';
import Link from 'next/link';
import Image from 'next/image';
import { slugToBookName, replaceReferenceShortcodes } from '@/utils/stringHelpers';
import ResponsiveAd from '@/components/ads/ResponsiveAd';
import { Primitive } from '@radix-ui/react-primitive';
import { useCommentaryNavigation } from '@/hooks/useCommentaryNavigation';
import { useQueries } from '@tanstack/react-query';
import agent from '@/app/api/agent';

// Verse Takeaways color scheme
const VERSE_TAKEAWAYS_COLORS = {
  primary: '#ED27FF',
  secondary: '#164880',
  gradient: 'linear-gradient(135deg,rgba(237, 39, 255, 0.6) 0%,rgba(30, 77, 139, 0) 100%)',
  iconGradient: 'linear-gradient(46deg, #ED27FF 0%, #164880 100%)',
  chipText: '#F4BFFF',
  outline: 'rgba(237, 39, 255, 0.20)'
};

const DEFAULT_VERSION = 'ASV';

function parseVerseRange(verseRange: string | null | undefined): number[] {
  if (!verseRange) {
    return [];
  }

  const parts = verseRange.split('-');
  const start = Number.parseInt(parts[0], 10);
  if (Number.isNaN(start)) {
    return [];
  }

  const end = parts[1] ? Number.parseInt(parts[1], 10) : start;
  if (Number.isNaN(end)) {
    return [];
  }

  const lower = Math.min(start, end);
  const upper = Math.max(start, end);
  return Array.from({ length: upper - lower + 1 }, (_, index) => lower + index);
}

function extractVerseContent(data: any): string {
  if (!data) {
    return '';
  }

  if (typeof data === 'string') {
    return data;
  }

  if (typeof data.content === 'string') {
    return data.content;
  }

  if (Array.isArray(data) && data.length > 0) {
    return extractVerseContent(data[0]);
  }

  return '';
}

export default function VerseTakeawaysVersePage() {
  const params = useParams();
  const { data: bibleBooks, isLoading: booksLoading, error: booksError } = useBibleBooks();
  const bookSlug = params.bookId as string;
  const chapterNumber = useMemo(() => {
    const parsed = Number.parseInt(params.chapter as string, 10);
    return Number.isNaN(parsed) ? null : parsed;
  }, [params.chapter]);
  const verseNumbers = useMemo(
    () => parseVerseRange(params.verseRange as string),
    [params.verseRange]
  );
  const firstVerseNumber = verseNumbers[0];

  const verseTakeawayQueries = useQueries({
    queries: verseNumbers.map((verseNumber) => ({
      queryKey: ['bibleVerseTakeaways', bookSlug, chapterNumber ?? 'invalid', verseNumber],
      queryFn: async () => {
        if (!bookSlug || !chapterNumber) {
          return [];
        }
        const result = await agent.Bible.getBibleVerseTakeaways({
          BookSlug: bookSlug,
          ChapterNumber: chapterNumber,
          VerseNumber: verseNumber,
        });
        return result || [];
      },
      enabled: Boolean(bookSlug && chapterNumber && verseNumber),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    })),
  });

  const verseVersionQueries = useQueries({
    queries: verseNumbers.map((verseNumber) => ({
      queryKey: ['bibleVerseVersion', bookSlug, chapterNumber ?? 'invalid', verseNumber, DEFAULT_VERSION],
      queryFn: async () => {
        if (!bookSlug || !chapterNumber) {
          return [];
        }
        const result = await agent.Bible.getBibleVerseVersion({
          BookSlug: bookSlug,
          ChapterNumber: chapterNumber,
          VerseNumber: verseNumber,
          VersionName: DEFAULT_VERSION,
        });
        return result || [];
      },
      enabled: Boolean(bookSlug && chapterNumber && verseNumber),
      staleTime: 1000 * 60 * 5,
      refetchOnWindowFocus: true,
    })),
  });

  const verseTakeawayData = verseTakeawayQueries.map((query) => query.data ?? null);
  const verseVersionData = verseVersionQueries.map((query) => query.data ?? null);

  const verseTakeawaysLoading = verseTakeawayQueries.some((query) => query.isLoading);
  const verseLoading = verseVersionQueries.some((query) => query.isLoading);

  const allVerseContent = verseVersionData
    .map(extractVerseContent)
    .filter(Boolean)
    .join(' ');
  
  const book = bibleBooks?.find(b => b.slug === params.bookId);
  
  // Fetch other commentaries for this verse (for the left button)
  const { data: otherCommentariesData } = useAuthorsCommentaries(
    params.bookId as string,
    parseInt(params.chapter as string),
    firstVerseNumber,
    "Combined"
  );
  
  // Filter out duplicates by author name and get unique authors
  const allOtherAuthors = otherCommentariesData
    ? otherCommentariesData.reduce((unique: any[], commentary: any) => {
        // Only add if we haven't seen this author before
        if (!unique.some(item => item.author.name === commentary.author.name)) {
          unique.push(commentary);
        }
        return unique;
      }, [])
    : [];

  // Limit to 5 for display but keep full count for text
  const otherAuthors = allOtherAuthors.slice(0, 5);

  const viewOtherCommentariesHref =
    allOtherAuthors.length > 0 && typeof firstVerseNumber === 'number'
      ? `/${DEFAULT_VERSION}/${params.bookId}/${params.chapter}/${firstVerseNumber}`
      : '';

  const {
    isNavigating: isNavigatingOtherCommentaries,
    handleClick: handleOtherCommentariesClick,
  } = useCommentaryNavigation(viewOtherCommentariesHref);
  
  const isLoading = booksLoading || verseTakeawaysLoading || verseLoading;
  const error = booksError;

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CrossLoader size={60} />
      </Box>
    );
  }
  
  if (error || !book) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading verse takeaways information
      </Box>
    );
  }
  
  const breadcrumbItems = [
    { label: 'Verse Takeaways', href: '/commentators/verse-takeaways/commentaries' },
    { label: book.name, href: `/commentators/verse-takeaways/commentaries/${params.bookId}` },
    { label: `Ch. ${params.chapter}`, href: `/commentators/verse-takeaways/commentaries/${params.bookId}/${params.chapter}` },
    { label: `Verse ${params.verseRange}` }
  ];

  const bookName = slugToBookName(params.bookId as string);
  const formattedReference = `${bookName} ${params.chapter}:${params.verseRange}`;

  // Combine all verse takeaways content
  const allVerseTakeaways = verseTakeawayData
    .filter((data: any) => data && data.excerpts && data.excerpts.length > 0);

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <VerseTakeawaysHeader
        title={`What do top commentators say ${formattedReference} means?`}
        breadcrumbItems={breadcrumbItems}
      />
      
      {allVerseContent && (
        <Box
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 3,
            p: { xs: 3, sm: 4 },
            mb: 3,
            position: 'relative',
            // Dynamic height based on content length (matching VerseCard logic)
            maxHeight: allVerseContent && allVerseContent.length > 200 ? { xs: '300px', sm: '200px' } : allVerseContent && allVerseContent.length > 100 ? { xs: '240px', sm: '160px' } : { xs: '180px', sm: '120px' },
            overflow: 'hidden',
          }}
        >
          <Typography
            variant="h6"
            sx={{
              color: 'rgba(255, 255, 255, 0.6)',
              fontSize: 13,
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.07em',
              mb: 2,
            }}
          >
            SCRIPTURE
          </Typography>
          {/* Verse content with reference - all in one block */}
          <Box
            sx={{
              // Dynamic scroll area height based on content length
              maxHeight: allVerseContent && allVerseContent.length > 200 ? { xs: '180px', sm: '120px' } : allVerseContent && allVerseContent.length > 100 ? { xs: '120px', sm: '80px' } : { xs: '90px', sm: '60px' },
              overflow: 'auto',
              pr: 1,
              '&::-webkit-scrollbar': {
                width: '4px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: 2,
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: 2,
                '&:hover': {
                  background: 'rgba(255, 255, 255, 0.4)',
                },
              },
            }}
          >
            <Typography
              sx={{
                color: '#FFFAFA',
                fontSize: { xs: 16, sm: 18 },
                fontWeight: 400,
                lineHeight: 1.4,
                fontStyle: 'italic',
              }}
            >
              "{allVerseContent}" — {formattedReference} ({DEFAULT_VERSION})
            </Typography>
          </Box>
        </Box>
      )}
      
      {/* Verse Takeaways Content */}
      {allVerseTakeaways.length > 0 ? (
        <Box sx={{ mb: 4 }}>
          {allVerseTakeaways.map((verseTakeaway, index) => (
            <React.Fragment key={`verse-${verseNumbers[index]}`}>
              <Box 
                sx={{ 
                  mb: allVerseTakeaways.length > 1 ? 4 : 0,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: 3,
                  p: { xs: 3, sm: 4 },
                }}
              >
                {allVerseTakeaways.length > 1 && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: VERSE_TAKEAWAYS_COLORS.chipText,
                      fontSize: 16,
                      fontWeight: 600,
                      mb: 3,
                    }}
                  >
                    Verse {verseNumbers[index]}
                  </Typography>
                )}
                
                {verseTakeaway.excerpts.map((excerpt, excerptIndex) => (
                  <React.Fragment key={excerpt.id}>
                    <Box sx={{ mb: excerptIndex < verseTakeaway.excerpts.length - 1 ? 3 : 0 }}>
                      <Typography sx={{
                        color: '#FFFAFA',
                        fontSize: { xs: 16, md: 18 },
                        fontWeight: 400,
                        lineHeight: 1.6,
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                      }}>
                        <Box component="span" sx={{ fontWeight: 700 }}>
                          {excerpt.title.replace(':', '')}:{' '}
                        </Box>
                <span dangerouslySetInnerHTML={{
                  __html: replaceReferenceShortcodes(DEFAULT_VERSION, excerpt.content, { chipText: VERSE_TAKEAWAYS_COLORS.primary })
                }} />
                      </Typography>
                    </Box>
                    
                    {/* Insert ads after the first paragraph (excerptIndex === 0) and third paragraph (excerptIndex === 2) */}
                    {(excerptIndex === 0 || excerptIndex === 2) && (
                      <Box sx={{ my: 4 }}>
                        <ResponsiveAd 
                          slotId="CONTENT_RESPONSIVE" 
                          showPlaceholder={false}
                        />
                      </Box>
                    )}
                  </React.Fragment>
                ))}

                {/* Quote if available */}
                {verseTakeaway.quotes && verseTakeaway.quotes.length > 0 && (
                  <Box sx={{
                    p: 3,
                    background: 'linear-gradient(222deg,rgba(147, 53, 202, 0.7) 0%,rgba(22, 71, 128, 0.07) 100%)',
                    mt: 3,
                    borderRadius: 3,
                    width: '100%',
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2
                  }}>
                    <Box sx={{
                      width: 30,
                      height: 30,
                      background: VERSE_TAKEAWAYS_COLORS.iconGradient,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      mt: { xs: 0, sm: 0.5 },
                      mb: { xs: 1, sm: 0 }
                    }}>
                      <FormatQuoteIcon sx={{ color: 'white', fontSize: 22 }} />
                    </Box>
                    <Box sx={{ flex: 1 }}>
                      <Typography sx={{ 
                        fontStyle: 'italic', 
                        mb: 2,
                        fontSize: 18,
                        lineHeight: 1.4,
                        color: '#FFFAFA'
                      }}>
                        {verseTakeaway.quotes[0].content}
                      </Typography>
                      <Typography component="h6" sx={{ 
                        fontWeight: 700,
                        fontSize: 14,
                        color: '#FFFAFA'
                      }}>
                        {verseTakeaway.quotes[0].author.name}
                      </Typography>
                    </Box>
                  </Box>
                )}
              </Box>
              
              {/* Responsive ad between verse takeaway sections */}
              {index < allVerseTakeaways.length - 1 && (
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
      ) : (
        !isLoading && (
          <Box sx={{ textAlign: 'center', my: 8, color: 'rgba(255, 255, 255, 0.7)' }}>
            <Typography variant="h6">
              No verse takeaways available for {formattedReference}.
            </Typography>
          </Box>
        )
      )}
      
      {/* Navigation Buttons */}
      <Box 
        sx={{ 
          display: 'flex', 
          gap: 3, 
          mt: 4, 
          mb: 4,
          width: '100%',
          flexDirection: { xs: 'column', sm: 'row' }
        }}
      >
        {/* View Other Commentaries Button */}
        {allOtherAuthors.length > 0 ? (
          <Box
            component={Primitive.button}
            type="button"
            onClick={handleOtherCommentariesClick}
            disabled={isNavigatingOtherCommentaries}
            aria-busy={isNavigatingOtherCommentaries}
            aria-label={`View ${allOtherAuthors.length} other commentaries on this passage`}
            sx={{
              flex: 1,
              minHeight: 56,
              borderRadius: 28,
              px: 4,
              py: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              color: '#FFFAFA',
              width: '100%',
              border: '2px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              cursor: isNavigatingOtherCommentaries ? 'not-allowed' : 'pointer',
              pointerEvents: isNavigatingOtherCommentaries ? 'none' : 'auto',
              '&:focus-visible': {
                outline: '2px solid rgba(255, 255, 255, 0.35)',
                outlineOffset: 4,
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderColor: 'rgba(255, 255, 255, 0.2)',
                opacity: 0.9,
              },
              '&:disabled': {
                cursor: 'not-allowed',
                opacity: 0.65,
                pointerEvents: 'none',
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ display: 'flex', gap: -0.5 }}>
                {otherAuthors.map((commentaryItem: any, index: number) => (
                  <Avatar
                    key={`${commentaryItem.author.name}-${index}`}
                    alt={commentaryItem.author.name}
                    sx={{
                      width: 32,
                      height: 32,
                      marginLeft: index > 0 ? '-8px' : 0,
                      zIndex: otherAuthors.length - index,
                      fontSize: 12,
                      background: commentaryItem.author.colorScheme?.primary
                        ? `linear-gradient(216deg, ${commentaryItem.author.colorScheme.primary} 0%, black 100%)`
                        : '#5B41DE',
                    }}
                  >
                    <Image
                      src={commentaryItem.author.image}
                      alt={commentaryItem.author.name}
                      width={24}
                      height={24}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  </Avatar>
                ))}
              </Box>
              <Box sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                {isNavigatingOtherCommentaries
                  ? 'Loading...'
                  : `${allOtherAuthors.length} commentar${allOtherAuthors.length === 1 ? 'y' : 'ies'}`}
              </Box>
            </Box>
            {isNavigatingOtherCommentaries ? (
              <CircularProgress size={20} sx={{ color: '#FFFAFA' }} />
            ) : (
              <ChevronRightIcon sx={{ color: 'rgba(255, 255, 255, 0.6)' }} />
            )}
          </Box>
        ) : (
          <Box sx={{ flex: 1 }} />
        )}
        
        {/* View Full Chapter Button */}
        <Link 
          href={`/commentators/verse-takeaways/commentaries/${params.bookId}/${params.chapter}`}
          style={{ textDecoration: 'none', flex: 1 }}
        >
          <Button
            sx={{
              background: `linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
                          linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box`,
              backgroundSize: 'cover, cover',
              backgroundPosition: 'center, center',
              color: '#FFFAFA',
              borderRadius: 3.5,
              px: 4,
              py: 2,
              fontSize: 16,
              fontWeight: 500,
              textTransform: 'none',
              minHeight: 56,
              width: '100%',
              border: `2px solid ${VERSE_TAKEAWAYS_COLORS.outline}`,
              transition: 'all 0.2s ease-in-out',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              position: 'relative',
              overflow: 'hidden',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                zIndex: 1,
                transition: 'background 0.3s ease',
              },
              '& > *': {
                position: 'relative',
                zIndex: 2,
              },
              '&:hover': {
                borderColor: VERSE_TAKEAWAYS_COLORS.outline,
                opacity: 0.9,
                '&::after': {
                  background: 'rgba(0, 0, 0, 0.6)',
                },
              },
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box sx={{ textAlign: 'left', whiteSpace: 'nowrap' }}>
                All <Box component="span" sx={{ fontWeight: 'bold' }}>{book?.name} {params.chapter}</Box> takeaways
              </Box>
            </Box>
            <ChevronRightIcon sx={{ color: VERSE_TAKEAWAYS_COLORS.chipText }} />
          </Button>
        </Link>
      </Box>
    </Box>
  );
}
