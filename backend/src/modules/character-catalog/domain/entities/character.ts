import { Entity } from "../../../../shared/domain/entity";
import { EntityId } from "../../../../shared/domain/value-objects/entity-id";
import { Timestamp } from "../../../../shared/domain/value-objects/timestamp";
import { Name } from "../../../../shared/domain/value-objects/name";
import { ImageUrl } from "../../../../shared/domain/value-objects/image-url";
import { CharacterStatus } from "../value-objects/character-status";
import { CharacterSpecies } from "../value-objects/character-species";
import { CharacterType } from "../value-objects/character-type";
import { Gender } from "../value-objects/gender";
import { CharacterOrigin } from "../value-objects/character-origin";
import { CharacterLocation } from "../value-objects/character-location";
import { ExternalId } from "../value-objects/external-id";

/**
 * Sync status enum representing the synchronization state with external API.
 */
export enum SyncStatus {
  SYNCED = "synced",
  DEPRECATED = "deprecated",
}

/**
 * Properties required to construct a Character entity.
 */
export interface CharacterProps {
  id?: EntityId;
  externalId: ExternalId;
  name: Name;
  status?: CharacterStatus;
  species?: CharacterSpecies;
  type?: CharacterType;
  gender?: Gender;
  image?: ImageUrl;
  origin?: CharacterOrigin;
  location?: CharacterLocation;
  syncStatus?: SyncStatus;
  isActive?: boolean;
  lastImportedAt?: Timestamp;
  createdAt?: Timestamp;
  updatedAt?: Timestamp;
}

/**
 * Domain entity representing a character from the Rick and Morty universe.
 *
 * Encapsulates all business logic and invariants related to characters,
 * ensuring data integrity through value objects and maintaining synchronization
 * state with the external API.
 *
 * @extends Entity<EntityId>
 */
export class Character extends Entity<EntityId> {
  private readonly _externalId: ExternalId;
  private _name: Name;
  private _status?: CharacterStatus;
  private _species?: CharacterSpecies;
  private _type?: CharacterType;
  private _gender?: Gender;
  private _image?: ImageUrl;
  private _origin?: CharacterOrigin;
  private _location?: CharacterLocation;
  private _syncStatus: SyncStatus;
  private _isActive: boolean;
  private _lastImportedAt?: Timestamp;

  /**
   * Creates a new Character entity instance.
   *
   * @param props - The properties to initialize the character with.
   */
  constructor(props: CharacterProps) {
    super(props.id || EntityId.generate(), props.createdAt, props.updatedAt);

    this._externalId = props.externalId;
    this._name = props.name;
    this._status = props.status;
    this._species = props.species;
    this._type = props.type;
    this._gender = props.gender;
    this._image = props.image;
    this._origin = props.origin;
    this._location = props.location;
    this._syncStatus = SyncStatus.SYNCED;
    this._isActive = props.isActive ?? true;
    this._lastImportedAt = props.lastImportedAt;
  }

  /**
   * Factory method to create a new Character entity.
   *
   * @param props - The properties to initialize the character with.
   * @returns A new Character instance.
   */
  static create(props: CharacterProps): Character {
    return new Character(props);
  }

  // Getters

  get externalId(): ExternalId {
    return this._externalId;
  }

  get name(): Name {
    return this._name;
  }

  get status(): CharacterStatus | undefined {
    return this._status;
  }

  get species(): CharacterSpecies | undefined {
    return this._species;
  }

  get type(): CharacterType | undefined {
    return this._type;
  }

  get gender(): Gender | undefined {
    return this._gender;
  }

  get image(): ImageUrl | undefined {
    return this._image;
  }

  get origin(): CharacterOrigin | undefined {
    return this._origin;
  }

  get location(): CharacterLocation | undefined {
    return this._location;
  }

  get syncStatus(): SyncStatus {
    return this._syncStatus;
  }

  get isActive(): boolean {
    return this._isActive;
  }

  get lastImportedAt(): Timestamp | undefined {
    return this._lastImportedAt;
  }

  // Business logic methods

  /**
   * Updates the character's information with new data from external API.
   *
   * @param props - The properties to update.
   */
  updateFromExternalSource(props: Partial<CharacterProps>): void {
    if (props.name) this._name = props.name;
    if (props.status) this._status = props.status;
    if (props.species) this._species = props.species;
    if (props.type) this._type = props.type;
    if (props.gender) this._gender = props.gender;
    if (props.image) this._image = props.image;
    if (props.origin) this._origin = props.origin;
    if (props.location) this._location = props.location;

    this._syncStatus = SyncStatus.SYNCED;
    this._lastImportedAt = Timestamp.now();
    this.touch();
  }

  /**
   * Marks the character as deprecated (no longer exists in external API).
   */
  markAsDeprecated(): void {
    this._syncStatus = SyncStatus.DEPRECATED;
    this._isActive = false;
    this.touch();
  }

  /**
   * Deactivates the character.
   */
  deactivate(): void {
    this._isActive = false;
    this.touch();
  }

  /**
   * Activates the character.
   */
  activate(): void {
    this._isActive = true;
    this.touch();
  }

  /**
   * Checks if the character is synced with the external API.
   *
   * @returns `true` if the character is synced, otherwise `false`.
   */
  isSynced(): boolean {
    return this._syncStatus === SyncStatus.SYNCED;
  }

  /**
   * Checks if the character is deprecated.
   *
   * @returns `true` if the character is deprecated, otherwise `false`.
   */
  isDeprecated(): boolean {
    return this._syncStatus === SyncStatus.DEPRECATED;
  }

  /**
   * Converts the character entity to a plain object representation.
   *
   * @returns A plain object containing all character properties.
   */
  toObject(): Record<string, any> {
    return {
      id: this._id.toValue(),
      externalId: this._externalId.toValue(),
      name: this._name.toValue(),
      status: this._status?.toValue(),
      species: this._species?.toValue(),
      type: this._type?.toValue(),
      gender: this._gender?.toValue(),
      image: this._image?.toValue(),
      origin: this._origin?.toObject(),
      location: this._location?.toObject(),
      syncStatus: this._syncStatus,
      isActive: this._isActive,
      lastImportedAt: this._lastImportedAt?.toISOString(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
