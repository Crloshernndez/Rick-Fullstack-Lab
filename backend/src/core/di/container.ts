/**
 * Dependency Injection Container.
 *
 * Centralizes the instantiation and wiring of all application dependencies.
 * Follows the Dependency Inversion Principle, ensuring that high-level modules
 * don't depend on low-level modules, but both depend on abstractions.
 *
 * This container provides:
 * - Cache
 * - Repositories
 * - Use Cases
 * - Services
 * - Adapters
 * - External clients
 */

// Cache
import RedisCache from "../cache/redis-client";

// Repositories
import { CharacterRepository } from "../../modules/character-catalog/infrastructure/persistence/sequelize/repositories/character.repository";
import { CronLogRepository } from "../../modules/data-sync/infrastructure/persistence/sequelize/repositories/cron-log.repository";

// Use Cases - Character Catalog
import { BulkCreateOrUpdateCharactersUseCase } from "../../modules/character-catalog/application/bulk-create-or-update-characters.use-case";
import { MarkCharactersAsDeprecatedUseCase } from "../../modules/character-catalog/application/mark-characters-as-deprecated.use-case";
import { GetCharactersUseCase } from "../../modules/character-catalog/application/get-characters.use-case";

// Use Cases - Data Sync
import { SyncCharactersUseCase } from "../../modules/data-sync/application/sync-characters.use-case";

// Services
import { SyncLoggerService } from "../../modules/data-sync/domain/services/sync-logger.service";
import { InitialSyncGuardService } from "../../modules/data-sync/domain/services/initial-sync-guard.service";

// Adapters
import { CharacterCatalogAdapter } from "../../modules/data-sync/infrastructure/adapters/character-catalog.adapter";
import { RickAndMortyGraphqlClient } from "../../modules/data-sync/infrastructure/adapters/rick-and-morty-graphql.client";

// Controllers
import { CharacterController } from "../../modules/character-catalog/infrastructure/entrypoints/graphql/controllers/character.controller";

/**
 * Application container holding all initialized dependencies.
 */
export class Container {
  // Cache
  public readonly cache: RedisCache;

  // Repositories
  public readonly characterRepository: CharacterRepository;
  public readonly cronLogRepository: CronLogRepository;

  // Use Cases - Character Catalog
  public readonly bulkCreateOrUpdateCharactersUseCase: BulkCreateOrUpdateCharactersUseCase;
  public readonly markCharactersAsDeprecatedUseCase: MarkCharactersAsDeprecatedUseCase;
  public readonly getCharactersUseCase: GetCharactersUseCase;

  // Use Cases - Data Sync
  public readonly syncCharactersUseCase: SyncCharactersUseCase;

  // Services
  public readonly syncLoggerService: SyncLoggerService;
  public readonly initialSyncGuardService: InitialSyncGuardService;

  // Adapters
  public readonly characterCatalogAdapter: CharacterCatalogAdapter;
  public readonly rickAndMortyApiClient: RickAndMortyGraphqlClient;

  // Controllers
  public readonly characterController: CharacterController;

  constructor() {
    // Initialize Cache
    this.cache = RedisCache.getInstance();

    // Initialize Repositories
    this.characterRepository = new CharacterRepository();
    this.cronLogRepository = new CronLogRepository();

    // Initialize Character Catalog Use Cases
    this.bulkCreateOrUpdateCharactersUseCase =
      new BulkCreateOrUpdateCharactersUseCase(this.characterRepository);

    this.markCharactersAsDeprecatedUseCase =
      new MarkCharactersAsDeprecatedUseCase(this.characterRepository);

    this.getCharactersUseCase = new GetCharactersUseCase(
      this.characterRepository,
      this.cache
    );

    // Initialize Data Sync Services
    this.syncLoggerService = new SyncLoggerService(this.cronLogRepository);
    this.initialSyncGuardService = new InitialSyncGuardService(
      this.cronLogRepository
    );

    // Initialize Adapters
    this.characterCatalogAdapter = new CharacterCatalogAdapter(
      this.bulkCreateOrUpdateCharactersUseCase,
      this.markCharactersAsDeprecatedUseCase
    );

    // Initialize External API Client
    this.rickAndMortyApiClient = new RickAndMortyGraphqlClient();

    // Initialize Data Sync Use Cases
    this.syncCharactersUseCase = new SyncCharactersUseCase(
      this.rickAndMortyApiClient,
      this.characterCatalogAdapter,
      this.syncLoggerService
    );

    // Initialize Controllers
    this.characterController = new CharacterController(
      this.getCharactersUseCase
    );
  }
}

/**
 * Singleton instance of the container.
 * Initialized lazily on first access.
 */
let containerInstance: Container | null = null;

/**
 * Gets the singleton container instance.
 *
 * Creates the container on first call and reuses it on subsequent calls.
 *
 * @returns The application container with all dependencies.
 */
export function getContainer(): Container {
  if (!containerInstance) {
    containerInstance = new Container();
  }
  return containerInstance;
}

/**
 * Resets the container instance.
 *
 * Useful for testing or when needing to reinitialize dependencies.
 */
export function resetContainer(): void {
  containerInstance = null;
}
