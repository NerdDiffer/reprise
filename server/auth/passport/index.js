const passport = require('passport');
const facebookStrategy = require('./facebookStrategy');

passport.use('facebook', facebookStrategy);

module.exports = passport;
