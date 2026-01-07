'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'role_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 2, // Default para USER (id 2)
      references: {
        model: 'roles',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'RESTRICT',
    });

    // Adiciona índice para melhor performance
    await queryInterface.addIndex('users', ['role_id'], {
      name: 'users_role_id_index',
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', 'users_role_id_index');
    await queryInterface.removeColumn('users', 'role_id');
  },
};

