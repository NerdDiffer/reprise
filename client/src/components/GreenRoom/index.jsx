import React, { Component } from 'react';
import Divider from 'material-ui/Divider';
import Paper from 'material-ui/Paper';
import CreateRoom from './CreateRoom';
import JoinRoom from './JoinRoom';
import { listPrivateRooms } from '../../utils/api';

class GreenRoom extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showRoomTakenMessage: false,
      rooms: [],
      privateRooms: [],
    };

    this.showRoomTakenErrorMessage = this.showRoomTakenErrorMessage.bind(this);
    this.updateRooms = this.updateRooms.bind(this);
    this.handleRowClick = this.handleRowClick.bind(this);
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
    this.props.socket.removeListener('room name taken', this.showRoomTakenErrorMessage);
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

  handleRowClick(rowNum, colNum) {
    // fix to check if room is full first
    this.context.router.push(`/room/${this.state.rooms[rowNum].roomName}`);
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
          <CreateRoom
            socket={this.props.socket}
            loggedIn={this.props.loggedIn}
            privateRooms={this.state.privateRooms}
            showRoomTakenMessage={this.state.showRoomTakenMessage}
            navigateToLogin={this.navigateToLogin}
          />
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
  loggedIn: React.PropTypes.bool
};

GreenRoom.contextTypes = {
  router: React.PropTypes.object
};

export default GreenRoom;
