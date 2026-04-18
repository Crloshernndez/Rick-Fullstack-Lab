import { EntityId } from "./value-objects/entity-id";
import { Timestamp } from "./value-objects/timestamp";

/**
 * Abstract base class for all domain entities.
 *
 * An Entity is a Domain-Driven Design (DDD) concept that represents an object
 * with a unique identity that persists over time. Unlike Value Objects, two
 * entities are considered equal only if they have the same identity, regardless
 * of their attributes.
 *
 * This class enforces identity through the EntityId value object and tracks
 * creation and modification timestamps using the Timestamp value object.
 *
 * @template TId - The type of the entity's identifier (defaults to EntityId).
 */
export abstract class Entity<TId = EntityId> {
  /**
   * The unique identifier for this entity.
   * Immutable after construction to preserve identity integrity.
   */
  protected readonly _id: TId;

  /**
   * The timestamp when this entity was created.
   * Immutable after construction as creation time never changes.
   */
  protected readonly _createdAt: Timestamp;

  /**
   * The timestamp when this entity was last updated.
   * Mutable to track modifications over time.
   */
  protected _updatedAt: Timestamp;

  /**
   * Creates a new entity instance.
   *
   * @param id - The unique identifier for this entity.
   * @param createdAt - The creation timestamp (defaults to current time if not provided).
   * @param updatedAt - The last update timestamp (defaults to current time if not provided).
   */
  constructor(id: TId, createdAt?: Timestamp, updatedAt?: Timestamp) {
    this._id = id;
    this._createdAt = createdAt || Timestamp.now();
    this._updatedAt = updatedAt || Timestamp.now();
  }

  /**
   * Returns the entity's unique identifier.
   *
   * @returns The entity ID.
   */
  get id(): TId {
    return this._id;
  }

  /**
   * Returns the entity's creation timestamp.
   *
   * @returns The creation timestamp as a Timestamp value object.
   */
  get createdAt(): Timestamp {
    return this._createdAt;
  }

  /**
   * Returns the entity's last update timestamp.
   *
   * @returns The update timestamp as a Timestamp value object.
   */
  get updatedAt(): Timestamp {
    return this._updatedAt;
  }

  /**
   * Updates the entity's last modified timestamp to the current time.
   *
   * Should be called whenever the entity's state changes to maintain
   * accurate modification tracking.
   */
  protected touch(): void {
    this._updatedAt = Timestamp.now();
  }

  /**
   * Converts the entity to a plain object representation.
   *
   * Subclasses must implement this method to define how their specific
   * attributes should be serialized, typically for persistence or API responses.
   *
   * @returns A plain object representation of the entity.
   */
  abstract toObject(): Record<string, any>;
}
