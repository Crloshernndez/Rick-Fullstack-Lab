import { gql } from "@apollo/client";

export const GET_CHARACTERS = gql`
  query GetCharacters(
    $page: Int
    $limit: Int
    $filters: CharacterFilters
    $sorting: String
  ) {
    characters(
      page: $page
      limit: $limit
      filters: $filters
      sorting: $sorting
    ) {
      info {
        count
        pages
        next
        prev
      }
      results {
        id
        name
        status
        species
        image
      }
    }
  }
`;
