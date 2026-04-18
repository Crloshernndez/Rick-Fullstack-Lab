import { CharacterCatalogAdapterPort } from "../../domain/ports/character-catalog-adapter.port";
import { SyncedCharacterDTO } from "../../../../shared/domain/dtos/synced-character.dto";
import { BulkCreateOrUpdateCharactersUseCasePort } from "../../../../shared/domain/ports/bulk-create-or-update-characters-use-case.port";
import { MarkCharactersAsDeprecatedUseCasePort } from "../../../../shared/domain/ports/mark-characters-as-deprecated-use-case.port";

/**
 * Adapter that bridges the data-sync context with the character-catalog context.
 *
 * This adapter acts as an Anti-Corruption Layer (ACL), translating between the
 * data-sync domain and the character-catalog domain. It depends on character-catalog
 * use cases to perform operations without creating direct coupling to the catalog's
 * domain entities or repositories.
 *
 * The adapter delegates bulk operations directly to character-catalog use cases
 * that are optimized for batch processing, avoiding N+1 query problems.
 */
export class CharacterCatalogAdapter implements CharacterCatalogAdapterPort {
  constructor(
    private readonly bulkCreateOrUpdateCharactersUseCase: BulkCreateOrUpdateCharactersUseCasePort,
    private readonly markCharactersAsDeprecatedUseCase: MarkCharactersAsDeprecatedUseCasePort
  ) {}

  /**
   * Creates or updates multiple characters in bulk.
   *
   * Delegates directly to the bulk use case in character-catalog, which handles
   * the optimization of database operations (e.g., using bulkCreate, transactions).
   *
   * @param characters - Array of character data to process.
   * @returns Object with counts of added and updated characters.
   */
  async bulkCreateOrUpdateCharacters(
    characters: SyncedCharacterDTO[]
  ): Promise<{ addedCount: number; updatedCount: number }> {
    return await this.bulkCreateOrUpdateCharactersUseCase.execute(characters);
  }

  /**
   * Marks characters as deprecated if they no longer exist in the external source.
   *
   * Delegates to the character-catalog use case to handle the deprecation logic.
   *
   * @param currentExternalIds - Array of external IDs that currently exist.
   * @returns The count of characters marked as deprecated.
   */
  async markMissingAsDeprecated(currentExternalIds: number[]): Promise<number> {
    const result = await this.markCharactersAsDeprecatedUseCase.execute(
      currentExternalIds
    );
    return result.deprecatedCount;
  }
}
