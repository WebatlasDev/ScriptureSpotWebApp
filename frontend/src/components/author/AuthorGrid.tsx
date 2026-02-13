'use client';

import { useState, useEffect, useMemo } from 'react';
import { Box, Grid, Typography } from '@mui/material';
import AuthorCard from './AuthorCard';
import FilterBar from './FilterBar';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';
import { AuthorFromAPI } from '@/types/author';
import LoadingSpinner from '../ui/LoadingSpinner';
import CommentatorConsensusCard from '../commentators/CommentatorConsensusCard';

interface AuthorGridProps {
  authors?: AuthorFromAPI[] | null;
  fetchError?: string | null;
}

export default function AuthorGrid({ authors: initialAuthors, fetchError }: AuthorGridProps = {}) {
  const hasPrefetchedAuthors = Array.isArray(initialAuthors) && (initialAuthors?.length ?? 0) > 0 && !fetchError;
  const shouldFetchOnClient = !hasPrefetchedAuthors;
  const { data: authors, isLoading, error } = useAuthorsAuthors({
    enabled: shouldFetchOnClient,
    initialData: hasPrefetchedAuthors ? initialAuthors ?? undefined : undefined,
  });
  const [filteredAuthors, setFilteredAuthors] = useState<AuthorFromAPI[]>([]);
  const [sortBy, setSortBy] = useState<string>('name-asc');
  const [activeFilters, setActiveFilters] = useState<Record<string, string[]>>({});
  

  // Create available filters based on the author data we have
  const resolvedAuthors = useMemo(() => {
    if (hasPrefetchedAuthors && initialAuthors) {
      return initialAuthors as AuthorFromAPI[];
    }

    return (authors ?? []) as AuthorFromAPI[];
  }, [authors, hasPrefetchedAuthors, initialAuthors]);

  const clientError = error ? (error instanceof Error ? error.message : String(error)) : null;
  const serverError = shouldFetchOnClient ? fetchError : null;
  const isLoadingState = shouldFetchOnClient && isLoading;
  const shouldShowServerError = Boolean(serverError && !isLoadingState && resolvedAuthors.length === 0);
  const queryError = clientError ?? (shouldShowServerError ? serverError : null);

  const availableFilters = useMemo(() => {
    if (!resolvedAuthors || resolvedAuthors.length === 0) {
      return [];
    }
    
    // Extract unique occupations
    const occupations = new Set<string>();
    resolvedAuthors.forEach(author => {
      if (author.occupation) occupations.add(author.occupation);
    });
    
    // Extract unique nationalities
    const nationalities = new Set<string>();
    resolvedAuthors.forEach(author => {
      if (author.nationality) nationalities.add(author.nationality);
    });
    
    // Extract unique religious traditions
    const traditions = new Set<string>();
    resolvedAuthors.forEach(author => {
      if (author.religiousTradition) traditions.add(author.religiousTradition);
    });
    
    const filters: { category: string; values: string[] }[] = [];
    if (occupations.size > 0) {
      filters.push({
        category: 'Occupation',
        values: Array.from(occupations).sort()
      });
    }
    if (nationalities.size > 0) {
      filters.push({
        category: 'Nationality',
        values: Array.from(nationalities).sort()
      });
    }
    if (traditions.size > 0) {
      filters.push({
        category: 'Religious Tradition',
        values: Array.from(traditions).sort()
      });
    }
    
    return filters;
  }, [resolvedAuthors]);
  
  // Handle filter changes
  const handleFilterChange = (filters: Record<string, string[]>) => {
    if (!resolvedAuthors || resolvedAuthors.length === 0) return;
    
    setActiveFilters(filters);
    
    if (Object.keys(filters).length === 0) {
      setFilteredAuthors([...resolvedAuthors]);
      return;
    }
    
    const filtered = resolvedAuthors.filter((author) => {
      return Object.entries(filters).every(([category, values]) => {
        if (category === 'Occupation') {
          return values.includes(author.occupation || '');
        }
        if (category === 'Nationality') {
          return values.includes(author.nationality || '');
        }
        if (category === 'Religious Tradition') {
          return values.includes(author.religiousTradition || '');
        }
        return true;
      });
    });
    
    setFilteredAuthors(filtered);
    
    // Apply current sort to filtered results
    sortAuthors(filtered, sortBy);
  };
  
  // Handle sort changes
  const handleSortChange = (sortOption: string) => {
    setSortBy(sortOption);
    
    const authorsToSort = filteredAuthors.length > 0 ? [...filteredAuthors] : [...resolvedAuthors];
    sortAuthors(authorsToSort, sortOption);
  };
  
  // Helper function to sort authors
  const sortAuthors = (authorsToSort: AuthorFromAPI[], sortOption: string) => {
    let sorted = [...authorsToSort];
    
    switch (sortOption) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case 'birth-year-asc':
        sorted.sort((a, b) => (a.birthYear || 0) - (b.birthYear || 0));
        break;
      case 'birth-year-desc':
        sorted.sort((a, b) => (b.birthYear || 0) - (a.birthYear || 0));
        break;
      default:
        break;
    }
    
    setFilteredAuthors(sorted);
  };
  
  // Initialize filtered authors with all authors when they first load
  useEffect(() => {
    if (resolvedAuthors.length > 0) {
      setFilteredAuthors([...resolvedAuthors]);
      sortAuthors(resolvedAuthors, sortBy);
    }
  }, [resolvedAuthors, sortBy]);

  if (isLoadingState) {
    return (
      <Box sx={{ padding: 3, display: 'flex', justifyContent: 'center' }}>
        <LoadingSpinner />
      </Box>
    );
  }
  if (queryError) {
    return (
      <Box sx={{ padding: 3, color: 'error.main' }}>
        Error loading authors: {queryError}
      </Box>
    );
  }
  if (resolvedAuthors.length === 0) {
    return (
      <Box sx={{ padding: 3, color: 'text.secondary', textAlign: 'center' }}>
        <Typography>No authors found.</Typography>
        <Box 
          sx={{
            padding: 2, 
            margin: 2, 
            border: '1px dashed rgba(255,255,255,0.2)',
            borderRadius: 2
          }}
        >
        </Box>
      </Box>
    );
  }

  const displayAuthors = filteredAuthors.length > 0 ? filteredAuthors : resolvedAuthors;
  
  // Show CommentatorConsensusCard only when no filters are active and sort is default
  const shouldShowConsensusCard = Object.keys(activeFilters).length === 0 && sortBy === 'name-asc';

  return (
    <Box sx={{ width: '100%', mb: 4 }}>
      {/* Only show filter bar if we have filter options */}
      {availableFilters.length > 0 && (
        <FilterBar 
          availableFilters={availableFilters}
          onFilterChange={handleFilterChange}
          onSortChange={handleSortChange}
        />
      )}
      
      <Grid container spacing={3}>
        {shouldShowConsensusCard && (
          <Grid item xs={12} key="commentator-consensus">
            <CommentatorConsensusCard />
          </Grid>
        )}
        {displayAuthors.map((author) => (
          <Grid item xs={12} md={6} key={author.id}>
            <AuthorCard 
              author={author}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
