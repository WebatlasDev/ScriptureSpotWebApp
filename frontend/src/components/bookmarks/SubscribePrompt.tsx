'use client';
import { Box, Button, Typography, useMediaQuery, useTheme } from '@mui/material';
import Link from 'next/link';
import SubscriptionCard from '../donate/SubscriptionCard';
import { useState } from 'react';
import {
  PRIMARY_GOLD,
  TEXT_ON_GOLD,
  HOVER_GOLD,
  SUBDUED_GOLD_TEXT,
  OUTLINED_GOLD_HOVER_BG,
} from '../donate/constants';
import { createDonationSession } from '@/lib/stripe';
import { useRouter } from 'next/navigation';

export default function SubscribePrompt() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const router = useRouter();
  const [donationAmount, setDonationAmount] = useState<string>('25');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoadingSubscribe, setIsLoadingSubscribe] = useState<boolean>(false);
  const [isLoadingDonate, setIsLoadingDonate] = useState<boolean>(false);
  const [isLoadingBottomSubscribe, setIsLoadingBottomSubscribe] = useState<boolean>(false);

  const [hoveredMainCard, setHoveredMainCard] = useState<string | null>(null);

  const handleSubscribe = async (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
    try {
      setter(true);
      router.push('/pricing');
    } finally {
      setter(false);
    }
  };

  const handleDonate = async () => {
    try {
      setIsLoadingDonate(true);
      const amount = donationAmount === 'custom' ? customAmount : donationAmount;
      if (!amount || parseFloat(amount) <= 0) {
        alert('Please enter a valid donation amount.');
        setIsLoadingDonate(false);
        return;
      }
      const amountInCents = Math.round(parseFloat(amount) * 100);
      await createDonationSession(amountInCents);
    } catch {
      alert('Error processing request.');
    } finally {
      setIsLoadingDonate(false);
    }
  };

  const getButtonStyles = (cardType: 'subscribe' | 'donate') => {
    const isHovered = hoveredMainCard === cardType;
    const isAnyHovered = hoveredMainCard !== null;

    if (isHovered) {
      return { bgcolor: PRIMARY_GOLD, color: TEXT_ON_GOLD, '&:hover': { bgcolor: HOVER_GOLD } };
    }
    if (isAnyHovered && !isHovered) {
      return { bgcolor: 'transparent', color: SUBDUED_GOLD_TEXT, borderColor: SUBDUED_GOLD_TEXT, '&:hover': { bgcolor: OUTLINED_GOLD_HOVER_BG, borderColor: PRIMARY_GOLD } };
    }
    if (cardType === 'subscribe') {
      return { bgcolor: PRIMARY_GOLD, color: TEXT_ON_GOLD, '&:hover': { bgcolor: HOVER_GOLD } };
    }
    return { bgcolor: 'transparent', color: SUBDUED_GOLD_TEXT, borderColor: SUBDUED_GOLD_TEXT, '&:hover': { bgcolor: OUTLINED_GOLD_HOVER_BG, borderColor: PRIMARY_GOLD } };
  };
  
  return (
        <Box>
          <Box
            sx={{
              width: '100%',
              px: 5,
              py: 2,
              mb: 4,
              background: 'rgba(255, 215, 0, 0.20)',
              borderRadius: 3,
              outline: '2px rgba(255, 215, 0, 0.20) solid',
              outlineOffset: '-2px',
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              justifyContent: 'center',
              alignItems: 'center',
              gap: { xs: 1, md: 1.25 },
              transition: { xs: 'none', md: 'all 0.2s ease-in-out' },
              '@media (hover: hover) and (min-width: 900px)': {
                '&:hover': {
                  background: 'rgba(255, 215, 0, 0.30)',
                  outline: '2px rgba(255, 215, 0, 0.40) solid',
                },
              },
            }}
          >            
            {/* Bottom row on mobile: Continue exploring + arrow */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
              }}
            >
              <Typography
                sx={{
                  color: '#FFFAFA',
                  fontSize: 16,
                  fontWeight: 400,
                  lineHeight: 1.4,
                  '& strong': {
                    fontWeight: 700,
                  },
                }}
              >
                Subscribe to unlock bookmarks. Become a monthly supporter to save your favorite content and access other premium features.
              </Typography>
            </Box>
          </Box>
          <SubscriptionCard
            hoveredMainCard={hoveredMainCard}
            setHoveredMainCard={setHoveredMainCard}
            isLoadingSubscribe={isLoadingSubscribe}
            isLoadingDonate={isLoadingDonate}
            isLoadingBottomSubscribe={isLoadingBottomSubscribe}
            setIsLoadingSubscribe={setIsLoadingSubscribe}
            handleSubscribe={handleSubscribe}
            getButtonStyles={getButtonStyles}
          />
        </Box>
  );
}
