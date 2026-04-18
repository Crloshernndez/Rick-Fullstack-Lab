import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a name (e.g., character name, username, etc.).
 *
 * Enforces business rules such as minimum and maximum length constraints,
 * and ensures that the name is not empty or composed only of whitespace.
 * This prevents invalid or nonsensical names from entering the domain.
 *
 * @extends ValueObject<string>
 */
export class Name extends ValueObject<string> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 255;

  /**
   * Validates that the given name meets the defined constraints.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the name is empty, exceeds length limits, or contains only whitespace.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Name must be a string", { value });
    }

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      throw new ValidationException("Name cannot be empty or contain only whitespace", { value });
    }

    if (trimmedValue.length < Name.MIN_LENGTH) {
      throw new ValidationException(
        `Name must be at least ${Name.MIN_LENGTH} character(s) long`,
        { value, minLength: Name.MIN_LENGTH }
      );
    }

    if (trimmedValue.length > Name.MAX_LENGTH) {
      throw new ValidationException(
        `Name must not exceed ${Name.MAX_LENGTH} characters`,
        { value, maxLength: Name.MAX_LENGTH }
      );
    }
  }

  /**
   * Returns the trimmed name value.
   *
   * Ensures that leading and trailing whitespace is always removed
   * when accessing the value.
   *
   * @returns The trimmed name string.
   */
  toValue(): string {
    return this._value.trim();
  }
}
