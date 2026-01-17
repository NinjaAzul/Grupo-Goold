'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('roles');

    if (tableExists) {
      const [foreignKeys] = await queryInterface.sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'users' 
         AND REFERENCED_TABLE_NAME = 'roles'
         AND CONSTRAINT_NAME LIKE '%role%'`
      );

      for (const fk of foreignKeys) {
        await queryInterface.sequelize.query(
          `ALTER TABLE users DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
      }

      const [existingRoles] = await queryInterface.sequelize.query(
        'SELECT * FROM roles ORDER BY id'
      );

      await queryInterface.sequelize.query(
        'ALTER TABLE roles MODIFY COLUMN id INT NOT NULL'
      );

      if (existingRoles.length > 0) {
        for (const role of existingRoles) {
          const expectedId = role.name === 'ADMIN' ? 1 : 2;
          if (role.id !== expectedId) {
            await queryInterface.sequelize.query(
              `UPDATE roles SET id = ${expectedId} WHERE id = ${role.id}`
            );
          }
        }
      }

      for (const fk of foreignKeys) {
        await queryInterface.addConstraint('users', {
          fields: ['role_id'],
          type: 'foreign key',
          name: fk.CONSTRAINT_NAME,
          references: {
            table: 'roles',
            field: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('roles');

    if (tableExists) {
      const [foreignKeys] = await queryInterface.sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'users' 
         AND REFERENCED_TABLE_NAME = 'roles'
         AND CONSTRAINT_NAME LIKE '%role%'`
      );

      for (const fk of foreignKeys) {
        await queryInterface.sequelize.query(
          `ALTER TABLE users DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
      }

      await queryInterface.sequelize.query(
        'ALTER TABLE roles MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT'
      );

      for (const fk of foreignKeys) {
        await queryInterface.addConstraint('users', {
          fields: ['role_id'],
          type: 'foreign key',
          name: fk.CONSTRAINT_NAME,
          references: {
            table: 'roles',
            field: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
        });
      }
    }
  },
};
