import React from 'react';
import { Link } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// How to wrap `MenuItem` components inside of `Link` components without warnings?
// https://github.com/callemall/material-ui/issues/4899
const NavMenuIcon = ({ loggedIn, clearSessions, FBAuth }) => {
  const styles = {
    targetOrigin: { horizontal: 'right', vertical: 'top' },
    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    menuStyle: { backgroundColor: 'rgba(184, 225, 255, 0.5)', color: '#6F8695' }
  };

  const renderIconButtonElement = () => (
    <IconButton>
      <MoreVertIcon />
    </IconButton>
  );

  const renderItemsForGuestUsers = () => (
    <div className="navMenuIcons">
      <MenuItem
        primaryText="Login"
        containerElement={<Link to="/login" />}
      />
      <MenuItem
        primaryText="Sign up"
        containerElement={<Link to="/signup" />}
      />
      <MenuItem
        primaryText="Login with Facebook"
        onClick={FBAuth}
      />
    </div>
  );

  const renderItemsForLoggedInUsers = () => (
    <div className="navMenuIcons">
      <MenuItem
        onClick={clearSessions}
        primaryText="Signout"
        containerElement={<Link to="/" />}
      />
    </div>
  );

  return (
    <IconMenu
      iconButtonElement={renderIconButtonElement()}
      targetOrigin={styles.targetOrigin}
      anchorOrigin={styles.anchorOrigin}
      className="menu"
      menuStyle={styles.menuStyle}
    >
      {loggedIn ? renderItemsForLoggedInUsers() : renderItemsForGuestUsers()}
    </IconMenu>
  );
};

NavMenuIcon.propTypes = {
  loggedIn: React.PropTypes.bool,
  FBAuth: React.PropTypes.func,
  clearSessions: React.PropTypes.func,
};

export default NavMenuIcon;
