'use client';

import BaseAd from './BaseAd';
import useResponsive from '@/hooks/useResponsive';

interface CommentaryStickySidebarAdProps {
  showPlaceholder?: boolean;
}

export default function CommentaryStickySidebarAd({
  showPlaceholder = process.env.NODE_ENV !== 'production',
}: CommentaryStickySidebarAdProps) {
  const { isMdDown } = useResponsive();

  if (isMdDown) {
    return null;
  }

  return (
    <BaseAd
      slotId="SIDEBAR_COMMENTARY_STICKY"
      width={300}
      height={600}
      deviceType="desktop"
      label="Sidebar Sticky"
      showPlaceholder={showPlaceholder}
      bare
      removeAdsTopOffset={-22}
    />
  );
}
