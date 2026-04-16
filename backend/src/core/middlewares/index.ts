import { Express } from "express";
import cors from "cors";
import express from "express";
import { loggerMiddleware } from "./logger.middleware";

export const setupMiddlewares = (app: Express) => {
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(loggerMiddleware);
};

export { loggerMiddleware } from "./logger.middleware";
