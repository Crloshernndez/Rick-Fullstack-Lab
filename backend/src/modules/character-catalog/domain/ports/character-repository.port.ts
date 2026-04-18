import { EntityId } from "../../../../shared/domain/value-objects/entity-id";
import { Character } from "../../infrastructure/persistence/sequelize/models";

export interface CharacterRepositoryPort {
  create(character: Character): Promise<void>;

  update(character_id: EntityId, character: Character): Promise<void>;
}

export interface SyncedCharacterDto {
  externalId: number;
  name: string;
  status: string;
  species: string;
  // otros
}
