import { CachePort } from "../../../shared/domain/ports/cache.port";
import { EntityId } from "../../../shared/domain/value-objects/entity-id";
import { NotFoundException } from "../../../shared/exceptions/application-errors";
import { CharacterRepositoryPort } from "../domain/ports/character-repository.port";

/**
 * Use case for deleting a character by ID.
 *
 * Performs a soft delete by marking the character as inactive
 * rather than removing it from the database permanently.
 */
export class DeleteCharacterUseCase {
  constructor(
    private readonly characterRepository: CharacterRepositoryPort,
    private readonly cache: CachePort
  ) {}

  /**
   * Executes the delete character operation.
   *
   * Performs a soft delete and clears the entire character cache
   * to ensure consistency across all paginated queries.
   *
   * @param id - The UUID of the character to delete.
   * @throws {NotFoundException} If no character exists with the given ID.
   */
  async execute(id: string): Promise<void> {
    const entityId = new EntityId(id);

    const character = await this.characterRepository.findById(entityId);

    if (!character) {
      throw new NotFoundException(`Character with id ${id} not found`, id);
    }

    character.deactivate();
    await this.characterRepository.update(character);

    // Clear all character cache entries
    const deletedCount = await this.cache.flushNamespace("characters");
    console.log(`🗑️  Cleared ${deletedCount} cache entries after deletion`);
  }
}
