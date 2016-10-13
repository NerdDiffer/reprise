import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import classnames from 'classnames';

class Form extends Component {
  constructor(props) {
    super(props);

    this.state = {
      username: '',
      password: '',
      errorMessage: ''
    };

    this.updateUsername = this.updateUsername.bind(this);
    this.updatePassword = this.updatePassword.bind(this);
    this.submitForm = this.submitForm.bind(this);
  }

  updateUsername(e) {
    const username = e.target.value;
    this.setState({ username });
  }

  updatePassword(e) {
    const password = e.target.value;
    this.setState({ password });
  }

  submitForm(e) {
    e.preventDefault();

    const { username, password } = this.state;

    return this.props.submit({ username, password })
      .catch(err => {
        const errorMessage = err.response.data;
        this.setState({ errorMessage });
        return;
      });
  }

  render() {
    const { className, buttonLabel, altButton } = this.props;
    const cssClasses = classnames('form', className);

    return (
      <form className={cssClasses} onSubmit={this.submitForm} action="">
        <TextField
          floatingLabelText="Username"
          type="text"
          value={this.state.username}
          onChange={this.updateUsername}
        />
        <br />
        <TextField
          floatingLabelText="Password"
          type="password"
          value={this.state.password}
          onChange={this.updatePassword}
        />
        <br />
        <RaisedButton type="submit" label={buttonLabel} />
        {altButton}
      </form>
    );
  }
}

Form.propTypes = {
  className: React.PropTypes.string.isRequired,
  buttonLabel: React.PropTypes.string.isRequired,
  submit: React.PropTypes.func.isRequired,
  altButton: React.PropTypes.element.isRequired
};

export default Form;
