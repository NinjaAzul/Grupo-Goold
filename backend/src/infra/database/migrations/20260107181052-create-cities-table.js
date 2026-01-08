'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    
    const tableExists = await queryInterface.tableExists('cities');
    
    if (!tableExists) {
      await queryInterface.createTable('cities', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
        },
        state_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'states',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'RESTRICT',
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
    }

 
    const [indexes] = await queryInterface.sequelize.query(
      `SHOW INDEX FROM cities WHERE Key_name = 'cities_state_id_index'`
    );
    
    if (indexes.length === 0) {
      await queryInterface.addIndex('cities', ['state_id'], {
        name: 'cities_state_id_index',
      });
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('cities');
    
    if (tableExists) {
      const [indexes] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM cities WHERE Key_name = 'cities_state_id_index'`
      );
      
      if (indexes.length > 0) {
        await queryInterface.removeIndex('cities', 'cities_state_id_index');
      }
      
      await queryInterface.dropTable('cities');
    }
  },
};

