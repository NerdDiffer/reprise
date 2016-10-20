import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { Link } from 'react-router';
import NavMenuIcon from './NavMenuIcon';
import { getLogout } from '../../utils/api';

class AppNavBar extends Component {
  constructor(props, context) {
    super(props);
    this.logIn = this.props.logIn.bind(this);
    this.logOut = this.props.logOut.bind(this);
    this.clearSessions = this.clearSessions.bind(this);
  }

  clearSessions() {
    getLogout()
      .then(() => this.logOut());
  }

  render() {
    return (
      <div className="nav">
        <AppBar
          showMenuIconButton={false}
          title={this.props.title}
          titleStyle={{ color: '#E8AEB7', cursor: 'pointer', flex: '' }}
          onTitleTouchTap={() => { this.context.router.push('/'); }}
          style={{ backgroundColor: 'rgba(255, 255, 255, 0.8)', height: '100%' }}
          iconElementRight={
            <NavMenuIcon
              id="menuicon"
              isLoggedIn={this.props.isLoggedIn}
              clearSessions={this.clearSessions}
            />
          }
        />
      </div>
    ); }
  }

AppNavBar.contextTypes = {
  router: React.PropTypes.object
};

AppNavBar.propTypes = {
  isLoggedIn: React.PropTypes.bool,
  name: React.PropTypes.string,
  logOut: React.PropTypes.func,
  logIn: React.PropTypes.func
};

export default AppNavBar;
