'use client';

import React, { useState } from 'react';
import { Box, Tooltip } from '@mui/material';
import { motion } from 'framer-motion';
import { CloseIcon } from '@/components/ui/phosphor-icons';
import { BookmarkIcon } from '@/components/ui/phosphor-icons';
import useResponsive from '@/hooks/useResponsive';

interface BookmarkRibbonProps {
  onDelete: (e: React.MouseEvent) => void;
  isLoading?: boolean;
  isRemoving?: boolean;
}

const RIBBON_COLOR_START = '#FF8C3A';
const RIBBON_COLOR_END = '#E67A2E';
const RIBBON_SHADOW = '0 4px 12px rgba(255, 140, 58, 0.3)';
const RIBBON_SHADOW_HOVER = '0 6px 16px rgba(255, 140, 58, 0.5)';

export default function BookmarkRibbon({
  onDelete,
  isLoading = false,
  isRemoving = false,
}: BookmarkRibbonProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { isMdUp } = useResponsive();

  const ribbonContent = (
    <Box
      component={motion.div}
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{
        duration: 0.4,
        delay: 0.1,
        ease: [0.4, 0, 0.2, 1]
      }}
      onClick={onDelete}
      onMouseEnter={() => isMdUp && setIsHovered(true)}
      onMouseLeave={() => isMdUp && setIsHovered(false)}
      sx={{
        position: 'absolute',
        top: -1,
        right: -1,
        width: 42,
        height: 65,
        cursor: isLoading || isRemoving ? 'not-allowed' : 'pointer',
        zIndex: 10,
        pointerEvents: isLoading || isRemoving ? 'none' : 'auto',
        transition: 'transform 0.25s ease-out',
        transform: isHovered && isMdUp ? 'translateY(-8px)' : 'translateY(0)',
      }}
    >
      {/* Ribbon main body */}
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          height: '100%',
          background: `linear-gradient(145deg, ${RIBBON_COLOR_START} 0%, ${RIBBON_COLOR_END} 100%)`,
          borderTopRightRadius: '14px',
          boxShadow: isHovered && isMdUp ? RIBBON_SHADOW_HOVER : RIBBON_SHADOW,
          transition: 'box-shadow 0.25s ease-out, filter 0.25s ease-out',
          filter: isHovered && isMdUp ? 'brightness(1.1)' : 'brightness(1)',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 0,
            borderLeft: '21px solid transparent',
            borderRight: '21px solid transparent',
            borderTop: `12px solid ${RIBBON_COLOR_END}`,
            filter: isHovered && isMdUp ? 'brightness(1.1)' : 'brightness(1)',
            transition: 'filter 0.25s ease-out',
          },
        }}
      >
        {/* Bookmark icon (desktop only, fades out on hover) */}
        {isMdUp && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: isHovered ? 0 : 1,
              transition: 'opacity 0.2s ease-out',
              pointerEvents: 'none',
            }}
          >
            <BookmarkIcon
              sx={{
                fontSize: 22,
                color: 'rgba(255, 255, 255, 0.95)',
                filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
              }}
            />
          </Box>
        )}

        {/* X icon (revealed on hover for desktop, always visible on mobile) */}
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: isMdUp ? (isHovered ? 1 : 0) : 1,
            transition: 'opacity 0.2s ease-out',
            pointerEvents: 'none',
          }}
        >
          <CloseIcon
            sx={{
              fontSize: 20,
              color: 'rgba(255, 255, 255, 0.95)',
              filter: 'drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3))',
            }}
          />
        </Box>

        {/* Subtle inner shadow for depth */}
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            borderTopRightRadius: '14px',
            boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.15)',
            pointerEvents: 'none',
          }}
        />
      </Box>
    </Box>
  );

  // On desktop, wrap with tooltip
  if (isMdUp) {
    return (
      <Tooltip
        title="Remove Bookmark"
        arrow
        placement="left"
        componentsProps={{
          tooltip: {
            sx: {
              bgcolor: 'rgba(16,16,16,0.92)',
              borderRadius: 2,
              boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
              '& .MuiTooltip-arrow': {
                color: 'rgba(16,16,16,0.92)',
              },
            },
          },
        }}
      >
        {ribbonContent}
      </Tooltip>
    );
  }

  // On mobile, no tooltip
  return ribbonContent;
}
