import { SyncedCharacterDTO } from "../../../../shared/domain/dtos/synced-character.dto";

/**
 * Port defining the contract for communicating with the character-catalog bounded context.
 *
 * This interface acts as an Anti-Corruption Layer (ACL), allowing the data-sync context
 * to interact with the character-catalog context without direct coupling. It ensures
 * that changes in the character-catalog domain do not affect data-sync operations.
 *
 * Implementations should translate SyncedCharacterDTOs into the appropriate commands
 * or use cases within the character-catalog context.
 */
export interface CharacterCatalogAdapterPort {
  /**
   * Creates or updates multiple characters in bulk.
   *
   * This method is optimized for batch operations, processing an entire page
   * of characters at once to minimize database round-trips and improve performance.
   *
   * @param characters - Array of character data to create or update.
   * @returns A promise that resolves to an object with counts of added and updated records.
   * @throws {DomainException} If any character data is invalid.
   * @throws {RepositoryException} If the database operation fails.
   */
  bulkCreateOrUpdateCharacters(characters: SyncedCharacterDTO[]): Promise<{
    addedCount: number;
    updatedCount: number;
  }>;

  /**
   * Marks characters as deprecated if they no longer exist in the external source.
   *
   * @param currentExternalIds - Array of external IDs that currently exist in the source.
   * @returns A promise that resolves to the count of deprecated records.
   * @throws {RepositoryException} If the database operation fails.
   */
  markMissingAsDeprecated(currentExternalIds: number[]): Promise<number>;
}
