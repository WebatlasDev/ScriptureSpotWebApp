'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Box, Typography } from '@mui/material';
import Link from 'next/link';
import { HistoryOutlined as HistoryIcon } from '@/components/ui/phosphor-icons';

interface RecentVerse {
  path: string;
  reference: string;
  timestamp?: number;
}

const RECENT_VERSES_KEY = 'recentVerses';
const LAST_VERSE_KEY = 'lastVerse';

const parseStoredRecentVerses = (rawValue: string | null): RecentVerse[] => {
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(
        (item): item is RecentVerse =>
          Boolean(item?.path && item?.reference),
      )
      .map((item) => ({
        path: item.path,
        reference: item.reference,
        timestamp:
          typeof item.timestamp === 'number'
            ? item.timestamp
            : undefined,
      }));
  } catch {
    return [];
  }
};

const listsAreEqual = (a: RecentVerse[], b: RecentVerse[]) =>
  a.length === b.length &&
  a.every((item, index) => {
    const other = b[index];
    return (
      item.path === other.path &&
      item.reference === other.reference &&
      item.timestamp === other.timestamp
    );
  });

export default function RecentVerses() {
  const [recentVerses, setRecentVerses] = useState<RecentVerse[]>([]);

  const loadRecentVerses = useCallback(() => {
    if (typeof window === 'undefined') {
      return;
    }

    try {
      const storedVerses = parseStoredRecentVerses(
        localStorage.getItem(RECENT_VERSES_KEY),
      );
      let nextVerses = [...storedVerses];
      let shouldPersist = false;

      const lastVerseRaw = localStorage.getItem(LAST_VERSE_KEY);

      if (lastVerseRaw) {
        try {
          const lastVerse = JSON.parse(lastVerseRaw) as {
            path?: string;
            reference?: string;
          };

          if (lastVerse?.path && lastVerse?.reference) {
            const existingIndex = nextVerses.findIndex(
              (item) => item.path === lastVerse.path,
            );
            const existingEntry =
              existingIndex >= 0 ? nextVerses[existingIndex] : undefined;
            const alreadyLeading =
              existingIndex === 0 &&
              existingEntry?.reference === lastVerse.reference;

            if (!alreadyLeading) {
              const timestamp =
                existingEntry?.timestamp ?? Date.now();

              if (existingIndex >= 0) {
                nextVerses.splice(existingIndex, 1);
              }

              nextVerses.unshift({
                path: lastVerse.path,
                reference: lastVerse.reference,
                timestamp,
              });
              shouldPersist = true;
            }
          }
        } catch {
          // Ignore malformed last verse entries
        }
      }

      if (nextVerses.length > 20) {
        nextVerses = nextVerses.slice(0, 20);
        shouldPersist = true;
      }

      if (shouldPersist) {
        try {
          localStorage.setItem(
            RECENT_VERSES_KEY,
            JSON.stringify(nextVerses),
          );
        } catch {
          // Ignore write errors
        }
      }

      setRecentVerses((prev) =>
        listsAreEqual(prev, nextVerses) ? prev : nextVerses,
      );
    } catch {
      // Ignore read errors (e.g., storage disabled)
    }
  }, []);

  useEffect(() => {
    loadRecentVerses();

    const handleStorage = (event: StorageEvent) => {
      if (
        !event.key ||
        event.key === LAST_VERSE_KEY ||
        event.key === RECENT_VERSES_KEY
      ) {
        loadRecentVerses();
      }
    };

    const handleLocalStorageEvent = (event: Event) => {
      const { key } = (event as CustomEvent<{ key?: string }>).detail ?? {};
      if (
        !key ||
        key === LAST_VERSE_KEY ||
        key === RECENT_VERSES_KEY
      ) {
        loadRecentVerses();
      }
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener('local-storage', handleLocalStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(
        'local-storage',
        handleLocalStorageEvent,
      );
    };
  }, [loadRecentVerses]);

  const formatTimeAgo = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);
    
    if (days > 0) return `${days}d ago`;
    if (hours > 0) return `${hours}h ago`;
    if (minutes > 0) return `${minutes}m ago`;
    return 'Just now';
  };

  if (recentVerses.length === 0) {
    return null;
  }

  return (
    <Box
      sx={{
        backgroundColor: '#1A1A1A',
        borderRadius: 3.5,
        p: 2.5,
        border: '2px solid rgba(255, 255, 255, 0.10)',
      }}
    >
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          mb: 2,
        }}
      >
        <HistoryIcon
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
          Recent Verses
        </Typography>
        {recentVerses.length > 5 && (
          <Typography
            sx={{
              color: 'rgba(255, 255, 255, 0.4)',
              fontSize: 10,
              fontWeight: 400,
              lineHeight: 1.2,
            }}
          >
            ({recentVerses.length} total)
          </Typography>
        )}
      </Box>

      {/* Recent Verses List */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          gap: 1.5,
          maxHeight: recentVerses.length > 5 ? '240px' : 'auto',
          overflowY: recentVerses.length > 5 ? 'auto' : 'visible',
          // Custom scrollbar styling
          '&::-webkit-scrollbar': {
            width: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'rgba(255, 255, 255, 0.05)',
            borderRadius: 2,
          },
          '&::-webkit-scrollbar-thumb': {
            background: 'rgba(255, 255, 255, 0.2)',
            borderRadius: 2,
            '&:hover': {
              background: 'rgba(255, 255, 255, 0.3)',
            },
          },
        }}
      >
        {recentVerses.map((verse, index) => (
          <Box
            key={verse.path}
            component={Link}
            href={verse.path}
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 0.5,
              p: 1.5,
              borderRadius: 1.5,
              cursor: 'pointer',
              textDecoration: 'none',
              transition: 'all 0.2s ease-in-out',
              border: '2px solid rgba(255, 255, 255, 0.05)',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                border: '2px solid rgba(255, 255, 255, 0.15)',
              },
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: 1,
              }}
            >
              <Typography
                sx={{
                  color: '#FFFAFA',
                  fontSize: 14,
                  fontWeight: 500,
                  lineHeight: 1.4,
                }}
              >
                {verse.reference}
              </Typography>
              {verse.timestamp && (
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.4)',
                    fontSize: 12,
                    fontWeight: 400,
                    lineHeight: 1.4,
                  }}
                >
                  {formatTimeAgo(verse.timestamp)}
                </Typography>
              )}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
