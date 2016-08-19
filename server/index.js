/* Requires */
const express = require('express');
const path = require('path');
const logger = require('morgan');
const http = require('http');
const socketIO = require('socket.io');

/* Init */
const app = express();
const server = http.createServer(app);
const io = socketIO.listen(server);

/* Middleware */

app.use(logger('dev'));

const pathToStaticDir = path.resolve(__dirname, '..', 'client/public');
app.use(express.static(pathToStaticDir));

/* Sockets */

const rooms = {};

io.on('connection', socket => {
  console.log('Socket connected with ID: ', socket.id);

  socket.on('create room', roomId => {
    if (rooms[roomId]) {
      io.to(socket.id).emit('room name taken');
    } else {
      rooms[roomId] = [];
      io.to(socket.id).emit('room created', roomId);
      // socket.emit('give rooms', rooms);
    }
  });

  socket.on('join', room => {
    console.log(socket.id, 'joining', room);
    // does room exist?
    if (!rooms[room]) {
      io.to(socket.id).emit('invalid room');
    // is room full?
    } else if (rooms[room].length >= 4) {
      socket.emit('full', room);
    } else {
      socket.join(room);
      rooms[room].push({ peerId: socket.id.slice(2), instrument: undefined });
      console.log('room is', rooms[room]);
      // update creaorjoin open room table
      io.emit('give rooms info', getRoomsInfo(rooms));
      // emit message to socket which just joined
      io.to(socket.id).emit('joined', rooms[room]);
      // emit message to other sockets in room
      socket.broadcast.to(room).emit('new peer');
      // socket.emit('give rooms', rooms);
      socket.on('disconnect', () => {
        const socketsInRoom = rooms[room];
        const id = socket.id.slice(2);
        let inRoom = false;
        let index;
        // check to make sure peer is in room and get index of peer
        for (let i = 0; i < socketsInRoom.length; i++) {
          if (socketsInRoom[i].peerId === id) {
            inRoom = true;
            index = i;
            break;
          }
        }
        if (inRoom) {
          console.log('disconnect', id);
          socketsInRoom.splice(index, 1);
          socket.leave(room);
          socket.broadcast.to(room).emit('remove connection', id);
        }
        // update creaorjoin open room table
        io.emit('give rooms info', getRoomsInfo(rooms));
      });
    }
  });

  socket.on('exit room', data => {
    const room = rooms[data.room];
    if (room !== undefined) {
      let index;
      // check to make sure peer is in room and get index of peer
      for (let i = 0; i < room.length; i++) {
        if (room[i].peerId === data.id) {
          index = i;
          break;
        }
      }
      console.log('exit room', data);
      room.splice(index, 1);
      socket.leave(data.room);
      // socket.broadcast.to(`/#${data.id}`).emit('close');
      console.log(rooms[data.room]);
      socket.broadcast.to(data.room).emit('remove connection', data.id);
      // update creaorjoin open room table
      io.emit('give rooms info', getRoomsInfo(rooms));
    }
  });

  socket.on('offer', offer => {
    io.to(`/#${offer.to}`).emit('offer', offer);
  });

  socket.on('answer', answer => {
    io.to(`/#${answer.to}`).emit('answer', answer);
  });

  socket.on('peer info', peerInfo => {
    socket.to(peerInfo.roomId).broadcast.emit('peer info', peerInfo);
  });

  socket.on('ask for peer info', info => {
    socket.to(info.roomId).broadcast.emit('ask for peer info', info);
  });

  socket.on('give peer info', info => {
    io.to(`/#${info.sendTo}`).emit('peer info', info);
  });

  socket.on('get rooms info', id => {
    // send info to populate creaorjoin open room table
    io.to(`/#${id}`).emit('give rooms info', getRoomsInfo(rooms));
  });

  socket.on('instrument select', data => {
    const room = rooms[data.roomId];
    for (let i = 0; i < room.length; i++) {
      if (room[i].peerId === data.peerId) {
        room[i].instrument = data.instrument;
        break;
      }
    }
    // update creaorjoin open room table
    io.emit('give rooms info', getRoomsInfo(rooms));
  });

  function getRoomsInfo(roomObj) {
    const roomNames = Object.keys(roomObj);
    const container = [];
    for (let i = 0; i < roomNames.length; i++) {
      container.push({
        roomName: roomNames[i],
        numPeople: roomObj[roomNames[i]].length,
        instruments: roomObj[roomNames[i]].map(peer => peer.instrument),
      });
    }
    return container;
  }
});

/* Routes */

app.get('*', (req, res) => {
  const pathToIndex = path.join(pathToStaticDir, 'index.html');
  res.status(200).sendFile(pathToIndex);
});

/* Initialize */

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Listening on port', port);
});
