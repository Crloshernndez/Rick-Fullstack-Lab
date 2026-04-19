import { useState } from "react";
import CharacterDetail from "@/components/features/CharacterDetail";
import { CharacterSidebar } from "@/components/layout/CharacterSidebar";
import { MainContent } from "@/components/layout/MainContent";
import { useCharacters } from "@/hooks/useCharacters";
import styles from "./CharactersPage.module.css";

function CharactersPage() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});

  // Fetch characters from API with filters
  const { characters, loading, error } = useCharacters(1, 10, filters);

  const handleFilterChange = (newFilters: { character: string; species: string }) => {
    const apiFilters: Record<string, string> = {};

    // Map Character filter (Starred/Others handled in frontend)
    // Only send species to backend
    if (newFilters.species !== "All") {
      apiFilters.species = newFilters.species;
    }

    setFilters(apiFilters);
  };

  // Loading state
  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <p className={styles.loadingText}>Loading characters...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p className={styles.errorText}>
          Error loading characters: {error.message}
        </p>
      </div>
    );
  }

  // Filter characters for starred/regular sections
  const starredCharacters = characters.filter((char) => favorites.has(char.id));
  const regularCharacters = characters.filter((char) => !favorites.has(char.id));
  const selectedCharacter = characters.find((char) => char.id === selectedCharacterId);

  return (
    <div className={styles.container}>
      <CharacterSidebar
        starredCharacters={starredCharacters}
        regularCharacters={regularCharacters}
        selectedCharacterId={selectedCharacterId}
        onCharacterSelect={setSelectedCharacterId}
        onFilterChange={handleFilterChange}
      />

      <MainContent>
        <CharacterDetail
          character={selectedCharacter}
          isFavorite={selectedCharacterId ? favorites.has(selectedCharacterId) : false}
        />
      </MainContent>
    </div>
  );
}

export default CharactersPage;
