const express = require('express');
const logger = require('morgan');
const path = require('path');

const app = express();

/* Middleware */

app.use(logger('dev'));

const pathToStaticDir = path.resolve(__dirname, '..', 'client/public');
app.use(express.static(pathToStaticDir));

/* Routes */

app.get('/', (req, res) => {
  res.status(200).send();
});

/* Initialize */

const port = process.env.PORT || 3000;
app.listen(port);
console.log('Server is listening on port', port);
