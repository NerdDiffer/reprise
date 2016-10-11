// Modules
import React from 'react';
import { MembraneSynth } from "tone";
import $ from 'jquery';
// Components
import SelectInstrument from './SelectInstrument';
import JamRoom from './JamRoom';
import Help from './Help';

// Util
import connectionManager from '../rtc';
import { store, instruments } from '../instruments/store';
import { mapKeysToIds, mapPianoKeysToIds, mapBlackPianoKeysToIds, envelopeValue } from '../utils/helperFunctions';

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      connected: connectionManager.isConnected(),
      instrument: instruments[0],
      mapping: [],
      startJam: false,
      peers: [],
      showPopover: false
    };

    this.updateConnection = this.updateConnection.bind(this);
    this.handleKeypress = this.handleKeypress.bind(this);
    this.handleStart = this.handleStart.bind(this);
    this.handlePeerInfo = this.handlePeerInfo.bind(this);
    this.handleHelp = this.handleHelp.bind(this);
    this._setMapping = this._setMapping.bind(this);
    this._setInstrument = this._setInstrument.bind(this);
    this.selectInstrument = this.selectInstrument.bind(this);
  }

  componentDidMount() {
    connectionManager.setup(this.props.params.roomId);
    connectionManager.onStatusChange(this.updateConnection);
    // this will update uniue user instruments with those made in the same session.
    // event listener for keypress
    window.addEventListener('keypress', this.handleKeypress);
    this.props.socket.emit('add as listener', this.props.params.roomId);
  }

  componentWillUnmount() {
    connectionManager.offStatusChange(this.updateConnection);
    window.removeEventListener('keypress', this.handleKeypress);
    connectionManager.closeConnection();
    this.props.socket.removeListener('receive peer info', this.handlePeerInfo);
  }

  setSocketListeners() {
    this.props.socket.on('invalid room', () => {
      this.context.router.push('/invalid');
    });

    connectionManager.peerSocket().on('remove connection', id => {
      const dummyArr = this.state.peers.slice();
      for (let i = 0; i < dummyArr.length; i++) {
        if (dummyArr[i].peerId === id) {
          dummyArr.splice(i, 1);
          break;
        }
      }
      this.setState({
        peers: dummyArr,
      });
    });
  }

  handleKeypress(e) {
    if (store[this.state.instrument]) {
      // console.log('e.key', e.key);
      store[this.state.instrument](e.key);

      const keyBlack=e.key.toUpperCase();

      if (mapPianoKeysToIds[keyBlack]) {
            $(mapPianoKeysToIds[keyBlack]).animate({
              backgroundColor: "black",
            }, 20).animate({
              backgroundColor: "white",
            }, 20);
      }

      if (mapBlackPianoKeysToIds[keyBlack]) {
            $(mapBlackPianoKeysToIds[keyBlack]).animate({
              backgroundColor: "white",
            }, 20).animate({
              backgroundColor: "black",
            }, 20);
      }


      if (this.state.startJam) {
        connectionManager.sendMessage(JSON.stringify({
          instrument: this.state.instrument,
          keyPressed: e.key,
          notesToPlay: [null, null, null],
        }));
      }
    } else {
      const instMap = this.state.mapping;
      const keyPressed = e.key.toUpperCase();
      const sequence = JSON.parse(instMap[keyPressed]);
      const note = sequence[1];
      const octave = sequence[2];
      const pd = sequence[3];
      const type = sequence[4];
      const combo = `${note}${octave}`;
      // console.log(sequence, note, octave, pd, type, combo);
      const config = {
        pitchDecay: pd||0.1,
        octaves: 7,
        oscillator: {
          type,
        },
        envelope: envelopeValue
      };
      // console.log(instMap, keyPressed, note, octave, pd, type, combo);

      const zimit = new MembraneSynth(config).toMaster();
      zimit.triggerAttackRelease(combo, '8n');
      // console.log('e info', e.which, e.key);

      const keyBlack=e.key.toUpperCase();
      $(mapKeysToIds[keyBlack]).animate({
        backgroundColor: "black",
      }, 20).animate({
        backgroundColor: "white",
      }, 20);

      if (this.state.startJam) {
        connectionManager.sendMessage(JSON.stringify({
          instrument: this.state.instrument,
          keyPressed: e.key,
          notesToPlay: [combo, pd, type],
        }));
      }
    }
  }

  handleStart() {
    this.setState({ startJam: true });
    connectionManager.onMessage(data => {
      data = JSON.parse(data);
      if (store[data.instrument]) {
        store[data.instrument](data.keyPressed);
      } else {
        const info = data.notesToPlay;
        const combo = info[0];
        const config = {
          pitchDecay: info[1]||0.1,
          octaves: 7,
          oscillator: {
            type: info[2],
          },
          envelope: envelopeValue
        };
        const zimit = new MembraneSynth(config).toMaster();
        zimit.triggerAttackRelease(combo, '8n');
      }
    });

    this.props.socket.emit('select instrument', {
      roomId: this.props.params.roomId,
      id: connectionManager.id(),
      instrument: this.state.instrument
    });
    // this.setSocketListeners();
  }

  updateConnection() {
    this.setState({ connected: connectionManager.isConnected() });

    // get instrument info of everyone in room
    this.props.socket.emit('request peer info', {
      roomId: this.props.params.roomId,
      socketId: this.props.socket.id
    });

    this.props.socket.on('receive peer info', this.handlePeerInfo);
  }

  handlePeerInfo(data) {
    data = JSON.parse(data);
    // move self to beginning of peers array
    let index = 0;
    while ((index < data.length) && (data[index].peerId !== connectionManager.id())) {
      index++;
    }
    const selfInfo = data.splice(index, 1);
    this.setState({
      peers: selfInfo.concat(data)
    });
  }

  handleHelp(event) {
    event.preventDefault();
    this.setState({
      showPopover: true,
      anchorEl: event.target
    });
  }

  _setMapping(index) {
    const mappings = this.props.extraInstruments.map(a => ({
      A: typeof a === 'string' ? JSON.parse(a.A) : a.A,
      S: typeof a === 'string' ? JSON.parse(a.S) : a.S,
      D: typeof a === 'string' ? JSON.parse(a.D) : a.D,
      F: typeof a === 'string' ? JSON.parse(a.F) : a.F,
      G: typeof a === 'string' ? JSON.parse(a.G) : a.G,
      H: typeof a === 'string' ? JSON.parse(a.H) : a.H,
      J: typeof a === 'string' ? JSON.parse(a.J) : a.J,
      K: typeof a === 'string' ? JSON.parse(a.K) : a.K,
      L: typeof a === 'string' ? JSON.parse(a.L) : a.L
    }));

    this.setState({
      mapping: mappings[index - 3]
    });
  }

  _setInstrument(index) {
    const namesOfExtraInstruments = this.props.extraInstruments.map(a => {
      const name = a.instrumentName || a.name;
      return `Your Instrument: ${name}`
    });
    const list = instruments.concat(namesOfExtraInstruments);
    const newInstrument = list[index];

    this.setState({
      instrument: newInstrument
    });
  }

  selectInstrument(index) {
    _setMapping(index);
    _setInstrument(index);

    if (this.state.connected) {
      const instrumentData = {
        roomId: this.props.params.roomId,
        id: connectionManager.id(),
        instrument: this.state.instrument
      };

      this.props.socket.emit('select instrument', instrumentData);
    }
  }

  render() {
    console.log('current instrument', this.state.instrument);

    return (
      <div>
        <Help
          handleOpen={this.handleHelp}
          showPopover={this.state.showPopover}
          anchorEl={this.state.anchorEl}
          handleClose={() => { this.setState({ showPopover: false }); }}
        />
        {
          this.state.startJam ?
            <JamRoom
              extraInstruments={this.props.userInstruments}
              instrument={this.state.instrument}
              peers={this.state.peers}
              onReselect={this.selectInstrument}
            /> :
            <SelectInstrument
              extraInstruments={this.props.userInstruments}
              size="normal"
              handleClick={this.handleStart}
              handleSelect={this.selectInstrument}
            />
        }
      </div>
    );
  }
}

Room.propTypes = {
  params: React.PropTypes.object,
  userInstruments: React.PropTypes.array,
  socket: React.PropTypes.object,
  logIn: React.PropTypes.func
};

Room.contextTypes = {
  router: React.PropTypes.object
};

export default Room;
