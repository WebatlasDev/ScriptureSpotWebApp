'use client';

import React, { useMemo, useEffect, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Box } from '@mui/material';
import ResponsiveAd from './ResponsiveAd';
import { findAdPlacementPositions } from '@/utils/adUtils';
import { type AdSlotId } from '@/config/adConfig';
import { usePremium } from '@/hooks/usePremium';

interface ContentAdProps {
  htmlContent: string;
  slotId: AdSlotId;
  className?: string;
  style?: React.CSSProperties;
  showPlaceholder?: boolean;
}

function ContentAdPortal({
  containerRef,
  paragraphIndex,
  slotId,
  showPlaceholder,
  contentKey,
}: {
  containerRef: React.RefObject<HTMLDivElement | null>;
  paragraphIndex: number;
  slotId: AdSlotId;
  showPlaceholder: boolean;
  contentKey: string;
}) {
  const [target, setTarget] = useState<Element | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) {
      setTarget(null);
      return;
    }

    const selector = `.content-ad-placeholder[data-paragraph-index="${paragraphIndex}"]`;
    const findPlaceholder = () => container.querySelector(selector);

    let placeholder = findPlaceholder();
    if (placeholder) {
      setTarget(placeholder);
      return () => setTarget(null);
    }

    const observer = new MutationObserver(() => {
      placeholder = findPlaceholder();
      if (placeholder) {
        setTarget(placeholder);
        observer.disconnect();
      }
    });

    observer.observe(container, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      setTarget(null);
    };
  }, [containerRef, paragraphIndex, contentKey]);

  if (!target) {
    return null;
  }

  return createPortal(
    <ResponsiveAd slotId={slotId} showPlaceholder={showPlaceholder} />,
    target
  );
}

export function ContentWithAds({ 
  htmlContent, 
  slotId, 
  className = '',
  style = {},
  showPlaceholder = process.env.NODE_ENV !== 'production',
}: ContentAdProps) {
  const isPremium = usePremium();
  const [domReady, setDomReady] = useState(false);
  const [adPositions, setAdPositions] = useState<number[]>([]);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
      setDomReady(true);
    }
  }, []);
  
  useEffect(() => {
    if (!domReady || isPremium) {
      setAdPositions([]);
      return;
    }
    setAdPositions(findAdPlacementPositions(htmlContent));
  }, [domReady, isPremium, htmlContent]);

  const processedContent = useMemo(() => {
    if (!htmlContent) return '';
    if (!domReady || adPositions.length === 0) {
      return htmlContent;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlContent, 'text/html');
    const paragraphs = doc.querySelectorAll('p');

    const sortedPositions = [...adPositions].sort((a, b) => b - a);
    sortedPositions.forEach(position => {
      const targetParagraph = paragraphs[position];
      if (targetParagraph && targetParagraph.parentNode) {
        const placeholder = doc.createElement('div');
        placeholder.className = 'content-ad-placeholder';
        placeholder.setAttribute('data-paragraph-index', position.toString());
        placeholder.setAttribute('data-slot-id', slotId);
        targetParagraph.parentNode.insertBefore(placeholder, targetParagraph.nextSibling);
      }
    });

    return doc.body.innerHTML;
  }, [htmlContent, adPositions, slotId, domReady]);

  const shouldRenderAds = !isPremium && adPositions.length > 0 && domReady;

  return (
    <Box
      className={className}
      sx={{
        ...style,
        '& .content-ad-placeholder': {
          margin: '20px 0',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        },
        '& hr': {
          opacity: 0.2,
          border: 'none',
          borderTop: '1px solid currentColor',
          margin: '20px 0',
        },
        '& sup': {
          fontSize: '12px',
          fontWeight: 600,
          color: 'rgba(255, 249.70, 249.70, 0.60)',
          marginRight: '4px',
        },
        '& p': {
          margin: '1em 0',
        },
        '& p:first-child': {
          marginTop: 0,
        },
        '& p:last-child': {
          marginBottom: 0,
        },
        '& ul, & ol': {
          paddingLeft: '20px',
          margin: '1em 0',
          listStylePosition: 'outside',
        },
        '& ul': {
          listStyleType: 'disc',
        },
        '& ol': {
          listStyleType: 'decimal',
        },
        '& ul ul': {
          listStyleType: 'circle',
          paddingLeft: '25px',
        },
        '& ol ol': {
          listStyleType: 'lower-alpha',
          paddingLeft: '25px',
        },
        '& li': {
          marginBottom: '0.5em',
        },
        '& li:last-child': {
          marginBottom: 0,
        },
      }}
    >
      <Box
        ref={contentRef}
        dangerouslySetInnerHTML={{ __html: processedContent || htmlContent }}
      />
      {shouldRenderAds &&
        adPositions.map(paragraphIndex => (
          <ContentAdPortal
            key={`content-ad-${slotId}-${paragraphIndex}`}
            containerRef={contentRef}
            paragraphIndex={paragraphIndex}
            slotId={slotId}
            showPlaceholder={showPlaceholder}
            contentKey={processedContent}
          />
        ))}
    </Box>
  );
}

export default function ContentAd(props: ContentAdProps) {
  return <ContentWithAds {...props} />;
}
