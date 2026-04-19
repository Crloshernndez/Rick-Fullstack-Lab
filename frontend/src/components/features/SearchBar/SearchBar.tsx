import { useState } from "react";
import { Search } from "@/components/ui/Search";
import { Adjustments } from "@/components/ui/AdjustmentsIcon";
import { FilterPanel } from "@/components/features/FilterPanel";
import { cn } from "@/lib/utils";
import styles from "./SearchBar.module.css";

interface SearchBarProps {
  onFilterChange?: (filters: {
    species: string;
    status: string;
    gender: string;
  }) => void;
}

export function SearchBar({ onFilterChange }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);

  const handleFilterChange = (filters: {
    species: string;
    status: string;
    gender: string;
  }) => {
    // Check if any filter has a value different from "All"
    const hasFilters =
      filters.species !== "All" ||
      filters.status !== "All" ||
      filters.gender !== "All";
    setHasActiveFilters(hasFilters);
    onFilterChange?.(filters);
    setIsOpen(false);
  };

  const getFilterButtonClass = () => {
    if (hasActiveFilters)
      return cn(styles.filterButton, styles["filterButton--active"]);
    if (isOpen) return cn(styles.filterButton, styles["filterButton--open"]);
    return cn(styles.filterButton, styles["filterButton--default"]);
  };

  const getIconColor = () => {
    if (hasActiveFilters) return "#FFFFFF";
    if (isOpen) return "#6B21A8";
    return "#94A3B8";
  };

  return (
    <div className={styles.container}>
      {/* Input container */}
      <div className={styles.inputContainer}>
        {/* Search icon */}
        <div className={styles.searchIcon}>
          <Search size={20} strokeWidth={1.6} style={{ color: "#94A3B8" }} />
        </div>

        {/* Input */}
        <input
          type="text"
          placeholder="Search or filter results"
          className={styles.input}
        />

        {/* Filter button */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={getFilterButtonClass()}
          aria-label="Toggle filters"
          aria-expanded={isOpen}
        >
          <Adjustments size={16} color={getIconColor()} />
        </button>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className={styles.dropdown}>
          <FilterPanel onFilterChange={handleFilterChange} />
        </div>
      )}
    </div>
  );
}
