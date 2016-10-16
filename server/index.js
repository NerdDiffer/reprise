/* Requires */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');

const signalingServer = require('./signaling'); // WebRTC signaling server
const passport = require('./auth/passport');
const api = require('./api');

/* Init */
const app = express();
const server = http.createServer(app);
signalingServer.listen(server);
require('dotenv').config();

/* Middleware */
app.use(cookieParser());
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const pathToStaticDir = path.resolve(__dirname, '..', 'client/public');

app.use(express.static(pathToStaticDir));
app.use(express.static(pathToStaticDir, { redirect: false }));

app.use(expressSession({
  secret: process.env.sessions_secret,
  resave: false, // If store implements `touch`, then set to false
  saveUninitialized: false // reduce storage needs with false
}));
app.use(passport.initialize());
app.use(passport.session());

/* Routes */
app.use(api);

app.get('*', (req, res) => {
  const pathToIndex = path.join(pathToStaticDir, 'index.html');
  res.status(200).sendFile(pathToIndex);
});

/* Kick off server */
const port = process.env.PORT || 3000;

server.listen(port);
