import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Value Object representing a character's gender.
 *
 * Enforces basic validation rules without restricting to a predefined set of values,
 * as the external API may return various gender identifications. Common values
 * include Male, Female, Genderless, and unknown.
 *
 * @extends ValueObject<string>
 */
export class Gender extends ValueObject<string> {
  private static readonly MAX_LENGTH = 50;

  /**
   * Validates that the gender value is a valid non-empty string within length constraints.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a string, is empty, or exceeds the maximum length.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Gender must be a string", { value });
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new ValidationException("Gender cannot be empty or contain only whitespace", { value });
    }

    if (trimmed.length > Gender.MAX_LENGTH) {
      throw new ValidationException(
        `Gender must not exceed ${Gender.MAX_LENGTH} characters`,
        { value, maxLength: Gender.MAX_LENGTH }
      );
    }
  }

  /**
   * Returns the trimmed gender value.
   *
   * @returns The gender string without leading or trailing whitespace.
   */
  toValue(): string {
    return this._value.trim();
  }
}
