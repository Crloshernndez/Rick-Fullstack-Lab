import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";
import { Name } from "../../../../shared/domain/value-objects/name";
import { Url } from "../../../../shared/domain/value-objects/url";

/**
 * Interface representing the structure of an Location object.
 */
export interface LocationData {
  name: string;
  url: string;
}

/**
 * Value Object representing a character's Location location.
 *
 * Composes the `Name` and `Url` value objects to ensure both the Location name
 * and URL are valid. This prevents invalid Location data from entering the domain.
 *
 * @extends ValueObject<LocationData>
 */
export class CharacterLocation extends ValueObject<LocationData> {
  private readonly name: Name;
  private readonly url: Url;

  /**
   * Creates a new Location value object.
   *
   * @param value - The Location data containing name and url.
   * @throws {ValidationException} If the Location data is invalid.
   */
  constructor(value: LocationData) {
    super(value);
    this.name = new Name(value.name);
    this.url = new Url(value.url);
  }

  /**
   * Validates that the Location data structure is correct.
   *
   * @param value - The Location data to validate.
   * @throws {ValidationException} If the value is not a valid object with name and url properties.
   */
  protected validate(value: LocationData): void {
    if (typeof value !== "object" || value === null) {
      throw new ValidationException("Location must be an object", { value });
    }

    if (!value.name || !value.url) {
      throw new ValidationException(
        "Location must contain both name and url properties",
        { value }
      );
    }
  }

  /**
   * Returns a plain object representation of the Location.
   *
   * Useful for serialization or persistence operations.
   *
   * @returns An object containing the name and url as primitive strings.
   */
  toObject(): LocationData {
    return {
      name: this.name.toValue(),
      url: this.url.toValue(),
    };
  }
}
