// src/config/cardInjectorConfig.tsx
import { InjectorConfig } from '@/utils/cardInjector';
import { SupportCard } from '@/components/InjectedCards/SupportCard';
import { NewsletterCard } from '@/components/InjectedCards/NewsletterCard';
import { Box } from '@mui/material';

// Wrapper to ensure cards stretch to full height
const CardWrapper = ({ children }: { children: React.ReactNode }) => (
  <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
    {children}
  </Box>
);

export const commentaryGridInjectorConfig: InjectorConfig = {
  strategy: 'interval',
  intervalSize: 4, // Insert after every 4 cards
  maxInjections: 2,
  cards: [
    {
      id: 'support-default',
      type: 'support',
      variant: 'A',
      content: (
        <CardWrapper>
          <SupportCard variant="default" onAction={() => window.location.href = '/support'} />
        </CardWrapper>
      ),
      conditions: {
        minCards: 3,
        testGroup: 'A'
      }
    },
    {
      id: 'support-urgent',
      type: 'support',
      variant: 'B',
      content: (
        <CardWrapper>
          <SupportCard variant="urgent" onAction={() => window.location.href = '/support'} />
        </CardWrapper>
      ),
      conditions: {
        minCards: 3,
        testGroup: 'B'
      }
    },
    {
      id: 'support-minimal',
      type: 'support',
      variant: 'C',
      content: (
        <CardWrapper>
          <SupportCard variant="minimal" onAction={() => window.location.href = '/support'} />
        </CardWrapper>
      ),
      conditions: {
        minCards: 3,
        testGroup: 'C'
      }
    },
    {
      id: 'newsletter',
      type: 'promotion',
      content: (
        <CardWrapper>
          <NewsletterCard />
        </CardWrapper>
      ),
      conditions: {
        minCards: 6
      }
    }
  ]
};