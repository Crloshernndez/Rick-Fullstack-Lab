'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('characters', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      external_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        unique: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      species: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      gender: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      image: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      origin: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      location: {
        type: Sequelize.JSONB,
        allowNull: true,
      },
      sync_status: {
        type: Sequelize.ENUM('synced', 'deprecated'),
        allowNull: false,
        defaultValue: 'synced',
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
      last_imported_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('characters', ['external_id'], {
      unique: true,
      name: 'characters_external_id_unique_idx',
    });

    await queryInterface.addIndex('characters', ['sync_status'], {
      name: 'characters_sync_status_idx',
    });

    await queryInterface.addIndex('characters', ['is_active'], {
      name: 'characters_is_active_idx',
    });

    await queryInterface.addIndex('characters', ['name'], {
      name: 'characters_name_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('characters');
  },
};
