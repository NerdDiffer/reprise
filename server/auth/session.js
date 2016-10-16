const SESSION_KEY = 'user_id';

/* Helpers */
const readSession = req => req.session[SESSION_KEY];

const createSession = (req, val, cb) => (
  req.session.regenerate(() => {
    req.session[SESSION_KEY] = val;

    // TODO: Use the default `express.Store` for now?
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
  readSession,
  createSession,
  clearSession,
  hasSession,
  isLoggedIn
};
