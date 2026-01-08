'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    const citiesTableExists = await queryInterface.tableExists('cities');
    
    if (tableExists && citiesTableExists) {
      const tableDescription = await queryInterface.describeTable('users');
      
      if (tableDescription.city_id) {
        const [constraints] = await queryInterface.sequelize.query(
          `SELECT CONSTRAINT_NAME 
           FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
           WHERE TABLE_SCHEMA = DATABASE() 
             AND TABLE_NAME = 'users' 
             AND COLUMN_NAME = 'city_id' 
             AND REFERENCED_TABLE_NAME IS NOT NULL`
        );
        
        if (constraints.length === 0) {
          await queryInterface.addConstraint('users', {
            fields: ['city_id'],
            type: 'foreign key',
            name: 'users_city_id_foreign',
            references: {
              table: 'cities',
              field: 'id',
            },
            onUpdate: 'CASCADE',
            onDelete: 'SET NULL',
          });
        }
      }
    }
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('users');
    
    if (tableExists) {
      const [constraints] = await queryInterface.sequelize.query(
        `SELECT CONSTRAINT_NAME 
         FROM INFORMATION_SCHEMA.KEY_COLUMN_USAGE 
         WHERE TABLE_SCHEMA = DATABASE() 
           AND TABLE_NAME = 'users' 
           AND CONSTRAINT_NAME = 'users_city_id_foreign'`
      );
      
      if (constraints.length > 0) {
        await queryInterface.removeConstraint('users', 'users_city_id_foreign');
      }
    }
  },
};

