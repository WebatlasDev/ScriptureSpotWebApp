'use client';

import { useEffect, useState } from 'react';

/**
 * Keeps a component mounted for a short duration after `open` becomes false.
 * This allows CSS exit animations to finish before unmounting.
 */
export function useDeferredRender(open: boolean, delay = 300) {
  const [shouldRender, setShouldRender] = useState(open);

  useEffect(() => {
    if (open) {
      setShouldRender(true);
      return;
    }

    const timeout = window.setTimeout(() => {
      setShouldRender(false);
    }, delay);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [open, delay]);

  return shouldRender;
}
