import { CharacterRepositoryPort } from "../domain/ports/character-repository.port";
import { CachePort } from "../../../shared/domain/ports/cache.port";
import { CharacterFilters } from "./dtos/character-filters.dto";

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
    private readonly characterRepository: CharacterRepositoryPort,
    private readonly cache: CachePort
  ) {}

  /**
   * Executes the get characters operation with pagination.
   *
   * @param page - Page number (defaults to 1).
   * @param limit - Items per page (defaults to 20).
   * @returns Object containing pagination info and characters array as plain objects.
   */
  async execute(
    page: number = this.DEFAULT_PAGE,
    limit: number = this.DEFAULT_LIMIT,
    filters: CharacterFilters = {}
  ): Promise<any> {
    // Validate and sanitize inputs
    const validPage = Math.max(1, page);
    const validLimit = Math.max(1, Math.min(100, limit)); // Max 100 items per page

    // Try to get from cache first
    const cacheKey = `${validPage}:${validLimit}:${JSON.stringify(filters)}`;
    const cached = await this.cache.get(cacheKey, "characters");

    if (cached) {
      console.log("✅ Cache hit - fetching from cache");
      return cached;
    }

    // If not in cache, fetch from repository
    console.log("📊 Cache miss - fetching from database");

    const result = await this.characterRepository.findAll(
      validPage,
      validLimit,
      filters
    );

    // Convert domain entities to plain objects for caching
    const plainResult = {
      info: result.info.toObject(),
      characters: result.characters.map((char) => char.toObject()),
    };

    // Cache the plain objects for 5 minutes
    await this.cache.set(cacheKey, plainResult, 300, "characters");

    return plainResult;
  }
}
