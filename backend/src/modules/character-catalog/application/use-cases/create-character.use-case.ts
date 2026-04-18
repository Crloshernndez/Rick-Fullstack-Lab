import { Character } from "../../infrastructure/persistence/sequelize/models";

class CreateCharacterUseCase {
  constructor(private characterRepository: CharacterRepositoryPort) {}

  async execute(data: [CharacterDto]): Promise<void> {
    // instanciamos Chacacter

    this.characterRepository.create(Character);
  }
}
