import { ReactNode } from "react";
import styles from "./MainContent.module.css";

interface MainContentProps {
  children: ReactNode;
}

export function MainContent({ children }: MainContentProps) {
  return <main className={styles.mainContent}>{children}</main>;
}
