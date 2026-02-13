'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Box, Typography, Link } from '@mui/material';
import { AD_CONFIG, type AdSlotId, type DeviceScopedAdSlot } from '@/config/adConfig';
import { usePremium } from '@/hooks/usePremium';

interface BaseAdProps {
  slotId: AdSlotId;
  width: number;
  height: number;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
  showPlaceholder?: boolean; // For development/testing
  deviceType?: 'mobile' | 'desktop';
  bare?: boolean;
  removeAdsTopOffset?: number;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

type DeviceType = 'mobile' | 'desktop';

const resolveAdSlotId = (slotConfig: DeviceScopedAdSlot, deviceType: DeviceType): string | undefined => {
  const scopedSlot: DeviceScopedAdSlot = slotConfig;
  const { desktop, mobile, default: defaultSlot } = scopedSlot;

  if (deviceType === 'mobile') {
    return mobile ?? defaultSlot ?? desktop;
  }

  return desktop ?? defaultSlot ?? mobile;
};

export default function BaseAd({
  slotId,
  width,
  height,
  label = 'Advertisement',
  className = '',
  style = {},
  showPlaceholder = process.env.NODE_ENV !== 'production', // Show placeholders by default only in non-production envs
  deviceType = 'desktop',
  bare = false,
  removeAdsTopOffset,
}: BaseAdProps) {
  const adRef = useRef<HTMLDivElement>(null);
  const slotConfig = AD_CONFIG.AD_SLOTS[slotId] as DeviceScopedAdSlot | undefined;
  const adSlotId = slotConfig ? resolveAdSlotId(slotConfig, deviceType) : undefined;
  const isPremium = usePremium();
  const [locationKey, setLocationKey] = useState('');
  const locationKeyRef = useRef('');

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const buildLocationKey = () => {
      const { pathname, search, hash } = window.location;
      return `${pathname}${search}${hash}`;
    };

    const scheduleUpdate = (nextKey: string) => {
      queueMicrotask(() => {
        setLocationKey(prevKey => (prevKey !== nextKey ? nextKey : prevKey));
      });
    };

    const updateLocationKey = () => {
      const nextKey = buildLocationKey();
      if (locationKeyRef.current === nextKey) {
        return;
      }
      locationKeyRef.current = nextKey;
      scheduleUpdate(nextKey);
    };

    updateLocationKey();

    window.addEventListener('ads:locationchange', updateLocationKey);

    return () => {
      window.removeEventListener('ads:locationchange', updateLocationKey);
    };
  }, []);

  useEffect(() => {
    if (
      showPlaceholder ||
      typeof window === 'undefined' ||
      !adSlotId
    ) {
      return;
    }

    const adElement = adRef.current?.querySelector<HTMLModElement>('ins.adsbygoogle');
    if (!adElement) {
      return;
    }

    // Reset AdSense metadata so the SDK treats this slot as fresh content
    adElement.removeAttribute('data-ad-status');

    try {
      const adsQueue = (window.adsbygoogle = window.adsbygoogle || []);
      adsQueue.push({});
    } catch {
    }
  }, [showPlaceholder, locationKey, adSlotId]);


  // added in functionality to hide ad placements side wide for now
  if (isPremium) {
    return null;
  }

  const baseContainerStyle = bare
    ? {
        position: 'relative' as const,
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
        maxWidth: `${width}px`,
        padding: 0,
        border: 'none',
        background: 'transparent',
        borderRadius: 0,
        minHeight: `${height}px`,
      }
    : {
        position: 'relative' as const,
        border: '2px solid rgba(255, 255, 255, 0.1)',
        borderRadius: 3.5,
        padding: 3,
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(255, 255, 255, 0.01)',
        backdropFilter: 'blur(20px)',
        justifyContent: 'center',
        width: '100%',
        minHeight: `${height + 16}px`,
      };

  const containerStyle = {
    ...baseContainerStyle,
    ...style,
  };

  const removeAdsStyle = {
    position: 'absolute' as const,
    top: `${removeAdsTopOffset ?? -8}px`,
    right: bare ? 0 : '16px',
    background: '#1A1A1A',
    borderRadius: 1,
    padding: '0 8px',
    fontSize: '10px',
    color: 'rgba(255, 255, 255, 0.6)',
    textDecoration: 'none',
    fontWeight: 500,
    letterSpacing: '0.5px',
    textTransform: 'uppercase' as const,
    transition: 'all 0.2s ease',
    lineHeight: '16px',
    '&:hover': {
      color: 'rgba(255, 255, 255, 0.9)',
    },
  };

  if (!adSlotId) {
    if (process.env.NODE_ENV !== 'production') {
      console.warn(`Unknown AdSense slot id "${slotId}" - check AD_CONFIG.AD_SLOTS`);
    }
  }

  // return (
    // <Box sx={containerStyle} className={className}>
    //   {/* Remove Ads Link - Positioned inline with border */}
    //   <Link
    //     href={AD_CONFIG.SUPPORT_URL}
    //     sx={removeAdsStyle}
    //     target="_blank"
    //     rel="noopener noreferrer"
    //   >
    //     Remove ads
    //   </Link>
      
    //   {/* Ad Content */}
    //   <Box
    //     ref={adRef}
    //     sx={{
    //       width: `${width}px`,
    //       height: `${height}px`,
    //       display: 'flex',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       overflow: 'hidden',
    //       position: 'relative',
    //       zIndex: 1,
    //     }}
    //   >
    //     {showPlaceholder ? (
    //       /* Development Placeholder */
    //       <Box
    //         sx={{
    //           width: '100%',
    //           height: '100%',
    //           backgroundColor: '#f0f0f0',
    //           border: '1px dashed #ccc',
    //           display: 'flex',
    //           flexDirection: 'column',
    //           alignItems: 'center',
    //           justifyContent: 'center',
    //           fontSize: '14px',
    //           color: '#666',
    //           fontFamily: 'Arial, sans-serif',
    //         }}
    //       >
    //         <Typography variant="body2" sx={{ color: '#666', fontWeight: 'bold' }}>
    //           {label}
    //         </Typography>
    //         <Typography variant="caption" sx={{ color: '#888' }}>
    //           {width} × {height}
    //         </Typography>
    //       </Box>
    //     ) : (
    //       /* Actual AdSense Ad */
    //       <ins
    //         key={`${slotId}-${adSlotId}-${locationKey}`}
    //         className="adsbygoogle"
    //         style={{
    //           display: 'inline-block',
    //           width: `${width}px`,
    //           height: `${height}px`,
    //         }}
    //         data-ad-client={AD_CONFIG.PUBLISHER_ID}
    //         data-ad-slot={adSlotId}
    //       />
    //     )}
    //   </Box>      
    // </Box>
  // );
}
