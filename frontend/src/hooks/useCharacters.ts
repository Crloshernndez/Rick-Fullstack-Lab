import { gql } from "@apollo/client";
import type { Character, CharactersResponse } from "@/types";
import { useQuery } from "@apollo/client/react";

const GET_CHARACTERS = gql`
  query GetCharacters($page: Int!, $limit: Int!, $filters: CharacterFilters) {
    characters(page: $page, limit: $limit, filters: $filters) {
      info {
        count
        pages
      }
      results {
        id
        name
        status
        gender
        species
        image
      }
    }
  }
`;

interface CharactersVariables {
  page: number;
  limit: number;
  filters: Record<string, unknown>;
}

export function useCharacters(page = 1, limit = 10, filters = {}) {
  const { data, loading, error } = useQuery<
    CharactersResponse,
    CharactersVariables
  >(GET_CHARACTERS, {
    variables: { page, limit, filters },
  });

  return {
    characters: data?.characters.results || ([] as Character[]),
    info: data?.characters.info,
    loading,
    error,
  };
}
