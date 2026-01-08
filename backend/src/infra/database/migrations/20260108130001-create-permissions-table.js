'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('permissions');

    if (!tableExists) {
      await queryInterface.createTable('permissions', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          allowNull: false,
        },
        name: {
          type: Sequelize.STRING(100),
          allowNull: false,
          unique: true,
          comment: 'Nome da permissão (ex: users.create, users.update, etc.)',
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
        `SHOW INDEX FROM permissions WHERE Key_name = 'permissions_name_index'`
      );
      if (indexesName.length === 0) {
        await queryInterface.addIndex('permissions', ['name'], {
          name: 'permissions_name_index',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('permissions');

    if (tableExists) {
      const [indexesName] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM permissions WHERE Key_name = 'permissions_name_index'`
      );
      if (indexesName.length > 0) {
        await queryInterface.removeIndex('permissions', 'permissions_name_index');
      }

      await queryInterface.dropTable('permissions');
    }
  },
};

