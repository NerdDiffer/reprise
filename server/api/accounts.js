const { createSession } = require('../auth/session');
const { User, Instrument } = require('../db/models');

// POST `/api/accounts`
module.exports.signup = (req, res) => {
  const { username, password } = req.body;

  User.findOne({ where: { name: username } })
    .then(user => {
      if (user) {
        const msg = `User already exists by the name, ${username}`;
        res.status(400).json(msg);
      } else {
        User.hashPassword(password, (err, results) => {
          const { hashed_password, salt } = results;

          User.create({
            name: username,
            hashed_password,
            salt
          }).then(newUser => {
            createSession(req, newUser.id, err => {
              if (err) {
                res.status(500).json(err);
              } else {
                res.redirect('/');
              }
            });
          });
        });
      }
    });
};
