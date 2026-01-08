'use strict';

const bcrypt = require('bcrypt');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
 
    const [data] = await queryInterface.sequelize.query(
      `SELECT id FROM users WHERE email = 'admin@grupo-goold.com' LIMIT 1`
    );

    const [existingAdmin] = data;

    if (existingAdmin) {
      console.log('Admin user already exists, skipping seed.');
      return;
    }

   
    const [roles] = await queryInterface.sequelize.query( `SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1`
    );

    const [role] = roles;

    if (!role) {
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
          email: 'admin@example.com',
          password: hashedPassword,
          role_id: roles[0].id,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );

    console.log('Admin user created successfully.');
    console.log(`Name: Admin Sistema`);
    console.log(`Email: admin@example.com`);
    console.log(`Password: ${defaultPassword}`);
    console.log('⚠️  Please change the default password after first login!');
  },

  async down(queryInterface, Sequelize) {
    const [data] = await queryInterface.sequelize.query(
      `SELECT id FROM roles WHERE name = 'ADMIN' LIMIT 1`
    );

    const [role] = data;

    if (!role) {
      throw new Error('ADMIN role not found.');
    }

    await queryInterface.bulkDelete('users', {
      role_id: role.id,
      first_name: 'Admin',
      last_name: 'Sistema',
      email: 'admin@example.com',
    });
  },
};

