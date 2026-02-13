'use client';

import { useState, useEffect } from 'react';
import { useUser, SignIn, SignUp } from '@clerk/nextjs';
import { usePremium } from '@/hooks/usePremium';
import { PricingTable } from '@clerk/nextjs';
import {
  Modal,
  Box,
  Tabs,
  Tab,
  Paper,
} from '@mui/material';

export default function PricingPage() {
  const { user, isLoaded } = useUser();
  const isPremium = usePremium();
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);

  useEffect(() => {
    if (isLoaded && !user) {
      setShowLoginModal(true);
    }
  }, [isLoaded, user]);

  if (!isLoaded) return null;

  if (!user) {
    return (
      <Modal open={showLoginModal} onClose={() => {}}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          sx={{
            height: '100vh',
            px: 2,
          }}
        >
          <Paper elevation={3} sx={{ width: '100%', maxWidth: 400, p: 3 }}>
            <Tabs
              value={tabIndex}
              onChange={(e, newIndex) => setTabIndex(newIndex)}
              centered
              sx={{ mb: 2 }}
            >
              <Tab label="Sign In" />
              <Tab label="Sign Up" />
            </Tabs>

            {tabIndex === 0 ? (
              <SignIn forceRedirectUrl="/pricing" />
            ) : (
              <SignUp forceRedirectUrl="/pricing" />
            )}
          </Paper>
        </Box>
      </Modal>
    );
  }

  if (user && isPremium) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h2>You’re a Premium subscriber 🎉</h2>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
      <PricingTable />
    </div>
  );
}
