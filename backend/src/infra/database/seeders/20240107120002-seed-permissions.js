'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingPermissions] = await queryInterface.sequelize.query(
      `SELECT name FROM permissions WHERE name IN ('APPOINTMENTS', 'LOGS', 'ROOMS')`
    );

    const existingPermissionNames = existingPermissions.map((p) => p.name);
    const permissionsToInsert = [];

    // Apenas 3 permissões
    const permissions = [
      { id: 1, name: 'APPOINTMENTS' },
      { id: 2, name: 'LOGS' },
      { id: 3, name: 'ROOMS' },
    ];

    permissions.forEach((permission) => {
      if (!existingPermissionNames.includes(permission.name)) {
        permissionsToInsert.push({
          id: permission.id,
          name: permission.name,
          created_at: new Date(),
          updated_at: new Date(),
        });
      }
    });

    if (permissionsToInsert.length > 0) {
      await queryInterface.bulkInsert('permissions', permissionsToInsert, {});
      console.log(`Inserted ${permissionsToInsert.length} permission(s).`);
    } else {
      console.log('Permissions already exist, skipping seed.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('permissions', {
      name: {
        [Sequelize.Op.in]: ['APPOINTMENTS', 'LOGS', 'ROOMS'],
      },
    });
  },
};

