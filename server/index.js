const express = require('express');
const path = require('path');
const logger = require('morgan');

const app = express();
const server = require('http').Server(app);

/* Middleware */

app.use(logger('dev'));

const pathToStaticDir = path.resolve(__dirname, '..', 'client/public');
app.use(express.static(pathToStaticDir));

/* Sockets */

const io = require('socket.io')(server);

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

app.get('/', (req, res) => {
  res.status(200).send();
});

/* Initialize */

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log('Listening on port', port);
});
