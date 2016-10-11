import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import { Link } from 'react-router';
import $ from 'jquery';
import { showErrorMessage } from '../utils/helperFunctions';

class Login extends Component {

  helperLogin() {
    const username = $('#UserNameLogin').val();
    const password = $('#UserNamePass').val();

    $.post("/api/accounts/login", { username, password }, (resp) => {
      if (typeof resp !=='string') {
        this.props.logIn(username, resp);
        this.context.router.push('/');
      } else {
        showErrorMessage("#LIMessages", 'Bad login', "badLogin");
      }
    });
  }

  render() {
    return (
      <div id="loginContent">
        <TextField floatingLabelText="UserName" hintText="Watch caps lock" id="UserNameLogin" /><br />
        <TextField floatingLabelText="Password" hintText="Watch caps lock" id="UserNamePass" type="password" /><br />
        <RaisedButton label="Login" onClick={() => { this.helperLogin(); }} / >
        <Link to="signup"><RaisedButton label="Click to signup" /></Link>
        <div id="LIMessages"><br /></div>
      </div>
    );
  }
}

Login.propTypes = {
  params: React.PropTypes.object,
  updateUserInstrument: React.PropTypes.func,
  logIn: React.PropTypes.func,
};

Login.contextTypes = {
  router: React.PropTypes.object
};

Login.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
export default Login;
