'use client';

import React, { createContext, useContext, ReactNode } from 'react';
import { useAuthorsAuthors } from '@/hooks/useAuthorsAuthors';

interface Author {
  id: string;
  name: string;
  slug: string;
  image?: string;
  colorScheme?: {
    primary: string;
    gradient: string;
    outline: string;
    chipBackground: string;
    chipText: string;
    fadeColor: string;
  };
  nicknameOrTitle?: string;
  birthYear?: number;
  deathYear?: number;
  occupation?: string;
  nationality?: string;
  religiousTradition?: string;
}

interface AuthorContextType {
  authors: Author[];
  isLoading: boolean;
  error: any;
  getAuthorByName: (name: string) => Author | undefined;
  getAuthorBySlug: (slug: string) => Author | undefined;
}

const AuthorContext = createContext<AuthorContextType | undefined>(undefined);

interface AuthorProviderProps {
  children: ReactNode;
}

export function AuthorProvider({ children }: AuthorProviderProps) {
  const { data: authors = [], isLoading, error } = useAuthorsAuthors();

  const getAuthorByName = (name: string): Author | undefined => {
    if (!name || !authors) return undefined;
    
    // Try exact match first
    let author = authors.find((author: Author) => 
      author.name.toLowerCase() === name.toLowerCase()
    );
    
    // If no exact match, try partial match
    if (!author) {
      author = authors.find((author: Author) => 
        author.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(author.name.toLowerCase())
      );
    }
    
    // Try nickname or title match
    if (!author) {
      author = authors.find((author: Author) => 
        author.nicknameOrTitle?.toLowerCase() === name.toLowerCase() ||
        author.nicknameOrTitle?.toLowerCase().includes(name.toLowerCase())
      );
    }
    
    return author;
  };

  const getAuthorBySlug = (slug: string): Author | undefined => {
    if (!slug || !authors) return undefined;
    return authors.find((author: Author) => author.slug === slug);
  };

  const contextValue: AuthorContextType = {
    authors,
    isLoading,
    error,
    getAuthorByName,
    getAuthorBySlug
  };

  return (
    <AuthorContext.Provider value={contextValue}>
      {children}
    </AuthorContext.Provider>
  );
}

export function useAuthorContext(): AuthorContextType {
  const context = useContext(AuthorContext);
  if (context === undefined) {
    throw new Error('useAuthorContext must be used within an AuthorProvider');
  }
  return context;
}

// Hook for finding a specific author by name
export function useAuthorByName(name: string | null | undefined): Author | undefined {
  const { getAuthorByName } = useAuthorContext();
  return name ? getAuthorByName(name) : undefined;
}

// Hook for finding a specific author by slug
export function useAuthorBySlug(slug: string | null | undefined): Author | undefined {
  const { getAuthorBySlug } = useAuthorContext();
  return slug ? getAuthorBySlug(slug) : undefined;
}