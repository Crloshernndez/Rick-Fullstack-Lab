import { apolloClient } from "@/lib/apollo-client";
import { SEARCH_CHARACTERS } from "@/services/graphql/queries";
import type { Character, SearchCharactersResponse } from "@/types";

export const characterService = {
  /**
   * Fetch all characters
   */
  async searchCharacters(): Promise<Character[]> {
    try {
      const { data } = await apolloClient.query<SearchCharactersResponse>({
        query: SEARCH_CHARACTERS,
      });
      return data?.searchCharacters || [];
    } catch (error) {
      console.error("Error fetching characters:", error);
      throw error;
    }
  },

  /**
   * Using Apollo Client's useQuery hook (for components)
   * Import this in your React component:
   *
   * import { useQuery } from '@apollo/client';
   * import { SEARCH_CHARACTERS } from '@/services/graphql/queries';
   *
   * const { data, loading, error } = useQuery(SEARCH_CHARACTERS);
   */
};
