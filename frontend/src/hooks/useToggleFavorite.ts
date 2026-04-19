// hooks/useToggleFavorite.ts
import { TOGGLE_FAVORITE } from "@/services/graphql/queries";
import { useMutation } from "@apollo/client/react";

export function useToggleFavorite() {
  const [toggleFavorite, { loading }] = useMutation(TOGGLE_FAVORITE);

  const toggle = async (id: number, isFavorite: boolean) => {
    try {
      await toggleFavorite({
        variables: { id: String(id), isFavorite },
      });
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  return { toggle, loading };
}
