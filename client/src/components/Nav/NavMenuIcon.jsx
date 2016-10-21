import React from 'react';
import { Link } from 'react-router';
import IconMenu from 'material-ui/IconMenu';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// How to wrap `MenuItem` components inside of `Link` components without warnings?
// https://github.com/callemall/material-ui/issues/4899
const NavMenuIcon = ({ isLoggedIn, logOut }) => {
  const styles = {
    targetOrigin: { horizontal: 'right', vertical: 'top' },
    anchorOrigin: { horizontal: 'right', vertical: 'bottom' },
    menuStyle: { backgroundColor: 'rgba(184, 225, 255, 0.5)', color: '#6F8695' }
  };

  const iconButtonElement = (
    <IconButton>
      <MoreVertIcon />
    </IconButton>
  );

  const iconMenuOptions = {
    iconButtonElement,
    targetOrigin: styles.targetOrigin,
    anchorOrigin: styles.anchorOrigin,
    menuStyle: styles.menuStyle
  };

  const itemsForLoggedInUsers = options => (
    <IconMenu {...options}>
      <MenuItem
        onClick={logOut}
        primaryText="Logout"
        containerElement={<Link to="/" />}
      />
    </IconMenu>
  );

  const itemsForGuestUsers = options => (
    <IconMenu {...options}>
      <MenuItem
        primaryText="Login"
        containerElement={<Link to="/login" />}
      />
      <MenuItem
        primaryText="Sign up"
        containerElement={<Link to="/signup" />}
      />
    </IconMenu>
  );

  return (
    <div className='menu'>
      {(
        isLoggedIn ?
          itemsForLoggedInUsers(iconMenuOptions) :
          itemsForGuestUsers(iconMenuOptions)
      )}
    </div>
  );
};

NavMenuIcon.propTypes = {
  isLoggedIn: React.PropTypes.bool,
  logOut: React.PropTypes.func,
};

export default NavMenuIcon;
