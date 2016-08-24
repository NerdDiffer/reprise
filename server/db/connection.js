const Sequelize = require('sequelize');
require('dotenv').config();
const { db_host, db_user, db_password, db_name } = process.env;

const sequelize = new Sequelize(db_name, db_user, db_password, {
  host: db_host,
  dialect: 'mysql'
});

module.exports = {
  sequelize,
  Sequelize
};
