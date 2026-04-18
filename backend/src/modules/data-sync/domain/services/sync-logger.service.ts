import { CronLog } from "../entities/cron-log.entity";
import { CronLogRepositoryPort } from "../ports/cron-log-repository.port";
import { Timestamp } from "../../../../shared/domain/value-objects/timestamp";
import { Count } from "../../../../shared/domain/value-objects/count";
import { DurationMs } from "../../../../shared/domain/value-objects/duration-ms";
import { ErrorPayload } from "../value-objects/error-payload";
import { SyncType } from "../value-objects/sync-type";

/**
 * Domain service for logging synchronization operations.
 *
 * This service encapsulates the business logic for creating and persisting
 * cron execution logs. It handles both successful and failed synchronizations,
 * ensuring that all sync operations are properly tracked for audit purposes.
 *
 * Following DDD principles, this is a domain service because the logic of
 * "logging a sync operation" doesn't naturally belong to any single entity.
 */
export class SyncLoggerService {
  constructor(private readonly cronLogRepository: CronLogRepositoryPort) {}

  /**
   * Logs a successful synchronization operation.
   *
   * @param params - Synchronization statistics including sync type.
   * @returns A promise that resolves when the log is saved.
   */
  async logSuccess(params: {
    executionDate: Timestamp;
    syncType: SyncType;
    addedCount: number;
    updatedCount: number;
    deprecatedCount: number;
    durationMs: number;
  }): Promise<void> {
    const cronLog = CronLog.createSuccess({
      executionDate: params.executionDate,
      syncType: params.syncType,
      addedCount: new Count(params.addedCount),
      updatedCount: new Count(params.updatedCount),
      deprecatedCount: new Count(params.deprecatedCount),
      durationMs: new DurationMs(params.durationMs),
    });

    await this.cronLogRepository.save(cronLog);
  }

  /**
   * Logs a failed synchronization operation.
   *
   * @param params - Failure information including sync type.
   * @returns A promise that resolves when the log is saved.
   */
  async logFailure(params: {
    executionDate: Timestamp;
    syncType: SyncType;
    error: Error;
    durationMs: number;
  }): Promise<void> {
    const cronLog = CronLog.createFailure({
      executionDate: params.executionDate,
      syncType: params.syncType,
      errorPayload: ErrorPayload.fromError(params.error),
      durationMs: new DurationMs(params.durationMs),
    });

    await this.cronLogRepository.save(cronLog);
  }
}

