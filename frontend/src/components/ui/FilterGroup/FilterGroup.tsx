import { FilterOption } from "@/components/ui/FilterOption";
import styles from "./FilterGroup.module.css";

interface FilterGroupProps {
  label: string;
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}

export function FilterGroup({ label, options, value, onChange }: FilterGroupProps) {
  return (
    <div className={styles.group}>
      <label className={styles.label}>{label}</label>
      <div className={styles.options}>
        {options.map((option) => (
          <FilterOption
            key={option}
            label={option}
            isSelected={value === option}
            onClick={() => onChange(option)}
          />
        ))}
      </div>
    </div>
  );
}
