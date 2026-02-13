'use client';
import React from 'react';
import { FavoriteBorderRoundedIcon } from '@/components/ui/phosphor-icons';
import { FavoriteRoundedIcon } from '@/components/ui/phosphor-icons';
import HeaderCtaButton from './HeaderCtaButton';

interface SupportUsButtonProps {
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const SupportUsButton: React.FC<SupportUsButtonProps> = ({
  href = '/support',
  onClick,
  size = 'medium',
  fullWidth = false,
}) => {
  const iconSize = size === 'small' ? 20 : 22;

  return (
    <HeaderCtaButton
      label="Support Us"
      href={href}
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      icon={<FavoriteBorderRoundedIcon sx={{ fontSize: iconSize }} />}
      hoverIcon={<FavoriteRoundedIcon sx={{ fontSize: iconSize }} />}
      baseColor="rgba(255, 114, 198, 0.2)"
      hoverColor="rgba(255, 114, 198, 0.3)"
      textColor="#FFFFFF"
      hoverTextColor="#FFFFFF"
      iconColor="#FF72C6"
      hoverIconColor="#FF72C6"
      glowColor="transparent"
      uppercaseLabel={false}
      letterSpacing={0}
      labelFontWeight={600}
      labelFontSize={14}
      pulseIcon
    />
  );
};

export default SupportUsButton;
