/**
 * Abstract base class for all Value Objects in the domain layer.
 *
 * A Value Object is a Domain-Driven Design (DDD) concept that represents
 * a descriptive aspect of the domain with no conceptual identity. Two Value
 * Objects are considered equal if all their attributes are equal, regardless
 * of reference.
 *
 * This class enforces immutability and guarantees that validation is always
 * executed before the value is stored, making invalid states unrepresentable.
 *
 * @template T - The type of the primitive or composite value being wrapped.
 */
export abstract class ValueObject<T = any> {
  /**
   * The immutable internal value held by this Value Object.
   * Marked as `readonly` to prevent mutation after construction.
   */
  protected readonly _value: T;

  /**
   * Creates a new Value Object instance.
   *
   * Validation is executed before assignment, ensuring the object
   * is always in a valid state after construction. If validation fails,
   * the object is never created.
   *
   * @param value - The value to wrap and validate.
   * @throws {ValidationException} If the value does not satisfy the validation rules
   * defined in the subclass.
   */
  constructor(value: T) {
    this.validate(value);
    this._value = value;
  }

  /**
   * Returns the wrapped value.
   *
   * Prefer `toValue()` for accessing the raw value programmatically,
   * and `toString()` for serialization or display purposes.
   */
  get value(): T {
    return this._value;
  }

  /**
   * Validates the given value against the rules defined by the subclass.
   *
   * Called automatically during construction — subclasses must implement
   * this method to define their own invariants. Should never be called directly.
   *
   * @param value - The value to validate.
   * @throws {ValidationException} If the value violates any validation rule.
   */
  protected abstract validate(value: T): void;

  /**
   * Returns a string representation of the wrapped value.
   *
   * Useful for logging, debugging, or any context where a primitive
   * string is required.
   *
   * @returns The string form of the internal value.
   */
  toString(): string {
    return String(this._value);
  }

  /**
   * Returns the raw unwrapped value.
   *
   * Useful when the primitive value is needed explicitly, such as
   * when persisting to a database or serializing to an external API.
   *
   * @returns The internal value of type `T`.
   */
  toValue(): T {
    return this._value;
  }
}
