'use client';

import { Box, Stack } from '@mui/material';
import { motion } from 'framer-motion';
import VerseTakeawaysCard from './VerseTakeawaysCard';
import BookOverviewCard from './BookOverviewCard';
import SupportCard from './SupportCard';
import GoPremiumCard from './GoPremiumCard';
import { fadeSlideUpVariants } from '@/hooks/useScrollAnimation';
import { usePremium } from '@/hooks/usePremium';

interface OverviewGridProps {
  verseReference: string;
  book: string;
  bookOverview: any;
  verseTakeaways: any;
  verseText: string;
  verseVersion: string;
  isLoading: boolean;
}

// Animated wrapper with sequential delay on page load
function AnimatedCard({ children, delay }: { children: React.ReactNode; delay: number }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={fadeSlideUpVariants}
      transition={{ delay: delay / 1000 }}
      style={{ width: '100%', height: '100%' }}
    >
      {children}
    </motion.div>
  );
}

export default function OverviewGrid({ verseReference, book, bookOverview, verseTakeaways, verseVersion, isLoading }: OverviewGridProps) {
  const isPremium = usePremium();

  return (
    <Box sx={{ width: '100%', mb: 0 }}>
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        alignItems="stretch"
        sx={{ width: '100%', gap: 'var(--ss-spacing-semantic-gap-large)' }}
      >
        <Box sx={{ width: { xs: '100%', md: '60%' }, display: 'flex' }}>
          <AnimatedCard delay={200}>
            <VerseTakeawaysCard reference={verseReference} verseTakeaways={verseTakeaways} isLoading={isLoading} />
          </AnimatedCard>
        </Box>
        <Box sx={{ width: { xs: '100%', md: '40%' }, display: 'flex' }}>
          <AnimatedCard delay={300}>
            <Stack sx={{ width: '100%', gap: 'var(--ss-spacing-semantic-gap-large)' }}>
              <BookOverviewCard
                bookName={book}
                bookOverview={bookOverview}
                verseTakeaways={verseTakeaways}
                verseVersion={verseVersion}
                isLoading={isLoading}
              />
              {isPremium ? (
                <SupportCard isLoading={isLoading} />
              ) : (
                <GoPremiumCard isLoading={isLoading} />
              )}
            </Stack>
          </AnimatedCard>
        </Box>
      </Stack>
    </Box>
  );
}
