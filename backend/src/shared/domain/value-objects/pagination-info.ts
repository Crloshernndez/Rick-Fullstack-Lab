import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";
import { Count } from "./count";

/**
 * Properties for pagination metadata.
 */
interface PaginationInfoProps {
  count: Count;
  pages: Count;
  next: number | null;
  prev: number | null;
}

/**
 * Value Object representing pagination metadata.
 *
 * Encapsulates information about paginated result sets, including total
 * item count, total pages, and navigation links to next/previous pages.
 * This ensures pagination data is always valid and provides convenient
 * methods for pagination logic.
 *
 * @extends ValueObject<PaginationInfoProps>
 */
export class PaginationInfo extends ValueObject<PaginationInfoProps> {
  /**
   * Validates that pagination properties are consistent and valid.
   *
   * @param props - The pagination properties to validate.
   * @throws {ValidationException} If next/prev page numbers are invalid.
   */
  protected validate(props: PaginationInfoProps): void {
    if (props.next !== null && props.next <= 0) {
      throw new ValidationException(
        "Next page must be a positive integer",
        { next: props.next }
      );
    }

    if (props.prev !== null && props.prev <= 0) {
      throw new ValidationException(
        "Previous page must be a positive integer",
        { prev: props.prev }
      );
    }
  }

  /**
   * Returns the total number of items across all pages.
   *
   * @returns The total item count.
   */
  get totalItems(): Count {
    return this._value.count;
  }

  /**
   * Returns the total number of pages.
   *
   * @returns The total page count.
   */
  get totalPages(): Count {
    return this._value.pages;
  }

  /**
   * Returns the next page number if available.
   *
   * @returns The next page number, or null if on the last page.
   */
  get next(): number | null {
    return this._value.next;
  }

  /**
   * Returns the previous page number if available.
   *
   * @returns The previous page number, or null if on the first page.
   */
  get prev(): number | null {
    return this._value.prev;
  }

  /**
   * Checks if there is a next page available.
   *
   * @returns `true` if a next page exists, otherwise `false`.
   */
  hasNextPage(): boolean {
    return this._value.next !== null;
  }

  /**
   * Checks if there is a previous page available.
   *
   * @returns `true` if a previous page exists, otherwise `false`.
   */
  hasPreviousPage(): boolean {
    return this._value.prev !== null;
  }

  /**
   * Checks if the current page is the last page.
   *
   * @returns `true` if on the last page, otherwise `false`.
   */
  isLastPage(): boolean {
    return !this.hasNextPage();
  }

  /**
   * Checks if the current page is the first page.
   *
   * @returns `true` if on the first page, otherwise `false`.
   */
  isFirstPage(): boolean {
    return !this.hasPreviousPage();
  }

  /**
   * Checks if there are any items in the result set.
   *
   * @returns `true` if total items is greater than zero, otherwise `false`.
   */
  hasItems(): boolean {
    return !this._value.count.isZero();
  }

  /**
   * Converts the pagination info to a plain object representation.
   *
   * @returns A plain object containing pagination metadata.
   */
  toObject(): Record<string, any> {
    return {
      count: this._value.count.toValue(),
      pages: this._value.pages.toValue(),
      next: this._value.next,
      prev: this._value.prev,
    };
  }
}
