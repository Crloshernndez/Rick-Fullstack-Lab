import { ExternalCharacterDTO } from "./external-character.dto";

/**
 * Pagination information from the external API response.
 */
export interface PaginationInfoDTO {
  count: number;
  pages: number;
  next: number | null;
  prev: number | null;
}

/**
 * Data Transfer Object representing a paginated response from the external API.
 *
 * This DTO matches the structure of the GraphQL response from the Rick and Morty API,
 * containing both pagination metadata and character results.
 */
export interface PaginatedCharactersResponseDTO {
  info: PaginationInfoDTO;
  results: ExternalCharacterDTO[];
}