import { Entity } from "../../../../shared/domain/entity";
import { EntityId } from "../../../../shared/domain/value-objects/entity-id";
import { Timestamp } from "../../../../shared/domain/value-objects/timestamp";
import { Count } from "../../../../shared/domain/value-objects/count";
import { DurationMs } from "../../../../shared/domain/value-objects/duration-ms";
import { CronLogStatus } from "../value-objects/cron-log-status.value-object";
import { ErrorPayload } from "../value-objects/error-payload.value-object";

/**
 * Properties required to construct a CronLog entity.
 */
export interface CronLogProps {
  id?: EntityId;
  executionDate: Timestamp;
  addedCount?: Count;
  updatedCount?: Count;
  deprecatedCount?: Count;
  status: CronLogStatus;
  errorPayload?: ErrorPayload;
  durationMs?: DurationMs;
  createdAt?: Timestamp;
}

/**
 * Domain entity representing a log entry for a cron job execution.
 *
 * A CronLog is an aggregate root that captures the results of a data
 * synchronization job execution. It tracks the number of records added,
 * updated, and deprecated, along with execution status, duration, and
 * any error information.
 *
 * This entity is immutable once created - cron logs are append-only
 * records that should not be modified after creation.
 *
 * @extends Entity<EntityId>
 */
export class CronLog extends Entity<EntityId> {
  private readonly _executionDate: Timestamp;
  private readonly _addedCount: Count;
  private readonly _updatedCount: Count;
  private readonly _deprecatedCount: Count;
  private readonly _status: CronLogStatus;
  private readonly _errorPayload?: ErrorPayload;
  private readonly _durationMs?: DurationMs;

  /**
   * Creates a new CronLog entity instance.
   *
   * @param props - The properties to initialize the cron log with.
   */
  constructor(props: CronLogProps) {
    super(props.id || EntityId.generate(), props.createdAt);

    this._executionDate = props.executionDate;
    this._addedCount = props.addedCount || Count.zero();
    this._updatedCount = props.updatedCount || Count.zero();
    this._deprecatedCount = props.deprecatedCount || Count.zero();
    this._status = props.status;
    this._errorPayload = props.errorPayload;
    this._durationMs = props.durationMs;
  }

  /**
   * Factory method to create a successful cron log.
   *
   * @param props - The execution properties (counts, duration, etc.).
   * @returns A new CronLog instance with success status.
   */
  static createSuccess(props: {
    executionDate: Timestamp;
    addedCount?: Count;
    updatedCount?: Count;
    deprecatedCount?: Count;
    durationMs?: DurationMs;
  }): CronLog {
    return new CronLog({
      ...props,
      status: CronLogStatus.success(),
    });
  }

  /**
   * Factory method to create a failed cron log.
   *
   * @param props - The execution properties including error information.
   * @returns A new CronLog instance with failed status.
   */
  static createFailure(props: {
    executionDate: Timestamp;
    errorPayload: ErrorPayload;
    durationMs?: DurationMs;
  }): CronLog {
    return new CronLog({
      ...props,
      status: CronLogStatus.failed(),
    });
  }

  /**
   * Returns the execution date of the cron job.
   *
   * @returns The execution timestamp.
   */
  get executionDate(): Timestamp {
    return this._executionDate;
  }

  /**
   * Returns the count of records added during this execution.
   *
   * @returns The added count.
   */
  get addedCount(): Count {
    return this._addedCount;
  }

  /**
   * Returns the count of records updated during this execution.
   *
   * @returns The updated count.
   */
  get updatedCount(): Count {
    return this._updatedCount;
  }

  /**
   * Returns the count of records deprecated during this execution.
   *
   * @returns The deprecated count.
   */
  get deprecatedCount(): Count {
    return this._deprecatedCount;
  }

  /**
   * Returns the execution status.
   *
   * @returns The CronLogStatus value object.
   */
  get status(): CronLogStatus {
    return this._status;
  }

  /**
   * Returns the error payload if the execution failed.
   *
   * @returns The ErrorPayload value object, or undefined if successful.
   */
  get errorPayload(): ErrorPayload | undefined {
    return this._errorPayload;
  }

  /**
   * Returns the execution duration in milliseconds.
   *
   * @returns The DurationMs value object, or undefined if not recorded.
   */
  get durationMs(): DurationMs | undefined {
    return this._durationMs;
  }

  /**
   * Returns the total count of all operations (added + updated + deprecated).
   *
   * @returns The total operation count.
   */
  getTotalOperations(): Count {
    return this._addedCount
      .add(this._updatedCount)
      .add(this._deprecatedCount);
  }

  /**
   * Checks if the execution was successful.
   *
   * @returns `true` if status is success, otherwise `false`.
   */
  isSuccess(): boolean {
    return this._status.isSuccess();
  }

  /**
   * Checks if the execution failed.
   *
   * @returns `true` if status is failed, otherwise `false`.
   */
  isFailed(): boolean {
    return this._status.isFailed();
  }

  /**
   * Checks if any records were processed during this execution.
   *
   * @returns `true` if at least one operation occurred, otherwise `false`.
   */
  hasProcessedRecords(): boolean {
    return !this.getTotalOperations().isZero();
  }

  /**
   * Converts the cron log entity to a plain object representation.
   *
   * @returns A plain object containing all cron log properties.
   */
  toObject(): Record<string, any> {
    return {
      id: this._id.toValue(),
      executionDate: this._executionDate.toISOString(),
      addedCount: this._addedCount.toValue(),
      updatedCount: this._updatedCount.toValue(),
      deprecatedCount: this._deprecatedCount.toValue(),
      totalOperations: this.getTotalOperations().toValue(),
      status: this._status.toValue(),
      errorPayload: this._errorPayload?.toValue(),
      durationMs: this._durationMs?.toValue(),
      createdAt: this._createdAt.toISOString(),
      updatedAt: this._updatedAt.toISOString(),
    };
  }
}
