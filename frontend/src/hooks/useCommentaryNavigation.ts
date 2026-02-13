'use client';

import { useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';

const isModifiedClick = (event: React.MouseEvent<HTMLElement>) =>
  event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button === 1;

export const useCommentaryNavigation = (href: string) => {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      if (!href || isNavigating) {
        return;
      }

      if (isModifiedClick(event)) {
        if (typeof window !== 'undefined') {
          window.open(href, '_blank');
        }
        return;
      }

      event.preventDefault();
      setIsNavigating(true);
      router.push(href);
    },
    [href, isNavigating, router],
  );

  return {
    isNavigating,
    handleClick,
  };
};

export type UseCommentaryNavigationReturn = ReturnType<typeof useCommentaryNavigation>;
