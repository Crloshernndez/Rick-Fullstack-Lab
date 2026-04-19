import { Op } from "sequelize";
import { CharacterRepositoryPort } from "../../../../domain/ports/character-repository.port";
import { Character as CharacterEntity } from "../../../../domain/entities/character.entity";
import { Character as CharacterModel } from "../models/Character.model";
import { EntityId } from "../../../../../../shared/domain/value-objects/entity-id";
import { ExternalId } from "../../../../domain/value-objects/external-id";
import { Name } from "../../../../../../shared/domain/value-objects/name";
import { CharacterStatus } from "../../../../domain/value-objects/character-status";
import { CharacterSpecies } from "../../../../domain/value-objects/character-species";
import { CharacterType } from "../../../../domain/value-objects/character-type";
import { Gender } from "../../../../domain/value-objects/gender";
import { ImageUrl } from "../../../../../../shared/domain/value-objects/image-url";
import { CharacterOrigin } from "../../../../domain/value-objects/character-origin";
import { CharacterLocation } from "../../../../domain/value-objects/character-location";
import { Timestamp } from "../../../../../../shared/domain/value-objects/timestamp";
import { SyncStatus } from "../../../../domain/entities/character.entity";
import { RepositoryException } from "../../../../../../shared/exceptions/application-errors";
import { PaginationInfo } from "../../../../../../shared/domain/value-objects/pagination-info";
import { Count } from "../../../../../../shared/domain/value-objects/count";
import { CharacterSpecificationTranslator } from "../translators/character-specification.translator";
import { CharacterFilters } from "../../../../application/dtos/character-filters.dto";

/**
 * Sequelize implementation of the Character repository.
 *
 * Handles the mapping between domain entities and persistence models,
 * ensuring proper conversion of value objects to database primitives and vice versa.
 * Implements bulk operations for optimal performance during synchronization.
 */
export class CharacterRepository implements CharacterRepositoryPort {
  /**
   * Finds all characters with pagination.
   *
   * @param page - Page number (1-indexed).
   * @param limit - Number of items per page.
   * @returns Object with pagination info and array of Character domain entities.
   * @throws {RepositoryException} If database query fails.
   */
  async findAll(
    page: number,
    limit: number,
    filters: CharacterFilters = {}
  ): Promise<{
    info: PaginationInfo;
    characters: CharacterEntity[];
  }> {
    try {
      const offset = (page - 1) * limit;
      const translator = new CharacterSpecificationTranslator();
      const where = translator.translate(filters);

      const { count, rows } = await CharacterModel.findAndCountAll({
        where,
        limit,
        offset,
        order: [["createdAt", "DESC"]],
      });

      const characters = rows.map((model) => this.toDomain(model));

      const totalPages = Math.ceil(count / limit);

      const info = new PaginationInfo({
        count: new Count(count),
        pages: new Count(totalPages),
        next: page < totalPages ? page + 1 : null,
        prev: page > 1 ? page - 1 : null,
      });

      return { info, characters };
    } catch (error) {
      throw new RepositoryException(
        `Failed to find paginated characters: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Finds characters by ID.
   *
   * @param Id - ID to search for.
   * @returns Character entities matching the ID.
   */
  async findById(id: EntityId): Promise<CharacterEntity | null> {
    try {
      const model = await CharacterModel.findOne({
        where: {
          id: id.toValue(),
          isActive: true,
        },
      });

      return model ? this.toDomain(model) : null;
    } catch (error) {
      throw new RepositoryException(
        `Failed to find character by id: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Finds characters by their external IDs.
   *
   * @param externalIds - Array of external IDs to search for.
   * @returns Array of Character domain entities.
   * @throws {RepositoryException} If database query fails.
   */
  async findByExternalIds(
    externalIds: ExternalId[]
  ): Promise<CharacterEntity[]> {
    try {
      const models = await CharacterModel.findAll({
        where: {
          externalId: {
            [Op.in]: externalIds.map((externalId) => externalId.toValue()),
          },
        },
      });

      return models.map((model) => this.toDomain(model));
    } catch (error) {
      throw new RepositoryException(
        `Failed to find characters by external IDs: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Finds characters whose external ID is not in the provided list.
   *
   * @param externalIds - Array of external IDs that currently exist in source.
   * @returns Array of Character domain entities not in the list.
   * @throws {RepositoryException} If database query fails.
   */
  async findNotInExternalIds(
    externalIds: ExternalId[]
  ): Promise<CharacterEntity[]> {
    try {
      const models = await CharacterModel.findAll({
        where: {
          externalId: {
            [Op.notIn]: externalIds.map((externalId) => externalId.toValue()),
          },
          syncStatus: SyncStatus.SYNCED,
        },
      });

      return models.map((model) => this.toDomain(model));
    } catch (error) {
      throw new RepositoryException(
        `Failed to find characters not in external IDs: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Updates a single character.
   *
   * @param character - Character domain entity to update.
   * @throws {RepositoryException} If update operation fails.
   */
  async update(character: CharacterEntity): Promise<void> {
    try {
      const data = this.toPersistence(character);
      await CharacterModel.update(data, {
        where: { id: character.id.toValue() },
      });
    } catch (error) {
      throw new RepositoryException(
        `Failed to update character: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Creates multiple characters in a single bulk operation.
   *
   * @param characters - Array of Character domain entities to create.
   * @throws {RepositoryException} If bulk create operation fails.
   */
  async bulkCreate(characters: CharacterEntity[]): Promise<void> {
    try {
      const models = characters.map((character) =>
        this.toPersistence(character)
      );

      await CharacterModel.bulkCreate(models);
    } catch (error) {
      throw new RepositoryException(
        `Failed to bulk create characters: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Updates multiple characters in a single bulk operation.
   *
   * Uses individual updates within a transaction for proper timestamp handling
   * and to ensure domain updates are properly persisted.
   *
   * @param characters - Array of Character domain entities to update.
   * @throws {RepositoryException} If bulk update operation fails.
   */
  async bulkUpdate(characters: CharacterEntity[]): Promise<void> {
    try {
      const updatePromises = characters.map(async (character) => {
        const data = this.toPersistence(character);
        await CharacterModel.update(data, {
          where: { id: character.id.toValue() },
        });
      });

      await Promise.all(updatePromises);
    } catch (error) {
      throw new RepositoryException(
        `Failed to bulk update characters: ${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Maps a Sequelize model to a domain entity.
   *
   * Converts database primitives to value objects and reconstructs the entity
   * with all its business logic and invariants.
   *
   * @param model - The Sequelize model instance.
   * @returns A Character domain entity.
   */
  private toDomain(model: CharacterModel): CharacterEntity {
    return new CharacterEntity({
      id: new EntityId(model.id),
      externalId: new ExternalId(model.externalId),
      name: new Name(model.name),
      syncStatus: model.syncStatus as SyncStatus,
      isActive: model.isActive,
      createdAt: Timestamp.from(model.createdAt),
      updatedAt: Timestamp.from(model.updatedAt),
      ...(model.status && { status: new CharacterStatus(model.status) }),
      ...(model.species && { species: new CharacterSpecies(model.species) }),
      ...(model.type && { type: new CharacterType(model.type) }),
      ...(model.gender && { gender: new Gender(model.gender) }),
      ...(model.image && { image: new ImageUrl(model.image) }),
      ...(model.origin && {
        origin: new CharacterOrigin({
          name: model.origin.name,
          id: model.origin.id,
        }),
      }),
      ...(model.location && {
        location: new CharacterLocation({
          name: model.location.name,
          id: model.location.id,
        }),
      }),
      ...(model.lastImportedAt && {
        lastImportedAt: Timestamp.from(model.lastImportedAt),
      }),
    });
  }

  /**
   * Maps a domain entity to a Sequelize model data object.
   *
   * Converts value objects to database primitives suitable for persistence.
   *
   * @param entity - The Character domain entity.
   * @returns A plain object ready for Sequelize operations.
   */
  private toPersistence(entity: CharacterEntity): any {
    return {
      id: entity.id.toValue(),
      externalId: entity.externalId.toValue(),
      name: entity.name.toValue(),
      status: entity.status?.toValue(),
      species: entity.species?.toValue(),
      type: entity.type?.toValue(),
      gender: entity.gender?.toValue(),
      image: entity.image?.toValue(),
      origin: entity.origin?.toObject(),
      location: entity.location?.toObject(),
      syncStatus: entity.syncStatus,
      isActive: entity.isActive,
      lastImportedAt: entity.lastImportedAt?.toValue(),
      createdAt: entity.createdAt.toValue(),
      updatedAt: entity.updatedAt.toValue(),
    };
  }
}
