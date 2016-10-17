/* eslint camelcase: 'off' */
const { User, PrivateRoom } = require('../db/models');

/**
 * These handlers assume that user credentials has already been verified
 * by passport & JwtStrategy middleware.
 */

// POST `/api/rooms/`
module.exports.createPrivateRoom = (req, res) => {
  const user_id = req.user.id;
  const { name } = req.body;

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
};

// GET `/api/rooms/`
module.exports.listPrivateRooms = (req, res) => {
  const user_id = req.user.id;

  User.findById(user_id)
  .then(user => (
    PrivateRoom.findAll({ where: { user_id: user.id } })
  ))
  .then(privateRooms => {
    const urls = privateRooms.map(room => room.url);
    res.status(200).json(urls);
  });
};
