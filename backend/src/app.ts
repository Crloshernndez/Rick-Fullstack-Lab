import express, { RequestHandler } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLFormattedError } from "graphql";
import { characterCatalogSchema } from "./modules/character-catalog/infrastructure/entrypoints/graphql";
import { setupMiddlewares } from "./core/middlewares";
import { BaseApplicationError } from "./shared/exceptions/base-application-error";

const isDevelopment = process.env.NODE_ENV == "development";

export const setupApp = async () => {
  const app = express();

  setupMiddlewares(app);

  const server = new ApolloServer({
    schema: characterCatalogSchema,
    formatError: (formattedError, error): GraphQLFormattedError => {
      const originalError = (error as any)?.originalError;

      console.error("GraphQL Error:", {
        message: formattedError.message,
        path: formattedError.path,
        extensions: formattedError.extensions,
      });

      if (originalError instanceof BaseApplicationError) {
        return {
          message: originalError.message,
          extensions: {
            code: originalError.errorCode,
            status: originalError.statusCode,
            details: originalError.details,
          },
        };
      }

      return {
        message: isDevelopment
          ? formattedError.message
          : "Internal server error",
        extensions: {
          code: "INTERNAL_SERVER_ERROR",
          status: 500,
          ...(isDevelopment && { stack: (error as any)?.stack }),
        },
      };
    },
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
