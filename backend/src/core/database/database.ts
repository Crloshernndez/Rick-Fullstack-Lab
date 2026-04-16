import { Sequelize } from "sequelize-typescript";
import { Dialect } from "sequelize";

const { getDatabaseConfig } = require("./config");
const config = getDatabaseConfig();

export const sequelize = new Sequelize({
  ...config,
  dialect: config.dialect as Dialect,
  models: [__dirname + "/../../modules/**/models/*.model.ts"],
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
