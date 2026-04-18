import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Valid synchronization types.
 */
export enum SyncTypeEnum {
  INITIAL = "initial",
  SCHEDULED = "scheduled",
  MANUAL = "manual",
}

/**
 * Value Object representing the type of synchronization execution.
 *
 * Distinguishes between different sync scenarios:
 * - Initial: First-time sync when app starts (limited to 15 characters)
 * - Scheduled: Regular cron job sync (all characters)
 * - Manual: User-triggered sync
 *
 * @extends ValueObject<string>
 */
export class SyncType extends ValueObject<string> {
  /**
   * Validates that the sync type is one of the allowed values.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a valid sync type.
   */
  protected validate(value: string): void {
    const validTypes = Object.values(SyncTypeEnum);

    if (!validTypes.includes(value as SyncTypeEnum)) {
      throw new ValidationException(
        `Invalid sync type. Must be one of: ${validTypes.join(", ")}`,
        { value, allowedValues: validTypes }
      );
    }
  }

  /**
   * Checks if this is an initial sync.
   *
   * @returns `true` if sync type is "initial", otherwise `false`.
   */
  isInitial(): boolean {
    return this._value === SyncTypeEnum.INITIAL;
  }

  /**
   * Checks if this is a scheduled sync.
   *
   * @returns `true` if sync type is "scheduled", otherwise `false`.
   */
  isScheduled(): boolean {
    return this._value === SyncTypeEnum.SCHEDULED;
  }

  /**
   * Checks if this is a manual sync.
   *
   * @returns `true` if sync type is "manual", otherwise `false`.
   */
  isManual(): boolean {
    return this._value === SyncTypeEnum.MANUAL;
  }

  /**
   * Factory method to create an initial sync type.
   *
   * @returns A new SyncType instance with "initial" value.
   */
  static initial(): SyncType {
    return new SyncType(SyncTypeEnum.INITIAL);
  }

  /**
   * Factory method to create a scheduled sync type.
   *
   * @returns A new SyncType instance with "scheduled" value.
   */
  static scheduled(): SyncType {
    return new SyncType(SyncTypeEnum.SCHEDULED);
  }

  /**
   * Factory method to create a manual sync type.
   *
   * @returns A new SyncType instance with "manual" value.
   */
  static manual(): SyncType {
    return new SyncType(SyncTypeEnum.MANUAL);
  }
}
