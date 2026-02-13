'use client';

import { Box } from '@mui/material';
import VerticalAd from '../ads/VerticalAd';
import CompactVerseOfTheDay from '../sidebar/CompactVerseOfTheDay';
import RecentVerses from '../sidebar/RecentVerses';
import AuthorSpotlight from '../sidebar/AuthorSpotlight';
import QuickSupportAccess from '../sidebar/QuickSupportAccess';

export default function Sidebar() {
  return (
    <Box
      sx={{
        display: { xs: 'none', lg: 'flex' },
        width: { lg: 300 },
        padding: 3,
        background: '#1A1A1A',
        borderRadius: 3.5,
        flexDirection: 'column',
        gap: 3,
        height: 'fit-content',
        flexShrink: 0,
      }}
    >
      {/* Top Section */}
      <RecentVerses />
      <CompactVerseOfTheDay />
      
      {/* Middle Section - Vertical Ad */}
      <VerticalAd 
        slotId="SIDEBAR_VERTICAL" 
        placement="sidebar"
        showPlaceholder={false}
      />
      
      {/* Bottom Section */}
      <AuthorSpotlight />
      <QuickSupportAccess />
    </Box>
  );
}
