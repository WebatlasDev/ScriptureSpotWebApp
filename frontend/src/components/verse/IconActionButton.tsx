'use client';

import { forwardRef, useMemo } from 'react';
import type { CSSProperties } from 'react';
import Link from 'next/link';
import { Box, Typography, CircularProgress } from '@mui/material';
import { Primitive } from '@radix-ui/react-primitive';
import { Tooltip } from '@/components/ui';

type GlowStyleVariables = (CSSProperties & Record<string, string>) | undefined;

export interface IconActionButtonProps {
  label: string;
  icon?: React.ReactNode;
  hoverIcon?: React.ReactNode;
  hoverColor: string;
  onClick?: (event: React.MouseEvent<HTMLElement>) => void;
  href?: string;
  tooltip?: string;
  tooltipPlacement?: 'top' | 'bottom' | 'left' | 'right';
  active?: boolean;
  disabled?: boolean;
  baseColor?: string;
  iconColor?: string;
  hoverIconColor?: string;
  text?: string;
  textColor?: string;
  onMouseEnter?: (event: React.MouseEvent<HTMLElement>) => void;
  onMouseLeave?: (event: React.MouseEvent<HTMLElement>) => void;
  glowColor?: string;
  loading?: boolean;
  height?: number;
}

const DEFAULT_BASE_COLOR = 'rgba(255, 255, 255, 0.10)';
const DEFAULT_ICON_COLOR = 'rgba(255, 255, 255, 0.70)';
const DEFAULT_HOVER_ICON_COLOR = 'rgba(255, 255, 255, 1.0)';
const DEFAULT_HEIGHT = 36;

const GLOW_PSEUDO_STYLES = {
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 'inherit',
    zIndex: -1,
    pointerEvents: 'none',
    transition: 'box-shadow 0.65s ease-in-out',
    boxShadow: 'none',
  },
  '&:hover::before': {
    boxShadow: 'var(--icon-button-glow-shadow-hover, none)',
    willChange: 'var(--icon-button-glow-will-change, auto)',
  },
} as const;

const IconActionButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, IconActionButtonProps>(
  (
    {
      label,
      icon,
      hoverIcon,
      hoverColor,
      onClick,
      href,
      tooltip,
      tooltipPlacement = 'top',
      active = false,
      disabled = false,
      baseColor,
      iconColor,
      hoverIconColor,
      text,
      textColor = 'rgba(255, 255, 255, 0.90)',
      onMouseEnter,
      onMouseLeave,
      glowColor,
      loading = false,
      height = DEFAULT_HEIGHT,
    },
    ref,
  ) => {
    const isLoading = Boolean(loading);
    const isDisabled = disabled || isLoading;
    const shouldUseLink = Boolean(href) && !isDisabled;
    const Component = shouldUseLink ? Link : Primitive.button;
    const isButton = !shouldUseLink;

    const resolvedBaseColor = baseColor ?? DEFAULT_BASE_COLOR;
    const resolvedIconColor = active ? (hoverIconColor ?? DEFAULT_HOVER_ICON_COLOR) : (iconColor ?? DEFAULT_ICON_COLOR);
    const resolvedHoverIconColor = hoverIconColor ?? DEFAULT_HOVER_ICON_COLOR;
    const spinnerColor = active ? resolvedHoverIconColor : resolvedIconColor;
    const shouldSwapIcon = Boolean(hoverIcon) && !isLoading;

    const glowStyleVariables: GlowStyleVariables = useMemo(() => {
      if (!glowColor || isDisabled) {
        return undefined;
      }
      const hoverShadow = `0px 4px 60px 30px ${glowColor}`;
      return {
        '--icon-button-glow-shadow-hover': hoverShadow,
        '--icon-button-glow-will-change': 'box-shadow',
      };
    }, [glowColor, isDisabled]);

    const renderedIcon = isLoading ? (
      <CircularProgress size={text ? 16 : 20} thickness={4} sx={{ color: spinnerColor }} />
    ) : (
      icon
    );

    const content = (
      <Box
        component={Component as any}
        {...(shouldUseLink ? { href } : {})}
        type={isButton ? 'button' : undefined}
        disabled={isButton ? isDisabled : undefined}
        onClick={(event: React.MouseEvent<HTMLElement>) => {
          if (isDisabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClick?.(event);
        }}
        onMouseEnter={onMouseEnter as any}
        onMouseLeave={onMouseLeave as any}
        ref={ref as any}
        aria-label={label}
        aria-disabled={isDisabled ? 'true' : undefined}
        aria-busy={isLoading ? 'true' : undefined}
        style={glowStyleVariables}
        sx={{
          height,
          borderRadius: '10px',
          backgroundColor: active ? hoverColor : resolvedBaseColor,
          color: resolvedIconColor,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: text ? '6px' : 0,
          pl: text ? '10px' : 0,
          pr: text ? '12px' : 0,
          minWidth: text ? 0 : height,
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          transition: 'background-color 0.25s ease, color 0.25s ease, transform 0.25s ease, box-shadow 0.45s ease',
          position: 'relative',
          pointerEvents: isDisabled ? 'none' : 'auto',
          zIndex: 2,
          touchAction: 'manipulation',
          WebkitTapHighlightColor: 'transparent',
          ...GLOW_PSEUDO_STYLES,
          '& .button-text': {
            color: active ? 'rgba(255, 255, 255, 1.0)' : textColor,
          },
          '&:hover .button-text': {
            color: 'rgba(255, 255, 255, 1.0)',
          },
          '&:hover': !isDisabled ? {
            backgroundColor: hoverColor,
            color: resolvedHoverIconColor,
          } : {},
          ...(shouldSwapIcon
            ? {
                '&:hover .icon-default': {
                  opacity: 0,
                  transform: 'scale(0.78)',
                },
                '&:hover .icon-hover': {
                  opacity: 1,
                  transform: 'scale(1)',
                },
              }
            : {}),
          '&:focus-visible': {
            outline: '2px solid rgba(255, 255, 255, 0.35)',
            outlineOffset: 2,
          },
          '&:active': {
            transform: isDisabled ? 'none' : `scale(${text ? 0.96 : 0.92})`,
          },
        }}
      >
        {shouldSwapIcon ? (
          <Box
            className="icon-wrapper"
            sx={{ position: 'relative', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
          >
            <Box
              className="icon-default"
              sx={{ transition: 'opacity 0.2s ease, transform 0.2s ease' }}
            >
              {renderedIcon}
            </Box>
            <Box
              className="icon-hover"
              sx={{
                position: 'absolute',
                opacity: 0,
                transform: 'scale(0.85)',
                transition: 'opacity 0.2s ease, transform 0.2s ease',
              }}
            >
              {hoverIcon}
            </Box>
          </Box>
        ) : (
          renderedIcon
        )}
        {text && (
          <Typography
            component="span"
            className="button-text"
            sx={{ fontSize: 14, fontWeight: 500, lineHeight: 1, whiteSpace: 'nowrap' }}
          >
            {text}
          </Typography>
        )}
      </Box>
    );

    if (tooltip) {
      return (
        <Tooltip title={tooltip} arrow enterDelay={300} placement={tooltipPlacement}>
          {content}
        </Tooltip>
      );
    }

    return content;
  },
);

IconActionButton.displayName = 'IconActionButton';

export default IconActionButton;
