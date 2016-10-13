const sessionSequelize = require('connect-session-sequelize');
const { Store } = require('express-session');
const { sequelize, Session } = require('../db/models');

const SESSION_KEY = 'user_id';

/* Session Store configuration */
sequelize.models.sessions = Session; // Shim for custom table names

const extendDefaultFields = (defaults, session) => (
  {
    data: defaults.data,
    expires: defaults.expires,
    [SESSION_KEY]: session[SESSION_KEY]
  }
);

const SequelizeStore = sessionSequelize(Store);

const store = new SequelizeStore({
  db: sequelize,
  table: 'sessions',
  extendDefaultFields
});

/* Helpers */
const readSession = req => req.session[SESSION_KEY];

const createSession = (req, val, cb) => (
  req.session.regenerate(() => {
    req.session[SESSION_KEY] = val;

    return store.set(req.sessionID, req.session, err => {
      if (err) {
        cb(err);
      } else {
        cb();
      }
    });
  })
);

const clearSession = req => {
  req.session.destroy();
};

const hasSession = req => req.session && !!req.session[SESSION_KEY];

const isLoggedIn = req => hasSession(req) || !!req.session.passport;

/* Exports */
module.exports = {
  store,
  readSession,
  createSession,
  clearSession,
  hasSession,
  isLoggedIn
};
