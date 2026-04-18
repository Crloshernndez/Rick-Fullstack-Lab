import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Value Object representing an error payload or error message.
 *
 * Stores detailed error information from failed cron executions,
 * ensuring that error messages are properly validated and do not exceed
 * reasonable length limits.
 *
 * @extends ValueObject<string>
 */
export class ErrorPayload extends ValueObject<string> {
  private static readonly MAX_LENGTH = 10000;

  /**
   * Validates that the error payload is a valid string within length constraints.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a string or exceeds the maximum length.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Error payload must be a string", {
        value,
      });
    }

    if (value.length > ErrorPayload.MAX_LENGTH) {
      throw new ValidationException(
        `Error payload must not exceed ${ErrorPayload.MAX_LENGTH} characters`,
        {
          value: value.substring(0, 100) + "...",
          maxLength: ErrorPayload.MAX_LENGTH,
        }
      );
    }
  }

  /**
   * Factory method that reconstructs an `ErrorPayload` from a previously serialized JSON object.
   *
   * Intended to be used as the counterpart of `toJSON()`, for example when
   * reading error information from a database or an API response.
   *
   * @param json - The JSON object produced by `toJSON()`.
   * @returns A new `ErrorPayload` instance reconstructed from the serialized payload.
   * @throws {ValidationException} If the payload field is missing or invalid.
   */
  static fromJSON(json: {
    payload: string;
    length: number;
    truncated: string;
  }): ErrorPayload {
    return new ErrorPayload(json.payload);
  }

  /**
   * Serializes the error payload to a JSON-compatible structure.
   *
   * Useful when persisting error information to a database or
   * sending it through an API response.
   *
   * @returns An object containing the full payload, its length,
   * and a truncated preview for display purposes.
   */
  toJSON(): { payload: string; length: number; truncated: string } {
    return {
      payload: this._value,
      length: this._value.length,
      truncated: this.getTruncated(),
    };
  }

  /**
   * Factory method to create an ErrorPayload from an Error object.
   *
   * Extracts the error message and stack trace if available.
   *
   * @param error - The Error object to convert.
   * @returns A new ErrorPayload instance.
   */
  static fromError(error: Error): ErrorPayload {
    const payload = error.stack || error.message || String(error);
    return new ErrorPayload(payload);
  }

  /**
   * Returns a truncated version of the error payload.
   *
   * Useful for logging or displaying error summaries.
   *
   * @param maxLength - The maximum length of the truncated string (default: 200).
   * @returns The truncated error payload.
   */
  getTruncated(maxLength: number = 200): string {
    if (this._value.length <= maxLength) {
      return this._value;
    }
    return this._value.substring(0, maxLength) + "...";
  }
}
