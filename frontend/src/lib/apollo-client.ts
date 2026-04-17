import { ApolloClient, InMemoryCache, HttpLink, from } from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import type { GraphQLError } from "graphql";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000/graphql";

// Error handling link
const errorLink = onError((errorResponse) => {
  const { graphQLErrors, networkError } = errorResponse as {
    graphQLErrors?: readonly GraphQLError[];
    networkError?: Error | null;
  };

  if (graphQLErrors) {
    graphQLErrors.forEach((error: GraphQLError) =>
      console.error(
        `[GraphQL error]: Message: ${error.message}, Location: ${error.locations}, Path: ${error.path}`
      )
    );
  }
  if (networkError) {
    console.error(`[Network error]: ${networkError}`);
  }
});

// HTTP link
const httpLink = new HttpLink({
  uri: API_URL,
  credentials: "same-origin",
});

// Apollo Client instance
export const apolloClient = new ApolloClient({
  link: from([errorLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          searchCharacters: {
            merge(_existing, incoming) {
              return incoming;
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    },
    query: {
      fetchPolicy: "network-only",
      errorPolicy: "all",
    },
    mutate: {
      errorPolicy: "all",
    },
  },
});
