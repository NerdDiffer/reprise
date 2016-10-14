/* Requires */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');

const signalingServer = require('./signaling'); // WebRTC signaling server
const passport = require('./auth/passport');
const api = require('./api');

/* Init */
const app = express();
const server = http.createServer(app);
signalingServer.listen(server);

if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

/* Middleware */
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pathToStaticDir = path.resolve(__dirname, '..', 'client/public');

app.use(express.static(pathToStaticDir));
app.use(express.static(pathToStaticDir, { redirect: false }));
app.use(passport.initialize());

/* Routes */
app.use(api);

app.get('*', (req, res) => {
  const pathToIndex = path.join(pathToStaticDir, 'index.html');
  res.status(200).sendFile(pathToIndex);
});

/* Kick off server */
const port = process.env.PORT || 3000;

server.listen(port);
