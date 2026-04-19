import { cn } from "@/lib/utils";
import styles from "./DetailRow.module.css";

interface DetailRowProps {
  label: string;
  value: string | number;
  className?: string;
}

export function DetailRow({ label, value, className }: DetailRowProps) {
  return (
    <div className={cn(styles.row, className)}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>{value}</span>
    </div>
  );
}
