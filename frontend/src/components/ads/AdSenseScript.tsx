'use client';

import { useEffect } from 'react';

interface AdSenseScriptProps {
  publisherId: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

export default function AdSenseScript({ publisherId }: AdSenseScriptProps) {
  const normalizedPublisherId = publisherId.startsWith('ca-pub-')
    ? publisherId
    : `ca-pub-${publisherId}`;

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const initializeAds = () => {
      try {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch {
        // Ignore initialization errors – AdSense will retry automatically
      }
    };

    const scriptSrc = `https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${normalizedPublisherId}`;
    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${scriptSrc}"]`
    );

    if (existingScript) {
      if (window.adsbygoogle) {
        initializeAds();
      } else {
        existingScript.addEventListener('load', initializeAds, { once: true });
        return () => existingScript.removeEventListener('load', initializeAds);
      }

      return;
    }

    const script = document.createElement('script');
    script.src = scriptSrc;
    script.async = true;
    script.crossOrigin = 'anonymous';
    script.id = `adsbygoogle-script-${normalizedPublisherId}`;
    script.addEventListener('load', initializeAds, { once: true });

    document.head.appendChild(script);

    return () => {
      script.removeEventListener('load', initializeAds);
    };
  }, [normalizedPublisherId]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const dispatchLocationChange = () => {
      window.dispatchEvent(new Event('ads:locationchange'));
    };

    const handleHashChange = () => {
      dispatchLocationChange();
    };

    const handlePopState = () => {
      dispatchLocationChange();
    };

    const originalPushState = window.history.pushState;
    const originalReplaceState = window.history.replaceState;

    const wrapHistoryMethod = <T extends (...args: any[]) => any>(
      original: T
    ) => {
      return function wrapped(this: History, ...args: Parameters<T>) {
        const result = original.apply(this, args);
        dispatchLocationChange();
        return result;
      } as T;
    };

    window.history.pushState = wrapHistoryMethod(originalPushState);
    window.history.replaceState = wrapHistoryMethod(originalReplaceState);

    window.addEventListener('hashchange', handleHashChange);
    window.addEventListener('popstate', handlePopState);

    dispatchLocationChange();

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
      window.removeEventListener('popstate', handlePopState);
      window.history.pushState = originalPushState;
      window.history.replaceState = originalReplaceState;
    };
  }, []);

  return null;
}
