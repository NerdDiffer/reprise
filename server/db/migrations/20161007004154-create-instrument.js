'use strict';

const tableName = 'instruments';

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable(tableName, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        references: {
          model: 'users', // name of table
          key: 'id'
        },
        onUpdate: 'cascade', // default
        onDelete: 'cascade',
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING
      },
      keys: {
        type: Sequelize.JSON
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable(tableName);
  }
};
