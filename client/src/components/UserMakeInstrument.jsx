// Tones
import React, { Component } from 'react';
import { MembraneSynth } from "tone";
// Components
import TextField from 'material-ui/TextField';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import UserOwnInstrument from './UserOwnInstrument';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';

// Utils
import { showErrorMessage, mapIdsToKeys, mapKeysToIds, envelopeValue } from '../utils/helperFunctions';

class UserMakeInstrument extends Component {

  constructor(props) {
    super(props);
    this.handleNoteChange=this.handleNoteChange.bind(this);
    this.handleKeyChange=this.handleKeyChange.bind(this);
    this.handleOctaveChange=this.handleOctaveChange.bind(this);
    this.handlePDChange=this.handlePDChange.bind(this);
    this.handleTypeChange=this.handleTypeChange.bind(this);
    this.deleteKey = this.deleteKey.bind(this);
    this.mapThat = this.mapThat.bind(this);
    this.changeInst = this.changeInst.bind(this);
    this.killKeypress = this.killKeypress.bind(this);
    this.addKeypress = this.addKeypress.bind(this);
    this.logIn = this.props.logIn.bind(this);
    this.makeInstrument = this.makeInstrument.bind(this);
    this.state = {
      noteValue: "A",
      keyValue: "A",
      octaveValue: 1,
      PDValue: 0.1,
      typeValue: "sine",
      inMemObject: {},
      instrument: "MembraneSynth",
      tryingToName: true,

    };
  }


  componentDidMount() {
    $('.sampleSound').click(() => {
      this.sampleSound();
    });

    $.get("/api/misc/getUserInfo", (resp, err) => {
      if (resp[0] === null) {
        console.log('youre not logged in!');
        this.context.router.push("login");
      }
    });
  }

  componentWillUnmount() {
    $(document).off();
  }

  keyHelper(ID) {
    const keyMapped = this.state.inMemObject[mapIdsToKeys[ID]];
    if (!this.state.tryingToName && keyMapped) {
      const keyInfo = JSON.parse(keyMapped);
      this.setState({
        noteValue: keyInfo[1],
        octaveValue: keyInfo[2],
        PDValue: keyInfo[3],
        typeValue: keyInfo[4],
      });

      this.sampleSound();

      $(ID).animate({
        backgroundColor: "black",
      }, 20).animate({
        backgroundColor: "white",
      }, 20);
    }
  }

  sampleSound() {
    const par1 = this.state.noteValue;
    const par2 = this.state.octaveValue;
    const par3 = this.state.PDValue;
    const par4 = this.state.typeValue;
    const combo = `${par1}${par2}`;
    const config = {
      pitchDecay: par3||0.1,
      octaves: 7,
      oscillator: {
        type: par4,
      },
      envelope: envelopeValue
    };
    const zimit = new MembraneSynth(config).toMaster();
    zimit.triggerAttackRelease(combo, '8n');
  }

  mapThat() {
    const par1 = this.state.noteValue;
    const par2 = this.state.octaveValue;
    const par3 = this.state.PDValue;
    const par4 = this.state.typeValue;
    const key = this.state.keyValue;
    const inst = "N/A";
    const currentInMemObj = this.state.inMemObject;
    currentInMemObj[key] = JSON.stringify([inst, par1, par2, par3, par4]);
    if (!par1&&!par2&&!par3&&!par4) {
      showErrorMessage("#makeInstErrorMessages", 'Please make a Proper Mapping', 'propMapError');
    } else {
      this.setState({
        noteValue: "A",
        octaveValue: 1,
        PDValue: 0.1,
        typeValue: "sine",
        inMemObject: currentInMemObj
      });
      console.log(currentInMemObj);
      const idToAdd = mapKeysToIds[key];
      $(idToAdd).css("border", "5px solid blue");
    }
  }


  makeInstrument() {
    const name = this.refs.instName.getValue();
    const currentInMemObj = this.state.inMemObject;
    currentInMemObj.name = name;
    currentInMemObj.userName = this.props.user;
    let empty = true;

    const keys = Object.keys(currentInMemObj);
    for (let i = 0; i < keys.length; i++) {
      if (keys[i].length === 1) {
        empty = false;
      }
    }
    // in case something breaks --- this was refactored into the above for loop:

    // for (const key in currentInMemObj) {
    //   if (key.length === 1) {
    //     empty = false;
    //   }
    // }
    if (name.length === 0) {
      showErrorMessage("#nameInstErrMessage", 'Pls name your instrument', 'npo');
    } else if (empty) {
      showErrorMessage("#nameInstErrMessage", 'Pls map some keys', 'npi');
    } else if (/\W/.test(name)===true) {
      showErrorMessage("#nameInstErrMessage", 'Letters and numbers only please!', 'regexErr');
    } else {
      this.setState({
        inMemObject: {}
      });
      empty = true;
      this.props.socket.emit('newInstCreated', currentInMemObj);
      console.log(`youve created ${currentInMemObj}`);
      const final = this.props.userInstruments.concat([currentInMemObj]);
      this.props.updateUserInstrument(final);
      showErrorMessage("#makeInstErrorMessages", 'InstrumentMade!', 'makeThat');
      $("#par1").val("A");
      $("#par2").val("1");
      $("#par3").val("0.1");
      $("#par4").val("sine");
      $(".key").css("border", "2px solid black");
    }
  }

  deleteKey() {
    const keyToDelete = this.state.keyValue;
    const newInMemObj = this.state.inMemObject;
    delete newInMemObj[keyToDelete];
    this.setState({
      inMemObject: newInMemObj,
    });

    const idToClear = mapKeysToIds[keyToDelete];
    $(idToClear).css("border", "2px solid black");
  }

  handleNoteChange(event, index, value) {
    this.setState({ noteValue: value });
  }
  handleKeyChange(event, index, value) {
    this.setState({ keyValue: value });
  }

  handleOctaveChange(event, index, value) {
    this.setState({ octaveValue: value });
  }
  handleTypeChange(event, index, value) {
    this.setState({ typeValue: value });
  }

  handlePDChange(event, index, value) {
    this.setState({ PDValue: value });
  }

  killKeypress() {
    $(document).off();
    $(document).off("keypress");
    this.setState({
      tryingToName: true,
    });
  }

  addKeypress() {
    if (this.state.tryingToName) {
      $(document).keypress((e) => {
        if (e.which === 97) {
          this.keyHelper("#1");
        } else if (e.which === 115) {
          this.keyHelper("#2");
        } else if (e.which === 100) {
          this.keyHelper("#3");
        } else if (e.which === 102) {
          this.keyHelper("#4");
        } else if (e.which === 103) {
          this.keyHelper("#5");
        } else if (e.which === 104) {
          this.keyHelper("#6");
        } else if (e.which === 106) {
          this.keyHelper("#7");
        } else if (e.which === 107) {
          this.keyHelper("#8");
        } else if (e.which === 108) {
          this.keyHelper("#9");
        }
      });
      this.setState({
        tryingToName: false,
      });
    }
  }

  changeInst() {
    $(".par").val("");
    const inst = $(".selectInst option:selected").text();
    this.setState({
      instrument: inst
    });
  }

  render() {
    const keys =["A", "S", "D", "F", "G", "H", "J", "K", "L"];
    const octaves = [1, 2, 3, 4, 5, 6, 7];
    return (
      <div id='roomContainer'>
      <div id="UserMakeInstrumentRoom">
      <Paper
          style={{
            width: '70%',
            margin: '0 auto',
            height: '100%',
          }}
          zDepth={3}
        >

        <h1>Make Instrument Here!</h1>
        <div id="currentInst" />
        <div className="selectKey" id="selectKeys_${id}">
          <h2>Step One: Select a Key To Map To </h2>
          <DropDownMenu
            value={this.state.keyValue}
            onChange={this.handleKeyChange}
            autoWidth={false}
          >
            <MenuItem value={"A"} primaryText="A" />
            <MenuItem value={"S"} primaryText="S" />
            <MenuItem value={"D"} primaryText="D" />
            <MenuItem value={"F"} primaryText="F" />
            <MenuItem value={"G"} primaryText="G" />
            <MenuItem value={"H"} primaryText="H" />
            <MenuItem value={"J"} primaryText="J" />
            <MenuItem value={"K"} primaryText="K" />
            <MenuItem value={"L"} primaryText="L" />
          </DropDownMenu>
        </div>
        <div id="deleteKey"> <RaisedButton label="Delete Key Mapping" onClick={this.deleteKey} /></div>
        <h2>Step Two: Set Your Parameters</h2>

        Note
        <DropDownMenu
          value={this.state.noteValue}
          onChange={this.handleNoteChange}
          autoWidth={false}
        >
          <MenuItem value={"A"} primaryText="A" />
          <MenuItem value={"B"} primaryText="B" />
          <MenuItem value={"C"} primaryText="C" />
          <MenuItem value={"D"} primaryText="D" />
          <MenuItem value={"E"} primaryText="E" />
          <MenuItem value={"F"} primaryText="F" />
          <MenuItem value={"G"} primaryText="G" />
        </DropDownMenu>


        Octave
        <DropDownMenu
          value={this.state.octaveValue}
          onChange={this.handleOctaveChange}
          autoWidth={false}
        >
          <MenuItem value={1} primaryText="1" />
          <MenuItem value={2} primaryText="2" />
          <MenuItem value={3} primaryText="3" />
          <MenuItem value={4} primaryText="4" />
          <MenuItem value={5} primaryText="5" />
          <MenuItem value={6} primaryText="6" />
          <MenuItem value={7} primaryText="7" />

        </DropDownMenu>

        Pitch Decay
        <DropDownMenu
          value={this.state.PDValue}
          onChange={this.handlePDChange}
          autoWidth={false}
        >
          <MenuItem value={0.1} primaryText="0.1" />
          <MenuItem value={0.2} primaryText="0.2" />
          <MenuItem value={0.3} primaryText="0.3" />
          <MenuItem value={0.4} primaryText="0.4" />
          <MenuItem value={0.5} primaryText="0.5" />
          <MenuItem value={0.6} primaryText="0.6" />
          <MenuItem value={0.7} primaryText="0.7" />
        </DropDownMenu>

        Sound Type
        <DropDownMenu
          value={this.state.typeValue}
          onChange={this.handleTypeChange}
          autoWidth={false}
        >
          <MenuItem value={"sine"} primaryText="sine" />
          <MenuItem value={"square"} primaryText="square" />
          <MenuItem value={"sawtooth"} primaryText="sawtooth" />
          <MenuItem value={"triangle"} primaryText="triangle" />
        </DropDownMenu> <br /><br />
        <text id="step3">Step Three: </text>
        <RaisedButton label="Map Sound to Key" onClick={this.mapThat} /><br />
        <TextField
          onClick={this.killKeypress}
          ref={"instName"}
          hintText="Only Letters and Numbers Please"
          floatingLabelText="Name your Instrument"
        />
        <br />
        <div id="nameInstErrMessage" />
        <RaisedButton label="Make the instrument broh" style={{ postion: "absolute", top: "50%" }} onClick={this.makeInstrument} /><br />
        <h2>Click your instrument to play!</h2>
        <div id="testPiano" onClick={this.addKeypress} >
          <UserOwnInstrument />
        </div>
        <div id="makeInstErrorMessages" />
      </Paper>
      </div>
      </div>
    );
  }
}

UserMakeInstrument.propTypes = {
  params: React.PropTypes.object,
  socket: React.PropTypes.object,
  userInstruments: React.PropTypes.array,
  logIn: React.PropTypes.func,
  updateUserInstrument: React.PropTypes.func,
  user: React.PropTypes.string,
};

UserMakeInstrument.contextTypes = {
  router: React.PropTypes.object
};


UserMakeInstrument.childContextTypes = {
  muiTheme: React.PropTypes.object.isRequired,
};
export default UserMakeInstrument;
