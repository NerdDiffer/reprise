/* global document, window, FB */

const APP_ID = process.env.clientID;

/**
 * The function assigned to `window.fbAsyncInit` is run as soon as the SDK has
 * completed loading. Any code that you want to run after the SDK is loaded
 * should be placed within this function and after the call to FB.init. Any kind
 * of JavaScript can be used here, but any SDK functions must be called after FB.init.
 */
const _fbAsyncInit = () => {
  FB.init({
    appId: APP_ID,
    xfbml: true,
    version: 'v2.8'
  });

  FB.AppEvents.logPageView();
};

/**
 * @param debug, {Boolean} load un-minified SDK with logging statements.
 *   Is false by default.
 */
const setupDOM = (d, s, id, debug = false) => {
  if (d.getElementById(id)) { return; }

  // set up `js` element
  const js = d.createElement(s);
  js.id = id;

  const baseSrcUrl = '//connect.facebook.net/en_US';
  js.src = debug ? `${baseSrcUrl}/sdk/debug.js` : `${baseSrcUrl}/sdk.js`;

  // set up `fjs` element
  const fjs = d.getElementsByTagName(s)[0];
  fjs.parentNode.insertBefore(js, fjs);
};

export default function loadSDK(debug) {
  window.fbAsyncInit = _fbAsyncInit;
  setupDOM(document, 'script', 'facebook-jssdk', debug);
};
