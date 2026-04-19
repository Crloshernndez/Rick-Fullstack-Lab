import { useState } from "react";
import { FilterGroup } from "@/components/ui/FilterGroup";
import { cn } from "@/lib/utils";
import styles from "./FilterPanel.module.css";

interface FilterPanelProps {
  onFilterChange?: (filters: {
    gender: string;
    species: string;
    status: string;
  }) => void;
}

const statusOptions = ["All", "Alive", "Dead", "unknown"] as const;
const speciesOptions = [
  "All",
  "Alien",
  "Animal",
  "Cronenberg",
  "Disease",
  "Human",
  "Humanoid",
  "Mythological Creature",
  "Poopybutthole",
  "Robot",
  "unknown",
] as const;
const genderOptions = [
  "All",
  "Female",
  "Genderless",
  "Male",
  "unknown",
] as const;

export function FilterPanel({ onFilterChange }: FilterPanelProps) {
  const [species, setSpecies] = useState<string>("All");
  const [status, setStatus] = useState<string>("All");
  const [gender, setGender] = useState<string>("All");

  const hasActiveFilters =
    status !== "All" || species !== "All" || gender !== "All";

  const handleFilter = () => {
    if (hasActiveFilters) {
      onFilterChange?.({ status, species, gender });
    }
  };

  const getFilterButtonClass = () => {
    return cn(
      styles.filterButton,
      hasActiveFilters
        ? styles["filterButton--active"]
        : styles["filterButton--disabled"]
    );
  };

  return (
    <div className={styles.panel}>
      <FilterGroup
        label="Status"
        options={statusOptions}
        value={status}
        onChange={setStatus}
      />

      <FilterGroup
        label="Specie"
        options={speciesOptions}
        value={species}
        onChange={setSpecies}
      />

      <FilterGroup
        label="Gender"
        options={genderOptions}
        value={gender}
        onChange={setGender}
      />

      <button
        onClick={handleFilter}
        disabled={!hasActiveFilters}
        className={getFilterButtonClass()}
        aria-label="Apply filters"
      >
        Filter
      </button>
    </div>
  );
}
