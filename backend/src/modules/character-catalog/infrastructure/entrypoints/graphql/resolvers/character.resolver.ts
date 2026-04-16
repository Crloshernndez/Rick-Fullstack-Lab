export const characterResolvers = {
  Query: {
    searchCharacters: () => {
      // Retornamos un array estático para probar la conexión
      return [
        {
          id: "1",
          name: "Rick Sanchez",
          status: "Alive",
          species: "Human",
          image: "https://rickandmortyapi.com/api/character/avatar/1.jpeg",
        },
      ];
    },
  },
};
