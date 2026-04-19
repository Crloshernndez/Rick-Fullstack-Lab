import { Heart } from "@/components/ui/Heart";
import { cn } from "@/lib/utils";
import styles from "./FavoriteButton.module.css";

type FavoriteButtonSize = "sm" | "md" | "lg";

interface FavoriteButtonProps {
  isFavorite: boolean;
  onClick: (e: React.MouseEvent) => void;
  visible?: boolean;
  size?: FavoriteButtonSize;
  label?: string;
  className?: string;
}

const iconSizes = {
  sm: 14,
  md: 18,
  lg: 24,
};

export function FavoriteButton({
  isFavorite,
  onClick,
  visible = true,
  size = "md",
  label,
  className,
}: FavoriteButtonProps) {
  const buttonClass = cn(
    styles.button,
    styles[`button--${size}`],
    {
      [styles['button--hidden']]: !visible,
      [styles['button--visible']]: visible,
      [styles['button--favorite']]: isFavorite,
      [styles['button--unfavorite']]: !isFavorite,
    },
    className
  );

  const ariaLabel = label || (isFavorite ? "Remove from favorites" : "Add to favorites");

  return (
    <button
      onClick={onClick}
      className={buttonClass}
      aria-label={ariaLabel}
      aria-pressed={isFavorite}
      type="button"
    >
      <Heart style={{ width: iconSizes[size], height: iconSizes[size] }} />
    </button>
  );
}
