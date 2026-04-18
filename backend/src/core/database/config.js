const baseConfig = {
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  host: process.env.POSTGRES_HOST,
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

const configs = {
  development: {
    ...baseConfig,
    database: process.env.POSTGRES_DB,
    logging: console.log,
  },
  test: {
    ...baseConfig,
    database: process.env.POSTGRES_DB + "_test",
    logging: false,
  },
  production: {
    ...baseConfig,
    database: process.env.POSTGRES_DB,
    logging: false,
  },
};

module.exports = configs;

module.exports.getDatabaseConfig = (
  env = process.env.NODE_ENV || "development"
) => {
  const validEnv = ["development", "test", "production"].includes(env)
    ? env
    : "development";
  return configs[validEnv];
};
