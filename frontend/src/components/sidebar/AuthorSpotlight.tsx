'use client';

import React, { useState, useEffect } from 'react';
import { Box, Typography } from '@mui/material';
import { PersonOutline as PersonIcon } from '@/components/ui/phosphor-icons';
import Image from 'next/image';
import Link from 'next/link';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';
import { AuthorFromAPI } from '@/types/author';

export default function AuthorSpotlight() {
  const [selectedAuthor, setSelectedAuthor] = useState<AuthorFromAPI | null>(null);
  const { data: authors, isLoading } = useAuthorsAuthors();

  useEffect(() => {
    if (authors?.length) {
      // Check if we have a stored author for today
      const today = new Date().toDateString();
      const storedData = localStorage.getItem('authorSpotlight');
      
      if (storedData) {
        try {
          const { date, author } = JSON.parse(storedData);
          if (date === today) {
            setSelectedAuthor(author);
            return;
          }
        } catch {
        }
      }
      
      // Select a new author for today
      const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (24 * 60 * 60 * 1000));
      const authorIndex = dayOfYear % authors.length;
      const author = authors[authorIndex];
      
      setSelectedAuthor(author);
      
      // Store for today
      localStorage.setItem('authorSpotlight', JSON.stringify({
        date: today,
        author: author
      }));
    }
  }, [authors]);

  const defaultColors = {
    primary: '#278EFF',
    gradient: 'linear-gradient(0deg, rgba(39, 129, 255, 0.10) 0%, rgba(39, 129, 255, 0.10) 100%), #121212',
    outline: 'rgba(39, 129, 255, 0.20)',
    chipBackground: 'rgba(39, 129, 255, 0.30)',
    chipText: '#96C2FF',
    fadeColor: '#141D2A',
  };

  if (isLoading || !selectedAuthor) {
    return (
      <Box
        sx={{
          backgroundColor: '#1A1A1A',
          borderRadius: 2,
          p: 2.5,
          border: '1px solid rgba(255, 255, 255, 0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <PersonIcon
            sx={{
              width: 14,
              height: 14,
              color: '#FFD700',
            }}
          />
          <Typography
            sx={{
              color: '#FFFAFA',
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Author Spotlight
          </Typography>
        </Box>
        <Typography
          sx={{
            color: 'rgba(255, 255, 255, 0.6)',
            fontSize: 12,
            fontWeight: 400,
            lineHeight: 1.4,
            textAlign: 'center',
            py: 2,
          }}
        >
          Loading featured author...
        </Typography>
      </Box>
    );
  }

  const colors = selectedAuthor.colorScheme ?? defaultColors;
  
  // Create formatted years display
  const yearsDisplay = (() => {
    if (selectedAuthor.birthYear && selectedAuthor.deathYear) {
      return `${selectedAuthor.birthYear}–${selectedAuthor.deathYear}`;
    } else if (selectedAuthor.birthYear) {
      return `${selectedAuthor.birthYear}–`;
    }
    return '';
  })();

  // Select primary tag for display
  const primaryTag = selectedAuthor.occupation || selectedAuthor.nationality || selectedAuthor.religiousTradition;

  return (
    <Link href={`/commentators/${selectedAuthor.slug}/commentaries`} style={{ textDecoration: 'none' }}>
      <Box
        sx={{
          backgroundColor: '#1A1A1A',
          borderRadius: 3.5,
          p: 2.5,
          border: '2px solid rgba(255, 255, 255, 0.10)',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.05)',
            border: '2px solid rgba(255, 255, 255, 0.20)',
          },
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            mb: 2,
          }}
        >
          <PersonIcon
            sx={{
              width: 14,
              height: 14,
              color: '#FFD700',
            }}
          />
          <Typography
            sx={{
              color: '#FFFAFA',
              fontSize: 14,
              fontWeight: 700,
              lineHeight: 1.4,
            }}
          >
            Author Spotlight
          </Typography>
        </Box>

        {/* Author Content */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
          }}
        >
          {/* Author Image */}
          <Box
            sx={{
              position: 'relative',
              width: 48,
              height: 48,
              borderRadius: '50%',
              background: `linear-gradient(216deg, ${colors.primary} 0%, black 100%)`,
              overflow: 'hidden',
              flexShrink: 0,
            }}
          >
            {selectedAuthor.image && (
              <Image
                src={selectedAuthor.image}
                alt={selectedAuthor.name}
                width={48}
                height={48}
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  objectFit: 'cover' 
                }}
              />
            )}
          </Box>

          {/* Author Info */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              sx={{
                color: '#FFFAFA',
                fontSize: 16,
                fontWeight: 600,
                lineHeight: 1.4,
                mb: 0.5,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {selectedAuthor.name}
            </Typography>
            
            <Box
              sx={{
                display: 'flex',
                gap: 1,
                alignItems: 'center',
                flexWrap: 'wrap',
              }}
            >
              {primaryTag && (
                <Typography
                  sx={{
                    color: colors.chipText,
                    fontSize: 10,
                    fontWeight: 700,
                    backgroundColor: colors.chipBackground,
                    px: 1,
                    py: 0.25,
                    borderRadius: 0.5,
                    lineHeight: 1.2,
                  }}
                >
                  {primaryTag}
                </Typography>
              )}
              {yearsDisplay && (
                <Typography
                  sx={{
                    color: 'rgba(255, 255, 255, 0.6)',
                    fontSize: 10,
                    fontWeight: 400,
                    lineHeight: 1.2,
                  }}
                >
                  {yearsDisplay}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>

      </Box>
    </Link>
  );
}