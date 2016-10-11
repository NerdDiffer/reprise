import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';

const styles = {
  main: {
    width: '80%',
    position: 'relative',
    margin: '0 auto',
    textAlign: 'center',
  },
  radioButton: {
    group: { width: '50%', margin: '0 auto', display: 'flex' },
    button: { width: '45%', margin: '0 auto', marginBottom: 16 }
  }
};

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createRoomVal: '',
      createPrivRoomVal: '',
      showValidateError: false,
      togglePrivateRoom: false,
      radioButtonVal: 'public',
      showMustBeLoggedIn: false,
      openPrivRoomMenu: false,
      anchorEl: null
    };

    // Create room form logic
    this.handleCreateRoomSubmit = this.handleCreateRoomSubmit.bind(this);
    this.handleCreateRoomChange = this.handleCreateRoomChange.bind(this);
    this.handleCreatePrivateRoomSubmit = this.handleCreatePrivateRoomSubmit.bind(this);
    this.handleCreatePrivateRoomChange = this.handleCreatePrivateRoomChange.bind(this);
    this.handleSendToPrivRoom = this.handleSendToPrivRoom.bind(this);

    // Toggle create public/private rooms
    this.handlePrivateRoomToggle = this.handlePrivateRoomToggle.bind(this);

    // Material UI popover logic
    this.handleTapPrivRoom = this.handleTapPrivRoom.bind(this);
    this.handleTapPrivRoomClose = this.handleTapPrivRoomClose.bind(this);

    // Error message handlers
    this.handleCloseMustBeLoggedIn = this.handleCloseMustBeLoggedIn.bind(this);
    this.checkErrorStates = this.checkErrorStates.bind(this);
  }

  handleCreateRoomSubmit(e) {
    e.preventDefault();

    let roomName;
    if (this.state.showValidateError) {
      return;
    }

    if (this.state.createRoomVal === '') {
      roomName = shortid.generate();
    } else {
      roomName = this.state.createRoomVal;
    }

    const data = {
      roomId: roomName,
      isPrivate: false,
    };

    this.props.socket.emit('create room', data);
  }

  // match nothing: ^(?![\s\S])
  handleCreateRoomChange(e) {
    if (e.target.value.match(/[^a-zA-Z1-9]+/g)) {
      this.setState({
        showValidateError: true,
        createRoomVal: e.target.value,
      });
    } else if (this.state.showValidateError && e.target.value.match(/[^a-zA-Z1-9]+/g) === null) {
      this.setState({
        createRoomVal: e.target.value,
        showValidateError: false,
      });
    } else {
      this.setState({
        createRoomVal: e.target.value,
      });
    }
  }

  handleCreatePrivateRoomSubmit(e) {
    e.preventDefault();

    if (this.state.showValidateError) {
      return;
    }

    let roomName;

    if (this.state.createPrivRoomVal !== '') {
      roomName = `${shortid.generate()}-${this.state.createPrivRoomVal}`;
    } else {
      roomName = `${shortid.generate()}-${shortid.generate()}`;
    }

    // send server the roomname.  Username is taken from session
    createPrivateRoom({ name: roomName })
      .then(res => {
        const data = {
          roomId: roomName,
          isPrivate: true
        };
        this.props.socket.emit('create room', data);
      })
      .catch(err => {
        // console.log('Error in creating private room', err);
      });
  }

  handleCreatePrivateRoomChange(e) {
    if (e.target.value.match(/[^a-zA-Z1-9]+/g)) {
      this.setState({
        showValidateError: true,
        createPrivRoomVal: e.target.value,
      });
    } else if (this.state.showValidateError && e.target.value.match(/[^a-zA-Z1-9]+/g) === null) {
      this.setState({
        createPrivRoomVal: e.target.value,
        showValidateError: false,
      });
    } else {
      this.setState({
        createPrivRoomVal: e.target.value,
      });
    }
  }

  checkErrorStates() {
    if (this.state.showValidateError) {
      return 'Room names can only contain letters or numbers';
    } else if (this.props.showRoomTakenMessage) {
      return 'Room name is taken';
    } else {
      return false;
    }
  }

  handleSendToPrivRoom(e, menuItem, index) {
    e.preventDefault();

    const data = {
      roomId: this.props.privateRooms[index],
      // userName: this.props.user,
      isPrivate: true,
    };

    // const roomName = this.state.privateRooms[index];
    this.props.socket.emit('create room', data);
  }

  handlePrivateRoomToggle(e, value) {
    e.preventDefault();

    if (value === 'private' && !this.props.loggedIn) {
      this.setState({
        togglePrivateRoom: false,
        radioButtonVal: 'public',
        showMustBeLoggedIn: true,
      });
    } else if (value === 'public') {
      this.setState({
        togglePrivateRoom: false,
        radioButtonVal: 'public',
      });
    } else {
      this.setState({
        togglePrivateRoom: true,
        radioButtonVal: 'private',
      });
    }
  }

  handleCloseMustBeLoggedIn() {
    this.setState({
      showMustBeLoggedIn: false,
    });
  }

  handleTapPrivRoom(e) {
    e.preventDefault();
    this.setState({
      openPrivRoomMenu: true,
      anchorEl: e.currentTarget,
    });
  }

  handleTapPrivRoomClose() {
    this.setState({
      openPrivRoomMenu: false,
    });
  }

  render() {
    const renderCreateRoom = privateRoom => {
      if (privateRoom) {
        return (
          <div className="create-private-room" style={{ margin: '1% auto' }}>
            <form onSubmit={this.handleCreatePrivateRoomSubmit}>
              <TextField
                hintText="Enter a Private Room Name..."
                onChange={this.handleCreatePrivateRoomChange}
                errorText={this.checkErrorStates()}
              />
              <RaisedButton
                onClick={this.handleCreatePrivateRoomSubmit}
                label="Create Private Room"
              />
            </form>
          </div>
        );
      } else {
        return (
          <div className="create-public-room" style={{ margin: '1% auto' }}>
            <form onSubmit={this.handleCreateRoomSubmit}>
              <TextField
                hintText="Enter a Room Name..."
                onChange={this.handleCreateRoomChange}
                errorText={this.checkErrorStates()}
              />
              <RaisedButton
                onClick={this.handleCreateRoomSubmit}
                label="Create Public Room"
              />
            </form>
          </div>
        );
      }
    };

    const renderRoomDescription = privateRoom => {
      if (privateRoom) {
        return (
          <div>
            Noone will be able to join this room unless you give them the link personally.
            We will store the url created for you and you can reuse the room as long as you are signed in.
            Name it anything you want!
          </div>
        );
      } else {
        return (
          <div>
            This room is open to the public for anyone to join.
            It will be displayed in the open room table below.
            If you can't think of a good room name,
            just click "Create Room broh" and we will provide you with a random room name.
          </div>
        );
      }
    };

    const renderPrivateRoomsList = () => {
      const listOfRooms = this.props.privateRooms.map((room, key) => (
        <MenuItem
          value={room.slice(9)}
          primaryText={room.slice(9)}
          key={key}
        />
      ));

      return (
        <div className="old-private-rooms" style={{ margin: '2% auto' }}>
          <RaisedButton
            onTouchTap={this.handleTapPrivRoom}
            label="Click to view your old private rooms"
          />
          <Popover
            open={this.state.openPrivRoomMenu}
            anchorEl={this.state.anchorEl}
            anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
            targetOrigin={{ horizontal: 'left', vertical: 'top' }}
            onRequestClose={this.handleTapPrivRoomClose}
          >
            <Menu onItemTouchTap={this.handleSendToPrivRoom}>
              {listOfRooms}
            </Menu>
          </Popover>
        </div>
      );
    };

    const renderDialog = () => (
      <Dialog
        title="You must be logged in to use this feature!"
        open={this.state.showMustBeLoggedIn}
        onRequestClose={this.handleCloseMustBeLoggedIn}
      >
        Click outside the box to close thise window or click here to go to login page
        <RaisedButton
          onClick={this.props.navigateToLogin}
          label="Login"
        />
      </Dialog>
    );

    return(
      <div
        id="create-room-view"
        style={styles.main}
      >
        {renderCreateRoom(this.state.togglePrivateRoom)}
        <RadioButtonGroup
          name="shipSpeed"
          onChange={this.handlePrivateRoomToggle}
          style={styles.radioButton.group}
          valueSelected={this.state.radioButtonVal}
        >
          <RadioButton
            value="public"
            label="Public"
            style={styles.radioButton.button}
          />
          <RadioButton
            value="private"
            label="Private"
            style={styles.radioButton.button}
          />
        </RadioButtonGroup>
        {renderRoomDescription(this.state.togglePrivateRoom)}
        {this.props.loggedIn ? renderPrivateRoomsList() : null}
        {this.state.showMustBeLoggedIn ? renderDialog() : null}
      </div>
    );
  }
}

CreateRoom.propTypes = {
  socket: React.PropTypes.object.isRequired,
  loggedIn: React.PropTypes.bool.isRequired,
  privateRooms: React.PropTypes.array.isRequired,
  showRoomTakenMessage: React.PropTypes.bool.isRequired,
  navigateToLogin: React.PropTypes.func.isRequired
};

export default CreateRoom;
