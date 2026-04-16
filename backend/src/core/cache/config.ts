require("dotenv").config();

interface RedisConfig {
  url: string;
  host: string;
  port: number;
  password?: string;
  db: number;
}

export const getRedisConfig = (): RedisConfig => {
  return {
    url: process.env.REDIS_URL || `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || 6379}`,
    host: process.env.REDIS_HOST || "localhost",
    port: Number(process.env.REDIS_PORT) || 6379,
    password: process.env.REDIS_PASSWORD,
    db: Number(process.env.REDIS_DB) || 0,
  };
};
