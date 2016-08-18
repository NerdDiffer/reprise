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
    rooms[roomId] = [];
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
      rooms[room].push(socket.id.slice(2));
      console.log('room is', rooms[room]);
      // emit message to socket which just joined
      io.to(socket.id).emit('joined', rooms[room]);
      // emit message to other sockets in room
      socket.broadcast.to(room).emit('new peer');

      socket.on('disconnect', () => {
        const socketsInRoom = rooms[room];
        const id = socket.id.slice(2);
        const index = socketsInRoom.indexOf(id);
        if (index > -1) {
          console.log('disconnect', id);
          socketsInRoom.splice(index, 1);
          socket.leave(room);
          socket.broadcast.to(room).emit('remove connection', id);
        }
      });
    }
  });

  socket.on('exit room', data => {
    const room = rooms[data.room];
    if (room !== undefined) {
      const index = room.indexOf(data.id);
      console.log('exit room', data);
      room.splice(index, 1);
      socket.leave(data.room);
      // socket.broadcast.to(`/#${data.id}`).emit('close');
      console.log(rooms[data.room]);
      socket.broadcast.to(data.room).emit('remove connection', data.id);
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
