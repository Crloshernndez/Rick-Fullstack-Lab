import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Value Object representing a character's type or subspecies.
 *
 * Enforces basic validation rules without restricting to a predefined set of values,
 * as the external API may return dynamic or unexpected type classifications.
 * This field provides additional detail about the character beyond their species.
 *
 * @extends ValueObject<string>
 */
export class CharacterType extends ValueObject<string> {
  private static readonly MAX_LENGTH = 100;

  /**
   * Validates that the type value is a valid non-empty string within length constraints.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a string, is empty, or exceeds the maximum length.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Character type must be a string", {
        value,
      });
    }

    const trimmed = value.trim();

    if (trimmed.length > CharacterType.MAX_LENGTH) {
      throw new ValidationException(
        `Character type must not exceed ${CharacterType.MAX_LENGTH} characters`,
        { value, maxLength: CharacterType.MAX_LENGTH }
      );
    }
  }

  /**
   * Returns the trimmed type value.
   *
   * @returns The type string without leading or trailing whitespace.
   */
  toValue(): string {
    return this._value.trim();
  }
}