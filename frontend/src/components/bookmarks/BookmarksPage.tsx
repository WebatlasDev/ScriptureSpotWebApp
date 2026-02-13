'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { useUser } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import LoginPrompt from './LoginPrompt';
import SubscribePrompt from './SubscribePrompt';
import { BookmarkDisplay, BookmarkGroup, BookmarkFilters as BookmarkFiltersType, BookmarkType } from '@/types/bookmark';
import { AuthorFromAPI } from '@/types/author';
import { useBookmarks } from '@/hooks/useBookmarks';
import BookmarkHeader from './BookmarkHeader';
import BookmarkFilters from './BookmarkFilters';
import BookmarkAccordion from './BookmarkAccordion';
import CrossLoader from '@/components/ui/CrossLoader';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';

const UNKNOWN_MONTH_YEAR = 'unknown';

function parseBookmarkDate(value?: string | null) {
  if (!value) return null;

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function formatMonthYear(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function getBookmarkTimestamp(bookmark: BookmarkDisplay) {
  const parsedDate = parseBookmarkDate(bookmark.createdAt);
  return parsedDate ? parsedDate.getTime() : null;
}

function normalizeBookmarkType(type: BookmarkType) {
  return type === BookmarkType.VERSE_VERSION ? BookmarkType.VERSE : type;
}

export default function BookmarksPage() {
  const { user, isLoaded: userLoaded } = useUser();
  const isPremium = usePremium();
  const { data: bookmarksData, isLoading, error, refetch } = useBookmarks(isPremium);
  const { data: authorsData } = useAuthorsAuthors({ staleTime: 1000 * 60 * 10 });
  const [filters, setFilters] = useState<BookmarkFiltersType>({
    contentTypes: [],
    searchQuery: '',
    sortBy: 'newest'
  });

  // Always refresh bookmarks when the page mounts if the user is premium
  useEffect(() => {
    if (isPremium) {
      refetch();
    }
  }, [refetch, isPremium]);

  const authorsById = useMemo(() => {
    if (!Array.isArray(authorsData)) return new Map<string, AuthorFromAPI>();
    return authorsData.reduce((acc: Map<string, AuthorFromAPI>, author: AuthorFromAPI) => {
      if (author?.id) {
        acc.set(String(author.id), author);
      }
      return acc;
    }, new Map<string, AuthorFromAPI>());
  }, [authorsData]);

  const authorsBySlug = useMemo(() => {
    if (!Array.isArray(authorsData)) return new Map<string, AuthorFromAPI>();
    return authorsData.reduce((acc: Map<string, AuthorFromAPI>, author: AuthorFromAPI) => {
      if (author?.slug) {
        acc.set(author.slug.toLowerCase(), author);
      }
      return acc;
    }, new Map<string, AuthorFromAPI>());
  }, [authorsData]);

  const mergeAuthorDetails = useMemo(
    () =>
      (author?: AuthorFromAPI | null): AuthorFromAPI | undefined => {
        if (!author) return undefined;
        const byId = author.id ? authorsById.get(String(author.id)) : undefined;
        const slugKey = author.slug?.toLowerCase();
        const bySlug = slugKey ? authorsBySlug.get(slugKey) : undefined;
        const fallback = byId || bySlug;

        if (!fallback) {
          return author;
        }

        const mergedColorScheme = fallback.colorScheme || author.colorScheme
          ? {
              ...(fallback.colorScheme ?? {}),
              ...(author.colorScheme ?? {}),
            }
          : undefined;

        return {
          ...fallback,
          ...author,
          colorScheme: mergedColorScheme,
        };
      },
    [authorsById, authorsBySlug]
  );

  // Convert API data to display format
  const displayBookmarks: BookmarkDisplay[] = useMemo(() => {
    if (!bookmarksData?.bookmarks) return [];

    return bookmarksData.bookmarks.map(bookmark => {
      const createdAtDate = parseBookmarkDate(bookmark.createdAt);
      const formattedDate = createdAtDate
        ? createdAtDate.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        : 'Unknown date';

      const monthYear = createdAtDate ? formatMonthYear(createdAtDate) : UNKNOWN_MONTH_YEAR;

      const enrichedAuthor = mergeAuthorDetails(bookmark.author);
      const enrichedCommentaryAuthor = mergeAuthorDetails(bookmark.commentary?.author) || enrichedAuthor;

      return {
        ...bookmark,
        author: enrichedAuthor ?? bookmark.author,
        commentary: bookmark.commentary
          ? {
              ...bookmark.commentary,
              author: enrichedCommentaryAuthor ?? bookmark.commentary.author,
            }
          : bookmark.commentary,
        formattedReference: bookmark.reference,
        formattedDate,
        monthYear,
        excerpt: bookmark.description || '',
        displayTags: []
      };
    });
  }, [bookmarksData, mergeAuthorDetails]);

  // Filter bookmarks based on current filters
  const filteredBookmarks = useMemo(() => {
    let filtered = [...displayBookmarks];

    const activeContentTypes = new Set(filters.contentTypes.map(normalizeBookmarkType));

    // Filter by content type
    if (activeContentTypes.size > 0) {
      filtered = filtered.filter(bookmark => 
        activeContentTypes.has(normalizeBookmarkType(bookmark.contentType))
      );
    }

    // Filter by search query
    if (filters.searchQuery.trim()) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(bookmark => 
        bookmark.title.toLowerCase().includes(query) ||
        bookmark.author?.name.toLowerCase().includes(query) ||
        bookmark.reference?.toLowerCase().includes(query) ||
        bookmark.excerpt?.toLowerCase().includes(query) ||
        bookmark.description?.toLowerCase().includes(query)
      );
    }

    // Sort bookmarks
    switch (filters.sortBy) {
      case 'newest':
        filtered = filtered.slice().sort((a, b) => {
          const timeA = getBookmarkTimestamp(a) ?? Number.NEGATIVE_INFINITY;
          const timeB = getBookmarkTimestamp(b) ?? Number.NEGATIVE_INFINITY;
          return timeB - timeA;
        });
        break;
      case 'oldest':
        filtered = filtered.slice().sort((a, b) => {
          const timeA = getBookmarkTimestamp(a) ?? Number.POSITIVE_INFINITY;
          const timeB = getBookmarkTimestamp(b) ?? Number.POSITIVE_INFINITY;
          return timeA - timeB;
        });
        break;
      case 'alphabetical':
        filtered = filtered.slice().sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return filtered;
  }, [displayBookmarks, filters]);

  // Group bookmarks by month/year
  const bookmarkGroups = useMemo(() => {
    const groups: { [key: string]: BookmarkDisplay[] } = {};
    
    filteredBookmarks.forEach(bookmark => {
      const monthYear = bookmark.monthYear && bookmark.monthYear !== UNKNOWN_MONTH_YEAR
        ? bookmark.monthYear
        : UNKNOWN_MONTH_YEAR;
      if (!groups[monthYear]) {
        groups[monthYear] = [];
      }
      groups[monthYear].push(bookmark);
    });

    return Object.entries(groups).map(([monthYear, bookmarks]) => {
      let displayName = 'Other Bookmarks';

      if (monthYear !== UNKNOWN_MONTH_YEAR) {
        const [year, month] = monthYear.split('-');
        const parsedYear = Number(year);
        const parsedMonth = Number(month);

        if (!Number.isNaN(parsedYear) && !Number.isNaN(parsedMonth) && parsedMonth >= 1 && parsedMonth <= 12) {
          const date = new Date(parsedYear, parsedMonth - 1, 1);
          displayName = date.toLocaleDateString('en-US', {
            month: 'long',
            year: 'numeric'
          });
        }
      }

      return {
        monthYear,
        displayName,
        bookmarks,
        count: bookmarks.length
      } as BookmarkGroup;
    }).sort((a, b) => {
      if (a.monthYear === UNKNOWN_MONTH_YEAR && b.monthYear === UNKNOWN_MONTH_YEAR) return 0;
      if (a.monthYear === UNKNOWN_MONTH_YEAR) return 1;
      if (b.monthYear === UNKNOWN_MONTH_YEAR) return -1;
      return b.monthYear.localeCompare(a.monthYear);
    });
  }, [filteredBookmarks]);

  const handleBookmarkDeleted = (bookmarkId: string) => {
    // Refetch bookmarks to get updated data
    refetch();
  };

  // Show loading while user authentication is being determined
  if (!userLoaded) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2
      }}>
        <CrossLoader size={50} />
        <Typography color="text.secondary">
          Loading...
        </Typography>
      </Box>
    );
  }

  if (!user) {
    return <LoginPrompt />;
  }

  if (!isPremium) {
    return <SubscribePrompt />;
  }

  if (isLoading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2
      }}>
        <CrossLoader size={50} />
        <Typography color="text.secondary">
          Loading your bookmarks...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center',
        minHeight: '400px',
        gap: 2,
        color: 'error.main'
      }}>
        <Typography>
          Error loading bookmarks: {error instanceof Error ? error.message : 'Unknown error'}
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 3, md: 5 },
      }}
    >
      {/* Header */}
      <BookmarkHeader />

      {/* Filters */}
      <BookmarkFilters 
        filters={filters} 
        onFiltersChange={setFilters} 
      />

      {/* Bookmark Groups */}
      <BookmarkAccordion 
        bookmarkGroups={bookmarkGroups}
        onBookmarkDeleted={handleBookmarkDeleted}
      />
    </Box>
  );
}
