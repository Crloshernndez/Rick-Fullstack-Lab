import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Valid status values for a cron log execution.
 */
export enum CronLogStatusEnum {
  SUCCESS = "success",
  FAILED = "failed",
}

/**
 * Value Object representing the execution status of a cron job.
 *
 * Ensures that only valid status values (success, failed) are used
 * within the data-sync domain, preventing arbitrary strings from
 * being assigned as cron log status.
 *
 * @extends ValueObject<string>
 */
export class CronLogStatus extends ValueObject<string> {
  /**
   * Validates that the given status is one of the allowed values.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a valid cron log status.
   */
  protected validate(value: string): void {
    const validStatuses = Object.values(CronLogStatusEnum);

    if (!validStatuses.includes(value as CronLogStatusEnum)) {
      throw new ValidationException(
        `Invalid cron log status. Must be one of: ${validStatuses.join(", ")}`,
        { value, allowedValues: validStatuses }
      );
    }
  }

  /**
   * Checks if the cron execution was successful.
   *
   * @returns `true` if status is "success", otherwise `false`.
   */
  isSuccess(): boolean {
    return this._value === CronLogStatusEnum.SUCCESS;
  }

  /**
   * Checks if the cron execution failed.
   *
   * @returns `true` if status is "failed", otherwise `false`.
   */
  isFailed(): boolean {
    return this._value === CronLogStatusEnum.FAILED;
  }

  /**
   * Factory method to create a success status.
   *
   * @returns A new CronLogStatus instance with "success" value.
   */
  static success(): CronLogStatus {
    return new CronLogStatus(CronLogStatusEnum.SUCCESS);
  }

  /**
   * Factory method to create a failed status.
   *
   * @returns A new CronLogStatus instance with "failed" value.
   */
  static failed(): CronLogStatus {
    return new CronLogStatus(CronLogStatusEnum.FAILED);
  }
}
