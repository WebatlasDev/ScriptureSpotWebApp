'use client';

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { usePremium } from '@/hooks/usePremium';
import Image from 'next/image';

interface Props {
  isMobile: boolean;
  handleScrollTo: (id: string) => void;
  isLoadingSubscribe: boolean;
  isLoadingDonate: boolean;
  isLoadingBottomSubscribe: boolean;
  setIsLoadingBottomSubscribe: React.Dispatch<React.SetStateAction<boolean>>;
  handleSubscribe: (setter: React.Dispatch<React.SetStateAction<boolean>>) => Promise<void>;
  setDonationAmount: (value: string) => void;
}

export default function SupportCTA({
  isMobile,
  handleScrollTo,
  isLoadingSubscribe,
  isLoadingDonate,
  isLoadingBottomSubscribe,
  setIsLoadingBottomSubscribe,
  handleSubscribe,
  setDonationAmount,
}: Props) {
  const isPremium = usePremium();
  return (
    <Box
      sx={{
        py: { xs: 6, md: 8 },
        display: 'flex',
        flexDirection: 'column',
        gap: { xs: 4, md: 5.5 },
        alignItems: 'center',
      }}
    >
      <Typography
        sx={{
          fontSize: { xs: '24px', md: '28px' },
          fontWeight: 400,
          lineHeight: 1.2,
          color: 'white',
          textAlign: 'center',
        }}
      >
        How would you like to <Box component="span" sx={{ fontWeight: 700 }}>help</Box>?
      </Typography>

      <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' }, width: { xs: '100%', md: 'auto' }, justifyContent: { xs: 'stretch', md: 'center' } }}>
        {/* Premium Button */}
        {!isPremium && (
        <Button
          onClick={() => handleScrollTo('monthly-subscription-card')}
          sx={{
            width: { xs: '100%', md: 400 },
            py: 1.5,
            px: 4,
            backgroundColor: '#1A1A1A',
            borderRadius: 4.5,
            border: '3px solid transparent',
            background: `
              linear-gradient(#1A1A1A, #1A1A1A) padding-box,
              url('/assets/images/marketing/premium-subscription-tier/Premium-bg-lg.jpg') border-box
            `,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            textTransform: 'none',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/assets/images/marketing/premium-subscription-tier/premium-bg-lg.jpg)',
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
            '& > *': {
              position: 'relative',
              zIndex: 3,
            },
            '@media (hover: hover)': {
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(243, 214, 127, 0.3)',
              },
              '&:hover::after': {
                background: 'rgba(0, 0, 0, 0.6)',
              },
            },
          }}
        >
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
        </Button>
        )}

        {/* Supporter Button */}
        <Button
          onClick={() => handleScrollTo('one-time-donation-card')}
          sx={{
            width: { xs: '100%', md: 400 },
            py: 1.5,
            px: 4,
            backgroundColor: '#1A1A1A',
            borderRadius: 4.5,
            border: '3px solid transparent',
            background: `
              linear-gradient(#1A1A1A, #1A1A1A) padding-box,
              url('/assets/images/marketing/supporter-tier/Supporter-bg-lg.webp') border-box
            `,
            backgroundSize: 'cover, cover',
            backgroundPosition: 'center, center',
            position: 'relative',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
            textTransform: 'none',
            overflow: 'hidden',
            transition: 'box-shadow 0.3s ease',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(/assets/images/marketing/supporter-tier/Supporter-bg-lg.webp)',
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
            '& > *': {
              position: 'relative',
              zIndex: 3,
            },
            '@media (hover: hover)': {
              '&:hover': {
                boxShadow: '0 0 0 2px rgba(207, 1, 183, 0.3)',
              },
              '&:hover::after': {
                background: 'rgba(0, 0, 0, 0.6)',
              },
            },
          }}
        >
          <Box
            sx={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #CF01B7 0%, #F801C9 100%)',
              boxShadow: '0px 6px 27px rgba(207, 1, 183, 0.65)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              p: 1,
            }}
          >
            <Image
              src="/assets/images/marketing/supporter-tier/Supporter-icon.webp"
              alt="Supporter"
              width={24}
              height={24}
              style={{ filter: 'drop-shadow(-3px 4px 7px rgba(0, 0, 0, 0.25))' }}
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
            SUPPORTER
          </Typography>
        </Button>
      </Box>
    </Box>
  );
}