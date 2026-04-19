export const characterResolvers = {
  Query: {
    characters: async (
      _: any,
      { page, limit }: { page?: number; limit?: number },
      context: any
    ) => {
      return await context.container.characterController.getPaginatedCharacters(
        page,
        limit
      );
    },
  },
};
