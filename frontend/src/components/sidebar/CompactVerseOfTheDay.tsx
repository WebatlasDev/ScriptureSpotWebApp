'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import { WbSunny as SunIcon } from '@/components/ui/phosphor-icons';
import Link from 'next/link';
import { useVerseOfTheDay } from '@/hooks/useVerseOfTheDay';
import { env } from '@/types/env';
import { getLastVersion } from '@/utils/localStorageUtils';
import { parseBibleReference } from '@/utils/bibleReference';
import { buildUrl } from '@/utils/navigation';

export default function CompactVerseOfTheDay() {
  const [version, setVersion] = useState(() =>
    typeof window === 'undefined' ? env.defaultVersion : getLastVersion(),
  );
  const defaultVersion = env.defaultVersion;

  const { data: verseOfTheDay } = useVerseOfTheDay(version);

  const syncVersionPreference = useCallback(() => {
    const latestVersion = getLastVersion() || defaultVersion;
    setVersion((current) =>
      current === latestVersion ? current : latestVersion,
    );
  }, [defaultVersion]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === 'lastVersion') {
        syncVersionPreference();
      }
    };

    const handleLocalStorageEvent = (event: Event) => {
      const { key } = (event as CustomEvent<{ key?: string }>).detail ?? {};
      if (!key || key === 'lastVersion') {
        syncVersionPreference();
      }
    };

    syncVersionPreference();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage', handleLocalStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('local-storage', handleLocalStorageEvent);
    };
  }, [syncVersionPreference]);

  const verseHref = useMemo(() => {
    const parsed = parseBibleReference(verseOfTheDay?.reference);
    if (!parsed) {
      return null;
    }

    return buildUrl({
      version,
      book: parsed.bookSlug,
      chapter: parsed.chapter,
      verse: parsed.verse,
    });
  }, [verseOfTheDay?.reference, version]);

  return (
    <Box
      component={verseHref ? Link : 'div'}
      href={verseHref ?? undefined}
      sx={{
        backgroundColor: '#1A1A1A',
        borderRadius: 3.5,
        p: 2.5,
        cursor: verseHref ? 'pointer' : 'default',
        textDecoration: 'none',
        border: '2px solid rgba(255, 255, 255, 0.10)',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: verseHref ? 'rgba(255, 255, 255, 0.05)' : undefined,
          border: verseHref ? '2px solid rgba(255, 255, 255, 0.20)' : '2px solid rgba(255, 255, 255, 0.10)',
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
        <SunIcon
          sx={{
            width: 14,
            height: 14,
            color: '#FF8C00',
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
          Verse of the Day
        </Typography>
      </Box>

      {/* Verse Text */}
      <Typography
        sx={{
          color: '#FFFAFA',
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.4,
          textAlign: 'left',
          mb: 1.5,
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {verseOfTheDay?.text}
      </Typography>

      {/* Reference */}
      <Box>
        <Typography
          component="span"
          sx={{
            color: '#FFFAFA',
            fontSize: 14,
            fontWeight: 600,
            lineHeight: 1.4,
          }}
        >
          {verseOfTheDay?.reference}
        </Typography>
        <Typography
          component="span"
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.4,
            ml: 1,
          }}
        >
          {version?.toUpperCase() || env.defaultVersion.toUpperCase()}
        </Typography>
      </Box>
    </Box>
  );
}
