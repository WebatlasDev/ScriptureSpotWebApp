'use client';

import React, { useState } from 'react';
import { Button, ButtonProps, SxProps, Theme } from '@mui/material';
import { ArrowForwardIcon } from '@/components/ui/phosphor-icons';

export interface ReadMoreButtonProps extends Omit<ButtonProps, 'color'> {
  /**
   * Text to display in the button
   */
  text?: string;
  /**
   * Background color of the button
   */
  bgColor?: string;
  /**
   * Text color of the button
   */
  textColor?: string;
  /**
   * Whether to show the arrow icon
   */
  showArrow?: boolean;
  /**
   * Whether to animate the arrow on hover
   */
  animateArrow?: boolean;
  /**
   * Border radius of the button
   */
  borderRadius?: number | string;
  /**
   * Font size of the text
   */
  fontSize?: number | string;
  /**
   * Font weight of the text
   */
  fontWeight?: number | string;
  /**
   * Letter spacing of the text
   */
  letterSpacing?: number | string;
  /**
   * Additional styles for the icon
   */
  iconSx?: SxProps<Theme>;
  /**
   * Size of the arrow icon
   */
  iconSize?: number | string;
  /**
   * Callback when the button is clicked
   */
  onReadMore?: () => void;
}

/**
 * A reusable read more button component with arrow animation
 */
export const ReadMoreButton: React.FC<ReadMoreButtonProps> = ({
  text = 'READ',
  bgColor = 'rgba(255, 255, 255, 0.10)',
  textColor = 'white',
  showArrow = true,
  animateArrow = true,
  borderRadius = 4.5,
  fontSize = 12,
  fontWeight = 700,
  letterSpacing = 0.8,
  iconSx,
  iconSize = 14,
  onReadMore,
  sx,
  onClick,
  ...rest
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // Call the onReadMore callback if provided
    if (onReadMore) {
      onReadMore();
    }
    
    // Call the original onClick if provided
    if (onClick) {
      onClick(e);
    }
  };
  
  return (
    <Button
      variant="text"
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      sx={{
        background: bgColor,
        color: textColor,
        borderRadius: borderRadius,
        padding: '6px 16px',
        fontSize: fontSize,
        letterSpacing: letterSpacing,
        fontWeight: fontWeight,
        textTransform: 'none',
        '&:hover': {
          background: `${bgColor}DD`, // Slightly darker on hover
        },
        transition: 'background 0.4s ease-out',
        ...sx
      }}
      {...rest}
    >
      {text}
      {showArrow && (
        <ArrowForwardIcon sx={{
          fontSize: iconSize,
          ml: 0.5,
          transition: animateArrow ? 'transform 0.4s ease-out' : 'none',
          transform: animateArrow && isHovered ? 'translateX(3px)' : 'translateX(0)',
          ...iconSx
        }} />
      )}
    </Button>
  );
};

export default ReadMoreButton;
