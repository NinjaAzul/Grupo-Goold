'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Renomear colunas para inglês
    await queryInterface.renameColumn('users', 'nome', 'first_name');
    await queryInterface.renameColumn('users', 'sobrenome', 'last_name');
    await queryInterface.renameColumn('users', 'cep', 'zip_code');
    await queryInterface.renameColumn('users', 'logradouro', 'street');
    await queryInterface.renameColumn('users', 'numero', 'number');
    await queryInterface.renameColumn('users', 'complemento', 'complement');
    await queryInterface.renameColumn('users', 'bairro', 'neighborhood');
    await queryInterface.renameColumn('users', 'cidade', 'city');
    await queryInterface.renameColumn('users', 'estado', 'state');
  },

  async down(queryInterface, Sequelize) {
    // Reverter para português
    await queryInterface.renameColumn('users', 'first_name', 'nome');
    await queryInterface.renameColumn('users', 'last_name', 'sobrenome');
    await queryInterface.renameColumn('users', 'zip_code', 'cep');
    await queryInterface.renameColumn('users', 'street', 'logradouro');
    await queryInterface.renameColumn('users', 'number', 'numero');
    await queryInterface.renameColumn('users', 'complement', 'complemento');
    await queryInterface.renameColumn('users', 'neighborhood', 'bairro');
    await queryInterface.renameColumn('users', 'city', 'cidade');
    await queryInterface.renameColumn('users', 'state', 'estado');
  },
};

