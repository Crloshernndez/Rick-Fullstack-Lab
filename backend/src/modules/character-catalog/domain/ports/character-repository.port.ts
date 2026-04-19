import { PaginationInfo } from "../../../../shared/domain/value-objects/pagination-info";
import { Character } from "../entities/character.entity";
import { ExternalId } from "../value-objects/external-id";

/**
 * Port interface for character repository operations.
 *
 * Defines the contract for persistence operations on Character entities.
 * This port follows the Repository pattern from DDD, providing an abstraction
 * over the data access layer to keep the domain independent of infrastructure concerns.
 */
export interface CharacterRepositoryPort {
  /**
   * Finds all characters paginated.
   *
   * @param page - Pagination number.
   * @param limit - Number of items per page.
   * @returns Object with pagination info and array of Character entities.
   */
  findAll(
    page: number,
    limit: number
  ): Promise<{
    info: PaginationInfo;
    characters: Character[];
  }>;

  /**
   * Finds characters by their external IDs.
   *
   * @param externalIds - Array of external IDs to search for.
   * @returns Array of Character entities matching the external IDs.
   */
  findByExternalIds(externalIds: ExternalId[]): Promise<Character[]>;

  /**
   * Finds characters whose external ID is not in the provided list.
   *
   * Used to identify characters that have been removed from the external source.
   *
   * @param externalIds - Array of external IDs that currently exist in the source.
   * @returns Array of Character entities not in the provided list.
   */
  findNotInExternalIds(externalIds: ExternalId[]): Promise<Character[]>;

  /**
   * Creates multiple characters in a single bulk operation.
   *
   * @param characters - Array of Character entities to create.
   */
  bulkCreate(characters: Character[]): Promise<void>;

  /**
   * Updates multiple characters in a single bulk operation.
   *
   * @param characters - Array of Character entities to update.
   */
  bulkUpdate(characters: Character[]): Promise<void>;
}
