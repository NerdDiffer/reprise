'use strict';

module.exports = function(sequelize, DataTypes) {
  var Session = sequelize.define('Session', {
    sid: {
      primaryKey: true,
      type: DataTypes.STRING(32)
    },
    user_id: DataTypes.INTEGER,
    data: DataTypes.JSON,
    expires: DataTypes.DATE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        const { Session, User } = models;
        Session.belongsTo(User, { foreignKey: 'user_id' });
      }
    },
    tableName: 'sessions'
  });
  return Session;
};
