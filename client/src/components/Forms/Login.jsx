import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import Form from './Form';
import { postToLogin } from '../../utils/api';

const Login = (props, context) => {
  const submit = ({ username, password }) => {
    return postToLogin({ username, password })
      .then(result => {
        props.logIn(username, result);
        context.router.push('/');
        // TODO: set a success message somewhere
        return;
      });
  };

  const altButton = (
    <Link to="signup">
      <RaisedButton label="Click to signup" />
    </Link>
  );

  return (
    <Form
      className="login"
      buttonLabel="Login"
      submit={submit}
      altButton={altButton}
    />
  );
};

Login.propTypes = {
  logIn: React.PropTypes.func,
};

Login.contextTypes = {
  router: React.PropTypes.object
};

export default Login;
