// src/components/InjectedCards/NewsletterCard.tsx
import { Box, Typography, TextField } from '@mui/material';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import { useState, useEffect } from 'react';
import agent from '@/app/api/agent';
import { toast } from 'react-toastify';
import Image from 'next/image';
import useResponsive from '@/hooks/useResponsive';

interface NewsletterCardProps {
  variant?: 'default' | 'compact';
  onSubscribe?: (email: string) => void;
}

export function NewsletterCard({ variant = 'default', onSubscribe }: NewsletterCardProps) {
  const { isMdUp } = useResponsive();
  const [email, setEmail] = useState('');
  const [url, setUrl] = useState('');
  const [isHovered, setIsHovered] = useState(false);

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setUrl(window.location.href);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (onSubscribe) {
        onSubscribe(email);
      } else {
        await agent.Forms.subscribe({ email, form: 'newsletter card', url });
      }
      toast.success('Your email has been added to our list!');
    } catch {
      toast.error('Subscription failed');
    }
    setEmail('');
  };

  const primary = '#00A5E1';
  const gradient = 'linear-gradient(0deg, rgba(0, 165, 225, 0.10) 0%, rgba(0, 165, 225, 0.10) 100%), #121212';
  const chipBackground = 'rgba(0, 165, 225, 0.30)';
  const chipText = '#96D7FF';

  // Single section centered layout with form (mobile and desktop)
  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      onMouseEnter={() => isMdUp && setIsHovered(true)}
      onMouseLeave={() => isMdUp && setIsHovered(false)}
      sx={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 2,
        padding: 4,
        transition: 'box-shadow 0.15s ease-out',
        boxShadow: (isHovered && isMdUp) ? '0px 8px 24px rgba(0,0,0,0.3)' : 'none',
        height: '100%',
        position: 'relative',
        borderRadius: 3.5,
        overflow: 'hidden',
        background: gradient.replace('0.10', '0.05'),
        transform: 'translateZ(0)',
        willChange: isHovered ? 'box-shadow' : 'auto',
        textAlign: 'center',
        cursor: 'default',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(0deg, ${primary}13 0%, ${primary}13 100%)`,
          opacity: isHovered && isMdUp ? 1 : 0,
          transition: isMdUp ? 'opacity 0.15s ease-out' : 'none',
          pointerEvents: 'none',
          borderRadius: 3.5,
        },
      }}
    >
      {/* Icon with soft glow */}
      <Box sx={{ position: 'relative', width: 30, height: 30, zIndex: 1 }}>
        {/* Hover-activated glow effect */}
        <Box
          sx={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primary}99 0%, ${primary}4D 25%, ${primary}26 50%, transparent 70%)`,
            transform: `translate(-50%, -50%) scale(${isHovered && isMdUp ? 1 : 0})`,
            opacity: isHovered && isMdUp ? 0.5 : 0,
            transition: isMdUp ? 'transform 0.15s ease-out, opacity 0.15s ease-out' : 'none',
            pointerEvents: 'none',
            willChange: isMdUp ? 'transform, opacity' : 'auto',
            zIndex: -1,
            filter: 'blur(20px)',
          }}
        />
        {/* Larger outer glow layer */}
        <Box
          sx={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            width: '90px',
            height: '90px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primary}40 0%, ${primary}1F 25%, ${primary}0A 50%, transparent 70%)`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.4,
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(15px)',
          }}
        />
        {/* Medium dispersed gradient layer */}
        <Box
          sx={{
            position: 'absolute',
            top: '15px',
            left: '15px',
            width: '60px',
            height: '60px',
            borderRadius: '50%',
            background: `radial-gradient(circle, ${primary}60 0%, ${primary}30 35%, transparent 65%)`,
            transform: 'translate(-50%, -50%)',
            opacity: 0.45,
            pointerEvents: 'none',
            zIndex: 0,
            filter: 'blur(10px)',
          }}
        />
        <Box
          sx={{
            width: 30,
            height: 30,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Image
            src="/assets/images/marketing/subscriber-tier/subscriber-icon.webp"
            alt="Subscriber"
            width={30}
            height={30}
            style={{ display: 'block' }}
          />
        </Box>
      </Box>

      {/* Title */}
      <Typography
        component="h3"
        sx={{
          color: '#FFFAFA',
          fontSize: 20,
          fontWeight: 700,
          lineHeight: 1.4,
          zIndex: 1,
        }}
      >
        Join Our Newsletter
      </Typography>

      {/* Message */}
      <Typography
        sx={{
          color: 'rgba(255, 249.70, 249.70, 0.80)',
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.5,
          zIndex: 1,
        }}
      >
        Get curated content & updates
      </Typography>

      {/* Form */}
      {variant === 'default' && (
        <Box sx={{ position: 'relative', width: '85%', zIndex: 1 }}>
          <TextField
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={{
              width: '100%',
              '& .MuiInputBase-root': {
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 1.5,
                color: 'white',
                paddingRight: '50px',
                fontSize: '15px',
              },
              '& .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.1)',
              },
              '&:hover .MuiOutlinedInput-notchedOutline': {
                borderColor: 'rgba(255, 255, 255, 0.2)',
              },
              '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
                borderColor: chipText,
                borderWidth: '1px',
              },
            }}
            size="small"
          />
          <Box
            component="button"
            type="submit"
            disabled={!isValidEmail(email)}
            sx={{
              position: 'absolute',
              right: 6,
              top: '50%',
              transform: 'translateY(-50%)',
              width: 36,
              height: 36,
              background: isValidEmail(email)
                ? `linear-gradient(${chipBackground}, ${chipBackground}), #171717`
                : 'rgba(128, 128, 128, 0.15)',
              borderRadius: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: 'none',
              cursor: isValidEmail(email) ? 'pointer' : 'not-allowed',
              transition: isMdUp ? 'filter 0.15s ease, box-shadow 0.15s ease' : 'none',
              filter: 'brightness(1)',
              '&:hover': {
                filter: isValidEmail(email) && isMdUp ? 'brightness(1.3)' : 'brightness(1)',
                boxShadow: isValidEmail(email) && isMdUp ? `0 0 24px ${primary}40` : 'none',
              },
            }}
          >
            <ArrowForwardIcon
              sx={{
                fontSize: 18,
                color: isValidEmail(email) ? chipText : 'rgba(255, 255, 255, 0.3)',
              }}
            />
          </Box>
        </Box>
      )}
    </Box>
  );
}
