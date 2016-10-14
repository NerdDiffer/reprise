const jwt = require('jwt-simple');
if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }

const generateToken = user => {
  const payload = {
    sub: user.id,
    iat: new Date().getTime()
  };

  return jwt.encode(payload, process.env.token_secret);
};

module.exports = {
  generateToken
};
