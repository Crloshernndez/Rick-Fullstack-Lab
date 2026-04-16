import { createClient, RedisClientType } from "redis";
import { getRedisConfig } from "./config";
import { serialize, deserialize, makeKey } from "./helpers";

class RedisCache {
  private static instance: RedisCache;
  private client: RedisClientType;
  private isConnected: boolean = false;

  private constructor() {
    const config = getRedisConfig();
    this.client = createClient({ url: config.url });

    this.client.on("error", (err) => console.error("❌ Redis Client Error", err));
    this.client.on("connect", () => console.log("✅ Redis connected successfully"));
  }

  public static async getInstance(): Promise<RedisCache> {
    if (!RedisCache.instance) {
      RedisCache.instance = new RedisCache();
    }
    return RedisCache.instance;
  }

  private async ensureConnection() {
    if (!this.isConnected) {
      await this.client.connect();
      this.isConnected = true;
    }
    return this.client;
  }

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

  async incr(
    key: string,
    amount: number = 1,
    expireSeconds?: number,
    namespace?: string
  ): Promise<number> {
    const cacheKey = makeKey(key, namespace);
    const client = await this.ensureConnection();

    const newValue = await client.incrBy(cacheKey, amount);

    if (newValue === amount && expireSeconds) {
      await client.expire(cacheKey, expireSeconds);
    }
    return newValue;
  }

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

  async close() {
    if (this.isConnected) {
      await this.client.quit();
      this.isConnected = false;
      console.log("✅ Redis connection closed");
    }
  }
}

export default RedisCache;
