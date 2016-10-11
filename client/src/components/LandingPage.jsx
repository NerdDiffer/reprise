import React from 'react';
import { Link } from 'react-router';

// material ui components
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

const buttonStyles = {
  color: '#6F8695',
  width: 120,
  height: 30,
  position: 'absolute',
  top: '50%',
  transform: 'translate(-50%, -50%)'
};

const paperStyle = {
  position: 'absolute',
  left: '50%',
  height: '40%',
  width: '40%',
  transform: 'translate(-50%, 40%)',
  backgroundColor: 'rgba(68, 69, 69, 0.7)',
  borderRadius: 10
};

const LandingPage = () => (
  <div id="landingPage">
    <Paper style={paperStyle} zDepth={3}>
      <div className="greeting">Welcome to Jam with Friends!</div>
      <section className="divider">
        <Divider />
      </section>
      <section className="createRoom">
        <Link to="/green-room">
          <RaisedButton
            label="Start"
            style={buttonStyles}
            labelStyle={{ fontSize: 22 }}
          />
        </Link>
      </section>
    </Paper>
  </div>
);

LandingPage.propTypes = {
  socket: React.PropTypes.object
};

export default LandingPage;
