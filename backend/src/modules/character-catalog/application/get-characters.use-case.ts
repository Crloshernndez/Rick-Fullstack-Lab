import { CharacterRepositoryPort } from "../domain/ports/character-repository.port";
import { Character } from "../domain/entities/character.entity";
import { PaginationInfo } from "../../../shared/domain/value-objects/pagination-info";
import { CachePort } from "../../../shared/domain/ports/cache.port";

/**
 * Use case for getting paginated characters.
 *
 * Retrieves characters with pagination support, providing both
 * the character data and pagination metadata.
 */
export class GetCharactersUseCase {
  private readonly DEFAULT_PAGE = 1;
  private readonly DEFAULT_LIMIT = 20;

  constructor(
    private readonly characterRepository: CharacterRepositoryPort
  ) // private readonly cache: CachePort
  {}

  /**
   * Executes the get characters operation with pagination.
   *
   * @param page - Page number (defaults to 1).
   * @param limit - Items per page (defaults to 20).
   * @returns Object containing pagination info and characters array.
   */
  async execute(
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT
  ): Promise<{
    info: PaginationInfo;
    characters: Character[];
  }> {
    // Validate and sanitize inputs
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // Max 100 items per page

    return await this.characterRepository.findAll(validPage, validLimit);
  }
}
