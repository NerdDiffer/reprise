const mysql = require('mysql');
//
const users = require('./models').users;
const instruments = require('./models').instruments;

const PrivateRooms = require('./models').PrivateRooms;

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

module.exports = {
  users,
  PrivateRooms,
  instruments,
};
