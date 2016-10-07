import React, { Component } from "react";
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import $ from "jquery";
import { Link } from 'react-router';
import { showErrorMessage } from '../utils/helperFunctions';

class Signup extends Component {
  helperSignup() {
    const username = $('#UserNameSignUp').val();
    const password = $('#UserNamePass').val();

    $.post("/api/accounts/", { username, password }, (resp) => {
      if (resp === "SuccessSignup") {
        this.props.logIn(username, []);
        this.context.router.push('/');
      } else {
        showErrorMessage("#SIMessages", 'Username Taken', "badSignUp");
      }
    });
  }


  render() {
    return (
      <div id="signupContent">
        <TextField floatingLabelText="UserName" hintText="Must be 7+ characters" id="UserNameSignUp" type="text" /><br />
        <TextField floatingLabelText="Password" hintText="Must be 7+ characters" id="UserNamePass" type="password" /><br />
        <RaisedButton label="Signup" onClick={() => { this.helperSignup(); }} />
        <Link to="/login" ><RaisedButton label="Click to Login Instead" /> </Link >
        <div id="SIMessages"><br /> </div>
      </div>
    );
  }
}

Signup.contextTypes = {
  router: React.PropTypes.object
};

Signup.propTypes = {
  logIn: React.PropTypes.func,
};

Signup.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

export default Signup;
