const passportJwt = require('passport-jwt');
const Strategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const { User } = require('../../db/models');

require('dotenv').config();

// configuration for decoding an incoming JWT
const decodeConfig = {
  // Where to look for the token
  jwtFromRequest: ExtractJwt.fromHeader('auth_token'),
  // What salt to use to decrypt the info on the header
  secretOrKey: process.env.token_secret
};

/**
 * Once the JWT has been decoded, go to DB to find user.
 * @param payload, {String} the decoded JWT
 * @param done, {Function} what to do when you have retrieved user from DB
 */
const findUser = (payload, done) => {
  return User.findById(payload.sub)
    .then(user => {
      if (!user) {
        return done(null, false); // no user found by that id
      } else {
        return done(null, user); // found the user
      }
    })
    .catch(dbErr => {
      return done(null, false);
    });
};

const strategy = new Strategy(decodeConfig, findUser);

module.exports = strategy;
