'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { MenuBookOutlinedIcon } from '@/components/ui/phosphor-icons';
import { Primitive } from '@radix-ui/react-primitive';
import { skeletonBaseSx } from '@/styles/skeletonStyles';
import { refreshModalAds } from '@/utils/adUtils';
import { useDeferredRender } from '@/hooks/useDeferredRender';
import { textStyles, type TextStyle } from '@/styles/textStyles';

const BookOverviewModal = dynamic(() => import('./BookOverviewModal'), { ssr: false });

interface BookOverviewCardProps {
  bookName: string;
  bookOverview: any;
  verseTakeaways: any;
  verseVersion: string;
  isLoading?: boolean;
}

const BOOK_OVERVIEW_HASH = '#book-overview';
const cardBackground =
  'linear-gradient(132deg, rgba(39, 142, 255, 0.03) 62%, rgba(9, 146, 50, 0.33) 100%), linear-gradient(316deg, rgba(39, 142, 255, 0.06) 45%, rgba(9, 146, 50, 0.60) 100%), linear-gradient(31deg, rgba(9, 146, 50, 0.30) 0%, rgba(39, 142, 255, 0.03) 100%), linear-gradient(157deg, rgba(9, 146, 50, 0.05) 0%, rgba(39, 142, 255, 0.50) 100%), #121212';
const cardHoverBackground =
  'linear-gradient(132deg, rgba(9, 146, 50, 0.03) 62%, rgba(39, 142, 255, 0.33) 100%), linear-gradient(316deg, rgba(9, 146, 50, 0.06) 45%, rgba(39, 142, 255, 0.60) 100%), linear-gradient(31deg, rgba(39, 142, 255, 0.30) 0%, rgba(9, 146, 50, 0.03) 100%), linear-gradient(157deg, rgba(39, 142, 255, 0.05) 0%, rgba(9, 146, 50, 0.50) 100%), #121212';
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

export default function BookOverviewCard({
  bookName,
  bookOverview,
  verseTakeaways,
  verseVersion,
  isLoading = false,
}: BookOverviewCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const shouldRenderModal = useDeferredRender(modalOpen);
  const isDisabled = Boolean(isLoading);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkUrlHash = () => {
      if (window.location.hash === BOOK_OVERVIEW_HASH) {
        setModalOpen(true);
      }
    };

    checkUrlHash();
    window.addEventListener('hashchange', checkUrlHash);

    return () => {
      window.removeEventListener('hashchange', checkUrlHash);
    };
  }, []);

  const handleOpenModal = () => {
    if (isDisabled) {
      return;
    }
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    refreshModalAds();
    if (typeof window !== 'undefined' && window.location.hash.includes('book-overview')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <>
      <Box
        component={Primitive.button}
        type="button"
        onClick={handleOpenModal}
        disabled={isDisabled}
        aria-disabled={isDisabled}
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
                background:
                  'linear-gradient(52deg, #278EFF 0%, #1F8FC9 26%, #10915F 78%, #099232 100%)',
                borderRadius: 'var(--ss-radius-semantic-control-full)',
                outline: '2px solid rgba(255, 255, 255, 0.10)',
                outlineOffset: '-2px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <MenuBookOutlinedIcon
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
              {bookName}
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
                What&apos;s the larger context?
              </Typography>
            </Box>
          </>
        )}
      </Box>

      {shouldRenderModal && (
        <BookOverviewModal
          open={modalOpen}
          onClose={handleCloseModal}
          bookName={bookName}
          bookOverview={bookOverview}
          verseTakeaways={verseTakeaways}
          verseVersion={verseVersion}
        />
      )}
    </>
  );
}
