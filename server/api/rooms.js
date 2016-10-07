const { users, PrivateRooms } = require('../db/models');
const { isLoggedIn, readSession } = require('../auth/sessionHelpers');

// POST `/api/rooms/`
module.exports.createPrivateRoom = (req, res) => {
  if (!isLoggedIn(req)) {
    res.send('you must be logged in');
    console.log('User must be logged in to make private room');
  } else {
    console.log('making private rooms');
    users.findOne({
      where: {
        userName: readSession(req)
      }
    })
    .then((user) => {
      // if query came back empty handed then user must be logged in via facebook, and their id in schema is stored in passport
      const userId = user ? user.id : req.session.passport.user;
      return PrivateRooms.create({
        url: req.body.roomName,
        userId,
      });
    })
    .then(() => {
      res.sendStatus(200);
    });
  }
};

// GET `/api/rooms/`
module.exports.getPrivateRooms = (req, res) => {
  // is it not a facebook user?
  users.findOne({
    where: {
      userName: readSession(req)
    }
  })
  .then(user => {
    // if query came back empty handed then user must be logged in via facebook, and their id in schema is stored in passport
    const userId = user ? user.id : req.session.passport.user;
    return PrivateRooms.findAll({
      where: {
        userId,
      }
    });
  })
  .then(privateRooms => {
    // get url
    res.send(privateRooms.map(room => room.url));
  });
};
