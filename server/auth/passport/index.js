const passport = require('passport');
const facebookTokenStrategy = require('./facebookTokenStrategy');
const jwtStrategy = require('./jwtStrategy');
const localStrategy = require('./localStrategy');

passport.use('facebook-token', facebookTokenStrategy);
passport.use('jwt', jwtStrategy);
passport.use('local', localStrategy);

module.exports = passport;
