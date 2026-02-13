'use client';

import { forwardRef, ReactNode, MouseEvent } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { keyframes } from '@mui/material/styles';

const iconPulse = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.08); }
  100% { transform: scale(1); }
`;

export interface HeaderCtaButtonProps {
  label: string;
  icon: ReactNode;
  hoverIcon?: ReactNode;
  href?: string;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
  baseColor: string;
  hoverColor: string;
  textColor?: string;
  hoverTextColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  glowColor?: string;
  pulseIcon?: boolean;
  uppercaseLabel?: boolean;
  letterSpacing?: string | number;
  labelFontWeight?: number;
  labelFontSize?: number;
}

const HeaderCtaButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, HeaderCtaButtonProps>(
  (
    {
      label,
      icon,
      hoverIcon,
      href,
      onClick,
      size = 'medium',
      fullWidth = false,
      baseColor,
      hoverColor,
      textColor = 'rgba(255, 255, 255, 0.95)',
      hoverTextColor = '#0d0d0d',
      iconColor = textColor,
      hoverIconColor = hoverTextColor,
      glowColor = 'rgba(255, 255, 255, 0.45)',
      pulseIcon = false,
      uppercaseLabel = true,
      letterSpacing = '0.08em',
      labelFontWeight = 700,
      labelFontSize,
    },
    ref,
  ) => {
    const height = size === 'small' ? 38 : 46;
    const paddingX = size === 'small' ? 16 : 22;
    const computedFontSize = labelFontSize ?? (size === 'small' ? 12 : 13.5);

    const shouldUseLink = Boolean(href) && !onClick;
    const Component = shouldUseLink ? Link : Primitive.button;

    return (
      <Box
        component={Component as any}
        {...(shouldUseLink ? { href } : { type: 'button' })}
        ref={ref as any}
        onClick={onClick as any}
        sx={{
          position: 'relative',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.5rem',
          width: fullWidth ? '100%' : 'auto',
          height,
          px: `${paddingX}px`,
          borderRadius: '10px',
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          fontFamily: 'inherit',
          fontSize: computedFontSize,
          fontWeight: labelFontWeight,
          color: textColor,
          backgroundColor: baseColor,
          boxShadow: '0px 10px 26px rgba(0, 0, 0, 0.35)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.3s ease',
          zIndex: 1,
          WebkitTapHighlightColor: 'transparent',
          '& .cta-icon': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: iconColor,
            position: 'relative',
            transition: 'color 0.25s ease, transform 0.25s ease',
          },
          '& .cta-icon-default, & .cta-icon-hover': {
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'opacity 0.2s ease, transform 0.2s ease',
          },
          '& .cta-icon-hover': {
            position: 'absolute',
            opacity: 0,
            transform: 'scale(0.85)',
          },
          '& .cta-label': {
            color: textColor,
            transition: 'color 0.25s ease',
          },
          '&:hover': {
            backgroundColor: hoverColor,
            color: hoverTextColor,
            boxShadow: `0px 12px 38px ${glowColor}`,
            transform: 'translateY(-1px) scale(1.01)',
          },
          '&:hover .cta-icon': {
            color: hoverIconColor,
            animation: pulseIcon ? `${iconPulse} 0.9s ease-in-out infinite` : 'none',
          },
          '&:hover .cta-icon-default': {
            opacity: hoverIcon ? 0 : 1,
            transform: hoverIcon ? 'scale(0.75)' : 'scale(1.05)',
          },
          '&:hover .cta-icon-hover': {
            opacity: hoverIcon ? 1 : 0,
            transform: hoverIcon ? 'scale(1)' : 'scale(0.85)',
          },
          '@media (prefers-reduced-motion: reduce)': {
            transition: 'none',
            '&:hover .cta-icon': {
              animation: 'none',
            },
          },
          '&:hover .cta-label': {
            color: hoverTextColor,
          },
          '&:focus-visible': {
            boxShadow: `0 0 0 2px rgba(255, 255, 255, 0.6), 0px 14px 30px ${glowColor}`,
          },
          '&:active': {
            transform: 'scale(0.98)',
          },
        }}
      >
        <span className="cta-icon">
          <span className="cta-icon-default">{icon}</span>
          {hoverIcon && <span className="cta-icon-hover">{hoverIcon}</span>}
        </span>
        <Typography
          component="span"
          className="cta-label"
          sx={{
            fontWeight: labelFontWeight,
            fontSize: `${computedFontSize}px`,
            textTransform: uppercaseLabel ? 'uppercase' : 'none',
            letterSpacing: uppercaseLabel ? letterSpacing : 0,
          }}
        >
          {label}
        </Typography>
      </Box>
    );
  },
);

HeaderCtaButton.displayName = 'HeaderCtaButton';

export default HeaderCtaButton;
