const Strategy = require('passport-facebook-token');
const { User } = require('../../db/models');
require('dotenv').config();

const { clientID, clientSecret, callbackURL } = process.env;

const strategyParams = {
  clientID,
  clientSecret
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
  .then(user => done(null, user[0].dataValues))
  .catch(err => done(err))
);

const strategy = new Strategy(strategyParams, verifyStrategy);

module.exports = strategy;
