import { ValueObject } from "../../../../shared/domain/value-object";
import { ValidationException } from "../../../../shared/exceptions/application-errors";

/**
 * Value Object representing the content of a user comment.
 *
 * Enforces length constraints and ensures comments are not empty or composed
 * only of whitespace. This prevents meaningless or excessively long comments
 * from entering the domain.
 *
 * @extends ValueObject<string>
 */
export class CommentContent extends ValueObject<string> {
  private static readonly MIN_LENGTH = 1;
  private static readonly MAX_LENGTH = 1000;

  /**
   * Validates that the comment content meets the defined constraints.
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the content is empty, too short, or exceeds the maximum length.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Comment content must be a string", { value });
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new ValidationException("Comment cannot be empty or contain only whitespace", { value });
    }

    if (trimmed.length < CommentContent.MIN_LENGTH) {
      throw new ValidationException(
        `Comment must be at least ${CommentContent.MIN_LENGTH} character(s)`,
        { value, minLength: CommentContent.MIN_LENGTH }
      );
    }

    if (trimmed.length > CommentContent.MAX_LENGTH) {
      throw new ValidationException(
        `Comment exceeds maximum length of ${CommentContent.MAX_LENGTH} characters`,
        { value, maxLength: CommentContent.MAX_LENGTH }
      );
    }
  }

  /**
   * Returns the trimmed comment content.
   *
   * Ensures that leading and trailing whitespace is always removed
   * when accessing the value.
   *
   * @returns The trimmed comment string.
   */
  toValue(): string {
    return this._value.trim();
  }
}