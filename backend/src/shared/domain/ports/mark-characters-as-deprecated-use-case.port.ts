/**
 * Port interface for marking characters as deprecated.
 *
 * This port defines the contract for a use case that marks characters as deprecated
 * when they no longer exist in the external data source. It compares the provided
 * list of current external IDs with the database and marks missing ones as deprecated.
 *
 * Shared port that can be used by multiple bounded contexts to maintain
 * loose coupling while enabling cross-context communication.
 */
export interface MarkCharactersAsDeprecatedUseCasePort {
  /**
   * Marks characters as deprecated if their external ID is not in the current list.
   *
   * @param currentExternalIds - Array of external IDs that currently exist in the source.
   * @returns Object containing the count of characters marked as deprecated.
   */
  execute(currentExternalIds: number[]): Promise<{
    deprecatedCount: number;
  }>;
}
