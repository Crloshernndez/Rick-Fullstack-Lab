// src/modules/character-catalog/infrastructure/persistence/sequelize/translators/character-specification.translator.ts

import { Op, WhereOptions } from "sequelize";
import { CharacterFilters } from "../../../../application/dtos/character-filters.dto";

/**
 * Translates character filters into Sequelize WHERE clauses.
 *
 * Keeps the repository clean by centralizing the mapping between
 * domain filter values and their corresponding database conditions.
 *
 * @example
 * const translator = new CharacterSpecificationTranslator();
 * const where = translator.translate({ status: 'Alive', gender: 'Female' });
 * // { status: 'Alive', gender: 'Female', isActive: true }
 */
export class CharacterSpecificationTranslator {
  /**
   * Translates the given filters into a Sequelize WHERE object.
   *
   * Only includes conditions for filters that are present.
   * Always appends `isActive: true` to exclude deprecated characters.
   *
   * @param filters - The domain filters to translate.
   * @returns A Sequelize-compatible WHERE clause object.
   */
  translate(filters: CharacterFilters): WhereOptions {
    const where: WhereOptions = {
      isActive: true,
    };

    if (filters.status) {
      where["status"] = { [Op.iLike]: filters.status };
    }

    if (filters.gender) {
      where["gender"] = { [Op.iLike]: filters.gender };
    }

    if (filters.species) {
      where["species"] = { [Op.iLike]: filters.species };
    }

    if (filters.name) {
      where["name"] = { [Op.iLike]: `%${filters.name}%` };
    }

    if (filters.origin) {
      // JSON field search - matches origin.name
      where["origin"] = {
        [Op.contains]: { name: filters.origin },
      };
    }

    return where;
  }
}
