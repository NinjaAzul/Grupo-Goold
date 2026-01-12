'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('user_permissions');

    if (!tableExists) {
      return;
    }


    const tableDescription = await queryInterface.describeTable('user_permissions');
    
  
    if (!tableDescription.id) {
      return;
    }

  
    await queryInterface.sequelize.query(
      `ALTER TABLE user_permissions MODIFY id INT NOT NULL`
    );

    await queryInterface.sequelize.query(
      `ALTER TABLE user_permissions DROP PRIMARY KEY`
    );


    await queryInterface.removeColumn('user_permissions', 'id');


    await queryInterface.sequelize.query(
      `ALTER TABLE user_permissions ADD PRIMARY KEY (user_id, permission_id)`
    );
  },

  async down(queryInterface, Sequelize) {
    const tableExists = await queryInterface.tableExists('user_permissions');

    if (!tableExists) {
      return;
    }

    
    const tableDescription = await queryInterface.describeTable('user_permissions');
    
    
    if (tableDescription.id) {
      return;
    }

    
    await queryInterface.sequelize.query(
      `ALTER TABLE user_permissions DROP PRIMARY KEY`
    );

      
    await queryInterface.addColumn('user_permissions', 'id', {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
      first: true,
    });
  },
};
