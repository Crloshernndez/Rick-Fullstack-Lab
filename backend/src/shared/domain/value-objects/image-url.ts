import { ValueObject } from "../value-object";
import { ValidationException } from "../../exceptions/application-errors";

/**
 * Value Object representing a valid image URL.
 *
 * Ensures that the URL conforms to the standard URL format and optionally
 * validates common image file extensions. Prevents malformed or invalid
 * image URLs from being stored in the domain.
 *
 * @extends ValueObject<string>
 */
export class ImageUrl extends ValueObject<string> {
  private static readonly COMMON_IMAGE_EXTENSIONS = [
    ".jpg",
    ".jpeg",
    ".png",
    ".gif",
    ".webp",
    ".svg",
    ".bmp",
    ".ico",
  ];

  /**
   * Validates that the given value is a well-formed URL.
   *
   * Note: Does not enforce image file extensions as some image URLs
   * may not include extensions (e.g., CDN-served images with query parameters).
   *
   * @param value - The string value to validate.
   * @throws {ValidationException} If the value is not a valid URL format.
   */
  protected validate(value: string): void {
    if (typeof value !== "string") {
      throw new ValidationException("Image URL must be a string", { value });
    }

    const trimmed = value.trim();

    if (trimmed.length === 0) {
      throw new ValidationException("Image URL cannot be empty", { value });
    }

    try {
      new URL(trimmed);
    } catch (error) {
      throw new ValidationException("Invalid image URL format", {
        value,
        error: (error as Error).message,
      });
    }
  }

  /**
   * Returns the trimmed image URL value.
   *
   * @returns The URL string without leading or trailing whitespace.
   */
  toValue(): string {
    return this._value.trim();
  }

  /**
   * Checks if the URL has a common image file extension.
   *
   * Note: This does not guarantee the URL points to an image,
   * as some image URLs may not include file extensions.
   *
   * @returns `true` if the URL has a recognized image extension, otherwise `false`.
   */
  hasImageExtension(): boolean {
    const url = this._value.toLowerCase();
    return ImageUrl.COMMON_IMAGE_EXTENSIONS.some((ext) => url.includes(ext));
  }
}
