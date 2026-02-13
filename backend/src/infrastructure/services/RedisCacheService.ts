import Redis from 'ioredis';
import { ICacheService } from '@/application/common/interfaces/ICacheService';

/**
 * Redis cache service implementation
 * Provides caching using Redis for improved application performance
 */
export class RedisCacheService implements ICacheService {
  private readonly redis: Redis;
  private readonly defaultExpirationSeconds = 1800; // 30 minutes

  constructor(redisUrl?: string) {
    const url = redisUrl || process.env.REDIS_URL || '';
    this.redis = new Redis(url, {
      maxRetriesPerRequest: 3,
      retryStrategy: (times: number) => {
        const delay = Math.min(times * 50, 2000);
        return delay;
      },
      reconnectOnError: (err) => {
        const targetError = 'READONLY';
        if (err.message.includes(targetError)) {
          // Only reconnect when the error contains "READONLY"
          return true;
        }
        return false;
      },
    });

    this.redis.on('error', (error) => {
      console.error('Redis connection error:', error);
    });

    this.redis.on('connect', () => {
      console.log('Redis connected successfully');
    });
  }

  /**
   * Sets a value in the cache with optional expiration
   * @param key The cache key
   * @param value The value to cache (will be JSON serialized)
   * @param expirationSeconds Optional expiration time in seconds (default: 30 minutes)
   */
  async setAsync<T>(key: string, value: T, expirationSeconds?: number): Promise<void> {
    try {
      const json = JSON.stringify(value);
      const expiration = expirationSeconds || this.defaultExpirationSeconds;
      
      await this.redis.setex(key, expiration, json);
    } catch (error) {
      console.error(`Failed to set cache for key ${key}:`, error);
      // Don't throw - cache failures should not break the application
    }
  }

  /**
   * Gets a value from the cache
   * @param key The cache key
   * @returns The cached value or null if not found or error occurred
   */
  async getAsync<T>(key: string): Promise<T | null> {
    try {
      const json = await this.redis.get(key);
      
      if (!json) {
        return null;
      }

      return JSON.parse(json) as T;
    } catch (error) {
      console.error(`Failed to get cache for key ${key}:`, error);
      return null;
    }
  }

  /**
   * Removes a value from the cache
   * @param key The cache key
   */
  async removeAsync(key: string): Promise<void> {
    try {
      await this.redis.del(key);
    } catch (error) {
      console.error(`Failed to remove cache for key ${key}:`, error);
    }
  }

  /**
   * Clears all values from the cache
   * Uses SCAN to iterate through keys in batches to avoid blocking
   */
  async clearAsync(): Promise<void> {
    try {
      let cursor = '0';
      const batchSize = 1000;

      do {
        // Use SCAN to iterate through keys without blocking
        const [newCursor, keys] = await this.redis.scan(
          cursor,
          'COUNT',
          batchSize
        );

        cursor = newCursor;

        if (keys.length > 0) {
          // Delete keys in pipeline for efficiency
          const pipeline = this.redis.pipeline();
          keys.forEach((key) => pipeline.del(key));
          await pipeline.exec();
        }
      } while (cursor !== '0');
    } catch (error) {
      console.error('Failed to clear Redis cache:', error);
    }
  }

  /**
   * Checks if a key exists in the cache
   * @param key The cache key
   * @returns True if the key exists, false otherwise
   */
  async existsAsync(key: string): Promise<boolean> {
    try {
      const result = await this.redis.exists(key);
      return result === 1;
    } catch (error) {
      console.error(`Failed to check existence of cache key ${key}:`, error);
      return false;
    }
  }

  /**
   * Closes the Redis connection
   * Should be called when shutting down the application
   */
  async disconnect(): Promise<void> {
    await this.redis.quit();
  }

  /**
   * Gets the current Redis connection status
   */
  isConnected(): boolean {
    return this.redis.status === 'ready';
  }
}

// Singleton instance
let cacheServiceInstance: RedisCacheService | null = null;

export function getCacheService(): RedisCacheService {
  if (!cacheServiceInstance) {
    cacheServiceInstance = new RedisCacheService();
  }
  return cacheServiceInstance;
}

export const redisCacheService = getCacheService();
