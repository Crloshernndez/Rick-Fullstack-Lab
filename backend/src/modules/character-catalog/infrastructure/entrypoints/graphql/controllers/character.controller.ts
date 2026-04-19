import { GetCharactersUseCase } from "../../../../application/get-characters.use-case";
import { CharacterFilters } from "../../../../application/dtos/character-filters.dto";
import {
  ValidationException,
  NotFoundException,
  RepositoryException,
} from "../../../../../../shared/exceptions/application-errors";

/**
 * Controller for character GraphQL operations.
 *
 * Acts as an adapter between the GraphQL resolvers and the application layer.
 * Handles error transformation and ensures proper error responses.
 */
export class CharacterController {
  constructor(private readonly getCharactersUseCase: GetCharactersUseCase) {}

  /**
   * Gets paginated characters with optional filters.
   *
   * @param page - Page number (optional, defaults to 1).
   * @param limit - Items per page (optional, defaults to 20).
   * @param filters - Optional filters for status, gender, species, name, origin.
   * @returns Paginated character data with info and results.
   * @throws {ValidationException} If pagination parameters are invalid.
   * @throws {RepositoryException} If database query fails.
   */
  async getPaginatedCharacters(
    page?: number,
    limit?: number,
    filters?: CharacterFilters
  ) {
    try {
      const result = await this.getCharactersUseCase.execute(
        page,
        limit,
        filters
      );

      return {
        info: result.info,
        results: result.characters,
      };
    } catch (error) {
      // Re-throw application errors as-is
      if (
        error instanceof ValidationException ||
        error instanceof NotFoundException ||
        error instanceof RepositoryException
      ) {
        throw error;
      }

      // Wrap unexpected errors
      throw new RepositoryException(
        "Failed to retrieve characters",
        error instanceof Error ? { originalError: error.message } : { error }
      );
    }
  }
}
