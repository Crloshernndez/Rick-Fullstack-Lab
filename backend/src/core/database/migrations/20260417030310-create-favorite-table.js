'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favorites', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
      },
      character_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'characters',
          key: 'id',
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
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

    // Add unique constraint to prevent duplicate favorites
    await queryInterface.addConstraint('favorites', {
      fields: ['user_id', 'character_id'],
      type: 'unique',
      name: 'favorites_user_character_unique',
    });

    // Add indexes for foreign keys
    await queryInterface.addIndex('favorites', ['user_id'], {
      name: 'favorites_user_id_idx',
    });

    await queryInterface.addIndex('favorites', ['character_id'], {
      name: 'favorites_character_id_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('favorites');
  },
};
