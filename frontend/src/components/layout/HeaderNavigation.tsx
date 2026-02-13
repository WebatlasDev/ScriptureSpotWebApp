'use client';

import React from 'react';
import * as NavigationMenu from '@radix-ui/react-navigation-menu';
import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import Link from 'next/link';
import { useNavigationSections } from '@/hooks/useNavigationSections';
import { ArrowDownIcon } from '@/components/ui/phosphor-icons';

const StyledNavigationMenu = styled(NavigationMenu.Root)(() => ({
  position: 'relative',
  display: 'flex',
}));

const StyledList = styled(NavigationMenu.List)(() => ({
  display: 'flex',
  alignItems: 'center',
  listStyle: 'none',
  margin: 0,
  padding: 0,
  gap: 0,
}));

const ICON_ACTION_BUTTON_RADIUS = '10px';

const StyledTrigger = styled(NavigationMenu.Trigger)(() => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  color: 'rgba(255, 255, 255, 0.85)',
  fontSize: 14,
  fontWeight: 600,
  border: 'none',
  backgroundColor: 'transparent',
  borderRadius: ICON_ACTION_BUTTON_RADIUS,
  padding: '8px 12px',
  cursor: 'pointer',
  textTransform: 'none',
  transition: 'color 0.2s ease, background-color 0.2s ease',
  '& .chevron': {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.35)',
    transition: 'transform 0.2s ease, color 0.2s ease',
  },
  '@media (hover: hover)': {
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      color: '#FFFFFF',
      '& .chevron': {
        color: 'rgba(255, 255, 255, 0.65)',
      },
    },
  },
  '&[data-state="open"]': {
    color: '#FFFFFF',
    '& .chevron': {
      transform: 'rotate(180deg)',
      color: '#FFD700',
    },
  },
}));

const StyledContent = styled(NavigationMenu.Content)(() => ({
  width: '100%',
}));

const ContentInner = styled('div')(() => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 18,
  gap: 8,
  minWidth: 260,
}));

const StyledViewport = styled(NavigationMenu.Viewport)(() => ({
  position: 'absolute',
  top: 'calc(100% + 12px)',
  left: 0,
  width: 'auto',
  minWidth: 280,
  borderRadius: 18,
  border: '1px solid rgba(255, 255, 255, 0.12)',
  backgroundColor: '#1a1a1a',
  boxShadow: '0 18px 40px rgba(0, 0, 0, 0.55)',
  overflow: 'hidden',
  transformOrigin: 'top center',
  zIndex: 20,
  willChange: 'width, height',
  transition: 'width 200ms ease, height 200ms ease, opacity 150ms ease',
}));

const StyledIndicator = styled(NavigationMenu.Indicator)(() => ({
  display: 'flex',
  alignItems: 'flex-end',
  justifyContent: 'center',
  height: 12,
  position: 'absolute',
  top: '100%',
  zIndex: 10,
  '&::after': {
    content: '""',
    width: 12,
    height: 12,
    backgroundColor: '#1a1a1a',
    borderLeft: '1px solid rgba(255, 255, 255, 0.12)',
    borderTop: '1px solid rgba(255, 255, 255, 0.12)',
    transform: 'translateY(6px) rotate(45deg)',
  },
}));

const MenuLink = styled(Link)(() => ({
  display: 'block',
  padding: '12px 14px',
  borderRadius: 14,
  textDecoration: 'none',
  color: 'white',
  border: '1px solid transparent',
  transition: 'all 0.18s ease',
  '@media (hover: hover)': {
    '&:hover': {
      borderColor: 'rgba(243, 209, 41, 0.4)',
      backgroundColor: 'rgba(243, 209, 41, 0.08)',
      color: '#f3d129',
    },
  },
}));

const ComingSoonItem = styled(Box)(() => ({
  padding: '12px 14px',
  borderRadius: 14,
  opacity: 0.65,
  border: '1px dashed rgba(255, 255, 255, 0.2)',
}));

export default function HeaderNavigation() {
  const sections = useNavigationSections();

  return (
    <StyledNavigationMenu>
      <StyledList>
        {sections.map((section) => (
          <NavigationMenu.Item key={section.label}>
            <StyledTrigger>
              {section.label}
              <ArrowDownIcon className="chevron" aria-hidden />
            </StyledTrigger>
            <StyledContent>
              <ContentInner>
                {section.items.map((item, idx) =>
                  item.comingSoon ? (
                    <ComingSoonItem key={`${item.label}-${idx}`}>
                      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
                        {item.label} (Coming Soon)
                      </Typography>
                      {item.description && (
                        <Typography sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.7)', mt: 0.5 }}>
                          {item.description}
                        </Typography>
                      )}
                    </ComingSoonItem>
                  ) : (
                    <NavigationMenu.Link asChild key={item.route}>
                      <MenuLink href={item.route}>
                        <Typography sx={{ fontSize: 15, fontWeight: 600 }}>
                          {item.label}
                        </Typography>
                        {item.description && (
                          <Typography sx={{ fontSize: 12, color: 'rgba(255, 255, 255, 0.65)', mt: 0.5 }}>
                            {item.description}
                          </Typography>
                        )}
                      </MenuLink>
                    </NavigationMenu.Link>
                  )
                )}
              </ContentInner>
            </StyledContent>
          </NavigationMenu.Item>
        ))}
        <StyledIndicator />
      </StyledList>
      <StyledViewport />
    </StyledNavigationMenu>
  );
}
