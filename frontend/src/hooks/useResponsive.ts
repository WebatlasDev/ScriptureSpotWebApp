'use client';

import { useMediaQuery, useTheme } from '@mui/material';

/**
 * Returns the full responsive object. Prefer the specialized hooks below when you
 * only need a single breakpoint so that we avoid registering unnecessary listeners.
 */
export default function useResponsive() {
  const theme = useTheme();

  return {
    isXs: useMediaQuery(theme.breakpoints.down('sm')),
    isSm: useMediaQuery(theme.breakpoints.between('sm', 'md')),
    isMd: useMediaQuery(theme.breakpoints.between('md', 'lg')),
    isLg: useMediaQuery(theme.breakpoints.between('lg', 'xl')),
    isXl: useMediaQuery(theme.breakpoints.up('xl')),
    isSmDown: useMediaQuery(theme.breakpoints.down('md')),
    isMdDown: useMediaQuery(theme.breakpoints.down('lg')),
    isSmUp: useMediaQuery(theme.breakpoints.up('sm')),
    isMdUp: useMediaQuery(theme.breakpoints.up('md')),
  };
}

export function useIsSmDown() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}

export function useIsMdDown() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('lg'));
}

export function useIsMdUp() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up('md'));
}

export function useIsMobile() {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.down('md'));
}
