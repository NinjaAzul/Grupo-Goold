'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    
    if (tableExists) {
      const tableDescription = await queryInterface.describeTable('users');
      
      if (!tableDescription.email) {
        await queryInterface.addColumn('users', 'email', {
          type: Sequelize.STRING(255),
          allowNull: false,
          unique: true,
          after: 'last_name',
        });

        const [indexes] = await queryInterface.sequelize.query(
          `SHOW INDEX FROM users WHERE Key_name = 'users_email_index'`
        );
        
        if (indexes.length === 0) {
          await queryInterface.addIndex('users', ['email'], {
            name: 'users_email_index',
            unique: true,
          });
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    
    if (tableExists) {
      const tableDescription = await queryInterface.describeTable('users');
      
      if (tableDescription.email) {
        // Remove índice antes de remover a coluna
        const [indexes] = await queryInterface.sequelize.query(
          `SHOW INDEX FROM users WHERE Key_name = 'users_email_index'`
        );
        
        if (indexes.length > 0) {
          await queryInterface.removeIndex('users', 'users_email_index');
        }
        
        await queryInterface.removeColumn('users', 'email');
      }
    }
  },
};
