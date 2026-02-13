'use client';

import { useState, useEffect, useRef, useCallback, useTransition } from 'react';
import type { MouseEvent } from 'react';
import dynamic from 'next/dynamic';
import { Box, Collapse, Typography } from '@mui/material';
import { toast } from 'react-toastify';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { useCreateBookmark } from '@/hooks/useBookmarkMutations';
import { BookmarkType } from '@/types/bookmark';
import { usePrefetchVerse } from '@/hooks/usePrefetchVerse';
import { useIsMobile } from '@/hooks/useResponsive';
import { interlinearThemes } from '@/styles/interlinearThemes';
import { skeletonBaseSx } from '@/styles/skeletonStyles';

import VerseNavigationBar from './VerseNavigationBar';
import VerseActions from './VerseActions';
import StudyToggleGroup, { LanguageConfig } from './StudyToggleGroup';
import { useRouter } from 'next/navigation';
import { useDeferredRender } from '@/hooks/useDeferredRender';

const CrossReferencesDrawer = dynamic(() => import('./CrossReferencesDrawer'), { ssr: false });
const InterlinearDrawer = dynamic(() => import('./InterlinearDrawer'), { ssr: false });
const BookmarkPromoModal = dynamic(() => import('@/components/marketing/BookmarkPromoModal'), { ssr: false });

interface VerseHeaderProps {
  verseData: {
    reference: string;
    content: string;
    id?: string;
  };
  version: string;
  bookName: string;
  bookSlug: string;
  chapterNumber: number;
  verseNumber: number;
  isLoading?: boolean;
  isVerseTransitioning?: boolean;
  onNavigateStart?: () => void;
}

const GREEK_BOOKS = new Set([
  'Matthew', 'Mark', 'Luke', 'John', 'Acts', 'Romans', '1 Corinthians', '2 Corinthians', 'Galatians',
  'Ephesians', 'Philippians', 'Colossians', '1 Thessalonians', '2 Thessalonians', '1 Timothy', '2 Timothy',
  'Titus', 'Philemon', 'Hebrews', 'James', '1 Peter', '2 Peter', '1 John', '2 John', '3 John', 'Jude', 'Revelation',
]);

export default function VerseHeader({
  verseData,
  version,
  bookName,
  bookSlug,
  chapterNumber,
  verseNumber,
  isLoading = false,
  isVerseTransitioning = false,
  onNavigateStart,
}: VerseHeaderProps) {
  const isMobile = useIsMobile();
  const router = useRouter();
  const [isFullChapterPending, startFullChapterTransition] = useTransition();

  const { user } = useUser();
  const isPremium = usePremium();
  const { createBookmark } = useCreateBookmark();
  const { prefetchCrossReferences, prefetchInterlinear } = usePrefetchVerse();

  const [isInterlinearOpen, setIsInterlinearOpen] = useState(false);
  const [isCrossReferencesOpen, setIsCrossReferencesOpen] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [bookmarkPromoOpen, setBookmarkPromoOpen] = useState(false);
  const shouldRenderBookmarkPromo = useDeferredRender(bookmarkPromoOpen);
  const [showCopied, setShowCopied] = useState(false);
  const [showActionsStartFade, setShowActionsStartFade] = useState(false);
  const [showActionsEndFade, setShowActionsEndFade] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const crossReferencesHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const interlinearHoverTimeout = useRef<NodeJS.Timeout | null>(null);
  const actionsScrollRef = useRef<HTMLDivElement | null>(null);

  const [languageConfig, setLanguageConfig] = useState<LanguageConfig>({
    label: 'LOADING...',
    themeColor: 'rgba(255, 255, 255, 0.10)',
    character: '...',
  });

  useEffect(() => {
    const isGreek = GREEK_BOOKS.has(bookName);
    const theme = isGreek ? interlinearThemes.GREEK : interlinearThemes.HEBREW;
    setLanguageConfig({
      label: isGreek ? 'GREEK' : 'HEBREW',
      themeColor: theme.buttonActiveBg,
      character: isGreek ? 'α' : 'א',
    });
  }, [bookName]);

  const updateActionFadeVisibility = useCallback(() => {
    if (!isMobile) {
      setShowActionsStartFade(false);
      setShowActionsEndFade(false);
      return;
    }

    const container = actionsScrollRef.current;

    if (!container) {
      setShowActionsStartFade(false);
      setShowActionsEndFade(false);
      return;
    }

    const { scrollLeft, scrollWidth, clientWidth } = container;
    const canScrollHorizontally = scrollWidth > clientWidth + 1;

    if (!canScrollHorizontally) {
      setShowActionsStartFade(false);
      setShowActionsEndFade(false);
      return;
    }

    setShowActionsStartFade(scrollLeft > 2);
    setShowActionsEndFade(scrollLeft < scrollWidth - clientWidth - 2);
  }, [isMobile]);

  useEffect(() => {
    if (!isMobile) {
      return;
    }

    const container = actionsScrollRef.current;
    if (!container) {
      return;
    }

    const handleScroll = () => {
      updateActionFadeVisibility();
    };

    handleScroll();

    container.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      container.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [isMobile, updateActionFadeVisibility]);

  useEffect(() => {
    updateActionFadeVisibility();
  }, [
    updateActionFadeVisibility,
    isMobile,
    isBookmarked,
    languageConfig.label,
    languageConfig.character,
    isInterlinearOpen,
    isCrossReferencesOpen,
  ]);

  useEffect(() => {
    setIsTransitioning(false);
  }, [bookSlug, chapterNumber, verseNumber]);

  const handleNavigationStart = useCallback(() => {
    setIsTransitioning(true);
    onNavigateStart?.();
  }, [onNavigateStart]);

  const chapterUrl = `/${version.toLowerCase()}/${bookSlug}/${chapterNumber}`;

  const handleFullChapterClick = useCallback((event: MouseEvent<HTMLElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }

    event.preventDefault();

    if (isFullChapterPending) {
      return;
    }

    handleNavigationStart();
    startFullChapterTransition(() => {
      router.push(chapterUrl);
    });
  }, [chapterUrl, handleNavigationStart, isFullChapterPending, router, startFullChapterTransition]);

  const currentVerse = {
    book: bookName,
    chapter: chapterNumber,
    verse: verseNumber,
    version,
  };

  const handleBookmark = async () => {
    if (!user || !isPremium) {
      setBookmarkPromoOpen(true);
      return;
    }

    if (!verseData?.id) {
      toast.error('Verse ID is required for bookmarking');
      return;
    }

    try {
      await createBookmark({
        id: verseData.id,
        type: BookmarkType.VERSE_VERSION,
        userId: user.id,
      });
      setIsBookmarked(true);
    } catch {
      toast.error('Bookmark error');
    }
  };

  const buildSharePayload = () => {
    const url = `${window.location.origin}/${version.toLowerCase()}/${bookSlug}/${chapterNumber}/${verseNumber}`;
    return {
      title: `${verseData.reference} (${version})`,
      text: `"${verseData.content}"\n\n- ${verseData.reference} (${version})`,
      url,
    };
  };

  const triggerCopiedToast = () => {
    setShowCopied(true);
    window.setTimeout(() => setShowCopied(false), 2500);
  };

  const handleShare = async () => {
    if (!verseData?.content) return;

    try {
      const shareData = buildSharePayload();
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);
      } else {
        const shareText = `${shareData.text}\n\nSee more on Scripture Spot: ${shareData.url}`;
        await navigator.clipboard.writeText(shareText);
        triggerCopiedToast();
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        try {
          const shareData = buildSharePayload();
          const shareText = `${shareData.text}\n\nSee more on Scripture Spot: ${shareData.url}`;
          await navigator.clipboard.writeText(shareText);
          triggerCopiedToast();
        } catch {
          toast.error('Failed to share or copy text');
        }
      }
    }
  };

  const handleCopy = async () => {
    if (!verseData?.content) return;
    const shareData = buildSharePayload();
    const copyText = `${shareData.text}\n\nSee more on Scripture Spot: ${shareData.url}`;

    try {
      await navigator.clipboard.writeText(copyText);
      triggerCopiedToast();
    } catch {
      toast.error('Failed to copy verse');
    }
  };

  const handleInterlinearHover = useCallback(() => {
    if (interlinearHoverTimeout.current) {
      clearTimeout(interlinearHoverTimeout.current);
    }
    interlinearHoverTimeout.current = setTimeout(() => {
      prefetchInterlinear(bookSlug, chapterNumber, verseNumber);
    }, 200);
  }, [bookSlug, chapterNumber, verseNumber, prefetchInterlinear]);

  const handleCrossReferencesHover = useCallback(() => {
    if (crossReferencesHoverTimeout.current) {
      clearTimeout(crossReferencesHoverTimeout.current);
    }
    crossReferencesHoverTimeout.current = setTimeout(() => {
      prefetchCrossReferences(bookSlug, chapterNumber, verseNumber, version);
    }, 200);
  }, [bookSlug, chapterNumber, verseNumber, version, prefetchCrossReferences]);

  const toggleInterlinear = () => {
    setIsInterlinearOpen((prev) => {
      const next = !prev;
      if (next) {
        void prefetchInterlinear(bookSlug, chapterNumber, verseNumber);
        setIsCrossReferencesOpen(false);
      }
      return next;
    });
  };

  const toggleCrossReferences = () => {
    setIsCrossReferencesOpen((prev) => {
      const next = !prev;
      if (next) {
        void prefetchCrossReferences(bookSlug, chapterNumber, verseNumber, version);
        setIsInterlinearOpen(false);
      }
      return next;
    });
  };

  useEffect(() => {
    return () => {
      if (interlinearHoverTimeout.current) {
        clearTimeout(interlinearHoverTimeout.current);
      }
      if (crossReferencesHoverTimeout.current) {
        clearTimeout(crossReferencesHoverTimeout.current);
      }
    };
  }, []);

  const showSkeleton = isLoading || isTransitioning || isVerseTransitioning;
  const toggleSkeletonIds = ['interlinear', 'cross'] as const;
  const toggleSkeletonWidths = isMobile ? ['118px', '140px'] : ['150px', '174px'];
  const actionSkeletonIds = ['view', 'bookmark', 'copy', 'share'] as const;
  const actionSkeletonWidths = isMobile ? ['116px', '132px', '102px', '102px'] : ['44px', '44px', '44px', '44px'];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 2.5, md: 3 } }}>
      <Box
        sx={{
          p: { xs: 3, sm: 3.5, md: 4 },
          background: '#1A1A1A',
          borderRadius: 3.5,
          display: 'flex',
          flexDirection: 'column',
          gap: { xs: 2, sm: 1.75, md: 2 },
          position: 'relative',
          zIndex: 10,
          overflow: 'hidden',
        }}
      >
        <VerseNavigationBar
          version={version}
          bookSlug={bookSlug}
          bookName={bookName}
          chapterNumber={chapterNumber}
          verseNumber={verseNumber}
          onNavigateStart={handleNavigationStart}
        />

        {showSkeleton ? (
          <Box
            sx={{
              ...skeletonBaseSx,
              width: '100%',
              height: { xs: 28, sm: 34, md: 40 },
              borderRadius: 2,
              position: 'relative',
              zIndex: 2,
            }}
          />
        ) : (
          <Typography
            sx={{
              color: '#FFFAFA',
              fontSize: { xs: 22, sm: 24, md: 28 },
              fontFamily: 'Inter',
              fontWeight: 400,
              lineHeight: { xs: '30px', sm: '38px', md: '45px' },
              position: 'relative',
              zIndex: 2,
            }}
          >
            {verseData.content}
          </Typography>
        )}

        <Box
          sx={{
            position: 'relative',
            width: '100%',
          }}
        >
          <Box
            ref={actionsScrollRef}
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: { xs: 1.25, md: 1.5 },
              flexWrap: isMobile ? 'nowrap' : 'wrap',
              overflowX: isMobile ? 'auto' : 'visible',
              overflowY: 'visible',
              width: '100%',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              '&::-webkit-scrollbar': {
                display: 'none',
              },
            }}
          >
            <Box
              sx={{
                flexShrink: isMobile ? 0 : 1,
                minWidth: isMobile ? 'max-content' : 0,
              }}
            >
              {showSkeleton ? (
                <Box
                  sx={{
                    display: 'flex',
                    gap: { xs: 1, md: 1.5 },
                    flexWrap: isMobile ? 'nowrap' : 'wrap',
                  }}
                >
                  {toggleSkeletonIds.map((id, index) => (
                    <Box
                      key={`toggle-skeleton-${id}`}
                      sx={{
                        ...skeletonBaseSx,
                        width: toggleSkeletonWidths[index],
                        height: 44,
                        borderRadius: 999,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <StudyToggleGroup
                  languageConfig={languageConfig}
                  isInterlinearOpen={isInterlinearOpen}
                  isCrossReferencesOpen={isCrossReferencesOpen}
                  onToggleInterlinear={toggleInterlinear}
                  onInterlinearHover={handleInterlinearHover}
                  onToggleCrossReferences={toggleCrossReferences}
                  onCrossReferencesHover={handleCrossReferencesHover}
                  interlinearDisabled={languageConfig.label === 'LOADING...'}
                  isMobile={isMobile}
                />
              )}
            </Box>
            <Box
              sx={{
                flexShrink: isMobile ? 0 : 1,
                minWidth: isMobile ? 'max-content' : 0,
                display: 'flex',
                alignItems: 'center',
              }}
            >
              {showSkeleton ? (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: isMobile ? 1 : 1.25,
                  }}
                >
                  {actionSkeletonIds.map((id, index) => (
                    <Box
                      key={`action-skeleton-${id}`}
                      sx={{
                        ...skeletonBaseSx,
                        width: actionSkeletonWidths[index],
                        height: 44,
                        borderRadius: 999,
                      }}
                    />
                  ))}
                </Box>
              ) : (
                <VerseActions
                  chapterUrl={chapterUrl}
                  onBookmark={handleBookmark}
                  onShare={handleShare}
                  onCopy={handleCopy}
                  isBookmarked={isBookmarked}
                  isMobile={isMobile}
                  onFullChapterClick={handleFullChapterClick}
                  fullChapterLoading={isFullChapterPending}
                />
              )}
            </Box>
          </Box>
          {isMobile && (
            <>
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  bottom: 0,
                  width: '32px',
                  background: 'linear-gradient(to right, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0))',
                  opacity: showActionsStartFade ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  bottom: 0,
                  width: '32px',
                  background: 'linear-gradient(to left, rgba(26, 26, 26, 0.95), rgba(26, 26, 26, 0))',
                  opacity: showActionsEndFade ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                  pointerEvents: 'none',
                  zIndex: 2,
                }}
              />
            </>
          )}
        </Box>
      </Box>

      <Collapse in={isCrossReferencesOpen} timeout={300} unmountOnExit>
        <Box sx={{ mt: { xs: 0.5, md: 1 } }}>
          {isCrossReferencesOpen && (
            <CrossReferencesDrawer currentVerse={currentVerse} version={version} />
          )}
        </Box>
      </Collapse>

      <Collapse in={isInterlinearOpen} timeout="auto" unmountOnExit>
        <Box>
          {isInterlinearOpen && <InterlinearDrawer currentVerse={currentVerse} />}
        </Box>
      </Collapse>

      {shouldRenderBookmarkPromo && (
        <BookmarkPromoModal
          open={bookmarkPromoOpen}
          onClose={() => setBookmarkPromoOpen(false)}
          onUpgrade={() => setBookmarkPromoOpen(false)}
        />
      )}

      {showCopied && (
        <Box
          sx={{
            position: 'fixed',
            bottom: 24,
            left: '50%',
            transform: 'translateX(-50%)',
            background: 'linear-gradient(135deg, #4CAF50, #45A049)',
            color: 'white',
            px: 3,
            py: 1.5,
            borderRadius: 3,
            boxShadow: '0px 4px 16px rgba(76, 175, 80, 0.3)',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 500,
            zIndex: 1000,
          }}
        >
          ✓ Copied to clipboard!
        </Box>
      )}
    </Box>
  );
}
