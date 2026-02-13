'use client';

import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  IconButton,
  Link as MuiLink,
  Divider,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  Email,
} from '@/components/ui/phosphor-icons';
import Link from 'next/link';
import agent from '@/app/api/agent';
import { toast } from 'react-toastify';
import LogoImage from '../common/LogoImage';

const Footer = () => {
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
  if (typeof window !== 'undefined') {
    setUrl(window.location.href);
  }
}, []);


  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await agent.Forms.subscribe({
        email,
        form: "footer subscribe form",
        url,
      });
      toast.success('Your email has been added to our list!');
    } catch {
      toast.error('Failed to subscribe. Please try again later.');
    }
    setEmail('');
  };

  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'background.paper',
        mt: 'auto',
        pt: { xs: 4, md: 6 },
        pb: { xs: 2, md: 3 },
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Logo and Description Column */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ mb: 2 }}>
                <Link href="/" style={{ display: 'block' }}>
                  <LogoImage height={30} />
                </Link>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  mb: 3,
                  lineHeight: 1.6,
                }}
              >
                Your trusted companion for deep Scripture study with expert commentaries and spiritual insights.
              </Typography>
              
              {/* Social Media Icons */}
              <Box sx={{ display: 'flex', gap: 1, mt: 1.5 }}>
                <IconButton
                  component="a"
                  href="#"
                  aria-label="Facebook"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <Facebook />
                </IconButton>
                <IconButton
                  component="a"
                  href="#"
                  aria-label="Twitter"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <Twitter />
                </IconButton>
                <IconButton
                  component="a"
                  href="#"
                  aria-label="Instagram"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <Instagram />
                </IconButton>
                <IconButton
                  component="a"
                  href="#"
                  aria-label="YouTube"
                  sx={{
                    color: 'text.secondary',
                    '&:hover': { color: 'secondary.main' },
                  }}
                >
                  <YouTube />
                </IconButton>
              </Box>
            </Box>
          </Grid>

          {/* Navigation Links Column */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 2,
                fontSize: '16px',
              }}
            >
              Explore
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink
                component={Link}
                href="/"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Bible
              </MuiLink>
              <MuiLink
                component={Link}
                href="/commentators"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Commentators
              </MuiLink>
              <MuiLink
                component={Link}
                href="/study-plans"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Study Plans
              </MuiLink>
              <MuiLink
                component={Link}
                href="/hymns"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Hymns
              </MuiLink>
            </Box>
          </Grid>

          {/* Additional Links Column */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 2,
                fontSize: '16px',
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <MuiLink
                component={Link}
                href="/about"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                About
              </MuiLink>
              <MuiLink
                component={Link}
                href="/contact"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Contact
              </MuiLink>
              <MuiLink
                component={Link}
                href="/privacy"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Privacy Policy
              </MuiLink>
              <MuiLink
                component={Link}
                href="/terms"
                sx={{
                  color: 'text.secondary',
                  textDecoration: 'none',
                  fontSize: '14px',
                  '&:hover': {
                    color: 'secondary.main',
                  },
                }}
              >
                Terms of Service
              </MuiLink>
            </Box>
          </Grid>

          {/* Newsletter Signup Column */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h6"
              sx={{
                color: 'text.primary',
                fontWeight: 600,
                mb: 2,
                fontSize: '16px',
              }}
            >
              Stay Connected
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                mb: 2,
                fontSize: '14px',
                lineHeight: 1.5,
              }}
            >
              Get daily devotionals and study insights delivered to your inbox.
            </Typography>
            <Box
              component="form"
              onSubmit={handleNewsletterSubmit}
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 1.5 }}
            >
              <TextField
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                size="small"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    fontSize: '14px',
                    borderRadius: 2,
                    bgcolor: 'background.default',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                    },
                    '&:hover fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'secondary.main',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'text.primary',
                    '&::placeholder': {
                      color: 'text.secondary',
                      opacity: 1,
                    },
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                startIcon={<Email />}
                sx={{
                  bgcolor: 'secondary.main',
                  color: 'background.default',
                  fontWeight: 600,
                  fontSize: '14px',
                  '&:hover': {
                    bgcolor: 'secondary.dark',
                  },
                }}
              >
                Subscribe
              </Button>
            </Box>
          </Grid>
        </Grid>

        {/* Copyright Section */}
        <Divider
          sx={{
            my: 4,
            borderColor: 'rgba(255, 255, 255, 0.1)',
          }}
        />
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: { xs: 'flex-start', sm: 'center' },
            gap: 2,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '12px',
            }}
          >
            © {new Date().getFullYear()} Scripture Spot. All rights reserved.
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: 'text.secondary',
              fontSize: '12px',
            }}
          >
            Made for the edification of the Saints (Eph. 4:11-12)
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};export default Footer;