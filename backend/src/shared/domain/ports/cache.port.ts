/**
 * Port defining the contract for a cache provider.
 *
 * Decouples the application layer from any specific cache implementation,
 * allowing Redis, Memcached, or an in-memory cache to be swapped freely.
 */
export interface CachePort {
  get(key: string, namespace?: string): Promise<any>;
  set(
    key: string,
    value: any,
    expireSeconds?: number,
    namespace?: string
  ): Promise<boolean>;
  flushNamespace(namespace: string): Promise<number>;
}
