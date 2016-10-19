import React, { Component } from 'react';
import io from 'socket.io-client';
import update from 'react-addons-update';
import baseTheme from 'material-ui/styles/baseThemes/lightBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import Nav from '../components/Nav';
import LoadSDK from '../components/Facebook/LoadSDK';
import FB_API_Interact from '../components/Facebook/Interact';
import { authStorage } from '../utils/storage';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: {
        isLoggedIn: false,
        name: '',
        instruments: []
      }
    };
    this.logIn = this.logIn.bind(this);
    this.logOut = this.logOut.bind(this);
  }

  getChildContext() {
    return { muiTheme: getMuiTheme(baseTheme) };
  }

  componentWillMount() {
    const authToken = authStorage.get();

    if (!authToken) {
      this.logOut(); // reset user state to defaults
    } else {
      const user = update(
        this.state.user,
        { $merge: { isLoggedIn: true } }
      );

      this.setState({ user }); // ensure user stays logged in if page refresh
    }
  }

  componentDidMount() {
    // previously, there was a call to `this.logIn` here
  }

  logIn(name, instruments, token) {
    authStorage.set(token);

    const user = {
      isLoggedIn: true,
      name,
      instruments
    };

    this.setState({ user });
  }

  logOut() {
    authStorage.clear();

    const user = {
      isLoggedIn: false,
      name: '',
      instruments: []
    };

    this.setState({ user });
  }

  render() {
    const children = React.Children.map(this.props.children, child => (
       React.cloneElement(child, {
         logIn: this.logIn,
         logOut: this.logOut,
         user: this.state.user,
         socket: io()
       })
    ));

    return (
      <div style={{ width: '100%', height: '100%' }}>
        <LoadSDK debug={true} />
        <FB_API_Interact
          logInToApp={this.logIn}
          logOutOfApp={this.logOut}
        />
        <Nav
          logIn={this.logIn}
          logOut={this.logOut}
          name={this.state.user.name}
          isLoggedIn={this.state.user.isLoggedIn}
          title={this.props.route.title}
        />
        {
          this.props.children ?
            <section className="child">
              {children}
            </section> :
            null
        }
      </div>
    );
  }
}

App.propTypes = {
  children: React.PropTypes.element
};

// For material ui
App.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};

export default App;
