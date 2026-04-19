import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./DetailList.module.css";

interface DetailListProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

export function DetailList({ title, children, className }: DetailListProps) {
  return (
    <section className={cn(styles.list, className)}>
      {title && <h2 className={styles.title}>{title}</h2>}
      {children}
    </section>
  );
}
