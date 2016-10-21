const { User, Instrument } = require('../db/models');
const { generateToken } = require('../auth/token');

// POST `/api/login`
// This handler can only be accessed if user has already presented valid
// credentials (checked by passport, LocalStrategy middleware).
module.exports.login = (req, res) => {
  const user = req.user;

  Instrument.findAll({ where: { user_id: user.id } })
    .then(collection => {
      const userInstruments = collection.map(inst => inst.dataValues);
      const msg = {
        userInstruments,
        auth_token: generateToken(user)
      };
      res.status(200).json(msg);
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
        User.hashPassword(password, (_err, results) => {
          const { hashed_password, salt } = results;

          User.create({
            name: username,
            hashed_password,
            salt
          }).then(newUser => {
            const msg = { auth_token: generateToken(newUser) };
            res.status(201).json(msg);
          });
        });
      }
    });
};
