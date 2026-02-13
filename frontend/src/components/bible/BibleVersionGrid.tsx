'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import BibleVersionCard from './BibleVersionCard';
import { useBibleVersions } from '@/hooks/useBibleVersions';
import LoadingSpinner from '../ui/LoadingSpinner';

export default function BibleVersionGrid() {
  const { data: versions, isLoading, error } = useBibleVersions();
  

  if (isLoading) {
    return (
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Box>
    );
  }
  
  if (error) {
    const message = error instanceof Error ? error.message : String(error);
    return (
      <Box sx={{ padding: 3, color: 'error.main' }}>
        Error loading Bible versions: {message}
      </Box>
    );
  }
  
  if (!versions || versions.length === 0) {
    return (
      <Box sx={{ padding: 3, color: 'text.secondary', textAlign: 'center' }}>
        <Typography>No Bible versions found.</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      <Grid container spacing={3}>
        {versions.map((version) => (
          <Grid item xs={12} md={6} key={version.shortName || version.name}>
            <BibleVersionCard 
              version={version}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}