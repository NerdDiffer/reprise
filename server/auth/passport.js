const passport = require('passport');
const { Strategy } = require('passport-facebook');
require('dotenv').config();

const { client_Id, client_Secret, callbackURL } = process.env;

const fbConfig = {
  clientID: client_Id,
  clientSecret: client_Secret,
  callbackURL: callbackURL
};

passport.use(new Strategy(fbConfig, (accessToken, refreshToken, profile, done) => {
  console.log('this is the profile', profile);
  users.findAll({ where: { facebookId: profile.id } })
    .then(user => {
      if (user.length > 0) {
        console.log('user already exists', user[0]);
        return done(null, user);
      } else {
        return users.create({
          userName: `${profile.displayName}`,
          password: "N/A",
          facebookId: profile.id,
          token: accessToken,
        }).then(entry => {
          console.log('this is entry for a newly added user', entry.dataValues.id);
          console.log(entry.dataValues, ' got entered', entry);
          return done(null, entry.dataValues.id);
        });
      }
    });
}
));

// serialize and deserialize
passport.serializeUser((user, done) => {
  const final = typeof user==="number"?user:user[0].dataValues.id;
  console.log('this is the user param', user);
  console.log('serializing!!!', final);
  done(null, final);
});

passport.deserializeUser((id, done) => {
  console.log('this is id in deserialize', id);
  users.findAll({ where: { id } })
    .then(found => {
      const values = found[0].dataValues;
      console.log('Trying to "deserialize" this user', values);
      done(null, id);
    });
});

module.exports = passport;
