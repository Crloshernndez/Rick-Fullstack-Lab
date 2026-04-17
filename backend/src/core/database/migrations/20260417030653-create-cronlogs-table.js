'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('cron_logs', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      execution_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      added_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      updated_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      deprecated_count: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        type: Sequelize.ENUM('success', 'failed'),
        allowNull: false,
      },
      error_payload: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      duration_ms: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    });

    // Add indexes
    await queryInterface.addIndex('cron_logs', ['execution_date'], {
      name: 'cron_logs_execution_date_idx',
    });

    await queryInterface.addIndex('cron_logs', ['status'], {
      name: 'cron_logs_status_idx',
    });

    await queryInterface.addIndex('cron_logs', ['createdAt'], {
      name: 'cron_logs_created_at_idx',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('cron_logs');
  },
};
