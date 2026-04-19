import { ValueObject } from "../../../shared/domain/value-object";
import { ValidationException } from "../../../shared/exceptions/application-errors";

/**
 * Valid sorting directions for character queries.
 */
export enum SortOrderEnum {
  ASC = "ASC",
  DESC = "DESC",
}

/**
 * Value Object representing the sort order for character queries.
 *
 * Ensures that only valid sorting directions (ASC, DESC) are used
 * within the character catalog domain, preventing arbitrary strings
 * from being passed as sort order values.
 *
 * @extends ValueObject<string>
 * const sorting = new SortOrder("INVALID"); // throws ValidationException
 */
export class SortOrder extends ValueObject<string> {
  /**
   * Validates that the given value is one of the allowed sort directions.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a valid sort direction.
   */
  protected validate(value: string): void {
    const validOrders = Object.values(SortOrderEnum);

    if (!validOrders.includes(value as SortOrderEnum)) {
      throw new ValidationException(
        `Invalid sort order. Must be one of: ${validOrders.join(", ")}`,
        { value, allowedValues: validOrders }
      );
    }
  }

  /**
   * Checks if the sort order is ascending.
   *
   * @returns `true` if sort order is "ASC", otherwise `false`.
   */
  isAscending(): boolean {
    return this._value === SortOrderEnum.ASC;
  }

  /**
   * Checks if the sort order is descending.
   *
   * @returns `true` if sort order is "DESC", otherwise `false`.
   */
  isDescending(): boolean {
    return this._value === SortOrderEnum.DESC;
  }

  /**
   * Factory method that creates a default ascending sort order.
   *
   * @returns A new `SortOrder` instance with value "ASC".
   */
  static defaultAscending(): SortOrder {
    return new SortOrder(SortOrderEnum.ASC);
  }

  /**
   * Factory method that creates a descending sort order.
   *
   * @returns A new `SortOrder` instance with value "DESC".
   */
  static descending(): SortOrder {
    return new SortOrder(SortOrderEnum.DESC);
  }
}
