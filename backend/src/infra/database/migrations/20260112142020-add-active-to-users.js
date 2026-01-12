'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    
    if (tableExists) {
     
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM users LIKE 'active'`
      );
      
      if (columns.length === 0) {
        await queryInterface.addColumn('users', 'active', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
          comment: 'Status do usuário (ativo/inativo)',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    
    if (tableExists) {
      await queryInterface.removeColumn('users', 'active');
    }
  },
};
