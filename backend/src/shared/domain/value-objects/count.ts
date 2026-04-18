import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a non-negative count or quantity.
 *
 * Ensures that count values are always valid non-negative integers,
 * preventing negative or invalid numeric values from entering the domain.
 * Commonly used for counting items, operations, or occurrences.
 *
 * @extends ValueObject<number>
 */
export class Count extends ValueObject<number> {
  /**
   * Validates that the count is a non-negative integer.
   *
   * @param value - The numeric value to validate.
   * @throws {ValidationException} If the value is not an integer, is negative, or is NaN.
   */
  protected validate(value: number): void {
    if (typeof value !== "number" || isNaN(value)) {
      throw new ValidationException("Count must be a valid number", { value });
    }

    if (!Number.isInteger(value)) {
      throw new ValidationException("Count must be an integer", { value });
    }

    if (value < 0) {
      throw new ValidationException("Count cannot be negative", { value });
    }
  }

  /**
   * Factory method to create a count with value zero.
   *
   * @returns A new Count instance with value 0.
   */
  static zero(): Count {
    return new Count(0);
  }

  /**
   * Increments the count by a specified amount.
   *
   * @param amount - The amount to add (defaults to 1).
   * @returns A new Count instance with the incremented value.
   */
  increment(amount: number = 1): Count {
    return new Count(this._value + amount);
  }

  /**
   * Decrements the count by a specified amount.
   *
   * @param amount - The amount to subtract (defaults to 1).
   * @returns A new Count instance with the decremented value.
   * @throws {ValidationException} If the result would be negative.
   */
  decrement(amount: number = 1): Count {
    const newValue = this._value - amount;
    if (newValue < 0) {
      throw new ValidationException("Cannot decrement count below zero", {
        currentValue: this._value,
        amount,
      });
    }
    return new Count(newValue);
  }

  /**
   * Checks if the count is zero.
   *
   * @returns `true` if the count is 0, otherwise `false`.
   */
  isZero(): boolean {
    return this._value === 0;
  }

  /**
   * Adds another count to this count.
   *
   * @param other - The Count to add.
   * @returns A new Count instance with the sum.
   */
  add(other: Count): Count {
    return new Count(this._value + other._value);
  }
}
