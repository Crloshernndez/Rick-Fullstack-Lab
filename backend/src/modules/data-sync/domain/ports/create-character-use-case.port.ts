import { EntityId } from "../../../../shared/domain/value-objects/entity-id";

export interface CreateCharacterUseCasePort {
  execute(data: [SyncedCharacterDTO]): Promise<void>;
}

export interface SyncedCharacterDto {
  externalId: number;
  name: string;
  status: string;
  species: string;
  // otros
}
