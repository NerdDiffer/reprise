const { Strategy } = require('passport-facebook');
const { User } = require('../../db/models');
require('dotenv').config();

const { clientID, clientSecret, callbackURL } = process.env;

/* Strategy Configuration */
// https://github.com/jaredhanson/passport-facebook

const strategyParams = {
  clientID,
  clientSecret,
  callbackURL
};

const verifyStrategy = (accessToken, refreshToken, profile, done) => (
  User.findOrCreate({
    where: { facebook_id: profile.id },
    defaults: {
      name: profile.displayName,
      hashed_password: null,
      salt: null
    }
  })
  .then(user => done(null, user))
  .catch(err => done(err))
);

const strategy = new Strategy(strategyParams, verifyStrategy);

module.exports = strategy;
