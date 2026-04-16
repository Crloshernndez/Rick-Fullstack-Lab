import RedisCache from "./redis-client";

export const connectRedis = async (): Promise<boolean> => {
  const redis = await RedisCache.getInstance();
  return redis.ping();
};

export const cacheGet = async (key: string, namespace?: string) =>
  (await RedisCache.getInstance()).get(key, namespace);

export const cacheSet = async (
  key: string,
  value: any,
  expireSeconds?: number,
  namespace?: string
) => (await RedisCache.getInstance()).set(key, value, expireSeconds, namespace);

export const cacheIncr = async (
  key: string,
  amount: number = 1,
  expireSeconds?: number,
  namespace?: string
) =>
  (await RedisCache.getInstance()).incr(key, amount, expireSeconds, namespace);

export const cacheFlushNamespace = async (namespace: string) =>
  (await RedisCache.getInstance()).flushNamespace(namespace);

export const closeRedis = async () => (await RedisCache.getInstance()).close();
