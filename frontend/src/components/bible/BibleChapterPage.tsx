'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { Box, Typography, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import BibleHeader from './BibleHeader';
import ChapterContent from './ChapterContent';
import ChapterNavigation from './ChapterNavigation';
import { useBibleVerses } from '@/hooks/useBibleVerses';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import { slugToBookName } from '@/utils/stringHelpers';
import { skeletonBaseSx } from '@/styles/skeletonStyles';

interface BibleChapterPageProps {
  initialVerses?: any[];
  initialChapters?: any[];
  initialVerseRange?: any;
}

export default function BibleChapterPage({ initialVerses, initialChapters, initialVerseRange }: BibleChapterPageProps) {
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const version = params.version as string;
  const bookSlug = params.book as string;
  const chapterNumber = parseInt(params.chapter as string);
  const bookName = slugToBookName(bookSlug);
  
  // Fetch verses for this chapter
  const {
    data: verses,
    isLoading: versesLoading,
    isFetching: versesFetching,
    error: versesError,
  } = useBibleVerses(bookSlug, chapterNumber, { initialData: initialVerses });
  
  // Fetch all chapters for navigation
  const {
    data: chapters,
    isLoading: chaptersLoading,
  } = useBibleChapters(bookSlug, { initialData: initialChapters, enabled: false });
  
  // Create version info (we'll enhance this when we have real version data)
  const versionInfo = {
    name: version.toUpperCase(),
    fullName: version === 'asv' ? 'American Standard Version' : version.toUpperCase(),
    shortName: version.toUpperCase(),
    year: version === 'asv' ? 1901 : undefined,
    tradition: version === 'asv' ? 'Protestant' : undefined,
  };
  
  const formattedReference = `${bookName} ${chapterNumber}`;
  
  const breadcrumbItems = [
    { label: 'Translations', href: '/translations' },
    { label: versionInfo.name, href: `/${version}` },
    { label: bookName, href: `/${version}/${bookSlug}` },
    { label: isMobile ? `${chapterNumber}` : `Chapter ${chapterNumber}` }
  ];

  if ((versesLoading && !initialVerses) || (!verses && !versesError)) {
    return (
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <BibleHeader
          version={versionInfo}
          title={formattedReference}
          subtitle="Loading chapter..."
          breadcrumbItems={breadcrumbItems}
          showChapterNavigation={true}
        />
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: 4 }}>
          <Box sx={{ ...skeletonBaseSx, height: 24, width: '45%', borderRadius: 2 }} />
          <Box sx={{ ...skeletonBaseSx, height: 220, borderRadius: 3.5 }} />
        </Box>
      </Box>
    );
  }

  if (versesError || !verses) {
    return (
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <BibleHeader
          version={versionInfo}
          title={formattedReference}
          subtitle="Error loading chapter"
          breadcrumbItems={breadcrumbItems}
          showChapterNavigation={true}
        />
        <Box sx={{ padding: 4, color: 'error.main', textAlign: 'center' }}>
          <Typography>Error loading {formattedReference}</Typography>
        </Box>
      </Box>
    );
  }

  const showContentSkeleton = versesFetching && verses?.length;

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <BibleHeader
        version={versionInfo}
        title={formattedReference}
        subtitle=""
        breadcrumbItems={breadcrumbItems}
        showChapterNavigation={true}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Chapter Content */}
        {showContentSkeleton ? (
          <Box sx={{ ...skeletonBaseSx, height: 320, borderRadius: 3.5 }} />
        ) : (
          <ChapterContent 
            verses={verses}
            reference={formattedReference}
            version={version}
            bookSlug={bookSlug}
            chapterNumber={chapterNumber}
            initialVerseRange={initialVerseRange}
          />
        )}
        
        {/* Chapter Navigation */}
        {chapters && !chaptersLoading && (
          <ChapterNavigation
            chapters={chapters}
            currentChapter={chapterNumber}
            version={version}
            bookSlug={bookSlug}
            bookName={bookName}
          />
        )}
      </Box>
    </Box>
  );
}
