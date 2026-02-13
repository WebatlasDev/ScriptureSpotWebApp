'use client';

import React from 'react';
import HeaderCtaButton from './HeaderCtaButton';

const PremiumCrownIcon = ({ size = 20 }: { size?: number }) => (
  <svg
    width={size}
    height={Math.round((size * 15) / 21)}
    viewBox="0 0 21 15"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20.717 6.55363L18.8805 13.4074C18.6463 14.2817 17.8539 14.8897 16.9487 14.8897H4.01799C3.11278 14.8897 2.32043 14.2817 2.08614 13.4074L0.24969 6.55363C-0.211477 4.83254 1.63845 3.41304 3.18154 4.30394L5.9282 5.88973L8.75129 1C9.52109 -0.333333 11.4456 -0.333332 12.2154 1L15.0385 5.88973L17.7851 4.30394C19.3282 3.41304 21.1782 4.83254 20.717 6.55363Z"
      fill="currentColor"
    />
  </svg>
);

interface GoPremiumButtonProps {
  href?: string;
  onClick?: () => void;
  size?: 'small' | 'medium';
  fullWidth?: boolean;
}

const GoPremiumButton: React.FC<GoPremiumButtonProps> = ({ 
  href = '/support',
  onClick,
  size = 'medium',
  fullWidth = false
}) => {
  return (
    <HeaderCtaButton
      label="Go Premium"
      href={href}
      onClick={onClick}
      size={size}
      fullWidth={fullWidth}
      icon={<PremiumCrownIcon size={size === 'small' ? 18 : 22} />}
      baseColor="rgba(243, 209, 41, 0.2)"
      hoverColor="rgba(243, 209, 41, 0.3)"
      textColor="#FFFFFF"
      hoverTextColor="#FFFFFF"
      iconColor="#F3D129"
      hoverIconColor="#F3D129"
      glowColor="transparent"
      uppercaseLabel={false}
      letterSpacing={0}
      labelFontWeight={600}
      labelFontSize={14}
      pulseIcon
    />
  );
};

export default GoPremiumButton;
