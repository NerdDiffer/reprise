'use strict';

const crypt = require('../../auth/crypt');

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    hashed_password: DataTypes.STRING,
    facebook_id: DataTypes.STRING,
    token: DataTypes.STRING,
    salt: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        const { User, Instrument, PrivateRoom, Session } = models;
        User.hasMany(Instrument, { foreignKey: 'user_id' });
        User.hasMany(PrivateRoom, { foreignKey: 'user_id' });
        User.hasOne(Session, { foreignKey: 'user_id' });
      },
      hashPassword: crypt.saltAndHash,
      comparePassword: crypt.compare
    },
    tableName: 'users'
  });

  return User;
};
