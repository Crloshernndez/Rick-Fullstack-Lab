import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "./Avatar.module.css";

type AvatarSize = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
type BadgeSize = "xs" | "sm" | "md";
type BadgePosition = "bottomRight" | "topRight";

interface AvatarProps {
  src: string;
  alt: string;
  size?: AvatarSize;
  bordered?: boolean;
  shadow?: boolean;
  badge?: ReactNode;
  badgeSize?: BadgeSize;
  badgePosition?: BadgePosition;
  className?: string;
  loading?: "lazy" | "eager";
}

export function Avatar({
  src,
  alt,
  size = "md",
  bordered = false,
  shadow = false,
  badge,
  badgeSize = "md",
  badgePosition = "bottomRight",
  className,
  loading = "lazy",
}: AvatarProps) {
  const avatarClass = cn(
    styles.avatar,
    styles[`avatar--${size}`],
    {
      [styles['avatar--bordered']]: bordered,
      [styles['avatar--shadow']]: shadow,
    },
    className
  );

  const badgeClass = cn(
    styles.badge,
    styles[`badge--${badgeSize}`],
    styles[`badge--${badgePosition}`]
  );

  return (
    <div className={avatarClass}>
      <img src={src} alt={alt} loading={loading} />
      {badge && <div className={badgeClass}>{badge}</div>}
    </div>
  );
}
