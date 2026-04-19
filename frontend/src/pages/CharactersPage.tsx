import { useState, useCallback } from "react";
import CharacterDetail from "@/components/features/CharacterDetail";
import { CharacterSidebar } from "@/components/layout/CharacterSidebar";
import { MainContent } from "@/components/layout/MainContent";
import { useCharacters } from "@/hooks/useCharacters";
import styles from "./CharactersPage.module.css";

function CharactersPage() {
  const [selectedCharacterId, setSelectedCharacterId] = useState<number | null>(
    null
  );
  const [favorites, setFavorites] = useState<Set<number>>(new Set());
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [sorting, setSorting] = useState<"ASC" | "DESC">("ASC");
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Fetch characters from API with filters
  const { characters, loading, error } = useCharacters(1, 10, filters, sorting);

  const handleFilterChange = (newFilters: {
    status: string;
    species: string;
    gender: string;
  }) => {
    const count = [
      newFilters.species,
      newFilters.status,
      newFilters.gender,
    ].filter((f) => f !== "All").length;

    setFilters((prevFilters) => {
      const apiFilters: Record<string, string> = { ...prevFilters };

      // Remove name filter temporarily to update other filters
      delete apiFilters.name;

      if (newFilters.species !== "All") {
        apiFilters.species = newFilters.species;
      } else {
        delete apiFilters.species;
      }
      if (newFilters.status !== "All") {
        apiFilters.status = newFilters.status;
      } else {
        delete apiFilters.status;
      }
      if (newFilters.gender !== "All") {
        apiFilters.gender = newFilters.gender;
      } else {
        delete apiFilters.gender;
      }

      // Re-add name filter if it exists
      if (prevFilters.name) {
        apiFilters.name = prevFilters.name;
      }

      console.log("Filters applied:", apiFilters);
      return apiFilters;
    });
    setActiveFilterCount(count);
  };

  const handleSearchChange = useCallback((searchTerm: string) => {
    setFilters((prevFilters) => {
      const apiFilters: Record<string, string> = { ...prevFilters };

      if (searchTerm.trim()) {
        apiFilters.name = searchTerm.trim();
      } else {
        delete apiFilters.name;
      }

      return apiFilters;
    });
  }, []);

  const handleSortingChange = (newSorting: "ASC" | "DESC") => {
    setSorting(newSorting);
  };

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
  const regularCharacters = characters.filter(
    (char) => !favorites.has(char.id)
  );
  const selectedCharacter = characters.find(
    (char) => char.id === selectedCharacterId
  );

  return (
    <div className={styles.container}>
      <CharacterSidebar
        starredCharacters={starredCharacters}
        regularCharacters={regularCharacters}
        selectedCharacterId={selectedCharacterId}
        onCharacterSelect={setSelectedCharacterId}
        onFilterChange={handleFilterChange}
        onSearchChange={handleSearchChange}
        onSortChange={handleSortingChange}
        sorting={sorting}
        activeFilterCount={activeFilterCount}
        loading={loading}
      />

      <MainContent>
        <CharacterDetail
          character={selectedCharacter}
          isFavorite={
            selectedCharacterId ? favorites.has(selectedCharacterId) : false
          }
        />
      </MainContent>
    </div>
  );
}

export default CharactersPage;
