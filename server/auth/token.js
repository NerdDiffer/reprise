const jwt = require('jwt-simple');
require('dotenv').config();

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
