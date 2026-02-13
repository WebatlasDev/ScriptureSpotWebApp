'use client';

import React from 'react';
import { Box, Chip, useMediaQuery, useTheme } from '@mui/material';
import { motion } from 'framer-motion';

export type SearchTabType = 'All' | 'Bible Verses' | 'Commentaries' | 'Authors' | 'Takeaways';

interface SearchTabsProps {
  activeTab: SearchTabType;
  onTabChange: (tab: SearchTabType) => void;
  results: Array<{ type: string; entries: any[] }>;
}

const TAB_MAPPING: Record<string, SearchTabType> = {
  'BibleVerse': 'Bible Verses',
  'BibleVerseVersion': 'Bible Verses',
  'Commentary': 'Commentaries',
  'Author': 'Authors',
  'Takeaway': 'Takeaways',
  'BibleVerseTakeaway': 'Takeaways'
};

export default function SearchTabs({ activeTab, onTabChange, results }: SearchTabsProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calculate counts for each tab (excluding CommentaryExcerpt and BibleVerseVersion)
  const getTabCount = (tabType: SearchTabType): number => {
    const filteredResults = results.filter(group => group.type !== 'CommentaryExcerpt' && group.type !== 'BibleVerseVersion');
    
    if (tabType === 'All') {
      return filteredResults.reduce((total, group) => total + (group.entries?.length || 0), 0);
    }

    return filteredResults
      .filter(group => TAB_MAPPING[group.type] === tabType)
      .reduce((total, group) => total + (group.entries?.length || 0), 0);
  };

  // Get available tabs based on results (excluding CommentaryExcerpt and BibleVerseVersion)
  const availableTabs: SearchTabType[] = ['All'];
  const tabTypes = new Set(results.filter(group => group.type !== 'CommentaryExcerpt' && group.type !== 'BibleVerseVersion').map(group => TAB_MAPPING[group.type]).filter(Boolean));
  tabTypes.forEach(tabType => {
    if (tabType && !availableTabs.includes(tabType)) {
      availableTabs.push(tabType);
    }
  });

  const handleTabClick = (tab: SearchTabType) => {
    onTabChange(tab);
    // Smooth scroll to top when changing tabs
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <Box sx={{ 
      mb: 4,
      position: 'sticky',
      top: 0,
      zIndex: 10,
      bgcolor: 'rgba(26, 26, 26, 0.8)',
      backdropFilter: 'blur(10px)',
      py: 2,
      mx: -2,
      px: 2
    }}>
      <Box sx={{ 
        display: 'flex',
        gap: { xs: 1, md: 2 },
        overflowX: 'auto',
        pb: 1,
        '&::-webkit-scrollbar': {
          display: 'none'
        },
        scrollbarWidth: 'none'
      }}>
        {availableTabs.map((tab) => {
          const count = getTabCount(tab);
          const isActive = activeTab === tab;
          
          if (count === 0 && tab !== 'All') return null;

          return (
            <motion.div
              key={tab}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Chip
                label={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <span>{tab}</span>
                    {count > 0 && (
                      <Box
                        sx={{
                          backgroundColor: isActive 
                            ? 'rgba(255, 255, 255, 0.2)' 
                            : 'rgba(255, 215, 0, 0.2)',
                          color: isActive 
                            ? 'rgba(255, 255, 255, 0.9)' 
                            : 'rgba(255, 215, 0, 0.9)',
                          borderRadius: '12px',
                          px: 1,
                          py: 0.25,
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          minWidth: '20px',
                          textAlign: 'center'
                        }}
                      >
                        {count}
                      </Box>
                    )}
                  </Box>
                }
                onClick={() => handleTabClick(tab)}
                sx={{
                  height: { xs: 40, md: 44 },
                  fontSize: { xs: '0.875rem', md: '1rem' },
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                  ...(isActive ? {
                    backgroundColor: 'rgba(255, 215, 0, 0.15)',
                    color: 'rgba(255, 215, 0, 0.95)',
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 215, 0, 0.2)',
                      borderColor: 'rgba(255, 215, 0, 0.4)',
                    }
                  } : {
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    color: 'rgba(255, 255, 255, 0.7)',
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      color: 'rgba(255, 255, 255, 0.9)',
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    }
                  })
                }}
              />
            </motion.div>
          );
        })}
      </Box>
    </Box>
  );
}

// Helper function to determine if a result group should be shown for a given tab
export function shouldShowGroup(group: { type: string; entries: any[] }, activeTab: SearchTabType): boolean {
  // Always exclude CommentaryExcerpt and BibleVerseVersion regardless of tab
  if (group.type === 'CommentaryExcerpt' || group.type === 'BibleVerseVersion') {
    return false;
  }
  
  if (activeTab === 'All') {
    return true;
  }
  
  const mappedType = TAB_MAPPING[group.type];
  return mappedType === activeTab;
}