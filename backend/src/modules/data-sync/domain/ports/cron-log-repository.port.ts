import { CronLog } from "../entities/cron-log.entity";

/**
 * Port defining the contract for CronLog repository operations.
 *
 * This interface abstracts the persistence layer for cron execution logs,
 * allowing the domain layer to remain decoupled from infrastructure concerns.
 */
export interface CronLogRepositoryPort {
  /**
   * Saves a cron log entry to the database.
   *
   * @param cronLog - The CronLog entity to persist.
   * @returns A promise that resolves when the operation completes.
   * @throws {RepositoryException} If the database operation fails.
   */
  save(cronLog: CronLog): Promise<void>;

  /**
   * Finds the most recent cron log entry.
   *
   * @returns A promise resolving to the latest CronLog or undefined if none exist.
   * @throws {RepositoryException} If the database operation fails.
   */
  findLatest(): Promise<CronLog | undefined>;

  /**
   * Checks if an initial synchronization has already been performed.
   *
   * This method searches for any cron log entry with syncType = 'initial'.
   * Used to prevent running the initial sync multiple times.
   *
   * @returns A promise resolving to `true` if initial sync exists, otherwise `false`.
   * @throws {RepositoryException} If the database operation fails.
   */
  hasInitialSync(): Promise<boolean>;
}
