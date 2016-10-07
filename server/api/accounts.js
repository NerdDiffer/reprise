const bcrypt = require('bcryptjs');
const { hasSession, clearSession, createSession } = require('../auth/sessionHelpers');
const { users, instruments } = require('../db/models');

// GET `/api/accounts/logout`
module.exports.logout = (req, res) => {
  if (hasSession(req)) {
    clearSession(req);
  }
  req.logout();
  console.log('mysession after logout', req.session);
  res.sendStatus(200);
};

// POST `/api/accounts/login`
module.exports.login = (req, res) => {
  const { user, pass } = req.body;

  users.findOne({
    where: {
      userName: user
    }
  }).then(person => {
    if (!person) {
      res.redirect('/api/accounts/login');
    } else {
      bcrypt.compare(pass, user.hash, (err, matches) => {
        if (!matches) {
          res.redirect('/api/accounts/login');
        } else {
          instruments.findAll({ where: { userName: person.userName }})
            .then(collection => {
              const userInstruments = collection.map(inst => inst.dataValues);
              createSession(req, user);
              res.status(200).json(userInstruments);
            });
        }
      });
    }
  });
};

// POST `/api/accounts`
module.exports.signup = (req, res) => {
  const userName = req.body.user; // TODO: refactor client to send better-named parameters
  const password = req.body.pass;

  users.findOne({ where: { userName } })
    .then(user => {
      if (user) {
        res.status(200).json('User already exists by the name', userName);
      } else {
        // TODO: user asynchronous methods instead
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        users.create({
          userName,
          password: hash,
          salt,
        }).then(entry => {
          createSession(req, userName);
          // TODO: redirect user somewhere cool
          res.status(201).json('Successfully signed up');
        });
      }
    });
};
