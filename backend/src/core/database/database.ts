import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";
import { User } from "../../shared/models/User.model";
import { Character } from "../../modules/character-catalog/infrastructure/persistence/sequelize/models/Character.model";
import { Favorite } from "../../modules/user-preferences/infrastructure/persistence/sequelize/models/Favorite.model";
import { Comment } from "../../modules/user-preferences/infrastructure/persistence/sequelize/models/Comment.model";
import { CronLog } from "../../modules/data-sync/infrastructure/persistence/sequelize/models/CronLog.model";

import { getDatabaseConfig } from "./config";

const config = getDatabaseConfig(process.env.NODE_ENV);

export const sequelize = new Sequelize({
  ...config,
  dialect: config.dialect as Dialect,
  models: [User, Character, Favorite, Comment, CronLog],
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
