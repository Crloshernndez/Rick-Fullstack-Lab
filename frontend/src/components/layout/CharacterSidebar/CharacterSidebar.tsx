import { CharacterSection } from "@/components/features/CharacterSection";
import CharacterItem from "@/components/features/CharacterItem";
import { SearchBar } from "@/components/features/SearchBar";
import type { Character } from "@/types";
import styles from "./CharacterSidebar.module.css";

interface CharacterSidebarProps {
  starredCharacters: Character[];
  regularCharacters: Character[];
  selectedCharacterId: number | null;
  onCharacterSelect: (id: number) => void;
  onFilterChange: (filters: {
    status: string;
    species: string;
    gender: string;
  }) => void;
  onSearchChange: (searchTerm: string) => void;
  onSortChange: (sorting: "ASC" | "DESC") => void;
  sorting: "ASC" | "DESC";
  activeFilterCount: number;
  loading: boolean;
  onToggleFavorite: (id: number) => void;
}

export function CharacterSidebar({
  starredCharacters,
  regularCharacters,
  selectedCharacterId,
  onCharacterSelect,
  onFilterChange,
  onSearchChange,
  onSortChange,
  sorting,
  activeFilterCount = 0,
  loading = false,
  onToggleFavorite,
}: CharacterSidebarProps) {
  const toggleSort = () => {
    onSortChange(sorting === "ASC" ? "DESC" : "ASC");
  };

  const totalResults = starredCharacters.length + regularCharacters.length;

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Rick and Morty list</h2>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <SearchBar
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
        />
        <button
          onClick={toggleSort}
          title={`Sort ${sorting === "ASC" ? "Z → A" : "A → Z"}`}
          className={styles.sortButton}
        >
          {sorting === "ASC" ? "A→Z" : "Z→A"}
        </button>
      </div>

      {/* Results + filter badge */}

      {activeFilterCount > 0 && (
        <div className={styles.resultsRow}>
          <span className={styles.resultsCount}>{totalResults} Results</span>
          <span className={styles.filterBadge}>
            {activeFilterCount} Filter{activeFilterCount > 1 ? "s" : ""}
          </span>
        </div>
      )}

      <div className={styles.listContainer}>
        {loading ? (
          <p
            style={{
              color: "#94A3B8",
              fontSize: 14,
              textAlign: "center",
              padding: "16px 0",
            }}
          >
            Loading...
          </p>
        ) : (
          <>
            {starredCharacters.length > 0 && (
              <CharacterSection
                title="STARRED CHARACTERS"
                count={starredCharacters.length}
              >
                {starredCharacters.map((char) => (
                  <CharacterItem
                    key={char.id}
                    name={char.name}
                    species={char.species}
                    imageUrl={char.image}
                    isStarred={true}
                    isActive={selectedCharacterId === char.id}
                    onClick={() => onCharacterSelect(char.id)}
                    onToggleFavorite={() => onToggleFavorite(char.id)}
                  />
                ))}
              </CharacterSection>
            )}

            <CharacterSection
              title="CHARACTERS"
              count={regularCharacters.length}
            >
              {regularCharacters.map((char) => (
                <CharacterItem
                  key={char.id}
                  name={char.name}
                  species={char.species}
                  imageUrl={char.image}
                  isStarred={false}
                  isActive={selectedCharacterId === char.id}
                  onClick={() => onCharacterSelect(char.id)}
                  onToggleFavorite={() => onToggleFavorite(char.id)}
                />
              ))}
            </CharacterSection>
          </>
        )}
      </div>
    </aside>
  );
}
