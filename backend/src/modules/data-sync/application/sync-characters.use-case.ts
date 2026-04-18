import { SourceApiClientPort } from "../domain/ports/source-api-client-port";
import { CharacterCatalogAdapterPort } from "../domain/ports/character-catalog-adapter.port";
import { ExternalCharacterDTO } from "../domain/dtos/external-character.dto";
import { SyncedCharacterDTO } from "../../../shared/domain/dtos/synced-character.dto";
import { SyncLoggerService } from "../domain/services/sync-logger.service";
import { Timestamp } from "../../../shared/domain/value-objects/timestamp";
import { SyncType } from "../domain/value-objects/sync-type";

/**
 * Result of the synchronization process.
 */
export interface SyncResult {
  totalPages: number;
  charactersSynced: number;
  addedCount: number;
  updatedCount: number;
  deprecatedCount: number;
  durationMs: number;
}

/**
 * Use case for synchronizing character data from an external API.
 *
 * This use case orchestrates the synchronization process with pagination support:
 * 1. Fetches character data page by page from the external API
 * 2. Transforms external DTOs to synced DTOs
 * 3. Bulk processes each page for optimal performance
 * 4. Marks missing characters as deprecated (only in full sync)
 * 5. Logs the synchronization result (success or failure) to CronLog
 *
 * Supports two modes:
 * - Limited sync: Syncs only the first N characters (e.g., for app startup)
 * - Full sync: Syncs all characters (e.g., for cron job)
 *
 * Implements the business logic of the data-sync bounded context.
 */
export class SyncCharactersUseCase {
  constructor(
    private readonly sourceApiClient: SourceApiClientPort,
    private readonly characterCatalogAdapter: CharacterCatalogAdapterPort,
    private readonly syncLogger: SyncLoggerService
  ) {}

  /**
   * Executes the synchronization process.
   *
   * @param maxCharacters - Maximum number of characters to sync. If undefined, syncs all characters.
   * @param syncType - Type of synchronization (initial, scheduled, or manual). Defaults to scheduled.
   * @returns A promise that resolves to sync statistics.
   * @throws {InfrastructureException} If the external API fails.
   * @throws {RepositoryException} If database operations fail.
   */
  async execute(
    maxCharacters?: number,
    syncType: SyncType = SyncType.scheduled()
  ): Promise<SyncResult> {
    const startTime = Date.now();
    const executionDate = Timestamp.now();

    try {
      const syncData = await this.performSynchronization(maxCharacters);

      const durationMs = Date.now() - startTime;
      const result = { ...syncData, durationMs };

      await this.syncLogger.logSuccess({ executionDate, syncType, ...result });
      return result;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      await this.syncLogger.logFailure({
        executionDate,
        syncType,
        error: error instanceof Error ? error : new Error(String(error)),
        durationMs,
      });
      throw error;
    }
  }

  /**
   * Performs the core synchronization logic.
   *
   * Orchestrates the pagination loop, character processing, and deprecation marking.
   * This method contains the business logic without the logging concerns.
   *
   * @param maxCharacters - Optional limit on number of characters to sync.
   * @returns Synchronization statistics (without duration).
   */
  private async performSynchronization(maxCharacters?: number) {
    const stats = {
      totalPages: 1,
      charactersSynced: 0,
      addedCount: 0,
      updatedCount: 0,
      allExternalIds: [] as number[],
    };

    await this.runSyncLoop(stats, maxCharacters);

    let deprecatedCount = 0;
    if (!maxCharacters) {
      deprecatedCount =
        await this.characterCatalogAdapter.markMissingAsDeprecated(
          stats.allExternalIds
        );
    }

    return { ...stats, deprecatedCount };
  }

  /**
   * Runs the pagination loop to fetch and process character pages.
   *
   * Iterates through paginated API responses, processing each page and updating
   * statistics until all pages are processed or the character limit is reached.
   *
   * @param stats - Mutable statistics object to track sync progress.
   * @param maxCharacters - Optional limit on number of characters to sync.
   */
  private async runSyncLoop(
    stats: {
      totalPages: number;
      charactersSynced: number;
      addedCount: number;
      updatedCount: number;
      allExternalIds: number[];
    },
    maxCharacters?: number
  ): Promise<void> {
    let currentPage = 1;

    while (true) {
      if (maxCharacters && stats.charactersSynced >= maxCharacters) break;

      const response = await this.sourceApiClient.fetchCharactersPage(
        currentPage
      );

      if (currentPage === 1) stats.totalPages = response.info.pages;

      const pageResult = await this.processPage(response.results);

      stats.addedCount += pageResult.addedCount;
      stats.updatedCount += pageResult.updatedCount;
      stats.charactersSynced += response.results.length;
      stats.allExternalIds.push(...response.results.map((char) => char.id));

      if (
        !response.info.next ||
        (maxCharacters && stats.charactersSynced >= maxCharacters)
      )
        break;
      currentPage = response.info.next;
    }
  }

  /**
   * Processes a single page of characters from the external API.
   *
   * Transforms external character DTOs to synced DTOs and delegates to the
   * character-catalog adapter for bulk persistence.
   *
   * @param externalResults - Array of characters from the external API.
   * @returns Object with counts of added and updated characters.
   */
  private async processPage(externalResults: ExternalCharacterDTO[]) {
    const syncedCharacters = externalResults.map((char) =>
      this.mapToSyncedCharacterDTO(char)
    );

    return await this.characterCatalogAdapter.bulkCreateOrUpdateCharacters(
      syncedCharacters
    );
  }

  /**
   * Maps an external character DTO to a synced character DTO.
   *
   * This transformation decouples the external API structure from our domain model.
   *
   * @param external - The external character data from the API.
   * @returns A synced character DTO for the character-catalog context.
   */
  private mapToSyncedCharacterDTO(
    external: ExternalCharacterDTO
  ): SyncedCharacterDTO {
    const dto: SyncedCharacterDTO = {
      externalId: external.id,
      name: external.name,
      status: external.status,
      species: external.species,
      gender: external.gender,
      image: external.image,
      origin: external.origin,
      location: external.location,
    };

    // Only include type if it has a value
    if (external.type) {
      dto.type = external.type;
    }

    return dto;
  }
}
