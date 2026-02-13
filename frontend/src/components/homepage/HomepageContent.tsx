'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useTransition } from 'react';
import { Box, useMediaQuery } from '@mui/material';
import { usePathname, useRouter } from 'next/navigation';
import ResumeExplorationBar from './ResumeExplorationBar';
import VerseSelector from './VerseSelector';
import Header from '@/components/layout/Header';
import LogoImage from '@/components/common/LogoImage';
import { useTheme } from '@mui/material/styles';
import HomepageMissionSection from './HomepageMissionSection';
import Footer from '@/components/layout/Footer';
import { safeGetItem } from '@/utils/localStorageUtils';

type StoredValue = {
  path?: string;
  reference?: string;
};

const parseStoredValue = (value: string | null): StoredValue | null => {
  if (!value) {
    return null;
  }

  try {
    const parsed = JSON.parse(value);
    if (parsed && typeof parsed === 'object') {
      return parsed as StoredValue;
    }
  } catch (error) {
    return { path: value };
  }
  return null;
};

const normalizeStoredValue = (value: string | null) => (value && value !== 'null' ? value : null);

const getCookieValue = (name: string) => {
  if (typeof document === 'undefined') {
    return null;
  }

  const match = document.cookie
    .split(';')
    .map((cookie) => cookie.trim())
    .find((cookie) => cookie.startsWith(`${name}=`));

  if (!match) {
    return null;
  }

  return decodeURIComponent(match.split('=').slice(1).join('='));
};

const toTitleCase = (str: string) =>
  str
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (letter) => letter.toUpperCase());

function buildResumeDetails(
  lastPageValue: string | null,
  lastVerseValue: string | null
) {
  const parsedVerse = parseStoredValue(lastVerseValue);
  const parsedPage = parseStoredValue(lastPageValue);

  if (!parsedVerse?.reference && !parsedPage?.path) {
    return null;
  }

  if (parsedVerse?.reference) {
    return {
      display: parsedVerse.reference,
      href: parsedVerse.path || parsedPage?.path || '/commentators',
    };
  }

  if (parsedPage?.path) {
    const pageSegments = parsedPage.path.split('/').filter(Boolean);
    let displayText = 'your last page';

    if (pageSegments.includes('commentators')) {
      if (pageSegments.length > 1) {
        const authorSlug = pageSegments[pageSegments.indexOf('commentators') + 1];
        const authorName = toTitleCase(authorSlug || 'commentary');
        displayText = `${authorName} Commentaries`;
      } else {
        displayText = 'Commentators';
      }
    } else if (pageSegments.includes('bible')) {
      displayText = 'Bible Study';
    } else if (pageSegments.includes('hymns')) {
      displayText = 'Hymns';
    } else if (pageSegments.includes('doctrines')) {
      displayText = 'Doctrines';
    } else if (pageSegments.includes('study-plans')) {
      displayText = 'Study Plans';
    } else if (pageSegments.includes('bookmarks')) {
      displayText = 'Bookmarks';
    } else if (pageSegments.length >= 4) {
      const [, bookSlug, chapter, verse] = pageSegments;
      if (bookSlug && chapter && verse && !Number.isNaN(Number(chapter)) && !Number.isNaN(Number(verse))) {
        const bookName = toTitleCase(bookSlug);
        displayText = `${bookName} ${chapter}:${verse}`;
      }
    } else if (pageSegments.length >= 3) {
      const [, bookSlug, chapter] = pageSegments;
      if (bookSlug && chapter && !Number.isNaN(Number(chapter))) {
        const bookName = toTitleCase(bookSlug);
        displayText = `${bookName} ${chapter}`;
      }
    }

    return {
      display: displayText,
      href: parsedPage.path,
    };
  }

  return null;
}

export default function HomepageContent() {
  const router = useRouter();
  const pathname = usePathname();
  const [videoFailed, setVideoFailed] = useState(false);
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));
  const [isResumePending, startResumeTransition] = useTransition();
  const [lastInteraction, setLastInteraction] = useState<{ lastPage: string | null; lastVerse: string | null }>({
    lastPage: null,
    lastVerse: null,
  });

  useEffect(() => {
    const storedLastPage = normalizeStoredValue(safeGetItem('lastPage'));
    const storedLastVerse = normalizeStoredValue(safeGetItem('lastVerse'));
    const cookieLastPage = getCookieValue('lastPage');

    setLastInteraction({
      lastPage: storedLastPage ?? cookieLastPage,
      lastVerse: storedLastVerse,
    });
  }, []);

  const { lastPage, lastVerse } = lastInteraction;

  const resumeDetails = useMemo(
    () => buildResumeDetails(lastPage, lastVerse),
    [lastPage, lastVerse]
  );
  const resumeHref = resumeDetails?.href;

  const stackGap = resumeDetails
    ? { xs: 2.25, md: 3.375 }
    : { xs: 0.25, md: 0.25 };

  const logoPadding = resumeDetails
    ? { xs: 3, md: 4 }
    : { xs: 2.5, md: 3.5 };

  const logoHeight = 48;
  const logoWidths = { xs: 180, md: 240 };

  const heroRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [parallaxState, setParallaxState] = useState({ translate: 0, opacity: 1 });

  useEffect(() => {
    const handleScroll = () => {
      // Skip parallax on mobile
      if (isSmDown) {
        return;
      }

      if (rafRef.current) {
        return;
      }

      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const node = heroRef.current;
        if (!node) {
          return;
        }

        const rect = node.getBoundingClientRect();
        const height = rect.height || 1;
        const progress = Math.min(Math.max(-rect.top / height, 0), 1);
        const nextTranslate = progress * 90;
        const nextOpacity = 1 - progress * 0.7;

        setParallaxState((prev) => {
          if (
            Math.abs(prev.translate - nextTranslate) < 0.5 &&
            Math.abs(prev.opacity - nextOpacity) < 0.02
          ) {
            return prev;
          }

          return {
            translate: nextTranslate,
            opacity: nextOpacity,
          };
        });
      });
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) {
        window.cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [isSmDown]);

  const heroStyle = useMemo(
    () => {
      // No parallax on mobile
      if (isSmDown) {
        return {};
      }

      // Parallax on desktop
      return {
        transform: `translateY(${parallaxState.translate}px)`,
        opacity: parallaxState.opacity,
        willChange: 'transform, opacity',
      };
    },
    [parallaxState.opacity, parallaxState.translate, isSmDown],
  );

  const handleResumeClick = useCallback(() => {
    if (!resumeHref || isResumePending) {
      return;
    }

    if (resumeHref === pathname) {
      router.refresh();
      return;
    }

    startResumeTransition(() => {
      router.push(resumeHref);
    });
  }, [resumeHref, isResumePending, pathname, router, startResumeTransition]);

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        color: '#FFFAFA',
        backgroundColor: '#000',
        overflow: 'visible',
      }}
    >
      <Box
        ref={heroRef}
        style={heroStyle}
        sx={{
          position: 'relative',
          minHeight: '100vh',
          width: '100%',
          overflow: 'hidden',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            zIndex: 0,
            backgroundImage: videoFailed ? 'url(/assets/images/homepage/homepage-hero-poster.webp)' : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            transition: 'opacity 0.3s ease',
          }}
        />

        <Box
          component="video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/images/homepage/homepage-hero-poster.webp"
          onError={() => setVideoFailed(true)}
          sx={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 0,
            display: videoFailed ? 'none' : 'block',
          }}
        >
          <source src="/assets/videos/homeoage-hero.webm" type="video/webm" />
          <source src="/assets/videos/homepage-hero.mp4" type="video/mp4" />
        </Box>

        <Box
          sx={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(0deg, rgba(0, 0, 0, 0.30) 0%, rgba(0, 0, 0, 0.30) 100%), radial-gradient(ellipse 120% 200% at 0% 50%, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 60%)',
            zIndex: 1,
          }}
        />

        <Box
          sx={{
            position: 'relative',
            zIndex: 2,
            display: 'flex',
            flexDirection: 'column',
            minHeight: '100vh',
          }}
        >
          <Header density="compact" />

          <Box
            sx={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: stackGap,
              px: { xs: 3, sm: 6, md: 12 },
              pb: { xs: 3, md: 6 },
              width: '100%',
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: logoPadding,
                borderRadius: { xs: 3, md: 4 },
                background:
                  'radial-gradient(circle at 50% 50%, rgba(255, 215, 0, 0.18) 0%, rgba(255, 215, 0, 0) 65%)',
              }}
            >
              <Box sx={{ width: logoWidths, maxWidth: '100%' }}>
                <LogoImage
                  height={logoHeight}
                  style={{ width: '100%', height: 'auto', display: 'block' }}
                />
              </Box>
            </Box>

            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: { xs: '100%', md: 'fit-content' },
                mx: 'auto',
                pt: resumeDetails ? { xs: 3.75, sm: 3 } : 0,
              }}
            >
              {resumeDetails && (
                <ResumeExplorationBar
                  label={resumeDetails.display}
                  onClick={handleResumeClick}
                  loading={isResumePending}
                />
              )}
              <Box
                sx={{
                  mt: resumeDetails ? { xs: 1.25, sm: 2 } : 0,
                  width: { xs: '100%', md: 'fit-content' },
                }}
              >
                <VerseSelector />
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>

      <HomepageMissionSection />

      <Footer />
    </Box>
  );
}
