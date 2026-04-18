import { MarkCharactersAsDeprecatedUseCasePort } from "../../../shared/domain/ports/mark-characters-as-deprecated-use-case.port";
import { CharacterRepositoryPort } from "../domain/ports/character-repository.port";
import { ExternalId } from "../domain/value-objects/external-id";

/**
 * Use case for marking characters as deprecated when they no longer exist in external source.
 *
 * This use case handles the cleanup logic for the character-catalog context:
 * 1. Receives a list of currently valid external IDs from the data-sync context
 * 2. Queries the repository for all characters not in this list
 * 3. Marks those characters as deprecated using domain logic
 * 4. Returns the count of deprecated characters
 *
 * This ensures the catalog stays synchronized with the external API by identifying
 * and marking characters that have been removed from the source.
 */
export class MarkCharactersAsDeprecatedUseCase
  implements MarkCharactersAsDeprecatedUseCasePort
{
  constructor(private readonly characterRepository: CharacterRepositoryPort) {}

  /**
   * Executes the deprecation operation.
   *
   * Finds all characters whose external ID is not in the provided list
   * and marks them as deprecated through the domain entity method.
   *
   * @param currentExternalIds - Array of external IDs that currently exist in the source API.
   * @returns Object containing the count of characters marked as deprecated.
   * @throws {RepositoryException} If database operations fail.
   */
  async execute(currentExternalIds: number[]): Promise<{
    deprecatedCount: number;
  }> {
    const externalIds = currentExternalIds.map((id) => new ExternalId(id));

    const charactersToDeprecate =
      await this.characterRepository.findNotInExternalIds(externalIds);

    for (const character of charactersToDeprecate) {
      character.markAsDeprecated();
    }

    if (charactersToDeprecate.length > 0) {
      await this.characterRepository.bulkUpdate(charactersToDeprecate);
    }

    return {
      deprecatedCount: charactersToDeprecate.length,
    };
  }
}
