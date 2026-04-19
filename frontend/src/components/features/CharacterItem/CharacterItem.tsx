import { useState } from "react";
import { Avatar } from "@/components/ui/Avatar";
import { FavoriteButton } from "@/components/ui/FavoriteButton";
import { cn } from "@/lib/utils";
import styles from "./CharacterItem.module.css";

interface CharacterItemProps {
  name: string;
  species: string;
  imageUrl: string;
  isStarred: boolean;
  isActive: boolean;
  onClick?: () => void;
  onToggleFavorite?: () => void;
}

export function CharacterItem({
  name,
  species,
  imageUrl,
  isStarred,
  isActive,
  onClick,
  onToggleFavorite,
}: CharacterItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const handleHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleFavorite?.();
  };

  const containerClass = cn(
    styles.container,
    isActive ? styles["container--active"] : styles["container--default"]
  );

  return (
    <article
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={containerClass}
      role="button"
      tabIndex={0}
      aria-label={`View ${name} details`}
    >
      {/* Avatar */}
      <Avatar src={imageUrl} alt={name} size="md" className="md:w-12 md:h-12" />

      {/* Content */}
      <div className={styles.content}>
        <h4 className={styles.name}>{name}</h4>
        <p className={styles.species}>{species}</p>
      </div>

      {/* Favorite button */}
      <FavoriteButton
        isFavorite={isStarred}
        onClick={handleHeartClick}
        visible={true}
        size="md"
        label={
          isStarred
            ? `Remove ${name} from favorites`
            : `Add ${name} to favorites`
        }
      />
    </article>
  );
}

export default CharacterItem;
