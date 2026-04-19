import { createClient, RedisClientType } from "redis";
import { getRedisConfig } from "./config";
import { serialize, deserialize, makeKey } from "./helpers";
import { CachePort } from "../../shared/domain/ports/cache.port";

/**
 * Singleton cache client backed by Redis.
 *
 * Provides a high-level interface for common caching operations — get, set,
 * increment, and namespace flushing — with built-in serialization, lazy
 * connection management, and graceful error handling.
 *
 * Errors in `get` and `set` are caught and logged as warnings rather than
 * thrown, treating the cache as a best-effort layer that never breaks the
 * main application flow.
 *
 * @example
 * const cache = await RedisCache.getInstance();
 *
 * await cache.set('user:42', { name: 'Rick' }, 3600, 'users');
 * const user = await cache.get('user:42', 'users');
 *
 * await cache.flushNamespace('users');
 * await cache.close();
 */
class RedisCache implements CachePort {
  /** The single shared instance of this class. */
  private static instance: RedisCache;

  /** Underlying Redis client used for all operations. */
  private client: RedisClientType;

  /** Tracks whether the client has an active connection to Redis. */
  private isConnected: boolean = false;

  /**
   * Initializes the Redis client with the application configuration
   * and registers event listeners for connection lifecycle events.
   *
   * Private — use {@link getInstance} to obtain the shared instance.
   */
  private constructor() {
    const config = getRedisConfig();
    this.client = createClient({ url: config.url });

    this.client.on("error", (err) =>
      console.error("❌ Redis Client Error", err)
    );
    this.client.on("connect", () =>
      console.log("✅ Redis connected successfully")
    );
  }

  /**
   * Returns the shared `RedisCache` instance, creating it if it does not exist.
   *
   * The instance is created lazily on the first call and reused on all
   * subsequent calls, ensuring a single Redis connection per process.
   *
   * @returns The shared `RedisCache` instance.
   */
  public static getInstance(): RedisCache {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  /**
   * Ensures the Redis client is connected before performing any operation.
   *
   * Connects lazily on the first call and reuses the existing connection
   * on all subsequent calls.
   *
   * @returns The connected Redis client.
   */
  private async ensureConnection() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
    return this.client;
  }

  /**
   * Retrieves and deserializes a value from the cache.
   *
   * Returns `null` if the key does not exist or if the operation fails.
   * Failures are logged as warnings and never propagated, keeping the
   * cache transparent to the caller.
   *
   * @param key - The cache key.
   * @param namespace - Optional namespace prepended to the key (e.g. `"users"`).
   * @returns The deserialized cached value, or `null` on miss or error.
   *
   * @example
   * const character = await cache.get('42', 'characters');
   */
  async get(key: string, namespace?: string): Promise<any> {
    const cacheKey = makeKey(key, namespace);
    try {
      const client = await this.ensureConnection();
      const value = await client.get(cacheKey);
      return deserialize(value);
    } catch (error) {
      console.warn(`Cache GET failed for ${cacheKey}`, error);
      return null;
    }
  }

  /**
   * Serializes and stores a value in the cache.
   *
   * Returns `false` if the operation fails rather than throwing, so a
   * cache write failure never interrupts the main application flow.
   *
   * @param key - The cache key.
   * @param value - The value to cache. Will be serialized before storage.
   * @param expireSeconds - Optional TTL in seconds. If omitted, the key persists indefinitely.
   * @param namespace - Optional namespace prepended to the key.
   * @returns `true` if the value was stored successfully, `false` otherwise.
   *
   * @example
   * await cache.set('42', character, 3600, 'characters');
   */
  async set(
    key: string,
    value: any,
    expireSeconds?: number,
    namespace?: string
  ): Promise<boolean> {
    const cacheKey = makeKey(key, namespace);
    try {
      const client = await this.ensureConnection();
      const serializedValue = serialize(value);

      if (expireSeconds) {
        await client.set(cacheKey, serializedValue, { EX: expireSeconds });
      } else {
        await client.set(cacheKey, serializedValue);
      }
      return true;
    } catch (error) {
      console.warn(`Cache SET failed for ${cacheKey}`, error);
      return false;
    }
  }

  /**
   * Atomically increments a numeric counter in the cache.
   *
   * If the key is being set for the first time (counter goes from 0 to `amount`),
   * a TTL is applied automatically if `expireSeconds` is provided. This pattern
   * ensures counters always expire even when they are created implicitly.
   *
   * Useful for rate limiting, request counting, or any sliding window metric.
   *
   * @param key - The cache key of the counter.
   * @param amount - Amount to increment by (default: `1`).
   * @param expireSeconds - TTL in seconds applied only on the first increment.
   * @param namespace - Optional namespace prepended to the key.
   * @returns The new value of the counter after incrementing.
   *
   * @example
   * // Rate limiting: max 100 requests per hour
   * const requests = await cache.incr(userId, 1, 3600, 'rate-limit');
   * if (requests > 100) throw new RateLimitException();
   */
  async incr(
    key: string,
    amount: number = 1,
    expireSeconds?: number,
    namespace?: string
  ): Promise<number> {
    const cacheKey = makeKey(key, namespace);
    const client = await this.ensureConnection();

    const newValue = await client.incrBy(cacheKey, amount);

    // Only set expiry on the first increment to avoid resetting the window
    if (newValue === amount && expireSeconds) {
      await client.expire(cacheKey, expireSeconds);
    }
    return newValue;
  }

  /**
   * Deletes all keys belonging to a given namespace.
   *
   * Uses `SCAN` with a pattern match instead of `KEYS` to avoid blocking
   * the Redis event loop on large keyspaces.
   *
   * @param namespace - The namespace whose keys should be deleted (e.g. `"characters"`).
   * @returns The total number of keys deleted.
   *
   * @example
   * const deleted = await cache.flushNamespace('characters');
   * console.log(`Cleared ${deleted} cached entries`);
   */
  async flushNamespace(namespace: string): Promise<number> {
    const client = await this.ensureConnection();
    const pattern = `${namespace}:*`;
    let count = 0;

    for await (const key of client.scanIterator({ MATCH: pattern })) {
      await client.del(key);
      count++;
    }
    return count;
  }

  /**
   * Checks whether the Redis connection is alive.
   *
   * Sends a `PING` command and verifies the expected `PONG` response.
   * Useful for health checks and readiness probes.
   *
   * @returns `true` if Redis responded correctly, `false` otherwise.
   *
   * @example
   * const healthy = await cache.ping();
   * if (!healthy) console.error('Redis is unreachable');
   */
  async ping(): Promise<boolean> {
    try {
      const client = await this.ensureConnection();
      const response = await client.ping();
      return response === "PONG";
    } catch (error) {
      console.error("Redis ping failed:", error);
      return false;
    }
  }

  /**
   * Gracefully closes the Redis connection.
   *
   * Uses `QUIT` to allow pending commands to complete before disconnecting.
   * Safe to call multiple times — subsequent calls are no-ops if already disconnected.
   *
   * Should be called during application shutdown to avoid connection leaks.
   *
   * @example
   * process.on('SIGTERM', async () => {
   *   await cache.close();
   *   process.exit(0);
   * });
   */
  async close() {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log("✅ Redis connection closed");
    }
  }
}

export default RedisCache;
