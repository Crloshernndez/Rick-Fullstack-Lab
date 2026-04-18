/**
 * Data Transfer Object for sending character data to the character-catalog bounded context.
 *
 * This DTO acts as a contract between the data-sync and character-catalog contexts,
 * containing only the necessary data to create or update a character in the catalog.
 * Uses primitive types to avoid coupling between bounded contexts.
 */
export interface SyncedCharacterDTO {
  externalId: number;
  name: string;
  status?: string;
  species?: string;
  type?: string;
  gender?: string;
  image?: string;
  origin?: {
    name: string;
    url: string;
  };
  location?: {
    name: string;
    url: string;
  };
}
