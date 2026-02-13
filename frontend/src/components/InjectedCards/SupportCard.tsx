// src/components/InjectedCards/SupportCard.tsx
import { Box, Typography } from '@mui/material';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import useResponsive from '@/hooks/useResponsive';
import { useState } from 'react';

interface SupportCardProps {
  variant?: 'default' | 'urgent' | 'minimal';
  onAction?: () => void;
}

export function SupportCard({ variant = 'default', onAction }: SupportCardProps) {
  const { isMdUp } = useResponsive();
  const [isHovered, setIsHovered] = useState(false);

  const getContent = () => {
    switch (variant) {
      case 'urgent':
        return {
          title: "Support Our Work",
          message: "Your support helps us maintain this resource for everyone",
          iconSrc: '/assets/images/marketing/supporter-tier/Supporter-icon.webp',
          iconAlt: 'Supporter',
          primary: '#CF01B7',
          outline: 'rgba(207, 1, 183, 0.20)',
          gradient: 'linear-gradient(0deg, rgba(207, 1, 183, 0.10) 0%, rgba(207, 1, 183, 0.10) 100%), #121212',
          chipBackground: 'rgba(207, 1, 183, 0.30)',
          chipText: '#FF96F5',
        };
      case 'minimal':
        return {
          title: "Go Premium",
          message: "Consider supporting our work",
          iconSrc: '/assets/images/marketing/premium-subscription-tier/Premium-icon.webp',
          iconAlt: 'Premium',
          primary: '#F3D67F',
          outline: 'rgba(243, 214, 127, 0.20)',
          gradient: 'linear-gradient(0deg, rgba(243, 214, 127, 0.10) 0%, rgba(243, 214, 127, 0.10) 100%), #121212',
          chipBackground: 'rgba(243, 214, 127, 0.30)',
          chipText: '#F3D67F',
        };
      default:
        return {
          title: "Go Ad-Free",
          message: "Go ad-free and create your own bookmark library",
          iconSrc: '/assets/images/marketing/premium-subscription-tier/Premium-icon.webp',
          iconAlt: 'Premium',
          primary: '#F3D67F',
          outline: 'rgba(243, 214, 127, 0.20)',
          gradient: 'linear-gradient(0deg, rgba(243, 214, 127, 0.10) 0%, rgba(243, 214, 127, 0.10) 100%), #121212',
          chipBackground: 'rgba(243, 214, 127, 0.30)',
          chipText: '#F3D67F',
        };
    }
  };

  const content = getContent();

  // Single section centered layout (mobile and desktop)
  return (
    <Box
      onClick={onAction}
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
        transition: 'box-shadow 0.15s ease-out, transform 0.1s ease-out',
        boxShadow: (isHovered && isMdUp) ? '0px 8px 24px rgba(0,0,0,0.3)' : 'none',
        height: '100%',
        cursor: 'pointer',
        '& *': {
          cursor: 'pointer !important',
        },
        position: 'relative',
        borderRadius: 3.5,
        overflow: 'hidden',
        background: content.gradient.replace('0.10', '0.05'),
        transform: 'translateZ(0)',
        willChange: isHovered ? 'box-shadow' : 'auto',
        textAlign: 'center',
        '&:active': {
          transform: 'scale(0.98) translateZ(0)',
        },
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(0deg, ${content.primary}13 0%, ${content.primary}13 100%)`,
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
            background: `radial-gradient(circle, ${content.primary}99 0%, ${content.primary}4D 25%, ${content.primary}26 50%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${content.primary}40 0%, ${content.primary}1F 25%, ${content.primary}0A 50%, transparent 70%)`,
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
            background: `radial-gradient(circle, ${content.primary}60 0%, ${content.primary}30 35%, transparent 65%)`,
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
            src={content.iconSrc}
            alt={content.iconAlt}
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
        {content.title}
      </Typography>

      {/* Message */}
      <Typography
        sx={{
          color: 'rgba(255, 249.70, 249.70, 0.80)',
          fontSize: 15,
          fontWeight: 400,
          lineHeight: 1.5,
          maxWidth: '85%',
          zIndex: 1,
        }}
      >
        {content.message}
      </Typography>

      {/* Arrow (static on mobile, animated on desktop hover) */}
      <Box
        sx={{
          height: isMdUp ? (isHovered ? '20px' : 0) : '20px',
          overflow: 'visible',
          transition: isMdUp ? 'height 0.6s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <ArrowForwardIcon
          sx={{
            fontSize: 20,
            color: content.chipText,
            zIndex: 1,
            opacity: isMdUp ? (isHovered ? 1 : 0) : 1,
            transform: isMdUp ? (isHovered ? 'scale(1) translateY(0)' : 'scale(0.8) translateY(-4px)') : 'scale(1) translateY(0)',
            transition: isMdUp ? 'opacity 0.6s cubic-bezier(0.15, 0.85, 0.25, 1), transform 0.6s cubic-bezier(0.15, 0.85, 0.25, 1)' : 'none',
          }}
        />
      </Box>
    </Box>
  );
}
