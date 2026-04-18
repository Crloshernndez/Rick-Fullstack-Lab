import { PaginatedCharactersResponseDTO } from "../dtos/paginated-characters-response.dto";

/**
 * Port defining the contract for fetching character data from an external source.
 *
 * This interface abstracts the communication with the external API (e.g., Rick and Morty API),
 * allowing the domain layer to remain decoupled from infrastructure concerns.
 * Implementations should handle GraphQL/REST API requests, error handling, and data
 * transformation to the appropriate DTO format.
 */
export interface SourceApiClientPort {
  /**
   * Fetches a page of characters from the external API.
   *
   * @param page - The page number to fetch (1-indexed).
   * @returns A promise resolving to a paginated response with character data and pagination info.
   * @throws {InfrastructureException} If the API request fails.
   */
  fetchCharactersPage(page: number): Promise<PaginatedCharactersResponseDTO>;
}
