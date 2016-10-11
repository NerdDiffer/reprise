import React, { Component } from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';
import Dialog from 'material-ui/Dialog';

class CreateRoom extends Component {
  constructor() {

  }

  render() {
    <div
      id="create-room-view"
      style={{
        width: '80%',
        position: 'relative',
        margin: '0 auto',
        textAlign: 'center',
      }}
    >
      {
        !this.state.togglePrivateRoom
        ?
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
        :
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
      }
      <RadioButtonGroup
        name="shipSpeed"
        onChange={this.handlePrivateRoomToggle}
        style={{ width: '50%', margin: '0 auto', display: 'flex' }}
        valueSelected={this.state.radioButtonVal}
      >
        <RadioButton
          value="public"
          label="Public"
          style={{ width: '45%', margin: '0 auto', marginBottom: 16 }}
        />
        <RadioButton
          value="private"
          label="Private"
          style={{ width: '45%', margin: '0 auto', marginBottom: 16 }}
        />
      </RadioButtonGroup>
      {
        !this.state.togglePrivateRoom
        ?
          <div>
            This room is open to the public for anyone to join.
              It will be displayed in the open room table below.
              If you can't think of a good room name,
               just click "Create Room broh" and we will provide you with a random room name.
          </div>
        :
          <div>
          Noone will be able to join this room unless you give them the link personally.
            We will store the url created for you and you can reuse the room as long as you are signed in.
              Name it anything you want!
          </div>
      }
      {
        this.props.loggedIn
        ?
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
                {
                  this.state.privateRooms.map((room, key) => (
                    <MenuItem value={room.slice(9)} primaryText={room.slice(9)} key={key} />
                  ))
                }
              </Menu>
            </Popover>
          </div>
        : null
      }
      {
        this.state.showMustBeLoggedIn
        ?
          <Dialog
            title="You must be logged in to use this feature!"
            open={this.state.showMustBeLoggedIn}
            onRequestClose={this.handleCloseMustBeLoggedIn}
          >
            Click outside the box to close thise window or click here to go to login page <RaisedButton
              onClick={this.navigateToLogin}
              label="Login"
            />
          </Dialog>
        :
          null
      }
    </div>
  }
}

export default CreateRoom;
