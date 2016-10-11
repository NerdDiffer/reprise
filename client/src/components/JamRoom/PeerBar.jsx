import React from 'react';
import PeerBubble from './PeerBubble';
import { generateRange } from '../../utils/helperFunctions';

const PeerBar = ({ peers, toggleInviteView, toggleSelectView, extraInstruments }) => {
  const renderPeers = () => {
    return peers.map((peer, index) => (
      <div key={peer.peerId}>
        <PeerBubble
          extraInstruments={extraInstruments}
          peer={peer}
          handleClick={toggleSelectView}
          self={index === 0}
        />
      </div>
    ))
  };

  const renderInvitations = () => {
    // TODO: hard-code a `MAX_PEERS` constant (where value is 4) somewhere far
    // up the module/component hierarchy.
    const range = generateRange(4 - peers.length);

    return range.map(index => (
      <div key={index}>
        <PeerBubble peer={{}} handleClick={toggleInviteView} />
      </div>
    ));
  };

  return (
    <div className="peer-bar">
      {renderPeers()}
      {renderInvitations()}
    </div>
  );
};

PeerBar.propTypes = {
  peers: React.PropTypes.array.isRequired,
  toggleInviteView: React.PropTypes.func.isRequired,
  toggleSelectView: React.PropTypes.func.isRequired,
  extraInstruments: React.PropTypes.array
};

export default PeerBar;
