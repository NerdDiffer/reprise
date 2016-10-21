import meshConnection from './meshConnection';
import debug from '../utils/debug';

const EventEmitter = require('events').EventEmitter;

let connection;

const emitter = new EventEmitter();

function setup(room) {
  const conn = meshConnection(room);
  conn.onReady(() => {
    connection = conn;
    debug('connection ready');
    emitter.emit('status');
  });

  conn.onMessage(message => {
    emitter.emit('message', message);
  });
}

const manager = {
  setup,

  isConnected: () => !!connection,

  sendMessage: message => {
    connection.send(message);
  },

  onMessage: cb => {
    emitter.on('message', cb);
  },

  offMessage: cb => {
    emitter.removeListener('message', cb);
  },

  onStatusChange: cb => {
    emitter.on('status', cb);
  },

  offStatusChange: cb => {
    emitter.removeListener('status', cb);
  },

  closeConnection: () => {
    connection.close();
  },

  id: () => connection.id()
};

export default manager;
