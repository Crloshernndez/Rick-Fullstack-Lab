import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { Character } from "../../modules/character-catalog/infrastructure/persistence/sequelize/models/Character.model";
import { CronLog } from "../../modules/data-sync/infrastructure/persistence/sequelize/models/CronLog.model";

import { getDatabaseConfig } from "./config";

const config = getDatabaseConfig(process.env.NODE_ENV);

export const sequelize = new Sequelize({
  ...config,
  dialect: config.dialect as Dialect,
  models: [Character, CronLog],
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ Database connection has been established successfully.");
  } catch (error) {
    console.error("❌ Unable to connect to the database:", error);
    process.exit(1);
  }
};
