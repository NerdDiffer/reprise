import React, { Component } from 'react';
import shortid from 'shortid';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import { listPrivateRooms, createPrivateRoom } from '../../utils/api';

class GreenRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      createRoomVal: '',
      createPrivRoomVal: '',
      showValidateError: false,
      showRoomTakenMessage: false,
      rooms: [],
      privateRooms: [],
      openPrivRoomMenu: false,
      togglePrivateRoom: false,
      radioButtonVal: 'public',
      showMustBeLoggedIn: false,
    };
    // Create room form logic
    this.handleCreateRoomSubmit = this.handleCreateRoomSubmit.bind(this);
    this.handleCreateRoomChange = this.handleCreateRoomChange.bind(this);
    this.handleCreatePrivateRoomSubmit = this.handleCreatePrivateRoomSubmit.bind(this);
    this.handleCreatePrivateRoomChange = this.handleCreatePrivateRoomChange.bind(this);
    this.showRoomTakenErrorMessage = this.showRoomTakenErrorMessage.bind(this);
    // Create a private room
    this.handleSendToPrivRoom = this.handleSendToPrivRoom.bind(this);
    // Toggle create public/private rooms
    this.handlePrivateRoomToggle = this.handlePrivateRoomToggle.bind(this);

    // Join a room on click
    this.handleRowClick = this.handleRowClick.bind(this);

    // Needed to remove socket event listeners
    this.updateRooms = this.updateRooms.bind(this);
    this.checkErrorStates = this.checkErrorStates.bind(this);

    // Material UI popover logic
    this.handleTapPrivRoom = this.handleTapPrivRoom.bind(this);
    this.handleTapPrivRoomClose = this.handleTapPrivRoomClose.bind(this);

    // Error for not logged in
    this.handleCloseMustBeLoggedIn = this.handleCloseMustBeLoggedIn.bind(this);
    // navigate to login from error dialogue
    this.navigateToLogin = this.navigateToLogin.bind(this);
  }

  componentDidMount() {
    this.props.socket.on('room created', (roomName) => {
      this.context.router.push(`/room/${roomName}`);
    });

    this.props.socket.on('room name taken', this.showRoomTakenErrorMessage);

    // on refresh, componentDidMount may fire before socket has connected to server
    // resulting in an undefined socket.id and bug where the information needed for
    // the open room table is not loaded.  Fixed by checking for socket.id and waiting
    // for connection if socket.id is undefined
    if (this.props.socket.id) {
      this.props.socket.emit('get rooms info', this.props.socket.id);
    } else {
      this.props.socket.on('connected', () => this.props.socket.emit('get rooms info', this.props.socket.id));
    }

    this.props.socket.on('give rooms info', this.updateRooms);

    // get private rooms from server/db if user is logged in
    if (this.props.loggedIn) {
      listPrivateRooms()
        .then(data => {
          const privateRooms = data[0] === null ? [] : data;
          this.setState({ privateRooms });
        });
    }
  }

  componentWillUnmount() {
    this.props.socket.removeListener('room name taken', this.showErrorMessage);
    this.props.socket.removeListener('give rooms info', this.updateRooms);
  }

  showRoomTakenErrorMessage() {
    this.setState({
      showRoomTakenMessage: true,
    });

    setTimeout(() => {
      this.setState({
        showRoomTakenMessage: false,
      });
    }, 5000);
  }

  updateRooms(rooms) {
    this.setState({
      rooms,
    });
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

  handleRowClick(rowNum, colNum) {
    // fix to check if room is full first
    this.context.router.push(`/room/${this.state.rooms[rowNum].roomName}`);
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

  checkErrorStates() {
    if (this.state.showValidateError) {
      return 'Room names can only contain letters or numbers';
    } else if (this.state.showRoomTakenMessage) {
      return 'Room name is taken';
    } else {
      return false;
    }
  }

  handleSendToPrivRoom(e, menuItem, index) {
    e.preventDefault();

    const data = {
      roomId: this.state.privateRooms[index],
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

  navigateToLogin() {
    this.context.router.push('/login');
  }

  render() {
    return (
      <div className="lobby-container">
        <Paper
          style={{
            width: '70%',
            margin: '0 auto',
            height: '100%',
          }}
          zDepth={3}
        >
          <div className="greeting">
            Green Room
          </div>
          <section className="divider green-room-divider">
            <Divider />
          </section>
          <CreateRoom />
          <JoinRoom
            rooms={this.state.rooms}
            handleRowClick={this.handleRowClick}
          />
        </Paper>
      </div>
    );
  }
}

GreenRoom.propTypes = {
  socket: React.PropTypes.object,
  loggedIn: React.PropTypes.bool,
  userInstruments: React.PropTypes.array,
};

GreenRoom.contextTypes = {
  router: React.PropTypes.object
};

export default GreenRoom;
