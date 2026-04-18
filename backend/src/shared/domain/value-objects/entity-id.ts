import { randomUUID, validate as validateUUID } from "crypto";
import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a universally unique identifier (UUID) for domain entities.
 *
 * Ensures that any ID used within the domain is a valid UUID v4, preventing
 * the use of arbitrary strings as identifiers and maintaining consistency
 * across all domain entities.
 *
 * @extends ValueObject<string>
 */
export class EntityId extends ValueObject<string> {
  /**
   * Validates that the given value is a well-formed UUID.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value does not conform to the UUID format.
   */

  protected validate(value: string): void {
    if (!validateUUID(value)) {
      throw new ValidationException("Invalid UUID format", { value });
    }
  }

  /**
   * Factory method that creates a new `EntityId` with a randomly generated UUID v4.
   *
   * Preferred over the constructor when creating new entities, as it
   * guarantees uniqueness without requiring the caller to generate the UUID manually.
   *
   * @returns A new `EntityId` instance with a generated UUID.
   */
  static generate(): EntityId {
    return new EntityId(randomUUID());
  }
}
