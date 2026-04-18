import express, { RequestHandler } from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { GraphQLFormattedError } from "graphql";
import { characterCatalogSchema } from "./modules/character-catalog/infrastructure/entrypoints/graphql";
import { setupMiddlewares } from "./core/middlewares";
import { BaseApplicationError } from "./shared/exceptions/base-application-error";
import { Container } from "./core/di/container";

const isDevelopment = process.env.NODE_ENV == "development";

/**
 * GraphQL context type with DI container and request.
 */
export interface GraphQLContext {
  req: express.Request;
  container: Container;
}

export const setupApp = async (container: Container) => {
  const app = express();

  setupMiddlewares(app);

  const server = new ApolloServer<GraphQLContext>({
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
      context: async ({ req }): Promise<GraphQLContext> => ({
        req: req as any as express.Request,
        container,
      }),
    }) as unknown as RequestHandler
  );

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "ok", message: "Server is running" });
  });

  return app;
};
