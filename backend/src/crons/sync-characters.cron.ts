/**
 * Scheduled cron job for periodic character synchronization.
 *
 * Runs every 12 hours to keep character data up to date
 * with the Rick and Morty API.
 */

import cron from "node-cron";
import { getContainer } from "../core/di/container";
import { SyncType } from "../modules/data-sync/domain/value-objects/sync-type";

/**
 * Registers the character sync cron job.
 *
 * Should be called once during application startup, after the
 * database connection has been established.
 */
export function registerSyncCharactersCron(): void {
  // '0 */12 * * *' = at minute 0 of every 12th hour
  cron.schedule("0 */12 * * *", async () => {
    console.log("⏰ [CRON] Starting scheduled character synchronization...");

    try {
      const { syncCharactersUseCase } = getContainer();

      const result = await syncCharactersUseCase.execute(
        undefined,
        SyncType.scheduled()
      );

      console.log("✅ [CRON] Scheduled synchronization completed!");
      console.log(`   📊 Statistics:`);
      console.log(`      - Total pages processed: ${result.totalPages}`);
      console.log(`      - Characters synced: ${result.charactersSynced}`);
      console.log(`      - Added: ${result.addedCount}`);
      console.log(`      - Updated: ${result.updatedCount}`);
      console.log(`      - Deprecated: ${result.deprecatedCount}`);
      console.log(
        `      - Duration: ${(result.durationMs / 1000).toFixed(2)}s`
      );
    } catch (error) {
      // Log but never throw — a cron failure should not crash the app
      console.error("❌ [CRON] Scheduled synchronization failed:", error);
    }
  });

  console.log("✅ [CRON] Character sync job registered (every 12 hours)");
}
