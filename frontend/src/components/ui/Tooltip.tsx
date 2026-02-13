'use client';

import React from 'react';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { styled } from '@mui/material/styles';

// Styled components using MUI's styled API for consistency
const StyledContent = styled(TooltipPrimitive.Content, {
  shouldForwardProp: (prop) => prop !== 'maxWidth',
})<{ maxWidth?: string | number }>(({ theme, maxWidth }) => ({
  backgroundColor: '#0E0E0E',
  color: 'rgba(255, 255, 255, 0.95)',
  padding: '8px 12px',
  borderRadius: '8px',
  fontSize: '13px',
  fontWeight: 500,
  lineHeight: '18px',
  maxWidth: maxWidth || '250px',
  boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
  border: '1px solid rgba(255, 255, 255, 0.08)',
  zIndex: 9999,
  userSelect: 'none',
  animationDuration: '200ms',
  animationTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
  willChange: 'transform, opacity',
  '&[data-state="delayed-open"]': {
    animationName: 'fadeIn',
  },
  '&[data-state="closed"]': {
    animationName: 'fadeOut',
  },
  '@keyframes fadeIn': {
    from: {
      opacity: 0,
      transform: 'scale(0.96) translateY(-2px)',
    },
    to: {
      opacity: 1,
      transform: 'scale(1) translateY(0)',
    },
  },
  '@keyframes fadeOut': {
    from: {
      opacity: 1,
    },
    to: {
      opacity: 0,
    },
  },
}));

const StyledArrow = styled(TooltipPrimitive.Arrow)({
  fill: '#0E0E0E',
});

export interface TooltipProps {
  children: React.ReactElement;
  title: React.ReactNode;
  arrow?: boolean;
  placement?: 'top' | 'right' | 'bottom' | 'left';
  enterDelay?: number;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  maxWidth?: string | number;
}

export function Tooltip({
  children,
  title,
  arrow = false,
  placement = 'top',
  enterDelay = 200,
  open,
  onOpenChange,
  maxWidth,
}: TooltipProps) {
  if (!title) {
    return children;
  }

  return (
    <TooltipPrimitive.Root
      delayDuration={enterDelay}
      open={open}
      onOpenChange={onOpenChange}
    >
      <TooltipPrimitive.Trigger asChild>
        {children}
      </TooltipPrimitive.Trigger>
      <TooltipPrimitive.Portal>
        <StyledContent side={placement} sideOffset={5} maxWidth={maxWidth}>
          {title}
          {arrow && <StyledArrow />}
        </StyledContent>
      </TooltipPrimitive.Portal>
    </TooltipPrimitive.Root>
  );
}

// Provider component to wrap app
export const TooltipProvider = TooltipPrimitive.Provider;

export default Tooltip;
