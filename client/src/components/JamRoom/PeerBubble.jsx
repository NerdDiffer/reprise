import React from 'react';
import IconButton from 'material-ui/IconButton';
import AddCircleOutline from 'material-ui/svg-icons/content/add-circle-outline';
import { white } from 'material-ui/styles/colors';
import InstrumentIcon, { KickDrumIcon } from '../../icons';

const PeerBubble = ({ peer, handleClick, self, extraInstruments }) => {
  const styles = {
    instrumentIcon: {
      width: '100%',
      height: 80
    },
    iconButton: {
      main: {
        width: '100%',
        height: 'auto',
        padding: 25,
        position: 'absolute',
        bottom: 50,
        left: 5
      },
      icon: {
        height: 50,
        width: 50
      }
    },
    kickDrumIcon: {
      width: 200,
      height: 'auto'
    }
  };

  const renderInstrumentIcon = () => (
    <div style={{ position: 'relative' }}>
      <InstrumentIcon
        instrument={peer.instrument}
        className="jamroom-instrument"
        style={styles.instrumentIcon}
        color={white}
        onTouchTap={self ? handleClick : () => {}}
      />
      <p className="peer-name">{peer.name}</p>
    </div>
  );

  const renderIconButton = () => (
    <div>
      <p className="peer-name">Invite</p>
      <IconButton
        iconStyle={styles.iconButton.icon}
        style={styles.iconButton.main}
        onTouchTap={handleClick}
      >
        <AddCircleOutline className="circleIcon" color={white} />
      </IconButton>
    </div>
  );

  return (
    <div className="peer">
      <KickDrumIcon style={styles.kickDrumIcon} />
      {peer.instrument ? renderInstrumentIcon() : renderIconButton}
    </div>
  );
};


PeerBubble.propTypes = {
  peer: React.PropTypes.object.isRequired,
  handleClick: React.PropTypes.func.isRequired,
  self: React.PropTypes.bool,
  extraInstruments: React.PropTypes.array
};

export default PeerBubble;
