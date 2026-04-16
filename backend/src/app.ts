import express, { RequestHandler } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { characterCatalogSchema } from "./modules/character-catalog/infrastructure/entrypoints/graphql";
import { setupMiddlewares } from "./core/middlewares";

export const setupApp = async () => {
  const app = express();

  setupMiddlewares(app);

  const server = new ApolloServer({
    schema: characterCatalogSchema,
  });

  await server.start();

  app.use(
    "/graphql",
    expressMiddleware(server, {
      context: async ({ req }) => ({ req }),
    }) as unknown as RequestHandler
  );

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  return app;
};
