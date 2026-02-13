'use client';

import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  TextField,
  InputAdornment,
} from '@mui/material';
import { ArrowForward, LockOutlined } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import CrossLoader from '@/components/ui/CrossLoader';
import {
  PRIMARY_GOLD,
  HOVER_GOLD,
  SUBDUED_GOLD_TEXT,
  SUBDUED_GOLD_BG_ICON,
  TEXT_ON_GOLD,
  DISABLED_GOLD_BG,
  DISABLED_GOLD_TEXT,
  OUTLINED_GOLD_HOVER_BG,
  CARD_DEFAULT_BG,
  CARD_HOVER_BG,
} from './constants';

interface Props {
  hoveredMainCard: string | null;
  setHoveredMainCard: (card: string | null) => void;
  donationAmount: string;
  customAmount: string;
  handleAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleCustomAmountChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  isLoadingDonate: boolean;
  isLoadingSubscribe: boolean;
  isLoadingBottomSubscribe: boolean;
  handleDonate: () => Promise<void>;
  getButtonStyles: (cardType: 'subscribe' | 'donate') => Record<string, any>;
}

export default function DonationCard({
  hoveredMainCard,
  setHoveredMainCard,
  donationAmount,
  customAmount,
  handleAmountChange,
  handleCustomAmountChange,
  isLoadingDonate,
  isLoadingSubscribe,
  isLoadingBottomSubscribe,
  handleDonate,
  getButtonStyles,
}: Props) {
  return (
    <Paper
      onMouseEnter={() => window.innerWidth >= 768 && setHoveredMainCard('donate')}
      onMouseLeave={() => window.innerWidth >= 768 && setHoveredMainCard(null)}
      elevation={0}
      sx={{
        p: { xs: 3, sm: 3, md: 4 },
        height: '100%',
        borderRadius: 4.5,
        border: '3px solid transparent',
        background: `
          linear-gradient(#111111, #111111) padding-box,
          url('/assets/images/marketing/supporter-tier/Supporter-bg-lg.webp') border-box
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
        '@media (hover: hover)': {
          '&:hover': {
            boxShadow: '0 0 0 2px rgba(207, 1, 183, 0.3)',
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
        </Box>
        <Typography
          variant="h2"
          component="h2"
          sx={{ fontSize: { xs: '22px', sm: '24px', md: '28px' }, color: 'white', fontWeight: 400, lineHeight: 1.2, mb: .1 }}
        >
          <Box component="span" sx={{ fontWeight: 700 }}>Support</Box> Our Mission
        </Typography>
      </Box>

      <Box sx={{ mb: { xs: 2, md: 3 } }}>
        {[
          { text: 'Keep Scripture Spot accessible', bold: 'Keep' },
          { text: 'Support ongoing development', bold: 'Support' },
          { text: 'Join our incredible community', bold: 'Join' }
        ].map((item, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: { xs: 1, md: 1.5 }, p: { xs: 0.5, md: 1 } }}>
            <Box sx={{ width: 5, height: 5, bgcolor: '#F801C9', borderRadius: '50%' }} />
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

      <FormControl component="fieldset" sx={{ width: '100%', mb: { xs: 1.5, md: 2.25 } }}>
        <RadioGroup aria-label="donation-amount" name="donation-amount" value={donationAmount} onChange={handleAmountChange}>
          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: { xs: 1, md: 1.5 }, mb: { xs: 1.5, md: 2 } }}>
            {['10', '25', '50', '100'].map(amount => (
              <FormControlLabel
                key={amount}
                value={amount}
                control={<Radio sx={{ display: 'none' }} />}
                label={`$${amount}`}
                sx={{
                  m: 0,
                  '& .MuiFormControlLabel-label': {
                    width: '100%',
                    textAlign: 'center',
                    py: 1.9,
                    px: 1.5,
                    borderRadius: { xs: 2, md: 4 },
                    backgroundColor: 'rgba(237, 237, 237, 0.20)',
                    position: 'relative',
                    fontWeight: 700,
                    fontSize: 16,
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    color: donationAmount === amount ? 'white !important' : 'rgba(255, 255, 255, 0.60) !important',
                    zIndex: 2,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      backgroundImage: 'url(/assets/images/marketing/supporter-tier/Supporter-bg-xs.webp)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: { xs: 2, md: 4 },
                      opacity: donationAmount === amount ? 1 : 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: -1,
                    },
                    '&:hover': {
                      backgroundColor: donationAmount === amount ? 'rgba(237, 237, 237, 0.20)' : 'rgba(237, 237, 237, 0.30)',
                    },
                  },
                }}
              />
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: { xs: 1, md: 1.5 } }}>
            <Box sx={{ flex: 1 }}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Enter Amount"
                value={donationAmount === 'custom' ? customAmount : ''}
                onChange={(e) => {
                  handleCustomAmountChange(e as React.ChangeEvent<HTMLInputElement>);
                }}
                InputProps={{
                  startAdornment: donationAmount === 'custom' && customAmount ? (
                    <InputAdornment 
                      position="start" 
                      sx={{ 
                        color: 'white', 
                        fontWeight: 700, 
                        mr: -1.5,
                        pl: 1,
                        animation: 'fadeInFromLeft 0.3s ease-out',
                        '@keyframes fadeInFromLeft': {
                          '0%': {
                            opacity: 0,
                            transform: 'translateX(-10px)',
                          },
                          '100%': {
                            opacity: 1,
                            transform: 'translateX(0)',
                          },
                        },
                      }}
                    >
                      $
                    </InputAdornment>
                  ) : null,
                }}
                onFocus={() => {
                  handleCustomAmountChange({ target: { value: customAmount } } as React.ChangeEvent<HTMLInputElement>);
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(237, 237, 237, 0.20)',
                    borderRadius: { xs: 2, md: 4 },
                    color: 'white',
                    fontWeight: 700,
                    fontSize: 16,
                    height: 'auto',
                    position: 'relative',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      right: -2,
                      bottom: -2,
                      backgroundImage: 'url(/assets/images/marketing/supporter-tier/Supporter-bg-sm.webp)',
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      borderRadius: 6,
                      opacity: donationAmount === 'custom' ? 0.3 : 0,
                      transition: 'opacity 0.3s ease',
                      zIndex: -1,
                    },
                    '& .MuiOutlinedInput-input': {
                      py: 1.9,
                      px: 2.5,
                      height: 'auto',
                      position: 'relative',
                      zIndex: 1,
                      '&::placeholder': {
                        color: 'rgba(255, 255, 255, 0.60)',
                        opacity: 1,
                      },
                    },
                    '& fieldset': { border: 'none' },
                    '&:hover fieldset': { border: 'none' },
                    '&.Mui-focused fieldset': { border: 'none' },
                  },
                }}
              />
            </Box>
            <Button
              onClick={handleDonate}
              disabled={isLoadingDonate || isLoadingSubscribe || isLoadingBottomSubscribe || (donationAmount === 'custom' && (!customAmount || parseFloat(customAmount) <= 0))}
              endIcon={!isLoadingDonate ? <ArrowForward /> : undefined}
              sx={{
                py: 1.5,
                px: 4.5,
                fontSize: 16,
                fontWeight: 700,
                borderRadius: { xs: 2, md: 4 },
                textTransform: 'none',
                position: 'relative',
                backgroundColor: 'transparent',
                color: 'white',
                height: 'auto',
                minHeight: 'auto',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundImage: 'url(/assets/images/marketing/supporter-tier/Supporter-bg-sm.webp)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  borderRadius: { xs: 2, md: 4 },
                  opacity: 1,
                  transition: 'opacity 0.3s ease',
                  zIndex: -1,
                },
                '& > *': {
                  position: 'relative',
                  zIndex: 1,
                },
                '&:hover::before': {
                  opacity: 0.9,
                },
                '&:disabled': {
                  color: 'rgba(255, 255, 255, 0.5)',
                },
                '&:disabled::before': {
                  opacity: 0.5,
                },
              }}
            >
              {isLoadingDonate ? <CrossLoader size={24} /> : 'Send'}
            </Button>
          </Box>
        </RadioGroup>
      </FormControl>

      <Box sx={{ flexGrow: 1 }} />
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: .75 }}>
        <LockOutlined sx={{ fontSize: 15, color: 'rgba(255, 255, 255, 0.60)' }} />
        <Typography
          sx={{
            textAlign: 'center',
            color: 'rgba(255, 255, 255, 0.60)',
            fontSize: 14,
            fontWeight: 400,
            lineHeight: 1.5,
          }}
        >
          Secure payment with Stripe
        </Typography>
      </Box>
    </Paper>
  );
}