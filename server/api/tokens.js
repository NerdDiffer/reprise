const debug = require('debug')('reprise');
/**
 * https://developers.facebook.com/docs/facebook-login/access-tokens/expiration-and-extension
 */
const Axios = require('axios');

if (process.env.NODE_ENV !== 'production') { require('dotenv').config(); }
const { clientID, clientSecret } = process.env;

// configure axios client
const VERSION = '2.8';
const axios = Axios.create({
  baseURL: `https://graph.facebook.com/v${VERSION}`
});

// debugging helper
const debugAxiosErr = err => {
  debug('err.message:\n %s', err.message);
  debug('err.config:\n %o', err.config);

  if (err.response) {
    const { status, statusText, headers, config } = err.response;

    debug('err.response.status:\n %o', status);
    debug('err.response.statusText:\n %o', statusText);
    debug('err.response.headers:\n %o', headers);
    debug('err.response.config:\n %o', config);
  }
};

module.exports.generateLongLivedToken = (req, res, next) => {
  const shortLivedToken = req.body.accessToken;

  if (!shortLivedToken) {
    return res.status(400).json('Send a short-lived at: accessToken');
  }

  debug('shortLivedToken: %s', shortLivedToken);

  const params = {
    grant_type: 'fb_exchange_token',
    client_id: clientID,
    client_secret: clientSecret,
    fb_exchange_token: shortLivedToken
  };

  const url = `/oauth/access_token`;

  //GET /oauth/access_token?
  //  grant_type=fb_exchange_token&amp;
  //  client_id={app-id}&amp;
  //  client_secret={app-secret}&amp;
  //  fb_exchange_token={short-lived-token}
  return axios.get(url, { params })
    .then(fbResponse => {
      const msg = fbResponse.data;
      return res.json(msg);
    })
    .catch(err => {
      debugAxiosErr(err);

      const statusCode = err.response ? err.response.status : 400;
      const msg = err.response ? err.response.data : err.message;

      return res.status(statusCode).json(msg);
    });
};
