/* global document, window, FB */

const testAPI = () => {
  console.log('Welcome!  Fetching your information.... ');

  FB.api('/me', response => {
    console.log('Successful login for: ' + response.name);
    const msg = 'Thanks for logging in, ' + response.name + '!';
    console.log(msg);
  });
};

/**
 * Handler for FB.getLoginStatus.
 * @see https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/
 * @param response, {Object} Response object from call to FB.getLoginStatus
 */
const onStatusChange = response => {
  console.log('onStatusChange');
  console.log(response);

  if (response.status === 'connected') {
    // Logged into your app and Facebook.
    testAPI();
  } else if (response.status === 'not_authorized') {
    // The person is logged into Facebook, but not your app.
    const msg = 'Please log into this app';
    console.log(msg);
  } else {
    // The person is not logged into Facebook, so we're not sure if
    // they are logged into this app or not.
    const msg = 'Please log into Facebook';
    console.log(msg);
  }
};

// Invoke when someone has finished with the Login button
// @see https://developers.facebook.com/docs/facebook-login/web#quickstart
export const fbGetLoginStatus = () => {
  FB.getLoginStatus(response => onStatusChange(response));
};

export const fbLogin = onConnected => {
  FB.login(res => {
    if (res.status !== 'connected') {
      console.log('not connected. status:', res.status);
      console.log('authResponse:', res.authResponse);
    } else {
      onConnected(res);
    }
  });
};

// Invalidate access_token & log user out of app
// https://developers.facebook.com/docs/reference/javascript/FB.logout/
export const fbLogout = onFbLogout => FB.logout(onFbLogout);
