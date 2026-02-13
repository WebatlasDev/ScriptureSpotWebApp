'use client';

import React from 'react';
import BaseAd from './BaseAd';
import { AD_CONFIG, type AdSlotId } from '@/config/adConfig';
import { useIsMdDown } from '@/hooks/useResponsive';

interface SkinnyHorizontalAdProps {
  slotId: AdSlotId;
  className?: string;
  style?: React.CSSProperties;
  showPlaceholder?: boolean;
}

export default function SkinnyHorizontalAd({ 
  slotId, 
  className = '',
  style = {},
  showPlaceholder = process.env.NODE_ENV !== 'production',
}: SkinnyHorizontalAdProps) {
  const isMdDown = useIsMdDown();
  
  // Get appropriate size based on screen size
  const [width, height] = isMdDown 
    ? AD_CONFIG.AD_SIZES.SKINNY_HORIZONTAL.mobile
    : AD_CONFIG.AD_SIZES.SKINNY_HORIZONTAL.desktop;
  
  const label = isMdDown ? 'Mobile Banner' : 'Leaderboard';

  return (
    <BaseAd
      slotId={slotId}
      width={width}
      height={height}
      deviceType={isMdDown ? 'mobile' : 'desktop'}
      label={label}
      className={className}
      style={{
        marginTop: '20px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        ...style,
      }}
      showPlaceholder={showPlaceholder}
    />
  );
}
