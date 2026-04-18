import { CronLogRepositoryPort } from "../ports/cron-log-repository.port";

/**
 * Domain service for guarding against duplicate initial synchronizations.
 *
 * This service ensures that the initial sync (15 characters on app startup)
 * only runs once, even if the application is restarted multiple times.
 * It checks the database for any existing initial sync log before allowing
 * the sync to proceed.
 *
 * Following DDD principles, this is a domain service because the logic of
 * "preventing duplicate initial syncs" involves coordination that doesn't
 * naturally belong to any single entity.
 */
export class InitialSyncGuardService {
  constructor(private readonly cronLogRepository: CronLogRepositoryPort) {}

  /**
   * Checks if the initial synchronization can be executed.
   *
   * Returns true only if no initial sync has been recorded in the database.
   * This prevents running the initial sync multiple times across app restarts.
   *
   * @returns A promise resolving to `true` if initial sync should run, `false` otherwise.
   */
  async canRunInitialSync(): Promise<boolean> {
    const hasInitialSync = await this.cronLogRepository.hasInitialSync();
    return !hasInitialSync;
  }

  /**
   * Checks if the initial synchronization has already been performed.
   *
   * This is a convenience method for readability when checking if initial
   * sync has completed.
   *
   * @returns A promise resolving to `true` if initial sync exists, `false` otherwise.
   */
  async hasInitialSyncCompleted(): Promise<boolean> {
    return await this.cronLogRepository.hasInitialSync();
  }
}
