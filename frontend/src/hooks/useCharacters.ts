import { GET_CHARACTERS } from "@/services/graphql/queries";
import type { Character, CharactersResponse } from "@/types";
import { useQuery } from "@apollo/client/react";

interface CharactersVariables {
  page: number;
  limit: number;
  filters: Record<string, unknown>;
  sorting: string;
}

export function useCharacters(
  page = 1,
  limit = 10,
  filters = {},
  sorting = "ASC"
) {
  const { data, loading, error } = useQuery<
    CharactersResponse,
    CharactersVariables
  >(GET_CHARACTERS, {
    variables: { page, limit, filters, sorting },
  });

  return {
    characters: data?.characters.results || ([] as Character[]),
    info: data?.characters.info,
    loading,
    error,
  };
}
