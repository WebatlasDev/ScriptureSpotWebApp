'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { WbSunnyOutlined as WbSunnyOutlinedIcon } from '@/components/ui/phosphor-icons';
import { Primitive } from '@radix-ui/react-primitive';
import { refreshModalAds } from '@/utils/adUtils';
import { skeletonBaseSx } from '@/styles/skeletonStyles';
import { useDeferredRender } from '@/hooks/useDeferredRender';
import { textStyles, type TextStyle } from '@/styles/textStyles';

const VerseTakeawaysModal = dynamic(() => import('./VerseTakeawaysModal'), { ssr: false });

interface VerseTakeawaysCardProps {
  reference: string;
  verseTakeaways: any;
  isLoading?: boolean;
}

const VERSE_TAKEAWAY_HASH = '#verse-takeaways';
const cardBackground =
  'linear-gradient(132deg, rgba(52, 68, 145, 0.03) 62%, rgba(168, 50, 214, 0.33) 100%), linear-gradient(315deg, rgba(52, 68, 145, 0.06) 45%, rgba(168, 50, 214, 0.60) 100%), linear-gradient(31deg, rgba(168, 50, 214, 0.30) 0%, rgba(52, 68, 145, 0.03) 100%), linear-gradient(157deg, rgba(168, 50, 214, 0.10) 0%, #344491 100%), rgba(18, 18, 18, 0.60)';
const cardHoverBackground =
  'linear-gradient(132deg, rgba(168, 50, 214, 0.03) 62%, rgba(52, 68, 145, 0.33) 100%), linear-gradient(315deg, rgba(168, 50, 214, 0.06) 45%, rgba(52, 68, 145, 0.60) 100%), linear-gradient(31deg, rgba(52, 68, 145, 0.30) 0%, rgba(168, 50, 214, 0.03) 100%), linear-gradient(157deg, rgba(52, 68, 145, 0.10) 0%, #A832D6 100%), rgba(18, 18, 18, 0.60)';

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

export default function VerseTakeawaysCard({ reference, verseTakeaways, isLoading = false }: VerseTakeawaysCardProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const shouldRenderModal = useDeferredRender(modalOpen);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkUrlHash = () => {
      if (window.location.hash === VERSE_TAKEAWAY_HASH) {
        setModalOpen(true);
      }
    };

    checkUrlHash();
    window.addEventListener('hashchange', checkUrlHash);

    return () => {
      window.removeEventListener('hashchange', checkUrlHash);
    };
  }, []);

  const handleOpen = () => {
    if (isLoading) {
      return;
    }
    setModalOpen(true);
  };

  const handleClose = () => {
    setModalOpen(false);
    refreshModalAds();
    if (typeof window !== 'undefined' && window.location.hash.includes('verse-takeaways')) {
      window.history.replaceState(null, '', window.location.pathname);
    }
  };

  return (
    <>
      <Box
        component={Primitive.button}
        type="button"
        onClick={handleOpen}
        disabled={isLoading}
        aria-disabled={isLoading}
        sx={{
          width: '100%',
          height: '100%',
          paddingX: 'var(--ss-spacing-base-4)',
          paddingY: 'var(--ss-spacing-base-5)',
          background: cardBackground,
          borderRadius: 'var(--ss-radius-semantic-layer-2-xl)',
          display: 'inline-flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 'var(--ss-spacing-base-1)',
          position: 'relative',
          overflow: 'hidden',
          border: 0,
          textAlign: 'center',
          font: 'inherit',
          color: 'inherit',
          cursor: isLoading ? 'default' : 'pointer',
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
          '@media (hover: hover)': {
            '&:not([aria-disabled="true"]):hover::before': {
              opacity: 1,
            },
            '&:not([aria-disabled="true"]):hover::after': {
              opacity: 1,
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
            transform: isLoading ? 'none' : 'scale(0.98)',
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
                borderRadius: '20px',
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
            <Box
              sx={{
                ...skeletonBaseSx,
                width: 200,
                height: 16,
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
                padding: '6px',
                background:
                  'linear-gradient(44deg, #ED27FF 0%, #A632D5 33%, #7F38BE 51%, #164880 100%)',
                borderRadius: '20px',
                outline: '2px solid rgba(255, 255, 255, 0.07)',
                outlineOffset: '-2px',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WbSunnyOutlinedIcon size={24} color="#fff" sx={{ display: 'block', lineHeight: 0 }} />
            </Box>
            <Typography
              component="span"
              sx={{
                ...headingStyle,
                color: 'var(--ss-color-semantic-content-text-primary)',
              }}
            >
              Verse Takeaways
            </Typography>
            <Typography
              component="span"
              sx={{
                ...bodyStyle,
                color: 'var(--ss-color-semantic-content-text-secondary)',
              }}
            >
              What do top commentators say?
            </Typography>
          </>
        )}
      </Box>

      {shouldRenderModal && (
        <VerseTakeawaysModal
          open={modalOpen}
          onClose={handleClose}
          reference={reference}
          verseTakeaways={verseTakeaways}
        />
      )}
    </>
  );
}
