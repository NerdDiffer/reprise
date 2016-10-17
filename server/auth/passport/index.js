const passport = require('passport');
const facebookStrategy = require('./facebookStrategy');
const jwtStrategy = require('./jwtStrategy');
const localStrategy = require('./localStrategy');

passport.use('facebook', facebookStrategy);
passport.use('jwt', jwtStrategy);
passport.use('local', localStrategy);

module.exports = passport;
