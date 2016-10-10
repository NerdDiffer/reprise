const passport = require('passport');
const { Strategy } = require('passport-facebook');
const { User } = require('../db/models');
require('dotenv').config();

const { client_Id, client_Secret, callbackURL } = process.env;

/* Strategy Configuration */
// https://github.com/jaredhanson/passport-facebook

const strategyParams = {
  clientID: client_Id,
  clientSecret: client_Secret,
  callbackURL: callbackURL
};

const verifyStrategy = (accessToken, refreshToken, profile, done) => {
  return User.findOrCreate({
    where: { facebook_id: profile.id },
    defaults: {
      name: profile.displayName,
      hashed_password: null,
      token: accessToken,
      salt: null
    }
  })
  .then(user => done(null, user))
  .catch(err => done(err));
};

const strategy = new Strategy(strategyParams, verifyStrategy);

passport.use(strategy);

/* Serialization, Deserializtion */

passport.serializeUser((user, done) => {
  const final = typeof user==="number"?user:user[0].dataValues.id;
  done(null, final);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user.id);
    });
});

module.exports = passport;
