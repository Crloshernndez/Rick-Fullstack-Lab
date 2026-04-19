import { CharacterRepositoryPort } from "../domain/ports/character-repository.port";
import { CachePort } from "../../../shared/domain/ports/cache.port";
import { EntityId } from "../../../shared/domain/value-objects/entity-id";
import {
  NotFoundException,
  ValidationException,
} from "../../../shared/exceptions/application-errors";

/**
 * Use case for toggling the favorite status of a character.
 *
 * Follows the Single Responsibility Principle by handling only
 * the favorite toggle business logic.
 */
export class ToggleFavoriteCharacterUseCase {
  constructor(
    private readonly characterRepository: CharacterRepositoryPort,
    private readonly cache: CachePort
  ) {}

  /**
   * Toggles the favorite status of a character.
   *
   * @param id - UUID of the character to update
   * @param isFavorite - New favorite status
   * @returns The updated character
   * @throws {ValidationException} If the ID is invalid
   * @throws {NotFoundException} If the character doesn't exist
   */
  async execute(id: string, isFavorite: boolean) {
    // Validate ID format (UUID)
    const entityId = new EntityId(id);

    // Validate isFavorite is boolean
    if (typeof isFavorite !== "boolean") {
      throw new ValidationException("isFavorite must be a boolean value");
    }

    // Find character by ID
    const character = await this.characterRepository.findById(entityId);

    if (!character) {
      throw new NotFoundException(`Character with ID ${id} not found`);
    }

    // Update favorite status
    character.setFavorite(isFavorite);

    // Save and return updated character
    const updatedCharacter = await this.characterRepository.update(character);

    await this.cache.flushNamespace("characters");
    return updatedCharacter;
  }
}