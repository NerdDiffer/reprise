const LocalStrategy = require('passport-local');
const { User } = require('../../db/models');

const verify = (username, password, done) => {
  return User.findOne({ where: { name: username } })
    .then(user => {
      if (!user) {
        return done(null, false);  // no user found by that name
      } else {
        User.comparePassword(password, user.hashed_password, (bcryptErr, isMatch) => {
          if (bcryptErr) {
            return done(bcryptErr);
          }

          if (!isMatch) {
            done(null, false); // not a match
          } else {
            done(null, user); // found a match, here is the user
          }
        });
      }
    })
    .catch(dbErr => {
      return done(dbErr);  // database error
    });
};

const localLoginStrategy = new LocalStrategy(verify);

module.exports = localLoginStrategy;
