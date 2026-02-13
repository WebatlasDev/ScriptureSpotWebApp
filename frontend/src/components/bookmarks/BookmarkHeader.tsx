'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { WbSunny as SunIcon, NightlightRound as MoonIcon } from '@/components/ui/phosphor-icons';
import { useUser } from '@clerk/nextjs';
import useResponsive from '@/hooks/useResponsive';

interface TimeBasedGreeting {
  greeting: string;
  icon: React.ReactNode;
}

export default function BookmarkHeader() {
  const [timeBasedGreeting, setTimeBasedGreeting] = useState<TimeBasedGreeting>({
    greeting: 'Good Morning',
    icon: <SunIcon sx={{ width: 23, height: 24, color: '#FFD700' }} />
  });

  const { user } = useUser();
  const { isMdUp } = useResponsive();

  useEffect(() => {
    const getTimeBasedGreeting = (): TimeBasedGreeting => {
      const hour = new Date().getHours();
      
      if (hour >= 5 && hour < 12) {
        return {
          greeting: 'Good Morning',
          icon: <SunIcon sx={{ width: 20, height: 20, color: '#FFD700' }} />
        };
      } else if (hour >= 12 && hour < 17) {
        return {
          greeting: 'Good Afternoon',
          icon: <SunIcon sx={{ width: 20, height: 20, color: '#FFD700' }} />
        };
      } else {
        return {
          greeting: 'Good Evening',
          icon: <MoonIcon sx={{ width: 20, height: 20, color: '#FFD700' }} />
        };
      }
    };

    setTimeBasedGreeting(getTimeBasedGreeting());
  }, []);

  return (
    <Box
      sx={{
        width: '100%',
        background: '#1a1a1a',
        borderRadius: 3.5,
        padding: { xs: 3, md: 4 },
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.25,
        }}
      >
        {timeBasedGreeting.icon}
        <Typography
          sx={{
            color: '#FFFAFA',
            fontSize: 14,
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: 1.4,
          }}
        >
          {timeBasedGreeting.greeting}, {user?.fullName || 'User'}
        </Typography>
      </Box>
      
      <Box>
        <Typography
          sx={{
            color: '#FFFAFA',
            fontSize: 26,
            fontFamily: 'Inter',
            fontWeight: 400,
            lineHeight: 1.4,
            '& .bold': {
              fontWeight: 700,
            },
          }}
        >
          Your <span className="bold">Bookmarks</span>
          {isMdUp && (
            <> & <span className="bold">Highlights</span></>
          )}
        </Typography>
      </Box>
    </Box>
  );
}