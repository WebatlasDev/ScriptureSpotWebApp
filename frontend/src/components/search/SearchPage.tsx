'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Box, Button, Chip, Container, Grid, Typography } from '@mui/material';
import { Search as SearchIcon } from '@/components/ui/phosphor-icons';
import { motion } from 'framer-motion';
import { useBalancedSearch } from '@/hooks/useBalancedSearch';
import { extractSearchTerms } from '@/utils/textHighlighting';
import CrossLoader from '@/components/ui/CrossLoader';
import { AuthorProvider } from '@/contexts/AuthorContext';
import SearchTabs, { SearchTabType, shouldShowGroup } from '@/components/search/SearchTabs';
import SearchResultCard from '@/components/search/SearchResultCard';

interface SearchEntry {
  id: string;
  slug: string;
  reference: string;
  text: string;
  authorName?: string | null;
}

const fadeSlideUpVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
  },
};

interface SearchGroupProps {
  group: { type: string; entries: SearchEntry[] };
}

function SearchGroup({ group, searchQuery, activeTab }: SearchGroupProps & { searchQuery: string; activeTab: SearchTabType }) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!group.entries.length || !shouldShowGroup(group, activeTab)) return null;

  const labelMap: Record<string, string> = {
    BibleVerse: 'Bible Verses',
    BibleVerseVersion: 'Bible Verses',
    Commentary: 'Commentaries',
    Author: 'Authors',
    Takeaway: 'Verse Takeaways',
    BibleVerseTakeaway: 'Verse Takeaways'
  };
  const title = labelMap[group.type] || group.type;
  const searchTerms = extractSearchTerms(searchQuery);

  // Deduplicate entries by both identifier AND content
  const deduplicatedEntries = group.entries.reduce((acc: SearchEntry[], entry: SearchEntry) => {
    // First check for exact identifier matches
    const identicalEntry = acc.find(existing =>
      existing.id === entry.id &&
      existing.slug === entry.slug &&
      existing.reference === entry.reference
    );

    // If no identical entry found, check for content duplicates
    if (!identicalEntry) {
      const contentDuplicate = acc.find(existing => {
        // Only check content for Commentary type entries
        if (group.type === 'Commentary' && entry.text && existing.text) {
          // Normalize text for comparison (remove extra whitespace, convert to lowercase)
          const normalizeText = (text: string) => text.replace(/\s+/g, ' ').trim().toLowerCase();
          return normalizeText(entry.text) === normalizeText(existing.text);
        }
        return false;
      });

      // Only add if no content duplicate exists
      if (!contentDuplicate) {
        acc.push(entry);
      }
    }

    return acc;
  }, []);

  const CARDS_TO_SHOW = 6;
  const hasMoreCards = deduplicatedEntries.length > CARDS_TO_SHOW;
  const displayedEntries = isExpanded ? deduplicatedEntries : deduplicatedEntries.slice(0, CARDS_TO_SHOW);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeSlideUpVariants}
      transition={{
        duration: 0.4,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
    >
      <Box sx={{ mb: 5 }}>
        <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="h5"
            sx={{
              fontSize: { xs: '1.25rem', md: '1.5rem' },
              fontWeight: 600,
              color: 'text.primary',
              letterSpacing: '-0.01em'
            }}
          >
            {title}
          </Typography>
          <Chip
            label={deduplicatedEntries.length}
            size="small"
            sx={{
              backgroundColor: 'rgba(255, 215, 0, 0.15)',
              color: 'rgba(255, 215, 0, 0.9)',
              fontWeight: 600,
              fontSize: '0.75rem'
            }}
          />
        </Box>

        <Box sx={{ position: 'relative' }}>
          <Grid container spacing={3}>
            {displayedEntries.map((entry, index) => (
              <Grid item xs={12} md={6} lg={4} key={entry.id}>
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={fadeSlideUpVariants}
                  transition={{
                    duration: 0.4,
                    ease: [0.25, 0.46, 0.45, 0.94],
                    delay: index * 0.02
                  }}
                >
                  <SearchResultCard entry={entry} searchTerms={searchTerms} groupType={group.type} />
                </motion.div>
              </Grid>
            ))}
          </Grid>

          {hasMoreCards && !isExpanded && (
            <Box sx={{ position: 'relative', mt: -2 }}>
              {/* Fade gradient overlay */}
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '120px',
                  background: 'linear-gradient(to bottom, transparent 0%, rgba(17, 17, 17, 1) 100%)',
                  pointerEvents: 'none',
                  zIndex: 1
                }}
              />

              {/* Load More button */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  pt: 4,
                  position: 'relative',
                  zIndex: 2
                }}
              >
                <Button
                  variant="outlined"
                  onClick={() => setIsExpanded(true)}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.04)',
                    borderColor: 'rgba(255, 255, 255, 0.2)',
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontWeight: 600,
                    px: 4,
                    py: 1.5,
                    borderRadius: '12px',
                    textTransform: 'none',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.08)',
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    }
                  }}
                >
                  Load More ({deduplicatedEntries.length - CARDS_TO_SHOW} more)
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </motion.div>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const q = searchParams.get('q') || '';
  const [activeTab, setActiveTab] = useState<SearchTabType>('All');
  const { data: results, isLoading, error } = useBalancedSearch(q);

  // Reset to 'All' tab when search query changes
  useEffect(() => {
    setActiveTab('All');
  }, [q]);

  if (!q) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <SearchIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 3 }} />
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.5rem', md: '2rem' },
            fontWeight: 300,
            color: 'text.primary',
            mb: 2
          }}
        >
          Enter a search query to get started
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '400px',
            mx: 'auto'
          }}
        >
          Search through thousands of Bible verses, commentaries, and theological insights
        </Typography>
      </Container>
    );
  }

  if (isLoading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <CrossLoader size={60} />
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            mt: 3
          }}
        >
          Searching...
        </Typography>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8, textAlign: 'center' }}>
        <Typography
          variant="h4"
          sx={{
            fontSize: { xs: '1.25rem', md: '1.5rem' },
            fontWeight: 500,
            color: 'error.main',
            mb: 2
          }}
        >
          Search Error
        </Typography>
        <Typography
          variant="body1"
          sx={{
            color: 'rgba(255, 255, 255, 0.7)',
            maxWidth: '400px',
            mx: 'auto'
          }}
        >
          We encountered an error while searching. Please try again.
        </Typography>
      </Container>
    );
  }

  const totalResults = results?.filter((group: any) => group.type !== 'CommentaryExcerpt').reduce((acc: number, group: any) => acc + (group.entries?.length || 0), 0) || 0;

  return (
    <Box sx={{
      minHeight: '100vh',
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'radial-gradient(circle at 50% 20%, rgba(255, 255, 255, 0.02) 0%, transparent 50%)',
        zIndex: 1,
      }
    }}>
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2, py: { xs: 4, md: 6 } }}>
        {/* Header Section */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={fadeSlideUpVariants}
          transition={{
            duration: 0.4,
            ease: [0.25, 0.46, 0.45, 0.94],
          }}
        >
          <Box sx={{ mb: 5, textAlign: { xs: 'left', md: 'left' } }}>
            <Typography
              variant="h1"
              sx={{
                fontSize: { xs: '1.75rem', sm: '2.25rem', md: '2.75rem' },
                fontWeight: 300,
                color: 'text.primary',
                mb: 2,
                letterSpacing: '-0.02em',
              }}
            >
              Search results for{' '}
              <Box
                component="span"
                sx={{
                  fontWeight: 700,
                  background: 'linear-gradient(135deg, #FFFFFF 0%, #CCCCCC 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                "{q}"
              </Box>
            </Typography>

            {totalResults > 0 && (
              <Typography
                variant="body1"
                sx={{
                  fontSize: { xs: '0.95rem', md: '1.125rem' },
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontWeight: 400
                }}
              >
                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
              </Typography>
            )}
          </Box>
        </motion.div>

        {/* Search Tabs */}
        {results && Array.isArray(results) && results.length > 0 && (
          <SearchTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            results={results}
          />
        )}

        {/* Results Section */}
        {results && Array.isArray(results) ? (
          results.length > 0 ? (
            results
              .filter((group: any) => group.type !== 'BibleVerseVersion') // Exclude BibleVerseVersion duplicates
              .sort((a: any, b: any) => {
                // Define priority order: Author (1), Bible Verses (2), Commentaries (3), Verse Takeaways (4), Others (5)
                const getPriority = (type: string) => {
                  switch (type) {
                    case 'Author': return 1;
                    case 'BibleVerse': return 2;
                    case 'Commentary': return 3;
                    case 'Takeaway':
                    case 'BibleVerseTakeaway': return 4;
                    default: return 5;
                  }
                };

                const priorityA = getPriority(a.type);
                const priorityB = getPriority(b.type);

                return priorityA - priorityB;
              })
              .map((group: any) => (
                <SearchGroup key={group.type} group={group} searchQuery={q} activeTab={activeTab} />
              ))
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={fadeSlideUpVariants}
              transition={{
                duration: 0.4,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <Box sx={{ textAlign: 'center', py: 8 }}>
                <SearchIcon sx={{ fontSize: 64, color: 'rgba(255, 255, 255, 0.3)', mb: 3 }} />
                <Typography
                  variant="h4"
                  sx={{
                    fontSize: { xs: '1.25rem', md: '1.5rem' },
                    fontWeight: 500,
                    color: 'text.primary',
                    mb: 2
                  }}
                >
                  No results found
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    maxWidth: '400px',
                    mx: 'auto'
                  }}
                >
                  Try different keywords or check your spelling
                </Typography>
              </Box>
            </motion.div>
          )
        ) : null}
      </Container>
    </Box>
  );
}

export default function SearchPage() {
  return (
    <AuthorProvider>
      <Suspense fallback={
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <CrossLoader size={60} />
        </Box>
      }>
        <SearchContent />
      </Suspense>
    </AuthorProvider>
  );
}
