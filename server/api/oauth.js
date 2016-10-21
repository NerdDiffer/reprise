const passport = require('../auth/passport');

// POST `api/oauth/facebookToken`
module.exports.facebookToken = passport.authenticate('facebook-token', {
  session: false
});
