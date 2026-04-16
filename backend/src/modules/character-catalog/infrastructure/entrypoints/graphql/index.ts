import { makeExecutableSchema } from "@graphql-tools/schema";
import { characterTypeDefs } from "./types/character.type";
import { characterResolvers } from "./resolvers/character.resolver";

// Este es el "pegamento" de tu Bounded Context
export const characterCatalogSchema = makeExecutableSchema({
  typeDefs: [characterTypeDefs],
  resolvers: [characterResolvers],
});
