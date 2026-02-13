'use client';

import { Box, keyframes } from '@mui/material';

interface CrossLoaderProps {
  size?: number;
  color?: string;
}

const filling = keyframes`
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0%);
  }
`;

export default function CrossLoader({ 
  size = 40, 
  color = 'linear-gradient(180deg, #D4AF37 0%, #FFD700 50%, #B8860B 100%)' 
}: CrossLoaderProps) {
  // Calculate proportions based on the screenshot:
  // Total height: 12 units
  // Crossbar at 4 units from top (1/3 down)
  // Crossbar length: 6 units (3/4 of height)
  // Bar thickness: 1.25 units (25% thicker than original 1 unit)
  
  const crossbarTop = size / 3; // 4/12 = 1/3
  const crossbarLength = (size * 3) / 4; // 6/12 = 1/2, but relative to total size should be 3/4
  const thickness = (size / 12) * 1.25; // 1.25/12 (25% thicker)
  const crossbarOffset = (size - crossbarLength) / 2; // Center the crossbar

  // Create the cross shape clip-path string
  const crossClipPath = `polygon(
    ${((size/2 - thickness/2) / size) * 100}% 0%, 
    ${((size/2 + thickness/2) / size) * 100}% 0%, 
    ${((size/2 + thickness/2) / size) * 100}% ${(crossbarTop / size) * 100}%, 
    ${((crossbarOffset + crossbarLength) / size) * 100}% ${(crossbarTop / size) * 100}%, 
    ${((crossbarOffset + crossbarLength) / size) * 100}% ${((crossbarTop + thickness) / size) * 100}%, 
    ${((size/2 + thickness/2) / size) * 100}% ${((crossbarTop + thickness) / size) * 100}%, 
    ${((size/2 + thickness/2) / size) * 100}% 100%, 
    ${((size/2 - thickness/2) / size) * 100}% 100%, 
    ${((size/2 - thickness/2) / size) * 100}% ${((crossbarTop + thickness) / size) * 100}%, 
    ${(crossbarOffset / size) * 100}% ${((crossbarTop + thickness) / size) * 100}%, 
    ${(crossbarOffset / size) * 100}% ${(crossbarTop / size) * 100}%, 
    ${((size/2 - thickness/2) / size) * 100}% ${(crossbarTop / size) * 100}%
  )`;

  return (
    <Box
      sx={{
        position: 'relative',
        width: size,
        height: size,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {/* Cross outline/background */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          clipPath: crossClipPath,
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '2px',
        }}
      />
      
      {/* Cross container for masking the animated fill */}
      <Box
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          clipPath: crossClipPath,
          overflow: 'hidden',
        }}
      >
        {/* Animated fill that moves from bottom to top */}
        <Box
          sx={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            background: color,
            animation: `${filling} 2s ease-in-out infinite`,
          }}
        />
      </Box>
    </Box>
  );
}