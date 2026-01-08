'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('appointments');
    
    if (!tableExists) {
      await queryInterface.createTable('appointments', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
        },
        appointment_date: {
          type: Sequelize.DATE,
          allowNull: false,
          comment: 'Data e hora do agendamento',
        },
        room: {
          type: Sequelize.STRING(50),
          allowNull: false,
          comment: 'Sala de agendamento',
        },
        status: {
          type: Sequelize.ENUM('pending', 'scheduled', 'cancelled'),
          allowNull: false,
          defaultValue: 'pending',
          comment: 'Status: pending (Em análise), scheduled (Agendado), cancelled (Cancelado)',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        },
      });

      const [indexesUserId] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM appointments WHERE Key_name = 'appointments_user_id_index'`
      );
      if (indexesUserId.length === 0) {
        await queryInterface.addIndex('appointments', ['user_id'], {
          name: 'appointments_user_id_index',
        });
      }

      const [indexesDate] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM appointments WHERE Key_name = 'appointments_date_index'`
      );
      if (indexesDate.length === 0) {
        await queryInterface.addIndex('appointments', ['appointment_date'], {
          name: 'appointments_date_index',
        });
      }

      const [indexesStatus] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM appointments WHERE Key_name = 'appointments_status_index'`
      );
      if (indexesStatus.length === 0) {
        await queryInterface.addIndex('appointments', ['status'], {
          name: 'appointments_status_index',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('appointments');
    
    if (tableExists) {
      await queryInterface.removeIndex('appointments', 'appointments_status_index');
      await queryInterface.removeIndex('appointments', 'appointments_date_index');
      await queryInterface.removeIndex('appointments', 'appointments_user_id_index');
      await queryInterface.dropTable('appointments');
    }
  },
};

