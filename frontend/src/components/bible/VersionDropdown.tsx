'use client';

import React, { useState } from 'react';
import { Button, Menu, MenuItem, Box, Typography } from '@mui/material';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useBibleVersions } from '@/hooks/useBibleVersions';

import { buildUrl } from '@/utils/navigation';

interface VersionDropdownProps {
  currentVersion: {
    name: string;
    abbreviation?: string;
  };
}

export default function VersionDropdown({ currentVersion }: VersionDropdownProps) {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const params = useParams() as Partial<Record<'version' | 'book' | 'chapter' | 'verse', string>>;

  const { data: versions, isLoading } = useBibleVersions();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const buildVersionHref = (versionSlug: string) => {
    const basePath = buildUrl({
      version: versionSlug,
      book: params?.book,
      chapter: params?.chapter,
      verse: params?.verse,
    });

    if (typeof window !== 'undefined') {
      const pathname = window.location.pathname.toLowerCase();
      if (pathname.endsWith('/interlinear')) {
        return `${basePath}/interlinear`;
      }
    }

    return basePath;
  };

  // Button styles from VerseNavigationBar.tsx
  const buttonStyles = {
    borderColor: 'rgba(255, 255, 255, 0.2)',
    color: 'text.primary',
    minWidth: 'auto',
    px: 2,
    py: 0.75,
    fontSize: '0.875rem',
    '&:hover': {
      borderColor: '#FFD700',
      backgroundColor: 'rgba(255, 215, 0, 0.1)',
    },
  };

  // Filter out current version from dropdown list
  const availableVersions = versions?.filter(
    version => version.abbreviation?.toLowerCase() !== currentVersion.name.toLowerCase()
  ) || [];

  return (
    <>
      <Button
        onClick={handleClick}
        variant="outlined"
        sx={buttonStyles}
      >
        {currentVersion.name.toUpperCase()}
      </Button>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        slotProps={{
          paper: { 
            sx: { 
              backgroundColor: '#1A1A1A', 
              color: 'text.primary', 
              maxHeight: 400,
              border: '1px solid rgba(255, 255, 255, 0.2)',
            } 
          }
        }}
      >
        {isLoading ? (
          <MenuItem disabled>
            Loading versions...
          </MenuItem>
        ) : availableVersions.length > 0 ? (
          availableVersions.map((version) => {
            const versionSlug = version.abbreviation?.toLowerCase() || version.abbreviation;
            return (
              <MenuItem
                key={versionSlug}
                component={Link}
                href={buildVersionHref(versionSlug)}
                onClick={handleClose}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  py: 1.5,
                  '&:hover': { 
                    backgroundColor: 'rgba(255, 215, 0, 0.1)' 
                  },
                  '&.Mui-selected': { 
                    backgroundColor: 'rgba(255, 215, 0, 0.2)' 
                  },
                  '&.Mui-selected:hover': { 
                    backgroundColor: 'rgba(255, 215, 0, 0.2)' 
                  },
                }}
              >
                <Box sx={{
                  width: 'auto',
                  minWidth: 40,
                  height: 24,
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  px: 1,
                  flexShrink: 0,
                }}>
                  <Typography sx={{
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                  }}>
                    {version.abbreviation}
                  </Typography>
                </Box>
                <Typography sx={{
                  color: 'text.primary',
                  fontSize: '0.875rem',
                }}>
                  {version.name}
                </Typography>
              </MenuItem>
            );
          })
        ) : (
          <MenuItem disabled>
            No other versions available
          </MenuItem>
        )}
        
        {/* Promo card */}
        <Box sx={{
          m: 1,
          mt: 2,
          p: 1.5,
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 2,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}>
          <Typography sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontSize: '0.75rem',
            textAlign: 'center',
            fontStyle: 'italic',
          }}>
            Stay tuned! More versions on the way!
          </Typography>
        </Box>
      </Menu>
    </>
  );
}
