'use strict';

const { saltAndHashSync } = require('../../auth/crypt');

const dummyPassword = 'password';
// unfortunately, the async version won't work with the migration
const { salt, hashed_password } = saltAndHashSync(dummyPassword);
const dateStr = new Date().toISOString();

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', [{
      name: 'foobar',
      hashed_password,
      salt,
      createdAt: dateStr,
      updatedAt: dateStr
    }], {});
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.bulkDelete('users', null, {});
  }
};
