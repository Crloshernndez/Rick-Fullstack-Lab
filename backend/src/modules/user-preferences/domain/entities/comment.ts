import { Entity } from "../../../../shared/domain/entity";
import { EntityId } from "../../../../shared/domain/value-objects/entity-id";
import { Timestamp } from "../../../../shared/domain/value-objects/timestamp";
import { CommentContent } from "../../../character-catalog/domain/value-objects/comment-content";

/**
 * Properties required to construct a Comment entity.
 */
export interface CommentProps {
  id?: EntityId;
  content: CommentContent;
  userId: EntityId;
  characterId: EntityId;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Domain entity representing a user's comment on a character.
 *
 * A Comment is an aggregate root that captures user-generated content
 * associated with a specific character. This entity enforces business rules
 * around comment management, content validation, and maintains referential
 * integrity through EntityId value objects.
 *
 * Comments are immutable once created, though the content can be edited
 * through the updateContent method which tracks the modification timestamp.
 *
 * @extends Entity<EntityId>
 */
export class Comment extends Entity<EntityId> {
  private _content: CommentContent;
  private readonly _userId: EntityId;
  private readonly _characterId: EntityId;

  /**
   * Creates a new Comment entity instance.
   *
   * @param props - The properties to initialize the comment with.
   */
  constructor(props: CommentProps) {
    super(props.id || EntityId.generate(), props.createdAt, props.updatedAt);

    this._content = props.content;
    this._userId = props.userId;
    this._characterId = props.characterId;
  }

  /**
   * Factory method to create a new Comment entity.
   *
   * Preferred over the constructor when creating new comments, as it
   * provides a clearer semantic intent.
   *
   * @param props - The properties to initialize the comment with.
   * @returns A new Comment instance.
   */
  static create(props: CommentProps): Comment {
    return new Comment(props);
  }

  /**
   * Returns the comment content.
   *
   * @returns The CommentContent value object.
   */
  get content(): CommentContent {
    return this._content;
  }

  /**
   * Returns the user ID who created this comment.
   *
   * @returns The user's EntityId.
   */
  get userId(): EntityId {
    return this._userId;
  }

  /**
   * Returns the character ID this comment is about.
   *
   * @returns The character's EntityId.
   */
  get characterId(): EntityId {
    return this._characterId;
  }

  /**
   * Updates the comment content.
   *
   * Automatically updates the updatedAt timestamp to track modifications.
   *
   * @param newContent - The new content for the comment.
   */
  updateContent(newContent: CommentContent): void {
    this._content = newContent;
    this.touch();
  }

  /**
   * Checks if this comment belongs to a specific user.
   *
   * Useful for authorization checks before allowing updates or deletions.
   *
   * @param userId - The user ID to check against.
   * @returns `true` if the comment belongs to the user, otherwise `false`.
   */
  belongsToUser(userId: EntityId): boolean {
    return this._userId.toValue() === userId.toValue();
  }

  /**
   * Checks if this comment is about a specific character.
   *
   * @param characterId - The character ID to check against.
   * @returns `true` if the comment is about the character, otherwise `false`.
   */
  isForCharacter(characterId: EntityId): boolean {
    return this._characterId.toValue() === characterId.toValue();
  }

  /**
   * Checks if the comment has been edited.
   *
   * A comment is considered edited if the updatedAt timestamp is after createdAt.
   *
   * @returns `true` if the comment has been edited, otherwise `false`.
   */
  isEdited(): boolean {
    return this._updatedAt.isAfter(this._createdAt);
  }

  /**
   * Converts the comment entity to a plain object representation.
   *
   * @returns A plain object containing all comment properties.
   */
  toObject(): Record<string, any> {
    return {
      id: this._id.toValue(),
      content: this._content.toValue(),
      userId: this._userId.toValue(),
      characterId: this._characterId.toValue(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
      isEdited: this.isEdited(),
    };
  }
}
