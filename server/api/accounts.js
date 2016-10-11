const bcrypt = require('bcryptjs');
const { hasSession, clearSession, createSession } = require('../auth/sessionHelpers');
const { User, Instrument } = require('../db/models');

// GET `/api/accounts/logout`
module.exports.logout = (req, res) => {
  if (hasSession(req)) {
    clearSession(req);
  }
  req.logout();
  res.sendStatus(200);
};

// POST `/api/accounts/login`
module.exports.login = (req, res) => {
  const { username, password } = req.body;

  // TODO: eager load the user instruments
  User.findOne({
    where: { name: username }
  }).then(person => {
    if (!person) {
      res.status(400).json('Wrong username/password combination');
    } else {
      bcrypt.compare(password, person.hashed_password, (err, matches) => {
        if (!matches) {
          res.status(400).json('Wrong username/password combination');
        } else {
          Instrument.findAll({ where: { user_id: person.id } })
            .then(collection => {
              const userInstruments = collection.map(inst => inst.dataValues);
              createSession(req, person.id);
              res.status(200).json(userInstruments);
            });
        }
      });
    }
  });
};

// POST `/api/accounts`
module.exports.signup = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { name: username } })
    .then(user => {
      if (user) {
        const msg = `User already exists by the name, ${username}`;
        res.status(400).json(msg);
      } else {
        // TODO: user asynchronous methods instead
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        User.create({
          name: username,
          hashed_password: hash,
          salt,
        }).then(newUser => {
          createSession(req, newUser.id);
          res.redirect('/');
        });
      }
    });
};
