interface DatabaseConfig {
  username: string;
  password: string;
  database: string;
  host: string;
  port: number;
  dialect: string;
  timezone: string;
  logging: boolean | ((sql: string, timing?: number) => void);
  pool: {
    max: number;
    min: number;
    acquire: number;
    idle: number;
  };
}

type Environment = "development" | "test" | "production";

const baseConfig = {
  username: process.env.POSTGRES_USER!,
  password: process.env.POSTGRES_PASSWORD!,
  host: process.env.POSTGRES_HOST!,
  port: Number(process.env.POSTGRES_PORT) || 5432,
  dialect: process.env.DB_DIALECT || "postgres",
  timezone: "+00:00",
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
};

const configs: Record<Environment, DatabaseConfig> = {
  development: {
    ...baseConfig,
    database: process.env.POSTGRES_DB!,
    logging: console.log,
  },
  test: {
    ...baseConfig,
    database: process.env.POSTGRES_DB + "_test",
    logging: false,
  },
  production: {
    ...baseConfig,
    database: process.env.POSTGRES_DB!,
    logging: false,
  },
};

module.exports = configs;

module.exports.getDatabaseConfig = (
  env: string = process.env.NODE_ENV || "development"
): DatabaseConfig => {
  const validEnv = ["development", "test", "production"].includes(env)
    ? (env as Environment)
    : "development";
  return configs[validEnv];
};
