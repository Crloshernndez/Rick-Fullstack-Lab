import { SyncedCharacterDTO } from "../../../data-sync/domain/dtos/synced-character.dto";

/**
 * Port interface for bulk character creation/update use case.
 *
 * This port defines the contract for a use case that processes multiple characters
 * at once, optimizing database operations through bulk inserts/updates instead of
 * individual operations.
 */
export interface BulkCreateOrUpdateCharactersUseCasePort {
  /**
   * Creates or updates multiple characters in a single operation.
   *
   * @param characters - Array of character data from external source.
   * @returns Object containing counts of added and updated characters.
   */
  execute(characters: SyncedCharacterDTO[]): Promise<{
    addedCount: number;
    updatedCount: number;
  }>;
}
