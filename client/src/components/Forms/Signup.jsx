import React from "react";
import RaisedButton from 'material-ui/RaisedButton';
import { Link } from 'react-router';
import Form from './Form';
import { postToSignup } from '../../utils/api';

const Signup = (props, context) => {
  const submit = ({ username, password }) => {
    return postToSignup({ username, password })
      .then(response => {
        props.logIn(username, [], response.data.auth_token);
        context.router.push('/');
        // TODO: set a success message somewhere
        return;
      });
  };

  const altButton = (
    <Link to="login">
      <RaisedButton label="Click to login instead" />
    </Link>
  );

  return (
    <Form
      className="signup"
      buttonLabel="Signup"
      submit={submit}
      altButton={altButton}
    />
  );
}

Signup.propTypes = {
  logIn: React.PropTypes.func,
};

Signup.contextTypes = {
  router: React.PropTypes.object
};

export default Signup;
