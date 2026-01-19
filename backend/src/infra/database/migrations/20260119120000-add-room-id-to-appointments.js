'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('appointments');
    
    if (tableExists) {
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM appointments LIKE 'room_id'`
      );
      
        if (columns.length === 0) {
          await queryInterface.addColumn('appointments', 'room_id', {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: 'rooms',
              key: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'RESTRICT',
            comment: 'ID da sala de agendamento',
          });

        const [indexesRoomId] = await queryInterface.sequelize.query(
          `SHOW INDEX FROM appointments WHERE Key_name = 'appointments_room_id_index'`
        );
        if (indexesRoomId.length === 0) {
          await queryInterface.addIndex('appointments', ['room_id'], {
            name: 'appointments_room_id_index',
          });
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('appointments');
    
    if (tableExists) {
      const [columns] = await queryInterface.sequelize.query(
        `SHOW COLUMNS FROM appointments LIKE 'room_id'`
      );
      
      if (columns.length > 0) {
        const [indexesRoomId] = await queryInterface.sequelize.query(
          `SHOW INDEX FROM appointments WHERE Key_name = 'appointments_room_id_index'`
        );
        if (indexesRoomId.length > 0) {
          await queryInterface.removeIndex('appointments', 'appointments_room_id_index');
        }
        
        await queryInterface.removeColumn('appointments', 'room_id');
      }
    }
  },
};

