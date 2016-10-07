'use strict';

module.exports = function(sequelize, DataTypes) {
  const Instrument = sequelize.define('Instrument', {
    user_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    keys: DataTypes.JSON
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });

  return Instrument;
};
