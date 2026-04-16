import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

const typeDefs = `#graphql
  type Query {
    hello: String
    ping: String
  }
`;

const resolvers = {
  Query: {
    hello: () => "Hola desde el Backend!",
    ping: () => "pong",
  },
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  // Iniciamos el servidor en el puerto 4000
  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Servidor listo en: ${url}`);
}

startServer();
