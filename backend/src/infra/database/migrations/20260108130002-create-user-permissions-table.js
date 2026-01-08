'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('user_permissions');

    if (!tableExists) {
      await queryInterface.createTable('user_permissions', {
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
          comment: 'ID do usuário',
        },
        permission_id: {
          type: Sequelize.INTEGER,
          allowNull: false,
          references: {
            model: 'permissions',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'CASCADE',
          comment: 'ID da permissão',
        },
        granted: {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: false,
          comment: 'Se a permissão está concedida (true) ou negada (false)',
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

      // Índice único para evitar duplicatas
      const [indexesUnique] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM user_permissions WHERE Key_name = 'user_permissions_user_id_permission_id_unique'`
      );
      if (indexesUnique.length === 0) {
        await queryInterface.addIndex(
          'user_permissions',
          ['user_id', 'permission_id'],
          {
            unique: true,
            name: 'user_permissions_user_id_permission_id_unique',
          }
        );
      }

      // Índices para melhor performance
      const [indexesUserId] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM user_permissions WHERE Key_name = 'user_permissions_user_id_index'`
      );
      if (indexesUserId.length === 0) {
        await queryInterface.addIndex('user_permissions', ['user_id'], {
          name: 'user_permissions_user_id_index',
        });
      }

      const [indexesPermissionId] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM user_permissions WHERE Key_name = 'user_permissions_permission_id_index'`
      );
      if (indexesPermissionId.length === 0) {
        await queryInterface.addIndex('user_permissions', ['permission_id'], {
          name: 'user_permissions_permission_id_index',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('user_permissions');

    if (tableExists) {
      const [indexesUnique] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM user_permissions WHERE Key_name = 'user_permissions_user_id_permission_id_unique'`
      );
      if (indexesUnique.length > 0) {
        await queryInterface.removeIndex(
          'user_permissions',
          'user_permissions_user_id_permission_id_unique'
        );
      }

      const [indexesUserId] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM user_permissions WHERE Key_name = 'user_permissions_user_id_index'`
      );
      if (indexesUserId.length > 0) {
        await queryInterface.removeIndex(
          'user_permissions',
          'user_permissions_user_id_index'
        );
      }

      const [indexesPermissionId] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM user_permissions WHERE Key_name = 'user_permissions_permission_id_index'`
      );
      if (indexesPermissionId.length > 0) {
        await queryInterface.removeIndex(
          'user_permissions',
          'user_permissions_permission_id_index'
        );
      }

      await queryInterface.dropTable('user_permissions');
    }
  },
};

