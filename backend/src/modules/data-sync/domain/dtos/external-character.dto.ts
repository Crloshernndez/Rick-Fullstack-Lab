/**
 * Data Transfer Object representing character data from the external API.
 *
 * This DTO is used as a contract between the external data source (Rick and Morty API)
 * and the data-sync bounded context. It contains only primitive types to avoid
 * coupling with domain entities.
 */
export interface ExternalCharacterDTO {
  id: string | number;
  name: string;
  status: string;
  species: string;
  type: string;
  gender: string;
  origin: {
    name: string;
    id: string | number | null;
  };
  location: {
    name: string;
    id: string | number | null;
  };
  image: string;
  episode: string[];
  url: string;
  created: string;
}
