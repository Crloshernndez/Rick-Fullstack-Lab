import express from "express";
import cors from "cors";

export const setupApp = async () => {
  const app = express();

  app.use(cors());
  app.use(express.json());

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  return app;
};
