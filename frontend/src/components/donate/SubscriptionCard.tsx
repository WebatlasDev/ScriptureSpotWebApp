'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
} from '@mui/material';
import { ArrowForward } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import CrossLoader from '@/components/ui/CrossLoader';

interface Props {
  hoveredMainCard: string | null;
  setHoveredMainCard: (card: string | null) => void;
  isLoadingSubscribe: boolean;
  isLoadingDonate: boolean;
  isLoadingBottomSubscribe: boolean;
  setIsLoadingSubscribe: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubscribe: (setter: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>;
  getButtonStyles: (cardType: 'subscribe' | 'donate') => Record<string, any>;
}

export default function SubscriptionCard({
  hoveredMainCard,
  setHoveredMainCard,
  isLoadingSubscribe,
  isLoadingDonate,
  isLoadingBottomSubscribe,
  setIsLoadingSubscribe,
  handleSubscribe,
  getButtonStyles,
}: Props) {
  return (
    <Paper
      onMouseEnter={() => window.innerWidth >= 768 && setHoveredMainCard('subscribe')}
      onMouseLeave={() => window.innerWidth >= 768 && setHoveredMainCard(null)}
      elevation={0}
      sx={{
        p: { xs: 3, sm: 3, md: 4 },
        height: '100%',
        borderRadius: 4.5,
        border: '3px solid transparent',
        background: `
          linear-gradient(#111111, #111111) padding-box,
          url('/assets/images/marketing/premium-subscription-tier/Premium-bg-lg.jpg') border-box
        `,
        backgroundSize: 'cover, cover',
        backgroundPosition: 'center, center',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-lg.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: 1,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.7)',
          zIndex: 2,
          transition: 'background 0.3s ease',
        },
        '@media (hover: hover)': {
          '&:hover': {
            boxShadow: '0 0 0 2px rgba(243, 214, 127, 0.3)',
          },
          '&:hover::after': {
            background: 'rgba(0, 0, 0, 0.6)',
          },
        },
        transition: 'box-shadow 0.3s ease',
        '& > *': {
          position: 'relative',
          zIndex: 3,
        },
      }}
    >
      <Box sx={{ mb: { xs: 2, md: 3 }, textAlign: 'left' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: { xs: 1.5, md: 2 } }}>
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              boxShadow: '0px 7px 38px rgba(243, 214, 127, 0.58)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Image
              src="/assets/images/marketing/premium-subscription-tier/Premium-icon.webp"
              alt="Premium"
              width={24}
              height={24}
            />
          </Box>
          <Typography
            sx={{
              color: 'white',
              fontSize: 14,
              fontWeight: 700,
              letterSpacing: 1.1,
              textTransform: 'uppercase',
            }}
          >
            PREMIUM
          </Typography>
        </Box>
        <Typography
          variant="h2"
          component="h2"
          sx={{ fontSize: { xs: '22px', sm: '24px', md: '28px' }, color: 'white', fontWeight: 400, lineHeight: 1.2, mb: .1}}
        >
          <Box component="span" sx={{ fontWeight: 700 }}>Enhance</Box> Your Study
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        {[
          { text: 'Read Ad-Free', bold: 'Ad-Free' },
          { text: 'Bookmark Anything', bold: 'Bookmark' },
          { text: 'Get Exclusive Updates', bold: 'Exclusive' },
          { text: 'Keep Scripture Spot Online', bold: 'Online' }
        ].map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1, md: 1.5 }, p: { xs: 0.5, md: 1 } }}>
            <Box sx={{ width: 4, height: 4, bgcolor: '#FFCB5F', borderRadius: '50%' }} />
            <Typography sx={{ fontSize: { xs: '16px', md: '18px' }, lineHeight: 1.5, color: 'white' }}>
              {item.text.split(' ').map((word, i) => (
                <Box key={i} component="span" sx={{ fontWeight: word === item.bold ? 700 : 400 }}>
                  {word}{i < item.text.split(' ').length - 1 ? ' ' : ''}
                </Box>
              ))}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-sm.jpg)',
              backgroundSize: 'cover',
              borderRadius: { xs: 2, md: 4 },
              zIndex: 0
            }}
          />
          <Button
            onClick={() => handleSubscribe(setIsLoadingSubscribe)}
            disabled={isLoadingSubscribe || isLoadingDonate || isLoadingBottomSubscribe}
            endIcon={!isLoadingSubscribe ? <ArrowForward /> : undefined}
            sx={{
              width: '100%',
              py: 1.5,
              fontSize: 16,
              fontWeight: 700,
              borderRadius: { xs: 2, md: 4 },
              textTransform: 'none',
              backgroundColor: 'rgba(0, 0, 0, 0.17)',
              color: 'white',
              position: 'relative',
              zIndex: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.3)',
              },
              '&:disabled': {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                color: 'rgba(255, 255, 255, 0.5)',
              },
            }}
          >
            {isLoadingSubscribe ? <CrossLoader size={24} /> : 'Unlock Premium'}
          </Button>
        </Box>
        <Typography
          sx={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.60)',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          $4.99/mo subscription. Cancel anytime.
        </Typography>
      </Box>
    </Paper>
  );
}