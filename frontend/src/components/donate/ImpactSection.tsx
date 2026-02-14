'use client';

import React, { useRef, useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  LinearProgress,
} from '@mui/material';
import Image from 'next/image';

interface Props {
  hoveredStatCard: string | null;
  setHoveredStatCard: (id: string | null) => void;
}

const goals = [
  {
    id: 'historical-texts',
    current: 10000000,
    goal: 50000000,
    label: 'Historical Texts',
    progress: 28,
  },
  {
    id: 'commentaries',
    current: 165000,
    goal: 250000,
    label: 'Unique Commentaries',
    progress: 40,
  },
  {
    id: 'authors',
    current: 19,
    goal: 30,
    label: 'Authors Incorporated',
    progress: 40,
  },
  {
    id: 'sermons',
    current: 4059,
    goal: 10000,
    label: 'Sermons Added',
    progress: 40,
  },
];

export default function ImpactSection({ hoveredStatCard, setHoveredStatCard }: Props) {
  const founderRef = useRef<HTMLDivElement>(null);
  const [founderHeight, setFounderHeight] = useState<number | null>(null);

  useEffect(() => {
    const updateHeight = () => {
      if (founderRef.current) {
        setFounderHeight(founderRef.current.offsetHeight);
      }
    };

    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 3, 
      flexDirection: { xs: 'column', md: 'row' },
      alignItems: { xs: 'stretch', md: 'flex-start' }
    }}>
      {/* From The Founder Section */}
      <Paper
        ref={founderRef}
        sx={{
          p: { xs: 3, md: 4 },
          pb: { xs: 4, md: 5 },
          backgroundColor: '#1A1A1A',
          borderRadius: 4.5,
          flex: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          height: 'fit-content',
        }}
      >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Image
                src="/assets/images/marketing/misc/AR-signature.webp"
                alt="AR Signature"
                width={26}
                height={26}
              />
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  lineHeight: 1.2,
                  background: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-sm.jpg)',
                  backgroundSize: 'cover',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                From the Founder
              </Typography>
            </Box>
            <Typography
              sx={{
                fontSize: { xs: '24px', md: '28px' },
                fontWeight: 400,
                lineHeight: 1.2,
                color: 'white',
              }}
            >
              Your Help Is <Box component="span" sx={{ fontWeight: 700 }}>Transformative</Box>
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mt: -1 }}>
            <Typography
              sx={{
                fontSize: { xs: '16px', md: '18px' },
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Making the best of church history accessible <Box component="span" sx={{ fontStyle: 'italic' }}>and</Box> enjoyable to modern readers is{' '}
              <Box component="span" sx={{ color: 'white' }}>a massive undertaking</Box> that involves:
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pl: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'white', borderRadius: '50%', mt: 1, flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Organizing <Box component="span" sx={{ color: 'white' }}>hundreds of millions of words</Box> from{' '}
                  <Box component="span" sx={{ color: 'white' }}>thousands of sources</Box>
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'white', borderRadius: '50%', mt: 1, flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Maintaining massive, complex databases
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'white', borderRadius: '50%', mt: 1, flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Commissioning <Box component="span" sx={{ color: 'white' }}>doctoral-level modernization</Box> for outdated, Old English content
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                <Box sx={{ width: 6, height: 6, bgcolor: 'white', borderRadius: '50%', mt: 1, flexShrink: 0 }} />
                <Typography
                  sx={{
                    fontSize: { xs: '16px', md: '18px' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: 'rgba(255, 255, 255, 0.8)',
                  }}
                >
                  Designing a <Box component="span" sx={{ color: 'white' }}>user-friendly</Box>,{' '}
                  <Box component="span" sx={{ color: 'white' }}>next-gen platform</Box>
                </Typography>
              </Box>
            </Box>

            <Typography
              sx={{
                fontSize: { xs: '16px', md: '18px' },
                fontWeight: 400,
                lineHeight: 1.6,
                color: 'rgba(255, 255, 255, 0.8)',
              }}
            >
              Your support allows us to{' '}
              <Box component="span" sx={{ color: 'white' }}>add content faster, develop more features, and launch new partnerships</Box> with Christian organizations.
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: '16px', md: '18px' },
                fontWeight: 400,
                lineHeight: 1.2,
                color: 'rgba(255, 255, 255, 0.8)',
                fontStyle: 'italic',
              }}
            >
              Soli Deo Gloria,
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 50,
                height: 50,
                borderRadius: '50%',
                overflow: 'hidden',
                backgroundColor: 'white',
                boxShadow: '8px 26px 26px rgba(0, 0, 0, 0.55)',
              }}
            >
              <Image
                src="/assets/images/about-us/addison-riddleberger-scripture-spot.webp"
                alt="Addison Riddleberger"
                width={50}
                height={50}
                style={{ objectFit: 'cover' }}
              />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: { xs: '18px', md: '20px' },
                  fontWeight: 700,
                  lineHeight: 1.4,
                  color: 'white',
                }}
              >
                Addison Riddleberger
              </Typography>
              <Typography
                sx={{
                  fontSize: { xs: 14, md: 16 },
                  fontWeight: 400,
                  lineHeight: 1.4,
                  color: 'white',
                  opacity: .79,
                }}
              >
                Co-Founder & CEO, Scripture Spot
              </Typography>
            </Box>
          </Box>
        </Paper>

        {/* 2025 Goals Section */}
        <Paper
          sx={{
            p: { xs: 3, md: 4 },
            py: { xs: 3, md: 5 },
            backgroundColor: '#1A1A1A',
            borderRadius: 4.5,
            flex: 1,
            width: { xs: '100%', md: 'auto' },
            display: 'flex',
            flexDirection: 'column',
            gap: 4,
            overflow: 'hidden',
            height: { xs: 'auto', md: founderHeight ? `${founderHeight}px` : 'auto' },
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 700,
              textTransform: 'uppercase',
              lineHeight: 1.2,
              background: 'url(/assets/images/marketing/premium-subscription-tier/Premium-bg-sm.jpg)',
              backgroundSize: 'cover',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            2025 Goals
          </Typography>

          <Box 
            sx={{ 
              display: 'flex', 
              flexDirection: 'column', 
              gap: 3,
              overflowY: 'auto',
              flex: 1,
              minHeight: 0,
              maxHeight: 'calc(100% - 60px)',
              '&::-webkit-scrollbar': {
                width: '8px',
              },
              '&::-webkit-scrollbar-track': {
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
              },
              '&::-webkit-scrollbar-thumb': {
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '4px',
              },
            }}
          >
            {goals.map((goal) => (
              <Paper
                key={goal.id}
                sx={{
                  p: { xs: 2, md: 4 },
                  backgroundColor: 'rgba(255, 255, 255, 0.10)',
                  borderRadius: { xs: 2.25, md: 4.5 },
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 2,
                  flexShrink: 0,
                }}
              >
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                    <Typography
                      sx={{
                        fontSize: { xs: '18px', md: '20px' },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: 'white',
                      }}
                    >
                      {goal.current.toLocaleString()}
                    </Typography>
                    <Typography
                      sx={{
                        fontSize: { xs: '14px', md: '16px' },
                        fontWeight: 700,
                        lineHeight: 1.2,
                        color: 'rgba(255, 255, 255, 0.60)',
                      }}
                    >
                      {goal.goal.toLocaleString()}
                    </Typography>
                  </Box>
                  <LinearProgress
                    variant="determinate"
                    value={goal.progress}
                    sx={{
                      height: 9,
                      borderRadius: 4.5,
                      backgroundColor: '#737373',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: '#D1A653',
                        borderRadius: 4.5,
                      },
                    }}
                  />
                </Box>
                <Typography
                  sx={{
                    fontSize: { xs: '14px', md: '16px' },
                    fontWeight: 400,
                    lineHeight: 1.4,
                    color: 'rgba(255, 255, 255, 0.80)',
                  }}
                >
                  {goal.label}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Paper>
    </Box>
  );
}