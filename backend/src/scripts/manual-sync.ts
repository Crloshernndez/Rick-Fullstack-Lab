/**
 * Manual synchronization script.
 *
 * This script allows manually triggering the scheduled character synchronization
 * that normally runs via cron job every 12 hours.
 *
 * Usage: npm run sync:manual
 */

import { getContainer } from "../core/di/container";
import { sequelize } from "../core/database/database";
import { SyncType } from "../modules/data-sync/domain/value-objects/sync-type";

/**
 * Main execution function for manual sync.
 *
 * Uses the DI container to get all required dependencies and executes
 * the synchronization with manual type.
 */
async function main() {
  try {
    console.log("🚀 Starting manual synchronization...");

    // Initialize database connection
    await sequelize.authenticate();
    console.log("✅ Database connection established");

    // Get dependencies from container
    const container = getContainer();
    const { syncCharactersUseCase } = container;

    console.log("📥 Fetching all characters from Rick and Morty API...");

    // Execute full sync with manual type
    const result = await syncCharactersUseCase.execute(
      undefined,
      SyncType.manual()
    );

    console.log("✅ Manual synchronization completed successfully!");
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
    console.error("❌ Manual synchronization failed:");
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
