import { SourceApiClientPort } from "../../domain/ports/source-api-client-port";
import { PaginatedCharactersResponseDTO } from "../../domain/dtos/paginated-characters-response.dto";
import { InfrastructureException } from "../../../../shared/exceptions/application-errors";
import { Url } from "../../../../shared/domain/value-objects/url";

/**
 * GraphQL response structure from Rick and Morty API.
 */
interface GraphQLResponse {
  data?: {
    characters: PaginatedCharactersResponseDTO;
  };
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
  }>;
}

/**
 * Infrastructure adapter for fetching character data from Rick and Morty GraphQL API.
 *
 * This adapter implements the SourceApiClientPort interface, providing a concrete
 * implementation that communicates with the external Rick and Morty GraphQL API.
 * It handles HTTP requests, error handling, and response transformation.
 */
export class RickAndMortyGraphqlClient implements SourceApiClientPort {
  private readonly apiUrl: Url;
  private readonly timeout = 10000;

  /**
   * Creates a new Rick and Morty GraphQL client.
   *
   * @throws {InfrastructureException} If RICK_AND_MORTY_API_URL environment variable is not set.
   * @throws {ValidationException} If the provided URL is invalid.
   */
  constructor() {
    const apiUrlEnv = process.env.RICK_AND_MORTY_API_URL;

    if (!apiUrlEnv) {
      throw new InfrastructureException(
        "RICK_AND_MORTY_API_URL environment variable is not configured",
        { requiredEnvVar: "RICK_AND_MORTY_API_URL" }
      );
    }

    // Validate URL using Url value object
    this.apiUrl = new Url(apiUrlEnv);
  }

  /**
   * GraphQL query for fetching paginated characters.
   */
  private readonly CHARACTERS_QUERY = `
    query GetCharacters($page: Int) {
      characters(page: $page) {
        info {
          count
          pages
          next
          prev
        }
        results {
          id
          name
          status
          species
          type
          gender
          origin {
            name
            id
          }
          location {
            name
            id
          }
          image
          created
        }
      }
    }
  `;

  /**
   * Fetches a page of characters from the Rick and Morty GraphQL API.
   *
   * @param page - The page number to fetch (1-indexed).
   * @returns A promise resolving to paginated character data.
   * @throws {InfrastructureException} If the API request fails or returns errors.
   */
  async fetchCharactersPage(
    page: number
  ): Promise<PaginatedCharactersResponseDTO> {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.timeout);

      const response = await fetch(this.apiUrl.toValue(), {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          query: this.CHARACTERS_QUERY,
          variables: { page },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new InfrastructureException(
          `Rick and Morty API request failed with status ${response.status}`,
          {
            status: response.status,
            statusText: response.statusText,
            page,
          }
        );
      }

      const result: GraphQLResponse = await response.json();

      // Check for GraphQL errors
      if (result.errors && result.errors.length > 0) {
        throw new InfrastructureException(
          `Rick and Morty API returned GraphQL errors: ${result.errors
            .map((e) => e.message)
            .join(", ")}`,
          {
            errors: result.errors,
            page,
          }
        );
      }

      // Validate response structure
      if (!result.data || !result.data.characters) {
        throw new InfrastructureException(
          "Rick and Morty API returned invalid response structure",
          {
            response: result,
            page,
          }
        );
      }

      return result.data.characters;
    } catch (error) {
      // Handle timeout
      if (error instanceof Error && error.name === "AbortError") {
        throw new InfrastructureException(
          `Rick and Morty API request timed out after ${this.timeout}ms`,
          { page, timeout: this.timeout }
        );
      }

      // Re-throw InfrastructureException as-is
      if (error instanceof InfrastructureException) {
        throw error;
      }

      // Handle network errors and other unexpected errors
      throw new InfrastructureException(
        `Unexpected error while fetching characters from Rick and Morty API: ${
          error instanceof Error ? error.message : String(error)
        }`,
        {
          page,
          originalError: error instanceof Error ? error.message : String(error),
        }
      );
    }
  }
}
