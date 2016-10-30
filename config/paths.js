const path = require('path');

const ROOT = path.join(__dirname, '..');

const PATHS = {
  SRC:  ROOT + '/client/src',
  DIST: ROOT + '/client/public/dist'
};

module.exports = PATHS;
