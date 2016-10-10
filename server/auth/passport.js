const passport = require('passport');
const { Strategy } = require('passport-facebook');
const { User } = require('../db/models');
require('dotenv').config();

const { client_Id, client_Secret, callbackURL } = process.env;

const fbConfig = {
  clientID: client_Id,
  clientSecret: client_Secret,
  callbackURL: callbackURL
};

passport.use(new Strategy(fbConfig, (accessToken, refreshToken, profile, done) => {
  User.findOne({ where: { facebook_id: profile.id } })
    .then(user => {
      if (user) {
        return done(null, user);
      } else {
        return User.create({
          name: `${profile.displayName}`,
          password: null,
          facebook_id: profile.id,
          token: accessToken,
        }).then(newUser => {
          return done(null, newUser.dataValues.id);
        });
      }
    });
}
));

// serialize and deserialize
passport.serializeUser((user, done) => {
  const final = typeof user==="number"?user:user[0].dataValues.id;
  done(null, final);
});

passport.deserializeUser((id, done) => {
  User.findAll({ where: { id } })
    .then(found => {
      const values = found[0].dataValues;
      done(null, id);
    });
});

module.exports = passport;
