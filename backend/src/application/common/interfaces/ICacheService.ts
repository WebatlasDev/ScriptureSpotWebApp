/**
 * Interface for Redis cache service operations
 * Provides caching functionality for improving application performance
 */
export interface ICacheService {
  /**
   * Sets a value in the cache with optional expiration
   * @param key The cache key
   * @param value The value to cache
   * @param expirationSeconds Optional expiration time in seconds
   * @returns Promise that resolves when value is cached
   */
  setAsync<T>(key: string, value: T, expirationSeconds?: number): Promise<void>;

  /**
   * Gets a value from the cache
   * @param key The cache key
   * @returns Promise that resolves to the cached value or null if not found
   */
  getAsync<T>(key: string): Promise<T | null>;

  /**
   * Removes a value from the cache
   * @param key The cache key
   * @returns Promise that resolves when value is removed
   */
  removeAsync(key: string): Promise<void>;

  /**
   * Clears all values from the cache
   * @returns Promise that resolves when cache is cleared
   */
  clearAsync(): Promise<void>;

  /**
   * Checks if a key exists in the cache
   * @param key The cache key
   * @returns Promise that resolves to true if key exists
   */
  existsAsync(key: string): Promise<boolean>;
}
