const { User, PrivateRoom } = require('../db/models');
const { isLoggedIn, readSession } = require('../auth/sessionHelpers');

// POST `/api/rooms/`
module.exports.createPrivateRoom = (req, res) => {
  if (!isLoggedIn(req)) {
    res.status(400).json('You must be logged in');
  } else {
    const { name } = req.body;

    User.findOne({
      where: { name: readSession(req) }
    })
    .then(user => {
      // if query came back empty handed then user must be logged in via
      // facebook,  and their id in schema is stored in passport
      const user_id = user ? user.id : req.session.passport.user;

      return PrivateRoom.create({
        url: name,
        user_id
      });
    })
    .then(newRoom => {
      const msg = `Successfully created room: ${newRoom.url}`;
      res.status(201).json(msg);
    });
  }
};

// GET `/api/rooms/`
module.exports.listPrivateRooms = (req, res) => {
  // TODO: see if clients w/o accounts are using this endpoint
  // If not, then check if client is logged in first before moving on.
  // is it not a facebook user?
  User.findOne({
    where: {
      name: readSession(req)
    }
  })
  .then(user => {
    // if query came back empty handed then user must be logged in via
    // facebook, and their id in schema is stored in passport
    const user_id = user ? user.id : req.session.passport.user;

    return PrivateRoom.findAll({
      where: { user_id }
    });
  })
  .then(privateRooms => {
    const urls = privateRooms.map(room => room.url);
    res.status(200).json(urls);
  });
};
