'use client';

import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, MouseEvent, ReactNode } from 'react';
import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import type { SxProps, Theme } from '@mui/material/styles';
import { Primitive } from '@radix-ui/react-primitive';
import { textStyles } from '@/styles/textStyles';

type ButtonSize = 'medium' | 'large';
type ButtonVariant = 'primary' | 'secondary';

const SIZE_STYLES = {
  medium: {
    borderRadius: 'var(--ss-radius-semantic-control-large)',
    paddingX: 'var(--ss-spacing-base-15)',
    paddingY: 'var(--ss-spacing-base-1)',
    gap: 'var(--ss-spacing-base-1)',
    fontSize: 'var(--ss-typography-semantic-size-l)',
    lineHeight: 'var(--ss-typography-semantic-line-height-m)',
    fontWeight: 500,
    letterSpacing: '0px',
    minHeight: 36,
    height: 36,
    iconSize: 18,
    iconOnlySize: 36,
    iconOnlyIconSize: 18,
  },
  large: {
    borderRadius: 'var(--ss-radius-semantic-control-full)',
    paddingX: 'var(--ss-spacing-base-3)',
    paddingY: 0,
    gap: 'var(--ss-spacing-base-1)',
    fontSize: textStyles.label.semiBold.xl.fontSize,
    lineHeight: textStyles.label.semiBold.xl.lineHeight,
    fontWeight: textStyles.label.semiBold.xl.fontWeight,
    letterSpacing: textStyles.label.semiBold.xl.letterSpacing ?? '0px',
    minHeight: 42,
    height: 42,
    iconSize: 20,
    iconOnlySize: 42,
    iconOnlyIconSize: 18,
  },
} as const;

const VARIANT_STYLES = {
  primary: {
    background: 'var(--ss-color-semantic-action-primary-surface, #FFD700)',
    hover: 'var(--ss-color-semantic-action-primary-hover, #FFE97A)',
    active: 'var(--ss-color-semantic-action-primary-active, #E6C200)',
    border: 'var(--ss-color-semantic-action-primary-border, #FFE97A)',
    text: 'var(--ss-color-semantic-action-primary-text, #0E0D0B)',
    icon: 'var(--ss-color-semantic-action-primary-text, #0E0D0B)',
    disabledBackground: 'var(--ss-color-semantic-action-primary-disabled-surface, #8C7700)',
    disabledText: 'var(--ss-color-semantic-action-primary-disabled-text, #0E0D0B)',
    disabledIcon: 'var(--ss-color-semantic-action-primary-disabled-icon, #0E0D0B)',
  },
  secondary: {
    background: 'var(--ss-color-semantic-action-secondary-surface, #312F2E)',
    hover: 'var(--ss-color-semantic-action-secondary-hover, #3A3938)',
    active: 'var(--ss-color-semantic-action-secondary-active, #1E1D1C)',
    border: 'var(--ss-color-semantic-action-secondary-border, #3A3938)',
    text: 'var(--ss-color-semantic-action-secondary-text, #FAF9F6)',
    icon: 'var(--ss-color-semantic-action-secondary-text, #FAF9F6)',
    disabledBackground: 'var(--ss-color-semantic-action-secondary-disabled-surface, #1E1D1C)',
    disabledText: 'var(--ss-color-semantic-action-secondary-disabled-text, #949391)',
    disabledIcon: 'var(--ss-color-semantic-action-secondary-disabled-icon, #949391)',
  },
} as const;

export interface BaseButtonProps
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'color'> {
  label?: string;
  size?: ButtonSize;
  variant?: ButtonVariant;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  iconOnly?: boolean;
  fullWidth?: boolean;
  href?: string;
  ariaLabel?: string;
  sx?: SxProps<Theme>;
}

const BaseButton = forwardRef<HTMLButtonElement | HTMLAnchorElement, BaseButtonProps>(
  (
    {
      label,
      size = 'medium',
      variant = 'secondary',
      startIcon,
      endIcon,
      iconOnly,
      fullWidth = false,
      href,
      ariaLabel,
      disabled = false,
      onClick,
      type,
      sx,
      ...rest
    },
    ref,
  ) => {
    const hasLabel = Boolean(label);
    const hasIcons = Boolean(startIcon || endIcon);
    const isIconOnly = iconOnly ?? (!hasLabel && hasIcons);
    const iconOnlyNode = isIconOnly ? (startIcon ?? endIcon) : null;
    const sizeStyles = SIZE_STYLES[size];
    const resolvedIconSize = isIconOnly ? sizeStyles.iconOnlyIconSize : sizeStyles.iconSize;
    const isDisabled = Boolean(disabled);
    const shouldUseLink = Boolean(href) && !onClick;
    const Component = shouldUseLink ? Link : Primitive.button;
    const isButton = !shouldUseLink;
    const computedAriaLabel = ariaLabel ?? (isIconOnly ? label : undefined);
    const variantStyles = VARIANT_STYLES[variant];
    const iconSlotSx = {
      width: resolvedIconSize,
      height: resolvedIconSize,
      fontSize: resolvedIconSize,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      lineHeight: 0,
      color: 'var(--ss-button-icon)',
      flexShrink: 0,
      '& > span': {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%',
        lineHeight: 0,
      },
      '& svg': {
        display: 'block',
        width: '100%',
        height: '100%',
      },
      '& img': {
        width: '100%',
        height: '100%',
      },
    };

    return (
      <Box
        component={Component as any}
        {...(shouldUseLink ? { href } : {})}
        type={isButton ? type ?? 'button' : undefined}
        disabled={isButton ? isDisabled : undefined}
        aria-disabled={!isButton && isDisabled ? 'true' : undefined}
        aria-label={computedAriaLabel}
        tabIndex={!isButton && isDisabled ? -1 : undefined}
        data-size={size}
        data-variant={variant}
        data-icon-only={isIconOnly ? 'true' : 'false'}
        data-disabled={isDisabled ? 'true' : 'false'}
        onClick={(event: MouseEvent<HTMLElement>) => {
          if (isDisabled) {
            event.preventDefault();
            event.stopPropagation();
            return;
          }
          onClick?.(event as MouseEvent<HTMLButtonElement>);
        }}
        ref={ref as any}
        sx={{
          '--ss-button-bg': variantStyles.background,
          '--ss-button-bg-hover': variantStyles.hover,
          '--ss-button-bg-active': variantStyles.active,
          '--ss-button-border-active': variantStyles.border,
          '--ss-button-text': variantStyles.text,
          '--ss-button-text-hover': variantStyles.text,
          '--ss-button-text-active': variantStyles.text,
          '--ss-button-icon': variantStyles.icon,
          '--ss-button-icon-hover': variantStyles.icon,
          '--ss-button-icon-active': variantStyles.icon,
          '--ss-button-bg-disabled': variantStyles.disabledBackground,
          '--ss-button-text-disabled': variantStyles.disabledText,
          '--ss-button-icon-disabled': variantStyles.disabledIcon,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: isIconOnly ? 0 : sizeStyles.gap,
          width: isIconOnly ? sizeStyles.iconOnlySize : fullWidth ? '100%' : 'auto',
          minWidth: isIconOnly ? sizeStyles.iconOnlySize : 0,
          minHeight: isIconOnly ? sizeStyles.iconOnlySize : sizeStyles.minHeight,
          height: isIconOnly ? sizeStyles.iconOnlySize : sizeStyles.height ?? 'auto',
          px: isIconOnly ? 0 : sizeStyles.paddingX,
          py: isIconOnly ? 0 : sizeStyles.paddingY,
          borderRadius: sizeStyles.borderRadius,
          border: 'none',
          outline: 'none',
          textDecoration: 'none',
          cursor: isDisabled ? 'not-allowed' : 'pointer',
          pointerEvents: isDisabled ? 'none' : 'auto',
          backgroundColor: 'var(--ss-button-bg)',
          color: 'var(--ss-button-text)',
          fontFamily: 'var(--font-inter), var(--font-lexend), sans-serif',
          transition: 'background-color 0.2s ease, color 0.2s ease',
          WebkitTapHighlightColor: 'transparent',
          '&:not([data-disabled="true"]):hover': {
            backgroundColor: 'var(--ss-button-bg-hover)',
          },
          '&:not([data-disabled="true"]):hover .ss-button-label': {
            color: 'var(--ss-button-text-hover)',
          },
          '&:not([data-disabled="true"]):hover .ss-button-icon': {
            color: 'var(--ss-button-icon-hover)',
          },
          '&:not([data-disabled="true"]):active': {
            backgroundColor: 'var(--ss-button-bg-active)',
            boxShadow: '0 0 0 2px var(--ss-button-border-active)',
          },
          '&:not([data-disabled="true"]):active .ss-button-label': {
            color: 'var(--ss-button-text-active)',
          },
          '&:not([data-disabled="true"]):active .ss-button-icon': {
            color: 'var(--ss-button-icon-active)',
          },
          '&:focus-visible': {
            outline: '2px solid var(--ss-color-semantic-focus-ring)',
            outlineOffset: 2,
          },
          '&[data-disabled="true"]': {
            backgroundColor: 'var(--ss-button-bg-disabled)',
            color: 'var(--ss-button-text-disabled)',
          },
          '&[data-disabled="true"] .ss-button-icon': {
            color: 'var(--ss-button-icon-disabled)',
          },
          ...sx,
        }}
        {...rest}
      >
        {isIconOnly ? (
          iconOnlyNode ? (
            <Box
              component="span"
              className="ss-button-icon"
              aria-hidden="true"
              sx={iconSlotSx}
            >
              {iconOnlyNode}
            </Box>
          ) : null
        ) : (
          <>
            {startIcon && (
              <Box
                component="span"
                className="ss-button-icon"
                aria-hidden="true"
                sx={iconSlotSx}
              >
                {startIcon}
              </Box>
            )}
            {label && (
              <Typography
                component="span"
                className="ss-button-label"
                sx={{
                  fontSize: sizeStyles.fontSize,
                  lineHeight: sizeStyles.lineHeight,
                  fontWeight: sizeStyles.fontWeight,
                  letterSpacing: sizeStyles.letterSpacing,
                  color: 'inherit',
                  whiteSpace: 'nowrap',
                }}
              >
                {label}
              </Typography>
            )}
            {endIcon && (
              <Box
                component="span"
                className="ss-button-icon"
                aria-hidden="true"
                sx={iconSlotSx}
              >
                {endIcon}
              </Box>
            )}
          </>
        )}
      </Box>
    );
  },
);

BaseButton.displayName = 'BaseButton';

export default BaseButton;
