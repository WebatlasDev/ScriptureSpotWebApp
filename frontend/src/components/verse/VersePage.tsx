'use client';

import { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { motion } from 'framer-motion';
import { ContentTab } from '@/components/tabs/TabNavigation';
import OverviewGrid from '@/components/overview/OverviewGrid';
import CommentaryGrid from '@/components/commentary/CommentaryGrid';
import { fadeSlideUpVariants } from '@/hooks/useScrollAnimation';
import { useParams } from 'next/navigation';
import { slugToBookName } from '@/utils/stringHelpers';
import { useBibleVerseVersion } from '@/hooks/useBibleVerseVersion';
import { useBibleBookOverview } from '@/hooks/useBibleBookOverview';
import { useBibleVerseTakeaways } from '@/hooks/useBibleVerseTakeaways';
import CrossLoader from '@/components/ui/CrossLoader';
import SkinnyHorizontalAd from '@/components/ads/SkinnyHorizontalAd';
import { safeSetItem } from '@/utils/localStorageUtils';
import { useAuthorsCommentaries } from '@/hooks/useAuthorsCommentaries';
import VerseHeader from '@/components/verse/VerseHeader';

const tabs: ContentTab[] = ['All', 'Commentaries', 'Hymns', 'Theological', 'Sermons'];

export default function VersePage() {
  const params = useParams();
  const version = params.version as string;
  const bookSlug = params.book as string;
  const chapterNumber = parseInt(params.chapter as string);
  const verseNumber = parseInt(params.verse as string);
  const bookName = slugToBookName(bookSlug);
  const formattedReference = `${bookName} ${chapterNumber}:${verseNumber}`;

  const [activeTab, setActiveTab] = useState<ContentTab>('All');
  const [isVerseTransitioning, setIsVerseTransitioning] = useState(false);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const tabParam = searchParams.get('tab') as ContentTab;
    if (tabParam && tabs.includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, []);

  // Remember last visited verse and version for quick resume on home page
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const last = {
          path: window.location.pathname,
          reference: formattedReference,
        };
        safeSetItem('lastVerse', JSON.stringify(last));
        safeSetItem('lastVersion', version.toLowerCase());
      } catch {
        // Ignore storage errors
      }
    }
  }, [formattedReference, version]);

  const {
    data: verseData,
    isLoading: verseLoading,
    error: verseError,
  } = useBibleVerseVersion(bookSlug, chapterNumber, verseNumber, version);

  // const {
  //   data: crossReferences,
  //   isLoading: refsLoading,
  //   error: refsError,
  // } = useBibleVerseCrossReferences(bookSlug, chapterNumber, verseNumber, version);

  const {
    data: bookOverview,
    isLoading: overviewLoading,
    error: overviewError,
  } = useBibleBookOverview(bookSlug);

  const {
    data: verseTakeaways,
    isLoading: takeawaysLoading,
    error: takeawaysError,
  } = useBibleVerseTakeaways(bookSlug, chapterNumber, verseNumber);

  const {
    data: commentaryCount = 0,
    isLoading: commentariesLoading,
    error: commentariesError,
  } = useAuthorsCommentaries(bookSlug, chapterNumber, verseNumber, 'Combined', 150, {
    select: (data) => data.length,
  });

  const isVerseHeaderLoading = verseLoading && !verseData;

  useEffect(() => {
    if (verseLoading || overviewLoading || takeawaysLoading) {
      setIsVerseTransitioning(true);
    } else {
      setIsVerseTransitioning(false);
    }
  }, [bookSlug, chapterNumber, verseNumber, verseLoading, overviewLoading, takeawaysLoading]);

  if (isVerseHeaderLoading) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
        <motion.div
          initial="visible"
          animate="visible"
          variants={fadeSlideUpVariants}
        >
          <VerseHeader
            verseData={{
              reference: formattedReference,
              content: '',
            }}
            version={version}
            bookName={bookName}
            bookSlug={bookSlug}
            chapterNumber={chapterNumber}
            verseNumber={verseNumber}
            isLoading
            isVerseTransitioning={isVerseTransitioning}
            onNavigateStart={() => setIsVerseTransitioning(true)}
          />
        </motion.div>
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
          <CrossLoader size={60} />
        </Box>
      </Box>
    );
  }

  const error = verseError || 
  // refsError || 
  overviewError || 
  takeawaysError;

  const shouldShowFallbackLoader =
    !bookOverview && !verseTakeaways && (overviewLoading || takeawaysLoading);

  const overviewCardsLoading = isVerseTransitioning || verseLoading || takeawaysLoading;
  if (shouldShowFallbackLoader) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
        <CrossLoader size={60} />
      </Box>
    );
  }

  if (error || !verseData) {
    return (
      <Box sx={{ padding: 4, color: 'error.main' }}>
        Error loading verse information
      </Box>
    );
  }

  const handleTabChange = (tab: ContentTab) => {
    setActiveTab(tab);
    const url = new URL(window.location.href);
    url.searchParams.set('tab', tab.toLowerCase());
    window.history.replaceState({}, '', url);
  };

  const commentaryCountLabel = commentariesLoading
    ? '...'
    : commentariesError
    ? '--'
    : String(commentaryCount);

  const CommentariesSectionHeader = ({ sx }: { sx?: any }) => (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        width: '100%',
        ...sx,
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
        Commentaries
      </Typography>
      <Box
        sx={{
          px: 1,
          py: 0.1,
          backgroundColor: 'rgba(255, 255, 255, 0.15)',
          borderRadius: 1.25,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',

        }}
      >
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '.75rem',
            fontWeight: 600,
          }}
        >
          {commentaryCountLabel}
        </Typography>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          height: 2,
          borderRadius: 999,
          background: 'linear-gradient(90deg, rgba(255,255,255,0.35), rgba(237,240,245,0))',
          opacity: 0.6,
        }}
      />
    </Box>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'All':
        return (
          <>
            <OverviewGrid 
              verseReference={formattedReference} 
              book={bookName} 
              bookOverview={bookOverview} 
              verseTakeaways={verseTakeaways} 
              verseText={verseData.content}
              verseVersion={version}
              isLoading={overviewCardsLoading}
            />
            
            {/* First horizontal ad - between OverviewGrid and CommentaryGrid */}
            <SkinnyHorizontalAd 
              slotId="VERSE_PAGE_HORIZONTAL_TOP" 
              showPlaceholder={false}
            />
            
            <CommentariesSectionHeader sx={{ mt: { xs: 2, md: 1.5 }, mb: { xs: 0.5, md: 1 } }} />
            <CommentaryGrid verseReference={formattedReference} verseContent={verseData?.content || ''} verseVersion={version} />
          </>
        );
      case 'Commentaries':
        return (
          <>
            <CommentariesSectionHeader sx={{ mt: 0, mb: { xs: 0.5, md: 1 } }} />
            <CommentaryGrid verseReference={formattedReference} verseContent={verseData?.content || ''} verseVersion={version} />
          </>
        );
      default:
        return <Box>Content for {activeTab}</Box>;
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 3, md: 4 } }}>
      <motion.div
        initial="visible"
        animate="visible"
        variants={fadeSlideUpVariants}
      >
          <VerseHeader
            verseData={{
              reference: formattedReference,
              content: verseData?.content || '',
              id: verseData?.id,
            }}
            version={version}
            bookName={bookName}
            bookSlug={bookSlug}
            chapterNumber={chapterNumber}
            verseNumber={verseNumber}
            isVerseTransitioning={isVerseTransitioning}
            onNavigateStart={() => setIsVerseTransitioning(true)}
        />
      </motion.div>
      
      {renderContent()}
      
      {/* Second horizontal ad - below CommentaryGrid */}
      <SkinnyHorizontalAd 
        slotId="VERSE_PAGE_HORIZONTAL_BOTTOM" 
        showPlaceholder={false}
      />
    </Box>
  );
}
