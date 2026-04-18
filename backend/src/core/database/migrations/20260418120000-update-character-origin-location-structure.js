'use strict';

/**
 * Migration to update origin and location structure in characters table.
 *
 * Changes the JSONB structure from:
 *   { name: string, url: string }
 * To:
 *   { name: string, id: number }
 *
 * Note: This migration will clear existing origin/location data since we cannot
 * reliably extract IDs from URLs. Data will be repopulated during the next sync.
 */

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Since we're changing the structure from {name, url} to {name, id}
    // and we cannot extract the ID from the URL reliably, we'll clear the data.
    // The data will be repopulated during the next synchronization.

    await queryInterface.sequelize.query(`
      UPDATE characters
      SET origin = NULL, location = NULL
      WHERE origin IS NOT NULL OR location IS NOT NULL;
    `);

    // Add a comment to document the new structure
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN characters.origin IS 'JSONB with structure: {name: string, id: number}';
    `);

    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN characters.location IS 'JSONB with structure: {name: string, id: number}';
    `);
  },

  async down(queryInterface, Sequelize) {
    // In rollback, just clear the data again
    // The old structure will be restored by re-running migrations from scratch
    await queryInterface.sequelize.query(`
      UPDATE characters
      SET origin = NULL, location = NULL
      WHERE origin IS NOT NULL OR location IS NOT NULL;
    `);

    // Remove comments
    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN characters.origin IS NULL;
    `);

    await queryInterface.sequelize.query(`
      COMMENT ON COLUMN characters.location IS NULL;
    `);
  },
};
