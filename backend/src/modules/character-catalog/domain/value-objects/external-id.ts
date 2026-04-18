import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Value Object representing an external identifier from a third-party source.
 *
 * Encapsulates validation rules ensuring the ID is always a positive integer,
 * consistent with external API conventions (e.g., Rick and Morty API).
 *
 * @extends ValueObject<number>
 */
export class ExternalId extends ValueObject<number> {
  /**
   * Validates that the given value meets the constraints of an external ID.
   *
   * @param value - The numeric value to validate.
   * @throws {ValidationException} If the value is not an integer.
   * @throws {ValidationException} If the value is not greater than zero.
   */
  protected validate(value: number): void {
    if (!Number.isInteger(value)) {
      throw new ValidationException("External ID must be an integer", {
        value,
      });
    }

    if (value <= 0) {
      throw new ValidationException("External ID must be a positive integer", {
        value,
      });
    }
  }
}
