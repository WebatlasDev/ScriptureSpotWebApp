'use client';

import React, { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Grid,
  Paper,
  CircularProgress,
} from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import VerseTakeawaysHeader from '@/components/commentators/VerseTakeawaysHeader';
import { hexToRgb } from '@/utils/color';

// Verse Takeaways color scheme from VerseTakeawaysModal
const VERSE_TAKEAWAYS_COLORS = {
  primary: '#ED27FF', // Bright magenta
};

export default function VerseTakeawaysCommentariesPage() {
  const router = useRouter();
  const [pendingBook, setPendingBook] = useState<string | null>(null);
  const [, startTransition] = useTransition();
  
  // Handle book selection
  const handleBookSelect = (bookSlug: string) => {
    if (pendingBook) {
      return;
    }

    setPendingBook(bookSlug);
    startTransition(() => {
      try {
        router.push(`/commentators/verse-takeaways/commentaries/${bookSlug}`);
      } catch {
        setPendingBook(null);
      }
    });
  };
  
  const oldTestament = OLD_TESTAMENT_BOOKS;
  const newTestament = NEW_TESTAMENT_BOOKS;

  return (
    <Box sx={{ maxWidth: '1200px', width: '100%', mx: 'auto' }}>
      {/* Header */}
      <VerseTakeawaysHeader
        title="Available Takeaways"
        subtitle="Select a book of the Bible"
        breadcrumbItems={[
          { label: 'Commentators', href: '/commentators' },
          { label: 'Verse Takeaways' },
        ]}
      />
      
      {/* Bible book grid */}
      <Box sx={{ width: '100%' }}>
        
        {/* Old Testament */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ mb: 2, fontWeight: 500 }}
          >
            Old Testament
          </Typography>
          <Grid container spacing={2}>
            {oldTestament.map((book) => {
              const isPending = pendingBook === book.slug;
              const isDisabled = Boolean((pendingBook && pendingBook !== book.slug) || isPending);

              return (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.slug}>
                  <Paper
                    component={Primitive.button as any}
                    onClick={() => handleBookSelect(book.slug)}
                    type="button"
                    disabled={isDisabled}
                    aria-busy={isPending}
                    aria-live={isPending ? 'polite' : undefined}
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      background: `rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.2)`,
                      transition: 'all 0.2s',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border: `1px solid rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.5)`,
                      width: '100%',
                      opacity: isDisabled ? 0.75 : 1,
                      pointerEvents: isDisabled ? 'none' : 'auto',
                      '&:hover': !isDisabled ? {
                        background: `rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.3)`,
                        transform: 'translateY(-2px)',
                        borderColor: VERSE_TAKEAWAYS_COLORS.primary,
                      } : {},
                      '&:focus-visible': {
                        outline: '2px solid rgba(255, 255, 255, 0.35)',
                        outlineOffset: 2,
                      },
                      '&:disabled': {
                        transform: 'none',
                      },
                    }}
                  >
                    {isPending ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                        <Typography color="#FFFFFF" fontWeight={600} fontSize={14}>
                          Loading...
                        </Typography>
                      </Box>
                    ) : (
                  <Typography color="white" fontWeight={500}>
                    {book.name}
                  </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        
        {/* New Testament */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h5" 
            component="h2" 
            color="white" 
            sx={{ mb: 2, fontWeight: 500 }}
          >
            New Testament
          </Typography>
          <Grid container spacing={2}>
            {newTestament.map((book) => {
              const isPending = pendingBook === book.slug;
              const isDisabled = Boolean((pendingBook && pendingBook !== book.slug) || isPending);

              return (
                <Grid item xs={6} sm={4} md={3} lg={2.4} key={book.slug}>
                  <Paper
                    component={Primitive.button as any}
                    onClick={() => handleBookSelect(book.slug)}
                    type="button"
                    disabled={isDisabled}
                    aria-busy={isPending}
                    aria-live={isPending ? 'polite' : undefined}
                    sx={{
                      padding: 2,
                      textAlign: 'center',
                      borderRadius: 2,
                      background: `rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.2)`,
                      transition: 'all 0.2s',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center',
                      border: `1px solid rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.5)`,
                      width: '100%',
                      opacity: isDisabled ? 0.75 : 1,
                      pointerEvents: isDisabled ? 'none' : 'auto',
                      '&:hover': !isDisabled ? {
                        background: `rgba(${hexToRgb(VERSE_TAKEAWAYS_COLORS.primary)}, 0.3)`,
                        transform: 'translateY(-2px)',
                        borderColor: VERSE_TAKEAWAYS_COLORS.primary,
                      } : {},
                      '&:focus-visible': {
                        outline: '2px solid rgba(255, 255, 255, 0.35)',
                        outlineOffset: 2,
                      },
                      '&:disabled': {
                        transform: 'none',
                      },
                    }}
                  >
                    {isPending ? (
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: '#FFFFFF' }} />
                        <Typography color="#FFFFFF" fontWeight={600} fontSize={14}>
                          Loading...
                        </Typography>
                      </Box>
                    ) : (
                      <Typography color="white" fontWeight={500}>
                        {book.name}
                      </Typography>
                    )}
                  </Paper>
                </Grid>
              );
            })}
          </Grid>
        </Box>
        
      </Box>
    </Box>
  );
}

// Bible books data - all 66 books
const OLD_TESTAMENT_BOOKS = [
  { slug: 'genesis', name: 'Genesis' },
  { slug: 'exodus', name: 'Exodus' },
  { slug: 'leviticus', name: 'Leviticus' },
  { slug: 'numbers', name: 'Numbers' },
  { slug: 'deuteronomy', name: 'Deuteronomy' },
  { slug: 'joshua', name: 'Joshua' },
  { slug: 'judges', name: 'Judges' },
  { slug: 'ruth', name: 'Ruth' },
  { slug: '1-samuel', name: '1 Samuel' },
  { slug: '2-samuel', name: '2 Samuel' },
  { slug: '1-kings', name: '1 Kings' },
  { slug: '2-kings', name: '2 Kings' },
  { slug: '1-chronicles', name: '1 Chronicles' },
  { slug: '2-chronicles', name: '2 Chronicles' },
  { slug: 'ezra', name: 'Ezra' },
  { slug: 'nehemiah', name: 'Nehemiah' },
  { slug: 'esther', name: 'Esther' },
  { slug: 'job', name: 'Job' },
  { slug: 'psalms', name: 'Psalms' },
  { slug: 'proverbs', name: 'Proverbs' },
  { slug: 'ecclesiastes', name: 'Ecclesiastes' },
  { slug: 'song-of-solomon', name: 'Song of Solomon' },
  { slug: 'isaiah', name: 'Isaiah' },
  { slug: 'jeremiah', name: 'Jeremiah' },
  { slug: 'lamentations', name: 'Lamentations' },
  { slug: 'ezekiel', name: 'Ezekiel' },
  { slug: 'daniel', name: 'Daniel' },
  { slug: 'hosea', name: 'Hosea' },
  { slug: 'joel', name: 'Joel' },
  { slug: 'amos', name: 'Amos' },
  { slug: 'obadiah', name: 'Obadiah' },
  { slug: 'jonah', name: 'Jonah' },
  { slug: 'micah', name: 'Micah' },
  { slug: 'nahum', name: 'Nahum' },
  { slug: 'habakkuk', name: 'Habakkuk' },
  { slug: 'zephaniah', name: 'Zephaniah' },
  { slug: 'haggai', name: 'Haggai' },
  { slug: 'zechariah', name: 'Zechariah' },
  { slug: 'malachi', name: 'Malachi' }
];

const NEW_TESTAMENT_BOOKS = [
  { slug: 'matthew', name: 'Matthew' },
  { slug: 'mark', name: 'Mark' },
  { slug: 'luke', name: 'Luke' },
  { slug: 'john', name: 'John' },
  { slug: 'acts', name: 'Acts' },
  { slug: 'romans', name: 'Romans' },
  { slug: '1-corinthians', name: '1 Corinthians' },
  { slug: '2-corinthians', name: '2 Corinthians' },
  { slug: 'galatians', name: 'Galatians' },
  { slug: 'ephesians', name: 'Ephesians' },
  { slug: 'philippians', name: 'Philippians' },
  { slug: 'colossians', name: 'Colossians' },
  { slug: '1-thessalonians', name: '1 Thessalonians' },
  { slug: '2-thessalonians', name: '2 Thessalonians' },
  { slug: '1-timothy', name: '1 Timothy' },
  { slug: '2-timothy', name: '2 Timothy' },
  { slug: 'titus', name: 'Titus' },
  { slug: 'philemon', name: 'Philemon' },
  { slug: 'hebrews', name: 'Hebrews' },
  { slug: 'james', name: 'James' },
  { slug: '1-peter', name: '1 Peter' },
  { slug: '2-peter', name: '2 Peter' },
  { slug: '1-john', name: '1 John' },
  { slug: '2-john', name: '2 John' },
  { slug: '3-john', name: '3 John' },
  { slug: 'jude', name: 'Jude' },
  { slug: 'revelation', name: 'Revelation' }
];
