const express = require('express');
const accounts = require('./accounts');
const oauth = require('./oauth');
const rooms = require('./rooms');

const router = express.Router();

// Accounts: `/api/accounts/`
router.get('/api/accounts/logout', accounts.logout);
router.post('/api/accounts/login', accounts.login);
router.post('/api/accounts', accounts.signup);

// OAuth: `/api/oauth/`
router.get('/api/oauth/facebook', oauth.facebook);
router.get('/api/oauth/facebook/callback', oauth.facebookCallback);

// Private rooms: `/api/rooms/`
router.post('/api/rooms', rooms.createPrivateRoom);
router.get('/api/rooms', rooms.listPrivateRooms);

// Misc (figure out where these should go): `/api/misc`
router.get('/api/misc/getUserInfo', misc.getUserInfo);
router.get('/api/misc/fbLoggedIn', misc.fbLoggedIn);

module.exports = router;

/**
 * An abstract of the original routes. Use these to fix client.
 * Note, these were originally mounted from the ROOT
 */

// app.get('/logout', accounts.logout);
// app.post('/login', accounts.login);
// app.post('/signup', account s.signup);

// app.get('/auth/facebook', oauth.facebook);
// app.get('/auth/facebook/callback', oauth.facebookCallback);

// app.get("/getUserInfo", misc.getUserInfo);
// app.get("/fbLoggedIn", misc.fbLoggedIn);

// app.post('/makeprivateroom', rooms.createPrivateRoom);
// app.get('/getprivaterooms', rooms.getPrivateRooms);
