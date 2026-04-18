import { Entity } from "../../../../shared/domain/entity";
import { EntityId } from "../../../../shared/domain/value-objects/entity-id";
import { Timestamp } from "../../../../shared/domain/value-objects/timestamp";

/**
 * Properties required to construct a Favorite entity.
 */
export interface FavoriteProps {
  id?: EntityId;
  userId: EntityId;
  characterId: EntityId;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Domain entity representing a user's favorite character.
 *
 * A Favorite is an aggregate root that captures the relationship between
 * a user and a character they have marked as favorite. This entity enforces
 * business rules around favorite management and maintains referential integrity
 * through EntityId value objects.
 *
 * The combination of userId and characterId should be unique, preventing
 * duplicate favorites for the same user-character pair.
 *
 * @extends Entity<EntityId>
 */
export class Favorite extends Entity<EntityId> {
  private readonly _userId: EntityId;
  private readonly _characterId: EntityId;

  /**
   * Creates a new Favorite entity instance.
   *
   * @param props - The properties to initialize the favorite with.
   */
  constructor(props: FavoriteProps) {
    super(
      props.id || EntityId.generate(),
      props.createdAt,
      props.updatedAt
    );

    this._userId = props.userId;
    this._characterId = props.characterId;
  }

  /**
   * Factory method to create a new Favorite entity.
   *
   * Preferred over the constructor when creating new favorites, as it
   * provides a clearer semantic intent.
   *
   * @param props - The properties to initialize the favorite with.
   * @returns A new Favorite instance.
   */
  static create(props: FavoriteProps): Favorite {
    return new Favorite(props);
  }

  /**
   * Returns the user ID who marked this favorite.
   *
   * @returns The user's EntityId.
   */
  get userId(): EntityId {
    return this._userId;
  }

  /**
   * Returns the character ID that was marked as favorite.
   *
   * @returns The character's EntityId.
   */
  get characterId(): EntityId {
    return this._characterId;
  }

  /**
   * Checks if this favorite belongs to a specific user.
   *
   * @param userId - The user ID to check against.
   * @returns `true` if the favorite belongs to the user, otherwise `false`.
   */
  belongsToUser(userId: EntityId): boolean {
    return this._userId.toValue() === userId.toValue();
  }

  /**
   * Checks if this favorite is for a specific character.
   *
   * @param characterId - The character ID to check against.
   * @returns `true` if the favorite is for the character, otherwise `false`.
   */
  isForCharacter(characterId: EntityId): boolean {
    return this._characterId.toValue() === characterId.toValue();
  }

  /**
   * Converts the favorite entity to a plain object representation.
   *
   * @returns A plain object containing all favorite properties.
   */
  toObject(): Record<string, any> {
    return {
      id: this._id.toValue(),
      userId: this._userId.toValue(),
      characterId: this._characterId.toValue(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
