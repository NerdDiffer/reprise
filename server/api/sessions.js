const { hasSession, clearSession, createSession } = require('../auth/session');
const { User, Instrument } = require('../db/models');

// POST `/api/login`
module.exports.login = (req, res) => {
  const { username, password } = req.body;

  // TODO: eager load the user instruments
  User.findOne({
    where: { name: username }
  }).then(person => {
    if (!person) {
      res.status(400).json('Wrong username/password combination');
    } else {
      User.comparePassword(password, person.hashed_password, (err, matches) => {
        if (!matches) {
          res.status(400).json('Wrong username/password combination');
        } else {
          Instrument.findAll({ where: { user_id: person.id } })
            .then(collection => {
              const userInstruments = collection.map(inst => inst.dataValues);
              createSession(req, person.id, err => {
                if (err) {
                  res.status(500).json(err);
                } else {
                  res.status(200).json(userInstruments);
                }
              });
            });
        }
      });
    }
  });
};

// GET `/api/logout`
module.exports.logout = (req, res) => {
  if (hasSession(req)) {
    clearSession(req);
  }
  req.logout();
  res.sendStatus(200);
};
