const bcrypt = require('bcryptjs');

const ROUNDS = 8;

const genSalt = cb => {
  bcrypt.genSalt(ROUNDS, (err, salt) => {
    if (err) {
      cb(err)
    } else {
      cb(null, salt);
    }
  });
};

const hash = (suppliedPassword, salt, cb) => {
  bcrypt.hash(suppliedPassword, salt, (err, hashed_password) => {
    if (err) {
      cb(err)
    } else {
      cb(null, hashed_password);
    }
  });
};

module.exports.saltAndHash = (suppliedPassword, cb) => {
  genSalt((err, salt) => {
    hash(suppliedPassword, salt, (err, hashed_password) => {
      if (err) {
        cb(err);
      } else {
        const results = { salt, hashed_password };
        cb(null, results);
      }
    })
  });
};

module.exports.compare = (suppliedPassword, hashedPassword, cb) => {
  bcrypt.compare(suppliedPassword, hashedPassword, (err, isPasswordMatch) => {
    if (err) {
      cb(err)
    } else {
      cb(null, isPasswordMatch);
    }
  });
};

module.exports.saltAndHashSync = suppliedPassword => {
  const salt = bcrypt.genSaltSync(ROUNDS);
  const hashed_password = bcrypt.hashSync(suppliedPassword, salt);
  return { salt, hashed_password };
};
