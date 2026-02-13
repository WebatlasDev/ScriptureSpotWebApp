import { keyframes } from '@emotion/react';

export const skeletonPulse = keyframes`
  0% { opacity: 0.55; }
  50% { opacity: 1; }
  100% { opacity: 0.55; }
`;

export const skeletonBaseSx = {
  background: 'rgba(255, 255, 255, 0.12)',
  animation: `${skeletonPulse} 1.4s ease-in-out infinite`,
} as const;

