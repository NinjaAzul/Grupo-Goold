'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('logs');
    
    if (!tableExists) {
      await queryInterface.createTable('logs', {
        id: {
          type: Sequelize.INTEGER,
          autoIncrement: true,
          primaryKey: true,
          allowNull: false,
        },
        user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id',
          },
          onUpdate: 'CASCADE',
          onDelete: 'SET NULL',
          comment: 'ID do usuário. NULL se for log do sistema',
        },
        activity_type: {
          type: Sequelize.STRING(100),
          allowNull: false,
          comment: 'Tipo de atividade: Login, Logout, Criação de agendamento, Cancelamento de agendamento, Atualização de e-mail, etc.',
        },
        module: {
          type: Sequelize.STRING(50),
          allowNull: false,
          comment: 'Módulo onde ocorreu a atividade: Agendamento, Minha Conta, etc.',
        },
        description: {
          type: Sequelize.TEXT,
          allowNull: true,
          comment: 'Descrição detalhada da atividade',
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
      });

      // Adiciona índices para melhor performance
      const [indexesUserId] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM logs WHERE Key_name = 'logs_user_id_index'`
      );
      if (indexesUserId.length === 0) {
        await queryInterface.addIndex('logs', ['user_id'], {
          name: 'logs_user_id_index',
        });
      }

      const [indexesActivityType] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM logs WHERE Key_name = 'logs_activity_type_index'`
      );
      if (indexesActivityType.length === 0) {
        await queryInterface.addIndex('logs', ['activity_type'], {
          name: 'logs_activity_type_index',
        });
      }

      const [indexesModule] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM logs WHERE Key_name = 'logs_module_index'`
      );
      if (indexesModule.length === 0) {
        await queryInterface.addIndex('logs', ['module'], {
          name: 'logs_module_index',
        });
      }

      const [indexesCreatedAt] = await queryInterface.sequelize.query(
        `SHOW INDEX FROM logs WHERE Key_name = 'logs_created_at_index'`
      );
      if (indexesCreatedAt.length === 0) {
        await queryInterface.addIndex('logs', ['created_at'], {
          name: 'logs_created_at_index',
        });
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('logs');
    
    if (tableExists) {
      await queryInterface.removeIndex('logs', 'logs_created_at_index');
      await queryInterface.removeIndex('logs', 'logs_module_index');
      await queryInterface.removeIndex('logs', 'logs_activity_type_index');
      await queryInterface.removeIndex('logs', 'logs_user_id_index');
      await queryInterface.dropTable('logs');
    }
  },
};
