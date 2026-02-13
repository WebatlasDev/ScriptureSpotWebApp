/**
 * Global TypeScript type definitions
 */

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  errors?: string[];
  message?: string;
}

// Query parameters
export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Common types
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
