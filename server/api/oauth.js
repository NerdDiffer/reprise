// TODO: put all passport stuff in here?

// GET `/api/oauth/facebook`
module.exports.facebook = passport.authenticate('facebook');

// GET `/api/oauth/facebook/callback`
module.exports.facebookCallback = (
  passport.authenticate('facebook', {
    successReturnToOrRedirect: '/',
    failureRedirect: '/login'
  });
);
