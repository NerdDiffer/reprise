'use strict';

module.exports = function(sequelize, DataTypes) {
  const PrivateRoom = sequelize.define('PrivateRoom', {
    url: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        const { PrivateRoom, User } = models;
        PrivateRoom.belongsTo(User, { foreignKey: 'user_id' });
      }
    }
  });

  return PrivateRoom;
};
