const mysql = require('mysql');


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
