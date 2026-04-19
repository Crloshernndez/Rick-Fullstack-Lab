import { CharacterFilters } from "../../../../application/dtos/character-filters.dto";

export const characterResolvers = {
  Query: {
    characters: async (
      _: any,
      {
        page,
        limit,
        filters,
        sorting,
      }: {
        page?: number;
        limit?: number;
        filters?: CharacterFilters;
        sorting?: string;
      },
      context: any
    ) => {
      return await context.container.characterController.getPaginatedCharacters(
        page,
        limit,
        filters,
        sorting
      );
    },
  },
  Mutation: {
    deleteCharacter: async (_: any, { id }: { id: string }, context: any) => {
      return await context.container.characterController.deleteCharacter(id);
    },
    toggleFavorite: async (
      _: any,
      { id, isFavorite }: { id: string; isFavorite: boolean },
      context: any
    ) => {
      return await context.container.characterController.toggleFavorite(
        id,
        isFavorite
      );
    },
  },
};
