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
  onFilterChange: (filters: { character: string; species: string }) => void;
  onSortChange: (sorting: "ASC" | "DESC") => void;
  sorting: "ASC" | "DESC";
}

export function CharacterSidebar({
  starredCharacters,
  regularCharacters,
  selectedCharacterId,
  onCharacterSelect,
  onFilterChange,
  onSortChange,
  sorting,
}: CharacterSidebarProps) {
  const toggleSort = () => {
    onSortChange(sorting === "ASC" ? "DESC" : "ASC");
  };

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h2 className={styles.title}>Rick and Morty list</h2>
        </div>
      </header>

      <div className={styles.searchContainer}>
        <SearchBar onFilterChange={onFilterChange} />
        <button
          onClick={toggleSort}
          title={`Sort ${sorting === "ASC" ? "Z → A" : "A → Z"}`}
          className={styles.sortButton}
        >
          {sorting === "ASC" ? "A→Z" : "Z→A"}
        </button>
      </div>

      <div className={styles.listContainer}>
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
              />
            ))}
          </CharacterSection>
        )}

        <CharacterSection title="CHARACTERS" count={regularCharacters.length}>
          {regularCharacters.map((char) => (
            <CharacterItem
              key={char.id}
              name={char.name}
              species={char.species}
              imageUrl={char.image}
              isStarred={false}
              isActive={selectedCharacterId === char.id}
              onClick={() => onCharacterSelect(char.id)}
            />
          ))}
        </CharacterSection>
      </div>
    </aside>
  );
}
