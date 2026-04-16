export const characterTypeDefs = `
  type Character {
    id: ID!
    name: String!
    status: String!
    species: String!
    image: String!
  }

  type Query {
    searchCharacters: [Character!]!
  }
`;
