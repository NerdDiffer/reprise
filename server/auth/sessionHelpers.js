const SESSION_KEY = 'user_id';

const readSession = req => {
  return req.session[SESSION_KEY];
};

const createSession = (req, val) => {
  req.session[SESSION_KEY] = val;
  return val;
};

const clearSession = req => {
  delete req.session[SESSION_KEY];
};

const hasSession = req => {
  return req.session && !!req.session[SESSION_KEY];
};

const isLoggedIn = req => {
  return hasSession(req) || !!req.session.passport;
};

module.exports = {
  readSession,
  createSession,
  clearSession,
  hasSession,
  isLoggedIn
};
