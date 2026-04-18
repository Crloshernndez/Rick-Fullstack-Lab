export interface DatabaseConfig {
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

export declare function getDatabaseConfig(env?: string): DatabaseConfig;

declare const configs: {
  development: DatabaseConfig;
  test: DatabaseConfig;
  production: DatabaseConfig;
};

export default configs;
