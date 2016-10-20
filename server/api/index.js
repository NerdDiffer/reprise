/* eslint new-cap: 'off' */
const { Router } = require('express');
const passport = require('../auth/passport');
const accounts = require('./accounts');
const oauth = require('./oauth');
const rooms = require('./rooms');
const tokens = require('./tokenExchange');

/* Authorization middleware */

// Require the user to have a valid JWT before accessing any protected resources
const requireAuth = passport.authenticate('jwt', {
  session: false
});

// Validate user's name & password. Do this before sending user a token.
const validateLogin = passport.authenticate('local', {
  session: false
});

/* Routes */

const router = Router();

// Login, logout
router.post('/api/login', validateLogin, accounts.login);
router.get('/api/logout', accounts.logout);

// Accounts: `/api/accounts/`
router.post('/api/accounts', accounts.signup);

// OAuth & tokens: `/api/oauth/`
router.get('/api/oauth/facebook', oauth.facebook);
router.get('/api/oauth/facebook/callback', oauth.facebookCallback);
router.post('/api/oauth/passport-facebook-token',
  oauth.facebookToken,
  (req, res) => {
    const msg = req.user ? 200 : 401;
    res.send(msg);
  }
);
router.post('/api/oauth/facebook/token', tokens.generateLongLivedToken);

// alt token generation
router.post('/api/tokens', tokens.generateLongLivedToken);

// Private rooms: `/api/rooms/`
router.post('/api/rooms', requireAuth, rooms.createPrivateRoom);
router.get('/api/rooms', requireAuth, rooms.listPrivateRooms);

module.exports = router;
