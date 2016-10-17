const passport = require('passport');
const facebookStrategy = require('./facebookStrategy');

passport.use('facebook', facebookStrategy);

/* Serialization, Deserializtion */

passport.serializeUser((user, done) => {
  const id = typeof user === 'number' ? user : user[0].dataValues.id;
  done(null, id);
});

passport.deserializeUser((id, done) => {
  User.findById(id)
    .then(user => {
      done(null, user.id);
    });
});

module.exports = passport;
