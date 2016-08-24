const mysql = require('mysql');
require('dotenv').config();

const { db_host, db_user, db_password, db_name } = process.env;

const connection= mysql.createConnection({
  host: db_host,
  user: db_user,
  password: db_password,
  database: db_name
});

connection.connect(err => {
  if (err) {
    console.log('Error connecting to Db');
    return;
  }
  console.log('Connection established');
});
