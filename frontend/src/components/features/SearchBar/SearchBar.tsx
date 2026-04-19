import { useState, useEffect } from "react";
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
  onSearchChange?: (searchTerm: string) => void;
}

export function SearchBar({ onFilterChange, onSearchChange }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [hasActiveFilters, setHasActiveFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Keep filter state in SearchBar to persist across re-renders
  const [currentFilters, setCurrentFilters] = useState({
    species: "All",
    status: "All",
    gender: "All",
  });

  // Debounce search input (500ms for better UX)
  useEffect(() => {
    const timer = setTimeout(() => {
      onSearchChange?.(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);

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
    setCurrentFilters(filters); // Save filters
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
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
          <FilterPanel
            onFilterChange={handleFilterChange}
            initialFilters={currentFilters}
          />
        </div>
      )}
    </div>
  );
}
