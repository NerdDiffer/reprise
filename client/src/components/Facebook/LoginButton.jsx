import React from 'react';
import FacebookLogin from 'react-facebook-login';
import { fbAccessStorage } from '../../utils/storage';
import { passportFacebookToken } from '../../utils/api';

const FacebookLoginButton = (props, context) => {
  const exchangeToken = accessToken => {
    console.log('Exchanging token:\n', accessToken);

    return passportFacebookToken({ accessToken })
      .then(res => {
        console.log(res);
        return res;
      })
      .catch(err => {
        console.log(err.config);
        console.log(err.response);
      });
  };

  const setTokenThenLoginToApp = res => {
    console.log('Logged in');
    const newToken = res.accessToken;
    fbAccessStorage.set(newToken);

    return exchangeToken(newToken)
      .then(exchResponse => {
        const { userInstruments, auth_token } = exchResponse.data;
        props.logInToApp(res.name, userInstruments, auth_token, true);
        props.router.push('/');
        // TODO: set a success message somewhere
        return;
      });
  };

  /**
   * Callback for click event. Note: The component will already call FB.login
   * for you.
   */
  const handleClick = e => {
    console.log('clicked fb login button');
  };

  /**
   * Callback invoked when the component checks login state.
   * This happens after a click and after a page refresh.
   * @param res, {Object} The `authResponse` key of a response from Facebook API
   *   If the API response has the 'status' of 'connected', then the React
   *   component module further reduces its shape to:
   *   - accessToken: {String}
   *   - expiresIn: {Integer}
   *   - id: {Integer}
   *   - name: {String}
   *   - userID: {Integer}
   *   - signedRequest: {String}
   *
   * Read more about Facebook API in general:
   * @see https://developers.facebook.com/docs/reference/javascript/FB.getLoginStatus/
   */
  const respondToFacebook = res => {
    console.log('facebook response:\n', res);

    // TODO: handle cases where 'status' is not connected. Consider converting
    // this entire component to a class & use lifecycle methods to look at nextProps.
    setTokenThenLoginToApp(res);
  };

  return (
    <FacebookLogin
      appId={process.env.clientID}
      autoLoad={true}
      icon="fa-facebook"
      version="2.6"
      onClick={handleClick}
      callback={respondToFacebook}
    />
  );
};

export default FacebookLoginButton;
