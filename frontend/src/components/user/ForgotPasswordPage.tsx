"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { 
  Box,
  Button,
  Paper,
  Stack,
  TextField,
  Typography
} from '@mui/material';
// Removed unused imports like Checkbox, FormControlLabel, IconButton, InputAdornment, Eye, EyeOff
import LogoImage from '../common/LogoImage';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(''); // For success/error messages

  const handleSendResetLink = async () => {
    setIsLoading(true);
    setMessage('');
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      if (email) { // Basic check
        setMessage('If an account exists for this email, a reset link has been sent.');
      } else {
        setMessage('Please enter your email address.');
      }
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendResetLink();
    }
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', lg: 'row' },
        position: 'relative',
        minHeight: '100vh', // Ensure it takes full height
        pt: { xs: 0, md: 0 }
      }}
    >
      {/* Left Side - Branding */}
      <Box 
        sx={{ 
          flex: 1,
          bgcolor: 'background.default',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          px: { xs: 4, lg: 8 },
          py: { xs: 4, lg: 0 }
        }}
      >
        <Box 
          sx={{ 
            maxWidth: 'md',
            mx: { xs: 'auto', lg: 0 },
            textAlign: 'left'
          }}
        >
          {/* Logo */}
          <Box 
            sx={{ 
              mb: 4,
              display: 'flex',
              justifyContent: 'flex-start'
            }}
          >
            <Link href={'/'}>
              <LogoImage height={40} />
            </Link>
          </Box>
          
          <Typography 
            variant="h2" 
            fontWeight="normal" 
            color="text.primary" 
            sx={{ mb: 2 }}
          >
            Forgot Password?
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            No problem! Enter your email below and we'll send you a link to reset it.
          </Typography>

          {/* Benefits List (Maintaining for consistency as requested) */}
          <Stack spacing={{ xs: 1.5, lg: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main', mt: 1, mr: 2, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">
                Bookmark your favorite content for further reading
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main', mt: 1, mr: 2, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">
                Get alerts on new Scripture Spot features
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
              <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'secondary.main', mt: 1, mr: 2, flexShrink: 0 }} />
              <Typography variant="body2" color="text.secondary">
                Support our mission to make in-depth bible study easy and exciting
              </Typography>
            </Box>
          </Stack>
        </Box>
      </Box>

      {/* Right Side - Form */}
      <Box 
        sx={{ 
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: 4,
          py: { xs: 4, lg: 6 }
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 480 }}>
          <Paper 
            elevation={3} 
            sx={{ 
              bgcolor: 'background.default', 
              borderRadius: 4,
              border: 1,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              p: { xs: 4, lg: 6 }
            }}
          >
            <Stack spacing={3}>
              <Typography variant="h5" fontWeight="medium" color="text.primary" sx={{ textAlign: 'center', mb: 1 }}>
                Reset Your Password
              </Typography>

              {message && (
                <Typography 
                  color={message.startsWith('Please enter') ? "error" : "text.secondary"} 
                  variant="body2" 
                  sx={{ textAlign: 'center'}}
                >
                  {message}
                </Typography>
              )}

              <Box>
                <Typography 
                  variant="caption" 
                  component="label" 
                  htmlFor="email" 
                  fontWeight="medium" 
                  sx={{ mb: 1, display: 'block' }}
                >
                  Email
                </Typography>
                <TextField
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  fullWidth
                  placeholder="Enter your email"
                  autoFocus
                  InputProps={{
                    sx: { 
                      py: 1,
                      bgcolor: 'background.paper',
                      '&:focus-within': {
                        borderColor: 'secondary.main'
                      }
                    }
                  }}
                />
              </Box>

              <Button
                onClick={handleSendResetLink}
                disabled={!email || isLoading}
                variant="contained"
                sx={{ 
                  py: 1.5,
                  bgcolor: 'secondary.main',
                  color: 'background.default',
                  '&:hover': {
                    bgcolor: 'secondary.light'
                  },
                  '&.Mui-disabled': {
                    bgcolor: 'rgba(255,255,255,0.1)'
                  }
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Box 
                      sx={{ 
                        animation: 'spin 1s linear infinite',
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        borderBottom: '2px solid currentColor',
                        mr: 1,
                        '@keyframes spin': {
                          '0%': { transform: 'rotate(0deg)' },
                          '100%': { transform: 'rotate(360deg)' }
                        }
                      }} 
                    />
                    Sending...
                  </Box>
                ) : (
                  'Send Reset Link'
                )}
              </Button>

              <Stack direction="column" spacing={1} sx={{ textAlign: 'center' }}>
                <Button 
                  component={Link}
                  href="/login"
                  variant="text" 
                  sx={{ 
                    color: 'secondary.main',
                    fontWeight: 'medium',
                    '&:hover': {
                      bgcolor: 'transparent',
                      color: 'secondary.light'
                    }
                  }}
                >
                  Back to Sign In
                </Button>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{' '}
                  <Button 
                    component={Link}
                    href="/signup"
                    variant="text" 
                    sx={{ 
                      padding: 0,
                      minWidth: 'auto',
                      color: 'secondary.main',
                      fontWeight: 'medium',
                      '&:hover': {
                        bgcolor: 'transparent',
                        color: 'secondary.light'
                      }
                    }}
                  >
                    Create Account
                  </Button>
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}
