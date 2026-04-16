import { gql } from '@apollo/client';

export const SEARCH_CHARACTERS = gql`
  query SearchCharacters {
    searchCharacters {
      id
      name
      status
      species
      image
    }
  }
`;
