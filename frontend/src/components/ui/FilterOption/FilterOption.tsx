import { cn } from "@/lib/utils";
import styles from "./FilterOption.module.css";

interface FilterOptionProps {
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

export function FilterOption({ label, isSelected, onClick }: FilterOptionProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        styles.option,
        isSelected ? styles['option--selected'] : styles['option--default']
      )}
      aria-pressed={isSelected}
      type="button"
    >
      {label}
    </button>
  );
}
