import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a valid URL.
 *
 * Ensures that any URL used within the domain conforms to the standard URL format,
 * preventing malformed or invalid URLs from being stored or processed.
 *
 * @extends ValueObject<string>
 */
export class Url extends ValueObject<string> {
  /**
   * Validates that the given value is a well-formed URL.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a valid URL format.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("URL must be a string", { value });
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new ValidationException("URL cannot be empty", { value });
    }

    try {
      new URL(trimmed);
    } catch (error) {
      throw new ValidationException("Invalid URL format", { value, error: (error as Error).message });
    }
  }

  /**
   * Returns the trimmed URL value.
   *
   * @returns The URL string without leading or trailing whitespace.
   */
  toValue(): string {
    return this._value.trim();
  }

  /**
   * Returns the URL hostname (e.g., "example.com").
   *
   * @returns The hostname portion of the URL.
   */
  getHostname(): string {
    return new URL(this._value).hostname;
  }

  /**
   * Returns the URL pathname (e.g., "/path/to/resource").
   *
   * @returns The pathname portion of the URL.
   */
  getPathname(): string {
    return new URL(this._value).pathname;
  }
}