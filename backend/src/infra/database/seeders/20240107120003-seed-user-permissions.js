'use strict';

/** @type {import('sequelize-cli').Seeder} */
module.exports = {
  async up(queryInterface, Sequelize) {
   
    const [users] = await queryInterface.sequelize.query(
      'SELECT id, role_id FROM users'
    );

   
    const [permissions] = await queryInterface.sequelize.query(
      "SELECT id, name FROM permissions WHERE name IN ('APPOINTMENTS', 'LOGS', 'ROOMS')"
    );

    if (users.length === 0 || permissions.length === 0) {
      console.log(
        'No users or permissions found. Skipping user_permissions seed.'
      );
      return;
    }

    const userPermissionsToInsert = [];

  
    users.forEach((user) => {
      permissions.forEach((permission) => {
       
        const granted = user.role_id === 1; // ADMIN

        userPermissionsToInsert.push({
          user_id: user.id,
          permission_id: permission.id,
          granted: granted,
          created_at: new Date(),
          updated_at: new Date(),
        });
      });
    });

    if (userPermissionsToInsert.length > 0) {
      
      const [existing] = await queryInterface.sequelize.query(
        'SELECT COUNT(*) as count FROM user_permissions'
      );

      if (existing[0].count === 0) {
        await queryInterface.bulkInsert(
          'user_permissions',
          userPermissionsToInsert,
          {}
        );
        console.log(
          `Inserted ${userPermissionsToInsert.length} user permission(s).`
        );
      } else {
        console.log(
          'User permissions already exist, skipping seed. Use update queries to modify.'
        );
      }
    }
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('user_permissions', {});
  },
};

