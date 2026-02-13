'use client';

import React from 'react';
import { Box } from '@mui/material';
import { highlightSearchTerms, HighlightOptions } from '@/utils/textHighlighting';

interface HighlightedTextProps {
  text: string;
  searchTerms: string | string[];
  options?: HighlightOptions;
  component?: React.ElementType;
  sx?: object;
  highlightSx?: object;
}

export default function HighlightedText({
  text,
  searchTerms,
  options = {},
  component = 'span',
  sx = {},
  highlightSx = {}
}: HighlightedTextProps) {
  // Handle null/undefined text
  if (!text) {
    return <Box component={component} sx={sx}></Box>;
  }
  
  const segments = highlightSearchTerms(text, searchTerms, options);

  const defaultHighlightSx = {
    backgroundColor: '#FFD700',
    color: '#000000',
    fontWeight: 700,
    borderRadius: '3px',
    padding: '2px 4px',
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    ...highlightSx
  };

  return (
    <Box component={component} sx={sx}>
      {segments.map((segment, index) => 
        segment.isHighlighted ? (
          <Box
            key={index}
            component="mark"
            sx={defaultHighlightSx}
          >
            {segment.text}
          </Box>
        ) : (
          <React.Fragment key={index}>
            {segment.text}
          </React.Fragment>
        )
      )}
    </Box>
  );
}

// Additional component for search result snippets with built-in truncation
interface SearchResultSnippetProps extends Omit<HighlightedTextProps, 'text'> {
  text: string;
  maxLength?: number;
  showEllipsis?: boolean;
}

export function SearchResultSnippet({
  text,
  searchTerms,
  maxLength = 200,
  showEllipsis = true,
  options = {},
  component = 'span',
  sx = {},
  highlightSx = {}
}: SearchResultSnippetProps) {
  // Handle null/undefined text
  if (!text) {
    return <Box component={component} sx={sx}></Box>;
  }
  // Create snippet centered around search terms
  const createSnippet = (fullText: string, terms: string | string[], maxLen: number) => {
    if (!fullText || fullText.length <= maxLen) {
      return { snippet: fullText || '', truncated: false };
    }

    const termArray = Array.isArray(terms) ? terms : [terms];
    const normalizedTerms = termArray.filter(term => term.trim().length > 0);
    
    if (normalizedTerms.length === 0) {
      return { 
        snippet: fullText.substring(0, maxLen) + (showEllipsis ? '...' : ''), 
        truncated: true 
      };
    }

    // Find the first occurrence of any search term
    let earliestIndex = fullText.length;
    for (const term of normalizedTerms) {
      const index = fullText.toLowerCase().indexOf(term.toLowerCase());
      if (index !== -1 && index < earliestIndex) {
        earliestIndex = index;
      }
    }

    if (earliestIndex === fullText.length) {
      return { 
        snippet: fullText.substring(0, maxLen) + (showEllipsis ? '...' : ''), 
        truncated: true 
      };
    }

    // Calculate snippet boundaries
    const halfLength = Math.floor(maxLen / 2);
    let start = Math.max(0, earliestIndex - halfLength);
    let end = Math.min(fullText.length, start + maxLen);

    // Adjust start if we hit the end boundary
    if (end - start < maxLen) {
      start = Math.max(0, end - maxLen);
    }

    // Try to break at word boundaries
    if (start > 0) {
      const spaceIndex = fullText.indexOf(' ', start);
      if (spaceIndex !== -1 && spaceIndex - start < 20) {
        start = spaceIndex + 1;
      }
    }

    if (end < fullText.length) {
      const spaceIndex = fullText.lastIndexOf(' ', end);
      if (spaceIndex !== -1 && end - spaceIndex < 20) {
        end = spaceIndex;
      }
    }

    const snippet = fullText.substring(start, end);
    let result = snippet;
    
    if (showEllipsis) {
      const prefix = start > 0 ? '...' : '';
      const suffix = end < fullText.length ? '...' : '';
      result = prefix + snippet + suffix;
    }

    return {
      snippet: result,
      truncated: start > 0 || end < fullText.length
    };
  };

  const { snippet } = createSnippet(text, searchTerms, maxLength);

  return (
    <HighlightedText
      text={snippet}
      searchTerms={searchTerms}
      options={options}
      component={component}
      sx={sx}
      highlightSx={highlightSx}
    />
  );
}