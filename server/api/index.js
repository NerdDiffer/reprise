/* eslint new-cap: 'off' */
const { Router } = require('express');
const accounts = require('./accounts');
const oauth = require('./oauth');
const rooms = require('./rooms');

const router = Router();

// Login, logout
router.post('/api/login', accounts.login);
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
