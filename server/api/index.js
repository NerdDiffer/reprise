/* eslint new-cap: 'off' */
const { Router } = require('express');
const passport = require('../auth/passport');
const accounts = require('./accounts');
const oauth = require('./oauth');
const rooms = require('./rooms');
const tokens = require('./tokens');

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

// Login, accounts
router.post('/api/login', validateLogin, accounts.login);
router.post('/api/accounts', accounts.signup);

// OAuth & tokens
router.get('/api/oauth/facebook', oauth.facebook);
router.get('/api/oauth/facebook/callback', oauth.facebookCallback);
router.post('/api/oauth/passport-facebook-token',
  oauth.facebookToken,
  accounts.login
);
router.post('/api/oauth/facebook/token', tokens.generateLongLivedToken);

// Private rooms
router.post('/api/rooms', requireAuth, rooms.createPrivateRoom);
router.get('/api/rooms', requireAuth, rooms.listPrivateRooms);

module.exports = router;
