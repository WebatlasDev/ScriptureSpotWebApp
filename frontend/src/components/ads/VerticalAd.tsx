'use client';

import React from 'react';
import BaseAd from './BaseAd';
import { AD_CONFIG, type AdSlotId } from '@/config/adConfig';
import useResponsive from '@/hooks/useResponsive';

interface VerticalAdProps {
  slotId: AdSlotId;
  placement?: 'sidebar' | 'modal';
  className?: string;
  style?: React.CSSProperties;
  showPlaceholder?: boolean;
}

export default function VerticalAd({ 
  slotId, 
  placement = 'sidebar',
  className = '',
  style = {},
  showPlaceholder = process.env.NODE_ENV !== 'production',
}: VerticalAdProps) {
  const { isMdDown } = useResponsive();
  const deviceType = isMdDown ? 'mobile' : 'desktop';
  
  // Don't show modal vertical ads on mobile
  if (placement === 'modal' && isMdDown) {
    return null;
  }
  
  // Get appropriate size based on placement and screen size
  let width: number, height: number, label: string;
  
  if (placement === 'sidebar') {
    [width, height] = isMdDown 
      ? AD_CONFIG.AD_SIZES.SIDEBAR_VERTICAL.mobile
      : AD_CONFIG.AD_SIZES.SIDEBAR_VERTICAL.desktop;
    label = 'Skyscraper';
  } else {
    // Modal placement - desktop only
    [width, height] = AD_CONFIG.AD_SIZES.MODAL_VERTICAL.desktop;
    label = 'Wide Skyscraper';
  }

  return (
    <BaseAd
      slotId={slotId}
      width={width}
      height={height}
      deviceType={deviceType}
      label={label}
      className={className}
      style={{
        margin: placement === 'modal' ? '0' : '0 auto',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      showPlaceholder={showPlaceholder}
    />
  );
}
