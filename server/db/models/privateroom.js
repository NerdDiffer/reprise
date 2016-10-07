'use strict';

module.exports = function(sequelize, DataTypes) {
  const PrivateRoom = sequelize.define('PrivateRoom', {
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return PrivateRoom;
};
