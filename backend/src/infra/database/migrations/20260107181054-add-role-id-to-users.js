'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableDescription = await queryInterface.describeTable('users');
    
    if (!tableDescription.role_id) {
      await queryInterface.addColumn('users', 'role_id', {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 2, // USER role
        references: {
          model: 'roles',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      });
    }


    const [indexes] = await queryInterface.sequelize.query(
      `SHOW INDEX FROM users WHERE Key_name = 'users_role_id_index'`
    );
    
    if (indexes.length === 0) {
      await queryInterface.addIndex('users', ['role_id'], {
        name: 'users_role_id_index',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    
    if (tableExists) {
      const tableDescription = await queryInterface.describeTable('users');
      
      if (tableDescription.role_id) {
        const [indexes] = await queryInterface.sequelize.query(
          `SHOW INDEX FROM users WHERE Key_name = 'users_role_id_index'`
        );
        
        if (indexes.length > 0) {
          await queryInterface.removeIndex('users', 'users_role_id_index');
        }
        
        await queryInterface.removeColumn('users', 'role_id');
      }
    }
  },
};
