/* global window */
const debug = require('debug');

const APP_NAME = 'reprise'

window.localStorage.setItem('debug', APP_NAME)

export default debug(APP_NAME);
