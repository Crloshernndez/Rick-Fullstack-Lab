import { CharacterFilters } from "../../../../application/dtos/character-filters.dto";

export const characterResolvers = {
  Query: {
    characters: async (
      _: any,
      { page, limit, filters }: { page?: number; limit?: number; filters?: CharacterFilters },
      context: any
    ) => {
      return await context.container.characterController.getPaginatedCharacters(
        page,
        limit,
        filters
      );
    },
  },
};
