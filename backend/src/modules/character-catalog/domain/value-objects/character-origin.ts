import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";
import { Name } from "../../../../shared/domain/value-objects/name";
import { Url } from "../../../../shared/domain/value-objects/url";
import { ExternalId } from "./external-id";

/**
 * Interface representing the structure of an origin object.
 */
export interface OriginData {
  name: string;
  id: number | null;
}

/**
 * Value Object representing a character's origin location.
 *
 * Composes the `Name` and `Url` value objects to ensure both the origin name
 * and URL are valid. This prevents invalid origin data from entering the domain.
 *
 * @extends ValueObject<OriginData>
 */
export class CharacterOrigin extends ValueObject<OriginData> {
  private readonly name: Name;
  private readonly id: ExternalId | null;

  /**
   * Creates a new CharacterOrigin value object.
   *
   * @param value - The origin data containing name and url.
   * @throws {ValidationException} If the origin data is invalid.
   */
  constructor(value: OriginData) {
    super(value);
    this.name = new Name(value.name);
    this.id = value.id !== null ? new ExternalId(value.id) : null;
  }

  /**
   * Validates that the origin data structure is correct.
   *
   * @param value - The origin data to validate.
   * @throws {ValidationException} If the value is not a valid object with name and url properties.
   */
  protected validate(value: OriginData): void {
    if (typeof value !== "object" || value === null) {
      throw new ValidationException("Origin must be an object", { value });
    }

    if (!value.name || value.id === undefined) {
      throw new ValidationException(
        "Origin must contain both name and id properties",
        { value }
      );
    }
  }

  /**
   * Returns a plain object representation of the origin.
   *
   * Useful for serialization or persistence operations.
   *
   * @returns An object containing the name and url as primitive strings.
   */
  toObject(): OriginData {
    return {
      name: this.name.toValue(),
      id: this.id ? this.id.toValue() : null,
    };
  }
}
