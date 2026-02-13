'use client';

import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Box,
  Button,
  IconButton,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Search as SearchIcon,
  PersonOutlineRounded as PersonOutlineRoundedIcon,
  PersonRounded as PersonRoundedIcon,
} from '@/components/ui/phosphor-icons';
import Link from 'next/link';
import MobileMenuDrawer from './MobileMenuDrawer';
import MobileSearchModal from './MobileSearchModal';
import SearchBar from './SearchBar';
import HeaderNavigation from './HeaderNavigation';
import { usePathname, useRouter } from 'next/navigation';
import { useUser, UserButton } from '@clerk/nextjs';
import LogoImage from '../common/LogoImage';
import GoPremiumButton from '../common/GoPremiumButton';
import SupportUsButton from '../common/SupportUsButton';
import { usePremium } from '@/hooks/usePremium';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import IconActionButton from '../verse/IconActionButton';

interface HeaderProps {
  hideLogo?: boolean;
  density?: 'default' | 'compact';
  maxWidth?: number | string;
}

const Header = ({ hideLogo, density = 'default', maxWidth }: HeaderProps = {}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useUser();
  const isPremium = usePremium();
  const theme = useTheme();
  const isSmDown = useMediaQuery(theme.breakpoints.down('sm'));

  const shouldHideLogo = typeof hideLogo === 'boolean' ? hideLogo : (pathname === '/' && !isSmDown);
  const effectiveMaxWidth = maxWidth;
  const horizontalPadding = density === 'compact' ? { xs: 2, md: 3 } : { xs: 3, md: 5 };
  const verticalPadding = density === 'compact' ? { xs: 0.5, md: 1 } : { xs: 1, md: 2 };
  const mobileIconButtonStyles = {
    color: 'white',
    width: 42,
    height: 42,
    borderRadius: '10px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background-color 0.25s ease, border-color 0.25s ease, transform 0.25s ease',
    '@media (hover: hover)': {
      '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.14)',
        borderColor: 'rgba(255, 255, 255, 0.25)',
      },
    },
    '&:active': {
      transform: 'scale(0.95)',
    },
  } as const;



  return (
    <>
      <AppBar
        position="sticky"
        sx={{
          bgcolor: '#1a1a1a',
        }}
      >
        <Toolbar
          sx={{
            justifyContent: 'space-between',
            py: verticalPadding,
            px: horizontalPadding,
            width: '100%',
            ...(effectiveMaxWidth
              ? {
                  maxWidth: effectiveMaxWidth,
                  mx: 'auto',
                }
              : {}),
          }}
        >
          <Box sx={{ display: shouldHideLogo ? 'none' : 'flex', alignItems: 'center', gap: 1 }}>
            {!shouldHideLogo && (
              <Link href="/" style={{ display: 'flex', alignItems: 'center' }}>
                <Box
                  sx={{
                    transform: { xs: 'none', md: 'translateY(-1px)' },
                    display: 'flex',
                    alignItems: 'center',
                    '& img': {
                      display: 'block',
                    },
                  }}
                >
                  <LogoImage height={34} />
                </Box>
              </Link>
            )}
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 3,
              ml: shouldHideLogo ? { md: 2 } : { md: 5 },
              flex: 1,
              minWidth: 0,
            }}
          >
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <HeaderNavigation />
            </Box>
            <Box
              sx={{
                flex: '0 1 360px',
                maxWidth: 420,
                width: '100%',
                mx: 'auto',
              }}
            >
              <SearchBar />
            </Box>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                gap: 1.5,
                flex: 1,
                minWidth: 0,
              }}
            >
              {user ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <IconActionButton
                  label="Login / Sign Up"
                  tooltip="Login / Sign Up"
                  tooltipPlacement="bottom"
                  icon={<PersonRoundedIcon sx={{ fontSize: 22, transform: 'translateY(1px)' }} />}
                  baseColor="rgba(255, 255, 255, 0.10)"
                  hoverColor="rgba(255, 193, 7, 0.30)"
                  iconColor="rgba(255, 255, 255, 0.85)"
                  hoverIconColor="#FFC107"
                  glowColor={undefined}
                  height={38}
                  onClick={() => router.push('/login')}
                />
              )}
              {!isPremium ? (
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <GoPremiumButton size="small" />
                </Box>
              ) : (
                <Box sx={{ display: { xs: 'none', sm: 'flex' } }}>
                  <SupportUsButton size="small" />
                </Box>
              )}
            </Box>
          </Box>
          <Box
            sx={{
              display: { xs: 'flex', md: 'none' },
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <IconButton
              edge="start"
              onClick={() => setMobileOpen(true)}
              sx={{
                ...mobileIconButtonStyles,
              }}
              aria-label="Open menu"
            >
              <MenuIcon />
            </IconButton>
            <IconButton
              onClick={() => setMobileSearchOpen(true)}
              sx={{
                ...mobileIconButtonStyles,
              }}
              aria-label="Search"
            >
              <SearchIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <MobileMenuDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} />
      <MobileSearchModal open={mobileSearchOpen} onClose={() => setMobileSearchOpen(false)} />
    </>
  );
};
export default Header;
