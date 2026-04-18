import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Value Object representing a character's species.
 *
 * Enforces basic validation rules without restricting to a predefined set of values,
 * as the external API may return dynamic or unexpected species types. Common values
 * include Human, Alien, Humanoid, Robot, Cronenberg, among others.
 *
 * @extends ValueObject<string>
 */
export class CharacterSpecies extends ValueObject<string> {
  private static readonly MAX_LENGTH = 100;

  /**
   * Validates that the species value is a valid non-empty string within length constraints.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a string, is empty, or exceeds the maximum length.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Species must be a string", { value });
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new ValidationException(
        "Species cannot be empty or contain only whitespace",
        { value }
      );
    }

    if (trimmed.length > CharacterSpecies.MAX_LENGTH) {
      throw new ValidationException(
        `Species must not exceed ${CharacterSpecies.MAX_LENGTH} characters`,
        { value, maxLength: CharacterSpecies.MAX_LENGTH }
      );
    }
  }

  /**
   * Returns the trimmed species value.
   *
   * @returns The species string without leading or trailing whitespace.
   */
  toValue(): string {
    return this._value.trim();
  }
}
