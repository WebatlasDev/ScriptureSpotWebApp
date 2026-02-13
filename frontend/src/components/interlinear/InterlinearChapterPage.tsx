'use client';

import React from 'react';
import { Box, Typography, Container, useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useParams } from 'next/navigation';
import { useExplorationInterlinearChapter } from '@/hooks/useExplorationInterlinearChapter';
import InterlinearChapterContent from '@/components/interlinear/InterlinearChapterContent';
import BibleHeader from '@/components/bible/BibleHeader';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import CrossLoader from '@/components/ui/CrossLoader';
import { slugToBookName } from '@/utils/stringHelpers';

export default function InterlinearChapterPage() {
  const params = useParams();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const version = params.version as string;
  const bookSlug = params.book as string;
  const chapter = parseInt(params.chapter as string);
  const bookName = slugToBookName(bookSlug);
  
  const { data: chapterData, isLoading, error } = useExplorationInterlinearChapter(bookSlug, chapter);
  
  // Determine language from chapter data
  const interlinearLanguage: 'HEBREW' | 'GREEK' = chapterData && chapterData.length > 0 && chapterData[0].words.length > 0 && chapterData[0].words[0].hebrewWord ? 'HEBREW' : 'GREEK';

  // Create version info (matching Bible chapter page structure)
  const versionInfo = {
    name: version.toUpperCase(),
    fullName: version === 'asv' ? 'American Standard Version' : version.toUpperCase(),
    shortName: version.toUpperCase(),
    year: version === 'asv' ? 1901 : undefined,
    tradition: version === 'asv' ? 'Protestant' : undefined,
  };
  
  const formattedReference = `${bookName} ${chapter}`;
  
  const breadcrumbItems = isMobile ? [
    { label: bookName, href: `/${version}/${bookSlug}` },
    { label: `${chapter}`, href: `/${version}/${bookSlug}/${chapter}` },
    { label: 'Interlinear' }
  ] : [
    { label: 'Translations', href: '/translations' },
    { label: versionInfo.name, href: `/${version}` },
    { label: bookName, href: `/${version}/${bookSlug}` },
    { label: `Chapter ${chapter}`, href: `/${version}/${bookSlug}/${chapter}` },
    { label: 'Interlinear' }
  ];

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <BibleHeader
          version={versionInfo}
          title={formattedReference}
          subtitle="Loading interlinear text..."
          breadcrumbItems={breadcrumbItems}
          showChapterNavigation={true}
          showVersionSelector={false}
          interlinearMode={true}
          interlinearLanguage="HEBREW"
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            textAlign: 'center',
          }}
        >
          <CrossLoader size={60} />
          <Typography color="white" sx={{ mt: 3, opacity: 0.9, fontSize: '1.1rem' }}>
            Loading {formattedReference} interlinear...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <BibleHeader
          version={versionInfo}
          title={formattedReference}
          subtitle="Error loading interlinear text"
          breadcrumbItems={breadcrumbItems}
          showChapterNavigation={true}
          showVersionSelector={false}
          interlinearMode={true}
          interlinearLanguage="HEBREW"
        />
        <Box sx={{ padding: 4, color: 'error.main', textAlign: 'center' }}>
          <Typography>Failed to load interlinear data for {formattedReference}</Typography>
        </Box>
      </Box>
    );
  }

  if (!chapterData || chapterData.length === 0) {
    return (
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <BibleHeader
          version={versionInfo}
          title={formattedReference}
          subtitle="No interlinear data available"
          breadcrumbItems={breadcrumbItems}
          showChapterNavigation={true}
          showVersionSelector={false}
          interlinearMode={true}
          interlinearLanguage="HEBREW"
        />
        <Box sx={{ padding: 4, color: 'text.secondary', textAlign: 'center' }}>
          <Typography>No interlinear data available for this chapter.</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <BibleHeader
        version={versionInfo}
        title={formattedReference}
        subtitle=""
        breadcrumbItems={breadcrumbItems}
        showChapterNavigation={true}
        showVersionSelector={false}
        interlinearMode={true}
        interlinearLanguage={interlinearLanguage}
      />
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {/* Interlinear Chapter Content */}
        <InterlinearChapterContent
          verses={chapterData}
          currentChapter={{
            book: bookName,
            chapter: chapter,
            version: version
          }}
        />
      </Box>
    </Box>
  );
}