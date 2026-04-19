export const characterTypeDefs = `
  type Character {
    id: ID!
    externalId: Int!
    name: String!
    status: String
    species: String
    type: String
    gender: String
    origin: Origin
    location: Location
    image: String
    isSynced: Boolean!
    isDeprecated: Boolean!
    createdAt: String!
    updatedAt: String!
    lastSyncAt: String
  }

  type Origin {
    name: String!
    id: Int
  }

  type Location {
    name: String!
    id: Int
  }

  type PaginationInfo {
    count: Int!
    pages: Int!
    next: Int
    prev: Int
  }

  type CharacterConnection {
    info: PaginationInfo!
    results: [Character!]!
  }

  input CharacterFilters {
    status: String
    gender: String
    species: String
    name: String
    origin: String
  }

  type DeleteCharacterResponse {
    success: Boolean!
    message: String!
  }

  type Query {
    characters(page: Int, limit: Int, filters: CharacterFilters): CharacterConnection!
  }

  type Mutation {
    deleteCharacter(id: ID!): DeleteCharacterResponse!
  }
`;
