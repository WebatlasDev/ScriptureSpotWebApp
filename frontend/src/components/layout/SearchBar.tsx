'use client';

import React, { useEffect, useState, useTransition } from 'react';
import { Box, InputBase, CircularProgress } from '@mui/material';
import { Search as SearchIcon } from '@/components/ui/phosphor-icons';
import { useRouter } from 'next/navigation';

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchTerm.trim();
    if (!query) return;

    setIsSubmitting(true);
    startTransition(() => {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    });
  };

  useEffect(() => {
    if (!isPending) {
      setIsSubmitting(false);
    }
  }, [isPending]);

  const baseBackground = isFocused ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.10)';
  const showSpinner = isSubmitting || isPending;

  return (
    <Box
      component="form"
      onSubmit={handleSearch}
      sx={{
        width: { xs: '100%', sm: '320px', md: '360px', lg: '420px' },
        maxWidth: '100%',
        height: 38,
        display: 'flex',
        alignItems: 'center',
        gap: 1,
        position: 'relative',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          flex: 1,
          minWidth: 0,
          height: '100%',
          borderRadius: '10px',
          overflow: 'hidden',
          backgroundColor: baseBackground,
          transition: 'background-color 0.2s ease',
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.16)',
          },
        }}
      >
        <Box
          sx={{
            width: 38,
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: isFocused ? 'rgba(255, 255, 255, 0.18)' : 'rgba(255, 255, 255, 0.12)',
            borderRight: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: '10px 0 0 10px',
            pl: 0.2,
          }}
        >
          <SearchIcon sx={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: 19 }} />
        </Box>
        <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', pl: 1.4, pr: 1 }}>
          <InputBase
            placeholder="Search any verse, author, commentary..."
            aria-label="Search Scripture Spot"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            sx={{
              color: 'white',
              height: '100%',
              width: '100%',
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: 0,
              '& ::placeholder': {
                color: 'rgba(255, 255, 255, 0.55)',
                opacity: 1,
              },
            }}
          />
        </Box>
      </Box>
      {showSpinner && (
        <Box
          sx={{
            position: 'absolute',
            right: 15,
            top: '50%',
            transform: 'translateY(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            pointerEvents: 'none',
          }}
        >
          <CircularProgress size={16} thickness={5} sx={{ color: '#E3E8FF' }} />
        </Box>
      )}
    </Box>
  );
};

export default SearchBar;
