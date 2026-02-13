'use client';

import Link from 'next/link';
import { Box, Typography } from '@mui/material';
import { FavoriteIcon } from '@/components/ui/phosphor-icons';
import { skeletonBaseSx } from '@/styles/skeletonStyles';
import { textStyles, type TextStyle } from '@/styles/textStyles';

interface SupportCardProps {
  isLoading?: boolean;
}

const cardBackground =
  'linear-gradient(132deg, rgba(92, 0, 222, 0.03) 62%, rgba(255, 114, 198, 0.33) 100%), linear-gradient(316deg, rgba(92, 0, 222, 0.06) 0%, rgba(255, 114, 198, 0.60) 100%), linear-gradient(31deg, rgba(255, 114, 198, 0.30) 0%, rgba(92, 0, 222, 0.03) 100%), linear-gradient(157deg, rgba(92, 0, 222, 0.05) 0%, rgba(255, 114, 198, 0.50) 100%), #121212';
const cardHoverBackground =
  'linear-gradient(132deg, rgba(255, 114, 198, 0.03) 62%, rgba(92, 0, 222, 0.33) 100%), linear-gradient(316deg, rgba(255, 114, 198, 0.06) 0%, rgba(92, 0, 222, 0.60) 100%), linear-gradient(31deg, rgba(92, 0, 222, 0.30) 0%, rgba(255, 114, 198, 0.03) 100%), linear-gradient(157deg, rgba(255, 114, 198, 0.05) 0%, rgba(92, 0, 222, 0.50) 100%), #121212';
const textTransitionOut = 'opacity 0.35s ease-out, transform 0.35s ease-out';
const hoverTiming = 'cubic-bezier(0.42, 0, 1, 1)';
const hoverTextTransition = `opacity 0.35s ${hoverTiming}, transform 0.35s ${hoverTiming}`;
const hoverSubtitleDelay = '0.05s';

const toTypographySx = ({
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing,
  textTransform,
}: TextStyle) => ({
  fontFamily,
  fontWeight,
  fontSize,
  lineHeight,
  letterSpacing: letterSpacing ?? '0px',
  textTransform,
});

const headingStyle = toTypographySx(textStyles.heading.medium.s);
const bodyStyle = toTypographySx(textStyles.body.regular.m);

export default function SupportCard({ isLoading = false }: SupportCardProps) {
  const isDisabled = Boolean(isLoading);

  return (
    <Box
      component={Link}
      href="/support"
      aria-disabled={isDisabled ? 'true' : undefined}
      tabIndex={isDisabled ? -1 : undefined}
      onClick={event => {
        if (isDisabled) {
          event.preventDefault();
        }
      }}
      sx={{
        width: '100%',
        padding: 'var(--ss-spacing-base-3)',
        background: cardBackground,
        borderRadius: 'var(--ss-radius-semantic-layer-2-xl)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        gap: 'var(--ss-spacing-base-2)',
        position: 'relative',
        overflow: 'hidden',
        textDecoration: 'none',
        border: 0,
        textAlign: 'left',
        font: 'inherit',
        color: 'inherit',
        cursor: isDisabled ? 'default' : 'pointer',
        pointerEvents: isDisabled ? 'none' : 'auto',
        WebkitTapHighlightColor: 'transparent',
        '&::before': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: cardHoverBackground,
          opacity: 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: 'none',
          zIndex: 0,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.4)',
          opacity: 0,
          transition: 'opacity 0.5s ease-in-out',
          pointerEvents: 'none',
          zIndex: 1,
        },
        '& .overview-card-title': {
          opacity: 1,
          transform: 'translateY(-50%)',
          transition: textTransitionOut,
        },
        '& .overview-card-subtitle': {
          opacity: 0,
          transform: 'translateY(calc(-50% + 14px))',
          transition: textTransitionOut,
          transitionDelay: '0s',
        },
        '@media (hover: hover)': {
          '&:not([aria-disabled="true"]):hover::before': {
            opacity: 1,
          },
          '&:not([aria-disabled="true"]):hover::after': {
            opacity: 1,
          },
        '&:not([aria-disabled="true"]):hover .overview-card-title': {
          opacity: 0,
          transform: 'translateY(calc(-50% - 14px))',
            transition: hoverTextTransition,
          },
          '&:not([aria-disabled="true"]):hover .overview-card-subtitle': {
            opacity: 1,
            transform: 'translateY(-50%)',
            transition: hoverTextTransition,
            transitionDelay: hoverSubtitleDelay,
          },
        },
        '& > *': {
          position: 'relative',
          zIndex: 2,
        },
        '&:focus-visible': {
          outline: '3px solid rgba(255, 255, 255, 0.75)',
          outlineOffset: '4px',
        },
        '&:active': {
          transform: isDisabled ? 'none' : 'scale(0.98)',
        },
      }}
    >
      {isLoading ? (
        <>
          <Box
            sx={{
              ...skeletonBaseSx,
              width: 42,
              height: 42,
              borderRadius: '50%',
            }}
          />
          <Box
            sx={{
              ...skeletonBaseSx,
              width: 160,
              height: 18,
              borderRadius: 999,
            }}
          />
        </>
      ) : (
        <>
          <Box
            sx={{
              width: 42,
              height: 42,
              padding: '9px',
              background: 'linear-gradient(45deg, #5C00DE 0%, #FF72C6 100%)',
              borderRadius: 'var(--ss-radius-semantic-control-full)',
              outline: '2px solid rgba(255, 255, 255, 0.10)',
              outlineOffset: '-2px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <FavoriteIcon
              size={24}
              color="var(--ss-color-semantic-content-text-primary)"
              sx={{ display: 'block', lineHeight: 0 }}
            />
          </Box>
          <Box
            sx={{
              position: 'relative',
              flex: 1,
              height: headingStyle.lineHeight,
              overflow: 'hidden',
            }}
          >
            <Typography
              component="span"
              className="overview-card-title"
              sx={{
                ...headingStyle,
                color: 'var(--ss-color-semantic-content-text-primary)',
                position: 'absolute',
                left: 0,
                top: '50%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Support Us
            </Typography>
            <Typography
              component="span"
              className="overview-card-subtitle"
              sx={{
                ...bodyStyle,
                color: 'var(--ss-color-semantic-content-text-secondary)',
                position: 'absolute',
                left: 0,
                top: '50%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              Help keep Scripture Spot free
            </Typography>
          </Box>
        </>
      )}
    </Box>
  );
}
