"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
      DO $$ BEGIN
        CREATE TYPE "enum_cron_logs_sync_type" AS ENUM('initial', 'scheduled', 'manual');
      EXCEPTION
        WHEN duplicate_object THEN null;
      END $$;
    `);

    await queryInterface.addColumn("cron_logs", "sync_type", {
      type: '"enum_cron_logs_sync_type"',
      allowNull: false,
      defaultValue: "scheduled",
      comment:
        "Type of synchronization: initial (first run), scheduled (cron job), or manual (user-triggered)",
    });

    // Create index for faster queries on sync_type
    await queryInterface.addIndex("cron_logs", ["sync_type"], {
      name: "idx_cron_logs_sync_type",
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex("cron_logs", "idx_cron_logs_sync_type");
    await queryInterface.removeColumn("cron_logs", "sync_type");
    await queryInterface.sequelize.query(
      'DROP TYPE IF EXISTS "enum_cron_logs_sync_type";'
    );
  },
};
