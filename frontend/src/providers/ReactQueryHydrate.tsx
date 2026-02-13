'use client';

import { HydrationBoundary, DehydratedState } from '@tanstack/react-query';
import { ReactNode } from 'react';

interface ReactQueryHydrateProps {
  state: DehydratedState;
  children: ReactNode;
}

export function ReactQueryHydrate({ state, children }: ReactQueryHydrateProps) {
  return <HydrationBoundary state={state}>{children}</HydrationBoundary>;
}

export default ReactQueryHydrate;
