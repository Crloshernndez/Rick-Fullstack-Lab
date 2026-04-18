import { SyncedCharacterDTO } from "../../../shared/domain/dtos/synced-character.dto";
import { BulkCreateOrUpdateCharactersUseCasePort } from "../../../shared/domain/ports/bulk-create-or-update-characters-use-case.port";
import { CharacterRepositoryPort } from "../domain/ports/character-repository.port";
import { Character } from "../domain/entities/character.entity";
import { ExternalId } from "../domain/value-objects/external-id";
import { Name } from "../../../shared/domain/value-objects/name";
import { CharacterStatus } from "../domain/value-objects/character-status";
import { CharacterSpecies } from "../domain/value-objects/character-species";
import { CharacterType } from "../domain/value-objects/character-type";
import { Gender } from "../domain/value-objects/gender";
import { ImageUrl } from "../../../shared/domain/value-objects/image-url";
import { CharacterOrigin } from "../domain/value-objects/character-origin";
import { CharacterLocation } from "../domain/value-objects/character-location";

/**
 * Use case for bulk creating or updating characters from external source.
 *
 * This use case handles the synchronization logic for the character-catalog context:
 * 1. Receives an array of synced character DTOs from data-sync context
 * 2. For each character, checks if it exists by external ID
 * 3. Creates new characters or updates existing ones
 * 4. Uses domain entities to ensure business rules are enforced
 * 5. Returns statistics on the operation
 *
 * This implementation optimizes for performance by processing characters in bulk
 * while maintaining domain integrity through proper entity usage.
 */
export class BulkCreateOrUpdateCharactersUseCase
  implements BulkCreateOrUpdateCharactersUseCasePort
{
  constructor(private readonly characterRepository: CharacterRepositoryPort) {}

  /**
   * Executes the bulk create or update operation.
   *
   * Processes each character individually to maintain domain logic while
   * delegating batch operations to the repository layer for performance.
   *
   * @param characters - Array of synced character DTOs from external source.
   * @returns Object containing counts of added and updated characters.
   * @throws {RepositoryException} If database operations fail.
   * @throws {ValidationException} If character data is invalid.
   */
  async execute(
    characters: SyncedCharacterDTO[]
  ): Promise<{ addedCount: number; updatedCount: number }> {
    const existingCharacters = await this.fetchExistingCharacters(characters);

    const { charactersToCreate, charactersToUpdate } = this.classifyCharacters(
      characters,
      existingCharacters
    );

    await this.persistChanges(charactersToCreate, charactersToUpdate);

    return {
      addedCount: charactersToCreate.length,
      updatedCount: charactersToUpdate.length,
    };
  }

  /**
   * Fetches from the repository only the characters that already exist,
   * based on their external IDs.
   *
   * @param characters Array of synced character DTOs from external source.
   * @return Array of Characters entities instances
   */
  private async fetchExistingCharacters(
    characters: SyncedCharacterDTO[]
  ): Promise<Character[]> {
    const externalIds = characters.map(
      (char) => new ExternalId(char.externalId)
    );
    return this.characterRepository.findByExternalIds(externalIds);
  }

  /**
   * Separates the incoming DTOs into two groups: those that need to be
   * created and those that need to be updated, based on the existing characters map.
   *
   * @param characters Array of synced character DTOs from external source.
   * @param existingCharacters  Array of Characters entities instances
   * @return Object containing Array of characters to create and Array of characters to update.
   */
  private classifyCharacters(
    characters: SyncedCharacterDTO[],
    existingCharacters: Character[]
  ): { charactersToCreate: Character[]; charactersToUpdate: Character[] } {
    const existingMap = new Map(
      existingCharacters.map((char) => [char.externalId.toValue(), char])
    );

    const charactersToCreate: Character[] = [];
    const charactersToUpdate: Character[] = [];

    for (const dto of characters) {
      const existingCharacter = existingMap.get(dto.externalId);

      if (existingCharacter) {
        this.updateExistingCharacter(existingCharacter, dto);
        charactersToUpdate.push(existingCharacter);
      } else {
        charactersToCreate.push(this.createNewCharacter(dto));
      }
    }

    return { charactersToCreate, charactersToUpdate };
  }

  /**
   * Persists the classified characters to the repository,
   * skipping each operation if its list is empty.
   *
   * @param charactersToCreate Array of characters to create
   * @param charactersToUpdate Array of characters to update
   */
  private async persistChanges(
    charactersToCreate: Character[],
    charactersToUpdate: Character[]
  ): Promise<void> {
    if (charactersToCreate.length > 0) {
      await this.characterRepository.bulkCreate(charactersToCreate);
    }

    if (charactersToUpdate.length > 0) {
      await this.characterRepository.bulkUpdate(charactersToUpdate);
    }
  }

  /**
   * Creates a new Character entity from a synced DTO.
   *
   * Maps primitive DTO data to domain value objects, ensuring all
   * business rules and validations are applied.
   *
   * @param dto - The synced character DTO from external source.
   * @returns A new Character entity instance.
   */
  private createNewCharacter(dto: SyncedCharacterDTO): Character {
    return Character.create({
      externalId: new ExternalId(dto.externalId),
      name: new Name(dto.name),
      ...(dto.status && { status: new CharacterStatus(dto.status) }),
      ...(dto.species && { species: new CharacterSpecies(dto.species) }),
      ...(dto.type && { type: new CharacterType(dto.type) }),
      ...(dto.gender && { gender: new Gender(dto.gender) }),
      ...(dto.image && { image: new ImageUrl(dto.image) }),
      ...(dto.origin && {
        origin: new CharacterOrigin({
          name: dto.origin.name,
          url: dto.origin.url,
        }),
      }),
      ...(dto.location && {
        location: new CharacterLocation({
          name: dto.location.name,
          url: dto.location.url,
        }),
      }),
    });
  }

  /**
   * Updates an existing Character entity with new data from external source.
   *
   * Delegates to the entity's domain method to ensure business logic
   * is properly applied (e.g., updating sync status, timestamp).
   *
   * @param character - The existing character entity to update.
   * @param dto - The synced character DTO with new data.
   */
  private updateExistingCharacter(
    character: Character,
    dto: SyncedCharacterDTO
  ): void {
    character.updateFromExternalSource({
      name: new Name(dto.name),
      ...(dto.status && { status: new CharacterStatus(dto.status) }),
      ...(dto.species && { species: new CharacterSpecies(dto.species) }),
      ...(dto.type && { type: new CharacterType(dto.type) }),
      ...(dto.gender && { gender: new Gender(dto.gender) }),
      ...(dto.image && { image: new ImageUrl(dto.image) }),
      ...(dto.origin && {
        origin: new CharacterOrigin({
          name: dto.origin.name,
          url: dto.origin.url,
        }),
      }),
      ...(dto.location && {
        location: new CharacterLocation({
          name: dto.location.name,
          url: dto.location.url,
        }),
      }),
    });
  }
}
