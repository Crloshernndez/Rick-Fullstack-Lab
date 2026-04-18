/**
 * Initial synchronization script.
 *
 * This script performs the initial data synchronization from the Rick and Morty API
 * to populate the database with character data on first startup.
 *
 * It should be run once when the application starts for the first time or when
 * the database is reset.
 *
 * Usage: npm run sync:initial
 */

import { getContainer } from "../core/di/container";
import { sequelize } from "../core/database/database";
import { SyncType } from "../modules/data-sync/domain/value-objects/sync-type";

/**
 * Main execution function for initial sync.
 *
 * Uses the DI container to get all required dependencies and executes
 * the initial synchronization if needed.
 */
async function main() {
  try {
    console.log("🚀 Starting initial synchronization...");

    // Initialize database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Get dependencies from container
    const container = getContainer();
    const { syncCharactersUseCase, initialSyncGuardService } = container;

    // Check if initial sync is needed
    const hasInitialSync =
      await initialSyncGuardService.hasInitialSyncCompleted();

    if (hasInitialSync) {
      console.log("ℹ️  Initial sync already completed. Skipping...");
      await sequelize.close();
      process.exit(0);
    }

    console.log("📥 Fetching all characters from Rick and Morty API...");

    // Execute full sync with initial type
    // If INITIAL_CHARACTERS env var is set, use it as limit; otherwise sync all
    const maxCharacters = process.env.INITIAL_CHARACTERS
      ? parseInt(process.env.INITIAL_CHARACTERS, 10)
      : undefined;

    const result = await syncCharactersUseCase.execute(
      maxCharacters,
      SyncType.initial()
    );

    console.log("✅ Initial synchronization completed successfully!");
    console.log(`   📊 Statistics:`);
    console.log(`      - Total pages processed: ${result.totalPages}`);
    console.log(`      - Characters synced: ${result.charactersSynced}`);
    console.log(`      - Added: ${result.addedCount}`);
    console.log(`      - Updated: ${result.updatedCount}`);
    console.log(`      - Deprecated: ${result.deprecatedCount}`);
    console.log(`      - Duration: ${(result.durationMs / 1000).toFixed(2)}s`);

    // Close database connection
    await sequelize.close();
    process.exit(0);
  } catch (error) {
    console.error("❌ Initial synchronization failed:");
    console.error(error);

    // Close database connection on error
    try {
      await sequelize.close();
    } catch (closeError) {
      console.error("Failed to close database connection:", closeError);
    }

    process.exit(1);
  }
}

// Execute main function
main();
