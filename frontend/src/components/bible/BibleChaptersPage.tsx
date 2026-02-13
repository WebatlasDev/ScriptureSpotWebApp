'use client';

import React, { useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Grid } from '@mui/material';
import BibleHeader from './BibleHeader';
import BibleChapterCard from './BibleChapterCard';
import { useBibleChapters } from '@/hooks/useBibleChapters';
import { slugToBookName } from '@/utils/stringHelpers';
import CrossLoader from '@/components/ui/CrossLoader';

interface BibleChaptersPageProps {
  initialChapters?: any[];
}

export default function BibleChaptersPage({ initialChapters }: BibleChaptersPageProps) {
  const params = useParams();
  const router = useRouter();
  const version = params.version as string;
  const bookSlug = params.book as string;
  const bookName = slugToBookName(bookSlug);
  
  // Fetch chapters for this book
  const { data: chapters, isLoading, error } = useBibleChapters(bookSlug, { initialData: initialChapters });
  const [pendingChapter, setPendingChapter] = useState<number | null>(null);
  const [, startTransition] = useTransition();
  
  // Create version info (we'll enhance this when we have real version data)
  const versionInfo = {
    name: version.toUpperCase(),
    fullName: version === 'asv' ? 'American Standard Version' : version.toUpperCase(),
    shortName: version.toUpperCase(),
    year: version === 'asv' ? 1901 : undefined,
    tradition: version === 'asv' ? 'Protestant' : undefined,
  };
  
  const breadcrumbItems = [
    { label: 'Translations', href: '/translations' },
    { label: versionInfo.name, href: `/${version}` },
    { label: bookName }
  ];

  const handleSelectChapter = (chapterNumber: number) => {
    if (pendingChapter) {
      return;
    }

    setPendingChapter(chapterNumber);
    startTransition(() => {
      try {
        router.push(`/${version}/${bookSlug}/${chapterNumber}`);
      } catch {
        setPendingChapter(null);
      }
    });
  };

  if (isLoading) {
    return (
      <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
        <BibleHeader
          version={versionInfo}
          title={`${bookName} Chapters`}
          subtitle="Loading chapters..."
          breadcrumbItems={breadcrumbItems}
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
            Loading chapters for {bookName}...
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
          title={`${bookName} Chapters`}
          subtitle="Error loading chapters"
          breadcrumbItems={breadcrumbItems}
        />
        <Box sx={{ padding: 4, color: 'error.main', textAlign: 'center' }}>
          <Typography>Error loading chapters for {bookName}</Typography>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <BibleHeader
        version={versionInfo}
        title={`${bookName} Chapters`}
        subtitle={`Select a chapter to read from ${bookName}`}
        breadcrumbItems={breadcrumbItems}
      />
      
      {/* Chapter grid */}
      <Box sx={{ width: '100%' }}>
        <Typography 
          variant="h5" 
          component="h2" 
          color="white" 
          sx={{ mb: 2, fontWeight: 500 }}
        >
          {chapters?.length || 0} Chapters
        </Typography>
        
        {chapters && chapters.length > 0 ? (
          <Grid container spacing={2}>
            {chapters.map((chapter) => (
              <Grid item xs={4} sm={3} md={2} lg={1} key={chapter.chapterNumber}>
                
                <BibleChapterCard 
                  chapter={chapter}
                  version={version}
                  bookSlug={bookSlug}
                  onSelect={handleSelectChapter}
                  pending={pendingChapter === chapter.chapterNumber}
                  disabled={Boolean(pendingChapter && pendingChapter !== chapter.chapterNumber)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Box sx={{ 
            textAlign: 'center', 
            py: 4, 
            color: 'rgba(255, 255, 255, 0.7)',
            background: 'rgba(128, 128, 128, 0.05)',
            borderRadius: 2,
            border: '1px solid rgba(128, 128, 128, 0.2)'
          }}>
            <Typography variant="body1">
              No chapters found for {bookName}.
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
}
