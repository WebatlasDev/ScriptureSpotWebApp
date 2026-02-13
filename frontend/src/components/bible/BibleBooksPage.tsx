'use client';

import React, { useState, useTransition } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Box, Typography, Grid } from '@mui/material';
import BibleHeader from './BibleHeader';
import BibleBookCard from './BibleBookCard';
import { NEW_TESTAMENT_BOOKS, OLD_TESTAMENT_BOOKS } from '@/data/bibleBooks';

export default function BibleBooksPage() {
  const params = useParams();
  const router = useRouter();
  const version = params.version as string;
  const [pendingBook, setPendingBook] = useState<string | null>(null);
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
    { label: versionInfo.name }
  ];

  const handleSelect = (slug: string) => {
    if (pendingBook) {
      return;
    }

    setPendingBook(slug);
    startTransition(() => {
      try {
        router.push(`/${version}/${slug}`);
      } catch {
        setPendingBook(null);
      }
    });
  };

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      <BibleHeader
        version={versionInfo}
        title="Bible Books"
        subtitle="Select a book to read"
        breadcrumbItems={breadcrumbItems}
      />
      
      {/* Bible book grid */}
      <Box sx={{ width: '100%' }}>
        
        {/* Old Testament */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Old Testament
          </Typography>
          <Grid container spacing={2}>
            {OLD_TESTAMENT_BOOKS.map((book) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.slug}>
                <BibleBookCard 
                  book={book} 
                  version={version}
                  onSelect={handleSelect}
                  pending={pendingBook === book.slug}
                  disabled={Boolean(pendingBook && pendingBook !== book.slug)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
        {/* New Testament */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ mb: 2, fontWeight: 500 }}
          >
            New Testament
          </Typography>
          <Grid container spacing={2}>
            {NEW_TESTAMENT_BOOKS.map((book) => (
              <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.slug}>
                <BibleBookCard 
                  book={book} 
                  version={version}
                  onSelect={handleSelect}
                  pending={pendingBook === book.slug}
                  disabled={Boolean(pendingBook && pendingBook !== book.slug)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
        
      </Box>
    </Box>
  );
}
