'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('appointments');
    
    if (tableExists) {
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM appointments LIKE 'room'`
      );
      
      if (columns.length > 0) {
        await queryInterface.removeColumn('appointments', 'room');
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('appointments');
    
    if (tableExists) {
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM appointments LIKE 'room'`
      );
      
      if (columns.length === 0) {
        await queryInterface.addColumn('appointments', 'room', {
          type: Sequelize.STRING(50),
          allowNull: false,
          comment: 'Sala de agendamento',
        });
      }
    }
  },
};

