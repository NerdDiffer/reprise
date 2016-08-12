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
  socket.on('join', room => {
    console.log('joining room', room);
    rooms[room] = rooms[room] || [];
    const numberOfClients = rooms[room].length;
    if (numberOfClients >= 4) {
      socket.emit('full', room);
    } else {
      socket.join(room);
      rooms[room] = rooms[room] || [];
      rooms[room].push(socket.id.slice(2));
      io.to(room).emit('new.peer', rooms[room]);

      socket.on('disconnect', () => {
        const socketsInRoom = rooms[room];
        socketsInRoom.splice(socketsInRoom.indexOf(socket.id.slice(2)), 1);
        console.log('disconnecting', socketsInRoom, socket.id);
        socket.leave(room);
      });
    }
  });

  socket.on('offer', offer => {
    socket.broadcast.emit('offer', offer);
  });

  socket.on('answer', data => {
    socket.broadcast.emit('answer', data);
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
