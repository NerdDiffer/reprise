const mysql = require('mysql');
//
const users = require('./models').users;
<<<<<<< HEAD
const instruments = require('./models').instruments;
=======
const PrivateRooms = require('./models').PrivateRooms;
>>>>>>> master

const connection= mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '12345',
  database: 'tbd'
});


connection.connect(err => {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});

<<<<<<< HEAD
module.exports.users = users;
module.exports.instruments = instruments;
=======
module.exports = {
  users,
  PrivateRooms,
};
>>>>>>> master
