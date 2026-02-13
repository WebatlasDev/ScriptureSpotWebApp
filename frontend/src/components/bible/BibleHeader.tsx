'use client';

import React from 'react';
import { Box, Typography, Breadcrumbs, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import { NavigateNextIcon } from '@/components/ui/phosphor-icons';
import VersionDropdown from './VersionDropdown';
import HeaderChapterNavigation from './HeaderChapterNavigation';
import { CustomChip } from '@/components/ui';
import { interlinearThemes } from '@/styles/interlinearThemes';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BibleHeaderProps {
  version: {
    name: string;
    fullName?: string;
    shortName?: string;
    year?: number;
    tradition?: string;
    description?: string;
  };
  title: string;
  subtitle: string;
  breadcrumbItems: BreadcrumbItem[];
  showChapterNavigation?: boolean;
  showVersionSelector?: boolean;
  interlinearMode?: boolean;
  interlinearLanguage?: 'HEBREW' | 'GREEK';
}

export default function BibleHeader({ version, title, subtitle, breadcrumbItems, showChapterNavigation = false, showVersionSelector = true, interlinearMode = false, interlinearLanguage = 'HEBREW' }: BibleHeaderProps) {
  // Bible-specific color scheme
  const colors = {
    primary: '#278EFF',
    gradient: 'linear-gradient(216deg, #278EFF 0%, #278EFF 100%)',
    chipBackground: 'rgba(39, 129, 255, 0.30)',
    chipText: '#96C2FF',
  };

  return (
    <Box sx={{ mb: 4 }}>
      {/* Breadcrumbs */}
      <Box sx={{ mb: 3 }}>
        <Breadcrumbs
          separator={<NavigateNextIcon fontSize="small" sx={{ color: 'rgba(255, 255, 255, 0.5)' }} />}
          sx={{
            '& .MuiBreadcrumbs-ol': {
              alignItems: 'center',
            },
          }}
        >
          {breadcrumbItems.map((item, index) => (
            item.href ? (
              <Link key={index} href={item.href} passHref legacyBehavior>
                <MuiLink
                  color="rgba(255, 255, 255, 0.7)"
                  sx={{
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: 'none',
                    '&:hover': {
                      color: 'white',
                      textDecoration: 'underline',
                    },
                  }}
                >
                  {item.label}
                </MuiLink>
              </Link>
            ) : (
              <Typography
                key={index}
                color="white"
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                }}
              >
                {item.label}
              </Typography>
            )
          ))}
        </Breadcrumbs>
      </Box>

      {/* Header Card */}
      <Box
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.05)',
          borderRadius: 3.5,
          p: showChapterNavigation 
            ? { xs: '24px 24px', sm: '32px 32px', md: '32px 32px' }
            : { xs: 3, sm: 4, md: 4 },
          mb: 4,
          width: '100%',
          boxSizing: 'border-box',
        }}
      >
        {/* Title with inline translation and Subtitle */}
        <Box>
          {showChapterNavigation ? (
            // Centered layout for chapter pages (like VerseNavigationBar)
            <>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'space-between',
                gap: 1
              }}>
                {(() => {
                  const navigation = HeaderChapterNavigation({ 
                    showNavigation: showChapterNavigation,
                    interlinearMode: interlinearMode 
                  });
                  return (
                    <>
                      {navigation?.previousButton}
                      
                      <Box sx={{ 
                        display: 'flex', 
                        flexWrap: 'wrap',
                        alignItems: 'center', 
                        gap: 2, 
                        justifyContent: 'center',
                        flexGrow: 1 
                      }}>
                        <Typography
                          component='h1'
                          sx={{
                            color: '#FFFAFA',
                            fontSize: { xs: 20, sm: 24, md: 28 },
                            fontWeight: 400,
                            lineHeight: 1.25,
                            textAlign: 'center',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 2,
                            flexWrap: 'wrap'
                          }}
                        >
                          <Box>
                            {title.split(' ').map((word, index) => 
                              index === title.split(' ').length - 1 ? (
                                <Box key={index} component='span' sx={{ fontWeight: 700 }}>
                                  {word}
                                </Box>
                              ) : (
                                <span key={index}>{word} </span>
                              )
                            )}
                          </Box>
                          {interlinearMode && (() => {
                            const theme = interlinearThemes[interlinearLanguage];
                            return (
                              <CustomChip
                                label="Interlinear"
                                bgColor={interlinearLanguage === 'HEBREW' 
                                  ? 'rgba(255, 192, 67, 0.2)' 
                                  : 'rgba(124, 185, 255, 0.2)'
                                }
                                textColor={theme.strongsColor}
                                fontSize={12}
                                fontWeight={500}
                                borderRadius={1}
                                padding="2px 8px"
                              />
                            );
                          })()}
                        </Typography>
                        {showVersionSelector && (
                          <VersionDropdown
                            currentVersion={version}
                          />
                        )}
                      </Box>
                      
                      {navigation?.nextButton}
                    </>
                  );
                })()}
              </Box>
              {subtitle && (
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: { xs: 14, md: 16 },
                    fontWeight: 400,
                    lineHeight: 1.6,
                    textAlign: 'center',
                  }}
                >
                  {subtitle}
                </Typography>
              )}
            </>
          ) : (
            // Left-aligned layout for other pages
            <>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                <Typography
                  component='h1'
                  sx={{
                    color: '#FFFAFA',
                    fontSize: { xs: 24, sm: 26, md: 32 },
                    fontWeight: 400,
                    lineHeight: 1.25,
                  }}
                >
                  {title.split(' ').map((word, index) => 
                    index === title.split(' ').length - 1 ? (
                      <Box key={index} component='span' sx={{ fontWeight: 700 }}>
                        {word}
                      </Box>
                    ) : (
                      <span key={index}>{word} </span>
                    )
                  )}
                </Typography>
                {showVersionSelector && (
                  <VersionDropdown
                    currentVersion={version}
                  />
                )}
              </Box>
              <Typography
                sx={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 400,
                  lineHeight: 1.6,
                  maxWidth: '800px',
                }}
              >
                {subtitle}
              </Typography>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}
