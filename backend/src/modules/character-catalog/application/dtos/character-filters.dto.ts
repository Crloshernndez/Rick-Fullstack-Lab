/**
 * Data Transfer Object representing filters for character queries.
 *
 * Used to pass filtering criteria from the presentation layer
 * (GraphQL resolvers, REST controllers) to the application layer (use cases).
 */
export interface CharacterFilters {
  status?: string;
  gender?: string;
  species?: string;
  name?: string;
  origin?: string;
}
