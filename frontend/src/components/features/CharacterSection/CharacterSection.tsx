import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./CharacterSection.module.css";

interface CharacterSectionProps {
  title: string;
  count?: number;
  children: ReactNode;
  className?: string;
}

export function CharacterSection({
  title,
  count,
  children,
  className,
}: CharacterSectionProps) {
  return (
    <section className={cn(styles.section, className)}>
      {/* Header */}
      <header className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {count !== undefined && (
          <span className={styles.count}>({count})</span>
        )}
      </header>

      {/* Items */}
      <div className={styles.items}>{children}</div>
    </section>
  );
}
