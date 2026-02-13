import { PaginatedResponse } from '@/types/pagination';

type PaginatedLike<T> = PaginatedResponse<T> | {
  items?: T | null | undefined;
  metaData?: unknown;
};

export function extractPaginatedItems<T>(value: T | PaginatedLike<T> | null | undefined): T | null | undefined {
  if (!value || typeof value !== 'object') {
    return value as T | null | undefined;
  }

  if (value instanceof PaginatedResponse) {
    return value.items;
  }

  if ('items' in value) {
    const { items } = value as PaginatedLike<T>;
    return items ?? null;
  }

  return value as T | null | undefined;
}
