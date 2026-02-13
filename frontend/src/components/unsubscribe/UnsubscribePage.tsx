"use client";

import { useState } from 'react';
import { Container, Typography, Box, TextField, Button } from '@mui/material';
import { toast } from 'react-toastify';
import agent from '@/app/api/agent';

export default function UnsubscribePage() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsSubmitting(true);
    try {
      await agent.Forms.unsubscribe({ email });
      toast.success('You have been unsubscribed.');
      setEmail('');
    } catch (err) {
      toast.error('There was an error unsubscribing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', py: 8 }}>
      <Container maxWidth="sm">
        <Box component="form" onSubmit={handleSubmit} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography
            variant="h1"
            sx={{ fontSize: { xs: '1.5rem', sm: '1.75rem' }, fontWeight: 300, color: 'text.primary' }}
          >
            Unsubscribe
          </Typography>
          <TextField
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Button type="submit" variant="contained" disabled={isSubmitting}>
            {isSubmitting ? 'Unsubscribing...' : 'Unsubscribe'}
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
