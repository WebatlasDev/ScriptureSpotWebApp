'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Button,
  Paper,
} from '@mui/material';
import { CheckCircleIcon } from '@/components/ui/phosphor-icons';
import { useRouter, useSearchParams } from 'next/navigation';
import CrossLoader from '@/components/ui/CrossLoader';

const PRIMARY_GOLD = '#FFD700';
const CARD_DEFAULT_BG = '#1A1A1A';

export default function DonateSuccessPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id');
  const [loading, setLoading] = useState(true);
  const [sessionData, setSessionData] = useState<any>(null);

  useEffect(() => {
    if (sessionId) {
      // In a real implementation, you might want to verify the session
      // For now, we'll just simulate a successful payment
      setTimeout(() => {
        setSessionData({ 
          payment_status: 'paid',
          amount_total: 2500, // This would come from the actual session
          currency: 'usd'
        });
        setLoading(false);
      }, 1000);
    } else {
      setLoading(false);
    }
  }, [sessionId]);

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  if (loading) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <CrossLoader size={50} />
          <Typography color="white">Processing your payment...</Typography>
        </Box>
      </Container>
    );
  }

  if (!sessionId || !sessionData) {
    return (
      <Container maxWidth="sm">
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '60vh',
          textAlign: 'center'
        }}>
          <Typography variant="h4" color="white" gutterBottom>
            Payment Not Found
          </Typography>
          <Typography color="rgba(255, 255, 255, 0.7)" sx={{ mb: 4 }}>
            We couldn't find your payment information.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push('/donate')}
            sx={{
              bgcolor: PRIMARY_GOLD,
              color: '#000',
              '&:hover': { bgcolor: '#FFE066' }
            }}
          >
            Return to Donate
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: { xs: 4, md: 6 }, mb: { xs: 6, md: 8 } }}>
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            bgcolor: CARD_DEFAULT_BG,
            borderRadius: 2,
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'center'
          }}
        >
          <Box sx={{ mb: 3 }}>
            <CheckCircleIcon 
              sx={{ 
                fontSize: 80, 
                color: PRIMARY_GOLD,
                mb: 2
              }} 
            />
            <Typography variant="h3" component="h1" sx={{ 
              color: 'white', 
              fontWeight: 700,
              mb: 2
            }}>
              Thank You!
            </Typography>
            <Typography variant="h6" sx={{ 
              color: 'rgba(255, 255, 255, 0.8)',
              mb: 4
            }}>
              Your support means the world to us
            </Typography>
          </Box>

          {sessionData.amount_total && (
            <Box sx={{ 
              p: 3, 
              bgcolor: 'rgba(255, 215, 0, 0.1)', 
              borderRadius: 2, 
              mb: 4,
              border: `1px solid rgba(255, 215, 0, 0.3)`
            }}>
              <Typography variant="body1" sx={{ color: 'white', mb: 1 }}>
                Payment Amount
              </Typography>
              <Typography variant="h4" sx={{ 
                color: PRIMARY_GOLD, 
                fontWeight: 700 
              }}>
                {formatAmount(sessionData.amount_total, sessionData.currency)}
              </Typography>
            </Box>
          )}

          <Typography variant="body1" sx={{ 
            color: 'rgba(255, 255, 255, 0.8)',
            mb: 4,
            lineHeight: 1.6
          }}>
            Your generous contribution helps us continue making Scripture accessible 
            to everyone. You should receive a confirmation email shortly with your 
            receipt details.
          </Typography>

          <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
            <Button
              variant="contained"
              fullWidth
              onClick={() => router.push('/')}
              sx={{
                py: 1.5,
                bgcolor: PRIMARY_GOLD,
                color: '#000',
                fontWeight: 600,
                '&:hover': { bgcolor: '#FFE066' }
              }}
            >
              Continue to Scripture Spot
            </Button>
            <Button
              variant="outlined"
              fullWidth
              onClick={() => router.push('/donate')}
              sx={{
                py: 1.5,
                borderColor: PRIMARY_GOLD,
                color: PRIMARY_GOLD,
                fontWeight: 600,
                '&:hover': { 
                  borderColor: '#FFE066',
                  bgcolor: 'rgba(255, 215, 0, 0.08)'
                }
              }}
            >
              Make Another Donation
            </Button>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
}