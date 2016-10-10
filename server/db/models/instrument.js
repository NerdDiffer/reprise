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
        const { Instrument, User } = models;
        Instrument.belongsTo(User, { foreignKey: 'user_id' });
      }
    },
    tableName: 'instruments'
  });

  return Instrument;
};
