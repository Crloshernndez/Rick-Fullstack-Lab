import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a timestamp (date and time).
 *
 * Ensures that any date value used within the domain is valid and can be
 * properly parsed. Supports ISO 8601 format (e.g., "2017-11-04T21:12:45.235Z")
 * and other valid date representations.
 *
 * @extends ValueObject<Date>
 */
export class Timestamp extends ValueObject<Date> {
  /**
   * Validates that the given value can be converted to a valid Date.
   *
   * @param value - The Date object or string to validate.
   * @throws {ValidationException} If the value cannot be parsed as a valid date.
   */
  protected validate(value: Date | string | number): void {
    const date = value instanceof Date ? value : new Date(value);

    if (isNaN(date.getTime())) {
      throw new ValidationException("Invalid date format", { value });
    }
  }

  /**
   * Creates a Timestamp from a Date object, string, or timestamp number.
   *
   * @param value - The date value (Date, ISO string, or Unix timestamp).
   * @returns A new Timestamp instance.
   */
  static from(value: Date | string | number): Timestamp {
    const date = value instanceof Date ? value : new Date(value);
    return new Timestamp(date);
  }

  /**
   * Creates a Timestamp representing the current date and time.
   *
   * @returns A new Timestamp instance with the current date and time.
   */
  static now(): Timestamp {
    return new Timestamp(new Date());
  }

  /**
   * Returns the Date object.
   *
   * @returns The internal Date value.
   */
  toValue(): Date {
    return this._value;
  }

  /**
   * Returns the ISO 8601 string representation of the timestamp.
   *
   * @returns The timestamp in ISO format (e.g., "2017-11-04T21:12:45.235Z").
   */
  toISOString(): string {
    return this._value.toISOString();
  }

  /**
   * Returns the Unix timestamp in milliseconds.
   *
   * @returns The number of milliseconds since January 1, 1970, 00:00:00 UTC.
   */
  toMilliseconds(): number {
    return this._value.getTime();
  }

  /**
   * Checks if this timestamp is before another timestamp.
   *
   * @param other - The timestamp to compare against.
   * @returns `true` if this timestamp is before the other, otherwise `false`.
   */
  isBefore(other: Timestamp): boolean {
    return this._value.getTime() < other._value.getTime();
  }

  /**
   * Checks if this timestamp is after another timestamp.
   *
   * @param other - The timestamp to compare against.
   * @returns `true` if this timestamp is after the other, otherwise `false`.
   */
  isAfter(other: Timestamp): boolean {
    return this._value.getTime() > other._value.getTime();
  }

  /**
   * Checks if this timestamp is equal to another timestamp.
   *
   * @param other - The timestamp to compare against.
   * @returns `true` if both timestamps represent the same moment in time, otherwise `false`.
   */
  isEqual(other: Timestamp): boolean {
    return this._value.getTime() === other._value.getTime();
  }
}
