'use client';

import React from 'react';
import BaseAd from './BaseAd';
import { AD_CONFIG, type AdSlotId } from '@/config/adConfig';
import { getAdSize } from '@/utils/adUtils';
import useResponsive from '@/hooks/useResponsive';

interface ResponsiveAdProps {
  slotId: AdSlotId;
  placement?: 'content' | 'modal';
  className?: string;
  style?: React.CSSProperties;
  showPlaceholder?: boolean;
}

export default function ResponsiveAd({ 
  slotId,
  placement = 'content',
  className = '',
  style = {},
  showPlaceholder = process.env.NODE_ENV !== 'production',
}: ResponsiveAdProps) {
  const { isMdDown } = useResponsive();
  
  // Modal layouts are already constrained on mobile
  if (placement === 'modal' && isMdDown) {
    return null;
  }
  
  // Get appropriate size based on screen size
  const [width, height] = isMdDown 
    ? AD_CONFIG.AD_SIZES.RESPONSIVE_SQUARE.mobile
    : AD_CONFIG.AD_SIZES.RESPONSIVE_SQUARE.desktop;
  
  const label = placement === 'modal'
    ? 'Modal Ad (Desktop)'
    : isMdDown
      ? 'Square Ad (Mobile)'
      : 'Square Ad (Desktop)';

  return (
    <BaseAd
      slotId={slotId}
      width={width}
      height={height}
      deviceType={isMdDown ? 'mobile' : 'desktop'}
      label={label}
      className={className}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      showPlaceholder={showPlaceholder}
    />
  );
}
