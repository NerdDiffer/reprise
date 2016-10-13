/* eslint camelcase: 'off' */
const { User, PrivateRoom } = require('../db/models');
const { isLoggedIn, readSession } = require('../auth/session');

// POST `/api/rooms/`
module.exports.createPrivateRoom = (req, res) => {
  if (!isLoggedIn(req)) {
    res.status(400).json('You must be logged in');
  } else {
    const { name } = req.body;
    const user_id = readSession(req) || req.session.passport.user;

    User.findById(user_id)
    .then(user => (
      PrivateRoom.create({
        url: name,
        user_id
      })
    ))
    .then(newRoom => {
      const msg = `Successfully created room: ${newRoom.url}`;
      res.status(201).json(msg);
    });
  }
};

// GET `/api/rooms/`
module.exports.listPrivateRooms = (req, res) => {
  if (!isLoggedIn(req)) {
    res.status(400).json('You must be logged in');
  } else {
    const user_id = readSession(req) || req.session.passport.user;

    User.findById(user_id)
    .then(user => (
      PrivateRoom.findAll({ where: { user_id: user.id } })
    ))
    .then(privateRooms => {
      const urls = privateRooms.map(room => room.url);
      res.status(200).json(urls);
    });
  }
};
