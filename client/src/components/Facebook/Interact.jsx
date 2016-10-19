import React from 'react';
import { fbGetLoginStatus, fbLogin, fbLogout } from '../../utils/facebook/auth';
import { fbAccessStorage } from '../../utils/storage';
import { generateLongLivedToken, passportFacebookToken } from '../../utils/api';

const Interact = (props, context) => {
  const exchangeToken = () => {
    const accessToken = fbAccessStorage.get();

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
    const newToken = res.authResponse.accessToken;
    fbAccessStorage.set(newToken);

    return exchangeToken()
      .then(exchResponse => {
        const { userInstruments, auth_token } = exchResponse.data;
        props.logInToApp('fb user', userInstruments, auth_token);
        context.router.push('/'); // TODO: make a route for this component
        // TODO: set a success message somewhere
        return;
      });
  };

  const onFbLogout = () => {
    fbAccessStorage.clear();
    props.logOutOfApp();
    console.log('Logged out');
  };

  return (
    <ul>
      <li>
        <a onClick={fbGetLoginStatus}>Check login status</a>
      </li>
      <li>
        <a onClick={() => fbLogin(setTokenThenLoginToApp)}>Login to Facebook</a>
      </li>
      <li>
        <a onClick={() => fbLogout(onFbLogout)}>Logout of Facebook and app</a>
      </li>
    </ul>
  );
};

export default Interact;
