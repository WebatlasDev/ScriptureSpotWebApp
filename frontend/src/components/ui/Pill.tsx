import React from 'react';
import { Box, Typography, type BoxProps } from '@mui/material';
import { textStyles } from '@/styles/textStyles';

export interface PillProps extends Omit<BoxProps, 'children'> {
  label: string;
}

const labelStyle = textStyles.label.medium.s;

const Pill = ({ label, sx, ...rest }: PillProps) => {
  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding:
          'var(--ss-spacing-semantic-inset-control-vertical-tight) var(--ss-spacing-semantic-inset-control-horizontal-tight)',
        backgroundColor: 'var(--ss-color-semantic-background-surface-secondary)',
        borderRadius: 'var(--ss-radius-semantic-control-medium)',
        ...sx,
      }}
      {...rest}
    >
      <Typography
        component="span"
        sx={{
          fontFamily: labelStyle.fontFamily,
          fontWeight: labelStyle.fontWeight,
          fontSize: labelStyle.fontSize,
          lineHeight: labelStyle.lineHeight,
          letterSpacing: labelStyle.letterSpacing ?? '0px',
          color: 'var(--ss-color-semantic-content-text-primary)',
          textAlign: 'center',
          whiteSpace: 'nowrap',
        }}
      >
        {label}
      </Typography>
    </Box>
  );
};

export default Pill;
