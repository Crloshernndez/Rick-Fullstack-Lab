import { CronLogRepositoryPort } from "../../../../domain/ports/cron-log-repository.port";
import { CronLog as CronLogEntity } from "../../../../domain/entities/cron-log.entity";
import { CronLog as CronLogModel, SyncType } from "../models/CronLog.model";
import { EntityId } from "../../../../../../shared/domain/value-objects/entity-id";
import { Timestamp } from "../../../../../../shared/domain/value-objects/timestamp";
import { Count } from "../../../../../../shared/domain/value-objects/count";
import { DurationMs } from "../../../../../../shared/domain/value-objects/duration-ms";
import { CronLogStatus } from "../../../../domain/value-objects/cron-log-status";
import { ErrorPayload } from "../../../../domain/value-objects/error-payload";
import { SyncType as SyncTypeVO } from "../../../../domain/value-objects/sync-type";
import { RepositoryException } from "../../../../../../shared/exceptions/application-errors";

/**
 * Sequelize implementation of the CronLog repository.
 *
 * Handles the mapping between domain entities and persistence models,
 * ensuring proper conversion of value objects to database primitives and vice versa.
 * CronLog entries are append-only and immutable once created.
 */
export class CronLogRepository implements CronLogRepositoryPort {
  /**
   * Saves a cron log entry to the database.
   *
   * @param cronLog - The CronLog domain entity to persist.
   * @throws {RepositoryException} If database operation fails.
   */
  async save(cronLog: CronLogEntity): Promise<void> {
    try {
      const data = this.toPersistence(cronLog);
      await CronLogModel.create(data);
    } catch (error) {
      throw new RepositoryException(
        `Failed to save cron log: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Finds the most recent cron log entry.
   *
   * @returns The latest CronLog domain entity or undefined if none exist.
   * @throws {RepositoryException} If database query fails.
   */
  async findLatest(): Promise<CronLogEntity | undefined> {
    try {
      const model = await CronLogModel.findOne({
        order: [["execution_date", "DESC"]],
      });

      return model ? this.toDomain(model) : undefined;
    } catch (error) {
      throw new RepositoryException(
        `Failed to find latest cron log: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Checks if an initial synchronization has already been performed.
   *
   * @returns `true` if initial sync exists, otherwise `false`.
   * @throws {RepositoryException} If database query fails.
   */
  async hasInitialSync(): Promise<boolean> {
    try {
      const count = await CronLogModel.count({
        where: {
          syncType: SyncType.INITIAL,
        },
      });

      return count > 0;
    } catch (error) {
      throw new RepositoryException(
        `Failed to check initial sync: ${error instanceof Error ? error.message : String(error)}`
      );
    }
  }

  /**
   * Maps a Sequelize model to a domain entity.
   *
   * Converts database primitives to value objects and reconstructs the entity
   * with all its business logic and invariants.
   *
   * @param model - The Sequelize model instance.
   * @returns A CronLog domain entity.
   */
  private toDomain(model: CronLogModel): CronLogEntity {
    return new CronLogEntity({
      id: new EntityId(model.id),
      executionDate: Timestamp.from(model.executionDate),
      syncType: new SyncTypeVO(model.syncType),
      addedCount: new Count(model.addedCount),
      updatedCount: new Count(model.updatedCount),
      deprecatedCount: new Count(model.deprecatedCount),
      status: new CronLogStatus(model.status),
      createdAt: Timestamp.from(model.createdAt),
      ...(model.errorPayload && {
        errorPayload: ErrorPayload.fromJSON(model.errorPayload),
      }),
      ...(model.durationMs && { durationMs: new DurationMs(model.durationMs) }),
    });
  }

  /**
   * Maps a domain entity to a Sequelize model data object.
   *
   * Converts value objects to database primitives suitable for persistence.
   *
   * @param entity - The CronLog domain entity.
   * @returns A plain object ready for Sequelize operations.
   */
  private toPersistence(entity: CronLogEntity): any {
    return {
      id: entity.id.toValue(),
      executionDate: entity.executionDate.toValue(),
      syncType: entity.syncType.toValue(),
      addedCount: entity.addedCount.toValue(),
      updatedCount: entity.updatedCount.toValue(),
      deprecatedCount: entity.deprecatedCount.toValue(),
      status: entity.status.toValue(),
      errorPayload: entity.errorPayload?.toJSON(),
      durationMs: entity.durationMs?.toValue(),
      createdAt: entity.createdAt.toValue(),
    };
  }
}
