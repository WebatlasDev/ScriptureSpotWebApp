'use client';

import React from 'react';
import { Box, Typography } from '@mui/material';
import { BugReport as BugIcon } from '@/components/ui/phosphor-icons';

export default function QuickSupportAccess() {

  const handleEmailClick = () => {
    const subject = 'Scripture Spot - Issue Report';
    const body = 'Hi Scripture Spot team,\n\nI found an issue on your website:\n\n[Please describe the issue here]\n\nThanks!';
    
    window.location.href = `mailto:hello@scripturespot.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };


  return (
    <>
      <Box
        onClick={handleEmailClick}
        sx={{
          backgroundColor: '#1A1A1A',
          borderRadius: 3.5,
          p: 2.5,
          cursor: 'pointer',
          border: '2px solid rgba(255, 255, 255, 0.10)',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.20)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 1.5,
          }}
        >
          <BugIcon
            sx={{
              width: 14,
              height: 14,
              color: '#FFD700',
            }}
          />
          <Typography
            sx={{
              color: '#FFFAFA',
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Report Issue
          </Typography>
        </Box>

        {/* Content */}
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: 13,
            fontWeight: 400,
            lineHeight: 1.4,
            mb: 1,
          }}
        >
          See a formatting issue or error?
        </Typography>

        <Typography
          sx={{
            color: '#FFD700',
            fontSize: 13,
            fontWeight: 500,
            lineHeight: 1.4,
          }}
        >
          Let us know →
        </Typography>
      </Box>

    </>
  );
}