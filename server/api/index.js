/* eslint new-cap: 'off' */
const { Router } = require('express');
const passport = require('../auth/passport');
const accounts = require('./accounts');
const oauth = require('./oauth');
const rooms = require('./rooms');

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

// OAuth: `/api/oauth/`
router.get('/api/oauth/facebook', oauth.facebook);
router.get('/api/oauth/facebook/callback', oauth.facebookCallback);

// Private rooms: `/api/rooms/`
router.post('/api/rooms', rooms.createPrivateRoom);
router.get('/api/rooms', rooms.listPrivateRooms);

module.exports = router;
