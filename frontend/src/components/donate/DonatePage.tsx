'use client';

import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  useMediaQuery,
  Grid,
} from '@mui/material';
import SubscriptionCard from './SubscriptionCard';
import DonationCard from './DonationCard';
import { usePremium } from '@/hooks/usePremium';
import ImpactSection from './ImpactSection';
import SupportCTA from './SupportCTA';
import {
  PRIMARY_GOLD,
  HOVER_GOLD,
  SUBDUED_GOLD_TEXT,
  TEXT_ON_GOLD,
  OUTLINED_GOLD_HOVER_BG,
} from './constants';
import { createDonationSession } from '@/lib/stripe';
import { useRouter } from 'next/navigation';

export default function DonatePage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isPremium = usePremium();
  const router = useRouter();
  const [donationAmount, setDonationAmount] = useState<string>('25');
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isLoadingSubscribe, setIsLoadingSubscribe] = useState<boolean>(false);
  const [isLoadingDonate, setIsLoadingDonate] = useState<boolean>(false);
  const [isLoadingBottomSubscribe, setIsLoadingBottomSubscribe] = useState<boolean>(false);

  const [hoveredMainCard, setHoveredMainCard] = useState<string | null>(null);
  const [hoveredStatCard, setHoveredStatCard] = useState<string | null>(null);

  const handleAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setDonationAmount(value);
    if (value !== 'custom') setCustomAmount('');
  };

  const handleCustomAmountChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    if (/^\d*\.?\d{0,2}$/.test(value) || value === '') {
      setCustomAmount(value);
      setDonationAmount('custom');
    }
  };

  const handleScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  const handleSubscribe = async (
    setter: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
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
    <Box sx={{ background: '#111111' }}>
      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
        <Box sx={{ textAlign: 'center', pt: { xs: 2, md: 6 }, mb: { xs: 4, md: 8 } }}>
          <Typography variant="h1" component="h1" sx={{ fontSize: { xs: '28px', sm: '32px', md: '40px' }, fontWeight: 300, color: 'white', mb: { xs: 2, md: 3 }, lineHeight: { xs: 1.2, md: 1.2 } }}>
            Enjoying <Box component="span" sx={{ fontWeight: 700 }}>Scripture Spot</Box>?
          </Typography>
          <Typography variant="h5" sx={{ color: 'rgba(255, 255, 255, 0.60)', maxWidth: '700px', mx: 'auto', lineHeight: 1.2, fontSize: { xs: 18, md: 20 }, px: { xs: 1, md: 0 }, fontWeight: 400 }}>
            Take your support to the next level
          </Typography>
        </Box>
      </Container>

      {/* Cards Section */}
      <Box sx={{ 
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        px: { xs: 2, sm: 3, md: 4 },
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box sx={{ 
          width: '100%', 
          maxWidth: '1200px',
          mb: { xs: 6, md: 12 }
        }}>
          <Grid container spacing={3} justifyContent={isPremium ? 'center' : undefined}>
            {!isPremium && (
              <Grid item xs={12} md={6} id="monthly-subscription-card">
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
              </Grid>
            )}
            <Grid item xs={12} md={isPremium ? 12 : 6} id="one-time-donation-card">
              <DonationCard
                hoveredMainCard={hoveredMainCard}
                setHoveredMainCard={setHoveredMainCard}
                donationAmount={donationAmount}
                customAmount={customAmount}
                handleAmountChange={handleAmountChange}
                handleCustomAmountChange={handleCustomAmountChange}
                isLoadingDonate={isLoadingDonate}
                isLoadingSubscribe={isLoadingSubscribe}
                isLoadingBottomSubscribe={isLoadingBottomSubscribe}
                handleDonate={handleDonate}
                getButtonStyles={getButtonStyles}
              />
            </Grid>
          </Grid>
        </Box>
      </Box>

      {/* Impact Section */}
      <Box sx={{ 
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        mb: { xs: 4, md: 6 },
        py: { xs: 6, md: 9.5 },
        px: { xs: 2, sm: 3, md: 4 },
        backgroundImage: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-lg.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
          zIndex: 1,
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
      }}>
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          <ImpactSection hoveredStatCard={hoveredStatCard} setHoveredStatCard={setHoveredStatCard} />
        </Box>
      </Box>

      {/* Support CTA */}
      <Box sx={{ 
        width: '100vw',
        marginLeft: 'calc(-50vw + 50%)',
        px: { xs: 2, sm: 3, md: 4 },
        position: 'relative', 
        zIndex: 2,
        display: 'flex',
        justifyContent: 'center'
      }}>
        <Box sx={{ width: '100%', maxWidth: '1200px' }}>
          <SupportCTA
            isMobile={isMobile}
            handleScrollTo={handleScrollTo}
            isLoadingSubscribe={isLoadingSubscribe}
            isLoadingDonate={isLoadingDonate}
            isLoadingBottomSubscribe={isLoadingBottomSubscribe}
            setIsLoadingBottomSubscribe={setIsLoadingBottomSubscribe}
            handleSubscribe={handleSubscribe}
            setDonationAmount={setDonationAmount}
          />
        </Box>
      </Box>
    </Box>
  );
}
