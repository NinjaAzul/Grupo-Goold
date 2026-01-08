'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingRoles] = await queryInterface.sequelize.query(
      `SELECT name FROM roles WHERE name IN ('ADMIN', 'USER')`
    );

    const existingRoleNames = existingRoles.map((r) => r.name);
    const rolesToInsert = [];

    if (!existingRoleNames.includes('ADMIN')) {
      rolesToInsert.push({
        name: 'ADMIN',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    if (!existingRoleNames.includes('USER')) {
      rolesToInsert.push({
        name: 'USER',
        created_at: new Date(),
        updated_at: new Date(),
      });
    }

    if (rolesToInsert.length > 0) {
      await queryInterface.bulkInsert('roles', rolesToInsert, {});
      console.log(`Inserted ${rolesToInsert.length} role(s).`);
    } else {
      console.log('Roles already exist, skipping seed.');
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('roles', {
      name: {
        [Sequelize.Op.in]: ['ADMIN', 'USER'],
      },
    });
  },
};

