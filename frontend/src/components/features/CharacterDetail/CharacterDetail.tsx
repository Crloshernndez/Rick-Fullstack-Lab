import { Avatar } from "@/components/ui/Avatar";
import { DetailList } from "@/components/ui/DetailList";
import { DetailRow } from "@/components/ui/DetailRow";
import styles from "./CharacterDetail.module.css";
import { FavoriteButton } from "@/components/ui/FavoriteButton";

interface CharacterDetailProps {
  character?: {
    name: string;
    species: string;
    image: string;
    status: string;
    occupation?: string;
  };
  isFavorite?: boolean;
}

export function CharacterDetail({
  character,
  isFavorite = false,
}: CharacterDetailProps) {
  if (!character) {
    return (
      <div className={styles.emptyState}>
        <p className={styles.emptyText}>Select a character to view details</p>
      </div>
    );
  }

  const favoriteBadge = isFavorite ? (
    <div className="w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
      <FavoriteButton
        isFavorite={true}
        onClick={() => console.log()}
        visible={true}
        size="sm"
      />
    </div>
  ) : undefined;

  return (
    <article className={styles.container}>
      {/* Header with Avatar and Name */}
      <header className={styles.header}>
        <div className={styles.avatarContainer}>
          <Avatar
            src={character.image}
            alt={character.name}
            size="2xl"
            bordered
            shadow
            badge={favoriteBadge}
            badgePosition="bottomRight"
          />
          <h1 className={styles.name}>{character.name}</h1>
        </div>
      </header>

      {/* Details */}
      <DetailList>
        <DetailRow label="Species" value={character.species} />
        <DetailRow label="Status" value={character.status} />
        {character.occupation && (
          <DetailRow label="Occupation" value={character.occupation} />
        )}
      </DetailList>
    </article>
  );
}

export default CharacterDetail;
