'use client';

import { Box, Typography } from '@mui/material';
import { useState } from 'react';

export type ContentTab = 'All' | 'Commentaries' | 'Hymns' | 'Hymns' | 'Theological' | 'Sermons';

interface TabNavigationProps {
  onTabChange: (tab: ContentTab) => void;
  initialTab?: ContentTab;
}

const tabs: ContentTab[] = ['All', 'Commentaries', 'Hymns', 'Theological', 'Sermons'];

export default function TabNavigation({ onTabChange, initialTab = 'All' }: TabNavigationProps) {
  const [activeTab, setActiveTab] = useState<ContentTab>(initialTab);

  const handleTabChange = (tab: ContentTab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        justifyContent: 'flex-start',
        alignItems: 'flex-start',
        gap: 5,
        display: 'inline-flex',
      }}
    >
      <Box
        sx={{
          flex: '1 1 0',
          paddingTop: 3,
          paddingBottom: 3.75,
          paddingX: 5,
          background: '#1A1A1A',
          borderRadius: 4.5,
          justifyContent: 'flex-start',
          alignItems: 'center',
          gap: 4.25,
          display: 'flex',
          overflowX: 'auto',
          '::-webkit-scrollbar': {
            height: '4px',
          },
          '::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: '4px',
          },
        }}
      >
        {tabs.map((tab) => (
          <Box
            key={tab}
            onClick={() => handleTabChange(tab)}
            sx={{
              paddingBottom: .2,
              borderBottom: tab === activeTab ? '5px #278EFF solid' : 'none',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 1.25,
              display: 'flex',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              '&:hover': {
                opacity: 0.8,
              },
            }}
          >
            <Typography
              sx={{
                color: tab === activeTab ? '#FFFAFA' : 'rgba(255, 249.70, 249.70, 0.60)',
                fontSize: 16,
                fontFamily: 'Inter',
                fontWeight: 500,
                lineHeight: '29px',
                wordWrap: 'break-word',
              }}
            >
              {tab}
            </Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}