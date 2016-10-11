const SocketServer = require('socket.io');
const shortid = require('shortid');
const { Instrument } = require('../db/models');

const io = new SocketServer();

// rooms for peer connection sockets
const rooms = {};
// keep track of private rooms
const privRooms = {};
// map actual rooms to another room which contains peer info sockets
const listenerRooms = {};

io.on('connection', socket => {
  io.to(socket.id).emit('connected');

  socket.on('create room', data => {
    const roomId = data.roomId;
    const isPrivate = data.isPrivate || false;
    // const socketId = socket.id;
    if (rooms[roomId]) {
      io.to(socket.id).emit('room name taken');
    } else {
      rooms[roomId] = [];
      if (isPrivate) {
        // value as username?
        privRooms[roomId] = true;
      }
      io.to(socket.id).emit('room created', roomId);
    }
  });

  socket.on('join', roomId => {
    // does room exist?
    if (!rooms[roomId]) {
      io.to(socket.id).emit('invalid room');
    // is room full?
    } else if (rooms[roomId].length >= 4) {
      socket.emit('full', roomId);
    } else {
      socket.join(roomId);
      rooms[roomId].push({ peerId: socket.id.slice(2), instrument: 'piano' });

      // update open rooms table
      io.emit('give rooms info', getRoomsInfo(rooms));

      // emit message to socket which just joined
      io.to(socket.id).emit('joined', JSON.stringify(rooms[roomId]));
      // emit message to other sockets in room
      socket.broadcast.to(roomId).emit('new peer');

      socket.on('disconnect', () => {
        const socketsInRoom = rooms[roomId];
        const id = socket.id.slice(2);
        // check to make sure peer is in room and get index of peer
        for (let i = 0; i < socketsInRoom.length; i++) {
          if (socketsInRoom[i].peerId === id) {
            socketsInRoom.splice(i, 1);
            socket.leave(roomId);
            socket.broadcast.to(roomId).emit('remove connection', id);

            if (socketsInRoom.length === 0) {
              delete rooms[roomId];
              delete listenerRooms[roomId];
              delete privRooms[roomId];
            } else {
              // give updated list of peer info
              io.to(listenerRooms[roomId]).emit('receive peer info', JSON.stringify(rooms[roomId]));
            }
            // update open rooms table
            io.emit('give rooms info', getRoomsInfo(rooms));

            break;
          }
        }
      });
    }
  });

  socket.on('exit room', data => {
    const room = rooms[data.roomId];
    if (room !== undefined) {
      // check to make sure peer is in room and get index of peer
      for (let i = 0; i < room.length; i++) {
        if (room[i].peerId === data.id) {
          room.splice(i, 1);
          socket.leave(data.roomId);
          socket.broadcast.to(data.roomId).emit('remove connection', data.id);

          // delete room if empty
          if (room.length === 0) {
            delete rooms[data.roomId];
            delete listenerRooms[data.roomId];
            delete privRooms[data.roomId];
          } else {
            // give updated list of peer info
            io.to(listenerRooms[data.roomId]).emit('receive peer info', JSON.stringify(room));
          }
          // update open rooms table
          io.emit('give rooms info', getRoomsInfo(rooms));

          // disconnect socket, client will create new socket when it starts
          // peer connection process again
          socket.disconnect(0);
          break;
        }
      }
    }
  });

  socket.on('offer', offer => {
    io.to(`/#${offer.to}`).emit('offer', offer);
  });

  socket.on('answer', answer => {
    io.to(`/#${answer.to}`).emit('answer', answer);
  });

  socket.on('get rooms info', id => {
    // send info to populate creaorjoin open room table
    io.to(`/#${id}`).emit('give rooms info', getRoomsInfo(rooms));
  });

  // add this socket as listener to a room mapped from client room
  // need to do this because using a different socket from one used
  // to establish rtc connections
  socket.on('add as listener', room => {
    listenerRooms[room] = listenerRooms[room] || shortid.generate();
    socket.join(listenerRooms[room]);
  });

  socket.on('select instrument', data => {
    const room = rooms[data.roomId];
    // update instrument of user
    for (let i = 0; i < room.length; i++) {
      if (room[i].peerId === data.id) {
        room[i].instrument = data.instrument;
        const updateRoom = JSON.stringify(room);

        // send out updated info of user instruments
        io.to(listenerRooms[data.roomId]).emit('receive peer info', updateRoom);

        // update open rooms table
        io.emit('give rooms info', getRoomsInfo(rooms));
        break;
      }
    }
  });

  socket.on('request peer info', data => {
    io.to(`/#${data.socketId}`).emit('receive peer info', JSON.stringify(rooms[data.roomId]));
  });

  function getRoomsInfo(roomObj) {
    const roomNames = Object.keys(roomObj);
    const container = [];
    for (let i = 0; i < roomNames.length; i++) {
      if (!privRooms[roomNames[i]]) {
        container.push({
          roomName: roomNames[i],
          numPeople: roomObj[roomNames[i]].length,
          instruments: roomObj[roomNames[i]].map(peer => peer.instrument),
        });
      }
    }
    return container;
  }
});

module.exports = io;
