import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a duration in milliseconds.
 *
 * Ensures that duration values are always valid positive integers,
 * preventing negative or invalid time measurements from entering the domain.
 * Commonly used for measuring execution time, timeouts, or delays.
 *
 * @extends ValueObject<number>
 */
export class DurationMs extends ValueObject<number> {
  /**
   * Validates that the duration is a positive integer.
   *
   * @param value - The numeric value to validate.
   * @throws {ValidationException} If the value is not an integer, is negative, or is NaN.
   */
  protected validate(value: number): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new ValidationException("Duration must be a valid number", { value });
    }

    if (!Number.isInteger(value)) {
      throw new ValidationException("Duration must be an integer", { value });
    }

    if (value < 0) {
      throw new ValidationException("Duration cannot be negative", { value });
    }
  }

  /**
   * Converts the duration to seconds.
   *
   * @returns The duration in seconds (with decimal precision).
   */
  toSeconds(): number {
    return this._value / 1000;
  }

  /**
   * Converts the duration to minutes.
   *
   * @returns The duration in minutes (with decimal precision).
   */
  toMinutes(): number {
    return this._value / 60000;
  }

  /**
   * Returns a human-readable string representation of the duration.
   *
   * @returns A formatted string (e.g., "1.5s", "250ms").
   */
  toHumanReadable(): string {
    if (this._value < 1000) {
      return `${this._value}ms`;
    } else if (this._value < 60000) {
      return `${(this._value / 1000).toFixed(2)}s`;
    } else {
      return `${(this._value / 60000).toFixed(2)}min`;
    }
  }

  /**
   * Checks if this duration is longer than another duration.
   *
   * @param other - The duration to compare against.
   * @returns `true` if this duration is longer, otherwise `false`.
   */
  isLongerThan(other: DurationMs): boolean {
    return this._value > other._value;
  }

  /**
   * Checks if this duration is shorter than another duration.
   *
   * @param other - The duration to compare against.
   * @returns `true` if this duration is shorter, otherwise `false`.
   */
  isShorterThan(other: DurationMs): boolean {
    return this._value < other._value;
  }
}
