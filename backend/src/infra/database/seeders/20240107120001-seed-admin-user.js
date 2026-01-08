'use strict';

const bcrypt = require('bcrypt');


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const [existingAdmin] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE role_id = 1 LIMIT 1`
    );

    if (existingAdmin[0]) {
      console.log('Admin user already exists, skipping seed.');
      return;
    }

    
    const [roles] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1`
    );

    if (!roles[0]) {
      throw new Error('ADMIN role not found. Please run roles seed first.');
    }

   
    const defaultPassword = process.env.ADMIN_DEFAULT_PASSWORD || '12345678';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    await queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'Admin',
          last_name: 'Sistema',
          password: hashedPassword,
          role_id: 1, // ADMIN role
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    console.log('Admin user created successfully.');
    console.log(`Name: Admin Sistema`);
    console.log(`Password: ${defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('users', {
      role_id: 1, // Remove usuários com role ADMIN
      first_name: 'Admin',
      last_name: 'Sistema',
    });
  },
};

