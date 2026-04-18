import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Valid status values for a character in the Rick and Morty universe.
 */
export enum CharacterStatusEnum {
  ALIVE = "Alive",
  DEAD = "Dead",
  UNKNOWN = "unknown",
}

/**
 * Value Object representing the vital status of a character.
 *
 * Ensures that only valid status values (Alive, Dead, unknown) are used
 * within the character catalog domain, preventing arbitrary strings from
 * being assigned as character status.
 *
 * @extends ValueObject<string>
 */
export class CharacterStatus extends ValueObject<string> {
  /**
   * Validates that the given status is one of the allowed values.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a valid character status.
   */
  protected validate(value: string): void {
    const validStatuses = Object.values(CharacterStatusEnum);

    if (!validStatuses.includes(value as CharacterStatusEnum)) {
      throw new ValidationException(
        `Invalid character status. Must be one of: ${validStatuses.join(", ")}`,
        { value, allowedValues: validStatuses }
      );
    }
  }

  /**
   * Checks if the character is alive.
   *
   * @returns `true` if status is "Alive", otherwise `false`.
   */
  isAlive(): boolean {
    return this._value === CharacterStatusEnum.ALIVE;
  }

  /**
   * Checks if the character is dead.
   *
   * @returns `true` if status is "Dead", otherwise `false`.
   */
  isDead(): boolean {
    return this._value === CharacterStatusEnum.DEAD;
  }

  /**
   * Checks if the character's status is unknown.
   *
   * @returns `true` if status is "unknown", otherwise `false`.
   */
  isUnknown(): boolean {
    return this._value === CharacterStatusEnum.UNKNOWN;
  }
}
