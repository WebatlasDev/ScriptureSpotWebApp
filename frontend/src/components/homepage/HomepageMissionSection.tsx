'use client';

import { useEffect, useMemo, useState } from 'react';
import { Box, Typography, Stack, Skeleton, Avatar } from '@mui/material';
import type { SxProps, Theme } from '@mui/material';
import Link from 'next/link';
import Image from 'next/image';
import { MenuBookIcon } from '@/components/ui/phosphor-icons';
import { FormatQuoteIcon } from '@/components/ui/phosphor-icons';
import { KeyboardArrowRightIcon } from '@/components/ui/phosphor-icons';
import { WbSunnyOutlinedIcon } from '@/components/ui/phosphor-icons';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { FavoriteIcon } from '@/components/ui/phosphor-icons';
import { BookmarkBorderIcon } from '@/components/ui/phosphor-icons';
import { MenuBookOutlinedIcon } from '@/components/ui/phosphor-icons';
import { Primitive } from '@radix-ui/react-primitive';
import { useVerseOfTheDay } from '@/hooks/useVerseOfTheDay';
import { useBibleVerseTakeaways } from '@/hooks/useBibleVerseTakeaways';
import { useAuthorsCommentaries } from '@/hooks/useAuthorsCommentaries';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';
import { parseBibleReference } from '@/utils/bibleReference';
import { buildUrl } from '@/utils/navigation';

const TYPED_WORDS = ['Modern', 'Exciting', 'Historic', 'Accessible', 'Edifying'];

function TypingWord() {
  const [wordIndex, setWordIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = TYPED_WORDS[wordIndex];
    let timeout: NodeJS.Timeout | undefined;

    if (!isDeleting && displayText === currentWord) {
      timeout = setTimeout(() => setIsDeleting(true), 1400);
    } else if (isDeleting && displayText === '') {
      timeout = setTimeout(() => {
        setIsDeleting(false);
        setWordIndex((prev) => (prev + 1) % TYPED_WORDS.length);
      }, 200);
    } else {
      const nextLength = displayText.length + (isDeleting ? -1 : 1);
      timeout = setTimeout(
        () => setDisplayText(currentWord.slice(0, nextLength)),
        isDeleting ? 55 : 95,
      );
    }

    return () => {
      if (timeout) {
        clearTimeout(timeout);
      }
    };
  }, [displayText, isDeleting, wordIndex]);

  return (
    <Box component="span" sx={{ display: 'inline-flex', alignItems: 'center', gap: 1 }}>
      <Box
        component="span"
        sx={{
          background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(240, 242, 247, 0.85) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}
      >
        {displayText || '\u200B'}
      </Box>
      <Box
        component="span"
        sx={{
          width: '2px',
          height: '1.1em',
          backgroundColor: 'white',
          '@keyframes caretBlink': {
            '0%, 45%': { opacity: 1 },
            '55%, 100%': { opacity: 0 },
          },
          animation: 'caretBlink 1s steps(1) infinite',
        }}
      />
    </Box>
  );
}

const cardBaseSx: SxProps<Theme> = {
  backgroundColor: '#101010',
  borderRadius: 3,
  p: { xs: 2.5, md: 3 },
  display: 'flex',
  flexDirection: 'column',
  gap: 1.5,
  textDecoration: 'none',
  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  position: 'relative',
  overflow: 'hidden',
};

type VerseTakeawayData = {
  excerptTitle?: string;
  excerptContent?: string;
  quoteContent?: string;
  quoteAuthorName?: string;
};

function useVerseOfTheDayDetails() {
  const [version, setVersion] = useState(env.defaultVersion);

  useEffect(() => {
    const stored = getLastVersion();
    if (stored && stored !== env.defaultVersion) {
      setVersion(stored);
    }
  }, []);

  const { data: verseOfTheDay, isLoading: verseLoading } = useVerseOfTheDay(version);

  const parsedReference = useMemo(() => parseBibleReference(verseOfTheDay?.reference), [verseOfTheDay?.reference]);

  const chapterNumber = parsedReference ? Number(parsedReference.chapter) : 0;
  const verseNumber = parsedReference ? Number(parsedReference.verse) : 0;

  const { data: verseTakeaways, isLoading: takeawaysLoading } = useBibleVerseTakeaways(
    parsedReference?.bookSlug ?? '',
    chapterNumber,
    verseNumber,
  );

  const { data: commentaries, isLoading: commentariesLoading } = useAuthorsCommentaries(
    parsedReference?.bookSlug ?? '',
    chapterNumber,
    verseNumber,
    'Combined',
  );

  const commentaryAuthors = useMemo(() => {
    if (!commentaries) return [];
    // Get unique authors
    return commentaries.reduce((unique: any[], commentary: any) => {
      if (!unique.some(item => item.author.name === commentary.author.name)) {
        unique.push(commentary);
      }
      return unique;
    }, []).slice(0, 6); // Limit to 6 authors
  }, [commentaries]);

  const takeaways: VerseTakeawayData = useMemo(() => {
    const excerpt = verseTakeaways?.excerpts?.[0];
    const quote = verseTakeaways?.quotes?.[0];
    return {
      excerptTitle: excerpt?.title ?? undefined,
      excerptContent: excerpt?.content ?? undefined,
      quoteContent: quote?.content ?? undefined,
      quoteAuthorName: quote?.author?.name ?? quote?.source ?? undefined,
    };
  }, [verseTakeaways]);

  const verseHref = useMemo(() => {
    if (!parsedReference) {
      return null;
    }
    return buildUrl({
      version,
      book: parsedReference.bookSlug,
      chapter: parsedReference.chapter,
      verse: parsedReference.verse,
    });
  }, [parsedReference, version]);

  return {
    version,
    verseOfTheDay,
    verseHref,
    verseLoading,
    takeaways,
    takeawaysLoading,
    commentaryAuthors,
    commentariesLoading,
  };
}

function VerseOfTheDayCard({
  verse,
  reference,
  href,
  isLoading,
}: {
  verse?: string;
  reference?: string;
  href: string | null;
  isLoading: boolean;
}) {
  // BookOverviewModal header gradient
  const HEADER_GRADIENT = [
    'linear-gradient(90deg, rgba(33, 161, 241, 0.48) 0%, rgba(18, 135, 90, 0) 68%)',
    'linear-gradient(90deg, rgba(12, 95, 156, 0.16) 40%, rgba(13, 179, 100, 0.62) 100%)',
    'linear-gradient(0deg, rgba(4, 30, 41, 0.94) 0%, rgba(3, 18, 26, 0.98) 100%)',
    '#021018',
  ].join(', ');

  const isLink = Boolean(href);

  const card = (
    <Box
      sx={{
        ...cardBaseSx,
        background: HEADER_GRADIENT,
        cursor: isLink ? 'pointer' : 'default',
        '&:hover': isLink
          ? {
              transform: 'translateY(-4px)',
              boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
            }
          : undefined,
        '&:hover .verse-arrow': isLink
          ? {
              transform: 'translateX(4px)',
              color: '#FFFAFA',
            }
          : undefined,
        '&:hover .verse-reference': isLink
          ? {
              color: '#FFFAFA',
            }
          : undefined,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isLoading ? (
          <>
            <Skeleton variant="circular" sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 34, height: 34 }} />
            <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.12)', width: 100 }} />
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 34,
                height: 34,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Glow effect */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(27, 156, 238, 0.3) 0%, rgba(27, 156, 238, 0.15) 50%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                  opacity: 0.7,
                  pointerEvents: 'none',
                  filter: 'blur(12px)',
                }}
              />
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #1B9CEE 0%, #0C5F9C 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 0 20px rgba(27, 156, 238, 0.25)',
                }}
              >
                <BookmarkBorderIcon sx={{ color: 'white', fontSize: 19 }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 14, color: '#D9FAFF' }}>
              Verse
            </Typography>
          </>
        )}
      </Box>

      {/* Content */}
      {isLoading ? (
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.15)' }} />
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
          <Skeleton variant="text" width="40%" sx={{ bgcolor: 'rgba(255,255,255,0.1)' }} />
        </Stack>
      ) : (
        <>
          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ fontSize: 20, lineHeight: 1.6, color: '#FFFAFA' }}>{verse}</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography
              className="verse-reference"
              sx={{ fontSize: 14, color: 'rgba(217, 250, 255, 0.80)', fontWeight: 600, transition: 'color 0.15s ease-out' }}
            >
              {reference}
            </Typography>
            <ArrowForwardIcon
              className="verse-arrow"
              sx={{ fontSize: 16, color: 'rgba(217, 250, 255, 0.80)', transition: 'transform 0.15s ease-out, color 0.15s ease-out' }}
            />
          </Box>
        </>
      )}
    </Box>
  );

  if (isLink && href) {
    return (
      <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
        {card}
      </Link>
    );
  }

  return card;
}

function TakeawayCard({
  data,
  href,
  isLoading,
}: {
  data: VerseTakeawayData;
  href: string | null;
  isLoading: boolean;
}) {
  const plainText = useMemo(() => {
    if (!data.excerptContent) {
      return '';
    }
    return data.excerptContent.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
  }, [data.excerptContent]);

  return (
    <Box
      component={href ? Link : 'div'}
      href={href ? `${href}#verse-takeaways` : undefined}
      sx={{
        ...cardBaseSx,
        background: `
          linear-gradient(0deg, rgba(0, 0, 0, 0.60) 0%, rgba(0, 0, 0, 0.60) 100%),
          radial-gradient(circle at 20% 50%, #B72FDF 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, #41429A 0%, transparent 50%),
          linear-gradient(135deg, #B72FDF 0%, #41429A 100%)
        `,
        cursor: href ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        '&:hover': href
          ? {
              transform: 'translateY(-4px)',
              boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
            }
          : undefined,
        '&:hover .takeaway-arrow': href ? {
          transform: 'translateX(4px)',
          color: '#FFFAFA',
        } : undefined,
        '&:hover .takeaway-text': href ? {
          color: '#FFFAFA',
        } : undefined,
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isLoading ? (
          <>
            <Skeleton variant="circular" sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 34, height: 34 }} />
            <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.12)', width: 140 }} />
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 34,
                height: 34,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Glow effect */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(159, 56, 230, 0.3) 0%, rgba(159, 56, 230, 0.15) 50%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                  opacity: 0.7,
                  pointerEvents: 'none',
                  filter: 'blur(12px)',
                }}
              />
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #7F38BE 0%, #A632D5 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '2px solid rgba(255, 255, 255, 0.1)',
                  position: 'relative',
                  boxShadow: '0 0 20px rgba(159, 56, 230, 0.25)',
                }}
              >
                <WbSunnyOutlinedIcon sx={{ color: 'white', fontSize: 19 }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 14, color: '#E0BAFF' }}>
              Takeaway
            </Typography>
          </>
        )}
      </Box>

      {/* Content */}
      {isLoading ? (
        <Stack spacing={1.5} sx={{ mt: 4 }}>
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="text" width="70%" sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
        </Stack>
      ) : (
        <Box sx={{ mt: 4 }}>
          {data.excerptTitle && (
            <Typography sx={{ fontSize: 18, fontWeight: 700, color: '#FFFAFA', mb: 1 }}>
              {data.excerptTitle}
            </Typography>
          )}
          <Typography sx={{ fontSize: 15, color: 'rgba(255,255,255,0.9)', lineHeight: 1.6 }}>
            {plainText || 'Discover highlighted commentary that brings this passage to life.'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography
              className="takeaway-text"
              sx={{ color: 'rgba(224, 186, 255, 0.80)', fontSize: 14, fontWeight: 500, transition: 'color 0.15s ease-out' }}
            >
              See All Verse Takeaways
            </Typography>
            <ArrowForwardIcon
              className="takeaway-arrow"
              sx={{ fontSize: 16, color: 'rgba(224, 186, 255, 0.80)', transition: 'transform 0.15s ease-out, color 0.15s ease-out' }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}

function CommentariesCard() {
  return (
    <Box
      component={Link}
      href="/commentators"
      sx={{
        ...cardBaseSx,
        cursor: 'pointer',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
        },
      }}
    >
      <Typography sx={{ fontSize: 12, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.7)' }}>
        Commentaries
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <MenuBookIcon sx={{ fontSize: 24, color: '#FFD700' }} />
        <Typography sx={{ fontSize: 16, fontWeight: 600, color: '#FFFAFA' }}>
          View All Commentaries
        </Typography>
      </Box>
      <Typography sx={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>
        Dive into verse-by-verse commentary from trusted theologians and modern scholars.
      </Typography>
    </Box>
  );
}

function QuoteCard({
  content,
  authorName,
  isLoading,
}: {
  content?: string;
  authorName?: string;
  isLoading: boolean;
}) {
  // Fixed Hebrew-style gradient and colors
  const HEBREW_GRADIENT = 'linear-gradient(0deg, rgba(0, 0, 0, 0.20) 0%, rgba(0, 0, 0, 0.20) 100%), linear-gradient(90deg, rgba(226, 182, 75, 0.04) 50%, rgba(0, 0, 0, 0.40) 100%), linear-gradient(90deg, rgba(226, 182, 75, 0.06) 59%, rgba(249, 216, 73, 0.60) 100%), linear-gradient(1deg, rgba(226, 182, 75, 0.03) 0%, rgba(249, 216, 73, 0.30) 100%), linear-gradient(90deg, rgba(249, 216, 73, 0.10) 0%, #E2B64B 100%), #121212';
  const ACCENT_COLOR = '#F0D043';

  return (
    <Box sx={{
      ...cardBaseSx,
      background: HEBREW_GRADIENT,
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        {isLoading ? (
          <>
            <Skeleton variant="circular" sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 34, height: 34 }} />
            <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.12)', width: 80 }} />
          </>
        ) : (
          <>
            <Box
              sx={{
                width: 34,
                height: 34,
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {/* Glow effect */}
              <Box
                sx={{
                  position: 'absolute',
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  background: 'radial-gradient(circle, rgba(240, 208, 67, 0.3) 0%, rgba(240, 208, 67, 0.15) 50%, transparent 70%)',
                  transform: 'translate(-50%, -50%)',
                  top: '50%',
                  left: '50%',
                  opacity: 0.7,
                  pointerEvents: 'none',
                  filter: 'blur(12px)',
                }}
              />
              <Box
                sx={{
                  width: 34,
                  height: 34,
                  background: 'linear-gradient(135deg, #F9D849 0%, #998100 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  boxShadow: '0 0 20px rgba(240, 208, 67, 0.25)',
                }}
              >
                <FormatQuoteIcon sx={{ fontSize: 19, color: 'white' }} />
              </Box>
            </Box>
            <Typography sx={{ fontSize: 14, color: ACCENT_COLOR }}>
              Quote
            </Typography>
          </>
        )}
      </Box>

      {/* Content */}
      {isLoading ? (
        <Stack spacing={1.5} sx={{ mt: 2.5 }}>
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
          <Skeleton variant="text" width="60%" sx={{ bgcolor: 'rgba(255,255,255,0.12)' }} />
        </Stack>
      ) : (
        <>
          <Box sx={{ mt: 2.5 }}>
            <Typography sx={{ fontSize: 16, lineHeight: 1.6, color: '#FFFAFA' }}>
              {content || '"Let Scripture illuminate every study session."'}
            </Typography>
          </Box>
          <Box sx={{ mt: 2, pt: 2, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Typography
              sx={{ fontSize: 14, color: ACCENT_COLOR, fontWeight: 600 }}
            >
              {authorName || 'Scripture Spot Team'}
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}

function CommentariesAvailableCard({
  authors,
  href,
  verseReference,
  isLoading,
}: {
  authors: any[];
  href: string | null;
  verseReference?: string;
  isLoading: boolean;
}) {
  // Don't render if no authors available
  if (!isLoading && authors.length === 0) {
    return null;
  }

  // Show only first 3 authors
  const displayAuthors = authors.slice(0, 3);

  return (
    <Box
      component={href ? Primitive.button : 'div'}
      type={href ? 'button' : undefined}
      onClick={href ? () => window.location.href = href : undefined}
      sx={{
        ...cardBaseSx,
        p: { xs: 6, md: 7.5 },
        background: `
          linear-gradient(0deg, rgba(0, 0, 0, 0.50) 0%, rgba(0, 0, 0, 0.50) 100%),
          radial-gradient(ellipse 180% 180% at 50% 30%, rgba(102, 126, 234, 0.18) 0%, transparent 100%),
          radial-gradient(ellipse 180% 180% at 50% 70%, rgba(118, 75, 162, 0.15) 0%, transparent 100%),
          #101010
        `,
        cursor: href ? 'pointer' : 'default',
        textAlign: 'center',
        font: 'inherit',
        border: 'none',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        '&:hover': href
          ? {
              transform: 'translateY(-4px)',
              boxShadow: '0px 8px 24px rgba(0,0,0,0.3)',
            }
          : undefined,
        '&:hover .commentaries-arrow': href ? {
          transform: 'scale(1.1)',
          opacity: 1,
        } : undefined,
      }}
    >
      {isLoading ? (
        <Stack spacing={2.5} sx={{ alignItems: 'center', width: '100%' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                variant="circular"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.15)',
                  width: 52,
                  height: 52,
                  marginLeft: i > 0 ? '-10px' : 0,
                  zIndex: 3 - i,
                }}
              />
            ))}
          </Box>
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.12)', width: 200, height: 28 }} />
          <Skeleton variant="text" sx={{ bgcolor: 'rgba(255,255,255,0.1)', width: 240, height: 20 }} />
          <Skeleton variant="circular" sx={{ bgcolor: 'rgba(255,255,255,0.12)', width: 24, height: 24 }} />
        </Stack>
      ) : (
        <>
          {/* Avatars with glow */}
          <Box
            sx={{
              position: 'relative',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              mb: 2.5,
            }}
          >
            {/* Subtle glow behind avatars */}
            <Box
              sx={{
                position: 'absolute',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(102, 126, 234, 0.2) 0%, rgba(118, 75, 162, 0.15) 40%, transparent 70%)',
                filter: 'blur(24px)',
                pointerEvents: 'none',
              }}
            />
            {displayAuthors.map((commentary: any, index: number) => (
              <Avatar
                key={`${commentary.author.name}-${index}`}
                alt={commentary.author.name}
                sx={{
                  width: 52,
                  height: 52,
                  fontSize: 12,
                  marginLeft: index > 0 ? '-10px' : 0,
                  zIndex: displayAuthors.length - index,
                  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.25)',
                  background: commentary.author.colorScheme?.primary
                    ? `linear-gradient(216deg, ${commentary.author.colorScheme.primary} 0%, black 100%)`
                    : '#5B41DE',
                  position: 'relative',
                }}
              >
                {commentary.author.image ? (
                  <Image
                    src={commentary.author.image}
                    alt={commentary.author.name}
                    width={52}
                    height={52}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                ) : (
                  commentary.author.name.charAt(0)
                )}
              </Avatar>
            ))}
          </Box>

          {/* Heading */}
          <Typography
            component="h3"
            sx={{
              fontSize: { xs: 21, md: 23 },
              fontWeight: 700,
              lineHeight: 1,
              color: '#FFFFFF',
              background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(240, 242, 247, 0.85) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              mb: 1,
            }}
          >
            Ready to Dive Deeper?
          </Typography>

          {/* Subtext */}
          <Typography
            sx={{
              fontSize: 15,
              color: 'rgba(255,255,255,0.7)',
              fontWeight: 400,
              lineHeight: 1.5,
              mb: 2.5,
            }}
          >
            See all Scripture Spot content on <Box component="span" sx={{ color: 'rgba(255,255,255,1)' }}>{verseReference || 'this verse'}</Box>
          </Typography>

          {/* Arrow */}
          <ArrowForwardIcon
            className="commentaries-arrow"
            sx={{
              fontSize: 24,
              color: '#A8B3FF',
              opacity: 0.65,
              transition: 'transform 0.15s ease-out, opacity 0.15s ease-out',
            }}
          />
        </>
      )}
    </Box>
  );
}

export default function HomepageMissionSection() {
  const { verseOfTheDay, verseHref, verseLoading, takeaways, takeawaysLoading, commentaryAuthors, commentariesLoading } = useVerseOfTheDayDetails();

  return (
    <Box
      component="section"
      sx={{
        position: 'relative',
        mt: { xs: -8, md: -10 },
        pt: { xs: 8, md: 18 },
        pb: { xs: 12, md: 16 },
        px: { xs: 3, sm: 6, md: 12 },
        background:
          'linear-gradient(180deg, rgba(0,0,0,0.95) 0%, rgba(6,6,6,0.98) 35%, rgba(8,8,8,1) 100%)',
        zIndex: 3,
      }}
    >
      <Box
        sx={{
          maxWidth: '1160px',
          mx: 'auto',
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: { xs: 6, md: 8 },
          alignItems: { xs: 'stretch', md: 'flex-start' },
        }}
      >
        <Box
          sx={{
            flex: { xs: '1 1 0%', md: '0 0 50%' },
            display: 'flex',
            flexDirection: 'column',
            gap: 3,
            position: { md: 'sticky' },
            top: { md: '100px' },
            height: { md: 'fit-content' },
          }}
        >
          <Typography sx={{ fontSize: 14, color: 'rgba(255, 255, 255, 0.6)' }}>
            Welcome to Scripture Spot
          </Typography>
          <Typography
            component="h2"
            sx={{
              fontSize: { xs: 34, sm: 42, md: 48 },
              lineHeight: 1.1,
              fontWeight: 700,
              maxWidth: '24ch',
            }}
          >
            Finally, Bible Study That's <TypingWord />
          </Typography>
          <Typography sx={{ fontSize: 20, lineHeight: 1.6, color: 'rgba(255,255,255,0.78)', maxWidth: '48ch' }}>
            Our mission is to unite <Box component="span" sx={{ color: 'rgba(255,255,255,1)' }}>2,000 years</Box> of biblical insight, beautiful worship, and life-changing wisdom – all in one place and all around <Box component="span" sx={{ color: 'rgba(255,255,255,1)' }}>the Word of God</Box>.
          </Typography>
          <Box sx={{ mt: { xs: 0.5 }, mb: { xs: 4, md: 0 } }}>
            <Box
              component={Link}
              href="/support"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1.5,
                px: 3,
                py: 1.75,
                backgroundColor: 'rgba(255, 255, 255, 0.10)',
                borderRadius: '12px',
                textDecoration: 'none',
                transition: 'all 0.25s ease',
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  borderRadius: 'inherit',
                  zIndex: -1,
                  transition: 'box-shadow 0.65s ease-in-out',
                  boxShadow: 'none',
                },
                '&:hover::before': {
                  boxShadow: '0px 4px 60px 30px rgba(255, 72, 66, 0.12)',
                },
                '&:hover': {
                  backgroundColor: 'rgba(255, 72, 66, 0.25)',
                  transform: 'translateY(-2px)',
                },
                '&:hover .heart-icon': {
                  color: '#FF4842',
                },
                '&:active': {
                  transform: 'scale(0.98)',
                },
              }}
            >
              <FavoriteIcon className="heart-icon" sx={{ fontSize: 22, color: 'rgba(255, 255, 255, 0.85)', transition: 'color 0.25s ease' }} />
              <Typography sx={{ fontSize: 16, fontWeight: 600, color: 'rgba(255, 255, 255, 0.90)' }}>
                Support Us
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box sx={{ flex: { xs: '1 1 0%', md: '0 0 50%' } }}>
          {/* Section Header */}
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 3.25,
              width: '100%',
              mb: 3,
            }}
          >
            <Typography
              component="h2"
              sx={{
                fontSize: { xs: 21, md: 23 },
                fontWeight: 700,
                lineHeight: 1,
                color: '#FFFFFF',
                background: 'linear-gradient(90deg, #FFFFFF 0%, rgba(240, 242, 247, 0.85) 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Verse of the Day
            </Typography>
            <Box
              sx={{
                width: '100%',
                height: 2,
                borderRadius: 999,
                background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(237,240,245,0))',
                opacity: 0.6,
              }}
            />
          </Box>

          <Stack spacing={3}>
            <VerseOfTheDayCard
              verse={verseOfTheDay?.text}
              reference={verseOfTheDay?.reference}
              href={verseHref}
              isLoading={verseLoading}
            />
            <TakeawayCard data={takeaways} href={verseHref} isLoading={takeawaysLoading} />
            <QuoteCard
              content={takeaways.quoteContent}
              authorName={takeaways.quoteAuthorName}
              isLoading={takeawaysLoading}
            />
            <CommentariesAvailableCard
              authors={commentaryAuthors}
              href={verseHref}
              verseReference={verseOfTheDay?.reference}
              isLoading={commentariesLoading}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
