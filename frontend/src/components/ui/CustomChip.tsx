import React from 'react';
import { Box, Typography, BoxProps } from '@mui/material';

export interface CustomChipProps extends Omit<BoxProps, 'children'> {
  /**
   * Label text to display in the chip
   */
  label: string;
  /**
   * Background color of the chip
   */
  bgColor?: string;
  /**
   * Text color of the chip
   */
  textColor?: string;
  /**
   * Font size of the label
   */
  fontSize?: number | string;
  /**
   * Font weight of the label
   */
  fontWeight?: number | string;
  /**
   * Border radius of the chip
   */
  borderRadius?: number | string;
  /**
   * Padding of the chip
   */
  padding?: string;
  /**
   * Optional onClick handler
   */
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  /**
   * If true, adds hover styles
   */
  interactive?: boolean;
}

/**
 * A reusable custom chip component with flexible styling
 */
export const CustomChip: React.FC<CustomChipProps> = ({
  label,
  bgColor = 'rgba(39, 129, 255, 0.30)',
  textColor = '#96C2FF',
  fontSize = 12,
  fontWeight = 500,
  borderRadius = 1,
  padding = '2px 8px',
  onClick,
  interactive = false,
  sx,
  ...rest
}) => {
  return (
    <Box
      onClick={onClick}
      sx={{
        padding: padding,
        backgroundColor: bgColor,
        borderRadius: borderRadius,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: onClick || interactive ? 'pointer' : 'default',
        transition: 'background-color 0.2s ease, transform 0.2s ease',
        '&:hover': onClick || interactive ? {
          backgroundColor: `${bgColor}CC`, // Add some opacity to create a darker version
          transform: 'translateY(-1px)',
        } : {},
        ...sx
      }}
      {...rest}
    >
      <Typography
        sx={{
          color: textColor,
          fontSize: fontSize,
          fontWeight: fontWeight,
          lineHeight: 1.5,
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default CustomChip;
