/* Requires */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const sessionSequelize = require('connect-session-sequelize');
const cookieParser = require('cookie-parser');
const uid = require('uid-safe');

const signalingServer = require('./signaling'); // WebRTC signaling server
const passport = require('./auth/passport');
const api = require('./api');
const { sequelize, Session } = require('./db/models');

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

const SequelizeStore = sessionSequelize(expressSession.Store);
// Shim for custom table names
sequelize.models.sessions = Session;
const sessionStore = new SequelizeStore({
  db: sequelize,
  table: 'sessions'
});
app.use(expressSession({
  secret: process.env.sessions_secret,
  resave: false, // `connect-session-sequelize` implements `touch` method. So false is ok.
  saveUninitialized: false, // reduce storage needs with false
  store: sessionStore,
  genid: () => uid(18)
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
