const passport = require('passport');
const { Strategy } = require('passport-facebook');
const { users } = require('./db/models');
require('dotenv').config();

const { client_Id, client_Secret, callbackURL } = process.env;

const fbConfig = {
  clientID: client_Id,
  clientSecret: client_Secret,
  callbackURL: callbackURL
};

passport.use(new Strategy(fbConfig, (accessToken, refreshToken, profile, done) => {
  users.findAll({ where: { facebookId: profile.id } })
    .then(user => {
      if (user.length > 0) {
        return done(null, user);
      } else {
        return users.create({
          userName: `${profile.displayName}`,
          password: "N/A",
          facebookId: profile.id,
          token: accessToken,
        }).then(entry => {
          return done(null, entry.dataValues.id);
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
  users.findAll({ where: { id } })
    .then(found => {
      const values = found[0].dataValues;
      done(null, id);
    });
});

module.exports = passport;
