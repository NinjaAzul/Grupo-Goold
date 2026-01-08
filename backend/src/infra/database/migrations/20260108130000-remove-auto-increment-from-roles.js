'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('roles');

    if (tableExists) {
      // Verificar se existe foreign key constraint
      const [foreignKeys] = await queryInterface.sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'users' 
         AND REFERENCED_TABLE_NAME = 'roles'
         AND CONSTRAINT_NAME LIKE '%role%'`
      );

      // Remover foreign key constraints temporariamente
      for (const fk of foreignKeys) {
        await queryInterface.sequelize.query(
          `ALTER TABLE users DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
      }

      // Verificar dados existentes
      const [existingRoles] = await queryInterface.sequelize.query(
        'SELECT * FROM roles ORDER BY id'
      );

      // Modificar a coluna id para remover auto increment
      await queryInterface.sequelize.query(
        'ALTER TABLE roles MODIFY COLUMN id INT NOT NULL'
      );

      // Ajustar IDs se necessário (ADMIN = 1, USER = 2)
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

      // Recriar foreign key constraints
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
      // Verificar foreign keys
      const [foreignKeys] = await queryInterface.sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = DATABASE() 
         AND TABLE_NAME = 'users' 
         AND REFERENCED_TABLE_NAME = 'roles'
         AND CONSTRAINT_NAME LIKE '%role%'`
      );

      // Remover foreign keys temporariamente
      for (const fk of foreignKeys) {
        await queryInterface.sequelize.query(
          `ALTER TABLE users DROP FOREIGN KEY ${fk.CONSTRAINT_NAME}`
        );
      }

      // Restaurar auto increment
      await queryInterface.sequelize.query(
        'ALTER TABLE roles MODIFY COLUMN id INT NOT NULL AUTO_INCREMENT'
      );

      // Recriar foreign keys
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
