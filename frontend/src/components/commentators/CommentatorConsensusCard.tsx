'use client';

import { Box, Typography, Paper } from '@mui/material';
import Link from 'next/link';
import { useState } from 'react';
import { WbSunnyOutlined as WbSunnyOutlinedIcon, KeyboardArrowRight as KeyboardArrowRightIcon } from '@/components/ui/phosphor-icons';

export default function CommentatorConsensusCard() {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Link href="/commentators/verse-takeaways/commentaries" passHref style={{ textDecoration: 'none' }}>
      <Paper
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        elevation={0}
        sx={{
          p: 2.5,
          width: '100%',
          borderRadius: 3.5,
          border: '2px solid transparent',
          background: `
            linear-gradient(36deg, rgba(237, 39, 255, 0.30) 0%, rgba(21.54, 72.36, 128.11, 0.30) 100%) padding-box,
            linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('/assets/images/background/commentary-card-gradient.jpg') border-box
          `,
          backgroundSize: 'cover, cover',
          backgroundPosition: 'center, center',
          transform: isHovered ? 'scale(1.01)' : 'scale(1)',
          transition: 'transform 0.2s, box-shadow 0.2s',
          boxShadow: isHovered ? '0px 8px 16px rgba(0, 0, 0, 0.3)' : 'none',
          cursor: 'pointer',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'flex-start',
          gap: 2,
          position: 'relative',
          overflow: 'hidden',
          // Shimmer effect on hover (desktop only)
          '&::before': isHovered ? {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
            animation: 'shimmer 1.5s infinite',
            zIndex: 1,
            '@media (max-width: 768px)': {
              display: 'none', // Disable shimmer on mobile
            },
          } : {},
          '@keyframes shimmer': {
            '0%': { left: '-100%' },
            '100%': { left: '100%' }
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 2,
            transition: 'background 0.3s ease',
          },
          '& > *': {
            position: 'relative',
            zIndex: 3,
          },
          '&:hover .arrow-icon': {
            opacity: 1,
          },
          '&:hover::after': {
            background: 'rgba(0, 0, 0, 0.6)',
          },
        }}
      >
        {/* Content container */}
        <Box
          sx={{
            alignSelf: 'stretch',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2,
            display: 'flex',
          }}
        >
          {/* Icon section - consistent with AuthorCard sizing */}
          <Box sx={{ position: 'relative', width: 64, height: 64 }}>
            {/* Base shape - matching AuthorCard */}
            <Box
              sx={{
                width: 51,
                height: 51,
                borderRadius: '50%',
                background: '#1A1A1A',
                position: 'absolute',
                left: 0,
                zIndex: 0,
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            />
            
            {/* Main gradient circle with icon - matching AuthorCard size */}
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: '50%',
                background: 'linear-gradient(45deg, #ED27FF 0%, #164880 100%)',
                position: 'absolute',
                zIndex: 1,
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <WbSunnyOutlinedIcon 
                sx={{ 
                  color: 'white', 
                  fontSize: 32 
                }} 
              />
            </Box>
          </Box>

          {/* Text content */}
          <Box
            sx={{
              flex: '1 1 0',
              justifyContent: 'flex-start',
              alignItems: 'center',
              gap: 1,
              display: 'flex',
            }}
          >
            <Box
              sx={{
                flex: '1 1 0',
                flexDirection: 'column',
                justifyContent: 'flex-start',
                alignItems: 'flex-start',
                gap: 0.75,
                display: 'flex',
              }}
            >
              {/* Title and tags section */}
              <Box
                sx={{
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  display: 'flex',
                }}
              >
                <Box
                  sx={{
                    alignSelf: 'stretch',
                    justifyContent: 'center',
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    gap: 1,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                  }}
                >
                  <Typography
                    sx={{
                      color: '#FFFAFA',
                      fontSize: 18,
                      fontWeight: 700,
                      lineHeight: 1.4,
                      wordWrap: 'break-word',
                    }}
                  >
                    <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                      Commentator Consensus
                    </Box>
                    <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                      Key Takeaways
                    </Box>
                  </Typography>
                  
                  {/* Tags */}
                  <Box
                    sx={{
                      flex: { xs: 'none', sm: '1 1 0' },
                      justifyContent: 'flex-start',
                      alignItems: 'flex-start',
                      gap: 1.25,
                      display: 'flex',
                      mt: { xs: 0, sm: 0 },
                    }}
                  >
                    {/* Desktop tags - matching AuthorCard styling */}
                    <Box
                      sx={{
                        display: { xs: 'none', sm: 'flex' },
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          padding: '2px 8px',
                          background: 'rgba(189, 46, 226, 0.50)',
                          borderRadius: 1,
                          fontSize: 12,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#F4BFFF',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          New
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: '2px 8px',
                          background: 'rgba(189, 46, 226, 0.50)',
                          borderRadius: 1,
                          fontSize: 12,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#F4BFFF',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          Easy Reading
                        </Typography>
                      </Box>
                    </Box>

                    {/* Mobile tags - matching AuthorCard styling */}
                    <Box
                      sx={{
                        display: { xs: 'flex', sm: 'none' },
                        gap: 1,
                      }}
                    >
                      <Box
                        sx={{
                          padding: '2px 8px',
                          background: 'rgba(189, 46, 226, 0.50)',
                          borderRadius: 1,
                          fontSize: 12,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#F4BFFF',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          New
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          padding: '2px 8px',
                          background: 'rgba(189, 46, 226, 0.50)',
                          borderRadius: 1,
                          fontSize: 12,
                        }}
                      >
                        <Typography
                          sx={{
                            color: '#F4BFFF',
                            fontSize: 12,
                            fontWeight: 500,
                          }}
                        >
                          Easy Reading
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Box>
              
              {/* Description - desktop only */}
              <Box
                sx={{
                  alignSelf: 'stretch',
                  flexDirection: 'column',
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  display: { xs: 'none', sm: 'flex' },
                }}
              >
                <Typography
                  sx={{
                    alignSelf: 'stretch',
                    color: '#FFFAFA',
                    fontSize: 14,
                    fontWeight: 400,
                    lineHeight: 1.6,
                    wordWrap: 'break-word',
                  }}
                >
                  Key takeaways from leading commentators, synthesized for every verse.
                </Typography>
              </Box>
            </Box>
          </Box>
          
          {/* Arrow icon */}
          <KeyboardArrowRightIcon
            className="arrow-icon"
            sx={{
              color: '#F4BFFF',
              opacity: 0.7,
              fontSize: 32,
              cursor: 'pointer',
              transition: 'opacity 0.2s',
              zIndex: 2,
            }}
          />
        </Box>
      </Paper>
    </Link>
  );
}