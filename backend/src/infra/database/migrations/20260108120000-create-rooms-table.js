'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('rooms');

    if (!tableExists) {
      await queryInterface.createTable('rooms', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          comment: 'Nome da sala',
        },
        start_time: {
          type: Sequelize.STRING(5),
          allowNull: false,
          comment: 'Horário inicial (formato HH:mm, ex: 08:00)',
        },
        end_time: {
          type: Sequelize.STRING(5),
          allowNull: false,
          comment: 'Horário final (formato HH:mm, ex: 18:00)',
        },
        time_block: {
          type: Sequelize.INTEGER,
          allowNull: false,
          comment: 'Bloco de horários em minutos (ex: 30, 60)',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal(
            'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
          ),
        },
      });

      const [indexesName] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM rooms WHERE Key_name = 'rooms_name_index'`
      );
      if (indexesName.length === 0) {
        await queryInterface.addIndex('rooms', ['name'], {
          name: 'rooms_name_index',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('rooms');

    if (tableExists) {
      const [indexesName] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM rooms WHERE Key_name = 'rooms_name_index'`
      );
      if (indexesName.length > 0) {
        await queryInterface.removeIndex('rooms', 'rooms_name_index');
      }

      await queryInterface.dropTable('rooms');
    }
  },
};

